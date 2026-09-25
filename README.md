# Hoop Heads

An offline 1v1 arcade basketball career game in a single `index.html`. You're measured at a draft combine, picked by a club, and you play a whole career in a sixteen-player one-on-one league: seasons, playoffs, awards, contracts, sponsors, injuries, getting older, and a Hall of Fame vote when you retire. No online play, no accounts, no analytics, no network requests except one optional Google Font.

Big-head caricature players drawn in code, bouncy physics, dunks, blocks, hooks, fadeaways, ankle breakers, posters. Under the hood: a fixed-step 120 Hz simulation, real ball physics with an analytic shot solver, and bots that press the same virtual buttons you do.

## Play it

Open `index.html` in a current Chrome, Safari, Firefox or Edge. It works from a double-click on the file and when hosted on any static host (GitHub Pages, Vercel). Landscape only on phones. If the page is embedded in another page, click the court once so it receives the keyboard.

## The career

One life, from a 14-year-old freshman to the Hall of Fame vote.

1. **Create your player.** Pick a face, a jersey number and a play style (Sharpshooter, Playmaker, Slasher, Lockdown, Post Scorer or Rim Protector). Pick a pro season length (11 or 22 games) and game length. There is no height slider and there are no rating sliders.
2. **Your genes.** Adult height, growth pattern (early, normal or late bloomer) and wingspan are rolled once. A doctor projects your adult height, give or take an inch. You find out the rest as you grow: every summer can bring a growth spurt, and you watch your player get taller.
3. **High school.** Four seasons in an eight-player 1v1 league, first to 15. There's a top-four playoff, awards (League MVP, All-League teams) and a rival who follows you through every level.
4. **Recruiting.** College offers come from four program tiers depending on how good you are and what you've won. Elite seniors can skip college and declare.
5. **College.** Up to four seasons, first to 21. After each one you decide: declare for the draft, or go back for another year.
6. **The draft combine.** It measures height (barefoot and in shoes), wingspan, standing reach, vertical, lane agility and bench reps. Scouts project your pick.
7. **Draft night.** Your draft class (including your rival) joins a 12-player pro league. Your pick decides your club and your rookie contract.
8. **Pro seasons.** Standings, a top-four playoff with a best-of-three final, Player of the Week, an All-Star 3-point contest, and awards: MVP, Finals MVP, Defensive Player, Rookie of the Year, Most Improved, Scoring Champion and the All-ISO First Team. There's also a news feed.
9. **Getting better.** Every game gives XP. The pool grows with winning and with what you did, then 45% goes to your practice focus and the rest follows your game: made shots build Shooting, rim finishes build Finishing, rebounds build Strength and Hops, and steals and blocks build Defense. Ratings grow in steps of 5, each step costs more, and every rating has a ceiling set by your play style, your height and your genes. Teens learn fastest. Each summer your focus ratings jump and your body fills out. After 30 the legs go first. Playing a game pays more than simming it. Moves (step-back, spin, euro-step, 360 and windmill dunks) unlock as your ratings grow, and traits unlock from career milestones.
10. **Management.** You have a contract, and free-agent offers when it expires. There are also sponsors, training staff, a home gym, cosmetics, injuries and energy.
11. **Retirement.** It's your choice from 30, and forced at 39 (or earlier if you fall off). A legacy score built only from pro achievements decides the Hall of Fame. That's 12 per title, 12 per MVP, 3 per All-League team, 1 per season and 1 per 250 points; the line is 90.

Every opponent is a real engine player with their own ratings and size, so a 7′1″ rim protector and a 5′11″ guard play completely differently.

The main menu also has Quick 1v1 (any two players, any court, any format) and the Hall of Fame. **Extras** holds the classic team league (5v5 or 3v3 with manager mode), a street tournament (an eight-player bracket, first to 11), the 3-Point Contest, Practice (free shooting with a shot chart), the tutorial and the **Art Lab** (every character, expression, pose and venue on one screen; also opens directly with `index.html?artlab`).

## Height matters

Height is never a menu option. It changes your ratings in every game: per 10 cm above average you get Strength +6, Defense +3.5, Finishing +3, Hops −1, Handles −4 and Speed −5. It also sets your ceilings: taller players can grow Strength, Defense and Finishing further, and shorter players can grow Speed and Handles further. On top of that the engine models the body:

- **Reach.** Contests, blocks and rebounds come from standing reach (height plus wingspan) plus your jump.
- **Post game.** A bigger, stronger player can back a smaller one down and finish with a hook over them.
- **Feet.** Taller players are slower and accelerate slower, need longer to gather, carry the ball higher (easier to steal) and turn slower (more ankle breakers).

In headless engine tests with identical ratings, a 2.12 m player beat a 1.82 m player in 42 of 60 games. The big one blocked 4.3 shots a game and the small one stole the ball 7.6 times.

## Controls

| Action | Keys A | Keys B | Gamepad | Touch |
| --- | --- | --- | --- | --- |
| Move | A / D | ← / → | Stick / d-pad | Stick |
| Jump / block / rebound | W or Space | ↑ or Space | A | JUMP |
| Defense stance (hold). With the ball: post up (hold) | S | ↓ | LT | Pull the stick down |
| Shoot (hold, release at the top of the jump; tap = pump fake). While posting up: hook | J | Z | X | SHOOT |
| Fadeaway jumper (hold, release at the top) | K | X | B | FADE |
| Dribble move / steal | L | C | Y | MOVE |
| Sprint (quick tap while dribbling slowly = hesitation) | Shift | Shift | RT | Push the stick past 85% |
| Pause | Esc or P | Esc or P | Start | Pause button |

Dribble moves: crossover (Move), spin (Sprint + Move), step-back (stick away from the hoop + Move), hesitation (tap Sprint), pump fake (tap Shoot). Dunk by driving hard at the rim and pressing Shoot. Euro-step by flipping the stick during a layup gather. Pausing a career game offers "Sim the rest of the game" (career games always count).

### How accuracy works

Every jumper is graded on release timing against the top of the jump: green (perfect), good, late or early, or bad. The meter shows the window. After the release the game prints the grade, how open you were and the make chance. The window shrinks with contest, distance and tiredness, and grows with the Shooting rating. Fadeaways drift away from the defender, so they're harder to contest but a little harder to make. Hooks have no meter: they're graded on Finishing, size and contest. Layups and dunks are graded on contest and Finishing.

## Dev tools

Press the backtick key (or tap the title logo five times) for the dev menu. It has mirror 1v1 sims, a height test (equal ratings, 2.12 m vs 1.82 m), bot difficulty duels (Legend vs Pro, Pro vs Rookie), a league model check (the fast sim used for AI games against the real engine), the shot lab (proves the solver honors the make/miss roll), the tunneling test, a money and fame cheat for testing the career, and the F1 (AI), F2 (hitboxes and lanes) and F3 (last shot breakdown) overlays.

Everything is exposed on `window.HH` for scripting: `HH.simulateMatch(...)`, `HH.shotLab(...)`, `HH.tunnelTest(n)`, `HH.amCreate(...)`, `HH.amSimGame(...)`, `HH.createCareerFromAmateur(...)`, `HH.testProLeague(seed)`, `HH.simUserGame(...)`, `HH.legacyOf(...)`.

## Tech

Vanilla JavaScript (ES2020+), Canvas 2D and Web Audio. All art is drawn in code and all sound is synthesized. Every tuning number lives in the `CONFIG` object at the top of the file. Gameplay randomness comes from a seeded RNG, so any match can be reproduced from its seed, and the career has its own seeded stream. Your games run on the full engine. AI-vs-AI league games use a fast statistical model fitted by least squares to 4,000 headless engine games, so standings and stat lines match what the engine produces. A rating is the engine attribute × 10, from high school to retirement. Saves live in `localStorage` under `hoopheads.save.v1` (schema version 4). A career from the first high-school build carries over with its ratings, height and history. Careers from older builds (the team career and the first pro-only 1v1 career) can't continue, so their name and face prefill a new player. If storage is missing or corrupted, the game still runs.

## Tests

The game has no build step and no dependencies. The tests use Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`, or a global install):

```
node tests/check-syntax.js         # node --check on the game's script
node tests/smoke.js                # the whole game through the UI at 1280×720, other modes, old-save migrations,
                                   # regression checks, and the phone layout with touch at 844×390 (zero errors allowed)
node tests/devtools.js             # bot sims (1v1 Pro mirror, Legend vs Pro, 3v3), shot lab, tunneling test
node tests/balance.js [n]          # a scripted "human" plays real matches: points per possession by strategy vs Pro and Legend
node tests/careersim.js [40]       # whole simulated careers against the career targets
node tests/perf.js                 # frame cost at phone size in the arena
node tests/artlab.js <m> <round>   # Art Lab + in-match screenshots → shots/<m>/round-<round>/
node tests/shots.js <dir>          # a screenshot of every screen (the audit and before/after gallery)
```

`AUDIT.md` is the baseline audit, `PLAN.md` the milestone plan, and `CHANGES.md` logs every tuned number.
