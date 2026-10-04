"""Config flow: the service entry, one subentry per stop, and refresh options."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigEntryState,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryFlow,
    OptionsFlow,
    SubentryFlowResult,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)

from logrono_bus import Catalog, Pattern, Stop
from logrono_bus.geo import distance_m

from .const import (
    CONF_FOLLOWING,
    CONF_PATTERNS,
    CONF_SCAN_INTERVAL,
    CONF_STOP_ID,
    DEFAULT_FOLLOWING,
    DEFAULT_SCAN_INTERVAL_S,
    DOMAIN,
    MAX_FOLLOWING,
    MAX_SCAN_INTERVAL_S,
    MIN_SCAN_INTERVAL_S,
    SUBENTRY_STOP,
)
from .models import LogronoBusConfigEntry

TITLE = "Logroño Bus"


def boardable_patterns(catalog: Catalog, stop_id: str) -> list[Pattern]:
    """Directions a rider can board at the stop (trips that end there are left out)."""
    return [p for p in catalog.patterns_at(stop_id) if not p.is_terminus(stop_id)]


def destinations(catalog: Catalog, stop_id: str) -> str:
    """ "hacia Manresa, Dinamarca y Manuel de Falla": tells same-named stops apart."""
    headsigns = list(dict.fromkeys(p.headsign for p in boardable_patterns(catalog, stop_id)))
    if not headsigns:
        return "final de trayecto"
    if len(headsigns) == 1:
        return f"hacia {headsigns[0]}"
    return f"hacia {', '.join(headsigns[:-1])} y {headsigns[-1]}"


def stop_title(stop: Stop) -> str:
    return f"{stop.name} ({stop.id})"


def stop_options(
    catalog: Catalog, home: tuple[float, float] | None, exclude: set[str]
) -> list[SelectOptionDict]:
    """Every stop with boardable lines, nearest to home first when home is known."""
    stops = [s for s in catalog.stops if s.id not in exclude and boardable_patterns(catalog, s.id)]

    def distance(stop: Stop) -> float:
        return distance_m(home[0], home[1], stop.lat, stop.lon) if home else 0.0

    stops.sort(key=lambda stop: (distance(stop), stop.name, stop.id))
    options = []
    for stop in stops:
        label = f"{stop_title(stop)} · {destinations(catalog, stop.id)}"
        if home:
            label += f" · {round(distance(stop))} m"
        options.append(SelectOptionDict(value=stop.id, label=label))
    return options


def pattern_options(catalog: Catalog, stop_id: str) -> list[SelectOptionDict]:
    return [
        SelectOptionDict(
            value=pattern.id, label=f"{catalog.line(pattern.line_id).label} → {pattern.headsign}"
        )
        for pattern in boardable_patterns(catalog, stop_id)
    ]


def patterns_schema(catalog: Catalog, stop_id: str, default: list[str]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_PATTERNS, default=default): SelectSelector(
                SelectSelectorConfig(
                    options=pattern_options(catalog, stop_id),
                    multiple=True,
                    mode=SelectSelectorMode.LIST,
                )
            )
        }
    )


class LogronoBusConfigFlow(ConfigFlow, domain=DOMAIN):
    """The service itself has nothing to configure; stops are added as subentries."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title=TITLE, data={})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> LogronoBusOptionsFlow:
        return LogronoBusOptionsFlow()

    @classmethod
    @callback
    def async_get_supported_subentry_types(
        cls, config_entry: ConfigEntry
    ) -> dict[str, type[ConfigSubentryFlow]]:
        return {SUBENTRY_STOP: StopSubentryFlow}


class StopSubentryFlow(ConfigSubentryFlow):
    """Add a stop (search ordered by distance to home), then pick its lines and directions."""

    _stop_id: str

    def _catalog(self) -> Catalog | None:
        """The loaded entry's catalogue; None while the service entry is not loaded."""
        entry: LogronoBusConfigEntry = self._get_entry()
        return entry.runtime_data.catalog if entry.state is ConfigEntryState.LOADED else None

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        catalog = self._catalog()
        if catalog is None:
            return self.async_abort(reason="not_loaded")
        if user_input is not None:
            self._stop_id = user_input[CONF_STOP_ID]
            return await self.async_step_lines()
        home = (
            (self.hass.config.latitude, self.hass.config.longitude)
            if self.hass.config.latitude or self.hass.config.longitude
            else None
        )
        followed = {s.data[CONF_STOP_ID] for s in self._get_entry().subentries.values()}
        schema = vol.Schema(
            {
                vol.Required(CONF_STOP_ID): SelectSelector(
                    SelectSelectorConfig(
                        options=stop_options(catalog, home, followed),
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                )
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema)

    async def async_step_lines(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        catalog = self._catalog()
        if catalog is None:
            return self.async_abort(reason="not_loaded")
        stop = catalog.stop(self._stop_id)
        errors: dict[str, str] = {}
        if user_input is not None:
            if user_input[CONF_PATTERNS]:
                return self.async_create_entry(
                    title=stop_title(stop),
                    data={CONF_STOP_ID: stop.id, CONF_PATTERNS: user_input[CONF_PATTERNS]},
                    unique_id=stop.id,
                )
            errors["base"] = "no_lines"
        default = [p.id for p in boardable_patterns(catalog, stop.id)]
        return self.async_show_form(
            step_id="lines",
            data_schema=patterns_schema(catalog, stop.id, default),
            description_placeholders={"stop": stop_title(stop)},
            errors=errors,
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        catalog = self._catalog()
        if catalog is None:
            return self.async_abort(reason="not_loaded")
        subentry = self._get_reconfigure_subentry()
        stop_id = subentry.data[CONF_STOP_ID]
        errors: dict[str, str] = {}
        if user_input is not None:
            if user_input[CONF_PATTERNS]:
                return self.async_update_and_abort(
                    self._get_entry(),
                    subentry,
                    data_updates={CONF_PATTERNS: user_input[CONF_PATTERNS]},
                )
            errors["base"] = "no_lines"
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=patterns_schema(
                catalog,
                stop_id,
                # Directions that no longer stop here (network changes) cannot stay selected: the
                # selector would reject them, and they are what the "lines removed" issue reports.
                [
                    pattern_id
                    for pattern_id in subentry.data[CONF_PATTERNS]
                    if pattern_id in {p.id for p in boardable_patterns(catalog, stop_id)}
                ],
            ),
            description_placeholders={"stop": subentry.title},
            errors=errors,
        )


class LogronoBusOptionsFlow(OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                data={
                    CONF_SCAN_INTERVAL: int(user_input[CONF_SCAN_INTERVAL]),
                    CONF_FOLLOWING: int(user_input[CONF_FOLLOWING]),
                }
            )
        options = self.config_entry.options
        schema = vol.Schema(
            {
                vol.Required(
                    CONF_SCAN_INTERVAL,
                    default=options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL_S),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=MIN_SCAN_INTERVAL_S,
                        max=MAX_SCAN_INTERVAL_S,
                        step=10,
                        unit_of_measurement="s",
                        mode=NumberSelectorMode.SLIDER,
                    )
                ),
                vol.Required(
                    CONF_FOLLOWING, default=options.get(CONF_FOLLOWING, DEFAULT_FOLLOWING)
                ): NumberSelector(
                    NumberSelectorConfig(min=1, max=MAX_FOLLOWING, mode=NumberSelectorMode.BOX)
                ),
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
