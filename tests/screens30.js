// 3.0 (§11): the overflow audit of the 3.0 screens. HOME and its five tabs (high school, college, the pros), MORE…, the
// focus picker, the weekly drill's result, the result screen (a good week, a hurt one, a slump), the season review, the
// recruiting board, messages (one with three answers, an urgent one), the SIM toast, X4's charts (rankings, standings,
// leaders, brackets, your team, your charts) at each level and X5's (the league below, the depth chart, the transfers,
// the teams, the Overseas League and a season abroad), each at a desktop (1280×720), a
// phone (844×390 with touch) and both at the 1.25× text size. The checks are auditkit.js's (tap targets, overlaps, text
// over text, cut text, two screens at once, art over text, legibility); any flag fails the run. Each milestone adds its
// screens here. Usage: node tests/screens30.js [shotsDir] [--only=desktop|phone|desktop125|phone125]
const path = require('path'), fs = require('fs');
const { launch, openPage } = require('./lib');
const { installAudit, makeAuditor } = require('./auditkit');
const PASSES = [{ id: 'desktop', page: {}, big: false }, { id: 'phone', page: { phone: true }, big: false }, { id: 'desktop125', page: {}, big: true }, { id: 'phone125', page: { phone: true }, big: true }];
(async () => {
  const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7), dir0 = process.argv.slice(2).find(a => !a.startsWith('--'));
  const browser = await launch(); let flags = 0, screens = 0; const errs = [];
  for (const pass of PASSES) {
    if (only && only !== pass.id) continue; const P = await openPage(browser, pass.page), { ev } = P, phone = !!pass.page.phone, dir = dir0 ? path.join(dir0, pass.id) : null; if (dir) fs.mkdirSync(dir, { recursive: true });
    await installAudit(P, { big: pass.big }); const audit0 = makeAuditor(P, { dir, quiet: true });
    const audit = async (name, open, arg) => { const r = await audit0(name, open, arg); screens++; if (r.bad.length) flags++; console.log((r.bad.length ? 'FLAG  ' : 'ok    ') + pass.id + ' ' + name + ' (' + r.name + ')' + (r.bad.length ? ': ' + r.bad.slice(0, 10).join(' | ') + (r.bad.length > 10 ? ' …+' + (r.bad.length - 10) : '') : '')); return r; };
    console.log('— ' + pass.id + (pass.big ? ' (1.25× text)' : ''));
    // the scripted careers: a week past the tryout, ready for its screens (no queued messages: HOME stays on top)
    await ev(() => {
      window.__adv = (a, n, until) => { let k = 0, g = 0; while (k++ < 900 && g < n) { if (until && until(a)) break; if (a.summer && a.summer.pending) hsSummerChoose(a, 'rest'); else if (a.tryout && a.tryout.step !== 'done') hsSimTryout(a); else if (a.decision) { const d = a.decision; if (d.kind === 'portal') colPortalChoose(a, null); else if (d.kind === 'college' && d.signing) recSimSign(a); else if (d.kind === 'college') amChooseCollege(a, d.offers[0]); else amDeclare(a, false); } else { amSimGame(a); g++; } } };
      window.__quiet = c => { c.events = []; c.inbox = []; const B = holderOf(c); B.msgWk = null; if (typeof REC_TOASTS !== 'undefined') REC_TOASTS.length = 0; };
      window.__home = (tab) => { const g = HH.game, c = g.save.data.career && g.save.data.c1 && g.save.data.c1.handedOff ? g.save.data.career : g.save.data.c1; __quiet(c); g.hubTab = tab; g.ui.clearTo(isPro(c) ? careerHub(g) : amHub(g)); };
      localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Screen Audit', look: PRESET_LOOKS[2], number: 5, style: 'slasher', seed: 31 }); g.save.data.c1 = a; __adv(a, 3); __quiet(a); g.save.save();
    });
    const tabs = ['home', 'league', 'events', 'career', 'store'];
    // high school
    for (const t of tabs) await audit('hs-' + t, t => __home(t), t);
    if (phone) await audit('hs-homemore', () => { __home('home'); const s = HH.game.ui.screen, b = s.widgets.find(w => w.label === 'MORE…'); if (b) b.onPress(); });
    if (phone) await audit('hs-careermore', () => { __home('career'); const s = HH.game.ui.screen, b = s.widgets.find(w => w.label === 'MORE…'); if (b) b.onPress(); });
    await audit('hs-focuspick', () => { const g = HH.game; __home('home'); g.ui.push(focusPickerScreen(g)); });
    await audit('hs-drillpost', () => { const g = HH.game, a = g.save.data.c1; __home('home'); holderOf(a).wk = {}; g.ui.push(drillPostScreen(g, { contest3: { score: 14 } }, { kind: 'drill', focus: 'shooting' })); });
    await audit('hs-drillpost-ran', () => { const g = HH.game; __home('home'); g.ui.push(drillPostScreen(g, { contest3: { score: 9 } }, { kind: 'drill', focus: 'finishing' })); }); // a second drill the same week: "This week already ran."
    await audit('hs-result', () => { const g = HH.game, a = g.save.data.c1; const r = amSimGame(a); __quiet(a); g.ui.clearTo(amResultScreen(g, r, null)); });
    await audit('hs-result-hurt', () => { const g = HH.game, a = g.save.data.c1; const r = amSimGame(a); __quiet(a); if (r.bench || !r.line || r.line.fga == null) Object.assign(r, { bench: false, gains: [], line: { pts: 4, fgm: 2, fga: 5, tpm: 0, tpa: 1, reb: 3, stl: 1, blk: 0 } }); a.fatigue = 98; r.rewards = [{ icon: 'star', text: 'Level up: Clutch Gene (Silver): +1 to every rating in the last minute of a close game.', kind: 'traitlevel' }, { icon: 'cup', text: 'Road to the League: a college offer. Basic court shoes, free: +0.5 Speed in games.', kind: 'road' }]; r.recs = [{ k: 'pts', v: 31 }]; r.wk = Object.assign({}, r.wk || {}, { plan: 'focus', k: 'shooting', practiceXp: 9, drill: { bonus: 0.5 }, injury: { name: 'Sprained ankle', games: 2 } }); g.ui.clearTo(amResultScreen(g, r, null)); }); await ev(() => { HH.game.save.data.c1.fatigue = 0; });
    await audit('hs-result-slump', () => { const g = HH.game, a = g.save.data.c1; const r = amSimGame(a); __quiet(a); Object.assign(r, { slump: 'start', grade: r.grade || 'D', simmed: true }); r.wk = Object.assign({}, r.wk, { injury: { name: 'Knee sprain', games: 3, loss: { k: 'jmp', pts: 2, done: true } } }); g.ui.clearTo(amResultScreen(g, r, null)); });
    await audit('hs-message', () => { const g = HH.game, a = g.save.data.c1; __quiet(a); a.inbox = [{ kind: 'dialog', title: 'A SUMMER CAMP INVITE', icon: 'mail', lines: ['The Elite 100 camp wants you in July: three days against the best juniors in the country, and every college coach in the stands.', 'It costs $400 and a week of rest before the season.'], choice: [{ label: 'Go to the camp', note: 'Fame +4 · fatigue +12 · −$400', fx: { fame: 4, fatigue: 12, money: -400 } }, { label: 'Rest at home', note: 'Fatigue −10', fx: { fatigue: -10 }, def: true }, { label: 'Work a summer job', note: '+$300 · fatigue +4', fx: { fatigue: 4 } }] }]; g.hubTab = 'home'; g.ui.clearTo(amHub(g)); });
    await audit('hs-simtoast', () => { const g = HH.game; __home('home'); }); // (the toast's own check is below)
    { const cuts = await ev(() => { const g = HH.game; g.ui.toastMsg(simRunToast({ weeks: 3, w: 2, l: 1, pts: 37, games: 3, lines: ['Level up: Clutch Gene (Silver).'], stop: 'next: a game against the #2 team in the district' })); return window.__textCuts(); }); screens++; if (cuts.length) flags++; console.log((cuts.length ? 'FLAG  ' : 'ok    ') + pass.id + ' hs-simtoast-text' + (cuts.length ? ': TEXT CUT ' + cuts.join(' | ') : '')); await ev(() => { HH.game.ui.toastT = 0; }); }
    await audit('hs-review', () => { const g = HH.game, a = g.save.data.c1; __adv(a, 99, a => (a.events || []).some(e => e.kind === 'recap')); a.events = (a.events || []).filter(e => evClass(e, a) === 'season'); a.inbox = []; g.hubTab = 'home'; g.ui.clearTo(amHub(g)); g.ui.push(seasonReviewScreen(g, a)); });
    await audit('hs-recruit-home', () => { const g = HH.game, a = g.save.data.c1; __adv(a, 400, a => a.stageYear >= 3 && a.offers && a.offers.length > 0 && !a.decision); __quiet(a); g.hubTab = 'home'; g.ui.clearTo(amHub(g)); });
    await audit('hs-recboard', () => { const g = HH.game; __home('home'); g.ui.push(recBoardScreen(g)); });
    // X5 (§4.3–4.4): not starting: the JV game on HOME, its result, the depth chart, JV's tables, the Transfers chart, the transfer message
    const benchMe = "(c => { const L = ladderOf(c); L.splice(L.indexOf('me'), 1); L.splice(2, 0, 'me'); if (!isPro(c)) hsSquadSync(c); })";
    await ev(() => { const g = HH.game, a = g.save.data.c1; __adv(a, 400, a => a.league && a.league.format === 'district' && a.league.week >= 2 && !a.league.playoffs); __quiet(a); });
    await audit('hs-jv-home', b => { const g = HH.game, a = g.save.data.c1; eval(b)(a); __home('home'); }, benchMe);
    await audit('hs-jv-result', () => { const g = HH.game, a = g.save.data.c1; const r = amSimGame(a); __quiet(a); g.ui.clearTo(amResultScreen(g, r, null)); });
    await audit('hs-depth', b => { const g = HH.game, a = g.save.data.c1; if (isStarter(a)) eval(b)(a); __home('league'); g.ui.push(ladderScreen(g)); }, benchMe);
    for (const [n, tab] of [['hs-jv-teams', 0], ['hs-jv-players', 1], ['hs-jv-games', 2]]) await audit(n, t => { const g = HH.game; __home('league'); g.ui.push(lowerLeagueScreen(g)); const b = g.ui.screen.widgets.find(w => w.label === ['TEAMS', 'PLAYERS', 'YOUR GAMES'][t]); if (b) b.onPress(); }, tab);
    await audit('hs-transfers', () => { const g = HH.game; __home('league'); g.ui.push(transfersChartScreen(g)); const b = g.ui.screen.widgets.find(w => w.label === 'YOURS'); if (b) b.onPress(); });
    await audit('hs-transfer-msg', () => { const g = HH.game, a = g.save.data.c1; __quiet(a); const ev = hsTransferOffer(a); a.events = []; if (ev) { ev.inS = a.season; a.inbox = [ev]; } g.hubTab = 'home'; g.ui.clearTo(amHub(g)); });
    await ev(() => { const g = HH.game, a = g.save.data.c1; __quiet(a); a.hsTransfer = null; const L = ladderOf(a); L.splice(L.indexOf('me'), 1); L.unshift('me'); hsSquadSync(a); });
    // X4 (§4.2): the charts, mid-season on varsity, then at the playoffs
    const charts = async (pre, pro) => { for (const [n, f] of [['rankings', 'rankingsChartScreen(g)'], ['rankings-teams', 'rankingsChartScreen(g, 1)'], ['standings', 'standingsChartScreen(g)'], ['leaders', 'leadersChartScreen(g)'], ['team', 'teamPageScreen(g)'], ['mycharts', 'myChartsScreen(g)']]) await audit(pre + '-' + n, src => { const g = HH.game; __home('league'); g.ui.push(eval(src)); }, f);
      if (phone) { await audit(pre + '-leaders-3p', () => { const g = HH.game; __home('league'); g.ui.push(leadersChartScreen(g)); const b = g.ui.screen.widgets.find(w => w.label === '3P%'); if (b) b.onPress(); }); await audit(pre + '-mycharts-career', () => { const g = HH.game; __home('league'); g.ui.push(myChartsScreen(g)); const b = g.ui.screen.widgets.find(w => w.label === 'CAREER'); if (b) b.onPress(); }); }
      if (pro && phone) await audit(pre + '-standings-west', () => { const g = HH.game; __home('league'); g.ui.push(standingsChartScreen(g)); const b = g.ui.screen.widgets.find(w => w.label === 'WEST'); if (b) b.onPress(); });
      await audit(pre + '-brackets', () => { const g = HH.game; __home('league'); g.ui.push(bracketsScreen(g)); }); };
    await ev(() => { const g = HH.game, a = g.save.data.c1; __adv(a, 400, a => a.league && a.league.format === 'district' && a.league.week >= 5); __quiet(a); });
    await audit('hs-league-ranked', () => __home('league')); await charts('hs', false);
    await audit('hs-district', () => { const g = HH.game, a = g.save.data.c1; __adv(a, 100, a => !a.league || a.league.playoffs); __quiet(a); g.hubTab = 'league'; g.ui.clearTo(amHub(g)); g.ui.push(districtBracketScreen(g)); });
    await audit('hs-brackets-po', () => { const g = HH.game; __home('league'); g.ui.push(bracketsScreen(g)); });
    // X5 (§4.3): no PBL offers: the clubs abroad, then a season there (HOME, LEAGUE, its table)
    await ev(() => { const g = HH.game; g.__keep = g.save.data.c1; const a = amCreate(g.save.data, { name: 'Abroad Audit', look: PRESET_LOOKS[4], number: 8, style: 'playmaker', seed: 77 }); a.age = 22; a.stage = 'combine'; a.events = []; g.save.data.c1 = a; });
    await audit('ovs-offers', () => { const g = HH.game; g.ui.clearTo(amHub(g)); g.ui.push(proOffersScreen(g)); });
    await ev(() => { const g = HH.game, a = g.save.data.c1; ovsSign(a, ovsOffers(a)[1]); __adv(a, 3); __quiet(a); });
    for (const t of ['home', 'league', 'career']) await audit('ovs-' + t, t => __home(t), t);
    await audit('ovs-standings', () => { const g = HH.game; __home('league'); g.ui.push(standingsChartScreen(g)); });
    await audit('ovs-team', () => { const g = HH.game; __home('league'); g.ui.push(teamPageScreen(g)); });
    await ev(() => { const g = HH.game; g.save.data.c1 = g.__keep; delete g.__keep; });
    // college
    await ev(() => { const g = HH.game, a = g.save.data.c1; __adv(a, 900, a => a.stage !== 'hs'); __adv(a, 3); __quiet(a); g.save.save(); });
    for (const t of tabs) await audit('col-' + t, t => __home(t), t);
    await audit('col-nil', () => { const g = HH.game, a = g.save.data.c1; __quiet(a); colNilOffer(a, amRng(a), 'audit'); g.hubTab = 'home'; g.ui.clearTo(amHub(g)); });
    await audit('col-agent', () => { const g = HH.game, a = g.save.data.c1; __quiet(a); a.agent = undefined; colAgentPitch(a); g.hubTab = 'home'; g.ui.clearTo(amHub(g)); });
    await audit('col-result', () => { const g = HH.game, a = g.save.data.c1; const r = amSimGame(a); __quiet(a); g.ui.clearTo(amResultScreen(g, r, null)); });
    await audit('col-league', () => __home('league')); await charts('col', false);
    // the pros
    await ev(() => { const g = HH.game, c = testProLeague(36, g.save.data); g.save.data.career = c; g.save.data.c1.handedOff = true; for (let i = 0; i < 4; i++) simUserGame(g.save.data); __quiet(c); g.save.save(); });
    for (const t of tabs) await audit('pro-' + t, t => __home(t), t);
    if (phone) await audit('pro-homemore', () => { __home('home'); const s = HH.game.ui.screen, b = s.widgets.find(w => w.label === 'MORE…'); if (b) b.onPress(); });
    if (phone) await audit('pro-careermore', () => { __home('career'); const s = HH.game.ui.screen, b = s.widgets.find(w => w.label === 'MORE…'); if (b) b.onPress(); });
    await audit('pro-focuspick', () => { const g = HH.game; __home('home'); g.ui.push(focusPickerScreen(g)); });
    await audit('pro-result', () => { const g = HH.game, c = g.save.data.career; const rec = simUserGame(g.save.data); __quiet(c); g.ui.clearTo(careerResultScreen(g, rec, null)); });
    await audit('pro-trade', () => { const g = HH.game, c = g.save.data.career, me = meOf(c); __quiet(c); const dest = frIds().find(k => k !== me.club); c.events.push({ kind: 'tradeoffer', title: 'A TRADE OFFER', who: 'agent', dest, lines: ['Your agent: "The ' + frFullName(dest) + ' called. A 4★ franchise, and they want you before the deadline."', 'Say yes and you move this week; say no and you stay where you are.'] }); g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); });
    await audit('pro-shoe', () => { const g = HH.game, c = g.save.data.career; __quiet(c); c.me.fame = MD.fameMax; c.me.shoePitched = false; c.me.shoe = null; proShoePitch(c); g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); });
    await charts('pro', true);
    // X5 (§4.3–4.5): the Development League (HOME, a result, its tables), the depth chart, the teams, the transfers, the Overseas League, a buyout
    await audit('pro-dev-home', b => { const g = HH.game, c = g.save.data.career; eval(b)(c); __home('home'); }, benchMe);
    await audit('pro-dev-result', () => { const g = HH.game, c = g.save.data.career; const rec = simUserGame(g.save.data); __quiet(c); g.ui.clearTo(careerResultScreen(g, rec, null)); });
    await audit('pro-depth', b => { const g = HH.game, c = g.save.data.career; if (isStarter(c)) eval(b)(c); __home('league'); g.ui.push(ladderScreen(g)); }, benchMe);
    await audit('pro-devleague', () => { const g = HH.game; __home('league'); g.ui.push(lowerLeagueScreen(g)); const b = g.ui.screen.widgets.find(w => w.label === 'PLAYERS'); if (b) b.onPress(); });
    await audit('pro-teams', () => { const g = HH.game; __home('league'); g.ui.push(teamsChartScreen(g)); });
    await audit('pro-overseas', () => { const g = HH.game; __home('league'); g.ui.push(lowerLeagueScreen(g, 'ovs')); const b = g.ui.screen.widgets.find(w => w.label === 'PLAYERS'); if (b) b.onPress(); });
    await audit('pro-transfers', () => { const g = HH.game; __home('league'); g.ui.push(transfersChartScreen(g)); });
    await audit('pro-buyout', () => { const g = HH.game, c = g.save.data.career; __quiet(c); c.inbox = [{ kind: 'trade', title: 'UNHAPPY', why: 'bench', inS: c.season, lines: ['You have watched six of the games from the bench.', 'Your agent can ask for a trade, or the club can buy you out: a free agent this offseason.', 'Or stay and fight for it.'] }]; g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); });
    await audit('pro-review', () => { const g = HH.game, c = g.save.data.career; let n = 0; __quiet(c); while (n++ < 140 && !(c.events || []).some(e => evClass(e, c) === 'season')) { if (c.phase === 'offseason') break; c.events = (c.events || []).filter(e => evClass(e, c) === 'season'); simUserGame(g.save.data); } c.events = (c.events || []).filter(e => evClass(e, c) === 'season'); c.inbox = []; g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); g.ui.push(seasonReviewScreen(g, c)); });
    errs.push(...P.errors.map(e => pass.id + ': ' + e)); await P.context.close();
  }
  console.log('screens30: ' + screens + ' screens, ' + flags + ' flagged · errors: ' + (errs.length ? errs.slice(0, 6).join(' | ') : 'none'));
  await browser.close(); process.exit(flags || errs.length ? 1 : 0);
})();
