// ============================================================
// THE CODEX OF GIZA — THE SUPPLY LINE, ALIVE (ch1_supply.js)
//
// A narrow-gauge line runs from the loading bay by the camp gate,
// south-west through a cutting in the dunes, out of the site. At the
// camp end it runs round a turning (balloon) loop, so the train always
// runs loco-first: it comes in from the haze, rounds the loop, stops at
// the bay already facing out, a worker (busy — not someone you can talk
// to) shovels spoil into three tipping skips, and the little diesel
// toots and hauls them away. The route is one path the train only ever
// moves forward along: desert → bay → loop → bay → desert.
// The "Supply Line" interaction (scene2_carts) is unchanged.
// Loaded after ch1_openworld.js, before engine3d.js.
// ============================================================

// the line itself (CH1_RAIL) is laid out in ch1_layout.js

const SUPPLY = {
    curve: null, len: 0, sBay: 0,
    train: null, cars: [], worker: null, shovel: null, heap: null,
    state: 'loading', s: 0, v: 0, timer: 0, load: 0, carIdx: 0, phase: 0,
    smoke: [], hornDone: false,
};

function ch1RailPoint(s) {
    const u = Math.max(0, Math.min(1, s / SUPPLY.len));
    const p = SUPPLY.curve.getPointAt(u), t = SUPPLY.curve.getTangentAt(u);
    const y = (typeof ch1MeshHeight === 'function' ? ch1MeshHeight(p.x, p.z) : ch1Height(p.x, p.z));
    return { x: p.x, z: p.z, y, tx: t.x, tz: t.z };
}

// ---- the train ----
function ch1MakeLoco(M) {
    const g = new THREE.Group();
    const paint = new THREE.MeshStandardMaterial({ color: 0xc8a030, roughness: 0.6, metalness: 0.2 });
    put(g, gBox(34, 8, 64), M.metalDark, 0, 10, 0);                 // frame
    put(g, gBox(30, 26, 38), paint, 0, 27, -10);                     // engine hood (front = -z)
    for (let i = 0; i < 6; i++) put(g, gBox(31, 1.4, 2), M.metalDark, 0, 30, -26 + i * 6); // grille slats
    put(g, gBox(32, 40, 22), paint, 0, 34, 20);                       // cab
    put(g, gBox(33, 12, 18), M.glass, 0, 42, 20);                     // cab windows
    put(g, gBox(36, 3, 26), M.metalDark, 0, 55, 20);                  // cab roof
    put(g, gCyl(2.4, 3, 18, 8), M.rust, 8, 46, -20);                  // exhaust stack
    put(g, gBox(10, 5, 2), M.bulb, 0, 30, -29.5).userData.noShadow = true; // headlight
    g.add(ch1GlowSprite(0, 30, -34, 50, 0xfff0c0, 0.7));
    for (const z of [-18, 18]) for (const s of [-1, 1]) subWheel(g, M, s * 15, 7, z, 7, 4);
    put(g, gBox(8, 8, 4), M.paintRed, 0, 12, -33);                    // buffer
    g.userData.len = 70;
    return g;
}
function ch1MakeSkip(M) {
    const g = new THREE.Group();
    put(g, gBox(30, 6, 44), M.metalDark, 0, 10, 0);
    for (const z of [-14, 14]) for (const s of [-1, 1]) subWheel(g, M, s * 14, 7, z, 6.5, 3);
    const bin = new THREE.Group();
    bin.position.y = 30;
    for (const s of [-1, 1]) { const w = put(bin, gBox(3, 24, 42), M.rust, s * 12, 0, 0); w.rotation.z = -s * 0.42; }
    put(bin, gBox(12, 3, 42), M.rust, 0, -11, 0);
    for (const s of [-1, 1]) put(bin, gableGeo(36, 22), M.rust, 0, -12, s * 21, s < 0 ? Math.PI : 0).scale.set(1, 1, 1);
    const load = put(bin, new THREE.SphereGeometry(16, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), M.sand, 0, -6, 0);
    load.scale.set(1.2, 0.01, 1.3);
    g.add(bin);
    g.userData = { load, bin, len: 52 };
    return g;
}

function buildCh1SupplyLine(group) {
    const M = ch1Mats();
    // the route: in from the far end, round the loop, back out the same line
    const inbound = CH1_RAIL.slice().reverse();
    const route = inbound.concat(CH1_RAIL_LOOP.slice(1), CH1_RAIL.slice(1));
    SUPPLY.curve = new THREE.CatmullRomCurve3(route.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal', 0.4);
    SUPPLY.len = SUPPLY.curve.getLength();
    // where the route passes the loop's junction (twice), and where the
    // loco's nose stops at the bay on the way out
    const [jx, jz] = CH1_RAIL[0];
    let sJ1 = 0, sJ2 = 0, sNose = 0, sHeap = 0, best1 = 1e9, best2 = 1e9;
    for (let q = 0; q <= SUPPLY.len; q += 4) {
        const p = SUPPLY.curve.getPointAt(q / SUPPLY.len);
        const d = Math.hypot(p.x - jx, p.z - jz);
        if (q < SUPPLY.len * 0.5) { if (d < best1) { best1 = d; sJ1 = q; } }
        else if (d < best2) { best2 = d; sJ2 = q; }
    }
    for (let q = sJ2; q <= SUPPLY.len; q += 2) {
        const p = SUPPLY.curve.getPointAt(q / SUPPLY.len);
        if (!sHeap && p.x <= 3960) sHeap = q;
        if (p.x <= 3800) { sNose = q; break; }
    }
    SUPPLY.sJ1 = sJ1; SUPPLY.sJ2 = sJ2;
    SUPPLY.trainLen = 70 + 3 * 52 + 4 * 6;
    SUPPLY.sBay = sNose - SUPPLY.trainLen;   // the train's rear when it stands at the bay
    SUPPLY.smoke = [];
    // rails and sleepers: the line in, and the loop (the way out is the same rails)
    const sleeperGeo = gBox(46, 3, 7);
    const n = Math.floor(sJ2 / 20);
    const sleepers = new THREE.InstancedMesh(sleeperGeo, M.woodDark, n);
    const d = new THREE.Object3D();
    let prev = null;
    for (let i = 0; i < n; i++) {
        const p = ch1RailPoint(i * 20);
        d.position.set(p.x, p.y + 1, p.z);
        d.rotation.set(0, Math.atan2(p.tx, p.tz), 0);
        d.updateMatrix();
        sleepers.setMatrixAt(i, d.matrix);
        if (prev && i % 3 === 0) {
            for (const s of [-1, 1]) {
                const nx = -p.tz * s * 15, nz = p.tx * s * 15;
                const pnx = -prev.tz * s * 15, pnz = prev.tx * s * 15;
                subBeam(group, M.steel, new THREE.Vector3(prev.x + pnx, prev.y + 3.5, prev.z + pnz), new THREE.Vector3(p.x + nx, p.y + 3.5, p.z + nz), 1.3, 4).userData.noCast = true;
            }
            prev = p;
        } else if (!prev) prev = p;
    }
    sleepers.userData.noCast = true;
    group.add(sleepers);
    // a switch lever at the loop's junction
    const jp = ch1RailPoint(sJ1);
    const lever = new THREE.Group();
    lever.position.set(jp.x - jp.tz * 34, jp.y, jp.z + jp.tx * 34);
    put(lever, gBox(14, 8, 10), M.metalDark, 0, 4, 0);
    put(lever, gCyl(1, 1, 26, 5), M.metalDark, 0, 16, 0, 0, 0.4);
    put(lever, new THREE.SphereGeometry(3, 8, 6), M.paintRed, -5, 28, 0);
    group.add(lever);
    // the cutting where the line leaves: a warning sign by the rails
    const ex = ch1RailPoint(sJ1 * 0.64);
    const sg = new THREE.Group();
    sg.position.set(ex.x - ex.tz * 60, ex.y, ex.z + ex.tx * 60);
    put(sg, gBox(4, 60, 4), M.woodDark, 0, 30, 0);
    put(sg, gBox(58, 30, 2), signMat('railnoentry', [['خطر · DANGER', 26], ['RAIL LINE — KEEP OUT', 18]], '#c8a030', '#1a1408', 256, 128), 0, 54, 0);
    sg.rotation.y = Math.atan2(ex.tx, ex.tz) + Math.PI / 2;
    group.add(sg);

    // the train
    SUPPLY.train = new THREE.Group();
    SUPPLY.cars = [ch1MakeLoco(M), ch1MakeSkip(M), ch1MakeSkip(M), ch1MakeSkip(M)];
    for (const c of SUPPLY.cars) { c.traverse(m => { if (m.isMesh && !m.userData.noShadow) m.castShadow = true; }); group.add(c); }
    SUPPLY.state = 'loading'; SUPPLY.s = SUPPLY.sBay; SUPPLY.v = 0; SUPPLY.carIdx = 1; SUPPLY.load = 0; SUPPLY.timer = 0;
    for (const c of SUPPLY.cars.slice(1)) c.userData.load.scale.y = 0.01;

    // the worker at the bay, and his shovel
    if (typeof makeHumanoid === 'function') {
        const w = makeHumanoid({ skin: '#7a5230', shirt: '#6a4a2a', pants: '#3a2a18', headwear: 'wrap', wrapColor: '#d8cfb8' });
        const arm = w.userData.arms[1];
        const shovel = new THREE.Group();
        put(shovel, gCyl(0.8, 0.8, 34, 5), M.woodPale, 0, -18, 6, 0, 0, 0).rotation.x = 1.2;
        put(shovel, gBox(9, 1.2, 11), M.steel, 0, -26, 20, 0, 0, 0).rotation.x = 0.4;
        arm.add(shovel);
        group.add(w);
        SUPPLY.worker = w;
        SUPPLY.shovel = shovel;
    }
    // the spoil heap he's working from, beside the middle skip at the bay
    const hp = ch1RailPoint(sHeap);
    SUPPLY.heapPos = new THREE.Vector3(hp.x + hp.tz * 80, hp.y, hp.z - hp.tx * 80);
    const heap = put(group, new THREE.ConeGeometry(46, 40, 12, 2), M.sand, SUPPLY.heapPos.x, SUPPLY.heapPos.y + 14, SUPPLY.heapPos.z);
    heap.scale.set(1.3, 1, 1);
    SUPPLY.placeCars();
}

SUPPLY.placeCars = function () {
    // skips first, loco last: it leads the train out along +s
    let s = SUPPLY.s;
    const order = [...SUPPLY.cars.slice(1).reverse(), SUPPLY.cars[0]];
    for (const c of order) {
        const len = c.userData.len;
        const mid = s + len / 2;
        const p = ch1RailPoint(mid), a = ch1RailPoint(mid - len / 2), b = ch1RailPoint(mid + len / 2);
        c.position.set(p.x, p.y + 1, p.z);
        c.rotation.set(Math.atan2(b.y - a.y, len) * 0.9, Math.atan2(-p.tx, -p.tz), 0);
        c.rotation.order = 'YXZ';
        c.visible = mid > 40 && mid < SUPPLY.len - 40;
        c.userData.s = mid;
        s += len + 6;
    }
};

function updateCh1SupplyLine(dt, t) {
    if (!SUPPLY.train || !SUPPLY.curve) return;
    const S = SUPPLY;
    S.timer += dt;
    const skip = S.cars[S.carIdx];
    if (S.state === 'loading') {
        // the worker: scoop at the heap, turn, throw into the skip
        const p = ch1RailPoint(skip ? skip.userData.s : S.s);
        const side = new THREE.Vector3(p.x + p.tz * 40, p.y, p.z - p.tx * 40);
        const w = S.worker;
        if (w) {
            const k = (Math.sin(S.timer * 2.2) + 1) / 2; // 0 = at heap, 1 = at skip
            w.position.copy(side).addScaledVector(new THREE.Vector3(S.heapPos.x - side.x, 0, S.heapPos.z - side.z).normalize(), 18 * (1 - k));
            w.position.y = ch1Height(w.position.x, w.position.z);
            const target = k > 0.5 ? new THREE.Vector3(p.x, 0, p.z) : S.heapPos;
            w.rotation.y += angleDiff(Math.atan2(target.x - w.position.x, target.z - w.position.z), w.rotation.y) * 0.15;
            const arms = w.userData.arms;
            arms[0].rotation.x = -0.6 - 0.7 * Math.sin(S.timer * 2.2 + 1);
            arms[1].rotation.x = -0.9 - 0.8 * Math.sin(S.timer * 2.2 + 1);
            if (Math.sin(S.timer * 2.2) > 0.97 && !S.thrown) {
                S.thrown = true;
                S.load = Math.min(1, S.load + 0.2);
                if (typeof _tone === 'function' && ch1NearPlayer(w.position, 900)) _tone(160 + Math.random() * 60, 0.06, 'triangle', 0.02);
            } else if (Math.sin(S.timer * 2.2) < 0.5) S.thrown = false;
        }
        if (skip) skip.userData.load.scale.y = Math.max(0.01, S.load);
        if (S.load >= 1) {
            S.load = 0; S.carIdx++;
            if (S.carIdx >= S.cars.length) { S.state = 'departing'; S.timer = 0; S.hornDone = false; }
        }
    } else if (S.state === 'departing') {
        if (!S.hornDone && S.timer > 0.5) {
            S.hornDone = true;
            if (typeof _tone === 'function' && ch1NearPlayer(S.cars[0].position, 2600)) { _tone(233, 0.6, 'sawtooth', 0.03); setTimeout(() => _tone(233, 0.9, 'sawtooth', 0.03), 750); }
        }
        if (S.timer > 1.8) { S.v = Math.min(95, S.v + 12 * dt); S.s += S.v * dt; }
        if (S.worker) { S.worker.userData.arms[1].rotation.x = S.timer < 4 ? -2.6 + Math.sin(S.timer * 9) * 0.4 : 0; } // a wave
        if (S.s > S.len) { S.state = 'away'; S.timer = 0; }
    } else if (S.state === 'away') {
        if (S.timer > 18) {
            // (turned round out in the desert, out of sight) — back in, loco first
            S.state = 'returning'; S.timer = 0; S.v = 70; S.s = -S.trainLen;
            for (const c of S.cars.slice(1)) c.userData.load.scale.y = 0.01;
        }
    } else if (S.state === 'returning') {
        const remain = S.sBay - S.s;
        let v = Math.max(12, Math.min(90, remain * 0.35));
        // take the loop's tight curve slowly
        if (S.s + S.trainLen > S.sJ1 - 60 && S.s < S.sJ2) v = Math.min(v, 45);
        S.v += (v - S.v) * Math.min(1, dt * 2);
        S.s += S.v * dt;
        if (S.s >= S.sBay) { S.s = S.sBay; S.state = 'loading'; S.carIdx = 1; S.load = 0; S.timer = 0; }
    }
    // tip the skips a touch as they roll; diesel smoke while moving
    const moving = S.state === 'departing' || S.state === 'returning';
    S.placeCars();
    if (moving && Math.random() < dt * 8) ch1SupplySmoke();
    for (let i = S.smoke.length - 1; i >= 0; i--) {
        const p = S.smoke[i];
        p.age += dt;
        p.sprite.position.y += dt * 30;
        const sz = 14 + p.age * 40;
        p.sprite.scale.set(sz, sz, 1);
        p.sprite.material.opacity = Math.max(0, 0.35 * (1 - p.age / 2.5));
        if (p.age > 2.5) { p.sprite.parent && p.sprite.parent.remove(p.sprite); S.smoke.splice(i, 1); }
    }
}

function ch1SupplySmoke() {
    const loco = SUPPLY.cars[0];
    if (!loco.visible || !loco.parent) return;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTex('c1smoke', []), color: 0x4a4a50, transparent: true, depthWrite: false, opacity: 0.3 }));
    const v = new THREE.Vector3(8, 56, -20).applyMatrix4(loco.matrixWorld);
    s.position.copy(v);
    s.userData.noShadow = true;
    loco.parent.add(s);
    SUPPLY.smoke.push({ sprite: s, age: 0 });
}

function ch1NearPlayer(pos, r) {
    return Math.hypot(pos.x - (player.x + player.size / 2), pos.z - (player.y + player.size / 2)) < r;
}

// The loading bay (the "Supply Line" object): the siding's surroundings;
// the train, rails and worker are the living parts built above
CH1_BUILDERS.carts = function (o, M, rng) {
    const g = new THREE.Group();
    put(g, gBox(90, 30, 3), signMat('supplyline', [['خط الإمداد', 30], ['SUPPLY LINE — SPOIL TO TIP', 18]], '#e8e0c8', '#3a2a14', 256, 96), -40, 60, -70);
    for (const s of [-1, 1]) put(g, gBox(4, 70, 4), M.woodDark, -40 + s * 42, 35, -71);
    subCrate(g, M, 110, 0, 60, 30, 0.3);
    subDrum(g, M.paintBlue, M, 140, 70, 13);
    put(g, gCyl(1.4, 1.8, 60, 6), M.woodDark, -150, 30, 50);
    ch1Lamp(g, -150, 62, 50, { intensity: 1.2, dist: 420, glow: 40 });
    g.userData.h = 70;
    g.userData.keep = true;
    return g;
};
