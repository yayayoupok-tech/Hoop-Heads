// 2.0 §2 (V3): traits. Rarer is stronger (the numbers by rarity, printed as a table), every trait levels up Bronze →
// Silver → Gold by doing its thing (each level adds half the Bronze upside; rarity sets the top level), a third trait
// at TR.thirdAt career points (2.1: 1,150), the Legendary abilities in the engine (Takeover, Ice Veins, Unbreakable), the in-game banner,
// "Traits that helped", the cards and chips (a tap opens the card, a resting mouse shows it), the Codex's Traits page
// and old saves. The career balance by rarity is tests/traitbalance.js.   node tests/traits.js
const path = require('path'), fs = require('fs');
const { launch, openPage, runner } = require('./lib');
(async () => {
  const b = await launch(); const R = runner('traits'); const D = await openPage(b); const { ev, page } = D; const step = (n, f) => R.step(n, f, D);
  await step('the numbers (§2.1): Bronze upside by rarity (Common +5–8%, Uncommon +10–12%, Rare +18–20% or a unique mechanic, Legendary about +30% or game-changing); downsides small (Common 2–3%, Uncommon 3%, Rare 3–5%); a Legendary has a flavor drawback only', async () => {
    const r = await ev(() => {
      const CAP = 80, rows = [], bad = []; // a cap move in rating points as a share of a typical 80 cap
      const big = (o, s) => { let m = 0; for (const k in o || {}) { if (k === 'head') { for (const r2 in o.head) m = Math.max(m, Math.abs(o.head[r2]) * s / CAP); continue; } const v = o[k]; if (k === 'start') m = Math.max(m, Math.abs(v) / CAP); /* a start lower: rating points */ else if (typeof v === 'number' && !['trustStart', 'moveEarly', 'ageShift', 'confHold', 'film', 'filmXp', 'injury'].includes(k)) m = Math.max(m, Math.abs(v) * s); else if (k === 'injury' && v > -1) m = Math.max(m, Math.abs(v) * s); } return m; };
      const UP = { C: [0.05, 0.08], U: [0.10, 0.12], R: [0.18, 0.20], L: [0.25, 0.40] }, DOWN = { C: [0.02, 0.03], U: [0.03, 0.03], R: [0.03, 0.065] }, unique = { latebloomer: 'a late growth spurt and every cap', filmjunkie: 'film counts double, and pays XP', unbreakable: 'never injured, ages 4 years slower', iceveins: 'confidence never drops' };
      for (const id of TRAIT_IDS) { const d = TR.list[id], up = big(d.up, 1), dn = big(d.down, 1), [ul, uh] = UP[d.r];
        const okUp = unique[id] || (up >= ul - 1e-9 && up <= uh + 0.005), okDn = d.r === 'L' ? !d.down && !!d.flavor : (dn >= DOWN[d.r][0] - 1e-9 && dn <= DOWN[d.r][1] + 0.005);
        if (!okUp || !okDn) bad.push(id + (okUp ? '' : ' up ' + (up * 100).toFixed(1) + '%') + (okDn ? '' : ' down ' + (dn * 100).toFixed(1) + '%'));
        rows.push([d.name, d.r, traitUpText(id, d.r === 'L' ? 3 : 1), unique[id] ? 'unique: ' + unique[id] : (up * 100).toFixed(1) + '%', traitDownText(id), trLevelName(trTop(id))]); }
      return { rows, bad };
    });
    console.log('     trait            rarity  Bronze upside (Legendary: Gold)                                                  headline   downside · top level');
    for (const x of r.rows) console.log('     ' + x[0].padEnd(16) + ' ' + x[1].padEnd(6) + '  ' + x[2].slice(0, 82).padEnd(82) + ' ' + String(x[3]).slice(0, 26).padEnd(10) + ' ' + x[4].slice(0, 70) + ' · ' + x[5]);
    if (r.bad.length) throw new Error('out of the rarity band: ' + r.bad.join('; '));
  });
  await step('levels (§2.2): each level adds 50% of the Bronze upside (Silver ×1.5, Gold ×2), downsides stay; Common tops out at Silver, Uncommon and Rare at Gold, a Legendary starts (and stays) at Gold', async () => {
    const r = await ev(() => { const bad = [];
      for (const id of TRAIT_IDS) { const d = TR.list[id], top = trTop(id), want = { C: 2, U: 3, R: 3, L: 3 }[d.r]; if (top !== want) bad.push(id + ' top ' + top);
        for (const k in d.up) { if (k === 'head') continue; const b1 = trKey(id, k, 1), b2 = trKey(id, k, 2), b3 = trKey(id, k, 3); if (d.r === 'L') { if (b1 !== b3) bad.push(id + ' ' + k + ' changes with level'); continue; } if (Math.abs(b2 - 1.5 * b1) > 1e-9) bad.push(id + ' ' + k + ' Silver ' + b2); if (top >= 3 && Math.abs(b3 - 2 * b1) > 1e-9) bad.push(id + ' ' + k + ' Gold ' + b3); if (top < 3 && Math.abs(b3 - b2) > 1e-9) bad.push(id + ' ' + k + ' past its top'); }
        for (const k in (d.down || {})) { if (k === 'head') continue; if (trKey(id, k, 1) !== trKey(id, k, 3)) bad.push(id + ' downside ' + k + ' grows'); } }
      const L = { tr: { sig: 'generational', hidden: null, found: true } }; if (trLvOf(L, 'generational') !== 3) bad.push('a Legendary does not start at Gold');
      const C = { tr: { sig: 'fasttwitch', hidden: null, found: true, lv: { fasttwitch: 3 } } }; if (trLvOf(C, 'fasttwitch') !== 2) bad.push('a Common past Silver');
      if (trHead(C, 'spd') !== 7.5) bad.push('Fast Twitch Silver Speed cap ' + trHead(C, 'spd')); return bad; });
    if (r.length) throw new Error(r.join('; '));
  });
  await step('deeds (§2.2): Clutch Gene levels up after its Silver and Gold counts of clutch makes (V5: 10 and 30), Gym Rat after 20 Practice weeks (Common: Silver is its top); each level-up is a celebration card; a career\'s simulated games and weeks count them', async () => {
    const r = await ev(() => { const save = defaultSave(), c = amCreate(save, { name: 'Deed Test', look: PRESET_LOOKS[2], number: 5, style: 'slasher', seed: 811, traits: ['clutch', 'gymrat'] }); c.tr.found = true; c.events.length = 0; const out = {};
      const [S1, G1] = TR.list.clutch.deed[1]; out.S1 = S1; out.G1 = G1; /* V5: the counts from CONFIG (the pace rules doubled them) */ trDeed(c, 'clutch', S1 - 1); out.l4 = trLvOf(c, 'clutch'); trDeed(c, 'clutch', 1); out.l5 = trLvOf(c, 'clutch'); trDeed(c, 'clutch', G1 - S1); out.l15 = trLvOf(c, 'clutch'); trFlush(c); out.cards = c.events.filter(e => e.kind === 'traitlevel').map(e => e.title + ' → ' + trLevelName(e.level) + ' | ' + e.lines.slice(1).join(' / ')); c.events.length = 0;
      trDeed(c, 'practice', 19); out.g19 = trLvOf(c, 'gymrat'); trDeed(c, 'practice', 1); out.g20 = trLvOf(c, 'gymrat'); trDeed(c, 'practice', 100); out.g120 = trLvOf(c, 'gymrat');
      const d2 = defaultSave(), a = amCreate(d2, { name: 'Sim Deeds', look: PRESET_LOOKS[4], number: 9, style: 'big', seed: 912, traits: ['paintprotector'] }); a.events.length = 0; let n = 0; while (n++ < 60 && a.stage === 'hs') { a.events.length = 0; hsAutoResolve(a); if (a.summer && a.summer.pending) { hsSummerChoose(a, 'rest'); continue; } if (a.decision) break; if (!amSimGame(a)) break; } out.sim = Object.assign({}, a.tr.deeds); return out; });
    console.log('     Clutch Gene: ' + (r.S1 - 1) + ' makes → ' + r.l4 + ', ' + r.S1 + ' → ' + r.l5 + ', ' + r.G1 + ' → ' + r.l15 + ' · Gym Rat: 19 weeks → ' + r.g19 + ', 20 → ' + r.g20 + ', 120 → ' + r.g120 + '\n     cards: ' + r.cards.join(' · ') + '\n     a simulated high school career\'s deeds: ' + JSON.stringify(r.sim));
    if (r.l4 !== 1 || r.l5 !== 2 || r.l15 !== 3) throw new Error('Clutch Gene levels ' + [r.l4, r.l5, r.l15]); if (r.g19 !== 1 || r.g20 !== 2 || r.g120 !== 2) throw new Error('Gym Rat levels ' + [r.g19, r.g20, r.g120]);
    if (r.cards.length !== 2) throw new Error('level-up cards: ' + r.cards.length); if (!(r.sim.games > 10 && r.sim.practice > 0 && r.sim.pts > 0 && r.sim.blocks >= 0)) throw new Error('simulated deeds ' + JSON.stringify(r.sim));
  });
  await step('the third trait (§2.2): TR.thirdAt career points (2.1: 1,150) offer 3 Common or Uncommon traits you don\'t have; the pick starts at Bronze and plays', async () => {
    const r = await ev(() => { const save = defaultSave(), c = amCreate(save, { name: 'Third Test', look: PRESET_LOOKS[1], number: 3, style: 'shooter', seed: 77, traits: ['microwave', 'clutch'] }); c.tr.found = true; c.events.length = 0;
      trDeed(c, 'pts', TR.thirdAt - 1); const before = !!c.tr.offer; trDeed(c, 'pts', 1); /* TR.thirdAt (2.1: 1,150) */ trFlush(c); const ev0 = c.events.find(e => e.kind === 'traitpick'), offer = (c.tr.offer || []).slice(); const ok = trPickThird(c, offer[1]); return { before, offer: offer.map(id => id + ':' + TR.list[id].r), ev: !!ev0, ok, third: c.tr.third, active: trActive(c), lv: trLvOf(c, offer[1]), again: trPickThird(c, offer[0]) }; });
    console.log('     at the third-trait mark: ' + r.offer.join(', ') + ' · picked ' + r.third + ' (' + ['', 'Bronze', 'Silver', 'Gold'][r.lv] + ') · active: ' + r.active.join(', '));
    if (r.before || !r.ev || r.offer.length !== 3 || r.offer.some(x => !/:[CU]$/.test(x)) || r.offer.some(x => /^(microwave|clutch):/.test(x))) throw new Error('the offer ' + JSON.stringify(r));
    if (!r.ok || r.lv !== 1 || r.active.length !== 3 || r.again) throw new Error('the pick ' + JSON.stringify(r));
  });
  await step('the Legendary abilities in the engine: Generational\'s Takeover (3 straight makes: +15% make chance, +10% speed for 10 s, a glow and a banner); Ice Veins (+25% in the last 15 s and the playoffs; confidence never drops); Unbreakable (never injured, fatigue 40% slower, 4 years slower to age); Generational +30% XP and +10 to every cap', async () => {
    const r = await ev(() => { const g = HH.game, out = {};
      const t0 = teamWithRoster(TEAMS[0]), t1 = teamWithRoster(TEAMS[1]); t0.players[0] = Object.assign({}, t0.players[0], { traits: ['generational'] }); t1.players[0] = Object.assign({}, t1.players[0], { traits: ['iceveins'] });
      g.startMatch({ mode: '1v1', teams: [t0, t1], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60 }, court: 'arena', seed: 3, controlMode: 'lock' }, { kind: 'quick' });
      const m = g.match, p = m.teams[0].players[0], q = m.teams[1].players[0]; for (let i = 0; i < 20; i++) simStep(m, STEP);
      const s0 = maxSpeedOf(p, false), mul0 = trShotMul(p, 'jumper'); for (let i = 0; i < 3; i++) trShotResult(p, true, 'jumper'); out.take = { until: +(p.trs.takeUntil - m.time).toFixed(2), shot: +(trShotMul(p, 'jumper') / mul0).toFixed(3), speed: +(maxSpeedOf(p, false) / s0).toFixed(3), banner: (m.trBanners || []).map(x => x.id), callout: (m.callouts || []).some(c => /TAKEOVER/.test(c.text || '')) };
      m.period = m.periods; m.gameClock = 40; out.ice40 = +trShotMul(q, 'jumper').toFixed(3); m.gameClock = 10; out.ice10 = +trShotMul(q, 'jumper').toFixed(3); m.gameClock = 40; m.playoff = true; out.icePO = +trShotMul(q, 'jumper').toFixed(3); m.playoff = false;
      g.renderSceneAny(g.ctx, m, 1, 0); g.drawHUD(g.ctx, m, 1, 0); g.quitToMenu();
      const B = { tr: { sig: 'iceveins', hidden: null, found: true }, hype: 50, confidence: 1.5 }; mdAfterGame(B, false, 2, 12); out.conf = B.confidence;
      const U = { tr: { sig: 'unbreakable', hidden: null, found: true }, fatigue: 90 }; let hurt = 0; const rng = new RNG(5); for (let i = 0; i < 3000; i++) { U.fatigue = 90; U.injury = null; const w = wkAfterGame(U, rng, {}); if (w.injury) hurt++; } U.fatigue = 0; wkAfterGame(U, rng, {}); out.unb = { hurt, fat: U.fatigue, age: trAgeShift(U), exp: WK.fatiguePerGame * trMul(U, 'fatigue') }; /* V5: a game's fatigue from WK */
      const G = { tr: { sig: 'generational', hidden: null, found: true } }; out.gen = { xp: +trXpMul(G, 25).toFixed(3), cap: trHead(G, 'sho') };
      return out; });
    console.log('     Takeover: ' + JSON.stringify(r.take) + ' · Ice Veins ×' + r.ice40 + ' at 0:40, ×' + r.ice10 + ' at 0:10, ×' + r.icePO + ' in the playoffs; confidence after a loss ' + r.conf + ' (was 1.5) · Unbreakable: ' + r.unb.hurt + ' injuries in 3,000 tired games, fatigue +' + r.unb.fat + ' a game, ages ' + r.unb.age + ' years slower · Generational XP ×' + r.gen.xp + ', caps +' + r.gen.cap);
    if (r.take.until !== 10 || r.take.shot !== 1.15 || r.take.speed !== 1.1 || !r.take.banner.includes('generational')) throw new Error('Takeover ' + JSON.stringify(r.take));
    if (r.ice40 !== 1 || r.ice10 !== 1.25 || r.icePO !== 1.25 || r.conf < 1.5) throw new Error('Ice Veins ' + [r.ice40, r.ice10, r.icePO, r.conf]);
    if (r.unb.hurt || Math.abs(r.unb.fat - r.unb.exp) > 1e-9 || r.unb.age !== 4) throw new Error('Unbreakable ' + JSON.stringify(r.unb)); if (r.gen.xp !== 1.3 || r.gen.cap !== 10) throw new Error('Generational ' + JSON.stringify(r.gen));
  });
  await step('the banner (§2.3): a trait kicking in shows its icon and name under the HUD for 1.2 s of game time; "Traits that helped" after a played game (a playoff game with Clutch Gene: its makes, by the engine\'s own numbers)', async () => {
    const r = await ev(() => { const g = HH.game, t0 = teamWithRoster(TEAMS[0]), t1 = teamWithRoster(TEAMS[1]); t0.players[0] = Object.assign({}, t0.players[0], { traits: ['clutch', 'paintprotector'], traitLv: { clutch: 2 } });
      g.startMatch({ mode: '1v1', teams: [t0, t1], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60 }, court: 'arena', seed: 9, controlMode: 'lock' }, { kind: 'quick' });
      const m = g.match, p = m.teams[0].players[0]; m.playoff = true; for (const q of m.players) q.controlled = false; m.bus.emit('TRAIT_FX', { player: p, id: 'clutch', level: 2 }); const shown = (m.trBanners || []).length;
      let n = 0; while (!m.ended && n++ < 120 * 120) simStep(m, STEP); const gone = (m.trBanners || []).filter(x => m.time - x.t < TR.bannerS).length; const lines = traitsHelpedLines(p, m).map(l => l.text); g.quitToMenu(); return { shown, gone, lines, lv: p.traits.clutch }; });
    console.log('     banners shown ' + r.shown + ', still up after the game ' + r.gone + ' · Clutch Gene at level ' + r.lv + ' · Traits that helped: ' + r.lines.join(' · '));
    if (r.shown !== 1 || r.gone !== 0) throw new Error('the banner'); if (!r.lines.some(l => /^Clutch Gene: \+[0-9.]+ make/.test(l))) throw new Error('no Clutch Gene line: ' + r.lines.join(' | '));
  });
  await step('cards and chips (§2.3): a tap on your trait chip on the hub opens its card; a mouse resting on it shows the card; the Codex lists all 17 by rarity (yours highlighted, your hidden one as ??? with its rarity and a hint)', async () => {
    await ev(() => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save, { name: 'Chip Test', look: PRESET_LOOKS[5], number: 8, style: 'shooter', seed: 4321, traits: ['streaky', 'iceveins'] }); g.save.data.c1 = a; a.events.length = 0; g.hubTab = 'me'; /* V5: the chips are on the hub's Me tab */ g.ui.clearTo(amHub(g)); });
    await page.waitForTimeout(500);
    const hot = await ev(() => { const s = HH.game.ui.screen, h = (s._hots || []).find(x => x.info && x.info.trait === 'streaky'); if (!h) return null; const ui = HH.game.ui; return { x: ui.ox + (h.x + h.w / 2) * ui.scale, y: ui.oy + (h.y + h.h / 2) * ui.scale }; });
    if (!hot) throw new Error('no chip on the hub');
    await page.mouse.move(hot.x, hot.y); await page.waitForTimeout(300); const hover = await ev(() => { const s = HH.game.ui.screen; return !!(s._hover && s._hover.info.trait === 'streaky'); });
    await page.mouse.click(hot.x, hot.y); await page.waitForTimeout(300); const top = await ev(() => HH.game.ui.screen.name);
    await ev(() => { const g = HH.game; g.ui.clearTo(amHub(g)); g.ui.push(statsGuideScreen(g, 'traits')); }); await page.waitForTimeout(700); /* (the screen's transition) */
    const codex = await ev(() => { const g = HH.game; const s = g.ui.screen; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } catch (e) { /* the test's own draw */ } const tiles = (s._hots || []).filter(h => h.info && h.info.tile).length, mine = (s._hots || []).filter(h => h.info && h.info.tile && h.info.B).map(h => h.info.trait); const text = (RBF.boxes || []).map(x => x.t || '').join(' | '); RBF.boxes = null; return { tiles, mine, hidden: /Your hidden trait: \?\?\? · Legendary/.test(text) }; });
    console.log('     hover shows the card: ' + hover + ' · a click opens: ' + top + ' · Codex: ' + codex.tiles + ' tiles, yours ' + codex.mine.join(', ') + ', the hidden note ' + codex.hidden);
    if (!hover || top !== 'traitcard') throw new Error('the chip'); if (codex.tiles !== 17 || codex.mine.join() !== 'streaky' || !codex.hidden) throw new Error('the Codex ' + JSON.stringify(codex));
  });
  await step('old saves (V3): levels start at Bronze and the deeds from what the save knows (games, wins, points); a save past the third-trait mark gets its pick', async () => {
    const FIX = path.join(__dirname, 'fixtures'); const raw = JSON.parse(fs.readFileSync(path.join(FIX, 'save_r8_pro_midseason.json'), 'utf8'));
    const r = await ev(raw => { const a = migrateSave(JSON.parse(JSON.stringify(raw))); const M = a.career.me, out = { deeds: M.tr.deeds, lv: M.tr.lv, offer: M.tr.offer || null };
      raw.career.me.careerStats.pts = TR.thirdAt; /* 2.1: 1,150 */ const b2 = migrateSave(raw); out.offer2 = b2.career.me.tr.offer; out.ev2 = (b2.career.events || []).some(e => e.kind === 'traitpick'); return out; }, raw);
    console.log('     r8 pro save: deeds ' + JSON.stringify(r.deeds) + ' · past the third-trait mark: offer ' + (r.offer2 || []).join(', ') + ', the pick queued ' + r.ev2);
    if (!r.deeds || !(r.deeds.games > 50) || !(r.deeds.pts > 700) || r.offer) throw new Error('the migration ' + JSON.stringify(r)); if (!r.offer2 || r.offer2.length !== 3 || !r.ev2) throw new Error('no third trait for a veteran');
  });
  await step('simulated games: what each trait is worth (OVR points, from its numbers): Bronze / Silver / Gold, regular season and playoffs', async () => {
    const rows = await ev(() => TRAIT_IDS.map(id => [TR.list[id].name, TR.list[id].r, [1, 2, 3].map(L => trEdgeOf(id, L, false).toFixed(2) + '/' + trEdgeOf(id, L, true).toFixed(2)).join('  ')]));
    for (const x of rows) console.log('     ' + x[0].padEnd(16) + ' ' + x[1] + '  ' + x[2]);
  });
  const errs = await ev(() => (window.HH_ERRORS || []).slice()); if (errs.length) { console.log('FAIL recovered frame exceptions: ' + errs.join(' | ')); R.fail++; }
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
