// 3.0 (§10, §11): app readiness. The store: the web build's stub provider is disabled (purchase(sku) sells nothing),
// every price comes from the one config table (ECONOMY: no price literal anywhere else in CONFIG, the sections read it,
// a change there is what the game charges), the products are fair (fixed contents, each also earned by playing; the
// Unlimited unlock comes with a Hall of Fame career) and the build holds no payment code. Saves are versioned and can
// be exported and imported (a code that round-trips; an older one migrates, a newer one is refused). An upright phone
// turns the game (or asks to rotate), and nothing goes to the network.
// node tests/store30.js   (ONLY=<regex> runs the matching steps)
const fs = require('fs'), path = require('path');
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const P = await openPage(browser); const { ev } = P; const R = runner('APP READINESS (3.0 §10)');
  await ev(() => { window.__pro = s => { const sv = defaultSave(), c = testProLeague(s, sv); sv.career = c; sv.c1.handedOff = true; HH.game.save.data = sv; c.events = []; c.inbox = []; return { sv, c }; }; });

  await R.step('§11 the store: the stub provider is disabled; purchase(sku) sells nothing and gives nothing (an unknown product neither)', () => ev(async () => {
    const { c } = __pro(36), B = holderOf(c), cr0 = B.credits || 0, p = storeProvider();
    if (p.id !== 'stub' || p.enabled !== false || storeOpen()) throw new Error('the provider: ' + JSON.stringify({ id: p.id, enabled: p.enabled }));
    const out = []; for (const s of storeCatalogue()) { const r = await purchase(s.sku, HH.game); if (r.ok || r.reason !== 'disabled') throw new Error(s.sku + ': ' + JSON.stringify(r)); out.push(s.sku); }
    const u = await purchase('gems.1000', HH.game); if (u.ok || u.reason !== 'unknown') throw new Error('an unknown product: ' + JSON.stringify(u));
    if ((B.credits || 0) !== cr0 || (HH.game.save.data.unlocks || {}).unlimited) throw new Error('something was given');
    const fake = { id: 'test', enabled: true, purchase: item => Promise.resolve({ ok: true, sku: item.sku }) }; storeUseProvider(fake); let r2; try { r2 = await purchase('credits.small', HH.game); } finally { storeUseProvider(null); }
    if (!r2.ok || (B.credits || 0) !== cr0 + CONFIG.store.skus.find(s => s.sku === 'credits.small').credits || storeProvider() !== p) throw new Error('the provider interface: ' + JSON.stringify(r2) + ' credits ' + B.credits);
    return out.length + ' products, every one "disabled" · an app\'s provider (a test one) gives what it sells, then the stub is back';
  }), P);

  await R.step('§11 every price comes from the config table: no price literal in CONFIG outside ECONOMY, the sections read it, and a change there is what the game charges', async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'), i = html.indexOf('const CONFIG = {'), j = html.indexOf('\n};', i), src = html.slice(i, j);
    if (i < 0 || j < 0) throw new Error('CONFIG not found');
    const KEY = /\b(cost|costs|price|prices|upkeep|tuition|[a-z]+Cost|[a-z]+Costs|foundationPer|costPerStar|share|consumable|pay)\s*:\s*(?:\[\s*|\{\s*\w+\s*:\s*\[?\s*)?(\d+(?:\.\d+)?)/g;
    const NOT_MONEY = ['sprintCost', 'moveCost', 'jumpCost', 'shoveCost', 'trustCost']; // stamina and trust, not money
    const hits = []; src.split('\n').forEach((l0, n) => { const l = l0.replace(/\/\/.*$/, '').replace(new RegExp('/[*].*?[*]/', 'g'), ''); let m; KEY.lastIndex = 0; while ((m = KEY.exec(l))) { if (NOT_MONEY.includes(m[1]) || +m[2] < 1) continue; hits.push((n + 1) + ': ' + m[0]); } }); // (shares and rates are under one)
    if (hits.length) throw new Error('price literals outside ECONOMY: ' + hits.slice(0, 6).join(' | '));
    const r = await ev(() => { const E = CONFIG.economy, chk = [[CONFIG.gear.price, E.gear], [CONFIG.gear.consumable, E.consumable], [CONFIG.celebs.price, E.celebration], [CONFIG.crew.pay, E.crewPay], [CONFIG.crew.up, E.crewCredits], [CONFIG.career.gymCost, E.gym], [CONFIG.career.cosmeticCosts, E.cosmetics]];
      const same = chk.filter(([a, b]) => a !== b).length; if (same) throw new Error(same + ' sections don\'t read ECONOMY');
      const { c } = __pro(36), it = gearItem(GEAR_IDS.find(id => !gearItem(id).won)), was = E.gear.pro[0]; E.gear.pro[0] = 12345; const g = gearPrice(c, it, 1); E.gear.pro[0] = was;
      const fac = BIG.facility.cost === E.big.facility[0] && bigCost(c, 'facility') === E.big.facility[0], pay0 = E.crewPay.pro; E.crewPay.pro = 777; const cp = crewPay(c, { role: 'skills', lv: 1 }); E.crewPay.pro = pay0;
      if (g !== 12345 || !fac || cp !== Math.round(777 * CREW.lvPay[0])) throw new Error('a change in ECONOMY: gear ' + g + ', facility ' + fac + ', crew pay ' + cp);
      return Object.keys(E).length; });
    return r + ' groups in ECONOMY; no price elsewhere in CONFIG; a change there is the price';
  }, P);

  await R.step('§10 fair: every product gives exactly what it says (no paid random rewards), can also be earned by playing, has its price tier in ECONOMY; Unlimited comes with a Hall of Fame career; no payment code', async () => {
    const r = await ev(() => { const S = storeCatalogue(), bad = [];
      for (const s of S) { if (['random', 'chance', 'pool', 'odds', 'roll', 'box'].some(k => k in s)) bad.push(s.sku + ' is random'); if (!s.earn) bad.push(s.sku + ' has no way to earn it'); if (!s.tier) bad.push(s.sku + ' has no tier'); if (s.kind === 'credits' && !(s.credits > 0)) bad.push(s.sku + ' credits'); }
      const unlocks = S.filter(s => s.kind === 'unlock'); if (unlocks.length !== 1 || unlocks[0].sku !== 'unlimited') bad.push('one unlock: ' + unlocks.map(s => s.sku));
      for (const k of ['jerseys', 'shoes', 'courts', 'celebrations']) if (!S.some(s => s.sku === 'cosmetic.' + k)) bad.push('no ' + k);
      if (bad.length) throw new Error(bad.join(' · '));
      const { sv, c } = __pro(36); c.me.careerStats.titles = 40; c.me.awards = Array.from({ length: 40 }, (_, i) => ({ s: i + 1, name: 'MVP' })); sv.unlocks = { arena: true }; const L = retireCareer(sv); if (!L.hof || !sv.unlocks.unlimited) throw new Error('a Hall of Fame career: unlimited ' + sv.unlocks.unlimited + ' (legacy ' + L.score + ')');
      return S.length + ' products (' + S.map(s => s.sku).join(', ') + ')'; });
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'), pay = /new PaymentRequest|ApplePaySession|Stripe\(|paypal\.|braintree\.|google\.payments|window\.billing/i.exec(html); if (pay) throw new Error('payment code: ' + pay[0]);
    return r + ' · Unlimited earned by a Hall of Fame career · no payment code';
  }, P);

  await R.step('§10 versioned saves you can export: a save code round-trips, carries its version, an older one is brought up to date, a newer or damaged one is refused; the Save tab has its three doors', () => ev(() => {
    const g = HH.game, { sv, c } = __pro(36); g.save.data = sv; const name = meOf(c).name, season = c.season, ovr = recOvr(meOf(c)); sv.settings.upright = 'ask';
    const code = g.save.exportCode(); if (!/^HH3:/.test(code)) throw new Error('the code: ' + code.slice(0, 12));
    const env = JSON.parse(b64DecUtf8(code.slice(4))); if (env.v !== CONFIG.save.version || env.game !== CONFIG.version || env.app !== 'hoopheads') throw new Error('the envelope ' + JSON.stringify({ v: env.v, game: env.game, app: env.app }));
    g.save.data = defaultSave(); g.save.data.settings.upright = 'turn'; const r = g.save.importCode(code); const c2 = g.save.data.career;
    if (!r.ok || !c2 || meOf(c2).name !== name || c2.season !== season || recOvr(meOf(c2)) !== ovr || g.save.data.settings.upright !== 'turn') throw new Error('the round trip: ' + JSON.stringify({ ok: r.ok, why: r.why, name: c2 && meOf(c2).name, season: c2 && c2.season }));
    const old = JSON.parse(JSON.stringify(sv)); old.version = 4; const oldCode = 'HH3:' + b64EncUtf8(JSON.stringify({ app: 'hoopheads', v: 4, game: '2.1', at: 0, data: old })); const r4 = saveImportCode(oldCode); if (!r4.ok || r4.data.version !== CONFIG.save.version) throw new Error('an older save: ' + JSON.stringify({ ok: r4.ok, why: r4.why }));
    const newer = 'HH3:' + b64EncUtf8(JSON.stringify({ app: 'hoopheads', v: CONFIG.save.version + 1, game: '9.9', data: {} })); if (saveImportCode(newer).ok || saveImportCode('HH3:%%%').ok || saveImportCode('hello').ok) throw new Error('a newer or damaged code was taken');
    const s = settingsScreen(g, SET_TABS.indexOf('Save')), labels = s.widgets.filter(w => !w.hidden).map(w => w.label); for (const l of ['Copy this save as a code', 'Load a save code…', 'Load a save file…']) if (!labels.includes(l)) throw new Error('the Save tab: ' + labels.join(' | '));
    return 'a ' + Math.round(code.length / 1024) + ' KB code (v' + env.v + ', ' + env.game + ') · a v4 save migrates · a newer or damaged one refused';
  }), P);

  await R.step('§10 the save code\'s box: copy shows the code to copy, paste loads it into the slot (a bad code says why and stays open)', async () => {
    const r = await ev(() => { const g = HH.game, { sv } = __pro(36); g.save.data = sv; const code = g.save.exportCode(); ioOverlay(g, { title: 'YOUR SAVE CODE', text: code, readOnly: true }); const d = document.getElementById('hh-io'), ta = d && d.querySelector('textarea'); const okCopy = !!(ta && ta.readOnly && ta.value === code); ioOverlayClose();
      saveIoPaste(g); const d2 = document.getElementById('hh-io'), ta2 = d2.querySelector('textarea'), btns = [...d2.querySelectorAll('button')]; ta2.value = 'HH3:bad'; btns[0].click(); const stays = !!document.getElementById('hh-io'), why = d2.querySelectorAll('div')[2] ? d2.querySelectorAll('div')[2].textContent : '';
      g.save.data = defaultSave(); ta2.value = code; btns[0].click(); const gone = !document.getElementById('hh-io'), loaded = !!(g.save.data.career && g.save.data.career.season);
      return { okCopy, stays, why, gone, loaded, screen: g.ui.screen && g.ui.screen.name }; });
    if (!r.okCopy || !r.stays || !/damaged|cut short|isn't/.test(r.why) || !r.gone || !r.loaded) throw new Error(JSON.stringify(r));
    return 'a bad code: "' + r.why + '" · a good one loads (then ' + r.screen + ')';
  }, P);

  await R.step('§10 an upright phone turns the game (the default) or asks to rotate; a tap lands where it shows', async () => {
    const Pp = await openPage(browser, { phone: true, portrait: true, wait: 900 });
    const r = await Pp.ev(() => new Promise(res => requestAnimationFrame(() => requestAnimationFrame(() => { const g = HH.game, t = g.turned, tr = g.canvas.style.transform, xy = inXY({ clientX: 100, clientY: 200 });
      g.save.data.settings.upright = 'ask'; g.resize(); requestAnimationFrame(() => { const ask = { portrait: g.portrait, W: g.W, H: g.H, tr: g.canvas.style.transform }; g.save.data.settings.upright = 'turn'; g.resize(); res({ t, W: g.W, H: g.H, tr, xy, portrait: g.portrait, ask }); }); }))));
    const errs = Pp.errors.slice(); await Pp.context.close();
    if (!r.t || !(r.W > r.H) || !/rotate\(90deg\)/.test(r.tr) || r.portrait) throw new Error('turned: ' + JSON.stringify(r));
    if (r.xy[0] !== 200 || r.xy[1] !== r.t.vw - 100) throw new Error('the tap: ' + JSON.stringify(r.xy));
    if (!r.ask.portrait || r.ask.W > r.ask.H || r.ask.tr) throw new Error('ask to rotate: ' + JSON.stringify(r.ask));
    if (errs.length) throw new Error(errs.slice(0, 2).join(' | '));
    return '390×844: the game turned (' + r.W + '×' + r.H + '), a tap at (100, 200) lands at (' + r.xy.join(', ') + ') · Ask to rotate: the rotate screen';
  }, P);

  await R.step('§10 offline: one file, nothing from the network (the optional font aside), no frame errors', async () => {
    const net = P.errors.filter(e => /\[network\]/.test(e)); if (net.length) throw new Error(net.slice(0, 2).join(' | '));
    const fe = await P.frameErrors(); if (fe.length) throw new Error(fe.slice(0, 2).join(' | '));
    return 'no requests' + (P.notes.size ? ' (' + [...P.notes].join('; ') + ')' : '');
  }, P);
  await browser.close(); process.exit(R.done() ? 1 : 0);
})();
