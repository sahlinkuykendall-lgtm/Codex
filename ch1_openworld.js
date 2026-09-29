// ============================================================
// THE CODEX OF GIZA — CHAPTER 1 OPEN-WORLD CONTENT (ch1_openworld.js)
//
// Things to find and do between the story's places (3D build only):
//   - places worth the walk: the oasis and its well, old ruins, the
//     lookout ridge, a wrecked Land Rover, a Bedouin shelter, the spoil
//     field and its sieve, camel bones in the wadi
//   - the tea kettle by the workers' brazier (tea-pouring minigame →
//     Mint Tea, which already speeds stamina recovery)
//   - the sieve (sifting minigame → finds that pay a little EGP; money
//     matters in Ch1 — some choices cost 300–500)
//   - Sam's metal detector: carry it and it ticks faster near buried
//     things (caches of EGP and useful bits)
//   - 8 painted sherds scattered about (a bounty for the full set)
//   - a compass with your open missions, and place names on first visit
// None of it touches the story's flags or scenes; everything here uses
// its own ow_* flags.
// Loaded after ch1_props.js / ch1_minigames.js, before engine3d.js.
// ============================================================

const OW = {
    sherds: [
        [2290, 2200], [1150, 3320], [9290, 2210], [6950, 3060],
        [3380, 7075], [3060, 3200], [4980, 1560], [7575, 7020],
    ],
    caches: [
        { at: [3560, 7090], reward: { funds: 120 }, text: 'A rusted biscuit tin. Inside, folded tight in plastic: 120 EGP and a bus ticket from 1994.' },
        { at: [960, 4150], reward: { funds: 80 }, text: 'A handful of old coins — not ancient, just lost. The exchange office in Giza will give you 80 EGP for them.' },
        { at: [2320, 2500], reward: { item: 'Karkadeh' }, text: 'A sealed thermos, still full. Karkadeh — hibiscus, sour and cold. Someone buried their lunch and never came back for it.\n\n(Stamina recovers faster.)' },
        { at: [7050, 2960], reward: { funds: 60 }, text: 'A brass belt buckle and a coil of copper wire. The camp buys scrap: 60 EGP.' },
        { at: [9560, 2380], reward: { sanity: 1.0, bp: 'tin_compass' }, text: 'A child\'s tin compass, needle still swinging true. You hold it a while. North is still north.' },
        { at: [7620, 7080], reward: { funds: 150 }, text: 'A cloth bundle under a flat stone: 150 EGP in old notes. Bedouin savings, left for whoever needed it more. You leave a note of thanks under the stone.' },
        { at: [4180, 6320], reward: { funds: 50 }, text: 'A lost multitool. Tariq will pay 50 EGP for it — it\'s his.' },
        { at: [8620, 6620], reward: { item: 'Mint Tea' }, text: 'A tin of dried mint and a blackened pot. Enough for a week of proper tea.\n\n(Stamina recovers faster.)' },
        { at: [6260, 6920], reward: { bp: 'field_glasses' }, text: 'A leather case, cracked, and inside it a pair of brass-bound field glasses — a surveyor\'s, from the look of the markings. The lenses are clean.\n\n(Hold them with G, look with the right mouse button.)' },
        { at: [1620, 6150], reward: { bp: 'signal_mirror' }, text: 'A soldier\'s signalling mirror in a canvas sleeve, the silvering flaking at the edges. It throws the moon back at you.' },
        { at: [4620, 3320], reward: { bp: 'dates', qty: 4 }, text: 'A tin with a tight lid: dates, packed in their own sugar. Somebody\'s emergency ration.' },
        { at: [2750, 3100], reward: { funds: 90 }, text: 'A leather purse gone hard as wood. Inside, 90 EGP in coins that still spend.' },
    ],
    places: [
        { id: 'hub',      name: "ELLIS' CAMP",        at: [5600, 5150], r: 650 },
        { id: 'worker',   name: "THE WORKERS' CAMP",  at: [2300, 4600], r: 650 },
        { id: 'ministry', name: 'MINISTRY POST',       at: [8950, 5300], r: 600 },
        { id: 'trench',   name: 'THE EAST TRENCH',     at: [8150, 3400], r: 600 },
        { id: 'dig',      name: 'THE DIG ZONE',        at: [5600, 1800], r: 900 },
        { id: 'gate',     name: 'CAMP GATE',           at: [5000, 7350], r: 500 },
        { id: 'oasis',    name: 'THE OASIS',           at: [1300, 3500], r: 520 },
        { id: 'ruins',    name: 'THE OLD VILLAGE',     at: [2080, 2300], r: 480 },
        { id: 'lookout',  name: 'THE LOOKOUT',         at: [9380, 2130], r: 380 },
        { id: 'spoil',    name: 'THE SPOIL FIELD',     at: [3300, 3250], r: 480 },
        { id: 'shelter',  name: 'BEDOUIN SHELTER',     at: [7400, 6900], r: 420 },
        { id: 'wreck',    name: 'THE WRECK',           at: [3500, 7000], r: 380 },
        { id: 'wadi',     name: 'THE DRY WADI',        at: [6900, 3000], r: 420 },
    ],
    toast: null, toastT: 0,
    detector: { beepAt: 0 },
};

// ---- OBJECTS ----
(function addOpenWorldObjects() {
    const objs = mapObjects[1];
    if (!objs || objs._owAdded) return;
    objs._owAdded = true;
    const add = (o) => objs.push(Object.assign({ color: '#888', zone: 'open' }, o));
    // places
    add({ id: 'ow_oasis',   x: 1080, y: 3350, w: 340, h: 200, label: 'Oasis Pool', interactScene: null, decorative: true });
    add({ id: 'ow_well',    x: 1440, y: 3580, w: 56,  h: 56,  label: 'Old Well', interactScene: 'ow_well' });
    add({ id: 'ow_ruins',   x: 1900, y: 2150, w: 360, h: 300, label: 'Ruined Village', interactScene: null, decorative: true });
    add({ id: 'ow_ruin_note', x: 2040, y: 2270, w: 60, h: 40, label: 'Fallen Lintel', interactScene: 'ow_ruins' });
    add({ id: 'ow_lookout', x: 9350, y: 2100, w: 60,  h: 60,  label: 'Cairn', interactScene: 'ow_lookout' });
    add({ id: 'ow_wreck',   x: 3420, y: 6930, w: 170, h: 90,  label: 'Wrecked Land Rover', interactScene: 'ow_wreck' });
    add({ id: 'ow_shelter', x: 7330, y: 6830, w: 200, h: 150, label: 'Bedouin Shelter', interactScene: 'ow_shelter' });
    add({ id: 'ow_bones',   x: 6860, y: 2960, w: 140, h: 60,  label: 'Camel Bones', interactScene: 'ow_bones' });
    add({ id: 'ow_spoil',   x: 3120, y: 3080, w: 420, h: 320, label: 'Spoil Heaps', interactScene: null, decorative: true });
    add({ id: 'ow_sieve',   x: 3300, y: 3300, w: 70,  h: 50,  label: 'Sieve', interactScene: 'ow_sieve' });
    add({ id: 'ow_tea',     x: 1990, y: 4870, w: 34,  h: 30,  label: 'Tea Kettle', interactScene: 'ow_tea' });
    add({ id: 'ow_detector', x: 5930, y: 5150, w: 30, h: 30,  label: 'Metal Detector', interactScene: 'ow_detector', owFlag: 'ow_detector' });
    OW.sherds.forEach(([x, z], i) => add({ id: 'ow_sherd' + i, x: x - 12, y: z - 12, w: 24, h: 24, label: 'Painted Sherd', interactScene: 'ow_sherd' + i, owFlag: 'ow_sherd' + i, sherd: true }));
    OW.caches.forEach((c, i) => add({ id: 'ow_cache' + i, x: c.at[0] - 20, y: c.at[1] - 20, w: 40, h: 40, label: 'Something Buried', interactScene: 'ow_cache' + i, owFlag: 'ow_cache' + i, cache: true }));
    // the pond is water — you walk round it
    mapWalls[1].push({ x: 1110, y: 3380, w: 280, h: 140, kind: 'pond' });
})();

// Collected / not-yet-findable things disappear like resolved story objects
(function wrapResolved() {
    const _isResolved = isObjectResolved;
    isObjectResolved = function (o) {
        if (o.owFlag && gameState.flags[o.owFlag]) return true;
        if (o.cache && !(typeof bpEquipped === 'function' && bpEquipped() === 'metal_detector')) return true; // dig only with the detector in hand
        return _isResolved(o);
    };
})();

// ---- SCENES (small, self-contained; never touch story flags) ----
function owReward(r) {
    if (!r) return;
    if (r.funds) gameState.funds += r.funds;
    if (r.item && !gameState.inventory.includes(r.item)) gameState.inventory.push(r.item);
    if (r.sanity) increaseSanity(r.sanity);
    if (r.stamina) gameState.stamina = gameState.maxStamina;
    updateHUD();
    if (typeof sndPickup === 'function') sndPickup();
}
function owSherdCount() { return OW.sherds.filter((_, i) => gameState.flags['ow_sherd' + i]).length; }

Object.assign(storyData, {
    'ow_well': { speaker: 'System', text: () => (gameState.flags.ow_well_used && Date.now() - (gameState.flags.ow_well_used || 0) < 90000)
            ? 'The bucket is still dripping from last time. Give the well a minute.'
            : 'A well older than the camp — stone-lined, the rope worn glassy where hands have hauled it for a hundred years. The water down there catches the moon.',
        choices: [
            { text: 'Haul up a bucket and drink.', onSelect: () => {
                if (gameState.flags.ow_well_used && Date.now() - gameState.flags.ow_well_used < 90000) { closeDialogue(); return; }
                gameState.flags.ow_well_used = Date.now();
                owReward({ stamina: true, sanity: 0.4 });
                const c = typeof bpFind === 'function' && bpFind('canteen');
                if (c) { c.charges = 3; owToast('CANTEEN FILLED', '3 drinks (Q)'); }
                startDialogue('ow_well_drink');
            } },
            { text: 'Take the old canteen hanging on the post.', onSelect: () => {
                if (gameState.flags.ow_canteen_taken) { closeDialogue(); return; }
                if (bpAdd('canteen', 1, { charges: 3 })) { gameState.flags.ow_canteen_taken = true; owToast('WATER CANTEEN', 'Full · Q to drink anywhere'); }
                closeDialogue();
            } },
            { text: 'Leave it.', onSelect: () => closeDialogue() },
        ] },
    'ow_well_drink': { speaker: 'System', text: 'Cold, faintly sweet, tasting of stone. You drink until your teeth ache.\n\n(Stamina restored.)', choices: [{ text: 'Wipe your mouth.', onSelect: () => closeDialogue() }] },
    'ow_ruins': { speaker: 'Ellis', text: 'Mud brick slumped back into the sand it came from, and one limestone lintel that someone carried a long way to put over a door. A workers\' village — later than the plateau\'s famous dead, earlier than anyone\'s records. People lived here, argued, ate bread with grit in it.\n\nEvery dig is somebody\'s kitchen.',
        choices: [{ text: 'Sketch the lintel.', onSelect: () => { if (!gameState.flags.ow_ruins_seen) { gameState.flags.ow_ruins_seen = true; increaseSanity(0.3); updateHUD(); } closeDialogue(); } }] },
    'ow_lookout': { speaker: 'System', text: 'A cairn of flat stones on the ridge\'s crown — generations of surveyors adding one each. From here the whole camp lies below you, lamps strung along the tracks like beads, and beyond it, grey against the stars, Giza.',
        choices: [
            { text: 'Add a stone. Sit a while.', onSelect: () => { if (!gameState.flags.ow_lookout_sat) { gameState.flags.ow_lookout_sat = true; owReward({ sanity: 1.2 }); } closeDialogue(); } },
            { text: 'Head back down.', onSelect: () => closeDialogue() },
        ] },
    'ow_wreck': { speaker: 'System', text: 'A Land Rover from before you were born, buried to the doors, paint sandblasted back to bare aluminium. A ministry roundel is still just visible on the door. Nobody came to dig it out. The desert keeps what it\'s given.',
        choices: [{ text: 'Check the glovebox.', onSelect: () => { if (!gameState.flags.ow_wreck_glovebox) { gameState.flags.ow_wreck_glovebox = true; owReward({ funds: 40 }); startDialogue('ow_wreck_found'); } else startDialogue('ow_wreck_empty'); } },
                  { text: 'Leave it to the sand.', onSelect: () => closeDialogue() }] },
    'ow_wreck_found': { speaker: 'System', text: 'Maps of a Cairo that no longer exists, a tin of boiled sweets fused into one lump, and 40 EGP in coins.', choices: [{ text: 'Pocket the coins.', onSelect: () => closeDialogue() }] },
    'ow_wreck_empty': { speaker: 'System', text: 'Just the fused sweets. You leave them for the next archaeologist.', choices: [{ text: 'Fair.', onSelect: () => closeDialogue() }] },
    'ow_shelter': { speaker: 'System', text: 'Poles and goat-hair cloth, a ring of blackened stones, a water skin hung from the ridge-pole. Bedouin — gone for the season, or just gone for the night. A clay dish of dates sits covered on a flat stone, the way you leave food for a guest.',
        choices: [{ text: 'Take a handful of dates for the road.', onSelect: () => { if (!gameState.flags.ow_dates && bpAdd('dates', 3)) { gameState.flags.ow_dates = true; owReward({ sanity: 0.4 }); owToast('DATES ×3', 'In your pack · eat one from the backpack (I)'); } closeDialogue(); } },
                  { text: 'Leave everything as it is.', onSelect: () => closeDialogue() }] },
    'ow_bones': { speaker: 'System', text: 'A camel\'s skeleton in the dry wadi, bleached and articulated, as if it lay down to sleep and the sand simply took the rest. The ribs make a cage around nothing.',
        choices: [{ text: 'Walk on.', onSelect: () => closeDialogue() }] },
    'ow_sieve': { speaker: 'System', text: () => (gameState.flags.ow_sieve_runs || 0) >= 3
            ? 'The heaps here are sifted to nothing. The finds tray is full of your work.'
            : 'A sieve frame on trestles beside the old spoil — the trench\'s cast-off earth, never properly sifted. The site buys anything you find for the register.\n\n(Heaps left: ' + (3 - (gameState.flags.ow_sieve_runs || 0)) + ')',
        choices: [
            { text: 'Sift a heap. (minigame)', onSelect: () => { if ((gameState.flags.ow_sieve_runs || 0) >= 3) { closeDialogue(); return; } closeDialogue(); startPuzzle('ow_sieve'); } },
            { text: 'Not now.', onSelect: () => closeDialogue() },
        ] },
    'ow_tea': { speaker: 'System', text: () => gameState.inventory.includes('Mint Tea')
            ? 'The kettle ticks on the coals. You already carry the good mint — but a glass never hurt anyone.'
            : 'A blackened kettle on the brazier\'s edge, a tray of little glasses, a bunch of fresh mint. The workers pour from a height — the foam is the whole point.',
        choices: [
            { text: 'Pour a glass. (minigame)', onSelect: () => { closeDialogue(); startPuzzle('ow_tea'); } },
            { text: 'Leave it.', onSelect: () => closeDialogue() },
        ] },
    'ow_detector': { speaker: 'System', text: 'Sam\'s metal detector, leaning where he left it — tape round the handle, "S.O." scratched into the housing. The battery light still comes on.\n\nWith it switched on you\'ll hear a tick that quickens near anything buried.',
        choices: [{ text: 'Take it.', onSelect: () => { if (bpAdd('metal_detector')) { gameState.flags.ow_detector = true; owReward({}); owToast('METAL DETECTOR', 'In your pack · press G to hold it'); } closeDialogue(); } },
                  { text: 'Leave it.', onSelect: () => closeDialogue() }] },
});
OW.sherds.forEach((_, i) => {
    storyData['ow_sherd' + i] = { speaker: 'System', text: () => 'A painted sherd, the size of your palm — a band of red ochre and a black line, some potter\'s steady hand. (' + (owSherdCount() + 1) + ' of ' + OW.sherds.length + ')',
        choices: [{ text: 'Bag it for the finds register.', onSelect: () => {
            if (!bpAdd('sherd')) { closeDialogue(); return; }
            gameState.flags['ow_sherd' + i] = true;
            owReward({ funds: 15 });
            if (owSherdCount() === OW.sherds.length) startDialogue('ow_sherds_all');
            else { owToast('PAINTED SHERD', owSherdCount() + ' of ' + OW.sherds.length + ' · +15 EGP'); closeDialogue(); }
        } }] };
});
storyData['ow_sherds_all'] = { speaker: 'System', text: 'Eight sherds. Laid out on your field table they fit — not one pot, but one hand: the same black line, the same flick at the end. One potter, a whole village\'s worth of jars, scattered across a mile of sand.\n\nThe register pays a bounty for a set. (+250 EGP)',
    choices: [{ text: 'Log the set.', onSelect: () => { if (bpHas('sherd')) bpRemove('sherd'); owReward({ funds: 250, sanity: 0.8 }); closeDialogue(); } }] };
OW.caches.forEach((c, i) => {
    storyData['ow_cache' + i] = { speaker: 'System', text: 'The detector shrieks. You dig with your hands.\n\n' + c.text,
        choices: [{ text: 'Take it.', onSelect: () => {
            if (c.reward.bp && !bpAdd(c.reward.bp, c.reward.qty)) { closeDialogue(); return; } // no room: it waits for you
            gameState.flags['ow_cache' + i] = true; owReward(c.reward); closeDialogue();
        } }] };
});

// minigame definitions (played by ch1_minigames.js)
PUZZLES['ow_tea'] = { type: 'tea', title: 'MINT TEA', samBest: 0 };
PUZZLES['ow_sieve'] = { type: 'sieve', title: 'THE SIEVE' };

// ---- BUILDERS ----
Object.assign(CH1_BUILDERS, {
    ow_oasis(o, M, rng) {
        const g = new THREE.Group();
        const water = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshStandardMaterial({ color: 0x0c1a22, roughness: 0.05, metalness: 0.6 }));
        water.rotation.x = -Math.PI / 2;
        water.scale.set(o.w * 0.5, o.h * 0.55, 1);
        water.position.y = 1.5;
        water.userData.noCast = true;
        g.add(water);
        const moonGlint = ch1GlowSprite(40, 3, -20, 90, 0xb8c8ff, 0.25);
        g.add(moonGlint);
        // reeds round the rim, palms behind
        for (let i = 0; i < 26; i++) {
            const a = rng() * Math.PI * 2, rx = Math.cos(a) * o.w * 0.52, rz = Math.sin(a) * o.h * 0.58;
            for (let k = 0; k < 4; k++) put(g, gCyl(0.4, 0.8, 30 + rng() * 20, 3), M.cactus, rx + (rng() - 0.5) * 12, 16, rz + (rng() - 0.5) * 12, 0, (rng() - 0.5) * 0.3, (rng() - 0.5) * 0.3);
        }
        for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2 + rng() * 0.4;
            const pg = new THREE.Group();
            pg.position.set(Math.cos(a) * (o.w * 0.62 + rng() * 60), 0, Math.sin(a) * (o.h * 0.75 + rng() * 60));
            subPalm(pg, M, 1.1 + rng() * 0.5, rng);
            g.add(pg);
        }
        g.userData.h = 0;
        return g;
    },
    ow_well(o, M, rng) {
        const g = new THREE.Group();
        put(g, new THREE.CylinderGeometry(24, 26, 30, 16, 1, true), M.limestone, 0, 15, 0).material = new THREE.MeshStandardMaterial({ map: CH1M.tex.rock, side: THREE.DoubleSide, color: 0xd8c8a8 });
        put(g, new THREE.TorusGeometry(24, 4, 6, 18), M.limestone, 0, 30, 0).rotation.x = Math.PI / 2;
        put(g, gCyl(22, 22, 2, 16), M.black, 0, 6, 0);
        for (const s of [-1, 1]) put(g, gBox(5, 70, 5), M.woodDark, s * 28, 35, 0);
        put(g, gCyl(3, 3, 64, 8), M.wood, 0, 68, 0, 0, Math.PI / 2);
        put(g, gCyl(0.6, 0.6, 30, 4), M.rope, 0, 52, 0);
        put(g, new THREE.CylinderGeometry(7, 5.5, 10, 10, 1, true), M.metal, 30, 5, 18);
        g.userData.h = 76;
        return g;
    },
    ow_ruins(o, M, rng) {
        const g = new THREE.Group();
        const block = (x, z, w, d, h, rot) => put(g, gBox(w, h, d), M.limestone, x, h / 2 - 2, z, rot, (rng() - 0.5) * 0.06);
        // footprints of rooms: low walls of limestone and slumped mud brick
        const mud = new THREE.MeshStandardMaterial({ map: CH1M.tex.sand, color: 0xe0c8a0, roughness: 1 });
        const rooms = [[-110, -80, 120, 100], [30, -100, 140, 90], [-60, 60, 150, 110], [110, 50, 90, 120]];
        for (const [rx, rz, rw, rd] of rooms) {
            for (const [x, z, w, d] of [[rx, rz - rd / 2, rw, 12], [rx, rz + rd / 2, rw, 12], [rx - rw / 2, rz, 12, rd], [rx + rw / 2, rz, 12, rd]]) {
                if (rng() < 0.2) continue;
                const h = 14 + rng() * 34;
                put(g, gBox(w * (0.6 + rng() * 0.4), h, d), rng() < 0.5 ? mud : M.limestone, x, h / 2 - 3, z, 0, (rng() - 0.5) * 0.08);
            }
        }
        // two column drums and a fallen lintel
        for (const [x, z] of [[-10, -10], [70, 0]]) put(g, gCyl(14, 15, 40 + rng() * 40, 14), M.limestone, x, 20, z);
        block(40, 20, 90, 22, 18, 0.4);
        for (let i = 0; i < 14; i++) ch1AddRock(g, (rng() - 0.5) * o.w, 0, (rng() - 0.5) * o.h, 6 + rng() * 10, rng, M.limestone);
        g.userData.h = 0;
        return g;
    },
    ow_ruin_note(o, M) { const g = new THREE.Group(); g.userData.h = 50; return g; },
    ow_lookout(o, M, rng) {
        const g = new THREE.Group();
        let y = 0;
        for (let i = 0; i < 9; i++) {
            const r = 20 - i * 2 + rng() * 3;
            const s = put(g, gCyl(r, r + 1, 7, 7), M.rock, (rng() - 0.5) * 3, y + 3.5, (rng() - 0.5) * 3, rng() * 3);
            s.scale.z = 0.8;
            y += 6.5;
        }
        put(g, gBox(60, 12, 26), M.rock, 50, 6, 30, 0.5);   // a stone to sit on
        g.userData.h = y + 12;
        return g;
    },
    ow_wreck(o, M, rng) {
        // the Harvard–Boston Expedition's truck, 1926: a Model T-era
        // one-tonner — long bonnet, brass radiator, open cab under a flat
        // roof on posts, a slatted wooden bed — sandblasted to rust and
        // half swallowed by the dune
        const g = new THREE.Group();
        const paint = new THREE.MeshStandardMaterial({ map: makeTex('c1truckPaint', 128, 128, 1, 1, (cc, w, h) => {
            cc.fillStyle = '#6a4a30'; cc.fillRect(0, 0, w, h);
            blotches(cc, w, h, ['rgba(52,62,44,A)', 'rgba(150,90,50,A)', 'rgba(90,60,40,A)'], 18, 8, 40, 0.6);  // old green paint, rust
            speckle(cc, w, h, null, ['#c08a5a', '#3a2a1c', '#8a9a7a'], 500, 0.8, 3);
        }), roughness: 0.85, metalness: 0.35 });
        const brass = new THREE.MeshStandardMaterial({ color: 0x8a6a2a, roughness: 0.45, metalness: 0.8 });
        const L = o.w * 0.95, W = Math.min(o.h * 0.8, 64);
        const t = new THREE.Group();
        // chassis rails
        for (const s of [-1, 1]) put(t, gBox(L, 5, 4), M.metalDark, 0, 24, s * W * 0.32);
        // bonnet, radiator, mudguards
        put(t, gBox(L * 0.26, 20, W * 0.52), paint, L * 0.34, 38, 0);
        put(t, gBox(4, 26, W * 0.56), brass, L * 0.475, 38, 0);
        put(t, gBox(2, 20, W * 0.44), M.black, L * 0.482, 38, 0);
        for (const s of [-1, 1]) {
            put(t, gCyl(4.5, 4.5, 3, 10), brass, L * 0.47, 42, s * W * 0.36, 0, Math.PI / 2);   // headlamps
            const guard = put(t, new THREE.CylinderGeometry(15, 15, 11, 12, 1, true, 0, Math.PI), paint, L * 0.3, 22, s * W * 0.42);
            guard.rotation.set(Math.PI / 2, 0, 0);
            guard.material = paint.clone(); guard.material.side = THREE.DoubleSide;
        }
        // the open cab: seat box, dash, flat roof on four posts (one bent)
        put(t, gBox(L * 0.16, 16, W * 0.9), paint, L * 0.1, 36, 0);
        put(t, gBox(3, 22, W * 0.9), paint, L * 0.2, 46, 0);
        put(t, gBox(L * 0.22, 2.5, W * 0.95), M.woodDark, L * 0.09, 86, 0, 0, 0.06);
        for (const [x, z, bend] of [[L * 0.2, -1, 0], [L * 0.2, 1, 0], [-L * 0.02, -1, 0.35], [-L * 0.02, 1, 0]])
            put(t, gCyl(1.2, 1.2, 42, 5), M.metalDark, x, 64, z * W * 0.44, 0, bend);
        put(t, new THREE.TorusGeometry(7, 1, 5, 14), M.black, L * 0.16, 52, -W * 0.18, Math.PI / 2, 0.5);  // steering wheel
        // the slatted bed
        put(t, gBox(L * 0.5, 3, W), M.woodDark, -L * 0.24, 30, 0);
        for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
            if (rng() < 0.25) continue;   // missing slats
            put(t, gBox(L * 0.5, 3.5, 1.5), M.woodPale, -L * 0.24, 36 + k * 7, s * W * 0.49);
        }
        const tail = put(t, gBox(2, 22, W), M.woodPale, -L * 0.49, 42, 0);
        tail.rotation.z = -0.5;   // tailboard hanging open
        const sten = put(t, gBox(1, 14, W * 0.8), signMat('c1truckStencil', [['HARVARD – BOSTON', 20], ['EXP.  1926', 20]], '#8a7a5a', '#e8dcc0', 256, 64), -L * 0.505, 40, 0);
        sten.rotation.z = -0.5;
        sten.position.x -= 1.6;
        // spoked wheels (one missing, one sunk)
        const wheel = (x, z) => {
            const wg = new THREE.Group();
            put(wg, new THREE.TorusGeometry(13, 2.6, 6, 16), M.rubber, 0, 0, 0);
            for (let k = 0; k < 10; k++) { const sp = put(wg, gBox(1.2, 22, 1.2), M.woodPale, 0, 0, 0); sp.rotation.z = k * Math.PI / 10; }
            put(wg, gCyl(3, 3, 5, 8), M.metalDark, 0, 0, 0, 0, 0, Math.PI / 2);
            wg.position.set(x, 13, z);
            t.add(wg);
        };
        wheel(L * 0.3, -W * 0.5); wheel(L * 0.3, W * 0.5); wheel(-L * 0.3, W * 0.5);
        put(t, gCyl(2.5, 2.5, W, 6), M.metalDark, -L * 0.3, 13, 0, 0, 0, Math.PI / 2);          // bare axle stub
        t.rotation.set(0.08, 0.35, -0.12);
        t.position.y = -5;
        g.add(t);
        // the dune that has it up to the axles
        const drift = put(g, new THREE.SphereGeometry(1, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.sand, -o.w * 0.15, -8, 12);
        drift.scale.set(o.w * 0.45, 26, o.h * 0.9);
        g.userData.h = 96;
        return g;
    },
    ow_shelter(o, M, rng) {
        // a Bedouin goat-hair tent (bayt al-sha'r): long and low, the woven
        // strips sagging between the poles, a back wall, guy ropes staked
        // out in the sand; kilims and cushions inside behind a patterned
        // partition; a hearth with brass coffee pots out front, water
        // skins on the poles, a saddle, and the camel couched beside it
        const g = new THREE.Group();
        const L = o.w * 1.35, D = o.h * 0.95;
        const hair = makeTex('c1goathair', 256, 256, 1, 1, (cc, w, h) => {
            cc.fillStyle = '#231b15'; cc.fillRect(0, 0, w, h);
            // the tent is sewn from long woven strips: faint seams and a pale stripe or two
            for (let x = 0; x < w; x += 32) {
                cc.fillStyle = 'rgba(0,0,0,0.35)'; cc.fillRect(x, 0, 2, h);
                if ((x / 32) % 3 === 1) { cc.fillStyle = 'rgba(190,170,140,0.28)'; cc.fillRect(x + 12, 0, 5, h); }
            }
            speckle(cc, w, h, null, ['#3a2e24', '#120d0a', '#4a3c30', '#6a5a48'], 2600, 0.6, 1.8, 0.2, 0.6);
        });
        hair.repeat.set(4, 2);
        const cloth = new THREE.MeshStandardMaterial({ map: hair, roughness: 1, side: THREE.DoubleSide });
        const sahah = makeTex('c1sahah', 256, 128, 1, 1, (cc, w, h) => {
            // the partition curtain: bands of red, black, white and ochre with little lozenges
            const bands = ['#8a1f1a', '#1a1410', '#e8dcc0', '#b8862a', '#8a1f1a', '#2a4a3a', '#e8dcc0', '#1a1410'];
            const bh = h / bands.length;
            bands.forEach((c, i) => { cc.fillStyle = c; cc.fillRect(0, i * bh, w, bh); });
            for (let i = 0; i < bands.length; i += 2) for (let x = 6; x < w; x += 18) {
                cc.fillStyle = i % 4 ? '#e8dcc0' : '#b8862a';
                cc.beginPath(); cc.moveTo(x, i * bh + bh * 0.2); cc.lineTo(x + 5, i * bh + bh / 2); cc.lineTo(x, i * bh + bh * 0.8); cc.lineTo(x - 5, i * bh + bh / 2); cc.fill();
            }
        });
        const sahahMat = new THREE.MeshStandardMaterial({ map: sahah, roughness: 1, side: THREE.DoubleSide });
        const pole = M.woodPale;

        // roof: height from the poles — a ridge of centre poles, lower at front and back,
        // the cloth sagging between each pole along the length
        const nPoles = 4, ridgeH = 64, frontH = 50, backH = 34;
        const roofY = (x, z) => {
            const u = (z + D / 2) / D;                                   // 0 back … 1 front
            const across = u < 0.5 ? backH + (ridgeH - backH) * (u / 0.5) : ridgeH + (frontH - ridgeH) * ((u - 0.5) / 0.5);
            const along = (x + L / 2) / L * (nPoles - 1);
            const sag = Math.sin(Math.PI * (along - Math.floor(along))) * 7;
            return across - sag;
        };
        const roof = new THREE.PlaneGeometry(L, D, 30, 12);
        roof.rotateX(-Math.PI / 2);
        const rp = roof.attributes.position;
        for (let i = 0; i < rp.count; i++) {
            const x = rp.getX(i), z = rp.getZ(i);
            rp.setY(i, roofY(x, z) + (fbm3(x * 0.03, 1, z * 0.03, 2) - 0.5) * 3);
        }
        roof.computeVertexNormals();
        const roofMesh = new THREE.Mesh(roof, cloth);
        roofMesh.castShadow = true;
        g.add(roofMesh);
        // poles: centre ridge, front and back rows
        for (let i = 0; i < nPoles; i++) {
            const x = -L / 2 + (i / (nPoles - 1)) * L;
            put(g, gCyl(1.6, 2, ridgeH, 6), pole, x * 0.96, ridgeH / 2, 0);
            put(g, gCyl(1.4, 1.8, frontH, 6), pole, x * 0.96, frontH / 2, D / 2);
            put(g, gCyl(1.4, 1.8, backH, 6), pole, x * 0.96, backH / 2, -D / 2);
        }
        // the back wall (ruffa), hanging from the back edge; half walls at the ends
        const back = sagPlane(L, backH, 3, 16, 3);
        const bw = put(g, back, cloth, 0, backH / 2, -D / 2);
        bw.material = cloth;
        for (const s of [-1, 1]) {
            const side = put(g, new THREE.PlaneGeometry(D * 0.55, 40), cloth, s * L / 2, 20, -D * 0.22, Math.PI / 2);
            side.material = cloth;
        }
        // guy ropes to stakes in the sand, front and back
        for (let i = 0; i < nPoles; i++) {
            const x = (-L / 2 + (i / (nPoles - 1)) * L) * 0.96;
            for (const [zEdge, hEdge, out] of [[D / 2, frontH, 1], [-D / 2, backH, -1]]) {
                const stake = new THREE.Vector3(x + (rng() - 0.5) * 10, 0, zEdge + out * (46 + rng() * 14));
                subBeam(g, M.rope, new THREE.Vector3(x, hEdge, zEdge), stake, 0.35, 4);
                put(g, gCyl(0.9, 1.2, 8, 5), pole, stake.x, 3, stake.z);
            }
        }
        // the partition curtain, a third of the way along
        const cur = put(g, new THREE.PlaneGeometry(D * 0.92, 44), sahahMat, -L / 6, 22, 0, Math.PI / 2);
        cur.material = sahahMat;
        // floor: kilims, cushions along the back, a camel saddle and a chest
        const r1 = put(g, new THREE.PlaneGeometry(L * 0.55, D * 0.7), M.rug, L * 0.18, 0.8, 0);
        r1.rotation.x = -Math.PI / 2; r1.userData.noCast = true;
        const r2 = put(g, new THREE.PlaneGeometry(L * 0.28, D * 0.6), M.rug, -L * 0.36, 0.9, -4);
        r2.rotation.set(-Math.PI / 2, 0, 0.08); r2.userData.noCast = true;
        const cushionCols = [0x8a1f1a, 0x2a4a6a, 0xb8862a, 0x6a2a4a, 0x2a5a3a];
        for (let i = 0; i < 6; i++) {
            const c = put(g, new THREE.CapsuleGeometry(5, 16, 4, 8), new THREE.MeshStandardMaterial({ color: cushionCols[i % 5], roughness: 0.95 }), -L * 0.08 + i * 20, 5, -D / 2 + 12, 0, 0, Math.PI / 2);
            c.scale.set(1, 1, 0.8);
        }
        // camel saddle (shadad): two wooden forks on a pad
        const sad = new THREE.Group();
        put(sad, gBox(26, 6, 18), new THREE.MeshStandardMaterial({ color: 0x6a2a1a, roughness: 1 }), 0, 3, 0);
        for (const s of [-1, 1]) { const f = put(sad, new THREE.TorusGeometry(8, 1.2, 5, 10, Math.PI), M.woodDark, s * 9, 6, 0, Math.PI / 2); }
        sad.position.set(L * 0.36, 0, -D * 0.18); sad.rotation.y = 0.6;
        g.add(sad);
        subCrate(g, M, L * 0.44, 0, D * 0.05, 18, 0.2);
        // water skins (girba) hanging from the front poles
        const skin = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.7 });
        for (const i of [1, 2]) {
            const x = (-L / 2 + (i / (nPoles - 1)) * L) * 0.96;
            const w = put(g, new THREE.SphereGeometry(6, 10, 8), skin, x + 5, frontH - 16, D / 2 + 3);
            w.scale.set(0.8, 1.3, 0.7);
            subBeam(g, M.rope, new THREE.Vector3(x, frontH - 4, D / 2), new THREE.Vector3(x + 5, frontH - 9, D / 2 + 3), 0.3, 4);
        }
        // the hearth out front: a ring of stones, embers, brass coffee pots (dallah) and cups
        const hx = L * 0.1, hz = D / 2 + 42;
        for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; ch1AddRock(g, hx + Math.cos(a) * 16, 0, hz + Math.sin(a) * 16, 4.5, rng, M.rockDark); }
        const coals = put(g, new THREE.SphereGeometry(10, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), M.ember, hx, -1, hz);
        coals.scale.y = 0.35; coals.userData.noShadow = true;
        g.add(ch1GlowSprite(hx, 6, hz, 60, 0xff8a3a, 0.45));
        ch1FX.lamps.push({ anchor: (() => { const a = new THREE.Object3D(); a.position.set(hx, 16, hz); g.add(a); return a; })(), color: 0xff7a30, intensity: 1.0, dist: 320, steady: false, phase: rng() * 10, wp: null });
        const brass = new THREE.MeshStandardMaterial({ color: 0xb8903a, roughness: 0.35, metalness: 0.85 });
        const dallah = (x, z, s) => {
            const d = new THREE.Group();
            put(d, gCyl(4.2, 5.4, 7, 12), brass, 0, 3.5, 0);                 // belly
            put(d, gCyl(2.2, 4.2, 5, 12), brass, 0, 9.5, 0);                 // waist
            put(d, new THREE.ConeGeometry(3, 6, 12), brass, 0, 15, 0);       // lid, pointed
            put(d, new THREE.SphereGeometry(0.9, 6, 5), brass, 0, 18.4, 0);
            const beak = put(d, gCyl(0.6, 1.6, 9, 6), brass, 5.2, 10, 0);   // the long beak spout
            beak.rotation.z = -1.05;
            put(d, new THREE.TorusGeometry(3.4, 0.6, 5, 10, Math.PI), brass, -4.4, 8, 0, 0, Math.PI / 2);
            d.position.set(x, 0, z); d.scale.setScalar(s); d.rotation.y = rng() * 6;
            g.add(d);
        };
        dallah(hx + 20, hz - 4, 1); dallah(hx + 26, hz + 9, 0.8); dallah(hx - 3, hz + 3, 0.9);   // one on the coals
        put(g, gCyl(9, 9, 1.2, 14), brass, hx + 38, 0.6, hz - 14);           // tray
        for (let i = 0; i < 4; i++) put(g, gCyl(1.4, 1, 2.6, 8), new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.3 }), hx + 34 + (i % 2) * 6, 2.4, hz - 17 + (i >> 1) * 6); // finjan cups
        // dates, covered, on a flat stone (the text mentions them)
        put(g, gBox(20, 5, 16), M.rockDark, -L * 0.1, 2.5, D / 2 + 26, 0.3);
        const dish = put(g, gCyl(8, 5, 4, 12), M.terracotta, -L * 0.1, 7, D / 2 + 26);
        put(g, new THREE.SphereGeometry(8.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xc8b89a, roughness: 1 }), -L * 0.1, 8.5, D / 2 + 26).scale.y = 0.4;
        // a stack of acacia firewood
        for (let i = 0; i < 7; i++) put(g, gCyl(1.4, 1.8, 30 + rng() * 14, 5), M.woodDark, L * 0.5 + 16 + (i % 3) * 3, 2 + (i >> 1) * 2.6, D * 0.3 + (rng() - 0.5) * 6, rng() * 0.3, 0, Math.PI / 2);

        // the camel, couched beside the tent, chewing
        const camel = new THREE.Group();
        const hide = new THREE.MeshStandardMaterial({ color: 0x9a6a3c, roughness: 1 });
        const hideDark = new THREE.MeshStandardMaterial({ color: 0x5e4228, roughness: 1 });
        // body: long and low, belly on the sand; one hump, set a little back
        const body = put(camel, new THREE.SphereGeometry(18, 18, 12), hide, 0, 17, 0);
        body.scale.set(0.74, 0.74, 1.42);
        put(camel, new THREE.SphereGeometry(12, 14, 10), hide, 0, 24, -3).scale.set(0.72, 0.9, 1.05);
        put(camel, new THREE.SphereGeometry(7, 10, 8), hideDark, 0, 32, -3).scale.set(0.8, 0.55, 1.2);   // shaggy crown of the hump
        // chest pad, and the folded legs: knees out in front, hind legs as haunches
        put(camel, new THREE.SphereGeometry(8, 10, 8), hideDark, 0, 5, 20).scale.set(1.1, 0.6, 1);
        for (const s of [-1, 1]) {
            put(camel, new THREE.SphereGeometry(4.2, 8, 6), hideDark, s * 8, 4, 25);                     // callused knee, folded under the chest
            put(camel, new THREE.SphereGeometry(3.4, 8, 6), hideDark, s * 12, 2.5, 17);                  // hoof tucked back
            const haunch = put(camel, new THREE.SphereGeometry(9, 10, 8), hide, s * 11, 9, -20);
            haunch.scale.set(0.55, 0.8, 1.25);
            put(camel, new THREE.SphereGeometry(3.6, 8, 6), hideDark, s * 12, 3, -8);                   // hind knee
        }
        // the neck: forward and low from the chest, then up — a camel's U
        const neck = new THREE.Group();
        neck.position.set(0, 16, 22);
        camel.add(neck);
        const pts = [[0, 0, 0], [0, -1, 10], [0, 3, 19], [0, 13, 25], [0, 25, 27]];
        const rads = [6.4, 5.4, 4.6, 4, 3.6];
        for (let i = 0; i < pts.length - 1; i++) subBeam(neck, hide, new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1]), rads[i], 9);
        for (const p of pts.slice(1)) put(neck, new THREE.SphereGeometry(rads[pts.indexOf(p)], 9, 7), hide, ...p);   // smooth joints
        const head = new THREE.Group();
        head.position.set(0, 25, 27);
        neck.add(head);
        put(head, new THREE.SphereGeometry(5, 10, 8), hide, 0, 1, 1).scale.set(0.85, 0.85, 1.1);
        const muzzle = put(head, new THREE.CapsuleGeometry(3.2, 9, 4, 8), hide, 0, -0.5, 9);
        muzzle.rotation.x = Math.PI / 2 - 0.12;
        const jaw = put(head, gBox(4, 1.8, 9), hideDark, 0, -3.6, 9.5);
        put(head, new THREE.SphereGeometry(1.2, 6, 5), hideDark, 0, 0.6, 14.4).scale.set(1.6, 0.8, 0.6);  // split lip
        for (const s of [-1, 1]) {
            put(head, new THREE.ConeGeometry(1.3, 3.6, 6), hideDark, s * 3.2, 5.2, -0.5, 0, s * 0.6, 0);
            put(head, new THREE.SphereGeometry(0.85, 6, 5), M.black, s * 3.5, 2.6, 4.2);                // heavy-lidded eyes
        }
        // tail
        const tail = new THREE.Group(); tail.position.set(0, 18, -28); camel.add(tail);
        put(tail, gCyl(1.1, 0.6, 16, 5), hideDark, 0, -7, -3).rotation.x = -0.35;
        put(tail, new THREE.SphereGeometry(1.6, 6, 5), hideDark, 0, -14, -5.5).scale.set(1, 2, 1);
        // a hobble rope on the forelegs, and a lead rope to a stake
        put(camel, new THREE.TorusGeometry(3.8, 0.5, 4, 10), M.rope, 0, 4, 26, Math.PI / 2);
        subBeam(camel, M.rope, new THREE.Vector3(0, 40, 30), new THREE.Vector3(-18, 0, 58), 0.35, 4);
        put(camel, gCyl(0.9, 1.2, 9, 5), M.woodPale, -18, 3, 58);
        camel.position.set(L / 2 + 70, 0, D * 0.75);
        camel.rotation.y = -0.5;
        camel.scale.setScalar(1.0);
        g.add(camel);
        // chewing cud (side to side), looking about, the tail flick, breathing
        ch1FX.sway.push({ obj: jaw, axis: 'y', base: 0, amp: 0.22, speed: 4.2, phase: 0 });
        ch1FX.sway.push({ obj: head, axis: 'y', base: 0, amp: 0.3, speed: 0.3, phase: 1 });
        ch1FX.sway.push({ obj: neck, axis: 'y', base: 0, amp: 0.12, speed: 0.22, phase: 2 });
        ch1FX.sway.push({ obj: tail, axis: 'z', base: 0, amp: 0.35, speed: 1.3, phase: 2 });
        ch1FX.sway.push({ obj: body, scale: true, axis: 'y', base: 0.74, amp: 0.015, speed: 1.1, phase: 0 });
        window.ch1Camel = { jaw, head };
        g.userData.h = 76;
        return g;
    },
    ow_bones(o, M, rng) {
        const g = new THREE.Group();
        const bone = new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 0.8 });
        put(g, gCyl(2.4, 2.4, o.w * 0.8, 6), bone, 0, 5, 0, 0, Math.PI / 2 - 0.1);          // spine
        for (let i = 0; i < 9; i++) { // ribs
            const r = put(g, new THREE.TorusGeometry(16 - Math.abs(i - 4) * 1.5, 1.2, 4, 12, Math.PI), bone, -20 + i * 7, 4, 0);
            r.rotation.set(0, Math.PI / 2, Math.PI / 2 + (rng() - 0.5) * 0.3);
        }
        const skull = put(g, gBox(22, 9, 10), bone, o.w * 0.5, 5, 6, 0.4);
        for (let i = 0; i < 4; i++) put(g, gCyl(1.8, 1.4, 34, 5), bone, (rng() - 0.5) * o.w, 2, (rng() - 0.5) * o.h, rng() * 3, Math.PI / 2);
        g.userData.h = 30;
        return g;
    },
    ow_spoil(o, M, rng) {
        const g = new THREE.Group();
        for (let i = 0; i < 9; i++) {
            const r = 40 + rng() * 50, h = 22 + rng() * 26;
            const m = put(g, new THREE.ConeGeometry(r, h, 12, 2), M.sand, (i % 3 - 1) * o.w * 0.34 + (rng() - 0.5) * 30, h / 2 - 5, (Math.floor(i / 3) - 1) * o.h * 0.34 + (rng() - 0.5) * 30);
            m.scale.set(1.2, 1, 0.8);
        }
        g.userData.h = 0;
        return g;
    },
    ow_sieve(o, M, rng) {
        // trestles, a mesh-bottomed frame, a finds tray; ch1_minigames plays it
        const g = new THREE.Group();
        for (const s of [-1, 1]) {
            subBeam(g, M.woodPale, new THREE.Vector3(s * 32, 0, -18), new THREE.Vector3(s * 32, 38, 0), 1.6);
            subBeam(g, M.woodPale, new THREE.Vector3(s * 32, 0, 18), new THREE.Vector3(s * 32, 38, 0), 1.6);
        }
        const frame = new THREE.Group();
        frame.position.set(0, 42, 0);
        for (const [x, z, w, d] of [[0, -22, 76, 4], [0, 22, 76, 4], [-36, 0, 4, 44], [36, 0, 4, 44]]) put(frame, gBox(w, 7, d), M.wood, x, 0, z);
        const mesh = put(frame, new THREE.PlaneGeometry(68, 40), M.chain.clone(), 0, -2, 0);
        mesh.rotation.x = -Math.PI / 2;
        mesh.material.map = M.chain.map.clone(); mesh.material.map.needsUpdate = true; mesh.material.map.repeat.set(9, 5);
        const soil = put(frame, gBox(64, 6, 36), M.sand, 0, 1, 0);
        g.add(frame);
        put(g, gBox(34, 5, 22), M.crate, 60, 24, 20);
        put(g, gCyl(8, 7, 12, 10), M.metal, -58, 6, 22);
        window.ch1Sieve = { group: g, frame, soil, finds: [] };
        g.userData.h = 64;
        return g;
    },
    ow_tea(o, M, rng) {
        const g = new THREE.Group();
        subCrate(g, M, 0, 0, 0, 30, 0.2);
        put(g, gBox(26, 1.4, 18), M.metal, 0, 24.7, 0, 0.2);
        const glassMat = new THREE.MeshStandardMaterial({ color: 0xd8e8f0, transparent: true, opacity: 0.35, roughness: 0.05, side: THREE.DoubleSide });
        const glasses = [];
        for (let i = 0; i < 3; i++) glasses.push(put(g, new THREE.CylinderGeometry(2.6, 2, 7, 10, 1, true), glassMat, -7 + i * 7, 29, 2));
        // the pour: tea column + liquid inside the front glass (scaled by the minigame)
        const tea = new THREE.MeshStandardMaterial({ color: 0x7a3a10, transparent: true, opacity: 0.85, roughness: 0.1 });
        const fill = put(g, gCyl(2.3, 1.9, 1, 10), tea, 0, 25.5, 2);
        fill.scale.y = 0.01;
        const foam = put(g, gCyl(2.4, 2.4, 1, 10), new THREE.MeshStandardMaterial({ color: 0xe8d8b0, roughness: 0.9 }), 0, 26, 2);
        foam.visible = false;
        const stream = put(g, gCyl(0.4, 0.5, 1, 6), tea, 0, 40, 2);
        stream.visible = false;
        const kettle = new THREE.Group();
        put(kettle, new THREE.SphereGeometry(7, 12, 8), M.steel, 0, 0, 0).scale.set(1, 0.8, 1);
        put(kettle, gCyl(1, 1.6, 12, 6), M.steel, 8, 2, 0, 0, -0.9);
        put(kettle, new THREE.TorusGeometry(5, 0.8, 4, 10, Math.PI), M.metalDark, 0, 5, 0);
        kettle.position.set(-16, 40, 2);
        kettle.scale.setScalar(0.62);
        g.add(kettle);
        // the front glass is the one you pour into
        window.ch1Tea = { group: g, glass: glasses[1], fill, foam, stream, kettle };
        g.userData.h = 46;
        return g;
    },
    ow_detector(o, M) {
        // Sam's detector, propped on its coil against a crate
        const g = new THREE.Group();
        subCrate(g, M, 16, 0, -10, 26, 0.3);
        const d = bpMakeDetectorModel(M);
        d.rotation.set(0.32, 0.6, 0.12);
        d.position.set(-6, 0, 6);
        g.add(d);
        g.userData.h = 76;
        return g;
    },
});

// sherds glint; caches are just disturbed sand (you find them by ear)
const _owFlareTex = () => makeTex('c1flare', 128, 128, 1, 1, (cc, w, h) => {
    cc.clearRect(0, 0, w, h);
    for (const [ax, ay] of [[1, 0], [0, 1]]) {
        const g = cc.createLinearGradient(64 - ax * 64, 64 - ay * 64, 64 + ax * 64, 64 + ay * 64);
        g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(0.5, 'rgba(255,240,200,1)'); g.addColorStop(1, 'rgba(255,240,200,0)');
        cc.fillStyle = g;
        if (ax) cc.fillRect(0, 62, w, 4); else cc.fillRect(62, 0, 4, h);
    }
});
const _owGlintTex = () => radialTex('c1glint', [[0, 'rgba(255,250,220,1)'], [0.2, 'rgba(255,220,150,0.5)'], [1, 'rgba(255,200,120,0)']]);
for (let i = 0; i < OW.sherds.length; i++) {
    CH1_BUILDERS['ow_sherd' + i] = (o, M, rng) => {
        // a curved piece of a jar's shoulder, painted in red ochre and
        // black, pushed up out of the sand at an angle
        const g = new THREE.Group();
        const paint = makeTex('c1sherdPaint', 128, 128, 1, 1, (cc, w, h) => {
            cc.fillStyle = '#b8764a'; cc.fillRect(0, 0, w, h);
            speckle(cc, w, h, null, ['#9a5a34', '#d0906a', '#7a4a2a'], 500, 1, 3);
            cc.fillStyle = '#8a2a18'; cc.fillRect(0, 44, w, 18);                 // ochre band
            cc.strokeStyle = '#1a120c'; cc.lineWidth = 4;
            cc.beginPath(); cc.moveTo(0, 40); cc.lineTo(w, 40); cc.stroke();
            cc.beginPath(); cc.moveTo(0, 66); cc.lineTo(w, 66); cc.stroke();
            cc.lineWidth = 3;                                                    // the potter's flick
            for (let x = 8; x < w; x += 26) { cc.beginPath(); cc.moveTo(x, 84); cc.quadraticCurveTo(x + 8, 96, x + 18, 86); cc.stroke(); }
            cc.fillStyle = '#1a120c';
            for (let x = 14; x < w; x += 26) { cc.beginPath(); cc.arc(x, 24, 3, 0, 7); cc.fill(); }
        });
        const mat = new THREE.MeshStandardMaterial({ map: paint, roughness: 0.85, side: THREE.DoubleSide });
        const shard = new THREE.Mesh(new THREE.CylinderGeometry(9, 10.5, 12, 10, 1, true, 0, 1.3), mat);
        shard.rotation.set(1.1, rng() * 6.28, 0.3);
        shard.position.y = 5;
        shard.scale.setScalar(1.8);
        g.add(shard);
        const edge = new THREE.Mesh(new THREE.CylinderGeometry(9.6, 11.1, 12.2, 10, 1, true, 0, 1.3), new THREE.MeshStandardMaterial({ color: 0x9a5a34, side: THREE.BackSide, roughness: 1 }));
        edge.rotation.copy(shard.rotation); edge.position.copy(shard.position); edge.scale.setScalar(1.8);
        g.add(edge);
        // a glint you can catch from a distance: a soft halo and a cross flare
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: _owGlintTex(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false, opacity: 1 }));
        s.scale.set(26, 26, 1); s.position.y = 8;
        s.userData.noShadow = true;
        g.add(s);
        const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: _owFlareTex(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.9, color: 0xffe0a0 }));
        flare.scale.set(40, 40, 1); flare.position.y = 8;
        flare.userData.noShadow = true;
        g.add(flare);
        ch1FX.glows.push({ sprite: s, base: 1, phase: rng() * 10, steady: false });
        ch1FX.sway.push({ obj: flare.material, axis: 'rotation', base: 0, amp: 0.6, speed: 0.7, phase: rng() * 6 });
        g.userData.h = 30;
        return g;
    };
}
for (let i = 0; i < OW.caches.length; i++) {
    CH1_BUILDERS['ow_cache' + i] = (o, M, rng) => {
        const g = new THREE.Group();
        const mound = put(g, new THREE.SphereGeometry(18, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), M.sand, 0, -4, 0);
        mound.scale.y = 0.35;
        g.userData.h = 22;
        return g;
    };
}

// ---- HUD: compass, place names, toasts ----
function owToast(title, sub) {
    const el = document.getElementById('ow-toast');
    if (!el) return;
    el.innerHTML = `<b>${title}</b>${sub ? '<span>' + sub + '</span>' : ''}`;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
}

const OW_MISSIONS = [
    { obj: 'trench',    label: 'East Trench', when: f => !f.eastTrenchResolved },
    { obj: 'carts',     label: 'Supply Line', when: f => !f.cartsResolved },
    { obj: 'generator', label: 'Generator',   when: f => !f.watcherResolved },
    { obj: 'tent_bldg', label: 'Your Tent',   when: f => f.eastTrenchResolved && f.cartsResolved && f.watcherResolved && !f.scene3Triggered },
    { obj: 'puzzle_glyph', label: 'The Seal', when: f => f.scene3Triggered && !f.glyph_lock_solved },
];

let owCompassBuilt = false;
function owUpdateHud() {
    const comp = document.getElementById('ow-compass');
    if (!comp) return;
    const show = currentMapKey === 1 && !interiorState.active && gameState.currentScreen === 'GAME' && !gameState.isPaused && !activePuzzle;
    comp.classList.toggle('hidden', !show);
    if (!show) return;
    const px = player.x + player.size / 2, pz = player.y + player.size / 2;
    const heading = -camYaw * 180 / Math.PI; // 0 = north, + = east
    const span = 200, W = comp.clientWidth || 560;
    const toX = (bearing) => {
        let rel = ((bearing - heading + 540) % 360) - 180;
        return { x: W / 2 + rel / (span / 2) * (W / 2), vis: Math.abs(rel) < span / 2 };
    };
    if (!owCompassBuilt) {
        owCompassBuilt = true;
        const ticks = document.getElementById('ow-ticks');
        for (let a = 0; a < 360; a += 15) {
            const t = document.createElement('i');
            t.dataset.a = a;
            const names = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };
            if (names[a] !== undefined) { t.textContent = names[a]; t.className = a % 90 === 0 ? 'card' : 'inter'; }
            ticks.appendChild(t);
        }
    }
    for (const t of document.querySelectorAll('#ow-ticks i')) {
        const p = toX(Number(t.dataset.a));
        t.style.display = p.vis ? '' : 'none';
        t.style.left = p.x + 'px';
    }
    // mission markers (and the nearest undiscovered place, faintly)
    const marks = document.getElementById('ow-marks');
    const f = gameState.flags;
    let html = '';
    for (const m of OW_MISSIONS) {
        if (!m.when(f)) continue;
        const [x, z] = ch1At(m.obj);
        const b = Math.atan2(x - px, -(z - pz)) * 180 / Math.PI;
        const p = toX(b);
        if (!p.vis) continue;
        const dist = Math.round(Math.hypot(x - px, z - pz) / 32);
        html += `<div class="mk mission" style="left:${p.x}px"><b>◆</b><span>${m.label} · ${dist}m</span></div>`;
    }
    for (const pl of OW.places) {
        if (f['ow_disc_' + pl.id]) continue;
        const [x, z] = pl.at;
        const d = Math.hypot(x - px, z - pz);
        if (d > 2600) continue;
        const b = Math.atan2(x - px, -(z - pz)) * 180 / Math.PI;
        const p = toX(b);
        if (p.vis) html += `<div class="mk place" style="left:${p.x}px"><b>?</b></div>`;
    }
    if (marks.innerHTML !== html) marks.innerHTML = html;

    // discovery: a place name the first time you walk in
    for (const pl of OW.places) {
        if (f['ow_disc_' + pl.id]) continue;
        if (Math.hypot(pl.at[0] - px, pl.at[1] - pz) < pl.r) {
            f['ow_disc_' + pl.id] = true;
            owToast(pl.name, 'Discovered');
        }
    }

    // the metal detector: a tick that quickens near buried things
    const det = document.getElementById('ow-detector');
    OW.detector.strength = 0;
    if (typeof bpEquipped === 'function' && bpEquipped() === 'metal_detector') {
        let best = 1e9;
        OW.caches.forEach((c, i) => { if (!f['ow_cache' + i]) best = Math.min(best, Math.hypot(c.at[0] - px, c.at[1] - pz)); });
        det.classList.remove('hidden');
        const strength = best < 900 ? 1 - best / 900 : 0;
        OW.detector.strength = strength;
        document.getElementById('ow-det-fill').style.width = (strength * 100).toFixed(0) + '%';
        const now = performance.now();
        if (strength > 0 && now > OW.detector.beepAt) {
            if (typeof _tone === 'function') _tone(900 + strength * 700, 0.03, 'square', 0.02 + strength * 0.03);
            OW.detector.beepAt = now + 80 + (1 - strength) * 1100;
        }
    } else det.classList.add('hidden');
}
