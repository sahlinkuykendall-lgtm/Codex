// ============================================================
// THE CODEX OF GIZA — CHAPTER 1 PROPS (ch1_props.js)
//
// Buildings, vehicles, fences and set dressing for the Giza dig camp.
// Loaded after ch1_world.js (uses its materials, rocks, lamps and FX).
//
// Every builder receives the (scaled) map object and returns a
// THREE.Group centred on the footprint centre, seated at ground level,
// with userData.h = visual height (the floating label sits above it).
// Local axes: +x east, +z south (2D "down"), +y up.
// ============================================================

// ---- SHARED SHAPES ----
function subTable(g, M, w, d, h, mat) {
    put(g, gBox(w, 4, d), mat || M.wood, 0, h - 2, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        put(g, gBox(4, h - 4, 4), M.woodDark, sx * (w / 2 - 5), (h - 4) / 2, sz * (d / 2 - 5));
    }
    put(g, gBox(w - 10, 3, 3), M.woodDark, 0, h * 0.3, d / 2 - 5);
    return h;
}

function subCrate(g, M, x, y, z, s, ry) {
    return put(g, gBox(s, s * 0.8, s), M.crate, x, y + s * 0.4, z, ry || 0);
}

function subCrateStack(g, M, w, d, rng) {
    const n = 3 + (rng() * 3 | 0);
    let top = 0;
    const s0 = Math.min(w, d) * 0.46;
    // a bottom row, then a couple stacked
    const spots = [[-w * 0.22, -d * 0.18], [w * 0.2, -d * 0.1], [-w * 0.05, d * 0.22], [w * 0.24, d * 0.2]];
    for (let i = 0; i < Math.min(n, spots.length); i++) {
        const s = s0 * (0.8 + rng() * 0.35);
        subCrate(g, M, spots[i][0], 0, spots[i][1], s, (rng() - 0.5) * 0.4);
        top = Math.max(top, s * 0.8);
    }
    const s = s0 * 0.85;
    subCrate(g, M, -w * 0.1, s0 * 0.8, -d * 0.08, s, (rng() - 0.5) * 0.5);
    top = Math.max(top, s0 * 0.8 + s * 0.8);
    return top + 18;
}

function subDrum(g, mat, M, x, z, r, tipped) {
    const d = new THREE.Group();
    put(d, gCyl(r, r, r * 2.7, 14), mat, 0, 0, 0);
    for (const y of [-r * 0.9, r * 0.9]) put(d, gCyl(r * 1.03, r * 1.03, 2, 14), mat, 0, y, 0); // rolling hoops
    put(d, gCyl(r * 0.2, r * 0.2, 1.5, 8), M.metalDark, r * 0.5, r * 1.36, 0); // bung
    if (tipped) { d.rotation.z = Math.PI / 2; d.position.set(x, r, z); d.rotation.y = tipped; }
    else d.position.set(x, r * 1.35, z);
    g.add(d);
    return d;
}

function subDrums(g, M, mat, w, d, rng, count) {
    const n = count || 3;
    const r = Math.min(w, d) * 0.22;
    const spots = [[-0.45, -0.3], [0.45, -0.25], [0, 0.4], [-0.5, 0.45]];
    for (let i = 0; i < n; i++) {
        const [sx, sz] = n === 1 ? [0, 0] : spots[i % spots.length];
        subDrum(g, mat, M, sx * (w / 2 - r), sz * (d / 2 - r), r, (n > 2 && i === n - 1 && rng() < 0.5) ? rng() * 3 : 0);
    }
    return r * 2.7 + 16;
}

function subSandbags(g, M, w, d, rng, rows, arc) {
    let top = 0;
    const geo = new THREE.SphereGeometry(10, 9, 6);
    for (let r = 0; r < (rows || 2); r++) {
        const n = Math.max(2, Math.round(w / 22));
        for (let i = 0; i < n; i++) {
            const t = n === 1 ? 0.5 : i / (n - 1);
            let x = -w / 2 + 11 + t * (w - 22) + (r % 2) * 7, z = (rng() - 0.5) * 3;
            if (arc) z += -Math.sin(t * Math.PI) * arc;
            const b = put(g, geo, M.sandbag, x, 5 + r * 8.5, z, (rng() - 0.5) * 0.3);
            b.scale.set(1.25, 0.52, 0.8);
        }
        top = 10 + r * 8.5;
    }
    return top + 10;
}

function subWheel(g, M, x, y, z, r, width) {
    const w = new THREE.Group();
    put(w, gCyl(r, r, width || r * 0.7, 16), M.rubber, 0, 0, 0);
    put(w, gCyl(r * 0.55, r * 0.55, (width || r * 0.7) + 0.6, 12), M.steel, 0, 0, 0);
    put(w, gCyl(r * 0.18, r * 0.18, (width || r * 0.7) + 1.4, 8), M.metalDark, 0, 0, 0);
    w.rotation.x = Math.PI / 2;
    w.position.set(x, y, z);
    g.add(w);
    return w;
}

// Stick of wood/pipe between two points
function subBeam(g, mat, a, b, r, sides) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const m = new THREE.Mesh(gCyl(r, r, len, sides || 6), mat);
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    g.add(m);
    return m;
}

// Rope with a natural sag between two points
function subRope(g, mat, a, b, sag, r) {
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.y -= sag;
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, r || 0.8, 4, false), mat);
    m.userData.noCast = true;
    g.add(m);
    return curve;
}

// A throwing dart: steel barrel, shaft and three flights, pointing -z
function ch1MakeDart(M) {
    const d = new THREE.Group();
    put(d, new THREE.ConeGeometry(0.35, 3, 6), M.steel, 0, 0, -8.5, 0, 0, 0).rotation.x = -Math.PI / 2;
    put(d, gCyl(0.6, 0.6, 5, 8), new THREE.MeshStandardMaterial({ color: 0x8a7a50, roughness: 0.35, metalness: 0.7 }), 0, 0, -4.5).rotation.x = Math.PI / 2;
    put(d, gCyl(0.3, 0.3, 5, 6), M.dark, 0, 0, 0.5).rotation.x = Math.PI / 2;
    const flightMat = new THREE.MeshStandardMaterial({ color: 0xc8a030, side: THREE.DoubleSide, roughness: 0.7 });
    for (let i = 0; i < 3; i++) {
        const f = put(d, new THREE.PlaneGeometry(3.4, 2.6), flightMat, 0, 0, 3.2);
        f.rotation.set(0, Math.PI / 2, i * Math.PI / 3);
        f.geometry.translate(0, 1.3, 0);
    }
    return d;
}

// Orient a plane so its local +x runs along xAxis and local +y along yDir
function orientPlane(mesh, xAxis, yDir) {
    const x = xAxis.clone().normalize();
    const y = yDir.clone().normalize();
    const z = new THREE.Vector3().crossVectors(x, y).normalize();
    mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

// Gable (triangle) shape geometry, base on y=0
function gableGeo(w, h) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
    return new THREE.ShapeGeometry(s);
}

// A sheet (plane) sagging in the middle, for canvas roofs
function sagPlane(w, h, sag, segW, segH) {
    const geo = new THREE.PlaneGeometry(w, h, segW || 10, segH || 6);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
        const u = p.getX(i) / w + 0.5, v = p.getY(i) / h + 0.5;
        const bays = Math.abs(Math.sin(u * Math.PI * 3));
        p.setZ(i, -sag * Math.sin(v * Math.PI) * (0.4 + 0.6 * bays));
    }
    geo.computeVertexNormals();
    return geo;
}

// Canvas-texture sign with text
function signMat(key, lines, bg, fg, w, h) {
    const tex = makeTex('sign_' + key, w || 256, h || 128, 1, 1, (cc, W, H) => {
        cc.fillStyle = bg; cc.fillRect(0, 0, W, H);
        cc.strokeStyle = fg; cc.lineWidth = 6; cc.strokeRect(6, 6, W - 12, H - 12);
        cc.fillStyle = fg; cc.textAlign = 'center'; cc.textBaseline = 'middle';
        lines.forEach((l, i) => {
            cc.font = `bold ${l[1]}px Arial, sans-serif`;
            cc.fillText(l[0], W / 2, H * (i + 1) / (lines.length + 1));
        });
        blotches(cc, W, H, ['rgba(90,70,40,A)'], 6, 10, 40, 0.25);
    });
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 });
}

// String of festoon bulbs between points (glow only — no extra lights)
function subFestoon(g, M, pts, sag, spacing) {
    for (let i = 0; i < pts.length - 1; i++) {
        const curve = subRope(g, M.metalDark, pts[i], pts[i + 1], sag, 0.5);
        const n = Math.max(2, Math.round(pts[i].distanceTo(pts[i + 1]) / (spacing || 34)));
        for (let k = 1; k < n; k++) {
            const p = curve.getPoint(k / n);
            put(g, new THREE.SphereGeometry(1.8, 6, 5), M.bulb, p.x, p.y - 2.5, p.z).userData.noShadow = true;
            const glow = ch1GlowSprite(p.x, p.y - 2.5, p.z, 16, 0xffc070, 0.55);
            g.add(glow);
        }
    }
}

// ============================================================
// BUILDINGS
// ============================================================
const CH1_BUILDERS = {

    // — Ellis' tent: a big canvas wall tent, gable to the south with the
    //   door, a porch fly on poles, lamplight inside —
    tent_bldg(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w, d = o.h, wallH = 52, ridge = 132;
        const rise = ridge - wallH;
        // side walls (east/west)
        for (const s of [-1, 1]) {
            const wall = put(g, sagPlane(d, wallH, 1.2, 8, 2), M.canvas, s * w / 2, wallH / 2, 0, s * Math.PI / 2);
            wall.userData.noCast = false;
        }
        // back wall (north) pentagon
        const back = new THREE.Shape();
        back.moveTo(-w / 2, 0); back.lineTo(w / 2, 0); back.lineTo(w / 2, wallH); back.lineTo(0, ridge); back.lineTo(-w / 2, wallH); back.closePath();
        put(g, new THREE.ShapeGeometry(back), M.canvas, 0, 0, -d / 2, Math.PI);
        // front wall with the door opening
        const front = back.clone();
        const hole = new THREE.Path();
        const dw = 96, dh = 98;
        hole.moveTo(-dw / 2, 0); hole.lineTo(dw / 2, 0); hole.lineTo(dw / 2, dh - 16); hole.lineTo(0, dh); hole.lineTo(-dw / 2, dh - 16); hole.closePath();
        const frontShape = new THREE.Shape(front.getPoints());
        frontShape.holes.push(hole);
        put(g, new THREE.ShapeGeometry(frontShape), M.canvas, 0, 0, d / 2);
        // door flaps tied back
        for (const s of [-1, 1]) {
            put(g, gCyl(5, 5, dh - 6, 10), M.canvasDark, s * (dw / 2 + 8), (dh - 6) / 2, d / 2 + 5); // flap rolled and tied
            put(g, gCyl(0.8, 0.8, 16, 4), M.rope, s * (dw / 2 + 10), 52, d / 2 + 7, 0, Math.PI / 2);
        }
        // roof: two sagging canvas slopes, overhanging, running out over the porch
        const porch = 70;
        const halfW = w / 2 + 16;
        const slopeLen = Math.hypot(halfW, rise + 8);
        const ang = Math.atan2(rise + 8, halfW);
        for (const s of [-1, 1]) {
            const roof = put(g, sagPlane(d + porch + 24, slopeLen, -3, 14, 5), M.canvas, s * halfW / 2, (wallH - 8 + ridge) / 2, porch / 2);
            orientPlane(roof, new THREE.Vector3(0, 0, 1), new THREE.Vector3(-s * halfW, rise + 8, 0));
        }
        put(g, gCyl(2.4, 2.4, d + porch + 30, 6), M.woodDark, 0, ridge + 1, porch / 2, 0, 0, Math.PI / 2).rotation.set(Math.PI / 2, 0, 0);
        // poles: ridge poles + porch poles, guy ropes to stakes
        for (const z of [-d / 2, d / 2 + porch]) put(g, gCyl(2.6, 3, ridge + 2, 6), M.woodDark, 0, (ridge + 2) / 2, z);
        for (const s of [-1, 1]) put(g, gCyl(2.2, 2.4, wallH + 4, 6), M.woodDark, s * (w / 2 + 12), (wallH + 4) / 2, d / 2 + porch);
        const ropeA = new THREE.Vector3(), ropeB = new THREE.Vector3();
        for (const s of [-1, 1]) {
            for (let i = 0; i < 4; i++) {
                const z = -d / 2 + 20 + i * (d + porch - 30) / 3;
                ropeA.set(s * (w / 2 + 14), wallH - 4, z);
                ropeB.set(s * (w / 2 + 74), 2, z);
                subRope(g, M.rope, ropeA.clone(), ropeB.clone(), 2, 0.6);
                put(g, gBox(2, 12, 2), M.woodDark, ropeB.x, 3, z, 0, s * 0.4);
            }
        }
        // inside: a hanging lamp, a cot, the work table — seen through the door
        put(g, gBox(w - 8, 1, d - 8), M.rug, 0, 0.8, 0).userData.noCast = true;
        subTable(g, M, 90, 50, 30);
        put(g, gBox(22, 4, 16), M.paper, -10, 31, -4, 0.3);            // notes
        put(g, gBox(10, 6, 8), M.amber, 20, 32, 2).userData.noShadow = true; // the Codex, faintly alive
        put(g, gBox(60, 12, 140), M.canvasDark, w / 2 - 50, 14, -20);   // cot
        put(g, gBox(56, 6, 30), M.paper, w / 2 - 50, 22, -70);
        subCrate(g, M, -w / 2 + 40, 0, -d / 2 + 40, 34, 0.2);
        put(g, gBox(3, 3, 3), M.bulb, 0, ridge - 34, 10).userData.noShadow = true;
        ch1Lamp(g, 0, ridge - 36, 10, { intensity: 1.6, dist: 340, glow: 40 });
        // a camp chair on the porch
        put(g, gBox(22, 2, 20), M.canvasDark, w / 2 - 60, 18, d / 2 + 38, -0.4);
        put(g, gBox(22, 22, 2), M.canvasDark, w / 2 - 64, 28, d / 2 + 28, -0.4, 0, -0.2);
        g.userData.h = ridge + 10;
        return g;
    },

    // — the workers' bunkhouse: timber on block footings, corrugated roof,
    //   one window still lit —
    dorm_bldg(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w, d = o.h, wallH = 84, lift = 10;
        for (const sx of [-1, -0.33, 0.33, 1]) for (const sz of [-1, 1]) {
            put(g, gBox(14, lift, 14), M.limestone, sx * (w / 2 - 12), lift / 2, sz * (d / 2 - 12));
        }
        put(g, gBox(w, wallH, d), M.planks, 0, lift + wallH / 2, 0);
        // corner and sill trims
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(g, gBox(6, wallH, 6), M.woodDark, sx * (w / 2), lift + wallH / 2, sz * (d / 2));
        put(g, gBox(w + 4, 5, d + 4), M.woodDark, 0, lift + 2, 0);
        // gable roof along x, corrugated, overhanging
        const rise = 34, over = 20;
        const half = d / 2 + over;
        const slope = Math.hypot(half, rise), ang = Math.atan2(rise, half);
        for (const s of [-1, 1]) {
            const r = put(g, new THREE.PlaneGeometry(w + over * 2, slope), M.corrugated, 0, lift + wallH + rise / 2 - 2, s * half / 2);
            orientPlane(r, new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, rise, -s * half));
        }
        for (const s of [-1, 1]) put(g, gableGeo(d, rise), M.planksDark, s * (w / 2 + 0.5), lift + wallH, 0, s * Math.PI / 2);
        put(g, gBox(w + over * 2, 4, 6), M.metal, 0, lift + wallH + rise, 0);
        // windows: south face (door is right of centre), north face
        const doorX = 16;
        const win = (x, z, lit, face) => {
            put(g, gBox(30, 24, 2), lit ? M.window : M.windowDim, x, lift + 50, z).userData.noCast = true;
            put(g, gBox(36, 3, 5), M.woodDark, x, lift + 36, z + face * 1.5);  // sill
            put(g, gBox(36, 3, 3), M.woodDark, x, lift + 63, z + face * 1);
            put(g, gBox(2, 24, 3), M.woodDark, x, lift + 50, z + face * 1);
            if (lit) g.add(ch1GlowSprite(x, lift + 50, z + face * 10, 70, 0xffa84a, 0.35));
        };
        win(-w / 2 + 44, d / 2 + 1, false, 1);
        win(-w / 2 + 112, d / 2 + 1, true, 1);
        win(w / 2 - 50, d / 2 + 1, false, 1);
        for (const x of [-w / 4, w / 4]) win(x, -d / 2 - 1, false, -1);
        // door, frame, steps
        put(g, gBox(46, 68, 3), M.woodDark, doorX, lift + 34, d / 2 + 1.5);
        put(g, gBox(54, 5, 5), M.wood, doorX, lift + 70, d / 2 + 2);
        put(g, gCyl(1.4, 1.4, 3, 6), M.steel, doorX + 16, lift + 34, d / 2 + 4, 0, 0, Math.PI / 2);
        put(g, gBox(60, 5, 18), M.wood, doorX, lift - 2, d / 2 + 12);
        put(g, gBox(60, 5, 16), M.wood, doorX, lift - 8, d / 2 + 26);
        // rooftop water tank on a stand (every camp has one)
        const tx = -w / 2 + 60, tz = -d / 2 + 40;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(g, gBox(3, 40, 3), M.metalDark, tx + sx * 18, lift + wallH + 40, tz + sz * 18);
        put(g, gCyl(24, 24, 34, 16), M.dark, tx, lift + wallH + 76, tz);
        // laundry line off the east gable
        const a = new THREE.Vector3(w / 2 + 2, lift + 60, 0), b = new THREE.Vector3(w / 2 + 110, lift + 56, 30);
        subBeam(g, M.woodDark, new THREE.Vector3(b.x, 0, b.z), b, 1.6);
        const curve = subRope(g, M.rope, a, b, 8, 0.4);
        for (let i = 1; i < 4; i++) {
            const p = curve.getPoint(i / 4);
            const cloth = put(g, new THREE.PlaneGeometry(16, 22), i === 2 ? M.clothBlue : M.canvas, p.x, p.y - 11, p.z, 0.3);
            ch1FX.sway.push({ obj: cloth, axis: 'x', base: 0, amp: 0.12, speed: 1.3, phase: i });
        }
        g.userData.h = lift + wallH + rise + 16;
        return g;
    },

    // — the foreman's office: plastered mud brick, flat roof with a
    //   parapet and rebar still waiting for a second storey —
    foreman_bldg(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w, d = o.h, wallH = 92;
        put(g, gBox(w, wallH, d), M.plaster, 0, wallH / 2, 0);
        put(g, gBox(w + 6, 12, d + 6), M.plaster, 0, wallH + 4, 0);          // parapet band
        put(g, gBox(w - 10, 2, d - 10), M.dark, 0, wallH + 10.5, 0);          // roof deck
        for (let i = 0; i < 4; i++) {                                          // rebar tufts
            const rx = (i < 2 ? -1 : 1) * (w / 2 - 6), rz = (i % 2 ? -1 : 1) * (d / 2 - 6);
            for (let k = 0; k < 4; k++) put(g, gCyl(0.6, 0.6, 26 + k * 3, 4), M.rust, rx + (k % 2) * 3, wallH + 22 + k, rz + (k > 1 ? 3 : 0), 0, (k - 1.5) * 0.08);
        }
        for (const x of [-w / 3, w / 3]) put(g, gBox(6, 4, 16), M.wood, x, wallH + 4, d / 2 + 8); // drain spouts
        // door (slightly right of centre), blue-painted, with a lintel
        const doorX = 8;
        put(g, gBox(48, 72, 3), M.paintBlue, doorX, 36, d / 2 + 1.5);
        put(g, gBox(60, 8, 8), M.woodDark, doorX, 76, d / 2 + 2);
        put(g, gBox(56, 4, 14), M.limestone, doorX, 2, d / 2 + 7);
        // windows with shutters; the one by the desk burning late
        const win = (x, lit) => {
            put(g, gBox(34, 30, 2), lit ? M.window : M.windowDim, x, 54, d / 2 + 1).userData.noCast = true;
            for (const s of [-1, 1]) put(g, gBox(17, 32, 2), M.paintBlue, x + s * 27, 54, d / 2 + 4, s * 0.35);
            put(g, gBox(40, 4, 6), M.limestone, x, 37, d / 2 + 3);
            for (let k = -1; k <= 1; k++) put(g, gCyl(0.6, 0.6, 30, 4), M.metalDark, x + k * 9, 54, d / 2 + 2.5);
            if (lit) g.add(ch1GlowSprite(x, 54, d / 2 + 12, 80, 0xffa84a, 0.4));
        };
        win(-w / 4 - 10, true);
        win(w / 2 - 40, false);
        // site board over the door
        put(g, gBox(120, 22, 3), signMat('office', [['SITE OFFICE  ·  مكتب الموقع', 30]], '#e8dcc0', '#3a2a1a', 512, 96), doorX - 70, wallH - 16, d / 2 + 2);
        // AC unit, satellite dish, a bench by the wall
        put(g, gBox(34, 22, 18), M.paintWhite, w / 2 - 30, wallH - 26, d / 2 + 9);
        const dish = put(g, new THREE.SphereGeometry(14, 12, 6, 0, Math.PI * 2, 0, 0.9), M.paintWhite, w / 2 - 40, wallH + 34, -d / 2 + 30, 0, 0, 0);
        dish.rotation.set(-1.0, 0.4, 0);
        put(g, gCyl(1.4, 1.4, 22, 5), M.metalDark, w / 2 - 40, wallH + 20, -d / 2 + 30);
        const bench = new THREE.Group();
        subTable(bench, M, 70, 16, 18, M.woodPale);
        bench.position.set(-w / 4 + 60, 0, d / 2 + 22);
        g.add(bench);
        g.userData.h = wallH + 34;
        return g;
    },

    // door mats: thresholds only (the steps belong to the buildings)
    tent_door(o, M) { const g = new THREE.Group(); put(g, gBox(o.w * 0.9, 1.2, 40), M.rug, 0, 0.6, -6).userData.noCast = true; g.userData.h = 60; return g; },
    dorm_door(o, M) { const g = new THREE.Group(); g.userData.h = 82; return g; },
    foreman_door(o, M) { const g = new THREE.Group(); g.userData.h = 86; return g; },

    // — the tunnel mouth: a timbered portal driven into a rock mass
    //   that juts from the escarpment; it goes a long way down —
    tunnel_mouth(o, M, rng) {
        const g = new THREE.Group();
        // footprint of the collision mass relative to this object's centre
        const cx = o.x + o.w / 2, cz = o.y + o.h / 2;
        const massX0 = -480, massX1 = 480;   // the rock mass round the portal (its collision rect)
        const zBack = CH1_CLIFF_Z - 180 - cz, zFront = 48;
        const H = 250, openW = 176, openH = 138;
        const depth = zFront - zBack;
        const zc = (zFront + zBack) / 2;
        const blk = (x0, x1, y0, y1, seed, amp) => {
            const geo = ch1CliffGeo(x1 - x0, y1 - y0, depth, seed, { amp: amp || 22 });
            const m = new THREE.Mesh(geo, M.cliff);
            m.position.set((x0 + x1) / 2, (y0 + y1) / 2, zc);
            g.add(m);
            return m;
        };
        blk(massX0, -openW / 2 - 4, -30, H, 11);
        blk(openW / 2 + 4, massX1, -30, H - 20, 23);
        blk(-openW / 2 - 30, openW / 2 + 30, openH + 16, H - 10, 37, 12);
        // the dark throat of the tunnel, receding, with timber sets
        const tunnelLen = 260;
        put(g, gBox(openW + 6, 4, tunnelLen), M.dirt, 0, -1, zFront - tunnelLen / 2);
        for (const s of [-1, 1]) put(g, gBox(8, openH + 20, tunnelLen), M.rockDark, s * (openW / 2 + 2), openH / 2, zFront - tunnelLen / 2);
        put(g, gBox(openW + 20, 10, tunnelLen), M.rockDark, 0, openH + 8, zFront - tunnelLen / 2);
        const endWall = put(g, gBox(openW + 10, openH + 20, 4), M.black, 0, openH / 2, zFront - tunnelLen + 2);
        endWall.userData.noShadow = true;
        // darkness gradient toward the back (depth illusion)
        for (let i = 0; i < 4; i++) {
            const veil = put(g, new THREE.PlaneGeometry(openW + 4, openH + 10),
                new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }),
                0, openH / 2, zFront - 70 - i * 50);
            veil.userData.noShadow = true;
        }
        for (let i = 0; i < 5; i++) {
            const z = zFront - 8 - i * 50;
            for (const s of [-1, 1]) put(g, gBox(12, openH, 12), M.woodDark, s * (openW / 2 - 8), openH / 2, z);
            put(g, gBox(openW, 12, 14), M.woodDark, 0, openH - 4, z);
        }
        // portal frame, heavier than the sets, and a sign
        for (const s of [-1, 1]) put(g, gBox(18, openH + 16, 18), M.wood, s * (openW / 2 + 8), (openH + 16) / 2, zFront + 6);
        put(g, gBox(openW + 60, 18, 22), M.wood, 0, openH + 18, zFront + 6);
        put(g, gBox(80, 26, 3), signMat('tunnel', [['خطر  ·  DANGER', 26], ['NO ENTRY — S.C.A.', 18]], '#c8a030', '#1a1408', 256, 96), -openW / 2 - 70, 86, zFront + 10, 0.08);
        // festoon bulbs running into the dark
        const bulbs = [];
        for (let i = 0; i < 6; i++) bulbs.push(new THREE.Vector3(openW / 2 - 16, openH - 20, zFront + 10 - i * 46));
        subFestoon(g, M, bulbs, 6, 30);
        // rails running out of the tunnel toward the approach
        for (const s of [-1, 1]) put(g, gBox(3, 3, tunnelLen + 170), M.steel, s * 18, 1.5, zFront - tunnelLen / 2 + 85);
        for (let z = zFront + 150; z > zFront - tunnelLen; z -= 22) put(g, gBox(56, 3, 7), M.woodDark, 0, 0.5, z);
        // rubble at the feet
        for (let i = 0; i < 14; i++) {
            const x = (rng() < 0.5 ? -1 : 1) * (openW / 2 + 30 + rng() * 280);
            ch1AddRock(g, x, 0, zFront + 10 + rng() * 40, 10 + rng() * 22, rng, rng() < 0.4 ? M.rockDark : M.rock);
        }
        g.userData.h = 175;
        g.userData.labelZ = zFront + 20;
        return g;
    },

    // — the stela that holds the Tunnel Gate Seal —
    puzzle_glyph(o, M, rng) {
        // The Tunnel Gate Seal: a ring of pale stone around a dark amber
        // core, four glyph stones at the compass points (dialogue:
        // puzzle_start_glyph_lock). ch1_minigames.js plays it in place.
        const g = new THREE.Group();
        const w = o.w;
        put(g, gBox(w + 20, 10, w * 0.7 + 10), M.limestone, 0, 5, 0);
        put(g, gBox(w, 10, w * 0.6), M.limestone, 0, 15, 0);
        put(g, gBox(w * 0.78, 132, 18), M.glyphs, 0, 20 + 66, 0);
        const top = put(g, new THREE.CylinderGeometry(w * 0.39, w * 0.39, 18, 20, 1, false, -Math.PI / 2, Math.PI), M.glyphs, 0, 152, 0);
        top.rotation.x = -Math.PI / 2;
        const seal = new THREE.Group();
        seal.position.set(0, 96, 9);
        g.add(seal);
        const pale = new THREE.MeshStandardMaterial({ color: 0xe0d4b8, roughness: 0.85 });
        const ring = put(seal, new THREE.TorusGeometry(23, 3.4, 8, 40), pale, 0, 0, 1);
        for (let i = 0; i < 16; i++) { // notches cut in the ring
            const a = i / 16 * Math.PI * 2;
            put(ring, gBox(1.2, 5, 2), M.rockDark, Math.cos(a) * 23, Math.sin(a) * 23, 2.6, 0, a);
        }
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x2a1a06, emissive: 0xc8902a, emissiveIntensity: 0.25, roughness: 0.3, metalness: 0.2 });
        const core = put(seal, gCyl(11, 11, 3, 28), coreMat, 0, 0, 1.5);
        core.rotation.x = Math.PI / 2;
        put(seal, new THREE.TorusGeometry(11.5, 1.2, 6, 28), M.rockDark, 0, 0, 2.5);
        // resonance beads round the outside (lit while the seal listens)
        const beads = [];
        for (let i = 0; i < 24; i++) {
            const a = Math.PI / 2 - (i / 24) * Math.PI * 2;
            const b = put(seal, new THREE.SphereGeometry(1.1, 6, 5), new THREE.MeshStandardMaterial({ color: 0x3a2a14, emissive: 0xffc860, emissiveIntensity: 0 }), Math.cos(a) * 29.5, Math.sin(a) * 29.5, 1.5);
            beads.push(b);
        }
        // the four glyph stones (index = glyph: eye, lion, owl, serpent)
        const glyphs = (PUZZLES['puzzle_glyph_lock'] || {}).glyphs || ['𓂀', '𓃭', '𓅓', '𓆑'];
        const stones = glyphs.map((ch, i) => {
            const tex = makeTex('sealglyph' + i, 128, 128, 1, 1, (cc, W, H) => {
                const gr = cc.createRadialGradient(54, 50, 8, 64, 64, 64);
                gr.addColorStop(0, '#d8cbb0'); gr.addColorStop(1, '#a8987a');
                cc.fillStyle = gr; cc.fillRect(0, 0, W, H);
                speckle(cc, W, H, null, ['#8a7a5c', '#efe4cc'], 300, 1, 2.5);
                cc.fillStyle = '#3a2c18';
                cc.textAlign = 'center'; cc.textBaseline = 'middle';
                cc.font = '78px "Segoe UI Historic", "Noto Sans Egyptian Hieroglyphs", serif';
                cc.strokeStyle = '#3a2c18'; cc.lineWidth = 3.5; cc.lineJoin = 'round';
                cc.strokeText(ch, 64, 70);
                cc.fillText(ch, 64, 70);
            });
            const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, emissive: 0x000000 });
            const side = new THREE.MeshStandardMaterial({ color: 0xc8bca0, roughness: 0.9 });
            const stone = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 8, 5, 20), [side, mat, side]);
            stone.rotation.x = Math.PI / 2;
            stone.userData.glyphIdx = i;
            seal.add(stone);
            return stone;
        });
        const slots = [[0, 23], [23, 0], [0, -23], [-23, 0]]; // top, right, bottom, left (x, y)
        const order = (PUZZLES['puzzle_glyph_lock'] || {})._order || [0, 1, 2, 3];
        order.forEach((gi, slot) => stones[gi].position.set(slots[slot][0], slots[slot][1], 4));
        const glow = ch1GlowSprite(0, 96, 18, 58, 0xd4af37, 0.2);
        g.add(glow);
        // the timber brace across the approach, where the trap's darts end up
        put(g, gBox(10, 92, 10), M.woodDark, 96, 46, 30);
        put(g, gBox(10, 10, 60), M.woodDark, 96, 88, 30);
        window.ch1Seal = { group: g, seal, ring, core, coreMat, beads, stones, slots, glow };
        g.userData.h = 172;
        g.userData.keep = true;
        return g;
    },


    // — generator on its skid (collision rect sits a little east) —
    generator(o, M, rng) {
        const g = new THREE.Group();
        const ox = 26;
        put(g, gBox(150, 6, 80), M.metalDark, ox, 3, 4);                        // skid
        for (const s of [-1, 1]) put(g, gBox(150, 8, 6), M.metalDark, ox, 4, 4 + s * 40);
        put(g, gBox(126, 58, 66), M.paintYellow, ox, 36, 4);                     // canopy
        put(g, gBox(126, 4, 70), M.metalDark, ox, 66, 4);
        for (let i = 0; i < 6; i++) put(g, gBox(3, 30, 2), M.metalDark, ox - 40 + i * 7, 38, 38);   // louvres
        put(g, gBox(34, 22, 2), M.metalDark, ox + 36, 40, 38);                   // panel
        put(g, gBox(6, 4, 1), M.bulbCool, ox + 30, 46, 39.5).userData.noShadow = true;
        put(g, gCyl(4, 4, 34, 8), M.rust, ox + 48, 82, -10);                     // exhaust
        put(g, gCyl(6, 4, 6, 8), M.rust, ox + 48, 100, -10, 0, 0.3);
        subDrum(g, M.paintRed, M, ox - 92, -20, 13);
        // cables snaking off toward the camp
        for (const [tx, tz] of [[-260, 30], [-200, -180]]) {
            const pts = [new THREE.Vector3(ox - 60, 2, 20), new THREE.Vector3(tx * 0.4, 1, tz * 0.3 + 30), new THREE.Vector3(tx, 1, tz)];
            const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 1.2, 4), M.rubber);
            m.userData.noCast = true;
            g.add(m);
        }
        g.userData.h = 104;
        g.userData.keep = true;
        return g;
    },

    satphone(o, M) {
        const g = new THREE.Group();
        subTable(g, M, 70, 44, 30, M.woodPale);
        put(g, gBox(24, 9, 18), M.dark, -6, 34.5, 0, 0.2);                     // the rugged case
        const lid = put(g, gBox(24, 16, 2), M.dark, -6, 42, -9, 0.2);
        lid.rotation.x = -0.3;
        put(g, gBox(16, 10, 1), M.glass, -6, 43, -7.5, 0.2).rotation.x = -0.3;
        put(g, gBox(5, 3, 14), M.metalDark, 12, 32, 6, -0.4);                   // handset
        put(g, gCyl(1, 1, 18, 5), M.metalDark, -14, 46, -6, 0, 0.5);             // antenna up
        put(g, gBox(3, 3, 3), new THREE.MeshBasicMaterial({ color: 0x40ff60, toneMapped: false }), 2, 40, 2);
        // folding chair
        const chair = new THREE.Group();
        put(chair, gBox(22, 2, 20), M.canvasDark, 0, 18, 0);
        put(chair, gBox(22, 20, 2), M.canvasDark, 0, 28, -10, 0, 0, -0.15);
        for (const s of [-1, 1]) subBeam(chair, M.steel, new THREE.Vector3(s * 10, 0, -10), new THREE.Vector3(s * 10, 18, 10), 0.8);
        for (const s of [-1, 1]) subBeam(chair, M.steel, new THREE.Vector3(s * 10, 0, 10), new THREE.Vector3(s * 10, 18, -10), 0.8);
        chair.position.set(0, 0, 42);
        chair.rotation.y = Math.PI + 0.3;
        g.add(chair);
        g.userData.h = 62;
        return g;
    },

    sams_gear(o, M, rng) {
        const g = new THREE.Group();
        for (let i = 0; i < 3; i++) { // half-buried tripod, listing
            const a = (i / 3) * Math.PI * 2;
            subBeam(g, M.woodPale, new THREE.Vector3(Math.cos(a) * 16, -4, Math.sin(a) * 16), new THREE.Vector3(2, 38, 0), 1.4);
        }
        put(g, gBox(16, 12, 10), M.paintYellow, 3, 42, 0, 0.5, 0.18);          // the transit, askew
        put(g, gCyl(3, 3, 14, 8), M.metalDark, 3, 48, 0, 0.5, Math.PI / 2 + 0.18);
        put(g, gBox(26, 14, 16), M.dark, 22, 2, 14, 0.7, 0.3);                 // case, half in the sand
        g.userData.h = 52;
        return g;
    },

    // — supply line: narrow-gauge track with two loaded skips —
    carts(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w + 120, d = o.h;
        for (const s of [-1, 1]) put(g, gBox(w, 3, 3), M.steel, 0, 3.5, s * 16);
        for (let x = -w / 2 + 10; x < w / 2; x += 22) put(g, gBox(7, 3, 52), M.woodDark, x, 1.5, 0, (rng() - 0.5) * 0.08);
        for (const cx of [-w * 0.2, w * 0.14]) {
            const cart = new THREE.Group();
            put(cart, gBox(62, 6, 36), M.metalDark, 0, 12, 0);
            for (const sx of [-1, 1]) for (const sz of [-1, 1]) subWheel(cart, M, sx * 20, 8, sz * 16, 7, 3);
            // V-shaped tipping skip
            const skip = new THREE.Group();
            for (const s of [-1, 1]) put(skip, gBox(60, 30, 3), M.rust, 0, 0, s * 13, 0, 0, 0).rotation.x = s * 0.45;
            put(skip, gBox(60, 3, 12), M.rust, 0, -13, 0);
            for (const s of [-1, 1]) put(skip, gableGeo(40, 26), M.rust, s * 30, -14, 0, s * Math.PI / 2);
            const load = put(skip, new THREE.SphereGeometry(22, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), M.sand, 0, 4, 0);
            load.scale.set(1.3, 0.5, 0.75);
            skip.position.y = 34;
            cart.add(skip);
            cart.position.x = cx;
            g.add(cart);
        }
        g.userData.h = 60;
        g.userData.keep = true;
        return g;
    },

    // — the east trench: the cut itself is terrain; this adds the working
    //   clutter at the bottom and the faint amber seep (the ground breathes) —
    trench(o, M, rng) {
        const g = new THREE.Group();
        const D = CH1_TRENCH.depth;
        const seep = put(g, new THREE.PlaneGeometry(o.w * 0.5, o.h * 0.4), new THREE.MeshStandardMaterial({ color: 0x1a1206, emissive: 0xd4af37, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 }), 0, -D + 1.2, 0);
        seep.rotation.x = -Math.PI / 2;
        seep.userData.noShadow = true;
        g.add(ch1GlowSprite(0, -D + 10, 0, 110, 0xd4af37, 0.35));
        ch1FX.glows.push({ sprite: g.children[g.children.length - 1], base: 0.35, phase: 3, steady: false });
        // ladder against the west wall
        for (const s of [-1, 1]) subBeam(g, M.woodPale, new THREE.Vector3(-o.w / 2 + 24, -D, s * 10 - 60), new THREE.Vector3(-o.w / 2 + 6, 14, s * 10 - 60), 1.4);
        for (let i = 1; i < 6; i++) put(g, gCyl(0.9, 0.9, 20, 5), M.woodPale, -o.w / 2 + 24 - i * 3.6, -D + i * 10, -60, 0, 0, 0).rotation.x = Math.PI / 2;
        // finds trays, a bucket, trowels, a string grid on the floor
        for (let i = 0; i < 3; i++) put(g, gBox(22, 5, 14), M.crate, 40 + i * 26, -D + 2.5, 50, (rng() - 0.5) * 0.3);
        put(g, new THREE.CylinderGeometry(7, 5.5, 12, 12, 1, true), M.metal, -30, -D + 6, 40);
        put(g, gBox(3, 1.4, 12), M.steel, -10, -D + 0.8, 30, 0.8);
        put(g, gBox(3, 1.4, 12), M.steel, 60, -D + 0.8, -30, -0.4);
        for (let i = 0; i < 4; i++) put(g, gBox(3, 8, 3), M.woodPale, -60 + i * 40, -D + 3, -20);
        g.userData.h = 36;
        g.userData.keep = true;
        return g;
    },

    // — the rest brazier: an iron fire basket, a kettle on the grill,
    //   stools and a kilim round it —
    rest_brazier(o, M, rng) {
        const g = new THREE.Group();
        put(g, new THREE.CircleGeometry(70, 20), new THREE.MeshStandardMaterial({ color: 0x2a221a, transparent: true, opacity: 0.55, depthWrite: false }), 0, 0.6, 0, 0, 0, -Math.PI / 2).rotation.x = -Math.PI / 2;
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2 + 0.4;
            subBeam(g, M.metalDark, new THREE.Vector3(Math.cos(a) * 20, 0, Math.sin(a) * 20), new THREE.Vector3(Math.cos(a) * 12, 30, Math.sin(a) * 12), 1.6);
        }
        // the basket: ribbed iron bowl
        put(g, new THREE.CylinderGeometry(22, 13, 16, 14, 1, true), M.metalDark, 0, 36, 0).material = new THREE.MeshStandardMaterial({ color: 0x2a2624, roughness: 0.7, metalness: 0.4, side: THREE.DoubleSide });
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2;
            subBeam(g, M.rust, new THREE.Vector3(Math.cos(a) * 13, 28, Math.sin(a) * 13), new THREE.Vector3(Math.cos(a) * 23, 45, Math.sin(a) * 23), 1);
        }
        const coals = put(g, new THREE.SphereGeometry(17, 10, 6), M.ember, 0, 40, 0);
        coals.scale.set(1, 0.35, 1);
        coals.userData.noShadow = true;
        for (let i = 0; i < 5; i++) {
            const a = rng() * 7;
            put(g, gCyl(2.2, 2.6, 26, 6), M.dark, Math.cos(a) * 5, 44, Math.sin(a) * 5, a, 1.0 + rng() * 0.3);
        }
        // grill + blackened kettle
        for (const s of [-1, 1]) put(g, gBox(46, 1.2, 1.2), M.metalDark, 0, 47, s * 7);
        put(g, gCyl(6, 8, 11, 12), M.dark, 10, 53, 4);
        put(g, gCyl(1.4, 2.4, 8, 6), M.dark, 17, 55, 4, 0, -0.9);
        ch1AddFire(g, 0, 42, 0, 1);
        // stools and a rug
        const rug = put(g, new THREE.PlaneGeometry(90, 56), M.rug, -86, 0.8, -20, 0, 0, 0);
        rug.rotation.set(-Math.PI / 2, 0, 0.5);
        rug.userData.noCast = true;
        for (const [x, z] of [[-70, -54], [-92, 26], [30, -76]]) {
            put(g, gCyl(9, 8, 14, 10), M.woodPale, x, 7, z);
            put(g, gCyl(10, 10, 3, 10), M.wood, x, 15, z);
        }
        put(g, gBox(18, 12, 12), M.crate, 50, 6, -62, 0.3);
        put(g, gCyl(3, 3, 10, 8), M.steel, 50, 17, -62);                       // a tea glass tray
        g.userData.h = 80;
        return g;
    },

    // — perimeter watch post —
    perimeter(o, M, rng) {
        const g = new THREE.Group();
        subSandbags(g, M, o.w * 1.6, o.h, rng, 3, 20);
        subCrate(g, M, o.w * 0.2, 0, 24, 22, 0.2);
        put(g, gCyl(3, 3, 14, 8), M.paintGreen, o.w * 0.2 + 6, 24, 24);       // thermos
        put(g, gBox(8, 5, 10), M.dark, o.w * 0.2 - 6, 20, 26, 0.5);             // binoculars
        g.userData.h = 44;
        g.userData.keep = true;
        return g;
    },

    // — Dust the camp dog, asleep and dreaming well —
    camp_dog(o, M, rng) {
        const g = new THREE.Group();
        const fur = new THREE.MeshStandardMaterial({ color: 0xa47c4c, roughness: 0.95 });
        const furDark = new THREE.MeshStandardMaterial({ color: 0x6e4e2e, roughness: 0.95 });
        const body = new THREE.Group();
        const torso = put(body, new THREE.CapsuleGeometry(7.5, 18, 6, 10), fur, 0, 7.5, 0, 0, Math.PI / 2);
        torso.scale.set(1, 1, 0.9);
        put(body, new THREE.SphereGeometry(6.2, 12, 10), fur, 16, 7, 2);               // head, resting
        put(body, new THREE.CapsuleGeometry(2.8, 5, 4, 8), furDark, 22, 5.5, 3, 0, Math.PI / 2); // muzzle
        put(body, new THREE.SphereGeometry(1.4, 8, 6), M.dark, 26, 6, 3);               // nose
        for (const s of [-1, 1]) {
            const ear = put(body, new THREE.ConeGeometry(2.6, 6, 6), furDark, 14, 12, 2 + s * 4, 0, s * 0.5, s * 0.6);
            ear.rotation.x = s * 0.8;
        }
        for (const s of [-1, 1]) put(body, new THREE.CapsuleGeometry(2, 9, 4, 6), fur, 15, 2.2, s * 5 + 1, 0, Math.PI / 2); // front paws
        put(body, new THREE.CapsuleGeometry(3, 8, 4, 6), fur, -10, 3, 7, 0.3, Math.PI / 2);  // hind leg tucked
        const tail = put(body, new THREE.CapsuleGeometry(1.6, 12, 4, 6), furDark, -14, 3, -6, -0.9, Math.PI / 2);
        body.rotation.y = -0.4;
        g.add(body);
        ch1FX.sway.push({ obj: torso, scale: true, axis: 'y', base: 1, amp: 0.05, speed: 1.4, phase: 0 });
        ch1FX.sway.push({ obj: tail, axis: 'y', base: -0.9, amp: 0.25, speed: 0.6, phase: 2 });
        g.userData.h = 30;
        return g;
    },

    camp_darts(o, M, rng) {
        // Board rings match the game's scoring zones (radius of 150:
        // 13→50, 36→25, 72→20, 112→10, 150→5). Played in place by
        // ch1_minigames.js.
        const g = new THREE.Group();
        const face = makeTex('c1dartboard2', 256, 256, 1, 1, (cc, w, h) => {
            const C = 128, S = 128 / 150;
            const rings = [[150, '#1c1a16'], [112, '#e2d6b8'], [72, '#1c1a16'], [36, '#9a2020'], [13, '#d4af37']];
            for (const [r, col] of rings) { cc.fillStyle = col; cc.beginPath(); cc.arc(C, C, r * S, 0, 7); cc.fill(); }
            for (let i = 0; i < 20; i++) { // alternating sector tint on the big rings
                const a0 = i / 20 * Math.PI * 2, a1 = (i + 1) / 20 * Math.PI * 2;
                if (i % 2) continue;
                cc.fillStyle = 'rgba(40,110,50,0.55)';
                cc.beginPath(); cc.arc(C, C, 150 * S, a0, a1); cc.arc(C, C, 112 * S, a1, a0, true); cc.fill();
                cc.fillStyle = 'rgba(30,30,26,0.6)';
                cc.beginPath(); cc.arc(C, C, 72 * S, a0, a1); cc.arc(C, C, 36 * S, a1, a0, true); cc.fill();
            }
            cc.strokeStyle = 'rgba(200,200,190,0.7)'; cc.lineWidth = 1.2;
            for (const [r] of rings) { cc.beginPath(); cc.arc(C, C, r * S, 0, 7); cc.stroke(); }
            for (let i = 0; i < 20; i++) {
                const a = i / 20 * Math.PI * 2;
                cc.beginPath(); cc.moveTo(C + Math.cos(a) * 36 * S, C + Math.sin(a) * 36 * S); cc.lineTo(C + Math.cos(a) * 150 * S, C + Math.sin(a) * 150 * S); cc.stroke();
            }
            cc.fillStyle = 'rgba(240,230,200,0.85)'; cc.font = 'bold 11px Arial'; cc.textAlign = 'center';
            [[50, 0], [25, 24], [20, 54], [10, 92], [5, 131]].forEach(([v, r]) => cc.fillText(String(v), C, C - r * S + 4));
            speckle(cc, w, h, null, ['#000'], 120, 1, 2, 0.2, 0.5); // old holes
        });
        put(g, gBox(6, 76, 6), M.woodDark, 0, 38, -4);
        const back = put(g, gBox(46, 46, 3), M.planksDark, 0, 54, -1);
        const boardMat = new THREE.MeshStandardMaterial({ map: face, roughness: 0.95 });
        const side = new THREE.MeshStandardMaterial({ color: 0x1a1612, roughness: 0.9 });
        const board = put(g, new THREE.CylinderGeometry(15, 15, 3, 36), [side, boardMat, side], 0, 54, 1.5);
        board.rotation.x = Math.PI / 2;
        // Sam's chalk on the plank beside it
        const chalk = makeTex('c1chalk', 128, 64, 1, 1, (cc, w, h) => {
            cc.fillStyle = '#3a2c1c'; cc.fillRect(0, 0, w, h);
            cc.fillStyle = 'rgba(230,226,210,0.55)'; cc.font = 'italic 26px Georgia, serif';
            cc.fillText('S — 132', 10, 40);
        });
        put(g, gBox(30, 14, 1.5), new THREE.MeshStandardMaterial({ map: chalk, roughness: 1 }), 34, 40, 0.5);
        // three darts holstered in the post
        const holstered = [];
        for (let i = 0; i < 3; i++) {
            const d = ch1MakeDart(M);
            d.position.set(3.5, 20 + i * 5, 2);
            d.rotation.set(0, Math.PI / 2, 0.2);
            g.add(d);
            holstered.push(d);
        }
        window.ch1Darts = { group: g, board, radius: 15, center: new THREE.Vector3(0, 54, 3), holstered, stuck: [] };
        g.userData.h = 82;
        return g;
    },


    camp_radio(o, M, rng) {
        const g = new THREE.Group();
        subCrate(g, M, 0, 0, 0, 28, 0.1);
        put(g, gBox(26, 15, 11), M.woodDark, 0, 30, 0, 0.1);
        put(g, gBox(12, 9, 1), new THREE.MeshStandardMaterial({ color: 0x3a3020, roughness: 1 }), -5, 30, 5.6, 0.1); // speaker cloth
        put(g, gBox(8, 4, 1), new THREE.MeshStandardMaterial({ color: 0x302010, emissive: 0xffb050, emissiveIntensity: 1.2 }), 7, 33, 5.6, 0.1);
        for (const x of [4, 10]) put(g, gCyl(1.6, 1.6, 2, 8), M.steel, x, 27, 6, 0.1).rotation.x = Math.PI / 2;
        put(g, gCyl(0.5, 0.5, 38, 4), M.steel, 10, 56, -3, 0, 0.35);
        g.add(ch1GlowSprite(7, 33, 8, 12, 0xffb050, 0.6));
        g.userData.h = 62;
        return g;
    },

    // The parked ministry car is the dynamic carGroup — this static
    // interact zone needs no mesh of its own, only its floating label
    inspector(o, M) { const g = new THREE.Group(); g.userData.h = 64; return g; },

    // The gate itself is built from its collision wall (it hides when it
    // opens); this interact zone only carries the label
    dig_gate(o, M) { const g = new THREE.Group(); g.userData.h = 112; return g; },

    // fl_cooking / fl_crates sit on top of the built decoratives — label only
    fl_cooking(o, M) { const g = new THREE.Group(); g.userData.h = 52; return g; },
    fl_crates(o, M) { const g = new THREE.Group(); g.userData.h = 64; return g; },
    d_scaff(o, M) { const g = new THREE.Group(); g.userData.h = 0; return g; },
};

// ============================================================
// LABEL-KEYED SET DRESSING
// ============================================================
const CH1_LABEL_BUILDERS = {
    'cactus': (o, M, rng) => {
        const g = new THREE.Group();
        const h = o.h * 1.5 + 10, r = o.w * 0.42;
        const ribbed = (rad, len) => {
            const geo = new THREE.CylinderGeometry(rad * 0.8, rad, len, 16, 6);
            const p = geo.attributes.position;
            for (let i = 0; i < p.count; i++) {
                const a = Math.atan2(p.getZ(i), p.getX(i));
                const k = 1 + 0.12 * Math.cos(a * 8);
                p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k);
                if (p.getY(i) > len / 2 - 1) { p.setX(i, p.getX(i) * 0.6); p.setZ(i, p.getZ(i) * 0.6); }
            }
            geo.computeVertexNormals();
            return geo;
        };
        put(g, ribbed(r, h), M.cactus, 0, h / 2, 0);
        const arms = rng() < 0.3 ? 0 : rng() < 0.6 ? 1 : 2;
        for (let i = 0; i < arms; i++) {
            const s = i === 0 ? (rng() < 0.5 ? 1 : -1) : -1;
            const ah = h * (0.3 + rng() * 0.25), ay = h * (0.35 + rng() * 0.2);
            put(g, gCyl(r * 0.55, r * 0.6, r * 1.6, 10), M.cactus, s * r * 1.1, ay, 0, 0, Math.PI / 2);
            put(g, ribbed(r * 0.62, ah), M.cactus, s * r * 1.9, ay + ah / 2 - 2, 0);
        }
        g.rotation.y = rng() * 7;
        g.userData.h = h + 10;
        return g;
    },
    'boulder': (o, M, rng) => {
        const g = new THREE.Group();
        const r = Math.min(o.w, o.h) * 0.62;
        ch1AddRock(g, 0, 0, 0, r, rng, M.rock, 0.05);
        if (rng() > 0.3) ch1AddRock(g, r * 0.9, 0, r * 0.4, r * 0.45, rng, M.rockDark);
        ch1AddRock(g, -r * 0.8, 0, -r * 0.3, r * 0.3, rng, M.rock);
        g.userData.h = r * 1.3;
        return g;
    },
    'rock pile': (o, M, rng) => {
        const g = new THREE.Group();
        for (let i = 0; i < 7; i++) {
            const r = 7 + rng() * Math.min(o.w, o.h) * 0.24;
            ch1AddRock(g, (rng() - 0.5) * o.w * 0.8, (i > 4 ? 8 : 0), (rng() - 0.5) * o.h * 0.8, r, rng, rng() < 0.4 ? M.rockDark : M.rock);
        }
        g.userData.h = Math.min(o.w, o.h) * 0.5 + 12;
        return g;
    },
    'spoil mound': (o, M, rng) => {
        const g = new THREE.Group();
        const r = Math.max(o.w, o.h) * 0.62, h = 34 + rng() * 20;
        const geo = new THREE.ConeGeometry(r, h, 16, 4);
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const n = vnoise3(p.getX(i) * 0.08, p.getY(i) * 0.08, p.getZ(i) * 0.08 + r) - 0.5;
            p.setX(i, p.getX(i) * (1 + n * 0.3)); p.setZ(i, p.getZ(i) * (1 + n * 0.3));
            if (p.getY(i) > h / 2 - 1) p.setY(i, h / 2 - 6);
        }
        geo.computeVertexNormals();
        put(g, geo, M.sand, 0, h / 2 - 4, 0).scale.set(1, 1, o.h / o.w + 0.3);
        for (let i = 0; i < 6; i++) ch1AddRock(g, (rng() - 0.5) * r * 1.5, 0, (rng() - 0.5) * r * 1.2, 4 + rng() * 6, rng);
        // sieve frame leaning on it
        if (rng() < 0.6) put(g, gBox(34, 3, 26), M.wood, r * 0.6, 12, 0, 0.3, 0.5);
        g.userData.h = h + 6;
        return g;
    },
    'howling dune': (o, M, rng) => {
        const g = new THREE.Group();
        const geo = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = put(g, geo, M.sand, 0, -4, 0);
        dome.scale.set(o.w * 1.5, 34, o.h * 0.9);
        // a wind-cut crest line
        const crest = put(g, new THREE.ConeGeometry(o.w * 0.9, 14, 3), M.sand, -10, 28, 0, 0.4, Math.PI / 2);
        crest.scale.set(1, 1, 0.3);
        g.userData.h = 50;
        g.userData.keep = true;
        return g;
    },
    'survey stake': (o, M, rng) => {
        const g = new THREE.Group();
        const h = o.h * 1.2 + 10;
        put(g, gBox(4, h, 4), M.woodPale, 0, h / 2, 0, 0, 0, (rng() - 0.5) * 0.1);
        put(g, gBox(4.4, 6, 4.4), M.paintRed, 0, h - 6, 0);
        const tape = put(g, new THREE.PlaneGeometry(3, 16), M.paintRed, 3, h - 14, 0, 0.3);
        tape.material = new THREE.MeshStandardMaterial({ color: 0xd84a2a, side: THREE.DoubleSide });
        ch1FX.sway.push({ obj: tape, axis: 'y', base: 0.3, amp: 0.4, speed: 2.4, phase: rng() * 7 });
        g.userData.h = h + 6;
        return g;
    },
    "sam's survey stake": (o, M, rng) => CH1_LABEL_BUILDERS['survey stake'](o, M, rng),
    'stone wall': (o, M, rng) => {
        const g = new THREE.Group();
        const horizontal = o.w >= o.h;
        const len = Math.max(o.w, o.h), th = Math.max(26, Math.min(o.w, o.h) * 1.4);
        const blocks = Math.max(2, Math.round(len / 40));
        for (let row = 0; row < 4; row++) {
            const n = row >= 2 ? Math.max(1, blocks - 1 - (rng() * 3 | 0)) : blocks;
            for (let i = 0; i < n; i++) {
                if (row >= 2 && rng() < 0.3) continue; // fallen away
                const bw = len / blocks - 2.5;
                const off = -len / 2 + (i + 0.5) * (len / blocks) + (row % 2) * 10;
                const b = put(g, gBox(horizontal ? bw : th, 18, horizontal ? th : bw), M.limestone,
                    horizontal ? off : (rng() - 0.5) * 4, 9 + row * 18.5 - (row >= 2 && rng() < 0.3 ? 5 : 0), horizontal ? (rng() - 0.5) * 4 : off,
                    (rng() - 0.5) * 0.08, (rng() - 0.5) * 0.04);
            }
        }
        for (let i = 0; i < 4; i++) { // tumbled blocks at the foot
            const b = put(g, gBox(30, 16, 22), M.limestone, (rng() - 0.5) * (horizontal ? len : 60), 7, (rng() - 0.5) * (horizontal ? 60 : len), rng() * 3, (rng() - 0.5) * 0.3);
        }
        g.userData.h = 82;
        return g;
    },
    'old limestone wall': (o, M, rng) => CH1_LABEL_BUILDERS['stone wall'](Object.assign({}, o, { w: o.w * 1.6 }), M, rng),
    'crates': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subCrateStack(g, M, o.w, o.h, rng); return g; },
    'sorted crates': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subCrateStack(g, M, o.w, o.h, rng); return g; },
    'fuel drums': (o, M, rng) => {
        const g = new THREE.Group();
        subDrums(g, M, M.paintRed, o.w, o.h, rng, 3);
        subDrum(g, M.paintBlue, M, o.w * 0.1, o.h * 0.55, o.w * 0.2, 1.2);
        g.userData.h = 58;
        return g;
    },
    'oil drum': (o, M, rng) => {
        const g = new THREE.Group();
        subDrum(g, M.rust, M, 0, 0, o.w * 0.42);
        g.userData.h = o.w * 1.2 + 10;
        return g;
    },
    'water barrels': (o, M, rng) => {
        const g = new THREE.Group();
        subDrums(g, M, M.paintBlue, o.w, o.h, rng, 3);
        put(g, gCyl(3, 3, 8, 8), M.steel, o.w * 0.2, 6, o.h * 0.42, 0, 0, Math.PI / 2); // tap
        put(g, gCyl(9, 7, 9, 12), M.metal, o.w * 0.2, 4.5, o.h * 0.55);                 // tin cup
        g.userData.h = 60;
        return g;
    },
    'cooking table': (o, M, rng) => {
        const g = new THREE.Group();
        subTable(g, M, o.w, 44, 32, M.woodPale);
        put(g, gCyl(11, 9, 12, 12), M.steel, -o.w * 0.3, 38, 0);           // pot
        put(g, gCyl(12, 12, 1.6, 12), M.steel, -o.w * 0.3, 44.8, 0);
        put(g, gCyl(8, 7, 9, 12), M.terracotta, -o.w * 0.1, 36.5, 8);      // clay jar
        put(g, gBox(22, 2.5, 13), M.woodDark, o.w * 0.08, 33, -6, 0.2);     // chopping board
        for (let i = 0; i < 4; i++) put(g, new THREE.SphereGeometry(3, 8, 6), i % 2 ? M.paintRed : M.cactus, o.w * 0.08 + (i - 1.5) * 4, 36, -6);
        put(g, gCyl(10, 10, 5, 14), M.metal, o.w * 0.3, 34.5, 4);          // gas ring
        put(g, gCyl(8, 8, 22, 12), M.paintBlue, o.w * 0.38, 11, 22);      // gas bottle
        for (let i = 0; i < 5; i++) put(g, gCyl(2, 1.6, 6, 8), new THREE.MeshStandardMaterial({ color: 0xc8a060, transparent: true, opacity: 0.7, roughness: 0.2 }), o.w * 0.2 + i * 5, 35, -12); // tea glasses
        g.userData.h = 56;
        return g;
    },
    'equipment table': (o, M, rng) => {
        const g = new THREE.Group();
        subTable(g, M, o.w, 50, 32);
        put(g, gBox(24, 10, 14), M.paintYellow, -o.w * 0.3, 37, 0, 0.3);   // total station case
        put(g, gBox(30, 3, 22), M.paper, -o.w * 0.02, 33.5, 2, -0.1);        // plans
        put(g, gCyl(2, 2, 26, 8), M.paper, o.w * 0.05, 34, -12, 0, 0, Math.PI / 2); // rolled drawing
        for (let i = 0; i < 4; i++) put(g, gBox(10, 4, 8), M.crate, o.w * 0.22 + i * 11, 34, 6);        // finds trays
        put(g, gBox(6, 16, 6), M.dark, o.w * 0.4, 40, -6);                  // torch
        g.userData.h = 50;
        return g;
    },
    'supply truck': (o, M, rng) => {
        const g = new THREE.Group();
        const L = o.w, W = o.h * 0.78;
        const paint = rng() < 0.5 ? M.paintGreen : M.paintBlue;
        // chassis, cab (front toward -x), hood
        put(g, gBox(L * 0.94, 8, W * 0.7), M.metalDark, 0, 20, 0);
        put(g, gBox(L * 0.2, 46, W), paint, -L * 0.27, 50, 0);
        put(g, gBox(L * 0.14, 24, W * 0.86), paint, -L * 0.41, 38, 0);
        put(g, gBox(2, 18, W * 0.82), M.glass, -L * 0.372, 62, 0, 0, 0, -0.15);
        for (const s of [-1, 1]) put(g, gBox(L * 0.12, 16, 2), M.glass, -L * 0.27, 62, s * (W / 2 + 0.5));
        put(g, gBox(4, 10, W * 0.9), M.steel, -L * 0.485, 24, 0);                  // bumper
        for (const s of [-1, 1]) {
            put(g, gCyl(4, 4, 2, 10), M.bulb, -L * 0.48, 38, s * W * 0.33, 0, 0, Math.PI / 2).userData.noShadow = true;
            put(g, gBox(3, 6, 10), M.dark, -L * 0.2, 64, s * (W / 2 + 6));           // mirrors
        }
        // tarp-covered bed with ribs showing through
        put(g, gBox(L * 0.62, 12, W * 0.98), M.planksDark, L * 0.15, 30, 0);
        const bed = put(g, gBox(L * 0.6, 40, W * 0.96), M.tarp, L * 0.15, 56, 0);
        const roofC = put(g, new THREE.CylinderGeometry(W * 0.48, W * 0.48, L * 0.6, 12, 1, false, Math.PI, Math.PI), M.tarp, L * 0.15, 76, 0, 0, -Math.PI / 2);
        roofC.scale.set(0.35, 1, 1);
        for (let i = 0; i < 4; i++) put(g, gBox(2, 44, W + 1), M.rope, L * 0.15 - L * 0.26 + i * L * 0.17, 56, 0);
        for (const wx of [-L * 0.3, L * 0.14, L * 0.34]) for (const s of [-1, 1]) subWheel(g, M, wx, 13, s * (W / 2 - 2), 13, 9);
        g.userData.h = 90;
        return g;
    },
    'ministry vehicle': (o, M, rng) => {
        const g = new THREE.Group();
        const L = o.w, W = o.h * 0.72;
        const paint = M.paintWhite;
        put(g, gBox(L * 0.95, 26, W), paint, 0, 30, 0);
        put(g, gBox(L * 0.62, 24, W * 0.94), paint, L * 0.08, 54, 0);
        put(g, gBox(L * 0.6, 14, W * 0.96), M.glass, L * 0.08, 56, 0);
        put(g, gBox(L * 0.95, 5, W + 1), M.paintBlue, 0, 34, 0);                   // livery stripe
        put(g, gBox(3, 12, W * 0.9), M.steel, -L * 0.48, 26, 0);
        put(g, gBox(20, 6, 14), new THREE.MeshStandardMaterial({ color: 0x223, emissive: 0x2244aa, emissiveIntensity: 0.3 }), L * 0.08, 69, 0); // light bar (off)
        for (const s of [-1, 1]) put(g, gBox(2, 5, 8), M.bulb, -L * 0.475, 36, s * W * 0.32).userData.noShadow = true;
        for (const wx of [-L * 0.3, L * 0.3]) for (const s of [-1, 1]) subWheel(g, M, wx, 13, s * (W / 2), 13, 8);
        put(g, gBox(L * 0.5, 4, W * 0.8), M.metalDark, L * 0.08, 67, 0);          // roof rack
        g.userData.h = 84;
        return g;
    },
    'sandbags': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subSandbags(g, M, o.w * 1.3, o.h, rng, 3); return g; },
    'rope coil': (o, M, rng) => {
        const g = new THREE.Group();
        for (let i = 0; i < 4; i++) put(g, new THREE.TorusGeometry(o.w * 0.36 - i * 0.6, 2.4, 6, 18), M.rope, rng() * 1.5, 2.4 + i * 4, rng() * 1.5, 0, 0, 0).rotation.x = Math.PI / 2;
        g.userData.h = 24;
        return g;
    },
    'tin bucket': (o, M) => {
        const g = new THREE.Group();
        put(g, new THREE.CylinderGeometry(o.w * 0.4, o.w * 0.3, o.w * 0.8, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0x8a8a84, roughness: 0.5, metalness: 0.5, side: THREE.DoubleSide }), 0, o.w * 0.4, 0);
        put(g, new THREE.TorusGeometry(o.w * 0.36, 0.5, 4, 16, Math.PI), M.steel, 0, o.w * 0.8, 0);
        g.userData.h = o.w + 12;
        return g;
    },
    'tarped supplies': (o, M, rng) => {
        const g = new THREE.Group();
        subCrate(g, M, -o.w * 0.25, 0, 0, 36);
        subCrate(g, M, o.w * 0.15, 0, -4, 40);
        subCrate(g, M, -o.w * 0.05, 30, 0, 30);
        const tarp = put(g, sagPlane(o.w * 1.05, o.h * 2.2, -8, 8, 6), M.tarp, 0, 50, 0);
        tarp.rotation.x = -Math.PI / 2;
        for (const sx of [-0.3, 0.2]) put(g, gBox(2.4, 52, o.h + 16), M.rope, o.w * sx, 26, 0);
        g.userData.h = 66;
        return g;
    },
    'radio antenna': (o, M) => {
        const g = new THREE.Group();
        const H = 190;
        for (let i = 0; i < 3; i++) { // lattice mast
            const a = i / 3 * Math.PI * 2;
            put(g, gCyl(0.9, 0.9, H, 4), M.steel, Math.cos(a) * 5, H / 2, Math.sin(a) * 5);
        }
        for (let y = 12; y < H; y += 16) put(g, new THREE.TorusGeometry(5.5, 0.5, 3, 3), M.steel, 0, y, 0).rotation.x = Math.PI / 2;
        put(g, gBox(40, 1.4, 1.4), M.steel, 0, H - 20, 0);
        put(g, gBox(26, 1.4, 1.4), M.steel, 0, H - 36, 0, 0.8);
        for (let i = 0; i < 3; i++) { // guy wires
            const a = i / 3 * Math.PI * 2 + 0.3;
            subBeam(g, M.steel, new THREE.Vector3(0, H * 0.8, 0), new THREE.Vector3(Math.cos(a) * 90, 0, Math.sin(a) * 90), 0.3, 3).userData.noCast = true;
        }
        const tip = put(g, new THREE.SphereGeometry(2.4, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff4030, toneMapped: false }), 0, H + 3, 0);
        tip.userData.noShadow = true;
        g.add(ch1GlowSprite(0, H + 3, 0, 30, 0xff4030, 0.7));
        g.userData.h = H + 12;
        return g;
    },
    'tool box': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gBox(o.w, 14, o.h * 0.7), M.paintRed, 0, 7, 0, (rng() - 0.5) * 0.4);
        put(g, gBox(o.w * 0.6, 2.4, 3), M.steel, 0, 17, 0);
        put(g, gBox(4, 3, 26), M.steel, o.w * 0.7, 1.5, 0, 0.6);             // a trowel beside it
        put(g, gCyl(1.2, 1.2, 40, 5), M.woodPale, -o.w * 0.2, 2, o.h * 0.7, 0.5, Math.PI / 2); // shovel haft
        put(g, gBox(12, 1.5, 14), M.steel, -o.w * 0.2 + 20, 2, o.h * 0.7 + 10, 0.5);
        g.userData.h = 26;
        return g;
    },
    'driftwood': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gCyl(3.4, 5, o.w, 7), M.woodPale, 0, 5, 0, 0, Math.PI / 2 - 0.1, 0.06);
        put(g, gCyl(2, 3, o.w * 0.5, 6), M.woodPale, o.w * 0.2, 7, 6, 0, Math.PI / 2 + 0.5);
        g.userData.h = 18;
        return g;
    },
    'broken clay pot': (o, M, rng) => {
        const g = new THREE.Group();
        const pot = put(g, new THREE.LatheGeometry([[0, 0], [7, 1], [10, 8], [9, 16], [5, 20], [5.5, 22]].map(p => new THREE.Vector2(p[0], p[1])), 14, 0, Math.PI * 1.4), M.terracotta, 0, 0, 0, 0, 1.3);
        pot.material = new THREE.MeshStandardMaterial({ color: 0xa4643c, roughness: 0.9, side: THREE.DoubleSide });
        pot.position.y = 8;
        for (let i = 0; i < 4; i++) put(g, gBox(6, 1.4, 5), M.terracotta, (rng() - 0.5) * o.w * 1.6, 0.7, (rng() - 0.5) * o.h * 1.6, rng() * 3);
        g.userData.h = 28;
        return g;
    },
    'work lamp': (o, M, rng) => {
        const g = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2;
            subBeam(g, M.paintYellow, new THREE.Vector3(Math.cos(a) * 20, 0, Math.sin(a) * 20), new THREE.Vector3(0, 70, 0), 1.3);
        }
        put(g, gCyl(1.4, 1.4, 50, 6), M.steel, 0, 94, 0);
        put(g, gBox(22, 3, 3), M.steel, 0, 118, 0);
        for (const s of [-1, 1]) {
            const head = put(g, gBox(14, 12, 8), M.paintYellow, s * 10, 118, 2, 0, 0, 0);
            head.rotation.x = 0.35;
            const face = put(g, gBox(11, 9, 1), M.bulbCool, s * 10, 116.5, 6.5, 0, 0, 0);
            face.rotation.x = 0.35;
            face.userData.noShadow = true;
        }
        ch1Lamp(g, 0, 112, 14, { color: 0xdfe8ff, intensity: 1.9, dist: 700, glow: 70, steady: true, glowStrength: 0.7 });
        ch1AddMoths(g, 0, 118, 12);
        g.userData.h = 130;
        return g;
    },
    'lantern': (o, M) => {
        const g = new THREE.Group();
        // a hurricane lantern hung from a crooked post
        put(g, gCyl(1.6, 2, 66, 6), M.woodDark, 0, 33, 0);
        put(g, gBox(16, 2.4, 2.4), M.woodDark, 6, 64, 0);
        put(g, gCyl(0.3, 0.3, 6, 3), M.metalDark, 12, 60, 0);
        put(g, gCyl(4, 5, 3, 10), M.metalDark, 12, 49, 0);
        put(g, gCyl(3.4, 3.4, 8, 10), new THREE.MeshBasicMaterial({ color: 0xffc070, toneMapped: false }), 12, 54, 0).userData.noShadow = true;
        put(g, gCyl(2, 4, 3, 10), M.metalDark, 12, 59, 0);
        ch1Lamp(g, 12, 54, 0, { intensity: 1.35, dist: 430, glow: 44 });
        g.userData.h = 72;
        return g;
    },
    'palm tree': (o, M, rng) => {
        const g = new THREE.Group();
        g.userData.h = subPalm(g, M, 1.15 + rng() * 0.35, rng);
        return g;
    },
    "sam's date palm": (o, M, rng) => {
        const g = new THREE.Group();
        g.userData.h = subPalm(g, M, 1.25, rng);
        put(g, gCyl(12, 10, 10, 14), M.terracotta, 20, 5, 16);                 // someone keeps it watered
        put(g, gCyl(4, 4, 10, 10), M.paintBlue, 34, 5, 10);
        return g;
    },
    'camp gate post': (o, M, rng) => {
        const g = new THREE.Group();
        subGatePillar(g, M);
        g.userData.h = 168;
        return g;
    },
    "sam's tool shed": (o, M, rng) => {
        const g = new THREE.Group();
        subShed(g, M, o.w, o.h, 70, rng);
        g.userData.h = 90;
        return g;
    },
    'dig shed clipboard': (o, M, rng) => {
        const g = new THREE.Group();
        // the clipboard hangs on a post by the dig shed door
        put(g, gBox(5, 64, 5), M.woodDark, 20, 32, 20);
        put(g, gBox(2, 24, 18), M.wood, 20, 52, 23, Math.PI / 2);
        put(g, gBox(1, 18, 13), M.paper, 20, 52, 24.5, Math.PI / 2);
        put(g, gCyl(0.3, 0.3, 14, 3), M.dark, 28, 44, 24);
        g.userData.h = 76;
        return g;
    },
    'ministry post': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gCyl(1.8, 2.4, 150, 8), M.steel, -o.w * 0.2, 75, 0);
        const flag = makeTex('c1flag', 96, 64, 1, 1, (cc, w, h) => {
            cc.fillStyle = '#ce1126'; cc.fillRect(0, 0, w, h / 3);
            cc.fillStyle = '#ffffff'; cc.fillRect(0, h / 3, w, h / 3);
            cc.fillStyle = '#000000'; cc.fillRect(0, h * 2 / 3, w, h / 3);
            cc.fillStyle = '#c09300'; cc.beginPath(); cc.arc(w / 2, h / 2, 7, 0, 7); cc.fill();
        });
        const fg = new THREE.PlaneGeometry(44, 28, 8, 1);
        fg.translate(22, 0, 0);
        const fl = put(g, fg, new THREE.MeshStandardMaterial({ map: flag, side: THREE.DoubleSide, roughness: 0.9 }), -o.w * 0.2 + 2, 134, 0);
        ch1FX.sway.push({ obj: fl, axis: 'y', base: -0.4, amp: 0.25, speed: 1.8, phase: 0 });
        // notice board on legs
        for (const s of [-1, 1]) put(g, gBox(4, 50, 4), M.woodDark, o.w * 0.2 + s * 18, 25, 0);
        put(g, gBox(46, 30, 3), signMat('ministry', [['وزارة السياحة والآثار', 20], ['MINISTRY OF TOURISM', 16], ['AND ANTIQUITIES', 16]], '#f0ead8', '#1a2a4a', 256, 160), o.w * 0.2, 44, 1.5, 0.15);
        g.userData.h = 150;
        return g;
    },
    'guard booth': (o, M, rng) => {
        const g = new THREE.Group();
        const w = 126, d = 98;
        g.position.x = 0;
        const inner = new THREE.Group();
        inner.position.set(-4, 0, -10);
        put(inner, gBox(w, 80, d), M.paintWhite, 0, 40, 0);
        put(inner, gBox(w + 16, 6, d + 16), M.paintBlue, 0, 83, 0);
        put(inner, gBox(w * 0.7, 24, 2), M.window, 0, 54, d / 2 + 1).userData.noCast = true;
        put(inner, gBox(w + 1, 6, d + 1), M.paintBlue, 0, 20, 0);
        put(inner, gBox(24, 58, 2), M.metalDark, -w / 2 - 1, 29, 10, Math.PI / 2);
        inner.add(ch1GlowSprite(0, 54, d / 2 + 10, 70, 0xffe0a0, 0.3));
        // boom barrier across the road
        put(inner, gBox(8, 36, 8), M.paintWhite, -w / 2 - 20, 18, d / 2 + 10);
        const boom = put(inner, gBox(150, 4, 4), M.paintRed, -w / 2 - 95, 34, d / 2 + 10);
        for (let i = 0; i < 4; i++) put(inner, gBox(16, 4.4, 4.4), M.paintWhite, -w / 2 - 40 - i * 36, 34, d / 2 + 10);
        g.add(inner);
        g.userData.h = 100;
        return g;
    },
    'scaffolding': (o, M, rng) => {
        const g = new THREE.Group();
        const w = 96, d = 70, H = 150;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(g, gCyl(1.8, 1.8, H, 6), M.steel, sx * w / 2, H / 2, sz * d / 2);
        for (const y of [40, 90, 140]) {
            for (const sz of [-1, 1]) put(g, gCyl(1.4, 1.4, w, 5), M.steel, 0, y, sz * d / 2, 0, 0, Math.PI / 2);
            for (const sx of [-1, 1]) put(g, gCyl(1.4, 1.4, d, 5), M.steel, sx * w / 2, y, 0, 0, 0, 0).rotation.x = Math.PI / 2;
        }
        subBeam(g, M.steel, new THREE.Vector3(-w / 2, 0, d / 2), new THREE.Vector3(w / 2, 90, d / 2), 1.2);
        subBeam(g, M.steel, new THREE.Vector3(-w / 2, 90, -d / 2), new THREE.Vector3(w / 2, 0, -d / 2), 1.2);
        put(g, gBox(w, 4, d), M.planks, 0, 92, 0);
        put(g, gBox(w * 0.8, 2, d), M.planksDark, 0, 42, 0);
        subCrate(g, M, 20, 94, 0, 22, 0.3);
        put(g, gBox(8, 22, 8), M.paintYellow, -30, 105, 10);                  // a bucket hoist
        g.userData.h = H + 8;
        return g;
    },
    'site trailer': (o, M, rng) => {
        const g = new THREE.Group();
        const w = o.w, d = 128;
        const zc = -(o.h - d) / 2; // the collision box is the northern 128 of the footprint
        const box = new THREE.Group();
        box.position.z = zc;
        put(box, gBox(w, 78, d), M.paintWhite, 0, 58, 0);
        put(box, gBox(w + 2, 6, d + 2), M.paintBlue, 0, 44, 0);
        put(box, gBox(w + 8, 4, d + 8), M.metal, 0, 99, 0);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(box, gBox(12, 20, 12), M.limestone, sx * (w / 2 - 20), 10, sz * (d / 2 - 16));
        for (let i = 0; i < 3; i++) {
            const x = -w / 2 + 44 + i * 56;
            put(box, gBox(34, 22, 2), i === 0 ? M.window : M.windowDim, x, 66, d / 2 + 1).userData.noCast = true;
            if (i === 0) box.add(ch1GlowSprite(x, 66, d / 2 + 10, 70, 0xffa84a, 0.35));
        }
        put(box, gBox(30, 62, 2), M.paintBlue, w / 2 - 34, 51, d / 2 + 1.2);
        put(box, gBox(40, 4, 26), M.metal, w / 2 - 34, 18, d / 2 + 14);          // steps
        put(box, gBox(40, 4, 20), M.metal, w / 2 - 34, 8, d / 2 + 26);
        put(box, gBox(30, 20, 20), M.paintWhite, -w * 0.3, 112, 0);             // AC unit
        put(box, gBox(30, 4, 26), M.window, w / 2 - 34, 86, d / 2 + 12).userData.noCast = true; // porch light shade
        box.add(ch1GlowSprite(w / 2 - 34, 84, d / 2 + 14, 40, 0xffd090, 0.5));
        g.add(box);
        g.userData.h = 124;
        return g;
    },
    'gear storage': (o, M, rng) => {
        const g = new THREE.Group();
        subCrate(g, M, -o.w * 0.3, 0, -8, 48, 0.1);
        subCrate(g, M, -o.w * 0.08, 0, 6, 52, -0.1);
        subCrate(g, M, o.w * 0.2, 0, -10, 44, 0.2);
        subDrum(g, M.paintBlue, M, o.w * 0.38, 20, 16);
        subCrate(g, M, -o.w * 0.18, 42, -4, 40, 0.3);
        const tarp = put(g, sagPlane(o.w * 0.95, o.h * 1.4, -14, 10, 6), M.tarp, 0, 74, 0);
        tarp.rotation.x = -Math.PI / 2;
        for (const sx of [-0.35, 0, 0.3]) put(g, gBox(2.4, 70, o.h + 10), M.rope, o.w * sx, 35, 0);
        g.userData.h = 86;
        return g;
    },
    'path lamp': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gCyl(2, 2.6, 92, 6), M.woodDark, 0, 46, 0);
        put(g, gBox(22, 2.6, 2.6), M.woodDark, 9, 88, 0);
        put(g, gCyl(0.3, 0.3, 7, 3), M.metalDark, 18, 83, 0);
        put(g, gCyl(4, 5, 3, 10), M.metalDark, 18, 72, 0);
        put(g, gCyl(3.4, 3.4, 8, 10), new THREE.MeshBasicMaterial({ color: 0xffc070, toneMapped: false }), 18, 77, 0).userData.noShadow = true;
        put(g, gCyl(2, 4, 3, 10), M.metalDark, 18, 82, 0);
        ch1Lamp(g, 18, 77, 0, { intensity: 1.2, dist: 420, glow: 40 });
        g.rotation.y = rng() * 6.28;
        g.userData.h = 0;
        return g;
    },
    'road closed': (o, M, rng) => {
        // the road leaves the site here — and doesn't, tonight
        const g = new THREE.Group();
        for (const s of [-1, 1]) {
            put(g, gBox(10, 40, 10), M.paintWhite, s * 100, 20, 0);
            put(g, gBox(16, 16, 16), M.limestone, s * 100, 6, 0);
        }
        put(g, gBox(180, 6, 5), M.paintRed, 0, 36, 0);
        for (let i = 0; i < 5; i++) put(g, gBox(18, 6.4, 5.4), M.paintWhite, -72 + i * 36, 36, 0);
        put(g, gBox(90, 40, 3), signMat('roadclosed', [['طريق مغلق', 30], ['ROAD CLOSED', 26], ['ANTIQUITIES POLICE', 16]], '#c8a030', '#1a1408', 256, 128), 0, 62, -2);
        for (const s of [-1, 1]) put(g, gBox(4, 50, 4), M.metalDark, s * 40, 25, -3);
        for (let i = 0; i < 5; i++) {
            const x = -120 + i * 60 + (rng() - 0.5) * 20;
            put(g, new THREE.ConeGeometry(7, 22, 10), M.paintRed, x, 11, 34 + (rng() - 0.5) * 20);
            put(g, gCyl(6, 6, 3, 10), M.paintWhite, x, 13, 34);
        }
        ch1Lamp(g, 0, 90, 0, { color: 0xff5030, intensity: 0.8, dist: 300, glow: 30 });
        put(g, new THREE.SphereGeometry(3, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff5030, toneMapped: false }), 0, 90, 0).userData.noShadow = true;
        g.userData.h = 0;
        return g;
    },
    'open sky': (o, M, rng) => {
        const g = new THREE.Group();
        // a bedroll where someone lies back and watches the stars
        const roll = put(g, gBox(o.w * 1.3, 6, o.h * 0.6), M.tarp, 0, 3, 0, 0.3);
        put(g, gCyl(8, 8, o.h * 0.6, 10), M.canvasDark, -o.w * 0.55, 8, o.h * 0.18, 0.3, 0).rotation.set(Math.PI / 2, 0.3, 0);
        put(g, gCyl(4, 5, 12, 8), M.metalDark, o.w * 0.6, 6, -o.h * 0.35);
        put(g, gCyl(3, 3, 6, 8), new THREE.MeshBasicMaterial({ color: 0xffc070, toneMapped: false }), o.w * 0.6, 14, -o.h * 0.35).userData.noShadow = true;
        g.add(ch1GlowSprite(o.w * 0.6, 14, -o.h * 0.35, 30, 0xffb060, 0.6));
        g.userData.h = 26;
        return g;
    },
};

function subShed(g, M, w, d, hWall, rng) {
    put(g, gBox(w, hWall, d), M.corrugated, 0, hWall / 2, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(g, gBox(5, hWall + 4, 5), M.woodDark, sx * w / 2, (hWall + 4) / 2, sz * d / 2);
    const roof = put(g, gBox(w + 20, 4, d + 20), M.corrugated, 0, hWall + 6, 0);
    roof.rotation.z = 0.08;
    put(g, gBox(w * 0.36, hWall * 0.82, 2), M.planksDark, -w * 0.12, hWall * 0.41, d / 2 + 1.2);   // door
    put(g, gBox(6, 4, 2), M.rust, -w * 0.12 + w * 0.14, hWall * 0.45, d / 2 + 2.5);                 // hasp
    put(g, gBox(28, 16, 2), signMat('shed' + w, [['TOOLS', 26]], '#c8a030', '#1a1408', 128, 64), w * 0.22, hWall * 0.7, d / 2 + 1.5);
    // tools leaning on the wall
    for (let i = 0; i < 3; i++) {
        const x = w * 0.1 + i * 9;
        subBeam(g, M.woodPale, new THREE.Vector3(x, 0, d / 2 + 14), new THREE.Vector3(x + 3, 58, d / 2 + 2), 1.1);
        put(g, gBox(10, 12, 1.5), M.steel, x, 4, d / 2 + 14, 0, 0, 0).rotation.x = -0.2;
    }
    return hWall + 14;
}

function subGatePillar(g, M) {
    // rendered brick pillar with a caged lamp on top
    put(g, gBox(40, 136, 40), M.plaster, 0, 68, 0);
    put(g, gBox(48, 8, 48), M.limestone, 0, 140, 0);
    put(g, gBox(46, 10, 46), M.limestone, 0, 5, 0);
    put(g, gCyl(6, 8, 8, 10), M.metalDark, 0, 148, 0);
    put(g, gCyl(5, 5, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd9a0, toneMapped: false }), 0, 158, 0).userData.noShadow = true;
    put(g, gCyl(7, 6, 4, 10), M.metalDark, 0, 166, 0);
    ch1Lamp(g, 0, 158, 0, { intensity: 1.3, dist: 520, glow: 56 });
}

// Date palm: a curved, ringed trunk, drooping fronds, date clusters
function subPalm(g, M, scale, rng) {
    const segs = 8, segH = 22 * scale;
    const lean = (rng() - 0.5) * 0.5, leanDir = rng() * Math.PI * 2;
    let px = 0, py = 0, pz = 0;
    const ringTex = CH1M.trunkRing || (CH1M.trunkRing = new THREE.MeshStandardMaterial({
        roughness: 1, map: makeTex('c1trunk', 64, 128, 1, 3, (cc, w, h) => {
            cc.fillStyle = '#7a644a'; cc.fillRect(0, 0, w, h);
            for (let y = 0; y < h; y += 10) {
                cc.fillStyle = '#5a4630'; cc.fillRect(0, y, w, 3);
                for (let x = 0; x < w; x += 8) { cc.fillStyle = 'rgba(40,30,20,0.5)'; cc.fillRect(x + (y / 10 % 2) * 4, y + 3, 2, 6); }
            }
        })
    }));
    for (let i = 0; i < segs; i++) {
        const tilt = lean * Math.pow((i + 0.5) / segs, 1.5);
        const r0 = 5.2 * scale * (1 - i * 0.06), r1 = 5.2 * scale * (1 - (i + 1) * 0.06);
        const m = put(g, gCyl(r1, r0, segH + 3, 9), ringTex, px, py + segH / 2, pz);
        m.rotation.set(Math.sin(leanDir) * tilt, 0, -Math.cos(leanDir) * tilt);
        px += Math.cos(leanDir) * Math.sin(tilt) * segH;
        pz += Math.sin(leanDir) * Math.sin(tilt) * segH;
        py += Math.cos(tilt) * segH;
    }
    const crown = new THREE.Group();
    crown.position.set(px, py, pz);
    g.add(crown);
    put(crown, new THREE.SphereGeometry(7 * scale, 8, 6), M.trunk, 0, 0, 0);
    const n = 13;
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rng() * 0.3;
        const up = i % 3 === 0;
        const len = (70 + rng() * 22) * scale;
        const geo = new THREE.PlaneGeometry(len, 20 * scale, 8, 1);
        geo.translate(len / 2, 0, 0);
        const p = geo.attributes.position;
        const droop = up ? 0.35 : 0.9;
        for (let k = 0; k < p.count; k++) { // arc downward along its length
            const u = p.getX(k) / len;
            p.setY(k, p.getY(k) * (1 - u * 0.4) - u * u * len * droop * 0.55);
        }
        geo.computeVertexNormals();
        const f = new THREE.Mesh(geo, M.frond);
        f.rotation.set(0.35 * (rng() - 0.5) + Math.PI / 2 * 0.15, -a, (up ? 0.55 : 0.18));
        f.rotation.order = 'YZX';
        f.rotation.set(0.5, -a, up ? 0.5 : 0.12);
        crown.add(f);
    }
    for (let i = 0; i < 3; i++) { // date clusters
        const a = rng() * 7;
        const c = put(crown, new THREE.SphereGeometry(5 * scale, 7, 6), M.terracotta, Math.cos(a) * 6, -8 * scale, Math.sin(a) * 6);
        c.scale.set(1, 1.5, 1);
    }
    ch1FX.sway.push({ obj: crown, axis: 'z', base: 0, amp: 0.035, speed: 0.9, phase: rng() * 7 });
    return py + 26;
}

// Resolve a label-keyed builder: exact key, then containment
function ch1LabelBuilder(o) {
    const l = (o.label || '').toLowerCase();
    if (CH1_LABEL_BUILDERS[l]) return CH1_LABEL_BUILDERS[l];
    for (const key in CH1_LABEL_BUILDERS) {
        if (l.includes(key)) return CH1_LABEL_BUILDERS[key];
    }
    return null;
}

// Build one map object (null → engine falls back to a plain box)
function buildCh1Object(o) {
    const builder = CH1_BUILDERS[o.id] || ch1LabelBuilder(o);
    if (!builder) return null;
    const M = ch1Mats();
    const g = builder(o, M, seededRng(o.id || o.label || 'x'));
    const cx = o.x + o.w / 2, cz = o.y + o.h / 2;
    // the trench planks / things over the cut sit at grade
    g.position.set(cx, ch1HeightBase(cx, cz), cz);
    return g;
}

// ============================================================
// WALLS
// ============================================================
function ch1BuildGate(wall) {
    const M = ch1Mats();
    const g = new THREE.Group();
    const x0 = CH1_LAYOUT.gateOpen[0], x1 = CH1_LAYOUT.gateOpen[1]; // the passable opening once the gate swings
    const z = CH1_LAYOUT.fenceZ, gh = ch1HeightBase((x0 + x1) / 2, z);
    g.position.set((x0 + x1) / 2, gh, z);
    const w = x1 - x0, H = 92;
    for (const s of [-1, 1]) {
        const leaf = new THREE.Group();
        const lw = w / 2 - 6;
        put(leaf, gCyl(2.2, 2.2, H, 6), M.steel, 0, H / 2, 0);
        put(leaf, gCyl(2.2, 2.2, H, 6), M.steel, -s * lw, H / 2, 0);
        for (const y of [4, H - 2, H / 2]) put(leaf, gCyl(1.8, 1.8, lw, 6), M.steel, -s * lw / 2, y, 0, 0, 0, Math.PI / 2);
        const mesh = put(leaf, new THREE.PlaneGeometry(lw, H - 6), M.chain, -s * lw / 2, H / 2, 0);
        mesh.material = M.chain.clone();
        mesh.material.map = M.chain.map.clone();
        mesh.material.map.needsUpdate = true;
        mesh.material.map.repeat.set(lw / 24, (H - 6) / 24);
        mesh.userData.noCast = true;
        leaf.position.x = s * (w / 2 - 2);
        g.add(leaf);
    }
    put(g, gBox(110, 44, 2), signMat('diggate', [['⚠ DIG ZONE — المنطقة المحظورة', 24], ['AUTHORISED PERSONNEL ONLY', 20]], '#e8e0c8', '#8a1a14', 512, 200), -40, 60, 2);
    put(g, gBox(8, 12, 4), M.paintYellow, 6, 48, 2);           // padlock
    subBeam(g, M.steel, new THREE.Vector3(-4, 50, 3), new THREE.Vector3(14, 46, 3), 0.7);
    for (const s of [-1, 1]) put(g, gCyl(4, 4, H + 20, 8), M.steel, s * (w / 2 + 2), (H + 20) / 2, 0);
    return g;
}

// Chain-link perimeter fence between two x (or z) extents
function ch1ChainFence(group, x0, z0, x1, z1, opts) {
    const M = ch1Mats();
    opts = opts || {};
    const H = opts.h || 90;
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.round(len / 130));
    const ang = Math.atan2(z1 - z0, x1 - x0);
    const mat = M.chain.clone();
    mat.map = M.chain.map.clone();
    mat.map.needsUpdate = true;
    mat.map.repeat.set(len / n / 24, H / 24);
    const rng = seededRng('fence' + x0 + ',' + z0);
    for (let i = 0; i <= n; i++) {
        const t = i / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
        const gh = ch1HeightBase(x, z);
        put(group, gCyl(2.4, 2.4, H + 14, 6), M.steel, x, gh + (H + 14) / 2 - 6, z);
        put(group, gCyl(3.4, 3.4, 5, 8), M.limestone, x, gh + 1, z).userData.noCast = true;
        // barbed-wire arm
        if (opts.barbed) put(group, gBox(2, 14, 2), M.steel, x, gh + H + 12, z - 4, 0, 0, 0).rotation.x = -0.6;
        if (i === n) break;
        const xm = x0 + (x1 - x0) * (t + 0.5 / n), zm = z0 + (z1 - z0) * (t + 0.5 / n);
        const ghm = (gh + ch1HeightBase(x0 + (x1 - x0) * (t + 1 / n), z0 + (z1 - z0) * (t + 1 / n))) / 2;
        const seg = put(group, new THREE.PlaneGeometry(len / n, H), mat, xm, ghm + H / 2 - 2, zm, -ang);
        seg.userData.noCast = true;
        put(group, gCyl(1.4, 1.4, len / n, 5), M.steel, xm, ghm + H + 2, zm, -ang, 0, Math.PI / 2).userData.noCast = true;
        if (opts.barbed) for (const k of [0, 1]) put(group, gCyl(0.4, 0.4, len / n, 3), M.steel, xm, ghm + H + 10 + k * 5, zm - 5 - k * 2, -ang, 0, Math.PI / 2).userData.noCast = true;
        if (opts.signs && rng() < 0.28) {
            put(group, gBox(34, 22, 1.5), signMat('fencesign', [['⚠ خطر', 34], ['EXCAVATION', 22]], '#e8e0c8', '#8a1a14', 128, 96), xm, ghm + 58, zm + 3, -ang);
        }
    }
}

// Wooden post-and-rail fence
function ch1RailFence(group, x0, z0, x1, z1) {
    const M = ch1Mats();
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.round(len / 110));
    const rng = seededRng('rail' + x0 + ',' + z0);
    const pts = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
        const gh = ch1HeightBase(x, z);
        put(group, gBox(7, 62, 7), M.woodDark, x, gh + 27, z, rng() * 0.3, (rng() - 0.5) * 0.06);
        pts.push(new THREE.Vector3(x, gh, z));
    }
    for (let i = 0; i < n; i++) {
        for (const y of [22, 46]) {
            const a = pts[i].clone(), b = pts[i + 1].clone();
            a.y += y + (rng() - 0.5) * 3; b.y += y + (rng() - 0.5) * 3;
            const beam = subBeam(group, M.wood, a, b, 2.4, 5);
            beam.scale.set(1.2, 1, 0.8);
        }
    }
}

// Stakes and a sagging rope with little survey pennants
function ch1RopeFence(group, x0, z0, x1, z1) {
    const M = ch1Mats();
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.round(len / 120));
    const pennants = [M.paintRed, M.paintYellow, M.clothBlue, M.paintWhite];
    let prev = null;
    for (let i = 0; i <= n; i++) {
        const t = i / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
        const gh = ch1HeightBase(x, z);
        put(group, gCyl(2.2, 2.8, 52, 6), M.woodPale, x, gh + 24, z);
        const top = new THREE.Vector3(x, gh + 44, z);
        if (prev) {
            const curve = subRope(group, M.rope, prev, top, 8, 0.9);
            for (let k = 1; k < 6; k++) {
                const p = curve.getPoint(k / 6);
                const f = put(group, gableGeo(8, 11), pennants[(i + k) % 4], p.x, p.y, p.z, Math.atan2(top.x - prev.x, top.z - prev.z) + Math.PI / 2);
                f.rotation.x = Math.PI;
                f.material = f.material.clone();
                f.material.side = THREE.DoubleSide;
                f.userData.noCast = true;
            }
        }
        prev = top;
    }
}

// Rock cluster filling an outcrop rect
function ch1RockOutcrop(group, wall) {
    const M = ch1Mats();
    const rng = seededRng('outcrop' + wall.x + ',' + wall.y);
    const cx = wall.x + wall.w / 2, cz = wall.y + wall.h / 2;
    const gh = ch1HeightBase(cx, cz);
    const main = ch1CliffGeo(wall.w * 0.9, 150 + rng() * 60, wall.h * 0.85, rng() * 40, { amp: 30,
        taper: (u, v) => 0.55 + 0.45 * Math.sin(Math.PI * clamp01(v * 1.1 - 0.05)) });
    const m = new THREE.Mesh(main, M.cliff);
    m.position.set(cx, gh + 50, cz);
    group.add(m);
    const n = Math.round(wall.w / 60);
    for (let i = 0; i < n; i++) {
        const x = wall.x + rng() * wall.w, z = rng() < 0.5 ? wall.y + wall.h + rng() * 20 : wall.y + rng() * wall.h;
        ch1AddRock(group, x, ch1Height(x, z), z, 18 + rng() * 34, rng, rng() < 0.3 ? M.rockDark : M.rock);
    }
}

function ch1BuildWall(group, wall) {
    const M = ch1Mats();
    const cx = wall.x + wall.w / 2, cz = wall.y + wall.h / 2;
    const kind = wall.kind || '';

    // the world edge is the dune wall itself (terrain), the escarpment is
    // built by the environment
    if (kind === 'boundary' || kind === 'cliffBase') return;
    // built elsewhere: chalk formations and trees (buildCh1Occluders), the oasis pond (its prop)
    if (kind === 'yardang' || kind === 'trunk' || kind === 'pond') return;

    if (kind === 'northFence') {                                         // dig fence (built once)
        if (!group.userData.northFence) {
            group.userData.northFence = true;
            const [x0, , x1] = CH1_LAYOUT.digRect, [g0, g1] = CH1_LAYOUT.gateOpen, z = CH1_LAYOUT.fenceZ;
            ch1ChainFence(group, x0, z, g0, z, { barbed: true, signs: true });
            ch1ChainFence(group, g1, z, x1, z, { barbed: true, signs: true });
        }
        return;
    }
    if (kind === 'ridge') {                                              // cliffs closing the plateau's sides
        const H = 250;
        const geo = ch1CliffGeo(wall.w + 60, H, wall.h, wall.x * 0.013, { amp: 30,
            taper: (u) => 1 - 0.55 * Math.pow(u, 2) });
        const m = new THREE.Mesh(geo, M.cliff);
        m.position.set(cx + wall.side * 20, ch1HeightBase(cx - wall.side * 150, cz) + H / 2 - 60, cz);
        group.add(m);
        const rng = seededRng('ridge' + wall.x);
        for (let i = 0; i < 14; i++) {
            const z = wall.y + rng() * wall.h, x = cx - wall.side * (wall.w / 2 + 10 + rng() * 60);
            if (Math.abs(z - CH1_LAYOUT.fenceZ) < 90) continue; // keep the fence line clear
            ch1AddRock(group, x, ch1Height(x, z), z, 14 + rng() * 30, rng, rng() < 0.4 ? M.rockDark : M.rock);
        }
        return;
    }
    if (kind === 'digshed') {
        const g = new THREE.Group();
        g.position.set(cx, ch1HeightBase(cx, cz), cz);
        subShed(g, M, wall.w, wall.h, 74, seededRng('digshed'));
        group.add(g);
        return;
    }
    if (kind === 'trenchPlank') {                                        // walk boards across the trench (at grade)
        const gh = ch1HeightBase(cx, cz);
        for (let i = 0; i < 4; i++) put(group, gBox(wall.w + 30, 4, wall.h / 4 - 1), M.planks, cx, gh + 2, wall.y + (i + 0.5) * wall.h / 4);
        for (const s of [-1, 1]) put(group, gBox(wall.w + 40, 6, 6), M.woodDark, cx, gh - 2, cz + s * wall.h / 2);
        return;
    }
    if (kind === 'trenchLip') {                                          // sandbags along the lips, shoring down the walls
        const side = wall.side;
        const rng = seededRng('lip' + wall.x);
        const sb = new THREE.Group();
        sb.position.set(wall.x + (side < 0 ? wall.w : 0) - side * 4, ch1HeightBase(cx, cz), cz);
        sb.rotation.y = Math.PI / 2;
        subSandbags(sb, M, wall.h * 0.35, 20, rng, 2);
        group.add(sb);
        const faceX = side < 0 ? CH1_TRENCH.x0 + 6 : CH1_TRENCH.x1 - 6;
        for (let z = CH1_TRENCH.z0 + 170; z < CH1_TRENCH.z1 - 160; z += 58) {
            const top = ch1HeightBase(faceX, z);
            put(group, gBox(3, CH1_TRENCH.depth + 6, 40), M.planksDark, faceX + side * 4, top - CH1_TRENCH.depth / 2, z, 0, -side * 0.35);
        }
        return;
    }
    if (kind === 'gatepost') {                                           // gate pillar twin
        const g = new THREE.Group();
        g.position.set(cx, ch1HeightBase(cx, cz), cz);
        subGatePillar(g, M);
        group.add(g);
        return;
    }
    if (kind === 'cutting') {                                            // the rock cutting up to the tunnel
        const side = wall.side;
        const H = 200;
        const geo = ch1CliffGeo(wall.w + 30, H, wall.h + 10, wall.x * 0.01, { amp: 20,
            taper: (u) => 1 - 0.72 * Math.pow(u, 1.3) });
        const m = new THREE.Mesh(geo, M.cliff);
        m.position.set(cx + side * 12, ch1HeightBase(cx, wall.y + 40) + H / 2 - 24, cz);
        group.add(m);
        const rng = seededRng('cut' + wall.x);
        for (let i = 0; i < 5; i++) {
            const z = wall.y + 60 + rng() * (wall.h - 20), x = cx - side * (wall.w / 2 + 6);
            ch1AddRock(group, x, ch1Height(x, z), z, 10 + rng() * 16, rng);
        }
        return;
    }
    if (kind === 'outcrop') { ch1RockOutcrop(group, wall); return; }
    if (kind === 'ministryHut') {                                        // ministry site office
        const g = new THREE.Group();
        g.position.set(cx, ch1HeightBase(cx, cz), cz);
        const w = wall.w, d = wall.h;
        put(g, gBox(w, 88, d), M.paintWhite, 0, 50, 0);
        put(g, gBox(w + 2, 8, d + 2), M.paintBlue, 0, 30, 0);
        put(g, gBox(w + 14, 5, d + 14), M.metal, 0, 96, 0);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(g, gBox(14, 12, 14), M.limestone, sx * (w / 2 - 20), 5, sz * (d / 2 - 20));
        for (const x of [-w / 3, 0, w / 3]) put(g, gBox(36, 26, 2), x === 0 ? M.window : M.windowDim, x, 62, d / 2 + 1).userData.noCast = true;
        put(g, gBox(34, 64, 2), M.paintBlue, -w / 2 - 1, 38, 20, Math.PI / 2);
        g.add(ch1GlowSprite(0, 62, d / 2 + 10, 70, 0xffa84a, 0.35));
        put(g, gBox(120, 22, 3), signMat('mota', [['MoTA · وزارة الآثار', 28]], '#1a2a4a', '#f0ead8', 512, 96), 0, 84, d / 2 + 2);
        put(g, gBox(34, 24, 18), M.paintWhite, w / 3, 74, -d / 2 - 9);
        group.add(g);
        return;
    }

    const horizontal = wall.w >= wall.h;
    const [x0, z0, x1, z1] = horizontal ? [wall.x, cz, wall.x + wall.w, cz] : [cx, wall.y, cx, wall.y + wall.h];
    if (kind === 'rope') { ch1RopeFence(group, x0, z0, x1, z1); return; }         // tent compound
    if (kind === 'chain') { ch1ChainFence(group, x0, z0, x1, z1, { h: 80 }); return; } // camp gate fence
    if (kind === 'rail') { ch1RailFence(group, x0, z0, x1, z1); return; }         // worker camp

    // anything left: a rough rock block (shouldn't happen in the current layout)
    const rng = seededRng('w' + wall.x + ',' + wall.y);
    const geo = ch1CliffGeo(wall.w, 90, wall.h, rng() * 40, { amp: 10 });
    const m = new THREE.Mesh(geo, M.rock);
    m.position.set(cx, ch1HeightBase(cx, cz) + 40, cz);
    group.add(m);
    if (window.console) console.warn('[ch1] unstyled wall', JSON.stringify(wall));
}

// Extra set dressing that has no map object: festoons, the wheelbarrow,
// the survey grid, the water bowser — plus the open world's wayfinding:
// telegraph poles along the roads (leading lines), fingerposts at the
// junctions, sand fences along the dune foot.
function addCh1Dressing(group) {
    const M = ch1Mats();
    const atW = (x, z, y) => new THREE.Vector3(x, ch1HeightBase(x, z) + y, z);
    // old-map coordinates inside an area, moved with that area
    const at = (zone, x, z, y) => { const [nx, nz] = ch1Old(zone, x, z); return atW(nx, nz, y); };

    // festoon over the worker camp yard: dorm corner → foreman corner → poles by the brazier
    const poleA = at('worker', 700, 2470, 0), poleB = at('worker', 260, 2470, 0);
    for (const p of [poleA, poleB]) put(group, gCyl(2.4, 3, 120, 6), M.woodDark, p.x, p.y + 60, p.z);
    subFestoon(group, M, [at('worker', 450, 2190, 96), at('worker', 700, 2470, 118), at('worker', 260, 2470, 118), at('worker', 140, 2190, 94)], 14, 30);
    subFestoon(group, M, [at('hub', 1260, 2010, 42), at('hub', 1560, 2010, 60), at('hub', 1860, 2010, 60), at('hub', 2120, 2010, 42)], 10, 36);
    // a wheelbarrow by the spoil heaps inside the dig zone
    const wb = new THREE.Group();
    wb.position.copy(at('dig', 1980, 1320, 0));
    wb.rotation.y = 0.7;
    put(wb, gBox(40, 14, 28), M.paintGreen, 0, 20, 0, 0, 0.12);
    subWheel(wb, M, 26, 8, 0, 8, 4);
    for (const s of [-1, 1]) subBeam(wb, M.woodPale, new THREE.Vector3(10, 16, s * 10), new THREE.Vector3(-40, 28, s * 13), 1.3);
    for (const s of [-1, 1]) put(wb, gBox(3, 16, 3), M.metalDark, -10, 8, s * 10);
    group.add(wb);
    // survey grid: string lines on pegs over the dig area
    for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) {
        const p = at('dig', 2000 + i * 120, 1000 + k * 120, 6);
        put(group, gBox(3, 16, 3), M.woodPale, p.x, ch1Height(p.x, p.z) + 6, p.z);
    }
    for (let i = 0; i < 4; i++) subRope(group, M.paper, at('dig', 2000 + i * 120, 1000, 12), at('dig', 2000 + i * 120, 1240, 12), 1, 0.3);
    for (let k = 0; k < 3; k++) subRope(group, M.paper, at('dig', 2000, 1000 + k * 120, 12), at('dig', 2360, 1000 + k * 120, 12), 1, 0.3);
    // parked water bowser by the tent compound
    const bowser = new THREE.Group();
    bowser.position.copy(at('hub', 1180, 2560, 0));
    bowser.rotation.y = 1.2;
    put(bowser, gCyl(22, 22, 90, 16), M.paintBlue, 0, 38, 0, 0, Math.PI / 2);
    put(bowser, gBox(96, 6, 36), M.metalDark, 0, 14, 0);
    for (const s of [-1, 1]) subWheel(bowser, M, 0, 12, s * 22, 12, 7);
    put(bowser, gBox(50, 5, 5), M.metalDark, -70, 14, 0);
    put(bowser, gBox(40, 12, 1), signMat('water', [['مياه · WATER', 28]], '#e8e0c8', '#1a3a6a', 256, 80), 0, 40, 23);
    group.add(bowser);

    // telegraph poles with sagging wires along the roads: you can follow
    // them home from anywhere
    const poleLine = (pts, spacing, off) => {
        let prev = null;
        for (let i = 0; i < pts.length - 1; i++) {
            const [ax, az] = pts[i], [bx, bz] = pts[i + 1];
            const len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / spacing));
            const nx = -(bz - az) / len, nz = (bx - ax) / len;
            for (let k = 0; k < n + (i === pts.length - 2 ? 1 : 0); k++) {
                const t = k / n, x = ax + (bx - ax) * t + nx * off, z = az + (bz - az) * t + nz * off;
                const gh = ch1HeightBase(x, z);
                const pole = put(group, gCyl(2.4, 3.2, 170, 6), M.woodDark, x, gh + 85, z, 0, (Math.sin(x) * 0.03));
                const arm = put(group, gBox(34, 3, 3), M.woodDark, x, gh + 160, z, Math.atan2(bz - az, bx - ax) + Math.PI / 2);
                const top = new THREE.Vector3(x, gh + 162, z);
                if (prev) {
                    for (const s of [-12, 12]) {
                        const a = prev.clone(), b = top.clone();
                        const perp = new THREE.Vector3(nx, 0, nz).multiplyScalar(s);
                        a.add(perp); b.add(perp);
                        subRope(group, M.dark, a, b, 14, 0.35);
                    }
                }
                prev = top;
            }
        }
    };
    poleLine([[4940, 8600], [4990, 7600], [5150, 6700], [5420, 5900]], 460, 110);
    poleLine([[6100, 5300], [6900, 5500], [7800, 5360], [8600, 5200], [9000, 5100]], 460, -90);
    poleLine([[9080, 8600], [9100, 7000], [9110, 5600]], 460, 120);

    // fingerposts at the junctions
    const post = (x, z, arms) => {
        const gh = ch1HeightBase(x, z);
        put(group, gBox(6, 110, 6), M.woodDark, x, gh + 55, z);
        arms.forEach(([text, ang], i) => {
            const g = new THREE.Group();
            g.position.set(x, gh + 96 - i * 17, z);
            g.rotation.y = ang;
            put(g, gBox(74, 13, 2), signMat('fp_' + text, [[text, 30]], '#e8dcc0', '#3a2a14', 256, 48), 40, 0, 0);
            put(g, new THREE.ConeGeometry(8, 12, 3), M.woodPale, 80, 0, 0, 0, -Math.PI / 2);
            group.add(g);
        });
    };
    // bearings: yaw so the sign's +x points toward the place
    const toward = (x, z, tx, tz) => -Math.atan2(tz - z, tx - x);
    const hubX = 5520, hubZ = 5620;
    post(hubX, hubZ, [
        ['DIG ZONE', toward(hubX, hubZ, 5600, 4600)], ["WORKERS' CAMP", toward(hubX, hubZ, 3000, 5500)],
        ['MINISTRY POST', toward(hubX, hubZ, 8000, 5400)], ['SITE GATE', toward(hubX, hubZ, 5000, 7300)],
    ]);
    post(6040, 4700, [['EAST TRENCH', toward(6040, 4700, 7200, 4150)], ['DIG ZONE', toward(6040, 4700, 5980, 3980)]]);
    post(2060, 5320, [['OASIS', toward(2060, 5320, 1100, 4300)], ['CAMP', toward(2060, 5320, 3500, 5620)]]);

    // old sand fences along the dune foot — the site's edge, marked the
    // way desert camps mark it
    const B = CH1_LAYOUT.boundary, rng = seededRng('sandfence');
    for (let i = 0; i < B.length; i++) {
        if (rng() < 0.45) continue;
        const [ax, az] = B[i], [bx, bz] = B[(i + 1) % B.length];
        const len = Math.hypot(bx - ax, bz - az);
        const inX = (bz - az) / len, inZ = -(bx - ax) / len; // into the site
        const t0 = 0.2 + rng() * 0.3, n = 6 + (rng() * 6 | 0);
        for (let k = 0; k < n; k++) {
            const t = t0 + k * (60 / len);
            if (t > 0.95) break;
            let x = ax + (bx - ax) * t, z = az + (bz - az) * t;
            x -= inX * 150; z -= inZ * 150;
            if (ch1BoundaryOut(x, z) > 0) { x += inX * 300; z += inZ * 300; }
            if (CH1_LAYOUT.roadExits.some(([rx, rz]) => Math.hypot(x - rx, z - rz) < 400)) continue;
            put(group, gBox(4, 34 + rng() * 14, 4), M.woodPale, x, ch1HeightBase(x, z) + 12, z, 0, (rng() - 0.5) * 0.3);
            put(group, gBox(Math.min(58, len * 0.06), 20, 1.2), M.planksDark, x + (bx - ax) / len * 30, ch1HeightBase(x, z) + 16, z + (bz - az) / len * 30, -Math.atan2(bz - az, bx - ax), (rng() - 0.5) * 0.1);
        }
    }
    if (typeof buildCh1SupplyLine === 'function') buildCh1SupplyLine(group);
}
