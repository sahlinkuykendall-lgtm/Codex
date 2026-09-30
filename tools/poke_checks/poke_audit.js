// ============================================================
// POKE STYLE — AREA 1 AUDIT
// Every conversation link and scripted object points at a scene that exists; every scene's
// text and choices work under 60 rounds of random story states; everything you can examine
// can be walked to (gate open), the story's first people can be reached with it locked; the
// midnight car covers nothing. All lists should come back empty and 'errors' [].
// ============================================================
// Run from the repo root: node tools/poke_checks/poke_audit.js
// Needs Playwright (npm i -g playwright, or the one in your PATH) and a Chromium it can launch.
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
const { chromium } = pw;
const ROOT = path.resolve(__dirname, '../..');
const LAUNCH = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : (require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
(async () => {
  const b = await chromium.launch(LAUNCH);
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await p.goto('file://' + ROOT + '/poke.html'); await p.waitForFunction(() => window.POKE_READY);
  await p.evaluate(() => { Game.player.name = 'Sam Hale'; Game.newGame(); });
  await p.waitForTimeout(900);
  const R = await p.evaluate(() => {
    Dlg.active = false; Game.raisLeaves();
    const out = { missingNext: [], missingScript: [], throws: [], unreachable: [], lockedReach: [], doorsUnreachable: [], rooms: [], car: null, scenes: Object.keys(STORY).length };
    // 1. every link points somewhere
    const choicesOf = sc => { try { return (typeof sc.choices === 'function' ? sc.choices() : sc.choices) || []; } catch (e) { return []; } };
    for (const [k, sc] of Object.entries(STORY)) for (const c of choicesOf(sc)) if (c.nextScene && !STORY[c.nextScene]) out.missingNext.push(k + ' → ' + c.nextScene);
    for (const [id, v] of Object.entries(STORY_SCRIPTS)) if (typeof v === 'string' && !STORY[v]) out.missingScript.push(id + ' → ' + v);
    // 2. every scene's text and choices under random story states (fuzz)
    const FL = ['payroll', 'gate_open', 'mag_key', 'codex', 'lena_event', 'trenchA', 'trenchB_known', 'saber', 'hamid', 'mina', 'hana_q', 'met_hana', 'met_lindqvist', 'farouk_car', 'farouk_bribed', 'injured', 'dog_follow', 'petamun_seal', 'seal_clean', 'store_resealed', 'ch1_complete', 'called_amira', 'race', 'darts_won', 'looterpit', 'oldwoman', 'rais_photo', 'c1_exit'];
    const VALS = { payroll: [undefined, 'paid', 'confronted', 'delayed', 'confront_pending'], lena_event: [undefined, 'coming', 'searching', 'gone'], saber: [undefined, 'pour', 'poured', 'told'], hamid: [undefined, 'open', 'fixed'], mina: [undefined, 'open', 'declined', 'done'], hana_q: [undefined, 'open', 'done'], race: [undefined, 'won', 'lost'], c1_exit: [undefined, 'quiet', 'legal', 'deal'], looterpit: [undefined, 'taken', 'left'], injured: [undefined, 'dart', 'head'] };
    const save = JSON.stringify(Story.s.flags), bag = JSON.stringify(Game.bag);
    for (let r = 0; r < 60; r++) {
      for (const f of FL) { const v = VALS[f] || [undefined, true]; Story.s.flags[f] = v[Math.floor(Math.random() * v.length)]; }
      if (Math.random() < 0.5) Game.bag['Painted sherd'] = 3; if (Math.random() < 0.5) Game.bag['Mint Tea'] = 1; if (Math.random() < 0.5) Game.bag["Miriam's spare phone"] = 1;
      for (const [k, sc] of Object.entries(STORY)) {
        try { const t = typeof sc.text === 'function' ? sc.text() : sc.text; if (typeof t !== 'string' || !t.length) throw new Error('no text'); const sp = typeof sc.speaker === 'function' ? sc.speaker() : sc.speaker; const ch = (typeof sc.choices === 'function' ? sc.choices() : sc.choices) || []; for (const c of ch) { const tx = typeof c.text === 'function' ? c.text() : c.text; if (!tx) throw new Error('empty choice'); } }
        catch (e) { if (!out.throws.some(x => x.startsWith(k + ':'))) out.throws.push(k + ': ' + e.message); }
      }
    }
    Story.s.flags = JSON.parse(save); Game.bag = JSON.parse(bag);
    // 3. can you walk to everything you can examine? (gate open)
    const m = Game.maps.ch1, S = 16, W = Math.ceil(m.pw / S), H = Math.ceil(m.ph / S);
    const flood = () => { const seen = new Uint8Array(W * H), q = [[Math.floor(m.spawn[0] / S), Math.floor(m.spawn[1] / S)]]; seen[q[0][1] * W + q[0][0]] = 1;
      while (q.length) { const [i, j] = q.pop(); for (const [a, c] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = i + a, y = j + c; if (x < 0 || y < 0 || x >= W || y >= H || seen[y * W + x]) continue; if (World.blocked(m, x * S + 2, y * S, 12, S)) continue; seen[y * W + x] = 1; q.push([x, y]); } } return seen; };
    const near = (seen, e) => { const x0 = e.w ? e.x : e.x - 10, y0 = e.w ? e.y : e.y - 12, x1 = e.w ? e.x + e.w : e.x + 10, y1 = e.w ? e.y + e.d : e.y + 4;
      for (let x = Math.floor((x0 - 18) / S); x <= Math.floor((x1 + 18) / S); x++) for (let y = Math.floor((y0 - 18) / S); y <= Math.floor((y1 + 22) / S); y++) if (x >= 0 && y >= 0 && x < W && y < H && seen[y * W + x]) return true; return false; };
    sflag('gate_open', true); storySync();
    let seen = flood();
    for (const e of m.ents) if ((e.say || scriptFor(e)) && !e.gone && !e.nightOnly && !near(seen, e)) out.unreachable.push(e.id || e.label);
    for (const d of m.doors) if (!near(seen, { x: d.x, y: d.y, w: d.w, d: d.h })) out.doorsUnreachable.push(d.to);
    // every room builds; everything in it that says something has words or a scene; its exit mat is reachable from where you come in
    for (const d of m.doors) {
      try {
        const r = buildRoom(d.to, window.POKE_MAP, [0, 0]), RS = 8, RW = Math.ceil(r.pw / RS), RH = Math.ceil(r.ph / RS), rs = new Uint8Array(RW * RH), q = [[Math.floor(r.spawn[0] / RS), Math.floor(r.spawn[1] / RS)]];
        for (const e of r.ents) if ((e.label || e.script) && !(e.say || scriptFor(e))) out.rooms.push(d.to + ': ' + e.label + ' says nothing');
        rs[q[0][1] * RW + q[0][0]] = 1; let n = 0;
        while (q.length) { const [i, j] = q.pop(); n++; for (const [a, c] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = i + a, y = j + c; if (x < 0 || y < 0 || x >= RW || y >= RH || rs[y * RW + x]) continue; if (World.blocked(r, x * RS + 2, y * RS, 4, 4)) continue; rs[y * RW + x] = 1; q.push([x, y]); } }
        if (n < 40) out.rooms.push(d.to + ': boxed in at the door');
        for (const e of r.ents) if ((e.say || scriptFor(e)) && e.w) { let ok = false; for (let x = Math.floor((e.x - 16) / RS); x <= Math.floor((e.x + e.w + 16) / RS) && !ok; x++) for (let y = Math.floor((e.y - 8) / RS); y <= Math.floor((e.y + e.d + 22) / RS); y++) if (x >= 0 && y >= 0 && x < RW && y < RH && rs[y * RW + x]) { ok = true; break; } if (!ok) out.rooms.push(d.to + ': can\'t reach ' + e.label); }
      } catch (err) { out.rooms.push(d.to + ': ' + err.message); }
    }
    // with the gate still locked: the people who start the story must be reachable
    sflag('gate_open', false); storySync(); seen = flood();
    for (const id of ['tariq_talk', 'c1a_lindqvist', 'c1a_hana', 'c1a_farouk', 'tent_bldg', 'trench']) { const e = m.ents.find(q => q.id === id); if (e && !near(seen, e)) out.lockedReach.push(id); }
    // 4. the midnight car: does it cover a door, a person or a road?
    sflag('lena_event', 'searching'); storySync();
    const c = Game.lenaCar, hits = [];
    for (const e of m.ents) { if (e === c || !e.spr || e.spr.flat || e.gone) continue; const ex = e.w ? e.x : e.x - 8, ey = e.w ? e.y : e.y - 8, ew = e.w || 16, ed = e.d || 10; if (ex < c.x + c.w && ex + ew > c.x && ey < c.y + c.d && ey + ed > c.y) hits.push(e.id || e.label || '?'); }
    for (const d of m.doors) if (d.x < c.x + c.w && d.x + d.w > c.x && d.y < c.y + c.d + 30 && d.y + d.h > c.y) hits.push('door:' + d.to);
    let roadTiles = 0; for (let ty = c.y / 32; ty < (c.y + c.d) / 32; ty++) for (let tx = c.x / 32; tx < (c.x + c.w) / 32; tx++) if (m.camp.get(Math.floor(tx), Math.floor(ty)) === T.PATH) roadTiles++;
    out.car = { overlaps: hits, roadTiles };
    // is the tent door still reachable with the car there?
    seen = flood(); const td = m.doors.find(d => d.to === 'INT_TENT'); out.car.tentDoorReachable = near(seen, { x: td.x, y: td.y, w: td.w, d: td.h });
    sflag('lena_event', undefined); storySync();
    return out;
  });
  console.log(JSON.stringify(R, null, 1));
  console.log('errors', errs);
  await b.close();
})();
