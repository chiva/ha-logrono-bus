"""Constants for the Logroño Bus integration."""

from __future__ import annotations

from datetime import timedelta

DOMAIN = "logrono_bus"

# --- Remote endpoints -------------------------------------------------------
API_BASE = "https://transporteurbano.logrono.es/api"
LINES_URL = "https://transporteurbano.logrono.es/assets/data/lines.json"

# --- Polling ----------------------------------------------------------------
# Arrivals are polled every SCAN_INTERVAL seconds. The *displayed* countdown
# still ticks every second in the UI because the sensor is a timestamp entity.
DEFAULT_SCAN_INTERVAL = 30
MIN_SCAN_INTERVAL = 10
MAX_SCAN_INTERVAL = 300
PREVIEW_MINUTES = 90
# The line coordinator (vehicle GPS) refreshes on this cadence.
VEHICLE_SCAN_INTERVAL = timedelta(seconds=15)
# Scheduled timetable barely changes; refresh at most this often.
TIMETABLE_TTL = timedelta(hours=6)

# --- Config entry keys ------------------------------------------------------
CONF_LINE_ID = "line_id"
CONF_LINE_NAME = "line_name"
CONF_LINE_COLOR = "line_color"
CONF_DIRECTION = "direction"  # "asc" | "desc"
CONF_DIRECTION_LABEL = "direction_label"
CONF_STOP_ID = "stop_id"
CONF_STOP_NAME = "stop_name"
CONF_STOP_LAT = "stop_lat"
CONF_STOP_LNG = "stop_lng"
CONF_SCAN_INTERVAL = "scan_interval"

DIRECTIONS = ("asc", "desc")

PLATFORMS = ["sensor", "device_tracker"]
