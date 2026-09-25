# Changes to the spec's starting numbers

The design spec gives starting values and asks for every change to be logged here with the reason. New constants added
without a spec value are listed per milestone too.

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
- Pro titles: 1.27 per career (target about 1). Close.
- Hall of Fame: 43% (target 10–20%). Too high: players who stay near the top win several MVPs, and an MVP is worth as much as a title in the legacy formula. To fix in the balance milestone.
- Stuck states: 0.
