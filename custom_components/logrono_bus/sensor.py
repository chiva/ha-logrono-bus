"""Sensors: per followed line and direction, the next arrival (timestamp) and minutes left."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.const import UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from logrono_bus import (
    TIMEZONE,
    Arrival,
    Card,
    LineNotFound,
    LineSelection,
    minutes_until,
    service_status,
)

from .coordinator import StopArrivalsCoordinator
from .entity import LogronoBusEntity, card_key
from .models import LogronoBusConfigEntry

PARALLEL_UPDATES = 0

ANY_DIRECTION = "ambos sentidos"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: LogronoBusConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    for subentry_id, coordinator in entry.runtime_data.coordinators.items():
        entities: list[SensorEntity] = []
        for line in coordinator.selection.lines:
            entities.append(NextArrivalSensor(coordinator, line))
            entities.append(MinutesSensor(coordinator, line))
        async_add_entities(entities, config_subentry_id=subentry_id)


class ArrivalSensor(LogronoBusEntity, SensorEntity):
    """Shared naming and attributes for both sensors of a line and direction."""

    # Changes every refresh and would bloat the recorder's database for no history value.
    _unrecorded_attributes = frozenset(
        {"siguientes", "tiempo_real", "retraso_s", "llegadas", "proxima_salida"}
    )

    def __init__(
        self, coordinator: StopArrivalsCoordinator, line: LineSelection, kind: str
    ) -> None:
        super().__init__(coordinator, line)
        catalog = coordinator.config_entry.runtime_data.catalog
        try:
            label = catalog.line(line.line_id).label
        except LineNotFound:
            label = line.line_id
        pattern = catalog.pattern(f"{line.line_id}:{line.direction}") if line.direction else None
        headsign = pattern.headsign if pattern else ANY_DIRECTION
        self._attr_translation_key = kind
        self._attr_translation_placeholders = {"line": label, "headsign": headsign}
        self._attr_unique_id = f"{coordinator.selection.stop_id}_{card_key(line)}_{kind}"

    @property
    def next_arrival(self) -> Arrival | None:
        card = self.card
        if card is None:
            return None
        return next((a for a in card.arrivals if not a.cancelled), None)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        card = self.card
        if card is None:
            return {}
        now = dt_util.utcnow()
        upcoming = [a for a in card.arrivals if not a.cancelled]
        nxt = upcoming[0] if upcoming else None
        return {
            "linea": card.line_label,
            "destino": (nxt.headsign if nxt and nxt.headsign else card.headsign),
            "color": card.colour,
            "color_texto": card.text_colour,
            "siguientes": [minutes_until(a.expected, now) for a in upcoming[1:]],
            "tiempo_real": nxt.is_realtime if nxt else None,
            "retraso_s": nxt.delay_s if nxt else None,
            # What the Logroño Bus dashboard card needs to draw this line exactly like the web.
            "parada_id": card.stop_id,
            "parada": card.stop_name,
            "linea_id": card.line_id,
            "nombre_linea": card.line_name,
            "sentido": card.direction,
            "llegadas": [
                {"hora": a.expected.isoformat(), "tiempo_real": a.is_realtime} for a in upcoming
            ],
            **self._service_attributes(card, now),
        }

    def _service_attributes(self, card: Card, now: datetime) -> dict[str, Any]:
        """Today's service of this line and direction (departures from its first stop)."""
        timetable = self.coordinator.timetables.get(card.line_id)
        pattern_id = (
            f"{card.line_id}:{card.direction}"
            if card.direction
            else next((a.pattern_id for a in card.arrivals if a.pattern_id), None)
        )
        # Yesterday's timetable, kept because today's request failed, would describe the wrong day.
        if (
            timetable is None
            or timetable.service_date != now.astimezone(TIMEZONE).date().isoformat()
        ):
            return {"servicio": None}
        direction = timetable.for_pattern(pattern_id) if pattern_id else None
        status = service_status(direction, now)
        return {
            "servicio": status.state,
            "primera_salida": status.first,
            "ultima_salida": status.last,
            "proxima_salida": status.next_departure,
            "frecuencia_min": status.interval_min,
            "frecuencia_max_min": status.interval_max_min,
            "salidas_desde": direction.origin if direction else None,
        }


class NextArrivalSensor(ArrivalSensor):
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, coordinator: StopArrivalsCoordinator, line: LineSelection) -> None:
        super().__init__(coordinator, line, "next_arrival")

    @property
    def native_value(self) -> datetime | None:
        nxt = self.next_arrival
        return nxt.expected if nxt else None


class MinutesSensor(ArrivalSensor):
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES
    _attr_suggested_display_precision = 0

    def __init__(self, coordinator: StopArrivalsCoordinator, line: LineSelection) -> None:
        super().__init__(coordinator, line, "minutes")

    @property
    def native_value(self) -> int | None:
        nxt = self.next_arrival
        return minutes_until(nxt.expected, dt_util.utcnow()) if nxt else None
