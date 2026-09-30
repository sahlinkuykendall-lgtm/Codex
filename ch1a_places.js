// ============================================================
// CHAPTER 1-A — MORE OF THE PLATEAU (ch1a_places.js)
// The layout audit found wide stretches of the map with nothing in them.
// Each gets a place worth the walk, all real Giza history:
//   - THE WORKERS' CEMETERY: the pyramid builders' own tombs (found 1990),
//     and Petety's real curse
//   - THE SHEIKH'S TOMB: a whitewashed village saint's shrine, and an old
//     woman with a lamp who keeps it at night
//   - THE WATCHTOWER: an old antiquities-police tower; climb it and the
//     whole plateau is yours (every place marked)
//   - THE BUILDERS' RAMP: a rubble-and-mud-brick construction ramp
//   - THE OLD QUARRY: the knob field gets its name (and its mason's marks)
//   - THE FOSSIL PAVEMENT: nummulites — Herodotus's "lentils" of the
//     pyramid builders — five to find
// Loaded after ch1a_extras.js.
// ============================================================
(function () {
    const objs = mapObjects[1], walls = mapWalls[1];
    const obj = (id, label, x, z, w, h, scene, extra) => objs.push(Object.assign({ id, x: x - w / 2, y: z - h / 2, w, h, color: '#888', label, interactScene: scene || null, decorative: !scene, zone: 'open' }, extra || {}));
    const solid = (x, z, w, h) => walls.push({ x: x - w / 2, y: z - h / 2, w, h, kind: 'yardang' });   // invisible collision (the model shows it)
    const place = (id, name, at, r) => OW.places.push({ id, name, at, r });

    // ---- the workers' cemetery ----
    place('cemetery', "THE WORKERS' CEMETERY", [2750, 6150], 480);
    obj('c1p_cemetery', 'Tomb Chapels', 2750, 6150, 420, 300, null);
    obj('c1p_falsedoor', 'A False Door', 2700, 6050, 50, 40, 'c1p_falsedoor');
    obj('c1p_looterpit', "Looters' Pit", 2900, 6260, 60, 50, 'c1p_looterpit');
    for (const [x, z, w, h] of [[2600, 6060, 70, 50], [2720, 6010, 90, 60], [2860, 6070, 60, 60], [2640, 6220, 60, 50], [2800, 6200, 70, 50]]) solid(x, z, w * 0.85, h * 0.85);

    // ---- the sheikh's tomb ----
    place('sheikh', "THE SHEIKH'S TOMB", [6450, 6650], 420);
    obj('c1p_maqam', 'Sheikh\'s Tomb', 6450, 6620, 110, 110, 'c1p_maqam');
    obj('c1p_oldwoman', 'An Old Woman with a Lamp', 6430, 6720, 44, 44, 'c1p_oldwoman');
    solid(6450, 6620, 100, 100);

    // ---- the watchtower ----
    place('tower', 'THE WATCHTOWER', [9780, 3900], 380);
    obj('c1p_tower', 'Watchtower (Climb)', 9780, 3900, 80, 80, 'c1p_tower');
    solid(9780, 3900, 60, 60);

    // ---- the builders' ramp ----
    place('ramp', "THE BUILDERS' RAMP", [3150, 1700], 440);
    obj('c1p_ramp', "Builders' Ramp", 3150, 1700, 520, 110, 'c1p_ramp');

    // ---- the old quarry (names the knob field) ----
    place('quarry', 'THE OLD QUARRY', [4350, 3900], 620);

    // ---- the fossil pavement ----
    place('fossils', 'THE FOSSIL PAVEMENT', [8350, 7300], 420);
    obj('c1p_pavement', 'Fossil Pavement', 8350, 7300, 360, 240, null);
    [[8240, 7220], [8420, 7180], [8500, 7340], [8300, 7400], [8180, 7340]].forEach(([x, z], i) =>
        obj('c1p_fossil' + i, 'Fossil', x, z, 34, 34, 'c1p_fossil' + i, { owFlag: 'c1p_fossil' + i }));
})();

// ============================================================
// BUILDERS
// ============================================================
function c1pMud() {
    const M = ch1Mats();
    return M.mudbrick || (M.mudbrick = new THREE.MeshStandardMaterial({ map: makeTex('c1mudbrick', 128, 128, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#9a7a56'; cc.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { cc.strokeStyle = 'rgba(60,44,30,0.5)'; cc.lineWidth = 1.5; cc.strokeRect(x + 1, y + 1, 30, 14); }
        speckle(cc, w, h, null, ['#7a5a3a', '#b89a74', '#5a4430'], 700, 0.8, 2.5);
    }), roughness: 1 }));
}
Object.assign(CH1_BUILDERS, {
    c1p_cemetery(o, M, rng) {
        // little tomb chapels of mud brick and rubble, with vaulted roofs, half drifted in
        const g = new THREE.Group();
        const mud = c1pMud();
        const cx = o.x + o.w / 2, cz = o.y + o.h / 2;
        for (const [x, z, w, h] of [[2600, 6060, 70, 50], [2720, 6010, 90, 60], [2860, 6070, 60, 60], [2640, 6220, 60, 50], [2800, 6200, 70, 50]]) {
            const t = new THREE.Group();
            t.position.set(x - cx, 0, z - cz);
            const ht = 26 + rng() * 14;
            put(t, gBox(w, ht, h), mud, 0, ht / 2 - 4, 0);
            const vault = put(t, new THREE.CylinderGeometry(h / 2, h / 2, w * 0.92, 12, 1, false, 0, Math.PI), mud, 0, ht - 4, 0);
            vault.rotation.set(0, 0, Math.PI / 2); vault.rotation.x = Math.PI / 2; vault.rotation.z = Math.PI / 2;
            put(t, gBox(12, 18, 2), M.dark, 0, 9, h / 2 + 0.5);                 // doorway
            const drift = put(t, new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), M.sand, (rng() - 0.5) * w * 0.6, -3, -h * 0.4);
            drift.scale.set(w * 0.6, ht * 0.7, h * 0.7);
            t.rotation.y = (rng() - 0.5) * 0.2;
            g.add(t);
        }
        // grave cairns between them
        for (let i = 0; i < 14; i++) ch1AddRock(g, (rng() - 0.5) * o.w, 0, (rng() - 0.5) * o.h, 4 + rng() * 6, rng, M.rockDark);
        g.userData.h = 0;
        return g;
    },
    c1p_falsedoor(o, M) {
        // a limestone false door stela, the dead man's door to the offerings
        const g = new THREE.Group();
        const tex = makeTex('c1falsedoor', 128, 256, 1, 1, (cc, w, h) => {
            cc.fillStyle = '#d6c6a2'; cc.fillRect(0, 0, w, h);
            cc.strokeStyle = '#7a6448'; cc.lineWidth = 3;
            cc.strokeRect(10, 10, w - 20, h - 20); cc.strokeRect(28, 50, w - 56, h - 60); cc.strokeRect(46, 90, w - 92, h - 100);
            cc.fillStyle = '#5a4630'; cc.font = '20px serif';
            const glyphs = '𓊹𓏏𓊵𓐍𓂋𓈖𓆑𓀀';
            for (let i = 0; i < 6; i++) cc.fillText(glyphs[i % glyphs.length] || '|', 14, 44 + i * 30);
            for (let i = 0; i < 6; i++) cc.fillText(glyphs[(i + 3) % glyphs.length] || '|', w - 32, 44 + i * 30);
            speckle(cc, w, h, null, ['#9a8a6a', '#efe2c4'], 400, 0.8, 2);
        });
        put(g, gBox(34, 52, 6), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), 0, 26, 0);
        g.userData.h = 60;
        return g;
    },
    c1p_looterpit(o, M, rng) {
        const g = new THREE.Group();
        const pit = put(g, new THREE.CircleGeometry(22, 14), M.dark, 0, 0.6, 0); pit.rotation.x = -Math.PI / 2;
        for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; ch1AddRock(g, Math.cos(a) * 26, 0, Math.sin(a) * 26, 5 + rng() * 4, rng, M.sand); }
        put(g, gCyl(1, 1, 30, 5), M.woodDark, 18, 12, -4, 0, 0.9);           // an abandoned shovel handle
        g.userData.h = 30;
        return g;
    },
    c1p_maqam(o, M, rng) {
        // a village saint's tomb: whitewashed cube, a dome, a green door, rag flags on a pole
        const g = new THREE.Group();
        const lime = new THREE.MeshStandardMaterial({ color: 0xf0ebe0, roughness: 0.95 });
        put(g, gBox(90, 60, 90), lime, 0, 30, 0);
        put(g, gBox(76, 12, 76), lime, 0, 66, 0);
        put(g, new THREE.SphereGeometry(34, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), lime, 0, 72, 0);
        put(g, new THREE.ConeGeometry(3, 14, 6), M.metal, 0, 112, 0);                       // finial
        put(g, new THREE.SphereGeometry(3, 8, 6), M.brass || M.metal, 0, 121, 0);
        put(g, gBox(22, 40, 2), new THREE.MeshStandardMaterial({ color: 0x2a6a4a, roughness: 0.8 }), 0, 20, 46);   // green door
        for (const s of [-1, 1]) put(g, gBox(10, 10, 2), M.dark, s * 30, 40, 46);                                   // little windows
        put(g, gCyl(1.2, 1.4, 90, 5), M.woodDark, 58, 45, 30);
        for (let i = 0; i < 4; i++) { const f = put(g, gBox(16, 8, 0.6), new THREE.MeshStandardMaterial({ color: [0x2a8a4a, 0xd8c040, 0xc84030, 0xe8e0d0][i], side: THREE.DoubleSide }), 66, 84 - i * 9, 30); ch1FX.sway.push({ obj: f, axis: 'y', base: 0, amp: 0.4, speed: 1.3 + i * 0.2, phase: i }); }
        // a lamp in a niche by the door, and candle stubs
        ch1Lamp(g, 30, 16, 48, { intensity: 0.9, dist: 300, glow: 26, color: 0xffb060 });
        for (let i = 0; i < 6; i++) put(g, gCyl(0.8, 0.8, 3 + rng() * 4, 6), new THREE.MeshStandardMaterial({ color: 0xf0e8d0 }), -30 + i * 4, 2, 50);
        g.userData.h = 128;
        return g;
    },
    c1p_tower(o, M, rng) {
        // an old antiquities-police lookout: four steel legs, cross-braced, a hut on top, a ladder
        const g = new THREE.Group();
        const H = 150, top = 42;
        for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) subBeam(g, M.metalDark, new THREE.Vector3(x * 34, 0, z * 34), new THREE.Vector3(x * 20, H, z * 20), 1.6, 5);
        for (let y = 20; y < H; y += 32) {
            const k = 34 - (y / H) * 14;
            for (const [a, b] of [[[-1, -1], [1, 1]], [[1, -1], [-1, 1]]]) subBeam(g, M.metalDark, new THREE.Vector3(a[0] * k, y, a[1] * k), new THREE.Vector3(b[0] * k, y + 30, b[1] * k), 0.6, 4);
        }
        put(g, gBox(56, 3, 56), M.planksDark || M.woodDark, 0, H, 0);
        const hut = new THREE.Group(); hut.position.y = H;
        for (const [x, z, w, d] of [[0, -26, 52, 2], [-26, 0, 2, 52], [26, 0, 2, 52]]) put(hut, gBox(w, 22, d), M.corrugated, x, 11, z);
        put(hut, gBox(58, 2, 58), M.corrugated, 0, 34, 0).rotation.z = 0.05;
        for (const [x, z] of [[-26, 26], [26, 26]]) put(hut, gBox(2, 34, 2), M.metalDark, x, 17, z);
        g.add(hut);
        for (let y = 4; y < H; y += 8) put(g, gBox(14, 1.2, 1.2), M.metal, 0, y, 37);              // ladder rungs
        for (const s of [-1, 1]) put(g, gBox(1.2, H, 1.2), M.metal, s * 7, H / 2, 37);
        ch1Lamp(g, 0, H + 30, 0, { color: 0xff5030, intensity: 0.4, dist: 200, glow: 20 });
        g.userData.h = H + 50;
        return g;
    },
    c1p_ramp(o, M, rng) {
        // a long ramp of rubble packed between mud-brick retaining walls, slumped to a low mound
        const g = new THREE.Group();
        const mud = c1pMud();
        const L = o.w, W = o.h * 0.6;
        const mound = put(g, new THREE.CylinderGeometry(W / 2, W / 2 + 12, L, 16, 1, false, 0, Math.PI), M.sand, 0, 0, 0);
        mound.rotation.set(0, 0, Math.PI / 2); mound.rotation.y = 0; mound.rotation.order = 'ZYX';
        mound.scale.set(0.35, 1, 1);
        for (const s of [-1, 1]) for (let i = 0; i < 9; i++) {
            if (rng() < 0.3) continue;
            const x = -L / 2 + 20 + i * (L - 40) / 8;
            put(g, gBox(L / 10, 8 + rng() * 10, 8), mud, x, 4, s * W / 2);
        }
        for (let i = 0; i < 20; i++) ch1AddRock(g, (rng() - 0.5) * L, 2, (rng() - 0.5) * W, 3 + rng() * 5, rng, M.limestone);
        g.userData.h = 30;
        return g;
    },
    c1p_pavement(o, M, rng) {
        // a bare shelf of bedrock the wind has scoured clean
        const g = new THREE.Group();
        const slab = put(g, new THREE.CircleGeometry(1, 20), new THREE.MeshStandardMaterial({ color: 0xcbb994, roughness: 1, map: ch1QuarryMats().rough.map }), 0, 1, 0);
        slab.rotation.x = -Math.PI / 2; slab.scale.set(o.w * 0.5, o.h * 0.5, 1); slab.userData.noCast = true;
        for (let i = 0; i < 10; i++) ch1AddRock(g, (rng() - 0.5) * o.w, 0, (rng() - 0.5) * o.h, 4 + rng() * 8, rng, ch1QuarryMats().rough);
        g.userData.h = 0;
        return g;
    },
});
for (let i = 0; i < 5; i++) CH1_BUILDERS['c1p_fossil' + i] = (o, M) => {
    const g = new THREE.Group();
    const coin = put(g, new THREE.CylinderGeometry(3.4, 3.4, 1.2, 14), new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.7 }), 0, 1.2, 0);
    coin.rotation.z = 0.3;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTex('c1glint', [[0, 'rgba(255,250,220,1)'], [0.2, 'rgba(255,220,150,0.5)'], [1, 'rgba(255,200,120,0)']]), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.7 }));
    s.scale.set(16, 16, 1); s.position.y = 4; g.add(s);
    g.userData.h = 20;
    return g;
};

// ============================================================
// SCENES
// ============================================================
scene('c1p_falsedoor', {
    speaker: 'System',
    text: () => `A false door: a limestone slab carved like a doorway that doesn't open — the door the dead come through to take their offerings. This cemetery belongs to the men who built the pyramids, buried in sight of them, with their tools and their bread. It was found in 1990, when a horse stumbled into a wall.\n\nThe columns name the owner: an overseer of the side of the pyramid.` +
        (skillLevel('hieroglyphs') >= 2 ? `\n\nAt the bottom, a curse — the real one, from Petety's tomb nearby: "All people who enter this tomb who will make evil against it and destroy it: may the crocodile be against them in the water, and snakes against them on land. May the hippopotamus be against them in the water, the scorpion against them on land."` : `\n\nThere's more at the bottom, but your hieroglyphs aren't good enough to read it.`),
    choices: [{ text: 'Read it slowly.', onSelect: () => { if (!sflag('falsedoor')) { sflag('falsedoor', true); skillXP('hieroglyphs', 35, 'the false door'); storyNote("The workers' cemetery", 'The pyramid builders\' own tombs, found in 1990. A false door with a curse on anyone who harms it: crocodiles in the water, snakes on land.'); } end(); } }],
});
scene('c1p_looterpit', {
    speaker: 'System',
    text: () => sflag('looterpit') ? `The looters' pit. Nothing more down there.` : `A fresh hole at the edge of a tomb chapel, spoil thrown back carelessly, a broken shovel. Robbers — recently. They went down a man's height and gave up.\n\nIn the spoil, something glints that they missed.`,
    get choices() {
        if (sflag('looterpit')) return [{ text: 'Leave it.', onSelect: end }];
        return [
            { text: 'Pick it out of the spoil.', onSelect: () => { sflag('looterpit', true); pocket('Faience amulet (Eye of Horus)'); skillXP('excavation', 20); storyNote("Looters' pit", 'Someone has been digging into the workers\' cemetery at night. You found a faience Eye of Horus amulet they missed. (Report it — or not.)'); startDialogue('c1p_amulet'); } },
            { text: 'Leave it for the Ministry to find.', onSelect: () => { sflag('looterpit', true); rep('ministry', 3, true); end(); } },
        ];
    },
});
scene('c1p_amulet', { speaker: 'System', text: `A tiny blue-green faience amulet — the wedjat, the Eye of Horus — no bigger than a fingernail, the glaze still bright after four thousand years. Hana would want to see it. So would the men who dug this hole.`, choices: [{ text: 'Keep it safe.', onSelect: end }] });

scene('c1p_maqam', {
    speaker: 'System',
    text: `A village saint's tomb — a maqam: a whitewashed cube under a dome, a green door, rag flags on a pole snapping in the wind. Somebody holy is buried here, long enough ago that nobody agrees who. People still come: there are candle stubs by the door, and a lamp burning in the niche.`,
    choices: [
        { text: 'Light a candle stub from the lamp.', onSelect: () => { if (!sflag('maqam_candle')) { sflag('maqam_candle', true); rep('keepers', 3, true); } end(); } },
        { text: 'Leave it in peace.', onSelect: end },
    ],
});
scene('c1p_oldwoman', {
    speaker: 'An Old Woman',
    text: () => {
        if (sflag('codex')) return `The old woman looks at your pack — not at you — for a long moment.\n\n"So. You have it." Her voice is soft, kind, and absolutely unafraid. "Take it to the old man at the café, my child. He reads. He doesn't keep." She goes back to her lamp.`;
        if (sflag('oldwoman')) return `She's trimming the lamp's wick with her fingers. "Still here, my child? The night is long."`;
        return `A small old woman in black sitting on a mat by the tomb door, a brass lamp in her lap. She could be anybody's grandmother. She looks at you as if she's been expecting you, and not especially pleased about it.\n\n"You're the new one. At the dig." She tilts the lamp. "The last one went down into the ground and came up with plaster on her hands. Be careful what you bring up, my child. Some things are only sleeping."`;
    },
    get choices() {
        if (sflag('codex') || sflag('oldwoman')) return [{ text: 'Leave her with her lamp.', onSelect: end }];
        return [
            { text: '"Do you know where Dr. Hale went?"', onSelect: () => { sflag('oldwoman', true); }, nextScene: 'c1p_oldwoman2' },
            { text: '"Good night, Hajja."', onSelect: () => { sflag('oldwoman', true); rep('keepers', 2, true); end(); } },
        ];
    },
});
scene('c1p_oldwoman2', {
    speaker: 'An Old Woman',
    text: `"Somewhere safe." She says it as if it's the end of the matter. "Safer than here."\n\nShe hands you something from her lap: a little tile, painted — a lamp inside a doorway. "For your pocket. You'll see more of these. Where you see one, you may rest."`,
    choices: [{ text: 'Take the tile.', onSelect: () => { pocket('Painted tile: a lamp in a doorway'); rep('keepers', 5, true); storyNote('The old woman with the lamp', 'At the sheikh\'s tomb, at night: an old woman in black who knew about Miriam — "somewhere safe" — and about the plaster on her hands. She gave you a painted tile, a lamp in a doorway: "Where you see one, you may rest." (The 1926 diary mentions an old woman with a lamp at the shaft.)'); end(); } }],
});

scene('c1p_tower', {
    speaker: 'System',
    text: `An old antiquities-police watchtower, steel legs and a tin hut, abandoned when they put up cameras. The ladder is sound. Mostly.`,
    choices: [
        { text: 'Climb to the top.', onSelect: () => { skillXP('climbing', sflag('tower') ? 10 : 50, 'the watchtower'); clockAdvance(10); startDialogue('c1p_tower_top'); } },
        { text: 'Not tonight.', onSelect: end },
    ],
});
scene('c1p_tower_top', {
    speaker: 'System',
    text: () => `The whole plateau lies below you: the lamps of both camps strung out like beads, the dig zone's floodlights under the escarpment, the Bedouin fire, the pale quarry knobs, the supply line snaking away into the dunes. And beyond it all, grey and enormous against Cairo's glow, the pyramids — and the Sphinx, a dark shape looking east.` +
        (typeof bpEquipped === 'function' && bpEquipped() === 'field_glasses' ? `\n\nThrough the field glasses: a car parked without lights on the causeway road, by the Osiris Shaft. Someone is sitting in it, very still.` : ''),
    choices: [{ text: 'Mark everything you can see.', onSelect: () => {
        sflag('tower', true);
        for (const pl of OW.places) gameState.flags['ow_disc_' + pl.id] = true;
        if (typeof owToast === 'function') owToast('THE WHOLE PLATEAU', 'Every place is on your phone\'s map');
        end();
    } }],
});

scene('c1p_ramp', {
    speaker: 'System',
    text: `A long, low mound running toward the escarpment, rubble packed between two tumbled walls of mud brick: a construction ramp. Whoever built the pyramids dragged stone up ramps like this — straight ones, zigzag ones, ramps spiralling round the pyramid itself; archaeologists have argued about which for two hundred years. In 2018 a ramp with post-holes and staircases either side was found at an Egyptian alabaster quarry, Hatnub — the argument got louder.\n\nThe sledge ruts are still in the packed surface, if you know how to look.`,
    choices: [{ text: 'Follow the ruts with your hand.', onSelect: () => { if (!sflag('ramp')) { sflag('ramp', true); skillXP('excavation', 25, 'the builders\' ramp'); } end(); } }],
});

for (let i = 0; i < 5; i++) scene('c1p_fossil' + i, {
    speaker: 'System',
    text: () => `A little stone disc the size of a coin, weathered out of the bedrock: a nummulite, a sea creature from when all this was the bottom of an ocean. The pyramids' limestone is full of them. Herodotus was told they were the lentils the pyramid workers ate, turned to stone. (${(sflag('fossils') || 0) + 1} of 5)`,
    choices: [{ text: 'Pocket it.', onSelect: () => {
        gameState.flags['c1p_fossil' + i] = true;
        const n = (sflag('fossils') || 0) + 1; sflag('fossils', n);
        skillXP('excavation', 6);
        if (n >= 5) { pocket('Nummulites ("pharaoh\'s lentils") ×5'); storyNote('The fossil pavement', 'Five nummulites — "pharaoh\'s lentils". Herodotus thought they were the pyramid workers\' food turned to stone. They\'re 45-million-year-old sea creatures, and the pyramids are made of them.'); if (typeof owToast === 'function') owToast("PHARAOH'S LENTILS", 'All five found'); }
        else if (typeof owToast === 'function') owToast('NUMMULITE', n + ' of 5');
        end();
    } }],
});
(function () {
    const _r = isObjectResolved;
    isObjectResolved = function (o) {
        // the old woman only keeps her lamp at night
        if (o.id === 'c1p_oldwoman' && storyOn() && (typeof ch1FX !== 'undefined' && ch1FX.day > 0.5)) return true;
        return _r(o);
    };
})();
builtSignature = null;
