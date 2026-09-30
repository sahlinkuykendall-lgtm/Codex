// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MORE ROOMS (poke/ch1_rooms.js)
// The buildings you could only look at from outside now have insides:
// the guard booth, the old Ministry post, Lindqvist's trailer, the dig
// shed (padlocked until the Rais opens the dig zone), the mess tent,
// Hana's tent and the sheikh's tomb. What each building said when you
// examined it is what you read the first time you step in; what used to
// happen at the door (the clipboard, the lamp at the tomb, bread and tea)
// happens at the thing inside it belongs to.
// The find store stays shut: the story opens it (ch1_scenes.js).
// ============================================================

Object.assign(FURN, {
    radioTable() {                                        // a little table: the transistor radio, the thermos
        const st = stage(26, 12, 16), { A } = st, x = st.x, y = st.y - 12;
        A.r(x, y + 6, 26, 6, PAL.wood[1]); A.hl(x, y + 6, 26, PAL.wood[0]); A.r(x, y + 12, 26, 3, PAL.wood[2]); A.r(x + 1, y + 15, 2, 9, PAL.wood[3]); A.r(x + 23, y + 15, 2, 9, PAL.wood[3]);
        A.r(x + 2, y, 12, 8, '#3a3e48'); A.r(x + 3, y + 1, 5, 4, '#1c1e24'); A.r(x + 9, y + 1, 4, 2, PAL.gold[1]); A.line(x + 13, y, x + 18, y - 5, PAL.metal[1]);
        A.r(x + 17, y - 2, 4, 10, PAL.metal[1]); A.r(x + 17, y - 2, 4, 2, PAL.red[1]); A.vl(x + 17, y, 8, PAL.metal[0]);
        return fit(st, { solid: [0, 4, 26, 8] });
    },
    gasRing() {                                           // a kettle on a gas ring, the blue bottle beside it
        const st = stage(22, 10, 14), { A } = st, x = st.x, y = st.y;
        A.r(x + 1, y - 6, 10, 14, PAL.blue[1]); A.ell(x + 6, y - 6, 5, 2, PAL.blue[0]); A.r(x + 4, y - 11, 4, 4, PAL.metal[2]); A.vl(x + 2, y - 5, 12, PAL.blue[0]);
        A.r(x + 12, y + 2, 9, 4, PAL.dark[2]); A.ell(x + 16, y - 1, 5, 4, PAL.metal[1]); A.ell(x + 15, y - 3, 3, 1, PAL.metal[0]); A.r(x + 15, y - 6, 2, 2, PAL.dark[2]); A.line(x + 20, y - 1, x + 22, y - 4, PAL.metal[2]);
        return fit(st, { solid: [0, 2, 22, 8] });
    },
    urn() {                                               // the steel tea urn on its stand, a glass by the tap
        const st = stage(22, 12, 26), { A } = st, x = st.x, y = st.y - 24;
        A.r(x, y + 18, 22, 5, PAL.wood[1]); A.hl(x, y + 18, 22, PAL.wood[0]); A.r(x + 1, y + 23, 2, 12, PAL.wood[3]); A.r(x + 19, y + 23, 2, 12, PAL.wood[3]);
        A.r(x + 4, y + 2, 14, 17, PAL.metal[1]); A.vl(x + 5, y + 2, 17, PAL.metal[0]); A.vl(x + 6, y + 2, 17, '#ffffff'); A.vl(x + 16, y + 2, 17, PAL.metal[2]); A.ell(x + 11, y + 2, 7, 2, PAL.metal[0]); A.r(x + 9, y - 1, 4, 2, PAL.dark[2]);
        A.r(x + 11, y + 13, 5, 2, PAL.dark[2]); A.px(x + 15, y + 15, PAL.blue[0]);
        A.r(x + 1, y + 14, 3, 4, '#ffffff'); A.px(x + 2, y + 16, '#c84830');
        return fit(st, { solid: [0, 4, 22, 8] });
    },
    breadCrate() {                                        // a crate of round loaves, a cloth thrown over half of it
        const st = stage(26, 12, 12), { A } = st, x = st.x, y = st.y - 10;
        crateAt(A, x, y + 4, 24, 0);
        for (const [bx, by] of [[4, 2], [11, 1], [18, 3], [8, 5], [15, 6]]) { A.ell(x + bx, y + by + 2, 4, 2, '#c89058'); A.ell(x + bx - 1, y + by + 1, 2, 1, '#e8b878'); }
        A.poly([[x + 13, y], [x + 25, y + 2], [x + 23, y + 8], [x + 11, y + 6]], '#f4efe4'); A.hl(x + 13, y, 11, '#ffffff'); A.line(x + 11, y + 6, x + 23, y + 8, '#c8c0a8');
        return fit(st, { solid: [0, 2, 24, 10] });
    },
    trestle(w) {                                          // the long mess table: glasses, a bowl, a newspaper under a glass
        const st = stage(w, 18, 10), { A } = st, x = st.x, y = st.y - 8;
        A.r(x, y, w, 16, '#e0b478'); for (let i = 0; i < w; i += 16) { A.vl(x + i, y, 16, '#c89a5c'); A.vl(x + i + 1, y, 16, '#f0cc90'); } A.hl(x, y, w, '#fff0d0');
        A.r(x, y + 16, w, 4, '#a8783c'); A.hl(x, y + 19, w, '#6e4a24'); for (const lx of [x + 3, x + w - 6]) A.r(lx, y + 20, 3, 6, '#8e5e32');
        for (let i = 12; i < w - 50; i += 18) { A.r(x + i, y + 4, 3, 5, '#ffffff'); A.px(x + i + 1, y + 7, '#c84830'); }
        A.r(x + w - 40, y + 3, 18, 10, '#f4f0e4'); A.r(x + w - 38, y + 5, 12, 1, PAL.metal[2]); A.r(x + w - 38, y + 7, 9, 1, PAL.metal[2]); A.r(x + w - 30, y + 8, 4, 4, '#ffffff');
        A.ell(x + 30, y + 9, 6, 3, PAL.metal[1]); A.ell(x + 30, y + 8, 5, 2, '#e6ecf0');
        return fit(st, { solid: [0, 2, w, 16] });
    },
    bench(w) { const st = stage(w, 8, 8), { A } = st, x = st.x, y = st.y - 6; A.r(x, y, w, 5, WOOD[0]); A.hl(x, y, w, '#f0cc90'); A.hl(x, y + 4, w, WOOD[3]); A.r(x + 2, y + 5, 3, 8, WOOD[2]); A.r(x + w - 5, y + 5, 3, 8, WOOD[2]); return fit(st, { solid: [0, 0, w, 8] }); },
    fridge() {
        const st = stage(18, 12, 26), { A } = st, x = st.x, y = st.y - 24;
        A.r(x, y, 18, 36, '#f4f4f0'); A.r(x, y, 18, 2, '#ffffff'); A.vl(x + 17, y, 36, '#c8c8c0'); A.hl(x, y + 12, 18, '#c8c8c0'); A.r(x + 14, y + 4, 2, 6, '#98a2ae'); A.r(x + 14, y + 16, 2, 8, '#98a2ae');
        A.r(x + 3, y + 4, 6, 4, PAL.blue[1]); A.r(x + 3, y + 18, 5, 5, '#f0c040'); A.r(x + 9, y + 20, 3, 3, PAL.red[1]);   // magnets
        return fit(st, { solid: [0, 0, 18, 12] });
    },
    counter(w) {                                          // a kitchenette: a sink, a coffee maker with a pot of real coffee
        const st = stage(w, 14, 22), { A } = st, x = st.x, y = st.y - 12;
        A.r(x, y, w, 8, '#e8e0cc'); A.hl(x, y, w, '#ffffff'); A.r(x, y + 8, w, 18, '#b88448'); for (let i = 0; i < w; i += 14) { A.vl(x + i, y + 8, 18, '#8e5e32'); A.r(x + i + 10, y + 14, 2, 3, PAL.metal[2]); }
        A.ell(x + w - 12, y + 4, 6, 3, PAL.metal[2]); A.ell(x + w - 12, y + 4, 4, 2, PAL.metal[3]); A.r(x + w - 13, y - 4, 2, 5, PAL.metal[2]);
        A.r(x + 6, y - 8, 10, 12, '#2a2e36'); A.r(x + 7, y - 2, 8, 5, '#e8eef2'); A.r(x + 8, y + 1, 6, 2, '#5a3a20'); A.r(x + 20, y - 2, 5, 6, '#ffffff'); A.r(x + 20, y, 5, 2, PAL.blue[1]);
        return fit(st, { solid: [0, 2, w, 12] });
    },
    letters() {                                           // a folding table: the Ministry's letters, unopened, a mug on top
        const st = stage(26, 12, 14), { A } = st, x = st.x, y = st.y - 10;
        A.r(x, y + 4, 26, 6, PAL.metal[1]); A.hl(x, y + 4, 26, PAL.metal[0]); A.r(x + 1, y + 10, 2, 10, PAL.metal[3]); A.r(x + 23, y + 10, 2, 10, PAL.metal[3]);
        for (let k = 0; k < 5; k++) { A.r(x + 5 + (k & 1), y + 6 - k * 2, 14, 3, k & 1 ? '#f4f0e4' : '#ffffff'); A.px(x + 16 + (k & 1), y + 7 - k * 2, PAL.red[1]); }
        A.r(x + 20, y, 4, 5, '#ffffff'); A.hl(x + 20, y + 1, 4, '#6a4028');
        return fit(st, { solid: [0, 2, 26, 10] });
    },
    guffas() {                                            // black rubber buckets cut from tyres, stacked: every Egyptian dig runs on them
        const st = stage(30, 12, 14), { A } = st, x = st.x, y = st.y - 12;
        for (const [bx, by, n] of [[0, 8, 3], [15, 10, 2]]) for (let k = 0; k < n; k++) { const yy = y + by - k * 3; A.poly([[x + bx, yy], [x + bx + 14, yy], [x + bx + 12, yy + 10], [x + bx + 2, yy + 10]], '#2a2a2e'); A.ell(x + bx + 7, yy, 7, 2, '#44444a'); A.ell(x + bx + 7, yy, 5, 1, '#1a1a1e'); A.vl(x + bx + 2, yy + 1, 8, '#5a5a60'); }
        return fit(st, { solid: [0, 2, 30, 10] });
    },
    cenotaph() {                                          // the saint's tomb: a cenotaph under a green cloth, inside a railing worn smooth by hands
        const w = 76, st = stage(w, 40, 30), { A } = st, x = st.x, y = st.y;
        A.r(x, y - 18, w, 3, WOOD[1]); A.hl(x, y - 18, w, WOOD[0]); for (let i = 0; i < w; i += 6) A.vl(x + i, y - 15, 20, WOOD[2]);
        const bx = x + 12, by = y - 10, bw = 52;
        A.r(bx, by + 8, bw, 22, PAL.green[3]); A.poly([[bx, by + 8], [bx + bw, by + 8], [bx + bw - 4, by], [bx + 4, by]], PAL.green[2]); A.hl(bx + 4, by, bw - 8, PAL.green[1]);
        A.r(bx, by + 12, bw, 3, PAL.gold[1]); A.r(bx, by + 24, bw, 2, PAL.gold[2]); for (let i = 4; i < bw - 4; i += 8) { A.px(bx + i, by + 18, PAL.gold[0]); A.px(bx + i + 1, by + 19, PAL.gold[2]); }
        A.r(bx + bw / 2 - 3, by - 7, 6, 7, '#ffffff'); A.ell(bx + bw / 2, by - 7, 4, 3, '#ffffff'); A.hl(bx + bw / 2 - 3, by - 4, 6, PAL.green[2]);   // a turban on the headpost
        A.r(x, y + 22, w, 3, WOOD[1]); A.hl(x, y + 22, w, WOOD[0]); A.r(x, y + 36, w, 3, WOOD[2]);
        for (let i = 0; i < w; i += 6) { A.vl(x + i, y + 25, 11, WOOD[1]); A.vl(x + i + 1, y + 25, 11, WOOD[3]); }
        for (let i = 0; i < w - 6; i += 12) A.poly([[x + i + 3, y + 30], [x + i + 6, y + 27], [x + i + 9, y + 30], [x + i + 6, y + 33]], WOOD[0]);
        A.vl(x, y - 18, 57, WOOD[3]); A.vl(x + w - 1, y - 18, 57, WOOD[3]);
        for (const [rx, c] of [[8, PAL.red[1]], [30, PAL.green[1]], [50, PAL.white[0]], [66, PAL.blue[1]]]) { A.r(x + rx, y + 23, 2, 6, c); A.px(x + rx + 2, y + 28, c); }   // rags tied on: wishes
        return fit(st, { solid: [0, 0, w, 40] });
    },
});
Object.assign(WALLART, {
    clipboard(A, x, y) { A.px(x + 6, y - 3, PAL.metal[3]); A.r(x, y, 13, 17, PAL.wood[1]); A.r(x + 1, y + 2, 11, 14, '#ffffff'); for (let j = 4; j < 15; j += 2) A.r(x + 2, y + j, 8 - (j % 4), 1, PAL.dark[2]); A.r(x + 4, y - 1, 5, 3, PAL.metal[2]); },
    calendar(A, x, y) { A.r(x, y, 14, 18, '#ffffff'); A.r(x, y, 14, 5, PAL.red[1]); for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) A.px(x + 2 + i * 3, y + 8 + j * 3, PAL.dark[2]); A.px(x + 5, y + 11, PAL.red[1]); },
    bookShelf(A, x, y) { A.r(x, y + 10, 26, 3, WOOD[2]); A.hl(x, y + 10, 26, WOOD[0]); A.r(x + 3, y + 2, 10, 8, PAL.green[2]); A.hl(x + 3, y + 2, 10, PAL.green[1]); A.px(x + 7, y + 5, PAL.gold[1]); A.r(x + 16, y + 4, 6, 6, PAL.gold[2]); A.r(x + 17, y + 3, 4, 1, PAL.gold[1]); },
    swedish(A, x, y) { A.vl(x, y - 2, 14, PAL.metal[3]); A.r(x + 1, y, 16, 10, '#2f5fae'); A.r(x + 6, y, 2, 10, '#f0c040'); A.r(x + 1, y + 4, 16, 2, '#f0c040'); },
    acWindow(A, x, y) { A.r(x - 2, y - 2, 40, 30, '#a8b0ba'); A.r(x, y, 36, 26, '#9ed2f4'); A.r(x, y + 13, 36, 13, '#e8cf8e'); A.r(x + 4, y + 8, 28, 16, '#e6eaef'); A.hl(x + 4, y + 8, 28, '#ffffff'); for (let i = x + 6; i < x + 30; i += 2) A.vl(i, y + 11, 9, '#98a2ae'); A.r(x + 4, y + 22, 28, 3, '#86949e'); A.r(x - 3, y, 3, 26, '#d04838'); A.r(x + 36, y, 3, 26, '#d04838'); },
    tourPoster(A, x, y) { A.r(x, y, 28, 36, '#f4efe4'); A.r(x + 2, y + 2, 24, 22, '#a8cce0'); A.poly([[x + 4, y + 24], [x + 12, y + 10], [x + 20, y + 24]], '#e0c890'); A.poly([[x + 14, y + 24], [x + 20, y + 14], [x + 26, y + 24]], '#d0b478'); A.r(x + 2, y + 24, 24, 3, '#e8d8a8'); A.r(x + 4, y + 29, 20, 2, '#c85a48'); A.r(x + 7, y + 32, 14, 1, '#6a7888'); A.px(x + 14, y, PAL.metal[3]); },
    galabeya(A, x, y) { A.r(x, y, 30, 3, WOOD[3]); A.r(x + 14, y + 3, 2, 3, PAL.metal[3]); A.poly([[x + 9, y + 5], [x + 21, y + 5], [x + 24, y + 38], [x + 6, y + 38]], '#f4f0e4'); A.r(x + 3, y + 6, 6, 12, '#f4f0e4'); A.r(x + 21, y + 6, 6, 12, '#f4f0e4'); A.vl(x + 15, y + 7, 12, '#d8d0bc'); A.hl(x + 6, y + 38, 19, '#c8bea8'); A.vl(x + 22, y + 10, 26, '#e0d8c4'); },
    niche(A, x, y) {
        A.ell(x + 12, y + 8, 12, 8, '#d8d4c8'); A.r(x, y + 8, 24, 24, '#d8d4c8'); A.ell(x + 12, y + 9, 10, 7, '#3a2a20'); A.r(x + 2, y + 9, 20, 21, '#3a2a20');
        A.r(x + 8, y + 22, 8, 5, PAL.gold[1]); A.hl(x + 8, y + 22, 8, PAL.gold[0]); A.r(x + 10, y + 17, 4, 5, '#ffe890'); A.px(x + 11, y + 15, '#fff4b0'); A.px(x + 12, y + 16, '#ffc840');
        A.r(x - 2, y + 30, 28, 3, '#f6f4ec'); for (const cx of [x + 1, x + 19, x + 22]) { A.r(cx, y + 26, 2, 4, '#f4efe4'); A.px(cx, y + 25, PAL.fire[1]); }
    },
});
const roomLight = (map, x, y, r, c) => map.ents.push({ x, y, w: 0, d: 0, sortY: 0, light: { x: 0, y: 0, r, c: c || '#ffd890' } });

Object.assign(ROOMS, {
    INT_BOOTH: {
        name: 'THE GUARD BOOTH', tw: 7, th: 6, style: 'office',
        enter: ['System', "The guard booth: a chair, a transistor radio, a thermos, a Qur'an with a cloth cover, and a view of every road onto the site. Uncle Farouk's kingdom."],
        build({ map, A, put, wall, pw, ph, W }) {
            WALLART.calendar(A, 26, 14); wall(22, 20, null, { label: 'Calendar', say: ['System', 'A calendar from a spare-parts shop in Giza, a year out of date. Farouk says the days are the same, only the numbers change.'] });
            WALLART.bookShelf(A, 62, 18); wall(60, 28, null, { label: "Farouk's Qur'an", say: ['System', "A Qur'an in a green cloth cover, on its own shelf, above everything else in the room. Nothing is ever put on top of it."] });
            put((pw >> 1) - 34, W + 12, FURN.radioTable(), null, { label: 'Radio and Thermos', say: ['System', 'The transistor radio, tuned to Umm Kulthum, turned low. The thermos beside it is tea: black, stewed, with enough sugar in it to stand a spoon up.'] });
            put((pw >> 1) + 4, W + 26, FURN.chair(true), null, { label: "Farouk's Chair", say: ['System', 'A wooden chair with a cushion worn to the exact shape of Uncle Farouk. You don\'t sit in it. Nobody sits in it.'] });
            put(18, W + 8, FURN.gasRing(), null, { label: 'Kettle', script: 'c1a_booth_tea' });
            put(pw - 48, ph - 84, FURN.prayerMat());
            put(pw - 32, W + 4, FURN.lamp()); put(18, ph - 60, FURN.jerrycans());
        },
    },
    INT_MINPOST: {
        name: 'THE OLD MINISTRY POST', tw: 10, th: 7, style: 'concrete',
        enter: ['System', "An old Ministry of Antiquities post, a concrete hut with one window, abandoned when the new visitors' centre was built. Farouk keeps his spare galabeya in it."],
        build({ map, A, put, wall, pw, ph, W }) {
            WALLART.tourPoster(A, 30, 10); wall(28, 30, null, { label: 'Old Poster', say: ['System', 'A Ministry tourism poster from the nineties: EGYPT, GIFT OF THE NILE. The sky has faded to the colour of a swimming pool and the pyramids to the colour of sand, which is fair.'] });
            WALLART.galabeya(A, 84, 8); wall(84, 30, null, { label: "Farouk's Galabeya", say: ['System', "Farouk's spare galabeya on a hook, white, ironed, for Fridays. It smells of soap and of the cupboard it lived in for twenty years before this."] });
            WALLART.map(A, 134, 12); wall(132, 48, null, { label: 'Plateau Map (1996)', say: ['System', 'A Ministry map of the plateau from 1996, all the tombs numbered in faded biro. The Western Field is marked "SURVEYED". Someone has added, in pencil, "NOT ALL".'] });
            put(34, W + 44, FURN.desk(84, false), null, { label: 'Ministry Desk', say: ['System', 'A steel Ministry desk under a skin of dust. A rubber stamp, dried out. A ticket book: visitors, 1998, three pounds each. The last stub is torn out halfway through a Tuesday.'] });
            put(66, W + 28, FURN.chair(true));
            put(pw - 40, W + 4, FURN.cabinet(false), null, { label: 'Filing Cabinet', say: ['System', 'Files nobody has opened in twenty years: permits, complaints, a report on the Sphinx\'s neck in triplicate. The top drawer is Farouk\'s: a spare thermos, a torch, a packet of dates.'] });
            put(pw - 70, W + 4, FURN.cabinet(false));
            put(pw - 44, ph - 84, FURN.bed(PAL.olive), null, { label: 'Camp Bed', say: ['System', 'A camp bed with a folded blanket. Farouk swears he never sleeps on duty. The dent in the pillow disagrees.'] });
            put(18, ph - 64, FURN.fan(), null, { label: 'Fan', say: ['System', 'An electric fan, older than you, still turning. Nobody knows where it gets its electricity from and nobody wants to ask.'] });
            put(138, ph - 56, FURN.jerrycans()); put(186, W + 76, FURN.bookCrate(), null, { label: 'Boxes of Tickets', say: ['System', 'Unused visitor tickets, bundled with string, in boxes that say MINISTRY OF CULTURE: a ministry that stopped being in charge of antiquities before you were born.'] });
        },
    },
    INT_TRAILER: {
        name: "LINDQVIST'S TRAILER", tw: 11, th: 6, style: 'trailer',
        enter: ['System', "Lindqvist's trailer: an air conditioner rattling in the window, a Swedish flag sticker, and a stack of unopened Ministry letters on the step."],
        build({ map, A, put, wall, pw, ph, W }) {
            WALLART.acWindow(A, 50, 12); wall(46, 44, null, { label: 'Air Conditioner', say: ['System', 'The air conditioner rattles like a man with a bad cough, and drips steadily onto the step outside. It is exactly as hot in here as out there, only louder.'] });
            WALLART.swedish(A, 120, 14); WALLART.photos(A, 150, 12); wall(146, 46, null, { label: 'Photos', say: ['System', 'A lake, pine trees, a red wooden house. A woman and two children in life jackets, squinting into the sun. The photos are curling in the heat.'] });
            put(26, W + 42, FURN.desk(80, true), null, { label: 'His Laptop', say: ['System', 'A laptop open on a spreadsheet of the season\'s costs, most of the cells coloured red. A sticky note on the screen, underlined twice: RING THE FOUNDATION.'] });
            put(58, W + 28, FURN.chair(true));
            put(130, W + 64, FURN.letters(), null, { label: 'Ministry Letters', say: ['System', 'Letters from the Ministry, a stack of them, every one unopened. The oldest is six weeks old. A coffee mug is standing on top of them.'] });
            put(pw - 118, W + 2, FURN.counter(84), null, { label: 'Kitchenette', say: ['System', 'A coffee maker and a bag of beans from a roaster in Gothenburg. The only proper coffee within fifty kilometres, and he keeps it locked in a trailer.'] });
            put(pw - 140, W + 2, FURN.fridge(), null, { label: 'Fridge', script: 'c1a_trailer_fridge' });
            put(pw - 40, W + 60, FURN.bed(PAL.blue), null, { label: 'Bunk', say: ['System', 'A narrow bunk, a sleeping bag, a paperback in Swedish lying face down: a detective story. On the cover, a body in the snow.'] });
        },
    },
    INT_DIGSHED: {
        name: 'THE DIG SHED', tw: 9, th: 6, style: 'tin',
        enter: ['System', "The dig shed: picks and shovels racked on the wall, sieves stacked, the black rubber buckets every Egyptian dig runs on, and the smell of dust and diesel. Miriam's clipboard hangs on its nail."],
        build({ map, A, put, wall, pw, ph, W }) {
            WALLART.clipboard(A, 40, 22); wall(34, 26, 'digshed_clip', { label: 'Clipboard', script: 'c1a_digshed' });
            put(80, W + 2, SPR.c1m_toolrack(64, 16), null, { label: 'Tool Rack', say: ['System', 'Picks, shovels, trowels by size, a hand brush for every hand on the site. Every tool has a painted number, and every number is on a list in Miriam\'s writing.'] });
            put(pw - 66, W + 8, SPR.ow_sieve(32, 16), null, { label: 'Sieves', say: ['System', 'Sieve frames, stacked. Five-millimetre mesh and two-millimetre mesh, labelled. The two-millimetre ones are for the heaps nobody trusts.'] });
            put(20, ph - 70, FURN.findsTable(), null, { label: 'Finds Trays', say: ['System', 'Trays of the day\'s finds waiting for the register: sherds in labelled bags, a bead, a bent nail that somebody decided was Roman.'] });
            put(pw - 84, ph - 72, SPR.c1m_trenchkit(48, 24)); put(150, W + 56, FURN.guffas());
            put(170, ph - 50, SPR_L['tool box'](20, 14)); put(18, W + 4, FURN.lamp());
        },
    },
    INT_MESS: {
        name: 'THE MESS TENT', tw: 12, th: 7, style: 'tent',
        enter: ['System', 'The mess tent: an old army marquee, faded to the colour of the desert, open on the camp side. A long trestle table, two benches, a steel urn for tea water, a crate of bread under a cloth against the flies.\n\nSomebody has left a newspaper weighted down with a glass.'],
        build({ map, A, put, wall, pw, ph, W }) {
            WALLART.lantern(A, 60, 18); WALLART.lantern(A, pw - 60, 18); roomLight(map, 60, W, 110); roomLight(map, pw - 60, W, 110);
            put(70, W + 38, FURN.bench(240));
            put(70, W + 52, FURN.trestle(240), null, { label: 'Trestle Table', say: ['System', 'Al-Ahram, four days old, folded to the football and weighted down with a tea glass. Someone has done half the crossword in pencil and all of it in pen.'] });
            put(70, W + 92, FURN.bench(240));
            put(pw - 58, W + 4, FURN.urn(), null, { label: 'Tea Urn', script: 'c1a_mess_urn' });
            put(pw - 96, W + 12, FURN.breadCrate(), null, { label: 'Bread', script: 'c1a_mess_bread' });
            put(20, W + 4, FURN.jerrycans());
        },
    },
    INT_HANA: {
        name: "HANA'S TENT", tw: 10, th: 7, style: 'tent',
        enter: ['System', "Hana's tent: round, old, patched in three different canvases, with an awning propped on two poles to make a porch. A pair of dusty boots stands outside the flap, neatly side by side."],
        build({ map, A, put, wall, pw, ph, W }) {
            WALLART.photos(A, 40, 14); wall(38, 44, null, { label: 'Photos', say: ['System', 'Hana at other digs: Luxor, Aswan, a flooded tomb somewhere with her up to the knees in it, laughing. A very young Hana holding a trowel almost as big as she is.'] });
            WALLART.lantern(A, pw >> 1, 16); roomLight(map, pw >> 1, W, 120);
            put((pw >> 1) - 60, W + 70, FURN.rug(120, 60, PAL.blue));
            put(24, W + 10, FURN.findsTable(), null, { label: 'Conservation Table', say: ['System', 'Her conservation table: a sherd held together with tiny strips of tape while its glue cures, a tin of wax, scalpels in a row, a magnifier on an arm. Everything clean, everything labelled.'] });
            put(92, W + 2, FURN.lamp());
            put(pw - 58, W + 2, FURN.shelf(), null, { label: 'Chemicals', say: ['System', 'Bottles in neat rows: acetone, a consolidant, distilled water, a jar of Japanese tissue. And a red tin marked FIRST AID in three languages, the one she opens most.'] });
            put(pw - 40, W + 64, FURN.bed(PAL.red), null, { label: 'Cot', say: ['System', 'A cot made up with hospital corners. On the pillow, folded, a clean shirt for the morning.'] });
            put((pw >> 1) + 30, W + 84, FURN.teaTable()); put(20, ph - 60, FURN.trunk());
        },
    },
    INT_MAQAM: {
        name: "THE SHEIKH'S TOMB", tw: 7, th: 6, style: 'maqam',
        enter: ['System', 'Inside it is cool and smells of rosewater and old wax. The tomb fills the room: a cenotaph under a green cloth embroidered in gold, inside a wooden railing worn smooth by hands. Rags are tied to the railing, each one a wish. A lamp burns in a niche in the wall.'],
        build({ map, A, put, wall, pw, ph, W }) {
            WALLART.niche(A, 18, 10); wall(14, 30, null, { label: 'Lamp Niche', script: 'c1p_maqam' }); roomLight(map, 30, W - 20, 90, '#ffc870');
            put((pw >> 1) - 38, W + 34, FURN.cenotaph(), null, { label: 'The Tomb', say: ['System', 'Nobody in the village agrees who is buried here: a holy man, a holy woman, a soldier who was kind. The green cloth is new. Somebody replaces it every year and never says who.'] });
            put(pw - 48, ph - 86, FURN.prayerMat());
        },
    },
});

// the buildings with doors now; what used to happen on the doorstep happens inside
scene('c1a_booth_tea', {
    speaker: 'System',
    text: `A blackened kettle on a gas ring, still warm. Farouk's tea: black, stewed, with enough sugar in it to stand a spoon up.`,
    choices: [{ text: 'Pour yourself a glass. (He won\'t mind. Probably.)', onSelect: () => drink(15, 'Farouk\'s tea') }, { text: 'Leave it.' }],
});
scene('c1a_trailer_fridge', {
    speaker: 'System',
    text: `A little fridge, humming: bottled water, a jar of lingonberry jam, three bottles of Stella, a lemon going soft.`,
    choices: [{ text: 'Take a bottle of water.', onSelect: () => { const r = refill(); drink(35, 'Cold bottled water'); if (r) Notice.show(r.trim()); } }, { text: 'Close it.' }],
});
scene('c1a_mess_urn', {
    speaker: 'System',
    text: `The steel urn, dented, never empty. Hot water for tea at one end of the day, cold water at the other.`,
    choices: [{ text: 'Water from the urn.', onSelect: () => { const r = refill(); drink(35, 'Water from the urn'); if (r) Notice.show(r.trim()); } }, { text: 'Leave it.' }],
});
scene('c1a_mess_bread', {
    speaker: 'System',
    text: () => sflag('bread_at') != null && Story.s.clock - sflag('bread_at') < 120 ? `The bread under its cloth. You've had your share for now: the men will want theirs.` : `Round flat loaves of aish baladi in a crate, a cloth thrown over them against the flies. A day old, still good.`,
    get choices() {
        const c = [];
        if (!(sflag('bread_at') != null && Story.s.clock - sflag('bread_at') < 120)) c.push({ text: 'Tear off some bread. (5 minutes)', onSelect: () => { sflag('bread_at', Story.s.clock); eat(30, 'Aish baladi, a day old'); clockAdvance(5); } });
        c.push({ text: 'Leave it.' });
        return c;
    },
});
// the dig shed is padlocked until the Rais opens the dig zone
const _storyDoor = storyDoor;
storyDoor = function (d) {
    if (d.to === 'INT_DIGSHED' && !sflag('gate_open')) { startDialogue('c1a_digshed'); return true; }
    return _storyDoor(d);
};
