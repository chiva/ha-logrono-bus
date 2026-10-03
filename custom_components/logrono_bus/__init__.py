"""Logroño Bus: real-time arrival estimates for Logroño's urban buses.

One config entry for the service, one config subentry per followed stop. Each stop gets a
coordinator (one upstream request per refresh, all its lines) and sensors per followed line and
direction. Data comes from the `logrono-bus` library (https://github.com/chiva/logrono-bus).
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http.server import StaticPathConfig
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

from logrono_bus import LogronoBusProvider, UpstreamError

from .const import CARD_FILENAME, CARD_URL, DOMAIN, SUBENTRY_STOP
from .coordinator import StopArrivalsCoordinator
from .models import LogronoBusConfigEntry, LogronoBusData

PLATFORMS: list[Platform] = [Platform.SENSOR]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)
CARD_PATH = Path(__file__).parent / "frontend" / CARD_FILENAME


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the dashboard card and load it in every dashboard: no manual resource to add."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(CARD_PATH), cache_headers=True)]
    )
    if "frontend" in hass.config.components:
        digest = await hass.async_add_executor_job(_card_digest)
        # The content hash in the query makes browsers fetch a new card after each update.
        add_extra_js_url(hass, f"{CARD_URL}?v={digest}")
    else:
        _LOGGER.debug("Frontend not loaded; the dashboard card is served but not auto-loaded")
    return True


def _card_digest() -> str:
    return hashlib.sha256(CARD_PATH.read_bytes()).hexdigest()[:12]


async def async_setup_entry(hass: HomeAssistant, entry: LogronoBusConfigEntry) -> bool:
    provider = LogronoBusProvider(async_get_clientsession(hass))
    try:
        catalog = await provider.get_catalog()
    except UpstreamError as err:
        raise ConfigEntryNotReady(
            translation_domain=DOMAIN,
            translation_key="catalog_unavailable",
            translation_placeholders={"detail": str(err)},
        ) from err

    data = LogronoBusData(provider=provider, catalog=catalog)
    entry.runtime_data = data
    for subentry_id, subentry in entry.subentries.items():
        if subentry.subentry_type != SUBENTRY_STOP:
            continue
        coordinator = StopArrivalsCoordinator(hass, entry, subentry)
        # Not async_config_entry_first_refresh: one stop failing must not block the others, and
        # its sensors simply show as unavailable until the next successful refresh.
        await coordinator.async_refresh()
        data.coordinators[subentry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    # Stops added, reconfigured or removed, and option changes, all rebuild the entry.
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: LogronoBusConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def _async_reload(hass: HomeAssistant, entry: LogronoBusConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)
