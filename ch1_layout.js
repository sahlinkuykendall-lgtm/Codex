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
];

// Point on the site for the menu camera / sound sources: an object's centre
function ch1At(id) {
    const o = (mapObjects[1] || []).find(q => q.id === id);
    return o ? [o.x + o.w / 2, o.y + o.h / 2] : [CH1_LAYOUT.W / 2, CH1_LAYOUT.H / 2];
}

relayoutChapterOne();

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
