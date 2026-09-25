# Changes to the spec's starting numbers

The design spec gives starting values and asks for every change to be logged here with the reason. New constants added
without a spec value are listed per milestone too.

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
- Pro titles: 1.27 per career (target about 1). Close.
- Hall of Fame: 43% (target 10–20%). Too high: players who stay near the top win several MVPs, and an MVP is worth as much as a title in the legacy formula. To fix in the balance milestone.
- Stuck states: 0.
