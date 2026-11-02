/* Elettro Reef — phone <-> big-screen link.
   Transport: PeerJS (WebRTC data channels), so the site stays 100% static (no server of ours).
   This is the ONLY file that knows about the transport — swap it out here and nothing else changes.

   Optional config, set BEFORE loading this file:
     window.ELETTRO_ICE  = [{urls:'stun:...'}, {urls:'turn:...', username:'..', credential:'..'}]  // add a TURN for rock-solid cellular
     window.ELETTRO_PEER = {host:'peer.example.com', port:443, secure:true, path:'/'}              // self-hosted PeerServer

   Host (big screen):  ReefNet.host(code, {open, taken, error, join(id, send), msg(id, data), leave(id)})
   Guest (phone):      ReefNet.join(code, {status(s), open(), msg(data), close()})        */
(function (root) {
  'use strict';
  var PREFIX = 'elettro-bh-';
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';      // no I / O so codes are easy to read aloud

  function opts() {
    var o = { debug: 0 };
    if (root.ELETTRO_ICE) o.config = { iceServers: root.ELETTRO_ICE };
    if (root.ELETTRO_PEER) for (var k in root.ELETTRO_PEER) o[k] = root.ELETTRO_PEER[k];
    return o;
  }
  var TRACK = 'remote-reef-bh';
  /* usage counter for elettro.com/dash (counts only; no names, no IDs) */
  function hit(t) { try { fetch('https://abacus.jasoncameron.dev/hit/elettro-com/' + TRACK + '-' + t, { cache: 'no-store', keepalive: true }).catch(function () {}); } catch (e) {} }
  function randomCode() { var s = ''; for (var i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]; return s; }
  function clean(code) { return String(code || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4); }

  /* ---------------- host ---------------- */
  function host(code, h) {
    var peer = null, conns = {}, dead = false;
    function start(cd) {
      peer = new root.Peer(PREFIX + cd, opts());
      peer.on('open', function () { h.open && h.open(cd); });
      peer.on('connection', function (conn) {
        conn.on('open', function () {
          conns[conn.peer] = conn;
          h.join && h.join(conn.peer, function (d) { try { conn.send(d); } catch (e) {} });
        });
        conn.on('data', function (d) { h.msg && h.msg(conn.peer, d); });
        var gone = function () { if (conns[conn.peer] === conn) { delete conns[conn.peer]; h.leave && h.leave(conn.peer); } };
        conn.on('close', gone); conn.on('error', gone);
      });
      peer.on('disconnected', function () { if (!dead) setTimeout(function () { try { peer.reconnect(); } catch (e) {} }, 1500); });
      peer.on('error', function (e) {
        if (e && e.type === 'unavailable-id') { h.taken && h.taken(cd); }
        else if (h.error) h.error(e);
      });
    }
    start(code);
    hit('screens');
    return {
      code: code,
      restart: function (cd) { try { peer.destroy(); } catch (e) {} conns = {}; start(cd); },
      send: function (id, d) { var c = conns[id]; if (c) try { c.send(d); } catch (e) {} },
      broadcast: function (d) { for (var id in conns) try { conns[id].send(d); } catch (e) {} },
      close: function () { dead = true; try { peer.destroy(); } catch (e) {} }
    };
  }

  /* ---------------- guest (phone) ---------------- */
  function join(code, h) {
    var counted = false;
    var peer = null, conn = null, closed = false, lastRx = 0, timer = null, wd = null;
    function status(s) { h.status && h.status(s); }
    function retry(ms) {
      if (closed) return;
      status('retry');
      clearTimeout(timer); timer = setTimeout(go, ms || 1800);
    }
    function go() {
      if (closed) return;
      try { if (peer) peer.destroy(); } catch (e) {}
      status('connecting');
      peer = new root.Peer(undefined, opts());
      peer.on('open', function () {
        conn = peer.connect(PREFIX + code, { reliable: true, serialization: 'json' });
        conn.on('open', function () { lastRx = Date.now(); if (!counted) { counted = true; hit('phones'); } status('open'); h.open && h.open(); });
        conn.on('data', function (d) { lastRx = Date.now(); h.msg && h.msg(d); });
        conn.on('close', function () { h.close && h.close(); retry(1200); });
        conn.on('error', function () { retry(1800); });
      });
      peer.on('error', function (e) {
        if (e && e.type === 'peer-unavailable') status('nohost');
        retry(e && e.type === 'peer-unavailable' ? 3000 : 2200);
      });
      peer.on('disconnected', function () { try { peer.reconnect(); } catch (e) {} });
    }
    // if the host goes quiet (it pings every 2s) assume the link is dead and rebuild it
    wd = setInterval(function () {
      if (!closed && conn && conn.open && Date.now() - lastRx > 9000) { try { conn.close(); } catch (e) {} retry(500); }
    }, 3000);
    go();
    return {
      send: function (d) { if (conn && conn.open) { try { conn.send(d); return true; } catch (e) {} } return false; },
      isOpen: function () { return !!(conn && conn.open); },
      close: function () { closed = true; clearTimeout(timer); clearInterval(wd); try { peer.destroy(); } catch (e) {} }
    };
  }

  root.ReefNet = { host: host, join: join, randomCode: randomCode, clean: clean, PREFIX: PREFIX };
})(typeof window !== 'undefined' ? window : this);
