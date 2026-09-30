// ============================================================
// POKE STYLE — AREA 1 PLAYTHROUGHS
// Three full nights on the game's own update loop (the clock, midnight, the car, needs):
// A the quiet exit (save/load mid-search and after the card), B the legal exit (Amira early,
// the shaft, save/load down it, knocked out), C the deal (Codex before midnight, Bosta,
// the clock running free). Minigames are finished with TT.win(result).
// ============================================================
// Run from the repo root: node tools/poke_checks/poke_playthrough.js
// Needs Playwright (npm i -g playwright, or the one in your PATH) and a Chromium it can launch.
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
const { chromium } = pw;
const ROOT = path.resolve(__dirname, '../..');
const LAUNCH = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : (require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
const HELP = () => {
  window.TT = {
    // finish the text and pick the choice containing `sub` (or index)
    pick(sub) {
      if (!Dlg.active) throw new Error('no dialogue open, wanted ' + sub);
      Dlg.page = Dlg.pages.length - 1; Dlg.shown = Dlg.len();
      if (!Dlg.choices) { Dlg.update(0, { ok: true }); return '(no choices)'; }
      const i = typeof sub === 'number' ? sub : Dlg.choices.findIndex(c => c.includes(sub));
      if (i < 0) throw new Error('no choice "' + sub + '" in ' + JSON.stringify(Dlg.choices) + ' scene ' + Story.cur);
      Dlg.csel = i; Dlg.ct = 1; const txt = Dlg.choices[i]; Dlg.update(0, { ok: true }); return txt;
    },
    talk(id) { const m = Game.maps.ch1; const e = m.ents.find(q => q.id === id) || Game.map.ents.find(q => q.id === id); if (!e) throw new Error('no ent ' + id); Game.examine(e); if (!Dlg.active) throw new Error('nothing said by ' + id); },
    room(key) { const r = Game.maps[key] || (Game.maps[key] = buildRoom(key, window.POKE_MAP, [Game.player.x, Game.player.y])); r.back = [Game.player.x, Game.player.y]; Game.enter(r); },
    out() { Game.enter(Game.maps.ch1); },
    // is tile (tx,ty) reachable on foot from the spawn?
    reach(tx, ty) {
      const m = Game.maps.ch1, S = 16, W = Math.ceil(m.pw / S), H = Math.ceil(m.ph / S), seen = new Uint8Array(W * H), q = [];
      const ok = (i, j) => !World.blocked(m, i * S + 2, j * S, 12, S);
      const s = [Math.floor(m.spawn[0] / S), Math.floor(m.spawn[1] / S)]; q.push(s); seen[s[1] * W + s[0]] = 1;
      const goal = [Math.floor((tx * 32 + 16) / S), Math.floor((ty * 32 + 16) / S)];
      while (q.length) { const [i, j] = q.pop(); if (Math.abs(i - goal[0]) <= 1 && Math.abs(j - goal[1]) <= 1) return true;
        for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = i + a, y = j + b; if (x < 0 || y < 0 || x >= W || y >= H || seen[y * W + x]) continue; seen[y * W + x] = 1; if (ok(x, y)) q.push([x, y]); } }
      return false;
    },
    win(r) { if (!Mini.cur) throw new Error('no minigame open'); const d = Mini.cur.done; Mini.cur = null; d(r); },
    st() { return { clock: clockStr(), money: money(), flags: Object.keys(Story.s.flags).filter(k => Story.s.flags[k] !== false).join(','), bag: Object.keys(Game.bag).join(', ') }; },
  };
};
const EXTRA = () => {
  // run the game's own update loop for `secs` seconds of play (walking about, the clock ticking)
  TT.sim = (secs) => { for (let t = 0; t < secs; t += 0.05) { if (Dlg.active || Mini.cur || EndCard.open) break; Game.I = {}; Game.update(0.05); } };
  TT.go = (id) => { const e = Game.maps.ch1.ents.find(q => q.id === id); if (Game.map !== Game.maps.ch1) Game.enter(Game.maps.ch1); Game.player.x = e.w ? e.x + e.w / 2 : e.x; Game.player.y = (e.w ? e.y + e.d : e.y) + 14; Game.player.dir = 3; };
  TT.check = () => ({ clock: clockStr(), money: money(), needs: JSON.stringify(needs()).replace(/"|(\.\d+)/g, ''), lena: sflag('lena_event') || '-' });
};
async function start(b, errs) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await p.goto('file://' + ROOT + '/poke.html'); await p.waitForFunction(() => window.POKE_READY);
  await p.evaluate('(' + HELP.toString() + ')(); (' + EXTRA.toString() + ')();');
  await p.evaluate(() => { Game.player.name = 'Sam Hale'; Game.newGame(); });
  await p.waitForTimeout(900);
  await p.evaluate(() => { TT.pick('Walk up'); TT.pick('sure'); TT.pick('Where do I sleep'); TT.pick('Watch him'); });
  return p;
}
(async () => {
  const b = await chromium.launch(LAUNCH);
  const errs = [];
  // ---- A: the quiet exit, the whole night the long way round ----
  let p = await start(b, errs);
  console.log('A', await p.evaluate(() => {
    const L = [];
    TT.go('c1a_hana'); TT.talk('c1a_hana'); TT.pick('anything I can do'); TT.pick(0); TT.sim(20);
    for (const e of Game.maps.ch1.ents.filter(q => q.pickup === 'Painted sherd').slice(0, 3)) { Game.examine(e); TT.pick(0); TT.sim(8); }
    TT.go('c1a_hana'); TT.talk('c1a_hana'); TT.pick('three'); TT.pick(0);
    TT.go('tariq_talk'); TT.talk('tariq_talk'); TT.pick('wages'); TT.pick('Pay the six'); TT.pick('Take the keys'); TT.sim(30);
    TT.go('c1a_saber'); TT.talk('c1a_saber'); TT.pick('know everything'); TT.pick('kettle'); TT.talk('ow_tea'); TT.pick('Pour'); TT.win({ ok: true, kind: 'perfect' }); TT.pick(0); TT.talk('c1a_saber'); TT.pick('proper'); TT.pick(0);
    TT.go('c1a_farouk'); TT.sim(40); TT.talk('c1a_farouk'); TT.pick('car'); TT.pick('Midnight'); TT.pick('mint tea'); TT.pick(0);
    TT.go('trench'); TT.sim(30); TT.talk('trench'); TT.pick('Dig'); TT.pick('Fold');
    TT.go('fl_digshed'); TT.sim(30); TT.room('INT_DIGSHED'); TT.talk('digshed_clip'); TT.pick('Photograph'); TT.out();
    TT.go('ow_sieve'); TT.sim(20); TT.talk('ow_sieve'); TT.pick('red stake'); TT.win({ ok: true, key: true, earned: 45, bagged: ['Pot sherd', 'Copper coin'] }); TT.pick(0);
    L.push('before midnight ' + JSON.stringify(TT.check()));
    // walk about until midnight comes by itself
    let n = 0; while (!sflag('lena_event') && n++ < 60) TT.sim(60);
    L.push('midnight came ' + JSON.stringify(TT.check()) + ' msgs ' + Story.s.messages.length);
    n = 0; while (sflag('lena_event') === 'coming' && n++ < 20) TT.sim(5);
    L.push('search began ' + sflag('lena_event') + ' car ' + !!Game.lenaCar);
    return L;
  }));
  // save and load during the search
  console.log('A save mid-search', await p.evaluate(() => { Game.save(); Game.story = null; Game.lenaCar = null; Game.load(); return { lena: sflag('lena_event'), car: !!Game.lenaCar, trio: Game.maps.ch1.ents.filter(e => e.lenaEvent && !e.gone).length }; }));
  console.log('A end', await p.evaluate(() => {
    TT.go('c1a_lena'); TT.talk('c1a_lena'); TT.pick('listen'); TT.pick(0);
    TT.go('fl_toolshed'); TT.sim(30); TT.talk('fl_toolshed'); TT.pick('Slit'); TT.pick('Unwrap'); TT.pick('Wrap'); TT.pick('Walk away');
    TT.pick('quarry'); TT.pick('Ride');
    return { card: EndCard.open, lines: EndCard.lines, ...TT.check(), resealed: sflag('store_resealed') };
  }));
  // keep exploring: the clock runs free past 04:40, and no car comes
  await p.keyboard.press('Space'); await p.waitForTimeout(1300); await p.keyboard.press('Space'); await p.waitForTimeout(200);
  console.log('A after the card', await p.evaluate(() => { const c0 = Story.s.clock; TT.sim(300); return { open: EndCard.open, advanced: Math.round(Story.s.clock - c0), lena: sflag('lena_event') }; }));
  console.log('A save after the card', await p.evaluate(() => { Game.save(); Game.story = null; Game.load(); return { done: sflag('ch1_complete'), exit: sflag('c1_exit') }; }));
  await p.close();

  // ---- B: the legal exit: delay, Amira early, knocked out, the shaft and the seal ----
  p = await start(b, errs);
  console.log('B', await p.evaluate(() => {
    const L = [];
    TT.go('tariq_talk'); TT.talk('tariq_talk'); TT.pick('wages'); TT.pick('wait a few'); TT.pick('Take the keys');
    const s = Detector.spots.find(q => q.id === 'ow_cache5'); pocket('Metal detector', 1, true); Detector.on = true; Game.player.x = s.x; Game.player.y = s.y + 6; Detector.update(0); Detector.startDig(); for (let i = 0; i < 100; i++) Detector.update(0.02); TT.pick(0); TT.pick('Call'); TT.pick('Tell'); TT.pick(0);
    TT.go('trench'); TT.sim(30); TT.talk('trench'); TT.pick('yourself'); TT.pick('Fold');
    // down the shaft to the niche, save down there, load
    TT.go('tunnel_mouth'); TT.talk('tunnel_mouth'); TT.pick('Climb down');
    return L.concat('amira ' + relGet('amira') + ' ' + JSON.stringify(TT.check()));
  }));
  await p.waitForTimeout(700);
  console.log('B shaft', await p.evaluate(() => { const l = Game.map.ents.find(e => e.script === 'c1a_ladder_down'); Game.player.x = l.x + 16; Game.player.y = l.y + l.d + 12; Game.target = l; Game.examine(l); TT.pick('Climb'); return Game.map.key; }));
  await p.waitForTimeout(700);
  console.log('B save in the shaft', await p.evaluate(() => { const k = Game.map.key; Game.save(); Game.story = null; Game.load(); return { was: k, now: Game.map.key, x: Math.round(Game.player.x), y: Math.round(Game.player.y), tunnel: (e => [Math.round(e.x + e.w / 2), Math.round(e.y + e.d + 18)])(Game.maps.ch1.ents.find(q => q.id === 'tunnel_mouth')) }; }));
  console.log('B night', await p.evaluate(() => {
    TT.go('puzzle_glyph'); TT.talk('puzzle_glyph'); TT.pick('Wake'); TT.win({ ok: true }); TT.pick(0);
    let n = 0; while (!sflag('lena_event') && n++ < 80) TT.sim(60);
    n = 0; while (sflag('lena_event') === 'coming' && n++ < 20) TT.sim(5);
    TT.go('c1a_lenaman1'); TT.talk('c1a_lenaman1'); TT.pick('Slip'); TT.pick(0);
    return { lena: sflag('lena_event'), page: sflag('lena_has_page'), injured: sflag('injured') };
  }));
  await p.waitForTimeout(900);
  console.log('B end', await p.evaluate(() => {
    TT.pick(0);
    TT.go('ow_sieve'); TT.talk('ow_sieve'); TT.pick('red stake'); TT.win({ ok: true, key: true, earned: 0, bagged: [] }); TT.pick(0);
    TT.go('fl_toolshed'); TT.talk('fl_toolshed'); TT.pick('Break'); TT.pick('Unwrap'); TT.pick('Wrap');
    TT.pick('Call the Ministry'); const promise = Dlg.pages.map(x => x.join(' ')).join(' ').includes('kept your promise'); TT.pick(0);
    return { promise, lines: EndCard.lines, ...TT.check() };
  }));
  await p.close();

  // ---- C: the deal, with the Codex taken before midnight (no car), Bosta at your heel ----
  p = await start(b, errs);
  console.log('C', await p.evaluate(() => {
    TT.go('tariq_talk'); TT.talk('tariq_talk'); TT.pick('wages'); TT.pick('Lindqvist is going'); TT.pick(0);
    TT.go('c1a_lindqvist'); TT.talk('c1a_lindqvist'); TT.pick('six thousand'); TT.pick('Pay the men'); TT.pick('Take the keys');
    pocket('Dates', 2, true); const h = Game.maps.ch1.ents.find(e => e.id === 'camp_dog'); Game.player.x = h.x + h.w / 2; Game.player.y = h.y + h.d + 14;
    TT.talk('camp_dog'); TT.pick('wake'); TT.pick(0); TT.talk('camp_dog'); TT.pick('date'); TT.pick(0); TT.talk('camp_dog'); TT.pick('date'); TT.pick(0);
    TT.go('fl_digshed'); TT.sim(20); TT.room('INT_DIGSHED'); TT.talk('digshed_clip'); TT.pick('Photograph'); TT.out();
    TT.go('ow_sieve'); TT.sim(20); TT.talk('ow_sieve'); TT.pick('red stake'); TT.win({ ok: true, key: true, earned: 0, bagged: [] }); TT.pick(0);
    const dog = Math.round(Math.hypot(Bosta.x - Game.player.x, Bosta.y - Game.player.y));
    Game.save(); Game.story = null; Game.load(); const dogAfter = sflag('dog_follow');
    TT.go('fl_toolshed'); TT.talk('fl_toolshed'); TT.pick('Break'); TT.pick('Unwrap'); TT.pick('Wrap'); TT.pick('meet the car'); TT.pick('Ride');
    const card = EndCard.lines; EndCard.open = false;
    TT.sim(60 * 12);                                                 // long past midnight, and 04:40
    return { dogDistance: dog, dogAfterLoad: dogAfter, card, after: TT.check(), lenaNeverCame: !sflag('lena_event') || sflag('lena_event') === 'gone' };
  }));
  await p.close();
  console.log('errors', errs);
  await b.close();
})();
