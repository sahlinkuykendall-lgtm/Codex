// ============================================================
// TEST: two downloaded characters in front of Miriam's tent (temporary)
//   - left:  "Man in Suit" by Quaternius — stylised low-poly (.glb, own animations)
//   - right: "Remy" from Mixamo — realistic, with Mixamo's Walking animation,
//            walking up and down in front of the tent
// Remove this file (and its <script> tag) once we've chosen a style.
// ============================================================
(function () {
    const objs = mapObjects[1];
    const add = (id, label, x, z) => objs.push({ id, x: x - 26, y: z - 26, w: 52, h: 52, color: '#888', label, interactScene: id, zone: 'open' });
    add('test_lowpoly', 'Test: Low-poly (Quaternius)', 5400, 5150);
    add('test_realistic', 'Test: Realistic (Mixamo)', 5600, 5160);

    CH1_BUILDERS.test_lowpoly = function () {
        const g = new THREE.Group();
        const m = modelSpawn('suitman', { height: 56, clip: 'idle' });
        g.add(m.group);
        // now and then he claps, then goes back to idling
        let t = 0;
        m.onFrame = (dt) => { t += dt; if (t > 9) { t = 0; m.play('clapping'); setTimeout(() => m.play('idle'), 1700); } };
        window.testLowpoly = m;
        g.userData.h = 70;
        return g;
    };
    CH1_BUILDERS.test_realistic = function () {
        const g = new THREE.Group();
        const m = modelSpawn('remy', { height: 57, clip: 'walk' });
        g.add(m.group);
        // walks up and down a short beat in front of the tent, turning at each end
        let x = 0, dir = 1, turning = 0;
        const SPEED = 42, HALF = 75;
        m.onFrame = (dt) => {
            if (turning > 0) {
                turning -= dt;
                m.group.rotation.y += (Math.atan2(dir, 0) - m.group.rotation.y) * Math.min(1, dt * 6);
                return;
            }
            x += dir * SPEED * dt;
            if (Math.abs(x) > HALF) { x = Math.sign(x) * HALF; dir = -dir; turning = 0.5; }
            m.group.position.x = x;
            m.group.rotation.y = Math.atan2(dir, 0);
        };
        window.testRealistic = m;
        g.userData.h = 72;
        return g;
    };
    scene('test_lowpoly', { speaker: 'System', text: `TEST MODEL — "Man in Suit" by Quaternius (stylised low-poly, CC0).\n\n0.7 MB, 11 animations built in: idle, walk, run, sit, clap, jump, punch and more. He's standing idle and claps now and then.`, choices: [{ text: 'OK.', onSelect: end }] });
    scene('test_realistic', { speaker: 'System', text: `TEST MODEL — "Remy" from Mixamo (realistic), with Mixamo's Walking animation.\n\n11 MB with 1024px textures. He's walking a beat in front of the tent — the game moves him; the animation walks in place.`, choices: [{ text: 'OK.', onSelect: end }] });
    builtSignature = null;
})();
