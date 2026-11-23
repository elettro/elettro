import * as THREE from 'three';

/* ===== Stashbox.ai Department Store =====
   Real products from stashbox.ai (snapshot of each collection's first products).
   Collections are laid out as departments on one big floor. Click a product to open it on stashbox.ai. */

const $ = id => document.getElementById(id);
const TILE = 12, PITCH = 17, COLS = 6, ROWS = 5, HALL_W = COLS * PITCH + 5, HALL_D = ROWS * PITCH + 5 + 15, WALL_H = 4.4, CEIL = 8;
// grid row 0 = front (south, nearest the doors), row 4 = back
const DEPTS = [
  { r: 0, c: 0, n: 'Shirts', h: ['shirts'] }, { r: 0, c: 1, n: 'New Arrivals', h: ['latest-added-products'] }, { r: 0, c: 2, info: true },
  { r: 0, c: 3, n: 'Gifts for Dads', h: ['gifts-for-dads'] }, { r: 0, c: 4, n: 'Shoes', h: ['shoes'] }, { r: 0, c: 5, n: 'Kids', h: ['kids'] },
  { r: 1, c: 0, n: 'Stashbox Music Merch', h: ['stashbox'] }, { r: 1, c: 1, n: 'Music', h: ['music'] }, { r: 1, c: 2, n: 'Guitars & Pianos', h: ['guitars', 'pianos'] },
  { r: 1, c: 3, n: 'Guitar Girls', h: ['guitar-girls'] }, { r: 1, c: 4, n: 'Reggae.Land & Ras Box', h: ['reggaeland', 'the-ras-box'] }, { r: 1, c: 5, n: 'Tahiti Cora & Josh Clyde', h: ['tahiticora', 'josh-clyde'] },
  { r: 2, c: 0, n: 'Psychedelic', h: ['psychedelic'] }, { r: 2, c: 1, n: 'Characters', h: ['characters'] }, { r: 2, c: 2, n: 'Character Models', h: ['characters-models'] },
  { r: 2, c: 3, n: 'Knolling', h: ['knolling'] }, { r: 2, c: 4, n: 'Bugs', h: ['bugs'] }, { r: 2, c: 5, n: 'Butterflies & Mushrooms', h: ['butterflies', 'mushrooms'] },
  { r: 3, c: 0, n: 'Halloween', h: ['halloween'] }, { r: 3, c: 1, n: 'Trains', h: ['trains'] }, { r: 3, c: 2, n: 'Surfboards', h: ['surfboards'] },
  { r: 3, c: 3, n: 'Waves', h: ['waves'] }, { r: 3, c: 4, n: 'Tropical', h: ['tropical'] }, { r: 3, c: 5, n: 'Soccer & Fire Rescue', h: ['soccer', 'pembroke-pines-fire-rescue'] },
  { r: 4, c: 0, n: 'New York', h: ['newyork'] }, { r: 4, c: 1, n: 'St. Augustine', h: ['st-augustine-fl'] }, { r: 4, c: 2, n: 'St. Pete', h: ['st-pete'] },
  { r: 4, c: 3, n: 'West Palm Beach & Miami', h: ['west-palm-beach', 'miami-style'] }, { r: 4, c: 4, n: 'Home Decor', h: ['home-decor'] }, { r: 4, c: 5, n: 'Pint Glasses', h: ['pint-glasses'] },
];

/* ---------- renderer ---------- */
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#cfe6f5');
const camera = new THREE.PerspectiveCamera(72, 1, .05, 400); camera.rotation.order = 'YXZ';
function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.add(new THREE.HemisphereLight('#ffffff', '#e6dccb', 2.1));
const sunL = new THREE.DirectionalLight('#fff6e6', .8); sunL.position.set(30, 60, 40); scene.add(sunL);

const cv = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
const L = (c, e) => new THREE.MeshLambertMaterial({ color: c, ...e });
const B = (c, e) => new THREE.MeshBasicMaterial({ color: c, ...e });

/* ---------- hall shell ---------- */
// floor
{
  const t = cv(512, 512, (g, w, h) => { g.fillStyle = '#e8e3d8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d4cdbd'; g.lineWidth = 3; g.strokeRect(0, 0, w, h); for (let i = 0; i < 1200; i++) { g.fillStyle = `rgba(160,150,130,${Math.random() * .08})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); } }, true);
  t.repeat.set(HALL_W / 2.4, HALL_D / 2.4);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, HALL_D), new THREE.MeshLambertMaterial({ map: t })); f.rotation.x = -Math.PI / 2; f.position.set(HALL_W / 2, 0, HALL_D / 2); scene.add(f);
  const cl = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, HALL_D), L('#f7f4ee')); cl.rotation.x = Math.PI / 2; cl.position.set(HALL_W / 2, CEIL, HALL_D / 2); scene.add(cl);
  // ceiling light strips
  const ls = B('#fffdf2');
  for (let x = 8; x < HALL_W; x += 17) for (let z = 8; z < HALL_D - 10; z += 8.5) { const s = new THREE.Mesh(new THREE.BoxGeometry(9, .06, .6), ls); s.position.set(x, CEIL - .04, z); scene.add(s); }
  // walls
  const wm = L('#efe9dc');
  const wall = (x, z, w, d, m = wm) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, CEIL, d), m); b.position.set(x, CEIL / 2, z); scene.add(b); return b; };
  wall(HALL_W / 2, -.3, HALL_W, .6); wall(-.3, HALL_D / 2, .6, HALL_D); wall(HALL_W + .3, HALL_D / 2, .6, HALL_D);
  const gap = 12; // entrance gap in the south wall
  wall((HALL_W / 2 - gap / 2) / 2, HALL_D + .3, HALL_W / 2 - gap / 2, .6); wall(HALL_W - (HALL_W / 2 - gap / 2) / 2, HALL_D + .3, HALL_W / 2 - gap / 2, .6);
  wall(HALL_W / 2, HALL_D + .3, gap, .6).scale.y = .001; // placeholder (open)
  // lintel over entrance
  const lin = new THREE.Mesh(new THREE.BoxGeometry(gap, CEIL - 5, .6), wm); lin.position.set(HALL_W / 2, 5 + (CEIL - 5) / 2, HALL_D + .3); scene.add(lin);
  // outside: sky-bright ground and plaza
  const out = new THREE.Mesh(new THREE.PlaneGeometry(400, 300), L('#d8d2c4')); out.rotation.x = -Math.PI / 2; out.position.set(HALL_W / 2, -.01, HALL_D + 150); scene.add(out);
  // giant store sign above entrance (inside)
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.2), new THREE.MeshBasicMaterial({ map: cv(1400, 220, (g, w, h) => { g.fillStyle = '#14213d'; g.fillRect(0, 0, w, h); g.fillStyle = '#8fd13f'; g.fillRect(0, h - 14, w, 14); g.fillStyle = '#fff'; g.font = '800 110px "Segoe UI",Arial'; g.textAlign = 'center'; g.fillText('STASHBOX.AI', w / 2, 120); g.font = '600 38px "Segoe UI",Arial'; g.fillStyle = '#c9d6ee'; g.fillText('THE DEPARTMENT STORE · 29 DEPARTMENTS · REAL PRODUCTS', w / 2, 175); }) }));
  sg.position.set(HALL_W / 2, 6.6, HALL_D - .2); sg.rotation.y = Math.PI; scene.add(sg);
  // north wall mega logo
  const ng = new THREE.Mesh(new THREE.PlaneGeometry(26, 3.2), new THREE.MeshBasicMaterial({ map: cv(1600, 200, (g, w, h) => { g.fillStyle = '#14213d'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '800 120px "Segoe UI",Arial'; g.textAlign = 'center'; g.fillText('STASHBOX.AI', w / 2, 140); }) }));
  ng.position.set(HALL_W / 2, 5.9, .05); scene.add(ng);
}

/* ---------- department kit ---------- */
const cardGeo = new THREE.PlaneGeometry(1.2, 1.2), frameGeo = new THREE.BoxGeometry(1.34, 1.34, .05), labGeo = new THREE.PlaneGeometry(1.34, .38);
const cards = [], pickables = [], deptInfo = [], backWalls = [];
const hueCol = (i, s = .45, l = .62) => new THREE.Color().setHSL(((i * 137.5) % 360) / 360, s, l);
const cleanTitle = t => t.replace(/\s*[–\-â€“]+\s*Stashbox Edition.*$/i, '').replace(/\s*\|.*$/, '').trim();

function labelTexture(p) {
  return cv(256, 72, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#14213d'; g.font = '700 19px "Segoe UI",Arial'; g.textBaseline = 'top';
    const words = cleanTitle(p.t).split(' '); let lines = [], cur = '';
    for (const wd of words) { const tt = cur ? cur + ' ' + wd : wd; if (g.measureText(tt).width > w - 14) { lines.push(cur); cur = wd; } else cur = tt; }
    lines.push(cur); lines = lines.slice(0, 2); if (words.join(' ').length > lines.join(' ').length + 1) lines[1] = (lines[1] || '').replace(/\s*\S*$/, '') + '…';
    lines.forEach((l, i) => g.fillText(l, 7, 6 + i * 22));
    g.fillStyle = '#2f7a12'; g.font = '800 18px "Segoe UI",Arial'; g.textAlign = 'right'; g.fillText('$' + p.p, w - 8, h - 22);
  });
}
function addCard(parent, p, x, y, z, ry, dbl, dept) {
  const grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.y = ry; parent.add(grp);
  const mat = B('#e6ebf2', { side: THREE.FrontSide }); const lm = B('#ffffff');
  const faces = dbl ? [0, Math.PI] : [0];
  faces.forEach(a => {
    const side = new THREE.Group(); side.rotation.y = a; grp.add(side);
    const fr = new THREE.Mesh(frameGeo, L('#ffffff')); fr.position.z = -.03; side.add(fr);
    const im = new THREE.Mesh(cardGeo, mat); im.position.z = .005; im.userData.p = p; side.add(im); pickables.push(im);
    const lb = new THREE.Mesh(labGeo, lm); lb.position.set(0, -.99, .005); side.add(lb);
    if (a === 0) { var lab0 = lb; }
  });
  const wp = new THREE.Vector3(); grp.getWorldPosition(wp);
  cards.push({ p, mat, lm, pos: wp, state: 0, dept });
  return grp;
}

function buildDept(d, idx) {
  const cx = 5 + TILE / 2 + d.c * PITCH, cz = HALL_D - 17 - TILE / 2 - d.r * PITCH;
  d.cx = cx; d.cz = cz;
  const g = new THREE.Group(); g.position.set(cx, 0, cz); scene.add(g);
  d.col = hueCol(idx);
  // carpet
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(TILE, TILE), L(d.col)); carpet.rotation.x = -Math.PI / 2; carpet.position.y = .01; g.add(carpet);
  const edge = new THREE.Mesh(new THREE.PlaneGeometry(TILE + .5, TILE + .5), L('#fff')); edge.rotation.x = -Math.PI / 2; edge.position.y = .005; g.add(edge);
  if (d.info) return buildInfo(g, d);
  // products
  const seen = new Set(); const items = [];
  for (const h of d.h) for (const p of (DATA[h] || [])) if (!seen.has(p.h)) { seen.add(p.h); items.push(p); }
  const list = items.slice(0, 24); d.items = list;
  // back wall
  const wcol = new THREE.Color().setHSL(((idx * 137.5) % 360) / 360, .5, .3);
  const bw = new THREE.Mesh(new THREE.BoxGeometry(TILE, WALL_H, .4), L(wcol)); bw.position.set(0, WALL_H / 2, -TILE / 2 + .2); g.add(bw);
  backWalls.push([cx - TILE / 2, cz - TILE / 2, cx + TILE / 2, cz - TILE / 2 + .5]);
  // hanging sign
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 1.8), new THREE.MeshBasicMaterial({ map: cv(1024, 250, (c, w, h) => { c.fillStyle = '#14213d'; c.fillRect(0, 0, w, h); c.fillStyle = '#' + d.col.getHexString(); c.fillRect(0, h - 22, w, 22); c.fillStyle = '#fff'; let fs = 120; c.font = `800 ${fs}px "Segoe UI",Arial`; while (c.measureText(d.n).width > w - 70) { fs -= 4; c.font = `800 ${fs}px "Segoe UI",Arial`; } c.textAlign = 'center'; c.fillText(d.n, w / 2, 135); c.font = '600 34px "Segoe UI",Arial'; c.fillStyle = '#c9d6ee'; c.fillText(list.length + ' products shown · stashbox.ai', w / 2, 200); }), side: THREE.DoubleSide }));
  sign.position.set(0, 5.6, 0); g.add(sign);
  for (const sx of [-3.3, 3.3]) { const rod = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, CEIL - 6.4, 6), L('#888')); rod.position.set(sx, 6.4 + (CEIL - 6.4) / 2, 0); g.add(rod); }
  // wall cards: 2 rows x 7
  let k = 0;
  for (let row = 0; row < 2; row++) for (let i = 0; i < 7 && k < list.length; i++, k++) addCard(g, list[k], -4.8 + i * 1.6, row ? 3.15 : 1.7, -TILE / 2 + .43, 0, false, d);
  // low gondola tables with tilted cards
  for (let row = 0; row < 2; row++) {
    const z = row ? 3.9 : .9;
    const tb = new THREE.Mesh(new THREE.BoxGeometry(11, .78, 1.7), L('#14213d')); tb.position.set(0, .39, z); g.add(tb);
    const tt = new THREE.Mesh(new THREE.BoxGeometry(11.2, .06, 1.9), L('#ffffff')); tt.position.set(0, .8, z); g.add(tt);
    for (let i = 0; i < 5 && k < list.length; i++, k++) { const cg = addCard(g, list[k], -4.4 + i * 2.2, 1.28, z + .15, 0, false, d); cg.rotation.x = -.95; }
  }
  d.tileG = g;
}
function buildInfo(g, d) {
  d.n = 'Welcome & Info'; d.items = [];
  const desk = new THREE.Mesh(new THREE.BoxGeometry(6, 1.1, 1.6), L('#14213d')); desk.position.set(0, .55, 0); g.add(desk);
  const top = new THREE.Mesh(new THREE.BoxGeometry(6.2, .1, 1.8), L('#8fd13f')); top.position.set(0, 1.15, 0); g.add(top);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.6), new THREE.MeshBasicMaterial({ map: cv(1024, 270, (c, w, h) => { c.fillStyle = '#8fd13f'; c.fillRect(0, 0, w, h); c.fillStyle = '#14213d'; c.font = '800 110px "Segoe UI",Arial'; c.textAlign = 'center'; c.fillText('WELCOME', w / 2, 125); c.font = '700 42px "Segoe UI",Arial'; c.fillText('Pick a department from the directory →', w / 2, 200); }), side: THREE.DoubleSide })); sign.position.set(0, 4.8, 0); g.add(sign);
  // directory totem
  const totem = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.4, .3), L('#14213d')); totem.position.set(0, 1.7, -3.4); g.add(totem);
  const tf = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.2), new THREE.MeshBasicMaterial({ map: cv(256, 340, (c, w, h) => { c.fillStyle = '#14213d'; c.fillRect(0, 0, w, h); c.fillStyle = '#8fd13f'; c.font = '800 24px "Segoe UI",Arial'; c.textAlign = 'center'; c.fillText('DIRECTORY', w / 2, 40); c.fillStyle = '#fff'; c.font = '600 17px "Segoe UI",Arial'; ['Shirts · Shoes · Kids', 'Music · Guitars', 'Psychedelic · Characters', 'Bugs · Butterflies', 'Trains · Surf · Waves', 'Cities · Home · Pints'].forEach((t, i) => c.fillText(t, w / 2, 90 + i * 34)); }) })); tf.position.set(0, 1.7, -3.24); g.add(tf);
  for (const sx of [-4.2, 4.2]) { const pot = new THREE.Mesh(new THREE.CylinderGeometry(.45, .35, .7, 14), L('#c98b52')); pot.position.set(sx, .35, 1.8); g.add(pot); const pl = new THREE.Mesh(new THREE.SphereGeometry(.8, 14, 10), L('#3f9a45')); pl.position.set(sx, 1.4, 1.8); pl.scale.y = 1.3; g.add(pl); }
  d.deskBox = [d.cx - 3.2, d.cz - .9, d.cx + 3.2, d.cz + .9];
}

/* ---------- lazy image loading ---------- */
const imgLoader = new THREE.TextureLoader(); imgLoader.setCrossOrigin('anonymous');
let active = 0; const MAX = 18;
function loadCard(c) {
  c.state = 1; active++;
  const url = c.p.i + (c.p.i.includes('?') ? '&' : '?') + 'width=420';
  imgLoader.load(url, tex => { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; c.tex = tex; c.mat.map = tex; c.mat.color.set('#fff'); c.mat.needsUpdate = true; c.lm.map = labelTexture(c.p); c.lm.needsUpdate = true; c.state = 2; active--; }, undefined, () => { c.state = 3; active--; });
}
function unloadCard(c) { if (c.tex) { c.tex.dispose(); c.tex = null; } if (c.lm.map) { c.lm.map.dispose(); c.lm.map = null; } c.mat.map = null; c.mat.color.set('#e6ebf2'); c.mat.needsUpdate = true; c.lm.color.set('#fff'); c.lm.needsUpdate = true; c.state = 0; }
function streamCards() {
  const cand = [];
  for (const c of cards) { const dx = c.pos.x - P.x, dz = c.pos.z - P.z, d2 = dx * dx + dz * dz; if (c.state === 0 && d2 < 30 * 30) cand.push([d2, c]); else if (c.state === 2 && d2 > 62 * 62) unloadCard(c); }
  cand.sort((a, b) => a[0] - b[0]);
  for (const [, c] of cand) { if (active >= MAX) break; loadCard(c); }
}

/* ---------- controls ---------- */
const P = { x: HALL_W / 2, z: HALL_D - 4, yaw: 0, pitch: -.03 }; let fly = null;
const keys = {}; addEventListener('keydown', e => { if (e.target.tagName !== 'INPUT') keys[e.code] = true; }); addEventListener('keyup', e => keys[e.code] = false);
let drag = null, moved = 0, joy = { x: 0, y: 0 }; const mouse = { x: 0, y: 0 };
const look = (dx, dy) => { P.yaw -= dx * .0026; P.pitch = Math.max(-1.3, Math.min(1.3, P.pitch - dy * .0026)); fly = null; };
canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; moved = 0; });
addEventListener('pointerup', e => { if (drag && moved < 6) pick(e.clientX, e.clientY); drag = null; });
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; if (drag && e.pointerId === drag.id) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy); if (moved >= 6) look(dx, dy); drag.x = e.clientX; drag.y = e.clientY; } });
const joyEl = $('joy'), knob = joyEl.querySelector('b');
function joyMove(e) { const r = joyEl.getBoundingClientRect(); let x = (e.clientX - r.left - 55) / 45, y = (e.clientY - r.top - 55) / 45; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } joy.x = x; joy.y = y; knob.style.transform = `translate(${x * 30}px,${y * 30}px)`; }
joyEl.addEventListener('pointerdown', e => { joyEl.setPointerCapture(e.pointerId); joyMove(e); }); joyEl.addEventListener('pointermove', e => { if (e.buttons || e.pressure) joyMove(e); }); joyEl.addEventListener('pointerup', () => { joy.x = joy.y = 0; knob.style.transform = ''; });
function flyTo(x, z, yaw, pitch = -.04) { fly = { t: 0, f: { x: P.x, z: P.z, yaw: P.yaw, pitch: P.pitch }, to: { x, z, yaw, pitch }, dist: Math.hypot(x - P.x, z - P.z) }; }

/* ---------- picking ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); const infoEl = $('info');
function rayAt(x, y) { ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); ray.far = 18; const h = ray.intersectObjects(pickables, false)[0]; return h && h.object; }
function pick(x, y) { const o = rayAt(x, y); if (o && o.userData.p) window.open('https://stashbox.ai/products/' + o.userData.p.h, '_blank', 'noopener'); }
function updateHover() {
  if (drag && moved >= 6) { infoEl.classList.remove('on'); return; }
  const o = rayAt(mouse.x, mouse.y); const p = o && o.userData.p; canvas.classList.toggle('hover', !!p);
  if (p) { infoEl.innerHTML = `<b>${cleanTitle(p.t)}</b><span>$${p.p}${p.ty ? ' · ' + p.ty : ''}</span><em>Click to open on stashbox.ai ↗</em>`; infoEl.classList.add('on'); } else infoEl.classList.remove('on');
}

/* ---------- directory ---------- */
function renderDir(filter) {
  const list = $('list'); list.innerHTML = '';
  if (filter) {
    const q = filter.toLowerCase(); let n = 0;
    for (const d of DEPTS) for (const p of (d.items || [])) { if (n >= 25) break; if (cleanTitle(p.t).toLowerCase().includes(q)) { n++; const r = document.createElement('div'); r.className = 'res'; r.innerHTML = `<img src="${p.i}&width=80" alt=""><div><b style="font-size:12.5px">${cleanTitle(p.t).slice(0, 44)}</b><div style="font-size:11px;color:#7a869c">${d.n}</div></div>`; r.onclick = () => gotoDept(d, p); list.appendChild(r); } }
    if (!n) list.innerHTML = '<div style="padding:10px;font-size:13px;color:#7a869c">No matches in the shown products.</div>';
    return;
  }
  for (const d of DEPTS) { const b = document.createElement('button'); b.className = 'd'; b.innerHTML = `<i style="background:#${d.col.getHexString()}"></i>${d.n}<span>${d.items ? d.items.length : ''}</span>`; b.onclick = () => gotoDept(d); list.appendChild(b); }
}
function gotoDept(d) { flyTo(d.cx, d.cz + 8.6, 0, -.1); }
$('sq').addEventListener('input', e => renderDir(e.target.value.trim()));
$('sq').addEventListener('keydown', e => e.stopPropagation());

/* ---------- collision & loop ---------- */
function blocked(x, z) {
  if (x < .6 || x > HALL_W - .6 || z < .6) return true;
  if (z > HALL_D - .6) { return Math.abs(x - HALL_W / 2) > 5.2 || z > HALL_D + 6; }
  for (const b of backWalls) if (x > b[0] - .3 && x < b[2] + .3 && z > b[1] - .3 && z < b[3] + .3) return true;
  for (const d of DEPTS) if (d.deskBox && x > d.deskBox[0] - .3 && x < d.deskBox[2] + .3 && z > d.deskBox[1] - .3 && z < d.deskBox[3] + .3) return true;
  return false;
}
const clock = new THREE.Clock(); let acc = 0, curDept = null;
function frame() {
  const dt = Math.min(clock.getDelta(), .05); acc += dt;
  if (fly) { fly.t = Math.min(1, fly.t + dt / Math.max(1.2, Math.min(3.5, fly.dist / 28))); const e = fly.t * fly.t * (3 - 2 * fly.t); P.x = fly.f.x + (fly.to.x - fly.f.x) * e; P.z = fly.f.z + (fly.to.z - fly.f.z) * e; let dy = fly.to.yaw - fly.f.yaw; while (dy > Math.PI) dy -= 6.283; while (dy < -Math.PI) dy += 6.283; P.yaw = fly.f.yaw + dy * e; P.pitch = fly.f.pitch + (fly.to.pitch - fly.f.pitch) * e; if (fly.t >= 1) fly = null; }
  else {
    const fw = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - joy.y, st = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + joy.x;
    if (keys.ArrowLeft) P.yaw += 1.8 * dt; if (keys.ArrowRight) P.yaw -= 1.8 * dt;
    const sp = keys.ShiftLeft || keys.ShiftRight ? 9 : 4;
    const nx = P.x + (-Math.sin(P.yaw) * fw + Math.cos(P.yaw) * st) * sp * dt, nz = P.z + (-Math.cos(P.yaw) * fw - Math.sin(P.yaw) * st) * sp * dt;
    if (!blocked(nx, P.z)) P.x = nx; if (!blocked(P.x, nz)) P.z = nz;
  }
  camera.position.set(P.x, 1.65, P.z); camera.rotation.set(P.pitch, P.yaw, 0);
  if (acc > .2) { acc = 0; streamCards(); let best = null, bd = 1e9; for (const d of DEPTS) { const dd = Math.hypot(d.cx - P.x, d.cz - P.z); if (dd < bd) { bd = dd; best = d; } } const nm = P.z > HALL_D - 6 ? 'Lobby' : bd < 11 ? best.n : 'Aisle'; if (nm !== curDept) { curDept = nm; $('where').textContent = nm; } }
  updateHover();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

/* ---------- boot ---------- */
let DATA = {};
fetch('products.json').then(r => r.json()).then(j => {
  DATA = j; DEPTS.forEach((d, i) => buildDept(d, i));
  const total = DEPTS.reduce((a, d) => a + (d.items ? d.items.length : 0), 0);
  $('stats').textContent = `${DEPTS.filter(d => !d.info).length} DEPARTMENTS · ${total} REAL PRODUCTS ON THE FLOOR`;
  renderDir(''); streamCards(); frame();
  setTimeout(() => $('load').classList.add('off'), 600);
  setTimeout(() => $('hint').classList.add('off'), 14000);
  window.__store = { P, flyTo, DEPTS, cards, gotoDept, camera };
}).catch(e => { $('load').querySelector('p').textContent = 'Could not load: ' + e.message; });
