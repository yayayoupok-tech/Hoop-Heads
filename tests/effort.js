// 2.1 §1.1, §1.2, §1.4: the career simulator's policy table. Effort must matter: "plays well + good choices" against
// "sims everything" (legacy +40% or more, and a clearly higher 5★ rate and more titles); teams come to you (a player who
// plays well and never opens a menu reaches a 3★ team in 60%+ of careers); money gets spent (a smart spender's cash at
// retirement under 30% of what they earned). Prints the table and exits 1 on a miss.
// node tests/effort.js [careers=200] [seed=1] [parallel=2]
const { spawn } = require('child_process'), path = require('path');
const N = +(process.argv[2] || 200), seed = +(process.argv[3] || 1), PAR = +(process.argv[4] || 2), CHUNK = 50;
const POL = [
  { id: 'effort', label: 'plays well + good choices', args: ['--policy=great', '--press=team', '--school=student', '--spend=smart', '--fa=stars', '--trade=up'] },
  { id: 'lazy', label: 'sims everything (trash talk, rest, summer jobs)', args: ['--policy=typical', '--press=trash', '--week=rest', '--summer=job', '--spend=none', '--gear=none', '--trade=never', '--fa=yours'] },
  { id: 'menus', label: 'plays well, never opens a menu', args: ['--policy=great', '--menus=never'] },
  { id: 'smart', label: 'typical, a smart spender', args: ['--policy=typical', '--spend=smart'] },
];
const runSim = args => new Promise(res => { const p = spawn('node', [path.join(__dirname, 'careersim.js')].concat(args, ['--json'])); let out = ''; p.stdout.on('data', d => { out += d; }); p.stderr.on('data', d => { out += d; }); p.on('close', () => { const line = out.split('\n').find(l => l.startsWith('JSON ')); res(line ? JSON.parse(line.slice(5)) : { error: out.slice(-600) }); }); });
(async () => {
  const t0 = Date.now(), raw = {}, jobs = []; for (const P of POL) { raw[P.id] = { legacy: [], diff: [], stuck: 0, errors: [] }; for (let k = 0; k * CHUNK < N; k++) jobs.push({ P, n: Math.min(CHUNK, N - k * CHUNK), seed: seed * 1000 + k }); }
  await Promise.all(Array.from({ length: PAR }, async () => { while (jobs.length) { const j = jobs.shift(); const r = await runSim([String(j.n), String(j.seed), '0'].concat(j.P.args)); const R = raw[j.P.id]; if (r.error) { R.errors.push(r.error); continue; } R.legacy.push(...r.legacy); R.diff.push(...r.diff); R.stuck += r.stuck || 0; } }));
  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0, med = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; }, pc = v => (100 * v).toFixed(0) + '%', pad = (s, n) => String(s).padEnd(n);
  const S = {}; for (const P of POL) { const R = raw[P.id], D = R.diff, n = D.length || 1; S[P.id] = { n: D.length, legacy: mean(R.legacy), legMed: med(R.legacy), s5: D.filter(d => d.b5 >= 5).length / n, s3: D.filter(d => d.b5 >= 3).length / n, titles: mean(D.map(d => d.t)), hof: D.filter(d => d.h).length / n, o22: med(D.map(d => d.o22)), peak: med(D.map(d => d.pk)), un: med(D.map(d => d.un)), stuck: R.stuck, errors: R.errors }; }
  console.log('CAREER POLICIES (2.1 §1.1, §1.2, §1.4): ' + N + ' careers each, seed ' + seed);
  console.log(pad('policy', 50) + pad('legacy', 14) + pad('5★ team', 9) + pad('3★ team', 9) + pad('titles', 8) + pad('HOF', 6) + pad('OVR@22', 8) + pad('peak', 6) + 'unspent');
  for (const P of POL) { const s = S[P.id]; console.log(pad(P.label, 50) + pad(s.legacy.toFixed(1) + ' (med ' + s.legMed + ')', 14) + pad(pc(s.s5), 9) + pad(pc(s.s3), 9) + pad(s.titles.toFixed(2), 8) + pad(pc(s.hof), 6) + pad(s.o22, 8) + pad(s.peak, 6) + (s.un ? pc(s.un) : '-')); }
  const E = S.effort, L = S.lazy, checks = [
    ['effort matters: legacy +40% or more over sims-everything', E.legacy >= 1.4 * L.legacy, '+' + (100 * (E.legacy / Math.max(0.01, L.legacy) - 1)).toFixed(0) + '%'],
    ['effort matters: a clearly higher 5★ rate (+10 points or more)', E.s5 >= L.s5 + 0.1, pc(E.s5) + ' vs ' + pc(L.s5)],
    ['effort matters: more titles (1.5× or more)', E.titles >= 1.5 * Math.max(0.01, L.titles), E.titles.toFixed(2) + ' vs ' + L.titles.toFixed(2)],
    ['teams come to you: never opening a menu still reaches a 3★ team in 60%+', S.menus.s3 >= 0.6, pc(S.menus.s3)],
    ['money: a smart spender\'s unspent cash at retirement under 30% of earnings', S.smart.un < 0.3, pc(S.smart.un)],
    ['no stuck careers, no errors', POL.every(P => !S[P.id].stuck && !S[P.id].errors.length), POL.map(P => P.id + ' ' + S[P.id].stuck + '/' + S[P.id].errors.length).join(' ')],
  ];
  let bad = 0; for (const [what, ok, got] of checks) { if (!ok) bad++; console.log((ok ? 'PASS ' : 'FAIL ') + what + ' · ' + got); }
  for (const P of POL) if (S[P.id].errors.length) console.log(P.id + ' error: ' + S[P.id].errors[0]);
  console.log('effort: ' + (checks.length - bad) + ' passed, ' + bad + ' failed · ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s'); process.exit(bad ? 1 : 0);
})();
