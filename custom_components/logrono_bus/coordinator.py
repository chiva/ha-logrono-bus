"""Data update coordinators for Logroño Bus.

Two coordinators, on purpose:

* ``ArrivalsCoordinator`` — one per config entry (a stop+line pair). Polls the
  ``estimatedTimetable/byStop`` feed on the user-chosen interval. This drives the
  "next bus" sensor.
* ``LineCoordinator`` — one per distinct line, shared by every entry on that line.
  Polls live vehicle GPS (fast) and the scheduled timetable (lazily, ~6 h TTL).
  Drives the moving map and the frequency / first-last attributes.
"""

from __future__ import annotations

import logging
from datetime import datetime

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import Arrival, LogronoApi, LogronoApiError, Vehicle
from .const import DOMAIN, TIMETABLE_TTL, VEHICLE_SCAN_INTERVAL

_LOGGER = logging.getLogger(__name__)


class ArrivalsCoordinator(DataUpdateCoordinator[list[Arrival]]):
    """Poll next arrivals for a single stop + line."""

    def __init__(
        self,
        hass: HomeAssistant,
        api: LogronoApi,
        stop_id: int,
        line_id: int,
        update_interval,
    ) -> None:
        self._api = api
        self._stop_id = stop_id
        self._line_id = line_id
        super().__init__(
            hass,
            _LOGGER,
            name=f"{DOMAIN} arrivals {line_id}@{stop_id}",
            update_interval=update_interval,
        )

    async def _async_update_data(self) -> list[Arrival]:
        try:
            return await self._api.async_get_arrivals(self._stop_id, [self._line_id])
        except LogronoApiError as err:
            raise UpdateFailed(str(err)) from err


class LineCoordinator(DataUpdateCoordinator[dict]):
    """Poll live vehicles (fast) and the schedule (lazily) for one line."""

    def __init__(self, hass: HomeAssistant, api: LogronoApi, line_id: int) -> None:
        self._api = api
        self._line_id = line_id
        self._timetable: dict = {}
        self._timetable_fetched: datetime | None = None
        super().__init__(
            hass,
            _LOGGER,
            name=f"{DOMAIN} line {line_id}",
            update_interval=VEHICLE_SCAN_INTERVAL,
        )

    async def _async_update_data(self) -> dict:
        try:
            vehicles: list[Vehicle] = await self._api.async_get_vehicles(self._line_id)
        except LogronoApiError as err:
            raise UpdateFailed(str(err)) from err

        now = dt_util.utcnow()
        if self._timetable_fetched is None or now - self._timetable_fetched > TIMETABLE_TTL:
            try:
                self._timetable = await self._api.async_get_timetable(self._line_id)
                self._timetable_fetched = now
            except LogronoApiError as err:
                # Non-fatal: keep vehicles flowing even if the schedule blips.
                _LOGGER.debug("Timetable refresh for line %s failed: %s", self._line_id, err)

        return {"vehicles": vehicles, "timetable": self._timetable}
