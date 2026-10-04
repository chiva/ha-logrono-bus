"""Base entity: one device per followed stop, one entity pair per line and direction."""

from __future__ import annotations

from urllib.parse import urlencode

from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from logrono_bus import Card, LineSelection, format_selection

from .const import BOARD_URL, DOMAIN, MANUFACTURER
from .coordinator import StopArrivalsCoordinator


def card_key(line: LineSelection) -> str:
    return f"{line.line_id}_{line.direction or 'any'}"


class LogronoBusEntity(CoordinatorEntity[StopArrivalsCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: StopArrivalsCoordinator, line: LineSelection) -> None:
        super().__init__(coordinator)
        self.line = line
        stop_id = coordinator.selection.stop_id
        board = urlencode({"v": 1, "p": format_selection((coordinator.selection,))})
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"stop_{stop_id}")},
            name=coordinator.subentry.title,
            manufacturer=MANUFACTURER,
            model="Parada de autobús",
            model_id=stop_id,
            entry_type=DeviceEntryType.SERVICE,
            configuration_url=f"{BOARD_URL}?{board}",
        )

    @property
    def card(self) -> Card | None:
        """This entity's card in the latest refresh."""
        for card in self.coordinator.data or []:
            if card.line_id == self.line.line_id and card.direction == self.line.direction:
                return card
        return None

    @property
    def available(self) -> bool:
        return super().available and self.card is not None
