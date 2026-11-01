/* Elettro Reef — cartoon sea creatures drawn with plain canvas paths.
   Shared by reef.html (big screen), play.html (phone) and the one-sheet.
   Every creature is drawn facing RIGHT, centered near (0,0), roughly 100–150 units wide. */
(function (root) {
  'use strict';
  var TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos, PI = Math.PI;
  var OUT = 'rgba(28,18,92,.55)';

  /* ---------- helpers ---------- */
  function ell(c, x, y, rx, ry, rot) { c.beginPath(); c.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot || 0, 0, TAU); }
  function fs(c, fill, lw) {
    c.fillStyle = fill; c.fill();
    if (lw !== 0) { c.lineWidth = lw || 3; c.strokeStyle = OUT; c.lineJoin = 'round'; c.stroke(); }
  }
  function lg(c, x0, y0, x1, y1, stops) {
    var g = c.createLinearGradient(x0, y0, x1, y1);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }
  function rg(c, x, y, r0, r1, stops) {
    var g = c.createRadialGradient(x, y, r0, x, y, r1);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }
  function eye(c, x, y, r, look) {
    look = look || 0;
    c.fillStyle = '#fff'; ell(c, x, y, r, r * 1.05); c.fill();
    c.lineWidth = 2; c.strokeStyle = OUT; c.stroke();
    c.fillStyle = '#1b1238'; ell(c, x + r * (0.25 + look * 0.2), y + r * 0.05, r * 0.62, r * 0.68); c.fill();
    c.fillStyle = '#fff'; ell(c, x + r * (0.42 + look * 0.2), y - r * 0.22, r * 0.24, r * 0.24); c.fill();
  }
  function smile(c, x, y, r, w) {
    c.strokeStyle = '#4a1d34'; c.lineWidth = w || 2.4; c.lineCap = 'round';
    c.beginPath(); c.arc(x, y, r, 0.12 * PI, 0.88 * PI); c.stroke();
  }
  function blush(c, x, y, r) { c.fillStyle = 'rgba(255,80,140,.38)'; ell(c, x, y, r, r * 0.65); c.fill(); }

  /* tapered ribbon along a polyline; w0 may be a function(s) -> width */
  function ribbon(c, pts, w0, w1, fill, lw) {
    var n = pts.length, L = [], R = [], i;
    for (i = 0; i < n; i++) {
      var p = pts[i], q = pts[Math.min(n - 1, i + 1)], o = pts[Math.max(0, i - 1)];
      var dx = q[0] - o[0], dy = q[1] - o[1], d = Math.hypot(dx, dy) || 1;
      var nx = -dy / d, ny = dx / d, s = i / (n - 1);
      var w = (typeof w0 === 'function' ? w0(s) : w0 + (w1 - w0) * s) / 2;
      L.push([p[0] + nx * w, p[1] + ny * w]); R.push([p[0] - nx * w, p[1] - ny * w]);
    }
    c.beginPath(); c.moveTo(L[0][0], L[0][1]);
    for (i = 1; i < n; i++) c.lineTo(L[i][0], L[i][1]);
    for (i = n - 1; i >= 0; i--) c.lineTo(R[i][0], R[i][1]);
    c.closePath();
    if (fill) fs(c, fill, lw);
  }

  /* ---------- the eight buddies ---------- */
  function clown(c, t, o) {
    var sp = o.sp || 0, f = sin(t * (5 + sp * 9)) * (0.22 + sp * 0.18);
    c.beginPath(); c.moveTo(-26, -26); c.bezierCurveTo(-24, -54, 4, -58, 26, -28); c.closePath(); fs(c, '#ff6a00');
    c.save(); c.translate(-44, 0); c.rotate(f);
    c.beginPath(); c.moveTo(8, -5); c.bezierCurveTo(-8, -10, -26, -32, -40, -30); c.quadraticCurveTo(-30, -8, -30, 0);
    c.quadraticCurveTo(-30, 8, -40, 30); c.bezierCurveTo(-26, 32, -8, 10, 8, 5); c.closePath(); fs(c, '#ff7a12');
    c.restore();
    c.beginPath(); c.ellipse(0, 0, 52, 34, 0, 0, TAU);
    c.fillStyle = lg(c, 0, -34, 0, 34, [[0, '#ffb347'], [0.35, '#ff8a1f'], [1, '#ff5f00']]); c.fill();
    c.save(); c.clip();
    [[18, 11], [-16, 12], [-42, 9]].forEach(function (s) {
      c.lineCap = 'butt';
      c.strokeStyle = '#2a1030'; c.lineWidth = s[1] + 5; c.beginPath(); c.moveTo(s[0] - 2, -42); c.quadraticCurveTo(s[0] + 9, 0, s[0] - 2, 42); c.stroke();
      c.strokeStyle = '#fff'; c.lineWidth = s[1]; c.stroke();
    });
    c.restore();
    c.beginPath(); c.ellipse(0, 0, 52, 34, 0, 0, TAU); c.lineWidth = 3; c.strokeStyle = OUT; c.stroke();
    c.save(); c.translate(8, 10); c.rotate(0.4 + sin(t * (6 + sp * 8)) * 0.35);
    ell(c, -8, 6, 16, 8, 0.3); fs(c, '#ff8a1f', 2.5); c.restore();
    eye(c, 33, -8, 8.5); smile(c, 44, 8, 7, 2.2); blush(c, 30, 13, 6);
  }

  function angel(c, t, o) {
    var sp = o.sp || 0, f = sin(t * (4 + sp * 8)) * (0.2 + sp * 0.15), w = sin(t * 3) * 4;
    c.beginPath(); c.moveTo(14, -40); c.bezierCurveTo(10, -56, -16, -72 + w, -54, -72 + w); c.bezierCurveTo(-40, -56, -30, -40, -24, -26); c.closePath(); fs(c, 'rgba(120,96,255,.92)');
    c.beginPath(); c.moveTo(14, 40); c.bezierCurveTo(10, 56, -16, 72 - w, -54, 72 - w); c.bezierCurveTo(-40, 56, -30, 40, -24, 26); c.closePath(); fs(c, 'rgba(120,96,255,.92)');
    c.save(); c.translate(-38, 0); c.rotate(f);
    c.beginPath(); c.moveTo(8, -5); c.bezierCurveTo(-8, -12, -22, -32, -34, -30); c.quadraticCurveTo(-24, -6, -26, 0);
    c.quadraticCurveTo(-24, 6, -34, 30); c.bezierCurveTo(-22, 32, -8, 12, 8, 5); c.closePath(); fs(c, 'rgba(255,196,60,.95)');
    c.restore();
    var body = function () {
      c.beginPath(); c.moveTo(48, 2); c.bezierCurveTo(42, -24, 24, -46, 4, -46); c.bezierCurveTo(-16, -44, -34, -16, -40, -6);
      c.lineTo(-40, 6); c.bezierCurveTo(-34, 16, -16, 44, 4, 46); c.bezierCurveTo(24, 46, 42, 24, 48, 2); c.closePath();
    };
    body(); c.fillStyle = lg(c, 0, -46, 0, 46, [[0, '#ffe45c'], [0.5, '#ffc933'], [1, '#ff9f1c']]); c.fill();
    c.save(); body(); c.clip();
    c.strokeStyle = '#5a4bff'; c.lineWidth = 10; c.lineCap = 'butt';
    [24, 3, -18, -36].forEach(function (x) { c.beginPath(); c.moveTo(x + 6, -52); c.quadraticCurveTo(x - 6, 0, x + 6, 52); c.stroke(); });
    c.restore();
    body(); c.lineWidth = 3; c.strokeStyle = OUT; c.stroke();
    c.save(); c.translate(6, 8); c.rotate(0.5 + sin(t * 7) * 0.3); ell(c, -6, 5, 14, 7, 0.3); fs(c, 'rgba(120,96,255,.95)', 2.5); c.restore();
    eye(c, 32, -9, 8.2); smile(c, 43, 5, 6, 2.2); blush(c, 29, 10, 6);
  }

  function puffer(c, t, o) {
    var sp = o.sp || 0, p = o.puff || 0, r = 40 * (1 + 0.32 * p), wob = sin(t * 3) * 0.04;
    var n = 12, i, a, len = 4 + 16 * p;
    c.fillStyle = '#e8892b';
    for (i = 0; i < n; i++) {
      a = i * TAU / n + 0.2;
      if (cos(a) > 0.75) continue;                    // keep the face clear
      var bx = cos(a) * r, by = sin(a) * r;
      c.beginPath(); c.moveTo(cos(a - 0.2) * (r - 3), sin(a - 0.2) * (r - 3));
      c.lineTo(cos(a) * (r + len), sin(a) * (r + len)); c.lineTo(cos(a + 0.2) * (r - 3), sin(a + 0.2) * (r - 3)); c.closePath(); c.fill();
    }
    c.save(); c.translate(-r + 2, 0); c.rotate(sin(t * (6 + sp * 8)) * 0.35);
    c.beginPath(); c.moveTo(4, -6); c.bezierCurveTo(-8, -8, -20, -22, -26, -18); c.quadraticCurveTo(-20, 0, -26, 18); c.bezierCurveTo(-20, 22, -8, 8, 4, 6); c.closePath(); fs(c, '#ffb347');
    c.restore();
    c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fillStyle = rg(c, 6, -10, 4, r * 1.1, [[0, '#fff0a8'], [0.55, '#ffd25a'], [1, '#ffab33']]); c.fill();
    c.save(); c.clip();
    c.fillStyle = 'rgba(255,248,224,.95)'; ell(c, 4, r * 0.85, r * 0.95, r * 0.5); c.fill();
    c.fillStyle = 'rgba(224,120,30,.55)';
    [[-14, -18, 4], [-4, -26, 3.2], [-26, -4, 3.4], [-18, 8, 3], [6, -12, 3]].forEach(function (d) { ell(c, d[0] * r / 40, d[1] * r / 40, d[2], d[2]); c.fill(); });
    c.restore();
    c.beginPath(); c.arc(0, 0, r, 0, TAU); c.lineWidth = 3; c.strokeStyle = OUT; c.stroke();
    c.save(); c.translate(2, r * 0.18); c.rotate(sin(t * (9 + sp * 10)) * 0.5); ell(c, -2, 4, 11, 6, 0.2); fs(c, '#ffb347', 2.2); c.restore();
    var ex = r * 0.46, ey = -r * 0.2; eye(c, ex, ey, 10.5 + 2 * p);
    ell(c, r * 0.9, r * 0.2, 4.5, 3.6 + p * 1.5); fs(c, '#d9506b', 2);
    blush(c, r * 0.5, r * 0.3, 7);
  }

  function seahorse(c, t, o) {
    var sp = o.sp || 0, wave = sin(t * (3 + sp * 4));
    var sp1 = [], i, s;
    for (i = 0; i <= 14; i++) {
      s = i / 14;
      sp1.push([-3 + 11 * sin(s * PI * 0.95) + 3 * sin(t * 2 + s * 3), -34 + s * 62]);
    }
    for (i = 1; i <= 16; i++) {
      var u = i / 16, a = PI - u * PI * 1.62, rr = 17 - 12 * u;
      sp1.push([12 + cos(a) * rr + 0, 28 + sin(a) * rr]);
    }
    c.save(); c.translate(-14, -2); c.rotate(wave * 0.35);
    ell(c, -4, 0, 12, 16, -0.4); c.restore();
    var fin = function () { c.save(); c.translate(-10, -6); c.rotate(wave * 0.4); c.beginPath(); c.moveTo(0, -12); c.bezierCurveTo(-22, -14, -26, 14, 0, 14); c.closePath(); fs(c, 'rgba(255,214,90,.95)', 2.5); c.restore(); };
    fin();
    ribbon(c, sp1, function (s) { var k = s < 0.47 ? s / 0.47 : 1; return s < 0.47 ? 20 + 18 * sin(k * PI * 0.7) : 17 - 12 * ((s - 0.47) / 0.53); }, 0, null);
    c.fillStyle = lg(c, -20, 0, 26, 0, [[0, '#ff4fa3'], [1, '#ff8ac8']]); c.fill(); c.lineWidth = 3; c.strokeStyle = OUT; c.lineJoin = 'round'; c.stroke();
    c.strokeStyle = 'rgba(255,230,120,.95)'; c.lineWidth = 2.6; c.lineCap = 'round';
    for (i = 0; i < 5; i++) { var py = -14 + i * 9, pp = sp1[Math.round((py + 34) / 62 * 14)]; if (!pp) continue; c.beginPath(); c.moveTo(pp[0] - 7, py); c.quadraticCurveTo(pp[0] + 4, py + 4, pp[0] + 12, py - 1); c.stroke(); }
    c.save(); c.translate(6, -40);
    c.fillStyle = '#ffd95a'; [[-10, -14, -0.5], [-2, -17, 0], [6, -14, 0.5]].forEach(function (d) { ell(c, d[0], d[1], 4, 7, d[2]); fs(c, '#ffd95a', 2); });
    ell(c, 0, 0, 19, 17, -0.15); fs(c, lg(c, -10, -16, 14, 16, [[0, '#ff6cb4'], [1, '#ff3d96']]));
    ribbon(c, [[12, -2], [26, 0], [38, 2]], 15, 10, '#ff5aa6', 3);
    ell(c, 38, 2, 4.6, 5.2); fs(c, '#ff5aa6', 3);
    c.fillStyle = '#ff5aa6'; ell(c, 36, 2, 4, 4.4); c.fill();
    smile(c, 30, 5, 3, 1.8);
    eye(c, 6, -5, 6.2); blush(c, 8, 8, 5);
    c.restore();
  }

  function turtle(c, t, o) {
    var sp = o.sp || 0, fl = sin(t * (3 + sp * 5)) * 0.6;
    c.save(); c.translate(-30, 16); c.rotate(-fl * 0.5 + 0.5); ell(c, -10, 2, 18, 7, 0); fs(c, '#4cc27f', 2.5); c.restore();
    ell(c, -54, 6, 9, 5); fs(c, '#4cc27f', 2.5);
    ell(c, 44, -2, 16, 12, -0.25); fs(c, '#58cf86', 3);
    ell(c, 58, -6, 17, 16, 0); fs(c, lg(c, 46, -22, 70, 10, [[0, '#8be8a3'], [1, '#43bd78']]));
    smile(c, 62, -1, 7, 2.2); eye(c, 63, -13, 7); blush(c, 54, 0, 5);
    c.beginPath(); c.moveTo(-50, 8); c.bezierCurveTo(-52, -42, 46, -44, 50, 8); c.closePath();
    c.fillStyle = lg(c, 0, -40, 0, 10, [[0, '#46d28b'], [1, '#1e8f57']]); c.fill();
    c.save(); c.clip();
    c.strokeStyle = 'rgba(210,255,225,.8)'; c.lineWidth = 2.5; c.fillStyle = 'rgba(160,240,190,.45)';
    [[0, -22, 14], [-27, -13, 12], [27, -13, 12], [-11, -37, 10], [14, -37, 10]].forEach(function (h) {
      c.beginPath(); for (var k = 0; k < 6; k++) { var a = k * TAU / 6 + 0.52; c.lineTo(h[0] + cos(a) * h[2], h[1] + sin(a) * h[2]); } c.closePath(); c.fill(); c.stroke();
    });
    c.restore();
    c.beginPath(); c.moveTo(-50, 8); c.bezierCurveTo(-52, -42, 46, -44, 50, 8); c.closePath(); c.lineWidth = 3; c.strokeStyle = OUT; c.stroke();
    ell(c, 0, 9, 52, 9); fs(c, '#ffe9b0', 3);
    c.save(); c.translate(16, 6); c.rotate(0.9 + fl); ell(c, 14, 0, 28, 8.5, 0); fs(c, '#58cf86', 3); c.restore();
  }

  function octopus(c, t, o) {
    var sp = o.sp || 0, lean = o.lean == null ? 0.7 : o.lean, k, i;
    for (k = 0; k < 8; k++) {
      var bx = -28 + k * 8, len = 58 + (k % 2) * 10, pts = [];
      for (i = 0; i <= 11; i++) {
        var s = i / 11;
        pts.push([bx + (-s * s * 30 * lean) + sin(t * 3.4 + k * 0.9 - s * 3.2) * (3 + 11 * s) * (0.6 + sp * 0.5), 16 + s * len + cos(t * 2 + k) * 2 * s]);
      }
      ribbon(c, pts, 12, 2.5, '#9a4df2', 2.6);
      c.fillStyle = 'rgba(255,200,240,.85)';
      for (i = 2; i < 10; i += 2) { ell(c, pts[i][0], pts[i][1], 1.8, 1.8); c.fill(); }
    }
    ell(c, 0, -8, 38, 40, 0); fs(c, rg(c, -10, -26, 4, 54, [[0, '#d39bff'], [0.6, '#a65bf5'], [1, '#7a35d6']]));
    c.fillStyle = 'rgba(255,255,255,.22)'; [[-16, -30, 4.5], [14, -34, 3.6], [24, -18, 3], [-26, -14, 3.2], [2, -40, 3]].forEach(function (d) { ell(c, d[0], d[1], d[2], d[2]); c.fill(); });
    eye(c, -13, -6, 10.5); eye(c, 13, -6, 10.5); smile(c, 0, 8, 7.5, 2.4); blush(c, -25, 8, 7); blush(c, 25, 8, 7);
  }

  function jelly(c, t, o) {
    var pulse = sin(t * 3.2), rx = 40 * (1 + 0.07 * pulse), ry = 32 * (1 - 0.12 * pulse), i, k;
    if (!o.noglow) { c.fillStyle = rg(c, 0, -10, 6, 100, [[0, 'rgba(255,150,230,.55)'], [1, 'rgba(255,150,230,0)']]); c.beginPath(); c.arc(0, -10, 100, 0, TAU); c.fill(); }
    for (k = 0; k < 6; k++) {
      var bx = -24 + k * 9.6, pts = [];
      for (i = 0; i <= 12; i++) { var s = i / 12; pts.push([bx + sin(t * 2.6 + k * 1.3 - s * 4.5) * (3 + 8 * s) - pulse * 2 * s, 10 + s * (62 + (k % 2) * 14) + pulse * 4 * s]); }
      ribbon(c, pts, 4.5, 1.2, 'rgba(255,170,238,.85)', 0);
    }
    for (k = 0; k < 3; k++) {
      var ox = -12 + k * 12, op = [];
      for (i = 0; i <= 10; i++) { var u = i / 10; op.push([ox + sin(t * 2.2 + k * 2 - u * 3.5) * (3 + 7 * u), 12 + u * 44]); }
      ribbon(c, op, 11, 4, 'rgba(255,125,220,.8)', 2);
    }
    c.beginPath(); c.moveTo(-rx, 4);
    c.bezierCurveTo(-rx, -ry * 1.7, rx, -ry * 1.7, rx, 4);
    for (i = 0; i < 6; i++) { var x0 = rx - i * (rx * 2 / 6), x1 = x0 - rx / 3; c.quadraticCurveTo(x0 - rx / 6, 14 + (i % 2) * 2, x1, 4); }
    c.closePath();
    c.fillStyle = rg(c, -8, -ry * 0.9, 4, rx * 1.5, [[0, 'rgba(255,205,245,.95)'], [0.55, 'rgba(255,128,214,.9)'], [1, 'rgba(150,100,255,.88)']]); c.fill();
    c.lineWidth = 3; c.strokeStyle = 'rgba(120,40,160,.55)'; c.lineJoin = 'round'; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.35)'; ell(c, -14, -ry * 1.05, 11, 5, -0.5); c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)'; [[14, -ry * 0.9, 3.4], [22, -ry * 0.5, 2.6], [-24, -ry * 0.5, 2.8]].forEach(function (d) { ell(c, d[0], d[1], d[2], d[2]); c.fill(); });
    eye(c, -11, -ry * 0.35, 6.6); eye(c, 11, -ry * 0.35, 6.6); smile(c, 0, -ry * 0.05, 5.5, 2.2); blush(c, -22, -ry * 0.1, 5); blush(c, 22, -ry * 0.1, 5);
  }

  function ray(c, t, o) {
    var sp = o.sp || 0, f = sin(t * (2.4 + sp * 3.2)), tailw = sin(t * 3);
    var wing = function (shiftx, tipk, fill) {
      var ty = (-30 - 30 * f) * tipk, tx = -34 + shiftx;
      c.beginPath(); c.moveTo(30 + shiftx, -4); c.quadraticCurveTo(14 + shiftx, ty * 0.95 - 8, tx, ty); c.quadraticCurveTo(-22 + shiftx, ty * 0.3, -44 + shiftx, 6);
      c.quadraticCurveTo(-6 + shiftx, 16, 30 + shiftx, 7); c.closePath(); fs(c, fill);
    };
    var tp = []; for (var i = 0; i <= 12; i++) { var s = i / 12; tp.push([-34 - s * 52, 3 + sin(t * 3 - s * 4) * 7 * s]); }
    ribbon(c, tp, 7, 1.5, '#2e59d8', 2.6);
    wing(8, 0.85, '#2a4fc4');
    ell(c, 0, 0, 40, 20); fs(c, lg(c, 0, -20, 0, 20, [[0, '#4d86ff'], [1, '#2f5ee0']]));
    c.save(); ell(c, 0, 0, 40, 20); c.clip(); c.fillStyle = 'rgba(255,255,255,.96)'; ell(c, 6, 17, 40, 12); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; [[-10, -8, 3.4], [-22, -4, 2.6], [-2, -12, 2.4], [-30, 2, 2]].forEach(function (d) { ell(c, d[0], d[1], d[2], d[2]); c.fill(); });
    c.restore();
    ell(c, 0, 0, 40, 20); c.lineWidth = 3; c.strokeStyle = OUT; c.stroke();
    wing(0, 1, '#3f74f2');
    ribbon(c, [[38, -6], [48, -12], [52, -22]], 7, 3, '#3f74f2', 2.2); ribbon(c, [[38, 6], [48, 12], [52, 22]], 7, 3, '#3f74f2', 2.2);
    eye(c, 26, -4, 7); smile(c, 34, 4, 5, 2); blush(c, 22, 8, 4.4);
  }

  /* ---------- ambient-only creatures (not selectable) ---------- */
  function whale(c, t, o) {
    var f = sin(t * 1.4) * 0.22;
    c.save(); c.translate(-150, -4); c.rotate(f);
    c.beginPath(); c.moveTo(24, -8); c.bezierCurveTo(-4, -10, -26, -30, -52, -58); c.quadraticCurveTo(-30, -36, -30, -20);
    c.quadraticCurveTo(-24, -6, -34, 0); c.quadraticCurveTo(-24, 6, -30, 20); c.quadraticCurveTo(-30, 36, -52, 58); c.bezierCurveTo(-26, 30, -4, 10, 24, 8); c.closePath(); fs(c, '#2f64e8', 3.4);
    c.restore();
    c.beginPath(); c.moveTo(190, 6); c.bezierCurveTo(190, -64, 90, -92, -10, -76); c.bezierCurveTo(-110, -62, -150, -26, -156, -2);
    c.bezierCurveTo(-130, 24, -100, 62, 0, 70); c.bezierCurveTo(100, 74, 190, 50, 190, 6); c.closePath();
    c.fillStyle = lg(c, 0, -80, 0, 74, [[0, '#4f8bff'], [1, '#2754d8']]); c.fill();
    c.save(); c.clip(); c.fillStyle = '#eaf4ff'; c.beginPath(); c.moveTo(-170, 30); c.bezierCurveTo(-60, 18, 80, 28, 200, 6); c.lineTo(200, 90); c.lineTo(-170, 90); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(80,130,220,.45)'; c.lineWidth = 3;
    for (var i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-60 + i * 36, 34 + i * 1.5); c.lineTo(-52 + i * 36, 62); c.stroke(); }
    c.restore();
    c.beginPath(); c.moveTo(190, 6); c.bezierCurveTo(190, -64, 90, -92, -10, -76); c.bezierCurveTo(-110, -62, -150, -26, -156, -2);
    c.bezierCurveTo(-130, 24, -100, 62, 0, 70); c.bezierCurveTo(100, 74, 190, 50, 190, 6); c.closePath(); c.lineWidth = 4; c.strokeStyle = OUT; c.stroke();
    c.save(); c.translate(40, 22); c.rotate(0.5 + sin(t * 1.4) * 0.2); ell(c, 0, 20, 14, 38, 0.3); fs(c, '#3d73f0', 3); c.restore();
    eye(c, 138, -14, 13); smile(c, 156, 12, 18, 3.2); blush(c, 128, 12, 10);
  }

  function crab(c, t, o) {
    var w = sin(t * 8) * 0.25, k;
    c.strokeStyle = '#d83a3a'; c.lineWidth = 5; c.lineCap = 'round';
    for (k = 0; k < 3; k++) { [-1, 1].forEach(function (sd) { c.beginPath(); c.moveTo(sd * 14, 6); c.quadraticCurveTo(sd * (28 + k * 4), 8 + k * 2, sd * (30 + k * 6), 22 + sin(t * 8 + k * 2 + (sd > 0 ? 0 : 1.6)) * 3); c.stroke(); }); }
    [-1, 1].forEach(function (sd) {
      c.save(); c.translate(sd * 30, -8); c.rotate(sd * (-0.5 + w * (sd > 0 ? 1 : -1)));
      c.strokeStyle = '#d83a3a'; c.lineWidth = 6; c.beginPath(); c.moveTo(-sd * 12, 14); c.lineTo(0, 6); c.stroke();
      c.beginPath(); c.arc(0, -4, 14, 0.3, TAU - 0.3 + (sd > 0 ? 0 : 0)); c.lineTo(0, -2); c.closePath(); fs(c, '#ee4a4a', 2.6); c.restore();
    });
    ell(c, 0, 4, 28, 19); fs(c, lg(c, 0, -14, 0, 24, [[0, '#ff7a6a'], [1, '#dd3b3b']]));
    c.strokeStyle = '#d83a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-8, -8); c.lineTo(-10, -20); c.moveTo(8, -8); c.lineTo(10, -20); c.stroke();
    eye(c, -10, -22, 6); eye(c, 10, -22, 6); smile(c, 0, 8, 6, 2.2);
  }

  /* tiny schooling fish (cheap) */
  function tiny(c, x, y, ang, s, col, t) {
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s); c.fillStyle = col;
    c.beginPath(); c.ellipse(0, 0, 9, 5, 0, 0, TAU); c.fill();
    var f = sin(t * 14 + x * 0.1) * 3;
    c.beginPath(); c.moveTo(-6, 0); c.lineTo(-15, -5 + f); c.lineTo(-15, 5 + f); c.closePath(); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(4.5, -1.2, 1.6, 0, TAU); c.fill();
    c.fillStyle = '#1b1238'; c.beginPath(); c.arc(4.9, -1.2, 0.8, 0, TAU); c.fill();
    c.restore();
  }

  /* ---------- registry ---------- */
  var TYPES = [
    { id: 'clown',    fn: clown,    en: 'Clownfish',  es: 'Pez payaso',    color: '#ff8a1f', speed: 330, r: 46, scale: 1.0,  flip: 1, box: [128, 84, -4, 0] },
    { id: 'angel',    fn: angel,    en: 'Angelfish',  es: 'Pez ángel',     color: '#ffc933', speed: 310, r: 46, scale: 1.0,  flip: 1, box: [120, 152, -4, 0] },
    { id: 'puffer',   fn: puffer,   en: 'Pufferfish', es: 'Pez globo',     color: '#ffb347', speed: 280, r: 46, scale: 1.0,  flip: 1, box: [120, 112, -6, 0] },
    { id: 'seahorse', fn: seahorse, en: 'Seahorse',   es: 'Caballito de mar', color: '#ff4fa3', speed: 260, r: 44, scale: 1.05, flip: 1, box: [86, 132, 4, -6] },
    { id: 'turtle',   fn: turtle,   en: 'Sea Turtle', es: 'Tortuga marina', color: '#2fb36d', speed: 270, r: 54, scale: 1.0,  flip: 1, box: [146, 92, 4, -4] },
    { id: 'octopus',  fn: octopus,  en: 'Octopus',    es: 'Pulpo',         color: '#a45bff', speed: 290, r: 48, scale: 1.0,  flip: 0, box: [92, 138, -6, 8] },
    { id: 'jelly',    fn: jelly,    en: 'Jellyfish',  es: 'Medusa',        color: '#ff7ad9', speed: 250, r: 46, scale: 1.0,  flip: 0, box: [92, 134, 0, 14] },
    { id: 'ray',      fn: ray,      en: 'Manta Ray',  es: 'Mantarraya',    color: '#3b7bff', speed: 320, r: 56, scale: 1.0,  flip: 1, box: [150, 100, -14, 0] }
  ];
  var BY = {}; TYPES.forEach(function (T) { BY[T.id] = T; });
  BY.whale = { id: 'whale', fn: whale, box: [350, 170, 10, 0] };
  BY.crab = { id: 'crab', fn: crab, box: [90, 60, 0, 0] };

  function draw(c, id, t, o) { c.save(); BY[id].fn(c, t || 0, o || {}); c.restore(); }

  function avatar(cv, id, t, o) {
    var T = BY[id], dpr = Math.min(2, root.devicePixelRatio || 1);
    var w = cv.clientWidth || cv.width, h = cv.clientHeight || cv.height;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    var c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height);
    var k = Math.min(cv.width / (T.box[0] + 14), cv.height / (T.box[1] + 14));
    c.translate(cv.width / 2, cv.height / 2); c.scale(k, k); c.translate(-T.box[2], -T.box[3]);
    o = o || { sp: 0.3 }; o.noglow = true;
    draw(c, id, t || 0, o);
  }

  root.ReefArt = { types: TYPES, by: BY, draw: draw, avatar: avatar, tiny: tiny, lg: lg, rg: rg, ell: ell, ribbon: ribbon, fs: fs };
})(typeof window !== 'undefined' ? window : this);
