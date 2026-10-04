# Changes to the spec's starting numbers

The design spec gives starting values and asks for every change to be logged here with the reason. New constants added
without a spec value are listed per milestone too.

## Hoop Heads 2.1 (W1–W10): the report

The request "Hoop Heads 2.1: playtest fixes, real recruiting, a deeper PBL, and an actual story", in ten milestones,
W1–W10, a commit each. Its rules held throughout: one `index.html`, renderers never throw, old saves migrate (every
fixture from the first 1v1 career on still loads and plays on; none is wiped), the career is 1v1 only, the league is
the invented PBL with invented franchises and no draft (teams make offers), and the story stays PG. Each milestone ran
quick checks; the full suite ran once, at W10, on one snapshot of the 2.1 build, and everything the text fixes after it
can touch ran again on the final build (marked "final"). The version is 2.1 (the title screen and the credits), and
What's new in 2.1 shows once after the update.

| The request | Milestone | What changed |
| --- | --- | --- |
| §1.8–12: the playtest's fixes and the game length | W1 | A running clock (stops only in the last 10 s and overtime; the per-game scale ×0.57 with it), sim buttons that say what's waiting (or open it), one All-Star 3-point attempt, a record once (a toast on the hub, never over another screen), the Road banner, matchup names that fit (two lines, then shorter), facilities that pay XP at every star, skills capped at 95 for everyone. |
| §1.1–1.5, §1.7: the playtest's improvements | W2 | Teams come to you (free agency's three offers include the best franchise your value reaches, and it's the default; in the season, 3+ over your bar brings a better franchise's trade offer), effort matters, simmed points within 10% of played ones at every level, six big buys priced for a pro, Study in the weekly plan with a hub warning under 2.3 and a C+ floor, leaving college with the agent's advice and the projected offers. |
| §2.1: every college, browsable | W3 | 64 programs in eight conferences of eight (the national tournament's 64), each with a place, colors, a pixel crest, an arena, a tier and prestige, a coach card (style, tenure, hot seat), a GPA line and majors, facilities, an NIL market, distance, depth at your position and a history; the College Browser (filters, sorting, search) and a program's page with Your chances. |
| §2.2–2.7: the recruiting game | W4 | Interest 0–100 from eight parts (it drifts without contact), stages, spots that run out to named recruits (your rival among them), warnings and pulls, conditional elite academic offers and the College test, three actions a month, five official visits as scenes, a verbal commitment, the coaching carousel (15%), flips, Signing Day's hats, walk-ons and the prep year. |
| §3.1–3.2: the PBL's structure | W5 | Sixteen franchises in two conferences of eight, with owners, GMs, coach systems (and your fit), a payroll under a soft cap and a tax line, rosters of five, chemistry and team strength; a fifteen-week calendar (rivalry week, the All-Star break, the deadline, the national TV game); conference playoffs and a best-of-5 Finals; the award races all season. |
| §3.3–3.7: the offseason and league life | W6 | The offseason in seven screens (Awards Night, aging, retirements, a free agency week by day, the trade window, training camp, the power rankings); contracts with options, a no-trade clause and incentives; a league that moves without you (signings, trades, cuts, retirements, rookies with your old teammates among them), title windows, the GOAT ladder and the records, PBL Tonight, the value meter, owners' beats; retuned to §3.7. |
| §4.1, §4.3 (and §1.6): the story engine | W7 | Twelve chapters (a title card, an opening, 3–6 scenes, one big decision shown as "This will be remembered" and kept as a flag, a closing scene, a version for every path), the cast with portraits and meters (a younger sibling, Coach Adeyinka, the best friend), five new cutscene backgrounds (twelve in all), 3–5 scenes a season and two story screens in a row at most, "Previously on Hoop Heads", the Story screen as chapters. |
| §4.2: chapters 1–6 | W8 | Freshman tryouts, Varsity, the Spotlight, Signing Day, the Freshman Wall and March, each with its versions (JV or varsity, letters or none yet, kept, changed, a prep year, a walk-on, the pros); the old arcs they tell (Family Bills, the Best Friend's choice, the rival's first handshake) step aside. |
| §4.2–4.4: chapters 7–12 and the endings | W9 | The Decision (who speaks for you: the honest agent, the big agency or your best friend), Rookie, Prime (the sibling's night or the sponsor's; the big agency's scandal), the Ring Chase, Finals (the rematch) or the One That Got Away, Legacy; six endings, each a cutscene with the sibling's last line; no scene twice in a career. |
| §5.10: the release | W10 | The full suite once with every target table (below), version 2.1, What's new in 2.1, the README for 2.1, the republish. |

### The tables (§5.10: every target table printed)

**§1.1, §1.2, §1.4: teams come to you, effort matters, money** (`tests/effort.js`, the career simulator, 200 careers a
policy, seed 1). The playtest's two careers had a legacy of 31 (try hard) and 29 (lazy).

| Policy | Legacy (median) | A 5★ team | A 3★ team | Titles | Hall of Fame | OVR at 22 | Peak | Unspent at retirement |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Plays well + good choices | 83.5 (73) | 47% | 100% | 1.00 | 34% | 70 | 75 | 9% |
| Sims everything (trash talk, rest, summer jobs) | 38.8 (36) | 10% | 97% | 0.21 | 1% | 65 | 70 | 99% |
| Plays well, never opens a menu | 71.5 (65) | 36% | 100% | 0.95 | 21% | 69 | 75 | 100% |
| Typical, a smart spender | 45.6 (42) | 13% | 100% | 0.31 | 1% | 65 | 71 | 12% |

| Target | Measured |
| --- | --- |
| §1.2: legacy +40% or more for playing well | ✓ +115% |
| §1.2: a clearly higher 5★ rate and more titles | ✓ 47% against 10%; 1.00 titles against 0.21 |
| §1.1: plays well and never opens a menu: a 3★ team in 60%+ of careers | ✓ 100% (a 5★ team 36%) |
| §1.4: a smart spender's unspent cash at retirement under 30% of earnings | ✓ 12% (the playtest: $98M–$305M unused); 400 typical careers 12%, 400 great 8% |
| No stuck careers, no errors | ✓ 0 of 800 |

**§1.3: sim/play parity** (`tests/parity.js`: 12 careers, seed 7; your points a game, played by the engine with the AI
at your controls, against the same matchups simmed; the playtest had 16 simmed against 12.7 played):

| Level | Games | Played | Simmed | Simmed / played (0.90–1.10) |
| --- | --- | --- | --- | --- |
| High school | 240 | 6.21 | 6.64 | ✓ 1.070 |
| College | 227 | 6.85 | 7.14 | ✓ 1.041 |
| The pros | 480 | 7.49 | 7.55 | ✓ 1.007 |

**§1.5: GPA** (`tests/improve21.js`, 13 of 13): Study is the fourth plan in high school and college (+0.3) and not in
the pros ✓; the hub warns under 2.3 (orange STUDY; red under 2.0) ✓; a career that never studies ends at a median GPA
of 2.20 at the draft (24 careers, all in 2.0–2.5; the lowest in high school 2.17; the playtest: 0.8) ✓; the probation
story's study sprint takes 1.40 to 1.90 (+0.50; at least +0.4) and it holds through the next report card ✓.

**§1.6 and §4.3: story scenes a season** (the career simulator, 160 careers, seed 7; the default answers and random
ones): 3–5 in 98.5% and 99.1% of high school seasons, 99.0% and 99.7% of college ones, 99.5% and 99.6% of pro ones;
never under 3. A season over 5 (6 scenes, once 7; 24 and 15 of about 3,200 seasons) is one where scenes that are
always told (an injury, an official visit's three, a chapter's decision) came on top of a full season. The playtest
had about 10 scenes over eight amateur seasons.

**§1.8–12: the game length and the fixes** (`tests/playtest3.js`, 11 of 11, final): a one-minute career game takes a
median 72.5 s of real time (eight bot games, 69–91 s; target 70–80 s; the playtest: about 2 minutes) ✓; the clock runs
through a made basket and an inbound and stops on dead balls only in the last 10 s and in overtime ✓. The fixes (§1.9–12)
pass one step each: the sims grey out with a choice waiting (never "0 weeks simmed"), one All-Star 3-point attempt, a
record once as a hub toast, the Road banner's rows apart on a desktop and a phone, matchup names that shrink, wrap or
shorten instead of a cut, facilities at every star (+3% to +15%), skills stopping at 95 for the league too.

**§2.7: recruiting** (`careersim.js 300 <seed> --hsOnly --spread=12`, seeds 1–3, 900 careers; offers received by
Signing Day, pulled ones included, by the stars at signing; "no offer" is no live offer on Signing Day):

| Stars | Offers (target) | No scholarship offer (target) | Careers |
| --- | --- | --- | --- |
| 5★ | ✓ 16.5 (10–20) | ✓ 0% (0%) | 176 |
| 4★ | ✓ 5.6 (5–9) | two careers, 1.0% (0%) | 197 |
| 3★ | ✓ 2.8 (2–4) | ✓ 7.5% (about 8%) | 253 |
| 2★ | ✓ 1.06 (1–2) | 37% (about 30%) | 239 |
| 1★ | ✓ 0.61 (0–1) | ✓ 60% (about 60%) | 35 |

By seed: 5★ 16.7 / 17.3 / 15.6 offers; 4★ 5.7 / 6.0 / 5.1; 3★ 2.7 / 2.9 / 2.8; 2★ 1.2 / 1.0 / 1.0; 1★ 0.6 / 0.7 /
0.4. A 5★ loses the #1 school in 18.8% of careers (33 of 176; 21 / 15 / 19% by seed; target 15–25%) ✓. An elite
academic offer is never final below 3.3 ✓ (`tests/recruit21.js`: the condition at 3.1 pulls the offer at the senior
finals, 3.4 meets it; the simulator's careers: none final below 3.3).

**§3.7: the PBL** (`tests/difficulty.js`, the plays-well policy, 600 careers over seeds 1–3; `tests/league30.js`, five
leagues of thirty seasons):

| Target | Measured |
| --- | --- |
| Plays well: a 3★ team in 60%+ of careers | ✓ 100% (by 24: 91%) |
| Plays well: a 5★ team in 35–55% | ✓ 49.2% (47.5 / 50.5 / 49.5% by seed) |
| Plays well: 1–2 titles a career | ✓ 1.08 (0.99 / 1.00 / 1.26 by seed) |
| AI teams make 8–15 trades a season | ✓ 10.9 a season; 9–13 in every one of the 150 seasons |
| A new champion in 60%+ of seasons | ✓ 89% (86 / 93 / 79 / 97 / 90% by league; the most titles by one franchise 3–7) |
| Every franchise a title within 30 seasons | ✓ in all five leagues (16 of 16 each) |

**§4.4: the story** (the career simulator, 160 careers, seed 7, with the default answers and with random ones, picked
through the game's own RNG; `tests/story21.js`, 25 of 25):

| Test | Target | Measured |
| --- | --- | --- |
| Chapters reached per career | all 12, with path variants | ✓ every chapter reached and closed in 100% of careers, both policies; the variants (random answers) below |
| Scenes per season | 3–5 in every phase | ✓ high school 99.1%, college 99.7%, the pros 99.6% (default answers 98.5, 99.0, 99.5%) |
| Each ending in 5%+ of careers | six endings | ✓ the Coach 29%, the Hometown Hero 18%, Family First 14%, the Fallen Star 14%, the Owner 14%, the Mercenary Champion 10% (random answers; the default answers stay home: Family First 64%, the Hometown Hero 36%) |
| No scene repeats within a career | none | ✓ 0 of 320 careers repeat a scene word for word |
| Flags survive a save and a reload | yes | ✓ the chapter flags, their picks, the recap and the cast survive a save, a reload and the handoff to the pros (story21, two steps) |
| The best friend's 4 paths, 20%+ each | teammate, agent, rival's agent, away | ✓ 28%, 27%, 23%, 23% |
| The sibling's arc, 20%+ | a prospect, or they need you | ✓ they need you 53%, a prospect 47% |

The chapters with random answers (the scenes a chapter, its versions · its big decision):

| Chapter | Scenes | Versions | The big decision |
| --- | --- | --- | --- |
| 1 The Kid from (your school) | 4.0 | JV 76%, varsity 24% | stay late 52%, go home 48% |
| 2 Varsity | 3.5 | the first varsity season 56%, a second 24%, JV again 20% | shake hands 53%, talk trash 47% |
| 3 The Spotlight | 4.0 | quiet 56%, the letters 44% | the weekend job 51%, your friend's family 49% |
| 4 Signing Day | 4.0 | kept 64%, changed 27%, a prep year 9% | the dream 38%, your friend 34%, home 28% |
| 5 Freshman Wall | 3.1 | college 96%, a walk-on 4% | grind 50%, home 50% |
| 6 March | 3.9 | college 91%, the pros 9% | sit 55%, play through it 45% |
| 7 The Decision | 3.5 | declare 91%, the pros 9% | the big agency 40%, the honest agent 33%, your friend 27% |
| 8 Rookie | 3.0 | the bench 69%, a starter 21%, later 9% | learn 58%, demand minutes 43% |
| 9 Prime | 3.4 | a star 88%, the grind 12% | the sponsor 53%, your sibling 47% |
| 10 The Ring Chase | 3.8 | a contender calls 96%, the top team 4% | leave 53%, stay 47% |
| 11 Finals | 3.9 | the One That Got Away 63%, the Finals 36%, the rematch 1% | silence 36%, a call home 33%, a speech 31% |
| 12 Legacy | 4.0 | the last day 100% | a kid from the academy 33%, your sibling 24%, the owner 22%, the coach 22% |

**Part 2 §1.1: the difficulty table** (`tests/difficulty.js`: 600 careers a policy over seeds 1–3, 0 stuck; the great
policy's 5★, titles and Hall of Fame bands are 2.1 §3.7's):

| Milestone | Typical: target | Typical: measured | Great: target | Great: measured |
| --- | --- | --- | --- | --- |
| Makes varsity | sophomore or junior (freshman 20–25%) | ✓ freshman 22%, median year 2 | freshman | ✓ freshman 56% |
| Recruit stars at graduation | 2–3★ | ✓ 2–3★ 73%, median 3★ | 4–5★ | ✓ 4–5★ 73%, median 4★ |
| Starts in college | year 2–3 | ✓ year 2–3 69%, median year 2 | year 1 | ✓ year 1 89% |
| First pro offer | 1–2★ or undrafted | ✓ 1–2★ 73%, median 2★ | 3★ | ✓ median 3★ |
| Reaches a 3★ team | by 26–28 in 50% | ✗ by 28 91%, median age 25 | by 24 | ✓ by 24 91% |
| Reaches a 5★ team | 15–25% | ✓ 16.7% | 35–55% | ✓ 49.2% |
| Championships per career | 0.2–0.4 | ✓ 0.38 | 1–2 | ✓ 1.08 |
| Hall of Fame | 3–8% | ✗ 2.2% | about 35% (30–40%) | ✓ 35.2% |

By seed (1 | 2 | 3): a 5★ team, typical 15.5 | 19.5 | 15.0%, great 47.5 | 50.5 | 49.5%; titles, typical 0.42 | 0.32 |
0.40, great 0.99 | 1.00 | 1.26; the Hall of Fame, typical 3.0 | 1.0 | 2.5%, great 34.5 | 31.5 | 39.5%. The Hall of Fame
at other lines (the line is 92): 80 typical 4.2%, great 48.3%; 84 3.2%, 42.7%; 88 2.7%, 37.3%; 96 1.7%, 31.3%. The two
typical rows outside their bands are the two W6 left there (see the limits below).

**2.0 §7's tests, on the 2.1 build:**

| Test | Result |
| --- | --- |
| Steal consistency (`tests/steals.js`) | ✓ 2 × 500 scripted steals, 0 mismatches. Defense 6: clean 64.6% (63%), STEAL 428, POKED 72; Defense 9: clean 71.6% (72%) |
| Trait rarity (`tests/rarity.js`) | ✓ 1,000 generated players: Legendary 3.4% (3–5%); 20,000: 54.8 / 27.9 / 13.3 / 4.02% against 55 / 28 / 13 / 4 |
| Trait power by rarity (`tests/traitbalance.js`, 400 careers a trait on 3 seeds, the great policy) | ✗ rarer is still stronger, but under V3's bands: Common +1% (0…8% ✓), Uncommon +6% (6…15%, just under), Rare +10% (15…30%), Legendary +30% (35…60%); 2.0 (V15): +5, +12, +24 and +51%. Each trait's worth in a simulated game is unchanged (`tests/traits.js` prints the same OVR points as V15); see the limits below |
| Box-score invariants (`tests/boxscore.js`) | ✓ 1,000 simmed amateur games and 1,000 simmed pro games add up, 0 failures |
| Staff balance (`tests/staffbalance.js`, 400 careers × 3 seeds, both policies) | the tables below: every salaried role alone above none ✓; the agent earns you more ✓; smart spending +9.4% (+10–20%) ✗, just under |
| XP stays hard | the curve is unchanged (20 × 1.11^(rating − 40); 80 → 90 costs 8.1× the 60 → 70 stretch); 400 typical careers: OVR 56 / 64 / 68 at 17 / 21 / 25, a peak of 71; 400 great: 58 / 68 / 73, a peak of 76 |

**Staff** (`tests/staffbalance.js`, 400 careers × 3 seeds a row, the same careers in every row). The great policy
(judged):

| Staff | Legacy | vs none | Titles | Hall of Fame | Peak | A 5★ team | Injuries | Earned | On staff | Net worth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| None (and no spending) | 77.0 | | 1.02 | 27% | 75.3 | 44% | 3.08 | $312.1M | $0 | $306.5M |
| Smart (the best agent, then the salaried roles within half the salary) | 84.3 | +9.4% | 1.10 | 35% | 75.8 | 51% | 2.48 | $357.0M | $185.3M | $94.6M |
| The agent alone | 80.4 | +4.3% | 0.98 | 28% | 75.4 | 46% | 3.09 | $353.7M | $0 | $282.5M |
| The skills coach alone | 80.7 | +4.7% | 1.03 | 31% | 75.6 | 47% | 3.11 | $342.1M | $91.9M | $159.3M |
| The strength trainer alone | 80.2 | +4.1% | 1.01 | 30% | 75.5 | 47% | 2.49 | $337.9M | $91.1M | $157.0M |
| The physio alone | 79.9 | +3.7% | 1.00 | 29% | 75.4 | 46% | 2.21 | $339.5M | $95.3M | $156.3M |
| The nutritionist alone | 88.4 | +14.7% | 1.17 | 39% | 75.6 | 51% | 2.91 | $359.6M | $97.8M | $166.5M |
| The mental coach alone | 81.7 | +6.1% | 1.10 | 32% | 75.4 | 47% | 3.12 | $339.3M | $91.2M | $158.1M |

Targets: smart spending +10–20% legacy over none → +9.4% ✗ (2.0: +12.4%; the same squeeze as the traits', below);
every salaried role alone above none ✓ (+3.7% to +14.7%); the agent (a cut, no salary) earns you more ✓ (+$41.7M). As
run, the test also asked the agent's careers for a higher net worth than careers that buy nothing, and failed it
($282.5M against $306.5M): the role-alone rows spend smartly on everything else, and since 2.1 §1.4 a smart spender
buys the big buys on purpose. W10 changed the check to earnings, its label's claim (the net worth stays in the table).
Each role pays where its card says: the physio cuts injuries 3.08 → 2.21, the strength trainer to 2.49, the agent's
deals add $41.7M, and the nutritionist moves legacy most.

The typical policy (reported; the band is judged on the great one, as in V10): no staff 44.2 legacy, 0.30 titles, 1%
in the Hall of Fame; smart spending 46.2 (+4.5%, above none ✓), 0.36 titles, 16% reaching a 5★ team (12% without); each
role alone +1.6% (the physio) to +5.4% (the nutritionist), all above none ✓; the agent earns +$27.3M ✓ (as run, its
net-worth half failed the same way: $141.7M against $166.6M); injuries 2.44 → 1.90 with the physio.

**Perf** (`tests/perf4x.js`, the device clock at 4×: a live pro-arena 1v1, 5 forced dunks and 3 forced blocks;
`tests/loadlag.js`, every screen change and game load at 4× and 1×). The final 2.1 build and V15's build (2.0 with the
loading-lag fixes), back to back on the same quiet machine (2.1 twice):

| | 2.1, phone | V15, phone | 2.1, desktop | V15, desktop |
| --- | --- | --- | --- | --- |
| Median frame (target ≤ 25 ms) | 25.6, 28.4 ms | 25.9 ms | 24.3, 24.9 ms | 26.5 ms |
| Frames over 50 ms in dunks, celebrations and blocks (target 0) | 13, 27 | 14 | 11, 19 | 29 |
| The frame guard's first shed (target ≤ 0.5 s) | 0.15, 0.17 s | 0.15 s | 0.17, 0.17 s | 0.18 s |

| The loading lag (desktop 1280×720) | 2.1 | V15 |
| --- | --- | --- |
| Steps over their bar at 4×, of about 110 (a task over 100 ms; a game's first frame over 300 ms) | 11, 7 | 7 |
| Steps over their bar at 1× (a task over 50 ms) | 0, 1 (a 59 ms task leaving the league) | 0 |
| Startup at 4×: the title (target 1.5 s) | 1.33, 1.20 s | 1.03 s |
| Startup at 4×: long tasks before the menu responds (target 1.5 s) | 1.12, 1.13 s | 0.79 s |

When V15 was committed, this test measured its build at 20.8–21.4 ms (phone) and 18.6–20.3 ms (desktop) with 2–3 slow
frames, and its loading-lag walk missed 0–2 steps; today the same build runs a quarter to a third slower and misses 7, so
the host is slower, and 2.1's frames are within V15's spread. 2.1's misses are 2–60 ms over the 100 ms bar, on
different steps from run to run. Startup is about 0.2 s slower at 4× than V15's: the file is 3.09 MB against 2.56 MB
(64 colleges, 16 franchises, the chapters). `tests/perf.js` (the frame's cost at each guard level): 3–7 ms at 1×, 29–45 ms
at 4×, where the guard engages.

### Tests on the 2.1 build (W10)

The whole suite ran once, on one snapshot of the W10 build. Its audits found text cut in What's new and in the
Codex's ending paragraph, and a W10 walk of every Codex page found one more (the Codex's Career games); each was
fixed, and everything the fixes can touch ran again (marked "final"): the overflow audit at all six sizes (after the
first two fixes; at 1280×720 and 844×390 again after the third), every Codex page at all six sizes, smoke, polish and
story 2.1. The balance tests and the career simulator don't read those texts. Four tests the snapshot's run left out
ran on the final build: playtest3 (W1's), R8's press and hype balance and the height test.

| Test | Result |
| --- | --- |
| Syntax (`tests/check-syntax.js`) | ok (final) |
| Smoke: the game through the UI at 1280×720 and 844×390 | 136 of 136 (final) |
| Modes: every mode played to its end | 13 of 13 |
| Old saves: every fixture from the first 1v1 career on, reloaded and played on | 42 of 42, never wiped |
| Dev tools | all OK (the tunnel test: 1,000 balls, none through the rim) |
| The overflow audit: 844×390 and 1280×720, both also at 1.25× text, 1920×1080, 800×1000 | about 300 screens at each size (308 on a phone): nothing flagged; the smallest glyph 1.00× the menus' pixel at every size (final; the paragraph above says which build each size ran on) |
| The HUD's text (`tests/hudaudit.js`) | 35 scenes, 0 flagged |
| Art Lab | 58 screenshots, no errors (`shots/w10/round-final`) |
| §2 gate (300 mirror games, 200 Legend-vs-Pro games) | Pro mirror 1.17 PPP (0.95–1.25 ✓), side A 50% (45–55% ✓), Legend beats Pro 81% (75–95% ✓), brute force vs Pro 0.89 (≤ 1.30 ✓), timing and reads 1.50 ✓ |
| Balance harness (Classic) | brute force vs Pro 1.06 (≤ 1.30 ✓), timing and reads 2.02, Legend beats Pro 83% (75–95% ✓) |
| The style mix | Post 51% post-ups (45%), Shooter 60% jumpers (55%) with 52% threes (half), Slasher 64% drives (60%) ✓ |
| Gameplay · 2.0's page fixes · polish | 12 of 12 · 15 of 15 · 14 of 14 (final) |
| Traits (`tests/traits.js`) | 9 of 9 (its first run 8 of 9: the banner check's window, fixed above) |
| Steals · rarity · box scores | 2 of 2 each (the tables above) |
| The climb · the flow | 9 of 9 · 12 of 12 |
| Story · story 2.1 · school · staff · shop · pro teams | 13 · 25 (final) · 8 · 11 · 10 · 14, every step passed |
| 2.1: playtest3 · improve21 · colleges · recruit21 · pbl21 · life21 | 11 (final) · 13 · 14 · 15 · 11 · 17, every step passed |
| A whole career through the screens | 930 actions: a real game in high school, college and the pros; retired after 13 pro seasons at 35 |
| The same through Jump to pro | desktop 554 actions (13 pro seasons, retired at 36), phone 556 (12, at 35): passed |
| Career simulator, 40 careers | 0 stuck; a 5★ team 15%, 0.45 titles, Hall of Fame 3%, OVR 56 / 64 / 68 at 17 / 21 / 25 (a rough read) |
| Career simulator, 400 careers a policy | typical: a 5★ team 15%, 0.38 titles, Hall of Fame 2%; great: 51%, 0.97, 34%; 0 stuck |
| Recruiting (900 careers) · the story (320) · effort · parity · league30 | the tables above: every row in its band but the §2.7 "about" rows noted |
| Difficulty (`tests/difficulty.js`) | ✗ two typical rows (above), as since W5 |
| Trait balance · staff balance | ✗ under their 2.0 bands (above and below) |
| Press balance · hype balance (R8; 200 careers a policy) | legacy and earnings within range for every answer and both hype policies; titles out (press: Confident −9.0%, No comment +11.6% against ±8%; hype: chasing it −23% against ±10%): about 0.3 titles a career over 200 careers swing ±13% by chance alone, and R10's run missed the same way |
| The height test (2.12 m against 1.82 m, 60 bot games) | the big one wins 12 of 60 (career shifts), 11 (flat), 4 (lockdown); see the limits |
| Every Codex page (`codexpages.js`, a W10 script) | about 820 pages at the six sizes, four careers: nothing cut (final) |
| Perf at 1× and 4× (`tests/perf.js`, `tests/perf4x.js`) | ✗ at 4× on this host, as V15's build is today (the perf table above); the frame guard sheds within 0.2 s ✓ |
| The loading lag (`tests/loadlag.js`) | ✗ at 4×: 11 and 7 steps of about 110 over the 100 ms bar, by 2–60 ms (V15's build beside it: 7); at 1×: 0 and 1 |

### Deviations and known limits

1. **A typical career reaches a 3★ team too soon** (median age 25; Part 2 §1.1 asks for half by 26–28) **and rarely
   makes the Hall of Fame** (2.2% against 3–8%). Both rows have been outside their bands since W5 and were left there
   in W6: 2.1's own targets come first (teams come to you, §1.1; a 3★ team for 60%+ of the plays-well careers, §3.7),
   and they lift typical careers too; with sixteen franchises titles are scarcer, and no Hall of Fame line fits both
   policies (at 84 typical 3.2% but great 42.7%; the line stays at 92).
2. **Traits and staff move legacy less than in 2.0** (`tests/traitbalance.js`, 1,200 great careers a trait):

   | Rarity | 2.0 (V15) | 2.1 | V3's band |
   | --- | --- | --- | --- |
   | Common | +5% | +1% | 0…8% |
   | Uncommon | +12% | +6% | 6…15% |
   | Rare | +24% | +10% | 15…30% |
   | Legendary | +51% | +30% | 35…60% |

   By trait: Generational +81% → +37%, Unbreakable +58% → +43%, Late Bloomer +41% → +18%, Film Junkie +36% → +18%,
   Iron Man +32% → +22%, Ice Veins +27% → +10%, Clutch Gene +12% → +4%; the no-trait median legacy 59 → 67. The
   traits do what 2.0 §2.1 says (their numbers, levels and in-game worth are unchanged); what changed is what a better
   player gets for it. 2.1's league is built for parity (§3.7: a new champion in 60%+ of seasons, every franchise a
   title within 30), so the same edge wins fewer titles: these careers won 0.81–1.32 titles a career, against 1.26–2.71
   in 2.0, and a title is 12 legacy points. Smart staff spending is squeezed the same way: +9.4% legacy over none (V10's
   band 10–20%; 2.0: +12.4%). Raising the traits past 2.0 §2.1's numbers, or weighting legacy away from titles, would
   move every balance table in this report; neither was done in the release milestone. Rarer is still stronger, in
   order, and every staff role still pays.
3. **The plays-well titles sit at the band's bottom**: 1.08 a career over 600 careers (in 1–2), but 0.99 and 1.00 on
   seeds 1 and 2, 0.97 in 400 careers on seed 1 and 1.00 in the effort table's 200.
4. **§2.7's "about" rows**: a 2★ recruit has no offer in 37% of careers (about 30%), and two 4★ careers of 197 had
   none (0%). W4 measured 35% and one career.
5. **The endings at 5%+ are measured with random answers.** The simulator's default answers (the first choice in every
   scene) stay home, so they end in Family First or the Hometown Hero; with random answers every ending is 10%+. The
   random run also leaves for a contender in chapter 10 half the time, so its 5★ rate (51%) is not the typical one.
6. **The rematch is rare** (1–2% of careers): it needs your rival's franchise across from yours in the Finals; Finals
   without your rival are 36%, and the rest is the One That Got Away.
7. **Height in bot play**: a 2.12 m bot wins 12 of 60 against a 1.82 m one built from the same ratings (the guard
   steals 5.7 times a game), and 2.0's build gave 10 of 60, so this is older than 2.1; the README had quoted M7's
   29–31 split. 2.1 doesn't touch height; the README now gives these numbers.
8. **Press and hype balance by titles**: every press answer and both hype policies stay within range on legacy and
   earnings, but titles (about 0.3 a career) swing more than the tests' ±8–10% over 200 careers; R10's run missed the
   same way.
9. **One league player per franchise**, as in 2.0: the career is 1v1, so a franchise's games are its starter's, and
   rosters, trades and signings move the five on a roster around that starter.
10. **Perf on this host**: neither the 2.1 build nor V15's meets perf4x's 4× targets or the loading-lag walk's 4× bar
    today (measured back to back; V15 met the walk's bar but for 0–2 steps when it was committed). 2.1's frames are
    within V15's spread; its startup is about 0.2 s slower at 4× (inside its 1.5 s targets).
11. **From 2.0, unchanged**: XP near the top follows Part 2's formula (8.1×, not "about 3×"); a steal's loose ball goes
   toward the stealer 63–66% of the time (2.0 §1.1's 70% is reported, not judged); perf is measured in headless
   Chromium (CPU raster) on this host, never on a real phone.

## W10 (2.1) — the release: the full suite, every target table, version 2.1

The tenth of the ten 2.1 milestones (§5.10). The report above has the tables; this is what W10 itself changed.

- **Version 2.1.** `CONFIG.version` 2.0 → 2.1 (the title screen and the credits) and `CONFIG.ui.whatsNew` 2.0 → 2.1:
  What's new in 2.1 (`179_ui_whatsnew.js`) shows once on the first main menu after the update, for a save from before
  it, and from the main menu's button: eleven items (the recruiting game, the College Browser, teams come to you,
  effort matters, the PBL, the offseason, league life, 12 chapters, your people, six endings, Previously on...); a
  desktop shows them in three columns, a phone four a page. 2.0's list is in this file (V13).
- **The README for 2.1**: what 2.1 adds, the sixteen franchises, the story in twelve chapters and its six endings.
- **Fixed after the suite's audits:** What's new's PBL line was cut at 1280×720 (both text sizes) and 1920×1080
  (shortened), and its subtitle still said "Hoop Heads 2.1 and its Part 2" (now "Recruiting, the PBL, the story"); the
  Codex's "How it ends" paragraph ran past a paragraph's six lines at 800×1000 (now two paragraphs: chapter 12 and the
  sibling's last line, then the six endings). The audits ran again after these fixes, at all six sizes.
- **Every Codex page, checked:** the audit opens the first page of most Codex topics, so a W10 script
  (`codexpages.js`, not a repo test) drew all of them, about 820 pages: every page at the six sizes with no career and
  with a high school, a college and a pro career. It found one more cut, on the no-career Codex at the desktop sizes:
  "Career games" on The season, which also still described 2.0's clocks. It now says what W1's running clock does
  (the game clock runs through dead balls until the last 10 s of a period; there and in overtime the holds stop it; the
  shot clock waits while the ball is brought up) in shorter paragraphs. The walk ran again on the final build: nothing
  cut.
- **The README's height numbers** were M7's (a 29–31 split); `tests/heighttest.js` gives the 2.12 m bot 12 of 60 games
  against the 1.82 m one (2.0's build: 10 of 60). The README now says so (see the limits).
- **Tests fixed:** `tests/traits.js`'s banner check waited 120 s for a trait banner, and W1's running clock makes
  career games longer than that; it waits up to 240 s and checks the first banner. `tests/staffbalance.js`'s agent
  check judges earnings, its label's claim (above). `tests/polish.js` names 2.1's What's new.
- **No new constants**; changed: `version` and `ui.whatsNew` (above).
- **The suite** (above): the tests that failed are the balance tests the limits explain: `tests/difficulty.js` (the
  two typical rows, as since W6), `tests/traitbalance.js` and `tests/staffbalance.js` (legacy squeezed by 2.1's parity;
  the agent check's net-worth half), `tests/pressbalance.js` and `tests/hypebalance.js` (titles' noise); and the first
  `tests/traits.js` run (the test's own timing; it passed fixed). Every other test passed. The artifact is republished
  at the same URL.

## W9 (2.1) — chapters 7–12 and the endings

The ninth of the ten 2.1 milestones (§4.2–4.4): the rest of the main story, the six endings and the story's tests.
Chapters 7–8 are `179_saga_ch7.js`, 9–10 `179_saga_ch9.js`, 11–12 `179_saga_ch11.js`, the endings `179_saga_end.js`.
`tests/story21.js` has 7 new steps (25 in all).

**Chapter 7: The Decision.** Three versions: declare (college, at the declare decision; a benched season's transfer
portal is one too), four years done (when that is its first moment), and the pros (one college year or none: a later
pro season, "your next deal"). *The phone* (the scouts' projection; two agents call: the honest one, R6's college agent,
and the big agency; your best friend has passed the agent exam); *One more year* if you stay; *Who speaks for you*, the
big decision: the honest agent (contracts +10%), the big agency (+18%: "don't ask how") or your best friend (+5%, your
friend +20); *The pen*, right after the signature (college: the combine and the offers are next). The agent you sign is
your agent in the pros (a staff agent: straight, shady or loyal). Your best friend's path (§4.1) is settled here:
signed, they are your agent; passed over for the big agency, they go to work for your rival's agent; for the honest
one, they drift away; if you followed them on Signing Day, you stay teammates. They pitch unless you're on the outs
(their meter under 10).

**Chapter 8: Rookie.** Three versions: the bench or a starter (the first pro season after college), or later (one
college year or none: two pro seasons in). *The first contract*: no draft, you chose them; the salary; the team's oldest
player, the veteran mentor (§4.1): "Rookie. You carry the bags this year."; your family ("Don't go buying us
anything"). Pay off the family's bills ($250K, confidence +1) or put it in the bank; if chapter 3 left you owing your
friend's family or Coach Adeyinka, they say so, and you can *pay everybody back*. *The end of the bench* (or *The target*), when the season has
room; *Learn or demand*, the big decision: learn from the veteran (practice XP +10% for 4 weeks, the veteran +20, the
owner −5: they help you later) or demand minutes (the owner +15 and backs you, hype +5, coach trust −3, the veteran
−10); *Rookie no more*, on the next season's first day. (The later version opens with the veteran: carry the bags or
ask for the playbook.)

**Chapter 9: Prime** (from 25; passed by from 34). Two versions: a star (fame 40+: your face on a billboard) or the
grind (a commercial for a car dealership near home). *The big deal* (a shoe company: 8% of your salary, hype +3), when
the season has room; *The same night*, the big decision: your sibling's conference final (or graduation) or the
sponsor's launch, three states apart: be there (your sibling +20, family +10; they grow into a prospect) or go to the
launch (the money, hype +5, your sibling −20; later, they need you); *The story breaks*, with the shady agent only: the
journalist's story on the agency's deals and its two sets of books: fire them and come clean (hype −10, a fine of 5% of
your salary, the journalist +10) or ride it out (hype −5, the journalist −10, family −5); *Prime time*.

**Chapter 10: The Ring Chase** (from 27; passed by from 36). Two versions: a contender calls, or yours is the team
everybody chases. *The window* (the owner, from the box); *The call*, the big decision: stay (the owner +20, hype +5,
the hometown fans) or leave for the contender (traded now if the deadline is open, else when the next season starts;
the owner −20); *The boos* (or *The night they sang*), when the season has room: your rival's reaction, respectful or
bitter (their meter, and whether you shook hands in chapter 2); *Coach Adeyinka*: coaching again (on your club's staff)
with a coach meter of 65 or more, else retiring (the gym floor gets their name).

**Chapter 11: Finals** (from 29, a window of four seasons). The first Finals in the window is the chapter's: the
rematch (your rival on the other side) or the Finals; none, and it becomes *The One That Got Away*, with its own title
card. *One more run* (your rival's comeback from a torn Achilles); *A word before the stretch* (your old veteran calls
if you learned from them in chapter 8), when the season has room; *Before Game N*, the big decision before the game
that can end it (best of five): a speech, silence, or a call home (*The long summer* when you're not there: call the
team together, shoot alone, or call home); *Champions*, *So close* or *Next year*.

**Chapter 12: Legacy** (from 33, or on the last day: the sudden version). *The body talks*; your sibling, a prospect in
the development league asking you to train them, or a call at midnight (their knee is gone, and they need you); *What
comes next*, the big decision on the last day: mentor your sibling, mentor a kid from the academy (your next career's
Legacy Start), take the coaching job, or buy into a team (with partners under $30M); the ending's cutscene closes it.
Retiring early passes the chapters still to come (one in progress is cut) and Legacy opens on the last day.

**The endings (§4.3).** The first that fits: the Mercenary Champion (you left for a contender and won a ring there), the
Fallen Star (the big agency's scandal, ridden out), the Owner, the Hometown Hero (you stayed when a contender called: one
club, a ring, or home was the kitchen table's pick), Family First (mentor your sibling) or the Coach (the coaching job,
or the academy kid). Each is chapter 12's closing cutscene (its background, mood and speaker) and ends with a line from
your sibling. A career from before the chapters (all passed by) ends one of V8's six ways, as it did.

**No scene twice (§4.4).** R9's beats that come back have versions, told in order (a registry per career, carried to
the pros): a call from home (8), the coach's office (6), a film session (6), a winning streak (6), a slump (6), the
spotlight (6), champions (8, then numbered), the title chase (6), a veteran (5), the season review (6), so close (4),
the training room (5, then numbered), one more season? (4, then counted). An exam week names the year and the class;
an official visit's Saturday night names the city and the program (a second visit to a program says so); a trait's
scene comes once a career; a club's star change twice says "again".

**Pacing (§4.3).** Chapter 7 in college tells its scenes at the decision (the offseason before the pros); chapter 8
closes on the second season's first day; R9's Signing Day and First Contract step aside in a career told in chapters
(chapter 8's first scene is the first contract; a career with one college year or none keeps R9's first contract);
the trade demand waits while chapter 8 asks the same question, and for a season with room (R7's card asks otherwise);
the summer-camp mentor's pro beats give way to chapter 8's veteran; the Finals window keeps room in a contender's
season and the playoffs; the last day is two story screens: what comes next, then the ending (the last season's
waiting side beats give way; the journalist's last column is the Fallen Star's).

**Fixed.** A meddler owner (W5's fourth kind) had no title for the owner arc's middle beat: the card failed after
counting and came back every season (a third of careers saw it more than once). The meddler has its own now (*The phone
call*: let them tell the press, or let the coach coach), and a beat without a title still tells once.

**The career simulator.** 160 careers with the default story answers: 3–5 scenes in 98.5% of high school seasons,
99.0% of college ones and 99.5% of pro ones (W8: 98.5 / 99.0 / 99.3); with `--story=random` 99.1%, 99.7% and 99.6%.
Chapters 1–12 reached and closed in every career; no scene twice, word for word, in any career (W8's runs: every career
had some, a call from home 1.5 times a career); the last day is two story screens in every career. Random answers: the
endings, the Coach 29%, the Hometown Hero 18%, Family First 14%, the Fallen Star 14%, the Owner 14%, the Mercenary
Champion 10% (each 5%+); your best friend's path, a teammate 28%, your agent 27%, your rival's agent 23%, drifted away
23% (each 20%+); your sibling's arc, they need you 53%, a prospect 47%; the agent, the big agency 40%, the honest one
33%, your friend 27%; Coach Adeyinka coaches again 58%, retires 43%; the ring chase, 85 careers left (16 won a ring
after), 75 stayed; the Finals window, the Finals 36% (the rematch 1%), the One That Got Away 63%. Versions: the
Decision in college 91%, in the pros 9%; Rookie on the bench 69%, a starter 21%, later 9%; Prime a star 88%; a
contender calls 96%. Every big decision spread (honest 33 / shady 40 / your friend 27; learn 58 / demand 43; your
sibling 47 / the sponsor 53; stay 47 / leave 53; a speech 31 / silence 36 / a call home 33; your sibling 24 / the kid 33
/ coaching 22 / a team 22). With the default answers (stay, then mentor your sibling): Family First 64%, the Hometown
Hero 36%. The random policy now picks through the game's RNG (W8's two-answer decisions read 39/61; now 45–55). No
errors.

**Config.** `CONFIG.chapters`: `agentTier` {honest 2, shady 3, friend 1}, `friendAgentAt` 10, `primeAge` 25,
`primePastAge` 34, `primeFame` 40, `sponsorShare` 0.08, `scandalFine` 0.05, `ringAge` 27, `ringPastAge` 36,
`coachBackAt` 65, `finalsAge` 29, `finalsSeasons` 4, `legacyAge` 33, `ownerMoney` 3e7; `sibGap` 6 (was 4: your
sibling is a pro prospect late in your career).

**Calls made.**
- Chapter 7 in college comes with the declare decision (the scouts when it opens, who speaks for you with your answer);
  the transfer portal's decision counts as one (it offers to declare).
- The best friend's four paths come from two choices: Signing Day (follow them: teammates) and chapter 7 (sign them:
  your agent; the big agency: your rival's agent; the honest one: they drift away).
- Prime, the Ring Chase, Finals and Legacy open by age (25, 27, 29, 33) at a season's start; Legacy also on the last
  day. Finals is a window of four seasons (a Finals run is rare in any one season).
- The endings are checked in an order: the career's own story first (the ring chased, the scandal ridden out, the team
  bought, the team you stayed with), then chapter 12's choice.
- No draft: the signing is chapter 7's ("then three franchises make offers, and you choose") and chapter 8's ("No draft:
  you chose them").
- A shady agent's scandal is chapter 9's (V10's staff scandal skips that agent); the story stays PG (deals and two sets
  of books; your sibling's knee; Coach Adeyinka's heart scare ends in recovery).
- The random story policy of the career simulator now picks through the game's RNG: the hash's lowest bit was a poor
  coin for two answers (W8's two-answer decisions read 39/61).

**Tests.** `tests/story21.js` (25 steps, 7 new): chapters 7–12 written (3–6 scenes, a choice on each, one big decision,
a closing scene) and the six endings; the Decision then Rookie on a college path (the scenes at the declare, the big
agency as your agent and your friend with your rival, the first contract with no R9 Signing Day or First Contract, learn
or demand, the closing the next season, 3–5 scenes in pro season 1); the Decision's versions (one more year, four
years, one-and-done: the pro version, your friend as your agent); a whole career to its ending (each chapter at its
age, no scene twice, the ending's cutscene with your sibling's line); the paths (the scandal ridden out, the sponsor,
leaving for a contender, buying a team: the Mercenary Champion or the Fallen Star; flags through a save and a reload);
an early retirement (passed, cut, Legacy's sudden version: two screens, the ending); an old pro save (7 and 8 passed,
Prime at its age). `tests/story.js`: the templates count beats with versions; V8's epilogues are checked as V8's six.
The career simulator prints the endings, the best friend's paths, the sibling's arc, the agents, Coach Adeyinka, the
ring chase, the Finals window and the last day. Eleven new phone and desktop audit cases (on a desktop, four answers in two rows now fit below the portraits' names). Quick checks: story21 (25), story (13), oldsaves, smoke (136), flow (12), school (8), recruit21 (15), fullcareer, life21 (17), the phone and desktop audits (308 and 304 cases, no problems) and the career simulator (both policies).

## W8 (2.1) — chapters 1–6: high school and college in chapters

The eighth of the ten 2.1 milestones (§4.2, chapters 1–6; chapter 1 came with W7's engine). Chapters 2–4 are
`179_saga_ch2.js`, chapters 5–6 `179_saga_ch5.js`. `tests/story21.js` has 7 new steps (18 in all). Chapters 7–12 and
the endings are W9's.

**Chapter 2: Varsity (sophomore year).** Three versions: the first varsity season, a second one (varsity as a
freshman), JV again. *The bus home* after the season's first game (your best friend, or the coach); *The rival*, the big
decision, after the rival game (or, by week 5, your rival in the stands at yours): shake their hand (rival +20, hype −2)
or talk trash back (hype +5, rival −20, coach −5); *An autograph* or *The quote*, the rival's own story (their little
sibling, who wears their number), told when the season has room; *Varsity*, the empty gym with Coach Adeyinka, who
remembers what you did.

**Chapter 3: The Spotlight (junior year).** Two versions: the letters (an offer, or a 3★ rating), or none yet (a camp
brochure addressed to "Current Resident"; Coach Adeyinka makes calls). *The letters* (or *The mailbox*) at the kitchen
table; *The bills*, the big decision: take a weekend job (+$400, practice XP −20% for 3 weeks, family +10) or let your
best friend's family help (family +5, your friend +15, and you owe them: a flag; with no friend, Coach Adeyinka helps);
*The shifts*, *Dinner at your friend's* or *The favor*, when the season has room; *The Spotlight* at the year's end.

**Chapter 4: Signing Day (senior year).** *Senior year* (the captain's armband, or sharing it with your friend); *Two
plans* (your friend's own college, a real program, and an invitation); *The kitchen table*, the big decision, at the
season's end or on Signing Day: three voices name real programs, your parent the offer nearest home (if it's a drive
away: its miles), Coach Adeyinka the dream (the best other one) and your friend their school (each answer carries its
school; the recap and the Story screen say it in full); *Signing Day*, the closing scene, comes with the
signing and has a version for every path: you kept your word, or you said one school and signed with another; a prep
year; a walk-on; no college at all (straight to the pros: a flag the chapters after it read). Following your friend to
their school makes you teammates (the friend's first path; the other three are W9's).

**Chapter 5: Freshman Wall (college year one).** Three versions: a scholarship, a walk-on, or the first pro season with
no college. *The first night* (the dorm, or a hotel room: your sibling's midnight video call); *The wall* (the bench,
when the season has room); *A call from home*, the big decision: stay and grind (practice XP +15% for 3 weeks, your
sibling −10) or go home for your sibling's big Saturday (sibling +20, family +10, practice XP −10% that week: a flag,
your sibling's mentor); *End of year one*.

**Chapter 6: March (college year two on).** Two versions: the national tournament, or the pros' playoff race (one
college year, or none: the first two pro seasons). *March* on the whiteboard (college); *The call*: Coach Adeyinka
collapses at practice, their heart (drive home, call every night, or win one for them: a flag); *Play through it?*, the
big decision, in the tournament (the playoffs) or the season's last weeks: your knee buckles; play through it (a legend
moment: hype +10, confidence +2, the injury risk of a rushed return for 4 weeks) or sit (fatigue −10, hype −3);
*One shining moment* (*The stretch* in the pros): the coach, home from the hospital, on the phone.

**The chapters take over their side arcs.** In a career with these chapters, Family Bills (chapter 3), the Best
Friend's choice (chapter 4) and the rival's first handshake (chapter 2; the Rival arc's buzzer beat is skipped, and the
arc goes on after it) wait for the chapter; a save whose chapters were passed by keeps the arcs.

**Pacing (§4.3).**
- The chapters keep the calendar's weeks (`chWeek`): a season on the bench opens its chapter on time, and its scenes
  keep their pace (R9's week counts the games you played). A season's bench weeks no longer add up across seasons (the
  fillers came at a season's first bench weeks). High school seasons with 3–5 scenes: 98.5% (96.5% with chapters 2–6 on
  the games played).
- A chapter opens in a season, never after its end (in the pros the playoffs go on without you).
- Never more than two story screens in a row, now for every card: the rival's moments go through the same queue, and a
  decision's card (an exam, your major, a visit, a staff call, your coach leaving) goes in at once while the story beats
  step back to the next moment. An official visit's three cards are one scene (§2.4: "a short scene").

**The dialogue box.** On a desktop, an answer too long for its button (three side by side) takes two lines, its note
below it (it was cut; longer still, it is cut as before and the audits flag it). A chapter's answer can say more in the
recap and on the Story screen than on its button (`pick`).

**The career simulator.** 160 careers with the default story answers: 3–5 scenes in 98.5% of high school seasons,
99.0% of college ones and 99.3% of pro ones (W7, with chapter 1 only: 95.7 / 100 / 99.6); with `--story=random` 97.7%,
98.5% and 99.0%. Chapters 1–6 reached and closed in 100% of careers either way. Versions: varsity 24% / JV 76% as
freshmen; sophomores on their first varsity season 53%, a second 24%, JV 23%; juniors with letters 42%, none yet 58%;
Signing Day kept 87%, a prep year 13%; college 94%, a walk-on 6%; March in college 96%, in the pros 4%. Random answers
spread every big decision (stay late 39% / go home 61%; shake hands 39 / talk trash 61; your friend's help 39 / the job
61; home 28 / the dream 38 / your friend 34; grind 39 / go home 61; play through it 41 / sit 59) and Signing Day's
closing (kept 34%, changed 54%, a prep year 12%). A new line lists careers that missed or
cut a chapter (none). No errors.

**Config.** `CONFIG.chapters.homeMiles` 250.

**Calls made.**
- Chapter 3's versions are by recruiting (letters or none yet): by junior year nearly every career is on varsity.
- The kitchen table's three voices come from your live offers: the one nearest home if it's a drive away
  (`CONFIG.chapters.homeMiles`, 250 miles; else "somewhere we can drive to"), the best of the others (with none, the
  dream has no name yet: "aim as high as they'll let you") and your friend's school. The default answer is a school
  with a name (by Signing Day most recruits hold one offer, their commitment).
- Your best friend's school is one of your offers that is neither of the other two, else a small program near home.
- March's college version opens in college year two or later; a career that leaves after year one gets the pro version
  in its first pro season, and one with no college gets Freshman Wall in pro season 1 and March in pro season 2.
- The coach's health scare ends in recovery (the story stays PG); W9 decides whether Coach Adeyinka coaches you again or
  retires.
- An official visit is one scene of three cards (§2.4), so the pacing counts it once.

**Tests.** `tests/story21.js` (18 steps, 7 new): chapters 2–6 written (3–6 scenes, a choice on each, one big decision, a
closing scene, their versions); high school over three simulated seasons (each chapter in its own season, 3–5 scenes,
nothing told twice, the big decisions remembered, Signing Day's closing at the signing with the school's name); the side
arcs the chapters take over; Signing Day's six versions (kept, changed, following your friend, a prep year, a walk-on,
the pros); college (Freshman Wall in year one, March in year two with the health scare and the knee, every flag through
a save and a reload); the pro versions (one-and-done, no college); old saves (a junior, a college sophomore). The career
simulator lists careers that missed a chapter; the phone and desktop audits cover ten new cases (title cards, the
rival, the bills, the kitchen table with the longest program names, Signing Day, the call from home, the health scare,
the knee); their title-card cases now keep the card on screen (W7's case checked the scene behind it).
Quick checks: story21 (18), story (13), oldsaves (42), smoke (136), flow (12), school (8), recruit21 (15), fullcareer,
life21, the phone and desktop audits (297 and 293 cases, no problems) and the career simulator (both policies).

## W7 (2.1) — the story engine: chapters, the cast, cutscenes, the recap, the Story screen

The seventh of the ten 2.1 milestones (§4.1 and §4.3, with §1.6's 3–5 scenes a season in every phase). The chapter
engine is `179_saga_ch.js` and chapter 1 `179_saga_ch1.js`; the dialogue box is `179_ui_dialog.js`, the backgrounds
`179_ui_saga.js`, the Story screen and the recap `179_ui_storysofar.js`. New test: `tests/story21.js` (11 steps).
Chapters 2–6 are W8's; chapters 7–12 and the endings are W9's.

**The chapters (§4.2's frame).** Twelve chapters in order, one scene a hook at most. Each opens with a title card on its
first scene, has one big decision whose key is a flag for good (`ch<n>`: "This will be remembered") and ends on a
closing scene; its version (the career's path) is picked when it opens. A chapter's scenes are told like the beats that
always get told, and the season's other beats leave them room (`chReserve`: the scenes still to come this season).
- A chapter whose moment is gone when the career gets to it (an old save, a path without that step) is passed by and
  shows as missed; one that runs out of time tells its big decision (if it's still to come) and its closing scene at the
  next regular moment; one whose level is gone (a jump to the pros) closes without them.
- Two new hooks, the chapters' alone: `season` (a season starts) and `tryout` (the list goes up). A scene says where it
  can come: the start of a week, after a big game (the rival, the playoffs, a final, an upset, a big night, a record, a
  key week), the season's end or the offseason.
- Sim ahead stops at every chapter scene, in both modes. (A season run used to answer every story card for you: most of
  what "about 10 scenes in 8 seasons" was.)

**Chapter 1: The Kid from (your school).** Freshman year, five scenes: *The night before* (the kitchen table, your parent
and your younger sibling: promise them the crossover, or promise to make the team), *the list* (Coach Adeyinka with the
tryout's result, varsity or JV, the chapter's two versions, and the old card's lines on which team is which; your best
friend, a classmate on your squad), *After
practice*, the big decision (stay and run with the seniors: coach +10, trust +5, practice XP +10% for 2 weeks, family
−10; or go home and help: family +15, your sibling +10, trust −3), what it led to (told when the season has room: the
seniors' move, or your sibling's rec league game) and *One of ours* at the season's end. An old save in its freshman
season starts it where the career is (the opening's version for after tryouts).

**The cast (§4.1).** Your **younger sibling** joins the cast (nine now): your surname, `CONFIG.chapters.sibGap` years
younger, a kid's portrait, a meter that starts at `sibStart` (they look up to you). **Coach Adeyinka** is a new career's
high school coach (the varsity's) and stays the cast's coach for life, in college and the pros (an old save keeps the
coach it had). Your **best friend** is met at tryouts, a classmate on your squad (the Best Friend arc keeps them). Every
portrait gets its person's age (a kid looks like a kid). The friend's four paths, the rival's own beats, the honest or
shady agent, the journalist, the veteran mentor and the owner come with the chapters (W8–W9).

**Presentation (§4.3).** A line can belong to another speaker: its page brings up their portrait (a portrait for each
speaker; three lines a box at most; the typewriter as before). A chapter's first scene opens on its **title card**
(CHAPTER n, the title, the version's line; `cardSecs`, or a tap), every chapter scene carries CHAPTER n in its title
line, and a big decision shows a gold **★ THIS WILL BE REMEMBERED** band over its answers (its outcome says it too).
Five new pixel cutscene backgrounds, twelve in all: the team bus at night, a dorm room, a college arena, the owner's box
(the court far below through the glass) and the retirement stage (a framed jersey, the spotlights breathing).

**Every scene has a choice (§4.3).** A card with nothing to decide gets two answers: a warm one, the default (the
speaker's meter + `react` if they're in the cast, else a breath: fatigue −2) and a focused one (practice XP + `reactXp`
for the week, fatigue +2). A side-arc beat without a choice still does what it did, once.

**Pacing (§4.3).** Never more than two story screens in a row: a third waits on the holder for the next moment, in
order (and goes along to the pros, or comes before the ending). 3–5 scenes a season: a beat that can wait leaves
`spare` places for what can't (an injury, a title); the scenes after a season's end count in the season they lead into
(the pros' offseason scenes used to fall between seasons, the decision and the combine's too); a rival's matchup card
(no words, no choice) isn't one of the season's scenes any more. The career simulator (120 careers): 3–5 scenes in
95.7% of high school seasons, 100% of college ones and 99.6% of pro ones (90.6% overall before; the high school seasons
still over 5 are two crits on a full season, W8's chapters 2–4 take over those years).

**"Previously on Hoop Heads" (§4.3).** CONTINUE CAREER opens on a recap over the last scene's background: the chapter,
what happened, your last choice (and that it will be remembered, for a big decision). An old save without a chapter yet
recaps its last saga choice; a career with nothing to tell goes straight to the hub.

**The Story screen (§4.3).** THE STORY SO FAR is the twelve chapters now: ✓ done, ● now, · ahead, — missed ("Before
this save"), each with the choice you made in it; your people and their meters beside them; the side stories (2.0's
timeline of the arcs) one press away. A phone shows one view at a time: Chapters, People, Side stories.

**The Codex.** The story page: *The main story* (the chapter you're in, your last big decision), *Side stories*, *Your
people* (with your sibling and Coach Adeyinka), *How it ends*.

**Config.** `CONFIG.chapters`: `inRow` 2, `reserveMax` 4, `gap` 2, `spare` 1, `cardSecs` 2.8, `sibGap` 4, `sibStart`
20, `coachName` 'Coach Adeyinka', `react` 3, `reactXp` 0.03.

**Calls made.**
- "3–6 scenes" is the whole chapter, the opening and the closing scene included (a season holds 3–5 scenes, and a
  high school year is a chapter); the big decision is one of them.
- Chapter 1's title is your own school's ("The Kid from Central Tech" when that's yours).
- Rival matchup cards no longer count as scenes (they have no dialogue and no choice); the R9 line in the career
  simulator still counts what it did, the new scenes line counts dialogue scenes.
- Coach Adeyinka's name replaces the random high school coach in a new career only; the draw that used to name the coach
  still happens, so a career's dice are unchanged.

**Tests.** `tests/story21.js` (11 steps): the twelve chapters and chapter 1's shape; chapter 1 over six simulated
freshman years (3–5 scenes, every one a choice, both versions, the big decision remembered, the closing at the season's
end, nothing told twice); the cast; the pacing (two in a row, the reserve, the offseason counting forward); every scene
a choice; flags through a save, a reload and the handoff to the pros; old saves (passed by, a mid-season start, a quiet
close); the Story screen; the recap; the cutscenes, the title card and the band; Sim ahead. `tests/story.js` runs its
side-arc steps with the chapters passed by (the cast is nine, the Story so far opens on the chapters). The career
simulator prints scenes a season by phase and the chapters reached; the old-save, full-career and smoke drivers know
the recap; the phone and desktop audits cover the title card, a scene with two speakers, the big decision, the side
stories view, the recap and the five new backgrounds.
Quick checks: story21, story, oldsaves (42 fixtures), smoke (136), flow, school, fullcareer, life21, recruit21, the phone
and desktop audits (287 and 283 cases, no problems) and the career simulator.

## W6 (2.1) — the offseason, contracts and league life

The sixth of the ten 2.1 milestones (§3.3–3.7). League life is `162_life.js` (careers, retirements, rookies, the AI's
free agency and trades, hunger, title windows, power rankings, the GOAT ladder, the records, PBL Tonight, the meddlers),
your side of it `162_life_fa.js` (contracts, the free agency week, the agent's counter, options, the no-trade clause,
incentives, training camp); the screens `177_ui_off2.js` (the seven offseason steps and the negotiation) and
`177_ui_life.js` (the value meter, the power rankings, the GOAT ladder, the records). New tests: `tests/life21.js` (17
steps) and `tests/league30.js`.

**The offseason in seven screens (§3.3).** After the Finals a 2.1 season's offseason is seven steps with a strip on top
(1 Awards … 7): **Awards Night** (as before, with your season goals and incentives paid), **aging** (everyone a year
older: the young grow, the old fade), **retirements** (the league's retirees; the greats, a GOAT score of 40+, an MVP or
two titles, get a tribute card with their clubs, titles and a line; a score of 12+ goes to the Hall), the **free agency
week**, the **trade window**, **training camp** and the **preseason power rankings**. Continue goes on; a step that
needs you waits (an offer to answer, your option, a no-trade call, two camp goals); "Sim to next big moment" runs to the
next decision of yours (and is hidden while one waits).

- **The free agency week:** five days. Your team offers on day 1 (good for three days), the others from day 2 (two days
  each: the best franchise your value reaches, one that starts you, a rebuild your agent finds) and a contender over the
  cap may pitch a **title shot** on day 4 (a role on a winner: at most two stars above the franchises your value
  reaches; a 5★ one only through its open spot). Each day: **Accept**, **Counter** or **wait**; offers expire, the
  ticker shows the league's signings day by day (stars sign elsewhere; the hungriest franchises shop first), and on the
  last day the best offer left is yours (or one more season where you are, at the minimum).
- **Over the cap** a team offers ×0.65 of your market (at least the $6M exception) and pitches its title odds; **win-now
  owners chase** you (day 1, ×1.1); a **cheap owner** lets you walk once your market value passes $14M.
- **Signing:** your contract (years, salary, an option, a no-trade clause, the incentives) and the move. When you'd
  start over the new club's league player (within 2 OVR), the club lets them go to make room (they sign elsewhere that
  week; no superteam of two stars); a better one stays, and you join behind them.
- **The trade window:** the AI's offseason trades (about 40% of the season's), each with what it gave and got; a
  rebuilding owner may trade you, to a contender up to two stars above your value's reach (a role on a winner: it keeps
  its starter and sends a young player back): with a no-trade clause it's your call, without one it happens (a TRADED
  card).
- **Training camp:** pick two season goals from the ones that fit you (win N games, make the playoffs, average N points,
  an All-League team, the All-Star team, the MVP race's top five, a starting spot); each one done pays 1,500 bonus XP
  and 5% of your salary (at least $250K) at Awards Night.
- **The preseason power rankings:** the sixteen, 1–16, each with a line.

**Contracts and the negotiation (§3.4).** A deal is years, a salary, maybe an option on the last year (a **player
option** on starter and rebuild offers: opt in for a season or test the market; a **team option** from 31, kept when
you're worth 85% of it) and a **no-trade clause** once you have two All-League selections (from win-now owners, your
team and the best offer). Every deal has **incentives**: an All-League team +10% of the salary, the MVP +20%. **The
agent's negotiation:** their cap room and their most, your asks (+5%, +10%, +20%, and a no-trade clause, a player option
or a starting spot) with the risk of each, and your agent's call (the biggest raise at 25% risk or less). The risk: 8%,
+16% for every 10% asked, less the more they want you; win-now −8%, cheap +12%, a meddler +4%; −2.5% an agent tier; +3%
a day into the week; a clause +10%, an option +6%, a start +8%. A yes signs your terms; a no and they walk.

**League life (§3.5).** The other fifteen re-sign (65% of the expiring they still want), extend the young, cut expensive
veterans in a rebuild, sign free agents day by day (contenders the best player now, rebuilds the young, the rest value
for money; win-now owners pay ×1.1, cheap ones ×0.92) and trade (a target of 9–13 a season: about 40% in the offseason
window, the rest week by week to the deadline; buyers give youth for a veteran, the hungriest first). Every player has a
career (seasons, points, titles, MVPs, Finals MVPs, All-League teams, clubs); everyone ages; they retire from 32 (10%,
then 25% at 34, 50% at 36, all at 39). Rookie classes (6–12 a year, OVR about 62) come from the college system, and
**your old teammates come up** when they're good enough (up to three a class: "Your high school teammate Nadia Sato is
in the rookie class", then "… signs with the Bodega Ballers"); your old rival signs when you go pro.

- **The GOAT ladder:** the all-time top 50 (the PBL's past greats, the retired, the active in green, you), scored titles
  12, MVPs 12, Finals MVPs 4, All-League 3 (2nd team 1), a point a season and one per 250 points; your rank.
- **The records:** points in a season, points a game, wins, a winning streak, career points, titles and MVPs, who holds
  each and when; a new one makes the news (and your timeline). The League's new **Power**, **GOAT** and **Records**
  tabs.
- **Hunger:** the four longest title droughts (six seasons or more, the PBL's history counting) go all in: +1.5 a
  simulated game (the longest drought +3 from sixteen seasons), the first pick in free agency and trades, pay ×1.15 (+2%
  a year, to ×1.35), contending. A star (84+) on a team going nowhere re-signs 60% less often; a champion re-signs 25%
  less often. Every franchise gets its turn (`tests/league30.js`).

**Media (§3.5).** **PBL Tonight**, the week's headline on your hub and in the news (the national TV game, an upset, a
new MVP leader, a trade, a streak, rivalry week); **power rankings** every week (team strength and the record, with
arrows and a line each); the **national TV game's** pregame intro ("● LIVE · PBL TONIGHT · NATIONAL TV").

**Owners and the hub (§3.6).** The hub's team line has a **value meter**: your value against every bar (2★–5★; a bar
turns gold when you pass it, green up to your franchise's). **Teams act when you cross a bar:** better franchises call
(as before), and from the 3★ bar **your own club builds around you** that offseason (it contends: veterans in the trade
window, the best free agents, the first pick after the hungriest; a title doesn't cost it its players; +0.5 a simulated
game the season after) unless its owner is cheap. **Owners react:** win-now owners chase, cheap ones let stars walk, and
a **meddler** makes story beats (two a season at most): the press after a slide (defend the team, "we must be better",
no comment), "play them more" (thank the owner or back the coach), shopping you before the deadline (ask to stay, or let
it play out: a trade call comes easier) and firing the coach (a new system; the trust starts over). Every franchise
shows its **title window** (Contender, Rising, Rebuilding: the top five by strength contend, the bottom five and every
rebuild rebuild) on its page, the franchises list, the offers and the rankings.

**Codex:** a new page, The PBL (the league, rosters, owners and how they react, the offseason, free agency week,
contracts, negotiating, training camp, league life, title windows, power rankings and PBL Tonight, the GOAT ladder, the
records); Team stars and Your value updated. The League screen, the offseason and the negotiation open it.

**New and changed constants.** New: `life` (`retire`, `legendScore`, `hallScore`, `goat`, `goatN`, `goatPast`, `keep`,
`extendAge`, `extendOdds`, `cutOdds`, `faDays`, `faSignDay`, `capException`, `minDeal`, `winnowPay`, `cheapPay`,
`acceptAt`, `rookies`, `rookieOvr`, `pastFloor`, `pastGrow`, `pastMax`, `trades`, `tradesOff`, `hungerAt`, `hungerN`,
`hungerEdge`, `hungerLong`, `hungerPay`, `hungerPayYear`, `hungerPayMax`, `hungerGap`, `starContend`, `starLeave`,
`champKeep`, `benchGrow`, `window`, `powerWin`, `meddleOdds`, `campGoals`, `campXp`, `campPay`, `campPayMin`, `ntcAt`,
`incentives`, `offerLife`, `overCapMul`, `cheapWalk`, `ringReach`, `roomGap`, `counter`, `starEdge`),
`franchise.eliteHold` (8), `franchise.rebuildYears` (1; V12 had 2 built in) and `franchise.rebuildReach` (2). Changed
(the §3.7 retune below): `franchise.keep` 0.6 → 0.9, `franchise.titleBoost` 0.3 → 0.1, `franchise.rookieBar` 5★ 119 →
130, `franchise.spot5Odds` 0.5 → 0.4, `franchise.rivalVal` 84 → 86, `franchise.trade5Odds` 0.35 → 0.25, `league.poNoise`
0.75 → 0.8, `career.newsMax` 40 → 80 (the league's news fills a season).

**The §3.7 targets.** The plays-well policy is the career simulator's great one (every game played well, the sensible
choices: `--policy=great`). `tests/difficulty.js` (600 careers a policy, seeds 1–3):

| Row | Typical: W5 → W6 (band) | Great: W5 → W6 (band) |
| --- | --- | --- |
| A 3★ team | by 28 83% → 90% (half by 26–28) | by 24 92% → 93%; ever 100% (§3.7: 60%+) |
| A 5★ team | 27.5% → 18.2% (15–25) | 82.3% → 51.2% (§3.7: 35–55) |
| Titles a career | 0.21 → 0.35 (0.2–0.4) | 1.41 → 1.15 (§3.7: 1–2) |
| Hall of Fame | 1.5% → 1.7% (3–8%) | 41.0% → 37.7% (30–40%) |

Two rows are outside their bands (W5: five), both typical and both already out at W5: a typical career reaches a 3★ team
too soon, and it rarely makes the Hall of Fame. No Hall of Fame line fits both policies with sixteen franchises (titles
are scarcer: at 84 typical 2.8% and great 44.7%, at 92 1.7% and 37.7%), so the line stays at 92. The league
(`tests/league30.js`, five leagues of thirty seasons with a league-average you): the AI teams make 10.9 trades a season
(8–15 in every season), a new champion comes in 91% of seasons (§3.7: 60%+; one franchise won at most 3 to 7 titles a
league) and every franchise wins a title within the thirty seasons in all five leagues. The effort table
(`tests/effort.js`, 200 careers each) passes its six checks: plays well + good choices against sims everything, legacy
+111%, a 5★ team 51% against 14%, 1.03 titles against 0.21; plays well and never opens a menu, a 3★ team in 100% of
careers (a 5★ team 34%, 0.76 titles).

How it got there: the first W6 runs, with the league's players moving, signing and retiring, churned the star ranks and
lifted nearly every team you joined to 5★ (great 84%, typical 42%). Now prestige is a decade's history (keeping 90% a
season) and a 5★ franchise keeps its fifth star while its prestige ranks in the top eight; a 5★ team is a climb (an open
spot in 40% of seasons, chased by better free agents; a 5★ trade 25% of the time; the 5★ rookie bar 130); your club
builds around you from the 3★ bar (+0.5 a game the season after); a rebuild may trade a veteran to a contender up to two
stars above their reach (a role on a winner); the league's longest drought, from sixteen seasons, plays at +3 a game
instead of +1.5; the playoffs are a little less predictable (noise ×0.8).

**Old saves.** A save from the W5 build mid-offseason finishes it the old way (moves, then a contract); its next
offseason is the new one. Every league player's career so far is seeded on first look; the GOAT ladder and the records
fill in from the PBL's history. New fixtures from the W5 build (a high school career; a pro one mid-season, in the
playoffs and in the offseason).

**Tests.** New: `tests/life21.js` (17 steps: the seven steps, the free agency week, the negotiation, over-cap and cheap
owners and win-now chases, options, the clause and incentives, the trade window and rebuilds, training camp, league life
over six seasons, your past in the rookie classes, windows and hunger, the GOAT ladder and the records, media, the
meddler, the value meter, the W5 saves, the screens on a desktop and a phone) and `tests/league30.js`. Updated:
`careersim` (the new offseason; the §3.7 line), `oldsaves` and `fullcareer` (the new offseason's buttons),
`gen_oldsaves` (the W5 build), `difficulty` (the §3.7 bands for the great policy; the Hall of Fame at other lines),
`smoke` (2.1's DPOY comes from the playoff teams; the pro match's result screen gets a few seconds). Quick checks this
milestone: life21 (17), smoke (136), flow (12), polish (14), story (13), staff (11), old saves (42), proteams (14),
climb (9), improve21 (13), pbl21 (11), recruit21 (15), colleges (14), playtest3 (11), the full career (1), the phone and
desktop audits (276 and 272 screens, no flags), the W6 screen audit (86 screens), the difficulty table, the effort table
and five 30-season leagues. The full suite runs once, at W10.

**Found on the way.**

- W6's first signing put the new club's league player on its own bench, so every club you joined became a two-star
  superteam (your bench stood 5–9 OVR over the league's): now the make-room rule above. The 2.0 signing swapped the two
  league players between the clubs.
- The day-4 title shot came from any 4★ contender whatever your value (it bypassed the bars: 65 of 100 typical careers
  took one): now at most two stars above the franchises your value reaches.
- With the league's new parity the star ranks churned (about six franchises change stars a season), and a team you
  joined at 4★ became 5★ in most careers: a 5★ franchise now keeps its fifth star while its prestige ranks in the top
  `FRN.eliteHold` (a down year doesn't cost a storied club its status).
- "Sim to next big moment" did nothing when the step waited on you (it stopped where it was): it's hidden then.
- A three-answer card on a phone covered its own text when it came with its own options (the meddler's press question):
  those answers get their own page, as the saga's do.
- An offseason that had lost its free agency state (an old test's half-built one) broke the step: the week opens again.
- The Codex said free agency brings three offers: it's the week now (The PBL page has the days).
- A rebuild's trade still swapped the two clubs' league players (2.0's one-player clubs): the contender sent its starter
  to your old club. Now the contender keeps its starter (the depth chart decides who starts) and sends its youngest
  bench player back; both keep five.
- The hub's value meter gave way to the "#15 of 16 franchises" note beside a long club name (§3.6: always visible): the
  note gives way now, and the bars' labels show when they fit apart (the ticks always).
- The news kept 40 items, and the league's weekly trades and PBL Tonight pushed the season's rivalry week out by the
  deadline: it keeps 80.
- Awards Night could throw for a winner no longer in the league (a test drew it after the new season began): it draws a
  blank line instead.
- On a phone the free agency week's Accept and Counter were 61 px tall (64 now), and a cheap owner's payroll line on a
  franchise page was cut (two lines now).
- The news feed cut the league's trade items at its two lines: they're shorter now (the trade window keeps the clubs and
  ages).

## W5 (2.1) — the PBL's structure, calendar and playoffs

The fifth of the ten 2.1 milestones (§3.1–3.2). The league model is `162_pbl.js`, its pages `177_ui_pbl.js` (the
franchise page is rebuilt in `177_ui_franchise.js`). New test: `tests/pbl21.js` (11 steps).

**Sixteen franchises in two conferences (§3.1).** The twelve stay and four join: the Fire Escape Foxes (Ashgate),
the Food Truck Falcons (Brickport), the Turnstile Tigers (Southmoor) and the Rec Center Rockets (Lakeview), each with a
city, colors, a pixel crest, an arena, a fan base, an owner, a legend, a rival and a founding year (2016 and 2024: no
titles before your career, so the PBL's history since 1979 is unchanged). East: Prophets, Pilots, Ballers, Comets,
Legends, Nephews, Foxes, Tigers; West: Raccoons, Owls, Vandals, Kings, Sharks, Monarchs, Falcons, Rockets (every rival
pair in one conference). The league is sixteen starters, one a franchise; stars are three 1★, three 2★, four 3★,
three 4★ and three 5★.

- **Owners:** win-now, patient, cheap, and now meddlers ("calls the coach and makes the news": the Raccoons, Foxes
  and Tigers in a new career; a save keeps the owners it had). **The GM's style** each season: Contend, Rebuild or
  Balanced (a meddler picks any).
- **The coach's system:** Pace (Speed, Hops, Finishing), Iso (Handles, Shooting), Defense (Defense, Strength) or
  Development (young players); **your fit** (0–100) from your ratings in its keys against your own average
  (Development: your age). A great fit starts with the coach's trust +6 and practice in its ratings pays +6% (a good
  fit +3%); a poor fit starts −6.
- **Rosters:** each franchise is its starter (the league player; yours is decided by the depth chart) and four on the
  bench, each with ratings, an age and a contract. Your team's bench is the franchise's: when you leave, your
  teammates stay, and the new team's bench becomes yours.
- **Payroll:** the five's contracts (the same scale as your market value) and the rest of the roster (by stars and
  owner), against a **$120M soft cap**; a cheap owner never goes over the **$140M luxury tax line**. A new league's
  payrolls average $46M at 1★, $62M, $83M, $104M and $127M at 5★: the contenders sit at the cap.
- **Chemistry:** +1 a season the same five stay together (up to +3); one change −1, more back to 0.
- **Team strength** = (the starter's OVR + the bench's average) ÷ 2 + chemistry, on the franchise page. The simulated
  games and the title odds use it: the starter's ratings (strengthOf), `LG.benchEdge` 0.3 a point of bench OVR,
  `LG.chemEdge` 0.5 a point of chemistry, and the owner's moves (`LG.starEdge` × the boost). The stars' own edge
  (1.3 a star) is gone in a 2.1 season: a 5★ team is strong because of who plays for it. (A bench 10 OVR better with
  +3 chemistry: 118 → 205 wins in 400 simulated games against the same opponent.)
- **The offseason's benches:** a year older (the young improve, the old slow down), contracts run down; an expiring one
  re-signs about half the time (a rebuild keeps fewer veterans), the old retire, and new players fill the four at the
  franchise's level (younger in a rebuild, a little better for a contender); a cheap owner lets the priciest go before
  paying the tax. Your team's moves make the news and the depth chart. (12 offseasons: 191 expiring, 78 left, 14
  retired, 92 joined.)

**The calendar (§3.2).** Fifteen weeks (the 11/22-game choice is gone from career creation): everyone plays everyone
once (7 or 8 home games each). Week 4 is **rivalry week** (every franchise plays its rival; a win: fame +1), the
**All-Star break** comes before week 8's game, the **trade deadline** closes trade requests and calls after week 10,
and week 13 is your **national TV game** (the hype on the line ×2). The hub's calendar tags each one (RIVALRY,
ALL-STAR, DEADLINE, NATIONAL TV), the next-game label names it, the news calls it, and the result card says what the
TV game or the rivalry did. A fifteen-week season pays the XP eleven did (`PBL.xpWeeks`), so a pro year grows you as
before.

**The playoffs.** The top four of each conference: semifinals 1–4 and 2–3 (best of 3), the conference finals (best of
3, the better seed hosting), then the **PBL Finals** (best of 5; the better record hosts games 1, 3 and 5 before a
louder crowd: +1 point in a simulated Finals game, +3% to your makes at home in one you play). The bracket shows East
and West with the Finals between them (before the playoffs: if the season ended today); the hub's tiles are CS, CF and
FIN; your season reads "Lost in the conference semifinals" and so on.

**The award races.** A weekly **MVP ladder** (everyone ranked by MVP score after every week: the top five with arrows
against last week), **Rookie of the Year**, **Defensive Player** (from the teams in a playoff spot), **Most Improved**,
the new **Sixth Man** (every franchise's best bench player by OVR and their team's winning; you, when you sat at least
half your weeks), **All-League 1st and 2nd teams** and the **Finals MVP**. The League's new Races tab shows them all;
the hub's record line adds your conference place and your ladder rank ("8-4 · 2nd in the East · MVP ladder #3 ▲");
Awards Night adds the Sixth Man and the second team (ten rows fit a phone).

**On screen.**

- **The League:** Standings by conference (East and West side by side; the playoff line under each fourth), the
  sixteen franchises (two columns on a phone), the schedule with the key weeks, a fuller History (the Finals MVP, the
  Sixth Man, both All-League teams) and Races.
- **A franchise's page,** two tabs: the club (title odds, the owner, the GM's style, the coach, the system and your
  fit, the market, the payroll against the cap, the rival, what it needs; the roster of five with OVR, age and
  contract; team strength and chemistry) and its history (title banners, retired jerseys, legends, when it joined).
- **The bracket:** East, the Finals, West.
- Codex: The PBL, Rosters and payroll, Owners/GMs/coaches (new), Team stars and Title odds (rewritten); the Pros tip.

**Old saves.** A 2.0 save (twelve franchises) gets the four new rows (low prestige, 1★ until its season ends) and a
bench, contracts and chemistry for every franchise; a season in progress finishes as it began (twelve starters, the
top-8 bracket). The four sign their starters (veterans at their level) in the next offseason's moves, or when the
next season starts, which is a 2.1 season (sixteen starters, fifteen weeks, the conferences). New fixtures from the W4
build: a pro career mid-season, in the playoffs and in the offseason (`tests/gen_oldsaves.js` runs builds after F1
too: no classic team league, and the dev jump to the pros).

**New and changed constants.** New: `pbl` (`conferences`, `weeks`, `rivalryWeek`, `allStarWeek`, `deadlineWeek`,
`tvWeek`, `tvHype`, `rivalryFame`, `confSeeds`, `confBestOf`, `finalsBestOf`, `finalsHomeEdge`, `finalsCrowd`,
`softCap`, `taxLine`, `depth`, `depthOwner`, `chemMax`, `xpWeeks`, `sysXp`, `sysTrust`, `benchRetire`, `benchKeep`,
`sixthWin`, `sixthMe`, `expansionPrestige`), `league.benchEdge`, `league.chemEdge`, `career.leagueVets` (11).
Changed: `career.leagueSize` 12 → 16, `franchise.starsDist` 2/2/3/3/2 → 3/3/4/3/3. Kept for an old save's season in
progress: `career.seasonLengths`, `playoffSeeds`, `semisBestOf`, `finalsBestOf`, `PR.tradeDeadline`.

**Balance after W5.** `tests/difficulty.js` (600 careers a policy):

| Row | Typical: W4 → W5 (band) | Great: W4 → W5 (band) |
| --- | --- | --- |
| A 5★ team | 24.5% → 27.5% (15–25) | 79.2% → 82.3% (52–68) |
| Titles a career | 0.49 → 0.21 (0.2–0.4) | 2.34 → 1.41 (1–3) |
| Hall of Fame | 5.5% → 1.5% (3–8%) | 54.3% → 41.0% (30–40%) |
| A 3★ team | by 28 81% → 83% (50%) | by 24 94% → 92% |

Sixteen teams and three playoff rounds (the last a best of five) make a title rarer: 0.21 and 1.41 a career, and the
Hall of Fame falls with them (a title is 12 legacy points). Five rows are outside their bands (W4: four): the typical
titles came into theirs, the typical 5★ row left its band and the typical Hall of Fame fell under it. W6 retunes both
policies against §3.7 (the plays-well policy: a 3★ team in 60%+ of careers, a 5★ team in 35–55%, 1–2 titles), as
planned. The career simulator (100 careers, seed 1): nobody stuck, no errors; a ring in 19% of careers, 0.27 titles a
career (all as the starter), a median of 13 pro seasons.

**Tests.** New: `tests/pbl21.js` (11 steps: the franchises and conferences, a new league, team strength and
chemistry, the coach's system and fit, the calendar, the playoffs, the award races, the benches' offseason, a 2.0
save's expansion, the screens on a desktop and a phone). Updated: `proteams` (sixteen franchises, the conference
playoffs, a meddler's plan, the team edge), `smoke` (the F7 step: sixteen), `improve21` (a facility's XP with the
coach's system), `phoneaudit` (five new cases: Races, the schedule, History, a franchise's history, a new franchise),
`gen_oldsaves` (the W4 build, from the dev jump), `oldsaves` (a career that retires on the way) and `polish` (half the franchises in the Foundry: eight of sixteen). Quick checks this milestone: smoke (136), flow (12), polish (14), story (13), staff (11), old saves
(38), proteams (14), improve21 (13), pbl21 (11), recruit21 (15), the phone and desktop audits (276 and 272 screens, no
flags), the W5 screen audit (25 screens on each), the career simulator and the difficulty table. The full suite runs
once, at W10.

**Found on the way.**

- The old migration rebuilt an old save's whole franchise table when the number of franchises changed (`frTable`):
  it now adds the missing rows and keeps everything else.
- Text the new league's names and opponents brought out (each drew whole in W4's audits): a long teammate's name on
  the team page (the first name goes to its initial: every generated name fits then), five moves in the film room's
  list on a phone (three and "+2 more"), and the pregame's scouting report on a desktop, where a Showman's line needs
  three lines (two were drawn) and four of the eight weakness lines ran past their column (the pixel font keeps one
  width from 8 to 16 px there, so shrinking can't help): a long weakness wraps like a tendency, and a desktop's report
  has its own wider panel under the tape, clear of both players (the worst case, 359 px tall in the old column's 320, is
  239 in the new panel's 314).
- `tests/gen_oldsaves.js`: its plain amateur loop answered the transfer portal as a college choice, so a portal
  player started college over every year (the first W4 fixture's pro was 61 and retired in the old-saves run); builds
  that have the dev jump use it now. `tests/oldsaves.js` then opened the hub's pages on that retired career: it reads
  the career's phase now.

## W4 (2.1) — the recruiting game

The fourth of the ten 2.1 milestones (§2.2–2.7). W3's interest was a static score and offers still came one a tier;
now recruiting is a game you play from your sophomore year to Signing Day. The model is `165_recgame.js`, the screens
`175_ui_recgame.js`. New test: `tests/recruit21.js` (15 steps).

**Interest that moves (§2.2).** Every program's interest in you (0–100) is built from parts you can see on its page:

- how you **fit** its usual recruit: your projected national rank against the program's level (a blue blood's usual
  recruit is about #9 in the nation, a 3★ power program's #132, a 1★ small school's #3,500). Programs above you want
  anyone better; a small school doesn't reach far up;
- your **coach's word** (±6), **home** (within 300 mi +6, past 1,500 mi −4), your **character** in the press room
  (Team first raises it, Trash talk lowers it, at most ±5), the **contact you earn** (actions and visits, up to +40;
  it fades a point a week after 2 quiet weeks) and the **competition** for its spots (±6: the recruits chasing them
  rated over or under you);
- under its GPA line, at most 20; a freshman is watched at most (49), a sophomore contacted (69); after your verbal
  commitment the other programs stop rising (a flip-friendly quarter keep at it).

**Offers, spots and pulls.** From your junior year, a program with interest 70+, a scholarship spot open and your GPA
over its line offers some week: blue bloods quickly, the others choosing among many, all of them sooner for a recruit
better than their usual one (`recruiting.hazard`, `recruiting.above`). An elite academic program offers from GPA 3.0,
on condition of its 3.3 by your senior finals (the senior midterm warns you; the finals make it final or pull it).
Each program has 1–3 spots and 1–3 more named recruits than spots; they commit through your junior and senior years,
your story rival among them (from your junior year they chase a program you want, now and then your favourite), and
the news follows the programs you care about ("Spots left: 1"). An offer no longer holds a spot: whoever commits
first gets it. An offer is pulled for grades (a report card under its line warns, the next pulls), a long injury
(4+ games: a warning, then 3 more weeks out), interest under 50 (a warning under 55) or a filled spot (a warning at
the last spot, or with the offer when only one is left). Always a warning first.

**Actions (§2.3).** Three a month from your sophomore year (a month is 4 game weeks; a summer is one): send film (+5
at up to three programs), an email (+3), ask your coach to call (+10, trust 60+), a camp ($250: +10 there, +3 across
its conference, and a showcase game against its best player), an unofficial visit (+8; it takes the week, free in the
summer), an official visit (+15, at most five, from interest 50).

**Official visits (§2.4)** are a weekend in three scenes: the team (the captain, a pickup game), Saturday night (the
players' party or the academic advisor at eight) and the coach's pitch, by style: an Iso coach promises the ball, a
Development coach shows the practice plan, Pace and Defense coaches sell theirs. The choices move interest more; a
manager's whisper hints that a coach is talking to other programs ("Ask about the rumors"). A visit shows the
program's facilities and how its coach develops players (hidden on its page until then); with an offer in hand,
"Commit on the spot".

**Commitment, flips and the carousel (§2.5).** A verbal commitment isn't binding: one of the program's spots is
yours, and the others stop rising. A flip costs hype (−8), brings a press storm (its own questions), costs your next
coach's trust (−10 when you arrive), and most programs cool on you (−10 earned interest; a flip-friendly few +5). The
coaching carousel: 15% of the coaches you commit to take another job before Signing Day (a program at least as good,
with a spot): follow them (no flip), stay, or reopen your recruitment at no cost.

**Signing Day (§2.5) and no offers (§2.6).** After your senior season: sign any live offer (your commitment first),
binding, with a hat on the table for every program that ever offered (pulled ones too; rows of them past eight). With
no offer: walk on at any program whose GPA line you meet (no scholarship: you pay the tuition and start at the bottom
of its depth chart), a prep year once (a prep school near home, one more season, a new class: win 70% of its games and
the scouts add a star, the offers come back), or the pros (offered whenever no other road is left: three franchises
always make offers after the combine).

**The College test.** In your junior year, after week 6, with a heads-up card at the start of the season: three or
more Study weeks before it, GPA +0.15; one or two, +0.05; none, −0.10.

**On screen.**

- **A program's page:** Recruit… (gold) opens its actions; your contact with it and your commitment; the facilities
  and the coach's extra work show after an official visit. Rows everywhere say Committed.
- **The action sheet:** the program's header, its interest and the parts of it, your status (offer, spots, a
  condition, a warning, the actions left this month, your visits, the recruits after its spots) and seven buttons,
  each with what it does or, greyed, why it can't happen now (Send film, Email, your coach's call, a camp, the two
  visits, Commit or Decommit). Scenes (a camp's card, a visit's weekend) play right after.
- **Send film:** pick up to three programs (yours first, then by interest). **The Recruit tab:** the actions left,
  Send film, Offers & rank, the Recruiting log, and Signing Day at decision time.
- **Offers & rank:** every offer with its status (committed, conditional, met, a warning, pulled and why), paged.
  **The Recruiting log:** offers, warnings, pulls, visits, commitments and flips, by class year.
- **Signing Day:** the offers (crest, level, where you'd begin, a condition, SIGN), and the other roads; a walk-on
  picker. The hub's button says SIGNING DAY; the commit card's stamp says SIGNED or WALK-ON.
- Codex: Colleges & recruiting rewritten (interest, offers, spots, actions, commitment and Signing Day, the College
  test); first-time tips for the action sheet and Signing Day; the Recruiting tip rewritten.

**The career simulator's typical recruit.** `tests/careersim.js` now recruits the way a typical player would: each
month's actions go to the best programs in reach (film to the top three; an official visit to the top one from the
junior year, else your coach's call or an email; a camp in the summer when there's money), a commitment to the #1
school (the dream: the most prestigious program in offer range when the junior year starts) the week it offers,
otherwise the best offer at the start of the senior year, sooner when a warning says its last spot is going (half
the careers heed it); a better #1 that offers later is worth a flip, and a coach who leaves is followed. `--rec=none`
waits for Signing Day; `--hsOnly --spread=12` stops at Signing Day with each career's ratings shifted −12..+12, so
every star level gets sampled.

**§2.7 — the printed targets** (`careersim.js 300 <seed> --hsOnly --spread=12`, seeds 1–3, 900 careers; offers
received by Signing Day, pulled ones included, by the stars at signing; "no offer" = no live offer on Signing Day):

| Stars | Offers (target) | No offer (target) |
| --- | --- | --- |
| 5★ | 16.7 (10–20) | 0% (0%) |
| 4★ | 5.9 (5–9) | one career, 0.5% (0%) |
| 3★ | 2.8 (2–4) | 7% (about 8%) |
| 2★ | 1.1 (1–2) | 35% (about 30%) |
| 1★ | 0.6 (0–1) | 58% (about 60%) |

By seed: 5★ 16.9 / 17.5 / 15.8 offers; 4★ 6.1 / 6.2 / 5.4; 3★ 2.7 / 3.0 / 2.7; 2★ 1.2 / 1.1 / 1.0; 1★ 0.7 / 0.6 /
0.4 (174, 196, 256, 238 and 36 careers by stars).

A 5★ loses the #1 school (no live offer from it on Signing Day) in 22% of careers (38 of 174; 18 / 23 / 24% by seed) (target 15–25%). An elite academic
offer is never final below 3.3 (`--school=student`: 268 elite academic offers in 300 careers, none final below 3.3). Typical careers without the spread (300, seed 1)
are mostly late bloomers in the top rows: their 4★s committed as 3★ juniors to the dream school and average 3.6
offers (3★ 3.1, 2★ 1.4). Full careers (100, seed 1): nobody stuck; 95% committed by Signing Day; the carousel in
14 (13 followed); 82 signed, 10 signed after a prep year, 8 walked on after one.

**Balance after W4.** `tests/difficulty.js` (600 careers a policy):

| Row | Typical: W3 → W4 (band) | Great: W3 → W4 (band) |
| --- | --- | --- |
| A 5★ team | 23.7% → 24.5% (15–25) | 79.5% → 79.2% (52–68) |
| Titles a career | 0.41 → 0.49 (0.2–0.4) | 2.48 → 2.34 (1–3) |
| Hall of Fame | 4.5% → 5.5% (3–8%) | 54.8% → 54.3% (30–40%) |
| A 3★ team | by 28 84% → 81% (50%) | by 24 94% → 94% |

The rows outside their bands are the four W2 and W3 left outside; W6 retunes both policies against §3.7, as planned.
Typical careers now start college at programs of their level (career simulator, college seasons a career: small 1.39,
mid-major 1.01, power 0.14, blue blood 0.01; W3 0.49 / 1.26 / 0.71 / 0.02): offers come week by week from the
programs that want you, and a typical recruit commits to one instead of taking the best of one-a-tier.

**New and changed constants.** New: `recruiting` (`fit`, `hazard`, `above`, `projYear`, `committedMul`, `earnedMax`,
`decay`, `graceWeeks`, `charW`, `charMax`, `comp`, `compMax`, `warnInterest`, `pullInterest`, `injuryGames`,
`injuryWeeks`, `injuryKeep`, `academicFrom`, `test`, `watch`, `actions`, `monthWeeks`, `film`, `email`, `camp`,
`unofficial`, `official`, `coachCall`, `carousel`, `flip`, `prep`). Removed (the old ladder): `colleges.interest`'s
`base`, `perPt`, `prestige` and `smallCut`, `hs.offerCuts`, `hs.visits`, `amateur.offerCuts`, `amateur.recruit.offers`
(and `amCollegeOffers`, `colPickProgram`, `hsOfferTier`). A college decision from before 2.1 keeps its offer board,
visits and commitment day.

**Tests.** New: `tests/recruit21.js` (15 steps: interest, offers, spots, warnings and pulls, the actions, an official
visit, commitment and flips, the carousel, Signing Day, no offers, the College test, the desktop screens, the Codex,
old saves, the phone screens). Updated: `smoke` (Signing Day; warnings before pulls), `school` (conditional academic
offers; a warning first; no offer means Signing Day's roads), `colleges` (an offer holds no spot, the commitment
does; small schools don't reach up), `flow` (the Recruit tab's buttons), `phoneaudit` (eight new cases: the action
sheet twice, film, the log, Signing Day with and without offers, the walk-on picker, fifteen hats), `fullcareer`,
`oldsaves`, `gen_oldsaves` and `shots` (Signing Day in the scripted careers), `careersim` (above). Quick checks this
milestone: smoke (136), flow (12), polish (14), school (8), story (13), old saves (34), playtest3 (11), improve21 (13),
colleges (14), recruit21 (15), the phone and desktop audits (272 and 268 screens, no flags), the career simulator and
the difficulty table. The full suite runs once, at W10.

**Found on the way.**

- The college Signing Day screen first shared its function name with the pro signing ceremony: the later part
  silently replaced the earlier one (the pro signing showed the wrong screen). Renamed, and the build now flags any
  top-level function declared twice.
- The comment lint read "; else" in a sentence as swallowed code: those comments are reworded.
- A player who never commits loses every offer by Signing Day (every program fills its class): by design, with a
  warning before each pull that stops the sims, and the roads of §2.6 after it.

## W3 (2.1) — 64 colleges and the College Browser

The third of the ten 2.1 milestones (§2.1). The college world is a registry of 64 programs (`160_colleges.js`), the
same 64 that play the national tournament; the screens that show it are `175_ui_colbrowser.js`. New test:
`tests/colleges.js` (14 steps). The recruiting game itself (interest that moves, actions, visits as scenes, commit
and flip, walk-ons, §2.2–2.7) is W4's: W3's interest is a first, static model and offers still come one a tier.

**The 64 programs.** Eight conferences of eight: the Premier Eight, the Crown and the Lakes & Pines (power), the
Coastal Valley and the Big Prairie (mid-major), the Heartland and the Old Mill (small schools) and the Laurel League
(elite academic). Each program has:

- a city and one of 14 invented states (a 100 × 60 map, 30 miles a unit: distances from your home state), colors (32
  pairs; a conference's eight never share), an arena, and a 16 × 18 pixel crest in its colors (the five blue bloods a
  crown, the Laurel League a book, the coast an anchor or a wave, the rest one of seven marks);
- a tier (blue blood, power, mid-major, small school, elite academic) and prestige 1–5★;
- academics: a GPA line (blue bloods 2.5, the Laurel League 3.3, everyone else 2.0) and the majors it offers (all
  three at power and academic programs, one or two elsewhere; Undecided everywhere);
- facilities (1–5★: the prestige, +1 at an academic program; your XP there +0/2/4/6/9%) and an NIL market (big for
  blue bloods and 4★+ power programs, small for small schools; your NIL deals ×1.3 / ×1 / ×0.8);
- history: national titles (blue bloods 3–8), pros produced and a rival school (the conference's pairs).

The 24 program names from before 2.1 are all in the table, so a save finds its program by name. A program name
that isn't (none of the fixtures; a hand-edited save) takes the place of the weakest program of a conference of its
tier, so its conference still has eight.

**Per career, from the seed (nothing saved but your program's coach and the titles won).**

- **The coach:** a name, a portrait, an age, a style (Pace, Defense, Development or Iso; it picks the extra work the
  coach adds after every game, as before: speed, hops or finishing; defense or strength; handles or shooting; any for
  a Development coach, who also adds XP +3%), a tenure (the first one has been there 1–12
  seasons). From a third season a coach can land on the hot seat (`colleges.hotSeat`, 15% a season; measured 16.7%),
  and half of those are let go after it (`colleges.fired`): a new coach starts at year one. Your program's coach stays
  while you play there (`c.cw.keep`; W4's coaching carousel can move them).
- **The roster you'd join:** seven teammates, seated the way committing seats you (who would be ahead of you, by
  how much). Committing now builds your team from this list, so the page's depth chart tells the truth.
- **The scholarship spots:** 1–3 for your class, and 1–3 more named recruits than spots. They commit through your
  junior and senior years, in order; the first to commit take the spots, the rest go elsewhere. An offer holds you a
  spot from the day it comes (a program that offers with none left makes one); a pulled offer frees it.
- **Interest in you (high school):** 0–100. `colleges.interest.base` (70) at the program's bar (the tier's offer cut,
  `hs.offerCuts` 71/64/57, or 48 for a small school; +1.5 a prestige star over the tier's usual), ±5 a point of your
  recruit score over or under it (projected for the years left, like the offers), your coach's word (±6 at trust 0 or
  100), +6 within 300 mi of home, −4 past 1,500 mi, at most 20 under its GPA line. A freshman is watched at most
  (49) and a sophomore contacted (69): the ten points under the cap take everything over it, so the order holds. The
  stages: Not interested, Watching (25+), Contacted (50+), Offer range (70+), Spots full, Offered.

**Offers.** As before, one a tier when your recruit score reaches its cut; now from the program of that tier most
interested in you (a little luck), and every offer carries its program: the id, the real colors, the coach's name and
the facilities. The academic offer comes from a Laurel League program at your level.

**On screen.**

- **The RECRUIT tab** (high school; between Team and Shop, keys 1–6): your recruitment (stars, national rank, class,
  GPA, offers, how many programs watch, contact and have you in offer range, home) and the six programs most
  interested in you; College Browser (gold), Offers & rank (Team → Recruiting before; the offer dot moved with it) and,
  at decision time, Choose your college. The phone shows two programs.
- **The College Browser:** filters (Conference, Tier, Stars, GPA: lines I meet, Miles: under 300 / 800 / 1,500,
  Interested in me in high school), six sorts (Interest, Name, Stars, Distance, GPA line, Conference), a name search
  (the on-screen keyboard; the city and state match too) and Clear filters; 8 programs a page on a desktop (crest, name
  and place, conference and tier, prestige and miles, interest and its stage), 3 on a phone with the filters on a sheet
  of their own. In college it's Team → Colleges (your program in gold; no interest).
- **A program's page:** the header in its colors (crest, name, place, conference, tier, prestige, arena), Coach,
  Academics, Campus, Depth chart (where you'd begin and the players ahead of you with their OVR), History and Your
  chances (the interest and its stage, a meter with the stage marks, the spots left and the one held for you, the
  recruits chasing them and who has committed). Previous / Next walk the browser's list; Rival opens the rival school.
  A phone shows one of three views (Your chances, Coach & school, Team & history).
- **The Codex:** a Colleges & recruiting page (the programs, interest, spots, coaches, facilities and NIL, with your
  values); ? on the Recruit tab, the browser and a program's page opens it.

**In the career.**

- Your college team is the program: the page's roster, the coach's portrait and name, its facilities in your XP
  (replacing R6's +3% a facilities star over one; a program from before 2.1 that isn't in the table keeps that), its NIL
  market on your deals.
- Your conference is the program's real one: its seven others are the conference schedule and the conference
  tournament (each the same player all season). Your story rival goes to your program's rival school (in your
  conference), or to the program you were both chasing (out of conference, you meet in a marquee game).
- **The national tournament takes all 64 programs.** Your résumé's national rank (among 350, scaled to the 64) sets
  your seed (rank ÷ 4, rounded up, in your region); the other 63 fill the seed lines by their season (tier, stars and
  luck); a program you already play brings the same player. Nobody is left out ("LEFT OUT" is gone; an old save that was
  keeps its screen). A national champion goes into the program's history.
- The transfer portal offers registry programs.
- The schedule's short names also drop "Institute" ("5. vs LARKSPUR INSTITUTE" was cut).

**Balance after W3.** The career simulator (200 typical careers, seed 1), college: the national tournament in 100%
of seasons (W2: 30%), 0.98 wins a trip (1.34), Final Fours 0.13 a career (0.07), national titles 0.03 (0.01), 2.47
college seasons (2.58), the season-end mock pick a median 36 (38); the first pro offer 1–5★ 29/39/24/8/2%.
`tests/difficulty.js` (600 careers a policy):

| Row | Typical: W2 → W3 (band) | Great: W2 → W3 (band) |
| --- | --- | --- |
| A 5★ team | 25.3% → 23.7% (15–25) | 75.8% → 79.5% (52–68) |
| Titles a career | 0.45 → 0.41 (0.2–0.4) | 2.21 → 2.48 (1–3) |
| Hall of Fame | 6.2% → 4.5% (3–8%) | 53% → 54.8% (30–40%) |
| A 3★ team | by 28 82% → 84% (50%) | by 24 94% |

The rows outside their bands are the ones W2 left outside (a better player's whole run, and the 3★ climb since W2's
trade offers); W6 retunes both policies against 2.1's §3.7 targets on the 16-franchise league, as planned.

**New and changed constants.** New: `colleges` (`mileUnit`, `facXp`, `devXp`, `nilMul`, `tierStars`, `interest`
{`base`, `perPt`, `prestige`, `smallCut`, `gpaCap`, `trust`, `near`, `nearMi`, `far`, `farMi`, `yearCap`}, `stages`,
`spots`, `chasers`, `commitFrom`, `hotSeat`, `fired`, `pageRows`). Removed: the old name lists (`AM_COLLEGES`,
`AM_CONF_EXTRA`, `CO_CONFS`, `colNames`) and `school.academic` (the three academic names). `amateur.recruit.facXp`
now applies only to a program from before 2.1 that isn't in the table.

**Tests.** New: `tests/colleges.js` (14 steps: the registry, crests, coaches, interest, the browser's list, the
browser on screen, a program's page, offers and spots, committing, the field of 64, old saves, the Recruit tab, the
Codex, phones). Updated: `flow` (the high school hub's six tabs and keys 1–6), `polish` (the offer dot on Recruit;
the ? key on all six tabs), `smoke` (the field of 64: a 1-12 team is a low seed, a 12-1 blue blood a top seed),
`school` (an academic offer is a Laurel League program), `phoneaudit` (twelve new cases: the Recruit tab, the browser
and the filtered browser, the filter sheet, a program's page and its three phone views, a blue blood's page, the
college Team tab, the browser in college, your own program). Quick checks this milestone: smoke (136), flow (12),
polish (14), school (8), staff (11), story (13), old saves (34), playtest3 (11), improve21 (13), colleges (14), the
phone and desktop audits (no flags), the difficulty table (above). The full suite runs once, at W10.

**Found on the way.**

- Two lines of code had been hidden behind a `//` comment on the line before them: the first-time Recruiting tip
  (since V5) never showed, and a high school playoff game on the hub read "GAME 11 OF 10 · AWAY" instead of its round
  ("DISTRICT SEMIFINAL", since R6). Both run again; the build's lint now also catches `if (...) return ...` and
  `return '...'` behind a comment. The College Browser and a program's page have a first-time tip of their own, and the
  hub's tips mention the Recruit tab and Study.
- A desktop's small text is the pixel font at about 12 px a character whatever its size: the new screens are laid out
  for it (the desktop audit cut the first layout's longer lines).
- A program from before 2.1 that isn't in the table: your rival now goes to one of its conference's others (a random
  program of the tier could be out of conference).

## W2 (2.1) — The playtest's improvements: teams come to you, effort matters, sim/play parity, money, GPA, leaving college

The second of the ten 2.1 milestones (§1.1–1.5 and §1.7; §1.6, the story's rate, goes with the story engine in W7).
New tests: `tests/improve21.js` (13 steps), `tests/parity.js` (§1.3) and `tests/effort.js` (§1.1, §1.2, §1.4: the
policy table). The career simulator gained `--menus=never`, `--week=rest|nostudy`, `--parity=n` and two JSON fields.

**Teams come to you (§1.1).**

- Free agency already brought three offers (yours, the best franchise your value reaches, one a star lower that starts
  you, and a fourth with a 3★+ agent). Its default (first in the focus order, gold) is now the offer with the most
  stars when it beats your franchise; otherwise yours.
- In the regular season, before the trade deadline, once your value is `franchise.offerBy` (3) over your franchise's
  bar and reaches the bar of a franchise a star up, that franchise calls: A TRADE OFFER, with ACCEPT THE TRADE (the
  default, gold) or STAY. Once a season. Accepting moves you with your contract and costs no hype (a trade you ask for
  still does); the news says the new club made the call. A 5★ franchise also wants the 5★ condition (a playoff series
  or an All-League team) and calls only into an open spot you'd win.
- §3.6 ("teams act when you cross a bar") decided the reading of §1.1's "3+ over your team's bar": with the bars 6
  apart, a call at +3 would have come from a franchise whose own bar you hadn't reached. The first version did that
  (a typical career's 5★ share rose from 21% to 31%); the bar rule brings it to 25–29%.
- A dialog card's default option is now drawn gold with dark ink (the option's flag never reached its button).
- **Test** (`tests/effort.js`, 200 careers): "plays well, never opens a menu" (every card takes its default button, free
  agency included; no trade requests, shop, staff or purchases) reaches a 3★ team in **100%** of careers (target 60%+).

**Effort matters (§1.2).** `tests/effort.js` prints the table (200 careers a policy, seed 1):

| Policy | Legacy (median) | A 5★ team | A 3★ team | Titles | Hall of Fame | OVR at 22 | Unspent |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Plays well + good choices | 105.6 (90) | 75% | 100% | 2.15 | 50% | 70 | 7% |
| Sims everything (trash talk, rest, summer jobs) | 36.9 (32) | 11% | 87% | 0.14 | 2% | 66 | 99% |
| Plays well, never opens a menu | 76.7 (67) | 59% | 100% | 1.33 | 30% | 70 | 100% |
| Typical, a smart spender | 45.6 (37) | 25% | 93% | 0.39 | 5% | 66 | 10% |

Legacy +186% (target +40% or more), 5★ 75% against 11%, titles 2.15 against 0.14. "Sims everything" is the
typical policy with trash talk, every week a Rest week, summer jobs, no spending, no gear, no trades and its own
franchise's offers.

**Sim/play parity (§1.3).** Your simmed points now come from models fitted to the engine with the AI at your
controls (the career's own match options, finalized like a played game: Legends View, the running clock):

- `league.ptsMe` (the pros: 3,840 sides of 1,920 career games) and `league.ptsMeAm` (high school and college: 1,800
  games, with a high school term), linear in both players' ratings and heights, × `league.styleMe` by play style (a
  post scorer × 0.93) × the game's minutes.
- The pro sim moves both scores by the same amount, so the margin and the winner stay the league model's. The amateur
  sim draws your points around the fit (`amateur.simNoise` 2.9 a game) and the opponent's from the same win odds as
  before (`amWinP`).
- `career.paceMul` 1.13 → 0.91: the pro sim's box scores ran 1.24× the engine's (9.5 a side against 7.7). Everything on
  `gameScale` follows (the league's box scores, grades, highlights, the press's big nights, college stock, the MVP race).
- Sim (SIM button) games of yours now play on Legends View like a played game (they played on the Classic court).

`tests/parity.js` (12 careers, seed 7; before each of the first 20 high school, 20 college and 40 pro games, the same
game played in the engine; 40 sim draws a matchup):

| Level | Games | Played | Simmed | Simmed/played (0.90–1.10) | W1's build |
| --- | --- | --- | --- | --- | --- |
| High school | 240 | 6.15 | 6.67 | 1.084 | 1.01 (your points were your team's: a win's 8.9, a loss's 5.1) |
| College | 213 | 7.28 | 7.17 | 0.984 | |
| Amateur, both | 453 | 6.68 | 6.90 | 1.033 | |
| Pro | 480 | 7.53 | 7.52 | 0.999 | 1.236 |

By play style 0.96–1.09. Games won (played / simmed): amateur 52% / 51%, pro 38% / 34% (the sims keep their tuned
odds). For information, the box scores (played / simmed, a game): rebounds 3.8/2.1 (high school), 3.4/1.7 (college),
3.2/2.1 (pros); threes 0.1–0.2 against about 0.5. §1.3 asks for points; the rest is noted for later (the traits'
deeds and the highlights are tuned on the sim's lines).

**The records book at the new scale** (`records.levels`; the holders keep their names). Each record is the higher of
two lines: the best game that 1–5% of 400 simulated careers (typical and great) beat, and the best single game in
the parity runs' engine games with the AI at your controls (about 6,500 for points, 930 for the rest). A simmed career now rarely breaks one (points in high school: 1–2.5%
of careers); a big night you play can.

| Level | Points | Rebounds | Steals | Blocks | Threes |
| --- | --- | --- | --- | --- | --- |
| High school | 21 → 18 | 9 → 10 | 3 | 3 → 2 | 3 → 2 |
| College | 21 → 20 | 6 → 9 | 2 | 2 → 5 | 3 → 2 |
| PBL | 31 → 20 | 12 → 9 | 4 → 3 | 2 → 3 | 4 → 3 |

**Money in the pros (§1.4).** Six big buys in the Front office's new Big buys tab (`pro.big`, 176_invest.js):

| Buy | Price | What it does |
| --- | --- | --- |
| A stake in your team | $12M a star of your franchise (from pro season 4) | 2% of it: a dividend of 4% of the price a season, worth +5% a season (+10% more in its title season); in your net worth |
| A private training facility | $25M | practice XP +8% for the rest of the career; $500K a season upkeep |
| Sneaker company shares | $10M a share, up to 3 | they move −30% to +45% of their value every offseason; sell them all when you like (the row opens Buy / Sell) |
| A home for your parents | $8M | a story card, confidence +3 and +0.15 every game week; in your net worth |
| A charity event | $1.5M, once a season | fame +4, hype +3 |
| Your name on the hometown arena | $40M | fame +8, legacy +3 (so toward the Hall of Fame) |

Each buy is a story card, a news line and a timeline entry. The career simulator's smart spender buys them (a home,
then a facility, a stake, a charity event a season, shares, the arena) and leaves **10%** of what it earned unspent at
retirement (W1's build: 26%; target under 30%). Per career: charity 9.1, a home 1.0, a facility 0.39, shares 0.75, a
stake 0.12, an arena 0.01.

**GPA (§1.5).**

- **Study** is the week's fourth plan in high school and college (Practice / Rest / Film / Study, GPA +0.3); the
  Rest-or-study screen is gone. The pros keep three.
- The hub warns under 2.3: an orange GPA pill ("GPA 2.25 · STUDY"), red under 2.0, first among the hub's pills on a
  desktop and a phone.
- The weekly drift stops at `hs.gpaFloor` (2.2): going to class keeps a C+. Careers that never study (`--week=nostudy`,
  24 careers) end at a median 2.20 (2.20–2.22; target about 2.0–2.5; it was 0.8 in the playtest). Exams still move it.
- A study sprint in the probation story raises GPA by 0.5 and it holds through the next report card (the drift waits
  under the floor).
- College AUTO now makes the week a Study week under 2.3, as it said (it practiced).

**Leaving college (§1.7).** Before the declare-or-return choice the screen shows your agent's advice and the projected
offers (the franchises, their kind, the money and the years). At OVR `college.readyOvr` (70) or more, or with 5★
interest, the headline says you're ready, the agent says "Teams would sign you now" and **Turn pro** is the default
(first, gold); otherwise the agent says what another year would buy and **Return** is the default. On a phone the two
choices sit side by side with their stakes (N★ offers, your college).

**Found by the quick checks.**

- careersim: a `//` comment added in this milestone swallowed the `--set` parser on the same line, so `--set` did
  nothing. Fixed; the build's check for code hidden behind a line comment now covers the tests too.
- story.js: a record's gold toast now draws only on a hub (W1, §1.11); the test drew it over the records book.
- The desktop audit: "✓ PRACTICE" was cut in the four-plan row (a done plan now drops the check mark before it is
  cut; the gold says done), and W1's facility lines were cut ("Training facilities ★☆☆☆☆ · practice XP +3%" on signing
  day is now "Gym ★☆☆☆☆ · …"; the Contract tab's line takes two lines). The phone audit: free agency's "Looking for …:
  you fit" was cut on narrow cards (it says "Needs …" or "You fit: …" there); the Codex's Big buys paragraph was split
  (a paragraph shows at most 6 lines). New audit cases: the Big buys tab, the shares chooser, the trade offer.

**Difficulty (V6, Part 2 §1.1) after W2.** `tests/difficulty.js` (600 careers a policy): typical 5★ 19.5% → 25.3%
(band 15–25), titles 0.37 → 0.45 (0.2–0.4), Hall of Fame 4.7% → 6.2%, a 3★ team by 28 72% → 82%; great 5★ 67.7% →
75.8% (52–68), titles 2.04 → 2.21, Hall of Fame 42% → 53% (30–40; over at W1 already). The trade offers move good
careers up sooner. 2.1 §3.7 sets new targets for the plays-well career (a 3★ team 60%+, a 5★ team 35–55%, 1–2
titles) on the 16-franchise league: W5 builds the league, W6 retunes both policies and updates the test.

**New and changed constants.** New: `league.ptsMe`, `league.ptsMeAm`, `league.styleMe`, `amateur.simNoise`,
`hs.gpaFloor`, `college.readyOvr`, `franchise.offerBy`, `pro.big` (`stake`, `facility`, `sneaker`, `family`,
`charity`, `arena`). Changed: `career.paceMul` (1.13 → 0.91), `records.levels` (the table above). Removed: the
Rest-or-study screen.

**Tests.** New: `tests/improve21.js` (13 steps, all pass), `tests/parity.js` (pass), `tests/effort.js` (6 checks, all
pass). Quick checks this milestone: smoke (136), flow (12), playtest3 (11), school (8), staff (11), story (13), old
saves (34), the phone and desktop audits (no flags). The full suite runs once, at W10.

## W1 (2.1) — Playtest round 3: the fixes (§1.9–12) and the game length (§1.8)

The first of the ten 2.1 milestones: the playtest's four fixes and the running clock. The test is
`tests/playtest3.js` (one step a fix, 11 steps); flow, smoke and traits were updated for the new scoring scale.

**The game length (§1.8): a running clock.** A timed game's clock now runs through made baskets, violations, fouls,
free throws, check balls, inbounds and the pace holds (bringing the ball up, a shot in the air, the rebound), until the
last `rules.runningStopS` (10) seconds of a period; there, and in overtime, it stops on dead balls as before (so the
end of a close game still plays out). Practice, the 3-point contest and the tutorial keep their own clocks. Measured
on 60 AI vs AI career games (the flow test's setup):

| One-minute career game | Real seconds (median) | Points a side | Possessions a side | Points a possession |
| --- | --- | --- | --- | --- |
| 2.0: the clock stops on dead balls and holds | 127.6 | 12.7 | 12.1 | 1.05 |
| 2.1: the running clock | 75.8 | 7.3 | 6.9 | 1.05 |

The playtest test's eight career games (other teams and seeds) take a median 72.5 s (69–91). The efficiency is unchanged; a minute just holds fewer possessions. The numbers fitted to the old scoring
scale with it (all ×0.57, the measured ratio):

- `career.paceMul` 1.98 → 1.13: what a career game scores against the old engine's per-minute points. Everything that
  scales by `gameScale` (the pro box scores, game grades, highlights, the press's "big night", college stock, the MVP
  race) follows it.
- `career.simWinPts` 16.0 → 8.9: a simulated amateur game's winner (the running clock's AI vs AI winner averages
  8.85 and the loser 5.67; the sim now gives 8.9 and 5.1). The pro sim's box scores average 10.6 a side (the flow
  test's 300 games; 18.5 at the old multiplier).
- `traits.thirdAt` 2,000 → 1,150 career points for a third trait; `traits.hotMakes` 8 → 5 and `traits.heatMakes`
  10 → 6 made shots for a hot game and a heat-check game.
- Still on the old scale: the records book's level records (21 points in high school, 31 in the pros). W2 re-derives
  them from simulated careers along with the sim/play parity (§1.3), which also settles the player's simmed points.

**Sim buttons with a choice waiting (§1.9).** With your summer, tryouts, the combine or a decision waiting, the hub's
"Sim to next big moment" and "Sim the rest of the season" are greyed out and say why ("Pick your summer first",
"Finish tryouts first", "Go to the combine first", "Make your decision first"). A sim started anyway goes back to the
hub, so "0 weeks simmed" can't show.

**The All-Star 3-point contest is one attempt (§1.10).** No career game's pause menu has Restart or Quit (the contest's
had both); leaving the contest keeps the score you had; the weekend screen shows "YOUR SCORE: n · 2nd of 4" where the
Play button was.

**Records show once, on the hub (§1.11).** A NEW RECORD toast waits in a queue until you're back on a hub (high school,
college or pro; not during a game or a screen change), shows once at its foot (above the phone's tab bar), and is never
drawn over another screen: dialogs, events, ceremonies, the press, the pro offers, signing day and the shop header are
clear of it (part of §1.12).

**Still open from the last playtest (§1.12).**

- The Road to the League banner: on a desktop's short banner the title and NEXT share the first row and the
  explanation takes the second; the phone keeps three rows. No two rows come within 3 px.
- The trading cards' names: a long name first shrinks (to `ART.cardNameMinK`, 70% of its size), then takes two lines
  (SAOIRSE / MCKENNA), then shortens (S. MCKENNA, then MCKENNA), then splits the last name (MCKEN- / NA, at double
  letters or a syllable-like break); a cut (`…`) is only the last resort on very small cards. The band grows to hold
  the name and the sub line, and the sub goes when they don't both fit (no more "ROOKIE" over "Central T…"). The tier
  label shows only where it clears the OVR badge.
- The phone hub's matchup: the pills, both heights and the height gap moved to the middle column, so the two cards
  grew from about 93×130 to 131×184 (UI px). Every one of the 172 last names in the name pool now fits uncut at the
  phone's text floor (2 and 2.5 UI px a font pixel), with a 9-letter first name.
- A benched player's matchup: the height under the left card is the starter's (it was yours) and the gap chip says US.
- Facilities: every franchise's gym now pays practice XP by its stars, `franchise.facXp` (it was `career.facilityBonus`
  × the old facility level, which gave 1★ and 2★ clubs, most of a rookie's offers, +0%):

  | Stars | 1★ | 2★ | 3★ | 4★ | 5★ |
  | --- | --- | --- | --- | --- | --- |
  | 2.0 | +0% | +0% | +10% | +10% | +20% |
  | 2.1 | +3% | +5% | +8% | +11% | +15% |

  The offers, the team's office, the teams table and the franchise screen show it with the stars (★★★☆☆).
- Skills stop at 95 for everyone: league players', rivals' and All-Star shooters' Shooting, Finishing, Handles and
  Defense (and their ceilings) are capped at `amateur.genes.skillCap` like yours (physical ratings keep 99). An old
  save's players over 95 are clamped on load.

**Found by the quick checks.** Esc pressed while a game is still warming up (V15's Warming up bar) was dropped, so
the pause menu didn't open (smoke caught it with the machine busy). The press now waits for the game's first frame and
opens the pause menu then.

**New and changed constants.** New: `rules.runningClock`, `rules.runningStopS`, `franchise.facXp`,
`ART.cardNameMinK`. Changed: `career.paceMul` (1.98 → 1.13), `career.simWinPts` (16.0 → 8.9), `traits.thirdAt`
(2,000 → 1,150), `traits.hotMakes` (8 → 5), `traits.heatMakes` (10 → 6). Removed: `career.facilityBonus`.

**Tests.** `tests/playtest3.js` (new, 11 steps, all pass; the last one is the warm-up pause). Quick checks this milestone: flow (its pace step now checks
6–10 points a side, the shot clock waiting through the bring-up, the game clock running through it until the last 10 s
and waiting there; the sims at the new scale), smoke (the pro sim's 5–13 a side; the pause step waits out the warm-up), traits (comments), phoneaudit. The full suite runs
once, at W10.

## V15 — The loading lag: bakes ahead of time, off the main thread, kept for the session

A follow-up to 2.0: the freezes on loading. Measured with Chrome's CPU throttled 4× (phone speed) and a long-task
observer, the request listed 5.9 s of blocked main thread at startup (the longest task 0.5 s), a 1.07 s freeze from
the menu into career creation, 2.1 s loading the tryout shootout and 2.0 s loading a Quick 1v1, 0.4 s on the Quick 1v1
setup, and 50–150 ms on the events, tips, league, franchise and staff screens. A game load's profile: drawImage
0.8–1.3 s, pixelizeOut about 0.4 s, getImageData about 0.35 s, rtSnapLayer 0.1–0.3 s, rtCrop 0.13–0.2 s, rtVenueBakes
0.13 s, getContext 0.11 s and up to 0.18 s of garbage collection.

**The test.** `tests/loadlag.js` walks the game at 4× (and 1×) CPU in one browser: startup, career creation, the high
school events and dialogs, tips, the hub's tabs, the Codex, the tryouts (the shootout and the 1v1), a high school
game, the league, awards night, the press, the combine, the offers, signing day, the pro hub's tabs, the league, a
franchise, staff, a pro game and its result, the main menu's screens and a Quick 1v1. A step is the press of a button
through the screen it opens; a game load is the press of PLAY through the game's first frame (a "Warming up..." frame
doesn't count) and 2.5 s of play. It prints a table (the first frame, the longest task, the blocked time and the tasks
of each step) and fails on any miss:

- 4×: no task over 100 ms on a screen change; a game's first frame within 300 ms of PLAY and no task over 100 ms after
  it; the title within 1.5 s of navigation, and under 1.5 s of long tasks before the menu responds.
- 1×: no task over 50 ms anywhere.

**The results** (`tests/loadlag.js` on this host, desktop 1280×720; V14 is the 2.0 build run by the same walk; "< 50"
is no task long enough for the long-task observer, which reports tasks over 50 ms):

| Steps (how many) | The longest task at 4×, ms: V14 | V15 | At 1×, ms: V15 |
| --- | --- | --- | --- |
| startup (2) | 577 | 133 | < 50 |
| creation (5) | 1321 | 101 | < 50 |
| events (7) | 186 | 70 | < 50 |
| dialogs (14) | 382 | 71 | < 50 |
| tips (4) | 638 | 58 | < 50 |
| hub tabs (10) | 288 | 137 | < 50 |
| screens (22) | 393 | 87 | < 50 |
| league (4) | 193 | 59 | < 50 |
| awards (4) | 163 | 69 | < 50 |
| press (6) | 219 | 58 | < 50 |
| offers (1) | 653 | 62 | < 50 |
| signing day (2) | 351 | 76 | < 50 |
| franchise (2) | 186 | 52 | < 50 |
| staff (2) | 236 | 69 | < 50 |

| Game load | First frame at 4×, ms: V14 | V15 | The longest task after it at 4×, ms: V14 | V15 | At 1×: the longest task, ms |
| --- | --- | --- | --- | --- | --- |
| tryout shootout | 1662 | 122 | 627 | 66 | < 50 |
| tryout 1v1 | 1413 | 73 | 486 | 55 | < 50 |
| high school game | 1458 | 75 | 513 | 50 | < 50 |
| pro game | 2288 | 145 | 748 | 60 | < 50 |
| Quick 1v1 | 1744 | 79 | 536 | < 50 | < 50 |

Startup at 4×: the title at 0.96 s (V14: its splash at 1.0 s, the title at 2.7 s) and 0.80 s of long tasks before the
menu responds (V14: 1.8 s); at 1×, the title at 0.20 s and no long task. The table is the walk's run on the final
build: 2 of its 90 steps missed at 4× (creation's face and accessories page, 101 ms; the pro hub's Train tab, 137 ms)
and none at 1×. Over the last eight runs of the walk (six whole walks and two of the pro part, on the final build and
the few before it) a run missed 0–2 steps at 4×, a different step each time (the offers twice, the tryout shootout's
load twice, creation twice, two hub tabs, a dialog), 1–22 ms over but for the Train tab's 137 ms; one 1× run missed
once (a 74 ms task as a tip closed); two runs had no miss. The test fails on them, as it should: they're the margin
still to win on this host (see the limits below). V14 missed 55 of the 90 steps.

**Where the time went.** Chrome draws a canvas's pending drawing the first time it's used as an image, so "drawImage"
was mostly the rasterizing of pictures painted moments before: a venue's layers, each fan of the crowd, the faces, the
players' poses, the menus' figures and portraits. Then the pixel passes read the pictures back (getImageData) and
reduced their colors (pixelizeOut, rtSnapLayer); rtCrop read a whole rim layer to find its box. Every bake made new
canvases (getContext, and the garbage collector's finalizers later). And nothing was kept: a game rebaked its venue
and both players from scratch, every screen change painted its panels, buttons, portraits and text again, and the
title waited behind the splash, the menus' text strips and the crowd's pictures.

**What changed (the request's eight fixes).**

1. **Venue bakes are cached** (rtVenueBakes, rtSnapLayer and rtCrop's output: a venue's layers, its rims and its fans'
   atlases) under the venue, its colors, the camera's scale and the screen's size, up to `CONFIG.bake.venueMB` of
   pixels (64 MB; 32 MB on a touch screen), the least recently used venue first out. A venue is baked once a session.
2. **A game's bakes are made ahead of time, off the main thread.** A bake worker (this page's own code in a Web Worker
   on OffscreenCanvas: every painter and constant is the same code) plays the next game's first second from its final
   options when the hub, the scouting card, the tryout card or the Quick 1v1 setup opens, and sends back the venue,
   both players' faces and opening poses, the ball's frames and the portraits of the score bug and the jumbotron. They
   go into the main thread's caches under the same keys, so the game's first frame finds them all. The main thread's
   part (posting the jobs, installing what comes back) runs in slices of at most `CONFIG.bake.sliceMs` (6 ms) a frame;
   idle work goes through requestIdleCallback (without it, one queued step every third frame). PLAY starts at once
   when the bakes are in; when they aren't, a short "Warming up..." bar shows instead of a freeze. If the worker is
   still not done after `warmMaxS` (4 s), or has gone, the rest is baked on the main thread behind the same bar, a
   slice a frame (it used to be all at once: a 2.6 s frame at 4×). Two workers share the jobs: one for games (venues,
   poses, the offers' title odds), one for the menus (text, panels, buttons, portraits, figures), so a menu's pictures
   never wait behind a venue.
3. **Players' pixel sprite sheets are kept across games** under who they are and what they wear (the look with its
   gear, the size, the age, the kit, the pixel size). Yours stays for the session; an opponent's for the career week
   it was played in (`sheetN`, 6, outside a career). A new look or new gear is a new sheet.
4. **Less getImageData.** A rim's crop finds its box on a copy `rtCropK` (8) times smaller first. Pixelize already
   shrinks first (a box filter into a small canvas) and reads back only the small copy. The color reduction (pixelize,
   the bake snap) runs in the worker with the rest of the bake. Without Worker or OffscreenCanvas (`?nobake` forces
   it) the same bakes run on the main thread as steps behind the Warming up bar, `warmSliceMs` (24 ms) of them a
   frame: each layer's paint, every 16 rows of a snap, the crowd's sheet a fan at a time, each fan atlas a pose at a
   time, a face at a time, a ball frame at a time.
5. **Canvases are reused**: a bake's scratch canvases come from a pool of `cvPoolN` (6), and the worker paints every
   picture it sends into one OffscreenCanvas (sending it as an ImageBitmap empties it).
6. **Career creation.** Portraits are cached by their face settings (`rtPortraitN`, 240, least recently used first; it
   used to empty itself at 160) and baked by the worker; a screen draws a placeholder silhouette until a picture
   arrives, and it fades in (`fadeMs`, 160 ms).
7. **Startup.** The title shows at once (the R10 boot splash is gone: the title's own logo drop is the intro). The
   workers start once the title is up; the menus' usual text styles are prepared while the title waits; a crowd's
   sheet is painted only when a game needs it (a game whose venue came from the worker never does). The Art Lab
   already built nothing until it's opened (the dev menu, or `?artlab`), and still doesn't. The page's code is cut
   into 13 `<script>` elements in the one `index.html`, so the browser compiles and runs it as 13 tasks (as one 2.4 MB
   script it was a 130–170 ms task at 1×).
8. **Screen changes.** Panels and buttons are drawn from pictures made once (`uiPanelCacheMP` 8 and `uiBtnCacheMP` 3
   million pixels kept), by the worker for a new size; still parts of a screen (the press room's wall and table, the
   stage of a ceremony, the rival card's glows) are one picture each (`uiLayerN`, 6); text is drawn from per-string
   atlases the worker makes in batches (`rbAtlasN` 1,500 strings, `rbAtlasBatch` 80 a batch) or, the first time,
   straight from its style's glyph strip; paragraphs keep their line breaks; the backdrop is kept at the screen's size
   (`uiBackScaled`) and pre-dimmed under an overlay; a screen that paints all of itself gets no backdrop under it; an
   overlay on a paused or finished game draws the game's last frame as one picture; the offers' and the hub's title
   odds are simulated in the worker.

**A screen's first frame is drawn before it shows.** A pushed screen's first frames only show the old one fading out,
and an overlay now shows a frame later: in that frame the new screen is drawn once into a clip of no size, at its
settled scale (uiPrepPass). Its new strings, panels, buttons and portraits are asked of the worker then, its
paragraphs measured and any new text style's glyph strip made. A still layer it needs (a stage, the rival card's
glows) is only noted, and painted in the next frame, one a frame. Then the transition waits at its start, the old
screen still up, until those pictures are back, at most `uiPrepWaitMs` (180 ms), so the first visible frame draws them
from their pictures instead of a letter at a time. A screen gone back to gets the same pass (its pictures may have
left the caches), and so does a screen first shown under an overlay (the press room under its tip), once the overlay
has settled. In the menus, closing an overlay now pops the screen under it in like any other screen change (it wasn't
drawn under the overlay, so it used to appear at once, all of it in one frame). The Codex measures its other topics in
slices of `sliceMs` a frame (one whole topic a frame was up to 88 ms at 4×). During a transition the old screen's
picture is only drawn while it shows (not under 4%), and the backdrop not under it while it's opaque: each is a
full-screen layer, 10–30 ms of raster at 4×. A number's first `toLocaleString` (the Codex's money page, school, the
records) loads the browser's number formats, 10 ms at 1×; that's done while the title waits. Together, in single
traces at 4×: the hub's Me tab (it shows money, so it met the number formats first) went from a 145 ms task to 70 ms,
and signing day to the pro hub (the rival card) from 104 ms to 58 ms.

**The end of a game over several frames.** The frame that ended a game also ran the career's week and the save, built
the result screen and drew it for the first time: 120–130 ms of JS at 4× after a pro game. Now the last frame is drawn
and kept as a picture; the next frames show that picture while any poster cards are built (one a frame) and the
result's bookkeeping runs; then the result screen opens over it and, like any overlay, is drawn once unseen and shows
when its pictures are back. In the walk at 4×, a pro game's end to its result screen went from a 102 ms task (944 ms
of long tasks) in V14 to at most 60 ms in the last three runs.

**Other changes.** A game's first frames spread their work: the scene, then the score bug, then the rest of the HUD
(`rtOpenWait`, 2); the worker also plays each game's first 5 s twice (you waiting, then you on the AI: `rtDryPoses`,
`rtDryAiPoses`, 300 frames each) so the opening's poses are painted there. The frame guard's hold starts after the
Warming up bar (a slow warm-up isn't the game's speed). The frame guard's last level now turns on the pixel renderer's
every-other-frame sprite reuse too, as it already set the pose rate and the split paints: that reuse waited for the
pixel guard alone, which measures the main thread's pose painting, and with the poses coming from the worker it often
never got there (perf4x on the phone: the pixel guard stepped down late or not at all). Found by the suite: the
3-point contest's Try again crashed (it reused the last contest's state, with its shots and players in it, and the
game's new copy of its options for the bakes can't copy a loop): a new contest starts from a fresh state, as START
gives it, and the copy leaves a loop out instead of throwing. The Art Lab's Retro check read a sprite's pixels as a
canvas's, and a sprite from the worker is an ImageBitmap: it reads either now.

**The in-game frame rate** (`tests/perf4x.js`, the device clock at 4×: a live pro-arena 1v1, 5 forced dunks and 3
forced blocks; V15 and V14 run back to back on the same quiet machine, twice):

| | V15, phone | V14, phone | V15, desktop | V14, desktop |
| --- | --- | --- | --- | --- |
| Median frame (target ≤ 25 ms) | 20.8, 21.4 ms | 19.8, 19.5 ms | 18.6, 20.3 ms | 18.3, 18.1 ms |
| Frames over 50 ms in dunks, celebrations and blocks (target 0) | 2, 3 | 3, 2 | 3, 3 | 2, 2 |
| The worst of them | 54, 56 ms | 69, 72 ms | 116, 60 ms | 53, 52 ms |
| The frame guard's first shed (target ≤ 0.5 s) | 0.15, 0.17 s | 0.20, 0.17 s | 0.18, 0.17 s | 0.15, 0.17 s |

V15's median frame is about 1 ms higher (5–8%). Part of it is text: a string drawn from the worker's atlas costs a
little more than one from its own small canvas (the HUD's text, about 0.3 ms a frame at 4×); the rest is within the
runs' spread. The worst frames and the guard are the same. Neither build meets perf4x's targets on this host: V14's
report already found that this host runs V2's own build about twice as slow as when V2 was committed.

**New numbers** (no spec value; every one in `CONFIG.bake` or `ART` with a comment):

| Number | Value | What it is |
| --- | --- | --- |
| `CONFIG.bake.sliceMs` | 6 ms | main-thread bake work a frame at most (installing what the worker sent, idle steps, the fallback's slices in a game) |
| `CONFIG.bake.inFlight` | 2 | jobs at a worker at once (the queue stays on the main thread, so a picture on screen jumps the pre-bakes) |
| `CONFIG.bake.fadeMs` | 160 ms | a picture that arrives after its placeholder showed fades in over this long |
| `CONFIG.bake.figN` | 64 | menu figures kept (least recently used first out) |
| `CONFIG.bake.bootMaxS` | 8 s | a worker that hasn't said it's ready by then is given up (the main thread bakes) |
| `CONFIG.bake.warmMaxS` | 4 s | the Warming up bar waits at most this long for a game's bakes; then the game bakes the rest itself |
| `CONFIG.bake.warmSliceMs` | 24 ms | without a worker, a game's bakes run this long a frame behind the Warming up bar |
| `CONFIG.bake.venueMB` / `venueMBPhone` | 64 / 32 MB | the venue cache's pixels (desktop / touch screen) |
| `CONFIG.bake.sheetN` | 6 | sprite sheets kept for players outside a career week |
| `ART.rbStripCols` | 16 | a text style's glyph strip: letters a row |
| `ART.rbStripMaxK` | 120 (thousand px) | a size whose strip would be bigger has none: its strings are painted from their letters' runs |
| `ART.rbAtlasN` | 1,500 | strings kept in the workers' atlases |
| `ART.rbRunsMax` | 4 | a string this short in a style with no strip yet (a jersey letter or number) is painted from its runs |
| `ART.rbAtlasBatch` | 80 | new strings sent to the worker in one batch (one atlas) |
| `ART.rtPortraitN` | 240 | pixel portraits kept (it used to empty itself at 160) |
| `ART.figCelFps` | 12 | a celebration in a menu (the shop's preview) is pictured at this many frames a second |
| `ART.rtOpenWait` | 2 | a game's first frames under its opening wipe paint no player |
| `ART.rtOpenPoses` | 60 | frames of a game's opening the worker plays to paint both players' first poses |
| `ART.cvPoolN` | 6 | scratch canvases kept for the next bake |
| `ART.rtCropK` | 8 | a rim's crop finds its box on a copy this many times smaller first |
| `ART.rtDryPoses` / `rtDryAiPoses` | 300 / 300 | frames of the opening the worker plays again (you waiting, then you on the AI) for the first seconds' poses |
| `ART.uiPanelCacheMP` / `uiBtnCacheMP` | 8 / 3 million px | pictures of panels and buttons kept |
| `ART.uiLayerN` | 6 | still layers of screens kept |
| `ART.uiBackScaled` | on | the pixel backdrop kept at the screen's size (one 1:1 blit a frame) |
| `ART.uiPrepWaitMs` | 180 ms | a screen change waits at most this long for the new screen's text, panels and buttons |

Removed: `CONFIG.polish.splashS` (1.8 s) and `splashReduceS` (0.8 s), with the boot splash.

**Deviations and known limits.**

- This host's headless Chromium has no GPU, so a canvas's drawing is rasterized on the main thread at the end of each
  frame (Chrome's ProduceCanvasResource): 25–60 ms of every menu frame at 4×, counted in the test's tasks. In desktop
  Chrome and on phones that work runs on the GPU, off the main thread, so the margins here are tighter than on a
  device.
- The walk's step times vary by about ±30 ms between runs; steps that run 85–100 ms at 4× (a game's first frame aside)
  can tip over in an unlucky run. The last runs before the commit are in the results above. A hub tab switch is among
  the tightest: it has no transition, so no dry pass, and in a trace of the pro hub's Train tab its first frame was 45
  ms of canvas raster and 28 ms of JS at 4×.
- A screen change now waits up to `uiPrepWaitMs` (180 ms) for its pictures before the new screen pops in (usually
  50–100 ms at 4×, a frame or two at 1×); an overlay shows two frames later; closing an overlay pops the screen under
  it in.
- Without a worker (old browsers; `?nobake`), a game's first frame at 4× takes 148 ms (it was about 1 s) and the
  Warming up steps stay under about 55 ms each, but menus draw new text a letter at a time until their pictures are
  made on the main thread: the test's targets are for the worker path.

**Tests.** `tests/loadlag.js` is new (above). `tests/perf4x.js` plays its game in one long script with no break, so
the page's event loop never ran and the bake worker's pictures could never arrive: V15's game sat behind its Warming
up bar for 4 s and then baked on the main thread mid-measurement (a 2.6 s frame). The test now waits out the Warming
up bar as a player would, stops the game's own frame loop, and lets the event loop run every 8th frame (unmeasured),
so the worker's later pictures (the frame guard's lower resolution) arrive as they do in play; V14 runs the same test
the same way. The smoke test's boot splash step and the phone audit's splash screen are gone with the splash.
`tests/check-syntax.js` checks all of the page's `<script>` elements as one program. In `tests/lib.js` a screenshot
waits for the pictures the bake worker is still painting (up to 8 s), a test can set its page up before it loads
(`before`: the CPU throttle, observers), and `CHROMIUM_ARGS` passes extra browser flags. The smoke test's posterizer
step drives frames by hand: it waits out the Warming up bar first, as perf4x does; its legends view step reads a
sprite's pixels with the Art Lab's reader (a canvas or a bitmap); and the phone's frame guard step gives the switch to
the smaller world up to 5 s (it waits for that world's bakes from the worker; it was read after 0.4 s). The polish
test's stacked screens step allows the screen under a menu overlay one unseen dry pass (its pictures, asked for once)
and still fails on any visible draw of it, or a second pass. Because a screenshot waits for the worker's pictures, the
Art Lab's in-game shots are taken a few seconds later than V14's on a game the test has paused (its callouts still
age): V14's arena shots caught an ANKLES callout and V15's don't. In play the callout draws as before (checked live:
on screen 250 ms after the ankle breaker).

**The suite** on the final build, all passing: smoke (136 steps), every mode (13), old saves (34), the dev tools, the
phone audit (250 cases), the Art Lab (58 shots, no errors; `shots/v15/round-final/`), the §2 gate, the balance
harness, the career simulator (40 careers, its targets met) and trait balance (every rarity in its band, rising with
rarity); the V15 extras: the 2.0 fixes (15), polish (14), the HUD audit (35 scenes, none flagged), steals, the full UI
career and Jump to pro on a desktop and a phone, flow (12), gameplay (12), traits (9), the shop (10), pro teams (14),
the story (13), school (8), staff (11), the climb (9), and the overflow audit at 1280×720, 1.25× text on a phone and a
desktop, 1920×1080 and 800×1000 (every string at least the menus' pixel on 248–249 screens). Screenshots in
`shots/v15/`: the title at once, the Warming up bar (no worker, 4×), a result fading in over the game's last frame,
and the result.

## Hoop Heads 2.0 (V1–V14): the report

Two specs, built together: "Hoop Heads 2.0" and "Hoop Heads 2.0, Part 2: harder climb, real story, school, shop,
staff, pro teams" (where they overlap, Part 2 wins). Fourteen milestones, V1–V14, a commit each. Before every commit:
the whole suite (smoke on desktop and phone, every mode, old saves migrated and never wiped, the dev tools, the
overflow audits, the Art Lab, the §2 gate, the balance harness, the career simulator, trait balance and each
milestone's own tests) and screenshots, looked at. The rules held throughout: one `index.html`, renderers never
throw, old saves migrate, the career is 1v1 only, every league and team name is invented (the Pro Basketball League,
the PBL), and the story stays PG. The version is 2.0 (the title screen and the credits say so), and What's new in 2.0
shows once.

| The spec | Milestone | What changed |
| --- | --- | --- |
| 2.0 §1, the must-fix bugs (items 1, 3–12) | V1 | Steals count only when the defense secures the ball (STEAL, or a grey POKED); one low rack stands behind the 3-point shooter; the press answers fit at both text sizes; every generated player rolls one trait at your odds; simmed box scores add up; no cut text; no screen bleeds through another; recruiting cards, Negotiate, Signing Day and a benched season's recap fixed. Each has a test. |
| 2.0 §1, item 2: the lag | V2 | At 4× CPU throttling the median frame went 32 → 14–15 ms (phone layout) and 40 → 12–14 ms (desktop) in V2's runs; the frame guard sheds within 0.2 s (it took 2.3 s). |
| 2.0 §2, traits | V3 | Rarer is stronger (Common about +5–8%, Legendary about +30% or game-changing; small downsides, a Legendary's only flavor); Bronze, Silver and Gold levels earned by doing the trait's thing; a third trait at 1,000 career points; one card layout everywhere; the Codex's Traits page; the in-game banner and the results summary. |
| 2.0 §3, gameplay | V4 | Opponent scouting (a personality and four tendencies the bots play to, a weakness and a tip), the season's Boss, signature moves at 70 and 80, shot feedback (the release timing and the make chance), a practice shot chart, defense feel (a contest ring; sounds for a poke, a steal, a block and a perfect release), phone buttons of 80 px, a next-basket overtime in every ruleset. |
| 2.0 §4.1, 4.2, 4.6–4.8 and §5's hub | V5 | Pace in one-minute career games, the week (rest when tired, the press after big games only), playing time (challenging the starter, spot starts, trades after bench weeks), the Road to the League, Sim to next big moment and Sim the rest of the season, Quick results, the five-tab hub with a calendar and red dots, and the PBL. |
| Part 2 §1, a harder climb | V6 | The XP curve (20 × 1.11^(rating − 40) a point), hidden potential (×3 past it), XP by grade, simmed games at half, a weekly practice cap, slumps and injuries that cost points, and scarcity; tuned until the §1.1 table passed on both policies. |
| Part 2 §2, the story | V7, V8 | The saga: fifteen arcs over three acts (6–8 a career), a cast with meters, flags that carry choices forward, cutscene backgrounds, six endings and the Story so far; 2.0 §4.9's ceremonies (awards night, the All-Star reveal, a Hall of Fame induction), the record book and 96 story templates. |
| Part 2 §3, school | V9 | One GPA from high school through college: exam weeks, eligibility, offers with GPA lines (elite academic programs 3.3), scholarships, tuition and student loans, majors and a degree that change the ending, Academic Probation. |
| Part 2 §4, staff | V10 | Six roles (agent, skills coach, strength trainer, physio, nutritionist, mental coach), 1–5★ by your fame, salaries, personalities, two-season contracts, buyouts, a rival club's call and a shady agent's scandal. |
| Part 2 §5 and 2.0 §4.3, the shop and money | V11 | Gear in slots, common to epic with levels, never more than +4 to a rating; signature collabs from the Road; a weekly stock in three storefronts with keepers; try-on and the locker; gear drawn on the player; consumables, a lifestyle and family help. |
| Part 2 §6 and 2.0 §4.4–4.5, pro teams | V12 | Twelve franchises with an identity (city, crest, owner, coach, market, fans, history, rivalries), team strength and title odds, top-8 best-of-3 playoffs and a Finals MVP, a parade, the ring and the banner, dynasties, owners' moves (a rebuild can trade you), the 5★ spots' scarcity, distinct offers, the combine's reveal, Commitment Day and Signing Day. |
| 2.0 §5–6, UI and content | V13 | The Codex from every screen, stat tooltips with a link, red dots, What's new in 2.0, a legibility floor of 10 internal pixels, six new celebrations, a new arena at every level, more names and looks. |
| 2.0 §7, Part 2 §7–8: balance, tests, release | V14 | Balance (the Slasher's drives into the style mix's band, the shake tendency back over its bar), the dev menu's Jump to pro and a full career through it, the overflow audit at two more window sizes (three V13 regressions fixed), the full suite, version 2.0, the README, and the republish. |

### The tables (Part 2 §7: print every table)

**Difficulty: the §1.1 table** (`tests/difficulty.js`: the career simulator, 600 careers per policy over seeds 1–3, 200
each; 0 stuck). "Typical" makes sensible choices and sims its games. "Great" plays every game (no simmed-game cut), with
an edge of 2.5 OVR in its box scores and depth-chart games, and takes the strongest college offer short of a blue
blood's bench.

| Milestone | Typical: target | Typical: measured | Great: target | Great: measured |
| --- | --- | --- | --- | --- |
| Makes varsity | sophomore or junior (freshman 20–25%) | ✓ freshman 22%, median year 2 | freshman | ✓ freshman 56% |
| Recruit stars at graduation | 2–3★ | ✓ 2–3★ 80%, median 3★ | 4–5★ | ✓ 4–5★ 65%, median 4★ |
| Starts in college | year 2–3 | ✓ year 2–3 93%, median year 2 | year 1 | ✓ year 1 87% |
| First pro offer | 1–2★ or undrafted | ✓ 1–2★ 82%, median 2★ | 3★ | ✓ median 3★ |
| Reaches a 3★ team | by 26–28 in 50% | ✓ by 28 69%, median age 26 | by 24 | ✓ by 24 83% |
| Reaches a 5★ team | 15–25% (was 55–65%) | ✓ 16.3% | about 60% | ✓ 65.0% |
| Championships per career | about 0.3 | ✓ 0.31 | 1–3 | ✓ 1.71 |
| Hall of Fame | 3–8% | ✓ 3.8% | about 35% | ✓ 37.2% |

By seed (1 | 2 | 3): a 5★ team, typical 17.5% | 13.0% | 18.5%, great 63.5% | 60.0% | 71.5%; titles, typical 0.28 |
0.24 | 0.40, great 1.86 | 1.42 | 1.86; the Hall of Fame, typical 3.5% | 3.5% | 4.5%, great 40.5% | 28.5% | 42.5%.
"About" is read as 52–68% (a 5★ team), 0.2–0.4 titles and 30–40% (the Hall of Fame), as in V6.

**XP stays hard (2.0 §7).** Each +1 costs 20 × 1.11^(rating − 40): 40 → 60 is 1,284 XP, 60 → 70 2,696, 80 → 90 21,739
(8.1×); past your hidden potential ×3. In 400 typical careers (`careersim.js 400 1`) the median OVR at 17 / 21 / 25 /
29 is 56 / 64 / 68 / 70 and the median peak 70 (64–79); in 400 great ones, 58 / 68 / 73 and a peak of 75.

**Story** (`tests/story.js`, 13 of 13; the career simulator, 400 careers a policy):

| Check | Target | Measured |
| --- | --- | --- |
| Arcs per career | 6–8 | typical mean 6.41 (6–8 in 85%), great 6.40 (85%); the careers with fewer are mostly short ones, with fewer act III seasons (as in V8) |
| Arc frequency | none above 70% | typical: the owner 62%, the booster 60%, contract year 59%, the bills 59%, the trade demand 58%, … the Finals rematch 4%; above 70%: none. Great: the owner 62% at most |
| Every epilogue reachable | all six | ✓ Passing the Torch, The Legend, Two Old Rivals, Home, The Long Road, The Work (each reached in the test; the simulator's default answers reach The Long Road 74%, The Work 23%, The Legend 3%; the great policy The Legend 38%) |
| Flags persist through a save and a reload | yes | ✓ meters and flags survive a save, a reload and the handoff to the pros |

**GPA** (`tests/school.js`, 8 of 8):

| Check | Measured |
| --- | --- |
| Offers depend on GPA | ✓ 1,008 offers: none under its program's line (blue bloods 2.5, elite academic programs 3.3, the rest 2.0). Offers by GPA: 0 at 1.7, 120 at 2.1, 140 at 3.29, 174 at 3.3 and up. An elite academic offer never appears under 3.3 |
| A report card under a line pulls that offer | ✓ only that program's (the elite academic one at 3.2, a blue blood at 2.4, everyone under 2.0) |
| Eligibility | ✓ a report card under 2.0 sits 2 games in high school and in college; under 1.5 in college opens Academic Probation (risk it, still under 2.0: the scholarship goes and 2 more games) |
| Exam weeks | ✓ midterms after the fifth game, finals before the last; Cram 2.75 → 3.05, Skip 2.85 → 2.65 |
| Tuition is charged | ✓ a full ride (3.5 and four stars) pays nothing; partial pays $6,000 at each college season's start; a lost scholarship $12,000; a $40,000 loan: $25,000 paid at the draft, $15,000 from pay. In 400 typical careers: tuition paid $16,275 on average, a loan at the draft in every one (median $14,260) |

**Staff** (`tests/staff.js`, 11 of 11; `tests/staffbalance.js`, 400 careers × 3 seeds a run):

The great policy (judged; 1,200 careers a row, the same careers in every row):

| Staff | Legacy | vs none | Titles | Hall of Fame | Peak | A 5★ team | Injuries | Earned | On staff | Net worth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| None | 79.2 | | 1.48 | 32% | 74.8 | 59% | 2.67 | $282.9M | $0 | $276.5M |
| Smart (the best agent, then the salaried roles within half the salary) | 89.0 | +12.4% | 1.77 | 38% | 75.3 | 65% | 2.16 | $319.9M | $187.4M | $101.4M |
| The agent alone | 79.7 | +0.7% | 1.48 | 32% | 74.8 | 58% | 2.67 | $306.9M | $0 | $286.1M |
| The skills coach alone | 82.0 | +3.6% | 1.55 | 34% | 75.0 | 61% | 2.69 | $294.3M | $82.0M | $180.8M |
| The strength trainer alone | 80.8 | +2.0% | 1.53 | 33% | 74.9 | 60% | 2.22 | $292.2M | $81.4M | $175.3M |
| The physio alone | 79.7 | +0.7% | 1.48 | 32% | 74.9 | 59% | 1.92 | $294.5M | $81.5M | $176.9M |
| The nutritionist alone | 89.2 | +12.7% | 1.76 | 39% | 75.1 | 63% | 2.63 | $309.3M | $87.7M | $185.7M |
| The mental coach alone | 81.5 | +2.9% | 1.55 | 33% | 74.8 | 61% | 2.67 | $292.7M | $82.3M | $177.5M |

Targets: smart spending +10–20% legacy over none ✓ (+12.4%); every salaried role alone above none ✓; the agent (a cut,
no salary) earns you more ✓ (+$24.0M). Each role pays where its card says: the physio cuts injuries 2.67 → 1.92, the
strength trainer to 2.22, the agent's deals add $24M, and the nutritionist (games tire you less, the legs age later)
moves legacy most.

The typical policy (reported; the band is judged on the great one, as in V10): no staff 38.9 legacy, 0.21 titles, 2%
in the Hall of Fame; smart spending 41.8 (+7.2%), 0.29 titles, 3%, 17% reaching a 5★ team (13% without); each role alone
+1.0% (the agent, +$11.6M earned) to +5.8% (the nutritionist); injuries 2.15 → 1.68 with the physio.

**Shop** (`tests/shop.js`, 10 of 10):

| Check | Measured |
| --- | --- |
| The +4 cap can't be exceeded (property test) | ✓ every combination of worn items: at most +4 to a rating, a collab's second rating included; in games only (OVR and value never move) |
| Gear shows on the player (screenshot test) | ✓ shoes, socks, the sleeve, the headband and the wristbands in the item's colors, in games, on the hub and in portraits; pixel mode keeps a gear color in the palette |
| The try-on preview works | ✓ desktop and phone: your player wearing it, ratings old → new, what it replaces, the cap's note, Buy |
| Money worth spending at every stage | ✓ high school: 15 of 15 buys within $1,000 (all of them $2,140); college: 18 of 18 within $5,000 ($31K); a rookie pro: 20 of 20 within $770K ($2.80M) |

**Pro teams** (`tests/proteams.js`, 14 of 14):

| Check | Measured |
| --- | --- |
| Playoff and Finals flow | ✓ the top 8, quarterfinals, semifinals and the Finals, every series best of 3 (the higher seed hosts games 1 and 3); the champion wins the Finals; the Finals MVP is the champion's top scorer in the Finals (a teammate takes it when you won from the bench) |
| Ring ceremony and banner | ✓ the parade, the ring and the banner, in that order, before awards night; the banner joins the franchise's history; the ring goes in the trophy case; the fans grow (520K → 572K) |
| Dynasty tracking | ✓ titles in a row are a run, yours across franchises and the franchise's: 1 → 2 → 3, then 0 after a season without one |
| Scarcity: at most one 5★ spot per team per season | ✓ 233 spots opened in 480 5★ team-seasons (49%), never more than one a team |

### 2.0 §7's tests

| Test | Result |
| --- | --- |
| Steal consistency (`tests/steals.js`) | 2 × 500 scripted steals, 0 mismatches between the STEAL callout, the stat and a real change of possession. Defense 6: clean 64.6% (target 63%), STEAL 428, POKED 72; Defense 9: clean 71.6% (72%) |
| Trait rarity distribution (`tests/rarity.js`) | 1,000 generated players (365 teammates, 268 opponents, 67 rivals, 300 pros): Legendary 3.4% (3–5%); 20,000: 54.8 / 27.9 / 13.3 / 4.02% against 55 / 28 / 13 / 4 |
| Trait power by rarity (`tests/traitbalance.js`, 400 careers a trait on 3 seeds) | every rarity in its band and rising with rarity (median legacy against no trait, the great policy, 1,200 careers a trait): Common +5% (0…8%), Uncommon +12% (6…15%), Rare +24% (15…30%), Legendary +51% (35…60%); Generational +81%, Unbreakable +58%, Late Bloomer +41%, Fast Twitch +0% |
| Box-score invariants (`tests/boxscore.js`) | 1,000 simmed amateur games and 1,000 simmed pro games: every line adds up (3PM ≤ 3PA ≤ FGA, 3PM ≤ FGM ≤ FGA, the points), 0 failures |
| The overflow audit at three sizes and 1.25× text (`tests/phoneaudit.js`) | every screen (about 250) at 844×390 and 1280×720, both at 1.25× text, 1920×1080 and 800×1000: nothing flagged on the final build (overlapping or cut text, text under a figure, 64 px tap targets on the phone, off-screen widgets, two screens at once), and every string at least the menus' pixel (10 internal pixels for a 10-pixel glyph) at every size. The two new sizes caught three V13 regressions, fixed in V14 (above) |
| Perf at 4× CPU throttle (`tests/perf4x.js`) | not met on today's machine, and no slower than V2 (the table below) |
| A full career with the pro phase, through Jump to pro (`tests/fullcareer.js --jump`) | desktop: Jump to pro from freshman year (95 weeks simmed: 22, OVR 65, out of Coastal University), the combine, the offers and signing day, then 14 pro seasons through the screens (481 actions, a real high school game and a real pro game), retired at 36, the epilogue and the Hall of Fame; phone: the same jump, 13 pro seasons, 473 actions, retired at 35. Both passed (the final build) |
| The career simulator's targets | XP stays hard: the curve above (60 → 70 2,696 XP, 80 → 90 21,739). A 5★ team stays an achievement: Part 2 replaced 2.0's "keep 55–65% by age 29" with 15–25% of typical careers and about 60% of great ones (§1.1's own line reads "15–25% of careers (now 55–65%)"). Measured over 400 careers: typical 17% reach a 5★ team (7% by 29; median age at the first 30), great 64% (44% by 29; median age 28) |

**Perf at 4×** (`tests/perf4x.js`, the device clock: a live pro-arena 1v1, AI against AI, 5 forced dunks and 3 forced
blocks). The V14 build and V2's own build (its commit and its test), run back to back and alternating, twice, on the same
quiet machine:

| | V14, phone | V2, phone | V14, desktop | V2, desktop |
| --- | --- | --- | --- | --- |
| Median frame (target ≤ 25 ms) | 29.2, 27.2 ms | 27.5, 29.0 ms | 22.7, 24.3 ms | 27.2, 23.2 ms |
| Frames over 50 ms in dunks, celebrations and blocks (target 0) | 73, 35 | 72, 90 | 30, 32 | 44, 21 |
| The frame guard's first shed (target ≤ 0.5 s) | 0.18, 0.18 s | 0.23, 0.22 s | 0.18, 0.17 s | 0.20, 0.10 s |

When V2 was committed this test measured its build at 13.9–14.9 ms (phone) and 11.7–13.6 ms (desktop). The same build
runs about twice as slow on today's host, so the medians are over 25 ms for both; V14 is inside V2's own run-to-run
spread, so V3–V14 added no frame time this test can see. The guard sheds within 0.2 s.

### Tests on the 2.0 build (V14)

The whole suite ran on the V14 build; five small changes followed it (the shake tendency, the Codex chip's width, the Me
card's second trait chip, the dead contest screen, jersey letters out of the legibility count), and everything they can
touch ran again on the final build (marked "final"). The rest doesn't read what changed: the career simulator and its
tests don't play engine games, and the gate and the harness play bots without tendencies.

| Test | Result |
| --- | --- |
| Syntax (`tests/check-syntax.js`) | ok (final) |
| Smoke: the game through the UI at 1280×720 and 844×390 | 137 of 137 (final) |
| Modes: every mode played to its end | 13 of 13 (final) |
| Old saves: every fixture from the first 1v1 career on, reloaded and played on | 34 of 34, never wiped (final) |
| Dev tools | all OK (final) |
| The overflow audit: 844×390, 1280×720, both at 1.25× text, 1920×1080, 800×1000 | about 250 screens at each size, nothing flagged; the smallest glyph 1.00× the menus' pixel everywhere (final) |
| 2.0's page fixes (`tests/fixes.js`) | 15 of 15 (final), the rack check 16 of 16 |
| The Codex, tooltips, dots, What's new, legibility, celebrations, arenas (`tests/polish.js`) | 14 of 14 (final) |
| Gameplay: scouting, bots playing to their card, signature moves, overtime (`tests/gameplay.js`) | 12 of 12 (final; "Shakes you with moves" +38%) |
| The style mix | Post 51% post-ups (45%), Shooter 60% jumpers (55%) with 52% threes (half), Slasher 64% drives (60%) ✓ (final) |
| A whole career through the screens | 927 actions: a real game in high school, college and the pros, retired after 14 pro seasons at 36 (final) |
| The same with Jump to pro | desktop 481 actions, phone 473: passed (final) |
| Art Lab | 58 screenshots, no errors (final) |
| Steals, rarity, box scores | 2 of 2 each (above) |
| Traits (`tests/traits.js`) · the climb · the flow | 9 of 9 · 9 of 9 · 12 of 12 |
| Story · school · staff · shop · pro teams | 13 of 13 · 8 of 8 · 11 of 11 · 10 of 10 · 14 of 14 |
| The §1.1 table (`tests/difficulty.js`) | every row in its band, both policies |
| The HUD's text (`tests/hudaudit.js`) | 35 scenes at several window sizes, 0 flagged |
| §2 gate (300 mirror games, 200 Legend-vs-Pro games) | Pro mirror 1.17 PPP (0.95–1.25 ✓), side A 50% (45–55% ✓), Legend beats Pro 81% (75–95% ✓), brute force vs Pro 0.89 (≤ 1.30 ✓), timing and reads 1.50 ✓ |
| Balance harness (Classic) | brute force vs Pro 1.06 (≤ 1.30 ✓), perfect timing 2.02, Legend beats Pro 83% (75–95% ✓) |
| Career simulator, 40 careers | every target met: a 5★ team 20%, 0.40 titles, Hall of Fame 8%, OVR 56 / 64 / 68 at 17 / 21 / 25, 0 stuck |
| Career simulator, 400 careers a policy | typical: 5★ 17%, 0.27 titles, Hall of Fame 3%; great: 64%, 1.80, 39%; 0 stuck (final) |
| Trait balance · staff balance | every rarity in its band · smart spending +12.4% (great), every role above none |
| Perf at 1× and 4× (`tests/perf.js`, `tests/perf4x.js`) | the table above (final) |

### Deviations and known limits

1. **The 5★ target.** 2.0 §7 asked to keep reaching a 5★ team at 55–65% by age 29; Part 2 (which wins) calls that too
   easy and sets 15–25% for a typical career and about 60% for a great one. The game meets Part 2's numbers; the
   by-29 share is printed beside them.
2. **XP near the top.** Part 2's prose says 80 → 90 costs "about 3×" the 60 → 70 stretch; its formula,
   20 × 1.11^(rating − 40), gives 8.1×. The formula was kept (V6), and the Codex prints the ratio.
3. **One league player per franchise.** The career is 1v1, so each franchise's games are played by its league player,
   and your franchise's depth chart decides whether that's you. Rosters, trades and signings move league players.
4. **Arcs per career.** 85% of careers see 6–8 arcs; the rest are mostly short careers with fewer act III seasons.
5. **A steal's loose ball** goes toward the stealer 63–66% of the time against 2.0 §1.1's 70% (the clean-steal share,
   the test's bar, is on target). V1 measured 69.4% over 1,000 pokes; it is reported, not judged.
6. **Perf is measured in headless Chromium**, which draws the canvas on the CPU; nothing was measured on a real phone.
   On today's host neither V2's build nor V14's meets the 4× targets (the medians run 23–29 ms, and dozens of frames go
   over 50 ms in dunks and blocks); measured side by side, V14 is as fast as V2, and V2 met the medians on the host it
   was committed on.
7. **Jump to pro is a dev tool.** It plays the amateur years as the career simulator does (the AUTO week, the league
   model's games, the default answers), not as a player would; the pro flow after it is the real one.

## V14 — 2.0: balance, Jump to pro, the full suite, version 2.0 (2.0 §7; Part 2 §7–8)

The last milestone of Hoop Heads 2.0 and its Part 2. The career is still 1v1 only.

**Version 2.0.** `CONFIG.version` is '2.0'. The title screen's line reads "v2.0 · one file · no network · everything
drawn in code", and the credits show VERSION 2.0 in their top right corner. What's new and the main menu's What's new
button read their version from `CONFIG.ui.whatsNew` (2.0); the screen still shows once after the update.

**Jump to pro (2.0 §7).** The dev menu (the backtick key, or five taps on the title logo) has a **Jump to pro** button,
beside the money cheat (the two share a row: the menu's column was full). It sims the rest of the amateur career the
way the career simulator plays it: each week's auto plan and the league model's game, every card answered
automatically (story choices the default, the press the default answer, a trait pick, an NIL deal or an agent as the
simulator answers them), the simulator's calls (summers: a job, the camp, then the AAU circuit; the best college that
wants you; turn pro once the scouts project a top-30 signing or after the third college season). It stops at the pro
combine and opens it, so the pro and team flow (the combine, the offers, signing day, the pros) is a minute away. With
no career it starts one ("Dev Prospect", from the dev menu's seed); a pro career gets "Already in the pros." It is
`devJumpToPro` (`159_sim.js`); nothing outside the dev menu calls it.

`tests/fullcareer.js --jump` is 2.0 §7's full career with the pro phase: it plays the first high school game for real,
opens the dev menu with the backtick key (the game loop opens it, as for a player), presses Jump to pro and plays the
rest through the screens, the combine and signing day to the Hall of Fame, with a real pro game.

**The Slasher drives (balance).** The style mix's standing miss since V4: the Slasher drove on 46% of possessions
(target 60%). Its plan (`ai.stylePlan.slasher`) moves from drive 0.35, three 0.28, mid 0.32 to 0.49, 0.18, 0.28. At
0.55 it drove 66–68%.

**The shake tendency.** With the Slasher driving more, "Shakes you with moves" added only +20% dribble moves on the
gameplay test's games (a Slasher with it against one without; the bar is +25%, and it was +41% in V4). On another 24
games it added +34%: at 1.45 the lift swings with the games. `scout.tend.shake.ai.move` goes from 1.45 to 1.9: +38% and
+36% on the two sets (1.6: +30%; 1.75: +23%; 2.1: +39%; 2.4: +33%: the lift levels off near +35–40%).

**Two more window sizes in the overflow audit.** V14 also audits 1920×1080 and a tall 800×1000 window (besides
1280×720, 844×390 and both at 1.25× text). They found three things from V13:

- **The Codex chip in a tall window** sits in the top margin, 48 layout units wide. At 800×1000 the menus' pixel is one
  device pixel, 1.6 layout units, so the menus' text is bigger than their layout there, and "CODEX" was cut on 198 of
  250 screens. The chip is now as wide as its label at the menus' pixel (62 units there); a phone's or a tablet's
  64 px chip is already wider and doesn't change.
- **The Me card's second trait chip** took whatever the first one left: 80 units at 800×1000, cut to "GY…". It's drawn
  only when it fits whole. (At 1280×720 the first chip leaves too little and the second never showed; the TRAITS line
  beside the card lists both.)
- **At 1920×1080 the legibility check flagged 12 screens**: a player's jersey letters, drawn at the sprite's pixel size
  (2 device pixels a font pixel) under the menus' pixel there (3). They're the character's art, not the menus' text, so
  `rbStack` (the jersey's letters only) no longer adds to the count. Every string the menus draw is still checked.

**Removed:** R7's old contest screen (`allStarScreen`), which nothing had opened since R7 (the F pass's known limit 7).
The All-Star weekend's result screen stays.

**The rack check (#127).** `tests/fixes.js`'s check that the 3-point racks never cover the player failed about one run
in five under load (the tryout shootout, Smooth graphics, the phone: 23 pixels in a 70×10 strip). Repeating it showed
the player's own pixels changing between identical renders (1,480–2,864 px each time): hanging hair strands run a
verlet sim on `performance.now()`, and the held ball eases on it. Strands that sat in one pose on the three plain
renders and in another on the two with the racks would pass for a rack. The five renders and the player's own draw now
share one frozen wall-clock instant, the same renders differ in 0 pixels, and all 16 rack checks pass.

**The README** describes 2.0: What's new, the career's new systems (traits, the climb, the story, school, the shop and
staff, the pro teams, the Codex, the Road and the hub), Jump to pro and every test.

**Tuning** (each in CONFIG with its comment):

| Value | Was | Now | Why |
| --- | --- | --- | --- |
| `version` (new) | — | '2.0' | the version on the title screen and in the credits |
| `ai.stylePlan.slasher` | post 0.05, drive 0.35, three 0.28, mid 0.32 | 0.05, 0.49, 0.18, 0.28 | the Slasher drove on 46% of possessions (target 60%): 64% now (0.55 drove 66–68%) |
| `scout.tend.shake.ai.move` | 1.45 | 1.9 | after the Slasher's change, "Shakes you with moves" added +20% dribble moves on the test's games (bar +25%): +38% now, +36% on another 24 games |

**Tests.**

- `tests/fullcareer.js --jump` (new): the full career through Jump to pro, desktop and phone.
- `tests/fixes.js`: the rack check renders at one frozen wall-clock instant.
- `tests/careersim.js`: the franchise line adds the share reaching a 5★ team by 29 (2.0 §7's old line).
- `tests/artlab.js`: the phone's match shot waits out the opening wipe (the shot always caught it).
- The suite's extras (`v14/extra.sh`): every test 2.0 §7 and Part 2 §7 name, the audit at five sizes, both policies
  of the career simulator and of the staff balance.

## V13 — 2.0: the Codex everywhere, tooltips, dots, What's new, legibility (§5); celebrations, arenas, names and looks (§6)

The UI and content milestone of 2.0 (§5 and §6). The career is still 1v1 only.

**The Codex from every screen.** Press **?** (a gamepad's View button) on any screen, or tap the **?** chip in a
phone's margin beside the 1280×720 area (64 CSS px to tap, on no button; a tablet gets it in the top margin, a
16:9 touch screen in the top right corner). On a desktop the key hint reads **? Codex · Enter select · Esc back**
and "? Codex" is a link; the hub's left rail has its own **?** beside the settings gear. Each opens the page about
the screen you're on: the hub's Play tab opens The season, Train opens OVR & ratings, Me opens Hype, fame,
confidence, Team opens Team & pro value, Shop opens Gear & the shop; a press conference opens the buzz page, the
recruiting screens Money & school, the Office and the franchise pages Team & pro value, and so on (`codexTopicFor`).
Back returns to where you were. There's no chip on the Codex itself, the boot splash, the title screen, the title
cinematics, the tips, the keyboard or the dev tools.

**The Codex's pages** cover every term §5 names, each with what it is, what raises and lowers it, and its numbers
(read from CONFIG):

| Term | Page |
| --- | --- |
| Ratings, OVR, potential, XP | OVR & ratings (OVR now gives its range, the 2-OVR depth-chart rule and the value formula) |
| Traits | Traits (as before) |
| Hype, fame, confidence | Hype, fame, confidence |
| Coach trust, team stars | Team & pro value (**Team stars** is new: how the twelve franchises are ranked, how prestige moves each offseason, what a star is worth, and the calendar's opponent stars) |
| Fatigue, injuries, slumps | Fatigue & injuries |
| Money, GPA, legacy | Money & school (a pro's Money entry now gives the sponsor and shoe-line numbers) |
| The shop | **Gear & the shop** (new page): Gear, The shop, Celebrations and Lifestyle |

**Stat tooltips.** Rest the mouse on a stat chip or meter and a line says what it does, with "Click: the Codex →"; a
click opens its page. On a phone a tap opens a small card with the line and a **Codex →** button. Hot spots: the
hub's Me and Team rows (hype, fame, confidence, cash or money, GPA, coach trust, franchise stars, title odds), the
fatigue meter on the Train tab, every OVR badge and trading card, the star ratings (the hub's header, the calendar,
the franchise pages), coach trust on the team screen, the Office's fame meter and the news screen's buzz meters. A
stat inside a button stays the button's (no tooltip there). Hot spots are now stored through the canvas's own
transform, so one drawn in a scaled panel (the phone's Me tab) lands where it shows; the trait chips there were off
before.

**Red dots.** The hub's tabs had dots for new offers, gear you can afford, a trait to pick, unread news and a
challenge you can take; they now cover unread story too (the saga's chapters since you last opened Story), and the
button behind a dot has one as well: News, Story, Recruiting, the Office (new offers) and the Depth chart. Opening
it clears it.

**What's new in 2.0.** A page of eleven items (traits, gameplay, the Road, the harder climb, the story, school, the
shop, the staff, the pro teams, the new looks, the Codex). It opens once on the first main menu after the update for a
save from before 2.0 (Got it saves that); a new player never sees it uninvited. The main menu has a **What's new**
button (2.0). A desktop shows all eleven in three columns; a phone pages them four at a time.

**Stacked screens** stay opaque (V1 §1.8): an overlay in the menus draws over the backdrop alone. The new stat card is
one too; the test checks the screen underneath never draws.

**Legibility (no text under 10 internal pixels).** Every glyph of the Retro font is 10 font pixels tall, and the menus
draw each font pixel at least the menus' own pixel (RBF.kUI device px: the 360-row grid of the 1280×720 area, rounded
the way the menus round it), so a string is at least 10 internal pixels tall. That already held for everything the
menus draw on screen; it didn't hold for text baked into the trading cards (their chips, tier, sub-line and the OVR
badge's "OVR" were drawn at 1 device px a font pixel: about 5 internal pixels on a phone). Cards now bake their text
at the menus' pixel too (`RBF.bakeMin`); their chips grow to fit, a long name or school line ends in "…", and a chip
that no longer fits drops out. The overflow audit enforces it: every screen's strings, the baked ones included (the
card cache is emptied first), are checked against the menus' pixel. All 250 screens pass at all three sizes.

**Six more celebrations** (`178_celebs.js`, the rig in `027_rig.js`): **Can't Hear You** (a hand cupped at the
ear), **Raise the Roof**, **Take a Bow**, **Ice Veins** (two fingers tapping the wrist), **Shush** (a finger to the
lips) and **The Robot**. Everyone has the old eight; the six are yours alone. Four unlock on the Road to the League
(make varsity: Raise the Roof; start in college: Shush; a 5★ team: Take a Bow; win a ring: The Robot; the milestone's
card says so, and an old save's milestones already done count). Two are sold in the shop's new **Celebrations**
shelf: Can't Hear You and Ice Veins, at $150 in high school, $900 in college, $40,000 in the pros. The shelf lists
all fourteen with how to get each and a looping preview on your player; pick one ("Use it") or **Mix them all**.
After a basket your player does yours (a mix picks one of yours by the play, never from the match's random numbers);
the league's players keep the eight. They come with you to the pros.

**One more arena a level.** The same buildings, each painted its own way (`VENUE_STYLE`): **The Fieldhouse** (high
school: blue-gray block, gray bleachers, REGIONAL FINALS pennants, a lighter maple), **The Pavilion** (college: green
stands and bowl, a cream-stone wall, SWEET SIXTEEN and ELITE EIGHT banners) and **The Foundry** (the pros: a rust and
brick bowl, warm trusses, rust courtside pads, its own title banners). High school and college play at home in their
gym and on the road (and in the playoffs, on a neutral floor) in the other building. Six PBL franchises (the Ballers,
Raccoons, Vandals, Nephews, Comets and Pilots) play in the Foundry, the rest in the Pro Arena; every pro game is in
the home club's building, and a franchise page names it (IRONBRIDGE · THE FOUNDRY). All three are in Quick 1v1 and
Practice too, and on the Art Lab's venue page.

**Names and looks.** First names 60 → 168 and last names 70 → 172, all invented, no repeats. Every hairstyle can now
come up for every skin tone (weighted: the light pool had no twists, locs, cornrows or braids, the dark one no bun,
side part, mohawk or long hair), brown hair joins the darker pool, dyes come up 8% of the time (were 6%), and a
quarter of the headbands, sleeves and wristbands come in a color of their own. The generator makes exactly the
draws it made before, so a seed's league is the same league with other names and faces; fewer name retries do shift
later draws a little, which the career simulator's lines below include.

**New and changed in CONFIG** (each with its one-line comment):

| Setting | Value | What it is |
| --- | --- | --- |
| `ui.whatsNew` | '2.0' (new) | the update What's new describes; a save that hasn't seen it gets it once |
| `celebs.shop` | ['earCup', 'iceVeins'] (new) | the two celebrations the shop sells |
| `celebs.price` | hs 150, college 900, pro 40,000 (new) | their price at each stage ($) |
| `road.list[].celeb` | varsity raiseRoof, colstart shush, team5 takeBow, title robot (new) | the celebration a milestone also unlocks |
| `amateur.stages.hs.away`, `college.away` | 'fieldhouse', 'pavilion' (new) | the floor away from home and in the playoffs |

(The look generator's pools, `LOOK_POOL` in `025_art.js`, are art data: the hair pools, the 8% dye share and the
accessory colors.)

**Calls I made.**

- "10 internal pixels": an internal pixel is the menus' pixel, RBF.kUI device px (the 360-row grid of the 1280×720
  area, rounded the way the menus round it); a glyph is 10 font pixels tall. On an 844×390 phone that's 20 device px
  (10 CSS px). Raising it to whole 360-row pixels of the full window (15 CSS px there) would have broken every phone
  layout.
- The "?" button: a chip where there's room outside the 1280×720 area (every phone; it never covers the screen), and
  the key hint's "? Codex" on a desktop, where windows rarely leave a margin; the hub's rail gets a real button.
- The Codex opens at the page about the screen you're on, not at its first page.
- Tooltips: a hover on a desktop (a click goes to the Codex), a tap card on a phone. A stat inside a button belongs to
  the button.
- What's new shows uninvited only to saves from before 2.0; a new player can open it from the main menu.
- The celebrations: four on the Road, two in the shop, as cosmetics (looks only). The shop sells one at a time; a mix
  is the default.
- Three Goggles (both fists round the eyes) didn't read: the big head hides the back hand. It became Can't Hear You.
- The new arenas are the old buildings with their own palettes and banners, not new painters; the away games and the
  playoffs take the second building, and the pros split six and six.
- The shop's "Your locker" tab is "Locker" now, so four tabs fit beside the shopkeeper (each tab as wide as its word).

**Found in the screenshots** (fixed before the commit):

- The tooltip panel was 97% opaque: the rows under it showed through. It is solid now.
- The "›" in "Codex ›" isn't in the Retro font (it drew a "?"); it is "→".
- What's new in two columns on a desktop ran its three-line items into the next title: three columns.
- Three Goggles was unreadable (above); Shush pointed at the nose (the finger is at the lips now).
- The four shop tabs at one width cut "Your locker" and "Celebrations" short (the menus' pixel won't shrink further).

**Found by the audits** (fixed too): the Gear entry ran past six lines in the Codex's two columns (split in three
paragraphs); a Codex title next to its value chip was held to half the column ("LEGACY AND THE HALL OF FAME" cut: it
gets the room the chip leaves now); the celebrations shelf's footer passed its arguments in the wrong order; and the
phone's All-Star weekend cut "Sim the contest" by 4 px when you are invited to the 3-point contest (the new names'
draws reached that case; the bar is rebalanced).

**Tests.**

- `tests/polish.js` (new, 14 steps): the ? key from 32 screens (each at its page, Back returning); the desktop hint
  and its click, the hub's rail button; the phone chip on 7 screens (in the margin, 64 px, on no button) and a real
  tap; every term on a Codex page with numbers (26 entries, an amateur and a pro); the tooltips' hover and click on
  the hubs and the team screen (OVR, hype, confidence, money, GPA, fatigue, trust, stars, fame, odds); a phone's tap
  card and its Codex button; the six dots and the buttons behind them; What's new for an old save, a new player and
  the menu button; overlays drawing alone; legibility on a desktop and a phone (cards included); the celebrations
  (unlocks, an old save, the buy, the pick, the rig's choice, the league's eight, carried to the pros, every pose);
  the arenas (kinds, styles, home/away/playoffs, the Foundry six, the pro court, the Art Lab shots); the name and
  look pools (500 names never repeat; all 14 hairstyles for both skin groups; 24% colored headbands).
- The overflow audit checks legibility on every screen and has nine new cases (the Codex's shop page for an
  amateur and a pro, the celebrations shelf and one celebration for both, the stat card, What's new and its last
  page).
- Old saves: the driver presses Got it on What's new (and fails if it comes back). The shop test opens "Locker".
- Smoke: a pro game is in the home club's arena (the Pro Arena or the Foundry), the away courts are their level's;
  an old save meets What's new before CONTINUE CAREER.
- 25 screenshots in `shots/v13` (desktop and phone: the hub's tooltip and dots, the key hint, the Codex's shop and
  team pages, a stat card, What's new, the main menu, the celebrations shelf and one celebration, a franchise in the
  Foundry; and three grids: the celebrations, the six career venues, 32 generated faces).

**Suite.** Everything passed:

- smoke (desktop and phone, 137 steps), every mode (13), old saves (34), the dev tools, the phone audit (250 screens)
  and the Art Lab (58 shots, among them the ten venues);
- polish (14 steps); the career simulator's V12 line again on both policies (400 careers each: a ring in 15% and 61%
  of careers, Finals MVPs 0.26 and 1.80 a career, a franchise player 69% and 98%, a jersey retired 25% and 70%,
  back-to-back 3% and 28%, a three-peat 1% and 12%, rebuild trades 0.56 and 0.18 a career: V12's line within its
  noise); pro teams (14 steps); shop (10); staff (11); school (8); story (13); climb (9: the pros' median 75, their
  top three 87); difficulty (every row of the §1.1 table in its band: a 5★ team 16.3% and 65.0%, titles 0.31 and
  1.71, the Hall of Fame 3.8% and 37.2%); flow (12); gameplay (12); traits (9); steals; fixes (15); the HUD audit (35
  scenes, none flagged) and the style mix;
- the full career (876 actions, retiring at 35 after 13 pro seasons), and the desktop (249 screens) and 1.25× text
  (250) audits: nothing flagged, every string at the menus' pixel or bigger;
- the balance gate, the balance run (Legend beats Pro 83%), the career simulator (40 careers, none stuck) and the
  trait balance (400 careers × 3 seeds: Common +5%, Uncommon +12%, Rare +24%, Legendary +51%, every rarity in its
  band).

The style mix's standing miss is unchanged: the Slasher drives 46% of the time (target 60%).

The suite's smoke run failed 15 steps, all from its own expectations: it wanted every pro game in the Pro Arena, and
CONTINUE CAREER on the main menu right after loading an old save (What's new comes first now). Both are updated
(above), and smoke passes 137 of 137 on the suite's build.

## V12 — Part 2: the pro teams and championships (§6); 2.0: pro teams and getting there (§4.4, §4.5)

The seventh milestone of Part 2 (§6, with 2.0 §4.4 and §4.5). The career is still 1v1 only: each franchise's league
player plays its games, and you are one of them.

**Twelve franchises with an identity** (`162_franchise_id.js`; the static part is `FR_INFO`, a career's part lives on
each franchise's row of the prestige table and fills in on an old save's first look):

| Franchise | City | Owner | Market | Fans | Rival | Titles before you |
| --- | --- | --- | --- | --- | --- | --- |
| Parking Lot Prophets | Calder Bay | Margo Whitfield (win-now) | big | 940K | Pilots | 8 |
| Bodega Ballers | Eastbrook | Sal Benedetti (cheap) | mid | 610K | Comets | 4 |
| Late Bus Legends | Maple Falls | June Albright (patient) | small | 380K | Nephews | 5 |
| Rooftop Raccoons | Highmoor | Dex Calloway (win-now) | big | 880K | Owls | 5 |
| Vending Machine Vandals | Port Avery | Priya Rao (patient) | mid | 520K | Kings | 2 |
| Night Shift Nephews | Ironbridge | Walt Kessler (cheap) | small | 350K | Legends | 4 |
| Sprinkler Park Sharks | Coral Shore | Renata Cruz (win-now) | big | 820K | Monarchs | 6 |
| Mailroom Monarchs | Kingsmere | Harold Fenwick (patient) | mid | 670K | Sharks | 7 |
| Laundromat Kings | Westhaven | Tasha Monroe (win-now) | big | 900K | Vandals | 6 |
| Corner Store Comets | Northgate | Lou Pastor (cheap) | mid | 560K | Ballers | 3 |
| Overnight Owls | Duskwood | Agnes Whitlock (patient) | small | 330K | Raccoons | 2 |
| Parking Garage Pilots | Redrock | Bud Garrity (cheap) | small | 300K | Prophets | 0 |

- **A pixel crest** for each: a 16×18 shield in the franchise's two colors with a 10×10 mark (a traffic cone, the
  bodega cat, the late bus, a masked raccoon, a soda can, the night-shift moon, a fin, a crown on an envelope, a washing
  machine, a comet, an owl, a plane). It's on the offers, the league's franchises, the bracket, the banners and the
  hub.
- **An owner**: win-now, patient or cheap (four each). The story's Owner arc meets the franchise's own owner.
- **A coach** (a name and a style) who stays with the franchise; when you sign, your coach is theirs. **Facilities**
  from the stars, as before. **A market** (big, mid, small: fame you gain ×1.08, ×1, ×0.92) and **a fan base** that
  grows with winning, series won and titles (and shrinks with losing).
- **History**: every season from 1979 to 2030 has a champion (52 titles dealt out once, the same for every career: the
  Prophets have 8, the Pilots none), one banner each; one to three retired jerseys (legends with a number and a
  nickname). Your career's titles and your jersey join them. Your first pro season is 2031.
- **Rivalries**: six pairs. A rivalry game is tagged RIVALRY on the calendar (RIVALS on a narrow tile) and is a big game (Sim to next big moment
  stops for it); a rivalry series in the playoffs makes the news.
- **A franchise page** (the hub's Team tab → Franchise, or a row of the League's Franchises tab): the crest, city and
  stars, the title odds, the owner, the coach, the market and fans, the gym, the rival, what they need, the banners,
  the retired jerseys and the best players. Previous and Next flip through the table.

**Team strength and title odds** (`162_franchise_odds.js`). A team's strength in a simulated game is its league
player's (strengthOf) plus 1.3 points a star (LG.starEdge: its roster and gym) and its owner's moves this season. The
title odds play the rest of the season and the playoffs 400 times with the same numbers (from a seed fixed for the
week, so they hold still): on the hub (the header and the Team tab), on the franchise pages, on every offer (out of
school, as a rookie; in free agency, next season; a trade, this season).

**The season.** The top 8 make the playoffs (were 4): quarterfinals, semifinals and the Finals, every round best of 3
(the higher seed hosts games 1 and 3). A playoff game is tighter than a regular-season one (its points noise × 0.75: the
better team wins more often; see the balance below). The calendar has a tile a round (QF, SF, FIN); the hub's Team tab opens the
bracket during the playoffs. **The Finals MVP** is the champion's top scorer in the Finals: when you won it from the
bench, the teammate who started the Finals takes it (you keep the ring). MVP, All-League, Defensive Player and Most
Improved as before.

**Winning a title** (`179_ui_title.js`): THE PARADE (your city's street, your fans, the bus, you on its roof with the
trophy), THE RING (your ring turns in the light: its year, its number, the run it extends, FINALS MVP), BANNER NIGHT
(the banner rises into your arena's rafters beside the franchise's old ones). Then awards night. The ring goes in your
trophy case (a title is a ring now). **Dynasties**: titles in a row are a run, yours across franchises and the
franchise's: back-to-back, a three-peat, a four-peat.

**Franchise moves** (`162_franchise_moves.js`). Each offseason every owner reads the franchise's stars: a win-now owner
at 3★ or better goes all in (a trade for a rebuilding franchise's veteran of 28 or more, at least as good as their
younger player; or a free agent: +0.35 stars of strength next season); a patient or cheap owner at 2★ or less rebuilds
(their veteran goes to a contender for the younger player); a cheap owner who isn't winning lets a veteran walk (−0.35
stars). The offseason's League moves step lists them; the news says so. Stars still rise and fall with the standings.
**A rebuild can trade you** (a story beat): your patient or cheap owner at 2★ or less offers a veteran (27+) on a deal
that runs past the season to a contender (never a 5★ team without its open spot): go (your contract comes along) or
stay (coach trust +10, fame +2).

**The Road to the League** has the career goals: A FRANCHISE PLAYER (a whole season started and an All-League team),
WIN A RING, FINALS MVP and JERSEY RETIRED (when you retire, a franchise where you played 6+ seasons with a title or 3
All-League teams retires your number). A save from before marks what it already did, quietly.

**The legacy screen**: your rings and Finals MVPs, your main franchise's banners in the rafters, your jersey rising
into them when a franchise retired it (framed otherwise), and your history there.

**The offers (2.0 §4.4/4.5).** Every offer is a team card: the crest, city and name, the stars, the title odds, what it
wins on (BEST TITLE ODDS, MOST MONEY, THE START IS YOURS, BIGGEST STAGE, BEST GYM: each offer a different one where it
can; an offer that wins nothing says its kind), the money, the role, the market and fans, the gym, the fame, the coach's
style, its best players with portraits and ratings (the bench you get when you sign) and what it needs ("Looking for a
shooter: you fit"). Out of school, the rebuild that starts you pays the most (the best team has the odds, the starter
the role); in free agency the agent's rebuild does too. Free agency shows its offers side by side; a trade request shows
your team and the trade side by side (money, role, stars, odds). **The bar in plain words**: "5★ teams want overall 81 +
fame 40. You: 76 / 22" (on Moving up and free agency). **The combine** reveals each measurement after a drumroll with a
STOCK ↑ / ↓ tag and ends on the scout score and the stars that are calling. **Commitment Day and Signing Day** end on
the team (the hat, the jersey card), its full name and confetti, with the skip prompt in view.

**The §1.1 table, recalibrated for eight playoff teams.** With eight of the twelve teams in, a typical career won a
third more titles and a great one reached the Hall of Fame a fifth more often:

| Step (600 careers a policy, seeds 1–3) | Typical: 5★ · titles · Hall of Fame | Great: 5★ · titles · Hall of Fame |
| --- | --- | --- |
| V11 | 17.8% · 0.36 · 3.3% | 65.8% · 1.94 · 39.2% |
| V12 with V11's four playoff teams | 20.2% · 0.37 · 2.5% | 68.0% · 2.02 · 41.5% |
| V12 as first built (the top 8) | 20.2% · 0.49 · 3.8% | 72.8% · 2.19 · 49.2% |
| + the league's next stars: a young AI player's ceiling room +6, +5 and +2 at 21, 24 and 27 | 18.5% · 0.39 · 2.7% | 65.8% · 1.75 · 39.8% |
| + a playoff game's noise × 0.75 (the better team wins more often) | 16.5% · 0.31 · 3.0% | 63.2% · 1.72 · 37.7% |
| + the Hall of Fame line 95 → 92 | 16.5% · 0.31 · 3.2% | 63.2% · 1.72 · 38.7% |
| the same on seeds 4–6 (held out) | 16.2% · 0.26 · 3.2% | 64.8% · 1.66 · 37.0% |

- Why it moved: the league's best teams were bunched (the best team's margin over the 4th best was 3.4 points against
  about 9 points of noise a game), so with eight teams in, the 3rd- to 8th-best won too often. In 400 typical careers
  the seasons when yours was the 5th- to 8th-strongest team won 3.3% of the time and gave 52 of 189 titles. The extra
  playoff games also added about 11 points to a great career's legacy (titles, MVPs, All-League teams and the
  playoffs' points).
- The pros still open at a median of 75 with their top three near 87.5 (§1.2: about 74, stars 82–90). Their mean
  after 5 and 10 seasons is 79.3 and 80.1 (was 78.2 and 78.4), and the best player 91.1 and 88.8 (was 90.3 and 86.6).
- Tried and dropped:
  - half the playoffs' fame and series value: no change;
  - fewer 5★ spots (`spot5Odds` 0.35): no change. 76 of the 80 typical careers that reach a 5★ team get there with
    their own team rising;
  - a bigger owner's edge (1.0 star): more titles;
  - prestige that keeps longer (0.65, 0.7), or a smaller title boost: no change;
  - the veterans' stars at +12, +9 and +7: −0.02 titles;
  - a wider veteran spread (`proSd` 9.5): more titles;
  - a bigger star edge (1.6) with playoff noise × 0.7: no change;
  - playoff noise alone: at × 0.5 typical careers won 0.33 titles, but great ones 2.69, with a 47% Hall of Fame;
  - reweighting the legacy (titles, MVPs, All-League teams, seasons, points): no weighting puts great careers near 35%
    with typical ones in 3–8%, because a typical Hall of Famer's career looks like a great one.

**Old saves.** The franchise rows fill in their identity on first look (your coach stays; the story's owner too); a
season from before V12 has no bench count (a full season of games counts); four-seed playoffs in progress finish as
they were (the bracket draws two rounds, the calendar two tiles); a title before V12 is a ring.

**New and changed in CONFIG** (each with its one-line comment):

| Key | Value | What it does |
| --- | --- | --- |
| `career.playoffSeeds` | 4 → 8 | the top 8 make the playoffs |
| `career.aiRoom` | [[21, 8, 22], [24, 5, 15], [27, 2, 8]] → [[21, 8, 28], [24, 5, 20], [27, 2, 10]] | a young AI player's ceiling room by age: the league's next stars (the balance above) |
| `career.hofScore` | 95 → 92 | the Hall of Fame line (the balance above) |
| `league.poHomeEdge` | 0.5 (new) | the home edge in a playoff game (the higher seed hosts games 1 and 3) |
| `league.poNoise` | 0.75 (new) | a playoff game's points noise × this |
| `amateur.combineStock` | new | where a combine row reads STOCK ↓ or ↑ |
| `franchise.year1`, `founded` | 2031, 1979 | your first pro season as a year; the PBL's first season |
| `franchise.marketFame` | small 0.92, mid 1, big 1.08 | fame you gain × this by the market |
| `franchise.fansTitle`, `fansSeries`, `fansWin` | 0.08, 0.02, 0.04 | a fan base's growth with a title, a series won and winning |
| `franchise.oddsRuns` | 400 | the seasons the title odds play |
| `franchise.jerseySeasons`, `jerseyAllLeague` | 6, 3 | a retired jersey's seasons, and its All-League teams without a title |
| `franchise.ownerEdge` | 0.35 | an owner's move in stars of strength for a season |
| `franchise.rebuildOdds`, `rebuildAge` | 0.45, 27 | how often a rebuilding owner offers you to a contender, and from what age |
| `franchise.contendAt` | 3 | the stars at which a win-now owner goes all in |
| `franchise.wantFame` | [0, 10, 20, 30, 40] | the fame each bar is said with in plain words |

**Calls I made.**

- Twelve franchises (the spec allows 12–16): adding four would re-seed every save's prestige table.
- The cities, owners, legends and crests are invented. The owners are fixed per franchise (the identity), not per career.
- Team strength stays simBox's (the league player + stars); the owner's moves add ±0.35 stars for a season. Title odds
  are a Monte Carlo of the same model (400 seasons), not the game engine.
- Fans and the market: the market sets a fame multiplier (×1.08 big, ×0.92 small); the fan base is flavor (it grows and
  shrinks, and fills the parade), not a stat.
- The Finals MVP in a 1v1 league: the champion's top scorer in the Finals (a teammate can take it when you sat).
- The three title scenes play at the season's end (before awards night), not at next season's home opener: a career
  can end or move on before then.
- A franchise player: a season with no bench weeks and an All-League team (1st or 2nd).
- Jerseys are retired at retirement (6+ seasons, a title or 3 All-League teams at one franchise).
- A rebuild's offer is a choice (go or stay), never a forced move; the career simulator goes.
- Finals MVPs count in the legacy screen, not the legacy score (it would move the Hall of Fame line).

**Found in the screenshots** (fixed before the commit):

- On a phone, CONTINUE on the parade, the ring and banner night sat in the top-left corner, mostly off the screen. The
  phone's button bar skips hidden buttons, and CONTINUE stays hidden until the reveal ends. It is placed first now (so
  is Commitment Day's, which kept its desktop size on a phone), right of the ring's FINALS MVP chip.
- The franchise page: on a phone the cards' last line (IN THE PBL, BENCH) sat on the panel's edge; on a desktop the
  owner's note crowded it.
- On a phone the owners' moves stopped at four; now as many as fit, then "+N more in the news".
- The legacy screen on a phone: the franchise line ran under MAIN MENU. Signing Day on a phone: the welcome panel ran
  under START YOUR PRO CAREER.
- The trophy case's legacy note ran past its panel under the new Earned line: four short lines now, from CONFIG.
- Banner night counts the banner going up (it said banner 5 for the sixth).
- The calendar's narrow rivalry chip reads RIVALS (was RIVL).

**Found by the audits** (phone, desktop and 1.25× text; fixed too):

- Three of the Road's new goals were cut short on its screen (more rows, smaller room): now "Start all season; make
  All-League.", "Lead the Finals winner in scoring." and "6+ seasons, a ring or 3 All-League."
- The League's franchise rows were too thin to tap on a phone. A phone gets a Franchise pages button, and every
  franchise page has Previous and Next, which flip through the table.
- The hub's Team tab in the playoffs on a phone pushed Depth chart into the tab bar: there, Playoffs takes its place
  (the Train tab has it too).
- On a desktop the League's franchise rows drew their text under their own tap areas: each row draws itself now.
- At 1.25× text on a phone, a long franchise name ran into the page's history column: it shrinks to fit.

**Tests.**

- `tests/proteams.js` (new, 14 steps): identity; a career's franchises; team strength and odds; the season and
  the playoffs (top 8, best-of-3 rounds, the Finals, the calendar); the Finals MVP; a title's scenes, banner, ring and
  fans; dynasties; the 5★ spots' scarcity; the owners' moves; a rebuild's offer; the Road's goals and jerseys; the
  offers (axes, odds, the plain-words bar, free agency, a trade); every new screen on a desktop and a phone (no errors,
  nothing cut).
- The phone and desktop audits have 12 new cases (the franchise pages, a trade, the parade, ring and banner, a rebuild's
  offer, the bracket, the hub in the playoffs, the owners' moves, free agency).
- The career simulator's V12 line: rings, Finals MVPs, franchise players, jerseys, runs and rebuild trades; it answers a
  rebuild's offer (go).
- Smoke's trophy check reads a ring; smoke, the full UI career and old saves skip the new scenes and reveals (smoke's
  college step waited for a CONTINUE that Commitment Day now shows after its reveal).
- Flow counts the Road's fourteen milestones and a calendar tile for each playoff round.
- The career simulator's `--seasons` diagnostic also records your club and your team's strength rank at each season's
  start (the calibration above used it).
- 38 screenshots in `shots/v12`.

**Suite.** Everything passed (the reruns on the commit's build are at the end):

- smoke (desktop and phone, 137 steps), every mode, old saves (34), the dev tools, the phone audit (242 screens) and
  the Art Lab;
- pro teams (14 steps); the career simulator's V12 line on both policies (400 careers each: a ring in 17% and 62% of
  careers, Finals MVPs 0.32 and 1.80 a career, a franchise player 65% and 98%, a jersey retired 25% and 72%,
  back-to-back 4% and 27%, a three-peat 1% and 12%, rebuild trades 0.50 and 0.18 a career); shop (10 steps); staff
  (11 steps); the staff balance on both policies (+13.9% on the great one, +7.1% on the typical one); school (8
  steps); story (13 steps: 15 arcs, 72 choices); climb (9 steps: the pros' median 75, their top three 87.5);
  difficulty (the §1.1 table above, every row in its band); flow (12 steps); gameplay; traits; steals; fixes; the HUD
  audit (35 scenes, none flagged) and the style mix;
- the full career (859 actions, retiring at 35 after 13 pro seasons), and the desktop (241 screens) and 1.25× text
  (242) audits;
- the balance gate, the balance run, the career simulator (40 careers, none stuck) and the trait balance (400 careers ×
  3 seeds: Common +0%, Uncommon +8%, Rare +20%, Legendary +49%, every rarity in its band).

The style mix's standing miss is unchanged: the Slasher drives 46% of the time (target 60%). The 40-career simulator
reads titles (0.45) and the Hall of Fame (10%, 4 of 40) high; the 600-career table is the reference (0.31 and 3.2%).

The suite's run failed two tests, both fixed above. **Smoke** waited for a CONTINUE that Commitment Day now shows
after its reveal (137 of 137 on a rerun). **Flow** counted V5's eleven Road milestones and one playoff tile on the
calendar (fourteen and three now; 12 of 12 on a rerun). The audits flagged the Road's new goals, the franchise rows
and a long franchise name; those are fixed above too. The build changed during the run (the screenshot and audit
fixes are UI only), so smoke, the modes, old saves, the dev tools, the three audits, pro teams, flow, shop and staff
were rerun on the final build: all pass, and the audits flag nothing.

## V11 — Part 2: the Pro Shop and money (§5); 2.0: the week's extras (§4.3)

The sixth milestone of Part 2 (§5, with 2.0 §4.3's consumables). The career is still 1v1 only. F8's six gear pieces
become a shop of items in slots, with rarities, levels and a storefront.

**Items in slots.** Five slots you wear, two training slots and one recovery slot (`GEAR_SLOTS`):

| Slot | Items (each adds to one rating in games, +1 a level) |
| --- | --- |
| Shoes | Court shoes (Speed), Spring high-tops (Hops) |
| Socks | Grip socks (Speed), Spring insoles (Hops) |
| Sleeve | Shooter's sleeve (Shooting), Compression sleeve (Defense) |
| Headband | Sweatband (Finishing), Mouthguard (Strength) |
| Wristbands | Grip wristbands (Handles), Shooter's wristbands (Shooting) |
| Training ×2 | Shooting machine, Weighted vest, Dribble goggles, Plyo box, Agility ladder, Finishing pads, Slide sled: practice XP +5% a level in one rating (at most +20% in a rating) |
| Recovery | Recovery boots (fatigue −1 a game a level), Knee brace (injury risk −8% a level) |

- **Rarity and levels.** Common items go to Lv2, rare to Lv3, epic to Lv4. Each level is +1 to the effect.
- **The cap.** Gear never adds more than +4 to one rating, everything you wear together. The try-on says so ("capped at
  +4").
- **In games only**, as F8's gear was: your OVR and your value to the franchises don't change.
- **Signature collabs** (legendary) come from the Road to the League, never from money: a college offer brings the
  signature shoes (Speed, and Hops +1), a pro offer the signature sleeve (Shooting, and Finishing +1), a 4★ team the
  signature wristbands (Handles, and Shooting +1). A collab arrives at Lv2 and each later one lifts the ones you
  have a level, to Lv4.

**Prices by the stage you're at** (`CONFIG.gear.price`; the level you buy or upgrade is priced where you are):

| Stage | Common Lv1–2 | Rare Lv1–3 | Epic Lv1–4 |
| --- | --- | --- | --- |
| High school | $50, $80 | $100, $160, $260 | $160, $240, $320, $400 |
| College (NIL) | $500, $800 | $1,000, $1,600, $2,600 | $1,600, $2,400, $3,500, $5,000 |
| The pros | $10K, $16K | $25K, $50K, $90K | $60K, $120K, $250K, $500K |

**The week's stock.** Six items a week, no family twice, rarities that lean with the stage (high school mostly common,
the pros mostly epic). One is featured at 25% off. An item you've never seen is NEW. Each sells once a week, and now
and then one is already SOLD OUT (other shoppers got there first; 35% of weeks). Your locker keeps everything you own.

**The storefront** (`178_ui_shop.js`): THE CORNER SHOP in high school (Mo), CAMPUS SPORTS in college (Rae), THE PRO SHOP
in the pros (Jules), each with a pixel portrait and a line in a speech bubble.

- **This week:** the six items on two wooden shelves as cards: a 16×16 pixel icon (20 icons) in its rarity's glow
  (common gray, rare blue, epic purple, legendary gold), the name, rarity and slot, what it does at Lv1 and at its top,
  the price (the featured one struck through), FEATURED, NEW and SOLD OUT.
- **Try it on:** your player wearing it, and your ratings old → new (green up, red down when it replaces something
  better, the cap's note), what it replaces, and Buy.
- **Your locker:** wear, take off, upgrade (the next level at today's prices), page through; the item's now and next.
- **Extras:** the week's ice bath, film session and sports drink.
- On a phone the shelves are six cards; a card opens Try it on with Buy, a locker row opens the item.
- The hub's SHOP tab is the shop's front: the shopkeeper's line, the featured item, the rest of the week's stock as
  icons and prices, your player in their gear and what it adds up to on game day, and three doors. Its red dot means
  new stock you can afford that you haven't looked at. The Office's Gear tab opens the Pro Shop.

**Gear on your player** (in games, on the hub, in portraits and in pixel mode): shoes in the item's colors, socks (a
color and a stripe), the sleeve, a sweatband as a headband, wristbands. Insoles and a mouthguard don't show.

**The week's extras** (2.0 §4.3), once a week each: an ice bath (fatigue −20 now), a film session (their scouting
card shows 2 more of their tendencies) and a sports drink (+5% stamina for one game).
$20 in high school, $200 in college, $5,000 in the pros.

**Money.**

- **Family help** (2.0 §5.3): in high school your family chips in $15 every regular-season week, played or on the bench.
- **Lifestyle** pays every week now (§5.1) and costs upkeep: a car (hype +0.3 a week, $1,000 upkeep), a sports car (hype +0.8, $8,000), a house (confidence +0.1, $15,000) and a mansion (fame +0.2, $100,000). The one-off confidence and story card stay.
- The Codex's money and body pages say so; the first-time gear tip is new.

**Money (§5.3's test).** The career simulator prints the median cash by stage and what's left unspent at retirement,
before the endings (400 careers, seed 1, smart spending):

| Policy | End of high school | The pro start | At 25 | At 30 | At retirement | Earned | Unspent (after the endings) | Lifestyle upkeep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Typical | $0 | $13K | $2.2M | $25.1M | $38.5M | $159.9M | 24% (9%) | $6.4M |
| Great | $1,850 | $21K | $18.8M | $58.4M | $82.2M | $311.4M | 28% (14%) | $11.6M |

- Smart spending buys gear (a stock item for an empty slot, or a rarer one than it wears, while the money covers it
  twice over, four times in the pros; then the cheapest next level), the extras (an ice bath when tired, a drink and a
  film session before playoff and rivalry games) and lifestyle when the bank allows it (a car at $1M, a sports car at
  $5M, a house at $10M, a mansion at $30M; R7's policy waited for $80M and left 37% unspent).
- Seeds 2 and 3 give 28% and 28% (great) and 24% (typical).
- Two worthwhile buys you can't afford at once, at every stage (`tests/shop.js`): high school: all 15 of the buys fit in $1,000 one at a time, all of them cost $2,140; college: 18 of 18 within $5,000, all of them $31K; the pros: 20 of 20 within a rookie's $770K, all of them $2.80M.

**Staff balance on V11** (V10's test, the great policy): a smart staff +15.8% legacy over none (target +10–20%); every salaried role alone above none (nutrition +12.4%, mental +6.9%, skills +4.7%, physio +2.1%, strength +1.9%); the agent earns 4.0M more (1,200 careers a policy, seeds 1–3).

**The §1.1 table, recalibrated for gear.** A maxed kit is about +2.9 OVR on game day, and the AI wears none (no stat
help for the league). The first build moved four rows out of their bands:

| Step (600 careers a policy, seeds 1–3) | Typical: 5★ · titles · Hall of Fame | Great: 5★ · titles · Hall of Fame |
| --- | --- | --- |
| V10 | 19.3% · 0.40 · 3.7% | 63.0% · 1.73 · 34.8% |
| V11 as first built (collabs at Lv4, the drink halving fatigue, the film session +1 Defense and Shooting) | 25.8% · 0.55 · 6.5% | 71.8% · 2.35 · 47.7% |
| collabs arrive at Lv2 and level with the Road | 25.0% · 0.53 · 5.8% | 70.3% · 2.26 · 47.8% |
| + young AI players reach their ceilings in an offseason, more room for the next stars, the league's three best veterans +9/+7/+5, the rookie 3★ bar +1 | 18.7% · 0.41 · 4.2% | 65.8% · 1.98 · 39.2% |
| + the film session and the sports drink as 2.0 §4.3 has them; the Hall of Fame line 93 → 95 | 17.8% · 0.36 · 3.3% | 65.8% · 1.94 · 39.2% |
| the same on seeds 4–6 (held out) | 17.7% · 0.37 · 3.2% | 66.7% · 1.82 · 36.7% |

- A typical career also reached its first 3★ team a year sooner (median 25: too soon for "by 26–28"). Gear in college
  lifted its first 3★ offers from 17% to 22%; the rookie bars from 3★ up moved one point (106 → 107, ...): 16%, and
  the median age is 26 again (25 or younger: 48%).
- The pros' median stays 75 and their top three open at 87.5 (§1.2: about 74, stars 82–90).
- Tried and dropped: a stronger league all round (the median), more veterans boosted (+6, +5, +4, +3: typical careers
  fell to 12% and 0.16 titles), more room for every young AI player (the same), a bigger star edge, and fewer 5★ spots.


**Old saves.** F8's gear (`{ piece: level }`) becomes items: Basic, Pro and Elite are common, rare and epic at that
level; the ankle braces become a knee brace; when a recovery kit was there too, the better of the two is worn and the
other waits in the locker.

**Calls I made.**

- Rarity sets the top level (common Lv2, rare Lv3, epic Lv4): §5's "Lv1–Lv4, +1 a level" with rarity meaning
  something.
- Training: +5% practice XP a level (+20% at Lv4), never more than +20% in one rating. Recovery boots: fatigue −1 a
  game a level. A knee brace: injury risk −8% a level.
- The shop: six items a week, one featured at 25% off, one sold out in 35% of weeks (never the featured one). Rarity
  odds by stage: high school 60/35/5% (common/rare/epic), college 25/50/25%, the pros 15/40/45%.
- Collabs: Lv2 when they arrive, +1 to the ones you have with each later collab (`gear.sigStart`).
- The extras: $20, $200 and $5,000 a use. The sports drink's "+5% stamina": in a live game your stamina costs ÷ 1.05
  and it recovers × 1.05; in a simulated game, fatigue costs 5% less. The film session only shows 2 more tendencies.
- Lifestyle's weekly effects and upkeep as above; family help $15 a regular-season week in high school.
- Gear counts in games only, as F8's did: your OVR and value don't change. The AI wears none.
- Unspent cash is measured at retirement, before the endings (after them: about 9% and 14%).
- The shopkeepers (Mo, Rae, Jules) are invented, and the game never needs their pronouns.
- Every number is in `CONFIG.gear` (and `CONFIG.pro.lifestyle`); `CONFIG.career.proStars`, `aiGrowth`, `aiRoom`,
  `hofScore` and `CONFIG.franchise.rookieBar` moved (above).

**Tests.**

- `tests/shop.js` (new, 10 steps): the catalog and icons; the +4 cap (and the try-on's note), OVR and value
  untouched; the week's stock (six, no family twice, featured, NEW, sold out, a new week, rarities by stage); prices by
  stage, buying, upgrading, wearing, two training slots; the extras (the ice bath, the drink live and simulated, the
  film session's card); lifestyle's weekly effects and upkeep, family help, the Road's collabs and how they level; the
  look (shoes, socks, sleeve, headband, wristbands, the kit, the face cache, pixel mode); two buys you can't afford at
  once at every stage; the shop on a desktop and a phone.
- Smoke's F8 step is V11's now (the migration, the cap, the stock, buying and upgrading, training and recovery, the
  look, the pros, the screens), and its guide check reads the migrated sleeve's +2.
- Flow's Road check: the collab arrives at Lv2.
- The career simulator: the money line and a gear line; smart spending's gear, extras and lifestyle; `--gear=none`.
  Fixed on the way: R7's `rec.money` (a number) overwrote the new money record.
- The phone audit has 7 new cases: an amateur's locker and extras; a pro's shelves, try-on, locker, one item and
  extras.
- 18 screenshots in `shots/v11`.

**Suite.** Everything passed on the commit's build:

- smoke (desktop and phone, 137 steps), every mode, old saves (34), the dev tools, the phone audit (230 screens) and
  the Art Lab;
- shop (10 steps), the money line on both policies (above), staff (11 steps), the staff balance on both policies (+15.8%
  on the great one), school (8 steps), story (13 steps: 15 arcs, 72 choices), climb (9 steps: the pros' median 75, their
  top three 87.5), difficulty (the §1.1 table above), flow, gameplay, traits, steals, fixes, the HUD audit and the style
  mix;
- the full career (859 actions, retiring at 36 after 14 pro seasons), and the desktop and 1.25× text audits;
- the balance gate, the balance run, the career simulator (40 careers, none stuck) and the trait balance (400 careers ×
  3 seeds: Common +5%, Uncommon +14%, Rare +27%, Legendary +54%, every rarity in its band).

The suite's run failed one test, fixed above: **flow** read the hub's Shop tab for F8's rows ("Court shoes … Recovery
kit"); it reads the shop's three doors now (12 of 12 on a rerun). The desktop audit flagged five texts the font cut on
V11's own screens: the hub's shop doors (no sub-labels now), the Office's lifestyle lines (two lines each), the try-on's
"Replaces your …" (two lines) and the locker's game-day summary (up to six lines). The three UI audits were rerun on
the final build: 229–230 screens each, no flags; shop again 10 of 10.

Still open from V4: the style mix's Slashers drive on 46% of possessions against a 60% target (V14).

## V10 — Part 2: your staff (§4)

The fifth milestone of Part 2 (§4). The career is still 1v1 only. Staff are a pro thing: the agent you sign in college
comes along as your agent, and R7's trainer, private coach and nutrition & physio become staffers (below).

**Six roles, one person each.** An agent, a skills coach, a strength trainer, a physio, a nutritionist and a mental
coach. Each staffer has a pixel portrait, a 1–5★ tier, a personality and a salary a season.

- **Who will talk to you.** Three candidates a role, new every season (and after a hire or a firing). The best is the
  best tier your fame reaches: 1–2★ always, 3★ at fame 25, 4★ at 45, 5★ at 65.
- **Salaries** by tier: about $200K, $600K, $1.5M, $3M and $5M a season (±10%). A Loyal staffer costs ×0.95, an
  Ambitious one ×1.05. A rookie (~$0.8M) can afford one 1–2★; a full 3–4★ staff is $7.5–15M, most of a mid-career
  salary. The agent takes a cut instead: 3–10% of your salary and sponsors.
- **Hiring** takes a season's salary in the bank. The pay comes out every week.
- **Contracts** run two seasons. One that's up waits in the offseason: re-sign at +10% or let them go for free. Do
  nothing and they re-sign when the next season starts.
- **Letting someone go early** costs a buyout of a quarter of a season's salary. The staff room asks first.
- **When the money runs out,** everyone on a salary leaves (the agent stays). The news says so.

**What they do** (1★ … 5★; every number is in `CONFIG.staff`):

| Role | Effect |
| --- | --- |
| Agent | Contracts +5/10/13/16/20% for a cut of 3/4/6/8/10%. 3★+: a fourth club in free agency (a rebuild that starts you). 4★+: a third sponsor offer on the table (and offers ×1.5 as likely), and they handle a trade request: it costs no hype |
| Skills coach | +10/15/21/28/35% XP in the two skills you pick (games and practice). 3★+: signature moves unlock 5 rating points sooner. Every tier: scouting tips on the pregame screen |
| Strength trainer | Fatigue −2/3/4/5/6 after every game week, twice that in a Rest week. Speed, Hops and Strength ceilings +5 at 4★, +10 at 5★ |
| Physio | Injury risk −15/22/30/37/45%. Injuries end 1/1/1/2/2 games sooner (never under one game). The odds an injury costs rating points −30/40/50/60/75% |
| Nutritionist | The fatigue a game costs −10/14/18/21/25%. Speed and Hops start to fade 1 year later from 3★, 2 at 5★ (your skills age as before) |
| Mental coach | The confidence a loss costs −15/20/25/30/40%. Your shots in the last 15 s +3/4/5/6.5/8% (in a simulated game, 4 OVR points per 1.0 of it). A slump also ends on a C+ game (4★+: a C) |

**Personalities.** Agents: Straight shooter, Shark (+2% on contracts, +1% cut), Loyal (−1% cut) and Shady (+5% on
contracts, and scandals). Everyone else: Old school, Analytics, Players' coach, Drill sergeant, Loyal (never takes
another club's call) and Ambitious (twice as likely to). Each has a line on the card.

**The story's calls.**

- **A rival's call.** Halfway through each season every 3★+ staffer who isn't the agent may get a call from a rival club
  (20% each, Ambitious twice as often, Loyal never; one call a season). The staffer comes to you: match the offer
  (+25% salary, the default) or let them go (the job is open at once).
- **A scandal.** A shady agent can make the news (25% a season, at a seeded week). Stand by them (hype −10, you keep
  their deals) or fire them (hype −5, the default).
- Both are dialog cards with the staffer's (or the reporter's) portrait. The answer's outcome shows on the card.

**The staff room.** From the hub's TEAM tab (its line says how many are hired, or that a contract is up), the Career
menu and the Office's Staff tab ("Open the staff room").

- On a desktop: the six roles down the left (the one you're looking at is gold), the staffer's card on the right (their
  personality, pay, years left, buyout and what they do at their tier, with Let go, Re-sign and the skills coach's two
  skills) and the three candidates under it, each with a Hire button. A candidate you can't hire yet says why ("Needs
  fame 45", "Needs $2.99M").
- On a phone: the six roles, then one role with your staffer on top and the candidates as three cards you tap to hire.
- The Codex has a "Your staff" page: every role's numbers by tier, read from CONFIG, and who you have.

**Old saves.** R7's staff become staffers when a save loads:

- the personal trainer (1–3) becomes a skills coach a star higher (2–4★), one more with the private coach (at most 4★;
  the private coach alone: 2★);
- nutrition & physio become a 3★ physio and a 3★ nutritionist;
- R6's four old roles go through R7's step first (their best becomes the trainer's tier);
- the agent you signed in college becomes a 2★ Straight shooter with the same name.

**Balance.** Part 2 §4: "a 'smart spending' policy beats 'no spending' by 10–20% legacy, and every role is worth
hiring." `tests/staffbalance.js` runs the career simulator with no staff, with smart spending and with each role
alone, on the same careers. Smart spending hires the best agent who isn't shady, then the skills coach, the mental
coach, the nutritionist, the physio and the strength trainer, each the best tier that fits half the salary.

Read on the great policy, as the trait balance is (400 careers × 3 seeds a row):

| Staff | Legacy | vs none | Titles | Hall of Fame | 5★ team | Injuries | Earned | On staff | Net worth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nobody | 75.2 | — | 1.47 | 29% | 58% | 2.25 | $259.8M | $0.0M | $258.7M |
| smart spending | 85.0 | +13.1% | 1.78 | 35% | 63% | 1.69 | $290.0M | $169.6M | $106.2M |
| the agent alone | 75.6 | +0.5% | 1.48 | 29% | 59% | 2.24 | $275.4M | $0.0M | $274.1M |
| the skills coach alone | 77.2 | +2.7% | 1.53 | 30% | 59% | 2.24 | $264.5M | $75.2M | $176.4M |
| the strength trainer alone | 76.1 | +1.3% | 1.48 | 29% | 58% | 1.79 | $262.3M | $75.1M | $174.5M |
| the physio alone | 75.4 | +0.2% | 1.47 | 29% | 58% | 1.70 | $262.0M | $75.4M | $174.3M |
| the nutritionist alone | 83.6 | +11.3% | 1.73 | 35% | 63% | 2.05 | $274.0M | $80.8M | $182.6M |
| the mental coach alone | 79.2 | +5.4% | 1.63 | 32% | 60% | 2.28 | $267.3M | $75.5M | $176.6M |

- The band is read on the great policy for the trait balance's reason (V6). A typical career's legacy is mostly its
  seasons and points, which staff barely move. On the typical policy smart spending adds +6.1% legacy, but its titles
  rise 29% and its Hall of Fame rate goes from 2% to 3%:

| Staff | Legacy | vs none | Titles | Hall of Fame | 5★ team | Injuries | Earned | On staff | Net worth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nobody | 38.2 | — | 0.28 | 2% | 14% | 1.90 | $140.0M | $0.0M | $138.8M |
| smart spending | 40.6 | +6.1% | 0.36 | 3% | 18% | 1.60 | $150.7M | $84.3M | $62.7M |
| the agent alone | 38.4 | +0.4% | 0.29 | 2% | 14% | 1.89 | $147.3M | $0.0M | $145.8M |
| the skills coach alone | 38.9 | +1.8% | 0.31 | 3% | 16% | 1.88 | $141.4M | $44.5M | $92.0M |
| the strength trainer alone | 38.2 | -0.2% | 0.28 | 2% | 14% | 1.56 | $140.1M | $44.2M | $92.4M |
| the physio alone | 38.4 | +0.3% | 0.29 | 2% | 14% | 1.51 | $140.6M | $44.0M | $92.3M |
| the nutritionist alone | 40.1 | +4.8% | 0.34 | 3% | 16% | 1.77 | $143.5M | $44.3M | $94.5M |
| the mental coach alone | 39.2 | +2.5% | 0.31 | 2% | 16% | 1.91 | $140.9M | $44.5M | $92.4M |

- The agent's job is money: alone, no legacy to speak of, but $15.6M more earned over a great career. The test judges
  it on earnings.
- The physio and the strength trainer are insurance: injuries −20 to −24%, legacy +0.2% and +1.3%.
- On the typical policy the strength trainer alone comes out at −0.2% legacy, inside the noise, with injuries −18%.
  The typical run reports each role; it judges smart spending over none and the agent's money (the great run judges
  every role).

**The §1.1 table, recalibrated.** The new staff made a smart spender's career better than R7's staff did, and the
table moved out of its bands. The league got tougher to bring it back, without moving its median (§1.2: pros about
74):

| Step (600 careers a policy, seeds 1–3) | Typical: 5★ · titles · Hall of Fame | Great: 5★ · titles · Hall of Fame |
| --- | --- | --- |
| V9 (R7's staff) | 17.7% · 0.34 · 3.3% | 64.0% · 2.00 · 39.8% |
| V10, no staff hired | 16.3% · 0.32 · 1.8% | 61.5% · 1.79 · 35.7% |
| V10, smart spending | 20.8% · 0.47 · 4.3% | 69.3% · 2.24 · 45.2% |
| + the agent no longer lifts a trade a star; the mental coach's simulated clutch at half the Mentor's rate | 21.0% · 0.48 · 3.7% | 66.3% · 2.23 · 43.8% |
| + the league's three best veterans +4, +3 and +2; young AI players grow faster; the Hall of Fame line 95 → 93 | 19.3% · 0.40 · 3.7% | 63.0% · 1.73 · 34.8% |
| the same on seeds 4–6 (held out) | 14.8% · 0.34 · 3.7% | 64.2% · 1.82 · 36.2% |

- Seeds 4–6 put the typical 5★ share at 14.8%, a hair under its band; over all six seeds it is 17.1% (titles 0.37,
  the Hall of Fame 3.7%; great careers 63.6% · 1.78 · 35.5%).
- The league's stars: `career.proStars` [4, 3, 2] adds to the three best veterans' ratings and ceilings when a league is
  made. Its top three open near 85 (83 before; §1.2: stars 82–90) and the median stays at 75.
- The bar keeps rising (§1.2: "Leagues refresh every season"): `career.aiGrowth` 0.45 → 0.75, the share of the gap to
  its ceiling a young AI player closes each offseason. The other players' mean OVR goes 75.3 after a first pro season,
  77.4 after five and 77.7 after ten (75.3, 76.6 and 77.1 before).
- Tried and dropped:
  - a stronger league all round (veterans' mean OVR 80 → 85). It fit the table, but the league then opened at a 78
    median, against §1.2's "about 74". The climb test caught it.
  - slower pro growth for you (`ageXpMul` 26–31): it barely moved the table.
  - a bigger star edge, more stars (+6, +5, +4), and the stars alone: each pushed a row out of its band.
- Typical careers' Hall of Fame rate barely moves with the line: about 5% of them break out, with legacies of 90–200,
  and the rest stay under 65. The line moves great careers about a point per point.

**Calls I made.**

- "Unlocks signature moves 1 rating earlier" is one of the ratings' 5-point steps; "+1 to +2 physical headroom" is one
  or two of them (+5, +10).
- "Handles trade requests": a 4★+ agent's trade request costs no hype. A first version let it reach a franchise a star
  higher, which broke §1.3's 5★ scarcity.
- "More teams interested" is the fourth free-agency club; "endorsement deals" are a third offer on the table.
- The nutritionist's later aging is the body's (Speed and Hops). Delaying all of it made one role worth more than the
  whole smart staff (+19.7% alone).
- Staff can't be hired by an amateur. Every effect reads the holder's staff, so the shared week code does nothing for
  high school and college.
- A buyout, and hiring over someone mid-contract, ask first.

**Removed.** R7's staff (`hireStaff`, `proHire`, `proTrainerMul`, `proCoachMul`, `proNutrition`) and its CONFIG
(`pro.trainerXp`, `trainerCost`, `coachXp`, `coachCost`, `nutritionCost`, `nutritionInjury`, `nutritionRegen`,
`nutritionAging`, `week.restPhysio`), and `offseasonDevelop`'s chance to skip a decline step.

**Also.**

- A two-answer dialog's note sits lower under its label on a desktop when it fits in two lines.
- The scandal card's agent is "the agency", not "him".

**CONFIG** (all new unless marked):

- `staff`: `roles`, `salary` [0, 200K, 600K, 1.5M, 3M, 5M], `salaryJitter` 0.1, `fameFor` [0, 0, 0, 25, 45, 65],
  `years` 2, `raise` 0.1, `buyout` 0.25, `pool` 3.
- The agent: `agentRaise` [0, .05, .1, .13, .16, .2], `agentCut` [0, .03, .04, .06, .08, .1], `agentOfferAt` 3,
  `agentSponsorAt` 4, `agentTradeAt` 4, `shadyRaise` 0.05, `scandalOdds` 0.25, `scandalHype` 10, `sharkRaise` 0.02,
  `sharkCut` 0.01, `loyalCut` 0.01.
- The skills coach: `skillsXp` [0, .1, .15, .21, .28, .35], `movesEarlyAt` 3, `movesEarly` 5, `tipsAt` 1.
- The strength trainer: `strengthCaps` [0, 0, 0, 0, 5, 10], `strengthRegen` [0, 2, 3, 4, 5, 6].
- The physio: `physioInjury` [0, .15, .22, .3, .37, .45], `physioFaster` [0, 1, 1, 1, 2, 2], `physioLoss` [0, .3, .4,
  .5, .6, .75].
- The nutritionist: `nutritionFatigue` [0, .1, .14, .18, .21, .25], `nutritionAging` [0, 0, 0, 1, 1, 2].
- The mental coach: `mentalConf` [0, .15, .2, .25, .3, .4], `mentalClutch` [0, .03, .04, .05, .065, .08],
  `mentalSimOvr` 4, `mentalSlump` [0, 1, 1, 1, 2, 2].
- The calls: `poachOdds` 0.2, `poachRaise` 0.25, `loyalSalary` 0.95, `ambitiousSalary` 1.05.
- `career.proStars` [4, 3, 2] (new), `career.aiGrowth` 0.45 → 0.75 and `career.hofScore` 95 → 93 (above). `career.proMean`
  stays 80.

**Tests.**

- `tests/staff.js` (new, 11 steps):
  - the pools, tiers and salaries;
  - hiring, the money it takes, buyouts;
  - contracts and re-signing;
  - salaries every week, the agent's cut, money running out;
  - each role's effects (the agent's four, the skills coach's XP, moves and tips, the strength trainer's ceilings and
    recovery, the physio, the nutritionist, the mental coach in sims and in the engine);
  - the rival's call and the scandal, both answers, and how often they come;
  - every old staff shape and a v2 round trip;
  - the staff room on a desktop and a phone.
- `tests/staffbalance.js` (new): the table above, run in the suite on both policies.
- Smoke's R7 pro-and-money step checks the six roles in place of R7's three, and the old-save step reads the
  migrated staff. Climb's injury step uses the physio.
- The career simulator: `--staff=only:<role>`, `--staffBudget=` and a staff line (each role's share of seasons and its
  mean tier). `--spend=none` hires nobody. `tests/difficulty.js` passes `--spend`, `--staff` and `--staffBudget` on.
- The phone audit has 13 new cases: the staff room empty and staffed, a role empty, the skills coach, a contract that's
  up, the agent, the buyout question, the Office's tab, the rival's call and the scandal with their answers. It also has
  the Codex's staff page, for amateurs and pros.

**Suite.** Everything passed on the commit's build:

- smoke (desktop and phone, 137 steps), every mode, old saves (34), the dev tools, the phone audit (223 screens) and
  the Art Lab;
- staff (11 steps), the staff balance on both policies (the tables above), school (8 steps), story (13 steps: 15 arcs,
  72 choices), climb (9 steps: the pros' median 75, their top three 85.2), difficulty (the §1.1 table above), flow,
  gameplay, traits, steals, fixes, the HUD audit and the style mix;
- the full career (897 actions, retiring at 36 after 14 pro seasons), and the desktop and 1.25× text audits;
- the balance gate, the balance run, the career simulator (40 careers, none stuck) and the trait balance (400 careers ×
  3 seeds: Common +4%, Uncommon +11%, Rare +25%, Legendary +54%, every rarity in its band).

The first run of the suite failed two tests, and both are fixed above:

- **smoke**: its old-save step read the R6 offseason save's staff in R7's shape. It reads the six roles now.
- **climb**: the pros' median came out at 78 against §1.2's "about 74", from the veterans' mean OVR going 80 → 85.
  That change is gone; the league's stars and its faster growth do the work instead (the §1.1 section above).

Two Codex lines changed after the second run had started: the injury lines name the physio (not R7's nutrition &
physio), and the staff page's first line is shorter for amateurs (the desktop audit cut it). The three UI audits were
rerun on the final build: 222–223 screens each, no flags.

Still open from V4: the style mix's Slashers drive on 46% of possessions against a 60% target (V14).

## V9 — Part 2: GPA and school (§3)

The fourth milestone of Part 2 (§3, with Academic Probation from §2.3). The career is still 1v1 only. Old saves keep their
grades. A college career from before V9 is grandfathered on a full ride; its seasons count toward the degree, and it
picks a major the first time it loads.

**One GPA, high school through college.** It runs from 0.0 to 4.0.

- Every game week takes 0.05 off, or 0.06 in a major's harder classes. A Study week adds 0.3.
- Under 2.3 your coach makes the week a Study week (AUTO).
- College weeks can be Study weeks now too: the choice sits behind Rest, as in high school.

**Exam weeks.** A season is a semester. Midterms come after the fifth game at both levels, and finals before the last
regular-season game. Each comes with a card first:

| Choice | Effect |
| --- | --- |
| Cram | GPA +0.3 · fatigue +15 · practice XP −50% this week |
| Balanced (the default) | GPA +0.12 · practice as usual |
| Skip the studying | GPA −0.2 · practice XP +15% this week |

- The report card follows your pick. It replaces R5's two report cards.
- "Sim the rest of the season" answers Balanced. "Sim to next big moment" stops for the card.

**Eligibility.**

- A report card under 2.0 sits you 2 games, in high school and in college.
- In college, under 1.5 opens **Academic Probation**, the fifteenth arc. You choose a study sprint (GPA +0.5, practice
  XP −30% for 3 weeks) or risk it.
  - Still under 2.0 at the next report card, sprint or not: the scholarship goes (full tuition from then on) and you
    sit 2 more games.
  - Back over 2.0: you're off probation.
- High school has no probation.

**Offers need grades.** Every program has a GPA line: blue bloods 2.5, elite academic programs 3.3, everyone else 2.0.

- No offer comes under a program's line, and a report card under it pulls that offer ("grades").
- This replaces R5's strict colleges, the 25% that pulled an offer at 2.0. Old offers keep their old rule.
- Nobody ends up with no offer. Under every line there is a small school's conditional admission.
- The recruiting screen lists each offer's line, and a pulled one in red. The commitment board shows each line.
  - The board holds your best four offers: an elite academic offer can push the smallest school off.
  - Its cards use short labels (Level, GPA, Depth, Conf., Scouts, Gym, Coach), so every value fits. On a phone, Gym
    and Coach share a row until you visit.

**Elite academic programs.** Ashford University, Whitcombe College and Larkspur Institute (invented).

- They play power-conference basketball and offer to a 3.3 student whom a mid-major or better wants.
- Scouts follow them: draft-stock moves are ×1.15. So do sponsors: NIL deals are ×1.3.
- They open the best version of the booth's and the front office's endings.

**Scholarships and tuition.**

- A full ride takes a 3.5 GPA and four stars at commitment.
- Otherwise the scholarship is partial: you pay $6,000 a college season (half of $12,000). It's due when each season
  starts, the first included. A lost scholarship costs the full $12,000.
- Short of cash, the rest is a student loan. At the draft, the money you have pays it, and your first paychecks pay
  the rest. Your money never goes negative for it.

**Majors and the degree.**

- You pick a major at commitment, on a card:
  - Business: NIL deals +10%.
  - Communications: hype +5.
  - Kinesiology: college practice XP +3%.
  - Undecided (the default): easier classes, no path yet.
- A degree takes 4 college seasons. In the pros, summer classes add a year each offseason: $20,000, and practice XP
  −10% for the first 4 weeks of the next season.
- The major and the degree pick the ending's version. The epilogue screen says which, and why:

  | Ending | Best version, and what opens it | Otherwise |
  | --- | --- | --- |
  | Coach | Head coach, your own bench: a Kinesiology degree | Coach: an assistant |
  | Broadcaster | In the booth, the Finals on national TV: a Communications degree, or an elite academic school | On the radio: local games |
  | Owner (the stake) | Team president, the front office: a Business degree, or an elite academic school | Owner: a seat courtside |

**Where you see it.**

- The hub shows your GPA next to the eligibility line: "GPA 2.84 (B−) · eligible at 2.0+". On a desktop it's on the
  Play tab's week line; on a phone, under the VS.
- The ME tab shows the GPA with your scholarship, and the degree with any loan, in college and in the pros.
- The Codex covers the GPA, College offers and money, and (in the pros) Your degree, all with exact numbers.

**What it does to a career.** The career simulator, 600 careers per column (seeds 1–3, 200 each). Typical and great
take AUTO's Study weeks and Balanced exams. The new `--school=student` policy crams every exam and studies under 3.6:

| Per career | Typical | Great | Student, typical | Student, great |
| --- | --- | --- | --- | --- |
| Study weeks: high school · college | 2.2 · 3.4 | 2.7 · 2.5 | 3.3 · 0.5 | 3.6 · 0.4 |
| Games ineligible | 0 | 0 | 0 | 0 |
| GPA at the draft (median) | 2.40 | 2.39 | 3.85 | 3.78 |
| A full ride | 0% | 0% | 18% | 59% |
| Commits to an elite academic program | 0% | 0% | 93% | 100% |
| Tuition paid (mean) | $16,590 | $11,130 | $14,230 | $5,820 |
| A loan at the draft (its median) | 100% ($11,100) | 100% ($6,300) | 83% ($11,700) | 41% ($8,500) |
| A degree (4 college seasons) | 4% | 1% | 4% | 0% |

- **A typical student commits** to an elite academic program, gets benched there and transfers down through the
  portal. A great student stays: 68% are still there at the draft.
- **Nobody here falls under 2.0** at a report card: AUTO's Study weeks start at 2.3. Probation takes a player who skips
  the work, and `tests/school.js` plays it out.

- **The §1.1 table still passes** with the default policies: typical 17.7% reach a 5★ team, 0.34 titles, 3.3% Hall of
  Fame; great 64.0%, 2.00 and 39.8%.
- **School pays off a little.** On the same seeds, by the simulator's own read, a student does a little better than the default
  policy:

  | | 5★ team | Titles | Hall of Fame |
  | --- | --- | --- | --- |
  | Typical | 18.0% | 0.34 | 3.7% |
  | Student, typical | 22.0% | 0.44 | 4.7% |
  | Great | 64.3% | 1.99 | 40.0% |
  | Student, great | 65.7% | 2.12 | 42.7% |

  The price is more Study weeks in high school and the Cram weeks' lost practice. The reward is a better program and
  less tuition.
- **Two calls along the way.**
  - The simulator now studies in college the way AUTO does. Without it, its college players fell under 2.0 (6.9 games
    on the bench a career), and typical titles read 0.42, outside the band.
  - Cram went from +0.35 GPA for −30% of a week's practice to +0.3 for −50%. At first it was about four times cheaper per
    GPA point than a Study week, so the student policy lost less practice than AUTO.

**Smaller fixes.**

- A career's first college season charged no tuition, because the scholarship was set after the season started.
- A dialog with four answers is a 2×2 grid, desktop and phone. A two-answer button on a desktop is 12 px taller. Notes
  get as many lines as their button holds (the pixel font's lines are about 24 px).
- The epilogue's FINISH sits under the choices; the notes beside them gained a degree line.
- On a phone, the transfer portal reads "#2 to begin" (it was cut off). Draft stock with no graded game yet reads "No
  grade yet: play a college game."
- The desktop Play tab's week line takes three rows: the plan, the fatigue, the GPA.

**Tuning numbers** (all in CONFIG, each with its comment):

- `school.exam`: cram [0.3, 15, −0.5], balanced [0.12, 0, 0], skip [−0.2, 0, 0.15].
- `school`, exams and grades:
  - `collegeMidWeek` 5 and `probationAt` 1.5;
  - `gpaReq` (other 2.0, blue 2.5, academic 3.3).
- `school`, elite academic programs: the `academic` names, `academicExposure` 1.15 and `academicNil` 1.3.
- `school`, money: `fullRideGpa` 3.5, `fullRideStars` 4, `tuition` 12,000 and `partialShare` 0.5.
- `school`, majors: `majorNil` 0.1, `majorHype` 5, `majorXp` 0.03 and `majorDrift` 0.01.
- `school`, the degree: `degreeYears` 4, `summerCost` 20,000 and `summerXp` [−0.1, 4].
- `saga.chance.probation` 0.9, and `saga.probSprint` 0.5, `probSprintXp` [−0.3, 3] and `probGames` 2.
- Removed: `hs.strictOdds` (R5's strict colleges).

**Tests.**

- `tests/school.js` (new) has 8 steps:
  - the GPA lines, over 320 recruits and about 1,000 offers: no offer under its line, an elite academic offer only
    from 3.3, never no offer;
  - pulled offers;
  - the exam cards at both levels: when they come, what each answer does, and that the report card follows;
  - eligibility at both levels, and drift with and without a major;
  - probation, both answers;
  - tuition (a full ride, partial, lost), the loan and its repayment, and the handoff;
  - the majors' effects, the degree, summer classes and every ending's version;
  - old saves.
- Smoke's R5 step checks the GPA lines in place of R5's strict colleges. Its Codex step reads the letter grade.
- The story test reads 15 arcs and 96 templates.
- The career simulator has a school line: scholarships, elite academic commitments, tuition, loans, Study weeks at
  each level, ineligible games, probation, GPA at the draft and degrees. It also has `--school=student`.
- The phone audit has 12 new cases: the exam card and its answer, the GPA lines on the recruiting screen, the major's
  card and its answer, the ME tab's degree, finals week, both probation beats, summer classes and the ending's best
  version.

**Suite.** Everything passed on the commit's build:

- smoke (desktop and phone, 137 steps), every mode, old saves (34), the dev tools, the phone audit and the Art Lab;
- school (8 steps), story (13 steps: 15 arcs, 96 templates), climb, difficulty (the §1.1 table above), flow, gameplay,
  traits, steals, fixes, the HUD audit and the style mix;
- the full career (879 actions, retiring at 35 after 13 pro seasons), and the desktop and 1.25× text audits (no flags);
- the balance gate, the balance run, the career simulator (40 careers, none stuck) and the trait balance (400 careers ×
  3 seeds: Common +7%, Uncommon +12%, Rare +28%, Legendary +60%, every rarity in its band).

Two tests failed on the first run and passed when rerun on the same build:

- **flow**: its Quick results step needs a routine week, and seed 55 had a story card every week. The step now turns
  the optional cards off first (the arcs skipped, the beats spent, the press quiet), as the rule it checks is about
  routine weeks. 12 of 12.
- **fixes**: one pixel of the player changed when the 3-point racks were drawn (1 of 66,580). It passed 15 of 15 on the
  rerun; the intermittent pixel is a follow-up.

Still open from V4: the style mix's Slashers drive on 46% of possessions against a 60% target (V14).

## V8 — Part 2: the rest of the story, six endings and the Story so far; 2.0: ceremonies and the record book

The third milestone of Part 2 (§2.3–2.4), with 2.0's §4.9. The career is still 1v1 only. Old saves keep their saga and
pick up the new arcs from wherever the career is. Their record book starts from the career highs they already kept.

**Nine more arcs (§2.3).** Fourteen in all. Every choice trades one thing for another and says both, and flags carry
it forward.

| Arc | Act | What happens |
| --- | --- | --- |
| The Rival | I–III | After the buzzer of your first meeting, on another program in college, and in the PBL. At +25 (`saga.respectAt`) the rivalry turns to respect. |
| The Cameras | II | Hype against focus. A streaming crew wants your season: sign (+$1,500, hype +8, practice XP −10% for 3 weeks) or no cameras (coach trust +5, practice XP +5% for 2 weeks). Then episode three, or nobody filmed it, and the finale at home. |
| The Journalist | II–III | The long interview. The column's tone follows the meter: a feature at +25, a hit piece at −25 (answer it, or let it go for hype −6). The last column at retirement. |
| The Owner | III | Win-now, patient or cheap. Promise a playoff run or the work. Mid-season: play through it, pay the recovery staff yourself ($50,000), or talk about the future. The verdict: a promise kept (owner +20) or broken (−20). |
| The Trade Demand | III | Told when you're unhappy (R7's trade check: the bench, the coach's trust, the losing). Demand it publicly (traded, hype +5, owner −30), quietly (traded, owner −10) or stay and fight (coach trust +5, owner +10, confidence −1). It replaces R7's UNHAPPY card that time. |
| Contract Year | III | The last season of a deal. Play for the bag (game XP +15% that season, coach trust −5, your next market value +10%) or team first (coach trust +5, owner +10, your club's next offer +5%). |
| Finals Rematch | III | The final against your rival: a pregame cutscene on the Finals court, and an ending the story locks (the handshake, the last word, next year). It stands in for R9's finals card. |
| Passing the Torch | III, from 32 | A kid at your clinic. Take them under your wing (practice XP −10% for 3 weeks) and at retirement they carry it on: your next career gets a Legacy Start (every ceiling +3; a youth academy still gives +5). |
| Father Time | III, from 31 | The first step goes. Change your game (Speed −2, Shooting +2, for good) or fight it (fatigue +15, practice XP −10% for 3 weeks). Then the new kid who wants your minutes, and "how many more?" at dinner. |

- **The result screen** shows the contract year's bonus next to the grade's ("Game XP: grade B ×1.2 · contract year ×1.15").
- **Two new hooks.** 'unhappy' runs from R7's trade check, and 'retire' at retirement.

**How a career's arcs land.** The career simulator, 600 careers each (seeds 1–3, 200 each):

| | Typical | Great | Typical, random answers |
| --- | --- | --- | --- |
| Arcs per career | 6.38 | 6.39 | 6.37 |
| Careers with 6–8 | 84% | 85% | 84% |
| Beats per career | 18.5 | 18.5 | 19.2 |

- **Most and least common.** Family Bills is the most common (61%). The Finals Rematch is the least (3% typical, 7%
  great): it needs your rival in the final.
- **None above 70%.** The Trade Demand's chance went from 0.7 to 0.6: at 0.7 it played in 71% of typical careers. Now
  it's 57%.
- **Under 6.** The careers with fewer arcs are mostly short ones; a career that retires early has fewer act III seasons.

**Six endings (§2.3).** At retirement the story ends the first way that fits:

| Ending | When | The scene |
| --- | --- | --- |
| Passing the Torch | you took the kid under your wing | your old high school gym |
| The Legend | the Hall of Fame and a title | the Finals court |
| Two Old Rivals | your rival at +25, peace made | the gym where you met |
| Home | your family at +20 | the kitchen table |
| The Long Road | three clubs or more (`saga.roadClubs`) | the tunnel |
| The Work | everyone else | the gym, Saturday morning |

- **When retirement comes**, the 'retire' beats play first (the journalist's last column, the kid). Then the ending, as
  a cutscene, before the epilogue's money screen. The legacy screen names it, and the saga keeps it.
- **Every ending is reachable.** `tests/story.js` reaches each one. The simulator's new `--story=random` answers every
  card at random (seeded). Over 600 typical careers it reaches all six:

  | Ending | Share |
  | --- | --- |
  | The Long Road | 37% |
  | The Work | 21% |
  | Passing the Torch | 16% |
  | Home | 16% |
  | Two Old Rivals | 7% |
  | The Legend | 3% |

  With the default answers, The Long Road 63%, The Work 34%, The Legend 4%. The great policy reaches The Legend in 39%.

**THE STORY SO FAR (§2.4).** On the ME tab, next to a new Records button:

- **The timeline.** Each arc under its act (I Nobody, II The Rise, III Legacy), GOING ON or DONE. Under it, each scene
  with your age and what you chose, and at the end the story's ending.
- **Your people.** Everyone you've met, each with a portrait and a meter from −100 to 100.
- **On a phone** the two are separate views, with a button to switch.

**Ceremonies (2.0 §4.9).**

- **Awards night** closes a season you won something in. In the pros it reads the league's awards (MVP, Defensive Player,
  Rookie, Most Improved, Scoring, Finals MVP, All-League) with yours in gold, and your player on the podium. In school,
  your season's awards, before the recap.
- **The All-Stars**: when you're picked, the four cards are revealed one at a time, yours stamped ALL-STAR, before the
  weekend.
- **The Hall of Fame induction**: a Hall of Fame career is inducted before the legacy screen. Your pixel player stands on
  a stage under the lights, with the career's highlights rolling up beside them.
- **Each one** reveals a line at a time. A tap shows the rest, and Reduce Motion shows everything at once.

**The record book (2.0 §4.9).** It's on the ME tab.

- **Your best game at each level**: points, rebounds, steals, blocks and threes, for high school, college and the PBL.
- **The levels' records**: the state's, the college game's and the PBL's, held by invented names from before your time
  (`records.levels`).
  - Breaking one puts your name in the book, the news and the timeline.
  - A simulated amateur game tops out at 20 points (`career.simWinPts` × 1.25), so the points records take a game you
    play. The rest fall in 1–5% of simulated careers: 5.5% of typical careers break one, 8.7% of great ones.
- **A gold toast** says when a record falls, or a career high (from 3 up, `records.minToast`). They queue, one at a
  time, and wait out a game in play.

**60+ story templates (2.0 §4.9).** There are 93 now: R9's 22 cards, 17 trait beats, 48 saga beats and 6 endings.

- **Two new cards react to your team's stars.** The Big Stage: your club gained stars over the summer. Own the spotlight
  (hype +5, practice XP −5% this week) or stay in your lane. The Rebuild: it lost them. Lead the young guys (coach trust
  +5, confidence −1) or keep your options open.
- **The rest already reacted.** Your traits (their beats), your rival (The Rival, the Finals Rematch, R9's moments) and
  your hype (the spotlight, the cameras).

**The Hall of Fame line: 92 → 95.** The fourteen arcs' safe answers add a little coach trust and practice over a career.
That lifted the great policy's Hall of Fame rate past its band. At 92 the rates were typical 4.3% and great 41.0%; with
the saga switched off, great was 37.8%. At 95, typical 3.8% and great 39.3%, and the §1.1 table passes again:

| Milestone | Typical | Great |
| --- | --- | --- |
| Reaches a 5★ team | 16.5% | 64.7% |
| Championships per career | 0.39 | 2.02 |
| Hall of Fame | 3.8% | 39.3% |

**Tuning numbers** (all in CONFIG, each with its comment):

- `saga.chance`:
  - rival 0.65;
  - cameras 0.55;
  - journalist 0.6;
  - owner 0.6;
  - trade 0.6;
  - contract 0.6;
  - finals 0.9;
  - torch 0.6;
  - aging 0.6.
- `saga`, the rival and the cameras:
  - `respectAt` 25 and `rivalProBy` 3;
  - `camCash` 1,500 and `camHype` 8.
- `saga`, the journalist and the owner:
  - `toneAt` 25 and `pieceHype` 6;
  - `staffCost` 50,000 and `ownerFondAt` 25.
- `saga`, Contract Year: `bagXp` 0.15, `bagRaise` 0.1 and `teamRaise` 0.05.
- `saga`, Passing the Torch and Father Time: `torchAge` 32, `torchCaps` 3, `agingAge` 31 and `agingSwap` 2.
- `saga.roadClubs` 3.
- `records`: `minToast` 3, and the `levels` table (value, holder, year).
- `story.starsHype` 5, and `career.hofScore` 95.

**Tests.**

- `tests/story.js` has 13 steps; 6 are new:
  - the arcs' effects (the trade demand in R7's place, the bag and the raise, the swap, the finals card);
  - every ending reachable, the retirement cutscene, the ending kept through a save and a reload, the torch's Legacy
    Start;
  - the Story so far;
  - the ceremonies;
  - the record book and its toasts;
  - the template count and the team-stars cards.
- The career simulator reports arcs per career with the share in 6–8, every arc from most to least common, and the
  endings. `--story=random` reaches every ending.
- The phone audit has 15 new cases: the Story so far (both views), the record book (both views), awards night (school
  and pros), the All-Star reveal, the Trade Demand's three answers, an ending and the Hall of Fame induction.
  - A toast is an overlay, so the audit clears it before measuring a screen. A record broken in its scripted career
    would otherwise cover the next screens.
- The smoke, old-save and full-career drivers know the new screens. The full UI career goes through awards night and
  the All-Star reveal.
- The trait balance now pools 3 seeds in the suite (400 careers each).

**Suite.** Everything passed on the commit's build:

- smoke (desktop and phone, 137 steps), every mode, old saves (34), the dev tools, the phone audit and the Art Lab;
- story (13 steps), climb, difficulty (the §1.1 table above), flow, gameplay, traits, steals, fixes, the HUD audit and
  the style mix;
- the full career (804 actions, through awards night and the All-Star reveal, retiring at 35 after 13 pro seasons), and
  the desktop and 1.25× text audits (no flags);
- the balance gate, the balance run, the career simulator (40 careers, none stuck) and the trait balance (400 careers ×
  3 seeds: Common +4%, Uncommon +14%, Rare +28%, Legendary +56%, every rarity in its band).

Before the run, three drivers learned the new screens: the full career, the old saves and smoke didn't know awards night,
the All-Star reveal or the induction, and stopped at them. The Hall of Fame line moved to 95 (above) after the first
difficulty run read great careers at 41.0%.

Still open from V4: the style mix's Slashers drive on 46% of possessions against a 60% target (V14).

## V7 — Part 2: the story engine and the first five arcs (Part 2 §2)

The second milestone of Part 2. The career is still 1v1 only. Old saves load with an empty saga, and their arcs start
from wherever the career is.

**The saga.** The career is told in arcs: 3–6 beats each, across three acts.

| Act | Stage | Theme |
| --- | --- | --- |
| I: Nobody | High school | Underdog with something to prove |
| II: The Rise | College | Temptation and pressure |
| III: Legacy | The pros | Chasing a ring |

- **How a career's arcs are picked.** Each career draws how many arcs it will see (`saga.perCareer`, 6–8). The count
  splits over the acts (`saga.actShare` 0.35 / 0.25 / 0.4), and an arc never opens twice.
  - Each arc also has a share of careers it can open in (`saga.chance`), so no arc is in every career.
  - V7 has five arcs; V8 brings the rest, and the 6–8.
- **Every choice trades one thing for another**, and its note says both. Choices set flags, and later beats read them:
  the coach's favor comes due, a friend follows you or doesn't, the envelope comes out.
- **The beats share R9's season budget** of 3–5 dialogue cards. A saga beat goes first. One that must happen now (an
  injury's decision, a season's or a stage's closing beat) is always told.
- **The state** lives on the career (`saga`): the cast and their meters, the flags, each arc's progress, and a log of
  every beat and pick. It survives a save and a reload, and the handoff to the pros.

**The cast.** Eight people, each with a pixel portrait and a meter from −100 to 100.

| Person | Who they are |
| --- | --- |
| Family | Your parent or guardian |
| Your high school coach | They follow you all career |
| A best friend | From your first team |
| Your rival | — |
| A mentor | A veteran pro you meet at a summer camp |
| Your agent | — |
| A journalist | Covers you all career |
| An owner | In the pros |

- Choices move a meter 5, 10 or 20 (`saga.m`). The family starts at +10 (`saga.familyStart`).
- The journalist's meter follows your press answers (`saga.pressMeter`): Team first +2, Confident +1, Trash talk −3, No
  comment −2.
- A family at +20 or more gets the warm version of an ending (`saga.warmAt`).

**The first five arcs.**

1. **Family Bills** (act I). The family needs money.
   - A weekend job: +$400, practice XP −20% for 3 weeks, family +20.
   - Basketball first: practice XP +10% for 3 weeks, family −20.
   - Ask your coach: coach +10, family +5. A favor comes due later: run the youth camp the day before the rival game
     (fatigue +12, coach +20) or say no (coach −20).
   - The job path is offered more shifts. On the basketball path the lights go out one evening.
   - The season ends at the kitchen table, warm or not.
2. **Best Friend** (acts I–III). A teammate from your first season asks for help (friend +20, or your own work).
   - **Senior year.** Your meter decides what they do: follow you as a walk-on (+25), quit (−10), or sign with a rival
     program.
   - **College.** They sit on your bench, play across the court from you, or call from the store.
   - **The pros.** They come back as your agent (if they quit and you stayed close, +30), as your club's film
     analyst, or on the radio.
3. **The Booster** (act II). An envelope.
   - **Keep it:** +$2,000, and each college season after that a 25% chance it comes out. Then you sit 2 games (owning
     it) or 3 (no comment), with a press storm.
   - **Hand it back:** coach +10, and the journalist's story (hype +8).
   - A closing beat in the pros remembers what you did.
4. **The Injury** (any act; an injury of 3+ games, once a career). It replaces R9's training-room card that time.
   - **Rush back:** 2 games sooner. It flares up 40% of the time: two more games out and −2 Speed for good.
   - **Full rehab:** all the games, fatigue gone, practice XP +15% for 3 weeks.
   - The family visits while you're out: go home (family +10, coach trust −3) or stay with the team.
5. **The Mentor** (a summer camp or the AAU circuit in act I → act III). A veteran with 12 PBL seasons.
   - **Camp:** listen and work (mentor +20, practice XP +15% for 3 weeks, fatigue +5) or show off for the scouts
     (hype +5, mentor −10).
   - **College:** a text about your defense.
   - **The pros.** At +20 or more they sign with your club for one last season, between your pro seasons 2 and 6.
     Win them a playoff game and their last lesson stays with you: your make chance in a game's last 15 s ×1.05 for
     good (+0.4 OVR in simulated games). Otherwise they retire.

**Cutscenes (§2.4).** A saga beat is a cutscene.

- **Seven pixel backgrounds**, painted on a 320×180 grid: the gym, the locker room, the kitchen table, the campus quad,
  the press room, the arena tunnel and the Finals court (with confetti).
- **Two portraits:** the speaker's, with their meter under the name plate, and yours opposite.
- **The typewriter, and a stinger by mood:** warm, tense, sad or triumphant.
- **Three answers** fit in a row on a desktop. A phone gives them a page of their own after the text.

**The Codex** has a new page, The story: how the saga works, this career's arcs, and the people you've met with their
meters.

**The numbers.** The career simulator, 600 careers per policy (seeds 1–3, 200 each):

| | Typical | Great |
| --- | --- | --- |
| Arcs per career | 2.64 | 2.70 |
| Beats per career | 7.3 | 7.4 |
| Family Bills | 61% | 61% |
| Best Friend | 61% | 62% |
| The Booster | 60% | 60% |
| The Mentor | 45% | 44% |
| The Injury | 38% | 45% |

- With five arcs a career sees 2.6 of them (0 to 5). The spec's 6–8 comes with V8's six arcs.
- Nearly every arc that opens also finishes. The few that don't were still open at retirement.
- An arc's `saga.chance` is its share of careers before its own condition. The booster's roll passes 55.3% over 4,000
  seeds; these 600 careers happened to draw 60%.
- The §1.1 table still passes with the saga in. Typical: a 5★ team 17.8%, 0.37 titles, Hall of Fame 3.3%. Great: 63.5%,
  1.93 titles, 38.2%.

**Tests.**

- `tests/story.js` is new, with 7 steps:
  - the cast and meters;
  - every arc's beats and choices (each says what it costs and what it gains; one default each);
  - no arc twice;
  - beats gated by flags;
  - a choice's effects and the log;
  - save, reload and the handoff to the pros; old saves;
  - the arcs' effects (the suspension, the flare-up, the mentor's edge);
  - the cutscene.
- The career simulator reports arcs per career, beats and each arc's share of careers.
- The phone audit has three cutscenes (three answers, the press room, the Finals) and the Codex's story page.

**Suite.** Everything passed on the commit's build:

- smoke (desktop and phone), every mode, old saves, the dev tools, the phone audit and the Art Lab;
- story, climb, difficulty (the §1.1 table still passes), flow, gameplay, traits, steals, fixes, the HUD audit and the
  style mix;
- the full career (768 actions), and the desktop and 1.25× text audits (no flags, the cutscenes included);
- the balance gate, the balance run, the career simulator (40 careers, none stuck) and the trait balance.

Three tests were fixed during the run, and each passed on a rerun on the same build:

- **Smoke's R9 story step** expected R9's training-room card on a first long injury. The saga's injury arc tells that
  injury now, on purpose. The step sets the saga's arcs aside, since it checks R9's own beats (`tests/story.js` has the
  saga's).
- **The phone audit's three cutscenes** passed a closure into the page, where its variables don't exist. They now pass
  their arguments in, and start from a fresh beat budget.
- **The trait balance** read Uncommon at +5% at seed 1, against a band of +6–15%. The saga raised the baseline from 56
  to 58. Seeds 2 and 3 read +8.6% and +10.2%, so one seed's 600 careers leave a rarity's median about 3% from noise.
  The test now takes `--seeds=K` and pools them, and the suite runs 400 careers × 3 seeds (1,200 a trait): Common +2%, Uncommon +10%, Rare +22%, Legendary +49%, every rarity in its band.

Still open from V4: the style mix's Slashers drive on 46% of possessions against a 60% target (V14).

## V6 — Part 2: a climb that's actually hard: the XP curve, hidden potential, setbacks, scarcity (Part 2 §1)

The first milestone of Part 2 ("Hoop Heads 2.0, Part 2"). The career is still 1v1 only, and old saves load as they
are: a save from before V6 rolls its hidden potential from its own seed (never under a rating it already has), and
everything else fills in on load.

**The §1.1 table.** `tests/difficulty.js` runs the career simulator over 600 careers per policy (3 seeds × 200) and prints
the table. Every row is in its band:

| Milestone | Typical: target | Typical: measured | Great: target | Great: measured |
| --- | --- | --- | --- | --- |
| Makes varsity | sophomore or junior (freshman 20–25%) | freshman 22%, median year 2 | freshman | freshman 56% |
| Recruit stars at graduation | 2–3★ | 2–3★ 81%, median 3★ | 4–5★ | 4–5★ 58%, median 4★ |
| Starts in college | year 2–3 | year 2–3 95%, median year 2 | year 1 | year 1 85% |
| First pro offer | 1–2★ or undrafted | 1–2★ 82%, median 1★ | 3★ | median 3★ |
| Reaches a 3★ team | by 26–28 in 50% | by 28 70%, median age 26 | by 24 | by 24 83% |
| Reaches a 5★ team | 15–25% | 17.5% | about 60% | 64.0% |
| Championships per career | about 0.3 | 0.35 | 1–3 | 1.95 |
| Hall of Fame | 3–8% | 3.7% | about 35% | 38.2% |

Before V6 (the V5 build, the same two policies and seeds; the great policy had no edge to apply in V5, but its games
counted as played), 10 of the 16 rows missed:

| Milestone | Typical, V5 | Typical, V6 | Great, V5 | Great, V6 |
| --- | --- | --- | --- | --- |
| Makes varsity as a freshman | 83% | 22% | 83% | 56% |
| Recruit stars | 2–3★ 78% | 2–3★ 81% | 4–5★ 22% | 4–5★ 58% |
| Starts in college | year 1 (year 2–3 10%) | year 2 (year 2–3 95%) | year 1 91% | year 1 85% |
| First pro offer, median | 2★ | 1★ | 2★ | 3★ |
| A 3★ team | median age 22 | median age 26 | by 24 84% | by 24 83% |
| A 5★ team | 75.2% | 17.5% | 92.5% | 64.0% |
| Titles per career | 1.46 | 0.35 | 2.65 | 1.95 |
| Hall of Fame | 30.7% | 3.7% | 61.5% | 38.2% |

How the pro league's settings got there (600 careers per policy, seeds 1–3; the XP, potential, setback and amateur
changes already in):

| Step | Typical: 5★ · titles · Hall of Fame at 85 | Great: 5★ · titles · Hall of Fame at 85 |
| --- | --- | --- |
| `keep` 0.7, star edge 1.0, one-game semifinals, great edge 3 | 16.2% · 0.41 · 3.8% | 66.7% · 2.09 · 45.2% |
| great edge 2.5 | (same) | 61.5% · 1.70 · 37.3% |
| `keep` 0.6, star edge 1.3 | 20.7% · 0.41 · 4.8% | 64.2% · 1.81 · 41.0% |
| + best-of-3 semifinals (V6) | 17.5% · 0.35 · 4.7% | 64.0% · 1.95 · 42.5% |
| the same with star edge 1.0 | 20.8% · 0.40 · 4.3% | 66.8% · 1.88 · 43.5% |

Then the Hall of Fame line moved from 85 to 92: typical 3.7%, great 38.2%.

A per-season breakdown (`careersim.js --seasons`, run at `keep` 0.7 and a star edge of 1.0) explained the titles. They
come from the team's stars at the start of the season, more than from your OVR. A typical player wins 3.4% of 3★ seasons, 9.4% of 4★ seasons and 19.6% of 5★
seasons. A great one wins 4.8%, 12.8% and 28.0%.

- **The two policies.** Both make sensible choices: rest when tired, film for big games, take the offer with the most
  stars, ask for a trade up.
  - **Typical** sims everything.
  - **Great** plays every game: no simmed-game cut. Its box scores and depth-chart games carry an edge of 2.5 OVR (a
    player who plays a little better than their rating), and it takes the strongest college offer short of a blue blood.
- **Where the bands were judged.** "About" was read as 52–68% (5★, about 60%), 0.2–0.4 titles (about 0.3) and 30–40% (the
  Hall of Fame, about 35%). Seeds 4–6 were held out of the tuning: they land in the same bands (typical 5★ 18.7%,
  titles 0.38, Hall of Fame 3.2%; great 65.0%, 1.81, 37.5%).

**XP (§1.2).**

- **The curve.** The next +1 costs 20 × 1.11^(rating − 40) XP (`career.xpCurve`). Ratings still grow 5 at a time, and a
  step of 5 sums its five points.

  | Stretch | XP |
  | --- | --- |
  | 40 → 60 | 1,284 |
  | 60 → 70 | 2,696 |
  | 80 → 90 | 21,739 |

  The spec's prose says 80 → 90 costs "about 3×" the 60 → 70 stretch. Its formula gives 8.1×; 3× would need a growth of
  1.056. The formula was kept and the ratio is printed (the Codex says 8.1×). A run at 1.056 made careers narrower, not
  harder.
- **Every XP source is rescaled.** `career.xpEarn` goes from 0.85 to 9: games, practice, drills, the bench and camps all
  pay ×9 for the bigger costs. It was fitted with the two policies. F6's `xpBase`, `xpPer`, `xpTop` and `xpTopFrom` are
  gone.
- **Grades.** Game XP is multiplied by your grade (`career.gradeXp`). The result screens show it ("GAME XP GRADE B ×1.2 ·
  SIMMED ×0.5").

  | Grade | A+, A | B+, B | C | D | F |
  | --- | --- | --- | --- | --- | --- |
  | XP | ×1.5 | ×1.2 | ×1 | ×0.6 | ×0.3 |

- **Simmed games pay ×0.5** (`career.xpGame.simmed`, was 0.75). Playing your games matters.

**Hidden potential (§1.2).** Every skill (Shooting, Finishing, Handles, Defense) has a hidden potential. Past it, every
+1 costs ×3 (`career.potMul`): a soft ceiling, not a wall.

- **The roll** (`amateur.pot`). One talent roll is shared by the four skills (mean 76, sd 6), plus 4 more spread for each.
  It stays within 60–95 and is never under the rating you have.
- Speed, Hops and Strength keep their genetic caps.
- Late Bloomer's cap bonus raises it.
- **What you see.** The scouts' grade shows it on the practice screen, the recruiting screen and the Codex. It's now the
  grade of your skills at their potential and your body at the scouts' band (`amPotentialText`); before, it graded the
  hard caps alone.
- The pros keep it (`c.me.pot`). The CEILING chip on your player screen uses it.

**The practice load cap (§1.2).** A week's practice pays at most 1.25× a normal week (`week.loadCap`). The rest turns
into fatigue: 8 for each normal week's worth (`week.loadFatigue`).

- **What counts as a normal week.** A simmed session is measured against a simmed normal session. A played drill, and the
  practice game of a depth-chart challenge, is measured against the drill played to an average score: half of a great
  score (`week.loadDrillRef`).
- **Examples.** A hard simmed session pays the cap and adds +2 fatigue (on top of hard work's +3). A great drill at hard
  intensity, 1,430 XP, pays 745 and adds +9 fatigue.
- **On screen.** The practice screen shows the capped numbers ("the load cap: the rest is fatigue"). The session's result
  says how much turned into fatigue.

**Setbacks (§1.2).**

- **Injuries can cost rating points for good** (`week.injuryLoss`). The loss hits Speed for an ankle, a hamstring or a
  foot, and Hops for a knee or a calf. Nutrition & physio cut the odds (×0.6, like injuries).

  | Injury | Odds | Points |
  | --- | --- | --- |
  | 1 game | 25% | 1 |
  | 2 games | 50% | 1–2 |
  | 3 games | 85% | 2–3 |

  The result screens and the news say "−2 Hops for good".
- **Slumps** (`media.slump`). Three straight games graded D or F are a slump: confidence drops to −2, and Shooting −2,
  until a game graded B or better.
  - Ice Veins never slumps.
  - The news says when it starts and ends; so do the result screens.
  - The Train tab and the pregame chips show it.
- Aging still declines after 30, as before.

**The competition (§1.2).** The levels already sat near the spec. V6 moves the pros down and measures every level:

| Level | Measured | Spec |
| --- | --- | --- |
| High school opponents | 44 as freshmen to 59 as seniors (51.5 across the four years); each league's best about 6 over its middle | about 50 (stars about 58) |
| College opponents | 59–74 by year and program (63.5 for years 1–2 at a mid-major or power program) | about 63 (stars about 71) |
| The pros | median 75 when the league is generated, each league's top three 83.5 | about 74 (stars 82–90) |

The pro figures come from 20 leagues. The league settles near 76 as it turns over.

| Setting | New | Old |
| --- | --- | --- |
| `career.proMean`: generated veterans | 80 | 83 |
| `career.prospectMean`: the other rookies | 72 | 75 |

**High school and college.**

| Setting | New | Old | What it does |
| --- | --- | --- | --- |
| `hs.tryoutBar` | 0.9 / 0.55 | 0.6 / 0.5 | The tryout grade that makes varsity as a freshman / a sophomore |
| `hs.tryoutOvr` | 8 | 2 | ...or an OVR this far over your level |
| `hs.promoteAfter` | 6 | 4 | JV games before a call-up |
| `hs.promoteWin` | 0.85 | 0.75 | The JV win share for a call-up |
| `hs.callupFrom` | 2 | — (new) | Call-ups start in year 2 |
| `team.ladderStart` | 1, 2, 3, 4 | 1, 1, 2, 3 | Your first rung by program tier: a college freshman sits behind someone, deeper at a bigger program |
| `college.seatAhead` | 7 | 4 | The teammates ahead of you are 1 to this many OVR better |

**The depth chart.** A challenge you win takes the spot only if you're within 2 OVR of the teammate (`team.takeGap`).
Further back, the coach keeps them in front: the result says NOT QUITE, and how far you have to go. Your trust still
goes up.

**Scarcity (§1.3).**

- **Bars.** A 1–5★ franchise wants a value of 0, 66, 72, 78 or 84 before it offers (`franchise.bar`; was 71, 76 and 83 for
  3–5★).
- **Value.** OVR + fame ÷ 20 (`fameDiv`, was 15) + hype ÷ 30 + 1 for each playoff series won in your last two seasons
  (`playoffVal`, at most 3: `playoffMax`).
- **The 5★ condition.** A 5★ franchise also wants a playoff series won or an All-League team in your last two seasons
  (`need5`). Without it, your offers stop at 4★.
- **Stars stay in their spots.** Each offseason a 5★ franchise opens one rotation spot half the time (`spot5Odds` 0.5),
  never more. A veteran retired, a trade, or a free agent left.
  - 2–3 named free agents chase it (`spot5Rivals`), with values around 84 (`rivalVal` 84 ± 2.5).
  - You get it only by beating the best of them.
  - The free agency screen names the open spots, their best rival and your value. The news says who filled the ones you
    didn't take.
- **Trades.** A trade request that a 5★ franchise would take finds one 35% of the time (`trade5Odds`), else a 4★ one.

**The pro league.**

| Setting | New | Old | Why |
| --- | --- | --- | --- |
| `league.starEdge` | 1.3 | — (new) | Simulated pro games: margin points per franchise star (a 5★ team's player +5.2 over a 1★ team's; one star is worth about 5 OVR). At 1.0, typical careers won 0.41 titles |
| `franchise.keep` | 0.6 | 0.8 | Prestige kept each offseason (the rest comes from the finish), so stars move more. At 0.8, 11% of typical careers reached a 5★ team |
| `career.semisBestOf` | 3 | 1 | The semifinals are a series. A one-game semifinal gave mid-table players 40% more titles than the table allows, and §1.3's "playoff series" wants a series. Part 2 §6's top 8 comes with the pro team system |
| `career.hofScore` | 92 | 85 | The Hall of Fame line: 3.7% of typical careers, 38% of great ones (at 85: 4.7% and 42%) |

The legacy formula stays. A search over its weights found none that put typical careers at 5% and great ones at 35%
together; the best kept 3.8% at 35%.

**Fixes.**

- **The semifinal is a series now, and the labels follow.** The hub's next-game label names the round and the game ("SEMIFINAL ·
  GAME 2 (best of 3)"; it called any series THE FINAL). The rival's FINALS REMATCH card checks for the final. The
  league's rules text says how long each round is.
- **Phones.**
  - The free agency intro fits one line, so the 5★ spots line no longer overlaps it.
  - The practice result's load-cap and injury lines wrap.

**Tests.**

- `tests/difficulty.js` is new: the §1.1 table (600 careers per policy across 3 seeds, both policies), each row against
  its band, plus the seeds' own columns and the XP curve's ratio. It exits 1 on a miss.
- `tests/climb.js` is new, with 9 steps:
  - the XP curve and the soft ceiling;
  - potential (rolled, never under a rating, migrated);
  - game XP by grade and the simmed half;
  - the load cap (sessions, drills, the pros);
  - injury losses (odds by length, nutrition);
  - slumps (Ice Veins);
  - the competition at each level;
  - scarcity (bars, the 5★ condition, one spot a season over 150 seasons, named rivals, the news);
  - the depth chart's take gap.
- `tests/careersim.js` has new options and output:
  - `--policy=typical|great` and `--edge=2.5`;
  - a DIFFICULTY line;
  - titles by the team's stars;
  - `--seasons`, a per-season record for diagnosis;
  - its TARGETS line is now §1.1's.
- `tests/traitbalance.js` runs the great policy now (`--policy=typical` for the other).
  - **Why.** Under V6 a typical career's legacy is mostly its seasons plus points ÷ 250. Half of all typical careers
    score 29–36 whatever their trait, so the median stopped moving: every rarity read +0–9%, three of four out of band.
  - **With the great policy** the careers spread over titles, MVPs and All-League teams, as V5's typical ones did. Every
    rarity is back in its band: Common +5%, Uncommon +11%, Rare +27%, Legendary +55% (600 careers per trait, seed 1).
- The phone audit has the new screens: a slump and a lasting injury on the result screen, the SLUMP status on the Train
  tab, hard practice under the cap and its result, NOT QUITE on the depth chart, free agency with open 5★ spots, and the
  Codex's later pages.
- Smoke follows the V6 rules: the XP scale, the 5★ condition in free agency, call-ups from year 2, and the college seats.
- The audits page the Codex after its screen has drawn (its pages are measured as it draws). Before, parts 2 and 3 of
  the move list showed the next topic instead.

**Suite.** Everything passed on the commit's build:

- smoke (desktop and phone), every mode, old saves, the dev tools, the phone audit and the Art Lab;
- climb, difficulty (the §1.1 table), flow, gameplay, traits, steals, fixes, the HUD audit and the style mix;
- the full career (776 actions), and the desktop and 1.25× text audits (no flags);
- the balance gate, the balance run, the career simulator (40 careers, none stuck, the §1.1 targets) and the trait
  balance (great policy, every rarity in its band).

Three tests were fixed during the run, and each passed on a rerun on the same build:

- **Smoke's perf-guard step** waited 300 ms. The guard holds a new resolution for 0.75 s, so the step now polls for up
  to 2 s.
- **Gameplay's pregame step** needs a starter. The harder tryout benches its player, so it now promotes them first.
- **The trait balance** now runs the great policy (above).

One miss is older than V6 and still open: the style mix's Slashers drive on 46% of possessions against a 60% target.
M7 measured 59%; the miss dates from V4. V14's balance pass takes it.

## V5 — 2.0 career flow: pace, the week, playing time, the Road, sim ahead, a five-tab hub, the PBL (§4.1, 4.2, 4.6–4.8, §5)

The fifth milestone of Hoop Heads 2.0. The career is still 1v1 only, and old saves load as they are. New fields fill in
on load; the league's old name is renamed in the save's text.

**Pace (§4.7).** Career games now run under pace rules. Quick Play, the modes and the balance gate keep the old rules.

| Rule | Pace rules | Old rules |
| --- | --- | --- |
| Shot clock (`pace.shotClock`) | 8 s | 10 s |
| Beat after a make (`pace.madeBeat`) | 0.45 s | 0.8 s |
| Beat after a violation or turnover (`pace.deadBeat`) | 0.6 s | 1.0 s |

- **Clocks wait in the backcourt.** After an inbound, both clocks wait until the ball crosses half court
  (`holdToHalf`). The same applies after a rebound or a steal in the backcourt (`holdAll`). They wait at most 4 s
  (`holdMaxS`), so nobody can stall.
- **The game clock stops during shots.** It stops while a shot is in the air (`flightStop`) and through the rebound
  until somebody has the ball (`reboundStop`). This doesn't apply in the last 3 s of a period (`flightStopUntil`), so
  buzzer-beaters still count.
- **The HUD shows it.** The clock is dimmed while it is stopped.

Measured in bot-vs-bot games (the Pro mirror, one-minute career games, 300 games):

| | Points a side | p10–p90 | Winner / loser | PPP | Possessions a side |
| --- | --- | --- | --- | --- | --- |
| Old rules | 6.7 | — | 8.4 / 5.0 | 1.075 | — |
| Pace rules | 13.3 | 8–20 | 15.8 / 10.7 | 1.109 | 12.0 |

How the rules got there (200 games each):

| Step | Points a side |
| --- | --- |
| Short clock and beats, the inbound hold | 11.9 |
| + the clock stops through the rebound | 12.8 |
| + `flightStopUntil` 3 and `holdMaxS` 4 | 13.3 |

Scripted humans against a career bot (32 games each; the human's points first, then the bot's):

| Script | Old rules | Pace rules | Human PPP |
| --- | --- | --- | --- |
| Reads the defense | 4.9 – 8.5 | 8.9 – 14.8 | 0.67 |
| Perfect-release threes | 11.3 – 8.9 | 22.9 – 15.1 | 1.59 |
| Drives | 5.2 – 8.6 | 8.8 – 14.4 | 0.63 |
| Brute force | 4.5 – 6.2 | 8.4 – 11.3 | 0.86 |

Efficiency (PPP) stays where the gate keeps it; the extra points come from more possessions.

**Simulated games and per-game counts follow the pace.** Every count that grows with scoring was raised to match:

| Setting | New | Old | Why |
| --- | --- | --- | --- |
| `career.simWinPts`: a simmed amateur winner's points | 16.0 | 8.4 | Measured: 15.8 |
| `career.paceMul`: scales the per-game numbers fitted to the old formats (pro box scores, stock, big nights) through `gameScale` | 1.98 | — | 13.3 / 6.7 |
| `traits.thirdAt`: career points for a third trait | 2,000 | 1,000 | — |
| `traits.hotMakes`: makes for a hot game | 8 | 4 | — |
| `traits.heatMakes`: makes for a heat-check game | 10 | 5 | — |
| Clutch Gene deed (clutch makes) | 10 / 30 | 5 / 15 | — |
| Showman deed (highlights) | 20 / 60 | 10 / 30 | — |
| Paint Protector deed (blocks) | 12 / 40 | 6 / 20 | — |
| Freak Athlete deed (dunks) | 40 / 120 | 20 / 60 | — |
| Floor General deed (games without a turnover) | 9 / 31 | 15 / 50 | Twice the possessions make a clean game rarer |

**The week (§4.2).**

Fatigue builds half as fast:

| Source | New | Old |
| --- | --- | --- |
| A game (`week.fatiguePerGame`) | 5 | 10 |
| Overtime (`week.fatigueOt`) | 1.5 | 3 |
| Hard practice (`week.intensity.hard.fatigue`) | 3 | 6 |
| The AAU summer (`aauFatigue`) | 18 | 35 |
| An NIL appearance (`nilFatigue`) | 4 | 8 |

- **Rest by default when tired.** Over 70 fatigue (`week.restAt`), the next week's plan starts on Rest; you can change
  it. A standing Rest ends once you are back to 50 (`fatigueFreeAt`).
- **The press room comes after big games only.**
  - Always: a rival, an amateur final, a title or an elimination.
  - With the 3-game gap (`pressGap`): other playoff games, a points record, a big night or an upset.
  - A big night is at least `bigPts` × the game scale and 1.5× your average.
  - Debuts and routine wins get none.
  - Measured over three simulated high school careers: 31 press rooms in 89 games (V4: about one game in two).
- **Teammate challenges are rarer.**
  - None in a season's first 3 weeks (`team.chalFirstWeeks`).
  - Then at most one every 3 weeks (`team.chalGap`).
  - Only from a teammate within 3 OVR of you (`team.chalWithin`).

**Playing time (§4.6).**

- **Challenging the starter.** Benched, your weekly challenge is against the starter. Win it and you take the start,
  and everyone between moves down a rung.
- **Spot starts.** Three bench weeks in a row (`team.spotAfter`) earn a spot start. An A or B grade in it
  (`team.spotUpGrades`) moves you up a rung. The news says so.
- **Trades.** A pro with 4 bench weeks in a season (`team.tradeBenchWeeks`) can ask for a trade that season, even
  inside the usual gap between trade requests. The request must still come before the deadline.

**Road to the League (§4.1).** The road is eleven milestones from varsity to the Hall of Fame. It shows as a banner at
the top of the Play tab: the next milestone, eleven pips and THE GOAL, a 5★ team. Tap the banner for the whole road.

| Milestone | Reached by | Reward |
| --- | --- | --- |
| Make varsity | High school | $250 |
| A top 100 recruit | High school | A level of your signature trait |
| A college offer | High school | A free level of court shoes |
| Start in college | College | $2,500 |
| A pro offer | The combine | A free level of the sleeve |
| Make the rotation | Pros | $250,000 |
| A 3★ team | Pros | A trait level |
| A 4★ team | Pros | A free level of wristbands |
| **A 5★ team (the goal)** | Pros | A trait level |
| Win a title | Pros | $1,000,000 |
| The Hall of Fame | Pros | — |

- Each milestone gets a card with its reward and the next step, and a line in the timeline.
- A reward that can't be given pays the stage's cash instead (`road.fallbackCash`). That happens when the trait is at
  its top level or the gear is already Elite.
- A stage you leave without a milestone marks it missed.
- Old saves check the road quietly on load: what they already did is marked done, with no cards.

**Sim ahead (§4.2, §4.8).** The Play tab has two new buttons.

- **Sim to next big moment** sims week by week. It stops:
  - before a playoff, rival or Boss game, or a spot start;
  - after a story choice, a level-up, a new trait or a milestone;
  - for any injury, offer or decision.
- **Sim the rest of the season** stops only for injuries, offers, decisions and the first playoff game.
- Cards along the way are answered for you:
  - press questions get the team answer (the confident one after a win, if you're confident);
  - story choices take their default;
  - a teammate's challenge is simmed.
- A summary screen shows:
  - the weeks simmed, the record, your points a game and your bench weeks;
  - what it stopped for (UP NEXT / STOPPED FOR);
  - what happened along the way.
- The offseason has the same button. It runs to the next contract decision or the next season.
- A run is capped at 80 weeks (`simAhead.maxWeeks`).

**Quick results.** A new setting in Settings → Gameplay, off by default. With it on, a routine simmed game is a toast on
the hub ("W 16–11 vs …") instead of the result screen. Big games still get the full screen.

**The hub (§5).** Both career hubs (amateur and pro) are now one hub with five tabs.

| Tab | What's on it |
| --- | --- |
| Play | The Road, the next game, PLAY/SIM, sim ahead, the calendar |
| Train | The week's plan, focus and the depth chart |
| Me | Stats or player card, news, trophies, timeline, the Codex |
| Team | Team, standings or league, recruiting or office, the depth chart |
| Shop | Gear |

- **Navigation.** Desktop has a rail on the left with Settings and Main menu. Phones have a bottom bar. Keys 1–5 switch
  tabs, and a result screen brings you back to Play.
- **Red dots** mark a tab with something new:
  - Shop: gear you can afford.
  - Me: a trait to pick, or unread news.
  - Team: a new offer.
  - Train: a challenge you can take.
- **The calendar** shows every week of the season as a tile:
  - home or away, the opponent's face and stars;
  - the result (a W/L chip);
  - tags: RIVAL, BOSS, PLAYOFF and others.
  - Weeks that don't fit are counted ("3 earlier · 5 later").

**The Pro Basketball League (PBL).** The pro league is called the Pro Basketball League everywhere:

- the menu, the banners and the card backs;
- the press room;
- All-PBL First Team and PBL champion.

No real league or team names appear. Old saves' news, timeline, awards, history and social feed are renamed on load
(`pblMigrate`).

**First-time tips.** The tips now describe the hub, the depth chart's new rules and trades after bench weeks. A save
that saw the old week tip gets one new tip about the hub. A long tip's card grows to fit its text. The coach's lines on
losing and winning the start match the new rules.

**Fixes.**

- The shot feedback's second line no longer overlaps the first (LATE over SMOTHERED).
- The desktop practice chart on the HUD has room for its labels.
- Stat tiles fit long values ("Lost in the semifinals").
- Phones: the genes card's closing line no longer runs under CONTINUE, and the hidden trait's hint fits its card.
- A long scouting tendency ("Loves the step-back three") wraps instead of being cut, and the tale of the tape lifts
  a tall scouting card clear of TIP OFF.
- The phone Road banner is a full-size tap target.
- Touch buttons centre their labels again. The stick's side label (POST UP) had left the text alignment at "left", so
  in phone games every button's label started at its circle's centre and a big text size cut SHOOT. A label that
  still can't fit its circle uses a short word.
- Desktop and 1.25× text:
  - the hub rail's Settings button is a gear (the word didn't fit);
  - calendar chips use a short form in a narrow tile;
  - the depth chart's notes and coach trust clear its buttons;
  - a long trait name on a card drops the rarity to the level row;
  - the Codex splits a topic too long for two columns (the move list) into pages, and a requirement chip that doesn't
    fit beside its move gets its own row;
  - the film room keeps its note clear of STUDY THE TAPE.

**Tests.**

- `tests/flow.js` is new: pace, sims, fatigue, press, the depth chart, playing time, the Road, sim ahead (amateur, pro,
  offseason), Quick results, the hub and the PBL.
- `smoke.js` has the new score ranges.
- `fullcareer.js` plays a whole career through the tabs and sim ahead: 709 actions, a whole career to the Hall of Fame, 163 of them on sim summaries (V4: 1,099 actions).
- The phone audit has every tab of both hubs, the Road, a road card and a sim summary.
- The test runner prints each step's measurements.
- The older tests now follow the V5 rules:
  - the trait deeds and the third trait read their counts from CONFIG;
  - the trait chip is on the hub's Me tab;
  - the career simulator lets a spot start play;
  - the bench-season recap check turns spot starts off;
  - the old-save driver knows the Road card and the sim summary.
- Scripted tests hold Road cards back unless they ask for them, as they already do with first-time tips; the rewards
  still come.

**Suite.** Everything passed on the commit's build: smoke (desktop and phone), every mode, old saves, the dev tools,
the phone audit, the Art Lab, flow, gameplay, traits, steals, fixes, the HUD audit, the style mix, the full career, the
desktop and 1.25× text audits (no flags), the balance gate, the balance run, the career simulator (40 careers, none
stuck) and the trait balance (every rarity in its band). The simulator's F6 targets still read high for a typical career
(titles 1.63 a career, Hall of Fame 38%); V6 retunes the climb.

## V4 — 2.0 gameplay: scouting, signature moves, feedback, defense feel, phones, overtime, AI variety (§3)

The fourth milestone of Hoop Heads 2.0. The career is still 1v1 only. No new modes, no power-ups in the career.

**Opponent scouting.**

- Every career opponent has a personality and four tendencies: two with the ball and two on defense. This covers
  amateur opponents, pros, the rival and the Boss.
- They are rolled once from the opponent's id and kept on the record (`rec.scout`), so the same player always plays
  the same way and old saves need no migration step.
- The personality follows the player's build 60% of the time (`scout.persByArch`); otherwise it is any of the four.
- A tendency that needs size (backing smaller players down) is rare for anyone under 1.96 m.

The scouting card shows:

- the personality, with what it means;
- their traits (with a Legendary chip on the Boss);
- one tendency with the ball and one on defense;
- their weakness: the rating furthest under their own average, at least 5 points under (`scout.weakGap`);
- one tip, the answer to the tendency it shows.

A Film week on that opponent shows all four tendencies, and so does Film Junkie. The film room shows the card with all
four.

Where the card appears:

- **Amateur games:** PLAY now opens a scouting report screen (both trading cards and the card) with TIP OFF and Back.
  SIM skips it.
- **Pro games:** the tale of the tape has the card where the rating bars were.
- **Hubs:** the next game shows the personality and BOSS as pills.
- **Tip-off:** the match intro shows the personality (and BOSS GAME) under the matchup.

**Bots play to the card.** Each personality and tendency multiplies the value of one of the AI's options (a shot, a
drive, a move, a post-up, a fadeaway, a reset) or moves a defensive knob (how far they sag, how often they bite or
reach, how early they jump at the rim). The bot plays all four tendencies, shown or not. Measured in bot-vs-bot games
(All-Star, one minute, the same 24 games with and without, `tests/gameplay.js`):

| Tendency or personality | Measured | Without | With | Change |
| --- | --- | --- | --- | --- |
| Loves the step-back three | step-backs a game | 0.00 | 0.33 | (from none) |
| Fadeaway artist | fadeaways | 1.29 | 3.50 | +171% |
| Pump-fakes a lot | pump fakes | 0.33 | 0.75 | +125% |
| Lives at the rim | layups and dunks | 2.96 | 3.92 | +32% |
| Pulls up from mid-range | mid-range jumpers | 0.58 | 0.88 | +50% |
| Shakes you with moves | dribble moves | 11.88 | 16.75 | +41% |
| Backs smaller players down | post-ups | 3.50 | 4.50 | +29% |
| Gambles for steals | reaches | 0.13 | 0.21 | +67% |
| Bites on pump fakes | bites | 1.50 | 4.04 | +169% |
| Sags off shooters | room given (m) | 0.74 | 1.04 | +40% |
| Picks you up close | room given (m) | 0.74 | 0.62 | −16% |
| Gunner | threes | 1.46 | 2.54 | +74% |
| Bully | post-ups | 3.50 | 4.58 | +31% |
| Showman | dribble moves | 9.04 | 10.88 | +20% |
| Lockdown | reaches | 0.13 | 0.00 | −100% |

Quick Play bots take the personality of their build: Sharpshooter → Gunner, Slasher and Playmaker → Showman, Post and
Rim Protector → Bully, Lockdown → Lockdown. The balance gate's teams carry none, so the gate measures the plain engine.

**The Boss.** Once a season the best regular-season opponent on your schedule plays you with a Legendary trait (in the
trait's third slot, so every card, simulation and game sees it). The Boss is never your rival and never in the first two
weeks. Beating them adds 3 hype and a "Boss down" headline. The next season has a new Boss, and the old one plays as
themselves again.

**Signature moves.** They unlock at ratings 70 and 80 (7 and 8 on the engine's scale). Quick Study unlocks them a step
early.

| Move | Unlock | How | What it does |
| --- | --- | --- | --- |
| Behind-the-back | Handles 70 | Press Move with a defender in your face | Your crossover goes behind your back: the ball can't be poked during it, and the burst lasts 20% longer |
| Snatch-back | Handles 80 | Press Move again during a crossover's burst | You spin out of the crossover: a second ankle check at 1.5× the chance, then the quick step-back jumper |
| Euro-step | Finishing 70 (was 60) | Reverse the stick as you go up for a layup | You step sideways around a shot-blocker; the contest is halved (the bots now use it too) |
| Reverse dunk | Hops 80 | Dunk with a shot-blocker by the rim | You turn on the way up and finish backwards; the rim shields the ball (half the duel and block chances) |
| Pull-up three | Shooting 80 | Shoot a three at full speed | The quick gather and a 15% wider perfect window |

Every signature move says its name in a small gold callout. The results count them (`stats.sigs`). The move list
explains every move: how to do it, what it does and whether you have it. It lives on a new Codex page (Moves) and on the
pro player screen. All-Star and Legend bots that have the moves use the Euro-step, the Snatch-back and the
Behind-the-back (in 30 bot games: 14 Euro-steps, 9 Snatch-backs and 49 Behind-the-backs).

**Shot feedback.** After every jump shot you see your timing (EARLY, GOOD, PERFECT or LATE) and the make chance when the
ball left your hand, with the shot meter on or off. A Settings toggle, Gameplay → Shot feedback, turns it off. The meter
now knows the contest when you gather, so its window is the real one. Minimal draws only the sweet spot, as its help
always said.

**Practice shot chart.** The chart (on by default) shows four zones, at the rim, mid-range, three and deep, each colored
by your percentage there with its makes and attempts. It shows your last shots as dots, with perfect releases ringed in
gold, and your perfect-release count. The pause menu in practice shows it big beside the menu.

**Defense feel.**

- A contest ring shows around the shooter's feet for 0.6 s after the release: green when open, then yellow and orange,
  red when smothered, thicker the closer the defense was.
- A block plays a swat, a hard slap and then a thud, with the hit-stop.
- A poke plays its own two-tone tick. A steal plays a snatch.
- A perfect release chimes (§6).

**Phones.**

- In-game buttons are at least 80 px across (`ui.touchGamePx`; the menus' 64 px stays).
- A layout editor (Settings → Controls → Edit touch layout…) lets you drag the stick and any button. Positions are kept
  as fractions of the screen, so they fit any phone. Reset puts them back.
- Auto-sprint is a setting. On (as before), a full push sprints. Off, a SPRINT button sits by the stick.
- Short vibrations on steals, blocks and dunks (`ui.vibrate`), on devices that have them, with a setting.

**Overtime.** The next basket wins in every ruleset; Street Sim used to play a timed overtime. The callout says NEXT
BASKET WINS.

**Also.** The amateur hub's "FIRST TO 11" label (a leftover from before timed games) now shows the game's length. On the
tale of the tape, the trait chips sat on the week's lines; they now go under them. How to play points to the move list.
The timing label and the make chance after a jumper no longer overlap. The practice HUD chart fits a narrow screen: a
short header (PERF 6/18) and each column's count on its own line.

**The balance gate** (the engine with the new moves and the AI's new reads; its teams carry no personality) is where it was:

| Legends View | V3 | V4 | Target |
| --- | --- | --- | --- |
| Pro mirror PPP | 1.17 | 1.17 | 0.95–1.25 ✓ |
| Mirror: team A wins | 47% | 50% | 45–55% ✓ |
| Legend beats Pro | 83% | 81% | 75–95% ✓ |
| Brute force vs Pro (PPP) | 0.94 | 0.91 | ≤ 1.30 ✓ |
| Best read vs Pro (PPP) | 1.59 | 1.59 | above brute force ✓ |

**Tests.**

- `tests/gameplay.js` is new: scouting (600 opponents), the scouting report and TIP OFF, tendencies and personalities in
  bot-vs-bot games, the signature moves' unlocks and their engine effects, the bots' signature moves, shot feedback, the
  contest ring and the defense sounds, overtime in every ruleset, the Boss, and the phone controls.
- The text audits cover the new screens: the scouting report (with a Film week), the film room, the Codex's Moves
  page (in parts on a phone), the layout editor and practice's pause chart.
- Smoke's phone check holds the in-game buttons to 80 px. Smoke, modes and the full career press TIP OFF on the new
  scouting report (the full career: 1,099 actions, a whole career to the Hall of Fame).

New tuning numbers:

| Constant | Value | Why |
| --- | --- | --- |
| `career.moveUnlocks` | btb han 70, snatch han 80, euro fin 70 (was 60), reverse jmp 80, pullup sho 80 | §3's signature moves at 7 and 8 |
| `moves.btbReach`, `btbBurstMul` | 0.5 m, 1.2 | a crossover within steal reach + 0.5 m goes behind the back; its burst |
| `moves.snatchWindowMs`, `snatchAnkleMul`, `snatchQuickS` | 260, 1.5, 0.6 | the Snatch-back's window in the burst, its ankle chance, the quick gather after it |
| `moves.reverseShield`, `reverseNear` | 0.5, 1.6 m | the rim's shield on a Reverse dunk; how near the rim the blocker must be |
| `moves.pullupMinSpeed`, `pullupWindowMul` | 2.6 m/s, 1.15 | a three at this speed is a Pull-up; its wider window |
| `scout.shown`, `filmShown`, `persByArch`, `weakGap` | 2, 4, 0.6, 5 | the card's tendencies (and after film), the personality's lean to the build, the weakness's gap |
| `scout.pers` | Lockdown, Gunner, Showman, Bully | each: the brain's multipliers and the tendencies it leans to |
| `scout.tend` | 12 tendencies | each: the card's words, the tip and the brain's multipliers |
| `scout.boss` | Legendary pool, +3 hype, from week 2 | the Boss |
| `ai.euroChance`, `euroBlockerDist`, `snatchChance` | 0.7, 1.8 m, 0.3 | the bots' Euro-step and Snatch-back |
| `ai.difficulties.*.moves` | Pro +euro; All-Star and Legend +euro, +snatch | which tiers use them |
| `ui.touchGamePx` | 80 | the smallest in-game touch button (the menus keep `touchMinPx` 64) |
| `ui.vibrate` | steal 35, block 50, dunk 30/40/60 ms | the vibrations |
| `fx.contestRingS` | 0.6 s | the contest ring |
| settings `shotFeedback`, `autoSprint`, `vibrate`, `touchLayout` | on, on, on, none | new settings (old saves get the defaults) |

## V3 — 2.0 traits: rarer is stronger, levels, and everything explained (§2)

The third milestone of Hoop Heads 2.0. Every trait got new numbers by rarity, levels that grow by doing the trait's
thing, a third trait at a milestone, and one card layout used everywhere, with the Codex's Traits page.

**The numbers (§2.1).** The Bronze upside follows the rarity: Common about +5–8% at one thing, Uncommon +10–12%, Rare
+18–20% or a mechanic of its own, Legendary about +30% or game-changing. Downsides are small and never grow: Common 2–3%,
Uncommon 3%, Rare 3–5%. A Legendary trait's drawback is flavor only. Every number on a card is written from CONFIG
(`traitUpText`, `traitDownText`), so a card can't drift from the rules.

| Trait | Rarity | Upside (Bronze; a Legendary: Gold) | Silver | Gold | Downside |
| --- | --- | --- | --- | --- | --- |
| Gym Rat | Common | +8% practice XP | +12% practice XP | — (top: Silver) | −3% fatigue recovery in Rest weeks |
| Streaky | Common | +6% make chance after 2 straight makes | +9% make chance after 2 straight makes | — (top: Silver) | −3% make chance after 2 straight misses |
| Glue Guy | Common | +8% coach trust gains; +8 coach trust on every new team | +12%, +12 trust | — (top: Silver) | −3% hype gains |
| Fast Twitch | Common | +8% Speed XP; +5 Speed cap | +12%, +7.5 Speed | — (top: Silver) | −2 Strength cap |
| Quick Study | Common | +6% XP from games; moves unlock 1 rating point earlier | +9%, 1.5 pt early | — (top: Silver) | −3% hype gains |
| Clutch Gene | Uncommon | +10% make chance in crunch time and the playoffs | +15% make chance in crunch time and the playoffs | +20% make chance in crunch time and the playoffs | −3% make chance in the first half |
| Iron Man | Uncommon | −12% injury risk; −12% stamina drain in games; −12% fatigue from games and practice; you age 1 year slower | −18%, −18%, −18%, 1.5 yrs | −24%, −24%, −24%, 2 yrs | −3% XP through age 19 |
| Floor General | Uncommon | −12% steals against you; +12% bite on your dribble moves; +12% Handles XP | −18%, +18%, +18% | −24%, +24%, +24% | −3% Shooting XP |
| Showman | Uncommon | +12% hype and fame from highlights; +12% Finishing XP | +18%, +18% | +24%, +24% | +3% steals against you |
| Paint Protector | Uncommon | +10% block chance; +10% Defense XP | +15%, +15% | +20%, +20% | +3% goaltend range and reach-in fouls |
| Late Bloomer | Rare | +3 cm adult height (a growth spurt at 17); +18% XP from age 17; +5 to every rating cap | +27%, +7.5 caps | +36%, +10 caps | Starts 4 lower in every rating |
| Microwave | Rare | +18% make chance while hot (20 s after 2 straight makes); +18% Shooting XP | +27%, +27% | +36%, +36% | −4% defensive effort (contests, steals, blocks) |
| Film Junkie | Rare | Film study counts ×2; a Film week also pays 50% of a Practice week's XP | ×2.5, +75% | ×3, +100% | −3 Speed, −3 Hops caps |
| Freak Athlete | Rare | +18% Speed, Hops and Strength XP; +15 Hops, +15 Speed caps | +27%, +22.5 Hops, +22.5 Speed | +36%, +30 Hops, +30 Speed | −5 Shooting cap |
| Generational | Legendary | +30% XP from everything; +10 to every rating cap; Takeover: +15% make chance, +10% speed for 10 s after 3 straight makes, and you glow | — | always | The media spotlight: cameras at every practice and your name in every headline (no effect on your numbers). |
| Unbreakable | Legendary | Never injured; −40% fatigue from games and practice; you age 4 years slower | — | always | A rival who hates you: they say you're a machine, and they mean it as an insult (no effect on your numbers). |
| Ice Veins | Legendary | +25% make chance in the last 15 s and in the playoffs; your confidence never drops | — | always | The media calls you cold: robotic, they say (no effect on your numbers). |

The Legendary abilities:

- **Generational**: +30% XP from everything, +10 to every rating cap, and Takeover. After 3 straight makes, it adds +15%
  make chance and +10% speed for 10 s. The player glows gold, and a TAKEOVER! callout and a banner show. Its drawback is
  the media spotlight (flavor). The R3 costs are gone: the AI's +0.2 tier, practice XP ×0.85, double confidence losses and
  a press question after every game.
- **Unbreakable**: never injured; fatigue builds 40% slower, in games and practice; you age 4 years slower. Its
  drawback is a rival who hates you (flavor). The −10% XP is gone.
- **Ice Veins**: +25% make chance in the last 15 s of a game (overtime included) and all through the playoffs. Your
  confidence never drops: no loss, no fade back toward zero, no cost from a boast. Its drawback is the media calling you
  cold (flavor). It replaces the R3 version (+8% free throws, confidence floored at 0, −40% hype gains).

Why the career levers: a cap alone barely mattered, since ratings rarely reach their caps. A trait that only works in
games barely moved a simulated career either. So each Uncommon and Rare trait now also has a career lever that fits
it:

- Floor General: +12% Handles XP.
- Showman: +12% Finishing XP.
- Paint Protector: +10% Defense XP.
- Microwave: +18% Shooting XP.
- Freak Athlete: +18% XP for Speed, Hops and Strength.
- Fast Twitch: +8% Speed XP.
- Iron Man: a durable body that ages a year slower (two at Gold).
- Late Bloomer: +18% XP from age 17. Its old +10 caps (which did nothing) are +5 now, and it levels at 65 and 75
  overall.
- Film Junkie: a Film week also pays half a Practice week's XP, so a Film Junkie films every week. The career
  simulator does the same.
- Glue Guy: starts every new team with +8 coach trust, and its downside is now −3% hype gains (−2% stat XP made it a
  loss).

Amateur opponents' traits now play, in played and simulated games. They have shown on previews since V1.

**Levels (§2.2).** Every trait is Bronze, Silver or Gold. Each level adds half the Bronze upside (Silver ×1.5, Gold ×2);
the downside stays. Rarity sets the top level: Common tops out at Silver, Uncommon and Rare at Gold, and a Legendary is
Gold from the start. A trait levels up by doing its thing (its deed):

| Trait | Levels up with | Silver | Gold |
| --- | --- | --- | --- |
| Gym Rat | Practice weeks | 20 | — (Common: Silver is the top) |
| Streaky | hot games (4+ makes) | 10 | — (Common: Silver is the top) |
| Glue Guy | wins | 15 | — (Common: Silver is the top) |
| Fast Twitch | games played | 30 | — (Common: Silver is the top) |
| Quick Study | moves learned | 2 | — (Common: Silver is the top) |
| Clutch Gene | clutch makes | 5 | 15 |
| Iron Man | games played healthy | 40 | 100 |
| Floor General | games without a turnover | 15 | 50 |
| Showman | highlights (dunks, posters, ankle breakers) | 10 | 30 |
| Paint Protector | blocks | 6 | 20 |
| Late Bloomer | your overall | 65 | 75 |
| Microwave | heat-check games (5+ makes) | 10 | 30 |
| Film Junkie | Film weeks | 8 | 24 |
| Freak Athlete | dunks | 20 | 60 |

Your games count their deeds from the box line, simulated or played; a played game counts the engine's own clutch
makes. Weeks count Practice and Film; OVR counts its best. A level-up is a celebration card: the trait's card pops in at
its new level with a burst in the level's color, a big level stamp, and every number shown before → after ("Block
chance: +10% → +15%"). The hidden trait counts its deeds while hidden, and its levels show once it is found.

**The third trait (§2.2).** At 1,000 career points (high school, college and the pros together) you pick one of three
Common or Uncommon traits you don't have (seeded by your traits, so a reload offers the same three). It starts at Bronze
and levels up like the others.

**Explained everywhere (§2.3).**

- **The card.** It has one layout: the trait's pixel icon in a rarity-colored frame, its name, its level pips and level,
  one plain sentence, "When it kicks in", the exact numbers, the next level's numbers, the downside, and a bar toward the
  next level ("Clutch makes: 9 / 15 → Gold"). Sections that don't fit drop out, least important first.
- **Icons.** 17 pixel icons (12×12) in the rarity's colors.
- **Chips.** A chip shows the icon, the name and level pips. It drops its pips and shrinks before it would cut its name.
  Tapping or clicking any chip or card opens its card as a popup; a mouse resting on a chip shows the card beside it.
  Chips are on the hub, the Team screen and its rosters, the player screen, the opponent's trading card on the hub, both
  players on the pro tale of the tape, the genes reveal, and the results screens.
- **The Codex.** The stats guide is now THE CODEX (2.0 §5.1; the "Codex" button where "Stats guide" was). Its first page
  is Traits: all 17 by rarity with each rarity's share and top level. Yours are highlighted with their level. Your hidden
  trait, before its story moment, shows as ??? with its rarity and a hint. On a phone, the page is in two parts.
- **The banner.** In games, a trait kicking in shows its icon, name and level under the HUD for 1.2 s: a hot hand, a
  Microwave heating up, Clutch Gene in crunch time, Ice Veins late, Takeover. The same trait shows at most once in 8 s.
- **"Traits that helped".** It is on both results screens. A played game counts each trait's share of every shot's make
  chance as expected makes ("Clutch Gene: +0.7 makes in the playoffs"), plus Paint Protector's blocks and Floor General's
  steals saved. A simulated game shows what each trait was worth in it, in OVR.

**Simulated games** count a trait's in-game numbers as OVR points (`traits.sim`), from its numbers and level:

Streaky 0.17 / 0.27; Clutch Gene 0.10 (playoffs 1.00) / 0.23 (playoffs 1.50) / 0.35 (playoffs 2.00); Iron Man 0.15 / 0.23 / 0.30; Floor General 0.11 / 0.16 / 0.22; Showman -0.01 / -0.01 / -0.01; Paint Protector 0.05 / 0.08 / 0.11; Microwave 0.24 / 0.41 / 0.57; Generational 0.08; Ice Veins 0.33 (playoffs 2.50) (Bronze / Silver / Gold; the other traits work outside games). +1% make chance on every shot is worth 0.1 OVR (+10% → 1.03 OVR over 1,200 paired engine games), and each condition's share of a game's shots was measured at 6,329 releases.

**Old saves** keep their traits. Levels start at Bronze, and the deeds start from what the save knows (games, wins and
points, the amateur years and the pros together), so a veteran past 1,000 points gets the third-trait pick at once. The
new numbers move some ceilings; a ceiling never drops under a rating you already have.

**Balance (§2.1's test).** `tests/traitbalance.js` runs the career simulator with every career's signature forced to one
trait (no hidden trait, no third), 200 careers per trait. It also runs the same 200 careers with no trait at all, as the
baseline. A rarity's careers together must beat the baseline's median legacy by its band, rising with rarity. ("The
overall median" is the no-trait careers. Measured against a pool of the traits themselves, a Common trait could not be
over the median while the stronger ones pull it up.)

Measured by `tests/traitbalance.js 600 1 4`: 600 careers per trait, seed 1. The no-trait baseline median legacy is 47.

| Rarity | Median legacy | vs no trait | Band |
| --- | --- | --- | --- |
| Common | 49 | +4% | +0%…8% ✓ |
| Uncommon | 51 | +9% | +6%…15% ✓ |
| Rare | 57 | +21% | +15%…30% ✓ |
| Legendary | 71 | +51% | +35%…60% ✓ |

| Trait | Rarity | Median | vs none | Titles | HOF | Silver (age) | Gold (age) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| gymrat | C | 48 | +2% | 0.87 | 14% | 100% (17) | — |
| streaky | C | 50 | +6% | 0.89 | 14% | 100% (16) | — |
| glueguy | C | 48 | +2% | 0.80 | 13% | 100% (17) | — |
| fasttwitch | C | 48 | +2% | 0.78 | 11% | 100% (17) | — |
| quickstudy | C | 56 | +19% | 1.08 | 20% | 51% (19) | — |
| clutch | U | 52 | +11% | 1.06 | 18% | 100% (15) | 100% (17) |
| ironman | U | 56 | +19% | 1.11 | 24% | 100% (18) | 100% (24) |
| floorgeneral | U | 49 | +4% | 0.92 | 14% | 100% (15) | 100% (19) |
| showman | U | 49 | +4% | 0.91 | 15% | 100% (20) | 100% (22) |
| paintprotector | U | 48 | +2% | 0.89 | 14% | 100% (17) | 83% (26) |
| latebloomer | R | 57 | +21% | 1.31 | 26% | 100% (20) | 78% (25) |
| microwave | R | 60 | +28% | 1.31 | 27% | 100% (21) | 99% (26) |
| filmjunkie | R | 56 | +19% | 1.20 | 21% | 100% (15) | 100% (17) |
| freak | R | 56 | +19% | 1.04 | 22% | 100% (22) | 100% (27) |
| generational | L | 95.5 | +103% | 2.31 | 59% | 100% (14) | 100% (14) |
| unbreakable | L | 68.5 | +46% | 1.33 | 33% | 100% (14) | 100% (14) |
| iceveins | L | 56.5 | +20% | 1.26 | 23% | 100% (14) | 100% (14) |

Known, for V6: the career simulator (40 careers, every career with two traits and a third at 1,000 points) now shows titles 1.48 a career and the Hall of Fame at 30%, above F6's bands (0.4–1.0, 3–15%; V2 had 0.90 and 13%). Stronger traits lift careers. V6 retunes the whole climb to Part 2's harder targets (5★ in 15–25% of careers, the Hall of Fame 3–8%), so this release does not chase the old bands.

**Tests.**

- `tests/traits.js` is new. It prints the numbers table and checks the rarity bands, the level scaling and top levels,
  the deeds and level-up cards, the third trait, Takeover, Ice Veins, Unbreakable and Generational in the engine, the
  banner, Traits that helped after a real playoff game, a tap and a hover on a hub chip, the Codex page and an old save.
- `tests/traitbalance.js` now uses the bands above against the no-trait baseline, and prints how far each trait
  leveled up.
- `tests/careersim.js` takes `--trait=none` and auto-picks a third trait.
- The text audits cover the new screens: the trait card, the Codex's Traits page (both phone parts), the pick and a
  level-up.
- `tests/smoke.js`: the older trait checks (R3's engine hooks, R4's Glue Guy, R8's Generational spotlight, F8's recovery
  kit with an Iron Man) now read the V3 numbers from the traits. `tests/oldsaves.js` and `tests/fullcareer.js` take the
  third trait's pick when an old save is past 1,000 points.

New tuning numbers:

| Constant | Value | Why |
| --- | --- | --- |
| `traits.levels`, `levelColor` | Bronze, Silver, Gold | §2.2's levels and their pip colors |
| `traits.levelUp` | 0.5 | each level adds half the Bronze upside |
| `traits.top` | C 2, U 3, R 3, L 3 | the top level by rarity (a Legendary starts there) |
| `traits.thirdAt`, `thirdOffer` | 1000, 3 | the third trait's milestone (career points) and the offer |
| `traits.bannerS`, `bannerGap` | 1.2, 8 | the banner's time on screen, and one trait's least gap between two (s of game time) |
| `traits.lastS` | 15 | Ice Veins' last seconds |
| `traits.lateAge` | 17 | Late Bloomer's extra XP counts from this age |
| `traits.takeover` | 3 makes, 10 s | Generational's Takeover (its +15% and +10% are in the trait) |
| `traits.hotMakes`, `heatMakes` | 4, 5 | a hot game (Streaky's deed) and a heat-check game (Microwave's) |
| `traits.sim` | perPct 0.1; shares: hot 0.34, cold 0.12, crunch 0.25, first half 0.5, heat 0.18, Takeover 0.04, last 15 s 0.13 | simulated games: a trait's in-game numbers in OVR points (measured; above) |
| `traits.list` | (the table above) | the numbers, words, icons and deeds of all 17 |

Removed: `traits.spotlightTier`, `spotlightPractice`, `simEdge` (simulated games now read the numbers).

## V2 — 2.0 performance at 4× CPU (§1, item 2)

The second milestone of Hoop Heads 2.0: the lag on slower devices. The targets, with Chrome's CPU throttled 4× (about a
mid-range phone): a median frame of 25 ms or less, no frame over 50 ms during dunks, blocks or celebrations, and a frame
guard that steps down within 0.5 s on a slow device. The new test, `tests/perf4x.js`, plays a live pro-arena 1v1 (AI
against AI) with 5 forced dunks and 3 forced blocks and times every frame, back to back, with a 1-pixel readback so the
canvas rasterizes inside the timing.

The test has two clocks. The **device clock** is the pass/fail one: frames land on a 60 Hz screen's vsyncs (a 20 ms
frame shows on the second one, so the game sees 33 ms go by), so the guards see the slow frames and shed cost. The CPU
is slow from before the match opens. The **fixed clock** advances exactly 1/60 s a frame: the guards see 60 fps and
never shed, so it shows full quality on a slow CPU (reported, not a pass condition).

**Where the time went (V1 at 4×).** Profiles of the dunk path found:

- **Per-frame pixel work.** Each character's sprite was repainted 20 times a second of game time, and at once on every
  new move: a vector paint at 3×, then pixelize (a box filter, a readback and four per-pixel passes). One paint costs
  about 17 ms at 4×, and a dunk (the gather, the jump, the rim hang, the landing) asked for one on most frames.
- **Faces painted mid-play.** A head that changed size by a few pixels picked a new face-cache size and painted every
  expression again. The score bug's portraits painted a new size on every pop. The jumbotron painted its own faces, and
  the replay it shows after a dunk redrew both players twice, 8 times a second.
- **The crowd** was redrawn every frame, and a dunk's camera shake made each frame a full redraw.
- **The posterizer** built its poster card in the middle of the dunk.
- **Garbage.** Each frame made about 45 browser objects (a transform read for every string of the pixel font, the
  score bug's 15 strings, the touch controls' labels). Worse, a match's start dropped about 1,330 canvases (the fan
  atlas pixelized each fan into a new canvas and copied it). A dropped canvas runs a finalizer inside a later full
  garbage collection's pause: two pauses ran 20 and 41 ms at 4×.
- **The frame guard** needed 2 s of slow frames to shed each level.

**What changed.**

- **Character sprites are cached by pose and frame (§1.2).** Every painted pose is kept, up to 160 a player (least
  recently used first out). Its key is the rig's joints in whole sprite pixels, the expression, the eyes, the held
  ball's spot and frame, and the size. A pose painted before (a dribble, a stance, a dunk the second time) is drawn
  from the cache. A pose that leaves the cache lends its canvas to the next paint. At most one sprite is painted a
  frame: a second player due the same frame rides their last sprite one frame longer. A repaint due on a heavy frame
  (one that redraws the crowd, or whose work before the players is 1.5× the usual) waits a frame, at most two. On a
  slow device (a guard two levels down) a repaint is split over two frames: the paint and its box filter (which makes
  the browser rasterize it) in one, the readback and the pixel passes in the next. The player rides their last
  sprite in between, and no other repaint starts while one is half done. It's the same pixels, pose for pose.
- **Cheaper paints, the same pixels.** Match sprites are painted at 2× instead of 3×: an exact 2×2 box filter, 2.25× fewer
  pixels. A sprite's face canvas is painted at 1× its size (was 2×), with the brows baked in, and blitted bilinear. Each
  shoe is a baked image per kit, side and half-octave size. Each jersey letter and number is one composed sprite (its
  two outlines and fill) instead of three draws. The trail ghosts, 8–25% opaque and under the pixel art's alpha cut,
  aren't painted into sprites. Pixelize writes into one shared image buffer and reads its neighbours directly in the
  common cases.
- **The pose rate follows the guards:** 20 / 15 / 12 / 10 poses a second at pixel-guard levels 0–3. A frame guard two
  levels down slows the poses too.
- **Faces stay put.** A player keeps their face-cache size until their head is well outside it (15% over, 40% under).
  A match's first frame paints every expression of both faces at the size their sprites use, the ball's rotation frames
  at each lane's size, and one sprite of each player. A warm-up paint is rasterized then, not at its first use in play.
  The reflections and the jumbotron show one neutral face each, painted at the start. The score bug's grin scales the
  painted portrait instead of painting a new size. The phone's face cache holds 40 faces (was 24): a match uses about 28.
- **The crowd at 15 Hz (§1.2).** The fans are drawn into layers 15 times a second of game time (and at once when the
  camera moves). A layer is drawn without the shake, a few pixels wider than the screen, and moved by the shake. The
  back tiers and the front tiers are two layers that redraw on alternate frames, each still 15 times a second, so a
  frame that redraws the crowd costs half.
- **The net is baked (§1.2, "pre-bake effect sprites").** At rest, each side of each net is one sprite, blitted until the
  net moves (a shot near the rim, a dunk's snap). A camera shake (whole pixels) only moves the sprite. It replaces
  about 1,000 one-pixel rectangles a frame. The dunk's other effects (the shockwave ring, landing dust, sparks) cost 0.03 ms a frame at 4× on average, so
  they're drawn as before.
- **The jumbotron's replay** is dropped from frame-guard level 2 on: it shows the score instead.
- **Posters.** A posterizer's frame only snaps a 480-px copy of the screen. The card (its headline, frame and score) is
  built when the game ends.
- **The score bug is two layers.** The parts that never change mid-game (the panels, the sheen, the stripes, the
  names) are painted once. The changing parts (heat, scores, possession, the clock, the period, the shot clock, the
  half-court call) are painted into a second layer only when one of them changes (the clock: 10 times a second).
  A score's pop after a basket is drawn over the layer: each frame of a pop used to repaint the whole layer (27% of
  the perf test's frames; now 3%). The portraits are drawn over both every frame. A number is drawn a character at a time from cached sprites, so a
  new clock reading makes no new sprite. The layers keep their strings' ink boxes, so the text audits still see them
  every frame. It's the same pixels as V1's score bug (checked in three game states, desktop and phone).
- **Fewer allocations.** Parsed colors are kept: the renderers ask for the same few dozen every frame, and each answer
  was a new array.
- **Fewer browser objects.** A caller that draws several strings under one transform reads it once and lends it to
  the pixel font: the touch controls, the jersey lettering and the score bug's portraits. Per frame on a phone: about
  45 objects → 12.
- **No dropped canvases.** A pixelized result that is copied at once (into the fan atlas, a ball frame, a portrait, a
  warm-up paint) goes through one scratch canvas. The ball frames share one paint canvas. Canvases dropped in a
  match: about 1,330 → 22. Every full GC after a match's first second now takes 8–16 ms at 4× (it was up to 39).
- **The frame guard (§1.2: "within 0.5 s").** It sheds a level after 0.2 s of slow frames (was 2 s). It ignores a
  match's first 0.75 s (its bakes) and the same after a resize. Once its average runs slow (over 20 ms), it counts slow
  time until the average is back under 17.8 ms: it used to stop counting between the two, so a phone at about 19 ms
  took over a second. It restores a level only while a frame's own work averages under 10 ms (room to spare). A level
  it has to shed again within 12 s of restoring it stays shed. At its last level a desktop at 1× gets bigger world
  pixels (at most 270 rows; it had nothing left to lower). It never restores its last level mid-match: the higher
  resolution coming back means a full re-bake, about a second on a slow device. It tries one level back at the next
  match's start, which bakes anyway. One long frame (a garbage collection, a tab coming back) counts as at most 50 ms
  in its average, and after it sheds a level the next one is judged on that level's own frames: a single 0.3 s stall on
  a fast desktop used to shed every level, the last one included, for the rest of the match. The pixel guard steps up after 0.35 s over its budget (was
  90 frames, 4 s on a slow phone) and counts a character's whole paint, not only its pixel passes.

New tuning numbers:

| Constant | Value | Why |
| --- | --- | --- |
| `ART.rtSuperMatch` | 2 | match sprites are painted at 2× (menus and portraits keep `rtSuper`): 2.25× fewer pixels, an exact box filter |
| `ART.rtDown2` | 'low' | the 2× downscale's smoothing: at exactly half size, bilinear is the exact 2×2 average |
| `ART.rtPoseCacheN` | 160 | painted poses kept per player (least recently used first out) |
| `ART.rtPoseHzBy` | [20, 15, 12, 10] | the pose rate at each pixel-guard level (replaces F3's `rtPoseHz` 20 and `rtPoseHzLow` 12) |
| `ART.rtPaintWaits` | 2 | a due repaint waits at most this many frames for a lighter one |
| `ART.rtSplitFrom` | 2 | from this guard level (the pixel guard's, or the frame guard's minus one) a repaint is split over two frames |
| `ART.rtHeavyFrame` | 1.5 | a frame is heavy once its work before the players is this many times the usual (+1 ms), or it redraws the crowd |
| `ART.rtLod` | faceX 1, faceQ 'low', brow, shoe, shoeX 2, shoeQ 'low' | a match sprite's paint (box-filtered right after) takes cheaper ways to the same look |
| `ART.rtCrowdHz` | 15 | §1.2: the fans are redrawn this many times a second of game time |
| `ART.rtGuardUpS` | 0.35 | the pixel guard steps up after this long over its budget (s) |
| `ART.rtGuardDownS` | 4 | ...and back down after this long under half of it (s) |
| `ART.rtLowRows` | 270 | at the frame guard's last level the pixel world has at most this many rows |
| `ART.bucketKeepUp`, `bucketKeepDown` | 1.15, 0.6 | a player keeps their face-cache size while the head is within these shares of it |
| `ART.cachePhone` | 40 (was 24) | face canvases kept on a phone: a match uses about 28 |
| `CONFIG.perf.frameCapMs` | 50 | one frame counts at most this long (3 vsyncs) in the guard's average: a single hitch isn't the device's speed |
| `CONFIG.perf.slowSeconds` | 0.2 (was 2) | §1.2: slow frames for this long shed a level |
| `CONFIG.perf.fastFrameMs` | 17.8 | an average under this is smooth; once slow, the guard counts slow time until it's back under this |
| `CONFIG.perf.recoverWorkMs` | 10 | a level is restored only while a frame's own work averages under this (ms) |
| `CONFIG.perf.relapseSeconds` | 12 | a level shed again this soon after restoring it stays shed |
| `CONFIG.perf.holdSeconds` | 0.75 | the guard ignores a match's first seconds (its bakes) and the same after a resize |
| `CONFIG.perf.jumboReplayUntil` | 2 | the jumbotron replays highlights below this guard level |
| `CONFIG.fx.posterSnapW` | 480 | a posterizer's screen is snapped this wide (px) |

**Tests.** `tests/perf4x.js` is new (above; a forced dunk the play didn't take is tried again, at most 3 times). Two smoke checks follow V2's changes: the posterizer's check accepts the
snapped screen waiting for the final buzzer (its card is built then, and the same check still sees it saved), and the
faces check looks at the size the sprites paint faces (1× the head now, so 96–128 px, not 160 and up). A new smoke step
stalls the page for 0.3, 0.6 and 0.9 s in a match on a desktop that keeps up: the guard sheds no level.

**The numbers** (`tests/perf4x.js`; Chrome's CPU throttled 4×, device clock; V2 is the committed build, three runs):

| | V1 phone | V2 phone (3 runs) | V1 desktop | V2 desktop (3 runs) |
| --- | --- | --- | --- | --- |
| median frame | 32.1 ms | 13.9–14.9 ms | 40.1 ms | 11.7–13.6 ms |
| p95 | 56.6 ms | 25.3–26.3 ms | 72.3 ms | 20.1–23.7 ms |
| worst frame, dunks and celebrations | 112.6 ms (110 over 50) | 55.6–129.9 ms (1–4 over 50) | 157.3 ms (334 over 50) | 37.2–44.2 ms (none over 50) |
| worst frame, blocks | 83.7 ms (90 over 50) | 38.3–55.8 ms (0–1 over 50) | 112.7 ms (152 over 50) | 33.4–45.2 ms (none over 50) |
| frame guard's first shed, after the frames run slow | 2.38 s | 0.15–0.17 s | 2.28 s | 0.17–0.22 s |

At full quality (the fixed clock: the guards see 60 fps and never shed), the phone's median frame is 24.6 ms (V1 30.0)
and the desktop's 17.8 ms (V1 23.0).

**Not met.** On the phone profile (844×390 at 2×) every run still has 1–5 single frames over 50 ms in its dunks and
blocks (55–130 ms). The median, the p95 and the guard's 0.5 s are met there. On the desktop profile every target is
met (one run lost a forced dunk to the test's own setup: a handler caught mid-move; the test now tries that dunk again).
Timing every event listener over the dunks found no slow handler (the worst call: 1.5 ms at 4×). A slow frame's time
lands in different places from run to run (once 27 ms inside the simulation step, where the same step usually takes
2), which looks like the throttler's stalls rather than one piece of work.

## V1 — 2.0 must-fix bugs (§1, items 1 and 3–12)

The first milestone of Hoop Heads 2.0: the eleven bugs the two rounds of automated play found (item 2, the lag, is V2).
Each one has a test.

- **Steals (§1.1).** A swipe that connects is now a *poke*. A clean steal puts the ball straight in the stealer's hands
  60% of the time, +3% per Defense point above 5. Otherwise the ball pops loose, toward the stealer 70% of the time.
  STEAL (the callout and the stat) and the turnover wait for the defense to actually secure the ball. If it does
  within 1 s, that's a steal. Otherwise a small grey POKED callout shows, with no steal stat. A defense that recovers
  it later still forces a turnover, but no one gets a steal. Before, STEAL, the turnover and both stats fired the
  moment the ball came loose, even when the handler grabbed it right back. The poked handler can't touch the ball for
  0.3 s (it was knocked away from them). The stealer can't grab it for 0.15 s, so a loose ball really bounces loose.
  The tutorial's swipe step counts the poke.
- **The 3-Point Contest and the tryout shootout (§1.3).** The white boxes over the player were the ball racks: five of
  them, drawn after the players, all at nearly the same spot in the side view. Now one low two-tray rack stands
  beside the current shooting spot, behind the players, with the balls still to shoot on it (the money ball in
  pink). Its drawing can't leak a line width or color into the players drawn after it.
- **The press room (§1.4).** Each answer is three rows: the name, its effect, the quote. They're measured at the
  current text size, and the buttons grow to fit them. The question bubble fits its question, so four answers with
  two-line quotes fit at 1× and 1.25× text, on desktops and phones. The name and effect lines used to sit on top of
  each other, and quotes were cut to one line at 1.25×. Each answer's name has an ink outline, so the red and cyan
  names read on the blue buttons.
- **Trait rarity (§1.5).** Every generated player (teammates, league opponents, the rival, the pros) now carries
  one trait, shown from the start and rolled with your odds: 55/28/13/4. Opponents and rivals had none; teammates
  and pros had two each, so about 8% of them showed a Legendary. The roll is seeded by a key, so no other random draw
  shifts. Older saves drop the second trait from generated players and give opponents and rivals theirs. Your own
  two traits are untouched.
- **Simmed box scores (§1.6).** One helper builds every simmed shooting line: your amateur games and both lines of a
  pro game. 3PA comes first, and FGA is at least 3PA plus the two-point attempts, so 3PA ≤ FGA, 3PM ≤ FGM and
  points = 2 × (FGM − 3PM) + 3 × 3PM + FTM always hold. A lone point is a free throw. Before, 3PA and FGA were rounded
  separately, which gave lines like 1/3 on threes but 1/2 on all shots.
- **Cut text (§1.7).** The results screen's week line is now two lines, the plan and then the fatigue, so "tired,
  rest this week" is never cut on a phone. The tryout parts' status reads "UP NEXT" (it was a lone gold "next"),
  and the 1v1 part says "After the shootout" until its turn.
- **Screens bleeding through (§1.8).** In the menus, an overlay (for example, What money built over the legacy banners,
  a dialog over the hub) now sits on the dimmed background alone, so no screen is drawn underneath. Before, the screen
  underneath was dimmed 62% with all its words, cards and titles showing through. Push and pop transitions fade the
  old screen out before the new one fades in, where the two used to cross-fade (Negotiate, Signing Day). Raised
  panels (dialogs, overlays) are solid.
- **Recruiting cards (§1.9).** Labels and values are in two fixed columns. The label column is as wide as the widest
  label; values are left-aligned in the rest and wrap rather than run into their label ("ProgramPower conference").
  The cards are wider (380), and "Coach develops" is now "Develops".
- **Negotiate (§1.10).** The agent line wraps onto two lines ("Your agent got this deal +10%. Their fee: 4% of each
  check.") and the money block moves up to make room. On a phone, where the line didn't show at all, it sits beside
  the pay.
- **Signing Day (§1.11).** The "Around the league" panel fades in with its first signing. If there are none, it
  never shows.
- **A season on the bench (§1.12).** The season recaps (amateur and pro) show the team's record, then *All season:
  Benched*, your practice gains (OVR over the season) and your depth-chart challenge record. They used to show 0.0
  points, 0% FG and 0% 3PT. The season logs now keep games played, the OVR the season started at and the
  challenges won and lost. On the amateur recap, the height tags (LAST SEASON, NOW) stay under the YOUR HEIGHT header:
  above a tall player's head they used to run into it (the mannequins are a little smaller on a phone).

The overflow audit gains a two-screens check. It flags any string of a screen underneath that overlaps the top
screen's text, and any screen drawn under a menu overlay at all (cards and titles are sprites, not strings). It also
checks that a transition never shows two screens at once. It also gains six new cases: a
tired week with an injury, Negotiate with an agent, a board with a Power conference and a Blue blood, and a bench
season's recaps (amateur and pro).

The full-career test's driver now challenges for the spot in a benched week, the way a player would (with the
trait roll no longer drawing from the roster's random stream, its seed's freshman lost the starting spot in week 2 and
never played a high school game).

New tuning numbers:

| Constant | Value | Why |
| --- | --- | --- |
| `steal.handBase` | 0.6 | §1.1: a clean steal goes to the stealer's hands this often |
| `steal.handPerDef` | 0.03 | §1.1: + this per Defense point above 5 |
| `steal.looseToward` | 0.7 | §1.1: a loose ball pops toward the stealer this often |
| `steal.confirmS` | 1.0 | §1.1: STEAL needs the defense to secure the ball within this many seconds of the poke |
| `steal.fumbleS` | 0.3 | the poked handler can't touch the loose ball this long (s) |
| `steal.looseStart` | 0.45 | the loose ball starts this far from the handler (m), on the side it pops to |
| `steal.reachS` | 0.15 | the stealer can't grab a popped-loose ball this long (s), so it bounces loose first |
| `contest3.rackOffsetM` | 0.75 | the rack stands this far beside the shooting spot (m), away from the hoop |
| `contest3.rackW`, `rackH` | 0.8, 0.5 | the rack's size (m): two trays, three balls on top and two below |
| `ART.uiTransOut` | 0.3 | the old screen fades out over this share of a transition, then the new one fades in |
| `ART.uiUnderDim` | 0.62 | an overlay in the menus sits on the background dimmed this much (the screen underneath isn't drawn) |
| `ART.uiPanel2` | solid (was 92%) | raised panels never show what's behind them |

| Test | Result |
| --- | --- |
| Steal consistency (`tests/steals.js`) | 2 × 500 scripted steals, 0 mismatches. Defense 6: clean 64.6% (target 63%), loose balls toward the stealer 65.5% (70%; 69.4% over 1,000). Defense 9: clean 71.6% (72%). |
| Trait rarity (`tests/rarity.js`) | 1,000 generated players (388 teammates, 249 opponents, 63 rivals, 300 pros): Legendary 3.8%. 20,000: 55.0 / 27.8 / 13.3 / 3.90%. |
| Box scores (`tests/boxscore.js`) | 1,000 simmed amateur games and 1,000 simmed pro games: every line adds up. The old code broke 124 of the 1,000 amateur lines. |
| Page fixes (`tests/fixes.js`) | 15 of 15, three runs in a row. The racks never change a pixel inside the player (contest and shootout, Retro and Smooth, desktop and phone); the old build changed 7,300 of 18,300 (desktop, Retro, the contest) and failed all 8 cases. The press rows don't overlap or cut, at both text sizes. Signing Day. A benched season's recap. The rack check compares the player's solid inside (less their outer 1–2 px) and counts a pixel only when its color changes outright. The marker over your player is off while it compares frames: the bobbing arrow and the smooth renderer's eased edges shifted a pixel or a few shades now and then. |
| Smoke | 136 of 136 |
| Modes | 13 of 13 |
| Old saves | 34 of 34 |
| Dev tools | all OK |
| Overflow audit | phone 141 screens, desktop 143, desktop at 1.25× text 143, phone at 1.25× text 141: nothing flagged at any size, including the new two-screens check (the old build: 15 overlays flagged, plus the cross-fade, the tired-week cut, the recruiting overlap and the agent line). |
| A whole career through the screens | desktop 1,116 actions, phone 1,064: both passed |
| Art Lab | 55 screenshots, no errors |
| Gate | ✓ (Pro mirror 1.17 PPP, side A 47%, Legend beats Pro 83%; brute force vs Pro 0.94) |
| Balance | ✓ (brute force vs Pro 1.24, timing and reads 1.93, Legend beats Pro 79%) |
| Career simulator | seed 1: every target met (OVR 55 / 66 / 72 at 17 / 21 / 25, peak 77, 0.90 titles, Hall of Fame 13%), 0 stuck |
| Trait balance | every trait in range |

## F12 — The beard you pick shows (a follow-up to the F pass)

The user: "the beards don't show when I select them so fix that".

Facial hair grew in with age (L3): none under 16, stubble at 16–17, the style you picked from 18. Every career starts
at 14. So a beard picked in the creator showed on the Beard row's icons (drawn at 24) but not on your player: not on
the creator's preview (drawn at 15), not in the face editor, not on the hub, the cards or in games, for four seasons.

- **Your player's look is marked as yours** (`look.own`), and the facial hair you pick shows at every age: the
  creator's preview, the face editor, the hub, cards and portraits, and games. Generated players still grow theirs in.
- **The mark goes wherever the look goes:** the creator (its presets included), a new career, the face editor, the pros.
  The face and sprite caches key on it.
- **Older saves** mark your player's look (high school, college or pro) when they load. Nothing else in them changes.
- The creator's hair icons preview your own face, so they show your beard now too.

No new tuning numbers.

| Test | Result |
| --- | --- |
| Smoke | 136 of 136. The F12 step: everyone else's age rule (none at 14, stubble at 17, the style at 18); your beard at 14, 16, 17 and 30; the flag through normLook, cloneLook and the cache key; the creator and a picked preset; a new career and the pros; an older save marked when it loads, a league player not. |
| Modes | 13 of 13 |
| Old saves | 34 of 34 (each marks your look when it loads) |
| Dev tools | all OK |
| Screen audit | phone 135, 1280×720 and 1000×1000 137 each: nothing flagged; phone at 1.25× text, nothing flagged; desktop at 1.25× text, the 3 press screens (the known limit) |
| A whole career through the screens | desktop 925 actions, phone 989: both passed |
| Art Lab | 55 screenshots, no errors; its aging row still grows a full beard in (stubble at 16) |
| Gate, balance | ✓, the same as F11 (Pro mirror 1.18 PPP, Legend beats Pro 83%; the harness: brute force vs Pro 1.24, Legend beats Pro 78%) |
| Career simulator | seed 1: every target met (OVR 55 / 66 / 72 at 17 / 21 / 25, peak 77, 0.90 titles, Hall of Fame 15%), 0 stuck |
| Trait balance | every trait in range |

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
