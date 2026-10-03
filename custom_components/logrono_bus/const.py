"""Constants for the Logroño Bus integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "logrono_bus"

SUBENTRY_STOP: Final = "stop"
"""Config subentry type: one per stop the user follows."""

CONF_STOP_ID: Final = "stop_id"
CONF_PATTERNS: Final = "patterns"
"""Pattern ids ("2:desc") the user picked at the stop."""
CONF_SCAN_INTERVAL: Final = "scan_interval"
CONF_FOLLOWING: Final = "following"

DEFAULT_SCAN_INTERVAL_S: Final = 60
MIN_SCAN_INTERVAL_S: Final = 30
MAX_SCAN_INTERVAL_S: Final = 300
DEFAULT_FOLLOWING: Final = 3
MAX_FOLLOWING: Final = 6

SCHEMA_FAILURES_BEFORE_ISSUE: Final = 3
"""Consecutive "the upstream changed" failures before a repair issue is raised (one could be a
transient glitch; three in a row is a real change)."""

ISSUE_UPSTREAM_CHANGED: Final = "upstream_changed"
ISSUE_STOP_REMOVED: Final = "stop_removed"

BOARD_URL: Final = "https://chiva.github.io/logrono-bus/"
MANUFACTURER: Final = "Ayuntamiento de Logroño (datos públicos)"

CARD_FILENAME: Final = "logrono-bus-card.js"
CARD_URL: Final = f"/{DOMAIN}/{CARD_FILENAME}"
"""Where the dashboard card (custom:logrono-bus-card) is served; built in chiva/logrono-bus."""
