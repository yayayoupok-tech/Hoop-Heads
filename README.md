# Hoop Heads

An offline arcade basketball game in a single `index.html`. One human plays against AI bots (with AI teammates in 2v2 and 3v3). No online play, no accounts, no analytics, no network requests except one optional Google Font.

Big-head bobblehead players, bouncy physics, dunks, blocks, ankle breakers, poster moments, short games. Under the hood: a fixed-step 120 Hz simulation, real ball physics with an analytic shot solver, and bots that press the same virtual buttons you do.

## Play it

Open `index.html` in a current Chrome, Safari, Firefox or Edge. It works from a double-click on the file and when hosted on any static host (GitHub Pages, Vercel). Landscape only on phones.

## Controls

| Action | Keys A | Keys B | Gamepad | Touch |
| --- | --- | --- | --- | --- |
| Move | A / D | ← / → | Stick / d-pad | Stick |
| Jump / block | W or Space | ↑ or Space | A | JUMP |
| Stance (defense) / protect the ball (offense), hold | S | ↓ | LT | Pull the stick down |
| Shoot (tap = pump fake, hold = shoot, release at the top of the jump) | J | Z | X | SHOOT |
| Pass / switch player (hold = lob) | K | X | B | PASS |
| Dribble move / steal / shove | L | C | Y | MOVE |
| Sprint (quick tap while dribbling slowly = hesitation) | Shift | Shift | RT | Push the stick past 85% |
| Pause | Esc or P | Esc or P | Start | Pause button |

Dribble moves: crossover (Move), spin (Sprint + Move), step-back (stick away from the hoop + Move), hesitation (tap Sprint), pump fake (tap Shoot). Dunk by driving hard at the rim and pressing Shoot. Euro-step by flipping the stick during a layup gather.

## Modes

- **Quick Play**: 1v1, 2v2 or 3v3, eight original teams, four difficulties, five courts, Arcade or Street Sim rules, First-to-21 or timed halves.
- **Tournament**: 8-team single elimination. Later rounds bring smarter brains. Win it to unlock the Arena Finals court.
- **Career**: create a player, play a 10-game 3v3 season plus playoffs, earn coins, buy attributes, moves and cosmetics. A recurring rival talks trash.
- **Practice**: free shooting with an optional defender dummy, shot breakdown and shot chart.
- **3-Point Contest**: 60 seconds, five racks, money balls, local best score.
- **Tutorial**: about a minute, interactive, replayable from How to play.

## Dev tools

Press the backtick key (or tap the title logo five times) for the dev menu: AI-vs-AI headless sims with a full stat table, the shot lab (proves the solver honors the make/miss roll), the tunneling test, replay by seed, and the F1 (AI), F2 (hitboxes and lanes) and F3 (last shot breakdown) overlays.

Everything is exposed on `window.HH` for scripting: `HH.simulateMatch(...)`, `HH.runSims(...)`, `HH.shotLab(...)`, `HH.tunnelTest(n)`.

## Tech

Vanilla JavaScript (ES2020+), Canvas 2D and Web Audio. All art is drawn in code and all sound is synthesized. Every tuning number lives in the `CONFIG` object at the top of the file. Gameplay randomness comes from a seeded RNG, so any match can be reproduced from its seed. Saves live in `localStorage` under `hoopheads.save.v1` with a migration function; if storage is missing or corrupted the game still runs.
