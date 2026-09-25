# Changes to the spec's starting numbers

The design spec gives starting values and asks for every change to be logged here with the reason. New constants added
without a spec value are listed per milestone too.

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
- Pro titles: 1.27 per career (target about 1). Close.
- Hall of Fame: 43% (target 10–20%). Too high: players who stay near the top win several MVPs, and an MVP is worth as much as a title in the legacy formula. To fix in the balance milestone.
- Stuck states: 0.
