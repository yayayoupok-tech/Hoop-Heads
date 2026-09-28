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
node tests/modes.js                # every mode to its end (M9)
node tests/oldsaves.js             # every fixture save reloaded and played on (M9)
node tests/phoneaudit.js [dir]     # phone tap targets, overlaps and text size on 65 screens (M9)
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
