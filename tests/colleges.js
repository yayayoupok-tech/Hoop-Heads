// 2.1 §2.1 (W3), as 3.0 left it: every college, browsable. The 64 programs (8 conferences of 8, the same 64 the
// national tournament uses) and what each one has: a place, colors and a pixel crest, an arena, a tier and prestige, a
// coach (style, tenure, hot seat), a GPA line, facilities, an NIL market, the depth chart you'd join, history (titles,
// pros); 3.0 §1 took the majors and the rivals. Per career, from the seed: coaches, rosters, the recruits chasing the
// scholarship spots, interest in you. The college list (3.0 §1, §8: all 64 ranked, no search or filters), a program's
// page with "Your chances" (X9: a held spot), recruiting in high school (3.0 §2.1: a card and a button on HOME open the
// recruiting board, 2.1's RECRUIT tab; Colleges on LEAGUE), the same on a phone, the Codex page; offers, your team, your
// conference and the national field come from the registry; old saves keep their program.
// node tests/colleges.js   (ONLY=<regex> runs the matching steps)
const { launch, openPage, runner } = require('./lib');
const path = require('path'), fs = require('fs');

// Installed on each page: a high school career (sophomore by default) with its team; a college career at a program
// (by id); the strings one synchronous UI draw shows, and the ones it cuts to fit.
const LIB = `
window.tMkHs = (seed, year) => { const g = HH.game, a = amCreate(defaultSave(), { name: 'College Test', look: PRESET_LOOKS[seed % 16], number: 4, style: 'slasher', seed }); hsSimTryout(a); a.events.length = 0; a.stageYear = year || 2; g.save.data.c1 = a; g.save.data.career = null; return a; };
window.tMkCol = (seed, pid) => { const a = tMkHs(seed, 4); for (const k of RATING_KEYS) a.r[k] = Math.max(a.r[k], 64); a.gpa = 3.5; a.offers = []; hsOfferCheck(a, amRng(a), 'final'); a.events.length = 0; amStartRecruiting(a, amRng(a)); a.events.length = 0;
  let o = a.decision.offers.find(x => !x.draft && (!pid || x.pid === pid)); if (!o) { o = colOfferFrom(a, colProg(pid), 'final'); a.decision.offers.push(o); } amChooseCollege(a, o); a.events.length = 0; return a; };
window.tTexts = g => { g.ui.trans = null; RBF.boxes = []; let X = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { X = RBF.boxes || []; RBF.boxes = null; } return X.map(x => String(x.t)).join(' | '); };
window.tCut = g => { g.ui.trans = null; RBF.boxes = []; let X = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { X = RBF.boxes || []; RBF.boxes = null; } return X.filter(x => x.cut).map(x => '"' + x.cut + '" → "' + x.t + '"'); };
window.tSmall = g => { const ui = g.ui, s = ui.screen; return (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && w.kind !== 'text' && (w.w * ui.scale < 63.5 || w.h * ui.scale < 63.5)).map(w => (w.label || w.kind) + ' ' + Math.round(w.w * ui.scale) + '×' + Math.round(w.h * ui.scale)); };
`;
const OLD_NAMES = ['Pine Ridge College', 'Eastbrook College', 'Lakeshore Tech', 'Harbor City University', 'Granite Valley State', 'Northgate University', 'Riverside State', 'Summit A&M', 'Coastal University', 'Royal Oak University', 'Kingsbridge University',
  'Bayside State', 'Ironwood College', 'Cedar Falls University', 'Redcliff A&M', 'Silver Lake University', 'Hollow Creek State', 'Westmark College', 'Northshore Tech', 'Juniper State', 'Stonebridge University', 'Ashford University', 'Whitcombe College', 'Larkspur Institute'];

(async () => {
  const b = await launch(); const R = runner('colleges');
  const P = await openPage(b, { wait: 900 }); const { ev } = P; await ev(src => { (0, eval)(src); }, LIB);

  await R.step('the registry: 64 programs in 8 conferences of 8 (3 power, 2 mid-major, 2 small, the Laurel League); every field there and sane; no rivals (3.0 §1); 5 blue bloods; the 24 names from before 2.1', () => ev(OLD => {
    const bad = []; if (COLLEGES.length !== 64) bad.push('programs ' + COLLEGES.length); if (COL_CONFS.map(q => q.kind).join() !== 'power,power,power,mid,mid,small,small,academic') bad.push('kinds ' + COL_CONFS.map(q => q.kind));
    for (let k = 0; k < COL_CONFS.length; k++) { const M = colMembers(k); if (M.length !== 8) bad.push(COL_CONFS[k].name + ' has ' + M.length); if (new Set(M.map(q => q.colors.join())).size !== M.length) bad.push(COL_CONFS[k].name + ' shares colors'); }
    if (new Set(COLLEGES.map(q => q.id)).size !== 64 || new Set(COLLEGES.map(q => q.name)).size !== 64) bad.push('ids or names repeat');
    for (const q of COLLEGES) { const f = [];
      if (!q.city || !COL_STATES[q.st]) f.push('place'); if (!q.colors.every(x => /^#[0-9A-F]{6}$/i.test(x)) || q.colors[0] === q.colors[1]) f.push('colors'); if (!q.arena) f.push('arena');
      if (![0, 1, 2, 3].includes(q.tier) || !(q.stars >= 1 && q.stars <= 5) || !(q.fac >= 1 && q.fac <= 5) || ![0, 1, 2].includes(q.nil)) f.push('tier/stars/fac/nil');
      if (!(Number.isInteger(q.titles) && q.titles >= 0 && Number.isInteger(q.pros) && q.pros >= 0)) f.push('history');
      if (q.rival != null) f.push('a rival (3.0 §1: rivals, all of them, are gone)'); if (q.academic !== (COL_CONFS[q.conf].kind === 'academic')) f.push('academic');
      if (!(q.x >= 0 && q.x <= 100 && q.y >= 0 && q.y <= 60)) f.push('map'); if (!colTierLabel(q) || !(colGpaReq(q) > 0)) f.push('labels');
      if (f.length) bad.push(q.id + ': ' + f.join(',')); }
    const blue = COLLEGES.filter(q => q.tier === 3).map(q => q.id).sort().join(); if (blue !== 'kingsbridge,marlowe,royaloak,thornfield,vallance') bad.push('blue bloods ' + blue);
    const miss = OLD.filter(n => !colProgByName(n)); if (miss.length) bad.push('missing old names: ' + miss.join(', '));
    const byKind = k => COLLEGES.filter(q => COL_CONFS[q.conf].kind === k); if (byKind('power').some(q => q.tier < 2) || byKind('mid').some(q => q.tier !== 1) || byKind('small').some(q => q.tier !== 0)) bad.push('a tier outside its conference kind');
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | '));
    return COLLEGES.length + ' programs · ' + COL_CONFS.map(q => q.short).join(', ') + ' · ' + COLLEGES.reduce((s, q) => s + q.titles, 0) + ' titles · ' + Object.keys(COL_STATES).length + ' states';
  }, OLD_NAMES), P);

  await R.step('crests: every program has a 16×18 pixel crest in its colors (blue bloods a crown, the Laurel League a book) that draws at any size; the marks vary', () => ev(() => {
    const bad = [], marks = new Set(), cv = document.createElement('canvas'); cv.width = 120; cv.height = 120; const ctx = cv.getContext('2d'), hex = x => x.toString(16).padStart(2, '0');
    for (const q of COLLEGES) { const c = colCrestCanvas(q); if (c.width !== 16 || c.height !== 18) bad.push(q.id + ' size'); const d = c.getContext('2d').getImageData(0, 0, 16, 18).data; let has = false;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] && ('#' + hex(d[i]) + hex(d[i + 1]) + hex(d[i + 2])).toUpperCase() === q.colors[0].toUpperCase()) { has = true; break; } if (!has) bad.push(q.id + ' color');
      const m = colCrestMark(q); marks.add(m); if (q.tier === 3 && m !== 'crown') bad.push(q.id + ' no crown'); if (q.academic && m !== 'book') bad.push(q.id + ' no book');
      try { drawColCrest(ctx, q, 4, 4, 32); drawColCrest(ctx, q, 4, 4, 100); } catch (e) { bad.push(q.id + ' draw: ' + e.message); } }
    if (marks.size < 7) bad.push('only ' + marks.size + ' marks'); if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return marks.size + ' marks: ' + [...marks].join(', ');
  }), P);

  await R.step('coaches (per career, from the seed): a name, a portrait, a style (Pace / Defense / Development / Iso), a tenure; the same seed the same coach, another seed another; a hot seat about 15% a season from a third; some are let go; your program\'s coach stays', () => ev(() => {
    const a = tMkHs(11), a2 = tMkHs(12), bad = []; let same = 0, hot = 0, n = 0, fresh = 0;
    for (const q of COLLEGES) { const co = colCoach(a, q.id); if (!co || !/\S+ \S+/.test(co.name) || !co.look || !COL_SYS[co.sys] || !(co.tenure >= 1) || typeof co.hot !== 'boolean' || !(co.age >= 36)) bad.push(q.id + ' ' + JSON.stringify(co).slice(0, 80));
      _colMemo.clear(); if (JSON.stringify(colCoach(a, q.id)) !== JSON.stringify(co)) bad.push(q.id + ' changes'); if (colCoach(a2, q.id).name === co.name) same++; }
    const styles = new Set(COLLEGES.map(q => colCoach(a, q.id).sys)); if (styles.size !== 4) bad.push('styles ' + [...styles]);
    for (let s = 1; s <= 12; s++) { a.season = s; _colMemo.clear(); for (const q of COLLEGES) { const co = colCoach(a, q.id); if (co.tenure >= 3) { n++; if (co.hot) hot++; } if (co.gen > 0 && co.tenure === 1) fresh++; } }
    const share = hot / Math.max(1, n); if (share < 0.07 || share > 0.25) bad.push('hot seat ' + share.toFixed(3)); if (!fresh) bad.push('nobody is let go in 12 seasons'); if (same > 4) bad.push(same + ' coaches the same for another seed');
    const c = tMkCol(13, 'riverside'), pid = c.program.pid, k0 = colCoach(c, pid); if (pid !== 'riverside' || !c.cw || !c.cw.keep || !c.cw.keep[pid] || c.team.coach.name !== colCoachTitle(k0)) bad.push('your coach is not kept: ' + pid + ' ' + JSON.stringify(c.cw));
    const s0 = c.season; for (let s = s0 + 1; s < s0 + 8; s++) { c.season = s; _colMemo.clear(); if (colCoach(c, pid).name !== k0.name) bad.push('your coach changed in season ' + s); } c.season = s0;
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'hot seat ' + (100 * share).toFixed(1) + '% (a third season on) · ' + fresh + ' new coaches in 12 seasons · the same coach for another seed ' + same + '/64';
  }), P);

  await R.step('interest (high school only): integers 0–100, the same every time; none in college or the pros; a better player draws more from the programs above (2.1: the small schools far below don\'t reach up); under a program\'s GPA line at most 20; home nearby helps; the stages (25 / 50 / 70)', () => ev(() => {
    const a = tMkHs(21, 3), bad = [], all = () => COLLEGES.map(q => colInterest(a, q.id)); a.gpa = 3.6; const v0 = all();
    if (v0.some(v => !Number.isInteger(v) || v < 0 || v > 100)) bad.push('range ' + v0.filter(v => !Number.isInteger(v) || v < 0 || v > 100).slice(0, 3)); _colMemo.clear(); if (all().join() !== v0.join()) bad.push('not stable');
    for (const k of RATING_KEYS) a.r[k] += 8; _colMemo.clear(); const v1 = all(), up = COLLEGES.map((q, i) => i).filter(i => COLLEGES[i].tier >= 2), sum = (V, I) => I.reduce((s, i) => s + V[i], 0); if (sum(v1, up) <= sum(v0, up) || up.some(i => v1[i] < v0[i] - 1)) bad.push('a better player draws no more from the power programs: ' + sum(v0, up) + ' → ' + sum(v1, up)); for (const k of RATING_KEYS) a.r[k] -= 8;
    a.gpa = 2.3; _colMemo.clear(); const capped = COLLEGES.filter(q => colGpaReq(q) > 2.3); if (!capped.length || capped.some(q => colInterest(a, q.id) > COLG.interest.gpaCap)) bad.push('under the GPA line: ' + capped.map(q => colInterest(a, q.id)).slice(0, 5));
    a.gpa = 3.6; _colMemo.clear(); const q = COLLEGES.find(x => x.tier === 1), h0 = a.home; a.home = { st: q.st, x: q.x, y: q.y }; _colMemo.clear(); const near = colInterest(a, q.id); a.home = { st: 'halcyon', x: q.x > 50 ? 2 : 98, y: q.y > 30 ? 2 : 58 }; _colMemo.clear(); const far = colInterest(a, q.id); a.home = h0;
    if (!(near > far)) bad.push('near ' + near + ' vs far ' + far); if (colMiles({ home: { st: q.st, x: q.x, y: q.y } }, q) !== 0) bad.push('miles from itself');
    const S = COLG.stages; if ([0, S[0], S[1], S[2]].map(v => colStage(v)).join() !== 'Not interested,Watching,Contacted,Offer range' || colStage(80, 0) !== 'Spots full' || colStage(10, 1, true) !== 'Offered') bad.push('stages');
    const c = tMkCol(22); if (COLLEGES.some(x => colInterest(c, x.id) !== null)) bad.push('interest in college');
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); const W = v0.filter(v => v >= S[0]).length, O = v0.filter(v => v >= S[2]).length; return 'a junior: ' + W + ' programs watching or more, ' + O + ' in offer range · near ' + near + ' / far ' + far;
  }), P);

  await R.step('the college list (3.0 §1, §8: no search keyboard, no filters): all 64 programs, each once, ranked by prestige (its stars now), then level (blue bloods first), then name; a program\'s stars follow its rankings (X4); the same list in college; the list keeps only its page', () => ev(() => {
    const g = HH.game, a = tMkHs(31, 3), bad = [], L = colRankList(), ids = L.map(q => q.id);
    if (L.length !== 64 || new Set(ids).size !== 64 || COLLEGES.some(q => !ids.includes(q.id))) bad.push('the list: ' + L.length + ' (' + new Set(ids).size + ' distinct)');
    const sn = colStarsNow, before = (p, q) => sn(p) > sn(q) || (sn(p) === sn(q) && (p.tier > q.tier || (p.tier === q.tier && p.name < q.name))), at = L.findIndex((q, i) => i > 0 && !before(L[i - 1], q)); if (at > 0) bad.push('out of order at #' + (at + 1) + ': ' + L[at - 1].name + ' before ' + L[at].name);
    if (ids.slice(0, 5).sort().join() !== 'kingsbridge,marlowe,royaloak,thornfield,vallance') bad.push('the first five: ' + ids.slice(0, 5));
    colWorld(a).stars = { pineridge: 5, royaloak: 4 }; const L2 = colRankList().map(q => q.id), i5 = L2.indexOf('pineridge'), i4 = L2.indexOf('royaloak'); a.cw.stars = {}; if (i5 !== 4 || i4 !== 5) bad.push('the rankings\' stars: Pine Ridge at 5★ #' + (i5 + 1) + ', Royal Oak at 4★ #' + (i4 + 1));
    tMkCol(32); if (colRankList().map(q => q.id).join() !== ids.join()) bad.push('another list in college');
    g.colBrowse = null; const st = colBrowseState(g); if (Object.keys(st).join() !== 'page') bad.push('the list keeps ' + Object.keys(st)); const old = ['colBrowseList', 'colBrowseFilterCount', 'colFiltersScreen'].filter(f => typeof window[f] === 'function'); if (old.length) bad.push('2.x filters: ' + old.join(', '));
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'by stars 5/4/3/2/1: ' + [5, 4, 3, 2, 1].map(s => L.filter(q => sn(q) === s).length).join('/') + ' · #1 ' + L[0].name + ', #64 ' + L[63].name + ' · moved to 5★, Pine Ridge College ranks #' + (i5 + 1);
  }), P);

  await R.step('the college list (desktop): 8 rows a page, ranked #1 to #64, with crest, name, place, conference, tier, stars, miles, your interest and its stage; no filters, sort or search (3.0 §1); ◀ Prev / Next ▶ page through 8 pages and wrap, clear of Back (X9); a row opens its program\'s page, ◀ Previous / Next ▶ there walk the ranked list', () => ev(() => {
    const g = HH.game, a = tMkHs(41, 3), bad = [], L = colRankList(), per = COLG.pageRows.desk; g.colBrowse = null; g.hubTab = 'home'; g.ui.clearTo(amHub(g)); g.ui.push(collegeBrowserScreen(g)); const s = g.ui.screen; if (s.name !== 'colbrowser') throw new Error('screen ' + s.name);
    const rows = () => s.widgets.filter(w => /^Program/.test(w.label) && w.prog && !w.hidden), ids = W => W.map(w => w.prog.id).join(), labels = s.widgets.filter(w => !w.hidden).map(w => w.label), btns = ['◀ Prev', 'Next ▶', 'Back'].map(l => s.widgets.find(w => w.label === l && !w.hidden));
    btns.forEach((b, i) => { if (!b) bad.push('no ' + ['◀ Prev', 'Next ▶', 'Back'][i]); }); const old = labels.filter(l => /^(Conference|Tier|Stars|GPA|Miles|Sort|Interested in me|Search|Clear filters|Filters)/.test(l)); if (old.length) bad.push('2.x controls: ' + old.join(', '));
    const B = btns.filter(Boolean), hit = (p, q) => p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h; if (B.some((p, i) => B.some((q, j) => j > i && hit(p, q)))) bad.push('the buttons overlap');
    if (ids(rows()) !== L.slice(0, per).map(q => q.id).join()) bad.push('page 1: ' + ids(rows()));
    const T = tTexts(g), first = L[0]; for (const t of ['RANK', 'PROGRAM', 'CONFERENCE', 'STARS', 'INTEREST', '#1', '#' + per, 'Page 1 / 8', first.name, colPlace(first), COL_CONFS[first.conf].short, colTierShort(first), String(colInterest(a, first.id)), colMiles(a, first).toLocaleString('en-US') + ' mi']) if (!T.includes(t)) bad.push('the list does not show "' + t + '"');
    s.widgets.find(w => w.label === 'Next ▶').onPress(); if (g.colBrowse.page !== 1 || ids(rows()) !== L.slice(per, 2 * per).map(q => q.id).join()) bad.push('Next ▶: page ' + (g.colBrowse.page + 1));
    for (let i = 0; i < 2; i++) s.widgets.find(w => w.label === '◀ Prev').onPress(); if (g.colBrowse.page !== 7 || ids(rows()) !== L.slice(7 * per).map(q => q.id).join()) bad.push('◀ Prev wraps to page ' + (g.colBrowse.page + 1));
    const T8 = tTexts(g), hot = rows().map(w => w.prog).find(q => colInterest(a, q.id) >= COLG.stages[0]); if (!T8.includes('Page 8 / 8') || !T8.includes('#64')) bad.push('page 8 does not say so'); if (!hot) bad.push('nobody on page 8 is interested'); else if (!T8.includes(colStage(colInterest(a, hot.id)))) bad.push('no stage for ' + hot.name);
    const r = rows()[per - 1], want = r.prog; r.onPress(); const p = g.ui.screen; if (p.name !== 'colprogram' || p.prog !== want.id) bad.push('a row opens ' + p.name + ' ' + p.prog);
    p.update(0.016); const nx = p.widgets.find(w => w.label === 'Next ▶' && !w.hidden), pv = p.widgets.find(w => w.label === '◀ Previous' && !w.hidden); if (!nx || !pv) bad.push('no ◀ Previous / Next ▶ on the page'); else { nx.onPress(); if (p.prog !== L[0].id) bad.push('Next ▶ from #64: ' + p.prog + ' (wanted ' + L[0].id + ')'); pv.onPress(); pv.onPress(); if (p.prog !== L[62].id) bad.push('◀ Previous: ' + p.prog + ' (wanted ' + L[62].id + ')'); }
    g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'page 1: ' + first.name + ' … ' + L[per - 1].name + ' · page 8: ' + hot.name + ' ' + colInterest(a, hot.id) + ' (' + colStage(colInterest(a, hot.id)) + ')';
  }), P);

  await R.step('a program\'s page (desktop) shows it all: name, place, conference, tier, prestige, arena; the coach (name, style, tenure); the GPA line; facilities, NIL market, distance; the players ahead of you with OVR; titles and pros (3.0 §1: no majors, no rival); your interest, its stage, the spots, what you\'ve earned there and the recruits chasing them; a top target\'s offer held (X9); nothing cut', () => ev(() => {
    const g = HH.game, a = tMkHs(51, 3), bad = []; a.gpa = 3.5; const q = colProg('summitam'); g.ui.clearTo(amHub(g)); g.ui.push(collegeProgramScreen(g, q.id)); g.ui.screen.update(0.016); const T = tTexts(g), co = colCoach(a, q.id), Rr = colRoster(a, q.id), S = colSpots(a, q.id), v = colInterest(a, q.id);
    const want = [q.name, colPlace(q), COL_CONFS[q.conf].name, colTierLabel(q), q.arena, co.name, 'Style: ' + COL_SYS[co.sys].label, colTenureText(co), 'GPA line ' + colGpaReq(q).toFixed(1), 'Facilities', 'NIL market', COL_NIL_WORD[q.nil], 'Distance', colMiles(a, q).toLocaleString('en-US') + ' mi', 'National titles', String(colTitles(a, q.id)), 'Pros produced', String(colPros(a, q.id)), String(v), '/ 100 · ' + colStage(v, S.left), 'Spots left: ' + S.left + ' of ' + S.total, 'Earned'];
    for (const m of Rr.mates.slice(0, Math.min(4, Rr.start - 1))) want.push(m.name, 'OVR ' + tmMateOvr(m)); for (const r of S.recruits.slice(0, 5)) want.push(r.name.split(' ').slice(-1)[0]); /* (a long name shows its last name) */
    for (const t of want) if (!T.includes(t)) bad.push('no "' + t + '"'); if (/Majors|Rival/.test(T)) bad.push('majors or a rival (3.0 §1)'); const cut = tCut(g); if (cut.length) bad.push('cut: ' + cut.join(', '));
    const H = colProg('cedarfalls'); a.offers.push(colOfferFrom(a, H, 'junior')); recHold(a, H.id); g.ui.clearTo(amHub(g)); g.ui.push(collegeProgramScreen(g, H.id)); const TH = tTexts(g); for (const t of ['/ 100 · they offered you', 'Held for you through Signing Day']) if (!TH.includes(t)) bad.push(H.name + ' (held): no "' + t + '"');
    const P2 = colProg('ashford'); g.ui.clearTo(amHub(g)); g.ui.push(collegeProgramScreen(g, P2.id)); const T2 = tTexts(g); if (!T2.includes('Elite academic') || !T2.includes('GPA line 3.3')) bad.push('an elite academic page');
    g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.slice(0, 8).join(' | ')); return q.name + ': coach ' + co.name + ' (' + COL_SYS[co.sys].label + '), you\'d begin #' + Rr.start + ', interest ' + v + ', spots ' + S.left + '/' + S.total + ' · ' + H.name + ': held for you';
  }), P);

  await R.step('offers come from the registry (id, colors, coach); the page says "Offered"; an offer holds no spot (2.1: whoever commits first gets it) unless you\'re one of its top targets (3.0 §8: then it holds one through Signing Day), your commitment does; the recruits commit in the order they come and the first take the spots', () => ev(() => {
    const a = tMkHs(61, 4), bad = []; for (const k of RATING_KEYS) a.r[k] = Math.max(a.r[k], 66); a.gpa = 3.5; a.offers = []; a.league.week = 0; hsOfferCheck(a, amRng(a), 'senior'); a.events.length = 0; if (!a.offers.length) throw new Error('no offers');
    for (const o of a.offers) { const q = colProg(o.pid); if (!q || q.name !== o.name || o.colors.join() !== q.colors.join() || o.coach !== colCoachTitle(colCoach(a, q.id)) || o.fac !== q.fac || !(o.at >= 0 && o.at <= 1)) bad.push('offer ' + JSON.stringify(o).slice(0, 120)); }
    const o = a.offers.find(x => colSpots(a, x.pid).left > 0 && !recHeld(a, x.pid)) || a.offers.find(x => !recHeld(a, x.pid)) || a.offers[0], S0 = colSpots(a, o.pid); if (S0.held !== (recHeld(a, o.pid) ? 1 : 0) || !(S0.total >= COLG.spots[0])) bad.push('an offer holds a spot: ' + JSON.stringify(S0).slice(0, 120)); for (const x of a.offers.filter(x => recHeld(a, x.pid))) if (colSpots(a, x.pid).held !== 1) bad.push('a top target\'s offer holds no spot: ' + x.name); if (colStage(colInterest(a, o.pid), S0.left, !!colOfferOf(a, o.pid)) !== 'Offered') bad.push('stage');
    if (S0.left > 0 && !recHeld(a, o.pid)) { recCommit(a, o.pid); const S1 = colSpots(a, o.pid); if (S1.held !== 1 || !S1.mine || S1.left !== S0.left - 1) bad.push('the commitment holds no spot: ' + JSON.stringify(S1).slice(0, 160)); if (colStage(colInterest(a, o.pid), S1.left, true, true) !== 'Committed') bad.push('stage: committed'); }
    a.league.week = a.league.schedule.length; a.stageYear = 4; _colMemo.clear(); const other = COLLEGES.find(q => !a.offers.some(x => x.pid === q.id) && !(recOf(a).rival && recOf(a).rival.pid === q.id)), S2 = colSpots(a, other.id, 1); if (S2.left !== 0 || S2.recruits.some(r => r.status === 'chasing') || S2.recruits.filter(r => r.status === 'committed').length !== S2.total) bad.push('at signing day every other spot is taken: ' + JSON.stringify(S2).slice(0, 160));
    const ord = S2.recruits.map(r => r.at); if (ord.some((t, i) => i && t < ord[i - 1])) bad.push('order'); if (S2.recruits.some((r, i) => (r.status === 'committed') !== (i < S2.total))) bad.push('the first to commit take the spots');
    o.pulled = true; o.pulledAt = 0.9; if (colOfferOf(a, o.pid)) bad.push('colOfferOf a pulled offer');
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return a.offers.length + ' offers: ' + a.offers.slice(0, 4).map(x => x.name).join(', ') + ' · ' + o.name + ' spots ' + S0.left + '/' + S0.total + ' (an offer holds none; the commitment one)';
  }), P);

  await R.step('committing: your team is the page\'s roster (the depth chart told the truth), the coach the page\'s (kept), facilities and a Development coach in your XP; your conference is the program\'s real one (its 7 others); the rival plays at the program\'s rival school or out of conference', () => ev(() => {
    const bad = [], out = []; for (const pid of ['royaloak', 'granitevalley', 'millriver', 'whitcombe']) { const a = tMkHs(70 + pid.length, 4); for (const k of RATING_KEYS) a.r[k] = Math.max(a.r[k], 64); a.gpa = 3.5; a.offers = []; hsOfferCheck(a, amRng(a), 'final'); a.events.length = 0; amStartRecruiting(a, amRng(a)); a.events.length = 0;
      const q = colProg(pid), o = colOfferFrom(a, q, 'final'); const pre = colRoster(a, pid).mates.map(m => m.name + ' ' + tmMateOvr(m)).join(); amChooseCollege(a, o); a.events.length = 0;
      if (a.program.pid !== pid || a.college !== q.name) bad.push(pid + ': program ' + JSON.stringify(a.program)); if (a.team.mates.map(m => m.name + ' ' + tmMateOvr(m)).join() !== pre) bad.push(pid + ': the team is not the page\'s roster');
      const co = colCoach(a, pid); if (a.team.coach.name !== colCoachTitle(co) || JSON.stringify(a.team.coach.look) !== JSON.stringify(co.look)) bad.push(pid + ': coach');
      const L = a.league, others = colMembers(q.conf).filter(x => x.id !== pid).map(x => x.id).sort().join(); if (L.name !== COL_CONFS[q.conf].name || L.opps.map(x => x.prog).sort().join() !== others) bad.push(pid + ': conference ' + L.name + ' ' + L.opps.map(x => x.prog));
      if (!L.nonconf.every(x => x.prog && colProg(x.prog).conf !== q.conf)) bad.push(pid + ': a non-conference game in conference');
      const rv = a.rival; if (rv && rv.college !== q.name) { const rq = colProgByName(rv.college); if (!rq) bad.push(pid + ': the rival at ' + rv.college); }
      const mul = colFacMul(a), wantMul = 1 + colFacPct(q) + (co.sys === 'development' ? COLG.devXp : 0); if (Math.abs(mul - wantMul) > 1e-9) bad.push(pid + ': XP ×' + mul);
      out.push(q.name + ' (' + L.name.replace(' Conference', '') + ', rival ' + (rv ? rv.college : '—') + ', XP ×' + mul.toFixed(2) + ')'); }
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return out.join(' · ');
  }), P);

  await R.step('the national tournament is all 64 programs: 64 slots, all distinct, you once; your national rank sets your seed ("#n of the 64"); a national title goes into the program\'s history', () => ev(() => {
    const a = tMkCol(81, 'cedarfalls'), bad = [], L = a.league; let guard = 0; while (!(L.playoffs && L.playoffs.nat) && guard++ < 40 && !L.done) { if (!amNext(a)) break; a.fatigue = 0; amSimGame(a); a.events.length = 0; if (a.decision) break; }
    const N = L.playoffs && L.playoffs.nat; if (!N) throw new Error('no field (week ' + L.week + ')'); const ids = N.rounds[0], progs = ids.map(id => id === 'me' ? a.program.pid : (amOppById(a, id) || {}).prog);
    if (ids.length !== 64 || ids.filter(x => x === 'me').length !== 1 || new Set(progs).size !== 64 || progs.some(x => !colProg(x))) bad.push('field ' + ids.length + ', ' + new Set(progs).size + ' distinct');
    if (N.seed !== Math.min(16, Math.max(1, Math.ceil(L.natRank / 4)))) bad.push('seed ' + N.seed + ' for #' + L.natRank);
    const t0 = colTitles(a, 'cedarfalls'); colRecordChamp(a, 'cedarfalls'); if (colTitles(a, 'cedarfalls') !== t0 + 1) bad.push('a title in the history'); colRecordChamp(a, 'royaloak'); if (colTitles(a, 'royaloak') !== colProg('royaloak').titles) bad.push('one champion a season');
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'field of ' + ids.length + ' · #' + L.natRank + ' of the 64, a ' + N.seed + ' seed';
  }), P);

  await R.step('old saves: the R5 college save finds its program by name (Granite Valley State: pid, real conference, coach); a program name from before 2.1 not in the table plays in a conference of its tier in place of its weakest program, and the field is still 64 distinct', async () => {
    const raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'save_r5_college_midseason.json'), 'utf8');
    return ev(raw => { const g = HH.game, bad = []; const load = d => { g.save.data = migrateSave(d); return g.save.data.c1; }; /* the load path's migration (amUpgrade → amRepair) */
      const a = load(JSON.parse(raw)); if (!a || a.stage !== 'college') throw new Error('no college career'); if (a.program.pid !== 'granitevalley' || colProgOf(a) !== colProg('granitevalley')) bad.push('pid ' + a.program.pid);
      g.ui.clearTo(amHub(g)); g.hubTab = 'team'; g.ui.screen.build(); const T = tTexts(g); if (/undefined|NaN/.test(T)) bad.push('the hub shows undefined/NaN');
      const d = JSON.parse(raw); d.c1.college = 'Old Test University'; d.c1.program.name = 'Old Test University'; const b2 = load(d); if (b2.program.pid) bad.push('a legacy name got a pid'); const out = colLegacyOut(b2), k = colConfIdx(b2);
      if (!out || out.conf !== k || COL_CONFS[k].kind !== 'mid') bad.push('legacy conference ' + k + ' out ' + (out && out.id)); if (colConfOthers(b2).length !== 7 || colConfOthers(b2).some(q => q.id === out.id)) bad.push('the 7 others');
      b2.season++; colNewSeason(b2, amRng(b2)); b2.events.length = 0; const L = b2.league; if (L.opps.length !== 7) bad.push('legacy conference opponents ' + L.opps.length);
      colStartConfTourney(b2, amRng(b2)); for (let i = 0; i < 3; i++) colAdvance(b2, amRng(b2), true); const N = L.playoffs && L.playoffs.nat; if (!N) bad.push('no field'); else { const progs = N.rounds[0].filter(x => x !== 'me').map(id => (amOppById(b2, id) || {}).prog); if (N.rounds[0].length !== 64 || new Set(progs).size !== 63 || progs.includes(out.id)) bad.push('legacy field ' + N.rounds[0].length + ' / ' + new Set(progs).size); }
      g.ui.clearTo(collegeBrowserScreen(g)); const T2 = tTexts(g); if (/undefined|NaN/.test(T2)) bad.push('the browser shows undefined/NaN');
      g.save.data = defaultSave(); g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'Granite Valley State → ' + colConfName(a) + ' · Old Test University in the ' + COL_CONFS[k].name + ' for ' + out.name;
    }, raw); }, P);

  await R.step('recruiting on HOME (high school only; 3.0 §2.1: five tabs, no RECRUIT tab): an old save\'s recruit tab opens HOME, keys 1–5 switch tabs; the RECRUITING card and the Recruiting button (the offer dot, on the HOME tab too) open the board: Colleges (gold), Offers & rank, Recruiting log, Signing Day when it\'s time; the six programs most interested in you, a tap opens the page; not in college (the Road on HOME, Colleges on LEAGUE)', () => ev(() => {
    const g = HH.game, a = tMkHs(91, 3), bad = []; g.hubTab = 'recruit'; g.ui.clearTo(amHub(g)); const s = g.ui.screen; const tabs = s.widgets.filter(w => w.hubTab).map(w => w.label).join(); if (tabs !== 'Tab: Home,Tab: League,Tab: Events,Tab: Career,Tab: Store') bad.push('tabs ' + tabs); if (s.tab !== 'home') bad.push('the recruit tab opens ' + s.tab);
    s.update(0.016, { anyKey: 'Digit5' }); if (g.hubTab !== 'store' || s.tab !== 'store') bad.push('key 5 → ' + g.hubTab); s.update(0.016, { anyKey: 'Digit1' }); if (g.hubTab !== 'home' || s.tab !== 'home') bad.push('key 1 → ' + g.hubTab);
    const top = hubRecruitTop(a, 6), card = () => amHubData(g, a).recruitCard || {}, rb = () => s.widgets.find(w => w.label === 'Recruiting' && !w.hidden), home = () => tTexts(g).replace(/ \| /g, ' '); /* (a line can wrap) */
    for (const t of ['RECRUITING', card().stars, card().rank, card().line]) if (!t || !home().includes(t)) bad.push('the card on HOME: no "' + t + '"'); if (!rb()) throw new Error('no Recruiting button on HOME | ' + bad.join(' | ')); if (rb().dot()) bad.push('a dot with no offer');
    a.offers.push(colOfferFrom(a, top[0], 'junior')); a.offersSeen = 0; s.build(); const B0 = hubBadges(g, a); if (!B0.home || B0.league) bad.push('the offer dot is not on HOME: ' + JSON.stringify(B0)); if (!rb().dot()) bad.push('no dot on Recruiting'); if (!home().includes('1 offer · best: ' + top[0].name)) bad.push('the card: ' + card().line);
    rb().onPress(); const bd = g.ui.screen; if (bd.name !== 'recboard') throw new Error('Recruiting opens ' + bd.name + ' | ' + bad.join(' | ')); if (hubBadges(g, a).home) bad.push('the dot stays');
    const W = bd.widgets.filter(w => !w.hidden), L = W.map(w => w.label), br = W.find(w => w.label === 'Colleges'); if (!br || !br.primary) bad.push('Colleges (gold)'); for (const l of ['Offers & rank', 'Recruiting log', 'Back']) if (!L.includes(l)) bad.push('no ' + l); if (L.includes('Choose your college') || L.includes('Signing Day')) bad.push('Signing Day before it\'s time');
    const rows = W.filter(w => w.prog); if (rows.length !== 6 || rows.map(w => w.prog.id).join() !== top.map(q => q.id).join()) bad.push('rows ' + rows.map(w => w.prog && w.prog.id));
    const T = tTexts(g); for (const t of ['YOUR RECRUITMENT', 'MOST INTERESTED IN YOU', top[0].name]) if (!T.toUpperCase().includes(t.toUpperCase())) bad.push('no "' + t + '"');
    for (const [l, want] of [['Colleges', 'colbrowser'], ['Offers & rank', 'recruiting'], ['Recruiting log', 'reclog']]) { const w = W.find(x => x.label === l); if (!w) continue; w.onPress(); if (g.ui.screen.name !== want) bad.push(l + ' opens ' + g.ui.screen.name); g.ui.pop(); }
    rows[0].onPress(); if (g.ui.screen.name !== 'colprogram' || g.ui.screen.prog !== top[0].id) bad.push('a row opens ' + g.ui.screen.name); g.ui.pop();
    a.stageYear = 4; amStartRecruiting(a, amRng(a)); a.events.length = 0; g.hubTab = 'home'; g.ui.clearTo(amHub(g)); const h4 = g.ui.screen; if (!h4.widgets.some(w => w.label === 'SIGNING DAY' && w.primary)) bad.push('no SIGNING DAY on HOME'); /* 2.1 (§2.5) */
    h4.widgets.find(w => w.label === 'Recruiting').onPress(); const W4 = g.ui.screen.widgets; if (!W4.some(w => w.label === 'Signing Day' && !w.hidden && w.primary) || W4.find(w => w.label === 'Colleges').primary) bad.push('no Signing Day (gold) on the board at decision time');
    const c = tMkCol(92); g.hubTab = 'recruit'; g.ui.clearTo(amHub(g)); const s2 = g.ui.screen; if (s2.tab !== 'home' || s2.widgets.some(w => w.label === 'Recruiting') || amHubData(g, c).recruitCard || !s2.widgets.some(w => w.label === 'The road') || !/ROAD TO THE LEAGUE/.test(tTexts(g))) bad.push('recruiting on HOME in college'); g.hubTab = 'league'; s2.build(); if (!s2.widgets.some(w => w.label === 'Colleges')) bad.push('no Colleges on LEAGUE in college');
    g.hubTab = 'home'; g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'top: ' + top.slice(0, 3).map(q => q.name + ' ' + colInterest(a, q.id)).join(', ');
  }), P);

  await R.step('the Codex: a Colleges & recruiting page (the programs, interest, spots, coaches, facilities and NIL; your values); no undefined or NaN; it points to 3.0\'s screens (no RECRUIT or Team tab); ? on the college list, a program\'s page and the recruiting board (HOME → Recruiting) opens it', () => ev(() => {
    const g = HH.game, bad = []; const a = tMkHs(101, 3); const E = guideEntries(g, 'colleges'), titles = E.map(e => e.title); for (const t of ['The 64 programs', 'Interest in you', 'Scholarship spots', 'Coaches', 'Facilities, NIL and distance']) if (!titles.includes(t)) bad.push('no ' + t);
    const all = JSON.stringify(E); if (/undefined|NaN|\[object/.test(all)) bad.push('undefined/NaN'); if (!E.find(e => e.title === 'Interest in you').value) bad.push('no interest value in high school');
    const tabs2 = all.match(/[^."]*\b(RECRUIT tab|Team → )[^."]*/g); if (tabs2) bad.push('2.x tabs: "' + tabs2.map(x => x.trim()).join('", "') + '"');
    const c = tMkCol(102); const E2 = guideEntries(g, 'colleges'); if (!/^yours: /.test(E2[0].value) || /undefined|NaN/.test(JSON.stringify(E2))) bad.push('college values ' + E2[0].value);
    g.save.data.c1 = a; for (const [tag, open] of [['college list', () => { g.ui.clearTo(amHub(g)); g.ui.push(collegeBrowserScreen(g)); }], ['program', () => { g.ui.clearTo(amHub(g)); g.ui.push(collegeProgramScreen(g, 'royaloak')); }], ['recruiting board', () => { g.hubTab = 'home'; g.ui.clearTo(amHub(g)); g.ui.screen.widgets.find(w => w.label === 'Recruiting').onPress(); }]]) { open(); const t = codexTopicFor(g, g.ui.screen); if (t !== 'colleges') bad.push('? on the ' + tag + ' (' + g.ui.screen.name + ') → ' + t); }
    g.ui.clearTo(amHub(g)); g.ui.push(statsGuideScreen(g, 'colleges')); const T = tTexts(g); if (!/COLLEGES & RECRUITING|Colleges & recruiting/i.test(T) || !/THE 64 PROGRAMS/i.test(T)) bad.push('the page does not show');
    g.hubTab = 'home'; g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return E.length + ' entries · college: ' + E2[0].value;
  }), P);

  // ---------------- phones ----------------
  const Q = await openPage(b, { wait: 900, phone: true }); await Q.ev(src => { (0, eval)(src); }, LIB);
  await R.step('phones: HOME\'s MORE… → Recruiting (the board: Colleges / Offers & rank / Recruiting log, the two programs most interested in you), a program\'s page in three views (Your chances, Coach & school, Team & history), the college list (3 rows a page, ◀ Prev / Next ▶ / Back; no filters, sort or search); every tap target 64 px or more; no undefined or NaN', () => Q.ev(() => {
    const g = HH.game, bad = [], seen = []; const a = tMkHs(111, 3); a.offers.push(colOfferFrom(a, hubRecruitTop(a, 1)[0], 'junior'));
    const check = (tag, open, want) => { open(); const s = g.ui.screen; if (s.update) s.update(0.016, {}); const sm = tSmall(g); if (sm.length) bad.push(tag + ' small: ' + sm.slice(0, 3).join(', ')); const T = tTexts(g); if (/undefined|NaN/.test(T)) bad.push(tag + ': undefined/NaN'); for (const t of want || []) if (!T.includes(t)) bad.push(tag + ': no "' + t + '"'); seen.push(tag); return s; };
    const top = hubRecruitTop(a, 2), press = l => { const w = g.ui.screen.widgets.find(x => x.label === l && !x.hidden); if (!w) throw new Error('no ' + l + ' on ' + g.ui.screen.name + ' | ' + bad.join(' | ')); w.onPress(); }, rowsOf = s => s.widgets.filter(w => /^Program/.test(w.label) && w.prog && !w.hidden);
    check('home', () => { g.hubTab = 'home'; g.ui.clearTo(amHub(g)); }); check('more', () => press('MORE…'), ['Recruiting']);
    const bd = check('board', () => press('Recruiting'), [top[0].name, top[1].name]); if (bd.name !== 'recboard') bad.push('Recruiting opens ' + bd.name); else { const L = bd.widgets.filter(w => !w.hidden).map(w => w.label); for (const l of ['Colleges', 'Offers & rank', 'Recruiting log']) if (!L.includes(l)) bad.push('the board: no ' + l); if (rowsOf(bd).map(w => w.prog.id).join() !== top.map(q => q.id).join()) bad.push('the board\'s rows'); }
    const p = check('program: chances', () => rowsOf(g.ui.screen)[0].onPress(), ['Spots left', top[0].name, '/ 100 · they offered you']); const v = p.widgets.find(w => w.label === 'View');
    check('program: coach & school', () => { v.set(1); }, ['Style: ', 'GPA line', 'Facilities']); check('program: team & history', () => { v.set(2); }, ['National titles', 'Pros produced']); if (/Rival/.test(tTexts(g))) bad.push('a rival (3.0 §1)'); g.ui.pop();
    const n = Math.ceil(COLLEGES.length / COLG.pageRows.phone), s = check('list', () => press('Colleges'), ['page 1 / ' + n]); if (s.name !== 'colbrowser' || rowsOf(s).length !== COLG.pageRows.phone) bad.push('phone rows ' + rowsOf(s).length); if (s.widgets.some(w => /^(Filters|Sort|Search)/.test(w.label || ''))) bad.push('Filters / Sort / Search on a phone');
    check('list: page 2', () => press('Next ▶'), ['page 2 / ' + n]); if (rowsOf(s).map(w => w.prog.id).join() !== colRankList().slice(3, 6).map(q => q.id).join()) bad.push('page 2: ' + rowsOf(s).map(w => w.prog.id));
    g.hubTab = 'home'; g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.slice(0, 8).join(' | ')); return seen.join(', ');
  }), Q);

  await b.close(); process.exit(R.done() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
