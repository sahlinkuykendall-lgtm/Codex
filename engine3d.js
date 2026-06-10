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

    scene3.add(worldGroup);
    builtSignature = currentWorldSignature();
}

function ensureWorldBuilt() {
    if (builtSignature !== currentWorldSignature()) buildWorld();
}

// ---- CAMERA PLACEMENT ----
function positionCamera() {
    const cx = player.x + player.size / 2;
    const cz = player.y + player.size / 2;
    cam3.position.set(cx, EYE_HEIGHT, cz);
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
    updateCamera();      // keeps the 2D camera roughly centered for overlay draw math
    positionCamera();
    renderer3.render(scene3, cam3);

    drawOverlays();
    syncSanityFilter();
}

gameLoop3d();
