import { RelayLink } from '../../remote/room/relay.js';
const sid = new URLSearchParams(location.search).get('c');
const $ = id => document.getElementById(id);
document.title = 'Director · MultiCam';
$('phoneui').style.display = 'block';
let st = null;
const link = RelayLink('phone', sid, m => { if (m.t === 'state') { st = m; render(); } }, s => { $('pstat').textContent = s === 'open' ? 'Connected' : 'Reconnecting…'; $('pstat').className = s === 'open' ? 'ok' : ''; if (s === 'open') link.send({ t: 'hello' }); });
const send = m => link.send(m);
function render() {
  $('pcam').textContent = 'ON AIR: ' + st.cams[st.cam].n + ' CAM'; $('psec').textContent = st.sec + (st.auto ? ' · auto-cut' : ' · manual');
  $('pauto').textContent = st.auto ? '⏸ Auto-cut on' : '▶ Resume auto-cut';
  const c = $('pcams'); if (!c.children.length) st.cams.forEach((x, i) => { const b = document.createElement('button'); b.textContent = x.n; b.style.color = x.col; b.onclick = () => send({ t: 'cam', i }); c.appendChild(b); });
  [...c.children].forEach((b, i) => b.classList.toggle('on', i === st.cam));
  $('pimg').src = st.img; $('ptitle').textContent = st.name || st.sheets[st.sheet].name; $('psub').textContent = st.title;
  const l = $('plist'); if (!l.children.length) st.sheets.forEach(x => { const b = document.createElement('button'); b.innerHTML = '<img src="' + x.img + '"><span>' + x.name + '</span>'; b.onclick = () => send({ t: 'sheet', i: x.i }); l.appendChild(b); });
  [...l.children].forEach((b, i) => b.classList.toggle('on', i === st.sheet));
}
$('pauto').onclick = () => send({ t: 'auto' }); $('pprev').onclick = () => send({ t: 'prev' }); $('pnext').onclick = () => send({ t: 'next' });
