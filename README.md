# Hoop Heads

An offline arcade basketball career game in a single `index.html`. You create a player, join one of eight original teams and play seasons of 5v5 (or 3v3) against AI bots with AI teammates. No online play, no accounts, no analytics, no network requests except one optional Google Font.

Big-head caricature players drawn in code, bouncy physics, dunks, blocks, ankle breakers, poster moments, short games. Under the hood: a fixed-step 120 Hz simulation, real ball physics with an analytic shot solver, and bots that press the same virtual buttons you do.

## Play it

Open `index.html` in a current Chrome, Safari, Firefox or Edge. It works from a double-click on the file and when hosted on any static host (GitHub Pages, Vercel). Landscape only on phones. If the page is embedded in another page, click the court once so it receives the keyboard.

## The career

1. **Choose your baller**: pick a face (16 presets, all customizable), name, archetype, height and number. Ratings come from the archetype.
2. **Join a team**: eight teams with five-man rosters. You replace their weakest player.
3. **Season**: ten regular-season games (round robin), the other games are simulated in the background. Standings, a rival who talks trash, playoffs for the top four, MVP and champion at the end. Play a game or sim it from the hub.
4. **Grow**: coins for every game (win, points, assists, stops, highlights, a season bonus) buy attribute points, dribble moves and cosmetics. The attribute cap grows every season.
5. **Manager mode** unlocks after your first season (or from the dev menu): set the lineup, trade players (teams ask for coins to balance a lopsided deal), sign free agents, release players, set the game plan (pace, threes, drives, ball movement, aggression). Bench yourself and you coach from the sideline, controlling whoever has the ball.

Training (free practice with shot chart), the 3-Point Contest (from week 5), an eight-team tournament and quick exhibition games live under Extras.

## Controls

| Action | Keys A | Keys B | Gamepad | Touch |
| --- | --- | --- | --- | --- |
| Move | A / D | ← / → | Stick / d-pad | Stick |
| Jump / block / rebound | W or Space | ↑ or Space | A | JUMP |
| Stance (defense) / protect the ball (offense), hold | S | ↓ | LT | Pull the stick down |
| Shoot (tap = pump fake, hold = shoot, release at the top of the jump) | J | Z | X | SHOOT |
| Pass (hold = lob). Off the ball: hold to call for the ball | K | X | B | PASS |
| Dribble move / steal / shove. Off the ball: ask for a screen | L | C | Y | MOVE |
| Sprint (quick tap while dribbling slowly = hesitation) | Shift | Shift | RT | Push the stick past 85% |
| Pause | Esc or P | Esc or P | Start | Pause button |

Dribble moves: crossover (Move), spin (Sprint + Move), step-back (stick away from the hoop + Move), hesitation (tap Sprint), pump fake (tap Shoot). Dunk by driving hard at the rim and pressing Shoot. Euro-step by flipping the stick during a layup gather.

### How accuracy works

Every jumper is graded on release timing against the top of the jump: green (perfect), good, late/early, or bad. The meter shows the window, and after the release the game prints the grade, how open you were and the make chance. The window shrinks with contest, distance and tiredness and grows with the Shooting rating. Layups and dunks are graded by contest and Finishing instead.

### Passing and asking for the ball

Passes read the lane: a defender at point-blank range gets thrown over, a defender in the middle of the lane gets a bounce pass under their hands, and both together produce a looping pass. A defender denying the receiver is still a real risk. Off the ball, hold Pass to call for it: the handler passes as soon as the pass is reasonably safe (a "!" bubble shows the call).

### Nobody gets stuck in 5v5

The court has three depth lanes handled automatically. Bodies only collide inside the same lane and teammates never collide. Dribbling into a set defender is a body-up: your speed is capped, the defender gives ground based on Strength, and if you keep pushing you slip around into a free lane. The defender has to mirror the lane in time or they are beaten. Off-ball bodies only brush past each other.

## Dev tools

Press the backtick key (or tap the title logo five times) for the dev menu: AI-vs-AI headless sims with a full stat table, the shot lab (proves the solver honors the make/miss roll), the tunneling test, replay by seed, manager-mode unlock, and the F1 (AI), F2 (hitboxes and lanes) and F3 (last shot breakdown) overlays.

Everything is exposed on `window.HH` for scripting: `HH.simulateMatch(...)`, `HH.runSims(...)`, `HH.shotLab(...)`, `HH.tunnelTest(n)`.

## Tech

Vanilla JavaScript (ES2020+), Canvas 2D and Web Audio. All art is drawn in code and all sound is synthesized. Every tuning number lives in the `CONFIG` object at the top of the file. Gameplay randomness comes from a seeded RNG, so any match can be reproduced from its seed. Saves live in `localStorage` under `hoopheads.save.v1` (schema version 2, with a migration from the version 1 career); if storage is missing or corrupted the game still runs.
