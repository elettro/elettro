# Bal Harbour Reef: Elettro Remote game

Static files only (GitHub Pages friendly, no build step).

## Deploy
Copy into the elettro.com repo so the folder sits next to the Bal Harbour page:

    /clients/bal-harbour/reef/        <- this folder (reef.html, play.html, reef-art.js, reef-net.js, assets/)

Then paste the contents of `reef-section.html` into /clients/bal-harbour/index.html between two sections,
and add `<a href="#reef">Reef</a>` to the anchor nav. `reef-preview.html` is only a test wrapper (delete it).

## The atrium screen (kiosk)
Open this full-screen on the display:

    https://elettro.com/clients/bal-harbour/reef/reef.html?kiosk=1&room=BALH

- `kiosk=1` hides the cursor and the Back link. `room=BALH` pins the join code, so the printed QR/code never changes.
  Without `room`, a random code is made per session (kept on reload).
- Chrome kiosk example: `chrome --kiosk --autoplay-policy=no-user-gesture-required "<url>"`
- Sound is off by default (it's a mall). Add `&sound=1` to try auto-on (needs the autoplay flag), or press S.

## Phones
Parents scan the QR on the screen. It opens `play.html?room=BALH`. If someone opens play.html without a code,
it asks them to type the 4-letter code.

## Demo keys (on the big screen)
B add a demo swimmer · Shift+B remove them · P Reef Party · W whale · F full screen · S sound
URL option: `&bots=3` starts with demo swimmers.

## Connection notes
Phone to screen runs over WebRTC through PeerJS's free public signaling server. Fine for demos and most phones.
For a permanent install, add a TURN relay (some cellular networks block direct links) by defining, before reef-net.js loads:

    window.ELETTRO_ICE  = [{urls:'stun:stun.l.google.com:19302'},{urls:'turn:YOUR_TURN',username:'..',credential:'..'}];
    window.ELETTRO_PEER = {host:'peer.yourdomain.com', port:443, secure:true, path:'/'};   // optional self-hosted PeerServer

All transport code lives in `reef-net.js`, so it can be swapped for the existing Elettro Remote pairing later.

## Behavior
- Up to 12 swimmers. A 13th player replaces someone idle for 45s+, otherwise sees "reef is full" and retries.
- Phone drops out: their creature waits 30s for them to return, then swims away. Reloading the phone page reclaims it.
- Nothing can be lost or broken: pearls fill the Reef Magic meter (10), then everyone gets a Reef Party.
