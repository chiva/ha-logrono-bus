"""Config and options flow for Logroño Bus."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)

from .api import LogronoApi, LogronoApiError
from .const import (
    CONF_DIRECTION,
    CONF_DIRECTION_LABEL,
    CONF_LINE_COLOR,
    CONF_LINE_ID,
    CONF_LINE_NAME,
    CONF_SCAN_INTERVAL,
    CONF_STOP_ID,
    CONF_STOP_LAT,
    CONF_STOP_LNG,
    CONF_STOP_NAME,
    DEFAULT_SCAN_INTERVAL,
    DIRECTIONS,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
)
from .network import (
    direction_label,
    direction_stops,
    find_line,
    find_stop,
    public_line_number,
)


def _select(options: list[SelectOptionDict]) -> SelectSelector:
    return SelectSelector(SelectSelectorConfig(options=options, mode=SelectSelectorMode.DROPDOWN))


def _readable_line(line: dict) -> str:
    name = str(line.get("name") or "")
    # "10-EL ARCO-HOSPITAL SAN PEDRO" -> "El Arco-Hospital San Pedro"
    parts = name.split("-", 1)
    return parts[1].title() if len(parts) == 2 else name


class LogronoConfigFlow(ConfigFlow, domain=DOMAIN):
    """Guide the user through Line -> Direction -> Stop."""

    VERSION = 1

    def __init__(self) -> None:
        self._lines: list[dict] = []
        self._line: dict | None = None
        self._direction: str | None = None

    async def _ensure_lines(self) -> bool:
        if self._lines:
            return True
        api = LogronoApi(async_get_clientsession(self.hass))
        try:
            self._lines = await api.async_get_lines()
        except LogronoApiError:
            return False
        return bool(self._lines)

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if not await self._ensure_lines():
            return self.async_abort(reason="cannot_connect")

        if user_input is not None:
            self._line = find_line(self._lines, user_input[CONF_LINE_ID])
            return await self.async_step_direction()

        options = [
            SelectOptionDict(
                value=str(line["id"]),
                label=f"{public_line_number(line)} · {_readable_line(line)}",
            )
            for line in sorted(
                self._lines,
                key=lambda ln: (len(public_line_number(ln)), public_line_number(ln)),
            )
        ]
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_LINE_ID): _select(options)}),
        )

    async def async_step_direction(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        assert self._line is not None
        if user_input is not None:
            self._direction = user_input[CONF_DIRECTION]
            return await self.async_step_stop()

        options = [
            SelectOptionDict(value=d, label=direction_label(self._line, d))
            for d in DIRECTIONS
            if direction_stops(self._line, d)
        ]
        return self.async_show_form(
            step_id="direction",
            data_schema=vol.Schema({vol.Required(CONF_DIRECTION): _select(options)}),
            description_placeholders={"line": _readable_line(self._line)},
        )

    async def async_step_stop(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        assert self._line is not None and self._direction is not None
        line = self._line
        direction = self._direction

        if user_input is not None:
            stop = find_stop(line, direction, user_input[CONF_STOP_ID])
            assert stop is not None
            unique_id = f"{line['id']}_{direction}_{stop['id']}"
            await self.async_set_unique_id(unique_id)
            self._abort_if_unique_id_configured()

            dir_label = direction_label(line, direction)
            return self.async_create_entry(
                title=f"L{public_line_number(line)} · {stop['name']} → "
                f"{direction_stops(line, direction)[-1]['name']}",
                data={
                    CONF_LINE_ID: int(line["id"]),
                    CONF_LINE_NAME: public_line_number(line),
                    CONF_LINE_COLOR: line.get("color"),
                    CONF_DIRECTION: direction,
                    CONF_DIRECTION_LABEL: dir_label,
                    CONF_STOP_ID: int(stop["id"]),
                    CONF_STOP_NAME: stop["name"],
                    CONF_STOP_LAT: stop.get("lat"),
                    CONF_STOP_LNG: stop.get("lng"),
                },
            )

        options = [
            SelectOptionDict(value=str(stop["id"]), label=stop["name"])
            for stop in direction_stops(line, direction)
        ]
        return self.async_show_form(
            step_id="stop",
            data_schema=vol.Schema({vol.Required(CONF_STOP_ID): _select(options)}),
            description_placeholders={
                "line": _readable_line(line),
                "direction": direction_label(line, direction),
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return LogronoOptionsFlow(config_entry)


class LogronoOptionsFlow(OptionsFlow):
    """Edit the polling (scan) interval."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        self._entry = config_entry

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title="",
                data={CONF_SCAN_INTERVAL: int(user_input[CONF_SCAN_INTERVAL])},
            )

        current = self._entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_SCAN_INTERVAL, default=current): NumberSelector(
                        NumberSelectorConfig(
                            min=MIN_SCAN_INTERVAL,
                            max=MAX_SCAN_INTERVAL,
                            step=5,
                            unit_of_measurement="s",
                            mode=NumberSelectorMode.SLIDER,
                        )
                    )
                }
            ),
        )
