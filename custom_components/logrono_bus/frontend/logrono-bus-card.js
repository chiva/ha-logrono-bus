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
			position: l + n
		};
	}), d = [];
	for (let t of r.vehicles) {
		if (t.pattern_id !== s.id || t.next_stop_id === null) continue;
		let n = pe(s, t.next_stop_id);
		n === null || n > c || d.push({
			vehicleId: t.id,
			at: n === 1 ? 1 - l : n - 1 - l + Ke(e, s, n, t),
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
function Ke(e, t, n, r) {
	let i = e.findStop(t.stop_ids[n - 2] ?? ""), a = e.findStop(t.stop_ids[n - 1] ?? "");
	if (!i || !a) return .5;
	let o = f(i.lat, i.lon, r.lat, r.lon), s = f(r.lat, r.lon, a.lat, a.lon);
	return o + s > 0 ? qe(o / (o + s), 0, 1) : 0;
}
var qe, Je = t((() => {
	be(), ee(), oe(), qe = (e, t, n) => Math.min(n, Math.max(t, e));
}));
//#endregion
//#region ../core/src/config.ts
function Ye(e) {
	let t = Math.round(e / 10) * 10;
	return Math.min(150, Math.max(80, t));
}
function Xe(e) {
	return Math.min(12, Math.max(1, Math.round(e)));
}
var Ze, Qe, $e, et, C, tt = t((() => {
	je(), Je(), Ze = [
		"suave",
		"normal",
		"intensa"
	], Qe = [
		"sistema",
		"legible",
		"redondeada",
		"mono"
	], $e = [
		"pulso",
		"borde",
		"ninguno"
	], et = [
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
function nt(e, t, n) {
	if (e.length === 1) return e[0] ?? null;
	if (n === null) return null;
	let r = e.filter((e) => pe(e, t) === n);
	return r.length === 1 ? r[0] ?? null : null;
}
var rt, it, at, ot = t((() => {
	be(), g(), b(), S(), rt = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new WeakMap(), at = class e {
		constructor(e) {
			h(this, rt, void 0), h(this, it, /* @__PURE__ */ new Map()), y(rt, this, e);
		}
		resolve(t, n, r, i) {
			let a = x(rt, this).patternsAt(n).filter((e) => e.line_id === t), o = nt.call(e, a, n, r), s = `${t}\u0000${i}`;
			if (o) return i && x(it, this).set(s, o.id), o;
			let c = i ? x(it, this).get(s) : void 0;
			return c ? a.find((e) => e.id === c) ?? null : null;
		}
	};
}));
//#endregion
//#region ../core/src/raw.ts
function w(e, t) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw new s(`se esperaba un objeto, llegó ${St(e)}`, t);
	return e;
}
function st(e, t) {
	if (!Array.isArray(e)) throw new s(`se esperaba una lista, llegó ${St(e)}`, t);
	return e;
}
function T(e, t, n) {
	if (!(t in e)) throw new s("falta el campo", `${n}.${t}`);
	return e[t];
}
function E(e, t) {
	if (typeof e != "string") throw new s(`se esperaba texto, llegó ${St(e)}`, t);
	return e.trim();
}
function ct(e, t) {
	if (typeof e != "number" || !Number.isInteger(e)) throw new s(`se esperaba un entero, llegó ${St(e)}`, t);
	return e;
}
function lt(e, t) {
	if (typeof e != "number") throw new s(`se esperaba un número, llegó ${St(e)}`, t);
	return e;
}
function ut(e, t) {
	if (typeof e != "boolean") throw new s(`se esperaba un booleano, llegó ${St(e)}`, t);
	return e;
}
function D(e, t) {
	if (typeof e == "boolean") throw new s("se esperaba un identificador, llegó un booleano", t);
	if (typeof e == "number" && Number.isInteger(e)) return String(e);
	let n = E(e, t);
	if (!n) throw new s("identificador vacío", t);
	return /^\d+$/.test(n) ? String(Number.parseInt(n, 10)) : n;
}
function dt(e, t) {
	return e == null || e === "" ? "" : D(e, t);
}
function ft(e, t) {
	let n = E(e, t), r = Ct.exec(n);
	if (!r) {
		let e = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(n);
		throw new s(e ? `fecha sin zona horaria '${n}'` : `fecha no válida '${n}'`, t);
	}
	let [, i, a, o, c = "00", l = "", u = ""] = r, d = l.padEnd(6, "0"), f = `${i}T${a}:${o}:${c}${Number(d) === 0 ? "" : `.${d}`}${u === "Z" ? "+00:00" : u.length === 3 ? `${u}:00` : u.includes(":") ? u : `${u.slice(0, 3)}:${u.slice(3)}`}`;
	if (Number.isNaN(Date.parse(f))) throw new s(`fecha no válida '${n}'`, t);
	return f;
}
function pt(e, t) {
	return st(T(w(T(w(e, "$"), "result", "$"), "$.result"), t, "$.result"), `$.result.${t}`);
}
function mt(e, t) {
	return st(e, t).map((e, n) => {
		let r = `${t}[${n}]`, i = w(e, r);
		return {
			id: D(T(i, "id", r), `${r}.id`),
			name: E(T(i, "name", r), `${r}.name`)
		};
	});
}
function ht(e) {
	return pt(e, "lines").map((e, t) => {
		let n = `$.result.lines[${t}]`, r = w(e, n), i = w(T(r, "stops", n), `${n}.stops`);
		return {
			id: D(T(r, "id", n), `${n}.id`),
			name: E(T(r, "name", n), `${n}.name`),
			colour: E(T(r, "color", n), `${n}.color`),
			asc: mt(T(i, "asc", `${n}.stops`), `${n}.stops.asc`),
			desc: mt(T(i, "desc", `${n}.stops`), `${n}.stops.desc`)
		};
	});
}
function gt(e) {
	return pt(e, "stops").map((e, t) => {
		let n = `$.result.stops[${t}]`, r = w(e, n), i = st(r.lines ?? [], `${n}.lines`);
		return {
			id: D(T(r, "id", n), `${n}.id`),
			name: E(T(r, "name", n), `${n}.name`),
			lat: lt(T(r, "lat", n), `${n}.lat`),
			lon: lt(T(r, "lng", n), `${n}.lng`),
			lineIds: i.map((e, t) => D(e, `${n}.lines[${t}]`))
		};
	});
}
function _t(e) {
	return pt(e, "arrivals").map((e, t) => {
		let n = `$.result.arrivals[${t}]`, r = w(e, n), i = r.order;
		return {
			lineId: D(T(r, "lineRef", n), `${n}.lineRef`),
			stopId: D(T(r, "stopPointRef", n), `${n}.stopPointRef`),
			directionRef: dt(r.directionRef, `${n}.directionRef`),
			vehicleRef: dt(r.vehicleRef, `${n}.vehicleRef`),
			order: i == null ? null : ct(i, `${n}.order`),
			aimed: ft(T(r, "aimedArrivalTime", n), `${n}.aimedArrivalTime`),
			expected: ft(T(r, "expectedArrivalTime", n), `${n}.expectedArrivalTime`),
			arrivalStatus: E(r.arrivalStatus ?? "", `${n}.arrivalStatus`),
			cancelled: ut(r.cancellation ?? !1, `${n}.cancellation`),
			inaccurate: ut(r.predictionInaccurate ?? !1, `${n}.predictionInaccurate`),
			delayS: ct(r.delaySeconds ?? 0, `${n}.delaySeconds`)
		};
	});
}
function vt(e) {
	return pt(e, "activities").map((e, t) => {
		let n = `$.result.activities[${t}]`, r = w(e, n);
		return {
			vehicleRef: D(T(r, "vehicleRef", n), `${n}.vehicleRef`),
			lineId: D(T(r, "lineRef", n), `${n}.lineRef`),
			directionRef: E(r.directionRef ?? "", `${n}.directionRef`),
			lat: lt(T(r, "latitude", n), `${n}.latitude`),
			lon: lt(T(r, "longitude", n), `${n}.longitude`),
			nextStopId: dt(r.nextStopRef, `${n}.nextStopRef`),
			recordedAt: ft(T(r, "locationRecordedAtTime", n), `${n}.locationRecordedAtTime`),
			delayS: ct(r.delaySeconds ?? 0, `${n}.delaySeconds`)
		};
	});
}
function yt(e, t) {
	let n = E(e, t), r = wt.exec(n), i = r ? Number(r[1]) : NaN, a = r ? Number(r[2]) : NaN;
	if (!r || i > Tt || a >= Et) throw new s(`hora no válida: '${n}'`, t);
	return `${String(i).padStart(2, "0")}:${r[2]}`;
}
function bt(e, t) {
	let n = w(e, t), r = n.intervalMinutesMax;
	return {
		first: yt(T(n, "firstPass", t), `${t}.firstPass`),
		last: yt(T(n, "lastPass", t), `${t}.lastPass`),
		intervalMin: ct(T(n, "intervalMinutes", t), `${t}.intervalMinutes`),
		intervalMaxMin: r == null ? null : ct(r, `${t}.intervalMinutesMax`)
	};
}
function xt(e) {
	let t = w(T(w(e, "$"), "result", "$"), "$.result"), n = w(T(t, "frequenciesByDirection", "$.result"), "$.result.frequenciesByDirection"), r = w(T(t, "passesByDirection", "$.result"), "$.result.passesByDirection");
	return [.../* @__PURE__ */ new Set([...Object.keys(r), ...Object.keys(n)])].map((e) => {
		let t = `$.result.passesByDirection.${e}`, i = `$.result.frequenciesByDirection.${e}`;
		return {
			name: e,
			frequencies: st(n[e] ?? [], i).map((e, t) => bt(e, `${i}[${t}]`)),
			passes: st(r[e] ?? [], t).map((e, n) => yt(e, `${t}[${n}]`))
		};
	});
}
var St, Ct, wt, Tt, Et, Dt = t((() => {
	d(), St = (e) => {
		if (e === null) return "NoneType";
		if (Array.isArray(e)) return "list";
		switch (typeof e) {
			case "string": return "str";
			case "boolean": return "bool";
			case "number": return Number.isInteger(e) ? "int" : "float";
			case "object": return "dict";
			default: return typeof e;
		}
	}, Ct = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:[.,](\d{1,6}))?)?(Z|[+-]\d{2}(?::?\d{2})?)$/, wt = /^(\d{1,2}):(\d{2})$/, Tt = 29, Et = 60;
}));
//#endregion
//#region ../core/src/timetable.ts
function Ot(e) {
	let t = new Date(typeof e == "number" ? e : Date.parse(e));
	return Object.fromEntries(Rt.formatToParts(t).map((e) => [e.type, e.value]));
}
function kt(e) {
	let t = Ot(e);
	return `${t.year}-${t.month}-${t.day}`;
}
function At(e) {
	let t = Ot(e);
	return Number(t.hour) * 60 + Number(t.minute);
}
function jt(e, t = null) {
	return t === null || t === e ? `cada ${e} min` : `cada ${e}–${t} min`;
}
function Mt(e) {
	let [t = "0", n = "0"] = e.split(":");
	return Number(t) * 60 + Number(n);
}
function Nt(e) {
	let t = [];
	for (let n of e) {
		let e = Mt(n), r = t[t.length - 1];
		for (; r !== void 0 && e < r;) e += Lt;
		t.push(e);
	}
	return t;
}
function Pt(e, t) {
	let n = (e == null ? void 0 : e.departures) ?? [], r = n[0], i = n[n.length - 1];
	if (!e || r === void 0 || i === void 0) return zt;
	let a = At(t), o = Nt(n), s = a < (o[0] ?? 0) ? "antes" : a > (o[o.length - 1] ?? 0) ? "terminado" : "en_servicio", c = o.findIndex((e) => e >= a), l = s === "en_servicio" ? e.periods.find((e) => a <= Mt(e.last)) : void 0;
	return {
		state: s,
		first: r,
		last: i,
		next_departure: c === -1 ? null : n[c] ?? null,
		interval_min: (l == null ? void 0 : l.interval_min) ?? null,
		interval_max_min: (l == null ? void 0 : l.interval_max_min) ?? null
	};
}
function Ft(e, t) {
	return t ? e == null ? void 0 : e.directions.find((e) => e.pattern_id === t) : void 0;
}
var It, Lt, Rt, zt, Bt = t((() => {
	oe(), It = [
		"antes",
		"en_servicio",
		"terminado",
		"sin_servicio"
	], Lt = 1440, Rt = new Intl.DateTimeFormat("en-GB", {
		timeZone: ae,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}), zt = {
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
function Vt(e) {
	let t = e.indexOf(Zt), n = t === -1 ? e : e.slice(0, t), r = (t === -1 ? "" : e.slice(t + 1)).split(Zt).filter((e) => e.trim()).map(ce);
	return [n.trim(), r.join(Qt)];
}
function Ht(e) {
	let [t, n] = Vt(e.name), r;
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
function Ut(e) {
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
function Wt(e, t) {
	let n = [...new Set(e.lineIds)].filter((e) => t.has(e)).sort(te);
	return {
		id: e.id,
		name: e.name,
		lat: e.lat,
		lon: e.lon,
		line_ids: n
	};
}
function Gt(e, t, n) {
	let r = e.map(Ht).sort((e, t) => te(e.label, t.label)), i = new Map(r.map((e, t) => [e.id, t])), a = e.flatMap(Ut).sort((e, t) => (i.get(e.line_id) ?? 0) - (i.get(t.line_id) ?? 0) || ie.indexOf(e.direction) - ie.indexOf(t.direction)), o = new Set(i.keys());
	return {
		lines: r,
		patterns: a,
		stops: t.map((e) => Wt(e, o)).sort((e, t) => te(e.id, t.id)),
		fetched_at: ft(n, "fetched_at")
	};
}
function Kt(e, t, n, r, i) {
	let a = ft(i, "now"), o = Date.parse(a), s = new Set(n.stop(t).line_ids), c = [];
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
function qt(e, t) {
	var n;
	let r = Xt[e.directionRef.toLowerCase()];
	if (r !== void 0 || !e.nextStopId) return r ?? null;
	let i = t.patternsAt(e.nextStopId).filter((t) => t.line_id === e.lineId);
	return i.length === 1 ? ((n = i[0]) == null ? void 0 : n.direction) ?? null : null;
}
function Jt(e, t, n, r) {
	let i = ft(r, "now"), a = Date.parse(i);
	return {
		line_id: t,
		generated_at: i,
		vehicles: e.filter((e) => e.lineId === t && Date.parse(e.recordedAt) >= a - 18e4).map((e) => {
			let r = qt(e, n), i = r ? n.pattern(`${t}:${r}`) : void 0;
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
function Yt(e, t, n, r) {
	let i = ft(r, "now"), a = [];
	for (let r of e) {
		let e = Xt[r.name.toLowerCase()], i = e ? n.pattern(`${t}:${e}`) : void 0;
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
		service_date: kt(i),
		generated_at: i,
		directions: a
	};
}
var Xt, Zt, Qt, $t = t((() => {
	be(), We(), d(), oe(), Dt(), ue(), Bt(), Xt = {
		ida: "asc",
		vuelta: "desc"
	}, Zt = "-", Qt = " – ";
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
function en(e, t) {
	let n = new AbortController(), r = setTimeout(() => n.abort(), t), i = () => n.abort();
	return e != null && e.aborted && n.abort(), e == null || e.addEventListener("abort", i, { once: !0 }), {
		signal: n.signal,
		clear: () => {
			clearTimeout(r), e == null || e.removeEventListener("abort", i);
		}
	};
}
async function tn(e, t, { signal: n, timeoutMs: r = pn } = {}) {
	let i = en(n, r), a, c;
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
function nn(e) {
	var t;
	let n = (t = x(bn, this)) == null ? void 0 : t.get(e);
	if (!n) return null;
	try {
		return JSON.parse(n);
	} catch {
		return null;
	}
}
function rn() {
	if (!x(Sn, this)) {
		let e = _(M, this, an).call(this).then((e) => {
			let t = new ye(e);
			return {
				index: t,
				resolver: new at(t)
			};
		});
		e.catch(() => {
			x(Sn, this) === e && y(Sn, this, void 0);
		}), y(Sn, this, e);
	}
	return x(Sn, this);
}
async function an() {
	let e = _(M, this, on).call(this);
	if (e && x(j, this).call(this) - Date.parse(e.fetched_at) < 864e5) return e;
	try {
		var t;
		let [e, n] = await Promise.all([_(M, this, sn).call(this, `${x(A, this)}linesDiscovery/lines`), _(M, this, sn).call(this, `${x(A, this)}linesDiscovery/stops`)]), r = Gt(ht(e), gt(n), vn(x(j, this)));
		return (t = x(bn, this)) == null || t.set("logrono-bus:catalogo:v1", JSON.stringify(r)), r;
	} catch (t) {
		if (e && t instanceof o) return e;
		throw t;
	}
}
function on() {
	let e = _(M, this, nn).call(this, hn);
	return e && Array.isArray(e.stops) && typeof e.fetched_at == "string" ? e : null;
}
async function sn(e, t) {
	let { response: n, body: r } = await tn(x(yn, this), e, {
		signal: t,
		timeoutMs: x(xn, this)
	});
	if (n.status === 429 || n.status >= 500) throw new o(`${e}: HTTP ${n.status}`);
	if (!n.ok) throw new s(`HTTP ${n.status} inesperado`, e);
	return r;
}
async function cn(e, t) {
	var n;
	let { response: r, body: i } = await tn(x(Tn, this), `${x(wn, this)}${e}`, {
		signal: t,
		timeoutMs: x(En, this)
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
async function ln(e, t) {
	try {
		let { response: n, body: r } = await tn(t, `${e.replace(/\/+$/, "")}/health`, { timeoutMs: mn });
		return n.ok && (r == null ? void 0 : r.api_version) === 1;
	} catch {
		return !1;
	}
}
async function un(e, t = {}) {
	let n = t.fetch ?? ((e, t) => globalThis.fetch(e, t)), r = e.api ?? "./api/v1";
	if (e.api && t.pageProtocol === "https:" && e.api.startsWith("http:")) throw new _n("Esta página es https y el servidor indicado es http: el navegador bloquea esa conexión. Abre la web desde tu propio servidor o publícalo con https.");
	return e.source === "directa" ? new Cn(dn, t) : e.source === "servidor" || e.api || await ln(r, n) ? new On(r, t) : new Cn(dn, t);
}
var dn, fn, pn, mn, hn, gn, _n, vn, A, yn, bn, j, xn, Sn, M, Cn, wn, Tn, En, N, Dn, On, kn = t((() => {
	be(), ot(), d(), $t(), Dt(), Bt(), k(), g(), b(), v(), S(), dn = "https://transporteurbano.logrono.es/api/", fn = "./api/v1", pn = 1e4, mn = 3e3, hn = "logrono-bus:catalogo:v1", gn = "logrono-bus:horario:v1:", _n = class extends i {
		constructor(...e) {
			super(...e), this.name = "UnusableSource";
		}
	}, vn = (e) => new Date(e()).toISOString(), A = /* @__PURE__ */ new WeakMap(), yn = /* @__PURE__ */ new WeakMap(), bn = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), xn = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakSet(), Cn = class {
		constructor(e = dn, t = {}) {
			O(this, M), h(this, A, void 0), h(this, yn, void 0), h(this, bn, void 0), h(this, j, void 0), h(this, xn, void 0), h(this, Sn, void 0), this.kind = "directa", y(A, this, e.endsWith("/") ? e : `${e}/`), y(yn, this, t.fetch ?? ((e, t) => globalThis.fetch(e, t))), y(bn, this, t.store), y(j, this, t.now ?? Date.now), y(xn, this, t.timeoutMs ?? 1e4);
		}
		async catalog() {
			return (await _(M, this, rn).call(this)).index;
		}
		async arrivals(e, t) {
			let { index: n, resolver: r } = await _(M, this, rn).call(this), i = n.stop(e);
			if (i.line_ids.length === 0) return {
				stop_id: i.id,
				generated_at: vn(x(j, this)),
				arrivals: []
			};
			let a = new URLSearchParams({
				lines: i.line_ids.join(","),
				previewMinutes: "60"
			}), o = `${x(A, this)}estimatedTimetable/byStop/${encodeURIComponent(i.id)}?${a}`;
			return Kt(_t(await _(M, this, sn).call(this, o, t)), i.id, n, r, vn(x(j, this)));
		}
		async vehicles(e, t) {
			let { index: n } = await _(M, this, rn).call(this), r = n.line(e), i = `${x(A, this)}vehicleMonitoring/byLine/${encodeURIComponent(r.id)}`;
			return Jt(vt(await _(M, this, sn).call(this, i, t)), r.id, n, vn(x(j, this)));
		}
		async timetable(e, t) {
			var n;
			let { index: r } = await _(M, this, rn).call(this), i = r.line(e), a = kt(x(j, this).call(this)), o = `${gn}${i.id}`, s = _(M, this, nn).call(this, o);
			if ((s == null ? void 0 : s.service_date) === a && Array.isArray(s.directions)) return s;
			let c = `${x(A, this)}productionTimetable/byLine/${encodeURIComponent(i.id)}`, l = Yt(xt(await _(M, this, sn).call(this, c, t)), i.id, r, vn(x(j, this)));
			return (n = x(bn, this)) == null || n.set(o, JSON.stringify(l)), l;
		}
	}, wn = /* @__PURE__ */ new WeakMap(), Tn = /* @__PURE__ */ new WeakMap(), En = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakSet(), On = class {
		constructor(e = fn, t = {}) {
			O(this, Dn), h(this, wn, void 0), h(this, Tn, void 0), h(this, En, void 0), h(this, N, void 0), this.kind = "servidor", y(wn, this, e.replace(/\/+$/, "")), y(Tn, this, t.fetch ?? ((e, t) => globalThis.fetch(e, t))), y(En, this, t.timeoutMs ?? 1e4);
		}
		catalog() {
			if (!x(N, this)) {
				let e = _(Dn, this, cn).call(this, "/catalog").then((e) => new ye(e));
				e.catch(() => {
					x(N, this) === e && y(N, this, void 0);
				}), y(N, this, e);
			}
			return x(N, this);
		}
		arrivals(e, t) {
			return _(Dn, this, cn).call(this, `/stops/${encodeURIComponent(e)}/arrivals`, t);
		}
		vehicles(e, t) {
			return _(Dn, this, cn).call(this, `/lines/${encodeURIComponent(e)}/vehicles`, t);
		}
		timetable(e, t) {
			return _(Dn, this, cn).call(this, `/lines/${encodeURIComponent(e)}/timetable`, t);
		}
	};
})), P, An, jn = t((() => {
	g(), S(), b(), P = /* @__PURE__ */ new WeakMap(), An = class {
		constructor(e) {
			h(this, P, void 0);
			try {
				y(P, this, e());
			} catch {
				y(P, this, void 0);
			}
		}
		get(e) {
			try {
				var t;
				return ((t = x(P, this)) == null ? void 0 : t.getItem(e)) ?? null;
			} catch {
				return null;
			}
		}
		set(e, t) {
			try {
				var n;
				(n = x(P, this)) == null || n.setItem(e, t);
			} catch {}
		}
		remove(e) {
			try {
				var t;
				(t = x(P, this)) == null || t.removeItem(e);
			} catch {}
		}
	};
})), F = t((() => {
	je(), be(), We(), tt(), ot(), d(), ee(), oe(), $t(), Dt(), Je(), we(), kn(), jn(), ue(), Bt();
}));
//#endregion
//#region src/config.ts
function Mn(e) {
	if (typeof e != "object" || !e) throw new Pn("La configuración de la tarjeta no es válida.");
	let t = e, n = t.entities;
	if (!Array.isArray(n) || n.length === 0) throw new Pn("Indica al menos un sensor en «entities» (los de Logroño Bus terminados en _minutos).");
	let r = Number(t.aviso ?? C.alertMinutes), i = Number(t.tam ?? C.textScale), a = Number(t.previas ?? C.previousStops), o = t.titulo;
	return {
		type: typeof t.type == "string" ? t.type : `custom:${I}`,
		entities: n.filter((e) => typeof e == "string"),
		...typeof o == "string" && o.trim() ? { titulo: o.trim() } : {},
		orden: Fn(et, t.orden, C.order),
		aviso: Number.isFinite(r) ? Math.min(15, Math.max(0, Math.round(r))) : C.alertMinutes,
		efecto: Fn($e, t.efecto, C.effect),
		color: Fn(Ze, t.color, C.colour),
		letra: Fn(Qe, t.letra, C.font),
		tam: Number.isFinite(i) ? Ye(i) : C.textScale,
		modo: Fn(Nn, t.modo, "normal"),
		recorrido: t.recorrido !== !1,
		previas: Number.isFinite(a) ? Xe(a) : C.previousStops
	};
}
var I, Nn, Pn, Fn, In = t((() => {
	F(), I = "logrono-bus-card", Nn = ["normal", "pantalla"], Pn = class extends Error {
		constructor(...e) {
			super(...e), this.name = "CardConfigError";
		}
	}, Fn = (e, t, n) => typeof t == "string" && e.includes(t) ? t : n;
})), Ln, Rn, zn, Bn, Vn, Hn, L, Un, Wn, Gn = t((() => {
	Ln = globalThis, Rn = Ln.ShadowRoot && (Ln.ShadyCSS === void 0 || Ln.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, zn = Symbol(), Bn = /* @__PURE__ */ new WeakMap(), Vn = class {
		constructor(e, t, n) {
			if (this._$cssResult$ = !0, n !== zn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
			this.cssText = e, this.t = t;
		}
		get styleSheet() {
			let e = this.o, t = this.t;
			if (Rn && e === void 0) {
				let n = t !== void 0 && t.length === 1;
				n && (e = Bn.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Bn.set(t, e));
			}
			return e;
		}
		toString() {
			return this.cssText;
		}
	}, Hn = (e) => new Vn(typeof e == "string" ? e : e + "", void 0, zn), L = (e, ...t) => {
		let n = e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
			if (!0 === e._$cssResult$) return e.cssText;
			if (typeof e == "number") return e;
			throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
		})(n) + e[r + 1], e[0]);
		return new Vn(n, e, zn);
	}, Un = (e, t) => {
		if (Rn) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
		else for (let n of t) {
			let t = document.createElement("style"), r = Ln.litNonce;
			r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
		}
	}, Wn = Rn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
		let t = "";
		for (let n of e.cssRules) t += n.cssText;
		return Hn(t);
	})(e) : e;
})), Kn, qn, Jn, Yn, Xn, Zn, Qn, R, $n, er, tr, nr, rr, ir, ar, z, or = t((() => {
	Gn(), {is: qn, defineProperty: Jn, getOwnPropertyDescriptor: Yn, getOwnPropertyNames: Xn, getOwnPropertySymbols: Zn, getPrototypeOf: Qn} = Object, R = globalThis, $n = R.trustedTypes, er = $n ? $n.emptyScript : "", tr = R.reactiveElementPolyfillSupport, nr = (e, t) => e, rr = {
		toAttribute(e, t) {
			switch (t) {
				case Boolean:
					e = e ? er : null;
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
	}, ir = (e, t) => !qn(e, t), ar = {
		attribute: !0,
		type: String,
		converter: rr,
		reflect: !1,
		useDefault: !1,
		hasChanged: ir
	}, (Kn = Symbol).metadata ?? (Kn.metadata = Symbol("metadata")), R.litPropertyMetadata ?? (R.litPropertyMetadata = /* @__PURE__ */ new WeakMap()), z = class extends HTMLElement {
		static addInitializer(e) {
			this._$Ei(), (this.l ?? (this.l = [])).push(e);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(e, t = ar) {
			if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
				let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
				r !== void 0 && Jn(this.prototype, e, r);
			}
		}
		static getPropertyDescriptor(e, t, n) {
			let { get: r, set: i } = Yn(this.prototype, e) ?? {
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
			return this.elementProperties.get(e) ?? ar;
		}
		static _$Ei() {
			if (this.hasOwnProperty(nr("elementProperties"))) return;
			let e = Qn(this);
			e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
		}
		static finalize() {
			if (this.hasOwnProperty(nr("finalized"))) return;
			if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(nr("properties"))) {
				let e = this.properties, t = [...Xn(e), ...Zn(e)];
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
				for (let e of n) t.unshift(Wn(e));
			} else e !== void 0 && t.push(Wn(e));
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
			return Un(e, this.constructor.elementStyles), e;
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
				let a = (((i = n.converter) == null ? void 0 : i.toAttribute) === void 0 ? rr : n.converter).toAttribute(t, n.type);
				this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
			}
		}
		_$AK(e, t) {
			let n = this.constructor, r = n._$Eh.get(e);
			if (r !== void 0 && this._$Em !== r) {
				var i, a;
				let e = n.getPropertyOptions(r), o = typeof e.converter == "function" ? { fromAttribute: e.converter } : ((i = e.converter) == null ? void 0 : i.fromAttribute) === void 0 ? rr : e.converter;
				this._$Em = r;
				let s = o.fromAttribute(t, e.type);
				this[r] = s ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? s, this._$Em = null;
			}
		}
		requestUpdate(e, t, n, r = !1, i) {
			if (e !== void 0) {
				var a;
				let o = this.constructor;
				if (!1 === r && (i = this[e]), n ?? (n = o.getPropertyOptions(e)), !((n.hasChanged ?? ir)(i, t) || n.useDefault && n.reflect && i === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(o._$Eu(e, n)))) return;
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
	}, z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[nr("elementProperties")] = /* @__PURE__ */ new Map(), z[nr("finalized")] = /* @__PURE__ */ new Map(), tr == null || tr({ ReactiveElement: z }), (R.reactiveElementVersions ?? (R.reactiveElementVersions = [])).push("2.1.2");
}));
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/lit-html.js
function sr(e, t) {
	if (!_r(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return dr === void 0 ? t : dr.createHTML(t);
}
function B(e, t, n = e, r) {
	var i, a;
	if (t === G) return t;
	let o = r === void 0 ? n._$Cl : (i = n._$Co) == null ? void 0 : i[r], s = gr(t) ? void 0 : t._$litDirective$;
	return (o == null ? void 0 : o.constructor) !== s && (o == null || (a = o._$AO) == null || a.call(o, !1), s === void 0 ? o = void 0 : (o = new s(e), o._$AT(e, n, r)), r === void 0 ? n._$Cl = o : (n._$Co ?? (n._$Co = []))[r] = o), o !== void 0 && (t = B(e, o._$AS(e, t.values), o, r)), t;
}
var cr, lr, ur, dr, fr, V, pr, mr, H, hr, gr, _r, vr, yr, br, xr, Sr, U, Cr, wr, Tr, Er, W, G, K, Dr, q, Or, kr, Ar, jr, Mr, Nr, Pr, Fr, Ir, Lr, Rr, zr, Br = t((() => {
	cr = globalThis, lr = (e) => e, ur = cr.trustedTypes, dr = ur ? ur.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, fr = "$lit$", V = `lit$${Math.random().toFixed(9).slice(2)}$`, pr = "?" + V, mr = `<${pr}>`, H = document, hr = () => H.createComment(""), gr = (e) => e === null || typeof e != "object" && typeof e != "function", _r = Array.isArray, vr = (e) => _r(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", yr = "[ 	\n\f\r]", br = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, xr = /-->/g, Sr = />/g, U = RegExp(`>|${yr}(?:([^\\s"'>=/]+)(${yr}*=${yr}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Cr = /'/g, wr = /"/g, Tr = /^(?:script|style|textarea|title)$/i, Er = (e) => (t, ...n) => ({
		_$litType$: e,
		strings: t,
		values: n
	}), W = Er(1), Er(2), Er(3), G = Symbol.for("lit-noChange"), K = Symbol.for("lit-nothing"), Dr = /* @__PURE__ */ new WeakMap(), q = H.createTreeWalker(H, 129), Or = (e, t) => {
		let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = br;
		for (let t = 0; t < n; t++) {
			let n = e[t], s, c, l = -1, u = 0;
			for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === br ? c[1] === "!--" ? o = xr : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = U) : (Tr.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = U) : o = Sr : o === U ? c[0] === ">" ? (o = i ?? br, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? U : c[3] === "\"" ? wr : Cr) : o === wr || o === Cr ? o = U : o === xr || o === Sr ? o = br : (o = U, i = void 0);
			let d = o === U && e[t + 1].startsWith("/>") ? " " : "";
			a += o === br ? n + mr : l >= 0 ? (r.push(s), n.slice(0, l) + fr + n.slice(l) + V + d) : n + V + (l === -2 ? t : d);
		}
		return [sr(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
	}, kr = class e {
		constructor({ strings: t, _$litType$: n }, r) {
			let i;
			this.parts = [];
			let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Or(t, n);
			if (this.el = e.createElement(l, r), q.currentNode = this.el.content, n === 2 || n === 3) {
				let e = this.el.content.firstChild;
				e.replaceWith(...e.childNodes);
			}
			for (; (i = q.nextNode()) !== null && c.length < s;) {
				if (i.nodeType === 1) {
					if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(fr)) {
						let t = u[o++], n = i.getAttribute(e).split(V), r = /([.?@])?(.*)/.exec(t);
						c.push({
							type: 1,
							index: a,
							name: r[2],
							strings: n,
							ctor: r[1] === "." ? Nr : r[1] === "?" ? Pr : r[1] === "@" ? Fr : Mr
						}), i.removeAttribute(e);
					} else e.startsWith(V) && (c.push({
						type: 6,
						index: a
					}), i.removeAttribute(e));
					if (Tr.test(i.tagName)) {
						let e = i.textContent.split(V), t = e.length - 1;
						if (t > 0) {
							i.textContent = ur ? ur.emptyScript : "";
							for (let n = 0; n < t; n++) i.append(e[n], hr()), q.nextNode(), c.push({
								type: 2,
								index: ++a
							});
							i.append(e[t], hr());
						}
					}
				} else if (i.nodeType === 8) {
					if (i.data === pr) c.push({
						type: 2,
						index: a
					});
					else {
						let e = -1;
						for (; (e = i.data.indexOf(V, e + 1)) !== -1;) c.push({
							type: 7,
							index: a
						}), e += V.length - 1;
					}
				}
				a++;
			}
		}
		static createElement(e, t) {
			let n = H.createElement("template");
			return n.innerHTML = e, n;
		}
	}, Ar = class {
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
			let { el: { content: t }, parts: n } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? H).importNode(t, !0);
			q.currentNode = r;
			let i = q.nextNode(), a = 0, o = 0, s = n[0];
			for (; s !== void 0;) {
				if (a === s.index) {
					let t;
					s.type === 2 ? t = new jr(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ir(i, this, e)), this._$AV.push(t), s = n[++o];
				}
				a !== (s == null ? void 0 : s.index) && (i = q.nextNode(), a++);
			}
			return q.currentNode = H, r;
		}
		p(e) {
			let t = 0;
			for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
		}
	}, jr = class e {
		get _$AU() {
			var e;
			return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
		}
		constructor(e, t, n, r) {
			this.type = 2, this._$AH = K, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
			e = B(this, e, t), gr(e) ? e === K || e == null || e === "" ? (this._$AH !== K && this._$AR(), this._$AH = K) : e !== this._$AH && e !== G && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? vr(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
		}
		O(e) {
			return this._$AA.parentNode.insertBefore(e, this._$AB);
		}
		T(e) {
			this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
		}
		_(e) {
			this._$AH !== K && gr(this._$AH) ? this._$AA.nextSibling.data = e : this.T(H.createTextNode(e)), this._$AH = e;
		}
		$(e) {
			var t;
			let { values: n, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = kr.createElement(sr(r.h, r.h[0]), this.options)), r);
			if (((t = this._$AH) == null ? void 0 : t._$AD) === i) this._$AH.p(n);
			else {
				let e = new Ar(i, this), t = e.u(this.options);
				e.p(n), this.T(t), this._$AH = e;
			}
		}
		_$AC(e) {
			let t = Dr.get(e.strings);
			return t === void 0 && Dr.set(e.strings, t = new kr(e)), t;
		}
		k(t) {
			_r(this._$AH) || (this._$AH = [], this._$AR());
			let n = this._$AH, r, i = 0;
			for (let a of t) i === n.length ? n.push(r = new e(this.O(hr()), this.O(hr()), this, this.options)) : r = n[i], r._$AI(a), i++;
			i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
		}
		_$AR(e = this._$AA.nextSibling, t) {
			var n;
			for ((n = this._$AP) == null || n.call(this, !1, !0, t); e !== this._$AB;) {
				let t = lr(e).nextSibling;
				lr(e).remove(), e = t;
			}
		}
		setConnected(e) {
			var t;
			this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
		}
	}, Mr = class {
		get tagName() {
			return this.element.tagName;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		constructor(e, t, n, r, i) {
			this.type = 1, this._$AH = K, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = K;
		}
		_$AI(e, t = this, n, r) {
			let i = this.strings, a = !1;
			if (i === void 0) e = B(this, e, t, 0), a = !gr(e) || e !== this._$AH && e !== G, a && (this._$AH = e);
			else {
				let r = e, o, s;
				for (e = i[0], o = 0; o < i.length - 1; o++) s = B(this, r[n + o], t, o), s === G && (s = this._$AH[o]), a || (a = !gr(s) || s !== this._$AH[o]), s === K ? e = K : e !== K && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
			}
			a && !r && this.j(e);
		}
		j(e) {
			e === K ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
		}
	}, Nr = class extends Mr {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(e) {
			this.element[this.name] = e === K ? void 0 : e;
		}
	}, Pr = class extends Mr {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(e) {
			this.element.toggleAttribute(this.name, !!e && e !== K);
		}
	}, Fr = class extends Mr {
		constructor(e, t, n, r, i) {
			super(e, t, n, r, i), this.type = 5;
		}
		_$AI(e, t = this) {
			if ((e = B(this, e, t, 0) ?? K) === G) return;
			let n = this._$AH, r = e === K && n !== K || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== K && (n === K || r);
			r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
		}
		handleEvent(e) {
			var t;
			typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
		}
	}, Ir = class {
		constructor(e, t, n) {
			this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(e) {
			B(this, e);
		}
	}, Lr = {
		M: fr,
		P: V,
		A: pr,
		C: 1,
		L: Or,
		R: Ar,
		D: vr,
		V: B,
		I: jr,
		H: Mr,
		N: Pr,
		U: Fr,
		B: Nr,
		F: Ir
	}, Rr = cr.litHtmlPolyfillSupport, Rr == null || Rr(kr, jr), (cr.litHtmlVersions ?? (cr.litHtmlVersions = [])).push("3.3.3"), zr = (e, t, n) => {
		let r = (n == null ? void 0 : n.renderBefore) ?? t, i = r._$litPart$;
		if (i === void 0) {
			let e = (n == null ? void 0 : n.renderBefore) ?? null;
			r._$litPart$ = i = new jr(t.insertBefore(hr(), e), e, void 0, n ?? {});
		}
		return i._$AI(e), i;
	};
})), Vr, Hr, J, Ur, Wr = t((() => {
	or(), or(), Br(), Br(), Hr = globalThis, J = class extends z {
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
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = zr(t, this.renderRoot, this.renderOptions);
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
			return G;
		}
	}, J._$litElement$ = !0, J.finalized = !0, (Vr = Hr.litElementHydrateSupport) == null || Vr.call(Hr, { LitElement: J }), Ur = Hr.litElementPolyfillSupport, Ur == null || Ur({ LitElement: J }), (Hr.litElementVersions ?? (Hr.litElementVersions = [])).push("4.2.2");
})), Gr = t((() => {})), Y = t((() => {
	or(), Br(), Wr(), Gr();
}));
In(), Y(), F();
var Kr = new Intl.DateTimeFormat("es-ES", {
	hour: "2-digit",
	minute: "2-digit",
	timeZone: ae
});
function qr(e) {
	return Kr.format(new Date(e));
}
function Jr(e, t) {
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
		let t = qr(e.expected);
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
function Yr(e) {
	let t = Math.max(0, Math.round(e / 1e3));
	return t < 60 ? `hace ${t} s` : `hace ${Math.round(t / 60)} min`;
}
function Xr(e) {
	switch (e == null ? void 0 : e.state) {
		case "antes": return `Primera salida a las ${e.first}`;
		case "terminado": return `Servicio terminado · última salida ${e.last}`;
		case "sin_servicio": return "Hoy no hay servicio";
		case "en_servicio": return e.interval_min === null ? "Sin llegadas próximas" : `Sin llegadas próximas · pasa ${jt(e.interval_min, e.interval_max_min)}`;
		default: return "Sin llegadas próximas";
	}
}
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directive.js
var Zr = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Qr = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), $r = class {
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
Br();
var { I: ei } = Lr, ti = (e) => e, ni = () => document.createComment(""), ri = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new ei(r.insertBefore(ni(), i), r.insertBefore(ni(), i), e, e.options);
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
				let t = ti(e).nextSibling;
				ti(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, ii = (e, t, n = e) => (e._$AI(t, n), e), ai = {}, oi = (e, t = ai) => e._$AH = t, si = (e) => e._$AH, ci = (e) => {
	e._$AR(), e._$AA.remove();
};
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directives/repeat.js
Br();
var li = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, ui = Qr(class extends $r {
	constructor(e) {
		if (super(e), e.type !== Zr.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = si(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ?? (this.ut = []), c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = ii(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = ii(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = ii(i[d], a[m]), ri(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = ii(i[f], a[p]), ri(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = li(o, p, m), u = li(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = ri(e, i[d]);
					ii(t, a[p]), c[p] = t;
				} else c[p] = ii(n, a[p]), ri(e, i[d], n), i[t] = null;
				p++;
			} else ci(i[f]), f--;
		} else ci(i[d]), d++;
		for (; p <= m;) {
			let t = ri(e, c[m + 1]);
			ii(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && ci(e);
		}
		return this.ut = o, oi(e, c), G;
	}
});
//#endregion
//#region ../../node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/directives/style-map.js
Br();
var di = "important", fi = " !" + di, pi = Qr(class extends $r {
	constructor(e) {
		var t;
		if (super(e), e.type !== Zr.ATTRIBUTE || e.name !== "style" || ((t = e.strings) == null ? void 0 : t.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(fi);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? di : "") : n[e] = r;
			}
		}
		return G;
	}
});
F(), k(), v();
var mi, hi = "sentido desconocido", gi = /* @__PURE__ */ new WeakSet(), _i = class extends J {
	constructor() {
		super(), O(this, gi), this.card = void 0, this.now = Date.now(), this.variant = "fill", this.fit = !1, this.intensity = "normal", this.effect = "pulso", this.alertMinutes = 0, this.openable = !1, this.service = null;
	}
	get alerting() {
		var e;
		let t = (e = this.card) == null ? void 0 : e.arrivals.find((e) => !e.cancelled);
		return this.alertMinutes > 0 && this.effect !== "ninguno" && t !== void 0 && re(t.expected, this.now) <= this.alertMinutes;
	}
	willUpdate() {
		this.toggleAttribute("alert", this.alerting);
	}
	render() {
		let e = this.card;
		if (!e) return K;
		let [t, ...n] = e.arrivals, r = e.headsign ? null : (t == null ? void 0 : t.headsign) ?? hi;
		return W`
      <article
        style=${pi({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        aria-label=${_(gi, this, xi).call(this, e, e.arrivals)}
        role=${this.openable ? "button" : K}
        tabindex=${this.openable ? 0 : K}
        @click=${_(gi, this, vi)}
        @keydown=${_(gi, this, yi)}
      >
        <header>
          <span class="badge" aria-hidden="true">${e.line_label}</span>
          <div class="route">
            <span class="towards">${e.headsign ? `→ ${e.headsign}` : e.line_name}</span>
            <span class="stop">${e.stop_name}</span>
          </div>
        </header>
        ${t ? W`<div class="next">
                ${_(gi, this, bi).call(this, t, !0)}
                ${r ? W`<span class="headsign">→ ${r}</span>` : K}
              </div>` : W`<div class="empty">${Xr(this.service)}</div>`}
        <ul aria-hidden="true">
          ${n.map((e) => W`<li>${_(gi, this, bi).call(this, e, !1)}</li>`)}
        </ul>
      </article>
    `;
	}
};
mi = _i;
function vi() {
	this.openable && this.card && this.dispatchEvent(new CustomEvent("card-open", {
		detail: this.card,
		bubbles: !0,
		composed: !0
	}));
}
function yi(e) {
	(e.key === "Enter" || e.key === " ") && (e.preventDefault(), _(gi, this, vi).call(this));
}
function bi(e, t) {
	let n = Jr(e, this.now), r = [
		t ? "value" : "",
		t && !n.unit ? "word" : "",
		e.is_realtime ? "" : "scheduled",
		e.cancelled ? "cancelled" : ""
	].filter(Boolean).join(" ");
	return W`<span class=${r}>${n.value}</span>${n.unit ? W`<span class=${t ? "unit" : ""}>${t ? n.unit : ` ${n.unit}`}</span>` : K}${e.is_realtime ? K : W`<span class="mark" title="Horario programado, sin seguimiento en tiempo real">
              · prog.</span
            >`}`;
}
function xi(e, t) {
	let n = e.headsign ? `hacia ${e.headsign}` : "", r = t.map((e) => Jr(e, this.now).spoken).join(", "), i = this.alerting ? ". ¡Llega pronto!" : "";
	return `Línea ${e.line_label} ${n}, parada ${e.stop_name}: ${r || Xr(this.service).toLowerCase()}${i}`;
}
mi.properties = {
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
	alertMinutes: {
		type: Number,
		attribute: "alert-minutes"
	},
	openable: {
		type: Boolean,
		reflect: !0
	},
	service: { attribute: !1 }
}, mi.styles = L`
    :host {
      display: block;
      container-type: inline-size;
      min-width: 0;
      font-size: calc(1rem * var(--lb-text-scale, 1));
      --lb-alert-colour: #e11d48;
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
      box-shadow:
        var(--lb-shadow, none),
        inset 0 0 0 3px rgba(0, 0, 0, 0.12);
    }
    :host([alert][effect='borde']) article,
    :host([alert][effect='pulso']) article {
      outline: 0.3em solid var(--lb-alert-colour);
      outline-offset: -0.3em;
    }
    :host([alert][effect='pulso']) article {
      animation: lb-pulse 1.6s ease-in-out infinite;
    }
    :host([alert][effect='pulso']) .next .value {
      animation: lb-beat 1.6s ease-in-out infinite;
    }
    @keyframes lb-pulse {
      0%,
      100% {
        outline-color: var(--lb-alert-colour);
      }
      50% {
        outline-color: transparent;
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
    @media (prefers-reduced-motion: reduce) {
      :host([alert]) article,
      :host([alert]) .next .value {
        animation: none;
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
    :host([fit]) ul {
      font-size: clamp(0.8em, calc(min(5cqi, 10cqh) * var(--lb-text-scale, 1)), 2.6em);
    }
    .mark {
      font-size: 0.7em;
      font-weight: 500;
      opacity: 0.85;
    }
  `, customElements.get("lb-card") || customElements.define("lb-card", _i), F(), Y(), k(), g(), S(), b(), v();
var Si, Ci = 1.05, wi = 1.7;
function Ti(e) {
	var t;
	return e.direction ? `${e.line_id}:${e.direction}` : ((t = e.arrivals.find((e) => e.pattern_id)) == null ? void 0 : t.pattern_id) ?? null;
}
function Ei(e) {
	return Ti(e) !== null;
}
function X(e) {
	return `${e.stop_id}|${e.line_id}|${e.direction ?? "x"}`;
}
function Di(e, t, n) {
	if (e <= 1 || t <= 0 || n <= 0) return 1;
	let r = 1, i = Infinity;
	for (let a = 1; a <= e; a += 1) {
		let o = Math.ceil(e / a), s = t / a / (n / o), c = a * o - e, l = Math.abs(Math.log(s / wi)) + c * .15;
		l < i && (r = a, i = l);
	}
	return r;
}
function Oi(e) {
	return getComputedStyle(e).getPropertyValue("--lb-card-style").trim() === "strip" ? "strip" : "fill";
}
var ki = /* @__PURE__ */ new WeakMap(), Ai = /* @__PURE__ */ new WeakMap(), ji = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakSet(), Ni = class extends J {
	constructor() {
		super(), O(this, Mi), h(this, ki, /* @__PURE__ */ new Map()), h(this, Ai, ""), h(this, ji, typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(([e]) => {
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
		super.connectedCallback(), (e = x(ji, this)) == null || e.observe(this);
	}
	disconnectedCallback() {
		var e;
		super.disconnectedCallback(), (e = x(ji, this)) == null || e.disconnect();
	}
	willUpdate() {
		y(ki, this, _(Mi, this, Fi).call(this));
	}
	updated() {
		let e = _(Mi, this, Pi).call(this).map((e) => e.dataset.key ?? "").join(","), t = x(Ai, this) !== "" && e !== x(Ai, this);
		y(Ai, this, e), t && _(Mi, this, Li).call(this);
	}
	render() {
		let e = Oi(this), t = this.layout === "kiosk" ? `--lb-columns: ${Di(this.cards.length, this.size.width, this.size.height)}` : "";
		return W`<div class="grid" part="grid" style=${t}>
      ${ui(Oe(this.cards, this.order), X, (t) => W`<lb-card
            data-key=${X(t)}
            .card=${t}
            .now=${this.now}
            variant=${e}
            intensity=${this.colour}
            effect=${this.effect}
            alert-minutes=${this.alertMinutes}
            ?fit=${this.layout === "kiosk"}
            ?openable=${this.openable && Ei(t)}
            .service=${this.services.get(X(t)) ?? null}
          ></lb-card>`)}
    </div>`;
	}
};
Si = Ni;
function Pi() {
	return [...this.renderRoot.querySelectorAll("lb-card[data-key]")];
}
function Fi() {
	return new Map(_(Mi, this, Pi).call(this).map((e) => [e.dataset.key ?? "", e.getBoundingClientRect()]));
}
function Ii() {
	return !matchMedia("(prefers-reduced-motion: reduce)").matches && getComputedStyle(this).getPropertyValue("--lb-motion").trim() !== "none";
}
function Li() {
	let e = x(ki, this);
	if (e.size !== 0 && _(Mi, this, Ii).call(this)) for (let t of _(Mi, this, Pi).call(this)) {
		let n = e.get(t.dataset.key ?? "");
		if (!n || typeof t.animate != "function") continue;
		let r = t.getBoundingClientRect(), i = n.left - r.left, a = n.top - r.top;
		if (Math.abs(i) < 1 && Math.abs(a) < 1) continue;
		let o = a > 1 || Math.abs(a) <= 1 && i > 1, s = `translate(${i}px, ${a}px)`, c = `translate(${i / 2}px, ${a / 2}px) scale(${o ? Ci : 1})`;
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
Si.properties = {
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
}, Si.styles = L`
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
  `, customElements.get("lb-card-grid") || customElements.define("lb-card-grid", Ni), F(), Y(), g(), S(), b();
var Ri, zi = /* @__PURE__ */ new WeakMap(), Bi = class extends J {
	constructor() {
		super(), h(this, zi, null), this.timetable = null, this.now = Date.now(), this.stopName = "";
	}
	updated() {
		let e = this.renderRoot.querySelector("li.next"), t = this.timetable ? `${this.timetable.pattern_id}|${(e == null ? void 0 : e.textContent) ?? ""}` : null;
		e && t !== x(zi, this) && (y(zi, this, t), e.scrollIntoView({ block: "nearest" }));
	}
	render() {
		let e = this.timetable;
		if (!e || e.departures.length === 0) return W`<p class="status">Hoy no hay servicio en este sentido.</p>`;
		let t = Pt(e, this.now), n = t.next_departure, r = !1;
		return W`
      <p class="status">
        ${t.state === "en_servicio" && t.next_departure ? `Próxima salida ${t.next_departure}${t.interval_min === null ? "" : ` · ${jt(t.interval_min, t.interval_max_min)}`}` : Xr(t)}
      </p>
      <p class="note">
        Salidas de ${e.origin} hacia ${e.headsign}.
        ${this.stopName ? `A ${this.stopName} el autobús pasa unos minutos después.` : K}
      </p>
      <ul class="periods" aria-label="Frecuencia por franjas">
        ${e.periods.map((e) => W`<li>
              ${e.first}–${e.last} ·
              ${jt(e.interval_min, e.interval_max_min)}
            </li>`)}
      </ul>
      <ul class="departures" aria-label="Salidas de hoy">
        ${e.departures.map((e) => {
			let i = !r && e === n;
			i && (r = !0);
			let a = t.state === "terminado" || !r && n !== null;
			return W`<li
            class=${i ? "next" : a ? "past" : ""}
            aria-current=${i ? "time" : K}
          >
            ${e}
          </li>`;
		})}
      </ul>
    `;
	}
};
Ri = Bi, Ri.properties = {
	timetable: { attribute: !1 },
	now: { type: Number },
	stopName: {
		type: String,
		attribute: "stop-name"
	}
}, Ri.styles = L`
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
  `, customElements.get("lb-timetable") || customElements.define("lb-timetable", Bi), k(), g(), b(), S(), v();
var Vi = .2, Hi = /* @__PURE__ */ new WeakMap(), Ui = /* @__PURE__ */ new WeakMap(), Wi = /* @__PURE__ */ new WeakMap(), Gi = /* @__PURE__ */ new WeakMap(), Ki = /* @__PURE__ */ new WeakMap(), qi = /* @__PURE__ */ new WeakMap(), Ji = /* @__PURE__ */ new WeakMap(), Yi = /* @__PURE__ */ new WeakMap(), Xi = /* @__PURE__ */ new WeakMap(), Zi = /* @__PURE__ */ new WeakMap(), Qi = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakSet(), ea = class {
	constructor(e, t = {}) {
		O(this, $i), h(this, Hi, void 0), h(this, Ui, void 0), h(this, Wi, void 0), h(this, Gi, void 0), h(this, Ki, void 0), h(this, qi, void 0), h(this, Ji, void 0), h(this, Yi, void 0), h(this, Xi, 0), h(this, Zi, !1), h(this, Qi, !1), y(Hi, this, e), y(Ui, this, t.intervalMs ?? 3e4), y(Wi, this, t.maxBackoffMs ?? 3e5), y(Gi, this, t.random ?? Math.random), y(Ki, this, t.setTimer ?? ((e, t) => setTimeout(e, t))), y(qi, this, t.clearTimer ?? ((e) => clearTimeout(e)));
	}
	get failures() {
		return x(Xi, this);
	}
	nextDelayMs() {
		if (x(Xi, this) === 0) return x(Ui, this);
		let e = Math.min(x(Wi, this), x(Ui, this) * 2 ** x(Xi, this)), t = e * Vi * (x(Gi, this).call(this) * 2 - 1);
		return Math.round(Math.min(x(Wi, this), e + t));
	}
	start() {
		x(Zi, this) || (y(Zi, this, !0), x(Qi, this) || this.runNow());
	}
	stop() {
		var e;
		y(Zi, this, !1), _($i, this, ta).call(this), (e = x(Yi, this)) == null || e.abort();
	}
	setPaused(e) {
		e !== x(Qi, this) && (y(Qi, this, e), e ? _($i, this, ta).call(this) : x(Zi, this) && this.runNow());
	}
	async runNow() {
		var e;
		_($i, this, ta).call(this), (e = x(Yi, this)) == null || e.abort();
		let t = new AbortController();
		y(Yi, this, t);
		try {
			await x(Hi, this).call(this, t.signal), y(Xi, this, 0);
		} catch {
			if (t.signal.aborted) return;
			y(Xi, this, x(Xi, this) + 1);
		}
		x(Zi, this) && !x(Qi, this) && x(Yi, this) === t && y(Ji, this, x(Ki, this).call(this, () => void this.runNow(), this.nextDelayMs()));
	}
};
function ta() {
	x(Ji, this) !== void 0 && x(qi, this).call(this, x(Ji, this)), y(Ji, this, void 0);
}
F(), Y(), k(), g(), v(), S(), b();
var na, ra = 15e3, ia = 6e4, aa = {
	vertical: 2.4,
	horizontal: 4.6
}, oa = {
	vertical: 7,
	horizontal: 9
}, sa = .8;
function ca(e, t, n) {
	if (e <= 0 || n <= 0) return 12;
	let r = e - oa[t] * n, i = Math.floor(r / (aa[t] * n));
	return Math.min(12, Math.max(1, i));
}
function la(e, t = sa) {
	let n = /* @__PURE__ */ new Set();
	return e.stops.forEach((r, i) => {
		e.buses.some((e) => Math.abs(e.at - i) < t) && n.add(i);
	}), n;
}
function ua(e) {
	return e.minutes === null ? "" : e.minutes === 0 ? "llegando" : `${e.minutes} min`;
}
function da(e, t) {
	let n = e.arrivals.find((e) => !e.cancelled);
	if (!n) return e.stop_name;
	let r = n.is_realtime ? "" : " (horario programado)";
	return `${e.stop_name} · próximo ${Jr(n, t).spoken}${r}`;
}
var fa = /* @__PURE__ */ new WeakMap(), pa = /* @__PURE__ */ new WeakMap(), ma = /* @__PURE__ */ new WeakMap(), ha = /* @__PURE__ */ new WeakMap(), ga = /* @__PURE__ */ new WeakMap(), _a = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakSet(), va = class extends J {
	constructor() {
		super(), O(this, Z), h(this, fa, void 0), h(this, pa, new ea((e) => _(Z, this, xa).call(this, e), { intervalMs: ra })), h(this, ma, void 0), h(this, ha, void 0), h(this, ga, typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(([e]) => {
			if (!e) return;
			let { width: t, height: n } = e.contentRect;
			this.orientation = t > n * 1.1 ? "horizontal" : "vertical";
			let r = this.renderRoot.querySelector(".body") ?? this, i = Number.parseFloat(getComputedStyle(r).fontSize);
			this.room = ca(this.orientation === "horizontal" ? t : n * .7, this.orientation, i);
		})), h(this, _a, (e) => {
			e.key === "Escape" && this.close();
		}), this.card = void 0, this.source = void 0, this.arrivals = null, this.previousStops = 4, this.route = null, this.vehicles = void 0, this.problem = void 0, this.now = Date.now(), this.orientation = "vertical", this.room = 12, this.screen = "recorrido", this.timetable = void 0;
	}
	willUpdate() {
		let e = this.patternId;
		x(fa, this) && this.vehicles && this.card && e && (this.route = Ge(x(fa, this), e, this.card.stop_id, this.vehicles, this.arrivals, { previousStops: Math.min(this.previousStops, this.room) }));
	}
	connectedCallback() {
		var e;
		super.connectedCallback(), this.card && !this.card.arrivals.some((e) => !e.cancelled) && this.show("horario"), x(pa, this).start(), (e = x(ga, this)) == null || e.observe(this), y(ha, this, setInterval(() => this.now = Date.now(), 1e3)), document.addEventListener("keydown", x(_a, this)), _(Z, this, ba).call(this);
	}
	disconnectedCallback() {
		var e;
		super.disconnectedCallback(), x(pa, this).stop(), (e = x(ga, this)) == null || e.disconnect(), clearInterval(x(ha, this)), clearTimeout(x(ma, this)), document.removeEventListener("keydown", x(_a, this));
	}
	show(e) {
		this.screen = e, x(pa, this).setPaused(e === "horario"), e === "horario" && !this.timetable && _(Z, this, ya).call(this), _(Z, this, ba).call(this);
	}
	close() {
		this.dispatchEvent(new CustomEvent("route-close", {
			bubbles: !0,
			composed: !0
		}));
	}
	get patternId() {
		return this.card ? Ti(this.card) : null;
	}
	render() {
		let e = this.card;
		if (!e) return K;
		let t = this.route, n = this.vehicles ? this.now - Date.parse(this.vehicles.generated_at) : 0, r = t && t.buses.length === 0 && t.earlierBuses.length === 0;
		return W`
      <header
        style=${pi({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        @click=${() => _(Z, this, ba).call(this)}
      >
        <span class="badge">${e.line_label}</span>
        <div class="title">
          <strong>→ ${(t == null ? void 0 : t.headsign) ?? e.headsign ?? e.line_name}</strong>
          <span>${da(e, this.now)}</span>
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
        style=${pi({
			"--line-colour": e.colour,
			"--line-text": e.text_colour
		})}
        @click=${() => _(Z, this, ba).call(this)}
      >
        ${this.problem ? W`<p class="note" role="alert">${this.problem}</p>` : this.screen === "horario" ? _(Z, this, wa).call(this, e) : t ? _(Z, this, Ca).call(this, t) : W`<p class="note" role="status">Buscando los autobuses…</p>`}
      </div>
      <footer ?hidden=${this.screen === "horario"}>
        <span>
          ${t && t.hiddenStops > 0 ? `${this.orientation === "horizontal" ? "←" : "↓"} ${t.hiddenStops} paradas antes, desde ${t.origin}` : K}
          ${r ? "Ningún autobús en camino ahora mismo." : K}
        </span>
        <span>${this.vehicles ? `Posiciones ${Yr(n)}` : ""}</span>
      </footer>
    `;
	}
};
na = va;
async function ya() {
	let e = this.card, t = this.source;
	if (e && t) try {
		this.timetable = await t.timetable(e.line_id);
	} catch {
		this.problem = "No se puede obtener ahora el horario de la línea.";
	}
}
function ba() {
	clearTimeout(x(ma, this)), y(ma, this, setTimeout(() => this.close(), ia));
}
async function xa(e) {
	let t = this.card, n = this.source, r = this.patternId;
	if (t && n && r) try {
		let [r, i] = await Promise.all([n.catalog(), n.vehicles(t.line_id, e)]);
		y(fa, this, r), this.vehicles = i, this.problem = void 0;
	} catch (t) {
		throw e.aborted || (this.problem = "No se pueden obtener ahora las posiciones de los autobuses."), t;
	}
}
function Sa(e, t) {
	let n = t > 0 ? e / t : 1;
	return this.orientation === "horizontal" ? { left: `${n * 100}%` } : { top: `${(1 - n) * 100}%` };
}
function Ca(e) {
	let t = e.stops.length - 1, n = la(e), [r, ...i] = e.earlierBuses, a = t % 2 == 1;
	return W`<div class="track" role="img" aria-label=${_(Z, this, Ta).call(this, e)}>
      <div class="line"></div>
      ${e.hiddenStops > 0 ? W`<div class="more before"></div>` : K}
      ${e.stopsAfter > 0 ? W`<div class="more after"></div>` : K}
      ${e.stops.map((e, r) => W`<div
            class=${[
		"stop",
		r === t ? "target" : "",
		(t - r) % 2 == 1 ? "above" : "",
		n.has(r) ? "covered" : ""
	].join(" ")}
            style=${pi(_(Z, this, Sa).call(this, r, t))}
          >
            <span class="dot"></span><span class="name">${e.name}</span>
          </div>`)}
      ${e.buses.map((e, n) => W`<div
            class=${n === 0 ? "bus first" : "bus"}
            style=${pi(_(Z, this, Sa).call(this, e.at, t))}
          >
            <span class="pill">🚌 ${ua(e)}</span>
          </div>`)}
      ${r ? W`<div
              class=${[
		"bus earlier",
		e.buses.length === 0 ? "first" : "",
		a ? "low" : ""
	].join(" ")}
            >
              <span class="pill"
                >🚌
                ${ua(r)}${i.length > 0 ? ` +${i.length}` : ""}</span
              >
            </div>` : K}
    </div>`;
}
function wa(e) {
	return this.timetable ? W`<lb-timetable
      .timetable=${Ft(this.timetable, this.patternId) ?? null}
      .now=${this.now}
      stop-name=${e.stop_name}
    ></lb-timetable>` : W`<p class="note" role="status">Buscando el horario…</p>`;
}
function Ta(e) {
	let t = [...e.buses, ...e.earlierBuses];
	return t.length === 0 ? "Ningún autobús de esta línea en camino ahora mismo." : t.map((e) => {
		let t = e.stopsAway === 0 ? "llegando a tu parada" : `a ${e.stopsAway + 1} paradas`;
		return e.minutes === null ? `Un autobús ${t}` : `Un autobús ${t}, ${e.minutes} minutos`;
	}).join(". ");
}
na.properties = {
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
	timetable: { state: !0 }
}, na.styles = L`
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
    .stop .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
    :host([orientation='vertical']) .stop.target {
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
  `, customElements.get("lb-route") || customElements.define("lb-route", va), F(), Y(), k(), g(), S(), b(), v();
var Ea, Da = 5e3, Oa = /* @__PURE__ */ new WeakMap(), ka = /* @__PURE__ */ new WeakMap(), Aa = /* @__PURE__ */ new WeakMap(), ja = /* @__PURE__ */ new WeakMap(), Ma = /* @__PURE__ */ new WeakMap(), Na = /* @__PURE__ */ new WeakSet(), Pa = class extends J {
	constructor() {
		super(), O(this, Na), h(this, Oa, new ea((e) => this.refresh(e))), h(this, ka, void 0), h(this, Aa, void 0), h(this, ja, () => x(Oa, this).setPaused(document.hidden)), h(this, Ma, /* @__PURE__ */ new Map()), this.config = void 0, this.source = void 0, this.status = "loading", this.layout = "auto", this.cards = [], this.now = Date.now(), this.updatedAt = void 0, this.error = void 0, this.opened = void 0, this.timetables = /* @__PURE__ */ new Map();
	}
	connectedCallback() {
		super.connectedCallback(), document.addEventListener("visibilitychange", x(ja, this)), y(ka, this, setInterval(() => {
			this.now = Date.now();
		}, Da)), this.config && x(Oa, this).start();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), document.removeEventListener("visibilitychange", x(ja, this)), clearInterval(x(ka, this)), x(Oa, this).stop();
	}
	willUpdate(e) {
		this.config && (this.style.setProperty("--lb-text-scale", String(this.config.textScale / 100)), this.style.setProperty("font-family", Ra[this.config.font]));
		let t = e.get("config");
		(e.has("config") && za(t) !== za(this.config) || e.has("source")) && this.hasUpdated && this.isConnected && this.config && (y(Aa, this, void 0), x(Oa, this).stop(), x(Oa, this).start());
	}
	async refresh(e) {
		let t = this.config;
		if (t) try {
			this.source ?? (this.source = await un(t, { pageProtocol: location.protocol }));
			let n = this.source;
			x(Aa, this) ?? y(Aa, this, await n.catalog());
			let r = x(Aa, this), i = [...new Set(t.stops.map((e) => e.stop_id))], a = await Promise.all(i.map((t) => n.arrivals(t, e))), o = new Map(a.map((e) => [e.stop_id, e]));
			y(Ma, this, o), this.cards = t.stops.flatMap((e) => {
				let n = o.get(e.stop_id);
				return n ? Ee(r, e, n, t.perCard) : [];
			}), this.updatedAt = Math.min(...a.map((e) => Date.parse(e.generated_at))), this.now = Date.now(), this.error = void 0, this.status = "ready", _(Na, this, Fa).call(this, n, this.cards);
		} catch (t) {
			throw e != null && e.aborted ? t : (this.error = Ba(t), this.cards.length === 0 && (this.status = "error"), t);
		} finally {
			this.dispatchEvent(new CustomEvent("board-refresh", {
				bubbles: !0,
				composed: !0
			}));
		}
	}
	render() {
		let e = this.config;
		if (!e) return K;
		if (this.status === "loading") return W`<p class="message" role="status">Cargando llegadas…</p>`;
		if (this.status === "error") return W`<p class="message" role="alert">${this.error}</p>`;
		let t = this.updatedAt === void 0 ? 0 : this.now - this.updatedAt;
		return W`
      ${_(Na, this, La).call(this)}
      <lb-card-grid
        .cards=${this.cards}
        .now=${this.now}
        order=${e.order}
        colour=${e.colour}
        effect=${e.effect}
        alert-minutes=${e.alertMinutes}
        layout=${this.layout}
        .services=${_(Na, this, Ia).call(this)}
        @card-open=${(e) => this.opened = X(e.detail)}
      ></lb-card-grid>
      <div class="status" part="status" role="status">
        <span>Actualizado ${Yr(t)}</span>
        ${t > 9e4 ? W`<span class="stale">Datos sin actualizar: comprobando de nuevo</span>` : K}
        ${this.error ? W`<span class="problem">${this.error}</span>` : K}
      </div>
    `;
	}
};
Ea = Pa;
async function Fa(e, t) {
	let n = kt(Date.now()), r = new Set(t.filter((e) => !e.arrivals.some((e) => !e.cancelled)).map((e) => e.line_id).filter((e) => {
		var t;
		return ((t = this.timetables.get(e)) == null ? void 0 : t.service_date) !== n;
	}));
	if (r.size === 0) return;
	let i = await Promise.allSettled([...r].map(async (t) => e.timetable(t))), a = new Map(this.timetables);
	for (let e of i) e.status === "fulfilled" && a.set(e.value.line_id, e.value);
	this.timetables = a;
}
function Ia() {
	let e = /* @__PURE__ */ new Map();
	for (let t of this.cards) {
		let n = this.timetables.get(t.line_id);
		n && e.set(X(t), Pt(Ft(n, Ti(t)), this.now));
	}
	return e;
}
function La() {
	var e;
	let t = this.cards.find((e) => X(e) === this.opened);
	return !t || !this.source ? K : W`<lb-route
      .card=${t}
      .source=${this.source}
      .arrivals=${x(Ma, this).get(t.stop_id) ?? null}
      .previousStops=${((e = this.config) == null ? void 0 : e.previousStops) ?? 4}
      @route-close=${() => this.opened = void 0}
    ></lb-route>`;
}
Ea.properties = {
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
}, Ea.styles = L`
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
var Ra = {
	sistema: "var(--lb-font, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif)",
	legible: "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif",
	redondeada: "ui-rounded, 'SF Pro Rounded', 'Nunito', 'Varela Round', system-ui, sans-serif",
	mono: "ui-monospace, 'SF Mono', 'DejaVu Sans Mono', Menlo, Consolas, monospace"
};
function za(e) {
	return e ? `${Ce(e.stops)}|${e.perCard}` : "";
}
function Ba(e) {
	return e instanceof s ? "El servicio de autobuses del Ayuntamiento ha cambiado. Hace falta actualizar esta aplicación." : e instanceof o ? "No se puede contactar con el servicio de autobuses. Se reintentará automáticamente." : e instanceof i ? e.message : "Error inesperado al cargar las llegadas.";
}
//#endregion
//#region src/entities.ts
customElements.get("logrono-bus-board") || customElements.define("logrono-bus-board", Pa), F();
var Q = (e) => typeof e == "string" ? e : null, Va = (e) => typeof e == "number" ? e : null;
function Ha(e) {
	return e === "asc" || e === "desc" ? e : null;
}
function Ua(e) {
	return Array.isArray(e) ? e.filter((e) => typeof e == "object" && !!e && typeof e.hora == "string" && typeof e.tiempo_real == "boolean") : [];
}
function Wa(e) {
	return e !== void 0 && Q(e.attributes.linea_id) !== null;
}
function Ga(e) {
	if (!Wa(e)) return null;
	let t = e.attributes, n = Q(t.parada_id) ?? "", r = Q(t.linea_id) ?? "", i = Ha(t.sentido), a = Q(t.destino), o = i ? `${r}:${i}` : null, s = Ua(t.llegadas).map((e) => ({
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
function Ka(e, t) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of t) {
		let t = Ga(e.states[i]);
		if (!t) continue;
		let a = X(t);
		n.has(a) || (n.add(a), r.push(t));
	}
	return r;
}
function qa(e) {
	return Object.values(e.states).filter((e) => Wa(e)).filter((e) => e.attributes.unit_of_measurement === "min").map((e) => e.entity_id).sort();
}
function Ja(e) {
	if (!Wa(e)) return null;
	let t = e.attributes, n = t.servicio;
	return It.includes(n) ? {
		state: n,
		first: Q(t.primera_salida),
		last: Q(t.ultima_salida),
		next_departure: Q(t.proxima_salida),
		interval_min: Va(t.frecuencia_min),
		interval_max_min: Va(t.frecuencia_max_min)
	} : null;
}
function Ya(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) {
		let t = e.states[r], i = Ga(t), a = Ja(t);
		i && a && n.set(X(i), a);
	}
	return n;
}
//#endregion
//#region src/ha.ts
function Xa(e, t) {
	e.dispatchEvent(new CustomEvent("config-changed", {
		detail: { config: t },
		bubbles: !0,
		composed: !0
	}));
}
var Za = t((() => {})), Qa = /* @__PURE__ */ n({
	EDITOR_LABELS: () => no,
	EDITOR_SCHEMA: () => to,
	LogronoBusCardEditor: () => io
});
function $a(e) {
	e.stopPropagation();
	let t = {
		...e.detail.value,
		type: `custom:${I}`
	};
	try {
		Mn(t);
	} catch {}
	this.config = t, Xa(this, t);
}
var eo, $, to, no, ro, io, ao, oo = t((() => {
	F(), Y(), Za(), k(), v(), $ = (e, t) => ({
		value: e,
		label: t
	}), to = [
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
	], no = {
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
	}, ro = /* @__PURE__ */ new WeakSet(), io = class extends J {
		constructor() {
			super(), O(this, ro), this.hass = void 0, this.config = void 0;
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
			return !this.hass || !this.config ? K : W`<ha-form
      .hass=${this.hass}
      .data=${this.formData}
      .schema=${to}
      .computeLabel=${(e) => no[e.name] ?? e.name}
      @value-changed=${_(ro, this, $a)}
    ></ha-form>`;
		}
	}, eo = io, eo.properties = {
		hass: { attribute: !1 },
		config: { state: !0 }
	}, ao = `${I}-editor`, customElements.get(ao) || customElements.define(ao, io);
}));
F(), Y(), In(), k(), g(), b(), S(), v();
var so, co = 5e3, lo = 3, uo = /* @__PURE__ */ new WeakMap(), fo = /* @__PURE__ */ new WeakMap(), po = /* @__PURE__ */ new WeakMap(), mo = /* @__PURE__ */ new WeakMap(), ho = /* @__PURE__ */ new WeakSet(), go = class extends J {
	constructor() {
		super(), O(this, ho), h(this, uo, void 0), h(this, fo, void 0), h(this, po, []), h(this, mo, /* @__PURE__ */ new Map()), this.hass = void 0, this.config = void 0, this.now = Date.now(), this.opened = void 0;
	}
	setConfig(e) {
		this.config = Mn(e);
	}
	getCardSize() {
		var e;
		return Math.max(2, (((e = this.config) == null ? void 0 : e.entities.length) ?? 1) * lo);
	}
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	static async getConfigElement() {
		return await Promise.resolve().then(() => (oo(), Qa)), document.createElement(`${I}-editor`);
	}
	static getStubConfig(e) {
		return {
			entities: qa(e).slice(0, 4),
			orden: "llegada"
		};
	}
	connectedCallback() {
		super.connectedCallback(), y(uo, this, setInterval(() => this.now = Date.now(), co));
	}
	disconnectedCallback() {
		super.disconnectedCallback(), clearInterval(x(uo, this));
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
		e && (this.setAttribute("modo", e.modo), this.style.setProperty("--lb-text-scale", String(e.tam / 100)), this.style.fontFamily = e.letra === "sistema" ? "" : Ra[e.letra], this.hass && (y(po, this, Ka(this.hass, e.entities)), y(mo, this, Ya(this.hass, e.entities))));
	}
	render() {
		let e = this.config;
		if (!e) return K;
		let t = e.modo === "pantalla" ? "kiosk" : "auto";
		return W`<ha-card>
      ${e.titulo ? W`<h1>${e.titulo}</h1>` : K}
      ${x(po, this).length === 0 ? W`<p class="empty">
              No hay datos de los sensores elegidos. Comprueba que pertenecen a la integración
              Logroño Bus.
            </p>` : W`<lb-card-grid
              .cards=${x(po, this)}
              .services=${x(mo, this)}
              .now=${this.now}
              order=${e.orden}
              colour=${e.color}
              effect=${e.efecto}
              alert-minutes=${e.aviso}
              layout=${t}
              .openable=${e.recorrido}
              @card-open=${(e) => this.opened = e.detail}
            ></lb-card-grid>`}
      ${_(ho, this, vo).call(this)}
    </ha-card>`;
	}
};
so = go;
function _o() {
	return x(fo, this) ?? y(fo, this, new Cn("https://transporteurbano.logrono.es/api/", { store: new An(() => globalThis.localStorage) })), x(fo, this);
}
function vo() {
	let e = this.opened, t = this.config;
	return !e || !t ? K : W`<lb-route
      .card=${e}
      .source=${_o.call(_(ho, this))}
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
so.properties = {
	hass: { attribute: !1 },
	config: { state: !0 },
	now: { state: !0 },
	opened: { state: !0 }
}, so.styles = L`
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
  `, customElements.get("logrono-bus-card") || customElements.define(I, go), In();
var yo;
(yo = window).customCards ?? (yo.customCards = []), window.customCards.some((e) => e.type === "logrono-bus-card") || window.customCards.push({
	type: I,
	name: "Logroño Bus",
	description: "Próximos autobuses de tus paradas, con el aspecto de la web de Logroño Bus.",
	preview: !0
}), console.info(`%c LOGROÑO-BUS-CARD %c ${r} `, "color:#fff;background:#8c1c2c", "");
//#endregion
export { go as LogronoBusCard, Ga as cardFromEntity, Ka as cardsFromHass, Mn as normalizeConfig };
