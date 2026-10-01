// ============================================================
// THE CODEX OF GIZA — POKE STYLE: SAQQARA'S SPRITES (poke/sprites_ch1b.js)
// Chapter 1-B's buildings and landmarks, drawn the same crisp way as the
// camp's (poke/sprites.js): flat colours, a light edge toward the sun
// (upper left), a dark one away from it, a 1-px outline round each shape.
// ============================================================

// ---- THE INSPECTORATE ----
// A two-storey government block, whitewash gone the colour of old teeth, blue shutters, bars on the
// ground floor, a flag on the roof and air conditioners dripping down the front. A blue Ministry sign
// over the door, a porch, a notice board, two plastic chairs where the tea is drunk.
SPR_L['inspectorate'] = (w, d) => {
    // the front is a grid of slots (32 px each): the door and porch in the middle one, the sign over the three
    // middle slots upstairs, windows in the rest; the notice board and the chairs have slots of their own
    const WH = 70, rd = d - 30, lift = WH - 30, st = stage(w, d, lift + 26), { A } = st, x = st.x, top = st.y - lift;
    const WW = ['#f6eed8', '#e6dcc0', '#cabc9c', '#a89878'];
    roofFlat(A, x, top, w, rd, WW);
    roofTank(A, x + 20, top + 6); roofTank(A, x + 44, top + 8); roofDish(A, x + Math.round(w * 0.62), top + 10); roofAC(A, x + Math.round(w * 0.45), top + 26); roofAC(A, x + w - 40, top + 34);
    for (const cx of [x + 2, x + w - 6]) for (let k = 0; k < 3; k++) A.vl(cx + k, top - 9 - k, 7 + k, '#9a4a2c');
    const fx = x + w - 24, fy = top - 22; A.r(fx, fy, 2, 30, '#86949e'); A.r(fx + 2, fy, 14, 3, '#d0402f'); A.r(fx + 2, fy + 3, 14, 3, '#ffffff'); A.r(fx + 2, fy + 6, 14, 3, '#20242c'); A.px(fx + 8, fy + 4, '#f0c040');
    A.r(x + 90, top + 40, 20, 10, '#c8c0a8'); for (let i = 0; i < 4; i++) A.r(x + 92 + i * 4, top + 36 - (i & 1) * 2, 3, 6, '#e8e4d8');   // old chairs stacked up here
    const wy = top + rd;
    A.r(x, wy, w, WH, WW[0]); const RR = rng('insp'); for (let k = 0; k < 5; k++) A.r(x + 4 + RR() * (w - 24) | 0, wy + 8 + RR() * (WH - 22) | 0, 8 + RR() * 10 | 0, 3, WW[1]);
    A.r(x, wy, w, 4, WW[3]); A.hl(x, wy + 4, w, WW[2]);                                                                               // the eave
    A.r(x, wy + 33, w, 4, WW[1]); A.hl(x, wy + 33, w, '#ffffff'); A.hl(x, wy + 36, w, WW[3]);                                          // the floor ledge
    A.r(x, wy + WH - 7, w, 7, WW[1]); A.hl(x, wy + WH - 7, w, WW[2]); A.hl(x, wy + WH - 1, w, WW[3]);                                  // the plinth
    const n = Math.round(w / 32), sw = w / n, mid = n >> 1, cx = i => Math.round(x + sw * (i + 0.5));
    for (let i = 0; i < n; i++) {
        const c = cx(i);
        // upstairs
        if (Math.abs(i - mid) > 1) {
            if (i === n - 1) { roofAC(A, c - 8, wy + 13); A.soft(c, wy + 28, 2, 6, '#5a6068', 0.3); }                                 // an air conditioner where a window was, dripping
            else win(A, c - 7, wy + 11, 14, 12, { frame: WW, shutters: SHUTTER, lit: i === 1 });
        }
        // downstairs
        if (i === mid) continue;
        if (i === mid - 1) { const bx = c - 7; A.r(bx, wy + 42, 14, 16, '#8e5e32'); A.r(bx + 1, wy + 43, 12, 14, '#d8b888'); for (const [a, b] of [[1, 2], [6, 4], [2, 9], [7, 10]]) A.r(bx + 1 + a, wy + 43 + b, 4, 3, '#ffffff'); A.px(bx + 3, wy + 44, '#d04838'); continue; }   // the notice board
        if (i === mid + 1) { for (const ch of [c - 10, c + 2]) { A.r(ch, wy + WH - 14, 8, 7, '#f4f4f0'); A.r(ch, wy + WH - 19, 8, 5, '#e8e8e2'); A.vl(ch, wy + WH - 7, 5, '#c8c8c0'); A.vl(ch + 7, wy + WH - 7, 5, '#c8c8c0'); } A.r(c - 2, wy + WH - 11, 4, 3, '#f0e8d8'); continue; }   // two plastic chairs, a tea glass
        const bx = c - 8; A.r(bx - 2, wy + 42, 20, 16, WW[3]); A.r(bx, wy + 44, 16, 12, '#2c3440'); A.r(bx, wy + 44, 16, 4, '#46505e');   // a barred window
        for (let k = 2; k < 16; k += 4) A.vl(bx + k, wy + 43, 14, '#5a6068'); A.r(bx - 3, wy + 56, 22, 2, WW[0]);
    }
    // the sign across the middle, upstairs: the Ministry's eagle, Arabic, English
    const sx = cx(mid - 1) - 12, sw2 = cx(mid + 1) + 12 - sx;
    A.r(sx, wy + 9, sw2, 20, '#2c5490'); A.r(sx + 1, wy + 10, sw2 - 2, 18, '#3a6ab0'); A.hl(sx + 1, wy + 10, sw2 - 2, '#5a8ad0');
    const ex = sx + 11, ey = wy + 18, GO = '#f0c040', GD = '#c89020';                                                                     // the eagle of Saladin, wings spread
    A.poly([[ex - 7, ey - 5], [ex - 1, ey - 1], [ex - 1, ey + 2], [ex - 6, ey]], GO); A.poly([[ex + 7, ey - 5], [ex + 1, ey - 1], [ex + 1, ey + 2], [ex + 6, ey]], GO);
    A.r(ex - 2, ey - 3, 4, 8, GO); A.r(ex - 1, ey - 6, 2, 3, GO); A.px(ex, ey - 6, GD); A.r(ex - 2, ey + 1, 4, 3, GD); A.poly([[ex - 3, ey + 5], [ex + 3, ey + 5], [ex, ey + 7]], GO);
    A.r(sx + 22, wy + 13, sw2 - 30, 2, '#ffffff'); for (let k = 0; k < 6; k++) A.r(sx + 24 + k * 9, wy + 12, 1, 3, '#ffffff');
    A.r(sx + 22, wy + 19, sw2 - 40, 1, '#dfe6ea'); A.r(sx + 22, wy + 23, sw2 - 52, 1, '#dfe6ea');
    // the door, under a porch on two pillars
    const dc = cx(mid), dx = dc - 9;
    A.r(dc - 16, wy + 37, 32, 4, WW[0]); A.hl(dc - 16, wy + 37, 32, '#ffffff'); A.hl(dc - 16, wy + 40, 32, WW[3]);
    for (const px of [dc - 15, dc + 12]) { A.r(px, wy + 41, 3, WH - 48, WW[0]); A.vl(px + 2, wy + 41, WH - 48, WW[3]); }
    door(A, dx, wy + WH - 29, 18, 29, ['#6a9ad8', '#3a6ab0', '#284c88', '#1a3060'], WW);
    A.r(dx - 4, wy + WH, 26, 3, '#c9b48e'); A.hl(dx - 4, wy + WH + 2, 26, '#8a7658');
    return fit(st, { light: { x: 0, y: -24, r: 60, far: 120, c: '#ffe0a0' } });
};
// a whitewashed compound wall with a blue band along its top (runs either way)
function plainWall(w, d, P, band) {
    const H = 22;
    if (w >= d) {
        const st = stage(w, 10, H + 4), { A } = st, x = st.x, y = st.y - H + 4;
        A.r(x, y, w, 4, P[0]); A.hl(x, y, w, '#ffffff'); A.r(x, y + 4, w, H, P[1]); if (band) { A.r(x, y + 4, w, 3, band[1]); A.hl(x, y + 4, w, band[0]); }
        for (let i = 0; i < w; i += 24) A.vl(x + i, y + 8, H - 8, P[2]); A.r(x, y + H + 2, w, 2, P[3]);
        for (let i = 0; i < 4; i++) A.soft(x + hash2(i, w) * (w - 10), y + 8, 3, 8 + hash2(w, i) * 8, '#8a6a4a', 0.2);
        return Object.assign(fit(st), { oy: -(st.up + 1) + (d - 10) });
    }
    const st = stage(10, d, H + 4), { A } = st, x = st.x, y = st.y - H + 4;
    A.r(x, y, 10, d, P[0]); A.vl(x, y, d, '#ffffff'); A.vl(x + 9, y, d, P[2]); if (band) A.vl(x + 1, y, d, band[0]);
    A.r(x, y + d, 10, H, P[1]); if (band) A.r(x, y + d, 10, 3, band[1]); A.r(x, y + d + H - 2, 10, 2, P[3]);
    return Object.assign(fit(st), { ox: (w - 12) / 2 });
}
SPR_L['compound wall'] = (w, d) => plainWall(w, d, ['#f6eed8', '#e6dcc0', '#cabc9c', '#a89878'], SHUTTER);
SPR_L['motorbike'] = (w, d) => {                                   // Samy's motorbike: red, a bit of chrome, a helmet on the seat
    const st = propStage(w, d, 30, 20), { A } = st, x = st.x, y = st.y;
    wheel(A, x + 6, y + 14, 5); wheel(A, x + 23, y + 14, 5);
    A.poly([[x + 6, y + 13], [x + 12, y + 6], [x + 22, y + 6], [x + 24, y + 13]], '#c83828'); A.hl(x + 12, y + 6, 10, '#f07860');
    A.r(x + 11, y + 4, 10, 3, '#20242c'); A.ell(x + 16, y + 2, 4, 3, '#f4f4f0'); A.px(x + 15, y + 1, '#ffffff');
    A.line(x + 22, y + 6, x + 25, y, '#9aa4ae'); A.r(x + 24, y - 1, 4, 2, '#3a3e48'); A.r(x + 12, y + 11, 8, 3, '#9aa4ae');
    return propFit(st, w, d, { solid: [w / 2 - 12, d - 8, 24, 8] });
};
SPR.c1b_fathicar = (w, d) => fit(carSprite(w, d, ['#e8dcc8', '#c8b898', '#a09070', '#6e6048'], { tint: '#304050', hub: '#9aa4ae', dust: true }));   // the Director's old Peugeot, cream, dusty
SPR_L['tea corner'] = (w, d) => {                                   // Umm Sabry's corner: a table, a gas ring, the kettle, a tray of glasses, a stool
    const st = propStage(w, d, 56, 26), { A } = st, x = st.x, y = st.y + 6;
    A.r(x + 4, y, 40, 6, PAL.wood[1]); A.hl(x + 4, y, 40, PAL.wood[0]); A.r(x + 4, y + 6, 40, 3, PAL.wood[2]); A.r(x + 6, y + 9, 2, 9, PAL.wood[3]); A.r(x + 40, y + 9, 2, 9, PAL.wood[3]);
    A.r(x + 8, y - 4, 10, 5, '#3a3e48'); A.ell(x + 13, y - 7, 5, 4, '#9aa4ae'); A.ell(x + 12, y - 9, 3, 1, '#dfe6ea'); A.line(x + 18, y - 7, x + 21, y - 10, '#86949e');
    A.ell(x + 30, y + 2, 9, 3, '#d8a830'); for (const k of [24, 28, 32, 36]) { A.r(x + k, y - 3, 2, 4, '#ffffff'); A.px(x + k, y - 1, '#b84020'); }
    A.r(x + 46, y + 6, 8, 3, '#2f7a3a'); A.r(x + 47, y + 9, 2, 8, WOOD[2]); A.r(x + 51, y + 9, 2, 8, WOOD[2]);                                   // a stool
    A.r(x - 2, y - 2, 6, 18, '#3a70c8'); A.ell(x + 1, y - 2, 3, 1, '#78a8e8');                                                                    // the gas bottle
    return propFit(st, w, d, { solid: [w / 2 - 24, d - 10, 48, 10] });
};

// ---- THE STEP PYRAMID OF DJOSER ----
// Six steps of weathered limestone, each face leaning in a little, coursed and patched, the corners
// crumbling; the top flat; rubble and sand drifted at the foot.
SPR_L['step pyramid'] = (w, d) => {
    const FH = 22, LD = 10, N = 6, st = stage(w, d, 48, 8), { A } = st, cx = st.x + (w >> 1), yb = st.y + d - 2, Wb = w - 16;
    const F = ['#ead6a4', '#d6bc86', '#bca070', '#94784e', '#6e583a'], LED = ['#f2e2b8', '#dcc898'];
    for (let k = 0; k < N; k++) {
        const Wk = Wb - k * Math.round((Wb - 70) / (N - 1)), fb = yb - k * (FH + LD), ft = fb - FH, x0 = cx - (Wk >> 1), x1 = cx + (Wk >> 1);
        // the ledge above this step (its top, where the next step stands back)
        A.poly([[x0 + 3, ft], [x1 - 3, ft], [x1 - 7, ft - LD], [x0 + 7, ft - LD]], LED[1]); A.hl(x0 + 7, ft - LD, Wk - 14, LED[0]);
        for (let i = 0; i < Wk / 6; i++) A.px(x0 + 8 + Math.floor(hash2(i, k * 7) * (Wk - 16)), ft - 2 - Math.floor(hash2(k, i * 3) * (LD - 3)), i % 3 ? F[2] : F[0]);
        // the face: leaning in, coursed, lit on the left and turning away on the right
        A.poly([[x0, fb], [x1, fb], [x1 - 3, ft], [x0 + 3, ft]], F[1]);
        A.poly([[x0, fb], [x0 + Math.round(Wk * 0.28), fb], [x0 + Math.round(Wk * 0.28), ft], [x0 + 3, ft]], F[0]);
        A.poly([[x1 - Math.round(Wk * 0.16), fb], [x1, fb], [x1 - 3, ft], [x1 - Math.round(Wk * 0.16), ft]], F[2]);
        for (let j = ft + 4; j < fb; j += 4) { A.hl(x0 + 2, j, Wk - 4, F[3]); for (let i = ((j >> 2) & 1) * 5; i < Wk - 6; i += 11) A.px(x0 + 3 + i + Math.floor(hash2(i, j) * 4), j + 1 + Math.floor(hash2(j, i) * 2), F[3]); }
        for (let i = 0; i < 5; i++) { const hx = x0 + 6 + Math.floor(hash2(k * 5 + i, 3) * (Wk - 20)), hy = ft + 3 + Math.floor(hash2(3, k * 5 + i) * (FH - 8)); A.r(hx, hy, 4 + (i & 1) * 3, 3, F[4]); A.hl(hx, hy + 3, 4 + (i & 1) * 3, F[0]); }   // blocks fallen out
        const bite = 4 + Math.round(hash2(k, 9) * 6);                                                                                                              // the corners, crumbling
        A.poly([[x1 - bite - 3, ft], [x1 - 3, ft], [x1 - 1, ft + bite]], LED[1]); A.poly([[x0 + 3, ft], [x0 + 3 + bite, ft], [x0 + 1, ft + bite + 2]], LED[1]);
        A.hl(x0, fb, Wk, F[4]);
    }
    const topY = yb - N * (FH + LD) + LD, tw = Wb - (N - 1) * Math.round((Wb - 70) / (N - 1)) - 14;
    A.r(cx - (tw >> 1), topY - 14, tw, 14, LED[0]); A.hl(cx - (tw >> 1), topY - 14, tw, '#fff4d8');
    for (let i = 0; i < 40; i++) { const rx = cx - (Wb >> 1) + Math.floor(hash2(i, 77) * Wb), ry = yb + 1 + Math.floor(hash2(77, i) * 4); A.r(rx, ry, 2 + (i % 3), 2, i % 2 ? F[2] : F[0]); }   // rubble at the foot
    for (const [ax, aw] of [[-(Wb >> 1) - 4, 50], [(Wb >> 1) - 46, 50], [-20, 40]]) A.ell(cx + ax + (aw >> 1), yb + 1, aw >> 1, 4, '#ecd698');
    return fit(st);
};
// the enclosure wall: pale limestone panelled like a palace façade, bastions at intervals; restored in
// places to its full height, elsewhere worn down to a stump. Runs either way.
SPR_L['niched wall'] = (w, d, o) => {
    const H = 34, P = ['#f6ecd2', '#e4d4b0', '#c8b48c', '#a08c68', '#7e6c4e'], R = rng('niche' + o.id);
    if (w >= d) {
        const st = stage(w, 10, H + 4), { A } = st, x = st.x, base = st.y + 10;
        for (let i = 0; i < w;) {
            const seg = 40 + Math.floor(R() * 40), ruined = R() < 0.35, h = ruined ? 10 + Math.floor(R() * 10) : H;
            const sx = x + i, sw = Math.min(seg, w - i), top = base - h;
            A.r(sx, top, sw, h, P[1]); A.r(sx, top, sw, 3, P[0]); A.hl(sx, top, sw, '#fffaf0');
            for (let k = 0; k < sw; k += 4) { A.vl(sx + k, top + 5, h - 7, k % 8 ? P[2] : P[3]); A.vl(sx + k + 1, top + 5, h - 7, P[0]); }
            for (let k = 12; k < sw - 8; k += 26) { A.r(sx + k, top + 2, 7, h - 2, P[0]); A.vl(sx + k + 6, top + 2, h - 2, P[3]); }   // bastions
            if (ruined) for (let k = 0; k < sw; k += 3) A.px(sx + k, top - 1 - Math.floor(hash2(k, i) * 2), P[2]);
            A.hl(sx, base - 1, sw, P[4]);
            i += seg;
        }
        return Object.assign(fit(st), { oy: -(st.up + 1) + (d - 10) });
    }
    const st = stage(12, d, H + 4), { A } = st, x = st.x, y = st.y - H + 4;
    A.r(x, y, 12, d, P[1]); A.vl(x, y, d, P[0]); A.vl(x + 11, y, d, P[3]);
    for (let j = 6; j < d; j += 8) A.hl(x + 1, y + j, 10, P[2]);
    A.r(x, y + d, 12, H, P[1]); for (let k = 0; k < 12; k += 4) A.vl(x + k, y + d + 4, H - 6, P[2]); A.r(x, y + d, 12, 3, P[0]); A.hl(x, y + d + H - 1, 12, P[4]);
    return Object.assign(fit(st), { ox: (w - 14) / 2 });
};
// the entrance: a tall gateway in the enclosure, its doorway carved as a door standing open, the
// ribbed columns of the colonnade glimpsed inside
SPR_L['entrance colonnade'] = (w, d) => {
    const st = propStage(w, d, 96, 72), { A } = st, x = st.x, y = st.y, P = ['#f6ecd2', '#e4d4b0', '#c8b48c', '#a08c68', '#7e6c4e'];
    A.r(x, y + 8, 96, 64, P[1]); A.r(x, y + 8, 96, 4, P[0]); A.hl(x, y + 8, 96, '#fffaf0');
    for (let k = 0; k < 96; k += 4) { A.vl(x + k, y + 14, 56, k % 8 ? P[2] : P[3]); A.vl(x + k + 1, y + 14, 56, P[0]); }
    A.r(x + 26, y, 44, 72, P[1]); A.r(x + 26, y, 44, 5, P[0]); A.hl(x + 26, y, 44, '#fffaf0'); A.vl(x + 69, y, 72, P[3]);          // the gate tower
    A.r(x + 36, y + 14, 24, 58, '#2a1e14');                                                                                          // the doorway, and the dark of the colonnade
    for (const cx of [x + 40, x + 51]) { A.r(cx, y + 22, 5, 50, '#8e7a58'); for (let j = y + 24; j < y + 70; j += 3) A.hl(cx, j, 5, '#b8a47c'); A.vl(cx + 4, y + 22, 50, '#5e4c38'); }
    A.poly([[x + 36, y + 14], [x + 41, y + 18], [x + 41, y + 72], [x + 36, y + 72]], P[0]); for (let j = y + 22; j < y + 70; j += 8) A.hl(x + 37, j, 4, P[3]);   // the stone door, carved standing open
    A.r(x + 34, y + 12, 28, 3, P[0]); A.hl(x + 34, y + 14, 28, P[4]);
    A.r(x + 76, y + 44, 14, 10, '#2c5490'); A.r(x + 78, y + 46, 10, 1, '#ffffff'); A.r(x + 78, y + 49, 7, 1, '#ffffff'); A.r(x + 82, y + 54, 2, 16, '#86949e');   // a Ministry sign
    A.hl(x, y + 71, 96, P[4]);
    return propFit(st, w, d, { solid: [0, 0, 1, 1] });                                                                               // (you walk through it: the walls either side stop you)
};
SPR_L['heb-sed chapels'] = (w, d) => {                             // a row of dummy chapels, white, curved roofs, false doors that never opened
    const st = propStage(w, d, 150, 44), { A } = st, x = st.x, y = st.y + 6;
    for (let i = 0; i < 4; i++) {
        const cx = x + 4 + i * 37;
        A.r(cx, y + 8, 32, 30, '#f2e6c8'); A.ell(cx + 16, y + 8, 16, 7, '#fbf3dc'); A.r(cx, y + 8, 32, 2, '#fbf3dc'); A.vl(cx + 31, y + 8, 30, '#c8b48c');
        A.r(cx + 11, y + 18, 10, 20, '#c8b48c'); A.r(cx + 13, y + 20, 6, 18, '#8e7a58'); A.hl(cx + 11, y + 17, 10, '#fffaf0');
        A.ell(cx + 16, y + 3, 4, 3, '#e4d4b0'); A.hl(cx, y + 37, 32, '#a08c68');
    }
    return propFit(st, w, d, { solid: [2, d - 12, w - 4, 12] });
};
SPR_L['serdab'] = (w, d) => {                                      // a sealed stone box against the pyramid: two holes, and in the dark behind them, the king looking out
    const st = propStage(w, d, 28, 34), { A } = st, x = st.x, y = st.y;
    A.poly([[x + 2, y + 34], [x + 26, y + 34], [x + 23, y + 4], [x + 5, y + 4]], '#d6bc86'); A.poly([[x + 5, y + 4], [x + 23, y + 4], [x + 21, y], [x + 7, y]], '#f2e2b8');
    A.vl(x + 22, y + 5, 28, '#94784e'); for (let j = y + 10; j < y + 34; j += 5) A.hl(x + 4, j, 20, '#bca070');
    for (const hx of [x + 9, x + 16]) { A.ell(hx, y + 14, 2, 2, '#1a120c'); A.px(hx, y + 14, '#f4f0e4'); }                              // his eyes, in the dark
    return propFit(st, w, d, { solid: [w / 2 - 12, d - 8, 24, 8] });
};
SPR_L['south tomb'] = (w, d) => {                                  // Djoser's South Tomb: a long wall topped with a frieze of cobras, a stair going down
    const st = propStage(w, d, 120, 48), { A } = st, x = st.x, y = st.y + 8, P = ['#f6ecd2', '#e4d4b0', '#c8b48c', '#a08c68'];
    A.r(x, y + 6, 120, 34, P[1]); A.r(x, y + 6, 120, 2, P[0]); A.vl(x + 119, y + 6, 34, P[3]); for (let k = 0; k < 120; k += 4) A.vl(x + k, y + 14, 24, P[2]);
    for (let k = 3; k < 116; k += 7) { A.r(x + k, y, 4, 7, '#d8c090'); A.ell(x + k + 2, y, 3, 2, '#e8d4a0'); A.px(x + k + 1, y, '#5e4c38'); A.px(x + k + 3, y, '#5e4c38'); }   // the cobras, hoods raised
    A.r(x + 50, y + 24, 20, 16, '#2a1e14'); for (let j = 0; j < 4; j++) A.r(x + 52, y + 26 + j * 4, 16, 2, '#6e5a44');                 // the stair
    return propFit(st, w, d, { solid: [0, d - 20, w, 20] });
};

// ---- THE COACH PARK ----
SPR.c1b_bus = (w, d) => {                                          // a tour coach, white with a blue swoosh, tinted windows, the engine idling for the air conditioning
    const st = propStage(w, d, 124, 50), { A } = st, x = st.x, y = st.y + 2;
    A.r(x + 2, y, 118, 18, '#e6eaef'); A.hl(x + 4, y, 114, '#ffffff'); A.r(x + 10, y + 4, 30, 8, '#c8ced6'); A.r(x + 70, y + 4, 24, 8, '#c8ced6');   // the roof, its hatches
    A.r(x, y + 18, 122, 26, '#f4f6f8'); A.r(x + 4, y + 20, 104, 10, '#28384a'); for (let k = 4; k < 108; k += 13) A.vl(x + k, y + 20, 10, '#e6eaef'); A.line(x + 10, y + 28, x + 16, y + 21, '#6a88a8');
    A.r(x + 110, y + 20, 10, 14, '#28384a'); A.poly([[x, y + 33], [x + 60, y + 33], [x + 90, y + 38], [x, y + 38]], '#3a6ab0'); A.poly([[x + 60, y + 33], [x + 122, y + 30], [x + 122, y + 34], [x + 90, y + 38]], '#58a6e6');
    A.r(x, y + 42, 122, 3, '#9aa4ae'); wheel(A, x + 22, y + 44, 6); wheel(A, x + 96, y + 44, 6); A.r(x + 118, y + 36, 4, 4, '#ffe890');
    return propFit(st, w, d, { solid: [w / 2 - 60, d - 20, 120, 18] });
};
SPR_L['souvenir stall'] = (w, d) => {                              // papyrus prints, little alabaster pyramids, scarabs by the kilo
    const st = propStage(w, d, 60, 40), { A } = st, x = st.x, y = st.y;
    A.r(x + 2, y + 2, 2, 36, WOOD[2]); A.r(x + 54, y + 2, 2, 36, WOOD[2]);
    for (let i = 0; i < 58; i += 6) A.r(x + i, y, 6, 8, (i / 6) & 1 ? '#f4efe4' : '#2e7a58'); for (let i = 0; i < 58; i += 6) A.poly([[x + i, y + 8], [x + i + 6, y + 8], [x + i + 3, y + 11]], (i / 6) & 1 ? '#f4efe4' : '#2e7a58');
    for (const [px, c] of [[8, '#e8d8a8'], [20, '#d8c890'], [32, '#e8d8a8']]) { A.r(x + px, y + 12, 10, 12, c); A.r(x + px + 2, y + 14, 6, 6, '#c04830'); A.px(x + px + 4, y + 16, '#2a5aa0'); }   // papyrus prints on a line
    A.r(x + 4, y + 26, 52, 6, WOOD[1]); A.hl(x + 4, y + 26, 52, WOOD[0]); A.r(x + 4, y + 32, 52, 6, WOOD[2]);
    for (let i = 0; i < 6; i++) A.poly([[x + 8 + i * 8, y + 26], [x + 11 + i * 8, y + 20], [x + 14 + i * 8, y + 26]], i & 1 ? '#f4ecd4' : '#d8c8a0');
    for (let i = 0; i < 4; i++) { A.ell(x + 44 + (i & 1) * 5, y + 24 - (i >> 1) * 2, 2, 1, '#2f8a7a'); }
    return propFit(st, w, d, { solid: [w / 2 - 28, d - 10, 56, 10] });
};
SPR.c1b_camel1 = SPR.c1b_camel2 = () => Object.assign(camel(), { anchor: true });

// ---- THE SERAPEUM ----
// Steps cut down into the rock, walled either side, to a stone doorway with a modern iron gate: the
// way into the galleries where the Apis bulls lie in their granite boxes. A sign, a lamp, a padlock.
SPR_L['serapeum entrance'] = (w, d) => {
    const W = 92, H = 54, st = propStage(w, d, W, H), { A } = st, x = st.x, y = st.y, cx = x + (W >> 1);
    const ST = ['#f2e6cc', '#dcc8a4', '#bca47e', '#8e7658', '#5e4c38'];
    A.r(x + 14, y + 4, W - 28, H - 4, ST[3]);
    for (let j = 0; j < 6; j++) { const sy = y + H - 6 - j * 7; A.r(x + 20 + j * 2, sy, W - 40 - j * 4, 6, j & 1 ? ST[1] : ST[2]); A.hl(x + 20 + j * 2, sy, W - 40 - j * 4, ST[0]); A.hl(x + 20 + j * 2, sy + 5, W - 40 - j * 4, ST[4]); }   // the steps going down
    A.r(cx - 14, y + 2, 28, 12, '#140c08'); A.r(cx - 17, y, 34, 3, ST[0]); A.vl(cx - 17, y, 14, ST[1]); A.vl(cx + 16, y, 14, ST[4]);          // the doorway at the bottom
    for (let i = cx - 13; i < cx + 14; i += 4) A.vl(i, y + 3, 11, '#4a5260'); A.hl(cx - 14, y + 8, 28, '#5a6272'); A.r(cx - 2, y + 7, 4, 4, '#c89020');   // the gate, locked
    for (const [wx, s] of [[x + 4, 1], [x + W - 18, -1]]) { A.r(wx, y + 4, 14, H - 4, ST[1]); A.hl(wx, y + 4, 14, ST[0]); for (let j = y + 10; j < y + H; j += 8) A.hl(wx, j, 14, ST[2]); A.vl(s > 0 ? wx + 13 : wx, y + 4, H - 4, ST[4]); }   // the side walls
    A.r(x + W - 12, y + 18, 20, 12, '#2c5490'); A.r(x + W - 10, y + 20, 16, 1, '#ffffff'); A.r(x + W - 10, y + 23, 12, 1, '#ffffff'); A.r(x + W - 10, y + 26, 14, 1, '#dfe6ea'); A.r(x + W - 3, y + 30, 2, 18, WOOD[3]);   // SERAPEUM
    A.r(x + 2, y + 10, 4, 3, '#3a3e48'); A.r(x + 2, y + 13, 5, 6, '#ffd878');
    return propFit(st, w, d, { solid: [(w - W) / 2, d - 10, W, 10], light: { x: -W / 2 + 4, y: -H + 16, r: 50, far: 110, c: '#ffcf80' } });
};
SPR_L['ghaffir hut'] = (w, d) => {                                 // the guard's hut: mud brick, a lean-to of palm fronds for shade, a bench built along the wall
    const st = propStage(w, d, 64, 52), { A } = st, x = st.x, y = st.y;
    A.r(x + 4, y + 10, 36, 40, '#b8906a'); for (let j = y + 14; j < y + 50; j += 4) { A.hl(x + 4, j, 36, '#9a7450'); for (let i = ((j >> 2) & 1) * 4; i < 36; i += 9) A.vl(x + 4 + i, j, 4, '#9a7450'); }
    A.r(x + 2, y + 6, 40, 6, '#d8b488'); A.hl(x + 2, y + 6, 40, '#f0d0a0'); A.r(x + 16, y + 26, 12, 24, '#3a2418'); A.r(x + 8, y + 18, 6, 6, '#2a1c14');
    A.poly([[x + 40, y + 14], [x + 64, y + 20], [x + 64, y + 24], [x + 40, y + 18]], '#8a7a40'); for (let i = 0; i < 24; i += 3) A.line(x + 40 + i, y + 14 + i / 4, x + 41 + i, y + 22 + i / 4, '#6a5a2c');
    A.r(x + 60, y + 22, 2, 28, WOOD[2]); A.r(x + 40, y + 42, 22, 5, '#c8a878'); A.hl(x + 40, y + 42, 22, '#e8c898');
    A.r(x + 44, y + 36, 6, 6, '#9aa4ae'); A.ell(x + 47, y + 36, 3, 1, '#dfe6ea');
    return propFit(st, w, d, { solid: [w / 2 - 28, d - 14, 56, 14] });
};

// ---- THE MASTABAS ----
// Low flat-topped tombs with sloping sides, of stone or mud brick, a false door in the front where the
// dead were supposed to come and go, sand drifted up against them, a corner fallen in.
SPR_L['mastaba'] = (w, d, o) => {
    const brick = /2|4/.test(o.id), H = 26, st = stage(w, d - 10, H + 6), { A } = st, x = st.x, top = st.y - H, R = rng(o.id);
    const P = brick ? ['#c8a078', '#a8845c', '#8a6a48', '#6a4e34'] : ['#ecdcb4', '#d4c098', '#b8a47c', '#8e7658'];
    A.poly([[x + 6, top], [x + w - 6, top], [x + w - 2, top + d - 10], [x + 2, top + d - 10]], P[0]);            // the flat roof
    for (let i = 0; i < 30; i++) A.px(x + 8 + Math.floor(R() * (w - 16)), top + 2 + Math.floor(R() * (d - 14)), R() < 0.5 ? P[1] : '#fffaf0');
    const fy = top + d - 10;
    A.poly([[x + 2, fy], [x + w - 2, fy], [x + w, fy + H], [x, fy + H]], P[1]);                                   // the front, battered
    for (let j = fy + 4; j < fy + H; j += 4) { A.hl(x + 1, j, w - 2, P[2]); for (let i = ((j >> 2) & 1) * 6; i < w; i += 12) A.vl(x + i, j, 4, P[2]); }
    A.poly([[x + w - 14, fy], [x + w - 2, fy], [x + w, fy + H], [x + w - 12, fy + H]], P[2]);
    const dx = x + Math.round(w * 0.35);                                                                           // the false door: a niche inside a niche
    A.r(dx, fy + 4, 20, H - 4, P[2]); A.r(dx + 3, fy + 7, 14, H - 7, P[3]); A.r(dx + 7, fy + 11, 6, H - 11, '#3a2c20'); A.r(dx + 2, fy + 3, 16, 3, P[0]);
    A.r(dx + 26, fy + H - 5, 10, 5, '#b8a47c'); A.hl(dx + 26, fy + H - 5, 10, '#e8dcc0');                           // an offering table
    const cw = 20 + Math.floor(R() * 16);                                                                           // a corner fallen in
    A.poly([[x + w - cw - 6, top], [x + w - 6, top], [x + w, fy + 10], [x + w - cw + 4, top + 4]], P[1]);
    for (let i = 0; i < 16; i++) { const rx = x + w - 10 + Math.floor(R() * 16), ry = fy + H - 4 + Math.floor(R() * 5); A.r(rx, ry, 3, 2, i & 1 ? P[1] : P[2]); }
    A.ell(x + 16, fy + H, 16, 4, '#ecd698'); A.hl(x, fy + H, w, P[3]);
    return Object.assign(fit(st), { oy: -(st.up + 1) + 10 });
};
SPR_L["robbers' hole"] = (w, d) => {                              // a hole dug by night under the mastaba's edge, spoil thrown back, a crowbar left behind
    const st = propStage(w, d, 34, 22), { A } = st, x = st.x, y = st.y;
    A.ell(x + 16, y + 12, 16, 9, PAL.sand[3]); A.ell(x + 16, y + 12, 11, 6, PAL.dirt[2]); A.ell(x + 16, y + 13, 7, 4, '#140c08');
    A.line(x + 26, y + 3, x + 33, y + 14, '#5a6272'); A.px(x + 33, y + 15, '#5a6272');
    for (let i = 0; i < 8; i++) A.r(x + 2 + Math.floor(hash2(i, 5) * 28), y + 18 + Math.floor(hash2(5, i) * 3), 2, 2, PAL.sand[2]);
    return Object.assign(propFit(st, w, d, { flat: true }), { c: st.c });
};
SPR_L['sealed tomb'] = (w, d) => {                                 // a doorway in the rock blocked with ancient masonry; above it, faint paint: a river, a woman, a boy
    const st = propStage(w, d, 56, 50), { A } = st, x = st.x, y = st.y;
    A.r(x + 6, y + 4, 44, 46, '#bca47e'); A.r(x + 4, y + 2, 48, 5, '#dcc8a4'); A.hl(x + 4, y + 2, 48, '#f2e6cc');
    A.r(x + 8, y + 7, 40, 10, '#e8dcc0'); A.r(x + 10, y + 13, 36, 2, '#6aa6de'); for (let i = 0; i < 36; i += 4) A.px(x + 10 + i, y + 12, '#9ed2f4');   // the painted lintel: the river…
    A.r(x + 16, y + 8, 3, 5, '#c85a48'); A.px(x + 17, y + 7, '#3a2418'); A.r(x + 22, y + 10, 2, 3, '#c85a48'); A.px(x + 22, y + 9, '#3a2418');                        // …a woman and a boy beside it, faded
    A.r(x + 12, y + 19, 32, 31, '#8e7658'); for (let j = y + 21; j < y + 50; j += 5) for (let i = ((j / 5) & 1) * 4; i < 30; i += 8) { A.r(x + 13 + i, j, 7, 4, '#a89070'); A.hl(x + 13 + i, j, 7, '#c8b490'); }   // the blocking
    A.line(x + 18, y + 32, x + 38, y + 32, '#c8b888'); A.ell(x + 28, y + 32, 4, 3, '#a03828'); A.px(x + 27, y + 31, '#d06848');                                     // a rope and a clay seal across it
    return propFit(st, w, d, { solid: [(w - 48) / 2, d - 8, 48, 8] });
};

// ---- MIT RAHINA: THE VILLAGE ----
// Village houses: red brick in a concrete frame, or plastered in pastel; painted doors, shutters, and
// the roof always busy: rebar left for the next floor, a water tank, a dish, washing, a pigeon loft.
// Some have the pilgrimage painted on the front: the Kaaba, a plane, a ship.
SPR_L['village house'] = (w, d, o) => {
    // two storeys on a short roof; the front is laid out on a grid of slots (one door, windows, maybe a
    // balcony or the Hajj mural), so nothing is ever drawn over anything else
    const num = +(String(o.id).match(/\d+$/) || [1])[0], R = rng(o.id), kind = [1, 0, 1, 1, 1, 0, 1, 1][(num - 1) % 8], WH = 66, rd = d - 28, lift = WH - 28, st = stage(w, d, lift + 18), { A } = st, x = st.x, top = st.y - lift;
    const PASTEL = [['#f4c8c0', '#e0a8a0', '#c08880', '#9a6860'], ['#c8dcec', '#a8c0d8', '#88a0b8', '#687e96'], ['#f4e0a8', '#e0c888', '#c0a868', '#9a8448'], ['#cce4c0', '#acc8a0', '#8ca880', '#6a8660']];
    const P = kind === 0 ? ['#d88a60', '#b8643c', '#94502e', '#6e3a20'] : PASTEL[[0, 0, 2, 1, 3, 0, 2, 1][(num - 1) % 8]];
    const CON = ['#dcd8d0', '#bcb8b0', '#9a968e', '#74706a'], FR = kind === 0 ? CON : [shade(P[0], 0.4), P[0], P[2], P[3]];
    const DOOR = [['#58a6e6', '#2e7cc4', '#2466a8', '#1a4a80'], ['#6cbc4c', '#3e8a30', '#2a6420', '#1a4414'], ['#f07860', '#d04838', '#a03028', '#70201c']][num % 3];
    // the roof: always busy
    roofFlat(A, x, top, w, rd, kind === 0 ? ['#c8c4bc', '#aeaaa2', '#94908a', '#6e6a64'] : [P[0], P[1], P[2], P[3]]);
    for (const cx of [x + 1, x + w - 5]) for (let k = 0; k < 3; k++) A.vl(cx + k, top - 9 - k, 8 + k, '#9a4a2c');                         // rebar, for the floor they'll add one day
    const stair = num % 2 === 1, sx = stair ? x + w - 30 : 0;
    if (stair) { A.r(sx, top + 6, 22, 20, CON[1]); A.r(sx, top + 6, 22, 3, CON[0]); A.vl(sx + 21, top + 6, 20, CON[3]); A.r(sx + 6, top + 13, 9, 13, DOOR[2]); A.vl(sx + 6, top + 13, 13, DOOR[1]); }   // the stair-head, its door
    const tx = x + 8 + Math.floor(R() * Math.max(1, (stair ? w - 60 : w - 34))); roofTank(A, tx, top + 3);
    if (R() < 0.7) roofDish(A, stair ? x + 8 : x + w - 20, top + rd - 22);
    const busy = [0.2, 0.6, 0.9, 0.7, 0.3, 0.6, 0.95, 0.5][(num - 1) % 8];
    if (busy < 0.45) {                                                                                                                     // the washing
        const lx0 = x + 10, lx1 = x + w - (stair ? 36 : 12), ly = top + rd - 30;
        for (let i = lx0; i <= lx1; i++) A.px(i, ly + Math.round(Math.sin((i - lx0) / (lx1 - lx0) * Math.PI) * 2), '#5a6068');
        const n = Math.max(2, Math.floor((lx1 - lx0) / 12)); for (let k = 0; k < n; k++) { const cx = lx0 + 4 + k * ((lx1 - lx0 - 8) / n) | 0, c = ['#ffffff', '#d04838', '#3a70c8', '#f0c040', '#58a848'][k % 5]; A.r(cx, ly + 2, 6, 7, c); A.hl(cx, ly + 8, 6, shade(c, -0.3)); }
    } else if (busy < 0.8) {                                                                                                               // a pigeon loft of palm ribs and old tins
        const px = x + 10, py = top + rd - 34; A.r(px, py + 6, 24, 18, WOOD[1]); A.poly([[px - 2, py + 7], [px + 12, py - 2], [px + 26, py + 7]], WOOD[3]); A.hl(px - 1, py + 6, 26, WOOD[0]);
        for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) A.ell(px + 5 + i * 7, py + 12 + j * 7, 2, 2, '#2a1c14');
        A.px(px + 3, py - 1, '#e8e8f0'); A.px(px + 4, py - 1, '#9aa4ae'); A.px(px + 20, py + 1, '#e8e8f0');                              // pigeons on the ridge
    } else { A.r(x + 12, top + rd - 26, 12, 9, '#8e5e32'); A.r(x + 12, top + rd - 30, 12, 4, '#b8844c'); A.r(x + 28, top + rd - 22, 10, 6, '#c8b488'); A.r(x + 29, top + rd - 26, 3, 4, '#c8b488'); }   // an old chair, sacks
    // the front
    const wy = top + rd;
    if (kind === 0) {                                                                                                                      // red brick in a concrete frame
        A.r(x, wy, w, WH, P[1]); for (let j = wy + 3; j < wy + WH; j += 4) { A.hl(x, j, w, P[2]); for (let i = ((j >> 2) & 1) * 5; i < w; i += 10) A.vl(x + i, j, 4, P[2]); }
    } else { A.r(x, wy, w, WH, P[0]); const RR = rng('vh' + o.id); for (let k = 0; k < 4; k++) A.r(x + 4 + RR() * (w - 20) | 0, wy + 8 + RR() * (WH - 20) | 0, 6 + RR() * 8 | 0, 3, P[1]); }
    A.r(x, wy, w, 4, FR[2]); A.hl(x, wy + 4, w, FR[3]);                                                                                   // the eave
    A.r(x, wy + 31, w, 4, FR[1]); A.hl(x, wy + 31, w, FR[0]); A.hl(x, wy + 34, w, FR[3]);                                                 // the floor ledge
    A.r(x, wy + WH - 6, w, 6, kind === 0 ? CON[1] : P[1]); A.hl(x, wy + WH - 6, w, kind === 0 ? CON[0] : P[2]); A.hl(x, wy + WH - 1, w, P[3]);   // the plinth
    const n = Math.max(2, Math.floor(w / 32)), sw = w / n, cxs = [...Array(n)].map((_, i) => Math.round(x + sw * (i + 0.5)));
    if (kind === 0) for (let i = 0; i <= n; i++) { const px = Math.min(x + w - 4, Math.max(x, Math.round(x + sw * i) - 2)); A.r(px, wy, 4, WH - 6, CON[1]); A.vl(px, wy, WH - 6, CON[0]); A.vl(px + 3, wy, WH - 6, CON[2]); }
    const shut = kind !== 0 ? DOOR : null;
    const di = Math.floor(R() * n), balc = n >= 3 && R() < 0.5 ? (di + 1 + Math.floor(R() * (n - 1))) % n : -1, mural = kind !== 0 && R() < 0.65 ? (di + (di < n - 1 ? 1 : -1)) : -1;
    cxs.forEach((cx, i) => {
        // upstairs
        if (i === balc) {                                                                                                                  // a balcony: a glass door, a rail, a pot of basil
            A.r(cx - 6, wy + 8, 12, 20, '#6aa6de'); A.r(cx - 6, wy + 8, 12, 9, '#9ed2f4'); A.vl(cx, wy + 8, 20, FR[2]); A.r(cx - 8, wy + 6, 16, 2, FR[3]);
            A.r(cx - 12, wy + 27, 24, 3, FR[1]); A.hl(cx - 12, wy + 27, 24, FR[0]); for (let k = -11; k <= 11; k += 3) A.vl(cx + k, wy + 20, 7, '#3e4650'); A.hl(cx - 12, wy + 20, 24, '#3e4650');
            A.r(cx + 6, wy + 22, 4, 5, '#b8643c'); A.ell(cx + 8, wy + 20, 3, 3, '#58a848'); A.px(cx + 7, wy + 19, '#8ad070');
        } else win(A, cx - 6, wy + 11, 12, 11, { frame: FR, shutters: shut, lit: R() < 0.25 });
        // downstairs
        if (i === di) {
            door(A, cx - 8, wy + WH - 32, 16, 26, DOOR, FR);
            A.r(cx - 2, wy + WH - 38, 5, 3, '#3e4650'); A.r(cx - 1, wy + WH - 35, 3, 2, '#fff4c0');                                          // a lamp over the door
            A.r(cx - 12, wy + WH - 30, 3, 4, '#f4f4f0'); A.px(cx - 11, wy + WH - 29, '#3a70c8');                                             // the house number
            if (R() < 0.6) { A.r(cx + 10, wy + WH - 11, 5, 5, '#b8643c'); A.hl(cx + 10, wy + WH - 11, 5, '#d88a60'); A.ell(cx + 12, wy + WH - 13, 3, 3, '#3e8a30'); A.px(cx + 11, wy + WH - 15, '#78c050'); }   // a potted plant
        } else if (i === mural) {                                                                                                           // the Hajj painted on the wall: the Kaaba, a plane, a ship
            const mx = cx - 12, my = wy + 38;
            A.r(mx + 1, my + 6, 9, 9, '#20242c'); A.hl(mx + 1, my + 9, 9, '#f0c040'); A.r(mx + 3, my + 11, 2, 4, '#c89020');
            A.poly([[mx + 12, my + 6], [mx + 22, my + 3], [mx + 23, my + 4], [mx + 14, my + 8]], '#ffffff'); A.poly([[mx + 16, my + 5], [mx + 18, my + 1], [mx + 19, my + 2], [mx + 18, my + 6]], '#ffffff');
            A.poly([[mx + 12, my + 13], [mx + 23, my + 13], [mx + 21, my + 16], [mx + 14, my + 16]], '#3a70c8'); A.vl(mx + 17, my + 9, 4, '#20242c'); A.poly([[mx + 17, my + 9], [mx + 21, my + 12], [mx + 17, my + 12]], '#ffffff');
            for (let k = 0; k < 5; k++) A.r(mx + 1 + k * 5, my + 19, 3, 1, '#2e7a58');                                                      // a line of green writing
        } else {                                                                                                                           // a window with a grille
            const wx = cx - 7, wyy = wy + 41; A.r(wx - 2, wyy - 2, 18, 16, FR[3]); A.r(wx, wyy, 14, 12, '#2c3440'); A.r(wx, wyy, 14, 5, '#46505e');
            for (let k = 2; k < 14; k += 4) A.vl(wx + k, wyy, 12, '#7a848e'); A.hl(wx, wyy + 6, 14, '#7a848e'); A.r(wx - 3, wyy + 12, 20, 2, FR[0]);
        }
    });
    A.r(cxs[di] - 10, wy + WH, 20, 3, '#c9b48e'); A.hl(cxs[di] - 10, wy + WH + 2, 20, '#8a7658');                                          // the step
    return fit(st, { doorFrac: (cxs[di] - x) / w });
};
SPR_L['mosque'] = (w, d) => {                                      // the village mosque: cream walls, arched windows, a green dome, a minaret with a balcony and a crescent
    const wallH = 44, st = stage(w, d, wallH + 100, 4), { A } = st, x = st.x, top = st.y - wallH;
    const WW = ['#fbf4e0', '#ece0c4', '#d0c0a0', '#a89878'], GR = ['#6cbc7c', '#3e8a58', '#2a6440', '#1a4028'];
    roofFlat(A, x, top, w - 34, d, WW);
    const dcx = x + Math.round((w - 34) / 2), dcy = top + 28;                                                     // the dome
    A.r(dcx - 22, dcy, 44, 10, WW[1]); A.hl(dcx - 22, dcy, 44, WW[0]);
    A.ell(dcx, dcy, 21, 20, PAL.line); A.ell(dcx, dcy, 20, 19, GR[1]); A.ell(dcx + 4, dcy + 3, 15, 14, GR[2]); A.ell(dcx - 6, dcy - 6, 9, 8, GR[0]); A.px(dcx - 9, dcy - 10, '#c8f0d0');
    A.vl(dcx, dcy - 30, 11, '#c89020'); A.ell(dcx, dcy - 20, 2, 2, '#f0c040'); A.ell(dcx + 1, dcy - 32, 3, 3, '#f0c040'); A.ell(dcx + 2, dcy - 33, 2, 2, GR[1]);
    const wy = top + d;
    A.r(x, wy, w - 34, wallH, WW[1]); A.r(x, wy, w - 34, 3, WW[3]); A.hl(x, wy + wallH - 1, w - 34, WW[3]);
    for (let i = 0; i < w - 34; i += 6) A.poly([[x + i, wy + 3], [x + i + 6, wy + 3], [x + i + 3, wy + 7]], i % 12 ? GR[1] : WW[2]);   // a crenellated band
    for (let i = 0; i < 3; i++) { const ax = x + 10 + i * Math.round((w - 60) / 2); A.ell(ax + 6, wy + 16, 6, 5, WW[3]); A.r(ax, wy + 16, 12, 16, WW[3]); A.ell(ax + 6, wy + 17, 5, 4, i === 1 ? '#3a2418' : '#88b8d8'); A.r(ax + 1, wy + 17, 10, 15, i === 1 ? '#3a2418' : '#88b8d8'); if (i !== 1) { A.vl(ax + 6, wy + 14, 18, WW[3]); A.hl(ax + 1, wy + 24, 10, WW[3]); } }
    // the minaret: a square base, an octagonal shaft in two stages with a balcony on carved brackets
    // between them, a smaller balcony, a green cap and the crescent
    const mx = x + w - 30, mc = mx + 12, base = top + d + wallH, mt = top - 60;
    A.r(mc - 11, base - 60, 22, 60, WW[1]); A.vl(mc - 11, base - 60, 60, WW[0]); A.r(mc + 7, base - 60, 4, 60, WW[2]); A.vl(mc + 10, base - 60, 60, WW[3]);   // the square base
    A.r(mc - 12, base - 62, 24, 3, WW[0]); A.hl(mc - 12, base - 60, 24, WW[3]);
    A.r(mc - 3, base - 40, 6, 12, '#3a2418'); A.ell(mc, base - 40, 3, 3, '#3a2418');                                                          // a door-sized arch, high up
    const shaft = (y0, y1, hw) => { A.r(mc - hw, y0, hw * 2, y1 - y0, WW[1]); A.vl(mc - hw, y0, y1 - y0, WW[0]); A.r(mc - hw + 1, y0, 2, y1 - y0, '#fffaf0'); A.r(mc + hw - 4, y0, 3, y1 - y0, WW[2]); A.vl(mc + hw - 1, y0, y1 - y0, WW[3]); for (let j = y0 + 6; j < y1; j += 7) A.hl(mc - hw + 1, j, hw * 2 - 2, WW[2]); };
    const balcony = (y, hw) => { for (let i = -hw; i < hw; i += 3) A.poly([[mc + i, y + 4], [mc + i + 3, y + 4], [mc + i + 1, y + 8]], WW[2]); A.r(mc - hw - 1, y, hw * 2 + 2, 4, WW[0]); A.hl(mc - hw - 1, y, hw * 2 + 2, '#ffffff'); A.hl(mc - hw - 1, y + 3, hw * 2 + 2, WW[3]); for (let i = -hw; i <= hw; i += 3) A.vl(mc + i, y - 5, 5, WW[2]); A.hl(mc - hw - 1, y - 6, hw * 2 + 2, WW[0]); };
    shaft(mt + 36, base - 62, 8);                                                                                                            // the lower shaft
    A.r(mc - 1, mt + 52, 2, 6, '#3a2418'); A.r(mc - 1, mt + 70, 2, 6, '#3a2418');                                                             // slit windows
    balcony(mt + 30, 11);
    A.r(mc - 7, mt + 36, 3, 3, '#9aa4ae'); A.r(mc + 4, mt + 36, 3, 3, '#9aa4ae');                                                             // the loudspeakers
    shaft(mt + 8, mt + 24, 6); balcony(mt + 4, 8);
    A.r(mc - 5, mt - 4, 10, 8, WW[1]); A.vl(mc + 4, mt - 4, 8, WW[3]);                                                                        // the lantern
    A.ell(mc, mt - 7, 6, 5, PAL.line); A.ell(mc, mt - 7, 5, 4, GR[1]); A.ell(mc - 2, mt - 9, 2, 2, GR[0]); A.poly([[mc - 3, mt - 10], [mc + 3, mt - 10], [mc, mt - 18]], GR[1]);   // the green cap
    A.vl(mc, mt - 25, 8, '#c89020'); A.ell(mc + 1, mt - 27, 3, 3, '#f0c040'); A.ell(mc + 2, mt - 28, 2, 2, WW[1]);                           // the crescent
    const dx = x + Math.round((w - 34) / 2) - 10;
    A.r(dx - 3, wy + wallH, 26, 3, '#dcd0b8'); A.hl(dx - 3, wy + wallH + 2, 26, '#a89878');
    for (let i = 0; i < 5; i++) A.r(dx - 16 + i * 5, wy + wallH - 3, 4, 3, ['#6a4028', '#20242c', '#8a5a3a', '#3a3e48', '#6a4028'][i]);   // shoes left at the door
    return fit(st, { light: { x: w / 2 - 18, y: -(wallH + d + 78), r: 40, far: 100, c: '#c8ffd8' } });
};
SPR_L['café'] = (w, d) => {                                       // the ahwa: green shutters folded open, a sign, a TV on a bracket; tables and chairs out front, a shisha or two
    const wallH = 38, st = stage(w, d, wallH + 12, 6), { A } = st, x = st.x, top = st.y - wallH;
    const WW = ['#f4ecd4', '#e0d4b4', '#c4b490', '#a0906c'];
    roofFlat(A, x, top, w, d - 14, WW); roofTank(A, x + 10, top + 4); roofDish(A, x + w - 22, top + 6);
    const wy = top + d - 14;
    plaster(A, x, wy, w, wallH, WW, 'cafe');
    A.r(x + 4, wy + 4, w - 8, 9, '#2e7a58'); A.hl(x + 4, wy + 4, w - 8, '#58a878'); for (let i = 10; i < w - 16; i += 10) { A.r(x + i, wy + 6, 6, 1, '#ffffff'); A.r(x + i + 2, wy + 8, 1, 3, '#ffffff'); }   // the sign
    A.r(x + 10, wy + 16, w - 20, 22, '#2a1c14'); A.r(x + 12, wy + 18, w - 24, 18, '#3e2c1e'); A.r(x + 20, wy + 20, 14, 10, '#5a4030'); A.r(x + 44, wy + 22, 20, 3, '#8a6a48');   // the dark inside
    for (const sx of [x + 4, x + w - 10]) { A.r(sx, wy + 16, 6, 22, '#3e8a58'); for (let j = wy + 18; j < wy + 38; j += 3) A.hl(sx, j, 6, '#2a6440'); }
    A.r(x + w - 34, wy + 14, 16, 11, '#20242c'); A.r(x + w - 33, wy + 15, 14, 8, '#3a70c8'); A.r(x + w - 30, wy + 17, 6, 4, '#58a848'); A.r(x + w - 27, wy + 25, 2, 3, '#5a6272');   // the TV: football
    A.soft(x, wy + wallH, w, 12, '#20141c', 0.12);
    for (const [tx, ty] of [[12, 4], [44, 6], [76, 3]]) if (tx < w - 20) {
        const cx = x + tx, cy = wy + wallH + ty;
        A.ell(cx + 8, cy + 3, 7, 3, '#dfe6ea'); A.ell(cx + 8, cy + 2, 6, 2, '#ffffff'); A.r(cx + 7, cy + 4, 2, 6, '#86949e');
        for (const ch of [cx - 4, cx + 16]) { A.r(ch, cy, 5, 5, '#8e5e32'); A.r(ch, cy + 5, 5, 2, '#b8844c'); A.vl(ch, cy + 7, 3, '#6e4424'); A.vl(ch + 4, cy + 7, 3, '#6e4424'); }
        A.r(cx + 6, cy - 2, 2, 3, '#ffffff'); A.px(cx + 6, cy - 1, '#b84020');
    }
    const sx = x + w - 16, sy = wy + wallH + 2;                                                                    // a shisha, lit
    A.ell(sx, sy + 8, 4, 3, '#3a70c8'); A.r(sx - 1, sy - 4, 2, 10, '#c89020'); A.r(sx - 3, sy - 6, 6, 3, '#9a4a2c'); A.px(sx, sy - 7, '#ff9040'); A.line(sx + 2, sy + 4, sx + 8, sy + 2, '#5a3a20');
    return fit(st, { light: { x: 0, y: -26, r: 64, far: 130, c: '#ffd890' } });
};
SPR_L['village well'] = (w, d) => {                                // the village well: an old iron hand pump over it, a stone trough, a tin cup on a chain; children fill jerrycans here
    const st = propStage(w, d, 60, 44), { A } = st, x = st.x, y = st.y;
    A.ell(x + 30, y + 38, 26, 6, '#c8a868');
    A.r(x + 6, y + 22, 48, 14, '#b8b0a0'); A.r(x + 6, y + 22, 48, 3, '#d8d0c0'); A.r(x + 9, y + 25, 42, 5, '#4a98dc'); A.hl(x + 9, y + 25, 42, '#9ed2f4'); A.hl(x + 6, y + 35, 48, '#8a8478');   // the trough
    A.r(x + 26, y + 4, 8, 20, '#3e4650'); A.vl(x + 27, y + 4, 20, '#6a7480'); A.r(x + 24, y + 2, 12, 4, '#3e4650');                                  // the pump
    A.line(x + 34, y + 4, x + 50, y - 2, '#3e4650'); A.line(x + 34, y + 5, x + 50, y - 1, '#6a7480'); A.r(x + 49, y - 4, 4, 5, '#2a2e36');                 // its handle
    A.r(x + 22, y + 10, 5, 3, '#3e4650'); A.px(x + 22, y + 13, '#9ed2f4'); A.px(x + 22, y + 16, '#9ed2f4');                                           // the spout, dripping
    A.r(x + 44, y + 28, 10, 13, '#58a848'); A.r(x + 46, y + 26, 5, 3, '#3e8a30'); A.r(x + 2, y + 30, 8, 10, '#3a70c8'); A.r(x + 4, y + 28, 4, 2, '#285496');   // jerrycans
    return propFit(st, w, d, { solid: [w / 2 - 24, d - 14, 48, 14] });
};
SPR_L['bakery'] = (w, d) => {                                      // the baladi bakery: the oven's glow through a hatch, loaves cooling on palm-rib racks out front
    const wallH = 36, frames = [0, 1].map(f => {
        const st = stage(w, d, wallH + 10, 4), { A } = st, x = st.x, top = st.y - wallH;
        roofFlat(A, x, top, w, d - 12, ['#e8dcc0', '#d4c4a0', '#b8a47c', '#8e7658']); A.r(x + w - 24, top - 10, 8, 18, '#8a6a48'); A.hl(x + w - 24, top - 10, 8, '#a8845c');
        A.px(x + w - 21, top - 14 - f, '#c8c4bc'); A.px(x + w - 19, top - 18 + f, '#dcd8d0');                                                      // the chimney, smoking
        const wy = top + d - 12;
        plaster(A, x, wy, w, wallH, ['#e8dcc0', '#d4c4a0', '#b8a47c', '#8e7658'], 'bakery');
        A.r(x + 10, wy + 12, 30, 16, '#2a1c14'); A.r(x + 14, wy + 16, 22, 10, f ? '#f09030' : '#e07820'); A.r(x + 18, wy + 19, 14, 5, f ? '#ffd060' : '#ffc040');   // the oven's mouth
        A.r(x + 46, wy + 8, w - 58, 26, '#3a2a1c'); A.r(x + 48, wy + 10, w - 62, 22, '#4a3828');
        A.r(x + 8, wy + 4, w - 16, 5, '#c85a48'); for (let i = 12; i < w - 14; i += 7) A.r(x + i, wy + 5, 4, 3, '#ffffff');
        for (let k = 0; k < 2; k++) {                                                                                                                  // the racks of loaves
            const rx = x + 8 + k * 38, ry = wy + wallH - 4;
            A.r(rx, ry, 32, 8, '#c8a060'); for (let i = 0; i < 32; i += 3) A.vl(rx + i, ry, 8, '#a07840');
            for (let i = 0; i < 5; i++) { A.ell(rx + 4 + i * 6, ry + 2, 3, 2, '#d09858'); A.px(rx + 3 + i * 6, ry + 1, '#f0c080'); }
        }
        return outline(st.c);
    });
    return { c: frames[0], frames, fps: 2, ox: -(frames[0].width - w) / 2, oy: -(wallH + 10 + 1) + 12 };
};
SPR_L['market stall'] = (w, d, o) => {                             // a wooden stall under a striped awning, its goods heaped up
    const kind = o.id.split('_').pop(), st = propStage(w, d, 92, 44), { A } = st, x = st.x, y = st.y;
    const AW = { fruit: ['#f07860', '#fff4e0'], cloth: ['#3a70c8', '#fff4e0'], spice: ['#e0a030', '#7a3a20'], veg: ['#58a848', '#fff4e0'] }[kind] || ['#d04838', '#fff4e0'];
    A.r(x + 3, y + 4, 2, 30, WOOD[2]); A.r(x + 86, y + 4, 2, 30, WOOD[2]);
    for (let i = 0; i < 90; i += 8) A.r(x + i, y, 8, 9, (i / 8) & 1 ? AW[1] : AW[0]); for (let i = 0; i < 90; i += 8) A.poly([[x + i, y + 9], [x + i + 8, y + 9], [x + i + 4, y + 13]], (i / 8) & 1 ? AW[1] : AW[0]);
    A.r(x + 2, y + 28, 86, 7, WOOD[1]); A.hl(x + 2, y + 28, 86, WOOD[0]); A.r(x + 2, y + 35, 86, 7, WOOD[2]); for (let i = 6; i < 86; i += 14) A.vl(x + i, y + 35, 7, WOOD[3]);
    const heap = (hx, col, hi) => { for (let r = 0; r < 4; r++) for (let i = 0; i < 6 - r; i++) { const vx = hx + i * 4 + r * 2, vy = y + 26 - r * 3; A.ell(vx, vy, 2, 2, col); A.px(vx - 1, vy - 1, hi); } };
    if (kind === 'fruit') { heap(x + 8, '#f09020', '#ffd080'); heap(x + 36, '#e8d040', '#fff4a0'); heap(x + 62, '#d8402c', '#ff9a80'); A.r(x + 40, y + 14, 12, 6, '#3e8a30'); for (let i = 0; i < 4; i++) A.ell(x + 42 + i * 3, y + 20, 1, 3, '#f0d040'); }
    else if (kind === 'veg') { heap(x + 8, '#d8402c', '#ff9a80'); heap(x + 36, '#d8a048', '#ffe0a0'); for (let i = 0; i < 6; i++) { A.r(x + 62 + i * 3, y + 18 + (i & 1), 2, 9, '#3e8a30'); A.px(x + 62 + i * 3, y + 18, '#78c050'); } }
    else if (kind === 'spice') { for (let i = 0; i < 5; i++) { const sx = x + 6 + i * 17, c = ['#c83818', '#e0a020', '#8a5a2c', '#58883a', '#d86020'][i]; A.r(sx, y + 18, 13, 10, '#c8a878'); A.ell(sx + 6, y + 18, 6, 3, c); A.px(sx + 4, y + 17, '#fff4d8'); } }
    else { for (let i = 0; i < 6; i++) { const c = ['#d04838', '#3a70c8', '#f0c040', '#2e7a58', '#8a4a9a', '#f4efe4'][i]; A.r(x + 8 + i * 13, y + 13, 9, 14, c); A.vl(x + 8 + i * 13, y + 13, 14, shade(c, 0.25)); A.vl(x + 16 + i * 13, y + 13, 14, shade(c, -0.3)); } }
    return propFit(st, w, d, { solid: [w / 2 - 44, d - 12, 88, 12] });
};
SPR_L['garage'] = (w, d) => {                                      // the mechanic's: the shutter rolled up; inside, an old Fiat facing out with its bonnet up, a pegboard of tools, a work lamp
    const WH = 50, rd = d - 26, lift = WH - 26, st = stage(w, d, lift + 14, 6), { A } = st, x = st.x, top = st.y - lift, R = rng('garage');
    roofFlat(A, x, top, w, rd, ['#c8c4bc', '#aeaaa2', '#94908a', '#6e6a64']);
    for (let k = 0; k < 3; k++) { A.ell(x + 20 + k * 7, top + 20 - k * 3, 8, 3, '#20242c'); A.ell(x + 20 + k * 7, top + 20 - k * 3, 4, 1, '#4a4a50'); }   // old tyres on the roof
    A.r(x + w - 34, top + 12, 18, 10, '#3a70c8'); A.r(x + w - 34, top + 12, 18, 2, '#5a90e0'); A.r(x + w - 34, top + 22, 18, 3, '#285496');         // a blue drum
    const wy = top + rd;
    corrugated(A, x, wy, w, WH, ['#b8c0c8', '#9aa4ae', '#748490', '#4c5a66']);
    // the sign: yellow, a tyre, hand-lettered
    A.r(x + 4, wy + 2, w - 8, 10, '#f0c040'); A.hl(x + 4, wy + 2, w - 8, '#ffe070'); A.hl(x + 4, wy + 11, w - 8, '#b88a18');
    A.ell(x + 12, wy + 7, 4, 4, '#20242c'); A.ell(x + 12, wy + 7, 2, 2, '#f0c040'); for (const [a, b] of [[20, 26], [30, 44], [48, 60], [64, 70]]) { A.r(x + a, wy + 5, b - a, 2, '#20242c'); A.px(x + a + 2, wy + 8, '#20242c'); }
    A.r(x + w - 30, wy + 4, 22, 6, '#d04838'); A.r(x + w - 28, wy + 6, 18, 2, '#ffffff');
    // the bay: dark, the shutter rolled up at the top
    const bx = x + 10, bw = w - 20, by = wy + 14, bh = WH - 14;
    A.r(bx, by, bw, bh, '#16161a'); A.r(bx, by, bw, 5, '#86949e'); for (let i = bx + 2; i < bx + bw - 2; i += 3) A.vl(i, by, 5, '#5a6272'); A.hl(bx, by + 5, bw, '#2a2a30');
    A.r(bx + 4, by + 8, 22, 14, '#3a3226'); for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) A.px(bx + 6 + i * 4, by + 10 + j * 4, '#5a4c38');       // the pegboard
    A.r(bx + 7, by + 11, 2, 7, '#a8b0b8'); A.r(bx + 12, by + 10, 5, 2, '#a8b0b8'); A.r(bx + 14, by + 12, 1, 6, '#a8b0b8'); A.r(bx + 19, by + 11, 4, 3, '#d04838'); A.r(bx + 20, by + 14, 1, 5, '#a8b0b8');
    A.r(bx + bw - 22, by + 8, 1, 6, '#5a6272'); A.r(bx + bw - 25, by + 14, 7, 3, '#e0c060'); A.soft(bx + bw - 22, by + 22, 16, 12, '#fff0b0', 0.12);            // the work lamp on its flex
    // the car, facing out: an old red Fiat 128, bonnet up
    const cx = bx + (bw >> 1) + 2, cb = by + bh;                                                                                                    // centre, and the ground line
    A.r(cx - 24, cb - 3, 48, 3, '#0c0c0e');                                                                                                         // its shadow
    A.r(cx - 23, cb - 7, 7, 6, '#101012'); A.r(cx + 16, cb - 7, 7, 6, '#101012'); A.hl(cx - 22, cb - 6, 5, '#3a3a40'); A.hl(cx + 17, cb - 6, 5, '#3a3a40');   // the tyres
    A.r(cx - 24, cb - 17, 48, 11, '#c83828'); A.hl(cx - 24, cb - 17, 48, '#f06850'); A.r(cx - 24, cb - 9, 48, 2, '#8a2018');                          // the body
    A.r(cx - 25, cb - 10, 50, 3, '#c8ccd0'); A.hl(cx - 25, cb - 10, 50, '#f0f4f8'); A.hl(cx - 25, cb - 8, 50, '#6a7078');                              // the chrome bumper
    A.r(cx - 5, cb - 9, 10, 4, '#f4f4f0'); A.hl(cx - 4, cb - 7, 8, '#2a4ca0');                                                                       // the number plate
    A.r(cx - 8, cb - 15, 16, 4, '#202226'); for (let i = -7; i < 8; i += 2) A.vl(cx + i, cb - 15, 4, '#8a9098'); A.hl(cx - 8, cb - 15, 16, '#c8ccd0');   // the grille
    for (const s2 of [-1, 1]) { const hx = cx + s2 * 15 - 3; A.r(hx, cb - 15, 7, 5, '#d8dce0'); A.r(hx + 1, cb - 14, 5, 3, '#fff4c0'); A.px(hx + 1, cb - 14, '#ffffff'); A.r(cx + s2 * 21 - 1, cb - 14, 3, 3, '#f09020'); }   // headlamps, indicators
    A.r(cx - 20, cb - 22, 40, 5, '#3a3e46'); for (let i = -17; i < 18; i += 6) A.r(cx + i, cb - 21, 4, 3, '#5a6068'); A.r(cx - 6, cb - 22, 12, 3, '#8a9098');   // the engine, under the bonnet
    A.poly([[cx - 21, cb - 22], [cx + 21, cb - 22], [cx + 18, cb - 36], [cx - 18, cb - 36]], '#a82c20'); A.poly([[cx - 18, cb - 34], [cx + 18, cb - 34], [cx + 17, cb - 36], [cx - 17, cb - 36]], '#e05848');   // the bonnet, propped up
    A.poly([[cx - 18, cb - 30], [cx + 18, cb - 30], [cx + 20, cb - 24], [cx - 20, cb - 24]], '#7a1c14'); A.line(cx + 12, cb - 22, cx + 14, cb - 34, '#c8ccd0');   // its underside, the prop
    for (const s2 of [-1, 1]) A.r(cx + s2 * 26 - 1, cb - 20, 3, 3, '#20242c');                                                                     // the wing mirrors
    // outside: tyres stacked, an oil drum, a jerrycan, the oil stain
    for (let k = 0; k < 4; k++) { A.ell(x + w - 6, wy + WH - 3 - k * 4, 7, 3, '#20242c'); A.ell(x + w - 6, wy + WH - 3 - k * 4, 3, 1, '#5a5a60'); }
    drum(A, x - 3, wy + WH - 20, [PAL.blue[1], PAL.blue[2], PAL.blue[3]]);
    A.r(x + 3, wy + WH - 8, 6, 8, '#d04838'); A.r(x + 4, wy + WH - 10, 3, 2, '#a02828');
    A.soft(cx - 12, wy + WH + 1, 30, 4, '#000000', 0.3);
    return fit(st);
};
SPR_L['tuk-tuk'] = (w, d) => {                                     // a tuk-tuk: red, a black canopy, fringe and stickers, the driver's seat empty for once
    const st = propStage(w, d, 46, 30), { A } = st, x = st.x, y = st.y;
    A.r(x + 4, y + 4, 38, 4, '#20242c'); for (let i = 4; i < 42; i += 3) A.px(x + i, y + 8, '#f0c040');
    A.r(x + 6, y + 8, 2, 12, '#20242c'); A.r(x + 38, y + 8, 2, 12, '#20242c');
    A.poly([[x + 2, y + 24], [x + 4, y + 12], [x + 30, y + 12], [x + 44, y + 16], [x + 44, y + 24]], '#d04838'); A.hl(x + 4, y + 12, 26, '#f07860');
    A.r(x + 8, y + 13, 16, 6, '#20242c'); A.r(x + 32, y + 15, 8, 5, '#9ed2f4'); A.r(x + 12, y + 20, 5, 3, '#f0c040'); A.r(x + 20, y + 20, 4, 3, '#3a70c8');
    wheel(A, x + 10, y + 25, 4); wheel(A, x + 38, y + 25, 4);
    return propFit(st, w, d, { solid: [w / 2 - 20, d - 8, 40, 8] });
};
SPR_L['donkey cart'] = (w, d) => {                                 // a donkey dozing in its harness, the cart behind it piled with green clover
    const st = propStage(w, d, 84, 34), { A } = st, x = st.x, y = st.y;
    A.r(x + 30, y + 12, 50, 8, WOOD[1]); A.hl(x + 30, y + 12, 50, WOOD[0]); A.r(x + 30, y + 20, 50, 4, WOOD[2]); wheel(A, x + 56, y + 26, 7, '#8e5e32');
    A.ell(x + 55, y + 8, 24, 8, '#58a848'); A.ell(x + 50, y + 5, 16, 5, '#78c050'); for (let i = 0; i < 12; i++) A.px(x + 34 + i * 3, y + 3 + (i % 3), '#a8e070');
    A.line(x + 30, y + 16, x + 22, y + 16, WOOD[2]);
    A.ell(x + 14, y + 16, 10, 6, '#8a8078'); A.ell(x + 6, y + 10, 4, 4, '#8a8078'); A.r(x + 1, y + 11, 5, 3, '#6a6058'); A.r(x + 5, y + 3, 2, 5, '#8a8078'); A.r(x + 8, y + 3, 2, 5, '#6a6058');   // the donkey, ears up
    A.r(x + 8, y + 21, 2, 8, '#6a6058'); A.r(x + 19, y + 21, 2, 8, '#6a6058'); A.px(x + 5, y + 9, '#1c1814'); A.ell(x + 14, y + 13, 6, 2, '#a8a098');
    return propFit(st, w, d, { solid: [w / 2 - 40, d - 10, 80, 10] });
};

// ---- THE MUSEUM GARDEN ----
// The colossus of Ramesses II, fallen, lying on its back as it was found: nemes striped, the false beard,
// a scroll in each fist, broken off at the knees. Under a light shade on four posts, a rail round it.
SPR_L['fallen colossus'] = (w, d) => {
    const st = stage(w, d, 40, 6), { A } = st, x = st.x, y = st.y, L = ['#f2e6c8', '#dccaa0', '#bca47e', '#94784e', '#6e583a'];
    A.r(x + 6, y + 30, w - 12, d - 40, '#d8cab0'); A.hl(x + 6, y + 30, w - 12, '#f0e4cc'); A.r(x + 6, y + d - 12, w - 12, 6, '#b8a88c'); A.hl(x + 6, y + d - 7, w - 12, '#8e8068');   // the plinth
    const sy = y + 44, sx = x + 24;                                                                                          // the statue, head to the west
    A.ell(sx + 18, sy + 18, 20, 22, L[1]); A.poly([[sx + 4, sy + 2], [sx + 30, sy + 2], [sx + 38, sy + 34], [sx - 2, sy + 34]], L[1]);   // the nemes
    for (let j = 0; j < 36; j += 4) A.hl(sx + 2, sy + j, 34, j % 8 ? L[2] : L[0]);
    A.ell(sx + 18, sy + 18, 11, 12, L[0]); A.ell(sx + 16, sy + 14, 3, 2, L[3]); A.ell(sx + 22, sy + 14, 3, 2, L[3]); A.r(sx + 18, sy + 17, 2, 6, L[2]); A.hl(sx + 15, sy + 25, 8, L[3]);   // the face, looking at the sky
    A.r(sx + 16, sy + 30, 5, 10, L[2]); A.hl(sx + 16, sy + 32, 5, L[3]); A.hl(sx + 16, sy + 36, 5, L[3]);                                                          // the beard
    const bx = sx + 40, bw = w - 110;
    A.r(bx, sy + 4, bw, 34, L[1]); A.hl(bx, sy + 4, bw, L[0]); A.hl(bx, sy + 37, bw, L[3]);                               // the body: chest, belt, kilt
    A.r(bx, sy + 4, 30, 34, L[0]); A.ell(bx + 18, sy + 12, 7, 4, L[2]); A.ell(bx + 18, sy + 30, 7, 4, L[2]);
    A.r(bx + 36, sy + 2, 8, 38, L[2]); for (let j = 4; j < 38; j += 3) A.px(bx + 38 + (j % 2) * 2, sy + j, L[4]);                                                  // the cartouche on the belt
    for (let i = bx + 46; i < bx + bw; i += 4) A.vl(i, sy + 6, 30, L[2]);                                                                                          // the pleated kilt
    for (const ay of [sy - 2, sy + 38]) { A.r(bx + 10, ay, 40, 6, L[1]); A.hl(bx + 10, ay, 40, L[0]); A.ell(bx + 52, ay + 3, 4, 4, L[2]); }                        // arms at his sides, fists round the scrolls
    const kx = bx + bw; A.r(kx, sy + 6, 20, 14, L[1]); A.r(kx, sy + 22, 20, 14, L[1]); for (const ky of [sy + 6, sy + 22]) { A.vl(kx + 20, ky, 14, L[4]); for (let j = 0; j < 14; j += 2) A.px(kx + 20 + (j % 4 ? 1 : 0), ky + j, L[3]); }   // the knees, broken off
    for (let i = 0; i < w - 12; i += 16) { A.r(x + 6 + i, y + d - 20, 2, 12, '#5a6272'); } A.r(x + 6, y + d - 20, w - 12, 2, '#86949e');                             // the rail
    for (const px of [x + 4, x + w - 8]) for (const py of [y + 2, y + d - 30]) { A.r(px, py, 4, 30, '#8e7a5a'); A.vl(px, py, 30, '#b8a47c'); }                  // the shade on its posts
    A.r(x, y - 4, w, 8, '#e8dcc0'); for (let i = 0; i < w; i += 4) A.vl(x + i, y - 4, 8, i % 8 ? '#d4c4a0' : '#f4ecd4'); A.hl(x, y + 3, w, '#8e7a5a');
    A.soft(x + 6, y + 4, w - 12, 20, '#20141c', 0.12);
    return fit(st, { solid: [4, 30, w - 8, d - 38] });
};
SPR_L['alabaster sphinx'] = (w, d) => {                            // the alabaster sphinx: calcite the colour of honey and milk, veined, a king's face on a lion's body
    const st = propStage(w, d, 124, 56), { A } = st, x = st.x, y = st.y, AL = ['#fffaf0', '#f4ead4', '#e4d4b0', '#c8b48c', '#a08c68'];
    A.r(x + 2, y + 40, 120, 14, '#c8bca8'); A.hl(x + 2, y + 40, 120, '#e4dccc'); A.hl(x + 2, y + 53, 120, '#9a9080');
    A.poly([[x + 30, y + 40], [x + 30, y + 22], [x + 50, y + 16], [x + 104, y + 18], [x + 116, y + 26], [x + 118, y + 40]], AL[1]);   // the lion's body, lying
    A.poly([[x + 50, y + 16], [x + 104, y + 18], [x + 100, y + 24], [x + 52, y + 22]], AL[0]);
    for (let i = 0; i < 8; i++) A.line(x + 56 + i * 7, y + 22 + (i % 3), x + 62 + i * 7, y + 34 - (i % 2) * 3, AL[2]);                   // the veins in the stone
    A.r(x + 4, y + 34, 32, 6, AL[1]); A.r(x + 4, y + 34, 32, 2, AL[0]); for (const px of [x + 6, x + 12, x + 18]) A.vl(px, y + 35, 4, AL[3]);   // the forepaws
    A.poly([[x + 16, y + 4], [x + 38, y + 4], [x + 42, y + 34], [x + 12, y + 34]], AL[2]); for (let j = 6; j < 34; j += 4) A.hl(x + 14, y + j, 26, j % 8 ? AL[3] : AL[1]);   // the nemes
    A.ell(x + 27, y + 16, 9, 10, AL[0]); A.ell(x + 24, y + 13, 2, 1, AL[4]); A.ell(x + 30, y + 13, 2, 1, AL[4]); A.r(x + 26, y + 15, 2, 5, AL[2]); A.hl(x + 24, y + 22, 6, AL[3]);
    A.r(x + 25, y + 26, 4, 8, AL[3]); A.r(x + 20, y + 1, 14, 4, AL[1]);                                                                  // the beard, the uraeus's stump
    A.line(x + 116, y + 26, x + 122, y + 12, AL[2]); A.px(x + 122, y + 11, AL[3]);                                                      // the tail curled up
    return propFit(st, w, d, { solid: [w / 2 - 60, d - 18, 120, 18] });
};
SPR_L['ticket kiosk'] = (w, d) => {
    const st = propStage(w, d, 40, 44), { A } = st, x = st.x, y = st.y;
    A.r(x + 2, y + 2, 36, 8, '#2c5490'); A.hl(x + 2, y + 2, 36, '#5a78b8'); A.r(x + 4, y + 10, 32, 32, '#f4ecd4'); A.vl(x + 35, y + 10, 32, '#c4b490');
    A.r(x + 8, y + 14, 24, 12, '#28384a'); A.r(x + 10, y + 26, 20, 3, '#c8b888'); A.r(x + 6, y + 4, 28, 1, '#ffffff');
    A.r(x + 10, y + 32, 20, 8, '#d8c8a0'); A.r(x + 12, y + 34, 6, 1, '#6a5a40'); A.r(x + 12, y + 36, 10, 1, '#6a5a40');
    return propFit(st, w, d, { solid: [w / 2 - 18, d - 10, 36, 10] });
};
SPR_L['statue fragments'] = (w, d) => {                            // bits of Memphis on plinths: a granite head, a column capital like a papyrus bundle, a stela
    const st = propStage(w, d, 92, 44), { A } = st, x = st.x, y = st.y;
    for (const px of [2, 34, 66]) { A.r(x + px, y + 30, 24, 12, '#c8bca8'); A.hl(x + px, y + 30, 24, '#e4dccc'); A.hl(x + px, y + 41, 24, '#8e8068'); }
    A.ell(x + 14, y + 20, 9, 10, '#5a5260'); A.ell(x + 12, y + 17, 5, 5, '#7a7280'); A.poly([[x + 6, y + 14], [x + 22, y + 14], [x + 20, y + 6], [x + 8, y + 6]], '#4a4250'); A.px(x + 12, y + 19, '#2a2430'); A.px(x + 17, y + 19, '#2a2430');   // a granite head
    for (let i = 0; i < 5; i++) A.ell(x + 40 + i * 3, y + 16, 2, 11, i & 1 ? '#d8c8a0' : '#e8dcc0'); A.r(x + 38, y + 26, 18, 4, '#c8b890');                              // a papyrus capital
    A.r(x + 70, y + 4, 16, 26, '#b8a88c'); A.ell(x + 78, y + 4, 8, 4, '#b8a88c'); A.hl(x + 70, y + 4, 16, '#e0d4bc'); for (let j = 10; j < 28; j += 3) A.hl(x + 72, y + j, 12, '#8e8068');   // a stela
    return propFit(st, w, d, { solid: [w / 2 - 44, d - 12, 88, 12] });
};
SPR.c1b_teti = (w, d, o) => SPR.ow_spoil(w, d, o); SPR.c1b_tetispoil = (w, d, o) => SPR.ow_spoil(w, d, o);
SPR.c1b_tetisieve = (w, d) => SPR.ow_sieve(w, d);
