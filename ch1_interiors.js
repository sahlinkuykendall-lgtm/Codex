// ============================================================
// THE CODEX OF GIZA — CHAPTER 1 INTERIORS (ch1_interiors.js, 3D)
//
// Ellis' tent, the workers' dormitory and the foreman's office, built
// room by room around the existing collision rects and interactables
// (data.js INT_TENT / INT_DORM / INT_FOREMAN — nothing about them moves).
// Warm lamplight, tone mapped with the Brightness setting like the camp.
// Loaded after ch1_props.js, before engine3d.js.
// ============================================================

const CH1_INTERIORS = { INT_TENT: true, INT_DORM: true, INT_FOREMAN: true };
function ch1IsArtInterior(key) { return !!CH1_INTERIORS[key] && gameState.chapter === 1; }

function intLamp(group, x, y, z, opts) {
    opts = opts || {};
    const color = opts.color || 0xffb060;
    const l = new THREE.PointLight(color, opts.intensity || 1.4, opts.dist || 520, 2);
    l.position.set(x, y, z);
    group.add(l);
    flickerLights.push({ light: l, base: l.intensity, phase: Math.random() * 10, steady: !!opts.steady });
    const glow = ch1GlowSprite(x, y, z, opts.glow || 34, color, 0.6);
    group.add(glow);
    return l;
}

function intHurricaneLamp(group, M, x, y, z) {
    put(group, gCyl(3.4, 4.2, 2, 10), M.metalDark, x, y + 1, z);
    put(group, gCyl(2.8, 2.8, 7, 10), new THREE.MeshBasicMaterial({ color: 0xffc070, toneMapped: false }), x, y + 5.5, z).userData.noShadow = true;
    put(group, gCyl(1.6, 3.4, 3, 10), M.metalDark, x, y + 10, z);
    put(group, new THREE.TorusGeometry(2.4, 0.3, 4, 10, Math.PI), M.metalDark, x, y + 12, z);
}

// the night seen through a doorway / window
function intNightPane(w, h) {
    const tex = makeTex('c1nightpane', 128, 128, 1, 1, (cc, W, H) => {
        const g = cc.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#05070f'); g.addColorStop(0.7, '#101624'); g.addColorStop(1, '#2a2a2c');
        cc.fillStyle = g; cc.fillRect(0, 0, W, H);
        for (let i = 0; i < 40; i++) { cc.fillStyle = `rgba(220,225,255,${Math.random() * 0.8})`; cc.fillRect(Math.random() * W, Math.random() * H * 0.6, 1, 1); }
        cc.fillStyle = '#6a5a44'; cc.fillRect(0, H * 0.82, W, H * 0.18);            // sand beyond
    });
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, fog: false }));
}

function intFloor(group, W, H, mat, repeat) {
    const m = mat.clone();
    if (m.map) { m.map = m.map.clone(); m.map.needsUpdate = true; m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping; m.map.repeat.set(repeat[0], repeat[1]); }
    const f = put(group, new THREE.PlaneGeometry(W, H), m, W / 2, 0, H / 2);
    f.rotation.x = -Math.PI / 2;
    f.receiveShadow = true;
    return f;
}

// A wall panel along one edge, with an optional opening (x0..x1)
function intWall(group, mat, ax, az, bx, bz, h, gap, repeat) {
    const len = Math.hypot(bx - ax, bz - az), ang = Math.atan2(bz - az, bx - ax);
    const seg = (s0, s1, y0, y1) => {
        if (s1 - s0 < 1 || y1 - y0 < 1) return;
        const m = mat.clone();
        if (m.map) { m.map = m.map.clone(); m.map.needsUpdate = true; m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping; m.map.repeat.set((s1 - s0) / (repeat || 120), (y1 - y0) / (repeat || 120)); }
        const p = put(group, new THREE.PlaneGeometry(s1 - s0, y1 - y0), m, ax + Math.cos(ang) * (s0 + s1) / 2, (y0 + y1) / 2, az + Math.sin(ang) * (s0 + s1) / 2, -ang);
        p.material.side = THREE.DoubleSide;
    };
    if (!gap) { seg(0, len, 0, h); return; }
    seg(0, gap[0], 0, h); seg(gap[1], len, 0, h); seg(gap[0], gap[1], gap[2] || h, h);
}

function buildCh1Interior(group, scene) {
    const M = ch1Mats();
    scene.background = new THREE.Color(0x050403);
    scene.fog = new THREE.Fog(0x050403, 500, 2200);
    fogBase = [500, 2200];
    group.add(new THREE.HemisphereLight(0x3a3228, 0x14100a, 0.35));
    const key = currentMapKey;
    if (key === 'INT_TENT') intBuildTent(group, M);
    else if (key === 'INT_DORM') intBuildDorm(group, M);
    else intBuildForeman(group, M);
    // everything casts/receives in these small rooms (no shadow map, but keep flags tidy)
    group.traverse(o => { if (o.isMesh) o.receiveShadow = true; });
}

// ---- ELLIS' TENT (500 × 520, door gap x 180–320 in the south wall) ----
function intBuildTent(g, M) {
    const W = 500, H = 520, wallH = 72, ridge = 176;
    // groundsheet and rugs
    intFloor(g, W, H, M.canvasDark, [4, 4]);
    for (const [x, z, w, d, r] of [[250, 300, 260, 180, 0.04], [120, 250, 150, 110, -0.1], [380, 380, 140, 90, 0.2]]) {
        const rug = put(g, new THREE.PlaneGeometry(w, d), M.rug, x, 0.6, z, r);
        rug.rotation.x = -Math.PI / 2; rug.rotation.z = r;
    }
    // canvas walls and the sloping roof on a ridge pole
    intWall(g, M.canvas, 0, 0, W, 0, wallH, null, 160);
    intWall(g, M.canvas, 0, 0, 0, H, wallH, null, 160);
    intWall(g, M.canvas, W, 0, W, H, wallH, null, 160);
    intWall(g, M.canvas, 0, H, W, H, wallH, [180, 320, 130], 160);
    const slope = Math.hypot(W / 2, ridge - wallH), ang = Math.atan2(ridge - wallH, W / 2);
    for (const s of [-1, 1]) {
        const roof = put(g, sagPlane(H + 10, slope, 5, 12, 5), M.canvas, W / 2 + s * W / 4, (wallH + ridge) / 2, H / 2);
        orientPlane(roof, new THREE.Vector3(0, 0, 1), new THREE.Vector3(-s * W / 2, ridge - wallH, 0));
        roof.material = roof.material.clone(); roof.material.side = THREE.DoubleSide;
    }
    for (const z of [0, H]) {
        const gb = put(g, gableGeo(W, ridge - wallH), M.canvas, W / 2, wallH, z);
        gb.material = gb.material.clone(); gb.material.side = THREE.DoubleSide;
    }
    put(g, gCyl(3, 3, H, 8), M.woodDark, W / 2, ridge - 3, H / 2, 0, 0, 0).rotation.x = Math.PI / 2;  // ridge pole
    for (const z of [8, H - 8]) put(g, gCyl(3.5, 4, ridge, 8), M.woodDark, W / 2, ridge / 2, z);
    // the doorway: flaps tied back, the night outside
    for (const s of [-1, 1]) put(g, gCyl(8, 8, 120, 10), M.canvasDark, 250 + s * 78, 62, H - 4);
    const night = intNightPane(140, 130); night.position.set(250, 65, H + 30); g.add(night);

    // trunks and crates (collision rect 40,40,150,100)
    subCrate(g, M, 80, 0, 70, 50, 0.1);
    subCrate(g, M, 150, 0, 80, 44, -0.15);
    subCrate(g, M, 90, 40, 76, 36, 0.3);
    put(g, gBox(60, 34, 36), M.paintGreen, 160, 17, 120, 0.05);                  // tin trunk
    put(g, gBox(62, 3, 38), M.metalDark, 160, 35, 120, 0.05);
    // the cot and a camp chest at its head (rect 300,40,160,100; cot object 310,100)
    const cot = new THREE.Group(); cot.position.set(375, 0, 110);
    put(cot, gBox(130, 5, 46), M.canvasDark, 0, 26, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) subBeam(cot, M.woodPale, new THREE.Vector3(sx * 60, 0, sz * 20), new THREE.Vector3(sx * 52, 26, -sz * 20), 1.4);
    put(cot, gBox(118, 7, 42), M.tarp, 4, 31, 0);                                // blanket
    put(cot, gBox(30, 9, 28), M.paper, -48, 34, 0);                             // pillow
    g.add(cot);
    put(g, gBox(46, 30, 34), M.woodDark, 340, 15, 60);
    intHurricaneLamp(g, M, 340, 30, 60);
    intLamp(g, 340, 36, 60, { intensity: 0.9, dist: 300, glow: 24 });
    // low bookshelf (rect 40,190,70,18)
    put(g, gBox(70, 40, 18), M.wood, 75, 20, 199);
    for (let i = 0; i < 9; i++) put(g, gBox(5 + (i % 3), 18 + (i * 7) % 9, 14), [M.paintRed, M.clothBlue, M.paper, M.paintGreen][i % 4], 46 + i * 7, 26 + ((i * 7) % 9) / 2, 199);
    // the work table and the Codex, under the hanging lamp (object 200,100 80×50)
    const tbl = new THREE.Group(); tbl.position.set(240, 0, 125);
    subTable(tbl, M, 130, 70, 34, M.woodPale);
    put(tbl, gBox(26, 3, 18), M.paper, -34, 35.5, 8, 0.3);                       // notes
    put(tbl, gBox(18, 2, 24), M.paper, -40, 36, -14, -0.2);
    put(tbl, gBox(16, 8, 11), M.amber, 6, 38, 0).userData.noShadow = true;       // the Codex, faintly alive
    tbl.add(ch1GlowSprite(6, 42, 0, 30, 0xd4af37, 0.35));
    put(tbl, gCyl(5, 6, 2, 12), M.steel, 36, 35, 10);                            // loupe on its stand
    put(tbl, gCyl(1, 1, 10, 6), M.steel, 36, 40, 10);
    put(tbl, gCyl(4, 4, 1, 12), M.glass, 40, 45, 10, 0, 0, 0.8);
    g.add(tbl);
    put(g, gCyl(0.4, 0.4, 60, 4), M.dark, 240, ridge - 32, 125);                 // lamp cord from the ridge
    intHurricaneLamp(g, M, 240, ridge - 74, 125);
    intLamp(g, 240, ridge - 68, 125, { intensity: 1.6, dist: 560, glow: 40 });
    // the journal desk (object 60,230) and a camp chair
    const desk = new THREE.Group(); desk.position.set(95, 0, 262);
    subTable(desk, M, 70, 44, 30);
    put(desk, gBox(20, 3, 14), new THREE.MeshStandardMaterial({ color: 0x5a3a1a }), 0, 31.5, 0, 0.2);   // the journal
    put(desk, gCyl(0.6, 0.6, 12, 5), M.dark, 14, 32, 4, 0, 1.3);                                       // pencil
    g.add(desk);
    const ch = new THREE.Group(); ch.position.set(95, 0, 305); ch.rotation.y = Math.PI;
    put(ch, gBox(26, 2, 24), M.canvasDark, 0, 20, 0); put(ch, gBox(26, 24, 2), M.canvasDark, 0, 32, -12, 0, 0, -0.1);
    for (const s of [-1, 1]) subBeam(ch, M.steel, new THREE.Vector3(s * 12, 0, -12), new THREE.Vector3(s * 12, 20, 12), 0.9);
    g.add(ch);
    // the photograph board (object 360,280): an easel with pinned prints
    const easel = new THREE.Group(); easel.position.set(395, 0, 305); easel.rotation.y = -0.5;
    for (const s of [-1, 1]) subBeam(easel, M.woodDark, new THREE.Vector3(s * 26, 0, 6), new THREE.Vector3(s * 20, 96, 0), 1.6);
    put(easel, gBox(64, 50, 2), M.planksDark, 0, 70, 0);
    const photoTex = makeTex('c1photos', 128, 96, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#3a2c1c'; cc.fillRect(0, 0, w, h);
        for (let i = 0; i < 7; i++) {
            const x = 6 + (i % 4) * 30, y = 6 + Math.floor(i / 4) * 44;
            cc.fillStyle = '#e8e0cc'; cc.fillRect(x, y, 26, 34);
            cc.fillStyle = ['#6a5a44', '#4a4a50', '#7a6a50', '#5a4a3a'][i % 4]; cc.fillRect(x + 2, y + 2, 22, 22);
            cc.fillStyle = '#b8a888'; cc.fillRect(x + 2, y + 26, 18, 2);
            cc.fillStyle = '#a02020'; cc.beginPath(); cc.arc(x + 13, y + 2, 2, 0, 7); cc.fill();
        }
    });
    put(easel, gBox(60, 45, 0.5), new THREE.MeshStandardMaterial({ map: photoTex, roughness: 0.9 }), 0, 70, 1.4);
    g.add(easel);
    // odds and ends: boots, a water jerrycan, a coat on a peg
    put(g, gBox(10, 12, 20), M.dark, 440, 6, 440, 0.3); put(g, gBox(10, 12, 20), M.dark, 454, 6, 446, 0.1);
    put(g, gBox(22, 34, 12), M.paintGreen, 450, 17, 230);
    put(g, gBox(34, 50, 3), M.tarp, 30, 52, 350, Math.PI / 2, 0, 0.08);
}

// ---- THE WORKERS' DORMITORY (700 × 520, door gap x 280–420) ----
function intBuildDorm(g, M) {
    const W = 700, H = 520, wallH = 112, ridge = 170;
    intFloor(g, W, H, M.planks, [5, 4]);
    for (const [ax, az, bx, bz, gap] of [[0, 0, W, 0], [0, 0, 0, H], [W, 0, W, H], [0, H, W, H, [280, 420, 96]]]) intWall(g, M.planks, ax, az, bx, bz, wallH, gap, 140);
    // corrugated gable roof with rafters and a tie beam
    const slope = Math.hypot(H / 2 + 10, ridge - wallH), ang = Math.atan2(ridge - wallH, H / 2);
    for (const s of [-1, 1]) {
        const r = put(g, new THREE.PlaneGeometry(W, slope), M.corrugated, W / 2, (wallH + ridge) / 2, H / 2 + s * H / 4);
        orientPlane(r, new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, ridge - wallH, -s * H / 2));
    }
    for (const x of [0, W]) put(g, gableGeo(H, ridge - wallH), M.planksDark, x, wallH, H / 2, Math.PI / 2).material.side = THREE.DoubleSide;
    for (let x = 60; x < W; x += 120) {
        for (const s of [-1, 1]) subBeam(g, M.woodDark, new THREE.Vector3(x, wallH, H / 2 + s * H / 2), new THREE.Vector3(x, ridge, H / 2), 3, 5);
        put(g, gBox(6, 6, H), M.woodDark, x, wallH, H / 2);
    }
    // windows: moonlight through the north wall
    for (const x of [140, 350, 560]) {
        const pane = intNightPane(60, 44); pane.position.set(x, 70, -1); pane.rotation.y = Math.PI; g.add(pane);
        put(g, gBox(70, 5, 8), M.woodDark, x, 46, 3); put(g, gBox(70, 5, 6), M.woodDark, x, 94, 3); put(g, gBox(4, 48, 6), M.woodDark, x, 70, 3);
        const moon = new THREE.PointLight(0x7890c0, 0.35, 320, 2); moon.position.set(x, 70, 40); g.add(moon);
    }
    const night = intNightPane(140, 96); night.position.set(350, 48, H + 20); g.add(night);
    // ten bunks (double-decker) where the rects are
    const bunks = [[40, 60], [170, 60], [300, 60], [430, 60], [560, 60], [40, 190], [170, 190], [300, 190], [430, 190], [560, 190]];
    const blankets = [M.clothBlue, M.paintRed, M.tarp, M.canvasDark, M.rug];
    bunks.forEach(([x, z], i) => {
        const b = new THREE.Group(); b.position.set(x + 45, 0, z + 25);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(b, gBox(4, 96, 4), M.metalDark, sx * 44, 48, sz * 23);
        for (const y of [18, 62]) {
            put(b, gBox(90, 3, 48), M.metalDark, 0, y, 0);
            put(b, gBox(84, 6, 44), M.paper, 0, y + 4, 0);                                  // mattress
            const bl = put(b, gBox(70, 3, 46), blankets[(i + y) % blankets.length], 8, y + 8, 0, 0, 0, (i % 2) * 0.05);
            put(b, gBox(16, 6, 28), M.paper, -34, y + 10, 0);                                // pillow
        }
        g.add(b);
        if (i % 3 === 0) { put(g, gBox(10, 10, 18), M.dark, x + 20, 5, z + 62, 0.3); put(g, gBox(10, 10, 18), M.dark, x + 34, 5, z + 64, -0.2); } // boots
    });
    // clothes on a line across the room, a kettle on a stool, the talisman on its cot
    const a = new THREE.Vector3(20, 96, 150), b = new THREE.Vector3(680, 96, 150);
    const line = subRope(g, M.rope, a, b, 10, 0.5);
    for (let i = 1; i < 9; i++) {
        const p = line.getPoint(i / 9);
        const c = put(g, new THREE.PlaneGeometry(22, 30), [M.clothBlue, M.canvas, M.paintRed, M.tarp][i % 4], p.x, p.y - 15, p.z);
        c.material = c.material.clone(); c.material.side = THREE.DoubleSide;
    }
    put(g, gCyl(10, 9, 22, 10), M.woodPale, 640, 11, 400);
    put(g, gCyl(6, 8, 10, 12), M.dark, 640, 27, 400);
    // talisman (object 200,155): a blue-bead eye hanging over the cot
    put(g, gCyl(0.3, 0.3, 20, 3), M.rope, 250, 100, 182);
    put(g, new THREE.SphereGeometry(4, 10, 8), new THREE.MeshStandardMaterial({ color: 0x1a50b0, roughness: 0.2, emissive: 0x0a1a40 }), 250, 88, 182);
    // scratches on the west wall (object 50,300)
    const scr = makeTex('c1scratches', 128, 128, 1, 1, (cc, w, h) => {
        cc.clearRect(0, 0, w, h);
        cc.strokeStyle = 'rgba(230,220,200,0.8)'; cc.lineWidth = 1.5;
        for (let r = 0; r < 5; r++) for (let i = 0; i < 5; i++) { cc.beginPath(); cc.moveTo(10 + i * 6 + r * 22, 20 + r * 18); cc.lineTo(10 + i * 6 + r * 22, 34 + r * 18); cc.stroke(); }
        cc.beginPath(); cc.arc(90, 90, 14, 0, 7); cc.stroke(); cc.beginPath(); cc.arc(90, 90, 4, 0, 7); cc.stroke();
    });
    const sp = put(g, new THREE.PlaneGeometry(70, 70), new THREE.MeshStandardMaterial({ map: scr, transparent: true, roughness: 1 }), 2, 60, 325, Math.PI / 2);
    // lamps: one lantern still burning low by the sleepless worker
    intHurricaneLamp(g, M, 550, 0, 170);
    intLamp(g, 550, 8, 170, { intensity: 1.1, dist: 360, glow: 26 });
    put(g, gCyl(0.4, 0.4, 40, 4), M.dark, 350, ridge - 30, 300);
    intHurricaneLamp(g, M, 350, ridge - 64, 300);
    intLamp(g, 350, ridge - 58, 300, { intensity: 0.8, dist: 520, glow: 30 });
}

// ---- THE FOREMAN'S OFFICE (600 × 520, door gap x 250–350) ----
function intBuildForeman(g, M) {
    const W = 600, H = 520, wallH = 130;
    // tiled floor
    const tile = makeTex('c1tiles', 256, 256, 1, 1, (cc, w, h) => {
        for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
            const v = ((x + y) % 2 ? 150 : 120) + Math.random() * 20;
            cc.fillStyle = `rgb(${v | 0},${(v * 0.9) | 0},${(v * 0.76) | 0})`; cc.fillRect(x * 32, y * 32, 31, 31);
        }
        blotches(cc, w, h, ['rgba(90,70,50,A)'], 10, 10, 40, 0.2);
    });
    intFloor(g, W, H, new THREE.MeshStandardMaterial({ map: tile, roughness: 0.7 }), [3, 3]);
    for (const [ax, az, bx, bz, gap] of [[0, 0, W, 0], [0, 0, 0, H], [W, 0, W, H], [0, H, W, H, [250, 350, 100]]]) intWall(g, M.plaster, ax, az, bx, bz, wallH, gap, 180);
    const ceil = put(g, new THREE.PlaneGeometry(W, H), M.plaster, W / 2, wallH, H / 2); ceil.rotation.x = Math.PI / 2;
    // ceiling fan, turning slowly
    const fan = new THREE.Group(); fan.position.set(W / 2, wallH - 18, 260);
    put(fan, gCyl(0.8, 0.8, 16, 5), M.metalDark, 0, 8, 0);
    put(fan, gCyl(6, 6, 5, 10), M.metalDark, 0, 0, 0);
    for (let i = 0; i < 4; i++) { const bl = put(fan, gBox(60, 1, 10), M.woodDark, Math.cos(i * Math.PI / 2) * 32, -1, Math.sin(i * Math.PI / 2) * 32); bl.rotation.y = -i * Math.PI / 2; }
    g.add(fan);
    CH1_INT_SPIN.push(fan);
    // windows east and west, shuttered, the night beyond
    for (const [x, rot] of [[-1, Math.PI / 2], [W + 1, -Math.PI / 2]]) {
        const pane = intNightPane(60, 50); pane.position.set(x, 76, 300); pane.rotation.y = rot; g.add(pane);
        for (const s of [-1, 1]) put(g, gBox(3, 54, 30), M.paintBlue, x + (x < 0 ? 2 : -2), 76, 300 + s * 40, 0, 0, 0);
    }
    const night = intNightPane(100, 100); night.position.set(300, 50, H + 20); g.add(night);
    // shelves and filing cabinets along the north wall (rects 40,40,220,60 and 340,40,220,60)
    for (const x0 of [40, 340]) {
        put(g, gBox(220, 110, 8), M.woodDark, x0 + 110, 55, 44);
        for (let s = 0; s < 4; s++) {
            put(g, gBox(220, 3, 56), M.wood, x0 + 110, 8 + s * 30, 70);
            for (let i = 0; i < 14; i++) {
                if (Math.random() < 0.3) continue;
                put(g, gBox(10 + Math.random() * 6, 20, 30 + Math.random() * 10), [M.paper, M.crate, M.paintGreen, M.tarp][(i + s) % 4], x0 + 10 + i * 15, 20 + s * 30, 70, 0, 0, (Math.random() - 0.5) * 0.2);
            }
        }
    }
    // the corkboard between them (object 200,60)
    const cork = makeTex('c1cork', 256, 64, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#9a7248'; cc.fillRect(0, 0, w, h);
        speckle(cc, w, h, null, ['#7a5230', '#b88a5a'], 700, 1, 2);
        for (let i = 0; i < 12; i++) {
            cc.fillStyle = ['#e8e0c8', '#f4e8a0', '#e0e8f0'][i % 3];
            const x = 8 + i * 20 + Math.random() * 4, y = 6 + Math.random() * 20;
            cc.save(); cc.translate(x, y); cc.rotate((Math.random() - 0.5) * 0.3); cc.fillRect(0, 0, 16, 22); cc.restore();
            cc.fillStyle = '#b02020'; cc.beginPath(); cc.arc(x + 8, y + 2, 1.6, 0, 7); cc.fill();
        }
        cc.strokeStyle = '#b02020'; cc.lineWidth = 1; cc.beginPath(); cc.moveTo(20, 20); cc.lineTo(120, 40); cc.lineTo(200, 16); cc.stroke();
    });
    put(g, gBox(210, 54, 3), new THREE.MeshStandardMaterial({ map: cork, roughness: 1 }), 310, 88, 22);
    // the desk (object 200,160 200×70) with ledgers, a phone, a lamp
    const desk = new THREE.Group(); desk.position.set(300, 0, 195);
    put(desk, gBox(200, 6, 70), M.woodDark, 0, 36, 0);
    for (const sx of [-1, 1]) put(desk, gBox(60, 33, 64), M.wood, sx * 66, 16.5, 0);
    for (let i = 0; i < 4; i++) put(desk, gBox(22, 4 + i, 30), [M.paintRed, M.clothBlue, M.paper, M.crate][i], -60 + i * 3, 40 + i * 4, -8, (i - 2) * 0.05);
    put(desk, gBox(18, 7, 14), M.dark, 50, 42, -10);                       // telephone
    put(desk, gBox(40, 1.4, 28), M.paper, 0, 39.5, 6, 0.2);                 // the rota
    put(desk, gCyl(6, 7, 2, 12), M.metalDark, 72, 40, 18);                 // desk lamp
    subBeam(desk, M.metalDark, new THREE.Vector3(72, 40, 18), new THREE.Vector3(66, 62, 10), 0.8);
    put(desk, gCyl(3, 8, 8, 12, 1, true), M.paintGreen, 62, 62, 6, 0, 0, 0.5);
    g.add(desk);
    intLamp(g, 360, 64, 200, { intensity: 1.5, dist: 480, glow: 30 });
    const chair = new THREE.Group(); chair.position.set(300, 0, 150); chair.rotation.y = Math.PI;
    put(chair, gBox(30, 4, 30), M.woodDark, 0, 24, 0); put(chair, gBox(30, 34, 4), M.woodDark, 0, 42, -14);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(chair, gBox(3, 24, 3), M.woodDark, sx * 13, 12, sz * 13);
    g.add(chair);
    // counter (rect 200,250,200,20)
    put(g, gBox(200, 44, 20), M.wood, 300, 22, 260);
    put(g, gBox(204, 3, 24), M.woodDark, 300, 45, 260);
    // the manifest clipboard on a hook (object 60,290) and Sam's box (object 380,290)
    put(g, gBox(2, 30, 22), M.wood, 3, 70, 315); put(g, gBox(1, 24, 18), M.paper, 4.5, 70, 315);
    subCrate(g, M, 430, 0, 315, 40, 0.2);
    put(g, gBox(30, 10, 22), M.paper, 430, 36, 315, 0.1);
    put(g, gBox(22, 4, 16), new THREE.MeshStandardMaterial({ color: 0x4a2a1a }), 432, 43, 313, -0.2);
    // a paraffin heater, a water cooler, a map on the wall
    put(g, gCyl(12, 12, 30, 12), M.paintRed, 560, 15, 460);
    put(g, gBox(30, 70, 30), M.paintWhite, 40, 35, 460); put(g, gCyl(12, 12, 24, 12), M.clothBlue, 40, 82, 460);
    const map = makeTex('c1sitemap', 128, 96, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#e8dcc0'; cc.fillRect(0, 0, w, h);
        cc.strokeStyle = '#6a5a44'; cc.lineWidth = 1;
        for (let i = 0; i < 12; i++) { cc.beginPath(); cc.moveTo(0, i * 8); cc.lineTo(w, i * 8 + 4); cc.stroke(); }
        cc.fillStyle = '#b02020'; cc.fillRect(60, 30, 10, 8); cc.fillRect(90, 60, 6, 6);
        cc.strokeStyle = '#1a3a6a'; cc.lineWidth = 2; cc.strokeRect(20, 20, 80, 50);
    });
    put(g, gBox(3, 60, 80), new THREE.MeshStandardMaterial({ map, roughness: 1 }), W - 3, 78, 120);
    // a bare bulb over the door
    put(g, new THREE.SphereGeometry(3, 8, 6), M.bulb, 300, wallH - 8, 470).userData.noShadow = true;
    intLamp(g, 300, wallH - 10, 470, { intensity: 0.9, dist: 380, glow: 26, steady: true });
}

const CH1_INT_SPIN = [];
function updateCh1Interiors() {
    for (let i = CH1_INT_SPIN.length - 1; i >= 0; i--) {
        const f = CH1_INT_SPIN[i];
        if (!f.parent) { CH1_INT_SPIN.splice(i, 1); continue; }
        f.rotation.y += 0.03;
    }
}

// Interactables in these rooms are drawn by the room builders; each
// object only carries its floating label (and a person stands as a figure)
function buildCh1InteriorObject(o) {
    const g = new THREE.Group();
    g.position.set(o.x + o.w / 2, 0, o.y + o.h / 2);
    const heights = { tent_codex: 60, tent_journal: 50, tent_cot: 50, tent_photos: 110, for_desk: 76, for_manifest: 100, for_sams_notes: 70, for_corkboard: 130, dorm_talisman: 110, dorm_graffiti: 110 };
    g.userData.h = heights[o.id] || 40;
    g.userData.keep = true;
    return g;
}
