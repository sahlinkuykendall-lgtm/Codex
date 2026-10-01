// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-C, BEAT 5: YOU OPEN IT (poke/ch1c_open.js)
// story/regions/ch01_opening_fixer.md, beat 5: "You open it on the dhow, in the dark.
// Inside: the Codex, a GPS tracker, and a note in the flap in Miriam's handwriting: 'If
// you're reading this, they stole it from me. Father Bishoy, El-Fishawy, Thursday. Please.'"
//   - cast off: the Umm Kalthoum slides out of the harbour on the real map, no lights, past
//     the coast guard post at dinner, out between the island and the breakwater, and south
//     round Bassem's point (the route the fisherman or the fort gave you)
//   - the deck at sea (a room you can walk about): the hooded lamp, the engine, Zaki at the
//     wheel pretending not to look, the locker key "on the nail, in case you need a rope"
//   - the case: cut the wire, or (Lockpicking) work it out of the seal so it could go back
//     as it was; inside, the Codex in a green scarf, the tracker in the lining, the note
//   - the ship's green lamp, twice, far off: beat 6 begins there
// The Fixer doesn't know Miriam: the note isn't signed, so in the bag it's "the note in the flap".
// ============================================================

Object.assign(ITEM_INFO, {
    'GPS tracker': { key: 1, desc: 'A black plastic box the size of a matchbox, peeled out of the case\'s lining, its green light blinking every two seconds like a heartbeat. Somewhere, on a screen, a dot is following you around.' },
    'The note in the flap': { key: 1, desc: 'A page torn from a notebook, folded small, blue ink in a quick slanting hand pressed hard into the paper: "If you\'re reading this, they stole it from me. Father Bishoy, El-Fishawy, Thursday. Please." No name. El-Fishawy is the old café in Khan el-Khalili, in Cairo.' },
});
(function () {                                                   // the Codex, as the Fixer finds it
    const I = ITEM_INFO['The Codex'], d = Object.getOwnPropertyDescriptor(I, 'desc'), prev = d.get ? d.get : () => d.value;
    Object.defineProperty(I, 'desc', { get() { return Game.player.bg === 'fixer' ? 'A leather-bound book of papyrus leaves with a long wrap-around flap, old beyond old, wrapped in a green silk scarf that smells of dust and somebody\'s perfume. Greek, you think, with little temple pictures beside some lines. It came out of Bassem\'s package. It\'s worth more than Bassem.' : prev.call(this); }, configurable: true });
})();

// ============================================================
// CASTING OFF: the voyage out, on the map
// ============================================================
const VOYAGE_PTS = [[60.5, 26.2], [66, 31], [67.6, 38.6], [73.5, 40.6], [78.6, 44], [78, 52], [77, 59.5]];   // tile coords of the dhow's foot
const VOYAGE_SAY = { 1: 'Out between the moored boats, the engine just above a murmur, no lights. Zaki steers by the shapes of things.', 3: 'Past the coast guard post: lit windows, a television, the crew at their dinner. Nobody looks out.', 5: 'Round the Shark\'s own point. Bassem\'s villa, every light on, and someone on the terrace with a glass, looking the other way.' };
const Voyage = {
    on: false, i: 0, d: null, z: null, trail: [],
    start() {
        const m = Game.maps.ch1; this.d = m.ents.find(e => e.id === 'c1c_dhow'); this.z = m.ents.find(e => e.id === 'c1c_zaki');
        if (!this.d) return this.end();
        voyageHold(); if (!this.d.home) this.d.home = [this.d.x, this.d.y]; World.setSolid(m, this.d, false); this.i = 0; this.trail = []; this.on = true;
        const [tx, ty] = VOYAGE_PTS[0]; this.d.x = tx * TILE - this.d.w / 2; this.d.y = ty * TILE - this.d.d; this.place();
        if (this.z) this.z.gone = false;
    },
    place() {
        const d = this.d, p = Game.player; d.sortY = d.y + 4; d.light = null;   // (people stand on its deck, in front; no lights)
        p.x = d.x + d.w * 0.42; p.y = d.y + d.d * 0.62; p.dir = DIR.down; p.frame = 0;
        if (this.z) { this.z.x = d.x + d.w * 0.74; this.z.y = d.y + d.d * 0.6; this.z.sortY = this.z.y + 1; this.z.person.dir = DIR.right; }
    },
    frame(dt) {
        if (!this.on || Dlg.active) return;
        const d = this.d, j = this.i + 1;
        if (j >= VOYAGE_PTS.length) return this.end();
        const fx = d.x + d.w / 2, fy = d.y + d.d, [tx, ty] = VOYAGE_PTS[j], dx = tx * TILE - fx, dy = ty * TILE - fy, dist = Math.hypot(dx, dy), v = 58 * dt;
        if (dist <= v) { d.x += dx; d.y += dy; this.i = j; if (VOYAGE_SAY[j]) Toast.show(VOYAGE_SAY[j], 6); }
        else { d.x += dx / dist * v; d.y += dy / dist * v; }
        this.trail.push([d.x + d.w / 2, d.y + d.d - 6, Game.time]); if (this.trail.length > 60) this.trail.shift();
        this.place();
    },
    draw(g, cx, cy) {
        if (!this.on) return;
        const A = pa(g);
        const d = this.d;
        for (const [x, y, t] of this.trail) { const age = Game.time - t; if (age > 3 || (x > d.x - 8 && x < d.x + d.w + 8 && y > d.y - 50 && y < d.y + d.d + 2)) continue; g.globalAlpha = Math.max(0, 0.5 - age * 0.16); A.r(Math.round(x - cx - 6 - age * 4), Math.round(y - cy), 3, 1, '#e8f0ff'); A.r(Math.round(x - cx + 4 + age * 4), Math.round(y - cy), 3, 1, '#e8f0ff'); }
        g.globalAlpha = 1;
        Txt.draw(g, 'THE UMM KALTHOUM, NO LIGHTS', Game.VW >> 1, 6, { col: '#ffe890', shadow: '#1c1814', align: 'center' });
    },
    end() {
        this.on = false;
        const m = Game.maps.ch1;
        if (this.d) this.d.gone = true; if (this.z) this.z.gone = true;           // (they're out at sea now)
        sflag('c1c_at_sea', true);
        Game.fadeTo(() => {
            const room = Game.maps.INT_DHOW = buildRoom('INT_DHOW', window.POKE_MAP, [VOYAGE_PTS[0][0] * TILE, VOYAGE_PTS[0][1] * TILE]), p = Game.player;
            p.x = room.pw * 0.42; p.y = room.ph - 60; p.dir = DIR.up;
            Game.enter(room); clockAdvance(25); if (Game.set.time === 5) Game.hour = storyHour();
            startDialogue('c1c_sea1');
        });
    },
};
function voyageHold() {                                          // no walking off, and nothing to talk to, while the boat carries you (installed on first use: Game loads after this file)
    if (Game._voyageHold) return; Game._voyageHold = true;
    const _mp = Game.movePlayer, _ft = Game.findTarget;
    Game.movePlayer = function (dt) { if (Voyage.on) { this.player.frame = 0; return; } return _mp.call(this, dt); };
    Game.findTarget = function () { if (Voyage.on) return null; return _ft.apply(this, arguments); };
}
// Zaki: "Cast off" once everything's ready
(function () {
    const sc = STORY.c1c_zaki_ready, t0 = sc.text, orig = typeof t0 === 'function' ? t0 : () => t0;
    sc.text = () => orig().replace('\n\n(The sailing is the next part of the story: coming soon.)', '');
    Object.defineProperty(sc, 'choices', { get() { return prepDone('fuel') && prepDone('route') && prepDone('kit') ? [{ text: '"Cast off, Zaki."', onSelect: () => Game.fadeTo(() => Voyage.start()) }, { text: '"Not yet."' }] : [{ text: '"Soon, Zaki."' }]; }, configurable: true });
})();

// ============================================================
// THE DECK, AT SEA
// ============================================================
const FURND = {
    mast() { const st = stage(24, 14, 96), { A } = st, x = st.x + 10, y = st.y - 94; A.r(x, y, 5, 104, '#8e6a44'); A.vl(x, y, 104, '#b8946a'); A.vl(x + 4, y, 104, '#5a3e24'); A.line(x - 8, y + 6, x + 22, y - 2, '#6a4a2c'); A.line(x - 8, y + 7, x + 22, y - 1, '#8e6a44'); A.r(x - 6, y + 4, 26, 6, '#e8dcc0'); A.hl(x - 6, y + 4, 26, '#fffaf0'); for (let i = 0; i < 3; i++) A.vl(x - 2 + i * 8, y + 4, 6, '#c8bca0'); A.line(x + 2, y + 10, x - 10, y + 104, '#5a4a3a'); return fit(st, { solid: [6, 4, 12, 10] }); },
    wheel() { const st = stage(44, 26, 30), { A } = st, x = st.x, y = st.y - 26; A.r(x + 2, y + 26, 40, 24, '#7a5a3a'); A.hl(x + 2, y + 26, 40, '#a8845c'); A.r(x + 6, y + 32, 32, 14, '#5a3e24'); A.r(x + 18, y + 37, 8, 4, '#c89020'); A.vl(x + 22, y + 10, 18, '#5a3e24'); A.ell(x + 22, y + 10, 10, 10, '#6a4a2c'); A.ell(x + 22, y + 10, 7, 7, '#a8845c'); A.ell(x + 22, y + 10, 2, 2, '#c89020'); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; A.line(x + 22, y + 10, x + 22 + Math.round(Math.cos(a) * 12), y + 10 + Math.round(Math.sin(a) * 12), '#5a3e24'); } A.r(x + 36, y + 22, 2, 6, '#3a3e48'); A.r(x + 35, y + 21, 4, 2, '#c89020'); return fit(st, { solid: [2, 4, 40, 20] }); },
    engine() { const frames = [0, 1].map(f => { const st = stage(46, 30, 26), { A } = st, x = st.x, y = st.y - 22; A.r(x, y + 22, 46, 26, '#5a3e24'); A.hl(x, y + 22, 46, '#7a5a3a'); A.r(x + 4, y + 26, 38, 18, '#3a3e48'); for (let i = 8; i < 40; i += 6) A.vl(x + i, y + 27, 16, '#5a6068'); A.r(x + 36, y, 5, 26, '#2a2e36'); A.hl(x + 36, y, 5, '#5a6068'); A.ell(x + 38 + f, y - 4 - f * 3, 3, 2, '#5a5a62'); A.ell(x + 40 - f, y - 10 - f * 2, 2, 2, '#7a7a82'); return outline(st.c); }); return { c: frames[0], frames, fps: 4, ox: -1, oy: -27, solid: [0, 2, 46, 26] }; },
    teapot() { const frames = [0, 1].map(f => { const st = stage(26, 16, 18), { A } = st, x = st.x, y = st.y - 14; A.r(x + 2, y + 14, 22, 14, '#3a3e48'); A.hl(x + 2, y + 14, 22, '#5a6068'); A.r(x + 6, y + 18, 14, 4, f ? '#f09030' : '#e07020'); A.ell(x + 13, y + 9, 7, 6, '#2a2e36'); A.ell(x + 11, y + 7, 3, 2, '#5a6068'); A.line(x + 19, y + 9, x + 24, y + 4, '#2a2e36'); A.r(x + 11, y + 2, 4, 2, '#2a2e36'); A.px(x + 24, y + 2 - f, '#c8ccd0'); for (const gx of [x - 4, x + 26]) { A.r(gx, y + 20, 4, 6, '#d8e8f0'); A.r(gx, y + 23, 4, 3, '#b8501c'); } return outline(st.c); }); return { c: frames[0], frames, fps: 3, ox: -1, oy: -19, solid: [2, 4, 22, 12], light: { x: 0, y: -4, r: 26, c: '#ffa050' } }; },
    rope() { const st = stage(28, 18, 4), { A } = st, x = st.x, y = st.y; for (let r = 12; r > 2; r -= 3) { A.ell(x + 14, y + 9, r, r * 0.6, '#c8a878'); A.ell(x + 14, y + 9, r - 1, r * 0.6 - 1, '#a88858'); } return fit(st, { solid: [2, 2, 24, 14] }); },
    lamp() { const frames = [0, 1].map(f => { const st = stage(16, 12, 30), { A } = st, x = st.x, y = st.y - 28; A.r(x + 7, y + 4, 2, 36, '#5a3e24'); A.hl(x + 3, y + 4, 10, '#5a3e24'); A.r(x + 2, y + 6, 10, 2, '#20242c'); A.r(x + 3, y + 8, 8, 10, '#3a3e48'); A.r(x + 4, y + 10, 6, 6, f ? '#ffd060' : '#f0b040'); A.r(x + 3, y + 8, 8, 4, '#20242c'); A.r(x + 3, y + 18, 8, 2, '#20242c'); return outline(st.c); }); return { c: frames[0], frames, fps: 2.5, ox: -1, oy: -31, solid: [4, 4, 8, 8], light: { x: 0, y: -18, r: 70, c: '#ffc070', flicker: true } }; },
    kitbag() { const st = stage(22, 12, 10), { A } = st, x = st.x, y = st.y - 8; A.ell(x + 11, y + 12, 10, 7, '#20242c'); for (let i = 2; i < 20; i += 3) A.vl(x + i, y + 6, 12, '#3a3e48'); A.r(x + 5, y + 3, 6, 6, '#f0c040'); A.r(x + 13, y + 6, 6, 4, '#3aa8c8'); return fit(st, { solid: [1, 2, 20, 10] }); },
};
ROOMS.INT_DHOW = {
    name: 'THE UMM KALTHOUM', tw: 12, th: 7, style: 'deck',
    build({ map, A, put, wall, pw, ph, W }) {
        map.dark = true;                                          // (night at sea: the lamp, and the moon)
        World.addSolid(map, 0, ph - 14, pw, 14);                  // (the gunwale: no way off but the sea)
        wall(20, pw - 40, null, { label: 'The Sea', say: ['System', 'Black water to every side, the moon laying a path across it, the stars down to the horizon. Behind you, far off now, Marsa Tarfa is a handful of lights, and the lighthouse turning, every eleven seconds, as if it were looking for you.'] });
        put(70, W + 14, FURND.mast(), null, { label: 'The Mast', say: ['System', 'The Umm Kalthoum\'s mast, the big lateen sail furled along its yard, lashed tight. Zaki hasn\'t put it up in years: diesel is faster, and doesn\'t argue. He keeps it for weddings and funerals.'] });
        put(pw - 104, W + 18, FURND.wheel(), null, { label: 'The Wheel', script: 'c1c_locker' });
        put(30, W + 70, FURND.engine(), null, { label: 'The Engine Hatch', say: ['System', 'The engine hatch, the diesel thumping away under it like a heart with something on its mind, a little smoke coming out of the pipe. It smells of Zaki\'s diesel, or the harbour\'s, depending on how you came by it.'] });
        put((pw >> 1) - 20, W + 52, FURND.lamp(), null, { label: 'The Lamp', say: ['System', 'A hurricane lamp on a post, turned down to almost nothing and hooded with a bit of sacking so it only lights the deck. Zaki says the sea has eyes.'] });
        put((pw >> 1) - 52, W + 66, FURND.rope(), null, { label: 'A Coil of Rope', say: ['System', 'A coil of rope by the lamp, the right height to sit on.'] });
        put((pw >> 1) + 24, W + 74, FURND.teapot(), null, { label: 'Tea', script: 'c1c_dhow_tea' });
        put(pw - 60, ph - 58, crates(44, 30, 'dhowfish'), null, { label: 'Fish Crates', say: ['System', 'Empty fish crates stacked by the stern, smelling of the last forty years of fish. If anyone asks, that\'s what you were doing out here.'] });
        if (prepDone('kit')) put(110, ph - 50, FURND.kitbag(), null, { label: 'Rana\'s Kit', say: ['System', 'Rana\'s diving kit in its mesh bag, her initials on everything in red nail varnish, the little yellow pony bottle. "If you go in, swim for the reef. Not for the boat."'] });
        personAt(map, pw - 82, W + 52, 'c1c_zaki_deck', 'Captain Zaki', 'c1c_zaki', 3);
    },
};
STORY_SCRIPTS.c1c_zaki_deck = () => sflag('c1c_opened') ? 'c1c_zaki_deck2' : 'c1c_zaki_deck';
scene('c1c_zaki_deck', { speaker: 'Captain Zaki', text: `Zaki doesn't turn round from the wheel. "Twenty minutes, maybe thirty." He adjusts the wheel by the width of a hair. "The key's on the nail. In case you need a rope." He goes on not turning round, very carefully.`, choices: [{ text: 'Leave him to it.' }] });
scene('c1c_zaki_deck2', { speaker: 'Captain Zaki', text: `Zaki is watching the green light on the water, far off. "Slowly," he says. "Slowly, and quietly, and then we'll see what kind of people show a green lamp to an old man in the middle of the night."`, choices: [{ text: 'Watch with him.' }] });
STORY_SCRIPTS.c1c_dhow_tea = 'c1c_dhow_tea';
scene('c1c_dhow_tea', {
    speaker: 'System',
    text: `Zaki's blackened teapot on a little charcoal brazier, glasses beside it, a twist of sugar in a paper, and a round of bread and white cheese in a cloth. On the Umm Kalthoum there is always tea. "A man can face anything," Zaki says, "with tea."`,
    choices: [{ text: 'Pour a glass, and eat a little.', onSelect: () => { drink(30, 'Zaki\'s tea, black, at sea'); if (!sflag('c1c_dhow_bread')) { sflag('c1c_dhow_bread', true); eat(30, 'Bread and white cheese'); } } }, { text: 'Leave it.' }],
});
scene('c1c_sea1', {
    speaker: 'Captain Zaki',
    text: `The engine thumps under your feet. Marsa Tarfa is a line of lights behind you, then a handful, then only the lighthouse, turning. Zaki stands at the wheel with the compass lamp hooded, steering by the stars and the bones in his knees.\n\n"Twenty minutes to the ship," he says, without turning round. "Maybe thirty." A pause. "The locker key is on the nail by the wheel. In case you need a rope."\n\nHe goes on not turning round, very carefully.`,
    choices: [{ text: 'Look around the deck.', onSelect: () => { task('c1c_open', 'The package is in the locker under the wheel. The key is on the nail.'); taskDone('c1c_sail'); } }],
});

// ---- the locker, the case, and what's in it ----
STORY_SCRIPTS.c1c_locker = 'c1c_locker';
scene('c1c_locker', {
    speaker: 'System',
    text: () => sflag('c1c_opened') ? `The locker under the wheel, open, the empty case back in its fish crate. Everything that was in it is in your bag.` : `The wheel, the compass in its brass box, and under them the locker, the key hanging on its nail where Zaki left it. Inside, in the fish crate under the tarpaulin: the case.\n\nBrandt's voice, level, in your head: Don't open it.` + (sflag('c1c_lena_word') ? `\n\nYou gave her your word.` : ''),
    get choices() { return sflag('c1c_opened') ? [{ text: 'Close it.' }] : [{ text: 'Take it out, and sit down by the lamp.', nextScene: 'c1c_case' }, { text: 'Leave it.' }]; },
});
scene('c1c_case', {
    speaker: 'System',
    text: `You sit on the coil of rope by the hooded lamp with the case across your knees. A twist of wire runs through the clasp and the flap, the ends crimped into a lead seal stamped with a little shield.\n\nThe engine thumps. Zaki steers. The sea goes past, black, saying nothing.`,
    get choices() {
        const c = [{ text: 'Cut the wire with your knife.', onSelect: () => sflag('c1c_seal', 'cut'), nextScene: 'c1c_open1' }];
        c.push({ text: '[Lockpicking] Work the wire out of the seal without breaking it.', onSelect: () => { sflag('c1c_seal', 'intact'); skillXP('lockpicking', 20, 'the seal'); }, nextScene: 'c1c_open1' });
        c.push({ text: 'Put it back.', nextScene: 'c1c_case_back' });
        return c;
    },
});
scene('c1c_case_back', { speaker: 'System', text: `You put it back in the fish crate, under the tarpaulin, and lock the locker, and hang the key on its nail.\n\nZaki says nothing, very loudly.`, choices: [{ text: 'Get up.' }] });
scene('c1c_open1', {
    speaker: 'System',
    text: () => (sflag('c1c_seal') === 'intact' ? `It takes five minutes and all of your patience, the wire coaxed back through the soft lead a hair at a time. The seal stays whole. You could put it all back, and nobody would ever know.\n\n` : `The knife goes through the wire with a click that's louder than the engine. That's that, then.\n\n`) + `Inside the case, wrapped in a green silk scarf that smells of dust and somebody's perfume: a book.\n\nNot a book. Leather boards worn black at the corners, a long leather flap wrapped round and round them and tied with a thong, and inside, leaves of something that isn't paper: brown, fibrous, brittle as dead leaves, written over in a small dark hand. Letters that look Greek. Beside some of the lines, little marks like the pictures on temple walls.\n\nYou don't read Greek. You don't need to. You've moved enough stolen things up and down this coast to know what this is: old, and real, and worth more than Bassem, his villa and his debt put together.`,
    choices: [{ text: 'Run your thumb round the inside of the case.', nextScene: 'c1c_open2' }],
});
scene('c1c_open2', {
    speaker: 'System',
    text: `Something hard in the lining. A slit in the seam, and inside it, taped flat: a black plastic box the size of a matchbox, with a green light that blinks, every two seconds, like a heartbeat.\n\nA tracker. Somebody wants to know exactly where this goes. Somebody who doesn't trust Bassem, or Zaki, or you.`,
    choices: [{ text: 'Peel it out of the lining.', onSelect: () => pocket('GPS tracker'), nextScene: 'c1c_open3' }],
});
scene('c1c_open3', {
    speaker: 'System',
    text: `And in the book's flap, folded small, a page torn from a notebook. Blue ink, a quick slanting hand, a woman's, pressed hard into the paper as if she was in a hurry, or afraid:\n\n"If you're reading this, they stole it from me. Father Bishoy, El-Fishawy, Thursday. Please."\n\nNo name. Just that: please.\n\nEl-Fishawy you know: the old café in Khan el-Khalili, in Cairo, where every tourist and every crook in the city has drunk tea under the mirrors. Father Bishoy is a priest's name. A Copt's. Thursday is the day after tomorrow.`,
    choices: [{ text: 'Read it again.', nextScene: 'c1c_open4' }],
});
scene('c1c_open4', {
    speaker: 'Captain Zaki',
    text: `Zaki has turned round. He's been turned round for some time. He looks at the book on your knees, and at the little green light blinking in your palm, and at the note.\n\n"Habibi," he says, very softly. "That is not a package. That is a curse."\n\nHe looks out to sea. Far off, low on the black water: a light. Green. It goes out.\n\nGreen again.`,
    choices: [{ text: '"Green, twice."', nextScene: 'c1c_open5' }],
});
scene('c1c_open5', {
    speaker: 'Captain Zaki',
    text: `"Your ship." He throttles back until the engine is barely a heartbeat. "So. Do we give them their curse, and go home, and sleep?" He looks at the tracker blinking in your hand. "And will they let us?"`,
    choices: [{ text: '"Take us in, Zaki. Slowly."', onSelect: () => c1cOpened() }],
});
function c1cOpened() {
    sflag('c1c_opened', true); taskDone('c1c_open');
    pocket('The Codex', 1, true); pocket('The note in the flap', 1, true);
    storyNote('What was in the package', 'A codex: a leather-bound book of papyrus leaves with a wrap-around flap, Greek with little temple pictures in the margins, wrapped in a green silk scarf. Taped in the case\'s lining, a GPS tracker. And in the flap, a note in a woman\'s hand: "If you\'re reading this, they stole it from me. Father Bishoy, El-Fishawy, Thursday. Please."' + (sflag('c1c_seal') === 'intact' ? ' The seal is whole: you could put it back as it was.' : ' You cut the wire.'));
    storyNotice('The Codex, a tracker, and a note: "Please."');
    task('c1c_ship', 'The ship\'s green lamp, offshore. "The man you give it to will say Hamburg."');
}

// ---- the hooks ----
(function () {
    const A = AREAS.fixer, _frame = A.frame, _over = A.overlay, _sync = A.sync;
    A.frame = function (dt) { _frame.call(this, dt); Voyage.frame(dt); };
    A.overlay = function (g, cx, cy) { if (_over) _over.call(this, g, cx, cy); Voyage.draw(g, cx, cy); };
    A.sync = function () { _sync.call(this); const m = Game.maps.ch1; if (m && sflag('c1c_at_sea')) for (const id of ['c1c_dhow', 'c1c_zaki']) { const e = m.ents.find(q => q.id === id); if (e) { e.gone = true; World.setSolid(m, e, false); } } };
    const _watch = A.watch; A.watch = function () { return sflag('c1c_at_sea') ? ' At sea, past the reef.' : _watch.call(this); };
})();
TASK_TARGETS.c1c_open = () => ({ room: 'INT_DHOW', id: 'c1c_zaki_deck', out: 'c1c_dhow' });
TASK_TARGETS.c1c_ship = () => ({ room: 'INT_DHOW', id: 'c1c_zaki_deck', out: 'c1c_dhow' });
