// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MARSA TARFA (poke/marsa.js)
// Chapter 1-C, the Fixer's opening (story/regions/ch01_opening_fixer.md),
// on the same tile grid as Giza and Saqqara and about the same size.
// West, the desert mountains and a wadi going up into them; the coast
// highway running north to south, with the truck stop beside it; the town
// of whitewashed houses; the harbour, its quays and breakwaters; beaches
// north and south; the old Ottoman fort on the north headland, Bassem's
// villa on the south point; and east, the Red Sea and the reef.
//   marsaLayout() → the same shape campLayout() returns
// ============================================================

function marsaLayout() {
    const W = 80, H = 58, tile = new Uint8Array(W * H);
    const set = (x, y, t) => { if (x >= 0 && y >= 0 && x < W && y < H) tile[y * W + x] = t; };
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? (x >= 56 ? T.SEA : T.ROCK) : tile[y * W + x];   // (off the east edge: more sea)
    const rect = (x, y, w, h, t) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, t); };
    const path = (pts, r, t) => {
        for (let k = 0; k + 1 < pts.length; k++) {
            const [ax, ay] = pts[k], [bx, by] = pts[k + 1], n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)) * 2;
            for (let s = 0; s <= n; s++) { const x = ax + (bx - ax) * s / n, y = ay + (by - ay) * s / n; for (let j = 0; j <= r; j++) for (let i = 0; i <= r; i++) set(Math.round(x + i), Math.round(y + j), t); }
        }
    };
    const R = rng('marsa-edge');
    // ---- the sea, everywhere east of the shore ----
    rect(50, 0, W - 50, H, T.SEA);
    // ---- the mountains on the west: rock, a ragged edge, and the wadi cutting up into them ----
    for (let y = 0; y < H; y++) { const l = 3 + Math.round(R() * 1.5 + Math.sin(y * 0.3) * 1.2); rect(0, y, l, 1, T.ROCK); }
    rect(0, 0, 50, 2, T.ROCK); rect(0, H - 2, 50, 2, T.ROCK);                                            // the hills along the top and bottom edges
    rect(0, 7, 12, 2, T.ROCK); rect(0, 14, 12, 2, T.ROCK); rect(0, 9, 12, 5, T.GRAVEL);                                    // the wadi's dry bed, the cliffs either side
    rect(0, 9, 1, 5, T.ROCK);
    // ---- the beaches, north and south of the harbour, and the shore along the town ----
    for (let y = 1; y < 20; y++) rect(50, y, 8 + Math.round(Math.sin(y * 0.5) + R()), 1, T.BEACH);
    rect(50, 46, 7, H - 47, T.BEACH);
    // ---- the north headland: gravel and stone on top, the fort on it ----
    rect(52, 1, 13, 7, T.GRAVEL); rect(54, 1, 9, 5, T.STONE); rect(54, 8, 10, 1, T.ROCK); rect(64, 1, 2, 7, T.ROCK);
    // ---- the harbour: quays along the town, breakwaters north and south, the basin between ----
    rect(50, 20, 8, 26, T.QUAY);
    rect(58, 20, 11, 2, T.QUAY);                                                     // the north breakwater (the harbour mouth beyond its end)
    rect(58, 42, 15, 4, T.QUAY);                                                     // the south breakwater, broad, the coast guard post at its end
    // ---- the south point: Bassem's villa in its walled garden, the sea on three sides ----
    rect(57, 47, 14, 9, T.YARD);
    // ---- the reef, offshore: the shallows you can see into ----
    for (let y = 3; y < 19; y++) { const a = 69 + Math.round(Math.sin(y * 0.7) * 1.5 + R()), b = 76 + Math.round(Math.cos(y * 0.5) * 1.5 + R()); rect(a, y, b - a, 1, T.REEF); }
    for (let y = 47; y < 56; y++) rect(71 + Math.round(R()), y, 3 + Math.round(R() * 2), 1, T.REEF);   // a fringe off the villa's point
    // ---- Lighthouse Island, past the harbour mouth, sheltering the harbour (an addition: poke/ch1c_island.js) ----
    for (let y = 24; y <= 39; y++) {
        const k = (y - 31.5) / 8, half = Math.sqrt(Math.max(0, 1 - k * k)) * 4.2, a = Math.round(74.6 - half + Math.sin(y * 1.3) * 0.4), b = Math.round(74.6 + half + Math.cos(y * 0.9) * 0.4);
        if (b > a) rect(a, y, b - a, 1, T.BEACH);
        if (b - a > 3 && y > 24 && y < 39) rect(a + 1, y, b - a - 2, 1, T.SAND);
    }
    rect(68, 31, 3, 1, T.QUAY);                                                       // the island's little jetty
    for (const [rx, ry, rw] of [[79, 27, 1], [79, 33, 1], [76, 40, 2], [72, 23, 2], [70, 37, 1]]) rect(rx, ry, rw, 1, T.REEF);
    // ---- the coast highway, north to south ----
    path([[12, 0], [12, H - 1]], 1, T.ROAD);
    // ---- the truck stop beside it: a gravel lot ----
    rect(4, 37, 8, 14, T.GRAVEL);
    // ---- the town: packed earth between the houses, lanes, the main street down to the harbour ----
    rect(15, 14, 35, 31, T.YARD);
    path([[14, 28], [51, 28]], 1, T.ROAD);                                             // the main street, from the highway to the quay
    path([[31, 9], [31, 44]], 1, T.PATH);                                              // the lane north to south, and on up to the hotel and the fort
    path([[15, 19], [49, 19]], 1, T.PATH); path([[15, 35], [49, 35]], 1, T.PATH);      // the back lanes
    path([[31, 9], [51, 9]], 0, T.PATH); path([[51, 9], [53, 6]], 0, T.PATH);          // to the beach, and up to the fort
    path([[50, 46], [57, 46]], 0, T.PATH); path([[57, 46], [63, 46]], 1, T.PATH);      // along the south beach to the villa's gate
    rect(33, 6, 16, 6, T.YARD);                                                         // the hotel's forecourt
    // ---- the town square, by the tap ----
    rect(43, 24, 6, 3, T.STONE);

    // ---- things: [id, tile x, tile y, tiles wide, tiles deep] ----
    const things = [
        // --- the town, north of the main street ---
        ['c1c_house1', 16, 15, 4, 3], ['c1c_house2', 21, 15, 4, 3], ['c1c_house3', 26, 15, 4, 3], ['c1c_house4', 34, 15, 4, 3], ['c1c_house5', 39, 15, 4, 3], ['c1c_house6', 44, 15, 4, 3],
        ['c1c_mosque', 16, 22, 5, 4], ['c1c_cafe', 22, 23, 5, 3], ['c1c_kiosk', 28, 24, 2, 2],
        ['c1c_flat', 34, 23, 4, 3], ['c1c_house7', 39, 23, 4, 3], ['c1c_tap', 45, 24, 1, 1], ['c1c_jars_sq', 47, 24, 1, 1], ['c1c_fulcart', 43, 26, 2, 1],
        // --- the town, south of the main street ---
        ['c1c_house8', 17, 31, 4, 3], ['c1c_house9', 23, 31, 4, 3], ['c1c_house10', 35, 31, 4, 3], ['c1c_diveshop', 43, 31, 5, 3],
        ['c1c_house11', 17, 38, 4, 3], ['c1c_house12', 24, 38, 4, 3], ['c1c_house13', 36, 38, 4, 3], ['c1c_nets1', 43, 39, 3, 1],
        ['c1c_tuktuk', 27, 33, 2, 1], ['c1c_moto', 40, 26, 1, 1], ['c1c_pickup', 20, 26, 3, 2], ['c1c_crates2', 47, 33, 1, 1], ['c1c_boattrailer', 41, 42, 3, 1], ['c1c_cat', 33, 33, 1, 1], ['c1c_pots', 29, 17, 1, 1], ['c1c_goats', 46, 21, 1, 1],
        // --- the harbour ---
        ['c1c_fishmarket', 51, 31, 5, 3], ['c1c_grill', 52, 25, 2, 1], ['c1c_jars_q', 55, 25, 1, 1], ['c1c_fuelstore', 52, 37, 3, 2], ['c1c_crates', 55, 37, 1, 1], ['c1c_nets2', 51, 41, 3, 1],
        ['c1c_dhow', 58, 25, 5, 2], ['c1c_boat1', 58, 30, 3, 1], ['c1c_boat2', 58, 34, 3, 1], ['c1c_boat3', 61, 37, 3, 1], ['c1c_boat4', 63, 28, 3, 1],
        ['c1c_coastguard', 67, 42, 4, 3], ['c1c_patrol', 63, 41, 4, 1], ['c1c_bollards', 56, 22, 1, 1],
        // --- the north beach, the hotel, the fort ---
        ['c1c_hotel', 35, 6, 7, 3], ['c1c_parasol1', 51, 12, 1, 1], ['c1c_parasol2', 53, 15, 1, 1], ['c1c_beachboat', 53, 18, 2, 1],
        ['c1c_fort', 55, 1, 7, 4], ['c1c_cannon', 58, 6, 1, 1],
        // --- the south point: Bassem's villa ---
        ['c1c_vwall_n1', 57, 47, 5, 1], ['c1c_vgate', 62, 47, 2, 1], ['c1c_vwall_n2', 64, 47, 7, 1], ['c1c_vwall_w', 57, 48, 1, 8],
        ['c1c_villa', 61, 49, 7, 3], ['c1c_vpool', 59, 53, 4, 2],
        // --- the highway and the truck stop ---
        ['c1c_truckcafe', 5, 38, 5, 3], ['c1c_pumps', 5, 43, 3, 2], ['c1c_lorry1', 4, 47, 4, 2], ['c1c_lorry2', 8, 46, 4, 2], ['c1c_jars_ts', 10, 41, 1, 1], ['c1c_sign', 14, 26, 1, 1],
        ['c1c_wadisign', 10, 10, 1, 1], ['c1c_wadirock1', 4, 10, 2, 1], ['c1c_wadirock2', 7, 12, 1, 1], ['c1c_acacia', 2, 11, 1, 1],
        // --- the dive boat out on the reef, buoys ---
        ['c1c_diveboat', 72, 10, 3, 1], ['c1c_buoy1', 67, 6, 1, 1], ['c1c_buoy2', 67, 12, 1, 1], ['c1c_buoy3', 68, 17, 1, 1],
        // --- the people (beat 1; the rest come in their beats) ---
        ['c1c_zaki', 56, 26, 1, 1], ['c1c_fisherman', 53, 41, 1, 1], ['c1c_griller', 53, 26, 1, 1], ['c1c_fishseller', 52, 34, 1, 1], ['c1c_cafeman', 24, 26, 1, 1], ['c1c_kioskman', 28, 26, 1, 1],
        ['c1c_tapwoman', 46, 26, 1, 1], ['c1c_kid1', 38, 29, 1, 1], ['c1c_kid2', 40, 29, 1, 1], ['c1c_oldman', 54, 6, 1, 1], ['c1c_vguard', 61, 46, 1, 1], ['c1c_cgofficer', 66, 45, 1, 1],
        ['c1c_truckman', 7, 41, 1, 1], ['c1c_driver', 9, 45, 1, 1], ['c1c_hotelman', 38, 10, 1, 1], ['c1c_imam', 19, 27, 1, 1],
    ];
    const scatter = {};
    const trees = [[49, 22], [49, 26], [49, 31], [49, 37], [49, 42], [42, 26], [33, 26], [15, 22], [15, 33], [22, 20], [37, 20], [29, 36], [44, 36], [34, 42], [21, 42], [30, 12], [43, 11], [34, 11], [47, 7], [58, 50], [68, 51], [69, 54], [60, 55], [5, 36], [10, 36], [14, 40], [14, 12]];
    const lamps = [[18, 30], [27, 30], [38, 30], [45, 30], [57, 24], [57, 32], [57, 40], [11, 42], [31, 13], [62, 45]];
    const places = [
        ['town', 'MARSA TARFA', 30, 28, 9], ['harbour', 'THE HARBOUR', 55, 32, 5], ['villa', "BASSEM'S VILLA", 63, 51, 5], ['fort', 'THE OTTOMAN FORT', 58, 4, 4],
        ['truckstop', 'THE TRUCK STOP', 8, 44, 5], ['wadi', 'THE WADI', 5, 11, 4], ['beach', 'THE NORTH BEACH', 53, 13, 4], ['hotel', 'THE BEACH HOTEL', 38, 9, 4],
        ['coastguard', 'THE COAST GUARD POST', 68, 44, 3], ['highway', 'THE COAST HIGHWAY', 13, 20, 2],
    ];
    const doors = [['c1c_flat', 'spr', 'INT_FLAT1C', 'Your Flat'], ['c1c_diveshop', 'spr', 'INT_DIVESHOP', "Rana's Dive Shop"]];
    const lush = (tx, ty) => tx >= 46 || (tx > 14 && ty > 13 && ty < 45);
    return { W, H, tile, get, things, scatter, trees, lamps, fences: [], planks: [], places, doors, spawn: [36, 26], lush };
}
