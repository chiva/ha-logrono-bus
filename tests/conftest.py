"""Fixtures: the upstream API served from recorded responses, time frozen at recording.

The fixtures are copies of `contracts/fixtures/upstream` in chiva/logrono-bus (recorded on
2026-10-03 at 18:00:45 Europe/Madrid around the Ayuntamiento).
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest
from homeassistant.config_entries import ConfigSubentryData
from homeassistant.core import HomeAssistant
from logrono_bus.providers.logrono.client import DEFAULT_BASE_URL
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.logrono_bus.const import CONF_PATTERNS, CONF_STOP_ID, DOMAIN, SUBENTRY_STOP

FIXTURES = Path(__file__).parent / "fixtures"
RECORDED_AT = "2026-10-03T16:00:45+00:00"
AYUNTAMIENTO = (42.4655, -2.4390)
LINES_URL = f"{DEFAULT_BASE_URL}linesDiscovery/lines"
STOPS_URL = f"{DEFAULT_BASE_URL}linesDiscovery/stops"


def arrivals_url(stop_id: str) -> str:
    return f"{DEFAULT_BASE_URL}estimatedTimetable/byStop/{stop_id}"


NO_SERVICE_TIMETABLE = {"result": {"frequenciesByDirection": {}, "passesByDirection": {}}}
"""What the upstream answers for a line with no service today."""


def timetable_url(line_id: str) -> str:
    return f"{DEFAULT_BASE_URL}productionTimetable/byLine/{line_id}"


def load(name: str) -> Any:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let Home Assistant load custom_components/ in every test."""


@pytest.fixture(autouse=True)
def frozen_time(freezer: Any) -> None:
    freezer.move_to(RECORDED_AT)


@pytest.fixture
def upstream(aioclient_mock: AiohttpClientMocker) -> AiohttpClientMocker:
    """The Ayuntamiento's API answering with the recorded responses."""
    aioclient_mock.get(LINES_URL, json=load("lines.json"))
    aioclient_mock.get(STOPS_URL, json=load("stops.json"))
    aioclient_mock.get(arrivals_url("101"), json=load("arrivals-101.json"))
    aioclient_mock.get(arrivals_url("100"), json=load("arrivals-100.json"))
    aioclient_mock.get(timetable_url("2"), json=load("timetable-2.json"))
    aioclient_mock.get(timetable_url("10"), json=load("timetable-10.json"))
    for line_id in ("5", "7"):
        aioclient_mock.get(timetable_url(line_id), json=NO_SERVICE_TIMETABLE)
    return aioclient_mock


def stop_subentry(stop_id: str, title: str, patterns: list[str]) -> ConfigSubentryData:
    return ConfigSubentryData(
        data={CONF_STOP_ID: stop_id, CONF_PATTERNS: patterns},
        subentry_type=SUBENTRY_STOP,
        title=title,
        unique_id=stop_id,
    )


@pytest.fixture
def config_entry() -> MockConfigEntry:
    """The service entry following stop 101 (lines 2 and 10 towards the centre's west side)."""
    return MockConfigEntry(
        domain=DOMAIN,
        title="Logroño Bus",
        data={},
        subentries_data=[stop_subentry("101", "Ayuntamiento (101)", ["2:desc", "10:desc"])],
    )


@pytest.fixture
async def loaded_entry(
    hass: HomeAssistant, config_entry: MockConfigEntry, upstream: AiohttpClientMocker
) -> MockConfigEntry:
    hass.config.latitude, hass.config.longitude = AYUNTAMIENTO
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    return config_entry
