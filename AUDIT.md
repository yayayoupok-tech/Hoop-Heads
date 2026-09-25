# Hoop Heads — baseline audit

Build audited: `d3c2eae` plus the M0 test hooks (Art Lab, harness, two crash fixes). Screenshots are in
`shots/audit/` (desktop `d*`, 1280×720; phone `p*`, 844×390 with touch at 2× DPR) and `shots/m0-baseline/round-1/` (Art Lab).
`reference/` doesn't exist in the repo, so the comparison below is against the written bar in the spec (§1), not reference
images.

Measured numbers come from the new harnesses (`tests/balance.js`, `tests/devtools.js`, `tests/careersim.js`, `tests/perf.js`);
the raw output is pasted at the end.

## The 30 biggest problems, ranked

| # | Problem | Evidence |
|---|---------|----------|
| 1 | **Characters are stick figures.** The head is about 43% of the drawn height, not 55–60%. Arms and legs are round-capped sticks from an IK solver, and bodies are thin. Next to a Basketball Legends-style build it reads as programmer art. | `shots/audit/d08_hs_match_jumpshot.jpg`, `shots/m0-baseline/round-1/lab-2-poses.jpg` |
| 2 | **Faces are flat vector doodles.** Every player shares one head silhouette and differs only in skin fill and hair. At phone size (40 px heads) the 12 lab players are hard to tell apart, and "angry" can't be drawn at all (it falls back to neutral). There are no lids, lashes, lip shading or painted form shadows. | `shots/m0-baseline/round-1/lab-0-faces-phone.jpg`, `lab-1-faces250-p1.jpg` |
| 3 | **Brute force wins.** Sprint + Shoot at the rim scores **1.80 points per possession against Pro and 1.91 against Legend**, winning 83–92% of games. The target is ≤ 1.3. This is the old "unstoppable sprint + shoot" regression, back again. | balance table below; `shots/audit/d09_hs_match_rim.jpg` |
| 4 | **Rim protection doesn't exist in 1v1: 0.0 blocks per game** for the human and for bots (the Pro mirror averages 0.0 blocks). Bigs can't protect the paint. | devtools and balance tables below |
| 5 | **Pro games are played on the city rooftop and the blacktop.** There is no pro arena, and the venue doesn't change from high school to college to the pros. | `shots/audit/d25_pro_match_start.jpg`, `d27_pro_match_dunk.jpg` |
| 6 | **The crowd is a flat wallpaper** of tiny sprites with dot faces and fully saturated shirts. It competes with the players, and the high-school gym has a stadium-sized crowd. | `shots/audit/d07_hs_match_start.jpg`, `d19_college_match.jpg` |
| 7 | **The hoop is an edge-on white bar** with a red stripe, a bare pole and a shot-clock box floating in the air. There's no glass, inner square or padded stanchion. | `shots/audit/d09_hs_match_rim.jpg` |
| 8 | **The floor reads flat.** Court lines are dark outlines, the key isn't painted, and there are no light pools or specular streaks. Player reflections float detached at the bottom of the screen. | `shots/audit/d08_hs_match_jumpshot.jpg` (bottom edge) |
| 9 | **The lighting is flat.** There's no warm key light, rim light or arena mood, so players don't pop off the background. | `shots/audit/d08_hs_match_jumpshot.jpg`, `d26_pro_match_jumpshot.jpg` |
| 10 | **Hair is thin.** There are 10 styles, not 14. The high top renders as a gray box that looks like a trash can, and styles have no strands, curls or volume. | `shots/audit/d24_pregame.jpg`, `d27_pro_match_dunk.jpg`, lab row 8 |
| 11 | **The hub is a wall of small text and bars.** Your player is a 128 px portrait, not an animated model, and there's no height ruler or last-season comparison. | `shots/audit/d06_hs_hub.jpg`, `d23_pro_hub.jpg` |
| 12 | **The phone layout doesn't work.** Hub text renders at 8–10 px, menu buttons are about 28 px tall (the target is ≥ 64 px), and the "Focus: Handles & speed" value overflows its button. | `shots/audit/p05_hub.jpg` (in `p2` sheet), `d06_hs_hub.jpg` |
| 13 | **On phones the touch stick covers your player**, because the camera ignores the controls. Hint pills run off both screen edges, and one touch button shows a blank "—" label. | `shots/audit/p06_match_touch.jpg`, `p07_match_moment.jpg` |
| 14 | **A season is Play/Sim clicking.** There's no week decision (practice, rest or film), no fatigue, injuries, media or headlines, and fewer than 10 real decisions per season. | `shots/audit/d06_hs_hub.jpg`, `d18_college_hub.jpg` |
| 15 | **Recruiting is a list of three buttons.** There are no campus visits, no commitment day and no recruiting battle with the rival. | `shots/audit/d17_college_offers.jpg` |
| 16 | **Draft night and retirement aren't events.** The draft is a list with no stage, podium or card flip. Retirement has no ceremony and no jersey banner. | `shots/audit/d22_draft.jpg` |
| 17 | **Growth is invisible.** In the season recap, the "last year 5′11″" and "now 6′2″" models look the same height, and the ruler doesn't line up with the heads. | `shots/audit/d15_season_recap.jpg` |
| 18 | **History is an empty table.** There's no career timeline, trophy case or chart of OVR by season. | `shots/audit/d14_hs_history.jpg` |
| 19 | **The genes reveal is a text list** with a tiny ruler, not a doctor's chart where your silhouette grows toward a projected ghost. | `shots/audit/d05_genes_reveal.jpg` |
| 20 | **The menus are all words.** There are no trading-card player cards. The create screen has a paragraph of rules, and look selects show "Tone 4" or "Color 2" instead of swatches. | `shots/audit/d02_menu.jpg`, `d03_create.jpg`, `d04_customize_face.jpg` |
| 21 | **The animation set is thin.** Idle and run use the same stance, the dribble has no hand switch, and shots and dunks have no anticipation or follow-through. There's one celebration and no fall or get-up. | `shots/m0-baseline/round-1/lab-2-poses.jpg` |
| 22 | **Scoring is too easy overall.** Bot-vs-bot 1v1 runs at 1.6–1.8 PPP, and every scripted strategy except button mashing beats Pro. A set defender doesn't stop a straight drive. | devtools and balance tables below |
| 23 | **Legend vs Pro is below its floor in one sample:** 69% over 36 games in the harness run, against a 75–95% target. Another sample hit 88% over 16 games. Too noisy to trust, so it needs larger samples and tuning. | balance and devtools output below |
| 24 | **The career economy is too generous.** The Hall of Fame rate is 40% (target 10–20%), there are 1.57 titles per career (target ≈ 1), and 7 of 40 careers go #1 overall ("few #1s"). | careersim output below |
| 25 | **The performance guard can't see raster cost.** It times only JavaScript, which is about 1.2 ms per frame. Real software-raster cost at 844×390 at 2× is 34 ms median (50 ms p95), and 220 ms at 4× CPU throttle, so the guard never engages. | perf output below |
| 26 | **The title screen has no drama.** Two small mannequins stand far apart, with no spotlight faceoff and no logo drop. | `shots/audit/d01_title.jpg` |
| 27 | **Numbers clash.** Both players often wear #7, because the created player defaults to 7 and bots reuse it. | `shots/audit/d09_hs_match_rim.jpg`, `d34_quick_match_shot.jpg` |
| 28 | **Pennant banners are cut off** at the top edge. The shot clock shows twice (under the score bug and over the backboard), and hub headers are clipped at the top. | `shots/audit/d08_hs_match_jumpshot.jpg`, `d18_college_hub.jpg`, `d20_combine_hub.jpg` |
| 29 | **The effects are placeholders.** "BONK" shows as faded text behind the players, On Fire is a big translucent orange ellipse, and the 3-point rack is a stack of flat rectangles. | `shots/audit/d28_pro_match_rebound.jpg`, `d27_pro_match_dunk.jpg`, `d37_threept_contest.jpg` |
| 30 | **The 5v5 classic league piles 10 players into one unreadable stack**, and the touch title screen shows keyboard hints ("Enter select · Esc back"). | `shots/audit/d44_team_5v5_match.jpg`, `shots/audit/p01_title.jpg` |

Also noted but lower priority: the 3-point, tournament and practice setup screens are mostly empty panels (`d35`, `d36`,
`d38`), and the post-game box score is tiny (`d29`).

## Regression checks (must stay fixed)

| Regression | Status now | How it's checked |
|------------|------------|------------------|
| Touch taps crashed (a `down` property shadowed `down(e)`) | fixed — tapping every touch button and dragging the stick is safe | `tests/smoke.js` phone steps |
| Scoreboard digits misaligned, nearly invisible | fixed (legible in every match shot) | visual, `shots/audit/d0*_match*.jpg` |
| Camera could lose your player | **was still possible**: a sprint left the frame by 47 px. Fixed in M0 with a hard frame clamp after the camera spring (`CONFIG.camera.playerKeepM`) | `tests/smoke.js` camera step |
| Sprint + Shoot at the rim ≈ 2 PPP even vs Legend | **regressed**: 1.80 PPP vs Pro, 1.91 vs Legend. Fix scheduled for M7 | `tests/balance.js` |
| Dunks ignored the contest | fixed — contested dunk P is lower than open | `tests/smoke.js` |
| Legend blocked most jump shots | fixed (too far: nobody blocks anything now, see #4) | `tests/balance.js`, `tests/devtools.js` |
| Odd look values crashed face drawing | **was still possible** in the body painter (`drawPlayer` indexed skin with `%` and `hexToRgb` threw on `undefined`). Fixed in M0 | `tests/smoke.js` odd-look step |

## Raw output

`node tests/balance.js 12 21` (scripted human, mirrored ratings, 12 games per cell):
```
strategy                                   vs       games  win%  PPP   botPPP  FG%   rim/mid/3/hook per game   blk  opp-blk  stl  TO
Brute force: sprint + Shoot at the rim     pro        12    83  1.80    1.60   81   11.5/1.3/0.0/0.0        0.0     0.0  1.8  0.4
Button mash                                pro        12     0  0.19    1.42    8   0.8/2.1/13.9/0.0        0.0     0.0  3.1  0.3
Only drives (no moves)                     pro        12    67  1.80    1.74   81   12.1/0.8/0.0/0.0        0.0     0.0  1.0  0.8
Only threes (average timing)               pro        12    83  1.58    1.41   47   0.0/0.4/14.3/0.0        0.0     0.2  2.3  1.6
Perfect-timing jumpers                     pro        12    92  2.14    1.63   70   0.6/0.7/9.2/0.0         0.0     0.0  1.3  0.9
Reads the defender, mixes moves            pro        12    83  1.83    1.55   85   10.0/0.3/1.3/0.0        0.0     0.0  0.9  2.1
Brute force: sprint + Shoot at the rim     legend     12    92  1.91    1.27   82   12.4/0.8/0.0/0.0        0.0     0.0  4.9  0.1
Button mash                                legend     12     0  0.23    1.40    9   0.8/2.1/14.7/0.0        0.0     0.1  4.0  0.0
Only drives (no moves)                     legend     12    75  1.91    1.48   77   12.8/0.7/0.0/0.0        0.0     0.0  4.8  0.2
Only threes (average timing)               legend     12    33  1.12    1.32   35   0.0/1.5/15.3/0.0        0.0     0.9  7.5  1.3
Perfect-timing jumpers                     legend     12    92  1.84    1.34   59   1.0/0.8/10.9/0.0        0.0     0.2  3.8  0.3
Reads the defender, mixes moves            legend     12    92  1.65    1.12   68   7.6/4.1/2.6/0.0         0.0     0.1  5.5  0.3
Legend vs Pro (bot vs bot, 1v1, first to 21): Legend wins 25 of 36 (69%) · PPP 1.76 vs 1.52
targets: brute force vs Pro ≤ 1.30 PPP → 1.80 ✗ · timing/reads beat brute force → 2.14 vs 1.80 ✓ · Legend beats Pro 75–95% → 69% ✗
```

`node tests/devtools.js --quick`:
```
1v1 · Pro mirror · first to 21:        games 12  wins 6/6   PPP 1.64 / 1.61   blk 0.0 / 0.0
1v1 · Legend (A) vs Pro (B):           games 16  wins 14/2  PPP 1.81 / 1.36   Legend win rate 88%
3v3 · Pro mirror · 2:00 halves:        games 4   wins 3/1   PPP 1.02 / 0.95
shotLab: three·GOOD·open 45.0% model / 37.0% actual / 100% roll honored; three·PERFECT·open 100/100/100; mid·SLIGHT·0.3 25.5/23.5/100; deep·GOOD·0.6 15.4/13.0/100
tunnelTest: 1000 balls · tunneled 0 · rim hits 365 · board hits 455
```

`node tests/careersim.js 40 1`:
```
median OVR at 14/17/21/25/29/33: 42 / 57 / 69 / 77 / 79 / 70
peak OVR median 79 · peak age median 27 · peak range 70–88
draft picks: #1 ×7 · top 5 ×8 · 1st round ×20 · 2nd round ×18 · undrafted ×2 · median 31
pro titles: mean 1.57 · careers with a title 30 · MVPs mean 1.60
Hall of Fame: 16 of 40 (40%) · legacy median 77 · pro seasons median 14 · retire age median 34
TARGETS: OVR@17 57 ✓ · OVR@21 69 ✓ · OVR@25 77 ✓ · peak 79 ✓ · titles/career 1.57 ✗ · HOF 40% ✗ · stuck 0 ✓
```

`node tests/perf.js 400` (headless Chromium; canvas rasterizes on the CPU, so these are software costs, not a phone):
```
844×390 @2x · arena · CPU throttle 1× · frame cost median 34.10 ms · p95 50.50 ms · quality guard off
844×390 @2x · arena · CPU throttle 4× · frame cost median 219.90 ms · p95 272.60 ms · quality guard off
```

`node tests/smoke.js`: 45 passed, 0 failed, after the two M0 fixes. Before them, two steps failed: odd looks crashed
`drawPlayer`, and the camera lost the player by 47 px.
