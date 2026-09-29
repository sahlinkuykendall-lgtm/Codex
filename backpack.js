// ============================================================
// THE CODEX OF GIZA — THE BACKPACK (backpack.js, 3D build)
//
// A limited pack for the things you pick up in the open world. Space is
// counted in units: big things (the metal detector) take 4, a canteen
// or field glasses 2, small things 1; some small things stack in one
// slot (sherds in a finds pouch, dates in a cloth). Story items — the
// journal, keys, Sam's stake… — ride in your pockets and never take
// space, so the story can always give you what it needs.
//
//   I  open / close the backpack        G  equip / put away the held tool
//   Q  drink from the canteen           RMB  look through field glasses
//
// The held tool is shown in first person. The metal detector only
// listens while it's in your hands.
// Loaded after engine.js / settings.js, before ch1_openworld.js.
// ============================================================

const BP_CAPACITY_BASE = 10;
// a bigger pack can be bought in Cairo (Chapter 3 tea vendor)
function bpCapacity() { return (gameState.backpack && gameState.backpack.capacity) || BP_CAPACITY_BASE; }
const BP_ITEMS = {
    metal_detector: { name: 'Metal Detector', size: 4, icon: '⌖', equip: true,
        desc: "Sam's detector — tape on the handle, S.O. scratched in the housing. Hold it (G) and it ticks faster near anything buried." },
    field_glasses: { name: 'Field Glasses', size: 2, icon: '◎', equip: true,
        desc: 'Old brass-bound binoculars. Hold them (G), then the right mouse button to look far.' },
    canteen: { name: 'Water Canteen', size: 2, icon: '⛁', use: 'drink',
        desc: 'Felt-covered, dented, holds three good drinks. Refill it at the well. (Q to drink)' },
    dates: { name: 'Dates', size: 1, icon: '❂', stack: 6, use: 'eat', desc: 'Sweet and sticky. A small comfort. (+ a little calm)' },
    sherd: { name: 'Painted Sherds', size: 1, icon: '◈', stack: 8, desc: 'Pieces of painted pottery for the finds register. One potter\'s hand, the same black flick on every piece.' },
    tin_compass: { name: "Child's Tin Compass", size: 1, icon: '✧', desc: 'Needle still swings true. You keep it.' },
    signal_mirror: { name: 'Signal Mirror', size: 1, icon: '◇', desc: 'A soldier\'s signalling mirror, the silvering flaking. Catches the moon beautifully.' },
};

function bpState() {
    if (!gameState.backpack) gameState.backpack = { items: [], equipped: null };
    return gameState.backpack;
}
function bpUsed() {
    return bpState().items.reduce((n, it) => n + (BP_ITEMS[it.id] ? BP_ITEMS[it.id].size : 1), 0);
}
function bpFind(id) { return bpState().items.find(it => it.id === id); }
function bpHas(id) { return !!bpFind(id); }

// add one (or qty) of an item; false if there's no room
function bpAdd(id, qty, extra) {
    const def = BP_ITEMS[id];
    if (!def) return false;
    qty = qty || 1;
    const have = bpFind(id);
    if (have && def.stack) {
        have.qty = Math.min(def.stack, have.qty + qty);
        bpRefresh();
        return true;
    }
    if (bpUsed() + def.size > bpCapacity()) {
        if (typeof owToast === 'function') owToast('BACKPACK FULL', 'Press I to make room (' + def.name + ' needs ' + def.size + ')');
        return false;
    }
    bpState().items.push(Object.assign({ id, qty: def.stack ? Math.min(def.stack, qty) : 1 }, extra || {}));
    bpRefresh();
    return true;
}
function bpRemove(id, qty) {
    const s = bpState(), it = bpFind(id);
    if (!it) return;
    it.qty -= (qty || it.qty);
    if (it.qty <= 0 || !BP_ITEMS[id].stack) {
        s.items.splice(s.items.indexOf(it), 1);
        if (s.equipped === id) s.equipped = null;
    }
    bpRefresh();
}
function bpEquipped() { return (gameState.backpack && gameState.backpack.equipped) || null; }
function bpToggleEquip(id) {
    const s = bpState();
    id = id || (s.equipped ? s.equipped : (bpHas('metal_detector') ? 'metal_detector' : bpHas('field_glasses') ? 'field_glasses' : null));
    if (!id || !bpHas(id)) return;
    s.equipped = s.equipped === id ? null : id;
    if (typeof _tone === 'function') _tone(s.equipped ? 520 : 380, 0.05, 'triangle', 0.04);
    bpRefresh();
}
function bpUse(id) {
    const it = bpFind(id), def = BP_ITEMS[id];
    if (!it || !def) return;
    if (def.use === 'drink') {
        if ((it.charges || 0) <= 0) { if (typeof owToast === 'function') owToast('CANTEEN EMPTY', 'Refill it at the well in the oasis'); return; }
        it.charges--;
        gameState.stamina = gameState.maxStamina;
        gameState.staminaExhausted = false;
        if (typeof owToast === 'function') owToast('A LONG DRINK', 'Stamina restored · ' + it.charges + ' left');
        if (typeof _tone === 'function') _tone(300, 0.12, 'sine', 0.05);
    } else if (def.use === 'eat') {
        increaseSanity(0.3);
        bpRemove(id, 1);
        if (typeof owToast === 'function') owToast('DATES', 'Sweet. You feel steadier.');
    }
    updateHUD();
    bpRefresh();
}

// ---- UI ----
let bpOpen = false;
function bpToggle(force) {
    const panel = document.getElementById('bp-panel');
    if (!panel) return;
    bpOpen = force != null ? force : !bpOpen;
    panel.classList.toggle('hidden', !bpOpen);
    if (bpOpen) { if (document.pointerLockElement) document.exitPointerLock(); bpRefresh(); }
    if (typeof _tone === 'function') _tone(bpOpen ? 440 : 330, 0.05, 'sine', 0.03);
}
function bpRefresh() {
    const panel = document.getElementById('bp-panel');
    if (!panel || !bpOpen) return;
    const s = bpState(), used = bpUsed();
    const cells = [];
    for (const it of s.items) {
        const d = BP_ITEMS[it.id];
        if (!d) continue;
        const qty = d.stack ? ` ×${it.qty}` : d.use === 'drink' ? ` · ${it.charges || 0}/3` : '';
        cells.push(`<div class="bp-item size${d.size}${s.equipped === it.id ? ' held' : ''}" data-id="${it.id}">
            <div class="bp-icon">${d.icon}</div>
            <div class="bp-name">${d.name}${qty}</div>
            <div class="bp-size">${'▮'.repeat(d.size)}</div>
            <div class="bp-desc">${d.desc}</div>
            <div class="bp-actions">
                ${d.equip ? `<button data-act="equip">${s.equipped === it.id ? 'PUT AWAY' : 'HOLD'} <span class="key">G</span></button>` : ''}
                ${d.use ? `<button data-act="use">${d.use === 'drink' ? 'DRINK' : 'EAT'}${d.use === 'drink' ? ' <span class="key">Q</span>' : ''}</button>` : ''}
                <button data-act="drop" class="drop">DROP</button>
            </div></div>`);
    }
    for (let i = used; i < bpCapacity(); i++) cells.push('<div class="bp-free"></div>');
    const pockets = (gameState.inventory || []).map(n => `<li>${String(n).replace(/_/g, ' ')}</li>`).join('') || '<li class="dim">Nothing yet</li>';
    panel.querySelector('#bp-grid').innerHTML = cells.join('');
    panel.querySelector('#bp-cap').textContent = `${used} / ${bpCapacity()}`;
    panel.querySelector('#bp-cap-fill').style.width = (used / bpCapacity() * 100) + '%';
    panel.querySelector('#bp-pockets').innerHTML = pockets;
    panel.querySelector('#bp-funds').textContent = gameState.funds + ' EGP';
}

document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('#bp-panel button[data-act]');
    if (!b) return;
    const id = b.closest('.bp-item').dataset.id, act = b.dataset.act;
    if (act === 'equip') bpToggleEquip(id);
    else if (act === 'use') bpUse(id);
    else if (act === 'drop') {
        const def = BP_ITEMS[id];
        if (def && (id === 'metal_detector' || id === 'sherd')) {
            // dropped things go back where they're safe, not into the sand
            if (typeof owToast === 'function') owToast(def.name.toUpperCase(), id === 'sherd' ? 'Left on your field table in the tent' : 'Left leaning by the equipment table');
            if (id === 'metal_detector') gameState.flags.ow_detector = false;
            if (id === 'sherd') gameState.flags.ow_sherds_banked = (gameState.flags.ow_sherds_banked || 0) + bpFind('sherd').qty;
        }
        bpRemove(id);
    }
    if (typeof uiClick === 'function') uiClick();
});
document.getElementById('bp-close') && document.getElementById('bp-close').addEventListener('click', () => bpToggle(false));

window.addEventListener('keydown', e => {
    if (gameState.currentScreen !== 'GAME' || gameState.isDialogueActive || gameState.isPaused) return;
    if (typeof activePuzzle !== 'undefined' && activePuzzle) return;
    const k = e.key.toLowerCase();
    if (k === 'i') { e.preventDefault(); bpToggle(); }
    else if (k === 'escape' && bpOpen) { e.preventDefault(); e.stopImmediatePropagation(); bpToggle(false); }
    else if (bpOpen) return;
    else if (k === 'g') bpToggleEquip();
    else if (k === 'q' && bpHas('canteen')) bpUse('canteen');
}, true);

// a new game starts with an empty pack
(function wrapReset() {
    const _reset = resetGameState;
    resetGameState = function () { _reset(); gameState.backpack = { items: [], equipped: null }; bpOpen = false; const p = document.getElementById('bp-panel'); if (p) p.classList.add('hidden'); };
})();

// ---- HELD TOOLS (first person) ----
const BP_VIEW = { tool: null, id: null, sweep: 0, zoom: false };

function bpMakeDetectorModel(M) {
    const g = new THREE.Group();
    const grey = new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.5, metalness: 0.6 });
    const black = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.8 });
    const yellow = new THREE.MeshStandardMaterial({ color: 0xd8a020, roughness: 0.5 });
    // S-shaped shaft: lower tube, telescoping middle, upper with grip
    subBeam(g, grey, new THREE.Vector3(0, 4, 0), new THREE.Vector3(0, 30, -6), 1.1, 8);
    subBeam(g, grey, new THREE.Vector3(0, 30, -6), new THREE.Vector3(0, 54, -4), 1.3, 8);
    subBeam(g, black, new THREE.Vector3(0, 54, -4), new THREE.Vector3(0, 64, 6), 1.8, 8);   // rubber grip
    const cuff = put(g, new THREE.CylinderGeometry(3.6, 3.6, 7, 12, 1, true, -Math.PI / 2, Math.PI), black, 0, 70, 12);
    cuff.rotation.x = Math.PI / 2 - 0.4;
    cuff.material = cuff.material.clone(); cuff.material.side = THREE.DoubleSide;
    put(g, gBox(6, 5, 9), yellow, 0, 56, 1, 0, 0, 0).rotation.x = -0.5;                      // control box
    const lcd = put(g, gBox(4, 0.4, 5), new THREE.MeshBasicMaterial({ color: 0x3aff70, toneMapped: false }), 0, 58.7, 0.5);
    lcd.rotation.x = -0.5; lcd.userData.noShadow = true;
    // the search coil, a flat ellipse on a yoke
    const coil = new THREE.Group();
    coil.position.set(0, 2.5, 2);
    put(coil, new THREE.TorusGeometry(9, 1.3, 6, 24), black, 0, 0, 0).rotation.x = Math.PI / 2;
    put(coil, gCyl(8, 8, 0.8, 24), yellow, 0, 0, 0);
    coil.scale.set(1, 1, 0.72);
    g.add(coil);
    subBeam(g, grey, new THREE.Vector3(0, 4, 0), new THREE.Vector3(0, 2.6, 2), 1.4, 6);
    // the cable spiralling up the shaft
    const pts = [];
    for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push(new THREE.Vector3(Math.cos(t * 18) * 1.8, 4 + t * 50, -Math.sin(t * 18) * 1.8 - t * 5)); }
    const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.35, 4), black);
    g.add(cable);
    g.userData.coil = coil;
    g.userData.cuff = cuff;
    g.userData.lcd = lcd;
    return g;
}

function bpMakeGlassesModel(M) {
    const g = new THREE.Group();
    const brass = new THREE.MeshStandardMaterial({ color: 0x8a6a30, roughness: 0.4, metalness: 0.7 });
    const leather = new THREE.MeshStandardMaterial({ color: 0x2a1c12, roughness: 0.9 });
    for (const s of [-1, 1]) {
        put(g, gCyl(2.6, 2.2, 11, 12), leather, s * 3.4, 0, 0).rotation.x = Math.PI / 2;
        put(g, gCyl(2.8, 2.8, 1.2, 12), brass, s * 3.4, 0, -5.8).rotation.x = Math.PI / 2;
    }
    put(g, gBox(3.4, 1.6, 6), brass, 0, 0.6, 0);
    return g;
}

// Called from engine3d.js every frame (after the camera is placed)
function bpUpdateView() {
    const eq = bpEquipped();
    const showIt = eq && gameState.currentScreen === 'GAME' && !gameState.isDialogueActive && !gameState.isPaused &&
        !(typeof activePuzzle !== 'undefined' && activePuzzle) && !interiorState.active && !(typeof cineActive === 'function' && cineActive());
    if (BP_VIEW.id !== eq || (BP_VIEW.tool && BP_VIEW.tool.parent !== scene3)) {
        if (BP_VIEW.tool && BP_VIEW.tool.parent) BP_VIEW.tool.parent.remove(BP_VIEW.tool);
        BP_VIEW.tool = null; BP_VIEW.id = eq;
        if (eq === 'metal_detector') { BP_VIEW.tool = bpMakeDetectorModel(ch1Mats()); BP_VIEW.tool.userData.cuff.visible = false; } // the cuff would fill the screen
        else if (eq === 'field_glasses') BP_VIEW.tool = bpMakeGlassesModel(ch1Mats());
        if (BP_VIEW.tool) { BP_VIEW.tool.traverse(m => { if (m.material) { m.material = m.material.clone(); m.material.depthTest = true; } }); scene3.add(BP_VIEW.tool); }
    }
    const T = BP_VIEW.tool;
    if (!T) return;
    T.visible = !!showIt && !(eq === 'field_glasses' && BP_VIEW.zoom);
    if (!T.visible) return;
    const t = performance.now() / 1000;
    const walking = typeof moveVel !== 'undefined' && moveVel.moving;
    BP_VIEW.sweep += ((walking ? Math.sin(t * 2.4) * 0.45 : Math.sin(t * 0.8) * 0.12) - BP_VIEW.sweep) * 0.08;
    const off = eq === 'metal_detector' ? new THREE.Vector3(14, -40, -80) : new THREE.Vector3(8, -9, -16);
    T.position.copy(off.applyQuaternion(cam3.quaternion).add(cam3.position));
    T.quaternion.copy(cam3.quaternion);
    if (eq === 'metal_detector') {
        // held out in front, coil skimming the sand and sweeping side to side
        // coil out ahead on the sand, shaft rising back to your hand
        T.rotateY(BP_VIEW.sweep);
        T.rotateX(0.9);
        T.rotateZ(-0.1);
        T.scale.setScalar(0.9);
        const pulse = (typeof OW !== 'undefined' && OW.detector.strength) || 0;
        T.userData.lcd.material.color.setHSL(0.33 - pulse * 0.33, 1, 0.45 + pulse * 0.3);
    } else {
        T.rotateX(-0.2);
        T.scale.setScalar(0.9);
    }
}

// field glasses: hold the right mouse button to look far
window.addEventListener('mousedown', e => {
    if (e.button === 2 && bpEquipped() === 'field_glasses' && gameState.currentScreen === 'GAME' && !gameState.isDialogueActive) {
        BP_VIEW.zoom = true;
        document.getElementById('game-container').classList.add('bp-zoom');
    }
});
window.addEventListener('mouseup', e => {
    if (e.button === 2 && BP_VIEW.zoom) { BP_VIEW.zoom = false; document.getElementById('game-container').classList.remove('bp-zoom'); }
});
window.addEventListener('contextmenu', e => { if (bpEquipped() === 'field_glasses') e.preventDefault(); });
function bpZoomFov() { return BP_VIEW.zoom && bpEquipped() === 'field_glasses' ? 20 : null; }

// ---- CAIRO: the tea vendor also sells a proper rucksack (3D build) ----
(function addRucksackToVendor() {
    const v = typeof storyData !== 'undefined' && storyData['ch3_vendor'];
    if (!v || v._rucksack) return;
    v._rucksack = true;
    v.choices.splice(v.choices.length - 1, 0, {
        text: 'Ask about the canvas rucksack hanging behind him (350 EGP) — room for 16.',
        onSelect: () => {
            if (bpCapacity() >= 16) { startDialogue('ch3_vendor_rucksack_have'); return; }
            if (gameState.funds < 350) { startDialogue('ch3_vendor_broke'); return; }
            gameState.funds -= 350;
            bpState().capacity = 16;
            updateHUD();
            startDialogue('ch3_vendor_rucksack');
        },
    });
    storyData['ch3_vendor_rucksack'] = { speaker: 'Tea Vendor', text: "He unhooks it without getting up — army canvas, leather straps gone dark with other people's sweat, a dozen pockets.\n\n'My cousin was in the Sinai. It carried everything he owned for two years. Now it can carry everything you own.'\n\n(Backpack space: 16.)",
        choices: [{ text: 'Shoulder it.', onSelect: () => closeDialogue() }] };
    storyData['ch3_vendor_rucksack_have'] = { speaker: 'Tea Vendor', text: "'You already carry my cousin's bag, effendi. He only had the one.'", choices: [{ text: 'Fair.', onSelect: () => closeDialogue() }] };
})();
