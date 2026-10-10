# Hoop Heads

**Version 3.0.** An offline 1v1 arcade basketball career game in a single `index.html`. You start as a 14-year-old high school freshman, play your way through the tournaments and the recruiting of a whole basketball world, go to college, sign with one of the sixteen franchises of the Pro Basketball League (PBL), rated 1 to 5 stars, and work your way onto a great one: seasons, playoffs and rings, the Cup, the World Cup and the Olympics, awards, contracts and free agency, a crew that works for you, the store, school and your grades, injuries, getting older, and a Hall of Fame vote when you retire. Every week is one tap: PLAY or SIM from HOME, and training happens by itself. No online play, no accounts, no analytics, no purchases and no network requests: the pixel font is drawn in code too. The league, its franchises and every name in it are invented.

One pixel-art world (the Retro look: a 360-row pixel grid, the Retro Ball Font, pixel menus), big-head caricature players drawn in code, bouncy physics, dunks, blocks, hooks, fadeaways, ankle breakers, posters. Under the hood: a fixed-step 120 Hz simulation, real ball physics with an analytic shot solver, and bots that press the same virtual buttons you do.

## What's new in 3.0: the Retro Bowl rework

Hoop Heads 3.0, in eleven milestones (X1–X11; `CHANGES.md` has each one with its tables). The career plays like Retro Bowl: one HOME, one tap a week, a world that keeps score of how you play.

- **Fixes first.** A long session no longer grows in memory (50 career games stay within +150 MB), and career games score 12–18 points a side in 70–80 seconds.
- **Less to manage.** The story campaign, press conferences, rivals, hype (fame is the one meter), item rarity, recruiting busywork (film, emails, monthly actions) and the old staff menu are gone. Old saves load with them taken out.
- **HOME and the week.** Five tabs along the bottom: HOME, LEAGUE, EVENTS, CAREER and STORE. PLAY goes to the game and one result screen, SIM shows a toast, and the season's end is one review. A plan that sticks (Auto, Focus, Rest or Study) trains at every game in +1 steps, with "+1 in about N weeks" on every rating and an optional 30-second drill worth up to +50%. Messages say one thing and come one a week.
- **Rankings and charts.** Weekly player and team rankings at every level, from how people play, never from OVR. The LEAGUE tab's charts: rankings, leaders, standings, brackets, your team and your own charts.
- **Teammates and the leagues below.** Every team has five, and all five play: the four behind the starter play JV, the Reserve League or the PBL Development League, and the depth chart follows form (ahead of the starter three weeks running takes the spot). Transfers at every level, a Transfers chart, an Overseas League below the PBL, and the PBL's teams as cards with their dynasties.
- **Tournaments.** One engine for State, the HS Nationals, the AAU circuit, the Elite Camp, the All-American Game, the U17 and U21 World Cups, the conference and national tournaments, the Preseason Invitational, the PBL Cup, Blacktop Kings, the World Cup and the Olympics: knockouts, groups with medals, a skills challenge and a showcase, harder by level, tier and round, each with a bracket chart and rewards (cash, ranking points, credits, fame, recruiting exposure, tournament items, trophies and medals).
- **Items and badges.** The store's twelve items with levels 1–5 and no rarity (never more than +4 to a rating, all of it together); tournament items are won, never bought. Seventeen badges, each earned by doing its thing, Lv1 to Lv3.
- **Your crew.** Six roles (a skills coach, a scout, a strength coach, a physio, a mental coach and an agent), levels 1–5 bought with credits, slots by stage, and they follow you from high school to the pros. Their work shows every week on HOME, in every game and before every tournament.
- **Recruiting like real life.** Interest comes from how you play: your rating and titles, the tournaments, your points and the national player ranking. College scouts come to your big games, every summer event has its programs (your scout names them and, at Lv3, gets you into the invitation-only ones), offers come by themselves (a top target's is held through Signing Day, the rest come with a deadline), and with no offer there is junior college, a club abroad, a walk-on or a prep year.
- **Progression.** The legacy weighs what you did (awards, the player rankings, tournaments and medals, your peak OVR), not only the rings; your ceiling is shown on CAREER, and tournaments, your crew, a training facility and badges raise it; a play-well career keeps climbing through its twenties; fame follows your role, your stats and your wins, and fades.
- **App-ready.** Every price lives in one table; a store module is prepared for a future app (it sells nothing here, and anything it would sell can be earned by playing); saves are versioned and can be copied out as a code and loaded back; an upright phone turns the game to fill the screen.

## Earlier versions

- **2.1** brought the recruiting game (64 college programs in eight conferences), the PBL's sixteen franchises in two conferences with owners, GMs and coach systems, the offseason in seven steps with free agency day by day, and teams that come to you instead of a draft.
- **2.0** brought the Road to the League, scouting cards and signature moves, the XP curve and grades, school and the GPA, the shop, pro teams with crests, playoffs, rings and banners, the Codex, new celebrations and arenas, and a frame time halved on a phone.

3.0 keeps all of that except what it took out on purpose (above). `CHANGES.md` has every version's details.

## Play it

Open `index.html` in a current Chrome, Safari, Firefox or Edge. It works from a double-click on the file, when hosted on any static host (GitHub Pages, Vercel) and with no network at all. If the page is embedded in another page, click the court once so it receives the keyboard.

On a phone every button is at least 64 px, and long screens (settings, Quick 1v1, the face editor, lists) turn into pages with ◀ ▶. The game plays in landscape: on a phone held upright it turns itself to fill the screen, so it works with the rotation lock on too (Settings → Display → Upright phone: Turn the game, or Ask to rotate). If a match runs slow, a frame guard sheds cost one step at a time: the crowd at 15 Hz and half resolution, then no floor reflections, then no bloom, then a lower resolution for the match. In a Legends View match the thumb controls sit in the strip of floor under the players, and they fade to 40% while you aren't touching them.

## The career

One life, from a 14-year-old freshman to the Hall of Fame vote. Every game of it is one-on-one: your school, your college program and your pro franchise are your team (its name, colors, uniform, coach and four teammates), your 1v1 record is the team's record and your titles are the team's titles.

1. **Create your player.** Pick a face, a jersey number and a play style (Sharpshooter, Playmaker, Slasher, Lockdown, Post Scorer or Rim Protector) and a game length (1, 2 or 3 minutes; 1 by default). There is no height slider and there are no rating sliders.
2. **Your genes, your ceiling and your badges.** Adult height, growth pattern (early, normal or late bloomer) and wingspan are rolled once; a doctor projects your adult height. Each skill has a ceiling, your potential (rolled at the start) plus what raises it: past it every +1 costs three times the XP. CAREER rates every rating against its ceiling ("Shooting 78 / 82") and shows CEILING with what raised it. Badges are earned, never rolled: each of the seventeen unlocks by doing its thing and levels up to Lv3 the same way.
3. **HOME and the week.** HOME is your week: the next game (PLAY or SIM), the season, the table, the next event, your crew's report and the headlines; LEAGUE has the charts, EVENTS the tournaments and the calendar, CAREER you (ratings, badges, records, the Road), and STORE the store. Your plan stays until you change it: Auto trains your best-value rating, Focus one rating you pick, Rest takes fatigue off, Study raises your GPA; over 70 fatigue the week rests on its own. A message comes at most once a week.
4. **The depth chart.** Every team has five. The starter plays the week's game; the four behind play the league below (JV, the Reserve League, the PBL Development League), a real game a week with standings and rankings, and when you don't start you play there yourself. The chart follows form (the last three games' points).
5. **High school.** Tryouts set your place on the depth chart: the starter plays varsity, the rest JV. A district, the state playoffs and the HS Nationals; in the summers the AAU circuit, the Elite Camp, the U17 World Cup or a summer job; the All-American Game for the top 24 seniors. Your GPA: every game week takes a little off, a Study week puts it back, and an offer needs its line.
6. **Recruiting.** 64 college programs in eight conferences, each with a place, a crest, an arena, a tier from small school to blue blood, a coach and a system, facilities, an NIL market, a GPA line and spots to fill. Interest comes from how you play; college scouts come to your big games (the playoffs, senior night, the Boss, a ranked opponent) and your grade moves their interest; each summer event has its programs. Offers come by themselves: a top target's is held through Signing Day, the rest come with a deadline before a filled spot takes them. With no offer: junior college (then transfer offers by your finish), a club abroad, a walk-on or a prep year.
7. **College.** Up to four seasons: the Preseason Invitational, your conference and its tournament, the national tournament of all 64, the U21 World Cup; NIL deals, and the combine when you leave.
8. **The pros.** Sixteen PBL franchises in two conferences, rated 1 to 5 stars, each with a city, a crest, an owner, a GM's plan and a coach's system. There is no draft: franchises make offers when your value (OVR, fame and playoff wins) crosses their bar, and a better one calls with a trade. A fifteen-week season with the PBL Cup's group nights and knockout weekend, the All-Star weekend, the trade deadline and a national TV game; the conference playoffs and the Finals; the awards; the offseason in seven steps with free agency day by day; Blacktop Kings in the summer, the World Cup and the Olympics two years apart for the league's top four.
9. **Tournaments.** Every field plays at its level plus its tier (local, state, national, international, Olympic), and every round adds to it: the rating shows before each game. The rewards: cash, ranking points, credits, fame, recruiting exposure, the champion's tournament item, trophies and medals for the trophy room, the legacy, and a higher ceiling.
10. **The store.** Twelve items, the same every week, levels 1–5 at the stage's prices (a high schooler's $60, a pro's $400K), never more than +4 to a rating all together; extras for the week, celebrations; in the pros a lifestyle and big buys (a stake in your team, a training facility that raises your ceiling, a home for your parents, your name on an arena).
11. **Your crew.** One slot in high school, three in college, six in the pros; three candidates a role, hired and levelled 1–5 with credits (from wins, tournaments and Road goals; salaries start in the pros), and two seasons together make them work a level higher. They show on HOME, in every result, on your bench in games and before every tournament (the prep), and they call with their news.
12. **Getting better.** Every game gives XP by what you did in it and its grade (in the pros an A pays 1.8×, a simmed game half); the next +1 costs 20 × 1.11^(rating − 40) XP, ×3 past its ceiling; teens learn fastest and after 30 the legs go first.
13. **Fame.** In the pros the games you start move it: wins, your points against the league's line, highlights and playoff games (a loss or a quiet night costs a little; the bench's games none); it fades 3% a week, and gains shrink near the top. Sponsors, your market value, All-Star votes, the home crowd and the franchises' bars follow it.
14. **Retirement.** The legacy: a title 10 (from the bench 5), MVP 8, Finals MVP 4, All-League 4 (2nd team 2), every other award and All-Star, each season in the player rankings' top 10 (#1: 3), tournaments and medals, 1.5 a point of peak OVR over 70, the seasons and the points. 225 puts you in the Hall of Fame (338: the first ballot). Then what your money builds: a foundation, a youth academy for your next career, or a stake in your franchise.
15. **The Road to the League and the Codex.** Fourteen milestones from making varsity to the Hall of Fame, each with a reward; the goal is a 5★ team. Press ? or tap the ? on any screen for its page in the Codex; it explains every number in the game's own terms. Hover or tap a stat for a one-line tip.

Every opponent is a real engine player with their own ratings and size, so a 7′1″ rim protector and a 5′11″ guard play completely differently.

The main menu also has Quick 1v1 (any two players, any court, any format, and three rulesets: Arcade full court, Street Sim with fouls, or **Street half court** with a check ball at the top, clearing the ball past the arc after a stop, make-it-take-it, win by 2), practice, the Hall of Fame and **Save slots** (three careers, each with its own Hall of Fame and records).

**Settings** has six tabs: Graphics (Retro, Retro sharp or Smooth; the camera; shake), Audio, Controls (keys A, B or your own, remapped action by action; the touch controls), Gameplay (difficulty, rules, the career's court, game length and injuries, the weekly drill, the shot meter, power-ups in Quick 1v1, first-time tips), Display (text size 1× or 1.25×, reduce motion, colorblind-safe jerseys, the upright phone) and Save (copy this save as a code, load a code or a file).

## Height matters

Height is never a menu option. It changes your ratings in every game: per 10 cm above average you get Strength +6, Defense +3.5, Finishing +3, Hops −1, Handles −4 and Speed −5. It also sets your ceilings: taller players can grow Strength, Defense and Finishing further, and shorter players can grow Speed and Handles further. On top of that the engine models the body:

- **Reach.** Contests, blocks and rebounds come from standing reach (height plus wingspan) plus your jump.
- **Post game.** At least 3 inches on your man, near the block, holding Stance: back him down (Strength against Strength), turn into a hook (Shoot), take a drop step (Move), or pump fake and step through with an up-and-under (tap Shoot, then Move).
- **Rim protection.** A defender who leaves the floor in time with a hand at the ball can block a layup, floater, hook or dunk; size, Defense and Hops decide how often. Jump shots are protected for 0.08 s after the release, so blocks on them stay rare. Height also wins box-outs and 50/50 balls (+4% per 10 cm).
- **Small guards.** Under 6′2″ (1.88 m) you get an 8% quicker first step and more ankle breakers.
- **Feet.** Taller players are slower and accelerate slower, need longer to gather, carry the ball higher (easier to steal) and turn slower (more ankle breakers).

Height is a trade-off, and against a quick guard it costs a big player more than it gives. In headless engine tests (`tests/heighttest.js`: Pro bots against each other, 60 games) a 2.12 m player and a 1.82 m player built from the same ratings plus the career's height shifts: the big one blocks 2.2 shots a game and out-rebounds the guard 9.1 to 7.2, but the guard steals the ball 5.7 times a game (the big one turns it over 6.3 times) and wins 48 of 60, at 1.42 points per possession against 1.14. With identical ratings and no height shifts the big one takes 11 of 60, and 4 of 60 with the dev menu's lockdown ratings (Defense 9 against Handles 5 turns into 8 steals a game). These are 2.1's numbers; 2.0's engine gave the big one 10 of 60, and the 29–31 split this page quoted before was the M7 engine's.

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

**Ball rules.** Jumping with the ball commits you to a shot or a pass: landing with it is a travel. A dribble you pick up (a pump fake from a standstill, or a catch) can pivot, but walking more than 0.3 m is a travel, dribbling again is a double dribble, and holding it for 5 s while closely guarded is a turnover. Legends View plays a 10 s shot clock. A timed game's clock runs through made baskets, free throws, inbounds and check balls until the last 10 seconds of a period; there, and in overtime, it stops on every dead ball. A career game (3.0) restarts just past half court after a basket or a dead ball, with the defender set in front, plays a 6 s shot clock and scores about 12–18 points a side.

**Defense.** A set defender is a wall: running into one just stops you, and sprinting into one that's planted can be a charge (Settings can turn charges off). Getting past takes a move, a read or a quicker first step. Bodies only block in real contact (a drive into a set defender, box-outs, post-ups): everywhere else players pass through each other, so a defender running back can go straight past the ball handler. In Legends View a player who misses a layup, dunk or tip can't grab his own rebound for 1.3 s. Beaten? Race to the rim in the next lane over and jump as they go up. Bots do all of this with the same buttons. Euro-step by flipping the stick during a layup gather. Pausing a career game offers "Sim the rest of the game" (career games always count).

### How accuracy works

Every jumper is graded on release timing against the top of the jump: green (perfect), good, late or early, or bad. The meter shows the window. After the release the game prints the grade, how open you were and the make chance. The window shrinks with contest, distance and tiredness, and grows with the Shooting rating. Fadeaways drift away from the defender, so they're harder to contest but a little harder to make. Hooks have no meter: they're graded on Finishing, size and contest. Layups and dunks are graded on contest and Finishing.

## Dev tools

Press the backtick key (or tap the title logo five times) for the dev menu. It has mirror 1v1 sims, a height test (equal ratings, 2.12 m vs 1.82 m), bot difficulty duels (Legend vs Pro, Pro vs Rookie), a league model check (the fast sim used for AI games against the real engine), the shot lab (proves the solver honors the make/miss roll), the tunneling test, a money and fame cheat for testing the career, **Jump to pro** (sims the rest of high school and college the way the career simulator plays them and opens the pro combine, so the pro and team flow can be tested quickly; with no career it starts one), and the F1 (AI), F2 (hitboxes and lanes) and F3 (last shot breakdown) overlays.

Everything is exposed on `window.HH` for scripting: `HH.simulateMatch(...)`, `HH.shotLab(...)`, `HH.tunnelTest(n)`, `HH.amCreate(...)`, `HH.amSimGame(...)`, `HH.createCareerFromAmateur(...)`, `HH.testProLeague(seed)`, `HH.simUserGame(...)`, `HH.legacyOf(...)`.

## Tech

Vanilla JavaScript (ES2020+), Canvas 2D and Web Audio. All art is drawn in code and all sound is synthesized. Every tuning number lives in the `CONFIG` object at the top of the file, and every price in the `ECONOMY` table just above it. Pictures that are painted once and kept (faces and portraits, a venue's layers and crowd, the players' poses, the menus' text, panels and buttons) are made ahead of time by a bake worker, the page's own code running in a Web Worker on OffscreenCanvas, and kept for the session; a browser without one makes them on the main thread in small slices, behind a short "Warming up..." bar before a game. Gameplay randomness comes from a seeded RNG, so any match can be reproduced from its seed, and the career has its own seeded stream. Your games run on the full engine. AI-vs-AI league games use a fast statistical model fitted by least squares to headless engine games, so standings and stat lines match what the engine produces. A rating is the engine attribute × 10, from high school to retirement.

**Saves** are versioned (schema version 6) and live in the device's storage through one adapter (`SAVE_STORAGE`: the browser's `localStorage` here): slot 1 under `hoopheads.save.v1`, slots 2 and 3 under `.slot2` and `.slot3`; a save that can't be read is kept aside under `.corrupt`. Settings → Save copies a slot as a code (`HH3:` and its JSON with the app, the schema version and the game's version) and loads a code or a file back into the slot: an older save is brought up to date by the same migrations that every old save goes through, a newer one is refused. Old saves load: 3.0 takes out what it removed (the story, press, the rival, hype, rarity, the old staff) without a word. If storage is missing or corrupted, the game still runs.

**App-ready (prepared, not live).** The code keeps its SAVE, ECONOMY, STORE and UI sections apart, so it can move into an app wrapper. `ECONOMY` holds every price: cash (earned by playing) buys items and their levels, a pro's crew salaries, school, camps, a lifestyle and the big buys; credits (from wins, tournaments and Road goals) hire and level up the crew. The STORE section is a product catalogue (credit packs that only speed things up, one Unlimited unlock, cosmetics: jerseys, shoes, courts and celebrations) and `purchase(sku)` through a provider interface; the web build's provider is a disabled stub with no payment code, so it sells nothing. There are no paid random rewards, and everything in the catalogue can also be earned by playing (Unlimited comes with a Hall of Fame career). In an app, purchases must go through Apple's and Google's own billing, as a provider behind the same interface.

## Tests

The game has no build step for players and no dependencies. The tests use Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`, or a global install). `CHANGES.md` has every table they print; X11's section has the full suite's run.

3.0's targets (§11), one suite each:

```
node tests/memory.js [50] [--phone] [--snap=5,30 --snapdir=DIR]   # 50 career games against new opponents: memory within +150 MB of the level after game 5 (--snap: heap snapshots)
node tests/heapdiff.js a b [top]   # 4.0: what grew between two heap snapshots, by constructor, and the canvases and bitmaps alive
node tests/fixes40.js [--phone]    # 4.0 (§0): the league's stars, toasts, crew pay in credits, no bench limbo, Most Improved, PBL rankings, the 3-Point Contest, team names, no rivals
node tests/loop.js                 # a season's weeks at each level through the real screens: at most 2 screens between games on PLAY, 1 on SIM
node tests/pace.js [8] [seed]      # career games played in the engine: 12–18 points a side, 70–80 s a game, at every level
node tests/rankings.js [careers]   # weekly rankings follow how people play: the top scorer in the top 10 in 95%+ of seasons, teams by record
node tests/lower.js                # five on a team, the leagues below, the depth chart by form (3 weeks ahead takes the spot), transfers, the Overseas League
node tests/tourney.js              # every tournament runs and has a bracket chart, NPC strength rises each round and tier, rewards, the Olympics and the World Cup alternate
node tests/recruit30.js            # recruiting (§8): interest from how you play, scouts at big games, the summer's programs, offers held and deadlines, the roads with no offer, the 600-career table
node tests/progress30.js [100] [seed] [par]   # progression (§9): fame by role, stats and wins, the ceiling shown and raised, the legacy's parts, and the table (play-well +40% legacy, OVR gains, fame spread)
node tests/crew.js                 # the crew (§7): roles, levels, credits, slots, the report, messages, the prep, and the §7.6 balance table (1,200 careers a policy)
node tests/items.js                # no rarity anywhere, the +4 cap (a property test), tournament items (never bought), badges earned
node tests/store30.js              # app readiness (§10): the stub provider sells nothing, every price from the one table, fair products, save codes, the upright phone, offline
node tests/oldsaves.js [actions]   # every save in tests/fixtures (from older builds) loads with what 3.0 removed taken out, and plays on through the UI
node tests/screens30.js [dir] [--only=desktop|phone|desktop125|phone125]   # the overflow audit of every 3.0 screen at a desktop, a phone and 1.25× text
```

The whole game and its systems:

```
node tests/check-syntax.js         # node --check on the game's script
node tests/smoke.js                # the whole game through the UI at 1280×720, other modes, old-save migrations, regression checks, and the phone with touch (zero errors allowed)
node tests/flow.js                 # the career flow: pace, the week, playing time, the Road, sim ahead, the hub's tabs
node tests/fullcareer.js [--phone] [--jump]   # one whole career through the screens, title to the Hall of Fame
node tests/modes.js                # every mode played to its end through its screens
node tests/fixes.js                # 2.0's must-fix bugs that need a page
node tests/gameplay.js             # scouting and the pregame card, the Boss, signature moves, overtime, the phone buttons
node tests/traits.js               # the badges: their numbers, deeds and levels, cards and chips, the Codex page, old saves
node tests/shop.js                 # the store: twelve items, levels 1–5, prices by stage, the +4 cap, lifestyle, old gear
node tests/climb.js                # the climb's rules: the XP curve, the ceiling, grades, the weekly drill, setbacks, 5★ scarcity
node tests/school.js               # GPA and school: offers, eligibility, Study weeks, scholarships, tuition
node tests/colleges.js             # the 64 colleges: the registry, the ranked list, a program's page, recruiting on HOME, the Codex, phones
node tests/proteams.js             # pro teams: identity, title odds, playoffs and the Finals, rings, banners, dynasties
node tests/pbl21.js                # the PBL: sixteen franchises, owners, GMs, coach systems, rosters, payroll, the fifteen weeks, the playoffs, award races
node tests/life21.js               # the offseason and league life: the seven steps, free agency day by day, the agent, contracts, owners, the value meter
node tests/improve21.js            # Study and the GPA floor, leaving college, offers and trades that come to you, big buys
node tests/playtest3.js            # 2.1's playtest fixes and the running clock
node tests/polish.js               # the Codex everywhere, tooltips, dots, What's new, legibility, celebrations, arenas
node tests/hudaudit.js             # the match HUD's text at several window sizes: nothing overlaps
node tests/phoneaudit.js [dir] [--desktop] [--size=WxH@dpr] [--text125]   # every screen at a phone, a desktop or any window: tap targets, cut or overlapping text
node tests/loadlag.js [--rate=4,1] [--only=startup|career|pro|quick] [--phone]   # every screen change and game load at 4× and 1× CPU
node tests/perf.js                 # frame cost at phone size in the arena, at each performance-guard level
node tests/perf4x.js [--phone-only]   # frame times at 4× CPU throttling with forced dunks and blocks
node tests/boxscore.js             # box-score invariants over 2,000 simmed games
node tests/steals.js               # every STEAL callout and stat is a real change of possession
node tests/parity.js [12] [seed]   # your simmed points against your played points, every level within 10%
node tests/league30.js [3] [30] [seed]   # 30 seasons of a league: trades, new champions, every franchise's title odds
```

Simulators and tools:

```
node tests/careersim.js [40] [seed] [--policy=great] [--crew=auto|none|full|<role>] [--seasons] [--hsOnly --spread=12] [--json] [--set career.x=1 ...]
                                   # whole simulated careers from a freshman to retirement: the tables by level, the crew, recruiting and the §9 numbers
node tests/effort.js [200] [seed] [par]   # the career policies: plays well + good choices against sims everything, never opening a menu, a smart spender
node tests/difficulty.js           # the difficulty table over 600 careers (a typical and a great policy): 3.0's bands, Part 2's targets beside them
node tests/traitbalance.js [n] [seed] [par]   # every badge forced on n careers: legacy against the median
node tests/devtools.js             # bot sims (1v1 Pro mirror, Legend vs Pro, 3v3), the shot lab, the tunneling test
node tests/balance.js [n] · gate.js · stylemix.js · heighttest.js   # the engine's balance harnesses
node tests/gen_oldsaves.js [dir] · beforeafter.js · artlab.js · reel.js · shots.js · gallery.js   # fixtures and screenshots
```

`AUDIT.md` is the baseline audit, `PLAN.md` the milestone plan, and `CHANGES.md` logs every tuned number.
