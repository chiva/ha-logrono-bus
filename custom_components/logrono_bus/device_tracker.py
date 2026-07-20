"""Live bus positions as device trackers (for the native HA map card)."""

from __future__ import annotations

from homeassistant.components.device_tracker import SourceType, TrackerEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import DomainData, EntryData
from .api import Vehicle
from .const import CONF_LINE_ID, CONF_LINE_NAME, DOMAIN
from .coordinator import LineCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    shared: DomainData = hass.data[DOMAIN]["shared"]
    data: EntryData = hass.data[DOMAIN][entry.entry_id]
    line_coord = data.line
    line_id = int(entry.data[CONF_LINE_ID])
    line_name = entry.data[CONF_LINE_NAME]

    @callback
    def _sync() -> None:
        # The shared line coordinator can tick while this entry is unloading;
        # don't add entities to a platform that is being torn down.
        if data.unloading:
            return
        new: list[LogronoBusTracker] = []
        for vehicle in (line_coord.data or {}).get("vehicles", []):
            uid = f"{DOMAIN}_bus_{line_id}_{vehicle.ref}"
            if uid in shared.tracked_vehicles:
                continue  # already tracked by this or another entry on the line
            shared.tracked_vehicles[uid] = entry.entry_id
            new.append(LogronoBusTracker(line_coord, uid, line_name, vehicle.ref))
        if new:
            async_add_entities(new)

    _sync()
    entry.async_on_unload(line_coord.async_add_listener(_sync))


class LogronoBusTracker(CoordinatorEntity[LineCoordinator], TrackerEntity):
    """One moving bus."""

    _attr_source_type = SourceType.GPS
    _attr_icon = "mdi:bus-marker"

    def __init__(
        self,
        coordinator: LineCoordinator,
        unique_id: str,
        line_name: str,
        ref: str,
    ) -> None:
        super().__init__(coordinator)
        self._ref = ref
        self._attr_unique_id = unique_id
        self._attr_name = f"Bus L{line_name} · {ref}"

    def _vehicle(self) -> Vehicle | None:
        for vehicle in (self.coordinator.data or {}).get("vehicles", []):
            if vehicle.ref == self._ref:
                return vehicle
        return None

    @property
    def available(self) -> bool:
        return super().available and self._vehicle() is not None

    @property
    def latitude(self) -> float | None:
        vehicle = self._vehicle()
        return vehicle.latitude if vehicle else None

    @property
    def longitude(self) -> float | None:
        vehicle = self._vehicle()
        return vehicle.longitude if vehicle else None

    @property
    def extra_state_attributes(self) -> dict:
        vehicle = self._vehicle()
        if vehicle is None:
            return {}
        return {
            "line": vehicle.line,
            "direction": vehicle.direction,
            "delay_minutes": round(vehicle.delay_seconds / 60),
            "next_stop_ref": vehicle.next_stop_ref,
            "recorded_at": vehicle.recorded_at.isoformat() if vehicle.recorded_at else None,
        }
