//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, r = "0.1.0", i, a, o, s, c, l, u, d = t((() => {
	i = class extends Error {
		constructor(...e) {
			super(...e), this.name = "LogronoBusError";
		}
	}, a = class extends i {
		constructor(...e) {
			super(...e), this.name = "UpstreamError";
		}
	}, o = class extends a {
		constructor(...e) {
			super(...e), this.name = "UpstreamUnavailable";
		}
	}, s = class extends a {
		constructor(e, t) {
			super(`${t}: ${e}`), this.name = "UpstreamSchemaError", this.path = t;
		}
	}, c = class extends i {
		constructor(e) {
			super(`La parada '${e}' no existe`), this.name = "StopNotFound", this.stopId = e;
		}
	}, l = class extends i {
		constructor(e) {
			super(`La línea '${e}' no existe`), this.name = "LineNotFound", this.lineId = e;
		}
	}, u = class extends i {
		constructor(...e) {
			super(...e), this.name = "InvalidSelection";
		}
	};
}));
//#endregion
//#region ../core/src/geo.ts
function f(e, t, n, r) {
	let i = m(e), a = m(n), o = a - i, s = m(r - t), c = Math.sin(o / 2) ** 2 + Math.cos(i) * Math.cos(a) * Math.sin(s / 2) ** 2;
	return 2 * p * Math.asin(Math.sqrt(c));
}
var p, m, ee = t((() => {
	p = 6371008.8, m = (e) => e * Math.PI / 180;
}));
//#endregion
//#region ../core/src/models.ts
function te(e, t) {
	let n = /^\d+$/.test(e), r = /^\d+$/.test(t);
	return n && r ? Number(e) - Number(t) : n === r ? ne(e, t) : n ? -1 : 1;
}
function ne(e, t) {
	return e === t ? 0 : e < t ? -1 : 1;
}
function re(e, t) {
	return Math.max(0, Math.floor(((typeof e == "number" ? e : Date.parse(e)) - (typeof t == "number" ? t : Date.parse(t))) / 6e4));
}
var ie, ae, oe = t((() => {
	ie = ["asc", "desc"], ae = "Europe/Madrid";
}));
//#endregion
//#region ../core/src/text.ts
function se(e) {
	return e.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().trim().split(/\s+/).filter(Boolean).join(" ");
}
function ce(e) {
	return e.trim().toLowerCase().split(/\s+/).filter(Boolean).map((e, t) => t > 0 && le.has(e) ? e : e.slice(0, 1).toUpperCase() + e.slice(1)).join(" ");
}
var le, ue = t((() => {
	le = /* @__PURE__ */ new Set([
		"a",
		"de",
		"del",
		"el",
		"en",
		"la",
		"las",
		"los",
		"y"
	]);
}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/checkPrivateRedeclaration.js
function de(e, t) {
	if (t.has(e)) throw TypeError("Cannot initialize the same private elements twice on an object");
}
var fe = t((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/classPrivateFieldInitSpec.js
function h(e, t, n) {
	de(e, t), t.set(e, n);
}
var g = t((() => {
	fe();
}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/assertClassBrand.js
function _(e, t, n) {
	if (typeof e == "function" ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw TypeError("Private element is not present on this object");
}
var v = t((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/classPrivateFieldSet2.js
function y(e, t, n) {
	return e.set(_(e, t), n), n;
}
var b = t((() => {
	v();
}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/classPrivateFieldGet2.js
function x(e, t) {
	return e.get(_(e, t));
}
var S = t((() => {
	v();
}));
//#endregion
//#region ../core/src/catalog.ts
function pe(e, t) {
	let n = e.stop_ids.indexOf(t);
	return n === -1 ? null : n + 1;
}
function me(e, t) {
	return e.stop_ids.length > 0 && e.stop_ids[e.stop_ids.length - 1] === t;
}
var he, ge, _e, ve, ye, be = t((() => {
	d(), ee(), oe(), ue(), g(), b(), S(), he = /* @__PURE__ */ new WeakMap(), ge = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), ve = /* @__PURE__ */ new WeakMap(), ye = class {
		constructor(e) {
			h(this, he, void 0), h(this, ge, void 0), h(this, _e, void 0), h(this, ve, void 0), this.catalog = e, y(he, this, new Map(e.lines.map((e) => [e.id, e]))), y(ge, this, new Map(e.stops.map((e) => [e.id, e]))), y(_e, this, new Map(e.patterns.map((e) => [e.id, e])));
			let t = /* @__PURE__ */ new Map();
			for (let n of e.patterns) for (let e of new Set(n.stop_ids)) {
				let r = t.get(e) ?? [];
				r.push(n), t.set(e, r);
			}
			y(ve, this, t);
		}
		get lines() {
			return this.catalog.lines;
		}
		get stops() {
			return this.catalog.stops;
		}
		hasLine(e) {
			return x(he, this).has(e);
		}
		line(e) {
			let t = x(he, this).get(e);
			if (!t) throw new l(e);
			return t;
		}
		stop(e) {
			let t = x(ge, this).get(e);
			if (!t) throw new c(e);
			return t;
		}
		findStop(e) {
			return x(ge, this).get(e);
		}
		pattern(e) {
			return x(_e, this).get(e);
		}
		patternsForLine(e) {
			return this.catalog.patterns.filter((t) => t.line_id === e);
		}
		patternsAt(e) {
			return x(ve, this).get(e) ?? [];
		}
		nearby(e, t, { radiusM: n = 500, limit: r = 10 } = {}) {
			return this.catalog.stops.map((n) => ({
				stop: n,
				distance_m: f(e, t, n.lat, n.lon)
			})).filter((e) => e.distance_m <= n).sort((e, t) => e.distance_m - t.distance_m || ne(e.stop.id, t.stop.id)).slice(0, r);
		}
		search(e, { limit: t = 20 } = {}) {
			let n = se(e);
			if (!n) return [];
			let r = x(ge, this).get(n), i = this.catalog.stops.filter((e) => e !== r && se(e.name).includes(n)).map((e) => ({
				stop: e,
				startsWith: se(e.name).startsWith(n)
			})).sort((e, t) => Number(t.startsWith) - Number(e.startsWith) || ne(e.stop.name, t.stop.name) || ne(e.stop.id, t.stop.id)).map(({ stop: e }) => e);
			return [...r ? [r] : [], ...i].slice(0, t);
		}
	};
}));
//#endregion
//#region ../core/src/selection.ts
function xe(e) {
	return e === "asc" ? "a" : e === "desc" ? "d" : "x";
}
function Se(e, t) {
	return t.line_id === e.line_id && (e.direction === null || t.direction === e.direction);
}
function Ce(e) {
	return e.map((e) => {
		let t = e.lines.map((e) => `${e.line_id}${xe(e.direction)}`).join(".");
		return t ? `${e.stop_id}-${t}` : e.stop_id;
	}).join("~");
}
var we = t((() => {}));
//#endregion
//#region ../core/src/cards.ts
function Te(e, t) {
	return t.lines.length > 0 ? [...t.lines] : e.patternsAt(t.stop_id).filter((e) => !me(e, t.stop_id)).map((e) => ({
		line_id: e.line_id,
		direction: e.direction
	}));
}
function Ee(e, t, n, r = 3) {
	let i = e.stop(t.stop_id), a = [], o = /* @__PURE__ */ new Map();
	for (let n of Te(e, t)) e.hasLine(n.line_id) && !o.has(ke(n)) && (a.push(n), o.set(ke(n), []));
	for (let r of n.arrivals) {
		var s;
		if (r.stop_id !== i.id) continue;
		let n = a.find((e) => Se(e, r));
		!n && r.direction === null && t.lines.length === 0 && e.hasLine(r.line_id) && (n = {
			line_id: r.line_id,
			direction: null
		}, a.push(n), o.set(ke(n), [])), n && ((s = o.get(ke(n))) == null || s.push(r));
	}
	return a.map((t) => {
		let n = e.line(t.line_id), a = t.direction ? e.pattern(`${t.line_id}:${t.direction}`) : void 0;
		return {
			stop_id: i.id,
			stop_name: i.name,
			line_id: n.id,
			line_label: n.label,
			line_name: n.name,
			colour: n.colour,
			text_colour: n.text_colour,
			direction: t.direction,
			headsign: (a == null ? void 0 : a.headsign) ?? null,
			arrivals: (o.get(ke(t)) ?? []).slice(0, r)
		};
	});
}
function De(e) {
	let t = e.arrivals.find((e) => !e.cancelled);
	return t ? Date.parse(t.expected) : null;
}
function Oe(e, t) {
	return t === "seleccion" ? [...e] : t === "linea" ? [...e].sort(Ae) : [...e].sort((e, t) => {
		let n = De(e), r = De(t);
		return n === null || r === null ? n === r ? 0 : n === null ? 1 : -1 : n - r || te(e.line_label, t.line_label);
	});
}
var ke, Ae, je = t((() => {
	be(), oe(), we(), ke = (e) => `${e.line_id}${xe(e.direction)}`, Ae = (e, t) => te(e.line_label, t.line_label) || ne(e.headsign ?? "", t.headsign ?? "") || ne(e.stop_name, t.stop_name) || ne(e.stop_id, t.stop_id);
}));
//#endregion
//#region ../core/src/colour.ts
function Me(e) {
	let t = e.trim(), n = ze.exec(t);
	if (n != null && n[1]) return `#${n[1].toUpperCase()}`;
	let r = Re.exec(t);
	if (r) {
		let t = r.slice(1, 4).map(Number);
		if (t.some((e) => e > Ue)) throw RangeError(`Canal de color fuera de rango: '${e}'`);
		return `#${t.map((e) => e.toString(16).padStart(2, "0").toUpperCase()).join("")}`;
	}
	throw RangeError(`Color no reconocido: '${e}'`);
}
function Ne(e) {
	let t = Me(e), n = [
		1,
		3,
		5
	].map((e) => {
		let n = parseInt(t.slice(e, e + 2), 16) / Ue;
		return n <= Be ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
	});
	return Ve.reduce((e, t, r) => e + t * (n[r] ?? 0), 0);
}
function Pe(e, t) {
	let [n, r] = [Ne(e), Ne(t)].sort((e, t) => t - e);
	return (n + He) / (r + He);
}
function Fe(e) {
	return Pe(e, "#000000") >= Pe(e, "#FFFFFF") ? Ie : Le;
}
var Ie, Le, Re, ze, Be, Ve, He, Ue, We = t((() => {
	Ie = "#000000", Le = "#FFFFFF", Re = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)$/i, ze = /^#?([0-9a-f]{6})$/i, Be = .04045, Ve = [
		.2126,
		.7152,
		.0722
	], He = .05, Ue = 255;
}));
//#endregion
//#region ../core/src/route.ts
function Ge(e, t, n, r, i, { previousStops: a = 4, now: o = r.generated_at } = {}) {
	let s = e.pattern(t), c = s ? pe(s, n) : null;
	if (!s || c === null) return null;
	let l = Math.max(1, c - Math.max(0, a)), u = s.stop_ids.slice(l - 1, c).map((t, n) => {
		var r;
		return {
			id: t,
			name: ((r = e.findStop(t)) == null ? void 0 : r.name) ?? t,
			position: l + n,
			terminus: l + n === 1 || l + n === s.stop_ids.length
		};
	}), d = [];
	for (let t of r.vehicles) {
		if (t.pattern_id !== s.id) continue;
		if (t.next_stop_id === null) {
			let n = Ke(e, s, t);
			if (n === null || n > c) continue;
			d.push({
				vehicleId: t.id,
				at: n - l,
				stopsAway: Math.max(0, c - n - 1)
			});
			continue;
		}
		let n = pe(s, t.next_stop_id);
		n === null || n > c || d.push({
			vehicleId: t.id,
			at: n === 1 ? 1 - l : n - 1 - l + qe(e, s, n, t),
			stopsAway: c - n
		});
	}
	d.sort((e, t) => t.at - e.at);
	let f = ((i == null ? void 0 : i.arrivals) ?? []).filter((e) => e.pattern_id === s.id && e.is_realtime && !e.cancelled).map((e) => re(e.expected, o)), p = d.map((e, t) => ({
		...e,
		minutes: f[t] ?? null
	}));
	return {
		patternId: s.id,
		lineId: s.line_id,
		stopId: n,
		origin: s.origin,
		headsign: s.headsign,
		stops: u,
		buses: p.filter((e) => e.at >= 0),
		earlierBuses: p.filter((e) => e.at < 0),
		hiddenStops: l - 1,
		stopsAfter: s.stop_ids.length - c,
		generatedAt: r.generated_at
	};
}
function Ke(e, t, n) {
	let r = null, i = Infinity;
	for (let [a, o] of t.stop_ids.entries()) {
		let t = e.findStop(o);
		if (!t) continue;
		let s = f(t.lat, t.lon, n.lat, n.lon);
		s <= 60 && s < i && (r = a + 1, i = s);
	}
	return r;
}
function qe(e, t, n, r) {
	let i = e.findStop(t.stop_ids[n - 2] ?? ""), a = e.findStop(t.stop_ids[n - 1] ?? "");
	if (!i || !a) return .5;
	let o = f(i.lat, i.lon, r.lat, r.lon), s = f(r.lat, r.lon, a.lat, a.lon);
	return o + s > 0 ? Je(o / (o + s), 0, 1) : 0;
}
var Je, Ye = t((() => {
	be(), ee(), oe(), Je = (e, t, n) => Math.min(n, Math.max(t, e));
}));
//#endregion
//#region ../core/src/config.ts
function Xe(e) {
	let t = Math.round(e / 10) * 10;
	return Math.min(150, Math.max(80, t));
}
function Ze(e) {
	return Math.min(12, Math.max(1, Math.round(e)));
}
var Qe, $e, et, tt, C, nt = t((() => {
	je(), Ye(), Qe = [
		"suave",
		"normal",
		"intensa"
	], $e = [
		"sistema",
		"legible",
		"redondeada",
		"mono"
	], et = [
		"pulso",
		"borde",
		"destello",
		"etiqueta",
		"rayas",
		"ninguno"
	], tt = [
		"seleccion",
		"linea",
		"llegada"
	], C = {
		theme: "auto",
		mode: "panel",
		perCard: 3,
		title: null,
		source: "auto",
		api: null,
		textScale: 100,
		colour: "normal",
		font: "sistema",
		alertMinutes: 3,
		effect: "pulso",
		order: "seleccion",
		previousStops: 4
	};
}));
//#endregion
//#region ../core/src/directions.ts
function rt(e, t, n) {
	if (e.length === 1) return e[0] ?? null;
	if (n === null) return null;
	let r = e.filter((e) => pe(e, t) === n);
	return r.length === 1 ? r[0] ?? null : null;
}
var it, at, ot, st = t((() => {
	be(), g(), b(), S(), it = /* @__PURE__ */ new WeakMap(), at = /* @__PURE__ */ new WeakMap(), ot = class e {
		constructor(e) {
			h(this, it, void 0), h(this, at, /* @__PURE__ */ new Map()), y(it, this, e);
		}
		resolve(t, n, r, i) {
			let a = x(it, this).patternsAt(n).filter((e) => e.line_id === t), o = rt.call(e, a, n, r), s = `${t}\u0000${i}`;
			if (o) return i && x(at, this).set(s, o.id), o;
			let c = i ? x(at, this).get(s) : void 0;
			return c ? a.find((e) => e.id === c) ?? null : null;
		}
	};
}));
//#endregion
//#region ../core/src/raw.ts
function w(e, t) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw new s(`se esperaba un objeto, llegó ${Ct(e)}`, t);
	return e;
}
function ct(e, t) {
	if (!Array.isArray(e)) throw new s(`se esperaba una lista, llegó ${Ct(e)}`, t);
	return e;
}
function T(e, t, n) {
	if (!(t in e)) throw new s("falta el campo", `${n}.${t}`);
	return e[t];
}
function E(e, t) {
	if (typeof e != "string") throw new s(`se esperaba texto, llegó ${Ct(e)}`, t);
	return e.trim();
}
function lt(e, t) {
	if (typeof e != "number" || !Number.isInteger(e)) throw new s(`se esperaba un entero, llegó ${Ct(e)}`, t);
	return e;
}
function ut(e, t) {
	if (typeof e != "number") throw new s(`se esperaba un número, llegó ${Ct(e)}`, t);
	return e;
}
function dt(e, t) {
	if (typeof e != "boolean") throw new s(`se esperaba un booleano, llegó ${Ct(e)}`, t);
	return e;
}
function D(e, t) {
	if (typeof e == "boolean") throw new s("se esperaba un identificador, llegó un booleano", t);
	if (typeof e == "number" && Number.isInteger(e)) return String(e);
	let n = E(e, t);
	if (!n) throw new s("identificador vacío", t);
	return /^\d+$/.test(n) ? String(Number.parseInt(n, 10)) : n;
}
function ft(e, t) {
	return e == null || e === "" ? "" : D(e, t);
}
function pt(e, t) {
	let n = E(e, t), r = wt.exec(n);
	if (!r) {
		let e = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(n);
		throw new s(e ? `fecha sin zona horaria '${n}'` : `fecha no válida '${n}'`, t);
	}
	let [, i, a, o, c = "00", l = "", u = ""] = r, d = l.padEnd(6, "0"), f = `${i}T${a}:${o}:${c}${Number(d) === 0 ? "" : `.${d}`}${u === "Z" ? "+00:00" : u.length === 3 ? `${u}:00` : u.includes(":") ? u : `${u.slice(0, 3)}:${u.slice(3)}`}`;
	if (Number.isNaN(Date.parse(f))) throw new s(`fecha no válida '${n}'`, t);
	return f;
}
function mt(e, t) {
	return ct(T(w(T(w(e, "$"), "result", "$"), "$.result"), t, "$.result"), `$.result.${t}`);
}
function ht(e, t) {
	return ct(e, t).map((e, n) => {
		let r = `${t}[${n}]`, i = w(e, r);
		return {
			id: D(T(i, "id", r), `${r}.id`),
			name: E(T(i, "name", r), `${r}.name`)
		};
	});
}
function gt(e) {
	return mt(e, "lines").map((e, t) => {
		let n = `$.result.lines[${t}]`, r = w(e, n), i = w(T(r, "stops", n), `${n}.stops`);
		return {
			id: D(T(r, "id", n), `${n}.id`),
			name: E(T(r, "name", n), `${n}.name`),
			colour: E(T(r, "color", n), `${n}.color`),
			asc: ht(T(i, "asc", `${n}.stops`), `${n}.stops.asc`),
			desc: ht(T(i, "desc", `${n}.stops`), `${n}.stops.desc`)
		};
	});
}
function _t(e) {
	return mt(e, "stops").map((e, t) => {
		let n = `$.result.stops[${t}]`, r = w(e, n), i = ct(r.lines ?? [], `${n}.lines`);
		return {
			id: D(T(r, "id", n), `${n}.id`),
			name: E(T(r, "name", n), `${n}.name`),
			lat: ut(T(r, "lat", n), `${n}.lat`),
			lon: ut(T(r, "lng", n), `${n}.lng`),
			lineIds: i.map((e, t) => D(e, `${n}.lines[${t}]`))
		};
	});
}
function vt(e) {
	return mt(e, "arrivals").map((e, t) => {
		let n = `$.result.arrivals[${t}]`, r = w(e, n), i = r.order;
		return {
			lineId: D(T(r, "lineRef", n), `${n}.lineRef`),
			stopId: D(T(r, "stopPointRef", n), `${n}.stopPointRef`),
			directionRef: ft(r.directionRef, `${n}.directionRef`),
			vehicleRef: ft(r.vehicleRef, `${n}.vehicleRef`),
			order: i == null ? null : lt(i, `${n}.order`),
			aimed: pt(T(r, "aimedArrivalTime", n), `${n}.aimedArrivalTime`),
			expected: pt(T(r, "expectedArrivalTime", n), `${n}.expectedArrivalTime`),
			arrivalStatus: E(r.arrivalStatus ?? "", `${n}.arrivalStatus`),
			cancelled: dt(r.cancellation ?? !1, `${n}.cancellation`),
			inaccurate: dt(r.predictionInaccurate ?? !1, `${n}.predictionInaccurate`),
			delayS: lt(r.delaySeconds ?? 0, `${n}.delaySeconds`)
		};
	});
}
function yt(e) {
	return mt(e, "activities").map((e, t) => {
		let n = `$.result.activities[${t}]`, r = w(e, n);
		return {
			vehicleRef: D(T(r, "vehicleRef", n), `${n}.vehicleRef`),
			lineId: D(T(r, "lineRef", n), `${n}.lineRef`),
			directionRef: E(r.directionRef ?? "", `${n}.directionRef`),
			lat: ut(T(r, "latitude", n), `${n}.latitude`),
			lon: ut(T(r, "longitude", n), `${n}.longitude`),
			nextStopId: ft(r.nextStopRef, `${n}.nextStopRef`),
			recordedAt: pt(T(r, "locationRecordedAtTime", n), `${n}.locationRecordedAtTime`),
			delayS: lt(r.delaySeconds ?? 0, `${n}.delaySeconds`)
		};
	});
}
function bt(e, t) {
	let n = E(e, t), r = Tt.exec(n), i = r ? Number(r[1]) : NaN, a = r ? Number(r[2]) : NaN;
	if (!r || i > Et || a >= Dt) throw new s(`hora no válida: '${n}'`, t);
	return `${String(i).padStart(2, "0")}:${r[2]}`;
}
function xt(e, t) {
	let n = w(e, t), r = n.intervalMinutesMax;
	return {
		first: bt(T(n, "firstPass", t), `${t}.firstPass`),
		last: bt(T(n, "lastPass", t), `${t}.lastPass`),
		intervalMin: lt(T(n, "intervalMinutes", t), `${t}.intervalMinutes`),
		intervalMaxMin: r == null ? null : lt(r, `${t}.intervalMinutesMax`)
	};
}
function St(e) {
	let t = w(T(w(e, "$"), "result", "$"), "$.result"), n = w(T(t, "frequenciesByDirection", "$.result"), "$.result.frequenciesByDirection"), r = w(T(t, "passesByDirection", "$.result"), "$.result.passesByDirection");
	return [.../* @__PURE__ */ new Set([...Object.keys(r), ...Object.keys(n)])].map((e) => {
		let t = `$.result.passesByDirection.${e}`, i = `$.result.frequenciesByDirection.${e}`;
		return {
			name: e,
			frequencies: ct(n[e] ?? [], i).map((e, t) => xt(e, `${i}[${t}]`)),
			passes: ct(r[e] ?? [], t).map((e, n) => bt(e, `${t}[${n}]`))
		};
	});
}
var Ct, wt, Tt, Et, Dt, Ot = t((() => {
	d(), Ct = (e) => {
		if (e === null) return "NoneType";
		if (Array.isArray(e)) return "list";
		switch (typeof e) {
			case "string": return "str";
			case "boolean": return "bool";
			case "number": return Number.isInteger(e) ? "int" : "float";
			case "object": return "dict";
			default: return typeof e;
		}
	}, wt = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:[.,](\d{1,6}))?)?(Z|[+-]\d{2}(?::?\d{2})?)$/, Tt = /^(\d{1,2}):(\d{2})$/, Et = 29, Dt = 60;
}));
//#endregion
//#region ../core/src/timetable.ts
function kt(e) {
	let t = new Date(typeof e == "number" ? e : Date.parse(e));
	return Object.fromEntries(zt.formatToParts(t).map((e) => [e.type, e.value]));
}
function At(e) {
	let t = kt(e);
	return `${t.year}-${t.month}-${t.day}`;
}
function jt(e) {
	let t = kt(e);
	return Number(t.hour) * 60 + Number(t.minute);
}
function Mt(e, t = null) {
	return t === null || t === e ? `cada ${e} min` : `cada ${e}–${t} min`;
}
function Nt(e) {
	let [t = "0", n = "0"] = e.split(":");
	return Number(t) * 60 + Number(n);
}
function Pt(e) {
	let t = [];
	for (let n of e) {
		let e = Nt(n), r = t[t.length - 1];
		for (; r !== void 0 && e < r;) e += Rt;
		t.push(e);
	}
	return t;
}
function Ft(e, t) {
	let n = (e == null ? void 0 : e.departures) ?? [], r = n[0], i = n[n.length - 1];
	if (!e || r === void 0 || i === void 0) return Bt;
	let a = jt(t), o = Pt(n), s = a < (o[0] ?? 0) ? "antes" : a > (o[o.length - 1] ?? 0) ? "terminado" : "en_servicio", c = o.findIndex((e) => e >= a), l = s === "en_servicio" ? e.periods.find((e) => a <= Nt(e.last)) : void 0;
	return {
		state: s,
		first: r,
		last: i,
		next_departure: c === -1 ? null : n[c] ?? null,
		interval_min: (l == null ? void 0 : l.interval_min) ?? null,
		interval_max_min: (l == null ? void 0 : l.interval_max_min) ?? null
	};
}
function It(e, t) {
	return t ? e == null ? void 0 : e.directions.find((e) => e.pattern_id === t) : void 0;
}
var Lt, Rt, zt, Bt, Vt = t((() => {
	oe(), Lt = [
		"antes",
		"en_servicio",
		"terminado",
		"sin_servicio"
	], Rt = 1440, zt = new Intl.DateTimeFormat("en-GB", {
		timeZone: ae,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}), Bt = {
		state: "sin_servicio",
		first: null,
		last: null,
		next_departure: null,
		interval_min: null,
		interval_max_min: null
	};
}));
//#endregion
//#region ../core/src/normalize.ts
function Ht(e) {
	let t = e.indexOf($t), n = t === -1 ? e : e.slice(0, t), r = (t === -1 ? "" : e.slice(t + 1)).split($t).filter((e) => e.trim()).map(ce);
	return [n.trim(), r.join(en)];
}
function Ut(e) {
	let [t, n] = Ht(e.name), r;
	try {
		r = Me(e.colour);
	} catch (t) {
		throw new s(t.message, `line[${e.id}].color`);
	}
	return {
		id: e.id,
		label: t || e.id,
		name: n || e.name,
		colour: r,
		text_colour: Fe(r)
	};
}
function Wt(e) {
	return ie.flatMap((t) => {
		let n = t === "asc" ? e.asc : e.desc, r = n[0], i = n[n.length - 1];
		return !r || !i ? [] : [{
			id: `${e.id}:${t}`,
			line_id: e.id,
			direction: t,
			origin: r.name,
			headsign: i.name,
			stop_ids: n.map((e) => e.id)
		}];
	});
}
function Gt(e, t) {
	let n = [...new Set(e.lineIds)].filter((e) => t.has(e)).sort(te);
	return {
		id: e.id,
		name: e.name,
		lat: e.lat,
		lon: e.lon,
		line_ids: n
	};
}
function Kt(e, t, n) {
	let r = e.map(Ut).sort((e, t) => te(e.label, t.label)), i = new Map(r.map((e, t) => [e.id, t])), a = e.flatMap(Wt).sort((e, t) => (i.get(e.line_id) ?? 0) - (i.get(t.line_id) ?? 0) || ie.indexOf(e.direction) - ie.indexOf(t.direction)), o = new Set(i.keys());
	return {
		lines: r,
		patterns: a,
		stops: t.map((e) => Gt(e, o)).sort((e, t) => te(e.id, t.id)),
		fetched_at: pt(n, "fetched_at")
	};
}
function qt(e, t, n, r, i) {
	let a = pt(i, "now"), o = Date.parse(a), s = new Set(n.stop(t).line_ids), c = [];
	for (let n of e) {
		if (n.stopId !== t || !s.has(n.lineId) || Date.parse(n.expected) < o - 6e4) continue;
		let e = r.resolve(n.lineId, t, n.order, n.directionRef);
		c.push({
			stop_id: t,
			line_id: n.lineId,
			pattern_id: (e == null ? void 0 : e.id) ?? null,
			direction: (e == null ? void 0 : e.direction) ?? null,
			headsign: (e == null ? void 0 : e.headsign) ?? null,
			aimed: n.aimed,
			expected: n.expected,
			minutes: re(n.expected, o),
			delay_s: n.delayS,
			is_realtime: !!n.vehicleRef && n.arrivalStatus.toLowerCase() !== "scheduled",
			is_approximate: n.inaccurate,
			terminates: e ? me(e, t) : !1,
			cancelled: n.cancelled,
			vehicle_id: n.vehicleRef || null
		});
	}
	return c.sort((e, t) => Date.parse(e.expected) - Date.parse(t.expected) || te(n.line(e.line_id).label, n.line(t.line_id).label)), {
		stop_id: t,
		generated_at: a,
		arrivals: c
	};
}
function Jt(e, t) {
	var n;
	let r = Qt[e.directionRef.toLowerCase()];
	if (r !== void 0 || !e.nextStopId) return r ?? null;
	let i = t.patternsAt(e.nextStopId).filter((t) => t.line_id === e.lineId);
	return i.length === 1 ? ((n = i[0]) == null ? void 0 : n.direction) ?? null : null;
}
function Yt(e, t, n, r) {
	let i = pt(r, "now"), a = Date.parse(i);
	return {
		line_id: t,
		generated_at: i,
		vehicles: e.filter((e) => e.lineId === t && Date.parse(e.recordedAt) >= a - 18e4).map((e) => {
			let r = Jt(e, n), i = r ? n.pattern(`${t}:${r}`) : void 0;
			return {
				id: e.vehicleRef,
				line_id: t,
				direction: r,
				pattern_id: (i == null ? void 0 : i.id) ?? null,
				lat: e.lat,
				lon: e.lon,
				next_stop_id: e.nextStopId || null,
				recorded_at: e.recordedAt,
				delay_s: e.delayS
			};
		}).sort((e, t) => te(e.id, t.id))
	};
}
function Xt(e, t, n, r) {
	let i = pt(r, "now"), a = [];
	for (let r of e) {
		let e = Qt[r.name.toLowerCase()], i = e ? n.pattern(`${t}:${e}`) : void 0;
		i && a.push({
			pattern_id: i.id,
			direction: i.direction,
			origin: i.origin,
			headsign: i.headsign,
			departures: [...r.passes],
			periods: r.frequencies.map((e) => ({
				first: e.first,
				last: e.last,
				interval_min: e.intervalMin,
				interval_max_min: e.intervalMaxMin ?? e.intervalMin
			}))
		});
	}
	return a.sort((e, t) => ie.indexOf(e.direction) - ie.indexOf(t.direction)), {
		line_id: t,
		service_date: At(i),
		generated_at: i,
		directions: a
	};
}
var Zt, Qt, $t, en, tn = t((() => {
	be(), We(), d(), oe(), Ot(), ue(), Vt(), Zt = 18e4, Qt = {
		ida: "asc",
		vuelta: "desc"
	}, $t = "-", en = " – ";
}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/classPrivateMethodInitSpec.js
function O(e, t) {
	de(e, t), t.add(e);
}
var k = t((() => {
	fe();
}));
//#endregion
//#region ../core/src/sources.ts
function nn(e, t) {
	let n = new AbortController(), r = setTimeout(() => n.abort(), t), i = () => n.abort();
	return e != null && e.aborted && n.abort(), e == null || e.addEventListener("abort", i, { once: !0 }), {
		signal: n.signal,
		clear: () => {
			clearTimeout(r), e == null || e.removeEventListener("abort", i);
		}
	};
}
async function rn(e, t, { signal: n, timeoutMs: r = hn } = {}) {
	let i = nn(n, r), a, c;
	try {
		a = await e(t, {
			signal: i.signal,
			headers: { Accept: "application/json" }
		}), c = await a.text();
	} catch (e) {
		throw n != null && n.aborted ? e : new o(`${t}: ${e.name}: ${e.message}`);
	} finally {
		i.clear();
	}
	let l = null;
	if (c) try {
		l = JSON.parse(c);
	} catch {
		if (a.ok) throw new s("JSON no válido", t);
	}
	return {
		response: a,
		body: l
	};
}
function an(e) {
	var t;
	let n = (t = x(Sn, this)) == null ? void 0 : t.get(e);
	if (!n) return null;
	try {
		return JSON.parse(n);
	} catch {
		return null;
	}
}
function on() {
	if (!x(M, this)) {
		let e = _(N, this, sn).call(this).then((e) => {
			let t = new ye(e);
			return {
				index: t,
				resolver: new ot(t)
			};
		});
		e.catch(() => {
			x(M, this) === e && y(M, this, void 0);
		}), y(M, this, e);
	}
	return x(M, this);
}
async function sn() {
	let e = _(N, this, cn).call(this);
	if (e && x(j, this).call(this) - Date.parse(e.fetched_at) < 864e5) return e;
	try {
		var t;
		let [e, n] = await Promise.all([_(N, this, ln).call(this, `${x(A, this)}linesDiscovery/lines`), _(N, this, ln).call(this, `${x(A, this)}linesDiscovery/stops`)]), r = Kt(gt(e), _t(n), bn(x(j, this)));
		return (t = x(Sn, this)) == null || t.set("logrono-bus:catalogo:v1", JSON.stringify(r)), r;
	} catch (t) {
		if (e && t instanceof o) return e;
		throw t;
	}
}
function cn() {
	let e = _(N, this, an).call(this, _n);
	return e && Array.isArray(e.stops) && typeof e.fetched_at == "string" ? e : null;
}
async function ln(e, t) {
	let { response: n, body: r } = await rn(x(xn, this), e, {
		signal: t,
		timeoutMs: x(Cn, this)
	});
	if (n.status === 429 || n.status >= 500) throw new o(`${e}: HTTP ${n.status}`);
	if (!n.ok) throw new s(`HTTP ${n.status} inesperado`, e);
	return r;
}
async function un(e, t) {
	var n;
	let { response: r, body: i } = await rn(x(En, this), `${x(Tn, this)}${e}`, {
		signal: t,
		timeoutMs: x(Dn, this)
	});
	if (r.ok) return i;
	let a = i ?? {}, d = ((n = a.type) == null ? void 0 : n.split(/[#/]/).pop()) ?? "", f = a.detail ?? a.title ?? `HTTP ${r.status}`;
	switch (d) {
		case "parada-no-encontrada": throw new c(e.split("/")[2] ?? "");
		case "linea-no-encontrada": throw new l(e.split("/")[2] ?? "");
		case "seleccion-no-valida": throw new u(f);
		case "origen-cambiado": throw new s(f, e);
		default: throw new o(f);
	}
}
async function dn(e, t) {
	try {
		let { response: n, body: r } = await rn(t, `${e.replace(/\/+$/, "")}/health`, { timeoutMs: gn });
		return n.ok && (r == null ? void 0 : r.api_version) === 1;
	} catch {
		return !1;
	}
}
async function fn(e, t = {}) {
	let n = t.fetch ?? ((e, t) => globalThis.fetch(e, t)), r = e.api ?? "./api/v1";
	if (e.api && t.pageProtocol === "https:" && e.api.startsWith("http:")) throw new yn("Esta página es https y el servidor indicado es http: el navegador bloquea esa conexión. Abre la web desde tu propio servidor o publícalo con https.");
	return e.source === "directa" ? new wn(pn, t) : e.source === "servidor" || e.api || await dn(r, n) ? new kn(r, t) : new wn(pn, t);
}
var pn, mn, hn, gn, _n, vn, yn, bn, A, xn, Sn, j, Cn, M, N, wn, Tn, En, Dn, P, On, kn, An = t((() => {
	be(), st(), d(), tn(), Ot(), Vt(), k(), g(), b(), v(), S(), pn = "https://transporteurbano.logrono.es/api/", mn = "./api/v1", hn = 1e4, gn = 3e3, _n = "logrono-bus:catalogo:v1", vn = "logrono-bus:horario:v1:", yn = class extends i {
		constructor(...e) {
			super(...e), this.name = "UnusableSource";
		}
	}, bn = (e) => new Date(e()).toISOString(), A = /* @__PURE__ */ new WeakMap(), xn = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakSet(), wn = class {
		constructor(e = pn, t = {}) {
			O(this, N), h(this, A, void 0), h(this, xn, void 0), h(this, Sn, void 0), h(this, j, void 0), h(this, Cn, void 0), h(this, M, void 0), this.kind = "directa", y(A, this, e.endsWith("/") ? e : `${e}/`), y(xn, this, t.fetch ?? ((e, t) => globalThis.fetch(e, t))), y(Sn, this, t.store), y(j, this, t.now ?? Date.now), y(Cn, this, t.timeoutMs ?? 1e4);
		}
		async catalog() {
			return (await _(N, this, on).call(this)).index;
		}
		async arrivals(e, t) {
			let { index: n, resolver: r } = await _(N, this, on).call(this), i = n.stop(e);
			if (i.line_ids.length === 0) return {
				stop_id: i.id,
				generated_at: bn(x(j, this)),
				arrivals: []
			};
			let a = new URLSearchParams({
				lines: i.line_ids.join(","),
				previewMinutes: "60"
			}), o = `${x(A, this)}estimatedTimetable/byStop/${encodeURIComponent(i.id)}?${a}`;
			return qt(vt(await _(N, this, ln).call(this, o, t)), i.id, n, r, bn(x(j, this)));
		}
		async vehicles(e, t) {
			let { index: n } = await _(N, this, on).call(this), r = n.line(e), i = `${x(A, this)}vehicleMonitoring/byLine/${encodeURIComponent(r.id)}`;
			return Yt(yt(await _(N, this, ln).call(this, i, t)), r.id, n, bn(x(j, this)));
		}
		async timetable(e, t) {
			var n;
			let { index: r } = await _(N, this, on).call(this), i = r.line(e), a = At(x(j, this).call(this)), o = `${vn}${i.id}`, s = _(N, this, an).call(this, o);
			if ((s == null ? void 0 : s.service_date) === a && Array.isArray(s.directions)) return s;
			let c = `${x(A, this)}productionTimetable/byLine/${encodeURIComponent(i.id)}`, l = Xt(St(await _(N, this, ln).call(this, c, t)), i.id, r, bn(x(j, this)));
			return (n = x(Sn, this)) == null || n.set(o, JSON.stringify(l)), l;
		}
	}, Tn = /* @__PURE__ */ new WeakMap(), En = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), On = /* @__PURE__ */ new WeakSet(), kn = class {
		constructor(e = mn, t = {}) {
			O(this, On), h(this, Tn, void 0), h(this, En, void 0), h(this, Dn, void 0), h(this, P, void 0), this.kind = "servidor", y(Tn, this, e.replace(/\/+$/, "")), y(En, this, t.fetch ?? ((e, t) => globalThis.fetch(e, t))), y(Dn, this, t.timeoutMs ?? 1e4);
		}
		catalog() {
			if (!x(P, this)) {
				let e = _(On, this, un).call(this, "/catalog").then((e) => new ye(e));
				e.catch(() => {
					x(P, this) === e && y(P, this, void 0);
				}), y(P, this, e);
			}
			return x(P, this);
		}
		arrivals(e, t) {
			return _(On, this, un).call(this, `/stops/${encodeURIComponent(e)}/arrivals`, t);
		}
		vehicles(e, t) {
			return _(On, this, un).call(this, `/lines/${encodeURIComponent(e)}/vehicles`, t);
		}
		timetable(e, t) {
			return _(On, this, un).call(this, `/lines/${encodeURIComponent(e)}/timetable`, t);
		}
	};
})), F, jn, Mn = t((() => {
	g(), S(), b(), F = /* @__PURE__ */ new WeakMap(), jn = class {
		constructor(e) {
			h(this, F, void 0);
			try {
				y(F, this, e());
			} catch {
				y(F, this, void 0);
			}
		}
		get(e) {
			try {
				var t;
				return ((t = x(F, this)) == null ? void 0 : t.getItem(e)) ?? null;
			} catch {
				return null;
			}
		}
		set(e, t) {
			try {
				var n;
				(n = x(F, this)) == null || n.setItem(e, t);
			} catch {}
		}
		remove(e) {
			try {
				var t;
				(t = x(F, this)) == null || t.removeItem(e);
			} catch {}
		}
	};
})), I = t((() => {
	je(), be(), We(), nt(), st(), d(), ee(), oe(), tn(), Ot(), Ye(), we(), An(), Mn(), ue(), Vt();
}));
//#endregion
//#region src/config.ts
function Nn(e) {
	if (typeof e != "object" || !e) throw new Fn("La configuración de la tarjeta no es válida.");
	let t = e, n = t.entities;
	if (!Array.isArray(n) || n.length === 0) throw new Fn("Indica al menos un sensor en «entities» (los de Logroño Bus terminados en _minutos).");
	let r = Number(t.aviso ?? C.alertMinutes), i = Number(t.tam ?? C.textScale), a = Number(t.previas ?? C.previousStops), o = t.titulo;
	return {
		type: typeof t.type == "string" ? t.type : `custom:${L}`,
		entities: n.filter((e) => typeof e == "string"),
		...typeof o == "string" && o.trim() ? { titulo: o.trim() } : {},
		orden: In(tt, t.orden, C.order),
		aviso: Number.isFinite(r) ? Math.min(15, Math.max(0, Math.round(r))) : C.alertMinutes,
		efecto: In(et, t.efecto, C.effect),
		color: In(Qe, t.color, C.colour),
		letra: In($e, t.letra, C.font),
		tam: Number.isFinite(i) ? Xe(i) : C.textScale,
		modo: In(Pn, t.modo, "normal"),
		recorrido: t.recorrido !== !1,
		previas: Number.isFinite(a) ? Ze(a) : C.previousStops
	};
}
var L, Pn, Fn, In, Ln = t((() => {
	I(), L = "logrono-bus-card", Pn = ["normal", "pantalla"], Fn = class extends Error {
		constructor(...e) {
			super(...e), this.name = "CardConfigError";
		}
	}, In = (e, t, n) => typeof t == "string" && e.includes(t) ? t : n;
})), Rn, zn, Bn, Vn, Hn, Un, R, Wn, Gn, Kn = t((() => {
	Rn = globalThis, zn = Rn.ShadowRoot && (Rn.ShadyCSS === void 0 || Rn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Bn = Symbol(), Vn = /* @__PURE__ */ new WeakMap(), Hn = class {
		constructor(e, t, n) {
			if (this._$cssResult$ = !0, n !== Bn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
			this.cssText = e, this.t = t;
		}
		get styleSheet() {
			let e = this.o, t = this.t;
			if (zn && e === void 0) {
				let n = t !== void 0 && t.length === 1;
				n && (e = Vn.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Vn.set(t, e));
			}
			return e;
		}
		toString() {
			return this.cssText;
		}
	}, Un = (e) => new Hn(typeof e == "string" ? e : e + "", void 0, Bn), R = (e, ...t) => {
		let n = e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
			if (!0 === e._$cssResult$) return e.cssText;
			if (typeof e == "number") return e;
			throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
		})(n) + e[r + 1], e[0]);
		return new Hn(n, e, Bn);
	}, Wn = (e, t) => {
		if (zn) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
		else for (let n of t) {
			let t = document.createElement("style"), r = Rn.litNonce;
			r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
		}
	}, Gn = zn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
		let t = "";
		for (let n of e.cssRules) t += n.cssText;
		return Un(t);
	})(e) : e;
})), qn, Jn, Yn, Xn, Zn, Qn, $n, z, er, tr, nr, rr, ir, ar, or, sr, cr = t((() => {
	Kn(), {is: Jn, defineProperty: Yn, getOwnPropertyDescriptor: Xn, getOwnPropertyNames: Zn, getOwnPropertySymbols: Qn, getPrototypeOf: $n} = Object, z = globalThis, er = z.trustedTypes, tr = er ? er.emptyScript : "", nr = z.reactiveElementPolyfillSupport, rr = (e, t) => e, ir = {
		toAttribute(e, t) {
			switch (t) {
				case Boolean:
					e = e ? tr : null;
					break;
				case Object:
				case Array: e = e == null ? e : JSON.stringify(e);
			}
			return e;
		},
		fromAttribute(e, t) {
			let n = e;
			switch (t) {
				case Boolean:
					n = e !== null;
					break;
				case Number:
					n = e === null ? null : Number(e);
					break;
				case Object:
				case Array: try {
					n = JSON.parse(e);
				} catch {
					n = null;
				}
			}
			return n;
		}
	}, ar = (e, t) => !Jn(e, t), or = {
		attribute: !0,
		type: String,
		converter: ir,
		reflect: !1,
		useDefault: !1,
		hasChanged: ar
	}, (qn = Symbol).metadata ?? (qn.metadata = Symbol("metadata")), z.litPropertyMetadata ?? (z.litPropertyMetadata = /* @__PURE__ */ new WeakMap()), sr = class extends HTMLElement {
		static addInitializer(e) {
			this._$Ei(), (this.l ?? (this.l = [])).push(e);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(e, t = or) {
			if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
				let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
				r !== void 0 && Yn(this.prototype, e, r);
			}
		}
		static getPropertyDescriptor(e, t, n) {
			let { get: r, set: i } = Xn(this.prototype, e) ?? {
				get() {
					return this[t];
				},
				set(e) {
					this[t] = e;
				}
			};
			return {
				get: r,
				set(t) {
					let a = r == null ? void 0 : r.call(this);
					i == null || i.call(this, t), this.requestUpdate(e, a, n);
				},
				configurable: !0,
				enumerable: !0
			};
		}
		static getPropertyOptions(e) {
			return this.elementProperties.get(e) ?? or;
		}
		static _$Ei() {
			if (this.hasOwnProperty(rr("elementProperties"))) return;
			let e = $n(this);
			e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
		}
		static finalize() {
			if (this.hasOwnProperty(rr("finalized"))) return;
			if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(rr("properties"))) {
				let e = this.properties, t = [...Zn(e), ...Qn(e)];
				for (let n of t) this.createProperty(n, e[n]);
			}
			let e = this[Symbol.metadata];
			if (e !== null) {
				let t = litPropertyMetadata.get(e);
				if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
			}
			this._$Eh = /* @__PURE__ */ new Map();
			for (let [e, t] of this.elementProperties) {
				let n = this._$Eu(e, t);
				n !== void 0 && this._$Eh.set(n, e);
			}
			this.elementStyles = this.finalizeStyles(this.styles);
		}
		static finalizeStyles(e) {
			let t = [];
			if (Array.isArray(e)) {
				let n = new Set(e.flat(1 / 0).reverse());
				for (let e of n) t.unshift(Gn(e));
			} else e !== void 0 && t.push(Gn(e));
			return t;
		}
		static _$Eu(e, t) {
			let n = t.attribute;
			return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
		}
		constructor() {
			super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
		}
		_$Ev() {
			var e;
			this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((e) => e(this));
		}
		addController(e) {
			var t;
			(this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
		}
		removeController(e) {
			var t;
			(t = this._$EO) == null || t.delete(e);
		}
		_$E_() {
			let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
			for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
			e.size > 0 && (this._$Ep = e);
		}
		createRenderRoot() {
			let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
			return Wn(e, this.constructor.elementStyles), e;
		}
		connectedCallback() {
			var e;
			this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((e) => {
				var t;
				return (t = e.hostConnected) == null ? void 0 : t.call(e);
			});
		}
		enableUpdating(e) {}
		disconnectedCallback() {
			var e;
			(e = this._$EO) == null || e.forEach((e) => {
				var t;
				return (t = e.hostDisconnected) == null ? void 0 : t.call(e);
			});
		}
		attributeChangedCallback(e, t, n) {
			this._$AK(e, n);
		}
		_$ET(e, t) {
			let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
			if (r !== void 0 && !0 === n.reflect) {
				var i;
				let a = (((i = n.converter) == null ? void 0 : i.toAttribute) === void 0 ? ir : n.converter).toAttribute(t, n.type);
				this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
			}
		}
		_$AK(e, t) {
			let n = this.constructor, r = n._$Eh.get(e);
			if (r !== void 0 && this._$Em !== r) {
				var i, a;
				let e = n.getPropertyOptions(r), o = typeof e.converter == "function" ? { fromAttribute: e.converter } : ((i = e.converter) == null ? void 0 : i.fromAttribute) === void 0 ? ir : e.converter;
				this._$Em = r;
				let s = o.fromAttribute(t, e.type);
				this[r] = s ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? s, this._$Em = null;
			}
		}
		requestUpdate(e, t, n, r = !1, i) {
			if (e !== void 0) {
				var a;
				let o = this.constructor;
				if (!1 === r && (i = this[e]), n ?? (n = o.getPropertyOptions(e)), !((n.hasChanged ?? ar)(i, t) || n.useDefault && n.reflect && i === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(o._$Eu(e, n)))) return;
				this.C(e, t, n);
			}
			!1 === this.isUpdatePending && (this._$ES = this._$EP());
		}
		C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
			n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
		}
		async _$EP() {
			this.isUpdatePending = !0;
			try {
				await this._$ES;
			} catch (e) {
				Promise.reject(e);
			}
			let e = this.scheduleUpdate();
			return e != null && await e, !this.isUpdatePending;
		}
		scheduleUpdate() {
			return this.performUpdate();
		}
		performUpdate() {
			if (!this.isUpdatePending) return;
			if (!this.hasUpdated) {
				if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
					for (let [e, t] of this._$Ep) this[e] = t;
					this._$Ep = void 0;
				}
				let e = this.constructor.elementProperties;
				if (e.size > 0) for (let [t, n] of e) {
					let { wrapped: e } = n, r = this[t];
					!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
				}
			}
			let e = !1, t = this._$AL;
			try {
				var n;
				e = this.shouldUpdate(t), e ? (this.willUpdate(t), (n = this._$EO) == null || n.forEach((e) => {
					var t;
					return (t = e.hostUpdate) == null ? void 0 : t.call(e);
				}), this.update(t)) : this._$EM();
			} catch (t) {
				throw e = !1, this._$EM(), t;
			}
			e && this._$AE(t);
		}
		willUpdate(e) {}
		_$AE(e) {
			var t;
			(t = this._$EO) == null || t.forEach((e) => {
				var t;
				return (t = e.hostUpdated) == null ? void 0 : t.call(e);
			}), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
		}
		_$EM() {
			this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
		}
		get updateComplete() {
			return this.getUpdateComplete();
		}
		getUpdateComplete() {
			return this._$ES;
		}
		shouldUpdate(e) {
			return !0;
		}
		update(e) {
			this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
		}
		updated(e) {}
		firstUpdated(e) {}
	}, sr.elementStyles = [], sr.shadowRootOptions = { mode: "open" }, sr[rr("elementProperties")] = /* @__PURE__ */ new Map(), sr[rr("finalized")] = /* @__PURE__ */ new Map(), nr == null || nr({ ReactiveElement: sr }), (z.reactiveElementVersions ?? (z.reactiveElementVersions = [])).push("2.1.2");
}));
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/lit-html.js
function lr(e, t) {
	if (!br(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return mr === void 0 ? t : mr.createHTML(t);
}
function ur(e, t, n = e, r) {
	var i, a;
	if (t === W) return t;
	let o = r === void 0 ? n._$Cl : (i = n._$Co) == null ? void 0 : i[r], s = yr(t) ? void 0 : t._$litDirective$;
	return (o == null ? void 0 : o.constructor) !== s && (o == null || (a = o._$AO) == null || a.call(o, !1), s === void 0 ? o = void 0 : (o = new s(e), o._$AT(e, n, r)), r === void 0 ? n._$Cl = o : (n._$Co ?? (n._$Co = []))[r] = o), o !== void 0 && (t = ur(e, o._$AS(e, t.values), o, r)), t;
}
var dr, fr, pr, mr, hr, B, gr, _r, V, vr, yr, br, xr, Sr, Cr, wr, Tr, H, Er, Dr, Or, kr, U, W, G, Ar, K, jr, Mr, Nr, Pr, Fr, Ir, Lr, Rr, zr, Br, Vr, Hr, Ur = t((() => {
	dr = globalThis, fr = (e) => e, pr = dr.trustedTypes, mr = pr ? pr.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, hr = "$lit$", B = `lit$${Math.random().toFixed(9).slice(2)}$`, gr = "?" + B, _r = `<${gr}>`, V = document, vr = () => V.createComment(""), yr = (e) => e === null || typeof e != "object" && typeof e != "function", br = Array.isArray, xr = (e) => br(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Sr = "[ 	\n\f\r]", Cr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, wr = /-->/g, Tr = />/g, H = RegExp(`>|${Sr}(?:([^\\s"'>=/]+)(${Sr}*=${Sr}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Er = /'/g, Dr = /"/g, Or = /^(?:script|style|textarea|title)$/i, kr = (e) => (t, ...n) => ({
		_$litType$: e,
		strings: t,
		values: n
	}), U = kr(1), kr(2), kr(3), W = Symbol.for("lit-noChange"), G = Symbol.for("lit-nothing"), Ar = /* @__PURE__ */ new WeakMap(), K = V.createTreeWalker(V, 129), jr = (e, t) => {
		let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Cr;
		for (let t = 0; t < n; t++) {
			let n = e[t], s, c, l = -1, u = 0;
			for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === Cr ? c[1] === "!--" ? o = wr : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = H) : (Or.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = H) : o = Tr : o === H ? c[0] === ">" ? (o = i ?? Cr, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? H : c[3] === "\"" ? Dr : Er) : o === Dr || o === Er ? o = H : o === wr || o === Tr ? o = Cr : (o = H, i = void 0);
			let d = o === H && e[t + 1].startsWith("/>") ? " " : "";
			a += o === Cr ? n + _r : l >= 0 ? (r.push(s), n.slice(0, l) + hr + n.slice(l) + B + d) : n + B + (l === -2 ? t : d);
		}
		return [lr(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
	}, Mr = class e {
		constructor({ strings: t, _$litType$: n }, r) {
			let i;
			this.parts = [];
			let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = jr(t, n);
			if (this.el = e.createElement(l, r), K.currentNode = this.el.content, n === 2 || n === 3) {
				let e = this.el.content.firstChild;
				e.replaceWith(...e.childNodes);
			}
			for (; (i = K.nextNode()) !== null && c.length < s;) {
				if (i.nodeType === 1) {
					if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(hr)) {
						let t = u[o++], n = i.getAttribute(e).split(B), r = /([.?@])?(.*)/.exec(t);
						c.push({
							type: 1,
							index: a,
							name: r[2],
							strings: n,
							ctor: r[1] === "." ? Ir : r[1] === "?" ? Lr : r[1] === "@" ? Rr : Fr
						}), i.removeAttribute(e);
					} else e.startsWith(B) && (c.push({
						type: 6,
						index: a
					}), i.removeAttribute(e));
					if (Or.test(i.tagName)) {
						let e = i.textContent.split(B), t = e.length - 1;
						if (t > 0) {
							i.textContent = pr ? pr.emptyScript : "";
							for (let n = 0; n < t; n++) i.append(e[n], vr()), K.nextNode(), c.push({
								type: 2,
								index: ++a
							});
							i.append(e[t], vr());
						}
					}
				} else if (i.nodeType === 8) {
					if (i.data === gr) c.push({
						type: 2,
						index: a
					});
					else {
						let e = -1;
						for (; (e = i.data.indexOf(B, e + 1)) !== -1;) c.push({
							type: 7,
							index: a
						}), e += B.length - 1;
					}
				}
				a++;
			}
		}
		static createElement(e, t) {
			let n = V.createElement("template");
			return n.innerHTML = e, n;
		}
	}, Nr = class {
		constructor(e, t) {
			this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
		}
		get parentNode() {
			return this._$AM.parentNode;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		u(e) {
			let { el: { content: t }, parts: n } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? V).importNode(t, !0);
			K.currentNode = r;
			let i = K.nextNode(), a = 0, o = 0, s = n[0];
			for (; s !== void 0;) {
				if (a === s.index) {
					let t;
					s.type === 2 ? t = new Pr(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new zr(i, this, e)), this._$AV.push(t), s = n[++o];
				}
				a !== (s == null ? void 0 : s.index) && (i = K.nextNode(), a++);
			}
			return K.currentNode = V, r;
		}
		p(e) {
			let t = 0;
			for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
		}
	}, Pr = class e {
		get _$AU() {
			var e;
			return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
		}
		constructor(e, t, n, r) {
			this.type = 2, this._$AH = G, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
		}
		get parentNode() {
			let e = this._$AA.parentNode, t = this._$AM;
			return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
		}
		get startNode() {
			return this._$AA;
		}
		get endNode() {
			return this._$AB;
		}
		_$AI(e, t = this) {
			e = ur(this, e, t), yr(e) ? e === G || e == null || e === "" ? (this._$AH !== G && this._$AR(), this._$AH = G) : e !== this._$AH && e !== W && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? xr(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
		}
		O(e) {
			return this._$AA.parentNode.insertBefore(e, this._$AB);
		}
		T(e) {
			this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
		}
		_(e) {
			this._$AH !== G && yr(this._$AH) ? this._$AA.nextSibling.data = e : this.T(V.createTextNode(e)), this._$AH = e;
		}
		$(e) {
			var t;
			let { values: n, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = Mr.createElement(lr(r.h, r.h[0]), this.options)), r);
			if (((t = this._$AH) == null ? void 0 : t._$AD) === i) this._$AH.p(n);
			else {
				let e = new Nr(i, this), t = e.u(this.options);
				e.p(n), this.T(t), this._$AH = e;
			}
		}
		_$AC(e) {
			let t = Ar.get(e.strings);
			return t === void 0 && Ar.set(e.strings, t = new Mr(e)), t;
		}
		k(t) {
			br(this._$AH) || (this._$AH = [], this._$AR());
			let n = this._$AH, r, i = 0;
			for (let a of t) i === n.length ? n.push(r = new e(this.O(vr()), this.O(vr()), this, this.options)) : r = n[i], r._$AI(a), i++;
			i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
		}
		_$AR(e = this._$AA.nextSibling, t) {
			var n;
			for ((n = this._$AP) == null || n.call(this, !1, !0, t); e !== this._$AB;) {
				let t = fr(e).nextSibling;
				fr(e).remove(), e = t;
			}
		}
		setConnected(e) {
			var t;
			this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
		}
	}, Fr = class {
		get tagName() {
			return this.element.tagName;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		constructor(e, t, n, r, i) {
			this.type = 1, this._$AH = G, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = G;
		}
		_$AI(e, t = this, n, r) {
			let i = this.strings, a = !1;
			if (i === void 0) e = ur(this, e, t, 0), a = !yr(e) || e !== this._$AH && e !== W, a && (this._$AH = e);
			else {
				let r = e, o, s;
				for (e = i[0], o = 0; o < i.length - 1; o++) s = ur(this, r[n + o], t, o), s === W && (s = this._$AH[o]), a || (a = !yr(s) || s !== this._$AH[o]), s === G ? e = G : e !== G && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
			}
			a && !r && this.j(e);
		}
		j(e) {
			e === G ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
		}
	}, Ir = class extends Fr {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(e) {
			this.element[this.name] = e === G ? void 0 : e;
		}
	}, Lr = class extends Fr {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(e) {
			this.element.toggleAttribute(this.name, !!e && e !== G);
		}
	}, Rr = class extends Fr {
		constructor(e, t, n, r, i) {
			super(e, t, n, r, i), this.type = 5;
		}
		_$AI(e, t = this) {
			if ((e = ur(this, e, t, 0) ?? G) === W) return;
			let n = this._$AH, r = e === G && n !== G || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== G && (n === G || r);
			r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
		}
		handleEvent(e) {
			var t;
			typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
		}
	}, zr = class {
		constructor(e, t, n) {
			this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(e) {
			ur(this, e);
		}
	}, Br = {
		M: hr,
		P: B,
		A: gr,
		C: 1,
		L: jr,
		R: Nr,
		D: xr,
		V: ur,
		I: Pr,
		H: Fr,
		N: Lr,
		U: Rr,
		B: Ir,
		F: zr
	}, Vr = dr.litHtmlPolyfillSupport, Vr == null || Vr(Mr, Pr), (dr.litHtmlVersions ?? (dr.litHtmlVersions = [])).push("3.3.3"), Hr = (e, t, n) => {
		let r = (n == null ? void 0 : n.renderBefore) ?? t, i = r._$litPart$;
		if (i === void 0) {
			let e = (n == null ? void 0 : n.renderBefore) ?? null;
			r._$litPart$ = i = new Pr(t.insertBefore(vr(), e), e, void 0, n ?? {});
		}
		return i._$AI(e), i;
	};
})), Wr, Gr, q, Kr, qr = t((() => {
	cr(), cr(), Ur(), Ur(), Gr = globalThis, q = class extends sr {
		constructor() {
			super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
		}
		createRenderRoot() {
			var e;
			let t = super.createRenderRoot();
			return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
		}
		update(e) {
			let t = this.render();
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Hr(t, this.renderRoot, this.renderOptions);
		}
		connectedCallback() {
			var e;
			super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
		}
		disconnectedCallback() {
			var e;
			super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
		}
		render() {
			return W;
		}
	}, q._$litElement$ = !0, q.finalized = !0, (Wr = Gr.litElementHydrateSupport) == null || Wr.call(Gr, { LitElement: q }), Kr = Gr.litElementPolyfillSupport, Kr == null || Kr({ LitElement: q }), (Gr.litElementVersions ?? (Gr.litElementVersions = [])).push("4.2.2");
})), Jr = t((() => {})), Yr = t((() => {
	cr(), Ur(), qr(), Jr();
}));
Ln(), Yr(), I();
var Xr = new Intl.DateTimeFormat("es-ES", {
	hour: "2-digit",
	minute: "2-digit",
	timeZone: ae
});
function Zr(e) {
	return Xr.format(new Date(e));
}
function Qr(e, t) {
	if (e.cancelled) return {
		value: "Cancelado",
		unit: "",
		spoken: "cancelado"
	};
	let n = re(e.expected, t);
	if (n === 0) return {
		value: "Llegando",
		unit: "",
		spoken: "llegando"
	};
	if (n >= 60) {
		let t = Zr(e.expected);
		return {
			value: t,
			unit: "",
			spoken: `a las ${t}`
		};
	}
	return {
		value: String(n),
		unit: "min",
		spoken: n === 1 ? "en 1 minuto" : `en ${n} minutos`
	};
}
function $r(e) {
	let t = Math.max(0, Math.round(e / 1e3));
	return t < 60 ? `hace ${t} s` : `hace ${Math.round(t / 60)} min`;
}
function ei(e) {
	switch (e == null ? void 0 : e.state) {
		case "antes": return `Primera salida a las ${e.first}`;
		case "terminado": return `Servicio terminado · última salida ${e.last}`;
		case "sin_servicio": return "Hoy no hay servicio";
		case "en_servicio": return e.interval_min === null ? "Sin llegadas próximas" : `Sin llegadas próximas · pasa ${Mt(e.interval_min, e.interval_max_min)}`;
		default: return "Sin llegadas próximas";
	}
}
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directive.js
var ti = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ni = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), ri = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directive-helpers.js
Ur();
var { I: ii } = Br, ai = (e) => e, oi = () => document.createComment(""), si = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new ii(r.insertBefore(oi(), i), r.insertBefore(oi(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, o = n._$AM, s = o !== e;
		if (s) {
			var a;
			let t;
			(a = n._$AQ) == null || a.call(n, e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== o._$AU && n._$AP(t);
		}
		if (t !== i || s) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = ai(e).nextSibling;
				ai(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, ci = (e, t, n = e) => (e._$AI(t, n), e), li = {}, ui = (e, t = li) => e._$AH = t, di = (e) => e._$AH, fi = (e) => {
	e._$AR(), e._$AA.remove();
};
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directives/repeat.js
Ur();
var pi = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, mi = ni(class extends ri {
	constructor(e) {
		if (super(e), e.type !== ti.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = di(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ?? (this.ut = []), c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = ci(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = ci(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = ci(i[d], a[m]), si(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = ci(i[f], a[p]), si(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = pi(o, p, m), u = pi(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = si(e, i[d]);
					ci(t, a[p]), c[p] = t;
				} else c[p] = ci(n, a[p]), si(e, i[d], n), i[t] = null;
				p++;
			} else fi(i[f]), f--;
		} else fi(i[d]), d++;
		for (; p <= m;) {
			let t = si(e, c[m + 1]);
			ci(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && fi(e);
		}
		return this.ut = o, ui(e, c), W;
	}
});
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directives/style-map.js
Ur();
var hi = "important", gi = " !" + hi, _i = ni(class extends ri {
	constructor(e) {
		var t;
		if (super(e), e.type !== ti.ATTRIBUTE || e.name !== "style" || ((t = e.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return Object.keys(e).reduce((t, n) => {
			let r = e[n];
			return r == null ? t : t + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
		}, "");
	}
	update(e, [t]) {
		let { style: n } = e.element;
		if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
		for (let e of this.ft) t[e] ?? (this.ft.delete(e), e.includes("-") ? n.removeProperty(e) : n[e] = null);
		for (let e in t) {
			let r = t[e];
			if (r != null) {
				this.ft.add(e);
				let t = typeof r == "string" && r.endsWith(gi);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? hi : "") : n[e] = r;
			}
		}
		return W;
	}
});
I(), k(), v();
var vi, yi = "sentido desconocido", bi = "¡Ya llega!", J = /* @__PURE__ */ new WeakSet(), xi = class extends q {
	constructor() {
		super(), O(this, J), this.card = void 0, this.now = Date.now(), this.variant = "fill", this.fit = !1, this.intensity = "normal", this.effect = "pulso", this.still = !1, this.alertMinutes = 0, this.openable = !1, this.service = null;
	}
	get alerting() {
		return _(J, this, wi).call(this) !== void 0;
	}
	willUpdate() {
		this.toggleAttribute("alert", this.alerting);
	}
	render() {
		let e = this.card;
		if (!e) return G;
		let [t, ...n] = e.arrivals, r = e.headsign ? null : (t == null ? void 0 : t.headsign) ?? yi;
		return U`
      <article
        style=${_i({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        aria-label=${_(J, this, Di).call(this, e, e.arrivals)}
        role=${this.openable ? "button" : G}
        tabindex=${this.openable ? 0 : G}
        @click=${_(J, this, Si)}
        @keydown=${_(J, this, Ci)}
      >
        <header>
          <span class="badge" aria-hidden="true">${e.line_label}</span>
          <div class="route">
            <span class="towards">${e.headsign ? `→ ${e.headsign}` : e.line_name}</span>
            <span class="stop">${e.stop_name}</span>
          </div>
        </header>
        ${t ? U`<div class="next">
                ${_(J, this, Ei).call(this, t, !0)}
                ${r ? U`<span class="headsign">→ ${r}</span>` : G}
                ${_(J, this, Ti).call(this, t)}
              </div>` : U`<div class="empty">${ei(this.service)}</div>`}
        <ul aria-hidden="true">
          ${n.map((e) => U`<li>${_(J, this, Ei).call(this, e, !1)}${_(J, this, Ti).call(this, e)}</li>`)}
        </ul>
      </article>
    `;
	}
};
vi = xi;
function Si() {
	this.openable && this.card && this.dispatchEvent(new CustomEvent("card-open", {
		detail: this.card,
		bubbles: !0,
		composed: !0
	}));
}
function Ci(e) {
	(e.key === "Enter" || e.key === " ") && (e.preventDefault(), _(J, this, Si).call(this));
}
function wi() {
	var e;
	let t = (e = this.card) == null ? void 0 : e.arrivals.find((e) => !e.cancelled);
	return this.alertMinutes > 0 && this.effect !== "ninguno" && t !== void 0 && re(t.expected, this.now) <= this.alertMinutes ? t : void 0;
}
function Ti(e) {
	return this.effect === "etiqueta" && e === _(J, this, wi).call(this) ? U`<span class="soon" aria-hidden="true">${bi}</span>` : G;
}
function Ei(e, t) {
	let n = Qr(e, this.now), r = [
		t ? "value" : "",
		t && !n.unit ? "word" : "",
		e.is_realtime ? "" : "scheduled",
		e.cancelled ? "cancelled" : ""
	].filter(Boolean).join(" ");
	return U`<span class=${r}>${n.value}</span>${n.unit ? U`<span class=${t ? "unit" : ""}>${t ? n.unit : ` ${n.unit}`}</span>` : G}${e.is_realtime ? G : U`<span class="mark" title="Horario programado, sin seguimiento en tiempo real">
              · prog.</span
            >`}`;
}
function Di(e, t) {
	let n = e.headsign ? `hacia ${e.headsign}` : "", r = t.map((e) => Qr(e, this.now).spoken).join(", "), i = this.alerting ? ". ¡Llega pronto!" : "";
	return `Línea ${e.line_label} ${n}, parada ${e.stop_name}: ${r || ei(this.service).toLowerCase()}${i}`;
}
vi.properties = {
	card: { attribute: !1 },
	now: { type: Number },
	variant: {
		type: String,
		reflect: !0
	},
	fit: {
		type: Boolean,
		reflect: !0
	},
	intensity: {
		type: String,
		reflect: !0
	},
	effect: {
		type: String,
		reflect: !0
	},
	still: {
		type: Boolean,
		reflect: !0
	},
	alertMinutes: {
		type: Number,
		attribute: "alert-minutes"
	},
	openable: {
		type: Boolean,
		reflect: !0
	},
	service: { attribute: !1 }
}, vi.styles = R`
    :host {
      display: block;
      container-type: inline-size;
      min-width: 0;
      font-size: calc(1rem * var(--lb-text-scale, 1));
      /* Alerts contrast in lightness, not hue: any fixed hue matches some line (red 4, pink, yellow). */
      --lb-alert-ring: #000;
      --lb-alert-ring-inner: #fff;
      --lb-alert-stripe: #facc15;
    }
    article {
      box-sizing: border-box;
      height: 100%;
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: calc(var(--lb-gap, 12px) * 0.5);
      padding: var(--lb-card-padding, 14px 16px);
      border-radius: var(--lb-radius, 18px);
      background: var(--line-colour);
      color: var(--line-text);
      box-shadow: var(--lb-shadow, none);
      overflow: hidden;
      position: relative;
      /* Declared here, where --line-colour is set: the flash and the "¡Ya llega!" pill swap them. */
      --lb-inverse-bg: var(--line-text);
      --lb-inverse-fg: var(--line-colour);
    }
    :host([variant='strip']) article,
    :host([intensity='suave']) article {
      --lb-inverse-bg: var(--lb-fg, #000);
      --lb-inverse-fg: var(--lb-surface, #fff);
    }
    :host([variant='strip']) article {
      background: var(--lb-surface, #fff);
      color: var(--lb-fg, #000);
      border: var(--lb-card-border-width, 2px) solid var(--lb-border, currentColor);
      border-inline-start: var(--lb-card-strip, 14px) solid var(--line-colour);
    }
    :host([variant='strip']) .badge {
      background: var(--line-colour);
      color: var(--line-text);
      outline: 2px solid var(--lb-fg, #000);
    }
    :host([intensity='suave']) article {
      background: color-mix(in srgb, var(--line-colour) 38%, var(--lb-surface, #fff));
      color: var(--lb-fg, #000);
    }
    :host([intensity='suave']) .badge {
      background: var(--line-colour);
      color: var(--line-text);
    }
    :host([intensity='intensa']) article {
      filter: saturate(1.35) contrast(1.06);
    }
    /* Own layer: appending it to var(--lb-shadow) breaks when that is none or unset (HA card). */
    :host([intensity='intensa']:not([variant='strip'])) article::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.12);
      pointer-events: none;
    }
    /* Ring anchored to the card edge: Firefox floors outline widths but not outline-offset, which left an inset gap. */
    :host([alert][effect='borde']) article::after,
    :host([alert][effect='pulso']) article::after {
      content: '';
      position: absolute;
      inset: 0;
      box-sizing: border-box;
      border: 0.3em solid var(--lb-alert-ring);
      box-shadow: inset 0 0 0 0.15em var(--lb-alert-ring-inner);
      border-radius: inherit;
      pointer-events: none;
    }
    :host([alert][effect='pulso']) article::after {
      animation: lb-pulse 1.6s ease-in-out infinite;
    }
    :host([alert][effect='pulso']) .next .value {
      animation: lb-beat 1.6s ease-in-out infinite;
    }
    :host([alert][effect='destello']) article {
      animation: lb-flash 1.6s steps(1, end) infinite;
    }
    /* Frame cut out of a striped layer with a mask: border-image would drop the rounded corners. */
    :host([alert][effect='rayas']) article::after {
      content: '';
      position: absolute;
      inset: 0;
      box-sizing: border-box;
      padding: 0.35em;
      border-radius: inherit;
      background: repeating-linear-gradient(
        -45deg,
        var(--lb-alert-stripe) 0 0.5em,
        var(--lb-alert-ring) 0.5em 1em
      );
      -webkit-mask:
        linear-gradient(#000, #000) content-box,
        linear-gradient(#000, #000);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
    .soon {
      align-self: center;
      padding: 0.15em 0.55em;
      border-radius: 999px;
      font-size: 1.1em;
      font-size: clamp(0.85em, calc(4.5cqi * var(--lb-text-scale, 1)), 1.4em);
      font-weight: 800;
      line-height: 1.2;
      white-space: nowrap;
      background: var(--lb-inverse-bg);
      color: var(--lb-inverse-fg);
    }
    ul .soon {
      margin-inline-start: 0.4em;
      font-size: 0.8em;
    }
    @keyframes lb-flash {
      50%,
      100% {
        background: var(--lb-inverse-bg);
        color: var(--lb-inverse-fg);
      }
    }
    @keyframes lb-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }
    @keyframes lb-beat {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.06);
      }
    }
    .next .value {
      display: inline-block;
      transform-origin: left bottom;
    }
    /* Still: the flash holds its inverted half, the pulse its solid ring. */
    :host([alert][still]) article,
    :host([alert][still]) article::after,
    :host([alert][still]) .next .value {
      animation: none;
    }
    :host([alert][still][effect='destello']) article {
      background: var(--lb-inverse-bg);
      color: var(--lb-inverse-fg);
    }
    @media (prefers-reduced-motion: reduce) {
      :host([alert]) article,
      :host([alert]) article::after,
      :host([alert]) .next .value {
        animation: none;
      }
      :host([alert][effect='destello']) article {
        background: var(--lb-inverse-bg);
        color: var(--lb-inverse-fg);
      }
    }
    :host([openable]) article {
      cursor: pointer;
    }
    :host([openable]) article:focus-visible {
      outline: 3px solid var(--lb-focus, #2563eb);
      outline-offset: 2px;
    }
    :host([fit]) {
      container-type: size;
      height: 100%;
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .badge {
      flex: none;
      min-width: 2.1em;
      padding: 0.1em 0.35em;
      border-radius: calc(var(--lb-radius, 18px) * 0.5);
      font-size: 2em;
      font-size: clamp(1.4em, calc(7cqi * var(--lb-text-scale, 1)), 2.6em);
      font-weight: 800;
      line-height: 1.15;
      text-align: center;
      background: rgba(127, 127, 127, 0.18);
      background: color-mix(in srgb, var(--line-text) 14%, transparent);
    }
    .route {
      display: grid;
      min-width: 0;
    }
    .towards {
      font-size: 1.38em;
      font-size: clamp(1.05em, calc(5.5cqi * var(--lb-text-scale, 1)), 1.7em);
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .stop {
      font-size: 0.93em;
      font-size: clamp(0.8em, calc(3.6cqi * var(--lb-text-scale, 1)), 1.05em);
      opacity: 0.8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .next {
      align-self: center;
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.25em;
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    .next .value {
      font-size: 4.2em;
      font-size: clamp(2.4em, calc(22cqi * var(--lb-text-scale, 1)), 6em);
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .next .value.word {
      font-size: 2.7em;
      font-size: clamp(1.8em, calc(13cqi * var(--lb-text-scale, 1)), 3.6em);
    }
    .next .unit {
      font-size: 1.5em;
      font-size: clamp(1em, calc(7cqi * var(--lb-text-scale, 1)), 2em);
      font-weight: 600;
    }
    .next .headsign {
      font-size: 0.98em;
      font-size: clamp(0.85em, calc(4cqi * var(--lb-text-scale, 1)), 1.1em);
      opacity: 0.85;
    }
    .empty {
      align-self: center;
      font-size: 1.3em;
      font-size: clamp(1em, calc(6cqi * var(--lb-text-scale, 1)), 1.6em);
      opacity: 0.8;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.35em 1em;
      font-size: 1.23em;
      font-size: clamp(0.95em, calc(5cqi * var(--lb-text-scale, 1)), 1.5em);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .scheduled {
      font-style: italic;
      opacity: 0.85;
    }
    .cancelled {
      text-decoration: line-through;
      opacity: 0.7;
    }
    :host([fit]) .badge {
      font-size: clamp(1em, calc(min(7cqi, 14cqh) * var(--lb-text-scale, 1)), 4em);
    }
    :host([fit]) .towards {
      font-size: clamp(0.9em, calc(min(5.5cqi, 11cqh) * var(--lb-text-scale, 1)), 2.8em);
    }
    :host([fit]) .stop {
      font-size: clamp(0.7em, calc(min(3.6cqi, 7cqh) * var(--lb-text-scale, 1)), 1.6em);
    }
    :host([fit]) .next .value {
      font-size: clamp(1.6em, calc(min(30cqi, 34cqh) * var(--lb-text-scale, 1)), 12em);
    }
    :host([fit]) .next .value.word {
      font-size: clamp(1.3em, calc(min(17cqi, 22cqh) * var(--lb-text-scale, 1)), 7em);
    }
    :host([fit]) .next .unit {
      font-size: clamp(0.9em, calc(min(7cqi, 12cqh) * var(--lb-text-scale, 1)), 3.6em);
    }
    :host([fit]) .soon {
      font-size: clamp(0.8em, calc(min(4.5cqi, 9cqh) * var(--lb-text-scale, 1)), 2.4em);
    }
    :host([fit]) ul {
      font-size: clamp(0.8em, calc(min(5cqi, 10cqh) * var(--lb-text-scale, 1)), 2.6em);
    }
    .mark {
      font-size: 0.7em;
      font-weight: 500;
      opacity: 0.85;
    }
  `, customElements.get("lb-card") || customElements.define("lb-card", xi), I(), Yr(), k(), g(), S(), b(), v();
var Oi, ki = 1.05, Ai = 1.7;
function ji(e) {
	var t;
	return e.direction ? `${e.line_id}:${e.direction}` : ((t = e.arrivals.find((e) => e.pattern_id)) == null ? void 0 : t.pattern_id) ?? null;
}
function Mi(e) {
	return ji(e) !== null;
}
function Y(e) {
	return `${e.stop_id}|${e.line_id}|${e.direction ?? "x"}`;
}
function Ni(e, t, n) {
	if (e <= 1 || t <= 0 || n <= 0) return 1;
	let r = 1, i = Infinity;
	for (let a = 1; a <= e; a += 1) {
		let o = Math.ceil(e / a), s = t / a / (n / o), c = a * o - e, l = Math.abs(Math.log(s / Ai)) + c * .15;
		l < i && (r = a, i = l);
	}
	return r;
}
function Pi(e) {
	return getComputedStyle(e).getPropertyValue("--lb-card-style").trim() === "strip" ? "strip" : "fill";
}
function Fi(e) {
	return getComputedStyle(e).getPropertyValue("--lb-motion").trim() !== "none";
}
var Ii = /* @__PURE__ */ new WeakMap(), Li = /* @__PURE__ */ new WeakMap(), Ri = /* @__PURE__ */ new WeakMap(), zi = /* @__PURE__ */ new WeakSet(), Bi = class extends q {
	constructor() {
		super(), O(this, zi), h(this, Ii, /* @__PURE__ */ new Map()), h(this, Li, ""), h(this, Ri, typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(([e]) => {
			e && (this.size = {
				width: e.contentRect.width,
				height: e.contentRect.height
			});
		})), this.cards = [], this.now = Date.now(), this.order = "seleccion", this.colour = "normal", this.effect = "pulso", this.alertMinutes = 0, this.layout = "auto", this.openable = !0, this.services = /* @__PURE__ */ new Map(), this.size = {
			width: 0,
			height: 0
		};
	}
	connectedCallback() {
		var e;
		super.connectedCallback(), (e = x(Ri, this)) == null || e.observe(this);
	}
	disconnectedCallback() {
		var e;
		super.disconnectedCallback(), (e = x(Ri, this)) == null || e.disconnect();
	}
	willUpdate() {
		y(Ii, this, _(zi, this, Hi).call(this));
	}
	updated() {
		let e = _(zi, this, Vi).call(this).map((e) => e.dataset.key ?? "").join(","), t = x(Li, this) !== "" && e !== x(Li, this);
		y(Li, this, e), t && _(zi, this, Wi).call(this);
	}
	render() {
		let e = Pi(this), t = !Fi(this), n = this.layout === "kiosk" ? `--lb-columns: ${Ni(this.cards.length, this.size.width, this.size.height)}` : "";
		return U`<div class="grid" part="grid" style=${n}>
      ${mi(Oe(this.cards, this.order), Y, (n) => U`<lb-card
            data-key=${Y(n)}
            .card=${n}
            .now=${this.now}
            variant=${e}
            intensity=${this.colour}
            effect=${this.effect}
            ?still=${t}
            alert-minutes=${this.alertMinutes}
            ?fit=${this.layout === "kiosk"}
            ?openable=${this.openable && Mi(n)}
            .service=${this.services.get(Y(n)) ?? null}
          ></lb-card>`)}
    </div>`;
	}
};
Oi = Bi;
function Vi() {
	return [...this.renderRoot.querySelectorAll("lb-card[data-key]")];
}
function Hi() {
	return new Map(_(zi, this, Vi).call(this).map((e) => [e.dataset.key ?? "", e.getBoundingClientRect()]));
}
function Ui() {
	return !matchMedia("(prefers-reduced-motion: reduce)").matches && Fi(this);
}
function Wi() {
	let e = x(Ii, this);
	if (e.size !== 0 && _(zi, this, Ui).call(this)) for (let t of _(zi, this, Vi).call(this)) {
		let n = e.get(t.dataset.key ?? "");
		if (!n || typeof t.animate != "function") continue;
		let r = t.getBoundingClientRect(), i = n.left - r.left, a = n.top - r.top;
		if (Math.abs(i) < 1 && Math.abs(a) < 1) continue;
		let o = a > 1 || Math.abs(a) <= 1 && i > 1, s = `translate(${i}px, ${a}px)`, c = `translate(${i / 2}px, ${a / 2}px) scale(${o ? ki : 1})`;
		t.style.zIndex = o ? "2" : "1", t.style.position = "relative";
		let l = t.animate([
			{ transform: s },
			{
				transform: c,
				offset: .5
			},
			{ transform: "none" }
		], {
			duration: 650,
			easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
		});
		l.onfinish = l.oncancel = () => {
			t.style.zIndex = "";
		};
	}
}
Oi.properties = {
	cards: { attribute: !1 },
	now: { type: Number },
	order: { type: String },
	colour: { type: String },
	effect: { type: String },
	alertMinutes: {
		type: Number,
		attribute: "alert-minutes"
	},
	layout: {
		type: String,
		reflect: !0
	},
	openable: { type: Boolean },
	services: { attribute: !1 },
	size: { state: !0 }
}, Oi.styles = R`
    :host {
      display: block;
      min-height: 0;
    }
    .grid {
      display: grid;
      gap: var(--lb-gap, 12px);
      grid-template-columns: repeat(auto-fill, minmax(var(--lb-card-min, 260px), 1fr));
      grid-auto-rows: var(--lb-card-row, auto);
    }
    :host([layout='kiosk']) {
      height: 100%;
    }
    :host([layout='kiosk']) .grid {
      height: 100%;
      grid-template-columns: repeat(var(--lb-columns, 2), minmax(0, 1fr));
      grid-auto-rows: minmax(0, 1fr);
    }
  `, customElements.get("lb-card-grid") || customElements.define("lb-card-grid", Bi), I(), Yr(), g(), S(), b();
var Gi, Ki = /* @__PURE__ */ new WeakMap(), qi = class extends q {
	constructor() {
		super(), h(this, Ki, null), this.timetable = null, this.now = Date.now(), this.stopName = "";
	}
	updated() {
		let e = this.renderRoot.querySelector("li.next"), t = this.timetable ? `${this.timetable.pattern_id}|${(e == null ? void 0 : e.textContent) ?? ""}` : null;
		e && t !== x(Ki, this) && (y(Ki, this, t), e.scrollIntoView({ block: "nearest" }));
	}
	render() {
		let e = this.timetable;
		if (!e || e.departures.length === 0) return U`<p class="status">Hoy no hay servicio en este sentido.</p>`;
		let t = Ft(e, this.now), n = t.next_departure, r = !1;
		return U`
      <p class="status">
        ${t.state === "en_servicio" && t.next_departure ? `Próxima salida ${t.next_departure}${t.interval_min === null ? "" : ` · ${Mt(t.interval_min, t.interval_max_min)}`}` : ei(t)}
      </p>
      <p class="note">
        Salidas de ${e.origin} hacia ${e.headsign}.
        ${this.stopName ? `A ${this.stopName} el autobús pasa unos minutos después.` : G}
      </p>
      <ul class="periods" aria-label="Frecuencia por franjas">
        ${e.periods.map((e) => U`<li>
              ${e.first}–${e.last} ·
              ${Mt(e.interval_min, e.interval_max_min)}
            </li>`)}
      </ul>
      <ul class="departures" aria-label="Salidas de hoy">
        ${e.departures.map((e) => {
			let i = !r && e === n;
			i && (r = !0);
			let a = t.state === "terminado" || !r && n !== null;
			return U`<li
            class=${i ? "next" : a ? "past" : ""}
            aria-current=${i ? "time" : G}
          >
            ${e}
          </li>`;
		})}
      </ul>
    `;
	}
};
Gi = qi, Gi.properties = {
	timetable: { attribute: !1 },
	now: { type: Number },
	stopName: {
		type: String,
		attribute: "stop-name"
	}
}, Gi.styles = R`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.6em;
      min-height: 0;
    }
    p {
      margin: 0;
    }
    .note {
      color: var(--lb-muted, inherit);
      font-size: 0.85em;
    }
    .status {
      font-weight: 700;
    }
    .periods {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3em 1.2em;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 0.9em;
    }
    .departures {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(4.2em, 1fr));
      gap: 0.35em;
      margin: 0;
      padding: 0.2em;
      list-style: none;
      overflow-y: auto;
      min-height: 0;
    }
    .departures li {
      padding: 0.25em 0;
      border-radius: 0.5em;
      text-align: center;
      font-variant-numeric: tabular-nums;
      background: var(--lb-surface, transparent);
      border: 1px solid var(--lb-border, currentColor);
    }
    .departures li.past {
      opacity: 0.4;
    }
    .departures li.next {
      font-weight: 800;
      background: var(--line-colour);
      color: var(--line-text);
      border-color: var(--line-colour);
    }
  `, customElements.get("lb-timetable") || customElements.define("lb-timetable", qi), k(), g(), b(), S(), v();
var Ji = .2, Yi = /* @__PURE__ */ new WeakMap(), Xi = /* @__PURE__ */ new WeakMap(), Zi = /* @__PURE__ */ new WeakMap(), Qi = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), ea = /* @__PURE__ */ new WeakMap(), ta = /* @__PURE__ */ new WeakMap(), na = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), ra = /* @__PURE__ */ new WeakMap(), ia = /* @__PURE__ */ new WeakMap(), aa = /* @__PURE__ */ new WeakSet(), oa = class {
	constructor(e, t = {}) {
		O(this, aa), h(this, Yi, void 0), h(this, Xi, void 0), h(this, Zi, void 0), h(this, Qi, void 0), h(this, $i, void 0), h(this, ea, void 0), h(this, ta, void 0), h(this, na, void 0), h(this, X, 0), h(this, ra, !1), h(this, ia, !1), y(Yi, this, e), y(Xi, this, t.intervalMs ?? 3e4), y(Zi, this, t.maxBackoffMs ?? 3e5), y(Qi, this, t.random ?? Math.random), y($i, this, t.setTimer ?? ((e, t) => setTimeout(e, t))), y(ea, this, t.clearTimer ?? ((e) => clearTimeout(e)));
	}
	get failures() {
		return x(X, this);
	}
	nextDelayMs() {
		if (x(X, this) === 0) return x(Xi, this);
		let e = Math.min(x(Zi, this), x(Xi, this) * 2 ** x(X, this)), t = e * Ji * (x(Qi, this).call(this) * 2 - 1);
		return Math.round(Math.min(x(Zi, this), e + t));
	}
	start() {
		x(ra, this) || (y(ra, this, !0), x(ia, this) || this.runNow());
	}
	stop() {
		var e;
		y(ra, this, !1), _(aa, this, sa).call(this), (e = x(na, this)) == null || e.abort();
	}
	setPaused(e) {
		e !== x(ia, this) && (y(ia, this, e), e ? _(aa, this, sa).call(this) : x(ra, this) && this.runNow());
	}
	async runNow() {
		var e;
		_(aa, this, sa).call(this), (e = x(na, this)) == null || e.abort();
		let t = new AbortController();
		y(na, this, t);
		try {
			await x(Yi, this).call(this, t.signal), y(X, this, 0);
		} catch {
			if (t.signal.aborted) return;
			y(X, this, x(X, this) + 1);
		}
		x(ra, this) && !x(ia, this) && x(na, this) === t && y(ta, this, x($i, this).call(this, () => void this.runNow(), this.nextDelayMs()));
	}
};
function sa() {
	x(ta, this) !== void 0 && x(ea, this).call(this, x(ta, this)), y(ta, this, void 0);
}
I(), Yr(), k(), g(), v(), S(), b();
var ca, la = 15e3, ua = 9e5, da = {
	vertical: 2.4,
	horizontal: 4.6
}, fa = {
	vertical: 7,
	horizontal: 9
}, pa = .8;
function ma(e, t, n) {
	if (e <= 0 || n <= 0) return 12;
	let r = e - fa[t] * n, i = Math.floor(r / (da[t] * n));
	return Math.min(12, Math.max(1, i));
}
function ha(e, t = pa) {
	let n = /* @__PURE__ */ new Set();
	return e.stops.forEach((r, i) => {
		e.buses.some((e) => Math.abs(e.at - i) < t) && n.add(i);
	}), n;
}
function ga(e) {
	return `${e.hiddenStops === 1 ? "1 parada" : `${e.hiddenStops} paradas`} antes, desde ${e.origin}`;
}
function _a(e) {
	return e.minutes === null ? "" : e.minutes === 0 ? "llegando" : `${e.minutes} min`;
}
function va(e, t) {
	let n = e.arrivals.find((e) => !e.cancelled);
	if (!n) return e.stop_name;
	let r = n.is_realtime ? "" : " (horario programado)";
	return `${e.stop_name} · próximo ${Qr(n, t).spoken}${r}`;
}
function ya(e, t) {
	let n = Date.parse(e.generated_at);
	return {
		...e,
		vehicles: e.vehicles.filter((e) => Math.max(0, n - Date.parse(e.recorded_at)) + t <= Zt)
	};
}
var ba = /* @__PURE__ */ new WeakMap(), xa = /* @__PURE__ */ new WeakMap(), Sa = /* @__PURE__ */ new WeakMap(), Ca = /* @__PURE__ */ new WeakMap(), wa = /* @__PURE__ */ new WeakMap(), Ta = /* @__PURE__ */ new WeakMap(), Ea = /* @__PURE__ */ new WeakMap(), Da = /* @__PURE__ */ new WeakMap(), Oa = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakSet(), ka = class extends q {
	constructor() {
		super(), O(this, Z), h(this, ba, void 0), h(this, xa, 0), h(this, Sa, !1), h(this, Ca, new oa((e) => _(Z, this, Na).call(this, e), { intervalMs: la })), h(this, wa, void 0), h(this, Ta, void 0), h(this, Ea, typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(([e]) => {
			if (!e) return;
			let { width: t, height: n } = e.contentRect;
			this.orientation = t > n * 1.1 ? "horizontal" : "vertical";
			let r = this.renderRoot.querySelector(".body") ?? this, i = Number.parseFloat(getComputedStyle(r).fontSize);
			this.room = ma(this.orientation === "horizontal" ? t : n * .7, this.orientation, i);
		})), h(this, Da, (e) => {
			e.key === "Escape" && this.close();
		}), h(this, Oa, () => _(Z, this, Aa).call(this)), this.card = void 0, this.source = void 0, this.arrivals = null, this.previousStops = 4, this.route = null, this.vehicles = void 0, this.problem = void 0, this.timetableProblem = void 0, this.now = Date.now(), this.orientation = "vertical", this.room = 12, this.screen = "recorrido", this.timetable = void 0;
	}
	willUpdate() {
		let e = this.patternId;
		if (!x(ba, this) || !this.vehicles || !this.card || !e) return;
		let t = ya(this.vehicles, this.now - x(xa, this)), n = (t) => t.vehicles.filter((t) => t.pattern_id === e).length;
		y(Sa, this, n(t) < n(this.vehicles)), this.route = Ge(x(ba, this), e, this.card.stop_id, t, this.arrivals, {
			previousStops: Math.min(this.previousStops, this.room),
			now: new Date(this.now).toISOString()
		});
	}
	connectedCallback() {
		var e;
		super.connectedCallback(), this.card && !this.card.arrivals.some((e) => !e.cancelled) && this.show("horario"), _(Z, this, Aa).call(this), x(Ca, this).start(), (e = x(Ea, this)) == null || e.observe(this), y(Ta, this, setInterval(() => this.now = Date.now(), 1e3)), document.addEventListener("keydown", x(Da, this)), document.addEventListener("visibilitychange", x(Oa, this)), _(Z, this, Ma).call(this);
	}
	disconnectedCallback() {
		var e;
		super.disconnectedCallback(), x(Ca, this).stop(), (e = x(Ea, this)) == null || e.disconnect(), clearInterval(x(Ta, this)), clearTimeout(x(wa, this)), document.removeEventListener("keydown", x(Da, this)), document.removeEventListener("visibilitychange", x(Oa, this));
	}
	show(e) {
		this.screen = e, _(Z, this, Aa).call(this), e === "horario" && !this.timetable && _(Z, this, ja).call(this), _(Z, this, Ma).call(this);
	}
	close() {
		this.dispatchEvent(new CustomEvent("route-close", {
			bubbles: !0,
			composed: !0
		}));
	}
	get patternId() {
		return this.card ? ji(this.card) : null;
	}
	render() {
		let e = this.card;
		if (!e) return G;
		let t = this.route, n = this.vehicles ? this.now - x(xa, this) : 0, r = t && t.buses.length === 0 && t.earlierBuses.length === 0, i = r && !x(Sa, this) && !this.problem && n <= 18e4, a = t && n <= 18e4 && !(r && x(Sa, this)) ? t : null;
		return U`
      <header
        style=${_i({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        @click=${() => _(Z, this, Ma).call(this)}
      >
        <span class="badge">${e.line_label}</span>
        <div class="title">
          <strong>→ ${(t == null ? void 0 : t.headsign) ?? e.headsign ?? e.line_name}</strong>
          <span>${va(e, this.now)}</span>
        </div>
        <div class="actions">
          <button @click=${() => this.show(this.screen === "horario" ? "recorrido" : "horario")}>
            ${this.screen === "horario" ? "Recorrido" : "Horario"}
          </button>
          <button @click=${() => this.close()}>Volver</button>
        </div>
      </header>
      <div
        class="body"
        style=${_i({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        @click=${() => _(Z, this, Ma).call(this)}
      >
        ${this.screen === "horario" ? this.timetableProblem ? U`<p class="note" role="alert">${this.timetableProblem}</p>` : _(Z, this, Ia).call(this, e) : this.problem && a ? _(Z, this, Fa).call(this, a) : this.problem ? U`<p class="note" role="alert">${this.problem}</p>` : t ? _(Z, this, Fa).call(this, t) : U`<p class="note" role="status">Buscando los autobuses…</p>`}
      </div>
      <footer ?hidden=${this.screen === "horario"}>
        <span>
          ${[t && t.hiddenStops > 0 ? `${this.orientation === "horizontal" ? "←" : "↓"} ${ga(t)}` : "", i ? "Ningún autobús en camino ahora mismo." : ""].filter(Boolean).join(" · ")}
        </span>
        <span>${this.vehicles ? `Posiciones ${$r(n)}` : ""}</span>
        ${this.problem && a ? U`<span class="problem" role="alert">${this.problem}</span>` : G}
      </footer>
    `;
	}
};
ca = ka;
function Aa() {
	x(Ca, this).setPaused(this.screen === "horario" || document.hidden);
}
async function ja() {
	let e = this.card, t = this.source;
	if (e && t) try {
		this.timetable = await t.timetable(e.line_id), this.timetableProblem = void 0;
	} catch {
		this.timetableProblem = "No se puede obtener ahora el horario de la línea.";
	}
}
function Ma() {
	clearTimeout(x(wa, this)), y(wa, this, setTimeout(() => this.close(), ua));
}
async function Na(e) {
	let t = this.card, n = this.source, r = this.patternId;
	if (t && n && r) try {
		let [r, i] = await Promise.all([n.catalog(), n.vehicles(t.line_id, e)]);
		y(ba, this, r), y(xa, this, Date.now()), this.vehicles = i, this.problem = void 0;
	} catch (t) {
		throw e.aborted || (this.problem = "No se pueden obtener ahora las posiciones de los autobuses."), t;
	}
}
function Pa(e, t) {
	let n = t > 0 ? e / t : 1;
	return this.orientation === "horizontal" ? { left: `${n * 100}%` } : { top: `${(1 - n) * 100}%` };
}
function Fa(e) {
	let t = e.stops.length - 1, n = ha(e), [r, ...i] = e.earlierBuses, a = t % 2 == 1;
	return U`<div class="track" role="img" aria-label=${_(Z, this, La).call(this, e)}>
      <div class="line"></div>
      ${e.hiddenStops > 0 ? U`<div class="more before"></div>` : G}
      ${e.stopsAfter > 0 ? U`<div class="more after"></div>` : G}
      ${e.stops.map((e, r) => U`<div
            class=${[
		"stop",
		r === t ? "target" : "",
		e.terminus ? "terminus" : "",
		(t - r) % 2 == 1 ? "above" : "",
		n.has(r) ? "covered" : ""
	].join(" ")}
            style=${_i(_(Z, this, Pa).call(this, r, t))}
          >
            <span class="dot"></span><span class="name">${e.name}</span>
          </div>`)}
      ${e.buses.map((e, n) => U`<div
            class=${n === 0 ? "bus first" : "bus"}
            style=${_i(_(Z, this, Pa).call(this, e.at, t))}
          >
            <span class="pill">🚌 ${_a(e)}</span>
          </div>`)}
      ${r ? U`<div
              class=${[
		"bus earlier",
		e.buses.length === 0 ? "first" : "",
		a ? "low" : ""
	].join(" ")}
            >
              <span class="pill"
                >🚌
                ${_a(r)}${i.length > 0 ? ` +${i.length}` : ""}</span
              >
            </div>` : G}
    </div>`;
}
function Ia(e) {
	return this.timetable ? U`<lb-timetable
      .timetable=${It(this.timetable, this.patternId) ?? null}
      .now=${this.now}
      stop-name=${e.stop_name}
    ></lb-timetable>` : U`<p class="note" role="status">Buscando el horario…</p>`;
}
function La(e) {
	let t = e.stops.length - 1, n = e.stops.flatMap((e, n) => e.terminus ? e.position === 1 ? [`La línea empieza en ${e.name}`] : [n === t ? "La línea acaba en tu parada" : `La línea acaba en ${e.name}`] : []), r = [...e.buses, ...e.earlierBuses];
	return r.length === 0 ? [...n, "Ningún autobús de esta línea en camino ahora mismo."].join(". ") : [...n, ...r.map((e) => {
		let t = e.stopsAway === 0 ? "llegando a tu parada" : `a ${e.stopsAway + 1} paradas`;
		return e.minutes === null ? `Un autobús ${t}` : `Un autobús ${t}, ${e.minutes} minutos`;
	})].join(". ");
}
ca.properties = {
	card: { attribute: !1 },
	source: { attribute: !1 },
	arrivals: { attribute: !1 },
	previousStops: {
		type: Number,
		attribute: "previous-stops"
	},
	route: { state: !0 },
	vehicles: { state: !0 },
	problem: { state: !0 },
	now: { state: !0 },
	orientation: {
		type: String,
		reflect: !0
	},
	room: { state: !0 },
	screen: {
		type: String,
		reflect: !0
	},
	timetable: { state: !0 },
	timetableProblem: { state: !0 }
}, ca.styles = R`
    :host {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 12px;
      padding: 16px clamp(14px, 3vw, 28px);
      background: var(--lb-bg, #fff);
      color: var(--lb-fg, #000);
      font-size: calc(clamp(1rem, 0.6rem + 1vmin, 1.5rem) * var(--lb-text-scale, 1));
      box-sizing: border-box;
    }
    /* On a narrow phone the buttons drop below the title rather than squeeze it. */
    header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px 14px;
      min-width: 0;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-left: auto;
    }
    .badge {
      flex: none;
      min-width: 2.2em;
      padding: 0.1em 0.4em;
      border-radius: 10px;
      font-size: 1.8em;
      font-weight: 800;
      text-align: center;
      background: var(--line-colour);
      color: var(--line-text);
      outline: var(--lb-badge-outline, none);
    }
    .title {
      display: grid;
      min-width: 0;
      flex: 1 1 11em;
    }
    .title strong {
      font-size: 1.35em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title span {
      color: var(--lb-muted, inherit);
    }
    button {
      font: inherit;
      font-weight: 700;
      min-height: 44px;
      padding: 0.4em clamp(0.6em, 2vw, 1.1em);
      border-radius: 999px;
      border: 1px solid var(--lb-border, currentColor);
      background: var(--lb-surface, transparent);
      color: inherit;
      cursor: pointer;
      flex: none;
    }
    footer[hidden] {
      display: none;
    }
    .body > lb-timetable {
      flex: 1;
      min-height: 0;
      font-size: 0.8em;
    }

    /* The diagram scales with the screen's short side: big on an Echo Show, capped on a desktop. */
    .body {
      --rail: 0.42em;
      --dot: 0.95em;
      --target: 1.5em;
      min-height: 0;
      display: flex;
      flex-direction: column;
      font-size: calc(clamp(1.05rem, 0.5rem + 3.2vmin, 1.7rem) * var(--lb-text-scale, 1));
    }
    .track {
      position: relative;
      flex: 1;
      min-height: 0;
    }
    .line {
      position: absolute;
      background: var(--line-colour);
      border-radius: 999px;
    }
    .more {
      position: absolute;
      border: 0 dotted var(--line-colour);
    }
    .stop,
    .bus {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 0.45em;
    }
    .dot {
      flex: none;
      width: var(--dot);
      height: var(--dot);
      border-radius: 50%;
      background: var(--lb-surface, #fff);
      border: 0.24em solid var(--line-colour);
      box-sizing: border-box;
    }
    .stop.target .dot {
      width: var(--target);
      height: var(--target);
      border-width: 0.36em;
    }
    /*
     * Where the line starts or ends, as on a metro map: as big as your stop, but filled. Your stop
     * as the last of the line takes it too: its place and big name already say it is yours.
     */
    .stop.terminus .dot {
      width: var(--target);
      height: var(--target);
      border-width: 0.36em;
      background: var(--line-colour);
      box-shadow: inset 0 0 0 0.16em var(--lb-surface, #fff);
    }
    .stop .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .stop.terminus .name {
      font-weight: 700;
    }
    .stop.target .name {
      font-size: 1.2em;
      font-weight: 800;
    }
    .bus {
      z-index: 1;
      transition:
        top 1.2s ease-in-out,
        left 1.2s ease-in-out;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 0.3em;
      padding: 0.15em 0.55em;
      border-radius: 999px;
      font-size: 0.95em;
      font-weight: 800;
      white-space: nowrap;
      background: var(--line-colour);
      color: var(--line-text);
      box-shadow: 0 2px 10px rgb(0 0 0 / 0.3);
      outline: 2px solid var(--lb-bg, #fff);
    }
    .first .pill {
      font-size: 1.1em;
    }
    .note,
    footer {
      color: var(--lb-muted, inherit);
      font-size: 0.9em;
    }
    footer {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75em 1.5em;
      justify-content: space-between;
    }
    .problem {
      padding: 0.15em 0.6em;
      border-radius: 999px;
      background: var(--lb-warning-bg, #fff3cd);
      color: var(--lb-warning-fg, #5c4400);
      font-weight: 600;
    }

    /* Vertical: your stop on top, the road running down; buses to the left of the road. */
    :host([orientation='vertical']) .body {
      --x: 6.6em;
    }
    :host([orientation='vertical']) .track {
      margin: 2.6em 0 3.4em;
    }
    :host([orientation='vertical']) .line {
      left: calc(var(--x) - var(--rail) / 2);
      top: 0;
      bottom: 0;
      width: var(--rail);
    }
    :host([orientation='vertical']) .more {
      left: calc(var(--x) - var(--rail) / 2);
      border-left-width: var(--rail);
    }
    :host([orientation='vertical']) .more.before {
      top: calc(100% + 0.5em);
      height: 2.4em;
    }
    :host([orientation='vertical']) .more.after {
      bottom: calc(100% + var(--target) / 2 + 0.3em);
      height: 1.6em;
    }
    :host([orientation='vertical']) .stop {
      left: calc(var(--x) - var(--dot) / 2);
      right: 0;
      transform: translateY(-50%);
    }
    :host([orientation='vertical']) .stop.target,
    :host([orientation='vertical']) .stop.terminus {
      left: calc(var(--x) - var(--target) / 2);
    }
    :host([orientation='vertical']) .bus {
      left: 0;
      width: calc(var(--x) - 0.9em);
      justify-content: flex-end;
      transform: translateY(-50%);
    }
    :host([orientation='vertical']) .bus.earlier {
      top: calc(100% + 1.7em);
    }

    /* Horizontal: your stop on the right, the road coming from the left; buses ride on it. */
    :host([orientation='horizontal']) .track {
      margin: 0 4.5em;
    }
    :host([orientation='horizontal']) .line {
      top: 50%;
      left: 0;
      right: 0;
      height: var(--rail);
      transform: translateY(-50%);
    }
    :host([orientation='horizontal']) .more {
      top: 50%;
      border-top-width: var(--rail);
      transform: translateY(-50%);
    }
    :host([orientation='horizontal']) .more.before {
      right: calc(100% + 0.5em);
      width: 3.6em;
    }
    :host([orientation='horizontal']) .more.after {
      left: calc(100% + var(--target) / 2 + 0.3em);
      width: 2.6em;
    }
    :host([orientation='horizontal']) .stop {
      top: 50%;
      width: 0;
      justify-content: center;
      transform: translateY(-50%);
    }
    :host([orientation='horizontal']) .stop .name {
      position: absolute;
      top: calc(100% + 0.45em);
      left: -4.2em;
      width: 8.4em;
      text-align: center;
      white-space: normal;
      line-height: 1.15;
      transition:
        top 0.4s ease-in-out,
        bottom 0.4s ease-in-out;
    }
    :host([orientation='horizontal']) .stop.above .name {
      top: auto;
      bottom: calc(100% + 0.45em);
    }
    :host([orientation='horizontal']) .stop.target .name {
      left: -3.5em;
      width: 7em;
    }
    /* A bus pill rides the track over this stop: move the name clear of it, away from the road. */
    :host([orientation='horizontal']) .stop.covered .name {
      top: calc(100% + 1.2em);
    }
    :host([orientation='horizontal']) .stop.covered.above .name {
      top: auto;
      bottom: calc(100% + 1.2em);
    }
    :host([orientation='horizontal']) .bus {
      top: 50%;
      transform: translate(-50%, -50%);
    }
    /* Floats over the dotted "…" (on the side away from the first stop's name) so both show. */
    :host([orientation='horizontal']) .bus.earlier {
      left: -2.3em;
      top: calc(50% - 1.35em);
    }
    :host([orientation='horizontal']) .bus.earlier.low {
      top: calc(50% + 1.35em);
    }

    @media (prefers-reduced-motion: reduce) {
      .bus,
      .stop .name {
        transition: none;
      }
    }
  `, customElements.get("lb-route") || customElements.define("lb-route", ka), I(), Yr(), k(), g(), S(), b(), v();
var Ra, za = 5e3, Ba = /* @__PURE__ */ new WeakMap(), Va = /* @__PURE__ */ new WeakMap(), Ha = /* @__PURE__ */ new WeakMap(), Ua = /* @__PURE__ */ new WeakMap(), Wa = /* @__PURE__ */ new WeakMap(), Ga = /* @__PURE__ */ new WeakMap(), Ka = /* @__PURE__ */ new WeakSet(), qa = class extends q {
	constructor() {
		super(), O(this, Ka), h(this, Ba, new oa((e) => this.refresh(e))), h(this, Va, /* @__PURE__ */ new Map()), h(this, Ha, void 0), h(this, Ua, void 0), h(this, Wa, () => x(Ba, this).setPaused(document.hidden)), h(this, Ga, /* @__PURE__ */ new Map()), this.config = void 0, this.source = void 0, this.status = "loading", this.layout = "auto", this.cards = [], this.now = Date.now(), this.updatedAt = void 0, this.error = void 0, this.opened = void 0, this.timetables = /* @__PURE__ */ new Map();
	}
	connectedCallback() {
		super.connectedCallback(), document.addEventListener("visibilitychange", x(Wa, this)), y(Ha, this, setInterval(() => {
			this.now = Date.now();
		}, za)), this.config && x(Ba, this).start();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), document.removeEventListener("visibilitychange", x(Wa, this)), clearInterval(x(Ha, this)), x(Ba, this).stop();
	}
	willUpdate(e) {
		this.config && (this.style.setProperty("--lb-text-scale", String(this.config.textScale / 100)), this.style.setProperty("font-family", Za[this.config.font]));
		let t = e.get("config"), n = e.has("config") && Qa(t) !== Qa(this.config) || e.has("source");
		e.has("source") && (x(Va, this).clear(), this.timetables = /* @__PURE__ */ new Map()), n && this.hasUpdated && this.isConnected && this.config && (y(Ua, this, void 0), x(Ba, this).stop(), x(Ba, this).start());
	}
	async refresh(e) {
		let t = this.config;
		if (t) try {
			this.source ?? (this.source = await fn(t, { pageProtocol: location.protocol }));
			let n = this.source;
			x(Ua, this) ?? y(Ua, this, await n.catalog());
			let r = x(Ua, this), i = [...new Set(t.stops.map((e) => e.stop_id))], a = await Promise.all(i.map((t) => n.arrivals(t, e))), o = new Map(a.map((e) => [e.stop_id, e]));
			y(Ga, this, o), this.cards = t.stops.flatMap((e) => {
				let n = o.get(e.stop_id);
				return n ? Ee(r, e, n, t.perCard) : [];
			}), this.updatedAt = Math.min(...a.map((e) => Date.parse(e.generated_at))), this.now = Date.now(), this.error = void 0, this.status = "ready", _(Ka, this, Ja).call(this, n, this.cards);
		} catch (t) {
			throw e != null && e.aborted ? t : (this.error = $a(t), this.cards.length === 0 && (this.status = "error"), t);
		} finally {
			this.dispatchEvent(new CustomEvent("board-refresh", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	render() {
		let e = this.config;
		if (!e) return G;
		if (this.status === "loading") return U`<p class="message" role="status">Cargando llegadas…</p>`;
		if (this.status === "error") return U`<p class="message" role="alert">${this.error}</p>`;
		let t = this.updatedAt === void 0 ? 0 : this.now - this.updatedAt;
		return U`
      ${_(Ka, this, Xa).call(this)}
      <lb-card-grid
        .cards=${this.cards}
        .now=${this.now}
        order=${e.order}
        colour=${e.colour}
        effect=${e.effect}
        alert-minutes=${e.alertMinutes}
        layout=${this.layout}
        .services=${_(Ka, this, Ya).call(this)}
        @card-open=${(e) => this.opened = Y(e.detail)}
      ></lb-card-grid>
      <div class="status" part="status" role="status">
        <span>Actualizado ${$r(t)}</span>
        ${t > 9e4 ? U`<span class="stale">Datos sin actualizar: comprobando de nuevo</span>` : G}
        ${this.error ? U`<span class="problem">${this.error}</span>` : G}
      </div>
    `;
	}
};
Ra = qa;
async function Ja(e, t) {
	let n = At(Date.now()), r = new Set(t.filter((e) => !e.arrivals.some((e) => !e.cancelled)).map((e) => e.line_id).filter((e) => x(Va, this).get(e) !== n));
	if (r.size === 0) return;
	for (let e of r) x(Va, this).set(e, n);
	let i = await Promise.allSettled([...r].map(async (t) => e.timetable(t)));
	if (e !== this.source) return;
	let a = new Map(this.timetables);
	for (let e of i) e.status === "fulfilled" && a.set(e.value.line_id, e.value);
	this.timetables = a;
}
function Ya() {
	let e = /* @__PURE__ */ new Map(), t = At(this.now);
	for (let n of this.cards) {
		let r = this.timetables.get(n.line_id);
		(r == null ? void 0 : r.service_date) === t && e.set(Y(n), Ft(It(r, ji(n)), this.now));
	}
	return e;
}
function Xa() {
	var e;
	let t = this.cards.find((e) => Y(e) === this.opened);
	return !t || !this.source ? G : U`<lb-route
      .card=${t}
      .source=${this.source}
      .arrivals=${x(Ga, this).get(t.stop_id) ?? null}
      .previousStops=${((e = this.config) == null ? void 0 : e.previousStops) ?? 4}
      @route-close=${() => this.opened = void 0}
    ></lb-route>`;
}
Ra.properties = {
	config: { attribute: !1 },
	source: { attribute: !1 },
	status: {
		type: String,
		reflect: !0
	},
	layout: {
		type: String,
		reflect: !0
	},
	cards: { state: !0 },
	now: { state: !0 },
	updatedAt: { state: !0 },
	error: { state: !0 },
	opened: { state: !0 },
	timetables: { state: !0 }
}, Ra.styles = R`
    :host {
      display: block;
      color: var(--lb-fg, inherit);
    }
    :host([layout='kiosk']) {
      height: 100%;
      display: grid;
      grid-template-rows: minmax(0, 1fr) auto;
    }
    :host([layout='kiosk']) .status {
      margin-top: calc(var(--lb-gap, 12px) * 0.5);
      font-size: 0.8rem;
    }
    .status {
      margin-top: var(--lb-gap, 12px);
      font-size: 0.9rem;
      color: var(--lb-muted, inherit);
      display: flex;
      gap: 0.75em;
      flex-wrap: wrap;
      align-items: center;
    }
    .stale,
    .problem {
      padding: 0.15em 0.6em;
      border-radius: 999px;
      background: var(--lb-warning-bg, #fff3cd);
      color: var(--lb-warning-fg, #5c4400);
      font-weight: 600;
    }
    .message {
      padding: 1.5rem;
      border-radius: var(--lb-radius, 18px);
      background: var(--lb-surface, transparent);
      border: 1px solid var(--lb-border, currentColor);
    }
  `;
var Za = {
	sistema: "var(--lb-font, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif)",
	legible: "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif",
	redondeada: "ui-rounded, 'SF Pro Rounded', 'Nunito', 'Varela Round', system-ui, sans-serif",
	mono: "ui-monospace, 'SF Mono', 'DejaVu Sans Mono', Menlo, Consolas, monospace"
};
function Qa(e) {
	return e ? `${Ce(e.stops)}|${e.perCard}` : "";
}
function $a(e) {
	return e instanceof s ? "El servicio de autobuses del Ayuntamiento ha cambiado. Hace falta actualizar esta aplicación." : e instanceof o ? "No se puede contactar con el servicio de autobuses. Se reintentará automáticamente." : e instanceof i ? e.message : "Error inesperado al cargar las llegadas.";
}
//#endregion
//#region src/entities.ts
customElements.get("logrono-bus-board") || customElements.define("logrono-bus-board", qa), I();
var Q = (e) => typeof e == "string" ? e : null, eo = (e) => typeof e == "number" ? e : null;
function to(e) {
	return e === "asc" || e === "desc" ? e : null;
}
function no(e) {
	return Array.isArray(e) ? e.filter((e) => typeof e == "object" && !!e && typeof e.hora == "string" && typeof e.tiempo_real == "boolean") : [];
}
function ro(e) {
	return e !== void 0 && Q(e.attributes.linea_id) !== null;
}
function io(e) {
	if (!ro(e)) return null;
	let t = e.attributes, n = Q(t.parada_id) ?? "", r = Q(t.linea_id) ?? "", i = to(t.sentido), a = Q(t.destino), o = i ? `${r}:${i}` : null, s = no(t.llegadas).map((e) => ({
		stop_id: n,
		line_id: r,
		pattern_id: o,
		direction: i,
		headsign: a,
		aimed: e.hora,
		expected: e.hora,
		minutes: 0,
		delay_s: 0,
		is_realtime: e.tiempo_real,
		is_approximate: !1,
		terminates: !1,
		cancelled: !1,
		vehicle_id: null
	}));
	return {
		stop_id: n,
		stop_name: Q(t.parada) ?? n,
		line_id: r,
		line_label: Q(t.linea) ?? r,
		line_name: Q(t.nombre_linea) ?? "",
		colour: Q(t.color) ?? "#888888",
		text_colour: Q(t.color_texto) ?? "#000000",
		direction: i,
		headsign: i ? a : null,
		arrivals: s
	};
}
function ao(e, t) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of t) {
		let t = io(e.states[i]);
		if (!t) continue;
		let a = Y(t);
		n.has(a) || (n.add(a), r.push(t));
	}
	return r;
}
function oo(e) {
	return Object.values(e.states).filter((e) => ro(e)).filter((e) => e.attributes.unit_of_measurement === "min").map((e) => e.entity_id).sort();
}
function so(e) {
	if (!ro(e)) return null;
	let t = e.attributes, n = t.servicio;
	return Lt.includes(n) ? {
		state: n,
		first: Q(t.primera_salida),
		last: Q(t.ultima_salida),
		next_departure: Q(t.proxima_salida),
		interval_min: eo(t.frecuencia_min),
		interval_max_min: eo(t.frecuencia_max_min)
	} : null;
}
function co(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) {
		let t = e.states[r], i = io(t), a = so(t);
		i && a && n.set(Y(i), a);
	}
	return n;
}
//#endregion
//#region src/ha.ts
function lo(e, t) {
	e.dispatchEvent(new CustomEvent("config-changed", {
		detail: { config: t },
		bubbles: !0,
		composed: !0
	}));
}
var uo = t((() => {})), fo = /* @__PURE__ */ n({
	EDITOR_LABELS: () => go,
	EDITOR_SCHEMA: () => ho,
	LogronoBusCardEditor: () => vo
});
function po(e) {
	e.stopPropagation();
	let t = {
		...e.detail.value,
		type: `custom:${L}`
	};
	try {
		Nn(t);
	} catch {}
	this.config = t, lo(this, t);
}
var mo, $, ho, go, _o, vo, yo, bo = t((() => {
	I(), Yr(), uo(), k(), v(), $ = (e, t) => ({
		value: e,
		label: t
	}), ho = [
		{
			name: "entities",
			required: !0,
			selector: { entity: {
				multiple: !0,
				filter: {
					integration: "logrono_bus",
					domain: "sensor",
					device_class: "duration"
				}
			} }
		},
		{
			name: "titulo",
			selector: { text: {} }
		},
		{
			type: "grid",
			name: "",
			schema: [
				{
					name: "orden",
					selector: { select: {
						mode: "dropdown",
						options: [
							$("seleccion", "Como las elegí"),
							$("linea", "Por número de línea"),
							$("llegada", "El que llega antes, primero")
						]
					} }
				},
				{
					name: "modo",
					selector: { select: {
						mode: "dropdown",
						options: [$("normal", "Normal"), $("pantalla", "Pantalla (llena la vista)")]
					} }
				},
				{
					name: "aviso",
					selector: { number: {
						min: 0,
						max: 15,
						mode: "box",
						unit_of_measurement: "min"
					} }
				},
				{
					name: "efecto",
					selector: { select: {
						mode: "dropdown",
						options: [
							$("pulso", "Parpadeo suave"),
							$("borde", "Borde fijo"),
							$("destello", "Destello (invierte los colores)"),
							$("etiqueta", "Etiqueta «¡Ya llega!»"),
							$("rayas", "Rayas de aviso"),
							$("ninguno", "Sin efecto")
						]
					} }
				},
				{
					name: "color",
					selector: { select: {
						mode: "dropdown",
						options: [
							$("suave", "Suave"),
							$("normal", "Normal"),
							$("intensa", "Intensa")
						]
					} }
				},
				{
					name: "letra",
					selector: { select: {
						mode: "dropdown",
						options: [
							$("sistema", "La del sistema"),
							$("legible", "Muy legible"),
							$("redondeada", "Redondeada"),
							$("mono", "Tipo panel")
						]
					} }
				},
				{
					name: "tam",
					selector: { number: {
						min: 80,
						max: 150,
						step: 10,
						mode: "slider",
						unit_of_measurement: "%"
					} }
				},
				{
					name: "recorrido",
					selector: { boolean: {} }
				},
				{
					name: "previas",
					selector: { number: {
						min: 1,
						max: 12,
						mode: "box"
					} }
				}
			]
		}
	], go = {
		entities: "Líneas (sensores «… minutos» de Logroño Bus)",
		titulo: "Título",
		orden: "Orden de las tarjetas",
		modo: "Modo",
		aviso: "Avisar cuando falten (0 = no avisar)",
		efecto: "Efecto del aviso",
		color: "Intensidad del color",
		letra: "Tipo de letra",
		tam: "Tamaño del texto",
		recorrido: "Al tocar, ver el recorrido y dónde está el autobús",
		previas: "Paradas previas en el recorrido"
	}, _o = /* @__PURE__ */ new WeakSet(), vo = class extends q {
		constructor() {
			super(), O(this, _o), this.hass = void 0, this.config = void 0;
		}
		setConfig(e) {
			this.config = e;
		}
		get formData() {
			return {
				orden: C.order,
				aviso: C.alertMinutes,
				efecto: C.effect,
				color: C.colour,
				letra: C.font,
				tam: C.textScale,
				modo: "normal",
				recorrido: !0,
				previas: C.previousStops,
				...this.config
			};
		}
		render() {
			return !this.hass || !this.config ? G : U`<ha-form
      .hass=${this.hass}
      .data=${this.formData}
      .schema=${ho}
      .computeLabel=${(e) => go[e.name] ?? e.name}
      @value-changed=${_(_o, this, po)}
    ></ha-form>`;
		}
	}, mo = vo, mo.properties = {
		hass: { attribute: !1 },
		config: { state: !0 }
	}, yo = `${L}-editor`, customElements.get(yo) || customElements.define(yo, vo);
}));
I(), Yr(), Ln(), k(), g(), b(), S(), v();
var xo, So = 5e3, Co = 3, wo = /* @__PURE__ */ new WeakMap(), To = /* @__PURE__ */ new WeakMap(), Eo = /* @__PURE__ */ new WeakMap(), Do = /* @__PURE__ */ new WeakMap(), Oo = /* @__PURE__ */ new WeakSet(), ko = class extends q {
	constructor() {
		super(), O(this, Oo), h(this, wo, void 0), h(this, To, void 0), h(this, Eo, []), h(this, Do, /* @__PURE__ */ new Map()), this.hass = void 0, this.config = void 0, this.now = Date.now(), this.opened = void 0;
	}
	setConfig(e) {
		this.config = Nn(e);
	}
	getCardSize() {
		var e;
		return Math.max(2, (((e = this.config) == null ? void 0 : e.entities.length) ?? 1) * Co);
	}
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	static async getConfigElement() {
		return await Promise.resolve().then(() => (bo(), fo)), document.createElement(`${L}-editor`);
	}
	static getStubConfig(e) {
		return {
			entities: oo(e).slice(0, 4),
			orden: "llegada"
		};
	}
	connectedCallback() {
		super.connectedCallback(), y(wo, this, setInterval(() => this.now = Date.now(), So));
	}
	disconnectedCallback() {
		super.disconnectedCallback(), clearInterval(x(wo, this));
	}
	shouldUpdate(e) {
		if (!e.has("hass") || e.size > 1) return !0;
		let t = e.get("hass"), n = this.config;
		return !t || !n || !this.hass || n.entities.some((e) => {
			var n;
			return t.states[e] !== ((n = this.hass) == null ? void 0 : n.states[e]);
		});
	}
	willUpdate() {
		let e = this.config;
		e && (this.setAttribute("modo", e.modo), this.style.setProperty("--lb-text-scale", String(e.tam / 100)), this.style.fontFamily = e.letra === "sistema" ? "" : Za[e.letra], this.hass && (y(Eo, this, ao(this.hass, e.entities)), y(Do, this, co(this.hass, e.entities))));
	}
	render() {
		let e = this.config;
		if (!e) return G;
		let t = e.modo === "pantalla" ? "kiosk" : "auto";
		return U`<ha-card>
      ${e.titulo ? U`<h1>${e.titulo}</h1>` : G}
      ${x(Eo, this).length === 0 ? U`<p class="empty">
              No hay datos de los sensores elegidos. Comprueba que pertenecen a la integración
              Logroño Bus.
            </p>` : U`<lb-card-grid
              .cards=${x(Eo, this)}
              .services=${x(Do, this)}
              .now=${this.now}
              order=${e.orden}
              colour=${e.color}
              effect=${e.efecto}
              alert-minutes=${e.aviso}
              layout=${t}
              .openable=${e.recorrido}
              @card-open=${(e) => this.opened = e.detail}
            ></lb-card-grid>`}
      ${_(Oo, this, jo).call(this)}
    </ha-card>`;
	}
};
xo = ko;
function Ao() {
	return x(To, this) ?? y(To, this, new wn("https://transporteurbano.logrono.es/api/", { store: new jn(() => globalThis.localStorage) })), x(To, this);
}
function jo() {
	let e = this.opened, t = this.config;
	return !e || !t ? G : U`<lb-route
      .card=${e}
      .source=${Ao.call(_(Oo, this))}
      .previousStops=${t.previas}
      .arrivals=${{
		stop_id: e.stop_id,
		generated_at: (/* @__PURE__ */ new Date()).toISOString(),
		arrivals: e.arrivals
	}}
      @route-close=${() => this.opened = void 0}
    ></lb-route>`;
}
//#endregion
//#region src/index.ts
xo.properties = {
	hass: { attribute: !1 },
	config: { state: !0 },
	now: { state: !0 },
	opened: { state: !0 }
}, xo.styles = R`
    :host {
      display: block;
      /* Home Assistant theme → card tokens. */
      --lb-bg: var(--card-background-color, var(--ha-card-background, #fff));
      --lb-fg: var(--primary-text-color, #111);
      --lb-muted: var(--secondary-text-color, #555);
      --lb-surface: var(--card-background-color, #fff);
      --lb-border: var(--divider-color, #ddd);
      --lb-radius: var(--ha-card-border-radius, 12px);
      --lb-focus: var(--primary-color, #03a9f4);
      --lb-card-min: 200px;
    }
    ha-card {
      color: var(--primary-text-color, inherit);
      padding: 12px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    h1 {
      margin: 0 4px;
      font-size: 1.2em;
      font-weight: 600;
    }
    :host([modo='pantalla']) ha-card {
      height: calc(100vh - var(--header-height, 56px) - 16px);
    }
    lb-card-grid {
      flex: 1;
      min-height: 0;
    }
    .empty {
      margin: 8px 4px;
      color: var(--lb-muted);
    }
  `, customElements.get("logrono-bus-card") || customElements.define(L, ko), Ln();
var Mo;
(Mo = window).customCards ?? (Mo.customCards = []), window.customCards.some((e) => e.type === "logrono-bus-card") || window.customCards.push({
	type: L,
	name: "Logroño Bus",
	description: "Próximos autobuses de tus paradas, con el aspecto de la web de Logroño Bus.",
	preview: !0
}), console.info(`%c LOGROÑO-BUS-CARD %c ${r} `, "color:#fff;background:#8c1c2c", "");
//#endregion
export { ko as LogronoBusCard, io as cardFromEntity, ao as cardsFromHass, Nn as normalizeConfig };
