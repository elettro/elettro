import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* =====================================================================
   Room 14 "Beach House", Seascape Marina & Resort, Marathon FL
   World: metres. +x = east, -z = north (ocean side), +z = south (parking/door side), y up.
   ===================================================================== */
const H = 2.7;                       // ceiling height
const R = 0.22;                      // player radius
const EYE = 1.6;

/* ---------- renderer / scene ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const ENV = 0.35;

const camera = new THREE.PerspectiveCamera(74, innerWidth / innerHeight, 0.05, 900);
camera.rotation.order = 'YXZ';

/* ---------- canvas texture helpers ---------- */
const rnd = (a, b) => a + Math.random() * (b - a);
function canvasTex(w, h, draw, opt = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = opt.clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  t.colorSpace = opt.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
function speckle(g, w, h, n, cols, smin, smax, a = .4) {
  for (let i = 0; i < n; i++) {
    g.globalAlpha = a * Math.random();
    g.fillStyle = cols[(Math.random() * cols.length) | 0];
    const s = rnd(smin, smax);
    g.fillRect(Math.random() * w, Math.random() * h, s, s);
  }
  g.globalAlpha = 1;
}
function mat(color, rough = .7, metal = 0, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, envMapIntensity: ENV, ...extra });
}

/* ---------- textures ---------- */
// shiplap: 6 boards = 0.9 m tile
const shipTex = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#f4f6f5'; g.fillRect(0, 0, w, h);
  const bh = h / 6;
  for (let i = 0; i < 6; i++) {
    const y = i * bh;
    const gr = g.createLinearGradient(0, y, 0, y + bh);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(.8, '#f2f4f4'); gr.addColorStop(1, '#e1e6e8');
    g.fillStyle = gr; g.fillRect(0, y, w, bh);
    g.fillStyle = 'rgba(110,122,134,.55)'; g.fillRect(0, y + bh - 3, w, 3);
    g.fillStyle = 'rgba(255,255,255,.95)'; g.fillRect(0, y, w, 2);
  }
  speckle(g, w, h, 1400, ['#d3d8db', '#ffffff'], 1, 2, .25);
});
// wood-look plank tile: 1.2 m tile, 6 rows of 0.2 m
const floorTex = canvasTex(1024, 1024, (g, w, h) => {
  const rows = 6, rh = h / rows;
  const pal = ['#cdb18c', '#c5a780', '#d3b996', '#c9ad86', '#bf9f78', '#d0b490'];
  for (let r = 0; r < rows; r++) {
    const joint = Math.random() * w;
    for (const [x0, x1] of [[0, joint], [joint, w]]) {
      g.fillStyle = pal[(Math.random() * pal.length) | 0];
      g.fillRect(x0, r * rh, x1 - x0, rh);
      for (let k = 0; k < 14; k++) {
        g.globalAlpha = .18; g.strokeStyle = Math.random() < .5 ? '#8f7656' : '#e6d2b2'; g.lineWidth = rnd(.6, 2);
        const yy = r * rh + Math.random() * rh; g.beginPath(); g.moveTo(x0, yy); g.bezierCurveTo(x0 + (x1 - x0) * .3, yy + rnd(-3, 3), x0 + (x1 - x0) * .7, yy + rnd(-3, 3), x1, yy + rnd(-2, 2)); g.stroke();
      }
      g.globalAlpha = 1;
      g.fillStyle = 'rgba(95,75,50,.55)'; g.fillRect(x0, r * rh, 2, rh);
    }
    g.fillStyle = 'rgba(95,75,50,.5)'; g.fillRect(0, r * rh, w, 2);
  }
  speckle(g, w, h, 2500, ['#8f7656', '#f1e3c8'], 1, 3, .2);
});
const quiltTex = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#f3f5f5'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(150,165,175,.6)'; g.lineWidth = 2;
  for (let y = 0; y <= h; y += 64) for (let x = 0; x <= w; x += 64) {
    for (const rr of [28, 20]) { g.beginPath(); g.arc(x + 32, y + 32, rr, 0, Math.PI * 2); g.stroke(); }
  }
  speckle(g, w, h, 500, ['#dfe4e6'], 1, 2, .3);
});
const beadTex = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#6e9dc2'; g.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 16) {
    g.fillStyle = '#4d7ea4'; g.fillRect(x, 0, 3, h);
    g.fillStyle = '#8ab6d8'; g.fillRect(x + 3, 0, 2, h);
  }
  speckle(g, w, h, 300, ['#5683a8', '#9cc3e0'], 1, 2, .3);
});
const fabricTex = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#a9c4b6'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 3;
  for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) {
    g.beginPath(); g.ellipse(x + 16, y + 16, 11, 5, Math.PI / 4, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.ellipse(x + 16, y + 16, 11, 5, -Math.PI / 4, 0, Math.PI * 2); g.stroke();
  }
});
const patioFabricTex = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#1f3a73'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#7db0e0'; g.lineWidth = 3;
  for (let y = 0; y < h; y += 42) for (let x = 0; x < w; x += 42) {
    g.beginPath(); g.arc(x + 21, y + 21, 14, 0.3, 4.6); g.stroke();
    g.beginPath(); g.arc(x + 21, y + 21, 6, 0.8, 5.2); g.stroke();
  }
});
const towelTex = canvasTex(64, 64, (g, w, h) => {
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#1c4fb8';
  for (let x = 0; x < w; x += 16) g.fillRect(x, 0, 8, h);
});
const stuccoTex = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#ece1c4'; g.fillRect(0, 0, w, h);
  speckle(g, w, h, 5000, ['#d8cba9', '#f6edd6', '#c9bc99'], 1, 3, .35);
});
const gravelTex = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#d3c3a1'; g.fillRect(0, 0, w, h);
  speckle(g, w, h, 9000, ['#bda985', '#e8dcc0', '#a99577', '#f3ead6', '#9b8b72'], 1, 4, .8);
});
const grassTex = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#5fa63a'; g.fillRect(0, 0, w, h);
  speckle(g, w, h, 6000, ['#4d9030', '#78bb4c', '#3f8228', '#8ac957'], 1, 3, .7);
});
const patioTex = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#d6d6d0'; g.fillRect(0, 0, w, h);
  speckle(g, w, h, 1500, ['#c3c3bc', '#e4e4de'], 1, 3, .5);
  g.fillStyle = '#a9a9a2'; g.fillRect(0, 0, w, 3); g.fillRect(0, 0, 3, h); g.fillRect(w / 2 - 1, 0, 2, h); g.fillRect(0, h / 2 - 1, w, 2);
});
const mosaicTex = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#5b5b5b'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) {
    g.fillStyle = ['#8c8c8a', '#b7b3ad', '#6e6e6c', '#d0cdc6', '#a09b92'][(Math.random() * 5) | 0];
    g.beginPath(); g.ellipse(Math.random() * w, Math.random() * h, rnd(4, 9), rnd(3, 7), Math.random() * 3, 0, Math.PI * 2); g.fill();
  }
});
const trunkTex = canvasTex(64, 128, (g, w, h) => {
  g.fillStyle = '#8c7a62'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 7) { g.fillStyle = 'rgba(60,45,30,.45)'; g.fillRect(0, y, w, 2); g.fillStyle = 'rgba(210,190,160,.25)'; g.fillRect(0, y + 3, w, 2); }
  speckle(g, w, h, 400, ['#6e5d48', '#a99880'], 1, 2, .4);
});
const frondTex = canvasTex(128, 512, (g, w, h) => {
  g.clearRect(0, 0, w, h);
  g.strokeStyle = '#2f6b21'; g.lineWidth = 3; g.beginPath(); g.moveTo(64, 0); g.lineTo(64, h); g.stroke();
  for (let y = 6; y < h; y += 11) {
    const len = 62 * (1 - Math.max(0, (y - 380) / 140));
    g.lineWidth = 6;
    g.strokeStyle = (y / 11 | 0) % 2 ? '#3f8a2b' : '#4c9a34';
    g.beginPath(); g.moveTo(64, y); g.lineTo(64 - len, y + 34); g.stroke();
    g.beginPath(); g.moveTo(64, y); g.lineTo(64 + len, y + 34); g.stroke();
  }
});
const cloudTex = canvasTex(128, 64, (g, w, h) => {
  for (let i = 0; i < 9; i++) {
    const x = 20 + i * 11, y = 34 + rnd(-6, 6), r = rnd(14, 24);
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
}, { clamp: true });
const seaTex = canvasTex(4, 256, (g, w, h) => {
  const gr = g.createLinearGradient(0, h, 0, 0);       // bottom = near shore (v=0), top = horizon
  gr.addColorStop(0, '#7ad6cf'); gr.addColorStop(.12, '#3fb4bf'); gr.addColorStop(.4, '#2b86ad'); gr.addColorStop(.85, '#2a73a6'); gr.addColorStop(1, '#8cc4e6');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
}, { clamp: true });

/* ---------- materials ---------- */
const M = {
  ship: mat('#ffffff', .85, 0, { map: shipTex }),
  stucco: mat('#ffffff', .95, 0, { map: stuccoTex }),
  white: mat('#f6f7f6', .6),
  trim: mat('#f9faf9', .5),
  ceilBlue: mat('#a8d0f0', .9, 0, { emissive: '#7fb2dd', emissiveIntensity: .45 }),
  slate: mat('#56687e', .8),
  floor: mat('#ffffff', .5, 0, { map: floorTex }),
  bead: mat('#ffffff', .55, 0, { map: beadTex }),
  quilt: mat('#ffffff', .9, 0, { map: quiltTex }),
  sheet: mat('#f1f3f2', .9),
  pillow: mat('#f6f7f6', .95),
  lime: mat('#9fd23a', .9),
  towel: mat('#ffffff', .95, 0, { map: towelTex }),
  wood: mat('#c8a57b', .7),
  woodDark: mat('#7b4b2b', .6),
  seafoam: mat('#86b9b4', .6),
  chair: mat('#ffffff', .9, 0, { map: fabricTex }),
  patioChair: mat('#ffffff', .85, 0, { map: patioFabricTex }),
  metal: mat('#c9cdd1', .3, .9),
  steel: mat('#cfd3d7', .4, .35),
  black: mat('#121416', .4),
  dark: mat('#2b2f34', .5),
  glass: new THREE.MeshPhysicalMaterial({ color: '#cfe6f2', roughness: .05, transparent: true, opacity: .13, depthWrite: false, envMapIntensity: .6 }),
  gravel: mat('#ffffff', 1, 0, { map: gravelTex }),
  grass: mat('#ffffff', 1, 0, { map: grassTex }),
  patio: mat('#ffffff', .9, 0, { map: patioTex }),
  mosaic: mat('#ffffff', .5, 0, { map: mosaicTex }),
  stone: mat('#bdb7a8', .95),
  trunk: mat('#ffffff', .9, 0, { map: trunkTex }),
  frond: new THREE.MeshStandardMaterial({ map: frondTex, alphaTest: .45, side: THREE.DoubleSide, roughness: .8, envMapIntensity: ENV }),
  quartz: mat('#9d9a93', .35),
  doorBlue: mat('#5b7694', .55),
};
for (const [k, t, rx, ry] of [['ship', shipTex, 1, 1], ['floor', floorTex, 1, 1], ['gravel', gravelTex, 1, 1], ['grass', grassTex, 1, 1], ['patio', patioTex, 1, 1]]) { /* uv scaled in box() or via repeat below */ }
gravelTex.repeat.set(10, 10); grassTex.repeat.set(14, 14); patioTex.repeat.set(1, 1);
beadTex.repeat.set(1, 1);

/* ---------- geometry helpers ---------- */
// Box whose UVs are in world-units / tile so textures keep scale on any size. mats: 1 or 6.
function box(sx, sy, sz, mats, tile = 0.9, yBase = 0) {
  const g = new THREE.BoxGeometry(sx, sy, sz);
  const uv = g.attributes.uv;
  const sizes = [[sz, sy], [sz, sy], [sx, sz], [sx, sz], [sx, sy], [sx, sy]];
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i;
    const vOff = (f === 2 || f === 3) ? 0 : yBase / tile;
    uv.setXY(k, uv.getX(k) * sizes[f][0] / tile, uv.getY(k) * sizes[f][1] / tile + vOff);
  }
  const m = new THREE.Mesh(g, mats);
  m.castShadow = m.receiveShadow = true;
  return m;
}
const add = (m, x, y, z, parent = scene) => { m.position.set(x, y, z); parent.add(m); return m; };
const cyl = (rt, rb, h, mt, seg = 20, open = false) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg, 1, open), mt); m.castShadow = m.receiveShadow = true; return m; };
const sph = (rx, ry, rz, mt) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), mt); m.scale.set(rx, ry, rz); m.castShadow = m.receiveShadow = true; return m; };
function plane(w, h, mt) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mt); return m; }

const planRects = [];       // for minimap: walls
const obstacles = [];       // [x0,z0,x1,z1]

/* ---------- walls with openings ---------- */
function addWall({ x = [0, 0], z = [0, 0], long = 'x', int = [], open = [] }) {
  planRects.push([x[0], z[0], x[1], z[1]]);
  const [a0, a1] = long === 'x' ? x : z;
  const cuts = open.slice().sort((p, q) => p.a0 - q.a0);
  let cur = a0;
  const piece = (p0, p1, y0, y1) => {
    if (p1 - p0 < 1e-3 || y1 - y0 < 1e-3) return;
    const sx = long === 'x' ? p1 - p0 : x[1] - x[0];
    const sz = long === 'x' ? z[1] - z[0] : p1 - p0;
    const mats = [0, 1, 2, 3, 4, 5].map(f => int.includes(f) ? M.ship : M.stucco);
    const m = box(sx, y1 - y0, sz, mats, 0.9, y0);
    m.position.set(long === 'x' ? (p0 + p1) / 2 : (x[0] + x[1]) / 2, (y0 + y1) / 2, long === 'x' ? (z[0] + z[1]) / 2 : (p0 + p1) / 2);
    scene.add(m);
  };
  for (const o of cuts) { piece(cur, o.a0, 0, H); piece(o.a0, o.a1, 0, o.y0); piece(o.a0, o.a1, o.y1, H); cur = o.a1; }
  piece(cur, a1, 0, H);
}
// faces: 0=+x 1=-x 2=+y 3=-y 4=+z 5=-z
addWall({ long: 'z', x: [-0.2, 0], z: [-0.2, 6.4], int: [0], open: [{ a0: 2.4, a1: 3.3, y0: 1.0, y1: 2.1 }] });                 // west (TV wall)
addWall({ long: 'x', x: [-0.2, 5.4], z: [-0.2, 0], int: [4], open: [{ a0: 1.95, a1: 3.05, y0: 1.0, y1: 2.2 }] });                // north (ocean window)
addWall({ long: 'z', x: [5.2, 5.4], z: [0, 2.4], int: [1] });                                                                       // headboard wall
addWall({ long: 'z', x: [5.2, 5.4], z: [2.4, 4.8], int: [0, 1] });
addWall({ long: 'x', x: [5.4, 7.8], z: [2.4, 2.6], int: [4] });                                                                     // bath north
addWall({ long: 'z', x: [7.6, 7.8], z: [2.4, 5.0], int: [1] });                                                                     // bath east
addWall({ long: 'x', x: [5.2, 7.8], z: [4.8, 5.0], int: [4, 5], open: [{ a0: 5.65, a1: 6.45, y0: 0, y1: 2.1 }] });               // bath south / alcove north
addWall({ long: 'z', x: [6.6, 6.8], z: [5.0, 6.4], int: [1] });                                                                     // alcove east
addWall({ long: 'x', x: [-0.2, 6.8], z: [6.2, 6.4], int: [5], open: [{ a0: 0.7, a1: 1.6, y0: 1.0, y1: 2.1 }, { a0: 2.0, a1: 2.9, y0: 0, y1: 2.1 }] }); // south (entry)

// roof slab + fascia
add(box(8.8, .28, 7.4, [M.slate, M.slate, M.stucco, M.stucco, M.slate, M.slate], 1.2), 3.65, H + .14, 3.0);
// concrete slab / floor
{
  const fl = (x0, x1, z0, z1, m = M.floor) => { const w = x1 - x0, d = z1 - z0; const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); f.rotation.x = -Math.PI / 2; f.position.set((x0 + x1) / 2, .002, (z0 + z1) / 2); f.receiveShadow = true;
    const uv = f.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / 1.2, uv.getY(i) * d / 1.2); scene.add(f); return f; };
  fl(0, 5.2, 0, 6.2); fl(5.2, 6.6, 5.0, 6.2); fl(5.4, 7.6, 2.6, 4.8);
  // shower mosaic
  const sm = new THREE.Mesh(new THREE.PlaneGeometry(.75, 2.2), M.mosaic); sm.rotation.x = -Math.PI / 2; sm.position.set(7.22, .006, 3.7); scene.add(sm);
  mosaicTex.repeat.set(3, 8);
  // ceilings
  const ceil = (x0, x1, z0, z1, m) => { const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), m); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, H - .006, (z0 + z1) / 2); scene.add(c); };
  ceil(0, 5.2, 0, 6.2, M.ceilBlue); ceil(5.2, 6.6, 5.0, 6.2, M.ceilBlue); ceil(5.4, 7.6, 2.6, 4.8, mat('#f4f6f6', .9, 0, { emissive: '#dfe7ea', emissiveIntensity: .55 }));
}

/* coffered ceiling beams */
{
  const bm = M.trim, bd = .14;
  for (const x of [1.3, 2.6, 3.9]) add(box(.2, bd, 6.2, bm), x, H - bd / 2, 3.1);
  for (const z of [1.55, 3.1, 4.65]) add(box(5.2, bd, .2, bm), 2.6, H - bd / 2, z);
  add(box(5.2, bd, .16, bm), 2.6, H - bd / 2, .08); add(box(5.2, bd, .16, bm), 2.6, H - bd / 2, 6.12);
  add(box(.16, bd, 6.2, bm), .08, H - bd / 2, 3.1); add(box(.16, bd, 6.2, bm), 5.12, H - bd / 2, 3.1);
  // alcove beam
  add(box(.2, bd, 1.2, bm), 5.2, H - bd / 2, 5.6);
  // recessed cans
  for (const x of [.65, 1.95, 3.25, 4.55]) for (const z of [.78, 2.33, 3.88, 5.45]) {
    if ((x === 1.95 || x === 3.25) && z === 2.33) continue;
    add(cyl(.065, .065, .025, new THREE.MeshBasicMaterial({ color: '#fff3d6' }), 16), x, H - .01, z);
    add(cyl(.085, .085, .012, M.white, 16), x, H - .004, z);
  }
  add(cyl(.065, .065, .02, new THREE.MeshBasicMaterial({ color: '#fff3d6' }), 16), 5.9, H - .01, 5.6);
  add(cyl(.065, .065, .02, new THREE.MeshBasicMaterial({ color: '#fff3d6' }), 16), 6.5, H - .01, 3.7);
}

/* ceiling fan */
const fan = new THREE.Group(); fan.position.set(2.6, H - .14, 3.1); scene.add(fan);
{
  add(cyl(.02, .02, .22, M.white, 10), 0, .03, 0, fan);
  add(cyl(.12, .12, .09, M.white, 24), 0, -.1, 0, fan);
  const blades = new THREE.Group(); blades.position.y = -.1; fan.add(blades); fan.userData.blades = blades;
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    const b = box(.62, .012, .14, M.white); b.position.set(Math.cos(a) * .42, 0, Math.sin(a) * .42); b.rotation.y = -a; b.rotation.z = .04; blades.add(b);
    const arm = box(.2, .015, .035, M.metal); arm.position.set(Math.cos(a) * .17, 0, Math.sin(a) * .17); arm.rotation.y = -a; blades.add(arm);
  }
  add(cyl(.1, .1, .06, new THREE.MeshStandardMaterial({ color: '#ffe2b0', emissive: '#ffcf8a', emissiveIntensity: .8 }), 24), 0, -.19, 0, fan);
}

/* ---------- windows, doors ---------- */
const blindsGroups = [];
function addWindow(px, py, pz, w, h, rotY, inside) {
  const g = new THREE.Group(); g.position.set(px, py, pz); g.rotation.y = rotY; scene.add(g);
  const fT = .06, fD = .14;
  add(box(fT, h, fD, M.trim), -(w / 2 - fT / 2), 0, 0, g); add(box(fT, h, fD, M.trim), (w / 2 - fT / 2), 0, 0, g);
  add(box(w, fT, fD, M.trim), 0, h / 2 - fT / 2, 0, g); add(box(w, fT, fD, M.trim), 0, -(h / 2 - fT / 2), 0, g);
  add(box(w + .14, .035, .22, M.trim), 0, -h / 2 - .01, inside * .06, g);                // sill
  add(box(w + .12, .05, .03, M.trim), 0, h / 2 + .02, inside * .1, g);                    // header casing
  add(box(w - .1, .045, .06, M.white), 0, h / 2 - fT - .02, inside * .03, g);            // headrail
  const n = 11;
  for (let i = 0; i < n; i++) {
    const s = box(w - .12, .014, .05, M.white); s.position.set(0, h / 2 - fT - .06 - i * .033, inside * .03); s.rotation.x = .35; g.add(s);
  }
  const gl = plane(w - .1, h - .1, M.glass); gl.position.z = 0; g.add(gl);
  // mid mullion
  add(box(.025, h - .1, .05, M.trim), 0, 0, 0, g);
  return g;
}
addWindow(2.5, 1.6, -.1, 1.1, 1.2, 0, 1);                 // north big window (ocean)
addWindow(-.1, 1.55, 2.85, .9, 1.1, Math.PI / 2, 1);      // west small window over chairs
addWindow(1.15, 1.55, 6.3, .9, 1.1, 0, -1);               // south window beside entry

function lever(parent, x, y, z, side) {
  add(cyl(.028, .028, .014, M.steel, 16), x, y, z, parent).rotation.x = Math.PI / 2;
  const h = box(.11, .018, .018, M.steel); add(h, x + .05 * side, y, z + .03 * Math.sign(z || 1), parent);
}
const doors = [];
function addDoor({ hx, hz, w, h, interior, exterior, rotClosed, rotOpen, name, startOpen, number }) {
  const pivot = new THREE.Group(); pivot.position.set(hx, 0, hz); scene.add(pivot);
  const t = .045;
  const slab = box(w, h, t, [M.white, M.white, M.white, M.white, exterior, interior], .9); slab.position.set(w / 2, h / 2, 0); pivot.add(slab);
  // raised panels both faces
  for (const s of [-1, 1]) {
    const col = s > 0 ? exterior : interior;
    for (const [py, ph] of [[h * .74, h * .3], [h * .3, h * .46]]) {
      const p = box(w * .66, ph, .012, col); p.position.set(w / 2, py, s * (t / 2 + .004)); pivot.add(p);
    }
  }
  // lever handles
  for (const s of [-1, 1]) {
    const hd = box(.11, .02, .02, M.steel); hd.position.set(w - .08, 1.02, s * (t / 2 + .035)); pivot.add(hd);
    const rs = cyl(.03, .03, .012, M.steel, 16); rs.rotation.x = Math.PI / 2; rs.position.set(w - .06, 1.02, s * (t / 2 + .008)); pivot.add(rs);
  }
  if (number) {
    const tex = canvasTex(128, 128, (g, W, Hh) => { g.fillStyle = '#c3c8cd'; g.fillRect(0, 0, W, Hh); g.fillStyle = '#e8ecef'; g.fillRect(0, 0, W, 6); g.fillStyle = '#4a5560'; g.font = 'bold 80px Georgia,serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(number, W / 2, Hh / 2 + 4); }, { clamp: true });
    const pl = plane(.13, .13, new THREE.MeshStandardMaterial({ map: tex, metalness: .6, roughness: .35, envMapIntensity: ENV })); pl.position.set(w / 2, 1.6, t / 2 + .014); pivot.add(pl);
  }
  const d = { name, pivot, w, hx, hz, open: !!startOpen, t: startOpen ? 1 : 0, rotClosed, rotOpen, h };
  pivot.rotation.y = startOpen ? rotOpen : rotClosed;
  doors.push(d);
  // frame (trim)
  return d;
}
// entry door (south wall z 6.2..6.4, opening x 2.0..2.9). Hinge on west edge, swings inward (north).
const entry = addDoor({ hx: 2.0, hz: 6.3, w: .9, h: 2.1, interior: M.white, exterior: M.doorBlue, rotClosed: 0, rotOpen: Math.PI * .5, name: 'entry door', number: '14' });
// bath door (wall z 4.8..5.0, opening x 5.65..6.45), hinge west, swings into bath (north)
const bathDoor = addDoor({ hx: 5.65, hz: 4.9, w: .8, h: 2.1, interior: M.white, exterior: M.white, rotClosed: 0, rotOpen: Math.PI * .5, name: 'bathroom door', startOpen: true });
// door frames
for (const [x0, x1, zc, tt] of [[2.0, 2.9, 6.3, .2], [5.65, 6.45, 4.9, .2]]) {
  add(box(.05, 2.12, tt + .04, M.trim), x0 - .025, 1.06, zc); add(box(.05, 2.12, tt + .04, M.trim), x1 + .025, 1.06, zc); add(box(x1 - x0 + .1, .05, tt + .04, M.trim), (x0 + x1) / 2, 2.12, zc);
}
// west wall closet door (fixed, painted)
{
  const g = box(.045, 2.1, .85, M.white); add(g, .03, 1.05, 1.15);
  for (const [py, ph] of [[1.55, .65], [.65, .9]]) add(box(.012, ph, .55, M.trim), .06, py, 1.15);
  add(box(.02, .02, .11, M.steel), .08, 1.02, 1.5);
  add(box(.06, 2.14, .05, M.trim), .03, 1.07, .7 - .04); add(box(.06, 2.14, .05, M.trim), .03, 1.07, 1.6 + .04); add(box(.06, .05, .95, M.trim), .03, 2.12, 1.15);
}

/* ---------- furniture ---------- */
function mkBed(zc, art) {
  const g = new THREE.Group(); scene.add(g);
  const W = 1.53;
  // headboard
  add(box(.07, .72, 1.5, M.bead, .5), 5.15, .95, zc, g);
  add(box(.09, .12, 1.62, M.bead, .5), 5.15, 1.37, zc, g);
  add(box(.06, .12, 1.5, M.bead, .5), 5.15, .55, zc, g);
  for (const s of [-1, 1]) {
    add(box(.1, 1.5, .1, M.bead, .5), 5.15, .75, zc + s * .79, g);
    add(sph(.06, .06, .06, M.bead), 5.15, 1.53, zc + s * .79, g);
  }
  // footboard
  add(box(.06, .3, 1.5, M.bead, .5), 3.2, .5, zc, g);
  for (const s of [-1, 1]) add(box(.09, .62, .09, M.bead, .5), 3.2, .46, zc + s * .79, g);
  add(box(.08, .06, 1.62, M.bead, .5), 3.2, .66, zc, g);
  // side rails
  for (const s of [-1, 1]) add(box(1.95, .22, .045, M.bead, .5), 4.18, .38, zc + s * .78, g);
  // mattress + spread
  add(box(1.9, .3, W, M.sheet), 4.17, .52, zc, g);
  add(box(1.9, .06, 1.6, M.quilt, .5), 4.15, .69, zc, g);                             // top
  for (const s of [-1, 1]) add(box(1.9, .42, .035, M.quilt, .5), 4.15, .49, zc + s * .8, g);
  add(box(.035, .42, 1.6, M.quilt, .5), 3.21, .49, zc, g);
  // pillows
  for (const s of [-1, 1]) { const p = sph(.08, .27, .3, M.pillow); p.position.set(4.97, .92, zc + s * .36); p.rotation.z = .22; g.add(p); }
  const lp = sph(.07, .2, .2, M.lime); lp.position.set(4.8, .87, zc + (zc < 2 ? .12 : -.12)); lp.rotation.z = .3; g.add(lp);
  // towel rolls
  const tw = cyl(.085, .085, .42, M.towel, 20); tw.rotation.x = Math.PI / 2; tw.position.set(4.12, .82, zc + .0); g.add(tw);
  const tw2 = cyl(.085, .085, .42, M.towel, 20); tw2.rotation.x = Math.PI / 2; tw2.position.set(4.28, .85, zc + .02); tw2.rotation.y = .5; g.add(tw2);
  // art above bed
  const pw = art.w, ph = art.h;
  add(box(.03, ph + .07, pw + .07, M.white), 5.185, 1.85, zc - art.dz);
  const pic = plane(pw, ph, new THREE.MeshStandardMaterial({ map: art.tex, roughness: .6, envMapIntensity: .2 }));
  pic.rotation.y = -Math.PI / 2; pic.position.set(5.168, 1.85, zc - art.dz); scene.add(pic);
}
const loader = new THREE.TextureLoader();
const tex = (p, flipX) => { const t = loader.load(p); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (flipX) { t.wrapS = THREE.RepeatWrapping; t.repeat.x = -1; t.offset.x = 1; } return t; };
const artTex = tex('photos/art_big.jpg'), artTex2 = tex('photos/art_big.jpg', true);
mkBed(1.07, { tex: artTex2, w: .58, h: .56, dz: 0 });
mkBed(3.1, { tex: artTex, w: .78, h: .76, dz: 0 });

// nightstand + lamp
const lampLight = new THREE.PointLight('#ffc98a', 3.2, 4.2, 2); lampLight.position.set(4.97, 1.05, 2.1); scene.add(lampLight);
{
  const zc = 2.1;
  add(box(.46, .6, .5, M.wood), 4.93, .3, zc);
  add(box(.5, .045, .54, M.wood), 4.93, .62, zc);
  add(box(.02, .42, .36, mat('#9a7a55', .8)), 4.69, .32, zc);
  add(box(.02, .08, .08, M.metal), 4.68, .5, zc);
  const prof = [[0.001, 0], [.07, .02], [.1, .09], [.11, .17], [.07, .27], [.035, .33], [.03, .45], [.001, .45]].map(([r, y]) => new THREE.Vector2(r, y));
  const base = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), mat('#b97a2d', .35, .1)); base.position.set(4.97, .645, zc); base.castShadow = true; scene.add(base);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, .24, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#c4ab83', emissive: '#ffcf8a', emissiveIntensity: .55, side: THREE.DoubleSide, roughness: .9 }));
  shade.position.set(4.97, 1.22, zc); scene.add(shade);
}

// dresser + TV (west wall)
{
  const zc = 4.7, d = .5, wd = 1.4, hh = .88;
  const dg = new THREE.Group(); scene.add(dg);
  add(box(d, hh - .06, wd, M.seafoam), d / 2, (hh - .06) / 2 + .06, zc, dg);
  add(box(d + .03, .045, wd + .04, mat('#a8cdc8', .5)), d / 2 + .01, hh + .02, zc, dg);
  for (const s of [-1, 1]) { add(cyl(.04, .05, .06, M.seafoam, 12), .08, .03, zc + s * (wd / 2 - .08), dg); add(cyl(.04, .05, .06, M.seafoam, 12), d - .08, .03, zc + s * (wd / 2 - .08), dg); }
  // drawer fronts (facing +x)
  const fx = d + .005;
  for (let i = 0; i < 4; i++) {
    const y = .22 + i * .165;
    add(box(.02, .14, .52, mat('#93c4bf', .55)), fx, y, zc + .0, dg);
    add(cyl(.014, .014, .03, M.metal, 10), fx + .02, y, zc - .12, dg).rotation.z = Math.PI / 2;
    add(cyl(.014, .014, .03, M.metal, 10), fx + .02, y, zc + .12, dg).rotation.z = Math.PI / 2;
  }
  for (const s of [-1, 1]) { // louvered doors
    const dz = zc + s * .5;
    add(box(.02, .66, .36, mat('#93c4bf', .55)), fx, .5, dz, dg);
    for (let k = 0; k < 7; k++) add(box(.014, .012, .3, M.seafoam), fx + .012, .22 + k * .085, dz, dg).rotation.z = .35;
  }
  // plant
  add(cyl(.045, .035, .07, mat('#a9cf3b', .6), 14), .2, hh + .09, zc - .45, dg);
  for (let i = 0; i < 6; i++) { const l = sph(.012, .07, .012, mat('#2f8a3a', .7)); l.position.set(.2 + Math.cos(i) * .02, hh + .17, zc - .45 + Math.sin(i) * .02); l.rotation.z = Math.cos(i) * .4; l.rotation.x = Math.sin(i) * .4; dg.add(l); }
  // TV
  const tvW = 1.22, tvH = .69;
  add(box(.045, tvH + .03, tvW + .03, M.black), .05, 1.58, zc);
  const tvTex = tex('photos/tv_beach.jpg');
  const scr = plane(tvW, tvH, new THREE.MeshBasicMaterial({ map: tvTex })); scr.rotation.y = Math.PI / 2; scr.position.set(.075, 1.58, zc); scene.add(scr);
  window.__tv = scr;
}

// chairs on west wall
function mkChair(x, z, yaw) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = yaw; scene.add(g);
  add(box(.46, .07, .46, M.chair, .4), 0, .47, 0, g);
  const back = box(.06, .46, .44, M.chair, .4); back.position.set(-.21, .8, 0); back.rotation.z = -.08; g.add(back);
  add(box(.05, .035, .48, M.woodDark), -.215, 1.05, 0, g);
  for (const [lx, lz, hgt] of [[.19, .19, .45], [.19, -.19, .45], [-.2, .19, .95], [-.2, -.19, .95]]) add(cyl(.014, .02, hgt, M.woodDark, 8), lx, hgt / 2, lz, g);
  return g;
}
mkChair(.34, 2.62, -.1); mkChair(.34, 3.12, .12);

// clock (east wall, by alcove)
{
  const tex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#eeeeea'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 38) { g.fillStyle = 'rgba(120,115,105,.3)'; g.fillRect(0, y, w, 2); }
    speckle(g, w, h, 1200, ['#c9c5bb', '#fff'], 1, 3, .4);
    const star = (cx, cy, r, c) => { g.fillStyle = c; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); g.fill(); };
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; star(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100, i % 3 === 0 ? 26 : 15, i % 3 === 0 ? '#2d9fc0' : '#8ec3d6'); }
    g.strokeStyle = '#222'; g.lineCap = 'round';
    g.lineWidth = 6; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + 34 * Math.cos(-.35 + 3.14), 128 + 34 * Math.sin(-.35 + 3.14)); g.stroke();
    g.lineWidth = 4; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + 78 * Math.cos(1.05 - 1.57), 128 + 78 * Math.sin(1.05 - 1.57)); g.stroke();
  }, { clamp: true });
  const c = cyl(.4, .4, .035, [mat('#d5d0c4', .8), new THREE.MeshStandardMaterial({ map: tex, roughness: .7, envMapIntensity: .2 }), mat('#d5d0c4', .8)], 48);
  c.rotation.z = Math.PI / 2; c.position.set(5.17, 1.6, 4.33); scene.add(c);
  c.rotation.x = 0; c.rotation.y = 0;
  // orient the textured cap toward -x: rotate so +y cap (index 1 = top cap?) -> handled below
  c.rotation.set(0, 0, Math.PI / 2);
  // Cylinder cap order: [side, top(+y), bottom(-y)] -> after rotation z=+90deg top points -x. Good.
  const hub = cyl(.02, .02, .05, M.black, 12); hub.rotation.z = Math.PI / 2; hub.position.set(5.14, 1.6, 4.33); scene.add(hub);
}

// kitchenette (alcove east wall x=6.6)
{
  const x = 6.6;
  // fridge
  const fr = new THREE.Group(); scene.add(fr);
  add(box(.5, .86, .52, M.steel), x - .27, .43, 5.35, fr);
  add(box(.012, .004, .5, M.dark), x - .525, .62, 5.35, fr);
  for (const [y, hh] of [[.76, .2], [.31, .5]]) add(box(.012, hh, .015, M.metal), x - .535, y, 5.14, fr);
  // trash can
  add(cyl(.15, .15, .62, M.steel, 24), x - .3, .31, 5.78);
  add(cyl(.153, .153, .03, M.dark, 24), x - .3, .63, 5.78);
  // floating granite shelf
  add(box(.48, .04, .62, mat('#c9c4b8', .35)), x - .24, 1.0, 5.4);
  add(box(.02, .12, .5, M.dark), x - .02, .92, 5.4);
  // microwave
  add(box(.38, .26, .45, M.steel), x - .26, 1.15, 5.52);
  add(box(.01, .18, .3, M.black), x - .455, 1.15, 5.5);
  // coffee maker + mug
  add(box(.18, .26, .2, mat('#c9ced2', .4, .6)), x - .15, 1.15, 5.12);
  add(cyl(.032, .028, .075, M.white, 14), x - .26, 1.06, 5.12);
  // mini split AC
  add(box(.2, .26, .95, M.white), x - .1, 2.1, 5.55);
  add(box(.03, .05, .85, M.dark), x - .205, 2.0, 5.55);
  // light switch + outlet plate
  add(box(.012, .12, .08, M.white), x - .005, 1.2, 5.88);
}

// bathroom
{
  // vanity on north wall (z=2.6)
  add(box(1.0, .8, .5, mat('#eff1f1', .5)), 6.3, .4, 2.85);
  add(box(1.04, .04, .54, M.quartz), 6.3, .82, 2.85);
  add(box(.5, .02, .34, mat('#f8f8f6', .3)), 6.3, .835, 2.88);
  add(box(.18, .2, .04, M.metal), 6.3, .94, 2.68);
  for (let i = 0; i < 2; i++) { add(box(.4, .26, .015, mat('#e5e8e8', .5)), 6.12 + i * .4, .62, 3.105); add(box(.1, .012, .015, M.metal), 6.12 + i * .4, .72, 3.115); }
  // mirror (dark wood frame)
  add(box(.75, 1.0, .03, mat('#3c2a22', .5)), 6.3, 1.65, 2.63);
  const mir = plane(.68, .93, new THREE.MeshStandardMaterial({ color: '#e4edf1', metalness: .5, roughness: .08, emissive: '#aebcc4', emissiveIntensity: .5, envMapIntensity: 1.5 })); mir.rotation.y = 0; mir.position.set(6.3, 1.65, 2.65); scene.add(mir);
  // towels on bar
  add(box(.5, .02, .03, M.metal), 6.95, 1.2, 2.66);
  add(box(.28, .38, .04, M.white), 6.95, 1.0, 2.68);
  // toilet (west wall x=5.4)
  add(box(.4, .5, .62, M.white), 5.62, .25, 3.75);
  add(box(.2, .42, .5, M.white), 5.5, .58, 3.75);
  add(box(.3, .04, .4, mat('#fafafa', .3)), 5.67, .5, 3.75);
  // floating shelves
  for (const y of [1.25, 1.55]) { add(box(.2, .03, .8, M.white), 5.5, y, 3.75); for (const zz of [3.45, 4.05]) add(box(.06, .1, .02, mat('#5d5547', .6)), 5.42, y - .07, zz); }
  add(box(.012, .12, .08, M.white), 5.41, .35, 4.3);
  // shower: glass panel + frame
  add(box(.03, 2.05, 2.15, M.glass), 6.85, 1.03, 3.7).castShadow = false;
  add(box(.045, .04, 2.2, M.metal), 6.85, 2.06, 3.7); add(box(.045, 2.05, .04, M.metal), 6.85, 1.03, 2.62); add(box(.045, 2.05, .04, M.metal), 6.85, 1.03, 4.78);
  add(box(.04, .04, .6, M.metal), 6.82, 1.0, 4.2);
  // shower panel column, rain head
  add(box(.06, 1.4, .22, mat('#4a5058', .35, .6)), 7.55, 1.1, 3.7);
  const rh = cyl(.12, .12, .02, M.metal, 24); rh.position.set(7.35, 2.15, 3.7); scene.add(rh);
  add(cyl(.012, .012, .35, M.metal, 8), 7.5, 2.1, 3.7).rotation.z = Math.PI / 2;
  // bathroom light
  const bl = new THREE.PointLight('#fff1d8', 1.3, 4, 2); bl.position.set(6.5, 2.4, 3.7); scene.add(bl);
}

// exterior of building: BEACH HOUSE plaque on south wall
{
  const tex = canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#8e8780'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 7) { g.fillStyle = 'rgba(60,55,50,.25)'; g.fillRect(0, y, w, 2); }
    speckle(g, w, h, 1500, ['#6b655e', '#b3aca3'], 1, 3, .4);
    g.fillStyle = '#4a4540'; g.font = 'bold 62px "Courier New",monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BEACH HOUSE', w / 2 + 2, h / 2 + 4);
    g.fillStyle = '#d9d4cb'; g.fillText('BEACH HOUSE', w / 2, h / 2);
  }, { clamp: true });
  const p = plane(1.5, .38, new THREE.MeshStandardMaterial({ map: tex, roughness: .85, envMapIntensity: .2 }));
  p.position.set(1.7, 2.25, 6.405); scene.add(p);
  add(box(1.55, .42, .02, M.woodDark), 1.7, 2.25, 6.395);
  // wall lantern by door
  add(box(.1, .22, .1, mat('#e9e6df', .5)), 3.15, 1.9, 6.45);
}

/* ---------- OUTSIDE ---------- */
{
  // ground: grass base
  const base = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), M.grass); base.rotation.x = -Math.PI / 2; base.position.y = -.02; base.receiveShadow = true;
  const uv = base.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 60, uv.getY(i) * 60); scene.add(base);
  gravelTex.repeat.set(1, 1);
  const grav = new THREE.Mesh(new THREE.PlaneGeometry(40, 22), M.gravel); grav.rotation.x = -Math.PI / 2; grav.position.set(3, 0, 17.4); grav.receiveShadow = true;
  { const u = grav.geometry.attributes.uv; for (let i = 0; i < u.count; i++) u.setXY(i, u.getX(i) * 20, u.getY(i) * 11); } scene.add(grav);
  // gravel apron along building south
  const grav2 = new THREE.Mesh(new THREE.PlaneGeometry(14, 1.6), M.gravel); grav2.rotation.x = -Math.PI / 2; grav2.position.set(0.8, .001, 6.6); { const u = grav2.geometry.attributes.uv; for (let i = 0; i < u.count; i++) u.setXY(i, u.getX(i) * 7, u.getY(i) * .8); } scene.add(grav2);
  // patio tiles in front of door
  const pat = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.4), M.patio); pat.rotation.x = -Math.PI / 2; pat.position.set(2.9, .012, 7.6); pat.receiveShadow = true;
  { const u = pat.geometry.attributes.uv; for (let i = 0; i < u.count; i++) u.setXY(i, u.getX(i) * 6, u.getY(i) * 4); } scene.add(pat);
  // north lawn strip -> fence -> sea
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(900, 460), new THREE.MeshBasicMaterial({ map: seaTex, toneMapped: false, fog: false }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(0, -.6, -6.2 - 230); scene.add(sea);
  // fence
  for (let x = -24; x <= 24; x += 2.2) add(box(.14, 1.1, .14, M.white), x, .55, -5.2);
  add(box(50, .08, .1, M.white), 0, .9, -5.2); add(box(50, .08, .1, M.white), 0, .45, -5.2);
  // hedge
  const hd = box(5.2, 1.0, 1.0, M.grass, 1.2); add(hd, -4.6, .5, 8.5);
  // rock cluster by door
  for (let i = 0; i < 9; i++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rnd(.1, .2), 0), M.stone); r.position.set(3.45 + rnd(-.5, .9), .08, 6.9 + rnd(-.1, .6)); r.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); r.scale.y = .6; r.castShadow = true; scene.add(r); }
  // planting bed with croton
  add(box(1.6, .22, .7, M.stucco), 4.1, .11, 6.75);
  const croton = sph(.22, .17, .22, mat('#e0a920', .8)); croton.position.set(4.55, .35, 6.75); scene.add(croton);
  add(cyl(.2, .15, .35, mat('#e4dcc9', .8), 16), 3.5, .175, 6.75);
  const croton2 = sph(.25, .2, .25, mat('#e3b324', .8)); croton2.position.set(3.5, .5, 6.75); scene.add(croton2);
  // patio chairs
  for (const [x, z, yaw] of [[3.0, 6.9, -.2], [3.7, 7.5, .35]]) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = yaw + Math.PI; scene.add(g);
    add(box(.52, .06, .5, M.patioChair, .4), 0, .45, 0, g);
    const bk = box(.52, .5, .05, M.patioChair, .4); bk.position.set(0, .75, -.24); bk.rotation.x = -.15; g.add(bk);
    for (const [lx, lz] of [[-.24, -.22], [.24, -.22], [-.24, .22], [.24, .22]]) add(cyl(.014, .014, .45, M.dark, 8), lx, .225, lz, g);
    add(box(.55, .02, .02, M.dark), 0, .43, .25, g);
  }
  // picnic tables far west
  for (const [x, z] of [[-9, 8], [-9, 11]]) { add(box(1.9, .06, .8, mat('#c9a77d', .8)), x, .75, z); add(box(1.9, .06, .3, mat('#c9a77d', .8)), x, .45, z + .7); add(box(1.9, .06, .3, mat('#c9a77d', .8)), x, .45, z - .7); }
}
function palm(x, z, h, lean, dirA, scale = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const dx = Math.cos(dirA) * lean, dz = Math.sin(dirA) * lean;
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(dx * .25, h * .5, dz * .25), new THREE.Vector3(dx, h, dz)]);
  const tm = trunkTex.clone(); tm.needsUpdate = true; tm.wrapS = tm.wrapT = THREE.RepeatWrapping; tm.repeat.set(1, 14);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, .13 * scale, 10, false), new THREE.MeshStandardMaterial({ map: tm, roughness: .95, envMapIntensity: .2 }));
  tube.castShadow = true; g.add(tube);
  const crown = new THREE.Group(); crown.position.set(dx, h, dz); g.add(crown);
  for (let i = 0; i < 13; i++) {
    const L = (1.9 + Math.random() * .6) * scale, Wd = .62 * scale;
    const geo = new THREE.PlaneGeometry(Wd, L, 4, 12); geo.rotateX(Math.PI / 2); geo.translate(0, 0, L / 2);
    const p = geo.attributes.position; for (let k = 0; k < p.count; k++) { const s = p.getZ(k) / L; p.setY(k, p.getY(k) - s * s * L * .55); }
    geo.computeVertexNormals();
    const fr = new THREE.Mesh(geo, M.frond); fr.castShadow = true;
    const pv = new THREE.Group(); pv.rotation.order = 'YXZ'; pv.rotation.y = i / 13 * Math.PI * 2 + rnd(-.2, .2); pv.rotation.x = -rnd(.25, .75); pv.add(fr); crown.add(pv);
  }
  for (let i = 0; i < 4; i++) { const c = sph(.07, .09, .07, mat('#7a5a2a', .8)); c.position.set(rnd(-.12, .12), -.08, rnd(-.12, .12)); crown.add(c); }
}
for (const [x, z, h, lean, a] of [[-1.5, -2.6, 6.2, 1.2, .6], [3.2, -3.6, 7, -.8, 2.4], [-5.5, -3.3, 5.8, 1.5, 3.2], [8.5, -2.5, 6.6, .6, 3.8], [12, -3.4, 6.2, -1, 1.2],
  [4.9, 8.6, 5.6, 1.1, 5.2], [-3.6, 7.2, 5.2, -.9, 1.9], [-6, 6.1, 6.4, 1.0, 5.5], [9.8, 8.2, 5.8, -.7, 2.3], [5.9, 12.5, 6.8, .8, 4.0], [-1, 13, 7, 1.0, 5.0], [-9, -2.5, 6.4, 1.1, .1]])
  palm(x, z, h, lean, a, 1);

/* sky + clouds + sun */
const skyU = { top: { value: new THREE.Color('#3b8de0') }, hor: { value: new THREE.Color('#d0eaff') }, bot: { value: new THREE.Color('#9ac7e8') } };
const sky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
  vertexShader: 'varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'uniform vec3 top;uniform vec3 hor;uniform vec3 bot;varying vec3 p;void main(){float h=p.y;vec3 c=h>0.?mix(hor,top,pow(clamp(h*1.4,0.,1.),.55)):mix(hor,bot,clamp(-h*3.,0.,1.));gl_FragColor=vec4(c,1.);}' }));
sky.renderOrder = -10; scene.add(sky);
const clouds = [];
for (let i = 0; i < 12; i++) {
  const c = new THREE.Mesh(new THREE.PlaneGeometry(rnd(90, 180), rnd(30, 55)), new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, opacity: rnd(.6, .95), toneMapped: false }));
  const a = rnd(-1.9, 1.9) + Math.PI, r = 380; c.position.set(Math.sin(a) * r, rnd(50, 130), -Math.cos(a) * r * .9 - 60); c.lookAt(0, 20, 0); scene.add(c); clouds.push(c);
}
const stars = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 1.6, color: '#fff', fog: false, transparent: true, opacity: 0, sizeAttenuation: false }));
{ const pos = []; for (let i = 0; i < 600; i++) { const t = Math.random() * Math.PI * 2, u = Math.random() * .9 + .08, r = Math.sqrt(1 - u * u); pos.push(Math.cos(t) * r * 480, u * 480, Math.sin(t) * r * 480); } stars.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); }
scene.add(stars);
const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(16, 32), new THREE.MeshBasicMaterial({ color: '#fff6d8', fog: false, toneMapped: false })); scene.add(sunDisc);

/* lights */
const hemi = new THREE.HemisphereLight('#dbeeff', '#e9dcc2', 1.0); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1d4', 2.4); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = -12; sc.right = 14; sc.top = 14; sc.bottom = -12; sc.near = 1; sc.far = 80; sun.shadow.bias = -.0004; sun.shadow.normalBias = .04;
scene.add(sun); scene.add(sun.target); sun.target.position.set(3, 0, 3);
const ceilLights = [];
for (const [x, z] of [[1.95, .78], [3.25, 3.88], [.65, 4.55], [1.95, 5.45]]) { const l = new THREE.PointLight('#fff0d6', 1.4, 7, 2); l.position.set(x, H - .35, z); scene.add(l); ceilLights.push(l); }
const alcLight = new THREE.PointLight('#fff0d6', 2.2, 4.5, 2); alcLight.position.set(5.9, 2.2, 5.6); scene.add(alcLight); ceilLights.push(alcLight);
const fanLight = new THREE.PointLight('#ffd9a0', 1.0, 4.5, 2); fanLight.position.set(2.6, 2.3, 3.1); scene.add(fanLight); ceilLights.push(fanLight);
scene.fog = new THREE.Fog('#d0eaff', 45, 520);

const PRESETS = {
  day: { top: '#2f84df', hor: '#cfe9ff', bot: '#9ac7e8', hemi: [1.15, '#dcefff', '#ead9bb'], sun: [2.6, '#fff1d4'], sunPos: [-18, 34, 26], ceil: .15, fog: '#cfe9ff', exp: 1.0, stars: 0, lamp: 1.4, tv: 1 },
  sunset: { top: '#4b5aa0', hor: '#ffb083', bot: '#c9805f', hemi: [.55, '#ffd9bd', '#c99872'], sun: [2.0, '#ff9c5a'], sunPos: [-34, 9, 20], ceil: .65, fog: '#f2b48e', exp: 1.0, stars: 0, lamp: 2.4, tv: 1 },
  night: { top: '#050a1c', hor: '#1a2a52', bot: '#0b1226', hemi: [.12, '#5f78bb', '#2b2f44'], sun: [.35, '#8fa8ff'], sunPos: [26, 40, -18], ceil: 1.0, fog: '#0b1530', exp: 1.15, stars: 1, lamp: 3.2, tv: 1.15 },
};
let tod = 'day';
function setTOD(name) {
  tod = name; const p = PRESETS[name];
  skyU.top.value.set(p.top); skyU.hor.value.set(p.hor); skyU.bot.value.set(p.bot);
  hemi.intensity = p.hemi[0]; hemi.color.set(p.hemi[1]); hemi.groundColor.set(p.hemi[2]);
  sun.intensity = p.sun[0]; sun.color.set(p.sun[1]); sun.position.set(sun.target.position.x + p.sunPos[0], p.sunPos[1], sun.target.position.z + p.sunPos[2]);
  sunDisc.visible = name !== 'night'; sunDisc.material.color.set(name === 'sunset' ? '#ffb070' : '#fff6d8');
  sunDisc.position.copy(sun.position).normalize().multiplyScalar(450); sunDisc.lookAt(0, 0, 0);
  scene.fog.color.set(p.fog); renderer.toneMappingExposure = p.exp; stars.material.opacity = p.stars;
  for (const l of ceilLights) l.intensity = (l === fanLight ? 1.0 : l === alcLight ? 2.2 : 1.4) * (p.ceil / .15) * .6 + (name === 'day' ? 0 : 0);
  lampLight.intensity = p.lamp;
  for (const c of clouds) c.material.color.set(name === 'night' ? '#38456b' : name === 'sunset' ? '#ffc9a6' : '#ffffff');
  document.querySelectorAll('#tod button').forEach(b => b.classList.toggle('on', b.dataset.t === name));
}

/* ---------- player / collision ---------- */
const WALK = [   // deflated walkable rects [x0,z0,x1,z1]
  [.22, .22, 4.98, 5.98], [4.9, 5.22, 6.38, 5.98], [5.87, 4.5, 6.23, 5.3], [5.62, 2.82, 7.38, 4.58],
  [-14, 6.65, 24, 28],
];
const OBS = [ // [x0,z0,x1,z1] obstacles (inflated by R at test time)
  [3.1, .1, 5.2, 3.9], [0, 4.0, .52, 5.4], [0, 2.35, .45, 3.4], [6.05, 5.0, 6.6, 6.0],
  [5.4, 2.6, 6.85, 3.15], [5.4, 3.45, 5.95, 4.05], [6.8, 2.6, 7.6, 4.8],
];
const inRect = (x, z, r) => x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3];
function walkable(x, z) {
  let ok = WALK.some(r => inRect(x, z, r));
  if (!ok && entry.open && inRect(x, z, [2.22, 5.9, 2.68, 6.75])) ok = true;
  if (!ok) return false;
  for (const o of OBS) if (inRect(x, z, [o[0] - R, o[1] - R, o[2] + R, o[3] + R])) return false;
  return true;
}
// outdoor obstacles (palm trunks, hedge, tables) - keep it simple: a few circles
const CIRC = [[4.9, 8.6, .4], [-3.6, 7.2, .4], [-6, 6.1, .4], [9.8, 8.2, .4], [5.9, 12.5, .4], [-1, 13, .4], [3.0, 6.9, .3], [3.7, 7.5, .3], [3.5, 6.75, .3]];
function free(x, z) { if (!walkable(x, z)) return false; for (const c of CIRC) if (Math.hypot(x - c[0], z - c[1]) < c[2] + R) return false; if (z > 8 && z < 9 && x > -7.5 && x < -2) return false; return true; }

const P = { x: 2.45, z: 9.2, yaw: 0, pitch: 0, eye: EYE };
const keys = {}; let locked = false, started = false;
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (!started) return;
  if (e.code === 'KeyE') toggleNearestDoor();
  if (e.code === 'Digit1') setTOD('day'); if (e.code === 'Digit2') setTOD('sunset'); if (e.code === 'Digit3') setTOD('night');
});
addEventListener('keyup', e => { keys[e.code] = false; });
const cv = renderer.domElement;
let drag = false, lx = 0, ly = 0;
function look(dx, dy) { P.yaw -= dx * .0024; P.pitch = Math.max(-1.35, Math.min(1.35, P.pitch - dy * .0024)); }
cv.addEventListener('mousedown', e => { drag = true; lx = e.clientX; ly = e.clientY; });
addEventListener('mouseup', () => { drag = false; });
addEventListener('mousemove', e => {
  if (locked) look(e.movementX, e.movementY);
  else if (drag) { look(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY; }
});
cv.addEventListener('dblclick', () => { cv.requestPointerLock && cv.requestPointerLock(); });
document.addEventListener('pointerlockchange', () => { locked = document.pointerLockElement === cv; });
// touch look
let tId = null, tx = 0, ty = 0;
cv.addEventListener('touchstart', e => { const t = e.changedTouches[0]; tId = t.identifier; tx = t.clientX; ty = t.clientY; }, { passive: true });
cv.addEventListener('touchmove', e => { for (const t of e.changedTouches) if (t.identifier === tId) { look(t.clientX - tx, t.clientY - ty); tx = t.clientX; ty = t.clientY; } }, { passive: true });

function nearestDoor() {
  let best = null, bd = 2.0;
  for (const d of doors) {
    const cx = d.hx + Math.cos(d.rotClosed) * d.w / 2, cz = d.hz;
    const dist = Math.hypot(P.x - cx, P.z - cz);
    if (dist < bd) { bd = dist; best = d; }
  }
  return best;
}
function toggleNearestDoor() { const d = nearestDoor(); if (d) d.open = !d.open; }

/* viewpoints */
const VIEWS = [
  ['Outside · Door 14', 2.45, 9.2, 0, -.02],
  ['Beds', .5, 2.1, -Math.PI / 2, -.03],
  ['TV wall', 3.0, 1.15, 1.85, -.02],
  ['Ocean window', 2.5, 4.4, 0, -.02],
  ['Kitchenette', 2.3, 4.5, -Math.PI / 2 - .35, -.06],
  ['Bathroom', 6.3, 4.35, -.15, -.12],
  ['Patio & ocean', -3.2, 6.3, -.55, -.02],
];
const PHOTO_VIEWS = [1, 2, 6, 4, 5, 3, 1, 0, 4];       // photo i -> VIEWS index (approx)
const PHOTO_CAM = [
  [.5, 2.1, -Math.PI / 2 + .1, -.02], [3.1, 1.3, 1.75, -.02], [-3.0, 7.3, -.35, -.02],
  [3.1, 4.6, 2.2, -.02], [6.1, 5.6, 0, -.04], [2.2, 3.3, 0.15, -.03],
  [1.6, 1.8, -Math.PI / 2, -.02], [2.45, 9.4, .02, -.0], [3.5, 5.6, -Math.PI / 2 - .1, -.05],
];
function goto(x, z, yaw, pitch) { P.x = x; P.z = z; P.yaw = yaw; P.pitch = pitch; }
{
  const vb = document.getElementById('views');
  VIEWS.forEach(v => { const b = document.createElement('button'); b.textContent = v[0]; b.onclick = () => goto(v[1], v[2], v[3], v[4]); vb.appendChild(b); });
  const pg = document.getElementById('pgrid');
  for (let i = 0; i < 9; i++) { const im = document.createElement('img'); im.src = `photos/p${i + 1}.jpg`; im.title = `Photo ${i + 1}`; im.onclick = () => goto(...PHOTO_CAM[i]); pg.appendChild(im); }
  document.getElementById('photos').style.display = 'block';
  document.querySelectorAll('#tod button').forEach(b => b.onclick = () => setTOD(b.dataset.t));
  document.getElementById('go').onclick = () => { document.getElementById('start').style.display = 'none'; started = true; };
}

/* ---------- minimap ---------- */
const mc = document.getElementById('mc'), mg = mc.getContext('2d');
const MX0 = -1.5, MZ0 = -1.2, MS = 40;     // px per m
function drawMap() {
  mg.clearRect(0, 0, mc.width, mc.height);
  mg.fillStyle = '#eaf4f4'; mg.fillRect(0, 0, mc.width, mc.height);
  const tx = x => (x - MX0) * MS, tz = z => (z - MZ0) * MS;
  mg.fillStyle = '#fff'; mg.strokeStyle = '#10324a';
  mg.fillRect(tx(0), tz(0), 5.2 * MS, 6.2 * MS); mg.fillRect(tx(5.2), tz(5), 1.4 * MS, 1.2 * MS); mg.fillRect(tx(5.4), tz(2.6), 2.2 * MS, 2.2 * MS);
  mg.fillStyle = '#10324a';
  for (const r of planRects) mg.fillRect(tx(r[0]), tz(r[1]), (r[2] - r[0]) * MS, (r[3] - r[1]) * MS);
  mg.fillStyle = '#7fb0d2'; for (const o of OBS) mg.fillRect(tx(o[0]), tz(o[1]), (o[2] - o[0]) * MS, (o[3] - o[1]) * MS);
  for (const d of doors) { mg.strokeStyle = d.open ? '#2a9d6e' : '#c0392b'; mg.lineWidth = 3; mg.beginPath(); mg.moveTo(tx(d.hx), tz(d.hz)); mg.lineTo(tx(d.hx + d.w), tz(d.hz)); mg.stroke(); }
  mg.fillStyle = '#e0572a'; mg.beginPath(); mg.arc(tx(P.x), tz(P.z), 6, 0, 7); mg.fill();
  mg.strokeStyle = '#e0572a'; mg.lineWidth = 3; mg.beginPath(); mg.moveTo(tx(P.x), tz(P.z)); mg.lineTo(tx(P.x - Math.sin(P.yaw) * .9), tz(P.z - Math.cos(P.yaw) * .9)); mg.stroke();
}


/* ---------- scripted tour (used for video: ?tour) ---------- */
const TOUR = new URLSearchParams(location.search).has('tour');
if (TOUR) {
  document.querySelectorAll('.card,#start').forEach(e => e.style.display = 'none');
  document.body.style.background = '#0b2a3d'; started = true; renderer.setPixelRatio(1); renderer.setSize(innerWidth, innerHeight);
  const cap = document.createElement('div');
  cap.style.cssText = 'position:fixed;left:0;right:0;bottom:7%;text-align:center;font:600 34px "Segoe UI",system-ui,sans-serif;color:#fff;text-shadow:0 2px 14px rgba(0,30,50,.75),0 0 3px rgba(0,30,50,.8);letter-spacing:.3px;transition:none';
  document.body.appendChild(cap);
  const KF = [ // t, x, z, yaw, pitch
    [0, 2.45, 10.5, 0, -.02], [5, 2.45, 7.6, 0, -.02], [7, 2.45, 6.6, .02, -.02], [9, 2.45, 5.6, .1, -.03],
    [12, 2.2, 4.4, -.9, -.03], [16, 1.3, 3.4, -1.45, -.02], [20, .9, 2.2, -1.57, -.02],
    [24, 2.6, 1.4, .6, 0], [28, 3.0, 1.15, 1.85, -.02], [31, 2.8, 1.8, 1.85, -.02],
    [34, 2.5, 3.6, .4, -.02], [36, 2.5, 3.6, 0, 0], [38.5, 2.5, 3.6, 0, .5], [40.5, 2.5, 3.8, 0, 0],
    [43, 3.0, 4.9, -1.7, -.03], [46.5, 4.6, 5.5, -1.57, -.03], [49.5, 5.9, 5.5, 0, -.03], [52.5, 6.0, 4.4, -.1, -.1], [56, 6.2, 4.3, -.35, -.1],
  ];
  const DUR = KF[KF.length - 1][0];
  // unwrap yaw
  for (let i = 1; i < KF.length; i++) { while (KF[i][3] - KF[i - 1][3] > Math.PI) KF[i][3] -= 2 * Math.PI; while (KF[i][3] - KF[i - 1][3] < -Math.PI) KF[i][3] += 2 * Math.PI; }
  const CAPS = [[0.3, 'Seascape Marina & Resort · Room 14 "Beach House"'], [9.5, 'Walk in: two queen beds, coffered ceiling'], [27, 'Seafoam dresser & TV wall'], [34.5, 'Ocean-view windows'], [42, 'Kitchenette nook'], [50, 'En-suite bath with walk-in shower'], [54, '3D concept built from listing photos · Elettro']];
  const cr = (p0, p1, p2, p3, u) => .5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
  window.__tourDur = DUR;
  window.__renderAt = (t) => {
    t = Math.min(t, DUR);
    let i = 0; while (i < KF.length - 2 && t > KF[i + 1][0]) i++;
    const u0 = (t - KF[i][0]) / (KF[i + 1][0] - KF[i][0]), u = u0 * u0 * (3 - 2 * u0) * .5 + u0 * .5;   // gentle ease
    const g = k => cr(KF[Math.max(0, i - 1)][k], KF[i][k], KF[i + 1][k], KF[Math.min(KF.length - 1, i + 2)][k], u);
    P.x = g(1); P.z = g(2); P.yaw = g(3); P.pitch = g(4);
    entry.t = Math.max(0, Math.min(1, (t - 3) / 2.5)); entry.pivot.rotation.y = entry.rotClosed + (entry.rotOpen - entry.rotClosed) * entry.t;
    fan.userData.blades.rotation.y = -t * 2.2;
    camera.position.set(P.x, 1.55, P.z); camera.rotation.set(P.pitch, P.yaw, 0);
    sky.position.copy(camera.position); stars.position.copy(camera.position);
    let txt = ''; for (const c of CAPS) if (t >= c[0]) txt = c[1];
    cap.textContent = txt;
    const fade = Math.min(1, t / .6, (DUR - t) / .8); cv.style.opacity = fade;
    renderer.render(scene, camera);
  };
}

/* ---------- loop ---------- */
const clock = new THREE.Clock();
const prompt = document.getElementById('prompt');
let vel = new THREE.Vector2();
function frame() {
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  if (started) {
    const fw = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
    const st = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
    if (keys.ArrowLeft) P.yaw += 1.8 * dt; if (keys.ArrowRight) P.yaw -= 1.8 * dt;
    const sp = (keys.ShiftLeft || keys.ShiftRight ? 3.4 : 1.7);
    const fx = -Math.sin(P.yaw), fz = -Math.cos(P.yaw), rx = Math.cos(P.yaw), rz = -Math.sin(P.yaw);
    const tvx = (fx * fw + rx * st) * sp, tvz = (fz * fw + rz * st) * sp;
    vel.x += (tvx - vel.x) * Math.min(1, dt * 10); vel.y += (tvz - vel.y) * Math.min(1, dt * 10);
    const nx = P.x + vel.x * dt, nz = P.z + vel.y * dt;
    if (free(nx, P.z)) P.x = nx; else vel.x = 0;
    if (free(P.x, nz)) P.z = nz; else vel.y = 0;
  }
  // doors animate
  for (const d of doors) { d.t += ((d.open ? 1 : 0) - d.t) * Math.min(1, dt * 5); d.pivot.rotation.y = d.rotClosed + (d.rotOpen - d.rotClosed) * d.t; }
  const nd = started ? nearestDoor() : null;
  if (nd) { prompt.style.display = 'block'; prompt.textContent = `Press E to ${nd.open ? 'close' : 'open'} the ${nd.name}`; } else prompt.style.display = 'none';
  // fan
  fan.userData.blades.rotation.y -= dt * 2.2;
  // camera
  const bob = started ? Math.sin(t * 8) * .008 * Math.min(1, vel.length()) : 0;
  camera.position.set(P.x, P.eye + bob, P.z); camera.rotation.set(P.pitch, P.yaw, 0);
  sky.position.copy(camera.position); stars.position.copy(camera.position);
  for (const c of clouds) c.position.x += dt * .4;
  // sun shadows follow
  renderer.render(scene, camera);
  drawMap();
  requestAnimationFrame(frame);
}
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
setTOD('day'); goto(...VIEWS[0].slice(1));
if (!TOUR) requestAnimationFrame(frame);
window.__room = { P, goto, setTOD, doors, camera };
