// ============================================================
// THE CODEX OF GIZA — POKE STYLE: OBJECT ART (poke/sprites.js)
// Every building, tent, vehicle, prop and plant, drawn in code to fit the
// footprint it has on the 3D map. Three-quarter view: a thing's roof or
// top is drawn over its footprint, and its south face hangs below that.
//
// A drawer gets (w, d) — the footprint in pixels — and returns a sprite:
//   { c: canvas, ox, oy }     ox/oy place the canvas against the footprint's
//                             top-left corner (use fit() for the usual case)
// optional: solid [x,y,w,h] (collision inside the footprint), light
// {x,y,r,c} (a lamp, for night), frames [canvas…] + fps (animation),
// flat: true (lies on the ground: drawn under everything that stands).
// ============================================================

// canvas sized for a footprint w×d with `up` pixels of height above it
function stage(w, d, up, side) {
    side = side || 0;
    const [c, g] = mk(w + 2 + side * 2, d + up + 2);
    return { c, g, A: pa(g), x: 1 + side, y: 1 + up, w, d, up, base: 1 + up + d };
}
function fit(st, extra) { return Object.assign({ c: outline(st.c), ox: -(st.c.width - st.w) / 2, oy: -(st.up + 1) }, extra || {}); }

const SPR = {};   // by object id
const SPR_L = {}; // by model label (lower case)

// ---- building parts ----
// The clean look: every surface is one flat colour, with a light edge where
// the sun (upper left) catches it and a dark edge where it turns away; bold
// lines for seams and ribs; no noise. Palettes are [light, mid, dark, deep].
const WOOD = ['#dca468', '#b87a44', '#8e5630', '#5e3620'], BLUEROOF = ['#9ad6f0', '#58a6d6', '#3478ae', '#1f4c7a'], TIN = ['#dfe6ea', '#b2bec6', '#86949e', '#5a6872'];
const WHITEWASH = ['#fffaec', '#f0e4c6', '#d6c29c', '#ae9670'], SHUTTER = ['#78b4ec', '#4884cc', '#2e5ea2', '#203f74'], CANVAS2 = ['#fbf3dc', '#ebdcb4', '#cdb88a', '#a38c60'];
const KHAYAMIYA = ['#d0402f', '#2f5fae', '#efbb35'];
function boards(A, x, y, w, h, P, seed) {
    A.r(x, y, w, h, P[1]);
    for (let i = 0; i < w; i += 6) {
        A.vl(x + i, y, h, P[2]); A.vl(x + i + 1, y, h, P[0]);
        const k = hash2(i + (seed || 0), 7);
        if (k > 0.55) A.r(x + i + 2, y + 4 + Math.round(k * (h - 10)), 3, 1, P[2]);            // a knot
        if (k < 0.18) A.r(x + i + 2, y + 3, 4, h - 5, shade(P[1], -0.06));                        // an older board
    }
    A.r(x, y, w, 3, P[3]); A.r(x, y + 3, w, 1, P[2]);                                             // shadow under the eave
    A.r(x, y + h - 3, w, 3, P[2]); A.hl(x, y + h - 1, w, P[3]);                                   // the sill board
}
function plaster(A, x, y, w, h, P, seed) {
    A.r(x, y, w, h, P[0]);
    const R = rng('pl' + seed);
    for (let i = 0; i < 5; i++) { const px = x + R() * (w - 26), py = y + 6 + R() * (h - 20); A.r(px, py, 14 + R() * 12, 5 + R() * 5, P[1]); }   // patched plaster
    for (let i = 0; i < 3; i++) { const px = x + 8 + R() * (w - 30), py = y + 8 + R() * (h - 24); A.r(px, py, 8, 3, '#d49a6c'); A.r(px + 3, py + 3, 8, 3, '#c07e54'); A.hl(px, py + 3, 11, '#a0603c'); }   // brick showing through
    A.r(x, y, w, 3, P[3]); A.r(x, y + 3, w, 2, P[2]);
    A.r(x, y + h - 8, w, 8, P[1]); A.hl(x, y + h - 8, w, P[2]); A.hl(x, y + h - 1, w, P[3]);   // a darker plinth
}
function corrugated(A, x, y, w, h, P) {
    A.r(x, y, w, h, P[1]);
    for (let i = 0; i < w; i += 4) { A.vl(x + i, y, h, P[0]); A.vl(x + i + 2, y, h, P[2]); }
    A.r(x, y, w, 3, P[3]); A.r(x, y + h - 2, w, 2, P[3]);
}
function door(A, x, y, w, h, P, frame) {
    const F = frame || WOOD;
    A.r(x - 2, y - 2, w + 4, h + 2, F[3]); A.r(x - 1, y - 1, w + 2, h + 1, F[2]); A.hl(x - 1, y - 1, w + 2, F[0]);
    A.r(x, y, w, h, P[1]); A.vl(x, y, h, P[0]); A.vl(x + w - 1, y, h, P[2]);
    const pw = w - 6, ph = Math.max(4, Math.floor((h - 9) / 2));
    for (const py of [y + 3, y + 6 + ph]) { A.r(x + 3, py, pw, ph, P[2]); A.hl(x + 3, py + ph - 1, pw, P[0]); A.vl(x + 3 + pw - 1, py, ph, P[0]); }
    A.r(x + w - 4, y + (h >> 1), 2, 2, '#f0c040'); A.px(x + w - 4, y + (h >> 1), '#fff4b0');
}
function win(A, x, y, w, h, o) {
    o = o || {};
    const F = o.frame || WOOD;
    A.r(x - 2, y - 2, w + 4, h + 4, F[3]); A.r(x - 1, y - 1, w + 2, h + 2, F[1]); A.hl(x - 1, y - 1, w + 2, F[0]);
    if (o.lit) { A.r(x, y, w, h, '#ffd878'); A.r(x, y + (h >> 1), w, h - (h >> 1), '#f5b54e'); A.r(x, y, 3, h, '#c8503c'); A.r(x + w - 3, y, 3, h, '#c8503c'); }   // lamplight, curtains
    else { A.r(x, y, w, h, '#9ed2f4'); A.r(x, y + (h >> 1), w, h - (h >> 1), '#6aa6de'); A.line(x + 1, y + h - 3, x + 4, y, '#e8f6ff'); A.line(x + 3, y + h - 2, x + 6, y + 1, '#e8f6ff'); }   // sky in the glass, a glint
    A.vl(x + (w >> 1), y, h, F[2]); A.hl(x, y + (h >> 1), w, F[2]);
    A.r(x - 3, y + h + 1, w + 6, 2, F[0]); A.hl(x - 3, y + h + 3, w + 6, F[3]);                  // the sill
    if (o.shutters) for (const sx of [x - 3 - (w >> 1), x + w + 3]) { const S = o.shutters; A.r(sx, y - 2, w >> 1, h + 4, S[1]); A.vl(sx, y - 2, h + 4, S[0]); A.vl(sx + (w >> 1) - 1, y - 2, h + 4, S[2]); for (let j = y; j < y + h + 2; j += 3) A.hl(sx + 1, j, (w >> 1) - 2, S[2]); }
}
function roofRibbed(A, x, top, w, d, P, rib) {                   // gable roof, ridge running left–right
    const ridge = top + Math.round(d * 0.34), front = top + d - ridge;
    A.r(x, top, w, ridge - top, P[2]);
    A.r(x, ridge, w, front, P[1]); A.r(x, ridge, w, Math.round(front * 0.4), P[0]);
    for (let i = 3; i < w - 1; i += rib) { A.vl(x + i, top + 1, ridge - top - 1, P[3]); A.vl(x + i, ridge + 3, front - 5, P[2]); A.vl(x + i + 1, ridge + 3, Math.round(front * 0.4) - 3, '#ffffff'); }
    A.r(x - 2, ridge - 2, w + 4, 4, P[0]); A.hl(x - 2, ridge - 2, w + 4, '#ffffff'); A.hl(x - 2, ridge + 1, w + 4, P[2]);   // ridge cap
    A.r(x - 2, top + d - 3, w + 4, 3, P[2]); A.hl(x - 2, top + d - 3, w + 4, P[0]); A.hl(x - 2, top + d - 1, w + 4, P[3]);  // gutter
    A.vl(x, top, d, P[0]); A.vl(x + w - 1, top, d, P[3]);
    return top + d;
}
function roofFlat(A, x, top, w, d, P) {                          // a flat roof inside a parapet
    A.r(x, top, w, d, P[0]);
    A.r(x + 4, top + 4, w - 8, d - 8, P[1]); A.r(x + 4, top + 4, w - 8, 3, P[2]); A.vl(x + 4, top + 4, d - 8, P[2]);   // the deck, shadowed by the parapet
    A.hl(x, top, w, '#ffffff'); A.hl(x, top + d - 1, w, P[3]); A.vl(x + w - 1, top, d, P[2]);
}
function roofTank(A, x, y) { A.r(x + 2, y + 12, 2, 6, '#5a6872'); A.r(x + 14, y + 12, 2, 6, '#5a6872'); A.ell(x + 9, y + 12, 9, 3, '#20242c'); A.r(x, y + 3, 19, 10, '#3a4050'); A.r(x, y + 3, 5, 10, '#5a6272'); A.ell(x + 9, y + 3, 9, 3, '#6a7282'); A.ell(x + 9, y + 3, 6, 1, '#3a4050'); }
function roofDish(A, x, y) { A.ell(x + 6, y + 5, 6, 5, '#b2bec6'); A.ell(x + 5, y + 4, 4, 3, '#ffffff'); A.line(x + 6, y + 5, x + 10, y, '#5a6872'); A.r(x + 5, y + 10, 2, 3, '#5a6872'); }
function roofAC(A, x, y) { A.r(x, y, 16, 10, '#e6eaef'); A.r(x, y, 16, 2, '#ffffff'); A.r(x, y + 10, 16, 4, '#98a2ae'); A.ell(x + 8, y + 5, 3, 3, '#5a6872'); A.ell(x + 8, y + 5, 1, 1, '#c2c9d2'); }

// ---- TENTS ----
// A big canvas wall tent: the roof falls from its ridge pole to a scalloped
// valance in khayamiya colours, the wall below it, the door laced open.
function tentRidge(w, d, P, doorAt, doorW, o) {
    o = o || {};
    const wallH = 20, rise = 10, st = stage(w, d, wallH + rise, 10), { A } = st;
    const x = st.x, top = st.y - wallH - rise, eave = st.y + d - wallH, ridge = top + Math.round((eave - top) * 0.24), fh = eave - ridge;
    for (let i = 0; i <= 5; i++) {                              // guy ropes down to their pegs
        const gx = x + Math.round(i * (w - 1) / 5), out = (i - 2.5) * 4;
        A.line(gx, eave + 2, gx + out, st.base - 1, P[3]); A.r(gx + out - 1, st.base - 2, 3, 2, WOOD[3]);
    }
    A.r(x, top, w, ridge - top, P[2]); A.hl(x, top, w, P[3]);                     // the back slope, turned from the sun
    A.r(x, ridge, w, fh, P[0]); A.r(x, ridge + Math.round(fh * 0.62), w, fh - Math.round(fh * 0.62), P[1]);   // the front slope: bright, then its lower half in shadow
    const panels = Math.max(3, Math.round(w / 34));
    for (let i = 1; i < panels; i++) { const sx = x + Math.round(i * w / panels); A.vl(sx, top + 1, eave - top - 1, P[2]); A.vl(sx + 1, ridge + 2, fh - 2, '#ffffff'); }
    if (o.patches !== false) { A.r(x + Math.round(w * 0.18), ridge + Math.round(fh * 0.5), 8, 7, P[1]); A.hl(x + Math.round(w * 0.18), ridge + Math.round(fh * 0.5), 8, P[2]); A.vl(x + Math.round(w * 0.18) + 7, ridge + Math.round(fh * 0.5), 7, P[2]); }
    A.r(x - 4, ridge - 2, w + 8, 4, WOOD[1]); A.hl(x - 4, ridge - 2, w + 8, WOOD[0]); A.hl(x - 4, ridge + 1, w + 8, WOOD[3]);   // the ridge pole
    A.r(x - 5, ridge - 3, 3, 6, WOOD[3]); A.r(x + w + 2, ridge - 3, 3, 6, WOOD[3]);
    const T = o.trim || KHAYAMIYA;                                                                      // the valance
    A.r(x, eave - 1, w, 4, T[0]); A.hl(x, eave - 1, w, shade(T[0], 0.25));
    for (let i = 0, k = 0; i < w - 1; i += 8, k++) { A.poly([[x + i, eave + 3], [x + i + 8, eave + 3], [x + i + 4, eave + 7]], T[k % 2 ? 1 : 2]); }
    A.r(x, eave + 3, w, wallH - 3, P[1]);                                                               // the wall
    for (let i = 5; i < w; i += 9) { A.vl(x + i, eave + 7, wallH - 9, P[2]); A.vl(x + i + 1, eave + 7, wallH - 9, P[0]); }
    A.r(x, eave + wallH - 3, w, 3, P[2]); A.hl(x, eave + wallH - 1, w, P[3]);
    if (o.stripes) for (let i = 0; i < w; i += 24) { A.soft(x + i, top, 12, eave - top - 1, o.stripes, 0.22); A.soft(x + i, eave + 3, 12, wallH - 6, o.stripes, 0.22); }   // striped canvas
    A.vl(x, top, eave - top + wallH, P[0]); A.vl(x + w - 1, top, eave - top + wallH, P[3]);
    if (doorAt != null) {
        const dw = doorW || 24, dx = x + Math.round(doorAt - dw / 2), dy = eave - 4;
        A.r(dx, dy, dw, wallH + 4, '#3a2418');                                                        // inside, in shadow
        A.r(dx + 2, dy + 4, dw - 4, wallH - 2, KHAYAMIYA[0]);                                        // the lining: red, a band of blue, gold diamonds
        A.r(dx + 2, dy + 4 + (wallH >> 1), dw - 4, 3, KHAYAMIYA[1]);
        for (let i = dx + 5; i < dx + dw - 5; i += 7) A.poly([[i, dy + 9], [i + 3, dy + 6], [i + 6, dy + 9], [i + 3, dy + 12]], KHAYAMIYA[2]);
        A.r(dx + 4, dy + wallH, dw - 8, 4, '#8a5a34'); A.hl(dx + 4, dy + wallH, dw - 8, '#b88458');                              // a rug on the floor inside
        A.poly([[dx, dy], [dx + 7, dy], [dx, dy + wallH + 4]], P[0]); A.poly([[dx + dw, dy], [dx + dw - 7, dy], [dx + dw, dy + wallH + 4]], P[2]);   // flaps tied back
        A.r(dx + 1, dy + 10, 2, 2, WOOD[3]); A.r(dx + dw - 3, dy + 10, 2, 2, WOOD[3]);
        if (o.porch) {                                                                                 // a fly sheet over the door on two poles
            const px = dx - 12, pwid = dw + 24;
            A.r(px, dy - 10, pwid, 8, P[0]); A.hl(px, dy - 10, pwid, '#ffffff'); A.hl(px, dy - 3, pwid, P[2]);
            for (let i = 0, k = 0; i < pwid - 1; i += 6, k++) A.poly([[px + i, dy - 2], [px + i + 6, dy - 2], [px + i + 3, dy + 2]], T[k % 3]);
            A.r(px + 1, dy - 2, 2, wallH + 8, WOOD[2]); A.r(px + pwid - 3, dy - 2, 2, wallH + 8, WOOD[2]);
        }
    }
    return st;
}
SPR.tent_bldg = (w, d) => {
    const st = tentRidge(w, d, CANVAS2, w / 2, 26, { porch: true, stripes: '#c89a58' }), { A } = st;
    const x = st.x + Math.round(w * 0.78), y = st.base - 26;                                            // her name on a board by the door
    A.r(x + 6, y + 6, 2, 16, WOOD[3]); A.r(x, y, 16, 8, WOOD[0]); A.r(x, y + 7, 16, 1, WOOD[3]); A.r(x + 2, y + 2, 12, 1, '#5e3620'); A.r(x + 3, y + 4, 9, 1, '#5e3620');
    return fit(st);
};
SPR.c1m_mess = (w, d) => {
    // an army marquee, faded olive, the south side rolled up on poles: table and benches inside
    const OL = ['#b8be86', '#98a068', '#747c4c', '#4e5634'];
    const st = tentRidge(Math.round(w * 0.74), Math.round(d * 0.72), OL, null, 0, { trim: ['#747c4c', '#98a068', '#b8be86'] }), { A } = st;
    const x = st.x, eave = st.y + st.d - 20, ww = st.w;
    const roofTop = st.y - 30, sx = x + Math.round(ww * 0.62), sy = roofTop + Math.round((eave - roofTop) * 0.5);
    A.r(sx, sy, 22, 10, OL[1]); A.r(sx + 3, sy + 2, 3, 6, '#3a3e24'); A.r(sx + 8, sy + 2, 5, 2, '#3a3e24'); A.r(sx + 11, sy + 2, 2, 6, '#3a3e24'); A.r(sx + 16, sy + 2, 3, 6, '#3a3e24');   // a stencilled number, half faded
    A.r(x + Math.round(ww * 0.3), sy - 6, 10, 8, '#c8c898'); A.hl(x + Math.round(ww * 0.3), sy - 6, 10, '#e0e0b8'); A.vl(x + Math.round(ww * 0.3) + 9, sy - 6, 8, OL[2]);   // a newer patch
    for (const bx of [x - 4, x + ww - 12]) for (let k = 0; k < 2; k++) { A.ell(bx + 8, eave + 16 - k * 5, 7, 3, '#c9b48e'); A.hl(bx + 2, eave + 18 - k * 5, 12, '#8a7658'); }   // sandbags at the corners
    A.r(x + 4, eave + 3, ww - 8, 17, '#2c2618');
    A.r(x + 2, eave + 3, ww - 4, 4, OL[2]); for (let i = x + 4; i < x + ww - 6; i += 10) A.r(i, eave + 7, 6, 2, OL[3]);   // the rolled-up wall
    for (const px of [x + 4, x + (ww >> 1), x + ww - 6]) A.r(px, eave + 3, 2, 17, WOOD[1]);
    A.r(x + 22, eave + 11, ww - 44, 4, WOOD[0]); A.hl(x + 22, eave + 15, ww - 44, WOOD[3]); A.r(x + 26, eave + 17, ww - 52, 2, WOOD[2]);
    for (let i = x + 30; i < x + ww - 30; i += 16) { A.r(i, eave + 10, 3, 2, '#ffffff'); A.px(i + 6, eave + 11, '#c8503c'); }   // glasses, a teapot
    const sp = fit(st);
    sp.ox = Math.round((w - st.c.width) / 2); sp.oy += Math.round(d * 0.14);
    return sp;
};
SPR.c1m_hanatent = (w, d) => {
    const R = Math.round(Math.min(w, d) * 0.36), st = stage(w, d, 22), { A } = st;
    const cx = st.x + (w >> 1), cy = st.y + (d >> 1) - 4;
    A.ell(cx, cy + 12, R, Math.round(R * 0.62), PAL.canvas[3]);                 // the wall ring
    A.r(cx - R, cy, R * 2 + 1, 12, PAL.canvas[2]);
    for (let i = -R + 3; i < R; i += 6) A.vl(cx + i, cy + 2, 12 + Math.round(Math.sqrt(Math.max(0, 1 - (i * i) / (R * R))) * R * 0.5), PAL.canvas[3]);
    A.r(cx - R, cy + 5, R * 2 + 1, 2, PAL.red[2]);                               // a woven band
    A.dith(cx - R, cy + 5, R * 2 + 1, 2, PAL.gold[1], 0);
    A.ell(cx, cy, R, Math.round(R * 0.62), PAL.canvas[1]);                      // roof
    A.ell(cx - 2, cy - 3, Math.round(R * 0.7), Math.round(R * 0.4), PAL.canvas[0]);
    A.ell(cx, cy - 1, 4, 2, PAL.canvas[3]);                                     // smoke ring
    for (let a = 0; a < 8; a++) A.line(cx, cy, cx + Math.round(Math.cos(a * Math.PI / 4 + 0.4) * R), cy + Math.round(Math.sin(a * Math.PI / 4 + 0.4) * R * 0.62), PAL.canvas[2]);
    A.r(cx - 6, cy + Math.round(R * 0.5) + 2, 12, 14, PAL.dark[3]);              // door
    A.r(cx - 7, cy + Math.round(R * 0.5) + 1, 14, 2, PAL.wood[2]);
    // awning on two poles
    A.r(cx - 14, cy + Math.round(R * 0.5) - 2, 28, 5, PAL.canvas[0]); A.r(cx - 14, cy + Math.round(R * 0.5) + 2, 28, 1, PAL.canvas[2]);
    A.r(cx - 14, cy + Math.round(R * 0.5) + 3, 1, 14, PAL.wood[2]); A.r(cx + 13, cy + Math.round(R * 0.5) + 3, 1, 14, PAL.wood[2]);
    return fit(st, { solid: [w / 2 - R, d / 2 - R * 0.5, R * 2, R * 1.1] });
};
// the Bedouin tent: low, black goat hair with pale stripes, sagging between its poles, open to the south
SPR.ow_shelter = (w, d) => {
    const tw = Math.min(w, 116), td = Math.min(d, 46), st = stage(tw, td, 22, 8), { A } = st, x = st.x, top = st.y - 18;
    const poles = 4, peak = (i) => { const u = (i / (tw - 1)) * (poles - 1), f = u - Math.floor(u); return Math.round(Math.sin(f * Math.PI) * 5); };   // 0 at a pole, sagging 5 between
    for (const gx of [x, x + tw - 1]) { A.line(gx, top + 4, gx + (gx === x ? -7 : 7), st.base - 1, PAL.canvas[3]); A.r(gx + (gx === x ? -8 : 6), st.base - 2, 2, 2, PAL.wood[3]); }
    for (let i = 0; i < tw; i++) {
        const y0 = top + peak(i);
        A.vl(x + i, y0, top + td - y0, '#332822');
        for (let j = 5; j < td; j += 10) { A.vl(x + i, y0 + j, 3, PAL.canvas[2]); A.px(x + i, y0 + j + 3, PAL.red[3]); }
        A.px(x + i, y0, '#54443a'); A.px(x + i, y0 + 1, '#44362e');
    }
    for (let k = 0; k < poles; k++) { const px = x + Math.round(k * (tw - 1) / (poles - 1)); A.r(px - 1, top - 4, 2, 6, PAL.wood[1]); A.vl(px, top + 2, td - 2, '#241c18'); }
    const fy = top + td;                                          // the open front: shade inside, rugs, cushions, a coffee pot
    A.r(x, fy, tw, 16, PAL.dark[3]);
    A.r(x, fy, tw, 3, '#332822'); for (let i = 0; i < tw - 3; i += 5) A.r(x + i + 1, fy + 3, 3, 1, PAL.canvas[2]);
    for (let k = 0; k < poles; k++) { const px = x + Math.round(k * (tw - 1) / (poles - 1)); A.r(px - 1, fy, 2, 16, PAL.wood[2]); }
    A.r(x + 8, fy + 10, tw - 16, 6, PAL.red[2]); A.dith(x + 8, fy + 10, tw - 16, 6, PAL.gold[2], 0); A.r(x + 8, fy + 10, tw - 16, 1, PAL.blue[2]);
    A.ell(x + 22, fy + 9, 5, 2, PAL.red[1]); A.ell(x + tw - 26, fy + 9, 5, 2, PAL.blue[1]); A.ell(x + (tw >> 1), fy + 8, 2, 3, PAL.gold[2]); A.px(x + (tw >> 1) + 2, fy + 6, PAL.gold[2]);
    return Object.assign(fit(st), { ox: Math.round((w - st.c.width) / 2), solid: [(w - tw) / 2, 0, tw, td * 0.85] });
};

// ---- BUILDINGS ----
SPR.dorm_bldg = (w, d) => {                       // the workers' bunkhouse: blue corrugated iron over warm planks
    const wallH = 38, st = stage(w, d, wallH + 12), { A } = st, x = st.x, top = st.y - wallH;
    const eave = roofRibbed(A, x - 3, top, w + 6, d, BLUEROOF, 5);
    const R = rng('dormroof');
    for (let i = 0; i < 6; i++) { const rx = x + R() * (w - 20), ry = top + Math.round(d * 0.4) + R() * (d * 0.45); A.r(rx, ry, 1, 4 + R() * 8, '#b8683c'); }   // rust runs
    A.r(x + Math.round(w * 0.6), top + Math.round(d * 0.5), 18, 8, BLUEROOF[0]); A.hl(x + Math.round(w * 0.6), top + Math.round(d * 0.5), 18, '#ffffff');       // a newer sheet
    roofTank(A, x + 10, top - 10);
    A.r(x + w - 22, top + 2, 4, 12, '#3a4050'); A.r(x + w - 23, top, 6, 3, '#5a6272');                                                                      // stove pipe
    boards(A, x, eave, w, wallH, WOOD, 3);
    const dx = x + Math.round(w * 0.55);
    A.r(dx - 8, eave, 34, 6, BLUEROOF[1]); A.hl(dx - 8, eave + 5, 34, BLUEROOF[3]);                                                                          // a little porch roof
    door(A, dx, eave + 11, 18, wallH - 11, ['#7fb0d8', '#4c80b8', '#305a8c', '#1f3c60']);
    for (const wx of [0.1, 0.3, 0.78]) win(A, x + Math.round(w * wx), eave + 12, 16, 13, { lit: wx === 0.3 });
    A.r(dx - 4, eave + wallH, 26, 3, '#c9b48e'); A.hl(dx - 4, eave + wallH + 2, 26, '#8a7658');                                                              // a stone step
    A.r(x + w - 42, eave + 22, 26, 3, WOOD[0]); A.hl(x + w - 42, eave + 24, 26, WOOD[3]); A.r(x + w - 40, eave + 25, 2, 9, WOOD[3]); A.r(x + w - 20, eave + 25, 2, 9, WOOD[3]);   // bench
    return fit(st);
};
SPR.foreman_bldg = (w, d) => {                    // the site office: whitewashed mud brick, blue shutters, a busy flat roof
    const wallH = 42, st = stage(w, d, wallH + 12), { A } = st, x = st.x, top = st.y - wallH;
    roofFlat(A, x, top, w, d, WHITEWASH);
    for (const cx of [x, x + w - 8]) { A.r(cx, top - 5, 8, 7, WHITEWASH[0]); A.hl(cx, top - 5, 8, '#ffffff'); A.vl(cx + 7, top - 5, 7, WHITEWASH[2]); }   // corner piers
    for (const rx of [x + 2, x + w - 6]) for (let k = 0; k < 3; k++) A.vl(rx + k, top - 11 - k, 7 + k, '#9a4a2c');                                    // rebar, waiting for a second storey
    roofTank(A, x + w - 38, top + 4); roofDish(A, x + 14, top + 7); roofAC(A, x + Math.round(w * 0.45), top + Math.round(d * 0.4));
    A.r(x + 36, top + d - 20, 24, 12, KHAYAMIYA[0]); for (let i = 0; i < 24; i += 6) A.r(x + 36 + i, top + d - 20, 3, 12, KHAYAMIYA[2]);              // a rug put out to air
    const wy = top + d;
    plaster(A, x, wy, w, wallH, WHITEWASH, 'office');
    A.r(x + w - 10, wy - 2, 3, wallH, '#86949e'); A.hl(x + w - 10, wy - 2, 3, '#b2bec6');                                                              // drainpipe
    const dx = x + Math.round(w * 0.6);
    A.r(dx - 3, wy + 5, 24, 5, WHITEWASH[2]); A.hl(dx - 3, wy + 9, 24, WHITEWASH[3]);                                                                  // lintel
    door(A, dx, wy + 11, 18, wallH - 11, SHUTTER, WHITEWASH);
    for (const wx of [0.16, 0.84]) win(A, x + Math.round(w * wx) - 7, wy + 12, 14, 13, { lit: wx < 0.5, frame: WHITEWASH, shutters: SHUTTER });
    const sx = x + Math.round(w * 0.3) - 6;                                                                                                             // the sign
    A.r(sx, wy + 6, 50, 11, SHUTTER[3]); A.r(sx + 1, wy + 7, 48, 9, '#ffffff'); A.r(sx + 4, wy + 9, 24, 1, '#203f74'); A.r(sx + 4, wy + 12, 18, 1, '#203f74'); A.r(sx + 32, wy + 9, 14, 4, '#d0402f');
    roofAC(A, x + Math.round(w * 0.36), wy + 22);
    return fit(st);
};
function shed(w, d, wall, doorCol, sign) {        // a corrugated-iron shed
    const wallH = 32, st = stage(w, d, wallH + 4), { A } = st, x = st.x, top = st.y - wallH;
    const eave = roofRibbed(A, x - 2, top, w + 4, d, TIN, 4);
    const R = rng('shed' + w + d);
    for (let i = 0; i < 5; i++) { const rx = x + R() * (w - 12), ry = top + Math.round(d * 0.45) + R() * d * 0.4; A.r(rx, ry, 1, 3 + R() * 7, '#b8683c'); }
    corrugated(A, x, eave, w, wallH, wall);
    for (let i = 0; i < 4; i++) A.r(x + hash2(i, w) * (w - 8), eave + 6 + hash2(i, d) * (wallH - 12), 2, 5, '#b8683c');
    const dw = 26, dx = x + (w >> 1) - (dw >> 1);                                                                    // double doors
    A.r(dx - 1, eave + 7, dw + 2, wallH - 7, wall[3]); A.r(dx, eave + 8, (dw >> 1) - 1, wallH - 8, doorCol[1]); A.r(dx + (dw >> 1), eave + 8, (dw >> 1), wallH - 8, doorCol[1]);
    for (let j = eave + 11; j < eave + wallH - 2; j += 5) { A.hl(dx + 1, j, (dw >> 1) - 3, doorCol[2]); A.hl(dx + (dw >> 1) + 1, j, (dw >> 1) - 2, doorCol[2]); }
    A.vl(dx, eave + 8, wallH - 8, doorCol[0]); A.r(dx + (dw >> 1) - 3, eave + 18, 5, 4, '#f0c040'); A.px(dx + (dw >> 1) - 2, eave + 18, '#fff4b0');   // padlock
    if (sign) { A.r(x + 5, eave + 6, 22, 10, '#f0c040'); A.hl(x + 5, eave + 6, 22, '#ffe890'); A.r(x + 8, eave + 9, 16, 1, '#3a2418'); A.r(x + 8, eave + 12, 10, 1, '#3a2418'); }
    return st;
}
SPR_L["sam's tool shed"] = (w, d) => fit(shed(w, d, TIN, ['#9aa8b0', '#6c7a84', '#4a5660', '#303a42'], true));
SPR_L['dig shed clipboard'] = (w, d) => fit(shed(w, d, ['#a8b478', '#86925a', '#626c40', '#434a2a'], ['#c89058', '#a86c3c', '#804c28', '#5c3418'], true));
function cabin(w, d, stripe) {                   // a white site cabin with a coloured stripe
    const wallH = 30, st = stage(w, d, wallH + 4), { A } = st, x = st.x, top = st.y - wallH;
    const WH = ['#ffffff', '#e6eaef', '#c2c9d2', '#98a2ae'];
    A.r(x, top, w, d, WH[1]); A.r(x + 3, top + 3, w - 6, d - 6, WH[2]); A.hl(x, top, w, '#ffffff'); A.vl(x + w - 1, top, d, WH[3]);
    for (let i = 10; i < w - 4; i += 12) A.vl(x + i, top + 3, d - 6, WH[1]);
    if (w > 50 && d > 24) { roofAC(A, x + w - 24, top + 5); A.r(x + 8, top + (d >> 1) - 3, 7, 7, WH[3]); A.r(x + 9, top + (d >> 1) - 2, 5, 5, '#5a6872'); }
    const wy = top + d;
    A.r(x, wy, w, wallH, WH[1]);
    for (let j = wy + 4; j < wy + wallH - 2; j += 4) A.hl(x, j, w, WH[2]);
    A.r(x, wy, w, 3, WH[3]); A.r(x, wy + 12, w, 5, stripe[1]); A.hl(x, wy + 12, w, stripe[0]); A.hl(x, wy + 16, w, stripe[2]);
    A.r(x, wy + wallH - 2, w, 2, WH[3]);
    const dx = x + Math.round(w * 0.64);
    door(A, dx, wy + 8, 14, wallH - 8, WH, ['#c2c9d2', '#98a2ae', '#6a7480', '#4a525c']);
    A.r(dx - 3, wy + wallH, 20, 3, '#86949e'); A.hl(dx - 3, wy + wallH, 20, '#b2bec6');                           // metal step
    win(A, x + Math.round(w * 0.18), wy + 7, 16, 9, { lit: true, frame: ['#c2c9d2', '#98a2ae', '#6a7480', '#4a525c'] });
    for (let i = 0; i < 16; i += 3) A.vl(x + Math.round(w * 0.18) + i, wy + 7, 9, '#6a7480');                     // a grille
    A.r(x + 4, wy + wallH, 7, 3, '#5a5048'); A.r(x + w - 11, wy + wallH, 7, 3, '#5a5048');                       // the blocks it stands on
    return st;
}
// Lindqvist's site trailer: a ribbed aluminium caravan up on blocks, a window air conditioner
// rattling and dripping, a Swedish flag sticker on the door, the Ministry's letters piled on the step.
SPR_L['site trailer'] = (w, d) => {
    const wallH = 38, st = stage(w, d, wallH + 12, 6), { A } = st, x = st.x, top = st.y - wallH;
    const AL = ['#f4f6f8', '#dde2e7', '#b9c1ca', '#8c96a2', '#5e6874'], W2 = w - 2;
    // the roof: a raised rim, seams, vents, a solar panel, a dish, dust
    A.r(x + 1, top, W2, d, AL[1]); A.r(x + 4, top + 3, W2 - 6, d - 6, AL[2]); A.hl(x + 2, top, W2 - 2, '#ffffff'); A.vl(x + 1, top + 1, d - 2, AL[0]); A.vl(x + W2, top + 1, d - 2, AL[3]);
    for (let i = 12; i < W2 - 6; i += 12) { A.vl(x + i, top + 3, d - 6, AL[3]); A.vl(x + i + 1, top + 3, d - 6, AL[1]); }
    A.r(x + 14, top + 12, 34, 22, '#2e4a7a'); for (let i = 0; i < 34; i += 6) A.vl(x + 14 + i, top + 12, 22, '#5a7ab0'); A.hl(x + 14, top + 22, 34, '#5a7ab0'); A.hl(x + 14, top + 12, 34, '#9ab8e8'); A.r(x + 14, top + 34, 34, 2, AL[3]);   // a solar panel
    for (const vx of [x + 62, x + 104]) { A.r(vx, top + 20, 14, 10, AL[0]); A.r(vx, top + 30, 14, 3, AL[3]); A.r(vx + 3, top + 23, 8, 4, AL[3]); }                                  // roof vents
    roofDish(A, x + W2 - 26, top + 12);
    for (const [sx, sy, r] of [[64, d - 18, 16], [80, d - 14, 10], [128, 52, 9]]) { A.ell(x + sx, top + sy, r, Math.round(r * 0.4), '#d2c6aa'); A.ell(x + sx - 2, top + sy - 1, Math.round(r * 0.6), 1, '#e2d8c0'); }   // blown sand
    A.r(x + 1, top + d - 3, W2, 3, AL[3]);
    // the front wall: ribbed siding, rounded ends, a blue stripe
    const wy = top + d;
    A.r(x + 1, wy, W2, wallH, AL[1]);
    for (let j = wy + 2; j < wy + wallH - 4; j += 3) { A.hl(x + 1, j, W2, AL[0]); A.hl(x + 1, j + 1, W2, AL[2]); }
    A.r(x + 1, wy + 15, W2, 5, SHUTTER[1]); A.hl(x + 1, wy + 15, W2, SHUTTER[0]); A.hl(x + 1, wy + 19, W2, SHUTTER[3]);
    A.vl(x + 1, wy, wallH, '#ffffff'); A.r(x + W2 - 2, wy, 3, wallH, AL[3]);
    A.r(x + 1, wy + wallH - 4, W2, 4, AL[3]); A.hl(x + 1, wy + wallH - 1, W2, AL[4]);
    // under it: the dark gap, wheels on blocks, the tow hitch
    A.r(x + 6, wy + wallH, W2 - 12, 4, '#3a3632');
    for (const tx of [x + Math.round(W2 * 0.4), x + Math.round(W2 * 0.4) + 17]) { A.ell(tx, wy + wallH + 1, 7, 5, '#20242c'); A.ell(tx, wy + wallH + 1, 3, 2, '#86949e'); A.r(tx - 4, wy + wallH + 5, 9, 3, '#8a7a68'); }
    A.poly([[x - 5, wy + wallH - 2], [x + 2, wy + wallH - 7], [x + 2, wy + wallH - 4], [x - 3, wy + wallH]], '#5e6874'); A.r(x - 7, wy + wallH - 2, 3, 6, '#3a3e48'); A.ell(x - 6, wy + wallH + 4, 2, 2, '#20242c');
    // windows: one with the air conditioner, dripping; one with a curtain half drawn
    const w1 = x + 14, w2 = x + W2 - 44;
    win(A, w1, wy + 5, 26, 14, { frame: [AL[2], AL[3], AL[4], '#3a4250'] });
    A.r(w1 + 4, wy + 12, 18, 12, '#e8ecef'); A.hl(w1 + 4, wy + 12, 18, '#ffffff'); A.r(w1 + 4, wy + 22, 18, 3, AL[3]);                                             // the AC box
    for (let i = w1 + 6; i < w1 + 20; i += 2) A.vl(i, wy + 14, 6, AL[3]); A.soft(w1 + 12, wy + 25, 3, wallH - 29, '#5e6874', 0.35); A.px(w1 + 13, wy + wallH - 2, '#62b4ec');   // grille, a drip stain
    win(A, w2, wy + 5, 24, 13, { lit: true, frame: [AL[2], AL[3], AL[4], '#3a4250'] });
    // the door: a Swedish flag sticker; wooden steps, the Ministry's letters, unopened
    const dx = x + Math.round(W2 * 0.62);
    door(A, dx, wy + 6, 16, wallH - 8, AL, [AL[2], AL[3], AL[4], '#3a4250']);
    A.r(dx + 4, wy + 11, 8, 6, '#2f5fae'); A.r(dx + 6, wy + 11, 2, 6, '#f0c040'); A.r(dx + 4, wy + 13, 8, 2, '#f0c040');
    A.r(dx - 3, wy + wallH - 2, 22, 3, WOOD[1]); A.hl(dx - 3, wy + wallH - 2, 22, WOOD[0]); A.r(dx - 5, wy + wallH + 2, 26, 3, WOOD[1]); A.hl(dx - 5, wy + wallH + 2, 26, WOOD[0]); A.hl(dx - 5, wy + wallH + 5, 26, WOOD[3]);
    for (let k = 0; k < 4; k++) { A.r(dx + 12 - k, wy + wallH - 5 - k * 2 + 6, 8, 2, k & 1 ? '#f4f0e4' : '#ffffff'); A.px(dx + 17 - k, wy + wallH - 5 - k * 2 + 6, '#d04838'); }
    A.r(dx - 2, wy - 1, 20, 3, AL[3]); A.hl(dx - 2, wy - 1, 20, AL[0]);                                                                                            // a little drip rail over it
    A.line(x + W2, wy + wallH - 6, x + W2 + 5, wy + wallH + 6, '#20242c');                                                                                          // the cable to the generator
    return fit(st);
};
// the old Ministry post: a concrete hut with one barred window, abandoned when the visitors' centre
// was built. Render peeling to the breeze blocks, rust running from the rebar, a faded sign, sand drifted
// against it, a slab porch on two posts over a green steel door. Farouk keeps his spare galabeya in it.
SPR_L['ministry post'] = (w, d) => {
    const wallH = 42, st = stage(w, d, wallH + 30, 4), { A } = st, x = st.x, top = st.y - wallH, R = rng('minpost');
    const C = ['#ece6da', '#d6cebe', '#b8ae9c', '#8e8474', '#625a4e'];
    roofFlat(A, x, top, w, d, C);
    for (const cx of [x, x + w - 8]) { A.r(cx, top - 5, 8, 7, C[0]); A.hl(cx, top - 5, 8, '#ffffff'); A.vl(cx + 7, top - 5, 7, C[2]); for (let k = 0; k < 3; k++) A.vl(cx + 2 + k * 2, top - 12 + k, 8 - k, '#9a4a2c'); }   // corner piers, rebar
    for (let i = 0; i < 9; i++) { const rx = x + 10 + R() * (w - 30), ry = top + 8 + R() * (d - 20); A.line(rx, ry, rx + 6 + R() * 10, ry + 2 + R() * 6, C[2]); }                    // cracks in the slab
    A.soft(x + 6, top + d - 22, 46, 16, '#d8b878', 0.5); A.soft(x + 10, top + d - 16, 30, 10, '#d8b878', 0.5);                                                                      // sand on the roof
    roofTank(A, x + 26, top + 6); roofDish(A, x + Math.round(w * 0.55), top + 10);
    const lx = x + 70, ly = top + 18;                                                                                                                                               // a washing line: Farouk's spare galabeya, drying
    A.r(lx, ly, 2, 22, '#86949e'); A.r(lx + 70, ly, 2, 22, '#86949e'); for (let i = 0; i < 70; i++) A.px(lx + 1 + i, ly + 1 + Math.round(Math.sin(i / 70 * Math.PI) * 3), '#5a6068');
    A.poly([[lx + 22, ly + 4], [lx + 36, ly + 4], [lx + 38, ly + 24], [lx + 20, ly + 24]], '#f4f0e4'); A.r(lx + 17, ly + 5, 5, 8, '#f4f0e4'); A.r(lx + 36, ly + 5, 5, 8, '#f4f0e4'); A.vl(lx + 29, ly + 6, 16, '#d8d0bc'); A.hl(lx + 20, ly + 24, 19, '#c8bea8');
    A.r(lx + 48, ly + 4, 9, 7, '#6a8ad0'); A.r(lx + 52, ly + 4, 8, 5, '#d04838');                                                                                                      // and a towel, and a scarf
    for (let k = 0; k < 3; k++) { A.ell(x + w - 40, top + 26 - k * 4, 10, 4, '#2a2a2e'); A.ell(x + w - 40, top + 26 - k * 4, 5, 2, '#5a5a60'); }                                    // old tyres
    const cx0 = x + 150, cy0 = top + 10;                                                                                                                                             // a pigeon loft, the way every Egyptian roof has one
    A.r(cx0, cy0 + 6, 26, 20, WOOD[1]); A.poly([[cx0 - 2, cy0 + 7], [cx0 + 13, cy0], [cx0 + 28, cy0 + 7]], WOOD[3]); A.hl(cx0 - 2, cy0 + 7, 30, WOOD[0]);
    for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) { A.r(cx0 + 3 + i * 8, cy0 + 10 + j * 8, 4, 4, '#2a1c14'); }
    A.r(cx0 + 4, cy0 - 3, 3, 2, '#c8ccd4'); A.px(cx0 + 7, cy0 - 3, '#9aa0b0'); A.r(cx0 + 18, cy0 + 1, 3, 2, '#e8eaf0');                                                             // pigeons on it
    A.r(x + 104, top + 50, 20, 14, C[3]); A.r(x + 106, top + 52, 16, 10, '#5a5248'); A.hl(x + 104, top + 50, 20, C[0]); A.line(x + 106, top + 52, x + 121, top + 61, '#3a342e');   // the roof hatch
    A.r(x + 132, top + 58, 8, 6, '#2f7a3a'); A.r(x + 132, top + 52, 8, 6, '#3e8a58'); A.vl(x + 131, top + 58, 8, '#2a6440'); A.vl(x + 140, top + 58, 8, '#2a6440');                     // a broken chair, of course
    for (let i = 0; i < 6; i++) { A.ell(x + w - 46 + i * 6, top + d - 12, 4, 3, '#c9b48e'); A.hl(x + w - 49 + i * 6, top + d - 10, 7, '#8a7658'); }                               // sandbags
    A.r(x + Math.round(w * 0.8), top - 22, 1, 30, '#5a6872'); A.line(x + Math.round(w * 0.8), top - 20, x + Math.round(w * 0.8) - 8, top + 6, '#5a6872'); A.px(x + Math.round(w * 0.8), top - 23, '#d0402f');   // a radio mast, guyed
    const fx = x + 8, fy = top - 30;                                                                                                                                                // the flag, faded and frayed
    A.r(fx, fy, 2, 34, '#86949e'); A.r(fx + 2, fy, 15, 3, '#c85a48'); A.r(fx + 2, fy + 3, 15, 3, '#f4efe4'); A.r(fx + 2, fy + 6, 15, 3, '#3a3a40'); A.px(fx + 9, fy + 4, '#d8a830');
    A.px(fx + 17, fy + 2, '#c85a48'); A.px(fx + 17, fy + 7, '#3a3a40'); A.px(fx + 16, fy + 8, '#3a3a40');   // frayed ends
    // the front wall: cement render over breeze block, stained and peeling
    const wy = top + d;
    A.r(x, wy, w, wallH, C[1]);
    for (let i = 0; i < 5; i++) {                                                                                                                                                   // render fallen away: the blocks show
        const px = x + 8 + Math.round(R() * (w - 50)), py = wy + 6 + Math.round(R() * (wallH - 18)), bw = 14 + Math.round(R() * 14), bh = 7 + Math.round(R() * 5);
        A.r(px, py, bw, bh, '#a8a296'); for (let j = 0; j < bh; j += 4) { A.hl(px, py + j, bw, '#8a8478'); for (let k = (j / 4 & 1) * 5; k < bw; k += 10) A.vl(px + k, py + j, 4, '#8a8478'); } A.hl(px, py - 1, bw, '#f4f0e6');
    }
    for (let i = 0; i < 7; i++) { const sx = x + 6 + Math.round(R() * (w - 12)); A.soft(sx, wy + 2, 2 + Math.round(R() * 2), 8 + R() * 18, '#8a5a3a', 0.28); }                        // rust and rain stains
    A.r(x, wy, w, 4, C[3]); A.hl(x, wy + 4, w, C[2]);
    A.r(x, wy + wallH - 8, w, 8, C[2]); A.hl(x, wy + wallH - 8, w, C[3]); A.hl(x, wy + wallH - 1, w, C[4]);                                                                            // a plinth
    // one window, barred, a rusty air conditioner under it
    const wx = x + Math.round(w * 0.1);
    A.r(wx - 3, wy + 8, 34, 22, C[3]); A.r(wx, wy + 10, 28, 18, '#2c3440'); A.r(wx, wy + 10, 28, 6, '#46505e'); A.line(wx + 2, wy + 26, wx + 10, wy + 11, '#6a7888');
    for (let i = 3; i < 28; i += 5) A.vl(wx + i, wy + 9, 20, '#5a6068'); A.hl(wx, wy + 18, 28, '#5a6068'); A.r(wx - 4, wy + 30, 36, 2, C[0]); A.hl(wx - 4, wy + 32, 36, C[4]);
    A.r(wx + 34, wy + 20, 18, 12, '#c8c4b8'); A.r(wx + 34, wy + 20, 18, 2, '#e8e4d8'); for (let i = wx + 36; i < wx + 50; i += 2) A.vl(i, wy + 23, 7, '#8a8070'); A.soft(wx + 34, wy + 26, 18, 6, '#9a5a30', 0.4);
    // the porch: a slab on two square posts, over the door
    const dx = x + Math.round(w * 0.66), px0 = dx - 12, pw = 42;
    A.soft(px0, wy, pw, 10, '#1a1410', 0.25);                                                                                                                                       // its shadow on the wall
    door(A, dx, wy + 12, 18, wallH - 12, ['#6cae7c', '#3e8a58', '#2a6440', '#1a4028'], C);
    for (const [a, b] of [[3, 16], [11, 24], [5, 30]]) { A.r(dx + a, wy + b, 3, 2, '#9a5a30'); A.px(dx + a + 3, wy + b, '#c07848'); }                                               // paint peeling to rust
    A.r(dx + 12, wy + 22, 3, 5, '#c89020'); A.px(dx + 12, wy + 22, '#ffe890');                                                                                                         // a padlock, hanging open
    A.r(px0, wy + 2, pw, 6, C[0]); A.hl(px0, wy + 2, pw, '#ffffff'); A.hl(px0, wy + 7, pw, C[3]);
    for (const qx of [px0 + 1, px0 + pw - 6]) { A.r(qx, wy + 8, 5, wallH - 6, C[0]); A.vl(qx, wy + 8, wallH - 6, '#ffffff'); A.vl(qx + 4, wy + 8, wallH - 6, C[3]); }
    A.r(dx + 5, wy + 8, 8, 3, '#3a3e48'); A.r(dx + 6, wy + 11, 6, 2, '#ffe890');                                                                                                         // a lamp over the door
    // the sign: MINISTRY OF ANTIQUITIES, in Arabic and English, sun-faded, one screw gone
    const sx = x + Math.round(w * 0.36), sy = wy + 9;
    A.poly([[sx, sy], [sx + 48, sy], [sx + 48, sy + 16], [sx, sy + 14]], '#2e4f9a'); A.r(sx + 1, sy + 1, 46, 12, '#5a78b8');
    A.r(sx + 4, sy + 3, 20, 1, '#f4efe4'); A.r(sx + 6, sy + 2, 1, 3, '#f4efe4'); A.r(sx + 14, sy + 2, 1, 3, '#f4efe4'); A.r(sx + 28, sy + 3, 16, 1, '#f4efe4');                      // Arabic, a flourish
    A.r(sx + 4, sy + 8, 40, 1, '#dfe6ea'); A.r(sx + 4, sy + 10, 28, 1, '#dfe6ea'); A.px(sx + 2, sy + 2, '#c8d4dc'); A.px(sx + 46, sy + 13, '#c8d4dc');
    // a bench by the wall; sand drifted against the wall
    const bx = x + w - 40;
    A.r(bx, wy + wallH - 12, 28, 3, WOOD[0]); A.hl(bx, wy + wallH - 10, 28, WOOD[3]); A.r(bx + 2, wy + wallH - 9, 2, 8, WOOD[3]); A.r(bx + 24, wy + wallH - 9, 2, 8, WOOD[3]);
    for (const [ax, aw] of [[x - 2, 34], [x + w - 30, 34], [wx + 40, 20]]) { A.ell(ax + (aw >> 1), wy + wallH - 1, aw >> 1, 4, '#ecd698'); A.hl(ax + 4, wy + wallH - 4, aw - 8, '#f6e6b4'); }
    A.line(x + w - 2, wy + 4, x + w + 3, wy + 16, '#20242c');                                                                                                                         // a cable off to nowhere
    return fit(st, { light: { x: dx - x - (w >> 1) + 9, y: -wallH + 14, r: 56, c: '#ffe0a0' } });
};
// the guard booth: a little whitewashed sentry box with windows all round, so whoever's on duty sees
// every road. Through the glass: Farouk's chair, his radio, his thermos. A tin of basil on the sill.
SPR_L['guard booth'] = (w, d) => {
    const H = 38, bd = 26, st = stage(w, d, 30, 4), { A } = st, x = st.x + 8, bw = w - 16, base = st.y + d - 5, wy = base - H, top = wy - 6 - bd;
    // the roof slab, overhanging, a blue fascia; a loudspeaker, a lamp, a jerrycan on it
    A.r(x - 5, top - 2, bw + 10, bd + 4, WHITEWASH[1]); A.r(x - 1, top + 2, bw + 2, bd - 4, WHITEWASH[2]); A.hl(x - 5, top - 2, bw + 10, '#ffffff'); A.vl(x + bw + 4, top - 2, bd + 4, WHITEWASH[3]);
    A.r(x - 5, top + bd + 2, bw + 10, 4, SHUTTER[1]); A.hl(x - 5, top + bd + 2, bw + 10, SHUTTER[0]); A.hl(x - 5, top + bd + 5, bw + 10, SHUTTER[3]);
    A.r(x + 12, top + 6, 3, 10, '#5a6872'); A.poly([[x + 7, top + 2], [x + 19, top + 2], [x + 17, top + 8], [x + 9, top + 8]], '#c2c9d2'); A.hl(x + 7, top + 2, 12, '#ffffff'); A.r(x + 11, top + 3, 4, 3, '#5a6872');
    A.r(x + bw - 20, top + 8, 12, 12, '#6a7440'); A.hl(x + bw - 20, top + 8, 12, '#8a9458'); A.r(x + bw - 17, top + 5, 4, 3, '#4c5630'); A.line(x + bw - 19, top + 11, x + bw - 10, top + 18, '#4c5630');
    // the walls
    A.r(x, wy, bw, H, WHITEWASH[0]); A.vl(x + bw - 1, wy, H, WHITEWASH[2]); A.r(x, wy, bw, 2, WHITEWASH[3]); A.soft(x, wy + 2, bw, 4, '#3a2a1c', 0.12);
    // the window band: dim inside, warm lamplight, his things
    const gy = wy + 6, gh = 17, gw = bw - 30;
    A.r(x + 3, gy - 1, gw + 2, gh + 2, SHUTTER[3]); A.r(x + 4, gy, gw, gh, '#f5c870'); A.r(x + 4, gy + 9, gw, gh - 9, '#e0a050'); A.r(x + 4, gy, gw, 2, '#ffe8a8');
    A.r(x + 8, gy + 5, 10, 12, '#8e5e32'); A.r(x + 8, gy + 5, 10, 2, '#b8844c'); A.r(x + 9, gy + 8, 8, 1, '#6e4424');                                                              // the chair back
    A.r(x + 22, gy + 9, 12, 7, '#3a3e48'); A.r(x + 23, gy + 10, 5, 4, '#1c1e24'); A.r(x + 29, gy + 10, 4, 2, '#f0c040'); A.r(x + 29, gy + 13, 4, 1, '#9aa4ae'); A.line(x + 33, gy + 9, x + 38, gy + 2, '#9aa4ae');   // the transistor radio
    A.r(x + 39, gy + 6, 4, 10, '#9aa4ae'); A.r(x + 39, gy + 6, 4, 2, '#d04838'); A.vl(x + 39, gy + 8, 8, '#dfe6ea');                                                               // the thermos
    A.r(x + 46, gy + 10, 7, 6, '#2f7a3a'); A.hl(x + 46, gy + 10, 7, '#58a848'); A.px(x + 49, gy + 12, '#f0c040');                                                                  // the Qur'an in its cloth cover
    A.r(x + 5, gy + 2, 8, 2, '#d04838'); A.r(x + 5, gy + 4, 8, 1, '#ffffff');                                                                                                          // a calendar, a year out of date
    for (const vx of [x + 20, x + 37]) A.vl(vx, gy, gh, SHUTTER[3]);
    A.r(x + 2, gy + gh + 1, gw + 4, 2, WHITEWASH[1]); A.hl(x + 2, gy + gh + 3, gw + 4, WHITEWASH[3]);
    A.r(x + 44, gy + gh - 4, 6, 5, '#9aa4ae'); A.hl(x + 44, gy + gh - 4, 6, '#dfe6ea'); A.ell(x + 47, gy + gh - 6, 4, 3, '#58a848'); A.px(x + 45, gy + gh - 8, '#8cd060'); A.px(x + 49, gy + gh - 7, '#8cd060');   // basil in a tin
    // the door: blue, a little window, a lamp over it
    const dx = x + bw - 22;
    door(A, dx, wy + 5, 15, H - 5, SHUTTER, WHITEWASH);
    A.r(dx + 4, wy + 8, 7, 6, '#f5c870'); A.hl(dx + 4, wy + 8, 7, '#ffe8a8');
    A.r(x, base - 9, dx - x - 2, 4, SHUTTER[1]); A.hl(x, base - 9, dx - x - 2, SHUTTER[0]); A.r(x + 6, base - 8, 14, 2, '#ffffff'); A.r(x + 24, base - 8, 8, 2, '#ffffff');   // a blue band, a painted number
    A.r(x, base - 2, bw, 2, WHITEWASH[3]);
    A.r(dx + 4, wy + 1, 7, 3, '#3a3e48'); A.r(dx + 5, wy + 4, 5, 1, '#ffe890');
    A.r(dx - 2, base, 19, 3, '#c9b48e'); A.hl(dx - 2, base + 2, 19, '#8a7658');                                                                                                       // a stone step
    // outside: a plastic chair, a kettle on a little gas ring
    A.r(x - 8, base - 12, 7, 7, '#f4f4f0'); A.r(x - 8, base - 17, 7, 5, '#e8e8e2'); A.hl(x - 8, base - 17, 7, '#ffffff'); A.vl(x - 8, base - 5, 5, '#c8c8c0'); A.vl(x - 2, base - 5, 5, '#c8c8c0');
    A.r(x + bw + 1, base - 5, 7, 5, '#3a3e48'); A.ell(x + bw + 4, base - 8, 4, 3, '#9aa4ae'); A.px(x + bw + 3, base - 10, '#dfe6ea'); A.line(x + bw + 7, base - 9, x + bw + 9, base - 11, '#9aa4ae');
    return fit(st, { solid: [6, d - 42, w - 12, 38], light: { x: dx - st.x - (w >> 1) + 8, y: -H + 2, r: 50, c: '#ffe0a0' } });
};
SPR_L['gear storage'] = (w, d) => {              // an open canopy, striped, over stacked crates
    const st = stage(w, d, 30), { A } = st, x = st.x, top = st.y - 30;
    for (const px of [x + 1, x + w - 4]) { A.r(px, top + d, 3, 30, WOOD[2]); A.vl(px, top + d, 30, WOOD[0]); }
    A.soft(x + 3, top + d, w - 6, 30, '#20141c', 0.18);                                                               // shade under it
    for (let i = 0; i < w - 20; i += 18) crateAt(A, x + 8 + i, st.base - 17 - (i % 36 ? 0 : 7), 16, i % 36 ? 0 : 1);
    for (let i = 0; i < w; i += 10) { A.r(x + i, top, 5, d, '#8ca05c'); A.r(x + i + 5, top, 5, d, '#e9dfb8'); }        // green and cream stripes
    A.r(x, top, w, 2, '#ffffff'); A.soft(x, top + (d >> 1), w, d - (d >> 1), '#20141c', 0.12);
    for (let i = 0, k = 0; i < w - 1; i += 10, k++) A.poly([[x + i, top + d], [x + i + 10, top + d], [x + i + 5, top + d + 5]], k % 2 ? '#e9dfb8' : '#8ca05c');   // scalloped front
    return fit(st);
};
// the sheikh's tomb: a whitewashed cube and dome, a green door, a green flag
SPR.c1p_maqam = (w, d) => {
    const s = 56, wallH = 24, st = stage(s, 40, wallH + 30), { A } = st, x = st.x, top = st.y - wallH, cx = x + (s >> 1);
    A.r(x, top, s, 40, PAL.white[1]); A.r(x + 3, top + 3, s - 6, 34, PAL.white[2]); A.r(x, top, s, 2, PAL.white[0]); A.vl(x, top, 40, PAL.white[0]);   // the roof, with its parapet
    for (const [px, py] of [[x, top - 3], [x + s - 5, top - 3], [x, top + 35], [x + s - 5, top + 35]]) { A.r(px, py, 5, 5, PAL.white[0]); A.r(px, py + 4, 5, 1, PAL.white[3]); }    // corner finials
    // the dome: a lit ball, shadowed down its right side
    const dy = top + 12, R = 19;
    A.ell(cx, dy + 6, R + 1, 8, PAL.white[3]);
    A.ell(cx, dy, R + 1, R + 1, PAL.line); A.ell(cx, dy, R, R, PAL.white[1]);
    A.ell(cx + 4, dy + 3, R - 5, R - 4, PAL.white[2]); A.ell(cx + 8, dy + 7, R - 10, R - 9, PAL.white[3]);
    A.ell(cx - 5, dy - 5, R - 7, R - 8, PAL.white[0]); A.ell(cx - 8, dy - 9, 4, 3, '#ffffff');
    A.r(cx - 12, dy + R - 4, 25, 5, PAL.white[1]); A.r(cx - 12, dy + R, 25, 1, PAL.white[3]);
    A.vl(cx, dy - R - 12, 12, PAL.gold[2]); A.ell(cx, dy - R - 1, 2, 2, PAL.gold[1]); A.r(cx + 1, dy - R - 12, 9, 6, PAL.green[2]); A.r(cx + 1, dy - R - 12, 9, 1, PAL.green[1]);
    const wy = top + 40;                                           // the front wall
    A.r(x, wy, s, wallH, PAL.white[1]); A.r(x, wy, s, 2, PAL.white[3]); A.dith(x, wy + wallH - 8, s, 8, PAL.white[2], 0); A.r(x, wy + wallH - 2, s, 2, PAL.white[3]);
    A.ell(cx, wy + 9, 6, 5, PAL.green[3]); A.r(cx - 6, wy + 9, 13, wallH - 9, PAL.green[3]); A.r(cx - 4, wy + 10, 9, wallH - 10, PAL.green[2]); A.vl(cx, wy + 6, wallH - 6, PAL.green[3]); A.px(cx - 2, wy + 15, PAL.gold[1]);
    for (const wx of [x + 8, x + s - 13]) { A.ell(wx + 2, wy + 9, 2, 2, PAL.dark[3]); A.r(wx, wy + 9, 5, 6, PAL.dark[3]); }
    A.r(x + 3, wy + wallH - 5, 7, 3, PAL.sand[2]);                                                // sand drifted at the foot
    return Object.assign(fit(st), { ox: Math.round((w - st.c.width) / 2), oy: Math.round(d - st.c.height + 1), solid: [(w - s) / 2, d - 40, s, 38] });
};
// the watchtower: four legs and a cabin on top
SPR.c1p_tower = (w, d) => {
    const s = 40, st = stage(s, 30, 78), { A } = st, x = st.x, top = st.y - 76;
    for (const lx of [x + 4, x + s - 6]) { A.r(lx, top + 30, 2, 76, PAL.metal[3]); }
    for (let j = 0; j < 4; j++) { const y = top + 38 + j * 16; A.line(x + 5, y, x + s - 6, y + 14, PAL.metal[2]); A.line(x + s - 6, y, x + 5, y + 14, PAL.metal[2]); A.r(x + 4, y, s - 8, 1, PAL.metal[3]); }
    A.r(x, top + 12, s, 20, PAL.olive[1]); A.r(x, top + 12, s, 2, PAL.olive[3]); A.r(x + 4, top + 17, s - 8, 7, PAL.dark[3]);
    A.r(x - 2, top, s + 4, 12, PAL.metal[2]); A.r(x - 2, top, s + 4, 2, PAL.metal[0]); A.r(x - 2, top + 10, s + 4, 2, PAL.metal[3]);
    for (let j = 0; j < 9; j++) A.r(x + (s >> 1) - 3, top + 34 + j * 8, 6, 1, PAL.wood[1]);   // ladder
    A.r(x + (s >> 1) - 4, top + 32, 1, 74, PAL.wood[2]); A.r(x + (s >> 1) + 3, top + 32, 1, 74, PAL.wood[2]);
    return Object.assign(fit(st), { ox: Math.round((w - st.c.width) / 2), oy: d - st.c.height + 1 });
};
// mud-brick tomb chapels with vaulted roofs, half drifted in
SPR.c1p_cemetery = (w, d) => {
    const st = stage(w, d, 20), { A } = st, R = rng('cem');
    const spots = [[0.1, 0.18, 46], [0.4, 0.05, 58], [0.72, 0.2, 40], [0.2, 0.6, 40], [0.58, 0.55, 46]];
    for (const [fx, fy, cw] of spots) {
        const x = st.x + Math.round(fx * w), y = st.y + Math.round(fy * d), ch = 24;
        A.r(x, y, cw, ch, PAL.brick[1]); A.ell(x + (cw >> 1), y + 3, cw >> 1, 7, PAL.brick[0]); A.r(x, y + 3, cw, ch - 3, PAL.brick[1]);
        A.ell(x + (cw >> 1) - 2, y + 1, (cw >> 1) - 4, 4, PAL.brick[0]);
        A.r(x, y + ch, cw, 14, PAL.brick[2]); for (let j = 0; j < 14; j += 4) A.hl(x, y + ch + j, cw, PAL.brick[3]);
        A.r(x + (cw >> 1) - 3, y + ch + 3, 6, 11, PAL.dark[3]);
        A.ell(x + cw - 6 + R() * 6, y + ch + 13, 12, 4, PAL.sand[1]);          // drifted sand
    }
    return fit(st);
};
// the ruined village: broken mud-brick walls
SPR.ow_ruins = (w, d) => {
    const st = stage(w, d, 22), { A } = st, R = rng('ruins');
    for (let i = 0; i < 9; i++) {
        const x = st.x + Math.round(R() * (w - 60)), y = st.y + Math.round(R() * (d - 20)), ww = 28 + Math.round(R() * 46), hh = 8 + Math.round(R() * 14);
        A.r(x, y - hh, ww, 6, PAL.brick[0]);
        for (let k = 0; k < ww; k += 5) A.r(x + k, y - hh - Math.round(R() * 5), 5, 6, PAL.brick[0]);   // a broken top edge
        A.r(x, y - hh + 6, ww, hh, PAL.brick[2]); for (let j = 2; j < hh; j += 4) A.hl(x, y - hh + 6 + j, ww, PAL.brick[3]);
        if (R() < 0.5) A.r(x + 6, y - hh + 10, 7, hh - 4, PAL.dark[3]);
    }
    return fit(st);
};
// the builders' ramp: rubble and mud brick rising to the east
SPR.c1p_ramp = (w, d) => {
    const st = stage(w, d, 30), { A } = st, x = st.x, y = st.y;
    A.poly([[x, y + d], [x + w, y + d], [x + w, y - 26], [x, y + 4]], PAL.brick[2]);
    A.poly([[x, y + 4], [x + w, y - 26], [x + w, y - 26 + d - 6], [x, y + d - 2]], PAL.brick[0]);
    for (let i = 8; i < w; i += 14) A.line(x + i, y + 4 - Math.round(i * 30 / w) + 2, x + i, y + d - 4 - Math.round(i * 24 / w), PAL.brick[1]);   // sledge sleepers
    for (let j = 0; j < 30; j += 4) A.hl(x + Math.round(w * (1 - j / 30) * 0.2), y + d - j, w, PAL.brick[3]);
    return fit(st);
};

// ---- VEHICLES ----
// Seen like the buildings: from above and a little to the south. A car
// faces right (east): you see its roof, bonnet, windscreen and boot from
// above, and its south flank below that, with the doors, windows and two
// wheels in their arches. Palettes are [light, mid, dark, deep].
const GLASS = ['#c4e6fa', '#8ec2ea', '#4a7cb8', '#2a4a78'];
function wheel(A, cx, cy, r, hub) {
    A.ell(cx, cy, r, r, '#1a1c22'); A.ell(cx, cy, r - 1, r - 1, '#2a2c34');
    A.ell(cx, cy, Math.max(1, r - 3), Math.max(1, r - 3), hub || '#9aa4ae'); A.px(cx - 1, cy - 1, '#e6ecf0');
}
function carSprite(w, d, P, o) {
    o = o || {};
    const W = Math.min(w - 4, 96), D = Math.max(20, Math.min(Math.round(d * 0.45), 26)), sideH = 14, st = stage(W, D, sideH + 4, 6), { A } = st;
    const x = st.x, top = st.y + (st.d - D) - sideH, deck = top + D, bot = deck + sideH;
    const at = (f) => x + Math.round(W * f);
    // --- the body from above: a rounded slab ---
    A.r(x + 3, top, W - 6, D, P[1]); A.r(x + 1, top + 2, W - 2, D - 4, P[1]); A.r(x, top + 4, W, D - 8, P[1]);
    A.r(x + 3, top, W - 6, 1, P[0]);
    A.r(at(0.74), top + 2, at(0.97) - at(0.74), D - 4, P[0]); A.hl(at(0.74), top + 2, at(0.97) - at(0.74), '#ffffff'); A.hl(at(0.76), top + (D >> 1), at(0.95) - at(0.76), P[1]);   // the bonnet, a crease down it
    A.r(at(0.03), top + 2, at(0.2) - at(0.03), D - 4, P[0]);                                                                                         // the boot
    // --- the cabin, raised: rear window, roof, windscreen ---
    const cy0 = top + 3, cy1 = top + D - 3, roofL = o.boxy ? 0.24 : 0.3, roofR = 0.63;
    A.r(at(0.2), cy0, at(roofL) - at(0.2), cy1 - cy0, GLASS[3]); A.hl(at(0.2), cy0, at(roofL) - at(0.2), GLASS[2]);                             // rear window
    A.r(at(roofL), cy0 - 1, at(roofR) - at(roofL), cy1 - cy0 + 2, P[0]); A.hl(at(roofL), cy0 - 1, at(roofR) - at(roofL), '#ffffff'); A.vl(at(roofR) - 1, cy0, cy1 - cy0, P[2]);   // roof
    A.poly([[at(roofR), cy0 - 1], [at(0.74), cy0 + 1], [at(0.74), cy1 - 1], [at(roofR), cy1 + 1]], GLASS[1]);                                    // windscreen, raked
    A.r(at(roofR) + 1, cy0 + ((cy1 - cy0) >> 1), at(0.74) - at(roofR) - 1, (cy1 - cy0) >> 1, GLASS[2]);
    A.line(at(roofR) + 2, cy1 - 2, at(0.71), cy0 + 2, '#ffffff');
    if (o.rack) for (let k = 0; k < 3; k++) A.hl(at(roofL) + 2, cy0 + 2 + k * Math.round((cy1 - cy0 - 4) / 2), at(roofR) - at(roofL) - 4, P[3]);
    if (o.lightbar) { const lx = at(0.42); A.r(lx, cy0 + 2, 7, 4, '#d0402f'); A.r(lx + 7, cy0 + 2, 7, 4, '#3c78c0'); A.hl(lx, cy0 + 2, 14, '#ffffff'); }
    // --- the south flank: windows along the cabin, doors, the sill ---
    A.r(x, deck, W, sideH, P[1]); A.hl(x, deck, W, P[0]); A.r(x, deck, 2, sideH - 3, P[2]); A.r(x + W - 2, deck, 2, sideH - 3, P[2]);
    A.r(at(0.21), deck + 1, at(0.72) - at(0.21), 5, o.tint || GLASS[3]); A.hl(at(0.21), deck + 1, at(0.72) - at(0.21), GLASS[2]);
    A.vl(at(0.46), deck + 1, 5, P[2]); A.px(at(0.27), deck + 3, GLASS[0]); A.px(at(0.53), deck + 3, GLASS[0]);
    A.vl(at(0.46), deck + 6, sideH - 9, P[2]); A.vl(at(0.21), deck + 6, sideH - 9, P[2]); A.vl(at(0.72), deck + 6, sideH - 9, P[2]);
    A.r(at(0.25), deck + 8, 3, 1, P[3]); A.r(at(0.5), deck + 8, 3, 1, P[3]);
    if (o.stripe) { A.r(x + 2, deck + 9, W - 4, 2, o.stripe[1]); if (o.badge) { A.r(at(0.3), deck + 7, 10, 5, '#ffffff'); A.hl(at(0.3) + 2, deck + 9, 6, o.stripe[2]); } }
    A.r(x, bot - 3, W, 3, P[2]); A.hl(x, bot - 1, W, P[3]);
    A.r(x + W - 3, deck + 2, 3, 3, '#fff4c0'); A.r(x, deck + 2, 2, 3, '#d0402f');
    A.r(x - 1, deck + sideH - 5, 3, 3, '#3a3e48'); A.r(x + W - 2, deck + sideH - 5, 3, 3, '#3a3e48');
    A.r(at(0.72), deck - 2, 3, 3, P[2]);                                                                                                           // wing mirror
    for (const f of [0.19, 0.81]) { const cx = at(f); A.ell(cx, bot - 3, 8, 6, P[3]); wheel(A, cx, bot, 6, o.hub); }                              // wheels in their arches
    if (o.dust) for (let k = 0; k < 8; k++) A.px(x + hash2(k, W) * W, deck + 3 + hash2(W, k) * (sideH - 6), P[0]);
    return st;
}
function truckSprite(w, d, cabP, load) {
    const W = Math.min(w, 150), D = Math.max(26, Math.min(d, 44)), sideH = 20, st = stage(W, D, sideH + 8, 4), { A } = st;
    const x = st.x, top = st.y - sideH, deck = top + D, bot = deck + sideH, cabX = x + W - 42;
    // the load bed with a tarp over hoops, from above and from the side
    A.r(x, top - 6, cabX - x - 2, D + 6, load[1]); A.hl(x, top - 6, cabX - x - 2, load[0]);
    for (let i = x + 8; i < cabX - 4; i += 14) { A.vl(i, top - 6, D + 6, load[2]); A.vl(i + 1, top - 5, D + 4, load[0]); }   // the hoops under the canvas
    A.r(x, deck, cabX - x - 2, sideH - 6, load[2]); A.hl(x, deck, cabX - x - 2, load[1]);
    for (let i = x + 4; i < cabX - 6; i += 9) A.vl(i, deck + 2, sideH - 9, load[3]);                                        // lacing
    A.r(x, deck + sideH - 6, cabX - x, 3, '#6a4a30'); A.hl(x, deck + sideH - 6, cabX - x, '#8a6440');                     // the wooden bed
    // the cab
    A.r(cabX, top + 4, 40, D - 4, cabP[0]); A.hl(cabX, top + 4, 40, '#ffffff');
    A.r(cabX + 24, top + 6, 8, D - 8, GLASS[1]); A.r(cabX + 24, top + 6 + ((D - 8) >> 1), 8, (D - 8) >> 1, GLASS[2]);       // windscreen
    A.r(cabX + 32, top + 6, 8, D - 8, cabP[1]);                                                                            // bonnet
    A.r(cabX, deck, 40, sideH, cabP[1]); A.hl(cabX, deck, 40, cabP[0]);
    A.r(cabX + 6, deck + 3, 16, 7, GLASS[3]); A.hl(cabX + 6, deck + 3, 16, GLASS[1]); A.px(cabX + 9, deck + 5, GLASS[0]);    // door window
    A.vl(cabX + 24, deck + 3, sideH - 7, cabP[2]); A.r(cabX + 18, deck + 12, 3, 1, cabP[3]);
    A.r(cabX + 30, deck + 3, 10, sideH - 7, cabP[2]); for (let j = deck + 5; j < deck + sideH - 5; j += 2) A.hl(cabX + 31, j, 8, cabP[3]);   // radiator grille
    A.r(cabX + 37, deck + 4, 3, 3, '#fff4c0');
    A.r(x, bot - 3, W, 3, '#2a2c34');
    for (const cx of [x + 16, x + 34, cabX + 26]) { A.ell(cx, bot - 2, 9, 6, '#1a1c22'); wheel(A, cx, bot, 7); }
    return st;
}
const CAR_BLACK = ['#5a5e6c', '#30343e', '#1e2028', '#101218'], CAR_WHITE = ['#ffffff', '#e6eaef', '#b8c0ca', '#8a94a0'], CAR_RUST = ['#d49a6c', '#a86a44', '#7a4a30', '#523020'];
SPR.inspector = (w, d) => fit(carSprite(w, d, CAR_BLACK, { rack: true, boxy: true, tint: '#101820', hub: '#5a6272' }));             // the black Land Cruiser
SPR_L['ministry vehicle'] = (w, d, o) => fit(carSprite(w, d, CAR_WHITE, { stripe: ['#6a8ad0', '#2e5aa0', '#1f3a74'], badge: true, lightbar: o && o.id === 'd_min1' }));
SPR_L['supply truck'] = (w, d) => fit(truckSprite(w, d, ['#78b0e0', '#3c78c0', '#285496', '#1a3868'], ['#ece0b8', '#d4c090', '#b09c6c', '#8a7650']));
SPR.ow_wreck = (w, d) => {                                   // the expedition's 1926 truck: spoked wheels, a canvas cab, rusted where it stopped
    const W = 86, D = 20, sideH = 18, st = stage(W, D, sideH + 8, 6), { A } = st, x = st.x, top = st.y + (st.d - D) - sideH, deck = top + D, bot = deck + sideH;
    const RUST = ['#d49a6c', '#a86a44', '#7a4a30', '#523020'], PLANK = ['#b8946a', '#94704c', '#6e5034'];
    // the bed: grey old boards, one missing
    A.r(x, top + 2, 46, D - 2, PLANK[1]); for (let i = x + 2; i < x + 46; i += 6) A.vl(i, top + 2, D - 2, PLANK[2]); A.r(x + 26, top + 6, 6, D - 8, '#3a2a1c');
    A.r(x, deck, 46, 8, PLANK[1]); A.hl(x, deck, 46, PLANK[0]); for (let i = x + 3; i < x + 46; i += 9) A.vl(i, deck + 1, 7, PLANK[2]);
    // the cab: an open box under a sagging canvas roof on four posts
    A.r(x + 46, top - 6, 18, D + 4, '#c8b888'); A.hl(x + 46, top - 6, 18, '#e8dcb0'); A.r(x + 46, top + D - 4, 18, 2, '#9a885c'); for (let i = x + 49; i < x + 64; i += 5) A.vl(i, top - 5, D + 2, '#b0a070');
    for (const px of [x + 46, x + 62]) A.r(px, deck - 2, 2, 10, '#3a2a1c');
    A.r(x + 48, deck + 1, 12, 6, '#2a1c14'); A.r(x + 50, deck + 2, 6, 2, '#6a4a30'); A.ell(x + 60, deck, 3, 2, '#3a2a1c');                   // seat, steering wheel
    // the long bonnet and the radiator standing up at the front
    A.r(x + 64, top + 4, 18, D - 6, RUST[0]); A.hl(x + 64, top + 4, 18, '#e8b88c'); A.hl(x + 65, top + (D >> 1), 16, RUST[1]);
    A.r(x + 64, deck, 18, 10, RUST[1]); for (let i = x + 66; i < x + 80; i += 3) A.vl(i, deck + 2, 6, RUST[2]);                               // louvres
    A.r(x + 82, top, 5, D + 10, RUST[2]); A.r(x + 83, top + 2, 3, D + 6, '#3a2a1c'); for (let j = top + 3; j < deck + 8; j += 2) A.hl(x + 83, j, 3, RUST[3]);   // radiator
    A.ell(x + 84, deck - 2, 3, 3, '#e8dcb0');                                                                                                   // a headlamp, glass long gone
    // mudguards arching over big spoked wheels (the front one sunk in the sand)
    const spoked = (cx, cy, r) => { A.ell(cx, cy, r, r, '#2a1c14'); A.ell(cx, cy, r - 2, r - 2, RUST[2]); for (let k = 0; k < 8; k++) A.line(cx, cy, cx + Math.round(Math.cos(k * 0.785) * (r - 2)), cy + Math.round(Math.sin(k * 0.785) * (r - 2)), RUST[0]); A.ell(cx, cy, 1, 1, '#1a1410'); };
    spoked(x + 14, bot - 1, 9); spoked(x + 72, bot, 9);
    for (const cx of [x + 14, x + 72]) { A.poly([[cx - 12, deck + 10], [cx - 8, deck + 5], [cx + 8, deck + 5], [cx + 12, deck + 10]], '#3a3e48'); A.hl(cx - 8, deck + 5, 16, '#5a6272'); }
    A.r(x + 26, deck + 8, 36, 2, '#3a3e48');                                                                                                      // running board
    // the desert has been at it for a century
    A.ell(x + 74, bot + 1, 16, 6, '#f2dca2'); A.hl(x + 60, bot - 4, 26, '#fbeec8'); A.ell(x + 10, bot + 2, 14, 4, '#e8cf8e');
    for (let k = 0; k < 10; k++) A.px(x + 4 + hash2(k, 3) * 78, top + 4 + hash2(3, k) * (D + sideH - 8), '#523020');
    return Object.assign(fit(st), { solid: [(w - W) / 2, d - 16, W, 14] });
};
// the supply train: a little diesel loco and two tipping skips, parked on the line
SPR.carts = (w, d) => {
    const W = 150, st = stage(W, 24, 22), { A } = st, x = st.x, top = st.y - 18;
    const skip = (sx, full) => {
        A.r(sx, top + 6, 40, 20, PAL.metal[2]); A.r(sx + 3, top + 8, 34, 14, full ? PAL.sand[3] : PAL.dark[2]);
        if (full) { A.ell(sx + 20, top + 12, 14, 5, PAL.sand[1]); A.dith(sx + 8, top + 12, 24, 5, PAL.sand[3], 0); }
        A.poly([[sx, top + 26], [sx + 40, top + 26], [sx + 34, top + 38], [sx + 6, top + 38]], PAL.red[2]);
        A.r(sx, top + 26, 40, 2, PAL.red[1]); A.r(sx + 2, top + 38, 36, 3, PAL.dark[2]);
        for (const tx of [sx + 8, sx + 28]) A.ell(tx + 2, top + 42, 4, 3, PAL.dark[3]);
    };
    skip(x + 60, true); skip(x + 106, false);
    A.r(x, top, 54, 24, PAL.gold[2]); A.r(x + 2, top + 2, 30, 18, PAL.gold[1]); A.r(x + 34, top - 4, 20, 26, PAL.gold[1]);   // loco: bonnet and cab roof
    A.r(x + 6, top - 5, 4, 8, PAL.dark[2]);                                                                               // exhaust
    A.r(x, top + 24, 54, 16, PAL.gold[2]); A.r(x, top + 24, 54, 2, PAL.gold[3]); A.r(x + 36, top + 26, 14, 7, PAL.blue[3]);
    for (let i = 4; i < 30; i += 5) A.vl(x + i, top + 27, 9, PAL.gold[3]);
    A.r(x, top + 38, 54, 3, PAL.dark[2]); A.r(x - 2, top + 32, 2, 5, PAL.red[1]);
    for (const tx of [x + 8, x + 24, x + 42]) A.ell(tx + 2, top + 42, 4, 3, PAL.dark[3]);
    return Object.assign(fit(st), { ox: Math.round((w - st.c.width) / 2), oy: d - st.c.height + 4 });
};

// ---- PROPS ----
// A wooden crate, three faces: the lid in the light, the front in half shade, a
// sliver of the east side in shadow; a frame of battens and a brace across.
function crateAt(A, x, y, s, kind) {
    const P = kind === 1 ? ['#f0cc90', '#d8aa68', '#b08048', '#7a5430'] : ['#dcae74', '#b8844c', '#8e5e32', '#5e3c20'];
    const t = Math.round(s * 0.42), h = Math.round(s * 0.6), side = 3;
    A.r(x, y, s - side, t, P[0]); for (let i = 4; i < s - side; i += 5) A.vl(x + i, y + 1, t - 2, P[1]); A.hl(x, y, s - side, '#fff0d0');   // the lid, planked
    A.poly([[x + s - side, y], [x + s, y + side], [x + s, y + t + h], [x + s - side, y + t + h - side + 3]], P[2]);                          // the east side
    A.r(x, y + t, s - side, h, P[1]);                                                                                                        // the front
    A.r(x, y + t, s - side, 2, P[2]); A.r(x, y + t + h - 2, s - side, 2, P[2]); A.r(x, y + t, 2, h, P[2]); A.r(x + s - side - 2, y + t, 2, h, P[2]);   // battens
    A.line(x + 2, y + t + h - 3, x + s - side - 3, y + t + 2, P[2]); A.line(x + 2, y + t + h - 4, x + s - side - 4, y + t + 2, P[0]);          // the brace
    for (const [nx, ny] of [[1, 1], [s - side - 2, 1], [1, h - 2], [s - side - 2, h - 2]]) A.px(x + nx, y + t + ny, P[3]);
    A.hl(x, y + t + h, s - side + 1, P[3]);
}
function propStage(w, d, cw, ch) { const st = stage(cw, ch, 0); st.fw = w; st.fd = d; return st; }
function propFit(st, w, d, extra) { return Object.assign({ c: outline(st.c), ox: Math.round((w - st.c.width) / 2), oy: Math.round(d - st.c.height + 1) }, extra || {}); }
function crates(w, d, seed) {
    const R = rng(seed), st = propStage(w, d, 44, 40), { A } = st, x = st.x, y = st.y;
    crateAt(A, x + 2, y + 16, 18, 0); crateAt(A, x + 22, y + 18, 17, 1); crateAt(A, x + 12, y + 2, 17, R() < 0.5 ? 1 : 0);
    return propFit(st, w, d, { solid: [w / 2 - 20, d - 22, 40, 20] });
}
SPR_L['crates'] = (w, d, o) => crates(w, d, o.id);
SPR_L['sorted crates'] = () => null;                           // (it sits on the same spot as the crates)
SPR_L['tarped supplies'] = (w, d) => { const st = propStage(w, d, 36, 26), { A } = st; A.ell(st.x + 18, st.y + 14, 17, 10, PAL.olive[1]); A.ell(st.x + 15, st.y + 10, 11, 5, PAL.olive[0]); A.r(st.x + 2, st.y + 20, 32, 3, PAL.olive[3]); A.line(st.x + 4, st.y + 12, st.x + 30, st.y + 18, PAL.canvas[3]); return propFit(st, w, d, { solid: [w / 2 - 16, d - 16, 32, 14] }); };
// An oil drum (or a plastic water drum): a cylinder lit from the left, two hoops, a lid
// with its rim and bung. Lying down, it shows its round end.
function drum(A, x, y, P3, lying) {
    const L = shade(P3[0], 0.3), M = P3[0], D = P3[1], DD = P3[2] || shade(P3[1], -0.4);
    if (lying) {
        A.r(x + 3, y + 3, 18, 12, M); A.r(x + 3, y + 3, 18, 3, L); A.r(x + 3, y + 12, 18, 3, D); A.hl(x + 3, y + 14, 18, DD);
        for (const hx of [x + 8, x + 15]) { A.vl(hx, y + 3, 12, D); A.vl(hx + 1, y + 3, 12, L); }
        A.ell(x + 21, y + 9, 3, 6, D); A.ell(x + 21, y + 9, 2, 4, M); A.px(x + 21, y + 7, DD);                                               // the end, facing east
        return;
    }
    const w = 12, h = 16, top = y + 2;
    A.r(x, top + 2, w, h, M); A.r(x + 1, top + 2, 3, h, L); A.r(x + w - 3, top + 2, 3, h, D); A.vl(x + w - 1, top + 2, h, DD);             // lit left, shadowed right
    for (const hy of [top + 6, top + 12]) { A.hl(x, hy, w, D); A.hl(x, hy + 1, w, L); }                                                   // rolling hoops
    A.ell(x + 6, top + h + 2, 6, 2, DD); A.r(x, top + h, w, 2, D);
    A.ell(x + 6, top + 2, 6, 2, shade(M, 0.1)); A.ell(x + 6, top + 2, 4, 1, D); A.px(x + 8, top + 1, DD); A.px(x + 3, top + 1, '#ffffff');   // the lid
}
SPR_L['water barrels'] = (w, d) => { const st = propStage(w, d, 50, 36), { A } = st; for (const i of [0, 1, 2]) drum(A, st.x + 2 + i * 15, st.y, PAL.blue); drum(A, st.x + 12, st.y + 18, PAL.blue, true); A.r(st.x + 10, st.y + 32, 4, 3, PAL.wood[2]); A.r(st.x + 30, st.y + 32, 4, 3, PAL.wood[2]); A.r(st.x + 33, st.y + 25, 3, 2, PAL.metal[1]); return propFit(st, w, d, { solid: [w / 2 - 24, d - 22, 48, 20] }); };
SPR_L['fuel drums'] = (w, d) => { const st = propStage(w, d, 50, 34), { A } = st; drum(A, st.x + 2, st.y, PAL.red); drum(A, st.x + 17, st.y + 2, PAL.dark); drum(A, st.x + 32, st.y, PAL.red); drum(A, st.x + 14, st.y + 18, PAL.blue, true); return propFit(st, w, d, { solid: [w / 2 - 24, d - 20, 48, 18] }); };
SPR_L['oil drum'] = (w, d) => { const st = propStage(w, d, 14, 22), { A } = st; drum(A, st.x, st.y, [PAL.brick[1], PAL.red[3], PAL.dark[1]]); return propFit(st, w, d, { solid: [w / 2 - 6, d - 8, 12, 8] }); };
SPR_L['sandbags'] = (w, d) => {                  // a low wall of sandbags, two courses, each bag tied off
    const n = Math.max(2, Math.round(w / 14)), st = propStage(w, d, n * 13 + 4, 22), { A } = st;
    for (let r = 0; r < 2; r++) for (let i = 0; i < n - r; i++) {
        const x = st.x + i * 13 + r * 6, y = st.y + 10 - r * 8;
        A.r(x + 1, y + 1, 12, 8, '#b8a070'); A.r(x, y + 2, 14, 6, '#b8a070'); A.r(x + 1, y + 1, 12, 3, '#e0cc98'); A.hl(x + 2, y + 1, 9, '#f4e4b8');
        A.r(x + 1, y + 7, 12, 2, '#8e7a50'); A.vl(x + 11, y + 2, 5, '#8e7a50'); A.px(x + 12, y + 3, '#6e5e3c');
    }
    return propFit(st, w, d, { solid: [0, d - 12, w, 12] });
};
SPR_L['tool box'] = (w, d) => { const st = propStage(w, d, 18, 14), { A } = st; A.r(st.x, st.y + 2, 16, 5, PAL.red[0]); A.r(st.x, st.y + 7, 16, 7, PAL.red[1]); A.r(st.x, st.y + 7, 16, 1, PAL.red[3]); A.r(st.x + 5, st.y, 6, 2, PAL.metal[2]); A.r(st.x + 7, st.y + 9, 2, 2, PAL.gold[1]); return propFit(st, w, d); };
SPR_L['tin bucket'] = (w, d) => { const st = propStage(w, d, 12, 14), { A } = st; A.poly([[st.x + 1, st.y + 3], [st.x + 10, st.y + 3], [st.x + 9, st.y + 13], [st.x + 2, st.y + 13]], PAL.metal[1]); A.ell(st.x + 5, st.y + 3, 5, 2, PAL.metal[3]); A.ell(st.x + 5, st.y + 3, 3, 1, PAL.blue[2]); A.vl(st.x + 2, st.y + 5, 8, PAL.metal[0]); return propFit(st, w, d); };
SPR_L['rope coil'] = (w, d) => { const st = propStage(w, d, 18, 12), { A } = st; A.ell(st.x + 8, st.y + 6, 8, 5, PAL.canvas[2]); A.ell(st.x + 8, st.y + 5, 6, 3, PAL.canvas[1]); A.ell(st.x + 8, st.y + 5, 3, 1, PAL.canvas[3]); return propFit(st, w, d, { flat: true }); };
SPR_L['rock pile'] = (w, d, o) => rocks(w, d, o.id, 3);
SPR_L['boulder'] = (w, d, o) => rocks(w, d, o.id, 1, 14);
// The big boulder: a limestone block the size of a car, its front face cut flat by quarrymen who
// drove a row of wedges into it and gave up. Top lit, the rough left side half lit, the right side
// in shadow; bedding lines, pits, chips at its foot, its shadow to the lower right.
SPR_L['big boulder'] = (w, d, o) => {
    const st = propStage(w, d, 76, 56), { A } = st, x = st.x + 2, y = st.y + 2, R = rng('boulder' + o.id);
    const TOP = ['#f4e6c8', '#e2cea8', '#cdb68e'], SIDE = ['#c8b08a', '#b09672'], FACE = ['#d8c49e', '#c4ae88', '#a89070'], DARK = ['#8e7658', '#735e44', '#5a4834'];
    const top = [[5, 17], [11, 9], [23, 4], [41, 3], [55, 6], [65, 12], [62, 20], [36, 23], [10, 22]];
    const left = [[5, 17], [10, 22], [13, 47], [5, 45], [1, 33], [2, 23]];
    const face = [[10, 22], [36, 23], [62, 20], [61, 46], [36, 48], [13, 47]];
    const right = [[65, 12], [71, 20], [70, 38], [67, 45], [61, 46], [62, 20]];
    const P = pts => pts.map(([a, b]) => [x + a, y + b]);
    A.poly(P(left), SIDE[1]); A.poly(P(right), DARK[0]); A.poly(P(face), FACE[1]); A.poly(P(top), TOP[1]);
    A.poly(P([[11, 10], [23, 5], [41, 4], [50, 7], [34, 11], [18, 14], [8, 18]]), TOP[0]);                         // the sunlit crown
    A.poly(P([[40, 21], [62, 19], [64, 13], [58, 16], [46, 18]]), TOP[2]);
    A.poly(P([[2, 24], [6, 18], [9, 22], [10, 34], [4, 36]]), SIDE[0]);                                               // the rough side, half lit
    for (let i = 0; i < 26; i++) {                                                                                   // pits and speckle on the natural faces
        const a = R(), px = Math.round(3 + a * 64), py = Math.round(6 + R() * 16);
        if (py < 20 - (px > 55 ? 6 : 0)) A.px(x + px, y + py, R() < 0.5 ? TOP[2] : '#b89e78');
    }
    for (let i = 0; i < 12; i++) A.px(x + 2 + Math.round(R() * 9), y + 24 + Math.round(R() * 20), DARK[0]);
    for (const by of [27, 34, 41]) A.line(x + 63, y + by - 4, x + 69, y + by - 1, DARK[1]);                        // bedding in the shadowed side
    A.line(x + 2, y + 30, x + 11, y + 32, DARK[0]); A.line(x + 3, y + 39, x + 12, y + 41, DARK[0]);
    for (let i = 0; i < 30; i++) { const fx = 15 + Math.round(R() * 42), fy = 33 + Math.round(R() * 10); A.line(x + fx, y + fy, x + fx + 2, y + fy - 2, R() < 0.5 ? FACE[0] : FACE[2]); }   // the cut face: pick marks
    A.poly(P([[48, 24], [61, 22], [60, 45], [52, 46], [55, 34]]), FACE[2]);                                           // the face turns away from the sun at its east end
    A.hl(x + 11, y + 23, 50, '#f0e0c0');                                                                             // the arris, catching the light
    for (let wx = 16; wx < 58; wx += 7) { A.r(x + wx, y + 26, 3, 5, DARK[2]); A.hl(x + wx, y + 31, 3, TOP[0]); A.px(x + wx + 2, y + 26, DARK[1]); }   // the wedge slots
    A.line(x + 37, y + 31, x + 35, y + 38, DARK[1]); A.line(x + 35, y + 38, x + 38, y + 47, DARK[1]); A.line(x + 38, y + 31, x + 36, y + 38, FACE[0]);   // the split that never ran true
    A.line(x + 30, y + 8, x + 38, y + 14, TOP[2]); A.line(x + 38, y + 14, x + 36, y + 19, TOP[2]);                   // a weathered crack on top
    A.hl(x + 13, y + 46, 48, DARK[1]); A.hl(x + 5, y + 44, 8, DARK[1]); A.hl(x + 61, y + 45, 8, DARK[2]);
    for (const [cx, cy, s] of [[8, 50, 3], [22, 51, 2], [48, 51, 3], [58, 50, 2], [67, 49, 2], [30, 52, 1]]) {        // chips the quarrymen left
        A.r(x + cx, y + cy - s + 1, s + 2, s, SIDE[0]); A.hl(x + cx, y + cy - s + 1, s + 1, TOP[0]); A.px(x + cx + s + 1, y + cy, DARK[0]);
    }
    const body = outline(st.c, DARK[2]), [c, g] = mk(body.width, body.height), B = pa(g);
    B.ell(x + 42, y + 48, 34, 5, 'rgba(64,40,24,0.22)');
    g.drawImage(body, 0, 0);
    return { c, ox: Math.round((w - c.width) / 2), oy: Math.round(d - c.height + 1), noShadow: true, solid: [w / 2 - 34, d - 18, 68, 16] };
};
// A rock: a rounded lump, lit on its upper left, a flat shadowed underside, one crack
function rockAt(A, cx, cy, r, R) {
    const ry = Math.round(r * 0.75);
    A.ell(cx, cy, r, ry, '#9a8466'); A.ell(cx - 1, cy - 1, r - 1, ry - 1, '#b8a282');
    A.ell(cx - Math.round(r * 0.25), cy - Math.round(ry * 0.3), Math.round(r * 0.6), Math.round(ry * 0.55), '#d2bc98');
    A.ell(cx - Math.round(r * 0.4), cy - Math.round(ry * 0.5), Math.max(1, Math.round(r * 0.25)), Math.max(1, Math.round(ry * 0.2)), '#ecdcbc');
    A.r(cx - r + 2, cy + ry - 2, r * 2 - 3, 2, '#7a6650');
    if (r > 7) { A.line(cx + 1, cy - 1, cx + Math.round(r * 0.45), cy + Math.round(ry * 0.6), '#8a7456'); A.line(cx + 2, cy - 1, cx + Math.round(r * 0.45) + 1, cy + Math.round(ry * 0.6), '#c8b290'); }
}
function rocks(w, d, seed, n, r0) {
    const R = rng(seed), r = r0 || 9, cw = n > 1 ? 44 : r * 2 + 4, ch = n > 1 ? 28 : Math.round(r * 1.5) + 4, st = propStage(w, d, cw, ch), { A } = st;
    if (n === 1) rockAt(A, st.x + r + 1, st.y + Math.round(r * 0.75) + 1, r, R);
    else { rockAt(A, st.x + 12, st.y + 12, 10, R); rockAt(A, st.x + 30, st.y + 16, 9, R); rockAt(A, st.x + 21, st.y + 20, 7, R); }
    return propFit(st, w, d, { solid: [w / 2 - cw / 2 + 3, d - Math.min(d, ch * 0.5), cw - 6, Math.min(d, ch * 0.5)] });
}
SPR_L['stone wall'] = SPR_L['old limestone wall'] = (w, d) => {
    const horiz = w >= d, L = horiz ? w : 14, st = stage(L, horiz ? 10 : d, 12), { A } = st, x = st.x, top = st.y - 10;
    const H = horiz ? 10 : d;
    A.r(x, top, L, H, PAL.rock[0]); for (let i = 0; i < L; i += 9) for (let j = (i / 9 & 1) * 4; j < H; j += 8) A.r(x + i, top + j, 8, 7, PAL.rock[1]);
    A.r(x, top + H, L, 12, PAL.rock[2]); for (let i = 0; i < L; i += 10) A.vl(x + i + ((top & 1) * 5), top + H, 12, PAL.rock[3]);
    A.hl(x, top + H + 6, L, PAL.rock[3]);
    return fit(st);
};
// A spoil heap: a real pile of dug earth. Its surface is a height field (a dome, a few lumps, a
// little grit), drawn back to front a pixel at a time and shaded by its slope, lit from the upper
// left in four flat tones, with pebbles, an outline and a soft shadow at its foot. Each heap in
// the dig zone has its own size; Trench B's (ow_spoil) is fresher, the earth still dark.
const SPOIL_SIZE = { fl_spoil: [1, 1], ow_spoil: [0.86, 1.15, true], d_spoil2: [0.74, 0.9], d_spoil3: [0.6, 0.85] };
SPR_L['spoil mound'] = SPR.ow_spoil = (w, d, o) => {
    const [k, hk, fresh] = SPOIL_SIZE[o.id] || [0.9, 1], R = rng(o.id);
    const rx = Math.max(10, Math.round(w / 2 * k) - 2), ry = Math.max(6, Math.round(d / 2 * k) - 1), H = Math.round(Math.min(rx, 34) * 0.62 * hk);
    const UP = Math.round(H * 1.5) + 8, st = stage(w, d + 6, UP), { A } = st, cx = st.x + (w >> 1), cy = st.y + (d >> 1) + 2;   // (room above for the lumps)
    const P = fresh ? ['#d4b274', '#b89456', '#98763e', '#74562c', '#523a1c'] : [PAL.sand[1], PAL.sand[2], PAL.sand[3], PAL.sand[4], PAL.rock[4]];
    const lumps = [0, 1, 2].map(() => ({ x: cx + (R() - 0.5) * rx, y: cy + (R() - 0.5) * ry * 0.8, r: rx * (0.35 + R() * 0.25), h: H * (0.14 + R() * 0.18) }));
    const z = (x, y) => {
        const e = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2; if (e >= 1) return -1;
        let v = H * Math.pow(1 - e, 1.25);                       // a soft skirt, not a wall
        for (const L of lumps) { const le = ((x - L.x) / L.r) ** 2 + ((y - L.y) / (L.r * ry / rx)) ** 2; if (le < 1) v += L.h * (1 - le) ** 2; }
        return v + hash2(x * 3 + 7, y * 5 + 1) * 0.35 * (1 - e);
    };
    let top = null;
    for (let gy = cy - ry; gy <= cy + ry; gy++) for (let gx = cx - rx; gx <= cx + rx; gx++) {
        const zz = z(gx, gy); if (zz < 0) continue;
        const sx = z(gx + 1, gy) - z(gx - 1, gy), sy = z(gx, gy + 1) - z(gx, gy - 1), lit = sx * 0.9 + sy * 0.35;   // (faces toward the sun, upper left, are lit)
        const col = lit > 0.9 ? P[0] : lit > 0.1 ? P[1] : lit > -0.8 ? P[2] : P[3];
        const py = Math.round(gy - zz);
        A.r(gx, py, 1, 3, col);                                     // (a short column, so no gaps open on the steep front)
        if (!top || py < top[1]) top = [gx, py];
    }
    for (let i = 0; i < 22; i++) {                                  // stones and grit on the surface
        const a = R() * Math.PI * 2, rr = Math.sqrt(R()) * 0.85, gx = Math.round(cx + Math.cos(a) * rx * rr), gy = Math.round(cy + Math.sin(a) * ry * rr), zz = z(gx, gy);
        if (zz < 0) continue;
        const py = Math.round(gy - zz);
        A.px(gx, py, i % 3 ? PAL.rock[2] : PAL.rock[3]); if (i % 4 === 0) { A.px(gx + 1, py, PAL.rock[3]); A.px(gx, py - 1, PAL.rock[1]); }
    }
    const body = outline(st.c, P[4]), [c, g] = mk(body.width, body.height), B = pa(g);
    B.ell(cx + 4, cy + 2, rx + 1, ry, 'rgba(64,40,24,0.2)');         // its shadow, under it and to the lower right
    g.drawImage(body, 0, 0);
    // (only where it's drawn is solid; top: where a stake would stand, from the entity's corner)
    return Object.assign({ ox: -(st.c.width - st.w) / 2, oy: -(st.up + 1) }, { c, noShadow: true, solid: [(w >> 1) - rx + 4, (d >> 1) + 2 - ry + 2, rx * 2 - 8, ry * 2 - 3], top: top && [top[0] - 1, top[1] - UP - 1] });
};
SPR_L['survey stake'] = SPR_L["sam's survey stake"] = (w, d) => { const st = propStage(w, d, 8, 18), { A } = st; A.r(st.x + 2, st.y + 3, 2, 14, PAL.plank[0]); A.r(st.x + 2, st.y, 2, 5, PAL.red[1]); A.r(st.x + 4, st.y + 1, 3, 3, PAL.red[0]); return propFit(st, w, d); };
// A lamp on a post: a stone foot, a post lit on one side, a lantern with glass that glows
function lampPost(w, d, tall, col) {
    const h = tall ? 34 : 24, st = propStage(w, d, 14, h + 2), { A } = st, cx = st.x + 5;
    A.r(cx - 2, st.y + h - 3, 7, 3, '#a8927a'); A.hl(cx - 2, st.y + h - 3, 7, '#d4c0a0');
    A.r(cx, st.y + 8, 3, h - 10, '#6e4424'); A.vl(cx, st.y + 8, h - 10, '#a8703c');
    A.r(cx - 3, st.y, 9, 2, '#3a3e48'); A.px(cx + 1, st.y - 1, '#3a3e48');
    A.r(cx - 2, st.y + 2, 7, 6, '#ffe890'); A.r(cx - 2, st.y + 2, 2, 6, '#fff8d8'); A.r(cx + 3, st.y + 2, 2, 6, '#f0c040');
    A.r(cx - 3, st.y + 8, 9, 1, '#3a3e48'); A.vl(cx - 3, st.y + 2, 6, '#3a3e48'); A.vl(cx + 5, st.y + 2, 6, '#3a3e48');
    return propFit(st, w, d, { light: { x: 0, y: -h + 6, r: tall ? 70 : 52, c: col || '#ffd890' } });
}
SPR_L['path lamp'] = (w, d) => lampPost(w, d, false);
SPR_L['lantern'] = (w, d) => lampPost(w, d, false);
SPR_L['work lamp'] = (w, d) => {                                   // a floodlight on a tripod
    const st = propStage(w, d, 18, 34), { A } = st, cx = st.x + 8;
    A.line(cx, st.y + 10, cx - 6, st.y + 32, PAL.metal[3]); A.line(cx, st.y + 10, cx + 6, st.y + 32, PAL.metal[3]); A.r(cx, st.y + 10, 1, 20, PAL.metal[2]);
    A.r(cx - 6, st.y + 1, 13, 9, PAL.gold[2]); A.r(cx - 4, st.y + 3, 9, 5, PAL.white[0]); A.r(cx - 6, st.y, 13, 1, PAL.dark[1]);
    return propFit(st, w, d, { light: { x: 0, y: -26, r: 96, c: '#fff0d0' } });
};
SPR_L['radio antenna'] = (w, d) => { const st = propStage(w, d, 16, 50), { A } = st, cx = st.x + 7; A.r(cx, st.y, 1, 48, PAL.metal[2]); for (let j = 6; j < 40; j += 8) A.hl(cx - 4 + (j >> 3), st.y + j, 9 - (j >> 2), PAL.metal[1]); A.line(cx, st.y + 12, cx - 6, st.y + 48, PAL.metal[3]); A.line(cx, st.y + 12, cx + 7, st.y + 48, PAL.metal[3]); A.px(cx, st.y, PAL.red[1]); return propFit(st, w, d); };
SPR_L['road closed'] = (w, d) => { const st = propStage(w, d, 30, 22), { A } = st; A.r(st.x + 2, st.y + 8, 2, 13, PAL.wood[2]); A.r(st.x + 24, st.y + 8, 2, 13, PAL.wood[2]); A.r(st.x, st.y + 2, 28, 8, PAL.white[0]); for (let i = 0; i < 28; i += 8) A.poly([[st.x + i, st.y + 10], [st.x + i + 4, st.y + 10], [st.x + i + 8, st.y + 2], [st.x + i + 4, st.y + 2]], PAL.red[1]); return propFit(st, w, d, { solid: [w / 2 - 14, d - 6, 28, 6] }); };
SPR_L['camp gate post'] = (w, d) => { const st = propStage(w, d, 12, 40), { A } = st; A.r(st.x + 2, st.y + 2, 6, 37, PAL.wood[1]); A.r(st.x + 2, st.y + 2, 2, 37, PAL.wood[0]); A.r(st.x + 1, st.y, 8, 3, PAL.wood[2]); A.r(st.x + 2, st.y + 10, 6, 2, PAL.metal[3]); return propFit(st, w, d); };
// The scaffold tower by the trench: steel tubes and couplers, two bays and two lifts, cross-braced,
// plank decks with toe boards, a ladder up through them, a shade cloth on top, and a gin wheel on a
// pole to haul buckets up out of the trench. Base plates on sole boards, a sandbag on each.
SPR_L['scaffolding'] = SPR.d_scaff = (w, d) => {
    const L = 62, H = 64, st = stage(w, d, H + 14, 16), { A } = st, x = st.x + ((w - L) >> 1) - 4, gy = st.y + d - 6, back = 14;
    const T = ['#dfe6ea', '#9aa4ae', '#6a7480', '#3e4650'], CPL = '#2a2e36';
    const tube = (x0, y0, x1, y1) => { A.line(x0, y0, x1, y1, T[2]); A.line(x0 - (y1 !== y0 ? 1 : 0), y0 - (y1 === y0 ? 1 : 0), x1 - (y1 !== y0 ? 1 : 0), y1 - (y1 === y0 ? 1 : 0), T[0]); };
    const lifts = [gy - 30, gy - 58], cols = [0, 30, 60];
    // the back frame first (up and to the right: depth)
    for (const c of cols) tube(x + c + 4, gy - back, x + c + 4, gy - back - H + 6);
    for (const ly of lifts) tube(x + 4, ly - back, x + 64, ly - back);
    for (const c of cols) for (const ly of lifts) tube(x + c, ly, x + c + 4, ly - back);                                                                                              // transoms
    // the decks: planks, toe boards
    for (const ly of lifts) {
        A.poly([[x, ly], [x + 60, ly], [x + 64, ly - back], [x + 4, ly - back]], '#c89a5c');
        for (let i = 3; i < back; i += 4) A.line(x + i * 4 / back * 1, ly - i, x + 60 + i * 4 / back, ly - i, '#9a6c3c');
        A.hl(x + 4, ly - back, 60, '#e8c080'); A.r(x, ly, 61, 4, '#a8783c'); A.hl(x, ly, 61, '#d8a868'); A.hl(x, ly + 3, 61, '#6e4a24');
    }
    // the ladder, up through the decks
    const lx = x + 38;
    for (const r of [lx, lx + 9]) A.r(r, lifts[1] - 8, 2, gy - lifts[1] + 7, WOOD[1]);
    for (let j = lifts[1] - 4; j < gy; j += 5) A.r(lx + 2, j, 7, 1, WOOD[0]);
    // the front standards and ledgers, braces, couplers
    for (const c of cols) { A.r(x + c - 1, gy - H, 3, H + 1, T[1]); A.vl(x + c - 1, gy - H, H + 1, T[0]); A.vl(x + c + 1, gy - H, H + 1, T[3]); }
    for (const ly of lifts.concat([gy - 16, gy - 44])) { A.r(x - 1, ly - 1, 63, 2, T[1]); A.hl(x - 1, ly - 1, 63, T[0]); }
    A.line(x + 1, gy - 2, x + 29, lifts[0] + 2, T[2]); A.line(x + 31, lifts[0] - 2, x + 59, lifts[1] + 2, T[2]); A.line(x + 2, gy - 2, x + 30, lifts[0] + 2, T[0]); A.line(x + 32, lifts[0] - 2, x + 60, lifts[1] + 2, T[0]);
    for (const c of cols) for (const ly of lifts.concat([gy - 16, gy - 44])) { A.r(x + c - 2, ly - 2, 4, 4, CPL); A.px(x + c - 1, ly - 2, T[1]); }
    // guard rail on top, the shade cloth, hazard tape
    A.r(x - 1, lifts[1] - 12, 63, 2, T[1]); A.hl(x - 1, lifts[1] - 12, 63, T[0]);
    A.poly([[x - 2, lifts[1] - 20], [x + 62, lifts[1] - 20], [x + 66, lifts[1] - 20 - back], [x + 2, lifts[1] - 20 - back]], '#2f8a5a'); A.hl(x - 2, lifts[1] - 20, 64, '#1f6a40');
    for (let i = 0; i < 64; i += 6) A.poly([[x - 2 + i, lifts[1] - 20], [x + 4 + i, lifts[1] - 20], [x + 1 + i, lifts[1] - 16]], '#1f6a40');
    for (let i = 0; i < 60; i += 6) { A.r(x + i, lifts[0] - 10, 3, 2, '#d04838'); A.r(x + i + 3, lifts[0] - 10, 3, 2, '#ffffff'); }
    // the gin wheel on its pole, a rope, a bucket halfway up
    const gx = x + 62;
    A.line(x + 60, lifts[1] - 8, gx + 10, lifts[1] - 18, T[1]); A.ell(gx + 10, lifts[1] - 16, 3, 3, T[3]); A.px(gx + 10, lifts[1] - 16, T[0]);
    A.vl(gx + 12, lifts[1] - 16, 38, '#c8b888'); A.r(gx + 8, lifts[1] + 22, 8, 7, '#9aa4ae'); A.hl(gx + 8, lifts[1] + 22, 8, '#dfe6ea'); A.ell(gx + 12, lifts[1] + 22, 4, 1, '#5a6272');
    // base plates on sole boards, sandbags
    for (const c of cols) { A.r(x + c - 5, gy, 11, 3, WOOD[1]); A.hl(x + c - 5, gy, 11, WOOD[0]); A.r(x + c - 2, gy - 1, 5, 2, T[3]); }
    for (const c of [0, 60]) { A.ell(x + c + 4, gy - 1, 5, 3, '#c9b48e'); A.hl(x + c + 1, gy + 1, 7, '#8a7658'); }
    A.r(x + 12, gy - 6, 10, 6, '#58a848'); A.hl(x + 12, gy - 6, 10, '#8cd060'); A.ell(x + 17, gy - 6, 5, 2, '#c89a5c');                                                                // a bucket of spoil at its foot
    return fit(st, { solid: [4, d - 12, w - 8, 10] });
};
SPR_L['cooking table'] = SPR_L['equipment table'] = (w, d) => {   // a long trestle table, things on it
    const L = Math.max(30, w), st = stage(L, 14, 12), { A } = st, x = st.x, top = st.y - 8;
    A.r(x, top, L, 11, '#e0b478'); for (let i = 0; i < L; i += 16) { A.vl(x + i, top, 11, '#c89a5c'); A.vl(x + i + 1, top, 11, '#f0cc90'); } A.hl(x, top, L, '#fff0d0');   // the top, planked
    A.r(x, top + 11, L, 4, '#a8783c'); A.hl(x, top + 14, L, '#6e4a24');                                                                    // the apron
    for (const lx of [x + 3, x + L - 6]) { A.r(lx, top + 15, 3, 8, '#8e5e32'); A.vl(lx, top + 15, 8, '#b8844c'); }
    const R = rng('tbl' + w);
    for (let i = 8; i < L - 12; i += 17) {
        const k = R(), bx = x + i;
        if (k < 0.3) { A.ell(bx + 4, top + 5, 5, 2, '#9aa4ae'); A.ell(bx + 4, top + 4, 4, 1, '#e6ecf0'); A.px(bx + 2, top + 4, '#ffffff'); }                       // a metal bowl
        else if (k < 0.55) { A.ell(bx + 4, top + 5, 5, 3, '#c89058'); A.ell(bx + 3, top + 4, 3, 1, '#e8b878'); }                                              // bread
        else if (k < 0.8) { A.r(bx + 1, top + 2, 3, 5, '#ffffff'); A.r(bx + 5, top + 3, 3, 4, '#ffffff'); A.px(bx + 2, top + 5, '#c84830'); A.px(bx + 6, top + 5, '#c84830'); }   // tea glasses
        else { A.ell(bx + 4, top + 4, 4, 3, '#58a848'); A.ell(bx + 3, top + 3, 2, 1, '#8cd060'); A.ell(bx + 9, top + 5, 2, 2, '#d04838'); }                  // greens, a tomato
    }
    return Object.assign(fit(st), { oy: Math.round(d - st.c.height + 1), footShadow: true });
};
SPR.fl_cooking = () => null;                                       // (same spot as the long cooking table)
SPR.generator = (w, d) => {                     // a diesel generator on a skid: top, front panel, vents, exhaust
    const st = propStage(w, d, 36, 28), { A } = st, x = st.x, y = st.y + 4;
    A.r(x, y, 32, 8, '#ffd868'); A.hl(x, y, 32, '#fff4b0'); A.r(x + 4, y + 2, 10, 4, '#e8b030');                                             // the top, a hatch
    A.poly([[x + 32, y], [x + 35, y + 3], [x + 35, y + 20], [x + 32, y + 18]], '#a87818');
    A.r(x, y + 8, 32, 12, '#e8b030'); A.hl(x, y + 8, 32, '#ffd868');
    for (let i = 3; i < 17; i += 3) { A.vl(x + i, y + 10, 8, '#8a6010'); A.vl(x + i + 1, y + 10, 8, '#ffd868'); }                            // vents
    A.r(x + 20, y + 10, 9, 6, '#3a3e48'); A.r(x + 21, y + 11, 3, 2, '#58c070'); A.r(x + 25, y + 11, 3, 2, '#d04838');                        // the panel, its lights
    A.r(x + 26, y - 5, 3, 6, '#3a3e48'); A.hl(x + 26, y - 5, 3, '#5a6272');                                                                    // exhaust
    A.r(x - 1, y + 20, 34, 3, '#5a5048'); A.hl(x - 1, y + 20, 34, '#8a8078');                                                                  // the skid
    return propFit(st, w, d, { solid: [w / 2 - 16, d - 14, 32, 14] });
};
SPR.satphone = (w, d) => { const st = propStage(w, d, 22, 26), { A } = st; A.ell(st.x + 10, st.y + 8, 9, 7, PAL.white[1]); A.ell(st.x + 9, st.y + 7, 6, 4, PAL.white[0]); A.line(st.x + 10, st.y + 8, st.x + 16, st.y + 2, PAL.metal[3]); A.r(st.x + 9, st.y + 14, 2, 8, PAL.metal[2]); A.r(st.x + 4, st.y + 22, 12, 3, PAL.dark[1]); return propFit(st, w, d); };
SPR.sams_gear = (w, d) => { const st = propStage(w, d, 30, 18), { A } = st; A.ell(st.x + 14, st.y + 12, 14, 5, PAL.sand[3]); A.r(st.x + 6, st.y + 4, 12, 9, PAL.olive[1]); A.r(st.x + 6, st.y + 4, 12, 2, PAL.olive[0]); A.r(st.x + 18, st.y + 7, 8, 2, PAL.wood[1]); A.ell(st.x + 12, st.y + 14, 12, 3, PAL.sand[1]); return propFit(st, w, d); };
// the brazier: a fire basket on legs, the tea kettle beside it — animated
SPR.rest_brazier = (w, d) => {
    const frames = [0, 1, 2].map(f => {
        const st = propStage(w, d, 30, 36), { A } = st, cx = st.x + 14;
        A.line(cx - 7, st.y + 22, cx - 10, st.y + 34, PAL.dark[2]); A.line(cx + 7, st.y + 22, cx + 10, st.y + 34, PAL.dark[2]); A.r(cx, st.y + 24, 1, 10, PAL.dark[2]);
        A.poly([[cx - 10, st.y + 16], [cx + 10, st.y + 16], [cx + 7, st.y + 24], [cx - 7, st.y + 24]], PAL.dark[1]);
        for (let i = -8; i <= 8; i += 3) A.vl(cx + i, st.y + 17, 6, PAL.dark[3]);
        A.r(cx - 9, st.y + 15, 19, 2, PAL.fire[3]); A.dith(cx - 8, st.y + 14, 17, 2, PAL.fire[1], f);
        const hgt = [11, 14, 12][f], lean = [-1, 1, 0][f];
        A.poly([[cx - 7, st.y + 16], [cx + 7, st.y + 16], [cx + 3 + lean, st.y + 16 - hgt + 3], [cx + lean, st.y + 16 - hgt], [cx - 3 + lean, st.y + 16 - hgt + 4]], PAL.fire[2]);
        A.poly([[cx - 4, st.y + 16], [cx + 4, st.y + 16], [cx + 1 - lean, st.y + 16 - hgt + 5], [cx - 2 - lean, st.y + 16 - hgt + 7]], PAL.fire[1]);
        A.poly([[cx - 2, st.y + 16], [cx + 2, st.y + 16], [cx, st.y + 10 + f]], PAL.fire[0]);
        A.px(cx + [4, -5, 2][f], st.y + [2, 4, 1][f], PAL.fire[1]); A.px(cx + [-3, 6, -6][f], st.y + [6, 1, 5][f], PAL.fire[2]);
        return outline(st.c);
    });
    return { c: frames[0], frames, fps: 7, ox: Math.round((w - frames[0].width) / 2), oy: Math.round(d - frames[0].height + 1), solid: [w / 2 - 10, d - 8, 20, 8], light: { x: 0, y: -18, r: 110, c: '#ffb050', flicker: true } };
};
SPR.ow_tea = (w, d) => { const st = propStage(w, d, 18, 16), { A } = st; A.ell(st.x + 8, st.y + 9, 6, 5, PAL.metal[1]); A.ell(st.x + 7, st.y + 7, 4, 2, PAL.metal[0]); A.r(st.x + 6, st.y + 2, 4, 3, PAL.metal[2]); A.line(st.x + 13, st.y + 8, st.x + 16, st.y + 4, PAL.metal[2]); A.ell(st.x + 8, st.y + 4, 3, 1, PAL.dark[1]); A.r(st.x + 1, st.y + 12, 4, 3, PAL.white[0]); return propFit(st, w, d); };
SPR.camp_darts = (w, d) => { const st = propStage(w, d, 22, 40), { A } = st, cx = st.x + 10; A.r(cx - 1, st.y + 18, 3, 21, PAL.wood[2]); A.r(cx - 10, st.y, 21, 20, PAL.wood[1]); for (let i = 0; i < 21; i += 5) A.vl(cx - 10 + i, st.y, 20, PAL.wood[2]); A.ell(cx, st.y + 10, 8, 8, PAL.dark[3]); A.ell(cx, st.y + 10, 6, 6, PAL.white[0]); A.ell(cx, st.y + 10, 4, 4, PAL.green[1]); A.ell(cx, st.y + 10, 2, 2, PAL.red[1]); A.px(cx, st.y + 10, PAL.gold[0]); for (let a = 0; a < 8; a++) A.px(cx + Math.round(Math.cos(a * 0.785) * 7), st.y + 10 + Math.round(Math.sin(a * 0.785) * 7), PAL.white[0]); return propFit(st, w, d); };
function radioOn(w, d, withThermos) { const st = propStage(w, d, 22, 26), { A } = st; crateAt(A, st.x + 1, st.y + 9, 16, 0); A.r(st.x + 3, st.y + 3, 12, 8, PAL.dark[2]); A.r(st.x + 4, st.y + 5, 5, 4, PAL.dark[0]); A.r(st.x + 10, st.y + 5, 4, 2, PAL.gold[1]); A.r(st.x + 4, st.y + 1, 10, 2, PAL.metal[2]); A.line(st.x + 14, st.y + 3, st.x + 19, st.y - 0, PAL.metal[1]); if (withThermos) { A.r(st.x + 17, st.y + 6, 3, 7, PAL.metal[1]); A.r(st.x + 17, st.y + 6, 3, 2, PAL.red[1]); } return propFit(st, w, d, { solid: [w / 2 - 9, d - 8, 18, 8] }); }
SPR.camp_radio = (w, d) => radioOn(w, d);
SPR.c1m_farouk_radio = (w, d) => radioOn(w, d, true);
SPR.ow_sieve = (w, d) => { const st = propStage(w, d, 30, 24), { A } = st; A.line(st.x + 2, st.y + 8, st.x, st.y + 22, PAL.wood[2]); A.line(st.x + 26, st.y + 8, st.x + 28, st.y + 22, PAL.wood[2]); A.r(st.x + 2, st.y + 4, 25, 8, PAL.plank[1]); A.r(st.x + 4, st.y + 5, 21, 6, PAL.metal[3]); A.dith(st.x + 4, st.y + 5, 21, 6, PAL.sand[2], 0); A.ell(st.x + 14, st.y + 20, 8, 3, PAL.sand[3]); return propFit(st, w, d, { solid: [w / 2 - 12, d - 8, 24, 8] }); };
SPR.ow_detector = (w, d) => { const st = propStage(w, d, 16, 26), { A } = st; A.line(st.x + 11, st.y + 1, st.x + 5, st.y + 20, PAL.metal[2]); A.ell(st.x + 5, st.y + 22, 5, 2, PAL.dark[2]); A.r(st.x + 9, st.y + 2, 5, 4, PAL.gold[1]); return propFit(st, w, d); };
SPR.ow_well = (w, d) => {                         // the old well: a stone drum, a wooden frame, a bucket on its rope
    const st = propStage(w, d, 40, 44), { A } = st, cx = st.x + 19, ry = st.y + 26;
    A.r(st.x + 3, st.y + 4, 3, 30, '#8e5e32'); A.vl(st.x + 3, st.y + 4, 30, '#b8844c'); A.r(st.x + 33, st.y + 4, 3, 30, '#8e5e32'); A.vl(st.x + 33, st.y + 4, 30, '#b8844c');
    A.r(st.x + 1, st.y + 2, 37, 4, '#b8844c'); A.hl(st.x + 1, st.y + 2, 37, '#e0b478'); A.hl(st.x + 1, st.y + 5, 37, '#6e4424');
    A.vl(cx, st.y + 6, 10, '#c8b888'); A.r(cx - 3, st.y + 15, 7, 6, '#9aa4ae'); A.hl(cx - 3, st.y + 15, 7, '#dfe6ea'); A.vl(cx + 3, st.y + 15, 6, '#6a7480');
    A.r(cx - 15, ry, 31, 12, '#b8a282'); for (let i = -15; i < 16; i += 7) A.vl(cx + i + ((i / 7) & 1) * 3, ry, 12, '#8a7456'); A.hl(cx - 15, ry + 6, 31, '#8a7456');   // the stone drum
    A.r(cx - 15, ry, 4, 12, '#d2bc98'); A.r(cx + 12, ry, 4, 12, '#7a6650');
    A.ell(cx, ry, 16, 6, '#d2bc98'); A.ell(cx, ry, 12, 4, '#3a2c20'); A.ell(cx, ry + 1, 8, 2, '#3a7cc4'); A.px(cx - 3, ry, '#9ed2f4');       // the rim, the water far down
    A.hl(cx - 15, ry + 11, 31, '#6e5a44');
    return propFit(st, w, d, { solid: [w / 2 - 16, d - 16, 32, 14] });
};
// Water jars (a zeer): two big unglazed clay jars on a wooden stand, sweating, a tin cup on a nail,
// a dark damp patch in the sand beneath. `sabil` is the stone-niched one by the sheikh's tomb.
function zeer(w, d, sabil) {
    const st = propStage(w, d, 34, 36), { A } = st, x = st.x, y = st.y;
    A.ell(x + 16, y + 32, 14, 3, '#c8a868');                                                                  // the wet sand
    if (sabil) { A.r(x + 1, y, 31, 30, '#d8c8a4'); A.r(x + 1, y, 31, 3, '#f0e4c8'); A.r(x + 4, y + 5, 25, 25, '#8a7456'); A.ell(x + 16, y + 6, 12, 5, '#8a7456'); A.r(x + 5, y + 8, 23, 20, '#6e5a44'); }
    else { A.r(x + 3, y + 10, 2, 21, '#8e5e32'); A.r(x + 28, y + 10, 2, 21, '#8e5e32'); A.vl(x + 3, y + 10, 21, '#b8844c'); A.r(x + 1, y + 12, 31, 3, '#b8844c'); A.hl(x + 1, y + 12, 31, '#e0b478'); A.hl(x + 1, y + 14, 31, '#6e4424'); }
    for (const jx of [x + 10, x + 23]) {                                                                      // the jars: round-bellied, lit on the left, dark where they sweat
        A.ell(jx, y + 17, 7, 9, '#b8683c'); A.ell(jx - 2, y + 15, 4, 6, '#d88a54'); A.ell(jx - 3, y + 13, 1, 3, '#f0b07c');
        A.ell(jx + 2, y + 21, 4, 4, '#984e2c'); A.px(jx + 3, y + 23, '#6e3a20'); A.px(jx + 1, y + 25, '#7a9ab4');
        A.r(jx - 3, y + 7, 7, 2, '#c87a48'); A.hl(jx - 3, y + 7, 7, '#e8a070'); A.ell(jx, y + 7, 3, 1, '#3a2418');
    }
    if (sabil) { A.r(x + 1, y + 24, 31, 7, '#c4b08a'); A.hl(x + 1, y + 24, 31, '#f0e4c8'); A.hl(x + 1, y + 30, 31, '#8a7456'); for (let i = 6; i < 30; i += 8) A.vl(x + i, y + 25, 5, '#a8926c'); }
    else { A.r(x + 1, y + 19, 31, 3, '#b8844c'); A.hl(x + 1, y + 19, 31, '#e0b478'); A.hl(x + 1, y + 21, 31, '#6e4424'); }        // the front rail holds them
    A.r(x + 15, y + 23, 3, 3, '#9aa4ae'); A.hl(x + 15, y + 23, 3, '#dfe6ea'); A.vl(x + 16, y + 21, 2, '#6a7480');   // the tin cup on its string
    return propFit(st, w, d, { solid: [w / 2 - 14, d - 10, 28, 10] });
}
SPR_L['water jars'] = (w, d) => zeer(w, d);
SPR_L['sabil'] = (w, d) => zeer(w, d, true);
SPR_L['date palm'] = (w, d, o) => Object.assign(palm(o.id, true), { anchor: true });
SPR.c1w_well2 = (w, d) => SPR.ow_well(w, d);
SPR.ow_lookout = (w, d) => { const st = propStage(w, d, 22, 28), { A } = st, R = rng('cairn'); for (let j = 0; j < 5; j++) { const ww = 18 - j * 3; A.ell(st.x + 10, st.y + 24 - j * 5, ww >> 1, 3, PAL.rock[j & 1 ? 1 : 2]); A.ell(st.x + 9, st.y + 23 - j * 5, (ww >> 1) - 2, 1, PAL.rock[0]); } return propFit(st, w, d, { solid: [w / 2 - 9, d - 8, 18, 8] }); };
SPR.ow_bones = (w, d) => { const st = propStage(w, d, 40, 20), { A } = st; for (let i = 0; i < 6; i++) { A.line(st.x + 8 + i * 4, st.y + 14, st.x + 9 + i * 4, st.y + 5, PAL.white[1]); A.line(st.x + 9 + i * 4, st.y + 5, st.x + 12 + i * 4, st.y + 4, PAL.white[1]); } A.r(st.x + 6, st.y + 14, 26, 2, PAL.white[0]); A.ell(st.x + 35, st.y + 11, 4, 3, PAL.white[0]); A.px(st.x + 36, st.y + 10, PAL.dark[3]); return propFit(st, w, d, { flat: true }); };
SPR.ow_oasis = () => null;                                           // the pool is painted into the ground; its palms are trees
SPR.ow_ruin_note = (w, d) => { const st = propStage(w, d, 36, 14), { A } = st; A.r(st.x, st.y + 3, 34, 6, PAL.rock[0]); A.r(st.x, st.y + 9, 34, 4, PAL.rock[2]); for (let i = 3; i < 32; i += 5) A.r(st.x + i, st.y + 5, 2, 2, PAL.rock[3]); A.line(st.x + 20, st.y + 3, st.x + 23, st.y + 12, PAL.rock[3]); return propFit(st, w, d, { solid: [w / 2 - 16, d - 6, 32, 6] }); };
SPR.c1p_falsedoor = (w, d) => { const st = propStage(w, d, 28, 34), { A } = st; A.r(st.x, st.y, 26, 32, PAL.rock[1]); A.r(st.x, st.y, 26, 3, PAL.rock[0]); A.r(st.x + 4, st.y + 6, 18, 26, PAL.rock[2]); A.r(st.x + 8, st.y + 10, 10, 22, PAL.rock[3]); A.r(st.x + 11, st.y + 14, 4, 18, PAL.dark[3]); for (let j = 8; j < 30; j += 4) { A.px(st.x + 5, st.y + j, PAL.rock[3]); A.px(st.x + 20, st.y + j, PAL.rock[3]); } return propFit(st, w, d, { solid: [w / 2 - 13, d - 6, 26, 6] }); };
SPR.c1p_looterpit = (w, d) => { const st = propStage(w, d, 40, 26), { A } = st; A.ell(st.x + 19, st.y + 13, 19, 11, PAL.sand[3]); A.ell(st.x + 19, st.y + 13, 13, 7, PAL.dirt[2]); A.ell(st.x + 19, st.y + 15, 9, 4, PAL.dirt[3]); A.line(st.x + 30, st.y + 4, st.x + 36, st.y + 16, PAL.wood[1]); return Object.assign(propFit(st, w, d, { flat: true }), { c: st.c }); };
SPR.c1a_mason = (w, d) => { const st = propStage(w, d, 30, 22), { A } = st; A.r(st.x, st.y, 28, 12, PAL.rock[0]); A.r(st.x, st.y + 12, 28, 9, PAL.rock[2]); for (const [mx, my] of [[5, 14], [11, 15], [17, 14], [22, 16]]) { A.r(st.x + mx, st.y + my, 3, 1, PAL.red[2]); A.r(st.x + mx + 1, st.y + my - 1, 1, 4, PAL.red[2]); } return propFit(st, w, d, { solid: [w / 2 - 14, d - 8, 28, 8] }); };
// The fossil pavement: a low shelf of bedrock the sand has blown off, a ragged edge, split by joints
// into slabs, and in it the sea that was here: nummulites like spilled coins, two ammonites, an urchin.
function vnoise(x, y, s, k) {                                      // smooth value noise, 0..1
    const fx = x / s, fy = y / s, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy, e = t => t * t * (3 - 2 * t);
    const h = (i, j) => hash2(i * 7 + k, j * 11 + k * 3);
    return (h(ix, iy) * (1 - e(tx)) + h(ix + 1, iy) * e(tx)) * (1 - e(ty)) + (h(ix, iy + 1) * (1 - e(tx)) + h(ix + 1, iy + 1) * e(tx)) * e(ty);
}
SPR.c1p_pavement = (w, d) => {
    const M = 10, UP = 42, cw = w + M * 2, ch = d + UP + M, R = rng('pave2');
    const [c0, g0] = mk(cw + 2, ch + 6), A = pa(g0), X = M + 1, Y = UP + 1;
    const S = ['#eee2c6', '#e2d4b4', '#d6c6a2'], CRACK = '#a08a68', SHADE = '#c4b08a', HI = '#faf2dc';
    // the stone tiles under it (5×3, and 3 tiles over the top row); the rock's edge wanders in and out
    // of them by noise, and where it pulls back the tiles are covered with sand
    const U = new Uint8Array(cw * ch);
    for (const [rx, ry, rw, rh] of [[0, 0, w, d], [32, -32, 96, 32]]) for (let j = ry; j < ry + rh; j++) for (let i = rx; i < rx + rw; i++) U[(j + UP) * cw + i + M] = 1;
    const D = new Float32Array(cw * ch);                                                    // signed distance to the tiles' edge (a chamfer pass each way)
    for (const inside of [1, 0]) {
        const F = new Float32Array(cw * ch).fill(1e6);
        for (let k = 0; k < cw * ch; k++) if (U[k] !== inside) F[k] = 0;
        for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { const k = j * cw + i; if (i) F[k] = Math.min(F[k], F[k - 1] + 1); if (j) F[k] = Math.min(F[k], F[k - cw] + 1); if (i && j) F[k] = Math.min(F[k], F[k - cw - 1] + 1.41); if (j && i < cw - 1) F[k] = Math.min(F[k], F[k - cw + 1] + 1.41); }
        for (let j = ch - 1; j >= 0; j--) for (let i = cw - 1; i >= 0; i--) { const k = j * cw + i; if (i < cw - 1) F[k] = Math.min(F[k], F[k + 1] + 1); if (j < ch - 1) F[k] = Math.min(F[k], F[k + cw] + 1); if (i < cw - 1 && j < ch - 1) F[k] = Math.min(F[k], F[k + cw + 1] + 1.41); if (j < ch - 1 && i) F[k] = Math.min(F[k], F[k + cw - 1] + 1.41); }
        for (let k = 0; k < cw * ch; k++) if (U[k] === inside) D[k] = inside ? -F[k] : F[k];
    }
    const seeds = []; for (let i = 0; i < 16; i++) seeds.push([R() * w, -30 + R() * (d + 30), i % 3]);
    const cell = (x, y) => { let a = 1e9, b = 1e9, k = 0; for (let i = 0; i < seeds.length; i++) { const q = Math.hypot((x - seeds[i][0]) * 0.8, y - seeds[i][1]); if (q < a) { b = a; a = q; k = i; } else if (q < b) b = q; } return [k, b - a]; };
    const IN = new Uint8Array(cw * ch), K = new Int16Array(cw * ch).fill(-1);
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
        const x = i - M, y = j - UP, k0 = j * cw + i;
        if (!(D[k0] < -2 + (vnoise(x, y, 13, 3) - 0.5) * 34 + (vnoise(x, y, 4, 8) - 0.5) * 5)) continue;
        IN[k0] = 1; const [k, gap] = cell(x, y); K[k0] = gap < 1.3 ? -2 : k;
    }
    const at = (i, j) => (i < 0 || j < 0 || i >= cw || j >= ch) ? 0 : IN[j * cw + i], kk = (i, j) => (i < 0 || j < 0 || i >= cw || j >= ch) ? -1 : K[j * cw + i];
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
        if (!at(i, j)) continue;
        const k = kk(i, j), px = i + 1, py = j + 1;
        if (k === -2) { A.px(px, py, CRACK); continue; }
        let col = S[seeds[k][2]];
        if (kk(i, j - 1) === -2 || kk(i - 1, j) === -2) col = HI;                          // slab edges: lit on the upper left...
        else if (kk(i, j + 1) === -2 || kk(i + 1, j) === -2) col = SHADE;                  // ...shadowed on the lower right
        else if (vnoise(i, j, 4, 17) > 0.72) col = S[Math.min(2, seeds[k][2] + 1)];        // weathering
        A.px(px, py, col);
        if (D[j * cw + i] > -4 && vnoise(i, j, 5, 29) > 0.58) A.px(px, py, '#f2dca2');     // sand drifted back over the edge
    }
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) if (at(i, j) && !at(i, j + 1)) {   // the shelf's low front edge
        A.r(i + 1, j + 2, 1, 3, '#bca07a'); A.px(i + 1, j + 4, '#8e7658');
    }
    const on = (x, y) => at(x + M, y + UP) && kk(x + M, y + UP) >= 0;
    const coin = (x, y, r) => { A.ell(X + x, Y + y, r, Math.max(1, r - 1), '#c8b28a'); A.ell(X + x, Y + y, Math.max(1, r - 1), Math.max(1, r - 2), '#e8d8b4'); A.px(X + x, Y + y, '#b09a74'); A.px(X + x - 1, Y + y - 1, HI); };
    for (let n = 0; n < 7; n++) {                                                            // nummulites, in drifts
        const cx = R() * w, cy = -24 + R() * (d + 20);
        for (let m = 0; m < 12; m++) { const x = Math.round(cx + (R() - 0.5) * 30), y = Math.round(cy + (R() - 0.5) * 16); if (on(x, y) && on(x + 3, y + 2) && on(x - 3, y - 2)) coin(x, y, R() < 0.3 ? 3 : 2); }
    }
    const ammonite = (x, y, r) => {
        A.ell(X + x, Y + y, r + 1, Math.round(r * 0.8) + 1, '#b8a07a'); A.ell(X + x, Y + y, r, Math.round(r * 0.8), '#e4d2ac');
        let lx = null, ly = null;
        for (let t = 0; t < Math.PI * 7; t += 0.12) { const rr = r * (1 - t / (Math.PI * 7.4)), qx = Math.round(X + x + Math.cos(t) * rr), qy = Math.round(Y + y + Math.sin(t) * rr * 0.8); if (lx !== null) A.line(lx, ly, qx, qy, '#a48c66'); lx = qx; ly = qy; }
        for (let t = 0; t < Math.PI * 2; t += 0.45) A.px(Math.round(X + x + Math.cos(t) * (r - 1)), Math.round(Y + y + Math.sin(t) * (r - 1) * 0.8), '#fbf0d6');   // the ribs
    };
    ammonite(46, 30, 8); ammonite(118, -12, 6);
    const ux = 92, uy = 66;                                                                 // a sea urchin, its five petals
    A.ell(X + ux, Y + uy, 6, 5, '#c0a880'); A.ell(X + ux, Y + uy, 5, 4, '#e0ceaa');
    for (let p = 0; p < 5; p++) { const a = -Math.PI / 2 + p * Math.PI * 0.4; for (let s = 1; s <= 3; s++) A.px(Math.round(X + ux + Math.cos(a) * s), Math.round(Y + uy + Math.sin(a) * s * 0.8), '#a48c66'); }
    for (const [sx, sy] of [[20, 70], [70, 10], [140, 50], [60, -20]]) { A.line(X + sx, Y + sy, X + sx + 4, Y + sy - 2, '#b8a07a'); A.line(X + sx + 4, Y + sy - 2, X + sx + 7, Y + sy, '#b8a07a'); A.px(X + sx + 3, Y + sy - 1, HI); }   // shell bits
    const rock = outline(c0, '#8e7658'), [c, g] = mk(rock.width, rock.height), B = pa(g);
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) if (U[j * cw + i] && !IN[j * cw + i]) {   // sand over the tiles the rock pulls back from
        B.px(i + 1, j + 1, '#f2dca2'); if (hash2(i * 3, j * 7) > 0.985) B.px(i + 1, j + 1, '#d9bc78');
    }
    g.drawImage(rock, 0, 0);
    return { c, ox: -X, oy: -Y, flat: true };
};
function smallFind(col) { return (w, d) => { const st = propStage(w, d, 10, 8), { A } = st; A.ell(st.x + 4, st.y + 4, 4, 2, col[1]); A.px(st.x + 3, st.y + 3, col[0]); A.px(st.x + 6, st.y + 5, col[2]); return Object.assign(propFit(st, w, d, { flat: true }), { sparkle: true }); }; }
SPR_L['painted sherd'] = smallFind(PAL.brick);
SPR_L['fossil'] = (w, d) => {                         // a loose fossil: a little ammonite, glinting
    const st = propStage(w, d, 12, 10), { A } = st, x = st.x + 5, y = st.y + 5;
    A.ell(x, y, 5, 4, '#b8a07a'); A.ell(x, y, 4, 3, '#f0e2c2'); A.ell(x + 1, y, 2, 2, '#c8b28a'); A.px(x + 1, y, '#f0e2c2'); A.px(x - 2, y - 2, '#ffffff'); A.px(x + 3, y + 2, '#a48c66');
    return Object.assign(propFit(st, w, d, { flat: true }), { sparkle: true });
};
SPR_L['something buried'] = (w, d) => { const st = propStage(w, d, 14, 8), { A } = st; A.ell(st.x + 6, st.y + 4, 6, 3, PAL.sand[3]); A.ell(st.x + 6, st.y + 3, 4, 1, PAL.sand[1]); return Object.assign(propFit(st, w, d, { flat: true }), { c: st.c }); };
SPR_L['broken clay pot'] = (w, d) => { const st = propStage(w, d, 14, 12), { A } = st; A.ell(st.x + 6, st.y + 7, 5, 4, PAL.brick[1]); A.ell(st.x + 6, st.y + 4, 4, 2, PAL.dark[3]); A.poly([[st.x + 2, st.y + 3], [st.x + 5, st.y + 1], [st.x + 7, st.y + 4]], PAL.brick[0]); A.px(st.x + 12, st.y + 10, PAL.brick[2]); return propFit(st, w, d); };
SPR_L['driftwood'] = (w, d) => { const st = propStage(w, d, 30, 10), { A } = st; A.line(st.x, st.y + 6, st.x + 28, st.y + 3, PAL.wood[0]); A.line(st.x, st.y + 7, st.x + 28, st.y + 4, PAL.wood[2]); A.line(st.x + 12, st.y + 5, st.x + 17, st.y, PAL.wood[1]); return propFit(st, w, d, { flat: true }); };
SPR.c1a_finds = (w, d) => { const st = propStage(w, d, 30, 14), { A } = st; A.r(st.x + 2, st.y + 6, 24, 6, PAL.white[0]); A.r(st.x + 5, st.y + 1, 4, 8, PAL.rock[0]); A.r(st.x + 5, st.y + 1, 4, 3, PAL.dark[2]); A.r(st.x + 13, st.y + 8, 6, 2, PAL.wood[1]); A.ell(st.x + 22, st.y + 8, 3, 2, PAL.brick[2]); return Object.assign(propFit(st, w, d), { oy: Math.round(d - 30) }); };
SPR.c1m_kitchen = (w, d) => { const st = propStage(w, d, 60, 36), { A } = st; A.r(st.x + 6, st.y + 14, 48, 20, PAL.red[2]); A.dith(st.x + 6, st.y + 14, 48, 20, PAL.red[3], 0); for (let j = 17; j < 34; j += 6) A.r(st.x + 6, st.y + j, 48, 1, PAL.gold[1]); A.r(st.x + 6, st.y + 14, 48, 1, PAL.blue[2]); A.r(st.x + 10, st.y + 4, 16, 6, PAL.olive[1]); A.r(st.x + 10, st.y + 4, 16, 2, PAL.dark[2]); A.r(st.x + 11, st.y + 10, 1, 9, PAL.metal[2]); A.r(st.x + 24, st.y + 10, 1, 9, PAL.metal[2]); drum(A, st.x + 30, st.y + 8, PAL.blue); A.r(st.x + 40, st.y + 18, 14, 5, PAL.white[0]); A.r(st.x + 40, st.y + 23, 14, 6, PAL.red[1]); A.r(st.x + 14, st.y + 24, 3, 3, PAL.white[0]); A.r(st.x + 19, st.y + 25, 3, 3, PAL.white[0]); return propFit(st, w, d, { solid: [w / 2 - 22, d - 18, 50, 12] }); };
SPR.c1m_toolrack = (w, d) => { const st = propStage(w, d, 64, 40), { A } = st; A.r(st.x + 2, st.y + 4, 3, 34, PAL.wood[2]); A.r(st.x + 58, st.y + 4, 3, 34, PAL.wood[2]); A.r(st.x, st.y + 8, 63, 3, PAL.wood[1]); for (let i = 0; i < 5; i++) { const x = st.x + 9 + i * 10; A.line(x + 2, st.y + 5, x, st.y + 36, PAL.plank[0]); if (i % 2) { A.r(x - 3, st.y + 4, 9, 2, PAL.metal[3]); } else { A.poly([[x - 2, st.y + 30], [x + 3, st.y + 30], [x + 2, st.y + 38], [x - 1, st.y + 38]], PAL.metal[1]); } } crateAt(A, st.x + 44, st.y + 22, 14, 1); return propFit(st, w, d, { solid: [w / 2 - 30, d - 10, 60, 10] }); };
SPR.c1m_trenchkit = (w, d) => {                  // a wheelbarrow of spoil, a shovel stuck in it, a bucket
    const st = propStage(w, d, 46, 30), { A } = st, x = st.x, y = st.y + 4;
    A.line(x + 26, y + 14, x + 43, y + 9, '#8e5e32'); A.line(x + 26, y + 15, x + 43, y + 10, '#b8844c');                                       // the handles
    A.poly([[x + 4, y + 6], [x + 30, y + 6], [x + 26, y + 18], [x + 9, y + 18]], '#58a848'); A.poly([[x + 4, y + 6], [x + 30, y + 6], [x + 29, y + 9], [x + 6, y + 9]], '#8cd060');   // the green tray
    A.ell(x + 17, y + 6, 12, 3, '#c89a5c'); A.ell(x + 15, y + 5, 8, 2, '#e8c490');                                                            // spoil heaped in it
    A.line(x + 20, y - 4, x + 18, y + 6, '#b8844c'); A.r(x + 17, y - 6, 5, 3, '#9aa4ae');                                                      // a shovel handle, sticking up
    A.ell(x + 9, y + 21, 4, 4, '#1a1c22'); A.ell(x + 9, y + 21, 2, 2, '#9aa4ae'); A.r(x + 25, y + 17, 2, 7, '#5a6272');                          // wheel, leg
    A.r(x + 34, y + 12, 8, 9, '#9aa4ae'); A.vl(x + 34, y + 12, 9, '#dfe6ea'); A.ell(x + 38, y + 12, 4, 1, '#5a6272');                              // bucket
    return propFit(st, w, d, { solid: [w / 2 - 16, d - 10, 32, 10] });
};
SPR_L['vegetable crates'] = (w, d, o) => {       // three slatted crates of vegetables, one stacked
    const st = propStage(w, d, 40, 28), { A } = st, VEG = [['#e05838', '#ff9070'], ['#f0b030', '#ffe070'], ['#58a848', '#8cd060'], ['#8a4a9a', '#b070c0']];
    [[2, 13], [20, 15], [11, 3]].forEach(([dx, dy], i) => {
        const x = st.x + dx, y = st.y + dy, [vc, vl] = VEG[(i + (o.id.endsWith('2') ? 2 : 0)) % 4];
        for (let k = 0; k < 6; k++) { const vx = x + 2 + (k % 3) * 5, vy = y + (k > 2 ? 2 : 0); A.ell(vx + 2, vy + 2, 2, 2, vc); A.px(vx + 1, vy + 1, vl); }   // the vegetables, heaped
        A.r(x, y + 4, 16, 7, '#d8aa68'); A.hl(x, y + 4, 16, '#f0cc90'); A.hl(x, y + 7, 16, '#b08048'); A.hl(x, y + 10, 16, '#8e5e32');              // the slats
        A.vl(x, y + 4, 7, '#b08048'); A.vl(x + 15, y + 4, 7, '#8e5e32');
    });
    return propFit(st, w, d, { solid: [w / 2 - 18, d - 12, 36, 12] });
};
SPR.c1c_milcrates = (w, d) => { const st = propStage(w, d, 34, 26), { A } = st; for (const [x, y] of [[0, 12], [16, 14], [6, 2]]) { A.r(st.x + x, st.y + y, 16, 5, PAL.olive[1]); A.r(st.x + x, st.y + y + 5, 16, 7, PAL.olive[2]); A.r(st.x + x, st.y + y + 5, 16, 1, PAL.olive[3]); A.r(st.x + x + 6, st.y + y + 7, 4, 2, PAL.gold[1]); } return propFit(st, w, d, { solid: [w / 2 - 16, d - 12, 32, 12] }); };
// the dig zone gate: two chain-link leaves, a red sign
// the dig zone gate, standing open: a leaf swung back on each post, the warning sign beside it
SPR.dig_gate = (w, d) => Object.assign(digGate(w, d), { noShadow: true });
// the same gate while it's locked: a chain slung between the posts, and a padlock (the story takes it off)
function digGateLocked(w, d) {
    const sp = SPR.dig_gate(w, d), [c, g] = mk(sp.c.width, sp.c.height), A = pa(g);
    g.drawImage(sp.c, 0, 0);
    const x0 = 25 - 2 + 4, x1 = 25 + w - 2, y0 = 19 + 6;              // just inside the posts (see digGate: stage x 25, top 19)
    for (let x = x0; x < x1; x++) {
        const t = (x - x0) / (x1 - x0), y = y0 + Math.round(Math.sin(t * Math.PI) * 5);
        A.px(x, y + 1, PAL.line); A.px(x, y, (x >> 1) % 2 ? PAL.metal[1] : PAL.metal[3]);
    }
    const mx = (x0 + x1) >> 1, my = y0 + 6;
    A.r(mx - 1, my - 3, 3, 1, PAL.metal[2]); A.r(mx - 2, my - 2, 1, 2, PAL.metal[2]); A.r(mx + 2, my - 2, 1, 2, PAL.metal[2]);   // the shackle
    A.r(mx - 3, my, 7, 6, PAL.line); A.r(mx - 2, my + 1, 5, 4, PAL.gold[1]); A.r(mx - 2, my + 1, 5, 1, PAL.gold[0]); A.px(mx, my + 3, PAL.dark[2]);
    return Object.assign({}, sp, { c });
}
function digGate(w, d) {
    const st = stage(w, d, 40, 24), { A } = st, x = st.x, top = st.y - 22;
    for (const [px, s] of [[x - 2, -1], [x + w - 2, 1]]) {
        A.r(px, top - 4, 4, 30 + d, PAL.metal[2]); A.vl(px, top - 4, 30 + d, PAL.metal[0]); A.r(px - 1, top - 6, 6, 3, PAL.metal[3]);
        // the leaf, swung inward (seen edge-on, it runs up the screen)
        const lx = px + (s < 0 ? 3 : -5);
        A.g.fillStyle = 'rgba(200,212,220,0.2)'; A.g.fillRect(lx, top - 16, 6, 28);
        for (let j = 0; j < 28; j += 3) A.px(lx + 1 + (j % 2) * 3, top - 16 + j, PAL.metal[2]);
        A.r(lx, top - 17, 6, 2, PAL.metal[2]); A.vl(lx + (s < 0 ? 5 : 0), top - 16, 28, PAL.metal[3]);
    }
    A.r(x - 10, top + 2, 2, 22, PAL.wood[2]); A.r(x - 24, top - 8, 30, 14, PAL.red[1]); A.r(x - 24, top - 8, 30, 1, PAL.red[0]); A.r(x - 21, top - 5, 24, 1, PAL.white[0]); A.r(x - 19, top - 2, 20, 1, PAL.white[0]); A.r(x - 21, top + 1, 24, 1, PAL.white[0]);
    return fit(st);
}
SPR.puzzle_glyph = SPR.tunnel_mouth = (w, d, o) => {       // a doorway cut into the cliff face: dressed jambs, a lintel, the dark inside (or the sealed stone)
    const shaft = o.id === 'tunnel_mouth', W = shaft ? 40 : 30, H = 40, st = propStage(w, d, W, H), { A } = st, x = st.x, y = st.y;
    A.r(x, y, W, H, '#9a7e58'); A.r(x, y, W, 3, '#f4e8d0'); A.r(x, y + 3, W, 4, '#c2a67c');                                            // the lintel
    for (let k = 0; k < W; k += 10) A.vl(x + k, y + 3, 4, '#735c3e');
    A.r(x + 3, y + 8, 5, H - 8, '#c2a67c'); A.r(x + W - 8, y + 8, 5, H - 8, '#735c3e');                                                  // jambs: lit, shaded
    for (let j = y + 12; j < y + H; j += 8) { A.hl(x + 3, j, 5, '#9a7e58'); A.hl(x + W - 8, j, 5, '#4e3e2a'); }
    if (shaft) { A.r(x + 8, y + 8, W - 16, H - 8, '#140c08'); A.r(x + 8, y + 8, W - 16, 4, '#2a1c14'); for (let j = y + 14; j < y + H; j += 5) A.hl(x + 12, j, W - 24, '#3a2a1c'); }   // the dark, a ladder going down
    else { A.r(x + 8, y + 8, W - 16, H - 8, '#b8a47c'); A.hl(x + 8, y + 8, W - 16, '#e8dcc0'); for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) { A.r(x + 10 + i * 6, y + 12 + j * 7, 4, 5, '#c89020'); A.hl(x + 10 + i * 6, y + 12 + j * 7, 4, '#ffe890'); } }   // the seal: four rows of gold signs
    A.r(x, y + H - 2, W, 2, '#4e3e2a');
    return Object.assign(propFit(st, w, d), { solid: [(w - W) / 2, d - 6, W, 6] });
};

// ---- PLANTS ----
function palm(seed, heavy) {
    const R = rng(seed), [c, g] = mk(72, 88), A = pa(g), lean = Math.round((R() - 0.5) * 10), tx = 36, ty = 84;
    for (let j = 0; j < 54; j++) {                                // the trunk: ringed, leaning a little, lit on its left
        const x = tx + Math.round(lean * (j / 54) * (j / 54)) - 3, y = ty - j, wd = j < 6 ? 7 : 6;
        A.r(x, y, wd, 1, '#b07a48'); A.r(x, y, 2, 1, '#d4a06a'); A.r(x + wd - 2, y, 2, 1, '#7a4e2c');
        if (j % 5 === 0) A.r(x, y, wd, 1, '#8a5c34');
    }
    const hx = tx + lean, hy = ty - 54;
    const LEAF = [['#2f7a3a', '#1f5a2c'], ['#4aa04a', '#2f7a3a'], ['#78c85a', '#4aa04a']];
    // one frond: a tapered blade along a drooping arc, a lighter midrib down its middle
    const frond = (ang, len, droop, tone) => {
        const pts = [];
        for (let t = 0; t <= 1.0001; t += 0.1) pts.push([hx + Math.cos(ang) * len * t, hy + Math.sin(ang) * len * t * 0.6 + droop * t * t]);
        const L = [], Rt = [];
        pts.forEach((pt, i) => {
            const nx = pts[Math.min(i + 1, pts.length - 1)][0] - pts[Math.max(i - 1, 0)][0], ny = pts[Math.min(i + 1, pts.length - 1)][1] - pts[Math.max(i - 1, 0)][1], nl = Math.hypot(nx, ny) || 1;
            const t = i / (pts.length - 1), wdt = Math.sin(Math.min(1, t * 1.6) * Math.PI * 0.5) * (1 - t * 0.85) * 5.5 + 0.6;
            L.push([pt[0] - ny / nl * wdt, pt[1] + nx / nl * wdt]); Rt.push([pt[0] + ny / nl * wdt, pt[1] - nx / nl * wdt]);
        });
        A.poly(L.concat(Rt.reverse()), LEAF[tone][1]);
        A.poly(L.map((q, i) => [(q[0] + pts[i][0]) / 2, (q[1] + pts[i][1]) / 2]).concat(pts.slice().reverse()), LEAF[tone][0]);
        for (let i = 0; i + 1 < pts.length; i++) A.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], tone === 2 ? '#a8e070' : LEAF[Math.min(2, tone + 1)][0]);
        for (let i = 3; i < pts.length - 1; i += 2) { const q = Rt[Rt.length - 1 - i]; A.px(q[0], q[1], LEAF[tone][1]); }   // notches along the edge
    };
    const n = 7;
    for (let i = 0; i < n; i++) frond(Math.PI + (i / (n - 1)) * Math.PI + (R() - 0.5) * 0.2, 22 + R() * 6, 6 + R() * 6, 0);   // the back fronds, in shade
    for (let i = 0; i < n; i++) frond((i / n) * Math.PI * 2 + R() * 0.4, 21 + R() * 7, 12 + R() * 9, 1);
    for (let i = 0; i < 4; i++) frond(-Math.PI * 0.85 + i * 0.5 + R() * 0.2, 14 + R() * 4, 4, 2);                              // young fronds on top, catching the sun
    A.ell(hx - 3, hy + 4, 2, 2, '#e0a030'); A.ell(hx + 2, hy + 5, 2, 2, '#c07830'); A.ell(hx, hy + 3, 2, 2, '#e8b840');           // dates
    if (heavy) for (const [bx, by] of [[-9, 4], [8, 5], [-1, 7]]) {                                                            // a date palm in fruit: heavy amber bunches under the crown
        A.line(hx, hy + 2, hx + bx, hy + by, '#e0b050');
        for (let r = 0; r < 4; r++) for (let k = 0; k < 4 - (r >> 1) - (r === 3 ? 1 : 0); k++) {
            const qx = hx + bx - 3 + k * 2 + (r & 1), qy = hy + by + r * 2;
            A.r(qx, qy, 2, 2, (k + r) % 3 ? '#c8782c' : '#a0521e'); A.px(qx, qy, '#f4b050');
        }
    }
    return { c: outline(c), ox: -36, oy: -85, solid: [-4, -4, 8, 5] };
}
function acacia(seed) {
    const R = rng(seed), [c, g] = mk(70, 56), A = pa(g);
    A.line(35, 54, 33, 30, PAL.wood[2]); A.line(36, 54, 34, 30, PAL.wood[3]); A.line(34, 38, 22, 24, PAL.wood[2]); A.line(35, 36, 48, 22, PAL.wood[2]);
    A.ell(34, 17, 30, 9, PAL.olive[2]); A.ell(30, 14, 24, 6, PAL.olive[1]); A.ell(24, 11, 12, 3, PAL.olive[0]); A.ell(44, 13, 10, 3, PAL.olive[0]);
    for (let i = 0; i < 24; i++) A.px(6 + R() * 58, 12 + R() * 12, PAL.olive[3]);
    return { c: outline(c), ox: -35, oy: -55, solid: [-3, -3, 6, 4] };
}
function shrub(seed, dry) {
    const R = rng(seed), [c, g] = mk(22, 18), A = pa(g), P = dry ? [PAL.canvas[2], PAL.canvas[3], PAL.khaki[2]] : [PAL.olive[0], PAL.olive[1], PAL.olive[2]];
    for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.12 + i * 0.095), l = 7 + R() * 7; A.line(11, 16, 11 + Math.cos(a) * l, 16 + Math.sin(a) * l, P[i % 3]); }
    return { c, ox: -11, oy: -17, noShadow: true };
}
function cactus(seed) {                                           // a prickly pear: flat green pads
    const R = rng(seed), [c, g] = mk(26, 28), A = pa(g);
    const pad = (x, y, rx, ry) => { A.ell(x, y, rx, ry, PAL.green[2]); A.ell(x - 1, y - 1, rx - 1, ry - 1, PAL.green[1]); A.px(x - 1, y - 2, PAL.green[0]); A.px(x + 1, y + 1, PAL.green[3]); };
    pad(13, 20, 5, 6); pad(7, 12, 4, 5); pad(19, 11, 4, 5); pad(13, 6, 3, 4);
    if (R() < 0.6) { A.px(7, 6, PAL.red[0]); A.px(19, 5, PAL.red[0]); }
    return { c: outline(c), ox: -13, oy: -27, solid: [-5, -4, 10, 5] };
}
SPR_L['palm tree'] = SPR_L["sam's date palm"] = (w, d, o) => Object.assign(palm(o.id), { anchor: true });
SPR_L['cactus'] = SPR_L['lone date cactus'] = (w, d, o) => Object.assign(cactus(o.id), { anchor: true });

// ---- ANIMALS ----
SPR.camp_dog = (w, d) => {                                        // Bosta: a sandy street dog, lying by the fire, tail going
    const frames = [0, 1].map(f => { const st = propStage(w, d, 28, 18), { A } = st; A.ell(st.x + 13, st.y + 11, 10, 5, PAL.sand[3]); A.ell(st.x + 12, st.y + 10, 8, 3, PAL.sand[2]); A.ell(st.x + 22, st.y + 8, 4, 4, PAL.sand[3]); A.r(st.x + 24, st.y + 9, 3, 2, PAL.sand[1]); A.px(st.x + 26, st.y + 9, PAL.dark[3]); A.px(st.x + 22, st.y + 7, PAL.dark[3]); A.poly([[st.x + 19, st.y + 4], [st.x + 21, st.y + 1], [st.x + 22, st.y + 5]], PAL.rock[3]); A.line(st.x + 3, st.y + 11, st.x + (f ? 0 : 1), st.y + (f ? 5 : 8), PAL.sand[3]); A.r(st.x + 16, st.y + 14, 6, 2, PAL.sand[1]); return outline(st.c); });
    return { c: frames[0], frames, fps: 3, ox: Math.round((w - frames[0].width) / 2), oy: Math.round(d - frames[0].height + 1), solid: [w / 2 - 10, d - 6, 20, 6] };
};
function horse(A, x, y, P3) { A.ell(x + 14, y + 12, 11, 6, P3[1]); A.ell(x + 12, y + 10, 8, 3, P3[0]); for (const lx of [x + 6, x + 10, x + 19, x + 22]) A.r(lx, y + 16, 2, 9, P3[2]); A.poly([[x + 22, y + 9], [x + 28, y + 1], [x + 31, y + 3], [x + 26, y + 12]], P3[1]); A.ell(x + 30, y + 3, 3, 2, P3[1]); A.px(x + 31, y + 2, PAL.dark[3]); A.line(x + 23, y + 6, x + 27, y, PAL.dark[2]); A.line(x + 3, y + 10, x, y + 18, PAL.dark[2]); }
SPR.c1a_horses = (w, d) => { const st = propStage(w, d, 72, 30), { A } = st; horse(A, st.x, st.y + 2, [PAL.wood[0], PAL.wood[1], PAL.wood[3]]); horse(A, st.x + 36, st.y, [PAL.white[1], PAL.white[2], PAL.white[3]]); return propFit(st, w, d, { solid: [w / 2 - 32, d - 8, 64, 8] }); };
function camel() { const [c, g] = mk(46, 30), A = pa(g); A.ell(20, 20, 15, 6, PAL.sand[3]); A.ell(18, 13, 8, 6, PAL.sand[3]); A.ell(17, 11, 5, 3, PAL.sand[2]); A.poly([[30, 18], [36, 6], [39, 7], [35, 20]], PAL.sand[3]); A.ell(39, 6, 4, 3, PAL.sand[3]); A.r(41, 7, 3, 2, PAL.sand[2]); A.px(39, 5, PAL.dark[3]); A.r(8, 24, 8, 3, PAL.sand[4]); A.r(24, 24, 8, 3, PAL.sand[4]); A.r(12, 8, 12, 3, PAL.red[2]); A.r(12, 8, 12, 1, PAL.gold[1]); return { c: outline(c), ox: -23, oy: -29, solid: [-16, -8, 34, 8] }; }

// ---- ROCK WALLS (the ridges and outcrops around the dig zone) ----
// A rough block of limestone: an uneven top, a face of strata below it
function rockBlock(w, d, seed) {
    const R = rng(seed), faceH = 24, st = stage(w, d, faceH), { A } = st, x = st.x, top = st.y - faceH;
    // the outline wanders in and out, and the corners are knocked off
    const inTop = [], inBot = [], corner = Math.min(14, w / 4);
    let a = R() * 4, b = R() * 4;
    for (let i = 0; i < w; i++) {
        if (i % 5 === 0) { a = Math.max(0, Math.min(6, a + (R() - 0.5) * 4)); b = Math.max(0, Math.min(6, b + (R() - 0.5) * 4)); }
        const e = Math.min(i, w - 1 - i), c = e < corner ? Math.round((1 - Math.sqrt(1 - Math.pow(1 - e / corner, 2))) * corner * 0.8) : 0;
        inTop.push(Math.round(a) + c); inBot.push(Math.round(b) + c);
    }
    for (let i = 0; i < w; i++) {
        const y0 = top + inTop[i], y1 = top + d - inBot[i];
        if (y1 <= y0) continue;
        A.vl(x + i, y0, y1 - y0, PAL.rock[1]);
        A.px(x + i, y0, PAL.rock[0]); A.px(x + i, y0 + 1, PAL.rock[0]);
        const fh = faceH - Math.round(inBot[i] * 0.4);
        for (let j = 0; j < fh; j++) { const band = Math.floor((j + Math.sin(i * 0.09) * 2) / 5) % 2; A.px(x + i, y1 + j, PAL.rock[j > fh - 5 ? 4 : band ? 3 : 2]); }
    }
    // slabs and cracks on top, cracks down the face
    for (let k = 0; k < w * d / 300; k++) { const rx = x + 4 + R() * (w - 22), ry = top + 8 + R() * (d - 20); A.ell(rx + 7, ry + 3, 4 + R() * 6, 2 + R() * 2, PAL.rock[R() < 0.6 ? 0 : 2]); }
    for (let k = 0; k < w * d / 900; k++) { const rx = x + 6 + R() * (w - 14), ry = top + 8 + R() * (d - 18); A.line(rx, ry, rx + (R() - 0.5) * 14, ry + 4 + R() * 9, PAL.rock[3]); }
    for (let i = 5; i < w - 4; i += 9 + Math.round(R() * 8)) A.vl(x + i, top + d - inBot[i] + 2, 5 + R() * 13, PAL.rock[4]);
    return fit(st);
}

// ---- FENCES (drawn along collision walls) ----
function fenceH(len, kind) {
    const up = kind === 'rope' ? 10 : kind === 'rail' ? 12 : 20, st = stage(len, 4, up), { A } = st, x = st.x, top = st.y - up;
    const step = kind === 'rope' ? 22 : kind === 'rail' ? 20 : 32;
    if (kind === 'rope') { for (let i = 0; i <= len - 2; i += step) { A.r(x + i, top + 2, 2, up + 2, PAL.wood[1]); A.r(x + i, top + 2, 2, 2, PAL.red[1]); } for (let i = 0; i < len; i++) A.px(x + i, top + 5 + Math.round(Math.abs(Math.sin((i % step) / step * Math.PI)) * 2), PAL.canvas[2]); }
    else if (kind === 'rail') { for (const y of [top + 3, top + 8]) { A.r(x, y, len, 2, PAL.wood[1]); A.hl(x, y, len, PAL.wood[0]); } for (let i = 0; i <= len - 3; i += step) { A.r(x + i, top, 3, up + 3, PAL.wood[2]); A.r(x + i, top, 3, 1, PAL.wood[0]); } }
    else {
        // chain link: a see-through diamond mesh between steel posts
        A.g.fillStyle = 'rgba(200,212,220,0.16)'; A.g.fillRect(x, top + 2, len, up - 2);
        for (let i = 0; i < len; i++) for (let j = 3; j < up; j++) if ((i + j) % 6 === 0 || (i - j + 600) % 6 === 0) A.px(x + i, top + j, PAL.metal[2]);
        A.r(x, top + 1, len, 2, PAL.metal[1]); A.r(x, top + up - 1, len, 1, PAL.metal[3]);
        for (let i = 0; i <= len - 3; i += step) { A.r(x + i, top - 1, 3, up + 5, PAL.metal[2]); A.vl(x + i, top - 1, up + 5, PAL.metal[0]); }
        A.r(x + len - 3, top - 1, 3, up + 5, PAL.metal[2]);
    }
    return Object.assign(fit(st), { thin: true });
}
function fenceV(len, kind) {
    const up = kind === 'rope' ? 10 : kind === 'rail' ? 12 : 22, st = stage(4, len, up), { A } = st, x = st.x, top = st.y - up;
    const step = kind === 'rope' ? 22 : 20, col = kind === 'rope' ? PAL.canvas[2] : kind === 'rail' ? PAL.wood[1] : PAL.metal[2];
    A.r(x + 1, top + 4, 1, len, col); if (kind === 'rail') A.r(x + 1, top + 8, 1, len, PAL.wood[2]);
    for (let j = 0; j <= len - 2; j += step) { A.r(x, top + j, 3, up + 2, kind === 'rail' || kind === 'rope' ? PAL.wood[2] : PAL.metal[3]); A.r(x, top + j, 3, 1, kind === 'rope' ? PAL.red[1] : PAL.wood[0]); }
    return Object.assign(fit(st), { thin: true });
}
