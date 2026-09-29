// ============================================================
// THE CODEX OF GIZA — BOSTA, THE CAMP DOG (ch1_dog.js)
//
// A sandy baladi dog — one ear up, one flopped, a tail curled over her
// back — who arrived at the dig in the back of the post van (bosta = the
// post) and never left. She has a life of her own:
//   - she sleeps by the workers' fire, wakes, wanders the camp (begging
//     at the cooking table, lying at the Rais's feet, sniffing about)
//   - she looks at you when you come near and her tail tells you what
//     she thinks of you
//   - scratch her ears (she flops over for a belly rub), give her dates,
//     teach her to sit and give a paw; win her over and she follows you,
//     trotting along your trail, sitting when you stop, lying down if
//     you stand still long enough
//   - at midnight she barks at the black car, and growls at the woman in
//     black
// Everything is a rigged model animated here; her state lives in
// gameState.story (bosta affinity, following, tricks).
// Loaded after ch1a_story.js.
// ============================================================

const DOG = {
    rig: null, x: 0, z: 0, heading: 0, home: null,
    state: 'sleep', stateT: 0, target: null, speed: 0, phase: 0,
    pose: null, crumbs: [], still: 0, t0: 0, last: 0,
    rollUntil: 0, pawUntil: 0, barkQueue: 0, nextBark: 0, nextGrowl: 0, dreamAt: 0,
};

// ---- the rig ----
function dogBuildRig(M) {
    const fur = new THREE.MeshStandardMaterial({ color: 0xa8682a, roughness: 0.95 });
    const furLight = new THREE.MeshStandardMaterial({ color: 0xd4a468, roughness: 0.95 });
    const furDark = new THREE.MeshStandardMaterial({ color: 0x5a3818, roughness: 0.95 });
    const black = new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: 0.4 });
    const root = new THREE.Group();
    const body = new THREE.Group();
    root.add(body);
    // torso, deep chest, lean belly
    const torso = put(body, new THREE.CapsuleGeometry(5.2, 14, 6, 12), fur, 0, 0, 0);
    torso.rotation.x = Math.PI / 2;
    put(body, new THREE.SphereGeometry(6, 12, 10), fur, 0, 0.2, 6).scale.set(1, 1.08, 1);
    put(body, new THREE.SphereGeometry(5.2, 10, 8), furLight, 0, -2.4, 3).scale.set(0.9, 0.6, 1.5);   // pale belly and chest
    // legs: hip/shoulder pivot → thigh → knee pivot → shin → paw
    const legs = {};
    for (const [key, x, z] of [['fl', -3.4, 7.5], ['fr', 3.4, 7.5], ['hl', -3.4, -7.5], ['hr', 3.4, -7.5]]) {
        const hip = new THREE.Group(); hip.position.set(x, -2, z); body.add(hip);
        const hind = key[0] === 'h';
        put(hip, new THREE.CapsuleGeometry(hind ? 2.8 : 2.2, 5, 4, 8), fur, 0, -4, 0);
        const knee = new THREE.Group(); knee.position.set(0, -8, 0); hip.add(knee);
        put(knee, new THREE.CapsuleGeometry(1.6, 5.5, 4, 8), fur, 0, -3.8, 0);
        put(knee, new THREE.SphereGeometry(1.9, 8, 6), furLight, 0, -7.6, 0.8).scale.set(1, 0.6, 1.3);   // pale socks
        legs[key] = { hip, knee };
    }
    // neck and head
    const neck = new THREE.Group(); neck.position.set(0, 2.5, 9); body.add(neck);
    const nk = put(neck, new THREE.CapsuleGeometry(3.2, 5, 4, 10), fur, 0, 3, 1.5);
    nk.rotation.x = 0.55;
    const head = new THREE.Group(); head.position.set(0, 6.5, 3.5); neck.add(head);
    put(head, new THREE.SphereGeometry(3.9, 12, 10), fur, 0, 0, 0).scale.set(1, 0.95, 1.05);
    const snout = put(head, new THREE.CapsuleGeometry(1.8, 3.4, 4, 8), furLight, 0, -1.2, 4.2);
    snout.rotation.x = Math.PI / 2 - 0.12;
    put(head, new THREE.SphereGeometry(1.05, 8, 6), black, 0, -0.8, 7.2);                             // nose
    const jaw = new THREE.Group(); jaw.position.set(0, -2.4, 2); head.add(jaw);
    put(jaw, gBox(2.6, 0.8, 4.4), furLight, 0, 0, 2.2);
    const tongue = put(jaw, gBox(1.6, 0.4, 3.2), new THREE.MeshStandardMaterial({ color: 0xd06070, roughness: 0.5 }), 0, 0.1, 3.8);
    tongue.visible = false;
    for (const s of [-1, 1]) {
        put(head, new THREE.SphereGeometry(0.62, 8, 6), black, s * 1.9, 1, 3).scale.set(1, 1.1, 0.6);  // eyes
        put(head, new THREE.SphereGeometry(0.16, 5, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), s * 2.05, 1.25, 3.4);
    }
    // ears: the left stands up, the right one has never stood up in its life
    const earL = new THREE.Group(); earL.position.set(-2.1, 3.2, -0.4); head.add(earL);
    const eL = put(earL, new THREE.ConeGeometry(1.4, 4, 6), furDark, 0, 1.8, 0); eL.scale.z = 0.45;
    const earR = new THREE.Group(); earR.position.set(2.1, 3.2, -0.4); head.add(earR);
    const eR = put(earR, new THREE.ConeGeometry(1.4, 4, 6), furDark, 0, 1.8, 0); eR.scale.z = 0.45;
    earL.rotation.z = 0.15; earR.rotation.set(0.3, 0, -1.7);
    // tail: three segments, curled up over the back like every baladi dog's
    const tail = new THREE.Group(); tail.position.set(0, 2.5, -9); body.add(tail);
    let seg = tail;
    const tailSegs = [];
    for (let i = 0; i < 3; i++) {
        const s = new THREE.Group(); s.position.set(0, i ? 3.2 : 0, 0); seg.add(s);
        put(s, new THREE.CapsuleGeometry(1.1 - i * 0.2, 2.4, 4, 6), i === 2 ? furLight : fur, 0, 1.6, 0);
        s.rotation.x = -0.55; tailSegs.push(s); seg = s;
    }
    root.traverse(m => { if (m.isMesh) m.castShadow = true; });
    root.userData = { body, legs, neck, head, jaw, tongue, earL, earR, tail, tailSegs };
    return root;
}

// pose parameters (hip/knee: forward-swing angles; pitch: front up)
const DOG_POSES = {
    stand: { y: 17, pitch: 0, roll: 0, fh: 0, fk: 0, hh: 0, hk: 0, neck: 0, head: -0.1 },
    sit:   { y: 12.5, pitch: 0.5, roll: 0, fh: -0.5, fk: 0, hh: 1.55, hk: -2.7, neck: 0.15, head: -0.35 },
    lie:   { y: 6.5, pitch: 0, roll: 0, fh: 1.45, fk: 0.1, hh: 1.55, hk: -2.85, neck: -0.1, head: 0.05 },
    sleep: { y: 5.8, pitch: 0, roll: 1.35, fh: 0.7, fk: -0.9, hh: 0.9, hk: -1.3, neck: -0.45, head: 0.3 },
    roll:  { y: 6.8, pitch: 0, roll: 2.95, fh: 0.8, fk: -1.1, hh: 0.8, hk: -1.2, neck: 0.1, head: -0.2 },
};

function dogApplyPose(dt, moving, t) {
    const R = DOG.rig && DOG.rig.userData;
    if (!R) return;
    const want = DOG_POSES[DOG.poseName] || DOG_POSES.stand;
    if (!DOG.pose) DOG.pose = Object.assign({}, want);
    const k = 1 - Math.exp(-dt * 5);
    for (const key in want) DOG.pose[key] += (want[key] - DOG.pose[key]) * k;
    const P = DOG.pose;
    // the trot: diagonal pairs swing together
    const amp = moving ? Math.min(0.75, 0.3 + DOG.speed / 350) : 0;
    const ph = DOG.phase;
    const swing = (o) => Math.sin(ph + o) * amp;
    const lift = (o) => -Math.max(0, Math.cos(ph + o)) * amp * 1.3;
    const set = (leg, hip, knee) => { R.legs[leg].hip.rotation.x = -hip; R.legs[leg].knee.rotation.x = -knee; };
    set('fl', P.fh + swing(0), P.fk + lift(0));
    set('hr', P.hh + swing(0), P.hk - lift(0) * 0.6);
    set('fr', P.fh + swing(Math.PI), P.fk + lift(Math.PI));
    set('hl', P.hh + swing(Math.PI), P.hk - lift(Math.PI) * 0.6);
    // a paw offered
    if (performance.now() < DOG.pawUntil) R.legs.fr.hip.rotation.x = -1.3 - Math.sin(t * 6) * 0.1;
    // sleeping dogs dream: paddling paws
    if (DOG.poseName === 'sleep' && t < DOG.dreamUntil) {
        for (const l of ['fl', 'fr']) R.legs[l].hip.rotation.x += Math.sin(t * 14 + (l === 'fr' ? 1.5 : 0)) * 0.25;
    }
    const bob = moving ? Math.abs(Math.sin(ph)) * amp * 1.2 : Math.sin(t * 1.6) * 0.15;
    R.body.position.y = P.y + bob;
    R.body.rotation.set(-P.pitch, 0, P.roll);
    // breathing (fast when she's been running)
    const br = 1 + Math.sin(t * (DOG.pant > 0 ? 9 : 2.2)) * (DOG.pant > 0 ? 0.03 : 0.015);
    R.body.scale.set(br, br, 1);
    // head: look at you when awake and you're near
    let look = 0, lookUp = 0;
    const px = player.x + player.size / 2, pz = player.y + player.size / 2;
    const dx = px - DOG.x, dz = pz - DOG.z, d = Math.hypot(dx, dz);
    if (DOG.poseName !== 'sleep' && DOG.poseName !== 'roll' && d < 500) {
        look = Math.max(-0.9, Math.min(0.9, angleDiff(Math.atan2(dx, dz), DOG.heading)));
        lookUp = Math.min(0.35, 60 / Math.max(60, d));
    }
    if (DOG.sniff > 0 && !moving) lookUp = -0.9;
    R.neck.rotation.x = -(P.neck + lookUp * 0.5 + (DOG.sniff > 0 ? -0.6 : 0));
    R.head.rotation.y += (look - R.head.rotation.y) * k;
    R.head.rotation.x = -(P.head + lookUp * 0.5);
    // mouth: panting open, tongue out
    const panting = DOG.pant > 0 && DOG.poseName !== 'sleep';
    R.tongue.visible = panting;
    R.jaw.rotation.x = panting ? 0.35 + Math.sin(t * 9) * 0.08 : (DOG.barkMouth > t ? 0.5 : 0);
    // ears: the good one pricks up at you; both twitch
    R.earL.rotation.z = 0.15 + (d < 300 && DOG.poseName !== 'sleep' ? -0.1 : 0.2) + (Math.random() < 0.004 ? 0.4 : 0);
    // tail: curled; wagging by mood
    const wag = DOG.poseName === 'sleep' ? 0 : (DOG.happy || 0);
    R.tail.rotation.y = Math.sin(t * (6 + wag * 10)) * (0.1 + wag * 0.55);
    R.tail.rotation.x = DOG.poseName === 'sleep' ? 0.6 : (DOG.growling ? 0.9 : -0.25);
}

// ---- sounds ----
function dogVol(maxD) {
    const d = Math.hypot(player.x + player.size / 2 - DOG.x, player.y + player.size / 2 - DOG.z);
    const s = (typeof getSettings === 'function') ? getSettings() : {};
    return Math.max(0, 1 - d / (maxD || 2400)) * (s.ambienceVol != null ? s.ambienceVol : 0.8);
}
function dogBark(n) {
    if (typeof _getAudio !== 'function' || typeof AMB === 'undefined' || !AMB.unlocked) return;
    const v = dogVol(3000);
    if (v <= 0.01) return;
    const ctx = _getAudio(), out = typeof _audioOut === 'function' ? _audioOut() : ctx.destination;
    const t0 = ctx.currentTime;
    for (let i = 0; i < (n || 2); i++) {
        const t = t0 + i * (0.2 + Math.random() * 0.1);
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(420 + Math.random() * 60, t);
        o.frequency.exponentialRampToValueAtTime(210, t + 0.11);
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 1.4;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16 * v, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(t); o.stop(t + 0.18);
        // the breathy edge of a woof
        const nsrc = ctx.createBufferSource(); nsrc.buffer = _getNoiseBuf();
        const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 1400; nf.Q.value = 0.9;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.06 * v, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        nsrc.connect(nf); nf.connect(ng); ng.connect(out);
        nsrc.start(t); nsrc.stop(t + 0.12);
    }
    DOG.barkMouth = performance.now() / 1000 + 0.3 * (n || 2);
}
function dogGrowl() {
    if (typeof _getAudio !== 'function' || typeof AMB === 'undefined' || !AMB.unlocked) return;
    const v = dogVol(1200);
    if (v <= 0.01) return;
    const ctx = _getAudio(), out = typeof _audioOut === 'function' ? _audioOut() : ctx.destination;
    const t = ctx.currentTime, dur = 0.9 + Math.random() * 0.5;
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 88 + Math.random() * 10;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 23;
    const lg = ctx.createGain(); lg.gain.value = 0.5;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.1 * v, t + 0.15); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    lfo.connect(lg); lg.connect(g.gain);
    o.connect(f); f.connect(g); g.connect(out);
    o.start(t); lfo.start(t); o.stop(t + dur); lfo.stop(t + dur);
}
function dogWhimper() {
    if (typeof _getAudio !== 'function' || typeof AMB === 'undefined' || !AMB.unlocked) return;
    const v = dogVol(900);
    if (v <= 0.01) return;
    const ctx = _getAudio(), out = typeof _audioOut === 'function' ? _audioOut() : ctx.destination;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(1100, t); o.frequency.linearRampToValueAtTime(1500, t + 0.18); o.frequency.linearRampToValueAtTime(1250, t + 0.32);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.035 * v, t + 0.04); g.gain.linearRampToValueAtTime(0.0001, t + 0.34);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.36);
}

// ---- where she likes to be ----
function dogSpots() {
    const at = (id, dx, dz) => { const [x, z] = ch1At(id); return [x + dx, z + dz]; };
    return [
        DOG.home,
        at('fl_cooking', 0, 70),         // begging at the cooking table
        at('tariq_talk', 30, 55),        // at the Rais's feet
        at('ow_tea', 30, 60),            // by the kettle (Saber drops things)
        at('dorm_door', 0, 70),
        at('water_barrels', 0, 90),
    ];
}

function dogSetState(s) { DOG.state = s; DOG.stateT = 0; }
function dogFollowing() { return storyOn() && !!sflag('dog_follow'); }

// ---- the brain ----
function dogUpdate() {
    if (!DOG.rig || !DOG.rig.parent) return;
    const now = performance.now() / 1000;
    const dt = Math.min(0.1, DOG.last ? now - DOG.last : 0.016);
    DOG.last = now;
    if (currentMapKey !== 1 || interiorState.active) return;
    const t = now;
    DOG.stateT += dt;
    const px = player.x + player.size / 2, pz = player.y + player.size / 2;
    const dP = Math.hypot(px - DOG.x, pz - DOG.z);
    const busy = gameState.isDialogueActive || gameState.isPaused || activePuzzle;
    let moving = false, goal = null, spd = 0;
    DOG.happy = storyOn() ? Math.max(0.15, Math.min(1, 0.2 + (relGet('bosta') || 0) / 40)) : 0.3;
    if (DOG.pant > 0) DOG.pant -= dt;
    if (DOG.sniff > 0) DOG.sniff -= dt;

    // midnight: the black car and the woman in black
    const ev = storyOn() ? sflag('lena_event') : null;
    DOG.growling = false;
    if (ev === 'coming' || ev === 'searching') {
        const [tx, tz] = ev === 'coming' ? [ministeryCar.x + ministeryCar.w / 2, ministeryCar.y + ministeryCar.h / 2] : ch1At('tent_bldg');
        const dT = Math.hypot(tx - DOG.x, tz - DOG.z);
        if (dT < 3500 && now > DOG.nextBark) {
            DOG.heading += angleDiff(Math.atan2(tx - DOG.x, tz - DOG.z), DOG.heading) * 0.5;
            if (DOG.poseName === 'sleep' || DOG.poseName === 'lie') DOG.poseName = 'stand';
            dogBark(2 + (Math.random() * 2 | 0));
            DOG.nextBark = now + 2.5 + Math.random() * 3;
        }
        if (ev === 'searching' && dT < 700 && now > DOG.nextGrowl) { dogGrowl(); DOG.nextGrowl = now + 2 + Math.random() * 2; }
        DOG.growling = ev === 'searching' && dT < 700;
    }

    if (now < DOG.rollUntil) {
        DOG.poseName = 'roll';
    } else if (dogFollowing()) {
        // breadcrumbs: she follows the way you walked, so she never cuts through a wall
        const lc = DOG.crumbs[DOG.crumbs.length - 1];
        if (!lc || Math.hypot(lc[0] - px, lc[1] - pz) > 40) DOG.crumbs.push([px, pz]);
        if (DOG.crumbs.length > 120) DOG.crumbs.shift();
        if (dP > 2600) {   // left far behind (a jog across the map): she catches up out of sight
            const back = DOG.crumbs.length > 4 ? DOG.crumbs[DOG.crumbs.length - 4] : [px, pz + 120];
            DOG.x = back[0]; DOG.z = back[1]; DOG.crumbs = [];
        }
        while (DOG.crumbs.length && Math.hypot(DOG.crumbs[0][0] - DOG.x, DOG.crumbs[0][1] - DOG.z) < 28) DOG.crumbs.shift();
        if (dP > 95 && !busy) {
            goal = DOG.crumbs.length ? DOG.crumbs[0] : [px, pz];
            spd = Math.max(70, Math.min(330, (dP - 70) * 1.6));
            DOG.still = 0;
            if (spd > 200) DOG.pant = 4;
        } else {
            DOG.still += dt;
            DOG.crumbs = DOG.crumbs.filter(c => Math.hypot(c[0] - px, c[1] - pz) > 95);
            DOG.poseName = DOG.still > 14 ? 'lie' : DOG.still > 1.2 ? 'sit' : 'stand';
            DOG.heading += angleDiff(Math.atan2(px - DOG.x, pz - DOG.z), DOG.heading) * Math.min(1, dt * 3);
        }
    } else {
        // her own life: sleep by the fire, then wander, then back to sleep
        if (DOG.state === 'sleep') {
            DOG.poseName = 'sleep';
            if (t > DOG.dreamAt) { DOG.dreamUntil = t + 1.5; DOG.dreamAt = t + 8 + Math.random() * 14; }
            if (DOG.stateT > 55 || (dP < 90 && DOG.stateT > 3 && Math.random() < dt * 0.4)) { dogSetState('wake'); }
        } else if (DOG.state === 'wake') {
            DOG.poseName = DOG.stateT < 1.5 ? 'lie' : 'stand';
            if (DOG.stateT > 3) { dogSetState('wander'); DOG.target = null; }
        } else if (DOG.state === 'wander') {
            if (!DOG.target) {
                const spots = dogSpots();
                DOG.target = spots[(Math.random() * spots.length) | 0];
                DOG.visits = (DOG.visits || 0) + 1;
            }
            const dT = Math.hypot(DOG.target[0] - DOG.x, DOG.target[1] - DOG.z);
            if (dT > 20) { goal = DOG.target; spd = 85; if (Math.random() < dt * 0.4) DOG.sniff = 1.2; }
            else { dogSetState('idle'); DOG.idleFor = 6 + Math.random() * 14; }
        } else if (DOG.state === 'idle') {
            DOG.poseName = DOG.stateT > DOG.idleFor * 0.5 ? 'lie' : (DOG.stateT > 2 ? 'sit' : 'stand');
            if (DOG.stateT > DOG.idleFor) {
                if ((DOG.visits || 0) > 4) { DOG.target = DOG.home; DOG.visits = 0; dogSetState('home'); }
                else { dogSetState('wander'); DOG.target = null; }
            }
        } else if (DOG.state === 'home') {
            const dT = Math.hypot(DOG.home[0] - DOG.x, DOG.home[1] - DOG.z);
            if (dT > 20) { goal = DOG.home; spd = 80; }
            else { dogSetState('sleep'); }
        }
        // she comes over to say hello if she likes you
        if (storyOn() && !busy && DOG.state !== 'sleep' && dP < 380 && dP > 80 && (relGet('bosta') || 0) >= 10 && Math.random() < dt * 0.05) {
            DOG.target = [px, pz]; dogSetState('wander'); dogWhimper();
        }
    }

    if (goal && !busy) {
        const dx = goal[0] - DOG.x, dz = goal[1] - DOG.z, d = Math.hypot(dx, dz);
        const want = Math.atan2(dx, dz);
        DOG.heading += angleDiff(want, DOG.heading) * Math.min(1, dt * 6);
        DOG.speed += (spd - DOG.speed) * Math.min(1, dt * 4);
        const step = Math.min(d, DOG.speed * dt);
        DOG.x += Math.sin(DOG.heading) * step; DOG.z += Math.cos(DOG.heading) * step;
        moving = step > 0.05;
        DOG.poseName = 'stand';
    } else DOG.speed *= 0.8;
    if (moving) DOG.phase += DOG.speed * dt * 0.16;

    // place her
    const gy = (typeof ch1MeshHeight === 'function' ? ch1MeshHeight(DOG.x, DOG.z) : currentGroundHeight(DOG.x, DOG.z));
    DOG.rig.position.set(DOG.x, gy, DOG.z);
    DOG.rig.rotation.y = DOG.heading;
    dogApplyPose(dt, moving, t);
    // her interaction box and label follow her
    const o = DOG.obj;
    if (o) { o.x = DOG.x - o.w / 2; o.y = DOG.z - o.h / 2; }
    const e = DOG.entry && DOG.entry.mesh === DOG.rig ? DOG.entry : (DOG.entry = objectEntries.find(q => q.o === o));
    if (e && e.label) e.label.position.set(DOG.x, gy + 42, DOG.z);
}

// ---- hook her into the world ----
(function () {
    const o = mapObjects[1].find(q => q.id === 'camp_dog');
    if (!o) return;
    DOG.obj = o;
    o.label = 'Bosta';
    o.modelLabel = 'camp dog';
    if (!DOG.home) { DOG.home = [o.x + o.w / 2, o.y + o.h / 2]; DOG.x = DOG.home[0]; DOG.z = DOG.home[1]; DOG.heading = -0.6; }
    DOG.poseName = 'sleep';
    CH1_BUILDERS.camp_dog = function () {
        DOG.rig = dogBuildRig(ch1Mats());
        DOG.entry = null; DOG.pose = null;
        DOG.rig.userData.h = 30;
        // a fresh world: if she was following you, she's at your heels
        if (dogFollowing() && typeof player !== 'undefined' && gameState.currentScreen === 'GAME') {
            DOG.x = player.x + player.size / 2 + 40; DOG.z = player.y + player.size / 2 + 60; DOG.crumbs = [];
        }
        return DOG.rig;
    };
    const _ow = owUpdateHud;
    owUpdateHud = function () { _ow(); try { dogUpdate(); } catch (err) { console.warn('dog', err); } };
    if (typeof REL_NAMES !== 'undefined') REL_NAMES.bosta = 'Bosta';
    builtSignature = null;
})();
// keep her moving on the title screen too (she's part of the vista)
(function () {
    const _upd = typeof updateCh1FX === 'function' ? updateCh1FX : null;
    if (!_upd) return;
    updateCh1FX = function () { const r = _upd.apply(this, arguments); if (gameState.currentScreen !== 'GAME') { try { dogUpdate(); } catch (e) { /* */ } } return r; };
})();

// ---- talking to her ----
scene('fun_dog', {
    speaker: 'Bosta',
    text: () => {
        const a = relGet('bosta') || 0;
        if (DOG.poseName === 'sleep') return `The camp dog, asleep by the fire, one paw running in a dream. A sandy baladi bitch — one ear up, one ear flopped over for good, a tail that curls over her back.\n\nThe men call her Bosta: she arrived in the back of the post van three winters ago and got out as if she'd been delivered.`;
        if (dogFollowing()) return a >= 30 ? `Bosta sits at your feet and looks up at you like you personally invented dates.` : `Bosta looks up at you, tail going. She's decided you're hers, apparently.`;
        if (a >= 10) return `Bosta trots over, leans her whole weight against your leg and looks up. The good ear stands straight up.`;
        return `Bosta watches you with polite, professional interest. She has met a lot of archaeologists. Her tail moves, once.`;
    },
    get choices() {
        const c = [];
        const sleeping = DOG.poseName === 'sleep';
        if (sleeping) c.push({ text: 'Crouch down and let her wake up.', onSelect: () => { dogSetState('wake'); rel('bosta', 2, true); DOG.last = 0; startDialogue('dog_woke'); } });
        else {
            c.push({ text: 'Scratch behind the floppy ear.', onSelect: () => { rel('bosta', 3, true); DOG.rollUntil = performance.now() / 1000 + 4; startDialogue('dog_scratch'); } });
            if (typeof bpHas === 'function' && bpHas('dates')) c.push({ text: 'Give her a date.', onSelect: () => {
                bpRemove('dates', 1); rel('bosta', 8, true); DOG.pant = 3;
                if (!dogFollowing() && relGet('bosta') >= 14) { sflag('dog_follow', true); storyNotice('Bosta will remember that.'); startDialogue('dog_adopted'); }
                else startDialogue('dog_date');
            } });
            if (!dogFollowing() && relGet('bosta') >= 8) c.push({ text: '"Come on, Bosta. Yalla."', onSelect: () => { sflag('dog_follow', true); DOG.crumbs = []; startDialogue('dog_come'); } });
            if (dogFollowing()) c.push({ text: '"Stay, Bosta. Stay here."', onSelect: () => { sflag('dog_follow', false); dogSetState('home'); DOG.target = DOG.home; startDialogue('dog_stay'); } });
            c.push({ text: '"Sit."', onSelect: () => {
                const n = (sflag('dog_sits') || 0) + 1; sflag('dog_sits', n);
                DOG.poseName = 'sit'; DOG.still = 5; if (DOG.state !== 'sleep') { dogSetState('idle'); DOG.idleFor = 12; }
                if (n >= 3 && !sflag('dog_paw')) { sflag('dog_paw', true); rel('bosta', 5, true); }
                if (sflag('dog_paw')) DOG.pawUntil = performance.now() + 2500;
                startDialogue(sflag('dog_paw') ? (n === 3 ? 'dog_paw_new' : 'dog_paw') : 'dog_sit');
            } });
        }
        c.push({ text: 'Leave her be.', onSelect: end });
        return c;
    },
});
scene('dog_woke', { speaker: 'Bosta', text: `One eye opens. Then the other. She considers you, sighs through her nose, and stretches — front paws out, rump in the air — as if she'd been planning to get up anyway.`, choices: [{ text: 'Laugh.', onSelect: end }] });
scene('dog_scratch', { speaker: 'Bosta', text: `You find the spot. Her eyes close, a back leg starts thumping the sand, and then she simply falls over sideways and presents her belly with total confidence.`, choices: [{ text: 'Obviously you rub the belly.', onSelect: end }] });
scene('dog_date', { speaker: 'Bosta', text: `The date vanishes. She didn't appear to chew. She looks at your pocket, then at you, then at your pocket again, with enormous meaning.`, choices: [{ text: '"That\'s all. For now."', onSelect: end }] });
scene('dog_adopted', { speaker: 'Bosta', text: `The date vanishes. Then Bosta does something she apparently has never done for anyone on this site: she walks round behind you, sits down at your heel, and waits for you to go somewhere.\n\nSaber, at the kettle, stares. "She doesn't do that," he says. "She doesn't do that for the Rais."\n\n(Bosta follows you now. Tell her to stay whenever you like.)`, choices: [{ text: '"Yalla, then."', onSelect: end }] });
scene('dog_come', { speaker: 'Bosta', text: `Her ear goes up. She's at your heel before you've finished saying it.`, choices: [{ text: 'Walk on.', onSelect: end }] });
scene('dog_stay', { speaker: 'Bosta', text: `She looks at you as if you've said something very disappointing, and trots back to the fire. She'll be there.`, choices: [{ text: '"Good girl."', onSelect: end }] });
scene('dog_sit', { speaker: 'Bosta', text: () => `She sits. Promptly, beautifully, and looks at your hand in case the sitting has produced a date.` + ((sflag('dog_sits') || 0) === 2 ? `\n\nShe's getting the idea.` : ''), choices: [{ text: '"Good girl."', onSelect: end }] });
scene('dog_paw_new', { speaker: 'Bosta', text: `She sits — and then, entirely unasked, lifts one front paw and puts it in your hand, very gravely, like a diplomat.\n\nSomewhere behind you one of the workmen says "Ya salaam!" and within a minute the whole camp knows.`, choices: [{ text: 'Shake it.', onSelect: end }] });
scene('dog_paw', { speaker: 'Bosta', text: `Sit, paw, a look of complete professionalism. She has clearly been practising.`, choices: [{ text: 'Shake it.', onSelect: end }] });

// when the woman in black is confronted, Bosta has an opinion
(function () {
    const def = storyData['c1a_lena_confront'];
    if (!def || typeof def.text !== 'function') return;
    const base = def.text;
    def.text = () => base() + (dogFollowing() && Math.hypot(DOG.x - (player.x + player.size / 2), DOG.z - (player.y + player.size / 2)) < 400
        ? `\n\nAt your heel, every hair on Bosta's back is standing up, and she is making a sound like an engine that doesn't want to start. The woman looks at the dog, not at you, for a long moment.`
        : '');
})();
