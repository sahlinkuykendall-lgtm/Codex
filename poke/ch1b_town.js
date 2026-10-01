// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MIT RAHINA'S STREET LIFE (poke/ch1b_town.js)
// The little things that make the village a village: wires and bunting
// across the lane, a ful cart and a sugarcane-juice stand, clay water jars
// outside a door, butane on a cart, chickens, a cat, a bicycle, crates,
// rugs airing on a line, two old men at dominoes and two boys with a ball;
// out in the fields, pigeon towers, a water buffalo with its egret, goats.
// (Nameless locals only: the bible's named cast is elsewhere.)
// ============================================================

// ---- the sprites ----
// wires (and, with flags, bunting) strung across the lane between two poles
function laneWires(w, d, flags) {
    const up = 50, st = stage(w, d, up), { A } = st, x = st.x, g0 = st.y + d - 4, pt = g0 - 44;
    for (const px of [x + 1, x + w - 5]) { A.r(px, pt, 4, 44, '#8e7658'); A.vl(px, pt, 44, '#b8a07c'); A.vl(px + 3, pt, 44, '#6a563c'); A.r(px - 4, pt + 3, 12, 2, '#6a563c'); A.px(px - 3, pt + 2, '#9aa4ae'); A.px(px + 6, pt + 2, '#9aa4ae'); }
    const sag = (y0, k, col) => { for (let i = 0; i <= w - 8; i++) A.px(x + 4 + i, y0 + Math.round(Math.sin(i / (w - 8) * Math.PI) * k), col); };
    sag(pt + 2, 9, '#2a2c34'); sag(pt + 4, 11, '#3a3c46');
    if (flags) { const C = ['#d04838', '#f0c040', '#3a70c8', '#58a848', '#ffffff', '#e07830']; for (let i = 8, k = 0; i < w - 10; i += 9, k++) { const fy = pt + 5 + Math.round(Math.sin(i / (w - 8) * Math.PI) * 11); A.poly([[x + 4 + i, fy], [x + 11 + i, fy], [x + 7 + i, fy + 7]], C[k % C.length]); } }
    else { const lx = x + (w >> 1); A.r(lx - 3, pt + 12, 7, 4, '#3e4650'); A.r(lx - 2, pt + 16, 5, 2, '#fff4c0'); }       // a bare bulb hung in the middle
    return Object.assign(fit(st), { solid: [0, d - 8, 7, 6], noShadow: true });
}
SPR.c1b_wires1 = (w, d) => laneWires(w, d, false);
SPR.c1b_bunting = (w, d) => laneWires(w, d, true);
SPR.c1b_fulcart = (w, d) => {                          // a ful cart: bicycle wheels, a copper idra of beans on a gas flame, bread, jars of pickles
    const st = propStage(w, d, 60, 40), { A } = st, x = st.x, y = st.y;
    wheel(A, x + 12, y + 33, 6); wheel(A, x + 46, y + 33, 6);
    A.r(x + 2, y + 18, 56, 10, WOOD[1]); A.hl(x + 2, y + 18, 56, WOOD[0]); A.r(x + 2, y + 26, 56, 2, WOOD[3]); for (let i = 8; i < 56; i += 12) A.vl(x + 2 + i, y + 19, 7, WOOD[2]);   // the cart
    A.r(x + 2, y + 16, 56, 3, '#58a848'); A.hl(x + 2, y + 16, 56, '#8ad070');                                                   // painted green top rail
    A.r(x + 26, y + 26, 6, 6, '#3a70c8');                                                                                     // the gas bottle underneath
    A.ell(x + 16, y + 10, 10, 8, '#b86a30'); A.ell(x + 14, y + 8, 5, 4, '#e8a060'); A.r(x + 10, y + 2, 12, 3, '#8a4a20'); A.hl(x + 10, y + 2, 12, '#d88850'); A.px(x + 20, y + 6, '#fff0d0');   // the idra
    A.px(x + 13, y - 1, '#e8e8f0'); A.px(x + 15, y - 3, '#d8d8e0');                                                          // steam
    for (let i = 0; i < 3; i++) { A.ell(x + 34 + i * 3, y + 13 - i * 2, 6, 2, '#d8a868'); A.hl(x + 30 + i * 3, y + 12 - i * 2, 8, '#f0c888'); }   // a stack of bread
    for (let i = 0; i < 2; i++) { A.r(x + 47 + i * 5, y + 6, 4, 10, '#e8f0e0'); A.r(x + 47 + i * 5, y + 9, 4, 7, i ? '#c83818' : '#88a830'); }   // pickles, turnip and lemon
    A.r(x + 55, y + 18, 5, 2, WOOD[3]);                                                                                       // the handle
    return propFit(st, w, d, { solid: [(w - 56) / 2, d - 10, 56, 10] });
};
SPR.c1b_juice = (w, d) => {                            // 'asab: a green kiosk, the cane stacked like spears, a press that squeals, glasses of green-gold juice
    const st = propStage(w, d, 60, 60), { A } = st, x = st.x, y = st.y;
    A.r(x + 4, y + 14, 50, 44, '#3e8a58'); A.r(x + 4, y + 14, 50, 3, '#6cbc7c'); A.vl(x + 53, y + 14, 44, '#2a6440');       // the kiosk
    A.r(x + 2, y + 8, 54, 7, '#f0c040'); A.hl(x + 2, y + 8, 54, '#ffe070'); for (const [a, b] of [[8, 16], [20, 34], [38, 50]]) A.r(x + a, y + 10, b - a, 2, '#2e7a58');   // the sign
    A.r(x + 10, y + 20, 38, 18, '#1e2a22'); A.r(x + 12, y + 22, 34, 14, '#2c3a30');                                          // the hatch
    A.r(x + 14, y + 26, 14, 10, '#9aa4ae'); A.r(x + 16, y + 28, 10, 6, '#c8ccd0'); A.ell(x + 21, y + 26, 5, 2, '#5a6272');     // the press
    A.r(x + 8, y + 38, 44, 4, WOOD[1]); A.hl(x + 8, y + 38, 44, WOOD[0]);                                                     // the counter
    for (let i = 0; i < 4; i++) { A.r(x + 30 + i * 5, y + 33, 3, 5, '#c8e0a0'); A.r(x + 30 + i * 5, y + 33, 3, 2, '#f4f8e8'); }   // glasses of juice
    for (let i = 0; i < 7; i++) { const cx = x + 1 + i * 2; A.line(cx, y + 58, cx + 3, y + 4, i % 2 ? '#a8b860' : '#8a9a48'); A.px(cx + 1, y + 30, '#d8e0a0'); A.px(cx + 2, y + 16, '#d8e0a0'); }   // the cane, leaning
    A.r(x + 50, y + 44, 8, 14, '#c8a060'); A.hl(x + 50, y + 44, 8, '#e8c888');                                                // a crate of cut cane
    return propFit(st, w, d, { solid: [(w - 54) / 2, d - 14, 54, 12] });
};
SPR.c1b_butane = (w, d) => {                           // a butane cart: blue and grey cylinders stacked on a flatbed, a spanner to ring them with
    const st = propStage(w, d, 58, 34), { A } = st, x = st.x, y = st.y;
    wheel(A, x + 10, y + 28, 5); wheel(A, x + 44, y + 28, 5);
    A.r(x + 2, y + 20, 52, 5, WOOD[2]); A.hl(x + 2, y + 20, 52, WOOD[0]); A.r(x + 52, y + 18, 6, 2, WOOD[3]);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 2 - (i % 2); j++) { const cx = x + 6 + i * 9, cy = y + 6 + j * 0 - (i % 2 ? 0 : 0) + (1 - j) * 0; const bx = cx, byy = y + 4 + (i % 2) * 2; A.r(bx, byy, 8, 16, i % 2 ? '#9aa4ae' : '#3a70c8'); A.vl(bx, byy, 16, i % 2 ? '#c8ccd0' : '#6a9ae0'); A.r(bx + 2, byy - 2, 4, 2, '#5a6272'); A.hl(bx, byy + 5, 8, i % 2 ? '#748490' : '#285496'); }
    return propFit(st, w, d, { solid: [(w - 54) / 2, d - 8, 54, 8] });
};
function hens(seed) {                                  // a few hens pecking about (two frames)
    const R = rng(seed), H = [...Array(3)].map(() => [2 + R() * 22 | 0, 4 + R() * 8 | 0, R() < 0.5 ? '#f4f0e8' : '#b86a30', R() < 0.5]);
    const frames = [0, 1].map(f => {
        const st = propStage(32, 32, 30, 18), { A } = st, x = st.x, y = st.y;
        for (const [hx, hy, col, left] of H) {
            const peck = f === (left ? 1 : 0), s = left ? -1 : 1, bx = x + hx, by = y + hy;
            A.ell(bx, by + 3, 4, 3, col); A.px(bx - s * 3, by + 1, shade(col, -0.3));                                                // body, tail
            const hxx = bx + s * 3, hyy = by + (peck ? 3 : 0); A.r(hxx - 1, hyy - 1, 3, 3, col); A.px(hxx, hyy - 2, '#d02818'); A.px(hxx + s * 2, hyy, '#f0a020'); A.px(hxx + s, hyy - 1, '#1c1814');
            A.vl(bx - 1, by + 6, 2, '#f0a020'); A.vl(bx + 1, by + 6, 2, '#f0a020');
        }
        return propFit(st, 32, 32, {});
    });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 2.5, ox: frames[0].ox, oy: frames[0].oy };
}
SPR.c1b_chickens1 = () => hens('hens1'); SPR.c1b_chickens2 = () => hens('hens2');
SPR.c1b_cat = () => {                                  // a ginger tabby curled up asleep in the sun, nose under its tail, the tip of the tail flicking now and then
    const O = ['#f6b46a', '#e48c3c', '#c06a28', '#8a4418'], frames = [0, 1, 0, 0].map(f => {
        const st = propStage(32, 32, 24, 16), { A } = st, x = st.x, y = st.y + 1;
        A.ell(x + 13, y + 9, 9, 5, O[1]); A.ell(x + 12, y + 7, 7, 3, O[0]); A.hl(x + 6, y + 13, 14, O[2]);                                     // the body, curled
        for (const [a, b] of [[9, 5], [12, 4], [15, 5], [18, 7]]) { A.px(x + a, y + b, O[2]); A.px(x + a, y + b + 1, O[2]); A.px(x + a + 1, y + b + 2, O[2]); }   // tabby stripes
        A.ell(x + 6, y + 9, 4, 3, O[1]); A.ell(x + 5, y + 8, 3, 2, O[0]);                                                                       // the head, tucked in
        A.poly([[x + 2, y + 8], [x + 3, y + 4], [x + 5, y + 7]], O[1]); A.poly([[x + 6, y + 6], [x + 8, y + 4], [x + 9, y + 8]], O[1]);         // ears
        A.px(x + 3, y + 6, '#f0a0a0'); A.px(x + 8, y + 6, '#f0a0a0');
        A.hl(x + 3, y + 9, 2, O[3]); A.hl(x + 6, y + 9, 2, O[3]); A.px(x + 5, y + 10, '#e07878'); A.r(x + 3, y + 11, 4, 1, '#fff4e4');          // eyes shut, the nose, a white chin
        A.ell(x + 6, y + 12, 2, 1, '#fff4e4'); A.ell(x + 9, y + 12, 2, 1, '#fff4e4');                                                          // white paws tucked under
        for (let i = 0; i < 12; i++) A.px(x + 20 - i, y + 13 + (i > 3 && i < 9 ? 1 : 0), i % 3 ? O[1] : O[2]);                                // the tail wrapped round the front
        if (f) { A.px(x + 8, y + 12, O[1]); A.px(x + 7, y + 11, O[2]); A.px(x + 7, y + 10, O[1]); } else { A.px(x + 8, y + 14, O[2]); A.px(x + 7, y + 14, O[1]); }   // its tip, flicking
        return propFit(st, 32, 32, {});
    });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 1.5, ox: frames[0].ox, oy: frames[0].oy };
};
SPR.c1b_bicycle = (w, d) => {                          // a black bicycle leaning on its stand, a basket of bread on the back
    const st = propStage(w, d, 30, 22), { A } = st, x = st.x, y = st.y;
    wheel(A, x + 6, y + 15, 6); wheel(A, x + 24, y + 15, 6);
    A.line(x + 6, y + 15, x + 13, y + 6, '#20242c'); A.line(x + 13, y + 6, x + 22, y + 6, '#20242c'); A.line(x + 22, y + 6, x + 24, y + 15, '#20242c'); A.line(x + 13, y + 6, x + 15, y + 15, '#20242c'); A.line(x + 15, y + 15, x + 6, y + 15, '#20242c');
    A.r(x + 11, y + 3, 5, 2, '#5a3418'); A.line(x + 22, y + 6, x + 21, y + 1, '#20242c'); A.r(x + 19, y, 6, 1, '#9aa4ae');     // saddle, bars
    A.r(x + 1, y + 4, 9, 5, '#c8a060'); for (let i = 1; i < 9; i += 2) A.vl(x + 1 + i, y + 4, 5, '#a07840'); A.ell(x + 5, y + 3, 4, 2, '#d8a868');   // the basket, the bread
    return propFit(st, w, d, { solid: [(w - 24) / 2, d - 6, 24, 6] });
};
SPR.c1b_crates = (w, d) => {                           // palm-rib crates of tomatoes and a sack of onions
    const st = propStage(w, d, 30, 26), { A } = st, x = st.x, y = st.y;
    const crate = (cx, cy, fill) => { A.r(cx, cy, 16, 10, '#c8a060'); for (let i = 0; i < 16; i += 3) A.vl(cx + i, cy, 10, '#a07840'); A.hl(cx, cy, 16, '#e8c888'); if (fill) for (let i = 0; i < 5; i++) { A.ell(cx + 2 + i * 3, cy - 1, 2, 2, fill); A.px(cx + 1 + i * 3, cy - 2, '#ffb0a0'); } };
    crate(x + 1, y + 14, null); crate(x + 1, y + 5, '#d8402c'); crate(x + 13, y + 15, '#e8d040');
    A.ell(x + 24, y + 18, 5, 6, '#d8c090'); A.r(x + 22, y + 11, 4, 3, '#b8a070'); A.px(x + 23, y + 17, '#b88a58');           // the sack
    return propFit(st, w, d, { solid: [(w - 28) / 2, d - 8, 28, 8] });
};
SPR.c1b_rugs = (w, d) => {                             // kilims airing on a line between two posts, beaten free of dust
    const st = propStage(w, d, 92, 40), { A } = st, x = st.x, y = st.y;
    for (const px of [x + 1, x + 88]) { A.r(px, y + 2, 3, 38, WOOD[2]); A.vl(px, y + 2, 38, WOOD[0]); }
    A.hl(x + 3, y + 4, 86, '#5a6068');
    const rug = (rx, rw, P) => { A.r(rx, y + 4, rw, 26, P[0]); A.r(rx + 2, y + 6, rw - 4, 22, P[1]); for (let j = 0; j < 3; j++) A.poly([[rx + rw / 2, y + 8 + j * 7], [rx + rw / 2 + 5, y + 11 + j * 7], [rx + rw / 2, y + 14 + j * 7], [rx + rw / 2 - 5, y + 11 + j * 7]], P[2]); for (let i = rx; i < rx + rw; i += 2) A.px(i, y + 31, P[0]); };
    rug(x + 7, 24, ['#a02828', '#d04838', '#f0c040']); rug(x + 34, 24, ['#1a4a80', '#3a70c8', '#f4efe4']); rug(x + 61, 24, ['#6e3a20', '#b8643c', '#2e7a58']);
    return propFit(st, w, d, { solid: [2, d - 6, 6, 6], noShadow: true });
};
SPR.c1b_qulla = (w, d) => {                            // qullas: clay water jars on a wooden stand by a door, a saucer on each against the dust
    const st = propStage(w, d, 26, 30), { A } = st, x = st.x, y = st.y;
    A.r(x + 2, y + 16, 22, 3, WOOD[1]); A.hl(x + 2, y + 16, 22, WOOD[0]); A.vl(x + 3, y + 19, 11, WOOD[2]); A.vl(x + 22, y + 19, 11, WOOD[2]);
    for (let i = 0; i < 3; i++) { const cx = x + 6 + i * 7; A.ell(cx, y + 11, 3, 5, '#c07a4a'); A.ell(cx - 1, y + 9, 1, 2, '#e8a870'); A.r(cx - 1, y + 3, 3, 3, '#a8643a'); A.ell(cx, y + 3, 3, 1, '#e8e0d0'); }
    return propFit(st, w, d, { solid: [(w - 22) / 2, d - 6, 22, 6] });
};
SPR.c1b_bench = (w, d) => {                            // a bench by the well, a crate for a table: dominoes, two glasses of tea
    const st = propStage(w, d, 56, 22), { A } = st, x = st.x, y = st.y;
    A.r(x + 2, y + 8, 30, 4, WOOD[1]); A.hl(x + 2, y + 8, 30, WOOD[0]); A.vl(x + 4, y + 12, 8, WOOD[2]); A.vl(x + 29, y + 12, 8, WOOD[2]); A.r(x + 2, y + 2, 30, 3, WOOD[2]);
    A.r(x + 38, y + 10, 16, 10, '#c8a060'); for (let i = 0; i < 16; i += 3) A.vl(x + 38 + i, y + 10, 10, '#a07840'); A.r(x + 38, y + 8, 16, 3, '#e8c888');
    for (let i = 0; i < 4; i++) { A.r(x + 40 + i * 3, y + 8, 2, 1, '#f4f4f0'); A.px(x + 40 + i * 3, y + 8, '#20242c'); }     // dominoes
    A.r(x + 41, y + 5, 2, 3, '#f0e8d8'); A.px(x + 41, y + 6, '#b84020'); A.r(x + 50, y + 5, 2, 3, '#f0e8d8'); A.px(x + 50, y + 6, '#b84020');
    return propFit(st, w, d, { solid: [(w - 54) / 2, d - 8, 54, 8] });
};
SPR.c1b_dovecote1 = SPR.c1b_dovecote2 = (w, d) => {   // a burg hamam: a mud-brick base with a little door, then the tower proper, studded with clay pots for the pigeons to nest in,
    const M = ['#d0ae80', '#b8946a', '#9a7650', '#74563a'], T = ['#dcc098', '#c8a87e', '#a88a62', '#866a48'];   // rows of sticks to land on, a whitewashed crown of little domes; pigeons wheeling
    const frames = [0, 1].map(f => {
        const st = propStage(w, d, 60, 100), { A } = st, x = st.x, y = st.y, cx = x + 30, R = rng('dove' + w);
        const wAt = yy => 13 + Math.round((yy - 18) / 44 * 6);                                                   // the tower's half-width at a height: it tapers
        // the base: mud brick, plastered, a little blue door
        for (let yy = 62; yy < 98; yy++) { const hw = 21 + Math.round((yy - 62) * 0.06); A.hl(cx - hw, yy, hw * 2, M[1]); A.hl(cx - hw, yy, 4, M[0]); A.hl(cx + hw - 7, yy, 7, M[2]); }
        for (let j = 66; j < 96; j += 5) for (let i = -20 + (j % 10 ? 0 : 4); i < 18; i += 9) A.hl(cx + i, j, 6, M[2]);
        A.r(cx - 5, y + 82, 10, 16, M[3]); A.r(cx - 4, y + 83, 8, 15, '#3a6ab0'); A.vl(cx, y + 83, 15, '#284c88'); A.px(cx + 2, y + 90, '#f0c040'); A.hl(cx - 6, y + 81, 12, '#f4f0e4');
        A.r(cx - 23, y + 60, 46, 4, '#f4f0e4'); A.hl(cx - 23, y + 60, 46, '#ffffff'); A.hl(cx - 23, y + 63, 46, '#c8c0b0');                         // a whitewashed band
        // the tower: tapering, its face studded with pot mouths in staggered rows, sticks across every other row
        for (let yy = 18; yy < 60; yy++) { const hw = wAt(yy); A.hl(cx - hw, yy, hw * 2, T[1]); A.hl(cx - hw, yy, 3, T[0]); A.hl(cx + hw - 6, yy, 6, T[2]); A.px(cx + hw - 1, yy, T[3]); }
        for (let r = 0; r < 7; r++) {
            const py = y + 22 + r * 6, hw = wAt(py - y) - 3;
            for (let i = -hw + (r % 2 ? 3 : 0); i <= hw - 2; i += 6) { const c = cx + i, sh = i > hw - 8; A.ell(c, py, 2, 2, sh ? T[2] : '#e8c8a0'); A.r(c - 1, py - 1, 2, 2, '#2a1a10'); A.px(c - 1, py - 2, sh ? T[1] : '#f8e0c0'); }
            if (r % 2) { A.hl(cx - hw - 6, py + 3, hw * 2 + 12, '#6a4a2c'); A.hl(cx - hw - 6, py + 2, hw * 2 + 12, '#8e6a44'); }
        }
        // the crown: a whitewashed rim and five little domes
        A.r(cx - 16, y + 13, 32, 6, '#f4f0e4'); A.hl(cx - 16, y + 13, 32, '#ffffff'); A.hl(cx - 16, y + 18, 32, '#c8c0b0'); A.r(cx + 10, y + 14, 6, 4, '#dcd6c8');
        for (const [dx, r] of [[-12, 3], [-6, 4], [0, 5], [6, 4], [12, 3]]) { A.ell(cx + dx, y + 13 - r + 1, r, r, dx > 4 ? '#dcd6c8' : '#f4f0e4'); A.px(cx + dx - 1, y + 13 - 2 * r + 2, '#ffffff'); A.hl(cx + dx - r + 1, y + 12, 2 * r - 1, '#d4cec0'); }
        A.vl(cx, y + 2, 2, '#c8c0b0'); A.px(cx, y + 1, '#f0c040');                                                                     // a little finial
        // pigeons: sitting on the rim and the sticks, and two circling (their wings up, then down)
        const bird = (bx, by, col) => { A.r(bx, by, 3, 2, col); A.px(bx + 3, by - 1, col); A.px(bx + 4, by - 1, '#f0a020'); A.px(bx - 1, by + 1, shade(col, -0.3)); };
        bird(cx - 14, y + 10, '#e8e8f0'); bird(cx + 4, y + 11, '#9aa0b0'); bird(cx - 18, y + 49, '#c8ccd8'); bird(cx + 14, y + 37, '#e8e8f0'); bird(cx - 4, y + 25, '#9aa0b0');
        for (const [a, b] of [[-22, 4], [20, -2]]) { const bx = cx + a + (f ? 2 : 0), by = y + b + (f ? 1 : 0); A.r(bx, by + 1, 3, 1, '#e8e8f0'); if (f) { A.px(bx - 1, by + 2, '#b8bcc8'); A.px(bx + 3, by + 2, '#b8bcc8'); } else { A.px(bx - 1, by, '#b8bcc8'); A.px(bx + 3, by, '#b8bcc8'); A.px(bx - 2, by - 1, '#b8bcc8'); A.px(bx + 4, by - 1, '#b8bcc8'); } }
        return propFit(st, w, d, { solid: [(w - 42) / 2, d - 20, 42, 18] });
    });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 3, ox: frames[0].ox, oy: frames[0].oy, solid: frames[0].solid };
};
SPR.c1b_buffalo = (w, d) => {                          // a gamoosa: a water buffalo, slate black, sparse-haired, horns swept back flat along its head, standing in the clover chewing; an egret riding on its back
    const B = ['#5a5c68', '#3c3e48', '#26272e', '#16161a'], frames = [0, 1, 0, 0].map(f => {
        const st = propStage(w, d, 62, 42), { A } = st, x = st.x, y = st.y + 2;
        for (const [lx, c] of [[14, B[3]], [36, B[3]]]) { A.r(x + lx, y + 26, 4, 11, c); A.r(x + lx, y + 35, 4, 2, '#3a2c22'); }            // the far legs
        A.ell(x + 15, y + 20, 10, 9, B[1]); A.ell(x + 38, y + 19, 11, 10, B[1]); A.r(x + 14, y + 12, 26, 15, B[1]);                         // rump, shoulders, the barrel between
        A.ell(x + 26, y + 26, 14, 4, B[2]); A.hl(x + 10, y + 11, 30, B[0]); A.ell(x + 36, y + 13, 8, 3, B[0]); A.ell(x + 15, y + 14, 6, 3, B[0]);   // the belly in shade, the back lit
        A.line(x + 14, y + 22, x + 22, y + 24, B[2]); A.line(x + 34, y + 23, x + 40, y + 20, B[2]);                                          // the haunch, the shoulder blade
        for (const lx of [10, 31]) { A.r(x + lx, y + 25, 5, 8, B[2]); A.r(x + lx + 1, y + 33, 4, 4, B[2]); A.vl(x + lx, y + 25, 8, B[1]); A.r(x + lx + 1, y + 34, 4, 2, '#5a4636'); A.hl(x + lx + 1, y + 36, 4, '#2a2018'); }   // the near legs, muddy at the hoof
        const hb = f ? 1 : 0;                                                                                                                 // the head, chewing
        A.poly([[x + 44, y + 12], [x + 50, y + 13 + hb], [x + 57, y + 22 + hb], [x + 57, y + 27 + hb], [x + 52, y + 28 + hb], [x + 46, y + 22]], B[1]);
        A.r(x + 53, y + 23 + hb, 5, 5, B[0]); A.px(x + 56, y + 24 + hb, B[3]); A.hl(x + 53, y + 28 + hb, 4, B[2]);                          // the muzzle, a nostril
        A.px(x + 50, y + 17 + hb, '#c8b8a0'); A.px(x + 51, y + 17 + hb, B[3]); A.r(x + 45, y + 18, 3, 2, B[0]);                            // an eye, an ear sticking out
        for (const [dx, dy, col, hi] of [[2, -1, '#7a766c', '#9a958a'], [0, 0, '#a8a294', '#d8d2c4']]) {                                  // the horns: thick crescents swept back over the neck, curling down at the tips
            const hx = x + 48 + dx, hy = y + 13 + hb + dy;
            for (const [p, q, r2, t] of [[0, 0, -4, -4], [-4, -4, -10, -4], [-10, -4, -14, -1]]) { A.line(hx + p, hy + q, hx + r2, hy + t, col); A.line(hx + p, hy + q + 1, hx + r2, hy + t + 1, col); }
            A.line(hx - 1, hy - 1, hx - 4, hy - 4, hi); A.line(hx - 4, hy - 4, hx - 9, hy - 4, hi); A.px(hx - 14, hy, '#4a4640'); A.px(hx - 14, hy - 1, '#4a4640');
        }
        A.line(x + 5, y + 14, x + 3, y + 28, B[2]); A.r(x + 2, y + 28, 3, 3, B[3]); if (f) A.px(x + 1, y + 27, B[2]);                       // the tail, its tuft
        // the egret: white, an S of a neck, a yellow beak
        A.ell(x + 24, y + 8, 5, 3, '#ffffff'); A.hl(x + 21, y + 10, 7, '#d8dce4'); A.px(x + 19, y + 7, '#e8ecf0');
        A.px(x + 28, y + 6, '#ffffff'); A.px(x + 29, y + 5, '#ffffff'); A.px(x + 29, y + 4, '#ffffff'); A.px(x + 28, y + 3, '#ffffff'); A.r(x + 28, y + 1, 3, 2, '#ffffff'); A.hl(x + 31, y + 2, 3, '#f0c040'); A.px(x + 29, y + 1, '#1c1814');
        A.vl(x + 23, y + 11, 1, '#3a3a40'); A.vl(x + 26, y + 11, 1, '#3a3a40');
        return propFit(st, w, d, { solid: [(w - 46) / 2, d - 12, 46, 12] });
    });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 1.5, ox: frames[0].ox, oy: frames[0].oy, solid: frames[0].solid };
};
SPR.c1b_goats = (w, d) => {                            // two baladi goats, a black one grazing and a brown one watching you, long ears flopping, tethered to a stake
    const frames = [0, 1, 1, 0].map(f => {
        const st = propStage(w, d, 50, 30), { A } = st, x = st.x, y = st.y + 5;
        const goat = (gx, gy, P, s, down) => {                                                                                              // s: 1 faces right, -1 left
            const X = dx => s > 0 ? gx + dx : gx + 18 - dx, R = (dx, dy, ww, hh, c) => A.r(s > 0 ? gx + dx : gx + 18 - dx - ww + 1, gy + dy, ww, hh, c);
            for (const lx of [3, 12]) R(lx, 10, 2, 7, P[3]);                                                                               // the far legs
            A.ell(X(8), gy + 7, 7, 4, P[1]); R(3, 3, 11, 2, P[0]); R(2, 10, 13, 1, P[2]);                                                  // the body, the lit back, the belly
            for (const lx of [2, 11]) { R(lx, 10, 2, 7, P[2]); R(lx, 16, 2, 1, '#2a2420'); }                                               // the near legs, little hooves
            R(0, 2, 2, 2, P[1]); A.px(X(0), gy + 1, P[0]);                                                                                 // the tail, up
            if (down) { R(13, 6, 3, 3, P[1]); R(15, 9, 3, 4, P[1]); R(17, 12, 2, 2, P[2]); A.px(X(15), gy + 9, P[3]); R(14, 8, 1, 4, P[3]); A.px(X(18), gy + 15, '#58a848'); }   // head down in the grass, an ear hanging
            else {
                R(13, 2, 3, 5, P[1]); R(14, -2, 4, 5, P[1]); R(18, 0, 1, 3, P[1]); A.px(X(18), gy + 2, P[2]);                              // the neck up, the head, a Roman nose
                A.px(X(16), gy - 1, '#e8c040'); A.px(X(16), gy - 2 + 0, P[3]);                                                             // the eye
                R(13, -1, 1, 5, P[3]); R(12, 3, 1, 1, P[3]);                                                                               // the long ear hanging down
                A.px(X(15), gy - 3, '#c8c0b0'); A.px(X(14), gy - 4, '#c8c0b0'); A.px(X(13), gy - 4, '#a8a094');                            // small horns curving back
                A.px(X(17), gy + 3, P[2]); A.px(X(17), gy + 4, P[3]);                                                                      // the beard
            }
        };
        A.vl(x + 24, y + 6, 12, WOOD[2]); A.px(x + 24, y + 5, WOOD[0]);
        goat(x + 29, y + 0, ['#d09060', '#b06e3e', '#8a5028', '#683a1c'], 1, false); goat(x + 0, y + 9, ['#4a4440', '#2c2826', '#1e1a18', '#141210'], 1, f);
        A.line(x + 24, y + 9, x + 15, y + (f ? 17 : 13), '#c8b888'); A.line(x + 24, y + 9, x + 42, y + 4, '#c8b888');                      // the tethers
        return propFit(st, w, d, {});
    });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 1.2, ox: frames[0].ox, oy: frames[0].oy };
};
SPR.c1b_ball = (w, d) => { const st = propStage(w, d, 8, 8), { A } = st; A.ell(st.x + 4, st.y + 4, 3, 3, '#f4f4f0'); A.px(st.x + 3, st.y + 3, '#20242c'); A.px(st.x + 5, st.y + 5, '#20242c'); A.px(st.x + 5, st.y + 2, '#20242c'); return propFit(st, w, d, { flat: true }); };

// ---- the people: nameless locals ----
Object.assign(LOOKS, {
    oldman1: { skin: 4, robe: ['#8a7a68', '#6e604e', '#524636'], head: 'skullcap', headCol: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], face: 'tache', tache: '#e0e0e0', shoeKind: 'sandals', shoe: '#5c3418' },
    oldman2: { skin: 3, robe: ['#5a6a80', '#465468', '#343e50'], head: 'turban', headCol: CLOTH.linen, face: 'beard', beard: '#d8d8d0', shoeKind: 'sandals', shoe: '#5c3418' },
    kid1: { skin: 4, top: ['#f0f0f0', '#d8d8d8', '#b0b0b0'], topKind: 'football', legs: CLOTH.black, botKind: 'shorts', hairCol: HAIRS[0], kid: true, shoeKind: 'sneakers', shoe: '#d04838' },
    kid2: { skin: 5, top: CLOTH.red, topKind: 'football', legs: CLOTH.linen, botKind: 'shorts', hairCol: HAIRS[0], kid: true, shoeKind: 'barefoot', shoe: '' },
});
Object.assign(CAST, { c1b_oldman1: 'oldman1', c1b_oldman2: 'oldman2', c1b_kid1: 'kid1', c1b_kid2: 'kid2' });

// ---- what they are, what they say ----
POKE_MAP_1B.objects.push(
    { id: 'c1b_wires1', label: 'Wires', model: 'wires', say: ['System', 'Electricity and telephone wires across the lane, sagging between two poles, and a bare bulb hung in the middle for the evenings. Somebody\'s kite is tangled in them, and has been since the spring.'] },
    { id: 'c1b_bunting', label: 'Bunting', model: 'bunting', say: ['System', 'Paper flags strung across the market lane: left up from a wedding, or put up for the next one. In Mit Rahina it\'s hard to tell the difference.'] },
    { id: 'c1b_fulcart', label: 'Ful Cart', model: 'ful cart', say: null },
    { id: 'c1b_juice', label: 'Cane Juice', model: 'cane juice', say: null },
    { id: 'c1b_qulla', label: 'Qullas', model: 'qullas', say: null },
    { id: 'c1b_butane', label: 'Butane Cart', model: 'butane cart', say: ['System', 'A cart stacked with blue and grey gas cylinders. Its owner is nowhere; you\'ll hear him before you see him, ringing a spanner on a cylinder all down the lane: ting, ting, ting.'] },
    { id: 'c1b_chickens1', label: 'Hens', model: 'hens', say: ['System', 'Three hens working the dust for anything that was ever food. One of them looks at you as if you might be.'] },
    { id: 'c1b_chickens2', label: 'Hens', model: 'hens', say: ['System', 'Hens round the tuk-tuk\'s wheels, fearless. They have outlived four tuk-tuks.'] },
    { id: 'c1b_cat', label: 'Cat', model: 'cat', say: ['System', 'A ginger cat asleep in the one warm patch of sun, belly up, absolutely certain that no one in this village would ever step on it. It\'s right.'] },
    { id: 'c1b_bicycle', label: 'Bicycle', model: 'bicycle', say: ['System', 'A black bicycle, older than its rider, leaning on its stand. A basket of bread on the back, still warm, going somewhere.'] },
    { id: 'c1b_crates', label: 'Crates', model: 'crates', say: ['System', 'Palm-rib crates of tomatoes and lemons, and a sack of onions, waiting for the stalls. The palm ribs creak when the wind moves them.'] },
    { id: 'c1b_rugs', label: 'Rugs', model: 'rugs', say: ['System', 'Three kilims airing on a line, beaten until the dust gave up. Red, blue, brown: somebody\'s grandmother wove the brown one, and it will outlast the house.'] },
    { id: 'c1b_bench', label: 'Bench', model: 'bench', say: ['System', 'A bench, a crate for a table, a game of dominoes, two glasses of tea going cold because the game matters more.'] },
    { id: 'c1b_dovecote1', label: 'Pigeon Tower', model: 'pigeon tower', say: ['System', 'A burg hamam: a pigeon tower of mud and clay pots, tall as a house, whitewashed at the top. Pigeons wheel round it all day. The droppings go on the fields; the pigeons go in the oven, stuffed with freekeh.'] },
    { id: 'c1b_dovecote2', label: 'Pigeon Tower', model: 'pigeon tower', say: ['System', 'Another pigeon tower, older, leaning a little. Its birds and the other tower\'s birds do not mix. There is a feud, going back generations, about which is which.'] },
    { id: 'c1b_buffalo', label: 'Water Buffalo', model: 'water buffalo', say: ['System', 'A gamoosa, a water buffalo, lying in the clover and chewing. An egret stands on its back, picking off flies. Neither of them has moved in an hour.'] },
    { id: 'c1b_goats', label: 'Goats', model: 'goats', say: ['System', 'Two goats tethered at the edge of the field, eating everything within the rope\'s reach, and looking hard at everything beyond it.'] },
    { id: 'c1b_ball', label: 'Football', model: 'football', say: ['System', 'A football, patched with tape, the kind that has done a thousand miles of village lanes.'] },
    { id: 'c1b_oldman1', label: 'Old Man', model: 'old man', dir: 3, say: null },
    { id: 'c1b_oldman2', label: 'Old Man', model: 'old man', dir: 1, say: null },
    { id: 'c1b_kid1', label: 'Boy', model: 'boy', wander: 40, say: null },
    { id: 'c1b_kid2', label: 'Boy', model: 'boy', wander: 44, say: null },
);
Object.assign(LINES_1B, {
    c1b_oldman1: ['Old Man', '"Double six!" He slaps the domino down so hard the tea jumps. "Inspector. Sit. We need a fourth. Ahmed cheats, but slowly, so it\'s fair."'],
    c1b_oldman2: ['Old Man', 'He doesn\'t look up from the dominoes. "The one from the inspectorate, with the new motorbike? A new motorbike and the same job. Explain that to me, and I\'ll explain it to his mother."'],
    c1b_kid1: ['Boy', '"Ahly or Zamalek?" He waits, the ball under his arm. Your whole future in this village depends on the answer.'],
    c1b_kid2: ['Boy', '"Ya ustaz! Photo! Photo!" He poses with one foot on the ball like a champion, and then runs off before you could possibly have taken it.'],
});
for (const id of ['c1b_oldman1', 'c1b_oldman2', 'c1b_kid1', 'c1b_kid2']) { const [who, text] = LINES_1B[id]; STORY_SCRIPTS[id] = id; scene(id, { speaker: who, text, choices: [{ text: 'Move on.' }] }); }

// ---- food and water ----
STORY_SCRIPTS.c1b_fulcart = 'c1b_fulcart';
scene('c1b_fulcart', {
    speaker: 'Ful Man',
    text: () => fedAt('c1b_ful_at', 90) ? `"Again? Mashallah, a stomach like a camel. Come back later."` : `A copper idra of beans simmering over a gas flame, bread stacked high, jars of pickled turnip glowing pink. The ful man is already splitting a loaf with his thumb.\n\n"Ful, Inspector? With oil, with cumin, with everything?"`,
    get choices() { const c = []; if (!fedAt('c1b_ful_at', 90)) c.push({ text: 'A ful sandwich, with everything. (2 EGP, 5 minutes)', onSelect: () => { storyPay(-2, 'Ful sandwich, Mit Rahina'); sflag('c1b_ful_at', Story.s.clock); eat(40, 'A ful sandwich'); clockAdvance(5); } }); c.push({ text: 'Move on.' }); return c; },
});
STORY_SCRIPTS.c1b_juice = 'c1b_juice';
scene('c1b_juice', {
    speaker: 'Juice Man',
    text: `'Asab: the cane goes into the press with a squeal and comes out the other side flat, and the juice runs green-gold and frothy into a glass that has been washed, approximately.\n\n"Cold, sweet, and good for the blood," the juice man says. "Doctors recommend it. Not real doctors."`,
    choices: [{ text: 'A glass of cane juice. (3 EGP)', onSelect: () => { storyPay(-3, 'Cane juice, Mit Rahina'); drink(40, 'Cane juice'); eat(6); } }, { text: 'Move on.' }],
});
STORY_SCRIPTS.c1b_qulla = 'c1b_qulla';
scene('c1b_qulla', {
    speaker: 'System',
    text: `Clay qullas on a wooden stand outside a door, a saucer on each against the dust: water for anyone who passes, the old way. The clay sweats and the water inside is cold.`,
    choices: [{ text: 'Drink.', onSelect: () => { const r = refill(); drink(40, 'Cold water from the qulla'); if (r) Notice.show(r.trim()); } }, { text: 'Move on.' }],
});
NEEDS_WHERE.inspector = 'Water: the village well, the qullas outside a house in the village, the water jars at the inspectorate, the Teti dig and the Serapeum, the cooler inside, cane juice in the village, and your canteen (in the bag, three swigs; it refills at any of them). Food: bread at the bakery, ful and ta\'ameya at the café, the ful cart, oranges from the fruit stall.';
