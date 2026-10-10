// Every mode, start to finish, through its real screens: quick 1v1 in all three rulesets (and a rematch), the 3-point
// contest, practice and the tutorial (F1: from the Practice menu; the street tournament and the team league are gone), and in the career
// (3.0 §2–3: one HOME with five tabs; PLAY → the game → one result screen → HOME) the tryouts, a live high-school game
// straight from HOME's PLAY, the weekly 30 s drill from HOME's DRILL, a JV game, a pro game from HOME's Scout report (the
// pregame, only when you ask for it) and its TIP OFF, and the All-Star weekend played live.
// Bots play both sides; matches are fast-forwarded in the page. Fails on page errors, frame exceptions, a match that
// never ends, or a screen that does not come. Usage: node tests/modes.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const P = await openPage(browser); const R = runner('modes'); const { ev, page } = P; const wait = ms => page.waitForTimeout(ms);
  const toMenu = () => ev(() => { const g = HH.game; if (g.mode === 'match' || g.match) g.quitToMenu(); g.ui.clearTo(mainMenu(g)); });
  const press = async (re, screenRe) => { await ev(src => { const s = HH.game.ui.screen; if (!s) throw new Error('no screen'); const w = (s.widgets || []).find(w => !w.hidden && w.enabled !== false && w.label && new RegExp(src).test(w.label)); if (!w) throw new Error('no /' + src + '/ on ' + s.name + ': ' + (s.widgets || []).filter(w => !w.hidden).map(w => w.label).filter(Boolean).join(' | ')); w.onPress(); }, re.source); await wait(120); if (screenRe) await waitScreen(screenRe); };
  const waitScreen = async (re, ms) => { const t0 = Date.now(); let s = ''; while (Date.now() - t0 < (ms || 15000)) { s = await P.screen(); if (re.test(s)) return s; await wait(150); } throw new Error('waited for ' + re + ', still on ' + s); };
  const waitMatch = async () => { const t0 = Date.now(); while (Date.now() - t0 < 8000) { if (await ev(() => !!(HH.game.match && HH.game.mode === 'match'))) return; await wait(150); } throw new Error('no match started'); };
  // bots take over and the match runs to its end in the page (cap in game seconds)
  const finish = async (cap) => { await waitMatch(); await wait(600); const r = await ev(cap => { const g = HH.game, m = g.match; for (const p of m.players) p.controlled = false; let n = 0; const over = () => m.ended || (m.contest3 && m.contest3.done); while (!over() && n < 120 * cap) { simStep(m, STEP); n++; } return { ended: over(), secs: Math.round(n / 120), total: Math.round(m.time), fmt: { type: m.format.type, half: m.format.half, periods: m.periods }, score: m.contest3 ? 'contest ' + m.contest3.score : m.teams.map(t => t.score).join('-') }; }, cap || 1200); if (!r.ended) throw new Error('not over after ' + r.secs + ' s (' + r.score + ')'); return r; }; // the game loop ends a finished 3-point contest
  const frames = async () => { const fx = await P.frameErrors(); if (fx.length) throw new Error('frame exceptions: ' + fx.slice(0, 3).join(' | ')); };
  const quick = (label, opts, check) => R.step(label, async () => {
    await toMenu(); await press(/Quick 1v1/, /^quick$/); await ev(o => { Object.assign(HH.game.quickOpts, o); }, opts); await press(/^PLAY$/); const a = await finish(); if (check) check(a);
    await waitScreen(/^postgame$/); await press(/^Rematch$/); const b = await finish(); await waitScreen(/^postgame$/); await press(/^Menu$/, /^menu$/); await frames();
    console.log('     ' + a.score + ' in ' + a.secs + ' s, rematch ' + b.score + ' in ' + b.secs + ' s');
  }, P);
  await ev(() => { localStorage.clear(); HH.game.save = new SaveSystem(); window.HH_ERRORS = []; }); await toMenu();
  await quick('quick 1v1: one minute (F5: the default format), arcade full court', { ruleset: 0 }, a => { if (!(a.fmt && a.fmt.half === 60 && a.fmt.periods === 1)) throw new Error('not a one-minute game: ' + JSON.stringify(a.fmt)); if (a.total > 150) throw new Error('a one-minute game ran ' + a.total + ' s'); });
  await quick('quick 1v1: arcade full court, first to 11', { ruleset: 0, format: 4 });
  await quick('quick 1v1: street sim, timed 1:30 halves', { ruleset: 1, format: 1 });
  await quick('quick 1v1: street half court, 1s and 2s, make-it-take-it', { ruleset: 2, format: 7, halfScoring: 1, mitt: true });
  await R.step('3-point contest: 60 s, the scores, try again', async () => {
    await toMenu(); await press(/^Practice$/, /^practicehub$/); await press(/3-Point Contest/, /^threept$/); await press(/^START$/); const a = await finish(200); await waitScreen(/^postgame$/);
    const sc = await ev(() => HH.game.match.contest3.score); await press(/^Try again$/); await finish(200); await waitScreen(/^postgame$/); await press(/^Menu$/, /^menu$/); await frames(); console.log('     score ' + sc + ' after ' + a.secs + ' s');
  }, P);
  await R.step('practice: 20 s of shooting, then quit from the pause menu', async () => {
    await toMenu(); await press(/^Practice$/, /^practicehub$/); await press(/^Shooting practice$/, /^practice$/); await press(/^START$/); await waitMatch(); await ev(() => { const m = HH.game.match; for (const p of m.players) p.controlled = false; for (let i = 0; i < 120 * 20; i++) simStep(m, STEP); });
    await ev(() => HH.game.pause()); await waitScreen(/^pause$/); await press(/Quit to menu/, /^menu$/); await frames();
  }, P);
  await R.step('tutorial: every step (short step timeouts), back at the menu, marked done', async () => {
    await toMenu(); await ev(() => { HH.__tut = CONFIG.tutorial.stepTimeoutS; CONFIG.tutorial.stepTimeoutS = 0.4; HH.game.save.data.settings.tutorialDone = false; }); await press(/^Practice$/, /^practicehub$/); await press(/^Tutorial$/); await waitMatch();
    const t0 = Date.now(); while (Date.now() - t0 < 30000 && await ev(() => HH.game.mode === 'match')) await wait(250); const r = await ev(() => { CONFIG.tutorial.stepTimeoutS = HH.__tut; return { mode: HH.game.mode, done: HH.game.save.data.settings.tutorialDone, screen: HH.game.ui.screen && HH.game.ui.screen.name }; });
    if (r.mode === 'match' || !r.done) throw new Error('tutorial did not finish: ' + JSON.stringify(r)); await frames();
  }, P);
  // the career
  const msgThrough = () => P.ev(() => { const s = HH.game.ui.screen; if (!s || s.name !== 'message') return false; s.onBack(); return true; }); // 3.0 (§2.3): a message (one line, two or three buttons; Back is its last: a decision's default "no"). The dialogue cards and the press room are gone (X2)
  const drain = async () => { await P.page.waitForTimeout(150); /* let the hub's update push a pending message first */ for (let i = 0; i < 18; i++) { const s = await P.screen(); if (s === 'message') { await msgThrough(); await P.page.waitForTimeout(150); continue; } if (s === 'allstarweekend' || !/^(amevent|commitday)$/.test(s)) return s; await press(/^(Continue|CONTINUE)$/); } return P.screen(); };
  await R.step('career tryouts (R5): the 60 s shootout and the 1v1 against a senior, played live, then the hub', async () => {
    await toMenu(); await ev(() => { const g = HH.game, s = g.save.data; s.c1 = null; s.career = null; amCreate(s, { name: 'Mode Kid', look: PRESET_LOOKS[6], number: 12, style: 'shooter', seed: 5 }); g.save.save(); g.ui.clearTo(amHub(g)); }); await drain();
    await waitScreen(/^amhub$/); await press(/^TRYOUTS$/, /^tryout$/); await press(/^PLAY THE SHOOTOUT$/); const d = await finish(100); await waitScreen(/^tryoutpost$/); await press(/^CONTINUE$/); await drain(); await waitScreen(/^amhub$/);
    await press(/^TRYOUTS$/, /^tryout$/); await press(/^PLAY THE 1V1/); const r = await finish(); await waitScreen(/^tryoutpost$/); await press(/^CONTINUE$/); await drain(); await waitScreen(/^amhub$/); const res = await ev(() => { const c = HH.game.save.data.c1; return c.tryout.result + ' · ' + c.league.format; }); if (!/^(varsity|jv) · district$/.test(res)) throw new Error('tryout result ' + res); /* 3.0 (X5): one team of five: the starter plays the district's varsity games, the four behind play its JV (no JV league of its own) */ await frames(); console.log('     shootout ' + d.score + ' · 1v1 ' + r.score + ' · ' + res);
  }, P);
  await R.step('career, high school (3.0 §2.2): HOME\'s PLAY → straight into a live game (no pregame) → to the end → the one result screen → HOME', async () => {
    await ev(() => { const g = HH.game, c = g.save.data.c1; ladderInit(c, 1); c.events.length = 0; c.inbox = []; g.hubTab = 'home'; g.save.save(); g.ui.clearTo(amHub(g)); }); await drain(); /* the starter plays the week's game */
    await waitScreen(/^amhub$/); const n0 = await ev(() => HH.game.save.data.c1.league.games.length);
    await press(/^PLAY$/); const at = await ev(() => { const g = HH.game; return { mode: g.mode, kind: g.after && g.after.kind, screen: g.ui.screen ? g.ui.screen.name : null }; }); if (at.mode !== 'match' || at.kind !== 'amateur' || at.screen) throw new Error('PLAY did not start the game: ' + JSON.stringify(at)); /* the scouting report is HOME's own button now */
    const r = await finish(); await waitScreen(/^amresult$/); const G = await ev(() => { const L = HH.game.save.data.c1.league, x = L.games[L.games.length - 1] || {}; return { n: L.games.length, score: x.my + '-' + x.their }; }); if (G.n !== n0 + 1 || G.score !== r.score) throw new Error('the result: game ' + G.n + ' (was ' + n0 + '), ' + G.score + ' for a game played ' + r.score);
    await press(/^CONTINUE$/); await drain(); await waitScreen(/^amhub$/); const tab = await ev(() => hubTabNow(HH.game)); if (tab !== 'home') throw new Error('back on the ' + tab + ' tab, not HOME'); await frames(); console.log('     ' + r.score + ' in ' + r.secs + ' s');
  }, P);
  await R.step('career drill (3.0 §3): HOME\'s DRILL → 30 s (Focus: Handles, you attack every possession) → the drill result (up to +50% to the week\'s training) → HOME, once a week', async () => {
    await ev(() => { const g = HH.game, c = g.save.data.c1; c.events.length = 0; c.inbox = []; c.plan = 'focus'; c.focus = 'handles'; c.fatigue = 0; c.gpa = Math.max(c.gpa || 0, 3); g.hubTab = 'home'; g.save.save(); g.ui.clearTo(amHub(g)); }); await drain(); await waitScreen(/^amhub$/); /* a week that trains (Rest over fatigue 70 and Study under the GPA line have no drill) */
    await press(/^DRILL$/); const d = await ev(() => { const g = HH.game, m = g.match; return m && m.drill ? { kind: m.drill.kind, attack: m.drill.attack, secs: m.drill.seconds, want: WK.drill.seconds, after: g.after.kind } : { mode: g.mode }; }); if (d.kind !== 'offense' || d.attack !== 0 || d.secs !== d.want || d.after !== 'drill') throw new Error('not the 30 s handles drill: ' + JSON.stringify(d));
    const r = await finish(100); await waitScreen(/^drillpost$/); const D = await ev(() => { const x = (HH.game.save.data.c1.wk || {}).drill; return { x, pay: x ? drillBonusFor(x.focus, x.score) : null, max: WK.drill.bonus }; }); if (!D.x || D.x.focus !== 'handles' || D.x.bonus !== D.pay || !(D.x.bonus >= 0 && D.x.bonus <= D.max)) throw new Error('the drill\'s bonus: ' + JSON.stringify(D));
    await press(/^CONTINUE$/); await drain(); await waitScreen(/^amhub$/); const again = await ev(() => { const g = HH.game; return { tab: hubTabNow(g), btn: (g.ui.screen.widgets || []).some(w => !w.hidden && w.label === 'DRILL'), open: wkDrillOpen(g.save.data.c1) }; }); if (again.tab !== 'home' || again.btn || again.open) throw new Error('a second drill this week: ' + JSON.stringify(again));
    await frames(); console.log('     drill over after ' + r.secs + ' s: score ' + D.x.score + ', +' + Math.round(D.x.bonus * 100) + '% to this week\'s training');
  }, P);
  await R.step('career, the league below (3.0 §4.3): off the top rung, HOME\'s PLAY → a JV game → its result → hub', async () => {
    await ev(() => { const g = HH.game, c = g.save.data.c1; c.events.length = 0; c.inbox = []; c.wk = null; const L = ladderOf(c); L.splice(L.indexOf('me'), 1); L.splice(1, 0, 'me'); hsSquadSync(c); if (c.team) c.team.hot = {}; g.hubTab = 'home'; g.ui.clearTo(amHub(g)); }); await waitScreen(/^amhub$/);
    const ll = await ev(() => !!(amNext(HH.game.save.data.c1) || {}).ll); if (!ll) throw new Error('no JV game on HOME'); await press(/^PLAY$/); const r = await finish(); await waitScreen(/^amresult$/); const n = await ev(() => (HH.game.save.data.c1.lower.P.me || {}).g || 0); if (n < 1) throw new Error('no JV line'); await press(/^CONTINUE$/); await drain(); await waitScreen(/^amhub$/); await frames(); console.log('     JV: ' + r.score + ' in ' + r.secs + ' s · ' + n + ' JV game(s)');
  }, P);
  await R.step('career, pro (3.0 §2.2): HOME\'s Scout report (the pregame, only when you ask for it) → TIP OFF → the final → the one result screen → HOME', async () => {
    await ev(() => { const g = HH.game; const c = testProLeague(21, g.save.data); if (c.events) c.events.length = 0; g.save.data.c1.handedOff = true; g.hubTab = 'home'; g.save.save(); g.ui.clearTo(careerHub(g)); }); await drain(); await waitScreen(/^career$/);
    const w0 = await ev(() => HH.game.save.data.career.week); await press(/^Scout report$/, /^pregame$/); await press(/TIP OFF/); const r = await finish(); await waitScreen(/^result$/);
    const G = await ev(() => { const c = HH.game.save.data.career, l = c.me.log[0] || {}; return { week: c.week, s: l.s === c.season, score: l.us + '-' + l.them }; }); if (G.week !== w0 + 1 || !G.s || G.score !== r.score) throw new Error('the result: week ' + G.week + ' (was ' + w0 + '), ' + G.score + ' for a game played ' + r.score);
    await press(/^CONTINUE$/); await drain(); await waitScreen(/^career$/); const tab = await ev(() => hubTabNow(HH.game)); if (tab !== 'home') throw new Error('back on the ' + tab + ' tab, not HOME'); await frames(); console.log('     ' + r.score + ' in ' + r.secs + ' s');
  }, P);
  await R.step('career, pro: the All-Star weekend played live (3-point contest and 1v1)', async () => {
    await ev(() => { const g = HH.game, s = g.save.data, c = s.career; for (const k of RATING_KEYS) meOf(c).r[k] = 99; c.me.fame = 100; let n = 0; while (!c.allStar && n++ < 40) { if (c.events) c.events.length = 0; simUserGame(s); } if (!c.allStar) throw new Error('no All-Star weekend'); c.events = (c.events || []).filter(e => e.kind === 'allstar'); g.ui.clearTo(careerHub(g)); });
    await waitScreen(/^allstarweekend$/); let played = 0;
    for (let i = 0; i < 4; i++) { const w = await ev(() => { const s = HH.game.ui.screen; return s && s.name === 'allstarweekend' ? s.widgets.filter(w => !w.hidden).map(w => w.label) : []; }); const lbl = w.find(l => /^PLAY/.test(l)); if (!lbl) break;
      await press(new RegExp('^' + lbl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$')); await finish(400); await waitScreen(/^(allstarres|allstar1v1res|postgame)$/); await press(/^(BACK TO THE WEEKEND|BACK TO THE HUB|CONTINUE|Menu)$/); await waitScreen(/^(allstarweekend|career|amevent|press|rivalmoment)$/); played++; }
    const s = await drain(); if (s === 'allstarweekend') await press(/^(DONE|Sim it|Sim the contest)$/); await drain(); await waitScreen(/^career$/);
    const A = await ev(() => { const A = HH.game.save.data.career.allStar; return { done: A && A.done, one: A && A.one && A.one.done }; }); if (!A.done || !A.one) throw new Error('weekend not finished ' + JSON.stringify(A)); await frames(); console.log('     ' + played + ' events played live');
  }, P);
  const fails = R.done(); await browser.close(); process.exitCode = fails ? 1 : 0;
})();
