#!/usr/bin/env python3
"""Check Logroño bus arrivals from the command line — no Home Assistant needed.

Examples
--------
    python3 tools/live_check.py --list-lines
    python3 tools/live_check.py --line 10 --direction asc --list-stops
    python3 tools/live_check.py --line 10 --stop Ayuntamiento
    python3 tools/live_check.py --line 10 --stop Ayuntamiento --direction asc
    python3 tools/live_check.py --line 10 --stop Ayuntamiento --watch 15

Only uses the Python standard library, so it runs anywhere.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.request
from datetime import UTC, datetime

API_BASE = "https://transporteurbano.logrono.es/api"
LINES_URL = "https://transporteurbano.logrono.es/assets/data/lines.json"
PREVIEW_MINUTES = 90


def _get(url: str, retries: int = 3):
    last_err = None
    for attempt in range(retries):
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (logrono-bus-cli)"})
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as err:
            last_err = err
            if err.code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                time.sleep(2 * (attempt + 1))
                continue
            break
        except (urllib.error.URLError, TimeoutError) as err:
            last_err = err
            if attempt < retries - 1:
                time.sleep(2 * (attempt + 1))
                continue
            break
    print(
        f"error: could not reach the Logroño transport service ({last_err}).\n"
        f"       The upstream is sometimes temporarily unavailable (503) — try again shortly.",
        file=sys.stderr,
    )
    sys.exit(2)


def load_lines():
    return _get(LINES_URL)


def find_line(lines, line_id):
    return next((ln for ln in lines if str(ln.get("id")) == str(line_id)), None)


def direction_label(line, d):
    stops = (line.get("stops") or {}).get(d) or []
    return f"{stops[0]['name']} → {stops[-1]['name']}" if stops else d


def resolve_stop(line, direction, name):
    """Find a stop id by (case-insensitive) name; try both directions if needed."""
    dirs = [direction] if direction and direction != "auto" else ["asc", "desc"]
    for d in dirs:
        for stop in (line.get("stops") or {}).get(d) or []:
            if stop["name"].lower() == name.lower():
                return d, stop
    # loose contains-match fallback
    for d in dirs:
        for stop in (line.get("stops") or {}).get(d) or []:
            if name.lower() in stop["name"].lower():
                return d, stop
    return None, None


def fmt_eta(iso: str) -> str:
    dt = datetime.fromisoformat(iso)
    if dt.tzinfo is None:  # tolerate a timestamp served without an offset
        dt = dt.astimezone()
    secs = (dt - datetime.now(UTC).astimezone()).total_seconds()
    if secs <= 30:
        human = "llegando (now)"
    elif secs < 60:
        human = "< 1 min"
    else:
        human = f"{round(secs / 60)} min"
    return f"{dt.strftime('%H:%M:%S')}  ({human})"


def show_arrivals(line_id, stop, once=False):
    code = f"{int(stop['id']):06d}"
    url = f"{API_BASE}/estimatedTimetable/byStop/{code}?lines={line_id}&previewMinutes={PREVIEW_MINUTES}"
    data = _get(url)
    arrivals = sorted(
        (
            a
            for a in (data.get("result") or {}).get("arrivals") or []
            if a.get("expectedArrivalTime")
        ),
        key=lambda a: a["expectedArrivalTime"],
    )
    stamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{stamp}] Line {line_id} @ {stop['name']} (code {code})")
    if not arrivals:
        print("   · no estimation (sin servicio / no bus in window)")
        return
    for a in arrivals[:5]:
        delay = a.get("delaySeconds", 0)
        tag = f" delay {delay:+d}s" if delay else ""
        flag = "  ⚠inaccurate" if a.get("predictionInaccurate") else ""
        print(f"   · {fmt_eta(a['expectedArrivalTime'])}{tag}{flag}")


def show_timetable(line_id):
    data = _get(f"{API_BASE}/productionTimetable/byLine/{line_id}")
    result = data.get("result") or {}
    freqs = result.get("frequencies") or [{}]
    f = freqs[0]
    print(
        f"Line {line_id} schedule: first {f.get('firstPass')}  last {f.get('lastPass')}  "
        f"every ~{f.get('intervalMinutes')} min  ({f.get('passCount')} passes/period)"
    )


def main(argv=None):
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    p.add_argument("--line")
    p.add_argument("--stop")
    p.add_argument("--direction", choices=["asc", "desc", "auto"], default="auto")
    p.add_argument("--list-lines", action="store_true")
    p.add_argument("--list-stops", action="store_true")
    p.add_argument("--watch", type=int, metavar="SECONDS", help="repeat every N seconds")
    args = p.parse_args(argv)

    lines = load_lines()

    if args.list_lines:
        for ln in sorted(lines, key=lambda x: (len(str(x["name"].split("-")[0])), str(x["name"]))):
            print(f"  {ln['id']:>4}  {ln['name']}")
        return 0

    if not args.line:
        p.error("--line is required (or use --list-lines)")
    line = find_line(lines, args.line)
    if not line:
        p.error(f"line {args.line} not found")

    if args.list_stops:
        for d in ("asc", "desc"):
            if args.direction not in ("auto", d):
                continue
            print(f"\n== {d}: {direction_label(line, d)} ==")
            for s in (line.get("stops") or {}).get(d) or []:
                print(f"  {s['id']:>4}  {s['name']}")
        return 0

    if not args.stop:
        p.error("--stop NAME is required (or use --list-stops)")
    direction, stop = resolve_stop(line, args.direction, args.stop)
    if not stop:
        p.error(f"stop '{args.stop}' not found on line {args.line}")
    print(f"Direction: {direction} ({direction_label(line, direction)})")
    show_timetable(args.line)
    print()

    if args.watch:
        try:
            while True:
                show_arrivals(args.line, stop)
                time.sleep(args.watch)
                print()
        except KeyboardInterrupt:
            return 0
    else:
        show_arrivals(args.line, stop)
    return 0


if __name__ == "__main__":
    sys.exit(main())
