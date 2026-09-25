# Hoop Heads

An offline 1v1 arcade basketball career game in a single `index.html`. You start as a 14-year-old high school freshman, get recruited, go to college, get measured at the draft combine, get picked by a club and play a whole pro career in a twelve-player one-on-one league: seasons, playoffs, awards, contracts, sponsors, injuries, a rival, the press, getting older, and a Hall of Fame vote when you retire. No online play, no accounts, no analytics, no network requests except one optional Google Font.

Big-head caricature players drawn in code, bouncy physics, dunks, blocks, hooks, fadeaways, ankle breakers, posters. Under the hood: a fixed-step 120 Hz simulation, real ball physics with an analytic shot solver, and bots that press the same virtual buttons you do.

## Play it

Open `index.html` in a current Chrome, Safari, Firefox or Edge. It works from a double-click on the file and when hosted on any static host (GitHub Pages, Vercel). Landscape only on phones. If the page is embedded in another page, click the court once so it receives the keyboard.

## The career

One life, from a 14-year-old freshman to the Hall of Fame vote.

1. **Create your player.** Pick a face, a jersey number and a play style (Sharpshooter, Playmaker, Slasher, Lockdown, Post Scorer or Rim Protector). Pick a pro season length (11 or 22 games) and game length. There is no height slider and there are no rating sliders.
2. **Your genes.** Adult height, growth pattern (early, normal or late bloomer) and wingspan are rolled once. A doctor projects your adult height, give or take an inch. You find out the rest as you grow: every summer can bring a growth spurt, and you watch your player get taller.
3. **High school.** Four seasons in an eight-player 1v1 league, first to 15. There's a top-four playoff, awards (League MVP, All-League teams) and a rival who follows you through every level. Your coach meets you on the first day.
4. **The week.** Before every game you choose one: **Practice** (this game's focus XP × 1.4, plus a simmed session or a playable 60-second drill worth 30–120 XP by your score: a shootout, "Beat your man" or "Get stops"), **Rest** (fatigue −25, and an injury heals a game faster) or **Film** (a scouting report on your next opponent and +0.3 Defense and Shooting in that game). If you play without choosing, your last plan runs. Every game adds 10 fatigue; past 50 every rating drops by the excess (in percent), and tired players get hurt more (0.8% + 0.04% × fatigue a game; an injury costs 0.5 Speed for 1–3 games; Settings → Career injuries turns them off).
5. **The story.** Big games (rival games, finals, titles, eliminations, points records, debuts, upsets) end in the press room. A humble answer builds confidence (up to ±0.2 Shooting); a confident one builds hype but costs some if you lose the next game; trash talk builds more hype and fires up your rival (+2 OVR in your next meeting). Hype adds to your draft stock and your contracts. Your rival gets scripted moments: the first meeting, the recruiting battle, draft night and a finals rematch. The Daily Dribble (News) has results, rival watch, career highs, quotes, injuries and awards.
6. **Recruiting.** Offers come from the four program tiers, one per tier from the best your résumé earns down. You get two official visits: each shows a program's facilities and what its coach develops (both change your college XP) and puts you in their jersey. The best program has one spot for you or your rival. Then commitment day: pick your hat. Elite seniors can skip college and declare.
7. **College.** Up to four seasons, first to 21. After each one you decide: declare for the draft, or go back for another year.
8. **The draft combine.** It measures height (barefoot and in shoes), wingspan, standing reach, vertical, lane agility and bench reps. Scouts project your pick.
9. **Draft night.** Your draft class (including your rival) joins a 12-player pro league. Your pick decides your club and your rookie contract.
10. **Pro seasons.** Standings, a top-four playoff with a best-of-three final, Player of the Week, an All-Star weekend (a 3-point contest for the best shooters and the All-Star 1v1: the four best by a fan vote play a bracket to 11), and awards: MVP, Finals MVP, Defensive Player of the Year (the most steals and blocks among the top four), Rookie of the Year, Most Improved, Scoring Champion and the All-League 1st and 2nd teams.
11. **Getting better.** Every game gives XP. The pool grows with winning and with what you did, then 45% goes to your practice focus and the rest follows your game: made shots build Shooting, rim finishes build Finishing, rebounds build Strength and Hops, and steals and blocks build Defense. Ratings grow in steps of 5, each step costs more, and every rating has a ceiling set by your play style, your height and your genes. Teens learn fastest. Each summer your focus ratings jump and your body fills out. After 30 the legs go first. Your ceilings start as a band ("potential B to A−") that narrows as scouts watch you; the combine shows them exactly. Playing a game pays more than simming it. Moves (step-back, spin, euro-step, 360 and windmill dunks) unlock as your ratings grow, and traits unlock from career milestones.
12. **Management.** Deals run four seasons (your rookie deal, then renewals in pro years 5, 9 and 13): in a contract year your club and two others make offers. Salary, prizes and sponsors add up to your career earnings. There are also sponsors, training staff (they boost practice XP; the physio speeds up rest and cuts injuries), a home gym and cosmetics.
13. **Retirement.** It's your choice from 30, and forced at 39 (or earlier if you fall off). A legacy score built only from pro achievements decides the Hall of Fame. That's 12 per title, 12 per MVP, 3 per All-League 1st team, 1 per season and 1 per 250 points; the line is 90. The **Trophy case** holds every award from high school on, with your career highs, and the **Timeline** charts your OVR by age with everything that happened.

Every opponent is a real engine player with their own ratings and size, so a 7′1″ rim protector and a 5′11″ guard play completely differently.

The main menu also has Quick 1v1 (any two players, any court, any format, and three rulesets: Arcade full court, Street Sim with fouls, or **Street half court** with a check ball at the top, clearing the ball past the arc after a stop, make-it-take-it, win by 2 and scoring by 1s and 2s or 2s and 3s) and the Hall of Fame. Settings → Career games picks full or half court for the career. **Extras** holds the classic team league (5v5 or 3v3 with manager mode), a street tournament (an eight-player bracket, first to 11), the 3-Point Contest, Practice (free shooting with a shot chart), the tutorial and the **Art Lab** (every character, expression, pose, hand pose, sneaker colorway, animation clip, venue and the UI kit; also opens directly with `index.html?artlab`).

## Height matters

Height is never a menu option. It changes your ratings in every game: per 10 cm above average you get Strength +6, Defense +3.5, Finishing +3, Hops −1, Handles −4 and Speed −5. It also sets your ceilings: taller players can grow Strength, Defense and Finishing further, and shorter players can grow Speed and Handles further. On top of that the engine models the body:

- **Reach.** Contests, blocks and rebounds come from standing reach (height plus wingspan) plus your jump.
- **Post game.** At least 3 inches on your man, near the block, holding Stance: back him down (Strength against Strength), turn into a hook (Shoot), take a drop step (Move), or pump fake and step through with an up-and-under (tap Shoot, then Move).
- **Rim protection.** A defender who leaves the floor in time with a hand at the ball can block a layup, floater, hook or dunk; size, Defense and Hops decide how often. Jump shots are protected for 0.08 s after the release, so blocks on them stay rare. Height also wins box-outs and 50/50 balls (+4% per 10 cm).
- **Small guards.** Under 6′2″ (1.88 m) you get an 8% quicker first step and more ankle breakers.
- **Feet.** Taller players are slower and accelerate slower, need longer to gather, carry the ball higher (easier to steal) and turn slower (more ankle breakers).

Height is a trade-off, not a win button. In headless engine tests (Pro bots, 2:00 halves, 60 games) a 2.12 m player and a 1.82 m player built from the same ratings plus the career's height shifts split the games 29–31, at 1.44 and 1.43 points per possession. The big one blocked 2.3 shots a game and out-rebounded the guard 10.8 to 7.2. The guard stole the ball 6 times a game and broke the big one's ankles twice. With identical ratings and no height shifts the guard wins more: the big one took 25 of 60 with all ratings at 6 and 21 of 60 with the dev menu's lockdown ratings (Defense 9 against Handles 5 turns into 8 steals a game).

## Controls

| Action | Keys A | Keys B | Gamepad | Touch |
| --- | --- | --- | --- | --- |
| Move | A / D | ← / → | Stick / d-pad | Stick |
| Jump / block / rebound | W or Space | ↑ or Space | A | JUMP |
| Defense stance (hold). With the ball: post up (hold) | S | ↓ | LT | Pull the stick down |
| Shoot (hold, release at the top of the jump; tap = pump fake). While posting up: hook | J | Z | X | SHOOT |
| Fadeaway jumper (hold, release at the top) | K | X | B | FADE |
| Dribble move / steal. From the post: drop step; after a post pump fake: up-and-under | L | C | Y | MOVE |
| Sprint (quick tap while dribbling slowly = hesitation) | Shift | Shift | RT | Push the stick past 85% |
| Pause | Esc or P | Esc or P | Start | Pause button |

Dribble moves: crossover (Move), spin (Sprint + Move), step-back (stick away from the hoop + Move), hesitation (tap Sprint), pump fake (tap Shoot). Dunk by driving hard at the rim and pressing Shoot: one-hand, two-hand, tomahawk, windmill or 360, depending on your Hops and height.

**Defense.** A set defender is a wall: running into one just stops you, and sprinting into one that's planted can be a charge (Settings can turn charges off). Getting past takes a move, a read or a quicker first step. Beaten? Race to the rim in the next lane over and jump as they go up. Bots do all of this with the same buttons. Euro-step by flipping the stick during a layup gather. Pausing a career game offers "Sim the rest of the game" (career games always count).

### How accuracy works

Every jumper is graded on release timing against the top of the jump: green (perfect), good, late or early, or bad. The meter shows the window. After the release the game prints the grade, how open you were and the make chance. The window shrinks with contest, distance and tiredness, and grows with the Shooting rating. Fadeaways drift away from the defender, so they're harder to contest but a little harder to make. Hooks have no meter: they're graded on Finishing, size and contest. Layups and dunks are graded on contest and Finishing.

## Dev tools

Press the backtick key (or tap the title logo five times) for the dev menu. It has mirror 1v1 sims, a height test (equal ratings, 2.12 m vs 1.82 m), bot difficulty duels (Legend vs Pro, Pro vs Rookie), a league model check (the fast sim used for AI games against the real engine), the shot lab (proves the solver honors the make/miss roll), the tunneling test, a money and fame cheat for testing the career, and the F1 (AI), F2 (hitboxes and lanes) and F3 (last shot breakdown) overlays.

Everything is exposed on `window.HH` for scripting: `HH.simulateMatch(...)`, `HH.shotLab(...)`, `HH.tunnelTest(n)`, `HH.amCreate(...)`, `HH.amSimGame(...)`, `HH.createCareerFromAmateur(...)`, `HH.testProLeague(seed)`, `HH.simUserGame(...)`, `HH.legacyOf(...)`.

## Tech

Vanilla JavaScript (ES2020+), Canvas 2D and Web Audio. All art is drawn in code and all sound is synthesized. Every tuning number lives in the `CONFIG` object at the top of the file. Gameplay randomness comes from a seeded RNG, so any match can be reproduced from its seed, and the career has its own seeded stream. Your games run on the full engine. AI-vs-AI league games use a fast statistical model fitted by least squares to 4,000 headless engine games, so standings and stat lines match what the engine produces. A rating is the engine attribute × 10, from high school to retirement. Saves live in `localStorage` under `hoopheads.save.v1` (schema version 5). A career from the first high-school build carries over with its ratings, height and history. Careers from older builds (the team career and the first pro-only 1v1 career) can't continue, so their name and face prefill a new player. If storage is missing or corrupted, the game still runs.

## Tests

The game has no build step and no dependencies. The tests use Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`, or a global install):

```
node tests/check-syntax.js         # node --check on the game's script
node tests/smoke.js                # the whole game through the UI at 1280×720, other modes, old-save migrations,
                                   # regression checks, and the phone layout with touch at 844×390 (zero errors allowed)
node tests/devtools.js             # bot sims (1v1 Pro mirror, Legend vs Pro, 3v3), shot lab, tunneling test
node tests/balance.js [n]          # a scripted "human" plays real matches: points per possession by strategy vs Pro and Legend
node tests/stylemix.js [n]         # bots play to their build: post-ups, jumpers, threes and drives by play style
node tests/heighttest.js [n]       # 2.12 m against 1.82 m, with and without the career's height shifts
node tests/careersim.js [40] [seed] [--set career.proMean=83 ...]   # whole simulated careers against the career targets
                                   # (the week, press answers and recruiting included); --set tries a CONFIG value
node tests/perf.js                 # frame cost at phone size in the arena
node tests/artlab.js <m> <round>   # Art Lab + in-match screenshots → shots/<m>/round-<round>/
node tests/reel.js <m> <round> [court] [seconds]   # plays a bot match and screenshots each key animation (dunk, crossover, rim hang...)
node tests/shots.js <dir>          # a screenshot of every screen (the audit and before/after gallery)
```

`AUDIT.md` is the baseline audit, `PLAN.md` the milestone plan, and `CHANGES.md` logs every tuned number.
