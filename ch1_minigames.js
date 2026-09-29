// ============================================================
// THE CODEX OF GIZA — CHAPTER 1 MINIGAMES IN 3D (ch1_minigames.js)
//
// The 3D build plays Chapter 1's two minigames in the world instead of
// on a flat 2D card. The rules, flags, records, sounds and story scenes
// are the ones in engine.js (PUZZLES / handlePuzzleClick); this file
// only changes how you see and play them.
//
//   THE TUNNEL GATE SEAL — the camera steps up to the stela. Move the
//   mouse over the real glyph stones and click to press them. The
//   resonance is the ring of beads round the seal. A wrong stone fires
//   the trap dart from the rock and the stones grind to new places.
//
//   CAMP DARTS — first person at the throwing line. Mouse aims; your
//   hand sways with your breath. Hold the left button to steady (don't
//   hold too long), release to throw. Darts fly and stick in the board.
//
// Loaded after ch1_props.js, before engine3d.js. engine3d.js calls
// mgUpdate() once a frame and mgDrivesCamera() before placing the
// camera; engine.js forwards pointer presses via puzzle3dPointerDown().
// ============================================================

const MG = {
    mode: null,        // null | 'seal' | 'darts'
    puzzle: null,      // the activePuzzle object this session belongs to
    blend: 0,          // camera blend 0 → 1 into the minigame framing
    from: null,        // { pos, quat } camera pose when we started
    exitBlend: 1,      // after leaving: blend back from the minigame pose
    exitFrom: null,
    mouse: { x: 0, y: 0, inside: false },
    hover: -1,
    dart: null,        // darts: in-hand / in-flight state
    popups: [],
    trap: null,        // seal: the fired trap dart animation
    shake: 0,
    savedYaw: 0, savedPitch: 0,
};

const mgEl = (id) => document.getElementById(id);
const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function mgWantsMode() {
    if (!activePuzzle || currentMapKey !== 1 || interiorState.active) return null;
    const type = activePuzzle.def.type;
    if (type === 'glyphseal' && window.ch1Seal) return 'seal';
    if (type === 'darts' && window.ch1Darts) return 'darts';
    if (type === 'tea' && window.ch1Tea) return 'tea';
    if (type === 'sieve' && window.ch1Sieve) return 'sieve';
    return null;
}

// True while a 3D minigame owns the screen (engine3d skips drawPuzzle)
function mgHandlesPuzzle() { return !!MG.mode; }

// Darts wants the mouse captured (FPS aim); the seal wants a free cursor
function mgWantsPointerLock() { return MG.mode === 'darts' && MG.puzzle && MG.puzzle.stage !== 'done'; }

// ---- ENTER / EXIT ----
function mgEnter(mode) {
    MG.mode = mode;
    MG.puzzle = activePuzzle;
    MG.blend = 0;
    MG.from = { pos: cam3.position.clone(), quat: cam3.quaternion.clone() };
    MG.savedYaw = camYaw; MG.savedPitch = camPitch;
    MG.hover = -1;
    MG.popups = [];
    MG.trap = null;
    MG.shake = 0;
    mgEl('mg-hud').classList.remove('hidden');
    document.getElementById('game-container').classList.add('in-minigame');
    mgEl('mg-hud').dataset.mode = mode;
    mgEl('mg-result').classList.add('hidden');
    if (mode === 'darts') {
        // aim starts dead on the board
        camYaw = 0; camPitch = 0;
        MG.aimYaw = 0; MG.aimPitch = 0;
        MG.dart = { state: 'ready', hold: 0, t: 0 };
        for (const d of window.ch1Darts.holstered) d.visible = false;
        mgClearStuckDarts();
        mgEl('mg-again').firstChild.textContent = 'THROW AGAIN ';
        MG.hand = ch1MakeDart(ch1Mats());
        scene3.add(MG.hand);
        mgEl('mg-title').textContent = 'CAMP DARTS';
        mgEl('mg-hint').textContent = 'Three darts. The chalk on the plank says RAIS — 132.';
        mgEl('mg-keys').innerHTML = '<span class="key">MOUSE</span> AIM &nbsp; <span class="key">HOLD LMB</span> STEADY &nbsp; <span class="key">RELEASE</span> THROW &nbsp; <span class="key">ESC</span> WALK AWAY';
        if (document.pointerLockElement !== glCanvas) { try { glCanvas.requestPointerLock(); } catch (e) { /* needs a click */ } }
    } else if (mode === 'tea') {
        mgTeaEnter();
    } else if (mode === 'sieve') {
        mgSieveEnter();
    } else {
        mgEl('mg-title').textContent = MG.puzzle.def.title;
        mgEl('mg-hint').textContent = MG.puzzle.def.hint;
        mgEl('mg-keys').innerHTML = '<span class="key">MOUSE</span> CHOOSE A STONE &nbsp; <span class="key">CLICK</span> PRESS &nbsp; <span class="key">1–4</span> TOP · RIGHT · BOTTOM · LEFT &nbsp; <span class="key">ESC</span> STEP BACK';
    }
}

function mgExit() {
    MG.exitFrom = { pos: cam3.position.clone(), quat: cam3.quaternion.clone() };
    MG.exitBlend = 0;
    if (MG.mode === 'darts') {
        camYaw = MG.savedYaw; camPitch = MG.savedPitch;
        if (MG.hand) { scene3.remove(MG.hand); MG.hand = null; }
        mgClearStuckDarts();
        if (window.ch1Darts) for (const d of window.ch1Darts.holstered) d.visible = true;
    } else {
        camYaw = MG.savedYaw; camPitch = MG.savedPitch;
    }
    if (MG.mode === 'tea' && window.ch1Tea) {
        const T = window.ch1Tea;
        T.fill.scale.y = 0.01; T.foam.visible = false; T.stream.visible = false;
        T.kettle.position.set(-16, 40, 2); T.kettle.rotation.z = 0;
    }
    if (MG.mode === 'sieve' && window.ch1Sieve) {
        for (const f of window.ch1Sieve.finds) f.mesh.parent && f.mesh.parent.remove(f.mesh);
        window.ch1Sieve.finds = [];
        window.ch1Sieve.frame.position.x = 0;
    }
    for (const p of MG.popups) p.sprite.parent && p.sprite.parent.remove(p.sprite);
    MG.popups = [];
    if (MG.trap && MG.trap.mesh.parent && MG.trap.state === 'flying') MG.trap.mesh.parent.remove(MG.trap.mesh);
    MG.mode = null;
    MG.puzzle = null;
    mgEl('mg-hud').classList.add('hidden');
    document.getElementById('game-container').classList.remove('in-minigame');
    glCanvas.style.cursor = '';
}

function mgClearStuckDarts() {
    const D = window.ch1Darts;
    if (!D) return;
    for (const d of D.stuck) d.parent && d.parent.remove(d);
    D.stuck = [];
}

// ---- CAMERA ----
// Returns true when the minigame placed the camera this frame
function mgDrivesCamera() {
    if (!MG.mode) return false;
    const target = MG.mode === 'seal' ? mgSealCamera() : MG.mode === 'tea' ? mgTeaCamera()
        : MG.mode === 'sieve' ? mgSieveCamera() : mgDartsCamera();
    MG.blend = Math.min(1, MG.blend + 1 / 40);
    const k = easeInOut(MG.blend);
    cam3.position.lerpVectors(MG.from.pos, target.pos, k);
    cam3.quaternion.slerpQuaternions(MG.from.quat, target.quat, k);
    if (MG.shake > 0) {
        cam3.position.x += (Math.random() - 0.5) * MG.shake;
        cam3.position.y += (Math.random() - 0.5) * MG.shake;
        MG.shake *= 0.88;
        if (MG.shake < 0.05) MG.shake = 0;
    }
    return true;
}

// After leaving a minigame, ease the normal camera back in
function mgAfterCamera() {
    if (MG.mode || MG.exitBlend >= 1 || !MG.exitFrom) return;
    MG.exitBlend = Math.min(1, MG.exitBlend + 1 / 30);
    const k = easeInOut(MG.exitBlend);
    const pos = cam3.position.clone(), quat = cam3.quaternion.clone();
    cam3.position.lerpVectors(MG.exitFrom.pos, pos, k);
    cam3.quaternion.slerpQuaternions(MG.exitFrom.quat, quat, k);
}

const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _e = new THREE.Euler(0, 0, 0, 'YXZ');

function mgSealCamera() {
    const S = window.ch1Seal;
    S.seal.updateWorldMatrix(true, false);
    const c = S.seal.getWorldPosition(new THREE.Vector3());
    const pos = new THREE.Vector3(c.x, c.y - 4, c.z + 70);
    // a slow, living drift so it doesn't feel like a static screen
    const t = performance.now() / 1000;
    pos.x += Math.sin(t * 0.4) * 1.2; pos.y += Math.sin(t * 0.55) * 0.8;
    const m = new THREE.Matrix4().lookAt(pos, c.clone().add(new THREE.Vector3(0, -2, 0)), new THREE.Vector3(0, 1, 0));
    return { pos, quat: new THREE.Quaternion().setFromRotationMatrix(m) };
}

function mgDartsCamera() {
    const D = window.ch1Darts;
    D.group.updateWorldMatrix(true, false);
    const c = D.center.clone().applyMatrix4(D.group.matrixWorld);
    const pos = new THREE.Vector3(c.x + 4, c.y - 2, c.z + 80);
    // aim: the mouse moves camYaw/camPitch (engine3d mouse look), held
    // to a cone around the board, plus the hand's breathing sway
    camYaw = Math.max(-0.32, Math.min(0.32, camYaw));
    camPitch = Math.max(-0.26, Math.min(0.26, camPitch));
    const sw = mgSway();
    MG.aimYaw = camYaw + sw.x;
    MG.aimPitch = camPitch + sw.y + Math.atan2(c.y - pos.y, 80); // centred on the board
    _e.set(MG.aimPitch, MG.aimYaw, 0, 'YXZ');
    // the view narrows as you steady your breath (a PC-shooter "focus")
    const hold = MG.dart && MG.dart.state === 'drawing' ? Math.min(1, MG.dart.hold / 0.5) : 0;
    const fov = 62 - 16 * hold;
    if (Math.abs(cam3.fov - fov) > 0.05) { cam3.fov += (fov - cam3.fov) * 0.2; cam3.updateProjectionMatrix(); }
    return { pos, quat: new THREE.Quaternion().setFromEuler(_e) };
}

// Hand sway: a slow wander that settles while you hold your breath —
// for about a second — then trembles as the arm tires
function mgSway() {
    const t = performance.now() / 1000;
    let amp = 0.016;
    const d = MG.dart;
    if (d && d.state === 'drawing') {
        const h = d.hold;
        amp = h < 0.35 ? 0.016 - h * 0.03 : h < 1.5 ? 0.0035 : 0.0035 + (h - 1.5) * 0.02;
        amp = Math.min(0.04, Math.max(0.003, amp));
    }
    MG.swayAmp = amp;
    return {
        x: (Math.sin(t * 1.13) * 0.55 + Math.sin(t * 2.31 + 1.7) * 0.32 + Math.sin(t * 5.7 + 4.1) * 0.13) * amp,
        y: (Math.sin(t * 1.47 + 0.9) * 0.55 + Math.sin(t * 2.03 + 3.2) * 0.32 + Math.sin(t * 6.3 + 2.6) * 0.13) * amp * 0.8,
    };
}

// ---- PER-FRAME ----
function mgUpdate() {
    const want = mgWantsMode();
    if (MG.mode && (!activePuzzle || activePuzzle !== MG.puzzle)) mgExit();
    if (!MG.mode && want && activePuzzle) mgEnter(want);
    mgSealIdle();
    if (!MG.mode) return;
    const dt = 1 / 60;
    if (MG.mode === 'seal') mgSealUpdate(dt);
    else if (MG.mode === 'tea') mgTeaUpdate(dt);
    else if (MG.mode === 'sieve') mgSieveUpdate(dt);
    else mgDartsUpdate(dt);
    // floating score/text popups
    for (let i = MG.popups.length - 1; i >= 0; i--) {
        const p = MG.popups[i];
        p.t += dt;
        p.sprite.position.y = p.y0 + p.t * 10;
        p.sprite.material.opacity = Math.max(0, 1 - p.t / 1.4);
        if (p.t > 1.4) { p.sprite.parent && p.sprite.parent.remove(p.sprite); MG.popups.splice(i, 1); }
    }
}

// ============================================================
// THE TUNNEL GATE SEAL
// ============================================================
function mgSealIdle() {
    // Outside the minigame the seal still shows its state: stones where
    // the last reshuffle left them, the core pinging every 8 seconds
    const S = window.ch1Seal;
    if (!S || currentMapKey !== 1) return;
    const def = PUZZLES['puzzle_glyph_lock'];
    const t = performance.now() / 1000;
    const solved = !!gameState.flags[def.rewardFlag];
    if (!MG.mode || MG.mode !== 'seal') {
        const order = def._order || [0, 1, 2, 3];
        order.forEach((gi, slot) => {
            const st = S.stones[gi];
            st.position.x += (S.slots[slot][0] - st.position.x) * 0.1;
            st.position.y += (S.slots[slot][1] - st.position.y) * 0.1;
            st.position.z = solved ? 2.5 : 4;
            st.material[1].emissive.setHex(solved ? 0x8a5a10 : 0x000000);
            st.material[1].emissiveIntensity = solved ? 0.6 : 0;
        });
        const ping = Math.exp(-Math.pow((t % 8), 2) / 0.35); // the Codex's witness ping
        S.coreMat.emissiveIntensity = solved ? 1.4 : 0.22 + 0.9 * ping;
        S.glow.material.opacity = solved ? 0.5 : 0.12 + 0.35 * ping;
        for (const b of S.beads) b.material.emissiveIntensity = solved ? 0.8 : 0;
        if (solved) S.ring.rotation.z += 0.002;
    }
}

function mgSealUpdate(dt) {
    const S = window.ch1Seal, p = MG.puzzle, def = p.def;
    const t = performance.now() / 1000;
    // resonance drains while awake (same 10 s budget as the 2D card)
    if (p.phase === 'active' && p.awake) {
        p.energy -= dt / 10;
        if (p.energy <= 0) {
            p.energy = 1; p.awake = false; p.input = [];
            p.note = 'THE RESONANCE FADES. THE SEAL SLEEPS AGAIN.';
            p.noteTimer = 150;
            _tone(196, 0.35, 'sine', 0.08);
        }
    }
    if (p.noteTimer > 0) p.noteTimer--;
    if (p.flashTimer > 0) p.flashTimer--;

    // hover: ray from the free cursor into the stones
    MG.hover = -1;
    if (p.phase === 'active' && MG.mouse.inside && MG.blend > 0.9) {
        const ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector2(MG.mouse.x, MG.mouse.y), cam3);
        const hit = ray.intersectObjects(S.stones, false)[0];
        if (hit && !p.input.includes(hit.object.userData.glyphIdx)) MG.hover = hit.object.userData.glyphIdx;
    }
    glCanvas.style.cursor = MG.hover >= 0 ? 'pointer' : 'default';

    // stones: glide to their slots (they grind round after a wrong press),
    // pressed ones sink in and light, the hovered one lifts toward you
    const order = (p.phase === 'failed' && def._order) ? def._order : p.order;
    const grind = p.phase === 'failed' && MG.trap && MG.trap.state === 'stuck';
    order.forEach((gi, slot) => {
        const st = S.stones[gi];
        const k = grind ? 0.06 : 0.25;
        st.position.x += (S.slots[slot][0] - st.position.x) * k;
        st.position.y += (S.slots[slot][1] - st.position.y) * k;
        const pressed = p.input.includes(gi);
        const tz = pressed ? 2 : (MG.hover === gi ? 6 : 4);
        st.position.z += (tz - st.position.z) * 0.3;
        const m = st.material[1];
        if (pressed) { m.emissive.setHex(0xd49a30); m.emissiveIntensity = 0.7 + 0.25 * Math.sin(t * 6 + gi); }
        else if (MG.hover === gi) { m.emissive.setHex(0x6a5020); m.emissiveIntensity = 0.5; }
        else { m.emissive.setHex(0x000000); m.emissiveIntensity = 0; }
    });
    if (grind) { S.ring.rotation.z += 0.03; MG.shake = Math.max(MG.shake, 0.6); }

    // core + beads
    const progress = p.input.length / def.sequence.length;
    const pulse = p.awake ? 0.5 + 0.5 * Math.sin(t * (3 + progress * 6)) : Math.exp(-Math.pow(t % 8, 2) / 0.35);
    S.coreMat.emissiveIntensity = p.phase === 'solved' ? 2.2 : (p.awake ? 0.6 + progress * 0.9 + pulse * 0.4 : 0.22 + 0.9 * pulse);
    S.glow.material.opacity = p.phase === 'solved' ? 0.9 : (p.awake ? 0.3 + progress * 0.4 : 0.12 + 0.3 * pulse);
    const lit = p.awake ? Math.ceil(p.energy * S.beads.length) : 0;
    S.beads.forEach((b, i) => { b.material.emissiveIntensity = p.phase === 'solved' ? 1.5 : (i < lit ? 0.9 + (i === lit - 1 ? 0.5 * pulse : 0) : 0); });
    if (p.phase === 'solved') { S.ring.rotation.z += 0.04; MG.shake = Math.max(MG.shake, 0.4); }

    // the trap: a cedar dart from the rock, at shin height, into the brace
    if (p.phase === 'failed' && !MG.trap) mgFireTrap();
    if (MG.trap) mgTrapUpdate(dt);

    // HUD
    const status = p.noteTimer > 0 ? p.note
        : p.phase === 'solved' ? 'THE SEAL TURNS'
        : p.phase === 'failed' ? 'WRONG STONE.'
        : p.awake ? `THE SEAL IS LISTENING — ${p.input.length} OF ${def.sequence.length}`
        : 'THE SEAL SLEEPS. PRESS A GLYPH TO WAKE IT.';
    mgSetStatus(status, p.phase === 'failed' ? 'bad' : p.phase === 'solved' ? 'good' : p.awake ? 'live' : '');
    mgFlash(p.flashTimer > 0 ? (p.flashColor === 'fail' ? 'fail' : 'win') : null, p.flashTimer / 30);
    const names = def.glyphNames || [];
    mgEl('mg-stats').textContent = MG.hover >= 0 && names[MG.hover] ? names[MG.hover].toUpperCase() : '';
}

function mgFireTrap() {
    const S = window.ch1Seal;
    const dart = ch1MakeDart(ch1Mats());
    dart.scale.setScalar(1.3);
    const from = new THREE.Vector3(-150, 14, 30), to = new THREE.Vector3(91, 14, 30);
    dart.position.copy(from);
    dart.lookAt(S.group.localToWorld(to.clone()));
    dart.rotation.set(0, -Math.PI / 2, 0);
    S.group.add(dart);
    MG.trap = { mesh: dart, from, to, t: 0, state: 'flying' };
    sndWhoosh();
    MG.shake = 1.5;
}

function mgTrapUpdate(dt) {
    const T = MG.trap;
    if (T.state !== 'flying') return;
    T.t = Math.min(1, T.t + dt / 0.16);
    T.mesh.position.lerpVectors(T.from, T.to, T.t);
    if (T.t >= 1) {
        T.state = 'stuck';
        sndThunk(true);
        MG.shake = 3;
        // the dart stays in the brace — "you do not touch the tip"
    }
}

function mgSealPress(glyphIdx) {
    const p = MG.puzzle;
    if (!p || p.phase !== 'active' || glyphIdx < 0) return;
    // Hand the press to engine.js so every rule/flag/scene is the
    // original: a one-off button at the click point
    p._btns = [{ x: 0, y: 0, r: 1, glyphIdx }];
    handlePuzzleClick(0, 0);
    const st = window.ch1Seal.stones[glyphIdx];
    if (st) st.position.z = 1; // the thunk of stone into stone
    if (p.phase === 'active' || p.phase === 'solved') { _tone(90, 0.12, 'triangle', 0.08); }
}

// ============================================================
// CAMP DARTS
// ============================================================
function mgDartsUpdate(dt) {
    const p = MG.puzzle, def = p.def, D = window.ch1Darts, d = MG.dart;
    // the dart in your hand, floating bottom-right of the view
    if (MG.hand) {
        const pull = d.state === 'drawing' ? Math.min(1, d.hold / 0.35) : 0;
        MG.hand.visible = d.state === 'ready' || d.state === 'drawing';
        _v.set(7 - pull * 1.5, -6.5 + pull * 1.2, -16 + pull * 4).applyQuaternion(cam3.quaternion).add(cam3.position);
        MG.hand.position.copy(_v);
        MG.hand.quaternion.copy(cam3.quaternion);
        MG.hand.rotateX(0.12 + pull * 0.1); MG.hand.rotateY(-0.12);
    }
    if (d.state === 'drawing') d.hold += dt;
    if (d.state === 'flying') {
        d.t = Math.min(1, d.t + dt / 0.3);
        const a = d.from, b = d.to;
        const pos = new THREE.Vector3().lerpVectors(a, b, d.t);
        pos.y += Math.sin(d.t * Math.PI) * 4.5; // a small lob
        d.mesh.position.copy(pos);
        const ahead = new THREE.Vector3().lerpVectors(a, b, Math.min(1, d.t + 0.05));
        ahead.y += Math.sin(Math.min(1, d.t + 0.05) * Math.PI) * 4.5;
        if (ahead.distanceToSquared(pos) > 1e-6) d.mesh.lookAt(ahead), d.mesh.rotateY(Math.PI);
        if (d.t >= 1) mgDartLand();
    }
    // breath meter (how steady the hand is right now)
    const steady = 1 - Math.min(1, (MG.swayAmp - 0.003) / 0.02);
    mgEl('mg-breath-fill').style.width = (steady * 100).toFixed(0) + '%';
    mgEl('mg-breath-fill').dataset.state = d.state === 'drawing' && d.hold > 1.5 ? 'tired' : steady > 0.8 ? 'steady' : '';
    mgEl('mg-stats').innerHTML =
        `<div><span>SCORE</span><b>${p.score}</b></div>` +
        `<div><span>DARTS</span><b>${'◆'.repeat(3 - p.darts.length)}${'◇'.repeat(p.darts.length)}</b></div>` +
        `<div><span>CAMP BEST</span><b>${gameState.dartsBest || '—'}</b></div>` +
        `<div><span>SAM (CHALK)</span><b>${def.samBest}</b></div>`;
    mgSetStatus(p.stage === 'done' ? '' : d.state === 'drawing'
        ? (d.hold > 1.5 ? 'YOUR ARM IS TIRING — LET IT GO' : d.hold > 0.35 ? 'STEADY…' : 'BREATHE IN…')
        : d.state === 'flying' ? '' : 'HOLD THE LEFT BUTTON TO STEADY YOUR HAND', d.hold > 1.5 ? 'bad' : '');
    mgFlash(null);
}

function mgDartsPress() {
    const p = MG.puzzle, d = MG.dart;
    if (p.stage === 'done') return;
    if (document.pointerLockElement !== glCanvas) { try { glCanvas.requestPointerLock(); } catch (e) { /* */ } }
    if (d.state === 'ready') { d.state = 'drawing'; d.hold = 0; sndClick(); }
}

function mgDartsRelease() {
    const p = MG.puzzle, d = MG.dart, D = window.ch1Darts;
    if (!p || d.state !== 'drawing') return;
    // where the aim ray (with the sway at release) meets the board plane
    D.group.updateWorldMatrix(true, false);
    const c = D.center.clone().applyMatrix4(D.group.matrixWorld);
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(cam3.quaternion);
    const tHit = (c.z - cam3.position.z) / dir.z;
    const hit = cam3.position.clone().addScaledVector(dir, tHit);
    // a flick of the wrist: tiny extra scatter from how shaky you were
    const a = Math.random() * Math.PI * 2, sc = MG.swayAmp * 80 * Math.random();
    hit.x += Math.cos(a) * sc; hit.y += Math.sin(a) * sc;
    const from = MG.hand ? MG.hand.position.clone() : cam3.position.clone();
    const mesh = ch1MakeDart(ch1Mats());
    scene3.add(mesh);
    d.state = 'flying'; d.t = 0; d.from = from; d.to = hit; d.mesh = mesh; d.center = c;
    p.stage = 'flight';
    sndWhoosh();
}

function mgDartLand() {
    const p = MG.puzzle, def = p.def, d = MG.dart, D = window.ch1Darts;
    const dx = d.to.x - d.center.x, dy = d.to.y - d.center.y;
    // board radius 15 ↔ the 2D scoring radius 150
    const score = dartsScoreAt(dx * 10, -dy * 10);
    // stick it: re-parent into the board group so it stays put
    scene3.remove(d.mesh);
    const local = D.group.worldToLocal(d.to.clone());
    d.mesh.position.copy(local);
    d.mesh.position.z += 7.5; // tip buried, flights out
    d.mesh.rotation.set((Math.random() - 0.5) * 0.25 - 0.08, (Math.random() - 0.5) * 0.25, Math.random() * 3);
    D.group.add(d.mesh);
    D.stuck.push(d.mesh);
    p.darts.push({ x: dx, y: dy, score });
    p.score += score;
    MG.shake = score ? 0.6 : 1.2;
    sndThunk(!score);
    if (score === 50) sndSuccess();
    mgPopup(score ? String(score) : 'WALL', d.to, score >= 25);
    if (p.darts.length >= 3) {
        p.stage = 'done';
        if (p.score > (gameState.dartsBest || 0)) { p.newBest = true; gameState.dartsBest = p.score; }
        if (p.score >= def.samBest && !gameState.flags.darts_beat_sam) {
            gameState.flags.darts_beat_sam = true;
            p.beatSam = true;
            increaseSanity(0.5);
        }
        saveGame();
        d.state = 'done';
        setTimeout(mgDartsShowResult, 700);
    } else {
        p.stage = 'aim';
        d.state = 'ready';
    }
}

function mgDartsShowResult() {
    const p = MG.puzzle;
    if (!p || p.stage !== 'done') return;
    if (document.pointerLockElement === glCanvas) document.exitPointerLock();
    const line = p.beatSam ? "The Rais's chalk number finally falls. Over by the fire, somebody laughs until he coughs."
        : p.score >= 100 ? "From inside the dorm: 'Not bad, Doctor.' You didn't announce yourself."
        : p.score >= 60 ? 'A grunt of acknowledgment through the dorm wall.'
        : p.score >= 30 ? "From inside the dorm: 'The wall. Again.'"
        : "From inside the dorm: 'Is someone throwing rocks?'";
    mgEl('mg-result-score').textContent = p.score + ' / 150' + (p.newBest ? '  —  NEW CAMP BEST' : '');
    mgEl('mg-result-line').textContent = line;
    mgEl('mg-result').classList.remove('hidden');
}

function mgDartsAgain() {
    const p = MG.puzzle;
    if (!p || p.stage !== 'done') return;
    p.darts = []; p.score = 0; p.popups = []; p.newBest = false; p.beatSam = false; p.stage = 'aim';
    MG.dart = { state: 'ready', hold: 0, t: 0 };
    mgClearStuckDarts();
    mgEl('mg-result').classList.add('hidden');
    try { glCanvas.requestPointerLock(); } catch (e) { /* */ }
}

// ---- HUD HELPERS ----
function mgSetStatus(text, kind) {
    const el = mgEl('mg-status');
    if (el.textContent !== text) el.textContent = text;
    el.dataset.kind = kind || '';
}

function mgFlash(kind, amount) {
    const el = mgEl('mg-flash');
    if (!kind) { el.style.opacity = 0; return; }
    el.dataset.kind = kind;
    el.style.opacity = Math.max(0, Math.min(1, amount)).toFixed(2);
}

function mgPopup(text, worldPos, gold) {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 64;
    const cc = c.getContext('2d');
    cc.font = 'bold 40px Georgia, serif';
    cc.textAlign = 'center';
    cc.fillStyle = 'rgba(0,0,0,0.6)';
    cc.fillText(text, 66, 46);
    cc.fillStyle = gold ? '#ffd97a' : '#e8dcc0';
    cc.fillText(text, 64, 44);
    const tex = new THREE.CanvasTexture(c);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, toneMapped: false }));
    s.scale.set(12, 6, 1);
    s.position.copy(worldPos);
    s.position.z += 4;
    scene3.add(s);
    MG.popups.push({ sprite: s, t: 0, y0: worldPos.y + 4 });
}

// ---- INPUT ----
// engine.js pointerdown → here first while a puzzle is open
function puzzle3dPointerDown(e) {
    if (!MG.mode) return false;
    if (e.target && e.target.closest && e.target.closest('#mg-result')) return true; // its buttons handle it
    if (MG.mode === 'seal') {
        if (e.button === 2) { closePuzzle(); return true; }
        if (MG.hover >= 0) mgSealPress(MG.hover);
    } else if (MG.mode === 'tea') {
        if (e.button === 0 && MG.tea && !MG.tea.done) MG.tea.pouring = true;
    } else if (MG.mode === 'sieve') {
        if (e.button === 0) mgSieveClick();
    } else if (e.button === 0) {
        mgDartsPress();
    }
    return true;
}

window.addEventListener('pointerup', e => {
    if (MG.mode === 'darts' && e.button === 0) mgDartsRelease();
    if (MG.mode === 'tea' && e.button === 0) mgTeaStop();
});

window.addEventListener('mousemove', e => {
    const box = document.getElementById('game-container').getBoundingClientRect();
    MG.mouse.x = ((e.clientX - box.left) / box.width) * 2 - 1;
    MG.mouse.y = -((e.clientY - box.top) / box.height) * 2 + 1;
    MG.mouse.inside = Math.abs(MG.mouse.x) <= 1 && Math.abs(MG.mouse.y) <= 1;
});

window.addEventListener('contextmenu', e => { if (MG.mode) e.preventDefault(); });

window.addEventListener('keydown', e => {
    if (!MG.mode) return;
    if (MG.mode === 'seal' && /^[1-4]$/.test(e.key)) {
        const p = MG.puzzle;
        const order = p.order;
        mgSealPress(order[Number(e.key) - 1]);
    } else if (MG.mode === 'darts') {
        if ((e.key === 'r' || e.key === 'R' || e.key === 'Enter') && MG.puzzle.stage === 'done') mgDartsAgain();
    } else if ((MG.mode === 'tea' || MG.mode === 'sieve') && (e.key === 'r' || e.key === 'R' || e.key === 'Enter')) {
        if (!mgEl('mg-result').classList.contains('hidden')) mgAgain();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const again = mgEl('mg-again'), leave = mgEl('mg-leave');
    if (again) again.addEventListener('click', mgAgain);
    if (leave) leave.addEventListener('click', () => closePuzzle());
});

// "Again" on the result panel, whichever game is up
function mgAgain() {
    if (MG.mode === 'darts') return mgDartsAgain();
    mgEl('mg-result').classList.add('hidden');
    if (MG.mode === 'tea') mgTeaEnter();
    else if (MG.mode === 'sieve') {
        if ((gameState.flags.ow_sieve_runs || 0) >= 3) closePuzzle();
        else mgSieveEnter();
    }
}

// ============================================================
// MINT TEA (open-world side game, ch1_openworld.js)
// Hold the left button to pour; the mouse's height is the kettle's
// height. Pour from high for foam — too high and it splashes. Fill the
// glass to the line with a proper head of foam.
// ============================================================
function mgTeaEnter() {
    MG.tea = { level: 0, foam: 0, height: 0.4, pouring: false, splash: 0, done: false, result: null };
    const T = window.ch1Tea;
    T.fill.scale.y = 0.01; T.foam.visible = false; T.stream.visible = false;
    mgEl('mg-title').textContent = 'MINT TEA';
    mgEl('mg-hint').textContent = 'Pour from a height for the foam. Fill to the gold line. Don\'t drown the tray.';
    mgEl('mg-keys').innerHTML = '<span class="key">MOUSE ↑↓</span> KETTLE HEIGHT &nbsp; <span class="key">HOLD LMB</span> POUR &nbsp; <span class="key">ESC</span> LEAVE';
}

function mgTeaCamera() {
    const T = window.ch1Tea;
    T.group.updateWorldMatrix(true, false);
    const c = T.glass.getWorldPosition(new THREE.Vector3());
    const pos = new THREE.Vector3(c.x + 30, c.y + 22, c.z + 58);
    const m = new THREE.Matrix4().lookAt(pos, new THREE.Vector3(c.x - 2, c.y + 8, c.z), new THREE.Vector3(0, 1, 0));
    return { pos, quat: new THREE.Quaternion().setFromRotationMatrix(m) };
}

function mgTeaUpdate(dt) {
    const S = MG.tea, T = window.ch1Tea;
    if (!S.done) S.height += ((MG.mouse.y + 1) / 2 - S.height) * 0.2; // cursor height → kettle height
    const h = Math.max(0, Math.min(1, S.height));
    // kettle sits above the glass, tipped while pouring
    const gy = T.glass.position.y;
    T.kettle.position.set(T.glass.position.x - 9, gy + 12 + h * 30, T.glass.position.z);
    T.kettle.rotation.z = S.pouring ? -0.9 : -0.2;
    if (S.pouring && !S.done) {
        S.level += dt * 0.28;
        S.foam = Math.min(1, S.foam + dt * (h > 0.45 ? (h - 0.35) * 1.4 : -0.05));
        if (h > 0.85 && Math.random() < dt * 6) { S.splash++; MG.shake = 0.3; }
        if (Math.random() < dt * 18 && typeof _tone === 'function') _tone(1600 + Math.random() * 900, 0.015, 'sine', 0.012);
    } else if (!S.done) S.foam = Math.max(0, S.foam - dt * 0.12); // foam settles if you dawdle
    // the glass
    const lvl = Math.min(1.05, S.level);
    T.fill.scale.y = Math.max(0.01, lvl * 6.4);
    T.fill.position.y = gy - 3.3 + lvl * 3.2;
    T.foam.visible = S.foam > 0.05 && lvl > 0.1;
    T.foam.scale.y = S.foam * 1.6;
    T.foam.position.y = gy - 3.3 + lvl * 6.4 + S.foam * 0.8;
    T.stream.visible = S.pouring && !S.done;
    const spout = T.kettle.position.clone().add(new THREE.Vector3(8, -2, 0));
    const top = gy - 3.3 + lvl * 6.4;
    T.stream.position.set(T.glass.position.x, (spout.y + top) / 2, T.glass.position.z);
    T.stream.scale.y = Math.max(0.1, spout.y - top);
    if (S.level >= 1.02 && !S.done) mgTeaFinish('over');
    // HUD
    const pct = v => (Math.max(0, Math.min(1, v)) * 100).toFixed(0) + '%';
    mgEl('mg-stats').innerHTML =
        `<div><span>GLASS</span><b class="bar"><i style="width:${pct(S.level)}"></i><em style="left:78%;width:16%"></em></b></div>` +
        `<div><span>FOAM</span><b class="bar"><i style="width:${pct(S.foam)}"></i><em style="left:50%;width:50%"></em></b></div>` +
        `<div><span>HEIGHT</span><b class="bar"><i style="width:${pct(h)}" class="${h > 0.85 ? 'hot' : ''}"></i></b></div>`;
    mgSetStatus(S.done ? '' : S.pouring ? (h > 0.85 ? 'TOO HIGH — IT\'S SPLASHING' : h > 0.45 ? 'THE FOAM IS RISING' : 'POUR FROM HIGHER FOR FOAM') : 'HOLD THE LEFT BUTTON TO POUR',
        !S.done && S.pouring && h > 0.85 ? 'bad' : S.pouring ? 'live' : '');
}

function mgTeaStop() {
    const S = MG.tea;
    if (!S || S.done || !S.pouring) return;
    S.pouring = false;
    if (S.level >= 0.55) mgTeaFinish(S.level < 0.78 ? 'short' : S.foam < 0.5 ? 'flat' : S.splash > 3 ? 'messy' : 'perfect');
}

function mgTeaFinish(kind) {
    const S = MG.tea;
    S.done = true; S.pouring = false;
    const lines = {
        perfect: "A proper glass — amber, sweet, a fat head of foam that holds. Somewhere behind you a worker clicks his tongue in approval.",
        short: 'Half a glass. The workers would call that an insult to the mint.',
        flat: 'Full, but flat as a puddle. Pour from higher — the foam is the whole point.',
        messy: 'Foam, yes. Also tea across the tray, the crate and your left boot.',
        over: 'It overflows, runs off the tray and hisses on the coals.',
    };
    let reward = '';
    if (kind === 'perfect') {
        increaseSanity(0.3);
        if (!gameState.inventory.includes('Mint Tea')) { gameState.inventory.push('Mint Tea'); reward = '  —  MINT TEA ADDED (stamina recovers faster)'; }
        gameState.stamina = gameState.maxStamina;
        updateHUD();
        sndSuccess();
    } else sndFail();
    mgEl('mg-result-score').textContent = (kind === 'perfect' ? 'A PERFECT GLASS' : kind === 'over' ? 'SPILLED' : 'NOT QUITE') + reward;
    mgEl('mg-result-line').textContent = lines[kind];
    mgEl('mg-again').firstChild.textContent = 'POUR AGAIN ';
    mgEl('mg-result').classList.remove('hidden');
}

// ============================================================
// THE SIEVE (open-world side game)
// Shake the sieve by moving the mouse side to side; the earth drains
// through and whatever it hid comes up. Click the finds to bag them
// (stones are just stones). 25 seconds a heap.
// ============================================================
const SIEVE_FINDS = [
    { kind: 'sherd', value: 10, name: 'Pot sherd' }, { kind: 'bead', value: 25, name: 'Faience bead' },
    { kind: 'coin', value: 35, name: 'Copper coin' }, { kind: 'bone', value: 5, name: 'Animal bone' },
    { kind: 'flint', value: 15, name: 'Worked flint' },
];
function mgSieveEnter() {
    const V = window.ch1Sieve, M = ch1Mats();
    for (const f of V.finds) f.mesh.parent && f.mesh.parent.remove(f.mesh);
    V.finds = [];
    const n = 6 + (Math.random() * 3 | 0);
    for (let i = 0; i < n; i++) {
        const isFind = Math.random() < 0.5;
        const def = isFind ? SIEVE_FINDS[(Math.random() * SIEVE_FINDS.length) | 0] : null;
        let mesh;
        if (!def) mesh = new THREE.Mesh(ch1RockGeo(i), M.rock), mesh.scale.setScalar(2.2 + Math.random() * 1.5);
        else if (def.kind === 'bead') mesh = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.7, 6, 10), new THREE.MeshStandardMaterial({ color: 0x2a8a9a, roughness: 0.3, emissive: 0x0a2a30 }));
        else if (def.kind === 'coin') mesh = new THREE.Mesh(gCyl(1.6, 1.6, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0x5a7a50, roughness: 0.5, metalness: 0.6 }));
        else if (def.kind === 'bone') mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 3.5, 3, 6), new THREE.MeshStandardMaterial({ color: 0xe0d6bc }));
        else if (def.kind === 'flint') mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(2), new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.3, flatShading: true }));
        else mesh = new THREE.Mesh(gBox(3.4, 0.6, 2.4), M.terracotta);
        mesh.position.set((Math.random() - 0.5) * 56, 1.5, (Math.random() - 0.5) * 30);
        mesh.rotation.set(Math.random() * 0.4, Math.random() * 6, Math.random() * 0.4);
        mesh.visible = false;
        V.frame.add(mesh);
        V.finds.push({ mesh, def, depth: 0.25 + Math.random() * 0.6, taken: false });
    }
    V.soil.scale.y = 1; V.soil.position.y = 1;
    MG.sieve = { progress: 0, time: 25, lastX: MG.mouse.x, earned: 0, bagged: [], done: false };
    mgEl('mg-title').textContent = 'THE SIEVE';
    mgEl('mg-hint').textContent = 'Shake it through. Anything the register wants, bag it. Stones are just stones.';
    mgEl('mg-keys').innerHTML = '<span class="key">MOUSE ←→</span> SHAKE &nbsp; <span class="key">CLICK</span> BAG A FIND &nbsp; <span class="key">ESC</span> LEAVE';
}

function mgSieveCamera() {
    const V = window.ch1Sieve;
    V.group.updateWorldMatrix(true, false);
    const c = V.frame.getWorldPosition(new THREE.Vector3());
    const pos = new THREE.Vector3(c.x, c.y + 62, c.z + 46);
    const m = new THREE.Matrix4().lookAt(pos, c, new THREE.Vector3(0, 1, 0));
    return { pos, quat: new THREE.Quaternion().setFromRotationMatrix(m) };
}

function mgSieveUpdate(dt) {
    const S = MG.sieve, V = window.ch1Sieve;
    if (!S.done) {
        S.time -= dt;
        const shake = Math.min(0.4, Math.abs(MG.mouse.x - S.lastX) * 2.2);
        S.progress = Math.min(1, S.progress + shake * 0.09);
        V.frame.position.x = Math.sin(performance.now() / 40) * shake * 8;
        if (shake > 0.05 && Math.random() < 0.4 && typeof sndFootstep === 'function') sndFootstep('sand', false);
    }
    S.lastX = MG.mouse.x;
    V.soil.scale.y = Math.max(0.05, 1 - S.progress);
    V.soil.position.y = 1 - S.progress * 2.5;
    // hover + reveal
    MG.hover = -1;
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(MG.mouse.x, MG.mouse.y), cam3);
    const live = V.finds.filter(f => !f.taken && f.mesh.visible);
    const hit = ray.intersectObjects(live.map(f => f.mesh), false)[0];
    V.finds.forEach((f, i) => {
        if (!f.taken && S.progress > f.depth) f.mesh.visible = true;
        f.mesh.scale.setScalar((f.def ? 1 : f.mesh.scale.x) * 1);
        if (hit && hit.object === f.mesh) MG.hover = i;
    });
    glCanvas.style.cursor = MG.hover >= 0 ? 'pointer' : 'default';
    if (!S.done && (S.time <= 0 || (S.progress >= 1 && V.finds.every(f => f.taken || !f.def)))) mgSieveFinish();
    const hov = MG.hover >= 0 ? V.finds[MG.hover] : null;
    mgEl('mg-stats').innerHTML =
        `<div><span>TIME</span><b>${Math.max(0, S.time).toFixed(0)}s</b></div>` +
        `<div><span>SIFTED</span><b class="bar"><i style="width:${(S.progress * 100).toFixed(0)}%"></i></b></div>` +
        `<div><span>BAGGED</span><b>${S.bagged.length} · ${S.earned} EGP</b></div>`;
    mgSetStatus(S.done ? '' : hov ? (hov.def ? hov.def.name.toUpperCase() + ' — CLICK TO BAG' : 'A STONE') : S.progress < 0.3 ? 'SHAKE — MOUSE SIDE TO SIDE' : 'LOOK FOR ANYTHING THAT ISN\'T A STONE', hov && hov.def ? 'live' : '');
}

function mgSieveClick() {
    const S = MG.sieve, V = window.ch1Sieve;
    if (!S || S.done || MG.hover < 0) return;
    const f = V.finds[MG.hover];
    f.taken = true;
    f.mesh.visible = false;
    if (f.def) {
        S.bagged.push(f.def.name); S.earned += f.def.value;
        mgPopup('+' + f.def.value, f.mesh.getWorldPosition(new THREE.Vector3()), f.def.value >= 25);
        if (typeof sndPickup === 'function') sndPickup();
    } else if (typeof _tone === 'function') _tone(220, 0.05, 'triangle', 0.04);
}

function mgSieveFinish() {
    const S = MG.sieve;
    S.done = true;
    gameState.flags.ow_sieve_runs = (gameState.flags.ow_sieve_runs || 0) + 1;
    gameState.funds += S.earned;
    updateHUD();
    saveGame();
    mgEl('mg-result-score').textContent = S.bagged.length ? `${S.bagged.length} FINDS  ·  +${S.earned} EGP` : 'NOTHING BUT STONES';
    mgEl('mg-result-line').textContent = S.bagged.length
        ? 'Bagged and labelled: ' + S.bagged.join(', ').toLowerCase() + '. The register pays on the spot.'
        : 'Sand, stones, a beetle. The spoil keeps its secrets this time.';
    const left = 3 - gameState.flags.ow_sieve_runs;
    mgEl('mg-again').firstChild.textContent = left > 0 ? 'ANOTHER HEAP (' + left + ') ' : 'DONE ';
    mgEl('mg-result').classList.remove('hidden');
}
