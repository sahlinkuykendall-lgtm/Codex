// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-C, BEAT 4: THE TRUCK STOP (poke/ch1c_truck.js)
// story/regions/ch01_opening_fixer.md, beat 4: "Bassem said 'the truck comes at ten.' At
// ten, the truck pulls in, and Lena Brandt gets out with it. She checks you over and says:
// 'Don't open it.'"  (FIXER_TODO: "You load the package into Zaki's pickup (or carry it to
// the dhow); she watches you go.")
//   - at ten a white box truck with Cairo plates comes down the coast highway, headlights on,
//     and pulls up at the truck stop; wait for it at the café, or come when you like (it waits)
//   - Lena Brandt (Vasse's security chief, story/01_CHARACTERS.md: tall, cropped blond, a knee
//     that hurts, clipped and dry, never threatens twice): the handover, "Don't open it."
//     Giving her your word, or not, moves rel_lena a little (her arc turns on who keeps it)
//   - Zaki's cousin's pickup, or carry it yourself; she watches you go; the truck goes north
//   - the package stowed in the dhow's locker; the sailing is beat 5
// The driver stays in the cab: nameless, never seen.
// ============================================================

Object.assign(ITEM_INFO, {
    'The package': { key: 1, desc: 'A waxed canvas document case with a leather flap, the kind old professors carry, sealed with a twist of wire and a lead seal. Heavier than it looks: the weight of a big book, or a small brick. "Don\'t open it."' },
});

// ---- the truck: a white box truck seen nose-on, Cairo plates ----
SPR.c1c_truck = () => {
    const st = stage(64, 96, 26), { A } = st, x = st.x, y = st.y - 24;
    A.soft(x + 4, y + 110, 58, 8, '#000000', 0.25);
    A.r(x + 4, y, 56, 68, '#eef0f2'); A.hl(x + 4, y, 56, '#ffffff'); A.vl(x + 4, y, 68, '#ffffff'); A.vl(x + 59, y, 68, '#b8c0c8');   // the box, from above
    for (let j = y + 10; j < y + 66; j += 11) A.hl(x + 6, j, 52, '#d8dce0');
    A.r(x + 10, y + 26, 44, 10, '#d8dce0'); for (let i = 0; i < 8; i++) A.r(x + 13 + i * 5, y + 28, 3, 6, '#3a70c8');                   // a faded removal firm's name
    A.r(x + 4, y + 68, 56, 22, '#c8ccd0'); A.hl(x + 4, y + 68, 56, '#e6eaef');                                                       // the box's front face, above the cab
    A.r(x + 7, y + 82, 50, 14, '#f4f4f0'); A.hl(x + 7, y + 82, 50, '#ffffff');                                                       // the cab roof
    A.r(x + 8, y + 96, 48, 11, '#2c3c4c'); A.line(x + 12, y + 104, x + 22, y + 97, '#6a8aa8'); A.vl(x + 32, y + 96, 11, '#c8ccd0');  // the windscreen
    A.r(x + 1, y + 97, 6, 5, '#20242c'); A.r(x + 57, y + 97, 6, 5, '#20242c');                                                       // the mirrors
    A.r(x + 7, y + 107, 50, 11, '#e6eaef'); A.r(x + 18, y + 108, 28, 7, '#3a3e48'); for (let i = 20; i < 45; i += 3) A.vl(x + i, y + 108, 7, '#5a6068');   // the grille
    A.r(x + 9, y + 109, 7, 5, '#fff8d0'); A.r(x + 48, y + 109, 7, 5, '#fff8d0');                                                     // the headlights
    A.r(x + 6, y + 117, 52, 3, '#5a6068'); A.r(x + 25, y + 113, 14, 4, '#f4f4f0'); A.hl(x + 25, y + 113, 14, '#2466a8');             // the bumper, the plate (Cairo)
    return fit(st, { light: { x: 0, y: -4, r: 30, c: '#fff8d0' } });
};

// ---- the event ----
const TRUCK = { at: 22 * 60, park: [12, 40], lena: [11.3, 43.9], zaki: [11.2, 50.3], pick: [8, 49] };
const Truck = {
    ph: 'none', e: null, lena: null, zaki: null, pickup: null, v: 0, map: null, early: false,
    want() { return !!sflag('c1c_offer') && !sflag('c1c_package') && Story.s.clock >= TRUCK.at - 3; },
    spawn(m, parked) {
        const [px, py] = TRUCK.park;
        this.e = World.addEnt(m, { x: px * TILE, y: parked ? py * TILE : -5 * TILE, w: 64, d: 96, id: 'c1c_truck', label: 'The Truck', spr: SPR.c1c_truck(), sortY: 0 });
        this.e.say = ['System', 'A white box truck with Cairo plates, the engine running, a removal firm\'s name half scraped off the side. The driver stays in the cab with his cap down. He hasn\'t looked at you once, which is a skill.'];
        this.e.lights = true; this.ph = parked ? 'parked' : 'coming'; this.v = 130;
        if (parked) this.arrive(m, true);
    },
    arrive(m, quiet) {
        const e = this.e; e.sortY = e.y + e.d; this.ph = 'parked';
        World.addSolid(m, e.x + 4, e.y + 4, e.w - 8, e.d - 6, e);
        const [lx, ly] = TRUCK.lena;
        this.lena = World.addEnt(m, { x: lx * TILE, y: ly * TILE, w: 0, d: 0, id: 'c1c_lena', label: sflag('c1c_lena_met') ? 'Brandt' : 'The German Woman', person: { sheet: personSheet(LOOKS.lena), dir: DIR.left, frame: 0 }, sortY: ly * TILE }); m.people.push(this.lena);
        // Zaki, with his cousin's pickup, at the edge of the lot (the real Zaki leaves the quay for it)
        const [kx, ky] = TRUCK.pick, sp = SPR_L['pickup'](96, 64, { id: 'c1c_pickup_ts' });
        this.pickup = World.addEnt(m, { x: kx * TILE, y: ky * TILE, w: 96, d: 64, id: 'c1c_pickup_ts', label: "Zaki's Cousin's Pickup", spr: sp, sortY: ky * TILE + 64, say: ['System', 'Zaki\'s cousin\'s pickup, coughing at the edge of the lot, the engine running because Zaki doesn\'t trust it to start twice.'] }); World.addSolid(m, kx * TILE + 4, ky * TILE + 8, 88, 52, this.pickup);
        const [zx, zy] = TRUCK.zaki; this.zaki = World.addEnt(m, { x: zx * TILE, y: zy * TILE, w: 0, d: 0, id: 'c1c_zaki_ts', label: 'Captain Zaki', person: { sheet: personSheet(LOOKS.c1c_zaki), dir: DIR.up, frame: 0 }, sortY: zy * TILE }); m.people.push(this.zaki);
        this.realZaki(m, false);
        const p = Game.player;
        this.early = Math.hypot(p.x - e.x, p.y - e.y) < 10 * TILE && Story.s.clock <= TRUCK.at + 5;
        if (!quiet && this.early) { sflag('c1c_ts_early', true); rel('bassem', 2, true); }
        if (!quiet && Math.hypot(p.x - e.x, p.y - e.y) < 8 * TILE && Game.map === m) startDialogue('c1c_truck_arrive');
        else if (!quiet) Notice.show('Headlights on the highway: the truck from Cairo, at the truck stop.');
    },
    realZaki(m, on) { const z = m.ents.find(q => q.id === 'c1c_zaki'); if (z) z.gone = !on; },
    clearExtras(m) { for (const k of ['pickup', 'zaki']) if (this[k]) { World.removeEnt(m, this[k]); this[k] = null; } this.realZaki(m, true); },
    frame(dt) {
        const m = Game.maps.ch1; if (!m) return;
        if (this.map !== m) { this.map = m; this.e = this.lena = this.zaki = this.pickup = null; this.ph = 'none'; }
        if (this.ph === 'none' && this.want()) { const late = Story.s.clock >= TRUCK.at + 2 || Game.map !== m; this.spawn(m, late); return; }
        if (!this.e || Dlg.active || Game.state !== 'play') return;
        const e = this.e;
        if (this.ph === 'coming') {
            const ty = TRUCK.park[1] * TILE, d = ty - e.y;
            this.v = Math.max(26, Math.min(130, d * 0.9)); e.y += Math.min(d, this.v * dt); e.sortY = e.y + e.d;
            if (d <= 1) { e.y = ty; this.arrive(m); }
        } else if (this.ph === 'parked' && sflag('c1c_lena_met') && this.lena) this.lena.label = 'Brandt';
        else if (this.ph === 'met') {                                                  // she watches you go; once you're gone, so is she
            const p = Game.player, L = this.lena;
            if (L) L.person.dir = Math.abs(p.x - L.x) > Math.abs(p.y - L.y) ? (p.x > L.x ? DIR.right : DIR.left) : (p.y > L.y ? DIR.down : DIR.up);
            if (Game.map !== m || Math.hypot(p.x - e.x, p.y - e.y) > 9 * TILE) { if (L) { World.removeEnt(m, L); this.lena = null; } World.setSolid(m, e, false); this.ph = 'leaving'; this.v = 0; }
        } else if (this.ph === 'leaving') {
            this.v = Math.min(170, this.v + 60 * dt); e.y -= this.v * dt; e.sortY = e.y + e.d;
            if (e.y < -8 * TILE) { World.removeEnt(m, e); this.e = null; this.ph = 'gone'; }
        }
    },
    // the headlights on the road, after dark
    draw(g, cx, cy) {
        const e = this.e; if (!e || Game.map !== Game.maps.ch1 || this.ph === 'gone') return;
        const dark = Game.light().dark; if (dark < 0.2) return;
        const A = pa(g), dir = this.ph === 'leaving' ? -1 : 1, fy = (dir > 0 ? e.y + e.d + 2 : e.y - 4) - cy;
        g.globalCompositeOperation = 'lighter';
        for (const hx of [e.x + 13 - cx, e.x + 52 - cx]) for (const [len, wd, al] of [[150, 26, 0.08], [100, 16, 0.1]]) { g.globalAlpha = al * dark; A.poly([[Math.round(hx - 3), Math.round(fy)], [Math.round(hx + 3), Math.round(fy)], [Math.round(hx + wd), Math.round(fy + dir * len)], [Math.round(hx - wd), Math.round(fy + dir * len)]], '#fff4c8'); }
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    },
};

// ---- the handover ----
STORY_SCRIPTS.c1c_lena = () => sflag('c1c_package') ? 'c1c_lena_after' : sflag('c1c_lena_met') ? 'c1c_lena_go' : 'c1c_truck_arrive';
scene('c1c_truck_arrive', {
    speaker: 'System',
    text: () => `Headlights on the highway from the north, slowing. A white box truck with Cairo plates, the kind that carries furniture, or fridges, or anything at all, pulls onto the shoulder by the truck stop with a sigh of air brakes. The engine keeps running. The passenger door opens, and a woman gets down.\n\nTall. Cropped blond hair, almost white under the café's strip light. A dark jacket in this heat, zipped to the throat. She stands a moment with one knee locked straight, as if it hurts her, and then she doesn't let it.`,
    choices: [{ text: 'Walk over.', onSelect: () => { sflag('c1c_lena_met', true); if (Truck.lena) Truck.lena.label = 'Brandt'; }, nextScene: 'c1c_lena1' }],
});
scene('c1c_lena1', {
    speaker: 'The German Woman',
    text: () => `She looks you over the way a customs officer looks at a suitcase: your hands, your shoes, your face, your hands again.\n\n"Bassem's courier." It isn't a question. "Brandt." She doesn't offer a hand.` + (sflag('c1c_ts_early') ? `\n\nShe glances at her watch. "You were here first. Good."` : Story.s.clock > TRUCK.at + 20 ? `\n\nShe glances at her watch, and says nothing about it, which is worse.` : ''),
    choices: [
        { text: '"Bassem says you don\'t laugh."', nextScene: 'c1c_lena_joke' },
        { text: '"Good drive down from Cairo?"', nextScene: 'c1c_lena_drive' },
        { text: '"Where is it?"', nextScene: 'c1c_lena2' },
    ],
});
scene('c1c_lena_joke', { speaker: 'Brandt', text: `Nothing moves in her face. "Mr. Nassar told me a joke on the telephone. About a camel and a customs man." A pause exactly long enough. "It is not a good joke."`, choices: [{ text: '"No. It isn\'t."', onSelect: () => rel('lena', 1, true), nextScene: 'c1c_lena2' }] });
scene('c1c_lena_drive', { speaker: 'Brandt', text: `"No." She looks up and down the empty highway, at the mountains, black on black. "Six hundred kilometres of this, and a driver who sings."`, choices: [{ text: '"Where is it?"', nextScene: 'c1c_lena2' }] });
scene('c1c_lena2', {
    speaker: 'Brandt',
    text: `She goes to the back of the truck and comes back with it: a waxed canvas document case with a leather flap, the kind old professors carry, sealed with a twist of wire and a lead seal. She holds it out in both hands, and doesn't let go when you take hold of it.\n\n"The ship will show a green lamp, twice. The man you give it to will say 'Hamburg.'" Her eyes on yours, pale and level.\n\n"Don't open it."`,
    choices: [
        { text: '"I won\'t."', onSelect: () => { sflag('c1c_lena_word', true); rel('lena', 3, true); }, nextScene: 'c1c_lena3a' },
        { text: '"What\'s in it?"', nextScene: 'c1c_lena3b' },
        { text: 'Take it, and say nothing.', nextScene: 'c1c_lena3c' },
    ],
});
scene('c1c_lena3a', { speaker: 'Brandt', text: `"Good." She lets go. "People say that." She looks at the case, then at you, as if she's filing your face somewhere. "I remember who says it."`, choices: [{ text: 'Tuck it under your arm.', onSelect: () => c1cHandover(), nextScene: 'c1c_lena_go' }] });
scene('c1c_lena3b', {
    speaker: 'Brandt', text: `"Something that is not yours." The grip doesn't change. "Don't open it."`,
    choices: [{ text: '"Fine. I won\'t."', onSelect: () => { sflag('c1c_lena_word', true); rel('lena', 1, true); }, nextScene: 'c1c_lena3a' }, { text: 'Take it, and say nothing.', nextScene: 'c1c_lena3c' }],
});
scene('c1c_lena3c', { speaker: 'Brandt', text: `She holds on a moment longer, reading something in your face. Then she lets go.\n\n"Don't open it," she says again, as if once might not have been enough for someone like you.`, choices: [{ text: 'Tuck it under your arm.', onSelect: () => c1cHandover(), nextScene: 'c1c_lena_go' }] });
function c1cHandover() {
    if (Game.bag['The package']) return;
    pocket('The package');
    storyNote('Brandt', 'The client\'s security chief: German, tall, cropped blond hair, a bad knee she won\'t give in to. "The ship will show a green lamp, twice. The man you give it to will say Hamburg." And: "Don\'t open it." Twice.' + (sflag('c1c_lena_word') ? ' You gave her your word.' : ''));
}
scene('c1c_lena_go', {
    speaker: 'System',
    text: `Zaki's cousin's pickup is idling at the edge of the lot, Zaki at the wheel with his elbow out of the window, very carefully not looking at the truck.\n\nBrandt has gone back to the cab door. She doesn't get in. She's going to watch you go.`,
    choices: [
        { text: 'Put it in the pickup. Zaki drives you down to the harbour.', onSelect: () => c1cLoad('pickup') },
        { text: 'Carry it yourself, down the main street to the dhow.', onSelect: () => c1cLoad('carry') },
    ],
});
scene('c1c_lena_after', { speaker: 'Brandt', text: `She doesn't look away from you. She doesn't say anything. She's said it twice already.`, choices: [{ text: 'Go.' }] });
function c1cLoad(how) {
    const m = Game.maps.ch1; Truck.ph = 'met'; taskDone('c1c_truck');
    if (how === 'pickup') {
        Game.fadeTo(() => {
            Truck.clearExtras(m);
            const z = m.ents.find(q => q.id === 'c1c_zaki'), p = Game.player;
            p.x = z.x - 20; p.y = z.y + 12; p.dir = DIR.right; clockAdvance(10); if (Game.set.time === 5) Game.hour = storyHour();
            c1cAboard('pickup'); startDialogue('c1c_aboard_pickup');
        });
    } else {
        sflag('c1c_package', 'carried');
        task('c1c_carry', 'Carry the package down the main street to Zaki\'s dhow, the Umm Kalthoum.');
        const Z = Truck.zaki; if (Z) { Z.walkTo = [Truck.pickup.x + 48, Truck.pickup.y + 30]; Z.ghost = true; }
        setTimeout(() => { if (Truck.pickup) { World.removeEnt(m, Truck.pickup); Truck.pickup = null; } Truck.zaki = null; Truck.realZaki(m, true); }, 2500);
        Toast.show('"Suit yourself," says Zaki. "I\'ll see you at the boat." The pickup coughs away down the highway.', 6);
    }
}
function c1cAboard(how) {
    sflag('c1c_package', 'aboard'); sflag('c1c_package_how', how); taskDone('c1c_carry');
    delete Game.bag['The package'];
    storyNote('The package', 'In the locker under the Umm Kalthoum\'s wheel, in a fish crate, under a tarpaulin. Zaki locked it and put the key round his neck.');
    task('c1c_sail', 'Out past the reef to the ship with Zaki, once you have the diesel, a way past the coast guard, and Rana\'s kit.');
    setTimeout(() => storyMessage('B. Nassar', 'Good. Now be invisible. — B.'), 2500);
}
scene('c1c_aboard_pickup', {
    speaker: 'Captain Zaki',
    text: `The pickup bangs down the main street with its lights off and stops on the quay beside the Umm Kalthoum. Zaki takes the case from you as if it might go off, carries it aboard, and stows it in the locker under the wheel, in a fish crate, under a tarpaulin. He locks it and hangs the key round his neck, next to his mother's Qur'an.\n\n"She watched us all the way down to the corner," he says. "The German. Like a hawk watches a mouse." He spits over the side. "I've been watched by the coast guard, the army, the Saudis and my wife. I didn't like that one."`,
    choices: [{ text: '"Neither did I."' }],
});
scene('c1c_aboard_carry', {
    speaker: 'Captain Zaki',
    text: `Zaki is waiting on the quay, his cousin's pickup ticking as it cools somewhere up the street. He takes the case from you as if it might go off, carries it aboard, and stows it in the locker under the wheel, in a fish crate, under a tarpaulin. He locks it and hangs the key round his neck, next to his mother's Qur'an.\n\n"Heavy," he says. "Books are heavy. Gold is heavy. Trouble is heavy." He looks at you. "I don't want to know which."`,
    choices: [{ text: '"Neither do I."', onSelect: () => c1cAboard('carried') }],
});
// Zaki, now: the package
(function () {
    const prev = STORY_SCRIPTS.c1c_zaki;
    STORY_SCRIPTS.c1c_zaki = e => sflag('c1c_package') === 'carried' ? 'c1c_aboard_carry' : sflag('c1c_package') === 'aboard' ? 'c1c_zaki_ready' : (typeof prev === 'function' ? prev(e) : prev);
})();
STORY_SCRIPTS.c1c_zaki_ts = 'c1c_zaki_ts';
scene('c1c_zaki_ts', { speaker: 'Captain Zaki', text: `Zaki doesn't take his eyes off the road. "Don't look at her," he says out of the side of his mouth. "She's looking at you enough for both of us."`, choices: [{ text: 'Go back to Brandt.' }] });
scene('c1c_zaki_ready', {
    speaker: 'Captain Zaki',
    text: () => {
        const miss = [!prepDone('fuel') && 'diesel', !prepDone('route') && 'a way past the coast guard', !prepDone('kit') && 'Rana\'s kit'].filter(Boolean);
        return `Zaki is on the dhow's deck in the dark, the locker key round his neck, the lamp unlit.\n\n` + (miss.length ? `"The package is aboard. But we're not going anywhere without ${miss.join(', and ')}." He taps the key. "It'll keep. Go."` : `"The package is aboard. Diesel in the tanks. The coast guard eating their dinner." He looks out at the black harbour mouth. "When you're ready, habibi. Not before."\n\n(The sailing is the next part of the story: coming soon.)`);
    },
    choices: [{ text: '"Soon, Zaki."' }],
});

// ---- the truck stop café: wait for ten ----
(function () {
    const prev = STORY_SCRIPTS.c1c_truckcafe;
    STORY_SCRIPTS.c1c_truckcafe = STORY_SCRIPTS.c1c_truckman = () => sflag('c1c_offer') && !sflag('c1c_package') && Story.s.clock < TRUCK.at - 3 ? 'c1c_ts_wait' : prev;
})();
scene('c1c_ts_wait', {
    speaker: 'Café Man',
    text: () => {
        const miss = [!prepDone('fuel') && 'diesel', !prepDone('route') && 'a route past the coast guard', !prepDone('kit') && 'Rana\'s kit'].filter(Boolean);
        return `"Waiting for somebody?" The café man pours you a tea without asking. "Everybody here is waiting for somebody. The drivers wait for the road. The road waits for the drivers."` + (miss.length ? `\n\n(You haven't sorted ${miss.join(', ')} yet. You can still do it after the truck.)` : '');
    },
    choices: [
        { text: 'Sit with a tea and wait for the truck. (until ten)', onSelect: () => Game.fadeTo(() => { const s = Story.s; clockAdvance(Math.max(0, TRUCK.at - 4 - s.clock)); if (Game.set.time === 5) Game.hour = storyHour(); const c = Game.maps.ch1.ents.find(q => q.id === 'c1c_truckcafe'), p = Game.player; p.x = c.x + c.w + 20; p.y = c.y + c.d + 20; p.dir = DIR.right; drink(15, 'Tea at the truck stop'); }) },
        { text: 'Something to eat first.', nextScene: 'c1c_truckcafe' },
        { text: 'Not now.' },
    ],
});

// ---- Bassem, if you're late ----
(function () {
    const A = AREAS.fixer, _clock = A.clockPassed, _frame = A.frame, _over = A.overlay, _sync = A.sync;
    A.clockPassed = function (a, b) {
        _clock.call(this, a, b);
        const at = t => a < t && b >= t;
        if (at(TRUCK.at + 20) && sflag('c1c_offer') && !sflag('c1c_lena_met')) storyMessage('B. Nassar', 'The German woman is waiting, habibi. She doesn\'t like waiting. Neither do I. — B.');
        if (at(TRUCK.at + 50) && sflag('c1c_offer') && !sflag('c1c_lena_met')) storyMessage('B. Nassar', 'Habibi. — B.');
    };
    A.frame = function (dt) { _frame.call(this, dt); Truck.frame(dt); };
    A.overlay = function (g, cx, cy) { if (_over) _over.call(this, g, cx, cy); Truck.draw(g, cx, cy); };
    A.sync = function () { _sync.call(this); Truck.map = null; };
    const _watch = A.watch; A.watch = function () { const w = _watch.call(this); return sflag('c1c_package') === 'aboard' ? ' The package is aboard.' : w; };
})();

// ---- where the compass points ----
TASK_TARGETS.c1c_truck = () => Truck.lena ? 'c1c_lena' : 'c1c_truckcafe';
TASK_TARGETS.c1c_carry = () => 'c1c_zaki';
TASK_TARGETS.c1c_sail = () => 'c1c_zaki';
