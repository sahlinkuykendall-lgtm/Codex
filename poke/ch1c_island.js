// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-C, LIGHTHOUSE ISLAND (poke/ch1c_island.js)
// An ADDITION (not in the bible's map, asked for by the owner): a small island past
// the harbour mouth, sheltering the harbour. A boatman on the quay takes you over by
// day. On it: an old lighthouse (automated since 1998, its keeper's room inside),
// the keeper's roofless hut, a rain cistern, an osprey's nest, turtle tracks up the
// beach, white-eyed gulls, flotsam, and the fishing rocks: the FISHING minigame
// (the bible's "Fishing (the reef and harbor)" job, step 9, done early here). Sell
// the catch to the fish seller on the quay, or grill it on the island's driftwood fire.
// Nothing here touches the story: no named people, no flags the beats read.
// ============================================================

Object.assign(LOOKS, {
    c1c_boatman: { skinCol: SKINS[7], top: ['#e8e0c8', '#ccc4ac', '#aaa28a'], topKind: 'tank', legs: CLOTH.indigo, botKind: 'rolled', head: 'turban', headCol: ['#3a70c8', '#285496', '#1c3c70'], face: 'stubble', shoeKind: 'barefoot', shoe: '', wide: true },
});
const FISH_1C = {                                           // name: [price, difficulty 0..1, colours, far?]
    'Parrotfish': [20, 0.2, ['#58c8a0', '#2ea890', '#f070a0'], 0], 'Spangled emperor': [30, 0.35, ['#d8c8a0', '#b8a070', '#5a90e0'], 0],
    'Red snapper': [45, 0.5, ['#f08070', '#d04838', '#f4d0c0'], 1], 'Bluefin trevally': [55, 0.8, ['#8ab0d8', '#3a70c8', '#e0f0ff'], 1], 'Coral grouper': [70, 0.7, ['#e05040', '#a02828', '#5ab0f0'], 1],
};
for (const n in FISH_1C) ITEM_INFO[n] = { desc: n + ', caught off Lighthouse Island this morning, still smelling of the sea. The fish seller on the quay pays ' + FISH_1C[n][0] + ' pounds; grilled on driftwood, it\'s dinner.' };
const fishInBag = () => Object.keys(FISH_1C).filter(n => (Game.bag[n] || 0) > 0);

// ---- the island's things, and its door ----
(function () {
    const L0 = marsaLayout;
    marsaLayout = function () {
        const L = L0();
        L.things.push(['c1c_lighthouse', 74, 26, 2, 2], ['c1c_kruin', 76, 29, 2, 1], ['c1c_cistern', 72, 29, 1, 1], ['c1c_osprey', 77, 35, 1, 1], ['c1c_turtles', 73, 36, 2, 1],
            ['c1c_firepit', 72, 33, 1, 1], ['c1c_fishrocks', 78, 31, 1, 1], ['c1c_flotsam', 75, 38, 1, 1], ['c1c_gulls', 76, 25, 1, 1], ['c1c_islboat', 67, 32, 3, 1],
            ['c1c_boatman', 57, 29, 1, 1], ['c1c_boatman2', 71, 32, 1, 1]);
        L.places.push(['island', 'LIGHTHOUSE ISLAND', 74, 32, 4]);
        L.doors.push(['c1c_lighthouse', 0.5, 'INT_LIGHTHOUSE', 'The Lighthouse']);
        return L;
    };
})();
Object.assign(CAST, { c1c_boatman: 'c1c_boatman', c1c_boatman2: 'c1c_boatman' });
POKE_MAP_1C.objects.push(
    { id: 'c1c_lighthouse', label: 'The Lighthouse', model: 'lighthouse', say: null },
    { id: 'c1c_kruin', label: "The Keeper's Hut", model: 'ruined hut', say: ['System', 'The keeper\'s hut: four stone walls, a doorway, no roof, a fallen beam, and sand drifted into the corners. The last keeper lived here until 1998, when they put a machine in the lighthouse that doesn\'t need tea or company. Somebody has written on the wall in charcoal: MAHMOUD 1971–1998. THE LIGHT NEVER WENT OUT.'] },
    { id: 'c1c_cistern', label: 'Cistern', model: 'cistern' },
    { id: 'c1c_osprey', label: "Osprey's Nest", model: 'osprey nest', say: ['System', 'A pile of sticks the size of an armchair on top of a stack of rock, and in it an osprey, brown and white, glaring at you with yellow eyes. They nest on the Red Sea islands, on rocks, on wrecks, on the ground if they have to. This one has been nesting here longer than the lighthouse has been automatic. It does not like you. It doesn\'t like anybody.'] },
    { id: 'c1c_turtles', label: 'Turtle Tracks', model: 'turtle tracks', say: ['System', 'Two broad tracks in the sand, like a small tractor\'s, from the sea up the beach to a ring of white stones and back down again. A green turtle came up in the night to lay her eggs. The stones are the park rangers\', from down the coast: DO NOT DIG, in Arabic and English and, for some reason, Russian.'] },
    { id: 'c1c_firepit', label: 'Driftwood Fire', model: 'driftwood fire' },
    { id: 'c1c_fishrocks', label: 'Fishing Rocks', model: 'fishing rocks' },
    { id: 'c1c_flotsam', label: 'Flotsam', model: 'flotsam', say: ['System', 'A split wooden crate washed up on the beach, and spilling out of it, perhaps two hundred flip-flops, all blue, all for the left foot. Somewhere out there another island has the right ones.'] },
    { id: 'c1c_gulls', label: 'Gulls', model: 'gulls', say: ['System', 'White-eyed gulls, dark-headed, each with a thin white ring round its eye like a pair of reading glasses. They live nowhere in the world but the Red Sea. They look at you as if you owe them money, which, in Marsa Tarfa, is fair.'] },
    { id: 'c1c_islboat', label: "The Boatman's Boat", model: 'fishing boat', say: ['System', 'The boatman\'s little boat, tied to the jetty, the outboard tipped up out of the water. She\'s called Nour el-Bahr, Light of the Sea, in yellow on the bow, and she leaks a little, cheerfully.'] },
    { id: 'c1c_boatman', label: 'Boatman', model: 'person' }, { id: 'c1c_boatman2', label: 'Boatman', model: 'person' },
);

// ---- the boatman: to the island by day (twenty pounds, there and back) ----
const ISL = { jetty: [70.4, 31.6], quay: [56.6, 29.8] };
const boatDay = () => { const c = Story.s.clock; return c >= 6 * 60 && c < 18 * 60 + 30; };
function c1cFerry(to) {
    Game.fadeTo(() => {
        const [tx, ty] = to === 'island' ? ISL.jetty : ISL.quay, p = Game.player;
        p.x = tx * TILE; p.y = ty * TILE; p.dir = to === 'island' ? DIR.right : DIR.left;
        clockAdvance(10); if (Game.set.time === 5) Game.hour = storyHour();
        Toast.show(to === 'island' ? 'Lighthouse Island. The boatman ties up and gets his line out.' : 'Back on the quay.', 4);
    });
}
STORY_SCRIPTS.c1c_boatman = 'c1c_boatman';
scene('c1c_boatman', {
    speaker: 'Boatman',
    text: () => !boatDay() ? `The boatman is sitting on his upturned bucket, smoking, his boat tied up for the night. "In the dark? Past the reef?" He laughs. "I have one boat and one life. Come in the morning."`
        : sflag('c1c_ferry_paid') ? `"The island again? Get in. You've paid, you're family."`
        : `A boatman sitting on an upturned bucket beside a little blue boat, a cigarette in his teeth. "The island? The lighthouse? Ten minutes. Twenty pounds, there and back, and I'll wait for you." He jerks his chin at the rods in the boat. "I fish while I wait. The fish don't know what time it is."`,
    get choices() {
        if (!boatDay()) return [{ text: '"Tomorrow, then."' }];
        if (sflag('c1c_ferry_paid')) return [{ text: 'Go to Lighthouse Island. (10 minutes)', onSelect: () => c1cFerry('island') }, { text: 'Not now.' }];
        const c = [];
        if (money() >= 20) c.push({ text: 'Pay the twenty and go. (10 minutes)', onSelect: () => { storyPay(-20, 'The boat to the island'); sflag('c1c_ferry_paid', true); c1cFerry('island'); } });
        if (money() >= 10) c.push({ text: '[Haggling] "Ten. I\'ll bail."', onSelect: () => { storyPay(-10, 'The boat to the island (haggled)'); skillXP('haggling', 4); sflag('c1c_ferry_paid', true); c1cFerry('island'); } });
        c.push({ text: 'Not now.' });
        return c;
    },
});
STORY_SCRIPTS.c1c_boatman2 = 'c1c_boatman2';
scene('c1c_boatman2', {
    speaker: 'Boatman',
    text: () => `The boatman is sitting on the jetty with his feet over the water and a line out, a bucket beside him${sflag('c1c_bm_fish') ? '' : ' with one sad little fish in it'}. "Back already? Or are you fishing? The rocks on the far side, that's where the big ones are. The ospreys know. Watch where they dive."`,
    choices: [{ text: 'Back to the harbour. (10 minutes)', onSelect: () => c1cFerry('quay') }, { text: '"Not yet."' }],
});

// ---- water and food on the island ----
STORY_SCRIPTS.c1c_cistern = 'c1c_cistern';
scene('c1c_cistern', {
    speaker: 'System',
    text: `An old stone cistern, domed, with a wooden lid and a bucket on a rope. The British built it for the keepers, to catch what little rain falls out here: a handful of days a year. The water is dark and very cold and tastes of stone.`,
    choices: [{ text: 'Drink.', onSelect: () => { const r = refill(); drink(50, 'Cistern water, cold as a cellar'); if (r) Notice.show(r.trim()); } }, { text: 'Move on.' }],
});
STORY_SCRIPTS.c1c_firepit = 'c1c_firepit';
scene('c1c_firepit', {
    speaker: 'System',
    text: () => `A ring of blackened stones, a bit of iron grate, a pile of silver driftwood that somebody keeps topped up: fishermen, the boatman, the rangers. ` + (fishInBag().length ? `You have a fish. You have a fire. The arithmetic is simple.` : `Nothing to cook. The fishing rocks are on the far side of the island.`),
    get choices() {
        const f = fishInBag();
        return f.length ? [{ text: 'Grill your ' + f[0].toLowerCase() + ' on the driftwood. (20 minutes)', onSelect: () => { Game.bag[f[0]]--; if (!Game.bag[f[0]]) delete Game.bag[f[0]]; eat(80, f[0] + ', grilled on driftwood, eaten with your fingers'); clockAdvance(20); } }, { text: 'Not now.' }] : [{ text: 'Move on.' }];
    },
});

// ---- the fishing rocks ----
STORY_SCRIPTS.c1c_fishrocks = 'c1c_fishrocks';
scene('c1c_fishrocks', {
    speaker: 'System',
    text: `Flat black rocks on the seaward side of the island, the water going from turquoise to ink a rod's length out. An iron pipe is wedged in a crack for a rod holder, and there's a bucket of bait someone left, and fish scales dried silver on the stone. The boatman keeps a spare rod here, which he says you can borrow, "because you look like you need fish."\n\nCast near for the reef fish, far for the big ones.`,
    choices: [{ text: 'Fish. (minigame, about 10 minutes a cast)', onSelect: () => c1cFish() }, { text: 'Not now.' }],
});
function c1cFish() {
    playMinigame('fish', {}, r => {
        if (r.left) return;
        clockAdvance(10); if (Game.set.time === 5) Game.hour = storyHour();
        if (r.fish && FISH_1C[r.fish]) { pocket(r.fish); sflag('c1c_fish_n', (sflag('c1c_fish_n') || 0) + 1); }
    });
}
// the fish seller buys the catch
STORY_SCRIPTS.c1c_fishseller = () => fishInBag().length ? 'c1c_fishsell' : 'c1c_fishseller';
scene('c1c_fishsell', {
    speaker: 'Fish Seller',
    text: () => { const f = fishInBag(), tot = f.reduce((a, n) => a + FISH_1C[n][0] * Game.bag[n], 0); return `She looks into your bag and her eyebrows go up. "You caught these? Off the island?" She weighs them in her hands, one by one, with deep suspicion. "${f.map(n => (Game.bag[n] > 1 ? Game.bag[n] + ' ' : 'a ') + n.toLowerCase()).join(', ')}. ${tot} pounds, all of it, and I'm robbing myself."`; },
    get choices() { return [{ text: 'Sell the lot.', onSelect: () => { const f = fishInBag(); let tot = 0; for (const n of f) { tot += FISH_1C[n][0] * Game.bag[n]; delete Game.bag[n]; } storyPay(tot, 'Fish, sold on the quay'); } }, { text: 'Keep them.' }]; },
});

// ============================================================
// THE FISHING MINIGAME
// SPACE on the swinging power bar to cast (near: reef fish; far: the big ones); wait for
// the float to go under, SPACE to strike; then hold SPACE to keep the green band on the
// fish as it fights, until the line's in.  → { fish } · { fish: null } · { left }
// ============================================================
MINIS.fish = {
    title: 'FISHING', keys: 'SPACE: cast · strike    hold SPACE: reel (keep the green on the fish)    ESC: leave',
    start() { return { ph: 'cast', pow: 0, pd: 1, dist: 0, fly: 0, wait: 0, bite: 0, fish: null, zone: 0.3, zv: 0, fy: 0.5, ft: 0.5, fT: 0, prog: 0.4, msg: 'Cast: SPACE when the bar is where you want it.', fin: false }; },
    pickFish(dist) {
        const far = dist > 0.55, pool = Object.keys(FISH_1C).filter(n => !!FISH_1C[n][3] === far);
        if (Math.random() < 0.12) return 'junk';
        return pool[Math.floor(Math.random() * pool.length)];
    },
    update(S, dt, I, keys) {
        if (S.fin) return;
        if (S.ph === 'cast') { S.pow += S.pd * dt * 1.3; if (S.pow > 1) { S.pow = 1; S.pd = -1; } if (S.pow < 0) { S.pow = 0; S.pd = 1; } if (I.ok) { S.dist = S.pow; S.ph = 'fly'; S.fly = 0; Sfx.tone(520, 0.08, 'triangle', 0.05); } }
        else if (S.ph === 'fly') { S.fly += dt / 0.6; if (S.fly >= 1) { S.ph = 'wait'; S.wait = 2 + Math.random() * 4; S.msg = 'Wait for the float to go under…'; } }
        else if (S.ph === 'wait') {
            S.wait -= dt;
            if (I.ok) { S.wait = 2 + Math.random() * 3; S.msg = 'Too soon. Whatever it was, it\'s thinking about it again.'; Sfx.tone(200, 0.05, 'triangle', 0.03); }
            if (S.wait <= 0) { S.ph = 'bite'; S.fish = this.pickFish(S.dist); S.bite = S.fish === 'junk' ? 0.9 : 0.75 - FISH_1C[S.fish][1] * 0.25; S.msg = 'BITE! SPACE!'; Sfx.tone(880, 0.06, 'square', 0.05); }
        } else if (S.ph === 'bite') {
            S.bite -= dt;
            if (I.ok) { S.ph = 'reel'; S.msg = 'Hold SPACE to raise the green band, let go to drop it. Keep it on the fish.'; S.zone = 0.3; S.fy = 0.4; }
            else if (S.bite <= 0) { S.fin = true; Mini.finish({ fish: null }, 'The float bobs back up. The bait\'s gone, and so is whatever ate it.', 'IT GOT AWAY'); }
        } else if (S.ph === 'reel') {
            const diff = S.fish === 'junk' ? 0.05 : FISH_1C[S.fish][1], size = 0.3 - diff * 0.1;
            S.fT -= dt; if (S.fT <= 0) { S.ft = Math.random(); S.fT = 0.4 + Math.random() * (1.4 - diff); }
            S.fy += Math.sign(S.ft - S.fy) * Math.min(Math.abs(S.ft - S.fy), dt * (0.2 + diff * 0.7));
            S.zv += (keys.act ? 2.2 : -1.8) * dt; S.zv = Math.max(-1.1, Math.min(1.1, S.zv)); S.zone += S.zv * dt;
            if (S.zone < 0) { S.zone = 0; S.zv = 0; } if (S.zone > 1 - size) { S.zone = 1 - size; S.zv = 0; }
            const on = S.fy >= S.zone && S.fy <= S.zone + size;
            S.prog += (on ? 0.32 : -0.18 - diff * 0.08) * dt;
            if (S.prog >= 1) { S.fin = true; Sfx.get(); if (S.fish === 'junk') Mini.finish({ fish: null, junk: true }, 'Something heavy, fighting not at all. It comes up out of the water dripping: a blue flip-flop, left foot. You throw it back. It floats away towards the island\'s other two hundred.', 'A FLIP-FLOP'); else Mini.finish({ fish: S.fish }, 'In it comes, flapping and furious, all colours in the sun: ' + S.fish.toLowerCase() + '. The fish seller on the quay pays ' + FISH_1C[S.fish][0] + '. The driftwood fire costs nothing.', S.fish.toUpperCase() + '!'); }
            else if (S.prog <= 0) { S.fin = true; Sfx.tone(150, 0.2, 'square', 0.05); Mini.finish({ fish: null }, 'The line goes slack. You reel in a bare hook and a strand of weed.', 'IT GOT AWAY'); }
        }
    },
    draw(S, g, A, VW, VH) {
        const w = Math.min(VW - 30, 440), h = Math.min(VH - 70, 240), x0 = (VW - w) >> 1, y0 = 30, sea = y0 + 40;
        A.r(x0, y0, w, 40, '#9ed2f4'); A.r(x0, y0 + 30, w, 10, '#c4e6fa');
        A.r(x0, sea, w, h - 40, '#2a7ab8'); A.r(x0, sea, w, 3, '#6ab0e0');
        A.poly([[x0, sea + 60], [x0 + 90, sea + 70], [x0 + 120, y0 + h], [x0, y0 + h]], '#3a3e48'); A.poly([[x0, sea + 64], [x0 + 80, sea + 74], [x0 + 100, y0 + h], [x0, y0 + h]], '#2a2e36');   // the rocks you stand on
        for (let i = 0; i < 10; i++) A.hl(x0 + 130 + Math.floor(hash2(i, 4) * (w - 160)), sea + 12 + Math.floor(hash2(4, i) * (h - 70)), 6, '#4a9ad0');
        // the rod and the line
        const rx = x0 + 70, ry = sea + 66, tx = x0 + 150, ty = sea - 34;
        A.line(rx, ry, tx, ty, '#5c3418'); A.line(rx + 1, ry, tx + 1, ty, '#8e5e32');
        const fx = x0 + 160 + (S.ph === 'cast' ? 0 : S.dist * (w - 220)) * (S.ph === 'fly' ? S.fly : 1), fyy = sea + 30 + (S.ph === 'cast' ? 0 : S.dist * 50);
        if (S.ph !== 'cast') {
            const arc = S.ph === 'fly' ? Math.sin(S.fly * Math.PI) * 50 : 0, by = fyy - arc + (S.ph === 'bite' ? 4 + ((S.t * 12 | 0) % 2) * 2 : S.ph === 'wait' ? Math.round(Math.sin(S.t * 3)) : 0);
            A.line(tx, ty, fx, by, '#e8eaf0');
            A.r(fx - 2, by - 4, 4, 4, '#d04838'); A.r(fx - 2, by, 4, 2, '#ffffff');   // the float
            if (S.ph === 'bite') { A.ell(fx, by + 4, 7, 2, '#8ac8f0'); }
        }
        // the cast bar
        if (S.ph === 'cast') { const bx = x0 + 150, bw = w - 180, by = y0 + h - 20; A.r(bx - 1, by - 1, bw + 2, 10, '#1c1814'); A.r(bx, by, Math.round(bw * S.pow), 8, S.pow > 0.55 ? '#f0a030' : '#60c060'); A.vl(bx + Math.round(bw * 0.55), by - 3, 14, '#ffffff'); Txt.draw(g, 'NEAR: REEF FISH', bx, by - 14, { col: '#c8d0f0' }); Txt.draw(g, 'FAR: THE BIG ONES', bx + bw, by - 14, { col: '#c8d0f0', align: 'right' }); }
        // the fight
        if (S.ph === 'reel') {
            const bx = x0 + w - 44, by = y0 + 50, bh = h - 70, diff = S.fish === 'junk' ? 0.05 : FISH_1C[S.fish][1], size = 0.3 - diff * 0.1;
            A.r(bx - 2, by - 2, 24, bh + 4, '#1c1814'); A.r(bx, by, 20, bh, '#1a3a64');
            A.r(bx, by + Math.round(bh * (1 - S.zone - size)), 20, Math.round(bh * size), '#3a9a48'); A.hl(bx, by + Math.round(bh * (1 - S.zone - size)), 20, '#7ad888');
            const fyp = by + Math.round(bh * (1 - S.fy)) - 3, C = S.fish === 'junk' ? ['#3a70c8', '#285496', '#ffffff'] : FISH_1C[S.fish][2];
            A.ell(bx + 10, fyp + 3, 6, 3, C[1]); A.ell(bx + 9, fyp + 2, 4, 1, C[0]); A.poly([[bx + 15, fyp + 3], [bx + 19, fyp], [bx + 19, fyp + 6]], C[1]); A.px(bx + 6, fyp + 2, '#101010');
            A.r(bx - 14, by, 8, bh, '#1c1814'); A.r(bx - 13, by + Math.round(bh * (1 - S.prog)), 6, Math.round(bh * S.prog), '#f0c040');
        }
        Txt.draw(g, S.msg, VW >> 1, y0 + h + 6, { col: S.ph === 'bite' ? '#ffe890' : '#c8d0f0', align: 'center' });
    },
};

// ============================================================
// THE LIGHTHOUSE, INSIDE
// ============================================================
const FURNL = {
    stair() { const st = stage(40, 36, 60), { A } = st, x = st.x + 20, y = st.y - 56; A.r(x - 2, y, 4, 92, '#5a6068'); A.vl(x - 2, y, 92, '#86949e'); for (let k = 0; k < 11; k++) { const a = k * 0.9, yy = y + 86 - k * 8, ex = x + Math.cos(a) * 18; A.line(x, yy, ex, yy + Math.sin(a) * 4, '#3a3e48'); A.line(x, yy - 1, ex, yy - 1 + Math.sin(a) * 4, '#86949e'); } A.ell(x, y + 90, 20, 6, 'rgba(0,0,0,0.25)'); return fit(st, { solid: [4, 6, 32, 26] }); },
    tank() { const st = stage(26, 20, 26), { A } = st, x = st.x, y = st.y - 24; A.ell(x + 13, y + 6, 13, 5, '#c8ccd0'); A.r(x, y + 6, 26, 34, '#a8b0b8'); A.vl(x + 2, y + 6, 34, '#dfe6ea'); A.vl(x + 23, y + 6, 34, '#6a7280'); A.ell(x + 13, y + 40, 13, 5, '#6a7280'); A.r(x + 18, y + 30, 6, 3, '#c89020'); A.px(x + 23, y + 34, '#9ed2f4'); for (let j = 12; j < 38; j += 8) A.hl(x, y + j, 26, '#8a929c'); return fit(st, { solid: [0, 4, 26, 16] }); },
    radio() { const st = stage(30, 14, 20), { A } = st, x = st.x, y = st.y - 18; A.r(x, y, 30, 22, '#4a5048'); A.hl(x, y, 30, '#6a7068'); A.r(x + 3, y + 3, 14, 8, '#20242c'); A.r(x + 4, y + 4, 12, 6, '#3a3e30'); A.ell(x + 23, y + 7, 3, 3, '#c8ccd0'); A.ell(x + 23, y + 16, 3, 3, '#c8ccd0'); A.r(x + 4, y + 14, 12, 4, '#86949e'); A.line(x + 26, y, x + 30, y - 12, '#86949e'); return fit(st, { solid: [0, 2, 30, 12] }); },
    lens() { const st = stage(26, 18, 18), { A } = st, x = st.x, y = st.y - 14; A.r(x, y + 8, 26, 22, '#8e6a44'); A.hl(x, y + 8, 26, '#b8946a'); A.ell(x + 13, y + 8, 10, 9, '#bfe8f4'); for (let i = 3; i < 10; i += 3) A.ell(x + 13, y + 8, i, i, '#e8f8ff'); A.ell(x + 13, y + 8, 2, 2, '#ffffff'); return fit(st, { solid: [0, 4, 26, 14] }); },
};
ROOMS.INT_LIGHTHOUSE = {
    name: 'THE LIGHTHOUSE', tw: 9, th: 7, style: 'concrete',
    enter: ['System', 'The lighthouse, inside: one round room painted government green to the shoulder, an iron stair spiralling up through a hole in the ceiling, a desk, a water tank, a chair nobody has sat in since 1998. It smells of paint, salt and the machine upstairs, which hums to itself and turns the light all night for nobody in particular.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(30, 10, 22, 30, '#f4f0e4'); A.r(31, 11, 20, 6, '#d04838'); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) A.px(33 + i * 5, 20 + j * 5, '#20242c');   // a calendar
        wall(28, 26, null, { label: 'Calendar', say: ['System', 'A calendar from the Egyptian Ports and Lighthouses Administration, still on December 1998. Someone has drawn a circle round the 31st, and written next to it, in a careful hand: LAST NIGHT. GOD KEEP THE LIGHT.'] });
        A.r(70, 14, 16, 20, '#c89020'); A.r(72, 16, 12, 16, '#8a7a60'); A.ell(78, 22, 3, 3, '#e8c8a0'); A.r(75, 25, 6, 6, '#2a3a5a');   // a photograph
        wall(68, 20, null, { label: 'A Photograph', say: ['System', 'A photograph in a frame gone green with the salt: a keeper in a blue uniform and a white cap, standing proudly at the foot of the lighthouse with a little boy on his shoulders. On the back, in pencil: Mahmoud and Ahmed, 1979.'] });
        put((pw >> 1) - 20, W + 2, FURNL.stair(), null, { label: 'The Stair', script: 'c1c_lh_stair' });
        put(16, W + 40, FURN.desk(48, false), null, { label: 'The Logbook', say: ['System', 'The keepers\' logbook, a ledger thick as a brick, on the desk where they left it. 1921, in English: "Light lit at sunset. Wind NNW. Steamer Mooltan passed southbound 22.10." 1956, in Arabic, the first Egyptian keeper. 1998, the last line, the same careful hand as the calendar: "Light lit. Wind N. Sea calm. Nothing to report. Goodbye, my friend." The machine upstairs doesn\'t keep a log.'] });
        put(pw - 50, W + 6, FURNL.tank(), null, { label: 'Water Tank', script: 'c1c_lh_tank' });
        put(pw - 54, W + 52, FURNL.radio(), null, { label: 'Old Radio', say: ['System', 'A military-green radio set, dials and a microphone on a curly cord. It was how the keepers talked to the harbour. You turn a knob. A light comes on, astonishingly, and the speaker gives you the sea: hiss, and, far off, a fishing boat captain telling someone exactly what he thinks of their mother.'] });
        put(20, ph - 62, FURNL.lens(), null, { label: 'A Spare Lens', say: ['System', 'A spare lens for the light in a wooden crate packed with straw: a beehive of glass rings, heavy as a child, made in Paris in 1919. It throws rainbows on the green wall when the door\'s open. You put the lid back very carefully.'] });
        put((pw >> 1) + 40, W + 54, FURN.chair(true), null, { label: 'Chair', say: ['System', 'The keeper\'s chair, the seat worn to the shape of one man over twenty-seven years. You don\'t sit in it.'] });
    },
};
scene('c1c_lh_tank', { speaker: 'System', text: 'The keepers\' water tank, galvanised steel, filled from the cistern outside by the boatman once a month for the machine\'s cooling and for whoever comes. A brass tap, a tin cup.', choices: [{ text: 'Drink.', onSelect: () => { const r = refill(); drink(45, 'Water from the lighthouse tank'); if (r) Notice.show(r.trim()); } }, { text: 'Leave it.' }] });
scene('c1c_lh_stair', {
    speaker: 'System',
    text: `An iron stair corkscrewing up through the ceiling, ninety-one steps to the lamp. Somebody has painted every tenth step white, so you can count them in the dark.`,
    choices: [{ text: 'Climb to the lamp. (10 minutes)', onSelect: () => { if (!sflag('c1c_lh_top')) { sflag('c1c_lh_top', true); skillXP('climbing', 25, 'the lighthouse'); } clockAdvance(10); if (Game.set.time === 5) Game.hour = storyHour(); playMinigame('lamproom', {}, r => { if (!r.left) startDialogue('c1c_lh_top'); }); } }, { text: 'Not now.' }],
});
scene('c1c_lh_top', {
    speaker: 'System',
    text: () => Game.light().dark > 0.5
        ? `The light goes round behind you like a slow white engine, and every eleven seconds its beam passes over the town, the harbour, Bassem's villa with every light on, and away over the black water to where a ship sits at anchor with her deck lights lit, waiting for something.\n\nThe wind sings in the rail. Then down the ninety-one steps, counting the white ones.`
        : `Too hot to breathe in the lamp room, the wind singing in the rail outside. An osprey goes past below you with a fish in its claws, and lands on its nest, and glares up at you as if you'd been looking at its fish.\n\nThen down the ninety-one steps, counting the white ones.`,
    choices: [{ text: 'Climb back down.' }],
});

// ---- the island's sprites ----
const LH = ['#ffffff', '#ecece6', '#c8ccd0', '#8a929c'];
SPR_L['lighthouse'] = (w, d) => {                                  // a white stone tower with red bands, a gallery, the lamp room, and the keeper's room at its foot
    const st = stage(w, d, 132), { A } = st, x = st.x, by = st.y + d, cx = x + (w >> 1);
    A.r(x + 4, by - 34, w - 8, 34, LH[1]); A.vl(x + 4, by - 34, 34, LH[0]); A.vl(x + w - 5, by - 34, 34, LH[3]); A.r(x + 2, by - 38, w - 4, 5, LH[2]); A.hl(x + 2, by - 38, w - 4, LH[0]);   // the keeper's room
    door(A, cx - 8, by - 26, 16, 24, ['#3a70c8', '#285496', '#1c3c70', '#142a50'], WASH);
    win(A, x + 10, by - 26, 8, 10, { frame: WASH }); win(A, x + w - 18, by - 26, 8, 10, { frame: WASH });
    const top = by - 150, bot = by - 38;
    for (let yy = top; yy < bot; yy++) {                           // the tower, tapering as it goes up
        const k = (yy - top) / (bot - top), hw = Math.round(10 + k * 6), band = Math.floor((yy - top) / 18) % 2 === 1;
        A.hl(cx - hw, yy, hw * 2, band ? '#d04838' : LH[1]); A.px(cx - hw, yy, band ? '#f07860' : LH[0]); A.px(cx - hw + 1, yy, band ? '#f07860' : LH[0]); A.px(cx + hw - 1, yy, band ? '#802018' : LH[3]); A.px(cx + hw - 2, yy, band ? '#a02828' : LH[2]);
    }
    for (const yy of [top + 40, top + 76]) { A.r(cx - 2, yy, 4, 6, '#2a3a5a'); A.hl(cx - 2, yy, 4, LH[3]); }   // little windows up the stair
    A.r(cx - 16, top - 2, 32, 4, '#3a3e48'); for (let i = cx - 15; i < cx + 16; i += 3) A.vl(i, top - 8, 6, '#3a3e48'); A.hl(cx - 16, top - 8, 32, '#5a6068');   // the gallery and its rail
    A.r(cx - 9, top - 22, 18, 14, '#20242c'); A.r(cx - 8, top - 21, 16, 12, '#fff4c0'); A.r(cx - 3, top - 19, 6, 8, '#ffffff'); A.vl(cx - 3, top - 21, 12, '#3a3e48'); A.vl(cx + 3, top - 21, 12, '#3a3e48');   // the lamp room
    A.poly([[cx - 10, top - 22], [cx, top - 32], [cx + 10, top - 22]], '#d04838'); A.vl(cx, top - 38, 6, '#3a3e48'); A.hl(cx - 3, top - 36, 7, '#3a3e48');   // the cap, the vane
    return fit(st, { light: { x: 0, y: -165, r: 40, far: 120, c: '#fff8d0' } });
};
SPR_L['ruined hut'] = (w, d) => {                                  // the keeper's hut: stone walls, no roof, sand drifted in
    const S = ['#e8dcc4', '#d4c4a4', '#b8a684', '#948262'], st = propStage(w, d, w, 40), { A } = st, x = st.x, y = st.y;
    A.r(x + 2, y + 8, w - 4, 26, '#e8d4a4'); A.ell(x + 12, y + 30, 10, 4, '#f0dcb0');                                         // the sandy floor inside
    A.r(x, y + 4, w, 6, S[1]); A.hl(x, y + 4, w, S[0]); A.r(x, y + 4, 5, 32, S[1]); A.r(x + w - 5, y + 4, 5, 32, S[2]);        // the back and side walls
    A.r(x, y + 28, 22, 10, S[1]); A.hl(x, y + 28, 22, S[0]); A.r(x + 36, y + 30, w - 36, 8, S[2]); A.hl(x + 36, y + 30, w - 36, S[0]);   // the front wall, broken, the doorway
    for (let i = 0; i < w; i += 9) A.vl(x + i, y + 4, 6, S[3]);
    A.line(x + 8, y + 12, x + 40, y + 24, '#7a5a3a'); A.line(x + 8, y + 13, x + 40, y + 25, '#5a3e24');                     // the fallen beam
    return propFit(st, w, d, { solid: [0, d - 12, w, 10] });
};
SPR_L['cistern'] = (w, d) => {
    const S = ['#e8dcc4', '#d4c4a4', '#b8a684', '#948262'], st = propStage(w, d, 30, 30), { A } = st, x = st.x, y = st.y;
    A.ell(x + 15, y + 18, 14, 10, S[2]); A.ell(x + 15, y + 15, 13, 9, S[1]); A.ell(x + 12, y + 12, 6, 4, S[0]); A.r(x + 9, y + 10, 12, 4, '#8e6a44'); A.hl(x + 9, y + 10, 12, '#b8946a');
    A.line(x + 24, y + 6, x + 24, y + 18, '#5a4a3a'); A.r(x + 21, y + 18, 7, 6, '#86949e'); A.hl(x + 21, y + 18, 7, '#c8ccd0');   // the bucket on its rope
    return propFit(st, w, d, { solid: [(w - 26) / 2, d - 14, 26, 12] });
};
SPR_L['osprey nest'] = () => {                                     // a low rock, a nest of sticks as wide as an armchair, and the osprey in it
    const frames = [0, 1].map(f => { const st = propStage(32, 32, 40, 34), { A } = st, x = st.x, y = st.y;
        A.ell(x + 20, y + 28, 19, 6, '#4a4038'); A.ell(x + 18, y + 25, 16, 5, '#6a6058'); A.hl(x + 8, y + 22, 14, '#8a8076');                       // the rock
        A.ell(x + 20, y + 18, 17, 6, '#5a3e24'); A.ell(x + 20, y + 17, 15, 4, '#8a6a42');
        for (let i = 0; i < 12; i++) A.line(x + 3 + i * 3, y + 14 + (i % 3), x + 7 + i * 3, y + 21 - (i % 2), i % 2 ? '#5a3e24' : '#a8885a');            // sticks poking out
        A.ell(x + 21, y + 13, 7, 4, '#6a4a2a'); A.ell(x + 19, y + 12, 5, 3, '#8a6440');                                                                 // the osprey: brown back and wings
        A.ell(x + 14 - f, y + 9, 4, 3, '#f8f8f4'); A.hl(x + 11 - f, y + 9, 6, '#3a2a1a'); A.px(x + 13 - f, y + 9, '#f0c040'); A.r(x + 9 - f, y + 9, 2, 1, '#20242c');   // the white head, the dark mask, the eye, the hooked beak
        A.ell(x + 16, y + 13, 3, 2, '#f8f8f4');                                                                                                          // the white breast
        return propFit(st, 32, 32, { solid: [2, 22, 28, 8] }); });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 0.5, ox: frames[0].ox, oy: frames[0].oy, solid: frames[0].solid };
};
SPR_L['turtle tracks'] = (w, d) => {
    const st = stage(w, d, 0), { A } = st, x = st.x, y = st.y;
    for (let i = 0; i < w - 18; i += 4) { A.r(x + i, y + 8 + Math.round(Math.sin(i * 0.2) * 2), 2, 3, '#d8c08a'); A.r(x + i, y + 18 + Math.round(Math.sin(i * 0.2) * 2), 2, 3, '#d8c08a'); }
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; A.ell(x + w - 10 + Math.round(Math.cos(a) * 8), y + 14 + Math.round(Math.sin(a) * 6), 2, 2, '#ffffff'); }
    A.ell(x + w - 10, y + 14, 4, 3, '#e0c890');
    return Object.assign(fit(st), { flat: true });
};
SPR_L['driftwood fire'] = (w, d) => {
    const frames = [0, 1].map(f => { const st = propStage(w, d, 30, 24), { A } = st, x = st.x, y = st.y;
        for (let k = 0; k < 9; k++) { const a = k * Math.PI * 2 / 9; A.ell(x + 15 + Math.round(Math.cos(a) * 11), y + 16 + Math.round(Math.sin(a) * 6), 3, 2, '#6a6058'); }
        A.ell(x + 15, y + 16, 8, 4, '#2a2420'); A.line(x + 8, y + 18, x + 22, y + 13, '#c8c0b0'); A.line(x + 9, y + 13, x + 21, y + 19, '#a8a090');
        A.r(x + 10, y + 13 - f, 3, 3, '#f09030'); A.r(x + 16, y + 12 + f, 3, 3, '#f0c040'); A.px(x + 13, y + 10 - f, '#ffe080');
        A.r(x + 6, y + 9, 18, 2, '#3a3e48'); for (let i = 7; i < 24; i += 3) A.vl(x + i, y + 9, 2, '#5a6068');   // the grate
        return propFit(st, w, d, { solid: [4, d - 12, w - 8, 10], light: { x: 0, y: -8, r: 34, c: '#ffb060' } }); });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 3, ox: frames[0].ox, oy: frames[0].oy, solid: frames[0].solid, light: frames[0].light };
};
SPR_L['fishing rocks'] = (w, d) => {
    const st = propStage(w, d, 34, 26), { A } = st, x = st.x, y = st.y;
    A.ell(x + 14, y + 18, 14, 7, '#2a2e36'); A.ell(x + 12, y + 15, 10, 5, '#3a3e48'); A.ell(x + 26, y + 20, 7, 5, '#3a3e48'); A.hl(x + 6, y + 12, 10, '#5a6068');
    A.r(x + 18, y + 2, 2, 14, '#86949e'); A.line(x + 19, y + 2, x + 32, y - 0, '#8e5e32');                                    // the rod in its pipe
    A.r(x + 4, y + 14, 7, 7, '#d04838'); A.hl(x + 4, y + 14, 7, '#f07860');                                                    // the bait bucket
    for (let i = 0; i < 5; i++) A.px(x + 12 + i * 2, y + 17 + (i % 2), '#e8eaf0');
    return propFit(st, w, d, { solid: [2, d - 12, w - 4, 10] });
};
SPR_L['flotsam'] = (w, d) => {
    const st = propStage(w, d, 34, 22), { A } = st, x = st.x, y = st.y;
    A.r(x + 4, y + 6, 18, 12, '#a8845c'); A.hl(x + 4, y + 6, 18, '#c8a070'); A.vl(x + 13, y + 6, 12, '#7a5a3a'); A.line(x + 22, y + 6, x + 28, y + 2, '#a8845c');   // the split crate
    for (let i = 0; i < 7; i++) { const fx = x + 2 + Math.floor(hash2(i, 2) * 28), fy = y + 12 + Math.floor(hash2(2, i) * 8); A.ell(fx, fy, 3, 2, '#3a70c8'); A.px(fx, fy - 1, '#ffffff'); }
    return propFit(st, w, d, { solid: [2, d - 10, w - 4, 8] });
};
SPR_L['gulls'] = () => {
    const frames = [0, 1].map(f => { const st = propStage(32, 32, 34, 18), { A } = st, x = st.x, y = st.y;
        for (const [gx, gy, k] of [[4, 8, 0], [16, 4, 1], [24, 10, 0]]) { const up = (k + f) % 2; A.ell(x + gx + 3, y + gy + 4, 4, 3, '#f4f4f0'); A.r(x + gx, y + gy + 2, 3, 3, '#3a3e48'); A.px(x + gx + 1, y + gy + 3, '#ffffff'); A.px(x + gx - 1, y + gy + 3, '#d04838'); A.hl(x + gx + 2, y + gy + 2 - up, 6, '#86949e'); A.vl(x + gx + 3, y + gy + 7, 2, '#f0c040'); }
        return propFit(st, 32, 32, { noShadow: true }); });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 1.2, ox: frames[0].ox, oy: frames[0].oy };
};

// ---- the audit: the island is only reached by boat, so it floods from the jetty too ----
AREAS.fixer.auditSeeds = () => [[ISL.jetty[0] * TILE, ISL.jetty[1] * TILE]];
NEEDS_WHERE.fixer += ' On Lighthouse Island: the cistern, the lighthouse\'s water tank, and anything you catch, grilled on the driftwood fire.';

// ============================================================
// THE BEAM: the light turns once every eleven seconds, two beams, sweeping the island,
// the sea and the town, brighter the darker it is; the lamp flares when it faces you
// ============================================================
const Beam = {
    lh: null, map: null,
    lamp() { const m = Game.maps.ch1; if (this.map !== m) { this.map = m; this.lh = m.ents.find(e => e.id === 'c1c_lighthouse'); } return this.lh && [this.lh.x + 32, this.lh.y - 101]; },
    draw(g, cx, cy) {
        const m = Game.maps.ch1; if (Game.map !== m) return;
        const dark = Game.light().dark; if (dark < 0.12) return;
        const L = this.lamp(); if (!L) return;
        const lx = L[0] - cx, ly = L[1] - cy, VW = Game.VW, VH = Game.VH, R = 15 * TILE;
        if (lx < -R || lx > VW + R || ly < -R * 0.6 || ly > VH + R * 0.6) return;
        const A = pa(g), a = Game.time * Math.PI * 2 / 11, rnd = q => [Math.round(q[0]), Math.round(q[1])];
        g.globalCompositeOperation = 'lighter';
        for (const s of [0, Math.PI]) {
            const b = a + s;
            for (const [len, wd, al] of [[R, 0.1, 0.07], [R * 0.82, 0.065, 0.08], [R * 0.6, 0.035, 0.1]]) {
                g.globalAlpha = al * dark;
                A.poly([[lx, ly], [lx + Math.cos(b - wd) * len, ly + Math.sin(b - wd) * len * 0.55], [lx + Math.cos(b + wd) * len, ly + Math.sin(b + wd) * len * 0.55]].map(rnd), '#fff4c8');
            }
        }
        const face = Math.max(Math.sin(a), Math.sin(a + Math.PI));             // swinging round towards you
        if (face > 0.85) { const k = (face - 0.85) / 0.15; g.globalAlpha = 0.5 * k * dark; A.ell(Math.round(lx), Math.round(ly), Math.round(10 + 14 * k), Math.round(8 + 10 * k), '#fff8d8'); g.globalAlpha = 0.9 * k; A.ell(Math.round(lx), Math.round(ly), 4, 3, '#ffffff'); }
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    },
};

// ============================================================
// THE LAMP ROOM: a 360° look out from the top of the lighthouse, built from the real map.
// The ground is the map's own tiles, projected out to the horizon from the lamp's height;
// every building, boat, palm and person stands where it really is, drawn from its own
// sprite at its true bearing, smaller the farther it is (distance squeezed a little past
// the island, so the town isn't a smudge). Lit by the hour's light, lamps and windows at
// night. The view turns by itself; ◄► to look round yourself.
// ============================================================
const PANO_COL = { 0: [232, 204, 144], 1: [216, 184, 120], 2: [168, 140, 104], 3: [60, 140, 200], 4: [200, 170, 120], 5: [212, 196, 164], 6: [150, 130, 110], 7: [196, 180, 144], 8: [224, 196, 140], 9: [120, 160, 80], 10: [108, 108, 112], 11: [42, 122, 184], 12: [58, 168, 200], 13: [242, 222, 170], 14: [200, 196, 188] };
const panoEff = d => d < 8 ? d : 8 + (d - 8) * 0.5, panoInv = e => e < 8 ? e : 8 + (e - 8) * 2;
function panoBuild(VH) {
    const m = Game.maps.ch1, L = m.camp, Wp = 1920, Hp = VH, f = Wp / (Math.PI * 2), hz = Math.round(Hp * 0.3), h = 9;
    const lh = m.ents.find(e => e.id === 'c1c_lighthouse'), ox = (lh.x + 32) / TILE, oy = (lh.y + 48) / TILE;
    const [c, g] = mk(Wp, Hp), A = pa(g); g.imageSmoothingEnabled = false;
    // the sky, and the ground out to the horizon (the map's tiles, a little haze with distance)
    const img = g.createImageData(Wp, Hp), D = img.data, haze = [206, 224, 238], SKY = [[120, 184, 232], [150, 200, 238], [184, 218, 244], [212, 232, 248]];
    for (let x = 0; x < Wp; x++) {
        const th = x / f, cs = Math.cos(th), sn = Math.sin(th);
        for (let y = 0; y < Hp; y++) {
            let col;
            if (y <= hz) col = SKY[y < hz - 60 ? 0 : y < hz - 26 ? 1 : y < hz - 9 ? 2 : 3];
            else {
                const d = panoInv(h / Math.tan((y - hz) / f)), tx = ox + cs * d, ty = oy + sn * d, ix = Math.floor(tx), iy = Math.floor(ty), t = L.get(ix, iy);
                col = (PANO_COL[t] || PANO_COL[0]).slice();
                const v = hash2(ix, iy);
                if (t === 11 || t === 12) { if (d < 14 && hash2(Math.floor(tx * 1.5), Math.floor(ty * 4)) > 0.965) col = [96, 168, 216]; }   // (a few waves close in; none farther out, where they'd only shimmer)
                else if (t !== 10 && t !== 14) { const k = (v - 0.5) * 14; col = col.map(q => q + k); }
                const hk = d < 22 ? 0 : d < 45 ? 0.12 : d < 85 ? 0.26 : d < 150 ? 0.42 : 0.58;
                if (hk) { const hz2 = t === 11 || t === 12 ? haze : [226, 208, 182]; col = col.map((q, i) => q + (hz2[i] - q) * hk); }   // (the sea fades to sky, the desert to dust)
            }
            const o = (y * Wp + x) * 4; D[o] = col[0]; D[o + 1] = col[1]; D[o + 2] = col[2]; D[o + 3] = 255;
        }
    }
    g.putImageData(img, 0, 0);
    // the mountains, wherever the land goes on past the horizon
    const ridge = new Int16Array(Wp);
    for (let x = 0; x < Wp; x++) {
        const th = x / f, t = L.get(Math.floor(ox + Math.cos(th) * 160), Math.floor(oy + Math.sin(th) * 160));
        if (t === 11 || t === 12) continue;
        const r = Math.round(8 + Math.abs(Math.sin(x * 0.011) * 14 + Math.sin(x * 0.037) * 6 + Math.sin(x * 0.13) * 2)); ridge[x] = r;
        A.r(x, hz - r, 1, r, '#b4a4ac'); A.px(x, hz - r, '#d4c8cc'); A.r(x, hz - Math.round(r * 0.45), 1, Math.round(r * 0.45), '#c4b6b8');
    }
    // a cargo ship on the horizon, waiting (ESE)
    const sx0 = Math.round(0.35 * f); A.r(sx0, hz - 3, 22, 3, '#4a4e58'); A.r(sx0 + 15, hz - 8, 5, 5, '#5a6068'); A.r(sx0 + 3, hz - 5, 10, 2, '#6a7078');
    // everything standing on the map, far to near
    const list = [];
    for (const e of m.ents) {
        if (e.gone || e === lh) continue;
        let img, fx, fy, offx, offy;
        if (e.person) { img = e.person.sheet.frames[0][0]; fx = e.x; fy = e.y; offx = 16; offy = 30; }
        else if (e.spr && e.spr.c && !e.spr.flat) { const sp = e.spr; img = sp.frames ? sp.frames[0] : sp.c; if (e.w) { fx = e.x + e.w / 2; fy = e.y + e.d; offx = e.w / 2 - sp.ox; offy = e.d - sp.oy; } else { fx = e.x; fy = e.y; offx = -sp.ox; offy = -sp.oy; } }
        else continue;
        const dx = fx / TILE - ox, dy = fy / TILE - oy, d = Math.hypot(dx, dy); if (d < 2.2) continue;
        list.push({ img, d, th: (Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2), offx, offy, e });
    }
    list.sort((a, b) => b.d - a.d);
    for (const q of list) {
        const e = panoEff(q.d), sc = f / (TILE * e), sx = q.th * f, sy = hz + Math.atan(h / e) * f, w = q.img.width * sc, hh = q.img.height * sc;
        if (w < 1 || hh < 1) continue;
        for (const k of [0, -Wp, Wp]) { const x = sx + k - q.offx * sc; if (x > -w && x < Wp) g.drawImage(q.img, Math.round(x), Math.round(sy - q.offy * sc), Math.max(1, Math.round(w)), Math.max(1, Math.round(hh))); }
        q.sx = sx; q.sy = sy; q.sc = sc;
    }
    // the hour's light over all of it; then, after dark, the stars, the lamps and the windows
    const LT = Game.light();
    g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgb(' + LT.c.join(',') + ')'; g.fillRect(0, 0, Wp, Hp); g.globalCompositeOperation = 'source-over';
    if (LT.dark > 0.4) {
        for (let i = 0; i < 260; i++) { const x = Math.floor(hash2(i, 71) * Wp), y = Math.floor(hash2(71, i) * (hz - 12)); if (y < hz - ridge[x] - 2) A.px(x, y, i % 5 ? '#c8d0f0' : '#ffffff'); }
        g.globalCompositeOperation = 'lighter';
        const dot = (x, y, r, col, glow) => { for (const k of [0, -Wp, Wp]) { if (glow) { g.globalAlpha = 0.18; A.ell(Math.round(x + k), Math.round(y), r + 2, r + 1, col); g.globalAlpha = 1; } A.r(Math.round(x + k), Math.round(y), r, r, col); } };
        for (const [tx, ty] of L.lamps) { const dx = tx + 0.5 - ox, dy = ty + 0.5 - oy, d = Math.hypot(dx, dy), e = panoEff(d), sc = f / (TILE * e); dot(((Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2)) * f, hz + Math.atan(h / e) * f - 34 * sc, 2, '#fff0b0', true); }
        for (const q of list) {
            if (q.sc === undefined) continue; const id = q.e.id || '';
            if (/house|flat|cafe|mosque|diveshop|hotel|truckcafe|coastguard|villa$/.test(id)) {   // a lit window or two in the front wall
                const n = id === 'c1c_villa' ? 5 : id === 'c1c_hotel' ? 3 : 1 + (hash2(q.sx | 0, 3) > 0.5 ? 1 : 0), bw = q.img.width * q.sc;
                for (let k = 0; k < n; k++) dot(q.sx - bw * 0.25 + (bw * 0.5) * (n > 1 ? k / (n - 1) : 0.5), q.sy - Math.max(3, 14 * q.sc), Math.max(1, Math.round(2 * q.sc)), '#ffc060');
            }
            if (/dhow|patrol|diveboat/.test(id)) dot(q.sx, q.sy - 26 * q.sc, 1, '#ffffff');
        }
        for (let k = 0; k < 3; k++) dot(sx0 + 3 + k * 7, hz - 5, 1, '#fff8d0');                                    // the ship's deck lights
        g.globalCompositeOperation = 'source-over';
    }
    // the places, for labels
    const labels = L.places.filter(P => P[0] !== 'island').map(P => { const dx = P[2] - ox, dy = P[3] - oy, d = Math.hypot(dx, dy), e = panoEff(d); return { name: P[1], x: ((Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2)) * f, y: hz + Math.atan(h / e) * f }; });
    return { c, f, hz, Wp, labels, dark: LT.dark };
}
MINIS.lamproom = {
    title: 'THE LAMP ROOM', keys: '◄► look round    SPACE / ESC: climb down',
    start() { return { P: panoBuild(Game.VH), ang: Math.PI, turned: 0, hand: 0, fin: false }; },   // (facing west first: the town)
    update(S, dt, I, keys) {
        if (S.fin) return;
        const man = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
        let v = Math.PI * 2 / 34; if (man) { v = man * 1.1; S.hand = 2; } else if (S.hand > 0) { S.hand -= dt; v = 0; }
        S.ang = (S.ang + v * dt + Math.PI * 4) % (Math.PI * 2); S.turned += Math.abs(v * dt);
        if (I.ok || S.turned >= Math.PI * 2) { S.fin = true; Mini.finish({ ok: true }, S.turned >= Math.PI * 2 ? 'All the way round: the town, the mountains, the fort, the open sea, the villa, the harbour, and the town again. The machine behind you clicks and hums.' : 'You take one last look.', '360°'); }
    },
    draw(S, g, A, VW, VH) {
        const P = S.P, x0 = Math.round(S.ang * P.f - VW / 2);
        const sx = ((x0 % P.Wp) + P.Wp) % P.Wp, w1 = Math.min(VW, P.Wp - sx);
        g.drawImage(P.c, sx, 0, w1, VH, 0, 0, w1, VH); if (w1 < VW) g.drawImage(P.c, 0, 0, VW - w1, VH, w1, 0, VW - w1, VH);
        // the beam, turning with you, out over the water (after dark)
        if (P.dark > 0.4) { g.globalCompositeOperation = 'lighter'; for (const [wd, al] of [[110, 0.07], [60, 0.09], [26, 0.12]]) { g.globalAlpha = al; A.poly([[VW / 2 - wd * 2, VH], [VW / 2 + wd * 2, VH], [VW / 2 + wd * 0.12, P.hz + 2], [VW / 2 - wd * 0.12, P.hz + 2]].map(q => [Math.round(q[0]), Math.round(q[1])]), '#fff4c8'); } g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
        // the names of the places as they come round, stacked so they don't overlap
        const vis = []; for (const Lb of P.labels) for (const k of [-P.Wp, 0, P.Wp]) { const x = Math.round(Lb.x + k - x0); if (x > -80 && x < VW + 80) vis.push({ Lb, x, w: Txt.width(Lb.name) }); }
        vis.sort((a, b) => a.x - b.x); const rows = [];
        for (const v of vis) { let r = 0; while (rows[r] !== undefined && rows[r] > v.x - v.w / 2 - 6) r++; rows[r] = v.x + v.w / 2; const ty = P.hz - 22 - r * 13;
            A.vl(v.x, ty + 10, Math.max(2, Math.round(v.Lb.y - ty - 10)), 'rgba(255,255,255,0.5)');
            Txt.draw(g, v.Lb.name, v.x, ty, { col: '#ffe890', shadow: '#101838', align: 'center' }); }
        // the lamp room's glass and its iron frame, turning past; the gallery rail in front
        for (let k = 0; k < 6; k++) { const x = ((Math.round(k * P.Wp / 6 - x0) % P.Wp) + P.Wp) % P.Wp; if (x < VW + 4) { A.r(x - 3, 0, 6, VH, '#20242c'); A.vl(x - 2, 0, VH, '#4a5058'); } }
        A.r(0, 0, VW, 6, '#20242c');
        const ry = VH - 46; A.r(0, ry, VW, 4, '#2a2e36'); A.hl(0, ry, VW, '#5a6068'); for (let x = ((-x0 % 12) + 12) % 12; x < VW; x += 12) A.r(x, ry + 4, 2, 40, '#2a2e36');
        A.r(0, VH - 8, VW, 8, '#20242c');
        // the compass point you're facing
        const dirs = ['EAST', 'SOUTH-EAST', 'SOUTH', 'SOUTH-WEST', 'WEST', 'NORTH-WEST', 'NORTH', 'NORTH-EAST'], di = Math.round(S.ang / (Math.PI / 4)) % 8;
        Txt.draw(g, dirs[di], VW - 10, 10, { col: '#ffffff', shadow: '#101838', align: 'right' });
    },
};
(function () {
    const A = AREAS.fixer, _over = A.overlay;
    A.overlay = function (g, cx, cy) { if (_over) _over.call(this, g, cx, cy); Beam.draw(g, cx, cy); };
    const _sync = A.sync; A.sync = function () { _sync.call(this); Beam.map = null; };
})();
