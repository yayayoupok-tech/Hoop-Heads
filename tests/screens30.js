// 3.0 (§11): the overflow audit of the 3.0 screens. HOME and its five tabs (high school, college, the pros), MORE…, the
// focus picker, the weekly drill's result, the result screen (a good week, a hurt one, a slump), the season review, the
// recruiting board, messages (one with three answers, an urgent one), the SIM toast, X4's charts (rankings, standings,
// leaders, brackets, your team, your charts) at each level and X5's (the league below, the depth chart, the transfers,
// the teams, the Overseas League and a season abroad) and X6's (the tournament screen in every format, its result and
// chart, the summer's picks, HOME and the tip while it waits, the trophy case, the Cup, the Summer step, Blacktop's
// message, the legacy with and without the epilogue), each at a desktop (1280×720), a phone (844×390 with touch) and
// both at the 1.25× text size. The checks are auditkit.js's (tap targets, overlaps, text
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
    // X8 (§7): the crew in high school (one slot: a skills coach), its hiring screen with the slot full, HOME's crew line
    await audit('hs-crew', () => { const g = HH.game, a = g.save.data.c1; __quiet(a); a.cash = Math.max(a.cash || 0, 20000); if (crewCanHire(a, 'skills')) crewHire(a, crewCandidates(a, 'skills')[1]); __home('career'); g.ui.push(crewScreen(g)); });
    await audit('hs-crewhire', () => { const g = HH.game; __home('career'); g.ui.push(crewHireScreen(g, 'scout')); });
    await audit('hs-home-crew', () => __home('home'));
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
    // X6 (§5): tournaments: the screen in each format (in progress, done, a result over it), a chart, the summer's picks, the trophy case
    await ev(() => { window.__tn = (key, o, sim) => { const g = HH.game, a = g.save.data.c1; __quiet(a); const T = tnCreate(a, key, Object.assign({ mine: true }, o || {})); if (sim === 'all') tnSimAll(a, T); else { tnAdvance(a, T); for (let i = 0; i < (sim | 0); i++) tnSimMine(a, T); } g.hubTab = 'home'; g.ui.clearTo(amHub(g)); g.ui.push(tnScreen(g, a, { kind: 'tourney', tid: T.id }, () => g.ui.pop())); return T; }; });
    await audit('hs-tn-ko', () => __tn('hsnat', null, 1));
    await audit('hs-tn-ko-done', () => __tn('hsnat', null, 'all'));
    await audit('hs-tn-groups', () => __tn('u17', null, 2));
    await audit('hs-tn-groups-ko', () => __tn('u17', null, 'all'));
    await audit('hs-tn-skills', () => __tn('camp', null, 0));
    await audit('hs-tn-show', () => __tn('allam', null, 0));
    await audit('hs-tn-result', () => { const g = HH.game, a = g.save.data.c1, T = __tn('aau3', null, 0), rec = tnSimMine(a, T); g.ui.replace(tnScreen(g, a, { kind: 'tourney', tid: T.id }, () => g.ui.pop())); g.ui.push(tnResultScreen(g, rec, null)); });
    await audit('hs-tn-chart', () => { const g = HH.game, a = g.save.data.c1, T = tnCreate(a, 'u17', { mine: true }); tnSimAll(a, T); __home('league'); g.ui.push(tnChartScreen(g, a, T)); });
    await audit('hs-summer', () => { const g = HH.game, a = g.save.data.c1; __quiet(a); a.summer = { pending: true, year: 2, season: a.season }; g.sumPick = null; g.hubTab = 'home'; g.ui.clearTo(amHub(g)); g.ui.push(summerScreen(g)); });
    await audit('hs-summer-home', () => { const g = HH.game, a = g.save.data.c1; __quiet(a); g.hubTab = 'home'; g.ui.clearTo(amHub(g)); }); // X6: HOME's line while the summer waits
    await audit('hs-summer-tip', () => { const g = HH.game; g.ui.push(tipScreen(g, 'summer')); }); // X6: the summer's first-time tip
    await audit('hs-trophies', () => { const g = HH.game, a = g.save.data.c1; a.summer = null; for (const [k, f] of [['hsnat', 1], ['u17', 1], ['u17', 2], ['allam', 1], ['aau3', 1], ['camp', 1]]) tnRow(a, k, f, { n: TNE[k].name, m: TNE[k].medals ? f : 0 }); for (const k of ['hsnat', 'u17', 'allam', 'aau3', 'camp']) tnItemGive(a, k); tnItemGive(a, 'u17'); __home('career'); g.ui.push(trophyCaseScreen(g)); }); // X7 (§6.2): with the items won
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
    await audit('col-tn-inv', () => { const g = HH.game, a = g.save.data.c1; __quiet(a); const T = tnCreate(a, 'inv', { mine: true }); tnAdvance(a, T); g.hubTab = 'home'; g.ui.clearTo(amHub(g)); g.ui.push(tnScreen(g, a, { kind: 'tourney', tid: T.id }, () => g.ui.pop())); }); // X6 (§5): the Preseason Invitational
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
    // X6 (§5): the pros' tournaments: the World Cup (groups), the Olympics (done: medals), Blacktop Kings, the PBL Cup (its knockout, its groups), the summer's message
    await ev(() => { window.__ptn = (key, o, sim) => { const g = HH.game, c = g.save.data.career; __quiet(c); const T = tnCreate(c, key, Object.assign({ mine: true }, o || {})); if (sim === 'all') tnSimAll(c, T); else { tnAdvance(c, T); for (let i = 0; i < (sim | 0); i++) tnSimMine(c, T); } g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); g.ui.push(tnScreen(g, c, { kind: 'tourney', tid: T.id }, () => g.ui.pop())); return T; }; window.__team = c => c.active.filter(id => id !== c.meId).slice(0, 3).concat([c.meId]); });
    await audit('pro-tn-wc', () => __ptn('wc', { field: __team(HH.game.save.data.career) }, 1));
    await audit('pro-tn-oly-done', () => __ptn('oly', { field: __team(HH.game.save.data.career) }, 'all'));
    await audit('pro-tn-blacktop', () => __ptn('blacktop', null, 0));
    await audit('pro-tn-cup', () => { const g = HH.game, c = g.save.data.career; __quiet(c); let T = tnOfSeason(c, 'cup', c.season); if (!T || !T.wait) { T = tnCreate(c, 'cup', { mine: true, groups: tnCupDraw(c, careerRng(c)) }); T.wait = true; } const club = meOf(c).club; for (const id in T.gt) T.gt[id] = { w: 1 + (id.length % 2), l: 2 - (id.length % 2), pf: 30 + id.length, pa: 30 }; T.gt[club] = { w: 3, l: 0, pf: 50, pa: 30 }; tnCupKo(c); __quiet(c); g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); g.ui.push(tnScreen(g, c, { kind: 'tourney', tid: T.id }, () => g.ui.pop())); });
    await audit('pro-tn-cup-groups', () => { const g = HH.game, c = g.save.data.career, T = tnState(c).list.filter(x => x.key === 'cup').slice(-1)[0]; __home('league'); g.ui.push(tnChartScreen(g, c, T)); const b = g.ui.screen.widgets.find(w => w.label === 'Groups'); if (b) b.onPress(); });
    await audit('pro-blacktop-msg', () => { const g = HH.game, c = g.save.data.career; __quiet(c); c.events.push({ kind: 'blacktop', title: 'BLACKTOP KINGS', lines: ['Summer\'s street tournament is open: sixteen on the blacktop, 3 pros among them. Enter?', 'The king takes $100K, 5 credits and the Blacktop Kings Headband. Every game counts as one: XP and the badges\' deeds.'] }); g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); });
    await audit('pro-review', () => { const g = HH.game, c = g.save.data.career; let n = 0; __quiet(c); while (n++ < 140 && !(c.events || []).some(e => evClass(e, c) === 'season')) { if (c.phase === 'offseason') break; c.events = (c.events || []).filter(e => evClass(e, c) === 'season'); simUserGame(g.save.data); } c.events = (c.events || []).filter(e => evClass(e, c) === 'season'); c.inbox = []; g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); g.ui.push(seasonReviewScreen(g, c)); });
    await audit('pro-off-awards', () => { const g = HH.game, c = g.save.data.career; let n = 0; while (c.phase !== 'offseason' && n++ < 200) { c.events = []; if (!simUserGame(g.save.data) && c.phase === 'playoffs') simPlayoffsToEnd(c); } __quiet(c); const row = c.me.seasonLog[0]; if (row && row.g) row.playoff = 'Lost in the conference finals'; g.ui.clearTo(offseasonScreen(g)); }); // X6: the offseason's review (its record tile's line was cut)
    await audit('pro-off-trades', () => { const g = HH.game, c = g.save.data.career, O = c.offseason; let k = 0; while (O.step < 4 && k++ < 20) { if (O.step === 3) { let d = 0; while (!O.faDone && d++ < 12) off2Day(c); } O.step++; off2Enter(c); } __quiet(c); for (const id of frIds()) if (c.fr && c.fr[id]) c.fr[id].window = 'rebuilding'; g.ui.clearTo(offseasonScreen(g)); }); // X6: the trade window with every team in one column (a long one ran into the note)
    // X8 (§7): the crew: its screen (a phone's role), hiring, HOME's crew line, the season's grades, the pregame's plan, the crew's messages, a tournament's prep
    await ev(() => { window.__crewFull = c => { c.me.money = Math.max(c.me.money || 0, 5e7); c.me.credits = 40; for (const role of CREW_ROLES) { const L = crewCandidates(c, role); crewHireForce(c, L[L.length - 1]); } crewSync(c); };
      window.__crewMsg = kind => { const g = HH.game, c = g.save.data.career, B = c.me, keep = Object.assign({}, CREW.msg), ph = c.phase; __quiet(c); __crewFull(c); try { CREW.msg.tight = 100; CREW.msg.poach = 1; CREW.msg.interest = 1; CREW.msg.near = 99; c.phase = 'regular';
          for (let k = 0; k < 80 && !c.events.some(e => e.kind === kind); k++) { if (kind === 'crewtight') { delete wkOf(B).tight; crewTightCheck(c, B, careerRng(c)); } else if (kind === 'crewpoach') { B.crew.poachS = null; crewPoachCheck(c, B, careerRng(c)); } else { B.talkSeason = null; crewTalkCheck(c, careerRng(c)); } } } finally { Object.assign(CREW.msg, keep); c.phase = ph; }
        let e = c.events.find(x => x.kind === kind); if (!e && kind === 'crewtrade') { const dest = frIds().find(k => k !== meOf(c).club); e = { kind: 'crewtrade', title: 'TRADE TALK', who: 'agent', dest, odds: 0.62, lines: [crewFirst(crewMember(B, 'agent')) + ', your agent: "The ' + frFullName(dest) + ' (' + frStars(c, dest) + '★) asked about you. Push for a trade? 62% they say yes."', 'Yes: they trade for you and your contract comes with you, no fame lost. If they pass, your coach hears you asked (trust −5).'] }; } /* (past the deadline: the card as it comes) */
        c.events = []; g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); if (e) g.ui.push(eventScreen(g, c, e, () => g.ui.pop())); }; });
    await audit('pro-crew', () => { const g = HH.game, c = g.save.data.career; __quiet(c); __crewFull(c); __home('career'); g.ui.push(crewScreen(g)); });
    if (phone) await audit('pro-crewrole', () => { const g = HH.game; __home('career'); g.ui.push(crewRoleScreen(g, 'skills')); });
    await audit('pro-crewhire', () => { const g = HH.game, c = g.save.data.career; crewLetGo(c, 'strength'); __home('career'); g.ui.push(crewHireScreen(g, 'strength')); });
    await audit('pro-home-crew', () => { const g = HH.game, c = g.save.data.career; __crewFull(c); __home('home'); });
    await audit('pro-crewrecap', () => { const g = HH.game, c = g.save.data.career; __quiet(c); __crewFull(c); c.events = []; crewSeasonEnd(c, 10); const e = c.events.find(x => x.kind === 'crewrecap'); c.events = []; __home('home'); if (e) g.ui.push(crewRecapScreen(g, c, e, () => g.ui.pop())); });
    await audit('pro-pregame-plan', () => { const g = HH.game, c = g.save.data.career; __home('home'); const ug = userGame(c); if (ug) g.ui.push(pregameScreen(g, ug)); });
    for (const k of ['crewtight', 'crewpoach', 'crewtrade']) await audit('pro-msg-' + k, k => __crewMsg(k), k);
    await audit('pro-tn-prep', () => __ptn('oly', { field: __team(HH.game.save.data.career) }, 0));
    await audit('pro-tn-prep-read', () => __ptn('oly', { field: __team(HH.game.save.data.career) }, 1));
    // X6: the Codex, every page of every topic (a long paragraph past its six lines is cut; the depth chart's was on a phone)
    await ev(() => { window.__codex = i => { const g = HH.game, s0 = statsGuideScreen(g, 'league'); g.ui.clearTo(careerHub(g)); g.ui.push(s0); g.ui.trans = null; for (let k = 0; k < 400; k++) { try { g.drawUI(g.ctx, g.W, g.H); } catch (e) { /* (warming the pages) */ } } if (i != null) s0.widgets[0].set(i); return s0.widgets[0].options.slice(); }; });
    { const pages = await ev(() => __codex(null)); for (let i = 0; i < pages.length; i++) await audit('pro-codex ' + pages[i], i => { __codex(i); }, i); }
    await audit('pro-summer-step', () => { const g = HH.game, c = g.save.data.career; let n = 0; while (c.phase !== 'offseason' && n++ < 200) { c.events = []; if (!simUserGame(g.save.data) && c.phase === 'playoffs') simPlayoffsToEnd(c); } __quiet(c); const O = c.offseason; if (O && O.v === 2) { O.step = 5; tnSummerAuto(c, true); __quiet(c); } g.ui.clearTo(off2Screen(g)); }); // X6 (§5): the offseason's Summer step
    await audit('pro-legacy', () => { const g = HH.game, c = g.save.data.career; g.save.data.settings.reduceMotion = true; for (const [k, f] of [['oly', 1], ['wc', 2], ['cup', 1], ['blacktop', 1]]) tnRow(c, k, f, { n: TNE[k].name, m: TNE[k].medals ? f : 0 }); retireCareer(g.save.data); g.ui.clearTo(legacyScreen(g)); }); // X6: medals and tournaments on the legacy
    await audit('pro-legacy-epi', () => { const g = HH.game, c = g.save.data.career; c.epilogue = Object.assign({ foundation: 4 }, c.epilogue || {}); g.ui.clearTo(legacyScreen(g)); }); // X6: the epilogue's second button, beside MAIN MENU
    errs.push(...P.errors.map(e => pass.id + ': ' + e)); await P.context.close();
  }
  console.log('screens30: ' + screens + ' screens, ' + flags + ' flagged · errors: ' + (errs.length ? errs.slice(0, 6).join(' | ') : 'none'));
  await browser.close(); process.exit(flags || errs.length ? 1 : 0);
})();
