// Career simulator: whole careers from a 14-year-old freshman to retirement, played with Sim and sensible choices
// (headless, in the page). Usage: node tests/careersim.js [careers=40] [seed=1] [engineGames=0] [--each]
// [--set career.proMean=80 ...] (--set overrides a CONFIG value for a tuning run)
// Reports medians at ages 17/21/25, peak OVR, draft picks, titles, the Hall of Fame rate and any stuck states against the
// spec's targets.
const { launch, openPage } = require('./lib');
(async () => {
  const argv = process.argv.slice(2), sets = []; for (let i = 0; i < argv.length; i++) if (argv[i] === '--set') { sets.push(argv[i + 1]); argv.splice(i, 2); i--; }
  const args = argv.filter(a => !a.startsWith('--')); const N = +(args[0] || 40), seed0 = +(args[1] || 1), engineGames = +(args[2] || 0);
  const browser = await launch(); const P = await openPage(browser); const page = P.page; const errors = P.errors;
  if (sets.length) console.log('overrides: ' + (await page.evaluate(sets => sets.map(kv => { const [path, v] = kv.split('='); const keys = path.split('.'); let o = CONFIG; for (const k of keys.slice(0, -1)) o = o[k]; o[keys[keys.length - 1]] = JSON.parse(v); return path + ' = ' + v; }).join(', '), sets)));
  const out = await page.evaluate(({ N, seed0, engineGames }) => {
    const styles = Object.keys(AM_STYLES); const results = [];
    const fakeBox = (c, g) => { const rng = careerRng(c); const r = simBox(c, g.h, g.a, rng); const toP = id => { const s = r.box[id]; return Object.assign({ name: c.players[id].name }, makeStats(), { pts: s.pts, fgm: s.fgm, fga: s.fga, tpm: s.tpm, tpa: s.tpa, reb: s.reb, stl: s.stl, blk: s.blk, to: s.to, dunkM: s.dunk, dunkA: s.dunk, layM: Math.max(0, Math.round((s.fgm - s.tpm - s.dunk) * 0.5)), layA: Math.max(0, Math.round((s.fga - s.tpa - s.dunk) * 0.5)), ankles: s.ank, moves: 20 }); }; const meH = g.h === c.meId; const opp = meH ? g.a : g.h; return { teams: [{ score: meH ? r.hs : r.as, players: [toP(c.meId)] }, { score: meH ? r.as : r.hs, players: [toP(opp)] }], overtime: r.ot }; };
    for (let n = 0; n < N; n++) {
      const save = defaultSave(); const style = styles[n % styles.length]; const inv = []; const ages = {}; let guard = 0, engineUsed = 0;
      const a = amCreate(save, { name: 'Sim Player', look: PRESET_LOOKS[n % 16], number: 7, style, seed: (seed0 * 7919 + n * 104729) >>> 0, seasonLength: 11, gameLength: 120 });
      const rec = { style, heightFinal: a.heightFinal, bloom: a.bloom, ovr: {}, pick: null, draftAge: null, college: null, tier: null, proSeasons: 0, titles: 0, mvps: 0, legacy: 0, hof: false, peak: 0, peakAge: 0, retireAge: null, amTitles: 0, h14: a.height, stuck: false, injuries: 0, plans: {}, fat: [], press: 0 };
      const note = (age, ovr) => { if (ages[age] == null) ages[age] = ovr; if (ovr > rec.peak) { rec.peak = ovr; rec.peakAge = age; } };
      // amateur years
      while (!a.handedOff && guard++ < 400) {
        for (const e of a.events) if (e.kind === 'press') { pressAuto(a, e); rec.press++; } a.events.length = 0; note(a.age, amOvr(a));
        if (a.stage === 'combine') { rec.hype = a.hype || 0; rec.dscore = +amDraftScore(a).toFixed(1); rec.draftAge = a.age; rec.college = a.college || '(none)'; rec.tier = a.collegeTier; rec.amTitles = a.titles; createCareerFromAmateur(save, a); break; }
        if (a.decision) { const d = a.decision; if (d.kind === 'college') { const skip = d.offers.find(o => o.draft); const proj = amPickFrom(amDraftScore(a)); amChooseCollege(a, skip && proj <= 10 ? skip : d.offers[0]); } else amDeclare(a, amPickFrom(amDraftScore(a)) <= 30 || a.stageYear >= 3); continue; }
        { const g = amNext(a); if (g && g.opp && !(a.wk && a.wk.done)) { if (a.fatigue >= 40 || a.injury) amRest(a); else if (g.opp.rival || g.playoff) amFilm(a); else amPractice(a, a.focus, 'normal', amSessionXp(a, 'normal')); } } // the week: rest when tired, film for big games, else practice
        const r = amSimGame(a); if (!r) { inv.push('amateur: no game and no decision, stage ' + a.stage + ' year ' + a.stageYear); break; }
        if (!(a.fatigue >= 0 && a.fatigue <= 100)) inv.push('amateur fatigue out of range ' + a.fatigue); if (r && r.wk) { if (r.wk.injury) rec.injuries++; rec.plans[r.wk.plan] = (rec.plans[r.wk.plan] || 0) + 1; }
      }
      const c = save.career; if (!c) { rec.stuck = true; rec.inv = inv.concat(['never reached the pros']); results.push(rec); continue; }
      const me = meOf(c); rec.pick = me.draftPick; note(me.age, recOvr(me));
      while (c.phase !== 'retired' && guard++ < 4000) {
        if (c.phase === 'regular' || c.phase === 'playoffs') {
          const g = userGame(c); if (!g) { inv.push('no user game in phase ' + c.phase + ' week ' + c.week); break; }
          if (!(c.me.wk && c.me.wk.done)) { if (c.me.fatigue >= 40 || c.me.injury) proRest(c); else if (opponentOf(c, g) === c.rivalId || g.playoff) proFilm(c); else proPractice(c, c.me.focus, 'normal', proSessionXp(c, c.me.focus, 'normal')); } // the week: rest when tired, film for big games, else practice
          rec.plans[c.me.wk.done] = (rec.plans[c.me.wk.done] || 0) + 1; rec.fat.push(c.me.fatigue);
          if (c.allStar && c.allStar.invited && !c.allStar.done) finishAllStar(c, 12);
          const res = engineUsed < engineGames ? (engineUsed++, simUserGame(save)) : careerAfterGame(save, fakeBox(c, g), 0, true);
          if (!res) { inv.push('careerAfterGame returned null'); break; } if (res.wk && res.wk.injury) rec.injuries++; for (const e of c.events || []) if (e.kind === 'press') { pressAuto(c, e); rec.press++; } if (c.events) c.events.length = 0;
          for (const id of c.active) { const p = c.players[id]; for (const k of RATING_KEYS) if (!isFinite(p.r[k]) || p.r[k] < CR.ratingMin - 0.01 || p.r[k] > CR.ratingMax + 0.01) inv.push('rating out of range ' + p.name + ' ' + k + ' ' + p.r[k]); }
          if (c.active.length !== CR.leagueSize) inv.push('league size ' + c.active.length);
          if (!isFinite(c.me.money)) inv.push('money NaN');
        } else if (c.phase === 'offseason') {
          rec.proSeasons++; note(me.age, recOvr(me)); { const o = c.active.filter(id => id !== c.meId).map(id => recOvr(c.players[id])).sort((x, y) => y - x); (rec.lg || (rec.lg = [])).push([+(o.reduce((x, y) => x + y, 0) / o.length).toFixed(1), o[0], o[2]]); }
          offseasonProgression(c); offseasonMoves(c); const offers = offseasonContract(c); if (offers) acceptContract(c, offers.findIndex(x => x.salary === Math.max(...offers.map(q => q.salary))));
          note(me.age, recOvr(me));
          if (mustRetire(c) || (canRetire(c) && me.age >= 34 && recOvr(me) < 68)) { rec.retireAge = me.age; retireCareer(save); break; }
          newSeason(c);
        } else { inv.push('unknown phase ' + c.phase); break; }
      }
      if (guard >= 4000) { rec.stuck = true; inv.push('guard hit'); }
      const L = c.legacy || legacyOf(c); rec.L = { titles: L.titles, mvps: L.mvps, allL: L.allL, seasons: L.seasons, pts: Math.round(L.pts / CR.legacy.ptsPer), ppg: +(L.ppg || 0).toFixed(1) }; rec.titles = L.titles; rec.mvps = L.mvps; rec.legacy = L.score; rec.hof = L.hof; rec.ovr = ages; rec.inv = inv.slice(0, 5); rec.hFinal = me.h;
      results.push(rec);
    }
    return results;
  }, { N, seed0, engineGames });
  const med = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
  const at = age => med(out.map(r => r.ovr[age]));
  console.log('careers', out.length, '· stuck', out.filter(r => r.stuck || (r.inv && r.inv.length)).length);
  console.log('median OVR at 14/17/21/25/29/33:', [14, 17, 21, 25, 29, 33].map(at).join(' / '));
  console.log('peak OVR median', med(out.map(r => r.peak)), '· peak age median', med(out.map(r => r.peakAge)), '· peak range', Math.min(...out.map(r => r.peak)) + '–' + Math.max(...out.map(r => r.peak)));
  const picks = out.map(r => r.pick).filter(x => x != null); console.log('draft picks: #1 ×' + picks.filter(p => p === 1).length + ' · top 5 ×' + picks.filter(p => p <= 5).length + ' · 1st round ×' + picks.filter(p => p <= 30).length + ' · 2nd round ×' + picks.filter(p => p > 30 && p <= 60).length + ' · undrafted ×' + picks.filter(p => p > 60).length + ' · median ' + med(picks));
  console.log('draft age median', med(out.map(r => r.draftAge)), '· skipped college', out.filter(r => r.college === '(none)').length);
  console.log('pro titles: mean ' + (out.reduce((a, r) => a + r.titles, 0) / out.length).toFixed(2) + ' · careers with a title ' + out.filter(r => r.titles > 0).length + ' · MVPs mean ' + (out.reduce((a, r) => a + r.mvps, 0) / out.length).toFixed(2));
  console.log('Hall of Fame: ' + out.filter(r => r.hof).length + ' of ' + out.length + ' (' + Math.round(100 * out.filter(r => r.hof).length / out.length) + '%) · legacy median ' + med(out.map(r => r.legacy)) + ' · pro seasons median ' + med(out.map(r => r.proSeasons)) + ' · retire age median ' + med(out.map(r => r.retireAge)));
  for (const sIdx of [0, 4, 9, 14]) { const rows = out.map(r => r.lg && r.lg[sIdx]).filter(Boolean); if (rows.length) console.log('league (others) after pro season ' + (sIdx + 1) + ': mean OVR ' + (rows.reduce((a, r) => a + r[0], 0) / rows.length).toFixed(1) + ' · best ' + (rows.reduce((a, r) => a + r[1], 0) / rows.length).toFixed(1) + ' · 3rd best ' + (rows.reduce((a, r) => a + r[2], 0) / rows.length).toFixed(1) + ' (n=' + rows.length + ')'); }
  console.log('draft score median ' + med(out.map(r => r.dscore)) + ' · range ' + Math.min(...out.map(r => r.dscore || 0)).toFixed(0) + '–' + Math.max(...out.map(r => r.dscore || 0)).toFixed(0));
  console.log('heights: final median ' + med(out.map(r => r.hFinal)) + ' · at 14 median ' + med(out.map(r => r.h14)));
  { const P = { practice: 0, rest: 0, film: 0 }; for (const r of out) for (const k in r.plans) P[k] = (P[k] || 0) + r.plans[k]; const tot = P.practice + P.rest + P.film || 1; const fat = [].concat(...out.map(r => r.fat)); const mean = fat.length ? fat.reduce((x, y) => x + y, 0) / fat.length : 0; console.log('the week: practice ' + Math.round(100 * P.practice / tot) + '% · rest ' + Math.round(100 * P.rest / tot) + '% · film ' + Math.round(100 * P.film / tot) + '% · pro fatigue at tip-off: mean ' + mean.toFixed(1) + ', max ' + (fat.length ? Math.max(...fat) : 0) + ' · injuries per career: mean ' + (out.reduce((x, r) => x + r.injuries, 0) / out.length).toFixed(1)); console.log('press questions per career: mean ' + (out.reduce((x, r) => x + r.press, 0) / out.length).toFixed(1) + ' · hype at the draft: median ' + med(out.map(r => r.hype))); }
  if (process.argv.includes('--each')) for (const r of out) console.log(JSON.stringify({ style: r.style, h: r.hFinal, pick: r.pick, dAge: r.draftAge, col: r.college, ovr: r.ovr, peak: r.peak + '@' + r.peakAge, t: r.titles, mvp: r.mvps, leg: r.legacy, hof: r.hof, ret: r.retireAge, inv: r.inv }));
  { const part = (rows, k) => rows.length ? (rows.reduce((a, r) => a + (r.L ? r.L[k] : 0), 0) / rows.length).toFixed(1) : '–'; const H = out.filter(r => r.hof), N = out.filter(r => !r.hof); console.log('legacy parts (Hall of Fame / the rest): titles ' + part(H, 'titles') + ' / ' + part(N, 'titles') + ' · MVPs ' + part(H, 'mvps') + ' / ' + part(N, 'mvps') + ' · All-League 1st ' + part(H, 'allL') + ' / ' + part(N, 'allL') + ' · seasons ' + part(H, 'seasons') + ' / ' + part(N, 'seasons') + ' · points/250 ' + part(H, 'pts') + ' / ' + part(N, 'pts') + ' · PPG ' + part(H, 'ppg') + ' / ' + part(N, 'ppg') + ' · peak ' + med(H.map(r => r.peak)) + ' / ' + med(N.map(r => r.peak))); const pk = out.map(r => r.peak).sort((x, y) => x - y); console.log('peak percentiles 10/25/50/75/90: ' + [0.1, 0.25, 0.5, 0.75, 0.9].map(q => pk[Math.floor(q * (pk.length - 1))]).join(' / ')); }
  const invs = out.filter(r => r.inv && r.inv.length).slice(0, 5).map(r => r.inv); if (invs.length) console.log('invariants', JSON.stringify(invs));
  const pct = x => Math.round(100 * x);
  const hof = out.filter(r => r.hof).length / out.length, titles = out.reduce((a, r) => a + r.titles, 0) / out.length, stuck = out.filter(r => r.stuck || (r.inv && r.inv.length)).length;
  const inR = (v, lo, hi) => v != null && v >= lo && v <= hi ? '✓' : '✗';
  console.log('TARGETS: OVR@17 ' + at(17) + ' (55–60) ' + inR(at(17), 55, 60) + ' · OVR@21 ' + at(21) + ' (66–70) ' + inR(at(21), 66, 70) + ' · OVR@25 ' + at(25) + ' (74–78) ' + inR(at(25), 74, 78) + ' · peak ' + med(out.map(r => r.peak)) + ' (76–80) ' + inR(med(out.map(r => r.peak)), 76, 80) + ' · titles/career ' + titles.toFixed(2) + ' (~1) ' + inR(titles, 0.7, 1.3) + ' · HOF ' + pct(hof) + '% (10–20%) ' + inR(pct(hof), 10, 20) + ' · stuck ' + stuck + ' (0) ' + (stuck ? '✗' : '✓'));
  console.log('errors', errors.slice(0, 5)); await browser.close(); process.exitCode = errors.length || stuck ? 1 : 0;
})();
