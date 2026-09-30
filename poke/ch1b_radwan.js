// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE BLACK CAR (poke/ch1b_radwan.js)
// Chapter 1-B, beat 5: the staged arrival. "A black car comes for the
// Director on Tuesdays," Umm Sabry said. It's Tuesday. Coming up out of the
// Serapeum with the Codex, you saw its headlights turn in at the inspectorate.
//   - in the yard: a black saloon with its lights on; Colonel Khaled Radwan of
//     the Tourist and Antiquities Police and Director Fathi at the office door;
//     Radwan's driver smoking in the gateway, watching the road
//   - get close enough to hear without being seen (their cones, as in the tail);
//     the compound wall and the Director's Peugeot are cover
//   - Fathi hands over a sealed evidence box "from Shelf 4B". Radwan weighs it and
//     says nothing. It's empty: the Codex is inside your jacket, and nobody here
//     knows that
// ============================================================

Object.assign(LOOKS, {
    radwan: { skin: 3, top: ['#3a3e48', '#262a32', '#16181e'], topKind: 'jacket', legs: ['#3a3e48', '#262a32', '#16181e'], head: 'cap', headCol: ['#262a32', '#16181e', '#0c0c10'], face: 'tache', tache: '#b0b0b4', hairCol: HAIRS[8], wide: true, shoe: '#0c0c10' },
    radwandriver: { skin: 4, top: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], topKind: 'shirt', legs: ['#2a2c34', '#1c1e24', '#101216'], hairStyle: 'short', hairCol: HAIRS[0], face: 'stubble', shoe: '#0c0c10' },
});
Object.assign(REL_NAMES, { radwan: 'Colonel Radwan' });
const RW = { car: [38.2, 23, 3.5, 2], fathi: [38.3, 21.9], radwan: [39.5, 21.9], driver: [39, 25.5] };   // (tiles)
const rwOn = () => Story.s.tasks.some(t => t.id === 'c1b_blackcar' && !t.done);

const Radwan = {
    ents: null, phase: 'off', t: 0, sus: 0, seeing: null, listen: 0, dface: Math.PI / 2, rface: Math.PI, fface: 0,
    // the scene in the yard: the car, the three men (Umm Sabry has gone home; the Director's out here, not in his office)
    ensure() {
        const m = Game.maps.ch1; if (this.ents && m.ents.includes(this.ents.car)) return;
        const T = TILE, [cx, cy, cw, cd] = RW.car, x = Math.round(cx * T), y = Math.round(cy * T), w = Math.round(cw * T), d = Math.round(cd * T);
        const car = World.addEnt(m, { x, y, w, d, spr: fit(carSprite(w, d, CAR_BLACK, { tint: '#0c1018', hub: '#c8ccd0' })), label: 'Black Mercedes', say: ['System', 'A black Mercedes, polished to a mirror, engine running, headlights on. Police plates, Cairo. The back seat is leather, and there\'s an ashtray full to the brim.'] });
        car.light = { x: w / 2 + 14, y: -10, r: 84, c: '#fff4d0' }; World.addSolid(m, x + 4, y + 20, w - 8, d - 22, car);
        const person = (id, label, look, [tx, ty], dir) => { const e = World.addEnt(m, { x: tx * T, y: ty * T, w: 0, d: 0, id, label, person: { sheet: personSheet(LOOKS[look]), dir, frame: 0 }, sortY: ty * T }); m.people.push(e); return e; };
        this.ents = { car, fathi: person('c1b_fathi_yard', 'Director Fathi', 'fathi', RW.fathi, DIR.right), radwan: person('c1b_radwan', 'Colonel Radwan', 'radwan', RW.radwan, DIR.left), driver: person('c1b_rwdriver', 'Driver', 'radwandriver', RW.driver, DIR.down) };
        this.ents.driver.light = { x: 4, y: -18, r: 16, c: '#ff9040', flicker: true };                                  // the tip of his cigarette
        this.phase = 'talk'; this.t = 0; this.sus = 0; this.listen = 0;
        for (const id of ['c1b_umsabry']) { const e = m.ents.find(q => q.id === id); if (e) e.gone = true; }
    },
    clear() { const m = Game.maps.ch1; if (!this.ents) return; for (const k in this.ents) World.removeEnt(m, this.ents[k]); this.ents = null; this.phase = 'off'; },
    sees(w, a, range, half) {                                    // (the tail's rules)
        const p = Game.player, m = Game.map, dx = p.x - w.x, dy = p.y - w.y, d = Math.hypot(dx, dy);
        if (d > range) return 0; if (d < 6) return 1.2;
        let da = Math.atan2(dy, dx) - a; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
        if (Math.abs(da) > half) return 0;
        for (let t = 10; t < d - 8; t += 6) if (World.blocked(m, w.x + dx * t / d - 2, w.y - 4 + dy * t / d - 2, 4, 4)) return 0;
        return 1.25 - d / range * 0.75;
    },
    cones() {
        if (!this.ents || this.phase !== 'talk') return [];
        const E = this.ents; return [[E.driver, this.dface, 5 * TILE, 0.5, 'driver'], [E.radwan, this.rface, 4.4 * TILE, 0.5, 'radwan'], [E.fathi, this.fface, 4 * TILE, 0.45, 'fathi']];
    },
    dirOf(a) { const dx = Math.cos(a), dy = Math.sin(a); return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? DIR.left : DIR.right) : (dy < 0 ? DIR.up : DIR.down); },
    frame(dt) {
        const m = Game.map; if (m !== Game.maps.ch1) return;
        if (!rwOn()) { if (this.ents && this.phase !== 'leaving') this.clear(); return; }
        this.ensure(); if (this.phase !== 'talk') return;
        this.t += dt;
        const E = this.ents, p = Game.player, t = this.t;
        // the driver watches the road, and now and then looks along the wall; the Colonel looks over the yard; the Director, nervous, over his shoulder
        const dk = t % 6.5; this.dface = dk < 4 ? Math.PI / 2 + Math.sin(t) * 0.25 : dk < 5.2 ? Math.PI - 0.5 : 0.5;
        const rk = t % 7.5; this.rface = rk < 6 ? Math.PI : Math.PI * 0.72;
        const fk = t % 5.3; this.fface = fk < 4.3 ? 0 : Math.PI + 0.3;
        E.driver.person.dir = this.dirOf(this.dface); E.radwan.person.dir = this.dirOf(this.rface); E.fathi.person.dir = this.dirOf(this.fface);
        let rate = 0, who = null;
        for (const [w, a, r, h, id] of this.cones()) { const v = this.sees(w, a, r, h); if (v) { rate += 1.2 * v; who = id; } }
        const run = ((Game.keys.run ? 1 : 0) ^ Game.set.run) && (Game.keys.left || Game.keys.right || Game.keys.up || Game.keys.down);
        for (const k of ['driver', 'radwan', 'fathi']) { const d = Math.hypot(E[k].x - p.x, E[k].y - p.y); if (d < 30) { rate += 0.8; who = who || k; } if (run && d < 110) { rate += 0.6; who = who || k; } }
        this.seeing = who;
        this.sus = rate ? Math.min(1, this.sus + rate * dt) : Math.max(0, this.sus - 0.3 * dt);
        if (this.sus >= 1) { this.sus = 0; startDialogue('c1b_rw_seen'); return; }
        // close enough to hear (the office window is open, and voices carry at night)
        const mx = (E.fathi.x + E.radwan.x) / 2, my = (E.fathi.y + E.radwan.y) / 2, near = Math.hypot(p.x - mx, p.y - my) < 5.5 * TILE;
        this.listen = near && !who ? Math.min(1, this.listen + dt / 3) : Math.max(0, this.listen - dt / 6);
        if (this.listen >= 1) { this.phase = 'heard'; startDialogue('c1b_rw_handover'); }
    },
    draw(g, cx, cy) {
        if (Game.map !== Game.maps.ch1 || !this.ents || this.phase !== 'talk') return;
        const A = pa(g), m = Game.map;
        for (const [w, a, r, h, id] of this.cones()) {
            const pts = [[Math.round(w.x - cx), Math.round(w.y - 4 - cy)]], N = 16;
            for (let k = 0; k <= N; k++) { const b = a - h + 2 * h * k / N, ux = Math.cos(b), uy = Math.sin(b); let t = 10; while (t < r && !World.blocked(m, w.x + ux * t - 2, w.y - 4 + uy * t - 2, 4, 4)) t += 6; pts.push([Math.round(w.x + ux * t - cx), Math.round(w.y - 4 + uy * t - cy)]); }
            const hot = this.seeing === id;
            g.globalAlpha = hot ? 0.34 : 0.18; A.poly(pts, hot ? '#ff5040' : '#ffe060'); g.globalAlpha = 1;
            for (let k = 1; k + 1 < pts.length; k++) A.line(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], hot ? '#ff8070' : '#fff0a0');
        }
        const w = this.seeing ? this.ents[this.seeing] : null;
        if (w && (this.sus > 0.02)) { const bx = Math.round(w.x - cx) - 10, by = Math.round(w.y - cy) - 44; A.r(bx - 1, by - 1, 22, 5, '#1c1814'); A.r(bx, by, 20, 3, '#5a5040'); A.r(bx, by, Math.round(20 * this.sus), 3, this.sus > 0.66 ? '#f04030' : this.sus > 0.33 ? '#f0a030' : '#f0e040'); Txt.draw(g, '?', bx + 10, by - 13, { col: '#ffe060', shadow: '#1c1814', align: 'center' }); }
        // only once you're near: the line at the top, and how much you've heard
        const p = Game.player, E = this.ents, dd = Math.hypot(p.x - E.radwan.x, p.y - E.radwan.y);
        if (dd > 14 * TILE) return;
        const VW = Game.VW;
        Txt.draw(g, 'LISTEN IN', VW >> 1, 6, { col: '#ffe890', shadow: '#1c1814', align: 'center' });
        Txt.draw(g, this.listen > 0.02 ? 'Listening… stay out of sight.' : 'Get close enough to hear them. The wall and the Peugeot are cover.', VW >> 1, 18, { col: '#ffffff', shadow: '#1c1814', align: 'center' });
        const bw = 60, x = (VW - bw) >> 1; A.r(x - 1, 31, bw + 2, 5, '#1c1814'); A.r(x, 32, bw, 3, '#40485a'); A.r(x, 32, Math.round(bw * this.listen), 3, '#60c0f0');
    },
    // they go: the Colonel into the back of the car, the car away down the road, the Director back inside
    leave() {
        const m = Game.maps.ch1, E = this.ents; if (!E) return;
        this.phase = 'leaving';
        E.fathi.walkTo = [38.5 * TILE, 20.6 * TILE]; E.fathi.ghost = true;
        World.removeEnt(m, E.radwan); World.removeEnt(m, E.driver);
        Game.fadeTo(() => { World.removeEnt(m, E.car); World.removeEnt(m, E.fathi); this.ents = null; this.phase = 'off'; Notice.show('The black car\'s lights swing across the desert and away toward Cairo.'); });
    },
};

// ---- the scenes ----
scene('c1b_rw_seen', {
    speaker: 'System',
    text: `A head turns your way. You drop behind the wall and hold your breath, and after a long moment the voices start again, lower now.\n\nToo close. Back off into the dark and come at it again, slower.\n\n(Try again: stay out of the yellow.)`,
    choices: [{ text: 'Back off.', onSelect: () => { Radwan.sus = 0; Radwan.listen = 0; Game.fadeTo(() => { const p = Game.player; p.x = 36.5 * TILE; p.y = 13 * TILE; p.dir = DIR.down; }); } }],
});
scene('c1b_rw_handover', {
    speaker: 'System',
    text: `Close enough now, in the dark behind the wall, to hear every word.\n\n"Colonel." Fathi's voice: the careful one he keeps for the telephone to Cairo.\n\nColonel Khaled Radwan, of the Tourist and Antiquities Police: fifty-five or so, a uniform pressed sharp enough to cut paper, eyes that haven't slept properly in years. He lights a cigarette from the end of the last one.\n\n"Director. You have it?"\n\n"Everything from Shelf 4B, as requested. Sealed, and signed for." Fathi holds out a grey evidence box in both hands, like a man handing over a baby he doesn't much like.`,
    choices: [{ text: 'Keep listening.', nextScene: 'c1b_rw_handover2' }],
});
scene('c1b_rw_handover2', {
    speaker: 'System',
    text: `Radwan takes the box. For a second he weighs it in his hands, and something crosses his face, and goes. He doesn't open it.\n\n"The Foundation thanks you," he says, in the voice of a man reading from a card. "Mr. Vasse will be—" He stops. "The Foundation thanks you."\n\n"The ledger has been corrected," says Fathi. "A clerical error. It was never here."\n\n"Then I was never here either." Radwan hands the box to his driver without looking at it, and for a moment he looks old.\n\nThe box is empty. You know it's empty. The Codex is inside your jacket, against your ribs.\n\nNobody in this yard knows that. Not the Director. Not the Colonel. Not yet.`,
    choices: [{ text: 'Stay down until they\'ve gone.', onSelect: () => {
        sflag('c1b_radwan_seen', true); taskDone('c1b_blackcar');
        storyNote('Colonel Khaled Radwan', 'Tourist and Antiquities Police, Cairo. Came in a black Mercedes past midnight to "collect evidence" from Fathi: a sealed box "from Shelf 4B", for "the Foundation" (Mr. Vasse). He weighed the box and didn\'t open it. It was empty. He looked like a man who hates himself.');
        storyNote('Director Fathi Mansour', 'Handed Colonel Radwan a sealed evidence box "from Shelf 4B" at midnight: "The ledger has been corrected. A clerical error. It was never here." The box was empty, and I have what should have been in it.');
        Radwan.leave();
        task('c1b_panic', 'Karim\'s man will open the cooler bag and find a brick. Then Samy will come looking for the Codex. Keep it close. (Beat 6, Samy\'s panic, comes in the next update.)');
    } }],
});
STORY_SCRIPTS.c1b_fathi_yard = STORY_SCRIPTS.c1b_radwan = STORY_SCRIPTS.c1b_rwdriver = () => 'c1b_rw_seen';
TASK_TARGETS.c1b_blackcar = () => 'c1b_office';
TASK_TARGETS.c1b_panic = () => null;

// ---- the hooks: the frame, the cones, the office door while they're at it, Fathi in his office ----
(function () {
    const Ar = AREAS.inspector, _frame = Ar.frame, _over = Ar.overlay, _door = Ar.door, _sync = Ar.sync;
    Ar.frame = function (dt) { _frame.call(this, dt); Radwan.frame(dt); };
    Ar.overlay = (g, cx, cy) => { if (_over) _over(g, cx, cy); Radwan.draw(g, cx, cy); };
    Ar.door = function (d) { if (Radwan.ents && d.to === 'INT_INSPECTORATE') { Toast.show('Not now. You\'d walk straight into them.'); return true; } return _door.call(this, d); };
    Ar.sync = function () { _sync.call(this); Radwan.ents = null; Radwan.phase = 'off'; };
})();
// at night Umm Sabry has gone home
(function () {
    const Ar = AREAS.inspector, _frame = Ar.frame;
    Ar.frame = function (dt) {
        _frame.call(this, dt);
        const m = Game.maps.ch1, u = m && m.ents.find(e => e.id === 'c1b_umsabry'); if (!u) return;
        const night = Story.s.clock >= 21 * 60; if (u.gone !== night) u.gone = night;
    };
})();
