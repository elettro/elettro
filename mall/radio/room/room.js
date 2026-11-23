import * as THREE from 'three';

/* ===== Stashbox Radio: spatial room =====
   83 real songs from stashbox.com/radio. Album covers hang on a ring wall, grouped into genre sectors.
   Picking a genre lifts its tracks off the wall into an orbiting ring around the turntable.
   Clicking a cover plays the real audio file and loads the cover onto the turntable. */

const FAMS = [
  { id: 'reggae', n: 'Reggae & Island', c: '#ffb02e', g: ['Reggae', 'Ska', 'Hawaiian'] },
  { id: 'rock', n: 'Rock & Psych', c: '#ff4f6a', g: ['Rock', 'Folk Rock', 'Psychedelic Rock', 'Psychedelic', 'Shoegaze'] },
  { id: 'pop', n: 'Pop & Dance', c: '#ff5fd2', g: ['Pop', 'Tropical Pop', 'EDM'] },
  { id: 'soul', n: 'Soul & Funk', c: '#a56bff', g: ['Soul', 'Old Soul', 'Funk', 'Funk/Soul', 'Gospel', 'Bluesy'] },
  { id: 'rap', n: 'Rap', c: '#3d86ff', g: ['Rap', 'Comedy Rap'] },
  { id: 'latin', n: 'Latin & World', c: '#18c29c', g: ['Rumba Flamenco', 'Salsa', 'Afro-Cuban Jazz', 'Italian', 'World'] },
  { id: 'jazz', n: 'Jazz & Jams', c: '#22e6ff', g: ['Jazz', 'Live Jam', 'Instrumental'] },
  { id: 'more', n: 'More', c: '#c9d1d9', g: [] },
];
const famOf = g => FAMS.find(f => f.g.includes(g)) || FAMS[FAMS.length - 1];
const $ = id => document.getElementById(id);

/* ---------- renderer ---------- */
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#05060d');
scene.fog = new THREE.FogExp2('#05060d', 0.011);
const camera = new THREE.PerspectiveCamera(70, 1, .05, 300);
camera.rotation.order = 'YXZ';
function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

const R = 13, ROWS = 3, ROW_Y = [1.55, 3.5, 5.45], SZ = 1.72;
const texLoader = new THREE.TextureLoader();
const cvTex = (w, h, draw, repeat) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };

/* ---------- static room ---------- */
// floor
{
  const tex = cvTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#0a0c19'; g.fillRect(0, 0, w, h);
    g.translate(w / 2, h / 2);
    for (let r = 60; r < 512; r += 52) { g.strokeStyle = `rgba(120,140,255,${r > 440 ? .22 : .1})`; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); }
    for (let a = 0; a < 48; a++) { g.save(); g.rotate(a / 48 * Math.PI * 2); g.strokeStyle = 'rgba(120,140,255,.06)'; g.beginPath(); g.moveTo(80, 0); g.lineTo(500, 0); g.stroke(); g.restore(); }
  });
  const f = new THREE.Mesh(new THREE.CircleGeometry(R + 1.2, 96), new THREE.MeshStandardMaterial({ map: tex, roughness: .35, metalness: .55, envMapIntensity: 0 }));
  f.rotation.x = -Math.PI / 2; scene.add(f);
  // wall (slatted, open top)
  const wt = cvTex(512, 256, (g, w, h) => { g.fillStyle = '#0d1022'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { g.fillStyle = '#141833'; g.fillRect(x, 0, 11, h); } }, true);
  wt.repeat.set(24, 1);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(R + 1.2, R + 1.2, 8.2, 96, 1, true), new THREE.MeshStandardMaterial({ map: wt, side: THREE.BackSide, roughness: .8 }));
  wall.position.y = 4.1; scene.add(wall);
  // neon rim top
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R + 1.2, .06, 8, 128), new THREE.MeshBasicMaterial({ color: '#ffb02e' })); rim.rotation.x = Math.PI / 2; rim.position.y = 8.2; scene.add(rim);
  const rim2 = rim.clone(); rim2.position.y = .05; rim2.material = new THREE.MeshBasicMaterial({ color: '#22e6ff' }); scene.add(rim2);
}
// dome sky + stars
{
  const sky = new THREE.Mesh(new THREE.SphereGeometry(120, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec3 p;void main(){float h=clamp(p.y,0.,1.);vec3 c=mix(vec3(.06,.05,.16),vec3(.01,.01,.04),pow(h,.6));gl_FragColor=vec4(c,1.);}' }));
  scene.add(sky);
  const pos = []; for (let i = 0; i < 700; i++) { const t = Math.random() * 6.283, u = Math.random() * .9 + .06, r = Math.sqrt(1 - u * u); pos.push(Math.cos(t) * r * 110, u * 110, Math.sin(t) * r * 110); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ size: 1.4, sizeAttenuation: false, color: '#fff', fog: false, transparent: true, opacity: .8 })));
}
scene.add(new THREE.HemisphereLight('#8e98ff', '#1a1230', .9));
const stageLight = new THREE.PointLight('#ffb02e', 70, 34, 2); stageLight.position.set(0, 6, 0); scene.add(stageLight);

/* ---------- stage: turntable ---------- */
const stage = new THREE.Group(); scene.add(stage);
const platter = new THREE.Group(); platter.position.y = .4; stage.add(platter);
let labelMat;
{
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 3.05, .34, 64), new THREE.MeshStandardMaterial({ color: '#12162c', roughness: .4, metalness: .7 })); base.position.y = .17; stage.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.95, .05, 8, 96), new THREE.MeshBasicMaterial({ color: '#ffb02e' })); ring.rotation.x = Math.PI / 2; ring.position.y = .36; stage.add(ring);
  const gTex = cvTex(512, 512, (g, w, h) => { g.fillStyle = '#0a0a0e'; g.fillRect(0, 0, w, h); g.translate(w / 2, h / 2); for (let r = 40; r < 250; r += 3) { g.strokeStyle = `rgba(255,255,255,${.04 + (r % 9 === 0 ? .08 : 0)})`; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); } const gr = g.createLinearGradient(-250, -250, 250, 250); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,.13)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(-256, -256, 512, 512); });
  const vinyl = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, .06, 96), [new THREE.MeshStandardMaterial({ color: '#0a0a0e', roughness: .4 }), new THREE.MeshStandardMaterial({ map: gTex, roughness: .3, metalness: .3 }), new THREE.MeshStandardMaterial({ color: '#0a0a0e' })]);
  platter.add(vinyl);
  labelMat = new THREE.MeshBasicMaterial({ color: '#ffb02e' });
  const lab = new THREE.Mesh(new THREE.CircleGeometry(.7, 48), labelMat); lab.rotation.x = -Math.PI / 2; lab.position.y = .035; platter.add(lab);
  const sp = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .12, 12), new THREE.MeshStandardMaterial({ color: '#cfd4da', metalness: 1, roughness: .2 })); sp.position.y = .06; platter.add(sp);
  // tonearm
  var arm = new THREE.Group(); arm.position.set(2.5, .9, -1.6); stage.add(arm);
  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, .5, 24), new THREE.MeshStandardMaterial({ color: '#1e2340', metalness: .8, roughness: .3 })); pivot.position.y = -.4; arm.add(pivot);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(.07, .07, 2.6), new THREE.MeshStandardMaterial({ color: '#d6dae0', metalness: 1, roughness: .25 })); bar.position.set(0, 0, 1.3); arm.add(bar);
  const head = new THREE.Mesh(new THREE.BoxGeometry(.22, .1, .34), new THREE.MeshStandardMaterial({ color: '#111', roughness: .5 })); head.position.set(0, -.02, 2.7); arm.add(head);
  // light cone
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 1.2, 7.5, 48, 1, true), new THREE.MeshBasicMaterial({ color: '#ffb02e', transparent: true, opacity: .05, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  cone.position.y = 4.1; stage.add(cone);
}

/* ---------- state ---------- */
const state = { songs: [], tracks: [], fam: null, genre: null, q: '', live: false, current: null, queue: [], shuffle: false, playing: false };
const audio = new Audio(); audio.preload = 'none'; audio.volume = .9;

/* ---------- build ---------- */
const sleeveGeo = new THREE.BoxGeometry(SZ, SZ, .07);
const rimGeo = new THREE.BoxGeometry(SZ + .12, SZ + .12, .04);
const slotGeo = new THREE.BoxGeometry(SZ + .06, SZ + .06, .02);
const pickables = [];
const loadMgr = new THREE.LoadingManager();
loadMgr.onProgress = (u, i, n) => { document.querySelector('#lb b').style.width = (i / n * 100) + '%'; };
loadMgr.onLoad = () => { $('load').classList.add('off'); };
const loader = new THREE.TextureLoader(loadMgr);

const sectorSigns = [];
function buildAll(songs) {
  songs.forEach(s => s.fam = famOf(s.g));
  const ordered = [];
  const famGroups = [];
  for (const f of FAMS) {
    const list = songs.filter(s => s.fam === f).sort((a, b) => FAMS.indexOf(f) - FAMS.indexOf(f) || f.g.indexOf(a.g) - f.g.indexOf(b.g) || a.t.localeCompare(b.t));
    if (list.length) famGroups.push({ f, list });
  }
  const colCounts = famGroups.map(g => Math.ceil(g.list.length / ROWS));
  const totalCols = colCounts.reduce((a, b) => a + b, 0) + famGroups.length + 4;
  const dTh = Math.PI * 2 / totalCols;
  let col = 0;
  famGroups.forEach((grp, gi) => {
    const startCol = col;
    grp.list.forEach((s, i) => {
      const c = startCol + Math.floor(i / ROWS), row = i % ROWS;
      const th = Math.PI / 2 + 2 * dTh + (c + .5) * dTh;
      const pos = new THREE.Vector3(Math.cos(th) * R, ROW_Y[row], Math.sin(th) * R);
      const yaw = Math.atan2(-Math.cos(th), -Math.sin(th));
      const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
      const tex = loader.load(s.img); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const dark = new THREE.MeshStandardMaterial({ color: '#0c0e1c', roughness: .6 });
      const artM = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: .62, roughness: .55, metalness: 0 });
      const mesh = new THREE.Mesh(sleeveGeo, [dark, dark, dark, dark, artM, dark]);
      const rimM = new THREE.MeshStandardMaterial({ color: '#000', emissive: grp.f.c, emissiveIntensity: .55, roughness: 1 });
      const rim = new THREE.Mesh(rimGeo, rimM); rim.position.z = -.045;
      const g = new THREE.Group(); g.add(mesh); g.add(rim); g.position.copy(pos); g.quaternion.copy(quat); scene.add(g);
      // slot outline stays on the wall when the sleeve lifts off
      const slot = new THREE.Mesh(slotGeo, new THREE.MeshStandardMaterial({ color: '#0b0d1a', emissive: grp.f.c, emissiveIntensity: .035, roughness: 1 }));
      slot.position.copy(pos); slot.quaternion.copy(quat); slot.position.add(new THREE.Vector3(Math.cos(th), 0, Math.sin(th)).multiplyScalar(.05)); scene.add(slot);
      const t = { s, g, mesh, artM, rimM, tex, home: pos.clone(), homeQ: quat.clone(), mode: 'wall', ring: null, dim: 0, hov: 0, famC: grp.f.c };
      mesh.userData.track = t; pickables.push(mesh);
      s.tr = t; state.tracks.push(t);
    });
    // sector sign
    const midC = startCol + colCounts[gi] / 2;
    const th = Math.PI / 2 + 2 * dTh + midC * dTh;
    const sign = signMesh(grp.f.n.toUpperCase(), grp.list.length + ' tracks', grp.f.c);
    sign.position.set(Math.cos(th) * (R + .6), 7.2, Math.sin(th) * (R + .6));
    sign.rotation.y = Math.atan2(-Math.cos(th), -Math.sin(th)); scene.add(sign);
    sectorSigns.push({ fam: grp.f, th });
    // floor arc
    const a0 = Math.PI / 2 + 2 * dTh + startCol * dTh, a1 = a0 + colCounts[gi] * dTh;
    const arcG = new THREE.RingGeometry(R - 1.3, R - .95, 48, 1, -a1 + 0 * a0, a1 - a0);
    arcG.rotateX(-Math.PI / 2);
    const arc = new THREE.Mesh(arcG, new THREE.MeshBasicMaterial({ color: grp.f.c, transparent: true, opacity: .8, side: THREE.DoubleSide })); arc.position.y = .03; scene.add(arc);
    col += colCounts[gi] + 1;
  });
  // exit door at the gap (south)
  const door = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 5.2), new THREE.MeshBasicMaterial({ map: cvTex(256, 360, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#fff6d0'); gr.addColorStop(1, '#ffb04c'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#3a2000'; g.font = 'bold 30px Segoe UI,Arial'; g.textAlign = 'center'; g.fillText('MALL STREET', w / 2, 120); g.font = '60px Segoe UI Emoji'; g.fillText('🚪', w / 2, 210); g.font = '20px Segoe UI,Arial'; g.fillText('click to leave', w / 2, 250); }) }));
  door.position.set(0, 2.6, R + 1.1); door.rotation.y = Math.PI; scene.add(door); door.userData.exit = true; pickables.push(door);
}
function signMesh(title, sub, color) {
  const tex = cvTex(1024, 256, (g, w, h) => {
    g.fillStyle = '#080a18e6'; g.fillRect(0, 0, w, h);
    g.strokeStyle = color; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12);
    g.fillStyle = color; g.shadowColor = color; g.shadowBlur = 24;
    let fs = 108; g.font = `800 ${fs}px "Segoe UI",Arial`; while (g.measureText(title).width > w - 80) { fs -= 4; g.font = `800 ${fs}px "Segoe UI",Arial`; }
    g.textAlign = 'center'; g.fillText(title, w / 2, 135);
    g.shadowBlur = 0; g.fillStyle = '#e9e4da'; g.font = '600 38px "Segoe UI",Arial'; g.fillText(sub, w / 2, 205);
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.6), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
}

/* ---------- filtering ---------- */
function matches(s) {
  if (state.fam && s.fam !== state.fam) return false;
  if (state.genre && s.g !== state.genre) return false;
  if (state.live && !s.live) return false;
  if (state.q) { const h = (s.t + ' ' + s.a + ' ' + s.g + ' ' + s.g2 + ' ' + s.m.join(' ') + ' ' + s.al).toLowerCase(); if (!state.q.split(/\s+/).every(w => h.includes(w))) return false; }
  return true;
}
const isFiltered = () => !!(state.fam || state.genre || state.live || state.q);
function applyFilter() {
  const filt = isFiltered();
  const list = state.songs.filter(matches);
  state.tracks.forEach(t => { t.match = matches(t.s); });
  // ring slots
  const cap = 22; let idx = 0;
  const ringTracks = filt ? state.tracks.filter(t => t.match) : [];
  const rings = Math.ceil(ringTracks.length / cap) || 1;
  ringTracks.forEach((t, i) => { const r = Math.floor(i / cap); const inRing = Math.min(cap, ringTracks.length - r * cap); t.ring = { r, i: i % cap, n: inRing }; });
  state.tracks.forEach(t => { if (t !== state.current) t.mode = (filt && t.match) ? 'ring' : 'wall'; if (!t.match) t.ring = null; });
  state.filteredList = list;
  document.querySelectorAll('.chip[data-live]').forEach(b => b.classList.toggle('on', state.live));
  $('stats').textContent = filt ? `${list.length} OF ${state.songs.length} TRACKS IN THE RING` : `${state.songs.length} TRACKS · ${new Set(state.songs.map(s => s.g)).size} GENRES · ${state.songs.filter(s => s.live).length} LIVE`;
  if (filt && list.length) flyTo(new THREE.Vector3(0, 1.65, 9.6), Math.PI * 0, -0.08);
}

/* ---------- chips ---------- */
function renderChips() {
  const fam = $('fam'); fam.innerHTML = '';
  const mk = (label, n, on, color, fn, cls = '') => { const b = document.createElement('button'); b.className = 'chip ' + cls + (on ? ' on' : ''); b.innerHTML = `${label}<i>${n ?? ''}</i>`; if (on) b.style.background = color || '#fff'; b.onclick = fn; return b; };
  fam.appendChild(mk('All', state.songs.length, !isFiltered(), '#fff', () => { state.fam = state.genre = null; state.live = false; state.q = ''; $('q').value = ''; sync(); }));
  for (const f of FAMS) { const n = state.songs.filter(s => s.fam === f).length; if (!n) continue; fam.appendChild(mk(f.n, n, state.fam === f && !state.genre, f.c, () => { state.fam = state.fam === f && !state.genre ? null : f; state.genre = null; sync(); })); }
  fam.appendChild(mk('● Live recordings', state.songs.filter(s => s.live).length, state.live, '#ff5fd2', () => { state.live = !state.live; sync(); })).dataset.live = 1;
  const q = document.createElement('input'); q.id = 'q'; q.placeholder = 'Search title, mood, artist…'; q.value = state.q; q.oninput = () => { state.q = q.value.trim().toLowerCase(); applyFilter(); renderChips2(); }; q.onkeydown = e => e.stopPropagation();
  fam.appendChild(q);
  renderChips2();
}
function renderChips2() {
  const sub = $('sub'); sub.innerHTML = '';
  if (!state.fam) return;
  const gs = [...new Set(state.songs.filter(s => s.fam === state.fam).map(s => s.g))];
  gs.forEach(g => { const n = state.songs.filter(s => s.g === g).length; const b = document.createElement('button'); b.className = 'chip sub' + (state.genre === g ? ' on' : ''); b.innerHTML = `${g}<i>${n}</i>`; if (state.genre === g) b.style.background = state.fam.c; b.onclick = () => { state.genre = state.genre === g ? null : g; sync(); }; sub.appendChild(b); });
}
function sync() { applyFilter(); const qv = $('q') && $('q').value; renderChips(); if ($('q')) $('q').value = state.q; $('hint').classList.add('off'); }

/* ---------- playback ---------- */
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
function play(t) {
  const prev = state.current;
  if (prev && prev !== t) prev.mode = (isFiltered() && prev.match) ? 'ring' : 'wall';
  state.current = t; t.mode = 'stage';
  audio.src = t.s.u; audio.play().then(() => { }).catch(() => { $('npA').textContent = 'Tap play to start audio'; });
  state.playing = true;
  labelMat.map = t.tex; labelMat.color.set('#ffffff'); labelMat.needsUpdate = true;
  $('np').style.display = 'block'; $('npImg').src = t.s.img; $('npT').textContent = t.s.t; $('npA').textContent = t.s.a + (t.s.al ? ' · ' + t.s.al : ''); $('npG').textContent = t.s.g + (t.s.live ? ' · live' : ''); $('npG').style.background = t.famC;
  $('lnkShop').href = t.s.shop || 'https://stashbox.ai'; $('lnkShop').style.display = t.s.shop ? '' : 'none';
  $('bPlay').textContent = '⏸'; $('hint').classList.add('off');
  state.queue = (isFiltered() ? state.filteredList : state.songs).slice();
  if ('mediaSession' in navigator) { navigator.mediaSession.metadata = new MediaMetadata({ title: t.s.t, artist: t.s.a, album: 'Stashbox Radio', artwork: [{ src: new URL(t.s.img, location.href).href, sizes: '400x400', type: 'image/jpeg' }] }); navigator.mediaSession.setActionHandler('nexttrack', next); navigator.mediaSession.setActionHandler('previoustrack', prevT); }
}
function step(d) {
  const q = state.queue.length ? state.queue : state.songs; const cur = state.current ? q.indexOf(state.current.s) : -1;
  let i = state.shuffle ? Math.floor(Math.random() * q.length) : (cur + d + q.length) % q.length;
  play(q[i].tr);
}
const next = () => step(1), prevT = () => step(-1);
audio.addEventListener('ended', next);
audio.addEventListener('error', () => { if (state.current) { $('npA').textContent = 'Could not load this track, skipping…'; setTimeout(next, 1200); } });
audio.addEventListener('timeupdate', () => { $('barF').style.width = (audio.currentTime / (audio.duration || 1) * 100) + '%'; $('tc').textContent = fmt(audio.currentTime); $('td').textContent = fmt(audio.duration); });
audio.addEventListener('play', () => { state.playing = true; $('bPlay').textContent = '⏸'; }); audio.addEventListener('pause', () => { state.playing = false; $('bPlay').textContent = '▶'; });
$('bPlay').onclick = () => audio.paused ? audio.play() : audio.pause();
$('bNext').onclick = next; $('bPrev').onclick = prevT;
$('bShuf').onclick = e => { state.shuffle = !state.shuffle; e.currentTarget.classList.toggle('on', state.shuffle); };
$('vol').oninput = e => audio.volume = +e.target.value;
$('bar').onclick = e => { const r = e.currentTarget.getBoundingClientRect(); if (audio.duration) audio.currentTime = (e.clientX - r.left) / r.width * audio.duration; };
addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; if (e.code === 'Space') { e.preventDefault(); if (state.current) audio.paused ? audio.play() : audio.pause(); } if (e.code === 'KeyN') next(); if (e.code === 'KeyP') prevT(); });

/* ---------- camera / controls ---------- */
const P = { x: 0, z: 11.2, yaw: 0, pitch: -.02 }; let fly = null;
function flyTo(v, yaw, pitch) { fly = { t: 0, from: { x: P.x, z: P.z, yaw: P.yaw, pitch: P.pitch }, to: { x: v.x, z: v.z, yaw, pitch } }; }
const keys = {}; addEventListener('keydown', e => keys[e.code] = true); addEventListener('keyup', e => keys[e.code] = false);
let drag = null, moved = 0, joy = { x: 0, y: 0 };
const look = (dx, dy) => { P.yaw -= dx * .0026; P.pitch = Math.max(-1.3, Math.min(1.3, P.pitch - dy * .0026)); fly = null; };
canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; moved = 0; });
addEventListener('pointerup', e => { if (drag && moved < 6) pick(e.clientX, e.clientY); drag = null; });
addEventListener('pointermove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  if (drag && e.pointerId === drag.id) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy); if (moved >= 6) look(dx, dy); drag.x = e.clientX; drag.y = e.clientY; }
});
const mouse = { x: 0, y: 0 };
const joyEl = $('joy'), knob = joyEl.querySelector('b');
joyEl.addEventListener('pointerdown', e => { joyEl.setPointerCapture(e.pointerId); joyMove(e); });
joyEl.addEventListener('pointermove', e => { if (e.buttons || e.pressure) joyMove(e); });
joyEl.addEventListener('pointerup', () => { joy.x = joy.y = 0; knob.style.transform = ''; });
function joyMove(e) { const r = joyEl.getBoundingClientRect(); let x = (e.clientX - r.left - 55) / 45, y = (e.clientY - r.top - 55) / 45; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } joy.x = x; joy.y = y; knob.style.transform = `translate(${x * 30}px,${y * 30}px)`; }

/* ---------- picking ---------- */
const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2(); const tip = $('tip');
function rayAt(x, y) { ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(pickables, false)[0]; return h && h.object; }
function pick(x, y) { const o = rayAt(x, y); if (!o) return; if (o.userData.exit) { location.href = '/mall/'; return; } const t = o.userData.track; if (t) { if (t === state.current) { audio.paused ? audio.play() : audio.pause(); } else play(t); } }
let hoverT = null;
function updateHover() {
  if (drag && moved >= 6) { tip.style.opacity = 0; return; }
  const o = rayAt(mouse.x, mouse.y); const t = o && o.userData.track; hoverT = t || null;
  canvas.classList.toggle('hover', !!o);
  if (t) { tip.innerHTML = `<b>${t.s.t}</b><span>${t.s.a} · ${t.s.g}${t.s.live ? ' · live' : ''}</span>`; tip.style.left = mouse.x + 'px'; tip.style.top = mouse.y + 'px'; tip.style.opacity = 1; } else if (o && o.userData.exit) { tip.innerHTML = '<b>Back to the mall street</b>'; tip.style.left = mouse.x + 'px'; tip.style.top = mouse.y + 'px'; tip.style.opacity = 1; } else tip.style.opacity = 0;
}

/* ---------- motes ---------- */
const motes = (() => { const n = 260, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, r = Math.random() * 12; pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.random() * 7; pos[i * 3 + 2] = Math.sin(a) * r; } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const p = new THREE.Points(g, new THREE.PointsMaterial({ size: .05, color: '#ffd9a0', transparent: true, opacity: .5, depthWrite: false })); scene.add(p); return p; })();

/* ---------- loop ---------- */
const clock = new THREE.Clock(); const tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpE = new THREE.Euler();
let armA = 0, discSpin = 0;
function frame() {
  const dt = Math.min(clock.getDelta(), .05), time = clock.elapsedTime;
  // movement
  if (fly) { fly.t = Math.min(1, fly.t + dt / 1.3); const e = fly.t * fly.t * (3 - 2 * fly.t); P.x = fly.from.x + (fly.to.x - fly.from.x) * e; P.z = fly.from.z + (fly.to.z - fly.from.z) * e; let dy = fly.to.yaw - fly.from.yaw; while (dy > Math.PI) dy -= 6.283; while (dy < -Math.PI) dy += 6.283; P.yaw = fly.from.yaw + dy * e; P.pitch = fly.from.pitch + (fly.to.pitch - fly.from.pitch) * e; if (fly.t >= 1) fly = null; }
  else if (document.activeElement.tagName !== 'INPUT') {
    const fw = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - joy.y, st = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + joy.x;
    if (keys.ArrowLeft) P.yaw += 1.8 * dt; if (keys.ArrowRight) P.yaw -= 1.8 * dt;
    const sp = keys.ShiftLeft ? 6 : 3.2;
    let nx = P.x + (-Math.sin(P.yaw) * fw + Math.cos(P.yaw) * st) * sp * dt, nz = P.z + (-Math.cos(P.yaw) * fw - Math.sin(P.yaw) * st) * sp * dt;
    const r = Math.hypot(nx, nz); const lo = 3.7, hi = 12.3; if (r < lo) { nx *= lo / r; nz *= lo / r; } else if (r > hi) { nx *= hi / r; nz *= hi / r; }
    P.x = nx; P.z = nz;
  }
  camera.position.set(P.x, 1.65, P.z); camera.rotation.set(P.pitch, P.yaw, 0);
  // turntable
  if (state.playing) discSpin += dt * 3.5; platter.rotation.y = -discSpin;
  armA += ((state.playing ? 1 : 0) - armA) * Math.min(1, dt * 2); arm.rotation.y = -0.5 - armA * 0.5;
  // sleeves
  const k = 1 - Math.exp(-dt * 5);
  for (const t of state.tracks) {
    let tp, tq, ts = 1;
    if (t.mode === 'stage') { tp = tmpV.set(0, 3.9, 0); tmpE.set(0, Math.atan2(camera.position.x, camera.position.z), 0); tq = tmpQ.setFromEuler(tmpE); ts = 1.55; }
    else if (t.mode === 'ring' && t.ring) {
      const rr = 5.6 + t.ring.r * .0, a = t.ring.i / t.ring.n * 6.283 + time * .09 * (t.ring.r % 2 ? -1 : 1);
      tp = tmpV.set(Math.cos(a) * rr, 2.1 + t.ring.r * 1.5 + Math.sin(time * .6 + t.ring.i) * .06, Math.sin(a) * rr);
      tmpE.set(0, Math.atan2(Math.cos(a), Math.sin(a)), 0); tq = tmpQ.setFromEuler(tmpE); ts = .78;
    } else { tp = t.home; tq = t.homeQ; }
    if (t.hov !== undefined) { const th = hoverT === t ? 1 : 0; t.hov += (th - t.hov) * Math.min(1, dt * 12); ts *= 1 + t.hov * .07; }
    t.g.position.lerp(tp, k); t.g.quaternion.slerp(tq, k); const s = t.g.scale.x + (ts - t.g.scale.x) * k; t.g.scale.setScalar(s);
    const dimT = (isFiltered() && !t.match && t !== state.current) ? 1 : 0; t.dim += (dimT - t.dim) * Math.min(1, dt * 6);
    t.artM.emissiveIntensity = .62 - t.dim * .5 + t.hov * .12; t.artM.color.setScalar(1 - t.dim * .75);
    t.rimM.emissiveIntensity = (t === state.current ? 1.4 : .55) - t.dim * .45;
  }
  motes.rotation.y += dt * .01;
  updateHover();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

/* ---------- boot ---------- */
fetch('songs.json').then(r => r.json()).then(songs => {
  state.songs = songs; buildAll(songs); renderChips(); applyFilter(); state.filteredList = songs; frame();
  window.__radio = { state, play, P, flyTo, applyFilter, sync };
}).catch(e => { $('load').querySelector('p').textContent = 'Could not load the catalog: ' + e.message; });
