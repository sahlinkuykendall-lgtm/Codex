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

const T = { SAND: 0, PATH: 1, ROCK: 2, WATER: 3, DIG: 4, STONE: 5, RAIL: 6, GRAVEL: 7, YARD: 8, FIELD: 9, ROAD: 10 };
const SOLID_TILE = { [T.ROCK]: 1, [T.WATER]: 1 };

function campLayout() {
    const W = 78, H = 58, tile = new Uint8Array(W * H);
    const set = (x, y, t) => { if (x >= 0 && y >= 0 && x < W && y < H) tile[y * W + x] = t; };
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? T.ROCK : tile[y * W + x];
    const rect = (x, y, w, h, t) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, t); };
    // a straight run of road from point to point, `r` + 1 tiles wide
    const path = (pts, r, t) => {
        for (let k = 0; k + 1 < pts.length; k++) {
            const [ax, ay] = pts[k], [bx, by] = pts[k + 1], n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)) * 2;
            for (let s = 0; s <= n; s++) { const x = ax + (bx - ax) * s / n, y = ay + (by - ay) * s / n; for (let j = 0; j <= r; j++) for (let i = 0; i <= r; i++) set(Math.round(x + i), Math.round(y + j), t); }
        }
    };
    // ---- the edge: a rock plateau all round, a straight escarpment across the dig zone ----
    const R = rng('camp-edge');
    for (let x = 0; x < W; x++) {
        const top = x > 14 && x < 64 ? 7 : 6 + Math.round(Math.sin(x * 0.3) * 1 + R() * 1.2), bot = 3 + Math.round(R() * 1.5 + Math.sin(x * 0.25));
        rect(x, 0, 1, top, T.ROCK); rect(x, H - bot, 1, bot, T.ROCK);
    }
    for (let y = 0; y < H; y++) { const l = 3 + Math.round(R() * 1.5 + Math.sin(y * 0.3)), r = 3 + Math.round(R() * 1.5 + Math.cos(y * 0.27)); rect(0, y, l, 1, T.ROCK); rect(W - r, y, r, 1, T.ROCK); }
    rect(37, H - 6, 5, 6, T.SAND);                                              // the road out, south (closed)
    rect(47, H - 4, 4, 1, T.SAND);                                              // room to stand at the sheikh's tomb door

    // ---- yards: packed earth in front of the buildings, where camp life happens ----
    rect(3, 25, 20, 8, T.YARD);                                                 // the workers' yard: fire, tables, darts
    rect(30, 27, 15, 5, T.YARD);                                                // the director's camp, in front of the tents
    rect(56, 43, 9, 3, T.YARD); rect(42, 50, 7, 2, T.YARD);                    // the guard post, the booth

    // ---- roads: straight runs, the way a town's are laid ----
    path([[39, H - 1], [39, 18]], 1, T.PATH);                                   // the main road: the way in → director's camp → the dig gate
    path([[39, 9], [39, 18]], 1, T.PATH);                                       // inside the dig zone, up to the shaft
    path([[13, 34], [39, 34]], 1, T.PATH);                                      // west to the workers' camp
    path([[39, 37], [64, 37]], 1, T.PATH); path([[64, 29], [64, 37]], 1, T.PATH);   // east, then up to trench A
    path([[39, 46], [55, 46]], 1, T.PATH);                                      // to the guard post
    path([[13, 19], [13, 34]], 0, T.PATH); path([[9, 19], [13, 19]], 0, T.PATH);    // a footpath to the oasis
    path([[39, 51], [46, 51]], 0, T.PATH);                                      // to the sheikh's tomb
    path([[13, 34], [13, 47]], 0, T.PATH); path([[13, 47], [21, 47]], 0, T.PATH);   // south-west: the rail halt, the cemetery

    // ---- the oasis ----
    rect(5, 13, 6, 4, T.WATER); rect(6, 12, 4, 1, T.WATER); rect(6, 17, 4, 1, T.WATER); rect(4, 14, 1, 2, T.WATER); rect(11, 14, 1, 2, T.WATER);
    // ---- trench A: open, walk down into it (planks across) ----
    rect(66, 16, 4, 12, T.DIG);
    // ---- bedrock showing through: the fossil pavement, the old quarry floor ----
    rect(51, 39, 5, 3, T.STONE); rect(52, 38, 3, 1, T.STONE);
    rect(24, 8, 4, 2, T.STONE);
    // ---- the wadi: a dry gravel bed down the south-east ----
    path([[74, 40], [70, 43], [68, 48], [70, 53]], 1, T.GRAVEL);
    // ---- the supply line: rails in from the west to a halt ----
    for (let x = 3; x < 30; x++) set(x, 44, T.RAIL);
    for (let y = 40; y < 45; y++) set(29, y, T.RAIL);
    for (let x = 29; x < 34; x++) set(x, 40, T.RAIL);

    // ---- things, by the story's ids: [id, tile x, tile y, tiles wide, tiles deep] ----
    const things = [
        // --- the director's camp: two tents facing a yard, the finds table in the middle of it ---
        ['tent_bldg', 30, 24, 7, 3], ['c1m_hanatent', 42, 22, 4, 4], ['d_gearstor', 42, 27, 5, 2], ['d_tarp', 47, 28, 3, 1],
        ['d_equiptbl', 33, 29, 4, 1], ['c1a_finds', 34, 29, 2, 1], ['c1a_hana', 35, 31, 1, 1], ['ow_detector', 36, 30, 1, 1], ['satphone', 46, 25, 1, 1],
        ['c1m_mess', 22, 19, 6, 3], ['c1m_kitchen', 27, 25, 2, 2], ['d_lantern1', 29, 27, 1, 1], ['d_lantern2', 31, 31, 1, 1],
        ['c1a_lena', 33, 27, 1, 1], ['c1a_lenaman1', 29, 26, 1, 1], ['c1a_lenaman2', 38, 26, 1, 1],
        // --- the workers' camp: bunkhouse and office on the north of their yard ---
        ['dorm_bldg', 4, 22, 8, 3], ['foreman_bldg', 15, 22, 7, 3], ['water_barrels', 23, 23, 2, 2], ['d_antenna', 14, 23, 1, 1], ['d_dustbin', 23, 26, 1, 1],
        ['camp_darts', 5, 25, 1, 1], ['camp_radio', 11, 26, 1, 1], ['d_lantern3', 8, 25, 1, 1], ['d_lantern4', 19, 25, 1, 1],
        ['d_cooking', 4, 28, 5, 1], ['c1c_veg1', 3, 30, 2, 1], ['c1c_veg2', 7, 30, 2, 1], ['fl_cooking', 5, 28, 2, 1],
        ['rest_brazier', 16, 30, 1, 1], ['ow_tea', 14, 31, 1, 1], ['camp_dog', 18, 31, 1, 1], ['tariq_talk', 18, 29, 1, 1], ['c1a_saber', 13, 30, 1, 1],
        ['d_crates1', 20, 27, 2, 2], ['fl_crates', 20, 27, 2, 2],
        // --- the dig zone, under the escarpment, behind its fence ---
        ['fl_digshed', 17, 10, 6, 3], ['fl_toolshed', 52, 10, 5, 3], ['c1m_toolrack', 24, 14, 3, 1], ['d_toolbox1', 27, 15, 1, 1], ['fl_spoil', 45, 12, 3, 2], ['ow_spoil', 49, 14, 3, 2],
        ['d_spoil2', 29, 11, 2, 1], ['d_spoil3', 51, 17, 2, 1], ['ow_sieve', 43, 15, 1, 1], ['dig_gate', 37, 18, 5, 1], ['fl_stake_sam', 35, 16, 1, 1],
        ['puzzle_glyph', 33, 6, 1, 1], ['tunnel_mouth', 39, 6, 2, 1], ['c1a_mason', 26, 9, 1, 1], ['c1p_ramp', 44, 8, 6, 1], ['perimeter', 51, 9, 1, 1],
        ['d_stake1', 30, 14, 1, 1], ['d_stake2', 33, 12, 1, 1], ['d_stake3', 42, 12, 1, 1], ['d_worklamp1', 22, 13, 1, 1], ['d_worklamp2', 50, 12, 1, 1], ['d_bould1', 20, 16, 1, 1],
        // --- trench A, Lindqvist's trailer on its west side ---
        ['trench', 66, 16, 4, 12], ['fl_trailer', 58, 18, 5, 3], ['c1a_lindqvist', 61, 22, 1, 1], ['generator', 58, 24, 2, 1], ['fl_fuel_drums', 60, 26, 2, 1], ['sams_gear', 55, 22, 1, 1],
        ['c1m_trenchkit', 71, 18, 2, 2], ['fl_scaffold', 71, 23, 2, 2], ['d_sandbag1', 65, 14, 2, 1], ['d_sandbag2', 69, 14, 2, 1], ['d_sandbag3', 71, 27, 2, 1],
        ['d_rope_coil', 72, 21, 1, 1], ['d_bucket', 64, 24, 1, 1], ['d_worklamp3', 65, 15, 1, 1], ['d_worklamp4', 70, 26, 1, 1],
        // --- the guard post on the road in: the old Ministry post, the booth, Farouk ---
        ['fl_ministry_post', 57, 40, 7, 3], ['c1c_milcrates', 56, 43, 2, 1], ['d_min1', 66, 42, 4, 2], ['d_min2', 66, 45, 3, 2],
        ['fl_guard_booth', 45, 48, 3, 2], ['c1a_farouk', 44, 50, 1, 1], ['c1m_farouk_radio', 43, 50, 1, 1], ['inspector', 49, 48, 3, 2], ['d_truck2', 56, 50, 5, 2],
        // --- the supply line ---
        ['carts', 8, 43, 5, 1], ['c1a_hamid', 17, 45, 1, 1], ['d_truck1', 31, 41, 5, 2],
        // --- further out ---
        ['ow_oasis', 5, 12, 7, 6], ['ow_well', 13, 16, 2, 2], ['d_driftwood', 9, 20, 2, 1],
        ['ow_ruins', 20, 39, 6, 3], ['ow_ruin_note', 22, 43, 1, 1], ['fl_ruins', 19, 42, 1, 1], ['d_ruin1', 19, 38, 3, 1], ['d_ruin2', 26, 38, 1, 3], ['d_ruin3', 19, 43, 1, 1], ['d_ruin4', 25, 42, 2, 1], ['d_claypot', 18, 41, 1, 1], ['d_claypot2', 23, 37, 1, 1],
        ['c1p_cemetery', 22, 49, 7, 3], ['c1p_falsedoor', 25, 48, 1, 1], ['c1p_looterpit', 30, 52, 1, 1],
        ['c1p_maqam', 47, 51, 3, 3], ['c1p_oldwoman', 46, 54, 1, 1], ['ow_shelter', 67, 34, 5, 2], ['c1p_tower', 70, 9, 2, 2], ['ow_lookout', 66, 11, 1, 1], ['d_bould2', 62, 12, 2, 1],
        ['ow_wreck', 8, 50, 3, 2], ['ow_bones', 62, 51, 2, 1], ['c1p_pavement', 51, 39, 5, 3], ['c1a_horses', 30, 45, 3, 1], ['c1a_sayed', 33, 47, 1, 1],
        ['fl_gate_post', 36, 52, 1, 1], ['fl_sand_east', 72, 30, 1, 1], ['fl_stars', 34, 38, 1, 1], ['fl_boulder', 58, 33, 2, 1], ['fl_cactus', 29, 20, 1, 1], ['fl_palm', 27, 31, 1, 1],
        ['d_cact1', 27, 38, 1, 1], ['d_cact2', 45, 42, 1, 1], ['d_cact3', 61, 30, 1, 1], ['d_cact4', 8, 39, 1, 1], ['d_cact5', 33, 50, 1, 1], ['d_cact6', 72, 47, 1, 1], ['d_cact7', 54, 27, 1, 1], ['d_cact8', 21, 18, 1, 1], ['d_cact9', 14, 51, 1, 1],
        ['d_rockpile1', 6, 40, 1, 1], ['d_rockpile2', 65, 52, 1, 1], ['d_rockpile3', 31, 51, 2, 1],
        ['ow_roadblock0', 37, 55, 2, 1], ['ow_roadblock1', 40, 55, 2, 1],
        ['d_palm1', 48, 22, 1, 1], ['d_palm2', 48, 30, 1, 1],
        // --- water and food (every map has a well; jars where people work; dates) ---
        ['c1w_well2', 67, 31, 2, 2], ['c1w_zeer_dig', 41, 15, 1, 1], ['c1w_zeer_trench', 63, 21, 1, 1], ['c1w_zeer_post', 42, 48, 1, 1], ['c1w_sabil', 50, 52, 1, 1],
        ['c1f_datepalm', 12, 18, 1, 1], ['c1f_datepalm2', 28, 41, 1, 1],
    ];
    // the small finds scattered about (sherds, fossils, things half buried)
    const scatter = { ow_sherd: [[28, 12], [48, 18], [60, 38], [11, 40], [34, 52], [55, 14], [21, 20], [72, 44]], c1p_fossil: [[52, 39], [54, 40], [53, 41], [55, 39], [51, 41]],
        ow_cache: [[31, 9], [47, 11], [10, 47], [26, 53], [61, 49], [72, 13], [16, 20], [53, 31], [6, 47], [44, 43], [72, 38], [36, 36], [25, 10], [57, 29], [9, 37], [29, 43]] };
    // trees: the palms of the oasis and along the roads
    const trees = [[3, 11], [12, 12], [3, 17], [7, 10], [9, 20], [4, 20], [15, 14], [2, 24],
        [5, 11], [10, 11], [4, 12], [11, 17], [6, 18], [13, 13],                                                          // more palms round the oasis
        [15, 8], [16, 9], [15, 10], [16, 12], [15, 16], [16, 17], [14, 7],                                               // a grove from the cliff to the fence: no way round into the dig zone
        [26, 34], [29, 16], [36, 40], [44, 40], [10, 46], [61, 35], [73, 40], [63, 53], [30, 37], [18, 53], [23, 30], [49, 26]];
    // lamps along the roads, on the kerbs
    // lamps: exactly eight tiles apart, always on the same side: the west kerb of the main road,
    // the north kerb of the roads off it (placed where they're listed: nothing nudges them)
    const lamps = [[38, 21], [38, 29], [38, 37], [38, 45], [38, 53],           // the main road
        [30, 33], [22, 33], [14, 33],                                          // west to the workers' camp
        [47, 36], [55, 36], [63, 36],                                          // east, past the fossil pavement, to the trench path
        [47, 45],                                                              // to the guard post
        [12, 42], [20, 46]];                                                   // the footpath south to the rail halt, and on to the cemetery
    // the fence round the dig zone: [x0, x1, y], the gate between the runs
    const fences = [[15, 36, 18], [42, 63, 18]];
    // planks across the trench: [x0, x1, y]
    const planks = [[66, 69, 19], [66, 69, 23], [66, 69, 26]];
    const places = [
        ['hub', "THE DIRECTOR'S CAMP", 37, 27, 8], ['worker', "THE WORKERS' CAMP", 12, 27, 9], ['dig', 'THE DIG ZONE', 38, 12, 11], ['oasis', 'THE OASIS', 8, 15, 6],
        ['trench', 'TRENCH A', 66, 22, 6], ['ministry', 'THE GUARD POST', 52, 45, 7], ['rail', 'THE SUPPLY LINE', 12, 44, 6], ['sheikh', "THE SHEIKH'S TOMB", 48, 53, 4],
        ['cemetery', "THE WORKERS' CEMETERY", 25, 50, 5], ['ruins', 'THE OLD VILLAGE', 22, 40, 4], ['shelter', 'BEDOUIN SHELTER', 69, 35, 5], ['tower', 'THE WATCHTOWER', 70, 10, 4],
        ['fossils', 'THE FOSSIL PAVEMENT', 53, 40, 3], ['wreck', 'THE WRECK', 9, 51, 4],
    ];
    // the doors: [building id, fraction along its front, the room, (its name), (how far down the footprint it is, if not the front)]
    const doors = [['tent_bldg', 0.5, 'INT_TENT'], ['dorm_bldg', 0.55, 'INT_DORM'], ['foreman_bldg', 0.6, 'INT_FOREMAN'],
        ['fl_guard_booth', 0.77, 'INT_BOOTH', 'Guard Booth'], ['fl_ministry_post', 0.7, 'INT_MINPOST', 'Old Ministry Post'], ['fl_trailer', 0.66, 'INT_TRAILER', 'Site Trailer'],
        ['fl_digshed', 0.5, 'INT_DIGSHED', 'Dig Shed'], ['c1m_mess', 0.5, 'INT_MESS', 'Mess Tent'], ['c1m_hanatent', 0.5, 'INT_HANA', "Hana's Tent", 88], ['c1p_maqam', 0.5, 'INT_MAQAM', "Sheikh's Tomb"]];
    // solid ground nobody can see: behind the grove between the cliff and the fence's west end
    const blocks = [[15, 7, 1, 12]];
    return { W, H, tile, get, things, scatter, trees, lamps, fences, planks, places, doors, blocks, spawn: [39, 42] };
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
            if (t === T.SAND || t === T.RAIL || t === T.STONE || t === T.GRAVEL || t === T.PATH || t === T.YARD) {
                // sand everywhere first: two tones in big soft-edged patches, ripples, tufts
                A.r(x, y, TILE, TILE, C.sand[0]);
                if (h < 0.3) { const rx = x + 4 + Math.floor(hash2(tx, ty + 9) * 16), ry = y + 6 + Math.floor(hash2(tx + 3, ty) * 18); A.hl(rx, ry, 3, C.sand[1]); A.hl(rx + 3, ry - 1, 3, C.sand[1]); A.hl(rx + 6, ry, 2, C.sand[1]); }   // a wind ripple
                if (h > 0.45 && h < 0.55) { const rx = x + 8 + Math.floor(hash2(tx + 5, ty) * 14), ry = y + 10 + Math.floor(hash2(tx, ty + 5) * 14); A.px(rx, ry, C.sand[2]); A.px(rx + 2, ry - 1, C.sand[2]); A.px(rx + 4, ry, C.sand[2]); }
                if (h > 0.8) { const rx = x + 6 + Math.floor(hash2(ty, tx) * 18), ry = y + 8 + Math.floor(hash2(ty + 1, tx) * 16); A.px(rx, ry, C.sand[2]); A.px(rx + 3, ry + 2, C.sand[2]); A.px(rx + 1, ry + 1, '#fbeec8'); }        // grit
            }
            if (t === T.YARD) {
                A.r(x, y, TILE, TILE, '#e8c98e');
                for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
                    const nt = n(dx, dy); if (nt === T.YARD || nt === T.PATH) continue;
                    for (let k = 0; k < TILE; k += 2) {
                        const dd = 1 + Math.floor(hash2(tx * 13 + k, ty * 29 + dx + dy * 5) * 2);
                        if (dy === -1) A.r(x + k, y, 2, dd, C.sand[0]); if (dy === 1) A.r(x + k, y + TILE - dd, 2, dd, C.sand[0]);
                        if (dx === -1) A.r(x, y + k, dd, 2, C.sand[0]); if (dx === 1) A.r(x + TILE - dd, y + k, dd, 2, C.sand[0]);
                    }
                }
                if (h < 0.4) { const fx = x + 6 + Math.floor(hash2(tx, ty + 3) * 16), fy = y + 6 + Math.floor(hash2(tx + 4, ty) * 16); A.r(fx, fy, 2, 3, '#d8b478'); A.r(fx + 5, fy + 4, 2, 3, '#d8b478'); }   // footprints
                if (h > 0.85) { A.r(x + 12, y + 14, 3, 2, '#c8a068'); A.hl(x + 12, y + 13, 3, '#f4dca8'); }
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
                // a trench floor: dug earth with clods, and the excavators' string grid pegged across it
                A.r(x, y, TILE, TILE, C.dig[1]);
                for (let k = 0; k < 5; k++) { const cx = x + 3 + Math.floor(hash2(tx * 7 + k, ty * 3) * 25), cy = y + 3 + Math.floor(hash2(ty * 5 + k, tx) * 25); A.r(cx, cy, 3, 2, C.dig[2]); A.hl(cx, cy, 3, '#c8a06c'); }
                if ((tx & 1) === 0) A.vl(x, y, TILE, '#f4ecd8');
                if (ty % 3 === 0) { A.hl(x, y + 16, TILE, '#f4ecd8'); if ((tx & 1) === 0) { A.r(x - 1, y + 15, 3, 3, '#c84830'); A.px(x - 1, y + 15, '#ff9070'); } }
                if (n(0, -1) !== T.DIG) { A.r(x, y, TILE, 12, C.dig[3]); for (let k = 0; k < TILE; k += 4) A.r(x + k, y + 12, 2, 2, C.dig[2]); A.r(x, y, TILE, 2, '#b89868'); }   // the north wall, in shadow
                if (n(-1, 0) !== T.DIG) { A.r(x, y, 5, TILE, C.dig[2]); A.vl(x, y, TILE, '#b89868'); }
                if (n(1, 0) !== T.DIG) { A.r(x + TILE - 4, y, 4, TILE, C.dig[0]); A.vl(x + TILE - 1, y, TILE, '#b89868'); }
                if (n(0, 1) !== T.DIG) { A.r(x, y + TILE - 3, TILE, 3, C.dig[0]); A.hl(x, y + TILE - 1, TILE, '#c8a878'); }
            } else if (t === T.STONE) {
                A.r(x + 1, y + 1, TILE - 2, TILE - 2, C.stone[1]);
                for (const [sx, sy, sw, sh] of [[2, 2, 13, 12], [17, 3, 13, 10], [3, 16, 11, 14], [16, 15, 14, 14]]) { A.r(x + sx, y + sy, sw, sh, h > 0.5 ? C.stone[0] : C.stone[1]); A.hl(x + sx, y + sy, sw, '#fff6e0'); A.hl(x + sx, y + sy + sh - 1, sw, C.stone[2]); }
                if (h > 0.4) { A.ell(x + 9, y + 9, 3, 3, '#c4b088'); A.ell(x + 9, y + 9, 1, 1, C.stone[0]); }         // a nummulite
            } else if (t === T.FIELD) {
                // crops in rows: clover, wheat or onions by the field (a field is a 6×5 patch of tiles), a ridge of earth at its edge
                const fk = hash2(Math.floor(tx / 6) * 3 + 1, Math.floor(ty / 5) * 7 + 2), P = fk < 0.45 ? ['#6cbc4c', '#4e9a3a', '#8cd060'] : fk < 0.75 ? ['#d8c060', '#b8a040', '#f0dc88'] : ['#5aa048', '#3e7e34', '#a8d878'];
                A.r(x, y, TILE, TILE, '#7a5a38');
                for (let k = 1; k < TILE; k += 4) { A.r(x, y + k, TILE, 2, P[0]); A.hl(x, y + k, TILE, P[2]); A.hl(x, y + k + 2, TILE, '#5e4428'); }
                for (let k = 0; k < 5; k++) A.px(x + Math.floor(hash2(tx * 5 + k, ty) * 30), y + 1 + Math.floor(hash2(ty * 5 + k, tx) * 7) * 4, P[1]);
                if (n(0, -1) !== T.FIELD) A.r(x, y, TILE, 2, '#9a7a50');
                if (n(-1, 0) !== T.FIELD) A.r(x, y, 2, TILE, '#9a7a50');
                if ((tx % 6 === 0) && n(-1, 0) === T.FIELD) A.vl(x, y, TILE, '#6a4c30');                                       // the ridge between two fields
            } else if (t === T.ROAD) {
                // an asphalt road, grey and patched, crumbling to sand at its edges
                A.r(x, y, TILE, TILE, '#77726c');
                for (let k = 0; k < 6; k++) { const px = x + Math.floor(hash2(tx * 3 + k, ty * 11) * 28), py = y + Math.floor(hash2(ty * 3 + k, tx * 11) * 28); A.r(px, py, 3, 2, k & 1 ? '#6a655f' : '#86817a'); }
                if (h > 0.7) { A.r(x + 6, y + 8, 12, 8, '#6a655f'); A.hl(x + 6, y + 8, 12, '#8e8982'); }                     // a patch
                for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
                    if (n(dx, dy) === T.ROAD) continue;
                    for (let k = 0; k < TILE; k += 2) {
                        const d = 1 + Math.floor(hash2(tx * 29 + k, ty * 13 + dx + dy * 7) * 3);
                        if (dy === -1) A.r(x + k, y, 2, d, C.sand[1]); if (dy === 1) A.r(x + k, y + TILE - d, 2, d, C.sand[1]);
                        if (dx === -1) A.r(x, y + k, d, 2, C.sand[1]); if (dx === 1) A.r(x + TILE - d, y + k, d, 2, C.sand[1]);
                    }
                }
                const vert = n(0, -1) === T.ROAD && n(0, 1) === T.ROAD && n(-1, 0) !== T.ROAD, horiz = n(-1, 0) === T.ROAD && n(1, 0) === T.ROAD && n(0, -1) !== T.ROAD;
                if (horiz && (tx & 1)) A.r(x + 4, y + TILE - 1, 14, 2, '#e8e0c8');                                            // the dashed centre line (roads are two tiles wide)
                if (vert && (ty & 1)) A.r(x + TILE - 1, y + 4, 2, 14, '#e8e0c8');
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
