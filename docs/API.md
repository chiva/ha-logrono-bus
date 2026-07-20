# Logroño Urban Transport — Unofficial API reference

Reverse-engineered from the official portal SPA (`https://transporteurbano.logrono.es`, an Angular
app). **All endpoints below are public and require no authentication or API key.** They are the same
calls the website's own frontend makes. Treat this as unofficial: it can change without notice. Be a
good citizen — poll at sane intervals (this integration defaults to 30 s) and cache the static files.

Captured/verified: **2026-07-20** (during morning service).

## Base URLs

| Thing | URL |
|---|---|
| API base | `https://transporteurbano.logrono.es/api` |
| Static network data | `https://transporteurbano.logrono.es/assets/data/lines.json` |
| Static stop list (partial) | `https://transporteurbano.logrono.es/assets/data/stops.json` |
| Runtime config (feature flags, poll intervals) | `https://transporteurbano.logrono.es/env.js` |

The SPA polls real-time every `VM_POLL_INTERVAL_MS` (10000 ms in prod). Data is SIRI (VM =
Vehicle Monitoring, ET = Estimated Timetable, PT = Production Timetable), served by Indra.

---

## 1. Real-time arrivals at a stop — the core call

```
GET /api/estimatedTimetable/byStop/{stopCode}?lines={csv}&previewMinutes={N}
```

- `{stopCode}` — the stop **id zero-padded to 6 digits** (see mapping below), e.g. `000100`.
- `lines` — comma-separated line ids to include, e.g. `10` or `2,10`. (Filtering is required in practice;
  a wrong/absent match returns an empty list.)
- `previewMinutes` — look-ahead window, e.g. `60`–`120`.

Response:

```json
{ "result": { "arrivals": [
  { "lineRef": "10", "directionRef": "363", "journeyCode": "", "vehicleRef": "10",
    "stopPointRef": "000100", "order": 13,
    "aimedArrivalTime":    "2026-07-20T09:57:29+02:00",
    "expectedArrivalTime": "2026-07-20T09:57:46+02:00",
    "aimedDepartureTime":  "2026-07-20T09:57:29+02:00",
    "expectedDepartureTime":"2026-07-20T09:57:46+02:00",
    "arrivalStatus": "NO_REPORT", "cancellation": false,
    "predictionInaccurate": false, "delaySeconds": 17 }
] } }
```

Field notes:
- `expectedArrivalTime` — the live prediction (ISO 8601 **with local offset**, `+02:00`). This is what
  you count down to. Falls back to `aimedArrivalTime` (schedule) when no live prediction.
- `delaySeconds` — signed; **negative = running early**, positive = late.
- `directionRef` here is an internal **numeric** direction code (e.g. `363`, `415`, `418`) — NOT
  "Ida"/"Vuelta". You normally don't need it: the stop code already fixes the direction (see below).
- `predictionInaccurate: true` — take the ETA with a grain of salt.

### Edge cases (all verified)
| Situation | Response |
|---|---|
| Stop not served / no bus within `previewMinutes` | `{"result":{"arrivals":[]}}` |
| Non-existent stop code (`000999`) | `{"result":{"arrivals":[]}}` (empty, not 404) |
| Wrong `lines` filter for that stop | `{"result":{"arrivals":[]}}` |
| Bus imminent / due | normal entry with `expectedArrivalTime` ≈ now; may be slightly in the past |
| "Arriving now" / "< 1 min" | **not a flag** — derive client-side from `expectedArrivalTime − now` |
| Outside service hours (night) | empty arrivals across all lines |

There is **no** `arrivalStatus` value that means "arriving"; compute the human state yourself:
`≤ ~30 s or past → "llegando/now"`, `< 60 s → "< 1 min"`, else `round(minutes)`.

---

## 2. Real-time arrivals for a whole line

```
GET /api/estimatedTimetable/byLine/{lineId}?previewMinutes={N}
```
Same `arrivals[]` shape, for every stop on the line. Useful to discover which `stopPointRef`s are live
and to sanity-check the id↔code mapping.

---

## 3. Scheduled timetable / frequency / first & last pass (the "details")

```
GET /api/productionTimetable/byLine/{lineId}
```
```json
{ "result": {
  "frequencies": [ { "from":"07:00","to":"22:45","intervalMinutes":15,
                     "firstPass":"07:00","lastPass":"22:45","passCount":68,"intervalMinutesMax":15 } ],
  "frequenciesByDirection": { "Ida":[ … ], "Vuelta":[ … ] },
  "passes": ["07:00","07:15", …],
  "passesByDirection": { "Ida":[…], "Vuelta":[…] }
} }
```
- `firstPass` / `lastPass` — service window.
- `intervalMinutes` / `intervalMinutesMax` — headway (how often).
- `passCount` — number of departures that period.
- Changes slowly (schedule): fetch at most hourly.

---

## 4. Live vehicle positions (GPS)

```
GET /api/vehicleMonitoring/all
GET /api/vehicleMonitoring/byLine/{lineId}
```
```json
{ "result": { "activities": [
  { "vehicleRef":"0609","lineRef":"10","directionRef":"Ida",
    "publishedLineName":"EL ARCO-HOSPITAL SAN PEDRO",
    "latitude":42.465000,"longitude":-2.445000,
    "locationRecordedAtTime":"2026-07-20T07:55:30Z",
    "delaySeconds":26,"monitored":true,"confidenceLevel":"CERTAIN",
    "nextStopRef":"0100",
    "nextStopExpectedArrivalTime":"2026-07-20T09:57:54Z",
    "nextStopAimedArrivalTime":"2026-07-20T09:55:19Z" }
] } }
```
Field notes:
- `latitude` / `longitude` — WGS84, for map markers.
- `directionRef` here **is** `"Ida"`/`"Vuelta"` (unlike the ET feed's numeric code).
- `nextStopRef` — the vehicle's immediate next stop (4-digit here, e.g. `0069`; zero-pad differences —
  VM uses 4 digits, ET uses 6). For "next bus at MY stop" prefer the ET `byStop` feed above; use VM
  only for the moving map.
- In `vehicleMonitoring/all`, some rows have `lineRef:"[object Object]"` / `publishedLineName:"[object Object]"`
  — a server-side serialization bug. Filter those out; use `byLine/{id}` for clean per-line data.

---

## 5. Static network data — `assets/data/lines.json`

Array of lines; each has stops in both directions:

```json
[ { "id": 10, "name": "10-EL ARCO-HOSPITAL SAN PEDRO", "color": "rgba(0,0,0,1)",
    "stops": {
      "asc":  [ … , {"id":100,"name":"Ayuntamiento","lat":…,"lng":…,"lines":[2,10]}, … ,
                    {"id":35,"name":"Hospital San Pedro","lat":…,"lng":…,"lines":[10]}, … ],
      "desc": [ … , {"id":101,"name":"Ayuntamiento","lat":…,"lng":…,"lines":[2,10]}, … ]
    } } ]
```
- `stops.asc` / `stops.desc` are the two directions, **in travel order** (index 0 = origin,
  last = terminus). Direction label = `f"{dir[0].name} → {dir[-1].name}"`.
- Each stop: `id`, `name`, `lat`, `lng`, `status`, `lines[]`.
- `color` — the line's brand colour (rgba), handy for map polylines.

### THE mapping (critical)
> **SIRI `stopPointRef` = the lines.json stop `id`, zero-padded to 6 digits.**
> e.g. id `100` → `000100`, id `35` → `000035`.

**Direction is encoded in the stop id.** A physical street has two platforms with different ids; the
`asc` list and `desc` list therefore reference different ids for the "same" named stop. So filtering
`byStop/{code}?lines={line}` inherently gives you one direction — you don't need `directionRef`.

Worked example — **Ayuntamiento** (City Hall, a central landmark) on **line 10** (which runs past the
town hall to **Hospital San Pedro**):
| Direction | lines.json dir | Ayuntamiento id → code |
|---|---|---|
| toward Hospital San Pedro | `asc` | `100` → `000100` |
| the return | `desc` | `101` → `000101` |

The two platforms sit across the street from each other, so the direction you want determines which
6-digit code you query. To confirm which numeric `directionRef` corresponds to which named direction,
match a live `estimatedTimetable/byLine` stop sequence against the `asc`/`desc` order in `lines.json`
(the ET `order` field increases along the direction of travel).

`assets/data/stops.json` is a smaller/older flat `[{id,name,lat,lng,status}]` list and does **not**
contain every stop — prefer `lines.json` as the source of truth.

---

## 6. Line inventory (from lines.json `name`)
`33 B3-LARDERO-EL CAMPILLO · 11 · 1 · 2 · 3 · 4 · 5 · 6 · 7 · 9 · 10 · 31 (B1) · 32 (B2)`
(ids are the `id` field; the leading number in `name` is the public line number.)

---

## 7. Other endpoints seen in the bundle (not used here)
`/api/transit/route` (journey planner, POST), `/api/vehicleMonitoring/byLine/{l}`,
`/api/estimatedTimetable/byLine/{l}`, plus ticketing/account endpoints behind Keycloak
(`/auth/`, realm `log-web-ext-realm`) — irrelevant to arrivals. Routing/geocoding use public
OSRM/Nominatim/Photon and an OTP instance at the portal origin.

## Quick manual test (no HA)
```bash
BASE=https://transporteurbano.logrono.es/api
curl -s "$BASE/estimatedTimetable/byStop/000100?lines=2&previewMinutes=90" | jq
curl -s "$BASE/productionTimetable/byLine/2" | jq '.result.frequenciesByDirection'
curl -s "$BASE/vehicleMonitoring/byLine/2" | jq '.result.activities[] | {vehicleRef,latitude,longitude}'
```
Or use `tools/live_check.py` in this repo (stdlib only).
