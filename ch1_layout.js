// ============================================================
// THE CODEX OF GIZA — CHAPTER 1 OPEN-WORLD LAYOUT (ch1_layout.js)
//
// The 3D build's Chapter 1 is an open desert instead of a boxed
// 120 m square. The camp's areas keep their own internal layout (and
// every object keeps its id, scene and flags) but are pulled apart
// and linked by trodden tracks, with a hill up to the dig zone:
//
//        escarpment ─ TUNNEL ─ escarpment                 lookout
//          (dig zone plateau, cliffs both sides)           ridge
//                     │ dig gate                    TRENCH
//   ruins             │ switchback climb                │
//   oasis   WORKER ── HUB (Ellis' tent) ─────────── MINISTRY
//                     │                                 │ road in
//                  CAMP GATE                            │
//                     │ road out (closed)
//
// The edge of the world is a ring of dunes too steep to climb (and the
// escarpment in the north); roads end at closed barriers, never at a
// bare edge. Only mapWalls[1] / mapObjects[1] are rewritten, in place,
// before anything reads them; the 2D build (index2d.html) doesn't load
// this file and keeps the original map.
// Loaded after engine.js, before ch1_world.js.
// ============================================================

const CH1_LAYOUT = {
    W: 10600, H: 8800,
    // old (post-MAP_SCALE) → new offsets per area
    offsets: {
        dig:      [3692, 600],
        hub:      [3910, 2700],
        worker:   [1730, 2200],
        trench:   [5300, 1020],
        ministry: [5560, 2800],
        entry:    [3840, 4068],
    },
    spawn: { x: 1696 + 3910, y: 2688 + 2700 },
    // the ministry car drives north up the east road
    car: { x: 3520 + 5560, startY: 9300, targetY: 2080 + 2800 },
    cliffZ: 372 + 600,                      // foot of the escarpment
    digRect: [3756, 972, 7468, 2320],       // plateau behind the dig fence
    gateOpen: [1600 + 3692, 1856 + 3692],  // passable x once the gate swings
    fenceZ: 1696 + 600,
    trench: { x0: 2840 + 5300, x1: 3120 + 5300, z0: 1920 + 1020, z1: 2640 + 1020, depth: 46 },
    // world boundary: a closed loop; outside it the dunes rise
    boundary: [
        [3620, 1000], [2700, 1420], [1400, 1650], [620, 2500], [380, 3900], [460, 5500],
        [900, 6800], [2000, 7700], [3400, 8250], [4600, 8480], [5500, 8480], [6700, 8280],
        [8000, 8050], [8800, 8440], [9400, 8420], [10050, 7200], [10300, 5600], [10220, 3800],
        [10020, 2300], [9500, 1400], [8600, 1080], [7560, 1000],
    ],
    // roads leave the site here (closed barriers at the boundary)
    roadExits: [[4940, 8400], [9080, 8400]],
};

// Which area an original object/wall belongs to (by its old centre)
function ch1ZoneOf(cx, cz) {
    if (cz < 1850) return 'dig';
    if (cz >= 3150 && cx >= 2300) return 'ministry';
    if (cx < 1100 && cz < 3000) return 'worker';
    if (cx < 1100 || cz >= 3150) return 'entry';
    if (cx < 2230) return 'hub';
    if (cx < 3150) return 'trench';
    return 'ministry';
}

// Old coordinate in a named area → new world coordinate
function ch1Old(zone, x, z) {
    const o = CH1_LAYOUT.offsets[zone];
    return [x + o[0], z + o[1]];
}

function relayoutChapterOne() {
    const walls = mapWalls[1], objs = mapObjects[1];
    if (!walls || walls._openWorld) return;
    const near = (a, b) => Math.abs(a - b) < 2;

    // ---- walls: classify, tag, drop the old box edges, move ----
    const keep = [];
    for (const w of walls) {
        const cx = w.x + w.w / 2, cz = w.y + w.h / 2;
        // the old world borders and the north rubble line → new boundary
        if (w.x <= 0 || w.y <= 0 || w.x + w.w >= 3840 || w.y + w.h >= 3520) continue;
        if (near(w.y, 352) && w.w > 3000) continue;
        // south perimeter fence: keep only the stretch round the camp gate
        if (near(w.y, 3232) && w.h <= 40) {
            if (w.x >= 2400) continue;
            if (near(w.x, 64)) { w.w = 992 - 560; w.x = 560; }
            else if (near(w.x, 1312)) { w.w = 1760 - 1312; }
            w.kind = 'chain';
        }
        const zone = ch1ZoneOf(cx, cz);
        w.zone = zone;
        // tag the walls that are really structures
        if (w.isGate) w.kind = 'gate';
        else if (w.y > 1660 && w.y < 1700 && w.h <= 48) w.kind = 'northFence';
        else if (near(w.x, 1440) && near(w.y, 1408)) w.kind = 'digshed';
        else if (near(w.w, 280) && w.x > 2800 && w.x < 2900) w.kind = 'trenchPlank';
        else if ((near(w.x, 2800) || near(w.x, 3120)) && near(w.h, 720)) { w.kind = 'trenchLip'; w.side = near(w.x, 2800) ? -1 : 1; }
        else if (near(w.x, 1312) && near(w.y, 3184)) w.kind = 'gatepost';
        else if ((near(w.x, 1440) || near(w.x, 2288)) && near(w.y, 560)) { w.kind = 'cutting'; w.side = near(w.x, 1440) ? -1 : 1; }
        else if (near(w.x, 3360) && near(w.y, 2272)) w.kind = 'ministryHut';
        else if (Math.min(w.w, w.h) >= 150) w.kind = 'outcrop';
        else if (!w.kind && Math.min(w.w, w.h) <= 22) w.kind = 'rope';
        else if (!w.kind && zone === 'worker' && Math.min(w.w, w.h) <= 36) w.kind = 'rail';
        const off = CH1_LAYOUT.offsets[zone];
        w.x += off[0]; w.y += off[1];
        keep.push(w);
    }

    // ---- new walls ----
    const [dx0, dz0, dx1, dz1] = CH1_LAYOUT.digRect;
    // cliffs closing the dig plateau's sides (it was the old map edge)
    keep.push({ x: dx0 - 170, y: dz0 - 60, w: 170, h: dz1 - dz0 + 110, kind: 'ridge', side: -1 });
    keep.push({ x: dx1, y: dz0 - 60, w: 170, h: dz1 - dz0 + 110, kind: 'ridge', side: 1 });
    // the escarpment itself (behind the tunnel), so nothing slips round it
    keep.push({ x: dx0 - 170, y: dz0 - 160, w: dx1 - dx0 + 340, h: 140, kind: 'cliffBase' });
    // the boundary: a chain of blocks along the dune foot
    const B = CH1_LAYOUT.boundary;
    for (let i = 0; i < B.length; i++) {
        const [ax, az] = B[i], [bx, bz] = B[(i + 1) % B.length];
        const len = Math.hypot(bx - ax, bz - az), n = Math.ceil(len / 70);
        for (let k = 0; k < n; k++) {
            const t = k / n;
            keep.push({ x: ax + (bx - ax) * t - 45, y: az + (bz - az) * t - 45, w: 90, h: 90, kind: 'boundary' });
        }
    }
    walls.length = 0;
    walls.push(...keep);
    walls._openWorld = true;

    // ---- objects: move each with its area ----
    for (const o of objs) {
        const zone = ch1ZoneOf(o.x + o.w / 2, o.y + o.h / 2);
        const off = CH1_LAYOUT.offsets[zone];
        o.zone = zone;
        o.x += off[0]; o.y += off[1];
    }
    // path lamps along the tracks (lit by the nearest-lamp light pool)
    for (const [i, [x, z]] of ch1PathLampSpots().entries()) {
        objs.push({ id: 'ow_pathlamp' + i, x: x - 7, y: z - 7, w: 14, h: 14, color: '#d4af37', label: 'Path Lamp', interactScene: null, decorative: true, zone: 'open' });
    }
    // barriers where the roads leave the site
    CH1_LAYOUT.roadExits.forEach(([x, z], i) => {
        objs.push({ id: 'ow_roadblock' + i, x: x - 110, y: z - 40, w: 220, h: 60, color: '#8a2a20', label: 'Road Closed', interactScene: null, decorative: true, zone: 'open' });
    });
}

// Lamps every ~520 units along the main tracks
function ch1PathLampSpots() {
    const spots = [];
    for (const p of CH1_TRACKS) {
        if (!p.lamps) continue;
        for (let i = 0; i < p.pts.length - 1; i++) {
            const [ax, az] = p.pts[i], [bx, bz] = p.pts[i + 1];
            const len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / 520));
            const nx = -(bz - az) / len, nz = (bx - ax) / len; // stand beside the track
            for (let k = (i === 0 ? 1 : 0); k < n; k++) {
                const t = k / n;
                spots.push([ax + (bx - ax) * t + nx * (p.w + 26), az + (bz - az) * t + nz * (p.w + 26)]);
            }
        }
    }
    return spots;
}

// the supply line's rails: buffer stop → loading bay → out through the dunes
const CH1_RAIL = [[4420, 7204], [4000, 7204], [3420, 7320], [2860, 7610], [2340, 7990], [1700, 8620], [700, 9520], [-900, 10700]];

// ---- TRACKS: the camp's desire lines and roads ----
// pts in new world coordinates; w = half width; kind 1 = vehicle road
const CH1_TRACKS = [
    // main road: from the closed south exit, through the camp gate, to the tents
    { kind: 1, w: 70, lamps: false, pts: [[4940, 8900], [4980, 7900], [5000, 7400], [5150, 6700], [5400, 6000], [5600, 5540]] },
    // ministry road up the east side to where the car parks
    { kind: 1, w: 75, lamps: false, pts: [[9080, 9300], [9090, 8000], [9100, 6600], [9110, 5500], [9105, 4920]] },
    // hub ↔ worker camp (dips through a hollow between dunes)
    { kind: 0, w: 42, lamps: true, pts: [[5200, 5460], [4400, 5700], [3500, 5620], [2800, 5420], [2300, 5230]] },
    // hub ↔ ministry
    { kind: 0, w: 42, lamps: true, pts: [[6050, 5360], [6900, 5560], [7800, 5420], [8500, 5260], [8980, 5120]] },
    // hub ↔ trench (up out of the basin, across a wadi)
    { kind: 0, w: 38, lamps: true, pts: [[5900, 4760], [6500, 4380], [7200, 4150], [7800, 3950], [8280, 3720]] },
    // trench ↔ ministry
    { kind: 0, w: 34, lamps: false, pts: [[8420, 3700], [8800, 4250], [9080, 4700]] },
    // hub ↔ dig gate: a switchback climb up the plateau's face
    { kind: 1, w: 48, lamps: true, pts: [[5620, 4680], [5980, 3980], [5250, 3420], [5720, 2880], [5420, 2330]] },
    // inside the dig zone: gate → tunnel cutting
    { kind: 1, w: 46, lamps: false, pts: [[5420, 2300], [5470, 1850], [5570, 1460], [5600, 1240]] },
    { kind: 0, w: 30, lamps: false, pts: [[5470, 1900], [5200, 2080]] },
    { kind: 0, w: 28, lamps: false, pts: [[5500, 1850], [6250, 1980]] },
    // camp gate ↔ supply line carts
    { kind: 0, w: 30, lamps: false, pts: [[4980, 7250], [4400, 7200]] },
    // worker camp ↔ oasis ↔ ruins (far west)
    { kind: 0, w: 32, lamps: true, pts: [[2200, 5260], [1500, 5080], [1100, 4300], [1250, 3500]] },
    { kind: 0, w: 28, lamps: false, pts: [[1250, 3450], [1500, 2800], [2000, 2250]] },
    // trench ↔ lookout ridge (a climbing trail)
    { kind: 0, w: 26, lamps: false, pts: [[8460, 3000], [8850, 2700], [9150, 2450], [9350, 2150]] },
    // the rail bed (levelled, no surface strip, no lamps)
    { kind: 3, w: 34, lamps: false, rail: true, pts: CH1_RAIL.slice(0, 5) },
];

// Point on the site for the menu camera / sound sources: an object's centre
function ch1At(id) {
    const o = (mapObjects[1] || []).find(q => q.id === id);
    return o ? [o.x + o.w / 2, o.y + o.h / 2] : [CH1_LAYOUT.W / 2, CH1_LAYOUT.H / 2];
}

// ---- SIGHTLINE BREAKERS ----
// Open-world maps feel big when you can't see all of them at once: the
// areas hide from each other behind terrain at three scales, rock and
// tree lines, and reveal themselves as you come over a rise. Egyptian
// versions of those:
//   - seif dunes: long knife-edged ridges running roughly north-south
//     between the areas, with low saddles where the tracks cross
//   - White Desert chalk: wind-carved "mushroom" and fin formations
//     (yardangs), in clusters; they also glow under the moon (landmarks)
//   - palms, acacia and tamarisk along the water and the dry wadi
// [points..., height, half-width]
const CH1_RIDGES = [
    { pts: [[4150, 2950], [3950, 3900], [3820, 5000], [3700, 6400], [3900, 7600]], h: 175, w: 330 },  // camp ↔ workers' camp
    { pts: [[7350, 3900], [7150, 4800], [7000, 5700], [6850, 6800], [7000, 7900]], h: 170, w: 320 },  // camp ↔ ministry
    { pts: [[6250, 6300], [6320, 7300], [6450, 8200]], h: 135, w: 280 },                // road ↔ Bedouin shelter
    { pts: [[2900, 3900], [2980, 2900], [3150, 1900]], h: 150, w: 300 },                // ruins/oasis ↔ spoil field
    { pts: [[6100, 2900], [6400, 3800], [6700, 4700], [7050, 5350]], h: 155, w: 300 },                // camp ↔ trench (the wadi's west bank)
    { pts: [[8150, 6200], [8450, 7100], [8650, 7900]], h: 140, w: 280 },                // ministry ↔ shelter
    { pts: [[1900, 6250], [3000, 6500], [4150, 6600]], h: 130, w: 280 },                // workers' camp ↔ the wreck
    { pts: [[1150, 5400], [700, 6300]], h: 120, w: 260 },                               // south-west swell
    { pts: [[9950, 2900], [10060, 4300], [10000, 5700]], h: 140, w: 240 },               // behind the ministry (kept well back)
];
// where the ridges must lie down: the places people built
const CH1_KEEPOUT = [
    [5600, 5150, 780], [2300, 4600, 760], [8950, 5300, 880], [8150, 3400, 700], [5000, 7350, 560],
    [1300, 3500, 560], [2080, 2300, 520], [3300, 3250, 520], [7400, 6900, 480], [3500, 7000, 420],
    [9380, 2130, 380], [6900, 3000, 360],
];
// chalk formation clusters: [x, z, count, scale]
const CH1_YARDANGS = [
    [4380, 4250, 4, 1.0], [7650, 6150, 4, 1.1], [1650, 6000, 3, 0.9], [6620, 2620, 3, 0.9],
    [4250, 7950, 4, 1.0], [10020, 3450, 3, 1.2], [2550, 1720, 3, 1.0], [7200, 3650, 3, 0.8],
    [4700, 3250, 3, 0.8], [1250, 2450, 3, 1.1],
];
// palm plantation between the workers' camp and the oasis, acacias in the wadi
const CH1_GROVES = [];
for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) CH1_GROVES.push([600 + c * 100 + (r % 2) * 45, 3950 + r * 130]);
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; CH1_GROVES.push([1250 + Math.cos(a) * 330, 3470 + Math.sin(a) * 260]); }
const CH1_ACACIAS = [[6780, 2880], [7020, 3160], [6650, 3250], [7180, 2800], [6900, 3380], [5900, 6200], [8700, 4600], [2600, 5700]];

// deterministic randomness (ch1_world.js's seededRng loads later)
function ch1LayoutRng(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}

// Collision for the chalk formations (the dunes you can walk over)
function ch1YardangSpots() {
    const out = [];
    const rng = ch1LayoutRng('yardangs');
    for (const [cx, cz, n, sc] of CH1_YARDANGS) {
        for (let i = 0; i < n; i++) {
            const a = rng() * Math.PI * 2, d = i === 0 ? 0 : 120 + rng() * 170;
            const w = (60 + rng() * 70) * sc, l = w * (1.4 + rng() * 1.2);
            out.push({ x: cx + Math.cos(a) * d, z: cz + Math.sin(a) * d, w, l, h: (120 + rng() * 150) * sc, kind: rng() < 0.45 ? 'mushroom' : 'fin', seed: rng() * 100 });
        }
    }
    return out;
}
function ch1AddOccluderWalls() {
    const walls = mapWalls[1];
    if (!walls || walls._occ) return;
    walls._occ = true;
    for (const y of ch1YardangSpots()) {
        const fw = y.kind === 'mushroom' ? y.w * 0.55 : y.w * 0.7, fl = y.kind === 'mushroom' ? y.w * 0.55 : y.l * 0.8;
        walls.push({ x: y.x - fw / 2, y: y.z - fl / 2, w: fw, h: fl, kind: 'yardang' });
    }
    for (const [x, z] of CH1_GROVES) walls.push({ x: x - 10, y: z - 10, w: 20, h: 20, kind: 'trunk' });
    for (const [x, z] of CH1_ACACIAS) walls.push({ x: x - 9, y: z - 9, w: 18, h: 18, kind: 'trunk' });
}

relayoutChapterOne();
ch1AddOccluderWalls();

// ---- engine hooks: world size, spawn, car, patrols ----
if (typeof WORLD !== 'undefined') WORLD = { width: CH1_LAYOUT.W, height: CH1_LAYOUT.H };

// keep the Ch1 world size whenever Ch1 is the live outdoor map (engine.js
// hard-codes the old size on start, reset, interior exit and load)
function ch1EnforceWorld() {
    if (currentMapKey === 1 && !interiorState.active && WORLD.width !== CH1_LAYOUT.W) {
        WORLD = { width: CH1_LAYOUT.W, height: CH1_LAYOUT.H };
    }
}

function ch1PlaceCar() {
    ministeryCar.x = CH1_LAYOUT.car.x;
    ministeryCar.targetY = CH1_LAYOUT.car.targetY;
    if (ministeryCar.parked) ministeryCar.y = CH1_LAYOUT.car.targetY;
    else if (!ministeryCar.active) ministeryCar.y = CH1_LAYOUT.car.startY;
}

spawnChapterOneHostiles = function () {
    const m = CH1_LAYOUT.offsets.ministry, d = CH1_LAYOUT.offsets.dig;
    if (!gameState.flags.inspector_dealt) {
        const a = [3040 + m[0], 2560 + m[1]], b = [3520 + m[0], 2880 + m[1]];
        spawnHostile('guard_ministry', a[0], a[1], [
            { x: a[0], y: a[1] }, { x: b[0], y: a[1] }, { x: b[0], y: b[1] }, { x: a[0], y: b[1] }
        ]);
    }
    if (!gameState.flags.workerSeen) {
        const a = [2240 + d[0], 960 + d[1]], b = [2720 + d[0], 1248 + d[1]];
        spawnHostile('worker_panicked', a[0], a[1], [
            { x: a[0], y: a[1] }, { x: b[0], y: a[1] }, { x: b[0], y: b[1] }, { x: a[0], y: b[1] }
        ]);
    }
};

(function wrapEngine() {
    const _startGame = startGame;
    startGame = function () {
        _startGame();
        WORLD = { width: CH1_LAYOUT.W, height: CH1_LAYOUT.H };
        player.x = CH1_LAYOUT.spawn.x; player.y = CH1_LAYOUT.spawn.y;
        ch1PlaceCar();
    };
    const _loadGame = loadGame;
    loadGame = function () {
        let oldLayout = false;
        try {
            const d = JSON.parse(localStorage.getItem(SAVE_KEY));
            oldLayout = !!(d && d.world && d.currentMapKey === 1 && d.world.width === 3840) ||
                        !!(d && d.interior && d.interior.returnMapKey === 1 && !d.layout);
        } catch (e) { /* ignore */ }
        const ok = _loadGame();
        if (!ok) return ok;
        if (gameState.chapter === 1) {
            if (oldLayout) { // a save from the old boxed map: resume at the tents
                if (interiorState.active) { interiorState.returnX = CH1_LAYOUT.spawn.x; interiorState.returnY = CH1_LAYOUT.spawn.y; }
                else { player.x = CH1_LAYOUT.spawn.x; player.y = CH1_LAYOUT.spawn.y; }
            }
            ch1EnforceWorld();
            ch1PlaceCar();
        }
        return ok;
    };
    // mark saves made on this layout
    const _saveGame = saveGame;
    saveGame = function () {
        const r = _saveGame();
        if (r) {
            try {
                const d = JSON.parse(localStorage.getItem(SAVE_KEY));
                d.layout = 'ch1-open-1';
                localStorage.setItem(SAVE_KEY, JSON.stringify(d));
            } catch (e) { /* ignore */ }
        }
        return r;
    };
})();
