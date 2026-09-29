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
        MG.hand = ch1MakeDart(ch1Mats());
        scene3.add(MG.hand);
        mgEl('mg-title').textContent = 'CAMP DARTS';
        mgEl('mg-hint').textContent = 'Three darts. Sam\'s chalk says 132.';
        mgEl('mg-keys').innerHTML = '<span class="key">MOUSE</span> AIM &nbsp; <span class="key">HOLD LMB</span> STEADY &nbsp; <span class="key">RELEASE</span> THROW &nbsp; <span class="key">ESC</span> WALK AWAY';
        if (document.pointerLockElement !== glCanvas) { try { glCanvas.requestPointerLock(); } catch (e) { /* needs a click */ } }
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
    const target = MG.mode === 'seal' ? mgSealCamera() : mgDartsCamera();
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
    const line = p.beatSam ? "Sam's chalk number finally falls. Somewhere, he owes you a beer he can't pay."
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
    } else if (e.button === 0) {
        mgDartsPress();
    }
    return true;
}

window.addEventListener('pointerup', e => {
    if (MG.mode === 'darts' && e.button === 0) mgDartsRelease();
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
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const again = mgEl('mg-again'), leave = mgEl('mg-leave');
    if (again) again.addEventListener('click', mgDartsAgain);
    if (leave) leave.addEventListener('click', () => closePuzzle());
});
