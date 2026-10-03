"""Diagnostics payload."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.diagnostics import (
    get_diagnostics_for_config_entry,
)
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator
from syrupy.assertion import SnapshotAssertion


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
