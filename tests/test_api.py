"""Tests for the pure API parsers (real line-10 sample data)."""

import json
import pathlib

from custom_components.logrono_bus.api import (
    parse_arrivals,
    parse_timetable,
    parse_vehicles,
    stop_code,
)

FIXTURES = pathlib.Path(__file__).parent / "fixtures"


def _load(name):
    return json.loads((FIXTURES / name).read_text())


def test_stop_code_zero_pads():
    assert stop_code(100) == "000100"
    assert stop_code("101") == "000101"
    assert stop_code(35) == "000035"


def test_parse_arrivals_sorted_soonest_first():
    arrivals = parse_arrivals(_load("arrivals_byStop.json"))
    assert len(arrivals) == 2
    # soonest first
    assert arrivals[0].expected < arrivals[1].expected
    assert arrivals[0].line == "10"
    assert arrivals[0].stop_ref == "000100"
    assert arrivals[0].delay_seconds == 17
    assert arrivals[0].delay_minutes == 0
    # second one is early (negative delay) and flagged inaccurate
    assert arrivals[1].delay_seconds == -147
    assert arrivals[1].delay_minutes == -2
    assert arrivals[1].inaccurate is True


def test_parse_arrivals_empty():
    assert parse_arrivals({"result": {"arrivals": []}}) == []
    assert parse_arrivals({}) == []


def test_parse_vehicles_filters_object_glitch():
    vehicles = parse_vehicles(_load("vehicles_byLine.json"))
    # The "[object Object]" row is dropped.
    assert len(vehicles) == 1
    v = vehicles[0]
    assert v.ref == "0609"
    assert v.line == "10"
    assert v.direction == "Ida"
    assert v.latitude == 42.4652
    assert v.next_stop_ref == "0100"


def test_parse_timetable():
    tt = parse_timetable(_load("timetable_byLine.json"))
    assert tt["first_pass"] == "07:00"
    assert tt["last_pass"] == "22:45"
    assert tt["interval_minutes"] == 15
    assert tt["pass_count"] == 68
    assert set(tt["by_direction"]) == {"Ida", "Vuelta"}
    assert tt["by_direction"]["Ida"]["first_pass"] == "07:00"
