"""Config for the live contract tests.

Deliberately does NOT enable the pytest-homeassistant-custom-component plugin:
that plugin blocks outbound network ("DNS resolution disabled in tests"), which
is exactly what these tests need. We only put the repo root on sys.path so the
integration's own parsers/helpers can be imported and exercised on live data.
"""

import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
