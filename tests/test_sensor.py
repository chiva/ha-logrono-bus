"""Sensor states and attributes against the recorded Ayuntamiento arrivals."""

from __future__ import annotations

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigSubentry
from homeassistant.const import STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from syrupy.assertion import SnapshotAssertion

from custom_components.logrono_bus.const import DOMAIN

from .conftest import LINES_URL, STOPS_URL, arrivals_url, load, stop_subentry, timetable_url


async def test_sensors_snapshot(
    hass: HomeAssistant,
    loaded_entry: MockConfigEntry,
    entity_registry: er.EntityRegistry,
    snapshot: SnapshotAssertion,
) -> None:
    entries = sorted(
        er.async_entries_for_config_entry(entity_registry, loaded_entry.entry_id),
        key=lambda e: e.entity_id,
    )
    assert [e.entity_id for e in entries] == [
        "sensor.ayuntamiento_101_10_manuel_de_falla_minutos",
        "sensor.ayuntamiento_101_10_manuel_de_falla_proxima_llegada",
        "sensor.ayuntamiento_101_2_manresa_minutos",
        "sensor.ayuntamiento_101_2_manresa_proxima_llegada",
    ]
    for entry in entries:
        assert hass.states.get(entry.entity_id) == snapshot(name=entry.entity_id)


async def test_minutes_and_next_arrival(hass: HomeAssistant, loaded_entry: MockConfigEntry) -> None:
    minutes = hass.states.get("sensor.ayuntamiento_101_2_manresa_minutos")
    assert minutes.state == "1"
    assert minutes.attributes["unit_of_measurement"] == "min"
    assert minutes.attributes["siguientes"] == [7]
    assert minutes.attributes["destino"] == "Manresa"
    assert minutes.attributes["color"] == "#FFFF00"
    assert minutes.attributes["color_texto"] == "#000000"
    assert minutes.attributes["linea"] == "2"
    assert minutes.attributes["tiempo_real"] is True
    assert minutes.attributes["parada_id"] == "101"
    assert minutes.attributes["parada"] == "Ayuntamiento"
    assert minutes.attributes["linea_id"] == "2"
    assert minutes.attributes["nombre_linea"] == "Yagüe – Varea"
    assert minutes.attributes["sentido"] == "desc"
    assert minutes.attributes["llegadas"] == [
        {"hora": "2026-10-03T18:02:28+02:00", "tiempo_real": True},
        {"hora": "2026-10-03T18:08:02+02:00", "tiempo_real": True},
    ]
    next_arrival = hass.states.get("sensor.ayuntamiento_101_2_manresa_proxima_llegada")
    assert next_arrival.state == "2026-10-03T16:02:28+00:00"


async def test_device_per_stop_links_to_the_web_board(
    hass: HomeAssistant, loaded_entry: MockConfigEntry, device_registry: dr.DeviceRegistry
) -> None:
    device = device_registry.async_get_device_by_identifier(
        (DOMAIN, "stop_101"), loaded_entry.entry_id
    )
    assert device is not None
    assert device.name == "Ayuntamiento (101)"
    assert device.entry_type is dr.DeviceEntryType.SERVICE
    assert device.configuration_url == "https://chiva.github.io/logrono-bus/?v=1&p=101-2d.10d"


async def test_line_without_upcoming_buses_is_unknown(
    hass: HomeAssistant, config_entry: MockConfigEntry, upstream: AiohttpClientMocker
) -> None:
    config_entry.add_to_hass(hass)
    hass.config_entries.async_add_subentry(
        config_entry, ConfigSubentry(**stop_subentry("100", "Ayuntamiento (100)", ["7:asc"]))
    )
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    # The line runs but no bus is due: the value is unknown, the sensor itself is available.
    state = hass.states.get("sensor.ayuntamiento_100_7_naval_minutos")
    assert state.state == STATE_UNKNOWN
    assert state.attributes["destino"] == "Naval"


async def test_timetable_attributes(hass: HomeAssistant, loaded_entry: MockConfigEntry) -> None:
    """At 18:00 in Logroño, line 2 towards Manresa runs 09:00–22:30 from Artesanos, every 30 min."""
    minutes = hass.states.get("sensor.ayuntamiento_101_2_manresa_minutos")
    assert minutes.attributes["servicio"] == "en_servicio"
    assert minutes.attributes["primera_salida"] == "09:00"
    assert minutes.attributes["ultima_salida"] == "22:30"
    assert minutes.attributes["frecuencia_min"] == 30
    assert minutes.attributes["salidas_desde"] == "Artesanos"


async def test_timetable_failure_leaves_the_sensors_working(
    hass: HomeAssistant, config_entry: MockConfigEntry, aioclient_mock: AiohttpClientMocker
) -> None:
    """The timetable only explains an empty line: losing it must not make the sensors unavailable."""
    aioclient_mock.get(LINES_URL, json=load("lines.json"))
    aioclient_mock.get(STOPS_URL, json=load("stops.json"))
    aioclient_mock.get(arrivals_url("101"), json=load("arrivals-101.json"))
    aioclient_mock.get(timetable_url("2"), status=503)
    aioclient_mock.get(timetable_url("10"), json={"result": "cambiado"})
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()

    minutes = hass.states.get("sensor.ayuntamiento_101_2_manresa_minutos")
    assert minutes.state == "1"
    assert minutes.attributes["servicio"] is None
    assert "primera_salida" not in minutes.attributes


async def test_yesterdays_timetable_is_not_shown_after_midnight(
    hass: HomeAssistant,
    loaded_entry: MockConfigEntry,
    aioclient_mock: AiohttpClientMocker,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Past midnight today's timetable cannot be fetched: no service attributes beat stale ones."""
    minutes = "sensor.ayuntamiento_101_2_manresa_minutos"
    assert hass.states.get(minutes).attributes["servicio"] == "en_servicio"

    aioclient_mock.clear_requests()
    aioclient_mock.get(LINES_URL, json=load("lines.json"))
    aioclient_mock.get(STOPS_URL, json=load("stops.json"))
    aioclient_mock.get(arrivals_url("101"), json=load("arrivals-101.json"))
    aioclient_mock.get(timetable_url("2"), status=503)
    aioclient_mock.get(timetable_url("10"), status=503)
    freezer.move_to("2026-10-03T22:30:00+00:00")  # 00:30 on Sunday in Logroño
    async_fire_time_changed(hass)
    await hass.async_block_till_done(wait_background_tasks=True)
    assert hass.states.get(minutes).attributes["servicio"] is None
