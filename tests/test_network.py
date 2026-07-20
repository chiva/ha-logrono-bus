"""Pure-logic tests for the lines.json helpers (no HA/network needed).

Uses a real (public) subset of the network: lines 2 and 10, which both run past
the town hall (Ayuntamiento). Line 10 continues to Hospital San Pedro.
"""

import json
import pathlib

from custom_components.logrono_bus import network

FIXTURES = pathlib.Path(__file__).parent / "fixtures"
LINES = json.loads((FIXTURES / "lines_mini.json").read_text())


def test_find_line():
    assert network.find_line(LINES, 10)["id"] == 10
    assert network.find_line(LINES, "2")["id"] == 2
    assert network.find_line(LINES, 999) is None


def test_direction_label():
    line = network.find_line(LINES, 10)
    assert network.direction_label(line, "asc") == "Manuel de Falla → Artesanos"
    assert network.direction_label(line, "desc") == "Artesanos → Manuel de Falla"


def test_find_stop_direction_specific_ids():
    """Ayuntamiento's platform has a different id per direction — the crux."""
    line = network.find_line(LINES, 10)
    assert network.find_stop(line, "asc", 100)["name"] == "Ayuntamiento"
    assert network.find_stop(line, "desc", 101)["name"] == "Ayuntamiento"
    # the asc-side id 100 does not exist in the desc list (desc uses 101)
    assert network.find_stop(line, "desc", 100) is None
    # Hospital San Pedro is served on the asc run toward the hospital
    assert network.find_stop(line, "asc", 35)["name"] == "Hospital San Pedro"


def test_line_geometry():
    line = network.find_line(LINES, 10)
    geo = network.line_geometry(line, "asc")
    assert len(geo) == 30
    assert [42.465222, -2.438669] in geo  # Ayuntamiento (asc platform)
    assert all(len(p) == 2 for p in geo)


def test_public_line_number():
    assert network.public_line_number(network.find_line(LINES, 10)) == "10"
    assert network.public_line_number({"id": 7, "name": ""}) == "7"
