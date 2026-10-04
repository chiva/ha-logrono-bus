"""Diagnostics: what a maintainer needs to reproduce a problem. Nothing here is personal."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from logrono_bus import __version__ as library_version
from logrono_bus import to_json

from .models import LogronoBusConfigEntry


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: LogronoBusConfigEntry
) -> dict[str, Any]:
    base: dict[str, Any] = {
        "library_version": library_version,
        "state": entry.state.value,
        "reason": entry.reason,
        "options": dict(entry.options),
    }
    # Not set while setup is retrying (catalogue unreachable or changed): exactly when a
    # maintainer needs the rest of the context.
    data = getattr(entry, "runtime_data", None)
    if data is None:
        return {
            **base,
            "stops": {sub.title: dict(sub.data) for sub in entry.subentries.values()},
        }
    return {
        **base,
        "catalog": {
            "fetched_at": data.catalog.fetched_at.isoformat(),
            "lines": len(data.catalog.lines),
            "stops": len(data.catalog.stops),
        },
        "stops": {
            coordinator.subentry.title: {
                "subentry": dict(coordinator.subentry.data),
                "last_update_success": coordinator.last_update_success,
                "last_exception": repr(coordinator.last_exception)
                if coordinator.last_exception
                else None,
                "arrivals": to_json(coordinator.last_arrivals),
            }
            for coordinator in data.coordinators.values()
        },
    }
