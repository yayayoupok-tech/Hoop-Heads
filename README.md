# Hoop Heads

An offline 1v1 arcade basketball career game in a single `index.html`. You start as a 14-year-old high school freshman, get recruited, go to college, sign with one of twelve pro franchises rated 1 to 5 stars and work your way onto a great one: seasons, playoffs, awards, contracts, sponsors, injuries, a rival, the press, getting older, and a Hall of Fame vote when you retire. No online play, no accounts, no analytics and no network requests: the pixel font is drawn in code too.

One pixel-art world (the Retro look: a 360-row pixel grid, the Retro Ball Font, pixel menus), big-head caricature players drawn in code, bouncy physics, dunks, blocks, hooks, fadeaways, ankle breakers, posters. Under the hood: a fixed-step 120 Hz simulation, real ball physics with an analytic shot solver, and bots that press the same virtual buttons you do.

## Play it

Open `index.html` in a current Chrome, Safari, Firefox or Edge. It works from a double-click on the file and when hosted on any static host (GitHub Pages, Vercel). Landscape only on phones. If the page is embedded in another page, click the court once so it receives the keyboard.

On a phone every button is at least 64 px, and long screens (settings, Quick 1v1, the face editor, lists) turn into pages with ◀ ▶. If a match runs slow, a frame guard sheds cost one step at a time: the crowd at 15 Hz and half resolution, then no floor reflections, then no bloom, then a lower resolution for the match. In a Legends View match the thumb controls sit in the strip of floor under the players, and they fade to 40% while you aren't touching them.

## The career

One life, from a 14-year-old freshman to the Hall of Fame vote. Every game of it is one-on-one: your school, your
college program and your pro franchise are your team (its name, colors, uniform, coach and teammates, who show up in
practice and in the story), your 1v1 record is the team's record and your titles are the team's titles. The hub's
header always says which team you're on and how good it is: varsity (the school's top team) or JV (the second), the
program's tier from small school to blue blood, the franchise's stars and its rank of the twelve.

1. **Create your player.** Pick a face, a jersey number and a play style (Sharpshooter, Playmaker, Slasher, Lockdown, Post Scorer or Rim Protector), a pro season length (11 or 22 games) and a game length (1, 2 or 3 minutes; 1 by default). There is no height slider and there are no rating sliders.
2. **Your genes and your traits.** Adult height, growth pattern (early, normal or late bloomer) and wingspan are rolled once; a doctor projects your adult height, give or take an inch, and you find out the rest as you grow. You also get two traits out of 17 (common to legendary): a Signature one on the genes card and a Hidden one that shows itself in your sophomore season. Every trait has an upside and a cost (Gym Rat: +25% practice XP, but you recover slower).
3. **The depth chart.** Only the teammate on the top rung plays the week's game. Beat the one above you in a practice challenge (a 1v1 to 7) to take their spot; the one below can challenge you. Big programs start you lower, small ones at the top. Coach trust grows with wins and good weeks: it adds practice XP and puts in a word with recruiters and scouts.
4. **High school.** Tryouts first (a 60-second shootout, then a 1v1 against a senior): varsity or JV, with a call-up if JV goes well. A six-team district plays a double round robin, the top four play the district playoffs, and the district champions meet in a 16-team state tournament. Senior night, a rivalry game, report cards (under a 2.0 GPA you sit; a Study week helps), and four summers: the AAU circuit (recruiters watch, you start the season tired), a skills camp, rest or a summer job.
5. **The week.** Before every game: **Practice** (XP in your focus rating), **Rest** (fatigue −25; an injury heals a game faster), **Film** (learn the next opponent: +Defense and Shooting in that game). In high school, Rest also offers a **Study** week. Then PLAY the game yourself or SIM it. Every game adds fatigue; past 50 you play worse and get hurt more (Settings → Career injuries turns injuries off).
6. **Recruiting.** A national rank in a class of 3,000 and a star rating; offers from four program tiers (blue blood, power, mid-major, small), three official visits (each shows the facilities, what the coach develops and where you'd start on the depth chart), then commitment day. Your rival may want the same spot.
7. **College.** Up to four seasons: marquee non-conference games, an eight-program conference and its tournament, and a 64-program national tournament. Scouts grade every game (your pro stock); NIL deals pay for appearances (money you keep, fatigue it costs); a season on the bench opens the transfer portal; an agent can get you more on every contract for a share of it. After each season: turn pro, or stay.
8. **The combine and signing day.** Height (barefoot and in shoes), wingspan, reach, vertical, agility and bench. There is no draft: the scouts' score decides which franchises want you, and three make offers (the best that wants you, one a star lower that starts you, and a rebuild that starts you and pays more). You pick.
9. **The pros.** Twelve franchises rated 1 to 5 stars. Stars bring facilities (more XP), pay, fame a game and a deeper bench, and they move each offseason with the standings. Each franchise has one league player, its starter, and its depth chart decides whether that's you. Seasons, playoffs, an All-Star weekend (a 3-point contest and the All-Star 1v1), Player of the Week and the awards. **Moving up:** your value (OVR + fame/15 + hype/30) against each star level's bar. Free agency brings three offers (your team, the best franchise that wants you, one that starts you), and a trade request goes at most a star up, once every two seasons. **The goal** is on the hub: a 3★ team, then a 5★ team, starting for one, and a title with one. The hub is a front office: Team, League (standings, the franchises), Office (moving up, contract and money, sponsors, training, the home gym, lifestyle, gear, looks) and Career (your player, the news, trophies, the timeline, the stats guide). Contracts you negotiate (1 to 5 seasons; a promised start costs 10%) and what money buys: a personal trainer, a private coach, nutrition and physio, a home gym, a car or a house for your family, sponsors, and a signature shoe line once your hype reaches 60.
10. **Gear.** The gear shop (the Team screen; in the pros also the Office's Gear tab) sells court shoes, spring insoles, a shooter's sleeve and grip wristbands (+0.5 a level to Speed, Hops, Shooting or Handles, in games only), ankle braces (10% fewer injuries a level) and a recovery kit (1 less fatigue after each game a level). Three levels each at $250, $2,500 and $250,000: small edges, on purpose.
11. **Hype and the press room.** Hype runs from 0 to 100. It lifts sponsor offers, the scouts' score and your value to the franchises, recruiting, All-Star votes and the home crowd; it costs too: losses shake you more, from 60 defenses key on you, from 70 the media eats into practice and your rival is fired up. Big games end in the press room with four answers (Team first, Confident, Trash talk, No comment), none best: each says what it does.
12. **The story.** Three to five beats a season, told in RPG dialogue boxes with the speaker's portrait: your family, a mentor (the oldest teammate), your coach, your rival, your traits, the spotlight, an injury and the comeback, signing day, the first contract, a title chase and, from 34, a farewell tour. Some end in a choice where both answers cost something. THE DAILY DRIBBLE has the headlines and a social feed that reacts to your games, press answers, trades and signings.
13. **Getting better.** XP comes slowly: a typical player is about 72 OVR at 25 and peaks in the mid 70s. Every game gives XP; it grows with winning and follows your game (made shots build Shooting, rim finishes Finishing, rebounds Strength and Hops, steals and blocks Defense), plus your practice focus. Ratings grow in steps of 5 with rising cost up to ceilings set by your play style, height, genes and traits. Teens learn fastest; after 30 the legs go first. Moves unlock as your ratings grow.
14. **Retirement and the epilogue.** A legacy score from your pro career decides the Hall of Fame vote. Then what your money builds: a foundation (legacy), a youth academy (your next career starts ahead), a franchise stake (the owner's ending) or a free ending as a coach or a broadcaster. The **Trophy case** holds every award from high school on, and the **Timeline** charts your OVR by age with everything that happened.
15. **The stats guide.** Career → Stats guide (in high school and college, the Stats screen; anyone, How to play) explains every number: your value right now, what it does in the game's own numbers and how to move it. Hype, for example, lists what yours earns you and what it costs you right now.

Every opponent is a real engine player with their own ratings and size, so a 7′1″ rim protector and a 5′11″ guard play completely differently.

The main menu also has Quick 1v1 (any two players, any court, any format, and three rulesets: Arcade full court, Street Sim with fouls, or **Street half court** with a check ball at the top, clearing the ball past the arc after a stop, make-it-take-it, win by 2 and scoring by 1s and 2s or 2s and 3s), the Hall of Fame and **Save slots** (three careers, each with its own Hall of Fame and records). Settings → Gameplay → Career games picks full or half court for the career. **Practice** holds shooting practice (every rebound comes back to you), the 3-Point Contest (threes only: you walk from rack to rack and Shoot is the only button) and the tutorial. The credits are in Settings, and the **Art Lab** is in the dev menu (also `index.html?artlab`).

**Settings** has five tabs: Graphics (Retro, Retro sharp or Smooth; the camera; shake), Audio, Controls (keys A, B or your own, remapped action by action; the touch controls), Gameplay (difficulty, rules, the career's court, game length and injuries, the shot meter, power-ups in Quick 1v1, first-time tips) and Accessibility (text size 1× or 1.25×, reduce motion, colorblind-safe jerseys). The first time you reach each part of the career a short tip explains it.

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

Settings → Controls → Remap keys… sets your own key for every action (the Custom set; Esc always pauses and backs out). Dribble moves: crossover (Move), spin (Sprint + Move), step-back (stick away from the hoop + Move), hesitation (tap Sprint), pump fake (tap Shoot). Dunk by driving hard at the rim and pressing Shoot: one-hand, two-hand, tomahawk, windmill or 360, depending on your Hops and height.

**Ball rules.** Jumping with the ball commits you to a shot or a pass: landing with it is a travel. A dribble you pick up (a pump fake from a standstill, or a catch) can pivot, but walking more than 0.3 m is a travel, dribbling again is a double dribble, and holding it for 5 s while closely guarded is a turnover. Legends View plays a 10 s shot clock.

**Defense.** A set defender is a wall: running into one just stops you, and sprinting into one that's planted can be a charge (Settings can turn charges off). Getting past takes a move, a read or a quicker first step. Bodies only block in real contact (a drive into a set defender, box-outs, post-ups): everywhere else players pass through each other, so a defender running back can go straight past the ball handler. In Legends View a player who misses a layup, dunk or tip can't grab his own rebound for 1.3 s. Beaten? Race to the rim in the next lane over and jump as they go up. Bots do all of this with the same buttons. Euro-step by flipping the stick during a layup gather. Pausing a career game offers "Sim the rest of the game" (career games always count).

### How accuracy works

Every jumper is graded on release timing against the top of the jump: green (perfect), good, late or early, or bad. The meter shows the window. After the release the game prints the grade, how open you were and the make chance. The window shrinks with contest, distance and tiredness, and grows with the Shooting rating. Fadeaways drift away from the defender, so they're harder to contest but a little harder to make. Hooks have no meter: they're graded on Finishing, size and contest. Layups and dunks are graded on contest and Finishing.

## Dev tools

Press the backtick key (or tap the title logo five times) for the dev menu. It has mirror 1v1 sims, a height test (equal ratings, 2.12 m vs 1.82 m), bot difficulty duels (Legend vs Pro, Pro vs Rookie), a league model check (the fast sim used for AI games against the real engine), the shot lab (proves the solver honors the make/miss roll), the tunneling test, a money and fame cheat for testing the career, and the F1 (AI), F2 (hitboxes and lanes) and F3 (last shot breakdown) overlays.

Everything is exposed on `window.HH` for scripting: `HH.simulateMatch(...)`, `HH.shotLab(...)`, `HH.tunnelTest(n)`, `HH.amCreate(...)`, `HH.amSimGame(...)`, `HH.createCareerFromAmateur(...)`, `HH.testProLeague(seed)`, `HH.simUserGame(...)`, `HH.legacyOf(...)`.

## Tech

Vanilla JavaScript (ES2020+), Canvas 2D and Web Audio. All art is drawn in code and all sound is synthesized. Every tuning number lives in the `CONFIG` object at the top of the file. Gameplay randomness comes from a seeded RNG, so any match can be reproduced from its seed, and the career has its own seeded stream. Your games run on the full engine. AI-vs-AI league games use a fast statistical model fitted by least squares to 4,000 headless engine games, so standings and stat lines match what the engine produces. A rating is the engine attribute × 10, from high school to retirement. Saves live in `localStorage`: slot 1 under `hoopheads.save.v1` (schema version 5), slots 2 and 3 under `hoopheads.save.v1.slot2` and `.slot3`; a save that can't be read is kept aside under `.corrupt`. A career from the first high-school build carries over with its ratings, height and history. Careers from older builds (the team career and the first pro-only 1v1 career) can't continue, so their name and face prefill a new player. If storage is missing or corrupted, the game still runs.

## Tests

The game has no build step and no dependencies. The tests use Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`, or a global install):

```
node tests/check-syntax.js         # node --check on the game's script
node tests/smoke.js                # the whole game through the UI at 1280×720, other modes, old-save migrations,
                                   # regression checks, and the phone layout with touch at 844×390 (zero errors allowed)
node tests/devtools.js             # bot sims (1v1 Pro mirror, Legend vs Pro, 3v3), shot lab, tunneling test
node tests/balance.js [n]          # a scripted "human" plays real matches: points per possession by strategy vs Pro and Legend
node tests/gate.js [n] [perCell]   # the balance gate: Legends and Classic Pro mirror PPP, Legend vs Pro, and the harness by layout
node tests/stylemix.js [n]         # bots play to their build: post-ups, jumpers, threes and drives by play style
node tests/heighttest.js [n]       # 2.12 m against 1.82 m, with and without the career's height shifts
node tests/careersim.js [40] [seed] [--set career.proMean=83 ...]   # whole simulated careers against the career targets
                                   # (the week, press answers, recruiting, franchises and gear included); --set tries a CONFIG value;
                                   # --fa=stars|money|yours|best|starter, --trade=up|never, --spend=smart|none and --gear=buy|none
                                   # pick the policies
node tests/perf.js                 # frame cost at phone size in the arena, at each performance-guard level
node tests/modes.js                # every mode played to its end through its screens (quick 1v1, the 3-point contest,
                                   # practice, the tutorial, and the career's games, drills, challenges and All-Star weekend)
node tests/oldsaves.js [actions]   # every save in tests/fixtures (from older builds) reloaded and played on through the UI
node tests/phoneaudit.js [dir] [--desktop] [--size=WxH@dpr] [--text125]   # every screen (about 130) at 844×390, 1280×720 or any
                                   # window, optionally at 1.25× text: tap targets under 64 px, overlapping or cut text, text under
                                   # a figure, overlaps, off-screen or unlaid widgets, labels off their buttons
node tests/fullcareer.js [--phone]  # one whole career through the screens, title to the Hall of Fame (a real match at each level)
node tests/traitbalance.js [n] [seed] [par]                      # every trait forced on n careers: legacy against the median
node tests/pressbalance.js [n] [seed] [par]                      # "always X" in the press room (the four answers) on the same careers
node tests/hypebalance.js [n] [seed] [par]                       # chase hype against stay quiet on the same careers
node tests/gen_oldsaves.js [dir]   # rebuilds the old-build fixtures by running earlier builds from git history
node tests/beforeafter.js <dir>    # pairs shots/audit with a fresh shots.js run into shots/before-after/
node tests/artlab.js <m> <round>   # Art Lab + in-match screenshots → shots/<m>/round-<round>/
node tests/reel.js <m> <round> [court] [seconds]   # plays a bot match and screenshots each key animation (dunk, crossover, rim hang...)
node tests/shots.js <dir>          # a screenshot of every screen (the audit and before/after gallery)
```

`AUDIT.md` is the baseline audit, `PLAN.md` the milestone plan, and `CHANGES.md` logs every tuned number.
