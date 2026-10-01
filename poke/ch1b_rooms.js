// ============================================================
// THE CODEX OF GIZA — POKE STYLE: SAQQARA'S ROOMS (poke/ch1b_rooms.js)
// Chapter 1-B, step 11: every building you can see has an inside, unless the
// story keeps you out (the sealed tombs, the mastabas, the Heb-Sed chapels,
// which were always solid dummies, and the Teti pyramid, shut for repairs).
//   the café · the bakery · the mosque · the garage · the seven village houses
//   the ghaffir's hut (the bench: wait, rest, look at the Codex)
//   the museum's ticket kiosk · the Step Pyramid (its corridor, the great shaft)
// Also: the phone (calls to the Director and, once she's yours, Umm Sabry; a
// couple of messages through the day) and resting at Umm Sabry's tea corner.
// ============================================================

// ---- the doors (named: what a building said from outside, you read going in) ----
(function () {
    const L0 = saqqaraLayout;
    saqqaraLayout = function () {
        const L = L0();
        L.doors.push(['c1b_cafe', 0.5, 'INT_CAFE', 'The Café'], ['c1b_bakery', 0.66, 'INT_BAKERY', 'The Bakery'], ['c1b_mosque', 0.4, 'INT_MOSQUE', 'The Mosque'], ['c1b_garage', 0.5, 'INT_GARAGE', 'The Garage'],
            ['c1b_ghafhut', 0.33, 'INT_GHAFHUT', 'The Ghaffir\'s Hut'], ['c1b_kiosk', 0.5, 'INT_KIOSK', 'Ticket Kiosk'], ['c1b_steppyramid', 0.5, 'INT_STEPPYR', 'The Step Pyramid']);
        for (let k = 1; k <= 7; k++) L.doors.push(['c1b_house' + k, 'spr', 'INT_HOUSE' + k, 'A House']);
        return L;
    };
})();

// ---- a few new pieces of furniture ----
const FURN1B = {
    kanaba(w, P) { const st = stage(w, 14, 16), { A } = st, x = st.x, y = st.y - 14; A.r(x, y, w, 12, P[2]); A.r(x + 2, y + 2, w - 4, 8, P[1]); A.r(x, y + 12, w, 14, P[1]); A.hl(x, y + 12, w, P[0]); for (let i = 8; i < w - 6; i += 18) A.r(x + i, y + 4, 12, 7, P[0]); A.r(x, y + 26, w, 2, P[3]); return fit(st, { solid: [0, 0, w, 14] }); },
    tabliya() { const st = stage(26, 18, 8), { A } = st, x = st.x, y = st.y - 4; A.ell(x + 13, y + 9, 13, 7, '#8e5e32'); A.ell(x + 13, y + 8, 12, 6, '#b8844c'); for (const [a, b] of [[6, 6], [12, 4], [18, 7]]) { A.r(x + a, y + b, 2, 3, '#f4ecd8'); A.px(x + a, y + b + 1, '#b84020'); } A.ell(x + 13, y + 11, 3, 2, '#d8a868'); return fit(st, { solid: [2, 2, 22, 14] }); },
    oven(f) { const st = stage(56, 26, 30), { A } = st, x = st.x, y = st.y - 28; A.r(x, y, 56, 54, '#b88a5c'); A.r(x, y, 56, 4, '#d8aa78'); for (let j = y + 6; j < y + 54; j += 6) A.hl(x, j, 56, '#9a6c44'); A.r(x + 14, y + 20, 28, 18, '#2a1c14'); A.r(x + 17, y + 23, 22, 13, f ? '#f09030' : '#e07820'); A.r(x + 20, y + 26, 16, 6, f ? '#ffd060' : '#ffc040'); A.r(x + 20, y - 8, 10, 10, '#8a6a48'); return outline(st.c); },
    doughTable() { const st = stage(48, 18, 12), { A } = st, x = st.x, y = st.y - 8; A.r(x, y, 48, 14, '#e8dcc0'); A.hl(x, y, 48, '#fffaf0'); A.r(x, y + 14, 48, 4, '#b89868'); for (let i = 0; i < 4; i++) A.ell(x + 8 + i * 11, y + 7, 4, 3, '#f4ecd8'); A.r(x + 2, y + 18, 3, 6, '#8e5e32'); A.r(x + 43, y + 18, 3, 6, '#8e5e32'); return fit(st, { solid: [0, 2, 48, 16] }); },
    sacks() { const st = stage(30, 14, 16), { A } = st, x = st.x, y = st.y - 14; for (const [a, b] of [[0, 4], [10, 0], [18, 5]]) { A.ell(x + a + 6, y + b + 12, 7, 9, '#e8e0c8'); A.hl(x + a + 2, y + b + 6, 8, '#c8bca0'); A.r(x + a + 4, y + b + 9, 4, 3, '#3a70c8'); } return fit(st, { solid: [0, 4, 30, 10] }); },
    cafeTable() { const st = stage(36, 16, 14), { A } = st, x = st.x, y = st.y - 10; A.ell(x + 18, y + 6, 9, 4, '#dfe6ea'); A.ell(x + 18, y + 5, 8, 3, '#ffffff'); A.r(x + 17, y + 9, 2, 10, '#86949e'); for (const cx of [x + 2, x + 28]) { A.r(cx, y + 4, 6, 6, '#8e5e32'); A.r(cx, y + 10, 6, 2, '#b8844c'); A.vl(cx, y + 12, 6, '#6e4424'); A.vl(cx + 5, y + 12, 6, '#6e4424'); } A.r(x + 15, y + 2, 2, 3, '#f0e8d8'); A.px(x + 15, y + 3, '#b84020'); A.r(x + 20, y + 2, 4, 2, '#d8b888'); return fit(st, { solid: [4, 4, 28, 12] }); },
    shisha() { const st = stage(10, 8, 26), { A } = st, x = st.x + 5, y = st.y - 24; A.ell(x, y + 26, 5, 4, '#3a70c8'); A.ell(x - 1, y + 25, 2, 1, '#8ac0f0'); A.r(x - 1, y + 6, 2, 18, '#c89020'); A.r(x - 3, y + 3, 6, 3, '#9a4a2c'); A.px(x, y + 2, '#ff9040'); A.line(x + 2, y + 18, x + 8, y + 14, '#5a3a20'); return fit(st, { solid: [0, 0, 10, 8] }); },
    car() { return fit(carSprite(80, 40, ['#f07860', '#c83828', '#a02828', '#701c14'], { tint: '#28384a', hub: '#c8ccd0' }), { solid: [0, 14, 80, 26] }); },
    fridgeDrinks() { const st = stage(24, 12, 34), { A } = st, x = st.x, y = st.y - 32; A.r(x, y, 24, 46, '#d04838'); A.r(x + 2, y + 6, 20, 32, '#9ed2f4'); for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) A.r(x + 4 + i * 5, y + 9 + j * 8, 3, 6, ['#3a70c8', '#d04838', '#58a848', '#f0c040'][(i + j) % 4]); A.r(x + 2, y + 1, 20, 4, '#ffffff'); A.r(x + 6, y + 2, 12, 2, '#d04838'); return fit(st, { solid: [0, 0, 24, 12] }); },
    postcards() { const st = stage(18, 10, 30), { A } = st, x = st.x, y = st.y - 28; A.r(x + 8, y, 2, 40, '#86949e'); for (let j = 0; j < 3; j++) for (let s of [-1, 1]) A.r(x + 9 + s * 6 - 4, y + 4 + j * 11, 8, 9, ['#f0c040', '#58a6e6', '#f07860'][(j + (s > 0 ? 1 : 0)) % 3]); A.ell(x + 9, y + 40, 6, 2, '#5a6272'); return fit(st, { solid: [2, 2, 14, 8] }); },
    ironing() { const st = stage(36, 10, 16), { A } = st, x = st.x, y = st.y - 12; A.poly([[x, y + 4], [x + 30, y + 2], [x + 36, y + 5], [x + 30, y + 8], [x, y + 8]], '#dcd8cc'); A.hl(x, y + 4, 30, '#ffffff'); A.line(x + 8, y + 8, x + 4, y + 22, '#86949e'); A.line(x + 24, y + 8, x + 28, y + 22, '#86949e'); A.r(x + 14, y, 9, 4, '#d04838'); A.r(x + 14, y - 1, 6, 1, '#5a6272'); A.r(x + 2, y + 2, 10, 3, '#3a70c8'); return fit(st, { solid: [0, 2, 36, 8] }); },
    cot() { const st = stage(30, 18, 14), { A } = st, x = st.x, y = st.y - 10; A.r(x, y, 30, 20, '#e8c888'); for (let i = 2; i < 30; i += 4) A.vl(x + i, y - 6, 8, '#c8a868'); A.hl(x, y - 6, 30, '#c8a868'); A.r(x + 3, y + 3, 24, 14, '#f4c8d8'); A.ell(x + 10, y + 8, 4, 4, '#e8b890'); A.r(x + 13, y + 5, 12, 9, '#a8d8f0'); return fit(st, { solid: [0, 0, 30, 18] }); },
    basin() { const st = stage(30, 16, 8), { A } = st, x = st.x, y = st.y - 4; A.ell(x + 15, y + 8, 15, 8, '#8a6a48'); A.ell(x + 15, y + 7, 13, 6, '#b8946a'); A.ell(x + 15, y + 7, 10, 4, '#f0e8d4'); A.ell(x + 12, y + 6, 4, 2, '#fffaf0'); return fit(st, { solid: [0, 2, 30, 14] }); },
    minbar() { const st = stage(26, 40, 40), { A } = st, x = st.x, y = st.y - 38; for (let k = 0; k < 6; k++) { A.r(x + 2, y + 70 - k * 8, 22, 8, k % 2 ? '#a8784a' : '#8e5e32'); A.hl(x + 2, y + 70 - k * 8, 22, '#c89868'); } A.r(x + 4, y + 2, 18, 22, '#8e5e32'); A.poly([[x + 4, y + 2], [x + 22, y + 2], [x + 13, y - 8]], '#3e8a58'); A.r(x + 8, y + 8, 10, 12, '#5e3620'); return fit(st, { solid: [0, 0, 26, 40] }); },
};
// the people indoors: nameless locals, each with a look of their own (nobody from the named cast)
Object.assign(LOOKS, {
    imam: { skin: 3, robe: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], head: 'turban', headCol: ['#c84030', '#a02820', '#781c14'], face: 'beard', beard: '#c8c8c0', shoeKind: 'barefoot', shoe: '' },
    prayer: { skin: 5, robe: ['#a8b8c8', '#8898a8', '#687888'], head: 'skullcap', headCol: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], shoeKind: 'barefoot', shoe: '' },
    grandma: { skin: 5, robe: CLOTH.black, head: 'hijab', headCol: ['#3a3e48', '#26282e', '#16181c'], shoeKind: 'babouche', shoe: '#1c1814', wide: true },
    grandma2: { skin: 4, robe: ['#6a4a6a', '#4e344e', '#362436'], head: 'hijab', headCol: ['#e8e0cc', '#c8c0aa', '#a8a08a'], shoeKind: 'babouche', shoe: '#1c1814' },
    mother: { skin: 4, robe: ['#4a7a6a', '#365e50', '#26443a'], head: 'hijab', headCol: ['#f0c040', '#d0a020', '#a88010'], shoe: '#1c1814', slim: true },
    oldvillager: { skin: 5, robe: ['#c8b890', '#a89870', '#887850'], head: 'turban', headCol: CLOTH.linen, face: 'tache', tache: '#e8e8e8', shoeKind: 'sandals', shoe: '#5c3418' },
    youngwife: { skin: 3, robe: ['#d880a8', '#b86088', '#904868'], head: 'hijab', headCol: ['#f4f0e0', '#dcd8c8', '#b8b4a4'], shoe: '#1c1814', slim: true },
    student: { skin: 4, top: ['#58a6e6', '#2e7cc4', '#2466a8'], topKind: 'shirt', legs: CLOTH.indigo, hairStyle: 'short', hairCol: HAIRS[0], shoeKind: 'sneakers', shoe: '#f4f4f0' },
    father: { skin: 4, top: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], topKind: 'tank', legs: ['#5a5048', '#443c36', '#2e2824'], hairStyle: 'short', hairCol: HAIRS[0], face: 'tache', tache: '#2a2020', shoe: '#1c1814', wide: true },
    waiter: { skin: 4, top: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], topKind: 'shirt', legs: CLOTH.black, hairCol: HAIRS[0], kid: true, shoe: '#1c1814' },
    bakeboy: { skin: 3, top: ['#f4ecd8', '#dcd0b8', '#b8ac90'], topKind: 'tee', legs: CLOTH.linen, botKind: 'sirwal', hairCol: HAIRS[0], kid: true, shoeKind: 'barefoot', shoe: '' },
    ticketman: { skin: 3, top: ['#8a9a7a', '#6e7e5e', '#526244'], topKind: 'shirt', legs: ['#5a5048', '#443c36', '#2e2824'], hairStyle: 'bald', hairCol: HAIRS[8], face: 'tache', tache: '#a8a8ac', shoe: '#1c1814' },
    cafeman1: { skin: 4, robe: ['#6a6a5a', '#4e4e40', '#38382c'], head: 'skullcap', headCol: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], face: 'stubble', shoeKind: 'sandals', shoe: '#5c3418' },
    cafeman2: { skin: 5, top: ['#c8a060', '#a88040', '#886020'], topKind: 'shirt', legs: CLOTH.indigo, hairStyle: 'short', hairCol: HAIRS[8], face: 'tache', tache: '#c8c8c8', shoe: '#1c1814' },
});
const villager = (e, map) => { map.people.push(e); return e; };
const personAt = (map, x, y, id, label, look, dir) => villager(World.addEnt(map, { x, y, w: 0, d: 0, id, label, person: { sheet: personSheet(typeof look === 'string' ? LOOKS[look] : look), dir: dir || 0, frame: 0 }, sortY: y }), map);

// ---- the café ----
ROOMS.INT_CAFE = {
    name: 'THE CAFÉ', tw: 12, th: 7, style: 'office',
    enter: ['System', 'The ahwa, inside: a tin ceiling, a fan, mirrors fogged with forty years of smoke, the football on a television bolted high in the corner, and men who have been sitting in the same chairs since before the match started, and possibly since before it was invented.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(0, 0, pw, W, '#e8dcc0'); A.r(0, W - 18, pw, 18, '#2e7a58'); A.hl(0, W - 18, pw, '#58a878'); A.r(0, 0, pw, 4, '#b8a888');
        for (const mx of [30, pw - 90]) { A.r(mx, 10, 50, 28, '#8e5e32'); A.r(mx + 3, 13, 44, 22, '#c8d4dc'); A.line(mx + 6, 32, mx + 18, 16, '#ffffff'); }
        A.r((pw >> 1) - 16, 8, 32, 22, '#20242c'); A.r((pw >> 1) - 14, 10, 28, 16, '#3a70c8'); A.r((pw >> 1) - 8, 14, 12, 8, '#58a848'); A.px((pw >> 1) - 2, 16, '#ffffff');
        wall((pw >> 1) - 18, 36, null, { label: 'The Television', say: ['System', 'Ahly against Zamalek, a replay of a match from last season. Everybody knows how it ends. Everybody is watching anyway, and shouting at the referee, who can\'t hear them, because it was last season.'] });
        put(pw - 104, W + 6, FURN.counter(84), null, { label: 'The Counter', script: 'c1b_cafe' });
        put(40, W + 48, FURN1B.cafeTable()); put(110, W + 70, FURN1B.cafeTable()); put(200, W + 54, FURN1B.cafeTable()); put(60, ph - 64, FURN1B.cafeTable());
        put(180, ph - 56, FURN1B.shisha(), null, { label: 'Shisha', say: ['System', 'A shisha, lit, apple tobacco, gurgling to itself. Its owner has gone to the door to shout at somebody about a debt.'] });
        personAt(map, 58, W + 70, 'c1b_cafe_m1', 'Man', 'cafeman1', 3); personAt(map, 126, W + 92, 'c1b_cafe_m2', 'Man', 'cafeman2', 3); personAt(map, pw - 64, W + 54, 'c1b_cafe_waiter', 'Waiter', 'waiter', 0);
    },
};
Object.assign(STORY_SCRIPTS, { c1b_cafe_m1: 'c1b_cafe_m1', c1b_cafe_m2: 'c1b_cafe_m2', c1b_cafe_waiter: 'c1b_cafe_waiter' });
scene('c1b_cafe_m1', { speaker: 'Man', text: '"Penalty! That was a penalty! It was a penalty last season and it\'s a penalty now!" He doesn\'t take his eyes off the screen.', choices: [{ text: 'Move on.' }] });
scene('c1b_cafe_m2', { speaker: 'Man', text: '"The inspector from the hill. Sit. The tea here is terrible, and that\'s why we come: so we can complain about it."', choices: [{ text: 'Move on.' }] });
scene('c1b_cafe_waiter', { speaker: 'Waiter', text: 'A boy of twelve with a tray of tea glasses balanced on three fingers, moving between the tables like a dancer. "Tea? Coffee? Ful? The owner says ful." He\'s gone before you can answer.', choices: [{ text: 'Move on.' }] });

// ---- the bakery ----
ROOMS.INT_BAKERY = {
    name: 'THE BAKERY', tw: 10, th: 7, style: 'concrete',
    enter: ['System', 'The bakery, inside: heat like a wall, the domed oven roaring at the back, the smell of bread so strong you could lean on it. Flour on everything, including the baker, including you, now.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(0, 0, pw, W, '#e8dcc0'); for (let i = 0; i < 40; i++) A.px(hash2(i, 9) * pw | 0, hash2(9, i) * W | 0, '#fffaf0');
        const ov = [0, 1].map(f => FURN1B.oven(f)); put((pw >> 1) - 28, W + 2, { c: ov[0], frames: ov, fps: 2, ox: -1, oy: -31, solid: [0, 0, 56, 26], light: { x: 0, y: -10, r: 90, c: '#ffb060' } }, null, { label: 'The Oven', script: 'c1b_bakery' });
        put(30, W + 60, FURN1B.doughTable(), null, { label: 'Dough Table', say: ['System', 'Balls of dough resting under a cloth, rising as you watch. A boy slaps them flat on a paddle dusted with bran and slides them into the fire, ten at a time.'] });
        put(pw - 50, ph - 60, FURN1B.sacks(), null, { label: 'Flour Sacks', say: ['System', 'Sacks of flour from the government mill, stamped SUBSIDISED, NOT FOR RESALE. The baker sells the bread at the government price and the cakes at his own.'] });
        put(pw - 60, W + 50, FURN.breadCrate());
        personAt(map, 96, W + 96, 'c1b_bakeboy', 'Bakery Boy', 'bakeboy', 3);
    },
};
STORY_SCRIPTS.c1b_bakeboy = 'c1b_bakeboy';
scene('c1b_bakeboy', { speaker: 'Bakery Boy', text: '"Careful, Ustaz, it\'s hot. Everything here is hot." He grins, a face full of flour. "My uncle says the inspectors always want bread at the end of the day, when it\'s gone. You came early. You\'re a clever one."', choices: [{ text: 'Move on.' }] });

// ---- the mosque ----
ROOMS.INT_MOSQUE = {
    name: 'THE MOSQUE', tw: 13, th: 8, style: 'maqam',
    enter: ['System', 'You leave your shoes at the door with the others. Inside, carpet underfoot, cool and quiet, the light green through the windows. Ceiling fans turn slowly. The traffic and the market and the football fall away.'],
    build({ map, A, put, wall, pw, ph, W }) {
        const mx = pw >> 1; A.r(mx - 16, 6, 32, W - 8, '#3e8a58'); A.ell(mx, 10, 16, 12, '#3e8a58'); A.r(mx - 12, 12, 24, W - 14, '#2a6440'); A.ell(mx, 14, 12, 9, '#2a6440');   // the mihrab
        for (let i = 0; i < 5; i++) A.px(mx - 6 + i * 3, 18, '#f0c040');
        wall(mx - 18, 36, null, { label: 'The Mihrab', say: ['System', 'The mihrab: a niche in the wall facing Mecca, tiled in green, a line of gold script above it. Everyone in the room faces it. Above Saqqara the old kings faced the northern stars; here the village faces south-east, toward the Kaaba.'] });
        for (let r = 0; r < 4; r++) A.r(16, W + 20 + r * 30, pw - 32, 24, r % 2 ? '#b03030' : '#a02828');
        for (let r = 0; r < 4; r++) for (let i = 16; i < pw - 16; i += 24) A.poly([[i + 4, W + 20 + r * 30 + 22], [i + 12, W + 20 + r * 30 + 4], [i + 20, W + 20 + r * 30 + 22]], '#c84040');
        put(mx + 30, W - 2, FURN1B.minbar(), null, { label: 'The Minbar', say: ['System', 'The minbar, carved wood, a stair to a little pulpit with a green cap, where the imam stands for the Friday sermon. Today\'s is Tuesday. On Tuesdays it holds a broom.'] });
        personAt(map, 70, W + 74, 'c1b_imam', 'The Imam', 'imam', 3);
        personAt(map, mx - 40, W + 104, 'c1b_praying', 'A Man Praying', 'prayer', 3);
    },
};
STORY_SCRIPTS.c1b_imam = 'c1b_imam'; STORY_SCRIPTS.c1b_praying = 'c1b_praying';
scene('c1b_imam', { speaker: 'The Imam', text: () => `The imam, an old man with a grey beard and kind, short-sighted eyes, is folding prayer mats. "Inspector. Peace be upon you." He looks at you a moment longer than he needs to. "You have the face of somebody carrying something heavy. Sit, if you like. Nobody asks questions here."` + (sflag('ch1b_tomb_story') ? `\n\n"Umm Sabry's stories? My grandmother told me the same ones. The magician, the book. Leave the book where it is, that's the lesson. Nobody ever learns it."` : ''), choices: [{ text: 'Sit a while. (half an hour)', onSelect: () => c1aRest(30, 'c1a_rested') }, { text: '"Peace be upon you."' }] });
scene('c1b_praying', { speaker: 'System', text: 'A man praying, alone, in the middle of the carpet, his lips moving. You leave him be.', choices: [{ text: 'Move on.' }] });

// ---- the garage ----
ROOMS.INT_GARAGE = {
    name: 'THE GARAGE', tw: 11, th: 7, style: 'tin',
    enter: ['System', 'The garage, inside: oil, rubber, a radio playing Abdel Halim to nobody, and in the middle of it all the red Fiat, its bonnet up like a mouth at the dentist\'s.'],
    build({ map, A, put, wall, pw, ph, W }) {
        WALLART.calendar(A, 40, 12); A.r(90, 10, 60, 30, '#3a3226'); for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) A.px(94 + i * 6, 14 + j * 6, '#5a4c38');
        A.r(96, 14, 2, 14, '#a8b0b8'); A.r(104, 13, 8, 3, '#a8b0b8'); A.r(118, 16, 5, 4, '#d04838'); A.r(130, 13, 2, 16, '#a8b0b8'); A.r(138, 15, 6, 6, '#c89020');
        wall(88, 64, null, { label: 'Tool Board', say: ['System', 'Spanners, sockets, a hammer, a mallet and something that might be a dentist\'s tool, every one hanging in its painted outline. Two outlines are empty. "Borrowed," says a note, "by Samir. SAMIR."'] });
        put((pw >> 1) - 40, W + 34, FURN1B.car(), 'c1b_fiat', { label: 'The Red Fiat', script: 'c1b_fiat' });
        put(20, ph - 64, FURN.radioTable(), null, { label: 'Radio', say: ['System', 'A radio with a coat hanger for an aerial, playing Abdel Halim Hafez singing about a love that\'s over. The mechanic sings along when he thinks nobody\'s listening.'] });
        put(pw - 50, W + 10, FURN.jerrycans()); put(pw - 46, ph - 70, FURN.burnBin());
    },
};
STORY_SCRIPTS.c1b_fiat = () => Story.s.tasks.some(t => t.id === 'c1b_receipt' && !t.done) ? 'c1b_glovebox' : 'c1b_fiat';
scene('c1b_fiat', { speaker: 'System', text: 'An old red Fiat 128, older than you, its bonnet up, its engine in pieces on a sheet of cardboard beside it, each piece laid out in order like an archaeologist\'s finds. The mechanic knows exactly where everything goes. He says.', choices: [{ text: 'Move on.' }] });

// ---- the village houses: seven families ----
const HOUSE_FOLK = [
    ['A Grandmother', 'grandma', 'A grandmother on the kanaba, shelling peas into a bowl. "Inspector! Sit, sit. My grandson wants to work for the Ministry. Tell him it\'s a good job. Lie if you have to."'],
    ['A Mother', 'mother', 'A woman ironing in front of the television. "Shoes off, ya Ustaz. No, keep them on, the floor is a disgrace, the children. Tea? There\'s always tea."'],
    ['An Old Man', 'oldvillager', 'An old man with a radio on his knee and his eyes closed. "I was a digger for the French, before the war. Which war? All of them." He opens one eye. "They never paid us properly either."'],
    ['A Young Wife', 'youngwife', 'A young woman with a baby on her hip and a phone in her other hand. "My husband works at the Teti dig. Rais Gad says he is the laziest man in Saqqara. Rais Gad is right." She laughs.'],
    ['A Student', 'student', 'A young man at a table buried in books: ENGLISH FOR TOURISM, HIEROGLYPHS FOR BEGINNERS. "I want to be a guide. Or an inspector. Which pays better?" You tell him. He looks at the books again, sadly.'],
    ['A Grandmother', 'grandma2', 'An old woman making bread dough in a wide basin. "The tomb with the river painted on it? My mother would never let us play near that corner. Never. She never said why." She slaps the dough. "Eat."'],
    ['A Father', 'father', 'A man in a vest watching football with the sound off. "My brother-in-law has a motorbike like Samy\'s. Exactly like Samy\'s. He paid for it for five years." He shrugs. "Samy paid for it in one day. Strange world."'],
];
for (let k = 1; k <= 7; k++) {
    const [who, look, line] = HOUSE_FOLK[k - 1];
    ROOMS['INT_HOUSE' + k] = {
        name: 'A HOUSE IN MIT RAHINA', tw: 10, th: 7, style: k % 2 ? 'office' : 'concrete',
        build({ map, A, put, wall, pw, ph, W }) {
            const R = rng('house' + k), SOFA = [['#e8c060', '#c8a040', '#a88020', '#7a5c14'], ['#7aa8d8', '#5a88b8', '#3a6898', '#264a70'], ['#d87a7a', '#b85a5a', '#984040', '#702c2c']][k % 3];
            // on the wall: the Kaaba, a family photograph, a calendar from the Ministry of Electricity
            A.r(30, 12, 24, 18, '#c89020'); A.r(32, 14, 20, 14, '#20242c'); A.hl(32, 18, 20, '#f0c040'); wall(28, 28, null, { label: 'A Picture', say: ['System', k % 2 ? 'A framed picture of the Kaaba at Mecca, the Hajj of somebody\'s father, 1998, in gold letters underneath.' : 'A family photograph, a wedding, everyone stiff in their best clothes except one small boy pulling a face at the camera. The small boy is the father of the house now.'] });
            WALLART.calendar(A, pw - 60, 14);
            put(16, W + 4, FURN1B.kanaba(Math.round(pw * 0.42), SOFA)); put(pw - 30 - Math.round(pw * 0.3), W + 4, FURN1B.kanaba(Math.round(pw * 0.3), SOFA));
            put((pw >> 1) - 13, W + 44, FURN1B.tabliya(), null, { label: 'Low Table', script: 'c1b_house_eat' });
            put(pw - 40, ph - 76, k === 7 || R() < 0.4 ? FURN.tv() : FURN.fridge()); put(14, ph - 64, FURN.fan());
            put((pw >> 1) - 50, W + 34, FURN.rug(100, 56, [PAL.red, PAL.blue, PAL.green || PAL.red, PAL.gold || PAL.blue][k % 4]));
            // what the family is doing, as the line says
            const X = {
                1: () => put(pw - 70, W + 60, FURN1B.basin(), null, { label: 'A Bowl of Peas', say: ['System', 'A wide bowl of fresh peas, half shelled, the empty pods in a heap on a newspaper.'] }),
                2: () => put(pw - 86, W + 58, FURN1B.ironing(), null, { label: 'Ironing Board', say: ['System', 'An ironing board, a hissing iron, and a mountain of school shirts, every one white, every one about to be grey again by noon.'] }),
                3: () => put(pw - 80, W + 56, FURN.radioTable(), null, { label: 'Radio', say: ['System', 'A radio older than the Ministry, playing the news from Cairo to a man who stopped believing it in 1967.'] }),
                4: () => put(pw - 80, W + 54, FURN1B.cot(), null, { label: 'Cot', say: ['System', 'A wooden cot with a baby in it, asleep with both fists up, like a boxer, in a heat that would flatten a camel.'] }),
                5: () => { put(pw - 96, W + 52, FURN.desk(60, false), null, { label: 'Desk of Books', say: ['System', 'A desk buried in books: ENGLISH FOR TOURISM, HIEROGLYPHS FOR BEGINNERS, A HISTORY OF THE PHARAOHS, and a maths textbook he is pretending he has finished.'] }); WALLART.bookShelf(A, (pw >> 1) + 30, 18); },
                6: () => put(pw - 80, W + 60, FURN1B.basin(), null, { label: 'Dough Basin', say: ['System', 'A wide basin of bread dough, punched down and rising again, a cloth over half of it.'] }),
                7: () => put(pw - 96, W + 60, FURN.chair(true), null, { label: 'His Chair', say: ['System', 'The father\'s chair, the only one in the house with arms, angled at the television like a gun at a target.'] }),
            }; X[k] && X[k]();
            if (k % 3 === 0) put(16, ph - 100, FURN.plant());
            const e = personAt(map, 70 + (k % 3) * 30, W + 40, 'c1b_hfolk' + k, who, look, 0); e.say = ['House', line];
        },
    };
    STORY_SCRIPTS['c1b_hfolk' + k] = 'c1b_hfolk';
}
scene('c1b_hfolk', { speaker: 'System', get text() { const k = +(Game.talkId || 'c1b_hfolk1').slice(-1); return HOUSE_FOLK[k - 1][2]; }, choices: [{ text: '"Shukran."' }] });
scene('c1b_house_eat', {
    speaker: 'System',
    get text() { const k = Game.map.key.slice(-1); return sflag('c1b_house_ate' + k) ? 'The low table, the glasses cleared. Somebody is already washing up.' : 'A low round table: tea glasses, a plate of bread, white cheese, a bowl of foul, salad, pickles. Whatever you say, a place is being made for you.'; },
    get choices() { const k = Game.map.key.slice(-1); return sflag('c1b_house_ate' + k) ? [{ text: 'Move on.' }] : [{ text: 'Eat with the family. (20 minutes)', onSelect: () => { sflag('c1b_house_ate' + k, true); eat(55, 'Bread, cheese, foul and tea'); drink(15); clockAdvance(20); rel('village', 1, true); } }, { text: '"Thank you, I\'ve eaten."' }]; },
});

// ---- the ghaffir's hut: the bench ----
ROOMS.INT_GHAFHUT = {
    name: 'THE GHAFFIR\'S HUT', tw: 7, th: 6, style: 'tin',
    enter: ['System', 'The ghaffir\'s hut: one room of mud brick, cool even at noon. A bench along the wall, a kettle on a gas ring, a radio, a shotgun older than the Ministry on two nails, and a calendar from 1997 that nobody has had the heart to take down.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(0, 0, pw, W, '#c8a070'); for (let i = 0; i < 60; i++) A.r(hash2(i, 5) * pw | 0, hash2(5, i) * W | 0, 3, 1, '#e8c890'); A.r(0, W - 6, pw, 6, '#8e6a44');   // mud plaster, straw in it
        A.r(40, 16, 40, 3, '#5e3620'); A.r(42, 12, 36, 3, '#3a3e48'); A.r(74, 10, 5, 6, '#5e3620');                                                       // the shotgun on its nails
        WALLART.calendar(A, pw - 50, 12);
        put(18, W + 2, FURN.bench(80), 'c1b_hutbench', { label: 'The Bench', script: 'c1b_hut' });
        put(pw - 50, W + 40, FURN.gasRing()); put(20, ph - 60, FURN.radioTable(), null, { label: 'Radio', say: ['System', 'The ghaffir\'s radio, tuned to the Qur\'an station, very low, all day and all night. He says it keeps the jinn away from the tombs. It seems to work.'] });
    },
};

// ---- the ticket kiosk ----
ROOMS.INT_KIOSK = {
    name: 'TICKET KIOSK', tw: 7, th: 6, style: 'concrete',
    enter: ['System', 'The museum\'s ticket kiosk: a window, a cash box, a fridge of cold drinks, a rack of postcards curling in the heat, and a ticket seller asleep with his head on the ticket roll.'],
    build({ map, A, put, wall, pw, ph, W }) {
        WALLART.tourPoster(A, 30, 10);
        put(pw - 40, W + 4, FURN1B.fridgeDrinks(), null, { label: 'Cold Drinks', script: 'c1b_kiosk_drink' });
        put(24, W + 50, FURN1B.postcards(), null, { label: 'Postcards', say: ['System', 'Postcards: the colossus, the sphinx, the Step Pyramid at sunset, and a camel wearing sunglasses, which is the best-seller.'] });
        personAt(map, (pw >> 1) - 4, W + 26, 'c1b_ticketman', 'Ticket Seller', 'ticketman', 0);
    },
};
STORY_SCRIPTS.c1b_ticketman = 'c1b_ticketman';
scene('c1b_ticketman', { speaker: 'Ticket Seller', text: 'He wakes up, sees your Ministry card, and goes back to sleep with a clear conscience.', choices: [{ text: 'Move on.' }] });
scene('c1b_kiosk_drink', { speaker: 'System', text: 'A fridge of cold drinks humming to itself: Pepsi, Fayrouz, bottles of water sweating in the cold.', choices: [{ text: 'A cold bottle of water. (5 EGP)', onSelect: () => { storyPay(-5, 'Cold water, the kiosk'); drink(45, 'A cold bottle of water'); } }, { text: 'Move on.' }] });

// ---- the Step Pyramid ----
ROOMS.INT_STEPPYR = {
    name: 'THE STEP PYRAMID · THE GREAT SHAFT', tw: 14, th: 8, style: 'rock',
    enter: ['System', 'Down the long sloping corridor from the south side, under four and a half thousand years of stone, into the heart of the first pyramid ever built. Wooden walkways, electric lights strung on cables, and then the floor opens into nothing.'],
    build({ map, A, put, wall, pw, ph, W }) {
        const E = ROOM.EDGE, sx = (pw >> 1) - 70, sy = W + 30, sw = 140, sh = 110;
        // the shaft: seven metres across, twenty-eight deep, the granite burial chamber at the bottom
        A.r(sx - 4, sy - 4, sw + 8, sh + 8, PAL.rock[3]); A.r(sx, sy, sw, sh, '#0a080c'); for (let k = 1; k < 6; k++) A.r(sx + k * 8, sy + k * 6, sw - k * 16, sh - k * 12, k % 2 ? '#141016' : '#0e0c12');
        A.r((pw >> 1) - 14, sy + sh / 2 - 8, 28, 18, '#5a5460'); A.r((pw >> 1) - 12, sy + sh / 2 - 6, 24, 4, '#7a7480'); A.r((pw >> 1) - 3, sy + sh / 2 - 6, 6, 4, '#2a2630');          // the granite chamber, its plug hole
        World.addSolid(map, sx, sy, sw, sh);
        for (let i = sx - 6; i < sx + sw + 6; i += 8) { A.vl(i, sy - 14, 12, '#8e5e32'); } A.r(sx - 6, sy - 16, sw + 12, 3, '#b8844c'); A.r(sx - 6, sy + sh + 4, sw + 12, 3, '#b8844c');   // the railing
        wall(sx, sw, null, { label: 'The Great Shaft', script: 'c1b_shaft_look' });
        put(sx + sw / 2 - 10, sy + sh + 8, { c: mk(20, 4)[0], ox: 0, oy: 0, flat: true }, null, { label: 'The Great Shaft', script: 'c1b_shaft_look' });
        // the blue faience tiles, on the walls of the corridors
        for (const fx of [16, pw - 96]) { A.r(fx, 8, 80, W - 14, PAL.rock[2]); for (let j = 0; j < 5; j++) for (let i = 0; i < 10; i++) { A.r(fx + 2 + i * 8, 10 + j * 8, 6, 6, (i + j) % 3 ? '#3a9ac0' : '#5ab8d8'); A.px(fx + 3 + i * 8, 11 + j * 8, '#a8e0f0'); } A.r(fx + 30, 14, 20, 26, '#2a6a90'); }
        wall(16, 80, null, { label: 'Blue Tiles', script: 'c1b_tiles' }); wall(pw - 96, 80, null, { label: 'Blue Tiles', script: 'c1b_tiles' });
        for (const [lx, ly] of [[40, W + 20], [pw - 40, W + 20], [40, ph - 50], [pw - 40, ph - 50]]) map.ents.push({ x: lx, y: ly, w: 0, d: 0, sortY: 0, light: { x: 0, y: 0, r: 70, c: '#ffe0a0' } });
    },
};
scene('c1b_shaft_look', { speaker: 'System', text: 'You lean on the railing and look down. Twenty-eight metres of nothing, cut straight down through the bedrock, and at the bottom, lit by one bulb, a chamber of pink granite with a round hole in its roof: the plug that sealed Djoser in. Robbers got in anyway. Robbers always get in.\n\nFour thousand six hundred and fifty years ago, Imhotep stood about where you\'re standing, and decided to put six mastabas on top of each other, and invented the pyramid.', choices: [{ text: 'Step back from the edge.', onSelect: () => { if (!sflag('c1b_shaft_seen')) { sflag('c1b_shaft_seen', true); skillXP('investigation', 20, 'the Step Pyramid'); } } }] });
scene('c1b_tiles', { speaker: 'System', text: 'Tiles of blue faience, thousands of them, set into the walls in rows to look like woven reed mats: the walls of a palace for the king\'s spirit, made of the colour of the Nile and the sky. Four and a half thousand years, and still that blue.', choices: [{ text: 'Move on.' }] });

// the buildings the story keeps you out of: say so
Object.assign(STORY_SCRIPTS, { c1b_hebsed: 'c1b_hebsed_look' });
scene('c1b_hebsed_look', { speaker: 'System', text: 'The Heb-Sed chapels: a row of little shrines for the king\'s jubilee, and every one of them solid. Their doors are carved half open, stone doors leading into stone. Imhotep built them for a spirit, and a spirit doesn\'t need to go inside.', choices: [{ text: 'Move on.' }] });

// ---- resting at Umm Sabry's corner ----
STORY_SCRIPTS.c1b_teacorner = 'c1b_teacorner_rest';
scene('c1b_teacorner_rest', {
    speaker: 'System',
    text: () => Story.s.clock < 21 * 60 ? `Umm Sabry's corner: two plastic chairs, a kettle, a tray of glasses, a tin of sugar the size of a drum. It is ${clockStr()}.` : `Umm Sabry's corner, empty for the night, the kettle cold, the chairs stacked. It is ${clockStr()}.`,
    get choices() { return Story.s.clock < 21 * 60 ? [{ text: 'Sit with a glass of tea. (an hour passes)', onSelect: () => c1aRest(60, 'c1a_rested') }, { text: 'Get up.' }] : [{ text: 'Move on.' }]; },
});

// ---- the phone ----
PHONE_CALLS.push(
    { name: 'Director Fathi (office)', when: () => Game.player.bg === 'inspector' && !sflag('ch1_complete'), scene: 'c1b_call_fathi' },
    { name: 'Umm Sabry', when: () => Game.player.bg === 'inspector' && !!sflag('ch1b_umsabry_network'), scene: 'c1b_call_umsabry' },
);
scene('c1b_call_fathi', {
    speaker: 'Director Fathi',
    text: () => Story.s.clock >= 21 * 60 ? `It rings and rings in the empty office. Then a click, and the answering machine, in the Director's careful voice: "The inspectorate is closed. In an emergency, it can wait until the morning."` : !sflag('c1b_fathi') ? `"Inspector. You're calling me from my own yard. Come in. After tea."` : sflag('c1b_round_done') ? `"You've done the round. Good. Write it up. In triplicate. Don't call me about it." Click.` : `"The round, Inspector. The seals. That is what the Ministry pays you for." Click.`,
    choices: [{ text: 'Hang up.' }],
});
scene('c1b_call_umsabry', {
    speaker: 'Umm Sabry',
    text: () => Story.s.clock >= 21 * 60 ? `"At this hour? Somebody had better be dead." A pause. "Nobody is dead? Then go to sleep, Inspector. And whatever you're doing tonight, do it quietly. The whole village listens at night."` : sflag('c1b_codex') ? `"You look like somebody carrying something heavy, my nephew says. Don't tell me. Just carry it carefully."` : `"Samy has been on the phone all morning, my cousin at the café says. Whispering. Samy never whispers. He shouts, like a man selling insurance." She hangs up before you can thank her.`,
    choices: [{ text: '"Shukran, Umm Sabry."' }],
});
(function () {
    const Ar = AREAS.inspector, _frame = Ar.frame;
    Ar.frame = function (dt) {
        _frame.call(this, dt);
        const c = Story.s.clock;
        if (c >= 12 * 60 && !sflag('c1b_msg_noon')) { sflag('c1b_msg_noon', true); storyMessage('Ministry (Giza Directorate)', 'REMINDER: monthly seal reports for all sites are due on Thursday. Late reports will be noted.'); }
        if (c >= 19 * 60 + 30 && !sflag('c1b_msg_mum')) { sflag('c1b_msg_mum', true); storyMessage('Mama', 'Did you eat? You never eat when you are at that place. There is molokhia in the fridge for when you come home. Call your aunt.'); }
    };
})();

// ---- where the compass points, now that some things are indoors ----
Object.assign(TASK_TARGETS, {
    c1b_night: () => Game.map.key === 'INT_SERAPEUM' ? { room: 'INT_SERAPEUM', id: 'c1b_cabinet', out: 'c1b_serapeum' } : nightNow() ? 'c1b_serapeum' : { room: 'INT_GHAFHUT', id: 'c1b_hutbench', out: 'c1b_ghafhut' },
    c1b_note: () => ({ room: 'INT_GHAFHUT', id: 'c1b_hutbench', out: 'c1b_ghafhut' }),
    c1b_receipt: () => ({ room: 'INT_GARAGE', id: 'c1b_fiat', out: 'c1b_garage' }),
});
