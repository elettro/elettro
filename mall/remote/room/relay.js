/* Compact reconnecting WebSocket link to Elettro's own relay (same one the 3D Scroll remote uses). */
export const RELAY_URL = 'wss://l7pixcmace.execute-api.us-east-1.amazonaws.com/dev';
export function RelayLink(role, sid, onMsg, onState) {
  let ws = null, dead = false, tries = 0, hb = null, pingAt = 0, rt = null; const self = { ready: false };
  const lost = () => { const was = self.ready; self.ready = false; clearInterval(hb); if (was && onState) onState('close'); retry(); };
  const beat = () => { if (pingAt && Date.now() - pingAt > 8000) { const o = ws; ws = null; pingAt = 0; try { o.close(); } catch (e) { } lost(); return; } if (!pingAt && self.send({ t: '_ping' })) pingAt = Date.now(); };
  function open() {
    clearTimeout(rt); if (dead) return; let w;
    try { w = new WebSocket(RELAY_URL + '?s=' + encodeURIComponent(sid) + '&r=' + role); } catch (e) { retry(); return; }
    ws = w; setTimeout(() => { if (ws === w && !self.ready) { ws = null; try { w.close(); } catch (e) { } retry(); } }, 8000);
    w.onopen = () => { if (ws !== w) return; self.ready = true; tries = 0; pingAt = 0; clearInterval(hb); hb = setInterval(beat, 5000); if (onState) onState('open'); };
    w.onmessage = e => { if (ws !== w) return; pingAt = 0; let m = null; try { m = JSON.parse(e.data); } catch (x) { } if (m && m.t === '_pong') return; if (m && m.t === '_reset') { ws = null; try { w.close(); } catch (x) { } lost(); return; } if (m && onMsg) onMsg(m); };
    w.onclose = () => { if (ws !== w) return; ws = null; lost(); }; w.onerror = () => { };
  }
  function retry() { if (dead) return; tries++; clearTimeout(rt); rt = setTimeout(open, Math.min(5000, 600 + tries * 600)); }
  self.send = m => { if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify(m)); return true; } catch (e) { } } return false; };
  const fresh = () => { if (dead) return; const o = ws; ws = null; pingAt = 0; tries = 0; try { if (o) o.close(); } catch (e) { } const was = self.ready; self.ready = false; clearInterval(hb); if (was && onState) onState('close'); open(); };
  let away = 0; document.addEventListener('visibilitychange', () => { if (document.hidden) { away = Date.now(); return; } if (away && Date.now() - away > 3000) fresh(); away = 0; });
  addEventListener('pageshow', e => { if (e.persisted) fresh(); });
  open(); return self;
}
