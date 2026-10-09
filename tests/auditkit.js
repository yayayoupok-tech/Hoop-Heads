// The screen audit's checks (M9, F4, F7, F10, V1, V13), shared by the screen audits: tap targets under 64 CSS px on a
// phone, widgets off the screen or over each other, text running off its widget, text over text (F4), text cut short
// with "…" (F7), two screens' words at once (V1), a figure over text (F10) and text under the menus' pixel (V13). Each
// check runs in the page against one synchronous UI draw of the top screen. (Moved here from phoneaudit.js in 3.0.)
const path = require('path');
// Installs the checks in a page (P: openPage's api). opts.big: every screen at the 1.25× text size.
async function installAudit(P, opts) {
  const { ev } = P, big = !!(opts && opts.big);
  await ev(() => { const F = CanvasRenderingContext2D.prototype.fillText; window.__txt = []; CanvasRenderingContext2D.prototype.fillText = function (t, x, y, mw) { try { const m = /(\d+(?:\.\d+)?)px/.exec(this.font); if (m && window.__txtOn && String(t).trim()) { const a = this.getTransform().a / (window.devicePixelRatio || 1); window.__txt.push({ px: +m[1] * a, t: String(t).slice(0, 40) }); } } catch (e) {} return F.call(this, t, x, y, mw); }; });
  // text wider than the widget it is drawn in (a label running off its button)
  await ev(() => { const U = UI.prototype, D = U.drawWidget; window.__ovf = new Set(); U.drawWidget = function (ctx, w, f) { const F = ctx.fillText; ctx.fillText = function (t, x, y, mw) { try { if (window.__txtOn && w.kind !== 'text') { const m = Math.min(ctx.measureText(String(t)).width, mw > 0 ? mw : 1e9), al = ctx.textAlign; /* a maxWidth draws the text truncated to fit (the bitmap font adds …) */ const x0 = al === 'center' ? x - m / 2 : al === 'right' || al === 'end' ? x - m : x; if (x0 < w.x - 3 || x0 + m > w.x + w.w + 3) window.__ovf.add((w.label || w.kind) + ': "' + String(t).slice(0, 34) + '"'); } } catch (e) {} return F.call(this, t, x, y, mw); }; try { return D.call(this, ctx, w, f); } finally { delete ctx.fillText; } }; });
  // F4 (the user: "text overlaps, so we can't read other stuff"): every string's ink box from one synchronous UI draw;
  // two different strings whose boxes share more than a font pixel each way are flagged.
  await ev(() => { const U = UI.prototype, DS = U.drawScreen; U.drawScreen = function (ctx, s) { const on = RBF.boxes; if (!on || s === this.screen) return DS.call(this, ctx, s); const n0 = on.length; try { return DS.call(this, ctx, s); } finally { for (let i = n0; i < on.length; i++) on[i].under = s.name || '?'; } }; }); // V1: a screen under the top one: its strings are tagged (the two-screens check), the other checks skip them
  await ev(() => { const U = UI.prototype, DW = U.drawWidget; U.drawWidget = function (ctx, w, f) { const n0 = RBF.boxes ? RBF.boxes.length : 0; try { return DW.call(this, ctx, w, f); } finally { if (RBF.boxes) for (let i = n0; i < RBF.boxes.length; i++) RBF.boxes[i].w8 = w; } }; }); // F4: which widget drew each string (a string drawn outside every widget must not run under one) // only the top screen's text: an overlay's panel hides the screen under it
  await ev(() => { window.__textOverlaps = () => { const g = HH.game; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } catch (e) { /* the audit's own draw */ } const raw = (RBF.boxes || []).filter(b => !b.under); RBF.boxes = null; const B = [];
    for (const b of raw) { if (!String(b.t).trim() || b.a < 0.35 || b.w < 1) continue; if (B.some(a => a.t === b.t && Math.abs(a.x - b.x) <= 4 * b.s && Math.abs(a.y - b.y) <= 4 * b.s)) continue; B.push(b); }
    const out = []; for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], b = B[j]; if (a.t === b.t) continue; const px = Math.max(a.s, b.s), ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); if (ix > px && iy > px) out.push('"' + String(a.t).slice(0, 28) + '" × "' + String(b.t).slice(0, 28) + '"'); }
    const ui = g.ui, s = ui.screen, dpr = g.dpr, ws = ((s && s.widgets) || []).filter(w => !w.hidden && w.w > 0 && w.h > 0); // a string drawn by the screen (not by a widget) under a widget's box
    for (const b of B) { if (b.w8) continue; for (const w of ws) { if (w.label && String(w.label).trim() === String(b.t).trim()) continue; /* a screen drawing a widget's own symbol */ const x0 = (ui.ox + w.x * ui.scale) * dpr, y0 = (ui.oy + w.y * ui.scale) * dpr, x1 = x0 + w.w * ui.scale * dpr, y1 = y0 + w.h * ui.scale * dpr, ix = Math.min(b.x + b.w, x1) - Math.max(b.x, x0), iy = Math.min(b.y + b.h, y1) - Math.max(b.y, y0); if (ix > 2 * b.s && iy > 2 * b.s) { out.push('"' + String(b.t).slice(0, 28) + '" under [' + String(w.label || w.kind).slice(0, 20) + ']'); break; } } }
    return out; }; });
  // F7: text cut short with '…' (a maxW, the screen edge or a line limit) hides what it says: the top screen's strings
  // from one synchronous UI draw that the font or a paragraph cut (faint text a<0.35 skipped).
  await ev(() => { window.__textCuts = () => { const g = HH.game; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } catch (e) { /* the audit's own draw */ } const raw = RBF.boxes || []; RBF.boxes = null; const out = []; for (const b of raw) if (b.cut && !b.under && b.a >= 0.35 && !out.includes(String(b.cut).slice(0, 48))) out.push(String(b.cut).slice(0, 48)); return out; }; });
  // F10: a figure (a menu figure, a portrait, a trading card) drawn after a string and over at least a quarter of it hides
  // it: the top screen's strings from one synchronous UI draw against each figure's box (faint text a<0.35 skipped).
  await ev(() => { window.__artOverText = () => { const g = HH.game; RBF.boxes = []; RBF.art = []; try { g.drawUI(g.ctx, g.W, g.H); } catch (e) { /* the audit's own draw */ } const raw = RBF.boxes || [], art = RBF.art || []; RBF.boxes = null; RBF.art = null; const out = [];
    for (const A of art) for (let i = 0; i < Math.min(A.n, raw.length); i++) { const b = raw[i]; if (b.under || !String(b.t).trim() || b.a < 0.35 || b.w < 1) continue; const ix = Math.min(b.x + b.w, A.x + A.w) - Math.max(b.x, A.x), iy = Math.min(b.y + b.h, A.y + A.h) - Math.max(b.y, A.y); if (ix > 0 && iy > 0 && ix * iy >= 0.25 * b.w * b.h) { const k = '"' + String(b.t).slice(0, 28) + '" under a ' + A.kind; if (!out.includes(k)) out.push(k); } }
    return out; }; });
  // V1 (§1.8): two screens' words at once: every string the screens under the top one draw (an overlay's underlay) that
  // shares more than a font pixel each way with a string of the top screen, from one synchronous UI draw.
  await ev(() => { window.__twoScreens = () => { const g = HH.game, ui = g.ui, top = ui.screen, wrapped = []; RBF.boxes = [];
    const drawn = []; for (const s of ui.stack) if (s !== top && typeof s.draw === 'function') { const d = s.draw; wrapped.push([s, d]); s.draw = function () { drawn.push(s.name || '?'); const n0 = RBF.boxes ? RBF.boxes.length : 0; try { return d.apply(this, arguments); } finally { if (RBF.boxes) for (let i = n0; i < RBF.boxes.length; i++) RBF.boxes[i].under = s.name || '?'; } }; }
    try { g.drawUI(g.ctx, g.W, g.H); } catch (e) { /* the audit's own draw */ } finally { for (const [s, d] of wrapped) s.draw = d; }
    const raw = RBF.boxes || []; RBF.boxes = null; const U = raw.filter(b => b.under && String(b.t).trim() && b.a >= 0.05), Tp = raw.filter(b => !b.under && String(b.t).trim() && b.a >= 0.35), out = [];
    if (g.mode !== 'match' && top && top.overlay) for (const n of [...new Set(drawn)]) out.push('(' + n + ' drawn under the ' + (top.name || '?') + ' overlay)'); // a screen under an overlay shows its art and sprite text too
    for (const u of U) for (const b of Tp) { const px = Math.max(u.s, b.s), ix = Math.min(u.x + u.w, b.x + b.w) - Math.max(u.x, b.x), iy = Math.min(u.y + u.h, b.y + b.h) - Math.max(u.y, b.y); if (ix > px && iy > px) { const k = '"' + String(u.t).slice(0, 24) + '" (' + u.under + ') under "' + String(b.t).slice(0, 24) + '"'; if (!out.includes(k)) out.push(k); } }
    return out; }; });
  // V13 (2.0 §5): legibility: every string a screen shows, the ones baked into its trading cards too (the card cache is
  // emptied first so they bake inside this draw), at the menus' pixel or bigger: a glyph 10 font pixels tall is then at
  // least 10 internal pixels (RBF.kUI device px each: the 360-row grid of the 1280×720 area, rounded the way the menus
  // round it).
  await ev(() => { window.__legib = () => { const g = HH.game; try { _cards.clear(); } catch (e) { /* no cards yet */ } RBF.audit = []; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } catch (e) { /* the audit's own draw */ } const sc = RBF.audit || [], bx = (RBF.boxes || []).filter(b => !b.under && String(b.t).trim()); RBF.audit = null; RBF.boxes = null; const k = RBF.kUI || 1, out = [];
    for (const b of bx) if (b.s < k) { const t = '"' + String(b.t).slice(0, 24) + '" at ' + b.s + ' < ' + k; if (!out.includes(t)) out.push(t); }
    const min = sc.length ? Math.min(...sc) : k; if (min < k && !out.length) out.push('baked text at ' + min + ' < ' + k); return { out, min, k }; }; });
  if (big) await ev(() => { const D0 = defaultSave; window.defaultSave = () => { const d = D0(); d.settings.textSize = 1.25; return d; }; RBF.textScale = 1.25; });
}
// One screen's audit: open(arg) runs in the page and shows the screen; the result lists every flag. opts.dir: a
// screenshot per screen; opts.quiet: no line printed.
function makeAuditor(P, opts) {
  opts = opts || {}; const { ev, page } = P, dir = opts.dir, wait = ms => page.waitForTimeout(ms), texts = [], legib = [];
  const audit = async (name, open, arg) => {
    await ev(open, arg); await ev(() => { if (typeof REC_TOASTS !== 'undefined') REC_TOASTS.length = 0; HH.game.ui.toastT = 0; }); /* V8: a toast is an overlay (a record broken in the scripted career would cover the next screens); story.js checks the record toast */ await wait(450); await ev(() => { const s = HH.game.ui.screen; if (s && s.finish && !s.auditCard) s.finish(); }); /* (2.1: a chapter's title card stays up for its own case) */ /* R9: a dialogue box's text typed out */ await wait(80); await ev(() => { window.__txt = []; window.__ovf.clear(); window.__txtOn = true; }); await wait(120); const ovf = await ev(() => [...window.__ovf]); const tx = await ev(() => { window.__txtOn = false; const L = window.__txt.filter(o => o.px > 0.5).sort((a, b) => a.px - b.px); const seen = new Set(), out = []; for (const o of L) { if (seen.has(o.t)) continue; seen.add(o.t); out.push(o); if (out.length >= 3) break; } return out; });
    const r = await ev(() => { const ui = HH.game.ui, s = ui.screen; if (!s) return { name: '(none)', bad: [] }; const ws = (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && w.kind !== 'text'); const bad = [];
      for (const w of ws) { const hh = w.h * ui.scale, ww = w.w * ui.scale; if (ui.phone && (hh < 63.5 || ww < 63.5)) bad.push((w.label || w.kind) + ' ' + Math.round(ww) + '×' + Math.round(hh)); if (w.x < -1 || w.y < -1 || w.x + w.w > UI_W + 1 || w.y + w.h > UI_H + 1) bad.push('OFFSCREEN ' + (w.label || w.kind)); if (!(w.w >= 1 && w.h >= 1)) bad.push('ZERO-SIZE ' + (w.label || w.kind)); /* R9: a widget never laid out (it once threw inside its draw and leaked a zoom) */ }
      for (let i = 0; i < ws.length; i++) for (let j = i + 1; j < ws.length; j++) { const a = ws[i], b = ws[j]; if (a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1) bad.push('OVERLAP ' + (a.label || a.kind) + ' / ' + (b.label || b.kind)); }
      return { name: s.name, n: ws.length, bad }; });
    if (dir) await P.shot(path.join(dir, name + '.jpg'));
    for (const o of ovf) r.bad.push('TEXT OVERFLOW ' + o);
    for (const o of await ev(() => window.__textOverlaps())) r.bad.push('TEXT OVERLAP ' + o); // F4
    for (const o of await ev(() => window.__textCuts())) r.bad.push('TEXT CUT "' + o + '"'); // F7
    for (const o of await ev(() => window.__twoScreens())) r.bad.push('TWO SCREENS ' + o); // V1 (§1.8)
    for (const o of await ev(() => window.__artOverText())) r.bad.push('ART OVER TEXT ' + o); // F10
    { const L = await ev(() => window.__legib()); for (const o of L.out) r.bad.push('SMALL TEXT ' + o); legib.push(L.min / L.k); } // V13 (2.0 §5)
    const minTxt = tx.length ? tx[0].px : 99; texts.push({ name, min: minTxt, tx });
    r.minTxt = minTxt; if (!opts.quiet) console.log((r.bad.length ? 'FLAG  ' : 'ok    ') + name + ' (' + r.name + ', ' + r.n + ' widgets, min text ' + minTxt.toFixed(1) + ' px)' + (r.bad.length ? ': ' + r.bad.slice(0, 12).join(' | ') + (r.bad.length > 12 ? ' …+' + (r.bad.length - 12) : '') : ''));
    return r;
  };
  audit.texts = texts; audit.legib = legib; return audit;
}
module.exports = { installAudit, makeAuditor };
