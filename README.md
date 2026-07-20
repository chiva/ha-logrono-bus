# 🚌 Logroño Bus — Home Assistant integration

Live "next bus" predictions for the **Logroño (La Rioja) urban bus network**, straight in Home
Assistant. Configure the stops near you and the lines you care about entirely from the UI, see a
countdown to the next bus that ticks every second, drill into frequency / first & last pass, and put
the line and live buses on an OpenStreetMap map.

Data comes from the city's official portal (`transporteurbano.logrono.es`) — public, no API key.
See [`docs/API.md`](docs/API.md) for the full reverse-engineered API reference. Unofficial project,
not affiliated with the Ayuntamiento de Logroño or the operator.

---

## Features

- **UI configuration** — add a target by picking **Line → Direction → Stop** from dropdowns. No YAML.
- **Live countdown** — the sensor is a `timestamp` entity, so the dashboard shows "in 5 min" and
  updates every second without hammering the API (polling defaults to 30 s, adjustable).
- **Details** — frequency (headway), first & last pass, exposed as attributes.
- **Edge cases handled** — "no service / no estimation", "arriving now", "< 1 min", early/late buses.
- **Maps (OpenStreetMap)** — a custom card with two modes: the **whole line + every live bus**, or
  **zoomed to your stop + the nearest approaching bus**. Buses are also exposed as `device_tracker`
  entities for the built-in HA map card.
- **Spanish & English** translations.

## Install

### HACS (recommended)
1. HACS → ⋮ → **Custom repositories** → add `https://github.com/chiva/ha-logrono-bus`,
   category **Integration**.
2. Install **Logroño Bus**, then restart Home Assistant.

### Manual
Copy `custom_components/logrono_bus/` into your HA config's `custom_components/` folder and restart.

## Configure

**Settings → Devices & Services → Add Integration → “Logroño Bus”**, then pick Line → Direction →
Stop. Repeat **Add** for each target. Change the refresh interval later via the integration's
**Configure** (options) button.

Example — riding from the town hall toward the hospital:

| Line | Direction | Board at | Resolves to |
|---|---|---|---|
| 10 | toward Hospital San Pedro (`asc`) | Ayuntamiento | `byStop 000100, lines=10` |
| 2  | toward Artesanos (`asc`)          | Ayuntamiento | `byStop 000100, lines=2`  |

> Note: a stop's two platforms (each side of the street) have different ids — e.g. **Ayuntamiento**
> is `100` in one direction and `101` in the other — which is exactly why the direction picker
> matters: the stop id already encodes the direction.

Each target creates one sensor, e.g. `sensor.l10_ayuntamiento_artesanos_next_bus`, whose:
- **state** = timestamp of the next bus (renders as a live countdown),
- **attributes** = `minutes`, `delay_minutes`, `next_arrivals[]`, `first_pass`, `last_pass`,
  `interval_minutes`, plus `line_stops`, `vehicles`, `stop_lat/lng` for the map card.

## Dashboard

Ready-made cards are in [`lovelace/dashboard.yaml`](lovelace/dashboard.yaml). Highlights:

**Simple list (auto-ticking countdown):**
```yaml
type: entities
title: Autobuses
entities:
  - entity: sensor.l10_ayuntamiento_artesanos_next_bus
  - entity: sensor.l2_ayuntamiento_artesanos_next_bus
```

**Details card (frequency, first/last, delay):**
```yaml
type: markdown
content: >
  {% set s = states.sensor.l10_ayuntamiento_artesanos_next_bus %}
  ### 🚌 Línea {{ s.attributes.line }} → {{ s.attributes.direction_label }}
  {% if s.state not in ['unknown','unavailable'] -%}
  **Próximo:** {{ ((as_timestamp(s.state) - as_timestamp(now())) / 60) | round(0) }} min
  {%- if s.attributes.delay_minutes and s.attributes.delay_minutes != 0 %}
   ({{ '+' if s.attributes.delay_minutes>0 }}{{ s.attributes.delay_minutes }} min){% endif %}
  {%- else -%}Sin servicio ahora{%- endif %}
  · cada ~{{ s.attributes.interval_minutes }} min
  · primer {{ s.attributes.first_pass }} · último {{ s.attributes.last_pass }}
```

**Maps (OpenStreetMap).** First register the card resource once
(**Settings → Dashboards → ⋮ → Resources → Add**, URL `/local/logrono-bus-map-card.js`, type
JavaScript module) after copying `www/logrono-bus-map-card.js` into your HA `config/www/` folder.

```yaml
# Whole line + every live bus
- type: custom:logrono-bus-map-card
  entity: sensor.l10_ayuntamiento_artesanos_next_bus
  mode: line
  title: Línea 10

# Zoom to the stop + the nearest approaching bus
- type: custom:logrono-bus-map-card
  entity: sensor.l10_ayuntamiento_artesanos_next_bus
  mode: stop
  zoom: 15
```

The native HA `map` card also works for the buses (they're `device_tracker`s):
```yaml
type: map
entities:
  - device_tracker.bus_l10_7290
```

## Test without Home Assistant

`tools/live_check.py` (standard library only) hits the same API from your terminal:

```bash
python3 tools/live_check.py --list-lines
python3 tools/live_check.py --line 10 --direction asc --list-stops
python3 tools/live_check.py --line 10 --stop Ayuntamiento          # next arrivals + schedule
python3 tools/live_check.py --line 10 --stop Ayuntamiento --direction asc --watch 15
```

## Development / tests

```bash
pip install -r requirements_test.txt
pytest                                   # unit suite (offline, mocked)
pytest tests_live/ -p no:homeassistant   # live contract tests (hit the real API)
```
CI runs **hassfest**, **HACS validation**, **ruff + mypy** (`lint.yml`) and **pytest** with coverage
(`test.yml`) on every push. `release-please` automates versioning/changelog and attaches the HACS zip.
Pure logic (`network.py`, API parsers) is unit-tested; config flow and setup/unload use
`pytest-homeassistant-custom-component`.

**Live contract tests** (`tests_live/`) hit the real upstream and assert only its *shape and
invariants* — reusing our own parsers, so a green run means our code still understands the live
payloads. They **skip** (not fail) on a transient 503 or off-hours empty feed, so they only go red on
real API drift. A **weekly** workflow (`live.yml`) runs them and opens a `contract-drift` issue if the
shape changes. `-p no:homeassistant` is required because the HA test plugin otherwise blocks all
network. The weekly cadence also applies to the scheduled `hassfest`/`hacs` validation runs.

## How it works (short version)

- `estimatedTimetable/byStop/{code}?lines=&previewMinutes=` → next arrivals (core sensor).
- `productionTimetable/byLine/{line}` → frequency / first & last pass (details).
- `vehicleMonitoring/byLine/{line}` → live GPS (map + trackers).
- `assets/data/lines.json` → the network for the config-flow dropdowns; the stop `id` zero-padded to
  6 digits **is** the SIRI `stopPointRef`, and the id already encodes direction.

Two coordinators: a fast per-stop **ArrivalsCoordinator** (your interval) and a shared per-line
**LineCoordinator** (15 s vehicles, 6 h schedule).

## License
MIT. Be gentle with the upstream service.
