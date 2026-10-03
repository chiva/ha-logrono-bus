"""Typed runtime data stored on the config entry."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from homeassistant.config_entries import ConfigEntry

from logrono_bus import Catalog, LogronoBusProvider

if TYPE_CHECKING:
    from .coordinator import StopArrivalsCoordinator


@dataclass
class LogronoBusData:
    provider: LogronoBusProvider
    catalog: Catalog
    """The catalogue as of setup: names entities even before their first successful refresh."""
    coordinators: dict[str, StopArrivalsCoordinator] = field(default_factory=dict)
    """Keyed by config subentry id."""


type LogronoBusConfigEntry = ConfigEntry[LogronoBusData]
