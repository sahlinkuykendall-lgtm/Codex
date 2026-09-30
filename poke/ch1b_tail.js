// ============================================================
// THE CODEX OF GIZA — POKE STYLE: FOLLOW SAMY (poke/ch1b_tail.js)
// Chapter 1-B, beat 3: the stealth tutorial. Samy rode down to Mit Rahina.
// He's at the café; when you come near, he gets up and walks through the
// market to the museum garden, glancing back at the corners, and meets a
// young man in sharp trainers by the alabaster sphinx: Karim el-Gebali.
//   - his view is a cone on the ground (yellow; red while he can see you).
//     Stalls, carts, the tuk-tuk and buildings block it; standing close to
//     other people hides you in the crowd
//   - the meter over his head fills while he sees you (faster up close),
//     and when you run near him or walk on his heels. Full: he's seen you
//   - fall too far behind and you lose him
//   - at the sphinx, get close enough to hear without being seen
// Seen or lost, Samy goes back to the café and you can try again.
// ============================================================

LOOKS.karim = { skin: 3, top: ['#3a3c46', '#26282e', '#16181c'], topKind: 'jacket', legs: ['#3a3c46', '#26282e', '#16181c'], hairStyle: 'short', hairCol: HAIRS[0], shoeKind: 'sneakers', shoe: '#ffffff', slim: true };
Object.assign(REL_NAMES, { karim: 'Karim el-Gebali' });

// the route, in tiles: [x, y, what he does there, how long]
//   look: stop and look back the way he came; shop: face the stall, then glance back
const TAIL_ROUTE = [
    [59, 26.6, 'start'], [63.5, 26.8], [63.5, 30.2, 'look', 2.4], [63.5, 33.2], [65.6, 33.3, 'shop', 4.2],
    [64, 36.8], [64, 40.6, 'look', 2.4], [64, 43.2], [68, 43.3], [72.6, 43.5, 'look', 2.0], [72.3, 47.2, 'meet'],
];
const TAIL_KARIM = [73.6, 47.2], TAIL_SPEED = 44, TAIL_LOSE = 12 * TILE, TAIL_HEAR = 5.5 * TILE;
const tailOn = () => Story.s.tasks.some(t => t.id === 'c1b_tail' && !t.done);

const Tail = {
    phase: 'wait', i: 0, t: 0, sus: 0, lostT: 0, listen: 0, face: Math.PI, kface: Math.PI, samy: null, karim: null, scooter: null, seeing: false, ride: false,
    at(k) { return [TAIL_ROUTE[k][0] * TILE, TAIL_ROUTE[k][1] * TILE]; },
    person(id, label, look, x, y, dir) { const m = Game.maps.ch1, e = World.addEnt(m, { x, y, w: 0, d: 0, id, label, person: { sheet: personSheet(LOOKS[look]), dir, frame: 0 }, sortY: y }); m.people.push(e); return e; },
    // Samy at the café, Karim waiting by the sphinx with his scooter
    ensure() {
        const m = Game.maps.ch1;
        if (!this.samy || this.samy.gone || !m.ents.includes(this.samy)) { const [x, y] = this.at(0); this.samy = this.person('c1b_samy_tail', 'Samy Ragab', 'samy', x, y, DIR.left); Object.assign(this, { phase: 'wait', sus: 0, lostT: 0, listen: 0, away: false, ride: false, karim: null }); }
        if (!this.karim || !m.ents.includes(this.karim)) {
            const x = TAIL_KARIM[0] * TILE, y = TAIL_KARIM[1] * TILE; this.karim = this.person('c1b_karim', 'Young Man', 'karim', x, y, DIR.left);
            this.karim.say = ['System', 'A young man leaning on a scooter by the sphinx, thumbing his phone. Twenty-something, a black tracksuit that cost more than a month of your pay, and trainers so white they hurt. He\'s waiting for someone, and he isn\'t a tourist.'];
            this.scooter = World.addEnt(m, { x: x + 16, y: y + 10, w: 0, d: 0, spr: scooterSprite(), sortY: y + 10, label: 'Scooter', say: ['System', 'A black scooter, polished, with a Cairo plate and a phone holder on the handlebars. Not a village scooter.'] });
        }
    },
    clear() { const m = Game.maps.ch1; for (const e of [this.samy, this.karim, this.scooter]) if (e) World.removeEnt(m, e); this.samy = this.karim = this.scooter = null; this.phase = 'wait'; },
    go() { this.phase = 'walk'; this.i = 1; this.sus = 0; this.lostT = 0; this.listen = 0; },
    // back to the café (after he's seen you, or you've lost him)
    reset() {
        const [x, y] = this.at(0), s = this.samy; if (s) { s.x = x; s.y = y; s.sortY = y; s.person.dir = DIR.left; s.person.frame = 0; }
        if (this.karim) { this.karim.person.dir = DIR.left; this.kface = Math.PI; }
        this.phase = 'wait'; this.sus = 0; this.lostT = 0; this.listen = 0; this.away = true;
    },
    dirOf(a) { const dx = Math.cos(a), dy = Math.sin(a); return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? DIR.left : DIR.right) : (dy < 0 ? DIR.up : DIR.down); },
    back(k) { const [x0, y0] = this.at(k), [x1, y1] = this.at(k - 1); return Math.atan2(y1 - y0, x1 - x0); },       // the way he came
    // can `w`, looking along angle a, see you? 0 = no; otherwise how clearly (closer is clearer)
    sees(w, a, range, half) {
        const p = Game.player, m = Game.map, dx = p.x - w.x, dy = p.y - w.y, d = Math.hypot(dx, dy);
        if (d > range || d < 1) return d < 1 ? 1 : 0;
        let da = Math.atan2(dy, dx) - a; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
        if (Math.abs(da) > half) return 0;
        for (let t = 10; t < d - 8; t += 6) if (World.blocked(m, w.x + dx * t / d - 2, w.y - 4 + dy * t / d - 2, 4, 4)) return 0;
        return 1.25 - d / range * 0.75;
    },
    cones() {                                                  // [watcher, angle, range, half-angle]
        const c = [];
        if (!this.samy || this.phase === 'wait' || this.phase === 'end') return c;
        const look = this.phase === 'pause' && this.looking;
        c.push([this.samy, this.face, (look ? 7 : 4) * TILE, look ? 0.62 : 0.5]);
        if (this.phase === 'meet' || this.phase === 'arrive') c.push([this.karim, this.kface, 5 * TILE, 0.55]);
        return c;
    },
    frame(dt) {
        const m = Game.map;
        if (m !== Game.maps.ch1 || !m.outdoor) return;
        if (this.bikeMap !== m) { this.bikeMap = m; this.bike = m.ents.find(e => e.id === 'c1b_bike_mr'); this.bikeOn = null; }
        const bikeOn = !!sflag('c1b_samy_bolted');                        // (Samy's bike is at the garage once he's ridden down)
        if (this.bike && this.bikeOn !== bikeOn) { this.bikeOn = bikeOn; if (bikeOn) { this.bike.gone = false; World.setSolid(m, this.bike, true); } else World.removeEnt(m, this.bike); }
        if (!tailOn()) { if (this.samy || this.karim) { if (this.phase !== 'end') this.clear(); } return; }
        this.ensure();
        const p = Game.player, s = this.samy, ds = Math.hypot(p.x - s.x, p.y - s.y);
        if (this.phase === 'wait') {
            if (this.away && ds > 9 * TILE) this.away = false;
            if (!this.away && ds < 7 * TILE) { if (!sflag('c1b_tail_told')) startDialogue('c1b_tail_start'); else { Notice.show('Samy\'s on the move again.'); this.go(); } }
            return;
        }
        this.t += dt;
        if (this.phase === 'walk') {
            const [tx, ty] = this.at(this.i), dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy);
            if (d < 2) {
                const R = TAIL_ROUTE[this.i];
                if (R[2] === 'meet') { this.phase = 'meet'; this.t = 0; this.face = 0; s.person.dir = DIR.right; s.person.frame = 0; }
                else if (R[2]) { this.phase = 'pause'; this.t = 0; this.kind = R[2]; this.dur = R[3]; s.person.frame = 0; }
                else this.i++;
            } else {
                const v = Math.min(d, TAIL_SPEED * dt); s.x += dx / d * v; s.y += dy / d * v; s.sortY = s.y; this.face = Math.atan2(dy, dx);
                s.person.dir = this.dirOf(this.face); s.person.anim = (s.person.anim || 0) + v / 13; s.person.frame = [1, 0, 2, 0][Math.floor(s.person.anim) % 4];
            }
        } else if (this.phase === 'pause') {
            if (this.kind === 'shop') { this.looking = this.t > 2.4; this.face = this.looking ? this.back(this.i) : 0; }                // (buying: facing the spice seller, then a glance back)
            else { this.looking = true; this.face = this.back(this.i) + Math.sin(this.t * 1.6) * 0.35; }                                // (looking back, his head turning a little)
            s.person.dir = this.dirOf(this.face);
            if (this.t > this.dur) { this.phase = 'walk'; this.i++; this.looking = false; }
        } else if (this.phase === 'meet') {
            // they talk; Karim keeps an eye out, Samy looks over his shoulder now and then
            const k = this.t % 5.5; this.kface = k < 3.6 ? Math.PI : -Math.PI / 2 - 0.5 + Math.sin(this.t * 3) * 0.2;   // (west down the garden, then north to the gate) this.karim.person.dir = this.dirOf(this.kface);
            const j = this.t % 7; this.face = j > 5.6 ? Math.PI + Math.sin(this.t * 2) * 0.3 : 0; s.person.dir = this.dirOf(this.face);
            const mx = (s.x + this.karim.x) / 2, my = (s.y + this.karim.y) / 2, near = Math.hypot(p.x - mx, p.y - my) < TAIL_HEAR;
            this.listen = near && !this.seeing ? Math.min(1, this.listen + dt / 2.6) : Math.max(0, this.listen - dt / 6);
            if (this.listen >= 1) { this.phase = 'end'; startDialogue('c1b_tail_meet'); return; }
        }
        // what they see, and what Samy hears
        let rate = 0; this.seeing = false;
        const crowd = m.people.some(e => !e.gone && e !== s && e !== this.karim && Math.hypot(e.x - p.x, e.y - p.y) < 26);
        for (const [w, a, r, h] of this.cones()) { const v = this.sees(w, a, r, h); if (v) { this.seeing = true; rate += 1.1 * v * (crowd ? 0.35 : 1); } }
        const run = ((Game.keys.run ? 1 : 0) ^ Game.set.run) && (Game.keys.left || Game.keys.right || Game.keys.up || Game.keys.down);
        if (ds < 34) rate += 0.7;                                 // on his heels: he hears your footsteps
        if (run && ds < 3.2 * TILE) rate += 0.6;                  // running near him
        this.sus = rate ? Math.min(1, this.sus + rate * dt) : Math.max(0, this.sus - 0.3 * dt);
        if (this.sus >= 1) { const meet = this.phase === 'meet'; this.phase = 'end'; startDialogue(meet ? 'c1b_tail_seen2' : 'c1b_tail_seen'); return; }
        if (this.phase !== 'meet' && ds > TAIL_LOSE) { this.lostT += dt; if (this.lostT > 4) { this.phase = 'end'; startDialogue('c1b_tail_lost'); } }
        else this.lostT = Math.max(0, this.lostT - dt);
    },
    // the cones on the ground, the meter over Samy's head, the line at the top of the screen (drawn over the night)
    draw(g, cx, cy) {
        const A = pa(g), m = Game.map;
        if (this.ride && this.karim && this.scooter) { if (this.karim.gone) { World.removeEnt(Game.maps.ch1, this.scooter); this.ride = false; } else { this.scooter.x = this.karim.x + 6; this.scooter.y = this.karim.y + 3; this.scooter.sortY = this.karim.y + 3; } }
        if (!this.samy || this.phase === 'wait' || this.phase === 'end' || m !== Game.maps.ch1) return;
        for (const [w, a, r, h] of this.cones()) {
            const pts = [[Math.round(w.x - cx), Math.round(w.y - 4 - cy)]], N = 18;
            for (let k = 0; k <= N; k++) {
                const b = a - h + 2 * h * k / N, ux = Math.cos(b), uy = Math.sin(b); let t = 10;
                while (t < r && !World.blocked(m, w.x + ux * t - 2, w.y - 4 + uy * t - 2, 4, 4)) t += 6;
                pts.push([Math.round(w.x + ux * t - cx), Math.round(w.y - 4 + uy * t - cy)]);
            }
            const hot = this.seeing && this.sees(w, a, r, h);
            g.globalAlpha = hot ? 0.34 : 0.2; A.poly(pts, hot ? '#ff5040' : '#ffe060'); g.globalAlpha = 1;
            for (let k = 1; k + 1 < pts.length; k++) A.line(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], hot ? '#ff8070' : '#fff0a0');
        }
        // the meter: an eye, and a bar that fills yellow to red
        const s = this.samy, bx = Math.round(s.x - cx) - 10, by = Math.round(s.y - cy) - 44;
        if (this.sus > 0.02 || this.seeing) {
            A.r(bx - 1, by - 1, 22, 5, '#1c1814'); A.r(bx, by, 20, 3, '#5a5040'); A.r(bx, by, Math.round(20 * this.sus), 3, this.sus > 0.66 ? '#f04030' : this.sus > 0.33 ? '#f0a030' : '#f0e040');
            if (this.seeing) Txt.draw(g, '?', bx + 10, by - 13, { col: '#ffe060', shadow: '#1c1814', align: 'center' });
        }
        const VW = Game.VW;
        let line = 'FOLLOWING SAMY', sub = 'Stay out of the yellow cone. Stalls, carts and people are cover.';
        if (this.lostT > 0.2) sub = 'He\'s getting away. Keep up!';
        if (this.phase === 'meet') { line = 'LISTEN IN'; sub = this.listen > 0.02 ? 'Listening… stay hidden.' : 'Get close enough to hear them, without being seen.'; }
        Txt.draw(g, line, VW >> 1, 6, { col: '#ffe890', shadow: '#1c1814', align: 'center' });
        Txt.draw(g, sub, VW >> 1, 18, { col: '#ffffff', shadow: '#1c1814', align: 'center' });
        if (this.phase === 'meet') { const w = 60, x = (VW - w) >> 1; A.r(x - 1, 31, w + 2, 5, '#1c1814'); A.r(x, 32, w, 3, '#40485a'); A.r(x, 32, Math.round(w * this.listen), 3, '#60c0f0'); }
    },
    // they've gone their ways; Samy's bike stays at the garage
    finish() {
        this.phase = 'end'; this.ride = true;
        if (this.karim) this.karim.walkTo = [40 * TILE, 47 * TILE];                  // on the scooter, west along the footpath to the Cairo road
        if (this.samy) this.samy.walkTo = [63.5 * TILE, 12 * TILE];                  // Samy, up the lane, the long way back
        sflag('c1b_tail_done', true); sflag('ch1b_karim_seen', true); taskDone('c1b_tail');
        storyNote('Karim el-Gebali', 'Samy met him by the alabaster sphinx at Mit Rahina: 27 or so, a Cairo accent, a black tracksuit, white trainers, a black scooter with a Cairo plate. He paid Samy in an envelope. The grandson of Hagg Mahmoud el-Gebali; the Gebali are the old Qurna family in every antiquities police file.');
        storyNote('Tonight', '"Out of your locker, into the service room. My man comes after midnight." Samy is moving something from his locker to the Serapeum\'s service room tonight, for Karim\'s man to collect.');
        task('c1b_night', 'Tonight Samy moves "it" from his locker to the Serapeum\'s service room, and Karim\'s man collects after midnight. Get there first. (Wait for dark on the bench at the ghaffir\'s hut, by the Serapeum.)');
        clockAdvance(15);
    },
};

// ---- the scenes ----
scene('c1b_tail_start', {
    speaker: 'System',
    text: `Samy's motorbike is leaning outside the garage, its engine still ticking as it cools. Samy himself is at the café, a glass of tea he isn't drinking in front of him, talking low into his phone.\n\nHe hangs up, looks up the road you came down, and gets to his feet.\n\n(Follow him without being seen. The yellow cone is where he's looking: stay out of it. Stalls, carts, the tuk-tuk and buildings block his view, and standing among other people hides you in the crowd. Don't walk on his heels and don't run near him. Too far behind, and you'll lose him.)`,
    choices: [{ text: 'Follow him.', onSelect: () => { sflag('c1b_tail_told', true); Tail.go(); } }],
});
scene('c1b_tail_seen', {
    speaker: 'Samy Ragab',
    text: () => `Samy turns and looks straight at you. For a second neither of you moves.\n\nThen he laughs, too loud. "Inspector! You like oranges too? The best in Mit Rahina, here, try one." He pushes an orange into your hand and walks back toward the café, fast, looking over his shoulder twice.\n\n(He'll settle down in a minute. Walk away from the café, come back, and try again.)`,
    choices: [{ text: 'Take the orange.', onSelect: () => { pocket('Oranges', 1); Tail.reset(); Tail.tries = (Tail.tries || 0) + 1; } }],
});
scene('c1b_tail_seen2', {
    speaker: 'System',
    text: `Samy sees you over the young man's shoulder and goes grey. He says something, low. The young man doesn't turn round. He just walks away round the sphinx, unhurried, and Samy goes the other way, fast.\n\nTen minutes later Samy is back at the café, on his phone, arranging it all again.\n\n(Walk away from the café, come back, and try again.)`,
    choices: [{ text: 'Try again.', onSelect: () => { clockAdvance(10); Tail.reset(); } }],
});
scene('c1b_tail_lost', {
    speaker: 'System',
    text: `You come round a corner and he's gone: a donkey cart, a crowd at a stall, and no Samy.\n\nYou find him again ten minutes later, back at the café, on his phone.\n\n(Walk away from the café, come back, and try again. Keep closer this time.)`,
    choices: [{ text: 'Try again.', onSelect: () => { clockAdvance(10); Tail.reset(); } }],
});
scene('c1b_tail_meet', {
    speaker: 'System',
    text: `In the shade of the alabaster sphinx: Samy, and the young man leaning on his scooter. Close enough now to hear.\n\n"You're late," the young man says. Cairo, the fast kind.\n\n"The new inspector. Checking seals." Samy wipes his face. "The service door, ya Karim. They found the door."\n\n"They found a door." Karim laughs. "Doors are for finding." He takes an envelope from his jacket. Samy counts it without taking the money out.\n\n"Tonight," Karim says. "Out of your locker, into the service room. My man comes after midnight. You leave the door the way it was."\n\n"The Director has visitors tonight. A black car. Every Tuesday, a black car—"\n\n"Then be quicker than the black car, ya Samy." He swings a leg over the scooter.\n\n"And your grandfather? He knows?"\n\nFor the first time Karim stops smiling. "My grandfather thinks it's still 1950. Leave my grandfather to me. And nobody opens that bag. Not you. Not your Director."`,
    choices: [{ text: 'Stay down until they\'ve gone.', nextScene: 'c1b_tail_after' }],
});
scene('c1b_tail_after', {
    speaker: 'System',
    text: `The scooter buzzes away west along the footpath, toward the Cairo road. Samy stands a long time looking at the envelope, then puts it inside his shirt and goes back up the lane the long way round.\n\nKarim. A young man with a grandfather, a Cairo accent and trainers that have never been near a tomb. Every antiquities inspector in Egypt has read that combination in police files: **Karim el-Gebali**, grandson of Hagg Mahmoud el-Gebali, of the old Qurna family that has been selling Egypt's past since before there was a Ministry to stop them.\n\nSomething leaves Samy's locker tonight, after midnight, for the Serapeum's service room.`,
    choices: [{ text: 'Then you\'ll be there first.', onSelect: () => Tail.finish() }],
});
STORY_SCRIPTS.c1b_samy_tail = () => Tail.phase === 'wait' || Tail.phase === 'end' ? null : 'c1b_tail_talk';
scene('c1b_tail_talk', { speaker: 'System', text: `Talk to him now and he'll know you've been following him. Better to keep your distance and see where he goes.`, choices: [{ text: 'Back off.' }] });

// ---- Karim's scooter: black, polished, a Cairo plate ----
function scooterSprite() {
    const st = propStage(32, 16, 30, 22), { A } = st, x = st.x, y = st.y;
    for (const wx of [x + 6, x + 24]) { A.ell(wx, y + 17, 4, 4, '#16181c'); A.ell(wx, y + 17, 2, 2, '#8a94a0'); A.px(wx, y + 17, '#d8dce0'); }
    A.poly([[x + 3, y + 14], [x + 9, y + 8], [x + 20, y + 9], [x + 28, y + 12], [x + 28, y + 15], [x + 3, y + 16]], '#24262c');     // the body
    A.poly([[x + 17, y + 9], [x + 28, y + 11], [x + 28, y + 13], [x + 18, y + 12]], '#3a3c46'); A.hl(x + 10, y + 9, 10, '#6a6e7a');
    A.r(x + 16, y + 6, 10, 3, '#101114'); A.hl(x + 16, y + 6, 10, '#3a3c46');                                                        // the seat
    A.line(x + 6, y + 13, x + 6, y + 2, '#8a94a0'); A.r(x + 3, y + 1, 7, 2, '#b8c0c8'); A.r(x + 3, y + 3, 3, 3, '#fff4c0');          // the steering column, the bars, the headlight
    A.r(x + 1, y + 1, 2, 3, '#16181c');                                                                                             // the phone holder
    A.r(x + 22, y + 14, 6, 3, '#f4f4f0'); A.hl(x + 23, y + 15, 4, '#2a4ca0');                                                      // the Cairo plate
    return propFit(st, 32, 16, { solid: [4, 10, 24, 6] });
}

// ---- where the compass points, the hooks, the world after a load ----
TASK_TARGETS.c1b_tail = () => 'c1b_samy_tail';
TASK_TARGETS.c1b_night = () => 'c1b_servicedoor';
(function () {
    const A = AREAS.inspector, _frame = A.frame, _sync = A.sync;
    A.frame = function (dt) { _frame.call(this, dt); Tail.frame(dt); };
    A.overlay = (g, cx, cy) => Tail.draw(g, cx, cy);
    A.sync = function () {
        _sync.call(this);
        const m = Game.maps.ch1; if (!m) return;
        Tail.samy = Tail.karim = Tail.scooter = null; Tail.phase = 'wait'; Tail.ride = false;           // (a fresh map: the tail sets itself up again if it's still to do)
        Tail.bikeMap = null;
    };
})();
POKE_MAP_1B.objects.push({ id: 'c1b_bike_mr', label: "Samy's Motorbike", model: 'motorbike', say: ['System', 'Samy\'s new red motorbike, leaning outside the garage in Mit Rahina. The mechanic is pretending not to look at it.'] });
