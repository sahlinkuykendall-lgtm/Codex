// ============================================================
// THE CODEX OF GIZA — POKE STYLE: SAQQARA (poke/saqqara.js)
// Chapter 1-B, the Inspector's opening, laid out on the same tile grid as
// the Giza camp and about the same size. West of the escarpment, the
// desert necropolis: the Step Pyramid in its niched enclosure, the Teti
// pyramid and its dig, the Serapeum's entrance in the cliff, a field of
// mastabas, and a sealed tomb in the far corner. On the escarpment's edge,
// the inspectorate compound. East, down in the green: fields and canals,
// palm groves, and the village of Mit Rahina (ancient Memphis) with its
// market, its mosque, and the fallen colossus of Ramesses II.
//   saqqaraLayout() → the same shape campLayout() returns
// ============================================================

function saqqaraLayout() {
    const W = 80, H = 58, tile = new Uint8Array(W * H);
    const set = (x, y, t) => { if (x >= 0 && y >= 0 && x < W && y < H) tile[y * W + x] = t; };
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? T.ROCK : tile[y * W + x];
    const rect = (x, y, w, h, t) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, t); };
    const path = (pts, r, t) => {
        for (let k = 0; k + 1 < pts.length; k++) {
            const [ax, ay] = pts[k], [bx, by] = pts[k + 1], n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)) * 2;
            for (let s = 0; s <= n; s++) { const x = ax + (bx - ax) * s / n, y = ay + (by - ay) * s / n; for (let j = 0; j <= r; j++) for (let i = 0; i <= r; i++) set(Math.round(x + i), Math.round(y + j), t); }
        }
    };
    const R = rng('saqqara-edge');
    // ---- the green below the escarpment: fields, and canals all round them ----
    rect(47, 0, W - 47, H, T.FIELD);
    // ---- the desert: rock all round its edge ----
    for (let x = 0; x < 47; x++) {
        let top = 5 + Math.round(Math.sin(x * 0.35) + R() * 1.2);
        if (x >= 3 && x <= 15) top = 7;                                              // the cliff the Serapeum (and its service door) is cut into
        if (x >= 20 && x <= 29) top = 5;                                             // room round the Teti pyramid
        const bot = 3 + Math.round(R() * 1.5 + Math.sin(x * 0.25));
        rect(x, 0, 1, top, T.ROCK); rect(x, H - bot, 1, bot, T.ROCK);
    }
    for (let y = 0; y < H; y++) { const l = 3 + Math.round(R() * 1.5 + Math.sin(y * 0.3)); rect(0, y, l, 1, T.ROCK); }
    // ---- the escarpment: the desert's edge, a cliff between the necropolis and the fields ----
    for (let y = 0; y < H; y++) rect(44 - (R() < 0.35 ? 1 : 0), y, 3 + (R() < 0.3 ? 1 : 0), 1, T.ROCK);
    rect(3, 45, 6, 4, T.ROCK); rect(4, 44, 3, 1, T.ROCK);                             // an outcrop in the far corner: the sealed tomb is cut into it
    // ---- canals round the fields (the edge of the map on the green side) ----
    rect(47, 3, W - 47, 2, T.WATER); rect(W - 4, 3, 2, H - 6, T.WATER); rect(47, H - 4, W - 47, 2, T.WATER);
    rect(55, 42, 20, 1, T.WATER); rect(55, 42, 1, 11, T.WATER);                      // a ditch round the museum garden
    rect(52, 5, 1, 9, T.WATER);                                                       // an irrigation ditch in the north fields
    // ---- the roads ----
    path([[43, 28], [W - 5, 28]], 1, T.ROAD);                                          // the road up from the village, through the gap in the escarpment
    path([[33, 28], [44, 28]], 1, T.ROAD);                                             // on to the necropolis
    path([[36, 9], [36, 28]], 1, T.ROAD);                                              // north to the Teti pyramid and the Serapeum
    path([[6, 9], [37, 9]], 1, T.PATH);
    path([[33, 28], [33, 36]], 1, T.PATH); path([[26, 36], [34, 36]], 1, T.PATH); path([[26, 34], [26, 36]], 1, T.PATH);   // round to the Step Pyramid's gate
    path([[38, 25], [38, 28]], 1, T.PATH);                                             // from the inspectorate's gate to the road
    path([[42, 47], [48, 47]], 1, T.PATH); path([[10, 46], [42, 46]], 0, T.PATH); path([[48, 47], [56, 47]], 0, T.PATH);   // the footpath down the escarpment, the mastabas, the museum garden
    path([[63, 15], [63, 42]], 1, T.PATH); path([[63, 42], [63, 44]], 1, T.PATH);    // the market lane through the village, down to the museum
    // ---- the village: packed earth between the houses ----
    rect(53, 14, 22, 14, T.YARD); rect(53, 30, 22, 11, T.YARD); path([[63, 15], [63, 42]], 1, T.PATH);
    // ---- the museum garden ----
    rect(56, 43, 19, 10, T.YARD); set(63, 42, T.PATH); set(64, 42, T.PATH);
    // ---- yards: the inspectorate's, the coach park, the Serapeum's forecourt, the dig ----
    rect(35, 18, 8, 7, T.YARD); rect(33, 31, 9, 5, T.YARD); rect(4, 7, 12, 3, T.YARD);
    rect(29, 7, 5, 3, T.DIG);
    // ---- the Step Pyramid's court: paving before the pyramid ----
    rect(13, 22, 12, 2, T.STONE);

    // ---- things: [id, tile x, tile y, tiles wide, tiles deep] ----
    const things = [
        // --- the inspectorate compound ---
        ['c1b_office', 35, 18, 7, 3], ['c1b_cwall_n', 34, 17, 10, 1], ['c1b_cwall_w', 34, 18, 1, 7], ['c1b_cwall_e', 43, 18, 1, 7], ['c1b_cwall_s1', 34, 25, 4, 1], ['c1b_cwall_s2', 40, 25, 4, 1],
        ['c1b_fathicar', 35, 22, 3, 2], ['c1b_bike', 40, 22, 1, 1], ['c1b_teacorner', 41, 21, 2, 1], ['c1w_zeer_insp', 42, 23, 1, 1],
        ['c1b_umsabry', 41, 22, 1, 1], ['c1b_samy', 39, 22, 1, 1],
        // --- the Step Pyramid and its enclosure ---
        ['c1b_wall_n', 8, 13, 23, 1], ['c1b_wall_w', 8, 14, 1, 19], ['c1b_wall_e', 30, 14, 1, 19], ['c1b_wall_s1', 8, 33, 17, 1], ['c1b_wall_s2', 28, 33, 3, 1],
        ['c1b_entrance', 25, 32, 3, 2], ['c1b_steppyramid', 14, 16, 10, 6], ['c1b_hebsed', 24, 15, 5, 2], ['c1b_serdab', 24, 20, 1, 1], ['c1b_southtomb', 10, 29, 4, 2],
        // --- the coach park, the camel men ---
        ['c1b_bus', 34, 31, 4, 2], ['c1b_souvenirs', 39, 32, 2, 1], ['c1b_camel1', 36, 34, 1, 1], ['c1b_camel2', 40, 35, 1, 1], ['c1b_cameleer', 38, 34, 1, 1], ['c1b_tpolice', 41, 34, 1, 1],
        // --- the Serapeum ---
        ['c1b_serapeum', 6, 6, 3, 1], ['c1b_servicedoor', 14, 6, 1, 1], ['c1b_cigs', 15, 8, 1, 1], ['c1b_kagemni', 38, 10, 4, 2], ['c1b_ghafhut', 11, 8, 2, 2], ['c1b_ghaffir', 10, 10, 1, 1], ['c1w_zeer_ser', 13, 10, 1, 1],
        // --- the Teti pyramid and the dig ---
        ['c1b_teti', 21, 6, 6, 4], ['c1b_tetispoil', 30, 11, 3, 2], ['c1b_tetisieve', 34, 11, 1, 1], ['c1b_gad', 31, 13, 1, 1], ['c1b_digman1', 29, 10, 1, 1], ['c1b_digman2', 33, 8, 1, 1], ['c1w_zeer_teti', 35, 13, 1, 1],
        // --- the mastaba field ---
        ['c1b_mastaba1', 33, 40, 5, 3], ['c1b_mastaba2', 22, 41, 5, 3], ['c1b_mastaba3', 11, 39, 5, 3], ['c1b_mastaba4', 28, 49, 5, 3], ['c1b_robtunnel', 34, 50, 1, 1],
        ['c1b_oldtomb', 5, 48, 2, 1],
        // --- Mit Rahina: houses, the mosque, the café, the well, the bakery ---
        ['c1b_house1', 54, 15, 4, 3], ['c1b_house2', 58, 15, 4, 3], ['c1b_mosque', 66, 14, 5, 4], ['c1b_house3', 71, 15, 3, 3],
        ['c1b_cafe', 54, 22, 5, 3], ['c1b_well', 60, 23, 2, 2], ['c1b_bakery', 66, 22, 4, 3], ['c1b_house4', 71, 22, 3, 3],
        ['c1b_cafeowner', 57, 26, 1, 1], ['c1b_baker', 68, 26, 1, 1],
        // --- the market, the garage ---
        ['c1b_stall_fruit', 59, 31, 3, 1], ['c1b_stall_cloth', 59, 35, 3, 1], ['c1b_stall_spice', 66, 31, 3, 1], ['c1b_stall_veg', 66, 35, 3, 1],
        ['c1b_fruitseller', 60, 33, 1, 1], ['c1b_spiceseller', 67, 33, 1, 1], ['c1b_garage', 70, 31, 4, 3], ['c1b_mechanic', 71, 34, 1, 1], ['c1b_bike_mr', 69, 33, 1, 1], ['c1b_tuktuk', 66, 38, 2, 1],
        ['c1b_house5', 54, 31, 4, 3], ['c1b_house6', 54, 36, 4, 3], ['c1b_house7', 70, 37, 4, 3], ['c1b_donkey', 49, 30, 3, 1],
        // --- street life (poke/ch1b_town.js): wires and bunting over the lane, food and water, animals, people ---
        ['c1b_wires1', 60, 21, 8, 1], ['c1b_bunting', 58, 37, 8, 1], ['c1b_fulcart', 69, 20, 2, 1], ['c1b_juice', 53, 19, 2, 2], ['c1b_qulla', 74, 19, 1, 1], ['c1b_butane', 53, 27, 2, 1],
        ['c1b_chickens1', 61, 19, 1, 1], ['c1b_chickens2', 69, 39, 1, 1], ['c1b_cat', 74, 26, 1, 1], ['c1b_bicycle', 69, 36, 1, 1], ['c1b_crates', 58, 33, 1, 1], ['c1b_rugs', 50, 38, 3, 1],
        ['c1b_bench', 60, 26, 2, 1], ['c1b_oldman1', 60, 27, 1, 1], ['c1b_oldman2', 62, 26, 1, 1], ['c1b_kid1', 60, 39, 1, 1], ['c1b_kid2', 62, 40, 1, 1], ['c1b_ball', 61, 39, 1, 1],
        ['c1b_dovecote1', 50, 15, 2, 2], ['c1b_dovecote2', 70, 9, 2, 2], ['c1b_buffalo', 57, 10, 2, 1], ['c1b_goats', 52, 45, 1, 1],
        // --- the museum garden: the colossus, the alabaster sphinx ---
        ['c1b_colossus', 57, 44, 8, 4], ['c1b_sphinx', 67, 48, 4, 2], ['c1b_kiosk', 57, 50, 2, 1], ['c1b_statues', 69, 44, 3, 1], ['c1b_tourist1', 66, 46, 1, 1], ['c1b_tourist2', 67, 46, 1, 1], ['c1b_guide', 61, 49, 1, 1],
    ];
    const scatter = {};
    const trees = [[48, 7], [50, 8], [48, 10], [49, 13], [54, 7], [57, 8], [60, 7], [64, 9], [68, 8], [72, 7], [48, 18], [50, 21], [48, 24], [49, 33], [48, 38], [50, 41], [48, 44], [50, 51], [53, 50],
        [58, 52], [63, 51], [72, 51], [74, 45], [56, 20], [62, 20], [73, 26], [52, 36], [65, 40], [60, 40], [73, 42], [51, 26], [73, 11], [58, 12], [66, 11], [42, 13], [27, 38], [39, 38]];
    const lamps = [[42, 27], [36, 24], [58, 27], [66, 27], [72, 30], [62, 30], [62, 43]];
    const places = [
        ['office', 'THE INSPECTORATE', 38, 21, 6], ['pyramid', 'THE STEP PYRAMID', 19, 22, 9], ['serapeum', 'THE SERAPEUM', 8, 9, 5], ['teti', 'THE TETI DIG', 28, 10, 6],
        ['coach', 'THE COACH PARK', 37, 33, 5], ['mastabas', 'THE MASTABA FIELD', 24, 45, 8], ['village', 'MIT RAHINA', 62, 22, 8], ['market', 'THE MARKET', 63, 33, 5],
        ['colossus', 'THE COLOSSUS OF RAMESSES', 63, 47, 7], ['fields', 'THE FIELDS', 58, 9, 6], ['oldtomb', 'A SEALED TOMB', 6, 50, 3],
    ];
    const doors = [['c1b_office', 0.5, 'INT_INSPECTORATE', 'The Inspectorate']];
    const lush = (tx, ty) => tx >= 47;
    return { W, H, tile, get, things, scatter, trees, lamps, fences: [], planks: [], places, doors, spawn: [38, 24], lush };
}
