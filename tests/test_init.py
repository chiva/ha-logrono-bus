"""Setup, unload, failures and repair issues."""

from __future__ import annotations

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL
from homeassistant.config_entries import ConfigEntryState, ConfigSubentry
from homeassistant.const import STATE_UNAVAILABLE
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.logrono_bus import async_setup
from custom_components.logrono_bus.const import (
    DOMAIN,
    ISSUE_LINES_REMOVED,
    ISSUE_STOP_REMOVED,
    ISSUE_UPSTREAM_CHANGED,
    SCHEMA_FAILURES_BEFORE_ISSUE,
)

from .conftest import LINES_URL, STOPS_URL, arrivals_url, load, stop_subentry

MINUTES = "sensor.ayuntamiento_101_2_manresa_minutos"


async def _tick(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    freezer.tick(timedelta(seconds=61))
    async_fire_time_changed(hass)
    # Scheduled refreshes run as background tasks.
    await hass.async_block_till_done(wait_background_tasks=True)


def _serve(aioclient_mock: AiohttpClientMocker, **arrivals: object) -> None:
    aioclient_mock.clear_requests()
    aioclient_mock.get(LINES_URL, json=load("lines.json"))
    aioclient_mock.get(STOPS_URL, json=load("stops.json"))
    for stop_id, reply in arrivals.items():
        if isinstance(reply, int):
            aioclient_mock.get(arrivals_url(stop_id.removeprefix("s")), status=reply)
        else:
            aioclient_mock.get(arrivals_url(stop_id.removeprefix("s")), json=reply)


async def test_setup_and_unload(hass: HomeAssistant, loaded_entry: MockConfigEntry) -> None:
    assert loaded_entry.state is ConfigEntryState.LOADED
    assert len(loaded_entry.runtime_data.coordinators) == 1
    assert await hass.config_entries.async_unload(loaded_entry.entry_id)
    assert loaded_entry.state is ConfigEntryState.NOT_LOADED


async def test_not_ready_when_catalogue_unavailable(
    hass: HomeAssistant, config_entry: MockConfigEntry, aioclient_mock: AiohttpClientMocker
) -> None:
    aioclient_mock.get(LINES_URL, status=503)
    aioclient_mock.get(STOPS_URL, status=503)
    config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(config_entry.entry_id)
    assert config_entry.state is ConfigEntryState.SETUP_RETRY


async def test_changed_catalogue_is_reported_in_repairs(
    hass: HomeAssistant,
    config_entry: MockConfigEntry,
    aioclient_mock: AiohttpClientMocker,
    issue_registry: ir.IssueRegistry,
) -> None:
    aioclient_mock.get(LINES_URL, json={"result": "otro formato"})
    aioclient_mock.get(STOPS_URL, json=load("stops.json"))
    config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(config_entry.entry_id)
    assert config_entry.state is ConfigEntryState.SETUP_RETRY
    assert issue_registry.async_get_issue(DOMAIN, ISSUE_UPSTREAM_CHANGED) is not None


async def test_outage_makes_sensors_unavailable_then_recovers(
    hass: HomeAssistant,
    loaded_entry: MockConfigEntry,
    aioclient_mock: AiohttpClientMocker,
    freezer: FrozenDateTimeFactory,
) -> None:
    _serve(aioclient_mock, s101=503)
    await _tick(hass, freezer)
    assert hass.states.get(MINUTES).state == STATE_UNAVAILABLE

    _serve(aioclient_mock, s101=load("arrivals-101.json"))
    await _tick(hass, freezer)
    assert hass.states.get(MINUTES).state == "0"


async def test_upstream_change_raises_and_clears_repair_issue(
    hass: HomeAssistant,
    loaded_entry: MockConfigEntry,
    aioclient_mock: AiohttpClientMocker,
    freezer: FrozenDateTimeFactory,
    issue_registry: ir.IssueRegistry,
) -> None:
    _serve(aioclient_mock, s101={"result": {"llegadas": []}})
    for attempt in range(SCHEMA_FAILURES_BEFORE_ISSUE):
        assert issue_registry.async_get_issue(DOMAIN, ISSUE_UPSTREAM_CHANGED) is None, attempt
        await _tick(hass, freezer)
    issue = issue_registry.async_get_issue(DOMAIN, ISSUE_UPSTREAM_CHANGED)
    assert issue is not None
    assert issue.severity is ir.IssueSeverity.ERROR

    _serve(aioclient_mock, s101=load("arrivals-101.json"))
    await _tick(hass, freezer)
    assert issue_registry.async_get_issue(DOMAIN, ISSUE_UPSTREAM_CHANGED) is None


async def test_upstream_change_issue_stays_while_any_stop_still_fails(
    hass: HomeAssistant,
    config_entry: MockConfigEntry,
    upstream: AiohttpClientMocker,
    freezer: FrozenDateTimeFactory,
    issue_registry: ir.IssueRegistry,
) -> None:
    """The repair issue is shared by every stop: one healthy stop must not hide another's failure."""
    config_entry.add_to_hass(hass)
    hass.config_entries.async_add_subentry(
        config_entry, ConfigSubentry(**stop_subentry("100", "Ayuntamiento (100)", ["10:asc"]))
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    _serve(
        aioclient_mock=upstream, s101={"result": {"llegadas": []}}, s100=load("arrivals-100.json")
    )
    for _ in range(SCHEMA_FAILURES_BEFORE_ISSUE):
        await _tick(hass, freezer)
    assert issue_registry.async_get_issue(DOMAIN, ISSUE_UPSTREAM_CHANGED) is not None
    # Stop 100 keeps refreshing fine; the issue about stop 101 must survive it.
    await _tick(hass, freezer)
    assert issue_registry.async_get_issue(DOMAIN, ISSUE_UPSTREAM_CHANGED) is not None

    _serve(aioclient_mock=upstream, s101=load("arrivals-101.json"), s100=load("arrivals-100.json"))
    await _tick(hass, freezer)
    assert issue_registry.async_get_issue(DOMAIN, ISSUE_UPSTREAM_CHANGED) is None


async def test_vanished_stop_raises_issue(
    hass: HomeAssistant,
    config_entry: MockConfigEntry,
    upstream: AiohttpClientMocker,
    issue_registry: ir.IssueRegistry,
) -> None:
    config_entry.add_to_hass(hass)
    hass.config_entries.async_add_subentry(
        config_entry, ConfigSubentry(**stop_subentry("4242", "Desaparecida (4242)", ["2:desc"]))
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    issue = issue_registry.async_get_issue(DOMAIN, f"{ISSUE_STOP_REMOVED}_4242")
    assert issue is not None
    assert issue.translation_placeholders == {"stop": "Desaparecida (4242)"}
    # The other stop keeps working.
    assert hass.states.get(MINUTES).state == "1"

    # Removing the stop, as the issue asks, clears the issue too.
    vanished = next(
        sid for sid, sub in config_entry.subentries.items() if sub.data["stop_id"] == "4242"
    )
    assert hass.config_entries.async_remove_subentry(config_entry, vanished)
    await hass.async_block_till_done()
    assert issue_registry.async_get_issue(DOMAIN, f"{ISSUE_STOP_REMOVED}_4242") is None


async def test_followed_line_gone_from_the_stop_raises_issue(
    hass: HomeAssistant,
    config_entry: MockConfigEntry,
    upstream: AiohttpClientMocker,
    issue_registry: ir.IssueRegistry,
) -> None:
    """A network change drops line 99 (and line 10 towards Manuel de Falla) from stop 100."""
    config_entry.add_to_hass(hass)
    hass.config_entries.async_add_subentry(
        config_entry,
        ConfigSubentry(
            **stop_subentry("100", "Ayuntamiento (100)", ["10:asc", "10:desc", "99:asc"])
        ),
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    issue = issue_registry.async_get_issue(DOMAIN, f"{ISSUE_LINES_REMOVED}_100")
    assert issue is not None
    assert issue.translation_placeholders == {"stop": "Ayuntamiento (100)", "lines": "10, 99"}
    assert issue_registry.async_get_issue(DOMAIN, f"{ISSUE_LINES_REMOVED}_101") is None

    # Reconfigured to the lines that still pass: the issue goes away.
    stop_100 = next(s for s in config_entry.subentries.values() if s.data["stop_id"] == "100")
    hass.config_entries.async_update_subentry(
        config_entry, stop_100, data={"stop_id": "100", "patterns": ["10:asc"]}
    )
    await hass.async_block_till_done()
    assert issue_registry.async_get_issue(DOMAIN, f"{ISSUE_LINES_REMOVED}_100") is None


async def test_removing_the_integration_clears_its_issues(
    hass: HomeAssistant,
    config_entry: MockConfigEntry,
    upstream: AiohttpClientMocker,
    issue_registry: ir.IssueRegistry,
) -> None:
    config_entry.add_to_hass(hass)
    hass.config_entries.async_add_subentry(
        config_entry, ConfigSubentry(**stop_subentry("4242", "Desaparecida (4242)", ["2:desc"]))
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    assert issue_registry.async_get_issue(DOMAIN, f"{ISSUE_STOP_REMOVED}_4242") is not None

    await hass.config_entries.async_remove(config_entry.entry_id)
    await hass.async_block_till_done()
    assert not [key for key in issue_registry.issues if key[0] == DOMAIN]


async def test_rate_limit_waits_as_long_as_the_upstream_asks(
    hass: HomeAssistant,
    loaded_entry: MockConfigEntry,
    aioclient_mock: AiohttpClientMocker,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A 429 with Retry-After: 150 skips the next two 60 s refreshes instead of hammering."""
    _serve(aioclient_mock)
    aioclient_mock.get(arrivals_url("101"), status=429, headers={"Retry-After": "150"})
    await _tick(hass, freezer)
    assert hass.states.get(MINUTES).state == STATE_UNAVAILABLE

    def arrivals_requests() -> int:
        return sum(1 for call in aioclient_mock.mock_calls if "byStop/101" in str(call[1]))

    asked = arrivals_requests()
    await _tick(hass, freezer)
    await _tick(hass, freezer)
    assert arrivals_requests() == asked
    await _tick(hass, freezer)
    assert arrivals_requests() == asked + 1


async def test_adding_a_stop_reloads_with_its_sensors(
    hass: HomeAssistant, loaded_entry: MockConfigEntry
) -> None:
    hass.config_entries.async_add_subentry(
        loaded_entry, ConfigSubentry(**stop_subentry("100", "Ayuntamiento (100)", ["10:asc"]))
    )
    await hass.async_block_till_done()
    assert hass.states.get("sensor.ayuntamiento_100_10_artesanos_minutos").state == "15"


async def test_dashboard_card_is_served(
    hass: HomeAssistant, loaded_entry: MockConfigEntry, hass_client: ClientSessionGenerator
) -> None:
    client = await hass_client()
    response = await client.get("/logrono_bus/logrono-bus-card.js")
    assert response.status == 200
    assert "logrono-bus-card" in await response.text()


async def test_dashboard_card_is_auto_loaded_when_frontend_runs(hass: HomeAssistant) -> None:
    hass.config.components.add("frontend")
    hass.data[DATA_EXTRA_MODULE_URL] = set()
    assert await async_setup_component(hass, "http", {})
    assert await async_setup(hass, {})
    (url,) = hass.data[DATA_EXTRA_MODULE_URL]
    assert url.startswith("/logrono_bus/logrono-bus-card.js?v=")
