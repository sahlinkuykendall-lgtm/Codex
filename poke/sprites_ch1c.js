// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MARSA TARFA'S SPRITES (poke/sprites_ch1c.js)
// Chapter 1-C's buildings, boats and landmarks, drawn the same crisp way
// as the others: flat colours, a light edge toward the sun (upper left),
// a dark one away from it, a 1-px outline round each shape.
// A Red Sea harbour town: whitewash and blue paint, salt and rust.
// ============================================================

const WASH = ['#fbf8f0', '#ece6da', '#d4ccbc', '#aea694'];                 // whitewash: lit, wall, shade, deep
const BLUES = [['#58a6e6', '#2e7cc4', '#2466a8', '#1a4a80'], ['#5ad0d0', '#28a8b0', '#1a8088', '#105a60'], ['#7ab0e8', '#4a88cc', '#3468a8', '#224a7c']];
const SEA_W = ['#3aa4d4', '#2e86c8', '#2468a8'];                            // the water a boat sits in
const ROOF = ['#fbf8f0', '#dcd5c5', '#c6beac', '#a49c8a'];                 // a flat concrete roof inside its whitewashed parapet

// ---- THE HOUSES ----
// Whitewashed, one storey or two, blue doors and shutters, a blue dado along the bottom; on the roof a
// water tank, nets drying, washing, a dish, rebar for the floor they'll add one day. The front is laid out
// on a grid of slots (as in Mit Rahina), so the door and the windows never overlap.
SPR_L['harbour house'] = (w, d, o) => {
    const flat = o.id === 'c1c_flat', num = flat ? 0 : +(String(o.id).match(/\d+$/) || [1])[0], R = rng(o.id);
    const two = flat || num % 3 !== 0, WH = two ? 62 : 40, rd = d - 28, lift = WH - 28, st = stage(w, d, lift + 18), { A } = st, x = st.x, top = st.y - lift;
    const B = num === 10 ? [['#7ad07a', '#3e9a3e', '#2a7a2a', '#1a541a']][0] : BLUES[num % 3], DADO = B;
    roofFlat(A, x, top, w, rd, ROOF);
    for (let k = 0; k < 3; k++) { const px = x + 8 + Math.floor(R() * (w - 30)), py = top + 8 + Math.floor(R() * (rd - 20)); A.r(px, py, 10 + Math.floor(R() * 12), 6, ROOF[2]); A.hl(px, py, 10, ROOF[0]); }   // patches where the roof was mended
    if (R() < 0.6) { const sx = x + w - 30; A.r(sx, top + 8, 22, 18, WASH[1]); A.r(sx, top + 8, 22, 3, WASH[0]); A.vl(sx + 21, top + 8, 18, WASH[3]); A.r(sx + 6, top + 14, 9, 12, B[2]); A.vl(sx + 6, top + 14, 12, B[1]); }   // the stair-head, its little door
    if (R() < 0.7) { const cx = x + 10 + Math.floor(R() * (w - 50)), cy = top + rd - 16; A.r(cx, cy, 8, 7, ['#d04838', '#3a70c8', '#f0c040', '#58a848'][num % 4]); A.r(cx, cy - 6, 8, 6, shade(['#d04838', '#3a70c8', '#f0c040', '#58a848'][num % 4], 0.2)); A.r(cx + 12, cy + 1, 7, 6, '#b8643c'); A.ell(cx + 15, cy - 1, 4, 3, '#3e8a30'); }   // a plastic chair, a pot of basil
    // the roof
    if (num === 3) for (const cx of [x + 2, x + w - 6, x + (w >> 1)]) for (let k = 0; k < 3; k++) A.vl(cx + k, top - 10 - k, 9 + k, '#9a4a2c');   // rebar, waiting for the money
    roofTank(A, x + 8 + Math.floor(R() * (w - 40)), top + 3);
    if (num === 5) { A.ell(x + w - 26, top + 14, 14, 10, '#c8d0d8'); A.ell(x + w - 28, top + 12, 10, 7, '#ffffff'); A.line(x + w - 26, top + 14, x + w - 18, top + 4, '#5a6872'); }   // the dish from the Gulf
    else if (R() < 0.5) roofDish(A, x + w - 22, top + rd - 22);
    if (num === 1 || num === 9 || flat) {                                                                                     // a net drying over the parapet
        const nx = x + 10, nw = w - 50; A.r(nx, top + rd - 8, nw, 12, '#3e8a58'); for (let i = 0; i < nw; i += 3) A.vl(nx + i, top + rd - 8, 12, '#2a6a40'); for (let j = 0; j < 12; j += 3) A.hl(nx, top + rd - 8 + j, nw, '#2a6a40');
        for (let i = 4; i < nw; i += 10) A.r(nx + i, top + rd + 2, 3, 3, '#f08030');
    }
    if (num === 7 || num === 13) {                                                                                           // the washing
        const ly = top + rd - 24; for (let i = x + 10; i < x + w - 12; i++) A.px(i, ly + Math.round(Math.sin((i - x) / w * Math.PI) * 2), '#5a6068');
        for (let k = 0; k < 6; k++) { const cx = x + 14 + k * ((w - 30) / 6) | 0, c = num === 13 ? '#ffffff' : ['#ffffff', '#d04838', '#3a70c8', '#f0c040', '#58a848', '#ffffff'][k]; A.r(cx, ly + 2, 7, 8, c); A.hl(cx, ly + 2, 7, shade(c, 0.3)); A.hl(cx, ly + 9, 7, shade(c, -0.25)); }
    }
    // the front: whitewash, patches where it has flaked, a blue dado, the eave and the floor ledge
    const wy = top + rd;
    A.r(x, wy, w, WH, WASH[1]); for (let k = 0; k < 4; k++) A.r(x + 4 + Math.floor(R() * (w - 24)), wy + 8 + Math.floor(R() * (WH - 24)), 6 + Math.floor(R() * 10), 3, WASH[2]);
    A.r(x, wy, w, 4, WASH[2]); A.hl(x, wy + 4, w, WASH[3]);
    if (two) { A.r(x, wy + 30, w, 3, WASH[0]); A.hl(x, wy + 33, w, WASH[3]); }
    A.r(x, wy + WH - 10, w, 10, DADO[1]); A.hl(x, wy + WH - 10, w, DADO[0]); A.hl(x, wy + WH - 1, w, DADO[3]);
    const n = Math.max(2, Math.floor(w / 32)), sw = w / n, cxs = [...Array(n)].map((_, i) => Math.round(x + sw * (i + 0.5)));
    const di = flat ? n >> 1 : Math.floor(R() * n), mural = num === 12 ? (di + (di < n - 1 ? 1 : -1)) : -1;
    cxs.forEach((cx, i) => {
        if (two) win(A, cx - 6, wy + 11, 12, 11, { frame: WASH, shutters: B, lit: flat ? false : R() < 0.2 });              // upstairs
        const gy = two ? wy + 38 : wy + 12;
        if (i === di) {
            door(A, cx - 8, wy + WH - 30, 16, 28, B, WASH);
            A.r(cx - 2, wy + WH - 36, 5, 3, '#3e4650'); A.r(cx - 1, wy + WH - 33, 3, 2, '#fff4c0');                               // a lamp over the door
            if (flat) { A.r(cx - 5, wy + WH - 24, 10, 8, '#fffaec'); A.hl(cx - 4, wy + WH - 22, 8, '#c03828'); A.hl(cx - 4, wy + WH - 19, 6, '#30302c'); A.px(cx, wy + WH - 25, '#5a6272'); }   // the note pinned on your door
            if (num === 6) { const hx = cx - 3, hy = wy + WH - 22; A.r(hx, hy + 2, 6, 5, '#f0c040'); for (let k = 0; k < 4; k++) A.vl(hx + k + (k > 1 ? 1 : 0), hy - 1, 3, '#f0c040'); A.px(hx + 2, hy + 4, '#2466a8'); }   // the hand of Fatima
            A.r(cx - 12, wy + WH - 28, 3, 4, '#f4f4f0'); A.px(cx - 11, wy + WH - 27, B[2]);                                        // the house number
        } else if (i === mural) {                                                                                             // the Hajj, painted by the door
            const mx = cx - 12, my = gy;
            A.r(mx + 1, my + 4, 9, 9, '#20242c'); A.hl(mx + 1, my + 7, 9, '#f0c040');
            A.poly([[mx + 12, my + 4], [mx + 22, my + 1], [mx + 23, my + 2], [mx + 14, my + 6]], '#3a70c8');
            A.poly([[mx + 12, my + 11], [mx + 23, my + 11], [mx + 21, my + 14], [mx + 14, my + 14]], '#2e7a58');
            for (let k = 0; k < 5; k++) A.r(mx + 1 + k * 5, my + 17, 3, 1, '#2e7a58');
        } else if (WH - (gy - wy) > 22) win(A, cx - 6, gy, 12, 11, { frame: WASH, shutters: B });                              // downstairs
    });
    return fit(st, { doorFrac: (cxs[di] - x) / w, light: { x: (cxs[di] - x) - (w >> 1), y: -10, r: 36, far: 70, c: '#ffe8b0' } });
};

// ---- THE MOSQUE ----
SPR_L['harbour mosque'] = (w, d) => {                              // white, a small green dome, a slim minaret with a loudspeaker, arched windows, shoes by the door
    const WH = 46, rd = d - 30, lift = WH - 30, st = stage(w, d, lift + 64), { A } = st, x = st.x, top = st.y - lift, wy = top + rd;
    roofFlat(A, x, top, w - 26, rd, WASH);
    const dx = x + Math.round((w - 26) * 0.45), dy = top + 10; A.r(dx - 16, dy + 6, 32, 10, WASH[1]); A.ell(dx, dy + 2, 16, 15, '#3e9a5a'); A.ell(dx - 4, dy - 3, 9, 8, '#5ac078'); A.ell(dx + 6, dy + 6, 6, 6, '#2e7a48');   // the dome
    A.vl(dx, dy - 22, 9, '#c89020'); A.ell(dx, dy - 24, 3, 3, '#f0c040'); A.ell(dx + 1, dy - 25, 2, 2, '#3e9a5a');            // the crescent finial
    // the minaret, on the right
    const mx = x + w - 22; A.r(mx, top - 50, 18, WH + rd + 50, WASH[1]); A.vl(mx, top - 50, WH + rd + 50, WASH[0]); A.vl(mx + 17, top - 50, WH + rd + 50, WASH[3]);
    A.r(mx - 3, top - 18, 24, 5, WASH[0]); A.hl(mx - 3, top - 14, 24, WASH[3]); for (let i = -2; i < 21; i += 3) A.px(mx + i, top - 13, WASH[3]);   // the balcony
    A.r(mx + 2, top - 62, 14, 12, WASH[1]); A.poly([[mx + 1, top - 62], [mx + 17, top - 62], [mx + 9, top - 74]], '#3e9a5a'); A.vl(mx + 9, top - 80, 6, '#c89020');
    A.r(mx + 6, top - 44, 6, 9, '#3e9a5a'); A.r(mx + 7, top - 43, 4, 7, '#1a2a20');                                        // a window up the shaft
    A.r(mx + 13, top - 30, 6, 4, '#86949e'); A.px(mx + 18, top - 29, '#3e4650');                                         // the loudspeaker
    // the front: arched windows with green frames, an arched doorway, shoes
    A.r(x, wy, w - 22, WH, WASH[1]); A.r(x, wy, w - 22, 4, WASH[2]); A.hl(x, wy + 4, w - 22, WASH[3]); A.r(x, wy + WH - 6, w - 22, 6, WASH[2]); A.hl(x, wy + WH - 1, w - 22, WASH[3]);
    A.r(x, wy + 6, w - 22, 3, '#3e9a5a');                                                                                     // a green band
    const fw = w - 22, gx = x + (fw >> 1);
    for (const ax of [x + 14, x + fw - 28]) { A.r(ax, wy + 18, 14, 16, '#3e9a5a'); A.ell(ax + 7, wy + 18, 7, 6, '#3e9a5a'); A.r(ax + 2, wy + 18, 10, 14, '#1e2a24'); A.ell(ax + 7, wy + 18, 5, 4, '#1e2a24'); A.vl(ax + 7, wy + 14, 18, '#3e9a5a'); }
    A.r(gx - 10, wy + 14, 20, WH - 14, WASH[3]); A.ell(gx, wy + 14, 10, 8, WASH[3]); A.r(gx - 8, wy + 16, 16, WH - 16, '#6a4424'); A.ell(gx, wy + 16, 8, 6, '#6a4424'); A.vl(gx, wy + 14, WH - 14, '#4a2c14');
    for (let i = 0; i < 4; i++) A.r(gx - 18 + i * 4 + (i > 1 ? 24 : 0), wy + WH - 3, 3, 2, ['#20242c', '#8a5a3a', '#3a70c8', '#20242c'][i]);   // shoes left by the door
    return fit(st, { light: { x: -12, y: -20, r: 50, far: 100, c: '#d8ffd8' } });
};

// ---- THE CAFÉ ----
SPR_L['harbour café'] = (w, d) => {                                // an awning of blue and white stripes, tables and plastic chairs out front, a TV in the dark, shishas
    const WH = 42, rd = d - 30, lift = WH - 30, st = stage(w, d, lift + 16), { A } = st, x = st.x, top = st.y - lift, wy = top + rd;
    roofFlat(A, x, top, w, rd, WASH); roofTank(A, x + 12, top + 2); roofAC(A, x + w - 34, top + rd - 18);
    A.r(x, wy, w, WH, WASH[1]); A.r(x, wy, w, 4, WASH[2]);
    A.r(x + 6, wy + 4, w - 12, 9, '#2466a8'); A.r(x + 8, wy + 6, 24, 5, '#ffffff'); for (let i = 0; i < 5; i++) A.r(x + 38 + i * 9, wy + 7, 6, 2, '#ffffff'); A.px(x + w - 14, wy + 7, '#f0c040');   // the sign: CAFÉ, and the name in Arabic
    A.r(x + 8, wy + 16, w - 16, WH - 18, '#1e2228'); A.r(x + 10, wy + 18, 18, 12, '#3a5aa0'); A.r(x + 11, wy + 19, 16, 10, '#5a90d8'); A.r(x + 13, wy + 23, 6, 4, '#58a848');   // inside: the TV, football on it
    A.r(x + w - 30, wy + 18, 14, 22, '#d04838'); A.r(x + w - 28, wy + 20, 10, 16, '#9ed2f4');                                // the drinks fridge
    for (let i = 0; i < w; i += 8) { const c = (i / 8) & 1 ? '#ffffff' : '#2e7cc4'; A.r(x + i, wy + 13, 8, 6, c); A.ell(x + i + 4, wy + 19, 4, 2, c); }   // the awning
    A.soft(x, wy + 20, w, 8, '#000000', 0.15);
    for (const tx of [x + 20, x + 60, x + 100]) { if (tx > x + w - 14) continue; A.ell(tx, wy + WH - 6, 7, 3, '#e6eaef'); A.r(tx - 1, wy + WH - 4, 2, 5, '#86949e'); for (const s of [-12, 8]) { A.r(tx + s, wy + WH - 10, 5, 6, s < 0 ? '#d04838' : '#3a70c8'); A.r(tx + s, wy + WH - 4, 5, 2, s < 0 ? '#a02828' : '#285496'); } A.r(tx - 2, wy + WH - 9, 2, 3, '#ffffff'); A.px(tx - 2, wy + WH - 8, '#b84020'); }   // tables, chairs, a glass of tea each
    A.r(x + w - 10, wy + WH - 14, 4, 12, '#3a70c8'); A.r(x + w - 9, wy + WH - 20, 2, 6, '#c89020'); A.px(x + w - 8, wy + WH - 21, '#ff9040');   // a shisha
    return fit(st, { light: { x: 0, y: -14, r: 50, far: 100, c: '#ffe0a0' } });
};

// ---- THE KIOSK ----
SPR_L['street kiosk'] = (w, d) => {                                // a tin booth: crisps and cigarettes hanging in the hatch, a fridge of cold drinks
    const st = propStage(w, d, 56, 54), { A } = st, x = st.x, y = st.y;
    A.r(x + 4, y + 4, 44, 6, '#d04838'); A.hl(x + 4, y + 4, 44, '#f07860'); A.r(x + 8, y + 6, 20, 2, '#ffffff'); A.r(x + 32, y + 6, 12, 2, '#f0c040');
    A.r(x + 6, y + 10, 40, 42, '#3a70c8'); A.vl(x + 6, y + 10, 42, '#5a90e0'); A.vl(x + 45, y + 10, 42, '#285496');
    A.r(x + 10, y + 14, 32, 22, '#20242c'); for (let i = 0; i < 6; i++) { const c = ['#f0c040', '#d04838', '#58a848', '#f07830', '#3a70c8', '#ffffff'][i]; A.r(x + 12 + i * 5, y + 15 + (i & 1) * 2, 4, 6, c); A.r(x + 12 + i * 5, y + 24 - (i & 1) * 2, 4, 5, shade(c, -0.2)); }   // packets hanging
    A.r(x + 8, y + 36, 36, 3, '#d8dce0'); A.hl(x + 8, y + 36, 36, '#ffffff');
    A.r(x + 44, y + 22, 12, 30, '#e8e8ec'); A.r(x + 46, y + 25, 8, 18, '#9ed2f4'); for (let j = 0; j < 3; j++) A.r(x + 47, y + 27 + j * 5, 6, 3, ['#d04838', '#f0c040', '#58a848'][j]);   // the fridge
    return propFit(st, w, d, { solid: [(w - 52) / 2, d - 12, 52, 12] });
};

// ---- THE PUBLIC TAP ----
SPR_L['public tap'] = (w, d) => {                                  // a little sabil: a whitewashed block, a brass tap, a stone trough, a tin cup on a chain
    const st = propStage(w, d, 30, 34), { A } = st, x = st.x, y = st.y;
    A.r(x + 6, y, 18, 22, WASH[1]); A.vl(x + 6, y, 22, WASH[0]); A.vl(x + 23, y, 22, WASH[3]); A.ell(x + 15, y, 9, 4, WASH[0]); A.r(x + 9, y + 4, 12, 4, '#3a70c8');
    A.r(x + 14, y + 10, 3, 6, '#c89020'); A.r(x + 12, y + 10, 7, 2, '#e0b030'); A.px(x + 15, y + 17, '#9ed2f4');
    A.r(x + 2, y + 22, 26, 10, '#c8c0b0'); A.r(x + 4, y + 23, 22, 5, '#4aa0dc'); A.hl(x + 5, y + 24, 8, '#a6e2f8'); A.hl(x + 2, y + 31, 26, '#8e8678');
    A.r(x + 22, y + 14, 4, 4, '#9aa4ae'); A.line(x + 21, y + 12, x + 24, y + 14, '#5a6068');
    return propFit(st, w, d, { solid: [(w - 26) / 2, d - 10, 26, 10] });
};
SPR.c1c_fulcart = (w, d, o) => SPR.c1b_fulcart(w, d, o);              // (the same sort of cart as Mit Rahina's)

// ---- RANA'S DIVE SHOP ----
SPR_L['dive shop'] = (w, d) => {                                   // blue-fronted, a big sign, a window of dive posters, tanks racked outside, wetsuits drying, the diver-down flag
    const WH = 44, rd = d - 30, lift = WH - 30, st = stage(w, d, lift + 30), { A } = st, x = st.x, top = st.y - lift, wy = top + rd;
    roofFlat(A, x, top, w, rd, WASH); roofAC(A, x + 10, top + 4);
    A.r(x + w - 40, top + 2, 30, 14, '#5a6068'); A.r(x + w - 38, top + 4, 26, 10, '#7a848e'); A.ell(x + w - 25, top + 9, 4, 4, '#3a3e48');   // the compressor
    A.r(x, wy, w, WH, '#2e7cc4'); A.vl(x, wy, WH, '#58a6e6'); A.r(x, wy, w, 4, '#1a4a80');
    A.r(x + 6, wy - 14, w - 12, 16, '#ffffff'); A.r(x + 7, wy - 13, w - 14, 14, '#f4f8fa'); for (let i = 0; i < 9; i++) A.r(x + 12 + i * 7, wy - 10, 5, 3, '#2466a8'); for (let i = 0; i < 6; i++) A.r(x + 12 + i * 7, wy - 5, 5, 2, '#d04838');   // RED SEA DIVERS
    A.ell(x + w - 20, wy - 6, 6, 6, '#f0c040'); A.ell(x + w - 20, wy - 6, 3, 3, '#2466a8');                                // a diver's mask logo
    A.r(x + 8, wy + 10, 46, 24, WASH[0]); A.r(x + 10, wy + 12, 42, 20, '#9ed2f4'); A.r(x + 12, wy + 14, 12, 16, '#2a6aa8'); A.r(x + 14, wy + 16, 8, 6, '#58c8d4'); A.r(x + 28, wy + 14, 10, 14, '#f07860'); A.r(x + 40, wy + 15, 10, 12, '#f0c040');   // the window, posters of fish
    door(A, x + 64, wy + WH - 30, 16, 28, ['#ffffff', '#e4e8ec', '#c8ccd0', '#9aa0a8'], ['#ffffff', '#e4e8ec', '#c8ccd0', '#1a4a80']);
    for (let k = 0; k < 4; k++) { const tx = x + w - 40 + k * 8; A.r(tx, wy + WH - 22, 6, 20, k & 1 ? '#f0c040' : '#c8ccd0'); A.vl(tx, wy + WH - 22, 20, '#ffffff'); A.r(tx + 1, wy + WH - 25, 4, 3, '#3a3e48'); }   // tanks racked
    A.r(x + w - 42, wy + WH - 6, 34, 3, '#5a6068');
    A.hl(x + 4, wy + 6, 58, '#5a6068'); for (const [px, c] of [[8, '#20242c'], [20, '#2a3a5a'], [32, '#20242c'], [44, '#3a2a4a']]) { A.r(x + px, wy + 7, 8, 18, c); A.r(x + px + 1, wy + 7, 2, 18, shade(c, 0.3)); }   // wetsuits drying
    const fx = x + w - 6; A.vl(fx, wy - 40, 44, '#9aa4ae'); A.r(fx - 16, wy - 40, 16, 11, '#d02818'); A.line(fx - 16, wy - 40, fx - 1, wy - 30, '#ffffff'); A.line(fx - 15, wy - 40, fx, wy - 30, '#ffffff');   // the diver-down flag
    return fit(st, { doorFrac: 72 / w, light: { x: 72 - (w >> 1), y: -14, r: 44, far: 90, c: '#d0f0ff' } });
};

// ---- NETS, THE SIGN, CRATES, BOLLARDS ----
SPR_L['nets'] = (w, d) => {                                        // nets spread to dry on poles, green and orange, the floats still on
    const st = propStage(w, d, w, 30), { A } = st, x = st.x, y = st.y;
    for (const px of [x + 2, x + w - 5, x + (w >> 1)]) { A.r(px, y + 2, 3, 28, WOOD[2]); A.vl(px, y + 2, 28, WOOD[0]); }
    const net = (nx, nw, c, c2) => { for (let i = 0; i < nw; i++) { const sag = Math.round(Math.sin(i / nw * Math.PI) * 4); A.vl(nx + i, y + 4 + sag, 18, i % 3 ? c : c2); } for (let j = 0; j < 18; j += 3) for (let i = 0; i < nw; i++) A.px(nx + i, y + 4 + j + Math.round(Math.sin(i / nw * Math.PI) * 4), c2); };
    net(x + 4, (w >> 1) - 4, '#3e8a58', '#2a6a40'); net(x + (w >> 1) + 3, (w >> 1) - 8, '#e08030', '#b86020');
    for (let i = 6; i < w - 6; i += 9) A.ell(x + i, y + 5 + Math.round(Math.sin(i / w * Math.PI * 2) * 2), 2, 2, i % 2 ? '#f0c040' : '#ffffff');
    return propFit(st, w, d, { solid: [2, d - 8, w - 4, 6] });
};
SPR_L['town sign'] = (w, d) => {
    const st = propStage(w, d, 40, 40), { A } = st, x = st.x, y = st.y;
    for (const px of [x + 6, x + 32]) A.r(px, y + 16, 2, 24, '#86949e');
    A.r(x, y, 40, 18, '#2466a8'); A.r(x + 1, y + 1, 38, 16, '#2e7cc4'); A.hl(x + 1, y + 1, 38, '#58a6e6'); A.r(x + 4, y + 4, 32, 2, '#ffffff'); A.r(x + 6, y + 10, 26, 2, '#ffffff');
    A.ell(x + 12, y + 8, 1, 1, '#1a2a3a'); A.ell(x + 29, y + 13, 1, 1, '#1a2a3a');                                            // the bullet holes
    return propFit(st, w, d, { solid: [(w - 30) / 2, d - 6, 30, 6] });
};
SPR_L['fish crates'] = (w, d) => {
    const st = propStage(w, d, 30, 34), { A } = st, x = st.x, y = st.y;
    for (let k = 0; k < 4; k++) { const cy = y + 26 - k * 7, cx = x + (k & 1 ? 4 : 0); A.r(cx, cy, 24, 7, '#2e7cc4'); A.hl(cx, cy, 24, '#58a6e6'); for (let i = 3; i < 24; i += 5) A.r(cx + i, cy + 2, 2, 3, '#1a4a80'); }
    return propFit(st, w, d, { solid: [(w - 26) / 2, d - 8, 26, 8] });
};
SPR_L['bollards'] = (w, d) => {
    const st = propStage(w, d, 30, 16), { A } = st, x = st.x, y = st.y;
    for (const bx of [x + 4, x + 20]) { A.r(bx, y + 4, 7, 10, '#3e4048'); A.vl(bx, y + 4, 10, '#6a6c74'); A.ell(bx + 3, y + 4, 4, 2, '#5a5c64'); A.ell(bx + 3, y + 3, 3, 1, '#8a8c94'); }
    A.line(x + 8, y + 9, x + 24, y + 10, '#c8a060'); A.line(x + 8, y + 10, x + 24, y + 11, '#a07840');
    return propFit(st, w, d, { solid: [4, d - 6, w - 8, 6] });
};

// ---- THE FISH MARKET, THE GRILL, THE FUEL STORE ----
SPR_L['fish market'] = (w, d) => {                                 // a corrugated roof on poles; under it, tables of ice and the night's catch
    const st = stage(w, d, 30), { A } = st, x = st.x, y = st.y, rt = y - 26;
    A.r(x, rt, w, 30, '#b8c0c8'); for (let i = 0; i < w; i += 4) { A.vl(x + i, rt, 30, '#d8dee4'); A.vl(x + i + 2, rt, 30, '#94a0aa'); } A.hl(x, rt, w, '#ffffff'); A.r(x, rt + 30, w, 3, '#748490');   // the roof
    for (let k = 0; k < 4; k++) A.soft(x + 10 + Math.floor(hash2(k, 3) * (w - 30)), rt + 6 + k * 6, 10, 3, '#8a4a2c', 0.35);                   // rust
    for (const px of [x + 2, x + w - 5, x + (w >> 1) - 1]) { A.r(px, rt + 33, 3, d - 6, '#86949e'); A.vl(px, rt + 33, d - 6, '#b8c0c8'); }
    A.r(x + 2, rt + 33, w - 4, d - 8, '#5a5e64'); A.r(x + 2, rt + 33, w - 4, 6, '#3e4248');                                                                            // the shade under the roof
    const ty = y + d - 34;
    for (const [tx0, tw] of [[6, (w >> 1) - 12], [(w >> 1) + 6, (w >> 1) - 12]]) {
        A.r(x + tx0, ty, tw, 14, '#e8f4f8'); A.hl(x + tx0, ty, tw, '#ffffff'); for (let i = 0; i < tw; i += 3) A.px(x + tx0 + i, ty + 2 + (i % 2) * 3, '#c8e0ec');   // crushed ice
        A.r(x + tx0, ty + 14, tw, 6, '#8a6a48'); A.hl(x + tx0, ty + 14, tw, '#a8845c'); A.r(x + tx0 + 2, ty + 20, 2, 10, '#6a4a2c'); A.r(x + tx0 + tw - 4, ty + 20, 2, 10, '#6a4a2c');
        for (let i = 0; i < Math.floor(tw / 9); i++) {                                                                       // the fish
            const fx = x + tx0 + 3 + i * 9, fy = ty + 3 + (i % 2) * 5, c = ['#c8ccd4', '#d85a48', '#3aa890', '#9aa4b0', '#e8a040'][(i + tx0) % 5];
            A.ell(fx + 3, fy + 2, 4, 2, c); A.poly([[fx - 2, fy], [fx, fy + 2], [fx - 2, fy + 4]], c); A.px(fx + 5, fy + 1, '#20242c'); A.hl(fx + 1, fy + 1, 4, shade(c, 0.35));
        }
    }
    A.r(x + (w >> 1) - 6, ty - 8, 12, 4, '#c89020'); A.vl(x + (w >> 1), ty - 14, 6, '#c89020'); A.ell(x + (w >> 1) - 5, ty - 4, 3, 1, '#e0b030'); A.ell(x + (w >> 1) + 5, ty - 4, 3, 1, '#e0b030');   // the scales
    return fit(st);
};
SPR_L['fish grill'] = (w, d) => {                                  // charcoal on a grate over bricks, fish on it, smoke going up; a table of bread and salad
    const frames = [0, 1].map(f => {
        const st = propStage(w, d, 64, 40), { A } = st, x = st.x, y = st.y;
        A.r(x + 4, y + 22, 30, 14, '#b85a3a'); for (let j = 0; j < 14; j += 4) A.hl(x + 4, y + 22 + j, 30, '#8a3e24'); A.hl(x + 4, y + 22, 30, '#d87a5a');
        A.r(x + 6, y + 18, 26, 5, '#2a1a14'); for (let i = 0; i < 26; i += 3) A.px(x + 6 + i, y + 19 + (i % 2), f ? '#ff8030' : '#f0c040');   // the coals
        A.hl(x + 5, y + 17, 28, '#5a6068'); for (let i = 0; i < 4; i++) { const fx = x + 8 + i * 6; A.ell(fx + 2, y + 15, 3, 2, '#c08a50'); A.hl(fx, y + 14, 4, '#e0b070'); A.px(fx + 4, y + 15, '#5a3a20'); }   // the fish
        for (let k = 0; k < 3; k++) { const sx = x + 12 + k * 7 + (f ? 1 : -1) * (k & 1 ? 1 : -1), sy = y + 8 - k * 3; A.soft(sx, sy - 6, 6, 8, '#e8e8f0', 0.35); }   // smoke
        A.r(x + 38, y + 20, 24, 4, WOOD[1]); A.hl(x + 38, y + 20, 24, WOOD[0]); A.r(x + 40, y + 24, 2, 12, WOOD[3]); A.r(x + 58, y + 24, 2, 12, WOOD[3]);   // the table
        A.ell(x + 44, y + 18, 5, 2, '#d8a868'); A.ell(x + 54, y + 18, 5, 2, '#f4f4f0'); A.px(x + 53, y + 17, '#d04838'); A.px(x + 55, y + 18, '#58a848');   // bread, salad
        return propFit(st, w, d, { solid: [(w - 60) / 2, d - 10, 60, 10] });
    });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 3, ox: frames[0].ox, oy: frames[0].oy, solid: frames[0].solid, light: { x: -12, y: -16, r: 28, far: 50, c: '#ffb060' } };
};
SPR_L['fuel store'] = (w, d) => {                                  // a block shed, a steel door with a big padlock, drums along the wall
    const WH = 34, rd = d - 24, lift = WH - 24, st = stage(w, d, lift + 6), { A } = st, x = st.x, top = st.y - lift, wy = top + rd;
    roofFlat(A, x, top, w, rd, ['#c8c4bc', '#aeaaa2', '#94908a', '#6e6a64']);
    A.r(x, wy, w, WH, '#bcb4a4'); for (let j = wy + 4; j < wy + WH; j += 6) { A.hl(x, j, w, '#a49c8c'); for (let i = ((j / 6) & 1) * 8; i < w; i += 16) A.vl(x + i, j, 6, '#a49c8c'); }
    A.r(x + 10, wy + 6, 26, WH - 6, '#5a6272'); A.r(x + 11, wy + 7, 24, WH - 7, '#748490'); for (let j = 0; j < WH - 8; j += 5) A.hl(x + 11, wy + 8 + j, 24, '#5a6272');   // the steel door
    A.r(x + 30, wy + 18, 6, 7, '#c89020'); A.ell(x + 33, wy + 17, 2, 3, '#86949e');                                         // the padlock
    A.r(x + 44, wy + 8, 30, 5, '#f0c040'); for (let i = 0; i < 4; i++) A.r(x + 46 + i * 7, wy + 9, 5, 3, '#20242c');          // DIESEL, stencilled
    A.poly([[x + 58, wy + 16], [x + 64, wy + 26], [x + 52, wy + 26]], '#f0c040'); A.vl(x + 58, wy + 19, 4, '#20242c'); A.px(x + 58, wy + 24, '#20242c');   // a warning triangle
    for (let k = 0; k < 2; k++) drum(A, x + w - 22 + k * 10, wy + WH - 18, k ? [PAL.blue[1], PAL.blue[2], PAL.blue[3]] : ['#d04838', '#a02828', '#701c14']);
    return fit(st);
};

// ---- BOATS ----
// a boat's hull seen from the side, sitting in the water: [dark waterline below, hull, a top strake, a deck you see a little of]
function hull(A, x, y, w, h, P, bowUp) {
    const yb = y + h;
    A.poly([[x + 4, y + 4], [x + w - 6, y + 4], [x + w, y - (bowUp || 4)], [x + w - 2, yb - 2], [x + w - 10, yb], [x + 8, yb], [x, y + 6]], P[1]);
    A.poly([[x + 2, y + 4], [x + w - 6, y + 4], [x + w, y - (bowUp || 4)], [x + w - 1, y], [x + w - 6, y + 7], [x + 2, y + 7]], P[0]);
    A.hl(x + 8, yb - 1, w - 18, P[3]); A.poly([[x + 8, yb - 4], [x + w - 10, yb - 4], [x + w - 10, yb], [x + 8, yb]], P[2]);
    A.soft(x - 2, yb, w + 4, 3, '#103050', 0.35); A.hl(x + 2, yb + 1, w - 4, '#62c0e4');                                       // its shadow in the water, a ripple of light
}
SPR_L['dhow'] = (w, d) => {                                        // Zaki's Umm Kalthoum: blue and white, a red stripe, a wheelhouse like a garden shed, tyres for fenders, the lateen yard furled
    const st = stage(w, d, 80, 6), { A } = st, x = st.x, y = st.y + d - 30, R = rng('dhow');
    A.r(x + 10, y - 12, w - 30, 12, '#a8845c'); for (let i = x + 12; i < x + w - 22; i += 6) A.vl(i, y - 12, 12, '#8e6a44'); A.hl(x + 10, y - 12, w - 30, '#c8a070');   // the deck, from a little above
    hull(A, x, y, w, 26, ['#fbf8f0', '#2e7cc4', '#1a4a80', '#20242c'], 10);
    A.r(x + 6, y + 9, w - 14, 3, '#d04838');                                                                                // the red stripe
    for (let k = 0; k < 5; k++) { const tx = x + 16 + k * 24; A.ell(tx, y + 15, 4, 4, '#20242c'); A.ell(tx, y + 15, 2, 2, '#3a3c44'); }   // tyres hung along her side
    for (let k = 0; k < 6; k++) A.r(x + w - 46 + k * 5, y + 1 + (k % 2), 3, 2, '#ffffff');                                 // her name on the bow, in curling white Arabic
    const cx = x + 28; A.r(cx, y - 34, 34, 24, WASH[1]); A.vl(cx, y - 34, 24, WASH[0]); A.vl(cx + 33, y - 34, 24, WASH[3]); A.r(cx - 3, y - 38, 40, 5, '#2466a8'); A.hl(cx - 3, y - 38, 40, '#58a6e6');   // the wheelhouse
    A.r(cx + 4, y - 30, 10, 8, '#28384a'); A.r(cx + 18, y - 30, 10, 8, '#28384a'); A.line(cx + 5, y - 23, cx + 9, y - 29, '#6a8aa8'); A.r(cx + 30, y - 46, 2, 8, '#5a6068'); A.ell(cx + 31, y - 47, 2, 2, '#d04838');   // windows, a horn
    const mx = x + Math.round(w * 0.62); A.r(mx, y - 76, 3, 66, WOOD[2]); A.vl(mx, y - 76, 66, WOOD[0]);                    // the mast
    A.line(mx - 40, y - 26, mx + 30, y - 78, WOOD[3]); A.line(mx - 40, y - 25, mx + 30, y - 77, WOOD[2]);                  // the yard, slanting
    for (let i = 0; i < 70; i += 2) { const sx = mx - 40 + i, sy = y - 26 - Math.round(i * 52 / 70); A.r(sx, sy + 1, 2, 3, i % 6 ? '#ece4d0' : '#c8bca0'); }   // the sail, furled along it
    A.line(mx + 1, y - 76, x + w - 2, y - 8, '#5a5048'); A.line(mx + 1, y - 70, x + 6, y - 10, '#5a5048');                // the stays
    A.r(mx + 3, y - 50, 4, 6, '#c89020'); A.r(mx + 4, y - 49, 2, 4, '#fff0a0');                                            // a lantern on the mast
    A.r(x + w - 30, y - 16, 10, 6, '#8a6a48'); A.r(x + 8, y - 16, 14, 5, '#2e7cc4');                                         // a crate, a blue tarp
    return fit(st, { light: { x: Math.round(w * 0.62) - (w >> 1) + 5, y: -76, r: 30, far: 60, c: '#ffd890' } });
};
SPR_L['fishing boat'] = (w, d, o) => {                             // a small wooden fishing boat, an outboard tipped up, an eye on the bow so it can see in the dark
    const num = +(String(o.id).match(/\d+$/) || [1])[0], P = [['#f0c040', '#3a70c8', '#285496', '#20242c'], ['#ffffff', '#d04838', '#a02828', '#20242c'], ['#ffffff', '#2ea890', '#1a8070', '#20242c'], ['#f4f0e4', '#e08030', '#b06020', '#20242c']][num % 4];
    const st = propStage(w, d, 92, 34), { A } = st, x = st.x, y = st.y + 14;
    A.r(x + 8, y - 6, 70, 6, '#a8845c'); A.hl(x + 8, y - 6, 70, '#c8a070'); for (let i = x + 14; i < x + 76; i += 14) A.vl(i, y - 6, 6, '#8e6a44');   // the thwarts
    hull(A, x + 2, y, 84, 16, P, 8);
    if (num % 2 === 0) { A.ell(x + 76, y + 3, 3, 2, '#ffffff'); A.px(x + 76, y + 3, '#20242c'); }                              // the eye
    A.r(x - 2, y - 14, 8, 10, '#3e4048'); A.r(x, y - 4, 3, 12, '#5a5c64'); A.hl(x - 2, y - 14, 8, '#6a6c74');                // the outboard
    A.r(x + 30, y - 10, 16, 5, '#2e7a58'); for (let i = 0; i < 16; i += 3) A.vl(x + 30 + i, y - 10, 5, '#1e5a40');           // a net in the bottom
    return propFit(st, w, d, { solid: [2, d - 18, w - 4, 16] });
};
SPR_L['patrol boat'] = (w, d) => {                                 // grey, fast, a gun under canvas on the bow, CG 17 on the side
    const st = propStage(w, d, 124, 44), { A } = st, x = st.x, y = st.y + 24;
    A.r(x + 10, y - 6, 96, 6, '#9aa4ae'); A.hl(x + 10, y - 6, 96, '#c8ccd0');
    hull(A, x + 2, y, 118, 16, ['#c8ccd0', '#86949e', '#5a6272', '#20242c'], 6);
    A.r(x + 30, y - 24, 36, 18, '#c8ccd0'); A.vl(x + 30, y - 24, 18, '#e6eaef'); A.r(x + 34, y - 20, 28, 6, '#28384a'); A.r(x + 44, y - 32, 2, 8, '#5a6068'); A.r(x + 40, y - 34, 10, 3, '#86949e');   // the cabin, the radar
    A.r(x + 86, y - 12, 14, 7, '#6a7a5a'); A.line(x + 100, y - 9, x + 110, y - 11, '#3e4048');                               // the gun under its cover
    A.r(x + 70, y + 6, 4, 4, '#ffffff'); A.r(x + 76, y + 6, 4, 4, '#ffffff'); A.r(x + 82, y + 6, 2, 4, '#ffffff'); A.r(x + 86, y + 6, 4, 4, '#ffffff');   // CG 17
    A.r(x + 12, y - 16, 2, 12, '#5a6068'); A.r(x + 14, y - 16, 8, 3, '#d02818'); A.r(x + 14, y - 13, 8, 2, '#ffffff'); A.r(x + 14, y - 11, 8, 2, '#20242c');   // the flag
    return propFit(st, w, d, { solid: [2, d - 18, w - 4, 16] });
};
SPR_L['dive boat'] = (w, d) => {                                   // a white dive boat out on the reef, tanks racked, the diver-down flag
    const st = propStage(w, d, 92, 40), { A } = st, x = st.x, y = st.y + 20;
    A.r(x + 8, y - 6, 70, 6, '#e6eaef');
    hull(A, x + 2, y, 84, 16, ['#ffffff', '#e6eaef', '#2e7cc4', '#20242c'], 6);
    A.r(x + 10, y + 7, 72, 2, '#2e7cc4');
    for (let k = 0; k < 5; k++) A.r(x + 20 + k * 6, y - 14, 4, 9, k & 1 ? '#f0c040' : '#c8ccd0');
    A.r(x + 54, y - 18, 20, 12, '#ffffff'); A.r(x + 56, y - 16, 16, 4, '#28384a');
    A.vl(x + 80, y - 30, 26, '#9aa4ae'); A.r(x + 81, y - 30, 12, 8, '#d02818'); A.line(x + 81, y - 30, x + 92, y - 23, '#ffffff');
    return propFit(st, w, d, { noShadow: true });
};
SPR_L['buoy'] = () => {
    const frames = [0, 1].map(f => { const st = propStage(32, 32, 14, 16), { A } = st, x = st.x, y = st.y + f; A.ell(x + 7, y + 10, 6, 4, '#d02818'); A.hl(x + 2, y + 9, 10, '#ffffff'); A.ell(x + 5, y + 8, 2, 1, '#ff8070'); A.vl(x + 7, y + 1, 7, '#5a6068'); A.hl(x + 1, y + 14, 12, '#a6e2f8'); return propFit(st, 32, 32, { noShadow: true }); });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 1, ox: frames[0].ox, oy: frames[0].oy };
};
SPR_L['beached boat'] = (w, d) => {                                // a rowing boat pulled up on the sand, turned over, its bottom freshly tarred
    const st = propStage(w, d, 60, 22), { A } = st, x = st.x, y = st.y;
    A.ell(x + 30, y + 12, 28, 9, '#2a2420'); A.ell(x + 28, y + 9, 22, 5, '#4a403a'); A.hl(x + 6, y + 18, 48, '#c8bca0'); A.r(x + 4, y + 16, 52, 4, '#2e7cc4');
    A.vl(x + 30, y + 3, 14, '#5a5048'); A.r(x + 50, y + 18, 4, 3, '#d04838'); A.px(x + 51, y + 18, '#ff9070');               // the keel, a crab
    return propFit(st, w, d, { solid: [(w - 54) / 2, d - 12, 54, 10] });
};
SPR_L['parasol'] = (w, d) => {                                     // a palm-thatch parasol and two plastic loungers
    const st = propStage(w, d, 52, 46), { A } = st, x = st.x, y = st.y;
    A.r(x + 25, y + 10, 2, 32, WOOD[2]);
    A.ell(x + 26, y + 10, 22, 8, '#c8a050'); for (let i = 0; i < 44; i += 3) A.line(x + 26, y + 3, x + 4 + i, y + 16 - (i % 2), '#a07830'); A.ell(x + 26, y + 6, 10, 4, '#e0c070');
    for (const lx of [x + 2, x + 32]) { A.r(lx, y + 34, 18, 4, '#ffffff'); A.r(lx, y + 30, 6, 5, '#ffffff'); A.hl(lx, y + 38, 18, '#c8ccd0'); A.vl(lx + 1, y + 38, 3, '#c8ccd0'); A.vl(lx + 16, y + 38, 3, '#c8ccd0'); }
    A.r(x + 34, y + 33, 12, 3, '#d04838'); A.hl(x + 34, y + 34, 12, '#f0c040');                                              // the towel, keeping the place since 2019
    return propFit(st, w, d, { solid: [(w - 10) / 2 - 2, d - 6, 12, 6] });
};

// ---- THE COAST GUARD POST ----
SPR_L['coast guard post'] = (w, d) => {                            // a white block with a blue stripe, a radio mast, a radar dish, the flag
    const WH = 40, rd = d - 30, lift = WH - 30, st = stage(w, d, lift + 60), { A } = st, x = st.x, top = st.y - lift, wy = top + rd;
    roofFlat(A, x, top, w, rd, WASH); roofAC(A, x + 8, top + 4);
    const mx = x + w - 24; A.vl(mx, top - 56, 64, '#86949e'); A.vl(mx + 1, top - 56, 64, '#c8ccd0'); for (let j = 0; j < 60; j += 8) A.line(mx - 3, top - 52 + j, mx + 4, top - 48 + j, '#86949e');   // the radio mast
    A.r(mx - 6, top - 58, 14, 3, '#d04838');
    A.r(x + 40, top + 6, 4, 10, '#5a6068'); A.r(x + 30, top + 2, 24, 4, '#e6eaef'); A.hl(x + 30, top + 2, 24, '#ffffff');      // the radar
    const fx = x + 18; A.r(fx, top - 34, 2, 40, '#86949e'); A.r(fx + 2, top - 34, 16, 4, '#d0402f'); A.r(fx + 2, top - 30, 16, 4, '#ffffff'); A.r(fx + 2, top - 26, 16, 4, '#20242c'); A.px(fx + 10, top - 29, '#f0c040');   // the flag
    A.r(x, wy, w, WH, WASH[1]); A.r(x, wy, w, 4, WASH[2]); A.r(x, wy + 8, w, 5, '#2466a8'); A.hl(x, wy + 8, w, '#58a6e6');    // the blue stripe
    for (let i = 0; i < 7; i++) A.r(x + 10 + i * 6, wy + 9, 4, 3, '#ffffff');                                                 // COAST GUARD
    win(A, x + 12, wy + 18, 14, 11, { frame: WASH }); win(A, x + w - 30, wy + 18, 14, 11, { frame: WASH });
    door(A, x + (w >> 1) - 8, wy + WH - 26, 16, 24, ['#86949e', '#5a6272', '#3e4650', '#2a3038'], WASH);
    for (let k = 0; k < 4; k++) { A.ell(x + 4 + k * 7, wy + WH - 3, 4, 3, '#c8b888'); A.hl(x + 1 + k * 7, wy + WH - 5, 6, '#e0d4a8'); }   // sandbags
    return fit(st, { light: { x: 0, y: -16, r: 56, far: 110, c: '#e0f0ff' } });
};

// ---- THE BEACH HOTEL ----
SPR_L['beach hotel'] = (w, d) => {                                 // two storeys of white arches, blue balcony rails, a sign with three stars, a dry fountain
    const WH = 66, rd = d - 30, lift = WH - 30, st = stage(w, d, lift + 22), { A } = st, x = st.x, top = st.y - lift, wy = top + rd;
    roofFlat(A, x, top, w, rd, WASH); roofTank(A, x + 14, top + 2); roofTank(A, x + 40, top + 3); roofAC(A, x + w - 40, top + 8); roofDish(A, x + w - 70, top + 6);
    A.r(x, wy, w, WH, WASH[1]); A.r(x, wy, w, 4, WASH[2]); A.hl(x, wy + 4, w, WASH[3]); A.r(x, wy + 32, w, 3, WASH[0]); A.hl(x, wy + 35, w, WASH[3]); A.r(x, wy + WH - 6, w, 6, WASH[2]);
    const n = Math.floor(w / 32), sw = w / n, mid = n >> 1;
    for (let i = 0; i < n; i++) {
        const cx = Math.round(x + sw * (i + 0.5));
        A.r(cx - 8, wy + 10, 16, 18, '#9ed2f4'); A.ell(cx, wy + 10, 8, 6, '#9ed2f4'); A.r(cx - 8, wy + 19, 16, 9, '#6aa6de'); A.vl(cx, wy + 6, 22, WASH[2]);   // arched windows upstairs
        A.r(cx - 12, wy + 27, 24, 3, WASH[0]); for (let k = -11; k <= 11; k += 3) A.vl(cx + k, wy + 20, 7, '#2466a8'); A.hl(cx - 12, wy + 20, 24, '#2466a8');   // balcony rails
        if (i === mid) { A.r(cx - 12, wy + 40, 24, WH - 46, WASH[3]); A.ell(cx, wy + 40, 12, 8, WASH[3]); A.r(cx - 10, wy + 42, 20, WH - 48, '#6a4424'); A.ell(cx, wy + 42, 10, 6, '#6a4424'); A.r(cx - 1, wy + 42, 2, WH - 48, '#4a2c14'); }   // the entrance
        else { A.r(cx - 9, wy + 42, 18, 16, '#2c3440'); A.ell(cx, wy + 42, 9, 6, '#2c3440'); A.r(cx - 9, wy + 50, 18, 8, '#46505e'); A.r(cx - 11, wy + 58, 22, 2, WASH[0]); }   // arches below
    }
    const sx = x + (w >> 1) - 34; A.r(sx, wy - 16, 68, 14, '#2466a8'); A.r(sx + 1, wy - 15, 66, 12, '#2e7cc4'); for (let i = 0; i < 6; i++) A.r(sx + 6 + i * 6, wy - 11, 4, 4, '#ffffff');   // BEACH HOTEL
    for (let k = 0; k < 3; k++) { const sx2 = sx + 46 + k * 7, sy = wy - 10; A.poly([[sx2, sy - 3], [sx2 + 1, sy - 1], [sx2 + 3, sy - 1], [sx2 + 1, sy + 1], [sx2 + 2, sy + 3], [sx2, sy + 2], [sx2 - 2, sy + 3], [sx2 - 1, sy + 1], [sx2 - 3, sy - 1], [sx2 - 1, sy - 1]], '#f0c040'); }   // three stars
    return fit(st, { light: { x: 0, y: -12, r: 70, far: 140, c: '#ffe8b0' } });
};

// ---- THE OTTOMAN FORT ----
// Square walls of coral stone, a round tower at each corner, crenellations, a pointed-arched gate; inside,
// a courtyard of sand. Seen from the south and a little above, like everything.
SPR_L['ottoman fort'] = (w, d) => {
    const S = ['#e8dcc4', '#d4c4a4', '#b8a684', '#948262', '#6e5e44'], st = stage(w, d, 30, 8), { A } = st, x = st.x, y = st.y, WH = 40;
    const back = y + 8, front = y + d - WH;                                                                                 // the back wall's top, the front wall's top
    A.r(x + 8, back, w - 16, front - back, '#e8d4a4'); for (let i = 0; i < 18; i++) A.px(x + 14 + Math.floor(hash2(i, 5) * (w - 28)), back + 8 + Math.floor(hash2(5, i) * (front - back - 12)), '#d4bc88');   // the courtyard
    A.r(x + 16, back + 10, 18, 10, S[2]); A.r(x + 16, back + 10, 18, 3, S[1]); A.r(x + w - 46, back + 12, 24, 12, S[3]);    // ruined rooms inside
    A.r(x + 8, back - 6, w - 16, 10, S[2]); A.hl(x + 8, back - 6, w - 16, S[1]); for (let i = x + 8; i < x + w - 8; i += 8) A.r(i, back - 10, 5, 4, S[2]);   // the back wall
    for (const sx of [x + 8, x + w - 16]) { A.r(sx, back, 8, front - back, S[1]); A.vl(sx + (sx === x + 8 ? 7 : 0), back, front - back, S[3]); }   // the side walls' tops
    // the front wall, the gate
    A.r(x + 8, front, w - 16, WH, S[1]); for (let j = front + 5; j < front + WH; j += 6) { A.hl(x + 8, j, w - 16, S[2]); for (let i = ((j / 6) & 1) * 7; i < w - 16; i += 14) A.vl(x + 8 + i, j, 6, S[2]); }
    for (let i = x + 8; i < x + w - 8; i += 9) { A.r(i, front - 6, 6, 6, S[1]); A.hl(i, front - 6, 6, S[0]); }                 // the crenellations
    for (let k = 0; k < 5; k++) { const px = x + 30 + Math.floor(hash2(k, 9) * (w - 70)), py = front + 8 + Math.floor(hash2(9, k) * (WH - 16)); A.r(px, py, 8, 5, S[3]); A.hl(px, py + 5, 8, S[0]); }   // holes where the stone has gone
    const gx = x + (w >> 1); A.r(gx - 14, front + 6, 28, WH - 6, S[3]); A.poly([[gx - 14, front + 12], [gx, front - 2], [gx + 14, front + 12]], S[3]);
    A.r(gx - 10, front + 12, 20, WH - 12, '#3a2c1c'); A.poly([[gx - 10, front + 14], [gx, front + 4], [gx + 10, front + 14]], '#3a2c1c'); A.r(gx - 8, front + 20, 16, WH - 20, '#6a4a2a'); for (let k = -6; k < 8; k += 4) A.vl(gx + k, front + 20, WH - 20, '#4a3018');   // the gate
    // the towers: round, taller, at the corners
    const tower = (cx, ty, tall) => {
        A.r(cx - 13, ty, 26, tall, S[1]); A.vl(cx - 13, ty, tall, S[0]); A.r(cx + 6, ty, 7, tall, S[2]); A.vl(cx + 12, ty, tall, S[3]);
        for (let j = ty + 6; j < ty + tall; j += 6) A.hl(cx - 12, j, 24, S[2]);
        A.ell(cx, ty, 13, 5, S[0]); A.ell(cx, ty, 10, 3, S[2]); for (let k = -12; k <= 10; k += 6) A.r(cx + k, ty - 7, 4, 5, S[1]);
        A.r(cx - 2, ty + 10, 4, 8, '#2a2014');                                                                                // an arrow slit
    };
    tower(x + 14, back - 16, 22); tower(x + w - 14, back - 16, 22); tower(x + 14, front - 12, WH + 12); tower(x + w - 14, front - 12, WH + 12);
    A.r(gx + 22, front - 22, 2, 16, '#86949e'); A.r(gx + 24, front - 22, 10, 6, '#d0402f');                                   // a flag somebody put up
    return fit(st, { solid: [4, 4, w - 8, d - 8] });
};
SPR_L['old cannon'] = (w, d) => {
    const st = propStage(w, d, 34, 22), { A } = st, x = st.x, y = st.y;
    A.r(x + 4, y + 12, 22, 9, '#c8bca0'); A.hl(x + 4, y + 12, 22, '#e4dcc4'); A.hl(x + 4, y + 20, 22, '#948a70');
    A.poly([[x + 2, y + 8], [x + 30, y + 4], [x + 31, y + 9], [x + 3, y + 13]], '#7a4a2c'); A.line(x + 3, y + 8, x + 30, y + 4, '#a86a40'); A.ell(x + 31, y + 6, 2, 3, '#20242c');
    A.ell(x + 8, y + 15, 4, 4, '#5a3a24'); A.ell(x + 22, y + 15, 4, 4, '#5a3a24'); A.px(x + 14, y + 8, '#f05070'); A.px(x + 15, y + 8, '#f05070');   // the wheels, the painted heart
    return propFit(st, w, d, { solid: [(w - 26) / 2, d - 8, 26, 8] });
};

// ---- BASSEM'S VILLA ----
SPR_L['villa wall'] = (w, d) => {                                  // high and white, broken glass along the top, a camera now and then
    const sp = plainWall(w, d, WASH, ['#5ad0d0', '#28a8b0']), A = pa(sp.c.getContext('2d'));
    if (w >= d) { const top = 3; for (let i = 3; i < sp.c.width - 3; i += 3) A.px(i, top - 1 + (i % 2), i % 6 ? '#a6e8c8' : '#ffffff'); for (let i = 20; i < sp.c.width - 10; i += 64) { A.r(i, top + 2, 6, 3, '#20242c'); A.px(i + 6, top + 3, '#d02818'); } }
    return sp;
};
SPR_L['villa gate'] = (w, d) => {                                  // wrought iron between white pillars with lamps on top, an intercom, a camera
    const st = propStage(w, d, w + 8, 52), { A } = st, x = st.x, y = st.y;
    for (const px of [x, x + w - 4]) { A.r(px, y + 8, 12, 44, WASH[1]); A.vl(px, y + 8, 44, WASH[0]); A.vl(px + 11, y + 8, 44, WASH[3]); A.r(px - 1, y + 6, 14, 4, WASH[0]); A.r(px + 3, y, 6, 6, '#20242c'); A.r(px + 4, y + 1, 4, 4, '#fff4c0'); }
    const gx = x + 12, gw = w - 16;
    for (let i = 0; i < gw; i += 4) { A.vl(gx + i, y + 14, 36, '#20242c'); A.px(gx + i, y + 12, '#c89020'); } A.hl(gx, y + 16, gw, '#20242c'); A.hl(gx, y + 30, gw, '#20242c'); A.hl(gx, y + 48, gw, '#20242c');
    A.vl(gx + (gw >> 1), y + 12, 38, '#3a3e48'); for (let k = 0; k < 4; k++) A.ell(gx + 6 + k * ((gw - 12) / 3), y + 22, 3, 3, '#c89020');   // scrollwork, gilt
    A.r(x + 2, y + 28, 6, 8, '#86949e'); A.r(x + 3, y + 29, 4, 3, '#28384a'); A.r(x + w - 2, y + 10, 6, 4, '#20242c'); A.px(x + w + 3, y + 11, '#d02818');   // the intercom, the camera
    return propFit(st, w, d, { solid: [0, d - 10, w, 10], light: { x: 0, y: -40, r: 40, far: 80, c: '#fff4c0' } });
};
SPR_L['villa'] = (w, d) => {                                       // white and new: arches below, blue glass above, a terrace over the water, more air conditioners than windows
    const WH = 66, rd = d - 30, lift = WH - 30, st = stage(w, d, lift + 20), { A } = st, x = st.x, top = st.y - lift, wy = top + rd;
    roofFlat(A, x, top, w, rd, WASH); for (let k = 0; k < 5; k++) roofAC(A, x + 10 + k * 40, top + 4 + (k % 2) * 6); roofDish(A, x + w - 30, top + 10);
    A.r(x + w - 70, top + 14, 34, 10, '#2e7cc4'); A.ell(x + w - 64, top + 12, 7, 3, '#f0f0f0'); A.ell(x + w - 46, top + 12, 7, 3, '#d04838');   // a roof terrace: a jacuzzi, parasols
    A.r(x, wy, w, WH, WASH[0]); A.r(x, wy, w, 4, WASH[2]); A.hl(x, wy + 4, w, WASH[3]); A.r(x, wy + WH - 6, w, 6, WASH[1]); A.hl(x, wy + WH - 1, w, WASH[3]);
    A.r(x, wy + 6, w, 22, '#2a5a8a'); for (let i = 0; i < w; i += 28) { A.r(x + i + 2, wy + 8, 24, 18, '#3a7ab8'); A.line(x + i + 4, wy + 24, x + i + 12, wy + 9, '#9ed2f4'); A.vl(x + i, wy + 6, 22, WASH[1]); }   // the blue glass upstairs
    A.r(x - 4, wy + 28, w + 8, 4, WASH[0]); A.hl(x - 4, wy + 31, w + 8, WASH[3]); for (let i = -2; i < w + 4; i += 4) A.vl(x + i, wy + 20, 8, '#c8d0d8'); A.hl(x - 4, wy + 20, w + 8, '#e6eaef');   // the balcony, glass rails
    const n = Math.floor(w / 32), sw = w / n;
    for (let i = 0; i < n; i++) { const cx = Math.round(x + sw * (i + 0.5)); A.r(cx - 11, wy + 36, 22, WH - 42, '#2c3440'); A.ell(cx, wy + 36, 11, 7, '#2c3440'); A.r(cx - 9, wy + 44, 18, WH - 50, '#46505e'); A.r(cx - 15, wy + 32, 4, WH - 38, WASH[1]); A.vl(cx - 15, wy + 32, WH - 38, '#ffffff'); }   // the arcade
    for (let k = 0; k < 3; k++) { A.r(x + 12 + k * 90, wy + 2, 6, 3, '#20242c'); A.px(x + 18 + k * 90, wy + 3, '#d02818'); }   // cameras
    return fit(st, { light: { x: 0, y: -20, r: 80, far: 160, c: '#e8f4ff' } });
};
SPR_L['villa pool'] = (w, d) => {                                  // twenty metres from the sea, perfectly blue, nobody in it
    const st = stage(w, d, 0), { A } = st, x = st.x, y = st.y;
    A.r(x, y, w, d, '#f4f0e8'); A.r(x + 4, y + 4, w - 8, d - 8, '#3aa8e0'); A.r(x + 4, y + 4, w - 8, 4, '#2a88c0'); A.vl(x + 4, y + 4, d - 8, '#2a88c0');
    for (let i = 0; i < 6; i++) A.hl(x + 10 + Math.floor(hash2(i, 2) * (w - 30)), y + 12 + Math.floor(hash2(2, i) * (d - 24)), 8, '#8ad8f4');
    A.r(x + w - 14, y + 6, 6, 2, '#c8ccd0'); A.vl(x + w - 14, y + 6, 8, '#c8ccd0'); A.vl(x + w - 9, y + 6, 8, '#c8ccd0');   // the ladder
    return Object.assign(fit(st), { flat: true, solid: [2, 2, w - 4, d - 4] });
};

// ---- THE TRUCK STOP ----
SPR_L['truck stop café'] = (w, d) => {                             // a block café under a tin awning: plastic chairs, a TV, a fridge, a sign you can read from a lorry cab at night
    const WH = 40, rd = d - 30, lift = WH - 30, st = stage(w, d, lift + 24), { A } = st, x = st.x, top = st.y - lift, wy = top + rd;
    roofFlat(A, x, top, w, rd, ['#c8c4bc', '#aeaaa2', '#94908a', '#6e6a64']); roofTank(A, x + w - 30, top + 2);
    A.r(x + 4, top - 16, w - 8, 16, '#f0c040'); A.hl(x + 4, top - 16, w - 8, '#ffe070'); for (let i = 0; i < 6; i++) A.r(x + 10 + i * 10, top - 12, 7, 3, '#d04838'); for (let i = 0; i < 9; i++) A.r(x + 10 + i * 7, top - 6, 5, 2, '#20242c');   // the sign
    A.r(x + 10, top - 2, 2, 4, '#5a6068'); A.r(x + w - 12, top - 2, 2, 4, '#5a6068');
    A.r(x, wy, w, WH, '#d8d0c0'); A.r(x, wy, w, 4, '#b8b0a0');
    A.r(x + 8, wy + 8, w - 16, WH - 8, '#24282e'); A.r(x + 12, wy + 10, 20, 13, '#3a5aa0'); A.r(x + 13, wy + 11, 18, 11, '#7aa8e0'); A.r(x + w - 30, wy + 10, 16, 26, '#e8e8ec'); A.r(x + w - 28, wy + 12, 12, 20, '#9ed2f4');   // the TV, the fridge
    corrugated(A, x - 4, wy + 4, w + 8, 8, ['#c8d0d8', '#9aa4ae', '#748490', '#4c5a66']); A.soft(x, wy + 12, w, 8, '#000000', 0.15);   // the tin awning
    for (const px of [x - 2, x + w - 1]) A.r(px, wy + 12, 3, WH - 12, '#86949e');
    for (const tx of [x + 22, x + 64, x + 106]) { if (tx > x + w - 12) continue; A.r(tx - 8, wy + WH - 10, 16, 3, '#f4f4f0'); A.vl(tx - 6, wy + WH - 7, 6, '#c8c8c0'); A.vl(tx + 6, wy + WH - 7, 6, '#c8c8c0'); for (const s of [-14, 10]) { A.r(tx + s, wy + WH - 13, 5, 6, '#3a70c8'); A.vl(tx + s, wy + WH - 7, 6, '#285496'); } A.r(tx - 2, wy + WH - 13, 2, 3, '#f0e8d8'); }
    return fit(st, { light: { x: 0, y: -24, r: 64, far: 130, c: '#fff0b0' } });
};
SPR_L['fuel pumps'] = (w, d) => {                                  // two pumps under a tin canopy, the attendant's chair
    const st = stage(w, d, 40), { A } = st, x = st.x, y = st.y, ct = y - 36;
    A.r(x, ct, w, 12, '#d04838'); A.hl(x, ct, w, '#f07860'); A.r(x, ct + 12, w, 3, '#a02828'); A.r(x + 10, ct + 4, w - 20, 3, '#ffffff');
    for (const px of [x + 4, x + w - 8]) A.r(px, ct + 15, 4, d + 21, '#c8ccd0');
    for (const [px, c] of [[x + 20, '#d04838'], [x + w - 36, '#f0c040']]) { A.r(px, y + d - 34, 16, 30, c); A.vl(px, y + d - 34, 30, shade(c, 0.3)); A.r(px + 3, y + d - 30, 10, 7, '#20242c'); A.r(px + 4, y + d - 29, 8, 2, '#58e078'); A.line(px + 15, y + d - 22, px + 20, y + d - 8, '#20242c'); A.r(px + 18, y + d - 10, 4, 4, '#3e4048'); }
    A.r(x + (w >> 1) - 4, y + d - 14, 8, 6, '#3a70c8'); A.r(x + (w >> 1) - 4, y + d - 20, 8, 6, '#3a70c8'); A.r(x + (w >> 1) - 3, y + d - 21, 6, 4, '#e8e4d8');   // the chair, the newspaper
    return fit(st, { solid: [16, d - 14, w - 32, 12] });
};
SPR_L['lorry'] = (w, d, o) => {                                    // a long-distance lorry painted all over with flowers and eyes and GOD PROTECT US; the second one tarped and chained
    const tarp = String(o.id).endsWith('2'), st = propStage(w, d, w, 62), { A } = st, x = st.x, y = st.y;
    const by = y + 14, bw = w - 40;
    if (tarp) { A.r(x + 38, by - 4, bw, 34, '#3e6a8a'); A.hl(x + 38, by - 4, bw, '#5a8aaa'); for (let i = 0; i < bw; i += 18) A.vl(x + 38 + i, by - 4, 34, '#2e5a7a'); A.line(x + 38, by + 8, x + 38 + bw, by + 10, '#9aa4ae'); }
    else { A.r(x + 38, by, bw, 30, '#f0c040'); A.hl(x + 38, by, bw, '#ffe070'); for (let i = 0; i < bw; i += 10) A.vl(x + 38 + i, by + 2, 26, '#c89820'); for (let k = 0; k < 4; k++) { const fx = x + 46 + k * 20; A.ell(fx, by + 14, 4, 4, ['#d04838', '#3a70c8', '#58a848', '#f07830'][k]); A.px(fx, by + 14, '#ffffff'); } A.r(x + 44, by + 22, bw - 12, 3, '#d04838'); A.ell(x + 30 + bw, by + 8, 4, 3, '#ffffff'); A.px(x + 30 + bw, by + 8, '#20242c'); }   // painted flowers, GOD PROTECT US, an eye
    A.r(x + 36, by + 30, bw + 2, 6, '#3e4048');
    A.r(x + 4, by + 2, 32, 30, '#2e7cc4'); A.hl(x + 4, by + 2, 32, '#58a6e6'); A.poly([[x + 4, by + 2], [x + 14, by - 10], [x + 36, by - 10], [x + 36, by + 2]], '#2466a8');   // the cab
    A.poly([[x + 8, by + 1], [x + 15, by - 7], [x + 24, by - 7], [x + 24, by + 1]], '#28384a'); A.line(x + 12, by, x + 18, by - 6, '#6a8aa8'); A.r(x + 26, by - 7, 8, 8, '#28384a');   // its windows
    A.r(x + 2, by + 22, 6, 4, '#fff4c0'); A.r(x + 2, by + 28, 34, 4, '#c8ccd0'); for (let k = 0; k < 5; k++) A.px(x + 8 + k * 6, by - 11, ['#d04838', '#f0c040', '#58a848', '#ffffff', '#d04838'][k]);   // headlamp, bumper, fringe lights
    if (!tarp) { A.r(x + 10, by + 6, 6, 4, '#c8b48c'); A.r(x + 9, by + 4, 3, 2, '#c8b48c'); }                                    // the sleeping driver's feet out of the window
    for (const wx of [x + 18, x + 52, x + w - 20]) wheel(A, wx, by + 38, 7);
    return propFit(st, w, d, { solid: [2, d - 22, w - 4, 20] });
};

// ---- ABOUT TOWN ----
SPR_L['pickup'] = (w, d) => fit(carSprite(w, d, ['#f4f4f0', '#dcdcd4', '#b8b8b0', '#8a8a84'], { tint: '#304050', hub: '#9aa4ae', dust: true, rack: true }));   // white once, an outboard under a blanket in the back
SPR.c1c_cat = () => {                                             // a grey harbour cat, sitting up, one ear torn, washing a paw (now and then)
    const G = ['#a8acb4', '#868a94', '#646872', '#3e4048'], frames = [0, 0, 1, 0].map(f => {
        const st = propStage(32, 32, 16, 20), { A } = st, x = st.x, y = st.y;
        A.ell(x + 8, y + 14, 6, 5, G[1]); A.ell(x + 7, y + 12, 4, 3, G[0]); A.hl(x + 3, y + 19, 10, G[2]);                  // the body, sitting
        A.ell(x + 8, y + 6, 4, 4, G[1]); A.ell(x + 7, y + 5, 2, 2, G[0]); A.poly([[x + 4, y + 4], [x + 5, y], [x + 7, y + 3]], G[1]); A.poly([[x + 9, y + 3], [x + 11, y + 1], [x + 12, y + 4]], G[2]);   // head, ears (one torn)
        A.px(x + 6, y + 6, '#c8d040'); A.px(x + 10, y + 6, '#c8d040'); A.px(x + 8, y + 8, '#d08080');                          // eyes, nose
        for (let i = 0; i < 6; i++) A.px(x + 13 + (i > 3 ? 1 : 0), y + 18 - i, G[2]);                                           // the tail, curled up its side
        if (f) { A.r(x + 7, y + 8, 3, 2, G[0]); } else { A.r(x + 6, y + 18, 2, 2, G[0]); A.r(x + 9, y + 18, 2, 2, G[0]); }    // a paw up to wash, or both down
        return propFit(st, 32, 32, {});
    });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 1.2, ox: frames[0].ox, oy: frames[0].oy };
};
SPR.c1c_goats = (w, d) => SPR.c1b_goats(w, d);
SPR_L['basil pots'] = (w, d) => {                                  // basil and a geranium in old olive-oil tins
    const st = propStage(w, d, 26, 18), { A } = st, x = st.x, y = st.y;
    for (const [px, c] of [[2, '#3e8a30'], [10, '#58a848'], [18, '#d04838']]) { A.r(x + px, y + 9, 7, 8, '#c8ccd0'); A.hl(x + px, y + 9, 7, '#e6eaef'); A.r(x + px + 1, y + 12, 5, 2, '#d04838'); A.ell(x + px + 3, y + 7, 4, 4, c === '#d04838' ? '#3e8a30' : c); if (c === '#d04838') { A.px(x + px + 2, y + 5, c); A.px(x + px + 4, y + 4, c); } }
    return propFit(st, w, d, { solid: [(w - 24) / 2, d - 6, 24, 6] });
};
SPR_L['acacia'] = () => acacia('c1c_acacia');
