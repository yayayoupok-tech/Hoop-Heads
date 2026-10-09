// 3.0 (§0.2, §11): the scoring pace of career games. The career simulator plays the careers (two of each play style by
// default) and, before each of the first n high school, college and pro games you'd play, plays the same game in the
// engine with the AI at your controls (the career's own match options, finalized like a played game: Legends View, the
// running clock, the career's pace rules). Targets: 12-18 points a side (each level's mean over both sides) and games of
// 70-80 s (each level's median, the tip-off to the final whistle's beat).
// node tests/pace.js [careers=8] [seed=11] [n=40]
const { spawn } = require('child_process'), path = require('path');
const N = +(process.argv[2] || 8), seed = +(process.argv[3] || 11), n = +(process.argv[4] || 40);
const t0 = Date.now(); const p = spawn('node', [path.join(__dirname, 'careersim.js'), String(N), String(seed), '0', '--parity=' + n], { stdio: ['ignore', 'pipe', 'inherit'] });
let out = ''; p.stdout.on('data', d => { out += d; });
p.on('close', code => {
  const L = out.split('\n').find(l => l.startsWith('PARITYJSON '));
  if (!L) { console.log('FAIL the career simulator gave no games (exit ' + code + ')'); process.exit(1); }
  const all = JSON.parse(L.slice('PARITYJSON '.length)), games = [...all.am, ...all.pro].filter(g => g.len != null);
  const mean = A => A.length ? A.reduce((t, x) => t + x, 0) / A.length : 0, median = A => { const v = A.slice().sort((a, b) => a - b); return v.length ? (v[(v.length - 1) >> 1] + v[v.length >> 1]) / 2 : 0; };
  console.log('PACE (3.0 §0.2): ' + N + ' careers, seed ' + seed + ' · career games played in the engine with the AI at your controls · targets: 12-18 points a side (the mean), 70-80 s a game (the median)');
  console.log('level        games  you    opponent  a side  sides in 12-18  length (mean / median)  overtime');
  let bad = 0;
  for (const [lb, st] of [['high school', 'hs'], ['college', 'college'], ['pro', 'pro']]) {
    const G = games.filter(g => g.st === st); if (!G.length) { console.log(lb.padEnd(12) + ' no games'); bad++; continue; }
    const you = G.map(g => g.eng), opp = G.map(g => g.engOpp), side = you.concat(opp), len = G.map(g => g.len), inBand = side.filter(x => x >= 12 && x <= 18).length / side.length;
    const ok = mean(side) >= 12 && mean(side) <= 18 && median(len) >= 70 && median(len) <= 80; if (!ok) bad++;
    console.log(lb.padEnd(12) + ' ' + String(G.length).padEnd(6) + ' ' + mean(you).toFixed(1).padEnd(6) + ' ' + mean(opp).toFixed(1).padEnd(9) + ' ' + mean(side).toFixed(1).padEnd(7) + ' ' + ((inBand * 100).toFixed(0) + '%').padEnd(15) + ' ' + (mean(len).toFixed(1) + ' / ' + median(len).toFixed(1) + ' s').padEnd(23) + ' ' + ((G.filter(g => g.ot).length / G.length * 100).toFixed(0) + '%').padEnd(9) + ' ' + (ok ? 'PASS' : 'FAIL'));
  }
  console.log((bad ? 'FAIL ' + bad + ' level(s) off the pace' : 'PASS every level scores 12-18 a side in a 70-80 s game') + ' · ' + Math.round((Date.now() - t0) / 1000) + ' s');
  process.exit(bad ? 1 : 0);
});
