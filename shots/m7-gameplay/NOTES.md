# M7 screenshots: 1v1 gameplay and AI

M7 is a gameplay milestone, so there are no art rounds. These shots check the screens and HUD pieces M7 added or changed. All were taken on the final M7 build.

- `settings.jpg`, `settings-phone.jpg`: Settings in two columns. Gameplay is on the left, with the new Charges and Career games options; feel, sound and touch are on the right. The old single column ran past its panel once Charges was added.
- `quickplay-half.jpg`, `quickplay-half-phone.jpg`: Quick Play with the Street half court ruleset and its options (scoring, make-it-take-it) and the win-by-2 formats.
- `halfcourt-check.jpg`: a check ball at the top. The defender stands between the ball and the hoop, and the score bug reads HALF · WIN BY 2. The camera stops just past midcourt.
- `halfcourt-clear.jpg`: after a stop, the CLEAR IT PAST THE ARC chip sits under the score bug until the ball goes back out.
- `charge.jpg`: the cyan CHARGE callout, and the defender on the floor after taking it. The script teleports the handler before the call, so the ball floats where the handler used to be. In a real game the ball is in his hands and drops at the whistle.
- `howto.jpg`, `howto-phone.jpg`: How to play with the new post-game and defense tips. The longer tips first ran under the tutorial button, so the two buttons now sit side by side below the tips.
- `round-1/`: the Art Lab sheets and in-match frames, `node tests/artlab.js m7-gameplay 1`. The pre-commit check that nothing visual broke.
- `tour/`: the smoke test tour, `node tests/smoke.js --shots`. It includes the pro pregame's new size call-out (`15-pregame`) and a half-court match from Quick Play (`32-halfcourt`).
