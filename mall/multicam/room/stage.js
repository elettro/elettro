import * as THREE from 'three';
import { RelayLink } from '../../remote/room/relay.js';
import { SHEETS } from './data.js';

const $ = id => document.getElementById(id);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const std = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: .65, metalness: .1 }, o));
const basic = (color, o = {}) => new THREE.MeshBasicMaterial(Object.assign({ color }, o));

/* ---------- renderer / scene ---------- */
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#05080f'); scene.fog = new THREE.FogExp2('#05080f', .016);
const camera = new THREE.PerspectiveCamera(68, 1, .05, 220); camera.rotation.order = 'YXZ';
function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.add(new THREE.HemisphereLight('#9fb6ff', '#1a1020', .85));
const pl = [['#ff4f9a', -7, 9, -16], ['#4fd8ff', 7, 9, -16], ['#ffd23f', 0, 10, -21]].map(([c, x, y, z]) => { const l = new THREE.PointLight(c, 70, 34, 2); l.position.set(x, y, z); scene.add(l); return l; });

const texLoader = new THREE.TextureLoader();
const cvTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); if (draw) draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return { t, c, g }; };

/* ---------- hall ---------- */
const HALL = { x: 17, zf: 17, zb: -26.5, h: 16 };
{
  const grid = cvTex(1024, 1024, (g, w, h) => { g.fillStyle = '#0a1020'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(79,216,255,.10)'; g.lineWidth = 2; for (let i = 0; i <= 16; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } });
  grid.t.wrapS = grid.t.wrapT = THREE.RepeatWrapping; grid.t.repeat.set(7, 9);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(HALL.x * 2, HALL.zf - HALL.zb), new THREE.MeshStandardMaterial({ map: grid.t, roughness: .45, metalness: .35 }));
  f.rotation.x = -Math.PI / 2; f.position.set(0, 0, (HALL.zf + HALL.zb) / 2); scene.add(f);
  const wallM = std('#0b1226', { roughness: .9 });
  const mk = (w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM); m.position.set(x, y, z); m.rotation.y = ry; scene.add(m); return m; };
  const L = HALL.zf - HALL.zb, C = (HALL.zf + HALL.zb) / 2;
  mk(L, HALL.h, -HALL.x, HALL.h / 2, C, Math.PI / 2); mk(L, HALL.h, HALL.x, HALL.h / 2, C, -Math.PI / 2); mk(HALL.x * 2, HALL.h, 0, HALL.h / 2, HALL.zf, Math.PI);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(HALL.x * 2, L), std('#05070d')); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, HALL.h, C); scene.add(ceil);
  [['#4fd8ff', 6.2], ['#ff4f9a', 6.55]].forEach(([c, y]) => { [-1, 1].forEach(s => { const t = new THREE.Mesh(new THREE.BoxGeometry(.06, .06, L), basic(c)); t.position.set(s * (HALL.x - .04), y + 2.6, C); scene.add(t); }); });
}

/* ---------- stage ---------- */
const STAGE = { x0: -10, x1: 10, z0: -25, z1: -14, y: 1.2 };
{
  const s = new THREE.Mesh(new THREE.BoxGeometry(20, STAGE.y, 11), std('#141c33', { roughness: .5, metalness: .3 })); s.position.set(0, STAGE.y / 2, -19.5); scene.add(s);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(20, .06, .06), basic('#ff4f9a')); edge.position.set(0, STAGE.y, -14); scene.add(edge);
  // LED backdrop (generative, never a camera feed: avoids render feedback)
  const led = cvTex(1024, 448); const lm = new THREE.Mesh(new THREE.PlaneGeometry(19, 8.4), new THREE.MeshBasicMaterial({ map: led.t, toneMapped: false })); lm.position.set(0, 5.6, -25.2); scene.add(lm); window.__led = led;
  const trussM = std('#2a3350', { metalness: .6, roughness: .4 });
  const tr = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), trussM); m.position.set(x, y, z); scene.add(m); };
  tr(21, .35, .35, 0, 11.6, -14.6); tr(21, .35, .35, 0, 11.6, -24); tr(.35, .35, 9.8, -10.3, 11.6, -19.3); tr(.35, .35, 9.8, 10.3, 11.6, -19.3); tr(.4, 11.6, .4, -10.3, 5.8, -14.6); tr(.4, 11.6, .4, 10.3, 5.8, -14.6);
  [-8, -3, 3, 8].forEach(x => { const a = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.1, .8), std('#10141f')); a.position.set(x, STAGE.y + .55, -24.2); scene.add(a); });
}

/* ---------- people ---------- */
function person(shirt, hair = '#241a14') {
  const g = new THREE.Group(), mS = std(shirt, { roughness: .7 }), mK = std('#d3a07a'), mP = std('#161d30');
  const legs = [-.12, .12].map(x => { const m = new THREE.Mesh(new THREE.BoxGeometry(.17, .85, .2), mP); m.position.set(x, .43, 0); g.add(m); return m; });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(.52, .68, .28), mS); torso.position.y = 1.2; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 12), mK); head.position.y = 1.72; g.add(head);
  const hr = new THREE.Mesh(new THREE.SphereGeometry(.185, 16, 8, 0, 6.283, 0, 1.45), std(hair)); hr.position.y = 1.74; g.add(hr);
  const arm = sx => { const p = new THREE.Group(); p.position.set(sx * .33, 1.45, 0); const a = new THREE.Mesh(new THREE.BoxGeometry(.11, .62, .11), mS); a.position.y = -.31; p.add(a); const h = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 8), mK); h.position.y = -.64; p.add(h); g.add(p); return p; };
  return { g, torso, head, legs, armL: arm(-1), armR: arm(1) };
}
function axe(col, bass) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(.5, .38, .07), std(col, { roughness: .35, metalness: .3 })); g.add(b); const n = new THREE.Mesh(new THREE.BoxGeometry(bass ? 1.0 : .85, .06, .04), std('#3b2a1c')); n.position.set(.62, .08, 0); g.add(n); const h = new THREE.Mesh(new THREE.BoxGeometry(.16, .1, .04), std('#1b1b1b')); h.position.set(bass ? 1.18 : 1.1, .08, 0); g.add(h); return g; }

const singer = person('#ff4f9a'), guitarist = person('#4fd8ff', '#3a2a10'), bassist = person('#ffd23f', '#111'), drummer = person('#7dff9a', '#3b2a1f');
const POS = { singer: V3(0, STAGE.y, -16.4), guitar: V3(-5.5, STAGE.y, -18), bass: V3(5.5, STAGE.y, -18), drum: V3(0, STAGE.y, -22) };
[[singer, POS.singer], [guitarist, POS.guitar], [bassist, POS.bass], [drummer, POS.drum]].forEach(([p, v]) => { p.g.position.copy(v); scene.add(p.g); });
const gtr = axe('#ff4f9a'); gtr.position.set(.0, 1.0, .22); gtr.rotation.z = .55; guitarist.g.add(gtr);
const bs = axe('#222a44', true); bs.position.set(0, 1.0, .22); bs.rotation.z = .35; bassist.g.add(bs);
// mic stand
{ const p = new THREE.Mesh(new THREE.CylinderGeometry(.015, .02, 1.6, 8), std('#111')); p.position.set(.2, .8, .5); singer.g.add(p); const m = new THREE.Mesh(new THREE.SphereGeometry(.05, 10, 8), std('#222')); m.position.set(.2, 1.65, .5); singer.g.add(m); }
// drummer seated + kit
drummer.g.position.y = STAGE.y - .32; drummer.legs.forEach((l, i) => { l.position.set((i ? .12 : -.12), .65, .28); l.rotation.x = -1.2; });
{
  const metal = std('#b8c0d8', { metalness: .8, roughness: .3 }), shell = std('#ff4f9a', { roughness: .35, metalness: .2 }), head = std('#f0f4ff');
  const cyl = (r, h, x, y, z, mat, rx = 0) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), mat); m.position.set(x, y, z); m.rotation.x = rx; drummer.g.add(m); return m; };
  cyl(.4, .5, 0, .72, 1.05, shell, Math.PI / 2); cyl(.17, .16, -.3, 1.1, .55, shell); cyl(.19, .22, -.2, 1.35, 1.0, shell); cyl(.19, .22, .32, 1.35, 1.0, shell); cyl(.25, .42, .85, .9, .65, shell);
  [[-.95, 1.5, .55, .26], [.95, 1.75, .85, .3], [-.65, 1.8, .95, .32]].forEach(([x, y, z, r]) => { cyl(r, .015, x, y, z, metal); cyl(.012, y - .4, x, (y - .4) / 2 + .25 - .25, z, metal); });
  cyl(.28, .01, .0, 1.4, 1.35, head);
}

/* ---------- crowd ---------- */
const CROWD = []; { for (let z = -12.5; z <= -5.5; z += 1.25) for (let x = -9; x <= 9; x += 1.3) { CROWD.push({ x: x + (Math.random() - .5) * .6, z: z + (Math.random() - .5) * .5, ph: Math.random() * 6.28, ph2: Math.random() * 6.28, phone: Math.random() < .32 }); } }
const crowdMesh = new THREE.InstancedMesh(new THREE.CapsuleGeometry(.22, .72, 4, 10), std('#0d1426', { roughness: .9 }), CROWD.length); crowdMesh.frustumCulled = false; scene.add(crowdMesh);
const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(.17, 10, 8), std('#161d33', { roughness: .9 }), CROWD.length); heads.frustumCulled = false; scene.add(heads);
const phones = CROWD.filter(c => c.phone); const phoneMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(.09, .16, .015), basic('#bfe6ff'), phones.length); phoneMesh.frustumCulled = false; scene.add(phoneMesh);
const dummy = new THREE.Object3D();
function updateCrowd(t) {
  CROWD.forEach((c, i) => { const b = Math.sin(t * 1.6 + c.ph) * .035; dummy.position.set(c.x + Math.sin(t * .5 + c.ph2) * .05, .72 + b, c.z); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); crowdMesh.setMatrixAt(i, dummy.matrix); dummy.position.y = 1.62 + b; dummy.updateMatrix(); heads.setMatrixAt(i, dummy.matrix); });
  crowdMesh.instanceMatrix.needsUpdate = true; heads.instanceMatrix.needsUpdate = true;
  phones.forEach((c, i) => { dummy.position.set(c.x + .18, 2.05 + Math.sin(t * .9 + c.ph) * .04, c.z - .2); dummy.rotation.set(-.15, 0, Math.sin(t * .7 + c.ph2) * .06); dummy.updateMatrix(); phoneMesh.setMatrixAt(i, dummy.matrix); });
  phoneMesh.instanceMatrix.needsUpdate = true;
}

/* ---------- stage lights (slow smooth sweeps, no strobing) ---------- */
const beams = [['#ff4f9a', -8, 11.4, -15], ['#4fd8ff', 8, 11.4, -15], ['#ffd23f', -3, 11.4, -23.5], ['#c58bff', 3, 11.4, -23.5], ['#7dff9a', 0, 11.4, -15]].map(([c, x, y, z], i) => {
  const geo = new THREE.ConeGeometry(1.7, 13, 28, 1, true); geo.translate(0, -6.5, 0);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
  m.position.set(x, y, z); m.frustumCulled = false; scene.add(m); return { m, i };
});
const _q = new THREE.Quaternion(), _d = new THREE.Vector3(), _dn = V3(0, -1, 0);
function updateBeams(t) { beams.forEach(({ m, i }) => { _d.set(Math.sin(t * .22 + i * 1.7) * 6, -10.2, -18 + Math.cos(t * .17 + i * 2.3) * 3).sub(m.position).normalize(); _q.setFromUnitVectors(_dn, _d); m.quaternion.copy(_q); }); }

/* ---------- the six cameras ---------- */
const CAMS = [
  { id: 'wide', name: 'WIDE', col: '#4fd8ff', pos: V3(0, 3.4, -10.4), look: V3(0, 2.3, -19), fov: 54, pole: true },
  { id: 'singer', name: 'SINGER', col: '#ff4f9a', pos: V3(2.4, 1.95, -11.8), look: V3(0, 2.75, -16.4), fov: 32, pole: true },
  { id: 'guitar', name: 'GUITAR', col: '#ffd23f', pos: V3(-9.2, 2.7, -13.6), look: V3(-4.4, 2.7, -17.4), fov: 36, pole: true },
  { id: 'drums', name: 'DRUMS', col: '#7dff9a', pos: V3(4.2, 4.8, -13.1), look: V3(0, 2.4, -22), fov: 40, pole: true },
  { id: 'roam', name: 'ROAMING', col: '#c58bff', pos: V3(0, 1.8, -7.4), look: V3(0, 2.4, -18), fov: 58, roam: true },
  { id: 'behind', name: 'BEHIND KIT', col: '#ff9a4f', pos: V3(-2.6, 3.2, -23.7), look: V3(0, 2.2, -9), fov: 62 },
];
const RTW = 512, RTH = 288;
const overlay = new THREE.Group(); scene.add(overlay); // labels + frustums, hidden while cameras render
const gantry = new THREE.Group(); scene.add(gantry); // monitors, hidden while cameras render
function label(text, col, w = 1.7) { const t = cvTex(256, 64, (g, W, H) => { g.fillStyle = 'rgba(7,11,20,.85)'; g.roundRect(2, 2, W - 4, H - 4, 14); g.fill(); g.strokeStyle = col; g.lineWidth = 3; g.stroke(); g.fillStyle = '#fff'; g.font = '800 30px "Segoe UI",Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H / 2 + 2); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t.t, depthWrite: false, fog: false })); s.scale.set(w, w / 4, 1); return s; }
CAMS.forEach((c, i) => {
  c.i = i; c.rt = new THREE.WebGLRenderTarget(RTW, RTH, { samples: 2 }); c.rt.texture.colorSpace = THREE.SRGBColorSpace;
  c.cam = new THREE.PerspectiveCamera(c.fov, RTW / RTH, .25, 160); c.cam.position.copy(c.pos); c.cam.lookAt(c.look);
  const rig = new THREE.Group(); rig.position.copy(c.pos); rig.quaternion.copy(c.cam.quaternion); scene.add(rig); c.rig = rig;
  const body = new THREE.Mesh(new THREE.BoxGeometry(.34, .2, .26), std('#10141f', { metalness: .6 })); rig.add(body);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .14, 16), std('#05070d', { metalness: .8 })); lens.rotation.x = Math.PI / 2; lens.position.z = -.2; rig.add(lens);
  c.led = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), basic('#ffffff')); c.led.position.set(.12, .12, 0); rig.add(c.led);
  c.stripe = new THREE.Mesh(new THREE.BoxGeometry(.36, .03, .28), basic(c.col)); c.stripe.position.y = -.11; rig.add(c.stripe);
  if (c.pole) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.03, .05, c.pos.y, 10), std('#222a40', { metalness: .5 })); p.position.set(c.pos.x, c.pos.y / 2 - .1, c.pos.z); scene.add(p); const b = new THREE.Mesh(new THREE.CylinderGeometry(.3, .34, .05, 20), std('#222a40')); b.position.set(c.pos.x, .03, c.pos.z); scene.add(b); }
  if (c.roam) { const rp = person('#c58bff'); rp.g.position.set(c.pos.x, 0, c.pos.z + .55); scene.add(rp.g); c.roamPerson = rp; rp.armL.rotation.x = rp.armR.rotation.x = -1.5; }
  c.tag = label(c.name, c.col); c.tag.position.copy(c.pos).add(V3(0, .7, 0)); overlay.add(c.tag);
  // field-of-view lines
  const d = 5.5, hh = Math.tan(c.fov * Math.PI / 360) * d, ww = hh * RTW / RTH; const pts = []; const cs = [[-ww, -hh], [ww, -hh], [ww, hh], [-ww, hh]];
  cs.forEach(([x, y], k) => { pts.push(0, 0, 0, x, y, -d); const [x2, y2] = cs[(k + 1) % 4]; pts.push(x, y, -d, x2, y2, -d); });
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); c.fov3 = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: c.col, transparent: true, opacity: .28, depthWrite: false, fog: false })); c.fov3.position.copy(c.pos); c.fov3.quaternion.copy(c.cam.quaternion); overlay.add(c.fov3);
});
// monitor gantry: program + multiview
const SCR_Y = 5.4, PRG_Y = 9.6, GZ = -10.2;
const prgMat = new THREE.MeshBasicMaterial({ map: CAMS[0].rt.texture, toneMapped: false });
const prg = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 4.05), prgMat); prg.position.set(0, PRG_Y, GZ); gantry.add(prg);
const prgFrame = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 4.35), basic('#ff3b3b')); prgFrame.position.set(0, PRG_Y, GZ - .03); gantry.add(prgFrame);
const prgOv = cvTex(1280, 720); const prgOvM = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 4.05), new THREE.MeshBasicMaterial({ map: prgOv.t, transparent: true, toneMapped: false, depthWrite: false })); prgOvM.position.set(0, PRG_Y, GZ + .01); gantry.add(prgOvM);
const mvPick = [];
CAMS.forEach((c, i) => {
  const x = (i - 2.5) * 3.05;
  const fr = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.78), basic('#1a2a44')); fr.position.set(x, SCR_Y, GZ - .03); gantry.add(fr); c.tally = fr;
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.52), new THREE.MeshBasicMaterial({ map: c.rt.texture, toneMapped: false })); sc.position.set(x, SCR_Y, GZ); sc.userData = { type: 'cam', i }; gantry.add(sc); mvPick.push(sc);
  const lb = label(c.name, c.col, 1.5); lb.position.set(x, SCR_Y - 1.1, GZ + .02); gantry.add(lb);
  [-.9, .9].forEach(s => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 11.2 - SCR_Y + 1, 6), std('#333')); w.position.set(x + s, (11.6 + SCR_Y) / 2 + .4, GZ - .04); gantry.add(w); });
});
{ const w = [-1.4, 1.4].map(s => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 3, 6), std('#333')); m.position.set(s * 1.2, PRG_Y + 2.9, GZ - .04); gantry.add(m); }); }

/* ---------- sheet posters ---------- */
const posters = [];
SHEETS.forEach((s, i) => {
  const left = i < 3, z = [-4, 3.5, 11][i % 3], x = left ? -HALL.x + .08 : HALL.x - .08, ry = left ? Math.PI / 2 : -Math.PI / 2;
  const g = new THREE.Group(); g.position.set(x, 4.5, z); g.rotation.y = ry; scene.add(g);
  const fr = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 6.75), basic(s.col)); fr.position.z = -.02; g.add(fr);
  const tex = texLoader.load(s.img, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; }); tex.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.Mesh(new THREE.PlaneGeometry(4.96, 6.42), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); pm.userData = { type: 'sheet', i }; g.add(pm);
  const cap = label(s.chip.toUpperCase(), s.col, 2.4); cap.position.set(0, -3.75, .05); g.add(cap);
  // where to stand to read it
  const stand = V3(left ? x + 9.2 : x - 9.2, 1.65, z), yaw = left ? Math.PI / 2 : -Math.PI / 2;
  posters.push({ s, g, fr, pm, stand, yaw, sc: 1 });
});

/* ---------- LED backdrop animation (slow, smooth) ---------- */
function drawLed(t) { const { g, c } = window.__led; const w = c.width, h = c.height; g.fillStyle = '#070b1a'; g.fillRect(0, 0, w, h); for (let k = 0; k < 4; k++) { const grd = g.createLinearGradient(0, 0, w, 0); grd.addColorStop(0, ['#ff4f9a', '#4fd8ff', '#ffd23f', '#c58bff'][k] + '00'); grd.addColorStop(.5, ['#ff4f9a', '#4fd8ff', '#ffd23f', '#c58bff'][k] + '55'); grd.addColorStop(1, ['#ff4f9a', '#4fd8ff', '#ffd23f', '#c58bff'][k] + '00'); g.fillStyle = grd; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 16) g.lineTo(x, h * (.52 + k * .07) + Math.sin(x * .008 + t * (.25 + k * .06) + k) * 46); g.lineTo(w, h); g.fill(); } g.fillStyle = '#ffffff'; g.font = '800 54px "Segoe UI",Arial'; g.textAlign = 'center'; g.fillText('ELETTRO MULTICAM', w / 2, 120); g.font = '600 26px "Segoe UI",Arial'; g.fillStyle = '#9fd8ff'; g.fillText('EVERY PHONE IN THE ROOM · ONE MULTI-CAM VIDEO', w / 2, 168); window.__led.t.needsUpdate = true; }

/* ---------- the song, the switcher ---------- */
const SONG = [
  { n: 'Intro', d: 4, c: ['wide', 'behind'] }, { n: 'Verse', d: 7, c: ['singer', 'wide', 'guitar'] }, { n: 'Chorus', d: 7, c: ['wide', 'roam', 'behind', 'singer'] },
  { n: 'Guitar solo', d: 7, c: ['guitar', 'guitar', 'wide', 'roam'] }, { n: 'Drum fill', d: 4, c: ['drums', 'drums', 'wide'] }, { n: 'Final chorus', d: 7, c: ['wide', 'behind', 'roam', 'singer', 'drums'] },
];
const SONG_LEN = SONG.reduce((a, s) => a + s.d, 0);
const S = { cam: 0, auto: true, sheet: 0, secIdx: -1, nextCut: 0, hold: 0 };
const camIdx = id => CAMS.findIndex(c => c.id === id);
function secAt(t) { let a = 0; for (let i = 0; i < SONG.length; i++) { if (t < a + SONG[i].d) return i; a += SONG[i].d; } return 0; }
function drawProgram() {
  const { g } = prgOv, c = CAMS[S.cam], sec = SONG[Math.max(0, S.secIdx)];
  g.clearRect(0, 0, 1280, 720); g.fillStyle = '#ff3b3b'; g.beginPath(); g.arc(56, 56, 14, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '800 34px "Segoe UI",Arial'; g.textBaseline = 'middle'; g.fillText('LIVE CUT', 82, 58);
  g.fillStyle = 'rgba(7,11,20,.78)'; g.fillRect(0, 600, 1280, 120); g.fillStyle = c.col; g.fillRect(0, 600, 12, 120);
  g.fillStyle = '#fff'; g.font = '800 54px "Segoe UI",Arial'; g.fillText(c.name + ' CAM', 40, 646); g.fillStyle = '#b7c4e6'; g.font = '600 30px "Segoe UI",Arial'; g.fillText((sec ? sec.n : '') + ' · multi-cam demo cut', 40, 692);
  prgOv.t.needsUpdate = true;
}
function cut(i, manual) {
  if (i === S.cam && !manual) return; S.cam = i; const c = CAMS[i]; prgMat.map = c.rt.texture; prgMat.needsUpdate = true;
  CAMS.forEach((k, j) => { const on = j === i; k.tally.material.color.set(on ? '#ff3b3b' : '#1a2a44'); k.led.material.color.set(on ? '#ff3b3b' : '#6c7894'); k.fov3.material.opacity = on ? .85 : .22; k.fov3.material.color.set(on ? '#ff5a5a' : k.col); });
  $('oaname').textContent = c.name + ' CAM'; drawProgram(); syncOnAir();
}
function syncOnAir() { $('oasec').textContent = (S.secIdx >= 0 ? SONG[S.secIdx].n : '') + (S.auto ? ' · auto-cut' : ' · manual'); }
function autoCut(t, dt) {
  const si = secAt(t % SONG_LEN);
  if (si !== S.secIdx) { S.secIdx = si; syncSeg(); if (S.auto) { cut(camIdx(SONG[si].c[0])); S.nextCut = t + 2.6; } else syncOnAir(); drawProgram(); }
  if (S.auto && t >= S.nextCut) { const pool = SONG[si].c.map(camIdx).filter(k => k !== S.cam); if (pool.length) cut(pool[Math.floor(Math.random() * pool.length)]); S.nextCut = t + 2.2 + Math.random() * 1.4; }
}
function buildSeg() { const seg = $('seg'); SONG.forEach(s => { const d = document.createElement('div'); d.style.flex = s.d; d.textContent = s.n; seg.appendChild(d); }); }
function syncSeg() { [...$('seg').children].forEach((d, i) => { if (d.id !== 'ph') d.classList.toggle('on', i - 1 === S.secIdx); }); }
buildSeg();
function setAuto(v) { S.auto = v; $('auto').textContent = v ? '⏸ Auto-cut' : '▶ Auto-cut'; if (v) S.nextCut = 0; syncOnAir(); }
$('auto').onclick = () => setAuto(!S.auto);

/* ---------- animation of the band ---------- */
const sm = (a, b, k) => a + (b - a) * k;
function animateBand(t, dt) {
  const si = Math.max(0, S.secIdx), name = SONG[si].n, k = 1 - Math.exp(-dt * 3);
  const solo = name === 'Guitar solo', fill = name === 'Drum fill', verse = name === 'Verse';
  // guitarist steps up for the solo
  const gx = solo ? -3.2 : -5.5, gz = solo ? -15.9 : -18; guitarist.g.position.x = sm(guitarist.g.position.x, gx, k); guitarist.g.position.z = sm(guitarist.g.position.z, gz, k);
  guitarist.g.rotation.y = sm(guitarist.g.rotation.y, solo ? .25 : .12, k); guitarist.torso.rotation.x = sm(guitarist.torso.rotation.x, solo ? -.22 : -.04, k);
  guitarist.armL.rotation.x = -1.05 + Math.sin(t * (solo ? 4.2 : 1.4)) * (solo ? .22 : .08); guitarist.armL.rotation.z = -.15;
  guitarist.armR.rotation.x = -.7 + Math.sin(t * (solo ? 9 : 5.5)) * (solo ? .35 : .22); guitarist.armR.rotation.z = .1;
  // singer
  singer.head.rotation.y = Math.sin(t * .8) * .25; singer.armR.rotation.x = -1.85; singer.armR.rotation.z = -.15;
  singer.armL.rotation.x = -.5 + Math.sin(t * 1.3) * (verse ? .7 : .35); singer.armL.rotation.z = .5 + Math.sin(t * 1.1) * .2;
  singer.g.position.y = STAGE.y + Math.abs(Math.sin(t * 1.5)) * .015;
  // bass
  bassist.armL.rotation.x = -1.0 + Math.sin(t * 1.7) * .1; bassist.armR.rotation.x = -.6 + Math.sin(t * 5.2) * .18; bassist.g.rotation.y = -.12; bassist.torso.rotation.z = Math.sin(t * 1.2) * .04;
  // drummer: arms keep time; the kit itself stays still
  const f = fill ? 9.5 : 5.2; drummer.armL.rotation.x = -1.25 + Math.max(0, Math.sin(t * f)) * .5; drummer.armR.rotation.x = -1.25 + Math.max(0, Math.sin(t * f + 1.7)) * .5; drummer.armL.rotation.z = .25; drummer.armR.rotation.z = -.25;
  drummer.head.rotation.y = Math.sin(t * .7) * .2;
  // roaming camera: the filmer walks a slow arc
  const r = CAMS[4], rx = Math.sin(t * .22) * 6.2, rz = -7.4 + Math.cos(t * .15) * .9;
  r.pos.set(rx, 1.8, rz); r.cam.position.copy(r.pos); r.cam.lookAt(sm(0, rx * -.1, 1) + Math.sin(t * .35) * 1.3, 2.4, -18); r.rig.position.copy(r.pos); r.rig.quaternion.copy(r.cam.quaternion);
  r.fov3.position.copy(r.pos); r.fov3.quaternion.copy(r.cam.quaternion); r.tag.position.set(r.pos.x, r.pos.y + .7, r.pos.z); r.roamPerson.g.position.set(rx, 0, rz + .55); r.roamPerson.g.rotation.y = 0;
}

/* ---------- render the camera views ---------- */
let rr = 0;
function renderCam(i) { const c = CAMS[i]; overlay.visible = false; gantry.visible = false; c.rig.visible = false; renderer.setRenderTarget(c.rt); renderer.render(scene, c.cam); renderer.setRenderTarget(null); c.rig.visible = true; overlay.visible = true; gantry.visible = true; }
function renderViews() { renderCam(S.cam); let n = 0; while (n < 2) { rr = (rr + 1) % CAMS.length; if (rr === S.cam) continue; renderCam(rr); n++; } }

/* ---------- sheet panel ---------- */
function showSheet(i, fly) {
  S.sheet = i; const s = SHEETS[i];
  $('sk').textContent = s.tag; $('st').textContent = s.title; $('sst').textContent = s.status; $('sp').textContent = s.pitch; $('sc').textContent = s.close;
  $('sb').innerHTML = s.beats.map((b, k) => '<li><b>' + (k + 1) + '</b><span>' + b.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span></li>').join('');
  $('sthumb').src = s.img; $('zimg').src = s.img; const pd = $('spdf'); pd.style.display = s.pdf ? '' : 'none'; if (s.pdf) pd.href = s.pdf;
  $('cnt').textContent = (i + 1) + ' of ' + SHEETS.length + ' · ' + s.chip;
  [...$('chips').children].forEach((b, k) => b.classList.toggle('on', k - 1 === i));
  if (fly) goTo(posters[i].stand, posters[i].yaw, .03);
  $('hint').classList.add('off');
}
function renderChips() { const el = $('chips'); el.innerHTML = ''; const home = document.createElement('button'); home.className = 'chip'; home.textContent = '🎥 Stage'; home.onclick = () => { goTo(V3(0, 1.65, 4), 0, .14); [...el.children].forEach(b => b.classList.remove('on')); home.classList.add('on'); }; el.appendChild(home); SHEETS.forEach((s, i) => { const b = document.createElement('button'); b.className = 'chip'; b.textContent = s.chip; b.onclick = () => showSheet(i, true); el.appendChild(b); }); }
$('next').onclick = () => showSheet((S.sheet + 1) % SHEETS.length, true); $('prev').onclick = () => showSheet((S.sheet + SHEETS.length - 1) % SHEETS.length, true);
$('sview').onclick = () => $('zoom').classList.add('on'); $('sthumb').onclick = () => $('zoom').classList.add('on'); $('zoom').onclick = () => $('zoom').classList.remove('on');
addEventListener('keydown', e => { if (e.code === 'Escape') $('zoom').classList.remove('on'); });

/* ---------- controls ---------- */
const P = { x: 0, z: 4, yaw: 0, pitch: .14 }; let fly = null; const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; }); addEventListener('keyup', e => keys[e.code] = false);
function goTo(v, yaw, pitch) { fly = { x: v.x, z: v.z, yaw, pitch }; }
let drag = null, moved = 0, joy = { x: 0, y: 0 }; const mouse = { x: 0, y: 0 };
const look = (dx, dy) => { fly = null; P.yaw -= dx * .0026; P.pitch = Math.max(-1.2, Math.min(1.2, P.pitch - dy * .0026)); };
canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; moved = 0; });
addEventListener('pointerup', e => { if (drag && moved < 6) pick(e.clientX, e.clientY); drag = null; });
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; if (drag && e.pointerId === drag.id) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy); if (moved >= 6) look(dx, dy); drag.x = e.clientX; drag.y = e.clientY; } });
const joyEl = $('joy'), knob = joyEl.querySelector('b');
function joyMove(e) { const r = joyEl.getBoundingClientRect(); let x = (e.clientX - r.left - 55) / 45, y = (e.clientY - r.top - 55) / 45; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } joy.x = x; joy.y = y; knob.style.transform = `translate(${x * 30}px,${y * 30}px)`; }
joyEl.addEventListener('pointerdown', e => { joyEl.setPointerCapture(e.pointerId); joyMove(e); }); joyEl.addEventListener('pointermove', e => { if (e.buttons || e.pressure) joyMove(e); }); joyEl.addEventListener('pointerup', () => { joy.x = joy.y = 0; knob.style.transform = ''; });
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tip = $('tip'); let hov = null;
const pickables = [...posters.map(p => p.pm), ...mvPick];
function hit(x, y) { ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(pickables, false)[0]; return h ? h.object.userData : null; }
function pick(x, y) { const u = hit(x, y); if (!u) return; if (u.type === 'sheet') showSheet(u.i, true); else { setAuto(false); cut(u.i, true); } }
function updateHover() { if (drag && moved >= 6) { tip.style.opacity = 0; hov = null; return; } const u = hit(mouse.x, mouse.y); hov = u; canvas.classList.toggle('hover', !!u); if (u) { tip.textContent = u.type === 'sheet' ? 'Present: ' + SHEETS[u.i].chip : 'Cut to ' + CAMS[u.i].name + ' cam'; tip.style.left = mouse.x + 'px'; tip.style.top = mouse.y + 'px'; tip.style.opacity = 1; } else tip.style.opacity = 0; }

/* ---------- main loop ---------- */
const clock = new THREE.Clock(); let frameN = 0;
function frame() {
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime; frameN++;
  const fw = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - joy.y, st = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + joy.x;
  if (fw || st) fly = null;
  if (fly) { const k = 1 - Math.exp(-dt * 3.2); P.x += (fly.x - P.x) * k; P.z += (fly.z - P.z) * k; let dy = fly.yaw - P.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); P.yaw += dy * k; P.pitch += (fly.pitch - P.pitch) * k; }
  else { const sp = keys.ShiftLeft ? 6 : 3.2; P.x += (-Math.sin(P.yaw) * fw + Math.cos(P.yaw) * st) * sp * dt; P.z += (-Math.cos(P.yaw) * fw - Math.sin(P.yaw) * st) * sp * dt; }
  P.x = Math.max(-HALL.x + 1, Math.min(HALL.x - 1, P.x)); P.z = Math.max(-12.2, Math.min(HALL.zf - 1, P.z));
  camera.position.set(P.x, 1.65, P.z); camera.rotation.set(P.pitch, P.yaw, 0);
  autoCut(t, dt); animateBand(t, dt); updateCrowd(t); updateBeams(t); if (frameN % 3 === 0) drawLed(t);
  pl[0].position.x = -7 + Math.sin(t * .2) * 3; pl[1].position.x = 7 + Math.cos(t * .23) * 3;
  posters.forEach((p, i) => { const on = i === S.sheet, hv = hov && hov.type === 'sheet' && hov.i === i; const s = 1 + (on ? .04 : 0) + (hv ? .03 : 0); p.sc += (s - p.sc) * Math.min(1, dt * 8); p.g.scale.setScalar(p.sc); p.fr.material.color.set(on ? '#ffffff' : p.s.col); });
  const ph = $('ph'); ph.style.left = (t % SONG_LEN) / SONG_LEN * 100 + '%';
  renderViews(); updateHover(); renderer.render(scene, camera); requestAnimationFrame(frame);
}

/* ---------- phone remote (display side): the phone is the director ---------- */
{
  let sid = null; try { sid = sessionStorage.getItem('elmc_id'); } catch (e) { }
  if (!sid) { sid = (Math.random().toString(36) + '000000').slice(2, 8); try { sessionStorage.setItem('elmc_id', sid); } catch (e) { } }
  const url = location.origin + location.pathname + '?c=' + sid;
  { const qq = qrcode(0, 'M'); qq.addData(url); qq.make(); const c = $('rqc'), g = c.getContext('2d'), m = qq.getModuleCount(), cs = Math.floor(332 / (m + 2)), off = Math.floor((332 - m * cs) / 2); g.fillStyle = '#fff'; g.fillRect(0, 0, 332, 332); g.fillStyle = '#06101c'; for (let r = 0; r < m; r++) for (let cc = 0; cc < m; cc++) if (qq.isDark(r, cc)) g.fillRect(off + cc * cs, off + r * cs, cs, cs); $('rsid').textContent = 'SESSION ' + sid; }
  if (matchMedia('(pointer:coarse)').matches) $('rpill').classList.add('hasjoy');
  $('rpill').onclick = () => $('rcard').classList.toggle('on');
  let last = '';
  const stateMsg = () => ({ t: 'state', cam: S.cam, auto: S.auto, sec: SONG[Math.max(0, S.secIdx)].n, sheet: S.sheet, cams: CAMS.map(c => ({ n: c.name, col: c.col })), sheets: SHEETS.map((s, i) => ({ i, name: s.chip, img: s.img })), title: SHEETS[S.sheet].title, tag: SHEETS[S.sheet].tag, img: SHEETS[S.sheet].img });
  const push = force => { const m = stateMsg(), j = JSON.stringify(m); if (force || j !== last) { if (rl.send(m)) last = j; } };
  const rl = RelayLink('display', sid, m => {
    if (m.t === '_join' || m.t === 'hello') { $('rstat').classList.add('on'); push(true); $('hint').classList.add('off'); $('rcard').classList.remove('on'); }
    else if (m.t === '_leave') $('rstat').classList.remove('on');
    else if (m.t === 'cam') { setAuto(false); cut(m.i | 0, true); }
    else if (m.t === 'auto') setAuto(!S.auto);
    else if (m.t === 'sheet') showSheet(m.i | 0, true);
    else if (m.t === 'next') showSheet((S.sheet + 1) % SHEETS.length, true); else if (m.t === 'prev') showSheet((S.sheet + SHEETS.length - 1) % SHEETS.length, true);
  }, s => { if (s === 'open') rl.send({ t: '_hi' }); });
  setInterval(() => push(false), 400);
}

/* ---------- boot ---------- */
renderChips(); showSheet(0, false); cut(0, true); drawLed(0); drawProgram();
S.secIdx = 0; syncSeg(); syncOnAir();
const home = $('chips').children[0]; home.classList.add('on');
frame(); setTimeout(() => $('load').classList.add('off'), 600); setTimeout(() => $('hint').classList.add('off'), 16000);
window.__mc = { S, CAMS, cut, showSheet, P };
