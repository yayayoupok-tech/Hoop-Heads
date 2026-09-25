// Phone audit (M9): opens 65 screens at 844×390 with touch and lists every tap target under 64 CSS px (width or height),
// widgets off the screen, overlapping widgets, and the smallest text each screen draws. It plays a scripted career to
// reach the later screens. Usage: node tests/phoneaudit.js [shotsDir] [--desktop]
const path = require('path'), fs = require('fs');
const { launch, openPage } = require('./lib');
(async () => {
  const desk = process.argv.includes('--desktop'); const dir = process.argv.slice(2).find(a => !a.startsWith('--')); if (dir) fs.mkdirSync(dir, { recursive: true });
  const browser = await launch(); const P = await openPage(browser, { phone: !desk }); /* --desktop: the same screens at 1280×720 (overflow, overlap and off-screen only) */ const { page, ev } = P; const wait = ms => page.waitForTimeout(ms);
  await ev(() => { const F = CanvasRenderingContext2D.prototype.fillText; window.__txt = []; CanvasRenderingContext2D.prototype.fillText = function (t, x, y, mw) { try { const m = /(\d+(?:\.\d+)?)px/.exec(this.font); if (m && window.__txtOn && String(t).trim()) { const a = this.getTransform().a / (window.devicePixelRatio || 1); window.__txt.push({ px: +m[1] * a, t: String(t).slice(0, 40) }); } } catch (e) {} return F.call(this, t, x, y, mw); }; });
  // text wider than the widget it is drawn in (a label running off its button)
  await ev(() => { const U = UI.prototype, D = U.drawWidget; window.__ovf = new Set(); U.drawWidget = function (ctx, w, f) { const F = ctx.fillText; ctx.fillText = function (t, x, y, mw) { try { if (window.__txtOn && w.kind !== 'text') { const m = ctx.measureText(String(t)).width, al = ctx.textAlign; const x0 = al === 'center' ? x - m / 2 : al === 'right' || al === 'end' ? x - m : x; if (x0 < w.x - 3 || x0 + m > w.x + w.w + 3) window.__ovf.add((w.label || w.kind) + ': "' + String(t).slice(0, 34) + '"'); } } catch (e) {} return F.call(this, t, x, y, mw); }; try { return D.call(this, ctx, w, f); } finally { delete ctx.fillText; } }; });
  await ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Phone Audit', look: PRESET_LOOKS[2], number: 5, style: 'slasher', seed: 31 }); a.events.length = 0; g.save.save(); });
  const audit = async (name, open, arg) => {
    await ev(open, arg); await wait(450); await ev(() => { window.__txt = []; window.__ovf.clear(); window.__txtOn = true; }); await wait(120); const ovf = await ev(() => [...window.__ovf]); const tx = await ev(() => { window.__txtOn = false; const L = window.__txt.filter(o => o.px > 0.5).sort((a, b) => a.px - b.px); const seen = new Set(), out = []; for (const o of L) { if (seen.has(o.t)) continue; seen.add(o.t); out.push(o); if (out.length >= 3) break; } return out; });
    const r = await ev(() => { const ui = HH.game.ui, s = ui.screen; if (!s) return { name: '(none)', bad: [] }; const ws = (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && w.kind !== 'text'); const bad = [];
      for (const w of ws) { const hh = w.h * ui.scale, ww = w.w * ui.scale; if (ui.phone && (hh < 63.5 || ww < 63.5)) bad.push((w.label || w.kind) + ' ' + Math.round(ww) + '×' + Math.round(hh)); if (w.x < -1 || w.y < -1 || w.x + w.w > UI_W + 1 || w.y + w.h > UI_H + 1) bad.push('OFFSCREEN ' + (w.label || w.kind)); }
      for (let i = 0; i < ws.length; i++) for (let j = i + 1; j < ws.length; j++) { const a = ws[i], b = ws[j]; if (a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1) bad.push('OVERLAP ' + (a.label || a.kind) + ' / ' + (b.label || b.kind)); }
      return { name: s.name, n: ws.length, bad }; });
    if (dir) await P.shot(path.join(dir, name + '.jpg'));
    for (const o of ovf) r.bad.push('TEXT OVERFLOW ' + o);
    const minTxt = tx.length ? tx[0].px : 99; texts.push({ name, min: minTxt, tx });
    console.log((r.bad.length ? 'FLAG  ' : 'ok    ') + name + ' (' + r.name + ', ' + r.n + ' widgets, min text ' + minTxt.toFixed(1) + ' px)' + (r.bad.length ? ': ' + r.bad.slice(0, 12).join(' | ') + (r.bad.length > 12 ? ' …+' + (r.bad.length - 12) : '') : ''));
  };
  const texts = [];
  await audit('menu', () => HH.game.ui.clearTo(mainMenu(HH.game)));
  await audit('settings', () => HH.game.ui.push(settingsScreen(HH.game)));
  await audit('howto', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(howToScreen(HH.game)); });
  await audit('extras', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(extrasScreen(HH.game)); });
  await audit('quickplay', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(quickPlayScreen(HH.game)); });
  await audit('tournament', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(tournamentScreen(HH.game)); });
  await audit('threept', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(threePointScreen(HH.game)); });
  await audit('free-practice', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(extrasScreen(HH.game)); HH.game.ui.screen.widgets.find(w => w.label === 'Practice').onPress(); });
  await audit('tour-bracket', () => { const g = HH.game; g.ui.clearTo(mainMenu(g)); g.ui.push(tournamentScreen(g)); g.ui.screen.widgets.find(w => /START TOURNAMENT/.test(w.label || '')).onPress(); });
  await audit('confirm', () => { const g = HH.game; g.tournament = null; g.ui.clearTo(mainMenu(g)); g.ui.push(settingsScreen(g)); g.ui.push(confirmScreen(g, 'Erase everything, including your career and Hall of Fame?', () => {})); });
  await audit('keyboard', () => { const g = HH.game; g.ui.clearTo(mainMenu(g)); g.ui.push(keyboardScreen(g, 'Rookie', () => {})); });
  await audit('halloffame', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(hallOfFameScreen(HH.game)); });
  await audit('create', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(createPlayerScreen(HH.game)); });
  await audit('customize-face', () => { const g = HH.game; const s = g.ui.screen; const w = (s.widgets || []).find(x => /face|Customize|Edit/i.test(x.label || '')); if (w) w.onPress(); });
  await audit('am-hub', () => { const g = HH.game; g.ui.clearTo(amHub(g)); });
  await audit('am-story-event', () => { const g = HH.game, a = g.save.data.c1; a.events.push({ kind: 'story', from: 'Coach', title: 'FIRST DAY', lines: ['Line one of the story.', 'Line two.'] }); g.ui.clearTo(amHub(g)); });
  await audit('am-growth', () => { const g = HH.game, a = g.save.data.c1; a.events.length = 0; a.events.push({ kind: 'growth', title: 'GROWTH SPURT!', grow: { from: a.height - 0.03, to: a.height }, lines: ['You grew 1″ this summer.', 'Height changes your game.'] }); g.ui.clearTo(amHub(g)); });
  await audit('am-practice', () => HH.game.ui.push(practiceScreen(HH.game)));
  await audit('am-film', () => { HH.game.ui.clearTo(amHub(HH.game)); HH.game.ui.push(filmRoomScreen(HH.game)); });
  await audit('am-standings', () => { HH.game.ui.clearTo(amHub(HH.game)); HH.game.ui.push(amStandingsScreen(HH.game)); });
  await audit('am-history', () => { HH.game.ui.clearTo(amHub(HH.game)); HH.game.ui.push(amHistoryScreen(HH.game)); });
  await audit('news', () => { HH.game.ui.clearTo(amHub(HH.game)); HH.game.ui.push(headlinesScreen(HH.game)); });
  await audit('trophies', () => { HH.game.ui.clearTo(amHub(HH.game)); HH.game.ui.push(trophyCaseScreen(HH.game)); });
  await audit('timeline', () => { HH.game.ui.clearTo(amHub(HH.game)); HH.game.ui.push(timelineScreen(HH.game)); });
  await audit('am-result', () => { const g = HH.game, a = g.save.data.c1; const r = amSimGame(a); a.events.length = 0; g.ui.clearTo(amResultScreen(g, r, null)); });
  await audit('press', () => { const g = HH.game, a = g.save.data.c1; g.ui.clearTo(amHub(g)); a.events.push({ kind: 'press', q: 'Test?', x: { name: a.name, won: true, us: 15, them: 9, opp: 'Some One' } }); });
  await audit('recruit', () => { const g = HH.game, a = g.save.data.c1; a.events.length = 0; a.stage = 'hs'; a.stageYear = 4; amStartRecruiting(a, amRng(a)); a.events.length = 0; g.ui.clearTo(amHub(g)); g.ui.push(amDecisionScreen(g)); });
  await audit('visit', () => { const g = HH.game, a = g.save.data.c1; g.ui.push(visitScreen(g, a.decision.offers[0])); });
  await audit('commit-day', () => { const g = HH.game, a = g.save.data.c1; a.events.length = 0; a.events.push({ kind: 'commit', offers: a.decision.offers.filter(o => !o.draft), chosen: 0 }); g.ui.clearTo(amHub(g)); });
  await audit('declare', () => { const g = HH.game, a = g.save.data.c1; amChooseCollege(a, a.decision.offers[0]); a.events.length = 0; a.decision = { kind: 'declare' }; g.ui.clearTo(amHub(g)); g.ui.push(amDecisionScreen(g)); });
  await audit('combine', () => { const g = HH.game, a = g.save.data.c1; a.decision = null; a.stage = 'combine'; a.events.length = 0; g.ui.clearTo(amHub(g)); g.ui.push(amCombineScreen(g)); });
  await audit('draft', () => { const g = HH.game; const c = testProLeague(12, g.save.data); g.save.data.c1.handedOff = true; c.events.length = 0; g.ui.clearTo(draftScreen(g)); });
  await audit('pro-hub', () => { const g = HH.game; const c = testProLeague(12, g.save.data); g.save.data.c1.handedOff = true; c.events.length = 0; g.save.save(); g.ui.clearTo(careerHub(g)); });
  await audit('pregame', () => { const g = HH.game, c = g.save.data.career; g.ui.push(pregameScreen(g, userGame(c))); });
  await audit('pro-practice', () => { HH.game.ui.clearTo(careerHub(HH.game)); HH.game.ui.push(practiceScreen(HH.game)); });
  await audit('league', () => { HH.game.ui.clearTo(careerHub(HH.game)); HH.game.ui.push(leagueScreen(HH.game)); });
  await audit('player', () => { HH.game.ui.clearTo(careerHub(HH.game)); HH.game.ui.push(playerScreen(HH.game)); });
  for (let t = 0; t < 5; t++) await audit('management-tab' + t, t => { HH.game.ui.clearTo(careerHub(HH.game)); HH.game.mgmtTab = { tab: t }; const s = managementScreen(HH.game); HH.game.ui.push(s); }, t);
  await audit('pro-result', () => { const g = HH.game, c = g.save.data.career; const rec = simUserGame(g.save.data); c.events.length = 0; g.ui.clearTo(careerResultScreen(g, rec, null)); });
  await audit('allstar', () => { const g = HH.game, c = g.save.data.career; for (const k of RATING_KEYS) meOf(c).r[k] = 99; let n = 0; while (!c.allStar && n++ < 30) { c.events.length = 0; simUserGame(g.save.data); } c.events = c.events.filter(e => e.kind === 'allstar'); g.ui.clearTo(careerHub(g)); });
  await audit('offseason', () => { const g = HH.game, c = g.save.data.career; let n = 0; while (c.phase !== 'offseason' && n++ < 60) { c.events.length = 0; simUserGame(g.save.data); } c.events.length = 0; g.ui.clearTo(offseasonScreen(g)); });
  await audit('offseason-contract', () => { const g = HH.game, c = g.save.data.career; c.me.contract.years = 1; c.offseason.step = 3; c.offseason.fa = null; c.offseason.contractDone = false; g.ui.clearTo(offseasonScreen(g)); });
  await audit('rival-moment', () => { const g = HH.game, c = g.save.data.career; c.events.length = 0; c.events.push({ kind: 'rival', title: 'THE RIVAL', lines: ['They beat you last time.'], opp: c.rivalId || c.active.find(id => id !== c.meId) }); g.ui.clearTo(careerHub(g)); });
  await audit('pro-press', () => { const g = HH.game, c = g.save.data.career; c.events.length = 0; c.events.push({ kind: 'press', q: 'Big win tonight. Thoughts?', x: { name: meOf(c).name, won: true, us: 21, them: 12, opp: 'Some One' } }); g.ui.clearTo(careerHub(g)); });
  await audit('hof-full', () => { const g = HH.game, H = g.save.data.hallOfFame; for (let i = 0; i < 7; i++) H.push({ name: 'Legend ' + i, look: PRESET_LOOKS[i % PRESET_LOOKS.length], h: 1.9, arch: 'slasher', score: 50 + i * 8, hof: i > 3, seasons: 10 + i, titles: i, ppg: 20 + i, mvps: i % 3, when: i + 1 }); g.ui.clearTo(mainMenu(g)); g.ui.push(hallOfFameScreen(g)); });
  await audit('legacy', () => { const g = HH.game, sv = g.save.data; retireCareer(sv); g.save.save(); g.ui.clearTo(legacyScreen(g)); });
  await audit('team-league', () => { HH.game.ui.clearTo(mainMenu(HH.game)); HH.game.ui.push(extrasScreen(HH.game)); const s = HH.game.ui.screen; const w = s.widgets.find(x => /Team league/.test(x.label || '')); if (w) w.onPress(); });
  await audit('tc-create-p3', () => { const s = HH.game.ui.screen; if (s.widgets.some(w => w.label === '▶')) { const nx = s.widgets.find(w => w.label === '▶'); nx.onPress(); nx.onPress(); } });
  await audit('tc-customize', () => { const s = HH.game.ui.screen; const w = s.widgets.find(x => x.label === 'Customize look'); if (w) w.onPress(); });
  await audit('tc-choose-team', () => { const g = HH.game; g.ui.pop(); const w = g.ui.screen.widgets.find(x => x.label === 'READY!'); if (w) w.onPress(); });
  await audit('tc-hub', () => { const g = HH.game; const w = g.ui.screen.widgets.find(x => x.kind === 'custom'); if (w) w.onPress(); });
  await audit('tc-standings', () => { const g = HH.game; g.ui.clearTo(tcHub(g)); g.ui.push(tcStandingsScreen(g)); });
  await audit('tc-shop-attrs', () => { const g = HH.game; g.ui.clearTo(tcHub(g)); g.ui.push(tcShopScreen(g, 'attrs')); });
  await audit('tc-shop-moves', () => { const g = HH.game; g.ui.clearTo(tcHub(g)); g.ui.push(tcShopScreen(g, 'moves')); });
  await audit('tc-manager', () => { const g = HH.game; g.save.data.teamCareer.managerUnlocked = true; g.ui.clearTo(tcHub(g)); g.ui.push(tcManagerScreen(g)); });
  await audit('tc-lineup', () => { const g = HH.game; g.ui.push(tcLineupScreen(g)); });
  await audit('tc-trade', () => { const g = HH.game; g.ui.clearTo(tcManagerScreen(g)); g.ui.push(tcTradeScreen(g)); });
  await audit('tc-freeagents', () => { const g = HH.game; g.ui.clearTo(tcManagerScreen(g)); g.ui.push(tcFreeAgentScreen(g)); });
  await audit('tc-strategy', () => { const g = HH.game; g.ui.clearTo(tcManagerScreen(g)); g.ui.push(tcStrategyScreen(g)); });
  await audit('pause', () => { const g = HH.game; g.ui.clearTo(mainMenu(g)); const a = soloTeam(extrasPool(g)[0], false), b = soloTeam(extrasPool(g)[1], true); g.startMatch({ mode: '1v1', teams: [a, b], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 11 }, court: 'blacktop', seed: 3, controlMode: 'lock' }, { kind: 'quick' }); g.pause(); });
  await audit('postgame-quick', () => { const g = HH.game; g.ui.clearTo(mainMenu(g)); const a = soloTeam(extrasPool(g)[0], false), b = soloTeam(extrasPool(g)[1], true); g.startMatch({ mode: '1v1', teams: [a, b], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 3 }, court: 'blacktop', seed: 5, controlMode: 'lock' }, { kind: 'quick' }); for (const p of g.match.players) p.controlled = false; for (let i = 0; i < 120 * 240 && !g.match.ended; i++) simStep(g.match, STEP); });
  await wait(4000); await audit('postgame-quick-later', () => {});
  console.log('smallest text (CSS px): ' + texts.slice().sort((a, b) => a.min - b.min).slice(0, 25).map(o => o.name + ' ' + o.min.toFixed(1) + ' "' + (o.tx[0] ? o.tx[0].t : '') + '"').join(' | '));
  console.log('errors: ' + (P.errors.length ? P.errors.join(' | ') : 'none')); await browser.close();
})();
