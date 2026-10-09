# Hoop Heads

**Version 2.1.** An offline 1v1 arcade basketball career game in a single `index.html`. You start as a 14-year-old high school freshman, get recruited by real-feeling college programs, go to college, sign with one of the sixteen franchises of the Pro Basketball League (PBL), rated 1 to 5 stars, and work your way onto a great one: seasons, playoffs and rings, awards, contracts and free agency, your staff, the shop, school and your grades, injuries, a rival, the press, a story in twelve chapters with six endings, getting older, and a Hall of Fame vote when you retire. No online play, no accounts, no analytics and no network requests: the pixel font is drawn in code too. The league, its franchises and every name in it are invented.

One pixel-art world (the Retro look: a 360-row pixel grid, the Retro Ball Font, pixel menus), big-head caricature players drawn in code, bouncy physics, dunks, blocks, hooks, fadeaways, ankle breakers, posters. Under the hood: a fixed-step 120 Hz simulation, real ball physics with an analytic shot solver, and bots that press the same virtual buttons you do.

## What's new in 2.1

Hoop Heads 2.1, in ten milestones (W1–W10; `CHANGES.md` has each one and the 2.1 report). A "What's new in 2.1"
screen shows once after the update, and the main menu keeps a button for it.

- **The recruiting game.** 64 college programs in eight conferences, each with a coach and a system, facilities, an NIL
  market, a GPA line, a roster and a history; the Recruit tab and the College Browser. Interest that rises and falls,
  actions and official visits, offers that hold no spot and can be pulled, commitments, flips, a coaching carousel,
  Signing Day, walking on and a prep year.
- **Teams come to you.** No draft: franchises make offers when your value crosses their bar, and a better one calls with
  a trade in the season. Playing your games well pays (legacy, stars and titles well above simming everything), simmed
  games score like played ones, and money has big buys worth making.
- **The PBL.** Sixteen franchises in two conferences, each with an owner, a GM's plan, a coach's system, a payroll and
  chemistry; a fifteen-week season with rivalry week, the All-Star break, the trade deadline and a national TV game;
  conference playoffs and a best-of-5 Finals; award races all season.
- **The offseason and league life.** Seven steps (retirements, re-signing, free agency week day by day, the trade
  window, training camp, power rankings); contracts with options and incentives; rosters that move, rookies from your
  own past, title windows, a GOAT ladder, PBL Tonight.
- **A story in twelve chapters.** From the night before freshman tryouts to your last day, a chapter for every stage
  with a version for every path, a title card, one big decision that's remembered, and a closing scene. Your people:
  a younger sibling, Coach Adeyinka, a best friend (a teammate, your agent, your rival's agent, or gone their own way),
  your rival, an agent, a journalist, a veteran mentor and an owner. "Previously on Hoop Heads" when you continue, the
  Story screen as chapters, twelve cutscene backgrounds, and six endings, each with your sibling's last line.
- **Fixes from the playtest.** A running clock, one attempt in the All-Star 3-point contest, records shown on the hub,
  and more (W1).

Old saves load and carry on: a career from before 2.1 joins the chapters where it is (the ones it passed are marked
missed) and keeps its old ending if none of them was told.

## What's new in 2.0

Hoop Heads 2.0 and its Part 2, in fourteen milestones (V1–V14; `CHANGES.md` has each one and the 2.0 report). A
"What's new in 2.0" screen shows once after the update, and the main menu keeps a button for it.

- **Traits.** Seventeen traits in four rarities (Common 55%, Uncommon 28%, Rare 13%, Legendary 4%; every generated
  player rolls one with the same odds). Rarer is stronger: a Common trait is about +5–8% at one thing, a Legendary one
  about +30% or game-changing. Each levels from Bronze to Silver (×1.5) and Gold (×2) by doing its thing, and at 1,000
  career points you pick a third.
- **Gameplay.** Every opponent has a personality and four tendencies the bots play to, shown on a scouting card.
  Signature moves, steals that count only when the defense secures the ball (STEAL, or a grey POKED), blocks that read
  right, bigger phone buttons, a sudden-death overtime and a shot chart in practice.
- **Road to the League.** Fourteen milestones from varsity to the Hall of Fame on the hub; the goal is a 5★ team. A
  five-tab hub (Play · Train · Me · Team · Shop) with a season calendar, red dots for anything new, **Sim to next big
  moment** and **Sim the rest of the season**.
- **A harder climb.** The next +1 costs 20 × 1.11^(rating − 40) XP, ×3 past your hidden potential, and a game's grade
  scales its XP (A 1.5×, B 1.2×, C 1×, D 0.6×, F 0.3×). Slumps, injuries that can cost rating points, and at most one
  5★ starting spot opens per team a season. A typical career reaches a 5★ team 15–25% of the time; a great one about
  60%.
- **A real story.** Fifteen arcs over three acts (6–8 in a career), people who remember your choices, six endings and
  the Story so far. An awards night, the All-Star reveal, a Hall of Fame induction, and a record book with a toast for
  every record you break.
- **School.** One GPA from high school through college: midterms and finals, eligibility (under 2.0 you sit), offers
  that need grades (elite academic programs ask for 3.3), scholarships, tuition and student loans, a major and a degree
  that change your ending.
- **The shop.** Gear in slots with rarities and levels (never more than +4 to a rating, all of it together), a weekly
  stock at a shop with a keeper at each level, a try-on, extras for the week, a lifestyle, signature collabs from the
  Road, and celebrations.
- **Your staff.** An agent, a skills coach, a strength trainer, a physio, a nutritionist and a mental coach, 1★ to 5★,
  each with a salary, a personality and the odd call from a rival club.
- **Pro teams.** Twelve PBL franchises with cities, crests, owners, coaches, markets, fans, history and rivalries; title
  odds on the hub and on every offer; top-8 playoffs with best-of-3 rounds and a Finals MVP; a parade, a ring ceremony,
  a banner in the rafters and dynasties.
- **The Codex.** Press ? or tap the ? on any screen for the page about it. Hover or tap a stat for a one-line tip and a
  link to its page.
- **Looks.** Six new celebrations, a new arena at every level, and more names and faces in every league.
- **Speed.** V2 halved the frame time at 4× CPU throttling (about a mid-range phone): measured back to back, the median
  frame went from 32 to 14–15 ms on a phone layout and from 40 to 12–14 ms on a desktop, and the frame guard sheds cost
  within 0.2 s (it took 2.3 s).

Old saves load and carry on: every 2.0 system fills in on a save's first load.

## Play it

Open `index.html` in a current Chrome, Safari, Firefox or Edge. It works from a double-click on the file and when hosted on any static host (GitHub Pages, Vercel). Landscape only on phones. If the page is embedded in another page, click the court once so it receives the keyboard.

On a phone every button is at least 64 px, and long screens (settings, Quick 1v1, the face editor, lists) turn into pages with ◀ ▶. If a match runs slow, a frame guard sheds cost one step at a time: the crowd at 15 Hz and half resolution, then no floor reflections, then no bloom, then a lower resolution for the match. In a Legends View match the thumb controls sit in the strip of floor under the players, and they fade to 40% while you aren't touching them.

## The career

One life, from a 14-year-old freshman to the Hall of Fame vote. Every game of it is one-on-one: your school, your
college program and your pro franchise are your team (its name, colors, uniform, coach and teammates, who show up in
practice and in the story), your 1v1 record is the team's record and your titles are the team's titles. The hub's
header always says which team you're on and how good it is: varsity (the school's top team) or JV (the second), the
program's tier from small school to blue blood, the franchise's stars and its rank of the sixteen.

1. **Create your player.** Pick a face (the beard you pick shows from day one), a jersey number and a play style (Sharpshooter, Playmaker, Slasher, Lockdown, Post Scorer or Rim Protector) and a game length (1, 2 or 3 minutes; 1 by default; the clock runs through dead balls until the last 10 seconds, so a one-minute game takes about 75 seconds). There is no height slider and there are no rating sliders.
2. **Your genes and your traits.** Adult height, growth pattern (early, normal or late bloomer) and wingspan are rolled once; a doctor projects your adult height, give or take an inch, and you find out the rest as you grow. Your hidden potential, the ceiling of each rating, is rolled too: scouts narrow it down as you play. You also get two traits out of 17 in four rarities (Common 55%, Uncommon 28%, Rare 13%, Legendary 4%): a Signature one on the genes card and a Hidden one that shows itself in your sophomore season, and at 1,000 career points you pick a third from three. Every trait has an upside and a small cost (Gym Rat: +8% practice XP, −3% fatigue recovery in Rest weeks; a Legendary's cost is only flavor), and levels from Bronze to Silver and Gold by doing its thing. Every generated player carries one trait rolled with the same odds.
3. **The depth chart.** Only the teammate on the top rung plays the week's game. Beat the one above you in a practice challenge (a 1v1 to 7) to take their spot; the one below can challenge you. Big programs start you lower, small ones at the top. Coach trust grows with wins and good weeks: it adds practice XP and puts in a word with recruiters and scouts. Three bench weeks in a row earn a spot start, and a pro with four bench weeks in a season can ask for a trade.
4. **High school.** Tryouts first (a 60-second shootout, then a 1v1 against a senior): varsity or JV, with a call-up if JV goes well. A six-team district plays a double round robin, the top four play the district playoffs, and the district champions meet in a 16-team state tournament. Senior night, a rivalry game, midterms and finals (Cram, Balanced or Skip the studying; a report card under a 2.0 GPA sits you two games), and four summers: the AAU circuit (recruiters watch, you start the season tired), a skills camp, rest or a summer job.
5. **The week.** Before every game: **Practice** (XP in your focus rating), **Rest** (fatigue −25; an injury heals a game faster), **Film** (learn the next opponent: +Defense and Shooting in that game), and in high school and college **Study** (GPA +0.3). Every game week takes a little off your GPA, down to a C+ (2.2) if you never study; under 2.3 the hub warns you and your coach makes the week a Study week. Then PLAY the game yourself or SIM it, or sim ahead: **Sim to next big moment** stops before a big game (your rival, the Boss, a rivalry, the playoffs) or after a big moment, **Sim the rest of the season** only for injuries, offers, decisions and the playoffs. Every game adds fatigue; past 50 you play worse and get hurt more, and over 70 the week starts on Rest (Settings → Career injuries turns injuries off). A game's grade (A to F) scales the XP it pays.
6. **Recruiting.** 64 college programs in eight conferences of eight (three power, two mid-major, two small-school and the Laurel League's elite academic programs), each with a city and state, colors and a pixel crest, an arena, a tier (blue blood, power, mid-major, small, elite academic) and prestige (1–5★), a coach (a style: Pace, Defense, Development or Iso; a tenure; a hot seat), a GPA line and majors, facilities (XP +0 to +9%), an NIL market, the roster you'd join and its history (titles, pros, a rival school). The high school hub's **Recruit** tab and the **College Browser** (filters for conference, tier, stars, the GPA line, distance and "interested in me", six sorts, a name search) open any program's page: everything above and your chances there. Interest (0–100) moves through high school: how you fit the program's usual recruit (your projected national rank against its level), your coach's word, home, your character in the press room, the contact you earn and the competition for its spots; watching from 25, contacted from 50, offer range from 70. From your junior year a program with interest 70+ and a scholarship spot open offers some week (an elite academic program from a 3.0 GPA, on condition of its 3.3 by your senior finals). Named recruits, your rival among them, commit and take the spots: an offer holds none, whoever commits first gets it. An offer can be pulled (grades under its line, a long injury, interest under 50, a filled spot), always after a warning. Three actions a month from your sophomore year (send film, an email, your coach's call, a camp with a showcase game, an unofficial visit) and five official visits, each a weekend in three scenes that shows the facilities and how the coach develops players. A verbal commitment takes a spot and stops the other programs from rising; a flip costs hype and brings a press storm; your coach can leave (follow, stay or reopen). Signing Day is binding, with a hat on the table for every program that offered; with no offer, walk on (no scholarship, the bottom of the depth chart), take a prep year (dominate it and a star comes back) or go pro. A College test in the junior year rewards Study weeks. A national rank in a class of 3,000 and a star rating; blue bloods ask for a 2.5 GPA, everyone else 2.0.
7. **College.** Up to four seasons: marquee non-conference games, your program's real conference (its seven others) and its tournament, and the national tournament of all 64 programs (your national rank sets your seed; the program's titles go into its history). Team → Colleges opens the browser. Scouts grade every game (your pro stock); NIL deals pay for appearances (money you keep, fatigue it costs); a season on the bench opens the transfer portal; an agent can get you more on every contract for a share of it. A full ride takes a 3.5 GPA and four stars at commitment; otherwise you pay part of the tuition, and a student loan covers what you can't. You pick a major, and four seasons (or summer classes in the pros) earn a degree, which changes your ending. Under a 1.5 GPA comes Academic Probation (a study sprint is worth +0.5). After each season: turn pro, or stay. Your agent's advice and the offers you'd get show before you choose; at OVR 70+ (or 5★ interest) the agent says teams would sign you now and Turn pro is the default, otherwise going back is.
8. **The combine and signing day.** Height (barefoot and in shoes), wingspan, reach, vertical, agility and bench, revealed one by one. There is no draft: the scouts' score decides which franchises want you, and three make offers (the best that wants you, one a star lower that starts you, and a rebuild that starts you and pays more), each with the franchise's title odds and where you'd start. You pick on signing day.
9. **The pros.** Sixteen franchises of the Pro Basketball League in two conferences of eight (East and West; every rival in the same one), rated 1 to 5 stars, each with a city, a crest, an owner (win-now, patient, cheap or a meddler), a GM's plan for the season (Contend, Rebuild or Balanced), a coach with a system (Pace, Iso, Defense or Development) you fit or don't, a market, fans, history back to 1979 (the four newest joined in 2016 and 2024) and a rival. A franchise is its starter (the league player; its depth chart decides whether that's you) and four on the bench, each with ratings, an age and a contract; its payroll (the five and the rest of the roster) sits under a $120M soft cap or over it, and cheap owners never pay the luxury tax above $140M. Team strength is the starter, the bench and chemistry (+1 a season the same five stay, up to +3): the simulated games and the title odds use it. Stars bring facilities (practice XP +3% at 1★ up to +15% at 5★), pay, fame a game and a deeper bench, and they move each offseason with the standings; owners trade and sign to contend or rebuild, a rebuild can trade you, and the benches age, re-sign and change. A season is fifteen weeks, everyone once: week 4 is rivalry week, week 8 the All-Star break (a 3-point contest and the All-Star 1v1), week 10 the trade deadline and week 13 your national TV game (twice the hype on the line). The top four of each conference play best-of-3 conference semifinals and finals, then a best-of-5 Finals (the better record hosts games 1, 3 and 5 before a louder crowd) and a Finals MVP; a title brings a parade, a ring ceremony and a banner, and titles in a row are a dynasty. The award races run all season: a weekly MVP ladder (the top five, with arrows), Rookie of the Year, Defensive Player, Most Improved, Sixth Man (a bench player: you, if you sat half the season), All-League 1st and 2nd teams, Player of the Week. **Moving up:** your value (OVR + fame/15 + hype/30) against each star level's bar. Free agency brings three offers (your team, the best franchise that wants you, one that starts you; the best is the default when it beats your team), and a trade request goes at most a star up, once every two seasons. Teams come to you too: in the season, once your value is 3+ over your franchise's bar and reaches a better one's, that franchise calls with a trade offer (accept it and you lose no hype). **The goal** is on the hub's Road to the League: a 3★ team, then a 5★ team, starting for one, and a ring with one. Contracts you negotiate (1 to 5 seasons; a promised start costs 10%) and what money buys: your staff, a home gym, a lifestyle (a car, a house for your family and more, each paying something every week), sponsors, a signature shoe line once your hype reaches 60, and big buys priced for a pro: a stake in your team (a dividend, and a share that grows), a private training facility (practice XP +8%), sneaker company shares (they rise and fall), a home for your parents, a charity event a season (fame) and your name on the arena back home (legacy).
10. **The shop and your staff.** The hub's Shop tab is a storefront with a keeper at each level (the corner shop, campus sports, the pro shop): six items a week on its shelves, gear in five slots you wear plus training and recovery slots, common to epic (+1 a level to one rating, in games only, and never more than +4 to a rating all together), a try-on that shows your ratings old → new, extras for the week (an ice bath, a drink, a film session), and celebrations. Signature collabs come from the Road, never from money. In the pros you hire a staff: an agent, a skills coach, a strength trainer, a physio, a nutritionist and a mental coach, 1★ to 5★ (the best that will talk to you follows your fame), each with a salary and a personality.
11. **Hype and the press room.** Hype runs from 0 to 100. It lifts sponsor offers, the scouts' score and your value to the franchises, recruiting, All-Star votes and the home crowd; it costs too: losses shake you more, from 60 defenses key on you, from 70 the media eats into practice and your rival is fired up. Big games end in the press room with four answers (Team first, Confident, Trash talk, No comment), none best: each says what it does.
12. **The story.** The career is told in twelve chapters (The Kid from your school, Varsity, The Spotlight, Signing Day, Freshman Wall, March, The Decision, Rookie, Prime, The Ring Chase, Finals or The One That Got Away, and Legacy), each with a title card, a version for your path, one big decision ("This will be remembered") and a closing scene; side stories (6 to 8 of fifteen arcs over three acts) fill the gaps. Three to five scenes a season, never more than two in a row, every one with a choice, in RPG dialogue boxes with the speaker's portrait and a cutscene background, and no scene twice in a career. Every choice trades one thing for another, the people in it remember (each has a meter), and flags carry choices forward: your best friend becomes your agent or your rival's, the big agency's deals come out, Coach Adeyinka comes back to coach you. "Previously on Hoop Heads" recaps where you left off. The Story so far tells your career back. Awards night, the All-Star reveal and a Hall of Fame induction are ceremonies, and the record book toasts every record you break. THE DAILY DRIBBLE has the headlines and a social feed that reacts to your games, press answers, trades and signings.
13. **Getting better.** XP comes slowly and the top is steep: the next +1 costs 20 × 1.11^(rating − 40) XP (60 to 70 is about 2,700 XP, 80 to 90 about 21,700), and past your hidden potential every +1 costs three times as much. In the career simulator a typical player is 68 OVR at 25 and peaks around 70 at 29. Every game gives XP, scaled by its grade (a simmed game pays half); it grows with winning and follows your game (made shots build Shooting, rim finishes Finishing, rebounds Strength and Hops, steals and blocks Defense), plus your practice focus. Teens learn fastest; after 30 the legs go first. Slumps come and go, and an injury can cost rating points. Moves unlock as your ratings grow.
14. **Retirement and the epilogue.** A legacy score from your pro career decides the Hall of Fame vote. The story ends one of six ways, as a cutscene: chapter 12's closing scene with your sibling's last line (the Mercenary Champion, the Fallen Star, the Owner, the Hometown Hero, Family First or the Coach; a career from before 2.1's chapters: Passing the Torch, The Legend, Two Old Rivals, Home, The Long Road or The Work). Then what your money builds: a foundation (legacy), a youth academy (your next career starts ahead), a franchise stake (the owner's ending) or a free ending as a coach or a broadcaster; your major and your degree pick its version. The **Trophy case** holds every award from high school on, and the **Timeline** charts your OVR by age with everything that happened.
15. **The Codex.** Press ? or tap the ? on any screen for its page; it explains every number: your value right now, what raises and lowers it, and what it does in the game's own numbers. Hype, for example, lists what yours earns you and what it costs you right now. Hover or tap a stat chip or meter for a one-line tip with a link to its page.
16. **The Road to the League and the hub.** Fourteen milestones from making varsity to the Hall of Fame, each with a reward; the goal is a 5★ team. The hub has five tabs (Play · Train · Me · Team · Shop; keys 1–5), and in high school a sixth, Recruit, before Shop (keys 1–6): a left rail on a desktop, a bottom bar on a phone, a red dot on a tab with something new.

Every opponent is a real engine player with their own ratings and size, so a 7′1″ rim protector and a 5′11″ guard play completely differently.

The main menu also has Quick 1v1 (any two players, any court, any format, and three rulesets: Arcade full court, Street Sim with fouls, or **Street half court** with a check ball at the top, clearing the ball past the arc after a stop, make-it-take-it, win by 2 and scoring by 1s and 2s or 2s and 3s), the Hall of Fame and **Save slots** (three careers, each with its own Hall of Fame and records). Settings → Gameplay → Career games picks full or half court for the career. **Practice** holds shooting practice (every rebound comes back to you), the 3-Point Contest (threes only: you walk from rack to rack and Shoot is the only button) and the tutorial. The credits are in Settings, and the **Art Lab** is in the dev menu (also `index.html?artlab`).

**Settings** has five tabs: Graphics (Retro, Retro sharp or Smooth; the camera; shake), Audio, Controls (keys A, B or your own, remapped action by action; the touch controls), Gameplay (difficulty, rules, the career's court, game length and injuries, the shot meter, power-ups in Quick 1v1, first-time tips) and Accessibility (text size 1× or 1.25×, reduce motion, colorblind-safe jerseys). The first time you reach each part of the career a short tip explains it.

## Height matters

Height is never a menu option. It changes your ratings in every game: per 10 cm above average you get Strength +6, Defense +3.5, Finishing +3, Hops −1, Handles −4 and Speed −5. It also sets your ceilings: taller players can grow Strength, Defense and Finishing further, and shorter players can grow Speed and Handles further. On top of that the engine models the body:

- **Reach.** Contests, blocks and rebounds come from standing reach (height plus wingspan) plus your jump.
- **Post game.** At least 3 inches on your man, near the block, holding Stance: back him down (Strength against Strength), turn into a hook (Shoot), take a drop step (Move), or pump fake and step through with an up-and-under (tap Shoot, then Move).
- **Rim protection.** A defender who leaves the floor in time with a hand at the ball can block a layup, floater, hook or dunk; size, Defense and Hops decide how often. Jump shots are protected for 0.08 s after the release, so blocks on them stay rare. Height also wins box-outs and 50/50 balls (+4% per 10 cm).
- **Small guards.** Under 6′2″ (1.88 m) you get an 8% quicker first step and more ankle breakers.
- **Feet.** Taller players are slower and accelerate slower, need longer to gather, carry the ball higher (easier to steal) and turn slower (more ankle breakers).

Height is a trade-off, and against a quick guard it costs a big player more than it gives. In headless engine tests (`tests/heighttest.js`: Pro bots against each other, 60 games) a 2.12 m player and a 1.82 m player built from the same ratings plus the career's height shifts: the big one blocks 2.2 shots a game and out-rebounds the guard 9.1 to 7.2, but the guard steals the ball 5.7 times a game (the big one turns it over 6.3 times) and wins 48 of 60, at 1.42 points per possession against 1.14. With identical ratings and no height shifts the big one takes 11 of 60, and 4 of 60 with the dev menu's lockdown ratings (Defense 9 against Handles 5 turns into 8 steals a game). These are 2.1's numbers; 2.0's engine gave the big one 10 of 60, and the 29–31 split this page quoted before was the M7 engine's.

## Controls

| Action | Keys A | Keys B | Gamepad | Touch |
| --- | --- | --- | --- | --- |
| Move | A / D | ← / → | Stick / d-pad | Stick |
| Jump / block / rebound | W or Space | ↑ or Space | A | JUMP |
| Defense stance (hold). With the ball: post up (hold) | S | ↓ | LT | Pull the stick down |
| Shoot (hold, release at the top of the jump; tap = pump fake). While posting up: hook | J | Z | X | SHOOT |
| Fadeaway jumper (hold, release at the top) | K | X | B | FADE |
| Dribble move / steal. From the post: drop step; after a post pump fake: up-and-under | L | C | Y | MOVE |
| Sprint (quick tap while dribbling slowly = hesitation) | Shift | Shift | RT | Push the stick past 85% |
| Pause | Esc or P | Esc or P | Start | Pause button |

Settings → Controls → Remap keys… sets your own key for every action (the Custom set; Esc always pauses and backs out). Dribble moves: crossover (Move), spin (Sprint + Move), step-back (stick away from the hoop + Move), hesitation (tap Sprint), pump fake (tap Shoot). Dunk by driving hard at the rim and pressing Shoot: one-hand, two-hand, tomahawk, windmill or 360, depending on your Hops and height.

**Ball rules.** Jumping with the ball commits you to a shot or a pass: landing with it is a travel. A dribble you pick up (a pump fake from a standstill, or a catch) can pivot, but walking more than 0.3 m is a travel, dribbling again is a double dribble, and holding it for 5 s while closely guarded is a turnover. Legends View plays a 10 s shot clock. A timed game's clock runs through made baskets, free throws, inbounds and check balls until the last 10 seconds of a period; there, and in overtime, it stops on every dead ball. A career game (3.0) restarts just past half court after a basket or a dead ball, with the defender set in front, plays a 6 s shot clock and scores about 12–18 points a side.

**Defense.** A set defender is a wall: running into one just stops you, and sprinting into one that's planted can be a charge (Settings can turn charges off). Getting past takes a move, a read or a quicker first step. Bodies only block in real contact (a drive into a set defender, box-outs, post-ups): everywhere else players pass through each other, so a defender running back can go straight past the ball handler. In Legends View a player who misses a layup, dunk or tip can't grab his own rebound for 1.3 s. Beaten? Race to the rim in the next lane over and jump as they go up. Bots do all of this with the same buttons. Euro-step by flipping the stick during a layup gather. Pausing a career game offers "Sim the rest of the game" (career games always count).

### How accuracy works

Every jumper is graded on release timing against the top of the jump: green (perfect), good, late or early, or bad. The meter shows the window. After the release the game prints the grade, how open you were and the make chance. The window shrinks with contest, distance and tiredness, and grows with the Shooting rating. Fadeaways drift away from the defender, so they're harder to contest but a little harder to make. Hooks have no meter: they're graded on Finishing, size and contest. Layups and dunks are graded on contest and Finishing.

## Dev tools

Press the backtick key (or tap the title logo five times) for the dev menu. It has mirror 1v1 sims, a height test (equal ratings, 2.12 m vs 1.82 m), bot difficulty duels (Legend vs Pro, Pro vs Rookie), a league model check (the fast sim used for AI games against the real engine), the shot lab (proves the solver honors the make/miss roll), the tunneling test, a money and fame cheat for testing the career, **Jump to pro** (sims the rest of high school and college the way the career simulator plays them and opens the pro combine, so the pro and team flow can be tested quickly; with no career it starts one), and the F1 (AI), F2 (hitboxes and lanes) and F3 (last shot breakdown) overlays.

Everything is exposed on `window.HH` for scripting: `HH.simulateMatch(...)`, `HH.shotLab(...)`, `HH.tunnelTest(n)`, `HH.amCreate(...)`, `HH.amSimGame(...)`, `HH.createCareerFromAmateur(...)`, `HH.testProLeague(seed)`, `HH.simUserGame(...)`, `HH.legacyOf(...)`.

## Tech

Vanilla JavaScript (ES2020+), Canvas 2D and Web Audio. All art is drawn in code and all sound is synthesized. Every tuning number lives in the `CONFIG` object at the top of the file. Pictures that are painted once and kept (faces and portraits, a venue's layers and crowd, the players' poses, the menus' text, panels and buttons) are made ahead of time by a bake worker, the page's own code running in a Web Worker on OffscreenCanvas, and kept for the session; a browser without one makes them on the main thread in small slices, behind a short "Warming up..." bar before a game. Gameplay randomness comes from a seeded RNG, so any match can be reproduced from its seed, and the career has its own seeded stream. Your games run on the full engine. AI-vs-AI league games use a fast statistical model fitted by least squares to 4,000 headless engine games, so standings and stat lines match what the engine produces. A rating is the engine attribute × 10, from high school to retirement. Saves live in `localStorage`: slot 1 under `hoopheads.save.v1` (schema version 5), slots 2 and 3 under `hoopheads.save.v1.slot2` and `.slot3`; a save that can't be read is kept aside under `.corrupt`. A career from the first high-school build carries over with its ratings, height and history, and a save from before 2.0 picks up every 2.0 system (hidden potential, the saga, grades, staff, the shop, the franchises' identities) on its first load. Careers from older builds (the team career and the first pro-only 1v1 career) can't continue, so their name and face prefill a new player. If storage is missing or corrupted, the game still runs.

## Tests

The game has no build step and no dependencies. The tests use Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`, or a global install):

```
node tests/check-syntax.js         # node --check on the game's script
node tests/smoke.js                # the whole game through the UI at 1280×720, other modes, old-save migrations,
                                   # regression checks, and the phone layout with touch at 844×390 (zero errors allowed)
node tests/devtools.js             # bot sims (1v1 Pro mirror, Legend vs Pro, 3v3), shot lab, tunneling test
node tests/balance.js [n]          # a scripted "human" plays real matches: points per possession by strategy vs Pro and Legend
node tests/gate.js [n] [perCell]   # the balance gate: Legends and Classic Pro mirror PPP, Legend vs Pro, and the harness by layout
node tests/stylemix.js [n]         # bots play to their build: post-ups, jumpers, threes and drives by play style
node tests/heighttest.js [n]       # 2.12 m against 1.82 m, with and without the career's height shifts
node tests/careersim.js [40] [seed] [--set career.proMean=83 ...]   # whole simulated careers against the career targets
                                   # (the week, press answers, recruiting, franchises and gear included); --set tries a CONFIG value;
                                   # --fa=stars|money|yours|best|starter, --trade=up|never, --spend=smart|none and --gear=buy|none
                                   # pick the policies; --policy=great plays every game well (Part 2's "great" career);
                                   # --menus=never takes every card's default, --week=rest|nostudy, --parity=n, --json;
                                   # --rec=typical|none|early|late (the recruit's actions and commitment), --hsOnly --spread=12 (the
                                   # recruiting table of 2.1 §2.7 alone: high school only, talent spread over every star level)
node tests/perf.js                 # frame cost at phone size in the arena, at each performance-guard level
node tests/modes.js                # every mode played to its end through its screens (quick 1v1, the 3-point contest,
                                   # practice, the tutorial, and the career's games, drills, challenges and All-Star weekend)
node tests/oldsaves.js [actions]   # every save in tests/fixtures (from older builds) reloaded and played on through the UI
node tests/phoneaudit.js [dir] [--desktop] [--size=WxH@dpr] [--text125]   # every screen (about 130) at 844×390, 1280×720 or any
                                   # window, optionally at 1.25× text: tap targets under 64 px, overlapping or cut text, text under
                                   # a figure, overlaps, off-screen or unlaid widgets, labels off their buttons
node tests/fullcareer.js [--phone] [--jump]  # one whole career through the screens, title to the Hall of Fame (a real match
                                   # at each level); --jump plays a high school game, then the dev menu's Jump to pro, then the pros
node tests/fixes.js                # 2.0's must-fix bugs that need a page (ONLY=<regex> runs matching steps)
node tests/steals.js               # steal consistency: every STEAL callout and stat is a real change of possession
node tests/boxscore.js             # box-score invariants over 2,000 simmed games (3PM ≤ 3PA ≤ FGA, points add up)
node tests/perf4x.js [--phone-only] # frame times at 4× CPU throttling (phone and desktop) with forced dunks and blocks
node tests/loadlag.js [--rate=4,1] [--only=startup|career|pro|quick] [--phone]   # loading lag: every screen change and game load at 4× and 1× CPU, a table, fails on any miss
node tests/traits.js               # the badges (3.0 §6.3): their numbers, deeds and levels, cards and chips, the Codex page, old saves
node tests/gameplay.js             # scouting, bots playing to their card, signature moves, overtime, the phone buttons
node tests/flow.js                 # the career flow: pace, the week, playing time, the Road, sim ahead, the five-tab hub
node tests/climb.js                # the climb's rules: the XP curve, hidden potential, grades, setbacks, 5★ scarcity
node tests/difficulty.js           # Part 2's §1.1 table: 600 careers on 3 seeds, a typical and a great policy (2.1 §3.7's bands for the great one: a 5★ team 35–55%, 1–2 titles; the Hall of Fame at other lines too)
node tests/school.js               # GPA and school: offers, exams, eligibility, scholarships, tuition, majors
node tests/shop.js                 # the store (3.0 §6.1): twelve items, levels 1–5, prices by stage, the +4 cap (property test), no rarity, try-on, old gear
node tests/proteams.js             # pro teams: identity, title odds, playoffs and the Finals, rings, banners, dynasties
node tests/pbl21.js                # 2.1's PBL: sixteen franchises in two conferences, owners, GMs, coach systems and fit, rosters, payroll, chemistry, team strength, the fifteen weeks and their key weeks, the conference playoffs, the award races, the benches' offseason, a 2.0 save's expansion, the screens
node tests/life21.js               # 2.1's offseason and league life: the seven steps, the free agency week (offers by day, the agent's counter, over-cap and cheap owners), options, the no-trade clause and incentives, the trade window and rebuilds, training camp, AI trades, retirements and rookies (your old teammates), title windows and hunger, the GOAT ladder and records, PBL Tonight, power rankings and the TV game, a meddler's beats, the value meter, W5 saves, the screens
node tests/league30.js [3] [30] [seed]   # §3.7 for the league: 30 seasons a league with a league-average you: AI trades a season, a new champion, every franchise's title
node tests/polish.js               # the Codex everywhere, tooltips, dots, What's new, legibility, celebrations, arenas
node tests/hudaudit.js             # the match HUD's text at several window sizes: nothing overlaps
node tests/playtest3.js            # 2.1's playtest fixes and the running clock, one step each
node tests/improve21.js            # 2.1's improvements: Study and the GPA floor, leaving college, offers that come to you, big buys
node tests/colleges.js             # 2.1's 64 colleges: the registry, coaches, interest, the browser, a program's page, offers and spots, the field of 64, old saves, the Recruit tab
node tests/recruit21.js            # 2.1's recruiting game: interest, offers, spots, warnings and pulls, actions, visits, commitment and flips, the carousel, Signing Day, walk-ons and the prep year, the College test, the screens
node tests/parity.js [12] [seed]   # your simmed points against your played points (the AI at your controls), every level within 10%
node tests/pace.js [8] [seed]      # 3.0 (§0.2): career games played in the engine: 12–18 points a side, 70–80 s a game, at every level
node tests/memory.js [50] [--phone]   # 3.0 (§0.1): 50 career games against new opponents: memory within +150 MB of the level after game 5
node tests/loop.js                 # 3.0 (§2.2): a season's weeks at each level through the real screens: at most 2 screens between games on PLAY, 1 on SIM; the plan and the messages
node tests/screens30.js [dir] [--only=desktop|phone|desktop125|phone125]   # 3.0 (§11): the overflow audit of the 3.0 screens (HOME's tabs, results, messages…) at a desktop, a phone and 1.25× text
node tests/rankings.js [careers]  # 3.0 (§4.1): weekly rankings at each level follow how people play: the top scorer in the top 10, teams by record, not OVR
node tests/effort.js [200] [seed] [par]   # the career policies: plays well + good choices vs sims everything, never opening a menu,
                                   # a smart spender (legacy, 5★ teams, titles, money left over)
node tests/traitbalance.js [n] [seed] [par]                      # every badge forced on n careers: legacy against the median
node tests/gen_oldsaves.js [dir]   # rebuilds the old-build fixtures by running earlier builds from git history
node tests/beforeafter.js <dir>    # pairs shots/audit with a fresh shots.js run into shots/before-after/
node tests/artlab.js <m> <round>   # Art Lab + in-match screenshots → shots/<m>/round-<round>/
node tests/reel.js <m> <round> [court] [seconds]   # plays a bot match and screenshots each key animation (dunk, crossover, rim hang...)
node tests/shots.js <dir>          # a screenshot of every screen (the audit and before/after gallery)
```

`AUDIT.md` is the baseline audit, `PLAN.md` the milestone plan, and `CHANGES.md` logs every tuned number.
