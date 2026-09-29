// ============================================================
// THE CODEX OF GIZA — CINEMATIC CONVERSATIONS (cine3d.js)
//
// When a conversation or an examination opens in the 3D build:
//   - the camera eases into a shot: over your shoulder onto the person
//     you're talking to, or in close on the thing you're looking at
//     (big things — buildings, the trench — you just turn to face)
//   - letterbox bars slide in and the HUD steps aside
//   - the line types itself out (SPACE / click finishes it; 1–9 pick a
//     choice); the speaking person gestures a little
// Scenes the story starts on its own (no interaction) keep your view
// and only get the bars. Nothing about the dialogue itself changes.
// Loaded after engine.js, before engine3d.js.
// ============================================================

const CINE = {
    active: false, target: null, blend: 0, from: null,
    exitFrom: null, exitBlend: 1, offAt: 0,
    lastInteract: { scene: null, at: 0 },
    type: { full: '', shown: 0, done: true, speed: 140 },
};

function cineActive() { return CINE.active; }

// remember what the player just interacted with (SPACE or F)
window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.code === 'KeyF') && gameState.currentScreen === 'GAME' && !gameState.isDialogueActive && gameState.activeInteractableId) {
        CINE.lastInteract = { scene: gameState.activeInteractableId, at: performance.now() };
    }
}, true);

// Find the thing the conversation is about
function cineFindTarget() {
    const li = CINE.lastInteract;
    if (!li.scene || performance.now() - li.at > 600) return null;
    const px = player.x + player.size / 2, pz = player.y + player.size / 2;
    if (li.scene === 'ch1_inspector' && typeof carGroup !== 'undefined' && carGroup && carGroup.visible) {
        return { kind: 'object', obj: carGroup, size: 120 };
    }
    let best = null, bd = 1e9;
    for (const e of objectEntries) {
        if (e.o.interactScene !== li.scene) continue;
        const d = Math.hypot(e.o.x + e.o.w / 2 - px, e.o.y + e.o.h / 2 - pz);
        if (d < bd) { bd = d; best = e; }
    }
    if (!best) return null;
    const person = personEntries.find(p => p.o === best.o);
    if (person) return { kind: 'person', fig: person.fig, o: best.o };
    const box = new THREE.Box3().setFromObject(best.mesh);
    const size = box.getSize(new THREE.Vector3());
    return { kind: 'object', obj: best.mesh, box, size: Math.max(size.x, size.y, size.z), o: best.o };
}

// Called from engine3d.js once a frame (after the NPCs animate);
// returns true when it placed the camera.
function cineDrivesCamera() {
    const talking = gameState.isDialogueActive && gameState.currentScreen === 'GAME' && !activePuzzle && !gameState.isPaused;
    const now = performance.now();
    const bars = document.getElementById('cine-bars');
    const box = document.getElementById('game-container');
    if (talking && !CINE.active) {
        CINE.active = true;
        CINE.target = cineFindTarget();
        CINE.blend = 0;
        CINE.from = null;
        bars.classList.add('on');
        box.classList.add('in-cine');
        if (document.pointerLockElement) document.exitPointerLock();
    }
    if (!talking && CINE.active) {
        // chained scenes close and reopen within a frame — wait a beat
        if (!CINE.offAt) CINE.offAt = now;
        if (now - CINE.offAt > 180) {
            CINE.active = false;
            CINE.offAt = 0;
            bars.classList.remove('on');
            box.classList.remove('in-cine');
            if (CINE.target && CINE.from) { CINE.exitFrom = { pos: cam3.position.clone(), quat: cam3.quaternion.clone() }; CINE.exitBlend = 0; }
            CINE.target = null;
        }
    } else CINE.offAt = 0;
    if (!CINE.active || !CINE.target) return false;

    // work out the shot from where the player really is
    positionCamera();
    if (!CINE.from) CINE.from = { pos: cam3.position.clone(), quat: cam3.quaternion.clone() };
    const eye = cam3.position.clone();
    const T = CINE.target, t = now / 1000;
    let pos, look;
    if (T.kind === 'person') {
        const f = T.fig;
        const head = f.position.clone(); head.y += f.userData.height * 0.86;
        const dir = new THREE.Vector3(head.x - eye.x, 0, head.z - eye.z).normalize();
        const right = new THREE.Vector3(-dir.z, 0, dir.x);
        const dist = Math.hypot(head.x - eye.x, head.z - eye.z);
        // stand a little closer, off the right shoulder, just below eye level
        const pull = Math.max(0, dist - 90);
        pos = eye.clone().addScaledVector(dir, pull).addScaledVector(right, 16).addScaledVector(dir, -14);
        pos.y = Math.max(eye.y - 6, head.y - 4);
        look = head.clone().addScaledVector(right, -5);
        look.y -= 16; // faces sit in the upper third, clear of the subtitles
        // the speaker talks with their hands
        const u = f.userData;
        if (u.arms && u.arms.length === 2) {
            u.arms[0].rotation.x = -0.35 + Math.sin(t * 2.1) * 0.22;
            u.arms[1].rotation.x = -0.12 + Math.sin(t * 1.6 + 1) * 0.12;
            u.arms[0].rotation.z = 0.15 + Math.sin(t * 1.3) * 0.08;
        }
    } else {
        const c = T.box ? T.box.getCenter(new THREE.Vector3()) : T.obj.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 30, 0));
        if (T.size > 320) {
            // too big to frame — just turn to face it
            pos = eye.clone();
            look = c;
        } else {
            const back = new THREE.Vector3(eye.x - c.x, 0, eye.z - c.z).normalize();
            const dist = Math.min(Math.hypot(eye.x - c.x, eye.z - c.z), 40 + T.size * 1.25);
            pos = c.clone().addScaledVector(back, dist);
            pos.y = c.y + Math.max(12, T.size * 0.35);
            const side = new THREE.Vector3(-back.z, 0, back.x);
            pos.addScaledVector(side, T.size * 0.18);
            look = c;
        }
    }
    // a slow breathing drift keeps the shot alive
    pos.x += Math.sin(t * 0.35) * 1.2; pos.y += Math.sin(t * 0.5) * 0.6;
    const m = new THREE.Matrix4().lookAt(pos, look, new THREE.Vector3(0, 1, 0));
    const quat = new THREE.Quaternion().setFromRotationMatrix(m);
    CINE.blend = Math.min(1, CINE.blend + 1 / 45);
    const k = CINE.blend < 0.5 ? 2 * CINE.blend * CINE.blend : 1 - Math.pow(-2 * CINE.blend + 2, 2) / 2;
    cam3.position.lerpVectors(CINE.from.pos, pos, k);
    cam3.quaternion.slerpQuaternions(CINE.from.quat, quat, k);
    const fov = T.kind === 'person' ? 52 : 58;
    cam3.fov += (fov - cam3.fov) * 0.08;
    cam3.updateProjectionMatrix();
    return true;
}

// after the conversation, ease back into the player's own view
function cineAfterCamera() {
    if (CINE.active || CINE.exitBlend >= 1 || !CINE.exitFrom) return;
    CINE.exitBlend = Math.min(1, CINE.exitBlend + 1 / 35);
    const k = CINE.exitBlend < 0.5 ? 2 * CINE.exitBlend * CINE.exitBlend : 1 - Math.pow(-2 * CINE.exitBlend + 2, 2) / 2;
    const pos = cam3.position.clone(), quat = cam3.quaternion.clone();
    cam3.position.lerpVectors(CINE.exitFrom.pos, pos, k);
    cam3.quaternion.slerpQuaternions(CINE.exitFrom.quat, quat, k);
}

// ---- TYPEWRITER ----
function cineTextSpeed() {
    const s = (typeof getSettings === 'function') ? getSettings().textSpeed : 'fast';
    return s === 'instant' ? 0 : s === 'normal' ? 70 : 150;
}

function cineStartTyping() {
    const el = document.getElementById('dialogue-text');
    const choices = document.getElementById('choices-container');
    CINE.type.full = el.innerText;
    const speed = cineTextSpeed();
    if (!speed || !CINE.type.full) { CINE.type.done = true; choices.classList.remove('waiting'); return; }
    CINE.type.shown = 0;
    CINE.type.done = false;
    CINE.type.speed = speed;
    CINE.type.last = performance.now();
    el.innerText = '';
    choices.classList.add('waiting');
}

function cineFinishTyping() {
    if (CINE.type.done) return false;
    CINE.type.done = true;
    document.getElementById('dialogue-text').innerText = CINE.type.full;
    document.getElementById('choices-container').classList.remove('waiting');
    return true;
}

function cineTypeTick() {
    if (CINE.type.done) return;
    if (!gameState.isDialogueActive) { CINE.type.done = true; return; }
    const now = performance.now();
    const add = (now - CINE.type.last) / 1000 * CINE.type.speed;
    if (add < 1) return;
    CINE.type.last = now;
    CINE.type.shown = Math.min(CINE.type.full.length, CINE.type.shown + Math.floor(add));
    document.getElementById('dialogue-text').innerText = CINE.type.full.slice(0, CINE.type.shown);
    if (CINE.type.shown >= CINE.type.full.length) cineFinishTyping();
}

(function wrapDialogue() {
    const _start = startDialogue;
    startDialogue = function (id) {
        _start(id);
        if (gameState.isDialogueActive) cineStartTyping();
    };
})();

window.addEventListener('keydown', e => {
    if (!gameState.isDialogueActive || gameState.currentScreen !== 'GAME' || gameState.isPaused) return;
    if (e.key === ' ' || e.key === 'Enter') {
        if (cineFinishTyping()) { e.preventDefault(); e.stopImmediatePropagation(); return; }
        // a single choice: SPACE / ENTER takes it
        const btns = document.querySelectorAll('#choices-container .choice-button');
        if (btns.length === 1 && e.key === 'Enter') { e.preventDefault(); btns[0].click(); }
    } else if (/^[1-9]$/.test(e.key) && CINE.type.done) {
        const btns = document.querySelectorAll('#choices-container .choice-button');
        const b = btns[Number(e.key) - 1];
        if (b) { e.preventDefault(); b.click(); }
    }
}, true);

document.addEventListener('pointerdown', e => {
    if (!gameState.isDialogueActive || CINE.type.done) return;
    if (e.target.closest && e.target.closest('.choice-button')) return;
    cineFinishTyping();
});
