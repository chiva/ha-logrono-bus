"""The Logroño Bus integration."""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import LogronoApi, LogronoApiError
from .const import (
    CONF_DIRECTION,
    CONF_LINE_ID,
    CONF_SCAN_INTERVAL,
    CONF_STOP_ID,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    PLATFORMS,
)
from .coordinator import ArrivalsCoordinator, LineCoordinator
from .network import find_line, line_geometry

_LOGGER = logging.getLogger(__name__)


@dataclass
class DomainData:
    """Shared, integration-wide state."""

    api: LogronoApi
    lines: list[dict]
    line_coordinators: dict[int, LineCoordinator] = field(default_factory=dict)
    line_refcount: dict[int, int] = field(default_factory=dict)
    # bus tracker unique_id -> owning entry_id (dedupe across entries on a line)
    tracked_vehicles: dict[str, str] = field(default_factory=dict)


@dataclass
class EntryData:
    """Per-config-entry runtime data."""

    arrivals: ArrivalsCoordinator
    line: LineCoordinator
    geometry: list[list[float]]
    # Flipped at the start of unload so the device_tracker listener stops
    # adding entities to a platform that is being torn down.
    unloading: bool = False


def _release_line(shared: DomainData, line_id: int) -> None:
    """Drop one reference to a line coordinator, disposing it at zero."""
    shared.line_refcount[line_id] = shared.line_refcount.get(line_id, 1) - 1
    if shared.line_refcount[line_id] <= 0:
        shared.line_refcount.pop(line_id, None)
        shared.line_coordinators.pop(line_id, None)


async def _async_get_domain_data(hass: HomeAssistant) -> DomainData:
    """Create (once) the shared API client and load the static network file."""
    domain: dict = hass.data.setdefault(DOMAIN, {})
    if "shared" not in domain:
        session = async_get_clientsession(hass)
        api = LogronoApi(session)
        try:
            lines = await api.async_get_lines()
        except LogronoApiError as err:
            # Transient upstream outage (their API 503s occasionally): let HA
            # retry setup instead of parking the entry in an error state.
            raise ConfigEntryNotReady(str(err)) from err
        domain["shared"] = DomainData(api=api, lines=lines)
    return domain["shared"]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Logroño Bus from a config entry."""
    shared = await _async_get_domain_data(hass)

    line_id = int(entry.data[CONF_LINE_ID])
    stop_id = int(entry.data[CONF_STOP_ID])
    direction = entry.data[CONF_DIRECTION]
    scan = entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)

    arrivals = ArrivalsCoordinator(hass, shared.api, stop_id, line_id, timedelta(seconds=scan))
    await arrivals.async_config_entry_first_refresh()

    # Reuse the line coordinator across entries that share a line.
    line_coord = shared.line_coordinators.get(line_id)
    if line_coord is None:
        line_coord = LineCoordinator(hass, shared.api, line_id)
        await line_coord.async_config_entry_first_refresh()
        shared.line_coordinators[line_id] = line_coord
    shared.line_refcount[line_id] = shared.line_refcount.get(line_id, 0) + 1

    line = find_line(shared.lines, line_id)
    geometry = line_geometry(line, direction) if line else []

    hass.data[DOMAIN][entry.entry_id] = EntryData(
        arrivals=arrivals, line=line_coord, geometry=geometry
    )

    try:
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except Exception:
        # Roll back the refcount/entry state so a retry starts from a clean slate.
        hass.data[DOMAIN].pop(entry.entry_id, None)
        _release_line(shared, line_id)
        raise

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload when options (e.g. scan interval) change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Signal the device_tracker listener to stop adding entities while the
    # platform tears down (the coordinator may still tick during the await).
    data = hass.data[DOMAIN].get(entry.entry_id)
    if isinstance(data, EntryData):
        data.unloading = True

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if not unload_ok:
        if isinstance(data, EntryData):
            data.unloading = False  # unload aborted; keep the entry live
        return False

    shared: DomainData = hass.data[DOMAIN]["shared"]
    hass.data[DOMAIN].pop(entry.entry_id, None)

    # Release any bus trackers this entry owned so a reload can recreate them.
    for uid, owner in list(shared.tracked_vehicles.items()):
        if owner == entry.entry_id:
            del shared.tracked_vehicles[uid]

    _release_line(shared, int(entry.data[CONF_LINE_ID]))

    # Intentionally keep the shared DomainData (API client + cached lines.json)
    # in hass.data even when no entries remain: a reload (e.g. options change)
    # unloads then sets up again, and re-fetching lines.json there would expose
    # an innocuous change to a transient upstream 503. It's tiny and refreshes on
    # HA restart.
    return unload_ok
