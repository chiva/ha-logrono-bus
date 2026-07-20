"""Next-bus sensor for Logroño Bus."""

from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from . import EntryData
from .const import (
    CONF_DIRECTION,
    CONF_DIRECTION_LABEL,
    CONF_LINE_COLOR,
    CONF_LINE_NAME,
    CONF_STOP_ID,
    CONF_STOP_LAT,
    CONF_STOP_LNG,
    CONF_STOP_NAME,
    DOMAIN,
)
from .coordinator import ArrivalsCoordinator

# Arrivals up to this far in the past are still shown as "arriving now".
GRACE = timedelta(seconds=45)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    data: EntryData = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([LogronoNextBusSensor(entry, data)])


class LogronoNextBusSensor(CoordinatorEntity[ArrivalsCoordinator], SensorEntity):
    """State = timestamp of the next arrival; the UI counts down live."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_has_entity_name = True
    _attr_icon = "mdi:bus-clock"
    _attr_translation_key = "next_bus"

    def __init__(self, entry: ConfigEntry, data: EntryData) -> None:
        super().__init__(data.arrivals)
        self._entry = entry
        self._data = data
        self._attr_unique_id = f"{entry.entry_id}_next_bus"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.title,
            manufacturer="Logroño Transporte Urbano",
            model=f"Line {entry.data[CONF_LINE_NAME]}",
        )

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        # Also refresh when the shared line coordinator (vehicles/timetable) ticks.
        self.async_on_remove(self._data.line.async_add_listener(self.async_write_ha_state))

    def _upcoming(self) -> list:
        now = dt_util.now()
        arrivals = self.coordinator.data or []
        return [a for a in arrivals if a.expected >= now - GRACE]

    @property
    def native_value(self) -> datetime | None:
        upcoming = self._upcoming()
        return upcoming[0].expected if upcoming else None

    @property
    def extra_state_attributes(self) -> dict:
        d = self._entry.data
        upcoming = self._upcoming()
        now = dt_util.now()
        nxt = upcoming[0] if upcoming else None

        timetable = (self._data.line.data or {}).get("timetable") or {}
        vehicles = (self._data.line.data or {}).get("vehicles") or []

        attrs: dict = {
            "line": d[CONF_LINE_NAME],
            "line_color": d.get(CONF_LINE_COLOR),
            "direction": d[CONF_DIRECTION],
            "direction_label": d.get(CONF_DIRECTION_LABEL),
            "stop": d[CONF_STOP_NAME],
            "stop_id": d[CONF_STOP_ID],
            # Frequency / first & last pass (the "details" view).
            "first_pass": timetable.get("first_pass"),
            "last_pass": timetable.get("last_pass"),
            "interval_minutes": timetable.get("interval_minutes"),
            "pass_count": timetable.get("pass_count"),
            "schedule_by_direction": timetable.get("by_direction"),
            # Everything a map card needs, in one entity.
            "line_stops": self._data.geometry,
            "stop_lat": d.get(CONF_STOP_LAT),
            "stop_lng": d.get(CONF_STOP_LNG),
            "vehicles": [
                {
                    "ref": v.ref,
                    "lat": v.latitude,
                    "lng": v.longitude,
                    "delay_minutes": round(v.delay_seconds / 60),
                    "next_stop_ref": v.next_stop_ref,
                }
                for v in vehicles
            ],
        }

        if nxt is not None:
            attrs["next_arrivals"] = [a.expected.isoformat() for a in upcoming[:5]]
            attrs["minutes"] = max(0, round((nxt.expected - now).total_seconds() / 60))
            attrs["delay_minutes"] = nxt.delay_minutes
            attrs["delay_seconds"] = nxt.delay_seconds
            attrs["prediction_inaccurate"] = nxt.inaccurate
        else:
            attrs["next_arrivals"] = []
            attrs["minutes"] = None

        return attrs
