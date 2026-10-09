# Hoop Heads — plan

Goal: take the 1v1 career game from prototype to something that holds up next to the big browser basketball games, in one
self-contained `index.html` (vanilla JS, Canvas 2D, Web Audio, no assets, no network except the optional Google Font).

This plan follows both spec documents. Their milestone lists are merged into ten steps. Each step ends with a
`node --check`, the Playwright smoke test, Art Lab screenshots (art steps) and a git commit. `AUDIT.md` has the
numbered problems each step targets (#1–#30).

## How the code will be organized

The game stays one file. During development it's edited as section files concatenated into `index.html`; the deliverable
has no build step. New sections:

| Section | Contents | Replaces |
|---------|----------|----------|
| **ART** | palettes (12 skin tones × base/light/shadow/warm, 14 hair colors, 6 irises), `mixHex`/`rgba`/`ink`, the look model v2 and its migration, `faceParamsFromSeed`, the LRU face cache `getFaceCanvas`, `paintFaceBase`, the 14 hair painters, `drawEyesLive` | `drawHead`, `portraitOf` internals |
| **BODY** | jersey, shorts, legs, sneakers, mitten hands, shadow sprite, backlight glow; `drawCharacter(ctx, cam, player, alpha, opts)` | `drawPlayer`'s visuals (same call site) |
| **RIG** | pose nodes (pelvis, chest, head, hands, feet, squash), keyframe clips with easing, 80 ms blending, `poseFor(player, t)`, secondary motion, trails, expression triggers | the IK arm/leg code |
| **VENUE**, **CROWD**, **COURT** (built in M5) | VENUE: the `Venue` class per match (layers L0–L2 and L10 with parallax, one shared `LayerBuffer` at 30 Hz (half resolution until L15, full since), banners, jumbotron, ribbon, benches, pep band, lighting). CROWD: `fanAtlasFor` (32 fans × 6 poses), `buildSeats`, `CrowdState` reactions, `drawCrowdRows`. COURT: `floorTexture` bake, hoops, `Net12`, ball sprite, shadows, reflections, `FrameGuard` | `WorldRenderer` backdrops, `buildFanAtlas` |
| **FX2** (built in M6) | the §5 painters: dust puffs, sweat teardrops, the block impact star, the posterizer's radial blur, the callout pop and colors; new particle kinds in `FXSystem` (spark streaks, dunk shockwave, fluttering confetti) | parts of `FXSystem` |
| **UIKIT** (built in M6) | glass panels, gold and navy buttons, swatch selects, chips, the hexagon OVR badge, trading cards (tier frames, foil, card back), the menu backdrop, count-ups and flips, `tapH`/`phoneGrid` for 64 px phone targets; transitions live in the `UI` class | ad-hoc panel drawing |
| **UI part 6** (built in M6) | the key screens: title face-off, create, genes chart, the hub, season recap, draft night, retirement | the old versions in UI parts 1–4 |

Rules for every renderer: clamp every index, default every missing field, guard NaN, and never throw. The frame loop now
recovers from an exception (M0) and records it in `window.HH_ERRORS`, and the tests fail on it.

## Milestones

**M0 — Audit and setup** *(done)*
- Baseline screenshots at desktop and phone size (`shots/audit/`), `AUDIT.md`, this plan.
- Tests in `tests/`:
  - `smoke.js`: the full desktop flow, other modes, save migrations, regressions, and phone touch.
  - `devtools.js`, `balance.js` (the scripted human), `careersim.js` (40 careers), `perf.js`, `artlab.js`, `shots.js`, `check-syntax.js`.
- The Art Lab (Extras → Art Lab, or `?artlab`): faces at phone size and 250 px, poses, hair, crowd atlas, venues, and (from M3) a body close-up with the six hand poses and sneaker colorways.
- Main menu now has **Extras** (team league, tournament, 3-point, practice, tutorial, Art Lab).
- Fixed the two regressions the new tests found: odd looks crashing `drawPlayer`, and the camera losing a sprinting player.

**M1 — Art foundation: faces** (audit #2, #20) *(done)*
- Look model v2 (`skin 0–11`, `face{…}` params, `hair 0–13`, `hairColor 0–13`, `facialHair 0–5`, `iris 0–5`, `acc{…}`,
  `shoes`, `number`). Old looks are normalized on read (WeakMap-cached) and migrated in the save (v4 → v5).
- `paintFaceBase` exactly per spec §3.4: Catmull-Rom silhouette, key light, far-side and jaw form shadows, eye sockets,
  warm zones, highlights, rim light, baked skin grain, weighted outline, ear, nose, seven mouths, facial hair.
- A face cache keyed by look hash · expression · age stage · size bucket (96/128/160/224/320). It holds 48 entries on desktop,
  24 on phones, and mirrors at blit time (facing −1 is the same painting flipped).
- `drawEyesLive` draws almond eyes with lids, lashes, crease, iris gradient with a limbal ring, pupil, two catchlights,
  blinks every 2.8–5.2 s and pupils that track the ball. Brows are drawn from strokes with the expression table.
- Three visual rounds against the §1 bar, saved in `shots/m1-faces/round-N/`.

**M2 — Hair and facial hair** (audit #10) *(done)*
- All 14 styles from §3.5 with volume outside the skull, the headband, aging gray from 34, and verlet chains so locs and braids sway.
  Three visual rounds.

**M3 — Body and hands** (audit #1) *(done)*
- The §3.1 proportions (head 0.57 H, visual height H = real height): jersey with trim, side panel, folds and outlined number;
  shorts with a stripe; tapered legs and socks; brand-less sneakers; mitten hands in six poses; soft shadow; backlight glow.
- Gameplay hitboxes and reach stay the same. Hands are placed at the real ball, rim and block positions. Three visual rounds.

**M4 — Rig and animation** (audit #21) *(done)*
- The keyframe pose system and every §3.7 clip: idle breathing, run, sprint, slide, dribble with a hand switch, crossover,
  spin, step-back, the jump-shot phases, floater, post hook, fadeaway, layup, five dunks, rim hang, block, steal, box-out,
  stumble, fall and get-up, and six celebrations.
- Squash and stretch, the head spring, trails on dunks, spins and crossovers, sweat, and the expression-trigger table.

**M5 — Venues, crowd, lighting** (audit #5–#9, #25, #28) *(done)*
- High-school gym, college arena, pro arena and blacktop, per §4, with parallax layers and half-res crowd buffers.
- A 32-fan × 5-pose crowd atlas baked with team colors, with reactions that spread along the stands (stand, "oooh", camera
  flashes, the wave).
- Plank floor bake, glass backboard, 12-strand net, light pools, bloom and vignette.
- Career games use the venue for your level.
- The performance guard measures real frame intervals and sheds cost in the specified order: crowd rate, reflections, then glow.
  Three visual rounds.

**M6 — FX and UI** (audit #11–#13, #16–#20, #26, #29, #30) *(done)*
- The §5 effects table.
- UIKIT screens: title faceoff, create screen with a turning model and swatches, the genes reveal chart, a hub with your
  animated model on a platform with a height ruler, trading cards, season recap with count-ups and an OVR chart, draft
  night podium and card flip, retirement banner, and a score bug with mini portraits.
- 200 ms transitions, and a phone pass: 64 px tap targets, safe areas, nothing overflows, and the camera leaves room for the
  touch controls.

**M7 — 1v1 gameplay and AI** (audit #3, #4, #22, #23, #27) *(done: brute force 1.18 PPP vs Pro, reads 1.80 and timing 1.88,
Legend beats Pro 78%, style mix on target, bigs about 1 block a game; see CHANGES.md)*
- A set defender stops a straight drive, and brute force drops to ≤ 1.3 PPP.
- Contests scale with distance and height (+0.03 per dh). Rim protection: bigs get ≥ 1 block per game; jumpers are
  protected for 0.08 s.
- A steal whiff locks you out for 280 ms. Box-outs and 50/50 balls get +0.04 per dh of height difference.
- A formal post game: back-down, drop step, up-and-under, and a hook at base 0.55 with the contest counted at 60%.
  Players under 1.88 m get +8% first-step acceleration and +0.05 ankle-breaker chance.
- Street half court: check ball, clear the ball, make-it-take-it, win by 2, 1s and 2s or 2s and 3s, and a one-hoop camera.
  The career lets you choose it.
- AI plays to its build (post 45% post-ups, shooter 55% jumpers, slasher 60% drives). Difficulty follows career level and
  the rating gap.
- Harness targets: brute force ≤ 1.3 PPP, timing and reads beat brute force, Legend beats Pro 75–95%.
- Also done: charges (a Settings toggle), defender recovery lanes, a fixed spin move, box-outs, matchup-aware possession
  plans, and `tests/stylemix.js` to measure the build mix.

**M8 — Career systems** (audit #14–#19, #24) *(done: the week, fatigue and injuries, the press room, the rival's moments, headlines,
recruiting with visits and commitment day, hidden potential, 4-year deals, the All-Star 1v1, the trophy case and timeline;
the simulator hits every §6.5 target over 3 × 200 careers: OVR 56/69/76, peak 78, 1.01 titles, Hall of Fame 16–20%)*
- A week loop: before each game you choose Practice, Rest or Film. Fatigue and injuries (with a toggle), media answers
  that move hype and confidence, and the rival's scripted moments.
- Recruiting visits and commitment day. Combine measurements feed the draft score.
- Contracts, renewals and free-agent offers. An All-Star 1v1 event and Defensive Player of the Year.
- A headlines feed, season recap, career timeline and trophy case.
- A retirement ceremony and Hall of Fame verdict.
- Playable 60 s drills worth 30–120 XP. Hidden potential that scouts reveal, and growth spurts you see on the model.
- A first-ten-minutes story beat: create, genes, first game, first growth spurt.
- Tune the 40-career simulator onto the §6.5 targets: HOF 10–20%, about 1 title per career, few #1 picks.

**M9 — Balance, performance, phone, gallery** *(done: every audited phone screen has 64 px targets (paged lists, bottom bars,
two-line rows); 16 old saves and 13 mode runs play through without errors; the guard's fourth level renders a slow match at
1.25×; the balance harness reproduces M7; 52 before/after pairs; see CHANGES.md)*
- Full harness and simulator runs, the perf pass at 844×390 in the pro arena, a phone pass and a bug sweep over every mode
  and every old save.
- The before/after gallery in `shots/before-after/`, then publish.

## The Legends look (graphics overhaul, L1–L10)

The spec "Hoop Heads → 'Legends' look in pixel art" asks for screenshots that hold up next to the big-head arcade games:
huge caricature heads with crisp pixel art, a whole court on one screen, bright arenas. Everything stays original.

**L1 — Legends View** *(done: a 13 m court seen whole for every 1v1, players drawn 1.3× taller; one layout registry
drives physics, rules, the AI and the camera; Settings → Camera. §2 gate: mirror 50%, Legend beats Pro 77%, brute force
0.98 PPP; the mirror PPP is 1.44 against a 0.90–1.25 target (Classic 1.65). Three team-order biases found and fixed.)*

**L2 — Faces** *(done: bigger features, six face shapes, five noses, cel shading with crisp gloss, bold near-black
lines, new eyes and mouths, the laugh after dunks and posterizers; a 384 px face bucket and a match-start warm-up of all
8 expressions; Art Lab → Legends check; three visual rounds in `shots/legends/`.)* **L3 — Facial hair and hair**
*(done: beards follow each face shape, 3-tone cel pieces with tufted edges drawn past the jaw line, stubble fading
toward the cheeks; every hair style a bold-outlined two-tone silhouette with one gloss band; clumped afros and curls,
outlined locs; a higher hairline; nothing covers the eyes.)* **L4 — Bodies** *(done: §3.1 proportions, open three-finger
hands that wrap a held ball, high-tops with an original emblem, long baggy shorts, a trimmed tank with wordmark and
number, near-black body lines, a contact shadow, §3.11 overlap order; signature colorways unlock in the pro career.)*
**L5 — Animation exaggeration** *(done: bigger squash and stretch, a springier head bobble with a landing lag,
runs that tilt and flap, front-flip and card-thin spin dunks, rim-hang kicks and a bending rim, knockdowns with orbiting
stars, the BONK!, jump-and-clap, air guitar and laugh celebrations, idle weight shifts and crowd glances.)* **L6 — The Legends Arena** *(done: a bright blue bowl with warm light cones, big invented banners, bobblehead fans,
the LED board and glowing scorer's table, honey maple with team keys, 1.15× backboards; the default court in Legends
View. Career venues get a brighter, more saturated grade in Legends View.)* **L7 — Pixel mode** *(done: Settings →
Graphics, Pixel by default; the scene renders at 240-ish rows and blits at a whole-number scale; a per-venue 32-color
palette with camera-anchored Bayer dither; characters pixelized from a 3× paint with a per-character palette, a 1-px ink
outline and selective inner lines; 8 pre-pixelized ball frames; square particles; a pixel font for callouts; a guard that
sheds pixel work over 4/8 ms.)* **L8 — Chunky UI** *(done: 900-weight gradient
headings with a 4 px outline, drop shadow and an arch; the logo with a code-drawn basketball; buttons with a 3 px outline,
a 6 px lip and a squash-overshoot press; the select wall's bobbling, grinning heads; a bigger score, grinning scorer
portraits, a bigger shot-clock pill; pop-in transitions and a team-color wipe into matches. Pixel mode: menus and the
HUD in a UI layer at 2× internal resolution, notched panels, pixel-font headings on a 6-color ramp, 7×11 score digits.)* **L9 — Optional arcade extras** *(done: a super meter from makes, blocks and steals; Action + Shoot fires a Fireball, a Freeze or a Mega jump; speed shoes, big head and sticky ball power-ups every 20–30 s; Legends View arcade 1v1 only, quick games by default, Settings → Arcade extras.)* **L10 — Performance, phone, before/after gallery, final report** *(done: phones paint Pixel characters at 2× (the phone scene 22.0 → 16.7 ms in the profile); a phone smoke check; `shots/before-after-legends/`: the pre-L1 build, Smooth and Pixel side by side from one script, `tests/gallery.js`.)*

## Playtest pass (L11–L19)

Playtest fixes and graphics, each verified with a measurement before and after (spec: `SPEC_L11.md` in the working
notes; the rules of the Legends pass still hold: one index.html, renderers never throw, a commit per milestone, smoke
and Art Lab before every commit).

**L11 — Running back on defense** *(done: bodies block only in real contact — the handler against a defender between
him and the hoop, box-outs and rebounds, set screens; everything else passes through at 90% speed, the passer drawn
behind. A defender 1.6 m behind a standing handler now gets past in 0.47 s without jumping; before, never.)*
**L12 — Traveling and double dribble** *(done: landing with the ball after jumping with it is a TRAVEL in every
ruleset, and the Arcade re-dribble exception is gone. A picked-up dribble may pivot; walking is a travel, dribbling is a double
dribble, and 5 s held while closely guarded is a turnover. Bots follow the same rules: 0 bot travels per game in 30 bot games.)*
**L13 — True-size players on an 18 m court** *(done: characters are drawn true size on an 18 m court seen whole, with
the floor at 70%; a 2 m player is 1/9.0 of the court, was 1/5. h is 0.78 and the AI spots and contest reach are retuned;
the gate passes except mirror PPP (L19). The All-Star fan vote counts star power.)* **L14 — Symmetric front-facing faces** *(done: faces are built front-on to the spec's construction as one half
mirrored; the 12 cast faces mirror within 0.12% at 256 px (L13: up to 18.8%), and facing slides the features 0.04; three
visual rounds against reference/face-construction.png.)* **L15 — Pixel mode for the players only** *(done: Pixel mode pixelizes only the characters and the
ball, composited at an integer scale on the pixel grid; everything else is the Smooth frame at full resolution, 0.000%
different outside the sprite boxes; the venue dithering, pixel font and pixel menus are gone.)* **L16 — Stop the 1v1 blob** *(done: close players are drawn pushed apart up to 0.25 m each, the one farther
from the ball behind at 0.92 and 0.1 H higher, contact 0.95 m; 60 s Pro vs Pro: median close-play head overlap 0%,
no face over 49% hidden, was up to 100%.)* **L17 — Players read against the crowd** *(done: the crowd is 20% less saturated and
contrasty, a dark band sits behind the players, the LED ribbon and the scorer's table moved above the lowest row, and
three rows of 1.45 m fans; nothing bright or lettered behind the bodies.)* **L18 — Phone layout** *(done: on a landscape phone every touch control sits in the floor band under the
70% floor line, 40% opaque when idle; no jumbotron on phones; 390×844 keeps the rotate screen.)* **L19 — Balance the Legends mirror** *(done: Pro mirror 1.48 → 1.20 PPP with a 10 s clock, farther and
stronger contests, tighter closeouts and a 1.3 s finisher recovery; team A 49%, Legend beats Pro 85%, brute force 0.82.)*

**Finish** *(done: the before/after gallery in `shots/before-after-l11-l19/`, every test's numbers and the deviations in
CHANGES.md's report, and the artifact republished.)*

## Retro look and a real career (R1–R10)

Spec: `SPEC_R.md` in the working notes (the same rules: one index.html, renderers never throw, a commit per milestone,
smoke and Art Lab before every commit, old saves migrate). **Change of plan from the user during R2, which overrides
§3.3 and anything about team games or extras:** the career is 1v1 only — every career game (high school, college, pro,
playoffs, tournaments, All-Star) is a 1v1 game, with no AI teammates on the court and no player-lock team games. The
compact court and its camera are for 1v1 only; the exhibition team modes stay as they are. No arcade extras in the
career, ever. Teams stay as your organization and story: name, colors, uniform, coach and teammates in story cards and
practice; the team's record and titles are your 1v1 record and titles; a depth-chart ladder of 1v1 practice challenges
against teammates decides whether you play each week's game (big programs start you lower); coach trust gives a practice
XP bonus and stronger recruiting and draft recommendations; no chemistry.

**R1 — Retro look** *(done: one 360-row pixel world, pixelize() for every sprite, stepped backgrounds, the Retro Ball
Font, pixel characters in menus, the Retro check page, three visual rounds.)*
**R2 — Size and framing** *(done)* — the 15 m compact court (1v1 only), a 2 m player about 1/7 of the court and 23–25% of the
screen, the Legends venue re-laid out for the bigger players, the gate retuned.
**R3 — Career foundation** *(done)* — save migration; teams as organizations (school, program, franchise: identity, coach,
teammates); growth not locked to position (§3.2); two traits with rarities, adapted to 1v1, and the trait balance test.
**R4 — Ladder and coach trust** *(done)* — the depth-chart ladder, coach trust, teammates in practice; arcade extras out of the career.
**R5 — High school** *(done)* — tryouts, the season, district and state playoffs, rivalry game and senior night, stars and
rankings, visits and commitment day, summers, academics.
**R6 — College** *(done)* — program choice, conference season and tournament, the 64-team bracket, NIL, draft stock, the
transfer portal, declare or return.
**R7 — Pro, money, epilogue** *(done)* — contracts, free agency and trade requests with franchise rosters; the money sinks; the
retirement epilogue and the net-worth board.
**R8 — Hype and press** *(done)* — the §3.8 and §3.9 rules adapted to 1v1, and both balance tests.
**R9 — Story** *(done)* — arcs from beats, RPG event cards with pixel portraits, the news and social feeds.
**R10 — Polish and QA** *(done)* — one Retro UI kit, settings in five tabs with key remapping and 1.25× text, three save
slots, a boot splash, credits, win/loss stingers, onboarding (the tutorial's violations step, first-time tips), every
screen checked at both sizes and at 1.25× text, a whole career through the UI, full-length games restored, the gallery
(`shots/before-after-r/`), the report (the top of `CHANGES.md`), the artifact republished.

## Player feedback (F1–F10)

The user's notes after playing the R10 build, from a screenshot of the Extras menu: remove extras; the game lags a lot,
especially on dunks; text overlaps and hides other text; add items to buy that help a little, nothing broken; the pro team
concept should be better and the team and business side organized like Retro Bowl; a way to see what hype, fame and
the other stats do; XP should be harder to earn; the 3-point contest and practice let you score layups, and rebounds
should come back by themselves; the goal should be getting onto a really good pro team, with teams reworked instead of
the draft; games about a minute long. The earlier rules stand (a 1v1-only career, no extras in it, saves migrate, a
commit per milestone after the suite).

**F1–F2 — Extras and practice** *(done)* — Practice replaces the Extras menu (shooting practice, the 3-Point Contest, the
tutorial); the classic team league and the street tournament are gone (their save data kept); credits in Settings, the
Art Lab in the dev menu; power-ups off by default. The contest and the career's shootouts count only rack threes, walk
you rack to rack and hand you every ball; practice passes every rebound back.
**F3 — Performance** *(done)* — the character pixelize ran every frame (sprites now repaint at 20 per second of game
time and on every new move); a dunk's shake re-baked the arena; a posterizer froze the game three ways. Median frames:
desktop 22.1 → 13.7 ms, phone 33.1 → 17.0.
**F4 — Text** *(done)* — menus size the pixel font from their letterboxed area (square and tall windows drew text up
to 1.8× too big); an overlap audit of every string at six window sizes and a HUD audit find nothing.
**F5 — One-minute games** *(done)* — every career game is one timed minute (Settings: 1, 2 or 3) with sudden-death
overtime; the league model and every per-game number scale with the length, so a season plays like before.
**F6 — Harder XP** *(done)* — every XP source pays 15% less and steps above 60 cost more; the pro years pay about
what they did, so the climb is slower (OVR at 25: 75 → 72) and the peak a point lower.
**F7 — Teams** *(done)* — twelve franchises rated 1–5★ (their stars bring facilities, pay, fame and a deeper bench, and
move with the standings); no draft: three offers capped by the scouts' score, then signing day; you move up when your
value (OVR, fame, hype) reaches a franchise's bar, in free agency or by a trade; the goal track (a 3★ team, a 5★ team,
starting for one, a title with one); the hub organized like a front office (Team, League, Office, Career). Cut text is
flagged by the screen audit and fixed.
**F8 — Shop** *(done)* — a gear shop (six pieces, three levels): +0.5 a level to one rating in games, fewer injuries,
less fatigue; cash or money pays and gear comes along to the pros; +1 a level was tested and too strong.
**F9 — Stats guide** *(done)* — every meter with its value right now, what it does in CONFIG's numbers and how to move
it, from the Career menu, the amateur Stats screen and How to play.
**F10 — QA and release** *(done)* — the suite, every screen at every size, a whole career through the screens on a
desktop and a phone, the frame times, the report (CHANGES.md), the artifact republished.
**F11 — Your team on every hub** *(done)* — the user, after the F pass: "it should tell you which team you're on or
whether you're on varsity or jv (which team is better too)". The hub's header, the Team page and the stats guide say
your team, its level and which level is better.
**F12 — The beard you pick shows** *(done)* — the user: "the beards don't show when I select them". Your player's
facial hair shows at every age (it grew in at 16 to 18, and careers start at 14); generated players still grow theirs.

## Hoop Heads 2.0 (V1–V14)

Two requests from the user, done together: "Hoop Heads 2.0: the big update" and "Part 2: harder climb, real story,
school, shop, staff, pro teams" (where they overlap, Part 2 wins). The rules stand: one `index.html`, renderers never
throw, a commit per milestone after the full suite and a look at the screenshots, old saves migrate, the career is 1v1
only, invented league and team names (the Pro Basketball League, PBL), and the story stays PG.

**V1 — Must-fix bugs** *(done)* — eleven bugs from the 2.0 list (steals, contest racks, generated players' rarity, sim
box scores, overlays, recaps, press rows and more), each with a test.
**V2 — Performance at 4× CPU** *(done)* — cached poses and baked faces, shoes and nets, a calmer frame guard; paint
p50 21.6 → 13.4 ms at 4×, with a perf test.
**V3 — Traits** *(done)* — rarer is stronger, Bronze → Silver → Gold by doing the trait's thing, a third trait late in
a career, trait cards everywhere and the Codex.
**V4 — Gameplay** *(done)* — scouting cards and opponents who play to them, a Boss each season, signature moves at 70
and 80, shot feedback, defense feel, phone controls, next-basket overtime.
**V5 — Career flow and the hub** *(done)* — the pace rules (12–20 points a side in a minute), fatigue and press only
when it matters, playing time (spot starts, the starter challenge), the Road to the League, Sim to next big moment,
Quick results, a five-tab hub with a calendar, and the PBL.
**V6 — A hard climb** *(done)* — Part 2 §1: XP that costs more near the top and past your potential, game grades and
simmed games paying less, a weekly practice cap, setbacks (injuries that cost rating points, slumps), stronger
leagues, and pro teams with scarce spots. The career simulator plays 600 careers × 3 seeds with a typical and a great
policy and prints the §1.1 table.
**V7 — Story engine** *(done)* — Part 2 §2: flags, conditions, the cast with relationship meters, cutscene
backgrounds, and the first five arcs.
**V8 — Arcs, epilogues, records** *(done)* — the remaining arcs (6–8 a career, none in over 70% of careers), at least
four epilogues, the Story so far screen, ceremonies and records.
**V9 — GPA and school** *(done)* — Part 2 §3: exams, eligibility, offers that need a GPA, scholarships and tuition,
majors.
**V10 — Staff** *(done)* — Part 2 §4: agent, skills coach, strength trainer, physio, nutritionist, mental coach;
hired, paid and poached.
**V11 — The Pro Shop and money** *(done)* — Part 2 §5: slots, levels and the +4 cap, a storefront with weekly stock
and try-on, gear drawn on your player, money useful at every stage.
**V12 — Pro teams and championships** *(done)* — Part 2 §6: franchise identity and owners, title odds, best-of-3
playoffs, the ring ceremony, banners, dynasties, franchise moves, retired jerseys.
**V13 — Codex, tooltips, badges, What's new** *(done)* — the rest of the 2.0 UI and content.
**V14 — Release** *(done)* — balance, the full suite, version 2.0, the artifact republished.
**V15 — The loading lag** *(done)* — a follow-up request: no freezes on loading at 4× CPU. A bake worker makes the
next game's venue, players and ball and the menus' pictures off the main thread, ahead of time, and they're kept for
the session; a screen's first frame is drawn before it shows; the title at once. `tests/loadlag.js` walks every screen
change and game load at 4× and 1× and fails on any miss.

## Hoop Heads 2.1 (W1–W10)

The request "Hoop Heads 2.1: playtest fixes, real recruiting, a deeper PBL, and an actual story". Its rules: one
`index.html`, renderers never throw, a commit per milestone, old saves migrate, the full suite only once (at the end;
quick checks per milestone), the career 1v1 only, the PBL invented with invented teams and no draft (teams make
offers), and the story PG.

**W1 — Playtest fixes and the game length** *(done)* — §1.8–12: a running clock (a one-minute game in 70–80 s; the
per-game scale ×0.57 with it), sim buttons that say what's waiting, one All-Star 3-point attempt, records once on the
hub, the Road banner, card names that fit (two lines, then shorter), facilities that pay XP at every star, skills
capped at 95 for everyone.
**W2 — Playtest improvements** *(done)* — §1.1–5 and §1.7: teams come to you (free agency's default is the move up;
a trade offer in season once you cross a better franchise's bar), effort matters (`tests/effort.js`: "plays well +
good choices" vs "sims everything"), sim/play points within 10% at every level (`tests/parity.js`, fitted models of
your points; the records book re-derived), six big buys for a pro's money, Study in the weekly plan with a hub warning
and a C+ floor, leaving college with the agent's advice and the projected offers. (§1.6, the story's rate, is W7's.)
**W3 — 64 colleges and the College Browser** *(done)* — §2.1: 64 programs in eight conferences of eight, the same 64
in the national tournament (nobody left out; your rank sets the seed), each with a place, colors, a pixel crest, an
arena, a tier and prestige, a coach (style, tenure, hot seat), a GPA line and majors, facilities, an NIL market, a
roster and history; per career from the seed (coaches, rosters, the recruits chasing the spots, interest), so nothing
is saved but your program's coach and its titles. The Recruit tab (high school), the College Browser and a program's
page with your chances; offers, your team, your conference and the field come from the registry; old saves keep
their program (`tests/colleges.js`).
**W4 — The recruiting game** *(done)* — §2.2–2.7: interest that moves (fit, coach, home, character, contact,
competition; the GPA line and the class caps), offers week by week from the junior year (elite academic ones on
condition), named recruits and your rival taking the spots, warnings before every pull, three actions a month and
five official visits as scenes, a verbal commitment, flips and the coaching carousel, Signing Day's hats, walk-ons,
the prep year and the College test; the career simulator's typical recruit and the §2.7 table (`tests/recruit21.js`).
**W5 — The PBL's structure** *(done)* — §3.1–3.2: 16 franchises (the 12 and 4 new) in two conferences of 8 with owners
(a meddler among them), GMs and coach systems (and your fit), the cap and the tax line, rosters of five with contracts,
chemistry and team strength in the sims and the odds, a 15-week calendar (rivalry week, the All-Star break, the trade
deadline, the national TV game), playoffs for each conference's top 4 (best of 3, best of 3, a best-of-5 Finals), the
MVP ladder and the award races with the Sixth Man; a 2.0 save expands at its next season (`tests/pbl21.js`).
**W6 — The offseason and league life** *(done)* — §3.3–3.7: the offseason in seven screens (Awards Night, aging,
retirements and their tributes, a five-day free agency week with offers by day and the agent's counter, the trade
window, training camp's two goals, the preseason power rankings); contracts with options, a no-trade clause and
incentives; the other fifteen sign, trade, cut, extend, age and retire, and rookies come from the college system with
your old teammates; title windows and hunger (the longest droughts go all in); the GOAT ladder and the records; PBL
Tonight, the power rankings and the national TV game's intro; a meddler's story beats; the hub's value meter; the
§3.7 targets (`tests/life21.js`, `tests/league30.js`, the career simulator).
**W7 — The story engine** *(done)* — §4.1 and §4.3 (and §1.6): twelve chapters in order (a title card, one big
decision remembered as a flag, a closing scene, a version for every path; passed by when their moment is gone), chapter
1 (freshman year: tryouts, stay late or go home), the cast (a younger sibling, Coach Adeyinka, the best friend met at
tryouts, an age on every portrait), a speaker per page, "This will be remembered", five new cutscene backgrounds (the
bus, the dorm, a college arena, the owner's box, the retirement stage), every scene with a choice, two story screens in
a row at most, 3–5 scenes a season (the beats that can wait keep a place for what can't), "Previously on Hoop Heads"
and the Story screen as chapters (`tests/story21.js`, the career simulator's scenes by phase and chapters reached).
**W8 — Chapters 1–6** *(done)* — §4.2: high school and college in chapters. Varsity (sophomore year: the first
varsity season, a second one or JV again; the rival face to face: shake their hand or talk trash), The Spotlight
(junior year: the letters or none yet; the family's bills: a weekend job or your best friend's family helps, and you
owe them), Signing Day (senior year: three voices at the kitchen table name real programs, the one nearest home, the
dream and your friend's; the closing scene at the signing: what you said and what you signed, a prep year, a walk-on,
the pros), Freshman Wall (college year one, a walk-on's, or the first pro season with no college: grind, or go home for
your sibling's big day) and March (the tournament, Coach Adeyinka's health scare, the knee: play through it or sit; the
pros' playoff race after one college year or none). The chapters tell what the old arcs told (Family Bills, the Best
Friend's choice, the rival's first handshake); the chapters run on the calendar's weeks (a bench season too); story
beats step back for a decision's card (two in a row at most) (`tests/story21.js`, the career simulator).
**W9 — Chapters 7–12 and the endings** *(done)* — §4.2–4.4: the Decision (declare, one more year or four years done;
who speaks for you: the honest agent, the big agency or your best friend, whose path it settles), Rookie (the first
contract with no draft, the veteran mentor, learn or demand minutes), Prime (a billboard or a commercial, the sponsor's
night against your sibling's, the big agency's scandal), the Ring Chase (a contender calls: stay or leave; your rival
reacts; Coach Adeyinka coaches again or retires), Finals over a window of seasons (the rematch, before the game that can
end it: a speech, silence or a call home) or the One That Got Away, Legacy (your sibling a prospect or in need; what
comes next: your sibling, a kid from the academy, coaching or a team of your own) and the six endings, each a cutscene
with your sibling's last line. No scene twice in a career (R9's recurring beats have versions); the last day is two
story screens (`tests/story21.js`, the career simulator's endings, paths and repeats).
**W10 — Release** *(done)* — the full suite once, on one snapshot of the build (and everything two text fixes after it
can touch, again on the final build); every target table printed in `CHANGES.md`'s 2.1 report (§1.1–1.5, §1.8, §2.7,
§3.7, §4.4, Part 2's §1.1 and 2.0's §7 tests); version 2.1 with What's new in 2.1 and the README; the artifact
republished.

## Hoop Heads 3.0 (X1–X11): the Retro Bowl rework

The request "Hoop Heads 3.0: the Retro Bowl rework". A new direction that overrides the earlier requests where they
disagree: no story; a lean, replayable career in the spirit of Retro Bowl (a fast weekly loop, clear charts and
rankings, real tournaments, upgrades that matter); the code kept ready for a mobile app with optional purchases (a
disabled store stub, no real payments, no paid random rewards, nothing that can't be earned by playing). Its rules: one
`index.html`, renderers never throw, a commit per milestone, old saves migrate, quick checks per milestone and the full
suite once at the end, the career 1v1 only with no arcade extras, the PBL invented with invented teams and countries'
names only.

**X1 — Critical fixes** *(done)* — §0: the memory leak (every game of a session stayed in memory through the previous
game's presentation hooks; the worker's sheets and shoe bakes were never pruned; caches without a byte cap; evicted
pictures are closed and their outside holders paint again) and the scoring pace (12–18 points a side in a 70–80 s game:
a half-court restart after a basket or a dead ball, shorter beats, a 6 s shot clock and a make bonus by level; the
sims refitted to it) (`tests/memory.js`, `tests/pace.js`, `tests/parity.js`).
**X2 — Removals and save migration** *(done)* — §1: the story, press conferences, rivals, rarity, recruiting busywork,
hype (Fame instead) and the old staff menu go; rarity becomes levels, traits become badges; news, Road goals, the Codex
and the Front Office stay; old saves load with what's removed taken out (`x30Migrate`). §6.1's fixed store (twelve
items, levels 1–5, prices by stage) and §6.3's earned badges (17, Lv1–Lv3, each with its deed) landed here; X7 adds
the tournament items. Decisions are already short messages. Titles (0.78 a career) and the Hall of Fame (13%) are over
target with the badges' levels: X10. Eight older tests still drive removed flows; they're rewritten with X3, X8 and X9.
**X3 — The Retro Bowl home, the weekly loop, messages and practice** *(done)* — §2–3: HOME with five tabs along the
bottom (HOME, LEAGUE, EVENTS, CAREER, STORE); PLAY → one result screen → HOME, SIM → a toast, the season's end one
review screen (`tests/loop.js`: at most 2 screens between games on PLAY, 1 on SIM, at every level); events sorted
into info (rewards and headlines), messages (one a week), urgent ones, moments and the season; a plan that sticks
(Auto, Focus, Rest, Study; Rest over fatigue 70), training at every game, +1 steps, "+1 in about N weeks", an
optional 30 s drill worth up to +50%; `xpEarn` 9 → 2.3 keeps X2's curve within a point to 25 (two higher after: X10).
The overflow audit (`tests/screens30.js`, on `tests/auditkit.js`) covers every new screen at a desktop, a phone and
1.25× text; later milestones add theirs.
**X4 — Rankings and charts** *(done)* — §4.1–4.2: weekly player and team rankings at each level from how people
play (points a game first; FG%, turnovers, wins and opponents break ties; teams by record, margin, opponents), never
OVR: high school ranks a nation of 140 invented schools' starters with your district, college all 64 programs, the
PBL its league; the top 100 with ▲▼; stars follow the team rankings (`tests/rankings.js`: the top scorer in the top
10 in 98% / 100% / 100% of seasons). The LEAGUE tab's charts: rankings, leaders, standings (PCT, GB, streak, last
five), brackets, your team's page (title odds, titles by year) and your charts.
**X5 — Teammates, lower leagues, transfers and PBL team life** *(done)* — §4.3–4.5: five on every team; the four
behind the starter play the league below (JV, the Reserve League, the PBL Development League) with real games, lines,
standings and rankings, and you play there when you don't start (no lost seasons); the depth chart follows form (the
last 3 games' points; ahead of the starter 3 weeks running takes the spot) and the challenges and spot starts are gone;
high school is one team (tryouts set the depth chart); transfers (high school's one, the portal, trades, free agency,
buyouts, call-ups and send-downs, the Overseas League) and the Transfers chart; the Overseas League (twelve clubs
abroad: a season there when no PBL franchise calls, a background league in the pros); the Teams chart's cards with
dynasties (`tests/lower.js`). On the way: simmed amateur games graded F since V6 (a missing turnover count); fixed,
with `amateur.simGameXp` keeping their XP where it was (X10 tunes progression).
**X6 — Tournaments, rewards and difficulty** — §5.
**X7 — Items and badges** — §6.
**X8 — Your crew** — §7.
**X9 — Recruiting** — §8.
**X10 — Progression tuning** — §9.
**X11 — App readiness, the full suite, version 3.0, the republish** — §10–11: every §11 table printed; the README's
feature list rewritten for 3.0 (it still describes 2.1's story, press room, rarities and staff).

## Testing every milestone

```
node tests/check-syntax.js         # node --check on the extracted script
node tests/smoke.js                # desktop flow + modes + migrations + regressions + phone touch (0 errors allowed)
node tests/artlab.js <m> <round>   # art milestones: Art Lab + in-match frames → shots/<m>/round-<n>/
LAB_ONLY=legends node tests/artlab.js legends <n>   # the §10 rounds: Legends check pages + in-game Legends View frames (L2)
node tests/reel.js <m> <round> [court]   # animation milestones: the first frame of each key move in a live bot match
node tests/devtools.js             # runSims (1v1 Pro mirror, Legend vs Pro, 3v3), shotLab, tunnelTest
node tests/balance.js [n]          # scripted human: PPP by strategy vs Pro and Legend
node tests/careersim.js 40         # 40 simulated careers vs the §6.5 targets
node tests/perf.js                 # frame cost at 844×390 in the pro arena (CPU raster in headless Chromium)
node tests/loadlag.js              # loading lag at 4× and 1× CPU: every screen change and game load, fails on any miss (V15)
node tests/modes.js                # every mode to its end (M9)
node tests/oldsaves.js             # every fixture save reloaded and played on (M9)
node tests/phoneaudit.js [dir]     # phone tap targets, overlaps and text size on 65 screens (M9)
node tests/loop.js                 # 3.0: the weekly loop's screens between games at each level (§2.2)
node tests/screens30.js [dir]      # 3.0: the overflow audit of the 3.0 screens at a desktop, a phone and 1.25× text (§11)
node tests/rankings.js [n]         # 3.0: rankings follow how people play at each level (§4.1, §11)
node tests/gate.js [n] [hn]        # the §2 Legends View gate: mirror, Legend vs Pro and the harness in both layouts (L1)
node tests/tojpeg.js <dir>         # milestone screenshots: PNG → JPEG
```

Every tuned number is logged in `CHANGES.md`.

## Risks and how they're handled

- **Size:** the file is ~740 KB and new art code will add maybe 150 KB. That's fine for a single-file game. Caches keep
  the per-frame cost down.
- **Performance of painted faces:** faces are painted once into cached canvases and blitted each frame. Only the eyes are live.
- **Visual quality is subjective:** every art milestone gets at least three screenshot-and-fix rounds, written down in
  `CHANGES.md`. Without reference images, the bar is the spec's own numbers and descriptions.
- **Saves:** migrations only add fields and convert looks. Nothing is deleted, and the fixtures in `tests/fixtures/` cover
  v2, v3 and v4 saves, plus saves written by the builds before M0, M0, M5 and M7 (M9).
