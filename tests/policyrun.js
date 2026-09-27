// R8: runs the career simulator once per policy (the same careers for every policy: the same seeds, in chunks run in
// parallel) and reports the means of legacy, career earnings and pro titles. Used by pressbalance.js and hypebalance.js.
const { spawn } = require('child_process'); const path = require('path');
const CHUNK = 50; // careers per simulator run
function runSim(args) { return new Promise(res => { const p = spawn('node', [path.join(__dirname, 'careersim.js')].concat(args, ['--json'])); let out = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d); p.on('close', () => { const line = out.split('\n').find(l => l.startsWith('JSON ')); res(line ? JSON.parse(line.slice(5)) : { error: out.slice(-400) }); }); }); }
// policies: [{ id, label, args: [...] }]. Returns { id: { n, legacy, money, titles, hof, hype, stuck, errors } } (means).
async function runPolicies(policies, N, seed, par) {
  const jobs = []; for (const pol of policies) for (let k = 0; k * CHUNK < N; k++) jobs.push({ pol, n: Math.min(CHUNK, N - k * CHUNK), seed: seed * 1000 + k });
  const raw = {}; for (const p of policies) raw[p.id] = { legacy: [], titles: [], money: [], hype: [], hof: 0, stuck: 0, errors: [] };
  const queue = jobs.slice(); await Promise.all(Array.from({ length: par }, async () => { while (queue.length) { const j = queue.shift(); const r = await runSim([String(j.n), String(j.seed), '0'].concat(j.pol.args)); const R = raw[j.pol.id]; if (r.error) { R.errors.push(r.error); continue; } R.legacy.push(...r.legacy); R.titles.push(...r.titles); R.money.push(...r.money); R.hype.push(...(r.hype || [])); R.hof += r.hof; R.stuck += r.stuck; } }));
  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0, out = {};
  for (const p of policies) { const R = raw[p.id]; out[p.id] = { n: R.legacy.length, legacy: mean(R.legacy), money: mean(R.money), titles: mean(R.titles), hof: R.legacy.length ? R.hof / R.legacy.length : 0, hype: mean(R.hype), stuck: R.stuck, errors: R.errors }; }
  return out;
}
const pct = v => (v >= 0 ? '+' : '−') + Math.abs(100 * v).toFixed(1) + '%';
module.exports = { runPolicies, pct };
