// ============================================================
// CHAPTER 1-A — DOWNLOADED MODELS IN THE CAMP (ch1a_models.js)
// The player's model finds (prepared with tools/prepare_model.js),
// put where they belong:
//   - a real dartboard on the worker camp's board (scoring unchanged)
//   - the Philips transistor radio: the camp radio, and Farouk's at his booth
//   - the Codex itself: turns in the light while you unwrap it
//   - a military marquee: the expedition's mess tent, open to the south
//   - a round canvas tent: Hana's, beside the director's camp
//   - a camping set (stove, gas bottle, cooler, mugs, mat): Miriam's
//     outdoor kitchen by her tent. It arrived all white, so every piece
//     gets its own colour here
//   - an ancient pottery strainer: a fourth find on Hana's table
// Loaded after ch1a_finds.js and the models/m_*.js packs.
// ============================================================

// A model's bounding box in its spawn group's own space (the group may
// already be placed in the world by the time the model has parsed)
function c1mBox(m) {
    const par = m.parent;
    par.updateWorldMatrix(true, false);
    m.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(m).applyMatrix4(par.matrixWorld.clone().invert());
}

// Slide a spawned model so its footprint is centred on (cx, cz) of its
// group, with its base at y. Runs once the model has parsed.
function c1mCentre(inst, cx, cz, y) {
    return inst.ready.then(() => {
        const m = inst.model;
        if (!m) return;
        const box = c1mBox(m);
        m.position.x += cx - (box.min.x + box.max.x) / 2;
        m.position.z += cz - (box.min.z + box.max.z) / 2;
        if (y != null) m.position.y += y - box.min.y;
        return box;
    });
}

(function () {
    const objs = mapObjects[1], walls = mapWalls[1];
    const obj = (id, label, x, z, w, h, scene, extra) => objs.push(Object.assign({ id, x: x - w / 2, y: z - h / 2, w, h, color: '#888', label, interactScene: scene || null, decorative: !scene, zone: 'open' }, extra || {}));
    const solid = (x, z, w, h) => walls.push({ x: x - w / 2, y: z - h / 2, w, h, kind: 'yardang' });

    // ---- the dartboard: the real board over the old painted one ----
    // The game scores by ring (radius 15 = the double ring's outer edge), so
    // the model is sized to put its double ring there: on a real board that
    // ring is 170 mm out of a 225 mm radius.
    const _darts = CH1_BUILDERS.camp_darts;
    CH1_BUILDERS.camp_darts = function (o, M, rng) {
        const g = _darts(o, M, rng);
        const D = window.ch1Darts;
        const bd = modelSpawn('m_dartboard', { scale: 1 });
        bd.ready.then(() => {
            if (!bd.model) return;
            const box = c1mBox(bd.model);
            const k = 15 / ((box.max.x - box.min.x) / 2 * 170 / 225);
            bd.model.scale.multiplyScalar(k);
            const b2 = c1mBox(bd.model);
            bd.model.position.x -= (b2.min.x + b2.max.x) / 2;
            bd.model.position.y -= (b2.min.y + b2.max.y) / 2;
            bd.model.position.z += D.center.z - b2.max.z;          // its face where the darts stick
            D.board.visible = false;
        });
        bd.group.position.set(D.center.x, D.center.y, 0);
        g.add(bd.group);
        return g;
    };

    // ---- the radio (a Philips portable, battered) ----
    const radioOn = (g, M, x, y, z, ry, glow) => {
        const r = modelSpawn('m_radio', { scale: 16 / 0.24 });   // about twice life size, so it reads from the path
        r.group.position.set(x, y, z);
        r.group.rotation.y = ry || 0;
        g.add(r.group);
        c1mCentre(r, 0, 0, 0);
        if (glow) g.add(ch1GlowSprite(x + 3, y + 7, z + 5, 9, 0xffb050, 0.35));
        return r;
    };
    CH1_BUILDERS.camp_radio = function (o, M) {
        const g = new THREE.Group();
        subCrate(g, M, 0, 0, 0, 28, 0.1);
        radioOn(g, M, 0, 22.4, 1, 0.1, true);
        put(g, gCyl(0.35, 0.35, 16, 4), M.steel, 7, 38, -2, 0, 0.5);    // the aerial, half pulled out
        g.userData.h = 50;
        return g;
    };
    // Farouk's, on an upturned crate beside him
    obj('c1m_farouk_radio', "Farouk's Radio", 9192, 5350, 30, 24, 'c1m_farouk_radio');
    CH1_BUILDERS.c1m_farouk_radio = function (o, M) {
        const g = new THREE.Group();
        subCrate(g, M, 0, 0, 0, 22, -0.2);
        radioOn(g, M, 0, 17.6, 0, -0.5, false);
        put(g, gCyl(2.4, 2.4, 11, 10), M.steel, 9, 23, 4);            // his thermos
        g.userData.h = 40;
        return g;
    };

    // ---- the mess tent (military marquee) ----
    const MX = 5280, MZ = 4545, MW = 400, MD = 290;
    obj('c1m_mess', 'Mess Tent', MX, MZ, MW, MD, null, { decorative: true });
    obj('c1m_mess_in', 'Mess Tent (Look)', MX, MZ + 40, 120, 40, 'c1m_mess');
    solid(MX, MZ - MD * 0.36, MW * 0.8, 16);                           // back wall
    solid(MX - MW * 0.4, MZ, 16, MD * 0.72);                           // ends
    solid(MX + MW * 0.4, MZ, 16, MD * 0.72);
    CH1_BUILDERS.c1m_mess_in = () => { const g = new THREE.Group(); g.userData.h = 40; return g; };   // the look-in point: the tent is the mesh
    CH1_BUILDERS.c1m_mess = function (o, M) {
        const g = new THREE.Group();
        const t = modelSpawn('m_tent_military', { scale: MW / 2 });
        t.group.rotation.y = Math.PI;                                   // open side to the south, toward the camp
        g.add(t.group);
        c1mCentre(t, 0, 0, -3);
        // a long trestle table and benches, a water urn, a crate of bread
        put(g, gBox(200, 3, 34), M.wood, 0, 28, -10);
        for (const x of [-80, 80]) for (const z of [-24, 4]) put(g, gBox(4, 27, 4), M.woodDark, x, 13.5, z - 10);
        for (const z of [-40, 20]) {
            put(g, gBox(190, 3, 12), M.woodDark, 0, 17, z);
            for (const x of [-80, 80]) put(g, gBox(3, 16, 8), M.woodDark, x, 8, z);
        }
        put(g, gCyl(8, 8, 20, 12), M.steel, 90, 40, -10);
        put(g, gCyl(1, 1, 5, 6), M.brass || M.steel, 90, 34, -1, 0, 0, Math.PI / 2);
        subCrate(g, M, -120, 0, -40, 26, 0.3);
        ch1Lamp(g, 0, 92, -10, { color: 0xffd6a0, intensity: 0.8, dist: 260, glow: 26 });
        g.userData.h = 150;
        return g;
    };

    // ---- Hana's tent (round canvas, with an awning) ----
    const HX = 5650, HZ = 4570;
    obj('c1m_hanatent', "Hana's Tent", HX, HZ, 220, 220, 'c1m_hanatent');
    solid(HX, HZ, 150, 150);
    CH1_BUILDERS.c1m_hanatent = function (o, M) {
        const g = new THREE.Group();
        const t = modelSpawn('m_tent_round', { scale: 240 / 53.9 });
        t.group.rotation.y = Math.PI * 0.9;
        g.add(t.group);
        c1mCentre(t, 0, 0, -2);
        g.userData.h = 80;
        return g;
    };

    // ---- Miriam's outdoor kitchen (the camping set) ----
    const KX = 5175, KZ = 4875;
    obj('c1m_kitchen', "Miriam's Camp Kitchen", KX, KZ, 150, 110, 'c1m_kitchen');
    solid(KX, KZ, 110, 60);
    // the set came untextured: a colour (and a finish) per piece
    const KIT = {
        Object_2: [0x2a2a2a, 0.3], Object_3: [0x2a2a2a, 0.3],
        Object_5: [0x80858a, 0.6], Object_6: [0x80858a, 0.6], Object_10: [0x80858a, 0.6], Object_8: [0x9a9ea2, 0.6],   // stove legs, frame
        Object_25: [0x2f4a36, 0.2], Object_7: [0x161616, 0.4], Object_26: [0x1c1c1c, 0.5],                              // green enamel stove, black grates and burners
        Object_9: [0xa8adb2, 0.7], Object_22: [0x6b6446, 0],                                                              // folding table: aluminium, canvas
        Object_11: [0x2456a0, 0.25], Object_12: [0x3d4230, 0],                                                            // gas bottle, hose and water bag
        Object_13: [0x2a2a2a, 0.2], Object_15: [0x2a2a2a, 0.2], Object_16: [0xb08a3a, 0.7], Object_17: [0xb08a3a, 0.7],
        Object_18: [0xe8e4d8, 0.1], Object_19: [0xe8e4d8, 0.1], Object_20: [0x2c4a8a, 0.1],                             // enamel mugs, blue rims
        Object_21: [0x333333, 0.1], Object_23: [0x6b4a2a, 0], Object_24: [0xb0b4b8, 0.8],
        Object_27: [0xa8322a, 0.05], Object_28: [0xe0dccf, 0.05],                                                        // the cooler: red body, white lid
    };
    let kilim = null;
    const kilimMat = () => kilim || (kilim = new THREE.MeshStandardMaterial({ roughness: 1, map: makeTex('c1kilim', 256, 256, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#8a2e22'; cc.fillRect(0, 0, w, h);
        const band = ['#2a3a5a', '#d8c08a', '#1e1a16', '#c46a2a'];
        for (let y = 0; y < h; y += 32) { cc.fillStyle = band[(y / 32) % 4]; cc.fillRect(0, y + 10, w, 8); }
        cc.fillStyle = '#e8d8b0';
        for (let y = 16; y < h; y += 64) for (let x = 16; x < w; x += 48) { cc.beginPath(); cc.moveTo(x, y - 10); cc.lineTo(x + 10, y); cc.lineTo(x, y + 10); cc.lineTo(x - 10, y); cc.fill(); }
        speckle(cc, w, h, null, ['#5a1a14', '#b0503a'], 900, 0.8, 2, 0.2, 0.5);
    }) }));
    CH1_BUILDERS.c1m_kitchen = function (o, M) {
        const g = new THREE.Group();
        const k = modelSpawn('m_campset', { scale: 7.2 });
        k.group.rotation.y = 0.35;
        g.add(k.group);
        c1mCentre(k, 0, 0, 0).then(() => {
            k.model.traverse(m => {
                if (!m.isMesh) return;
                if (m.name === 'Object_14') { m.material = kilimMat(); return; }
                const [col, metal] = KIT[m.name] || [0x777066, 0.2];
                m.material = new THREE.MeshStandardMaterial({ color: col, metalness: metal, roughness: metal > 0.5 ? 0.45 : 0.7 });
            });
        });
        g.userData.h = 40;
        return g;
    };

    // ---- dig tools: a rack by the dig shed, and a kit at the east trench ----
    // Spawn a model at scale 1, then size it so its longest side is `len`,
    // footprint centred, resting on y = 0 of its group
    const fit = (g, name, len, x, y, z, ry, rx, rz) => {
        const t = modelSpawn(name, { scale: 1 });
        const h = new THREE.Group();                   // tilt holder: the model leans from its foot
        h.position.set(x, y, z);
        h.rotation.set(rx || 0, ry || 0, rz || 0, 'YXZ');
        h.add(t.group);
        g.add(h);
        t.ready.then(() => {
            if (!t.model) return;
            const b = c1mBox(t.model), s = b.getSize(new THREE.Vector3());
            t.model.scale.multiplyScalar(len / Math.max(s.x, s.y, s.z));
            c1mCentre(t, 0, 0, 0);
        });
        return t;
    };
    obj('c1m_toolrack', 'Tool Rack', 5178, 2218, 140, 60, 'c1m_toolrack');
    solid(5178, 2210, 120, 20);
    CH1_BUILDERS.c1m_toolrack = function (o, M) {
        const g = new THREE.Group();
        // a timber rack: two posts, a rail at shoulder height, a board to stop the blades
        for (const x of [-60, 60]) put(g, gBox(5, 56, 5), M.woodDark, x, 28, -12);
        put(g, gBox(130, 4, 4), M.wood, 0, 50, -12);
        put(g, gBox(130, 8, 2), M.planksDark, 0, 5, -8);
        // shovels, picks and the broom leaning on the rail, feet on the sand
        fit(g, 'm_shovel', 36, -48, 0, 0, 0.1, -0.24);
        fit(g, 'm_shovel', 36, -32, 0, 1, -0.2, -0.24);
        fit(g, 'm_pickaxe', 30, -8, 0, 0, 1.4, -0.28);
        fit(g, 'm_broom', 46, 14, 0, 2, 0.3, -0.18);
        fit(g, 'm_pickaxe', 30, 34, 0, 0, 1.9, -0.28);
        // the hoe and an old pick lying on a crate; a folding army spade beside it
        subCrate(g, M, 58, 0, 18, 24, 0.2);
        fit(g, 'm_pickaxe_old', 28, 58, 19.2, 18, 0.4);
        fit(g, 'm_hoe', 34, -30, 0, 26, 1.2, -Math.PI / 2);
        fit(g, 'm_shovel_fold', 20, 30, 0, 30, -0.6);
        fit(g, 'm_bucket', 10, -60, 0, 20, 0);
        fit(g, 'm_bucket', 10, -48, 0, 28, 0.7);
        g.userData.h = 60;
        return g;
    };
    obj('c1m_trenchkit', 'Wheelbarrow', 8270, 3011, 120, 90, null);
    CH1_BUILDERS.c1m_trenchkit = function (o, M) {
        const g = new THREE.Group();
        fit(g, 'm_wheelbarrow', 48, 0, 0, 0, 0.6);
        fit(g, 'm_shovel', 36, 30, 0, -20, 2.4, -0.1, 0.05);
        fit(g, 'm_bucket', 10, -34, 0, 18, 0.3);
        fit(g, 'm_bucket', 10, -24, 0, 30, 1.1);
        fit(g, 'm_pickaxe', 30, 22, 2, 34, 2.1, -Math.PI / 2);    // dropped flat on the sand
        g.userData.h = 40;
        return g;
    };

    // ---- the pottery strainer on Hana's table ----
    const _finds = CH1_BUILDERS.c1a_finds;
    CH1_BUILDERS.c1a_finds = function (o, M) {
        const g = _finds(o, M);
        const tbl = objs.find(q => q.id === 'd_equiptbl');
        const s = modelSpawn('find_strainer', { scale: 12 / 0.16, matte: true });
        s.group.position.set(tbl.x + tbl.w / 2 + 70 - (o.x + o.w / 2), 32.5, tbl.y + tbl.h / 2 - 4 - (o.y + o.h / 2));
        g.add(s.group);
        return g;
    };

    const fs = storyData.c1a_finds, fsText = fs.text;
    fs.text = () => (typeof fsText === 'function' ? fsText() : fsText).replace('names of the men who were owed it.',
        'names of the men who were owed it.\n• A little pottery bowl pierced with holes, like a colander: a strainer. The workers\' town below the pyramids brewed its own beer, and this is what the mash went through.');

    // ---- the Codex, turning in the lamplight while you unwrap it ----
    const V = { el: null, R: null, scene: null, cam: null, book: null, raf: 0 };
    function codexShow() {
        if (!V.el) {
            V.el = document.createElement('canvas');
            V.el.id = 'codex-view';
            V.el.width = 360; V.el.height = 260;
            document.getElementById('game-container').appendChild(V.el);
            V.R = new THREE.WebGLRenderer({ canvas: V.el, alpha: true, antialias: true });
            V.R.outputEncoding = THREE.sRGBEncoding;
            V.R.toneMapping = THREE.ACESFilmicToneMapping;
            V.scene = new THREE.Scene();
            V.scene.add(new THREE.HemisphereLight(0xfff0d8, 0x302418, 0.9));
            const key = new THREE.DirectionalLight(0xffd8a0, 1.6); key.position.set(1, 2, 1.5); V.scene.add(key);
            V.cam = new THREE.PerspectiveCamera(32, 360 / 260, 0.01, 10);
            V.cam.position.set(0, 0.2, 0.75); V.cam.lookAt(0, 0, 0);
            modelLoad('m_codex').then(gl => {
                const b = THREE.SkeletonUtils.clone(gl.scene);
                const box = new THREE.Box3().setFromObject(b), c = box.getCenter(new THREE.Vector3());
                b.position.sub(c);
                V.book = new THREE.Group(); V.book.add(b); V.scene.add(V.book);
            }).catch(() => {});
        }
        V.el.style.display = 'block';
        cancelAnimationFrame(V.raf);
        const t0 = performance.now();
        const tick = () => {
            const t = (performance.now() - t0) / 1000;
            if (V.book) { V.book.rotation.y = -0.6 + t * 0.35; V.book.rotation.x = 0.25 + Math.sin(t * 0.7) * 0.05; }
            V.R.render(V.scene, V.cam);
            V.raf = requestAnimationFrame(tick);
        };
        tick();
    }
    function codexHide() {
        if (!V.el) return;
        V.el.style.display = 'none';
        cancelAnimationFrame(V.raf);
    }
    const _start = startDialogue;
    startDialogue = function (id) {
        _start.apply(this, arguments);
        if (id === 'c1a_codex') codexShow(); else codexHide();
    };
    const _close = closeDialogue;
    closeDialogue = function () { codexHide(); return _close.apply(this, arguments); };

    builtSignature = null;
})();

// ---- what you see when you look ----
scene('c1m_farouk_radio', {
    speaker: 'System',
    text: `Farouk's radio: a Philips portable older than you are, its grille worn shiny where his thumb rests, the aerial mended with a biro tube. Quran recitation from Cairo, very low, all night long. Beside it a thermos, and a glass with a finger of tea gone cold.`,
    choices: [{ text: 'Leave it playing.', onSelect: end }],
});
scene('c1m_mess', {
    speaker: 'System',
    text: () => `The mess tent: an old army marquee, faded to the colour of the desert, open on the camp side. A long trestle table, two benches, a steel urn for tea water, a crate of bread under a cloth against the flies.\n\n` +
        (S().clock % 1440 < 360 ? `At this hour it's empty. A lamp hangs from the ridge pole, turned down low, and the canvas breathes in and out with the wind.` : `Somebody has left a newspaper weighted down with a glass.`),
    choices: [{ text: 'Step back out.', onSelect: end }],
});
scene('c1m_hanatent', {
    speaker: 'System',
    text: () => `Hana's tent: round, old, patched in three different canvases, with an awning propped on two poles to make a porch. A pair of dusty boots stands outside the flap, neatly side by side.` +
        (sflag('met_hana') ? `\n\nYou don't go in. Hana would know.` : ''),
    choices: [{ text: 'Leave it be.', onSelect: end }],
});
scene('c1m_kitchen', {
    speaker: 'System',
    text: `Miriam's outdoor kitchen, on a kilim spread over the sand beside her tent: a two-burner camping stove on its stand, a blue gas bottle, a red cooler, a folding table. Two enamel mugs, washed and turned upside down against the sand.\n\nEverything in its place. She cooked out here rather than eat in the mess tent: the only quiet hour of her day.`,
    choices: [{ text: 'Leave it as she left it.', onSelect: end }],
});
scene('c1m_toolrack', {
    speaker: 'System',
    text: `The tool rack: shovels and picks leaning on a rail, each handle burned with a number so nobody can say it was never issued. A broom for the trench floors, a hoe for scraping back, a folding army spade somebody's cousin sold the Rais, rubber buckets for the spoil.\n\nThe edges are sharpened. Somebody takes care of these.`,
    choices: [{ text: 'Leave them in their places.', onSelect: end }],
});
