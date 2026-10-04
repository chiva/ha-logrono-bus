"""Diagnostics payload."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.diagnostics import (
    get_diagnostics_for_config_entry,
)
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator
from syrupy.assertion import SnapshotAssertion

from .conftest import LINES_URL, STOPS_URL


async def test_diagnostics(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    loaded_entry: MockConfigEntry,
    snapshot: SnapshotAssertion,
) -> None:
    diagnostics = await get_diagnostics_for_config_entry(hass, hass_client, loaded_entry)
    assert diagnostics == snapshot
    stop = diagnostics["stops"]["Ayuntamiento (101)"]
    assert stop["last_update_success"] is True
    assert stop["subentry"] == {"stop_id": "101", "patterns": ["2:desc", "10:desc"]}


async def test_diagnostics_while_setup_retries(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    config_entry: MockConfigEntry,
    aioclient_mock: AiohttpClientMocker,
) -> None:
    """The catalogue is unreachable: diagnostics still say which stops and why it failed."""
    aioclient_mock.get(LINES_URL, status=503)
    aioclient_mock.get(STOPS_URL, status=503)
    config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(config_entry.entry_id)
    assert config_entry.state is ConfigEntryState.SETUP_RETRY

    diagnostics = await get_diagnostics_for_config_entry(hass, hass_client, config_entry)
    assert diagnostics["state"] == "setup_retry"
    assert "503" in diagnostics["reason"]
    assert diagnostics["stops"] == {
        "Ayuntamiento (101)": {"stop_id": "101", "patterns": ["2:desc", "10:desc"]}
    }
