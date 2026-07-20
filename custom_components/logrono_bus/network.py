"""Pure helpers for querying the static lines.json network structure.

No Home Assistant or network imports — trivially unit-testable.
"""

from __future__ import annotations

from typing import Any

Line = dict[str, Any]


def find_line(lines: list[Line], line_id: int | str) -> Line | None:
    target = str(line_id)
    for line in lines:
        if str(line.get("id")) == target:
            return line
    return None


def direction_stops(line: Line, direction: str) -> list[dict]:
    return list((line.get("stops") or {}).get(direction) or [])


def direction_label(line: Line, direction: str) -> str:
    stops = direction_stops(line, direction)
    if not stops:
        return direction
    return f"{stops[0].get('name')} → {stops[-1].get('name')}"


def find_stop(line: Line, direction: str, stop_id: int | str) -> dict | None:
    target = str(stop_id)
    for stop in direction_stops(line, direction):
        if str(stop.get("id")) == target:
            return stop
    return None


def line_geometry(line: Line, direction: str) -> list[list[float]]:
    """Ordered [lat, lng] points for drawing the line as a polyline."""
    points: list[list[float]] = []
    for stop in direction_stops(line, direction):
        lat, lng = stop.get("lat"), stop.get("lng")
        if lat is not None and lng is not None:
            points.append([float(lat), float(lng)])
    return points


def public_line_number(line: Line) -> str:
    """The human line number, e.g. '4' from name '4-PALACIO...'; falls back to id."""
    name = str(line.get("name") or "")
    head = name.split("-", 1)[0].strip()
    return head or str(line.get("id"))
