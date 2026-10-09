// 2.1 §1: playtest round 3. The fixes (9-12) and the running clock (8): one step each. node tests/playtest3.js
// (ONLY=<regex> runs the matching steps)
const { launch, openPage, runner } = require('./lib');

(async () => {
  const b = await launch(); const R = runner('playtest3');
  const P = await openPage(b, { wait: 900 }); const ev = P.ev;
  const fresh = (seed) => ev(seed => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data; s.c1 = amCreate(s, { name: 'Saoirse McKenna', look: PRESET_LOOKS[2], number: 23, style: 'shooter', seed }); s.c1.events.length = 0; g.ui.clearTo(amHub(g)); }, seed);

  // §1.8: a one-minute game takes 70-80 s; the clock runs through dead balls until the last 10 s, and stops there
  await R.step('running clock (§1.8): a one-minute career game runs 64-85 s (bots, median of 8); the clock runs through a made basket, an inbound and the pace holds before the last 10 s, and stops on dead balls inside them and in overtime', () => ev(() => {
    const T = []; for (let i = 0; i < 8; i++) { const o = { mode: '1v1', teams: [teamWithRoster(TEAMS[i % 8]), teamWithRoster(TEAMS[(i + 3) % 8])], humanTeam: -1, difficulty: 'pro', ruleset: 'arcade', format: careerFormat(), pace: true, court: 'arena', seed: 300 + i, controlMode: 'lock' }; matchOptsFinal(HH.game, o, { kind: 'career' }); o.headless = true; o.dev = true; const m = new Match(o); let n = 0; while (!m.ended && n < 120 * 400) { simStep(m, STEP); n++; } T.push(n / 120); }
    T.sort((a, c) => a - c); const med = (T[3] + T[4]) / 2; if (med < 64 || med > 85) throw new Error('median game ' + med.toFixed(1) + ' s (all: ' + T.map(t => t.toFixed(0)).join(', ') + ')');
    const o = { mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[3])], humanTeam: -1, difficulty: 'pro', ruleset: 'arcade', format: careerFormat(), pace: true, court: 'arena', seed: 9, controlMode: 'lock' }; matchOptsFinal(HH.game, o, { kind: 'career' }); o.headless = true; o.dev = true; const m = new Match(o);
    for (let n = 0; n < 120 * 3 && m.phase !== 'live'; n++) simStep(m, STEP);
    const tick = (clock, phase, ot) => { m.gameClock = clock; m.overtime = ot || 0; setPhase(m, phase, {}); m.phaseT = 0; const c0 = m.gameClock; runningClockTick(m, 0.5); return +(c0 - m.gameClock).toFixed(2); };
    const a = tick(30, 'madebasket'), bb = tick(30, 'violation'), c = tick(8, 'madebasket'), d = tick(30, 'madebasket', 1), e = tick(10.2, 'madebasket');
    if (a !== 0.5 || bb !== 0.5) throw new Error('the clock should run through dead balls: ' + a + ', ' + bb);
    if (c !== 0 || d !== 0) throw new Error('the clock should stop in the last 10 s and overtime: ' + c + ', ' + d);
    if (Math.abs(m.gameClock - 10) > 1e-9) throw new Error('a dead ball ran the clock past the 10 s mark: ' + m.gameClock);
    return 'median ' + med.toFixed(1) + ' s (' + T[0].toFixed(0) + '-' + T[7].toFixed(0) + ')'; }), P);

  // §1.9: the sim buttons with a choice waiting
  await R.step('sim buttons (§1.9): with your summer or tryouts waiting, the hub greys both sims ("Pick your summer first", "Finish tryouts first"); a run never shows "0 weeks simmed"', async () => {
    await fresh(611); const r = await ev(() => { const g = HH.game, c = g.save.data.c1, out = {}; const sims = () => { g.ui.clearTo(amHub(g)); g.hubTab = 'play'; const s = g.ui.screen; s.build && s.build(); return (s.widgets || []).filter(w => /^Sim |first$/.test(w.label || '')).map(w => w.label + (w.enabled === false ? ' (off)' : '')); };
      out.tryout = sims(); hsSimTryout(c); c.events.length = 0; out.free = sims(); hsSummerStart(c); out.summer = sims();
      g.ui.clearTo(amHub(g)); simAheadFromHub(g, 'big', () => amHub(g)); out.after = g.ui.screen.name; return out; });
    const want = (k, rx) => { if (!r[k].some(l => rx.test(l))) throw new Error(k + ': ' + JSON.stringify(r[k])); };
    if (r.tryout.length) want('tryout', /^Finish tryouts first \(off\)$/); want('summer', /^Pick your summer first \(off\)$/); want('free', /^Sim to next big moment$/);
    if (r.after !== 'amhub') throw new Error('a blocked run opened ' + r.after);
    return 'tryouts ' + JSON.stringify(r.tryout) + ' · summer ' + JSON.stringify(r.summer);
  }, P);

  // §1.10: one attempt at the All-Star 3-point contest
  await R.step('All-Star 3-point contest (§1.10): its pause menu has no Restart or Quit; leaving keeps the score; the weekend screen shows your score where the button was', () => ev(() => {
    localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const sv = g.save.data; sv.c1 = amCreate(sv, { name: 'Contest Once', look: PRESET_LOOKS[3], number: 3, style: 'shooter', seed: 5 }); sv.c1.events.length = 0; sv.c1.stage = 'combine'; createCareerFromAmateur(sv, sv.c1);
    const c = sv.career; c.events = []; c.allStar = setupAllStar(c); const A = c.allStar; A.invited = true; if (!A.field.includes(c.meId)) A.field[0] = c.meId; c.events = [];
    g.ui.clearTo(careerHub(g)); const scr = allStarWeekendScreen(g, c, { kind: 'allstar' }, () => g.ui.pop()); g.ui.push(scr); scr.widgets.find(w => /3-POINT CONTEST/.test(w.label)).onPress();
    if (!g.match || g.after.kind !== 'allstar') throw new Error('the contest did not start');
    const m = g.match; m.contest3.score = 7; g.paused = true; const ps = pauseScreen(g); const labels = ps.widgets.map(w => w.label).filter(Boolean);
    if (labels.some(l => /Restart|Quit/.test(l))) throw new Error('pause menu: ' + labels.join(' | '));
    g.quitToMenu(); if (!A.done || A.scores[c.meId] !== 7) throw new Error('leaving the contest: done ' + A.done + ', score ' + (A.scores && A.scores[c.meId]));
    const s2 = allStarWeekendScreen(g, c, { kind: 'allstar' }, () => {}); s2.update(0.016); const p3 = s2.widgets.find(w => /3-POINT CONTEST/.test(w.label));
    if (!p3.hidden) throw new Error('PLAY THE 3-POINT CONTEST still shown');
    g.ui.clearTo(s2); g.ui.trans = null; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { var B = RBF.boxes || []; RBF.boxes = null; } if (!B.some(x => /^YOUR SCORE: 7/.test(x.t))) throw new Error('no YOUR SCORE line');
    return labels.join(' | '); }), P);

  // §1.11: a record shows once, as a toast at the hub's foot, never over other screens
  await R.step('records (§1.11): a NEW RECORD toast waits for the hub, shows once at its foot, and is never drawn over another screen', async () => {
    await fresh(712); const r = await ev(() => { const g = HH.game, ui = g.ui, inp = g.input, c = g.save.data.c1; REC_TOASTS.length = 0; ui.toastT = 0;
      const dlg = msgScreen(g, c, { title: 'A DIALOG', lines: ['Over the hub.'] }, () => ui.pop()); ui.clearTo(amHub(g)); ui.push(dlg); ui.trans = null;
      REC_TOASTS.push('STATE RECORD: 40 points (Test, 39)'); for (let i = 0; i < 30; i++) ui.update(0.05, inp); const onDialog = { left: REC_TOASTS.length, kind: ui.toastKind, t: ui.toastT };
      ui.pop(); ui.trans = null; for (let i = 0; i < 3; i++) ui.update(0.05, inp); const onHub = { left: REC_TOASTS.length, kind: ui.toastKind, text: ui.toast };
      RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { var B = RBF.boxes || []; RBF.boxes = null; } const tb = B.find(x => /STATE RECORD/.test(x.t)); const k = g.ctx.canvas.height / 720;
      ui.push(msgScreen(g, c, { title: 'ANOTHER', lines: ['x'] }, () => ui.pop())); ui.trans = null; ui.update(0.05, inp); const away = ui.toastT;
      return { onDialog, onHub, y: tb ? tb.y / k : null, away, H: g.ctx.canvas.height / k }; });
    if (r.onDialog.left !== 1 || r.onDialog.kind === 'record' && r.onDialog.t > 0) throw new Error('shown over a dialog: ' + JSON.stringify(r.onDialog));
    if (r.onHub.left !== 0 || r.onHub.kind !== 'record') throw new Error('not shown on the hub: ' + JSON.stringify(r.onHub));
    if (r.y == null || r.y < 500) throw new Error('the record toast is not at the foot: y ' + r.y);
    if (r.away > 0) throw new Error('the record toast followed onto another screen');
    return 'toast at y ' + Math.round(r.y);
  }, P);

  // §1.12: the Road banner's lines don't touch, cards fit names, facilities, skills
  for (const phone of [false, true]) await R.step('Road to the League banner (§1.12, ' + (phone ? 'phone' : 'desktop') + '): its text rows never touch or overlap', async () => {
    const Q = phone ? await openPage(b, { phone: true, wait: 900 }) : P;
    const r = await Q.ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data; s.c1 = amCreate(s, { name: 'Road Test', look: PRESET_LOOKS[2], number: 2, style: 'shooter', seed: 31 }); s.c1.events.length = 0; hsSimTryout(s.c1); s.c1.events.length = 0; g.hubTab = 'play'; g.ui.clearTo(amHub(g)); g.ui.trans = null;
      const w = g.ui.screen.widgets.find(x => x.label === 'Road to the League'); const k = g.ctx.canvas.height / 720; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { var B = RBF.boxes || []; RBF.boxes = null; }
      const M = g.ui._lastM || null; const inB = B.filter(x => /ROAD TO THE LEAGUE|^NEXT:|^On JV|^Tryouts|National rank|EVERY MILESTONE/.test(x.t)); return inB.map(x => ({ t: x.t.slice(0, 24), y: x.y, h: x.h, x: x.x, w: x.w, cut: !!x.cut })); });
    if (phone) await Q.context.close();
    if (r.length < 3) throw new Error('banner strings: ' + JSON.stringify(r));
    for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { const a = r[i], c = r[j]; const xo = a.x < c.x + c.w && c.x < a.x + a.w; if (!xo) continue; const gap = Math.max(a.y, c.y) - Math.min(a.y + a.h, c.y + c.h); if (gap < 3) throw new Error('"' + a.t + '" and "' + c.t + '" are ' + gap.toFixed(0) + ' px apart'); }
    return r.map(x => x.t).join(' / ');
  }, P);

  // a card's name boxes, top to bottom ('SAOIRSE', 'MCKENNA' / 'S. MCKENNA' / 'MCKE-', 'NNA'), and what they read as
  const CARD_FNS = () => { window.__cardRun = (name, w, h, floor, T, sub) => { const c = document.createElement('canvas'); c.width = Math.ceil(w * T) + 4; c.height = Math.ceil(h * T) + 4; const g = c.getContext('2d'); const mc = RBF.mainCanvas, mm = RBF.minMain;
      try { RBF.mainCanvas = c; RBF.minMain = floor; g.setTransform(T, 0, 0, T, 0, 0); RBF.boxes = []; paintCard(g, { name, look: PRESET_LOOKS[2], colors: ['#3D6EA8', '#F3F0FF'], ovr: 62, height: 1.9, style: 'Shooter', number: 23, sub }, w, h); var B = RBF.boxes; } finally { RBF.mainCanvas = mc; RBF.minMain = mm; RBF.boxes = null; }
      const FULL = name.toUpperCase().replace(/[^A-Z]/g, ''), INI = name.toUpperCase().split(/\s+/).map(p => p.charAt(0)), L = B.filter(x => { const t = x.t || '', W = t.split(/\s+/).map(w => w.replace(/[^A-Z]/g, '')).filter(Boolean); return !/[a-z0-9]/.test(t) && W.join('').length >= 2 && W.every(w => (w.length === 1 && /\.$|\. /.test(t) && INI.includes(w)) || (w.length >= 2 && FULL.includes(w))); }).sort((a, c) => a.y - c.y || a.x - c.x);
      return { B, L, read: L.map(x => x.t).join(' ').replace(/- /g, ''), cut: L.filter(x => x.cut).map(x => x.cut) }; }; };
  await ev(CARD_FNS);
  await R.step('trading cards (§1.12): a long name shrinks, then takes two lines (SAOIRSE / MCKENNA), then shortens (S. MCKENNA, MCKENNA, MCKE- / NNA) instead of a cut; the name lines and the sub line never overlap; the tier label never overlaps the OVR badge', () => ev(() => {
    const out = [];
    for (const [w, floor, T] of [[155, 2, 1], [129, 2, 1], [129, 5, 2], [100, 3, 1]]) for (const name of ['Saoirse McKenna', 'Valentina Wilder', 'Jo Li']) {
      const r = __cardRun(name, w, w * 1.4, floor, T, 'Central Tech'), tag = w + '/' + floor / T + ' ' + name, parts = name.toUpperCase().split(' '), last = parts[parts.length - 1];
      if (!r.L.length) throw new Error(tag + ': no name drawn (' + r.B.map(x => x.t).join(', ') + ')');
      const ok = [parts.join(' '), parts[0].charAt(0) + '. ' + parts.slice(1).join(' '), last]; if (!r.cut.length && !ok.includes(r.read)) throw new Error(tag + ': the name reads "' + r.read + '"');
      if (r.cut.length && (w >= 129 || r.cut.some(t => t !== last))) throw new Error(tag + ': cut ' + JSON.stringify(r.cut) + ' (lines ' + r.L.map(x => x.t).join(' / ') + ')');
      const sub = r.B.find(x => x.t === 'Central Tech'), all = r.L.concat(sub ? [sub] : []);
      for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) { const a = all[i], c = all[j]; if (a.y < c.y + c.h - 0.5 && c.y < a.y + a.h - 0.5 && a.x < c.x + c.w && c.x < a.x + a.w) throw new Error(tag + ': "' + a.t + '" and "' + c.t + '" overlap'); }
      const tier = r.B.find(x => x.t === 'SILVER'); if (tier && tier.x < w * 0.3 * T) throw new Error(tag + ': the tier label at x ' + tier.x);
      out.push(w + '/' + floor / T + ' ' + r.L.map(x => x.t).join('/') + (r.cut.length ? ' (cut)' : '') + (sub ? ' + sub' : '')); }
    const full = out.find(l => /^155\/2 SAOIRSE\/MCKENNA|^155\/2 SAOIRSE MCKENNA/.test(l)); if (!full) throw new Error('a 155 px card should show the whole name SAOIRSE MCKENNA: ' + out.join(' · '));
    return out.join(' · '); }), P);

  await R.step('trading cards on a phone hub (§1.12): the matchup cards are 120+ px wide, and every last name in the name pool (with a 9-letter first name) fits uncut at the phone\'s text floor (2 and 2.5 px)', async () => {
    const Q = await openPage(b, { phone: true, wait: 900 }); await Q.ev(CARD_FNS);
    const r = await Q.ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data; s.c1 = amCreate(s, { name: 'Valentina Merriweather', look: PRESET_LOOKS[2], number: 2, style: 'shooter', seed: 31 }); s.c1.events.length = 0; hsSimTryout(s.c1); s.c1.events.length = 0; g.hubTab = 'play'; g.ui.clearTo(amHub(g)); g.ui.trans = null;
      const seen = [], o = window.drawTradingCard; window.drawTradingCard = function (ctx, x, y, w, h, P) { seen.push([w, h, P && P.name]); return o.apply(this, arguments); }; try { g.drawUI(g.ctx, g.W, g.H); } finally { window.drawTradingCard = o; }
      if (seen.length < 2) return { err: 'cards drawn: ' + JSON.stringify(seen) }; const [w, h] = seen[0]; const cuts = [];
      for (const [floor, T] of [[2, 1], [5, 2]]) for (const ln of GEN_LAST) { const q = __cardRun('Valentina ' + ln, w, h, floor, T); if (q.cut.length || !q.L.length) cuts.push(floor / T + ' ' + ln + ' → ' + q.L.map(x => x.t).join('/')); }
      return { w, h, n: GEN_LAST.length, cuts }; });
    await Q.context.close();
    if (r.err) throw new Error(r.err); if (r.w < 120) throw new Error('the phone hub card is ' + r.w + ' px wide');
    if (r.cuts.length) throw new Error(r.cuts.length + ' names cut: ' + r.cuts.slice(0, 6).join(' · '));
    return 'card ' + Math.round(r.w) + '×' + Math.round(r.h) + '; ' + r.n + ' last names × 2 floors, none cut';
  }, P);

  await R.step('facilities (§1.12): every pro franchise\'s gym pays practice XP (1★ +3% ... 5★ +15%), rising with the stars; an offer card shows it', () => ev(() => {
    const v = [1, 2, 3, 4, 5].map(s => frFacPct(s)); if (v.some(x => !(x > 0))) throw new Error('a +0% gym: ' + v.join(', ')); for (let i = 1; i < 5; i++) if (!(v[i] > v[i - 1])) throw new Error('not rising: ' + v.join(', '));
    return v.map(x => '+' + Math.round(x * 100) + '%').join(' '); }), P);

  await R.step('skills (§1.12): league players\' Shooting, Finishing, Handles and Defense (and their ceilings) stop at 95 like yours; an old save over 95 is clamped on load', () => ev(() => {
    localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const sv = g.save.data; sv.c1 = amCreate(sv, { name: 'Skill Cap', look: PRESET_LOOKS[1], number: 4, style: 'slasher', seed: 77 }); sv.c1.events.length = 0; sv.c1.stage = 'combine'; createCareerFromAmateur(sv, sv.c1);
    const c = sv.career, skills = ['sho', 'fin', 'han', 'def']; let mx = 0; for (const id of c.active) { const p = c.players[id]; if (p.isMe) continue; for (const k of skills) mx = Math.max(mx, p.r[k], p.caps[k]); }
    if (mx > 95) throw new Error('a league skill at ' + mx);
    const any = c.active.find(id => !c.players[id].isMe); const raw = JSON.parse(JSON.stringify(sv)); raw.career.players[any].r.sho = 100; raw.career.players[any].caps.sho = 100; const mig = migrateSave(raw); const q = mig.career.players[any];
    if (q.r.sho !== 95 || q.caps.sho !== 95) throw new Error('migration left ' + q.r.sho + '/' + q.caps.sho);
    return 'league max ' + mx; }), P);

  // found by the W1 quick checks: Esc while a game is still warming up (V15's bakes) was dropped
  await R.step('pause during the warm-up: Esc pressed while a game warms up opens the pause menu at its first frame (it used to be dropped)', async () => {
    const r = await ev(async () => { const g = HH.game; g.ui.clearTo(mainMenu(g)); g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60, periods: 1, ot: 30 }, court: 'arena', seed: 3, controlMode: 'lock' }, { kind: 'quick' });
      { const t0 = performance.now(); while (g.warming && performance.now() - t0 < 15000) await new Promise(res => setTimeout(res, 50)); } // (the real warm-up first)
      g.warming = { t0: performance.now(), gen: { next: () => ({ done: false }), return() {} } }; g.input.pausePressed = true; g.frameBody(g.last + 16.667);
      const during = { screen: (g.ui.screen && g.ui.screen.name) || '', latched: !!g.input.pausePressed, warming: !!g.warming };
      g.warming.gen = { next: () => ({ done: true }), return() {} }; g.frameBody(g.last + 16.667); const after = (g.ui.screen && g.ui.screen.name) || '';
      g.quitToMenu(); return { during, after }; });
    if (!r.during.warming) throw new Error('the test could not hold the warm-up');
    if (r.during.screen === 'pause' || !r.during.latched) throw new Error('during the warm-up: screen "' + r.during.screen + '", press kept ' + r.during.latched);
    if (r.after !== 'pause') throw new Error('after the warm-up the screen is "' + r.after + '"');
    return 'kept through the warm-up, then the pause menu';
  }, P);

  const fails = R.done(); await b.close(); process.exit(fails ? 1 : 0);
})();
