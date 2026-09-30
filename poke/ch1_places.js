// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-A PLACES (poke/ch1_places.js)
// Step 7 of AREA1_TODO.md: what the bible's PLACES table has that the camp was missing.
//   - the Osiris Shaft inside: three levels down a ladder, the lowest flooded, the niche
//   - the watchtower: climb it and every place goes on your map; with Miriam's field
//     glasses you see the car waiting by the shaft
//   - the supply train running up and down its line once Uncle Hamid's pin is in
//   - Trench B's red stake on its spoil heap (gone once you've sifted out the key)
//   - the find store's Ministry seal on its steel door: whole, slit, broken, or resealed
// Nothing that's already there moves or is redrawn.
// ============================================================

// ---- the shaft's furniture ----
const SHAFT_ART = {
    ladderHole() {                                      // a square hole in the floor, a ladder's rails poking up
        const st = stage(34, 26, 16), { A } = st, x = st.x, y = st.y;
        A.r(x, y, 34, 26, PAL.rock[3]); A.r(x + 2, y + 2, 30, 22, '#14100c'); A.r(x + 2, y + 2, 30, 3, PAL.rock[4]);
        A.r(x + 8, y - 14, 3, 30, PAL.wood[2]); A.r(x + 23, y - 14, 3, 30, PAL.wood[2]); A.vl(x + 8, y - 14, 30, PAL.wood[1]); A.vl(x + 23, y - 14, 30, PAL.wood[1]);
        for (let j = -10; j < 24; j += 6) A.r(x + 11, y + j, 12, 2, j < 2 ? PAL.wood[1] : PAL.wood[3]);
        return fit(st, { solid: [0, 0, 34, 26] });
    },
    sarcophagus(dark) {                                 // a stone coffin, its lid long gone
        const P = dark ? ['#6a6a70', '#4c4c54', '#34343a', '#222228'] : [PAL.rock[0], PAL.rock[1], PAL.rock[2], PAL.rock[3]];
        const st = stage(44, 22, 16), { A } = st, x = st.x, y = st.y - 14;
        A.r(x, y, 44, 14, P[0]); A.r(x + 3, y + 3, 38, 9, '#1c1814'); A.r(x + 3, y + 3, 38, 2, P[3]);
        A.r(x, y + 14, 44, 22, P[1]); A.r(x, y + 14, 44, 1, P[0]); A.vl(x + 43, y + 14, 22, P[2]); A.r(x, y + 34, 44, 2, P[3]);
        if (dark) for (let i = 0; i < 20; i++) A.px(x + Math.floor(hash2(i, 7) * 44), y + 15 + Math.floor(hash2(i, 8) * 18), i % 2 ? '#8a8a92' : '#2a2a30');
        return fit(st, { solid: [0, 0, 44, 22] });
    },
    niche(A, x, y) { A.r(x - 1, y - 1, 34, 26, PAL.rock[3]); A.r(x, y, 32, 24, '#1c1814'); A.r(x, y, 32, 3, '#0c0a08'); for (let i = 0; i < 9; i++) A.px(x + 2 + Math.floor(hash2(i, 3) * 28), y + 22 - (i % 3), PAL.white[1]); A.r(x - 4, y + 24, 40, 3, PAL.rock[0]); },
    mark(A, x, y) { A.r(x, y, 20, 2, PAL.red[2]); A.r(x + 9, y - 8, 2, 18, PAL.red[2]); Txt.draw(A.g, '1999', x + 24, y - 6, { col: PAL.red[3] }); },
};

// ---- the three levels ----
Object.assign(ROOMS, {
    INT_SHAFT1: { name: 'THE OSIRIS SHAFT · LEVEL 1', tw: 12, th: 8, style: 'rock', build({ map, A, put, wall, pw, ph, W }) {
        SHAFT_ART.mark(A, 40, 26); wall(36, 60, null, { label: 'Survey Mark', say: ['System', 'A red survey mark painted on the rock, and a date: 1999, the year the Supreme Council of Antiquities cleared the shaft. Before that it was full to the brim with sand and water, and the stories about it were better than the truth.'] });
        put(pw - 80, W + 40, SHAFT_ART.ladderHole(), null, { label: 'Ladder Down', shaftDown: 'INT_SHAFT2', script: 'c1a_ladder_down' });
        put(30, W + 60, FURN.lamp(), null, { label: 'Work Lamp', say: ['System', 'A work lamp on a battery, left by Miriam\'s team. Its light doesn\'t reach the corners.'] });
        put(90, ph - 70, FURN.jerrycans());
        wall(pw / 2 - 40, 80, null, { label: 'Level One', say: ['System', 'Level one of the Osiris Shaft: a bare chamber cut into the bedrock under the causeway, nine metres down. Late Period, 26th Dynasty or so: two and a half thousand years old, dug for a god who was always about the underworld and the water.'] });
    } },
    INT_SHAFT2: { name: 'THE OSIRIS SHAFT · LEVEL 2', tw: 12, th: 8, style: 'rock', build({ map, A, put, wall, pw, ph, W }) {
        [36, 150, 264].forEach((x, i) => put(x, W + 4, SHAFT_ART.sarcophagus(i === 1), null, { label: 'Sarcophagus', say: ['System', ['A limestone sarcophagus in its niche, the lid long gone, the inside swept clean by robbers who came in Roman times, or earlier.', 'A granite sarcophagus, black and speckled, too heavy for anyone ever to take. The robbers took the lid and whoever was inside, and left the box.', 'Another limestone coffin. Someone has scratched a name in Greek letters on the rim, very small, and later someone else has tried to scratch it out.'][i]] }));
        put(40, ph - 90, SHAFT_ART.ladderHole(), null, { label: 'Ladder Down', shaftDown: 'INT_SHAFT3', script: 'c1a_ladder_down' });
        put(pw - 60, ph - 80, FURN.lamp());
    } },
    INT_SHAFT3: { name: 'THE OSIRIS SHAFT · LEVEL 3', tw: 12, th: 8, style: 'rock', build({ map, A, put, wall, pw, ph, W }) {
        // the water table: two pools, a causeway of rock down the middle, a ledge along the back wall
        const cx0 = 168, cx1 = 216, top = W + 30, E = ROOM.EDGE;
        const pool = (x0, x1) => {
            A.r(x0, top, x1 - x0, ph - E - top, '#0c1a28'); A.r(x0, top, x1 - x0, 2, PAL.rock[3]);
            for (let i = 0; i < 30; i++) { const x = x0 + 4 + Math.floor(hash2(i, x0) * (x1 - x0 - 12)), y = top + 6 + Math.floor(hash2(x0, i) * (ph - E - top - 12)); A.r(x, y, 6, 1, '#1c3448'); }
            World.addSolid(map, x0, top + 4, x1 - x0, ph - E - top - 4);
        };
        pool(E, cx0); pool(cx1, pw - E);
        // the granite sarcophagus on its little island, close to the causeway
        A.ell(250, 150, 26, 14, PAL.rock[3]); A.ell(250, 148, 24, 12, PAL.rock[2]);
        put(228, 124, SHAFT_ART.sarcophagus(true), null, { label: 'Granite Sarcophagus', say: ['System', 'A granite sarcophagus on an island of rock in the black water, exactly as the photographs from 1999 show it. The water is cold, clear and deep. There is nothing in the sarcophagus but the reflection of your lamp.'] });
        SHAFT_ART.niche(A, pw - 90, 16);
        wall(pw - 94, 40, null, { label: 'The Niche', script: 'c1a_shaft_l3' });
        put(24, W + 2, FURN.lamp());
        wall(40, 60, null, { label: 'The Water', say: ['System', 'The water table, a few feet down. It rises and falls with the Nile, the way it has since the shaft was cut. The Egyptians would have said Osiris was sleeping in it.'] });
    } },
});
// the niche: where Miriam found it
scene('c1a_shaft_l3', {
    speaker: 'System',
    text: `In the back wall, a recess the size of a bread oven, freshly cut through old plaster. Empty. The plaster crumbs on the ledge are still sharp-edged: days old, not years.\n\nThis is where Miriam found it.\n\nThere is nothing else here. Whatever the "older seal" is, it isn't down here. It's on the approach, where the shaft was first cut.`,
    choices: [{ text: 'Step back from the niche.', onSelect: () => { if (!sflag('shaft_seen')) { sflag('shaft_seen', true); storyNote('The Osiris Shaft, level 3', 'The niche Miriam cut through the plaster is empty. The "older seal" from her note is up on the shaft approach.'); skillXP('excavation', 20); } } }],
});

// going down and up the shaft
function c1aShaftDown(key, from) {
    clockAdvance(5); Sfx.door();
    Game.fadeTo(() => {
        const m = Game.maps.ch1, tm = m.ents.find(e => e.id === 'tunnel_mouth');
        const back = [tm.x + tm.w / 2, tm.y + tm.d + 18];
        const room = Game.maps[key] || (Game.maps[key] = buildRoom(key, window.POKE_MAP, back));
        room.back = back;                                             // (saving down here saves you at the top)
        room.up = from ? { key: from.key, at: [from.x, from.y] } : null;
        Game.player.x = room.spawn[0]; Game.player.y = room.spawn[1] - 12; Game.player.dir = DIR.up;
        Game.enter(room); storyOnEnter(key);
    });
}
scene('c1a_ladder_down', { speaker: 'System', text: 'The ladder goes down into the dark. It\'s colder down there, and it smells of water.', choices: [{ text: 'Climb down. (5 minutes)', onSelect: () => { const e = Game.target; c1aShaftDown(e.shaftDown, { key: Game.map.key, x: e.x + 16, y: e.y + e.d + 22 }); } }, { text: 'Not yet.' }] });

// ============================================================
// THE WATCHTOWER
// ============================================================
STORY_SCRIPTS.c1p_tower = 'c1p_tower';
scene('c1p_tower', {
    speaker: 'System',
    text: `An old antiquities-police watchtower, steel legs and a tin hut, abandoned when they put up cameras. The ladder is sound. Mostly.`,
    choices: [{ text: 'Climb to the top. (10 minutes)', onSelect: () => { skillXP('climbing', sflag('tower') ? 10 : 50, 'the watchtower'); clockAdvance(10); startDialogue('c1p_tower_top'); } }, { text: 'Not tonight.' }],
});
scene('c1p_tower_top', {
    speaker: 'System',
    text: () => `The whole plateau lies below you: the lamps of both camps strung out like beads, the dig zone's work lights under the escarpment, the Bedouin fire, the pale quarry knobs, the supply line snaking away into the dunes. And beyond it all, grey and enormous against Cairo's glow, the pyramids, and the Sphinx, a dark shape looking east.` +
        (hasItem('Field glasses') ? `\n\nThrough Miriam's field glasses: a car parked without lights on the causeway road, by the Osiris Shaft. Someone is sitting in it, very still.` : `\n\nSomething glints on the causeway road, too far to make out. Field glasses would help.`),
    choices: [{ text: 'Mark everything you can see.', onSelect: () => {
        sflag('tower', true);
        for (const pl of Game.maps.ch1.places) Game.seen[pl.id] = 1;
        Notice.show('Every place on the plateau is on your map now.');
        if (hasItem('Field glasses') && !sflag('saw_shaft_car')) { sflag('saw_shaft_car', true); storyNote('The car by the shaft', 'From the watchtower, through Miriam\'s field glasses: a car with no lights on the causeway road by the Osiris Shaft, someone sitting very still inside. Someone is watching the shaft.'); storyNotice('Someone is watching the shaft.'); }
    } }],
});

// ============================================================
// THE SUPPLY TRAIN, running once the pin is in
// ============================================================
const Train = {
    x0: 1 * TILE, x1: 22 * TILE, v: 45, dir: 1, wait: 0,
    update(dt) {
        const m = Game.maps.ch1, e = m && m.ents.find(q => q.id === 'carts'); if (!e) return;
        if (sflag('hamid') !== 'fixed') return;
        if (!e.running) { e.running = true; e.home = e.x; World.setSolid(m, e, false); this.wait = 1.5; }   // (it can't be walked into while it runs)
        if (this.wait > 0) { this.wait -= dt; return; }
        e.x += this.dir * this.v * dt;
        if (e.x >= this.x1) { e.x = this.x1; this.dir = -1; this.wait = 5; }
        if (e.x <= this.x0) { e.x = this.x0; this.dir = 1; this.wait = 5; }
        if (Game.map.outdoor && Math.hypot(e.x + e.w / 2 - Game.player.x, e.y - Game.player.y) < 260 && (Game.time * 3 | 0) !== ((Game.time - dt) * 3 | 0)) Sfx.tone(70 + Math.random() * 20, 0.06, 'triangle', 0.03);
    },
};

// ============================================================
// TRENCH B'S RED STAKE and THE FIND STORE'S SEAL (kept in step with the story)
// ============================================================
function placesSync() {
    const m = Game.maps.ch1; if (!m) return;
    // the stake on Trench B's heap
    if (!m.stakeB) {
        const h = m.ents.find(e => e.id === 'ow_spoil');
        if (h) {
            const spr = SPR_L['survey stake'](16, 16);
            m.stakeB = World.addEnt(m, { x: Math.round(h.x + h.w * 0.55) - 8, y: Math.round(h.y + h.d * 0.3), w: 16, d: 16, id: 'trenchB_stake', label: 'Red Stake', spr, sortY: (h.sortY || h.y + h.d) + 1, say: ['System', 'A red stake leaning out of the top of the freshest heap.'] });
        }
    }
    if (m.stakeB) m.stakeB.gone = !!sflag('mag_key');
    // the seal on the find store's door
    const st = m.ents.find(e => e.id === 'fl_toolshed');
    if (st) {
        const state = sflag('store_resealed') ? 'resealed' : sflag('codex') || sflag('seal_clean') !== undefined ? (sflag('seal_clean') ? 'slit' : 'broken') : 'sealed';
        if (!m.seal) m.seal = World.addEnt(m, { x: Math.round(st.x + st.w / 2), y: st.y + st.d - 2, w: 0, d: 0, sortY: st.y + st.d + 1 });
        if (m.seal.state !== state) { m.seal.state = state; m.seal.spr = storeSealSprite(state); }
    }
}
STORY_SCRIPTS.trenchB_stake = 'c1a_sieve';
function storeSealSprite(state) {
    const [c, g] = mk(14, 16), A = pa(g), wax = state === 'resealed' ? '#3a2418' : '#b82818';
    if (state === 'broken') { A.r(5, 1, 4, 5, PAL.white[1]); A.r(5, 10, 4, 5, PAL.white[1]); A.px(4, 7, wax); A.px(9, 9, wax); A.px(6, 12, wax); }
    else {
        A.r(5, 1, 4, 14, state === 'slit' ? PAL.white[2] : PAL.white[1]); A.r(5, 1, 4, 1, PAL.white[0]);
        A.ell(7, 8, 4, 3, PAL.line); A.ell(7, 8, 3, 2, wax); A.px(6, 7, state === 'resealed' ? '#6a4a30' : '#f06048');
        if (state === 'slit') A.r(7, 1, 1, 14, PAL.dark[2]);
    }
    return { c, ox: -7, oy: -20 };
}
