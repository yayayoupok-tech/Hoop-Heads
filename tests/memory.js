// 3.0 (§0.1, X1): memory over a long session. A pro career plays N games (50 by default), each against a new opponent
// (a new look and name, so new pictures to bake), the way a person plays them: the hub (the next game's bakes start
// there), TIP OFF, a few seconds of the game on screen, the rest fast-forwarded (the test's own work), the result and
// back to the hub. After each game it reads the renderer's memory from the operating system (the resident set of the
// browser's renderer and GPU processes: the page, its two bake workers and every canvas) after a forced garbage
// collection on the page and in the workers, and the caches' sizes on both sides (sprite sheets, shoe bakes, faces,
// portraits). Target (3.0 §11): the level after the last game within +150 MB of the level after game 5 (a level: the median of
// three readings in a row; one reading moves up to ±60 MB with what the allocator holds on to).
// Usage: node tests/memory.js [games=50] [--play=2500] [--phone]
const fs = require('fs');
const { launch, openPage } = require('./lib');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const N = +(process.argv.slice(2).find(x => /^\d+$/.test(x)) || 50), PLAY_MS = +arg('play', 2500), PHONE = process.argv.includes('--phone'), LIMIT_MB = 150, BASE_AT = 5;

// The browser's processes: the descendants of this node process, by their parent ids.
function descendants(root) {
  const kids = new Map(); for (const d of fs.readdirSync('/proc')) { if (!/^\d+$/.test(d)) continue; try { const st = fs.readFileSync('/proc/' + d + '/stat', 'utf8'), ppid = +st.slice(st.lastIndexOf(')') + 2).split(' ')[1]; if (!kids.has(ppid)) kids.set(ppid, []); kids.get(ppid).push(+d); } catch (e) { /* gone */ } }
  const out = [], q = [root]; while (q.length) { const p = q.shift(); for (const k of kids.get(p) || []) { out.push(k); q.push(k); } } return out;
}
function procInfo(pid) { try { const cmd = fs.readFileSync('/proc/' + pid + '/cmdline', 'utf8'), st = fs.readFileSync('/proc/' + pid + '/status', 'utf8'), m = /VmRSS:\s+(\d+) kB/.exec(st), t = /--type=([a-z-]+)/.exec(cmd); return { pid, type: t ? t[1] : 'browser', rss: m ? +m[1] / 1024 : 0 }; } catch (e) { return null; } }
function rendererMB() { const P = descendants(process.pid).map(procInfo).filter(Boolean), r = P.filter(p => p.type === 'renderer' || p.type === 'gpu-process'); return { mb: r.reduce((a, p) => a + p.rss, 0), n: r.length, renderer: r.filter(p => p.type === 'renderer').reduce((a, p) => a + p.rss, 0), gpu: r.filter(p => p.type === 'gpu-process').reduce((a, p) => a + p.rss, 0) }; }

(async () => {
  process.env.CHROMIUM_ARGS = ((process.env.CHROMIUM_ARGS || '') + ' --js-flags=--expose-gc').trim(); // (gc() on the page and in the workers: the readings are of live memory, not of garbage waiting)
  const b = await launch(); const P = await openPage(b, { phone: PHONE, wait: 1500 }); const { ev, page } = P; const wait = ms => page.waitForTimeout(ms);
  const until = async (f, ms, a) => { const t0 = Date.now(); for (;;) { const v = await ev(f, a); if (v) return v; if (Date.now() - t0 > ms) return null; await wait(50); } };
  const rows = []; let err = null; const t0 = Date.now();
  try {
    if (!await until(() => window.HH && HH.game && HH.game.ui && HH.game.ui.screen, 30000)) throw new Error('the game never started');
    // a pro career (Jump to pro: the test's own work)
    const made = await ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data; const a = amCreate(s, { name: 'Memory Test', look: PRESET_LOOKS[5], number: 3, style: 'slasher', seed: 3030 });
      const J = devJumpToPro(g, 3030); if (!J || !J.ok) return { err: 'jump: ' + JSON.stringify(J) }; if (!s.career) createCareerFromAmateur(s, a); g.save.save(); g.ui.clearTo(careerHub(g)); g.guard.force = 0; /* (the frame guard pinned at full quality: the fast-forward's long frames made it switch pixel sizes, and a game's second set of sheets and venues read as growth) */ return { ok: true, season: s.career.season }; });
    if (!made || !made.ok) throw new Error(JSON.stringify(made));
    await until(() => typeof BAKE !== 'undefined' && (BAKE.st === 'ready' || BAKE.st === 'failed' || BAKE.st === 'none'), 15000);
    const stats = async () => ev(() => new Promise(res => { const local = typeof bakeCacheStats === 'function' ? bakeCacheStats() : { sheets: RT_SHEETS.size }; if (typeof bakeAskBoth !== 'function' || !bakeLive()) return res({ main: local, worker: null, ui: null });
      let done = false; const fin = o => { if (!done) { done = true; res({ main: local, worker: o && o[0], ui: o && o[1] }); } }; setTimeout(() => fin(null), 4000); bakeAskBoth('stats', {}, fin); }));
    const gc = async () => { await ev(() => new Promise(res => { try { if (typeof gc === 'function') gc(); } catch (e) { /* not exposed */ } if (typeof bakeAskBoth !== 'function' || !bakeLive()) return res(); setTimeout(res, 3000); bakeAskBoth('gc', {}, () => res()); })); await wait(300); };
    for (let i = 1; i <= N; i++) {
      // this week's opponent is somebody new; you start (the depth chart is the test's own work); the hub
      const pre = await ev(i => { const g = HH.game, s = g.save.data, c = s.career; if (!c) return { err: 'no career' }; c.events.length = 0;
        let guard = 0; while (!userGame(c) && guard++ < 40) { c.events.length = 0; if (c.phase === 'offseason') { if (c.offseason && c.offseason.v === 2) lgOffseasonAuto(c, { fa: () => lgUserFaDefault(c), rebuild: true }); else { offseasonProgression(c); offseasonMoves(c); } newSeason(c); } else if (!simUserGame(s)) break; } /* (a season's end: its offseason the career simulator's way, then the next season) */
        const ug = userGame(c); if (!ug) return { err: 'no game this week (phase ' + c.phase + ', week ' + c.week + ')' };
        if (c.team && !isStarter(c)) { const id = ladderChallengeId(c); if (id) ladderTakeSpot(c, id); }
        const opp = c.players[opponentOf(c, ug)]; const rng = new RNG(9000 + i * 7919); opp.look = randomLook(rng); opp.name = 'Newface ' + i + ' ' + ['Okafor', 'Lindqvist', 'Moreau', 'Tanaka', 'Sowa', 'Brandt', 'Ibarra'][i % 7];
        g.hubTab = 'play'; g.ui.clearTo(careerHub(g)); try { bakeNextCareerGame(g, 1); } catch (e) { /* the hub asks for it too */ } return { ok: true, opp: opp.name, week: c.week, season: c.season };
      }, i);
      if (!pre || !pre.ok) throw new Error('game ' + i + ': ' + JSON.stringify(pre));
      await until(() => typeof BAKE === 'undefined' || !bakeLive() || (BAKE.q.length === 0 && BAKE.fly.size === 0), 20000); // (on the hub while the next game's bakes finish, as a person reads it)
      const go = await ev(() => { const g = HH.game, s = g.save.data, c = s.career, ug = userGame(c); if (!ug || !playsThisWeek(c)) return { err: 'not playing this week' }; proStartGame(c); const o = careerMatchOpts(c, s, ug, false); g.startMatch(o, { kind: 'career' }); return { ok: true }; });
      if (!go || !go.ok) throw new Error('game ' + i + ' start: ' + JSON.stringify(go));
      await until(() => HH.game.mode === 'match' && !HH.game.warming, 20000); await wait(PLAY_MS); // the game on screen
      const ff = await ev(() => { const g = HH.game, m = g.match; if (!m) return { err: 'no match' }; for (const p of m.players) if (p.controlled) { p.controlled = false; p.input.reset(); } let n = 0; while (!m.ended && n < 120 * 60 * 30) { simStep(m, STEP); n++; } return { ok: m.ended, n }; });
      if (!ff || !ff.ok) throw new Error('game ' + i + ' never ended: ' + JSON.stringify(ff));
      if (!await until(() => { const s = HH.game.ui.screen; return s && s.name === 'result'; }, 20000)) throw new Error('game ' + i + ': no result screen (' + await ev(() => HH.game.mode + '/' + (HH.game.ui.screen && HH.game.ui.screen.name)) + ')');
      await wait(400);
      const back = await ev(() => { const g = HH.game; for (let k = 0; k < 30; k++) { const s = g.ui.screen; if (!s) break; if (s.name === 'career') return { ok: true }; if (s.finish) s.finish(); const w = (s.widgets || []).find(w => !w.hidden && w.enabled !== false && w.onPress && (w.primary || /^(CONTINUE|Continue|GOT IT|Got it|OK|▼)$/.test(w.label || ''))) || (s.widgets || []).find(w => !w.hidden && w.enabled !== false && w.onPress); if (!w) { if (s.onTap) { s.onTap(0, 0); continue; } break; } w.onPress(); } const c = g.save.data.career; if (c) { c.events.length = 0; g.ui.clearTo(careerHub(g)); } return { ok: true, forced: true }; });
      if (!back || !back.ok) throw new Error('game ' + i + ': not back to the hub');
      await wait(300); await gc(); const M = rendererMB(), st = await stats();
      rows.push({ i, mb: M.mb, renderer: M.renderer, gpu: M.gpu, procs: M.n, opp: pre.opp, st, s: Math.round((Date.now() - t0) / 1000) });
      const W = st.worker || {}, Mn = st.main || {}, U = st.ui || {};
      console.log('game ' + String(i).padStart(2) + ' · ' + M.mb.toFixed(0).padStart(5) + ' MB (renderer ' + M.renderer.toFixed(0) + ', gpu ' + M.gpu.toFixed(0) + ') · sheets main ' + (Mn.sheets != null ? Mn.sheets : '?') + (Mn.poses != null ? ' (' + Mn.poses + ' poses)' : '') + ', worker ' + (W.sheets != null ? W.sheets + ' (' + W.poses + ' poses)' : '?') + ' · shoe bakes main ' + (Mn.shoes != null ? Mn.shoes : '?') + ', workers ' + (W.shoes != null ? W.shoes : '?') + '/' + (U.shoes != null ? U.shoes : '?') + ' · faces ' + (Mn.faces != null ? Mn.faces : '?') + '/' + (W.faces != null ? W.faces : '?') + ' · closed ' + (Mn.closed != null ? Mn.closed : '?') + ' · venues ' + (Mn.venueMB != null ? Mn.venueMB + '/' + (W.venueMB != null ? W.venueMB : '?') + ' MB' : '?') + ' · text ' + (Mn.textAtlases != null ? Mn.texts + ' strings in ' + Mn.textAtlases + ' atlases, ' + Mn.textMB + ' MB' : '?') + ' · crowds ' + (Mn.fans != null ? Mn.fans + '/' + (W.fans != null ? W.fans : '?') : '?') + ' · heap ' + (Mn.heapMB != null ? Mn.heapMB + ' MB' : '?') + ' · ' + Math.round((Date.now() - t0) / 1000) + ' s');
    }
  } catch (e) { err = e; }
  const errs = P.errors.concat(await P.frameErrors().catch(() => []));
  await b.close();
  if (err) { console.log('FAIL ' + (err.message || err)); if (errs.length) console.log('page errors: ' + errs.slice(0, 5).join(' | ')); process.exit(1); }
  const near = rows.filter(r => Math.abs(r.i - BASE_AT) <= 1).map(r => r.mb).sort((a, b) => a - b), baseMb = near.length ? near[near.length >> 1] : rows[0].mb; // the level after game 5: the median of games 4-6 (a reading moves ±40 MB with the allocator)
  const med3 = k => { const v = rows.slice(Math.max(0, k - 1), k + 2).map(r => r.mb).sort((a, b) => a - b); return v[v.length >> 1]; }; // a level: the median of three readings in a row
  const base = { i: BASE_AT, mb: baseMb }, last = rows[rows.length - 1], endMb = med3(rows.length - 2), peak = rows.reduce((a, r) => Math.max(a, r.mb), 0), grow = endMb - base.mb;
  let top = 0; for (let k = 0; k < rows.length; k++) if (rows[k].i > BASE_AT + 1) top = Math.max(top, med3(k)); const worst = top - base.mb;
  const slope = rows.length > BASE_AT + 2 ? (() => { const R = rows.filter(r => r.i >= BASE_AT), n = R.length, mx = R.reduce((a, r) => a + r.i, 0) / n, my = R.reduce((a, r) => a + r.mb, 0) / n; return R.reduce((a, r) => a + (r.i - mx) * (r.mb - my), 0) / Math.max(1e-9, R.reduce((a, r) => a + (r.i - mx) * (r.i - mx), 0)); })() : 0;
  console.log('memory (3.0 §0.1): ' + rows.length + ' career games against new opponents · the level after game ' + base.i + ' ' + base.mb.toFixed(0) + ' MB (games ' + (BASE_AT - 1) + '-' + (BASE_AT + 1) + ', median) · after game ' + last.i + ' ' + endMb.toFixed(0) + ' MB (the last three; ' + (grow >= 0 ? '+' : '') + grow.toFixed(0) + ' MB; target within +' + LIMIT_MB + ') · for information: the highest level on the way ' + top.toFixed(0) + ' MB (' + (worst >= 0 ? '+' : '') + worst.toFixed(0) + '), the highest reading ' + peak.toFixed(0) + ' MB, the trend ' + slope.toFixed(1) + ' MB a game');
  if (errs.length) console.log('page errors: ' + errs.slice(0, 5).join(' | '));
  const ok = grow <= LIMIT_MB && !errs.length; console.log((ok ? 'PASS' : 'FAIL') + ' memory after ' + last.i + ' games within +' + LIMIT_MB + ' MB of the level after game ' + base.i);
  process.exit(ok ? 0 : 1);
})();
