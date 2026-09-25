# M8 screenshots: career systems

M8 is a career milestone, so there are no art rounds. These shots check every screen M8 added or changed. All were taken on the final M8 build by the scratch scripts `m8shots.js`, `m8bshots.js`, `m8cshots.js` and `m8dshots.js` (a scripted career, some parts fast-forwarded). Each file has a `-phone` twin at 844×390 with touch.

The week (`m8-*`)
- `m8-01-hub`: the hub's THIS WEEK row. PRACTICE carries the AUTO tag (the plan that runs if you play without choosing). The fatigue meter has a tick at 50. On a phone the row sits under the matchup, where three 64 px buttons fit.
- `m8-02` to `m8-04`: the practice screen. The week's focus has a check and a cyan outline; the keyboard focus stays gold. Ceilings are red bands until scouts pin them down. Strength and Athleticism have no drill (weight room), so PLAY THE DRILL hides.
- `m8-05-session-done`, `m8-06-hub-practiced`: a simmed session, then the hub with PRACTICE done and the other two locked.
- `m8-07-hub-tired`: fatigue 50 after five film weeks in a row: "one more game and it starts to cost you".
- `m8-08-film`: the film room. How they score comes from the opponent's build, then their best and worst ratings, moves, size and a game plan.
- `m8-09-hub-rested`, `m8-10-result`: Rest takes 25 off; the result screen's THE WEEK line.
- `m8-11-drill-handles`, `m8-13-drill-defense`: the 60 s drills with their own HUD (clock, score, stops). The script lets bots play both sides, so callouts from several possessions pile up in one frame.
- `m8-12-drill-done`: the drill's XP (30–120 by score) and a move learned from it.
- `m8-14-pro-hub`, `m8-15-pregame`, `m8-16-pro-result`: a pro week with film done, fatigue 58 and a sprained ankle. The tale of the tape lists this week's effects as chips.
- `m8-17-settings`: the Career injuries toggle.

The story (`m8b-*`)
- `m8b-01-first-event`: the FIRST DAY card from your coach, before the first game.
- `m8b-02-press`, `m8b-03-press-answered`: the press room (step-and-repeat, microphones, camera flashes), three answers with their effects, then the headline.
- `m8b-04-rival-final`: a rival card (the finals rematch).
- `m8b-05-headlines`: THE DAILY DRIBBLE with hype and confidence.
- `m8b-06-hub-links`: News, Trophies and Timeline links.
- `m8b-07-pro-draft-rival`: the draft-night rival card. The test league puts both players on the undrafted line, hence "Nobody picked either of you".

Recruiting and potential (`m8c-*`)
- `m8c-01-first-day`, `m8c-02-the-week`: the first two story cards.
- `m8c-03-practice-bands`: ceilings as scout bands ("potential B− to A").
- `m8c-04-growth`: the first growth spurt card, last summer's you beside this one.
- `m8c-05-recruiting-battle`: the rival card when the offers arrive.
- `m8c-06-offers`, `m8c-08-offers-visited`: the offer board before and after a visit (facilities and the coach's specialty revealed).
- `m8c-07-visit`: an official visit, you in their jersey.
- `m8c-09-commit-hats`, `m8c-10-committed`: commitment day. Your hat lifts off the table onto your head.
- `m8c-11-college-hub`: the college hub in the program's colors.

The pros and the legacy (`m8d-*`)
- `m8d-01-allstar-weekend`, `m8d-02-allstar-done`: the All-Star weekend: the 3-point contest and the 1v1 bracket to 11. The script boosts your ratings so the fan vote picks you, then sims.
- `m8d-03-trophies`: the trophy case (high school, college and pro pieces), career highs, career earnings and the legacy meter.
- `m8d-04-timeline`: OVR by age with every event underneath.
- `m8d-05-offseason-awards`: All-League 1st and 2nd teams and the spec's DPOY.
- `m8d-06-contract-year`: free agency with 4-year offers.

`tour/`: the smoke test tour, `node tests/smoke.js --shots shots/m8-career/tour`.
