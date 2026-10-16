'use strict';
const storageKey = 'elettro-bobby-rompe-review-v1';
let items = [];
let decisions = {};
let storageAvailable = true;
try { decisions = JSON.parse(localStorage.getItem(storageKey) || '{}'); if (!decisions || Array.isArray(decisions) || typeof decisions !== 'object') decisions = {}; } catch { storageAvailable = false; }
const statuses = { pending: 'Needs review', approved: 'Approved', changes: 'Changes requested', hold: 'On hold' };
const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
const duration = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const current = id => ({ status: 'pending', notes: '', ...(decisions[id] || {}) });
let toastTimer;
function toast(message) { const n = document.getElementById('toast'); n.textContent = message; n.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => n.classList.remove('show'), 2600); }
function save(id, patch) {
  decisions[id] = { ...current(id), ...patch, updatedAt: new Date().toISOString() };
  try { localStorage.setItem(storageKey, JSON.stringify(decisions)); } catch { storageAvailable = false; }
  if (!storageAvailable) { document.body.classList.add('storage-failed'); document.querySelector('.review-note').textContent = 'Browser storage is unavailable. Export your review before leaving this page.'; }
  updateSummary();
}
function addReview(parent, item) {
  const wrapper = el('div', item.type === 'audio' ? 'audio-review' : 'card-review');
  const label = el('label'); label.className = 'note-label'; label.htmlFor = `status-${item.id}`; label.textContent = 'YOUR DECISION';
  const select = el('select', 'review-select'); select.id = `status-${item.id}`; select.setAttribute('aria-label', `Decision for ${item.id}: ${item.title}`);
  for (const [value, text] of Object.entries(statuses)) { const option = el('option', '', text); option.value = value; select.append(option); }
  select.value = current(item.id).status; select.dataset.value = select.value;
  select.addEventListener('change', () => { select.dataset.value = select.value; save(item.id, { status: select.value }); applyFilters(); });
  const noteLabel = el('label', 'note-label', 'NOTES / REQUESTED CHANGES'); noteLabel.htmlFor = `notes-${item.id}`;
  const textarea = el('textarea', 'review-notes'); textarea.id = `notes-${item.id}`; textarea.placeholder = 'What works? What should change?'; textarea.value = current(item.id).notes;
  textarea.addEventListener('input', () => save(item.id, { notes: textarea.value }));
  wrapper.append(label, select, noteLabel, textarea); parent.append(wrapper);
}
function addFileDetail(parent, item) {
  const detail = el('details', 'file-detail'); detail.append(el('summary', '', 'Original filename'), el('p', '', item.filename)); parent.append(detail);
}
function pauseOthers(player) { document.querySelectorAll('video,audio').forEach(other => { if (other !== player) other.pause(); }); }
// Show an actual opening video frame when the player enters the viewport.
// Keep a branded still fallback if Dropbox cannot deliver a seekable video frame.
const firstFrameObserver = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const video = entry.target;
    observer.unobserve(video);
    if (video.preload === 'none' && video.paused) {
      video.preload = 'metadata';
      video.load();
    }
  }
}, { rootMargin: '350px 0px' }) : null;
function prepareOpeningFrame(player, wrap, item) {
  if (item.poster) { player.poster = item.poster; player.src = item.src; return; }
  wrap.append(el('div', 'first-frame-preview', '▶'));
  player.preload = 'none';
  player.src = item.src + (item.src.includes('#') ? '' : '#t=0.08');
  const ready = () => wrap.classList.add('first-frame-ready');
  player.addEventListener('loadeddata', ready, { once: true });
  player.addEventListener('seeked', ready, { once: true });
  player.addEventListener('play', ready, { once: true });
  player.addEventListener('loadedmetadata', () => {
    if (player.paused && player.readyState < 2) {
      try { player.currentTime = Math.min(0.08, Math.max(0, player.duration - 0.01)); } catch (_) {}
    }
  }, { once: true });
  if (firstFrameObserver) firstFrameObserver.observe(player);
  else player.preload = 'metadata';
}
function render(item) {
  const article = el('article', item.type === 'audio' ? 'audio-card' : 'media-card'); article.id = item.id; article.dataset.itemId = item.id;
  if (item.type === 'audio') {
    article.append(el('div', 'audio-icon', '♫'));
    const body = el('div', 'audio-main'); body.append(el('span', 'track-id', `${item.id} / ORIGINAL MUSIC`), el('h3', '', item.title));
    const player = el('audio'); player.controls = true; player.preload = 'none'; player.src = item.src; player.setAttribute('aria-label', `${item.id}: ${item.title}`); player.addEventListener('play', () => pauseOthers(player)); body.append(player); addFileDetail(body, item); article.append(body); addReview(article, item);
    document.querySelector(`[data-audio="${item.section}"]`).append(article);
  } else {
    const wrap = el('div', 'player-wrap'); const player = el('video'); player.controls = true; player.playsInline = true; prepareOpeningFrame(player, wrap, item); player.setAttribute('aria-label', `${item.id}: ${item.title}`); player.addEventListener('play', () => pauseOthers(player));
    player.append(el('p', '', 'Your browser does not support this video.'));
    wrap.append(player, el('span', 'video-ref', item.id)); if (item.duration) wrap.append(el('span', 'duration', duration(item.duration)));
    const body = el('div', 'card-body'); body.append(el('h3', 'card-title', item.title));
    const folder = (item.sourcePath || '').split('/').slice(1, -1).join(' / '); body.append(el('p', 'source-folder', folder || (item.section === 'fun' ? 'Just for Fun / Finished cut' : 'Rompe / Brand film')));
    const original = el('a', 'dropbox-link', 'Open in Dropbox ↗'); original.href = item.sourceUrl; original.target = '_blank'; original.rel = 'noopener'; body.append(original); addFileDetail(body, item); addReview(body, item); article.append(wrap, body); document.querySelector(`[data-section="${item.section}"]`).append(article);
  }
}
function applyFilters() {
  const query = document.getElementById('search').value.trim().toLowerCase(); const status = document.getElementById('status-filter').value; let visible = 0;
  for (const item of items) { const match = (!query || `${item.id} ${item.title} ${item.filename}`.toLowerCase().includes(query)) && (status === 'all' || current(item.id).status === status); document.getElementById(item.id).hidden = !match; if (match) visible++; }
  document.getElementById('visible-count').textContent = `${visible} of ${items.length} items`;
  for (const section of document.querySelectorAll('.collection:not(.pina)')) { const sectionItems = section.querySelectorAll('[data-item-id]'); section.hidden = sectionItems.length > 0 && [...sectionItems].every(n => n.hidden); }
  document.getElementById('pop-that-pina').hidden = Boolean(query) || status !== 'all';
}
function updateSummary() {
  const values = items.map(item => current(item.id)); const approved = values.filter(v => v.status === 'approved').length; const changes = values.filter(v => v.status === 'changes').length; const hold = values.filter(v => v.status === 'hold').length; const notes = values.filter(v => v.notes.trim()).length;
  document.getElementById('review-count').textContent = approved + changes + hold;
  document.getElementById('review-summary').textContent = `${approved} approved · ${changes} changes requested · ${hold} on hold · ${notes} with notes`;
}
function summaryText() {
  const lines = ['BOBBY × ROMPE / CREATIVE REVIEW', new Date().toLocaleString(), ''];
  for (const item of items) { const value = current(item.id); lines.push(`${item.id} | ${statuses[value.status]} | ${item.title}`, `File: ${item.filename}`); if (value.notes.trim()) lines.push(`Notes: ${value.notes.trim()}`); lines.push(''); }
  return lines.join('\n');
}
document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('status-filter').addEventListener('change', applyFilters);
document.getElementById('export-review').addEventListener('click', () => { if (!items.length) return toast('The collection is still loading.'); const url = URL.createObjectURL(new Blob([summaryText()], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = `bobby-rompe-review-${new Date().toISOString().slice(0, 10)}.txt`; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Review exported. Share the downloaded file.'); });
document.getElementById('copy-review').addEventListener('click', async () => { if (!items.length) return toast('The collection is still loading.'); try { await navigator.clipboard.writeText(summaryText()); toast('Review summary copied.'); } catch { toast('Please use Export review to download your summary.'); } });
fetch('gallery.json?v=' + Date.now(), { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('Gallery unavailable'); return r.json(); }).then(data => { if (!Array.isArray(data) || data.some(item => !item.src)) throw new Error('Media preparation in progress'); items = data; items.forEach(render); document.getElementById('load-status').textContent = ''; applyFilters(); updateSummary(); }).catch(() => { document.getElementById('load-status').textContent = 'The media collection is being prepared. Please refresh shortly.'; });
