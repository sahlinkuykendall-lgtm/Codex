// ============================================================
// CHAPTER 1 — CRATES, DRUMS AND BARRELS FROM THE MODEL LIBRARY (ch1a_crates.js)
// Every crate and drum in the world was the same hand-made box or
// cylinder. Now each one picks a model, steadily (the same spot always
// gets the same one), so they are mixed and not repeated:
//   - single crates: the nailed wooden crate, or the old SCA-stencilled box
//   - crate stacks: stacked shipping crates, a pile of crates, or a
//     hand-built stack of mixed singles
//   - drums: blue plastic water drums, red and black oil drums
// Plus new set dressing: vegetable crates by the camp kitchen, a wooden
// water barrel in the mess tent, and army crates by the Ministry post.
// Loaded after ch1a_models.js (uses c1mBox / c1mCentre).
// ============================================================

// Size a spawned model to fill a box w × h × d (each axis on its own,
// so a cube crate can become a low one), centred, base at y = 0
function c1cFill(inst, w, h, d) {
    return inst.ready.then(() => {
        const m = inst.model;
        if (!m) return;
        const s = c1mBox(m).getSize(new THREE.Vector3());
        m.scale.set(m.scale.x * w / s.x, m.scale.y * h / s.y, m.scale.z * d / s.z);
        return c1mCentre(inst, 0, 0, 0);
    });
}
// Uniform: longest footprint side to fit w × d
function c1cFit(inst, w, d) {
    return inst.ready.then(() => {
        const m = inst.model;
        if (!m) return;
        const s = c1mBox(m).getSize(new THREE.Vector3());
        m.scale.multiplyScalar(Math.min(w / s.x, d / s.z));
        return c1mCentre(inst, 0, 0, 0);
    });
}
// A steady 0..1 for a spot, so rebuilds pick the same model
function c1cPick(x, y, z, s) {
    const v = Math.sin(x * 12.9898 + z * 78.233 + y * 3.1 + s * 37.719) * 43758.5453;
    return v - Math.floor(v);
}
// Packs that came with only a normal map (no colour): a weathered pine
function c1cTint(inst, col) {
    inst.ready.then(() => inst.model && inst.model.traverse(o => {
        if (!o.isMesh) return;
        o.material = [].concat(o.material).map(mt => { const c = mt.clone(); c.color.setHex(col); c.metalness = 0; c.roughness = 0.9; return c; }).reduce((a, c, i, arr) => arr.length === 1 ? c : arr, null);
    }));
    return inst;
}

(function () {
    // ---- single crates ----
    // Callers stack things on crates at y + s * 0.8, so each crate fills
    // exactly s × 0.8s × s whatever it looks like
    const _subCrate = subCrate;
    subCrate = function (g, M, x, y, z, s, ry) {
        if (c1cPick(x, y, z, s) > 0.62) return _subCrate(g, M, x, y, z, s, ry);   // the old stencilled box stays in the mix
        const c = modelSpawn('m_crate_box', { scale: 1 });
        c.group.position.set(x, y, z);
        c.group.rotation.y = (ry || 0) + (c1cPick(z, x, s, y) > 0.5 ? Math.PI / 2 : 0);
        g.add(c.group);
        c1cFill(c, s, s * 0.8, s);
        return c.group;
    };

    // ---- stacks of crates ----
    for (const key of ['crates', 'sorted crates']) {
        const _b = CH1_LABEL_BUILDERS[key];
        CH1_LABEL_BUILDERS[key] = function (o, M, rng) {
            const p = c1cPick(o.x, 1, o.y, o.w);
            if (p < 0.34) {                                   // shipping crates, strapped
                const g = new THREE.Group();
                const c = modelSpawn('m_crate_stack', { scale: 1 });
                c.group.rotation.y = (rng() - 0.5) * 0.6;
                g.add(c.group);
                c1cFit(c, o.w * 0.95, o.h * 0.95);
                g.userData.h = Math.min(o.w, o.h) * 0.8 + 18;
                return g;
            }
            if (p < 0.6) {                                    // a pile of crates, one fallen
                const g = new THREE.Group();
                const c = modelSpawn('m_crate_pile', { scale: 1 });
                c.group.rotation.y = rng() * Math.PI * 2;
                g.add(c.group);
                c1cFit(c, o.w * 0.9, o.h * 0.9);
                g.userData.h = Math.min(o.w, o.h) * 0.75 + 18;
                return g;
            }
            return _b(o, M, rng);                             // mixed singles
        };
    }

    // ---- drums ----
    // Same frame as before: centred at r * 1.35 upright (or lying on its
    // side at r), about 2r across and 2.7r tall
    const _subDrum = subDrum;
    subDrum = function (g, mat, M, x, z, r, tipped) {
        let name;
        if (mat === M.paintBlue) name = 'm_drum_blue';
        else if (mat === M.paintRed) name = c1cPick(x, r, z, 1) < 0.7 ? 'm_drum_red' : 'm_drum_black';
        else if (mat === M.rust || mat === M.metalDark || mat === M.dark) name = 'm_drum_black';
        if (!name) return _subDrum(g, mat, M, x, z, r, tipped);
        const d = new THREE.Group();
        const m = modelSpawn(name, { scale: 1 });
        d.add(m.group);
        c1cFill(m, r * 2, r * 2.7, r * 2).then(() => { if (m.model) m.model.position.y -= r * 1.35; });
        m.group.rotation.y = c1cPick(z, x, r, 2) * Math.PI * 2;   // labels face every which way
        if (tipped) { d.rotation.z = Math.PI / 2; d.position.set(x, r, z); d.rotation.y = tipped; }
        else d.position.set(x, r * 1.35, z);
        g.add(d);
        return d;
    };

    // ---- new set dressing ----
    const objs = mapObjects[1];
    const obj = (id, label, x, z, w, h) => objs.push({ id, x: x - w / 2, y: z - h / 2, w, h, color: '#888', label, interactScene: null, decorative: true, zone: 'open' });

    // vegetable crates at both ends of the camp kitchen table
    for (const [id, x, z] of [['c1c_veg1', 2325, 4625], ['c1c_veg2', 1865, 4625]]) {
        obj(id, 'Vegetable Crates', x, z, 70, 50);
        CH1_BUILDERS[id] = function (o, M, rng) {
            const g = new THREE.Group();
            const veg = [[0xb0301e, 3.4], [0xd08a2a, 3], [0x5a7a2a, 3.6], [0x8a5a9a, 3.2]];   // tomatoes, onions, cucumbers, aubergines
            const spots = [[-16, 0, -6, 0.1], [18, 0, 4, -0.2], [0, 14, -2, 0.3]];
            spots.forEach(([cx, cy, cz, ry], i) => {
                const c = modelSpawn('m_crate_slat', { scale: 1 });
                c.group.position.set(cx, cy, cz);
                c.group.rotation.y = ry;
                g.add(c.group);
                c1cFill(c, 32, 14, 22);
                const [col, rad] = veg[(i + (id === 'c1c_veg2' ? 2 : 0)) % veg.length];
                const vm = new THREE.MeshStandardMaterial({ color: col, roughness: 0.55 });
                const geo = new THREE.SphereGeometry(rad, 8, 6);
                for (let k = 0; k < 9; k++) {
                    const v = put(g, geo, vm, cx + (rng() - 0.5) * 22, cy + 11 + rng() * 2, cz + (rng() - 0.5) * 13);
                    v.scale.set(1, 0.85, col === 0x5a7a2a ? 2.2 : 1);
                    v.rotation.y = rng() * 3;
                }
            });
            g.userData.h = 36;
            return g;
        };
    }

    // a wooden water barrel with a dipper in the mess tent
    const _mess = CH1_BUILDERS.c1m_mess;
    CH1_BUILDERS.c1m_mess = function (o, M) {
        const g = _mess(o, M);
        const b = modelSpawn('m_barrel_wood', { scale: 1 });
        b.group.position.set(100, 0, -50);
        g.add(b.group);
        c1cFill(b, 20, 27, 20);
        put(g, gCyl(4, 3, 3, 10), M.steel, 100, 28, -50);                      // the dipper, on the lid
        put(g, gBox(10, 1, 1.4), M.woodDark, 106, 28.5, -50);
        return g;
    };

    // army crates by the old Ministry post (antiquities police stores, long forgotten)
    obj('c1c_milcrates', 'Army Crates', 8872, 5190, 70, 50);
    CH1_BUILDERS.c1c_milcrates = function (o, M) {
        const g = new THREE.Group();
        const c = modelSpawn('m_mil_crates', { scale: 1 });
        c.group.rotation.y = -0.4;
        g.add(c.group);
        c1cFit(c, 60, 44).then(() => c.model && c.model.traverse(q => {
            // the pack marked its paint as see-through; only the stencils should blend
            if (!q.isMesh) return;
            for (const mt of [].concat(q.material)) if (mt.name === 'material') { mt.transparent = false; mt.opacity = 1; mt.depthWrite = true; }
        }));
        g.userData.h = 40;
        return g;
    };

    builtSignature = null;
})();
