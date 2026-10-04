// 2.1 §1.3: sim/play parity. Your simmed points a game must be within 10% of your played points a game, 200+ games
// each. The career simulator plays the careers (two of each play style by default) with --parity=40: before each of the
// first 20 high school, 20 college and 40 pro games you play, the same game is played in the engine with the AI at your
// controls (the career's own match options, finalized like a played game: Legends View, the running clock), and set
// against what the sim gives you in that matchup (the mean of 40 draws). The careers themselves go on simmed.
// node tests/parity.js [careers=12] [seed=7]   (seeds 3-6 fitted and checked the models; 7 is fresh)
const { spawn } = require('child_process'), path = require('path');
const N = +(process.argv[2] || 12), seed = +(process.argv[3] || 7);
const t0 = Date.now(); const p = spawn('node', [path.join(__dirname, 'careersim.js'), String(N), String(seed), '0', '--parity=40'], { stdio: ['ignore', 'pipe', 'inherit'] });
let out = ''; p.stdout.on('data', d => { out += d; });
p.on('close', code => {
  const L = out.split('\n').find(l => l.startsWith('PARITYJSON '));
  if (code !== 0 || !L) { console.log(out.slice(-3000)); console.log('FAIL the career simulator gave no parity data (exit ' + code + ')'); process.exit(1); }
  const P = JSON.parse(L.slice(11)), m = (B, f) => B.reduce((t, x) => t + f(x), 0) / Math.max(1, B.length), pad = (s, n) => String(s).padEnd(n);
  const rows = [['high school', P.am.filter(x => x.st === 'hs'), 100], ['college', P.am.filter(x => x.st === 'college'), 100], ['amateur (both)', P.am, 200], ['pro', P.pro, 200]];
  console.log('SIM/PLAY PARITY (2.1 §1.3): ' + N + ' careers, seed ' + seed + ' · your points a game, played (the engine, the AI at your controls) vs simmed (the same matchups)');
  console.log(pad('level', 16) + pad('games', 7) + pad('played', 8) + pad('simmed', 8) + pad('simmed/played', 15) + 'target 0.90-1.10');
  let bad = 0;
  for (const [lb, B, need] of rows) { const pl = m(B, x => x.eng), sm = m(B, x => x.sim), r = sm / Math.max(0.01, pl), ok = B.length >= need && r >= 0.9 && r <= 1.1; if (!ok) bad++;
    console.log(pad(lb, 16) + pad(B.length, 7) + pad(pl.toFixed(2), 8) + pad(sm.toFixed(2), 8) + pad(r.toFixed(3), 15) + (ok ? 'ok' : B.length < need ? 'MISS (fewer than ' + need + ' games)' : 'MISS')); }
  const by = {}; for (const x of P.am.concat(P.pro)) (by[x.sty] = by[x.sty] || []).push(x);
  console.log('by play style (amateur and pro together; a rough read at ' + Math.round(N / 6) + ' careers a style): ' + Object.entries(by).sort().map(([k, B]) => k + ' ' + (m(B, x => x.sim) / Math.max(0.01, m(B, x => x.eng))).toFixed(2) + ' (n' + B.length + ')').join(' · '));
  console.log('games won, played vs simmed: amateur ' + (100 * m(P.am, x => x.eng > x.engOpp ? 1 : 0)).toFixed(0) + '% / ' + (100 * m(P.am, x => x.simW)).toFixed(0) + '% · pro ' + (100 * m(P.pro, x => x.eng > x.engOpp ? 1 : 0)).toFixed(0) + '% / ' + (100 * m(P.pro, x => x.simW)).toFixed(0) + '% (for information: the sims keep their tuned odds, amWinP and the league model)');
  { const lv = [['high school', P.am.filter(x => x.st === 'hs')], ['college', P.am.filter(x => x.st === 'college')], ['pro', P.pro]].filter(([, B]) => B.length && B[0].bx); if (lv.length) console.log('box score a game, played / simmed (for information; §1.3 asks for points): ' + lv.map(([lb, B]) => lb + ' ' + ['reb', 'stl', 'blk', 'tpm'].map(k => k + ' ' + m(B, x => x.bx.e[k]).toFixed(2) + '/' + m(B, x => x.bx.s[k]).toFixed(2)).join(' ')).join(' · ')); }
  console.log((bad ? 'FAIL ' + bad + ' level(s) out of 0.90-1.10' : 'PASS every level within 10%') + ' · ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
  process.exit(bad ? 1 : 0);
});
