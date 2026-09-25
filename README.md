# Hoop Heads

An offline 1v1 arcade basketball career game in a single `index.html`. You're measured at a draft combine, picked by a club, and you play a whole career in a sixteen-player one-on-one league: seasons, playoffs, awards, contracts, sponsors, injuries, getting older, and a Hall of Fame vote when you retire. No online play, no accounts, no analytics, no network requests except one optional Google Font.

Big-head caricature players drawn in code, bouncy physics, dunks, blocks, hooks, fadeaways, ankle breakers, posters. Under the hood: a fixed-step 120 Hz simulation, real ball physics with an analytic shot solver, and bots that press the same virtual buttons you do.

## Play it

Open `index.html` in a current Chrome, Safari, Firefox or Edge. It works from a double-click on the file and when hosted on any static host (GitHub Pages, Vercel). Landscape only on phones. If the page is embedded in another page, click the court once so it receives the keyboard.

## The career

1. **Create your player.** Pick a face and a jersey number, a season length (8, 15 or 30 games) and a game length (1:30, 2:00 or 3:00 halves).
2. **The draft combine.** Height, wingspan, standing reach, vertical, sprint time and bench reps are measured once, and scouts grade your potential. You can't choose or re-roll your height. You can still grow up to 2 cm a summer until you're 20.
3. **Pick a play style.** Sharpshooter, Playmaker, Slasher, Lockdown, Rim Protector or Post Scorer. The style sets your starting skills. Speed, hops and strength come from the combine. Every card says whether the style fits your frame.
4. **Draft night.** Four rookies join twelve veterans. You land at one of eight clubs, each with a home court, training facilities (one to three stars) and a clubmate you scrimmage with.
5. **Seasons.** The schedule is a round robin (15 games), half of one (8) or a double (30), with home and away split evenly. The rest of the league is simulated around you. There are standings, league leaders, Player of the Week, an All-Star 3-point contest at mid-season (you get invited if you shoot well or the fans love you), a rival who keeps score, and a news feed. The top eight make the playoffs: one-game quarterfinals and semifinals, then a best-of-three final. Awards are MVP, Finals MVP, Defensive Player, Rookie of the Year, Most Improved, Scoring Champion and the All-ISO First Team.
6. **Getting better.** Every game gives XP for what you actually did: made shots, perfect releases, dunks, ankle breakers, steals, blocks, rebounds, low turnovers, winning. XP raises your ratings. Once a week you can train one focus at light, normal or hard intensity (harder costs more energy and risks injury). You can sim the session or play a drill: a 60-second shootout, or a scrimmage to 7 against your clubmate. Moves like the step-back, spin, euro-step and 360 dunk are learned once your ratings are high enough. Using a skill a lot earns traits such as Deadeye, Posterizer, Ankle Snatcher, Glove, Eraser and Iron Man.
7. **The limits are real.** You learn fastest young and slower as you near your potential (scouts may raise it if you keep climbing). Speed and hops can only be trained a little past what the combine measured. Athletes peak in their late twenties. From thirty the legs go and your skills have to carry you. Low energy makes you slower, and tired players get hurt more.
8. **Management.** Game checks come from your contract. When it runs out, your club and two others make offers (money against years and facilities). There are sponsor offers that grow with your fame, staff to hire (shooting coach, skills trainer, strength coach, physio; they're paid weekly and multiply training), a personal home gym, and cosmetics.
9. **Retirement.** You can retire from age 32, and the career ends at 40. A legacy score (titles, MVPs, Finals MVPs, All-ISO teams, other awards, career points, longevity) decides whether you make the Hall of Fame.

Each opponent is a real engine player with their own ratings and size, so a 7′1″ rim protector and a 5′11″ guard play completely differently.

Extras on the main menu: Quick 1v1 (any two players, any court, any format), a street tournament (an eight-player bracket, first to 11), the 3-Point Contest, Practice (free shooting with a shot chart), the tutorial, and the Hall of Fame.

## Height matters

Height is never a menu option. On the court it changes:

- **Reach.** Contests, blocks and rebounds come from standing reach (height plus wingspan) plus your jump.
- **Post game.** A bigger, stronger player can back a smaller one down and finish with a hook over them.
- **Feet.** Taller players are slower and accelerate slower, need longer to gather, carry the ball higher (easier to steal) and turn slower (more ankle breakers).
- **OVR.** Size is part of the overall rating, because it wins games.

In headless engine tests with identical ratings, a 2.12 m player beat a 1.82 m player in 32 of 40 games. The small player got 7.7 steals a game and the big one 5.3 blocks.

## Controls

| Action | Keys A | Keys B | Gamepad | Touch |
| --- | --- | --- | --- | --- |
| Move | A / D | ← / → | Stick / d-pad | Stick |
| Jump / block / rebound | W or Space | ↑ or Space | A | JUMP |
| Defense stance (hold). With the ball: post up (hold) | S | ↓ | LT | Pull the stick down |
| Shoot (hold, release at the top of the jump; tap = pump fake). While posting up: hook | J | Z | X | SHOOT |
| Fadeaway jumper (hold, release at the top) | K | X | B | FADE |
| Dribble move / steal | L | C | Y | MOVE |
| Sprint (quick tap while dribbling slowly = hesitation) | Shift | Shift | RT | Push the stick past 85% |
| Pause | Esc or P | Esc or P | Start | Pause button |

Dribble moves: crossover (Move), spin (Sprint + Move), step-back (stick away from the hoop + Move), hesitation (tap Sprint), pump fake (tap Shoot). Dunk by driving hard at the rim and pressing Shoot. Euro-step by flipping the stick during a layup gather. Pausing a career game offers "Sim the rest of the game" (career games always count).

### How accuracy works

Every jumper is graded on release timing against the top of the jump: green (perfect), good, late or early, or bad. The meter shows the window. After the release the game prints the grade, how open you were and the make chance. The window shrinks with contest, distance and tiredness, and grows with the Shooting rating. Fadeaways drift away from the defender, so they're harder to contest but a little harder to make. Hooks have no meter: they're graded on Finishing, size and contest. Layups and dunks are graded on contest and Finishing.

## Dev tools

Press the backtick key (or tap the title logo five times) for the dev menu. It has mirror 1v1 sims, a height test (equal ratings, 2.12 m vs 1.82 m), bot difficulty duels (Legend vs Pro, Pro vs Rookie), a league model check (the fast sim used for AI games against the real engine), the shot lab (proves the solver honors the make/miss roll), the tunneling test, a money and fame cheat for testing the career, and the F1 (AI), F2 (hitboxes and lanes) and F3 (last shot breakdown) overlays.

Everything is exposed on `window.HH` for scripting: `HH.simulateMatch(...)`, `HH.shotLab(...)`, `HH.tunnelTest(n)`, `HH.createCareer(...)`, `HH.simUserGame(...)`, `HH.legacyOf(...)`.

## Tech

Vanilla JavaScript (ES2020+), Canvas 2D and Web Audio. All art is drawn in code and all sound is synthesized. Every tuning number lives in the `CONFIG` object at the top of the file. Gameplay randomness comes from a seeded RNG, so any match can be reproduced from its seed, and the career has its own seeded stream. Your games run on the full engine. AI-vs-AI league games use a fast statistical model fitted by least squares to 4,000 headless engine games, so standings and stat lines match what the engine produces. Saves live in `localStorage` under `hoopheads.save.v1` (schema version 3). An old team career is retired on load and its name and face carry over to the new career. If storage is missing or corrupted, the game still runs.
