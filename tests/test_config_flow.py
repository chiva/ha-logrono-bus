"""Config flow, stop subentries and options."""

from __future__ import annotations

import dataclasses
from datetime import timedelta
from typing import Any

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import SOURCE_USER, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.logrono_bus.const import (
    CONF_FOLLOWING,
    CONF_PATTERNS,
    CONF_SCAN_INTERVAL,
    CONF_STOP_ID,
    DOMAIN,
    SUBENTRY_STOP,
)


async def test_user_flow_creates_single_entry(
    hass: HomeAssistant, upstream: AiohttpClientMocker
) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Logroño Bus"
    await hass.async_block_till_done()

    again = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert again["type"] is FlowResultType.ABORT
    assert again["reason"] == "single_instance_allowed"


async def _start_stop_flow(hass: HomeAssistant, entry: MockConfigEntry) -> dict:
    return await hass.config_entries.subentries.async_init(
        (entry.entry_id, SUBENTRY_STOP), context={"source": SOURCE_USER}
    )


async def test_add_stop_lists_nearest_first_and_creates_sensors(
    hass: HomeAssistant, loaded_entry: MockConfigEntry, entity_registry: er.EntityRegistry
) -> None:
    result = await _start_stop_flow(hass, loaded_entry)
    assert result["type"] is FlowResultType.FORM
    options = result["data_schema"].schema[CONF_STOP_ID].config["options"]
    # 101 is already followed; its twin across the street is now the nearest.
    assert options[0]["value"] == "100"
    assert options[0]["label"] == (
        "Ayuntamiento (100) · hacia Artesanos, Barrio Ballesteros y Naval · 41 m"
    )
    assert all(option["value"] != "101" for option in options)

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {CONF_STOP_ID: "100"}
    )
    assert result["step_id"] == "lines"
    pattern_labels = [
        o["label"] for o in result["data_schema"].schema[CONF_PATTERNS].config["options"]
    ]
    assert pattern_labels == [
        "2 → Artesanos",
        "5 → Barrio Ballesteros",
        "7 → Naval",
        "10 → Artesanos",
    ]

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {CONF_PATTERNS: []}
    )
    assert result["errors"] == {"base": "no_lines"}

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {CONF_PATTERNS: ["2:asc"]}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Ayuntamiento (100)"
    await hass.async_block_till_done()

    assert hass.states.get("sensor.ayuntamiento_100_2_artesanos_minutos").state == "10"
    stop_entities = [
        e.entity_id
        for e in er.async_entries_for_config_entry(entity_registry, loaded_entry.entry_id)
        if e.unique_id.startswith("100_")
    ]
    assert sorted(stop_entities) == [
        "sensor.ayuntamiento_100_2_artesanos_minutos",
        "sensor.ayuntamiento_100_2_artesanos_proxima_llegada",
    ]


async def test_stop_flow_without_home_location(
    hass: HomeAssistant, loaded_entry: MockConfigEntry
) -> None:
    hass.config.latitude = hass.config.longitude = 0
    result = await _start_stop_flow(hass, loaded_entry)
    labels = [o["label"] for o in result["data_schema"].schema[CONF_STOP_ID].config["options"]]
    assert labels[0] == (
        "Alcalde Emilio Francés (127) · hacia Manresa, Dinamarca, Enrique Granados y Manuel de Falla"
    )
    assert not any(label.endswith(" m") for label in labels)


async def test_stop_flow_aborts_when_service_not_loaded(
    hass: HomeAssistant, config_entry: MockConfigEntry, aioclient_mock: AiohttpClientMocker
) -> None:
    aioclient_mock.get("https://transporteurbano.logrono.es/api/linesDiscovery/lines", status=503)
    aioclient_mock.get("https://transporteurbano.logrono.es/api/linesDiscovery/stops", status=503)
    config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(config_entry.entry_id)
    assert config_entry.state is ConfigEntryState.SETUP_RETRY
    result = await _start_stop_flow(hass, config_entry)
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "not_loaded"


async def test_reconfigure_stop_lines(hass: HomeAssistant, loaded_entry: MockConfigEntry) -> None:
    subentry = next(iter(loaded_entry.subentries.values()))
    result = await loaded_entry.start_subentry_reconfigure_flow(hass, subentry.subentry_id)
    assert result["step_id"] == "reconfigure"
    defaults = result["data_schema"]({})[CONF_PATTERNS]
    assert defaults == ["2:desc", "10:desc"]

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {CONF_PATTERNS: []}
    )
    assert result["errors"] == {"base": "no_lines"}

    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {CONF_PATTERNS: ["5:asc"]}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"
    await hass.async_block_till_done()
    assert hass.states.get("sensor.ayuntamiento_101_5_dinamarca_minutos").state == "6"
    assert loaded_entry.subentries[subentry.subentry_id].data[CONF_PATTERNS] == ["5:asc"]


async def test_reconfigure_drops_directions_that_no_longer_stop_here(
    hass: HomeAssistant, loaded_entry: MockConfigEntry
) -> None:
    """After a network change, a followed direction may still exist but skip this stop."""
    subentry = next(iter(loaded_entry.subentries.values()))
    catalog = loaded_entry.runtime_data.catalog
    elsewhere = next(p.id for p in catalog.patterns if "101" not in p.stop_ids)
    hass.config_entries.async_update_subentry(
        loaded_entry, subentry, data={**subentry.data, CONF_PATTERNS: ["2:desc", elsewhere]}
    )
    await hass.async_block_till_done()

    result = await loaded_entry.start_subentry_reconfigure_flow(hass, subentry.subentry_id)
    assert result["data_schema"]({})[CONF_PATTERNS] == ["2:desc"]


async def test_route_change_found_by_a_refresh_reaches_reconfigure(
    hass: HomeAssistant,
    loaded_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
    issue_registry: ir.IssueRegistry,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Line 10 towards Manuel de Falla now ends at stop 101: nobody can board it there."""
    provider = loaded_entry.runtime_data.provider
    catalog = await provider.get_catalog()
    line_10 = catalog.pattern("10:desc")
    assert line_10 is not None
    cut = line_10.stop_ids[: line_10.stop_ids.index("101") + 1]
    changed = dataclasses.replace(
        catalog,
        patterns=tuple(
            dataclasses.replace(p, stop_ids=cut) if p.id == "10:desc" else p
            for p in catalog.patterns
        ),
    )

    async def refreshed_catalog(**_: Any) -> Any:
        return changed

    monkeypatch.setattr(provider, "get_catalog", refreshed_catalog)
    freezer.tick(timedelta(seconds=61))
    async_fire_time_changed(hass)
    await hass.async_block_till_done(wait_background_tasks=True)

    issue = issue_registry.async_get_issue(DOMAIN, "lines_removed_101")
    assert issue is not None
    assert issue.translation_placeholders["lines"] == "10"
    subentry = next(iter(loaded_entry.subentries.values()))
    result = await loaded_entry.start_subentry_reconfigure_flow(hass, subentry.subentry_id)
    assert result["data_schema"]({})[CONF_PATTERNS] == ["2:desc"]


async def test_options_flow(hass: HomeAssistant, loaded_entry: MockConfigEntry) -> None:
    result = await hass.config_entries.options.async_init(loaded_entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_SCAN_INTERVAL: 120.0, CONF_FOLLOWING: 2.0}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert loaded_entry.options == {CONF_SCAN_INTERVAL: 120, CONF_FOLLOWING: 2}
    coordinator = next(iter(loaded_entry.runtime_data.coordinators.values()))
    assert coordinator.update_interval.total_seconds() == 120
