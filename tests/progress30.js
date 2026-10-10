// 3.0 (§9, §11): progression. Fame by role, stats and wins (a bench week moves none and fame fades from zero; gains
// shrink near the top); the ceiling shown and raised (tournament finishes and the facility lift it; CAREER and the
// focus picker show it); the legacy's parts (titles, awards, rankings, tournaments, peak OVR; a ring from the bench counts
// half); then the career simulator's §9 table: play-well careers average 40%+ more legacy than lazy ones, gain OVR in 6
// of their first 8 pro seasons, and fame spreads by how you play (100 by pro season 3 is rare; a lazy bench stays low).
// node tests/progress30.js [careers=100] [seed=1] [parallel=4]   (ONLY=<regex> runs the matching steps; SIM=0 skips the table)
const { spawn } = require('child_process'), path = require('path');
const { launch, openPage, runner } = require('./lib');
const N = +(process.argv[2] || 100), seed = +(process.argv[3] || 1), PAR = +(process.argv[4] || 4), CHUNK = 25;
const POL = [
  { id: 'effort', label: 'plays well + good choices', args: ['--policy=great', '--press=team', '--school=student', '--spend=smart', '--fa=stars', '--trade=up'] },
  { id: 'typical', label: 'typical, a smart spender', args: ['--policy=typical', '--spend=smart'] },
  { id: 'lazy', label: 'sims everything', args: ['--policy=typical', '--press=trash', '--week=rest', '--summer=job', '--spend=none', '--gear=none', '--trade=never', '--fa=yours'] },
];
const runSim = args => new Promise(res => { const p = spawn('node', [path.join(__dirname, 'careersim.js')].concat(args, ['--json', '--seasons'])); let out = ''; p.stdout.on('data', d => { out += d; }); p.stderr.on('data', d => { out += d; }); p.on('close', () => { const line = out.split('\n').find(l => l.startsWith('JSON ')); res(line ? JSON.parse(line.slice(5)) : { error: out.slice(-600) }); }); });
(async () => {
  const browser = await launch(); const P = await openPage(browser); const { ev } = P; const R = runner('PROGRESSION (3.0 §9)');
  await ev(() => {
    window.__pro = s => { const sv = defaultSave(), c = testProLeague(s, sv); sv.career = c; sv.c1.handedOff = true; HH.game.save.data = sv; c.events = []; c.inbox = []; return { sv, c }; };
    window.__bench = (c, at) => { const L = ladderOf(c); L.splice(L.indexOf('me'), 1); L.splice(at || 2, 0, 'me'); };
    const F = CanvasRenderingContext2D.prototype.fillText; window.__txt = []; CanvasRenderingContext2D.prototype.fillText = function (t, x, y, mw) { if (window.__txtOn && String(t).trim()) window.__txt.push({ t: String(t) }); return F.call(this, t, x, y, mw); }; /* the texts a frame draws */
  });

  await R.step('§9 fame by role, stats and wins: a win beats a loss, a big night beats a quiet one, a loss or a quiet night costs, and gains shrink near the top', () => ev(() => {
    const { c } = __pro(36), len = gameScale('pro'), F = CR.fame, at = (f, pts, win) => { c.me.fame = f; return fameGameGain(c, { pts: Math.round(pts * len) }, win, len, false); };
    const w = at(30, F.ptsRef, true), l = at(30, F.ptsRef, false), big = at(30, F.ptsRef + 15, true), quiet = at(30, F.ptsRef - 15, true), lowL = at(30, F.ptsRef - 15, false);
    if (!(w > 0) || !(l < 0) || !(big > w) || !(quiet < w) || !(lowL < l)) throw new Error('win ' + w + ' loss ' + l + ' big ' + big + ' quiet ' + quiet + ' a quiet loss ' + lowL);
    const g20 = at(20, F.ptsRef + 10, true), g90 = at(90, F.ptsRef + 10, true), want = fameRoom(90) / fameRoom(20);
    if (!(g90 < g20) || Math.abs(g90 / g20 - want) > 0.01) throw new Error('near the top: ' + g20.toFixed(2) + ' at 20, ' + g90.toFixed(2) + ' at 90 (want ×' + want.toFixed(2) + ')');
    return 'a win at the line +' + w.toFixed(2) + ', a loss ' + l.toFixed(2) + ', a big win +' + big.toFixed(2) + ', a quiet loss ' + lowL.toFixed(2) + ' · at 90 ×' + want.toFixed(2);
  }), P);

  await R.step('§9 fame fades from zero and the bench moves none: a Development League week only fades it (it faded only above 30 before)', () => ev(() => {
    const { sv, c } = __pro(42); __bench(c, 3); c.team.hot = {}; const out = [];
    for (const f0 of [10, 60]) { c.me.fame = f0; c.events = []; c.inbox = []; const r = simUserGame(sv); if (!r || !r.ll) throw new Error('not a bench week: ' + JSON.stringify(r && Object.keys(r))); const want = f0 * (1 - CR.fame.decay); if (Math.abs(c.me.fame - want) > 0.05) throw new Error('fame ' + f0 + ' → ' + c.me.fame.toFixed(2) + ' (want ' + want.toFixed(2) + ')'); out.push(f0 + ' → ' + c.me.fame.toFixed(2)); if (!isStarter(c)) __bench(c, 3); }
    return out.join(', ');
  }), P);

  await R.step('§9 the ceiling raised: a tournament finish lifts every skill\'s ceiling (its reward line says so), the facility lifts it, and the pros carry it', () => ev(() => {
    const sv = defaultSave(), a = amCreate(sv, { name: 'Ceiling Test', look: PRESET_LOOKS[1], number: 4, style: 'slasher', seed: 77 }), sk = ['sho', 'fin', 'han', 'def'], P0 = potsOf(a, a.caps);
    const out = tnGrant(a, 'state', 1), P1 = potsOf(a, a.caps), d = TNE.state.ceil[0]; if (!out.some(t => /^ceiling \+/.test(t)) || a.ceilTn !== d) throw new Error('the state title: ' + JSON.stringify(out) + ' ceilTn ' + a.ceilTn);
    for (const k of sk) if (Math.abs(P1[k] - Math.min(a.caps[k], P0[k] + d)) > 1e-6) throw new Error(k + ' ' + P0[k] + ' → ' + P1[k]);
    tnGrant(a, 'hsnat', 2); if (Math.abs(a.ceilTn - d - TNE.hsnat.ceil[1]) > 1e-6) throw new Error('a final: ceilTn ' + a.ceilTn);
    const { c } = __pro(36), B = c.me, me = meOf(c), Q0 = potsOf(B, me.caps); B.big = B.big || {}; B.big.facility = c.season; const Q1 = potsOf(B, me.caps), f = CONFIG.pro.big.facility.ceil;
    for (const k of sk) if (Math.abs(Q1[k] - Math.min(me.caps[k], Q0[k] + f)) > 1e-6) throw new Error('the facility: ' + k + ' ' + Q0[k] + ' → ' + Q1[k]);
    const p = ceilParts(B); if (p.facility !== f || !/facility \+/.test(ceilPartsText(B))) throw new Error('the parts ' + JSON.stringify(p));
    const sv2 = defaultSave(), a2 = amCreate(sv2, { name: 'Carry Test', look: PRESET_LOOKS[3], number: 8, style: 'slasher', seed: 78 }); a2.age = 20; a2.height = a2.heightFinal; a2.stage = 'combine'; a2.events = []; a2.ceilTn = 2.5; const c2 = createCareerFromAmateur(sv2, a2); if (c2.me.ceilTn !== 2.5) throw new Error('the pros don\'t carry the tournament ceiling: ' + c2.me.ceilTn);
    return 'state title +' + d + ', a Nationals final +' + TNE.hsnat.ceil[1] + ' · the facility +' + f + ' · ' + ceilPartsText(B);
  }), P);

  await R.step('§9 the ceiling shown: CAREER rates each rating against its ceiling with CEILING (OVR) and its parts; past a skill\'s ceiling it reads orange, and the focus picker says so', async () => {
    const r = await ev(() => { const { c } = __pro(36), g = HH.game, me = meOf(c), B = c.me, P0 = potsOf(B, me.caps); me.r.sho = Math.min(me.caps.sho - 1, Math.ceil(P0.sho) + 3); window.__txt = []; window.__txtOn = true; g.hubTab = 'career'; g.ui.clearTo(careerHub(g)); return { ceil: ceilingOvr(B, me.r, me.caps, me.h), past: ratingCeil(B, me.r, me.caps, 'sho').past, sho: me.r.sho, cap: me.caps.sho }; });
    if (!r.past) throw new Error('Shooting ' + r.sho + ' isn\'t past its ceiling');
    await P.page.waitForTimeout(400); const t1 = await ev(() => { const t = window.__txt.map(x => x.t); window.__txt = []; HH.game.ui.push(focusPickerScreen(HH.game)); return t; });
    await P.page.waitForTimeout(400); const t2 = await ev(() => { window.__txtOn = false; const t = window.__txt.map(x => x.t); HH.game.ui.pop(); return t; });
    if (!t1.includes('CEILING ' + r.ceil)) throw new Error('no "CEILING ' + r.ceil + '" on CAREER: ' + t1.filter(x => /CEIL|potential/i.test(x)).join(' | '));
    if (!t1.some(x => /potential \d+/.test(x))) throw new Error('no parts line');
    if (!t1.includes('/ ' + r.cap)) throw new Error('past its ceiling, Shooting shows its max');
    if (!t2.some(x => /past its ceiling|× XP/.test(x))) throw new Error('the focus picker: ' + t2.filter(x => /ceil|XP|max/i.test(x)).slice(0, 4).join(' | '));
    return 'CEILING ' + r.ceil + ' · Shooting ' + r.sho + ' past its ceiling (/ ' + r.cap + ')';
  }, P);

  await R.step('§9 the legacy\'s parts: a ring 10 (from the bench half), MVP, a season ranked #1/#2/#7 = 3+2+1, peak OVR 1.5 a point over 70; the parts add up to the score', () => ev(() => {
    const { c } = __pro(36), L = CR.legacy, M = c.me; M.awards = [{ s: 1, name: 'Champion' }, { s: 1, name: 'MVP' }, { s: 2, name: 'Champion' }]; M.careerStats.titles = 2; M.careerStats.pts = 0; M.careerStats.ptsN = 0;
    M.seasonLog = [{ season: 3, ovr: 72, g: 15, bench: 0, prk: 7, awards: [] }, { season: 2, ovr: 75, g: 3, bench: 12, prk: 2, awards: ['Champion'] }, { season: 1, ovr: 80, g: 15, bench: 0, prk: 1, awards: ['Champion', 'MVP'] }];
    const Lg = legacyOf(c), p = Lg.parts, peak = Math.max(80, recOvr(meOf(c)));
    if (p.titles !== L.title + L.title * L.benchTitle) throw new Error('titles ' + p.titles); if (p.rankings !== L.rank[0] + L.rank[1] + L.rank[2]) throw new Error('rankings ' + p.rankings);
    if (p.awards !== L.mvp) throw new Error('awards ' + p.awards); if (Math.abs(p.peak - (peak - L.peakFrom) * L.peak) > 0.05) throw new Error('peak ' + p.peak);
    const sum = Math.round(Object.values(p).reduce((a, v) => a + v, 0)); if (Lg.score !== sum || Lg.hof !== (Lg.score >= CR.hofScore)) throw new Error('score ' + Lg.score + ' vs parts ' + sum);
    return 'score ' + Lg.score + ' = ' + Object.entries(p).filter(([, v]) => v).map(([k, v]) => k + ' ' + v).join(' + ') + ' · the Hall at ' + CR.hofScore;
  }), P);

  await R.step('§9 no errors on the way (the CAREER tab, the focus picker, the Codex\'s Ceiling and Legacy)', async () => {
    await ev(() => { const g = HH.game; g.ui.push(statsGuideScreen(g, 'you')); }); await P.page.waitForTimeout(300); await ev(() => HH.game.ui.pop());
    const fe = await P.frameErrors(); if (fe.length) throw new Error(fe.slice(0, 2).join(' | '));
  }, P);
  await browser.close();

  if (process.env.SIM !== '0' && (!process.env.ONLY || /table/.test(process.env.ONLY))) await R.step('§9 the career simulator\'s table: play-well +40% legacy, OVR gains in 6 of the first 8 pro seasons, fame spread by how you play, the Hall of Fame', async () => {
    const t0 = Date.now(), raw = {}, jobs = []; for (const Pl of POL) { raw[Pl.id] = { ps: [], legacy: [], diff: [], fame: [], stuck: 0, errors: [] }; for (let k = 0; k * CHUNK < N; k++) jobs.push({ Pl, n: Math.min(CHUNK, N - k * CHUNK), seed: seed * 1000 + k }); }
    await Promise.all(Array.from({ length: PAR }, async () => { while (jobs.length) { const j = jobs.shift(); const r = await runSim([String(j.n), String(j.seed), '0'].concat(j.Pl.args)); const X = raw[j.Pl.id]; if (r.error) { X.errors.push(r.error); continue; } for (const k of ['ps', 'legacy', 'diff', 'fame']) X[k].push(...(r[k] || [])); X.stuck += r.stuck || 0; } }));
    const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0, med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; }, pc = v => Math.round(100 * v) + '%';
    const S = {}; for (const Pl of POL) { const X = raw[Pl.id], n = X.legacy.length || 1;
      const g8 = X.ps.filter(ps => ps.length >= 8).map(ps => { let g = 0; for (let i = 0; i < 8; i++) { const prev = i ? ps[i - 1].o : (ps[0].o0 != null ? ps[0].o0 : ps[0].o); if (ps[i].o > prev) g++; } return g; });
      const f3 = X.ps.filter(ps => ps.length >= 3).map(ps => ps[2].f), bench = X.ps.flatMap(ps => ps.filter(s => !s.sv).map(s => s.f));
      S[Pl.id] = { n: X.legacy.length, legacy: mean(X.legacy), legMed: med(X.legacy), hof: X.diff.filter(d => d.h).length / n, titles: mean(X.diff.map(d => d.t)), peak: med(X.diff.map(d => d.pk)), g8: med(g8), g8ok: g8.length ? g8.filter(g => g >= 6).length / g8.length : 0, f3: mean(f3), f3top: f3.length ? f3.filter(v => v >= 100).length / f3.length : 0, bench: mean(bench), benchN: bench.length, fame: mean(X.fame), err: X.errors.length, stuck: X.stuck }; }
    const pad = (s, k) => String(s).padEnd(k); console.log('  §9 TABLE: ' + N + ' careers a policy, seed ' + seed + ' (' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)');
    console.log('  ' + pad('policy', 28) + pad('legacy (median)', 18) + pad('HOF', 6) + pad('titles', 8) + pad('peak', 6) + pad('OVR gains /8 (6+)', 20) + pad('fame s3 (100)', 16) + pad('fame (career)', 15) + 'bench fame');
    for (const Pl of POL) { const s = S[Pl.id]; console.log('  ' + pad(Pl.label, 28) + pad(s.legacy.toFixed(1) + ' (' + s.legMed + ')', 18) + pad(pc(s.hof), 6) + pad(s.titles.toFixed(2), 8) + pad(s.peak, 6) + pad(s.g8 + ' (' + pc(s.g8ok) + ')', 20) + pad(s.f3.toFixed(0) + ' (' + pc(s.f3top) + ')', 16) + pad(s.fame.toFixed(0), 15) + (s.benchN ? s.bench.toFixed(0) + ' (' + s.benchN + ' seasons)' : '–')); }
    const E = S.effort, T = S.typical, L = S.lazy, bad = [];
    if (!(E.legacy >= 1.4 * L.legacy)) bad.push('effort legacy ' + E.legacy.toFixed(0) + ' vs lazy ' + L.legacy.toFixed(0));
    if (!(E.g8 >= 6 && E.g8ok >= 0.8)) bad.push('OVR gains: a play-well career\'s median ' + E.g8 + ' of 8 (6+ in ' + pc(E.g8ok) + ', want 80%+)');
    if (!(E.f3top <= 0.2)) bad.push('fame 100 by pro season 3 in ' + pc(E.f3top) + ' of play-well careers');
    if (!(L.bench <= 15 && L.f3 <= 25)) bad.push('a lazy career\'s fame: bench seasons ' + L.bench.toFixed(0) + ', season 3 ' + L.f3.toFixed(0));
    if (!(E.fame > T.fame && T.fame > L.fame && E.fame >= 2 * L.fame)) bad.push('fame spread ' + [E, T, L].map(s => s.fame.toFixed(0)).join(' / '));
    if (!(T.hof >= 0.03 && T.hof <= 0.12 && E.hof >= 0.55 && L.hof <= 0.03)) bad.push('the Hall of Fame: typical ' + pc(T.hof) + ' (3–12%: Part 2 §1.1\'s 3–8% and the noise of ' + N + ' careers), play-well ' + pc(E.hof) + ' (55%+), lazy ' + pc(L.hof) + ' (3% at most)');
    for (const Pl of POL) if (S[Pl.id].err || S[Pl.id].stuck) bad.push(Pl.id + ': errors ' + S[Pl.id].err + ', stuck ' + S[Pl.id].stuck + (raw[Pl.id].errors[0] ? ' — ' + raw[Pl.id].errors[0].slice(-200) : ''));
    if (bad.length) throw new Error(bad.join(' · '));
    return 'effort +' + Math.round(100 * (E.legacy / L.legacy - 1)) + '% legacy · OVR gains ' + E.g8 + '/8 (6+ ' + pc(E.g8ok) + ') · fame ' + [E, T, L].map(s => s.fame.toFixed(0)).join('/') + ' · HOF ' + [E, T, L].map(s => pc(s.hof)).join('/');
  });
  process.exit(R.done() ? 1 : 0);
})();
