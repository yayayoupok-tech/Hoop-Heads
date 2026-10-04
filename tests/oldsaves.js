// Old saves: every fixture in tests/fixtures (saves written by earlier builds, from the first 1v1 career to R10) is
// loaded through a page reload, continued from the main menu and played on through the real screens: weeks with
// rotating Practice / Rest / Film plans, the press room, recruiting and commitment day, the combine and the pro offers
// (the draft before F7), the All-Star weekend, the playoffs, the offseason and a new contract. Then the hub's pages are
// opened and, when the save has one, the classic team league plays two games. Fails on any page error, frame exception,
// NaN in the save, or a screen the driver cannot move past. Usage: node tests/oldsaves.js [actions per save,
// default 160]
const fs = require('fs'), path = require('path');
const { launch, openPage, runner } = require('./lib');
const FIX = path.join(__dirname, 'fixtures');
(async () => {
  const MAX = +process.argv[2] || 160; const browser = await launch(); const P = await openPage(browser); const R = runner('old saves'); const { ev, page } = P;
  const wait = ms => page.waitForTimeout(ms);
  // one action on the current screen, the way a player would move forward; returns the screen name
  const act = (i) => ev(i => {
    const g = HH.game; g.ui.update(1 / 60, g.input); const s = g.ui.screen; if (!s) throw new Error('no screen');
    if (/^(combine|draft|commitday|title-parade|title-ring|title-banner)$/.test(s.name) && s.onTap) { s.onTap(0, 0); s.update(0.1, {}); } // skip the reveal (V12: commitment day, a title's parade, ring and banner)
    if (s.name === 'dialog' && s.finish) s.finish(); // R9: type the page out (a choice shows once its text is done)
    const W = (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && (w.kind === 'button' || (w.kind === 'custom' && w.onPress))); const by = re => W.find(w => re.test(w.label || ''));
    const pr = w => { if (!w) throw new Error('stuck on ' + s.name + ' [' + W.map(x => x.label).join(' | ') + ']'); w.onPress(); };
    const a = g.save.data.c1, c = g.save.data.career, plans = ['practice', 'rest', 'film', 'practice', 'study'];
    switch (s.name) {
      case 'title': g.ui.clearTo(mainMenu(g)); break; // the title after a reload
      case 'tip': pr(by(/^GOT IT$/)); break; // R10: a first-time tip
      case 'traitpick': pr(W.find(w => /^Take /.test(w.label || ''))); break; // V3: the third trait (1,000 career points): take the first offer
      case 'menu': pr(by(/CONTINUE CAREER/)); break;
      case 'whatsnew': if ((g.save.__wn = (g.save.__wn || 0) + 1) > 1) throw new Error('What\'s new came back'); pr(by(/^Got it$/)); break; // V13 (2.0 §5): a save from before 2.0 sees What's new once
      case 'amhub': if (a && !a.decision && a.stage !== 'combine') a.plan = plans[i % plans.length]; if (a && a.plan === 'study') { a.plan = 'practice'; if (a.stage === 'hs' && !(a.wk && a.wk.done)) wkStudy(a); } /* R5: a Study week now and then */ pr(by(/^(CHOOSE YOUR COLLEGE|SIGNING DAY|DRAFT DECISION|TURN PRO\?|TRANSFER PORTAL|DRAFT COMBINE|PRO COMBINE|YOUR SUMMER|TRYOUTS)$/) || by(/^SIM( THE GAME)?$/)); break; /* R6: the transfer portal */
      case 'career': if (c && c.me) { c.me.plan = plans[i % plans.length]; if (i % 5 === 0) c.me.intensity = 'hard'; } pr(by(/^SIM( THE GAME)?$/)); break;
      case 'recruit': pr(i % 3 === 0 ? by(/^VISIT$/) || by(/^COMMIT$/) : by(/^COMMIT$/)); break;
      case 'visit': pr(by(/^COMMIT HERE$/)); break;
      case 'signing': pr(by(/^Sign: /) || W.find(w => w.primary) || by(/^Walk on/) || by(/^Skip college/)); break; // 2.1 (§2.5): Signing Day: the first offer (the commitment), else the prep year or a walk-on
      case 'recwalkon': pr(by(/^Walk on: /)); break; // 2.1 (§2.6): the first program whose GPA line you meet
      case 'confirm': pr(by(/^Yes$/)); break;
      case 'amdecision': pr(W.find(w => w.primary) || W[0]); break;
      case 'combine': case 'draft': pr(by(/^(PRO OFFERS|DRAFT NIGHT|START YOUR PRO CAREER)$/)); break;
      case 'prooffers': pr(by(/^SIGN WITH THE /)); break; // F7: the first offer
      case 'press': pr(by(/^CONTINUE$/) || W[i % Math.max(1, W.length)]); break;
      case 'dialog': pr(by(/^▼$/) || by(/^CONTINUE$/) || W[i % Math.max(1, W.length)]); break; // R9: a dialogue card (page, continue or a choice)
      case 'amevent': case 'rivalmoment': case 'commitday': case 'amresult': case 'result': case 'allstarres': case 'allstar1v1res': case 'practiceres':
        pr(by(/^(Continue|CONTINUE|BACK TO THE HUB|BACK TO THE WEEKEND)$/) || W.find(w => w.primary)); break;
      case 'allstarweekend': pr(by(/^Sim the contest$/) || by(/^Sim it$/) || by(/^DONE$/)); break;
      case 'offseason': pr(by(/^CONTINUE$/) || W.find(w => w.fa || /^(Re-sign|Sign with|Your club|Big market|Starts you|Offer)|★ · −?\$/.test(w.label || '')) /* F7: a free-agency offer reads 'Club 4★ · $5M × 4' */ || by(/^Opt in · /) || by(/^Skip to the end$/) || by(/^(Last day: take the best|Wait a day|Next day)$/) || by(/^Stay$/) || W.find(w => w.camp && !w.primary) || by(/^START SEASON/) || by(/^RETIRE/)); break; // 2.1 (W6): the seven steps: an option, the week's days, a rebuild's call (stay), the camp's goals
      case 'ladderevent': pr(by(/^SIM IT$/) || by(/^Continue$/)); break; // R4: a teammate's challenge
      case 'roadcard': case 'simsummary': pr(by(/^(Continue|CONTINUE)$/) || W.find(w => w.primary)); break; // V5: a Road to the League milestone, a sim-ahead summary
      case 'benchres': case 'ladderres': pr(by(/^CONTINUE$/)); break; // R4: a week on the bench, a challenge's result
      case 'ladder': pr(by(/^Back$/)); break;
      case 'tryout': pr(by(/^SIM IT$/)); break; // R5: tryouts (both parts simmed)
      case 'summer': { const opts = W.filter(w => /AAU|CAMP|REST|JOB/.test(w.label || '')); if (opts.length) opts[i % opts.length].onPress(); pr(by(/^CHOOSE$/)); break; } // R5: a summer
      case 'recruiting': case 'statebracket': case 'amstandings': pr(by(/^Back$/)); break;
      case 'tryoutpost': pr(by(/^CONTINUE$/)); break;
      case 'colchoice': pr(W[i % 2] || W[0]); break; // R6: an NIL offer or the agent's call (yes or no, alternating)
      case 'draftstock': case 'confbracket': case 'natbracket': pr(by(/^Back$/)); break; // R6
      case 'negotiate': pr(by(/^SIGN$/)); break; // R7: the negotiation (the offer's own years and role)
      case 'epilogue': pr(by(/^FINISH$/)); break; // R7
      case 'moneybuilt': case 'networth': pr(by(/^Back$/)); break; // R7
      case 'ceremony': case 'allstarpick': case 'hofinduction': case 'title-parade': case 'title-ring': case 'title-banner': pr(by(/^CONTINUE$/)); break; // V8: the ceremonies; V12: a title's parade, ring and banner
      case 'franchise': case 'bracket': pr(by(/^Back$/)); break; // V12
      case 'tradecompare': pr(by(/^Stay$/)); break; // V12
      case 'storysofar': case 'records': pr(by(/^Back$/)); break; // V8
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
      const pages = await ev(() => { const g = HH.game, d = g.save.data, out = []; const pro = d.career && d.career.phase !== 'retired' && !d.career.retired && !d.career.done, /* (W5: a career that retired on the way) */ am = d.c1 && !d.c1.handedOff; if (!pro && !am) return out; g.ui.clearTo(pro ? careerHub(g) : amHub(g)); const list = pro ? [leagueScreen, playerScreen, managementScreen, headlinesScreen, trophyCaseScreen, timelineScreen, practiceScreen, filmRoomScreen] : [amStandingsScreen, amHistoryScreen, headlinesScreen, trophyCaseScreen, timelineScreen, practiceScreen, filmRoomScreen]; for (const f of list) { const sc = f(g); out.push(sc.name); g.ui.push(sc); g.ui.update(1 / 60, g.input); g.ui.draw(g.ctx || g.canvas.getContext('2d'), g.canvas.width, g.canvas.height); g.ui.pop(); } return out; });
      // F1: the classic team league is gone from the game; a save that had one keeps its data untouched
      const tc = await ev(() => { const d = HH.game.save.data; return d.teamCareer ? (Array.isArray(d.teamCareer.results) ? d.teamCareer.results.length : -1) : null; });
      await wait(300); const nan = await nanScan(); const fx = await P.frameErrors();
      const msg = before + ' → ' + after + ' · ' + n + ' actions · last screen ' + last + ' · pages ' + pages.length + (tc != null ? ' · team league data kept (' + tc + ' results)' : '');
      if (P.errors.length) throw new Error(msg + ' · ' + P.errors.slice(0, 3).join(' | '));
      if (fx.length) throw new Error(msg + ' · frame exceptions: ' + fx.slice(0, 3).join(' | '));
      if (nan.length) throw new Error(msg + ' · NaN: ' + nan.join(', '));
      if (hasCareer && before === after) throw new Error(msg + ' · no progress');
      console.log('     ' + msg);
    });
  }
  const fails = R.done(); await browser.close(); process.exitCode = fails ? 1 : 0;
})();
