// Every mode, start to finish, through its real screens: quick 1v1 in all three rulesets (and a rematch), a whole street
// tournament, the 3-point contest, practice, the tutorial, the classic team league (5v5 and 3v3), and in the career a
// live high-school game, a pro game with the pregame and the result, a 60 s drill, and the All-Star weekend played live.
// Bots play both sides; matches are fast-forwarded in the page. Fails on page errors, frame exceptions, a match that
// never ends, or a screen that does not come. Usage: node tests/modes.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const P = await openPage(browser); const R = runner('modes'); const { ev, page } = P; const wait = ms => page.waitForTimeout(ms);
  const toMenu = () => ev(() => { const g = HH.game; if (g.mode === 'match' || g.match) g.quitToMenu(); g.tournament = null; g.ui.clearTo(mainMenu(g)); });
  const press = async (re, screenRe) => { await ev(src => { const s = HH.game.ui.screen; if (!s) throw new Error('no screen'); const w = (s.widgets || []).find(w => !w.hidden && w.enabled !== false && w.label && new RegExp(src).test(w.label)); if (!w) throw new Error('no /' + src + '/ on ' + s.name + ': ' + (s.widgets || []).filter(w => !w.hidden).map(w => w.label).filter(Boolean).join(' | ')); w.onPress(); }, re.source); await wait(120); if (screenRe) await waitScreen(screenRe); };
  const waitScreen = async (re, ms) => { const t0 = Date.now(); let s = ''; while (Date.now() - t0 < (ms || 15000)) { s = await P.screen(); if (re.test(s)) return s; await wait(150); } throw new Error('waited for ' + re + ', still on ' + s); };
  const waitMatch = async () => { const t0 = Date.now(); while (Date.now() - t0 < 8000) { if (await ev(() => !!(HH.game.match && HH.game.mode === 'match'))) return; await wait(150); } throw new Error('no match started'); };
  // bots take over and the match runs to its end in the page (cap in game seconds)
  const finish = async (cap) => { await waitMatch(); await wait(600); const r = await ev(cap => { const g = HH.game, m = g.match; for (const p of m.players) p.controlled = false; let n = 0; const over = () => m.ended || (m.contest3 && m.contest3.done); while (!over() && n < 120 * cap) { simStep(m, STEP); n++; } return { ended: over(), secs: Math.round(n / 120), score: m.contest3 ? 'contest ' + m.contest3.score : m.teams.map(t => t.score).join('-') }; }, cap || 1200); if (!r.ended) throw new Error('not over after ' + r.secs + ' s (' + r.score + ')'); return r; }; // the game loop ends a finished 3-point contest
  const frames = async () => { const fx = await P.frameErrors(); if (fx.length) throw new Error('frame exceptions: ' + fx.slice(0, 3).join(' | ')); };
  const quick = (label, opts) => R.step(label, async () => {
    await toMenu(); await press(/Quick 1v1/, /^quick$/); await ev(o => { Object.assign(HH.game.quickOpts, o); }, opts); await press(/^PLAY$/); const a = await finish();
    await waitScreen(/^postgame$/); await press(/^Rematch$/); const b = await finish(); await waitScreen(/^postgame$/); await press(/^Menu$/, /^menu$/); await frames();
    console.log('     ' + a.score + ' in ' + a.secs + ' s, rematch ' + b.score + ' in ' + b.secs + ' s');
  }, P);
  await ev(() => { localStorage.clear(); HH.game.save = new SaveSystem(); window.HH_ERRORS = []; }); await toMenu();
  await quick('quick 1v1: arcade full court, first to 11', { ruleset: 0, format: 3 });
  await quick('quick 1v1: street sim, timed 1:30 halves', { ruleset: 1, format: 0 });
  await quick('quick 1v1: street half court, 1s and 2s, make-it-take-it', { ruleset: 2, format: 6, halfScoring: 1, mitt: true });
  await R.step('street tournament: every round to the end', async () => {
    await toMenu(); await press(/Extras/); await press(/Street tournament/, /^tour-setup$/); await press(/START TOURNAMENT/, /^tour$/); let rounds = 0;
    for (let i = 0; i < 4; i++) { const done = await ev(() => { const T = HH.game.tournament; return !T || T.done || !T.alive; }); if (done) break; await press(/^PLAY:/); await finish(); await waitScreen(/^postgame$/); await press(/^Continue$/, /^tour$/); rounds++; }
    const T = await ev(() => { const T = HH.game.tournament; return T ? { done: T.done, alive: T.alive, won: T.champion === T.human, round: T.round } : null; }); if (!T || !T.done) throw new Error('tournament not finished: ' + JSON.stringify(T));
    await press(/Back|back/); await frames(); console.log('     ' + rounds + ' games played, ' + (T.won ? 'champion' : 'eliminated, the rest simmed'));
  }, P);
  await R.step('3-point contest: 60 s, the scores, try again', async () => {
    await toMenu(); await press(/Extras/); await press(/3-Point Contest/, /^threept$/); await press(/^START$/); const a = await finish(200); await waitScreen(/^postgame$/);
    const sc = await ev(() => HH.game.match.contest3.score); await press(/^Try again$/); await finish(200); await waitScreen(/^postgame$/); await press(/^Menu$/, /^menu$/); await frames(); console.log('     score ' + sc + ' after ' + a.secs + ' s');
  }, P);
  await R.step('practice: 20 s of shooting, then quit from the pause menu', async () => {
    await toMenu(); await press(/Extras/); await press(/^Practice$/, /^practice$/); await press(/^START$/); await waitMatch(); await ev(() => { const m = HH.game.match; for (const p of m.players) p.controlled = false; for (let i = 0; i < 120 * 20; i++) simStep(m, STEP); });
    await ev(() => HH.game.pause()); await waitScreen(/^pause$/); await press(/Quit to menu/, /^menu$/); await frames();
  }, P);
  await R.step('tutorial: every step (short step timeouts), back at the menu, marked done', async () => {
    await toMenu(); await ev(() => { HH.__tut = CONFIG.tutorial.stepTimeoutS; CONFIG.tutorial.stepTimeoutS = 0.4; HH.game.save.data.settings.tutorialDone = false; }); await press(/Extras/); await press(/^Tutorial$/); await waitMatch();
    const t0 = Date.now(); while (Date.now() - t0 < 30000 && await ev(() => HH.game.mode === 'match')) await wait(250); const r = await ev(() => { CONFIG.tutorial.stepTimeoutS = HH.__tut; return { mode: HH.game.mode, done: HH.game.save.data.settings.tutorialDone, screen: HH.game.ui.screen && HH.game.ui.screen.name }; });
    if (r.mode === 'match' || !r.done) throw new Error('tutorial did not finish: ' + JSON.stringify(r)); await frames();
  }, P);
  const teamLeague = mode => R.step('team league ' + mode + ': a game to the final buzzer, back to the hub', async () => {
    await toMenu(); await ev(mode => { const s = HH.game.save.data; s.teamCareer = null; const player = { name: 'Mode Test', nick: 'Mode', arch: 'slasher', height: 1.93, attrs: tcScaledAttrs('slasher', CONFIG.teamCareer.startPoints), look: Object.assign({}, PRESET_LOOKS[3], { number: 9 }), moves: { crossover: true, spin: false, stepback: false, hesitation: false, euro: false, dunk360: false, windmill: false } }; tcCreateCareer(s, player, TEAMS[2].id, mode); }, mode);
    await press(/Extras/); await press(/Team league/, /^teamhub$/); await press(/^PLAY GAME$/); const r = await finish(); await waitScreen(/^postgame$/); await press(/^Continue$/, /^teamhub$/);
    const n = await ev(() => HH.game.save.data.teamCareer.results.length); if (n !== 1) throw new Error(n + ' results recorded'); await frames(); console.log('     ' + r.score + ' in ' + r.secs + ' s');
  }, P);
  await teamLeague('5v5'); await teamLeague('3v3');
  // the career
  const drain = async () => { for (let i = 0; i < 14; i++) { const s = await P.screen(); if (s === 'press') { await press(/^HUMBLE$/); await press(/^CONTINUE$/); continue; } if (s === 'allstarweekend' || !/^(amevent|rivalmoment|commitday)$/.test(s)) return s; await press(/^(Continue|CONTINUE)$/); } return P.screen(); };
  await R.step('career, high school: a live game to the end, the result, back to the hub', async () => {
    await toMenu(); await ev(() => { const g = HH.game, s = g.save.data; s.c1 = null; s.career = null; amCreate(s, { name: 'Mode Kid', look: PRESET_LOOKS[6], number: 12, style: 'shooter', seed: 5 }); g.save.save(); g.ui.clearTo(amHub(g)); }); await drain();
    await waitScreen(/^amhub$/); await press(/^PLAY$/); const r = await finish(); await waitScreen(/^amresult$/); await press(/^CONTINUE$/); await drain(); await waitScreen(/^amhub$/); await frames(); console.log('     ' + r.score + ' in ' + r.secs + ' s');
  }, P);
  await R.step('career drill: practice → PLAY THE DRILL → 60 s → the drill result → hub', async () => {
    await ev(() => { const g = HH.game; g.save.data.c1.plan = 'practice'; g.ui.clearTo(amHub(g)); g.ui.push(practiceScreen(g)); }); await waitScreen(/^practice$/); await press(/PLAY THE DRILL/); const r = await finish(100);
    await waitScreen(/^practiceres$|^drillpost$|^practice/); const s = await P.screen(); await press(/BACK TO THE HUB|CONTINUE/); await drain(); await frames(); console.log('     drill over after ' + r.secs + ' s, result screen ' + s);
  }, P);
  await R.step('career, pro: pregame → tip off → final → result → hub', async () => {
    await ev(() => { const g = HH.game; const c = testProLeague(21, g.save.data); if (c.events) c.events.length = 0; g.save.data.c1.handedOff = true; g.save.save(); g.ui.clearTo(careerHub(g)); }); await drain(); await waitScreen(/^career$/);
    await press(/^PLAY$/, /^pregame$/); await press(/TIP OFF/); const r = await finish(); await waitScreen(/^result$/); await press(/^CONTINUE$/); await drain(); await waitScreen(/^career$/); await frames(); console.log('     ' + r.score + ' in ' + r.secs + ' s');
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
