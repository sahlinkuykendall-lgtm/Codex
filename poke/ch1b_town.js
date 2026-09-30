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
SPR.c1b_cat = () => {                                  // a ginger cat asleep in the sun, its tail flicking now and then
    const frames = [0, 1, 0, 0].map(f => {
        const st = propStage(32, 32, 20, 12), { A } = st, x = st.x, y = st.y;
        A.ell(x + 10, y + 7, 7, 4, '#e08a38'); A.ell(x + 9, y + 6, 4, 2, '#f4b068'); for (let i = 0; i < 3; i++) A.vl(x + 7 + i * 3, y + 4, 2, '#b86424');
        A.ell(x + 4, y + 7, 3, 3, '#e08a38'); A.px(x + 2, y + 4, '#e08a38'); A.px(x + 5, y + 4, '#e08a38'); A.px(x + 3, y + 7, '#5a3418'); A.px(x + 5, y + 7, '#5a3418');   // head, ears, shut eyes
        if (f) A.line(x + 16, y + 8, x + 19, y + 3, '#e08a38'); else A.line(x + 16, y + 9, x + 19, y + 10, '#e08a38');                            // the tail
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
SPR.c1b_dovecote1 = SPR.c1b_dovecote2 = (w, d) => {   // a burg hamam: a tall mud pigeon tower, rows of pots set in it, sticks to perch on, pigeons wheeling
    const st = propStage(w, d, 50, 84), { A } = st, x = st.x, y = st.y, cx = x + 25;
    A.poly([[cx - 22, y + 82], [cx + 22, y + 82], [cx + 12, y + 12], [cx - 12, y + 12]], '#b89a70'); A.poly([[cx + 6, y + 82], [cx + 22, y + 82], [cx + 12, y + 12], [cx + 4, y + 12]], '#9a7e58');   // the tower
    A.poly([[cx - 20, y + 82], [cx - 14, y + 82], [cx - 8, y + 12], [cx - 11, y + 12]], '#d4b890');
    for (let j = 0; j < 8; j++) { const yy = y + 18 + j * 8, hw = 12 + j * 1.2; for (let i = -hw + 3; i < hw - 2; i += 5) { A.ell(cx + i, yy, 2, 2, '#4a3624'); A.px(cx + i - 1, yy - 1, '#c8a878'); } if (j % 2) { A.hl(cx - hw - 2, yy + 4, 4, '#6a4a2c'); A.hl(cx + hw - 2, yy + 4, 4, '#6a4a2c'); } }
    A.r(cx - 13, y + 8, 26, 5, '#f4f0e4'); A.hl(cx - 13, y + 8, 26, '#ffffff'); A.ell(cx, y + 6, 10, 4, '#f4f0e4');                 // the whitewashed top
    for (const [a, b] of [[-6, 2], [4, 0], [16, -8], [-18, -4]]) { A.px(cx + a, y + b, '#e8e8f0'); A.px(cx + a - 1, y + b - 1, '#b8bcc8'); A.px(cx + a + 1, y + b - 1, '#b8bcc8'); }   // pigeons
    return propFit(st, w, d, { solid: [(w - 40) / 2, d - 20, 40, 18] });
};
SPR.c1b_buffalo = (w, d) => {                          // a water buffalo, black, horns swept back, lying in the clover; an egret on its back
    const st = propStage(w, d, 56, 30), { A } = st, x = st.x, y = st.y;
    A.ell(x + 26, y + 20, 18, 9, '#2a2a30'); A.ell(x + 22, y + 16, 10, 4, '#4a4a54'); A.hl(x + 12, y + 28, 30, '#16161a');
    A.ell(x + 46, y + 18, 7, 6, '#2a2a30'); A.ell(x + 50, y + 21, 4, 3, '#4a4a54'); A.px(x + 47, y + 16, '#e8e0d0');              // the head, the muzzle, an eye
    A.line(x + 42, y + 13, x + 36, y + 11, '#8a8478'); A.line(x + 36, y + 11, x + 38, y + 15, '#8a8478'); A.line(x + 48, y + 12, x + 54, y + 10, '#8a8478');   // horns
    A.ell(x + 22, y + 9, 4, 3, '#ffffff'); A.line(x + 25, y + 8, x + 28, y + 3, '#ffffff'); A.px(x + 29, y + 3, '#f0c040'); A.px(x + 20, y + 12, '#1c1814'); A.px(x + 23, y + 12, '#1c1814');   // the egret
    return propFit(st, w, d, { solid: [(w - 44) / 2, d - 12, 44, 12] });
};
SPR.c1b_goats = (w, d) => {                            // two goats, a black one and a brown one, tethered to a stake
    const st = propStage(w, d, 34, 22), { A } = st, x = st.x, y = st.y;
    const goat = (gx, gy, col, s) => { A.r(gx, gy + 4, 12, 7, col); A.hl(gx, gy + 4, 12, shade(col, 0.25)); for (const lx of [1, 4, 8, 11]) A.vl(gx + lx - (lx > 6 ? 0 : 0), gy + 11, 5, shade(col, -0.2)); const hx = s > 0 ? gx + 11 : gx - 4; A.r(hx, gy + 1, 5, 5, col); A.px(hx + (s > 0 ? 4 : 0), gy + 6, '#f4f0e4'); A.px(hx + (s > 0 ? 1 : 3), gy, shade(col, -0.4)); A.px(hx + (s > 0 ? 3 : 1), gy + 2, '#f0c040'); };
    goat(x + 2, y + 4, '#2a2420', 1); goat(x + 18, y + 2, '#a8683a', -1);
    A.vl(x + 16, y + 10, 10, WOOD[2]); A.line(x + 16, y + 11, x + 13, y + 7, '#c8b888'); A.line(x + 16, y + 11, x + 20, y + 5, '#c8b888');
    return propFit(st, w, d, {});
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
