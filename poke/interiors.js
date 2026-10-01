// ============================================================
// THE CODEX OF GIZA — POKE STYLE: INTERIORS (poke/interiors.js)
// The three rooms you can walk into from the camp: Miriam's tent, the
// workers' dormitory and the site office. Each is a small room seen the
// DS way: the back wall stands up at the top, the floor is laid out
// below it, and you leave by the mat at the bottom.
// What each thing says comes from the 3D build (map_ch1.js → interiors).
// ============================================================

const ROOM = { WALL: 56, EDGE: 8 };

// ---- furniture ----
const FURN = {
    desk(w, laptop) {
        const st = stage(w, 22, 12), { A } = st, x = st.x, top = st.y - 8;
        A.r(x, top, w, 20, PAL.plank[0]); A.r(x, top, w, 2, PAL.canvas[0]); for (let i = 12; i < w; i += 16) A.vl(x + i, top + 2, 18, PAL.plank[1]);
        A.r(x, top + 20, w, 4, PAL.plank[2]); for (const lx of [x + 2, x + w - 5]) A.r(lx, top + 24, 3, 6, PAL.wood[3]);
        if (laptop) { A.r(x + 10, top + 4, 18, 11, PAL.metal[2]); A.r(x + 11, top + 5, 16, 6, PAL.dark[3]); A.r(x + 12, top + 12, 14, 2, PAL.metal[3]); }
        A.r(x + w - 22, top + 5, 10, 8, PAL.white[0]); A.r(x + w - 20, top + 7, 6, 1, PAL.metal[2]); A.r(x + w - 20, top + 9, 5, 1, PAL.metal[2]);
        A.r(x + w - 36, top + 9, 9, 7, PAL.white[1]); A.ell(x + (w >> 1) + 4, top + 12, 3, 2, PAL.white[0]); A.ell(x + (w >> 1) + 4, top + 12, 2, 1, PAL.wood[2]);   // a mug of tea
        return fit(st, { solid: [0, 4, w, 18] });
    },
    lamp() { const st = stage(10, 6, 18), { A } = st; A.r(st.x + 3, st.y - 4, 2, 8, PAL.dark[1]); A.r(st.x, st.y - 12, 9, 8, PAL.gold[0]); A.r(st.x, st.y - 13, 9, 2, PAL.dark[1]); A.r(st.x + 1, st.y + 3, 7, 2, PAL.dark[2]); return fit(st, { light: { x: 0, y: -10, r: 80, c: '#ffd890' } }); },
    bed(blanket, sleeper) {                               // a camp bed, head to the wall
        const w = 28, d = 46, st = stage(w, d, 4), { A } = st, x = st.x, y = st.y;
        A.r(x, y, w, d, PAL.metal[3]); A.r(x + 1, y + 1, w - 2, d - 3, PAL.white[1]);
        A.r(x + 3, y + 3, w - 6, 9, PAL.white[0]); A.r(x + 3, y + 11, w - 6, 1, PAL.white[2]);           // pillow
        A.r(x + 1, y + 16, w - 2, d - 19, blanket[1]); A.r(x + 1, y + 16, w - 2, 3, blanket[0]); A.vl(x + w - 3, y + 19, d - 22, blanket[2]);
        for (let j = 24; j < d - 6; j += 7) A.hl(x + 1, y + j, w - 2, blanket[2]);
        if (sleeper) { A.ell(x + (w >> 1), y + 8, 5, 5, PAL.skin[2]); A.r(x + (w >> 1) - 5, y + 3, 11, 4, PAL.dark[2]); A.r(x + (w >> 1) - 3, y + 8, 2, 1, PAL.dark[3]); A.r(x + (w >> 1) + 2, y + 8, 2, 1, PAL.dark[3]); A.ell(x + (w >> 1), y + 26, 9, 9, blanket[1]); A.ell(x + (w >> 1) - 2, y + 23, 5, 4, blanket[0]); }
        A.r(x, y + d - 2, w, 2, PAL.metal[3]); A.r(x + 1, y + d, 2, 3, PAL.dark[2]); A.r(x + w - 3, y + d, 2, 3, PAL.dark[2]);
        return fit(st, { solid: [0, 0, w, d - 2] });
    },
    bookCrate() { const st = stage(30, 16, 14), { A } = st, x = st.x, y = st.y - 12; A.r(x, y, 30, 12, PAL.wood[1]); A.r(x + 2, y + 2, 26, 10, PAL.dark[3]); const cols = [PAL.red[1], PAL.blue[1], PAL.green[2], PAL.gold[2], PAL.canvas[1], PAL.red[3], PAL.blue[3]]; for (let i = 0; i < 7; i++) A.r(x + 3 + i * 3.5, y + 3 + (i % 3 === 1 ? 1 : 0), 3, 9, cols[i]); A.r(x, y + 12, 30, 16, PAL.wood[1]); A.r(x, y + 12, 30, 1, PAL.wood[3]); for (let i = 5; i < 30; i += 6) A.vl(x + i, y + 13, 14, PAL.wood[2]); A.r(x + 8, y + 17, 12, 5, PAL.canvas[1]); return fit(st, { solid: [0, 2, 30, 14] }); },
    trunk() { const st = stage(34, 16, 10), { A } = st, x = st.x, y = st.y - 8; A.r(x, y, 34, 10, PAL.olive[1]); A.r(x, y, 34, 2, PAL.olive[0]); A.r(x, y + 10, 34, 13, PAL.olive[2]); A.r(x, y + 10, 34, 1, PAL.olive[3]); for (const bx of [x + 5, x + 27]) A.r(bx, y, 2, 23, PAL.wood[3]); A.r(x + 15, y + 12, 4, 4, PAL.gold[1]); return fit(st, { solid: [0, 2, 34, 14] }); },
    boots() { const st = stage(16, 8, 8), { A } = st, x = st.x, y = st.y - 6; for (const bx of [x, x + 8]) { A.r(bx + 1, y, 4, 9, PAL.wood[2]); A.r(bx, y + 9, 7, 4, PAL.wood[2]); A.r(bx, y + 12, 7, 1, PAL.dark[3]); A.r(bx + 1, y, 4, 2, PAL.wood[0]); } return fit(st); },
    easel() { const st = stage(32, 8, 40), { A } = st, x = st.x, y = st.y - 38; A.line(x + 4, y + 8, x, y + 44, PAL.wood[2]); A.line(x + 27, y + 8, x + 31, y + 44, PAL.wood[2]); A.r(x + 1, y, 30, 26, PAL.wood[1]); A.r(x + 2, y + 1, 28, 24, PAL.canvas[2]); const ph = [[3, 2, 9, 8], [14, 3, 8, 10], [23, 2, 6, 7], [4, 13, 8, 9], [14, 15, 12, 8]]; ph.forEach(([a, b, c, d], i) => { A.r(x + a, y + b, c, d, PAL.white[0]); A.r(x + a + 1, y + b + 1, c - 2, d - 3, [PAL.blue[0], PAL.sand[2], PAL.rock[2], PAL.sand[1], PAL.blue[2]][i]); A.px(x + a + (c >> 1), y + b, PAL.red[1]); }); return fit(st, { solid: [0, 0, 32, 8] }); },
    rug(w, d, P) { const st = stage(w, d, 0), { A } = st, x = st.x, y = st.y; A.r(x, y, w, d, P[1]); A.r(x + 3, y + 3, w - 6, d - 6, P[2]); A.dith(x + 3, y + 3, w - 6, d - 6, P[1], 0); for (let j = 8; j < d - 6; j += 10) A.r(x + 6, y + j, w - 12, 2, PAL.gold[1]); A.r(x, y, w, 2, PAL.blue[2]); A.r(x, y + d - 2, w, 2, PAL.blue[2]); for (let i = 1; i < w; i += 3) { A.px(x + i, y - 1, PAL.canvas[1]); A.px(x + i, y + d, PAL.canvas[1]); } for (let i = 10; i < w - 8; i += 16) { A.poly([[x + i, y + (d >> 1)], [x + i + 5, y + (d >> 1) - 5], [x + i + 10, y + (d >> 1)], [x + i + 5, y + (d >> 1) + 5]], PAL.canvas[0]); } return Object.assign(fit(st), { c: st.c, flat: true }); },
    tv() { const frames = [0, 1].map(f => { const st = stage(26, 14, 22), { A } = st, x = st.x, y = st.y - 20; crateAt(A, x + 3, y + 14, 20, 0); A.r(x, y, 26, 17, PAL.dark[2]); A.r(x + 2, y + 2, 22, 12, PAL.green[f ? 1 : 2]); A.r(x + 2, y + 7, 22, 1, PAL.white[0]); A.ell(x + 13, y + 8, 3, 3, PAL.green[f ? 2 : 1]); A.r(x + (f ? 6 : 17), y + (f ? 5 : 10), 2, 2, PAL.white[0]); A.line(x + 8, y - 0, x + 4, y - 5, PAL.metal[2]); A.line(x + 16, y, x + 21, y - 5, PAL.metal[2]); return outline(st.c); }); return { c: frames[0], frames, fps: 2, ox: -1, oy: -23, solid: [0, 0, 26, 12], light: { x: 0, y: -10, r: 60, c: '#a0ffb0' } }; },
    stool() { const st = stage(12, 8, 8), { A } = st; A.ell(st.x + 6, st.y - 4, 6, 3, PAL.plank[0]); A.r(st.x, st.y - 4, 13, 3, PAL.plank[1]); A.r(st.x + 1, st.y - 1, 2, 8, PAL.wood[3]); A.r(st.x + 10, st.y - 1, 2, 8, PAL.wood[3]); return fit(st, { solid: [1, 0, 10, 6] }); },
    pole(chalk) { const st = stage(8, 8, 60), { A } = st, x = st.x, y = st.y - 58; A.r(x + 1, y, 6, 66, PAL.wood[1]); A.vl(x + 1, y, 66, PAL.wood[0]); A.vl(x + 6, y, 66, PAL.wood[3]); if (chalk) for (let j = 0; j < 3; j++) { for (let i = 0; i < 4; i++) A.vl(x + 2 + i, y + 24 + j * 8, 5, PAL.white[0]); A.line(x + 1, y + 28 + j * 8, x + 6, y + 24 + j * 8, PAL.white[0]); } return fit(st, { solid: [0, 0, 8, 8] }); },
    bigDesk() {
        const w = 78, st = stage(w, 30, 14), { A } = st, x = st.x, top = st.y - 10;
        A.r(x, top, w, 26, PAL.wood[1]); A.r(x, top, w, 2, PAL.wood[0]); A.r(x + 3, top + 3, w - 6, 20, PAL.wood[0]); A.dith(x + 3, top + 3, w - 6, 20, PAL.wood[1], 0);
        A.r(x, top + 26, w, 14, PAL.wood[2]); A.r(x, top + 26, w, 1, PAL.wood[3]); A.r(x + 4, top + 29, 24, 8, PAL.wood[1]); A.r(x + w - 28, top + 29, 24, 8, PAL.wood[1]); A.r(x + 14, top + 32, 4, 1, PAL.gold[1]); A.r(x + w - 18, top + 32, 4, 1, PAL.gold[1]);
        A.r(x + 8, top + 6, 16, 12, PAL.white[0]); for (let j = 8; j < 17; j += 2) A.r(x + 10, top + j, 12, 1, PAL.metal[2]);              // the permit
        A.r(x + 30, top + 5, 18, 14, PAL.green[3]); A.r(x + 31, top + 6, 8, 12, PAL.white[1]); A.r(x + 40, top + 6, 7, 12, PAL.white[1]);      // sign-in book, open
        A.r(x + 54, top + 8, 9, 7, PAL.canvas[1]); A.r(x + 56, top + 5, 9, 7, PAL.canvas[0]);                                                   // a stack of forms
        A.r(x + 68, top + 4, 3, 10, PAL.dark[1]); A.r(x + 64, top + 1, 10, 5, PAL.green[1]); A.r(x + 64, top, 10, 1, PAL.green[3]);            // the banker's lamp
        return fit(st, { solid: [0, 4, w, 26], light: { x: 30, y: -8, r: 70, c: '#d8ffb0' } });
    },
    chair(back) { const st = stage(14, 10, 14), { A } = st, x = st.x, y = st.y - 12; if (back) A.r(x + 1, y, 12, 12, PAL.wood[2]); A.r(x, y + 10, 14, 8, PAL.red[2]); A.r(x, y + 10, 14, 2, PAL.red[1]); A.r(x + 1, y + 18, 2, 5, PAL.wood[3]); A.r(x + 11, y + 18, 2, 5, PAL.wood[3]); if (!back) A.r(x + 1, y + 14, 12, 6, PAL.wood[2]); return fit(st, { solid: [1, 2, 12, 8] }); },
    cabinet(ledger) { const st = stage(26, 14, 34), { A } = st, x = st.x, y = st.y - 32; A.r(x, y, 26, 12, PAL.metal[1]); A.r(x, y, 26, 2, PAL.metal[0]); A.r(x, y + 12, 26, 34, PAL.metal[2]); for (let j = 0; j < 3; j++) { A.r(x + 2, y + 14 + j * 11, 22, 9, PAL.metal[1]); A.r(x + 10, y + 17 + j * 11, 6, 2, PAL.metal[3]); } if (ledger) { A.r(x + 4, y + 2, 17, 8, PAL.red[3]); A.r(x + 5, y + 3, 15, 5, PAL.canvas[0]); A.r(x + 12, y + 3, 1, 5, PAL.red[3]); } return fit(st, { solid: [0, 0, 26, 14] }); },
    burnBin() { const frames = [0, 1].map(f => { const st = stage(16, 12, 20), { A } = st, x = st.x, y = st.y - 16; drum(A, x + 1, y + 4, [PAL.metal[2], PAL.dark[1], PAL.dark[2]]); A.ell(x + 7, y + 7, 5, 1, PAL.dark[3]); for (let i = -3; i <= 3; i += 3) A.vl(x + 7 + i, y + 6, 3, PAL.metal[3]); A.px(x + 5 + f * 3, y + 7, PAL.fire[2]); A.px(x + 8 - f, y - 1 - f * 2, PAL.metal[1]); A.px(x + 6 + f, y + 2 - f, PAL.metal[2]); return outline(st.c); }); return { c: frames[0], frames, fps: 2, ox: -1, oy: -21, solid: [1, 2, 14, 10] }; },
    cooler() { const st = stage(14, 10, 30), { A } = st, x = st.x, y = st.y - 28; A.ell(x + 7, y + 6, 6, 5, PAL.blue[0]); A.r(x + 1, y + 4, 13, 10, PAL.blue[0]); A.ell(x + 5, y + 4, 3, 2, PAL.white[0]); A.r(x + 1, y + 14, 13, 22, PAL.white[1]); A.r(x + 1, y + 14, 13, 2, PAL.white[3]); A.r(x + 4, y + 20, 2, 2, PAL.blue[1]); A.r(x + 9, y + 20, 2, 2, PAL.red[1]); return fit(st, { solid: [1, 0, 12, 10] }); },
    fan() { const frames = [0, 1].map(f => { const st = stage(16, 8, 30), { A } = st, x = st.x, y = st.y - 28; A.r(x + 7, y + 14, 2, 18, PAL.metal[2]); A.ell(x + 8, y + 33, 6, 2, PAL.metal[3]); A.ell(x + 8, y + 8, 8, 8, PAL.metal[3]); A.ell(x + 8, y + 8, 6, 6, PAL.white[1]); if (f) { A.line(x + 3, y + 8, x + 13, y + 8, PAL.metal[2]); A.line(x + 8, y + 3, x + 8, y + 13, PAL.metal[2]); } else { A.line(x + 4, y + 4, x + 12, y + 12, PAL.metal[2]); A.line(x + 12, y + 4, x + 4, y + 12, PAL.metal[2]); } A.px(x + 8, y + 8, PAL.dark[2]); return outline(st.c); }); return { c: frames[0], frames, fps: 12, ox: -1, oy: -31, solid: [3, 0, 10, 8] }; },
    locker(col) { const st = stage(16, 12, 38), { A } = st, x = st.x, y = st.y - 36; A.r(x, y, 16, 10, col[0]); A.r(x, y + 10, 16, 38, col[1]); A.r(x, y + 10, 16, 1, col[2]); A.vl(x + 15, y + 10, 38, col[2]); for (let j = 0; j < 3; j++) A.r(x + 4, y + 14 + j * 2, 8, 1, col[2]); A.r(x + 11, y + 28, 2, 4, PAL.dark[2]); A.r(x + 1, y + 46, 3, 2, PAL.dark[3]); A.r(x + 12, y + 46, 3, 2, PAL.dark[3]); return fit(st, { solid: [0, 0, 16, 12] }); },
    teaTable() { const st = stage(26, 14, 10), { A } = st, x = st.x, y = st.y - 8; A.ell(x + 13, y + 7, 13, 7, PAL.gold[2]); A.ell(x + 13, y + 6, 12, 6, PAL.gold[1]); A.ell(x + 12, y + 5, 8, 3, PAL.gold[0]); A.r(x + 12, y + 13, 2, 8, PAL.wood[3]); A.r(x + 5, y + 18, 16, 2, PAL.wood[3]); A.ell(x + 9, y + 4, 3, 3, PAL.metal[1]); A.r(x + 8, y, 2, 2, PAL.metal[2]); A.line(x + 12, y + 3, x + 14, y + 1, PAL.metal[2]); A.r(x + 15, y + 5, 2, 3, PAL.white[0]); A.r(x + 19, y + 6, 2, 3, PAL.white[0]); A.px(x + 15, y + 6, PAL.brick[2]); return fit(st, { solid: [2, 2, 22, 12] }); },
    washstand() { const st = stage(20, 12, 18), { A } = st, x = st.x, y = st.y - 16; A.r(x, y + 6, 20, 5, PAL.wood[1]); A.r(x, y + 11, 20, 3, PAL.wood[2]); A.r(x + 1, y + 14, 2, 13, PAL.wood[3]); A.r(x + 17, y + 14, 2, 13, PAL.wood[3]); A.ell(x + 7, y + 7, 6, 3, PAL.white[1]); A.ell(x + 7, y + 7, 4, 2, PAL.blue[0]); A.r(x + 14, y, 4, 8, PAL.white[0]); A.r(x + 14, y, 4, 2, PAL.white[2]); A.px(x + 18, y + 3, PAL.white[2]); A.r(x + 4, y + 18, 12, 6, PAL.white[1]); A.r(x + 4, y + 18, 12, 1, PAL.blue[1]); return fit(st, { solid: [0, 2, 20, 10] }); },
    shelf() { const st = stage(38, 12, 40), { A } = st, x = st.x, y = st.y - 38; A.r(x, y, 38, 50, PAL.wood[2]); A.r(x + 2, y + 2, 34, 46, PAL.dark[3]); for (let j = 0; j < 3; j++) { const yy = y + 14 + j * 16; A.r(x + 1, yy, 36, 2, PAL.wood[1]); } const items = [[PAL.brick[1], 8, 9], [PAL.canvas[1], 9, 7], [PAL.brick[2], 6, 10], [PAL.white[1], 8, 6], [PAL.olive[1], 10, 8], [PAL.rock[1], 7, 7], [PAL.canvas[0], 9, 9], [PAL.blue[2], 5, 10], [PAL.red[2], 6, 8]]; items.forEach(([c, w, h], i) => { const col = i % 3, row = i / 3 | 0; A.r(x + 4 + col * 11, y + 14 + row * 16 - h, w, h, c); A.r(x + 4 + col * 11, y + 14 + row * 16 - h, w, 1, PAL.white[0]); }); return fit(st, { solid: [0, 0, 38, 12] }); },
    plant() { const st = stage(16, 10, 30), { A } = st, x = st.x, y = st.y - 28; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.1 + i * 0.133), l = 13 + (i % 3) * 3; A.line(x + 8, y + 20, x + 8 + Math.cos(a) * l * 0.8, y + 20 + Math.sin(a) * l, PAL.green[i % 2 ? 1 : 2]); A.line(x + 8, y + 19, x + 8 + Math.cos(a) * l * 0.8, y + 19 + Math.sin(a) * l, PAL.green[i % 2 ? 0 : 1]); } A.poly([[x + 3, y + 22], [x + 13, y + 22], [x + 11, y + 36], [x + 5, y + 36]], PAL.brick[1]); A.r(x + 2, y + 21, 12, 3, PAL.brick[0]); A.vl(x + 11, y + 24, 12, PAL.brick[3]); return fit(st, { solid: [2, 0, 12, 10] }); },
    prayerMat() { const st = stage(26, 40, 0), { A } = st, x = st.x, y = st.y; A.r(x, y, 26, 40, PAL.green[2]); A.r(x + 2, y + 2, 22, 36, PAL.green[3]); A.r(x + 5, y + 10, 16, 26, PAL.green[1]); A.ell(x + 13, y + 10, 8, 6, PAL.green[1]); A.ell(x + 13, y + 11, 5, 4, PAL.gold[1]); A.r(x + 8, y + 12, 11, 20, PAL.gold[1]); A.r(x + 10, y + 14, 7, 16, PAL.green[2]); for (let i = 1; i < 26; i += 3) { A.px(x + i, y - 1, PAL.gold[0]); A.px(x + i, y + 40, PAL.gold[0]); } return Object.assign(fit(st), { c: st.c, flat: true }); },
    jerrycans() { const st = stage(22, 10, 16), { A } = st, x = st.x, y = st.y - 14; for (const [dx, c] of [[0, PAL.olive], [11, PAL.blue]]) { A.r(x + dx, y + 3, 10, 17, c[1]); A.r(x + dx, y + 3, 10, 2, c[0]); A.vl(x + dx + 9, y + 5, 15, c[2]); A.r(x + dx + 2, y, 5, 3, c[2]); A.line(x + dx + 2, y + 8, x + dx + 7, y + 14, c[2]); A.line(x + dx + 7, y + 8, x + dx + 2, y + 14, c[2]); } return fit(st, { solid: [0, 0, 22, 10] }); },
    tripod() { const st = stage(18, 8, 34), { A } = st, x = st.x + 9, y = st.y - 32; A.line(x, y + 8, x - 8, y + 38, PAL.wood[1]); A.line(x, y + 8, x + 8, y + 38, PAL.wood[1]); A.line(x, y + 8, x, y + 36, PAL.wood[2]); A.r(x - 5, y, 11, 8, PAL.gold[2]); A.r(x - 5, y, 11, 2, PAL.gold[1]); A.ell(x + 6, y + 4, 2, 2, PAL.dark[2]); A.r(x - 7, y + 2, 2, 4, PAL.dark[1]); return fit(st, { solid: [2, 0, 14, 8] }); },
    findsTable() { const st = stage(60, 18, 12), { A } = st, x = st.x, y = st.y - 8; A.r(x, y, 60, 16, PAL.plank[0]); A.r(x, y, 60, 2, PAL.canvas[0]); for (let i = 15; i < 60; i += 15) A.vl(x + i, y + 2, 14, PAL.plank[1]); A.r(x, y + 16, 60, 4, PAL.plank[2]); for (const lx of [x + 2, x + 55]) A.r(lx, y + 20, 3, 6, PAL.wood[3]); A.r(x + 4, y + 3, 22, 11, PAL.canvas[0]); A.line(x + 6, y + 6, x + 22, y + 10, PAL.blue[1]); A.r(x + 12, y + 5, 3, 3, PAL.red[1]); A.ell(x + 34, y + 7, 4, 3, PAL.brick[1]); A.ell(x + 34, y + 6, 2, 1, PAL.dark[3]); A.r(x + 42, y + 5, 5, 2, PAL.brick[2]); A.r(x + 49, y + 8, 4, 2, PAL.brick[1]); A.r(x + 44, y + 10, 7, 2, PAL.metal[1]); A.px(x + 51, y + 11, PAL.wood[1]); return fit(st, { solid: [0, 2, 60, 16] }); },
    foldChair() { const st = stage(12, 8, 12), { A } = st, x = st.x, y = st.y - 10; A.r(x + 1, y, 10, 8, PAL.olive[1]); A.r(x + 1, y, 10, 2, PAL.olive[0]); A.r(x, y + 8, 12, 4, PAL.olive[2]); A.line(x + 1, y + 12, x + 10, y + 18, PAL.metal[2]); A.line(x + 10, y + 12, x + 1, y + 18, PAL.metal[2]); return fit(st, { solid: [1, 2, 10, 6] }); },
    safe() { const st = stage(22, 12, 22), { A } = st, x = st.x, y = st.y - 20; A.r(x, y, 22, 8, PAL.dark[0]); A.r(x, y + 8, 22, 24, PAL.dark[1]); A.r(x + 2, y + 10, 18, 20, PAL.dark[2]); A.ell(x + 11, y + 20, 4, 4, PAL.metal[2]); A.ell(x + 11, y + 20, 2, 2, PAL.dark[3]); A.r(x + 17, y + 17, 2, 6, PAL.gold[2]); return fit(st, { solid: [0, 0, 22, 12] }); },
    printer() { const st = stage(28, 12, 20), { A } = st, x = st.x, y = st.y - 18; A.r(x, y + 8, 28, 8, PAL.wood[1]); A.r(x, y + 16, 28, 14, PAL.wood[2]); A.r(x + 3, y + 19, 22, 4, PAL.wood[3]); A.r(x + 3, y + 25, 22, 3, PAL.wood[3]); A.r(x + 4, y, 20, 8, PAL.white[1]); A.r(x + 4, y, 20, 2, PAL.white[0]); A.r(x + 7, y - 3, 14, 4, PAL.white[0]); A.r(x + 6, y + 9, 16, 3, PAL.white[3]); A.px(x + 21, y + 4, PAL.green[0]); return fit(st, { solid: [0, 2, 28, 10] }); },
};

// ---- a room's shell: floor, back wall, edges, the exit mat ----
function roomShell(tw, th, style) {
    const pw = tw * TILE, ph = th * TILE, [c, g] = mk(pw, ph), A = pa(g), W = ROOM.WALL, E = ROOM.EDGE;
    // floor
    if (style === 'rock') {                             // the shaft: cut limestone, chisel marks, grit in the corners
        A.r(0, W, pw, ph - W, PAL.rock[2]);
        for (let y = W; y < ph; y += 24) { A.hl(0, y, pw, PAL.rock[3]); for (let x = ((y / 24) & 1) * 30; x < pw; x += 60) A.vl(x, y, 24, PAL.rock[3]); }
        for (let i = 0; i < 140; i++) A.px(Math.floor(hash2(i, 31) * pw), W + Math.floor(hash2(i, 32) * (ph - W)), i % 3 ? PAL.rock[3] : PAL.rock[1]);
    } else if (style === 'concrete') {                 // a bare cement floor, cracked, sand blown in under the door
        A.r(0, W, pw, ph - W, '#c2baac');
        for (let y = W + 40; y < ph; y += 64) A.hl(0, y, pw, '#a8a092');
        for (let i = 0; i < 8; i++) { const x = hash2(i, 51) * pw, y = W + hash2(i, 52) * (ph - W); A.line(x, y, x + 14 + hash2(i, 53) * 20, y + 6 + hash2(i, 54) * 12, '#9a9284'); }
        for (let i = 0; i < 90; i++) A.px(Math.floor(hash2(i, 55) * pw), W + Math.floor(hash2(i, 56) * (ph - W)), i % 2 ? '#aca496' : '#d2cabc');
        A.ell(pw >> 1, ph - 10, 70, 16, '#e0cc98'); A.ell((pw >> 1) - 10, ph - 12, 44, 9, '#ecd8a8'); A.ell(24, ph - 20, 26, 12, '#dcc890');
    } else if (style === 'tin') {                      // packed earth, trodden hard, a few stones
        A.r(0, W, pw, ph - W, '#c8a878');
        for (let i = 0; i < 160; i++) A.px(Math.floor(hash2(i, 61) * pw), W + Math.floor(hash2(i, 62) * (ph - W)), i % 3 ? '#b09060' : '#dcc090');
        for (let i = 0; i < 10; i++) { const x = hash2(i, 63) * pw, y = W + hash2(i, 64) * (ph - W); A.r(x, y, 3, 2, '#9a7a50'); A.hl(x, y, 3, '#e8d0a0'); }
    } else if (style === 'trailer') {                  // a vinyl floor printed to look like wood, not fooling anybody
        A.r(0, W, pw, ph - W, '#c89c6c');
        for (let y = W; y < ph; y += 10) { A.hl(0, y, pw, '#a87c50'); for (let x = ((y / 10) & 1) * 30 + 8; x < pw; x += 60) A.vl(x, y, 10, '#a87c50'); }
        A.r(0, W, pw, 2, '#8a6440');
    } else if (style === 'maqam') {                    // old stone flags, worn smooth, under straw mats
        for (let y = W; y < ph; y += 20) for (let x = -((y - W) / 20 & 1) * 16; x < pw; x += 32) { A.r(x, y, 32, 20, hash2(x, y) > 0.5 ? '#e4d8bc' : '#d8cab0'); A.hl(x, y, 32, '#f4ecd8'); A.vl(x, y, 20, '#c4b494'); }
    } else if (style === 'tent') {
        A.r(0, W, pw, ph - W, PAL.khaki[1]);
        for (let y = W; y < ph; y += 2) for (let x = (y & 2); x < pw; x += 4) A.px(x, y, PAL.khaki[2]);
        for (let x = 40; x < pw; x += 80) A.vl(x, W, ph - W, PAL.khaki[2]);
    } else if (style === 'planks') {
        A.r(0, W, pw, ph - W, PAL.plank[1]);
        for (let y = W; y < ph; y += 16) { A.hl(0, y, pw, PAL.plank[2]); for (let x = ((y / 16) & 1) * 40 + 12; x < pw; x += 80) A.vl(x, y, 16, PAL.plank[2]); for (let x = 6; x < pw; x += 23) A.px(x + ((y * 7) % 9), y + 5 + ((x * 3) % 7), PAL.plank[0]); }
    } else if (style === 'deck') {                     // a boat's deck: planks running fore and aft, tar in the seams
        A.r(0, W, pw, ph - W, '#a8845c');
        for (let y = W; y < ph; y += 9) { A.hl(0, y, pw, '#6a4a2c'); for (let x = ((y / 9) % 3) * 40 + 10; x < pw; x += 120) A.vl(x, y, 9, '#7a5a3a'); }
        for (let i = 0; i < 60; i++) A.px(Math.floor(hash2(i, 81) * pw), W + Math.floor(hash2(81, i) * (ph - W)), '#c8a070');
    } else if (style === 'villa') {                    // big slabs of polished marble, cream, faintly veined
        for (let y = W; y < ph; y += 48) for (let x = -((y - W) / 48 & 1) * 32; x < pw; x += 64) {
            A.r(x, y, 64, 48, hash2(x, y) > 0.5 ? '#f4eee2' : '#ece4d4'); A.hl(x, y, 64, '#d8cebc'); A.vl(x, y, 48, '#d8cebc');
            const a = hash2(x + 3, y), b = hash2(x, y + 7); A.line(x + 6 + a * 30, y + 6, x + 20 + a * 30, y + 18 + b * 20, '#e0d6c4');
        }
    } else {
        // terrazzo tiles, two tones set as a chequer, a few cracked
        for (let y = W; y < ph; y += TILE) for (let x = 0; x < pw; x += TILE) {
            const alt = ((x / TILE) + ((y - W) / TILE | 0)) & 1;
            A.r(x, y, TILE, TILE, alt ? '#c4ccd0' : '#b4bcc2'); A.r(x, y, TILE, 1, '#9aa4ac'); A.r(x, y, 1, TILE, '#9aa4ac');
            for (let k = 0; k < 5; k++) A.px(x + 3 + hash2(x + k, y) * 26, y + 3 + hash2(x, y + k) * 26, alt ? '#d8dee2' : '#a0aab2');
            if (hash2(x + 5, y) > 0.88) A.line(x + 6, y + 8, x + 18, y + 22, '#8a949c');
        }
    }
    // back wall
    if (style === 'rock') {                             // the rock face: strata, and the marks of chisels
        A.r(0, 0, pw, W, PAL.rock[1]);
        for (let j = 6; j < W - 6; j += 9) A.hl(0, j + (j % 2), pw, PAL.rock[2]);
        for (let i = 0; i < 60; i++) { const x = Math.floor(hash2(i, 41) * pw), y = 4 + Math.floor(hash2(i, 42) * (W - 14)); A.line(x, y, x + 3, y + 2, PAL.rock[3]); }
        A.r(0, 0, pw, 5, PAL.rock[3]); A.r(0, W - 6, pw, 6, PAL.rock[3]); A.r(0, W - 6, pw, 1, PAL.rock[4]);
    } else if (style === 'concrete') {                 // government green to shoulder height, cream above, peeling
        A.r(0, 0, pw, W, '#e6dcc2'); A.r(0, 22, pw, W - 22, '#6e9a78'); A.hl(0, 22, pw, '#4e7a58'); A.hl(0, 23, pw, '#8eb898');
        for (let i = 0; i < 9; i++) { const x = hash2(i, 71) * (pw - 20), y = 6 + hash2(i, 72) * (W - 16); A.r(x, y, 8 + hash2(i, 73) * 10, 4 + hash2(i, 74) * 4, '#b8b0a0'); }
        for (let i = 0; i < 5; i++) A.soft(hash2(i, 75) * pw, 0, 3, 18 + hash2(i, 76) * 20, '#8a6a4a', 0.25);
        A.r(0, 0, pw, 4, '#b8ae98'); A.r(0, W - 5, pw, 5, '#4e6a54');
        const x = Math.round(pw * 0.72); A.r(x - 2, 10, 36, 28, '#8e8474'); A.r(x, 12, 32, 24, '#9ed2f4'); A.r(x, 24, 32, 12, '#e8cf8e'); for (let i = 3; i < 32; i += 5) A.vl(x + i, 11, 26, '#4a4e56'); A.hl(x, 23, 32, '#4a4e56');   // the one window, barred
    } else if (style === 'tin') {                      // corrugated iron, rust, light through the nail holes
        corrugated(A, 0, 0, pw, W, ['#b8c088', '#96a068', '#727c4c', '#4e5634']);
        for (let i = 0; i < 12; i++) A.r(hash2(i, 81) * pw, 6 + hash2(i, 82) * (W - 16), 2, 4 + hash2(i, 83) * 8, '#b8683c');
        for (let i = 0; i < 20; i++) A.px(hash2(i, 84) * pw, 4 + hash2(i, 85) * 6, '#fff4c8');
        A.r(0, 0, pw, 4, '#4e5634'); A.r(0, W - 5, pw, 5, '#5a4630'); for (let x = 12; x < pw; x += 48) A.r(x, 0, 4, W, '#8e6a44');   // posts
    } else if (style === 'trailer') {                  // white wall panels with seams, a curtained window
        A.r(0, 0, pw, W, '#eef0f2'); for (let x = 0; x < pw; x += 32) { A.vl(x, 0, W, '#c8ced6'); A.vl(x + 1, 0, W, '#ffffff'); }
        A.r(0, 0, pw, 5, '#c8ced6'); A.r(0, W - 6, pw, 6, '#a8b0ba'); A.hl(0, W - 6, pw, '#8a94a0');
    } else if (style === 'maqam') {                    // whitewash, a green dado, a band of Qur'anic script painted round it
        A.r(0, 0, pw, W, '#f6f4ec'); A.r(0, W - 20, pw, 20, '#3e8a58'); A.hl(0, W - 20, pw, '#2a6440'); A.hl(0, W - 19, pw, '#6cae7c');
        A.r(0, 8, pw, 8, '#2a6440'); for (let x = 3; x < pw - 4; x += 7) { A.r(x, 10, 4, 1, '#f0c040'); A.px(x + 1, 12, '#f0c040'); A.vl(x + 5, 9, 4, '#f0c040'); }
        A.r(0, 0, pw, 3, '#d8d4c8');
    } else if (style === 'tent') {
        A.r(0, 0, pw, W, PAL.canvas[1]); A.r(0, 0, pw, 10, PAL.canvas[2]); A.dith(0, 10, pw, 6, PAL.canvas[2], 0);
        for (let x = 30; x < pw; x += 60) { A.vl(x, 0, W, PAL.canvas[2]); A.vl(x + 1, 0, W, PAL.canvas[0]); }
        A.r(0, W - 5, pw, 5, PAL.canvas[3]); A.r((pw >> 1) - 3, 0, 6, W, PAL.wood[2]); A.vl((pw >> 1) - 3, 0, W, PAL.wood[0]);
    } else if (style === 'planks') {
        A.r(0, 0, pw, W, PAL.wood[1]); for (let x = 0; x < pw; x += 10) A.vl(x, 0, W, PAL.wood[2]); A.r(0, 0, pw, 6, PAL.wood[3]); A.r(0, W - 5, pw, 5, PAL.wood[3]);
        for (const wx of [pw * 0.22, pw * 0.72]) { const x = Math.round(wx); A.r(x - 1, 13, 34, 26, PAL.wood[3]); A.r(x, 14, 32, 24, PAL.blue[3]); A.r(x, 14, 32, 3, PAL.blue[2]); A.vl(x + 16, 14, 24, PAL.wood[3]); A.hl(x, 26, 32, PAL.wood[3]); A.px(x + 5, 19, PAL.white[0]); A.px(x + 24, 31, PAL.white[1]); }
    } else if (style === 'deck') {                     // no wall: the night sea over the gunwale, the stars, a path of moonlight
        A.r(0, 0, pw, W, '#101838'); A.r(0, 26, pw, W - 26, '#14284a'); A.hl(0, 26, pw, '#2a3a64');
        for (let i = 0; i < 50; i++) A.px(Math.floor(hash2(i, 91) * pw), Math.floor(hash2(91, i) * 24), i % 4 ? '#8890b8' : '#ffffff');
        for (let i = 0; i < 16; i++) A.hl(Math.round(pw * 0.66) - 10 + Math.floor(hash2(i, 92) * 20), 30 + i * 1.4 | 0, 3 + (i % 3) * 2, '#c8d0e8');
        A.r(0, W - 12, pw, 8, '#6a4a2c'); A.hl(0, W - 12, pw, '#a8845c'); A.hl(0, W - 5, pw, '#3a2a1a'); for (let x = 20; x < pw; x += 60) A.r(x, W - 16, 4, 12, '#5a3e24');   // the gunwale
    } else if (style === 'villa') {                    // the whole back wall glass, slid open: sky, the sea, a white balustrade
        A.r(0, 0, pw, W, '#9ed2f4'); A.r(0, 20, pw, 6, '#c4e6fa'); A.r(0, 26, pw, W - 26, '#2a7ab8'); A.r(0, 26, pw, 4, '#3a8ac8'); A.hl(0, 26, pw, '#6ab0e0');
        for (let i = 0; i < 18; i++) A.hl(Math.floor(hash2(i, 91) * (pw - 10)), 32 + Math.floor(hash2(i, 92) * (W - 44)), 4 + (i % 3) * 2, '#8ac8f0');
        A.r(0, W - 16, pw, 3, '#f4f4f0'); A.hl(0, W - 16, pw, '#ffffff'); for (let x = 4; x < pw; x += 8) { A.r(x, W - 13, 3, 9, '#ecece6'); A.vl(x + 2, W - 13, 9, '#c8ccd0'); } A.r(0, W - 4, pw, 4, '#d8d4c8');
        for (let x = 0; x < pw; x += 112) { A.r(x, 0, 4, W, '#e8ecef'); A.vl(x + 3, 0, W, '#b8c0c8'); }   // the frames of the sliding doors
        A.r(0, 0, pw, 4, '#f4f4f0'); A.hl(0, 4, pw, '#c8ccd0');
    } else {
        A.r(0, 0, pw, W, PAL.plaster[0]); A.r(0, 0, pw, 6, PAL.plaster[2]); A.dith(0, 6, pw, 5, PAL.plaster[1], 0); A.r(0, W - 12, pw, 12, PAL.plaster[2]); A.r(0, W - 12, pw, 1, PAL.plaster[3]); A.r(0, W - 3, pw, 3, PAL.plaster[3]);
        for (let i = 0; i < 6; i++) A.r(20 + hash2(i, 3) * (pw - 60), 12 + hash2(i, 5) * 20, 6, 2, PAL.plaster[1]);
        const x = Math.round(pw * 0.78); A.r(x - 1, 11, 34, 28, PAL.blue[2]); A.r(x + 1, 13, 30, 24, PAL.blue[3]); A.vl(x + 16, 13, 24, PAL.blue[2]); for (let j = 15; j < 36; j += 3) A.hl(x + 1, j, 30, PAL.blue[2]);   // a shuttered window
    }
    // the wall throws a soft shadow onto the floor
    A.g.fillStyle = 'rgba(20,12,8,0.28)'; A.g.fillRect(0, W, pw, 3); A.g.fillStyle = 'rgba(20,12,8,0.14)'; A.g.fillRect(0, W + 3, pw, 4);
    // side and front edges; the doorway and its mat
    A.r(0, 0, E, ph, PAL.dark[2]); A.r(pw - E, 0, E, ph, PAL.dark[2]); A.r(E - 2, W, 2, ph - W, PAL.dark[1]); A.r(pw - E, W, 2, ph - W, PAL.dark[1]);
    A.r(0, ph - E, pw, E, PAL.dark[2]); A.r(E, ph - E, pw - E * 2, 2, PAL.dark[1]);
    const dx = (pw >> 1) - 22;
    if (style === 'deck') {                             // the gunwale all round: no way off but the sea
        for (const [x, y, w, h] of [[0, W, E, ph - W], [pw - E, W, E, ph - W], [0, ph - E, pw, E]]) { A.r(x, y, w, h, '#6a4a2c'); A.r(x, y, w, 2, '#a8845c'); }
    } else if (style === 'rock') {                             // no mat down here: the ladder you came down
        A.r(dx, ph - E, 44, E, PAL.dark[3]);
        A.r(dx + 12, ph - E - 22, 3, 26, PAL.wood[2]); A.r(dx + 29, ph - E - 22, 3, 26, PAL.wood[2]);
        for (let j = ph - E - 18; j < ph; j += 6) A.r(dx + 15, j, 14, 2, PAL.wood[1]);
        A.poly([[dx + 22, ph - E - 30], [dx + 16, ph - E - 24], [dx + 28, ph - E - 24]], PAL.gold[0]);   // up
    } else {
        A.r(dx, ph - E, 44, E, style === 'tent' ? PAL.khaki[1] : style === 'planks' || style === 'trailer' ? PAL.plank[1] : style === 'tin' ? '#c8a878' : style === 'concrete' ? '#c2baac' : style === 'maqam' ? '#e4d8bc' : style === 'villa' ? '#ece4d4' : PAL.metal[1]);
        A.r(dx + 4, ph - E - 12, 36, 16, PAL.red[2]); A.dith(dx + 4, ph - E - 12, 36, 16, PAL.red[3], 0); A.r(dx + 4, ph - E - 12, 36, 2, PAL.gold[1]); A.r(dx + 4, ph - E + 2, 36, 2, PAL.gold[1]);
        // an arrow on the mat: the way out
        A.poly([[dx + 22, ph - 3], [dx + 16, ph - 10], [dx + 28, ph - 10]], PAL.gold[0]);
    }
    return { c, pw, ph, doorX: dx };
}

// things hung on the back wall (drawn into the shell)
const WALLART = {
    cork(A, x, y) { A.r(x - 1, y - 1, 74, 34, PAL.wood[3]); A.r(x, y, 72, 32, PAL.brick[1]); A.dith(x, y, 72, 32, PAL.brick[0], 0); const pins = [PAL.red[1], PAL.blue[1], PAL.gold[1], PAL.green[1]]; [[4, 3, 18, 12], [26, 5, 14, 16], [44, 3, 22, 10], [6, 18, 14, 10], [46, 16, 18, 12]].forEach(([a, b, w, h], i) => { A.r(x + a, y + b, w, h, i === 1 ? PAL.canvas[0] : PAL.white[0]); for (let j = 2; j < h - 1; j += 2) A.r(x + a + 2, y + b + j, w - 4, 1, PAL.metal[1]); A.px(x + a + (w >> 1), y + b, pins[i % 4]); }); for (let i = 0; i < 7; i++) A.px(x + 24 + i * 3, y + 26 - (i & 1), pins[i % 4]); },
    photos(A, x, y) { [[0, 2, 12, 10], [15, 0, 10, 12], [28, 3, 13, 9], [4, 15, 10, 9], [18, 15, 14, 10]].forEach(([a, b, w, h], i) => { A.r(x + a, y + b, w, h, PAL.white[0]); A.r(x + a + 1, y + b + 1, w - 2, h - 3, [PAL.blue[0], PAL.sand[2], PAL.rock[2], PAL.sand[1], PAL.blue[2]][i]); A.px(x + a + (w >> 1), y + b, PAL.red[1]); }); },
    clock(A, x, y) { A.ell(x, y, 7, 7, PAL.dark[2]); A.ell(x, y, 5, 5, PAL.white[0]); A.line(x, y, x, y - 4, PAL.dark[3]); A.line(x, y, x + 3, y + 1, PAL.dark[3]); },
    map(A, x, y) { A.r(x - 1, y - 1, 46, 30, PAL.wood[3]); A.r(x, y, 44, 28, PAL.canvas[0]); A.poly([[x + 8, y + 20], [x + 16, y + 8], [x + 24, y + 20]], PAL.sand[3]); A.poly([[x + 22, y + 22], [x + 30, y + 11], [x + 38, y + 22]], PAL.sand[3]); A.line(x + 4, y + 24, x + 40, y + 23, PAL.blue[1]); A.r(x + 30, y + 4, 8, 1, PAL.red[1]); A.r(x + 12, y + 14, 2, 2, PAL.red[1]); },
    poster(A, x, y) { A.r(x, y, 26, 32, PAL.white[0]); A.r(x + 1, y + 1, 24, 18, PAL.red[1]); A.ell(x + 13, y + 10, 6, 6, PAL.white[0]); A.ell(x + 13, y + 10, 3, 3, PAL.dark[3]); A.r(x + 3, y + 22, 20, 2, PAL.dark[2]); A.r(x + 6, y + 26, 14, 2, PAL.dark[1]); A.px(x + 13, y, PAL.gold[1]); },
    hooks(A, x, y) { A.r(x, y, 44, 3, PAL.wood[3]); for (let i = 0; i < 4; i++) A.r(x + 4 + i * 12, y + 3, 1, 3, PAL.metal[3]); A.r(x + 1, y + 5, 8, 16, PAL.canvas[2]); A.r(x + 1, y + 5, 8, 3, PAL.canvas[1]); A.r(x + 13, y + 5, 8, 20, PAL.blue[2]); A.r(x + 13, y + 5, 8, 3, PAL.blue[1]); A.ell(x + 40, y + 9, 4, 4, PAL.canvas[1]); A.ell(x + 40, y + 10, 6, 2, PAL.canvas[2]); },
    flap(A, x, y) { A.r(x - 1, y - 1, 30, 24, PAL.canvas[3]); A.r(x, y, 28, 22, '#8fc0e8'); A.r(x, y + 14, 28, 8, PAL.sand[1]); A.poly([[x + 8, y + 14], [x + 14, y + 6], [x + 20, y + 14]], PAL.sand[3]); A.r(x, y, 28, 5, PAL.canvas[2]); for (let i = 2; i < 28; i += 5) A.vl(x + i, y, 5, PAL.canvas[3]); A.vl(x + 14, y + 5, 17, PAL.canvas[3]); },
    shelfWall(A, x, y) { A.r(x, y + 12, 50, 3, PAL.wood[2]); A.r(x + 2, y + 15, 2, 4, PAL.wood[3]); A.r(x + 46, y + 15, 2, 4, PAL.wood[3]); [[PAL.red[2], 3], [PAL.blue[2], 9], [PAL.green[3], 14], [PAL.gold[2], 20], [PAL.canvas[2], 25]].forEach(([c, dx], i) => A.r(x + dx, y + 1 + (i % 2), 5, 11 - (i % 2), c)); A.ell(x + 40, y + 8, 5, 4, PAL.brick[1]); A.ell(x + 40, y + 5, 3, 1, PAL.dark[3]); },
    laundry(A, x, y, w) { for (let i = 0; i < w; i++) A.px(x + i, y + Math.round(Math.sin(i / w * Math.PI) * 4), PAL.canvas[3]); const cols = [PAL.white[0], PAL.blue[1], PAL.canvas[1], PAL.red[1], PAL.white[1]]; for (let i = 0; i < 5; i++) { const cx = x + 8 + i * (w - 16) / 4, cy = y + Math.round(Math.sin((cx - x) / w * Math.PI) * 4); A.r(cx - 4, cy + 1, 9, 10 + (i % 2) * 3, cols[i]); A.r(cx - 4, cy + 1, 9, 1, PAL.dark[1]); } },
    lantern(A, x, y) { A.vl(x, y - 8, 8, PAL.dark[2]); A.r(x - 3, y, 7, 9, PAL.gold[0]); A.r(x - 4, y - 1, 9, 2, PAL.dark[1]); A.r(x - 3, y + 9, 7, 1, PAL.dark[1]); },
};

function buildRoom(key, M, back) {
    const info = {}; for (const o of (M.interiors[key] || [])) info[o.id] = o;
    const def = ROOMS[key], sh = roomShell(def.tw, def.th, def.style), A = pa(sh.c.getContext('2d'));
    const map = { key, outdoor: false, name: def.name, pw: sh.pw, ph: sh.ph, bg: sh.c, ents: [], grid: {}, doors: [], places: [], people: [], back, dark: def.style === 'rock' };   // (dark: lit only by lamps and your torch)
    const W = ROOM.WALL, E = ROOM.EDGE;
    World.addSolid(map, 0, 0, sh.pw, W - 2); World.addSolid(map, 0, 0, E, sh.ph); World.addSolid(map, sh.pw - E, 0, E, sh.ph);
    World.addSolid(map, 0, sh.ph - E, sh.doorX, E); World.addSolid(map, sh.doorX + 44, sh.ph - E, sh.pw - sh.doorX - 44, E);
    map.exit = { x: sh.doorX, y: sh.ph - 5, w: 44, h: 8 };
    map.spawn = [sh.doorX + 22, sh.ph - E - 8];
    // put(x, y, sprite, id): a piece of furniture with its foot-print's top-left at (x, y)
    const put = (x, y, spr, id, extra) => {
        const o = id && info[id];
        const e = Object.assign({ x, y, w: spr.c.width - 2, d: spr.solid ? spr.solid[1] + spr.solid[3] : 8, spr, id, label: o ? o.label.replace(/ \(.*\)$/, '') : null, say: o ? o.say : null }, extra || {});
        e.sortY = spr.flat ? -1e9 : y + e.d;
        if (!spr.flat && spr.solid) { A.g.fillStyle = 'rgba(20,12,8,0.22)'; A.g.fillRect(x + 2, y + e.d - 1, e.w - 1, 3); A.g.fillRect(x + e.w, y + 3, 2, e.d - 3); }
        World.addEnt(map, e);
        if (spr.light) e.light = spr.light;
        return e;
    };
    // wall(x, id, art): something on the back wall you can examine from below it
    const wall = (x, w, id, extra) => { const o = id && info[id]; map.ents.push(Object.assign({ x, y: W - 6, w, d: 8, id, label: o ? o.label : null, say: o ? o.say : null, sortY: 0 }, extra || {})); };
    def.build({ map, A, put, wall, pw: sh.pw, ph: sh.ph, W });
    return map;
}

const ROOMS = {
    INT_TENT: { name: "MIRIAM'S TENT", tw: 13, th: 9, style: 'tent', build({ map, A, put, wall, pw, ph, W }) {
        WALLART.photos(A, pw - 82, 14); wall(pw - 84, 46, 'tent_photos');
        WALLART.lantern(A, (pw >> 1) + 44, 16); map.ents.push({ x: (pw >> 1) + 44, y: W, w: 0, d: 0, sortY: 0, light: { x: 0, y: -30, r: 120, c: '#ffd890' } });
        WALLART.map(A, 70, 12); wall(68, 48, null, { label: 'Survey Map', picture: surveyMapArt, say: ['System', 'Miriam\'s survey map of the concession, pinned to the canvas. Three trenches in red pencil: A, B, C. Beside C she has written one Coptic word, and underlined it twice.'] });
        WALLART.flap(A, 136, 16); WALLART.hooks(A, pw - 150, 18);
        put((pw >> 1) - 62, W + 60, FURN.rug(124, 78, PAL.red));
        put((pw >> 1) - 38, W + 4, FURN.desk(76, true), 'tent_codex');
        put((pw >> 1) - 6, W + 30, FURN.foldChair());
        put(pw - 50, W + 6, FURN.bed(PAL.olive), 'tent_cot');
        put(pw - 86, W + 6, FURN.teaTable(), null, { label: 'Her Tea', say: ['System', 'A brass tray on a folding stand. One glass, half full, gone cold days ago. A second glass, clean, turned upside down.\n\nShe was expecting someone. Or she had just seen them out.'] });
        put(18, W + 66, FURN.bookCrate(), 'tent_journal');
        put(16, W + 4, FURN.trunk(), null, { label: 'Her Trunk', say: ['System', 'A steel trunk with M. HALE stencilled on the lid. Clothes folded flat, a sewing kit, a spare pair of glasses. Packed by someone who expected to unpack it.'] });
        put(18, ph - 74, FURN.findsTable(), null, { label: 'Work Table', say: ['System', 'Her work table: a survey plan held flat with four potsherds, a trowel worn to the shape of her hand, a brush, a scale bar.\n\nOn the plan, in pencil, a small square drawn beside the Osiris Shaft. Rubbed out. Drawn again.'] });
        put((pw >> 1) + 40, ph - 40, FURN.boots(), null, { label: 'Her Boots', say: ['System', 'Her boots, side by side at the door. Worn at the heel, laced the way she always laced them.\n\n"She does not go anywhere without her boots," the Rais said.'] });
        put(pw - 44, ph - 80, FURN.washstand(), null, { label: 'Washstand', say: ['System', 'An enamel basin and a jug. The water has a skin of dust on it. A toothbrush, a bar of olive-oil soap, a comb with three grey hairs.'] });
        put(pw - 78, ph - 50, FURN.jerrycans()); put(pw - 110, W + 96, FURN.tripod(), null, { label: 'Camera', say: ['System', 'A plate camera on a wooden tripod — Miriam liked old things that still worked. The plate holder is empty.'] });
        put(pw - 150, W + 6, FURN.plant());
    } },
    INT_DORM: { name: 'THE DORMITORY', tw: 17, th: 10, style: 'planks', build({ map, A, put, wall, pw, ph, W }) {
        WALLART.clock(A, pw >> 1, 22); WALLART.poster(A, 36, 12); WALLART.laundry(A, (pw >> 1) + 60, 14, 120); WALLART.shelfWall(A, (pw >> 1) - 150, 22);
        wall(34, 30, null, { label: 'Poster', say: ['System', 'Al Ahly, champions. The corners have been re-taped so many times the wall has a frame of old tape around it.'] });
        const blankets = [PAL.red, PAL.blue, PAL.olive, PAL.wood, PAL.blue, PAL.red, PAL.olive];
        for (let i = 0; i < 6; i++) put(40 + i * 66, W + 4, FURN.bed(blankets[i % 7], i === 4), i === 4 ? 'dorm_awake' : i === 1 ? 'dorm_talisman' : null,
            i === 0 || i > 1 && i !== 4 ? { label: 'Cot', say: ['System', ['A cot, made up tight. A prayer mat rolled at the foot.', 'A cot with a football shirt drying on the frame: Al Ahly, number 10.', 'A cot, empty. Its owner is on the night shift.', 'A cot. Under the pillow, the corner of a letter from Quft.'][i % 4]] } : null);
        for (let i = 0; i < 5; i++) put(74 + i * 66, W + 8, FURN.stool());                                        // a box between each pair of cots
        put(14, W + 2, FURN.locker(PAL.metal)); put(pw - 30, W + 2, FURN.locker([PAL.olive[0], PAL.olive[1], PAL.olive[2]]));
        put(14, ph - 96, FURN.pole(true), 'dorm_graffiti');
        put(pw - 62, ph - 104, FURN.tv(), null, { label: 'Television', say: ['System', 'A small television on a crate. Football, with the sound off. Al Ahly are a goal down, and nobody in the room wants to talk about it.'] });
        put(pw - 100, ph - 72, FURN.stool()); put(pw - 62, ph - 60, FURN.stool()); put(pw - 132, ph - 96, FURN.stool());
        put(70, ph - 124, FURN.rug(96, 50, PAL.blue));
        put(96, ph - 108, FURN.teaTable(), null, { label: 'Tea Tray', say: ['System', 'A brass tray, a blackened pot, nine glasses. The sugar bowl is the biggest thing on it.'] });
        put(40, ph - 62, FURN.prayerMat());
        put(pw - 150, ph - 42, FURN.trunk()); put(pw >> 1, ph - 46, FURN.jerrycans());
        put((pw >> 1) + 50, ph - 120, FURN.plant());
    } },
    INT_FOREMAN: { name: 'THE SITE OFFICE', tw: 14, th: 9, style: 'office', build({ map, A, put, wall, pw, ph, W }) {
        WALLART.cork(A, (pw >> 1) - 84, 12); wall((pw >> 1) - 86, 76, 'for_corkboard');
        WALLART.clock(A, (pw >> 1) + 16, 22); WALLART.map(A, (pw >> 1) + 40, 12);
        wall((pw >> 1) + 38, 48, null, { label: 'Concession Map', say: ['System', 'The concession map: the Western Field, the causeway, the Osiris Shaft marked with a small black square. Somebody has circled the shaft in biro. Twice.'] });
        put((pw >> 1) - 56, W + 40, FURN.rug(112, 84, PAL.red));
        put((pw >> 1) - 40, W + 54, FURN.bigDesk(), 'for_desk');
        put((pw >> 1) - 8, W + 36, FURN.chair(true));
        put((pw >> 1) - 30, W + 108, FURN.chair(false)); put((pw >> 1) + 12, W + 108, FURN.chair(false));
        put(14, W + 4, FURN.cabinet(true), 'for_manifest');
        put(44, W + 4, FURN.cabinet(false), null, { label: 'Filing Cabinet', say: ['System', 'Season files, going back years. The spring folder is thinner than the others, and somebody has been through it in a hurry.'] });
        put(76, W + 2, FURN.shelf(), null, { label: 'Shelves', say: ['System', 'Finds boxes waiting for the register, a jar of labels, a first-aid tin, a thermos nobody admits to owning.'] });
        put(pw - 36, ph - 78, FURN.burnBin(), 'for_sams_notes');
        put(pw - 32, W + 6, FURN.cooler(), null, { label: 'Water Cooler', say: ['System', 'The water cooler gurgles once, as if clearing its throat.'] });
        put(pw - 64, W + 2, FURN.plant());
        put(16, ph - 62, FURN.fan());
        put(18, ph - 110, FURN.safe(), null, { label: 'Safe', say: ['System', 'The site safe. Locked. The dial has been wiped clean, which a dial in a desert never is.'] });
        put(pw - 46, ph - 38, FURN.printer(), null, { label: 'Printer', say: ['System', 'The printer. One sheet in the tray: a Foundation transfer slip, reprinted so faintly it is nearly blank.'] });
    } },
};
