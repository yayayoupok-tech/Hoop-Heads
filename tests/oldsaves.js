// Old saves: every fixture in tests/fixtures (saves written by earlier builds, from the first 1v1 career to M7) is loaded
// through a page reload, continued from the main menu and played on through the real screens: weeks with rotating
// Practice / Rest / Film plans, the press room, recruiting and commitment day, the combine and the draft, the All-Star
// weekend, the playoffs, the offseason and a new contract. Then the hub's pages are opened and, when the save has one,
// the classic team league plays two games. Fails on any page error, frame exception, NaN in the save, or a screen the
// driver cannot move past. Usage: node tests/oldsaves.js [actions per save, default 160]
const fs = require('fs'), path = require('path');
const { launch, openPage, runner } = require('./lib');
const FIX = path.join(__dirname, 'fixtures');
(async () => {
  const MAX = +process.argv[2] || 160; const browser = await launch(); const P = await openPage(browser); const R = runner('old saves'); const { ev, page } = P;
  const wait = ms => page.waitForTimeout(ms);
  // one action on the current screen, the way a player would move forward; returns the screen name
  const act = (i) => ev(i => {
    const g = HH.game; g.ui.update(1 / 60, g.input); const s = g.ui.screen; if (!s) throw new Error('no screen');
    if ((s.name === 'combine' || s.name === 'draft') && s.onTap) { s.onTap(0, 0); s.update(0.1, {}); } // skip the reveal
    const W = (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && (w.kind === 'button' || (w.kind === 'custom' && w.onPress))); const by = re => W.find(w => re.test(w.label || ''));
    const pr = w => { if (!w) throw new Error('stuck on ' + s.name + ' [' + W.map(x => x.label).join(' | ') + ']'); w.onPress(); };
    const a = g.save.data.c1, c = g.save.data.career, plans = ['practice', 'rest', 'film', 'practice'];
    switch (s.name) {
      case 'title': g.ui.clearTo(mainMenu(g)); break;
      case 'menu': pr(by(/CONTINUE CAREER/)); break;
      case 'amhub': if (a && !a.decision && a.stage !== 'combine') a.plan = plans[i % plans.length]; pr(by(/^(CHOOSE YOUR COLLEGE|DRAFT DECISION|DRAFT COMBINE)$/) || by(/^SIM$/)); break;
      case 'career': if (c && c.me) { c.me.plan = plans[i % plans.length]; if (i % 5 === 0) c.me.intensity = 'hard'; } pr(by(/^SIM$/)); break;
      case 'recruit': pr(i % 3 === 0 ? by(/^VISIT$/) || by(/^COMMIT$/) : by(/^COMMIT$/)); break;
      case 'visit': pr(by(/^COMMIT HERE$/)); break;
      case 'confirm': pr(by(/^Yes$/)); break;
      case 'amdecision': pr(W.find(w => w.primary) || W[0]); break;
      case 'combine': case 'draft': pr(by(/^(DRAFT NIGHT|START YOUR PRO CAREER)$/)); break;
      case 'press': pr(by(/^CONTINUE$/) || W[i % Math.max(1, W.length)]); break;
      case 'amevent': case 'rivalmoment': case 'commitday': case 'amresult': case 'result': case 'allstarres': case 'allstar1v1res': case 'practiceres':
        pr(by(/^(Continue|CONTINUE|BACK TO THE HUB|BACK TO THE WEEKEND)$/) || W.find(w => w.primary)); break;
      case 'allstarweekend': pr(by(/^Sim the contest$/) || by(/^Sim it$/) || by(/^DONE$/)); break;
      case 'offseason': pr(by(/^CONTINUE$/) || W.find(w => /^(Re-sign|Sign with)/.test(w.label || '')) || by(/^START SEASON/) || by(/^RETIRE/)); break;
      default: throw new Error('the driver does not know screen ' + s.name);
    }
    return g.ui.screen ? g.ui.screen.name : '(none)';
  }, i);
  const nanScan = () => ev(() => { const bad = []; const walk = (o, p, d) => { if (!o || typeof o !== 'object' || d > 9 || bad.length > 4) return; for (const k in o) { const v = o[k]; if (typeof v === 'number' && !Number.isFinite(v)) bad.push(p + '.' + k + '=' + v); else if (v && typeof v === 'object') walk(v, p + '.' + k, d + 1); } }; const d = HH.game.save.data; walk(d.c1, 'c1', 0); walk(d.career, 'career', 0); walk(d.teamCareer, 'teamCareer', 0); return bad; });
  const summary = () => ev(() => { const d = HH.game.save.data, a = d.c1, c = d.career; return a && !a.handedOff ? a.stage + ' y' + a.stageYear + ' s' + a.season + ' g' + ((a.totals || {}).g || 0) : c ? 'pro s' + c.season + ' w' + c.week + ' ' + c.phase + (c.retired ? ' retired' : '') : d.teamCareer ? 'team league only' : 'no career'; });
  const files = fs.readdirSync(FIX).filter(f => f.endsWith('.json')).sort();
  for (const file of files) {
    await R.step(file, async () => {
      const raw = fs.readFileSync(path.join(FIX, file), 'utf8');
      await ev(raw => { localStorage.setItem(CONFIG.save.key, raw); }, raw); await page.reload(); await wait(700); P.errors.length = 0; await ev(() => { window.HH_ERRORS = []; });
      const hasCareer = await ev(() => { const g = HH.game, d = g.save.data; if (g.save.corrupted) throw new Error('flagged corrupt'); if (d.version !== CONFIG.save.version) throw new Error('version ' + d.version); return !!((d.c1 && !d.c1.retired) || (d.career && !d.career.retired)); });
      const before = await summary(); let n = 0, last = '';
      if (hasCareer) for (let i = 0; i < MAX; i++) { last = await act(i); n++; if (i % 4 === 3) await wait(30); if (last === 'legacy') break; if (P.errors.length) break; }
      await wait(200); const after = await summary();
      // the hub's pages draw on the migrated save
      const pages = await ev(() => { const g = HH.game, d = g.save.data, out = []; const pro = d.career && !d.career.retired && !d.career.done, am = d.c1 && !d.c1.handedOff; if (!pro && !am) return out; g.ui.clearTo(pro ? careerHub(g) : amHub(g)); const list = pro ? [leagueScreen, playerScreen, managementScreen, headlinesScreen, trophyCaseScreen, timelineScreen, practiceScreen, filmRoomScreen] : [amStandingsScreen, amHistoryScreen, headlinesScreen, trophyCaseScreen, timelineScreen, practiceScreen, filmRoomScreen]; for (const f of list) { const sc = f(g); out.push(sc.name); g.ui.push(sc); g.ui.update(1 / 60, g.input); g.ui.draw(g.ctx || g.canvas.getContext('2d'), g.canvas.width, g.canvas.height); g.ui.pop(); } return out; });
      // the classic team league, if the save has one: two games from its hub
      const tc = await ev(() => { const g = HH.game, d = g.save.data; if (!d.teamCareer) return null; g.ui.clearTo(tcHub(g)); const r0 = d.teamCareer.results.length; for (let k = 0; k < 2; k++) { const sc = g.ui.screen; const w = sc.widgets.find(x => !x.hidden && /^(SIM|SIM THE PLAYOFFS|START PLAYOFFS)$/.test(x.label || '')); if (!w) break; w.onPress(); } return d.teamCareer.results.length - r0; });
      await wait(300); const nan = await nanScan(); const fx = await P.frameErrors();
      const msg = before + ' → ' + after + ' · ' + n + ' actions · last screen ' + last + ' · pages ' + pages.length + (tc != null ? ' · team league +' + tc + ' games' : '');
      if (P.errors.length) throw new Error(msg + ' · ' + P.errors.slice(0, 3).join(' | '));
      if (fx.length) throw new Error(msg + ' · frame exceptions: ' + fx.slice(0, 3).join(' | '));
      if (nan.length) throw new Error(msg + ' · NaN: ' + nan.join(', '));
      if (hasCareer && before === after) throw new Error(msg + ' · no progress');
      console.log('     ' + msg);
    });
  }
  const fails = R.done(); await browser.close(); process.exitCode = fails ? 1 : 0;
})();
