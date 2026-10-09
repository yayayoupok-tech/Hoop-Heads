// 3.0 (§6.3): badges (were 2.0's traits, V3). Earned, never rolled: every badge unlocks by doing its thing (its deed) and
// levels up Lv1 → Lv2 → Lv3 the same way, each level adding half the Lv1 numbers (Lv2 ×1.5, Lv3 ×2), with the counts
// shown and no rarity or downside. The numbers (printed as a table), the levels, the deeds and their cards, the top
// badges in the engine (Takeover, Ice Veins, Unbreakable), the in-game banner, "Badges that helped", the cards and chips
// (a tap opens the card, a resting mouse shows it), the Codex's Badges page and old saves. The career balance by badge is
// tests/traitbalance.js.   node tests/traits.js
const path = require('path'), fs = require('fs');
const { launch, openPage, runner } = require('./lib');
(async () => {
  const b = await launch(); const R = runner('traits'); const D = await openPage(b); const { ev, page } = D; const step = (n, f) => R.step(n, f, D);
  await step('the numbers (3.0 §6.3): every badge has a Lv1 upside, no downside, no rarity, and a deed with three rising counts (printed: the upside, what unlocks and levels it)', async () => {
    const r = await ev(() => { const rows = [], bad = [];
      for (const id of TRAIT_IDS) { const d = TR.list[id]; if (!d.up || d.down || d.r || d.flavor || !d.deed || d.deed[1].length !== 3 || !(d.deed[1][0] < d.deed[1][1] && d.deed[1][1] < d.deed[1][2]) || !TR_DEED_WORD[d.deed[0]]) bad.push(id);
        rows.push([d.name, traitUpText(id, 1), traitDeedText(id)]); }
      if (TRAIT_IDS.length !== 17) bad.push(TRAIT_IDS.length + ' badges'); return { rows, bad }; });
    console.log('     badge            Lv1 upside                                                                         what unlocks and levels it');
    for (const x of r.rows) console.log('     ' + x[0].padEnd(16) + ' ' + x[1].slice(0, 82).padEnd(82) + ' ' + x[2]);
    if (r.bad.length) throw new Error('badges: ' + r.bad.join('; '));
  });
  await step('levels: each level adds 50% of the Lv1 numbers (Lv2 ×1.5, Lv3 ×2), every badge to Lv3; a save\'s Legendary trait comes in at Lv3, the others at their level', async () => {
    const r = await ev(() => { const bad = [];
      for (const id of TRAIT_IDS) { const d = TR.list[id]; if (trTop(id) !== 3) bad.push(id + ' top ' + trTop(id));
        for (const k in d.up) { if (k === 'head') continue; const b1 = trKey(id, k, 1), b2 = trKey(id, k, 2), b3 = trKey(id, k, 3); if (Math.abs(b2 - 1.5 * b1) > 1e-9 || Math.abs(b3 - 2 * b1) > 1e-9) bad.push(id + ' ' + k + ' ' + [b1, b2, b3]); } }
      const L = { tr: { sig: 'generational', hidden: null, found: true } }; if (trLvOf(L, 'generational') !== 3) bad.push('a Legendary is not Lv3');
      const C = { tr: { sig: 'fasttwitch', hidden: null, found: true, lv: { fasttwitch: 2 } } }; if (trLvOf(C, 'fasttwitch') !== 2) bad.push('a Silver trait is not Lv2');
      if (trHead(C, 'spd') !== 7.5) bad.push('Fast Twitch Lv2 Speed cap ' + trHead(C, 'spd')); return bad; });
    if (r.length) throw new Error(r.join('; '));
  });
  await step('deeds: Clutch unlocks at its Lv1 count of clutch makes and levels at its Lv2 and Lv3 counts (Ice Veins counts the same makes, further up), Gym Rat at its Practice weeks; each step is a card (NEW BADGE, then BADGE LEVEL UP); a career\'s simulated games and weeks count them', async () => {
    const r = await ev(() => { const save = defaultSave(), c = amCreate(save, { name: 'Deed Test', look: PRESET_LOOKS[2], number: 5, style: 'slasher', seed: 811 }); c.events.length = 0; const out = {};
      const [A1, A2, A3] = TR.list.clutch.deed[1]; out.at = [A1, A2, A3]; trDeed(c, 'clutch', A1 - 1); out.l0 = trLvOf(c, 'clutch'); trDeed(c, 'clutch', 1); out.l1 = trLvOf(c, 'clutch'); trDeed(c, 'clutch', A2 - A1); out.l2 = trLvOf(c, 'clutch'); trDeed(c, 'clutch', A3 - A2); out.l3 = trLvOf(c, 'clutch'); trFlush(c); out.cards = c.events.filter(e => e.kind === 'traitlevel' && e.trait === 'clutch').map(e => e.title + ' → ' + trLevelName(e.level) + ' | ' + e.lines.slice(1).join(' / ')); c.events.length = 0;
      const [G1, G2, G3] = TR.list.gymrat.deed[1]; out.gat = [G1, G2, G3]; trDeed(c, 'practice', G1 - 1); out.g0 = trLvOf(c, 'gymrat'); trDeed(c, 'practice', 1); out.g1 = trLvOf(c, 'gymrat'); trDeed(c, 'practice', G3); out.g3 = trLvOf(c, 'gymrat');
      const d2 = defaultSave(), a = amCreate(d2, { name: 'Sim Deeds', look: PRESET_LOOKS[4], number: 9, style: 'big', seed: 912 }); a.events.length = 0; let n = 0; while (n++ < 60 && a.stage === 'hs') { a.events.length = 0; hsAutoResolve(a); if (a.summer && a.summer.pending) { hsSummerChoose(a, 'rest'); continue; } if (a.decision) break; if (!amSimGame(a)) break; } out.sim = Object.assign({}, a.tr.deeds); out.simB = Object.assign({}, a.tr.b); return out; });
    console.log('     Clutch (' + r.at.join('/') + '): ' + (r.at[0] - 1) + ' makes → Lv' + r.l0 + ', ' + r.at[0] + ' → Lv' + r.l1 + ', ' + r.at[1] + ' → Lv' + r.l2 + ', ' + r.at[2] + ' → Lv' + r.l3 + ' · Gym Rat (' + r.gat.join('/') + '): ' + (r.gat[0] - 1) + ' weeks → Lv' + r.g0 + ', ' + r.gat[0] + ' → Lv' + r.g1 + ', then Lv' + r.g3 + '\n     cards: ' + r.cards.join(' · ') + '\n     a simulated high school career\'s deeds: ' + JSON.stringify(r.sim) + ' · its badges: ' + JSON.stringify(r.simB));
    if (r.l0 !== 0 || r.l1 !== 1 || r.l2 !== 2 || r.l3 !== 3) throw new Error('Clutch levels ' + [r.l0, r.l1, r.l2, r.l3]); if (r.g0 !== 0 || r.g1 !== 1 || r.g3 !== 3) throw new Error('Gym Rat levels ' + [r.g0, r.g1, r.g3]);
    if (r.cards.length !== 3 || !/^NEW BADGE: CLUTCH/.test(r.cards[0]) || !/^BADGE LEVEL UP: CLUTCH/.test(r.cards[2])) throw new Error('the cards: ' + r.cards.join(' | ')); if (!(r.sim.games > 10 && r.sim.practice > 0 && r.sim.pts > 0 && r.sim.blocks >= 0)) throw new Error('simulated deeds ' + JSON.stringify(r.sim));
  });
  await step('no third or hidden trait (3.0): a new career has no badges; nothing to pick; a badge\'s card shows its deed\'s progress', async () => {
    const r = await ev(() => { const c = amCreate(defaultSave(), { name: 'No Third', look: PRESET_LOOKS[1], number: 3, style: 'shooter', seed: 77 }); const T = traitsOf(c); return { b: T.b, keys: Object.keys(T), pick: typeof trPickThird, at: TR.thirdAt, next: trNext(c, 'microwave') }; });
    if (Object.keys(r.b).length || r.keys.some(k => ['sig', 'hidden', 'found', 'third', 'offer'].includes(k)) || r.pick !== 'undefined' || r.at != null) throw new Error(JSON.stringify(r)); if (!r.next || r.next.level !== 1 || r.next.have !== 0) throw new Error('the progress ' + JSON.stringify(r.next));
  });
  await step('the top badges in the engine at Lv3: Generational\'s Takeover (3 straight makes: +15% make chance, +10% speed for 10 s, a glow and a banner); Ice Veins (+25% in the last 15 s and the playoffs; confidence never drops); Unbreakable (never injured, fatigue 40% slower, 4 years slower to age); Generational +30% XP and +10 to every cap', async () => {
    const r = await ev(() => { const g = HH.game, out = {};
      const t0 = teamWithRoster(TEAMS[0]), t1 = teamWithRoster(TEAMS[1]); t0.players[0] = Object.assign({}, t0.players[0], { traits: ['generational'], traitLv: { generational: 3 } }); t1.players[0] = Object.assign({}, t1.players[0], { traits: ['iceveins'], traitLv: { iceveins: 3 } });
      g.startMatch({ mode: '1v1', teams: [t0, t1], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60 }, court: 'arena', seed: 3, controlMode: 'lock' }, { kind: 'quick' });
      const m = g.match, p = m.teams[0].players[0], q = m.teams[1].players[0]; for (let i = 0; i < 20; i++) simStep(m, STEP);
      const s0 = maxSpeedOf(p, false), mul0 = trShotMul(p, 'jumper'); for (let i = 0; i < 3; i++) trShotResult(p, true, 'jumper'); out.take = { until: +(p.trs.takeUntil - m.time).toFixed(2), shot: +(trShotMul(p, 'jumper') / mul0).toFixed(3), speed: +(maxSpeedOf(p, false) / s0).toFixed(3), banner: (m.trBanners || []).map(x => x.id), callout: (m.callouts || []).some(c => /TAKEOVER/.test(c.text || '')) };
      m.period = m.periods; m.gameClock = 40; out.ice40 = +trShotMul(q, 'jumper').toFixed(3); m.gameClock = 10; out.ice10 = +trShotMul(q, 'jumper').toFixed(3); m.gameClock = 40; m.playoff = true; out.icePO = +trShotMul(q, 'jumper').toFixed(3); m.playoff = false;
      g.renderSceneAny(g.ctx, m, 1, 0); g.drawHUD(g.ctx, m, 1, 0); g.quitToMenu();
      const B = { tr: { v: 3, b: { iceveins: 1 } }, fame: 50, confidence: 1.5 }; confAfterGame(B, false, 2, 12); out.conf = B.confidence;
      const U = { tr: { v: 3, b: { unbreakable: 3 } }, fatigue: 90 }; let hurt = 0; const rng = new RNG(5); for (let i = 0; i < 3000; i++) { U.fatigue = 90; U.injury = null; const w = wkAfterGame(U, rng, {}); if (w.injury) hurt++; } U.fatigue = 0; wkAfterGame(U, rng, {}); out.unb = { hurt, fat: U.fatigue, age: trAgeShift(U), exp: WK.fatiguePerGame * trMul(U, 'fatigue') };
      const G = { tr: { v: 3, b: { generational: 3 } } }; out.gen = { xp: +trXpMul(G, 25).toFixed(3), cap: trHead(G, 'sho') };
      return out; });
    console.log('     Takeover: ' + JSON.stringify(r.take) + ' · Ice Veins ×' + r.ice40 + ' at 0:40, ×' + r.ice10 + ' at 0:10, ×' + r.icePO + ' in the playoffs; confidence after a loss ' + r.conf + ' (was 1.5, at Lv1) · Unbreakable: ' + r.unb.hurt + ' injuries in 3,000 tired games, fatigue +' + r.unb.fat + ' a game, ages ' + r.unb.age + ' years slower · Generational XP ×' + r.gen.xp + ', caps +' + r.gen.cap);
    if (r.take.until !== 10 || r.take.shot !== 1.15 || r.take.speed !== 1.1 || !r.take.banner.includes('generational')) throw new Error('Takeover ' + JSON.stringify(r.take));
    if (r.ice40 !== 1 || r.ice10 !== 1.25 || r.icePO !== 1.25 || r.conf < 1.5) throw new Error('Ice Veins ' + [r.ice40, r.ice10, r.icePO, r.conf]);
    if (r.unb.hurt || Math.abs(r.unb.fat - r.unb.exp) > 1e-9 || r.unb.age !== 4) throw new Error('Unbreakable ' + JSON.stringify(r.unb)); if (r.gen.xp !== 1.3 || r.gen.cap !== 10) throw new Error('Generational ' + JSON.stringify(r.gen));
  });
  await step('the banner: a badge kicking in shows its icon and name under the HUD for 1.2 s of game time; "Badges that helped" after a played game (a playoff game with Clutch: its makes, by the engine\'s own numbers)', async () => {
    const r = await ev(() => { const g = HH.game, t0 = teamWithRoster(TEAMS[0]), t1 = teamWithRoster(TEAMS[1]); t0.players[0] = Object.assign({}, t0.players[0], { traits: ['clutch', 'paintprotector'], traitLv: { clutch: 2 } });
      g.startMatch({ mode: '1v1', teams: [t0, t1], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60 }, court: 'arena', seed: 9, controlMode: 'lock' }, { kind: 'quick' });
      const m = g.match, p = m.teams[0].players[0]; m.playoff = true; for (const q of m.players) q.controlled = false; m.bus.emit('TRAIT_FX', { player: p, id: 'clutch', level: 2 }); const shown = (m.trBanners || []).length;
      const b0 = (m.trBanners || [])[0]; let n = 0; while (!m.ended && n++ < 120 * 240) simStep(m, STEP); const gone = (m.trBanners || []).filter(x => x === b0 && m.time - x.t < TR.bannerS).length; const lines = traitsHelpedLines(p, m).map(l => l.text); g.quitToMenu(); return { shown, gone, lines, lv: p.traits.clutch }; });
    console.log('     banners shown ' + r.shown + ', still up after the game ' + r.gone + ' · Clutch at Lv' + r.lv + ' · Badges that helped: ' + r.lines.join(' · '));
    if (r.shown !== 1 || r.gone !== 0) throw new Error('the banner'); if (!r.lines.some(l => /^Clutch: \+[0-9.]+ make/.test(l))) throw new Error('no Clutch line: ' + r.lines.join(' | '));
  });
  await step('cards and chips: a tap on your badge chip on the hub opens its card; a mouse resting on it shows the card; the Codex lists all 17 (yours at their level, the rest LOCKED with your count toward Lv1)', async () => {
    await ev(() => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save, { name: 'Chip Test', look: PRESET_LOOKS[5], number: 8, style: 'shooter', seed: 4321, traits: ['streaky', 'iceveins'] }); g.save.data.c1 = a; a.events.length = 0; g.hubTab = 'me'; g.ui.clearTo(amHub(g)); });
    await page.waitForTimeout(500);
    const hot = await ev(() => { const s = HH.game.ui.screen, h = (s._hots || []).find(x => x.info && x.info.trait === 'streaky'); if (!h) return null; const ui = HH.game.ui; return { x: ui.ox + (h.x + h.w / 2) * ui.scale, y: ui.oy + (h.y + h.h / 2) * ui.scale }; });
    if (!hot) throw new Error('no chip on the hub');
    await page.mouse.move(hot.x, hot.y); await page.waitForTimeout(300); const hover = await ev(() => { const s = HH.game.ui.screen; return !!(s._hover && s._hover.info.trait === 'streaky'); });
    await page.mouse.click(hot.x, hot.y); await page.waitForTimeout(300); const top = await ev(() => HH.game.ui.screen.name);
    await ev(() => { const g = HH.game; g.ui.clearTo(amHub(g)); g.ui.push(statsGuideScreen(g, 'traits')); }); await page.waitForTimeout(700);
    const codex = await ev(() => { const g = HH.game; const s = g.ui.screen; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } catch (e) { /* the test's own draw */ } const tiles = (s._hots || []).filter(h => h.info && h.info.tile).length; const text = (RBF.boxes || []).map(x => x.t || '').join('\n'); RBF.boxes = null; return { tiles, lv1: (text.match(/\bLV1\b/g) || []).length, locked: (text.match(/^(LOCKED · |LOCKED )?\d+(\.\d)?K?\/\d+(\.\d)?K?$/gm) || []).length }; });
    console.log('     hover shows the card: ' + hover + ' · a click opens: ' + top + ' · Codex: ' + codex.tiles + ' tiles, ' + codex.lv1 + ' at Lv1, ' + codex.locked + ' locked');
    if (!hover || top !== 'traitcard') throw new Error('the chip'); if (codex.tiles !== 17 || codex.lv1 !== 2 || codex.locked !== 15) throw new Error('the Codex ' + JSON.stringify(codex));
  });
  await step('old saves (3.0 §1): a save\'s traits become badges at their levels (an unfound hidden one dropped); the deeds start from what the save knows (games, wins, points) and can level them at once', async () => {
    const FIX = path.join(__dirname, 'fixtures'); const raw = JSON.parse(fs.readFileSync(path.join(FIX, 'save_r8_pro_midseason.json'), 'utf8'));
    const r = await ev(raw => { const a = migrateSave(JSON.parse(JSON.stringify(raw))); const T = traitsOf(a.career.me); return { deeds: T.deeds, b: T.b, keys: Object.keys(T) }; }, raw);
    console.log('     r8 pro save (streaky, gymrat found): badges ' + JSON.stringify(r.b) + ' · deeds ' + JSON.stringify(r.deeds));
    if (!r.deeds || !(r.deeds.games > 50) || !(r.deeds.pts > 700) || !(r.b.streaky >= 1) || !(r.b.gymrat >= 1) || r.keys.some(k => ['sig', 'hidden', 'found', 'third', 'offer', 'lv'].includes(k))) throw new Error('the migration ' + JSON.stringify(r));
  });
  await step('simulated games: what each badge is worth (OVR points, from its numbers): Lv1 / Lv2 / Lv3, regular season and playoffs', async () => {
    const rows = await ev(() => TRAIT_IDS.map(id => [TR.list[id].name, [1, 2, 3].map(L => trEdgeOf(id, L, false).toFixed(2) + '/' + trEdgeOf(id, L, true).toFixed(2)).join('  ')]));
    for (const x of rows) console.log('     ' + x[0].padEnd(16) + '  ' + x[1]);
  });
  const errs = await ev(() => (window.HH_ERRORS || []).slice()); if (errs.length) { console.log('FAIL recovered frame exceptions: ' + errs.join(' | ')); R.fail++; }
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
