// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MARSA TARFA'S ROOMS (poke/ch1c_rooms.js)
// Chapter 1-C, step 11 (poke/FIXER_TODO.md §11): every building you can see has an inside,
// unless the story keeps you out (the fuel store stays locked; the villa only by the story).
//   the café · the mosque (and the minaret stair) · the kiosk · the coast guard post
//   the truck stop café · the fort's courtyard · the fish market · thirteen houses
// Also: sleeping and waiting on your mattress at the flat, the phone (calls to Zaki and Rana once
// you've met them) and a few messages through the day.
// Everyone in here is a nameless local with a look of their own (the bible's rule for Ch1-C).
// ============================================================

(function () {
    const L0 = marsaLayout;
    marsaLayout = function () {
        const L = L0();
        L.doors.push(['c1c_cafe', 0.84, 'INT_CAFE1C', 'The Café'], ['c1c_mosque', 0.43, 'INT_MOSQUE1C', 'The Mosque'], ['c1c_kiosk', 0.84, 'INT_KIOSK1C', 'The Kiosk'],
            ['c1c_coastguard', 0.5, 'INT_CGPOST', 'The Coast Guard Post'], ['c1c_truckcafe', 0.84, 'INT_TRUCKCAFE', 'The Truck Stop Café'], ['c1c_fort', 0.49, 'INT_FORT', 'The Ottoman Fort'],
            ['c1c_fishmarket', 0.5, 'INT_FISHMKT', 'The Fish Market']);
        for (let k = 1; k <= 13; k++) L.doors.push(['c1c_house' + k, 'spr', 'INT_HOUSE1C' + k, 'A House']);
        return L;
    };
})();

// ---- looks for the people indoors: made from a seed, so each is their own ----
function look1C(seed, o) {
    let h = 2166136261; for (const ch of 'look1c:' + seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }   // (FNV-1a, then mulberry32: similar seeds, different people)
    const R = () => { h = (h + 0x6D2B79F5) >>> 0; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }, pick = a => a[Math.floor(R() * a.length)];
    const CL = [['#c84830', '#a03420', '#782414'], ['#3a70c8', '#285496', '#1c3c70'], ['#58a848', '#3e8a30', '#2a6420'], ['#e8d8b0', '#c8b890', '#a89870'], ['#8a5aa0', '#6c4482', '#4e3062'], ['#d8a040', '#b88020', '#906010'], ['#f4f4f0', '#dcdcd4', '#b8b8b0'], ['#5a6068', '#40464e', '#2c3036']];
    const L = { skinCol: SKINS[3 + Math.floor(R() * 6)], shoeKind: pick(['sandals', 'sandals', 'babouche', 'sneakers']), shoe: pick(['#5c3418', '#1c1814', '#3a3e48']) };
    if (o.robe) Object.assign(L, { robe: pick(CL) }); else Object.assign(L, { top: pick(CL), topKind: pick(['shirt', 'tee', 'vest', 'tank', 'jacket']), legs: pick([CL[7], CL[3], ['#3a3e48', '#2a2e36', '#1c1e24'], CLOTH.indigo]), botKind: pick(['jeans', 'rolled', 'sirwal']) });
    if (o.woman) Object.assign(L, { head: 'hijab', headCol: pick(CL), slim: R() < 0.5 });
    else { if (R() < 0.5) Object.assign(L, { head: pick(['skullcap', 'turban', 'cap']), headCol: pick(CL) }); else Object.assign(L, { hairStyle: pick(['short', 'buzz', 'curls', 'bald']), hairCol: HAIRS[Math.floor(R() * 4)] }); L.face = pick([null, 'tache', 'beard', 'stubble', 'glasses']); L.tache = L.beard = pick(['#2a2424', '#d8d8d0', '#5a4a40']); }
    if (o.kid) L.kid = true; if (o.old) { L.hairCol = HAIRS[8]; L.beard = L.tache = '#e8e8e0'; }
    return L;
}
const folk1C = (map, x, y, id, label, seed, o, line, dir) => personAt(map, x, y, id, label, look1C(seed, o || {}), dir || 0);
// what the people indoors say (registered up front, so the audit sees them)
const FOLK_1C = {
    c1c_cafe_d1: ['Domino Player', '"Double six!" He slaps the domino down so hard the tea glasses jump. "The fixer! Sit, play. No, don\'t sit, you\'ll bring us your luck."'],
    c1c_cafe_d2: ['Domino Player', 'An old man studying his dominoes like a general studying a map. "Bassem\'s boat." He doesn\'t look up. "I knew your Shahd. She was a good boat. You were a bad captain." He plays. "Everybody is, once."'],
    c1c_mosque_m: ['A Man Praying', 'A fisherman praying alone, his lips moving, salt still drying white on his arms. You leave him be.'],
    c1c_cg_conscript: ['Young Conscript', 'A conscript of nineteen in a uniform two sizes too big, filling in a logbook with his tongue between his teeth. "The sergeant is outside. The sergeant is always outside." He lowers his voice. "Is it true you can open any lock? There\'s a drawer here that\'s been stuck since 2015."'],
    c1c_tc_d1: ['Driver', '"Port Sudan to Suez in forty hours, and they still ask me why I drink tea like this." He has eleven sugars in it. You counted.'],
    c1c_tc_d2: ['Driver', 'A driver asleep upright at the table with his hand round a glass of tea, which he does not spill. Somebody has put a newspaper over his head to keep the flies off.'],
    c1c_fort_guard: ['Fort Guard', 'The fort\'s guard, asleep on a chair in the shade with his ticket book on his knee. He wakes, looks at you, decides you\'re a local, and goes back to sleep. Tickets are for Germans.'],
    c1c_fish_w: ['Fish Woman', 'A woman gutting fish with three strokes each, the guts going to a queue of cats that has formed with military precision. "Buy or move. You\'re in my cats\' way."'],
};
for (const id in FOLK_1C) { STORY_SCRIPTS[id] = id; scene(id, { speaker: FOLK_1C[id][0], text: FOLK_1C[id][1], choices: [{ text: 'Move on.' }] }); }

// ---- a few new pieces ----
const FURN1C2 = {
    slab() { const st = stage(60, 18, 10), { A } = st, x = st.x, y = st.y - 8; A.r(x, y, 60, 14, '#b8bcc0'); A.hl(x, y, 60, '#dce0e4'); A.r(x, y + 14, 60, 4, '#868c94'); for (let i = 0; i < 18; i++) A.px(x + 2 + Math.floor(hash2(i, 4) * 56), y + 2 + Math.floor(hash2(4, i) * 10), '#f4f8fa'); for (let k = 0; k < 5; k++) { const fx = x + 6 + k * 11, c = ['#e05040', '#5ab0f0', '#d8c8a0', '#f08070', '#58c8a0'][k]; A.ell(fx + 4, y + 7, 5, 2, c); A.px(fx + 8, y + 6, '#1c1814'); A.poly([[fx - 2, y + 5], [fx, y + 7], [fx - 2, y + 9]], c); } return fit(st, { solid: [0, 0, 60, 18] }); },
    scales() { const st = stage(16, 10, 18), { A } = st, x = st.x, y = st.y - 16; A.r(x + 2, y + 18, 12, 6, '#d04838'); A.r(x + 7, y + 6, 2, 12, '#86949e'); A.r(x, y + 4, 16, 2, '#86949e'); A.ell(x + 2, y + 10, 3, 2, '#c8ccd0'); A.ell(x + 14, y + 10, 3, 2, '#c8ccd0'); return fit(st, { solid: [0, 4, 16, 6] }); },
    cannonballs() { const st = stage(26, 14, 10), { A } = st, x = st.x, y = st.y - 6; for (const [a, b] of [[2, 8], [10, 8], [18, 8], [6, 3], [14, 3], [10, -2]]) { A.ell(x + a + 3, y + b + 3, 4, 4, '#3a3a3e'); A.px(x + a + 2, y + b + 1, '#7a7a82'); } return fit(st, { solid: [0, 4, 26, 10] }); },
    well() { const st = stage(26, 18, 18), { A } = st, x = st.x, y = st.y - 14; A.ell(x + 13, y + 22, 13, 7, '#a89070'); A.ell(x + 13, y + 20, 12, 6, '#c8b090'); A.ell(x + 13, y + 20, 8, 4, '#1a1410'); A.r(x + 2, y, 2, 20, '#7a5a3a'); A.r(x + 22, y, 2, 20, '#7a5a3a'); A.r(x + 2, y, 22, 2, '#8e6a44'); A.line(x + 13, y + 2, x + 13, y + 14, '#c8b890'); A.r(x + 10, y + 13, 6, 4, '#86949e'); return fit(st, { solid: [0, 8, 26, 10] }); },
    radioSet() { const st = stage(36, 14, 20), { A } = st, x = st.x, y = st.y - 18; A.r(x, y + 10, 36, 14, '#5a6068'); A.hl(x, y + 10, 36, '#86949e'); A.r(x + 3, y + 13, 14, 7, '#20242c'); A.r(x + 4, y + 14, 6, 2, '#58e078'); for (let k = 0; k < 3; k++) A.ell(x + 22 + k * 5, y + 17, 2, 2, '#c8ccd0'); A.r(x + 30, y - 4, 1, 14, '#86949e'); A.r(x + 6, y + 4, 8, 6, '#20242c'); return fit(st, { solid: [0, 4, 36, 10] }); },
    netPile() { const st = stage(34, 14, 10), { A } = st, x = st.x, y = st.y - 6; A.ell(x + 17, y + 9, 16, 6, '#6a8a7a'); for (let i = 0; i < 9; i++) A.line(x + 4 + i * 3, y + 4, x + 8 + i * 3, y + 14, '#4e6a5c'); for (let i = 0; i < 4; i++) A.ell(x + 6 + i * 8, y + 5, 2, 2, '#f0c040'); return fit(st, { solid: [0, 4, 34, 10] }); },
};

// ---- the café ----
ROOMS.INT_CAFE1C = {
    name: 'THE CAFÉ', tw: 12, th: 7, style: 'tin',
    enter: ['System', 'Inside the café: a fan that turns with great effort, the football on a television on a bracket, a mirror advertising a brand of tea that no longer exists, and dominoes slapping down on a tin table like gunshots.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(0, 0, pw, W, '#d8e4dc'); A.r(0, W - 16, pw, 16, '#3a70c8'); A.hl(0, W - 16, pw, '#5a90e0');
        A.r(28, 10, 46, 26, '#c89020'); A.r(30, 12, 42, 22, '#c8d4dc'); A.r(36, 18, 30, 6, '#c84830');
        wall(26, 50, null, { label: 'An Old Mirror', say: ['System', 'A mirror painted with an advertisement for EL-AROUSA TEA, A CUP FIT FOR A BRIDE. The company went bust in 1990. The mirror has outlived it, and two owners, and a war.'] });
        A.r((pw >> 1) - 16, 8, 32, 22, '#20242c'); A.r((pw >> 1) - 14, 10, 28, 16, '#3aa858');
        wall((pw >> 1) - 18, 36, null, { label: 'The Television', say: ['System', 'Ismaily against Al-Masry on a television on a bracket, the picture green as a swimming pool. Nobody in the café supports either. Everybody has an opinion anyway.'] });
        put(pw - 104, W + 6, FURN.counter(84), null, { label: 'The Counter', script: 'c1c_cafe' });
        put(40, W + 52, FURN1B.cafeTable()); put(130, W + 70, FURN1B.cafeTable()); put(60, ph - 64, FURN1B.cafeTable()); put(200, ph - 70, FURN1B.shisha());
        folk1C(map, 58, W + 74, 'c1c_cafe_d1', 'Domino Player', 'cafe1', {}, '"Double six!" He slaps the domino down so hard the tea glasses jump. "The fixer! Sit, play. No, don\'t sit, you\'ll bring us your luck."', 3);
        folk1C(map, 148, W + 94, 'c1c_cafe_d2', 'Domino Player', 'cafe2', { old: true }, 'An old man studying his dominoes like a general studying a map. "Bassem\'s boat." He doesn\'t look up. "I knew your Shahd. She was a good boat. You were a bad captain." He plays. "Everybody is, once."', 3);
    },
};

// ---- the mosque ----
ROOMS.INT_MOSQUE1C = {
    name: 'THE MOSQUE', tw: 12, th: 8, style: 'maqam',
    enter: ['System', 'You leave your shoes at the door with the fishermen\'s sandals. Inside: carpet, whitewash, the light coming green through little windows, a fan turning, and the sea outside so close you can hear it breathing.'],
    build({ map, A, put, wall, pw, ph, W }) {
        const mx = pw >> 1; A.r(mx - 16, 6, 32, W - 8, '#3e8a58'); A.ell(mx, 10, 16, 12, '#3e8a58'); A.r(mx - 12, 12, 24, W - 14, '#2a6440'); A.ell(mx, 14, 12, 9, '#2a6440');
        wall(mx - 18, 36, null, { label: 'The Mihrab', say: ['System', 'The mihrab, tiled green, facing Mecca, which from Marsa Tarfa is east across the Red Sea, straight over the water. The fishermen like that: they pray towards where they work.'] });
        for (let r = 0; r < 4; r++) A.r(16, W + 20 + r * 30, pw - 32, 24, r % 2 ? '#3a6a9a' : '#2e5a88');
        A.r(pw - 40, 8, 24, W - 10, '#8e6a44'); A.r(pw - 38, 10, 20, W - 14, '#3a2a1c');
        wall(pw - 42, 28, 'c1c_minaret_stair', { label: 'The Minaret Stair', say: ['System', 'The minaret stair.'] });
        put(mx + 30, W - 2, FURN1B.minbar(), null, { label: 'The Minbar', say: ['System', 'The minbar, painted blue and white like a fishing boat, which is exactly what it was made from: the timbers of the imam\'s grandfather\'s boat, when it was too old for the sea.'] });
        folk1C(map, mx - 44, W + 100, 'c1c_mosque_m', 'A Man Praying', 'mosque1', { robe: true }, 'A fisherman praying alone, his lips moving, salt still drying white on his arms. You leave him be.', 3);
    },
};
STORY_SCRIPTS.c1c_minaret_stair = () => sflag('c1c_speaker') && sflag('c1c_speaker') !== 'done' ? 'c1c_minaret' : 'c1c_minaret_shut';
scene('c1c_minaret_shut', { speaker: 'System', text: () => sflag('c1c_speaker') === 'done' ? 'The narrow stair up the minaret. You know every one of its eighty-one steps now, and especially the eleventh.' : 'A narrow door onto the minaret stair, a padlock on it. The imam keeps the key in his pocket "for the boys".', choices: [{ text: 'Move on.' }, { text: 'Sit a while on the carpet. (half an hour)', onSelect: () => c1aRest(30, 'c1a_rested') }] });

// ---- the kiosk ----
ROOMS.INT_KIOSK1C = {
    name: 'THE KIOSK', tw: 6, th: 5, style: 'concrete',
    enter: ['System', 'You squeeze in through the side door of the kiosk, which is like getting into a wardrobe full of crisps. The kiosk man, out front at his window, doesn\'t even turn round.'],
    build({ map, A, put, wall, pw, ph, W }) {
        for (let j = 0; j < 3; j++) for (let i = 0; i < 10; i++) A.r(14 + i * 9, 10 + j * 12, 7, 9, ['#d04838', '#f0c040', '#58a848', '#3a70c8', '#f4f4f0'][(i + j * 2) % 5]);
        wall(12, 90, null, { label: 'Shelves', say: ['System', 'Crisps, biscuits, cigarettes (Cleopatra, Marlboro, and some without a stamp that came off a boat at night), phone credit cards, batteries, chewing gum, and a single dusty bottle of shampoo that has been here since 2011.'] });
        put(pw - 34, W + 2, FURN1B.fridgeDrinks(), null, { label: 'Fridge', script: 'c1c_kiosk' });
    },
};

// ---- the coast guard post ----
ROOMS.INT_CGPOST = {
    name: 'THE COAST GUARD POST', tw: 11, th: 7, style: 'concrete',
    enter: ['System', 'The coast guard post: whitewash, a ceiling fan, a radio hissing to itself, a chart of the coast on the wall, an empty cell with its door open and a mattress in it that somebody naps on, and the smell of very strong tea.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(30, 8, 80, 34, '#e8e0c8'); A.r(32, 10, 76, 30, '#9ed2f4'); A.r(32, 10, 30, 30, '#d8c8a0'); for (let i = 0; i < 6; i++) A.ell(70 + i * 6, 16 + (i % 3) * 7, 3, 2, '#58c8a0');
        wall(28, 84, null, { label: 'The Chart', say: ['System', 'A chart of the coast from Safaga to Marsa Alam, pinned at the corners: every reef in red, every wreck as a little cross. Somebody has drawn a pencil line along the patrol route and then rubbed it out, not quite.'] });
        A.r(pw - 70, 8, 50, W - 10, '#5a6068'); for (let i = 0; i < 5; i++) A.vl(pw - 66 + i * 10, 8, W - 10, '#3a3e48');
        wall(pw - 72, 54, null, { label: 'The Cell', say: ['System', 'The cell, with its door open and a mattress in it. A sign in biro: OCCUPIED BY SERGEANT DURING SIESTA. NO PRISONERS 1–3.'] });
        put(40, W + 40, FURN.desk(80, false), null, { label: 'The Desk', say: ['System', 'A desk under a sheet of glass: boat licences, a tide table, a photograph of a coast guard cutter that the post does not have, and a glass of tea with a saucer on top to keep the flies out.'] });
        put(pw - 80, W + 50, FURN1C2.radioSet(), null, { label: 'The Radio', say: ['System', 'The VHF set, channel 16, hissing. Every so often a fisherman\'s voice comes out of it, asking about the weather or somebody\'s cousin\'s wedding.'] });
        folk1C(map, 70, W + 30, 'c1c_cg_conscript', 'Young Conscript', 'cg1', {}, 'A conscript of nineteen in a uniform two sizes too big, filling in a logbook with his tongue between his teeth. "The sergeant is outside. The sergeant is always outside." He lowers his voice. "Is it true you can open any lock? There\'s a drawer here that\'s been stuck since 2015."', 0);
    },
};

// ---- the truck stop café ----
ROOMS.INT_TRUCKCAFE = {
    name: 'THE TRUCK STOP CAFÉ', tw: 12, th: 7, style: 'tin',
    enter: ['System', 'The truck stop café, inside: plastic chairs, a long counter, a television showing a film from 1974 in which a man in flares is very angry at a woman in sunglasses, and drivers eating with the concentration of men with six hundred kilometres still to go.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(0, 0, pw, W, '#f0e0b8'); A.r(0, W - 14, pw, 14, '#d8a040');
        const tvx = (pw >> 1) + 20; A.r(tvx, 8, 30, 22, '#20242c'); A.r(tvx + 2, 10, 26, 16, '#a88a6a'); A.r(tvx + 8, 14, 6, 10, '#c84830'); A.r(tvx + 18, 15, 5, 9, '#3a3e48');
        wall(tvx - 2, 34, null, { label: 'The Television', say: ['System', 'The film from 1974. The man in flares has now slapped someone. The drivers watch without reacting; they have all seen it on this television, in this café, every week for twenty years.'] });
        WALLART.calendar(A, 110, 12); A.r(60, 10, 40, 20, '#3a70c8'); for (let i = 0; i < 5; i++) A.r(64 + i * 7, 14, 4, 12, '#f4f4f0');
        wall(58, 44, null, { label: 'A Road Map', say: ['System', 'A road map of Egypt with the coast highway gone over in marker by a hundred drivers, every café and fuel stop circled, and one bridge near Safaga crossed out with BROKEN SINCE 2019.'] });
        put(16, W + 6, FURN.counter(84), null, { label: 'The Counter', script: 'c1c_truckcafe' });
        put(pw - 70, W + 4, FURN1B.fridgeDrinks(), null, { label: 'Cold Drinks', say: ['System', 'A fridge of cold drinks with a padlock on it, the key on a string round the café man\'s neck. He\'s had trouble with drivers.'] });
        put(pw - 110, W + 56, FURN1B.cafeTable()); put(pw - 170, W + 84, FURN1B.cafeTable()); put(pw - 90, ph - 60, FURN1B.cafeTable());
        folk1C(map, pw - 92, W + 78, 'c1c_tc_d1', 'Driver', 'tc1', {}, '"Port Sudan to Suez in forty hours, and they still ask me why I drink tea like this." He has eleven sugars in it. You counted.', 3);
        folk1C(map, pw - 152, W + 106, 'c1c_tc_d2', 'Driver', 'tc2', { robe: true }, 'A driver asleep upright at the table with his hand round a glass of tea, which he does not spill. Somebody has put a newspaper over his head to keep the flies off.', 3);
    },
};

// ---- the fort's courtyard ----
ROOMS.INT_FORT = {
    name: 'THE OTTOMAN FORT', tw: 14, th: 8, style: 'maqam',
    enter: ['System', 'Through the gate and into the fort\'s courtyard: sandstone walls going up to the sky, the doorways of old barracks along one side, a well, a heap of cannonballs, and silence, after the wind outside, like a hand over your ears.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(0, 0, pw, W, '#d8bc8c'); for (let j = 4; j < W; j += 8) A.hl(0, j, pw, '#b89c6c'); for (let i = 0; i < 30; i++) A.vl(Math.floor(hash2(i, 2) * pw), Math.floor(hash2(2, i) * W), 6, '#b89c6c');
        for (let k = 0; k < 4; k++) { const dx = 20 + k * 52; A.r(dx, W - 34, 26, 32, '#3a2a1c'); A.ell(dx + 13, W - 34, 13, 8, '#3a2a1c'); }
        wall(18, 210, null, { label: 'The Barracks', say: ['System', 'Four doorways into the old barracks, dark and cool and smelling of bats. The Ottoman garrison slept here, and the French in 1799, and English sailors after the ships knocked holes in the wall that you can still see patched.'] });
        A.r(pw - 90, 10, 60, 24, '#e8dcc0'); A.r(pw - 86, 14, 52, 16, '#c8b890'); for (let i = 0; i < 6; i++) A.r(pw - 82 + i * 8, 18, 5, 8, '#8a6a44');
        wall(pw - 92, 64, null, { label: 'An Inscription', say: ['System', 'Over an inner door, a carved plaque in Ottoman Turkish and, under it, a newer one in Arabic and English: BUILT IN THE REIGN OF SULTAN SELIM I, 1517, TO GUARD THE PILGRIM ROAD TO MECCA AND THE SPICE ROAD FROM INDIA. HELD BY THE FRENCH, 1799. BOMBARDED BY THE BRITISH, 1799.'] });
        put((pw >> 1) - 13, W + 50, FURN1C2.well(), null, { label: 'The Well', script: 'c1c_fortwell' });
        put(pw - 60, W + 70, FURN1C2.cannonballs(), null, { label: 'Cannonballs', say: ['System', 'A heap of iron cannonballs, rusted together into a pyramid. Some are Ottoman, some French, and a few are English, fired at this wall from the sea and dug out of it afterwards.'] });
        folk1C(map, 50, W + 90, 'c1c_fort_guard', 'Fort Guard', 'fort1', { old: true, robe: true }, 'The fort\'s guard, asleep on a chair in the shade with his ticket book on his knee. He wakes, looks at you, decides you\'re a local, and goes back to sleep. Tickets are for Germans.', 0);
    },
};
STORY_SCRIPTS.c1c_fortwell = 'c1c_fortwell';
scene('c1c_fortwell', { speaker: 'System', text: 'The fort\'s well, still sweet after five hundred years: the garrison\'s life, and the pilgrims\'. A bucket on a rope, worn smooth.', choices: [{ text: 'Drink.', onSelect: () => { const r = refill(); drink(50, 'Cold water from the fort\'s well'); if (r) Notice.show(r.trim()); } }, { text: 'Move on.' }] });

// ---- the fish market ----
ROOMS.INT_FISHMKT = {
    name: 'THE FISH MARKET', tw: 12, th: 7, style: 'concrete',
    enter: ['System', 'The fish market: a concrete hall open at both ends to the wind, slabs of fish on crushed ice, the hose running, cats everywhere, and the noise of women arguing about prices in a way that is also, somehow, friendship.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(0, 0, pw, W, '#c8ccd0'); A.r(0, W - 12, pw, 12, '#9aa0a8');
        A.r(30, 8, 120, 22, '#2466a8'); for (let i = 0; i < 12; i++) A.r(36 + i * 9, 14, 6, 3, '#ffffff'); A.r(36, 22, 80, 2, '#f0c040');
        wall(28, 124, null, { label: 'The Sign', say: ['System', 'MARSA TARFA FISHERMEN\'S COOPERATIVE, FOUNDED 1962, in blue and white. Under it in marker: NO CREDIT, NO EXCEPTIONS, NOT EVEN YOU, MAHMOUD.'] });
        put(24, W + 30, FURN1C2.slab(), null, { label: 'Fish on Ice', say: ['System', 'Grouper, parrotfish, snapper, a shark no bigger than a dog, and a moray eel coiled in a bucket like rope, still not entirely convinced it\'s dead.'] });
        put(pw - 90, W + 30, FURN1C2.slab(), null, { label: 'Fish on Ice', say: ['System', 'Squid in a heap, their skins changing colour slowly as they give up, and a crate of the little silver fish that you fry whole and eat with your fingers.'] });
        put(pw >> 1, W + 60, FURN1C2.scales()); put(40, ph - 60, FURN1C2.netPile());
        folk1C(map, (pw >> 1) - 30, W + 56, 'c1c_fish_w', 'Fish Woman', 'fishm1', { woman: true, robe: true }, 'A woman gutting fish with three strokes each, the guts going to a queue of cats that has formed with military precision. "Buy or move. You\'re in my cats\' way."', 0);
    },
};

// ---- thirteen houses ----
const HOUSE_FOLK_1C = [
    ['A Fisherman\'s Wife', { woman: true, robe: true }, 'A woman mending a net across her knees while the television shows a cooking programme she isn\'t watching. "My husband\'s out past the reef. Every time he goes, I mend a net. The nets are very good now."'],
    ['An Old Captain', { old: true, robe: true }, 'An old man in a captain\'s cap with no ship, looking at the sea through the window with binoculars. "The patrol boat is late today. It\'s always late on Tuesdays. The captain\'s wife makes him breakfast." He lowers the binoculars. "I didn\'t tell you that."'],
    ['A Teacher', { woman: true }, 'A woman marking exercise books at the table, red pen moving fast. "You were in my class. You were clever, and you never did your homework." She doesn\'t look up. "I see nothing has changed."'],
    ['Two Brothers', {}, 'A young man and his younger brother arguing over a games console. "He cheats." "He loses." Neither of them looks at you. You might as well be furniture.'],
    ['A Grandmother', { woman: true, robe: true, old: true }, 'A grandmother rolling dough for bread on a round tray. "Sit. Eat. You look like a ghost. Bassem\'s men came to your door, I heard. The whole street heard." She slaps the dough. "Eat first. Then worry."'],
    ['A Diver', {}, 'A young man stretched on the sofa with his feet up, a dive computer on his wrist and a bandage on his leg. "Fire coral. Rana told me to go round. I didn\'t go round." He grins. "Tell her I\'m dying, she might come and visit."'],
    ['A Baker\'s Family', { woman: true }, 'A woman taking hot bread from a tin box and stacking it in a cloth. "Every morning at four. My husband sleeps in the day. If you wake him, I\'ll kill you, and he\'ll help."'],
    ['A Boatbuilder', { old: true }, 'An old man carving a model dhow from a block of wood, the shavings curling on a newspaper. "This one is the Umm Kalthoum. Zaki\'s boat. My father built her, in 1971." He blows dust off the bow. "Bring her back in one piece, whatever he\'s got you doing."'],
    ['A Young Mother', { woman: true }, 'A young woman rocking a cradle with her foot and scrolling her phone. "Is it true you swim with sharks? My husband says you\'re mad. I say you\'re just poor." She shrugs. "It\'s the same thing here."'],
    ['A Retired Policeman', { old: true }, 'A retired policeman in a vest, watching the news with the sound off. "Thirty years in the tourist police. You know what I learned? Everyone is smuggling something. Cigarettes, sugar, love letters." He looks at you. "Be careful what yours is."'],
    ['A Student', {}, 'A girl of seventeen at the table with English textbooks and a dictionary. "I\'m going to university in Cairo, God willing. To study law." She looks at you very directly. "Then I\'m coming back to put Bassem in prison."'],
    ['A Fishmonger\'s Son', { kid: true }, 'A boy feeding a cat from a saucer under the table. "She had five kittens. You can have one. Everybody in this street already has one." The cat looks at you with deep suspicion.'],
    ['A Widow', { woman: true, robe: true, old: true }, 'An old woman in black sitting by the window with a photograph in her lap. "My husband\'s boat went out in the storm of 1994 and didn\'t come back." She turns the photograph to the light. "The sea takes what it wants. Remember that, out there."'],
];
for (let k = 1; k <= 13; k++) {
    const [who, o, line] = HOUSE_FOLK_1C[k - 1];
    ROOMS['INT_HOUSE1C' + k] = {
        name: 'A HOUSE IN MARSA TARFA', tw: 10, th: 7, style: k % 2 ? 'tin' : 'concrete',
        build({ map, A, put, wall, pw, ph, W }) {
            const R = rng('h1c' + k), SOFA = [['#5ab0d8', '#3a90b8', '#2a7098', '#1c5070'], ['#e8c060', '#c8a040', '#a88020', '#7a5c14'], ['#d87a7a', '#b85a5a', '#984040', '#702c2c']][k % 3];
            A.r(0, 0, pw, W, ['#f4f0e4', '#e4f0f4', '#f4e8e0'][k % 3]);
            A.r(30, 12, 26, 18, '#3a70c8'); A.r(32, 14, 22, 9, '#9ed2f4'); A.r(32, 23, 22, 5, '#2466a8');
            wall(28, 30, null, { label: 'A Picture', say: ['System', k % 2 ? 'A picture of a dhow under full sail, cut from a calendar and framed in shells.' : 'A wedding photograph: everyone stiff and solemn except the groom\'s mother, who is laughing at something off to the side.'] });
            WALLART.calendar(A, pw - 60, 14);
            put(16, W + 4, FURN1B.kanaba(Math.round(pw * 0.42), SOFA)); put(pw - 30 - Math.round(pw * 0.3), W + 4, FURN1B.kanaba(Math.round(pw * 0.3), SOFA));
            put((pw >> 1) - 13, W + 44, FURN1B.tabliya(), null, { label: 'Low Table', script: 'c1c_house_eat' });
            put(pw - 40, ph - 76, R() < 0.5 ? FURN.tv() : FURN.fridge()); put(14, ph - 64, FURN.fan());
            put((pw >> 1) - 50, W + 34, FURN.rug(100, 56, [PAL.red, PAL.blue, PAL.red, PAL.blue][k % 4]));
            if (k === 1) put(pw - 80, W + 60, FURN1C2.netPile(), null, { label: 'A Net', say: ['System', 'A fishing net across a chair, half mended, a wooden needle stuck in it.'] });
            if (k === 8) put(pw - 80, W + 60, FURN.desk(48, false), null, { label: 'The Model Dhow', say: ['System', 'A model dhow half carved, every plank and peg, UMM KALTHOUM painted on her bow in letters smaller than a rice grain.'] });
            if (k === 11) WALLART.bookShelf(A, (pw >> 1) + 30, 18);
            if (k === 9) put(pw - 80, W + 54, FURN1B.cot(), null, { label: 'Cradle', say: ['System', 'A baby asleep in a wooden cradle with a blue bead against the evil eye pinned to the blanket.'] });
            const e = personAt(map, 70 + (k % 3) * 30, W + 40, 'c1c_hfolk' + k, who, look1C('house' + k, o), 0); e.say = ['House', line];
        },
    };
    STORY_SCRIPTS['c1c_hfolk' + k] = 'c1c_hfolk';
}
scene('c1c_hfolk', { speaker: 'System', get text() { const k = +(Game.talkId || 'c1c_hfolk1').replace('c1c_hfolk', ''); return HOUSE_FOLK_1C[k - 1][2]; }, choices: [{ text: '"Shukran."' }] });
scene('c1c_house_eat', {
    speaker: 'System',
    get text() { const k = Game.map.key.replace('INT_HOUSE1C', ''); return sflag('c1c_house_ate' + k) ? 'The low table, the glasses cleared. Somebody is already washing up.' : 'A low round table: tea glasses, bread, white cheese, a bowl of ful, a plate of fried fish, salad, pickles. Whatever you say, a place is being made for you.'; },
    get choices() { const k = Game.map.key.replace('INT_HOUSE1C', ''); return sflag('c1c_house_ate' + k) ? [{ text: 'Move on.' }] : [{ text: 'Eat with the family. (20 minutes)', onSelect: () => { sflag('c1c_house_ate' + k, true); eat(55, 'Bread, cheese, ful and fried fish'); drink(15); clockAdvance(20); } }, { text: '"Thank you, I\'ve eaten."' }]; },
});

// ============================================================
// REST: the mattress in your flat
// ============================================================
scene('c1c_mattress', {
    speaker: 'System',
    text: () => `A mattress on the floor, a sheet, a blue blanket you don't need in this heat. It is ${clockStr()}.`,
    get choices() {
        const c = [], t = Story.s.clock;
        if (t < 24 * 60) c.push({ text: 'Lie down for an hour.', onSelect: () => c1aRest(60, 'c1a_rested') });
        if (sflag('c1c_summoned') && !sflag('c1c_offer') && t < 16 * 60 + 30) c.push({ text: 'Sleep until half past four. (Bassem at five)', onSelect: () => c1aRest(16 * 60 + 30 - t, 'c1a_rested') });
        if (sflag('c1c_offer') && !sflag('c1c_package') && t < 21 * 60 + 30) c.push({ text: 'Sleep until half past nine. (the truck at ten)', onSelect: () => c1aRest(21 * 60 + 30 - t, 'c1a_rested') });
        if (sflag('c1c_ship_done') && t < 6 * 60 + 24 * 60) c.push({ text: 'Sleep until morning.', onSelect: () => c1aRest(Math.max(30, 24 * 60 + 7 * 60 - t), 'c1a_rested') });
        c.push({ text: 'Get up.' });
        return c;
    },
});

// ============================================================
// THE PHONE: Zaki and Rana, and a few messages through the day
// ============================================================
PHONE_CALLS.push(
    { name: 'Captain Zaki', when: () => Game.player.bg === 'fixer' && !!sflag('c1c_zaki'), scene: 'c1c_call_zaki' },
    { name: 'Rana Fouad', when: () => Game.player.bg === 'fixer' && !!sflag('c1c_rana'), scene: 'c1c_call_rana' },
);
scene('c1c_call_zaki', {
    speaker: 'Captain Zaki',
    text: () => sflag('c1c_ship_done') ? (sflag('ch1c_zaki_saved') ? `"Alive, habibi. Sore. My wife is shouting at me in the kitchen, which means I'm going to live." A pause. "Go. Don't call me from Cairo. Call me from far."` : `It rings for a long time. Then a woman's voice, tired: "He's sleeping. He'll live, the doctor says. Don't call again tonight."`)
        : !sflag('c1c_offer') ? `"Habibi. Whatever Bassem says at five, say yes slowly. Never say yes fast to Bassem." Click.`
            : `"The Umm Kalthoum is ready. Diesel, a way past the coast guard, and something for if you go in the water. Then the truck at ten." He coughs. "And bring cigarettes." Click.`,
    choices: [{ text: 'Hang up.' }],
});
scene('c1c_call_rana', {
    speaker: 'Rana Fouad',
    text: () => sflag('c1c_ship_done') ? `"You're alive." A long breath down the line. "Come by before you go. Don't argue. Just come."`
        : sflag('c1c_offer') && !sflag('c1c_kit') ? `"The kit's on the counter. Come and get it, and don't make me come to you."` : `"I'm busy. Germans in November, tanks to fill, a compressor that's older than both of us." A pause. "What do you want?" You don't know. "Then call me when you do."`,
    choices: [{ text: 'Hang up.' }],
});
(function () {
    const A = AREAS.fixer, _frame = A.frame;
    A.frame = function (dt) {
        _frame.call(this, dt);
        const c = Story.s.clock;
        if (c >= 13 * 60 && sflag('c1c_zaki') && !sflag('c1c_msg_zaki1')) { sflag('c1c_msg_zaki1', true); storyMessage('Zaki', 'The tide turns at eleven tonight. Just saying. — Z.'); }
        if (c >= 19 * 60 + 30 && sflag('c1c_offer') && !sflag('c1c_kit') && sflag('c1c_rana') && !sflag('c1c_msg_rana1')) { sflag('c1c_msg_rana1', true); storyMessage('Rana', 'The kit is ready. Come and get it.'); }
    };
})();

// ---- where the compass points, now that some people are indoors ----
NEEDS_WHERE.fixer += ' Indoors: the fort\'s well, the café and truck stop counters, the kiosk fridge, and a meal with any family whose house you go into.';
