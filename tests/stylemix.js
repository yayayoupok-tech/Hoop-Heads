// Bots play to their build: measures each play style's shot and possession mix in bot-vs-bot 1v1 games against a
// neutral 1.93 m opponent (the same Pro brain on both sides). Targets (the spec): Post styles post up on 45% of
// possessions, Shooters take 55% jumpers with half of them threes, Slashers drive on 60% of possessions (a drive: the
// bot attacks the rim from inside 7.5 m with the ball live, not a walk-up or a push in the backcourt).
// Usage: node tests/stylemix.js [games=16] [difficulty=pro]
const { launch, openPage } = require('./lib');
(async () => {
  const games = +(process.argv[2] || 16), diff = process.argv[3] || 'pro';
  const browser = await launch(); const P = await openPage(browser); const t0 = Date.now();
  const rows = await P.ev(([games, diff]) => {
    const mk = (name, h, r, arch) => { const e = effRatings(r, h), attrs = {}; for (const k of RATING_KEYS) attrs[k] = ratingToAttr(e[k]); return { name, nick: name.split(' ')[0], arch, height: h, attrs, look: { skin: 3, hair: 0, hairColor: 0, headScale: 1, number: 5 }, moves: movesFor(e) }; };
    const builds = [
      ['postscorer', 2.06, { sho: 50, fin: 72, han: 45, spd: 50, jmp: 58, def: 62, str: 75 }],
      ['rimprotector', 2.1, { sho: 35, fin: 66, han: 36, spd: 48, jmp: 68, def: 75, str: 76 }],
      ['sharpshooter', 1.91, { sho: 78, fin: 58, han: 65, spd: 62, jmp: 55, def: 52, str: 48 }],
      ['slasher', 1.96, { sho: 52, fin: 76, han: 66, spd: 74, jmp: 72, def: 55, str: 55 }],
      ['playmaker', 1.88, { sho: 64, fin: 60, han: 78, spd: 72, jmp: 58, def: 55, str: 45 }],
      ['lockdown', 1.98, { sho: 55, fin: 58, han: 55, spd: 66, jmp: 62, def: 76, str: 62 }],
    ];
    const opp = mk('Neutral Opp', 1.93, { sho: 60, fin: 60, han: 60, spd: 60, jmp: 60, def: 60, str: 60 }, 'lockdown');
    const out = [];
    const orig = PlayerBrain.prototype.setIntent;
    for (const [arch, h, r] of builds) {
      const me = mk('Style ' + arch, h, r, arch); const acc = { arch, poss: 0, post: 0, drive: 0, fga: 0, jumpers: 0, threes: 0, rim: 0, hook: 0, pts: 0, wins: 0, dropsteps: 0, upunders: 0 };
      for (let gi = 0; gi < games; gi++) {
        const flip = gi % 2 === 1; const tA = Object.assign({}, TEAMS[0], { players: [flip ? opp : me] }), tB = Object.assign({}, TEAMS[1], { players: [flip ? me : opp] });
        const m = new Match({ mode: '1v1', teams: [tA, tB], humanTeam: -1, headless: true, difficulty: diff, format: { type: 'first', target: 21 }, court: 'arena', seed: 3 + gi * 7717 + arch.length * 31 });
        const P = m.players.find(p => p.name === me.name); let cur = null;
        m.bus.on('POSSESSION_CHANGE', e => { if (e.team === P.team) { cur = { post: false, drive: false }; acc.poss++; } else cur = null; });
        m.bus.on('MOVE', e => { if (e.player === P) { if (e.move === 'dropstep') acc.dropsteps++; if (e.move === 'upunder') acc.upunders++; } });
        const shots = { jumper: 0, three: 0, rim: 0, hook: 0, floater: 0, fga: 0 }; m.bus.on('SHOT_RELEASED', sh => { if (sh.shooter !== P || sh.type === 'ft') return; shots.fga++; if (sh.type === 'jumper') { shots.jumper++; if (sh.points === 3) shots.three++; } else if (sh.type === 'layup' || sh.type === 'dunk' || sh.type === 'tip') shots.rim++; else if (sh.type === 'hook') shots.hook++; else if (sh.type === 'floater') shots.floater++; });
        PlayerBrain.prototype.setIntent = function (type, commit, data) { if (this.p === P && cur && this.m === m) { if (type === 'post') cur.post = true; if (type === 'drive' && !(data && data.stopAt) && Math.abs(P.x - P.hoop.x) < 7.5 && (P.state === 'move' || P.state === 'burst' || P.state === 'protect')) cur.drive = true; if (cur.post && !cur.pc) { cur.pc = true; acc.post++; } if (cur.drive && !cur.dc) { cur.dc = true; acc.drive++; } } return orig.call(this, type, commit, data); };
        let steps = 0; while (!m.ended && steps < 120 * 60 * 25) { simStep(m, STEP); steps++; }
        PlayerBrain.prototype.setIntent = orig;
        const s = P.stats; acc.fga += shots.fga; acc.rim += shots.rim; acc.hook += shots.hook; acc.jumpers += shots.jumper; acc.threes += shots.three; acc.floaters = (acc.floaters || 0) + shots.floater; acc.pts += s.pts; if (m.winner === P.team) acc.wins++; // shots classified by type as they leave the hand (floaters are not jumpers)
      }
      acc.postPct = Math.round(100 * acc.post / Math.max(1, acc.poss)); acc.drivePct = Math.round(100 * acc.drive / Math.max(1, acc.poss)); acc.jumperPct = Math.round(100 * acc.jumpers / Math.max(1, acc.fga)); acc.threeOfJumpers = Math.round(100 * acc.threes / Math.max(1, acc.jumpers)); acc.rimPct = Math.round(100 * acc.rim / Math.max(1, acc.fga)); acc.ppp = +(acc.pts / Math.max(1, acc.poss)).toFixed(2);
      out.push(acc);
    }
    return out;
  }, [games, diff]);
  console.log('Style mix · bot vs bot 1v1 (' + diff + ' brains) · first to 21 · vs a neutral 1.93 m opponent · ' + games + ' games per style');
  console.log('style          poss  post-up%  drive%  jumpers%  3s-of-jumpers%  rim%  hooks  drop/up-under  PPP   win%');
  for (const r of rows) console.log(r.arch.padEnd(14) + String(r.poss).padStart(5) + String(r.postPct).padStart(9) + String(r.drivePct).padStart(8) + String(r.jumperPct).padStart(10) + String(r.threeOfJumpers).padStart(16) + String(r.rimPct).padStart(6) + String(r.hook).padStart(7) + ('  ' + r.dropsteps + '/' + r.upunders).padEnd(15) + r.ppp.toFixed(2).padStart(5) + String(Math.round(100 * r.wins / games)).padStart(7));
  const g = a => rows.find(r => r.arch === a); const post = Math.round((g('postscorer').postPct + g('rimprotector').postPct) / 2), sh = g('sharpshooter'), sl = g('slasher');
  console.log('targets: Post 45% post-ups → ' + post + '%' + (Math.abs(post - 45) <= 8 ? ' ✓' : ' ✗') + ' · Shooter 55% jumpers → ' + sh.jumperPct + '%' + (Math.abs(sh.jumperPct - 55) <= 8 ? ' ✓' : ' ✗') + ', half threes → ' + sh.threeOfJumpers + '%' + (Math.abs(sh.threeOfJumpers - 50) <= 10 ? ' ✓' : ' ✗') + ' · Slasher 60% drives → ' + sl.drivePct + '%' + (Math.abs(sl.drivePct - 60) <= 8 ? ' ✓' : ' ✗'));
  console.log('(' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)' + (P.errors.length ? '\nERRORS: ' + P.errors.join(' | ') : ''));
  await browser.close();
})();
