(function(){var q=new URLSearchParams(location.search);window.ALMONDMOM_MODE=q.get('c')?'remote':(q.get('mini')==='1'?'mini':'display');document.documentElement.classList.add('dm-'+window.ALMONDMOM_MODE);var style=document.createElement('style');style.textContent="/* ---- phone remote (display button, mini view, phone controller) ---- */\n.dr-dock{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;flex-direction:column;align-items:flex-end;gap:10px}\n.dr-pill{display:flex;align-items:center;gap:9px;padding:10px 16px;border-radius:999px;border:2px solid #234b39;background:#f1c47c;color:#0b0b10;font:700 11px 'DM Sans',Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 24px #0006}\n.dr-pill i{width:9px;height:9px;border-radius:50%;background:#0b0b10;opacity:.35}\n.dr-pill.on{background:#8bc5b2}\n.dr-pill.on i{opacity:1}\n.dr-card{display:none;width:230px;background:#fff;color:#111;border-radius:16px;padding:14px;text-align:center;box-shadow:0 18px 50px #0008}\n.dr-dock.open .dr-card{display:block}\n.dr-card svg{width:100%;height:auto;display:block}\n.dr-card b{display:block;margin-top:10px;font:700 11px 'DM Sans',Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase}\n.dr-card small{display:block;margin-top:4px;font:500 11px Inter,sans-serif;color:#666}\n.dr-card .err{color:#c2362b}\n#dremote{display:none}\nhtml.dm-mini .dr-dock,html.dm-remote .dr-dock{display:none}\nhtml.dm-mini body{overflow:hidden}html.dm-mini,html.dm-display{scroll-behavior:auto!important}\nhtml.dm-remote body{overflow:hidden;height:100dvh;overscroll-behavior:none;touch-action:none}\nhtml.dm-remote body > :not(#dremote):not(script):not(style){display:none!important}\nhtml.dm-remote #dremote{display:flex;flex-direction:column;gap:12px;height:100dvh;padding:max(14px,env(safe-area-inset-top)) 16px max(14px,env(safe-area-inset-bottom))}\n.dr-top{display:flex;justify-content:space-between;align-items:center;gap:10px}\n.dr-top .t{font:400 26px/1 Georgia,serif;text-transform:uppercase}\n.dr-top .t em{font-style:normal;color:#a05e54}\n.dr-stat{font:700 10px 'DM Sans',Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a05e54;border:2px solid #a8b9a3;padding:6px 10px;border-radius:999px;white-space:nowrap}\n.dr-stat.on{color:#f1c47c}\n.dr-sec{font:700 11px 'DM Sans',Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#526258}\n.dr-sec b{color:#8bc5b2;margin-right:8px}\n#drSurf{flex:1;min-height:0;display:grid;place-items:center;touch-action:none;user-select:none;-webkit-user-select:none}\n#drBox{position:relative;overflow:hidden;border-radius:12px;border:2px solid #f1c47c;background:#fbf6e9;box-shadow:0 0 0 4px rgba(215,255,31,.12),0 18px 40px #0009}\n#drFrame{position:absolute;left:0;top:0;border:0;transform-origin:0 0;pointer-events:none;background:#fbf6e9}\n.dr-bar{height:5px;border-radius:5px;background:#a8b9a3;overflow:hidden}\n.dr-bar b{display:block;height:100%;background:#f1c47c;transform-origin:0 50%;transform:scaleX(0)}\n.dr-chips{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}\n.dr-chips button,.dr-btns button{font:700 10px 'DM Sans',Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#234b39;background:#fffaf1;border:2px solid #a8b9a3;border-radius:10px;padding:10px 4px;cursor:pointer}\n.dr-chips button.on{border-color:#8bc5b2;color:#8bc5b2}\n.dr-btns{display:flex;gap:8px}\n.dr-btns button{flex:1;border-radius:999px;padding:12px}\n#drErr{display:none;color:#a05e54;font-size:12px;text-align:center}\n@media (max-width:600px){.dr-dock{right:12px;bottom:12px}}\n\n.dr-top .t{font-size:22px}.dr-chips{grid-template-columns:repeat(3,1fr)}.dr-card{width:240px}.dr-card a{display:block;font-size:12px;overflow-wrap:anywhere;margin-top:6px;color:#234b39}.dr-pill{color:#234b39}.dr-dock{z-index:1000}#dremote{box-sizing:border-box;background:#fbf6e9;color:#234b39}html.dm-remote,html.dm-remote body{margin:0;padding:0}html.dm-mini header{position:static!important}#drFrame{max-width:none!important;max-height:none!important}";document.head.appendChild(style);document.body.insertAdjacentHTML('afterbegin',"<div class=\"dr-dock\" id=\"drDock\">\n  <div class=\"dr-card\" id=\"drCard\"><div id=\"drQr\"></div><b>Scan to control this page</b><small id=\"drCode\">Starting…</small></div>\n  <button type=\"button\" class=\"dr-pill\" id=\"drPill\" aria-expanded=\"false\"><i></i><span id=\"drPillT\">Phone remote</span></button>\n</div>\n<div id=\"dremote\" aria-label=\"Almond Mom phone remote\">\n  <div class=\"dr-top\"><div class=\"t\">Almond <em>Mom</em></div><div class=\"dr-stat\" id=\"drStat\">Connecting</div></div>\n  <div class=\"dr-sec\" id=\"drSec\"><b>01</b>Home</div>\n  <div id=\"drSurf\"><div id=\"drBox\"><iframe id=\"drFrame\" title=\"Live mini view of Almond Mom\" tabindex=\"-1\"></iframe></div></div>\n  <div class=\"dr-bar\"><b id=\"drBar\"></b></div>\n  <div class=\"dr-chips\" id=\"drChips\"></div>\n  <div class=\"dr-btns\"><button type=\"button\" id=\"drTopB\">↑ Top</button><button type=\"button\" id=\"drEndB\">↓ End</button></div>\n  <div id=\"drErr\"></div>\n</div>\n");if(location.protocol==='file:'||location.origin==='null'){document.getElementById('drPill').onclick=function(){document.getElementById('drDock').classList.toggle('open');document.getElementById('drCode').textContent='Phone pairing requires the public website. Open Elettro.com/almondmom/ on your display.';};return;}function load(src){return new Promise(function(resolve){var s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=resolve;document.head.appendChild(s);});}if(window.ALMONDMOM_MODE==='mini')return;Promise.all([load('https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'),load('https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js')]).then(function(){// ---- Phone remote: scan the QR, drag on the phone, the dash scrolls. Mouse + keyboard keep working (last touch wins). ----
(function () {
  var MODE = window.ALMONDMOM_MODE, PREFIX = "elettro-almondmom-", q = new URLSearchParams(location.search), target = q.get("c");
  function $(id) { return document.getElementById(id); }
  function hit(t) { try { fetch("https://abacus.jasoncameron.dev/hit/elettro-com/remote-almondmom-" + t, { cache: "no-store", keepalive: true }).catch(function () {}); } catch (e) {} }
  var SECS = [["Home", "#home"], ["Collection", "#collection"], ["Coffee", "#coffee"], ["Our Story", "#about"], ["Mom Stories", "#community"], ["Affiliate", "#affiliate"], ["Retail", "#retail"], ["End", "footer"]];
  function maxS() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }

  if (MODE === "display") {
    if (!window.Peer) { $("drCode").textContent = "Remote service could not load. Refresh to retry."; $("drPill").onclick=function(){ $("drDock").classList.toggle("open"); }; return; }
    var id = null, reuse = false, tries = 0, conn = null, peer = null;
    try { id = sessionStorage.getItem("elalmondmom_id"); } catch (e) {}
    if (id) reuse = true; else id = Math.random().toString(36).slice(2, 8);
    try { sessionStorage.setItem("elalmondmom_id", id); } catch (e) {}
    var dock = $("drDock"), pill = $("drPill");
    function openDock(on) { dock.classList.toggle("open", on); pill.setAttribute("aria-expanded", on ? "true" : "false"); try { localStorage.setItem("elalmondmom_dock", on ? "1" : "0"); } catch (e) {} }
    pill.addEventListener("click", function () { openDock(!dock.classList.contains("open")); });
    try { if (localStorage.getItem("elalmondmom_dock") === "1") openDock(true); } catch (e) {}
    function drawQR() {
      var url = new URL(location.href); url.search = "?c=" + id; url.hash = ""; url = url.href;
      try { var qr = qrcode(0, "M"); qr.addData(url); qr.make(); $("drQr").innerHTML = qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true }); } catch (e) { $("drQr").textContent = url; }
      $("drCode").textContent = "Session " + id.toUpperCase() + " · no app needed"; var a=document.createElement("a"); a.href=url; a.target="_blank"; a.rel="noopener"; a.textContent="Open controller link"; $("drCode").appendChild(a);
    }
    function paired(on) { pill.classList.toggle("on", on); $("drPillT").textContent = on ? "Phone connected" : "Phone remote"; if (on) openDock(false); }

    // the phone asks for a position: ease toward it. Any local wheel / key / click cancels and takes over.
    var remoteTarget = null, lastRemote = 0, lastSend = 0, lastMax = -1, lastSec = -1;
    (function ease() {
      if (remoteTarget !== null) {
        var cur = window.scrollY, d = remoteTarget - cur;
        if (Math.abs(d) < 1) { window.scrollTo(0, remoteTarget); remoteTarget = null; } else window.scrollTo(0, cur + d * 0.38);
      }
      requestAnimationFrame(ease);
    })();
    function local() { remoteTarget = null; lastRemote = 0; }
    ["wheel", "mousedown", "touchstart"].forEach(function (ev) { window.addEventListener(ev, local, { passive: true }); });
    window.addEventListener("keydown", function (e) { if (/^(Arrow|Page|Home|End)/.test(e.key) || e.key === " ") local(); });
    function send(m) { if (conn && conn.open) try { conn.send(m); } catch (e) {} }
    function secList() {
      var m = maxS() || 1;
      return SECS.map(function (x) { var el = document.querySelector(x[1]); return el ? { n: x[0], v: Math.max(0, Math.min(1, (el.getBoundingClientRect().top + window.scrollY - 16) / m)) } : null; }).filter(Boolean);
    }
    function curSec() {
      var mid = window.scrollY + window.innerHeight * 0.4, k = 0;
      SECS.forEach(function (x, i) { var el = document.querySelector(x[1]); if (el && el.getBoundingClientRect().top + window.scrollY <= mid) k = i; });
      return k;
    }
    function meta() { lastMax = maxS(); send({ t: "meta", w: window.innerWidth, h: window.innerHeight, max: lastMax, secs: secList() }); }
    window.addEventListener("scroll", function () {
      var now = Date.now(), k = curSec();
      if (k !== lastSec) { lastSec = k; send({ t: "sec", i: k, name: SECS[k][0] }); }
      if (now - lastRemote < 600 || now - lastSend < 60) return;
      lastSend = now; var m = maxS(); send({ t: "pos", v: m ? window.scrollY / m : 0 });
    }, { passive: true });
    window.addEventListener("resize", function () { setTimeout(meta, 300); });
    setInterval(function () { if (conn && conn.open && maxS() !== lastMax) meta(); }, 2000);   // sections fill in as feeds load

    var counted = false;
    function boot() {
      drawQR();
      peer = new Peer(PREFIX + id);
      peer.on("open", function () { if (!counted) { counted = true; hit("screens"); } });
      peer.on("connection", function (c) {
        if (conn && conn.open) { c.on("open", function () { c.send({ t: "busy" }); setTimeout(function () { try { c.close(); } catch (e) {} }, 400); }); return; }
        conn = c;
        c.on("open", function () { paired(true); meta(); lastSec = curSec(); send({ t: "sec", i: lastSec, name: SECS[lastSec][0] }); var m = maxS(); send({ t: "pos", v: m ? window.scrollY / m : 0 }); });
        c.on("data", function (m) {
          if (!m) return;
          if (m.t === "hello") meta();
          else if (m.t === "p") { lastRemote = Date.now(); remoteTarget = Math.max(0, Math.min(1, +m.v || 0)) * maxS(); }
        });
        var gone = function () { if (conn === c) { conn = null; paired(false); } };
        c.on("close", gone); c.on("error", gone);
      });
      peer.on("disconnected", function () { try { peer.reconnect(); } catch (e) {} });
      peer.on("error", function (e) {
        if (e.type === "unavailable-id") {
          try { peer.destroy(); } catch (x) {}
          if (reuse && tries++ < 8) { setTimeout(boot, 900); return; }
          reuse = false; id = Math.random().toString(36).slice(2, 8); try { sessionStorage.setItem("elalmondmom_id", id); } catch (x) {} boot(); return;
        }
        $("drCode").innerHTML = '<span class="err">Remote service hiccup (' + e.type + '). Reload to retry.</span>';
      });
    }
    boot();
    return;
  }

  if (MODE !== "remote") return;
  // ---------------- phone controller ----------------
  var frame = $("drFrame"), surf = $("drSurf"), box = $("drBox"), bar = $("drBar");
  var vw = 1440, vh = 900, max = 6000, pos = 0, scale = 0.25, secs = [];
  var conn = null, dirty = false, active = false, mom = false, vel = 0, lastY = 0, lastMoveT = 0, loaded = false;
  function stat(on, t) { $("drStat").className = "dr-stat" + (on ? " on" : ""); $("drStat").textContent = t; }
  function err(m) { var e = $("drErr"); e.style.display = m ? "block" : "none"; e.textContent = m || ""; }
  function clamp(v) { return Math.max(0, Math.min(max, v)); }
  function fit() {
    var r = surf.getBoundingClientRect();
    scale = Math.min(r.width / vw, r.height / vh); if (!isFinite(scale) || scale <= 0) scale = 0.25;
    box.style.width = vw * scale + "px"; box.style.height = vh * scale + "px";
    frame.style.width = vw + "px"; frame.style.height = vh + "px"; frame.style.transform = "scale(" + scale + ")";
  }
  function applyMini() {
    var p = max ? pos / max : 0;
    bar.style.transform = "scaleX(" + p + ")";
    try { var w = frame.contentWindow, d = w.document.documentElement; w.scrollTo(0, p * Math.max(0, d.scrollHeight - w.innerHeight)); } catch (e) {}
  }
  (function tick() {
    if (mom) { pos = clamp(pos + vel); vel *= 0.94; if (Math.abs(vel) < 0.4 || pos <= 0 || pos >= max) mom = false; dirty = true; }
    if (dirty) { dirty = false; applyMini(); if (conn && conn.open) conn.send({ t: "p", v: max ? pos / max : 0 }); }
    requestAnimationFrame(tick);
  })();
  function glide(to) {
    var from = pos, t0 = performance.now(), dur = 900; mom = false;
    (function step(n) { var k = Math.min(1, (n - t0) / dur), e = 1 - Math.pow(1 - k, 3); pos = from + (to - from) * e; dirty = true; if (k < 1) requestAnimationFrame(step); })(t0);
  }
  function gain() { return Math.max(2, 1 / scale) * 1.15; }       // the finger moves the mini view 1:1
  surf.addEventListener("pointerdown", function (e) { active = true; mom = false; vel = 0; lastY = e.clientY; lastMoveT = performance.now(); try { surf.setPointerCapture(e.pointerId); } catch (x) {} });
  surf.addEventListener("pointermove", function (e) {
    if (!active) return;
    var d = (lastY - e.clientY) * gain(); lastY = e.clientY; lastMoveT = performance.now();
    pos = clamp(pos + d); vel = vel * 0.6 + d * 0.4; dirty = true;
  });
  function release() { if (!active) return; active = false; if (performance.now() - lastMoveT > 90) vel = 0; if (Math.abs(vel) > 1.5) mom = true; }
  surf.addEventListener("pointerup", release); surf.addEventListener("pointercancel", release);
  document.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
  function buzz() { if (navigator.vibrate) navigator.vibrate(12); }
  $("drTopB").addEventListener("click", function () { buzz(); glide(0); });
  $("drEndB").addEventListener("click", function () { buzz(); glide(max); });
  var curSec = 0;
  function chips() {
    $("drChips").innerHTML = secs.map(function (s, k) { return s.n === "End" ? "" : '<button type="button" data-k="' + k + '"' + (s.n === (SECS[curSec] || [])[0] ? ' class="on"' : "") + ">" + s.n + "</button>"; }).join("");
  }
  $("drChips").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; buzz(); glide(secs[+b.dataset.k].v * max); });
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", function () { setTimeout(fit, 250); });
  frame.addEventListener("load", function () { fit(); applyMini(); });
  fit();
  if (!window.Peer) { stat(false, "Offline"); err("The remote service did not load. Check the connection and reload."); return; }

  var peer = new Peer(), tries = 0, retryT = null, everOn = false, busy = false;
  function retry() {
    if (busy) return;
    if (tries++ > 25) { stat(false, "Disconnected"); err("Session ended. Scan the code on the screen again."); return; }
    stat(false, "Reconnecting"); clearTimeout(retryT); retryT = setTimeout(link, 1500);
  }
  function link() {
    var c = peer.connect(PREFIX + target, { reliable: true }); conn = c;
    c.on("open", function () { tries = 0; if (!everOn) hit("phones"); everOn = true; err(""); c.send({ t: "hello" }); stat(true, "Connected"); });
    c.on("data", function (m) {
      if (!m) return;
      if (m.t === "meta") {
        vw = m.w; vh = m.h; max = m.max || 1; if (m.secs) { secs = m.secs; chips(); }
        if (!loaded) { loaded = true; frame.src = location.pathname + "?mini=1"; }
        fit(); applyMini();
      } else if (m.t === "pos") { if (!active && !mom) { pos = clamp(m.v * max); applyMini(); } }
      else if (m.t === "sec") { curSec = m.i; $("drSec").innerHTML = "<b>" + (m.i < 9 ? "0" : "") + (m.i + 1) + "</b>" + m.name; chips(); }
      else if (m.t === "busy") { busy = true; stat(false, "Screen in use"); err("Another phone is already controlling this page."); }
    });
    c.on("close", function () { if (conn === c) retry(); });
    c.on("error", function () { if (conn === c) retry(); });
  }
  peer.on("open", link);
  peer.on("error", function (e) {
    if (e.type === "peer-unavailable") { retry(); return; }
    stat(false, "Could not connect");
    err(e.type === "peer-unavailable" ? "This page session has ended. Scan the code on the screen again." : "Connection error: " + e.type);
  });
})();

});})();