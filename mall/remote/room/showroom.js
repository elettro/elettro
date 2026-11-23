import * as THREE from 'three';

/* ===== Elettro Remote Mobile showroom =====
   Every remote-controlled experience Elettro has built, as a phone on a stage.
   Pick a phone: its experience goes on the big screen, with a real QR code to open it. */

const ORIGIN = location.origin;
const EXP = [
  { id: 'reef', cat: 'Games', name: 'The Reef', kicker: 'Many phones · kids’ game', title: 'The Reef in the Atrium', sub: 'A giant living aquarium on the big screen. Every child steers their own sea creature from a phone. No app, many players at once.', img: '/remote/img/reef-hero.jpg', url: '/remote/?scene=reef' },
  { id: 'reef2', cat: 'Games', name: 'Deep Reef', kicker: 'Many phones · teens + adults', title: 'Deep Reef', sub: 'Scan, pick a real reef fish and survive the food chain. Eat plankton, dodge barracuda and sharks, hide in the anemones, climb the leaderboard.', img: '/remote/img/reef2-hero.jpg', url: '/remote/?scene=reef2' },
  { id: 'game', cat: 'Games', name: 'Can Catch', kicker: 'Play on the big screen · steer with your phone', title: 'Can Catch', sub: 'Slide left and right to catch the falling cans and dodge the rocks. Drag the pad on your phone. No app, no controller.', img: '/remote/img/rompe-hero.jpg', url: '/remote/?scene=game' },
  { id: 'trivia', cat: 'Games', name: 'Dylan Trivia', kicker: 'Multiplayer · everyone answers on their own phone', title: 'Bob Dylan Song Trivia', sub: 'Scan to join. Ten questions about songs from tonight’s setlist, faster answers score more, and the leaderboard updates live on the big screen.', img: '/remote/img/mall-2.jpg', url: '/remote/?scene=trivia' },
  { id: 'mall', cat: 'Websites', name: 'Mall Site', kicker: 'Bal Harbour Shops concept', title: 'Iconic Brands. Extraordinary Experiences.', sub: 'Browse brands, view new arrivals, watch campaign videos and save items to your phone, all while the website runs on the big screen.', img: '/remote/img/mall-hero.jpg', url: '/remote/?scene=mall' },
  { id: 'candyman', cat: 'Websites', name: 'Candy Man', kicker: 'Nightlife · Hard Rock Hollywood', title: 'Scan. Tap. You’re On The List.', sub: 'One QR on the screen, flyers on the big display, and tickets, tables and reminders in your fans’ pockets before they leave the couch.', img: '/remote/img/candyman-hero.jpg', url: '/remote/?scene=candyman' },
  { id: 'coffee', cat: 'Websites', name: 'Coffee Brand', kicker: 'Product site', title: 'Discover Exceptional Coffee', sub: 'Browse roasts, watch the story and add to cart, all from your phone, while the product site plays on the screen.', img: '/remote/img/coffee-hero.jpg', url: '/remote/?scene=coffee' },
  { id: 'hotel', cat: 'Websites', name: 'Hotel Site', kicker: 'Oceanfront resort', title: 'A More Extraordinary Stay Awaits', sub: 'Explore rooms, amenities and dining. Check availability and request details straight from your phone.', img: '/remote/img/hotel-hero.jpg', url: '/remote/?scene=hotel' },
  { id: 'sealord', cat: 'Websites', name: 'Sea Lord Beach', kicker: 'Hotel concept · Lauderdale-by-the-Sea', title: 'The Whole Beach, From Your Lounger', sub: 'Guests scan a QR on their lounger or at the pool and their phone runs the beach-club screens, ordering, reservations and activities.', img: '/remote/img/sealord-hero.jpg', url: '/remote/?scene=sealord' },
  { id: 'stashshop', cat: 'Websites', name: 'Stashbox Shop', kicker: 'stashbox.ai · official shop', title: 'Wear the Music. Own the Vibe.', sub: 'Real products from the Stashbox store. Pick one on the big screen, tap it on your phone, and the shop opens in a new tab.', img: '/remote/img/shop-3.jpg', url: '/remote/?scene=stashshop' },
  { id: 'stashradio', cat: 'Websites', name: 'Stashbox Radio', kicker: 'stashbox.com/radio', title: 'Stashbox Radio. Always On.', sub: 'Original music from a South Florida band. Pick a song on the big screen, then play it on your phone.', img: '/remote/img/radio-1.jpg', url: '/remote/?scene=stashradio' },
  { id: 'rompe', cat: 'Websites', name: 'ROMPE Energy', kicker: 'Zero sugar energy drink', title: 'Four Flavors. Zero Sugar. Pure Rompe.', sub: 'Meet the lineup: Limoncito, Mojito Mágico, Passion Papi and Pop That Piña. Watch the videos on the big screen, tap through on your phone.', img: '/remote/img/rompe-hero.jpg', url: '/remote/?scene=rompe' },
  { id: 'scroll', cat: 'Tools', name: '3D Scroll Remote', kicker: 'A 3D website controlled from a phone', title: 'Swipe slowly. The page scrolls.', sub: 'A 3D scrolling website you control from your phone. Scan the QR code, swipe, and the page scrolls on the big screen.', img: '/scroll/img/hero1.webp', url: '/scroll/' },
  { id: 'multicam', cat: 'Tools', name: 'MultiCam', kicker: 'Every phone in the room, one multi-cam video', title: 'Everyone films. Elettro edits.', sub: 'Everyone films on their own phone, scans one QR code and uploads. Elettro turns the pile into a multi-cam video, shorts and social posts.', img: '/multi-cam/sheets/multicam-overview.jpg', url: '/multi-cam/' },
];
const CATS = ['All', 'Games', 'Websites', 'Tools'];
const $ = id => document.getElementById(id);

/* ---------- renderer ---------- */
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#041512'); scene.fog = new THREE.FogExp2('#041512', .018);
const camera = new THREE.PerspectiveCamera(68, 1, .05, 200); camera.rotation.order = 'YXZ';
function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.add(new THREE.HemisphereLight('#bfeee1', '#10201c', 1.1));
const key = new THREE.PointLight('#18c29c', 60, 40, 2); key.position.set(0, 7, 2); scene.add(key);

const cvTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return { t, c, g }; };
function wrap(g, text, x, y, maxW, lh, maxLines = 6) { const words = text.split(' '); let line = '', n = 0; for (const w of words) { const test = line ? line + ' ' + w : w; if (g.measureText(test).width > maxW && line) { g.fillText(line, x, y + n * lh); n++; line = w; if (n >= maxLines) return n; } else line = test; } g.fillText(line, x, y + n * lh); return n + 1; }
function cover(g, img, x, y, w, h) { const r = Math.max(w / img.width, h / img.height), sw = w / r, sh = h / r; g.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h); }

/* ---------- stage ---------- */
{
  const rings = cvTex(1024, 1024, (g, w, h) => { g.fillStyle = '#071d19'; g.fillRect(0, 0, w, h); g.translate(w / 2, h / 2); for (let r = 50; r < 512; r += 48) { g.strokeStyle = `rgba(24,194,156,${r > 400 ? .3 : .13})`; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); } for (let a = 0; a < 40; a++) { g.save(); g.rotate(a / 40 * 6.283); g.strokeStyle = 'rgba(24,194,156,.07)'; g.beginPath(); g.moveTo(60, 0); g.lineTo(510, 0); g.stroke(); g.restore(); } }).t;
  const f = new THREE.Mesh(new THREE.CircleGeometry(20, 96), new THREE.MeshStandardMaterial({ map: rings, roughness: .35, metalness: .5 })); f.rotation.x = -Math.PI / 2; scene.add(f);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(120, 24, 12), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, vertexShader: 'varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'varying vec3 p;void main(){float h=clamp(p.y,0.,1.);gl_FragColor=vec4(mix(vec3(.03,.13,.12),vec3(.01,.03,.04),pow(h,.5)),1.);}' })); scene.add(sky);
  const pos = []; for (let i = 0; i < 500; i++) { const t = Math.random() * 6.283, u = Math.random() * .9 + .06, r = Math.sqrt(1 - u * u); pos.push(Math.cos(t) * r * 110, u * 110, Math.sin(t) * r * 110); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ size: 1.3, sizeAttenuation: false, color: '#cffff0', fog: false, transparent: true, opacity: .7 })));
}

/* ---------- big screen (curved) ---------- */
const SCR_R = 16, SCR_H = 7, SCR_A = 1.22;
const screen = cvTex(2400, 860, () => { });
screen.t.wrapS = THREE.RepeatWrapping; screen.t.repeat.x = -1; screen.t.offset.x = 1;
{
  const geo = new THREE.CylinderGeometry(SCR_R, SCR_R, SCR_H, 64, 1, true, Math.PI - SCR_A / 2, SCR_A);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: screen.t, side: THREE.BackSide, toneMapped: false })); m.position.y = 4.4; scene.add(m);
  const frame = (y) => { const t = new THREE.Mesh(new THREE.CylinderGeometry(SCR_R - .02, SCR_R - .02, .12, 64, 1, true, Math.PI - SCR_A / 2, SCR_A), new THREE.MeshBasicMaterial({ color: '#18c29c', side: THREE.BackSide })); t.position.y = y; scene.add(t); };
  frame(4.4 + SCR_H / 2 + .06); frame(4.4 - SCR_H / 2 - .06);
}
const SCR_CENTER = new THREE.Vector3(0, 4.4, -SCR_R + .5);

/* ---------- phones ---------- */
const phones = []; const pickables = [];
const bodyGeo = new THREE.BoxGeometry(.98, 1.96, .1), scrGeo = new THREE.PlaneGeometry(.88, 1.84);
const bodyMat = new THREE.MeshStandardMaterial({ color: '#10171a', metalness: .8, roughness: .3 });
const ARC_R = 6;
function buildPhones(images) {
  const n = EXP.length;
  EXP.forEach((e, i) => {
    const a = (-80 + 160 * i / (n - 1)) * Math.PI / 180;
    const x = Math.sin(a) * ARC_R, z = -Math.cos(a) * ARC_R;
    const g = new THREE.Group(); g.position.set(x, 1.9, z); g.rotation.y = Math.atan2(-x, -z);
    const body = new THREE.Mesh(bodyGeo, bodyMat); g.add(body);
    const tx = cvTex(360, 720, (c, w, h) => { c.fillStyle = '#06201c'; c.fillRect(0, 0, w, h); cover(c, images[i], 0, 0, w, h); const gr = c.createLinearGradient(0, h * .6, 0, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.85)'); c.fillStyle = gr; c.fillRect(0, h * .55, w, h * .45); c.fillStyle = '#18c29c'; c.font = '700 20px "Segoe UI",Arial'; c.fillText(e.cat.toUpperCase(), 22, h - 112); c.fillStyle = '#fff'; c.font = '800 36px "Segoe UI",Arial'; wrap(c, e.name, 22, h - 72, w - 44, 40, 2); c.fillStyle = '#ffffff55'; c.fillRect(w / 2 - 40, 14, 80, 6); });
    const scr = new THREE.Mesh(scrGeo, new THREE.MeshBasicMaterial({ map: tx.t, toneMapped: false })); scr.position.z = .056; g.add(scr);
    scr.userData.idx = i; body.userData.idx = i; pickables.push(scr, body);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.05, .09, .95, 12), new THREE.MeshStandardMaterial({ color: '#1b2c29', metalness: .7, roughness: .4 })); pole.position.set(x, .47, z); scene.add(pole);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.42, .46, .06, 24), new THREE.MeshBasicMaterial({ color: '#18c29c' })); base.position.set(x, .03, z); scene.add(base);
    scene.add(g);
    phones.push({ e, g, home: g.position.clone(), homeYaw: g.rotation.y, scrMat: scr.material, dim: 0, hov: 0, base });
  });
}

/* ---------- beam particles ---------- */
const NB = 90; const bpos = new Float32Array(NB * 3), bt = Array.from({ length: NB }, () => Math.random());
const bgeo = new THREE.BufferGeometry(); bgeo.setAttribute('position', new THREE.BufferAttribute(bpos, 3));
const beam = new THREE.Points(bgeo, new THREE.PointsMaterial({ size: .09, color: '#7dffe0', transparent: true, opacity: .85, depthWrite: false, blending: THREE.AdditiveBlending })); beam.frustumCulled = false; scene.add(beam);

/* ---------- state ---------- */
const S = { sel: 0, cat: 'All', auto: false, images: [], autoT: 0 };
function visible() { return EXP.map((e, i) => i).filter(i => S.cat === 'All' || EXP[i].cat === S.cat); }
function expUrl(e) { return new URL(e.url, ORIGIN).href; }

function drawScreen(i) {
  const e = EXP[i], img = S.images[i], g = screen.g, W = 2400, H = 860;
  g.clearRect(0, 0, W, H); g.fillStyle = '#041512'; g.fillRect(0, 0, W, H);
  cover(g, img, 0, 0, 1500, H);
  const fade = g.createLinearGradient(900, 0, 1500, 0); fade.addColorStop(0, 'rgba(4,21,18,0)'); fade.addColorStop(1, 'rgba(4,21,18,1)'); g.fillStyle = fade; g.fillRect(900, 0, 600, H);
  g.fillStyle = '#18c29c'; g.font = '700 34px "Segoe UI",Arial'; g.textBaseline = 'alphabetic'; g.fillText((e.cat + ' · ' + e.kicker).toUpperCase(), 1380, 150);
  g.fillStyle = '#fff'; g.font = '800 80px "Segoe UI",Arial'; const n = wrap(g, e.title, 1380, 250, 900, 92, 3);
  g.fillStyle = '#bfe3d8'; g.font = '500 36px "Segoe UI",Arial'; wrap(g, e.sub, 1380, 250 + n * 92 + 30, 880, 48, 5);
  // QR
  const q = qrcode(0, 'M'); q.addData(expUrl(e)); q.make(); const m = q.getModuleCount(), cs = Math.floor(190 / m);
  g.fillStyle = '#fff'; g.fillRect(1380, 640, m * cs + 24, m * cs + 24); g.fillStyle = '#06201c';
  for (let r = 0; r < m; r++) for (let c = 0; c < m; c++) if (q.isDark(r, c)) g.fillRect(1392 + c * cs, 652 + r * cs, cs, cs);
  g.fillStyle = '#fff'; g.font = '800 34px "Segoe UI",Arial'; g.fillText('SCAN WITH YOUR PHONE', 1380 + m * cs + 48, 700); g.font = '500 28px "Segoe UI",Arial'; g.fillStyle = '#9cc5b9'; g.fillText('No app, no account', 1380 + m * cs + 48, 744);
  screen.t.needsUpdate = true;
}
function drawQR(e) {
  const c = $('qrc'), g = c.getContext('2d'); const q = qrcode(0, 'M'); q.addData(expUrl(e)); q.make(); const m = q.getModuleCount(), cs = Math.floor(208 / (m + 2));
  g.fillStyle = '#fff'; g.fillRect(0, 0, 208, 208); g.fillStyle = '#06201c'; const off = Math.floor((208 - m * cs) / 2);
  for (let r = 0; r < m; r++) for (let cc = 0; cc < m; cc++) if (q.isDark(r, cc)) g.fillRect(off + cc * cs, off + r * cs, cs, cs);
  $('qrurl').textContent = expUrl(e).replace(/^https?:\/\//, '');
}
function select(i) {
  S.sel = i; const e = EXP[i];
  drawScreen(i);
  $('pk').textContent = e.cat + ' · ' + e.kicker; $('pt').textContent = e.title; $('pp').textContent = e.sub; $('pgo').href = expUrl(e);
  drawQR(e); const v = visible(); $('cnt').textContent = (v.indexOf(i) + 1) + ' of ' + v.length + ' · ' + e.name;
  $('hint').classList.add('off');
}
function step(d) { const v = visible(); if (!v.length) return; let k = v.indexOf(S.sel); if (k < 0) k = 0; select(v[(k + d + v.length) % v.length]); }
function renderChips() { const el = $('chips'); el.innerHTML = ''; CATS.forEach(c => { const n = c === 'All' ? EXP.length : EXP.filter(e => e.cat === c).length; const b = document.createElement('button'); b.className = 'chip' + (S.cat === c ? ' on' : ''); b.innerHTML = c + '<i>' + n + '</i>'; b.onclick = () => { S.cat = c; const v = visible(); if (!v.includes(S.sel)) select(v[0]); renderChips(); select(S.sel); }; el.appendChild(b); }); }
$('next').onclick = () => { S.auto = false; syncAuto(); step(1); }; $('prev').onclick = () => { S.auto = false; syncAuto(); step(-1); };
$('pqr').onclick = () => $('qrbox').classList.toggle('on');
function syncAuto() { $('auto').textContent = S.auto ? '⏸ Pause tour' : '▶ Auto-present'; S.autoT = 0; }
$('auto').onclick = () => { S.auto = !S.auto; syncAuto(); if (S.auto) step(1); };
addEventListener('keydown', e => { if (e.code === 'ArrowRight') { S.auto = false; syncAuto(); step(1); } if (e.code === 'ArrowLeft') { S.auto = false; syncAuto(); step(-1); } });

/* ---------- controls ---------- */
const P = { x: 0, z: 5.2, yaw: 0, pitch: .03 }; const keys = {}; addEventListener('keydown', e => keys[e.code] = true); addEventListener('keyup', e => keys[e.code] = false);
let drag = null, moved = 0, joy = { x: 0, y: 0 }; const mouse = { x: 0, y: 0 };
const look = (dx, dy) => { P.yaw -= dx * .0026; P.pitch = Math.max(-1.2, Math.min(1.2, P.pitch - dy * .0026)); };
canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; moved = 0; });
addEventListener('pointerup', e => { if (drag && moved < 6) pick(e.clientX, e.clientY); drag = null; });
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; if (drag && e.pointerId === drag.id) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy); if (moved >= 6) look(dx, dy); drag.x = e.clientX; drag.y = e.clientY; } });
const joyEl = $('joy'), knob = joyEl.querySelector('b');
function joyMove(e) { const r = joyEl.getBoundingClientRect(); let x = (e.clientX - r.left - 55) / 45, y = (e.clientY - r.top - 55) / 45; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } joy.x = x; joy.y = y; knob.style.transform = `translate(${x * 30}px,${y * 30}px)`; }
joyEl.addEventListener('pointerdown', e => { joyEl.setPointerCapture(e.pointerId); joyMove(e); }); joyEl.addEventListener('pointermove', e => { if (e.buttons || e.pressure) joyMove(e); }); joyEl.addEventListener('pointerup', () => { joy.x = joy.y = 0; knob.style.transform = ''; });

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tip = $('tip'); let hoverI = -1;
function rayAt(x, y) { ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(pickables, false)[0]; return h ? h.object.userData.idx : -1; }
function pick(x, y) { const i = rayAt(x, y); if (i >= 0 && (S.cat === 'All' || EXP[i].cat === S.cat)) { S.auto = false; syncAuto(); select(i); } }
function updateHover() { if (drag && moved >= 6) { tip.style.opacity = 0; hoverI = -1; return; } const i = rayAt(mouse.x, mouse.y); hoverI = i; canvas.classList.toggle('hover', i >= 0); if (i >= 0) { tip.textContent = EXP[i].name; tip.style.left = mouse.x + 'px'; tip.style.top = mouse.y + 'px'; tip.style.opacity = 1; } else tip.style.opacity = 0; }

/* ---------- loop ---------- */
const clock = new THREE.Clock(); const tv = new THREE.Vector3(), tq = new THREE.Quaternion(), te = new THREE.Euler(); const bez = new THREE.Vector3();
function frame() {
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  const fw = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - joy.y, st = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + joy.x;
  const sp = keys.ShiftLeft ? 5 : 2.8; let nx = P.x + (-Math.sin(P.yaw) * fw + Math.cos(P.yaw) * st) * sp * dt, nz = P.z + (-Math.cos(P.yaw) * fw - Math.sin(P.yaw) * st) * sp * dt;
  const r = Math.hypot(nx, nz); if (r > 9.5) { nx *= 9.5 / r; nz *= 9.5 / r; } P.x = nx; P.z = nz;
  camera.position.set(P.x, 1.65, P.z); camera.rotation.set(P.pitch, P.yaw, 0);
  if (S.auto) { S.autoT += dt; if (S.autoT > 7.5) { S.autoT = 0; step(1); } }
  const k = 1 - Math.exp(-dt * 5);
  phones.forEach((p, i) => {
    const on = S.cat === 'All' || p.e.cat === S.cat, sel = i === S.sel;
    p.dim += ((on ? 0 : 1) - p.dim) * Math.min(1, dt * 6); p.hov += ((hoverI === i ? 1 : 0) - p.hov) * Math.min(1, dt * 12);
    if (sel) { tv.copy(p.home).multiplyScalar(.6); tv.y = 2.15 + Math.sin(t * .8) * .05; } else { tv.copy(p.home); tv.y = 1.9 + p.hov * .14 - p.dim * .25; }
    p.g.position.lerp(tv, k);
    te.set(0, p.homeYaw + (sel ? Math.sin(t * .6) * .12 : 0), 0); tq.setFromEuler(te); p.g.quaternion.slerp(tq, k);
    const s = (sel ? 1.45 : 1) * (1 + p.hov * .05) * (1 - p.dim * .12); p.g.scale.setScalar(p.g.scale.x + (s - p.g.scale.x) * k);
    p.scrMat.color.setScalar(1 - p.dim * .7); p.base.material.color.set(sel ? '#7dffe0' : '#18c29c');
  });
  // beam from selected phone to the screen
  const sp0 = phones[S.sel] ? phones[S.sel].g.position : new THREE.Vector3(); const c1 = new THREE.Vector3((sp0.x) * .5, 7.5, (sp0.z + SCR_CENTER.z) / 2);
  for (let i = 0; i < NB; i++) {
    bt[i] += dt * .32; if (bt[i] > 1) bt[i] -= 1; const u = bt[i], a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
    bpos[i * 3] = a * sp0.x + b * c1.x + c * SCR_CENTER.x + Math.sin(i * 7 + t) * .05; bpos[i * 3 + 1] = a * (sp0.y + 1.1) + b * c1.y + c * SCR_CENTER.y; bpos[i * 3 + 2] = a * sp0.z + b * c1.z + c * SCR_CENTER.z;
  }
  bgeo.attributes.position.needsUpdate = true;
  updateHover();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

/* ---------- boot ---------- */
Promise.all(EXP.map(e => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => { const c = document.createElement('canvas'); c.width = c.height = 4; res(c); }; im.src = e.img; }))).then(images => {
  S.images = images; buildPhones(images); renderChips(); select(0); $('stats').textContent = EXP.length + ' EXPERIENCES · YOUR PHONE IS THE CONTROLLER · NO APP, NO ACCOUNT';
  frame(); setTimeout(() => $('load').classList.add('off'), 400); setTimeout(() => $('hint').classList.add('off'), 15000);
  window.__remote = { S, select, step, P };
});

/* ---------- phone remote (display side) ---------- */
import { RelayLink } from './relay.js';
{
  let sid = null; try { sid = sessionStorage.getItem('elrm_id'); } catch (e) { }
  if (!sid) { sid = (Math.random().toString(36) + '000000').slice(2, 8); try { sessionStorage.setItem('elrm_id', sid); } catch (e) { } }
  const url = location.origin + location.pathname + '?c=' + sid;
  { const qq = qrcode(0, 'M'); qq.addData(url); qq.make(); const c = $('rqc'), g = c.getContext('2d'), m = qq.getModuleCount(), cs = Math.floor(332 / (m + 2)), off = Math.floor((332 - m * cs) / 2); g.fillStyle = '#fff'; g.fillRect(0, 0, 332, 332); g.fillStyle = '#06201c'; for (let r = 0; r < m; r++) for (let cc = 0; cc < m; cc++) if (qq.isDark(r, cc)) g.fillRect(off + cc * cs, off + r * cs, cs, cs); $('rsid').textContent = 'SESSION ' + sid; }
  if (matchMedia('(pointer:coarse)').matches) $('rpill').classList.add('hasjoy');
  $('rpill').onclick = () => $('rcard').classList.toggle('on');
  let last = '';
  const stateMsg = () => { const e = EXP[S.sel], v = visible(); return { t: 'state', sel: S.sel, cat: S.cat, auto: S.auto, name: e.name, title: e.title, sub: e.sub, img: e.img, url: expUrl(e), pos: v.indexOf(S.sel) + 1, total: v.length, cats: CATS.map(n => ({ n, c: n === 'All' ? EXP.length : EXP.filter(x => x.cat === n).length })), list: v.map(i => ({ i, name: EXP[i].name, img: EXP[i].img })) }; };
  const push = force => { const m = stateMsg(), j = JSON.stringify(m); if (force || j !== last) { if (rl.send(m)) last = j; } };
  const rl = RelayLink('display', sid, m => {
    if (m.t === '_join' || m.t === 'hello') { $('rstat').classList.add('on'); push(true); $('hint').classList.add('off'); $('rcard').classList.remove('on'); }
    else if (m.t === '_leave') { $('rstat').classList.remove('on'); joy.x = joy.y = 0; }
    else if (m.t === 'sel') { S.auto = false; syncAuto(); select(m.i | 0); }
    else if (m.t === 'next') { S.auto = false; syncAuto(); step(1); } else if (m.t === 'prev') { S.auto = false; syncAuto(); step(-1); }
    else if (m.t === 'auto') { S.auto = !S.auto; syncAuto(); if (S.auto) step(1); }
    else if (m.t === 'cat') { S.cat = m.c; const v = visible(); renderChips(); select(v.includes(S.sel) ? S.sel : v[0]); }
    else if (m.t === 'look') look(m.dx * 1.4, m.dy * 1.4);
    else if (m.t === 'move') { joy.x = m.x; joy.y = m.y; }
  }, s => { if (s === 'open') rl.send({ t: '_hi' }); });
  setInterval(() => push(false), 400);
}
