/* Elettro Reef 2 — realistic fish art.
   Every creature is painted procedurally (shaded bodies, scales, translucent ray fins, glossy eyes) into
   a small set of swim-cycle frames, so the big screen just blits sprites. Photo cut-outs can replace any
   species by setting window.REEF2_SPRITES = { clown: 'img/fish/clown.png', ... } before this file loads. */
(function (root) {
'use strict';
var PI = Math.PI, TAU = PI * 2, sin = Math.sin, cos = Math.cos, min = Math.min, max = Math.max, pow = Math.pow;
function hx(h) { h = h.replace('#', ''); if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgba(h, a) { var c = hx(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a == null ? 1 : a) + ')'; }
function sh(h, k) { var c = hx(h), t = k < 0 ? 0 : 255, a = Math.abs(k); return 'rgb(' + Math.round(c[0] + (t - c[0]) * a) + ',' + Math.round(c[1] + (t - c[1]) * a) + ',' + Math.round(c[2] + (t - c[2]) * a) + ')'; }
function rng(seed) { var s = (seed >>> 0) || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function lerp(a, b, t) { return a + (b - a) * t; }

/* ---------------- species ---------------- */
var SP = {
  clown:  { en: 'Clownfish', es: 'Pez payaso', color: '#ff8a1f', power: ['Anemone Shield', 'Escudo de anémona'], L: 100, H: 48, pH: .22, top: '#d9500a', mid: '#ff8a1f', bot: '#ffb457', tail: { t: 'round', len: .24, span: .66, col: '#ff8a1f', edge: '#111' }, dors: { a: .2, b: .8, h: .3, col: '#ff7a14', edge: '#111', prof: 'round' }, anal: { a: .22, b: .45, h: .16, col: '#ff7a14', edge: '#111' }, pect: { len: .2, col: '#ff8a1f', edge: '#111' }, eye: { u: .84, v: -.2, r: .085, iris: '#e8a317' }, speed: 1.0 },
  tang:   { en: 'Blue Tang', es: 'Cirujano azul', color: '#2457e6', power: ['Tail Surge', 'Impulso'], L: 104, H: 54, pH: .12, top: '#0b2aa6', mid: '#1f55e0', bot: '#5d8dff', tail: { t: 'fork', len: .3, span: .74, col: '#ffd51a' }, dors: { a: .16, b: .82, h: .26, col: '#2457e6', edge: '#0a1f7a', prof: 'long' }, anal: { a: .2, b: .6, h: .2, col: '#2457e6', edge: '#0a1f7a' }, pect: { len: .22, col: '#ffd51a' }, eye: { u: .85, v: -.1, r: .07, iris: '#ffd51a' }, speed: 1.12 },
  angel:  { en: 'Queen Angelfish', es: 'Ángel reina', color: '#27b7e8', power: ['Dazzle', 'Destello'], L: 92, H: 92, pH: .2, top: '#1d7ed0', mid: '#34c0e4', bot: '#ffd23a', tail: { t: 'round', len: .2, span: .7, col: '#ffd23a' }, dors: { a: .22, b: .74, h: .42, col: '#2aa3dd', edge: '#ffd23a', prof: 'sweep', sweep: .5 }, anal: { a: .26, b: .7, h: .36, col: '#ffd23a', edge: '#2aa3dd', sweep: .45 }, pect: { len: .2, col: '#ffd23a' }, eye: { u: .8, v: -.12, r: .06, iris: '#1b3a90' }, speed: .95 },
  yellow: { en: 'Yellow Tang', es: 'Cirujano amarillo', color: '#ffd90f', power: ['School Call', 'Llamada'], L: 96, H: 56, pH: .13, top: '#f2c200', mid: '#ffe21a', bot: '#fff07a', tail: { t: 'fork', len: .26, span: .6, col: '#ffe21a' }, dors: { a: .14, b: .86, h: .24, col: '#ffe21a', edge: '#e0b400', prof: 'long' }, anal: { a: .2, b: .62, h: .18, col: '#ffe21a', edge: '#e0b400' }, pect: { len: .2, col: '#ffe86a' }, eye: { u: .86, v: -.1, r: .065, iris: '#b87800' }, speed: 1.08 },
  butter: { en: 'Butterflyfish', es: 'Pez mariposa', color: '#ffe35a', power: ['Plankton Magnet', 'Imán'], L: 88, H: 78, pH: .16, top: '#f6f1d8', mid: '#fffbe6', bot: '#fffbe6', nose: { w: .3, p: .85 }, tail: { t: 'round', len: .18, span: .55, col: '#ffe35a' }, dors: { a: .2, b: .8, h: .26, col: '#ffe35a', edge: '#222', prof: 'round' }, anal: { a: .25, b: .7, h: .2, col: '#ffe35a', edge: '#222' }, pect: { len: .16, col: '#fff4b0' }, eye: { u: .86, v: -.12, r: .06, iris: '#222' }, speed: 1.0 },
  parrot: { en: 'Parrotfish', es: 'Pez loro', color: '#19b8a2', power: ['Sand Cloud', 'Nube de arena'], L: 118, H: 52, pH: .26, top: '#0c7d78', mid: '#19b8a2', bot: '#ff8fb0', tail: { t: 'lunate', len: .3, span: .66, col: '#19b8a2', edge: '#ff8fb0' }, dors: { a: .25, b: .82, h: .2, col: '#19b8a2', edge: '#ff8fb0', prof: 'long' }, anal: { a: .3, b: .65, h: .16, col: '#ff8fb0', edge: '#19b8a2' }, pect: { len: .24, col: '#7fe0c6', edge: '#ff8fb0' }, eye: { u: .8, v: -.15, r: .07, iris: '#f2b01e' }, speed: 1.05 },
  puffer: { en: 'Pufferfish', es: 'Pez globo', color: '#d6b070', power: ['Inflate', 'Inflarse'], L: 76, H: 66, pH: .34, top: '#a4783a', mid: '#d6b070', bot: '#f6ecd6', nose: { w: .25, p: .5 }, tail: { t: 'round', len: .2, span: .5, col: '#b88a4a' }, dors: { a: .6, b: .78, h: .16, col: '#c49a58', edge: '#8a6228', prof: 'round' }, anal: { a: .6, b: .76, h: .13, col: '#c49a58', edge: '#8a6228' }, pect: { len: .18, col: '#e8cf9a' }, eye: { u: .8, v: -.18, r: .1, iris: '#4aa86a' }, speed: .8 },
  lion:   { en: 'Lionfish', es: 'Pez león', color: '#c2341e', power: ['Venom Sting', 'Aguijón'], L: 104, H: 46, pH: .24, top: '#7a1410', mid: '#d9d0b8', bot: '#f4e8d2', tail: { t: 'round', len: .26, span: .6, col: '#e8dcc4', edge: '#7a1410' }, dors: { a: .2, b: .78, h: .38, col: '#d8c8aa', edge: '#7a1410', prof: 'spines' }, anal: { a: .3, b: .6, h: .22, col: '#d8c8aa', edge: '#7a1410' }, pect: { len: .44, col: '#d8c8aa', edge: '#7a1410', fan: true }, eye: { u: .84, v: -.14, r: .06, iris: '#b8651a' }, speed: .9 },
  barra:  { en: 'Barracuda', es: 'Barracuda', color: '#b9c6cf', L: 200, H: 28, pH: .34, top: '#56707e', mid: '#aebfc9', bot: '#eef3f5', nose: { w: .22, p: .9 }, tail: { t: 'fork', len: .2, span: .9, col: '#7d95a2' }, dors: { a: .62, b: .74, h: .24, col: '#7d95a2', edge: '#4a6270', prof: 'round' }, anal: { a: .62, b: .72, h: .2, col: '#7d95a2', edge: '#4a6270' }, pect: { len: .1, col: '#9db0ba' }, eye: { u: .9, v: -.05, r: .06, iris: '#e8e8e8' }, speed: 1.0 },
  shark:  { en: 'Reef Shark', es: 'Tiburón de arrecife', color: '#7d909b', L: 230, H: 56, pH: .22, top: '#52666f', mid: '#8396a1', bot: '#f2f6f7', nose: { w: .2, p: .6 }, tail: { t: 'shark', len: .26, span: 1.5, col: '#6f838e' }, dors: { a: .38, b: .56, h: .9, col: '#6f838e', edge: '#3f525c', prof: 'tri' }, anal: { a: .2, b: .28, h: .22, col: '#6f838e', edge: '#3f525c' }, pect: { len: .3, col: '#6f838e', edge: '#3f525c' }, eye: { u: .9, v: -.12, r: .028, iris: '#05090c' }, speed: 1.0 },
  anth:   { en: 'Anthias', es: 'Antias', color: '#ff7ea8', L: 44, H: 20, pH: .2, top: '#f0506e', mid: '#ff8aa8', bot: '#ffd0d8', tail: { t: 'fork', len: .32, span: .8, col: '#ff6f95' }, dors: { a: .25, b: .8, h: .3, col: '#c050d8', edge: '#9030b8', prof: 'long' }, anal: { a: .3, b: .6, h: .14, col: '#ff8aa8' }, pect: { len: .2, col: '#ffc0d0' }, eye: { u: .84, v: -.1, r: .08, iris: '#222' }, speed: 1.2 }
};
var PLAY = ['clown', 'tang', 'angel', 'yellow', 'butter', 'parrot', 'puffer', 'lion'];
var TYPES = PLAY.map(function (id) { return { id: id, en: SP[id].en, es: SP[id].es, color: SP[id].color }; }), BY = {};
Object.keys(SP).forEach(function (k) { BY[k] = SP[k]; });

/* ---------------- patterns (drawn in body space, clipped to the body) ---------------- */
function bandPath(c, F, uc, w, bulge, v0, v1) {
  var i, v, p, n = 14; c.beginPath();
  for (i = 0; i <= n; i++) { v = lerp(v0 == null ? -1.3 : v0, v1 == null ? 1.3 : v1, i / n); p = F.P(uc - w / 2 + (bulge || 0) * (1 - v * v), v); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }
  for (i = n; i >= 0; i--) { v = lerp(v0 == null ? -1.3 : v0, v1 == null ? 1.3 : v1, i / n); p = F.P(uc + w / 2 + (bulge || 0) * (1 - v * v), v); c.lineTo(p[0], p[1]); }
  c.closePath();
}
var PAT = {
  clown: function (c, F) {
    [[.835, .07, -.03], [.5, .12, .08], [.12, .07, 0]].forEach(function (b) {
      c.fillStyle = '#0c0c0c'; bandPath(c, F, b[0], b[1] + .05, b[2]); c.fill();
      c.fillStyle = '#f7f5ee'; bandPath(c, F, b[0], b[1], b[2]); c.fill();
    });
  },
  tang: function (c, F) {
    var pts = [[.74, -.2], [.58, -.62], [.34, -.6], [.14, -.1], [.1, .12]], i, p;
    c.strokeStyle = '#05061a'; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = F.H * .3; c.beginPath();
    for (i = 0; i < pts.length; i++) { p = F.P(pts[i][0], pts[i][1]); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke();
    c.lineWidth = F.H * .2; c.beginPath(); p = F.P(.58, -.55); c.moveTo(p[0], p[1]); p = F.P(.42, .25); c.lineTo(p[0], p[1]); p = F.P(.2, .22); c.lineTo(p[0], p[1]); c.stroke();
  },
  angel: function (c, F) {
    var r = F.R, i, j, p;
    F.scales(.42, .062, '#ffd23a', 1.2);
    c.fillStyle = rgba('#2a6fd8', .55); bandPath(c, F, .78, .16, -.04, -1.3, -.35); c.fill();
    p = F.P(.84, -.78); c.fillStyle = '#6fd8ff'; c.beginPath(); c.ellipse(p[0], p[1], F.H * .11, F.H * .07, -.4, 0, TAU); c.fill();
    c.strokeStyle = '#1b9fe8'; c.lineWidth = F.H * .03; c.stroke();
  },
  yellow: function (c, F) {
    F.scales(.14, .06, '#c89a00', 1);
    var p = F.P(.12, 0); c.fillStyle = '#f8f8f8'; c.beginPath(); c.ellipse(p[0], p[1], F.H * .025, F.H * .1, 0, 0, TAU); c.fill();
    c.fillStyle = rgba('#fff', .22); bandPath(c, F, .9, .16, -.05); c.fill();
  },
  butter: function (c, F) {
    c.fillStyle = '#ffd92a'; bandPath(c, F, .2, .5, .08); c.fill();
    c.strokeStyle = rgba('#d8a800', .35); c.lineWidth = F.H * .012; var i, k, a, b;
    for (i = 0; i < 14; i++) { for (k = -1; k <= 1; k += .22) { a = F.P(.1 + i * .06, k); b = F.P(.17 + i * .06, k + .12); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); } }
    c.fillStyle = '#0a0a0a'; bandPath(c, F, .84, .11, -.03); c.fill();
    c.fillStyle = '#fff'; bandPath(c, F, .735, .04, -.03); c.fill();
    c.fillStyle = '#0a0a0a'; bandPath(c, F, .135, .05, 0, -.5, .5); c.fill();
  },
  parrot: function (c, F) {
    F.scales(.34, .07, '#054a46', 1.3);
    c.fillStyle = rgba('#ff8fb0', .65); bandPath(c, F, .9, .24, -.05); c.fill();
    c.fillStyle = rgba('#ffb0c8', .55); bandPath(c, F, .5, .5, .1, .15, 1.3); c.fill();
    var p = F.P(.97, .2), q = F.P(.88, .35); c.strokeStyle = '#f4f0e0'; c.lineWidth = F.H * .05; c.beginPath(); c.moveTo(p[0], p[1] - F.H * .06); c.lineTo(q[0], q[1]); c.stroke();
  },
  puffer: function (c, F) {
    var r = F.R, i, p, rr; c.fillStyle = rgba('#3d2a10', .75);
    for (i = 0; i < 46; i++) { p = F.P(.12 + r() * .8, -.9 + r() * 1.35); rr = F.H * (.018 + r() * .03); c.beginPath(); c.arc(p[0], p[1], rr, 0, TAU); c.fill(); }
    F.scales(.1, .05, '#6a4a1c', 1);
  },
  lion: function (c, F) {
    var i; for (i = 0; i < 9; i++) { c.fillStyle = rgba('#7a1410', .92); bandPath(c, F, .1 + i * .1, .045, .02 * (i % 2 ? 1 : -1)); c.fill(); c.fillStyle = rgba('#b02a18', .8); bandPath(c, F, .15 + i * .1, .025, 0); c.fill(); }
    c.fillStyle = rgba('#7a1410', .9); bandPath(c, F, .92, .12, -.05); c.fill();
  },
  barra: function (c, F) {
    var i, p, q; c.fillStyle = rgba('#2c3e48', .35);
    for (i = 0; i < 12; i++) { bandPath(c, F, .12 + i * .045, .018, 0, -1.3, -.1); c.fill(); }
    p = F.P(.99, .55); q = F.P(.8, .42); c.strokeStyle = '#1c262c'; c.lineWidth = F.H * .06; c.beginPath(); c.moveTo(p[0], p[1] - F.H * .1); c.lineTo(q[0], q[1]); c.stroke();
    c.fillStyle = '#f6f6f0'; for (i = 0; i < 9; i++) { p = F.P(.96 - i * .016, .4 + i * .004); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] - F.H * .018, p[1] + F.H * .12); c.lineTo(p[0] - F.H * .036, p[1]); c.fill(); }
    F.scales(.08, .1, '#fff', 1);
  },
  shark: function (c, F) {
    var i, p, q; c.strokeStyle = rgba('#1e2c34', .55); c.lineWidth = F.H * .02;
    for (i = 0; i < 5; i++) { p = F.P(.74 - i * .018, -.2); q = F.P(.745 - i * .018, .28); c.beginPath(); c.moveTo(p[0], p[1]); c.quadraticCurveTo((p[0] + q[0]) / 2 - F.H * .05, (p[1] + q[1]) / 2, q[0], q[1]); c.stroke(); }
    p = F.P(.99, .3); q = F.P(.84, .33); c.strokeStyle = '#1e2c34'; c.lineWidth = F.H * .035; c.beginPath(); c.moveTo(p[0], p[1]); c.quadraticCurveTo((p[0] + q[0]) / 2, p[1] + F.H * .05, q[0], q[1]); c.stroke();
  },
  anth: function (c, F) { F.scales(.2, .08, '#b02060', 1); }
};

/* ---------------- one swim-cycle frame ---------------- */
function frame(id, W, Hh, ph) {
  var s = SP[id], cv = document.createElement('canvas'); cv.width = W; cv.height = Hh;
  var c = cv.getContext('2d'), L = s.L, H = s.H, N = 44, i, xs = [], tops = [], bots = [];
  var tl = s.tail.len, dh = Math.max(s.dors.h, s.anal.h), nose = s.nose || { w: .13, p: .5 };
  var k = min(W * .93 / (L * (1 + tl)), Hh * .92 / (H * (1 + s.dors.h + s.anal.h + (s.pect.fan ? .62 : .12))));
  
  var A = (id === 'puffer' ? .35 : 1) * .12 * H * (id === 'shark' || id === 'barra' ? 1.6 : 1);
  var R = rng(id.length * 977 + 13);
  c.translate(W / 2 + (tl * L / 2) * k, Hh / 2); c.scale(k, k);
  for (i = 0; i <= N; i++) {
    var u = i / N, sv = pow(sin(PI * pow(u, .7)), .8), hh = (s.pH * H / 2) * (1 - pow(u, 4)) + (H / 2 - s.pH * H / 2) * sv;
    if (u > 1 - nose.w) hh *= pow(max(0, (1 - u) / nose.w), nose.p);
    var yo = A * sin(ph - 4.2 * u) * pow(1 - u, 1.6) * 2;
    xs.push(-L / 2 + u * L); tops.push(yo - hh * (id === 'puffer' ? 1 : 1.04)); bots.push(yo + hh * (id === 'puffer' ? 1.12 : .96));
  }
  function ix(a, u) { var f = u * N, i0 = max(0, min(N - 1, Math.floor(f))), t = f - i0; return lerp(a[i0], a[i0 + 1], t); }
  var F = { H: H, L: L, R: R, P: function (u, v) { u = max(0, min(1, u)); var t = ix(tops, u), b = ix(bots, u); return [ix(xs, u), lerp(t, b, (v + 1) / 2)]; } };
  F.scales = function (alpha, size, col, rows) {
    var r, u, v, p, sz = size * H; c.lineWidth = sz * .12; c.strokeStyle = rgba(col || '#000', alpha);
    for (r = -.9; r <= .95; r += size * 2.1 / (1)) { for (u = .08 + (Math.round(r / (size * 2.1)) % 2 ? sz / L * .5 : 0); u < .97; u += sz / L * 1.25) { p = F.P(u, r); c.beginPath(); c.arc(p[0], p[1], sz * .62, -PI / 2.1, PI / 2.1); c.stroke(); } }
  };
  function bodyPath() {
    c.beginPath(); c.moveTo(xs[0], tops[0]);
    for (i = 1; i <= N; i++) c.lineTo(xs[i], tops[i]);
    c.quadraticCurveTo(xs[N] + L * .012, (tops[N] + bots[N]) / 2, xs[N], bots[N]);
    for (i = N - 1; i >= 0; i--) c.lineTo(xs[i], bots[i]);
    c.closePath();
  }
  function finRays(base, apex, col) {
    c.strokeStyle = rgba(col, .3); c.lineWidth = .8; for (var j = 0; j < base.length; j++) { c.beginPath(); c.moveTo(base[j][0], base[j][1]); c.lineTo(apex[j][0], apex[j][1]); c.stroke(); }
  }
  function fin(f, dir) {
    var n = 16, base = [], apex = [], j, q, u, pf, p0, top = dir < 0;
    for (j = 0; j <= n; j++) {
      q = j / n; u = f.a + (f.b - f.a) * q;
      pf = f.prof === 'long' ? (q < .12 ? q / .12 : 1 - .55 * (q - .12) / .88) : f.prof === 'sweep' ? (q < .3 ? q / .3 : 1 - .1 * (q - .3)) : f.prof === 'tri' ? (q < .15 ? q / .15 * .9 : .9 * (1 - (q - .15) / .85 * .96)) : f.prof === 'spines' ? 1 - .35 * Math.abs(q - .35) : sin(PI * pow(q, .8));
      p0 = F.P(u, top ? -.98 : .98); base.push(p0);
      apex.push([p0[0] - (f.sweep || 0) * L * q * pf * .6 - (f.prof === 'tri' ? L * .1 * q : 0), p0[1] + dir * f.h * H * pf]);
    }
    var gy = apex[Math.floor(n / 3)][1], g = c.createLinearGradient(0, base[0][1], 0, gy);
    g.addColorStop(0, rgba(f.col, .95)); g.addColorStop(1, rgba(f.col, f.prof === 'spines' ? .35 : .55));
    if (f.prof === 'spines') {
      for (j = 0; j <= n; j += 1) { c.strokeStyle = rgba(f.edge || '#444', .85); c.lineWidth = 1.3; c.beginPath(); c.moveTo(base[j][0], base[j][1]); c.lineTo(apex[j][0] - 3, apex[j][1]); c.stroke(); }
      c.fillStyle = rgba(f.col, .45); c.beginPath(); c.moveTo(base[0][0], base[0][1]); for (j = 0; j <= n; j++) c.lineTo(base[j][0] + (apex[j][0] - base[j][0]) * .5, base[j][1] + (apex[j][1] - base[j][1]) * .55); for (j = n; j >= 0; j--) c.lineTo(base[j][0], base[j][1]); c.fill();
      return;
    }
    c.fillStyle = g; c.beginPath(); c.moveTo(base[0][0], base[0][1]); for (j = 0; j <= n; j++) c.lineTo(apex[j][0], apex[j][1]); for (j = n; j >= 0; j--) c.lineTo(base[j][0], base[j][1]); c.closePath(); c.fill();
    finRays(base, apex, f.edge || '#000');
    if (f.edge) { c.strokeStyle = rgba(f.edge, .75); c.lineWidth = 1.6; c.beginPath(); for (j = 0; j <= n; j++) j ? c.lineTo(apex[j][0], apex[j][1]) : c.moveTo(apex[j][0], apex[j][1]); c.stroke(); }
  }
  function tail() {
    var t = s.tail, x0 = xs[0], ya = tops[0], yb = bots[0], cy = (ya + yb) / 2, len = t.len * L, sp = t.span * H / 2, sw = sin(ph - 4.2 * -.05 + .5) * H * .22 * (id === 'shark' ? 1.2 : 1), g;
    function tp() { c.beginPath(); c.moveTo(x0 + 2, ya);
    if (t.t === 'fork') { c.bezierCurveTo(x0 - len * .5, ya - sp * .3, x0 - len * .9, cy - sp + sw * .8, x0 - len, cy - sp + sw); c.quadraticCurveTo(x0 - len * .55, cy + sw * .5, x0 - len, cy + sp + sw); c.bezierCurveTo(x0 - len * .9, cy + sp + sw * .8, x0 - len * .5, yb + sp * .3, x0 + 2, yb); }
    else if (t.t === 'lunate') { c.bezierCurveTo(x0 - len * .4, ya - sp * .5, x0 - len * .8, cy - sp + sw * .8, x0 - len * 1.05, cy - sp * 1.05 + sw); c.quadraticCurveTo(x0 - len * .5, cy + sw * .5, x0 - len * 1.05, cy + sp * 1.05 + sw); c.bezierCurveTo(x0 - len * .8, cy + sp + sw * .8, x0 - len * .4, yb + sp * .5, x0 + 2, yb); }
    else if (t.t === 'shark') { c.bezierCurveTo(x0 - len * .3, ya - sp * .3, x0 - len * .7, cy - sp * .8 + sw, x0 - len * 1.1, cy - sp * .98 + sw); c.quadraticCurveTo(x0 - len * .55, cy - sp * .15 + sw * .6, x0 - len * .5, cy + sw * .4); c.quadraticCurveTo(x0 - len * .6, cy + sp * .3 + sw, x0 - len * .85, cy + sp * .42 + sw); c.bezierCurveTo(x0 - len * .5, yb + sp * .1, x0 - len * .2, yb, x0 + 2, yb); }
    else { c.bezierCurveTo(x0 - len * .5, ya - sp * .5, x0 - len * 1.05, cy - sp + sw * .8, x0 - len, cy + sw); c.bezierCurveTo(x0 - len * 1.05, cy + sp + sw * .8, x0 - len * .5, yb + sp * .5, x0 + 2, yb); }
    c.closePath(); } tp(); g = c.createLinearGradient(x0, 0, x0 - len, 0); g.addColorStop(0, rgba(t.col, 1)); g.addColorStop(1, rgba(t.col, .62)); c.fillStyle = g; c.fill();
    c.save(); c.clip(); c.strokeStyle = rgba(t.edge || '#000', .22); c.lineWidth = .9;
    for (var j = -5; j <= 5; j++) { c.beginPath(); c.moveTo(x0, cy); c.lineTo(x0 - len * 1.1, cy + sw + j * sp * .22); c.stroke(); } c.restore();
    if (t.edge) { tp(); c.strokeStyle = rgba(t.edge, .85); c.lineWidth = 2; c.stroke(); }
  }
  function pect() {
    var f = s.pect, b = F.P(.7, .12), a = -.55 + .45 * sin(ph * 2 + 1), len = f.len * L, j, n, tip;
    if (f.fan) {
      n = 11; c.save(); c.translate(b[0], b[1]);
      for (j = 0; j < n; j++) { var an = a * .5 + .35 + (j / (n - 1)) * 1.55 + .1 * sin(ph * 2 + j * .5); tip = [-cos(an) * len, sin(an) * len * .9]; c.strokeStyle = rgba(f.edge, .9); c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, 0); c.lineTo(tip[0], tip[1]); c.stroke();
        if (j) { var an0 = a * .5 + .35 + ((j - 1) / (n - 1)) * 1.55 + .1 * sin(ph * 2 + (j - 1) * .5); c.fillStyle = rgba(j % 2 ? '#e8d6b4' : '#c4482c', .5); c.beginPath(); c.moveTo(0, 0); c.lineTo(-cos(an0) * len * .96, sin(an0) * len * .86); c.lineTo(tip[0] * .96, tip[1] * .96); c.closePath(); c.fill(); } }
      c.restore(); return;
    }
    c.save(); c.translate(b[0], b[1]); c.rotate(a); var g = c.createLinearGradient(0, 0, -len, 0); g.addColorStop(0, rgba(f.col, .95)); g.addColorStop(1, rgba(f.col, .45));
    c.fillStyle = g; c.beginPath(); c.moveTo(0, -H * .035); c.quadraticCurveTo(-len * .5, -H * .17, -len, -H * .05); c.quadraticCurveTo(-len * .75, H * .1, 0, H * .035); c.closePath(); c.fill();
    c.strokeStyle = rgba(f.edge || '#000', .3); c.lineWidth = .8; for (j = -2; j <= 2; j++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(-len * .95, j * H * .025); c.stroke(); } c.restore();
  }
  /* back fins, tail, body */
  tail(); fin(s.dors, -1); fin(s.anal, 1);
  var topY = Math.min.apply(null, tops), botY = Math.max.apply(null, bots), g = c.createLinearGradient(0, topY, 0, botY);
  g.addColorStop(0, s.top); g.addColorStop(.45, s.mid); g.addColorStop(1, s.bot);
  bodyPath(); c.fillStyle = g; c.fill();
  c.save(); bodyPath(); c.clip();
  if (PAT[id]) PAT[id](c, F); else F.scales(.12, .06, '#000', 1);
  if (id !== 'tang' && id !== 'clown' && id !== 'lion') F.scales(.09, .055, '#000', 1);
  var lg = c.createLinearGradient(0, topY, 0, botY); lg.addColorStop(0, 'rgba(255,255,255,.34)'); lg.addColorStop(.32, 'rgba(255,255,255,.04)'); lg.addColorStop(.6, 'rgba(0,10,40,0)'); lg.addColorStop(1, 'rgba(0,12,48,.36)');
  c.fillStyle = lg; c.fillRect(-L, topY - 2, L * 2, botY - topY + 4);
  var p1 = F.P(.3, -.55), p2 = F.P(.86, -.4), sg = c.createLinearGradient(p1[0], 0, p2[0], 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.32)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = sg; c.beginPath(); c.moveTo(p1[0], p1[1]); c.quadraticCurveTo((p1[0] + p2[0]) / 2, p1[1] - H * .12, p2[0], p2[1]); c.quadraticCurveTo((p1[0] + p2[0]) / 2, p1[1] + H * .02, p1[0], p1[1] + H * .06); c.fill();
  c.restore();
  bodyPath(); c.strokeStyle = rgba('#000', .28); c.lineWidth = 1.3; c.stroke();
  /* gill + mouth + eye */
  var gp = F.P(.74, -.7), gq = F.P(.74, .55); c.strokeStyle = rgba('#000', .3); c.lineWidth = H * .016; c.beginPath(); c.moveTo(gp[0], gp[1]); c.quadraticCurveTo(gp[0] - H * .09, (gp[1] + gq[1]) / 2, gq[0], gq[1]); c.stroke();
  var mo = F.P(.985, .22); c.strokeStyle = rgba('#000', .45); c.lineWidth = H * .02; c.beginPath(); c.moveTo(mo[0], mo[1]); c.quadraticCurveTo(mo[0] - H * .06, mo[1] + H * .05, mo[0] - H * .12, mo[1] + H * .03); c.stroke();
  pect();
  var e = s.eye, ep = F.P(e.u, e.v), er = e.r * H;
  c.fillStyle = rgba('#000', .55); c.beginPath(); c.arc(ep[0], ep[1], er * 1.18, 0, TAU); c.fill();
  var ig = c.createRadialGradient(ep[0] - er * .2, ep[1] - er * .2, er * .1, ep[0], ep[1], er); ig.addColorStop(0, sh(e.iris, .5)); ig.addColorStop(.7, e.iris); ig.addColorStop(1, sh(e.iris, -.5));
  c.fillStyle = ig; c.beginPath(); c.arc(ep[0], ep[1], er, 0, TAU); c.fill();
  c.fillStyle = '#05080c'; c.beginPath(); c.arc(ep[0] + er * .06, ep[1], er * .55, 0, TAU); c.fill();
  c.fillStyle = 'rgba(255,255,255,.92)'; c.beginPath(); c.arc(ep[0] - er * .3, ep[1] - er * .32, er * .24, 0, TAU); c.fill();
  c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.arc(ep[0] + er * .3, ep[1] + er * .3, er * .12, 0, TAU); c.fill();
  return cv;
}

/* manta ray, seen from below */
function mantaFrame(W, Hh, ph) {
  var cv = document.createElement('canvas'); cv.width = W; cv.height = Hh; var c = cv.getContext('2d'), L = W * .46, fl = sin(ph), w = Hh * .46, s, g;
  c.translate(W * .52, Hh / 2);
  function wing(sg) {
    var tipx = -L * .12, tipy = sg * w * (1 - .12 * Math.abs(fl)) , lift = -fl * w * .22;
    c.beginPath(); c.moveTo(L * .48, sg * L * .04);
    c.bezierCurveTo(L * .3, sg * w * .3 + lift * .3, L * .05, sg * w * .75 + lift * .7, tipx, tipy + lift);
    c.bezierCurveTo(-L * .05, sg * w * .55 + lift * .4, -L * .3, sg * w * .25, -L * .38, sg * L * .03); c.lineTo(L * .1, sg * L * .01); c.closePath();
  }
  s = 1; wing(1); g = c.createLinearGradient(0, 0, 0, w); g.addColorStop(0, '#f4f7f8'); g.addColorStop(.7, '#bcc8cf'); g.addColorStop(1, '#25323c'); c.fillStyle = g; c.fill();
  wing(-1); g = c.createLinearGradient(0, 0, 0, -w); g.addColorStop(0, '#f4f7f8'); g.addColorStop(.7, '#bcc8cf'); g.addColorStop(1, '#25323c'); c.fillStyle = g; c.fill();
  c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(L * .1, 0, L * .36, w * .17, 0, 0, TAU); c.fill();
  c.strokeStyle = '#1c2832'; c.lineWidth = Hh * .012; c.beginPath(); c.moveTo(-L * .3, 0); c.quadraticCurveTo(-L * .7, fl * Hh * .03, -L * .95, fl * Hh * .06); c.stroke();
  c.strokeStyle = 'rgba(30,40,50,.5)'; c.lineWidth = Hh * .009; for (var i = 0; i < 5; i++) { c.beginPath(); c.moveTo(L * (.1 - i * .05), -w * .1); c.lineTo(L * (.1 - i * .05) - L * .01, -w * .04); c.moveTo(L * (.1 - i * .05), w * .1); c.lineTo(L * (.1 - i * .05) - L * .01, w * .04); c.stroke(); }
  c.fillStyle = '#26333c'; c.beginPath(); c.ellipse(L * .42, 0, L * .035, Hh * .035, 0, 0, TAU); c.fill();
  c.fillStyle = '#2a3944'; c.beginPath(); c.moveTo(L * .5, -Hh * .03); c.lineTo(L * .62, -Hh * .07); c.lineTo(L * .52, -Hh * .01); c.moveTo(L * .5, Hh * .03); c.lineTo(L * .62, Hh * .07); c.lineTo(L * .52, Hh * .01); c.fill();
  return cv;
}

/* ---------------- frame cache / sprite swap ---------------- */
var cache = {}, SPR = root.REEF2_SPRITES || {};
function frames(id, res, n) {
  var key = id + ':' + res; if (cache[key]) return cache[key];
  var out = [], W = res, Hh = Math.round(res * (id === 'manta' ? .62 : .62)), i;
  n = n || 12;
  for (i = 0; i < n; i++) out.push(id === 'manta' ? mantaFrame(W, Hh, i / n * TAU) : frame(id, W, Hh, i / n * TAU));
  cache[key] = out; return out;
}
/* draw a species at (0,0) facing +x; width in world units = w */
function draw(c, id, t, w, o) {
  o = o || {}; var res = o.res || 300, f = frames(id, res), n = f.length, ph = (((t * (o.sp || 1.6)) % 1) + 1) % 1, im = f[Math.floor(ph * n) % n];
  c.drawImage(im, -w / 2, -w * im.height / im.width / 2, w, w * im.height / im.width);
}
/* phone / picker avatar */
function avatar(cv, id, t, o) {
  o = o || {}; var r = cv.getBoundingClientRect(), dpr = Math.min(2, root.devicePixelRatio || 1), W = Math.max(40, Math.round(r.width * dpr)), Hh = Math.max(40, Math.round(r.height * dpr));
  if (cv.width !== W || cv.height !== Hh) { cv.width = W; cv.height = Hh; }
  var c = cv.getContext('2d'); c.clearRect(0, 0, W, Hh);
  var f = frames(id, 200, 10), ph = (((t * (o.sp || .5)) % 1) + 1) % 1, im = f[Math.floor(ph * f.length) % f.length], sc = min(W / im.width, Hh / im.height) * .92;
  c.save(); c.translate(W / 2, Hh / 2 + sin(t * 1.6) * Hh * .015); c.drawImage(im, -im.width * sc / 2, -im.height * sc / 2, im.width * sc, im.height * sc); c.restore();
}
root.ReefArt = { types: TYPES, by: BY, SP: SP, PLAY: PLAY, frames: frames, draw: draw, avatar: avatar, rgba: rgba, sh: sh };
})(window);
