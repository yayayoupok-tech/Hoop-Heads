// R10 §4 QA: one whole career through the real screens, from the title to the Hall of Fame. Player creation, tryouts,
// four high school seasons (a summer each, recruiting, a visit, commitment day, the state tournament when it's earned),
// college (NIL, the conference and national tournaments, the draft decision), the combine and the draft, then pro
// seasons (the depth chart, contracts and free agency, sponsors and staff, the All-Star weekend, the playoffs, the
// offseason) until retirement, the epilogue and the Hall of Fame. One game at each level is played as a real match (the
// bots finish it through the real simulation); the rest are simmed with the SIM buttons. Every story card, press
// question and choice is answered on screen. Fails on any page error, frame exception, NaN in the save, or a screen the
// driver can't move past (a dead end). Usage: node tests/fullcareer.js [maxActions, default 5000] [--phone] [--seed=N]
const { launch, openPage, runner } = require('./lib');
(async () => {
  const MAX = +process.argv.slice(2).find(a => /^\d+$/.test(a)) || 5000, phone = process.argv.includes('--phone'), seed = +((process.argv.find(a => a.startsWith('--seed=')) || '--seed=2024').slice(7));
  const browser = await launch(); const P = await openPage(browser, { phone }); const R = runner('full career' + (phone ? ' (phone)' : '')); const { ev, page } = P; const wait = ms => page.waitForTimeout(ms);
  const seen = new Set(), levels = { hs: 0, college: 0, pro: 0 }; let steps = 0;
  // one action on the current screen, the way a player would move forward; returns what happened
  const act = (i, played) => ev(([i, played, seed]) => {
    const g = HH.game; g.ui.update(1 / 60, g.input); const s = g.ui.screen; if (!s) return { name: g.mode === 'match' ? 'match' : '(none)' };
    if (s.finish) s.finish(); // a dialogue box's page typed out (its answers show then)
    const at = s.name; window.__fcSeen = window.__fcSeen || {}; window.__fcSeen[at] = (window.__fcSeen[at] || 0) + 1;
    if ((s.name === 'combine' || s.name === 'draft') && s.onTap) { s.onTap(0, 0); s.update(0.1, {}); } // skip the reveal
    const W = (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && (w.kind === 'button' || (w.kind === 'custom' && w.onPress))); const by = re => W.find(w => re.test(w.label || ''));
    const pr = w => { if (!w) throw new Error('dead end on ' + s.name + ' [' + W.map(x => x.label).join(' | ') + ']'); w.onPress(); };
    const d = g.save.data, a = d.c1 && !d.c1.handedOff ? d.c1 : null, c = d.career, plans = ['practice', 'rest', 'film', 'practice', 'study'];
    switch (s.name) {
      case 'splash': g.ui.clearTo(titleScreen(g)); break;
      case 'title': g.ui.clearTo(mainMenu(g)); break;
      case 'menu': if (c && c.phase === 'retired' && c.epilogue) return { name: 'menu', done: true }; pr(by(/^(CONTINUE CAREER|START YOUR CAREER|YOUR RETIREMENT)$/)); break;
      case 'create': { const sb = by(/START HIGH SCHOOL/); if (!sb) throw new Error('no START HIGH SCHOOL'); if (g.newCareer) g.newCareer.seed = seed; pr(sb); break; }
      case 'amhub': { if (a && !a.decision && a.stage !== 'combine') a.plan = plans[i % plans.length]; if (a && a.plan === 'study') { a.plan = 'practice'; if (a.stage === 'hs' && !(a.wk && a.wk.done)) wkStudy(a); }
        const lvl = a && a.stage, play = by(/^PLAY( GAME)?$/); if (lvl && !played[lvl] && play && a.league && !a.decision) { pr(play); return { name: s.name, played: lvl }; }
        pr(by(/^(CHOOSE YOUR COLLEGE|DRAFT DECISION|TURN PRO\?|TRANSFER PORTAL|DRAFT COMBINE|PRO COMBINE|YOUR SUMMER|TRYOUTS)$/) || by(/^SIM( THE GAME)?$/)); break; }
      case 'career': { if (c && c.me) { c.me.plan = plans[i % plans.length]; if (i % 5 === 0) c.me.intensity = 'hard'; }
        if (c && c.me && !c.me._bizDone && c.phase === 'regular' && c.season >= 2) { c.me._bizDone = true; g.ui.push(managementScreen(g)); return { name: 'career', biz: true }; } // money: open Business once
        const play = by(/^PLAY$/); if (!played.pro && play && c.phase === 'regular' && i % 7 === 3) { pr(play); break; } /* the pregame screen, then TIP OFF */ pr(by(/^SIM( THE GAME)?$/) || by(/^(START SEASON|OFFSEASON|CONTINUE)/)); break; }
      case 'pregame': pr(by(/^TIP OFF$/)); return { name: s.name, played: 'pro' };
      case 'management': { const hire = W.find(w => /^(Hire|Upgrade|Buy)/.test(w.label || '') && w.enabled !== false); if (hire && !g._hired) { g._hired = true; hire.onPress(); return { name: s.name, bought: hire.label }; } g.ui.pop(); break; }
      case 'recruit': pr(!g._visited && by(/^VISIT$/) ? (g._visited = true, by(/^VISIT$/)) : by(/^COMMIT$/)); break; // the first time: a visit
      case 'visit': pr(by(/^COMMIT HERE$/)); break;
      case 'confirm': pr(by(/^Yes$/)); break;
      case 'amdecision': pr(W.find(w => w.primary) || W[0]); break;
      case 'combine': case 'draft': pr(by(/^(PRO OFFERS|DRAFT NIGHT|START YOUR PRO CAREER)$/)); break;
      case 'prooffers': pr(by(/^SIGN WITH THE /)); break; // F7: the first offer
      case 'press': pr(by(/^CONTINUE$/) || W[i % Math.max(1, W.length)]); break;
      case 'dialog': pr(by(/^▼$/) || by(/^CONTINUE$/) || W[i % Math.max(1, W.length)]); break;
      case 'tip': pr(by(/^GOT IT$/)); break;
      case 'amevent': case 'rivalmoment': case 'commitday': case 'amresult': case 'result': case 'allstarres': case 'allstar1v1res': case 'practiceres': case 'postgame':
        pr(by(/^(Continue|CONTINUE|BACK TO THE HUB|BACK TO THE WEEKEND)$/) || W.find(w => w.primary)); break;
      case 'allstarweekend': pr(by(/^Sim the contest$/) || by(/^Sim it$/) || by(/^DONE$/)); break;
      case 'offseason': pr(by(/^CONTINUE$/) || W.find(w => w.fa || /^(Re-sign|Sign with|Your club|Big market|Starts you|Offer)|★ · −?\$/.test(w.label || '')) /* F7: a free-agency offer reads 'Club 4★ · $5M × 4' */ || by(/^START SEASON/) || by(/^RETIRE/)); break;
      case 'ladderevent': pr(by(/^SIM IT$/) || by(/^Continue$/)); break;
      case 'benchres': case 'ladderres': pr(by(/^CONTINUE$/)); break;
      case 'ladder': case 'recruiting': case 'statebracket': case 'amstandings': case 'draftstock': case 'confbracket': case 'natbracket': case 'moneybuilt': case 'networth': pr(by(/^Back$/)); break;
      case 'tryout': pr(by(/^SIM IT$/)); break;
      case 'tryoutpost': pr(by(/^CONTINUE$/)); break;
      case 'summer': { const opts = W.filter(w => /AAU|CAMP|REST|JOB/.test(w.label || '')); if (opts.length) opts[i % opts.length].onPress(); pr(by(/^CHOOSE$/)); break; }
      case 'reststudy': pr(by(/^STUDY/)); break;
      case 'colchoice': pr(W[i % 2] || W[0]); break;
      case 'negotiate': pr(by(/^SIGN$/)); break;
      case 'epilogue': { const opt = W.find(w => /^(Foundation|Academy|A stake|Coach|Broadcast|Walk away)/i.test(w.label || '')); if (opt && !g._epi) { g._epi = true; opt.onPress(); return { name: s.name }; } pr(by(/^FINISH$/)); break; }
      case 'legacy': case 'halloffame': return { name: s.name, done: !!(c && c.phase === 'retired') };
      default: throw new Error('the driver does not know screen ' + s.name + ' [' + W.map(x => x.label).join(' | ') + ']');
    }
    return { name: g.ui.screen ? g.ui.screen.name : g.mode === 'match' ? 'match' : '(none)' };
  }, [i, played, seed]);
  const finishMatch = () => ev(() => { const m = HH.game.match; if (!m) return 0; for (const p of m.players) if (p.controlled) { p.controlled = false; p.input.reset(); } let n = 0; while (!m.ended && n < 120 * 60 * 30) { simStep(m, STEP); n++; } return n; });
  const where = () => ev(() => { const d = HH.game.save.data, a = d.c1, c = d.career; return a && !a.handedOff ? a.stage + ' y' + a.stageYear + ' s' + a.season + ' g' + ((a.totals || {}).g || 0) : c ? 'pro s' + c.season + ' w' + c.week + ' ' + c.phase : 'no career'; });
  const nanScan = () => ev(() => { const bad = []; const walk = (o, p, dd) => { if (!o || typeof o !== 'object' || dd > 9 || bad.length > 4) return; for (const k in o) { const v = o[k]; if (typeof v === 'number' && !Number.isFinite(v)) bad.push(p + '.' + k + '=' + v); else if (v && typeof v === 'object') walk(v, p + '.' + k, dd + 1); } }; const d = HH.game.save.data; walk(d.c1, 'c1', 0); walk(d.career, 'career', 0); return bad; });
  await R.step('a whole career, title to Hall of Fame' + (phone ? ' (phone)' : ''), async () => {
    await ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); g.applySettings(); g.ui.clearTo(titleScreen(g)); window.HH_ERRORS = []; });
    const played = {}; let last = '', same = 0, done = false, lastWhere = '';
    for (let i = 0; i < MAX && !done; i++) {
      const r = await act(i, played); steps++; seen.add(r.name);
      if (r.played) { await wait(1600); const n = await finishMatch(); if (n) { played[r.played] = true; levels[r.played]++; await wait(2600); } continue; } // (no match: benched this week; try another week)
      if (r.name === 'match') { await finishMatch(); await wait(1200); continue; }
      if (r.done) { done = true; break; }
      const w = await where(); const key = r.name + '|' + w; same = key === last ? same + 1 : 0; last = key; if (same > 40) throw new Error('stuck on ' + r.name + ' at ' + w);
      if (w !== lastWhere) { lastWhere = w; if (i % 25 === 0) { const bad = await nanScan(); if (bad.length) throw new Error('NaN in the save: ' + bad.join(', ')); } }
      if (r.name === 'menu' || r.name === 'title') await wait(60);
    }
    const tour = await ev(() => { const d = HH.game.save.data, a = d.c1 || {}, c = d.career || {}, M = c.me || {}, me = c.players && c.players[c.meId] || {}; return { screens: window.__fcSeen, hs: { titles: a.titles, mvps: a.mvps }, college: a.college || null, pick: me.draftPick, earned: Math.round((M.earned || 0) / 1e6) + 'M', awards: (M.awards || []).map(x => x.name).filter(n => !/trait/i.test(n)).slice(0, 14), tl: (c.timeline || []).length }; });
    const fin = await ev(() => { const d = HH.game.save.data, c = d.career; return { retired: !!(c && c.phase === 'retired'), epi: !!(c && c.epilogue), hof: (d.hallOfFame || []).map(h => h.name), me: c && c.players && c.players[c.meId] ? c.players[c.meId].name : '', seasons: c ? c.season : 0, age: c && c.players && c.players[c.meId] ? c.players[c.meId].age : 0 }; });
    if (!done || !fin.retired || !fin.epi) throw new Error('did not finish: ' + JSON.stringify(fin) + ' after ' + steps + ' actions at ' + await where());
    if (!fin.hof.includes(fin.me)) throw new Error('not in the Hall of Fame list: ' + JSON.stringify(fin));
    for (const l of ['hs', 'college', 'pro']) if (!levels[l]) throw new Error('no real game played at ' + l);
    const fe = await P.frameErrors(); if (fe.length) throw new Error('frame errors: ' + fe.join(' | ')); const bad = await nanScan(); if (bad.length) throw new Error('NaN in the save: ' + bad.join(', '));
    console.log('  ' + steps + ' actions · retired after ' + fin.seasons + ' pro seasons at ' + fin.age + ' · real games ' + JSON.stringify(levels) + '\n  career: ' + JSON.stringify({ hs: tour.hs, college: tour.college, pick: tour.pick, earned: tour.earned, awards: tour.awards }) + '\n  screens acted on: ' + Object.keys(tour.screens).sort().map(k => k + ' ' + tour.screens[k]).join(' · '));
  });
  const fails = R.done(); await browser.close(); process.exitCode = fails ? 1 : 0;
})();
