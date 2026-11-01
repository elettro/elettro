# Deep Reef (Elettro Remote)

Realistic multiplayer reef game for teens and adults. Same phone-to-screen setup as the Bal Harbour Reef, with its own
room namespace (`elettro-r2-`) so room codes never collide with other Remote games.

- Big screen: `/remote/reef2/` (add `?kiosk=1&room=XXXX` for a fixed code and hidden cursor)
- Phone controller: `/remote/reef2/play.html?room=XXXX`
- Demo keys on the big screen: B/Shift+B add/remove demo fish, H shark, K krill run, L plankton bloom, P manta, R end round, F full screen, S sound
- URL options: `?bots=5` demo fish, `?sound=1`

Gameplay: eat plankton (combos up to x4), grow, dodge the barracuda and the shark, hide in the anemone beds, 2:30 rounds with a
podium, today's best score, and a team "reef energy" bar that calls in a manta ray (+150 for everyone).
Eight playable fish, each with a power. Buttons: Dash, Power, Flair (style bonus when chained), Ping (sonar).

Art is painted procedurally (art.js). To use photo cut-outs later, set `window.REEF2_SPRITES` before art.js loads.
