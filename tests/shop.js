// V11 (Part 2 §5); 3.0 (§1, §6.1): the store. Twelve items, the same every week, levels 1–5 and no rarity: five worn
// (shoes, socks, sleeve, headband, wristbands: a rating in games each, and Lv5 a second one), five training items
// (practice XP) and two recovery items (fatigue, injuries); never more than +4 to one rating; prices by the level and the
// stage you're at; buying, upgrading, wearing; try it on; the week's extras (an ice bath, a film session, a sports drink);
// lifestyle's weekly effects and upkeep; family help in high school; the Road's free levels; gear on your player; two
// worthwhile buys you can't afford at once at every stage; the store's screens on a desktop and a phone. (Money over a
// career: tests/careersim.js's money line.) Usage: node tests/shop.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('shop'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  const mkHs = `(seed => { const a = amCreate(defaultSave(), { name: 'Shop Test', look: PRESET_LOOKS[seed % 16], number: 7, style: 'shooter', seed }); hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; a.fatigue = 0; a.injury = null; return a; })`; // through the tryout: a team and a season
  const mkPro = `(seed => { const save = defaultSave(), c = testProLeague(seed, save); save.career = c; c.events.length = 0; c.me.money = 2e7; return c; })`;
  const B = [mkHs, mkPro];

  await step('the catalogue (3.0 §6.1): twelve items, levels 1–5, no rarity: five worn (shoes, socks, sleeve, headband, wristbands) add to one rating in games (Lv5: +1 to a second), five training items add practice XP, two recovery items cut fatigue or injuries; every item has a pixel icon', () => ev(() => {
    const bad = [], kinds = {}; if (GEAR_IDS.length !== 12) bad.push(GEAR_IDS.length + ' items'); for (const id of GEAR_IDS) { const it = gearItem(id); kinds[it.kind] = (kinds[it.kind] || 0) + 1; if (!GEAR_ICON_MAPS[it.icon]) bad.push(id + ': no icon'); if (it.max !== 5 || it.rarity || it.sig) bad.push(id + ': levels 1–5, no rarity'); if (it.kind === 'rating' && (!it.also || it.also === it.k)) bad.push(id + ': a second rating at Lv5'); }
    for (const s of ['shoes', 'socks', 'sleeve', 'head', 'wrist']) if (GEAR_IDS.filter(id => GEAR_FAM[id].slot === s && GEAR_FAM[id].kind === 'rating').length !== 1) bad.push('one item for ' + s);
    if (kinds.xp !== 5 || kinds.regen !== 1 || kinds.injury !== 1 || kinds.rating !== 5) bad.push('kinds ' + JSON.stringify(kinds)); if (gearItem('courtShoes:rare') || gearItem('sigShoes') || typeof GEAR_SIG !== 'undefined' || typeof GEAR_RARITY !== 'undefined') bad.push('rarities or collabs left');
    for (const icon in GEAR_ICON_MAPS) { const m = GEAR_ICON_MAPS[icon]; if (m.length !== 16 || m.some(r => r.length !== 16)) bad.push(icon + ' is not 16×16'); }
    if (GEAR_SLOTS.length !== 8 || GEAR_SLOTS.filter(s => s[1] === 'Training').length !== 2) bad.push('slots');
    const sh = gearItem('courtShoes'); if (gearEffectText(sh, 4) !== 'Speed +4 in games' || gearEffectText(sh, 5) !== 'Speed +4, Hops +1 in games') bad.push('the levels in words: ' + gearEffectText(sh, 5));
    if (bad.length) throw new Error(bad.join(' | ')); return GEAR_IDS.length + ' items · ' + JSON.stringify(kinds);
  }));

  await step('the +4 cap: a Lv5 item\'s second rating counts toward it (the try-on says so, at the item\'s next level); in games only: OVR and value never move', () => ev(([mkHs, mkPro]) => {
    const a = eval(mkHs)(11), G = gearOf(a), bad = []; G.owned = { shooterSleeve: 4, gripBands: 5 }; gearEquip(a, 'shooterSleeve'); gearEquip(a, 'gripBands');
    if (gearBonusRaw(a).sho !== 5 || gearBonus(a).sho !== 4 || gearBonus(a).han !== 4) bad.push('sleeve Lv4 + wristbands Lv5: ' + JSON.stringify(gearBonusRaw(a)));
    const T = gearTryOn(a, 'shooterSleeve'); if (!T || T.after.sho !== 4 || T.raw.sho !== 5 || T.after.fin !== 1) bad.push('try-on at Lv5: ' + JSON.stringify(T && T.after)); if (G.owned.shooterSleeve !== 4 || G.eq.wrist !== 'gripBands') bad.push('a try-on changes nothing');
    const ovr = amOvr(a); gearUnequip(a, 'gripBands'); if (amOvr(a) !== ovr) bad.push('OVR moved');
    const c = eval(mkPro)(12), v0 = frValue(c), o0 = recOvr(meOf(c)); const G2 = gearOf(c.me); G2.owned = {}; G2.eq = {}; gearGive(c.me, 'courtShoes'); if (frValue(c) !== v0 || recOvr(meOf(c)) !== o0) bad.push('a pro\'s value or OVR moved'); const e = wkEff(meOf(c).r, meOf(c).h, c.me), e0 = effRatings(meOf(c).r, meOf(c).h); if (Math.abs(e.spd - e0.spd - 1) > 1e-6) bad.push('the court shoes in games: ' + (e.spd - e0.spd));
    if (bad.length) throw new Error(bad.join(' | ')); return 'capped at +' + GEAR.cap;
  }, B));

  await step('the store (3.0 §6.1): every item every week (no stock, nothing featured or sold out) at the stage\'s prices by level (high school $60–$400, college $600–$4K, the pros $10K–$400K); cash pays as an amateur, money as a pro; buying Lv1, upgrading to Lv5, wearing, taking off, two training slots; the next step', () => ev(([mkHs, mkPro]) => {
    const bad = [], span = st => [Math.min(...GEAR.price[st]), Math.max(...GEAR.price[st])];
    const want = { hs: [60, 400], college: [600, 4000], pro: [10000, 400000] }; for (const st in want) { const [lo, hi] = span(st); if (lo !== want[st][0] || hi !== want[st][1] || GEAR.price[st].length !== 5) bad.push(st + ' ' + lo + '–' + hi); }
    for (const k of ['stock', 'featuredOff', 'soldOut', 'rarityOdds', 'sigStart']) if (k in GEAR) bad.push('GEAR.' + k + ' is left'); if (typeof gearStock === 'function' || typeof gearStockPrice === 'function') bad.push('a weekly stock');
    const a = eval(mkHs)(21), G = gearOf(a); a.cash = 1e5; const c0 = a.cash; if (!gearBuy(a, 'courtShoes') || G.owned.courtShoes !== 1 || a.cash !== c0 - GEAR.price.hs[0] || G.eq.shoes !== 'courtShoes') bad.push('buying Lv1, worn at once');
    a.stage = 'college'; if (gearNextPrice(a, 'courtShoes') !== GEAR.price.college[1]) bad.push('a college upgrade'); a.stage = 'hs';
    const c1 = a.cash; for (let k = 0; k < 4; k++) gearUpgrade(a, 'courtShoes'); if (G.owned.courtShoes !== 5 || gearUpgrade(a, 'courtShoes') || a.cash !== c1 - GEAR.price.hs.slice(1).reduce((x, y) => x + y, 0)) bad.push('upgrades to Lv5: ' + G.owned.courtShoes);
    gearUnequip(a, 'courtShoes'); if (G.eq.shoes) bad.push('take off'); gearEquip(a, 'courtShoes'); if (G.eq.shoes !== 'courtShoes') bad.push('wear');
    for (const t of ['plyoBox', 'slideSled', 'weightedVest']) gearBuy(a, t); if (!G.eq.train1 || !G.eq.train2 || G.eq.train1 === G.eq.train2) bad.push('two training slots ' + JSON.stringify(G.eq));
    { const n = gearNextStep(a); if (!n || !(n.price > 0) || !(gearWearing(a, n.id) || !G.owned[n.id])) bad.push('the next step ' + JSON.stringify(n)); }
    const c = eval(mkPro)(22), m0 = c.me.money; gearOf(c.me).owned = {}; gearOf(c.me).eq = {}; if (!gearBuy(c, 'gripSocks') || c.me.money !== m0 - GEAR.price.pro[0]) bad.push('a pro pays money at pro prices');
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

  await step('lifestyle: each buy adds its weekly effect (confidence or fame) and costs its upkeep every game week; family help in high school ($' + 15 + ' a game week); the Road\'s gear rewards are a free level (Lv1 when the item is new), worn at once', () => ev(([mkHs, mkPro]) => {
    const bad = [], c = eval(mkPro)(41), M = c.me; M.lifestyle = {}; for (const it of PR.lifestyle) M.lifestyle[it.id] = c.season; M.confidence = 0; M.fame = 20; M.endorsements = []; const rec = {}; weeklyFinance(c, rec);
    const up = PR.lifestyle.reduce((s2, it) => s2 + (it.upkeep || 0), 0), W = k => PR.lifestyle.reduce((s2, it) => s2 + ((it.weekly || {})[k] || 0), 0);
    if (rec.upkeep !== up || Math.abs(M.fame - (20 + W('fame'))) > 1e-9 || !(M.confidence > 0) || W('hype')) bad.push('lifestyle: upkeep ' + rec.upkeep + ' of ' + up + ', fame ' + M.fame + ', confidence ' + M.confidence);
    const a = eval(mkHs)(42); a.cash = 0; let n = 0; while (n++ < 3 && amNext(a)) { a.events.length = 0; amSimGame(a); } if (!(a.cash >= GEAR.familyHelp * 2)) bad.push('family help: $' + a.cash);
    const b = eval(mkHs)(43); gearOf(b).owned = {}; gearOf(b).eq = {}; b.offers = [{ name: 'Test U', tier: 1 }]; roadCheck(b); const G = gearOf(b); if (G.owned.courtShoes !== 1 || G.eq.shoes !== 'courtShoes') bad.push('the Road\'s court shoes: Lv' + G.owned.courtShoes); gearGive(b, 'courtShoes'); if (G.owned.courtShoes !== 2) bad.push('a second free level: ' + JSON.stringify(G.owned)); G.owned.courtShoes = 5; if (gearGive(b, 'courtShoes')) bad.push('nothing past Lv5');
    if (bad.length) throw new Error(bad.join(' | ')); return 'upkeep $' + up.toLocaleString() + ' a week for all four · family help after 3 games $' + a.cash;
  }, B));

  await step('gear on your player: shoes, socks, the sleeve, the headband and the wristbands in their level\'s colors (in games, on the hub and in portraits); pixel mode keeps a gear color in the palette', () => ev(([mkHs]) => {
    const a = eval(mkHs)(51), G = gearOf(a), bad = []; G.owned = { courtShoes: 4, gripSocks: 2, sweatband: 2, gripBands: 4, shooterSleeve: 1 }; G.eq = {}; gearOf(a); for (const id in G.owned) gearEquip(a, id);
    const L = normLook(amDrawDef(a).look, a.name), kit = kitOf({ colors: ['#2E6FD8', '#F3F0FF'] }, L);
    if (JSON.stringify(L.shoes) !== JSON.stringify(GEAR_SHOE_COLORS[3]) || JSON.stringify(L.socks) !== JSON.stringify(GEAR_SOCK_COLORS[1]) || L.acc.headbandColor !== GEAR_BAND[1] || L.acc.wristColor !== GEAR_BAND[3] || L.acc.sleeveColor !== GEAR_BAND[0]) bad.push('the look ' + JSON.stringify({ shoes: L.shoes, socks: L.socks, acc: L.acc }));
    if (kit.sock !== GEAR_SOCK_COLORS[1][0] || kit.wrist !== GEAR_BAND[3] || kit.legSleeve !== GEAR_BAND[0]) bad.push('the kit ' + JSON.stringify({ sock: kit.sock, wrist: kit.wrist, sleeve: kit.legSleeve }));
    const k1 = lookKey(L), L2 = normLook(Object.assign({}, amDrawDef(a).look, { headbandColor: GEAR_BAND[4] }), a.name); if (lookKey(L2) === k1) bad.push('the face cache keys the headband\'s color');
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = 400; const ctx = cv.getContext('2d'); drawMannequin(ctx, amDrawDef(a), amKit(a), 200, 380, 300, 'hyped', 1, 0); drawPortrait(ctx, amDrawDef(a), amKit(a).colors, 10, 10, 96, 'neutral');
    if (bad.length) throw new Error(bad.join(' | ')); return 'ok';
  }, B));

  await step('money worth spending at every stage: at least two worthwhile buys you can\'t afford all at once with a stage\'s typical cash (high school a summer job\'s $1,000; college $5,000 of NIL; a rookie pro\'s first salary): every item and its levels, a skills camp, a car', () => ev(([mkHs, mkPro]) => {
    const out = [], bad = [];
    for (const [stage, mk, cash] of [['hs', mkHs, HS.jobPay], ['college', mkHs, 5000], ['pro', mkPro, null]]) { const c = eval(mk)(61); if (stage === 'college') c.stage = 'college'; const wallet = cash != null ? cash : c.me.contract.salary; if (cash != null) c.cash = cash; else c.me.money = wallet;
      const buys = []; for (const id of GEAR_IDS) { const it = gearItem(id); for (let lv = 1; lv <= it.max; lv++) buys.push(gearPrice(c, it, lv)); } /* an item, then each level up */
      if (stage === 'hs') buys.push(HS.campCost); if (stage === 'pro') buys.push(PR.lifestyle[0].cost);
      const can = buys.filter(p => p <= wallet).length, all = buys.reduce((s2, p) => s2 + p, 0);
      out.push(stage + ': ' + can + ' of ' + buys.length + ' buys within ' + gearMoney(wallet) + ', all of them ' + gearMoney(all)); if (can < 2 || all <= wallet) bad.push(out[out.length - 1]); }
    if (bad.length) throw new Error(bad.join(' | ')); return out.join(' · ');
  }, B));

  await step('the store (desktop): its views, the shopkeeper\'s line, the shelves (six items a page, two pages), Try it on (old → new), buying from a shelf, the locker (wear, take off, upgrade), the extras; the hub\'s SHOP tab opens it', () => ev(([mkHs]) => {
    const g = HH.game, bad = [], a = eval(mkHs)(71); g.save.data.c1 = a; g.save.data.career = null; a.cash = 5000; g.shopTab = null; g.ui.clearTo(amHub(g));
    const draw = () => { const s = g.ui.screen, ctx = g.canvas.getContext('2d'); ctx.save(); s.draw(ctx, g.ui); for (const w of s.widgets) if (!w.hidden) g.ui.drawWidget(ctx, w, false); ctx.restore(); };
    g.ui.push(shopScreen(g, 'store')); draw(); let s = g.ui.screen; const cards = s.widgets.filter(w => w.kind === 'custom' && w.label && GEAR_IDS.some(id => gearItem(id).name === w.label)); if (cards.length !== 6) bad.push('six cards: ' + cards.length);
    { const nx = s.widgets.find(w => w.label === '▶'); nx.onPress(); draw(); const names = g.ui.screen.widgets.filter(w => w.kind === 'custom').map(w => w.label); if (!names.includes('Knee brace')) bad.push('the second page: ' + names.join(', ')); g.ui.screen.widgets.find(w => w.label === '◀').onPress(); s = g.ui.screen; }
    const lines = shopRatingLines(a, GEAR_IDS[0]); if (!lines.length || !/→|XP|FATIGUE|INJURY|No change/.test(lines[0][0])) bad.push('the try-on lines ' + JSON.stringify(lines));
    s.widgets.filter(w => w.kind === 'custom' && w.label === gearItem(GEAR_IDS[1]).name)[0].onPress(); s = g.ui.screen; const buyB = s.widgets.find(w => /^Buy/.test(w.label || '')); const id = g.shopTab.sel, c0 = a.cash; if (!buyB || buyB.enabled === false) bad.push('no Buy for ' + id); else { buyB.onPress(); if (!gearOf(a).owned[id] || a.cash >= c0) bad.push('buying from the shelf'); }
    draw(); s = g.ui.screen; s.widgets.find(w => w.label === 'Locker').onPress(); /* (V13: the tab is 'Locker' now: four tabs fit) */ draw(); s = g.ui.screen; const up = s.widgets.find(w => /^Upgrade|^Maxed/.test(w.label || '')), wear = s.widgets.find(w => /^Wear|^Take/.test(w.label || '')); if (!up || !wear) bad.push('the locker\'s buttons'); else { const w0 = gearWearing(a, g.shopTab.sel); wear.onPress(); if (!!gearWearing(a, g.shopTab.sel) === !!w0) bad.push('wear / take off'); }
    draw(); s = g.ui.screen; s.widgets.find(w => w.label === 'Extras').onPress(); draw(); s = g.ui.screen; const ice = s.widgets.find(w => w.label === 'Ice bath'); a.fatigue = 40; ice.onPress(); if (a.fatigue !== 40 - GEAR.iceBath) bad.push('the ice bath from the screen');
    g.hubTab = 'shop'; g.ui.clearTo(amHub(g)); draw(); s = g.ui.screen; const door = s.widgets.find(w => w.label === 'Enter the store'); if (!door) bad.push('no door on the hub'); else { door.onPress(); if (g.ui.screen.name !== 'shop') bad.push('the door'); }
    g.hubTab = 'play'; g.ui.clearTo(mainMenu(g)); if ((window.HH_ERRORS || []).length) bad.push('draw faults: ' + window.HH_ERRORS.slice(0, 2).join(' | '));
    if (bad.length) throw new Error(bad.join(' | ')); return 'bought ' + id;
  }, B));

  const P = await openPage(browser, { phone: true });
  await R.step('the store (phone): the shelves as six cards a page, a card opens Try it on with Buy, the locker\'s rows open an item; every target 64 px; nothing overlaps or runs off the screen', () => P.ev(([mkHs, mkPro]) => {
    const g = HH.game, bad = []; if (!g.ui.phone) throw new Error('not a phone');
    const check = tag => { const s = g.ui.screen, ws = s.widgets.filter(w => !w.hidden && w.kind !== 'text'); for (const w of ws) { if (w.h * g.ui.scale < 63.5 || w.w * g.ui.scale < 63.5) bad.push(tag + ': ' + (w.label || w.kind) + ' ' + Math.round(w.w * g.ui.scale) + '×' + Math.round(w.h * g.ui.scale)); if (w.x < 0 || w.y < 0 || w.x + w.w > UI_W || w.y + w.h > UI_H) bad.push(tag + ': off screen ' + w.label); } for (let i = 0; i < ws.length; i++) for (let j = i + 1; j < ws.length; j++) { const a2 = ws[i], b2 = ws[j]; if (a2.x < b2.x + b2.w - 1 && b2.x < a2.x + a2.w - 1 && a2.y < b2.y + b2.h - 1 && b2.y < a2.y + a2.h - 1) bad.push(tag + ': overlap ' + a2.label + ' / ' + b2.label); } const ctx = g.canvas.getContext('2d'); ctx.save(); s.draw(ctx, g.ui); for (const w of ws) g.ui.drawWidget(ctx, w, false); ctx.restore(); };
    const c = eval(mkPro)(81); g.save.data.career = c; g.shopTab = null; g.ui.clearTo(careerHub(g)); g.ui.push(shopScreen(g, 'store')); check('shelves');
    const card = g.ui.screen.widgets.find(w => w.kind === 'custom'); card.onPress(); if (g.shopTab.sub !== 'try') bad.push('a card opens the try-on'); check('try-on'); const buyB = g.ui.screen.widgets.find(w => /^Buy/.test(w.label || '')); if (buyB && buyB.enabled !== false) { buyB.onPress(); if (!gearOf(c.me).owned[g.shopTab.sel || card.label]) { /* bought: back on the shelves */ } } check('after buying');
    g.shopTab = { view: 'locker', sel: null, page: 0, sub: null }; g.ui.replace(shopScreen(g)); check('locker'); const row = g.ui.screen.widgets.find(w => w.kind === 'custom'); if (row) { row.onPress(); check('locker item'); }
    g.shopTab = { view: 'extras', sel: null, page: 0, sub: null }; g.ui.replace(shopScreen(g)); check('extras'); g.ui.clearTo(mainMenu(g));
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'ok';
  }, B), P);

  console.log(D.errors.length || P.errors.length ? 'page errors: ' + D.errors.concat(P.errors).slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
