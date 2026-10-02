// V11 (Part 2 §5): the Pro Shop. Items in slots (five worn, two training, one recovery), common/rare/epic with levels,
// the signature collabs from the Road; never more than +4 to one rating; the week's six (one featured, new, sold out);
// prices by the stage you're at; buying, upgrading, wearing; try it on; the week's extras (an ice bath, a film session,
// a sports drink); lifestyle's weekly effects and upkeep; family help in high school; gear on your player; two worthwhile
// buys you can't afford at once at every stage; the shop's screens on a desktop and a phone. (Money over a career:
// tests/careersim.js's money line.) Usage: node tests/shop.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('shop'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  const mkHs = `(seed => { const a = amCreate(defaultSave(), { name: 'Shop Test', look: PRESET_LOOKS[seed % 16], number: 7, style: 'shooter', seed }); hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; a.fatigue = 0; a.injury = null; return a; })`; // through the tryout: a team and a season
  const mkPro = `(seed => { const save = defaultSave(), c = testProLeague(seed, save); save.career = c; c.events.length = 0; c.me.money = 2e7; return c; })`;
  const B = [mkHs, mkPro];

  await step('the catalog: worn items (shoes, socks, sleeve, headband, wristbands) add to one rating, training items add practice XP, recovery items cut fatigue or injuries; common to Lv2, rare to Lv3, epic to Lv4; the collabs are legendary (Lv1–4) with a second rating; every item has a pixel icon', () => ev(() => {
    const bad = [], kinds = {}; for (const f in GEAR_FAM) { const F = GEAR_FAM[f]; kinds[F.kind] = (kinds[F.kind] || 0) + 1; if (!GEAR_ICON_MAPS[F.icon]) bad.push(f + ': no icon'); for (const r of ['common', 'rare', 'epic']) { const it = gearItem(f + ':' + r); if (!it || it.max !== GEAR.maxLv[r]) bad.push(f + ':' + r); } if (gearItem(f + ':legendary')) bad.push(f + ' sold as legendary'); }
    for (const s of ['shoes', 'socks', 'sleeve', 'head', 'wrist']) if (!Object.values(GEAR_FAM).some(F => F.slot === s && F.kind === 'rating')) bad.push('no item for ' + s);
    if (!kinds.xp || !kinds.regen || !kinds.injury) bad.push('kinds ' + JSON.stringify(kinds)); for (const id in GEAR_SIG) { const it = gearItem(id); if (!it || it.rarity !== 'legendary' || it.max !== 4 || !it.also || !it.sig) bad.push(id); }
    for (const icon in GEAR_ICON_MAPS) { const m = GEAR_ICON_MAPS[icon]; if (m.length !== 16 || m.some(r => r.length !== 16)) bad.push(icon + ' is not 16×16'); }
    if (GEAR_SLOTS.length !== 8 || GEAR_SLOTS.filter(s => s[1] === 'Training').length !== 2) bad.push('slots');
    if (bad.length) throw new Error(bad.join(' | ')); return Object.keys(GEAR_FAM).length + ' families × 3 rarities + ' + Object.keys(GEAR_SIG).length + ' collabs · ' + JSON.stringify(kinds);
  }));

  await step('the +4 cap: two items on one rating add up to +4 at most (the try-on says so); a collab\'s second rating counts too; in games only: OVR and value never move', () => ev(([mkHs, mkPro]) => {
    const a = eval(mkHs)(11), G = gearOf(a), bad = []; G.owned = { 'shooterSleeve:epic': 4, 'shooterBands:rare': 3, 'sigBands': 4 }; gearEquip(a, 'shooterSleeve:epic'); gearEquip(a, 'shooterBands:rare');
    if (gearBonusRaw(a).sho !== 7 || gearBonus(a).sho !== 4) bad.push('sleeve 4 + bands 3: ' + gearBonus(a).sho);
    const T = gearTryOn(a, 'sigBands'); if (!T || T.after.han !== 4 || T.after.sho !== 4 || T.raw.sho !== 5) bad.push('try-on: ' + JSON.stringify(T && T.after)); if (G.eq.wrist !== 'shooterBands:rare') bad.push('a try-on changes nothing');
    const ovr = amOvr(a); gearEquip(a, 'sigBands'); if (amOvr(a) !== ovr) bad.push('OVR moved');
    const c = eval(mkPro)(12), v0 = frValue(c), o0 = recOvr(meOf(c)); const G2 = gearOf(c.me); for (const o in G2.owned) if (GEAR_SIG[o]) delete G2.owned[o]; gearOf(c.me); gearGive(c.me, 'sigShoes'); if (frValue(c) !== v0 || recOvr(meOf(c)) !== o0) bad.push('a pro\'s value or OVR moved'); const e = wkEff(meOf(c).r, meOf(c).h, c.me), e0 = effRatings(meOf(c).r, meOf(c).h); if (Math.abs(e.spd - e0.spd - GEAR.sigStart) > 1e-6 || Math.abs(e.jmp - e0.jmp - 1) > 1e-6) bad.push('the signature shoes in games: spd +' + (e.spd - e0.spd) + ' jmp +' + (e.jmp - e0.jmp));
    if (bad.length) throw new Error(bad.join(' | ')); return 'capped at +' + GEAR.cap;
  }, B));

  await step('the week\'s stock: six items, no family twice, no collabs; one featured at 25% off; NEW the first time an item shows; now and then one SOLD OUT (other shoppers), and each sells once; new stock next week; rarities lean with the stage (high school mostly common, the pros mostly epic)', () => ev(([mkHs, mkPro]) => {
    const bad = [], rar = { hs: {}, pro: {} }; let soldOut = 0;
    for (const [mk, st] of [[mkHs, 'hs'], [mkPro, 'pro']]) for (let seed = 1; seed <= 30; seed++) { const c = eval(mk)(100 + seed), S = gearStock(c); if (S.ids.length !== GEAR.stock) bad.push('size ' + S.ids.length); const fams = S.ids.map(id => id.split(':')[0]); if (new Set(fams).size !== fams.length) bad.push('a family twice'); if (S.ids.some(id => gearItem(id).sig)) bad.push('a collab for sale'); for (const id of S.ids) rar[st][gearItem(id).rarity] = (rar[st][gearItem(id).rarity] || 0) + 1; const outs = S.ids.filter(id => S.sold[id] === 'out'); if (outs.length) { soldOut++; if (outs.length > 1 || outs.includes(S.ids[S.featured])) bad.push('sold out: ' + outs); } }
    if (!(rar.hs.common > (rar.hs.epic || 0) * 3) || !((rar.pro.epic || 0) > (rar.pro.common || 0))) bad.push('rarities by stage ' + JSON.stringify(rar)); if (soldOut < 6 || soldOut > 36) bad.push('weeks with one sold out (other shoppers): ' + soldOut + ' of 60');
    const a = eval(mkHs)(7), S = gearStock(a), f = S.ids[S.featured]; if (gearStockPrice(a, f) !== Math.round(gearPrice(a, gearItem(f), 1) * (1 - GEAR.featuredOff) / 10) * 10) bad.push('the featured price'); if (S.fresh.length !== GEAR.stock) bad.push('all new the first week');
    a.cash = 1e5; const id = S.ids.find(x => x !== f && !S.sold[x]); gearBuy(a, id); const out = S.ids.find(x => S.sold[x] === 'out'); if (out && gearBuy(a, out)) bad.push('bought a sold-out item'); if (!gearStock(a).sold[id] || gearBuy(a, id)) bad.push('sold out after buying');
    const key = S.key; a.league.week++; const S2 = gearStock(a); if (S2.key === key || S2.sold[id]) bad.push('a new week, a new stock'); if (S2.fresh.some(x => S.ids.includes(x))) bad.push('NEW only the first time');
    if (bad.length) throw new Error(bad.join(' | ')); return 'rarities: high school ' + JSON.stringify(rar.hs) + ' · pros ' + JSON.stringify(rar.pro) + ' · weeks with one sold out ' + soldOut + ' of 60';
  }, B));

  await step('prices go with the stage you\'re at (high school $50–$400, college $500–$5K, the pros $10K–$500K); cash pays as an amateur, money as a pro; buying, upgrading (to the rarity\'s top level), wearing, taking off, two training slots', () => ev(([mkHs, mkPro]) => {
    const bad = [], span = st => { let lo = 1e12, hi = 0; for (const r in GEAR.price[st]) for (const p of GEAR.price[st][r]) { lo = Math.min(lo, p); hi = Math.max(hi, p); } return [lo, hi]; };
    const want = { hs: [50, 400], college: [500, 5000], pro: [10000, 500000] }; for (const st in want) { const [lo, hi] = span(st); if (lo !== want[st][0] || hi !== want[st][1]) bad.push(st + ' ' + lo + '–' + hi); }
    const a = eval(mkHs)(21), G = gearOf(a); a.cash = 1e5; const id = 'courtShoes:rare'; G.owned[id] = 1; if (gearNextPrice(a, id) !== GEAR.price.hs.rare[1]) bad.push('a high school upgrade'); a.stage = 'college'; if (gearNextPrice(a, id) !== GEAR.price.college.rare[1]) bad.push('a college upgrade'); a.stage = 'hs';
    const c0 = a.cash; gearUpgrade(a, id); gearUpgrade(a, id); if (G.owned[id] !== 3 || gearUpgrade(a, id) || a.cash !== c0 - GEAR.price.hs.rare[1] - GEAR.price.hs.rare[2]) bad.push('upgrades to Lv3: ' + G.owned[id]);
    gearEquip(a, id); if (G.eq.shoes !== id) bad.push('wear'); gearUnequip(a, id); if (G.eq.shoes) bad.push('take off');
    for (const t of ['plyoBox:rare', 'slideSled:common', 'agilityLadder:epic']) { G.owned[t] = 1; gearEquip(a, t); } if (!G.eq.train1 || !G.eq.train2 || Object.values(G.eq).filter(x => /plyo|slide|agility/.test(x)).length !== 2) bad.push('two training slots ' + JSON.stringify(G.eq));
    const c = eval(mkPro)(22), m0 = c.me.money, S = gearStock(c), pid = S.ids[0], pp = gearStockPrice(c, pid); gearBuy(c, pid); if (c.me.money !== m0 - pp || pp < 7500) bad.push('a pro pays money at pro prices: ' + pp);
    if (bad.length) throw new Error(bad.join(' | ')); return 'ok';
  }, B));

  await step('the week\'s extras, once a week each, priced by stage (2.0 §4.3): an ice bath (fatigue −20 now), a film session (their scouting card shows two more tendencies), a sports drink (+5% stamina for one game: a live game\'s stamina costs and recovery, a simulated one\'s fatigue cut)', () => ev(([mkHs, mkPro]) => {
    const a = eval(mkHs)(31), bad = []; a.cash = 1000; a.fatigue = 70; const c0 = a.cash;
    if (!gearConsume(a, 'ice') || a.fatigue !== 70 - GEAR.iceBath || a.cash !== c0 - GEAR.consumable.hs || gearConsume(a, 'ice')) bad.push('the ice bath');
    a.fatigue = 90; const e0 = wkEff(a.r, a.height, a), s0 = amPlayerDef(a).stamMul; gearConsume(a, 'drink'); const e1 = wkEff(a.r, a.height, a), cut = fatigueCut(a.fatigue), base = effRatings(a.r, a.height).sho + (gearBonus(a).sho || 0) + confShoOf(a);
    if (!(cut > 0) || Math.abs(e1.sho / base - (1 - cut * (1 - GEAR.drinkStamina))) > 0.02 || !(e1.sho > e0.sho)) bad.push('the drink in a sim: ' + e0.sho.toFixed(2) + ' → ' + e1.sho.toFixed(2));
    if (s0 !== 1 || Math.abs(amPlayerDef(a).stamMul - (1 + GEAR.drinkStamina)) > 1e-9) bad.push('the drink live: stamMul ' + s0 + ' → ' + amPlayerDef(a).stamMul);
    gearConsume(a, 'film'); const e2 = wkEff(a.r, a.height, a); if (e2.def !== e1.def || e2.sho !== e1.sho) bad.push('the film session moved a rating');
    const g = amNext(a), o = g && g.opp; if (o) { const D0 = scoutCard(o, o.r, o.height, {}), D1 = scoutCard(o, o.r, o.height, { extra: GEAR.filmTells }); if (D1.tend.length !== Math.min(D0.tend.length + GEAR.filmTells, D0.tend.length + D0.more)) bad.push('the card: ' + D0.tend.length + ' → ' + D1.tend.length); } else bad.push('no game to scout');
    a.league.week++; if (!gearCanConsume(a, 'ice')) bad.push('a new week, a new ice bath');
    const c = eval(mkPro)(32); const m0 = c.me.money; gearConsume(c, 'ice'); if (c.me.money !== m0 - GEAR.consumable.pro) bad.push('a pro\'s price'); gearConsume(c, 'drink'); if (engineDef(c, c.meId, { week: true }).stamMul !== 1 + GEAR.drinkStamina || engineDef(c, c.meId, {}).stamMul !== 1) bad.push('a pro\'s drink live');
    if (bad.length) throw new Error(bad.join(' | ')); return 'prices ' + JSON.stringify(GEAR.consumable);
  }, B));

  await step('lifestyle: each buy adds its weekly effect (hype, confidence or fame) and costs its upkeep every game week; family help in high school ($' + 15 + ' a game week); the Road\'s gear rewards are signature collabs, worn at once, and each new one lifts the others a level', () => ev(([mkHs, mkPro]) => {
    const bad = [], c = eval(mkPro)(41), M = c.me; M.lifestyle = {}; for (const it of PR.lifestyle) M.lifestyle[it.id] = c.season; M.hype = 10; M.confidence = 0; M.fame = 20; M.endorsements = []; const m0 = M.money, rec = {}; weeklyFinance(c, rec);
    const up = PR.lifestyle.reduce((s2, it) => s2 + (it.upkeep || 0), 0), W = k => PR.lifestyle.reduce((s2, it) => s2 + ((it.weekly || {})[k] || 0), 0);
    if (rec.upkeep !== up || Math.abs(M.hype - (10 + W('hype'))) > 1e-9 || Math.abs(M.fame - (20 + W('fame'))) > 1e-9 || !(M.confidence > 0)) bad.push('lifestyle: upkeep ' + rec.upkeep + ' of ' + up + ', hype ' + M.hype + ', fame ' + M.fame + ', confidence ' + M.confidence);
    const a = eval(mkHs)(42); a.cash = 0; let n = 0; while (n++ < 3 && amNext(a)) { a.events.length = 0; amSimGame(a); } if (!(a.cash >= GEAR.familyHelp * 2)) bad.push('family help: $' + a.cash);
    const b = eval(mkHs)(43); b.offers = [{ name: 'Test U', tier: 1 }]; roadCheck(b); const G = gearOf(b); if (G.owned.sigShoes !== GEAR.sigStart || G.eq.shoes !== 'sigShoes') bad.push('the Road\'s collab: Lv' + G.owned.sigShoes); gearGive(b, 'sigSleeve'); if (G.owned.sigSleeve !== GEAR.sigStart || G.owned.sigShoes !== Math.min(4, GEAR.sigStart + 1)) bad.push('a second collab lifts the first: ' + JSON.stringify(G.owned));
    if (bad.length) throw new Error(bad.join(' | ')); return 'upkeep $' + up.toLocaleString() + ' a week for all four · family help after 3 games $' + a.cash;
  }, B));

  await step('gear on your player: shoes, socks, the sleeve, the headband and the wristbands in the item\'s colors (in games, on the hub and in portraits); pixel mode keeps a gear color in the palette', () => ev(([mkHs]) => {
    const a = eval(mkHs)(51), G = gearOf(a), bad = []; G.owned = { 'courtShoes:epic': 1, 'gripSocks:rare': 1, 'compSleeve:legendary': 0, 'sweatband:rare': 1, 'gripBands:epic': 1, 'shooterSleeve:common': 1 }; gearOf(a); for (const id in G.owned) gearEquip(a, id);
    const L = normLook(amDrawDef(a).look, a.name), kit = kitOf({ colors: ['#2E6FD8', '#F3F0FF'] }, L);
    if (JSON.stringify(L.shoes) !== JSON.stringify(GEAR_SHOE_COLORS.epic) || JSON.stringify(L.socks) !== JSON.stringify(GEAR_SOCK_COLORS.rare) || L.acc.headbandColor !== GEAR_BAND.rare || L.acc.wristColor !== GEAR_BAND.epic || L.acc.sleeveColor !== GEAR_BAND.common) bad.push('the look ' + JSON.stringify({ shoes: L.shoes, socks: L.socks, acc: L.acc }));
    if (kit.sock !== GEAR_SOCK_COLORS.rare[0] || kit.wrist !== GEAR_BAND.epic || kit.legSleeve !== GEAR_BAND.common) bad.push('the kit ' + JSON.stringify({ sock: kit.sock, wrist: kit.wrist, sleeve: kit.legSleeve }));
    const k1 = lookKey(L), L2 = normLook(Object.assign({}, amDrawDef(a).look, { headbandColor: GEAR_BAND.epic }), a.name); if (lookKey(L2) === k1) bad.push('the face cache keys the headband\'s color');
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = 400; const ctx = cv.getContext('2d'); drawMannequin(ctx, amDrawDef(a), amKit(a), 200, 380, 300, 'hyped', 1, 0); drawPortrait(ctx, amDrawDef(a), amKit(a).colors, 10, 10, 96, 'neutral');
    if (bad.length) throw new Error(bad.join(' | ')); return 'ok';
  }, B));

  await step('money worth spending at every stage: at least two worthwhile buys you can\'t afford all at once with a stage\'s typical cash (high school a summer job\'s $1,000; college $5,000 of NIL; a rookie pro\'s first salary): the week\'s items and their upgrades, a skills camp, the staff', () => ev(([mkHs, mkPro]) => {
    const out = [], bad = [];
    for (const [stage, mk, cash] of [['hs', mkHs, HS.jobPay], ['college', mkHs, 5000], ['pro', mkPro, null]]) { const c = eval(mk)(61); if (stage === 'college') c.stage = 'college'; const wallet = cash != null ? cash : c.me.contract.salary; if (cash != null) c.cash = cash; else c.me.money = wallet;
      const S = gearStock(c), buys = []; for (const id of S.ids) { const it = gearItem(id); buys.push(gearStockPrice(c, id)); for (let lv = 2; lv <= it.max; lv++) buys.push(gearPrice(c, it, lv)); } /* an item, then each level up */
      if (stage === 'hs') buys.push(HS.campCost); if (stage === 'pro') buys.push(staffPool(c, 'skills')[0].salary, staffPool(c, 'physio')[0].salary);
      const can = buys.filter(p => p <= wallet).length, all = buys.reduce((s2, p) => s2 + p, 0);
      out.push(stage + ': ' + can + ' of ' + buys.length + ' buys within ' + gearMoney(wallet) + ', all of them ' + gearMoney(all)); if (can < 2 || all <= wallet) bad.push(out[out.length - 1]); }
    if (bad.length) throw new Error(bad.join(' | ')); return out.join(' · ');
  }, B));

  await step('the shop (desktop): three views, the shopkeeper\'s line, the shelves, Try it on (old → new), buying from a shelf, the locker (wear, take off, upgrade), the extras; the hub\'s SHOP tab opens it', () => ev(([mkHs]) => {
    const g = HH.game, bad = [], a = eval(mkHs)(71); g.save.data.c1 = a; g.save.data.career = null; a.cash = 5000; g.shopTab = null; g.ui.clearTo(amHub(g));
    const draw = () => { const s = g.ui.screen, ctx = g.canvas.getContext('2d'); ctx.save(); s.draw(ctx, g.ui); for (const w of s.widgets) if (!w.hidden) g.ui.drawWidget(ctx, w, false); ctx.restore(); };
    g.ui.push(shopScreen(g, 'stock')); draw(); let s = g.ui.screen; const cards = s.widgets.filter(w => w.kind === 'custom' && w.label && gearStock(a).ids.some(id => gearItem(id).name === w.label)); if (cards.length !== GEAR.stock) bad.push('six cards: ' + cards.length);
    const lines = shopRatingLines(a, gearStock(a).ids[0]); if (!lines.length || !/→|XP|FATIGUE|INJURY|No change/.test(lines[0][0])) bad.push('the try-on lines ' + JSON.stringify(lines));
    cards[1].onPress(); s = g.ui.screen; const buyB = s.widgets.find(w => /^Buy/.test(w.label || '')); const id = g.shopTab.sel, c0 = a.cash; if (!buyB || buyB.enabled === false) bad.push('no Buy for ' + id); else { buyB.onPress(); if (!gearOf(a).owned[id] || a.cash >= c0) bad.push('buying from the shelf'); }
    draw(); s = g.ui.screen; s.widgets.find(w => w.label === 'Locker').onPress(); /* (V13: the tab is 'Locker' now: four tabs fit) */ draw(); s = g.ui.screen; const up = s.widgets.find(w => /^Upgrade|^Maxed/.test(w.label || '')), wear = s.widgets.find(w => /^Wear|^Take/.test(w.label || '')); if (!up || !wear) bad.push('the locker\'s buttons'); else { const w0 = gearWearing(a, g.shopTab.sel); wear.onPress(); if (!!gearWearing(a, g.shopTab.sel) === !!w0) bad.push('wear / take off'); }
    draw(); s = g.ui.screen; s.widgets.find(w => w.label === 'Extras').onPress(); draw(); s = g.ui.screen; const ice = s.widgets.find(w => w.label === 'Ice bath'); a.fatigue = 40; ice.onPress(); if (a.fatigue !== 40 - GEAR.iceBath) bad.push('the ice bath from the screen');
    g.hubTab = 'shop'; g.ui.clearTo(amHub(g)); draw(); s = g.ui.screen; const door = s.widgets.find(w => w.label === 'Enter the shop'); if (!door) bad.push('no door on the hub'); else { door.onPress(); if (g.ui.screen.name !== 'shop') bad.push('the door'); }
    g.hubTab = 'play'; g.ui.clearTo(mainMenu(g)); if ((window.HH_ERRORS || []).length) bad.push('draw faults: ' + window.HH_ERRORS.slice(0, 2).join(' | '));
    if (bad.length) throw new Error(bad.join(' | ')); return 'bought ' + id;
  }, B));

  const P = await openPage(browser, { phone: true });
  await R.step('the shop (phone): the shelves as six cards, a card opens Try it on with Buy, the locker\'s rows open an item; every target 64 px; nothing overlaps or runs off the screen', () => P.ev(([mkHs, mkPro]) => {
    const g = HH.game, bad = []; if (!g.ui.phone) throw new Error('not a phone');
    const check = tag => { const s = g.ui.screen, ws = s.widgets.filter(w => !w.hidden && w.kind !== 'text'); for (const w of ws) { if (w.h * g.ui.scale < 63.5 || w.w * g.ui.scale < 63.5) bad.push(tag + ': ' + (w.label || w.kind) + ' ' + Math.round(w.w * g.ui.scale) + '×' + Math.round(w.h * g.ui.scale)); if (w.x < 0 || w.y < 0 || w.x + w.w > UI_W || w.y + w.h > UI_H) bad.push(tag + ': off screen ' + w.label); } for (let i = 0; i < ws.length; i++) for (let j = i + 1; j < ws.length; j++) { const a2 = ws[i], b2 = ws[j]; if (a2.x < b2.x + b2.w - 1 && b2.x < a2.x + a2.w - 1 && a2.y < b2.y + b2.h - 1 && b2.y < a2.y + a2.h - 1) bad.push(tag + ': overlap ' + a2.label + ' / ' + b2.label); } const ctx = g.canvas.getContext('2d'); ctx.save(); s.draw(ctx, g.ui); for (const w of ws) g.ui.drawWidget(ctx, w, false); ctx.restore(); };
    const c = eval(mkPro)(81); g.save.data.career = c; g.shopTab = null; g.ui.clearTo(careerHub(g)); g.ui.push(shopScreen(g, 'stock')); check('shelves');
    const card = g.ui.screen.widgets.find(w => w.kind === 'custom'); card.onPress(); if (g.shopTab.sub !== 'try') bad.push('a card opens the try-on'); check('try-on'); const buyB = g.ui.screen.widgets.find(w => /^Buy/.test(w.label || '')); if (buyB && buyB.enabled !== false) { buyB.onPress(); if (!gearOf(c.me).owned[g.shopTab.sel || card.label]) { /* bought: back on the shelves */ } } check('after buying');
    g.shopTab = { view: 'locker', sel: null, page: 0, sub: null }; g.ui.replace(shopScreen(g)); check('locker'); const row = g.ui.screen.widgets.find(w => w.kind === 'custom'); if (row) { row.onPress(); check('locker item'); }
    g.shopTab = { view: 'extras', sel: null, page: 0, sub: null }; g.ui.replace(shopScreen(g)); check('extras'); g.ui.clearTo(mainMenu(g));
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'ok';
  }, B), P);

  console.log(D.errors.length || P.errors.length ? 'page errors: ' + D.errors.concat(P.errors).slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
