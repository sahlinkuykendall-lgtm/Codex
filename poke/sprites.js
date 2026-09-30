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

// ---- building parts ----
function wallPlain(A, x, y, w, h, P3) {
    A.r(x, y, w, h, P3[1]);
    A.r(x, y, w, 2, P3[2]);                       // shadow under the eave
    A.r(x, y + h - 2, w, 2, P3[2]);               // foot
    A.dith(x, y + 2, w, Math.min(4, h - 4), P3[2], 0);
}
function wallPlanks(A, x, y, w, h, P3) {
    A.r(x, y, w, h, P3[1]);
    for (let i = 0; i < w; i += 6) A.vl(x + i, y, h, P3[2]);
    for (let i = 3; i < w; i += 12) A.r(x + i, y + 3, 2, 1, P3[0]);
    A.r(x, y, w, 2, P3[3] || P3[2]);
    A.r(x, y + h - 1, w, 1, P3[3] || P3[2]);
}
function wallBrick(A, x, y, w, h, P3) {
    A.r(x, y, w, h, P3[1]);
    for (let j = 0; j < h; j += 4) { A.hl(x, y + j, w, P3[2]); for (let i = (j / 4 & 1) * 4; i < w; i += 8) A.vl(x + i, y + j, 4, P3[2]); }
    A.r(x, y, w, 2, P3[3] || P3[2]);
}
function door(A, x, y, w, h, col, frame) {
    A.r(x - 1, y - 1, w + 2, h + 1, frame || PAL.wood[3]);
    A.r(x, y, w, h, col);
    A.vl(x + w - 1, y, h, PAL.dark[2]);
    A.px(x + w - 3, y + (h >> 1), PAL.gold[1]);
}
function windowP(A, x, y, w, h, lit) {
    A.r(x - 1, y - 1, w + 2, h + 2, PAL.wood[3]);
    A.r(x, y, w, h, lit ? PAL.gold[0] : PAL.blue[3]);
    if (!lit) { A.r(x, y, w, 1, PAL.blue[2]); A.px(x + 1, y + 1, PAL.blue[0]); }
    A.vl(x + (w >> 1), y, h, PAL.wood[3]);
    A.r(x - 1, y + h + 1, w + 2, 1, PAL.wood[1]);
}
// gable roof, ridge running left-right; returns y of the front eave
function roofGable(A, x, top, w, d, rise, P3, ribs) {
    const ridge = top + Math.round(d * 0.45);
    A.r(x, top, w, ridge - top, P3[2]);                        // back slope, in shade
    A.r(x, ridge, w, top + d - ridge, P3[1]);                  // front slope
    A.r(x, ridge, w, 2, P3[0]);                                // the ridge catches the light
    A.r(x, top + d - 2, w, 2, P3[3] || P3[2]);                 // eave shadow
    if (ribs) for (let i = 2; i < w; i += ribs) { A.vl(x + i, top, ridge - top, P3[3] || P3[2]); A.vl(x + i, ridge + 2, top + d - ridge - 4, P3[2]); }
    A.vl(x, top, d, P3[0]); A.vl(x + w - 1, top, d, P3[3] || P3[2]);
    return top + d;
}
function roofFlat(A, x, top, w, d, P3) {
    A.r(x, top, w, d, P3[1]);
    A.r(x + 3, top + 3, w - 6, d - 6, P3[2]);                  // the deck, inside the parapet
    A.dith(x + 3, top + 3, w - 6, d - 6, P3[1], 0);
    A.r(x, top, w, 2, P3[0]); A.vl(x, top, d, P3[0]);
    A.r(x, top + d - 2, w, 2, P3[2]);
}

const SPR = {};   // by object id
const SPR_L = {}; // by model label (lower case)

// ---- TENTS ----
// A ridge tent: canvas slopes down front and back, a short wall, the door laced open
function tentRidge(w, d, P4, doorAt, doorW) {
    const wallH = 14, rise = 14, st = stage(w, d, wallH + rise, 8), { A } = st;
    const x = st.x, top = st.y - wallH - rise, eave = st.y + d - wallH, ridge = top + Math.round((eave - top) * 0.4), fh = eave - ridge;
    for (let i = 0; i <= 4; i++) {                              // guy ropes down to their pegs
        const gx = x + Math.round(i * (w - 1) / 4), out = (i - 2) * 4;
        A.line(gx, eave, gx + out, st.base - 1, P4[3]); A.r(gx + out - 1, st.base - 2, 2, 2, PAL.wood[3]);
    }
    A.r(x, top, w, ridge - top, P4[2]); A.dith(x, top, w, 3, P4[3], 0);                      // back slope, in shade
    A.r(x, ridge, w, fh, P4[0]);                                                              // front slope: sunlit, falling into shade at the eave
    A.r(x, ridge + Math.round(fh * 0.5), w, fh - Math.round(fh * 0.5), P4[1]);
    A.dith(x, ridge + Math.round(fh * 0.34), w, Math.round(fh * 0.16), P4[1], 0);
    A.dith(x, ridge + Math.round(fh * 0.82), w, fh - Math.round(fh * 0.82), P4[2], 1);
    const panels = Math.max(3, Math.round(w / 30));                                           // the sewn panels
    for (let i = 1; i < panels; i++) { const sx = x + Math.round(i * w / panels); A.vl(sx, top, eave - top, P4[2]); A.vl(sx + 1, ridge + 2, fh - 2, P4[0]); }
    A.r(x + Math.round(w * 0.16), ridge + Math.round(fh * 0.55), 7, 6, P4[2]); A.r(x + Math.round(w * 0.16), ridge + Math.round(fh * 0.55), 7, 1, P4[3]);   // patches
    A.r(x + Math.round(w * 0.72), ridge + Math.round(fh * 0.22), 6, 5, P4[1]); A.r(x + Math.round(w * 0.72), ridge + Math.round(fh * 0.22), 6, 1, P4[2]);
    A.r(x - 3, ridge - 1, w + 6, 3, PAL.wood[2]); A.r(x - 3, ridge - 1, w + 6, 1, PAL.wood[0]);   // the ridge pole, poking out at both ends
    A.r(x - 4, ridge - 2, 2, 5, PAL.wood[3]); A.r(x + w + 2, ridge - 2, 2, 5, PAL.wood[3]);
    A.r(x, eave - 1, w, 3, P4[2]);                                                                 // the eave and its scalloped edge
    for (let i = 0; i < w - 2; i += 6) { A.r(x + i + 1, eave + 2, 4, 1, P4[2]); A.r(x + i + 2, eave + 3, 2, 1, P4[2]); }
    A.r(x, eave + 2, w, wallH - 2, P4[1]); A.dith(x, eave + 2, w, 4, P4[2], 0);                   // the wall below it
    for (let i = 4; i < w; i += 9) A.vl(x + i, eave + 6, wallH - 7, P4[2]);
    A.r(x, eave + wallH - 2, w, 2, P4[3]);
    A.vl(x, top, eave - top + wallH, P4[3]); A.vl(x + w - 1, top, eave - top + wallH, P4[3]);
    if (doorAt != null) {                                       // the doorway: dark inside, flaps tied back
        const dw = doorW || 22, dx = x + Math.round(doorAt - dw / 2);
        A.r(dx, eave - 8, dw, wallH + 8, PAL.dark[3]);
        A.poly([[dx, eave - 8], [dx + 6, eave - 8], [dx, eave + wallH]], P4[0]); A.poly([[dx + dw, eave - 8], [dx + dw - 6, eave - 8], [dx + dw, eave + wallH]], P4[2]);
        A.r(dx - 1, eave - 9, dw + 2, 2, PAL.wood[2]);
        A.r(dx + 5, eave + wallH - 3, dw - 10, 3, PAL.red[2]); A.dith(dx + 5, eave + wallH - 3, dw - 10, 3, PAL.gold[1], 0);   // the edge of a rug
    }
    return st;
}
SPR.tent_bldg = (w, d) => fit(tentRidge(w, d, PAL.canvas, w / 2, 26));
SPR.c1m_mess = (w, d) => {
    // an army marquee, faded drab, the south side rolled up on poles: table and benches inside
    const st = tentRidge(Math.round(w * 0.74), Math.round(d * 0.7), PAL.khaki, null), { A } = st;
    const x = st.x, eave = st.y + st.d - 12, ww = st.w;
    A.r(x + 6, eave, ww - 12, 12, PAL.dark[3]);
    for (const px of [x + 6, x + (ww >> 1), x + ww - 8]) A.r(px, eave, 2, 12, PAL.wood[1]);
    A.r(x + 22, eave + 5, ww - 44, 3, PAL.plank[0]); A.r(x + 22, eave + 8, ww - 44, 1, PAL.wood[3]);
    A.r(x + 26, eave + 10, ww - 52, 2, PAL.wood[2]);
    const s = fit(st);
    s.ox = Math.round((w - st.c.width) / 2); s.oy += Math.round(d * 0.15);
    return s;
};
// the round canvas tent with its awning
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
// things that live on roofs
function roofTank(A, x, y) { A.ell(x + 8, y + 12, 8, 3, PAL.dark[3]); A.r(x, y + 3, 17, 10, PAL.dark[1]); A.ell(x + 8, y + 3, 8, 3, PAL.dark[0]); A.ell(x + 8, y + 3, 5, 1, PAL.dark[2]); A.vl(x + 2, y + 5, 7, PAL.dark[0]); }
function roofDish(A, x, y) { A.ell(x + 6, y + 5, 6, 5, PAL.white[2]); A.ell(x + 5, y + 4, 4, 3, PAL.white[0]); A.line(x + 6, y + 5, x + 10, y, PAL.metal[3]); A.r(x + 5, y + 10, 2, 3, PAL.metal[3]); }
function roofAC(A, x, y) { A.r(x, y, 14, 9, PAL.white[1]); A.r(x, y, 14, 2, PAL.white[0]); A.r(x, y + 9, 14, 4, PAL.white[3]); A.ell(x + 7, y + 5, 3, 2, PAL.metal[3]); A.px(x + 7, y + 5, PAL.dark[2]); }
SPR.dorm_bldg = (w, d) => {                       // the workers' bunkhouse: planks, corrugated iron
    const wallH = 26, st = stage(w, d, wallH), { A } = st, x = st.x, top = st.y - wallH;
    const eave = roofGable(A, x - 2, top, w + 4, d, 0, PAL.metal, 4);
    const R = rng('dormroof');
    for (let i = 0; i < 9; i++) { const rx = x + R() * (w - 14), ry = top + 4 + R() * (d - 14); A.r(rx, ry, 5 + R() * 8, 2 + R() * 3, PAL.brick[2]); A.px(rx + 1, ry + 1, PAL.red[3]); }   // rust
    A.r(x + Math.round(w * 0.62), top + Math.round(d * 0.58), 14, 9, PAL.metal[0]); A.r(x + Math.round(w * 0.62), top + Math.round(d * 0.58), 14, 1, PAL.white[0]);                       // a newer sheet
    roofTank(A, x + 8, top - 4);
    A.r(x + w - 18, top + Math.round(d * 0.2), 3, 9, PAL.dark[2]); A.r(x + w - 19, top + Math.round(d * 0.2) - 2, 5, 2, PAL.dark[1]);                                                       // stove pipe
    wallPlanks(A, x, eave, w, wallH, PAL.wood);
    const dx = x + Math.round(w * 0.55);
    door(A, dx, eave + 7, 13, wallH - 7, PAL.wood[2]);
    for (const wx of [0.12, 0.32, 0.8]) windowP(A, x + Math.round(w * wx), eave + 8, 11, 9, wx === 0.32);
    A.r(dx - 3, eave + wallH, 19, 2, PAL.plank[1]); A.r(dx - 1, eave + wallH + 2, 15, 1, PAL.plank[2]);                                                                                   // step
    return fit(st);
};
SPR.foreman_bldg = (w, d) => {                    // the site office: plastered mud brick, flat roof, blue shutters
    const wallH = 28, st = stage(w, d, wallH + 10), { A } = st, x = st.x, top = st.y - wallH;
    roofFlat(A, x, top, w, d, PAL.plaster);
    for (const rx of [x + 3, x + w - 6]) for (let k = 0; k < 3; k++) A.vl(rx + k, top - 7 - k, 9 + k, PAL.red[3]);      // rebar, waiting for a second storey
    roofTank(A, x + w - 34, top + 6); roofDish(A, x + 12, top + 8); roofAC(A, x + Math.round(w * 0.45), top + Math.round(d * 0.45));
    A.r(x + 34, top + d - 20, 22, 11, PAL.red[2]); A.dith(x + 34, top + d - 20, 22, 11, PAL.gold[1], 0);                   // a rug put out to air
    const wy = top + d;
    wallPlain(A, x, wy, w, wallH, PAL.plaster);
    for (let i = 0; i < 6; i++) { const bx = x + 6 + hash2(i, 7) * (w - 22), by = wy + 10 + hash2(i, 9) * 12; A.r(bx, by, 6, 2, PAL.brick[1]); A.r(bx + 2, by + 3, 6, 2, PAL.brick[2]); }   // brick showing through
    const dx = x + Math.round(w * 0.58);
    door(A, dx, wy + 8, 14, wallH - 8, PAL.blue[1], PAL.plaster[3]);
    for (const wx of [0.18, 0.82]) { const px = x + Math.round(w * wx); windowP(A, px, wy + 9, 11, 9, wx < 0.5); A.r(px - 5, wy + 8, 3, 11, PAL.blue[1]); A.r(px + 13, wy + 8, 3, 11, PAL.blue[1]); A.vl(px - 5, wy + 8, 11, PAL.blue[2]); }
    const sx = x + Math.round(w * 0.3);
    A.r(sx, wy + 3, 40, 8, PAL.white[0]); A.r(sx, wy + 3, 40, 1, PAL.blue[2]); A.r(sx + 3, wy + 6, 34, 1, PAL.dark[2]); A.r(sx + 8, wy + 8, 24, 1, PAL.dark[1]);   // the sign
    return fit(st);
};
function shed(w, d, P3, doorCol, sign) {         // a corrugated-iron shed
    const wallH = 24, st = stage(w, d, wallH), { A } = st, x = st.x, top = st.y - wallH;
    const eave = roofGable(A, x - 1, top, w + 2, d, 0, PAL.metal, 3);
    const R = rng('shed' + w + d);
    for (let i = 0; i < 7; i++) { const rx = x + R() * (w - 12), ry = top + 3 + R() * (d - 10); A.r(rx, ry, 4 + R() * 7, 2 + R() * 3, PAL.brick[2]); }
    A.r(x, eave, w, wallH, P3[1]);
    for (let i = 0; i < w; i += 3) A.vl(x + i, eave, wallH, P3[2]);
    A.r(x, eave, w, 2, P3[3]); A.r(x, eave + wallH - 2, w, 2, P3[3]);
    for (let i = 0; i < 6; i++) A.r(x + hash2(i, w) * (w - 6), eave + 5 + hash2(i, d) * (wallH - 10), 3, 2, PAL.red[3]);   // rust
    door(A, x + (w >> 1) - 8, eave + 5, 16, wallH - 5, doorCol || P3[3]);
    A.r(x + (w >> 1) + 5, eave + 14, 2, 3, PAL.gold[1]);                                                                   // a padlock
    if (sign) { A.r(x + 4, eave + 4, 18, 8, PAL.gold[1]); A.r(x + 4, eave + 4, 18, 1, PAL.gold[0]); A.r(x + 6, eave + 7, 14, 1, PAL.dark[3]); A.r(x + 6, eave + 9, 9, 1, PAL.dark[3]); }
    return st;
}
SPR_L["sam's tool shed"] = (w, d) => fit(shed(w, d, PAL.metal, PAL.dark[1], true));
SPR_L['dig shed clipboard'] = (w, d) => fit(shed(w, d, [PAL.olive[0], PAL.olive[1], PAL.olive[2], PAL.olive[3]], PAL.wood[2], true));
function cabin(w, d, stripe) {                   // a white site cabin with a coloured stripe
    const wallH = 24, st = stage(w, d, wallH), { A } = st, x = st.x, top = st.y - wallH;
    A.r(x, top, w, d, PAL.white[1]); A.r(x + 2, top + 2, w - 4, d - 4, PAL.white[2]); A.dith(x + 2, top + (d >> 1), w - 4, (d >> 1) - 2, PAL.white[3], 0); A.r(x, top, w, 2, PAL.white[0]);
    for (let i = 8; i < w; i += 12) A.vl(x + i, top + 2, d - 4, PAL.white[3]);
    if (w > 50 && d > 30) { roofAC(A, x + w - 22, top + 6); A.r(x + 8, top + Math.round(d * 0.5), 6, 6, PAL.metal[2]); A.r(x + 9, top + Math.round(d * 0.5) + 1, 4, 4, PAL.dark[2]); }
    const wy = top + d;
    A.r(x, wy, w, wallH, PAL.white[1]); A.r(x, wy, w, 2, PAL.white[3]);
    A.r(x, wy + 11, w, 4, stripe); A.r(x, wy + wallH - 2, w, 2, PAL.white[3]);
    for (let i = 10; i < w; i += 20) A.vl(x + i, wy + 2, wallH - 4, PAL.white[2]);
    door(A, x + Math.round(w * 0.62), wy + 6, 12, wallH - 6, PAL.white[2], PAL.metal[3]);
    windowP(A, x + Math.round(w * 0.2), wy + 6, 13, 8, true);
    A.r(x + 4, wy + wallH, 6, 2, PAL.dark[2]); A.r(x + w - 10, wy + wallH, 6, 2, PAL.dark[2]);   // blocks it stands on
    return st;
}
SPR_L['site trailer'] = (w, d) => fit(cabin(w, d, PAL.blue[1]));
SPR_L['ministry post'] = (w, d) => { const st = cabin(w, d, PAL.blue[2]), { A } = st; A.r(st.x + 4, st.y - 20 - 12, 1, 14, PAL.metal[2]); A.r(st.x + 5, st.y - 20 - 12, 9, 2, PAL.red[1]); A.r(st.x + 5, st.y - 20 - 10, 9, 2, PAL.white[0]); A.r(st.x + 5, st.y - 20 - 8, 9, 2, PAL.dark[3]); return fit(st); };
SPR_L['guard booth'] = (w, d) => fit(cabin(w, d, PAL.red[1]));
SPR_L['gear storage'] = (w, d) => {              // an open canopy over stacked crates
    const st = stage(w, d, 24), { A } = st, x = st.x, top = st.y - 24;
    for (const px of [x + 1, x + w - 3]) A.r(px, top + d, 2, 24, PAL.wood[2]);
    for (let i = 0; i < w - 20; i += 18) crateAt(A, x + 8 + i, st.base - 15 - (i % 36 ? 0 : 6), 15, i % 36 ? 0 : 1);
    A.r(x, top, w, d, PAL.olive[1]); A.dith(x, top + (d >> 1), w, d >> 1, PAL.olive[2], 0);
    A.r(x, top, w, 2, PAL.olive[0]); A.r(x, top + d - 2, w, 3, PAL.olive[3]);
    for (let i = 10; i < w; i += 20) A.vl(x + i, top + 2, d - 4, PAL.olive[2]);
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
function truck(w, d, P3, tarp) {
    const st = stage(w, d, 22), { A } = st, x = st.x, top = st.y - 20, cab = Math.round(w * 0.3);
    A.r(x + cab, top, w - cab, d, tarp[1]); A.dith(x + cab, top + (d >> 1), w - cab, d >> 1, tarp[2], 0);   // load bed / tarp top
    A.r(x + cab, top, w - cab, 2, tarp[0]);
    for (let i = cab + 8; i < w; i += 12) A.vl(x + i, top + 2, d - 2, tarp[2]);
    A.r(x, top + 4, cab, d - 4, P3[1]); A.r(x + 2, top + 8, cab - 4, d - 12, P3[0]);                            // cab roof
    const wy = top + d;
    A.r(x + cab, wy, w - cab, 14, tarp[2]); A.r(x + cab, wy + 12, w - cab, 4, PAL.wood[2]);
    A.r(x, wy, cab, 16, P3[1]); A.r(x + 3, wy + 2, cab - 8, 6, PAL.blue[3]); A.px(x + 5, wy + 3, PAL.blue[0]);
    A.r(x, wy + 12, cab, 3, P3[2]); A.r(x, wy + 9, 2, 3, PAL.gold[0]);
    for (const tx of [x + 8, x + w - 20, x + w - 34]) { A.ell(tx + 5, wy + 17, 5, 4, PAL.dark[3]); A.ell(tx + 5, wy + 17, 2, 1, PAL.metal[1]); }
    return st;
}
SPR_L['supply truck'] = (w, d) => fit(truck(w, d, PAL.blue, PAL.canvas));
SPR_L['ministry vehicle'] = (w, d) => fit(car(w, d, PAL.white));
function car(w, d, P3) {
    const st = stage(w, d, 12), { A } = st, x = st.x, top = st.y - 10;
    A.r(x + 2, top, w - 4, d, P3[1]); A.r(x + Math.round(w * 0.25), top + 3, Math.round(w * 0.5), d - 6, P3[0]);     // roof
    A.r(x + Math.round(w * 0.22), top + 3, 3, d - 6, PAL.blue[3]); A.r(x + Math.round(w * 0.75), top + 3, 3, d - 6, PAL.blue[3]);   // glass, front and back
    const wy = top + d;
    A.r(x, wy, w, 10, P3[1]); A.r(x, wy + 7, w, 3, P3[3] || P3[2]);
    A.r(x + Math.round(w * 0.3), wy + 1, Math.round(w * 0.4), 4, PAL.blue[3]);
    A.r(x, wy + 3, 2, 3, PAL.gold[0]); A.r(x + w - 2, wy + 3, 2, 3, PAL.red[1]);
    for (const tx of [x + 7, x + w - 17]) { A.ell(tx + 5, wy + 10, 5, 4, PAL.dark[3]); A.ell(tx + 5, wy + 10, 2, 1, PAL.metal[1]); }
    return st;
}
SPR.inspector = (w, d) => fit(car(w, d, PAL.dark));          // the black car
SPR.ow_wreck = (w, d) => {                                   // the wrecked Land Rover: rust, no wheels, sand to the sills
    const st = car(Math.min(w, 76), Math.min(d, 40), [PAL.brick[0], PAL.red[3], PAL.dark[1], PAL.dark[2]]), { A } = st;
    A.ell(st.x + 20, st.base - 2, 22, 5, PAL.sand[1]); A.ell(st.x + st.w - 14, st.base - 1, 16, 4, PAL.sand[2]);
    return Object.assign(fit(st), { ox: Math.round((w - st.c.width) / 2) });
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
function crateAt(A, x, y, s, kind) {
    const P = kind === 1 ? PAL.plank : PAL.wood, h = Math.round(s * 0.55), t = Math.round(s * 0.5);
    A.r(x, y, s, t, P[0]); A.r(x, y, s, 1, PAL.canvas[0]); A.r(x + 1, y + 1, s - 2, t - 2, kind === 1 ? PAL.plank[0] : PAL.plank[1]);
    for (let i = 3; i < s; i += 4) A.vl(x + i, y + 1, t - 2, P[1]);
    A.r(x, y + t, s, h, P[1]); A.r(x, y + t, s, 1, P[2]); A.r(x, y + t + h - 1, s, 1, P[2]);
    A.vl(x, y + t, h, P[2]); A.vl(x + s - 1, y + t, h, P[2]);
    A.line(x + 1, y + t + 1, x + s - 2, y + t + h - 2, P[2]);
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
function drum(A, x, y, P3, lying) {
    if (lying) { A.r(x, y + 3, 20, 11, P3[1]); A.r(x, y + 3, 20, 3, P3[0]); A.r(x, y + 11, 20, 3, P3[2]); A.ell(x, y + 8, 2, 5, P3[2]); A.ell(x + 20, y + 8, 2, 5, P3[0]); A.vl(x + 7, y + 3, 11, P3[2]); A.vl(x + 13, y + 3, 11, P3[2]); return; }
    A.r(x, y + 3, 12, 15, P3[1]); A.ell(x + 6, y + 18, 6, 2, P3[2]); A.ell(x + 6, y + 3, 6, 2, P3[0]); A.ell(x + 6, y + 3, 4, 1, P3[1]);
    A.hl(x, y + 8, 12, P3[2]); A.hl(x, y + 13, 12, P3[2]); A.vl(x + 1, y + 4, 13, P3[0]); A.vl(x + 10, y + 5, 13, P3[2]);
}
SPR_L['water barrels'] = (w, d) => { const st = propStage(w, d, 50, 36), { A } = st; for (const i of [0, 1, 2]) drum(A, st.x + 2 + i * 15, st.y, PAL.blue); drum(A, st.x + 12, st.y + 18, PAL.blue, true); A.r(st.x + 10, st.y + 32, 4, 3, PAL.wood[2]); A.r(st.x + 30, st.y + 32, 4, 3, PAL.wood[2]); A.r(st.x + 33, st.y + 25, 3, 2, PAL.metal[1]); return propFit(st, w, d, { solid: [w / 2 - 24, d - 22, 48, 20] }); };
SPR_L['fuel drums'] = (w, d) => { const st = propStage(w, d, 50, 34), { A } = st; drum(A, st.x + 2, st.y, PAL.red); drum(A, st.x + 17, st.y + 2, PAL.dark); drum(A, st.x + 32, st.y, PAL.red); drum(A, st.x + 14, st.y + 18, PAL.blue, true); return propFit(st, w, d, { solid: [w / 2 - 24, d - 20, 48, 18] }); };
SPR_L['oil drum'] = (w, d) => { const st = propStage(w, d, 14, 22), { A } = st; drum(A, st.x, st.y, [PAL.brick[1], PAL.red[3], PAL.dark[1]]); return propFit(st, w, d, { solid: [w / 2 - 6, d - 8, 12, 8] }); };
SPR_L['sandbags'] = (w, d) => { const n = Math.max(2, Math.round(w / 14)), st = propStage(w, d, n * 13 + 2, 22), { A } = st; for (let r = 0; r < 2; r++) for (let i = 0; i < n - r; i++) { const x = st.x + i * 13 + r * 6, y = st.y + 10 - r * 8; A.ell(x + 6, y + 5, 6, 4, PAL.canvas[2]); A.ell(x + 5, y + 4, 4, 2, PAL.canvas[1]); A.px(x + 11, y + 5, PAL.canvas[3]); } return propFit(st, w, d, { solid: [0, d - 12, w, 12] }); };
SPR_L['tool box'] = (w, d) => { const st = propStage(w, d, 18, 14), { A } = st; A.r(st.x, st.y + 2, 16, 5, PAL.red[0]); A.r(st.x, st.y + 7, 16, 7, PAL.red[1]); A.r(st.x, st.y + 7, 16, 1, PAL.red[3]); A.r(st.x + 5, st.y, 6, 2, PAL.metal[2]); A.r(st.x + 7, st.y + 9, 2, 2, PAL.gold[1]); return propFit(st, w, d); };
SPR_L['tin bucket'] = (w, d) => { const st = propStage(w, d, 12, 14), { A } = st; A.poly([[st.x + 1, st.y + 3], [st.x + 10, st.y + 3], [st.x + 9, st.y + 13], [st.x + 2, st.y + 13]], PAL.metal[1]); A.ell(st.x + 5, st.y + 3, 5, 2, PAL.metal[3]); A.ell(st.x + 5, st.y + 3, 3, 1, PAL.blue[2]); A.vl(st.x + 2, st.y + 5, 8, PAL.metal[0]); return propFit(st, w, d); };
SPR_L['rope coil'] = (w, d) => { const st = propStage(w, d, 18, 12), { A } = st; A.ell(st.x + 8, st.y + 6, 8, 5, PAL.canvas[2]); A.ell(st.x + 8, st.y + 5, 6, 3, PAL.canvas[1]); A.ell(st.x + 8, st.y + 5, 3, 1, PAL.canvas[3]); return propFit(st, w, d, { flat: true }); };
SPR_L['rock pile'] = (w, d, o) => rocks(w, d, o.id, 3);
SPR_L['boulder'] = (w, d, o) => rocks(w, d, o.id, 1, 14);
SPR_L['big boulder'] = (w, d, o) => rocks(w, d, o.id, 1, 22);
function rockAt(A, cx, cy, r, R) {
    const ry = Math.round(r * 0.72);
    A.ell(cx, cy, r, ry, PAL.rock[2]); A.ell(cx - Math.round(r * 0.2), cy - Math.round(ry * 0.3), Math.round(r * 0.7), Math.round(ry * 0.6), PAL.rock[1]);
    A.ell(cx - Math.round(r * 0.35), cy - Math.round(ry * 0.5), Math.round(r * 0.35), Math.round(ry * 0.3), PAL.rock[0]);
    A.r(cx - r + 2, cy + ry - 2, r * 2 - 4, 2, PAL.rock[3]);
    if (r > 8) A.line(cx + 1, cy - 2, cx + Math.round(r * 0.5), cy + Math.round(ry * 0.6), PAL.rock[3]);
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
SPR_L['spoil mound'] = SPR.ow_spoil = (w, d, o) => {
    const st = stage(w, d, 10), { A } = st, cx = st.x + (w >> 1), cy = st.y + (d >> 1);
    A.ell(cx, cy + 2, (w >> 1) - 1, (d >> 1) - 1, PAL.sand[3]); A.ell(cx - 3, cy - 3, Math.round(w * 0.36), Math.round(d * 0.3), PAL.sand[2]);
    A.ell(cx - 6, cy - 7, Math.round(w * 0.2), Math.round(d * 0.16), PAL.sand[1]);
    const R = rng(o.id); for (let i = 0; i < 14; i++) A.px(cx + (R() - 0.5) * w * 0.7, cy + (R() - 0.3) * d * 0.5, PAL.rock[2]);
    return Object.assign(fit(st), { c: st.c });                    // no outline: it's a heap of the ground itself
};
SPR_L['survey stake'] = SPR_L["sam's survey stake"] = (w, d) => { const st = propStage(w, d, 8, 18), { A } = st; A.r(st.x + 2, st.y + 3, 2, 14, PAL.plank[0]); A.r(st.x + 2, st.y, 2, 5, PAL.red[1]); A.r(st.x + 4, st.y + 1, 3, 3, PAL.red[0]); return propFit(st, w, d); };
function lampPost(w, d, tall, col) {
    const h = tall ? 34 : 22, st = propStage(w, d, 14, h + 2), { A } = st, cx = st.x + 5;
    A.r(cx, st.y + 6, 2, h - 6, PAL.wood[2]); A.r(cx - 2, st.y + h - 2, 6, 2, PAL.wood[3]);
    A.r(cx - 2, st.y + 1, 6, 7, PAL.gold[0]); A.r(cx - 3, st.y, 8, 2, PAL.dark[1]); A.r(cx - 2, st.y + 8, 6, 1, PAL.dark[1]); A.px(cx, st.y + 4, PAL.white[0]);
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
SPR_L['scaffolding'] = SPR.d_scaff = (w, d) => {
    const st = stage(w, d, 40), { A } = st, x = st.x, top = st.y - 38;
    for (let i = 0; i <= w - 2; i += Math.max(16, Math.round((w - 2) / 3))) A.r(x + i, top, 2, 38 + d, PAL.metal[2]);
    for (const y of [top + 4, top + 22]) { A.r(x, y, w, 2, PAL.metal[3]); A.r(x, y + 2, w, 4, PAL.plank[1]); A.r(x, y + 5, w, 1, PAL.plank[2]); }
    A.line(x, top + 8, x + w - 2, top + 22, PAL.metal[3]); A.line(x + w - 2, top + 26, x, top + 38 + d, PAL.metal[3]);
    return fit(st);
};
SPR_L['cooking table'] = SPR_L['equipment table'] = (w, d) => {
    const L = Math.max(30, w), st = stage(L, 14, 12), { A } = st, x = st.x, top = st.y - 8;
    A.r(x, top, L, 12, PAL.plank[0]); for (let i = 0; i < L; i += 14) A.vl(x + i, top, 12, PAL.plank[1]); A.r(x, top + 12, L, 3, PAL.plank[2]);
    for (const lx of [x + 2, x + L - 4]) A.r(lx, top + 15, 2, 8, PAL.wood[3]);
    // things on it
    const R = rng('tbl' + w);
    for (let i = 8; i < L - 10; i += 16) { const k = R(); if (k < 0.3) { A.ell(x + i + 3, top + 5, 4, 2, PAL.metal[1]); A.ell(x + i + 3, top + 4, 2, 1, PAL.metal[3]); } else if (k < 0.6) A.r(x + i, top + 3, 7, 5, PAL.white[0]); else if (k < 0.8) { A.r(x + i, top + 2, 4, 6, PAL.brick[1]); A.r(x + i, top + 2, 4, 1, PAL.brick[3]); } }
    return Object.assign(fit(st), { oy: Math.round(d - st.c.height + 1) });
};
SPR.fl_cooking = () => null;                                       // (same spot as the long cooking table)
SPR.generator = (w, d) => { const st = propStage(w, d, 34, 26), { A } = st; A.r(st.x, st.y + 2, 32, 10, PAL.gold[1]); A.r(st.x, st.y + 12, 32, 10, PAL.gold[2]); A.r(st.x, st.y + 12, 32, 1, PAL.gold[3]); for (let i = 3; i < 16; i += 3) A.vl(st.x + i, st.y + 14, 6, PAL.dark[2]); A.r(st.x + 20, st.y + 14, 8, 5, PAL.dark[2]); A.r(st.x + 24, st.y - 0, 3, 5, PAL.dark[1]); A.r(st.x + 2, st.y + 22, 4, 2, PAL.dark[3]); A.r(st.x + 26, st.y + 22, 4, 2, PAL.dark[3]); return propFit(st, w, d, { solid: [w / 2 - 16, d - 14, 32, 14] }); };
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
SPR.ow_well = (w, d) => { const st = propStage(w, d, 40, 44), { A } = st, cx = st.x + 19; A.r(st.x + 3, st.y + 4, 2, 30, PAL.wood[2]); A.r(st.x + 33, st.y + 4, 2, 30, PAL.wood[2]); A.r(st.x + 1, st.y + 2, 36, 3, PAL.wood[1]); A.r(cx, st.y + 5, 1, 12, PAL.canvas[3]); A.r(cx - 2, st.y + 16, 5, 5, PAL.metal[2]); A.ell(cx, st.y + 28, 14, 7, PAL.rock[1]); A.ell(cx, st.y + 27, 10, 4, PAL.dark[3]); A.ell(cx, st.y + 28, 7, 2, PAL.blue[3]); A.r(cx - 14, st.y + 28, 29, 10, PAL.rock[2]); A.ell(cx, st.y + 38, 14, 4, PAL.rock[3]); for (let i = -12; i < 14; i += 6) A.vl(cx + i, st.y + 30, 8, PAL.rock[3]); return propFit(st, w, d, { solid: [w / 2 - 16, d - 16, 32, 14] }); };
SPR.ow_lookout = (w, d) => { const st = propStage(w, d, 22, 28), { A } = st, R = rng('cairn'); for (let j = 0; j < 5; j++) { const ww = 18 - j * 3; A.ell(st.x + 10, st.y + 24 - j * 5, ww >> 1, 3, PAL.rock[j & 1 ? 1 : 2]); A.ell(st.x + 9, st.y + 23 - j * 5, (ww >> 1) - 2, 1, PAL.rock[0]); } return propFit(st, w, d, { solid: [w / 2 - 9, d - 8, 18, 8] }); };
SPR.ow_bones = (w, d) => { const st = propStage(w, d, 40, 20), { A } = st; for (let i = 0; i < 6; i++) { A.line(st.x + 8 + i * 4, st.y + 14, st.x + 9 + i * 4, st.y + 5, PAL.white[1]); A.line(st.x + 9 + i * 4, st.y + 5, st.x + 12 + i * 4, st.y + 4, PAL.white[1]); } A.r(st.x + 6, st.y + 14, 26, 2, PAL.white[0]); A.ell(st.x + 35, st.y + 11, 4, 3, PAL.white[0]); A.px(st.x + 36, st.y + 10, PAL.dark[3]); return propFit(st, w, d, { flat: true }); };
SPR.ow_oasis = () => null;                                           // the pool is painted into the ground; its palms are trees
SPR.ow_ruin_note = (w, d) => { const st = propStage(w, d, 36, 14), { A } = st; A.r(st.x, st.y + 3, 34, 6, PAL.rock[0]); A.r(st.x, st.y + 9, 34, 4, PAL.rock[2]); for (let i = 3; i < 32; i += 5) A.r(st.x + i, st.y + 5, 2, 2, PAL.rock[3]); A.line(st.x + 20, st.y + 3, st.x + 23, st.y + 12, PAL.rock[3]); return propFit(st, w, d, { solid: [w / 2 - 16, d - 6, 32, 6] }); };
SPR.c1p_falsedoor = (w, d) => { const st = propStage(w, d, 28, 34), { A } = st; A.r(st.x, st.y, 26, 32, PAL.rock[1]); A.r(st.x, st.y, 26, 3, PAL.rock[0]); A.r(st.x + 4, st.y + 6, 18, 26, PAL.rock[2]); A.r(st.x + 8, st.y + 10, 10, 22, PAL.rock[3]); A.r(st.x + 11, st.y + 14, 4, 18, PAL.dark[3]); for (let j = 8; j < 30; j += 4) { A.px(st.x + 5, st.y + j, PAL.rock[3]); A.px(st.x + 20, st.y + j, PAL.rock[3]); } return propFit(st, w, d, { solid: [w / 2 - 13, d - 6, 26, 6] }); };
SPR.c1p_looterpit = (w, d) => { const st = propStage(w, d, 40, 26), { A } = st; A.ell(st.x + 19, st.y + 13, 19, 11, PAL.sand[3]); A.ell(st.x + 19, st.y + 13, 13, 7, PAL.dirt[2]); A.ell(st.x + 19, st.y + 15, 9, 4, PAL.dirt[3]); A.line(st.x + 30, st.y + 4, st.x + 36, st.y + 16, PAL.wood[1]); return Object.assign(propFit(st, w, d, { flat: true }), { c: st.c }); };
SPR.c1a_mason = (w, d) => { const st = propStage(w, d, 30, 22), { A } = st; A.r(st.x, st.y, 28, 12, PAL.rock[0]); A.r(st.x, st.y + 12, 28, 9, PAL.rock[2]); for (const [mx, my] of [[5, 14], [11, 15], [17, 14], [22, 16]]) { A.r(st.x + mx, st.y + my, 3, 1, PAL.red[2]); A.r(st.x + mx + 1, st.y + my - 1, 1, 4, PAL.red[2]); } return propFit(st, w, d, { solid: [w / 2 - 14, d - 8, 28, 8] }); };
SPR.c1p_pavement = (w, d, o) => { const st = stage(w, d, 0), { A } = st, R = rng('pave'); for (let i = 0; i < 40; i++) { const x = st.x + R() * (w - 20), y = st.y + R() * (d - 12), ww = 10 + R() * 16; A.ell(x + ww / 2, y + 5, ww / 2, 4, PAL.rock[R() < 0.5 ? 0 : 1]); if (R() < 0.4) A.ell(x + ww / 2, y + 5, 2, 1, PAL.rock[2]); } return Object.assign(fit(st), { c: st.c, flat: true }); };
function smallFind(col) { return (w, d) => { const st = propStage(w, d, 10, 8), { A } = st; A.ell(st.x + 4, st.y + 4, 4, 2, col[1]); A.px(st.x + 3, st.y + 3, col[0]); A.px(st.x + 6, st.y + 5, col[2]); return Object.assign(propFit(st, w, d, { flat: true }), { sparkle: true }); }; }
SPR_L['painted sherd'] = smallFind(PAL.brick);
SPR_L['fossil'] = smallFind(PAL.white);
SPR_L['something buried'] = (w, d) => { const st = propStage(w, d, 14, 8), { A } = st; A.ell(st.x + 6, st.y + 4, 6, 3, PAL.sand[3]); A.ell(st.x + 6, st.y + 3, 4, 1, PAL.sand[1]); return Object.assign(propFit(st, w, d, { flat: true }), { c: st.c }); };
SPR_L['broken clay pot'] = (w, d) => { const st = propStage(w, d, 14, 12), { A } = st; A.ell(st.x + 6, st.y + 7, 5, 4, PAL.brick[1]); A.ell(st.x + 6, st.y + 4, 4, 2, PAL.dark[3]); A.poly([[st.x + 2, st.y + 3], [st.x + 5, st.y + 1], [st.x + 7, st.y + 4]], PAL.brick[0]); A.px(st.x + 12, st.y + 10, PAL.brick[2]); return propFit(st, w, d); };
SPR_L['driftwood'] = (w, d) => { const st = propStage(w, d, 30, 10), { A } = st; A.line(st.x, st.y + 6, st.x + 28, st.y + 3, PAL.wood[0]); A.line(st.x, st.y + 7, st.x + 28, st.y + 4, PAL.wood[2]); A.line(st.x + 12, st.y + 5, st.x + 17, st.y, PAL.wood[1]); return propFit(st, w, d, { flat: true }); };
SPR.c1a_finds = (w, d) => { const st = propStage(w, d, 30, 14), { A } = st; A.r(st.x + 2, st.y + 6, 24, 6, PAL.white[0]); A.r(st.x + 5, st.y + 1, 4, 8, PAL.rock[0]); A.r(st.x + 5, st.y + 1, 4, 3, PAL.dark[2]); A.r(st.x + 13, st.y + 8, 6, 2, PAL.wood[1]); A.ell(st.x + 22, st.y + 8, 3, 2, PAL.brick[2]); return Object.assign(propFit(st, w, d), { oy: Math.round(d - 30) }); };
SPR.c1m_kitchen = (w, d) => { const st = propStage(w, d, 60, 36), { A } = st; A.r(st.x + 6, st.y + 14, 48, 20, PAL.red[2]); A.dith(st.x + 6, st.y + 14, 48, 20, PAL.red[3], 0); for (let j = 17; j < 34; j += 6) A.r(st.x + 6, st.y + j, 48, 1, PAL.gold[1]); A.r(st.x + 6, st.y + 14, 48, 1, PAL.blue[2]); A.r(st.x + 10, st.y + 4, 16, 6, PAL.olive[1]); A.r(st.x + 10, st.y + 4, 16, 2, PAL.dark[2]); A.r(st.x + 11, st.y + 10, 1, 9, PAL.metal[2]); A.r(st.x + 24, st.y + 10, 1, 9, PAL.metal[2]); drum(A, st.x + 30, st.y + 8, PAL.blue); A.r(st.x + 40, st.y + 18, 14, 5, PAL.white[0]); A.r(st.x + 40, st.y + 23, 14, 6, PAL.red[1]); A.r(st.x + 14, st.y + 24, 3, 3, PAL.white[0]); A.r(st.x + 19, st.y + 25, 3, 3, PAL.white[0]); return propFit(st, w, d, { solid: [w / 2 - 22, d - 18, 50, 12] }); };
SPR.c1m_toolrack = (w, d) => { const st = propStage(w, d, 64, 40), { A } = st; A.r(st.x + 2, st.y + 4, 3, 34, PAL.wood[2]); A.r(st.x + 58, st.y + 4, 3, 34, PAL.wood[2]); A.r(st.x, st.y + 8, 63, 3, PAL.wood[1]); for (let i = 0; i < 5; i++) { const x = st.x + 9 + i * 10; A.line(x + 2, st.y + 5, x, st.y + 36, PAL.plank[0]); if (i % 2) { A.r(x - 3, st.y + 4, 9, 2, PAL.metal[3]); } else { A.poly([[x - 2, st.y + 30], [x + 3, st.y + 30], [x + 2, st.y + 38], [x - 1, st.y + 38]], PAL.metal[1]); } } crateAt(A, st.x + 44, st.y + 22, 14, 1); return propFit(st, w, d, { solid: [w / 2 - 30, d - 10, 60, 10] }); };
SPR.c1m_trenchkit = (w, d) => { const st = propStage(w, d, 44, 28), { A } = st; A.poly([[st.x + 6, st.y + 8], [st.x + 30, st.y + 8], [st.x + 26, st.y + 18], [st.x + 10, st.y + 18]], PAL.metal[2]); A.r(st.x + 6, st.y + 7, 25, 2, PAL.metal[0]); A.ell(st.x + 18, st.y + 9, 9, 2, PAL.sand[3]); A.line(st.x + 28, st.y + 14, st.x + 42, st.y + 10, PAL.wood[1]); A.ell(st.x + 10, st.y + 22, 4, 4, PAL.dark[3]); A.px(st.x + 10, st.y + 22, PAL.metal[1]); A.r(st.x + 26, st.y + 18, 2, 7, PAL.metal[3]); return propFit(st, w, d, { solid: [w / 2 - 16, d - 10, 32, 10] }); };
SPR_L['vegetable crates'] = (w, d, o) => { const st = propStage(w, d, 38, 26), { A } = st, cols = [PAL.red[1], PAL.gold[1], PAL.green[1]]; [[2, 12], [20, 14], [10, 2]].forEach(([x, y], i) => { A.r(st.x + x, st.y + y, 16, 5, PAL.plank[2]); for (let k = 1; k < 15; k += 3) A.ell(st.x + x + k + 1, st.y + y + 2, 1, 1, cols[(i + (o.id.endsWith('2') ? 1 : 0)) % 3]); A.r(st.x + x, st.y + y + 5, 16, 6, PAL.plank[1]); A.hl(st.x + x, st.y + y + 8, 16, PAL.plank[2]); }); return propFit(st, w, d, { solid: [w / 2 - 18, d - 12, 36, 12] }); };
SPR.c1c_milcrates = (w, d) => { const st = propStage(w, d, 34, 26), { A } = st; for (const [x, y] of [[0, 12], [16, 14], [6, 2]]) { A.r(st.x + x, st.y + y, 16, 5, PAL.olive[1]); A.r(st.x + x, st.y + y + 5, 16, 7, PAL.olive[2]); A.r(st.x + x, st.y + y + 5, 16, 1, PAL.olive[3]); A.r(st.x + x + 6, st.y + y + 7, 4, 2, PAL.gold[1]); } return propFit(st, w, d, { solid: [w / 2 - 16, d - 12, 32, 12] }); };
// the dig zone gate: two chain-link leaves, a red sign
// the dig zone gate, standing open: a leaf swung back on each post, the warning sign beside it
SPR.dig_gate = (w, d) => {
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
};
SPR.puzzle_glyph = SPR.tunnel_mouth = (w, d, o) => { const st = propStage(w, d, 40, 44), { A } = st; A.r(st.x, st.y, 38, 42, PAL.rock[2]); A.r(st.x, st.y, 38, 4, PAL.rock[0]); A.r(st.x + 6, st.y + 8, 26, 34, PAL.rock[3]); A.r(st.x + 9, st.y + 11, 20, 31, o.id === 'tunnel_mouth' ? PAL.dark[3] : PAL.rock[1]); if (o.id !== 'tunnel_mouth') for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) A.r(st.x + 12 + i * 6, st.y + 14 + j * 7, 3, 4, PAL.gold[2]); return propFit(st, w, d); };

// ---- PLANTS ----
function palm(seed) {
    const R = rng(seed), [c, g] = mk(66, 84), A = pa(g), lean = Math.round((R() - 0.5) * 10), tx = 33, ty = 80;
    for (let j = 0; j < 52; j++) {                                // the trunk, ringed, leaning a little
        const x = tx + Math.round(lean * (j / 52) * (j / 52)) - 2, y = ty - j;
        A.r(x, y, 5, 1, PAL.wood[1]); A.px(x, y, PAL.wood[0]); A.px(x + 4, y, PAL.wood[3]);
        if (j % 4 === 0) A.r(x, y, 5, 1, PAL.wood[2]);
    }
    A.r(tx - 3, ty - 1, 7, 2, PAL.wood[2]);
    const hx = tx + lean, hy = ty - 52;
    const frond = (ang, len, droop, col, col2) => {
        let px = hx, py = hy;
        for (let t = 1; t <= len; t++) {
            const k = t / len, nx = hx + Math.cos(ang) * t, ny = hy + Math.sin(ang) * t * 0.62 + droop * k * k;
            A.line(px, py, nx, ny, col);
            if (t % 2 === 0 && t > 3) { const lw = Math.round((1 - Math.abs(k - 0.5) * 1.4) * 6) + 1; A.line(nx, ny, nx - Math.sin(ang) * lw * 0.4, ny + lw, col2); A.line(nx, ny, nx + Math.sin(ang) * lw * 0.4, ny - lw * 0.45, col); }
            px = nx; py = ny;
        }
    };
    const n = 9;
    for (let i = 0; i < n; i++) frond(Math.PI + (i / (n - 1)) * Math.PI + (R() - 0.5) * 0.25, 22 + R() * 7, 8 + R() * 8, PAL.green[3], PAL.green[2]);   // the back row, dark
    for (let i = 0; i < n; i++) frond((i / n) * Math.PI * 2 + R() * 0.4, 20 + R() * 8, 12 + R() * 10, PAL.green[1], PAL.green[2]);
    for (let i = 0; i < 5; i++) frond(-Math.PI * 0.9 + i * 0.4 + R() * 0.2, 14 + R() * 5, 3, PAL.green[0], PAL.green[1]);
    A.ell(hx - 2, hy + 3, 2, 2, PAL.gold[2]); A.ell(hx + 3, hy + 4, 2, 2, PAL.brick[2]);      // dates
    return { c: outline(c), ox: -33, oy: -81, solid: [-4, -4, 8, 5] };
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
