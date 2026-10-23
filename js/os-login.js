/* Elettro OS login bar: one fat button above the site header on every main page. */
(function () {
  if (document.getElementById("os-login-bar")) return;
  var H = 56;
  var css = [
    ":root{--os-bar:" + H + "px}",
    "body{padding-top:var(--os-bar)}",
    "body>header,header.fixed,header.site-header,.site-header{top:var(--os-bar)!important}",
    "#os-login-bar{position:fixed;inset:0 0 auto 0;height:var(--os-bar);z-index:60;display:flex;align-items:center;justify-content:center;gap:18px;padding:0 16px;background:linear-gradient(180deg,#02060f,#060e20);border-bottom:1px solid rgba(129,236,255,.18)}",
    "#os-login-bar .os-note{font:600 13px/1 Manrope,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a3aac4;white-space:nowrap}",
    "#os-login-btn{position:relative;isolation:isolate;display:inline-flex;align-items:center;gap:12px;height:40px;padding:0 26px;border-radius:999px;font:800 16px/1 'Space Grotesk',Manrope,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;color:#031018;background:linear-gradient(90deg,#81ecff,#2efd7c);box-shadow:0 0 22px rgba(129,236,255,.35);overflow:hidden;transition:transform .25s ease,box-shadow .25s ease}",
    "#os-login-btn::before{content:'';position:absolute;inset:-60% -20%;z-index:-1;background:conic-gradient(from 0deg,#81ecff,#2efd7c,#81ecff,#2efd7c,#81ecff);animation:os-spin 6s linear infinite;opacity:.55}",
    "#os-login-btn::after{content:'';position:absolute;top:0;bottom:0;left:-40%;width:30%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.65),transparent);transform:skewX(-20deg);animation:os-shine 5s ease-in-out infinite}",
    "#os-login-btn .os-bolt{width:18px;height:18px;flex:none}",
    "#os-login-btn .os-arrow{display:inline-block;transition:transform .25s ease}",
    "#os-login-btn:hover,#os-login-btn:focus-visible{transform:translateY(-1px) scale(1.04);box-shadow:0 0 34px rgba(46,253,124,.55)}",
    "#os-login-btn:hover .os-arrow,#os-login-btn:focus-visible .os-arrow{transform:translateX(6px)}",
    "#os-login-btn:focus-visible{outline:2px solid #fff;outline-offset:3px}",
    "@keyframes os-spin{to{transform:rotate(360deg)}}",
    "@keyframes os-shine{0%,60%{left:-40%}100%{left:130%}}",
    "@media(max-width:640px){#os-login-bar .os-note{display:none}#os-login-btn{width:100%;max-width:340px;justify-content:center}}",
    "@media(prefers-reduced-motion:reduce){#os-login-btn::before,#os-login-btn::after{animation:none}#os-login-btn,#os-login-btn .os-arrow{transition:none}}"
  ].join("\n");
  var style = document.createElement("style");
  style.id = "os-login-style";
  style.textContent = css;
  document.head.appendChild(style);
  var bar = document.createElement("div");
  bar.id = "os-login-bar";
  bar.innerHTML =
    '<span class="os-note">Clients and team</span>' +
    '<a id="os-login-btn" href="https://os.elettro.com" aria-label="Log in to Elettro OS">' +
    '<svg class="os-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' +
    '<span>Login</span><span>Elettro OS</span><span class="os-arrow" aria-hidden="true">&rarr;</span></a>';
  document.body.insertBefore(bar, document.body.firstChild);
})();
