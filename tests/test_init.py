"""Setup / unload and sensor behaviour with a fully mocked API.

Real public example: line 10 boarded at Ayuntamiento (town hall), heading toward
Hospital San Pedro.
"""

import json
import pathlib
from datetime import timedelta
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.logrono_bus.api import Arrival, parse_timetable, parse_vehicles
from custom_components.logrono_bus.const import (
    CONF_DIRECTION,
    CONF_DIRECTION_LABEL,
    CONF_LINE_COLOR,
    CONF_LINE_ID,
    CONF_LINE_NAME,
    CONF_STOP_ID,
    CONF_STOP_LAT,
    CONF_STOP_LNG,
    CONF_STOP_NAME,
    DOMAIN,
)

FIXTURES = pathlib.Path(__file__).parent / "fixtures"


def _load(name):
    return json.loads((FIXTURES / name).read_text())


ENTRY_DATA = {
    CONF_LINE_ID: 10,
    CONF_LINE_NAME: "10",
    CONF_LINE_COLOR: "rgba(21,120,190,1)",
    CONF_DIRECTION: "asc",
    CONF_DIRECTION_LABEL: "Manuel de Falla → Artesanos",
    CONF_STOP_ID: 100,
    CONF_STOP_NAME: "Ayuntamiento",
    CONF_STOP_LAT: 42.465222,
    CONF_STOP_LNG: -2.438669,
}


def _mock_api(future):
    arrivals = [
        Arrival(
            line="10",
            stop_ref="000100",
            expected=future,
            aimed=future,
            delay_seconds=17,
            inaccurate=False,
        )
    ]
    return patch.multiple(
        "custom_components.logrono_bus.api.LogronoApi",
        async_get_lines=AsyncMock(return_value=_load("lines_mini.json")),
        async_get_arrivals=AsyncMock(return_value=arrivals),
        async_get_vehicles=AsyncMock(return_value=parse_vehicles(_load("vehicles_byLine.json"))),
        async_get_timetable=AsyncMock(return_value=parse_timetable(_load("timetable_byLine.json"))),
    )


async def test_setup_creates_sensor_and_unloads(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="10_asc_100",
        title="L10 · Ayuntamiento → Artesanos",
        data=ENTRY_DATA,
    )
    entry.add_to_hass(hass)

    future = (dt_util.now() + timedelta(minutes=5)).replace(microsecond=0)
    with _mock_api(future):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    ent_reg = er.async_get(hass)
    entity_id = ent_reg.async_get_entity_id("sensor", DOMAIN, f"{entry.entry_id}_next_bus")
    assert entity_id is not None

    state = hass.states.get(entity_id)
    assert state is not None
    assert dt_util.parse_datetime(state.state) == future
    assert state.attributes["line"] == "10"
    assert state.attributes["interval_minutes"] == 15
    assert state.attributes["first_pass"] == "07:00"
    assert state.attributes["minutes"] == 5
    assert state.attributes["stop"] == "Ayuntamiento"
    # geometry (asc line 10 has 30 stops) + live vehicles are surfaced for the map card
    assert len(state.attributes["line_stops"]) == 30
    assert len(state.attributes["vehicles"]) == 1

    # A bus device tracker was created from the (single valid) live vehicle.
    tracker_id = ent_reg.async_get_entity_id("device_tracker", DOMAIN, f"{DOMAIN}_bus_10_0609")
    assert tracker_id is not None

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    # After unload the entity is torn down (HA leaves a restored "unavailable"
    # placeholder in the registry rather than deleting the state outright).
    unloaded = hass.states.get(entity_id)
    assert unloaded is None or unloaded.state == "unavailable"


async def test_no_estimation_sets_unknown(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id="10_asc_100", title="L10 · Ayuntamiento", data=ENTRY_DATA
    )
    entry.add_to_hass(hass)

    with patch.multiple(
        "custom_components.logrono_bus.api.LogronoApi",
        async_get_lines=AsyncMock(return_value=_load("lines_mini.json")),
        async_get_arrivals=AsyncMock(return_value=[]),  # no bus in window
        async_get_vehicles=AsyncMock(return_value=[]),
        async_get_timetable=AsyncMock(return_value=parse_timetable(_load("timetable_byLine.json"))),
    ):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    ent_reg = er.async_get(hass)
    entity_id = ent_reg.async_get_entity_id("sensor", DOMAIN, f"{entry.entry_id}_next_bus")
    state = hass.states.get(entity_id)
    assert state.state == "unknown"
    assert state.attributes["minutes"] is None
    # timetable details still present even with no live arrival
    assert state.attributes["last_pass"] == "22:45"
