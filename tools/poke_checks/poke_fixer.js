// ============================================================
// POKE STYLE — THE FIXER'S OPENING (Chapter 1-C), PLAYED THROUGH
// Three whole runs on the game's own update loop, the knock on the door to the end card, one for
// each exit and each way of doing things:
//   L  legal: pay for the diesel and the patrol times, tell Rana, the pickup; save and load with
//            the package aboard; save Zaki; the tracker on the reef; the coast guard; the lorry
//   D  deal:  steal the diesel at night (past the watchman), haggle the times, keep Rana out of it,
//            carry the case; get seen on the ship; keep running (Zaki not saved); the tracker in
//            Bassem's car; Bassem's deal; the lorry
//   Q  quiet: buy the diesel, scout the patrol from the fort wall at dusk; the tracker on the bus
//            south; no exit at all; the night bus north
// Minigames are finished with TT.win(result); the stealth on the ship is short-cut (its listening
// meter filled, or the alarm raised). Then the speed check: frames per second in Marsa Tarfa.
// ============================================================
// Run from the repo root: node tools/poke_checks/poke_fixer.js
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
const { chromium } = pw;
const ROOT = path.resolve(__dirname, '../..');
const LAUNCH = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : (require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
const HELP = () => {
  window.TT = {
    pick(sub) {
      if (!Dlg.active) throw new Error('no dialogue open, wanted ' + sub + ' (' + clockStr() + ', ' + Game.map.key + ')');
      Dlg.page = Dlg.pages.length - 1; Dlg.shown = Dlg.len();
      if (!Dlg.choices) { Dlg.update(0, { ok: true }); return '(no choices)'; }
      const i = typeof sub === 'number' ? sub : Dlg.choices.findIndex(c => c.includes(sub));
      if (i < 0) throw new Error('no choice "' + sub + '" in ' + JSON.stringify(Dlg.choices) + ' scene ' + Story.cur);
      Dlg.csel = i; Dlg.ct = 1; const txt = Dlg.choices[i]; Dlg.update(0, { ok: true }); return txt;
    },
    drain(n) { let k = 0; while (Dlg.active && k++ < (n || 6)) TT.pick(0); },
    ent(id) { return Game.map.ents.find(q => q.id === id) || Game.maps.ch1.ents.find(q => q.id === id); },
    talk(id) { TT.unfade(); const e = TT.ent(id); if (!e) throw new Error('no ent ' + id + ' (' + Game.map.key + ')'); Game.examine(e); if (!Dlg.active) throw new Error('nothing said by ' + id); },
    label(l) { TT.unfade(); const e = Game.map.ents.find(q => q.label === l); if (!e) throw new Error('nothing labelled ' + l + ' (' + Game.map.key + ')'); Game.examine(e); if (!Dlg.active) throw new Error('nothing said by ' + l); },
    go(id) { if (Game.map !== Game.maps.ch1) Game.enter(Game.maps.ch1); const e = Game.maps.ch1.ents.find(q => q.id === id); if (!e) throw new Error('no ent ' + id); Game.player.x = e.w ? e.x + e.w / 2 : e.x; Game.player.y = (e.w ? e.y + e.d : e.y) + 18; },
    room(key) { const r = Game.maps[key] || (Game.maps[key] = buildRoom(key, window.POKE_MAP, [Game.player.x, Game.player.y])); r.back = [Game.player.x, Game.player.y]; Game.enter(r); Game.player.x = r.spawn[0]; Game.player.y = r.spawn[1]; },
    out() { Game.enter(Game.maps.ch1); },
    win(r) { if (!Mini.cur) throw new Error('no minigame open (' + (Story.cur || '') + ')'); const d = Mini.cur.done; Mini.cur = null; d(r); },
    sim(secs, each) { for (let t = 0; t < secs; t += 0.05) { if (Dlg.active || Mini.cur || EndCard.open) return true; Game.I = {}; if (each) each(); Game.update(0.05); } return false; },
    until(test, secs) { for (let t = 0; t < secs; t += 0.05) { if (test()) return true; Game.I = {}; if (Dlg.active) TT.drain(1); Game.update(0.05); } return test(); },
    unfade() { let n = 0; while (Game.fade && n++ < 40) { Game.I = {}; Game.update(0.05); } },          // (a player can't act during a fade either)
    settle() { for (let t = 0; t < 0.7; t += 0.05) { Game.I = {}; Game.update(0.05); } },
    wait(mins) { clockAdvance(mins); if (Game.set.time === 5) Game.hour = storyHour(); TT.settle(); },
    st() { return { clock: clockStr(), money: money(), debt: debt(), heat: Story.s.heat, tasks: Story.s.tasks.filter(t => !t.done).map(t => t.id).join(',') }; },
  };
};
async function start(b, errs, name) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await p.goto('file://' + ROOT + '/poke.html'); await p.waitForFunction(() => window.POKE_READY);
  await p.evaluate('(' + HELP.toString() + ')();');
  await p.evaluate(['MORNING', 'TRUCK10', 'SEA', 'HOME', 'END'].map(k => 'window.' + k + ' = ' + STEPS[k].toString() + ';').join('\n'));
  await p.evaluate(n => { Game.player.name = n; Game.player.bg = 'fixer'; Game.newGame(); Game.state = 'play'; }, name);
  await p.waitForTimeout(1200);
  return p;
}
// beat 1 and 2: the door, Zaki, Rana, Bassem at five (the same each run, but for what you pay the collectors)
const MORNING = pay => {
  TT.pick('Gentlemen'); TT.pick('Check your phone'); TT.pick(pay); if (Dlg.choices && Dlg.choices.some(c => c.includes('What does he want'))) TT.pick('What does he want'); TT.pick('Watch them go'); TT.drain(2);
  TT.go('c1c_zaki'); TT.talk('c1c_zaki'); TT.pick('Sit.'); TT.pick('I owe you'); TT.drain(2);
  TT.go('c1c_diveshop'); TT.room('INT_DIVESHOP'); TT.talk('c1c_rana'); TT.pick('A job'); TT.pick('Thank you'); TT.drain(2); TT.out();
  TT.go('c1c_vguard'); TT.talk('c1c_vguard'); TT.pick('Sit in the shade'); TT.settle(); TT.drain(1); TT.settle();
  TT.go('c1c_villa'); TT.room('INT_VILLA'); TT.talk('c1c_bassem'); TT.pick('Sit.'); TT.pick('Drink'); TT.pick('Ask him');
  TT.pick('package'); TT.drain(1); TT.pick('client'); TT.drain(1); TT.pick('Fine. I'); TT.drain(2); TT.out();
  return 'offer ' + JSON.stringify(TT.st());
};
// the truck at ten: wait in the café, meet Brandt, the case
const TRUCK10 = how => {
  TT.go('c1c_truckman'); TT.talk('c1c_truckman'); TT.pick('wait for the truck'); TT.settle(); TT.drain(1);
  TT.until(() => !!TT.ent('c1c_lena'), 60);
  TT.go('c1c_lena'); TT.talk('c1c_lena'); TT.pick('Walk over'); TT.pick('Where is it'); TT.pick('Take it, and say nothing'); TT.pick('Tuck it');
  if (how === 'pickup') { TT.pick('Put it in the pickup'); TT.settle(); TT.drain(2); }
  else { TT.pick('Carry it yourself'); TT.settle(); TT.drain(1); TT.go('c1c_zaki'); TT.talk('c1c_zaki'); TT.pick('Neither do I'); TT.drain(1); }
  return 'package ' + sflag('c1c_package') + ' at ' + clockStr();
};
// out to sea, open the case, the ship
const SEA = () => {
  const L = [];
  TT.go('c1c_zaki'); TT.talk('c1c_zaki'); TT.pick('Cast off'); TT.settle();
  TT.until(() => Game.map.key === 'INT_DHOW' && Dlg.active, 240);
  L.push('at sea ' + Game.map.key + ' ' + clockStr());
  TT.pick('Look around'); TT.drain(1);
  TT.label('The Wheel'); TT.pick('Take it out'); TT.pick('Cut the wire'); TT.pick('Run your thumb'); TT.pick('Peel it'); TT.pick('Read it again'); TT.pick('Green, twice'); TT.pick('Take us in'); TT.drain(2);
  L.push('opened ' + sflag('c1c_opened') + ' bag ' + Object.keys(Game.bag).filter(k => /Codex|tracker/i.test(k)).join(', '));
  TT.talk('c1c_zaki_deck'); TT.pick('Hamburg'); TT.settle();
  L.push('ship ' + Game.map.key); TT.pick('Listen');
  return L;
};
const HOME = () => { TT.settle(); TT.pick('Step onto the quay'); TT.drain(2); return 'home ' + clockStr() + ' zaki saved ' + sflag('ch1c_zaki_saved') + ' tasks ' + TT.st().tasks; };
const END = () => ({ card: EndCard.open, exit: sflag('c1_exit'), left: sflag('c1c_left_by'), lines: EndCard.lines });
const STEPS = { MORNING, TRUCK10, SEA, HOME, END };

(async () => {
  const b = await chromium.launch(LAUNCH);
  const errs = [];
  // ---- L: legal ----
  let p = await start(b, errs, 'Karim Fawzi');
  console.log('L', await p.evaluate(() => {
    const L = [MORNING('Pay them the 300')];
    Story.s.money += 2000;                                                          // (as if from the day's jobs: the diesel costs 1,200)
    TT.go('c1c_fuelstore'); TT.talk('c1c_fuelstore'); TT.pick('Talk to the fuel man'); TT.pick('Pay the twelve hundred'); TT.drain(3);
    TT.go('c1c_fisherman'); TT.talk('c1c_fisherman'); TT.pick('Pay the five hundred'); TT.drain(3);
    TT.go('c1c_diveshop'); TT.room('INT_DIVESHOP'); TT.talk('c1c_rana'); TT.pick('Tell her'); TT.pick(0); TT.pick('[Diving]'); TT.pick('Take the kit'); TT.drain(2); TT.out();
    L.push('prep ' + JSON.stringify(TT.st()));
    L.push(TRUCK10('pickup'));
    return L;
  }));
  console.log('L save', await p.evaluate(() => { Game.save(); Game.story = null; Game.load(); return { package: sflag('c1c_package'), offer: sflag('c1c_offer'), map: Game.map.key }; }));
  console.log('L sea', await p.evaluate(() => {
    const L = SEA();
    TT.sim(1); Ship.listen = 1; Ship.phase = 'back'; startDialogue('c1c_overhear');           // (what a full listening meter does)
    L.push('overheard ' + Story.cur); TT.pick('Back to the ladder'); TT.drain(1);
    TT.talk('c1c_ladder'); TT.pick('Down the ladder'); TT.pick('Get to the bow'); TT.win({ won: true, hull: 0.8 }); TT.settle();
    TT.pick('Stop the boat'); TT.win({ ok: true, blood: 0.6 }); TT.pick('Take the wheel. Home'); L.push(HOME());
    TT.go('c1c_bwlight'); TT.talk('c1c_bwlight'); TT.pick('Throw the tracker'); TT.drain(2);
    TT.go('c1c_cgofficer'); TT.talk('c1c_cgofficer'); TT.pick('Put the Codex'); TT.pick('Take the phone'); TT.pick('I can do that'); TT.drain(3);
    TT.go('c1c_driver'); TT.talk('c1c_driver'); TT.pick('Climb up'); TT.pick('North, to Cairo');
    return L.concat([JSON.stringify(END())]);
  }));
  await p.close();

  // ---- D: the deal ----
  p = await start(b, errs, 'Lina Saad');
  console.log('D', await p.evaluate(() => {
    const L = [MORNING('Fifty')];
    TT.wait(70);                                                                    // dusk: the watchman's round, the fuel man gone home
    TT.go('c1c_fuelstore'); TT.talk('c1c_fuelstore'); TT.pick('Pick the padlock'); TT.win({ opened: true }); TT.settle(); TT.drain(2);
    TT.go('c1c_fisherman'); TT.talk('c1c_fisherman'); TT.pick('Haggle'); TT.win({ deal: true, price: 260 }); TT.drain(3);
    TT.go('c1c_diveshop'); TT.room('INT_DIVESHOP'); TT.talk('c1c_rana'); TT.pick('Better you'); TT.pick(0); TT.pick('I trust you'); TT.pick('Take the kit'); TT.drain(2); TT.out();
    L.push('prep ' + JSON.stringify(TT.st()) + ' fuel ' + sflag('c1c_fuel') + ' route ' + sflag('c1c_route'));
    L.push(TRUCK10('carry'));
    L.push(...SEA());
    TT.sim(1); Ship.on = false; sflag('c1c_ship_seen', true); startDialogue('c1c_ship_seen1'); L.push('seen ' + Story.cur);   // (what a full alarm does when the deckhands' torches find you)
    TT.pick('Run for the ladder'); TT.pick('Get to the bow'); TT.win({ won: true, hull: 0.5 }); TT.settle();
    TT.pick('Keep running'); TT.pick('caught us'); L.push(HOME());
    TT.go('c1c_bcar'); TT.talk('c1c_bcar'); TT.pick('Crouch down'); TT.drain(2);
    TT.go('c1c_vguard'); TT.talk('c1c_vguard'); TT.pick(0); TT.pick('Deal.'); TT.drain(3);
    TT.go('c1c_driver'); TT.talk('c1c_driver'); TT.pick('Climb up'); TT.pick('North, to Cairo');
    return L.concat([JSON.stringify(END()), 'debt ' + debt(), 'zaki saved ' + sflag('ch1c_zaki_saved')]);
  }));
  await p.close();

  // ---- Q: quiet ----
  p = await start(b, errs, 'Omar Hassan');
  console.log('Q', await p.evaluate(() => {
    const L = [MORNING('Nothing')];
    Story.s.money += 1500;
    TT.go('c1c_fuelstore'); TT.talk('c1c_fuelstore'); TT.pick('Talk to the fuel man'); TT.pick('Pay the twelve hundred'); TT.drain(3);
    TT.go('c1c_rampart'); TT.talk('c1c_rampart'); TT.pick('Sit on the rampart'); TT.settle(); TT.win({ marks: 4 }); TT.drain(2);
    TT.go('c1c_diveshop'); TT.room('INT_DIVESHOP'); TT.talk('c1c_rana'); TT.pick('Tell her'); TT.pick(0); TT.pick('[Diving]'); TT.pick('Take the kit'); TT.drain(2); TT.out();
    L.push('prep ' + JSON.stringify(TT.st()) + ' route ' + sflag('c1c_route'));
    L.push(TRUCK10('pickup')); L.push(...SEA());
    TT.sim(1); Ship.listen = 1; Ship.phase = 'back'; startDialogue('c1c_overhear'); TT.pick('Back to the ladder'); TT.drain(1);
    TT.talk('c1c_ladder'); TT.pick('Down the ladder'); TT.pick('Get to the bow'); TT.win({ won: true, hull: 0.9 }); TT.settle();
    TT.pick('Stop the boat'); TT.win({ ok: true, blood: 0.4 }); TT.pick('Take the wheel. Home'); L.push(HOME());
    TT.until(() => !!TT.ent('c1c_bus'), 30); TT.go('c1c_bus'); TT.talk('c1c_bus'); TT.pick('Drop the tracker'); TT.drain(2);
    L.push('bus south done at ' + clockStr() + ', tracker ' + sflag('c1c_tracker'));
    TT.wait(Math.max(0, 27 * 60 + 2 - Story.s.clock)); TT.until(() => Bus.kind === 'north', 10);
    TT.go('c1c_bus'); TT.talk('c1c_bus'); TT.pick('Board the bus'); TT.pick('North, to Cairo');
    return L.concat([JSON.stringify(END())]);
  }));
  // ---- the speed: Marsa Tarfa by day and by night, the update and the draw ----
  console.log('speed', await p.evaluate(() => {
    EndCard.open = false; Dlg.active = false; Game.enter(Game.maps.ch1); const out = {};
    for (const [name, hour, x, y] of [['town by day', 12, 36, 27], ['harbour by night', 23, 54, 30], ['the lighthouse beam at night', 23, 70, 32]]) {
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
