// ============================================================
// THE CODEX OF GIZA — 3D ENGINE LAYER (engine3d.js)
//
// Loaded by index3d.html after data.js / dialogue.js / engine.js.
// engine.js is loaded with window.RENDER_MODE_3D = true, which keeps
// its 2D gameLoop() from starting. This file drives its own loop and
// REUSES all existing game logic:
//   - storyData dialogue via startDialogue()/closeDialogue()
//   - gameState, flags, sanity/stamina/trust systems
//   - chapter loaders, interior system, hostiles, puzzles
//   - the 2D canvas (#gameCanvas) as a transparent overlay for the
//     start screen, pause menu, puzzles and fade transitions
//
// World mapping: 2D world (x, y) -> 3D ground plane (x, z), +y is up.
// player.x / player.y remain the single source of truth for position
// so every existing system keeps working unchanged.
// ============================================================

// ---- 3D CONSTANTS ----
const EYE_HEIGHT = 52;          // camera height above ground (~1.6m at ~32 units/m)
const WALL_HEIGHT_DEFAULT = 95; // generic wall height
const WALL_HEIGHT_LOW = 48;     // thin walls (fences, kerbs)
const WALL_HEIGHT_BORDER = 130; // world border walls

// ---- RENDERER / CAMERA / SCENE ----
const glCanvas = document.getElementById('glCanvas');
const renderer3 = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true });
renderer3.outputEncoding = THREE.sRGBEncoding;
renderer3.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const cam3 = new THREE.PerspectiveCamera(70, 16 / 9, 1, 8000);
cam3.rotation.order = 'YXZ'; // yaw (y) then pitch (x) — standard FPS ordering

let scene3 = new THREE.Scene();

// Look state (mouse look fills these in a later step)
let camYaw = 0;     // 0 = facing "north" (2D up, -z)
let camPitch = 0;

function resizeRendererIfNeeded() {
    const container = document.getElementById('game-container');
    const w = container.clientWidth, h = container.clientHeight;
    const size = renderer3.getSize(new THREE.Vector2());
    if (size.x !== w || size.y !== h) {
        renderer3.setSize(w, h, false);
        cam3.aspect = w / h;
        cam3.updateProjectionMatrix();
    }
}

// ---- WORLD (GRAYBOX) BUILDING ----
// Rebuilt whenever the active map changes (chapter load, interiors,
// return to menu). Cheap enough to rebuild from scratch each time.
let worldGroup = null;
let builtSignature = null;
let gateMeshes = [];   // { mesh, gateFlag } — hidden once their flag is set
let objectEntries = []; // { o, mesh, label } — synced against isObjectResolved()

// Floating text label rendered to a canvas texture, shown above interactables
function makeLabelSprite(text, colorHex) {
    const lc = document.createElement('canvas');
    const lctx = lc.getContext('2d');
    lctx.font = 'bold 22px Courier New';
    const tw = Math.ceil(lctx.measureText(text).width);
    lc.width = tw + 16;
    lc.height = 34;
    lctx.font = 'bold 22px Courier New';
    lctx.textBaseline = 'middle';
    lctx.fillStyle = 'rgba(0,0,0,0.55)';
    lctx.fillRect(0, 0, lc.width, lc.height);
    lctx.fillStyle = colorHex || '#f4e4b0';
    lctx.fillText(text, 8, lc.height / 2 + 1);
    const tex = new THREE.CanvasTexture(lc);
    tex.minFilter = THREE.LinearFilter;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    // World scale: keep labels readable but not billboard-huge
    const scale = 0.3;
    sprite.scale.set(lc.width * scale, lc.height * scale, 1);
    return sprite;
}

// Height heuristics for extruding 2D rectangles into graybox boxes
function wallHeightFor(wall) {
    const touchesEdge = wall.x <= 0 || wall.y <= 0 ||
        wall.x + wall.w >= WORLD.width || wall.y + wall.h >= WORLD.height;
    if (touchesEdge && (wall.w >= WORLD.width * 0.8 || wall.h >= WORLD.height * 0.8)) {
        return WALL_HEIGHT_BORDER;
    }
    if (Math.min(wall.w, wall.h) <= 25) return WALL_HEIGHT_LOW;
    return WALL_HEIGHT_DEFAULT;
}

function objectHeightFor(o) {
    if (o.id && /_bldg$/.test(o.id)) return 115;           // enterable building shells
    if (o.interactScene && /^door_/.test(o.interactScene)) return 8; // door mats stay flat
    const base = Math.min(o.w, o.h);
    return Math.max(16, Math.min(75, Math.round(base * 1.1)));
}

function addBoxAt(group, x, y, w, d, h, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x + w / 2, h / 2, y + d / 2);
    group.add(mesh);
    return mesh;
}

function currentWorldSignature() {
    return currentMapKey + '|' + WORLD.width + 'x' + WORLD.height + '|ch' + gameState.chapter;
}

function groundColorForCurrentMap() {
    if (interiorState.active && MAJOR_INTERIORS[interiorState.mapKey]) {
        return MAJOR_INTERIORS[interiorState.mapKey].bgColor;
    }
    return getChapterPalette().groundBase;
}

function buildWorld() {
    if (worldGroup) {
        scene3.remove(worldGroup);
        worldGroup.traverse(o => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
                if (o.material.map) o.material.map.dispose();
                o.material.dispose();
            }
        });
    }
    scene3 = new THREE.Scene();
    worldGroup = new THREE.Group();

    const palette = getChapterPalette();
    const groundCol = new THREE.Color(groundColorForCurrentMap());

    // Sky/fog — dark night tones derived from the chapter ground color
    const fogCol = groundCol.clone().multiplyScalar(0.35);
    scene3.background = fogCol;
    scene3.fog = new THREE.Fog(fogCol, 500, 3000);

    // Ground plane
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(WORLD.width, WORLD.height),
        new THREE.MeshLambertMaterial({ color: groundCol })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(WORLD.width / 2, 0, WORLD.height / 2);
    worldGroup.add(ground);

    // Subtle world-grid (echoes the 2D build's 200px survey grid)
    const grid = new THREE.GridHelper(
        Math.max(WORLD.width, WORLD.height),
        Math.max(WORLD.width, WORLD.height) / 200,
        0x55492f, 0x3a3222
    );
    grid.position.set(WORLD.width / 2, 0.5, WORLD.height / 2);
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    worldGroup.add(grid);

    // Lights — night desert: dim hemisphere + cool moonlight
    const hemi = new THREE.HemisphereLight(0x223044, 0x33291a, 0.85);
    worldGroup.add(hemi);
    const moon = new THREE.DirectionalLight(0x9db4d4, 0.55);
    moon.position.set(WORLD.width * 0.3, 900, WORLD.height * 0.15);
    worldGroup.add(moon);
    const warmFill = new THREE.AmbientLight(0xd4af37, 0.08);
    worldGroup.add(warmFill);

    // --- Walls (extruded from mapWalls; same data the collision uses) ---
    gateMeshes = [];
    const wallMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(palette.wallFill).lerp(new THREE.Color('#888'), 0.25) });
    const gateMat = new THREE.MeshLambertMaterial({ color: 0x8b6914 });
    for (const wall of (mapWalls[currentMapKey] || [])) {
        const h = wallHeightFor(wall);
        const mesh = addBoxAt(worldGroup, wall.x, wall.y, wall.w, wall.h, h, wall.isGate ? gateMat : wallMat);
        if (wall.isGate) gateMeshes.push({ mesh, gateFlag: wall.gateFlag });
    }

    // --- Map objects (interactables get labels, decoratives are plain) ---
    objectEntries = [];
    for (const o of (activeMapObjects || [])) {
        const h = objectHeightFor(o);
        const mat = new THREE.MeshLambertMaterial({ color: new THREE.Color(o.color || '#777') });
        const mesh = addBoxAt(worldGroup, o.x, o.y, o.w, o.h, h, mat);
        let label = null;
        if (!o.decorative && o.interactScene) {
            label = makeLabelSprite(o.label || o.id, '#f4e4b0');
            label.position.set(o.x + o.w / 2, h + 26, o.y + o.h / 2);
            worldGroup.add(label);
        }
        objectEntries.push({ o, mesh, label });
    }

    scene3.add(worldGroup);
    buildMinistryCar(); // scene was recreated; re-add dynamic meshes
    hostileMeshes = new Map(); // hostile meshes were dropped with the old scene
    builtSignature = currentWorldSignature();
    // New map: face "north" (2D up) — every spawn point enters from the south
    camYaw = 0;
    camPitch = 0;
}

function ensureWorldBuilt() {
    if (builtSignature !== currentWorldSignature()) buildWorld();
}

// Per-frame: hide resolved objects and opened gates (mirrors the 2D draw filters)
function syncWorldVisibility() {
    for (const g of gateMeshes) {
        g.mesh.visible = !gameState.flags[g.gateFlag];
    }
    const px = player.x + player.size / 2;
    const py = player.y + player.size / 2;
    for (const e of objectEntries) {
        const hidden = isObjectResolved(e.o);
        e.mesh.visible = !hidden;
        if (e.label) {
            // Distance fade: invisible when too close (would fill the screen)
            // or too far (horizon clutter); full strength in the mid band
            const dist = Math.hypot(e.o.x + e.o.w / 2 - px, e.o.y + e.o.h / 2 - py);
            let alpha = 1;
            if (dist < 60) alpha = 0;
            else if (dist < 140) alpha = (dist - 60) / 80;
            else if (dist > 1100) alpha = 0;
            else if (dist > 800) alpha = 1 - (dist - 800) / 300;
            e.label.material.opacity = alpha;
            e.label.visible = !hidden && alpha > 0.02;
        }
    }
}

// ---- MOUSE LOOK (POINTER LOCK) ----
function gameplayInputActive() {
    return gameState.currentScreen === 'GAME' && !gameState.isDialogueActive &&
           !gameState.isPaused && !activePuzzle;
}

glCanvas.addEventListener('click', () => {
    if (gameplayInputActive() && document.pointerLockElement !== glCanvas) {
        glCanvas.requestPointerLock();
    }
});

document.addEventListener('mousemove', e => {
    if (document.pointerLockElement !== glCanvas) return;
    camYaw   -= e.movementX * 0.0022;
    camPitch -= e.movementY * 0.0022;
    camPitch = Math.max(-1.45, Math.min(1.45, camPitch));
});

// Release the mouse whenever a UI surface takes over (dialogue choices,
// pause menu, puzzles, start menu) so the cursor is usable.
function syncPointerLock() {
    if (document.pointerLockElement === glCanvas && !gameplayInputActive()) {
        document.exitPointerLock();
    }
}

// ---- PLAYER UPDATE (movement, sprint, rest — mirrors the 2D gameLoop) ----
function updatePlayer3d() {
    // Sprint — exhaustion flag prevents oscillation when stamina hits 0
    if (gameState.stamina <= 0) gameState.staminaExhausted = true;
    if (gameState.staminaExhausted && gameState.stamina >= 2.0) gameState.staminaExhausted = false;

    gameState.isSprinting = shiftHeld && !gameState.staminaExhausted && gameState.stamina > 0 && !gameState.isDialogueActive;
    if (gameState.isSprinting) {
        gameState.stamina = Math.max(0, gameState.stamina - 0.04);
    } else if (gameState.stamina < gameState.maxStamina) {
        const regenRate = gameState.inventory.includes('Karkadeh') ? 0.10
            : gameState.inventory.includes('Mint Tea') ? 0.08 : 0.04;
        gameState.stamina = Math.min(gameState.maxStamina, gameState.stamina + regenRate);
    }
    {
        const pct = (gameState.stamina / gameState.maxStamina) * 100;
        const bar = document.getElementById('stamina-bar-fill');
        const txt = document.getElementById('stat-stamina');
        if (bar) bar.style.width = pct + '%';
        if (txt) txt.innerText = gameState.stamina.toFixed(1);
    }

    // Rest — takes ~3 seconds, restores 5 sanity (same numbers as 2D)
    if (gameState.isResting) {
        gameState.restTimer++;
        if (gameState.restTimer >= 180) {
            increaseSanity(5.0);
            gameState.restTimer = 0;
            gameState.isResting = false;
        }
    }

    if (gameState.isDialogueActive || gameState.isResting || gameState.isPaused || activePuzzle) return;

    // Keyboard turning (mouse-free fallback)
    if (isHeld('arrowleft'))  camYaw += 0.045;
    if (isHeld('arrowright')) camYaw -= 0.045;

    let moveF = 0, moveR = 0;
    if (isHeld('w') || isHeld('arrowup'))   moveF += 1;
    if (isHeld('s') || isHeld('arrowdown')) moveF -= 1;
    if (isHeld('a')) moveR -= 1;
    if (isHeld('d')) moveR += 1;
    if (moveF === 0 && moveR === 0) return;

    const speed = player.speed * (gameState.isSprinting ? 2 : 1);
    // Camera-relative directions on the ground plane (yaw 0 faces -z / "2D north")
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
    const rx =  Math.cos(camYaw), rz = -Math.sin(camYaw);
    let dx = fx * moveF + rx * moveR;
    let dz = fz * moveF + rz * moveR;
    const len = Math.hypot(dx, dz);
    dx = dx / len * speed;
    dz = dz / len * speed;

    gameState.walkBobPhase += 0.15 * (gameState.isSprinting ? 1.4 : 1);

    // Axis-separated AABB collision — identical rules to the 2D build
    const currentWalls = (mapWalls[currentMapKey] || []).filter(w => !w.isGate || !gameState.flags[w.gateFlag]);
    const testX = player.x + dx;
    const testY = player.y + dz;
    let blockedX = false, blockedY = false;
    for (const wall of currentWalls) {
        if (testX < wall.x + wall.w && testX + player.size > wall.x &&
            player.y < wall.y + wall.h && player.y + player.size > wall.y) { blockedX = true; }
        if (player.x < wall.x + wall.w && player.x + player.size > wall.x &&
            testY < wall.y + wall.h && testY + player.size > wall.y) { blockedY = true; }
    }
    if (!blockedX) player.x = testX;
    if (!blockedY) player.y = testY;

    player.x = Math.max(0, Math.min(player.x, WORLD.width  - player.size));
    player.y = Math.max(0, Math.min(player.y, WORLD.height - player.size));
}

// ---- INTERACTION BRIDGE ----
// Same proximity rule as the 2D build (player center within 60px of the
// object rect). Sets gameState.activeInteractableId, which the existing
// SPACE keydown handler in engine.js feeds into startDialogue().
function updateInteractions3d() {
    let interacting = null;
    const px = player.x + player.size / 2;
    const py = player.y + player.size / 2;

    activeMapObjects.forEach(o => {
        if (o.decorative || !o.interactScene) return;
        if (isObjectResolved(o)) return;
        if (px > o.x - 60 && px < o.x + o.w + 60 && py > o.y - 60 && py < o.y + o.h + 60) {
            interacting = o.interactScene;
        }
    });

    // Parked ministry car becomes interactable (mirrors 2D gameLoop)
    if (ministeryCar.parked && !gameState.flags.inspector_dealt && gameState.chapter === 1 && !interiorState.active) {
        if (px > ministeryCar.x - 60 && px < ministeryCar.x + ministeryCar.w + 60 &&
            py > ministeryCar.y - 60 && py < ministeryCar.y + ministeryCar.h + 60) {
            interacting = 'ch1_inspector';
        }
    }

    gameState.activeInteractableId = interacting;
    document.getElementById('interaction-prompt').classList.toggle(
        'hidden',
        !interacting || gameState.isDialogueActive || !!activePuzzle
    );
}

// ---- MINISTRY CAR (Chapter 1 drive-in) ----
let carGroup = null;

function buildMinistryCar() {
    carGroup = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(ministeryCar.w, 26, ministeryCar.h),
        new THREE.MeshLambertMaterial({ color: 0x1e2a3a })
    );
    body.position.y = 13;
    carGroup.add(body);
    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(ministeryCar.w - 24, 16, ministeryCar.h - 16),
        new THREE.MeshLambertMaterial({ color: 0x2d3e52 })
    );
    roof.position.y = 26 + 8;
    carGroup.add(roof);
    const label = makeLabelSprite('Ministry Car', '#f4e4b0');
    label.position.y = 60;
    carGroup.add(label);
    carGroup.visible = false;
    scene3.add(carGroup);
}

function updateMinistryCar3d() {
    if (!carGroup) return;
    if (gameState.chapter !== 1 || interiorState.active) {
        carGroup.visible = false;
        return;
    }
    // Drive-in state machine — ported from the 2D gameLoop
    if (gameState.flags.ministeryCar_snap && !ministeryCar.parked) {
        ministeryCar.y = ministeryCar.targetY;
        ministeryCar.parked = true;
        ministeryCar.active = false;
        gameState.flags.ministeryCar_snap = false;
    }
    if (gameState.flags.ministeryCar_called && !ministeryCar.active && !ministeryCar.parked) {
        ministeryCar.active = true;
    }
    if (ministeryCar.active && !ministeryCar.parked) {
        ministeryCar.y -= ministeryCar.speed;
        if (ministeryCar.y <= ministeryCar.targetY) {
            ministeryCar.y = ministeryCar.targetY;
            ministeryCar.parked = true;
            ministeryCar.active = false;
            gameState.flags.ministeryCar_parked = true;
        }
    }
    carGroup.visible = ministeryCar.active || ministeryCar.parked;
    carGroup.position.set(ministeryCar.x + ministeryCar.w / 2, 0, ministeryCar.y + ministeryCar.h / 2);
}

// ---- HOSTILES (3D bodies for the existing patrol/chase AI) ----
let hostileMeshes = new Map(); // hostile object -> { group, bodyMat, baseColor }

function syncHostiles3d() {
    // Create meshes for new hostiles
    for (const h of hostiles) {
        if (hostileMeshes.has(h)) continue;
        const group = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(h.def.color) });
        const body = new THREE.Mesh(new THREE.BoxGeometry(h.def.size, 55, h.def.size), bodyMat);
        body.position.y = 27.5;
        group.add(body);
        const label = makeLabelSprite(h.def.label, '#cccccc');
        label.position.y = 72;
        group.add(label);
        scene3.add(group);
        hostileMeshes.set(h, { group, bodyMat, baseColor: new THREE.Color(h.def.color) });
    }
    // Remove meshes whose hostiles are gone (clearHostiles replaces the array)
    for (const [h, entry] of hostileMeshes) {
        if (!hostiles.includes(h)) {
            scene3.remove(entry.group);
            hostileMeshes.delete(h);
        }
    }
    // Position + chase flicker
    for (const [h, entry] of hostileMeshes) {
        const bob = Math.sin(h.bobPhase) * 2;
        entry.group.position.set(h.x + h.def.size / 2, bob, h.y + h.def.size / 2);
        if (h.state === 'chase') {
            const pulse = 0.7 + Math.sin(h.bobPhase * 2) * 0.3;
            entry.bodyMat.color.setRGB(0.71 * pulse, 0.12 * pulse, 0.12 * pulse);
        } else {
            entry.bodyMat.color.copy(entry.baseColor);
        }
        entry.group.visible = h.state !== 'idle';
    }
}

// ---- CAMERA PLACEMENT ----
function positionCamera() {
    const cx = player.x + player.size / 2;
    const cz = player.y + player.size / 2;
    const bob = Math.sin(gameState.walkBobPhase) * 1.6;
    let shakeX = 0, shakeY = 0, shakeZ = 0;
    if (gameState.sanityState === 'FRACTURED') {
        shakeX = (Math.random() - 0.5) * 3;
        shakeY = (Math.random() - 0.5) * 2;
        shakeZ = (Math.random() - 0.5) * 3;
    }
    cam3.position.set(cx + shakeX, EYE_HEIGHT + bob + shakeY, cz + shakeZ);
    cam3.rotation.y = camYaw;
    cam3.rotation.x = camPitch;
}

// ---- SANITY FILTER MIRROR ----
// updateHUD() applies the CSS filter class to the 2D canvas; mirror it
// onto the WebGL canvas so STRAINED/FRACTURED tint the 3D view.
function syncSanityFilter() {
    if (glCanvas.className !== canvas.className) glCanvas.className = canvas.className;
}

// ---- OVERLAY DRAWING (reuses engine.js draw functions on #gameCanvas) ----
function drawOverlays() {
    const palette = getChapterPalette();

    // Screen-space atmosphere reused from engine.js: hallucination phantoms,
    // drifting dust motes, vignette (all canvas-space, engine-agnostic)
    drawPhantoms();
    drawAmbientDust(palette.ambientDust);

    const vigCX = canvas.width / 2, vigCY = canvas.height / 2;
    const vig = ctx.createRadialGradient(vigCX, vigCY, Math.min(canvas.width, canvas.height) * 0.25,
                                         vigCX, vigCY, Math.min(canvas.width, canvas.height) * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(0,0,0,${palette.vignette})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clarity flash (E key) — expanding ring from screen center
    if (clarityTimer > 0) {
        const ct = clarityTimer / 40;
        ctx.strokeStyle = `rgba(212,175,55,${ct * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(vigCX, vigCY, 50 + (1 - ct) * 80, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Rest progress bar — screen-centered (the 2D build draws it over the player)
    if (gameState.isResting) {
        const progress = Math.min(1, gameState.restTimer / 180);
        const barW = 140, barH = 8;
        const barX = canvas.width / 2 - barW / 2;
        const barY = canvas.height * 0.6;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(barX, barY, barW * progress, barH);
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('Resting...', canvas.width / 2, barY - 8);
        ctx.textAlign = 'left';
    }

    // Interior enter/exit fade — also advances the transition state machine
    drawInteriorFade();

    // Puzzle mini-game overlay (clicks already handled by engine.js)
    if (activePuzzle) drawPuzzle();

    // Fade in from black when the game first starts (mirrors 2D gameLoop)
    if (menuPhase === 'GAMEFADEIN' && overlayAlpha > 0) {
        ctx.fillStyle = `rgba(0,0,0,${overlayAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        overlayAlpha = Math.max(0, overlayAlpha - 0.022);
        if (overlayAlpha <= 0) menuPhase = 'DONE';
    }

    // Pause menu (clicks already handled by engine.js)
    if (gameState.isPaused) drawPauseMenu();
}

// ---- MAIN LOOP ----
function gameLoop3d() {
    requestAnimationFrame(gameLoop3d);
    resizeRendererIfNeeded();

    // Clear the 2D overlay every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState.currentScreen === 'START_MENU') {
        // Reuse the full 2D start screen (handles its own fade + startGame)
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawStartScreen();
        builtSignature = null; // force a fresh world build on game start
        syncSanityFilter();
        return;
    }

    ensureWorldBuilt();
    syncPointerLock();
    updatePlayer3d();
    updateHostiles();    // existing patrol/chase/catch AI, unchanged
    updatePhantoms();    // existing sanity hallucination logic, unchanged
    updateMinistryCar3d();
    updateInteractions3d();
    syncHostiles3d();
    syncWorldVisibility();
    updateCamera();      // keeps the 2D camera roughly centered for overlay draw math
    positionCamera();
    renderer3.render(scene3, cam3);

    drawOverlays();
    syncSanityFilter();
}

gameLoop3d();
