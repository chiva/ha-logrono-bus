"""Config and options flow tests (real line-10 Ayuntamiento data)."""

import json
import pathlib
from unittest.mock import patch

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.logrono_bus.api import LogronoApiError
from custom_components.logrono_bus.const import (
    CONF_DIRECTION,
    CONF_LINE_ID,
    CONF_SCAN_INTERVAL,
    CONF_STOP_ID,
    DOMAIN,
)

FIXTURES = pathlib.Path(__file__).parent / "fixtures"
LINES = json.loads((FIXTURES / "lines_mini.json").read_text())

PATCH_LINES = "custom_components.logrono_bus.config_flow.LogronoApi.async_get_lines"


async def test_full_flow_creates_entry(hass: HomeAssistant) -> None:
    with patch(PATCH_LINES, return_value=LINES):
        result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
        assert result["type"] == FlowResultType.FORM
        assert result["step_id"] == "user"

        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_LINE_ID: "10"}
        )
        assert result["step_id"] == "direction"

        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_DIRECTION: "asc"}
        )
        assert result["step_id"] == "stop"

        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_STOP_ID: "100"}
        )

    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_LINE_ID] == 10
    assert result["data"][CONF_STOP_ID] == 100
    assert result["data"][CONF_DIRECTION] == "asc"
    assert result["result"].unique_id == "10_asc_100"
    assert "Ayuntamiento" in result["title"]


async def test_duplicate_aborts(hass: HomeAssistant) -> None:
    MockConfigEntry(domain=DOMAIN, unique_id="10_asc_100").add_to_hass(hass)
    with patch(PATCH_LINES, return_value=LINES):
        result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_LINE_ID: "10"}
        )
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_DIRECTION: "asc"}
        )
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_STOP_ID: "100"}
        )
    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_cannot_connect_aborts(hass: HomeAssistant) -> None:
    with patch(PATCH_LINES, side_effect=LogronoApiError("boom")):
        result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "cannot_connect"


async def test_options_flow_scan_interval(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="10_asc_100",
        data={CONF_LINE_ID: 10, CONF_STOP_ID: 100, CONF_DIRECTION: "asc", "line_name": "10"},
    )
    entry.add_to_hass(hass)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_SCAN_INTERVAL: 60}
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert entry.options[CONF_SCAN_INTERVAL] == 60
