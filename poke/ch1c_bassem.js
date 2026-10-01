// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-C, BEAT 2: BASSEM'S OFFER (poke/ch1c_bassem.js)
// story/regions/ch01_opening_fixer.md, beat 2: "Hear the job at his seafront
// villa. He's polite and terrifying. He mentions the client's security chief,
// 'a German woman who doesn't laugh.'"
//   the villa gate opens at half past four (wait for five in the shade of the
//   wall, once Zaki and Rana know); the garden; the villa inside (the terrace,
//   the mango juice, the phone face down); the job: the truck at ten, Zaki's
//   dhow, a ship offshore, a Swiss foundation, nobody opens the package.
//   Then the three prep tasks of beat 3, and the truck stop at ten.
// Nobody new is named: Bassem's nephew (his sister's boy, the bible's side
// quest SQ-01C-05) brings the ice, and his man stands by the door.
// ============================================================

Object.assign(LOOKS, {
    c1c_bassem: { skinCol: SKINS[6], top: ['#fbf8f0', '#ece6da', '#d4ccbc'], topKind: 'shirt', legs: ['#e8dcc0', '#ccbea0', '#aa9c80'], hairStyle: 'short', hairCol: HAIRS[8], face: 'goatee', beard: '#d8d8d0', acc: 'chain', wide: true, shoe: '#6a4a2c' },
    c1c_nephew: { skinCol: SKINS[5], top: CLOTH.black, topKind: 'shirt', legs: ['#3a3e48', '#2a2e36', '#1c1e24'], botKind: 'jeans', hairStyle: 'short', hairCol: HAIRS[0], kid: true, shoeKind: 'sneakers', shoe: '#f4f4f0' },
});

// ---- the gate: shut until half past four, then open until you've had the offer and gone ----
const VILLA = { yard: [57, 47, 14, 9] };
function c1cInYard() { const p = Game.player, [x, y, w, h] = VILLA.yard; return Game.map === Game.maps.ch1 && p.x > x * TILE && p.x < (x + w) * TILE && p.y > y * TILE + 20 && p.y < (y + h) * TILE; }
function c1cGateWanted() { const c = Story.s.clock; return !!sflag('c1c_summoned') && c >= 16 * 60 + 30 && c < 24 * 60 && (!sflag('c1c_offer') || c1cInYard() || (Game.map && Game.map.key === 'INT_VILLA')); }
function c1cGate() {
    const m = Game.maps.ch1, g = m && m.ents.find(e => e.id === 'c1c_vgate');
    if (!g) return;
    if (!g.sprShut) {
        g.sprShut = g.spr; g.sprOpen = SPR_L['villa gate'](g.w, g.d, { open: true }); g.isOpen = false;
        const pil = { villaPillars: true }; World.addSolid(m, g.x, g.y + g.d - 10, 12, 10, pil); World.addSolid(m, g.x + g.w - 6, g.y + g.d - 10, 12, 10, pil);   // the pillars stay put
    }
    const open = c1cGateWanted();
    if (g.isOpen !== open) { g.isOpen = open; g.spr = open ? g.sprOpen : g.sprShut; World.setSolid(m, g, !open); }
}
function c1cOutsideGate() { const g = Game.maps.ch1.ents.find(e => e.id === 'c1c_vgate'); return [g.x + g.w / 2, g.y - 14]; }

// ---- the door: the villa's middle arch ----
(function () {
    const L0 = marsaLayout;
    marsaLayout = function () { const L = L0(); L.doors.push(['c1c_villa', 0.5, 'INT_VILLA', "Bassem's Villa"]); return L; };
})();

// ---- the gate man (replaces his "five o'clock" from beat 1) ----
scene('c1c_vguard', {
    speaker: "Bassem's Man",
    text: () => {
        const c = Story.s.clock;
        if (sflag('c1c_offer')) return `"Mr. Bassem has said what he had to say." He looks at his watch, then at you. "Ten o'clock. The truck stop. He doesn't like late, either."`;
        if (c >= 18 * 60) return `"You're late." He doesn't move out of the gateway at once. "Mr. Bassem has been waiting since five. Mr. Bassem doesn't like waiting. Mr. Bassem has never had to learn." He steps aside. "Go up. The terrace."`;
        if (c >= 17 * 60) return `He talks into his radio, listens, and steps aside. "Go up. He's on the terrace."`;
        if (c >= 16 * 60 + 30) return `He looks at his watch and almost smiles. "Early. Good. Mr. Bassem likes early." He pushes the gate open with one finger. "Go up. He's on the terrace."`;
        return `Bassem's man at the gate looks at you, at his watch, and at you again. "Five o'clock. Not before. Mr. Bassem is eating, and when Mr. Bassem is eating, the sea waits."` + (sflag('c1c_zaki') && sflag('c1c_rana') ? '' : `\n\n(You've time to kill. Zaki at the harbour, Rana at her shop: they should hear it from you first.)`);
    },
    get choices() {
        const c = Story.s.clock;
        if (!sflag('c1c_offer') && c < 16 * 60 + 30 && sflag('c1c_zaki') && sflag('c1c_rana')) return [{ text: 'Sit in the shade of the wall and wait for five.', onSelect: () => Game.fadeTo(() => { clockAdvance(17 * 60 - Story.s.clock); if (Game.set.time === 5) Game.hour = storyHour(); c1cGate(); startDialogue('c1c_vguard_five'); }) }, { text: 'Go.' }];
        return [{ text: 'Go.' }];
    },
});
scene('c1c_vguard_five', {
    speaker: 'System',
    text: `You sit with your back to Bassem's wall while its shadow crawls out across the sand. The guard smokes. A cat comes, considers you, and leaves. Out on the reef the dive boat comes in, and the fishing boats go out, and the call to prayer goes up from the mosque and comes down again.\n\nAt five exactly the radio on his belt says something. He opens the gate. "Go up. He's on the terrace."`,
    choices: [{ text: 'Go in.' }],
});

// ---- the villa inside ----
const FURNV = {
    glassTable() {                                                 // a round glass table: the mango juice, two glasses, the phone face down
        const st = stage(40, 22, 16), { A } = st, x = st.x, y = st.y - 10;
        A.r(x + 19, y + 14, 3, 14, '#c8ccd0'); A.ell(x + 20, y + 28, 8, 3, '#a8b0b8');
        A.ell(x + 20, y + 12, 20, 9, '#b8dce8'); A.ell(x + 20, y + 11, 19, 8, '#dff2f8'); A.ell(x + 14, y + 9, 8, 3, '#ffffff');
        A.r(x + 8, y + 2, 7, 10, '#f0a030'); A.r(x + 8, y + 2, 7, 3, '#ffd060'); A.vl(x + 14, y + 4, 8, '#c87818'); A.r(x + 15, y + 4, 2, 4, '#d8e4ea');   // the jug of mango
        for (const gx of [x + 20, x + 26]) { A.r(gx, y + 6, 4, 6, '#f6b848'); A.hl(gx, y + 6, 4, '#ffffff'); }
        A.r(x + 29, y + 13, 8, 5, '#1c1e24'); A.px(x + 30, y + 14, '#5a6068');   // the phone, face down
        return fit(st, { solid: [2, 6, 36, 14] });
    },
    rattanChair() { const st = stage(16, 12, 16), { A } = st, x = st.x, y = st.y - 14; A.r(x + 1, y, 14, 14, '#f0e8d4'); for (let j = y + 2; j < y + 14; j += 3) A.hl(x + 2, j, 12, '#d8ccb0'); A.r(x, y + 12, 16, 8, '#f4ecd8'); A.r(x + 2, y + 13, 12, 5, '#3a70c8'); A.hl(x + 2, y + 13, 12, '#5a90e0'); A.r(x + 1, y + 20, 2, 6, '#c8b890'); A.r(x + 13, y + 20, 2, 6, '#c8b890'); return fit(st, { solid: [1, 2, 14, 10] }); },
    telescope() { const st = stage(20, 10, 34), { A } = st, x = st.x + 8, y = st.y - 30; A.line(x, y + 14, x - 8, y + 38, '#5c3418'); A.line(x, y + 14, x + 8, y + 38, '#5c3418'); A.line(x, y + 14, x, y + 36, '#804c28'); A.line(x - 6, y + 12, x + 10, y + 4, '#c89020'); A.line(x - 6, y + 13, x + 10, y + 5, '#a07018'); A.line(x - 5, y + 11, x + 9, y + 3, '#f0c040'); A.r(x + 9, y + 2, 3, 4, '#f0c040'); A.r(x - 8, y + 12, 3, 3, '#20242c'); return fit(st, { solid: [2, 0, 16, 10] }); },
    bougainvillea() { const st = stage(20, 12, 26), { A } = st, x = st.x, y = st.y - 24; A.poly([[x + 4, y + 24], [x + 16, y + 24], [x + 14, y + 36], [x + 6, y + 36]], '#c86a3a'); A.r(x + 3, y + 23, 14, 3, '#e08a5a'); A.ell(x + 10, y + 13, 10, 11, '#3e8a30'); for (let i = 0; i < 16; i++) A.r(x + 2 + Math.floor(hash2(i, 7) * 15), y + 4 + Math.floor(hash2(7, i) * 17), 2, 2, i % 3 ? '#d8389a' : '#f070c0'); return fit(st, { solid: [3, 0, 14, 12] }); },
    sofa(w) {                                                      // white leather, too white for anyone with children or a past
        const st = stage(w, 22, 14), { A } = st, x = st.x, y = st.y - 12;
        A.r(x, y, w, 14, '#e4e0d8'); A.hl(x, y, w, '#ffffff'); for (let i = 4; i < w - 4; i += 26) A.r(x + i, y + 2, 22, 10, '#f4f2ec');
        A.r(x, y + 14, w, 14, '#f4f2ec'); A.hl(x, y + 14, w, '#ffffff'); A.r(x, y + 26, w, 4, '#c8c4bc'); A.r(x - 2, y + 4, 6, 24, '#e4e0d8'); A.r(x + w - 4, y + 4, 6, 24, '#e4e0d8');
        A.r(x + 8, y + 6, 10, 9, '#3a70c8'); A.r(x + w - 20, y + 6, 10, 9, '#c89020');   // cushions, blue and gold
        return fit(st, { solid: [0, 2, w, 20] });
    },
    coffeeTable() { const st = stage(44, 20, 8), { A } = st, x = st.x, y = st.y - 4; A.r(x + 2, y + 14, 3, 8, '#c89020'); A.r(x + 39, y + 14, 3, 8, '#c89020'); A.r(x, y + 2, 44, 14, '#b8dce8'); A.r(x + 1, y + 3, 42, 12, '#dff2f8'); A.hl(x, y + 2, 44, '#ffffff'); A.ell(x + 14, y + 9, 7, 4, '#c89020'); for (let i = 0; i < 5; i++) A.r(x + 9 + i * 2, y + 7 + (i % 2), 2, 3, '#6a3a1c'); A.r(x + 28, y + 6, 10, 7, '#d04838'); A.hl(x + 28, y + 6, 10, '#f07860'); return fit(st, { solid: [0, 2, 44, 16] }); },
    flatTV() {                                                     // a television the size of a garage door: the football, with the sound off
        const frames = [0, 1].map(f => { const st = stage(60, 14, 34), { A } = st, x = st.x, y = st.y - 32; A.r(x, y + 34, 60, 12, '#f4f2ec'); A.hl(x, y + 34, 60, '#ffffff'); A.r(x + 4, y + 38, 24, 5, '#d8d4cc'); A.r(x + 32, y + 38, 24, 5, '#d8d4cc');
            A.r(x + 6, y, 48, 30, '#16181c'); A.r(x + 8, y + 2, 44, 26, '#3a9a48'); A.vl(x + 30, y + 2, 26, '#7ac888'); A.ell(x + 30, y + 15, 6, 6, '#7ac888'); A.ell(x + 30, y + 15, 5, 5, '#3a9a48');
            for (const [px, py, c] of [[14, 8, '#ffffff'], [20, 20, '#d04838'], [38, 10, '#ffffff'], [44, 22, '#d04838'], [26, 14, '#d04838']]) A.r(x + px + (f ? 2 : 0), y + py + (f ? (px & 2) - 1 : 0), 2, 3, c);
            A.px(x + 32 + (f ? -6 : 4), y + 13 + (f ? 4 : 0), '#ffffff'); A.r(x + 28, y + 30, 4, 4, '#20242c'); return outline(st.c); });
        return { c: frames[0], frames, fps: 2, ox: -1, oy: -35, solid: [0, 0, 60, 14], light: { x: 0, y: -16, r: 60, c: '#a0ffb0' } };
    },
    jawCase() {                                                    // a shark's jaw in a glass case on a plinth
        const st = stage(22, 14, 34), { A } = st, x = st.x, y = st.y - 32; A.r(x + 2, y + 24, 18, 22, '#2c3440'); A.hl(x + 2, y + 24, 18, '#46505e'); A.r(x + 6, y + 34, 10, 2, '#c89020');
        A.r(x, y, 22, 24, '#cfe6f0'); A.r(x + 1, y + 1, 20, 22, '#e6f4fa'); A.vl(x + 3, y + 2, 20, '#ffffff');
        A.ell(x + 11, y + 12, 8, 7, '#f0e8d4'); A.ell(x + 11, y + 12, 5, 4, '#e6f4fa'); for (let a = 0; a < 10; a++) { const t = Math.PI * 2 * a / 10, px = x + 11 + Math.cos(t) * 6, py = y + 12 + Math.sin(t) * 5; A.px(px, py, '#ffffff'); A.px(px + (Math.cos(t) < 0 ? 1 : -1), py, '#c8bca0'); }
        return fit(st, { solid: [0, 0, 22, 14] });
    },
    barCart() { const st = stage(30, 14, 20), { A } = st, x = st.x, y = st.y - 18; A.r(x, y + 8, 30, 3, '#c89020'); A.r(x, y + 24, 30, 3, '#c89020'); A.vl(x + 1, y + 8, 22, '#a07018'); A.vl(x + 28, y + 8, 22, '#a07018'); A.ell(x + 4, y + 30, 3, 3, '#20242c'); A.ell(x + 26, y + 30, 3, 3, '#20242c');
        for (const [bx, c] of [[4, '#f0a030'], [10, '#d04838'], [16, '#58a848'], [22, '#f0c040']]) { A.r(x + bx, y, 4, 8, c); A.r(x + bx + 1, y - 2, 2, 2, '#f4f4f0'); A.vl(x + bx, y + 1, 6, '#ffffff'); }
        A.r(x + 6, y + 16, 12, 8, '#c8ccd0'); A.ell(x + 12, y + 16, 6, 2, '#f4f8fa'); for (let i = 0; i < 4; i++) A.r(x + 8 + i * 2, y + 14, 2, 2, '#ffffff'); A.r(x + 21, y + 17, 6, 7, '#f6b848'); return fit(st, { solid: [0, 4, 30, 10] }); },
    rug(w, d) { const st = stage(w, d, 0), { A } = st, x = st.x, y = st.y; A.r(x, y, w, d, '#e8dcc0'); A.r(x + 4, y + 4, w - 8, d - 8, '#2a4a7a'); A.r(x + 6, y + 6, w - 12, d - 12, '#34588c'); A.ell(x + (w >> 1), y + (d >> 1), 20, 13, '#2a4a7a'); A.ell(x + (w >> 1), y + (d >> 1), 15, 9, '#c89020'); A.ell(x + (w >> 1), y + (d >> 1), 11, 6, '#34588c'); for (const [cx, cy] of [[10, 10], [w - 11, 10], [10, d - 11], [w - 11, d - 11]]) A.r(x + cx - 2, y + cy - 2, 5, 5, '#c89020'); return Object.assign(fit(st), { c: st.c, flat: true }); },
    cat() {                                                         // a white Persian on a velvet cushion, looking at you like an invoice
        const frames = [0, 1].map(f => { const st = stage(26, 14, 10), { A } = st, x = st.x, y = st.y - 6;
            A.ell(x + 13, y + 12, 13, 6, '#8a1c3a'); A.ell(x + 13, y + 11, 12, 5, '#b02848'); A.px(x + 2, y + 15, '#c89020'); A.px(x + 24, y + 15, '#c89020');
            A.ell(x + 13, y + 7, 9, 6, '#f8f6f0'); A.ell(x + 12, y + 5, 6, 3, '#ffffff'); A.ell(x + 6, y + 4, 5, 5, '#f8f6f0'); A.px(x + 3, y - 1, '#f8f6f0'); A.px(x + 8, y - 1, '#f8f6f0'); A.px(x + 3, y, '#f0b8b8'); A.px(x + 8, y, '#f0b8b8');
            A.px(x + 4, y + 4, f ? '#f8f6f0' : '#3a8ac8'); A.px(x + 8, y + 4, f ? '#f8f6f0' : '#3a8ac8'); A.px(x + 6, y + 6, '#e89898');
            A.ell(x + 21 + f, y + 9 - f, 4, 2, '#f8f6f0'); return outline(st.c); });
        return { c: frames[0], frames, fps: 0.5, ox: -1, oy: -11, solid: [0, 4, 26, 10] };
    },
};

ROOMS.INT_VILLA = {
    name: "BASSEM'S VILLA", tw: 14, th: 10, style: 'villa',
    enter: ['System', 'Cold air hits you like a wall: the air conditioning in here could keep fish. White marble, white leather, a television the size of a garage door showing football with the sound off, and the whole back of the house slid open onto a terrace hanging over the sea.\n\nEverything in it is new, and everything in it cost exactly what you\'d think. You try not to work out how many of you it would take to pay for the sofa.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(300, 21, 34, 4, '#3a3e48'); A.r(324, 15, 7, 6, '#4a4e58'); A.r(304, 18, 16, 3, '#5a6068'); A.px(327, 13, '#3a3e48');   // a cargo ship on the horizon, waiting
        const TY = W + 78;                                          // the terrace: terracotta tiles, out to the balustrade
        A.r(8, W, pw - 16, TY - W, '#d88a5c'); for (let y = W; y < TY; y += 16) A.hl(8, y, pw - 16, '#c07448'); for (let y = W; y < TY; y += 16) for (let x = 8 + ((y - W) / 16 & 1) * 8; x < pw - 8; x += 16) A.vl(x, y, 16, '#c07448');
        for (let i = 0; i < 30; i++) A.px(10 + Math.floor(hash2(i, 13) * (pw - 20)), W + 2 + Math.floor(hash2(13, i) * (TY - W - 4)), '#e8a070');
        A.g.fillStyle = 'rgba(20,12,8,0.22)'; A.g.fillRect(8, W, pw - 16, 3);
        A.r(8, TY, pw - 16, 5, '#f4f4f0'); A.hl(8, TY, pw - 16, '#ffffff'); A.hl(8, TY + 4, pw - 16, '#c8ccd0');   // the marble step down into the house
        for (let x = 8; x < pw - 8; x += 112) { A.r(x, TY - 2, 4, 9, '#e8ecef'); A.vl(x + 3, TY - 2, 9, '#b8c0c8'); }   // the tracks of the glass doors
        wall(20, pw - 40, null, { label: 'The Sea', say: ['System', 'The terrace hangs right out over the water. Below, the reef, so clear you can count the fish; beyond it the sea, going out blue and flat to where a cargo ship sits on the horizon like a brick on a table. From up here you can see the whole harbour: Zaki\'s dhow, the fuel store, the coast guard post. Bassem can see everything that comes in or goes out of Marsa Tarfa without getting up from his juice.'] });
        // on the terrace
        put((pw >> 1) + 10, W + 22, FURNV.glassTable(), null, { label: 'The Table', say: ['System', 'A glass table: a jug of mango juice sweating in the heat, two glasses, a bowl of ice, and Bassem\'s phone, face down. It buzzes now and then. He never turns it over.'] });
        put((pw >> 1) - 10, W + 26, FURNV.rattanChair(), null, { label: 'A Chair', say: ['System', 'A white rattan chair with a blue cushion, set for a guest, facing the sea. The other one faces the door.'] });
        put((pw >> 1) + 54, W + 26, FURNV.rattanChair(), null, { label: 'A Chair', say: ['System', 'Bassem\'s chair: with its back to the sea, facing the door. He likes to see who comes in.'] });
        put(pw - 50, W + 10, FURNV.telescope(), null, { label: 'Telescope', say: ['System', 'A brass telescope on a tripod, the kind sea captains have in films. It isn\'t pointed at the stars. It\'s pointed at the coast guard post at the harbour mouth, and the patrol boat tied up beside it.'] });
        put(16, W + 6, FURNV.bougainvillea(), null, { label: 'Bougainvillea', say: ['System', 'Bougainvillea in a terracotta pot, flowering magenta, watered twice a day by somebody who is not Bassem. Nothing in Marsa Tarfa flowers like this. Nothing in Marsa Tarfa gets the water.'] });
        put(pw - 30, W + 44, FURNV.bougainvillea());
        // the salon
        put(18, TY + 46, FURNV.rug(150, 74));
        put(26, TY + 22, FURNV.sofa(110), null, { label: 'The Sofa', say: ['System', 'A white leather sofa, long enough to sleep a family, without a mark on it. You keep your salt-stained trousers well away from it. It feels like the kind of sofa that sends you an invoice.'] });
        put(62, TY + 64, FURNV.coffeeTable(), null, { label: 'Coffee Table', say: ['System', 'A glass coffee table: a silver bowl of Siwa dates, a box of Cuban cigars nobody smokes, and a yachting magazine in English, open at a page about a boat that costs more than the town.'] });
        put(140, TY + 30, FURNV.cat(), null, { label: 'A White Cat', say: ['System', 'A white Persian cat on a velvet cushion at the end of the sofa, with a jewelled collar and a face like a closed door. It watches you all the way across the room, blinks once, slowly, and goes back to owning the place.'] });
        put(pw - 86, TY + 16, FURNV.flatTV(), null, { label: 'Television', say: ['System', 'The football, Zamalek against Ahly, with the sound off. Ahly are winning. Somewhere in the house, someone is shouting about it.'] });
        put(pw - 110, TY + 70, FURNV.jawCase(), null, { label: 'A Shark\'s Jaw', say: ['System', 'A tiger shark\'s jaw in a glass case, a little brass plate under it: THE BROTHERS, 1998. Everybody calls Bassem the Shark. Nobody knows if he caught it himself, or bought it to go with the name. Nobody has ever asked.'] });
        put(pw - 50, TY + 70, FURNV.barCart(), null, { label: 'Bar Cart', say: ['System', 'A gold bar cart, and not a drop of alcohol on it: mango, guava, strawberry, lemon with mint, all fresh, all in crystal. Bassem doesn\'t drink. He says drink makes men honest, and honesty is bad for business.'] });
        put(pw - 34, TY + 18, FURN.plant());
        // the people
        personAt(map, (pw >> 1) + 96, W + 16, 'c1c_bassem', 'Bassem Nassar', 'c1c_bassem', 3);   // at the balustrade, his back to the room
        personAt(map, pw - 66, TY + 96, 'c1c_nephew', 'A Boy', 'c1c_nephew', 1);
        personAt(map, (pw >> 1) + 52, ph - 30, 'c1c_vman', "Bassem's Man", 'c1c_heavy1', 1);
    },
};

// ---- the people in the villa ----
STORY_SCRIPTS.c1c_nephew = 'c1c_nephew';
scene('c1c_nephew', {
    speaker: 'A Boy',
    text: () => sflag('c1c_offer')
        ? `The boy is polishing glasses that don't need it. He watches Bassem's man by the door out of the corner of his eye, the way he stands, the way he holds his hands, and stands the same way, nearly.`
        : `A thin boy of fifteen or so in a black shirt two sizes too big, the kind the men at the gate wear, standing by the bar cart as if someone told him to stand there and forgot about him. "Juice?" he says, and his voice breaks in the middle of it. He goes red to the ears.`,
    choices: [{ text: 'Leave him be.' }],
});
STORY_SCRIPTS.c1c_vman = 'c1c_vman';
scene('c1c_vman', {
    speaker: "Bassem's Man",
    text: () => sflag('c1c_offer') ? `The big one from this morning, still in the leather jacket, still smiling. "This way out." He doesn't say please. He doesn't have to.` : `The big one from this morning, in the same leather jacket, which in this air conditioning finally makes sense. He tips his head at the terrace. "He's waiting."`,
    choices: [{ text: 'Move on.' }],
});

// ---- Bassem ----
const BQ = { what: 'c1c_bq_what', who: 'c1c_bq_who', no: 'c1c_bq_no', hag: 'c1c_bq_hag' };
STORY_SCRIPTS.c1c_bassem = () => sflag('c1c_offer') ? 'c1c_bassem_after' : 'c1c_bassem';
scene('c1c_bassem', {
    speaker: 'Bassem Nassar',
    text: () => {
        const c = Story.s.clock, early = c < 17 * 60, late = c >= 18 * 60;
        return `Bassem Nassar is standing at his balustrade with his back to you, looking at the sea as if he's thinking of buying it. White linen, a gold chain, silver hair cut by a man who drives down from Hurghada to do it.\n\nHe turns, and smiles, and it's a very good smile. "Habibi. Come, come. Sit."` + (early ? ` He looks at his watch. "Early. I like early. Early is respect."` : late ? ` He looks at his watch. "I was starting to think you'd gone for a swim." The smile stays exactly where it is. "Like the Shahd."` : '');
    },
    choices: [{ text: 'Sit.', onSelect: () => c1cBassemArrive(), nextScene: 'c1c_bassem2' }, { text: '"I\'ll stand."', onSelect: () => c1cBassemArrive(), nextScene: 'c1c_bassem_stand' }],
});
function c1cBassemArrive() {
    if (sflag('c1c_bassem_at') != null) return;
    const c = Story.s.clock; sflag('c1c_bassem_at', c);
    if (c < 17 * 60) rel('bassem', 3, true); else if (c >= 18 * 60) rel('bassem', -3, true);
}
scene('c1c_bassem_stand', { speaker: 'Bassem Nassar', text: `"Stand, sit." He sits himself, in the chair facing the door. "It's the same sixty thousand."`, choices: [{ text: 'Sit.', nextScene: 'c1c_bassem2' }] });
scene('c1c_bassem2', {
    speaker: 'Bassem Nassar',
    text: `The boy from the bar cart brings a bowl of ice: fifteen, thin, in a black shirt two sizes too big. He puts it down without looking at you and nearly drops it.\n\n"My sister's boy," says Bassem fondly, watching him go. "He's learning the business."\n\nHe pours you a glass of mango juice. "From Ismailia. Nothing grows here, you know. Only fish, and debts." He drinks, and sets the glass down exactly in its own wet ring. "So. Let's talk about yours."`,
    choices: [{ text: 'Drink the juice. "Your men said a job."', onSelect: () => drink(25, 'Mango juice, ice cold'), nextScene: 'c1c_bassem3' }],
});
scene('c1c_bassem3', {
    speaker: 'Bassem Nassar',
    text: `"A small job. A delivery." He holds up one finger, the way his man did at your door this morning. "Tonight, at ten, a truck comes down from Cairo and stops at the truck stop on the highway. On it: a package. Not big. Not heavy.\n\nYou take it on Zaki's dhow," because of course he knows about Zaki, "out past the reef, to a ship. She'll be waiting outside the coast guard's water. You give them the package. You come home. You sleep.\n\nAnd in the morning," he spreads his hands, "the Shahd never happened. Sixty thousand: gone. Like the boat."`,
    choices: [{ text: 'Ask him about it.', nextScene: 'c1c_bassem_hub' }],
});
scene('c1c_bassem_hub', {
    speaker: 'Bassem Nassar',
    text: () => [BQ.what, BQ.who, BQ.no, BQ.hag].some(k => sflag(k)) ? `Bassem waits, turning his glass on the table. The phone beside it buzzes once, face down. He doesn't look at it.` : `Bassem leans back and waits, the way a man waits who has never in his life had to hurry.`,
    get choices() {
        const c = [];
        if (!sflag(BQ.what)) c.push({ text: '"What\'s in the package?"', onSelect: () => sflag(BQ.what, true), nextScene: 'c1c_bassem_what' });
        if (!sflag(BQ.who)) c.push({ text: '"Who\'s the client?"', onSelect: () => sflag(BQ.who, true), nextScene: 'c1c_bassem_who' });
        if (!sflag(BQ.hag)) c.push({ text: '[Haggling] "Sixty thousand is the boat. The diesel is extra."', onSelect: () => { sflag(BQ.hag, true); storyPay(500, 'From Bassem, for the diesel'); skillXP('haggling', 20, 'Bassem'); }, nextScene: 'c1c_bassem_hag' });
        if (!sflag(BQ.no)) c.push({ text: '"And if I say no?"', onSelect: () => sflag(BQ.no, true), nextScene: 'c1c_bassem_no' });
        c.push({ text: '"Fine. I\'ll do it."', nextScene: 'c1c_bassem_yes' });
        return c;
    },
});
scene('c1c_bassem_what', {
    speaker: 'Bassem Nassar',
    text: `"I don't know." He says it simply, the way you'd say the sea is wet. "And I don't want to know. They pay me not to know, and I pay you not to know. It's a beautiful arrangement. Everybody is paid, and nobody knows anything."\n\nHe leans forward, and for a moment the smile isn't there at all. "Nobody opens the package. Not you. Not Zaki. Not the fish."`,
    choices: [{ text: '"Understood."', nextScene: 'c1c_bassem_hub' }],
});
scene('c1c_bassem_who', {
    speaker: 'Bassem Nassar',
    text: `"A foundation. Swiss." He says Swiss the way other men say gold. "Very respectable. Museums, scholarships, a website with photographs of children.\n\nTheir security chief comes with the truck. A German woman." He considers it. "She doesn't laugh. I told her a joke on the phone, a good one, the one about the camel and the customs man. Nothing. Like telling it to a fridge."\n\nHe laughs, enough for both of them. "Don't tell her any jokes."`,
    choices: [{ text: '"I don\'t know any jokes."', onSelect: () => storyNote('The client', 'A Swiss foundation: "museums, scholarships, a website with photographs of children." Their security chief comes with the truck tonight: "a German woman who doesn\'t laugh."'), nextScene: 'c1c_bassem_hub' }],
});
scene('c1c_bassem_hag', {
    speaker: 'Bassem Nassar',
    text: `Bassem stares at you. Then he laughs, a real one, and slaps the table so the glasses jump. "My men said you'd haggle with the angel of death. They're right!"\n\nHe takes a fold of notes out of his shirt pocket without counting it and drops it beside your glass. "For the diesel. Don't drink it."`,
    choices: [{ text: 'Pocket it.', nextScene: 'c1c_bassem_hub' }],
});
scene('c1c_bassem_no', {
    speaker: 'Bassem Nassar',
    text: `Bassem looks sad. Then he turns his phone over, at last, and slides it across the glass to you.\n\nA photograph: Rana's dive shop, this morning, the door open, Rana behind the counter with her tank log. He swipes. Zaki's dhow at the quay, taken from the breakwater. He swipes again. Your own door.\n\n"Marsa Tarfa is a small town," he says gently, and takes the phone back, and lays it face down again. "Everybody knows everybody. That's what I love about it."`,
    choices: [{ text: 'Say nothing.', nextScene: 'c1c_bassem_hub' }],
});
scene('c1c_bassem_yes', {
    speaker: 'Bassem Nassar',
    text: `"Of course you will." He stands and holds out his hand, and his grip is cool and dry and lasts a second too long. "Ten o'clock. The truck stop. Be early."\n\nHis phone buzzes on the table. He looks at it, and doesn't turn it over. "Cairo," he says. "Cairo talks so much."\n\nThen, as you turn to go: "And habibi. When you're out there in the dark, with the package in your lap, and you think, what's one little look?" The smile. "Don't."`,
    choices: [{ text: 'Go.', onSelect: () => c1cOfferDone() }],
});
scene('c1c_bassem_after', {
    speaker: 'Bassem Nassar',
    text: () => `Bassem is on the phone now, his back to you, his free hand making slow shapes at the sea. "Yes. Yes. Ten o'clock. My best man." He glances round at you, covers the phone, and mouths: "Go."`,
    choices: [{ text: 'Go.' }],
});
function c1cOfferDone() {
    sflag('c1c_offer', true); taskDone('c1c_bassem');
    Game.maps.INT_VILLA && (Game.maps.INT_VILLA.back = c1cOutsideGate());   // his man walks you out to the gate
    storyNote('Bassem Nassar', 'The job: tonight at ten a truck from Cairo brings a package to the truck stop on the highway. Zaki\'s dhow takes it out past the reef to a ship waiting offshore. The client is a Swiss foundation; their security chief, "a German woman who doesn\'t laugh," comes with the truck. Nobody opens the package. Do it, and the sixty thousand is gone.');
    storyNotice('One night, and you are even.');
    task('c1c_truck', 'The truck stop on the highway, at ten. Be early.');
    task('c1c_kit', 'Rana\'s diving kit, in case you have to ditch the package.');
    task('c1c_route', 'A way past the coast guard: buy the patrol times from a fisherman, or watch the patrol boat from the fort at dusk.');
    task('c1c_fuel', 'Diesel for the Umm Kalthoum: steal it from the fuel store on the quay, or pay for a fill.');
    Toast.show('Three things to sort before ten: diesel, a route, a diving kit. Esc → TASKS.', 6);
}

// ---- the hooks: the gate, the walk out, his messages ----
(function () {
    const A = AREAS.fixer, _frame = A.frame, _door = A.door, _watch = A.watch, _clock = A.clockPassed, _sync = A.sync;
    A.frame = function (dt) { _frame.call(this, dt); c1cGate(); };
    A.sync = function () { _sync.call(this); c1cGate(); };
    A.auditOpen = function () { sflag('c1c_summoned', true); Story.s.clock = 17 * 60; c1cGate(); };   // (for the audit: the gate at five)
    A.door = function (d) { if (d.to === 'INT_VILLA' && sflag('c1c_offer')) { Toast.show('Bassem has said what he had to say.'); return true; } return _door.call(this, d); };
    A.watch = function () { const w = _watch.call(this); return sflag('c1c_offer') && Story.s.clock < 22 * 60 ? ' Tuesday. The truck at ten.' : w; };
    A.clockPassed = function (a, b) {
        _clock.call(this, a, b);
        const at = t => a < t && b >= t;
        if (at(18 * 60 + 30) && sflag('c1c_summoned') && !sflag('c1c_offer')) storyMessage('B. Nassar', 'Habibi. The juice is getting warm. — B.');
        if (at(21 * 60 + 15) && sflag('c1c_offer')) storyMessage('B. Nassar', 'Ten o\'clock. Early is respect. — B.');
    };
})();

// ---- where the compass points ----
TASK_TARGETS.c1c_bassem = () => Story.s.clock >= 16 * 60 + 30 ? ({ room: 'INT_VILLA', id: 'c1c_bassem', out: 'c1c_villa' }) : 'c1c_vguard';
TASK_TARGETS.c1c_truck = () => 'c1c_truckcafe';
TASK_TARGETS.c1c_kit = () => ({ room: 'INT_DIVESHOP', id: 'c1c_rana', out: 'c1c_diveshop' });
TASK_TARGETS.c1c_route = () => 'c1c_fisherman';
TASK_TARGETS.c1c_fuel = () => 'c1c_fuelstore';
