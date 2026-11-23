import { RelayLink } from './relay.js';
const sid = new URLSearchParams(location.search).get('c');
const $ = id => document.getElementById(id);
document.title = 'Remote · Mobile Showroom';
$('phoneui').style.display = 'block';
let st = null;
const link = RelayLink('phone', sid, m => { if (m.t === 'state') { st = m; render(); } }, s => { $('pstat').textContent = s === 'open' ? 'Connected' : 'Reconnecting…'; $('pstat').className = s === 'open' ? 'ok' : ''; if (s === 'open') link.send({ t: 'hello' }); });
const send = m => link.send(m);
function render() {
  $('pcnt').textContent = st.name + ' · ' + st.pos + ' of ' + st.total;
  $('ptitle').textContent = st.title; $('psub').textContent = st.sub; $('pimg').src = st.img; $('plive').href = st.url;
  $('pauto').textContent = st.auto ? '⏸ Pause tour' : '▶ Auto-present';
  const c = $('pcats'); if (c.dataset.k !== JSON.stringify(st.cats)) { c.dataset.k = JSON.stringify(st.cats); c.innerHTML = ''; st.cats.forEach(x => { const b = document.createElement('button'); b.textContent = x.n + ' ' + x.c; b.dataset.n = x.n; b.onclick = () => send({ t: 'cat', c: x.n }); c.appendChild(b); }); }
  [...$('pcats').children].forEach(b => b.classList.toggle('on', b.dataset.n === st.cat));
  const l = $('plist'), key = st.cat + st.list.map(x => x.i).join();
  if (l.dataset.k !== key) { l.dataset.k = key; l.innerHTML = ''; st.list.forEach(x => { const b = document.createElement('button'); b.innerHTML = '<img src="' + x.img + '"><span>' + x.name + '</span>'; b.dataset.i = x.i; b.onclick = () => send({ t: 'sel', i: x.i }); l.appendChild(b); }); }
  [...l.children].forEach(b => b.classList.toggle('on', +b.dataset.i === st.sel));
}
$('pprev').onclick = () => send({ t: 'prev' }); $('pnext').onclick = () => send({ t: 'next' }); $('pauto').onclick = () => send({ t: 'auto' });
const pad = $('ppad'); let last = null;
pad.addEventListener('pointerdown', e => { pad.setPointerCapture(e.pointerId); last = { x: e.clientX, y: e.clientY }; });
pad.addEventListener('pointermove', e => { if (!last) return; send({ t: 'look', dx: e.clientX - last.x, dy: e.clientY - last.y }); last = { x: e.clientX, y: e.clientY }; });
pad.addEventListener('pointerup', () => last = null); pad.addEventListener('pointercancel', () => last = null);
const j = $('pjoy'), k = j.querySelector('b'); let jd = false;
function jm(e) { const r = j.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2); const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } k.style.transform = `translate(${x * 36}px,${y * 36}px)`; send({ t: 'move', x, y }); }
j.addEventListener('pointerdown', e => { jd = true; j.setPointerCapture(e.pointerId); jm(e); }); j.addEventListener('pointermove', e => { if (jd) jm(e); });
const jend = () => { jd = false; k.style.transform = ''; send({ t: 'move', x: 0, y: 0 }); }; j.addEventListener('pointerup', jend); j.addEventListener('pointercancel', jend);
