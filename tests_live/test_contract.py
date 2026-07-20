"""Live contract tests against the real Logroño transport API.

We don't control that API, so these exist to catch the day its shape or key
invariants change (renumbered stops, renamed fields, altered structure) — the
thing that would silently break the integration.

They are **not** part of the default suite (they live outside ``tests/`` and hit
the network). Run them with ``pytest tests_live/``; a weekly workflow does so and
opens an issue on drift, rather than waiting for a user bug report.

Design rules:
* Assert **shape and invariants**, never live values (times/positions change).
* A transient outage (HTTP 5xx / timeout) or an out-of-service-hours empty feed
  ``pytest.skip``s — those are availability, not contract drift.
* Reuse the integration's own parsers/helpers, so a green run means *our code*
  still understands the live payloads.
"""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request

import pytest

from custom_components.logrono_bus.api import (
    parse_arrivals,
    parse_timetable,
    parse_vehicles,
    stop_code,
)
from custom_components.logrono_bus.network import (
    direction_stops,
    find_line,
    find_stop,
    line_geometry,
)

API_BASE = "https://transporteurbano.logrono.es/api"
LINES_URL = "https://transporteurbano.logrono.es/assets/data/lines.json"

# A stable, public reference point: line 10 past the town hall to the hospital.
REF_LINE = 10
REF_STOP_NAME = "Ayuntamiento"
SIX_DIGITS = re.compile(r"^\d{6}$")


def _get(url: str):
    """Fetch JSON, skipping the test on any availability problem (not drift)."""
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (logrono-bus-contract)"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        if err.code in (429, 500, 502, 503, 504):
            pytest.skip(f"upstream temporarily unavailable ({err.code})")
        raise
    except (urllib.error.URLError, TimeoutError, OSError) as err:
        pytest.skip(f"network unavailable: {err}")


@pytest.fixture(scope="module")
def lines() -> list:
    return _get(LINES_URL)


# --- Static network -----------------------------------------------------------


def test_lines_json_shape(lines: list) -> None:
    """lines.json is still a list of lines with asc/desc ordered stops."""
    assert isinstance(lines, list) and lines
    line = find_line(lines, REF_LINE)
    assert line is not None, f"line {REF_LINE} vanished from lines.json"
    for direction in ("asc", "desc"):
        stops = direction_stops(line, direction)
        assert stops, f"line {REF_LINE} has no {direction} stops"
        for stop in stops:
            assert {"id", "name", "lat", "lng"} <= stop.keys()
    # geometry is usable for the map card
    assert len(line_geometry(line, "asc")) == len(direction_stops(line, "asc"))


def test_reference_stop_still_present(lines: list) -> None:
    """Our documented example (Ayuntamiento on line 10) still resolves."""
    line = find_line(lines, REF_LINE)
    asc = find_stop(line, "asc", 100)
    desc = find_stop(line, "desc", 101)
    assert asc and asc["name"] == REF_STOP_NAME, "Ayuntamiento asc id/name drifted"
    assert desc and desc["name"] == REF_STOP_NAME, "Ayuntamiento desc id/name drifted"


# --- Live feeds ---------------------------------------------------------------


def test_production_timetable_contract() -> None:
    """Schedule feed still yields first/last pass and headway (always available)."""
    tt = parse_timetable(_get(f"{API_BASE}/productionTimetable/byLine/{REF_LINE}"))
    assert tt["first_pass"] and tt["last_pass"]
    assert isinstance(tt["interval_minutes"], int)


def test_bystop_arrivals_contract() -> None:
    """estimatedTimetable/byStop parses, and stopPointRef == padded lines.json id."""
    data = _get(
        f"{API_BASE}/estimatedTimetable/byStop/{stop_code(100)}?lines={REF_LINE}&previewMinutes=120"
    )
    arrivals = parse_arrivals(data)
    if not arrivals:
        pytest.skip("no line-10 arrivals in window (off-peak / outside service hours)")
    first = arrivals[0]
    assert first.expected.tzinfo is not None, "expectedArrivalTime lost its timezone"
    assert first.line == str(REF_LINE)
    assert first.stop_ref == stop_code(100), "byStop returned a different stopPointRef"


def test_vehicle_monitoring_contract() -> None:
    """vehicleMonitoring/byLine parses to positions with finite coordinates."""
    vehicles = parse_vehicles(_get(f"{API_BASE}/vehicleMonitoring/byLine/{REF_LINE}"))
    if not vehicles:
        pytest.skip("no line-10 vehicles running now")
    for v in vehicles:
        assert -90 <= v.latitude <= 90 and -180 <= v.longitude <= 180
        assert v.line == str(REF_LINE)


def test_stoppointref_is_padded_id_invariant(lines: list) -> None:
    """The core mapping: every live stopPointRef is a 6-digit lines.json stop id."""
    data = _get(f"{API_BASE}/estimatedTimetable/byLine/{REF_LINE}?previewMinutes=120")
    arrivals = parse_arrivals(data)
    if not arrivals:
        pytest.skip("no line-10 arrivals in window")
    line = find_line(lines, REF_LINE)
    known_ids = {str(s["id"]) for d in ("asc", "desc") for s in direction_stops(line, d)}
    for a in arrivals:
        assert SIX_DIGITS.match(a.stop_ref), f"stopPointRef not 6 digits: {a.stop_ref}"
        assert str(int(a.stop_ref)) in known_ids, (
            f"live stopPointRef {a.stop_ref} has no matching lines.json id"
        )
