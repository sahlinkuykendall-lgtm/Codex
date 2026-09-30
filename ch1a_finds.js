// ============================================================
// CHAPTER 1-A — HANA'S FINDS (ch1a_finds.js)
// Real scanned artefacts (downloaded models, prepared with
// tools/prepare_model.js) laid out on Hana's conservation table:
//   - a seated limestone statuette of an Old Kingdom official (the kind
//     the Western Field's mastaba tombs are full of)
//   - a leather sandal
//   - a papyrus fragment, curled as it dried
// and a "Finds Tray" you can examine. Loaded after models3d.js and the
// models/find_*.js packs.
// ============================================================
(function () {
    // Hana's table ("Equipment Table") centre and top height
    const tbl = mapObjects[1].find(o => o.id === 'd_equiptbl');
    if (!tbl) return;
    const tx = tbl.x + tbl.w / 2, tz = tbl.y + tbl.h / 2, TOP = 32.5;
    // the tray's interaction box sits at the front of the table
    const ox = tx - 40, oz = tz + 14;
    mapObjects[1].push({ id: 'c1a_finds', x: ox - 30, y: oz - 12, w: 60, h: 24, color: '#888', label: "Hana's Finds Tray", interactScene: 'c1a_finds', zone: 'open' });

    CH1_BUILDERS.c1a_finds = function (o, M) {
        const g = new THREE.Group();
        const at = (x, z) => [tx + x - ox, z + tz - oz];   // table-local → this group's local
        // the statuette, on a folded cloth
        const [sx, sz] = at(-44, -2);
        const cloth = put(g, gBox(30, 0.6, 24), new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 1 }), sx, TOP, sz);
        cloth.receiveShadow = true;
        const st = modelSpawn('find_steward', { height: 19, matte: true });
        st.group.position.set(sx, TOP + 0.3, sz);
        st.group.rotation.y = -0.5;
        g.add(st.group);
        // the sandal
        const [dx, dz] = at(36, 2);
        const sd = modelSpawn('find_sandal', { scale: 14 / 4.64, matte: true });
        sd.group.position.set(dx, TOP, dz);
        sd.group.rotation.y = 0.9;
        g.add(sd.group);
        // the papyrus fragment, curled as it dried, lying on the table
        const [px, pz] = at(-116, 8);
        const pp = modelSpawn('find_papyrus', { scale: 22 / 6.16, matte: true });
        pp.group.position.set(px, TOP + 5.2, pz);   // lifted: the sheet's curl is centred on its origin
        pp.group.rotation.set(-Math.PI / 2, 0, 0.15);
        g.add(pp.group);
        pp.ready.then(() => { if (pp.model) pp.model.position.y = 0; });
        // a lamp bent low over the finds, and a label card
        ch1Lamp(g, sx + 14, TOP + 26, sz - 10, { color: 0xfff0d8, intensity: 0.9, dist: 180, glow: 18 });
        put(g, gBox(6, 0.3, 4), M.paper, sx + 10, TOP + 0.2, sz + 9, 0.2);
        g.userData.h = 44;
        return g;
    };

    scene('c1a_finds', {
        speaker: 'System',
        text: () => `Hana's finds tray, under a lamp bent low on its arm, each piece on its own square of acid-free card:\n\n` +
            `• A seated statuette in painted limestone, the length of your hand: an official on a block seat, hands on his knees, a black wig, a patient face. Old Kingdom — somebody who served a pyramid's owner, and wanted to be remembered sitting down. The Western Field is full of men like him.\n` +
            `• A leather sandal, the thong still stitched, the sole worn thin at the heel. Somebody walked a long way in it.\n` +
            `• A scrap of papyrus, curled like a dry leaf: a column of Demotic in faded black — bread and beer, and the names of the men who were owed it.` +
            (sflag('met_hana') ? `\n\n"The statuette came out of Trench B," Hana says without looking up. "Before Miriam backfilled it. She wouldn't let me put it in the store. She said the store wasn't safe any more."` : ''),
        choices: [{ text: 'Look closely, and put everything back exactly.', onSelect: () => {
            if (!sflag('finds_tray')) { sflag('finds_tray', true); skillXP('excavation', 20, 'Hana\'s tray'); skillXP('greek', 5); storyNote("Hana's finds", 'A seated Old Kingdom statuette from Trench B, a leather sandal, and a Demotic papyrus of ration accounts. Miriam wouldn\'t let Hana put the statuette in the find store: "the store wasn\'t safe any more."'); }
            end();
        } }],
    });
    builtSignature = null;
})();
