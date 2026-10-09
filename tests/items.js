// 3.0 (§6, §11 "Items"): items, upgrades and badges with no rarity. No rarity word on any screen that shows items or
// badges (the store's shelves, try-on and locker, the trophy case, a badge's card, the Codex's badge pages and its gear
// page) at both levels; the +4 cap holds (a property test: random lockers of store and won items at random levels);
// tournament items (§6.2) can't be bought (never on a shelf, refused), are upgraded with cash like the others (the
// locker's Upgrade, at the stage's price table), are a level stronger at the same level and stand in the trophy room;
// the trophy room shows every piece over its pages (a desktop's twelve, a phone's eight); badges are earned, never rolled
// (a new career has none; a deed unlocks Lv1; the card shows the next level's count).
// (The catalogue, the store's week and its prices: tests/shop.js; the badges' numbers: tests/traits.js.)
// Usage: node tests/items.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('items'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  await ev(() => {
    window.__hs = seed => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Items Test', look: PRESET_LOOKS[seed % 16], number: 9, style: 'slasher', seed }); g.save.data.c1 = a; hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; a.cash = 50000; return a; };
    window.__pro = seed => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const c = testProLeague(seed, g.save.data); g.save.data.career = c; c.events.length = 0; c.me.money = 5e7; return c; };
    // every text the UI draws on the current screen (the pixel font's boxes)
    window.__texts = () => { const g = HH.game; g.ui.trans = null; g.ui.toastT = 0; RBF.boxes = []; let X = []; try { for (let k = 0; k < 3; k++) { RBF.boxes = []; g.drawUI(g.ctx, g.W, g.H); } } finally { X = RBF.boxes || []; RBF.boxes = null; } return X.map(b => b.t); };
    window.__RARITY = /\b(common|uncommon|rare|epic|legendary|mythic|rarity)\b/i;
  });
  await step('no rarity anywhere (§11): the config has no rarity tables; the store\'s shelves, try-on and locker, the trophy case, a badge\'s card, the Codex\'s badge and gear pages, at high school and in the pros, draw no rarity word (Common, Rare, Epic, Legendary…)', () => ev(() => {
    const bad = [], g = HH.game; const walk = (o, path, d) => { if (!o || typeof o !== 'object' || d > 6) return; for (const k of Object.keys(o)) { if (/rarit|legendar/i.test(k)) bad.push('CONFIG ' + path + '.' + k); walk(o[k], path + '.' + k, d + 1); } }; walk(CONFIG, 'CONFIG', 0);
    let screens = 0, texts = 0; const look = (tag, open) => { try { open(); } catch (e) { bad.push(tag + ': ' + e.message); return; } const T = __texts(); screens++; texts += T.length; for (const t of T) if (__RARITY.test(String(t).replace(/no rarity/ig, ''))) bad.push(tag + ': "' + t + '"'); }; /* (the Codex says so: "no rarity") */
    for (const who of ['hs', 'pro']) {
      const c = who === 'hs' ? __hs(31) : __pro(31), B = holderOf(c), hub = () => who === 'hs' ? amHub(g) : careerHub(g);
      gearOf(B).owned['tn:hsnat'] = 2; gearOf(B).owned.courtShoes = 3; gearEquip(B, 'courtShoes'); tnRow(c, 'hsnat', 1, {}); trDeed(B, 'practice', TR.list.gymrat.deed[1][0]);
      for (const view of ['store', 'locker', 'extras']) look(who + ' store ' + view, () => { g.ui.clearTo(hub()); g.ui.push(shopScreen(g, view)); });
      look(who + ' trophy case', () => { g.ui.clearTo(hub()); g.ui.push(trophyCaseScreen(g)); });
      for (const id of ['gymrat', 'generational', 'iceveins']) look(who + ' badge ' + id, () => { g.ui.clearTo(hub()); g.ui.push(traitCardScreen(g, id, B)); });
      look(who + ' Codex badges', () => { g.ui.clearTo(hub()); g.ui.push(statsGuideScreen(g, 'traits')); });
      look(who + ' Codex gear', () => { g.ui.clearTo(hub()); g.ui.push(statsGuideScreen(g, 'shop')); });
    }
    if (screens < 18 || texts < 300) bad.push('swept ' + screens + ' screens, ' + texts + ' texts');
    if (bad.length) throw new Error(bad.slice(0, 8).join(' · ')); return screens + ' screens, ' + texts + ' texts drawn: no rarity word'; }));
  await step('the +4 cap holds (a property test): 500 random lockers of the store\'s items and the won ones at random levels, worn at random, never add more than +4 to a rating in games, and never touch your OVR', () => ev(() => {
    const a = __hs(77), ids = GEAR_IDS.concat(Object.keys(TNE).filter(k => TNE[k].item).map(k => 'tn:' + tnItemKey(k))).filter((v, i, A) => A.indexOf(v) === i), rng = new RNG(4242), ovr0 = amOvr(a); let worst = 0, cases = 0;
    for (let t = 0; t < 500; t++) { a.gear = { v: 3, owned: {}, eq: {} }; const G = gearOf(a); for (const id of ids) if (rng.next() < 0.6) G.owned[id] = 1 + rng.int(5); for (const id of Object.keys(G.owned)) if (rng.next() < 0.75) gearEquip(a, id); const b = gearBonus(a), raw = gearBonusRaw(a); cases++;
      for (const k in raw) { worst = Math.max(worst, b[k]); if (b[k] > GEAR.cap || b[k] !== Math.min(GEAR.cap, raw[k])) throw new Error('the cap: ' + k + ' +' + b[k] + ' (worn: +' + raw[k] + ') ' + JSON.stringify(G.eq)); } if (amOvr(a) !== ovr0) throw new Error('OVR moved: ' + ovr0 + ' → ' + amOvr(a)); }
    return cases + ' lockers · the most +' + worst + ' (the cap +' + GEAR.cap + ')'; }));
  await step('tournament items (§6.2): never on a shelf and never bought; upgraded with cash like the store\'s (the locker\'s Upgrade, at the stage\'s price table) up to Lv5; a level stronger than the store\'s item at the same level; in the trophy room at their level', () => ev(() => {
    const g = HH.game, bad = []; const a = __hs(91), B = a, G = gearOf(B);
    if (GEAR_IDS.some(id => /^tn:/.test(id))) bad.push('a won item in the catalogue'); if (gearBuy(a, 'tn:hsnat')) bad.push('bought one');
    tnItemGive(a, 'hsnat'); if ((G.owned['tn:hsnat'] | 0) !== 1) bad.push('not won: ' + G.owned['tn:hsnat']);
    const it = gearItem('tn:hsnat'), base = gearItem(it.fam); for (let lv = 1; lv <= 4; lv++) if (gearRatingAt(it, lv).main !== gearRatingAt(base, lv + 1).main) bad.push('Lv' + lv + ' not a level up');
    // the locker's Upgrade: the next level at the stage's price, paid in cash
    let paid = 0; for (let lv = 2; lv <= GEAR.maxLv; lv++) { const want = GEAR.price.hs[lv - 1], cash0 = a.cash; if (gearNextPrice(a, 'tn:hsnat') !== want) bad.push('Lv' + lv + ' price ' + gearNextPrice(a, 'tn:hsnat') + ' (the table: ' + want + ')'); if (!gearUpgrade(a, 'tn:hsnat')) bad.push('no upgrade to Lv' + lv); if (a.cash !== cash0 - want) bad.push('Lv' + lv + ' cost ' + (cash0 - a.cash)); paid += want; }
    if ((G.owned['tn:hsnat'] | 0) !== GEAR.maxLv || gearNextPrice(a, 'tn:hsnat') != null || gearUpgrade(a, 'tn:hsnat')) bad.push('past Lv' + GEAR.maxLv);
    // the locker's button says so
    g.ui.clearTo(amHub(g)); g.ui.push(shopScreen(g, 'locker')); const s = g.ui.screen; const row = s.widgets.find(w => w.label === it.name); if (!row) bad.push('not in the locker'); else { row.onPress(); const up = g.ui.screen.widgets.find(w => /^(Upgrade|Maxed)/.test(w.label || '')); if (!up || !/Maxed/.test(up.label)) bad.push('the locker\'s button: ' + (up && up.label)); }
    // the trophy room: the item, at its level, the season it was won
    tnRow(a, 'hsnat', 1, {}); const tr = trophiesOf(a).find(t => t.kind === 'gear' && t.id === 'tn:hsnat'); if (!tr || tr.lv !== GEAR.maxLv || !/Nationals Headband/.test(tr.label)) bad.push('trophy room: ' + JSON.stringify(tr));
    g.ui.clearTo(amHub(g)); g.ui.push(trophyCaseScreen(g)); const T = __texts(); if (!T.some(t => /Headband/.test(t))) bad.push('the case doesn\'t show it: ' + T.slice(0, 30).join(' | ')); /* (its label can take two lines) */
    // a pro's won items: the pros' prices
    const c = __pro(92); tnItemGive(c, 'oly'); const p2 = gearNextPrice(c, 'tn:oly'); if (p2 !== GEAR.price.pro[1]) bad.push('pro Lv2 ' + p2);
    if (bad.length) throw new Error(bad.join(' · ')); return 'Nationals Headband Lv1 → Lv' + GEAR.maxLv + ' for ' + gearMoney(paid) + ' (high school\'s table) · Olympic Shoes Lv2 ' + gearMoney(p2) + ' (the pros\') · in the trophy case'; }));
  await step('the trophy room shows every piece, page by page (twelve a page on a desktop, eight on a phone: a phone\'s last four of each twelve never showed)', async () => {
    const out = []; for (const phone of [false, true]) { const P2 = phone ? await openPage(browser, { phone: true }) : D;
      const r = await P2.ev(() => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Shelf Count', look: PRESET_LOOKS[5], number: 6, style: 'slasher', seed: 12 }); g.save.data.c1 = a;
        for (const [k, f] of [['hsnat', 1], ['u17', 1], ['allam', 1], ['aau3', 1], ['camp', 1], ['aau1', 1], ['u17', 2]]) tnRow(a, k, f, { n: TNE[k].name, m: TNE[k].medals ? f : 0 }); for (const k of ['hsnat', 'u17', 'allam', 'aau3', 'camp']) tnItemGive(a, k);
        g.ui.clearTo(amHub(g)); const s = trophyCaseScreen(g); g.ui.push(s); const all = trophiesOf(a).length; let seen = 0, pages = 0;
        for (let k = 0; k < 12; k++) { g.ui.trans = null; s.update(0); RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { seen += (RBF.boxes || []).filter(b => /· season \d+$/.test(b.t)).length; RBF.boxes = null; } pages++; const older = s.widgets.find(w => w.label === 'Older'); if (!older || !older.enabled) break; older.onPress(); }
        return { all, seen, pages }; });
      if (phone) await P2.page.close(); if (r.seen !== r.all) throw new Error((phone ? 'phone' : 'desktop') + ': ' + r.seen + ' of ' + r.all + ' pieces shown over ' + r.pages + ' pages'); out.push((phone ? 'phone ' : 'desktop ') + r.all + ' pieces over ' + r.pages + ' page' + (r.pages > 1 ? 's' : '')); }
    return out.join(' · '); });
  await step('badges (§6.3): earned, never rolled: a new career has none; a deed unlocks Lv1 and levels it at the counts its card shows (the next level\'s count; the unlock and levels in full: tests/smoke.js, tests/traits.js)', () => ev(() => {
    const g = HH.game, bad = []; const a = __hs(55); if (trActive(a).length) bad.push('a new career has ' + trActive(a).join(','));
    const at = TR.list.gymrat.deed[1], have0 = (trDeeds(a) || {}).practice || 0; trDeed(a, 'practice', at[0] - 1 - have0); if (hasTrait(a, 'gymrat')) bad.push('unlocked early'); const n0 = trNext(a, 'gymrat'); if (!n0 || n0.at !== at[0] || n0.have !== at[0] - 1) bad.push('next ' + JSON.stringify(n0));
    trDeed(a, 'practice', 1); trFlush(a); if (trLvOf(a, 'gymrat') !== 1) bad.push('Lv' + trLvOf(a, 'gymrat') + ' at ' + at[0]); trDeed(a, 'practice', at[1] - at[0]); trFlush(a); if (trLvOf(a, 'gymrat') !== 2) bad.push('Lv' + trLvOf(a, 'gymrat') + ' at ' + at[1]);
    g.ui.clearTo(amHub(g)); g.ui.push(traitCardScreen(g, 'gymrat', a)); const T = __texts().join(' | '); if (!T.includes(String(at[2]))) bad.push('the card doesn\'t show Lv3\'s count (' + at[2] + '): ' + T.slice(0, 200));
    if (bad.length) throw new Error(bad.join(' · ')); return 'Gym Rat: Lv1 at ' + at[0] + ', Lv2 at ' + at[1] + ', the card shows Lv3 at ' + at[2]; }));
  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
