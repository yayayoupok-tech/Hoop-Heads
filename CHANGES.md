# Changes to the spec's starting numbers

The design spec gives starting values and asks for every change to be logged here with the reason.

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
