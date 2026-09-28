# Changes to the spec's starting numbers

The design spec gives starting values and asks for every change to be logged here with the reason. New constants added
without a spec value are listed per milestone too.

## F11 — Your team and its level on every hub (a follow-up to the F pass)

The user, after the F pass: "it should tell you which team you're on or whether you're on varsity or jv (which team is
better too)". Before, the high school hub's header said only the class and the school: JV showed in the next-game line,
and a phone didn't show the JV record at all. The college hub never said how good the program was.

- **The hub's header names your team and its level**, as a chip beside the team:
  - high school: VARSITY · TOP TEAM (gold) or JV · 2ND TEAM (orange), with "varsity is the top team" beside JV where it
    fits; TRYOUTS before your first tryout;
  - college: the program's tier (SMALL SCHOOL, MID-MAJOR, POWER CONFERENCE, BLUE BLOOD) and a pip a level (●●○○ is
    level 2 of 4), with "blue blood is the top" where it fits;
  - the pros: the franchise's stars, as before, and its rank of the twelve ("#11 of 12 franchises", the order of the
    League page's Franchises tab).

  The line fits between the season and the week at every window size: short of room the note goes first, then the
  text steps down a size. Nothing is cut short.
- **The Team page shows the ladder**: JV → VARSITY, or SMALL → MID-MAJOR → POWER → BLUE BLOOD, yours lit, with a line
  on which is better ("JV is the school's 2nd team · varsity is the top"). The line under the name starts with your
  level ("JV · your record here 1-1", "A 1★ franchise, #11 of 12 · …"). On JV the page says how to move up: win 3 of
  every 4 games and varsity calls you up.
- **The stats guide** (Team & pro value) starts with Your team (high school) or Your program (college): what each
  level means, in CONFIG's numbers. JV: opponents about 6 OVR weaker, no playoffs, the call-up, juniors and seniors on
  varsity. College, a level up: opponents about 2 OVR better, a likelier national tournament bid, bigger NIL deals, +2
  pro stock; teammates average −6 OVR from you at a small school and +6 at a blue blood. Your franchise adds its rank.
- **The tryout verdict says it too:** "JV is the school's second team; varsity is the top." The JV card is told by the
  varsity coach it names; its portrait showed your new JV coach.
- Your card on the hub reads "Westbrook High JV" on JV.
- **Fixed along the way**, three texts cut short with "…" that the new audit screens (a JV Team page, a college Team
  page, a league rebuilt for the call-up) turned up:
  - a long rival name on the Team page ("Granite Valley State Pant…") drops its mascot when the whole name doesn't fit
    (the pixel font can't draw smaller than its 1× size, so shrinking didn't help);
  - the numbers coach's line took four lines where three fit: "Keeps a shot chart on everyone. Trusts the numbers.";
  - on the standings page a tournament game against a long name ("STATE · ROUND OF 16 vs Viktor Waverly") wraps to a
    second line.

No new tuning numbers: the guide reads the ones it cites from CONFIG (`hs.jvGap`, `hs.promoteWin`, `hs.promoteAfter`,
`amateur.stageMean.collegePerTier`, `team.tierGap`, `amateur.draft.tier`).

| Test | Result |
| --- | --- |
| Smoke | 135 of 135. The F11 step: TRYOUTS, then JV · 2ND TEAM (a poor tryout) and VARSITY · TOP TEAM on the hub; the JV card says which team is better and is told by the varsity coach; the Team page's ladder and line; every college tier and where it stands; a franchise's stars and rank (the Franchises tab's order); the guide's entries. |
| Modes | 13 of 13 |
| Old saves | 34 of 34 |
| Dev tools | all OK |
| Screen audit | phone 135 screens and 1280×720, 1024×768, 1440×900, 1920×1080, 1000×1000 and 800×1000 137 each: nothing flagged (new: the JV hub, the JV and college Team pages, the guide's two entries, the varsity hub); phone at 1.25× text, nothing flagged; desktop at 1.25× text, the 3 press screens (the known limit) |
| A whole career through the screens | desktop 973 actions, phone 947: both passed |
| Art Lab | 55 screenshots, no errors |
| Gate, balance | ✓, the same as F10 (Pro mirror 1.18 PPP, Legend beats Pro 83%; the harness: brute force vs Pro 1.24, Legend beats Pro 78%) |
| Career simulator | seed 1: every target met (OVR 55 / 66 / 72 at 17 / 21 / 25, peak 77, 0.90 titles, Hall of Fame 15%), 0 stuck |
| Trait balance | every trait in range |

## The F pass (F1–F10): the report

The user's playtest notes on the R10 build, in their words, and what each one became. Ten milestones in eight commits
(F1 and F2 shared one, F3 and F4 another). Before every commit: the whole suite (smoke on desktop and phone, every mode,
old saves migrated and never wiped, the dev tools, the screen audits, the §2 gate, the balance harness, the career
simulator and trait balance) and the Art Lab screenshots, looked at.

| The note | Milestone | What changed |
| --- | --- | --- |
| "remove extras" | F1 | The Extras menu is gone. Practice replaces it: shooting practice, the 3-Point Contest, the tutorial. The team league and the street tournament are gone (their saves' data is kept). Power-ups are one Quick 1v1 setting, off. |
| "3 point tournament and even practice allow a layup … the rebound should come back to you" | F2 | The contest is threes only: the shooter walks rack to rack and Shoot is the only button. Practice passes every rebound back. |
| "the game lags a LOT, especially during dunking" | F3 | Sprites repaint at pixel-art rate, not every frame. A dunk's shake no longer re-bakes the arena. A posterizer no longer freezes play. Median frame 22 → 14 ms (desktop), 33 → 17 ms (phone). |
| "text overlaps, so we can't read other stuff" | F4, F7 | Text is sized from the letterboxed game area (it was up to 1.8× too big in tall windows). The screen audit flags overlapping text (F4) and text cut short with "…" (F7), at seven window sizes and at 1.25× text. |
| "games shouldn't be this long, like 1 min" | F5 | Every career game is one timed minute with a sudden-death overtime (Settings: 1, 2 or 3 minutes). Everything fitted to the old lengths is rescaled, so a season plays like before. |
| "xp should get harder to earn" | F6 | Every XP source pays 15% less and the top steps cost more. OVR at 25 went 75 → 72; the peak 78 → 77. |
| "the nba team concept should be improved … like retro ball"; "the goal … a really good NBA team … rework teams instead of making drafts" | F7 | Twelve franchises rated 1–5★ and no draft: three offers, then signing day. You move up as your value reaches each star level's bar. A goal track (a 3★ team, a 5★ team, its starting spot, a title). The hub is a front office (Team, League, Office, Career). |
| "add items you can buy … nothing too broken" | F8 | A gear shop: six pieces, three levels. +0.5 a level to one rating in games, fewer injuries, less fatigue. Tested at +1 a level too, which was too strong. |
| "something that allows us to see stats, like what does hype do or fame" | F9 | A stats guide: every meter, its value right now, what it does in the game's own numbers, and how to move it. |

### What each milestone measured

| Milestone | Measured | Before → after |
| --- | --- | --- |
| F1 Extras | the main menu; the modes test | Extras (team league, street tournament, contest, practice, tutorial, Art Lab, credits) → Practice (shooting, the contest, the tutorial); 15 modes → 12 (13 with F5's one-minute quick game) |
| F2 Contest and practice | a contest shooter who drives at the hoop every frame; practice rebounds | layups scored → 25 of 25 balls rack jumpers, no layup counts; the ball comes back 16 times in 40 s without the shooter moving |
| F3 Lag | frame median / p95 in the pro arena, AI against AI (ms); a posterizer | desktop 22.1 / 32.1 → 13.7 / 24.1; phone 33.1 / 44.9 → 17.0 / 28.9; a posterizer 47–55 ms, a 1.4 s freeze and a 5 s replay → 18–25 ms, no freeze, no replay |
| F4 Overlapping text | screens with overlapping text (six window sizes and 1.25× text; the HUD at five sizes) | up to 9 flagged at 1000×1000 → 0 of 111 at every size; the HUD 0 of 35 |
| F5 One-minute games | a career game's length, AI against AI | 133–275 s → about 70 s (100–110 s with an overtime, in 12–14% of games); the favourite wins 71.5% at both lengths |
| F6 Harder XP | OVR at 17 / 21 / 25 and the peak (40 careers, seed 1) | 56 / 68 / 75, 78 → 55 / 66 / 72, 77 |
| F7 Franchises | first team 1★ / 2★ / 3★ / 4★; a 5★ team reached; trades a career (40 careers) | the draft → 15 / 12 / 10 / 3; 65% (median age 29); 2.0 |
| F7 Cut text | screens with text cut short with "…" | 23 desktop and 14 phone → 0 |
| F8 Gear | titles and Hall of Fame, a simulated player who buys gear against one who doesn't (three seeds) | −0.08 to +0.23 titles a career and +2 to +5 points of Hall of Fame; at +1 a level (rejected), titles ×1.5 and the Hall of Fame ×4 |
| F9 Stats guide | the career's numbers explained | none → OVR, the ratings, XP, hype, fame, confidence, fatigue, injuries, gear, trust, the depth chart, value, stars, money, GPA and legacy, each with its value and its CONFIG rule |
| F10 QA | screens with text a figure covers (a new check, at every audited size); Art Lab views with overlapping or cut text; saves written by the live R10 build | the first screen, and the growth card at three window sizes → none; 15 → 0; untested → 3 of 3 play on |

### Tests on the final build (F10)

| Test | Result |
| --- | --- |
| Syntax (`tests/check-syntax.js`) | ok |
| Smoke: the game through the UI at 1280×720 and 844×390 | 134/134 |
| Modes: every mode played to its end | 13/13 |
| Old saves: every fixture, from the first 1v1 career to the R10 build, reloaded and played on | 34/34 (three new, written by the R10 build) |
| Dev tools | all OK (1,000 balls, 0 tunneled) |
| Every screen at 844×390: 64 px targets, off-screen, overlapping or unlaid widgets, labels off their buttons, overlapping text, cut text, text under a figure, errors | 129 screens, nothing flagged; the same at 1.25× text |
| Every screen at 1280×720, 1024×768, 1440×900, 1920×1080, 1000×1000 and 800×1000 | 131 screens at each size, nothing flagged |
| Every screen at 1280×720 with 1.25× text | 131 screens; 3 flagged, the press answers' quotes cut to one line (known limit 3) |
| A whole career through the screens | desktop: 975 actions, a real game in high school, college and the pros, the combine, the offers and signing day, retired after 13 pro seasons at 35; phone: 893 actions, the same path, passed |
| Art Lab | 55 screenshots, no errors; the text audit of every view and page: nothing flagged |
| §2 gate (300 mirror games, 200 Legend-vs-Pro games) | Pro mirror 1.18 PPP (0.95–1.25 ✓), team A 48% (45–55% ✓), Legend beats Pro 83% (75–95% ✓), brute vs Pro 1.00 (≤ 1.30 ✓), sniper 1.72 (timing beats brute force ✓) |
| Balance harness (Classic) | brute vs Pro 1.24 (≤ 1.30 ✓), perfect timing 2.12, Legend beats Pro 78% (75–95% ✓) |
| Career simulator, 40 careers | seed 1: every target met (OVR 55 / 66 / 72 at 17 / 21 / 25, peak 77, 0.90 titles, Hall of Fame 15%), 0 stuck; seed 2: every target met (OVR 55 / 66 / 71 at 17 / 21 / 25, peak 75, 0.65 titles, Hall of Fame 5%), 0 stuck |
| Trait balance (200 careers a trait) | all 17 in range (Generational +22%, Late Bloomer −13%, Glue Guy −12%) |
| Perf (AI against AI, pro arena, headless) | the table in F10 below |

### Deviations and known limits

1. **"Retro ball" was read as Retro Bowl.** The game borrows Retro Bowl's organization (star-rated teams, a front
   office with a few simple tabs), not its football.
2. **One league player per franchise.** The league's games stay 1v1: each franchise's starter plays its games, and
   your franchise's depth chart decides whether that's you.
3. **At 1.25× text on a desktop, a press answer's quote shows one line.** Two lines don't fit four answers on the
   panel; the answer and what it does stay whole. R10 made the same call.
4. **Gear is deliberately small.** At +0.5 a level, what gear does to titles and the Hall of Fame is about the size of
   the career simulator's noise; it shows up in fewer injuries and a little less fatigue.
5. **Perf is measured in headless Chromium**, which draws the canvas on the CPU. Nothing was measured on a real phone.
   The phone median, 17.4 ms, is just over a 60 fps frame (16.7 ms); the frame guard sheds cost when frames run
   slow.
6. **State and national titles stay rare** in the career simulator (it plays games from OVR): 0.03 state titles and no
   national titles a career on seed 2.
7. **Dead code:** the old 3-point contest screen (`allStarScreen`) is still in the build and nothing opens it (since
   R7).

## F10 — QA and release (the F pass, milestone 10)

- **The final sweep.** The screen audit ran at seven window sizes (a phone, 1280×720, 1024×768, 1440×900, 1920×1080, a
  1000×1000 square and an 800×1000 portrait window) and at 1.25× text on a desktop and a phone. A whole career was played
  through the screens on a desktop and on a phone. The career simulator ran two seeds. Results are below.
- **The first screen had text under art.** A new player's main menu drew its two players over the last line of the
  league's pitch ("…sim the ones you want"): F7 made the pitch a line longer. The players are now sized to the room
  under the text (at 1.25× text too). The screen audit missed it twice over:
  - it compared text only with text;
  - it never showed a menu without a career.

  It now flags text that a figure drawn after it covers (a menu figure, a portrait or a trading card over a quarter of
  the string). It also audits the new player's menu. On the old menu the check flags that line.
- **The sweep's window sizes found one more.** On the growth-spurt card, last year's grey figure ran into the ruler's
  5′6″ and 6′0″ labels at 1024×768, 1440×900 and 800×1000. The two figures moved 20 px right. The audit's high-school
  film room step had been opening that card: before the first game there is no next opponent, so the film room falls
  back to the hub. It now runs after the first game and opens the film room.
- **Perf, measured again on the final build** (`f3/prof.js`, AI against AI in the pro arena, 240 frames). Frame times
  are where F3 left them. The medians moved less than a run's noise (two F10 runs gave the phone 17.1 and 17.4 ms), and
  p95 fell at every size:

  | Window | F3: median / p95 / max (ms) | F10: median / p95 / max (ms) |
  | --- | --- | --- |
  | Desktop 1280×720 | 13.7 / 24.1 / 40.0 | 11.6 / 18.3 / 26.3 |
  | Phone 844×390 at 2× | 17.0 / 28.9 / 68.9 | 17.4 / 23.5 / 35.3 |
  | Square 1000×1000 | 7.8 / 14.2 / 24.1 | 7.2 / 13.5 / 28.6 |

- **The README describes the game as it is now:** franchises, signing day and the goal instead of the draft; the gear
  shop; the stats guide; Practice instead of Extras; one-minute games; harder XP. Four test files' headers were brought
  up to date (the full career's signing day, the career simulator's policy flags, the audit's cut-text check, the old
  saves' pro offers).
- **Saves from the live game.** The old-save test never had a save from R10, the build the live game runs until this
  update. The fixture generator now builds three with it:
  - a high-school career with the old team league on the side;
  - a pro career in its first season, drafted;
  - a prospect waiting at the pro combine for the draft F7 removed.

  All three play on through the screens on this build. The prospect's combine leads to three franchise offers
  (PGP, NSN, LDK). The old-save test has 34 saves now.
- **The Art Lab (a dev tool) had overlapping or cut text on 15 views.** A text audit of every view and page now finds
  none:
  - the hair names (two-word names on two lines) and the facial hair names;
  - the crowd atlas's caption (two lines) and its pose names (they started off the screen);
  - the Legends check's captions (three lines) and the phone-size figures' captions (two lines);
  - the 250 px faces: the captions go over the heads on a backing, since a tall hairstyle covered them, and the
    header moves under the buttons;
  - the clips' variants on their own line;
  - the Retro check: four characters a page, centered (six at 4× didn't fit and the last was cut), so seven pages;
  - Symmetry: one key for the construction lines, and a panel line per fact.

## F9 — The stats guide (the F pass, milestone 9)

The user: "add something that allows us to see stats, like for example what does hype do or fame etc."

**A stats guide covers every number the career shows.** Each entry has your value right now, what it does in the
game's own numbers and how to move it. The numbers are read from CONFIG, so the guide changes when the rules change.

| Topic | Entries |
| --- | --- |
| OVR & ratings | OVR; the seven ratings, each with what it does in a game; XP (the price of your next +1 in your focus) |
| Hype, fame, confidence | hype, with every BUZZ line (what it earns you and what it costs you right now); fame; confidence |
| Fatigue, injuries, gear | fatigue (how much it takes off your ratings right now); the injury chance per game; your gear |
| Team & pro value | coach trust; the depth chart; your value and the five bars (pros); your franchise's stars (pros); your pro stock and the scouts' bars (amateurs) |
| Money & school | money or cash; GPA (high school); legacy and the Hall of Fame threshold |

- Hype is the example the user named. The entry lists what yours earns you (sponsors, contract, All-Star votes, home
  crowd) and costs you (losses shake you more; defenses key on you at 60; the media eats practice at 70; a fired-up
  rival). It also says how it moves: a win +1, a big night +2.5, 10% off a week without a big night.
- **Where to find it:**
  - the pros: the Career menu's new Stats guide tile;
  - high school and college: the Stats screen;
  - anyone: How to play. With no career, it shows the rules without values.
- A long topic splits into two columns on a desktop. On a phone the topic picker sits in the bottom bar with Back.

| Test | Result |
| --- | --- |
| Smoke | 134 of 134. The F9 step: five topics; each meter's value right now and what it does, in CONFIG's numbers; the guide from the Career menu, the amateur Stats screen and How to play. |
| Modes | 13 of 13 |
| Old saves | 31 of 31 |
| Dev tools | all OK |
| Screen audit | phone 128 and desktop 130 screens, none flagged (every guide topic, pro and amateur, included); phone at 1.25× text, none flagged; desktop at 1.25× text, 3 flagged: the press answers' quotes (the known limit, below) |
| Art Lab | 54 screenshots, no errors |
| Gate, balance | ✓ (brute force vs Pro 1.00 PPP; Legend beats Pro 78%) |
| Career simulator | seed 1: every target met (titles 0.90, Hall of Fame 15%); seed 2: every target met (0.65, 5%) |
| Trait balance | every trait in range |

**Known limit.** At 1.25× text on a desktop, a press answer's quote is cut to one line. Two lines don't fit four answers on
the panel, and the answer and what it does stay whole (R10 made the same call).

## F8 — A gear shop: small edges you can buy (the F pass, milestone 8)

The user: "add items you can buy to improve some stuff, nothing too broken though".

**Six pieces of gear, three levels each** (Basic, Pro, Elite):

| Piece | Each level | Elite |
| --- | --- | --- |
| Court shoes | +0.5 Speed in games | +1.5 |
| Spring insoles | +0.5 Hops in games | +1.5 |
| Shooter's sleeve | +0.5 Shooting in games | +1.5 |
| Grip wristbands | +0.5 Handles in games | +1.5 |
| Ankle braces | injury chance −10% | −30% |
| Recovery kit | 1 less fatigue after a game | −3 of the 10 a game adds |

- **Only on game day.** The bonuses count in every game you play or simulate and in depth-chart challenges. Your OVR
  and your value to the franchises don't change.
- **Prices climb with the career:**
  - Basic $250: a high school summer job pays $1,000;
  - Pro $2,500: a college NIL deal;
  - Elite $250,000: a pro contract.
- High school and college pay with their cash, the pros with their money. Your gear comes along when you turn pro.
- **Where to buy:**
  - Gear shop on the high school and college hub (desktop);
  - Team → Gear shop (every screen, a phone included);
  - in the pros, the Office's new Gear tab. The old Shop tab is now Looks: headband, sleeve, signature shoes, ball skins.
- **On your player:**
  - the sleeve and the wristbands show;
  - shoes change color by level (white; black and pink; gold). Signature shoes from Looks win.
- A first-time tip explains the shop. The high school week tip now says Study sits behind Rest (F7 moved it).

**Fixed along the way:** the Office's headband and arm sleeve never showed on the player. A newer look dropped the
flags that put them on. The Office said "Headband: on" and nothing changed. Both show now.

**How much is "nothing too broken".** The career simulator's player bought every piece as soon as its money covered
the price twice over (four times in the pros). By the pros that is about half the levels; by retirement, all of them.

| Rating bonus a level | Titles a career | Hall of Fame | Legacy median |
| --- | --- | --- | --- |
| No gear (seed 3, 80 careers) | 0.84 | 6% | 47 |
| **0.5 (chosen)** | 0.76 | 10% | 48 |
| 1 (Elite +3) | 1.26 | 25% | 58 |
| No gear (seed 1, 40) | 0.80 | 10% | 40 |
| 0.5 | 0.90 | 15% | 49 |
| 1 | 1.10 | 13% | 55 |
| No gear (seed 2, 40; the suite) | 0.42 | 3% | 41 |
| 0.5 (the suite) | 0.65 | 5% | 43 |

- At +1 a level, full gear made titles half again as likely and the Hall of Fame four times as likely: broken.
- At +0.5, the three seeds give −0.08, +0.10 and +0.23 titles a career and +2 to +5 points of Hall of Fame.
  - That is a small edge, about the size of the simulator's noise with 40 careers.
  - Injuries fall from 2.6 to 2.1 a career and fatigue at tip-off from 16.5 to 14.6 (seed 2).
- Every career target holds with gear on both seeds.

| Setting | Value | What it does |
| --- | --- | --- |
| `gear.levels` | 3 | Basic, Pro, Elite |
| `gear.price` | 250, 2,500, 250,000 | the price of each level ($) |
| `gear.rating` | 0.5 | a rating piece: this much of its rating per level, in games |
| `gear.injury` | 0.1 | ankle braces: the injury chance × (1 − 0.1 × level) |
| `gear.regen` | 1 | recovery kit: this much less fatigue after a game, per level |

| Test | Result |
| --- | --- |
| Smoke | 133 of 133. The F8 step: prices and levels; no money, no gear; +rating × level in games with OVR unchanged; the recovery kit and the braces through the game-week code; the look; carried to the pros; money pays; value unchanged; the Office headband shows; an old save; the screens. |
| Modes | 13 of 13 |
| Old saves | 31 of 31 |
| Dev tools | all OK |
| Screen audit (phone, desktop) | 119 and 121 screens, none flagged (the gear shop and the Office's Gear and Looks tabs included) |
| Art Lab | 54 screenshots, no errors |
| Gate, balance | ✓ (brute force vs Pro 1.00 PPP; Legend beats Pro 78%) |
| Career simulator (the player buys gear) | seed 1: every target met (titles 0.90, Hall of Fame 15%); seed 2: every target met (0.65, 5%); seed 2 without gear: 0.42, 3% |
| Trait balance | every trait in range |

## F7 — Franchises instead of the draft; the goal is a great team (the F pass, milestone 7)

The user: "the nba team concept should be improved and team/business should be more organized to fit like retro ball";
"the goal of the game should be to get into a really good NBA team, so make sure to rework teams instead of making drafts
and all". ("Retro ball" is read as Retro Bowl: a front office with star-rated teams and a few simple tabs.)

**The league is twelve franchises, rated 1 to 5 stars.**
- The four new franchises are the Laundromat Kings, the Corner Store Comets, the Overnight Owls and the Parking Garage
  Pilots.
- Each franchise has one league player, its starter in the league's games. The standings are the franchises'.
- A franchise's stars come from its prestige rank: two 1★, two 2★, three 3★, three 4★ and two 5★ teams.
- Prestige carries over and moves with the standings. Each offseason a franchise keeps 80% of its prestige and takes
  20% from its finish, and a title adds to the finish. A franchise that moves gets a headline ("The Owls rise to 4★").
- **Stars are what you play for:**
  - training facilities (practice XP +0% at 1★–2★, +10% at 3★–4★, +20% at 5★);
  - pay (×0.85 at 1★ to ×1.25 at 5★);
  - fame per game (×0.85 to ×1.25);
  - a deeper bench (a harder depth chart to top: the bench's OVR moves 3 per star from 3★).

**No draft.** At the end of high school or college, the combine leads to PRO OFFERS: three franchises call.
- **The best team that wants you:** you compete for the start there.
- **One a star lower:** it promises you the start.
- **A rebuilding team:** it starts you and pays 10% more.
- The scouts' score (the old draft score) caps the offers' stars: 2★ teams call at 99, 3★ at 106, 4★ at 112 and 5★
  at 118. Most players start on a 1–3★ team.
- Signing day replaces draft night: the other rookies sign around the league, then your card flips to your franchise.
- The college "Draft stock" screen is now "Pro stock", with the franchises' lines on its chart.

**Moving up.** The goal is a great team, so the path there is visible everywhere.
- **Your value** is OVR + fame ÷ 15 + hype ÷ 30.
- **A franchise calls when your value reaches its bar:** 2★ 66, 3★ 71, 4★ 76, 5★ 83.
- **Free agency** (when your deal ends) brings three offers:
  - your team (your role stays);
  - the best franchise that wants you (you earn the start);
  - one a star lower that starts you.
- **A trade request** (Office → Moving up) moves you at most one star up, once every two seasons, before the deadline.
  It costs hype, and on the better team you earn the start.
- **The goal track** is shown on the hub, in the Career menu and in the Office:
  1. a 3★ team;
  2. a 5★ team ("YOU MADE IT");
  3. starting for a 5★ team;
  4. a title with a 5★ team.

  Each goal pays fame and gets a story card, a headline and a timeline entry.

**The hub is organized like a front office** (the Retro Bowl read).
- Before F7 the hub had nine links: League, Team, Player, Business, News, Trophies, Timeline, Settings and Main menu. A
  phone hid three of them.
- Now there are six:
  - **Team:** the franchise's stars and perks, the coach and the roster.
  - **League:** Standings, the new Franchises tab (each franchise's stars, starter, training, bar and "calls you" or
    "needs +N"), Leaders, Schedule and the rest.
  - **Office** (was Business): the new Moving up tab first (your value, the five bars, the trade request), then
    contract, sponsors, training, home gym, lifestyle and the shop.
  - **Career:** Player, News, Trophies and Timeline, with the goal.
  - **Settings** and **Main menu.**
- A phone shows everything but Settings (which stays on its main menu), so Trophies and Timeline are reachable there
  now.
- The hub's header shows your franchise's stars. The goal banner sits under the next game (on a phone, a one-line goal
  sits beside the last results).

**Old saves are migrated, never wiped.**
- A pro career keeps its season and gains the four franchises. The eight old clubs' players spread out so each
  franchise has one, and stars start from the old training facilities.
- Goals the franchise already meets are recorded, and their cards show on the hub.
- An amateur save at the combine or a "turn pro?" decision goes to the pro offers instead of the draft.

**The Hall of Fame threshold is recalibrated** (F6 promised this): `career.hofScore` 90 → 85.
- After F6's slower growth and F7's franchises, 90 let in 6% of 200 simulated careers across seeds 1, 2, 3 and 5.
- 85 lets in about 8% (7.5% of the 120 careers on seeds 3 and 5).

**Cut text (F4's follow-up).** Text cut short with "…" hides what it says, the same problem as overlapping text.
- The screen audit now flags it (TEXT CUT: a line cut by its width, the screen's edge or a line limit). It found 23
  desktop and 14 phone screens, all fixed. Among them:
  - the pro offers and signing day;
  - the team banner's perks and the teammates' lines (trait chips beside the name);
  - the standings and franchises (names in full: stars as "3★", no PCT column, your rival in red);
  - free agency (the role beside each offer);
  - the depth chart beside a result (the OVR under the name);
  - the news: headlines and posts wrap to two lines; a phone's BUZZ is its own tab;
  - the press answers on a phone (two lines of quote);
  - the recruiting blurbs, the national bracket (seeds in their own column), the player header, credits and the dev
    menu.
- High school's four week buttons on a desktop cut PRACTICE short. Study now sits behind Rest there too, as on a phone.

The career simulator (40 careers a seed; `--fa=stars --trade=up`: the simulated player takes the best offer and asks
for trades up):

| Settings | First team 1★/2★/3★/4★ | Reached 5★ (median age) | Titles | Trades a career | Hall of Fame |
| --- | --- | --- | --- | --- | --- |
| First: bars 64/69/74/79, fame ÷ 10, keep 0.6, no trade limit | 10/8/14/8 | 80% (26) | 0.68 | 5.9 | 8% |
| + a trade at most a star up, every 2 seasons | 15/12/10/3 | 75% (28) | 0.60 | 2.6 | 5% |
| + bars 66/71/76/83, fame ÷ 15 | 15/12/10/3 | 70% (28) | 0.78 | 2.2 | 8% |
| (bars 65/70/75/82) | 15/12/10/3 | 65% (28) | 0.53 | 2.5 | 5% |
| **+ keep 0.8 (chosen)** | 15/12/10/3 | 65% (29) | 0.80 | 2.0 | 8% |
| The same, seed 2 | 13/17/10/0 | 55% (29) | 0.42 | 1.9 | 3% |
| The same, seeds 3 and 5 (60 each) | 34/45/36/5 | 55% / 62% (28) | 0.90 / 0.77 | 1.6 / 1.8 | 7% / 7% |

- With keep 0.6, six franchises changed stars every season, so a team could fall from 5★ to 3★ in two years.
- With the chosen settings, about half the careers that reach 5★ get there by moving and half because their own team
  rose.
- The Hall of Fame column is at the old threshold, 90.

| Setting | Value | What it does |
| --- | --- | --- |
| `franchise.starsDist` | 2, 2, 3, 3, 2 | the twelve franchises by stars (1★ to 5★) |
| `franchise.keep` / `titleBoost` | 0.8 / 0.3 | prestige carried each offseason; a title's bonus to the finish |
| `franchise.bar` | 0, 66, 71, 76, 83 | the value a 1–5★ franchise wants before it calls |
| `franchise.fameDiv` / `hypeDiv` | 15 / 30 | value = OVR + fame ÷ 15 + hype ÷ 30 |
| `franchise.rookieBar` | 0, 99, 106, 112, 118 | the scouts' score a 1–5★ franchise wants out of college or high school |
| `franchise.benchStar` | 3 | a franchise's bench OVR + this per star above 3 |
| `franchise.facByStars` | 1, 1, 2, 2, 3 | training facilities (the XP bonus) by stars |
| `franchise.payByStars` | 0.85, 0.92, 1, 1.1, 1.25 | salary offers × this |
| `franchise.fameByStars` | 0.85, 0.92, 1, 1.12, 1.25 | fame gained × this |
| `franchise.rookieMore` | 0.1 | a rebuilding franchise's rookie offer pays this much more |
| `franchise.tradeUp` / `tradeGap` | 1 / 2 | a trade moves you at most this many stars up, once every this many seasons |
| `franchise.goalFame` | 3, 6, 4, 8 | fame for the four goals |
| `career.hofScore` | 90 → 85 | the legacy score for the Hall of Fame |

| Test | Result |
| --- | --- |
| Smoke | 132 of 132. The F7 step covers: the offers, the signing, one league player per franchise, the stars' spread, value and free agency, a trade, the goals, stars after six seasons, and a pre-F7 save. |
| Modes | 13 of 13 |
| Old saves | 31 of 31. The first run failed 11: the test's scripted tour looked for the free-agency buttons by their old wording. The tour was fixed; the game wasn't changed. |
| Dev tools | all OK |
| Screen audit (phone, desktop, 1000×1000) | 117, 119 and 119 screens, none flagged (overlap, cut text, off-screen, small targets) |
| Full career through the UI | passes: high school, college, the pro offers, signing day, 13 pro seasons, retirement and the Hall of Fame verdict (929 actions) |
| Art Lab | 54 screenshots, no errors |
| Gate, balance | ✓ (brute force vs Pro 1.00 PPP; Legend beats Pro 78%) |
| Career simulator | seed 1: every target met (Hall of Fame 10%, titles 0.80, 5★ reached by 65% at a median 29). Seed 2: every target met (3%, 0.42, 55%). |
| Trait balance | every trait in range |

## F6 — XP is harder to earn (the F pass, milestone 6)

The user: "xp should get harder to earn".

- **Every XP source pays 15% less** (`career.xpEarn` 0.85), so the "+N XP" numbers are smaller everywhere. This covers:
  - games (played, simulated or on the bench) and the college coach's share;
  - practice sessions and drills (the previews show the new numbers);
  - a skills camp and the AAU circuit.
- **The top steps cost more.** A rating step above 60 costs `xpTop` 5% more per 10 points (a step at 90 costs 15% more),
  so the last points before a cap take longest.
- **The climb is slower, not shorter.** The age multipliers after 21 went up (22–25: 1.15 → 1.4; 26–28: 0.65 → 0.8;
  29–31: 0.4 → 0.45; 32+: 0.2 → 0.22), so the pro years pay about what they did. The teen years pay less; the peak comes
  a little lower and later.
  - A flat 20% cut, with the old ages, dropped the peak from 78 to 74. Players develop in a loop (weaker players win less
    and sit more), so a flat cut compounds.
- The career simulator's targets moved with it: OVR at 17 53–58, at 21 64–68, at 25 70–74, peak 75–79, titles 0.4–1.0,
  Hall of Fame 3–15%.

The career simulator (40 careers each, `f6/sweep`):

| | OVR 17 / 21 / 25 | Peak | Titles | Hall of Fame |
| --- | --- | --- | --- | --- |
| Before (F5) | 56 / 68 / 75 | 78 | 1.02 | 18% |
| xpEarn 0.8, the old ages | 55 / 66 / 71 | 74 | 0.60 | 5% |
| xpEarn 0.85 + top 0.05, the old ages | 55 / 66 / 71 | 75 | 0.82 | 3% |
| **Chosen: 0.85 + 0.05 + the new ages** | 55 / 66 / 72 | 77 | 0.65 | 5% |
| The same, seed 2 | 55 / 66 / 71 | 76 | 0.40 | 0% |

The Hall of Fame gets rarer with slower growth: 0% on the second seed, under its new 3–15% target. F7's franchises
change the pro path again, and its threshold is recalibrated there.

| Setting | Value | What it does |
| --- | --- | --- |
| `career.xpEarn` | 0.85 | every XP source pays × this |
| `career.xpTop` / `xpTopFrom` | 0.05 / 60 | a step above 60 costs × (1 + 0.05 × (rating − 60) ÷ 10) |
| `career.ageXpMul` | ≤17 1.5 · ≤21 1.35 · ≤25 1.4 · ≤28 0.8 · ≤31 0.45 · older 0.22 | XP by age |

| Test | Result |
| --- | --- |
| Smoke | 131 of 131. The new F6 step checks that games, sessions and drills pay × xpEarn and that a step at 90 costs 15% more. |
| Modes | 13 of 13 |
| Old saves | 31 of 31 |
| Dev tools | all OK |
| Phone audit | no errors |
| Art Lab | no errors |
| Gate, balance | ✓ |
| Career simulator | seed 1: every target met. Seed 2: Hall of Fame 0% ✗ (above). |
| Trait balance | every trait in range (overall median legacy 46) |

## F5 — One-minute games (the F pass, milestone 5)

The user: "games shouldn't be this long, like 1 min imo".

**Every career game is now one timed minute.** This covers high school, college, the pros, the playoffs and the All-Star 1v1.
- A tie at the buzzer goes to a sudden-death overtime: the first basket wins. If nobody scores in the 30 s overtime,
  another one starts.
- Settings → Gameplay → Career game length offers 1, 2 or 3 minutes. The create screen has it too; it replaces the old
  "Pro games" choice of half length. Simulated games use the same length.
- Quick 1v1 starts on "One minute". The timed halves and first-to formats are still in its list.
- Two short games stay first-to: the high school tryout 1v1 and the depth-chart challenges (first to 7). They take
  about a minute already.
- The HUD reads "1:00 GAME" (or "GAME" when that doesn't fit) instead of "1ST HALF".

How long a game takes: AI against AI at Pro, a one-minute game runs about 70 s including dead balls, and about
100–110 s when it goes to overtime (in 12–14% of games). Before, the formats averaged 133 s (first to 15), 186 s
(first to 21) and 275 s (two 2:00 halves).

**Everything fitted to the old lengths is rescaled, so a season plays like before.** `gameScale(stage)` is this game
length over the old format's clock: high school 119 s, college 169 s, the pros 240 s.
- The league model (pro simulated games):
  - points and box-score counts × the scale;
  - a floor of round(6 × scale) points;
  - never exactly 1 point;
  - a tie becomes a one-basket overtime in which the better player keeps half their edge (`CR.otSimEdge`).
- Amateur simulated games: the winner scores about 8.4 a minute; the loser scores 35–90% of that (the old split).
- Measured per side, one-minute sim against the engine: pro 9.1 points against the model's 35.8 at the old length. The
  favourite wins 71.5% at both lengths.
- These now count per the old length:
  - XP from a stat line, and game grades;
  - fame per point and per highlight, and hype from highlights;
  - the headline and "big night" thresholds;
  - the MVP score;
  - college draft stock and the NIL trigger;
  - a season's points a game for the draft and recruiting (`ppgN` in the log);
  - the legacy's points (`careerStats.ptsN`).
- A blowout now also needs a 4-point margin (a 5–2 minute isn't one).
- "Crunch time" in a one-period game is its last quarter (at most 30 s); the "first half" is the first half of the
  clock.

**Found and fixed on the way:**
- The hidden trait only revealed itself in a season you played. A sophomore on the bench waited a year. The team's
  games now count, bench weeks too; the new random rolls exposed this in the smoke test.
- Late Bloomer starts 4 overall lower, not 5. Its median legacy was −24% of all traits' with one-minute games (−16%
  before); it is now −12%.

| Setting | Value | What it does |
| --- | --- | --- |
| `career.gameSecs` / `gameSecsOptions` | 60 / 60, 120, 180 s | a career game's single period (Settings → Gameplay) |
| `career.otSecs` | 30 s | a sudden-death overtime |
| `career.simWinPts` | 8.4 | a simulated amateur winner's points a minute (the engine's AI vs AI average) |
| `career.simRefSecs` | hs 119 · college 169 · pro 240 s | the game clock that scores like each old format |
| `career.otSimEdge` | 0.5 | a simulated pro overtime keeps half the better player's edge |
| `media.blowoutMinPts` | 4 | a blowout needs this margin too |
| `traits.crunchShare` | 0.25 | crunch time in a one-period game |
| `traits.list.latebloomer.start` | −4 (was −5) | Late Bloomer's head start |

| Test | Result |
| --- | --- |
| Smoke | 130 of 130. The new F5 step covers the format, the setting, a tie going to sudden death, simulated scores and box lines, grades per the old length, the quick-play default and the HUD. The first run failed on the trait reveal above. |
| Modes | 13 of 13, including a new one-minute quick game |
| Old saves | 31 of 31 |
| Dev tools | all OK |
| Phone audit | no errors |
| Art Lab | no errors |
| §2 gate, balance | ✓ (the engine is unchanged) |
| Career simulator (40, seed 1) | OVR 56 / 68 / 75, peak 78, titles 1.02, Hall of Fame 18%: every target met |
| Career simulator (seed 2) | titles 0.47, Hall of Fame 5%. On this seed the pre-F5 build scores 0.82 and 5%: seed noise. |
| Trait balance | every trait in range once Late Bloomer was retuned |

## F3–F4 — The lag and the overlapping text (the F pass, milestones 3 and 4)

The user: "the game lags a LOT, especially during dunking" and "text overlaps, so we can't read other stuff".

**F3: why it lagged, and what changed.**
A CPU profile of AI-vs-AI frames in the pro arena showed four causes.

1. **Every frame, both characters were repainted and re-pixelized from a 3× supersampled paint.** A high-quality 3×
   downscale, a pixel readback and four per-pixel passes made up about two thirds of a frame (44–47% was the downscale
   alone).
   - A character's sprite is now repainted 20 times a second of game time (12 at guard level 2), which is pixel-art
     animation's own rate.
   - It is repainted at once on a new move, a turn, a catch or release, or a size change.
   - In between, the last sprite rides along with the body, so movement stays smooth every frame.
   - When both players are due on the same frame they take turns, so no frame paints two.
2. **A dunk's screen shake re-baked the whole arena.** The background layers and the crowd atlases were keyed on the
   camera's vertical pixel offset, which the shake moves. On a phone every 1-pixel shake meant a 400 ms frame, twice in a
   row. The bake now ignores the shake (the baked layers already move with it).
3. **A posterizer stopped the game three ways.**
   - Slow motion: 0.35 s at 0.4×.
   - A freeze-frame poster card: 1.4 s.
   - An automatic 5-second replay.
   - Its capture also re-rendered the whole scene a second time, encoded a JPEG and wrote the entire save, all in one frame.

   Now:
   - The poster is taken from the frame already drawn.
   - The JPEG and the save wait for the final buzzer (or quitting).
   - No card freezes play (the posters show on the results screen).
   - Automatic replays are a Graphics setting, off by default. Holding Fade during a dead ball still replays the last
     highlight.
   - Slow motion is 0.2 s at 0.6×, and the hit-stops are shorter (dunk 70 → 40 ms, block 90 → 60, ankles 50 → 40).
4. **The pixel jumbotron's replay was drawn and snapped 15 times a second.** Each snap allocated two 1 MB tables. The
   tables are now reused, and the pixel jumbotron runs at 8 frames a second.

Frame times, AI against AI in the pro arena over 240 frames (`f3/prof.js`, the same machine, before and after):

| Window | Before: median / p95 (ms) | After: median / p95 (ms) |
| --- | --- | --- |
| Desktop 1280×720 | 22.1 / 32.1 | 13.7 / 24.1 |
| Phone 844×390 at 2× | 33.1 / 44.9 | 17.0 / 28.9 |
| Square 1000×1000 | 11.6 / 18.7 | 7.8 / 14.2 |

A posterizer's frame took 47–55 ms before, and was followed by a 1.4 s freeze, a 5 s replay and a 49 KB save written mid-game.
It now takes 18–25 ms, with no freeze and no replay; the save waits for the buzzer. In the 900-frame traces no frame took
over 60 ms, and the shake re-bakes (400 ms on a phone) are gone.

**F4: why text overlapped, and what changed.**
- **Menus.** All menus are one 1280×720 layout, letterboxed into the window. The bitmap font's smallest pixel size came
  from the whole window's height.
  - In any window taller than 16:9 (the claude.ai artifact panel, a square or portrait browser window), every string was
    drawn up to 1.8× too big for its layout. On a 1000×1000 retina window the smallest text was 6× instead of 3×.
  - Menus now size text from their letterboxed area. That size rounds up only past .75, so a string is never more than
    about 12% bigger than its layout (it could be 50%). A window that shrinks the menus below 7/8 may draw 1× text.
- **The match HUD.** It is laid out in CSS pixels, so its smallest text now keeps its 720p size in CSS pixels. At 1080p,
  or in a tall window, it was 1.5–3× too big for its boxes.
- **Screen-by-screen fixes the new checks found:**
  - The team roster's small OVR badges show the number alone where the two lines collided.
  - Trait chips stop before the badge.
  - The hub's LAST chips start after their label.
  - The press room's answers are taller, with the label, the effect and two lines of the quote inside them.
- **Callouts in a match:**
  - At most two at once (three stacked over the players).
  - They start at 20% of the screen height (30% before).
  - They sit a whole stamp apart (0.95 overlapped).
  - A phone shows the newest one at a time, sized by the screen's height.
- **Contest lines:** shorter; they sit on their own strip.
- **Two bugs found on the way:**
  - The practice shot chart drew even when switched off, over the tutorial's panel: its on/off setting was overwritten
    by its list of shots.
  - After the performance guard's low-resolution step resized the canvas, the touch controls lost the floor band until
    the next match. The band is now recomputed after any resize; the phone smoke test caught this once under load.

The new overlap check (every string's box from the bitmap font, on the top screen of 111 screens, and 35 HUD scenes):

| Window | Screens flagged |
| --- | --- |
| 1280×720 | 0 of 111 |
| 1000×1000 at 2× (a square artifact panel) | 0 of 111 (before: 9 with text overflowing its widget) |
| 800×1000 (portrait) | 0 of 111 |
| 1920×1080 | 0 of 111 |
| 1440×900 at 2× | 0 of 111 |
| 1280×720, text size 1.25× | 0 of 111 |
| The HUD: 7 scenes × 5 sizes | 0 of 35 |

The "before" row comes from the F1–F2 build. That build has no string recorder, so it can only show overflow, not
overlaps; the before/after sheets in `shots/f3/` show the overlaps. Also fixed: three overlaps on the Art Lab's UI kit page
(the card back's caption, a chip under a badge, a caption past its panel).

| Setting | Value | What it does |
| --- | --- | --- |
| `ART.rtPoseHz` / `rtPoseHzLow` | 20 / 12 | character repaints a second of game time (guard level 0–1 / 2+) |
| `ART.rtJumboFps` | 8 | the pixel jumbotron's replay frames a second |
| `fx.hitStop` | 40 / 60 / 40 ms | dunk / block / ankles (was 70 / 90 / 50) |
| `fx.slowMo` | 0.2 s at 0.6× | posterizers and clutch shots (was 0.35 s at 0.4×) |
| `fx.posterInPlay` | false | a poster card no longer freezes the game |
| `settings.autoReplay` | false | automatic replays of posterizers and buzzer beaters |
| `ui.kBias` | 0.25 | the menus' pixel size rounds up only past .75 |
| `fx.calloutMax` / `calloutY` / `calloutGap` / `calloutShortH` | 2 / 0.2 / 1.12 / 520 px | callouts at once, where they start, their spacing, the short-screen rule |

| Test | Result |
| --- | --- |
| Smoke | 129 of 129 (one check failed on the first run: the retro check saw no sprites, because a reused sprite skipped the audit list. Fixed and rerun.) |
| Modes | 12 of 12 |
| Old saves | 31 of 31 |
| Dev tools | all OK |
| Phone audit | no errors |
| Art Lab | 54 shots, no errors (looked at: the retro checks pass, 400 sprites scanned, 0 gaps, at most 23 colors) |
| Screen and HUD audits | above |
| §2 gate | brute force vs Pro 1.00 PPP (≤ 1.30 ✓); reads beat brute force 1.72 ✓ |
| Balance | Legend beats Pro 78% (75–95% ✓) |
| Career simulator (40) | unchanged from F1: OVR 56 / 69 / 74, peak 79, titles 0.78. Hall of Fame 8%, which misses its 10–20% target, as it did before. |
| Trait balance | every trait in range |

## F1–F2 — Extras removed; practice and the 3-point contest fixed (the F pass, milestones 1 and 2)

The F pass answers the user's playtest notes on the R10 build (the full list and plan are in `PLAN.md`). These two
milestones cover "remove extras" and "the 3-point contest and even practice let you score a layup or any other
non-three; the rebound should come back to you without going to get it".

**F1: the Extras menu is gone.**
- The main menu's **Practice** replaces Extras. Practice holds shooting practice, the 3-Point Contest and the tutorial;
  nothing in it counts for a career.
- The classic team league (5v5/3v3) and the street tournament are gone from the game, with their code (the two team-league
  parts and `CONFIG.teamCareer`).
  - A save that has a team league keeps its data exactly as it was: nothing is wiped, it just isn't playable.
  - An old v2 career still becomes that save's team-league data, and its player still prefills a new career's name.
- The credits are a **Credits** button in Settings.
- The Art Lab is in the dev menu (the \` key) and at `index.html?artlab`.
- Power-ups (the L9 arcade extras) are now a single Gameplay toggle, **Power-ups in Quick 1v1**, off by default.
  - Every older save starts with them off once (`settings.extrasF1`); turning them back on sticks.
  - They were never in the career (R4) and never in practice.
- The create screen's "Face shape & extras" is now "Face shape & accessories".

**F2: the contest and practice.**
- The 3-Point Contest, the career's 60-second SHOOTOUT drill, the high-school tryout shootout and the All-Star contest
  share one piece of code. Before, you could walk off the rack, grab the loose ball and lay it up for points.
- Now the shooter walks rack to rack on their own and Shoot is the only button (no drives, dribble moves, fades or jumps).
- Only a jumper from beyond the arc at the rack counts.
- The loose ball can't be caught; the next ball is in your hands 0.35 s after the last one lands, in or out.
- A computer playing the contest (the tests' fast-forward) takes rack jumpers too; its brain had kept trying to drive.
- The contest's HUD lines sit on a dark strip clear of the arena's banners. Its key hints and phone buttons show Shoot only,
  and its start screen has the rules under the title.
- Practice passes every rebound back.
  - The ball loops from where it is to your hands (a kinematic pass nothing can touch) 0.45 s after a make, 0.5 s after
    a miss lands, or 0.3 s after a loose ball settles.
  - The defender dummy passes its rebounds back too.
  - In a probe, the ball came back 16 times in 40 s without the shooter moving.

| Setting | Value | What it does |
| --- | --- | --- |
| `contest3.showResultS` | 0.35 s | the next ball waits this long after the last one lands |
| `contest3.threesOnly` | true | rack jumpers only; no catches; auto-walk between racks |
| `contest3.walkSpeed` | 0.5 m | the gap at which the shooter walks to the next rack at full stick |
| `contest3.botSigma` | 0.06 s | a computer shooter's release spread |
| `rebounder.afterMakeS` / `afterMissS` / `looseS` | 0.45 / 0.5 / 0.3 s | the waits before the pass back |
| `rebounder.flightS` / `arcM` | 0.55 s / 1.1 m | the pass back's time and loop |
| `rebounder.dummyHoldS` | 0.3 s | the dummy holds a rebound this long |

**Tests** (the F1 build):

| Test | Result |
| --- | --- |
| Smoke, desktop and phone | 127/127 |
| Modes | 12/12: the street tournament and the two team-league games are gone; the career's tryout shootout and All-Star contest run under the new contest rules |
| Old saves | 31/31: a team-league save keeps its data |
| Dev tools | all OK |
| Phone audit | 109 screens, nothing flagged |
| Art Lab | 54 screenshots, no errors; the Retro check passes |
| Gate | Pro mirror 1.18 PPP, Legend beats Pro 83%, brute 1.00 |
| Balance harness | brute 1.24, Legend beats Pro 78% |
| Career simulator (40) | the R10 numbers: nothing it simulates changed |
| Trait balance | every trait in range |

The new smoke steps:
- **F1:** no Extras. The Practice menu has shooting practice, the contest and the tutorial, and no team league,
  tournament or Art Lab. Settings → Credits works. The dev menu → Art Lab works. The removed screens aren't in the build.
- **F2:** a shooter who pushes toward the hoop every frame never gets inside the arc. All 25 balls are rack jumpers, and a
  layup never scores. In practice, the ball comes back at least 8 times in 30 s without the shooter moving.
- **Power-ups:** off by default; on, Quick 1v1 gets them; the one-time migration of old saves is checked.

An intermittent failure of the phone touch-layout step during development led to a real bug, fixed in F3–F4.

## The R pass (R1–R10): the report

The spec "Hoop Heads: retro look + real career", in ten milestones with a commit each. During R2 the user changed
the plan (it overrides §3.3 and anything else about team games or extras): the career is 1v1 only — every career game,
playoffs and tournaments and the All-Star game included — with no AI teammates on the court and no arcade extras in
the career, ever. Teams are your organization and story (a school, a college program, a pro franchise: name, colors,
uniform, coach, teammates in the story and in practice); the team's record and titles are your 1v1 record and titles;
a depth-chart ladder of 1v1 practice challenges decides who plays; coach trust gives practice XP and stronger
recruiting and draft recommendations; no chemistry. Everything else in the spec stayed. Before every commit: the smoke
test on desktop and phone, the Art Lab screenshots (looked at), old saves migrated (never wiped), and the whole suite:
the §2 gate, the balance harness, the career simulator and the rest. The before/after gallery is
`shots/before-after-r/` (27 captioned pairs, L19 against R10); every screen of the final build, desktop and phone, is in
`shots/final/`.

### What each milestone measured

| Milestone | Measured | Before → after | Spec |
| --- | --- | --- | --- |
| R1 Retro look | two styles on one screen → one 360-row pixel world; the Retro check: smoothed draws, glyph draws off a whole scale, gaps in a character's outline, colors in one sprite | 0 · 0 of 96 · 0 in 400 sprites · 23 (limit 24) | §1 ✓ |
| R2 Size and framing | a 2 m player ÷ court length; ÷ screen height; head width (desktop) | 1/9 → 1/6.82 · about 14% → 23.3% · about 32 → 45 world px | ≈ 1/7 · 23–25% · 44–52 ✓ |
| R2 (the gate after the retune) | Pro mirror PPP · Legend beats Pro · brute · sniper | 1.21 → 1.18 · 86% → 83% · 0.82 → 1.00 · 1.47 → 1.72 | 0.95–1.25 · brute ≤ 1.3 ✓ |
| R3 Career foundation | trait balance (median legacy against all, 200 careers a trait): Generational | +92% → +31%; all 17 in range | C/U/R ±20%, L −20…+40% ✓ |
| R4 The depth chart | the ladder's first version → the one shipped (100 careers): peak OVR · titles · Hall of Fame | 65 · 0.47 · 2% → 77 · 1.07 · 15% | the career targets ✓ |
| R5 High school | freshmen on varsity; summers' legacy median (AAU / rest / job) | 55%; 65 / 61 / 44 → 59 / 61 / 55 | §3.4 ✓ |
| R6 College | seasons ending in the national tournament; NIL; median mock pick | 7% → 27%; 3.8 offers, 2.4 taken, $15,750; #39 | §3.5 ✓ |
| R7 Pros and money | a careful spender: titles · Hall of Fame; net worth | 1.6 · 28% → 1.02 · 14%; $217M against $232M for buying nothing | the career targets ✓ |
| R8 Hype and press | "always X" press test, titles (1,000 careers); hype chase vs quiet (legacy · earned · titles) | +1.3 / +2.5 / −2.2 / −1.5%; +0.5 / +2.2 / −2.2% | ±8% · ±10% ✓ |
| R9 Story | beats a season | 3.27; 3–5 in 99.6% and 99.7% of the seasons | 3–5 |
| R10 Polish and QA | every screen at 1280×720 and 844×390, at 1× and 1.25× text; a whole career through the screens | 126 + 124 screens, nothing flagged; title → Hall of Fame on desktop and phone | §4 ✓ |

### Tests on the final build (R10)

| Test | Result |
| --- | --- |
| Syntax (`tests/check-syntax.js`) | ok |
| Smoke: the game through the UI at 1280×720 and 844×390 | 128/128 |
| Modes: every mode played to its end | 15/15 |
| Old saves: every fixture, from the first 1v1 career to the R8 build, reloaded and played on | 31/31 |
| Dev tools | all OK (1,000 balls, 0 tunneled) |
| Every screen at 844×390: 64 px targets, off-screen, overlapping or unlaid widgets, labels off their buttons, errors | 124 screens, nothing flagged; the same at 1.25× text |
| Every screen at 1280×720 | 126 screens, nothing flagged; the same at 1.25× text |
| A whole career through the screens (new) | desktop: 984 actions, a real match in high school, college and the pros, retired after 13 pro seasons at 35, on the Hall of Fame list; phone: the same, passed |
| Art Lab | 54 screenshots, no errors; the Retro check's automated checks all pass |
| §2 gate (300 mirror games, 200 Legend-vs-Pro games) | Pro mirror 1.18 PPP (0.95–1.25 ✓), team A 48% (45–55% ✓), Legend beats Pro 83% (75–95% ✓), brute vs Pro 1.00 (≤ 1.30 ✓), sniper 1.72 (timing beats brute force ✓) |
| Balance harness (Classic) | brute vs Pro 1.24 (≤ 1.30 ✓), perfect timing 2.12, Legend beats Pro 78% (75–95% ✓) |
| Career simulator, 40 careers (seed 1) | 0 stuck; OVR 56 / 69 / 74 at 17 / 21 / 25, peak 79; 0.78 titles; Hall of Fame 8% (✗: 3 of 40, the target's 10% is 4) |
| Career simulator, 200 careers | seed 1: every target met (OVR 56 / 68 / 74, peak 76, 1.14 titles, Hall of Fame 16%); seed 2: OVR@25 73 ✗ (0.88 titles, Hall of Fame 13%); 0 stuck; 3.27 story beats a season |
| Trait balance (200 careers a trait) | all 17 in range (Generational +20%, Paint Protector +14%, Late Bloomer −16%) |
| Press test (200 careers a policy, seed 1) | Team first, Confident and No comment in range; Trash talk titles −8.8% ✗ (its legacy −2.5%, earnings +0.5%). These are R9's careers exactly; there seeds 2 and 3 and 1,000 careers were all in range |
| Hype test (200 careers, seed 1) | in range: legacy +0.1%, earnings +1.4%, titles −2.1% |
| Perf (844×390 at 2×, pro arena, headless) | frame guard off: median 23.7 ms, p95 33.2; its last step: 12.4 ms |

The gate, the harness, the career simulator and trait balance give R9's numbers line for line: R10 changed nothing
the simulations run.

### Deviations from the spec, and why

1. **The change of plan** (the user's, during R2). §3.3's team games were not built: no 3v3 default or 5v5 setting, no
   player-lock with AI teammates, no calling for the ball, no roles by minutes and usage, no chemistry. The compact
   court's 3v3 layout (with its ±2 m camera follow) was built in R2 and taken out; milestone 4 became the depth chart.
   Team first builds your coach's trust instead of chemistry, and trash talk has no chemistry cost. The spec's "summer
   1v1 circuit each offseason" was part of §3.3: high school summers keep the AAU circuit; a pro offseason has none.
   The Settings option that put arcade extras in career games is gone. The tutorial's "team play" became the depth
   chart's first-time tip. Traits whose downside only made sense in team games were given 1v1 ones (Floor General,
   Glue Guy, Showman: R3).
2. **§1.2 supersampling**: characters are painted at 3× before `pixelize()` (the spec: 2×, faces 3×). A character's face
   is part of its sprite, so one 3× paint covers both (`ART.rtSuper`); fans and props use 2×.
3. **§1.2 head size on a phone**: 45 world px on a desktop, but 51–66 px on the phone test (844×390 at 2×). A phone draws
   a 390-row world at k 2 instead of 360 rows; the spec's number is for the desktop view.
4. **§2 screen share**: a 2 m player's body is 23.3% of the screen height, but the big heads make the drawn figure
   25–28%. The court's framing (`h` 0.70, not "about 0.66") is where Legend still beats Pro 83% (at 0.66: 71%).
5. **R7 money**: a personal trainer adds practice XP only (the spec says XP) and all pro XP is ×0.85: a careful spender
   won 1.6 titles with a 28% Hall of Fame before, against the targets' "about 1" and 10–20%.
6. **The career simulator's edges**: OVR at 25 is 73 on seed 2 (target 74–78) in R7 to R10, and R9's 40-career run
   has a Hall of Fame of 8% (3 of 40; the target's 10% is 4). The 200-career runs on seed 1 meet every target.
7. **The balance tests at the spec's size**: 200 careers move a titles average about ±8% on its own. One seed out of
   three fell just outside twice (R8 seed 3: Trash talk titles −9.7%; R9 seed 1: −8.8%); 1,000 careers put every
   answer in range both times.
8. **Story beats**: 3 to 5 a season in 99.6–99.7% of seasons; the rest have 6 or 7 because some beats are always told
   (an injury call, a title, draft night, the first contract, the tour question, the rival's moments).
9. **Perf**: R2 left "repainting the characters less often" for R10, and it wasn't done. The headless frame median at
   844×390 at 2× in the pro arena is about 24 ms (a 16.7 ms budget; headless Chromium draws the canvas on the CPU,
   so it isn't a phone measurement). The frame guard sheds cost step by step when frames run slow.
10. **Credits**: the Credits screen names the repository's owner, yayayoupok-tech, as the maker. Change it in
    `CREDITS` (148_ui_polish part) if that isn't right.

### Known issues

- State titles and national titles are rare in the career simulator (it plays games from OVR; a player well above the
  level wins state, an average one rarely): 0 state titles and 0 national titles in the 40-career runs.
- On a phone, a select row's small label (above its big value) is about 12 CSS px.
- The recruiting card's RIVAL WANTS THIS SPOT chip sits tight under the card's last line.
- The old 3-point contest screen (`allStarScreen`) is no longer opened by anything since R7's All-Star weekend.
- Perf as above; nothing was measured on a real phone.

## R10 — Polish and QA: settings in five tabs, your own keys, three save slots, first-time tips, real game lengths (the R pass, milestone 10)

**Polish (§4)**

- **Settings in five tabs**: Graphics (the graphics mode, the camera, screen shake, FPS), Audio (three volumes),
  Controls (keys A, B or Custom and Remap keys…, the touch controls' size, opacity and left-handed layout), Gameplay
  (difficulty, adaptive difficulty, charges, the career's court, career injuries, the shot meter, arcade extras,
  first-time tips) and Accessibility (text size 1× or 1.25×, reduce motion, colorblind-safe jerseys). On a desktop the
  panel on the right says what the setting under the cursor does; on a phone each tab is a page of 64 px rows (the key
  settings are for keyboards, so a phone doesn't show them).
- **Your own keys**: pick an action and press its key. A key that belongs to another action swaps with it; Esc cancels
  (it always pauses a game and backs out of menus, and the menus keep the arrows, WASD, Enter and Space). Reset to A or
  B. Your keys are the Custom set; the match hints and the tutorial name them.
- **Text size 1.25×**: menus, the career and the match HUD draw their text 1.25× bigger; a line that doesn't fit wraps
  or shrinks. Every screen was checked at 1.25× at both sizes (below).
- **Three save slots**: slot 1 is the save you already have (same key: nothing moves), slots 2 and 3 are new. Save slots
  (main menu) shows each slot's player, where they are, their Hall of Fame count and when you last played, with START
  HERE, CONTINUE, PLAY and Erase (confirmed). Your settings follow you from slot to slot. Settings → Erase this save slot
  replaces Reset all save data and keeps your settings. A save that can't be read is set aside (under `.corrupt`), not
  deleted.
- **A boot splash**: a pixel ball bounces in and the logo lands (1.8 s, 0.8 s with Reduce Motion); any key or tap skips
  it. **Credits** are in Extras.
- **Sounds**: a win and a loss sound different at the final whistle (four notes up; three steps down and a long low
  note), and a simulated game's result plays them too; a tick when the mouse moves to another button; Back and No make
  the back sound.
- **Colorblind-safe jerseys in every two-sided game**: pro career games, the All-Star 1v1 and practice challenges
  ignored the setting. It's applied once, when any match starts: solid blue against gold stripes.
- **Onboarding**: a new tutorial step for the picked-up dribble (after a fake: pivot, then shoot or fade; a dribble move
  is a double dribble, walking is a travel); How to play has a Violations tip (travel, double dribble, held ball).
  **First-time tips**: one short card the first time you reach each part of the career (your week, the depth chart,
  recruiting, summers, college, draft stock, the transfer portal, NIL, the pros, business, contracts, the press room,
  hype, story choices), with Got it or Turn tips off. Settings → Gameplay turns them back on, and the ones you haven't
  seen come back. (The career is 1v1, so the tutorial's "team play" is the depth chart's tip.)
- **Real game lengths**: `CONFIG.dev.gameSeconds` is back to 0. Every match plays its real format again (the 24-second
  development games of R1–R9 are gone).

**Fixed**

- With a career loaded, the phone main menu ran its new Save slots button off the bottom: the credits moved to Extras
  and the grid moved up 14 px with 6 px gaps.
- The Film Room's list of the opponent's moves ran into THE PLAN column on a phone.
- The press room at 1.25× text: a quote's second line spilled out of its button (one line at 1.25×).
- The 3-point contest's results screen threw if it drew before the contest had scores.

**QA (§4)**

- **Every screen at both sizes**: the audit (`tests/phoneaudit.js`) now opens 126 screens at 1280×720 and
  124 at 844×390 (new: the title, the five settings tabs, key remapping (desktop), save slots, credits, the splash,
  a tip, the tryout's result card, the Film Room, the All-Star 1v1's and the 3-point contest's results, the dev menu
  (desktop)). It checks tap targets under 64 px (phone), widgets off the screen, overlapping or never laid out, and
  labels running off their buttons, and fails on any error. It saved a screenshot of every screen: `shots/final/desktop`
  and `shots/final/phone`. `--text125` runs the same screens at 1.25× text. Not in it: the Art Lab (`tests/artlab.js`
  covers it) and the old 3-point contest screen that nothing opens since the All-Star weekend (R7) replaced it.
- **A whole career through the screens** (`tests/fullcareer.js`, new): title, create, tryouts, four high school
  seasons, college, the combine, the draft, pro seasons to retirement, the epilogue and the Hall of Fame, with one real
  match at each level and every story card, press question and choice answered on screen; desktop and phone.
- 40 simulated careers: 0 stuck (and 400 more in the 200-career runs in the report above).

**New constants**: `CONFIG.polish` (splashS 1.8, splashReduceS 0.8); `CONFIG.save.slots` 3 and `slotKey`
'hoopheads.slot'; `CONFIG.dev.gameSeconds` 24 → 0 (the release).

**Tests on the committed build**

The table in the report above (every test on this build). New in R10: the whole-career test on desktop and phone,
the audit at 1.25× text, and the audit's check for widgets that were never laid out.

## R9 — Story: arcs from templated beats, RPG dialogue boxes and a social feed (the R pass, milestone 9)

Every game is still 1v1 (the change of plan): the story is about you, told by the people around you (your coach, the
oldest teammate on your roster, your family, your rival, your agent) and it only ever talks about your games.

**Story arcs** (§3.10: templated beats from traits, your rival, your team, hype and results)

- **Your family**: one parent who has been at every game since the driveway, with a name and a look like yours (never a
  gendered word). They are in the stands for your first game at each level, call after a winning run of 4 ("come home for
  a day?"), check in when a season is quiet, find you in the confetti after a title and are there on draft night.
- **A mentor**: the oldest teammate on your roster (a senior; in the pros the veteran). They introduce themselves at the start of
  a season ("stay after practice this week, or don't"; once for each mentor), step in after 3 losses in a row, and run a film session.
- **Your coach**: the office talk (extra defensive drills, or save your legs), the title chase with two games left when
  you're in the playoff places, and the season review.
- **Your rival**: the existing rival moments (the first meeting, the finals rematch) count as the season's beats.
- **Your traits**: once at each level (high school, college, the pros) the person who would notice says so: the coach
  about a Gym Rat or a Glue Guy, the trainer about a Freak Athlete, a reporter about a Showman. Each line also hints at
  the trait's cost. The hidden trait takes part once it has shown itself.
- **Hype**: the first time a season your hype reaches 60 (where defenses start keying on you), a reporter (in the pros,
  your agent) says everybody wants ten minutes with you. Say yes: hype +5, practice XP −10% that week. Stay in the gym:
  hype −5, practice XP +5%.
- **An injury comeback**: an injury of 2 games or more brings the trainer's call: push to come back a game early (the
  injury chance × 1.5 for 4 game weeks) or take all the time (fatigue −25). Your first game back is its own beat (the
  comeback, or back on the floor).
- **Draft-day drama**: draft night is told against the mock draft: a slide of 10 picks or more, a rise of 10 or more,
  right where they said, or undrafted.
- **The first contract**: pay off your family's bills ($250K, confidence +1) or put it in the bank.
- **The title chase and the title**: two games left while in the playoff places; the title; a lost final.
- **A retirement tour**: from 34, every pro season starts with your agent's question, "is this the last one?" Announce a
  farewell tour (hype +15 now and +1.5 in every road game, the first of them told as a tribute; you retire after the
  season) or keep it quiet.

**The director**: 3 to 5 beats a season. At most one beat every 2 games; a season 60% through with fewer than two beats
gets a check-in, the last games top it up to three, and a season that ends short gets the coach's season review. Five is
the cap, except for the beats that are always told (an injury call, a title, draft night, the first contract, the tour
question and the rival's moments). The story never rolls the career's dice: names, looks, lines and likes come from hashes
of the career's seed, so a story beat never changes a simulated result.

**Choices** (the trade-off rule: both answers cost something, and each says what on its button)

| Beat | One answer | The other (the default) |
| --- | --- | --- |
| The mentor, the coach's office | Extra work: practice XP +15% this week, fatigue +8 | Rest the legs: fatigue −8, no extra work |
| A winning run, a call from home | A day at home: confidence +1, practice XP −10% this week | Stay and grind: practice XP +5% |
| The slump | Extra work with your mentor (as above) | A day at home (as above) |
| The spotlight (60 hype) | Say yes to it all: hype +5, practice XP −10% | Stay in the gym: hype −5, practice XP +5% |
| The injury call | Push to come back: a game sooner, injury chance × 1.5 for 4 weeks | Take all the time: fatigue −25 |
| The first contract | Pay off the bills: −$250K, confidence +1 | Put it in the bank |
| One more season? | A farewell tour: hype +15, tributes, you retire after it | Keep it quiet |

A card you leave without answering (Back, or the career simulator) takes the default.

**RPG dialogue boxes**: every story card is now told in one: the speaker's pixel portrait in a frame in their team's
colors, a name plate (a surname with the role under it: COACH, TEAMMATE, FAMILY, RIVAL; "Your agent" as it is), the card's
title, and its lines two or three at a time. The text types itself out (90 characters a second; Reduce Motion shows it at
once); a tap, Enter or A finishes the page, ▼ turns it; the answers appear once the last page is typed (a tap meant to
skip the text can't pick one), and after a choice the box shows what it did. The high school, college and pro story
cards (tryout results, grades, recruiting, the coach's words, the trade request, the shoe deal, lifestyle and more) all
use it; the ones with a speaker got one. Desktop: a 1200×320 box at the bottom of the screen with the two answers side by side; phone: a 1220×520 box with the
answers stacked full width (so each note fits on a line or two at a readable size).

**The social feed**: THE DAILY DRIBBLE has a SOCIAL tab next to the headlines: fictional posts (@handles, likes that grow
with your hype and fame) reacting to your games (a win, a loss, an upset, a big night, a title), your highlights, your
press answers (trash talk gets the most), your college commitment, NIL deals, trades, contract signings, All-Star nods
and awards. The last 60 are kept.

**Bugs fixed**

- **A zoomed-in UI after the Rest-or-Study chooser** (the desktop audit's screenshots from that screen on showed the
  top-left quarter of every screen, at 1.6× and growing; R8's desktop audit had it too): the chooser only laid out its
  buttons on a phone, so on a desktop they were 0×0; drawing a 0×0 button asked the canvas for a negative corner radius,
  which throws, and the widget's error guard swallowed the throw with the button's canvas state (and its scale) still
  pushed. Every frame pushed another. Now: rounded rectangles clamp the radius; the chooser has a desktop row; every frame
  starts from the base transform; a draw that throws resets the canvas on the next frame and is recorded (the tests fail
  on it: none do); the phone audit flags a widget that was never laid out.
- The dialogue box's typewriter never ran: a mid-line comment had swallowed its update function. The comment lint now
  also catches a swallowed method or a `+=`.
- The trade request said "the Sprinkler Park Sharks's games" (now "the Sharks' games" for a name ending in s).
- THE DAILY DRIBBLE's Back button ran under the key hint in the corner (desktop); the amateur hub's player card cut off
  "Still growing · hype N" (now "Growing · hype N"); a tour choice's note didn't fit on a desktop button (now 3 lines).
- `CONFIG.media.pressGap`'s comment still said every final gets a question (since R8 a pro final's comes with its
  clincher).

**Saves**: nothing to migrate by hand: the arcs, your family, the social feed, a practice week's story bonus, a rushed
return and a farewell tour are filled in the first time the story needs them. New fixtures from the R8 build
(`tests/fixtures/save_r8_*`): a high school career with a story card from before dialogue boxes waiting on the hub (no
speaker: it is told as yours), and a pro with a trade request waiting (it opens as a dialogue box with its two answers).

**New constants** (`CONFIG.story`, each with a one-line comment): beatsMin 3, beatsMax 5, fillAt 0.6, beatGap 2,
slumpLosses 3, runWins 4, injuryGames 2, rushInjury 1.5, rushWeeks 4, rehabFatigue 25, extraXp 0.15, extraFatigue 8,
restFatigue 8, homeConf 1, homeXp 0.1, grindXp 0.05, traitAt 0.4, spotHype 5, spotXp 0.1, billsPro 250000, billsConf 1,
tourAge 34, tourHype 15, tourRoadHype 1.5, socialMax 60, likesBase 40.

**Tests on the committed build**

- Smoke 120/120 (desktop 1280×720 and phone 844×390). New: the story step (the beats; the family, a named parent with
  no gendered word, and the mentor, the oldest teammate; the injury call and what each answer costs; a practice week from
  a choice, spent by the next game; draft night and the first contract always told; the farewell tour; the spotlight at
  60 hype and a trait's beat once a level; the cap of 5; a quiet season topped up to 3; the social feed; an old save
  filling in; the story never touching the career's dice), the story screens step (a dialogue box in pages, a choice
  and what it did, Back taking the default, the SOCIAL tab), and two R8-build migrations.
- Modes 15/15 · old saves 31/31 (2 new, from the R8 build) · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 111 screens at 844×390 (6 new: a choice card, its answer, a card in pages, the social feed, a pro's
  tour question and its choice page): nothing flagged, no errors. The same 111 at 1280×720: nothing flagged, no errors.
  This is where the zoom bug turned up; the audit now also flags a widget that was never laid out.
- Art Lab: 54 shots, no errors (`shots/r9/round-final/`). Screenshots of the new screens, desktop and phone: `shots/r9/`.
- §2 gate and the balance harness: identical to R8 line for line.
- The career simulator, 40 careers (seed 1): 0 stuck; OVR 56 / 69 / 74 at 17 / 21 / 25, peak 79; 0.78 titles a
  career; Hall of Fame 8% (✗: 3 of 40 careers, the target's 10% is 4). At 200 careers: seed 1 OVR 56 / 68 / 74, 1.14
  titles, Hall of Fame 16%, every target met; seed 2 OVR@25 73 (✗ at the edge, as in R7 and R8), 0.88 titles, Hall of
  Fame 13%. The story: 3.27 beats a season; 3 to 5 in 99.6% and 99.7% of the seasons, none under 3, 16 and 13 seasons
  over 5 (an injury call, a title or draft night on top of a full season); about 45 choices a career.
- Trait balance (200 careers per trait, seed 1): all 17 in range (Generational +20%, Paint Protector +14%, Late Bloomer
  −16%).
- R8's two balance tests on this build. Press, 200 careers: seed 1 Trash talk's titles −8.8% (✗; its legacy −2.5% and
  earnings +0.5%), seeds 2 and 3 all four in range; 1,000 careers (seed 1): all four in range (Trash talk's titles
  −4.6%). As in R8, 200 careers move a titles average about ±8% on its own. Hype, 200 careers (seed 1): in range (legacy
  +0.1%, earnings +1.4%, titles −2.1%).
- Perf, 844×390 @2x in the pro arena: guard 0 median 24.7 ms, 24.0 on a rerun; the R8 build back to back: 25.0 ms
  (R8's report: 23.3). No change beyond the machine's own spread.

## R8 — Hype and the press room: hype 0–100 with real costs, four answers, and both balance tests (the R pass, milestone 8)

Every game is still 1v1 (the change of plan): hype follows you, not a team, and Team first is about your coach and the
teammates you practice with (there is no chemistry to build).

**Hype** (§3.8)

- Hype runs from 0 to 100 (0 to 10 before; old saves' hype × 10). A game week without a big performance loses 10% of the
  hype it started with. A win adds 1; a big performance adds 2.5 and skips the decay (a win that makes the news: a big
  night — in the pros 1.2 × your average and at least 35 points —, a blowout, an upset, your rival, a playoff game, a
  title, a points record, a marquee or rivalry game). Highlights add 0.6 each (a Showman's count × 1.5). A week on the
  bench is a week without a big performance. Half of it carries into the next season.
- What it lifts: sponsors' offers × (1 + hype/100) (college NIL deals the same); the draft score + 4 × hype/100 (it
  added the whole 0–10 hype: up to 10); the college offer score + 0.05 × hype; the All-Star fan vote + 0.1 × hype; the
  next contract + $10K a point; and at home the crowd: +2% × hype/100 on every shot you take.
- What it costs, more as it grows: every loss now costs confidence, 0.5 (+1 after a blowout) × (1 + hype/100) (before,
  only blowouts did); from 60 defenses key on you (their AI +0.2 tier); from 70 the media eats practice time (practice
  XP −15%) and your rival is fired up (+2 on every rating when you meet). Generational's spotlight is the same thing,
  always on; the two never stack.
- The signature shoe line (R7) still opens at 60: now that means real hype.
- Where you see it: hype on the hub's player card; THE DAILY DRIBBLE's BUZZ panel lists what your hype is doing for and
  to you right now (the meter marks 60 and 70), the opponents coming for you and a sponsor pulling back; on a phone it is
  a BUZZ line at the bottom of the paper.

**The press room** (§3.9: four answers, none best)

- **Team first**: coach trust +2, hype −2. **Confident**: hype +3, confidence +1; lose the next game and it's hype −2,
  confidence −2. **Trash talk**: hype +5; your next game against that player they come for you (a played game: their AI
  +0.3 tier; a simulated one: +2 effective overall); coach trust −3; a 20% chance of a fine (pros: 2% of a season's
  salary; amateurs: $100 of their savings) and a sponsor pulling back (endorsement or NIL money −10% for 4 game weeks).
  **No comment**: practice XP +5% that week, hype −1, and the reporters call you boring. The old Humble answer is Team
  first.
- Every answer shows what it does on its button; the newspaper that follows lists what happened.
- A trash-talked player stays fired up until you play them, the playoffs start (the season's last game included) or the
  season ends; one you trash-talk during a playoff series is fired up for the rest of it.
- The pro final's question comes with the clincher (champion or eliminated) instead of after game 1; in the middle of a
  series only after an upset or a big night.

**What a tier and a crowd are worth in a simulated game** (measured, not guessed)

800 engine games a condition (bot vs bot, mirrored players, the same seeds; first to 21 and timed halves). Side B's AI
+0.3 tier cost side A 7.1 points of win rate (first to 21) and 10.0 (timed); +2 on every rating for B cost 7.1 and 5.6,
+5 cost 10.1 and 15.4; +2% on every one of A's shots gained 6.2 and 3.1. So an AI tier is worth about 9 OVR (+0.3 tier
≈ 2.8) and the home crowd at 100 hype about 1.5 OVR: simulated games count them that way (`tierOvr`, `hypeHomeOvr`).
§3.9's two trash-talk numbers fit the measurement: their AI +0.3 tier in a played game, +2 effective overall in a
simulated one.

**Balance**

The press test (§3.9: each "always X" policy, 200 careers each, the same careers; average legacy, career earnings and
pro titles within ±8% of the four policies' average), seed 1, the committed build:

| Always… | Legacy | Earned | Pro titles | Hall of Fame | Pro hype (mean) |
| --- | --- | --- | --- | --- | --- |
| Team first | 58.7 (−1.4%) | $259.0M (−0.8%) | 1.03 (−3.4%) | 17% | 14.7 |
| Confident | 60.8 (+2.1%) | $264.4M (+1.2%) | 1.13 (+5.5%) | 17% | 22.5 |
| Trash talk | 59.2 (−0.5%) | $263.3M (+0.8%) | 1.06 (−1.1%) | 16% | 28.3 |
| No comment | 59.4 (−0.2%) | $257.9M (−1.2%) | 1.06 (−1.1%) | 17% | 16.7 |

All four in range. Seed 2: all four in range too. Seed 3: Trash talk's titles −9.7% (✗; legacy −2.7%, earnings +0.8%). With
200 careers a policy the titles average moves about ±8% on its own (a career wins 0 to 10 titles), so I ran the same test
with 1,000 careers a policy (seed 1): Team first +1.3%, Confident +2.5%, Trash talk −2.2%, No comment −1.5% in titles,
every legacy within ±1.5% and every earnings figure within ±1%.

The hype test (§3.8: chase hype — trash talk after a win, Confident after a loss — against stay quiet — No comment after a
win, Team first after a loss; 200 careers each; legacy, earnings and titles within ±10% of each other):

| Seed | Legacy | Earned | Pro titles | Pro hype chase / quiet |
| --- | --- | --- | --- | --- |
| 1 | 58.5 vs 59.4 (−1.4%) | $264.2M vs $258.4M (+2.3%) | 1.01 vs 1.08 (−6.7%) | 26.4 / 16.1 |
| 2 | 61.6 vs 61.8 (−0.3%) | $270.6M vs $265.0M (+2.1%) | 1.13 vs 1.22 (−7.7%) | |
| 3 | 61.9 vs 61.5 (+0.7%) | $270.8M vs $264.8M (+2.3%) | 1.14 vs 1.19 (−4.3%) | |
| 1 (1,000 careers) | 59.6 vs 59.3 (+0.5%) | $263.5M vs $257.7M (+2.2%) | 1.05 vs 1.08 (−2.2%) | 26.3 / 16.3 |

In range on every seed: chasing hype earns a little more and wins a few fewer titles.

How it got there: (1) with a big performance worth 4 hype and a highlight 0.8, "always trash talk" spent a tenth of its
pro games at 60+ (keyed on) and won 12% fewer titles than the other answers: now 2.5 and 0.6, and 60+ is a star's (or
a hype chaser's) state. (2) A grudge from the regular season came due in the playoffs, where titles are decided: the
playoffs now start clean. (3) Trash talk's fine rolled the career's own dice, so a trash-talking career drifted away from
the same career answered any other way (the tests compare the same careers): the fine has its own dice. (4) The career
simulator never accepted a sponsor deal, so hype's endorsement money was invisible: it takes every offer now (career
earnings +$20–30M for everyone). (5) The trash-talk grudge first counted both of §3.9's numbers in a simulated game
(+0.3 tier and +2 OVR, about 5 OVR): −20% titles.

**Saves:** hype × 10 once (an old save's rival, fired up by trash talk before R8, now holds a grudge against you); a
press question waiting from before R8 gets the four answers. New fixtures from the R7 build (`tests/fixtures/save_r7_*`:
high school with hype 4.5 on the old scale, an old fired-up rival and a press question waiting; a pro mid-season with
hype 6.5, a fired-up rival and a confident answer waiting on the next game).

**New constants** (all with a one-line comment; `CONFIG.media` rewritten): hypeMax 100, hypeDecay 0.1, winHype 1,
bigHype 2.5, highlightHype 0.6 (0.08), bigNight 1.2; teamTrust 2, teamHype 2; confidentHype 3 (2), confidentConf 1,
boastLoss 2, boastConf 2; trashHype 5 (3), trashTier 0.3, trashOvr 2, trashTrust 3, trashFine 0.2, fineShare 0.02,
fineAm 100, sponsorCut 0.1, sponsorWeeks 4; nocommentXp 0.05, nocommentHype 1; hypeDraft 4, hypeRecruit 0.05,
hypeEndorse 1, hypeVote 0.1, hypeHome 0.02, hypeHomeOvr 1.5, hypeSalary 0.01 (0.1 a point of the old scale); lossConf
0.5, lossConfMul 1; keyedAt 60, keyedTier 0.2, distractAt 70, distractXp 0.15, rivalAt 70, rivalFire 2; tierOvr 9.
`CONFIG.college.nilHype` 50 (a preseason NIL offer with this much hype; 5 before). Removed: `humbleConf`.

**Tests on the committed build**

- Smoke 116/116 (desktop 1280×720 and phone 844×390). New: the R8 step (the old scale × 10 once, an old fired-up rival
  becoming a grudge; the week's decay, a win, a big performance; losses × (1 + hype/100); Team first, Confident and its
  cost on a loss, Trash talk with the grudge (the played game's AI +0.3 tier, the simulated +2 OVR, settled when you meet)
  and a forced fine (cash, a sponsor pulling back −10%), No comment's quiet week; keyed at 60, distractions and the fired-up
  rival at 70, Generational's spotlight never stacking; the home crowd on the make chance; the draft score, recruiting,
  market value, sponsors × (1 + hype/100) and a pro fine), and two R7-build migrations (a high school career with hype
  4.5, a fired-up rival and a press question waiting: four answers, hype 45; a pro with hype 6.5, a fired-up rival and a
  confident answer waiting on the next game).
- Modes 15/15 · old saves 29/29 (2 new, from the R7 build) · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 105 screens at 844×390 (4 new: the four answers, the newspaper after trash talk with a fine, the headlines
  with BUZZ, a pro's BUZZ): nothing flagged, no errors (the first run caught the fourth answer off the bottom of the phone
  screen and a CONTINUE button laid out before it was shown: both fixed). The same 105 at 1280×720: nothing flagged.
- Art Lab: 54 shots, no errors (`shots/r8/round-final/`). Screenshots of the new screens, desktop and phone: `shots/r8/`.
- §2 gate and the balance harness: identical to R7 line for line (the crowd's make chance only runs in career games).
- The career simulator (40 careers, seed 1): 0 stuck; OVR 56 / 68 / 74 at 17 / 21 / 25, peak 78; 0.93 titles a career;
  Hall of Fame 15%; every target met. It takes every sponsor deal now: $24.9M of sponsor money a career on average. Hype
  (its default answers: Team first after a loss or when shaken, Confident otherwise): 14.5 on average in the pros, never
  60. No shoe line opened in these 40 careers (R7: 23): at 60 of 100 it belongs to hype chasers now (39 of 300 "always
  trash talk" careers opened one).
- Trait balance (200 careers per trait, seed 1): all 17 in range; Showman −13% (its highlights' hype is worth less),
  Glue Guy −15%, Late Bloomer −15%, Generational +30%.
- Perf, 844×390 @2x in the pro arena: guard 0 median 23.3 ms (R7: 23.2). No change.

## R7 — The pros and your money: contracts you negotiate, free agency, trade requests, what money buys and the epilogue (the R pass, milestone 7)

Every game is still 1v1 (the change of plan): a club is your organization, its depth chart decides who plays the
week's game, and the club's record is yours.

**Contracts and free agency** (§3.6: years vs money vs role; money vs a contender vs playing time)

- When your deal is up, three clubs make offers, each best at one thing: **your club** pays the most (1.05 × your
  value; your role stays), a **big market** (the best facilities of the others, and every fame gain × 1.2 while you
  play there: sponsors and All-Star votes) pays your value and makes you compete for the start, and a **club that
  starts you** promises the start for 0.95 × your value.
- Pick one, then **negotiate**: the length (1 to 5 seasons; a season's pay × 1.08, 1.04, 1, 0.97 or 0.94: security
  costs money; clubs offer at most 3 seasons at 31–32 and 2 after) and the role (ask for a promised start: −10%, unless
  the club already offered it). A promised start puts you first on the depth chart when every season of the deal
  begins (the coach's trust at least 60); challenges can still take it during the season.
- Your agent (R6) adds 10% to every offer and takes 4% of every check; in the pros you can hire one or part ways
  (Business → Contract & money).

**Trade requests** (§3.6: when unhappy)

- Unhappy: benched for half of the season's games (after 4), a coach whose trust in you is under 20, or winning 30% of
  your games or fewer (after 6); once a season, until two thirds of the way through it. A card: request a trade (a club
  that starts you; your contract comes along; the press calls it a distraction: hype −10% of the cap) or stay and
  fight for it.

**What money buys** (§3.7; Business has new Training and Lifestyle tabs)

- **A personal trainer** (three tiers: +10 / +20 / +30% practice XP) for $0.5M / $1.5M / $3M a season; **a private
  coach** (+50% on practice in your training focus: targeted XP) for $1M; **nutrition & physio** for $2.5M (the
  expensive one: injury risk × 0.6, 5 fatigue off every game week, a better Rest week, and every age-decline step
  skipped a quarter of the time: the decline runs 25% slower). Costs are by the season, charged week by week, so a
  season costs the same whatever its length. The old shooting coach, skills trainer, strength coach and physio (0–3
  stars each) become the trainer (their best tier) and nutrition & physio (any physio).
- **A signature shoe line**: when your hype reaches 60% of its cap (§3.7's 60 of 100; hype runs 0–10 until R8) a brand
  pitches it (a card; or later from Business): $5M up front, then royalties every week ($1M a season × (1 + fame/50) ×
  (1 + hype/cap)); when you retire the brand buys the line for two seasons of royalties.
- **Lifestyle**: a car, a sports car, a house for your family, a mansion — confidence +1 or +2 once and a story card,
  never a rating. Houses count in your net worth.

**The epilogue** (when you retire: what your money builds, any mix)

- Your **net worth** (cash, houses, the shoe line's buyout) and four choices: a **foundation** (+1 legacy for every
  $2M, up to +20; the Hall of Fame still judges what you did on the court), a **youth academy** ($30M: your next career
  gets a **Legacy Start**: every ceiling +5 (half a point on the 10 scale) and a signature trait that is never Common),
  a **franchise stake** ($250M: the Owner ending and an OWNER badge on your profile for good), and what you do next
  (coach or broadcaster, free; or walk away). What you can't afford falls away: the stake first, then the academy, then
  the foundation. The legacy screen shows the foundation's legacy and a second page, WHAT MONEY BUILT.
- A **net-worth leaderboard** of every career (Hall of Fame → Net worth). A retirement left before its epilogue
  waits on the main menu (YOUR RETIREMENT).

**Screens and cards:** NEGOTIATE; Business (Contract & money with your agent, the shoe line and your net worth;
Training; Lifestyle); WHAT YOUR MONEY BUILDS; WHAT MONEY BUILT; NET WORTH; the cards UNHAPPY, TRADED, A SHOE OF YOUR
OWN, YOUR SIGNATURE SHOE, the lifestyle cards and LEGACY START.

**Tuning**

- The career simulator's sensible spender (a trainer by pay: ★ from $2M, ★★ from $5M, ★★★ from $10M; a private coach
  from $6M; nutrition & physio from 29 with $8M; the shoe line when it has twice the price; a car, then a house and a
  mansion as the money comes; the richest free-agency offer; a trade request when benched; at the end the stake if it
  has 1.2 × its price, the academy with 3 ×, the rest to the foundation) came out too strong at first: with the
  trainer on all XP and every pro XP at 1.0 it won 1.6 pro titles a career with a 28% Hall of Fame (the targets: about
  1 and 10–20%). The stars who could afford everything pulled away. Two changes: the trainer boosts practice XP (what a
  trainer runs), and all pro XP is × 0.85 (`xpBase`). Over 120 careers (seeds 1–3) the default lands on 1.02 titles, a
  14% Hall of Fame and OVR 73–74 at 25 (the bottom of the 74–78 target on seed 2).
- A first version of free agency paid the small market 1.15 × your value *and* promised the start: it won every
  simulated free agency (money and playing time together). Now each offer is best at one thing:

| Policy (120 careers, seeds 1–3) | Legacy median | Pro titles | Hall of Fame | Earned (median) | Net worth (median) | Staff spent |
| --- | --- | --- | --- | --- | --- | --- |
| Free agency: the most money (your club) · the default | 52 | 1.02 | 14% | $275M | $217M | $60M |
| Free agency: the big market | 52 | 1.08 | 15% | $261M | $204M | $60M |
| Free agency: the club that starts you | 51 | 1.08 | 16% | $245M | $191M | $59M |
| The most money, and nothing bought (no staff, no shoe line, no lifestyle) | 51 | 0.97 | 13% | $236M | $232M | $0 |

  Money buys a little: the spender earns $39M more (a better player is worth more) and wins a little more, for $60M of
  staff. The simulator asked for a trade about twice a career (whenever it sat half the games) and launched a shoe line
  in half its careers (63 of 120). At the end the default policy's median career was worth $217M: it built the academy in
  114 careers of 120, a foundation (+20 legacy by the median) almost always, and bought the stake in 14 (the richest).

**Saves:** the pro career's staff migrates (above); deals from before R7 keep their terms (no promise); an offseason in
progress keeps its old offers. The last amateur league is dropped from the save at the draft (a college season's
64-team bracket was dead weight: the R6 pro fixtures weighed 100 KB). New fixtures from the R6 build (`tests/fixtures/
save_r6_*`: high school, a pro mid-season with the old staff, a pro offseason).

**New constants** (all with a one-line comment): `CONFIG.pro` (xpBase 0.85; trainerXp [0, 0.1, 0.2, 0.3], trainerCost
[0, 0.5M, 1.5M, 3M] a season; coachXp 0.5, coachCost 1M; nutritionCost 2.5M, nutritionInjury 0.6, nutritionRegen 5,
nutritionAging 0.25; yearsMul [1.08, 1.04, 1, 0.97, 0.94], maxYears [[30, 5], [32, 3], [99, 2]], startMul 0.9,
promiseTrust 60; faYours 1.05, faBig 1, bigFame 1.2, faStarter 0.95; tradeBench 0.5, tradeTrust 20, tradeWin 0.3,
tradeMinGames 4, tradeDeadline 0.67, tradeHype 0.1; shoeHype 0.6, shoeCost 5M, shoeRoyalty 1M, shoeBuyout 2; lifestyle
(car 120K, sports car 900K, house 2.5M, mansion 15M); foundationPer 2M, foundationMax 20, academyCost 30M, legacyCaps 5,
stakeCost 250M). Removed: `CONFIG.career.staffCost` and `staffBonus`, `CONFIG.week.injuryPhysio` (the old staff).

**Tests on the committed build**

- Smoke 114/114 (desktop 1280×720 and phone 844×390). New: the old staff migrates (shooting 2, skills 1, strength 3,
  physio 1 → trainer ★★★, nutrition & physio); the trainer (+30% practice XP at ★★★), the private coach (+50% on your
  focus only) and a week of staff at a season's cost ÷ its length; nutrition's 5 fatigue a game week and its skipped
  decline steps; free agency's three clubs (yours, a big market with the best facilities, a club that promises the
  start), the years and a promised start moving the money, the maximum years by age; a signed deal (the club, the
  promise, the big market); a promised start first on the depth chart with the coach's trust ≥ 60; a trade request
  (the new club starts you, the contract comes along, hype −10% of the cap, the league keeps 12 players); the shoe
  pitch (no pitch without hype), the launch ($5M), royalties and the buyout; lifestyle (confidence once, a house in the
  net worth); the agent (hire and fire, +10% and the fee); the epilogue (what you can't afford falls away; the
  foundation's legacy; the academy; the stake and the owner's badge) and the next career's Legacy Start (+5 on every
  ceiling, a signature trait that is never Common). New fixtures from the R6 build (`tests/fixtures/save_r6_*`: high
  school, a pro mid-season with the old staff, a pro offseason with its old offers).
- Modes 15/15 · old saves 27/27 (3 new) · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 101 screens at 844×390 (9 new: Business's Contract & money, Training and Lifestyle tabs, the trade card,
  the shoe card, NEGOTIATE, the epilogue, the legacy screen after it, WHAT MONEY BUILT, NET WORTH): nothing flagged, no
  errors. The same 101 at 1280×720: nothing flagged.
- Art Lab: 54 shots, no errors (`shots/r7/round-final/`). Screenshots of the new screens and cards, desktop and phone:
  `shots/r7/`.
- §2 gate and the balance harness: identical to R6 line for line (R7 touches no match code).
- The career simulator (40 careers, seed 1): 0 stuck; OVR 56 / 68 / 74 at 17 / 21 / 25, peak 78; 1.07 titles a career;
  Hall of Fame 10% (the bottom of 10–20%); every target met. Money: net worth $231M and earnings $290M by the median,
  $60M on staff, 23 shoe lines, 80 trade requests (2 a career), free agency: your club 146 times, the big market 3;
  the epilogue built 38 academies and bought 3 stakes.
- Trait balance (200 careers per trait, seed 1): all 17 in range; Late Bloomer −15% (R6: −22%), Generational +30%.
- Perf, 844×390 @2x in the pro arena: guard 0 median 23.2 ms (the R6 suite: 23.3 on the same machine). No change.

## R6 — College: the program you pick, a conference, its tournament, the national tournament, NIL, draft stock, the transfer portal and an agent (the R pass, milestone 6)

Every game is still 1v1 (the change of plan): the program is your team, its record is yours, and your teammates are
its depth chart.

**The program you pick** (§3.5: blue bloods are deep, mid-majors start you)

- Where you start on the depth chart: a small school or a mid-major starts you, a power program has you second, a blue
  blood third (R4 had 1 / 2 / 3 / 4). When you arrive, the teammates ahead of you are 1 to 4 OVR better and everyone
  else is at least 1 under you. The old rosters were built around the program's level, not yours, so most teammates
  outranked you: in the career simulator freshmen sat whole seasons and the transfer portal opened in 7 of 8 careers.
- The offer cards show the start ("you start" or "#3 to begin"), and each tier's blurb spells out the trade-off: a
  blue blood is a deep roster with the biggest spotlight (scouts, NIL, a national tournament bid most years); a
  mid-major starts you but needs a great season to get to the national tournament.

**The season**

- Three marquee non-conference games first (opponents 3 OVR over the level; scouts count them twice), then a single
  round robin in an eight-program conference (seven games; your rival is in it). The conference record ranks you; the
  overall record counts everything, the tournaments included.
- **The conference tournament:** all eight programs, seeded by conference record, three rounds. The champion gets an
  automatic bid.
- **Selection:** everyone else is judged on a résumé (30 × the season's win share, 5 per program tier, 0.6 per OVR
  point over the level, 2 for the conference title, 3 for the tournament title) that ranks you among 350 programs.
  The top 45 get at-large bids; a LEFT OUT card if you miss.
- **The national tournament:** 64 programs in four regions (seeds 1 to 16 by national rank), six rounds, simulated
  around your games; its top seeds are up to 7 OVR over the level. Standings has both brackets (your region, then the
  Final Four).
- Awards: National champion (a title), National semifinalist, Conference tournament champion, Conference champion,
  Conference MVP (first, with 5 of 7 conference wins), All-Conference 1st and 2nd team. The season recap ends with
  NATIONAL CHAMPIONS!, "National tournament: out in the last 16" or "Left out of the national tournament (#62)".

**Draft stock and the mock draft**

- Every game you play moves your draft score: a win +0.5, a loss −0.3, and your points (−0.5 to +0.8 around 18),
  twice as much in a marquee or tournament game, × 0.35, capped at ±4. Half of it carries into the next season.
- A mock draft pick after every game. The DRAFT STOCK screen (a hub link in college) shows the scouts' grade, the mock
  pick game by game (this season and last) and an agent's read.

**NIL deals** (a card: take it or turn it down)

- A preseason offer (with hype, an OVR edge over your level, four or five stars, or half the time anyway) and after
  big games (20 points, or a marquee or tournament win; a quarter of the time). A deal is $4,000 × hype × your edge ×
  the program tier × appearances (none to two; each costs 8 fatigue in a game week). The money comes with you to the
  pros.

**The transfer portal**

- After a season with half your games or more on the bench (years 1 to 3): two programs that start you (one of the
  same tier a rung higher, one a tier down at #1). Transfer (the next season there, a new team and conference), stay,
  or declare.

**Declaring and the agent**

- The draft decision shows your mock pick and an agent's advice: go if you're a lottery or first-round pick (or a
  second-rounder as a junior), stay if you're a fringe pick.
- On the way to the draft (declaring, a senior's last season, skipping college or leaving from the portal) an agent
  calls: 10% more on every contract (the rookie deal and free-agency offers) for 4% of your salary. Sign or go it
  alone; the pros' BUSINESS screen shows your game check after the agent.

**Screens and cards:** DRAFT STOCK, CONFERENCE TOURNAMENT and NATIONAL TOURNAMENT brackets, NIL OFFER and AN AGENT CALLS
(yes-or-no cards), TRANSFER PORTAL, the draft decision with the agent; the hub's labels (MARQUEE · GAME 3 OF 10 · HOME,
CONFERENCE QUARTERFINAL, NATIONAL · LAST 16) and headline (conference record, overall, mock pick); Standings with the
marquee games and both tournaments; THE FIELD OF 64, LEFT OUT, TRANSFER; results labelled Marquee game, Conference
tournament, National. On a phone the portal's four choices sit in a 2 × 2 grid.

**Tuning**

- College XP (games, practice, the bench) ×0.7: a season is now 11 to 19 games, not 7 to 9. At ×1.0 the career
  simulator's players were 1 to 2 OVR better from 21 to 29 and won 1.8 pro titles a career (the R5 build on the same
  seed: 1.43).
- College opponents' mean 61 → 59: the new season adds marquee games at +3 and a tournament field up to +7, and at 61
  the simulator's college teams won 38% of their games.
- The résumé's national-rank curve: mean 16, spread 7 (at 20 and 8 only 7% of the simulator's seasons made the field).

**The career simulator** (the suite's 40 careers, seed 1; the college line and a new line by program tier)

| Program tier | Seasons | Win share | On the bench | National tournament | Conference tournament titles |
| --- | --- | --- | --- | --- | --- |
| Small school | 7 | 0.37 | 1% | 14% | 1 |
| Mid-major | 43 | 0.41 | 12% | 5% | 1 |
| Power program | 35 | 0.44 | 39% | 46% | 4 |
| Blue blood | 6 | 0.47 | 26% | 100% | 0 |

- 2.3 college seasons a career; 27% of seasons end in the national tournament (0.7 wins a trip; one Final Four in
  40 careers; no national title, it takes six straight wins against the best); 3.8 NIL offers a career, 2.4
  taken (the simulator takes deals with one appearance or none), $15,750 by the median; 14 careers went through the
  portal (the simulator transfers a tier down); the median mock pick at a season's end is #39.
- A mid-major's road to the national tournament is its conference tournament; a blue blood gets in on its résumé
  even after a losing season. The simulator plays every game from OVR and its players sit under the college mean for
  their first years (a player who plays the games does better).

**Saves:** the amateur career goes to v5 (draft stock, the mock log and NIL start now); a college season in progress
finishes in its old format and the next one is the new season; a "NEW: COLLEGE" card explains it. New fixtures from the
R5 build, among them a college career three games into its first season (`tests/fixtures/save_r5_*`).

**New constants** (all with a one-line comment): `CONFIG.college` (the season: conference 8, marquee 3, marqueeGap 3;
selection: fieldSize 64, nationTeams 350, resMean 16, resSd 7, atLarge 45, seedTop 7, seedStep 0.7;
colXp 0.7; draft stock: stockStep 0.35, stockWin 0.5, stockLoss −0.3, stockPts 18, stockPtsDiv 12, stockMax 4,
stockKeep 0.5; NIL: nilBase 4000, nilAppMul 0.4, nilFatigue 8, nilOdds 0.25, nilPts 20; portalShare 0.5, seatAhead 4;
agentFee 0.04, agentRaise 0.1). Changed: `CONFIG.team.ladderStart` [1, 2, 3, 4] → [1, 1, 2, 3],
`CONFIG.amateur.stageMean.college` 61 → 59.

**Tests on the committed build**

- Smoke 111/111 (desktop 1280×720 and phone 844×390). New: seating by tier (every program, the band of the teammates
  ahead of you); the season (marquee games first, the conference round robin, the rival in the conference, every
  conference team playing seven conference games); draft stock (a marquee game moves it twice as far, the cap, a mock
  pick a game); the conference tournament, the automatic bid and a field of 64 with seeds 1 to 16 in every region, six
  rounds to the national title and its awards; at-large bids (a 1-12 mid-major left out, a 12-1 blue blood in); NIL
  (an accepted deal pays and books appearances, each costs fatigue; a declined one changes nothing); the portal (opens
  at half the games on the bench, two offers, transferring, staying, declaring); the agent (the call on the way to the
  draft, the rookie deal +10%, the 4% fee; no agent: the scale); a v4 college save finishing its old season; every new
  screen draws. The R4 step now checks the blue blood's third rung. The first suite run failed two smoke steps, both
  gaps in the test's flow on the same build: an NIL card where the flow expected the hub (the drain step didn't know
  the new card) and a pause-menu step that found the player benched after a teammate's challenge (the career's seed is
  random). The test handles both now; the rerun on the same build passed 111/111.
- Modes 15/15 · old saves 24/24 (new fixtures from the R5 build: high school, pro, and a college career three games
  into its first season) · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 92 screens at 844×390 (8 new: the college hub, standings with marquee games, draft stock, an NIL offer,
  both brackets, the portal, the agent's call): nothing flagged, no errors. The same 92 at 1280×720: nothing flagged.
- Art Lab: 54 shots, no errors (`shots/r6/round-final/`). Screenshots of the new screens: `shots/r6/`.
- §2 gate and the balance harness: identical to R5 line for line.
- The career simulator (40 careers, seed 1): 0 stuck; OVR 56 / 68 / 75 at 17 / 21 / 25, peak 79; 1.27 titles a
  career; Hall of Fame 18%; every target met.
- Trait balance (200 careers per trait, seed 1): 16 of 17 in range; Late Bloomer −22% (the line is −20%; R5 −19%). Its
  own median is unchanged (43); the overall median rose from 53 to 55. The same test on seed 2: all 17 in range, Late
  Bloomer −13%. Its numbers are the spec's, so I left them; R7 reruns the test.
- Perf, 844×390 @2x in the pro arena: guard 0 median 23.2 ms; the R5 build right before it on the same machine: 23.0
  (the suite's R5 run measured 21.7 on a quieter machine). No change: R6 touches no match code.

## R5 — High school: tryouts, a district, the state tournament, recruiting, summers and grades (the R pass, milestone 5)

Every game is still 1v1 (the change of plan): your team is the school, its record is yours, and the teammates are
your depth chart (R4).

**Tryouts, JV and varsity**

- A freshman tries out before the season, and so does a sophomore still on JV: a 60-second shootout, then a 1v1
  against the varsity's best senior (a game to 7). Play either or sim it. The grade is 40% the shootout (16 counts in
  full), 60% the 1v1 (a win counts in full; a loss counts your points). Varsity at 60 as a freshman, 50 as a sophomore,
  or with an OVR already 2 over your level's mean. Juniors and seniors are varsity.
- **JV** is a team of its own (5 freshmen and sophomores, its own coach and depth chart) in a JV district: ten games,
  no playoffs, opponents 6 OVR under the varsity level. **Call-up:** after four JV games, win three of every four and
  the varsity coach calls you up mid-season: you join the varsity's depth chart by OVR, and its first weeks (played
  by its top rung) stay on the books.
- The career simulator (the suite's 40 careers): 55% of freshmen make varsity; call-ups average 0.35 a career and a
  whole season on JV 0.13.

**The season**

- A six-team district, a double round robin: ten games, five at home, everyone plays every week. Your rival's school
  is in your district; your home game against it is **the rivalry game** (a card before it; its highlights count half
  again for hype). A senior's last home game is **senior night** (a card, confidence +2).
- **District playoffs** (the top four: semifinals and a final). The district champion goes to the **state
  tournament**: sixteen district champions, four rounds, simulated around your games, with its own bracket screen
  (Standings → State bracket). A district title is an award (recruiting +1); the state title is a title (it counts
  where titles always did: offers, the draft, the Hall of Fame).
- Awards: District MVP (first, with 8 wins of 10; a six-team district is easier to top than the old eight-player
  league, where 7 of 10 did), All-District 1st team (top two) and 2nd team (top four), JV MVP (not an MVP).
- State titles are rare: none in the suite's 40 simulated careers (0.5 district titles a career). The simulator plays
  every game from OVR, and state is four straight wins against district champions (each 2 OVR over the level's mean,
  `stateGap`); in a 24-career run one career won it. A player who plays the games wins more.
- Before R5 a season was 7 games and a four-player playoff. The longer season would have made players better, so
  high school XP (games, practice and the bench) is ×0.75: a season pays what it did.

**Recruiting**

- A recruiting score (your OVR, 2 per title, 1 per district title, 2 per MVP, half your hype, your coach's word (up to
  4 at full trust), exposure, and 0.1 per point per game over 12) ranks you in a national class of 3,000: stars by
  rank (top 30 five stars, 300 four, 1,000 three, 2,000 two) and a Top-100 rank ("#57 in the nation"). A younger
  player's score is projected (+5 a year before the senior year). It updates at the end of every season, after every
  summer and midway through the senior year. A RECRUITING screen (a hub link) shows the stars, the rank by year,
  what counts, and your offers.
- **Offers build:** after the sophomore season (blue bloods only, for the elite), after the junior season and midway
  through the senior year (the top two tiers your score reaches), and after the senior season a full set, one program
  per tier from your best down (at least three: small schools fill in). A tier from the score: 71 blue blood, 64
  power, 57 mid-major (the old cuts were 66/60/54 on a score without exposure or district titles). Every offer is a
  card and a headline.
- A quarter of the colleges have **strict academic standards**: a failing report card and they pull the offer.
- **Three official visits** before commitment day (was two). Commitment day (the hats) is unchanged.
- The career simulator (the suite's 40 careers): the median senior is #498 nationally (3 stars in 23 careers, 4 stars
  in 12, no 5-star); the best offer is a blue blood in 5 careers, a power program in 24, a mid-major in 10, a small
  school in 1 (R4: 7 / 24 / 8 of 40).

**Summers** (after the freshman, sophomore and junior years; a card and the hub's YOUR SUMMER button)

- **AAU circuit:** three tournaments against the best players in the country (simulated); recruiting score +2 for
  good; 20 XP; but you start the season at fatigue 35 and 20% of players carry an injury into it.
- **Skills camp:** $600 for 150 XP into your focus (and exposure +1). **Rest:** heal, start fresh, confidence +2.
  **Summer job:** +$1,000, −30 XP of progress (never a rating).
- You start with $200 saved; what's left comes with you into the pros.

**Grades**

- A GPA (about 3.0 at the start). Every game week costs 0.05; a **Study week** (a fourth weekly plan in high school)
  adds 0.3 and rests you a little. On phones the plan row has room for three: REST opens Rest or Study.
- Your coach's rule: when your GPA is under 2.3, a week you don't plan is a Study week (the AUTO plan shows it).
- **Report cards** after five games and at the end of the season. Under 2.0: you are ineligible for the next two
  games (the next rung on the depth chart plays them; your stats don't count) and strict colleges pull their offers.

**Screens and cards:** TRYOUTS (both parts, played or simmed), YOUR SUMMER, RECRUITING, STATE TOURNAMENT, the phone's
Rest-or-Study chooser; the hub's labels (JV · GAME 3 OF 10 · AWAY, RIVALRY GAME, SENIOR NIGHT, STATE QUARTERFINAL,
INELIGIBLE · 2 GAMES); Standings with home and away and the special games; the cards VARSITY! / JUNIOR VARSITY,
CALLED UP!, RIVALRY GAME, SENIOR NIGHT, REPORT CARD, SCHOLARSHIP OFFERS, DISTRICT CHAMPIONS!, SUMMER: …

**Saves:** the amateur career goes to v4: grades, savings and the national rank start now; a season in progress
finishes in its old format (the next one is a district, with tryouts for a freshman or a sophomore); a "NEW: HIGH
SCHOOL" card explains it. New fixtures from the R4 build (`tests/fixtures/save_r4_*`).

**Also:** a result screen's playoff label showed the next round, not the one just played. While building R5 I
introduced a comment that swallowed the team-record update after a game (the TEAM screen would have shown 0-0); the
R3 team test caught it before any commit, and the build's lint flags it (I had cut its output short).

**New constants** (all with a one-line comment): `CONFIG.hs` (tryouts: tryoutYears 2, tryoutGood 16, tryoutDrillW 0.4,
tryoutBar [0.6, 0.5], tryoutOvr 2, tryoutTarget 7; JV: jvGap 6, jvRoster 5, jvBase −3, promoteAfter 4, promoteWin
0.75; the season: district 6, districtSeeds 4, mvpWins 0.8, stateTeams 16, stateGap 2, seniorConf 2, rivalryHype 1.5;
recruiting: classSize 3000, recruitMean 59, recruitSd 7, classAdj 5, stars [30, 300, 1000, 2000], offerCuts [71, 64,
57], districtW 1, ppgW 0.1, ppgRef 12, aauExposure 2, campExposure 1, visits 3, minOffers 3, strictOdds 0.25; summers:
startCash 200, campCost 600, campXp 150, jobPay 1000, jobXpLoss 30, aauFatigue 35, aauInjury 0.2, aauXp 20, aauOvr 6,
restConf 2; grades: gpaStart 3.0, gpaSd 0.25, gpaDrift 0.05, studyGpa 0.3, studyRest 10, gpaMin 2.0, ineligibleGames 2,
autoStudyAt 2.3, reportWeek 5; hsXp 0.75).

**Summers against each other** (the career simulator, 60 careers each, seed 3, the same summer every year)

| Summers | OVR at 17 / 21 / 25 | Legacy median | Titles | Hall of Fame | 5★ / 4★ at signing | Best offer: blue blood / power / mid |
| --- | --- | --- | --- | --- | --- | --- |
| A job, a camp, then AAU (the simulator's default) | 56 / 68 / 74 | 56 | 1.15 | 18% | 0 / 23 | 7 / 35 / 18 |
| AAU every summer | 57 / 69 / 75 | 59 | 1.48 | 20% | 4 / 38 | 25 / 31 / 4 |
| Rest every summer | 56 / 68 / 74 | 61 | 1.38 | 18% | 1 / 8 | 6 / 31 / 23 |
| A job every summer | 56 / 67 / 74 | 55 | 1.12 | 12% | 0 / 4 | 3 / 30 / 27 |

The first values (AAU exposure +3 and 40 XP, fatigue 30, 15% injuries; a job −60 XP) gave AAU 65, rest 61 and a job
44: AAU dominated and a job was a trap. Now AAU buys exposure (blue-blood offers) at a cost in wear, rest is the safe
choice, and a job pays for a camp. "A camp every summer" can't be run: it costs $600 and you start with $200.

**Tests on the committed build**

- Smoke 109/109 (desktop 1280×720 and phone 844×390). New: tryouts from the hub (sim the shootout and the 1v1; the
  coach picks); a whole high school season (tryouts to JV or varsity, the six-team district's double round robin with
  five home games, the rivalry game at home, senior night, a JV call-up, the district playoffs, the 16-team state
  bracket, report cards and ineligibility, the national rank, offers, summers); an R4 save migrating.
- Modes 15/15 (new: tryouts played live) · old saves 21/21 (new fixtures from the R4 build: a high school team league
  and a pro mid-season) · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 84 screens at 844×390 (9 new: tryouts before and between the two parts, the tryout result, YOUR SUMMER,
  Rest-or-Study, RECRUITING, the state bracket, standings with the state tournament, the hub waiting for the summer):
  nothing flagged, no errors. The same 84 at 1280×720: nothing flagged.
- Art Lab: 54 shots, no errors (`shots/r5/round-final/`). Screenshots of the new screens: `shots/r5/`.
- §2 gate and the balance harness: identical to R4 line for line.
- The career simulator (40 careers, seed 1): 0 stuck; OVR 56 / 67 / 75 at 17 / 21 / 25, peak 79; 1.00 titles a
  career; Hall of Fame 13%; bench weeks 14.1 amateur and 27.2 pro a career; 5.0 study weeks a career, no ineligible
  games (the auto-study rule); every target met.
- Trait balance (200 careers per trait): all 17 in range (overall median legacy 53; Late Bloomer −19%, near its
  −20% edge; Generational +33%).
- Perf, 844×390 @2x in the pro arena (median / p95): guard 0 21.7 / 27.3 ms (R4: 21.8 / 26.3). No change.

## R4 — The depth chart: 1v1 challenges decide who plays, coach trust, no extras in the career (the R pass, milestone 4)

The spec's milestone 4 was "teams and team games". Under the change of plan the career is 1v1 only, so there are no
team games, no AI teammates on the court and no chemistry. What replaces the spec's minutes and roles (bench →
rotation → starter → star) is a **depth-chart ladder**: every team is one player a game, and whoever is on the top rung
plays it.

**The ladder**

- Your team (high school, college program, pro franchise) orders you and your teammates. The top rung starts every
  week's game: at a school or program that's you against the other team's player, as before.
- **Where you start:** a high school team starts you on top. A college program starts you by its tier: a small
  school on top, a mid-major 2nd, a power-conference program 3rd, a blue blood 4th (its teammates are centered 6 OVR
  under you at a small school and 6 over you at a blue blood; seniors higher, freshmen lower). A pro franchise starts a first-round pick on top in the first
  season; a later pick (or a player traded in) starts a rung down unless they're better than the whole bench.
  Careers from before R4 keep you on top.
- **Challenges:** on the Practice screen, **DEPTH CHART** opens the ladder. Challenge the teammate a rung above you: a
  practice game to 7 (2s and 3s, half court, in the team's gym), played or simulated. Win and you swap places. It is
  that week's practice (its XP goes to your focus: a win pays like a good drill, a loss like a poor one).
- **Incoming challenges:** after any game, the teammate a rung below you may challenge you (20% a week, less if
  they're far behind: nobody 10 OVR under you bothers). An event card: **PLAY IT** or **SIM IT**. A challenge left
  unanswered is simulated before the next game. Lose and you drop a rung (from the top: you don't start).
- **A week on the bench:** the teammate on the top rung plays your team's game (simulated); the team's record and
  the standings count it; you get no stat line (the pro game log shows DNP), no highlights, no press; a pro still gets
  paid. Scrimmages with the second unit still pay XP (about an average simmed game's), fatigue drops 10, and the
  result screen says who started, the score, your scrimmage XP and how to take the spot back. The hub shows
  "BENCH · YOU'RE #k · <starter> STARTS", the starter's card, and SIM THE GAME in place of PLAY.
- **Teammates in the story:** a card the first week you sit (the coach's line by personality), BENCHED the first time
  a teammate takes your start, THE STARTING SPOT the first time you win it; challenges and bench games in the news.
  Drills in practice are against your teammate a rung below (or above), in the reversed practice jersey.
- The TEAM screen lists the roster in depth-chart order (rank badges on the portraits) and shows your coach trust and
  your rung.

**Coach trust** (0–100; a high school coach starts at 45, college and pro at 40)

- Up: +6 for winning a challenge you started, +3 for defending your spot, +2 for a win, +1 for a practice week.
  Down: −1 for a challenge you lose, −3 for losing your spot, −1 for a loss (−2 more in a blowout), −1 for resting
  when you're fresh (fatigue under 30). Glue Guy's gains are ×1.5 (the R3 trait).
- It pays: practice XP ×(1 + 0.2 × trust/100), up to +20%; your high school coach's recommendation adds up to 4 to
  the college offer score, your college coach's up to 5 to the draft score (press answers join in R8).

**No arcade extras in the career** (change of plan)

- Settings → Arcade extras is now Quick games / All exhibitions / Off. "Everywhere" (careers included) is gone; a
  save that had it gets All exhibitions. Every career match (games, drills, depth-chart challenges, the All-Star
  events) runs without the super meter, specials or power-ups, whatever the setting. Exhibition modes are unchanged.

**Tuning (the career simulator: challenges when benched, answers every challenge by simulation)**

| Step | OVR at 17 / 21 / 25 | Peak | Titles | Hall of Fame | Bench weeks (amateur / pro) |
| --- | --- | --- | --- | --- | --- |
| First version (60 careers): no bench XP, full-game odds for challenges, 30% incoming, pro bench −8 | 55 / 63 / 64 | 65 | 0.47 | 2% | 18.1 / 119.1 |
| Bench scrimmage XP ×0.6, challenges closer to a coin flip (scale 9), reach 10 | 56 / 66 / 71 | 75 | 0.87 | 7% | 12.2 / 65.5 |
| Pro bench −14 (was −8), first-round picks start (was top 10), bench XP ×0.75 | 56 / 67 / 73 | 76 | 0.83 | 12% | 12.1 / 37.6 |
| Incoming challenges 20% (100 careers, seed 7) | 56 / 66 / 73 | 76 | 0.98 | 15% | 13.3 / 27.3 (bench XP ×0.9) |
| Bench XP ×1.0 (chosen, 100 careers, seed 7) | 56 / 67 / 74 | 77 | 1.07 | 15% | 12.9 / 26.2 |
| Control: the ladder off (everyone starts, no challenges) | 56 / 67 / 74 | 77 | 1.10 | 20% | 0 / 4.4 |

The first version had a death spiral: a player who lost the start stopped getting game XP, fell further behind the
teammate above and never won the spot back (peak OVR 65, Hall of Fame 2%). Bench weeks now develop you like an
average game; what the bench costs is the game itself (stats, highlights, the box score, the stat awards). Pro bench
weeks by pro season with the chosen values: 4.3, 4.0, 2.4, 1.3, 2.0, … (a rookie sits about a third of the first
season).

**Also**

- The genes screen's footer line was cut off on desktop; it wraps now.
- On phones the Practice screen's DEPTH CHART button shares the bottom row (the left column is full).

**Saves:** no version change; a team without a ladder gets one on load (you on top), trust starts at the team's
default. The R3 fixtures and every older one load and play (old saves test).

**New constants** (all with a one-line comment): `CONFIG.team.tierGap` [−6, −2, 2, 6], `ladderStart` [1, 2, 3, 4],
`proStartTop` 30, `challengeTarget` 7, `challengeOdds` 0.2, `challengeReach` 10, `challengeScale` 9, `benchXp` 1.0,
`benchRecovery` 10, `trustStart` {hs 45, college 40, pro 40}, `trust` {challengeWin 6, challengeLoss −1, defended 3,
lostSpot −3, win 2, loss −1, blowout −2, practice 1, restFresh −1, freshAt 30}, `trustXp` 0.2, `trustRecruit` 4,
`trustDraft` 5. Changed: `team.proBench` −8 → −14.

**Tests on the committed build**

- Smoke 106/106 (desktop 1280×720 and phone 844×390). The new step: a high school freshman starts on top; a blue
  blood starts you 4th; a challenge you win swaps rungs, a lost one keeps yours; a benched week is the starter's game
  (the team record counts it, your stat line doesn't, scrimmage XP, fatigue down); an incoming challenge settles at the
  next game; trust pays practice XP (×1.2 at 100) and Glue Guy's gains are ×1.5; a pro bench week; no extras in any
  career match kind with the setting on All exhibitions; Everywhere migrates to All exhibitions; a team from before
  R4 (and an old college save) keeps you starting. The first suite run failed one smoke step: the season-recap loop
  didn't expect a teammate's challenge card (the career's seed is random); the step (and the gallery script) handle it
  now, and the rerun passed.
- Modes 14/14 (new: a practice challenge played live) · old saves 19/19 · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 75 screens at 844×390 (5 new: the depth chart, a challenge result, the incoming challenge card, a
  high school bench week, a pro bench week): nothing flagged, no errors. The same 75 at 1280×720: nothing flagged.
- Art Lab: 54 shots, no errors (`shots/r4/round-final/`). Screenshots of the new screens: `shots/r4/`.
- §2 gate and the balance harness: identical to R3 (the gate's players have no career).
- The career simulator (40 careers, seed 1): 0 stuck; OVR 56 / 67 / 75 at 17 / 21 / 25, peak 78; 1.23 titles a
  career; Hall of Fame 10%; bench weeks 11.0 amateur and 27.9 pro a career, 42 challenges; every target met.
- Trait balance (200 careers per trait): all 17 in range (overall median legacy 50; Late Bloomer −18%, Generational
  +29%, Floor General +10%).
- Perf, 844×390 @2x in the pro arena (median / p95): guard 0 21.8 / 26.3 ms, guard 1 23.2 / 30.5 ms; the R3 build right
  after it on the same machine: 22.1 / 34.4 ms. No change.

## R3 — Career foundation: traits, growth not locked to position, teams as organizations (the R pass, milestone 3)

**The user's change of plan (during R2):** the career is 1v1 only. Every career game is you against one opponent; no
AI teammates on the court, no team games, no chemistry. Teams stay as your organization and your story: a school, a
college program or a pro franchise with a name, colors, a uniform, a coach and teammates. The team's record is your 1v1
record and its titles are your 1v1 titles. The depth-chart ladder and coach trust follow in R4.

**Traits (§3.1)**

- Every career has two: a **Signature**, rolled with your genes and shown on the genes screen, and a **Hidden** one that
  a story card reveals in the sophomore season (three games in; careers already past high school: at the next game).
  Rarity: Common 55%, Uncommon 28%, Rare 13%, Legendary 4% (smoke checks 6,000 rolls within ±2.5%). Cards have a
  colored frame by rarity (grey, green, blue, gold). Traits roll from their own random stream, so a seed's other
  draws (school, rival, opponents) are what they were.
- The 1v1 versions (the spec's team-game parts don't exist in a 1v1 career):

| Trait | Rarity | Upside | Downside | Where |
| --- | --- | --- | --- | --- |
| Gym Rat | C | +25% practice XP | −10% fatigue recovery (Rest) | week |
| Streaky | C | +8% makes after two straight makes | −8% after two straight misses | engine |
| Glue Guy | C | coach trust grows 50% faster (R4) | −8% XP from your stats | XP, R4 |
| Fast Twitch | C | +0.5 Speed headroom | −0.5 Strength headroom | caps |
| Quick Study | C | moves unlock a rating point earlier | −20% hype gains | moves, hype |
| Clutch Gene | U | +10% makes in crunch time and the playoffs | −5% in the first half | engine |
| Iron Man | U | −40% injury risk, −15% stamina drain | −10% XP through age 19 | week, engine |
| Floor General | U | −20% steals against you, dribble moves +10% | −10% Shooting XP | engine, XP |
| Showman | U | +50% hype (and fame) from highlights | +10% steals against you | hype, engine |
| Paint Protector | U | +15% block chance | +20% goaltend range and reach-in fouls | engine |
| Late Bloomer | R | +3 cm, about 3″ of growth at 17 (a story card), +0.5 every headroom | starts 5 lower in every rating | creation |
| Microwave | R | after two straight makes +15% for 20 s | −10% defensive effort (contests, steals, blocks) | engine |
| Film Junkie | R | Film counts double (+6) | −0.5 Speed and Hops headroom | week, caps |
| Freak Athlete | R | +1.0 Hops and Speed headroom | −1.0 Shooting headroom | caps |
| Generational | L | +1.0 every headroom, +20% XP | losses cost double confidence; the spotlight never leaves: a press question after every game, defenses key on you (the opponent's AI +0.2 tier), media distractions (practice XP ×0.85) | caps, XP, media |
| Unbreakable | L | never injured; the decline comes 3 years later (and retirement) | −10% XP | week, aging |
| Ice Veins | L | confidence never drops below 0; +8% free throws | −40% hype gains | media, engine |

  (Floor General's pass accuracy and teammate FG%, Glue Guy's chemistry and Showman's team turnovers had no 1v1
  meaning; their 1v1 versions are above.) Simulated games count the in-game traits as OVR points (`traits.simEdge`).
  In-game, a Microwave heating up, a Streaky hot hand and Clutch Gene in crunch time get a callout.
- Stories built on traits: Clutch Gene's playoff buzzer-beater (a playoff win by 3 or fewer), Late Bloomer's summer
  at 17.
- **The old stat-milestone traits are gone** (Deadeye, Posterizer, Ankle Snatcher, Glove, Eraser, the old Iron Man:
  earned from career totals): their engine effects, the config and the player screen's list. Awards already earned
  ("Earned trait: …") stay in the trophy case.
- Every pro in the league has traits too (rolled from the player's id), and they play them.

**Growth not locked to position (§3.2)**

- **Skills** (Shooting, Finishing, Handles, Defense) go to 95 for anyone; every step costs more XP than the last (the
  existing curve). **Physical ratings** (Speed, Hops, Strength) have a genetic base rolled at creation (mean 62, sd
  7, 45–80; gifted genes +5) and top out 2.0 above it (Strength 3.0). Traits move either. Height moves every rating on
  top, in every game, as before. **The play style only sets where you start** (and the AI's tendencies); it no longer
  moves a ceiling.
- The genes screen has a second page: your body's limits (the scouts' estimate while they are still learning; the
  bands narrow every season as before, now for the genetic limits only) and your two traits.
- **Role labels** from your ratings (after height), shown on the hub, the player screen and the team roster:
  Sharpshooter, Slasher, Stretch Big, 3-and-D, Floor General, Two-Way Star, Rim Runner.
- **Training screen:** one drill per rating (was six focuses, two of them split): Shooting, Finishing, Handles, Speed,
  Hops, Defense, Strength. It projects the session (the rating now → after, what the next +5 costs, the limit), marks
  a rating at its limit (MAX), and draws a physical limit as the bar's end (orange; the rest of the bar hatched).
- Tuning for the open skills (the career simulator): the young round out their weakest rating until 20 (was 24), and
  XP at 26–28 is ×0.65 (was 0.8), at 29–31 ×0.4 (was 0.45). Before: peak OVR 82, titles 1.35 a career, Hall of Fame
  30%. After: peak 77–78, titles 1.2, Hall of Fame 15%.

**Teams as organizations**

- **High school:** your school's team: name and mascot (Westbrook High Ravens), its colors (your uniform), a coach with
  a personality (fiery, teacher, players' coach, old school, numbers), 7 teammates (names, pixel portraits, ratings,
  traits, class years) and a rival school (your rival's). Every opponent plays for one of the other schools, in its
  colors; the standings list each team and the player it sends. Each summer the seniors graduate and freshmen arrive.
- **College:** the program you commit to becomes your team (its coach, 7 teammates, deeper at bigger programs); the
  high school team goes to your history.
- **Pro:** the franchise that drafts you: its coach, its league players and a bench of 4 (who practice with you).
  Moving clubs moves you to that franchise.
- The team's record is your 1v1 record (and its titles yours). A **TEAM** link on both hubs opens the team: banner,
  coach, you (role, traits), teammates, the rival team and the teams you played for before.

**Save migration**

- The amateur career goes from v2 to v3, the pro career from v4 to v5. Traits and genes roll from the career's own
  stream (a pro career takes them from the amateur career in the same save); ceilings become the new model's but never
  drop under a rating you have; the old two-rating drills map onto the new ones (Athleticism → Hops); your school or
  college gets its team; a "NEW: TRAITS" card explains the change. New fixtures from the R2 build (`tests/fixtures/
  save_r2_*`: a high school career and a pro career mid-season and in the offseason) test it.

**Also**

- The pro hub's links: with TEAM added there are nine, so the rows are 44 px on desktop (the last one used to overlap
  the bottom edge) and the phone shows six (Trophies is also under Player → Career & awards). "Management" is now
  "Business": the bitmap font can't shrink below 2×, so the long label was truncated.
- A comment that swallowed code while I was editing hid the press questions for one build (the career simulator caught
  it: 0 press questions a career). The build's lint now also flags a `//` comment that contains `const x =`,
  `=> {` or a `return …;`, which would have caught it.

**New constants** (all with a one-line comment): `CONFIG.traits` (odds, frames, labels, revealAge 15, revealGames 3,
crunchPts 3, crunchS 30, heatS 20, teenAge 19, clutchMargin 3, spotlightTier 0.2, spotlightPractice 0.85, simEdge, the
17 traits), `CONFIG.amateur.genes` (mean 62, sd 7, min 45, max 80, gifted 5, room 20, roomStr 30, skillCap 95),
`CONFIG.amateur.growth.bloomer`, `CONFIG.team` (roster 7/7/4, classOvr, tierOvr 3, sd 4, growOdds 0.35, proBench −8),
`CONFIG.roles`, `CONFIG.media.highlightHype` 0.08, `CONFIG.career.trainFocus` (7 drills). Changed:
`career.ageXpMul` 26–28 0.8 → 0.65 and 29–31 0.45 → 0.4, `amateur.roundOutAge` 24 → 20. Removed:
`career.traits`, `career.trait`, `amateur.capBase/capFocus/capTall*/capShort*`.

**Trait balance (§3.1: 200 careers per trait, the signature forced, no hidden trait)**

Median legacy over all careers: 56. Targets: within ±20% of it (Legendary −20…+40%); 0 stuck careers.

| Trait | Rarity | Median legacy | vs all | Titles | Earned ($M) | Hall of Fame | Target |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gym Rat | C | 57.5 | +3% | 1.37 | 229.0 | 16% | ±20% ✓ |
| Streaky | C | 54 | −4% | 1.31 | 229.1 | 18% | ±20% ✓ |
| Glue Guy | C | 49 | −12% | 1.00 | 203.9 | 14% | ±20% ✓ |
| Fast Twitch | C | 53.5 | −4% | 1.25 | 222.7 | 16% | ±20% ✓ |
| Quick Study | C | 54 | −4% | 1.31 | 228.4 | 18% | ±20% ✓ |
| Clutch Gene | U | 53.5 | −4% | 1.26 | 224.6 | 16% | ±20% ✓ |
| Iron Man | U | 49 | −12% | 1.14 | 210.7 | 16% | ±20% ✓ |
| Floor General | U | 54 | −4% | 1.24 | 219.5 | 19% | ±20% ✓ |
| Showman | U | 53 | −5% | 1.27 | 227.8 | 17% | ±20% ✓ |
| Paint Protector | U | 63 | +13% | 1.45 | 232.7 | 27% | ±20% ✓ |
| Late Bloomer | R | 48 | −14% | 1.11 | 188.2 | 10% | ±20% ✓ |
| Microwave | R | 61 | +9% | 1.50 | 230.9 | 24% | ±20% ✓ |
| Film Junkie | R | 51 | −9% | 1.24 | 216.7 | 14% | ±20% ✓ |
| Freak Athlete | R | 61 | +9% | 1.28 | 246.0 | 19% | ±20% ✓ |
| Generational | L | 73.5 | +31% | 1.82 | 315.9 | 34% | −20…+40% ✓ |
| Unbreakable | L | 67 | +20% | 1.63 | 259.9 | 29% | −20…+40% ✓ |
| Ice Veins | L | 63 | +13% | 1.60 | 233.4 | 26% | −20…+40% ✓ |

The strongest common/uncommon (Paint Protector +13%) and the weakest (Late Bloomer −14%, Iron Man and Glue Guy −12%)
sit inside the band. Generational came out at +92% with only "a press question after every game" as its downside
(100 careers); the spotlight's other two parts (defenses key on you: the AI +0.2 tier, and in sims −3 OVR; media
distractions: practice XP ×0.85) brought it to +44%, then +35% (sims −2.5 → −3), and +31% on the 200-career run.

**Tests on the committed build**

- Smoke 105/105 (desktop 1280×720 and phone 844×390). New steps: traits (6,000 rolls within ±2.5% of the rarity
  odds, every trait has an upside and a catch, the sophomore reveal, each engine hook: streaks, crunch time, heat, free
  throws, steals, blocks), growth (skills reach 95 for anyone, Speed/Hops/Strength stop at genes + 2.0 / + 3.0, the
  style only sets the start, role labels, one drill per rating), teams (coach and 7 teammates, opponents from the other
  schools, the team's record is yours, college and pro teams, the TEAM screen), and the two R2 fixtures.
- Modes 13/13 · old saves 19/19 (the three R2 fixtures added) · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 70 screens at 844×390 (4 new: the team screens, the trait reveal, the genes' second page): no text
  overflow, nothing off screen, no errors.
- Art Lab: 54 shots, no errors (`shots/r3/round-final/`). Screenshots of the new screens: `shots/r3/`.
- §2 gate (Legends, unchanged): Pro mirror 1.18 PPP, 48% / 52%, Legend beats Pro 83%; harness brute 1.00 ✓, perfect
  timing 1.72 ✓. The Classic harness: brute 1.24 ✓, perfect timing 2.12 ✓, Legend vs Pro 78% ✓. Identical to R2: the
  trait hooks only act on players who have traits, and the gate's players have none.
- The career simulator (40 careers): 0 stuck; OVR 56 / 67 / 74 at 17 / 21 / 25, peak 79; 1.20 titles a career; Hall
  of Fame 13%; press questions 79.8 a career; every target met.
- Trait balance: above (200 careers per trait, all 17 in range).
- Perf, 844×390 @2x in the pro arena (median / p95): guard 0 23.4 / 32.9 ms, guard 1 23.8 / 33.2 ms. The R2 build
  measured right after it on the same machine: 23.8 / 34.7 and 24.1 / 38.7 ms, so R3 costs nothing measurable (R2's
  commit measured 22.1 / 30.6 on a quieter machine). The R10 follow-up from R2 stands.

## R2 — Size and framing: the 15 m compact court, players about 1/7 of it (the R pass, milestone 2)

The problem on L19/R1: a 2 m player was 1/9 of an 18 m court and about 14% of the screen height, so the players read
small (a head about 32 world px). §2 asks for about 1/7 of the court and 23–25% of a desktop screen.

**Change of plan (from the user, during this milestone):** the career is 1v1 only, so the compact court and its camera
are for 1v1 only. R2 first built the compact court for 3v3 too (±2 m follow toward the ball); that part was undone. 2v2,
3v3 and every exhibition mode other than 1v1 stay on the Classic court and camera, as before.

**What changed**

| Layout (Legends View, 1v1) | L13–R1 | R2 |
| --- | --- | --- |
| Court length (baseline to baseline) | 18.0 m | 15.0 m |
| Hoop inset from the baseline | 1.5 m | 1.4 m |
| 3-point radius | 6.0 m | 5.2 m |
| Free-throw distance | 4.2 m | 3.8 m |
| Wall behind each baseline | 1.0 m | 0.9 m |
| Visual scale (characters drawn) | 1.0× | 1.1× |
| `h` (horizontal distances and speeds) | 0.78 | 0.70 |
| Street half court: check ball / half line | 7.0 / 8.0 m | 6.2 / 6.8 m |
| AI pick-up distance (solo / vs a big) | 8.0 / 6.5 m | 6.9 / 5.6 m |
| Camera | ppm = W ÷ 20 | ppm = W ÷ 16.8 (the court and both walls) |

- **The camera** shows the whole 15 m court and both walls on one screen, floor line at 70% of the height; no follow, no
  zoom (as in R1). Settings → Camera → Classic still gives the Classic court and camera.
- **Venues re-laid for the closer camera**: the rows of fans, the LED ribbon and the banners sit a little higher and
  closer together (`lgRowY`, `lgLedY`, `lgBannerDX` 7.4 m), so the players still stand in front of the dark band (L17).
- **The jumbotron** is clamped under the score bug (it could overlap it with the new framing).
- **Body push-apart scales with the visual scale** (`ART.pushApart × LAY.V`): at 1.1× the L16 blob test measured 62% of
  a face hidden at worst; with the scaled push-apart it is 59% (limit 60%).
- **Smoke prints the size ratio** (below) and checks it every run.

**Measured** (smoke, desktop 1280×720)

| | R1 (18 m) | R2 (15 m) | Target |
| --- | --- | --- | --- |
| 2 m player ÷ court length (nominal, 1.1× drawn) | 1/9 | 1/6.82 | ≈ 1/7 |
| 2 m player ÷ screen height (nominal) | about 14% (the spec's figure) | 23.3% | 23–25% |
| As drawn, big head included (a 2 m player) | — | 27.2% (24.9–28.1% across the roster) | — |
| Head width at game size | about 32 world px | 45 world px desktop, 51–66 phone | 44–52 (§1.2) |
| Pro mirror PPP (the gate, 300 games) | 1.21 | 1.18 | 0.95–1.25 ✓ |
| Pro mirror: team A wins | 49% | 48% | 45–55% ✓ |
| Legend beats Pro | 86% | 83% | 75–95% ✓ |
| Brute force vs Pro (harness) | 0.82 | 1.00 | ≤ 1.30 ✓ |
| Timing/reads beat brute force (sniper) | 1.47 | 1.72 | > brute ✓ |

Tuning rounds for `h` on the 15 m court (the gate, 120 mirror games): 0.66 → mirror 1.17, Legend beats Pro 71% ✗;
0.70 → mirror 1.16, Legend beats Pro 84% ✓ (the full gate run above: 1.18 and 83%).

**Deviations**

- `h` is 0.70, not "about 0.66": at 0.66 Legend beat Pro only 71% of the time (target 75–95%).
- The nominal size lands on target (23.3% of the screen, 1/6.82 of the court), but the characters' big heads make a
  2 m player 25–28% of the screen as actually drawn. The spec's parameters (15 m, 1.1×, W ÷ 16.8) are kept as given.
- 3v3 on the compact court (with its ±2 m ball follow) was built, then removed per the user's change of plan.

**Tests on the committed build**

- Smoke 100/100 (desktop 1280×720 and phone 844×390), including the new R2 step: a quick 1v1 plays the 15 m court seen
  whole (ppm W ÷ 16.8, floor at 70%, size ratio 6.5–7.5, share 0.23–0.25), a headless Classic 3v3 sim in between does
  not leak its layout, Settings → Camera → Classic, and 2v2/3v3 stay Classic. The freeze test's opponent starts 4 m from
  the hoop (the court is shorter).
- Modes 13/13 · old saves 16/16 · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 66 screens at 844×390: no text overflow, no errors.
- Art Lab: 54 shots, no errors (`shots/r2/round-final/`).
- The balance harness (Classic, unchanged): brute 1.24 ✓, perfect timing 2.12 ✓, Legend vs Pro 78% ✓.
- The career simulator (40 careers): 0 stuck; OVR 57 / 69 / 77 at 17 / 21 / 25, peak 79; 1.02 titles a career; Hall
  of Fame 13%; every target met.
- Perf, 844×390 @2x in the pro arena (median / p95): guard 0 22.1 / 30.6 ms (R1 17.8 / 25.9), guard 1 22.6 / 33.6 ms.
  The characters are 1.3× bigger on screen (1.7× the pixels), and they are painted and pixelized every frame: a CPU
  profile puts the extra ~4 ms in painting faces and bodies (1.72× the area), `pixelize` (2.7 → 4.2 ms) and the bigger
  fans (+22%). The face cache does not thrash (8 misses in 240 frames, the warm-up). It is back at L19's level (22.0 /
  36.7); R10 looks at repainting the characters less often.

## R1 — Retro look: one pixel-art world (the R pass, milestone 1)

The problem on the live build (L19): two styles on one screen. The players were chunky 3-px pixel sprites (the L15
composite) standing in a smooth, high-resolution arena, crowd and set of hoops, and the pixels were too big.

**What changed**

- **One pixel grid (§1.1).** The whole match draws into a buffer about 360 rows tall, `k = max(2, round(device rows ÷
  360))`, and is blitted at k× with smoothing off. 1280×720 → k 2, a 640×360 world. 1080p → k 3. The phone test
  (844×390 at 2 dpr, 780 device rows) → k 2, 844×390 world px; a 3-dpr phone (1170 rows) → k 3, 390 rows. The camera
  works in world px (`RetroCam`), shake is whole pixels, and every sprite lands on a whole pixel.
- **pixelize() for every sprite (§1.2).** Painted at 3× (fans 2×), box-filtered, alpha cut at 0.5, mapped to a
  palette of at most 24 colors built from the look and the kit, edge blends snapped to a neighbouring region, stray
  pixels cleaned, then a 1-px ink outline. Eyes are stamped as pixel eyes (whites, iris, pupil, a 1-px catchlight).
  Players, fans, the ball (8 pre-pixelized spins), hoops, nets (1-px strands), banners, the LED ribbon, the jumbotron,
  shadows (flat ellipses), reflections and markers are all in the grid.
- **Backgrounds baked once a match.** Four layers at world resolution (far wall at parallax 0.6, stands 0.85, the floor
  and court 1.0, the rims), 60–160 ms once per match. Gradients become flat steps (3 in the first segment, 2 in each
  further one: 3–5 per gradient) and a colour covering less than 0.04% of a layer snaps to its neighbours' dominant
  colour. No dither on large areas; beams and glows use a 2-step checker (0.55 / 0.28).
- **The crowd.** A pixelized fan atlas, saturation ×0.8 (20% under the players), always outlined.
- **Retro Ball Font (§1.3).** `028_rbfont.js`: a bitmap font in code, 8×10 cells, capitals, lowercase, digits,
  punctuation and the game's symbols, 2-px strokes with knocked corners, 1-px letter spacing. Every `fillText`,
  `strokeText` and `measureText` in the RetroBall family draws through it at a whole scale only (the size ÷ 11,
  rounded; on the screen never under the UI's k), from an LRU of rendered strings. Titles are 4–6× with a 2-step
  yellow → orange ramp, a 2-px outline and a 2-px drop shadow; the logo's O is a pixel basketball. Body paragraphs are
  2× and wrap at 60 characters. The L8 5×7 pixel font and the system-font fallbacks are gone: `fontStr` and `fontBody`
  only name RetroBall.
- **Menus use the same pixel characters.** Portraits (`rtPortrait`), the hub, create, draft and title mannequins
  (`drawPixelFigure`: the in-game sprite renderer with one sprite pixel = the UI's k) and the face editor's big face
  (`drawFaceUI`, new). While a face slider moves, the editor draws a half-size draft (double pixels) and the full face
  once the look is still for 0.3 s: 20–30 ms a step instead of 50–135 ms.
- **Settings → Graphics: Retro (default), Retro sharp (k one step smaller), Smooth.** Saves with the L15 Pixel
  setting open in Retro. The L15 "pixel players over a smooth scene" composite is deleted (`125_pixel.js`).
- **Art Lab → Retro check** (six pages, replaces Pixel check): the in-game frame at 1280×720 and on a phone, 4× crops
  of each character, the fan strip, a hoop, a banner, the HUD and a menu, and the font specimen. It runs the automated
  §1.5 checks: no scaled draw with smoothing on in Retro, every glyph at a whole scale, no other font, no gap in a
  character's 1-px outline, ≤ 24 colors a sprite.
- **In Retro the camera doesn't zoom, punch in or drift** (`camera.retroLock`): a zoom would rescale the pixel world
  and invalidate the bakes.
- **The screens reflowed for the wider font.** At 2× the bitmap font is about twice as wide as the old 12 px text, and
  it can't shrink below 2×. About 40 overflows on some 30 screens were fixed: wrapped paragraphs (`ui.para`;
  `wrapTextH` returns the real height), labels and headings with a width limit (truncated with …), selects that move
  their left arrow for a long value, the How to Play tips one at a time (◀ Tip / Tip ▶), shorter copy where a line had to fit (the hub's week
  buttons show a short sub-label when the long one doesn't fit), and the hub's right column 20 px wider. The phone
  audit now honours a width limit (a truncated label is not an overflow).

**Round fixes (the three visual rounds, below)**

| Round | Seen | Fix | Config |
| --- | --- | --- | --- |
| 1 | the HUD's "1ST HALF" ran into the left score | the period label picks the longest of 1ST HALF / 1ST / H1 that fits the center block | — |
| 1 | the floor's soft light pools and specular bars quantized into irregular orange smears | Retro: each pool is two flat ellipses; no specular bars | `rtPoolStep` 0.28 (new) |
| 1 | a player's reflection was a full translucent ghost under him | only the shoes and legs reflect | `rtReflectH` 0.3 (new) |
| 2 | every venue, Classic 1v1, 3v3, the phone | consistent; no change | — |
| 3 | 4× crops: some fans had a light-blue blob by the eye (a phone's glow) that read as a tear | the phone is held at the chest, no glow | — |

**The ALSO items**

- **The pump fake picks up the dribble** (`rules.fakePicksUp`, replaces `rules.standstillFake`). Every pump fake ends the
  dribble: walking after it is a TRAVEL, dribbling is a DOUBLE DRIBBLE. Smoke checks both, in every ruleset.
- **Short games during development** (`CONFIG.dev.gameSeconds` 24, `otSeconds` 8). Every game you play is 24 s (two
  12 s halves, 8 s overtime). The simulators, the gate and the career simulator keep their real lengths. R10 sets it
  back to 0.
- **Bugs fixed:** the trade screen drew the other player's stat bars twice, one set under the panel title; the team
  hub's season summary sat over the PLAY button; the management page showed "staff −0" with no staff (now "no staff");
  the film room's tips were spaced for 20 px lines and ran into each other; the pro result's rating names ran into
  their numbers; the HUD period label (round 1); the fan phone glow (round 3). A syntax check now runs after every
  build (`build.js`).

**New constants** (all with a one-line comment in the file): `ART.rb*` (font: `rbPxPerScale` 11, `rbCacheN` 900,
`rbLineGap` 2, `rbBodyChars` 60, `rbTitleMin` 2, `rbTitleMax` 3, `rbTitleRamp`, `rbTitleInk`, `rbTitleOutline` 2,
`rbTitleShadow` 2); `ART.rt*` in `126_retro.js` (`rtRows` 360, `rtSuper` 3, `rtSuperFan` 2, `rtAlphaCut` 0.5,
`rtColors` 24, `rtCrowdSat` 0.8, `rtGradSteps` [3, 2], `rtDominant` 0.0004, `rtDominantMin` 6, `rtEyeW` 0.118,
`rtReflectA` 0.2, `rtReflectH` 0.3, `rtShadowA` 0.34, `rtBudget` [5, 9] ms, `rtBallFrames` 8, `rtCheckerA`
[0.55, 0.28], `rtBannerW` 1.75, `rtBlendErr` 420, `rtInner` 0.32, `rtInnerMix` 0.4, `rtFaceSettle` 0.3 s,
`rtPortraitBig` 160); `ART.rtPoolStep` 0.28 (`124_court.js`); `CONFIG.dev.gameSeconds` 24 and `otSeconds` 8;
`CONFIG.rules.fakePicksUp` true. Removed: `rules.standstillFake` and the L15 Pixel mode's constants.

**Measured**

| | L19 (before) | R1 |
| --- | --- | --- |
| Styles on one screen | pixel players (3 px) over a smooth scene | one pixel world, 2 screen px a pixel at 720p |
| World grid, 1280×720 | — | k 2, 640×360 world px |
| World grid, phone 844×390 at 2 dpr | — | k 2, 844×390 world px (390 rows) |
| Scaled draws with smoothing on (Retro) | — | 0 |
| Glyph draws off a whole scale | — | 0 of 43 (desktop match), 0 of 52 (phone), 0 of 96 (Art Lab) |
| Text in any other font | system fonts in menus | 0 |
| Gaps in a character's 1-px outline | — | 0 (400 sprites scanned in the Art Lab) |
| Most colors in one sprite (limit 24) | — | 20–23 |
| Backgrounds baked | — | 79 ms once a match (60–160 ms by venue) |
| Head width at game size | — | about 32 world px (R2: 45 px for a 2 m player) |
| Perf, 844×390 @2x, the pro arena, guard 0 | 22.0 / 36.7 ms | 17.8 / 25.9 ms (median / p95) |
| Perf, guard 1 | 19.4 / 26.2 ms | 17.0 / 22.0 ms |
| Text overflows (the phone audit, now also run at 1280×720) | — (the old font fit) | 0 and 0, 66 screens each |

**Deviations**

- The spec asks for three visual rounds against the Basketball Bros screenshot in `reference/`. There is none:
  `reference/` has `README.md` and `face-construction.png`. The rounds were judged against §1's own description (one
  pixel style everywhere, flat colors, 1-px outlines, 3–5 step gradients, bitmap text, characters original) and are
  listed above.
- Heads are about 32 world px wide at game size, not 44–52: the players are still drawn at L13's size (2 m = 1/9 of an
  18 m court). R2 (next) draws them about 1.3× bigger (a 15 m court, visual scale 1.1): a 2 m player's head is then
  45 world px on a 720p screen (measured on the R2 build).
- At the current size the bodies' shading breaks into small clusters (a 30-px body has little room for 3 jersey tones).
  Revisited in R2 with the bigger players.
- Menus keep the L8 UI kit's panels and buttons (smooth rounded rectangles). All their text is the bitmap font and all
  their characters are pixel art; the kit itself is R10's "one consistent Retro UI kit" (§4).

**Tests on the committed build**

- Smoke 100/100, desktop 1280×720 and phone 844×390, including the R1 steps: the retro grid and the §1.5 checks on
  both, Retro sharp (k 1 at 720p), the Graphics setting and its migration, and the pump fake picking up the dribble.
- Modes 13/13. The first run on the final build failed once: the test could press PLAY on the high-school hub a frame
  before the hub put up the "first day" story card. The test now lets a frame pass first; the rerun passed.
- Old saves 16/16 · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit, 66 screens at 844×390 and at 1280×720 (`--desktop`): no text overflow, no errors. (Its "smallest text"
  column lists requested sizes; the bitmap font never draws under 2 device px per font pixel on the screen.)
- Art Lab: 54 shots, no errors (`shots/r1/round-final/`; the Retro check pages are `lab-10-retro-p0…p5`).
- The gate, the balance harness and the career simulator ran on the build before the visual-round fixes (they only
  change drawing): the gate's Legends mirror 1.21 PPP ✓, team A 49% ✓, Legend beats Pro 86% ✓, brute force vs Pro
  0.82 ✓, sniper 1.47 (timing beats brute force ✓); the harness (Classic): brute 1.24 ✓, timing 2.12 ✓, Legend vs Pro
  78% ✓; the career simulator (40 careers): 0 stuck, OVR 57 / 69 / 77 at 17 / 21 / 25, peak 79, 1.02 titles a career,
  Hall of Fame 13% — every target met.

## The playtest pass (L11–L19): the report

Nine milestones, one commit each, every one measured before and after with the spec's own test. The final build is the
L19 commit, and the artifact is republished from it to the same link. `shots/before-after-l11-l19/` has 29 before/after
pairs, desktop and phone, captioned with these numbers.

**Every milestone, before and after** (before = the build the spec verified the problem on, L10, or the previous
milestone's; after = the final build's smoke run unless noted):

| Milestone | The measurement | Before | After | Target |
| --- | --- | --- | --- | --- |
| L11 running back on defense | a defender 1.6 m behind a standing handler sprints 3 s for his hoop | never past; moved 1.54 m, shoved the handler 0.69 m | past at 0.36 s without jumping, 90% of speed kept, the handler pushed 0.00 m | past within 0.6 s ✓ |
| L12 travel and double dribble | jump with the ball, land holding it | no call, dribbled on 2.15 m | TRAVEL 0.000 s after landing, the ball to the other team (Arcade, Sim and half court); a picked-up walk → TRAVEL, a picked-up dribble → DOUBLE DRIBBLE | within 0.2 s ✓; bot travels 0 a game (L12's 30-game run; < 0.2 ✓) |
| L13 true size | a 2 m player as a share of the court length | 1/5.0 (13 m court, drawn 1.3×) | 1/9.00 (18 m, drawn true size, the floor band 30%) | 1/9–1/10 ✓ |
| L14 symmetric faces | the 12 lab faces at 256 px, the left half mirrored onto the right | 9.4–18.8% different; eye width ratio 1.29; eye height difference up to 0.036 | 0.04–0.12% (the side part 4.70%, exempt); ratio 1.00; difference 0 | < 3%, 1.00, 0 ✓ |
| L15 Pixel mode | Pixel vs Smooth, the same frame, outside the players' and ball's boxes | the whole venue quantized to 32 colors and dithered | 0.000% of 873,954 px differ | < 1% ✓ |
| L16 the 1v1 blob | 60 s of Pro vs Pro, heads tracked on screen (seed 77 · seed 91) | median head overlap in close play 19.8% · 23.3%; a face up to 100% hidden | 0.0% · 0.0%; at most 44.1% · 49.2% hidden (the final smoke's 30 s: 0.0%, 45.2%) | < 30%, ≤ 60% ✓ |
| L17 the crowd | the fan atlas; the band behind the bodies (Legends Arena) | — ; bright pixels 3.32%, lettering 3.41% | saturation −20.3%, contrast −20.2%; bright 0.00%, lettering 0.00%; the LED ribbon at 2.22–2.58 m above the lowest row (was 0.6–1.0 m); fans 1.45 m in 3 rows (was 0.95 m) | −20% ✓, nothing bright or lettered behind the bodies ✓ |
| L18 phone layout | 844×390 and 390×844 | 5 controls over the players or the HUD; idle 55% opaque; the jumbotron drawn | 0 over them (all in the floor band under the 70% floor line); idle 40% opaque; no jumbotron; 390×844 the rotate screen | nothing over the court or HUD ✓ |
| L19 balance | the gate, Legends View | mirror PPP 1.48, team A 44%, Legend beats Pro 77%, brute force 1.00, timing 1.95 | 1.20, 49%, 85%, 0.82, timing 1.47 and reads 1.23 | 0.95–1.25 ✓, 45–55% ✓, 75–95% ✓, ≤ 1.3 ✓, reads beat brute ✓ |

**Every test on the final build**

- Smoke 100/100: desktop 1280×720 and phone 844×390, including every L11–L19 step above.
- Modes 13/13 · old saves 16/16 · dev tools all OK (1,000 balls, 0 tunneled).
- Phone audit: 66 screens, no errors. The smallest text (2.0 px "B") is the venue's own lettering in the background, as
  since L13.
- Art Lab: 50 shots, no errors (`shots/l19/round-final/`).
- The gate (`tests/gate.js`, 300 mirror games, 200 Legend vs Pro, harness 12 a cell):

  | | Legends | Classic |
  | --- | --- | --- |
  | Pro mirror PPP | 1.20 ✓ | 1.64 |
  | Pro mirror: team A wins | 49% ✓ | 50% |
  | Legend beats Pro | 85% ✓ | 81% |
  | Harness vs Pro: brute · spam · drives · threes · timing · reads | 0.82 ✓ · 0.18 · 0.68 · 1.00 · 1.47 ✓ · 1.23 | 1.24 · 0.37 · 1.53 · 1.60 · 2.05 · 1.82 |

- The balance harness (`balance.js 12 21`, Classic): brute force 1.24 ✓, timing 2.05 ✓, Legend beats Pro 79% ✓.
- The career simulator (40 careers): median OVR at 17 / 21 / 25 = 57 / 69 / 77, peak 79, titles 1.02 a career, Hall of
  Fame 13%, 0 stuck. Every target passes.
- Perf (844×390 @2x, the pro arena): guard level 0 22.0 / 36.7 ms (median / p95), level 1 19.4 / 26.2 ms, level 4
  11.0 / 16.7 ms. At 4× CPU the guard reaches level 4 by itself (67.7 ms). L14 was 18.1 / 26.9 ms at level 0. The
  difference is the full-resolution Smooth venue that L15 asks for (L15's notes have the breakdown).

**Deviations, with reasons**

- **L14:** the spec's `reference/` folder didn't exist. `reference/face-construction.png` is a construction sheet drawn
  from the spec's proportions, and the three visual rounds were made against it. Modes, old saves, dev tools and the
  phone audit ran on L14's first cut; smoke, Art Lab and perf ran again on the optimized paint.
- **L13:** the ratings spread matters less on an 18 m court, so the All-Star fan vote gained a star-power term for it to
  keep picking stars. The PPP target moved to L19, as the spec planned.
- **L15:**
  - Deleting the pixel font and dithering took the pixel menus, digits and callouts with them. The Art Lab's Pixel check
    went from 4 pages to 2.
  - The venue's far layer and crowd went to full resolution in both modes, so the banners are crisp. This costs 4–5 ms
    a frame on a phone-sized CPU canvas. Guard level 1 falls back to half resolution.
- **L16:** heads are measured geometrically (each pose's head ellipse, 60 samples a second), not from pixel masks.
- **L17:**
  - The bigger-fan rows are in the Legends Arena and in the pro arena in Legends View. The college arena and the gym keep
    their crowds but get the dark band.
  - The pro arena's foreground silhouettes are hidden in Legends View.
  - The crowd filter is `saturate(1.08) contrast(0.8)`: contrast alone already pulls saturation down 23%, and
    `saturate(0.8)` with it measured −34%.
- **L18:**
  - The spec calls 390×844 "the rotate screen", so a portrait phone keeps it for matches too. A portrait match layout was
    built and dropped.
  - "The court" is read as the players' zone, down to a near-lane player's feet. The controls sit on the painted floor
    band under it, 40% opaque while idle.
- **L19:** the listed levers alone stalled at 1.33 PPP. Each extra miss came back to the offense, because rim misses
  bounced to the finisher 71% of the time. A 1.3 s finisher recovery (Legends View only) was added to the contests,
  closeouts, contested layups and the 10 s clock. The career simulator is unchanged by L19: its league games use the
  ratings model.
- **Tests:**
  - The phone stick-drag smoke step was made robust twice: it holds for game time, not wall time, and it drags away from
    the opponent, because walking into a set handler is real contact (L11). It still requires 0.3 m of movement.
  - The gate's PPP target is now the spec's 0.95–1.25 (was 0.90).
- **Runs:** not every milestone ran the whole suite. L15 and L16 skipped the gate (the spec doesn't ask for it there;
  L16's contact change shows in L19's "before" gate), and L17 and L18 ran smoke, phone audit and Art Lab only. The final
  build ran everything above.

## L19 — Balance: the Legends mirror into 0.95–1.25 PPP (playtest pass, milestone 19)

The playtest: the Pro mirror scored 1.44 points per possession (L10). On the L13 layout with the L11–L12 rules (and
L16's 0.95 m contact) it scored 1.48, and the mirror's team A won only 44%.

**What drove it** (`l19/diag.js` in the working notes: 150 Pro-vs-Pro Legends games, every shot and rebound logged):
- Almost no turnovers (0.009 a possession), so nearly every possession ends in a shot.
- The offense rebounded 44.8% of its misses. A miss at the rim came back to the finisher 64–71% of the time, because he
  lands under the ball. Jumper misses came back 32–37%. Second chances made 16.8% of the points.
- Contests alone couldn't fix it. The spec's levers at full strength stalled at 1.33: every extra miss fed the offensive
  glass, and offensive rebounds rose to 51%.

**What changed** (Legends View only, through the layout's tune table; Classic keeps every value):

| Lever | Before | L19 | Config |
| --- | --- | --- | --- |
| contest distance: full inside, fading over | 0.95 m, 1.45 m (L13) | 1.05 m, 1.7 m | `contest.proxNear`, `contest.proxRange` |
| contest strength on jumpers | 0.5 | 0.7 | `shot.contestPenalty` |
| the contested-layup rate | 0.6 | 0.8 | `shot.layupContest` |
| AI closeouts: fly at a jumper from | 1.73 m (Classic 2.0, scaled) | 2.6 m | `ai.flyCloseout` |
| AI closeouts: close out on a gather from → to | 2.6 → 1.0 (scaled) | 3.0 → 0.85 | `ai.closeoutFrom`, `ai.closeoutGap` (new; Classic keeps 2.6 and 1.0) |
| shot clock | 12 s | 10 s | `rules.shotClock` |
| a finisher can't grab his own miss for | 0 s | 1.3 s | `rebound.finisherRecoverS` (new) |

- The finisher's recovery covers a layup, a dunk or a tip. He is still coming down from the contact. The ball stays live
  for the defender, and the shooter can have it once the 1.3 s are up. This lever is not on the spec's list; see the
  deviations.
- The tune table now accepts any config path, not only the scaled registry's. A path is captured the first time Legends
  View tunes it, and Classic gets it back (`_tuneExtra` in `useLayout`).
- The gate's target is the spec's 0.95–1.25 (was 0.90–1.25).

**Tuning rounds** (`l19/lgate.js`: the Legends half of the gate with the tune applied; 300 mirror games, 200 Legend vs
Pro, harness 8 per cell). C7 shipped:

| Run | contest penalty | layup contest | finisher recovery | fly closeout | closeout gap | mirror PPP | team A | Legend beats Pro | brute vs Pro | timing vs Pro | reads vs Pro |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | 0.65 | 0.80 | 1.0 s | 1.73 m | 1.0 | 1.276 ✗ | 52% | 85% | 0.93 | 1.57 | 1.26 |
| C2 | 0.65 | 0.80 | 1.2 s | 1.73 m | 1.0 | **1.221** | 49% | 86% | 0.87 | 1.53 | 1.18 |
| C3 | 0.65 | 0.80 | 1.2 s | 2.6 m | 1.0 | **1.222** | 51% | 86% | 0.87 | 1.53 | 1.20 |
| C4 | 0.70 | 0.80 | 1.2 s | 1.73 m | 1.0 | **1.207** | 54% | 89% | 0.92 | 1.43 | 1.18 |
| C5 | 0.65 | 0.80 | 1.2 s | 2.6 m | 0.85 | **1.238** | 48% | 83% | 0.87 | 1.59 | 1.34 |
| C6 | 0.70 | 0.80 | 1.2 s | 2.6 m | 0.85 | **1.201** | 52% | 88% | 0.92 | 1.38 | 1.20 |
| C7 (shipped) | 0.70 | 0.80 | 1.3 s | 2.6 m | 0.85 | **1.186** | 53% | 84% | 0.72 | 1.44 | 1.14 |
| C8 | 0.65 | 0.85 | 1.3 s | 2.6 m | 0.85 | **1.202** | 50% | 79% | 0.66 | 1.65 | 1.26 |

All eight runs use the 10 s shot clock and contests at 1.05 m / 1.7 m. The closeout range (C3, C5) moved nothing on its
own; the finisher's recovery and the contest strength did the work. C7 has the most room under 1.25 with every other
target in range.

**The gate** (`node tests/gate.js`: runSims 1v1 Pro mirror 300 games both ways round, Legend vs Pro 200 games, the
harness 12 games per cell). L18 → L19:

| Legends View | L18 (before) | L19 (after) | Target |
| --- | --- | --- | --- |
| Pro mirror PPP | 1.48 ✗ | **1.20** ✓ | 0.95–1.25 |
| Pro mirror: team A wins | 44% ✗ | **49%** ✓ | 45–55% |
| (the side attacking right) | 55% | 55% | — |
| Legend beats Pro | 77% ✓ | **85%** ✓ | 75–95% |
| PPP Legend / Pro | 1.66 / 1.32 | 1.32 / 0.93 | — |

| Harness PPP (scripted human) | L18 vs Pro / vs Legend | L19 vs Pro / vs Legend |
| --- | --- | --- |
| brute force (sprint + Shoot) | 1.00 / 0.59 | **0.82** / 0.54 (≤ 1.30 ✓) |
| button mash | 0.17 / 0.08 | 0.18 / 0.15 |
| only drives | 1.08 / 1.11 | 0.68 / 0.46 |
| only threes | 1.18 / 0.96 | 1.00 / 0.56 |
| perfect-timing jumpers | 1.95 / 1.45 | **1.47** / 0.95 (beats brute force ✓) |
| reads the defender | 1.72 / 1.17 | **1.23** / 0.55 (beats brute force ✓) |

Classic is unchanged: mirror PPP 1.64, team A 50%, Legend beats Pro 81%, and the harness is the same (brute force 1.24,
timing 2.05).

**The Pro mirror, before and after** (`l19/diag.js`, 150 games each):

| | L18 | L19 |
| --- | --- | --- |
| PPP | 1.492 | 1.191 |
| possessions per game (first to 21) | 25.6 | 31.5 |
| shots per possession | 1.251 | 1.166 |
| offensive rebounds | 44.8% | 26.7% |
| a rim miss back to the finisher | 71% (defender in the air) · 64% | 17% · 43% |
| second-chance points | 16.8% | 8.0% |
| contested mid-range jumpers: share · FG | 26.7% · 43% | 23.9% · 26% |
| contested layups: share · FG | 6.5% · 33% | 8.3% · 13% |
| shot-clock violations per game | 0.08 | 0.29 |

**The career simulator** (`careersim.js 40`) is identical to L18's to the last digit: the career's league games play
through the ratings model, not the tuned Legends match engine. Median OVR at 14/17/21/25/29/33 is 42 / 57 / 69 / 77 / 79 /
69, the peak 79, titles 1.02 a career and the Hall of Fame 13% (5 of 40), with 0 careers stuck. Every target passes. The
Classic balance harness (`balance.js 12 21`) is identical too: brute force 1.24 ✓, timing 2.05 ✓, Legend beats Pro 79%
✓.

Tests: smoke 100/100, with the new L19 step: Legends View gets the 10 s clock and every tuned value, Classic gets
each one back, a live match starts its clock at 10 s, and a finisher can't pick up his own missed layup at 0.9 s but
can at 1.35 s. Also: modes 13/13, old saves 16/16, dev tools OK, phone audit no errors, Art Lab 50 shots with no errors.
Perf (844×390 @2x, the pro arena) is 22.0 / 36.7 ms median / p95 at guard level 0 and 19.4 / 26.2 ms at level 1; at 4× CPU
the guard engages by itself. `shots/l19/` has the Legends shot clock before (12 s) and after (10 s), 1.5 s into a
possession, on desktop and phone.

## L18 — Phone layout (playtest pass, milestone 18)

The playtest: on a phone the touch buttons sat over the court, and the jumbotron collided with the score bug.

What changed
- **Floor line at 70%.** The Legends View camera already puts the floor line at 70% of the screen height on every screen
  (L13). The test now checks it on the phone: 273 of 390 px.
- **Every touch control is in the floor band below the floor line**, so the court the players stand on sits above the
  buttons. This applies to a Legends View match on a landscape touch screen (`TouchControls.fitBand`, from
  `Game.touchBand()`).
  - The stick sits at one end with its hint beside it ("▼ POST UP").
  - The buttons (Shoot, Jump, Move/Steal, Pass/Fade, Super) sit in a row at the other end, centered in the band.
  - The band starts under the floor line and under the feet of a player in the near lane (the lanes draw players up to
    19 px lower), plus 4 px (`ART.touchBandGap`).
  - Every control stays at least a 64 px tap target (radius 32; Shoot and the stick 43 at 844×390).
  - Left-handed mode mirrors the layout. A screen too narrow for the hint drops it (`ART.touchHintW`).
  - The band comes from the camera's nominal layout, so the controls never move in play. Classic view keeps the old
    cluster.
- **60% transparent when idle.** A control draws at 40% opacity idle and fully opaque while pressed (`touchAlpha`:
  `ART.touchIdleA` 0.4 at the default Touch opacity setting `ART.touchOpacityRef` 0.55; the setting scales both). The
  pause button stays fully visible. Before, everything drew at a flat 55%.
- **No jumbotron on a phone** (a touch screen under 500 px on its short side). It sat right under the score bug.
- **390×844 shows the rotate screen**, as before. The spec calls that size "the rotate screen", so a portrait phone still
  asks to be turned for matches and menus alike.

**Measured** (`l18/phones.js`: a Legends View 1v1 on a phone, 2.5 s in, guard level 0). "Over the players" means a
control's circle reaches into the players' zone: from the backboards' top down to a near-lane player's feet, y 292. "Over
the HUD" means it touches the score bug.

| 844×390 | L17 | L18 |
| --- | --- | --- |
| floor line | 70% (y 273) | 70% (y 273) |
| controls over the players or the HUD | 5: Shoot (y 279, r 44), Jump (y 232), Super (y 196), Pass (y 312), the stick (y 284, r 65) | **0**: all six in the floor band, centers at y 342, the tops at y 299 and lower (Shoot and the stick r 43, the rest r 32) |
| idle opacity | 0.55 | **0.40** (1.00 pressed) |
| jumbotron draws per frame | yes (3 of 3 frames) | **0** (desktop still draws it) |
| pause button | 799, 45 (clear of the HUD at x 192–652) | same |
| **390×844** | the rotate screen | the rotate screen |

The new smoke step "phone layout (L18)" asserts all of this: the floor line at 70% ± 1%, no control above a near-lane
player's feet or over the HUD, no control under a 64 px tap target, idle opacity 0.40 below the pressed one, no jumbotron on the phone
while desktop draws one, and the rotate screen at 390×844. Screenshots at both sizes, before and after, are in
`shots/l18/`.

Tests: smoke 99/99, with the new L18 step; phone audit no errors; Art Lab 50 shots with no errors. The first cut started
the band 6 px under the floor line. A near-lane player's feet reach 19 px below it, so the band now starts under those
feet, and the test and the measurement count them. Modes, old saves and the gate run at L19.

## L17 — The players read against the crowd (playtest pass, milestone 17)

The playtest: the players got lost in the crowd. Bright shirts, lettered LED boards and the scorer's table sat right
behind the bodies, and the crowd was as vivid as the players.

What changed
- **The crowd is 20% less saturated and 20% less contrasty.** The fan atlas is baked through `saturate(1.08)
  contrast(0.8)` (`ART.crowdSat`, `ART.crowdContrast`). The saturate amount is above 1 because contrast() already pulls
  colors toward gray: `saturate(0.8) contrast(0.8)` measured −34% saturation. With 1.08 both land at −20% on the atlas.
- **A soft dark band behind the players** (Legends View; `ART.bodyBand`, `ART.bodyBandA`): full strength (0.6) up to
  0.9 m, 0.38 by the head zone at 2.05 m, and gone by 2.4 m.
- **The LED ribbon and the scorer's table go above the lowest crowd row.**
  - The ribbon runs at 2.22–2.58 m (`ART.lgLedY`; it was the courtside board at 0.6–1.0 m), above the players' heads.
  - The scorer's panel moves into the ribbon at midcourt (`ART.lgTable`).
  - Courtside becomes a dark padded wall with the benches in shadow and a plain table (`drawCourtsidePlain`).
  - Nothing lettered or brightly colored stands behind the bodies.
- **Bigger fans, three rows** (the Legends spec's §5 crowd). Fans are 1.45 m tall (`ART.lgFanM`; was 0.95), 0.72 of a
  2.0 m player: a little smaller than the players, with readable faces.
  - The seats are at 0.85, 2.45 and 3.35 m (`ART.lgRowY`): one row under the ribbon (the upper deck's front) and two
    above it.
  - The Legends Arena and the pro arena in Legends View use these stands. The college arena and the gym keep their
    crowds, get the band, and in Legends View the college arena gets the plain courtside.
  - To make room, the Legends Arena's banners hang from 6.0 m (was 4.6) and the upper bowl's dot crowd starts at 4.8 m
    (was 3.3; `squashFrom.legends` 5.0).
- In Legends View the pro arena's foreground silhouettes (fans in front of the court) are gone. They stood over the
  bottom of the court and the phone's controls.

**Measured** (`l17/measure.js`: 1280×720 Legends View frames with the players and the ball hidden, guard level 0).
Zones are heights above the floor line, between the hoop stanchions (1 m in from each baseline). Atlas numbers are over
its opaque pixels. "Bright" = HSV value over 0.75 and saturation over 0.45. "Lettering edges" = neighbor luma steps over
0.35.

| | Legends Arena L16 → L17 | Pro arena (Legends View) L16 → L17 | College | Gym |
| --- | --- | --- | --- | --- |
| crowd atlas saturation | 0.543 → 0.433 (**−20.3%**) | 0.511 → 0.405 (**−20.7%**) | 0.509 → 0.400 | 0.539 → 0.417 |
| crowd atlas contrast (luma RMS) | 0.248 → 0.198 (**−20.2%**) | 0.268 → 0.214 (**−20.1%**) | 0.272 → 0.217 | 0.258 → 0.206 |
| behind the bodies (0.2–1.5 m): bright pixels | 3.32% → **0.00%** | 3.38% → **0.00%** | 1.36% → 0.10% | 26.4% → 0.10% |
| behind the bodies: lettering edges | 3.41% → **0.00%** | 4.36% → **0.00%** | 2.64% → 0.01% | 2.45% → 0.00% |
| behind the bodies: mean luma | 0.267 → 0.133 | 0.234 → 0.131 | 0.304 → 0.106 | 0.570 → 0.261 |
| behind the heads (1.5–2.4 m): bright · edges | 6.70% · 2.81% → 0.00% · 0.05% | 6.88% · 5.31% → 0.00% · 0.05% | 6.39% · 4.96% → 0.27% · 0.72% | 0.41% · 1.22% → 0.00% · 0.01% |
| fans (m) · rows | 0.95 · 3 → **1.45 · 3** | 0.63 · 8 → **1.45 · 3** | 0.61 (unchanged) | 0.63 (unchanged) |
| LED ribbon | 0.6–1.0 m (behind the bodies) → **2.22–2.58 m**, over the lowest row (seated at 0.85 m) | same | — | — |

The new smoke step "players read against the crowd (L17)" renders the Legends Arena and the pro arena and asserts these
(saturation and contrast ×0.80 ± 0.03, under 0.5% bright or lettered behind the bodies, a darker head zone than the
crowd, three rows of 1.2–1.8 m fans, the ribbon over the lowest row). Before and after frames of all four venues
(desktop) and the phone are in `shots/l17/`.

Tests: smoke 98/98, with the new L17 step; phone audit no errors; Art Lab 50 shots with no errors. This is a rendering-only
milestone, so the modes, old saves and gate runs wait for L19.

## L16 — Stop the 1v1 blob (playtest pass, milestone 16)

The playtest: when one player guards the other, the front player's head almost completely hides the other face.

What changed (Legends View)
- **Pushed apart, visually.** Two players whose heads come closer than a head width are drawn pushed apart, up to 0.25 m
  each. This happens when one head overlaps the other's head or torso on screen. It changes the drawing only: the body,
  its shadow and the pixel sprite move, and the hitboxes don't.
  - `ART.pushApart` 0.25 m. The full push applies from a third of a head width in: amount = 0.25 × min(1, 3 × (1 − gap ÷
    head width)).
  - The push eases in fast (150/s), so a burst or a stumble doesn't catch a face behind a head, and eases out gently
    (12/s).
  - The overlap is judged on screen from the head each pose drew on the last frame, so leans, jumps and lane offsets
    count.
- **Draw order.** The player farther from the ball is drawn first, 0.1 H higher, at 0.92 scale (`ART.overlapRaise` 0.05 →
  0.1, `ART.overlapScale` 0.94 → 0.92). A player passing through another (L11) is still drawn behind. A tie (both the same
  distance from the ball) puts the defender behind.
- **Contact 0.95 m.** The Legends body contact distance is 0.95 m (`CONFIG.layout.legends.bodyContact`; was 0.75). It
  still applies only in the L11 contact situations: a drive into a square defender, box-outs, post-ups and back-downs.
  The gaps the AI and contests scale from (`contactDist`, the LP base) stay at 0.75, so sag, contest and reach distances
  don't move. Its balance effect is measured in the L19 "before" gate.

**The test** (smoke, "the 1v1 blob (L16)", and `blob.js` for 60 s). Pro AI plays Pro AI in Legends View, sampled at
60 Hz of game time. Each sample poses both players through `drawCharacter`, and a head is the pose's head ellipse.
- Head overlap = the heads' horizontal overlap ÷ a head width, counted in "close play" (the players under 1.5 m apart).
- Face hidden = the share of the behind player's head covered by the front player's head or torso.

| 60 s, Pro vs Pro | L15 seed 77 | L16 seed 77 | L15 seed 91 | L16 seed 91 |
| --- | --- | --- | --- | --- |
| median head overlap, close play (target < 30%) | 19.8% | **0.0%** | 23.3% | **0.0%** |
| p90 head overlap, close play | 78.3% | 24.1% | 88.8% | 26.1% |
| most any face is hidden (target ≤ 60%) | 100% | **44.1%** | 100% | **49.2%** |
| frames with a face over 60% hidden | 246 | **0** | 583 | **0** |
| p99 face hidden | 88.1% | 28.2% | 100% | 34.5% |

(3,600 samples each; 2,266–2,536 in close play.) The smoke step runs 30 s on seed 77 and asserts the two targets and
the values. `shots/l16/` has a close-play frame before and after, on desktop with a 2× crop and on the phone.

Tests: smoke 97/97, with the new L16 step. The first run failed "phone: stick drag moves the player" again (0.06 m).
The step dragged the stick toward the AI player, and in the failing runs the human defender stood in front of a set
handler. Walking into him there is real contact (L11): a repro moves 0.52 m in 0.84 s at the old 0.75 m contact and
0.33 m at 0.95, against 3.57 m walking away. The step now drags away from the opponent, clears any Freeze first and
prints the player's state if it fails. Also: modes 13/13, phone audit no errors, Art Lab 50 shots with no errors. The
gate isn't run here (the spec doesn't ask for it at L16); the contact change is in L19's "before" gate.

## L15 — Pixel mode is for the players and the ball only (playtest pass, milestone 15)

The playtest: Pixel mode pixelized and dithered everything. Banner text ("POSTER NIGHT"), the LED ribbon and the
jumbotron came out in chunky pixels, as did the crowd, the floor and the backgrounds, and menus drew with 2-pixel pixels
on phones and 1080p screens.

What changed
- **Pixel mode pixelizes only the characters and the ball.** The match renders with the Smooth renderer at full
  resolution: the HUD, menus, callouts, banners, the LED ribbon, the jumbotron, the crowd, the court, the hoops and the
  backgrounds. The bright Legends look is kept.
  - Each character is painted at 3× (2× on a phone) into a scratch canvas. It is box-filtered down to sprite pixels,
    alpha-thresholded, quantized to its own palette and outlined 1 px, as before. The ball keeps its 8 pre-pixelized
    rotation frames.
  - Sprites are composited into the full-resolution scene at an integer scale: each sprite pixel is
    k = max(2, round(device height ÷ 240)) device pixels, drawn with smoothing off. A sprite's corner is snapped to that
    k-pixel grid (k = 3 at 1280×720 and at 844×390 @2x).
- **Deleted:**
  - the 32-color venue quantizer and its Bayer dithering (`pxQuantizeRect`, `pxVenuePalette`, `pxBuildPalette`, `BAYER4`);
  - the low-resolution scene buffer (`pxBegin`, `pxBlit`, `pxSnapCam`) and pixel particles;
  - the pixel font, pixel callouts and pixel digits (`PX_FONT`, `pxText*`, `pxDrawCallouts`, `PX_DIGITS`);
  - the pixel menus (`PXUI`, `uiPixel`, `pxUIDraw`, `pxRamp*`, `pxNotchPath`, `pxBallIcon`).
  Callouts use the display font and menus are always Smooth. The title logo is crisp again.
- **Crisp venue layers.** The far layer and the crowd were painted into a half-resolution buffer (L10), so banner text and
  fans' faces came out soft in both modes. The buffer is now full resolution (`ART.layerRes` 0.5 → 1). Its blit lands 1:1
  on the device pixel grid: a straight copy, not a resampled one. Performance-guard level 1 falls back to the half-resolution
  buffer (`ART.layerResLow` 0.5). The floor reflections stay at half resolution (`ART.reflectRes`).
- Art Lab → Pixel check has 2 pages (was 4); the pixel-font and pixel-menu pages are gone.

**The test** (smoke, "pixel mode (L15)"). One frame is rendered twice with the same seed and time, in Pixel and in Smooth
(1280×720, `performance.now` and the camera frozen). Every pixel outside the players' and the ball's boxes is compared
(the boxes are padded by 2k).

| | L14 | L15 |
| --- | --- | --- |
| pixels outside the sprite boxes that differ | (the whole venue was quantized and dithered) | **0.000%** of 873,954 px (mean \|Δ\| 0.000%) |
| sprite scale | the whole frame at k = 3 | characters and ball at k = 3, on the k-pixel grid |

Zoomed crops (3×, nearest neighbor) of the scoreboard, a banner, the LED ribbon and a menu are in `shots/l15/`
(`before-crop-*` on L14, `after-crop-*` on L15). Also there: the desktop and phone match frames and the main menu. All
shots are at guard level 0.

**Performance** (tests/perf.js: 844×390 @2x in the pro arena, headless Chromium, which rasterizes the canvas on the
CPU). Pixel mode now costs what Smooth always did, because the venue is drawn at full resolution. L14's Pixel mode drew
the whole scene into a buffer about a ninth of the screen's pixels. The full-resolution venue buffer adds its repaint
every other frame at 30 Hz, which shows in the p95. Level 1 of the guard goes back to the half-resolution buffer.

| Guard level | L14 median / p95 | L15 median / p95 |
| --- | --- | --- |
| 0 (1× CPU) | 18.1 / 26.9 ms | 23.4 / 41.3 ms |
| 1 | 14.4 / 23.5 ms | 20.8 / 29.3 ms |
| 4 (1.25×) | 10.5 / 17.3 ms | 11.4 / 19.3 ms |
| 0 at 4× CPU | 92.2 ms | 124.5 ms |
| 4 at 4× CPU | 59.9 ms | 71.8 ms |

On the same machine and match, L14's Smooth mode measures 21.8 ms and its Pixel mode 17.8 ms. L15 Pixel measures
21.9 ms with the half-resolution venue and 21.6–22.3 ms at full resolution, thanks to the 1:1 blit. At 4× CPU the guard
still engages by itself (level 4).

Tests: smoke 96/96, with the new L15 step. The first run failed "phone: stick drag moves the player": the player moved
0.28 m. The step held the stick for a fixed 0.84 s of wall-clock time, so a loaded machine gave it less play. It now holds
for 0.84 s of game time. Two diagnostic runs moved the player 1.3 m. Also: modes 13/13, old saves 16/16, dev tools OK,
phone audit no errors, Art Lab 50 shots with no errors.

## L14 — Faces front-on and symmetric (playtest pass, milestone 14)

The playtest: faces were painted in a three-quarter view (a near eye bigger than the far one, the nose in profile with
an inked ridge, the mouth and one ear off to the sides), so a head read as turned even when the player faced the
camera, and the two halves of a face never matched.

The construction now follows the big front-facing heads of Basketball Legends / Basketball Bros (original characters
only), with the spec's proportions (u = head width, heights from the crown as a share of crown-to-chin):

| Feature | Spec | Now |
| --- | --- | --- |
| eyes | ±0.19 at 46%, 0.19 × 0.13, iris 0.07 | both eyes identical, ±0.19 (plus the face's spacing), 0.19 × 0.13 and a 0.07 iris (× eye size), on the 46% line |
| brows | 0.05 above the eyes | 0.05 (was 0.045) |
| nose | tip at 62%, centered, nostrils ±0.05, no profile line | a lit tip on the 62% line, wings, nostrils at ±0.05 (× nose width), a soft line under it; the bridge is two soft shadow planes, no ink ridge |
| mouth | at 74%, 0.34 wide (grin 0.42), even teeth | centered on the 74% line, 0.34 (× mouth width), a grin 0.42; teeth in an even, symmetric row |
| ears | both, 0.10 × 0.16, eye to nose height | both ears, 0.10 × 0.16 (× ear size), centered between the eye and nose lines, behind the silhouette |
| jaw | 0.80 | the six head archetypes are redrawn front-on; their jaw anchors average ±0.40 |

How it is built
- **One half, mirrored.** A face is two layers. The head and the hair (skull, light, ears, stubble, scalp, outline,
  beards and chin straps, hair) are painted straight onto the face canvas, clipped to the right half, and that half is
  mirrored in place about the pixel edge at the head's center. The face plate (the features and their shadows, a
  mustache or goatee) is painted the same way in a scratch canvas and copied in. So the two halves match pixel for pixel
  (no resampling). The canvas is laid out with the head's center on a pixel edge for this. The plate goes on top of the
  hair; nothing drawn on the plate reaches the hairline.
- **Facing slides the features.** The face plate lands 0.04 head widths (rounded to whole cache pixels) toward the
  facing side, and the live eyes and brows slide with it; drawFace mirrors the whole face for facing left, as before.
  `front: true` paints it centered (the Art Lab's symmetry page and the test).
- **The side part is the one asymmetric style.** It is painted unmirrored over the mirrored layers.
- Lighting is front-on: the key light is centered, the sides of the head turn into cel shadow past a face-plate oval,
  there is a rim light on both edges, a gloss crescent on each cheekbone, and the forehead and chin shines sit centered.
- Hair and facial hair, front-on: long hair falls on both sides (the front locks too); the bun sits on top of the crown;
  the mohawk is a fanned crest; cornrows run straight back from the hairline; the afro is centered; the high top no
  longer leans. Locs and box braids hang in mirrored pairs, two locs a side in front, beside the face. A buzz cut is
  just the scalp's color (a shell with its own outline read as a skullcap front-on); the mustache and goatee sit on the
  face plate, and beards and chin straps on the head layer. The eyes' face tilt now lifts both outer corners alike, and the
  catchlights mirror.

**The symmetry test** (Art Lab → Symmetry, and the smoke test): the 12 cast faces front-on at 256 px, the right half
against the left half mirrored over every pixel either half paints (mean |Δ| over RGBA):

| Face (hair) | L13: mirror diff · eye width ratio · eye height diff | L14 |
| --- | --- | --- |
| Theo (side part) | 15.06% · 1.29 · 0.028 | 4.70% (the asymmetric style: exempt) · 1.00 · 0 |
| Dario (taper fade) | 18.81% · 1.29 · 0.026 | 0.12% ✓ · 1.00 · 0 |
| Kenji (mohawk) | 14.87% · 1.29 · 0.010 | 0.06% ✓ · 1.00 · 0 |
| Mateo (long) | 17.53% · 1.29 · 0.024 | 0.04% ✓ · 1.00 · 0 |
| Samir (bun) | 14.30% · 1.29 · 0.034 | 0.09% ✓ · 1.00 · 0 |
| Ravi (buzz) | 14.42% · 1.29 · 0.012 | 0.09% ✓ · 1.00 · 0 |
| Luis (bald) | 12.96% · 1.29 · 0.000 | 0.05% ✓ · 1.00 · 0 |
| Andre (high top) | 9.81% · 1.29 · 0.020 | 0.05% ✓ · 1.00 · 0 |
| Marcus (locs) | 14.04% · 1.29 · 0.018 | 0.07% ✓ · 1.00 · 0 |
| Jalen (afro) | 9.44% · 1.29 · 0.012 | 0.06% ✓ · 1.00 · 0 |
| Kobi (cornrows) | 9.62% · 1.29 · 0.034 | 0.05% ✓ · 1.00 · 0 |
| Obi (curly top) | 9.47% · 1.29 · 0.036 | 0.05% ✓ · 1.00 · 0 |

The residue under 0.2% is the anti-aliasing where the live eyes and the resampled cache meet. Every other hair style on
one face (box braids and twists aren't in the cast) mirrors within 0.1%. The construction lines land at exactly 46.0%,
62.0% and 74.0% of crown-to-chin, and the facing slide is 0.039 head widths (10 px of a 256 px cache).

**Visual rounds** (`shots/l14/`: round-1 to round-3, before/after, the Art Lab's `round-final`). The spec's `reference/`
folder didn't exist, so `reference/face-construction.png` is a construction sheet drawn from the spec's proportions,
and pages 4–6 of Art Lab → Symmetry draw it over each face.
- Round 1: the construction reads, but the mohawk looked like a hairbrush and the buzz cut like a skullcap (its shell's
  own outline and a window glint).
- Round 2: the mohawk becomes a fanned crest of five spikes, and the buzz is just the scalp's color.
- Round 3 (against the reference at 440 px): the nose's wing strokes curled like hooks, so it is now one soft line under
  the tip with short wing creases. The smile folds ringed the mouth like a muzzle, so they are fainter (0.3) and stop
  at the mouth corners. The cheekbone glints sat under the eyes like bags, so they moved out and down.

**Paint cost.** The first cut painted three mirrored layers through a scratch canvas: 21.5 ms per face at 320 px, with
raster forced by a readback (L13: 14.7 ms). The head and the hair are now one layer painted on the face canvas and
mirrored in place. Only the kept half is rasterized (clipped to x ≥ 0), and only the face plate's box is copied from
its scratch. Result: 14.3 ms per face. The optimized faces match the first cut within 0.03% mean difference.

Tests: smoke 96/96 (the new L14 step: the 12 scores above, every hair style, the lines, the slide); modes 13/13; old
saves 16/16; dev tools OK; phone audit no errors; Art Lab 52 shots, no errors. (Modes, old saves, dev tools and the phone
audit ran on the first cut; smoke, Art Lab and perf ran again on the optimized build.) Perf at 844×390 @2x in the pro
arena: median 18.1 ms, p95 26.9 ms (L13 17.2 / 25.5); at 4× CPU 92.2 ms (L13 93.9).

## L13 — True size: an 18 m Legends court (playtest pass, milestone 13)

The playtest: in Legends View the players were drawn 1.3× on a 13 m court, so a 2 m player stood 1/5 of the court
length and a 1v1 filled the screen with bodies.

What changed (Legends View only; Classic is untouched)
- **Players are drawn true size** (`visualScale` 1.3 → 1.0) and the court grows instead: 18 m baseline to baseline
  (was 13), the hoops 1.5 m in (1.3), the 3-point arc 6.0 m (4.6), the free-throw line 4.2 m (3.1), 1.0 m of wall behind
  each baseline (0.9). The street half court checks the ball 7.0 m out (5.6) and keeps the players within 8.0 m of the
  hoop (7.0).
- **Camera:** ppm = W ÷ (18 + 2) = W ÷ 20 (capped at H ÷ 4.7 on a very wide, short screen, so the backboard stays in
  view); the floor line sits at 70% of the screen height (was 80%), so the floor band takes 30%. In Legends View the
  painted floor now reaches the bottom of the screen (`ART.lgFloorDepthM` 3.4 m of floor, and the band is extended to the
  screen's edge), so a tall screen never shows a strip of wall under the court.
- **Gameplay distances:** `h` (the scale on horizontal speeds and distances) goes 0.58 → 0.78, and the jumper apex
  constant 1.1 → 1.0 for the longer shots. The L1 gate tuning for the 13 m court no longer fit, so the AI spots and the
  contest reach were retuned for 18 m (`CONFIG.layout.legends.tune`):

| Path | 13 m court (L1) | 18 m court (L13) | Why |
| --- | --- | --- | --- |
| `ai.sagMin` | 0.78 m | 0.85 m | the on-ball gap on a good shooter |
| `ai.soloSagMax` | 0.8 m | 0.95 m | the gap on a poor shooter in 1v1 |
| `ai.pickupDistSolo` | 6.5 m | 8.0 m | 1v1 pick-up distance from the hoop: 2 m past the arc |
| `ai.pickupDistSoloBig` | 5.5 m | 6.5 m | the same against a handler who can't shoot |
| `contest.proxNear` | 0.85 m | 0.95 m | full contest inside this gap |
| `contest.proxRange` | 1.3 m | 1.45 m | the contest fades to nothing over this |

Tuning rounds (`l13/lgate.js` in the working notes: the Legends half of the gate with overrides. The untuned run used 150
mirror games and 100 Legend-vs-Pro games, the rest 300 and 200; the harness ran 8 games per cell for the untuned run, A and B, and 12 for C and D):

| Round | h | tune | mirror PPP | team A | Legend beats Pro | brute vs Pro | timing | threes vs Pro |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| untuned | 0.80 | none | 1.59 | 43% ✗ | 85% | 1.17 | 2.41 | 1.85 |
| A | 0.80 | sag 0.85 / 0.95, pick-up 8.0 / 6.5, contest 0.9 / 1.4 | 1.55 | 50% | 78.5% | 1.30 | 2.14 | 1.43 |
| B | 0.75 | as A | 1.49 | 49% | 73% ✗ | 1.13 | 2.11 | 1.16 |
| C | 0.80 | as A, contest 1.0 / 1.5 | 1.51 | 49% | 76% | 1.25 | 1.86 | 1.43 |
| **D (kept)** | **0.78** | **as A, contest 0.95 / 1.45** | **1.49** | **50%** | **80%** | **1.11** | **1.91** | **1.28** |

**The measurement** (the smoke test and `l11/mshots.js size` in the working notes; ppm = pixels per meter):

| | L12 | L13 |
| --- | --- | --- |
| court length | 13 m | 18 m |
| character scale | 1.3× | 1.0× (true size) |
| a 2 m player ÷ the court length | 1/5.0 | **1/9.0** (target 1/9–1/10) |
| floor line (share of the screen height) | 80% | 70%: the floor band takes 30% |
| ppm desktop 1280×720 / phone 844×390 | 86.5 / 57 | 64.0 (= 1280 ÷ 20) / 42.2 |

**The gate** (`node tests/gate.js`: 300 mirror games, 200 Legend-vs-Pro, harness 12 per cell; the Legends column, L12 → L13;
Classic is unchanged: the same numbers as L12):

| | L12 (13 m) | L13 (18 m) | target |
| --- | --- | --- | --- |
| Pro mirror PPP | 1.47 | 1.50 | 0.90–1.25 ✗ (L19) |
| Pro mirror: team A wins | 53% | 51% ✓ | 45–55% |
| the side attacking right | 43% | 49% | |
| Legend beats Pro | 78% | 80% ✓ | 75–95% |
| PPP Legend / Pro | 1.60 / 1.28 | 1.63 / 1.29 | |
| harness vs Pro / vs Legend: brute | 1.08 / 1.22 | 1.11 / 0.80 ✓ | ≤ 1.30 vs Pro |
| spam | 0.38 / 0.23 | 0.24 / 0.29 | |
| drives | 1.44 / 1.42 | 1.53 / 1.26 | |
| threes | 1.53 / 1.00 | 1.28 / 1.02 | |
| sniper (timing) | 1.86 / 1.71 | 1.91 / 1.41 ✓ | beats brute |
| reader | 1.65 / 1.20 | 1.64 / 1.15 | |

**Ratings matter less on the bigger court than they did on the 13 m one** (`l13/ratings.js`: 40 bot games, Pro vs Pro,
first to 21, two 1.93 m players with every attribute at the rating): a 99 beats an 80 85% of the time on the 13 m court,
70% on the 18 m court and 68% in Classic. So the short court exaggerated ratings, and the true-size one sits with
Classic. In simulated pro seasons (`l13/ppg.js`: four league seeds, 11 games each, the user's games through the engine),
a 99-rated player went from 41.1 PPG and 66% wins on the 13 m court to 36.6 PPG and 50% wins (Classic: 38.0 and 66%).
One smoke step caught it: a 99-rated player was no longer among the four All-Stars by midseason. **The All-Star fan
vote now counts star power** (`CR.allStar1v1.ovrVote` 0.6 × (OVR − 75), for every player). A maxed player is voted in
again, and fans pick stars, which is what the vote is meant to model. The legacy score doesn't count All-Star
appearances, and the career simulator runs on the league model.

Other results on the L13 build: smoke 95/95 (desktop and phone; the Legends View step now checks the 18 m court, the
camera and the 1/9 ratio); modes 13/13; old saves 16/16; dev tools OK; phone audit no errors; Art Lab no errors. Balance
harness (Classic): unchanged (brute 1.24 ✓, timing 2.05 ✓, Legend beats Pro 79%). Career simulator (40 careers): OVR at
17/21/25 57/69/77 ✓, peak 79 ✓, titles 1.02 per career ✓ (L12 0.80), Hall of Fame 13% ✓ (L12 8% ✗), stuck 0 ✓. The
All-Star vote change moved which careers draw what, and with 40 careers that moved both numbers. Perf at 844×390 @2x in
the pro arena: median 17.2 ms, p95 25.5 ms (L12 21.9 / 31.4; the characters are smaller, so Pixel mode has fewer pixels
to paint); at 4× CPU 93.9 ms (L12 114.7).

## L12 — Traveling and double dribble, every ruleset (playtest pass, milestone 12)

The playtest: the human jumps with the ball, stays in the air, lands still holding it, dribbles on and keeps the ball
with no call; `reDribblePenaltyS` let Arcade re-dribble half a second after landing.

What changed (every ruleset: Arcade, Street Sim and the street half court)
- **Travel:** jumping with the ball commits you to a shot or a pass before you land. Landing with it is a TRAVEL: a
  whistle, the "TRAVEL" callout and the ball to the other team at once (the possession arrow flips at the whistle;
  the inbound follows after the usual beat). The Arcade re-dribble exception is gone. A player who jumps *without* the
  ball and catches it in the air (a rebound, a lob) lands with a live dribble.
- **Picked-up dribble** (after a pump fake from a standstill, slower than 1.0 m/s scaled with the court; a fake on the
  move keeps the dribble, and so does the post fake, so the up-and-under stays a legal step-through):
  - you may pivot: holding the stick for less than 0.12 s only turns you around;
  - past that you walk at 45% of your run speed, and walking more than 0.3 m is a TRAVEL (being pushed doesn't count);
  - a dribble move (Action) is a DOUBLE DRIBBLE (turnover);
  - holding the ball 5 s while a defender is within 1.8 m (scaled like any player gap) is a turnover ("5 SECONDS").
  - A hint chip says so while it applies: "Dribble picked up: shoot · fade · pivot only".
- The Street Sim rule "a picked-up dribble held 3 s is a turnover" is replaced by the 5-second closely guarded rule.
- Practice, the tutorial and the 3-point contest call nothing (nobody to give the ball to); there a dribble move just
  brings the dribble back.
- **Bots follow the same rules:** they never jump with the ball (shots and passes leave the floor on their own), never
  walk or dribble a picked-up ball, and a picked-up bot looks to shoot or pass (its shot value ×1.4).
- A dead ball dropping on a head after a violation whistle is no longer a BONK (a stray ball in any other phase still is).
- Fix: `clearFaceCache()` now also forgets the face warm-up queue, so a later match re-warms every expression (the
  L2 warm-up smoke step failed when an earlier step had already warmed the same look).

Constants (CONFIG.rules): removed `pickedUpTurnoverS` (3 s) and `reDribblePenaltyS` (0.5 s); added:

| Constant | Value | What it does |
| --- | --- | --- |
| `travelDist` | 0.3 m | walking a picked-up ball further than this is a TRAVEL |
| `pivotS` | 0.12 s | stick time that only pivots |
| `pickedUpWalkMul` | 0.45 | walking speed with a picked-up ball (share of run speed) |
| `standstillFake` | 1.0 m/s (scaled) | a pump fake from slower than this picks up the dribble |
| `heldBallS` | 5 s | held while closely guarded → turnover |
| `closeGuardDist` | 1.8 m (scaled) | closely guarded |

Tests: the smoke test's phone stick-drag step now waits for live play first (the button taps before it include Jump
with the ball, which is a TRAVEL now, so the drag used to land in the dead-ball pause). The smoke runner takes
`ONLY=<regex>` to run just the matching steps.

**The measurement** (`l12/travel.js` in the working notes: a scripted human in Arcade, then 30 bot games):

| | L10 | L12 |
| --- | --- | --- |
| jump with the ball and land holding it | 0.42 s in the air, no call, then dribbled on 2.15 m | TRAVEL 0.000 s after landing, possession to the other team at the whistle |
| pump fake from a standstill, then walk | no call | TRAVEL |
| pump fake from a standstill, then a dribble move | no call | DOUBLE DRIBBLE |
| picked-up ball held while guarded | no call | 5 SECONDS (at 7.7 s, 5 s after the pickup) |
| bot travels per game | 0 | 0 |
| bot double dribbles / held balls per game | — | 0 / 0.07 |
| possessions per bot game (first to 21) | 36.3 | 27.7 |

**The gate** (`node tests/gate.js`, 300 mirror games, 200 Legend-vs-Pro, harness 12 per cell; L11 → L12):

| | Legends | Classic |
| --- | --- | --- |
| Pro mirror PPP | 1.45 → 1.47 | 1.62 → 1.64 |
| Pro mirror: team A wins | 53% → 53% ✓ | 53% → 50% |
| the side attacking right | 56% → 43% | 52% → 56% |
| Legend beats Pro | 82% → 78% ✓ | 77% → 81% |
| PPP Legend / Pro | 1.58 / 1.25 → 1.60 / 1.28 | 1.70 / 1.34 → 1.79 / 1.35 |
| harness vs Pro / vs Legend: brute | 1.11 / 1.13 → 1.08 / 1.22 ✓ | 1.04 / 1.18 → 1.24 / 1.26 |
| spam | 0.41 / 0.26 → 0.38 / 0.23 | 0.24 / 0.24 → 0.37 / 0.12 |
| drives | 1.46 / 1.42 → 1.44 / 1.42 | 1.38 / 1.00 → 1.53 / 0.90 |
| threes | 1.44 / 1.00 → 1.53 / 1.00 | 1.47 / 1.25 → 1.60 / 1.15 |
| sniper (timing) | 2.18 / 1.54 → 1.86 / 1.71 | 2.16 / 1.50 → 2.05 / 1.62 |
| reader | 1.78 / 1.42 → 1.65 / 1.20 | 1.95 / 1.27 → 1.82 / 1.07 |

Mirror PPP is still above the 0.90–1.25 target; that is L19's job. The Pro mirror moved 1.45 → 1.47, inside the noise
of 300 games; a 16-game Legend mirror went 1.44 → 1.51 with more made mid-range jumpers (a picked-up bot now looks to
shoot rather than hold).

Balance harness (Classic, 12 per cell): brute force vs Pro 1.24 ✓ (≤ 1.30; L11 1.04), perfect timing 2.05 ✓, Legend
beats Pro 79% (1.78 vs 1.35 PPP). Career simulator (40 careers): OVR at 17/21/25 57/69/77 ✓, peak 79 ✓, titles 0.80 ✓,
Hall of Fame 8% ✗ (10–20%; unchanged since L11), stuck 0 ✓. Perf at 844×390 @2x in the pro arena: median 21.9 ms, p95
31.4 ms (L11 22.6 / 33.2); at 4× CPU 114.7 ms (L11 114.8). Smoke 95/95 (desktop and phone).

## L11 — Running back on defense: bodies only block in real contact (playtest pass, milestone 11)

The playtest: in a 1v1 in Legends View, a defender who starts 1.6 m behind a ball handler standing still and sprints
toward his own hoop for 3 s never gets past without jumping; the handler's back is a wall, and he shoves the handler
forward.

What changed (MECHANICS, `resolveBodies`)
- Bodies block each other only in real contact:
  - the ball handler against a defender between him and the hoop (the drive into a square defender, face-ups, post-ups
    and back-downs, charges);
  - box-outs and rebound positioning while a shot is live (the ball in flight or loose after a shot, before anyone
    has it);
  - a set screener in the team modes (a teammate of the handler standing still).
- Everything else passes through: transition, running back on defense, off-ball movement, and a defender recovering
  from behind the handler. A handler is never body-blocked from behind, and a defender who is not between the handler
  and the hoop can always run past him.
- While passing through, both players keep at least 90% of their speed (`defense.passThroughSpeedMul` 0.9) and the
  faster one is drawn behind the other (`drawBehindUntil`, read by the overlap order). A pair that started passing
  through finishes before contact can start again, so a defender who runs through the handler and comes out in front
  doesn't pop.

New constants (CONFIG.defense)

| Constant | Value | What it does |
| --- | --- | --- |
| `passThroughSpeedMul` | 0.9 | speed kept while passing through another body |
| `passThroughHoldS` | 0.06 s | how long the slowdown and the draw-behind outlast the overlap |

The measurement (`l11/runback.js`: Legends View, the defender 1.6 m behind a handler standing still, sprinting 3 s
toward his hoop, never jumping)

| | L10 | L11 |
| --- | --- | --- |
| defender moved | 1.54 m | 8.5 m (to the wall) |
| handler shoved | 0.69 m | 0.00 m |
| defender's center past the handler | never | 0.47 s (target ≤ 0.6 s) |
| defender clear of the handler | never | 0.66 s |
| speed kept while overlapping | — | 90% |
| jumped | no | no |

Also fixed in passing: the build's swallowed-code lint missed a `//` comment followed by an `if (…) x *= …` (a
compound assignment); it now catches it (it had hidden the L9 speed-shoes multiplier for one build).

Screenshots: `shots/l11/` (the run-back 0.42 s and 0.71 s into the sprint, before and after, desktop and phone) and
`shots/l11/round-final/` (Art Lab).

Tests
- Smoke 94 of 94 (new step: the run-back above — past at 0.46 s, 90% of speed kept, the handler pushed 0.00 m; a
  handler backing into a defender behind him moves freely, 1.52 m in 0.5 s; the wall in front still holds at the 0.75 m
  contact distance). Modes 13 of 13, old saves 16 of 16, dev tools all OK, phone audit: no errors.
- The gate (`tests/gate.js`: runSims 1v1 Pro mirror 300 games both ways round, Legend vs Pro 200 games, the harness 12
  games per cell):

  | Legends View | L10 | L11 | Target |
  | --- | --- | --- | --- |
  | Pro mirror PPP | 1.44 | 1.45 | 0.90–1.25 ✗ (L19) |
  | Pro mirror: team A wins | 50% | 53% | 45–55% ✓ |
  | (the side attacking right) | 56% | 56% | — |
  | Legend beats Pro | 77% | 82% | 75–95% ✓ |
  | PPP Legend vs Pro | 1.56 / 1.28 | 1.58 / 1.25 | — |
  | Harness vs Pro: brute force | 0.98 | 1.11 | ≤ 1.30 ✓ |
  | Harness vs Pro: perfect timing | 2.07 | 2.18 | beats brute force ✓ |
  | Harness vs Pro: reads | 1.62 | 1.78 | — |

  Classic: mirror PPP 1.62 (L10 1.65), team A 53%, Legend beats Pro 77% (82%), brute force 1.04 (1.28), timing 2.16.
- The balance harness (`balance.js 12 21`, Classic): brute force vs Pro 1.04 PPP ✓ (L10 1.28), timing/reads 2.16 ✓,
  Legend beats Pro 79% ✓ (84%).
- The career simulator (`careersim.js 40`): OVR at 17/21/25 57/69/77 ✓, peak 79 ✓, titles 0.80 per career ✓, Hall of
  Fame 8% ✗ (10–20%; 13% at 200 careers since M8, unchanged), no stuck careers ✓.
- `perf.js` (844×390 @2x, the pro arena, Pixel): guard level 0 median 22.6 ms, p95 33.2 ms; 4× CPU 114.8 ms (L10: 19.0 / 28.5 ms, 81.9 ms).

## L10 — Performance, the phone pass, the gallery (graphics overhaul, milestone 10)

Performance
- Pixel mode on a phone paints characters at a 2× supersample instead of 3× (`pxSuperPhone`: 2). In the profile of a
  Legends Arena match at 844×390 @2x this cut the character cost from 13.6 to 9.2 ms a frame and the scene from 22.0 to
  16.7 ms; at the phone's 260-row buffer the sprites look the same (`shots/l10/phone-ss2.jpg`). Desktop stays at 3×.
- The profile (headless Chromium, CPU canvas; a Legends Arena match, Pixel mode, guard level 0):

  | | Desktop 1280×720 (k = 3) | Phone 844×390 @2x, L9 | Phone, L10 |
  | --- | --- | --- | --- |
  | whole scene | 16.9 ms | 22.0 ms | 16.7 ms |
  | characters (paint + pixelize) | 9.1 ms | 13.6 ms | 9.2 ms |
  | background quantize | 2.4 ms | 3.4 ms | 3.3 ms |
  | pixel work the guard times | 2.2 ms | 4.6 ms | 3.2 ms |


The phone pass
- Pixel menus on a real phone (390 px tall @3x, k = 5) draw in a UI layer of 2-device-pixel UI pixels; the tests' phone
  profile (@2x, k = 3) draws them at full resolution. Both were checked by eye in `shots/l8/ui/` (the @3x set) and the
  phone audit (every menu keeps 64 px tap targets, no errors).
- The SUPER button (L9) sits above Shoot only while the meter is full and clears the other buttons at every touch size.
- A new phone smoke check: Pixel mode on a phone paints characters at the 2× supersample.

The gallery
- `shots/before-after-legends/`: the same short tour (`node tests/gallery.js shoot <dir> [pixel|smooth]`) on the
  last build before L1 (M9) and on this one in both looks, composed side by side with `node tests/gallery.js compose`:
  title, menu, create, settings, a quick 1v1 at tip-off, a jumper, an attack at the rim, defense and pause on desktop;
  the match and pause on a phone. Notes in `shots/before-after-legends/NOTES.md`.

Tests
- Smoke 93 of 93 (new phone step: Pixel on a phone paints characters at the 2× supersample). Modes 13 of 13, old saves
  16 of 16, dev tools all OK, phone audit: no errors; zero console errors.
- `balance.js 12 21`, `careersim.js 40` and the §2 gate: identical to L9.
- `perf.js` (844×390 @2x, the pro arena, Pixel): guard level 0 median 19.0 ms, p95 28.5 ms (L9: 22.5 / 31.9 ms); 4× CPU
  81.9 ms (L9: 111.3 ms), and the guard still engages at 4×.

## L9 — Optional arcade extras (graphics overhaul, milestone 9)

A new EXTRAS section. It only runs when a match asks for it, and only for the Legends View arcade 1v1 (no practice,
drills, the 3-point contest or the tutorial). Settings → Arcade extras: **Quick games** (the default: quick 1v1 and the
tournament), **Everywhere** (the careers too) or **Off**. With extras off nothing changes: the §2 gate, the balance
harness and the career simulator never turn them on, and the smoke test checks that a match without them plays out
exactly as before. Shots: `shots/l9/` (the meter, a power-up on the floor, a frozen player in an ice block, a big head,
the SUPER button on the phone; Pixel and Smooth).

The super meter
- Fills on your makes (+25, a three +34), blocks (+34) and steals (+34), and shows under your panel in the score bug,
  in four segments; full, it flashes SUPER and a key hint (Action + Shoot) appears. On a phone a SUPER button appears
  above Shoot while the meter is full (it presses both).
- Action + Shoot together (within 0.14 s) spends it on whichever fits:
  - **Freeze** when the opponent has the ball: they are iced for 0.8 s (no moves or buttons; a shot already in the air
    goes on), drawn in an ice block.
  - **Mega jump** with the ball on the ground in mid-range (past dunk range, inside the arc): a leap that peaks with
    the hand 0.18 m over the rim, straight into the normal dunk, so the rim duel, the defender's protection roll and
    the dunk's contest still apply. Costs 18 stamina.
  - **Fireball** with the ball anywhere else (or in the air before release): the next release is graded perfect (the
    contest still counts, so a smothered shot is still a hard shot); the ball flies on fire.
- Bots use the same meter and rules: when their meter fills they decide once whether to keep it for a Freeze on
  defense (40%) or spend it on offense (a Fireball on the next jumper, or a Mega jump when the lane is open).

Power-ups
- Every 20–30 s of live play one lands on the floor at least 2.2 m from either hoop, bobbing on a glow, for 10 s (it
  blinks in its last 2). The first player whose feet pass within 0.55 m of it gets it:
  - **Speed shoes** (5 s): top speed ×1.25, streaks at the feet.
  - **Big head** (6 s): the head draws 1.35× (it pops up from the collar) and the perfect-release window is 1.3× wider.
  - **Sticky ball** (5 s): swipes can't strip the handler.
- Active power-ups show as chips with their seconds under the owner's meter.

New constants (CONFIG.extras): every value above, one line each (`meterMax`, `gainMake`, `gainThree`, `gainBlock`,
`gainSteal`, `comboS`, `freezeS`, `megaOver`, `megaStamina`, `puEvery`, `puLifeS`, `puPickR`, `puEdge`, `speedS`,
`speedMul`, `headS`, `headScale`, `headWindow`, `stickyS`, `botDelayS`, `botFreezeRange`, `botFreezeShare`).

Design calls (the spec names the extras but not every rule)
- Which super fires is chosen by the situation (defense → Freeze, mid-range on the ground → Mega jump, else Fireball)
  so Action + Shoot stays one combo.
- The spec's big head has no stated effect beyond the look; it also widens the release window ("big head, big brain")
  so picking it up matters. Hitboxes don't change.
- Power-ups are picked up by walking over them; the bots don't chase them (they get them only when they pass by).

Tests
- Smoke 92 of 92. New step: extras are off in a career game and in Classic by default and on in a quick game; with a
  full meter the combo gives a Mega jump in mid-range (and the leap ends in a dunk), a Fireball from three, a Freeze on
  defense (the iced player doesn't move for 40 steps); a meter that isn't full isn't spent; walking over speed shoes
  picks them up and top speed is exactly ×1.25; a seeded match with extras plays out identically twice; a match
  without them plays out identically with the option false or absent. Modes 13 of 13, old saves 16 of 16, dev tools
  all OK, phone audit: no errors (Settings' gameplay column now has 10 rows); zero console errors.
- 12 bot-vs-bot games to 21 with extras (Legends View, Pro): 64 supers used (24 Mega jumps, 16 Fireballs, 24 Freezes),
  66 power-ups picked up (20 speed shoes, 28 big heads, 28 sticky balls); points 227 to 232.
- `balance.js 12 21`, `careersim.js 40` and the §2 gate: identical to L8 (none of them turns extras on). `perf.js`
  (quick games now carry the extras): guard level 0 median 22.5 ms, p95 31.9 ms; 4× CPU 111.3 ms, the guard engages.

## L8 — Chunky UI, the select wall, the pixel UI and the logo (graphics overhaul, milestone 8)

§6's arcade UI for both looks, and §8.5's pixel menus. Shots: `shots/l8/ui/` (title, menu, the pop-in mid-transition,
create, settings, the match wipe, the HUD with a grinning scorer, pause; desktop and phone, Pixel and Smooth) and
`shots/l8/round-final/` (every Art Lab view; Pixel check page 4 puts the kit side by side, Smooth and Pixel).

What's new
- Headings: weight 900, a yellow → orange gradient (#FFF3A0 → #FFD23F → #FF9A1F → #F07A1A), a 4 px near-black
  (#150B10) outline and a 4 px drop shadow down-right; 40 px and up they arch (letters ride a parabola 9% of the size
  high and lean with it). A 1-px shine on the top fifth.
- The logo: HOOP HEADS with the first O drawn as a basketball in code (pebbled orange, highlight, four seams), on a
  6-step yellow → orange ramp, on the title screen and the main menu.
- Buttons: a 3 px ink outline and a 6 px darker lip under the face (at most 12% of the button's height, so small buttons
  keep their label room); a press squashes to 0.94, overshoots to 1.03 and settles over 240 ms; primary gold → orange
  (lip #A8480E), secondary blue #5A8CF0 → #2A55C4 (lip #1E3FA8); the focused one is brighter with an inner ring.
- The select wall (the create screens' face grids, both careers): the hovered head bobbles (±7° at 2.4 Hz with a small
  hop) and grins; the selected one is drawn 1.15× with a gold ring.
- HUD: score digits at least 6% of the screen height (43 px at 720 rows), white with an ink outline and drop shadow;
  the team panels get an ink edge; the scorer's portrait grins for 1.6 s and the number pops; the shot-clock pill is
  1.4× bigger with a gold edge. Portraits take an expression (cached per expression).
- Transitions: screens pop in 0.8 → 1.06 → 1.0 over 280 ms while the old one fades; overlays pop the same way; a match
  opens with a diagonal wipe in the human side's team colors (460 ms). Reduce Motion skips all of it.
- Pixel mode (§8.5): menus draw into a UI layer at twice the internal resolution and blit with smoothing off; panels
  are notched (2-UI-pixel corner steps) with 1-UI-pixel borders; buttons are notched with no glow; headings use the
  pixel font on the logo's 6-color ramp with a 2-UI-pixel outline and drop shadow; the logo gets a pixel ball; the
  score uses a new 7×11 digit set. In a match the HUD draws through the same layer.

New constants (ART, UIKIT section)

| Constant | Value | Was | What it does |
| --- | --- | --- | --- |
| `uiTransMs` | 280 | 200 | screen pop-in length (§6) |
| `uiPressMs` | 240 | 110 | a press's squash, overshoot and settle |
| `uiPressDown` / `uiPressOver` | 0.94 / 1.03 | 0.96 / – | the press curve (§6) |
| `uiPopFrom` / `uiPopOver` | 0.8 / 1.06 | – | the pop-in curve (§6) |
| `uiBtnOutline` / `uiBtnLip` | 3 / 6 px | – | button outline and lip (§6) |
| `uiTitleRamp` | 4 stops | 3-stop gold | heading gradient |
| `uiTitleOutline` / `uiTitleShadow` | 4 / 4 px | 14% / 5% of size | heading outline and shadow (§6) |
| `uiTitleArch` / `uiTitleArchMin` | 0.09 / 40 px | – | how much big headings arch, from what size |
| `uiInk` | #150B10 | – | button and heading outlines |
| `selHeadScale` | 1.15 | – | the selected head (§6) |
| `selBobHz` / `selBobDeg` | 2.4 / 7° | – | the hovered head's bobble |
| `wipeMs` | 460 | – | the match-start wipe |
| `hudScoreH` | 0.06 | – | score digits' minimum share of the screen height (§6) |
| `hudGrinS` | 1.6 s | – | how long a scorer's portrait grins |
| `hudClockPill` | 1.4 | – | shot-clock pill size |

Deviations
- The UI layer's pixel is k/2 device pixels rounded down, so every UI pixel is the same size. At 1280×720 (k = 3) that
  is one device pixel, so the layer is full resolution there and the pixel look comes from the notches, the pixel-font
  headings and the digits; phones (k = 5 at 390 px @3x) and 1080p screens get 2-pixel UI pixels.
- Body text and button labels stay in the system font: the 5×7 font has no lowercase and is too small for paragraphs.
  Headings, the logo, callouts and the score digits use the pixel fonts.
- Selects, sliders and toggles keep their M6 rows; the chunky style is for buttons.
- The select wall is the two create screens' face grids (no other screen has a grid of heads).

Tests (L8 changes no gameplay)
- Smoke 91 of 91 (new step: the press curve hits 0.94 and 1.03, the pop-in 0.8 and 1.06 over 280 ms, the 7×11 digits
  are complete, a scorer's grinning portrait is a different bake, the pixel kit draws, a match opens with a wipe in the
  human side's color and it ends). Modes 13 of 13, old saves 16 of 16, dev tools all OK, phone audit: no errors (every
  menu keeps its 64 px targets); zero console errors.
- `balance.js 12 21`, `careersim.js 40` and the §2 gate: identical to L7. `perf.js` (844×390 @2x, Pixel, the HUD now
  drawn through the UI layer): guard level 0 median 23.3 ms, p95 33.6 ms; 4× CPU 106.5 ms and the guard engages (L7:
  23.1 / 31.3 ms, 99.8 ms).

## L7 — Pixel mode (graphics overhaul, milestone 7)

Settings → Graphics: **Pixel** (the new default) or **Smooth** (everything up to L6). Pixel mode renders the match
scene into an internal buffer and blits it at a whole-number scale with smoothing off. It is presentation only:
the simulation, hitboxes and camera targets are the same in both. Shots: `shots/l7/round-1/` (the first pass),
`shots/l7/round-final/` (every Art Lab view plus in-game frames on desktop and phone) and `shots/legends/round-8/`
(the Legends check pages, the Hair page, the three Pixel check pages and in-game Legends View frames).

How it works (§8)
- Internal resolution: k = max(2, round(device height / 240)); the buffer is device size / k (1280×720 → 427×240,
  a phone at 844×390 @3x → 507×234). The camera snaps to whole internal pixels while a frame renders, so nothing
  shimmers when it pans (the smoke test measures 0% shimmer on a slow pan).
- Background: venue, crowd, floor, hoops and reflections draw as before into the buffer, then the rectangle is quantized
  to a 32-color palette built per venue from its first frame, with Bayer 4×4 ordered dither (amplitude 14 of 255)
  anchored to the camera so the pattern moves with the world.
- Characters: each is drawn with the normal renderer into a scratch canvas at 3× the internal size (the pose callback
  gives the tight box), scaled down natively (a box filter), cut at α 0.45, mapped through a per-character palette
  (skin ramp, hair, kit and shoe colors, ink; about 29 colors) with a lazily filled 15-bit lookup, cleaned of orphan
  pixels and pinholes, given a 1-px ink outline on the outside and selective inner lines where a light region meets a
  darker one.
- Ball: 8 pre-pixelized rotation frames per size (small sizes get fewer seams so they don't read as gears).
- Particles: square pixels, faded with a dither mask instead of alpha. Callouts: the 5×7 pixel font, flickering out.
- The guard (§8.6): pixel work over 4 ms (desktop) or 8 ms (phone) sheds, in order: characters at 2× instead of 3×,
  no selective inner lines, character sprites redrawn at 30 Hz. It times only the pixel work.
- Measured pixel work (headless Chromium, CPU): 2.17 ms per frame on desktop, 3.66 ms on the phone profile.

New constants (ART, PIXEL section)

| Constant | Value | What it does |
| --- | --- | --- |
| `pxRows` | 240 | k = max(2, round(device height / pxRows)) |
| `pxSuper` | 3 | characters are painted at this supersample (the guard drops it to 2) |
| `pxAlphaCut` | 0.45 | filtered pixels at least this opaque become opaque |
| `pxVenueColors` | 32 | background palette size |
| `pxDither` | 14 | Bayer 4×4 amplitude (26 made the floor grainy) |
| `pxInner` / `pxInnerMix` | 0.32 / 0.4 | selective inner lines: luma step that triggers one, and how far it darkens |
| `pxBudget` | [4, 8] ms | pixel work per frame before the guard sheds (desktop / phone) |
| `pxBallFrames` | 8 | pre-pixelized ball rotation frames |
| `brightGradeHs` | [1.06, 1.15] | the gym's bright grade (the arena's [1.25, 1.15] blew it out) |

Rounds
- Round 1: the dither crawled on camera pans (now anchored to the camera); the gym was blown out by the bright grade
  (it gets its own, gentler one); small balls looked like gears (fewer seams); the Pixel check pages overflowed; the
  Settings right column overflowed with the new Graphics row (36 px rows when there are more than 9).
- Round 2 (`shots/legends/round-8/`): faces and hair hold up at the phone's 234-row buffer; outlines are continuous.

Deviations
- Menus and the HUD stay smooth in L7; the pixel UI (menu buffer, pixel font titles, the 7×11 score digits, the logo)
  is L8.
- The net is quantized with the rest of the hoop, not redrawn with Bresenham lines.
- Faces are not cached separately: they are pixelized with the body each frame (the per-character sprite cache and the
  guard's 30 Hz step cover the cost).
- Character palettes are about 29 colors (the spec's 26 plus the ball's colors, after removing duplicates).
- Reflections are drawn with alpha and then quantized with the dither, not through a checkerboard mask.
- Motion trails are drawn inside each character's sprite box.
- The Art Lab stays Smooth except its Pixel check pages (sprites at 1×/k×, the palette, the font, and a Legends frame).
- The crowd uses the M5 atlas at the buffer's resolution (the spec's bigger 80×150 cells would not show at 240 rows).

Tests (L7 changes no gameplay)
- Smoke 90 of 90 (new step: Pixel is the default; the buffer is device/k with k from §8; the scene, characters, ball,
  particles and callouts draw in pixel style; a slow pan shows 0% shimmer; Smooth still renders; no exceptions). Modes
  13 of 13, old saves 16 of 16, dev tools all OK, phone audit: no errors; zero console errors.
- `balance.js 12 21`: brute force vs Pro 1.28 PPP ✓, timing beats brute force 2.02 ✓, Legend beats Pro 84% ✓.
  `careersim.js 40`: every target ✓ except Hall of Fame 8% (10–20%; 13% at 200 careers, unchanged since M8). §2 gate
  unchanged: mirror 50%, Legend beats Pro 77%, brute force 0.98 PPP, mirror PPP 1.44 ✗ (known deviation).
- `perf.js` (844×390 @2x, the pro arena, now in Pixel mode by default): guard level 0 median 23.1 ms, p95 31.3 ms; 4×
  CPU 99.8 ms, and the guard engages at 4× as before (L6 Smooth: 19.5 / 28.1 ms, 103.5 ms).

## L6 — The Legends Arena and the bright grade (graphics overhaul, milestone 6)

A new venue, the Legends Arena (court id `legends`, venue kind `legends`), and a bright grade for the career venues when
Legends View is on. Shots: `shots/l6/` (the venue in-game on desktop and phone, the bright pro arena, gym and college,
and every Art Lab view; the Venues page now shows all seven venues in a 4-column grid).

The Legends Arena (§5)
- It is the default court for quick play and practice in Legends View (Classic keeps the blacktop and the gym). The
  career keeps the gym, the college arena and the pro arena; the tournament keeps its blacktop and arena rounds.
- Background: a bowl gradient #2446A8 → #13245E with roof trusses, an upper bowl of tiny fans, 5 warm light cones
  #FFE9B8 at α 0.14 swaying slowly, four big banners in the team colors with invented text (HOOP HEADS LEGENDS, BIG HEAD
  CLUB, POSTER NIGHT, BONK ZONE), the jumbotron with score, portraits, chants and replays.
- Crowd: 3 rows 0.62 m apart, fans 0.95 m tall, mini bobbleheads (the head is 38% of the fan: radius 18 px in the
  96 px atlas cell against 11), bold outlines and flat shading, eyes with whites and pupils, brows, a big open D smile
  with teeth when cheering, an O when groaning; shirts 50% home, 30% away, 20% neutral. Poses, props and reactions are
  the M5 crowd's (seated, cheering, standing, clapping, hands on heads; foam fingers, signs, phones, popcorn; big plays
  stand the section up, near misses get the "ohhh", a win drops confetti).
- Courtside: the LED board at 0.6–1.0 m scrolling the invented sponsors, with bloom; the scorer's table with a glowing
  front in the home color; the benches.
- Floor: honey maple #E0A865, planks ±6%, crisp plank lines, painted team-color keys at α 0.9, the invented HH center
  monogram, two big soft light pools; reflections at α 0.32 fading over the floor band.
- Hoops: the backboard is drawn 1.15× about the rim (rim height and collision unchanged), thicker glass, a white frame,
  a red inner square; the padded stanchion in the home color and the red-digit shot clock as before.
- Lighting: a bright even key, the vignette at α 0.2, bloom on the cones, the jumbotron and the LED board.

The bright grade (§5): in Legends View the pro arena, the college arena and the gym get their background buffer
brightened 25% and saturated 15% (a filter pass on the half-resolution buffer at each redraw, not every frame), their
stands' shadow cut to 40%, the vignette at α 0.2, bigger and brighter light pools (α 0.30, 6.5 m) and floor reflections
at the Legends level (α 0.32). Classic is unchanged.

Deviations
- "The floor band takes 35% of screen height": §2's own camera puts the floor line at 80% of the screen so the players
  stay big, which leaves 20% for the floor band (plus the reflections under the players). The §2 camera wins.
- Crowd atlas: the spec's cells are 80 × 150 px, 24 fans × 5 poses; the M5 atlas (48 × 96, 32 fans × 6 poses) is kept
  and drawn with the bigger heads. At the half-resolution crowd buffer the extra size would not show, and L7's pixel
  mode rebakes fans at about 22 × 38 px anyway.
- Reflections stay in the M5 half-resolution buffer (the spec asks for full resolution): the guard's first step already
  halves them, and at full resolution they cost about as much as the players.
- Floor texture: baked at 64 px per meter (§9; was 48) for every venue.

Tests (L6 changes no gameplay)
- Smoke 89 of 89 (new step: quick play and practice default to the Legends Arena in Legends View and not in Classic;
  the venue builds and draws; the bright grade is on for career venues in Legends View and off in Classic). Modes 13 of
  13, old saves 16 of 16, dev tools all OK, phone audit: no errors; zero console errors.
- `balance.js 12 21`, `careersim.js 40` and the §2 gate: unchanged from L5. `perf.js` (the pro arena, which now gets the
  bright grade in Legends View): guard level 0 median 19.5 ms, p95 28.1 ms; 4× CPU 103.5 ms (L5: 20.6 / 29.9 and 89.6 ms).


## L5 — Animation (graphics overhaul, milestone 5)

§4's exaggeration, all in the RIG section (visual only: clips read the simulation and never change it). Shots:
`shots/l5/round-1/` … `round-6/` (the first frame of each key move in a live bot match, per round) and the Art Lab's
Clips view (new rows: the front-flip dunk and the jump-and-clap, air-guitar and laugh celebrations).

| Item | Was (M4) | Now (§4) |
| --- | --- | --- |
| Jump start squash | 1.08 × 0.92 (gather) | 1.14 × 0.84, snapping into the stretch |
| Apex stretch | 1.05 y | 1.10 y at the apex |
| Landing squash | 1.12 × 0.85 for 90 ms | 1.18 × 0.80 for 110 ms (80% of that after a jump shot) |
| Head bobble | ×1, k 120, damping 12, clamp 0.04 H | ×1.6, k 90, damping 9 (it overshoots), clamp 0.064 H; on landings the head lags 60 ms, then catches up |
| Run | pelvis bob 0.015 H | 0.03 H, a 4° tilt into each step, shorts flutter 0.022 H |
| Front flip | — | a one- or two-hand dunk by a player with Hops ≥ 8.5 becomes a 360° flip about the chest over 0.5 s at the top, 3 dunks in 5 (seeded from the player's stats, never the match RNG) |
| Spin 360 dunk | narrows to 42% side-on | squashes to a sliver (2%) at 90° and 270° and swaps facing |
| Rim hang | a pendulum swing | plus the feet kicking alternately ±0.05 H at 5 Hz, and the rim bends 3° under the hanger |
| Knockdowns | a fall with one bounce, up in 0.6 s | onto the back (−80°) with two bounces, up in 0.5 s; posterizer and ankle-breaker victims get 3 outlined yellow 5-point stars orbiting an ellipse over the head for 1.2 s |
| Head bonk | — | a stray ball dropping on a grounded player's crown away from the rims, or a zipped pass through a head: a BONK! callout, a strong head-spring kick, shocked eyes for 0.8 s and stars for 0.6 s. The ball is untouched |
| Celebrations | flex, chest pound, point, shimmy, finger wag, airplane | plus jump-and-clap (with the clap's impact tick) and air guitar; flexes and claps come with the hyped face; after a posterizer the scorer laughs (hands on the belly, rocking back); the shimmy is wider |
| Idle | breathing | plus a weight shift every 2–4 s and a glance up at the crowd every 5–9 s, seeded per player so two players never sync |

Tuned after looking at the reels (§0)

| Item | Now | Why |
| --- | --- | --- |
| Bonk trigger | only a ball dropping (vy < −2 m/s) onto a grounded crown at least 1.6 m from both rims, or a pass faster than 6 m/s; one per player per 3 s and one per match per 12 s (`bonkRimClear`, `bonkGap`) | "a loose ball or pass hits a head" taken literally fired 17–21 times a game in bot matches, almost all rebounds falling through the drawn heads under the rim. Now about one every three games |
| Rim hang | the drawn body is lifted until the chin is at the rim, a pull-up (`hangChinAt`) | a 1.3× body is 2.6 m tall: there is no room to hang the face below a 3.05 m rim without the feet going through the floor, and in between the rim cut across the face |
| Dunk lift | eases in at 40/s, out at 12/s (`liftEaseIn`) | at 12/s the first frames of a dunk still had the rim across the face |

Tests (L5 changes no gameplay)
- Smoke 88 of 88 (new step: a stray ball on the crown bonks with the callout, the shocked face and stars and leaves the
  ball untouched; posterizers give stars; a high flyer front-flips in some dunks, not all; every new clip poses).
  Modes 13 of 13, old saves 16 of 16, dev tools all OK, phone audit: no errors; zero console errors.
- `balance.js 12 21` and `careersim.js 40`: as in L4 (every balance target passes; careers: Hall of Fame 3 of 40 ✗,
  the rest ✓). §2 gate: identical to L1. `perf.js`: guard level 0 median 20.6 ms, p95 29.9 ms (L4: 18.5 / 23.2 ms; the
  machine varies by this much run to run), 4× CPU 89.6 ms.

## L4 — Bodies (graphics overhaul, milestone 4)

The body is redrawn to §3.1 and §3.10, and §3.11's overlap rule is in. Shots: `shots/legends/round-6/` and `round-7/`
(the two L4 rounds) and `shots/l4/round-final/` (every Art Lab view, including Body with all seven hand poses and the
high-tops, and the Clips filmstrips).

Proportions (§3.1, H = drawn height)

| Mark | Was (M3) | Now |
| --- | --- | --- |
| Crown / chin / head width | 1.005 / 0.43 / 0.50 H | 1.00 / 0.38 / 0.54 H (head 0.62 H tall; `headCenter` 0.69) |
| Collar / waistband / hem | 0.44 / 0.24 / 0.12 | 0.40 (under the chin) / 0.31 / 0.20 |
| Sock top / shoe collar | 0.095 / 0.07 | 0.15 / 0.12 (high-tops) |
| Hands | 0.09 × 0.084 H mittens at (0.20, 0.30), (−0.18, 0.31) | 0.11 H across, open, at (±0.26, 0.26) |

What is new (§3.10)
- Jersey: a tank with 0.02 H neck and armhole trim plus 0.006 H piping in the kit's third color, 0.04 H side panels,
  a mesh dot tile at α 0.07, a vertical sheen band (white α 0.16, 0.05 H wide, 30% in from the front edge), an invented
  wordmark arched above the number (the team's abbreviation, 0.045 H, two-color outline), and the number with a double
  outline (trim inside, near-black outside).
- Shorts: long and baggy from 0.31 to 0.20 H, 15% wider at the hem, side panels with a stripe, a waistband with a
  drawstring knot, two fold creases; the hem flares 8% on jumps.
- Legs: short and thick, two-tone with a knee highlight; crew socks from the shoe collar to 0.15 H with a team stripe.
- High-tops, 0.30 × 0.12 H: an #26262E outsole with tread notches, a 0.03 H white midsole with a sculpt line and toe
  spring, a toe cap, an eyestay with 5 lace crosses, a padded collar with a pull tab, a heel counter, an original
  emblem (a rounded 5-point star or a double chevron) in the accent color, a toe-box highlight line at α 0.45, a
  specular dot, the far shoe 15% darker. Kit colorways by default; the pro career's signature colorways are two-tone
  sets now: the shoe deal unlocks the first, the All-Star Game, a title, MVP, 10 posterizers and 5 seasons unlock the
  other five (`SIGNATURE_SHOES`, `SIG_UNLOCKS`; old saves keep their chosen index).
- Open cartoon hands (floating, no arms): a 0.055 × 0.05 H palm, three fingers 0.018 H thick and a thumb inside one bold
  outline, key-light shading, a knuckle highlight, the wristband option; poses open (fingers fanned 25°), holding (the
  palm behind the ball, the fingers in front of it: the game now paints a held ball between the two), fist, point, clap
  (with an impact tick), high-five, and the relaxed rest.
- A sharp contact shadow (0.28 × 0.04 H at α 0.55) under the shoes on top of the soft one; the body rim light #FFE2B8
  α 0.5 on the back edge of the jersey, shorts and shoes; body outlines 0.012 H in #150B10, never under 2 px.
- §3.11: when two drawn heads overlap by more than 20% of a head width, the farther player (the defender; with no
  possession, the lower lane) is drawn first at 0.94 scale and 0.05 H higher, eased in and out, so the nearer
  character's bold outline separates them. The 0.75 m Legends contact distance came in L1; the §2 gate is re-run below.

Fixes the new proportions needed (visual only; the ball, the rim and every hitbox stay where they are)
- A held or dribbled ball's drawn height folds into the short torso: drawn heights 0.30–0.80 H map to 0.30–0.36 H and
  0.80–1.00 H open back out to the crown (`heldBall`), so the ball no longer sits on the face in a gather, a check or a
  triple threat, and a rising shot zips past the face to its real release point. The Art Lab draws the ball the same way.
- A dunker is drawn lifted until the chin clears the rim (at most 0.5 H), so the big head is above the rim and the hand
  slams the real ball down; a rim-hanger is drawn lowered until the crown sits just above the rim (`visualLift`, eased
  at 12/s). Before, the rim and the ball landed on the face.
- The height-chart constants are re-measured on the new body: the skull top of a standing menu figure is 1.036 H
  (median of 12 faces, 1.006–1.074 by face shape; was 1.023) and 0.994 H in a stance (was 0.99).

Tuned after looking at the Art Lab

| Item | Spec | Now | Why |
| --- | --- | --- | --- |
| Jersey number | 0.10 H | 0.08 H at 0.343 H (`numberH`, `numberY`) | only 0.07 H of jersey shows between the chin (0.38) and the waistband (0.31); at 0.10 H the number ran onto the shorts |
| Shorts' fold shadows | two fold shadows | two thin creases from the crotch | filled folds read as parentheses on each leg |
| Fist | — | the folded thumb is a crease line with a lit edge | a thumb capsule with a full outline read as a chain link |

Rounds (no `reference/` folder; compared against §3.1 and §3.10)

| Round | Biggest differences | Fixed in |
| --- | --- | --- |
| first render (not kept) | 1. the number ran onto the shorts; 2. fold shadows read as parentheses; 3. the fist read as a chain link; 4. the Art Lab's sneaker row overlapped itself at the new size; 5. a held ball sat on the face (gather, check, the lab's jump shot) | round 6 |
| 6 (`shots/legends/round-6/`, L4 round 1) | 1. a dunker's face sat at rim height with the ball on the nose; 2. a rim-hanger's head covered the rim; 3. the height charts were measured on the old head; 4. the high-five was missing from the lab; 5. beards cover the number on some players (kept: the chin sits right over it) | 1–4 in round 7 |
| 7 (`round-7/`, L4 round 2) | left for later milestones: 1. layups and tip-ins still put the rim at face height (L5); 2. the phone's big banners cover the faces (L8); 3. no pixel treatment yet (L7); 4. a close contest still shows mostly one face, as §3.11 intends; 5. celebration hands float far from the body (L5 adds the new celebrations) | L5, L7, L8 |

Tests
- Smoke 87 of 87 (new step: every hand pose and part paints, the held-ball remap is continuous and keeps chest-height
  balls off the face, overlapping heads send the defender behind and non-overlapping ones come back, the colorway
  unlocks). Modes 13 of 13, old saves 16 of 16, dev tools all OK, phone audit: no errors; zero console errors.
- `balance.js 12 21`: every target passes (brute 1.28, timing 2.02, Legend beats Pro 84%). `careersim.js 40`: as in L2
  and L3 (Hall of Fame 3 of 40 ✗, everything else ✓; the 200-career check in L3 passes).
- §2 gate re-run after §3.11 (it only changes drawing): identical to L1 (mirror PPP 1.44 ✗, team A 50%, Legend beats
  Pro 77%, brute 0.98, timing 2.07).
- `perf.js` (844×390 @2x, software raster): guard level 0 median 18.5 ms, p95 23.2 ms; 4× CPU 95.1 ms. M9 measured
  26.1 / 44.7 ms and 169.5 ms on the same test; this machine varies run to run, so the new body is at least no slower.

## L3 — Facial hair and hair (graphics overhaul, milestone 3)

Hair and facial hair are redrawn to §3.8–§3.9 in the same bold, cel-shaded language as the L2 faces. Shots:
`shots/legends/round-4/` and `round-5/` (the two L3 rounds: Legends check pages, the Hair page and in-game frames) and
`shots/l3/round-final/` (every Art Lab view).

What is new
- Facial hair (§3.8, `paintFacialHair` rewritten). The regions now follow each head archetype's own outline and the
  mouth instead of fixed polygons, so a Long face's beard reaches its long chin and a Heart face's goatee sits on its
  pointed one. Every solid piece (mustache, goatee, chin strap, full beard) is a solid fill in the hair color with a
  3-tone cel treatment (base, a far-side shadow band, a top highlight band), tufted edges (triangles 0.02–0.03 pointing
  along the growth direction), 22–66 flow strokes in hairDark α 0.5 and hairLight α 0.35, and the bold outline around
  the piece and its tufts as one shape. A full beard grows 0.07 past the jaw line under the chin.
- Paint order: the stubble sits in the skin; the solid pieces are painted after the head's outline (so a beard can
  grow past the jaw); the nose and the mouth are painted after the beard, so the lips and their outline sit on top. The
  mustache's lower edge follows the expression's upper lip (higher over a grin, lower over pressed lips).
- Stubble: a new tile of 1,200 dots per 64 × 64 at 0.8 px, laid twice along the jaw line (densest there), fading to
  nothing toward the cheeks through an offscreen layer.
- Hair (§3.9): every style is a solid silhouette with the bold near-black outline (0.03 head widths, never under 2.2 px),
  two-tone cel shading (the shadow band is what the mass shifted toward the key light leaves uncovered, so it always
  sits on the lower back edge) and one curved gloss band at α 0.6. Black and near-black hair gets a lit tone mixed
  halfway toward #3E3C4E so the two tones read.
- Fades and line-ups (buzz, taper, and the faded sides under high tops, curly tops, twists, locs, cornrows and the bun):
  a crisp 0.012 hairDark hairline edge; the fade gradient runs only down the sides.
- Afro, curly top and twists: outlined clumps, each with its own shadow crescent, highlight arc and curl mark; the afro
  is 37 clumps, drawn behind the head and again over the crown, with a scalloped fringe along the hairline. Twists are
  outlined tubes with a highlight line.
- Locs and box braids keep their verlet chains; each strand is an outlined tube (0.016 each side) with a highlight line.
- Bald: the §3.4 scalp gloss; 30% of bald heads keep a faint stubble shadow on the sides.

Tuned after looking at the Art Lab

| Item | Before (M2) or spec | Now | Why |
| --- | --- | --- | --- |
| Hairline | M2's hairline | 0.05 higher (`hairlineLift`); the afro's fringe and the cornrows' starts move with it | the 1.4× brows and bigger L2 eyes ran into the hair (round 2 of L2) |
| Front locs | anchored at x 0.30–0.38, kept right of 0.27 | anchored under the temple's hair at x 0.43–0.475, kept right of 0.46 (`frontLocX`) | they covered the near eye |
| Long hair's front lock | x 0.34–0.56 | 0.08 further out (`frontLockDX`) | it covered the facing cheek |
| Buzz cut's window highlight | α 0.8 (§3.4) | α 0.45 on a buzz (`buzzWindowA`); bald heads keep 0.8 | over hair it read as a shiny cap |
| Full beard's facing side | — | it meets the silhouette on a diagonal 0.03 below the cheek line (`beardCheekDrop`) | a horizontal sideburn edge made a boxy notch |
| Stubble | even density | fades in from y 0.04 to 0.30 (`stubbleFade`) | "fading toward the cheeks"; a hard top edge read as a mask |
| Afro | one blob with curl marks | 37 outlined clumps, redrawn over the crown | the head's outline cut a dark ring through the hair |

New constants (all in ART): `hairOutline` 0.03, `strandOutline` 0.016, `hairShadeShift` [0.05, −0.045], `hairGlossA`
0.6, `blackHairBase` #3E3C4E, `hairlineLift` 0.05, `hairlineEdgeW` 0.012, `baldStubbleRate` 0.3, `frontLocX` 0.48,
`frontLockDX` 0.08, `beardShade` 0.06, `beardGrow` 0.07, `mustacheH` 0.055, `chinStrapW` 0.055, `stubbleDots` 1200,
`stubbleFade` [0.04, 0.30], `beardCheekDrop` 0.03, `buzzWindowA` 0.45.

Rounds (no `reference/` folder; compared against §3.8–§3.9 and the L2 notes)

| Round | Biggest differences | Fixed in |
| --- | --- | --- |
| first render (not kept) | 1. a boxy notch where the full beard met the facing sideburn; 2. stubble had a hard top edge; 3. loc root strokes poked out above the head; 4. a strand highlight was swallowed by a comment (the build lint caught it); 5. the front locs bunched into one stick | round 4 |
| 4 (`shots/legends/round-4/`, L3 round 1) | 1. the head's outline cut a dark ring through the afro; 2. the afro fringe read as a separate roll; 3. the buzz cut read as a shiny cap; 4. front locs started above the head, detached; 5. the phone's big banners cover the faces (UI, L8) | 1–4 in round 5; 5 in L8 |
| 5 (`round-5/`, L3 round 2) | what is left is outside hair: 1. heads pile up in contests (L4, §3.11); 2. bodies are small next to the heads (L4, §3.1); 3. hands are mittens (L4, §3.10); 4. the phone banners (L8); 5. hair has no pixel treatment yet (L7) | L4, L7, L8 |

Tests (L3 changes no gameplay)
- Smoke 86 of 86, modes 13 of 13, old saves 16 of 16, dev tools all OK, phone audit: no errors; zero console errors.
- `balance.js 12 21`: brute force 1.28 PPP against Pro, perfect timing 2.02, Legend beats Pro 84%. Every target passes.
- `careersim.js 40`: every target passes except the Hall of Fame, 3 of 40 (8%, as in L2). `careersim.js 200 4`: 26 of
  200 (13%) and every other target passes too (OVR 56 / 68 / 76 at 17 / 21 / 25, peak 78, 0.95 titles per career),
  so the 40-career miss is sampling noise.
- §2 gate: identical to L1 and L2 (Legends mirror PPP 1.44 ✗ against 0.90–1.25; team A 50%; Legend beats Pro 77%;
  brute force 0.98; timing 2.07).

## L2 — Faces (graphics overhaul, milestone 2)

The face painter is rewritten to the spec's §3.2–§3.7: bigger features, six head archetypes, five nose types, cel
shading with crisp gloss, bold near-black lines, new eyes and mouths, and a new Laugh expression. Everything is in the
ART section (`parts/025_art.js`); the face editor (Create → Face) gains Face shape and Nose pickers and the wider slider
ranges. Shots: `shots/legends/round-1/` … `round-3/` (the Legends check pages and in-game Legends View frames, desktop
and phone) and `shots/l2/round-final/` (every Art Lab view). There is no `reference/` folder in the repo, so each round
was compared against the spec's written targets (§1, §3) instead of reference images.

What is new
- Layout (§3.2): eye line −0.07, near eye 0.27 × 0.15, far eye 0.21 × 0.13, irises 0.068 / 0.058, brows 0.045 above the
  eye and 1.4× thicker, nose tip (0.31, 0.15) with radii 0.09 × 0.07, wing 0.075 × 0.055, mouth (0.15, 0.33) with
  half-width 0.20·mouthW, lips 0.03 / 0.05 × lipFull, back ear 0.09 × 0.14.
- Head archetypes (§3.3) replace the old anchors, still joined by Catmull-Rom: Round, Square, Long, Egg, Pear, Heart,
  with the spec's crown, temple, cheek, jaw and chin numbers. Nose types: Button, Straight, Wide, Hooked (a convex bump
  40% down the ridge), Long (tip 0.04 lower).
- Wider `FACE_RANGES` exactly as the spec lists them. `faceParamsFromSeed` picks a shape and a nose, then pushes
  parameters to the outer quarter of their range until at least 3 of the 6 character parameters (jaw, chin, eye size,
  nose width, lips, brows) are there. The ranges are the same for every skin tone; no feature is tied to a tone. Old
  looks without a shape or nose get one derived from their seed (normLook), so old saves keep a stable face.
- Layer order (§3.4), all clipped to the head: base → key light α 0.6 → cel shadows in the skin's shadow color α 0.85
  with a 0.03 soft band (far side, brow ridges, under the nose, under the lower lip, jaw/neck band, cheek hollows on Long
  and Square) → deep occlusion α 0.5 (nostril, mouth corners, ear canal, inner eye corners) → warm zones α 0.4 → white
  gloss → rim light #FFE2B8 α 0.6, 0.04 wide → grain α 0.05. The old diagonal nose "scar" stroke is gone.
- Lines (§3.5) in #150B10: the silhouette max(0.04 u, 2.2 px) plus 0.015 along the jaw and chin; upper lid 0.03 with a
  wing, lower lid 0.014, nose ridge 0.022, nostril 0.018, lip line 0.024, smile folds 0.018, ear fold 0.018. Detail lines
  in the skin's shadow color α 0.5, 0.012: nasolabial folds, forehead lines from 25 (or when focused), under-eye creases
  from 28, dimples on 15% of faces, a chin cleft on 10%.
- Eyes (§3.6): sclera #FAF8F4 with the top 30% lid-shaded, iris gradient with a dark limbal ring (outer 8%), pupil 0.45 of
  the iris, catchlight 0.32·ir at α 0.95, a filled lash line that tapers into a wing, the lid fold 0.035 above, brows with
  hair strokes over a solid base at α 0.9.
- Mouths (§3.7): the hyped grin (a D shape, 8–10 upper teeth 0.045 wide with separators and a lit top third, 6 lower
  teeth, gums #D9707C, tongue, full lips, deep folds, raised cheeks); the neutral smirk rising 0.02 toward the facing
  corner with a gloss dot; focused (pressed lips, corners down, a jaw-clench line); angry (both rows bared, a snarl);
  shocked (a dark O with the top teeth and tongue); the effort yell (top teeth, tongue, uvula).
- Laugh (new, `EXPRS` now has 8): the grin with crescent eyes and the head tilted back 6°. A made dunk shows it for
  1.5 s, a posterizer for 1.8 s.
- §9: a 384 px face bucket, and a warm-up: the first time a live player's face is drawn at a size, all 8 expressions
  are queued and painted one per frame inside the paint budget (`faceWarmQueue` / `faceWarmTick`). Both players are
  fully cached about a second into a match (the smoke test checks it). Measured paint cost per face: 0.75 ms at 96 px,
  1.1 ms at 224, 1.7 ms at 320, 2.1 ms at 384 (desktop Chromium; 2.4 ms at 384 in the phone emulation).
- Art Lab → Legends check (§10): page 1 is the 8-character lineup at in-game Legends View scale on a maple floor with
  α 0.32 reflections fading over 1.4 m; pages 2–9 are each character's 8 expressions as 384 px portraits; page 10 is
  the pose strip (run, jump shot, one-hand dunk, front-flip dunk, knockdown, celebration). `LAB_ONLY=legends node
  tests/artlab.js legends <round>` saves the pages plus in-game frames.

Tuned after looking at the Art Lab (§0: "if something looks wrong, tune it and log it")

| Item | Spec | Now | Why |
| --- | --- | --- | --- |
| Nose ridge start | bridge at (0.19, −0.02) | 0.03 below the near eye (`noseRidgeGap`), and only the lower part is inked (from 40% of the ridge on straight and long noses, 50% wide, 15% hooked, all of a button; `noseRidgeFrom`), tapered 0.003 → 0.022 | y −0.02 is inside a 0.15-tall eye centered at −0.07: the line cut through the eye and ran across the cheek like a scar |
| Nose-bridge gloss | (0.20, −0.02) → (0.24, 0.06), 0.02 wide, α 0.5 | the same width and α, laid along the ridge 0.026 inside it, from 36% to 64% of its length, as a lens | at the spec spot it sat under the eye like a tear |
| Cheekbone gloss | (0.36, 0.02), α 0.45 | (0.39, 0.05), α 0.4 (`cheekGloss`, `cheekGlossA`) | against the bigger near eye it also read as a tear |
| Chin gloss | a dot r 0.015 at (0.14, 0.52), α 0.5 | an ellipse 0.026 × 0.011 at the chin, α 0.45, skipped when the mouth is open | the dot read as a stray speck and collided with open mouths |
| Mouth's facing corner | half-width 0.20·mouthW both ways | the facing half stops 0.07 inside the silhouette (`mouthEdgeGap`), grins 0.045 (`grinEdgeGap`) | on Heart and Egg jaws the facing corner ran into the outline |
| Effort yell | 0.26 × 0.20 | 0.32 × 0.24 × mouthW (`yellW`, `yellH`) | read small next to the grin |
| Shocked O | 0.10 × 0.14 | 0.13 × 0.18 full size (`shockO`) | +30% per §1's "features 30–40% bigger". Round 0 read the spec as radii (0.20 × 0.28), which broke through narrow chins |
| Lid shade color | not given (the skin's shadow color was used) | '#6A5A66' for every tone, over 30% of the open eye's height (`lidShade`) | the skin shadow color made dark-skinned eyes read as shut; the band also ignored how open the eye was |
| Eye gap | eyeSpacing ±0.03 | the same range, but the inner corners never come closer than 0.07 (`eyeGapMin`) | eyeSize 1.3 with eyeSpacing −0.03 made the eyes touch |
| Brow inner end | not given (1.05 of the eye's half-width) | 0.95 (`browInner`) | brows joined into a unibrow over close-set eyes |
| Lip line | 0.024 | 0.024 in the middle, tapering to 0.008 at the corners, with a small upturn at the smirk's corner | a uniform line read as a long thin slit |
| Face editor preview | head width 330 at y 330 | 300 at y 365 | the taller archetypes covered the subtitle |

Rounds (the five biggest differences from the written targets each time, then fixed)

| Round | Biggest differences | Fixed in |
| --- | --- | --- |
| 0 (first render) | 1. the nose ridge cut through the near eye like a scar; 2. the bridge gloss read as a tear; 3. mouths ran into the silhouette on narrow jaws; 4. the yell read small; 5. the shocked O broke through narrow chins | round 1 (see the table above) |
| 1 (`shots/legends/round-1/`) | 1. dark-skinned eyes read as shut (lid shade); 2. the chin dot read as a speck; 3. the cheekbone gloss read as a tear; 4. Legends-check portraits: tall hair covered the captions; 5. the pose strip overlapped two players per pose | round 2 |
| 2 (`round-2/`) | 1. big close-set eyes touched; 2. brows joined into a unibrow; 3. locs and long hair fall over the facing side and hide the near eye; 4. afro and tall-hair hairlines sit on the brows; 5. heads pile up in contests, bodies are small, hands are mittens | 1–2 in round 3; 3–4 are hair (L3); 5 is the body (L4) |
| 3 (`round-3/`) | what is left is outside the face painter: 1. hair over the face (L3); 2. hairline height (L3); 3. beards are stubble textures, not shaped cel fills (L3, §3.8); 4. body proportions, sneakers and hands (L4, §3.1, §3.10); 5. head overlap in contests (L4, §3.11) | L3, L4 |

Tests (L2 changes no gameplay; only presentation, plus the laugh expression after dunks and posterizers)
- Smoke 86 of 86 (a new step: a Legends match warms all 8 expressions of both players within 2 s; 300 seeds each put
  at least 3 of 6 character parameters in the outer quarter; every shape × nose × expression paints). Modes 13 of 13,
  old saves 16 of 16, dev tools all OK (tunnelTest 0 of 1000), phone audit: no errors. Zero console errors throughout.
- `balance.js 12 21`: brute force 1.28 PPP against Pro, perfect timing 2.02, Legend beats Pro 84%. Every target passes.
- `careersim.js 40`: OVR 57 / 69 / 77 at 17 / 21 / 25, peak 79, 0.80 titles per career, 0 stuck. Every target passes
  except the Hall of Fame: 3 of 40 (8%) against 10–20%. The career sims run no art code; see the L3 section for a
  200-career check.
- §2 gate (`gate.js`): identical to L1. Legends: mirror PPP 1.44 (target 0.90–1.25, still ✗), team A wins 50%, Legend
  beats Pro 77%, brute force 0.98, timing 2.07.

## L1 — Legends View (graphics overhaul, milestone 1)

Legends View is the new default presentation for every 1v1 (career, exhibition, practice, the tutorial): a 13 m court
seen whole, players drawn 1.3× taller. Settings → Camera (1v1) switches between Legends View and Classic; 2v2 and up and
the 3-point contest always use Classic. Shots: `shots/l1/` (desktop and phone, arena, gym, street half court, and the
same arena in Classic).

The layout (`CONFIG.layout.legends`, `useLayout()` in the physics section)

| Item | Classic | Legends | Note |
| --- | --- | --- | --- |
| Baseline to baseline | 24 m | 13.0 m | as spec |
| Hoop center from baseline | 1.6 m | 1.3 m | as spec |
| Wall behind the baseline | 1.4 m | 0.9 m | as spec |
| 3-point radius / free throw | 6.75 / 4.6 m | 4.6 / 3.1 m | as spec |
| Rim height | 3.05 m | 3.05 m | as spec |
| Horizontal scale h | 1 | 0.58 | as spec |
| Shot zones (÷ 3-point radius) | 6.75 / 8.5 / 11 m | three 1.0, deep 1.1, heave 1.6 | spec deep 1.25; see the gate |
| Apex constant | 0.9 | 1.1 | as spec |
| Body contact distance | 0.62 m | 0.75 m | as spec (§3.11) |
| Visual scale | 1 | 1.3 | as spec |
| Street half court: check ball / players stay within | 8.2 m / the midcourt line | 5.6 m / 7.0 m from the hoop | new: the short court's midcourt line is only 5.2 m out, inside the check spot. A dashed line on the floor marks it |

How the scale is applied. One registry (`LAYOUT_SCALED`) lists every gameplay value the layout touches; `useLayout()`
rewrites them from base values captured once, so Classic always comes back exactly as authored (the smoke test checks
it). Three rules:
- Horizontal speeds, accelerations and distances to the hoop scale by h (`LX`): run and sprint speed, acceleration and
  friction, pass speeds, move speeds and distances, dunk, layup, floater, hook and post ranges, the charge arc, help and
  hold lines, loose-ball pops, and every such literal in the mechanics, the rules, the AI and the balance harness.
- Distances between two players scale by h beyond body contact (`LP`: contact + (d − 0.62) × h). The spec scales these
  by h too, but the contact distance itself grows to 0.75 m, so a plain h would put steals, contests and sags inside the
  bodies (a swipe could only reach 0.08 m past contact). Contests, steal and ankle ranges, sag, closeouts, the stance and
  square ranges, the inbound and check gaps.
- Places tied to the arc scale with the 3-point radius (`LR`, 4.6 / 6.75): the AI's spacing and solo spots, the pickup
  lines, bank-shot range, shotLab's test spots.
Two reaches that end at the other player's ball are derived so the reach past body contact scales by h:
`block.handForward` 0.32 → 0.37 m, `steal.reach` 0.9 → 0.76 m. Vertical stays real (jumps, rim, reach, gravity), and the
ball keeps real physics (the solver works in meters).

The camera (`CONFIG.camera.legends`): ppm = min(W ÷ 14.8 m, H ÷ 6.2 m); the floor line at 80% of the screen; a damped
drift toward the ball of at most 0.35 m; a 4% punch-in on dunks and blocks; the usual shake; no dynamic zoom; no
off-screen arrows. A replay still cuts in closer (it is a highlight, not live play).

Drawing at 1.3×. Bodies, hands and shadows use the drawn height; the rig normalizes world anchors (rim, ball, reach) by
the drawn height, so a hand at the rim or on a loose ball lands on the real point. A ball in the hands is drawn in the
same scaled frame so it sits in the drawn hands, easing back to its real place when it leaves the hands (22/s); a ball in
a dunk, a layup, a tip or just caught is drawn where it is. Hitboxes do not change.

Measured: a 2 m player is 33% of the screen height at 1280×720 and 38% at 844×390 (spec target "about 45%": with the
whole 14.8 m court across a 16:9 screen, 45% would take a visual scale near 1.7). Left for the body and animation
milestones to judge in the Art Lab.

Bugs found by the gate (they were in Classic too)
- A mirror match went 56% to team A in Classic and 57–59% in Legends. Three causes, all fixed:
  - Loose balls that were not rebounds (the tip, pops, blocks) were scored against team A's basket in a scramble. They
    now use the basket nearest the ball (`looseRefX`). This one was most of it: after the tip, team A's jumper caught
    its own tip and got stripped.
  - A shot's contest, rim protection, rim duels, swipes and ankle-breaker checks read the other player's live position,
    one step fresher for whoever updated second. They now read where everyone stood when the step began
    (`snapStartOfStep`).
  - After an airborne catch, the dribble hand stayed on the default right side instead of turning toward the hoop.
  Classic mirror after the fixes: 51% (300 games, both ways round). A small side effect remains in both layouts (the
  side attacking right won 53% in Classic and 56% in Legends over 300 games); the gate plays half its mirror games
  each way round.
- The free-throw camera assumed midcourt at x = 12.
- The offseason put new rookies in the league without a standings row, so the League page crashed if you opened it
  before the next season started (an old-save fixture reached that state once simulated games ran in Legends View).

Classic after the bias fixes (`node tests/balance.js 12 21`): brute force 1.28 PPP vs Pro (M7: 1.18; target ≤ 1.30),
perfect timing 2.02 and reads 1.93 (M7: 1.88, 1.80), Legend beats Pro 84% of 96. The fixes move Classic a little
because they change who wins scrambles and contests; the targets still hold.

The §2 gate (`node tests/gate.js 300 12`: 300 mirror games both ways round, 200 Legend-vs-Pro games, the harness at 12
games per cell)

| Target (Legends) | Legends | Classic |
| --- | --- | --- |
| Pro mirror PPP 0.90–1.25 | **1.44 ✗** | 1.65 |
| Mirror: team A wins 45–55% | 50% ✓ | 51% |
| Legend beats Pro 75–95% | 77% ✓ (PPP 1.56 vs 1.28) | 82% |
| Brute force vs Pro ≤ 1.30 PPP | 0.98 ✓ | 1.28 |
| Timing and reads beat brute force | 2.07 ✓ | 2.02 |

Harness PPP, scripted human vs Pro / vs Legend: Legends — brute 0.98 / 0.97, mash 0.30 / 0.29, drives 1.47 / 0.99,
threes 1.37 / 0.87, perfect timing 2.07 / 1.64, reads 1.62 / 1.45. Classic — 1.28 / 1.31, 0.35 / 0.25, 1.15 / 0.87,
1.56 / 1.19, 2.02 / 1.31, 1.93 / 1.15.

Tuning to the gate. The straight layout gave a mirror PPP of 1.58 (Classic 1.65), Legend over Pro 86% and a
perfect-timing shooter at 2.71 PPP against Pro: the short court brings a walking shooter into range before the on-ball
defender is set, and the "contain the drive" rule froze the defender 1.6 m off him. The spec's levers:

| Value | Straight layout | Now | Why |
| --- | --- | --- | --- |
| Deep zone from | 1.25 × radius (5.75 m) | 1.1 × radius (5.06 m) | fewer "three" looks from far out |
| `ai.sagMin` / `ai.soloSagMax` | 0.91 / 1.00 m | 0.78 / 0.80 m | the on-ball defender plays at body contact |
| `ai.pickupDistSolo` / `…SoloBig` | 5.79 / 4.63 m | 6.5 / 5.5 m | he meets the handler before the arc |
| `contest.proxNear` / `proxRange` | 0.74 / 0.93 m | 0.85 / 1.3 m | the drawn arms are longer: a contest counts from farther (a "lateral contest distance") |
| `ai.legendsCloseGap`, `ai.legendsStepUpMaxV` | — | 0.75 m, 7.1 m/s (× h) | new: a defender deeper than his sag + 0.43 m steps up to a handler in shooting range who is not sprinting, instead of containing |
| h | 0.58 | 0.58 | 0.45 lowered the mirror PPP to 1.41 but dropped Legend over Pro to 71% and left the mirror lopsided |

The mirror PPP target is not met. The levers moved it from 1.58 to 1.44; the rest of the gap is the make table and the
timing windows, which the spec keeps unchanged (Classic sits at 1.65, so the target is below the engine's own level). In
the career format (2 × 2:00 halves) the two layouts score the same per game (33.4 vs 33.2 points per player): Legends has
more possessions (24.3 vs 21.5) at a lower PPP, so the league model fitted on Classic games still matches. A career's
simulated games now use the same layout as the ones you play.

Tests: the smoke test (85 steps) checks the Legends court and camera, that a headless Classic sim in between does not
leak into a live Legends match, that Classic comes back exactly, and that 2v2 stays Classic. `tests/gate.js` prints the
gate tables. runSims, shotLab and tunnelTest take a layout.

## M9 — Phone pass, bug sweep, performance, before/after gallery

M9 adds no features. It makes every screen work at phone size, sweeps every mode and every old save, measures the frame
cost and adds one step to the performance guard, reruns the balance harness and the career simulator, and builds the
before/after gallery.

The phone pass (spec: "Phones (844×390): tap targets at least 64 px, safe-area insets respected, nothing overflows a panel")

An audit script (`tests/phoneaudit.js`) opens screens at 844×390 with touch and lists every widget narrower or shorter
than 64 CSS px, every widget off the screen, every pair that overlaps, and the smallest text drawn. Its first run covered 43
screens and flagged 22: settings (19 rows 22 px tall), How to Play, Extras, Quick 1v1, the tournament and 3-point setups,
the Hall of Fame, the face editor, the amateur standings and history, the draft decision, the league, player and management
pages (their View selects, the staff and shop lists), the offseason and its contract offers, the classic team league
(37 px face buttons), and the All-Star weekend, whose "Sim the contest" button sat below the screen.

New UI-kit pieces, used on every flagged screen:
- `phonePager`: a long list becomes pages of 64 px rows, in one or two columns, with ◀ ▶ in the bottom bar and a
  "SECTION · PAGE 1 / 2" chip. Fixed pages can hold a grid (the classic league's faces, four to a row).
- `phoneBar`: a screen's bottom buttons as one bar of 64 px buttons.
- Tall rows: on a phone a select, slider or toggle 64 px tall draws its label over the control in bigger type (22–32
  design px instead of 18). Tapping the left or right half of a select steps it back or forward.

What each screen became on a phone:
- Settings: two pages of eight rows (Gameplay; Feel, sound & touch). The keyboard preset is hidden on touch screens.
  Reset and Back sit in the bar.
- Quick 1v1: two pages beside the matchup (the half-court rows only appear for the half-court ruleset); PLAY and Back in
  the bar; bigger names.
- The face editor (both careers): three pages of rows beside the face.
- How to Play: the touch column of the controls table and one tip at a time in bigger type.
- Extras, the tournament, the bracket, the 3-point contest, free practice, the Hall of Fame (five bigger cards a page),
  the draft decision, the amateur standings and history, the All-Star weekend, the 3-point results, the postgame: 64 px
  buttons in a bar or a grid.
- The league, player and management pages: View (and Player) and Back in the bottom bar; lists end above it. Staff are
  four big selects with their notes underneath; the shop is a grid; sponsor offers are 64 px rows.
- The offseason: contract offers are 64 px rows with the facilities on a second line; the step's buttons are in the bar.
- The on-screen name keyboard: 64 px keys across the whole screen.
- The classic team league: faces in pages of eight, the hub menu in pages, and every list (shop, front office, lineup,
  trades, free agents, game plan) in pages of rows.

Result: the last audit run checks 65 screens (the M8 hubs, cards and story screens included) and finds no target
under 64 px, nothing off the screen, no overlaps, and no text running past its button (a check added late, after the one
look at the published page showed the menu's Extras sub-label spilling out of its button; it also caught the classic
league's team blurbs overflowing their cards on every screen size). `--desktop` runs the same screens at 1280×720: also
clean. The smoke test checks every page of the paged screens. Screenshots: `shots/m9-final/phone/`.

Bugs found and fixed
- Extras → Practice opened the main menu, or with a career saved, the career's practice week. M8's career practice
  screen was also named `practiceScreen`, and in one script the later function silently replaces the earlier one. The
  Extras screen is now `freePracticeScreen`; the classic league's Training button had the same bug. The smoke test's
  practice step used to press whatever primary button appeared, so it passed; it now checks for the free-shooting screen.
- `tests/check-syntax.js` now fails on two top-level functions with one name. On its first run it caught a second clash
  before it shipped: the new phone rows' `fitFont` had the UI kit's name with the arguments in another order.
- A v2 save whose classic team league had an empty league crashed when you opened Team league. On load the league is now
  rebuilt around the same player; coins, awards, results and career numbers stay (`tcRepair`).
- On the tall phone toggles the ON/OFF text ran under the knob.
- Two-line button sub-labels were never fitted to the button: on a phone the menu's "team league · modes · art lab" ran
  past both edges. The classic league's team blurbs overflowed their cards at every size. Both now shrink to fit.
- The screenshot tour (`tests/shots.js`) pressed the removed TRAIN button and stopped at M8's story cards. It now answers
  the press, walks the cards one at a time and shoots the Practice screen.

New tests
- `tests/oldsaves.js`: every save in `tests/fixtures/` goes through a page reload and 160 actions on the real screens (weeks
  with rotating plans, the press room, recruiting and visits, commitment day, the combine and the draft, All-Star weekends,
  playoffs, offseasons and contracts). Then the hub's pages are drawn and the classic league plays two games. Ten new fixtures
  come from four older builds (`tests/gen_oldsaves.js` runs the builds from git history: before M0, M0, M5 and M7): a
  high-school career with a classic league on the side, a mid-season pro career, and from M7 a playoff and an offseason
  save. 16 of 16 pass, most reaching three to five seasons further.
- `tests/modes.js`: every mode played to its end through its screens: Quick 1v1 in all three rulesets with a rematch, a
  whole street tournament, the 3-point contest twice, practice, the tutorial, the classic league in 5v5 and 3v3, and in
  the career a live high-school game, a 60 s drill, a pro game from the pregame to the result, and the All-Star weekend
  played live. 13 of 13 pass.
- The smoke test: 82 → 84 steps (the guard's last level; every page of the paged phone screens).

Performance (`node tests/perf.js`, pro arena, 844×390 at 2×, headless Chromium with software raster)

A CPU profile of 240 frames shows where the time goes: about 72% is rasterizing the canvas (it lands on the 1-pixel
readback that closes each timed frame) and about 10% more in `drawImage`. The game's own JavaScript is about 5 ms a frame.
So the cost is pixels, and this machine's speed varies: the M7 build and this build, measured back to back twice, gave a
guard-0 median of 23.9 and 30.8 ms (M7) against 23.1 and 29.3 ms (M9). There is no regression: M8's renderer changes only run in
drills, and M9's only at the new guard level.

| Value | Spec | Was | Now | Why |
| --- | --- | --- | --- | --- |
| `perf.maxLevel` | shed cost in order: crowd rate, reflections, glow | 3 levels | 4 | A fourth step for devices that are still slow with everything shed |
| `perf.lowDpr` | — | — | 1.25 | At guard level 4 a match renders at 1.25× instead of the device's 2× (39% of the pixels). Menus stay sharp: the resolution comes back when the match ends or the guard recovers |

| Guard level | 1× CPU, median / p95 | 4× CPU, median |
| --- | --- | --- |
| 0 (everything on) | 26.1 / 44.7 ms | 169.5 ms |
| 1 (crowd at 15 Hz, fewer particles) | 31.2 / 41.6 ms | 160.0 ms |
| 2 (no reflections) | 27.8 / 42.6 ms | 160.9 ms |
| 3 (no bloom or beam dust) | 28.7 / 44.2 ms | 157.4 ms |
| 4 (new: the match at 1.25×) | 16.2 / 24.9 ms | 104.1 ms |

In the same run levels 0–3 differ by less than the machine's noise; level 4 is the first step that clearly moves the cost.
These are CPU-raster numbers, not a phone: phone browsers rasterize canvas on the GPU.

Balance and the simulators (no gameplay or career changes in M9)
- `node tests/balance.js 12 21` reproduces the M7 table exactly: brute force 1.18 PPP against Pro, perfect-timing jumpers
  1.88, reads 1.80; Legend beats Pro in 75 of 96 games (78%). Every target passes.
- `node tests/devtools.js`: no softlocks, no invariant failures, no tunneling in 1000 balls; shot-lab rolls are honored
  100%. Its 40-game Legend-vs-Pro sample gave 70% (the 96-game harness above is the reference).
- `node tests/stylemix.js`: post-ups 51% (target 45%), shooter jumpers 57% (55%) with 49% threes (half), slasher drives
  59% (60%).
- `node tests/heighttest.js`: 2.12 m against 1.82 m with the career's height shifts, 29–31 in 60 games (1.44 against
  1.43 PPP).
- `node tests/careersim.js 200 4` (a seed the M8 tuning never saw): median OVR 56 / 68 / 76 at 17 / 21 / 25, peak 78,
  0.95 titles per career, Hall of Fame 13%, 0 stuck careers. Every target passes. Draft: 15 #1 picks and 24 undrafted of
  200. The week: practice 63%, rest 26%, film 11%; 3.3 injuries per career.

Before/after gallery: `shots/before-after/`, 52 pairs (44 desktop, 8 phone): every M0 audit shot beside the same shot on
this build, with notes in `shots/before-after/NOTES.md`.

## M8 — Career systems

Before M8 a season was Play or Sim clicking. M8 adds the week (Practice, Rest or Film before every game, fatigue and injuries), the story (press questions after big games, hype and confidence, the rival's scripted moments, a headlines feed), recruiting (offers across the four tiers, official visits, the rival's recruiting battle, commitment day), hidden potential, the first-ten-minutes story cards, the pro extras (4-year deals, the All-Star 1v1, All-League 1st and 2nd teams, the spec's DPOY), a trophy case and a career timeline. It ends with the career simulator tuned onto the §6.5 targets. Everything below is in CONFIG with a one-line comment.

The week (`CONFIG.week`, both careers)

| Value | Spec | Was | Now | Why |
| --- | --- | --- | --- | --- |
| `practiceFocusMul` | Practice: +40% focus XP this week | — | 1.4 × the game's focus share (45% of its XP) | as spec |
| `drillXp`, `drillSeconds` | 60 s playable drills, 30–120 XP by score | pro only: a 60 s shootout, or a scrimmage to 7 for other foci; 30–84 XP | 30–120 XP. Shooting plays the shootout; Handles and Finishing play "Beat your man" (you attack every possession for 60 s of game clock: points + 2 per ankle-breaker, or + 1 per rim finish); Defense plays "Get stops" (your partner attacks: 1 per stop, + 1 per steal or block) | as spec. The drills run on the half-court rules with a new `drill` match option |
| `drillGreat` | — | — | full pay at shooting 24, handles 45, finishing 55, defense 14 | About twice what a Pro bot scores (bots average 25, 31 and 7.5 in the 60 s drills, `scratchpad/drillprobe.js`), so an average drill pays about the middle of the range |
| `simSessionXp` | — | pro: 40 XP a session | 10 XP (× intensity) | A simmed practice is the +40% focus XP plus a small session. Tuned down from 20 with the simulator |
| Practice and the age curve | teens learn fastest; decline after 30 | the pro screen showed an age multiplier the code never applied | practice XP × min(1, age multiplier) | Teens get the spec's 30–120, not 45–180, and a veteran who plays every drill still declines |
| `intensity` | — | light / normal / hard: energy 8 / 15 / 26, XP ×0.6 / 1 / 1.5, injury risk 0 / 0.4% / 1.5% | XP ×0.6 / 1 / 1.5; hard adds 6 fatigue and a 1% injury risk | The old pro feature kept on the fatigue scale |
| `restFatigue` | Rest: fatigue −25 | recovery day: +22 energy | −25; an injury also heals a game faster | as spec |
| `restPhysio`, `restGym` | — | +4 / +3 energy a week per level | Rest takes off 5 / 3 more fatigue per level | The pro staff and home gym keep a purpose |
| `filmBonus` | Film: +0.3 DEF and SHO next game | — | +3 career points (0.3 engine) against that opponent; the film room shows how they score (their build's plan), their best and worst ratings, moves and size, and a game plan | as spec |
| `fatiguePerGame`, `fatigueFreeAt`, `fatigueOt` | +10 a game; above 50, ratings drop (fatigue − 50)% | pro energy: −16 a game, +18 a week; below 60 speed and hops faded up to 12% | +10 a game (+3 after overtime); above 50 every effective rating × (1 − (fatigue − 50)%). No weekly recovery: Rest is how you recover, and a new season starts fresh | as spec. Old pro saves convert (fatigue = 100 − energy) |
| `injuryBase`, `injuryPerFatigue`, `injuryGames`, `injurySpd` | 0.8% + 0.04% × fatigue per game; 1–3 games; −0.5 SPD; a toggle | 1% (+3% when tired) per game and per session; five types, 1–4 games, 5–8 off two or three ratings | as spec, and Settings → Career injuries (on by default) | as spec |
| `injuryPhysio` | — | 0.003 | 0.002 per physio level | Scaled to the lower base chance |

The standing plan: if you play or sim without choosing, your last plan runs (Practice is simmed). The hub shows it with an AUTO tag. A careful simulated career practices 63% of weeks, rests 26% and studies film 11%, and gets hurt 3.5 times.

The story (`CONFIG.media`)

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| `humbleConf`, `confidentHype`, `boastLoss`, `trashHype`, `rivalFire` | Humble +1 confidence; Confident +2 hype, −2 if you lose the next game; Trash talk +3 hype and your rival +2 OVR against you next time | as spec. The rival's +2 is on every rating in the next meeting, in played and simmed games | as spec |
| `confSho`, `confShoMax` | confidence adds ±0.2 SHO | +1 SHO per point of confidence, capped at ±2 (±0.2 engine) | as spec |
| `hypeMax`, `hypeKeep` | hype adds to the draft score | capped at 10; each season end keeps half | Hype adds 1:1 to the draft score, where one point is 2.6 picks. Uncapped trash talk could lift a player a hundred picks |
| `confFade`, `confBlowout`, `blowoutFrac` | — | confidence drifts 0.25 back toward 0 every game; losing by more than 40% of the winning score costs 1 | Without these, humble answers stack to a permanent +0.2 |
| `hypeSalary` | hype adds to salary | +$0.1M per point on your market value | as spec |
| Press triggers (`bigPts` 35, `upset` 5, `pressGap` 3) | a press question after big games | rival games, finals, titles, eliminations, points records and debuts always; upsets (5 OVR) and 35-point nights (and 1.5 × your average) when there was none in the last 3 games | The first version asked after 40% of games (110 a career). Now about 58 a career, one in four games |

The rival's scripted moments are cards: the first meeting, the recruiting battle, draft night and a finals rematch (high school, college and pro finals). Head-to-head results carry from high school into the pros. The headlines feed (THE DAILY DRIBBLE, 40 items) has results, rival watch, career highs, media quotes, injuries, awards and growth spurts. Career highs are kept for the amateur years too.

Recruiting and potential (`CONFIG.amateur.recruit`, `scoutBand`, `scoutSeen`)

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| Offers (`recruit.offers`) | offers across 4 program tiers | one per tier from the best your résumé earns down (OVR + 2 × titles + 2 × MVPs + half your hype), at least three, plus "skip college" for elite seniors. Each program has a coach, a specialty and facilities | Was three buttons |
| `recruit.visits` | campus visits | 2 official visits. A visit shows the program's facilities and what its coach develops, and puts you in their jersey | as spec |
| Recruiting battle | the rival's recruiting battle | the best program has one spot for you or your rival. Pass on it and your rival takes it | as spec |
| `recruit.facXp`, `recruit.coachXp` | — | college game XP +3% per facilities star above one; the coach adds 5% of each game's XP to his specialty | Programs differ. Tuned down from 5% and 10% with the simulator (OVR at 21 was 71) |
| `scoutBand`, `scoutSeen` | hidden potential revealed gradually by scouts | ceilings show as a red band about 18 points wide for a freshman that narrows every season (20% known as a freshman, +15% per high school season, +20% per college season); the band always holds the true ceiling; the combine shows everything. Season recaps carry a scouts' line | Ceilings were shown exactly from day one |

Commitment day: a hat for each program on the table; yours lifts onto your head. The first ten minutes: a FIRST DAY card from your coach before the first game, THE WEEK card after it, and a GROWTH SPURT card the first time you grow.

Pro systems

| Value | Spec | Was | Now | Why |
| --- | --- | --- | --- | --- |
| `career.contractYears` | renewals in pro years 5, 9 and 13 | offers ran 1–4 random years | every deal runs 4 seasons after the 4-year rookie deal; the contract year shows your market value (OVR, fame and hype) and offers from your club and two others | as spec |
| `career.allStar1v1` | an All-Star 1v1 event | the 3-point contest only | the four best by a fan vote (MVP score + 0.15 × fame) play a bracket to 11 at mid-season; you play or sim your games; the champion gets the award, the prize and fame. Being voted in is an All-Star selection. The weekend (with the 3-point contest) is an event you can't miss | as spec |
| All-League teams | 1st and 2nd teams | a first team of 3 | 1st team (top 3) and 2nd team (next 3) by MVP score. The legacy counts 1st teams (old "All-ISO First Team" awards count too) | as spec |
| DPOY | most steals + blocks among the top 4 | steals + 1.1 × blocks per game + DEF, league-wide | the most steals + blocks among the top four in the standings | as spec |
| `career.semisBestOf` | — | — | 1 (unchanged) | A setting for longer series. Testing it found a stall: when your series ended first, the other semifinal never finished. Fixed: the round now plays out |

Trophy case: every award from high school to the pros on wooden shelves (cups, MVP balls, plaques, shields, stars, a net for the 3-point contest), with career highs and the legacy meter. Career timeline: OVR by age (high school, college and the pros in their own colors) with every event underneath: the first game, growth spurts, awards, titles, injuries, commitment, the draft, contracts, retirement.

Tuning the career simulator (§6.5; `node tests/careersim.js`; the new `--set path=value` option tries CONFIG values without a rebuild)

| Value | Spec | Was | Now | Why |
| --- | --- | --- | --- | --- |
| `career.proMean` | 76 | 78 | 83 | The league of generated veterans, rookies and the aging curve settles near 78.5. The spec's league made the median career too dominant: 1.57 titles and a 43% Hall of Fame |
| `career.proSd` | 6.5 | 6.5 | 8 | Real stars at the top (the best other player ~88) |
| `career.prospectMean`, `prospectSd` | — | 69, 4 | 75, 5 | Rookie classes keep the league at strength |
| `career.mvpWin` | — | 40 (in the formula) | 20 | 11-game records are close to a coin flip, so the MVP went to whoever got the best record. Individual play now counts for more |
| `amateur.genesOdds` | — | 0.35 | 0.3 | Slightly fewer gifted careers |
| `amateur.draft.pickRef` | 74 | 90 | 92 | Seven of 40 careers went #1 after M8's college XP |

| Result | Target | M7 build | M8, 40 careers × 3 seeds | M8, 200 careers × 3 seeds |
| --- | --- | --- | --- | --- |
| Median OVR at 17 / 21 / 25 | 55–60 / 66–70 / 74–78 | 56 / 69 / 77 | 57 / 69 / 77 · 56 / 69 / 77 · 57 / 70 / 77 | 56 / 69 / 76 (all three) |
| Peak (median) | ~76–80, declining after 30 | 79 | 79 · 79 · 79 (OVR at 29: 79, at 33: 69) | 78 |
| Draft picks | spread out | #1 ×3, undrafted ×7 | #1 ×4 / 3 / 2 · undrafted ×6 / 6 / 2 | #1 ×15 / 13 / 8 · undrafted ×25 / 21 / 32 of 200 |
| Pro titles per career | ~1 | 1.35 | 0.80 · 1.20 · 1.20 | 1.01 · 1.01 · 1.02 |
| Hall of Fame | 10–20% | 33% | 8% · 15% · 23% | 16% · 16% · 20% |
| Stuck states | 0 | 0 | 0 | 0 |

Forty careers are a small sample: the Hall of Fame rate moves about ±6 points between seeds. The 200-career runs are the tuning reference. Hall of Famers average 2.8 titles, 2.1 MVPs and 5.2 All-League 1st teams; everyone else 0.6, 0.3 and 1.5 (the three 200-career runs).

Also in M8:
- The hub's "this week" slot is the PRACTICE / REST / FILM row (on a phone it sits under the matchup, where three 64 px buttons fit), with a fatigue meter and injury line. Both hubs have News, Trophies and Timeline links.
- The pro hub and the offseason wait for career events (press, rival cards, the All-Star weekend) before moving on.
- Career earnings: salary, prizes and sponsor money add up in the trophy case and the player page (§6.4). Saves from before M8 count from the season they were loaded.
- Gameplay is unchanged: `node tests/balance.js 12 21` reproduces the M7 table exactly (brute force 1.18 PPP vs Pro, timing 1.88, reads 1.80; Legend beats Pro in 75 of 96). The drill rules only run inside drills.
- Tests: the smoke test grew from 68 to 82 steps (the week, injuries, drills, press and hype, rival cards, recruiting, scouting, story cards, awards and contracts, the All-Star 1v1, trophies and the timeline, and every new screen drawn once). Its career flow now answers press questions and walks through the new cards.
- Bugs fixed on the way: the pro result screen said "Ricky will never let you forget this one" whatever your rival was called; the tale of the tape drew ratings under 40 as bars pointing the wrong way; a simmed high school game could credit you with more points than the final score; the old training screen showed an age multiplier the code never applied.
- Removed: the pro energy model (saves convert to fatigue), the "Recovery day" focus (now Rest) and the typed injury table.

## M7 — 1v1 gameplay and AI

The balance harness found three leaks at the start of M7: brute force scored 1.80 points per possession against Pro, a set defender was beaten 2 times in 3 by pushing, and bots had no rim protection (0 blocks). Everything below is in CONFIG with a one-line comment.

Defense: walls, charges, recovery, rim protection

| Value | Spec | Was | Now | Why |
| --- | --- | --- | --- | --- |
| `defense.soloSlipBase` (+ `soloSlipMin`, `soloSlipMax`) | a set defender stops a straight drive | 0.35 (clamp 0.08–0.9) | 0.12 (0.04–0.6) | Pushing slipped a set defender about a third of the time, so brute force always got through. Moves beat walls now |
| `defense.slipDragS`, `slipDragMul` | — | — | 0.35 s at 0.72 × top speed | A slip goes through contact: the defender is still on the hip for a moment |
| `player.dribbleSpeedMul` | — | — | 0.94 | A dribbler is a little slower than a runner, so a beaten defender can recover |
| Charges (`defense.charge*`, `rules.charges`) | optional charges | none | first contact at a sprint (faster than your own run × 1.02) into a defender set in stance for 0.12 s, outside the 1.25 m restricted arc: 0.30 + 0.03 × (DEF − 5). A charge is a turnover, a cyan CHARGE callout and the defender hits the floor for 0.65 s. Settings → Charges turns it off | Brute force needs a cost. Bots let go of Sprint 2.4 m before a set defender (`ai.chargeSlowDist`) |
| Defender anticipation (`ai.difficulties.*.anticipation`) | — | — | Rookie 0.3, Pro 0.6, All-Star 0.8, Legend 1.0 of the reaction delay covered by reading the handler's momentum | Bots aimed at where the handler was 0.26 s ago. The read stops at the defender's chest, so a set defender never "reads" himself out of the lane |
| Recovery (`ai.recoverAhead`, `recoverHoldS`, `cutInLead`, `contactReaction`, `contactWindow`) | — | a beaten defender chased in the same lane and stood still for 0.4 s after a slip | race for a spot 0.4 m past the handler in the next lane, keep racing at least 0.4 s, cut back in only a full body (0.6 m) ahead. A defender who feels a slip or a contact blow-by reacts in 0.12 s for 0.6 s (touch is quicker than sight) | Defenders ended 3.0 m behind at the gather; now 1–2 m and alongside |
| Drop coverage and rim recovery (`ai.cushionPerSpeed`, `cushionMax`, `rimRecoverH`, `rimRecoverDist`, `rimSpot`) | bigs contest and block at the rim | cushion 1.5 per unit of speed edge, max 0.3 m | 3.0, max 0.9 m. A beaten defender 2.00 m or taller races to a spot 0.9 m in front of the rim once the driver is inside 5 m | A slow big guarding a quick guard trailed 1–2 m behind and never blocked |
| Rim protection (`block.rim*`) | ≥ 1 block per game for bigs | blocks only when a hand overlapped a rising ball | as a layup, floater or hook leaves the hand, each leaping defender whose hand is up and within 1.1 m rolls: (0.18 + 0.06 × (DEF − 5) + 0.03 × (JMP − 5) + 1.0 × height edge in m, max 0.55) × closeness × 0.6 from behind × 0.45 for floaters, 0.6 for hooks. Dunks roll the same way at the rim × 0.6 (`rimDunkMul`) | Bots made 0 blocks in 72 rim attacks |
| `height.blockPerM` | — | 0.8 | 1.0 | A 25 cm edge adds 0.25 to the rim block roll |
| Rim jump (`ai.rimJumpDist`, `flyCloseout`) | — | jump only when the driver is already rising, within 1.6 m | jump on the gather or a driving read inside layup range, within 1.9 m. Closeouts leave the floor within 2.0 m (was 1.7) | The Pro bot's reaction delay made every rim jump late |
| `duel.momentum`, `speedBonusPer`, `reach` | — | 2.5, 0.35 per m/s, 0.10 m | 1.0, 0.15 per m/s, 0.25 m | A full-speed dunk beat every block attempt (it was always a poster). A well-timed block now wins about as often as it loses |
| `contest.heightBonus`, `heightClamp` | +0.03 contest per 10 cm | 0.25/m, ±0.15 | 0.30/m, ±0.20 | as spec |
| `block.jumperGraceS` | jumpers protected 0.08 s | 0.04 s | 0.08 s | as spec |
| Spin (`moves.spinBase`, `spinHanSlope`, `spinLeanBonus`, `spinMin`, `spinMax`) | — | a spin into a close defender was walled and the ball exposed | a spin into a defender within 0.9 m gets around him 0.45 + 0.06 × (HAN − DEF) of the time, +0.20 when he's leaning on you. The ball swings to the far side | 30 of 32 Legend turnovers against Pro came mid-spin |

Size: the post game, box-outs, 50/50 balls, small guards, shot types

| Value | Spec | Was | Now | Why |
| --- | --- | --- | --- | --- |
| Height shifts ratings | per dh: STR +0.6, DEF +0.35, FIN +0.3, JMP −0.1, HAN −0.4, SPD −0.5 | already in place (`amateur.heightFx`) | unchanged | — |
| `rebound.heightWinPerDh` | box-outs and 50/50 balls +0.04 per dh | height was a tie-break score (3.0/m): about +0.18 win chance per 10 cm | +0.04 per 10 cm on top of position, timing and Strength | as spec |
| Box-outs (`rebound.boxOutBase`, `boxOutStr`, `boxOutReach`) | — | `boxedOutBy` was read but never set | a player in stance with an opponent at his back while a shot is up seals him 0.55 + 0.04 × STR edge + 0.04 per 10 cm; a sealed player moves 40% slower | Box-outs didn't exist |
| Post game (`post.*`) | at least 3″ taller, near the block, holding Down | any size could post; Action from a post was a crossover | 7.6 cm edge within 4.6 m. Back-down; drop step (Action) 0.50 + 0.05 × STR edge + 0.08 per extra 10 cm; up-and-under (pump fake, then Action) 0.85 if he bit, 0.20 if not | as spec |
| `shot.hookBase`, `hookContestMul` | hook base 0.55, contest at 60% | 0.6, contest in full | 0.55, contest × 0.6 | as spec. Without the size edge, Shoot from the post is a turnaround jumper |
| `height.postPerM` | — | 2.0 m/s per m | 3.0 | Bigs took 6 s to back down from the arc |
| Back-down contact | — | needed 1.2 m/s of push; the protect speed and contact kept it at 0.5 | a steady lean counts | Back-downs never happened (the defender only drifted 0.2 m/s) |
| Small guards (`height.smallGuard`, `smallFirstStep`, `smallAnkle`) | below 1.88 m: +8% first step, +0.05 ankle breakers | — | as spec | — |
| `shot.fadeContestMul`, `fadeMakeMul` | contest × 0.8, make × 0.92 | 0.55, 0.88 | 0.8, 0.92 | as spec |
| Dunk styles (`shot.twoHandLift`, `tomahawkJmp`, `windmillJmp`, `windmillMaxH`, `spinDunkJmp`, `spinDunkMaxH`) | five styles gated by Hops and height | the rig picked one-hand, two-hand or tomahawk at random; 360 and windmill by the learned move | one-hand: anyone who can dunk; two-hand: 0.10 m more lift or a 2.00 m frame; tomahawk: Jump 6.5; windmill: the move + Jump 7.0, ≤ 2.12 m; 360: the move + Jump 7.0, ≤ 2.05 m. Picked in play, replayed exactly | as spec |

AI plays to its build (`node tests/stylemix.js`, 16 bot-vs-bot games per style against a neutral 1.93 m opponent, Pro brains)

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| `ai.stylePlan` + `planBoost` 1.7, `planDamp` 0.55, `planDropClock` 5 s | Post 45% post-ups · Shooter 55% jumpers, half threes · Slasher 60% drives | each 1v1 possession a bot plans a post-up, drive, three or mid-range jumper by its build; the plan's option × 1.7 and the other planned kinds × 0.55 until it runs, dropped under 5 s of shot clock. Measured: Post 51% (post scorer 44%, rim protector 57%) · Shooter 57% jumpers, 49% of them threes · Slasher 59% drives | Option weights alone moved nothing: posting on a smaller man or shooting a sharpshooter's three always won the value race |
| `ai.planMismatch` 2.0, `planMismatchMax` 0.4 | — | a size edge beyond 3″ adds post-up weight (2.0 per m, up to 0.4); being that much smaller adds drive weight | A plan must not stop a 2.12 m player from posting a 1.82 m one |
| `ai.styleMix` | — | per style, multipliers on post-up, drive, mid-range, three and dribble-move values (fadeaways and step-backs count as jumpers) | Tilts the choices inside a plan |
| `ai.postFinish` + `postMaxS` 3 → 5 s, `postWorkS` 1.2 s, `postRetryS` 3 s | — | a posting bot picks a hook, drop step or pump fake by how each works on this defender, works at least 1.2 s before finishing from hook range, and waits 3 s before posting again after a dead end | Post-ups ended before the finish; bots re-posted in a loop |
| `ai.pickupDistSoloBig` | — | non-shooters (Shooting ≤ 3.5) are met at 6.8 m instead of 8.5, in between up to 5.5 | Nobody guards a non-shooting big at the arc |
| Defender vs a back-down | — | holds ground with the body instead of stepping into the big | The defender used to walk back into the big every step |

Difficulty (`ai.careerShift`): career bots start from the Settings level and shift by level and year (high school −0.45 +0.07 a year, college −0.15 +0.05 a year, pro +0.1, playoffs +0.2) plus the OVR gap (15 OVR = a tier, capped ±0.6), clamped ±1 tier. Pro games had no shift before. Career games never use the score-based Adaptive setting (it was rubber-banding); it stays for quick games.

Street half court (`rules.checkDist` 8.2 m, `checkGap` 1.4 m, `checkBeat` 0.7 s, `midlinePad` 0.3 m; `camera.halfCourtPad` 1.0 m): one hoop; check ball at the top with the defender between the ball and the hoop; after a defensive rebound or steal the ball has to go past the arc (a shot before that is a TAKE IT BACK violation, and a CLEAR IT chip shows under the score bug); make-it-take-it toggle; win by 2; 1s and 2s or 2s and 3s; players stay on the hoop's half, a loose ball past midcourt is out; the camera stops 1 m past midcourt. Quick Play has the ruleset and its options; Settings → Career games picks full or half court for the career (career games keep 2s and 3s so career stats stay comparable).

Balance harness (`node tests/balance.js 12 21`, scripted human vs bots, all 6s at 1.93 m):

| Strategy | vs Pro (M6 → M7) | vs Legend (M6 → M7) |
| --- | --- | --- |
| Brute force: sprint + Shoot | 1.80 → 1.18 | 1.91 → 1.24 |
| Only drives (no moves) | 1.80 → 1.15 | 1.91 → 0.84 |
| Only threes (average timing) | 1.58 → 1.65 | 1.12 → 1.22 |
| Perfect-timing jumpers | 2.14 → 1.88 | 1.84 → 1.66 |
| Reads the defender | 1.83 → 1.80 | 1.67 → 1.45 |
| Button mash | 0.19 → 0.40 | 0.23 → 0.36 |

Targets: brute force vs Pro ≤ 1.30 ✓ (1.18); timing and reads beat brute force ✓ (1.88, 1.80); Legend beats Pro 75–95% ✓: 78% of 96 games (PPP 1.75 vs 1.35), and 82% and 78% in two separate 120-game runs. The harness now plays 8 Legend-vs-Pro games per cell count (at least 60) instead of 3 (at least 20): at 36 games one draw on this build read 69%.

Blocks by bigs (bot vs bot, Pro, 30 games against a 1.85 m guard): a 2.10 m rim protector 1.17 a game, a 2.08 m big 0.97 a game.

Performance (`node tests/perf.js`, pro arena, 844×390 @2x): guard level 0 median 23.1 ms (M6: 23.8 and 22.2 ms). No measurable cost.

Also in M7:
- Settings is two columns. The single column overflowed its panel once Charges and Career games were added.
- The tale of the tape says what the size edge means: a post-up needs 3″.
- How to play has the new post game and defense tips.
- Height tests (`node tests/heighttest.js`: 60 Pro-vs-Pro games, 2:00 halves, 2.12 m against 1.82 m). Built from the same ratings plus the career's height shifts, the big one won 29 of 60 (1.44 vs 1.43 PPP). With identical ratings: 25 of 60 at all 6s, and 21 of 60 with the dev menu's lockdown ratings, where Defense 9 against Handles 5 turns into 8 steals a game. The README used to say 42 of 60, from before M7.
- Dev lint (`scratchpad/swallow.js`, run by the build): it now also flags a `// comment` that hides an `if (...) x = ...` statement. It caught two of my own M7 slips: a comment that switched off the pickup line, and one that switched off the court bounds.

## M6 — effects and UI kit

New UIKIT, FX2 and key-screen sections. The UI class gains screen transitions and safe-area layout. Menu dialogs now draw over the dimmed screen below them. On a touch screen, a tap just outside a small widget still counts.

§5 effects:

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| Landing dust (`CONFIG.fx.dustPerLanding`, `dustS`, `dustAlpha`) | 8 beige puffs, α 0.6 → 0 over 0.4 s, drifting outward | as spec. Each puff starts 0.10–0.17 m across and grows ×2.4. They split left and right at 1.0–2.6 m/s with drag | The old dust was 6 white dots |
| Sweat | blue-white teardrops flung backward with gravity | as spec: a drawn teardrop pointing back along its path. It still spawns at 2 drops/s below 40% stamina (M4) | — |
| Rim clank (`sparkPerClank`, `sparkS`) | 10 orange sparks with gravity, 0.3 s | as spec, drawn as streaks along their velocity | Was 8 round sparks living 0.25–0.45 s |
| Dunk shockwave (`shockM`, `shockS`, `shockAlpha`) | ring to 1.2 m in 0.25 s, α 0.6 → 0; backboard shake, net snap, 70 ms hit-stop, 6% punch | as spec. The ring is centered on the rim. The shake, snap, hit-stop and punch already matched | The old ring grew for 0.45 s to 1.8 m. The extra dunk sparks were removed |
| Block (`impactM`, `impactS`) | 90 ms hit-stop, a white impact star at the ball, "REJECTED" | as spec: an 8-point white star, 0.55 m radius, opening over its first 35%, 0.25 s in all. REJECTED is now cyan | The old block showed a pink ring |
| Posterizer (`blurS`, `blurCopies`) | 40% slow motion for 0.35 s, a radial blur of 3 scaled translucent copies, crowd flashes | as spec: copies at ×1.025 / ×1.05 / ×1.075, α 0.22 / 0.15 / 0.10, around the rim. The poster card now waits for the slow motion to end | The card used to freeze the game at once, so the 0.35 s of slow motion ran out unseen |
| Win confetti (`confettiCount`, `confettiFall`, `confettiFlutterHz`) | 120 pieces in the winner's colors, with rotation and flutter | as spec, for whoever wins. Pieces fall at up to 1.4 m/s, sway at 1.8 Hz and tumble; each is 0.10–0.17 m | It used to fire only for a human win, in that team's colors plus gold and white |
| Callouts (`calloutPopS`) | stamped text with an ink outline and a drop shadow; pops 0 → 1.2 → 1.0 in 0.25 s, tilted ±4°; gold for makes, cyan for defense, pink for ankles | as spec. It reaches 1.2 at 60% of the pop. Rule calls (travel, fouls, halftime, final) are white | Colors used to be mixed: pink blocks, lime steals, gold ankles |

§6 UI:

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| Panels (`ART.uiPanel`, `uiPanelHi`, `uiRadius`) | navy glass rgba(10,14,40,0.85), radius 14, 2 px inner highlight at 0.08 | as spec, with a soft drop and a faint top sheen | Was rgba(8,14,48,0.78) at radius 10 with a 22% white border |
| Buttons (`uiBtnH`, `uiBtnR`) | primary: gold gradient, dark text, 52 px; secondary: navy with a cyan outline | as spec. The focused button gets a gold (primary: white) outline and a glow, and grows 2%. A pressed button shrinks to 96% for 110 ms (`uiPressMs`). New screens use 52 px primaries | Was orange primaries and blue secondaries |
| Type | display face at 900 for headers, system sans for body | as spec (`FONT_BODY`) | Body text used the condensed display face at weight 400 |
| Selects | swatches instead of words | skin, hair color and eyes show color chips; hairstyle and facial hair show painted faces. Icons paint at most 2 per frame (`ART.iconBudget`) | Painting 14 faces at once caused a hitch |
| Trading card (`ART.cardTiers`, `foilPeriod`) | portrait in the top 60%, a name band, a hexagon OVR badge top-left, height and style chips, a tier frame (bronze < 60, silver 60–74, gold 75–84, diamond 85+), foil on gold and diamond | as spec. Cards bake into an LRU of 16 (`cardCacheN`); the foil sheen is drawn live and crosses every 3.2 s | — |
| Motion (`uiTransMs`, `uiSlidePx`, `uiFlipMs`, `uiCountMs`) | slide and fade in 200 ms, flips 350 ms, count-ups 600 ms, respect Reduce Motion | as spec. Screens slide 56 design px; dialogs fade and scale up 3%. Reduce Motion switches screens instantly and shows final numbers | — |
| Menu backdrop (`uiBeamHz`) | — | an arena at night, baked once per screen size: far crowd, lights, a lit floor, a vignette. Three spotlights sweep at 0.07 Hz | Replaces six gradient beams rebuilt every frame |
| Height charts (`ART.crownStand`, `crownStance`) | — | the crown sits at 1.023 × height standing and 0.99 × in a stance (measured on the M3 body) | The old factors (1.12, 1.08) fit the pre-M3 body. Rulers read about 10% too high |
| Score bug | team-color panels with mini portraits and the score; the clock and shot clock in the center | as spec, 600 × 62 at the top center. It scales by min(1, width / 1100). The possession ball sits under the side with the ball; the shot clock turns red at 4 | — |
| Jumbotron (`ART.jumboGap`) | 6.8 m high | hangs at least 10 px below the score bug | At 6.8 m it sat behind the score bug at midcourt |
| Phones: tap targets (`tapH`, `phoneGrid`) | at least 64 px | the key screens switch to phone layouts with 64 CSS px rows: main menu, create (three tabs), genes, hub, recap, draft, retirement, pause, pregame, results, confirm. The smoke test checks these | — |
| Phones: thumb controls | — | smallest button 64 px across (it was 80), with translucent dark fills and white labels, inside the safe area. The pause button is 48 px drawn and 68 px to tap. No key hints on a touch screen | Round 3 of M5 showed the controls covering the players |

Performance (`node tests/perf.js 240`, pro arena, 844×390 @2x, software raster): guard level 0 median 23.8 ms and 22.2 ms in two runs (M5: 23.0 ms). Runs vary by ±3–4 ms, and the guard levels even swap order between runs. The new HUD costs 1.6 ms of that, measured with forced flushes: score bug 0.6–0.8 ms, thumb controls 0.6–0.9 ms.

Key screens: the title face-off (spotlight, bouncing logo), create with a turning model and swatches, the genes reveal as a doctor's chart (a growing silhouette, a ruler, a dashed ghost with a ±1″ band), the hub laid out as in §6 for high school, college and the pros, the season recap (count-ups, OVR by season, before and after heights), draft night (stage, podium, card flip), retirement (the jersey rises to the rafters, then the verdict) and the pro season review. The Art Lab has a new UI kit view.

## M5 — venues, crowd, lighting

New VENUE, CROWD and COURT sections. Career games use the venue for their level: high school games in the gym, college games in the new college arena, and every pro game in the pro arena, dressed in the home club's colors. The blacktop hosts exhibitions. The rooftop and beach stay as exhibition courts with their original backdrops, but get the new floor lighting, hoops, net, ball, shadows and reflections.

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| Heights above the crowd (`ART.squashFrom`, `ART.squash`) | jumbotron at 6.8 m, banners at 6.5 m, far layer 4–9 m, gym scoreboard at 5.2 m | heights above the top of the stands are squashed: pro above 4.2 m ×0.12, college above 3.0 m ×0.15, gym above 2.9 m ×0.5, blacktop above 2.4 m ×0.6 | The game camera shows about 8.2 m of height, and the top 0.8 m sits behind the score bug. At the spec's heights the jumbotron and banners were off screen. |
| Jumbotron size (`ART.jumboScale`) | 4.4 × 2.0 m | ×0.62 (2.7 × 1.2 m) | Keeps it under the score bug at most zoom levels. M6 revisits the score bug. |
| Fan size by layer (`ART.fanScale`) | upper tier 70% of the lower | lower tier 0.62, upper 0.43, courtside 0.85, college bowl 0.6, gym bleachers 0.62 (fan height ≈ 1 m × scale) | Farther layers draw smaller, so the stands read as distance. At full size the fans formed a wall of faces. |
| Seat spacing | 0.45 m | 0.45 m × the layer's fan scale | Seats shrink with their fans. |
| Fan poses | 5 (seated, cheer, standing, clap A, clap B) | 6: adds "oooh" (hands on heads) | The near-miss reaction needs it. |
| Crowd dimming (`ART.crowdDim`) | — | pro 0.24, college 0.2, gym 0.06 | The stands sit in shadow so the lit court stays the focus. |
| Aisles (`ART.aisleEvery`, `ART.aisleW`) | — | a stairway every 7.5 m, 1 m wide (× layer scale), in the pro and college stands | Without aisles the stands read as one texture. |
| Layers L0 and L1 | separate half-res buffers at 30 Hz | one shared half-res buffer at 30 Hz (15 Hz at guard level 1), blitted every frame with the front tier's parallax. Each sub-layer is placed at its own factor on every redraw, and the blit is clipped at the floor line | Measured (software raster, 844×390 @2x): three separate buffer blits cost about 6 ms a frame. |
| Beams, beam dust, bloom, vignette (L10) | a full-resolution overlay | painted into the shared half-res buffer, so they sit behind the players | Measured: a full-frame vignette cost 6.2 ms and bloom 3.2 ms a frame. In the buffer they cost almost nothing. |
| Floor light pools and gloss | runtime additive radials | baked into the floor texture (the pools are fixed to the court); the specular bars stay live at parallax 0.8 | Saves two large additive draws each frame. |
| Backboard | 1.80 × 1.05 m glass with a white border, an inner square and streaks | the same, seen at 3/4: the face is 0.16 m wide on screen (`ART.boardFaceM`) | The camera looks along the backboard's face. |
| Net | 12 verlet strands in a diamond pattern | as spec: back strands behind the players, front strands in front; a dunk snaps it | — |
| Ball | #E8742C, radial light, rotating seams, pebble dots | as spec, as a cached sprite in 5 size buckets with seams drawn live | — |
| College student section | 90% in the team color, bouncing in sync on runs | 90% home-colored fans at x from court center +2.5 to +11 m; they bounce together for 3 s once the home side has a 4-point run | — |
| Wave | on a 6–0 run, 8 m/s | as spec, at most once every 12 s | — |
| College pep band (`ART.brass`, `ART.sousaR`, `ART.hornLen`, `ART.glintHz`) | a band corner with brass glints | the front two rows of the corner behind the left basket, in home colors. Every third member carries a sousaphone (bell radius 0.15 × fan height), the rest raised trumpets (0.13 × fan height). Each instrument flashes a four-point glint once per 0.9 s cycle (1.1 Hz) | Round 3 showed the first version's glints as large gold blobs floating over the fans. |
| Team benches (`ART.benchStart`, `ART.benchEnd`) | — | five seated players in warm-ups on each side of the scorer's table, 3 to 5.6 m from midcourt; the home bench takes the home side. Courtside seats start past 5.6 m | Round 3 showed the first bench silhouettes drawn over courtside fans. |
| Performance guard | "measures frame intervals" | a smoothed average of real frame intervals. After 2 s above 20 ms it moves up one level; after 6 s below 17.8 ms it moves down one (`CONFIG.perf.recoverSeconds`) | The old monitor timed only JavaScript and never saw raster cost. |

Performance (`node tests/perf.js 240`, pro arena, 844×390 @2x, software raster):

- Guard level 0 (everything on): median 23.0 ms per frame (p95 33.6 ms). With 4× CPU throttle: 135.1 ms.
- Level 2 (no reflections): 18.7 ms, and 120.3 ms at 4×.
- For comparison, the M3 build was 35.7 ms and 236.2 ms, and the M0 baseline 34.1 ms and 219.9 ms. The old backdrop drew every fan at full resolution every frame.
- With real frames at 4× throttle, the guard went to level 3 by itself.

Removed as dead code: the old crowd atlas, the old 5-strand net, the old arena, gym and blacktop backdrops, and the unused `SKIN_TONES` and `HAIR_COLORS` palettes.

## M4 — rig and animation

Every clip in §3.7 is a keyframe list or a small function of the clip time (RIG section). Clips cross-fade over 80 ms, and a state machine (`rigSelect`) picks one from the game state. The rig only reads the simulation. The clips are idle, run, sprint, defensive slide, protect, box-out, crossover (and the burst after it), spin, step-back, hesitation, pump fake, shot gather, jump shot (with fadeaway), floater, post hook, layup gather, layup, five dunks (one-hand, two-hand, tomahawk, windmill, 360), rim hang, block, air, tip, steal swipe, shove, pass, lob, catch, landing, stagger, stumble, fall, and six celebrations. The Art Lab's new Clips view shows each clip as an 8-frame filmstrip.

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| Dribble height (`CONFIG.player.dribble.handHeight`) | hand pumps at 0.28–0.33 H | ball apex 0.95 m → 0.48 m | At 0.95 m the ball bounced up to the face of the big-head body. |
| Steal reach box bottom (`CONFIG.steal.boxLow`) | — | 0.3 m → 0.2 m | Lowered with the dribble so the ball is out of reach for the same share of each bounce (13.9% before, 14.3% now). Same 80 seeded bot-vs-bot games before and after: identical steals (36), turnovers (43 and 19), points (1506 and 1495) and wins. |
| Ball held after the dribble (`pickedUp`) | — | 0.5 H → 0.36 H (at the jersey number) | 0.5 H is mouth height on this body. The new height is still inside the steal box for every player height, so steals can't change. |
| Dribble hand (`ART.dribblePump`) | pumps between y 0.28 and 0.33 H | rides the top of the real bounce and pushes it down 0.05 H | This keeps the hand on the ball for every player height. |
| Resting hands | §3.7 idle: F (0.20, 0.30), B (−0.18, 0.31) | as spec (M3 used §3.1's ±0.24) | The clip table is the more specific source. |
| Flex celebration fists (`ART.flexHand`) | (±0.22, 0.75) | (±0.33, 0.78) | At the spec position both fists sit behind the 0.5 H wide head. |
| Finger wag (`ART.wagHand`) | (0.18, 0.8) | (0.32, 0.84) | At the spec position the hand sits on the cheek. |
| Tomahawk dunk | ball cocked behind the head at (−0.08, 1.05) | the ball stays on its gameplay path; the back arches −10° and snaps to +10°, with the palm over the ball | A dunk can slam as early as 0.08 s near the rim. A ball drawn behind the head would jump to the rim at the slam. |
| Post hook | "body turned sideways" | turn 0.5 rad, so the body narrows to 88% | At a larger turn the 2D body read as a sliver. |
| Spin and 360 dunk | 360° turn, facing flips halfway | the body narrows to `ART.turnMin` 0.42 when side-on and shows the other side from 90° to 270°; the head narrows only to 0.8 | A full-width flip read as a teleport; a zero-width body vanished. |
| Rim hang | pendulum ±8° at 1.4 Hz | as spec, swinging about the hands on the rim | — |
| Head bobble | spring k 120, damping 12, clamp ±0.04 H, driven by the root's acceleration | as spec; acceleration clamped to 40 m/s² (`ART.bobbleAccMax`) | Replaces `CONFIG.player.neckSpring` (k 220, damping 16). Clamping stops landings from snapping the head. |
| Run cycle | period 0.36 s at run speed | as spec; slower steps and a shorter stride at lower speed, up to a 0.72 s period (`ART.runPeriodMax`); backpedaling reverses the cycle and halves the lean | — |
| Landing squash | 0.85 y / 1.12 x for 90 ms; jump shots 0.88 / 1.1 | as spec | — |
| Faces | the §3.7 trigger table | as spec: hyped 1.5 s, shocked 1.2 s, angry 1 s (a miss with contest < 0.4, `ART.openShot`); otherwise effort in an action, tired below 30% stamina, focused on defense, else neutral | Starting a dunk used to show a hyped face. It now shows effort until the slam. |
| Sweat | 2 drops/s below 40% stamina | as spec | Replaces random sweat on dribble moves. |
| Motion trails | 3 ghosts, α 0.25 / 0.15 / 0.08, team color | as spec, sampled every 35 ms (`ART.trailStep`) on dunks, spins and crossovers | — |
| Random picks (celebration, basic dunk style) | "choose randomly" | seeded from the player's name and stats, never from the match RNG | Gameplay can't change, and a replay of the play picks the same one. |
| Replays | — | the recorder stores the state data the rig reads (18 floats per player, up from 14); ghosts animate on the recorded clock | Replay poses used to step at 30 Hz (the state time wasn't interpolated), and ghosts had no shot data, so a replayed jump shot couldn't show its release. |
| Frame delta | — | clamped at 0 | A clock that stepped backward (seen in the test harness) ran the FX backward and made the renderer throw on a negative ring size. The ring size is clamped too. |

Known limits: during a pump fake and a pass wind-up the ball passes in front of the face. Those held-ball heights also decide whether the ball can be stolen, so they stay as they are.

## M3 — body and hands

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| Sock top (`ART.sockTop`) | 0.07 H | 0.095 H | The sneaker is 0.07 H tall, so a sock ending at 0.07 H sits inside the shoe collar and never shows. At 0.095 H the band and its two stripes show above the shoe. |
| Palm, thumb, wristband and shadow sizes | palm 0.045 × 0.042 H, thumb 0.02 × 0.013 H, wristband 0.03 × 0.02 H, shadow 0.45 × 0.08 H | the same numbers used as half-sizes (radii), so the palm is 0.09 × 0.084 H across | §3.1 gives the hand as 0.085 H across, which only matches the palm numbers read as radii. The thumb, wristband and shadow use the same reading so they stay in proportion. |
| Resting hands (`ART.handRest`) | §3.1: (±0.24, 0.30) H; §3.7 idle clip: (0.20, 0.30) and (−0.18, 0.31) | (±0.24, 0.30) H for now | §3.1 is the proportions sheet. M4's clip table takes over the idle pose. |
| Jersey number color (`ART.numberContrast`) | trim or white, with an ink stroke; flipped on light jerseys | trim only when it is light and its luminance differs from the jersey's by at least 0.3; otherwise white. On light jerseys: ink, or a dark trim, with a white stroke | A dark trim on a mid-tone jersey (the teal kit) made the number unreadable. |
| Legs | drawn after the shorts | clipped at the shorts hem | In a wide stance the top corner of the front leg poked over the hem. |
| Sleeve cosmetic | "sleeve" | a compression leg sleeve on the front leg; only 0.016 H of sock shows under it (`ART.sleeveSock`) | There are no arms, so an arm sleeve can't show. |
| Thumbs | a thumb ellipse with an ink outline | outlined only on its outer edge; on the fist, only the lower edge shows as a crease | A fully outlined thumb looked like a separate blob stuck to the hand, and the fist read as a ring. |
| Hands holding the ball | "at the true gameplay positions" | set shot: shooting hand under the ball, guide hand beside it. Gather, free throw and pump fake: one hand on each side. Dunk: palm over the top. Layup: under the ball. Contest: both hands up at full reach. Celebration: both fists beside the head. | The ball is drawn over the hands (spec draw order), so a hand placed at the ball's center was hidden. |
| Floor shadow | scale 1 − y/3, fade 1 − y/2.5 | the same, but never below 0.35 scale and 0.2 fade | A player at the top of a dunk still casts a faint shadow, so you can read how high they are. |
| Backlight glow | arenas only | the Arena Finals court, or any court flagged `arena` | M5 builds the full venue set. |
| New constants | — | `ART.bodyLine` 0.006 H body outline, never under 1 px (`ART.minBodyLinePx`); `ART.farDim` 0.12 (far hand and shoe); `ART.pointLen` 0.05 H (the point pose) | — |

Performance: `node tests/perf.js` at 844×390 @2x shows a median of 35.7 ms per frame (95th percentile 50.0 ms). At 4× CPU throttle the median is 236.2 ms. The M0 baseline was 34.1 ms and 219.9 ms. The new body adds a few gradients per player. M5 and M9 handle raster cost (half-resolution backgrounds and a perf guard that sees raster time).

## M2 — hair and facial hair

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| Buzz scalp alpha | 0.85 | 0.72 | At 0.85 the buzz looked like the taper fade. Letting skin show through keeps the two apart. |
| Afro edge | 22 bumps, r 0.07 | 26 bumps, r 0.05–0.09, jittered in angle and radius | Even bumps made a gear or sprocket outline. |
| Curly top | 26 curls | 38 curls on a base mass; the ink pass traces only the outer silhouette | With 26 separately outlined curls it read as a bunch of grapes. |
| Twists | 16 tubes, 0.14–0.20 long | 2 rows of 8, 0.13–0.18 long, 0.085 wide tapering | Thin tubes read as spikes at game size. |
| High top | a rounded box | the same box with slightly curved sides, a soft bottom that grows out of the faded sides, and irregular rows of vertical strands | The straight box read as a hat. |
| Box braids ponytail tie | optional | left out | The braids hang on chains, and a tie didn't read at game size. |
| Goatee | mustache + chin ellipse 0.09 × 0.07 | mustache + a textured tuft following the chin, joined at the mouth corners | The ellipse looked like a ball stuck to the chin. |
| Sheen on smooth hair | "highlights" | a two-pass soft arc of light (taper, side part, long, bun, high top); cool-tinted on black hair | Black hair lit with `shade(+0.30)` stays nearly black, so the sheen mixes in the cool fill. |
| Hanging strands (new) | "4-point verlet chains" | `ART.hairGravity` 9, `hairSpring` 30/s², `hairDamp` 0.97, `hairDrag` 0.6, `hairMaxAcc` 14 m/s², on the match clock | A soft spring toward the rest shape stops flailing. Air drag makes strands trail when running. Clipping acceleration stops collisions from flinging hair. |

## M1 — painted faces

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| Key light alpha (`ART.keyLight`) | 0.9 | 0.7 (0.95 on the six deepest tones, `ART.keyLightDark`) | At 0.9 the forehead and upper cheek washed out to flat cream on light skin, which is the "flat fill" the spec forbids. The deepest tones get more key light so their features still read at phone size. |
| Lip tint mix (`ART.lipMix`) | 0.32 | 0.4 | Lips disappeared into light skin at 0.32. |
| Head outline (`ART.outline`) | 0.022 | 0.019, ×1.6 on faces cached at ≤ 128 px (`ART.smallOutlineMul`) | Heavy enough at 250 px without looking inked; thicker on the small caches so heads still separate from the background at 40 px. |
| Jaw weight stroke alpha | 0.5 | 0.35 | The bottom of the head looked heavier than the rest of the outline. |
| Silhouette: chin front / chin bottom / jaw back | (0.16, 0.53) / (0.03, 0.57) / (−0.30 − 0.08·jaw, 0.38) | (0.19, 0.535) / (0.04, 0.585) / (−0.28 − 0.08·jaw, 0.44) | With the spec points, the spline ran one long diagonal from the jaw back to a pointed chin, so every head came out a shield or V shape. The jaw angle now sits lower and the chin is broader. |
| Extra shading layers | — | under-cheekbone shadow, facing-temple shadow, soft shadow under the hairline, back-cheek warmth, cool bounce `#6F86C9` under the jaw | Gives the painted planes the spec asks for. The cool bounce is the art direction's "cool fill from the crowd side". |
| Nose | tip ellipse, bridge stroke, edge line (0.30, 0.10)→(0.34, 0.22)→(0.29, 0.26) | all soft shapes: a soft bridge shadow, a lit tip (no hard edge), a specular dot, a short edge stroke and a wing crease | The hard tip ellipse and long edge line read as a hook or a ball stuck on the cheek. |
| Hyped mouth | edges "through" (0, 0.01) and (0, 0.17) | quadratic control points solved so each edge really passes through those midpoints | Quadratic curves only pass through their end points. |
| Tired mouth width | 0.08 | 0.14 | At 0.08 it read as a dot at every size. |
| Effort mouth | rounded rectangle | a rounded yell shape, wider at the top | The rectangle looked like a mail slot. |
| Angry mouth | rectangle of teeth | a curved clench with lips pulled back | The rectangle looked like a vent grille. |
| Undertone | "warm and cool variants" (no number) | each face gets `tone` −1…1 from its seed; the palette shifts up to 10% (`ART.undertone`) toward warm `#E09A62` or cool `#8C86A8` | Gives the requested warm and cool variants of all 12 tones without a second palette. |
| Face cache key | includes facing | facing −1 is the facing +1 painting mirrored at blit time | The spec says to paint mirrored, so both facings are identical flipped. This halves the cache. |
| Face cache size | 2× on-screen head px, clamped 96–320 | smallest bucket ≥ 2 × the head's on-screen width in CSS pixels | Covers 2× DPR screens with no extra upscaling. |
| Old looks | — | converted by `normLook` (skin 8→12, hair 10→14, hair colors, beard→facialHair, eyes→iris); the face is seeded from the owner's name, and saves migrate to schema v5 | Old saves and rosters keep a stable, unique face. |
| Facial hair by age | "becomes possible with age" | none before 16, stubble only at 16–17, any style from 18 | — |

## M0 — audit and setup

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| `CONFIG.camera.playerKeepM` (new) | — | 0.9 m | The camera spring could lag a sprinting player out of the frame (the new smoke test caught a 47 px overshoot). After the spring, the camera is now clamped so your player's center stays at least this far inside the edge. |
| `CONFIG.harness.*` (new) | — | see CONFIG | The scripted human for the balance harness: 0.18 s reaction, release-timing spread per strategy (12 ms for the "perfect timing" script, 50 ms for average, 90 ms for mashing), 45% bite on a gather, and 25% swipe chance per opening. |

## Earlier (the merged 1v1 career)

| Value | Spec | Now | Why |
| --- | --- | --- | --- |
| `CONFIG.block.jumperGraceS` (jump shots protected after release) | 0.08 s | 0.04 s | This engine also rolls a block chance on every contested shot. With both at full strength, a 2.12 m player lost to a 1.82 m player with identical ratings (16–24 in 40 games), so height stopped mattering. At 0.04 s it is 42–18 in 60 games, and jumpers are still rarely blocked. |
| `CONFIG.amateur.draft.pickRef` / `pickPer` / `noise` | 74 / 1.9 / (none) | 90 / 2.6 / 5 | With the spec's formula and the spec's development curve, draft scores ranged about 90–115, so 25% of simulated careers went #1 and nobody went undrafted. Now in 40 simulated careers: 5 #1 picks, median #32, 4 undrafted. |
| `CONFIG.amateur.draft.aiResume` | — | 14 | Generated prospects have no college résumé (program tier, titles, MVPs, PPG), so without this stand-in they all went undrafted next to the player. |
| `CONFIG.career.proMean` (generated veterans) | 76 | 78 | Veterans age and decline, and the league refills with rookies, so the league's average sank to about 72 and the player won 1.9 pro titles per career. At 78 the league stays about 74–75 and it is 1.27 titles per career. |
| `CONFIG.career.prospectMean` / `aiGrowth` / `aiGrowthAge` / `aiRoom` | — | 69 / 0.45 / 27 / by age | The spec doesn't say how AI players develop. These keep the league's strength steady across a 20-season career instead of letting it drift down. |
| League size, playoffs | 12 players, 11 games, top 4 | same | — |

## Known gaps against the spec's career targets (40 simulated careers, `lifesim.js 40 11`)

- Median OVR at 17 / 21 / 25: 56 / 68 / 76 (target 55–60 / 66–70 / 74–78). Met.
- Peak: median 78, range 70–89 (target about 76–80, declining after 30). Met.
- Draft picks spread out. Met.
- Pro titles: 1.27 per career (target about 1). Close. (M8: 1.01 over 3 × 200 careers; M9 check: 0.95.)
- Hall of Fame: 43% (target 10–20%). Too high: players who stay near the top win several MVPs, and an MVP is worth as much as a title in the legacy formula. To fix in the balance milestone. (Fixed in M8: 16–20% over 3 × 200 careers; M9 check with a new seed: 13%.)
- Stuck states: 0.
