"""Thin async client for the Logroño urban transport API.

All endpoints are public (no auth). See docs/API.md for the full reference.
This module is deliberately free of Home Assistant imports except for the
datetime helper, so its parsing can be unit-tested in isolation.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime

import aiohttp
from homeassistant.util import dt as dt_util

from .const import API_BASE, LINES_URL, PREVIEW_MINUTES

_LOGGER = logging.getLogger(__name__)

REQUEST_TIMEOUT = 15


def stop_code(stop_id: int | str) -> str:
    """Return the 6-digit SIRI stopPointRef for a lines.json stop id."""
    return f"{int(stop_id):06d}"


def _parse_dt(value: str | None) -> datetime | None:
    """Parse an ISO-8601 timestamp (may carry a +02:00 offset) to aware dt."""
    if not value:
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is None:
        return None
    # Guard against naive strings; assume the local (Madrid) zone.
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
    return parsed


@dataclass(slots=True)
class Arrival:
    """A single predicted arrival at a stop."""

    line: str
    stop_ref: str
    expected: datetime
    aimed: datetime | None
    delay_seconds: int
    inaccurate: bool

    @property
    def delay_minutes(self) -> int:
        return round(self.delay_seconds / 60)


@dataclass(slots=True)
class Vehicle:
    """A live bus position."""

    ref: str
    line: str
    direction: str | None
    latitude: float
    longitude: float
    delay_seconds: int
    next_stop_ref: str | None
    recorded_at: datetime | None


class LogronoApiError(Exception):
    """Raised when the upstream API cannot be reached or returns garbage."""


class LogronoApi:
    """Small wrapper around the handful of endpoints we need."""

    def __init__(self, session: aiohttp.ClientSession) -> None:
        self._session = session

    async def _get_json(self, url: str) -> dict:
        try:
            async with asyncio.timeout(REQUEST_TIMEOUT):
                resp = await self._session.get(url)
                resp.raise_for_status()
                return await resp.json(content_type=None)
        except (TimeoutError, aiohttp.ClientError) as err:
            raise LogronoApiError(f"Request to {url} failed: {err}") from err
        except ValueError as err:  # bad JSON
            raise LogronoApiError(f"Invalid JSON from {url}: {err}") from err

    async def async_get_arrivals(
        self, stop_id: int | str, line_ids: list[int | str]
    ) -> list[Arrival]:
        """Next arrivals at a stop for the given line(s), soonest first."""
        lines = ",".join(str(x) for x in line_ids)
        url = (
            f"{API_BASE}/estimatedTimetable/byStop/{stop_code(stop_id)}"
            f"?lines={lines}&previewMinutes={PREVIEW_MINUTES}"
        )
        data = await self._get_json(url)
        return parse_arrivals(data)

    async def async_get_vehicles(self, line_id: int | str) -> list[Vehicle]:
        """Live vehicle positions for a line."""
        url = f"{API_BASE}/vehicleMonitoring/byLine/{line_id}"
        data = await self._get_json(url)
        return parse_vehicles(data)

    async def async_get_timetable(self, line_id: int | str) -> dict:
        """Scheduled frequency / first & last pass for a line."""
        url = f"{API_BASE}/productionTimetable/byLine/{line_id}"
        data = await self._get_json(url)
        return parse_timetable(data)

    async def async_get_lines(self) -> list[dict]:
        """The static network file (lines with ordered stops per direction)."""
        try:
            async with asyncio.timeout(REQUEST_TIMEOUT):
                resp = await self._session.get(LINES_URL)
                resp.raise_for_status()
                return await resp.json(content_type=None)
        except (TimeoutError, aiohttp.ClientError, ValueError) as err:
            raise LogronoApiError(f"Could not load lines.json: {err}") from err


# --- Pure parsers (unit-testable, no network) -------------------------------


def parse_arrivals(data: dict) -> list[Arrival]:
    result: list[Arrival] = []
    for item in (data.get("result") or {}).get("arrivals") or []:
        expected = _parse_dt(item.get("expectedArrivalTime")) or _parse_dt(
            item.get("aimedArrivalTime")
        )
        if expected is None:
            continue
        result.append(
            Arrival(
                line=str(item.get("lineRef", "")),
                stop_ref=str(item.get("stopPointRef", "")),
                expected=expected,
                aimed=_parse_dt(item.get("aimedArrivalTime")),
                delay_seconds=int(item.get("delaySeconds") or 0),
                inaccurate=bool(item.get("predictionInaccurate")),
            )
        )
    result.sort(key=lambda a: a.expected)
    return result


def parse_vehicles(data: dict) -> list[Vehicle]:
    result: list[Vehicle] = []
    for item in (data.get("result") or {}).get("activities") or []:
        line = str(item.get("lineRef", ""))
        # Skip the server-side "[object Object]" serialization glitches.
        if "object Object" in line:
            continue
        lat = item.get("latitude")
        lng = item.get("longitude")
        if lat is None or lng is None:
            continue
        raw_direction = item.get("directionRef")
        direction = str(raw_direction) if raw_direction else None
        if direction and "object Object" in direction:
            direction = None  # scrub the same server-side serialization glitch
        result.append(
            Vehicle(
                ref=str(item.get("vehicleRef") or item.get("vehicleMonitoringRef") or ""),
                line=line,
                direction=direction,
                latitude=float(lat),
                longitude=float(lng),
                delay_seconds=int(item.get("delaySeconds") or 0),
                next_stop_ref=(item.get("nextStopRef") or None),
                recorded_at=_parse_dt(item.get("locationRecordedAtTime")),
            )
        )
    return result


def parse_timetable(data: dict) -> dict:
    """Flatten the productionTimetable payload to the few fields we surface."""
    result = data.get("result") or {}
    freqs = result.get("frequencies") or []
    base = freqs[0] if freqs else {}
    by_dir_raw = result.get("frequenciesByDirection") or {}
    by_dir: dict[str, dict] = {}
    for key, entries in by_dir_raw.items():
        if entries:
            first = entries[0]
            by_dir[key] = {
                "first_pass": first.get("firstPass"),
                "last_pass": first.get("lastPass"),
                "interval_minutes": first.get("intervalMinutes"),
                "pass_count": first.get("passCount"),
            }
    return {
        "first_pass": base.get("firstPass"),
        "last_pass": base.get("lastPass"),
        "interval_minutes": base.get("intervalMinutes"),
        "interval_minutes_max": base.get("intervalMinutesMax"),
        "pass_count": base.get("passCount"),
        "by_direction": by_dir,
        "passes": result.get("passes") or [],
    }
