# Agent instructions (ha-logrono-bus)

- Home Assistant custom integration for the `logrono-bus` library (https://github.com/chiva/logrono-bus).
  Domain logic belongs in the library; this repo only adapts it to Home Assistant.
- Code and comments in English; user-facing strings in Spanish (`strings.json`, copied to
  `translations/es.json` and `translations/en.json`).
- Checks: `uv run ruff check .`, `uv run ruff format --check .`, `uv run mypy`, `uv run pytest --cov`
  (90 % floor). Validate with hassfest before release.
- `custom_components/logrono_bus/frontend/logrono-bus-card.js` is generated: build it in
  chiva/logrono-bus with `uv run just ha-card` (source in `web/packages/ha-card`), never edit it here.
- The library pin appears in `manifest.json` and in `pyproject.toml` (group `runtime`): keep them equal.
- Conventional Commits. Only push or open PRs when the maintainer asks.
