// ============================================================
// POKE STYLE — THE INSPECTOR'S OPENING (Chapter 1-B), PLAYED THROUGH
// Three whole runs on the game's own update loop, tea to the end card, one for
// each exit and a different end for Samy each time:
//   Q  quiet:  the tail followed honestly, the Serapeum, Radwan, talk Samy down and
//              expose him; save and load after the Codex
//   L  legal:  the dart, and let him flee; save and load in the galleries
//   D  deal:   no dart, push him, run
// The stealth parts are played by small bots on the real loop (the tail at a
// distance, hiding behind the pumps, listening from behind the compound wall,
// coming up behind Samy). Then a speed check: frames per second at Saqqara.
// ============================================================
// Run from the repo root: node tools/poke_checks/poke_inspector.js
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
const { chromium } = pw;
const ROOT = path.resolve(__dirname, '../..');
const LAUNCH = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : (require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
const HELP = () => {
  window.TT = {
    pick(sub) {
      if (!Dlg.active) throw new Error('no dialogue open, wanted ' + sub);
      Dlg.page = Dlg.pages.length - 1; Dlg.shown = Dlg.len();
      if (!Dlg.choices) { Dlg.update(0, { ok: true }); return '(no choices)'; }
      const i = typeof sub === 'number' ? sub : Dlg.choices.findIndex(c => c.includes(sub));
      if (i < 0) throw new Error('no choice "' + sub + '" in ' + JSON.stringify(Dlg.choices) + ' scene ' + Story.cur);
      Dlg.csel = i; Dlg.ct = 1; const txt = Dlg.choices[i]; Dlg.update(0, { ok: true }); return txt;
    },
    // close whatever's open by taking the first choice, a few times over (texts that only say something)
    drain(n) { let k = 0; while (Dlg.active && k++ < (n || 6)) TT.pick(0); },
    ent(id) { return Game.map.ents.find(q => q.id === id) || Game.maps.ch1.ents.find(q => q.id === id); },
    talk(id) { const e = TT.ent(id); if (!e) throw new Error('no ent ' + id); Game.examine(e); if (!Dlg.active) throw new Error('nothing said by ' + id); },
    go(id) { const e = Game.maps.ch1.ents.find(q => q.id === id); if (Game.map !== Game.maps.ch1) Game.enter(Game.maps.ch1); Game.player.x = e.w ? e.x + e.w / 2 : e.x; Game.player.y = (e.w ? e.y + e.d : e.y) + 18; },
    at(tx, ty) { if (Game.map !== Game.maps.ch1) Game.enter(Game.maps.ch1); Game.player.x = tx * 32; Game.player.y = ty * 32; },
    room(key) { const r = Game.maps[key] || (Game.maps[key] = buildRoom(key, window.POKE_MAP, [Game.player.x, Game.player.y])); r.back = [Game.player.x, Game.player.y]; Game.enter(r); },
    win(r) { if (!Mini.cur) throw new Error('no minigame open'); const d = Mini.cur.done; Mini.cur = null; d(r); },
    // the game's own update loop; stops when a dialogue, a minigame or the end card opens
    sim(secs, each) { for (let t = 0; t < secs; t += 0.05) { if (Dlg.active || Mini.cur || EndCard.open) return true; Game.I = {}; if (each) each(); Game.update(0.05); } return false; },
    until(test, secs, each) { for (let t = 0; t < secs; t += 0.05) { if (test()) return true; if (Dlg.active || Mini.cur) return false; Game.I = {}; if (each) each(); Game.update(0.05); } return test(); },
    settle() { for (let t = 0; t < 0.6; t += 0.05) { Game.I = {}; Game.update(0.05); } },          // (let a fade finish)
    st() { return { clock: clockStr(), money: money(), tasks: Story.s.tasks.filter(t => !t.done).map(t => t.id).join(',') }; },
  };
};
async function start(b, errs) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await p.goto('file://' + ROOT + '/poke.html'); await p.waitForFunction(() => window.POKE_READY);
  await p.evaluate('(' + HELP.toString() + ')();');
  await p.evaluate(() => { Game.player.name = 'Nadia Farid'; Game.player.bg = 'inspector'; Game.newGame(); });
  await p.waitForTimeout(1200);
  return p;
}
// beats 1 to 4: the same each run
const MORNING = () => {
  const L = [];
  TT.pick('Go and get');
  TT.go('c1b_umsabry'); TT.talk('c1b_umsabry'); TT.pick('What do you know'); TT.pick('What do I owe'); TT.pick('Take the Director');
  TT.go('c1b_office'); TT.room('INT_INSPECTORATE'); TT.talk('c1b_fathi'); TT.pick('Yes, Director'); TT.talk('c1b_ledger'); TT.pick('Photograph'); TT.talk('c1b_shelf4b'); TT.pick('Note');
  // beat 2: the round
  for (const [id, forged] of [['c1b_southtomb', false], ['c1b_kagemni', false], ['c1b_servicedoor', true]]) { TT.go(id); TT.sim(2); TT.talk(id); TT.pick('Check the seal'); TT.win({ ok: true, forged }); TT.drain(2); }
  TT.go('c1b_cigs'); TT.talk('c1b_cigs'); TT.pick('Bag'); TT.drain(2);
  TT.go('c1b_samy'); TT.talk('c1b_samy'); TT.pick('Let him go');
  L.push('round ' + JSON.stringify(TT.st()));
  // beat 3: the tail, followed eight tiles behind on his trail
  TT.at(53, 27.3); TT.sim(1); TT.at(56, 27); TT.sim(1); TT.pick('Follow');
  const trail = []; let lost = 0;
  const bot = () => { const s = Tail.samy; if (!s || Tail.phase === 'wait') return; const last = trail[trail.length - 1]; if (!last || Math.hypot(last[0] - s.x, last[1] - s.y) > 2) trail.push([s.x, s.y]);
    if (Tail.phase === 'meet') { Game.player.x = 70 * 32; Game.player.y = 50.9 * 32; return; }
    let need = 8 * 32, k = trail.length - 1; while (k > 0 && need > 0) { need -= Math.hypot(trail[k][0] - trail[k - 1][0], trail[k][1] - trail[k - 1][1]); k--; } if (need <= 0) { Game.player.x = trail[k][0]; Game.player.y = trail[k][1] + 2; } };
  TT.sim(120, bot);
  L.push('tail ' + (Dlg.active ? Dlg.pages[0][0].slice(0, 40) : 'no dialogue'));
  TT.pick(0); TT.pick(0);
  // beat 4: wait for night on the bench, the gate, the galleries
  TT.go('c1b_ghafhut'); TT.room('INT_GHAFHUT'); TT.talk('c1b_hutbench'); TT.pick('until eleven'); TT.sim(1); TT.drain(2); TT.settle();
  TT.go('c1b_serapeum'); TT.talk('c1b_serapeum'); TT.pick('Go down'); TT.sim(1); TT.drain(2); TT.settle();
  L.push('galleries ' + Game.map.key + ' at ' + clockStr());
  return L;
};
const SERVICE_ROOM = () => {
  const m = Game.map, pump = m.ents.find(e => e.label === 'Pumps');
  Game.player.x = pump.x + 30; Game.player.y = pump.y + pump.d + 14;
  TT.until(() => Ser.sstate === 'done', 40);
  const r = 'samy ' + Ser.sstate + (Dlg.active ? ' (seen!)' : '');
  TT.talk('c1b_cabinet'); TT.pick('Take it');
  return r;
};
const OUT_AND_RADWAN = () => {
  const L = [];
  if (!Game.map.outdoor) { Game.player.y = Game.map.exit.y + 2; Game.goOutside(); }
  TT.settle(); TT.sim(1); TT.pick('Keep the Codex');
  TT.at(36.5, 12); TT.sim(1); TT.at(33.8, 21.8); TT.sim(20);
  L.push('radwan ' + (Dlg.active ? Dlg.pages[0][0].slice(0, 30) : 'nothing'));
  TT.pick('Keep listening'); TT.pick('Stay down'); TT.settle();
  TT.at(36.5, 12); TT.until(() => sflag('c1b_panic_msg'), 40);
  L.push('message ' + !!sflag('c1b_panic_msg') + ' ' + JSON.stringify(TT.st()));
  return L;
};
const GALLERIES_AGAIN = (dart) => {
  TT.go('c1b_serapeum'); TT.talk('c1b_serapeum'); TT.pick(dart ? 'Take the dart' : 'Go down as you are'); TT.sim(1); TT.drain(1); TT.settle();
  return Game.map.key;
};
const SAMY = (behind) => {
  const s = Panic.samy;
  if (behind) TT.until(() => Dlg.active, 20, () => { Game.player.x = s.x - Math.cos(Panic.face) * 30; Game.player.y = s.y - Math.sin(Panic.face) * 30 + 2; });
  else TT.until(() => Dlg.active, 20, () => { if (Panic.phase === 'walk' && Math.abs(Math.cos(Panic.face)) > 0.8) { Game.player.x = s.x + Math.sign(Math.cos(Panic.face)) * 80; Game.player.y = 212; } });
  return 'standoff ' + Panic.how;
};
const NOTE_AND_EXIT = (exit) => {
  if (Game.map.key !== 'INT_GHAFHUT') { TT.go('c1b_ghafhut'); TT.room('INT_GHAFHUT'); }
  TT.talk('c1b_hutbench'); TT.pick('look at the Codex'); TT.pick('Unfold'); TT.pick('Fold');
  TT.pick(exit); TT.pick(0);
  return { card: EndCard.open, lines: EndCard.lines, flags: { exit: sflag('c1_exit'), samy: sflag('ch1b_samy_fate'), exposed: !!sflag('ch1b_samy_exposed'), informant: !!sflag('ch1b_samy_informant') }, ...TT.st() };
};
(async () => {
  const b = await chromium.launch(LAUNCH);
  const errs = [];
  // ---- Q: quiet ----
  let p = await start(b, errs);
  console.log('Q', await p.evaluate('(' + MORNING.toString() + ')()'));
  console.log('Q service room', await p.evaluate('(' + SERVICE_ROOM.toString() + ')()'));
  console.log('Q save after the Codex', await p.evaluate(() => { Game.save(); Game.story = null; Game.load(); return { codex: Game.bag['The Codex'], map: Game.map.key, tasks: TT.st().tasks }; }));
  console.log('Q', await p.evaluate('(' + OUT_AND_RADWAN.toString() + ')()'));
  console.log('Q', await p.evaluate('(' + GALLERIES_AGAIN.toString() + ')(true)'), await p.evaluate('(' + SAMY.toString() + ')(false)'));
  console.log('Q end', await p.evaluate('TT.pick("Put the knife down"); TT.pick("Then tell me"); TT.pick("Take him to the Director"); TT.pick("Walk away"); TT.sim(1); (' + NOTE_AND_EXIT.toString() + ')("put in for leave")'));
  await p.close();
  // ---- L: legal ----
  p = await start(b, errs);
  console.log('L', await p.evaluate('(' + MORNING.toString() + ')()'));
  console.log('L save in the galleries', await p.evaluate(() => { const k = Game.map.key; Game.save(); Game.story = null; Game.load(); return { was: k, now: Game.map.key, night: clockStr() }; }));
  console.log('L', await p.evaluate(() => { const g = Game.maps.ch1.ents.find(e => e.id === 'c1b_serapeum'); Game.goInside({ x: g.x + 32, y: g.y + 40, w: 32, h: 14, to: 'INT_SERAPEUM' }); TT.sim(1); TT.drain(1); return Game.map.key; }));
  console.log('L service room', await p.evaluate('(' + SERVICE_ROOM.toString() + ')()'));
  console.log('L', await p.evaluate('(' + OUT_AND_RADWAN.toString() + ')()'));
  console.log('L', await p.evaluate('(' + GALLERIES_AGAIN.toString() + ')(true)'), await p.evaluate('(' + SAMY.toString() + ')(false)'));
  console.log('L end', await p.evaluate('TT.pick("Shoot the dart"); TT.pick("leave him to sleep"); TT.pick("Let him go"); (' + NOTE_AND_EXIT.toString() + ')("Amira")'));
  await p.close();
  // ---- D: deal ----
  p = await start(b, errs);
  console.log('D', await p.evaluate('(' + MORNING.toString() + ')()'));
  console.log('D service room', await p.evaluate('(' + SERVICE_ROOM.toString() + ')()'));
  console.log('D', await p.evaluate('(' + OUT_AND_RADWAN.toString() + ')()'));
  console.log('D', await p.evaluate('(' + GALLERIES_AGAIN.toString() + ')(false)'), await p.evaluate('(' + SAMY.toString() + ')(false)'));
  console.log('D end', await p.evaluate('TT.pick("somewhere safe"); TT.pick("Run for the steps"); TT.pick(0); TT.sim(1); (' + NOTE_AND_EXIT.toString() + ')("A week")'));
  // ---- speed: Saqqara by day and by night, the update and the draw ----
  console.log('speed', await p.evaluate(() => {
    EndCard.open = false; Dlg.active = false; Game.enter(Game.maps.ch1); const out = {};
    for (const [name, hour, x, y] of [['village by day', 12, 62, 28], ['village by night', 23, 62, 28], ['inspectorate', 12, 38, 24]]) {
      Game.set.time = 1; Game.hour = hour; Game.player.x = x * 32; Game.player.y = y * 32;
      for (let i = 0; i < 10; i++) { Game.update(1 / 60); Game.draw(); }
      const t0 = performance.now(); for (let i = 0; i < 120; i++) { Game.I = {}; Game.update(1 / 60); Game.draw(); }
      out[name] = (performance.now() - t0) / 120;
    }
    return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.toFixed(2) + ' ms a frame']));
  }));
  await p.close();
  console.log('errors', errs);
  await b.close();
})();
