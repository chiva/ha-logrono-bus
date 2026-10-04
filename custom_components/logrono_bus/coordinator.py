"""One coordinator per followed stop: a single upstream request returns every line at the stop."""

from __future__ import annotations

import asyncio
import logging
from datetime import timedelta

from homeassistant.config_entries import ConfigSubentry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from logrono_bus import (
    DIRECTIONS,
    Card,
    Catalog,
    LineSelection,
    LineTimetable,
    LogronoBusError,
    RateLimited,
    StopArrivals,
    StopNotFound,
    StopSelection,
    UpstreamSchemaError,
    UpstreamUnavailable,
    build_cards,
)

from .const import (
    CONF_FOLLOWING,
    CONF_PATTERNS,
    CONF_SCAN_INTERVAL,
    CONF_STOP_ID,
    DEFAULT_FOLLOWING,
    DEFAULT_SCAN_INTERVAL_S,
    DOMAIN,
    ISSUE_LINES_REMOVED,
    ISSUE_STOP_REMOVED,
    ISSUE_UPSTREAM_CHANGED,
    SCHEMA_FAILURES_BEFORE_ISSUE,
)
from .models import LogronoBusConfigEntry

_LOGGER = logging.getLogger(__name__)


LEARN_MORE_URL = "https://chiva.github.io/logrono-bus/guia/07-home-assistant/#si-algo-falla"


def create_repair_issue(
    hass: HomeAssistant, issue_id: str, kind: str, *, stop: str = "", lines: str = ""
) -> None:
    """An error in Repairs, until the condition clears."""
    ir.async_create_issue(
        hass,
        DOMAIN,
        issue_id,
        is_fixable=False,
        severity=ir.IssueSeverity.ERROR,
        translation_key=kind,
        translation_placeholders={"stop": stop} | ({"lines": lines} if lines else {}),
        learn_more_url=LEARN_MORE_URL,
    )


def line_selection(pattern_id: str) -> LineSelection:
    """`"2:desc"` → line 2, direction desc. An unknown direction means "either"."""
    line_id, _, direction = pattern_id.partition(":")
    return LineSelection(
        line_id=line_id,
        direction=direction if direction in DIRECTIONS else None,
    )


def selection_for(subentry: ConfigSubentry) -> StopSelection:
    """The stop and the line directions this subentry follows."""
    return StopSelection(
        stop_id=subentry.data[CONF_STOP_ID],
        lines=tuple(line_selection(p) for p in subentry.data[CONF_PATTERNS]),
    )


class StopArrivalsCoordinator(DataUpdateCoordinator[list[Card]]):
    """Arrivals for one stop, grouped into one card per followed line and direction."""

    config_entry: LogronoBusConfigEntry

    def __init__(
        self, hass: HomeAssistant, entry: LogronoBusConfigEntry, subentry: ConfigSubentry
    ) -> None:
        interval = entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL_S)
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN} {subentry.title}",
            update_interval=timedelta(seconds=interval),
            always_update=False,
        )
        self.subentry = subentry
        self.selection = selection_for(subentry)
        self.following = int(entry.options.get(CONF_FOLLOWING, DEFAULT_FOLLOWING))
        self.last_arrivals: StopArrivals | None = None
        self.timetables: dict[str, LineTimetable] = {}
        """Today's timetable of each followed line, to tell "not started" from "finished"."""
        self._schema_failures = 0

    async def _async_update_data(self) -> list[Card]:
        provider = self.config_entry.runtime_data.provider
        try:
            catalog = await provider.get_catalog()
            arrivals = await provider.get_arrivals(self.selection.stop_id)
        except StopNotFound as err:
            self._raise_issue(ISSUE_STOP_REMOVED)
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="stop_removed",
                translation_placeholders={"stop": self.subentry.title},
            ) from err
        except UpstreamSchemaError as err:
            self._schema_failures += 1
            if self.upstream_changed:
                self._raise_issue(ISSUE_UPSTREAM_CHANGED)
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="upstream_changed",
                translation_placeholders={"detail": str(err)},
            ) from err
        except RateLimited as err:
            # Wait as long as the upstream asked, not just until the next scheduled refresh.
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="upstream_unavailable",
                translation_placeholders={"detail": str(err)},
                retry_after=err.retry_after,
            ) from err
        except UpstreamUnavailable as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="upstream_unavailable",
                translation_placeholders={"detail": str(err)},
            ) from err
        self._schema_failures = 0
        self.config_entry.runtime_data.catalog = catalog
        # The "API changed" issue is shared by every stop: it stays while any of them still fails.
        coordinators = self.config_entry.runtime_data.coordinators.values()
        if not any(coordinator.upstream_changed for coordinator in coordinators):
            ir.async_delete_issue(self.hass, DOMAIN, ISSUE_UPSTREAM_CHANGED)
        ir.async_delete_issue(self.hass, DOMAIN, self._issue_id(ISSUE_STOP_REMOVED))
        if gone := self._lines_gone(catalog):
            self._raise_issue(ISSUE_LINES_REMOVED, lines=", ".join(gone))
        else:
            ir.async_delete_issue(self.hass, DOMAIN, self._issue_id(ISSUE_LINES_REMOVED))
        self.last_arrivals = arrivals
        await self._refresh_timetables()
        return build_cards(catalog, self.selection, arrivals, limit=self.following)

    async def _refresh_timetables(self) -> None:
        """The library fetches each line's timetable once per day and shares it between stops.

        A failure only leaves the timetable attributes as they were: it never makes the sensors
        unavailable.
        """
        provider = self.config_entry.runtime_data.provider
        line_ids = list(dict.fromkeys(line.line_id for line in self.selection.lines))
        # All lines at once, so a slow timetable endpoint delays the arrivals by one request.
        results = await asyncio.gather(
            *(provider.get_timetable(line_id) for line_id in line_ids), return_exceptions=True
        )
        for line_id, result in zip(line_ids, results, strict=True):
            if isinstance(result, LineTimetable):
                self.timetables[line_id] = result
            elif isinstance(result, LogronoBusError):  # unreachable, changed, or the line is gone
                _LOGGER.debug("Horario de la línea %s no disponible: %s", line_id, result)
            else:
                raise result

    @property
    def upstream_changed(self) -> bool:
        """This stop's answers have failed to parse often enough to report an API change."""
        return self._schema_failures >= SCHEMA_FAILURES_BEFORE_ISSUE

    def _issue_id(self, kind: str) -> str:
        return kind if kind == ISSUE_UPSTREAM_CHANGED else f"{kind}_{self.selection.stop_id}"

    def _raise_issue(self, kind: str, *, lines: str = "") -> None:
        create_repair_issue(
            self.hass, self._issue_id(kind), kind, stop=self.subentry.title, lines=lines
        )

    def _lines_gone(self, catalog: Catalog) -> list[str]:
        """Followed lines (or directions) that no longer serve this stop: their sensors would
        stay empty without any error."""
        stop_id = self.selection.stop_id
        # A direction that now ends here cannot be boarded either (nor chosen in reconfigure).
        served = [p for p in catalog.patterns_at(stop_id) if not p.is_terminus(stop_id)]
        gone = [
            line.line_id
            for line in self.selection.lines
            if not any(
                pattern.line_id == line.line_id and line.direction in (None, pattern.direction)
                for pattern in served
            )
        ]
        return list(dict.fromkeys(gone))
