// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE CAMP MAP (poke/camp.js)
// Chapter 1's camp, laid out fresh on a tile grid the way a DS town is:
// compact, every place a short walk from the next, roads you can follow,
// a rock plateau and palms all round the edge. Everything from the 3D
// chapter is here, and what each thing says still comes from the story
// (poke/map_ch1.js), looked up by its id.
//
//   campLayout()  → { W, H, tile: Uint8Array, things, trees, places, doors, spawn }
//   CampGround    → paints the tiles, crisp: flat colours, hard edges
// ============================================================

const T = { SAND: 0, PATH: 1, ROCK: 2, WATER: 3, DIG: 4, STONE: 5, RAIL: 6, GRAVEL: 7 };
const SOLID_TILE = { [T.ROCK]: 1, [T.WATER]: 1 };

function campLayout() {
    const W = 78, H = 58, tile = new Uint8Array(W * H);
    const set = (x, y, t) => { if (x >= 0 && y >= 0 && x < W && y < H) tile[y * W + x] = t; };
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? T.ROCK : tile[y * W + x];
    const rect = (x, y, w, h, t) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, t); };
    // a path from point to point, `r` tiles wide, with a little wander
    const path = (pts, r, t) => {
        for (let k = 0; k + 1 < pts.length; k++) {
            const [ax, ay] = pts[k], [bx, by] = pts[k + 1], n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)) * 2;
            for (let s = 0; s <= n; s++) {
                const x = ax + (bx - ax) * s / n, y = ay + (by - ay) * s / n;
                for (let j = 0; j <= r; j++) for (let i = 0; i <= r; i++) set(Math.round(x + i), Math.round(y + j), t);
            }
        }
    };
    // ---- the edge: a rock plateau all round (the map's wall), wider at the north as the escarpment ----
    const R = rng('camp-edge');
    for (let x = 0; x < W; x++) {
        const top = x > 14 && x < 64 ? 7 : 6 + Math.round(Math.sin(x * 0.3) * 1 + R() * 1.2), bot = 3 + Math.round(R() * 1.5 + Math.sin(x * 0.25));
        rect(x, 0, 1, top, T.ROCK); rect(x, H - bot, 1, bot, T.ROCK);
    }
    for (let y = 0; y < H; y++) { const l = 3 + Math.round(R() * 1.5 + Math.sin(y * 0.3)), r = 3 + Math.round(R() * 1.5 + Math.cos(y * 0.27)); rect(0, y, l, 1, T.ROCK); rect(W - r, y, r, 1, T.ROCK); }
    rect(37, H - 6, 4, 6, T.SAND);                                         // the road out, south

    // ---- roads: straight runs, the way a town's are laid ----
    path([[39, H - 1], [39, 18]], 1, T.PATH);                                   // the main road: the way in → director's camp → the dig gate
    path([[39, 9], [39, 18]], 1, T.PATH);                                       // inside the dig zone, up to the shaft
    path([[14, 34], [39, 34]], 1, T.PATH);                                      // west to the workers' camp
    path([[39, 37], [64, 37]], 1, T.PATH); path([[64, 26], [64, 37]], 1, T.PATH);   // east, then up to trench A
    path([[39, 44], [57, 44]], 1, T.PATH);                                      // to the guard post
    path([[14, 19], [14, 34]], 0, T.PATH); path([[9, 19], [14, 19]], 0, T.PATH);    // a footpath to the oasis
    path([[39, 49], [47, 49]], 0, T.PATH);                                      // to the sheikh's tomb
    path([[14, 34], [14, 46]], 0, T.PATH); path([[14, 46], [21, 46]], 0, T.PATH);   // south-west: the rail halt, the cemetery

    // ---- the oasis ----
    rect(5, 13, 6, 4, T.WATER); rect(6, 12, 4, 1, T.WATER); rect(6, 17, 4, 1, T.WATER); rect(4, 14, 1, 2, T.WATER); rect(11, 14, 1, 2, T.WATER);
    // ---- trench A (open, walk down into it) and the planks across ----
    rect(66, 16, 4, 12, T.DIG);
    // ---- bedrock showing through, the fossil pavement ----
    rect(52, 38, 5, 3, T.STONE); rect(53, 37, 3, 1, T.STONE);
    rect(24, 8, 3, 2, T.STONE);
    // ---- the wadi: a gravel bed running down the east ----
    path([[58, 8], [60, 16], [58, 24], [60, 30]], 1, T.GRAVEL);
    // ---- the supply line: rails from the west edge to a halt ----
    for (let x = 3; x < 30; x++) set(x, 44, T.RAIL);
    for (let y = 40; y < 45; y++) set(29, y, T.RAIL);
    for (let x = 29; x < 34; x++) set(x, 40, T.RAIL);

    // ---- things, by the story's ids: [id, tile x, tile y, tiles wide, tiles deep] ----
    const things = [
        // the director's camp
        ['tent_bldg', 33, 24, 7, 3], ['c1m_hanatent', 44, 21, 4, 4], ['d_gearstor', 43, 27, 6, 2], ['d_equiptbl', 42, 31, 4, 1], ['c1a_finds', 42, 31, 2, 1],
        ['c1m_mess', 24, 20, 6, 3], ['c1m_kitchen', 29, 29, 3, 2], ['d_lantern1', 31, 27, 1, 1], ['d_lantern2', 40, 27, 1, 1], ['satphone', 47, 25, 1, 1], ['ow_detector', 47, 32, 1, 1],
        ['c1a_hana', 44, 30, 1, 1], ['c1a_lena', 36, 28, 1, 1], ['c1a_lenaman1', 32, 28, 1, 1], ['c1a_lenaman2', 41, 26, 1, 1],
        // the workers' camp
        ['dorm_bldg', 5, 24, 8, 3], ['foreman_bldg', 15, 24, 7, 3], ['water_barrels', 23, 25, 2, 2], ['camp_darts', 7, 28, 1, 1], ['camp_radio', 4, 30, 1, 1],
        ['d_cooking', 8, 31, 5, 1], ['c1c_veg1', 6, 32, 2, 1], ['c1c_veg2', 16, 32, 2, 1], ['rest_brazier', 14, 36, 1, 1], ['ow_tea', 12, 37, 1, 1], ['camp_dog', 16, 37, 1, 1],
        ['d_crates1', 5, 36, 2, 2], ['fl_crates', 5, 36, 2, 2], ['tariq_talk', 18, 36, 1, 1], ['c1a_saber', 11, 38, 1, 1], ['d_lantern3', 9, 28, 1, 1], ['d_lantern4', 17, 28, 1, 1],
        // the dig zone, under the escarpment
        ['fl_digshed', 17, 10, 6, 3], ['fl_toolshed', 52, 10, 5, 3], ['c1m_toolrack', 24, 14, 3, 1], ['fl_spoil', 45, 12, 3, 2], ['ow_spoil', 49, 15, 3, 2],
        ['ow_sieve', 43, 15, 1, 1], ['dig_gate', 36, 18, 5, 1], ['puzzle_glyph', 33, 6, 1, 1], ['tunnel_mouth', 39, 6, 2, 1], ['c1a_mason', 26, 9, 1, 1],
        // trench A, and Lindqvist's trailer beside it
        ['trench', 66, 16, 4, 12], ['c1a_lindqvist', 63, 21, 1, 1], ['c1m_trenchkit', 71, 18, 2, 2], ['generator', 61, 26, 2, 1], ['fl_fuel_drums', 70, 27, 2, 1],
        // the old ministry post and the guard booth, on the road in
        ['fl_guard_booth', 44, 47, 3, 2], ['c1a_farouk', 43, 50, 1, 1], ['c1m_farouk_radio', 42, 50, 1, 1], ['inspector', 50, 49, 3, 2], ['c1c_milcrates', 56, 42, 2, 1],
        // the supply line
        ['carts', 8, 43, 5, 1], ['c1a_hamid', 17, 46, 1, 1],
        // further out
        ['ow_oasis', 5, 12, 7, 6], ['ow_well', 13, 17, 2, 2], ['ow_ruins', 20, 41, 6, 3], ['ow_ruin_note', 22, 45, 1, 1], ['c1p_cemetery', 22, 49, 7, 3], ['c1p_falsedoor', 25, 48, 1, 1], ['c1p_looterpit', 29, 51, 1, 1],
        ['c1p_maqam', 48, 50, 3, 3], ['c1p_oldwoman', 47, 53, 1, 1], ['ow_shelter', 67, 36, 5, 2], ['c1p_tower', 70, 9, 2, 2], ['ow_lookout', 66, 11, 1, 1],
        ['c1p_ramp', 44, 8, 6, 1], ['fl_ministry_post', 57, 43, 7, 3], ['fl_trailer', 59, 17, 5, 3], ['fl_scaffold', 71, 23, 2, 2], ['fl_gate_post', 36, 53, 1, 1],
        ['fl_stake_sam', 34, 16, 1, 1], ['sams_gear', 56, 21, 1, 1], ['perimeter', 51, 9, 1, 1], ['fl_sand_east', 72, 30, 1, 1], ['fl_stars', 34, 38, 1, 1], ['fl_ruins', 19, 42, 1, 1],
        ['fl_boulder', 61, 37, 2, 1], ['fl_cactus', 30, 20, 1, 1], ['fl_palm', 27, 31, 1, 1], ['fl_cooking', 11, 31, 2, 1], ['c1m_mess_in', 26, 23, 3, 1],
        ['d_truck1', 31, 41, 5, 2], ['d_truck2', 56, 50, 5, 2], ['d_min1', 64, 43, 4, 2], ['d_min2', 64, 47, 3, 2],
        ['d_spoil2', 29, 11, 2, 1], ['d_spoil3', 51, 17, 2, 1], ['d_stake1', 30, 14, 1, 1], ['d_stake2', 33, 12, 1, 1], ['d_stake3', 42, 12, 1, 1],
        ['d_cact1', 27, 38, 1, 1], ['d_cact2', 45, 42, 1, 1], ['d_cact3', 62, 30, 1, 1], ['d_cact4', 8, 40, 1, 1], ['d_cact5', 33, 50, 1, 1], ['d_cact6', 71, 47, 1, 1], ['d_cact7', 55, 26, 1, 1], ['d_cact8', 21, 18, 1, 1], ['d_cact9', 14, 50, 1, 1],
        ['d_bould1', 20, 16, 1, 1], ['d_bould2', 62, 12, 2, 1], ['d_ruin1', 19, 40, 3, 1], ['d_ruin2', 26, 40, 1, 3], ['d_ruin3', 20, 44, 3, 1], ['d_ruin4', 24, 44, 2, 1],
        ['d_sandbag1', 65, 15, 2, 1], ['d_sandbag2', 69, 15, 2, 1], ['d_sandbag3', 65, 29, 2, 1], ['d_rope_coil', 72, 21, 1, 1], ['d_bucket', 64, 24, 1, 1], ['d_tarp', 48, 25, 3, 1],
        ['d_antenna', 22, 23, 1, 1], ['d_dustbin', 24, 28, 1, 1], ['d_toolbox1', 27, 15, 1, 1], ['d_rockpile1', 6, 40, 1, 1], ['d_rockpile2', 66, 51, 1, 1], ['d_rockpile3', 34, 54, 2, 1],
        ['d_driftwood', 10, 21, 2, 1], ['d_claypot', 21, 43, 1, 1], ['d_claypot2', 23, 40, 1, 1], ['d_worklamp1', 22, 13, 1, 1], ['d_worklamp2', 50, 13, 1, 1], ['d_worklamp3', 65, 17, 1, 1], ['d_worklamp4', 70, 26, 1, 1],
        ['ow_roadblock0', 34, 54, 2, 1], ['ow_roadblock1', 42, 54, 2, 1], ['ow_wreck', 8, 50, 3, 2], ['ow_bones', 62, 50, 2, 1], ['c1p_pavement', 52, 38, 5, 3], ['c1a_horses', 30, 46, 3, 1], ['c1a_sayed', 33, 47, 1, 1],
    ];
    // the small finds scattered about (sherds, fossils, things half buried)
    const scatter = { ow_sherd: [[28, 12], [48, 18], [60, 40], [12, 40], [34, 52], [55, 14], [21, 20], [70, 44]], c1p_fossil: [[53, 38], [55, 39], [54, 40], [56, 38], [52, 40]],
        ow_cache: [[31, 9], [47, 11], [11, 44], [26, 52], [61, 49], [72, 13], [16, 21], [53, 31], [6, 47], [44, 45], [71, 38], [35, 31], [25, 10], [58, 24], [9, 37], [29, 44]] };
    // trees: the palms of the oasis, a grove along the west, clusters on the edges
    const trees = [];
    for (const [x, y] of [[3, 11], [12, 12], [3, 17], [12, 18], [7, 10], [9, 19], [4, 20], [14, 14], [2, 23], [20, 30], [29, 16], [36, 40], [44, 40], [10, 46], [60, 32], [73, 40], [62, 52], [30, 36], [18, 52]]) trees.push([x, y]);
    // lamps along the main road
    const lamps = [];
    for (let y = 20; y < 52; y += 6) lamps.push([36, y], [41, y + 3]);
    lamps.push([20, 33], [28, 35], [48, 37], [58, 35], [50, 45], [10, 25]);
    const places = [
        ['hub', "THE DIRECTOR'S CAMP", 38, 28, 9], ['worker', "THE WORKERS' CAMP", 13, 30, 10], ['dig', 'THE DIG ZONE', 38, 12, 11], ['oasis', 'THE OASIS', 8, 15, 6],
        ['trench', 'TRENCH A', 66, 22, 6], ['ministry', 'THE GUARD POST', 47, 48, 6], ['rail', 'THE SUPPLY LINE', 12, 44, 7], ['sheikh', "THE SHEIKH'S TOMB", 49, 52, 4],
        ['cemetery', "THE WORKERS' CEMETERY", 24, 49, 5], ['ruins', 'THE OLD VILLAGE', 22, 42, 4], ['shelter', 'BEDOUIN SHELTER', 69, 37, 5], ['tower', 'THE WATCHTOWER', 70, 10, 4],
        ['fossils', 'THE FOSSIL PAVEMENT', 54, 39, 3], ['wreck', 'THE WRECK', 9, 51, 4],
    ];
    // the two date palms the story has names for
    things.push(['d_palm1', 47, 22, 1, 1], ['d_palm2', 49, 29, 1, 1]);
    // the three doors: [building id, fraction along its front, the room]
    const doors = [['tent_bldg', 0.5, 'INT_TENT'], ['dorm_bldg', 0.55, 'INT_DORM'], ['foreman_bldg', 0.6, 'INT_FOREMAN']];
    return { W, H, tile, get, things, scatter, trees, lamps, places, doors, spawn: [39, 42] };
}

// ============================================================
// THE GROUND, crisp: each tile is flat colour with a few hard-edged details
// ============================================================
const CampGround = {
    CH: 256, chunks: new Map(),
    COL: {
        sand: ['#f2dca2', '#e8cf8e', '#d9bc78'], path: ['#dcb57c', '#c89e62', '#b08650'], rock: ['#d8c29c', '#c2a67c', '#9a7e58', '#735c3e', '#4e3e2a'],
        water: ['#a6e2f8', '#62b4ec', '#4a98dc', '#3a7cc4'], dig: ['#8e6c48', '#76583a', '#5a422a', '#3e2c1c'], stone: ['#e8dcc0', '#d4c4a0', '#b8a47c'], gravel: ['#d2c4a0', '#b8a882', '#98886a'],
    },
    init(L) { this.L = L; this.chunks.clear(); this.pw = L.W * TILE; this.ph = L.H * TILE; },
    t(x, y) { return this.L.get(Math.floor(x / TILE), Math.floor(y / TILE)); },
    paint(cx, cy) {
        const CH = this.CH, [c, g] = mk(CH, CH), A = pa(g), X0 = cx * CH, Y0 = cy * CH, C = this.COL, L = this.L;
        const tx0 = Math.floor(X0 / TILE), ty0 = Math.floor(Y0 / TILE);
        for (let j = -1; j <= CH / TILE; j++) for (let i = -1; i <= CH / TILE; i++) {
            const tx = tx0 + i, ty = ty0 + j, x = tx * TILE - X0, y = ty * TILE - Y0, t = L.get(tx, ty), h = hash2(tx, ty);
            const n = (dx, dy) => L.get(tx + dx, ty + dy);
            if (t === T.SAND || t === T.RAIL || t === T.STONE || t === T.GRAVEL || t === T.PATH) {
                // sand everywhere first: two tones in big soft-edged patches, ripples, tufts
                A.r(x, y, TILE, TILE, C.sand[0]);
                if (h < 0.3) { const rx = x + 4 + Math.floor(hash2(tx, ty + 9) * 16), ry = y + 6 + Math.floor(hash2(tx + 3, ty) * 18); A.hl(rx, ry, 3, C.sand[1]); A.hl(rx + 3, ry - 1, 3, C.sand[1]); A.hl(rx + 6, ry, 2, C.sand[1]); }   // a wind ripple
                if (h > 0.45 && h < 0.55) { const rx = x + 8 + Math.floor(hash2(tx + 5, ty) * 14), ry = y + 10 + Math.floor(hash2(tx, ty + 5) * 14); A.px(rx, ry, C.sand[2]); A.px(rx + 2, ry - 1, C.sand[2]); A.px(rx + 4, ry, C.sand[2]); }
                if (h > 0.8) { const rx = x + 6 + Math.floor(hash2(ty, tx) * 18), ry = y + 8 + Math.floor(hash2(ty + 1, tx) * 16); A.px(rx, ry, C.sand[2]); A.px(rx + 3, ry + 2, C.sand[2]); A.px(rx + 1, ry + 1, '#fbeec8'); }        // grit
            }
            if (t === T.PATH) {
                // packed earth, with a ragged edge where it meets the sand
                A.r(x, y, TILE, TILE, C.path[0]);
                for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
                    if (n(dx, dy) === T.PATH) continue;
                    for (let k = 0; k < TILE; k += 2) {
                        const d = 1 + Math.floor(hash2(tx * 31 + k, ty * 17 + dx + dy * 3) * 3);
                        if (dy === -1) { A.r(x + k, y, 2, d, C.sand[1]); A.r(x + k, y + d, 2, 1, C.path[2]); }
                        if (dy === 1) { A.r(x + k, y + TILE - d, 2, d, C.sand[1]); A.r(x + k, y + TILE - d - 1, 2, 1, C.path[1]); }
                        if (dx === -1) { A.r(x, y + k, d, 2, C.sand[1]); A.r(x + d, y + k, 1, 2, C.path[2]); }
                        if (dx === 1) { A.r(x + TILE - d, y + k, d, 2, C.sand[1]); A.r(x + TILE - d - 1, y + k, 1, 2, C.path[1]); }
                    }
                }
                for (let k = 0; k < 3; k++) { const px = x + 3 + Math.floor(hash2(tx + k, ty * 7) * 26), py = y + 3 + Math.floor(hash2(ty + k, tx * 5) * 26); A.r(px, py, 2, 1, C.path[2]); A.px(px, py - 1, '#f0d4a0'); }   // pebbles
            } else if (t === T.WATER) {
                A.r(x, y, TILE, TILE, C.water[1]);
                for (let k = 2; k < TILE; k += 8) { A.vl(x + k + (ty & 1) * 3, y + 3, 10, C.water[0]); A.vl(x + k + 4, y + 18, 8, C.water[2]); }   // the surface catches the light in streaks
                if (h > 0.5) { A.px(x + 10, y + 12, '#ffffff'); A.px(x + 22, y + 24, '#ffffff'); }
                // a pale sandy rim where it meets the shore, a darker line under the north bank
                if (n(0, -1) !== T.WATER) { A.r(x, y, TILE, 4, C.sand[0]); A.r(x, y + 4, TILE, 3, C.water[3]); }
                if (n(0, 1) !== T.WATER) { A.r(x, y + TILE - 3, TILE, 3, '#f8e8bc'); A.r(x, y + TILE - 5, TILE, 2, C.water[0]); }
                if (n(-1, 0) !== T.WATER) { A.r(x, y, 3, TILE, '#f8e8bc'); A.r(x + 3, y, 2, TILE, C.water[0]); }
                if (n(1, 0) !== T.WATER) { A.r(x + TILE - 3, y, 3, TILE, '#f8e8bc'); A.r(x + TILE - 5, y, 2, TILE, C.water[2]); }
            } else if (t === T.ROCK) {
                // the plateau: a pale top, and a cliff face with ledges wherever open ground lies below
                const below = n(0, 1) !== T.ROCK, faceH = 22;
                A.r(x, y, TILE, TILE, C.rock[0]);
                if (h > 0.6) { A.r(x + 5 + Math.floor(h * 12), y + 8, 7, 3, C.rock[1]); A.hl(x + 5 + Math.floor(h * 12), y + 8, 7, '#ecdcbc'); }   // loose slabs on top
                if (h < 0.25) { A.line(x + 4, y + 20, x + 14, y + 26, C.rock[2]); }
                if (n(0, -1) !== T.ROCK) A.r(x, y, TILE, 2, '#f0e2c4');
                if (n(-1, 0) !== T.ROCK) A.r(x, y, 2, TILE, '#ecdcbc');
                if (n(1, 0) !== T.ROCK) A.r(x + TILE - 3, y, 3, TILE, C.rock[2]);
                if (below) {
                    const fy = y + TILE - faceH;
                    A.r(x, fy - 2, TILE, 2, '#f4e8d0');                                                   // the lip, catching the sun
                    A.r(x, fy, TILE, faceH, C.rock[2]);
                    for (let k = 0; k < faceH; k += 6) { A.r(x, fy + k + 4, TILE, 2, C.rock[3]); A.r(x, fy + k, TILE, 1, C.rock[1]); }   // strata
                    for (let k = 0; k < TILE; k += 8) A.vl(x + k + Math.floor(h * 6), fy + 2, faceH - 6, C.rock[3]);                    // cracks
                    A.r(x, y + TILE - 3, TILE, 3, C.rock[4]);
                }
            } else if (t === T.DIG) {
                A.r(x, y, TILE, TILE, C.dig[1]);
                if (h > 0.5) A.r(x + 6, y + 10, 10, 6, C.dig[0]);
                A.px(x + 20, y + 22, C.dig[3]); A.px(x + 8, y + 26, '#c8a06c');
                if (n(0, -1) !== T.DIG) { A.r(x, y, TILE, 12, C.dig[3]); for (let k = 0; k < TILE; k += 4) A.r(x + k, y + 12, 2, 2, C.dig[2]); A.r(x, y, TILE, 2, '#b89868'); }   // the north wall, in shadow
                if (n(-1, 0) !== T.DIG) { A.r(x, y, 5, TILE, C.dig[2]); A.vl(x, y, TILE, '#b89868'); }
                if (n(1, 0) !== T.DIG) { A.r(x + TILE - 4, y, 4, TILE, C.dig[0]); A.vl(x + TILE - 1, y, TILE, '#b89868'); }
                if (n(0, 1) !== T.DIG) { A.r(x, y + TILE - 3, TILE, 3, C.dig[0]); A.hl(x, y + TILE - 1, TILE, '#c8a878'); }
            } else if (t === T.STONE) {
                A.r(x + 1, y + 1, TILE - 2, TILE - 2, C.stone[1]);
                for (const [sx, sy, sw, sh] of [[2, 2, 13, 12], [17, 3, 13, 10], [3, 16, 11, 14], [16, 15, 14, 14]]) { A.r(x + sx, y + sy, sw, sh, h > 0.5 ? C.stone[0] : C.stone[1]); A.hl(x + sx, y + sy, sw, '#fff6e0'); A.hl(x + sx, y + sy + sh - 1, sw, C.stone[2]); }
                if (h > 0.4) { A.ell(x + 9, y + 9, 3, 3, '#c4b088'); A.ell(x + 9, y + 9, 1, 1, C.stone[0]); }         // a nummulite
            } else if (t === T.GRAVEL) {
                A.r(x, y, TILE, TILE, C.gravel[0]);
                for (let k = 0; k < 9; k++) { const px = x + Math.floor(hash2(tx * 3 + k, ty) * 28), py = y + Math.floor(hash2(ty * 3 + k, tx) * 28); A.r(px, py, 3, 2, C.gravel[1 + (k & 1)]); A.hl(px, py, 3, '#ece0c4'); }
            } else if (t === T.RAIL) {
                A.r(x, y, TILE, TILE, C.gravel[0]);
                const vert = n(0, -1) === T.RAIL || n(0, 1) === T.RAIL, horiz = n(-1, 0) === T.RAIL || n(1, 0) === T.RAIL;
                if (horiz || !vert) { for (let k = 2; k < TILE; k += 8) { A.r(x + k, y + 7, 4, 18, '#7a4e2c'); A.hl(x + k, y + 7, 4, '#a0703c'); } A.r(x, y + 10, TILE, 2, '#8a96a0'); A.hl(x, y + 10, TILE, '#dfe6ea'); A.r(x, y + 20, TILE, 2, '#8a96a0'); A.hl(x, y + 20, TILE, '#dfe6ea'); }
                if (vert) { for (let k = 2; k < TILE; k += 8) { A.r(x + 7, y + k, 18, 4, '#7a4e2c'); A.hl(x + 7, y + k, 18, '#a0703c'); } A.r(x + 10, y, 2, TILE, '#dfe6ea'); A.r(x + 20, y, 2, TILE, '#dfe6ea'); A.vl(x + 11, y, TILE, '#8a96a0'); A.vl(x + 21, y, TILE, '#8a96a0'); }
            }
        }
        return c;
    },
    get(cx, cy, budget) {
        const k = cx + ',' + cy;
        let c = this.chunks.get(k);
        if (c) return c;
        if (budget && budget.n <= 0) return null;
        if (budget) budget.n--;
        c = this.paint(cx, cy);
        this.chunks.set(k, c);
        return c;
    },
    draw(g, camX, camY, vw, vh) {
        const CH = this.CH, budget = { n: 3 };
        for (let cy = Math.floor(camY / CH); cy <= Math.floor((camY + vh) / CH); cy++) for (let cx = Math.floor(camX / CH); cx <= Math.floor((camX + vw) / CH); cx++) {
            const c = this.get(cx, cy, budget);
            if (c) g.drawImage(c, cx * CH - camX, cy * CH - camY); else { g.fillStyle = this.COL.sand[0]; g.fillRect(cx * CH - camX, cy * CH - camY, CH, CH); }
        }
    },
};
