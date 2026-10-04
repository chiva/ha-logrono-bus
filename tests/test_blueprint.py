"""The "bus arriving" blueprint, run by a real automation: when it notifies, and when it stays quiet.

The phone is a `notify` entity; `notify.send_message` is replaced so the test sees the message
instead of pushing it.
"""

from __future__ import annotations

import asyncio
import shutil
from datetime import timedelta
from pathlib import Path
from typing import Any

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.setup import async_setup_component
from homeassistant.util.yaml import load_yaml_dict
from pytest_homeassistant_custom_component.common import async_fire_time_changed, async_mock_service

BLUEPRINT = (
    Path(__file__).parents[1] / "blueprints" / "automation" / "logrono_bus" / "aviso_llegada.yaml"
)
BLUEPRINT_PATH = "logrono_bus/aviso_llegada.yaml"
SOURCE_URL = (
    "https://github.com/chiva/ha-logrono-bus/blob/main/blueprints/automation/logrono_bus/"
    "aviso_llegada.yaml"
)
SENSOR = "sensor.ayuntamiento_101_2_manresa_minutos"
PHONE = "notify.movil"
# Event-loop turns for a state change to reach the notify call (trigger, conditions, actions).
SETTLE_ROUNDS = 10
ATTRIBUTES: dict[str, Any] = {
    "linea": "2",
    "destino": "Manresa",
    "parada": "Ayuntamiento",
    "tiempo_real": True,
    "siguientes": [14],
    "device_class": "duration",
    "unit_of_measurement": "min",
}


def test_source_url_points_at_this_file() -> None:
    """Re-import in Home Assistant fetches `source_url`: it must be where the file lives."""
    data = load_yaml_dict(BLUEPRINT)
    assert data["blueprint"]["source_url"] == SOURCE_URL
    assert data["blueprint"]["domain"] == "automation"


@pytest.fixture
async def phone(hass: HomeAssistant, tmp_path: Path) -> list[ServiceCall]:
    """The blueprint installed in a fresh config dir, and the messages a phone would receive."""
    hass.config.config_dir = str(tmp_path)
    await hass.config.async_set_time_zone("Europe/Madrid")
    target = tmp_path / "blueprints" / "automation" / BLUEPRINT_PATH
    target.parent.mkdir(parents=True)
    shutil.copy(BLUEPRINT, target)
    return async_mock_service(hass, "notify", "send_message")


async def _automation(hass: HomeAssistant, **inputs: Any) -> None:
    hass.states.async_set(SENSOR, "10", ATTRIBUTES)
    config = {
        "automation": {
            "id": "aviso_bus",
            "alias": "Aviso bus",
            "use_blueprint": {
                "path": BLUEPRINT_PATH,
                "input": {"sensor": SENSOR, "avisar": {"entity_id": PHONE}, **inputs},
            },
        }
    }
    assert await async_setup_component(hass, "automation", config)
    await hass.async_block_till_done()
    assert hass.states.get("automation.aviso_bus") is not None, "the blueprint did not load"


async def _minutes(hass: HomeAssistant, value: int, **attributes: Any) -> None:
    """The sensor reports a new estimate; let the automation react.

    Not `async_block_till_done`: after notifying, the run sits in its pause (minutes, on a frozen
    clock), and waiting for it would never return.
    """
    hass.states.async_set(SENSOR, str(value), {**ATTRIBUTES, **attributes})
    for _ in range(SETTLE_ROUNDS):
        await asyncio.sleep(0)


def _messages(calls: list[ServiceCall]) -> list[str]:
    return [call.data["message"] for call in calls]


async def test_notifies_when_the_bus_gets_close(
    hass: HomeAssistant, phone: list[ServiceCall]
) -> None:
    await _automation(hass)
    await _minutes(hass, 8)
    assert phone == [], "8 min is not under the default 6"
    await _minutes(hass, 5)
    assert [
        (call.data["entity_id"], call.data["title"], call.data["message"]) for call in phone
    ] == [([PHONE], "🚌 2 → Manresa", "Llega a Ayuntamiento en 5 min. El siguiente, en 14 min.")]


async def test_quiet_for_a_while_after_notifying_then_announces_the_next_bus(
    hass: HomeAssistant, phone: list[ServiceCall], freezer: FrozenDateTimeFactory
) -> None:
    await _automation(hass, pausa=10)
    await _minutes(hass, 5)
    # The estimate jitters around the threshold: no second message for the same bus.
    await _minutes(hass, 6)
    await _minutes(hass, 5)
    assert len(phone) == 1
    # Ten minutes later that bus has gone; the next one gets its own message.
    freezer.tick(timedelta(minutes=11))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert hass.states.get("automation.aviso_bus").attributes["current"] == 0, "pause over"
    await _minutes(hass, 14, siguientes=[])
    await _minutes(hass, 4, siguientes=[])
    assert _messages(phone) == [
        "Llega a Ayuntamiento en 5 min. El siguiente, en 14 min.",
        "Llega a Ayuntamiento en 4 min.",
    ]


async def test_the_next_bus_is_announced_even_during_the_pause(
    hass: HomeAssistant, phone: list[ServiceCall]
) -> None:
    """Frequent line: the bus passes and the next one comes close before the pause would end."""
    await _automation(hass, pausa=30)
    await _minutes(hass, 5)
    await _minutes(hass, 12, siguientes=[])  # the first bus has gone; the next one is 12 min away
    await _minutes(hass, 5, siguientes=[])
    assert _messages(phone) == [
        "Llega a Ayuntamiento en 5 min. El siguiente, en 14 min.",
        "Llega a Ayuntamiento en 5 min.",
    ]


async def test_respects_the_days(hass: HomeAssistant, phone: list[ServiceCall]) -> None:
    """2026-10-03 is a Saturday, 18:00 in Logroño."""
    await _automation(hass, dias=["mon", "tue", "wed", "thu", "fri"])
    await _minutes(hass, 3)
    assert phone == [], "weekdays only, and it is Saturday"


async def test_respects_the_time_window(hass: HomeAssistant, phone: list[ServiceCall]) -> None:
    await _automation(hass, desde="07:00:00", hasta="09:30:00")
    await _minutes(hass, 3)
    assert phone == [], "18:00 is outside 07:00-09:30"


async def test_ignores_scheduled_times_by_default(
    hass: HomeAssistant, phone: list[ServiceCall]
) -> None:
    await _automation(hass)
    await _minutes(hass, 3, tiempo_real=False)
    assert phone == [], "by default only located buses notify"


async def test_can_notify_scheduled_times_too(
    hass: HomeAssistant, phone: list[ServiceCall]
) -> None:
    await _automation(hass, solo_tiempo_real=False)
    await _minutes(hass, 3, tiempo_real=False, siguientes=[])
    assert _messages(phone) == ["Llega a Ayuntamiento en 3 min (horario programado)."]


async def test_runs_extra_actions_with_the_message(
    hass: HomeAssistant, phone: list[ServiceCall]
) -> None:
    speaker = async_mock_service(hass, "tts", "speak")
    await _automation(
        hass,
        acciones=[{"action": "tts.speak", "data": {"message": "{{ mensaje }}"}}],
    )
    await _minutes(hass, 2, siguientes=[])
    assert _messages(speaker) == ["Llega a Ayuntamiento en 2 min."]
    assert len(phone) == 1
