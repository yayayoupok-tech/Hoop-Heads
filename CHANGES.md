# Changes to the spec's starting numbers

The design spec gives starting values and asks for every change to be logged here with the reason. New constants added
without a spec value are listed per milestone too.

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
