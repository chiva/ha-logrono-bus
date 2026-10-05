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
function h(e, t) {
	let n = /^\d+$/.test(e), r = /^\d+$/.test(t);
	return n && r ? Number(e) - Number(t) : n === r ? te(e, t) : n ? -1 : 1;
}
function te(e, t) {
	return e === t ? 0 : e < t ? -1 : 1;
}
function ne(e, t) {
	return Math.max(0, Math.floor(((typeof e == "number" ? e : Date.parse(e)) - (typeof t == "number" ? t : Date.parse(t))) / 6e4));
}
var re, ie, ae = t((() => {
	re = ["asc", "desc"], ie = "Europe/Madrid";
}));
//#endregion
//#region ../core/src/text.ts
function oe(e) {
	return e.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().trim().split(/\s+/).filter(Boolean).join(" ");
}
function se(e) {
	return e.trim().toLowerCase().split(/\s+/).filter(Boolean).map((e, t) => t > 0 && ce.has(e) ? e : e.slice(0, 1).toUpperCase() + e.slice(1)).join(" ");
}
var ce, le = t((() => {
	ce = /* @__PURE__ */ new Set([
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
function ue(e, t) {
	if (t.has(e)) throw TypeError("Cannot initialize the same private elements twice on an object");
}
var de = t((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/classPrivateFieldInitSpec.js
function g(e, t, n) {
	ue(e, t), t.set(e, n);
}
var _ = t((() => {
	de();
}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/assertClassBrand.js
function v(e, t, n) {
	if (typeof e == "function" ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw TypeError("Private element is not present on this object");
}
var y = t((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/classPrivateFieldSet2.js
function b(e, t, n) {
	return e.set(v(e, t), n), n;
}
var x = t((() => {
	y();
}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/classPrivateFieldGet2.js
function S(e, t) {
	return e.get(v(e, t));
}
var C = t((() => {
	y();
}));
//#endregion
//#region ../core/src/catalog.ts
function fe(e, t) {
	let n = e.stop_ids.indexOf(t);
	return n === -1 ? null : n + 1;
}
function pe(e, t) {
	return e.stop_ids.length > 0 && e.stop_ids[e.stop_ids.length - 1] === t;
}
var me, he, ge, _e, ve, ye = t((() => {
	d(), ee(), ae(), le(), _(), x(), C(), me = /* @__PURE__ */ new WeakMap(), he = /* @__PURE__ */ new WeakMap(), ge = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), ve = class {
		constructor(e) {
			g(this, me, void 0), g(this, he, void 0), g(this, ge, void 0), g(this, _e, void 0), this.catalog = e, b(me, this, new Map(e.lines.map((e) => [e.id, e]))), b(he, this, new Map(e.stops.map((e) => [e.id, e]))), b(ge, this, new Map(e.patterns.map((e) => [e.id, e])));
			let t = /* @__PURE__ */ new Map();
			for (let n of e.patterns) for (let e of new Set(n.stop_ids)) {
				let r = t.get(e) ?? [];
				r.push(n), t.set(e, r);
			}
			b(_e, this, t);
		}
		get lines() {
			return this.catalog.lines;
		}
		get stops() {
			return this.catalog.stops;
		}
		hasLine(e) {
			return S(me, this).has(e);
		}
		line(e) {
			let t = S(me, this).get(e);
			if (!t) throw new l(e);
			return t;
		}
		stop(e) {
			let t = S(he, this).get(e);
			if (!t) throw new c(e);
			return t;
		}
		findStop(e) {
			return S(he, this).get(e);
		}
		pattern(e) {
			return S(ge, this).get(e);
		}
		patternsForLine(e) {
			return this.catalog.patterns.filter((t) => t.line_id === e);
		}
		patternsAt(e) {
			return S(_e, this).get(e) ?? [];
		}
		nearby(e, t, { radiusM: n = 500, limit: r = 10 } = {}) {
			return this.catalog.stops.map((n) => ({
				stop: n,
				distance_m: f(e, t, n.lat, n.lon)
			})).filter((e) => e.distance_m <= n).sort((e, t) => e.distance_m - t.distance_m || te(e.stop.id, t.stop.id)).slice(0, r);
		}
		search(e, { limit: t = 20 } = {}) {
			let n = oe(e);
			if (!n) return [];
			let r = S(he, this).get(n), i = this.catalog.stops.filter((e) => e !== r && oe(e.name).includes(n)).map((e) => ({
				stop: e,
				startsWith: oe(e.name).startsWith(n)
			})).sort((e, t) => Number(t.startsWith) - Number(e.startsWith) || te(e.stop.name, t.stop.name) || te(e.stop.id, t.stop.id)).map(({ stop: e }) => e);
			return [...r ? [r] : [], ...i].slice(0, t);
		}
	};
}));
//#endregion
//#region ../core/src/selection.ts
function be(e) {
	return e === "asc" ? "a" : e === "desc" ? "d" : "x";
}
function xe(e, t) {
	return t.line_id === e.line_id && (e.direction === null || t.direction === e.direction);
}
function Se(e) {
	return e.map((e) => {
		let t = e.lines.map((e) => `${e.line_id}${be(e.direction)}`).join(".");
		return t ? `${e.stop_id}-${t}` : e.stop_id;
	}).join("~");
}
var Ce = t((() => {}));
//#endregion
//#region ../core/src/cards.ts
function we(e, t) {
	return t.lines.length > 0 ? [...t.lines] : e.patternsAt(t.stop_id).filter((e) => !pe(e, t.stop_id)).map((e) => ({
		line_id: e.line_id,
		direction: e.direction
	}));
}
function Te(e, t, n, r = 3) {
	let i = e.stop(t.stop_id), a = [], o = /* @__PURE__ */ new Map();
	for (let n of we(e, t)) e.hasLine(n.line_id) && !o.has(Oe(n)) && (a.push(n), o.set(Oe(n), []));
	for (let r of n.arrivals) {
		var s;
		if (r.stop_id !== i.id) continue;
		let n = a.find((e) => xe(e, r));
		!n && r.direction === null && t.lines.length === 0 && e.hasLine(r.line_id) && (n = {
			line_id: r.line_id,
			direction: null
		}, a.push(n), o.set(Oe(n), [])), n && ((s = o.get(Oe(n))) == null || s.push(r));
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
			arrivals: (o.get(Oe(t)) ?? []).slice(0, r)
		};
	});
}
function Ee(e) {
	let t = e.arrivals.find((e) => !e.cancelled);
	return t ? Date.parse(t.expected) : null;
}
function De(e, t) {
	return t === "seleccion" ? [...e] : t === "linea" ? [...e].sort(ke) : [...e].sort((e, t) => {
		let n = Ee(e), r = Ee(t);
		return n === null || r === null ? n === r ? 0 : n === null ? 1 : -1 : n - r || h(e.line_label, t.line_label);
	});
}
var Oe, ke, Ae = t((() => {
	ye(), ae(), Ce(), Oe = (e) => `${e.line_id}${be(e.direction)}`, ke = (e, t) => h(e.line_label, t.line_label) || te(e.headsign ?? "", t.headsign ?? "") || te(e.stop_name, t.stop_name) || te(e.stop_id, t.stop_id);
}));
//#endregion
//#region ../core/src/colour.ts
function je(e) {
	let t = e.trim(), n = Re.exec(t);
	if (n != null && n[1]) return `#${n[1].toUpperCase()}`;
	let r = Le.exec(t);
	if (r) {
		let t = r.slice(1, 4).map(Number);
		if (t.some((e) => e > He)) throw RangeError(`Canal de color fuera de rango: '${e}'`);
		return `#${t.map((e) => e.toString(16).padStart(2, "0").toUpperCase()).join("")}`;
	}
	throw RangeError(`Color no reconocido: '${e}'`);
}
function Me(e) {
	let t = je(e), n = [
		1,
		3,
		5
	].map((e) => {
		let n = parseInt(t.slice(e, e + 2), 16) / He;
		return n <= ze ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
	});
	return Be.reduce((e, t, r) => e + t * (n[r] ?? 0), 0);
}
function Ne(e, t) {
	let [n, r] = [Me(e), Me(t)].sort((e, t) => t - e);
	return (n + Ve) / (r + Ve);
}
function Pe(e) {
	return Ne(e, "#000000") >= Ne(e, "#FFFFFF") ? Fe : Ie;
}
var Fe, Ie, Le, Re, ze, Be, Ve, He, Ue = t((() => {
	Fe = "#000000", Ie = "#FFFFFF", Le = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)$/i, Re = /^#?([0-9a-f]{6})$/i, ze = .04045, Be = [
		.2126,
		.7152,
		.0722
	], Ve = .05, He = 255;
}));
//#endregion
//#region ../core/src/route.ts
function We(e, t, n, r, i, { previousStops: a = 4, now: o = r.generated_at, previous: s = null } = {}) {
	let c = e.pattern(t), l = c ? fe(c, n) : null;
	if (!c || l === null) return null;
	let u = Math.max(1, l - Math.max(0, a)), d = c.stop_ids.slice(u - 1, l).map((t, n) => {
		var r;
		return {
			id: t,
			name: ((r = e.findStop(t)) == null ? void 0 : r.name) ?? t,
			position: u + n,
			terminus: u + n === 1 || u + n === c.stop_ids.length
		};
	}), f = [];
	for (let t of r.vehicles) {
		if (t.pattern_id !== c.id) continue;
		if (t.next_stop_id === null) {
			let n = Ke(e, c, t);
			if (n === null || n > l) continue;
			f.push({
				vehicleId: t.id,
				at: n - u,
				stopsAway: Math.max(0, l - n - 1)
			});
			continue;
		}
		let n = fe(c, t.next_stop_id);
		n === null || n > l || f.push({
			vehicleId: t.id,
			at: n === 1 ? 1 - u : n - 1 - u + qe(e, c, n, t),
			stopsAway: l - n
		});
	}
	let p = Ge(f, u, (s == null ? void 0 : s.patternId) === c.id && s.stopId === n ? s : null);
	p.sort((e, t) => t.at - e.at);
	let m = ((i == null ? void 0 : i.arrivals) ?? []).filter((e) => e.pattern_id === c.id && e.is_realtime && !e.cancelled).map((e) => ne(e.expected, o)), ee = p.map((e, t) => ({
		...e,
		minutes: m[t] ?? null
	}));
	return {
		patternId: c.id,
		lineId: c.line_id,
		stopId: n,
		origin: c.origin,
		headsign: c.headsign,
		stops: d,
		buses: ee.filter((e) => e.at >= 0),
		earlierBuses: ee.filter((e) => e.at < 0),
		hiddenStops: u - 1,
		stopsAfter: c.stop_ids.length - l,
		generatedAt: r.generated_at
	};
}
function Ge(e, t, n) {
	if (!n) return [...e];
	let r = n.hiddenStops + 1, i = new Map([...n.buses, ...n.earlierBuses].map((e) => [e.vehicleId, e]));
	return e.map((e) => {
		let n = i.get(e.vehicleId);
		if (!n) return e;
		let a = n.at + r - (e.at + t);
		return a <= 0 || a > 1 ? e : {
			vehicleId: e.vehicleId,
			at: n.at + r - t,
			stopsAway: Math.min(e.stopsAway, n.stopsAway)
		};
	});
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
	ye(), ee(), ae(), Je = (e, t, n) => Math.min(n, Math.max(t, e));
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
var Qe, $e, et, tt, w, nt = t((() => {
	Ae(), Ye(), Qe = [
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
	], w = {
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
	let r = e.filter((e) => fe(e, t) === n);
	return r.length === 1 ? r[0] ?? null : null;
}
var it, at, ot, st = t((() => {
	ye(), _(), x(), C(), it = /* @__PURE__ */ new WeakMap(), at = /* @__PURE__ */ new WeakMap(), ot = class e {
		constructor(e) {
			g(this, it, void 0), g(this, at, /* @__PURE__ */ new Map()), b(it, this, e);
		}
		resolve(t, n, r, i) {
			let a = S(it, this).patternsAt(n).filter((e) => e.line_id === t), o = rt.call(e, a, n, r), s = `${t}\u0000${i}`;
			if (o) return i && S(at, this).set(s, o.id), o;
			let c = i ? S(at, this).get(s) : void 0;
			return c ? a.find((e) => e.id === c) ?? null : null;
		}
	};
}));
//#endregion
//#region ../core/src/raw.ts
function T(e, t) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw new s(`se esperaba un objeto, llegó ${Ct(e)}`, t);
	return e;
}
function ct(e, t) {
	if (!Array.isArray(e)) throw new s(`se esperaba una lista, llegó ${Ct(e)}`, t);
	return e;
}
function E(e, t, n) {
	if (!(t in e)) throw new s("falta el campo", `${n}.${t}`);
	return e[t];
}
function D(e, t) {
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
function O(e, t) {
	if (typeof e == "boolean") throw new s("se esperaba un identificador, llegó un booleano", t);
	if (typeof e == "number" && Number.isInteger(e)) return String(e);
	let n = D(e, t);
	if (!n) throw new s("identificador vacío", t);
	return /^\d+$/.test(n) ? String(Number.parseInt(n, 10)) : n;
}
function ft(e, t) {
	return e == null || e === "" ? "" : O(e, t);
}
function pt(e, t) {
	let n = D(e, t), r = wt.exec(n);
	if (!r) {
		let e = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(n);
		throw new s(e ? `fecha sin zona horaria '${n}'` : `fecha no válida '${n}'`, t);
	}
	let [, i, a, o, c = "00", l = "", u = ""] = r, d = l.padEnd(6, "0"), f = `${i}T${a}:${o}:${c}${Number(d) === 0 ? "" : `.${d}`}${u === "Z" ? "+00:00" : u.length === 3 ? `${u}:00` : u.includes(":") ? u : `${u.slice(0, 3)}:${u.slice(3)}`}`;
	if (Number.isNaN(Date.parse(f))) throw new s(`fecha no válida '${n}'`, t);
	return f;
}
function mt(e, t) {
	return ct(E(T(E(T(e, "$"), "result", "$"), "$.result"), t, "$.result"), `$.result.${t}`);
}
function ht(e, t) {
	return ct(e, t).map((e, n) => {
		let r = `${t}[${n}]`, i = T(e, r);
		return {
			id: O(E(i, "id", r), `${r}.id`),
			name: D(E(i, "name", r), `${r}.name`)
		};
	});
}
function gt(e) {
	return mt(e, "lines").map((e, t) => {
		let n = `$.result.lines[${t}]`, r = T(e, n), i = T(E(r, "stops", n), `${n}.stops`);
		return {
			id: O(E(r, "id", n), `${n}.id`),
			name: D(E(r, "name", n), `${n}.name`),
			colour: D(E(r, "color", n), `${n}.color`),
			asc: ht(E(i, "asc", `${n}.stops`), `${n}.stops.asc`),
			desc: ht(E(i, "desc", `${n}.stops`), `${n}.stops.desc`)
		};
	});
}
function _t(e) {
	return mt(e, "stops").map((e, t) => {
		let n = `$.result.stops[${t}]`, r = T(e, n), i = ct(r.lines ?? [], `${n}.lines`);
		return {
			id: O(E(r, "id", n), `${n}.id`),
			name: D(E(r, "name", n), `${n}.name`),
			lat: ut(E(r, "lat", n), `${n}.lat`),
			lon: ut(E(r, "lng", n), `${n}.lng`),
			lineIds: i.map((e, t) => O(e, `${n}.lines[${t}]`))
		};
	});
}
function vt(e) {
	return mt(e, "arrivals").map((e, t) => {
		let n = `$.result.arrivals[${t}]`, r = T(e, n), i = r.order;
		return {
			lineId: O(E(r, "lineRef", n), `${n}.lineRef`),
			stopId: O(E(r, "stopPointRef", n), `${n}.stopPointRef`),
			directionRef: ft(r.directionRef, `${n}.directionRef`),
			vehicleRef: ft(r.vehicleRef, `${n}.vehicleRef`),
			order: i == null ? null : lt(i, `${n}.order`),
			aimed: pt(E(r, "aimedArrivalTime", n), `${n}.aimedArrivalTime`),
			expected: pt(E(r, "expectedArrivalTime", n), `${n}.expectedArrivalTime`),
			arrivalStatus: D(r.arrivalStatus ?? "", `${n}.arrivalStatus`),
			cancelled: dt(r.cancellation ?? !1, `${n}.cancellation`),
			inaccurate: dt(r.predictionInaccurate ?? !1, `${n}.predictionInaccurate`),
			delayS: lt(r.delaySeconds ?? 0, `${n}.delaySeconds`)
		};
	});
}
function yt(e) {
	return mt(e, "activities").map((e, t) => {
		let n = `$.result.activities[${t}]`, r = T(e, n);
		return {
			vehicleRef: O(E(r, "vehicleRef", n), `${n}.vehicleRef`),
			lineId: O(E(r, "lineRef", n), `${n}.lineRef`),
			directionRef: D(r.directionRef ?? "", `${n}.directionRef`),
			lat: ut(E(r, "latitude", n), `${n}.latitude`),
			lon: ut(E(r, "longitude", n), `${n}.longitude`),
			nextStopId: ft(r.nextStopRef, `${n}.nextStopRef`),
			recordedAt: pt(E(r, "locationRecordedAtTime", n), `${n}.locationRecordedAtTime`),
			delayS: lt(r.delaySeconds ?? 0, `${n}.delaySeconds`)
		};
	});
}
function bt(e, t) {
	let n = D(e, t), r = Tt.exec(n), i = r ? Number(r[1]) : NaN, a = r ? Number(r[2]) : NaN;
	if (!r || i > Et || a >= Dt) throw new s(`hora no válida: '${n}'`, t);
	return `${String(i).padStart(2, "0")}:${r[2]}`;
}
function xt(e, t) {
	let n = T(e, t), r = n.intervalMinutesMax;
	return {
		first: bt(E(n, "firstPass", t), `${t}.firstPass`),
		last: bt(E(n, "lastPass", t), `${t}.lastPass`),
		intervalMin: lt(E(n, "intervalMinutes", t), `${t}.intervalMinutes`),
		intervalMaxMin: r == null ? null : lt(r, `${t}.intervalMinutesMax`)
	};
}
function St(e) {
	let t = T(E(T(e, "$"), "result", "$"), "$.result"), n = T(E(t, "frequenciesByDirection", "$.result"), "$.result.frequenciesByDirection"), r = T(E(t, "passesByDirection", "$.result"), "$.result.passesByDirection");
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
	ae(), Lt = [
		"antes",
		"en_servicio",
		"terminado",
		"sin_servicio"
	], Rt = 1440, zt = new Intl.DateTimeFormat("en-GB", {
		timeZone: ie,
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
	let t = e.indexOf($t), n = t === -1 ? e : e.slice(0, t), r = (t === -1 ? "" : e.slice(t + 1)).split($t).filter((e) => e.trim()).map(se);
	return [n.trim(), r.join(en)];
}
function Ut(e) {
	let [t, n] = Ht(e.name), r;
	try {
		r = je(e.colour);
	} catch (t) {
		throw new s(t.message, `line[${e.id}].color`);
	}
	return {
		id: e.id,
		label: t || e.id,
		name: n || e.name,
		colour: r,
		text_colour: Pe(r)
	};
}
function Wt(e) {
	return re.flatMap((t) => {
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
	let n = [...new Set(e.lineIds)].filter((e) => t.has(e)).sort(h);
	return {
		id: e.id,
		name: e.name,
		lat: e.lat,
		lon: e.lon,
		line_ids: n
	};
}
function Kt(e, t, n) {
	let r = e.map(Ut).sort((e, t) => h(e.label, t.label)), i = new Map(r.map((e, t) => [e.id, t])), a = e.flatMap(Wt).sort((e, t) => (i.get(e.line_id) ?? 0) - (i.get(t.line_id) ?? 0) || re.indexOf(e.direction) - re.indexOf(t.direction)), o = new Set(i.keys());
	return {
		lines: r,
		patterns: a,
		stops: t.map((e) => Gt(e, o)).sort((e, t) => h(e.id, t.id)),
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
			minutes: ne(n.expected, o),
			delay_s: n.delayS,
			is_realtime: !!n.vehicleRef && n.arrivalStatus.toLowerCase() !== "scheduled",
			is_approximate: n.inaccurate,
			terminates: e ? pe(e, t) : !1,
			cancelled: n.cancelled,
			vehicle_id: n.vehicleRef || null
		});
	}
	return c.sort((e, t) => Date.parse(e.expected) - Date.parse(t.expected) || h(n.line(e.line_id).label, n.line(t.line_id).label)), {
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
		}).sort((e, t) => h(e.id, t.id))
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
	return a.sort((e, t) => re.indexOf(e.direction) - re.indexOf(t.direction)), {
		line_id: t,
		service_date: At(i),
		generated_at: i,
		directions: a
	};
}
var Zt, Qt, $t, en, tn = t((() => {
	ye(), Ue(), d(), ae(), Ot(), le(), Vt(), Zt = 18e4, Qt = {
		ida: "asc",
		vuelta: "desc"
	}, $t = "-", en = " – ";
}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/classPrivateMethodInitSpec.js
function k(e, t) {
	ue(e, t), t.add(e);
}
var A = t((() => {
	de();
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
	let n = (t = S(Sn, this)) == null ? void 0 : t.get(e);
	if (!n) return null;
	try {
		return JSON.parse(n);
	} catch {
		return null;
	}
}
function on() {
	if (!S(wn, this)) {
		let e = v(N, this, sn).call(this).then((e) => {
			let t = new ve(e);
			return {
				index: t,
				resolver: new ot(t)
			};
		});
		e.catch(() => {
			S(wn, this) === e && b(wn, this, void 0);
		}), b(wn, this, e);
	}
	return S(wn, this);
}
async function sn() {
	let e = v(N, this, cn).call(this);
	if (e && S(M, this).call(this) - Date.parse(e.fetched_at) < 864e5) return e;
	try {
		var t;
		let [e, n] = await Promise.all([v(N, this, ln).call(this, `${S(j, this)}linesDiscovery/lines`), v(N, this, ln).call(this, `${S(j, this)}linesDiscovery/stops`)]), r = Kt(gt(e), _t(n), bn(S(M, this)));
		return (t = S(Sn, this)) == null || t.set("logrono-bus:catalogo:v1", JSON.stringify(r)), r;
	} catch (t) {
		if (e && t instanceof o) return e;
		throw t;
	}
}
function cn() {
	let e = v(N, this, an).call(this, _n);
	return e && Array.isArray(e.stops) && typeof e.fetched_at == "string" ? e : null;
}
async function ln(e, t) {
	let { response: n, body: r } = await rn(S(xn, this), e, {
		signal: t,
		timeoutMs: S(Cn, this)
	});
	if (n.status === 429 || n.status >= 500) throw new o(`${e}: HTTP ${n.status}`);
	if (!n.ok) throw new s(`HTTP ${n.status} inesperado`, e);
	return r;
}
async function un(e, t) {
	var n;
	let { response: r, body: i } = await rn(S(Dn, this), `${S(En, this)}${e}`, {
		signal: t,
		timeoutMs: S(On, this)
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
	return e.source === "directa" ? new Tn(pn, t) : e.source === "servidor" || e.api || await dn(r, n) ? new An(r, t) : new Tn(pn, t);
}
var pn, mn, hn, gn, _n, vn, yn, bn, j, xn, Sn, M, Cn, wn, N, Tn, En, Dn, On, P, kn, An, jn = t((() => {
	ye(), st(), d(), tn(), Ot(), Vt(), A(), _(), x(), y(), C(), pn = "https://transporteurbano.logrono.es/api/", mn = "./api/v1", hn = 1e4, gn = 3e3, _n = "logrono-bus:catalogo:v1", vn = "logrono-bus:horario:v1:", yn = class extends i {
		constructor(...e) {
			super(...e), this.name = "UnusableSource";
		}
	}, bn = (e) => new Date(e()).toISOString(), j = /* @__PURE__ */ new WeakMap(), xn = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ new WeakMap(), wn = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakSet(), Tn = class {
		constructor(e = pn, t = {}) {
			k(this, N), g(this, j, void 0), g(this, xn, void 0), g(this, Sn, void 0), g(this, M, void 0), g(this, Cn, void 0), g(this, wn, void 0), this.kind = "directa", b(j, this, e.endsWith("/") ? e : `${e}/`), b(xn, this, t.fetch ?? ((e, t) => globalThis.fetch(e, t))), b(Sn, this, t.store), b(M, this, t.now ?? Date.now), b(Cn, this, t.timeoutMs ?? 1e4);
		}
		async catalog() {
			return (await v(N, this, on).call(this)).index;
		}
		async arrivals(e, t) {
			let { index: n, resolver: r } = await v(N, this, on).call(this), i = n.stop(e);
			if (i.line_ids.length === 0) return {
				stop_id: i.id,
				generated_at: bn(S(M, this)),
				arrivals: []
			};
			let a = new URLSearchParams({
				lines: i.line_ids.join(","),
				previewMinutes: "60"
			}), o = `${S(j, this)}estimatedTimetable/byStop/${encodeURIComponent(i.id)}?${a}`;
			return qt(vt(await v(N, this, ln).call(this, o, t)), i.id, n, r, bn(S(M, this)));
		}
		async vehicles(e, t) {
			let { index: n } = await v(N, this, on).call(this), r = n.line(e), i = `${S(j, this)}vehicleMonitoring/byLine/${encodeURIComponent(r.id)}`;
			return Yt(yt(await v(N, this, ln).call(this, i, t)), r.id, n, bn(S(M, this)));
		}
		async timetable(e, t) {
			var n;
			let { index: r } = await v(N, this, on).call(this), i = r.line(e), a = At(S(M, this).call(this)), o = `${vn}${i.id}`, s = v(N, this, an).call(this, o);
			if ((s == null ? void 0 : s.service_date) === a && Array.isArray(s.directions)) return s;
			let c = `${S(j, this)}productionTimetable/byLine/${encodeURIComponent(i.id)}`, l = Xt(St(await v(N, this, ln).call(this, c, t)), i.id, r, bn(S(M, this)));
			return (n = S(Sn, this)) == null || n.set(o, JSON.stringify(l)), l;
		}
	}, En = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakMap(), On = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), kn = /* @__PURE__ */ new WeakSet(), An = class {
		constructor(e = mn, t = {}) {
			k(this, kn), g(this, En, void 0), g(this, Dn, void 0), g(this, On, void 0), g(this, P, void 0), this.kind = "servidor", b(En, this, e.replace(/\/+$/, "")), b(Dn, this, t.fetch ?? ((e, t) => globalThis.fetch(e, t))), b(On, this, t.timeoutMs ?? 1e4);
		}
		catalog() {
			if (!S(P, this)) {
				let e = v(kn, this, un).call(this, "/catalog").then((e) => new ve(e));
				e.catch(() => {
					S(P, this) === e && b(P, this, void 0);
				}), b(P, this, e);
			}
			return S(P, this);
		}
		arrivals(e, t) {
			return v(kn, this, un).call(this, `/stops/${encodeURIComponent(e)}/arrivals`, t);
		}
		vehicles(e, t) {
			return v(kn, this, un).call(this, `/lines/${encodeURIComponent(e)}/vehicles`, t);
		}
		timetable(e, t) {
			return v(kn, this, un).call(this, `/lines/${encodeURIComponent(e)}/timetable`, t);
		}
	};
})), Mn, Nn, Pn = t((() => {
	_(), C(), x(), Mn = /* @__PURE__ */ new WeakMap(), Nn = class {
		constructor(e) {
			g(this, Mn, void 0);
			try {
				b(Mn, this, e());
			} catch {
				b(Mn, this, void 0);
			}
		}
		get(e) {
			try {
				var t;
				return ((t = S(Mn, this)) == null ? void 0 : t.getItem(e)) ?? null;
			} catch {
				return null;
			}
		}
		set(e, t) {
			try {
				var n;
				(n = S(Mn, this)) == null || n.setItem(e, t);
			} catch {}
		}
		remove(e) {
			try {
				var t;
				(t = S(Mn, this)) == null || t.removeItem(e);
			} catch {}
		}
	};
})), F = t((() => {
	Ae(), ye(), Ue(), nt(), st(), d(), ee(), ae(), tn(), Ot(), Ye(), Ce(), jn(), Pn(), le(), Vt();
}));
//#endregion
//#region src/config.ts
function Fn(e) {
	if (typeof e != "object" || !e) throw new Ln("La configuración de la tarjeta no es válida.");
	let t = e, n = t.entities;
	if (!Array.isArray(n) || n.length === 0) throw new Ln("Indica al menos un sensor en «entities» (los de Logroño Bus terminados en _minutos).");
	let r = Number(t.aviso ?? w.alertMinutes), i = Number(t.tam ?? w.textScale), a = Number(t.previas ?? w.previousStops), o = t.titulo;
	return {
		type: typeof t.type == "string" ? t.type : `custom:${I}`,
		entities: n.filter((e) => typeof e == "string"),
		...typeof o == "string" && o.trim() ? { titulo: o.trim() } : {},
		orden: Rn(tt, t.orden, w.order),
		aviso: Number.isFinite(r) ? Math.min(15, Math.max(0, Math.round(r))) : w.alertMinutes,
		efecto: Rn(et, t.efecto, w.effect),
		color: Rn(Qe, t.color, w.colour),
		letra: Rn($e, t.letra, w.font),
		tam: Number.isFinite(i) ? Xe(i) : w.textScale,
		modo: Rn(In, t.modo, "normal"),
		recorrido: t.recorrido !== !1,
		previas: Number.isFinite(a) ? Ze(a) : w.previousStops
	};
}
var I, In, Ln, Rn, zn = t((() => {
	F(), I = "logrono-bus-card", In = ["normal", "pantalla"], Ln = class extends Error {
		constructor(...e) {
			super(...e), this.name = "CardConfigError";
		}
	}, Rn = (e, t, n) => typeof t == "string" && e.includes(t) ? t : n;
})), Bn, Vn, Hn, Un, Wn, Gn, L, Kn, qn, Jn = t((() => {
	Bn = globalThis, Vn = Bn.ShadowRoot && (Bn.ShadyCSS === void 0 || Bn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Hn = Symbol(), Un = /* @__PURE__ */ new WeakMap(), Wn = class {
		constructor(e, t, n) {
			if (this._$cssResult$ = !0, n !== Hn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
			this.cssText = e, this.t = t;
		}
		get styleSheet() {
			let e = this.o, t = this.t;
			if (Vn && e === void 0) {
				let n = t !== void 0 && t.length === 1;
				n && (e = Un.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Un.set(t, e));
			}
			return e;
		}
		toString() {
			return this.cssText;
		}
	}, Gn = (e) => new Wn(typeof e == "string" ? e : e + "", void 0, Hn), L = (e, ...t) => {
		let n = e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
			if (!0 === e._$cssResult$) return e.cssText;
			if (typeof e == "number") return e;
			throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
		})(n) + e[r + 1], e[0]);
		return new Wn(n, e, Hn);
	}, Kn = (e, t) => {
		if (Vn) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
		else for (let n of t) {
			let t = document.createElement("style"), r = Bn.litNonce;
			r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
		}
	}, qn = Vn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
		let t = "";
		for (let n of e.cssRules) t += n.cssText;
		return Gn(t);
	})(e) : e;
})), Yn, Xn, Zn, Qn, $n, er, tr, R, nr, rr, ir, ar, or, sr, cr, z, lr = t((() => {
	Jn(), {is: Xn, defineProperty: Zn, getOwnPropertyDescriptor: Qn, getOwnPropertyNames: $n, getOwnPropertySymbols: er, getPrototypeOf: tr} = Object, R = globalThis, nr = R.trustedTypes, rr = nr ? nr.emptyScript : "", ir = R.reactiveElementPolyfillSupport, ar = (e, t) => e, or = {
		toAttribute(e, t) {
			switch (t) {
				case Boolean:
					e = e ? rr : null;
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
	}, sr = (e, t) => !Xn(e, t), cr = {
		attribute: !0,
		type: String,
		converter: or,
		reflect: !1,
		useDefault: !1,
		hasChanged: sr
	}, (Yn = Symbol).metadata ?? (Yn.metadata = Symbol("metadata")), R.litPropertyMetadata ?? (R.litPropertyMetadata = /* @__PURE__ */ new WeakMap()), z = class extends HTMLElement {
		static addInitializer(e) {
			this._$Ei(), (this.l ?? (this.l = [])).push(e);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(e, t = cr) {
			if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
				let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
				r !== void 0 && Zn(this.prototype, e, r);
			}
		}
		static getPropertyDescriptor(e, t, n) {
			let { get: r, set: i } = Qn(this.prototype, e) ?? {
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
			return this.elementProperties.get(e) ?? cr;
		}
		static _$Ei() {
			if (this.hasOwnProperty(ar("elementProperties"))) return;
			let e = tr(this);
			e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
		}
		static finalize() {
			if (this.hasOwnProperty(ar("finalized"))) return;
			if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ar("properties"))) {
				let e = this.properties, t = [...$n(e), ...er(e)];
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
				for (let e of n) t.unshift(qn(e));
			} else e !== void 0 && t.push(qn(e));
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
			return Kn(e, this.constructor.elementStyles), e;
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
				let a = (((i = n.converter) == null ? void 0 : i.toAttribute) === void 0 ? or : n.converter).toAttribute(t, n.type);
				this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
			}
		}
		_$AK(e, t) {
			let n = this.constructor, r = n._$Eh.get(e);
			if (r !== void 0 && this._$Em !== r) {
				var i, a;
				let e = n.getPropertyOptions(r), o = typeof e.converter == "function" ? { fromAttribute: e.converter } : ((i = e.converter) == null ? void 0 : i.fromAttribute) === void 0 ? or : e.converter;
				this._$Em = r;
				let s = o.fromAttribute(t, e.type);
				this[r] = s ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? s, this._$Em = null;
			}
		}
		requestUpdate(e, t, n, r = !1, i) {
			if (e !== void 0) {
				var a;
				let o = this.constructor;
				if (!1 === r && (i = this[e]), n ?? (n = o.getPropertyOptions(e)), !((n.hasChanged ?? sr)(i, t) || n.useDefault && n.reflect && i === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(o._$Eu(e, n)))) return;
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
	}, z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[ar("elementProperties")] = /* @__PURE__ */ new Map(), z[ar("finalized")] = /* @__PURE__ */ new Map(), ir == null || ir({ ReactiveElement: z }), (R.reactiveElementVersions ?? (R.reactiveElementVersions = [])).push("2.1.2");
}));
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/lit-html.js
function ur(e, t) {
	if (!xr(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return hr === void 0 ? t : hr.createHTML(t);
}
function dr(e, t, n = e, r) {
	var i, a;
	if (t === W) return t;
	let o = r === void 0 ? n._$Cl : (i = n._$Co) == null ? void 0 : i[r], s = br(t) ? void 0 : t._$litDirective$;
	return (o == null ? void 0 : o.constructor) !== s && (o == null || (a = o._$AO) == null || a.call(o, !1), s === void 0 ? o = void 0 : (o = new s(e), o._$AT(e, n, r)), r === void 0 ? n._$Cl = o : (n._$Co ?? (n._$Co = []))[r] = o), o !== void 0 && (t = dr(e, o._$AS(e, t.values), o, r)), t;
}
var fr, pr, mr, hr, gr, B, _r, vr, V, yr, br, xr, Sr, Cr, wr, Tr, Er, H, Dr, Or, kr, Ar, U, W, G, jr, K, Mr, Nr, Pr, Fr, Ir, Lr, Rr, zr, Br, Vr, Hr, Ur, Wr = t((() => {
	fr = globalThis, pr = (e) => e, mr = fr.trustedTypes, hr = mr ? mr.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, gr = "$lit$", B = `lit$${Math.random().toFixed(9).slice(2)}$`, _r = "?" + B, vr = `<${_r}>`, V = document, yr = () => V.createComment(""), br = (e) => e === null || typeof e != "object" && typeof e != "function", xr = Array.isArray, Sr = (e) => xr(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Cr = "[ 	\n\f\r]", wr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Tr = /-->/g, Er = />/g, H = RegExp(`>|${Cr}(?:([^\\s"'>=/]+)(${Cr}*=${Cr}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Dr = /'/g, Or = /"/g, kr = /^(?:script|style|textarea|title)$/i, Ar = (e) => (t, ...n) => ({
		_$litType$: e,
		strings: t,
		values: n
	}), U = Ar(1), Ar(2), Ar(3), W = Symbol.for("lit-noChange"), G = Symbol.for("lit-nothing"), jr = /* @__PURE__ */ new WeakMap(), K = V.createTreeWalker(V, 129), Mr = (e, t) => {
		let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = wr;
		for (let t = 0; t < n; t++) {
			let n = e[t], s, c, l = -1, u = 0;
			for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === wr ? c[1] === "!--" ? o = Tr : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = H) : (kr.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = H) : o = Er : o === H ? c[0] === ">" ? (o = i ?? wr, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? H : c[3] === "\"" ? Or : Dr) : o === Or || o === Dr ? o = H : o === Tr || o === Er ? o = wr : (o = H, i = void 0);
			let d = o === H && e[t + 1].startsWith("/>") ? " " : "";
			a += o === wr ? n + vr : l >= 0 ? (r.push(s), n.slice(0, l) + gr + n.slice(l) + B + d) : n + B + (l === -2 ? t : d);
		}
		return [ur(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
	}, Nr = class e {
		constructor({ strings: t, _$litType$: n }, r) {
			let i;
			this.parts = [];
			let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Mr(t, n);
			if (this.el = e.createElement(l, r), K.currentNode = this.el.content, n === 2 || n === 3) {
				let e = this.el.content.firstChild;
				e.replaceWith(...e.childNodes);
			}
			for (; (i = K.nextNode()) !== null && c.length < s;) {
				if (i.nodeType === 1) {
					if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(gr)) {
						let t = u[o++], n = i.getAttribute(e).split(B), r = /([.?@])?(.*)/.exec(t);
						c.push({
							type: 1,
							index: a,
							name: r[2],
							strings: n,
							ctor: r[1] === "." ? Lr : r[1] === "?" ? Rr : r[1] === "@" ? zr : Ir
						}), i.removeAttribute(e);
					} else e.startsWith(B) && (c.push({
						type: 6,
						index: a
					}), i.removeAttribute(e));
					if (kr.test(i.tagName)) {
						let e = i.textContent.split(B), t = e.length - 1;
						if (t > 0) {
							i.textContent = mr ? mr.emptyScript : "";
							for (let n = 0; n < t; n++) i.append(e[n], yr()), K.nextNode(), c.push({
								type: 2,
								index: ++a
							});
							i.append(e[t], yr());
						}
					}
				} else if (i.nodeType === 8) {
					if (i.data === _r) c.push({
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
	}, Pr = class {
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
					s.type === 2 ? t = new Fr(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Br(i, this, e)), this._$AV.push(t), s = n[++o];
				}
				a !== (s == null ? void 0 : s.index) && (i = K.nextNode(), a++);
			}
			return K.currentNode = V, r;
		}
		p(e) {
			let t = 0;
			for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
		}
	}, Fr = class e {
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
			e = dr(this, e, t), br(e) ? e === G || e == null || e === "" ? (this._$AH !== G && this._$AR(), this._$AH = G) : e !== this._$AH && e !== W && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Sr(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
		}
		O(e) {
			return this._$AA.parentNode.insertBefore(e, this._$AB);
		}
		T(e) {
			this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
		}
		_(e) {
			this._$AH !== G && br(this._$AH) ? this._$AA.nextSibling.data = e : this.T(V.createTextNode(e)), this._$AH = e;
		}
		$(e) {
			var t;
			let { values: n, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = Nr.createElement(ur(r.h, r.h[0]), this.options)), r);
			if (((t = this._$AH) == null ? void 0 : t._$AD) === i) this._$AH.p(n);
			else {
				let e = new Pr(i, this), t = e.u(this.options);
				e.p(n), this.T(t), this._$AH = e;
			}
		}
		_$AC(e) {
			let t = jr.get(e.strings);
			return t === void 0 && jr.set(e.strings, t = new Nr(e)), t;
		}
		k(t) {
			xr(this._$AH) || (this._$AH = [], this._$AR());
			let n = this._$AH, r, i = 0;
			for (let a of t) i === n.length ? n.push(r = new e(this.O(yr()), this.O(yr()), this, this.options)) : r = n[i], r._$AI(a), i++;
			i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
		}
		_$AR(e = this._$AA.nextSibling, t) {
			var n;
			for ((n = this._$AP) == null || n.call(this, !1, !0, t); e !== this._$AB;) {
				let t = pr(e).nextSibling;
				pr(e).remove(), e = t;
			}
		}
		setConnected(e) {
			var t;
			this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
		}
	}, Ir = class {
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
			if (i === void 0) e = dr(this, e, t, 0), a = !br(e) || e !== this._$AH && e !== W, a && (this._$AH = e);
			else {
				let r = e, o, s;
				for (e = i[0], o = 0; o < i.length - 1; o++) s = dr(this, r[n + o], t, o), s === W && (s = this._$AH[o]), a || (a = !br(s) || s !== this._$AH[o]), s === G ? e = G : e !== G && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
			}
			a && !r && this.j(e);
		}
		j(e) {
			e === G ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
		}
	}, Lr = class extends Ir {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(e) {
			this.element[this.name] = e === G ? void 0 : e;
		}
	}, Rr = class extends Ir {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(e) {
			this.element.toggleAttribute(this.name, !!e && e !== G);
		}
	}, zr = class extends Ir {
		constructor(e, t, n, r, i) {
			super(e, t, n, r, i), this.type = 5;
		}
		_$AI(e, t = this) {
			if ((e = dr(this, e, t, 0) ?? G) === W) return;
			let n = this._$AH, r = e === G && n !== G || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== G && (n === G || r);
			r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
		}
		handleEvent(e) {
			var t;
			typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
		}
	}, Br = class {
		constructor(e, t, n) {
			this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(e) {
			dr(this, e);
		}
	}, Vr = {
		M: gr,
		P: B,
		A: _r,
		C: 1,
		L: Mr,
		R: Pr,
		D: Sr,
		V: dr,
		I: Fr,
		H: Ir,
		N: Rr,
		U: zr,
		B: Lr,
		F: Br
	}, Hr = fr.litHtmlPolyfillSupport, Hr == null || Hr(Nr, Fr), (fr.litHtmlVersions ?? (fr.litHtmlVersions = [])).push("3.3.3"), Ur = (e, t, n) => {
		let r = (n == null ? void 0 : n.renderBefore) ?? t, i = r._$litPart$;
		if (i === void 0) {
			let e = (n == null ? void 0 : n.renderBefore) ?? null;
			r._$litPart$ = i = new Fr(t.insertBefore(yr(), e), e, void 0, n ?? {});
		}
		return i._$AI(e), i;
	};
})), Gr, Kr, q, qr, Jr = t((() => {
	lr(), lr(), Wr(), Wr(), Kr = globalThis, q = class extends z {
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
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ur(t, this.renderRoot, this.renderOptions);
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
	}, q._$litElement$ = !0, q.finalized = !0, (Gr = Kr.litElementHydrateSupport) == null || Gr.call(Kr, { LitElement: q }), qr = Kr.litElementPolyfillSupport, qr == null || qr({ LitElement: q }), (Kr.litElementVersions ?? (Kr.litElementVersions = [])).push("4.2.2");
})), Yr = t((() => {})), Xr = t((() => {
	lr(), Wr(), Jr(), Yr();
}));
zn(), Xr(), F();
var Zr = new Intl.DateTimeFormat("es-ES", {
	hour: "2-digit",
	minute: "2-digit",
	timeZone: ie
});
function Qr(e) {
	return Zr.format(new Date(e));
}
function $r(e, t) {
	if (e.cancelled) return {
		value: "Cancelado",
		unit: "",
		spoken: "cancelado"
	};
	let n = ne(e.expected, t);
	if (n === 0) return {
		value: "Llegando",
		unit: "",
		spoken: "llegando"
	};
	if (n >= 60) {
		let t = Qr(e.expected);
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
function ei(e) {
	let t = Math.max(0, Math.round(e / 1e3));
	return t < 60 ? `hace ${t} s` : `hace ${Math.round(t / 60)} min`;
}
function ti(e) {
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
var ni = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ri = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), ii = class {
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
Wr();
var { I: ai } = Vr, oi = (e) => e, si = () => document.createComment(""), ci = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new ai(r.insertBefore(si(), i), r.insertBefore(si(), i), e, e.options);
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
				let t = oi(e).nextSibling;
				oi(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, li = (e, t, n = e) => (e._$AI(t, n), e), ui = {}, di = (e, t = ui) => e._$AH = t, fi = (e) => e._$AH, pi = (e) => {
	e._$AR(), e._$AA.remove();
};
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directives/repeat.js
Wr();
var mi = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, hi = ri(class extends ii {
	constructor(e) {
		if (super(e), e.type !== ni.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = fi(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ?? (this.ut = []), c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = li(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = li(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = li(i[d], a[m]), ci(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = li(i[f], a[p]), ci(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = mi(o, p, m), u = mi(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = ci(e, i[d]);
					li(t, a[p]), c[p] = t;
				} else c[p] = li(n, a[p]), ci(e, i[d], n), i[t] = null;
				p++;
			} else pi(i[f]), f--;
		} else pi(i[d]), d++;
		for (; p <= m;) {
			let t = ci(e, c[m + 1]);
			li(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && pi(e);
		}
		return this.ut = o, di(e, c), W;
	}
});
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directives/style-map.js
Wr();
var gi = "important", _i = " !" + gi, vi = ri(class extends ii {
	constructor(e) {
		var t;
		if (super(e), e.type !== ni.ATTRIBUTE || e.name !== "style" || ((t = e.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(_i);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? gi : "") : n[e] = r;
			}
		}
		return W;
	}
});
F(), A(), y();
var yi, bi = "sentido desconocido", xi = "¡Ya llega!", J = /* @__PURE__ */ new WeakSet(), Si = class extends q {
	constructor() {
		super(), k(this, J), this.card = void 0, this.now = Date.now(), this.variant = "fill", this.fit = !1, this.intensity = "normal", this.effect = "pulso", this.still = !1, this.alertMinutes = 0, this.openable = !1, this.service = null;
	}
	get alerting() {
		return v(J, this, Ti).call(this) !== void 0;
	}
	willUpdate() {
		this.toggleAttribute("alert", this.alerting);
	}
	render() {
		let e = this.card;
		if (!e) return G;
		let [t, ...n] = e.arrivals, r = e.headsign ? null : (t == null ? void 0 : t.headsign) ?? bi;
		return U`
      <article
        style=${vi({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        aria-label=${v(J, this, Oi).call(this, e, e.arrivals)}
        role=${this.openable ? "button" : G}
        tabindex=${this.openable ? 0 : G}
        @click=${v(J, this, Ci)}
        @keydown=${v(J, this, wi)}
      >
        <header>
          <span class="badge" aria-hidden="true">${e.line_label}</span>
          <div class="route">
            <span class="towards">${e.headsign ? `→ ${e.headsign}` : e.line_name}</span>
            <span class="stop">${e.stop_name}</span>
          </div>
        </header>
        ${t ? U`<div class="next">
                ${v(J, this, Di).call(this, t, !0)}
                ${r ? U`<span class="headsign">→ ${r}</span>` : G}
                ${v(J, this, Ei).call(this, t)}
              </div>` : U`<div class="empty">${ti(this.service)}</div>`}
        <ul aria-hidden="true">
          ${n.map((e) => U`<li>${v(J, this, Di).call(this, e, !1)}${v(J, this, Ei).call(this, e)}</li>`)}
        </ul>
      </article>
    `;
	}
};
yi = Si;
function Ci() {
	this.openable && this.card && this.dispatchEvent(new CustomEvent("card-open", {
		detail: this.card,
		bubbles: !0,
		composed: !0
	}));
}
function wi(e) {
	(e.key === "Enter" || e.key === " ") && (e.preventDefault(), v(J, this, Ci).call(this));
}
function Ti() {
	var e;
	let t = (e = this.card) == null ? void 0 : e.arrivals.find((e) => !e.cancelled);
	return this.alertMinutes > 0 && this.effect !== "ninguno" && t !== void 0 && ne(t.expected, this.now) <= this.alertMinutes ? t : void 0;
}
function Ei(e) {
	return this.effect === "etiqueta" && e === v(J, this, Ti).call(this) ? U`<span class="soon" aria-hidden="true">${xi}</span>` : G;
}
function Di(e, t) {
	let n = $r(e, this.now), r = [
		t ? "value" : "",
		t && !n.unit ? "word" : "",
		e.is_realtime ? "" : "scheduled",
		e.cancelled ? "cancelled" : ""
	].filter(Boolean).join(" ");
	return U`<span class=${r}>${n.value}</span>${n.unit ? U`<span class=${t ? "unit" : ""}>${t ? n.unit : ` ${n.unit}`}</span>` : G}${e.is_realtime ? G : U`<span class="mark" title="Horario programado, sin seguimiento en tiempo real">
              · prog.</span
            >`}`;
}
function Oi(e, t) {
	let n = e.headsign ? `hacia ${e.headsign}` : "", r = t.map((e) => $r(e, this.now).spoken).join(", "), i = this.alerting ? ". ¡Llega pronto!" : "";
	return `Línea ${e.line_label} ${n}, parada ${e.stop_name}: ${r || ti(this.service).toLowerCase()}${i}`;
}
yi.properties = {
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
}, yi.styles = L`
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
  `, customElements.get("lb-card") || customElements.define("lb-card", Si), F(), Xr(), A(), _(), C(), x(), y();
var ki, Ai = 1.05, ji = 1.7;
function Mi(e) {
	var t;
	return e.direction ? `${e.line_id}:${e.direction}` : ((t = e.arrivals.find((e) => e.pattern_id)) == null ? void 0 : t.pattern_id) ?? null;
}
function Ni(e) {
	return Mi(e) !== null;
}
function Y(e) {
	return `${e.stop_id}|${e.line_id}|${e.direction ?? "x"}`;
}
function Pi(e, t, n) {
	if (e <= 1 || t <= 0 || n <= 0) return 1;
	let r = 1, i = Infinity;
	for (let a = 1; a <= e; a += 1) {
		let o = Math.ceil(e / a), s = t / a / (n / o), c = a * o - e, l = Math.abs(Math.log(s / ji)) + c * .15;
		l < i && (r = a, i = l);
	}
	return r;
}
function Fi(e) {
	return getComputedStyle(e).getPropertyValue("--lb-card-style").trim() === "strip" ? "strip" : "fill";
}
function Ii(e) {
	return getComputedStyle(e).getPropertyValue("--lb-motion").trim() !== "none";
}
var Li = /* @__PURE__ */ new WeakMap(), Ri = /* @__PURE__ */ new WeakMap(), zi = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakSet(), Bi = class extends q {
	constructor() {
		super(), k(this, X), g(this, Li, /* @__PURE__ */ new Map()), g(this, Ri, ""), g(this, zi, typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(([e]) => {
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
		super.connectedCallback(), (e = S(zi, this)) == null || e.observe(this);
	}
	disconnectedCallback() {
		var e;
		super.disconnectedCallback(), (e = S(zi, this)) == null || e.disconnect();
	}
	willUpdate() {
		b(Li, this, v(X, this, Hi).call(this));
	}
	updated() {
		let e = v(X, this, Vi).call(this).map((e) => e.dataset.key ?? "").join(","), t = S(Ri, this) !== "" && e !== S(Ri, this);
		b(Ri, this, e), t && v(X, this, Wi).call(this);
	}
	render() {
		let e = Fi(this), t = !Ii(this), n = this.layout === "kiosk" ? `--lb-columns: ${Pi(this.cards.length, this.size.width, this.size.height)}` : "";
		return U`<div class="grid" part="grid" style=${n}>
      ${hi(De(this.cards, this.order), Y, (n) => U`<lb-card
            data-key=${Y(n)}
            .card=${n}
            .now=${this.now}
            variant=${e}
            intensity=${this.colour}
            effect=${this.effect}
            ?still=${t}
            alert-minutes=${this.alertMinutes}
            ?fit=${this.layout === "kiosk"}
            ?openable=${this.openable && Ni(n)}
            .service=${this.services.get(Y(n)) ?? null}
          ></lb-card>`)}
    </div>`;
	}
};
ki = Bi;
function Vi() {
	return [...this.renderRoot.querySelectorAll("lb-card[data-key]")];
}
function Hi() {
	return new Map(v(X, this, Vi).call(this).map((e) => [e.dataset.key ?? "", e.getBoundingClientRect()]));
}
function Ui() {
	return !matchMedia("(prefers-reduced-motion: reduce)").matches && Ii(this);
}
function Wi() {
	let e = S(Li, this);
	if (e.size !== 0 && v(X, this, Ui).call(this)) for (let t of v(X, this, Vi).call(this)) {
		let n = e.get(t.dataset.key ?? "");
		if (!n || typeof t.animate != "function") continue;
		let r = t.getBoundingClientRect(), i = n.left - r.left, a = n.top - r.top;
		if (Math.abs(i) < 1 && Math.abs(a) < 1) continue;
		let o = a > 1 || Math.abs(a) <= 1 && i > 1, s = `translate(${i}px, ${a}px)`, c = `translate(${i / 2}px, ${a / 2}px) scale(${o ? Ai : 1})`;
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
ki.properties = {
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
}, ki.styles = L`
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
  `, customElements.get("lb-card-grid") || customElements.define("lb-card-grid", Bi), F(), Xr(), _(), C(), x();
var Gi, Ki = /* @__PURE__ */ new WeakMap(), qi = class extends q {
	constructor() {
		super(), g(this, Ki, null), this.timetable = null, this.now = Date.now(), this.stopName = "";
	}
	updated() {
		let e = this.renderRoot.querySelector("li.next"), t = this.timetable ? `${this.timetable.pattern_id}|${(e == null ? void 0 : e.textContent) ?? ""}` : null;
		e && t !== S(Ki, this) && (b(Ki, this, t), e.scrollIntoView({ block: "nearest" }));
	}
	render() {
		let e = this.timetable;
		if (!e || e.departures.length === 0) return U`<p class="status">Hoy no hay servicio en este sentido.</p>`;
		let t = Ft(e, this.now), n = t.next_departure, r = !1;
		return U`
      <p class="status">
        ${t.state === "en_servicio" && t.next_departure ? `Próxima salida ${t.next_departure}${t.interval_min === null ? "" : ` · ${Mt(t.interval_min, t.interval_max_min)}`}` : ti(t)}
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
}, Gi.styles = L`
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
  `, customElements.get("lb-timetable") || customElements.define("lb-timetable", qi), A(), _(), x(), C(), y();
var Ji = .2, Yi = /* @__PURE__ */ new WeakMap(), Xi = /* @__PURE__ */ new WeakMap(), Zi = /* @__PURE__ */ new WeakMap(), Qi = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), ea = /* @__PURE__ */ new WeakMap(), ta = /* @__PURE__ */ new WeakMap(), na = /* @__PURE__ */ new WeakMap(), ra = /* @__PURE__ */ new WeakMap(), ia = /* @__PURE__ */ new WeakMap(), aa = /* @__PURE__ */ new WeakMap(), oa = /* @__PURE__ */ new WeakSet(), sa = class {
	constructor(e, t = {}) {
		k(this, oa), g(this, Yi, void 0), g(this, Xi, void 0), g(this, Zi, void 0), g(this, Qi, void 0), g(this, $i, void 0), g(this, ea, void 0), g(this, ta, void 0), g(this, na, void 0), g(this, ra, 0), g(this, ia, !1), g(this, aa, !1), b(Yi, this, e), b(Xi, this, t.intervalMs ?? 3e4), b(Zi, this, t.maxBackoffMs ?? 3e5), b(Qi, this, t.random ?? Math.random), b($i, this, t.setTimer ?? ((e, t) => setTimeout(e, t))), b(ea, this, t.clearTimer ?? ((e) => clearTimeout(e)));
	}
	get failures() {
		return S(ra, this);
	}
	nextDelayMs() {
		if (S(ra, this) === 0) return S(Xi, this);
		let e = Math.min(S(Zi, this), S(Xi, this) * 2 ** S(ra, this)), t = e * Ji * (S(Qi, this).call(this) * 2 - 1);
		return Math.round(Math.min(S(Zi, this), e + t));
	}
	start() {
		S(ia, this) || (b(ia, this, !0), S(aa, this) || this.runNow());
	}
	stop() {
		var e;
		b(ia, this, !1), v(oa, this, ca).call(this), (e = S(na, this)) == null || e.abort();
	}
	setPaused(e) {
		e !== S(aa, this) && (b(aa, this, e), e ? v(oa, this, ca).call(this) : S(ia, this) && this.runNow());
	}
	async runNow() {
		var e;
		v(oa, this, ca).call(this), (e = S(na, this)) == null || e.abort();
		let t = new AbortController();
		b(na, this, t);
		try {
			await S(Yi, this).call(this, t.signal), b(ra, this, 0);
		} catch {
			if (t.signal.aborted) return;
			b(ra, this, S(ra, this) + 1);
		}
		S(ia, this) && !S(aa, this) && S(na, this) === t && b(ta, this, S($i, this).call(this, () => void this.runNow(), this.nextDelayMs()));
	}
};
function ca() {
	S(ta, this) !== void 0 && S(ea, this).call(this, S(ta, this)), b(ta, this, void 0);
}
F(), Xr(), A(), _(), y(), C(), x();
var la, ua = 15e3, da = 9e5, fa = {
	vertical: 2.4,
	horizontal: 4.6
}, pa = {
	vertical: 7,
	horizontal: 9
}, ma = .8;
function ha(e, t, n) {
	if (e <= 0 || n <= 0) return 12;
	let r = e - pa[t] * n, i = Math.floor(r / (fa[t] * n));
	return Math.min(12, Math.max(1, i));
}
function ga(e, t = ma) {
	let n = /* @__PURE__ */ new Set();
	return e.stops.forEach((r, i) => {
		e.buses.some((e) => Math.abs(e.at - i) < t) && n.add(i);
	}), n;
}
function _a(e) {
	return `${e.hiddenStops === 1 ? "1 parada" : `${e.hiddenStops} paradas`} antes, desde ${e.origin}`;
}
function va(e) {
	return e.minutes === null ? "" : e.minutes === 0 ? "llegando" : `${e.minutes} min`;
}
function ya(e, t) {
	let n = e.arrivals.find((e) => !e.cancelled);
	if (!n) return e.stop_name;
	let r = n.is_realtime ? "" : " (horario programado)";
	return `${e.stop_name} · próximo ${$r(n, t).spoken}${r}`;
}
function ba(e, t) {
	let n = Date.parse(e.generated_at);
	return {
		...e,
		vehicles: e.vehicles.filter((e) => Math.max(0, n - Date.parse(e.recorded_at)) + t <= Zt)
	};
}
var xa = /* @__PURE__ */ new WeakMap(), Sa = /* @__PURE__ */ new WeakMap(), Ca = /* @__PURE__ */ new WeakMap(), wa = /* @__PURE__ */ new WeakMap(), Ta = /* @__PURE__ */ new WeakMap(), Ea = /* @__PURE__ */ new WeakMap(), Da = /* @__PURE__ */ new WeakMap(), Oa = /* @__PURE__ */ new WeakMap(), ka = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakSet(), Aa = class extends q {
	constructor() {
		super(), k(this, Z), g(this, xa, void 0), g(this, Sa, 0), g(this, Ca, !1), g(this, wa, new sa((e) => v(Z, this, Pa).call(this, e), { intervalMs: ua })), g(this, Ta, void 0), g(this, Ea, void 0), g(this, Da, typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(([e]) => {
			if (!e) return;
			let { width: t, height: n } = e.contentRect;
			this.orientation = t > n * 1.1 ? "horizontal" : "vertical";
			let r = this.renderRoot.querySelector(".body") ?? this, i = Number.parseFloat(getComputedStyle(r).fontSize);
			this.room = ha(this.orientation === "horizontal" ? t : n * .7, this.orientation, i);
		})), g(this, Oa, (e) => {
			e.key === "Escape" && this.close();
		}), g(this, ka, () => v(Z, this, ja).call(this)), this.card = void 0, this.source = void 0, this.arrivals = null, this.previousStops = 4, this.route = null, this.vehicles = void 0, this.problem = void 0, this.timetableProblem = void 0, this.now = Date.now(), this.orientation = "vertical", this.room = 12, this.screen = "recorrido", this.timetable = void 0;
	}
	willUpdate() {
		let e = this.patternId;
		if (!S(xa, this) || !this.vehicles || !this.card || !e) return;
		let t = ba(this.vehicles, this.now - S(Sa, this)), n = (t) => t.vehicles.filter((t) => t.pattern_id === e).length;
		b(Ca, this, n(t) < n(this.vehicles)), this.route = We(S(xa, this), e, this.card.stop_id, t, this.arrivals, {
			previousStops: Math.min(this.previousStops, this.room),
			now: new Date(this.now).toISOString(),
			previous: this.route
		});
	}
	connectedCallback() {
		var e;
		super.connectedCallback(), this.card && !this.card.arrivals.some((e) => !e.cancelled) && this.show("horario"), v(Z, this, ja).call(this), S(wa, this).start(), (e = S(Da, this)) == null || e.observe(this), b(Ea, this, setInterval(() => this.now = Date.now(), 1e3)), document.addEventListener("keydown", S(Oa, this)), document.addEventListener("visibilitychange", S(ka, this)), v(Z, this, Na).call(this);
	}
	disconnectedCallback() {
		var e;
		super.disconnectedCallback(), S(wa, this).stop(), (e = S(Da, this)) == null || e.disconnect(), clearInterval(S(Ea, this)), clearTimeout(S(Ta, this)), document.removeEventListener("keydown", S(Oa, this)), document.removeEventListener("visibilitychange", S(ka, this));
	}
	show(e) {
		this.screen = e, v(Z, this, ja).call(this), e === "horario" && !this.timetable && v(Z, this, Ma).call(this), v(Z, this, Na).call(this);
	}
	close() {
		this.dispatchEvent(new CustomEvent("route-close", {
			bubbles: !0,
			composed: !0
		}));
	}
	get patternId() {
		return this.card ? Mi(this.card) : null;
	}
	render() {
		let e = this.card;
		if (!e) return G;
		let t = this.route, n = this.vehicles ? this.now - S(Sa, this) : 0, r = t && t.buses.length === 0 && t.earlierBuses.length === 0, i = r && !S(Ca, this) && !this.problem && n <= 18e4, a = t && n <= 18e4 && !(r && S(Ca, this)) ? t : null;
		return U`
      <header
        style=${vi({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        @click=${() => v(Z, this, Na).call(this)}
      >
        <span class="badge">${e.line_label}</span>
        <div class="title">
          <strong>→ ${(t == null ? void 0 : t.headsign) ?? e.headsign ?? e.line_name}</strong>
          <span>${ya(e, this.now)}</span>
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
        style=${vi({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        @click=${() => v(Z, this, Na).call(this)}
      >
        ${this.screen === "horario" ? this.timetableProblem ? U`<p class="note" role="alert">${this.timetableProblem}</p>` : v(Z, this, La).call(this, e) : this.problem && a ? v(Z, this, Ia).call(this, a) : this.problem ? U`<p class="note" role="alert">${this.problem}</p>` : t ? v(Z, this, Ia).call(this, t) : U`<p class="note" role="status">Buscando los autobuses…</p>`}
      </div>
      <footer ?hidden=${this.screen === "horario"}>
        <span>
          ${[t && t.hiddenStops > 0 ? `${this.orientation === "horizontal" ? "←" : "↓"} ${_a(t)}` : "", i ? "Ningún autobús en camino ahora mismo." : ""].filter(Boolean).join(" · ")}
        </span>
        <span>${this.vehicles ? `Posiciones ${ei(n)}` : ""}</span>
        ${this.problem && a ? U`<span class="problem" role="alert">${this.problem}</span>` : G}
      </footer>
    `;
	}
};
la = Aa;
function ja() {
	S(wa, this).setPaused(this.screen === "horario" || document.hidden);
}
async function Ma() {
	let e = this.card, t = this.source;
	if (e && t) try {
		this.timetable = await t.timetable(e.line_id), this.timetableProblem = void 0;
	} catch {
		this.timetableProblem = "No se puede obtener ahora el horario de la línea.";
	}
}
function Na() {
	clearTimeout(S(Ta, this)), b(Ta, this, setTimeout(() => this.close(), da));
}
async function Pa(e) {
	let t = this.card, n = this.source, r = this.patternId;
	if (t && n && r) try {
		let [r, i] = await Promise.all([n.catalog(), n.vehicles(t.line_id, e)]);
		b(xa, this, r), b(Sa, this, Date.now()), this.vehicles = i, this.problem = void 0;
	} catch (t) {
		throw e.aborted || (this.problem = "No se pueden obtener ahora las posiciones de los autobuses."), t;
	}
}
function Fa(e, t) {
	let n = t > 0 ? e / t : 1;
	return this.orientation === "horizontal" ? { left: `${n * 100}%` } : { top: `${(1 - n) * 100}%` };
}
function Ia(e) {
	let t = e.stops.length - 1, n = ga(e), [r, ...i] = e.earlierBuses, a = t % 2 == 1;
	return U`<div class="track" role="img" aria-label=${v(Z, this, Ra).call(this, e)}>
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
            style=${vi(v(Z, this, Fa).call(this, r, t))}
          >
            <span class="dot"></span><span class="name">${e.name}</span>
          </div>`)}
      ${hi(e.buses, (e) => e.vehicleId, (e, n) => U`<div
            class=${n === 0 ? "bus first" : "bus"}
            data-vehicle=${e.vehicleId}
            style=${vi(v(Z, this, Fa).call(this, e.at, t))}
          >
            <span class="pill">🚌 ${va(e)}</span>
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
                ${va(r)}${i.length > 0 ? ` +${i.length}` : ""}</span
              >
            </div>` : G}
    </div>`;
}
function La(e) {
	return this.timetable ? U`<lb-timetable
      .timetable=${It(this.timetable, this.patternId) ?? null}
      .now=${this.now}
      stop-name=${e.stop_name}
    ></lb-timetable>` : U`<p class="note" role="status">Buscando el horario…</p>`;
}
function Ra(e) {
	let t = e.stops.length - 1, n = e.stops.flatMap((e, n) => e.terminus ? e.position === 1 ? [`La línea empieza en ${e.name}`] : [n === t ? "La línea acaba en tu parada" : `La línea acaba en ${e.name}`] : []), r = [...e.buses, ...e.earlierBuses];
	return r.length === 0 ? [...n, "Ningún autobús de esta línea en camino ahora mismo."].join(". ") : [...n, ...r.map((e) => {
		let t = e.stopsAway === 0 ? "llegando a tu parada" : `a ${e.stopsAway + 1} paradas`;
		return e.minutes === null ? `Un autobús ${t}` : `Un autobús ${t}, ${e.minutes} minutos`;
	})].join(". ");
}
la.properties = {
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
}, la.styles = L`
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
    /* The rest of the line, off the diagram: same rail, greyed out, under the end stops. */
    .more {
      position: absolute;
      background: var(--lb-muted, currentColor);
      opacity: 0.4;
      border-radius: 999px;
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
      width: var(--rail);
    }
    :host([orientation='vertical']) .more.before {
      top: 100%;
      height: 2.9em;
    }
    :host([orientation='vertical']) .more.after {
      bottom: 100%;
      height: 2.4em;
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
      transform: translateY(-50%);
    }
    /*
     * Right-aligned beside the road, but a pill wider than the room ("llegando" in big text) grows
     * over the road instead of off the screen: an auto margin, unlike flex-end, never goes negative.
     */
    :host([orientation='vertical']) .bus .pill {
      margin-left: auto;
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
      height: var(--rail);
      transform: translateY(-50%);
    }
    :host([orientation='horizontal']) .more.before {
      right: 100%;
      width: 4.1em;
    }
    :host([orientation='horizontal']) .more.after {
      left: 100%;
      width: 3.6em;
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
    /* Floats over the grey end (on the side away from the first stop's name) so both show. */
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
  `, customElements.get("lb-route") || customElements.define("lb-route", Aa), F(), Xr(), A(), _(), C(), x(), y();
var za, Ba = 5e3, Va = /* @__PURE__ */ new WeakMap(), Ha = /* @__PURE__ */ new WeakMap(), Ua = /* @__PURE__ */ new WeakMap(), Wa = /* @__PURE__ */ new WeakMap(), Ga = /* @__PURE__ */ new WeakMap(), Ka = /* @__PURE__ */ new WeakMap(), qa = /* @__PURE__ */ new WeakSet(), Ja = class extends q {
	constructor() {
		super(), k(this, qa), g(this, Va, new sa((e) => this.refresh(e))), g(this, Ha, /* @__PURE__ */ new Map()), g(this, Ua, void 0), g(this, Wa, void 0), g(this, Ga, () => S(Va, this).setPaused(document.hidden)), g(this, Ka, /* @__PURE__ */ new Map()), this.config = void 0, this.source = void 0, this.status = "loading", this.layout = "auto", this.cards = [], this.now = Date.now(), this.updatedAt = void 0, this.error = void 0, this.opened = void 0, this.timetables = /* @__PURE__ */ new Map();
	}
	connectedCallback() {
		super.connectedCallback(), document.addEventListener("visibilitychange", S(Ga, this)), b(Ua, this, setInterval(() => {
			this.now = Date.now();
		}, Ba)), this.config && S(Va, this).start();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), document.removeEventListener("visibilitychange", S(Ga, this)), clearInterval(S(Ua, this)), S(Va, this).stop();
	}
	willUpdate(e) {
		this.config && (this.style.setProperty("--lb-text-scale", String(this.config.textScale / 100)), this.style.setProperty("font-family", Qa[this.config.font]));
		let t = e.get("config"), n = e.has("config") && $a(t) !== $a(this.config) || e.has("source");
		e.has("source") && (S(Ha, this).clear(), this.timetables = /* @__PURE__ */ new Map()), n && this.hasUpdated && this.isConnected && this.config && (b(Wa, this, void 0), S(Va, this).stop(), S(Va, this).start());
	}
	async refresh(e) {
		let t = this.config;
		if (t) try {
			this.source ?? (this.source = await fn(t, { pageProtocol: location.protocol }));
			let n = this.source;
			S(Wa, this) ?? b(Wa, this, await n.catalog());
			let r = S(Wa, this), i = [...new Set(t.stops.map((e) => e.stop_id))], a = await Promise.all(i.map((t) => n.arrivals(t, e))), o = new Map(a.map((e) => [e.stop_id, e]));
			b(Ka, this, o), this.cards = t.stops.flatMap((e) => {
				let n = o.get(e.stop_id);
				return n ? Te(r, e, n, t.perCard) : [];
			}), this.updatedAt = Math.min(...a.map((e) => Date.parse(e.generated_at))), this.now = Date.now(), this.error = void 0, this.status = "ready", v(qa, this, Ya).call(this, n, this.cards);
		} catch (t) {
			throw e != null && e.aborted ? t : (this.error = eo(t), this.cards.length === 0 && (this.status = "error"), t);
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
      ${v(qa, this, Za).call(this)}
      <lb-card-grid
        .cards=${this.cards}
        .now=${this.now}
        order=${e.order}
        colour=${e.colour}
        effect=${e.effect}
        alert-minutes=${e.alertMinutes}
        layout=${this.layout}
        .services=${v(qa, this, Xa).call(this)}
        @card-open=${(e) => this.opened = Y(e.detail)}
      ></lb-card-grid>
      <div class="status" part="status" role="status">
        <span>Actualizado ${ei(t)}</span>
        ${t > 9e4 ? U`<span class="stale">Datos sin actualizar: comprobando de nuevo</span>` : G}
        ${this.error ? U`<span class="problem">${this.error}</span>` : G}
      </div>
    `;
	}
};
za = Ja;
async function Ya(e, t) {
	let n = At(Date.now()), r = new Set(t.filter((e) => !e.arrivals.some((e) => !e.cancelled)).map((e) => e.line_id).filter((e) => S(Ha, this).get(e) !== n));
	if (r.size === 0) return;
	for (let e of r) S(Ha, this).set(e, n);
	let i = await Promise.allSettled([...r].map(async (t) => e.timetable(t)));
	if (e !== this.source) return;
	let a = new Map(this.timetables);
	for (let e of i) e.status === "fulfilled" && a.set(e.value.line_id, e.value);
	this.timetables = a;
}
function Xa() {
	let e = /* @__PURE__ */ new Map(), t = At(this.now);
	for (let n of this.cards) {
		let r = this.timetables.get(n.line_id);
		(r == null ? void 0 : r.service_date) === t && e.set(Y(n), Ft(It(r, Mi(n)), this.now));
	}
	return e;
}
function Za() {
	var e;
	let t = this.cards.find((e) => Y(e) === this.opened);
	return !t || !this.source ? G : U`<lb-route
      .card=${t}
      .source=${this.source}
      .arrivals=${S(Ka, this).get(t.stop_id) ?? null}
      .previousStops=${((e = this.config) == null ? void 0 : e.previousStops) ?? 4}
      @route-close=${() => this.opened = void 0}
    ></lb-route>`;
}
za.properties = {
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
}, za.styles = L`
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
var Qa = {
	sistema: "var(--lb-font, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif)",
	legible: "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif",
	redondeada: "ui-rounded, 'SF Pro Rounded', 'Nunito', 'Varela Round', system-ui, sans-serif",
	mono: "ui-monospace, 'SF Mono', 'DejaVu Sans Mono', Menlo, Consolas, monospace"
};
function $a(e) {
	return e ? `${Se(e.stops)}|${e.perCard}` : "";
}
function eo(e) {
	return e instanceof s ? "El servicio de autobuses del Ayuntamiento ha cambiado. Hace falta actualizar esta aplicación." : e instanceof o ? "No se puede contactar con el servicio de autobuses. Se reintentará automáticamente." : e instanceof i ? e.message : "Error inesperado al cargar las llegadas.";
}
//#endregion
//#region src/entities.ts
customElements.get("logrono-bus-board") || customElements.define("logrono-bus-board", Ja), F();
var Q = (e) => typeof e == "string" ? e : null, to = (e) => typeof e == "number" ? e : null;
function no(e) {
	return e === "asc" || e === "desc" ? e : null;
}
function ro(e) {
	return Array.isArray(e) ? e.filter((e) => typeof e == "object" && !!e && typeof e.hora == "string" && typeof e.tiempo_real == "boolean") : [];
}
function io(e) {
	return e !== void 0 && Q(e.attributes.linea_id) !== null;
}
function ao(e) {
	if (!io(e)) return null;
	let t = e.attributes, n = Q(t.parada_id) ?? "", r = Q(t.linea_id) ?? "", i = no(t.sentido), a = Q(t.destino), o = i ? `${r}:${i}` : null, s = ro(t.llegadas).map((e) => ({
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
function oo(e, t) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of t) {
		let t = ao(e.states[i]);
		if (!t) continue;
		let a = Y(t);
		n.has(a) || (n.add(a), r.push(t));
	}
	return r;
}
function so(e) {
	return Object.values(e.states).filter((e) => io(e)).filter((e) => e.attributes.unit_of_measurement === "min").map((e) => e.entity_id).sort();
}
function co(e) {
	if (!io(e)) return null;
	let t = e.attributes, n = t.servicio;
	return Lt.includes(n) ? {
		state: n,
		first: Q(t.primera_salida),
		last: Q(t.ultima_salida),
		next_departure: Q(t.proxima_salida),
		interval_min: to(t.frecuencia_min),
		interval_max_min: to(t.frecuencia_max_min)
	} : null;
}
function lo(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) {
		let t = e.states[r], i = ao(t), a = co(t);
		i && a && n.set(Y(i), a);
	}
	return n;
}
//#endregion
//#region src/ha.ts
function uo(e, t) {
	e.dispatchEvent(new CustomEvent("config-changed", {
		detail: { config: t },
		bubbles: !0,
		composed: !0
	}));
}
var fo = t((() => {})), po = /* @__PURE__ */ n({
	EDITOR_LABELS: () => _o,
	EDITOR_SCHEMA: () => go,
	LogronoBusCardEditor: () => yo
});
function mo(e) {
	e.stopPropagation();
	let t = {
		...e.detail.value,
		type: `custom:${I}`
	};
	try {
		Fn(t);
	} catch {}
	this.config = t, uo(this, t);
}
var ho, $, go, _o, vo, yo, bo, xo = t((() => {
	F(), Xr(), fo(), A(), y(), $ = (e, t) => ({
		value: e,
		label: t
	}), go = [
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
	], _o = {
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
	}, vo = /* @__PURE__ */ new WeakSet(), yo = class extends q {
		constructor() {
			super(), k(this, vo), this.hass = void 0, this.config = void 0;
		}
		setConfig(e) {
			this.config = e;
		}
		get formData() {
			return {
				orden: w.order,
				aviso: w.alertMinutes,
				efecto: w.effect,
				color: w.colour,
				letra: w.font,
				tam: w.textScale,
				modo: "normal",
				recorrido: !0,
				previas: w.previousStops,
				...this.config
			};
		}
		render() {
			return !this.hass || !this.config ? G : U`<ha-form
      .hass=${this.hass}
      .data=${this.formData}
      .schema=${go}
      .computeLabel=${(e) => _o[e.name] ?? e.name}
      @value-changed=${v(vo, this, mo)}
    ></ha-form>`;
		}
	}, ho = yo, ho.properties = {
		hass: { attribute: !1 },
		config: { state: !0 }
	}, bo = `${I}-editor`, customElements.get(bo) || customElements.define(bo, yo);
}));
F(), Xr(), zn(), A(), _(), x(), C(), y();
var So, Co = 5e3, wo = 3, To = /* @__PURE__ */ new WeakMap(), Eo = /* @__PURE__ */ new WeakMap(), Do = /* @__PURE__ */ new WeakMap(), Oo = /* @__PURE__ */ new WeakMap(), ko = /* @__PURE__ */ new WeakSet(), Ao = class extends q {
	constructor() {
		super(), k(this, ko), g(this, To, void 0), g(this, Eo, void 0), g(this, Do, []), g(this, Oo, /* @__PURE__ */ new Map()), this.hass = void 0, this.config = void 0, this.now = Date.now(), this.opened = void 0;
	}
	setConfig(e) {
		this.config = Fn(e);
	}
	getCardSize() {
		var e;
		return Math.max(2, (((e = this.config) == null ? void 0 : e.entities.length) ?? 1) * wo);
	}
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	static async getConfigElement() {
		return await Promise.resolve().then(() => (xo(), po)), document.createElement(`${I}-editor`);
	}
	static getStubConfig(e) {
		return {
			entities: so(e).slice(0, 4),
			orden: "llegada"
		};
	}
	connectedCallback() {
		super.connectedCallback(), b(To, this, setInterval(() => this.now = Date.now(), Co));
	}
	disconnectedCallback() {
		super.disconnectedCallback(), clearInterval(S(To, this));
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
		e && (this.setAttribute("modo", e.modo), this.style.setProperty("--lb-text-scale", String(e.tam / 100)), this.style.fontFamily = e.letra === "sistema" ? "" : Qa[e.letra], this.hass && (b(Do, this, oo(this.hass, e.entities)), b(Oo, this, lo(this.hass, e.entities))));
	}
	render() {
		let e = this.config;
		if (!e) return G;
		let t = e.modo === "pantalla" ? "kiosk" : "auto";
		return U`<ha-card>
      ${e.titulo ? U`<h1>${e.titulo}</h1>` : G}
      ${S(Do, this).length === 0 ? U`<p class="empty">
              No hay datos de los sensores elegidos. Comprueba que pertenecen a la integración
              Logroño Bus.
            </p>` : U`<lb-card-grid
              .cards=${S(Do, this)}
              .services=${S(Oo, this)}
              .now=${this.now}
              order=${e.orden}
              colour=${e.color}
              effect=${e.efecto}
              alert-minutes=${e.aviso}
              layout=${t}
              .openable=${e.recorrido}
              @card-open=${(e) => this.opened = e.detail}
            ></lb-card-grid>`}
      ${v(ko, this, Mo).call(this)}
    </ha-card>`;
	}
};
So = Ao;
function jo() {
	return S(Eo, this) ?? b(Eo, this, new Tn("https://transporteurbano.logrono.es/api/", { store: new Nn(() => globalThis.localStorage) })), S(Eo, this);
}
function Mo() {
	let e = this.opened, t = this.config;
	return !e || !t ? G : U`<lb-route
      .card=${e}
      .source=${jo.call(v(ko, this))}
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
So.properties = {
	hass: { attribute: !1 },
	config: { state: !0 },
	now: { state: !0 },
	opened: { state: !0 }
}, So.styles = L`
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
  `, customElements.get("logrono-bus-card") || customElements.define(I, Ao), zn();
var No;
(No = window).customCards ?? (No.customCards = []), window.customCards.some((e) => e.type === "logrono-bus-card") || window.customCards.push({
	type: I,
	name: "Logroño Bus",
	description: "Próximos autobuses de tus paradas, con el aspecto de la web de Logroño Bus.",
	preview: !0
}), console.info(`%c LOGROÑO-BUS-CARD %c ${r} `, "color:#fff;background:#8c1c2c", "");
//#endregion
export { Ao as LogronoBusCard, ao as cardFromEntity, oo as cardsFromHass, Fn as normalizeConfig };
