/**
 * Logroño Bus map card — a Leaflet + OpenStreetMap Lovelace card.
 *
 * Reads everything from one `sensor.*_next_bus` entity's attributes
 * (line_stops, stop_lat/lng, vehicles, line_color), so it needs no direct
 * API access and no CORS.
 *
 * Config:
 *   type: custom:logrono-bus-map-card
 *   entity: sensor.l10_ayuntamiento_artesanos_next_bus
 *   mode: line          # "line" = whole route + every bus
 *                       # "stop" = zoom to the stop + the nearest approaching bus
 *   zoom: 15            # optional, used as the base zoom in "stop" mode
 *   title: "Línea 10"   # optional
 */

const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

let _leafletPromise = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (_leafletPromise) return _leafletPromise;
  _leafletPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.onload = () => resolve(window.L);
    script.onerror = () => {
      script.remove(); // don't leave a dead <script> behind to accumulate
      _leafletPromise = null; // don't cache the failure — allow a later retry
      reject(new Error("Failed to load Leaflet from CDN"));
    };
    document.head.appendChild(script);
  });
  return _leafletPromise;
}

// Leaflet renders tooltip / divIcon content as HTML, so anything derived from
// the upstream API must be escaped before interpolation.
function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

// Only let a strict color literal reach an inline style; otherwise fall back.
function safeColor(value, fallback = "#1976d2") {
  const v = String(value ?? "").trim();
  return /^(#[0-9a-fA-F]{3,8}|rgba?\([\d.,\s%]+\))$/.test(v) ? v : fallback;
}

function haversine(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

class LogronoBusMapCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("You must set an `entity`.");
    this._config = { mode: "line", zoom: 15, ...config };
    this._built = false;
  }

  set hass(hass) {
    const prev = this._hass;
    this._hass = hass;
    if (!this._config) return;
    // HA calls this setter on every state change anywhere; only re-render when
    // the watched entity actually changed (or we haven't built yet), so we
    // don't tear down markers and refit the viewport constantly.
    const ent = this._config.entity;
    if (this._built && prev && prev.states[ent] === hass.states[ent]) return;
    // While Leaflet failed to load we retry, but back off so an outage doesn't
    // re-attempt on every unrelated HA state push.
    if (!this._built && this._retryAt && Date.now() < this._retryAt) return;
    this._render();
  }

  getCardSize() {
    return 6;
  }

  async _render() {
    if (!this._hass || !this._config) return;
    const state = this._hass.states[this._config.entity];
    if (!state) return;

    if (!this._built) {
      this._built = true;
      this._buildShell();
      try {
        this._L = await loadLeaflet();
      } catch (err) {
        this._body.textContent = err.message;
        this._body.style.cssText += ";padding:16px;color:var(--error-color)";
        this._built = false; // let a later hass update retry the CDN load…
        this._retryAt = Date.now() + 15000; // …but not more than ~every 15s
        return;
      }
      this._initMap();
    }
    if (this._map) this._update(state.attributes);
  }

  _buildShell() {
    this.innerHTML = "";
    const card = document.createElement("ha-card");
    if (this._config.title) card.header = this._config.title;
    this._body = document.createElement("div");
    this._body.style.cssText = "height:320px;width:100%;border-radius:12px;overflow:hidden";
    card.appendChild(this._body);
    this.appendChild(card);
  }

  disconnectedCallback() {
    // Tear down Leaflet so map instances and their document-level handlers
    // don't leak when the card is removed or the view is torn down.
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
    this._built = false;
  }

  _initMap() {
    const L = this._L;
    if (this._map) this._map.remove(); // dispose any previous instance first
    this._fitted = false; // fresh map — allow one initial fit (bus-inclusive)
    this._centered = false; // and one no-bus centering
    this._map = L.map(this._body, { zoomControl: true, attributionControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(this._map);
    this._layer = L.layerGroup().addTo(this._map);
    // Re-fit once tiles/container settle.
    setTimeout(() => this._map.invalidateSize(), 200);
  }

  _busIcon(color, label) {
    return this._L.divIcon({
      className: "logrono-bus-icon",
      html: `<div style="background:${color};color:#fff;border:2px solid #fff;border-radius:50%;
        width:26px;height:26px;display:flex;align-items:center;justify-content:center;
        font-size:11px;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,.4)">${label}</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  }

  _stopIcon() {
    return this._L.divIcon({
      className: "logrono-stop-icon",
      html: `<div style="background:#fff;border:3px solid #d32f2f;border-radius:4px;
        width:18px;height:18px;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }

  _update(attrs) {
    const L = this._L;
    this._layer.clearLayers();

    const color = safeColor(attrs.line_color);
    const stops = Array.isArray(attrs.line_stops) ? attrs.line_stops : [];
    const vehicles = Array.isArray(attrs.vehicles) ? attrs.vehicles : [];
    const stop =
      attrs.stop_lat != null && attrs.stop_lng != null
        ? [attrs.stop_lat, attrs.stop_lng]
        : stops.length
        ? stops[0]
        : null;

    if (this._config.mode === "stop") {
      this._renderStopMode(color, stop, vehicles);
    } else {
      this._renderLineMode(color, stops, stop, vehicles);
    }
  }

  _renderLineMode(color, stops, stop, vehicles) {
    const L = this._L;
    const bounds = [];
    if (stops.length > 1) {
      L.polyline(stops, { color, weight: 5, opacity: 0.8 }).addTo(this._layer);
      stops.forEach((p) => bounds.push(p));
    }
    if (stop) {
      L.marker(stop, { icon: this._stopIcon() })
        .bindTooltip("Parada", { direction: "top" })
        .addTo(this._layer);
      bounds.push(stop);
    }
    vehicles.forEach((v) => {
      if (v.lat == null || v.lng == null) return;
      const label = v.delay_minutes > 0 ? `+${esc(v.delay_minutes)}` : "🚌";
      L.marker([v.lat, v.lng], { icon: this._busIcon(color, label) })
        .bindTooltip(`Bus ${esc(v.ref)}`, { direction: "top" })
        .addTo(this._layer);
      bounds.push([v.lat, v.lng]);
    });
    // Fit only once so live bus updates don't yank the viewport back while the
    // user is panning/zooming.
    if (bounds.length && !this._fitted) {
      this._map.fitBounds(bounds, { padding: [24, 24] });
      this._fitted = true;
    }
  }

  _renderStopMode(color, stop, vehicles) {
    const L = this._L;
    if (!stop) return;
    L.marker(stop, { icon: this._stopIcon() })
      .bindTooltip("Parada", { direction: "top", permanent: false })
      .addTo(this._layer);

    // Nearest bus to the stop.
    let nearest = null;
    let best = Infinity;
    vehicles.forEach((v) => {
      if (v.lat == null || v.lng == null) return;
      const d = haversine(stop, [v.lat, v.lng]);
      if (d < best) {
        best = d;
        nearest = v;
      }
    });

    if (nearest) {
      const label = nearest.delay_minutes > 0 ? `+${esc(nearest.delay_minutes)}` : "🚌";
      L.marker([nearest.lat, nearest.lng], { icon: this._busIcon(color, label) })
        .bindTooltip(`Bus ${esc(nearest.ref)} · ${Math.round(best)} m`, { direction: "top" })
        .addTo(this._layer);
      if (!this._fitted) {
        this._map.fitBounds([stop, [nearest.lat, nearest.lng]], { padding: [40, 40] });
        this._fitted = true;
      }
    } else if (!this._fitted && !this._centered) {
      // Centre on the stop once when no bus is near — but keep `_fitted` false
      // so the FIRST bus to appear still triggers exactly one fit.
      this._map.setView(stop, this._config.zoom);
      this._centered = true;
    }
  }

  static getStubConfig() {
    return { entity: "", mode: "stop", zoom: 15 };
  }
}

customElements.define("logrono-bus-map-card", LogronoBusMapCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "logrono-bus-map-card",
  name: "Logroño Bus Map",
  description: "OpenStreetMap view of a Logroño bus line, stop and live buses.",
});
console.info("%c LOGROÑO-BUS-MAP-CARD %c v0.1.0 ", "background:#1976d2;color:#fff", "");
