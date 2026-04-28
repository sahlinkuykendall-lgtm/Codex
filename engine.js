window.onerror = function(message, source, lineno, colno, error) {
    console.log("Error: " + message + " at line " + lineno);
    return false;
};

// ---- AUDIO (Web Audio API — no file downloads) ----
let _audioCtx = null;
function _getAudio() {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return _audioCtx;
}
function _tone(freq, dur, type = 'sine', vol = 0.12) {
    try {
        const ctx = _getAudio();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = type;
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
    } catch(e) {}
}
function sndClick()    { _tone(480, 0.05, 'square', 0.07); }
function sndInteract() { _tone(340, 0.14, 'sine',   0.09); }
function sndDialogue() { _tone(660, 0.07, 'sine',   0.06); }
function sndChoice()   { _tone(560, 0.11, 'sine',   0.09); }
function sndFail()     { _tone(180, 0.28, 'sawtooth', 0.10); }
function sndSuccess()  { _tone(880, 0.22, 'sine',   0.09); }
function sndPickup()   { _tone(700, 0.10, 'triangle', 0.10); _tone(900, 0.10, 'triangle', 0.08); }

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280; canvas.height = 720;

let camera = { x: 0, y: 0, w: 1280, h: 720 };
let player = { x: 1000, y: 1000, size: 30, speed: 2, color: '#d4af37' };

// ---- INPUT SYSTEM ----
// Use a Set for held keys — immune to case issues, sticky-key bugs, and repeat events.
// heldKeys: keys currently held down (WASD, Shift, etc.)
// All keys stored lowercase for movement checks.
const heldKeys = new Set();

function isHeld(key) { return heldKeys.has(key.toLowerCase()); }
function isMoveKey(k) { return ['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k); }

// Shift tracked separately — cleared on release or window blur
let shiftHeld = false;

// ---- DEVELOPER ZOOM ----
let devZoom = 1.0; // 1.0 = normal, <1 = zoomed out, >1 = zoomed in
const DEV_ZOOM_MIN = 0.25;
const DEV_ZOOM_MAX = 3.0;
const DEV_ZOOM_STEP = 0.1;

// ============================================================
// ---- PUZZLE SYSTEM ----
// Puzzles are triggered by interacting with puzzle objects.
// Each puzzle has a type: 'sequence', 'symbol', or 'combination'.
// activePuzzle = null | { id, type, state, ... }
// ============================================================
let activePuzzle = null;

const PUZZLES = {
    // Ch1: Glyph lock on tunnel gate — press symbols in correct order
    'puzzle_glyph_lock': {
        type: 'sequence',
        title: 'Glyph Lock',
        hint: 'The lock has four glyph buttons. The order is scratched faintly on the stone beside it.',
        sequence: [2, 0, 3, 1],   // correct order of button indices
        glyphs: ['𓂀', '𓃭', '𓅓', '𓆑'],
        rewardFlag: 'glyph_lock_solved',
        rewardScene: 'puzzle_glyph_solved',
        failScene: 'puzzle_glyph_fail',
    },
    // Ch2 TRAP: Pressure plate sequence — step on plates in right order
    'puzzle_plates': {
        type: 'sequence',
        title: 'Pressure Plates',
        hint: 'Four stone plates. The carvings suggest an order: serpent, eye, bird, hand.',
        sequence: [1, 0, 2, 3],
        glyphs: ['𓆑', '𓂀', '𓅓', '𓂧'],
        rewardFlag: 'trap_plates_solved',
        rewardScene: 'puzzle_plates_solved',
        failScene: 'puzzle_plates_fail',
    },
    // Ch2 SECRET: Resonance puzzle — match amber frequencies
    'puzzle_resonance': {
        type: 'symbol',
        title: 'Amber Resonance',
        hint: 'Three amber nodes glow at different intensities. Match the pattern shown on the wall.',
        target: [2, 1, 3],     // target values (1–3)
        current: [1, 1, 1],
        rewardFlag: 'resonance_solved',
        rewardScene: 'puzzle_resonance_solved',
        failScene: null,       // no fail — just keeps going
    },
    // Ch3: Market cipher — decode a vendor's message
    'puzzle_cipher': {
        type: 'combination',
        title: 'The Vendor\'s Code',
        hint: 'The spice merchant speaks in numbers. "Three birds, one eye, two hands." Three dials.',
        combination: [3, 1, 2],
        current: [1, 1, 1],
        min: 1, max: 5,
        rewardFlag: 'cipher_solved',
        rewardScene: 'puzzle_cipher_solved',
        failScene: null,
    },
    // Ch4: Heart altar — symbol alignment to open the Heart chamber
    'puzzle_heart_altar': {
        type: 'symbol',
        title: 'The Heart Altar',
        hint: 'Four panels surround the altar, each with a symbol. Iry\'s notes say the sequence mirrors the city\'s founding myth.',
        target: [3, 2, 1, 4],
        current: [1, 1, 1, 1],
        rewardFlag: 'heart_altar_solved',
        rewardScene: 'ch4_heart',
        failScene: 'puzzle_altar_fail',
    },
};

function startPuzzle(id) {
    const def = PUZZLES[id];
    if (!def || gameState.flags[def.rewardFlag]) return; // already solved
    activePuzzle = {
        id,
        def,
        input: [],       // for sequence puzzles
        current: def.current ? [...def.current] : [],
        phase: 'active', // 'active' | 'solved' | 'failed'
        flashTimer: 0,
        flashColor: null,
    };
    closeDialogue();
}

function closePuzzle() { activePuzzle = null; }

// ============================================================
// ---- HOSTILE SYSTEM ----
// Hostiles are NPC threats. When they catch the player:
//   - sanity drops
//   - player is pushed back
//   - some hostiles trigger a dialogue (confrontation)
// ============================================================
let hostiles = [];

const HOSTILE_DEFS = {
    'guard_ministry': {
        color: '#2a2a8a', size: 28, speed: 1.8, detectRange: 180, chaseRange: 400,
        label: 'Ministry Guard', catchScene: 'hostile_ministry_caught', sanityDmg: 1.5, oneTimeCatch: true,
    },
    'figure_dark': {
        color: '#0a0a0a', size: 24, speed: 1.4, detectRange: 220, chaseRange: 500,
        label: '???', catchScene: 'hostile_figure_caught', sanityDmg: 2.5,
    },
    'worker_panicked': {
        color: '#5c3a1a', size: 26, speed: 2.2, detectRange: 120, chaseRange: 250,
        label: 'Panicked Worker', catchScene: 'hostile_worker_caught', sanityDmg: 0.5, oneTimeCatch: true,
    },
    'samir_hostile': {
        color: '#4b3030', size: 28, speed: 1.6, detectRange: 200, chaseRange: 380,
        label: 'Samir', catchScene: 'hostile_samir_caught', sanityDmg: 1.0,
    },
};

// Spawn a hostile at x,y with given def key
function spawnHostile(defKey, x, y, patrolPoints) {
    const def = HOSTILE_DEFS[defKey];
    if (!def) return;
    hostiles.push({
        defKey, x, y, def,
        state: 'patrol',  // 'patrol' | 'chase' | 'caught' | 'idle'
        patrol: patrolPoints || [{ x, y }],
        patrolIdx: 0,
        patrolTimer: 0,
        catchCooldown: 0,
        bobPhase: Math.random() * Math.PI * 2,
    });
}

// Clear all hostiles (called on chapter load / interior enter)
function clearHostiles() { hostiles = []; }

function updateHostiles() {
    if (gameState.isPaused || gameState.isDialogueActive || activePuzzle) return;

    hostiles.forEach(h => {
        if (h.state === 'caught') return;
        if (h.state === 'idle') return; // permanently deactivated after one-time catch
        if (h.catchCooldown > 0) { h.catchCooldown--; return; }

        const dx = player.x - h.x;
        const dy = player.y - h.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < h.def.detectRange) {
            h.state = 'chase';
        } else if (h.state === 'chase' && dist > h.def.chaseRange) {
            h.state = 'patrol';
        }

        let moveX = 0, moveY = 0;
        if (h.state === 'chase') {
            moveX = (dx / dist) * h.def.speed;
            moveY = (dy / dist) * h.def.speed;
        } else {
            // Simple patrol between points
            const target = h.patrol[h.patrolIdx];
            const pdx = target.x - h.x;
            const pdy = target.y - h.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pdist < 8) {
                h.patrolIdx = (h.patrolIdx + 1) % h.patrol.length;
            } else {
                moveX = (pdx / pdist) * (h.def.speed * 0.5);
                moveY = (pdy / pdist) * (h.def.speed * 0.5);
            }
        }

        h.x += moveX;
        h.y += moveY;
        h.bobPhase += 0.12;

        // Catch check
        if (dist < h.def.size + player.size - 4) {
            h.state = 'caught';
            h.catchCooldown = 120;
            decreaseSanity(h.def.sanityDmg);
            // Push player back
            const pushDist = 80;
            player.x -= (dx / dist) * pushDist;
            player.y -= (dy / dist) * pushDist;
            if (h.def.catchScene) startDialogue(h.def.catchScene);
            // One-time hostiles go permanently idle after first encounter
            if (h.def.oneTimeCatch) {
                h.hasCaught = true;
                setTimeout(() => { h.state = 'idle'; h.def.detectRange = 0; }, 3000);
            } else {
                setTimeout(() => { h.state = 'patrol'; }, 2000);
            }
        }
    });
}

function drawHostiles() {
    hostiles.forEach(h => {
        const hx = h.x - camera.x;
        const hy = h.y - camera.y;
        if (hx < -60 || hx > canvas.width + 60 || hy < -60 || hy > canvas.height + 60) return;

        const bob = Math.sin(h.bobPhase) * 2;
        const isChasing = h.state === 'chase';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(hx + 2, hy + 3 + bob, h.def.size, h.def.size);

        // Body — flicker red when chasing
        ctx.fillStyle = isChasing
            ? `rgba(180,30,30,${0.7 + Math.sin(h.bobPhase * 2) * 0.3})`
            : h.def.color;
        ctx.fillRect(hx, hy + bob, h.def.size, h.def.size);

        // Detection ring when chasing
        if (isChasing) {
            ctx.strokeStyle = 'rgba(200,30,30,0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(hx + h.def.size/2, hy + h.def.size/2 + bob, h.def.detectRange, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Label
        ctx.font = '11px Courier New';
        ctx.textAlign = 'center';
        ctx.fillStyle = isChasing ? '#ff4444' : '#aaa';
        ctx.fillText(h.def.label, hx + h.def.size/2, hy - 4 + bob);
    });
}



// ---- START SCREEN STATE ----
let menuTime = 0;
let overlayAlpha = 1.0;   // 1 = black, 0 = transparent — used for both fade-in and fade-out
let menuPhase = 'FADEIN'; // FADEIN → IDLE → FADEOUT

// Drifting dust particles
const menuParticles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.8 + 0.4,
    vy: -(Math.random() * 0.25 + 0.05),
    vx: (Math.random() - 0.5) * 0.15,
    alpha: Math.random() * 0.35 + 0.05
}));

// Scrolling amber channels (diagonal)
const menuChannels = [
    { ox: 80,  oy: 0,   angle: 18, speed: 0.18, w: 1.5, a: 0.18 },
    { ox: 340, oy: 0,   angle: 12, speed: 0.11, w: 1.0, a: 0.11 },
    { ox: 580, oy: 0,   angle: 20, speed: 0.15, w: 2.0, a: 0.14 },
    { ox: 720, oy: 0,   angle: 10, speed: 0.09, w: 1.0, a: 0.08 },
    { ox: 200, oy: 600, angle: -15,speed: 0.13, w: 1.2, a: 0.10 },
];
let channelOffsets = menuChannels.map(() => 0);

function updateCamera() {
    // Apply dev zoom: zoom out shows more world, zoom in shows less
    camera.w = Math.round(1280 / devZoom);
    camera.h = Math.round(720  / devZoom);
    // For worlds smaller than the camera view, center them
    if (WORLD.width <= camera.w) {
        camera.x = -(camera.w - WORLD.width) / 2;
    } else {
        camera.x = player.x - camera.w / 2;
        camera.x = Math.max(0, Math.min(camera.x, WORLD.width - camera.w));
    }
    if (WORLD.height <= camera.h) {
        camera.y = -(camera.h - WORLD.height) / 2;
    } else {
        camera.y = player.y - camera.h / 2;
        camera.y = Math.max(0, Math.min(camera.y, WORLD.height - camera.h));
    }
}

// ---- INTERIOR SYSTEM ----
// Tracks whether the player is inside a building.
// Major rooms: full fade + dedicated mapKey
// Minor rooms: tight camera box + palette + label (no map swap)

let interiorState = {
    active: false,
    mapKey: null,       // the interior's mapKey string
    returnMapKey: null, // what to go back to on exit
    returnX: 0,
    returnY: 0,
    label: '',
    type: 'major',      // 'major' (fade swap) | 'minor' (tight box)
    fadeAlpha: 0,
    fadeDir: 0          // 1 = fading in (entering), -1 = fading out (exiting), 0 = idle
};

// Major building interiors (defined in data.js mapWalls/mapObjects under their key)
const MAJOR_INTERIORS = {
    'INT_TENT':      { label: "Ellis' Tent",         bgColor: '#1a1208', worldW: 500,  worldH: 520  },
    'INT_FOREMAN':   { label: "Foreman's Office",     bgColor: '#160e08', worldW: 600,  worldH: 520  },
    'INT_DORM':      { label: "Worker Dormitory",     bgColor: '#100c08', worldW: 700,  worldH: 520  },
    'INT_SAFEHOUSE': { label: "Yusra's Safehouse",    bgColor: '#2a1f1a', worldW: 600,  worldH: 620  },
    'INT_HOOKAH':    { label: "Hookah Lounge",        bgColor: '#1a0f1a', worldW: 600,  worldH: 520  },
    'INT_HANGAR':    { label: "The Hangar",           bgColor: '#0d0e10', worldW: 800,  worldH: 720  },
    'INT_TARIQ_FLAT':{ label: "Tariq's Family Flat",  bgColor: '#1a1510', worldW: 600,  worldH: 520  },
    'INT_HALBERD':   { label: "Halberd's Office",     bgColor: '#0e0e14', worldW: 500,  worldH: 520  },
};

function enterBuilding(interiorKey, exitX, exitY) {
    if (interiorState.active) return; // already inside
    const def = MAJOR_INTERIORS[interiorKey];
    if (!def) return;
    interiorState.returnMapKey = currentMapKey;
    interiorState.returnX = exitX || player.x;
    interiorState.returnY = exitY || player.y;
    interiorState.mapKey = interiorKey;
    interiorState.label = def.label;
    interiorState.type = 'major';
    interiorState.fadeAlpha = 0;
    interiorState.fadeDir = 1; // start fade to black
    interiorState.pendingEnter = true;
}

function _completeEnter() {
    const def = MAJOR_INTERIORS[interiorState.mapKey];
    interiorState.active = true;
    interiorState.pendingEnter = false;
    currentMapKey = interiorState.mapKey;
    WORLD = { width: def.worldW, height: def.worldH };
    // Spawn player in center horizontally, 80px above south wall (not right against it)
    player.x = def.worldW / 2 - player.size / 2;
    player.y = def.worldH - 120;
    activeMapObjects = mapObjects[interiorState.mapKey] || [];
    canvas.style.backgroundColor = def.bgColor;
    interiorState.fadeDir = -1;
    clearHostiles();
    updateHUD();
    if (gameState.flags._pendingTentCodexScene) {
        gameState.flags._pendingTentCodexScene = false;
        startDialogue('ch1_all_missions_complete');
    }
}

function exitBuilding() {
    if (!interiorState.active) return;
    interiorState.fadeDir = 1; // fade to black
    interiorState.pendingExit = true;
}

function _completeExit() {
    interiorState.active = false;
    interiorState.pendingExit = false;
    currentMapKey = interiorState.returnMapKey;
    // Restore world size from chapter
    const chapterWorldSizes = {
        1: { width: 2400, height: 2200 },
        3: { width: 3600, height: 3200 },
        4: { width: 4000, height: 4000 },
        5: { width: 3600, height: 3200 },
        6: { width: 3200, height: 3200 },
    };
    WORLD = chapterWorldSizes[gameState.chapter] || { width: 2000, height: 2000 };
    player.x = interiorState.returnX;
    player.y = interiorState.returnY;
    // Restore map objects for the outer map
    activeMapObjects = mapObjects[currentMapKey] || [];
    // Restore bg color
    const bgColors = { 1: '#1a1a1a', 'MARKET': '#1a1410', 'CITY': '#050510', 'AIRFIELD': '#111', 'GATE': '#030305' };
    canvas.style.backgroundColor = bgColors[currentMapKey] || '#111';
    interiorState.fadeDir = -1;
    updateHUD();
}

// Fade into tent interior before showing the ch1_all_missions_complete scene
function enterTentForCodexScene() {
    enterBuilding('INT_TENT', player.x, player.y);
    // After fade completes, dialogue fires via _completeEnter hook below
    gameState.flags._pendingTentCodexScene = true;
}

function drawInteriorFade() {
    if (interiorState.fadeDir === 0) return;
    if (interiorState.fadeDir === 1) {
        interiorState.fadeAlpha = Math.min(1, interiorState.fadeAlpha + 0.06);
        if (interiorState.fadeAlpha >= 1) {
            if (interiorState.pendingEnter) _completeEnter();
            else if (interiorState.pendingExit) _completeExit();
            interiorState.fadeDir = -1;
        }
    } else {
        interiorState.fadeAlpha = Math.max(0, interiorState.fadeAlpha - 0.06);
        if (interiorState.fadeAlpha <= 0) interiorState.fadeDir = 0;
    }
    if (interiorState.fadeAlpha > 0) {
        ctx.fillStyle = `rgba(0,0,0,${interiorState.fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Room label at peak of fade
    if (interiorState.fadeAlpha > 0.5 && (interiorState.pendingEnter || interiorState.active)) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(212,175,55,${(interiorState.fadeAlpha - 0.5) * 2})`;
        ctx.font = '14px Courier New';
        ctx.fillText(interiorState.label.toUpperCase(), 400, 305);
        ctx.restore();
    }
}


function loadChapterTwo() {
    gameState.chapter = 2;
    clearHostiles();
    if (gameState.currentRoute === 'TRAP') {
        WORLD = { width: 3000, height: 3000 }; player.x = 300; player.y = 200;
        // Panicked worker patrols the trap tunnel
        spawnHostile('worker_panicked', 800, 1200, [
            { x: 800, y: 1200 }, { x: 1200, y: 1200 }, { x: 1200, y: 1800 }, { x: 800, y: 1800 }
        ]);
        // Samir is initially hostile in deeper sections
        spawnHostile('samir_hostile', 1500, 2000, [
            { x: 1500, y: 2000 }, { x: 1800, y: 2000 }
        ]);
    } else if (gameState.currentRoute === 'CUTTHROAT') {
        WORLD = { width: 2500, height: 2500 }; player.x = 1200; player.y = 200;
        spawnHostile('figure_dark', 1150, 1000, [
            { x: 1150, y: 1000 }, { x: 1350, y: 1200 }, { x: 1150, y: 1500 }
        ]);
    } else {
        WORLD = { width: 2500, height: 2500 }; player.x = 1200; player.y = 200;
    }
    currentMapKey = gameState.currentRoute;
    activeMapObjects = mapObjects[gameState.currentRoute] || [];
    canvas.style.backgroundColor = '#050505';
    updateHUD();
    startDialogue('ch2_start_' + gameState.currentRoute.toLowerCase());
}

function loadChapterThree() {
    gameState.chapter = 3;
    clearHostiles();
    currentMapKey = 'MARKET';
    WORLD = { width: 3600, height: 3200 }; player.x = 1800; player.y = 3000;
    activeMapObjects = mapObjects['MARKET'];
    // Ministry informant patrols the market
    spawnHostile('guard_ministry', 2200, 2400, [
        { x: 2200, y: 2400 }, { x: 2800, y: 2400 }, { x: 2800, y: 1800 }, { x: 2200, y: 1800 }
    ]);
    canvas.style.backgroundColor = '#1a1410';
    updateHUD(); startDialogue('ch3_start');
}

function loadChapterFour() {
    gameState.chapter = 4;
    clearHostiles();
    currentMapKey = 'CITY';
    WORLD = { width: 4000, height: 4000 }; player.x = 2000; player.y = 3700;
    activeMapObjects = mapObjects['CITY'];
    // Dark figure patrols city outskirts — the city watching
    spawnHostile('figure_dark', 600, 2000, [
        { x: 600, y: 2000 }, { x: 600, y: 1000 }, { x: 1000, y: 600 }
    ]);
    spawnHostile('figure_dark', 3400, 2000, [
        { x: 3400, y: 2000 }, { x: 3400, y: 1000 }, { x: 3000, y: 600 }
    ]);
    canvas.style.backgroundColor = '#050510';
    updateHUD(); startDialogue('ch4_start');
}

function loadChapterFive() {
    gameState.chapter = 5;
    clearHostiles();
    currentMapKey = 'AIRFIELD';
    WORLD = { width: 3600, height: 3200 }; player.x = 1800; player.y = 3000;
    activeMapObjects = mapObjects['AIRFIELD'];
    // Airfield guards patrolling perimeter
    spawnHostile('guard_ministry', 800, 1200, [
        { x: 800, y: 1200 }, { x: 2400, y: 1200 }
    ]);
    canvas.style.backgroundColor = '#111';
    updateHUD(); startDialogue('ch5_start');
}

function loadChapterSix() {
    gameState.chapter = 6;
    clearHostiles();
    currentMapKey = 'GATE';
    WORLD = { width: 3200, height: 3200 }; player.x = 1600; player.y = 3000;
    activeMapObjects = mapObjects['GATE'];
    // Two dark figures flank the approach
    spawnHostile('figure_dark', 400, 2000, [{ x: 400, y: 2000 }, { x: 400, y: 1200 }]);
    spawnHostile('figure_dark', 2800, 2000, [{ x: 2800, y: 2000 }, { x: 2800, y: 1200 }]);
    canvas.style.backgroundColor = '#030305';
    updateHUD(); startDialogue('ch6_start');
}

function loadChapterSeven() {
    gameState.chapter = 7;
    clearHostiles();
    currentMapKey = 'FINAL';
    WORLD = { width: 1280, height: 720 }; player.x = 640; player.y = 620;
    activeMapObjects = mapObjects['FINAL'];
    canvas.style.backgroundColor = '#000';
    updateHUD(); startDialogue('ch7_start');
}

// ---- SANITY & REST ----
function attemptRest(id) {
    const now = Date.now();
    const COOLDOWN_MS = 120000; // 2 minutes real time before reuse
    if (!gameState.restCooldowns) gameState.restCooldowns = {};
    const lastUsed = gameState.restCooldowns[id] || 0;
    const elapsed = now - lastUsed;

    // Chapter-specific rest sites are still one-time (story-important)
    const ONE_TIME = ['ch4_rest_hearth', 'ch5_tariq_flat', 'ch5_hangar_rest', 'ch6_antechamber_rest', 'int_tent_cot'];
    if (ONE_TIME.includes(id)) {
        if (!gameState.usedRestSites.includes(id)) {
            gameState.isResting = true;
            gameState.usedRestSites.push(id);
            closeDialogue();
        } else {
            startDialogue('rest_already_used');
        }
        return;
    }

    // Brazier and camp fires — reusable with cooldown
    if (elapsed > COOLDOWN_MS || lastUsed === 0) {
        gameState.isResting = true;
        gameState.restCooldowns[id] = now;
        closeDialogue();
    } else {
        const secsLeft = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        startDialogue('rest_cooling_down');
    }
}

function increaseSanity(amount) {
    gameState.sanity = Math.min(gameState.maxSanity || 10.0, gameState.sanity + amount);
    updateHUD();
}

function decreaseSanity(amount) {
    gameState.sanity = Math.max(0.0, gameState.sanity - amount);
    updateHUD();
}

// ---- HUD ----
function updateHUD() {
    if (gameState.sanity >= 8.0) {
        gameState.sanityState = 'CALM';
    } else if (gameState.sanity >= 5.0) {
        gameState.sanityState = 'STRAINED';
    } else {
        gameState.sanityState = 'FRACTURED';
    }
    document.getElementById('stat-sanity').innerText = gameState.sanityState;
    const staminaPercent = (gameState.stamina / gameState.maxStamina) * 100;
    document.getElementById('stat-stamina').innerText = gameState.stamina.toFixed(1);
    document.getElementById('stamina-bar-fill').style.width = staminaPercent + '%';
    document.getElementById('stat-funds').innerText = gameState.funds;
    canvas.className = gameState.sanityState === 'STRAINED'
        ? 'strained-filter'
        : (gameState.sanityState === 'FRACTURED' ? 'fractured-filter' : '');
}

function addJournalNote(title, text) {
    if (!gameState.journalNotes) gameState.journalNotes = [];
    if (!gameState.journalNotes.find(n => n.title === title)) {
        gameState.journalNotes.push({ title, text });
    }
}

function resetGameState() {
    // Full reset of all game state — called on Return to Menu and on startGame
    gameState.currentScreen = 'START_MENU';
    gameState.chapter = 1;
    gameState.sanity = 10.0; gameState.maxSanity = 10.0; gameState.sanityState = 'CALM';
    gameState.isResting = false; gameState.restTimer = 0;
    gameState.repLocal = 0; gameState.repAcademic = 0; gameState.repMinistry = 0;
    gameState.knowledgeCodex = 0; gameState.knowledgeHermetic = 0; gameState.knowledgeAtlantean = 0;
    gameState.funds = 2000; gameState.bodyCount = 0;
    gameState.currentRoute = null;
    gameState.trustTariq = 0; gameState.trustMaren = 0; gameState.trustIry = 0; gameState.trustYusra = 0;
    gameState.inventory = ['Field Journal']; gameState.mintTeaCount = 0; gameState.usedRestSites = []; gameState.restCooldowns = {};
    gameState.stamina = 10.0; gameState.maxStamina = 10.0; gameState.isSprinting = false; gameState.staminaExhausted = false;
    gameState.journalNotes = []; gameState.devChapterMenuOpen = false;
    gameState.walkBobPhase = 0; gameState.isPaused = false;
    gameState.isDialogueActive = false; gameState.activeInteractableId = null;
    // Reset all flags to false
    Object.keys(gameState.flags).forEach(k => { gameState.flags[k] = false; });
    // Reset interior state
    interiorState.active = false; interiorState.mapKey = null; interiorState.returnMapKey = null;
    interiorState.fadeAlpha = 0; interiorState.fadeDir = 0;
    interiorState.pendingEnter = false; interiorState.pendingExit = false;
    // Reset puzzle
    activePuzzle = null;
    // Reset hostiles
    clearHostiles();
    // Reset map
    currentMapKey = 1;
    WORLD = { width: 2400, height: 2200 };
    activeMapObjects = mapObjects[1];
    // Reset player
    player.x = 1060; player.y = 1680;
    // Hide HUD
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('hud-bottomleft').classList.add('hidden');
    document.getElementById('hud-hint').classList.add('hidden');
    document.getElementById('ui-overlay').classList.add('hidden');
    canvas.style.backgroundColor = '#1a1a1a';
}

// ---- GAME START ----
function startGame() {
    gameState.currentScreen = 'GAME';
    currentMapKey = 1;
    WORLD = { width: 2400, height: 2200 };
    // Spawn at tent compound south entrance — player "steps out of tent"
    player.x = 1060; player.y = 1680;
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('hud-bottomleft').classList.remove('hidden');
    document.getElementById('hud-hint').classList.remove('hidden');
    clearHostiles();
    // Ministry guard patrols east perimeter
    spawnHostile('guard_ministry', 1900, 1600, [
        { x: 1900, y: 1600 }, { x: 2200, y: 1600 }, { x: 2200, y: 1800 }, { x: 1900, y: 1800 }
    ]);
    // Panicked worker wanders north of dig zone (clear space between outcrops)
    spawnHostile('worker_panicked', 1400, 600, [
        { x: 1400, y: 600 }, { x: 1700, y: 600 }, { x: 1700, y: 780 }, { x: 1400, y: 780 }
    ]);
    updateHUD();
    // Original opening: Ellis in tent with the Codex — scene1_start fires first
    startDialogue('scene1_start');
    overlayAlpha = 1.0;
    menuPhase = 'GAMEFADEIN';
}

// ---- START SCREEN DRAWING ----
function drawStartScreen() {
    menuTime++;

    // Update channel scroll offsets
    menuChannels.forEach((ch, i) => { channelOffsets[i] += ch.speed; });

    // Update particles
    menuParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
    });

    // 1 — Deep background
    ctx.fillStyle = '#080604';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2 — Pyramid silhouettes (bottom) — centered on 1280 wide
    const drawPyramid = (cx, baseY, halfBase, height, alpha) => {
        ctx.beginPath();
        ctx.moveTo(cx, baseY - height);
        ctx.lineTo(cx - halfBase, baseY);
        ctx.lineTo(cx + halfBase, baseY);
        ctx.closePath();
        ctx.fillStyle = `rgba(16, 11, 6, ${alpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(80, 55, 20, ${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    };
    drawPyramid(640, 740, 420, 320, 1.0);   // centre, large
    drawPyramid(160, 740, 220, 190, 0.85);  // left, small
    drawPyramid(1120, 740, 260, 210, 0.85); // right, mid

    // 3 — Amber channel lines
    ctx.save();
    menuChannels.forEach((ch, i) => {
        const offset = channelOffsets[i];
        const rad = (ch.angle * Math.PI) / 180;
        const len = 1200;
        const startX = ch.ox + Math.sin(rad) * offset;
        const startY = ch.oy + Math.cos(rad) * offset;
        const endX = startX + Math.cos(rad) * len;
        const endY = startY - Math.sin(rad) * len;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(212, 175, 55, ${ch.a})`;
        ctx.lineWidth = ch.w;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
    });
    ctx.restore();

    // 4 — Dust particles
    menuParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 170, 100, ${p.alpha})`;
        ctx.fill();
    });

    // 5 — Centre vignette (radial dark overlay) — centered on 1280x720
    const vignette = ctx.createRadialGradient(640, 360, 100, 640, 360, 680);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.72)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 6 — Decorative top rule — centered
    const ruleY = 220;
    ctx.strokeStyle = 'rgba(212,175,55,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(440, ruleY); ctx.lineTo(840, ruleY); ctx.stroke();
    // Diamond accents
    const diamond = (x, y, r) => {
        ctx.beginPath();
        ctx.moveTo(x, y - r); ctx.lineTo(x + r, y);
        ctx.lineTo(x, y + r); ctx.lineTo(x - r, y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(212,175,55,0.45)';
        ctx.fill();
    };
    diamond(640, ruleY, 4);
    diamond(540, ruleY, 2.5);
    diamond(740, ruleY, 2.5);

    // 7 — Main title — centered on 640
    ctx.save();
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.55)';
    ctx.shadowBlur = 22;
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 64px Courier New';
    ctx.fillText('THE CODEX OF GIZA', 640, 290);
    ctx.shadowBlur = 0;
    ctx.restore();

    // 8 — Subtitle rule
    const subRuleY = 318;
    ctx.strokeStyle = 'rgba(212,175,55,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(480, subRuleY); ctx.lineTo(800, subRuleY); ctx.stroke();

    // 9 — Tagline
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(190, 160, 90, 0.65)';
    ctx.font = '14px Courier New';
    ctx.fillText('A N   E X C A V A T I O N   I N   S E V E N   C H A P T E R S', 640, 348);
    ctx.restore();

    // 10 — Pulsing prompt
    const pulse = 0.55 + 0.45 * Math.sin(menuTime * 0.045);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(212, 175, 55, ${pulse})`;
    ctx.font = '16px Courier New';
    ctx.fillText('PRESS SPACE TO BEGIN', 640, 440);
    ctx.restore();

    // 11 — Bottom rule
    const botRuleY = 470;
    ctx.strokeStyle = 'rgba(212,175,55,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(500, botRuleY); ctx.lineTo(780, botRuleY); ctx.stroke();

    // 12 — Version tag
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(120, 100, 60, 0.4)';
    ctx.font = '12px Courier New';
    ctx.fillText('V2  —  ACT I', 640, 500);
    ctx.restore();

    // 13 — Smiley face (bottom-right corner)
    ctx.save();
    const sx = canvas.width - 30, sy = canvas.height - 30, sr = 16;
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = '#FFE600'; ctx.fill();
    ctx.strokeStyle = '#CC9900'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(sx - 5, sy - 5, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx + 5, sy - 5, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx, sy + 1, 8, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();

    // 14 — Overlay for fade transitions
    if (menuPhase === 'FADEIN') {
        overlayAlpha = Math.max(0, overlayAlpha - 0.018);
        if (overlayAlpha <= 0) menuPhase = 'IDLE';
    } else if (menuPhase === 'FADEOUT') {
        overlayAlpha = Math.min(1, overlayAlpha + 0.03);
        if (overlayAlpha >= 1) startGame();
    }
    if (overlayAlpha > 0) {
        ctx.fillStyle = `rgba(0,0,0,${overlayAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// ---- DIALOGUE ----
function startDialogue(id) {
    const scene = storyData[id];
    if (!scene) {
        console.warn('startDialogue: missing scene id "' + id + '"');
        return;
    }
    sndDialogue();
    gameState.isDialogueActive = true;
    document.getElementById('ui-overlay').classList.remove('hidden');

    // Support dynamic speaker/text — if they're functions, call them at display time.
    // Lets scenes adapt to current inventory / route / flags.
    const speaker = typeof scene.speaker === 'function' ? scene.speaker() : scene.speaker;
    const text    = typeof scene.text    === 'function' ? scene.text()    : scene.text;

    document.getElementById('speaker-name').innerText = speaker;
    document.getElementById('dialogue-text').innerText = text;

    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    const choices = scene.choices || [];
    choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'choice-button';
        btn.innerText = typeof c.text === 'function' ? c.text() : c.text;
        btn.onclick = (e) => {
            e.stopPropagation();
            sndChoice();
            if (c.onSelect) c.onSelect();
            if (c.nextScene) startDialogue(c.nextScene);
            else updateHUD();
        };
        container.appendChild(btn);
    });
}

function closeDialogue() {
    gameState.isDialogueActive = false;
    document.getElementById('ui-overlay').classList.add('hidden');
}

// ---- INPUTS ----
window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    // Add movement keys to held set (lowercase prevents Shift+W = 'W' case bug)
    if (isMoveKey(k)) heldKeys.add(k);
    if (e.key === 'Shift') shiftHeld = true;

    if (e.key === ' ') e.preventDefault();
    if (e.key === 'Escape') {
        e.preventDefault();
        if (activePuzzle) { closePuzzle(); return; }
        if (gameState.currentScreen === 'GAME' && !gameState.isDialogueActive) {
            gameState.isPaused = !gameState.isPaused;
        }
    }
    if (gameState.isPaused && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); gameState.isPaused = false;
    }
    if (e.key === ' ' && gameState.currentScreen === 'START_MENU' && menuPhase === 'IDLE') {
        menuPhase = 'FADEOUT'; overlayAlpha = 0;
    }
    if (e.key === ' ' && gameState.currentScreen === 'GAME' && !gameState.isDialogueActive && gameState.activeInteractableId) {
        sndInteract();
        startDialogue(gameState.activeInteractableId);
    }
    if (e.key === 'Tab') { e.preventDefault(); document.getElementById('hud').classList.toggle('hidden'); updateHUD(); }
    if (e.key === '-' || e.key === '_') devZoom = Math.max(DEV_ZOOM_MIN, parseFloat((devZoom - DEV_ZOOM_STEP).toFixed(2)));
    if (e.key === '=' || e.key === '+') devZoom = Math.min(DEV_ZOOM_MAX, parseFloat((devZoom + DEV_ZOOM_STEP).toFixed(2)));
    if (e.key === '0') devZoom = 1.0;
    if (k === 'e' && gameState.currentScreen === 'GAME' && !gameState.isDialogueActive) { clarityTimer = 40; phantoms.length = 0; }
});

window.addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    heldKeys.delete(k);
    if (e.key !== k) heldKeys.delete(e.key); // clear shifted version too
    if (e.key === 'Shift') shiftHeld = false;
});

// Clear all input on focus loss — permanently fixes sticky movement
window.addEventListener('blur', () => { heldKeys.clear(); shiftHeld = false; });
document.addEventListener('visibilitychange', () => { if (document.hidden) { heldKeys.clear(); shiftHeld = false; } });

window.addEventListener('pointerdown', (e) => {
    if (e.target.className === 'choice-button') return;

    // Puzzle click handling — highest priority
    if (activePuzzle) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const canvasY = (e.clientY - rect.top) * (canvas.height / rect.height);
        handlePuzzleClick(canvasX, canvasY);
        return;
    }
    
    // Pause menu interaction — center panel only (x: 320-960, y: 100-620)
    if (gameState.isPaused) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        // Only respond to clicks in the center panel
        if (canvasX < 320 || canvasX > 960 || canvasY < 100 || canvasY > 620) return;

        // Dev chapter sub-menu (CP_Y=100, items at CP_Y+115 + i*40)
        if (gameState.devChapterMenuOpen) {
            const devActions = [
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; resetGameState(); startGame(); },
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; gameState.currentRoute = 'TRAP'; gameState.currentScreen = 'GAME'; loadChapterTwo(); },
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; gameState.currentRoute = 'SECRET'; gameState.currentScreen = 'GAME'; loadChapterTwo(); },
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; gameState.currentRoute = 'CUTTHROAT'; gameState.currentScreen = 'GAME'; loadChapterTwo(); },
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; gameState.currentScreen = 'GAME'; loadChapterThree(); },
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; gameState.currentScreen = 'GAME'; loadChapterFour(); },
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; gameState.currentScreen = 'GAME'; loadChapterFive(); },
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; gameState.currentScreen = 'GAME'; loadChapterSix(); },
                () => { gameState.devChapterMenuOpen = false; gameState.isPaused = false; gameState.currentScreen = 'GAME'; loadChapterSeven(); },
                () => { gameState.devChapterMenuOpen = false; },
            ];
            const idx = Math.floor((canvasY - (100 + 115 - 20)) / 40);
            if (idx >= 0 && idx < devActions.length) devActions[idx]();
            return;
        }

        // Normal pause menu (options at CP_Y+115/170/225/280/350)
        if (canvasY > 90 && canvasY < 150)  { gameState.isPaused = false; return; }
        if (canvasY > 150 && canvasY < 200) {
            const gc = document.getElementById('game-container');
            if (!document.fullscreenElement) gc.requestFullscreen().catch(err => console.log(err));
            else document.exitFullscreen();
            return;
        }
        if (canvasY > 200 && canvasY < 255) {
            resetGameState(); menuPhase = 'FADEIN'; overlayAlpha = 1.0;
            gameState.isPaused = false; gameState.currentScreen = 'START_MENU'; return;
        }
        if (canvasY > 255 && canvasY < 310) {
            if (confirm('Quit to desktop?')) window.location.reload();
            return;
        }
        if (canvasY > 325 && canvasY < 385) {
            gameState.devChapterMenuOpen = true; return;
        }
        return; // swallow all other clicks while paused
    }

    if (gameState.currentScreen === 'START_MENU' && menuPhase === 'IDLE') {
        menuPhase = 'FADEOUT';
        overlayAlpha = 0;
    } else if (!gameState.isDialogueActive && gameState.activeInteractableId) {
        startDialogue(gameState.activeInteractableId);
    }
});

// ---- IS-RESOLVED HELPER ----
// Returns true if a map object should be hidden (its scene has been completed).
function isObjectResolved(o) {
    const f = gameState.flags;

    if (gameState.chapter === 1) {
        if (o.interactScene === 'scene2_trench'   && f.eastTrenchResolved)   return true;
        if (o.interactScene === 'scene2_carts'    && f.cartsResolved)        return true;
        if (o.interactScene === 'scene2_stranger' && f.watcherResolved)      return true;
        if (o.interactScene === 'flavor_sam'      && f.memorializedPartner)  return true;
        if (o.interactScene === 'flavor_sand'     && f.heardSand)            return true;
        // New Ch1 expansion scenes
        if (o.interactScene === 'ch1_inspector'   && f.inspector_dealt)      return true;
        if (o.interactScene === 'ch1_night_watch' && f.night_watch_done)     return true;
        // Codex — only interactable once (scene1_start), afterwards becomes flavor
        if (o.interactScene === 'scene1_start'    && f.Codex_Pulse_Felt || o.interactScene === 'scene1_start' && f.Crystalline_Structure_Noted || o.interactScene === 'scene1_start' && f.Codex_Sketch_Captured) return true;
        // Satphone and Tariq-talk remain available for repeated interactions
    }

    if (gameState.chapter === 2) {
        if (o.interactScene === 'flavor_ch2_bones'   && f.ch2BonesChecked)    return true;
        if (o.interactScene === 'trap_pressure_1'    && f.trapPlate1Sprung)   return true;
        if (o.interactScene === 'trap_pressure_2'    && f.trapPlate2Sprung)   return true;
        if (o.interactScene === 'trap_whisper'       && f.trapWhispersHeard)  return true;
        if (o.interactScene === 'trap_mural'         && f.trapMuralRead)      return true;
        if (o.interactScene === 'ch2_secret_altar'   && f.altarSolved)        return true;
        if (o.interactScene === 'flavor_ch2_mural'   && f.ch2MuralRead)       return true;
        if (o.interactScene === 'flavor_ch2_amber'   && f.ch2AmberTouched)    return true;
        if (o.interactScene === 'ch2_cutthroat_tariq'&& f.tariqUntied)        return true;
        if (o.interactScene === 'flavor_ch2_stash'   && f.ch2StashLooted)     return true;
        if (o.interactScene === 'flavor_ch2_chasm'   && f.ch2ChasmLooked)     return true;
    }

    if (gameState.chapter === 4) {
        if (o.interactScene === 'ch4_rest_hearth' && gameState.usedRestSites.includes('ch4_rest_hearth')) return true;
    }

    if (gameState.chapter === 5) {
        if (o.interactScene === 'ch5_halberd' && f.halberdMet)        return true;
        if (o.interactScene === 'ch5_standoff' && f.standoffResolved) return true;
    }

    if (gameState.chapter === 6) {
        if (o.interactScene === 'ch6_halberd_farewell' && f.halberdFarewellDone) return true;
        if (o.interactScene === 'ch6_gate'             && f.gateUnlocked)        return true;
    }

    if (gameState.chapter === 7) {
        if (o.interactScene === 'ch7_examine_codex'  && f.ch7CodexRead)  return true;
        if (o.interactScene === 'ch7_examine_second' && f.ch7SecondRead) return true;
    }

    return false;
}

// ---- CHAPTER PALETTES ----
// Controls the visual tone of each map: ground color, tile accent, wall color, vignette strength
function getChapterPalette() {
    const ch = gameState.chapter;
    const route = gameState.currentRoute;
    // Ch1 surface camp — sand at night
    if (ch === 1) return {
        groundBase: '#2f2619', groundTileA: '#3a2f20', groundDot: 'rgba(150,120,70,0.3)',
        gridLine: 'rgba(255,240,200,0.04)',
        wallFill: '#1a130a', wallTop: 'rgba(200,160,90,0.25)', wallEdge: 'rgba(90,70,40,0.8)',
        vignette: 0.5, ambientDust: 'sand'
    };
    // Ch2 varies by route
    if (ch === 2 && route === 'TRAP') return {
        groundBase: '#0f0d0a', groundTileA: '#1a1612', groundDot: 'rgba(80,60,40,0.4)',
        gridLine: 'rgba(255,200,120,0.03)',
        wallFill: '#080605', wallTop: 'rgba(180,120,60,0.3)', wallEdge: 'rgba(60,40,20,0.9)',
        vignette: 0.75, ambientDust: 'none'
    };
    if (ch === 2 && route === 'SECRET') return {
        groundBase: '#1a1408', groundTileA: '#241a0a', groundDot: 'rgba(212,175,55,0.2)',
        gridLine: 'rgba(212,175,55,0.06)',
        wallFill: '#0e0a04', wallTop: 'rgba(212,175,55,0.35)', wallEdge: 'rgba(120,90,40,0.8)',
        vignette: 0.6, ambientDust: 'amber'
    };
    if (ch === 2 && route === 'CUTTHROAT') return {
        groundBase: '#0d0d12', groundTileA: '#15151c', groundDot: 'rgba(90,90,120,0.3)',
        gridLine: 'rgba(180,180,220,0.03)',
        wallFill: '#05050a', wallTop: 'rgba(120,120,160,0.25)', wallEdge: 'rgba(60,60,80,0.9)',
        vignette: 0.7, ambientDust: 'none'
    };
    // Ch3 market — warm Cairo night
    if (ch === 3) return {
        groundBase: '#1f1510', groundTileA: '#2c1e16', groundDot: 'rgba(180,120,70,0.35)',
        gridLine: 'rgba(255,200,120,0.04)',
        wallFill: '#120b07', wallTop: 'rgba(200,140,80,0.3)', wallEdge: 'rgba(80,55,30,0.9)',
        vignette: 0.45, ambientDust: 'sand'
    };
    // Ch4 city — deep indigo with amber channels
    if (ch === 4) return {
        groundBase: '#080814', groundTileA: '#0e0e1c', groundDot: 'rgba(212,175,55,0.22)',
        gridLine: 'rgba(212,175,55,0.05)',
        wallFill: '#030308', wallTop: 'rgba(212,175,55,0.3)', wallEdge: 'rgba(80,70,40,0.9)',
        vignette: 0.65, ambientDust: 'amber'
    };
    // Ch5 airfield — cold industrial night
    if (ch === 5) return {
        groundBase: '#151618', groundTileA: '#1e2024', groundDot: 'rgba(140,150,160,0.3)',
        gridLine: 'rgba(200,210,220,0.04)',
        wallFill: '#0a0b0d', wallTop: 'rgba(160,170,180,0.22)', wallEdge: 'rgba(60,65,75,0.9)',
        vignette: 0.5, ambientDust: 'none'
    };
    // Ch6 gate — cold stone corridor
    if (ch === 6) return {
        groundBase: '#0a0c10', groundTileA: '#12141a', groundDot: 'rgba(180,200,220,0.2)',
        gridLine: 'rgba(200,220,240,0.04)',
        wallFill: '#04060a', wallTop: 'rgba(200,220,240,0.25)', wallEdge: 'rgba(60,70,85,0.9)',
        vignette: 0.7, ambientDust: 'amber'
    };
    // Ch7 final — luminous amber chamber
    if (ch === 7) return {
        groundBase: '#1a120a', groundTileA: '#281d0f', groundDot: 'rgba(240,200,100,0.35)',
        gridLine: 'rgba(240,200,100,0.06)',
        wallFill: '#0e0804', wallTop: 'rgba(240,200,100,0.4)', wallEdge: 'rgba(140,100,40,0.9)',
        vignette: 0.35, ambientDust: 'amber'
    };
    // Fallback
    return {
        groundBase: '#2a2320', groundTileA: '#332a25', groundDot: 'rgba(150,120,90,0.3)',
        gridLine: 'rgba(255,230,200,0.04)',
        wallFill: '#111', wallTop: 'rgba(180,160,120,0.2)', wallEdge: 'rgba(60,50,40,0.9)',
        vignette: 0.5, ambientDust: 'none'
    };
}

// ============================================================
// ---- PUZZLE RENDERING & INPUT ----
// ============================================================

function drawPuzzle() {
    if (!activePuzzle) return;
    const p = activePuzzle;
    const def = p.def;
    const CX = canvas.width / 2, CY = canvas.height / 2;

    // Backdrop
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Panel
    const PW = 560, PH = 340;
    const PX = CX - PW / 2, PY = CY - PH / 2;
    ctx.fillStyle = '#0e0c08';
    ctx.fillRect(PX, PY, PW, PH);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(PX, PY, PW, PH);

    // Title
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 18px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(def.title, CX, PY + 34);

    // Hint
    ctx.fillStyle = '#aaa';
    ctx.font = '12px Courier New';
    ctx.fillText(def.hint, CX, PY + 58);

    // Flash feedback
    if (p.flashTimer > 0) {
        p.flashTimer--;
        ctx.fillStyle = p.flashColor === 'fail' ? 'rgba(180,30,30,0.3)' : 'rgba(80,180,30,0.3)';
        ctx.fillRect(PX, PY, PW, PH);
    }

    // ESC hint
    ctx.fillStyle = '#555';
    ctx.font = '11px Courier New';
    ctx.fillText('ESC to cancel', CX, PY + PH - 14);

    // Solved overlay
    if (p.phase === 'solved') {
        ctx.fillStyle = 'rgba(80,180,30,0.15)';
        ctx.fillRect(PX, PY, PW, PH);
        ctx.fillStyle = '#6bc46b';
        ctx.font = 'bold 22px Courier New';
        ctx.fillText('SOLVED', CX, CY + 8);
        return;
    }

    const btnY = PY + 160;
    const glyphs = def.glyphs || [];

    if (def.type === 'sequence') {
        // Draw glyph buttons
        const btnW = 80, btnH = 80, gap = 20;
        const totalW = glyphs.length * btnW + (glyphs.length - 1) * gap;
        let bx = CX - totalW / 2;
        glyphs.forEach((g, i) => {
            const pressed = p.input.includes(i);
            ctx.fillStyle = pressed ? '#d4af37' : '#1a1810';
            ctx.fillRect(bx, btnY, btnW, btnH);
            ctx.strokeStyle = pressed ? '#fff8e0' : '#8b6914';
            ctx.lineWidth = 2;
            ctx.strokeRect(bx, btnY, btnW, btnH);
            ctx.fillStyle = pressed ? '#000' : '#d4af37';
            ctx.font = '32px serif';
            ctx.textAlign = 'center';
            ctx.fillText(g, bx + btnW / 2, btnY + btnH / 2 + 12);
            // Store hit box
            if (!p._btns) p._btns = [];
            p._btns[i] = { x: bx, y: btnY, w: btnW, h: btnH };
            bx += btnW + gap;
        });
        // Progress dots
        ctx.fillStyle = '#666';
        ctx.font = '12px Courier New';
        ctx.fillText(`Input: ${p.input.length} / ${def.sequence.length}`, CX, btnY + btnH + 30);

    } else if (def.type === 'symbol') {
        // Nodes with up/down controls
        const nodeW = 80, nodeH = 80, gap = 24;
        const totalW = def.target.length * nodeW + (def.target.length - 1) * gap;
        let bx = CX - totalW / 2;
        if (!p._btns) p._btns = [];
        def.target.forEach((tgt, i) => {
            const val = p.current[i];
            // Down button
            const downY = btnY - 30;
            ctx.fillStyle = '#1a1810';
            ctx.fillRect(bx, downY, nodeW, 24);
            ctx.strokeStyle = '#8b6914'; ctx.lineWidth = 1;
            ctx.strokeRect(bx, downY, nodeW, 24);
            ctx.fillStyle = '#d4af37'; ctx.font = '16px Courier New';
            ctx.fillText('▼', bx + nodeW / 2, downY + 17);
            // Node body
            const matched = val === tgt;
            ctx.fillStyle = matched ? '#3a5a20' : '#1a1810';
            ctx.fillRect(bx, btnY, nodeW, nodeH);
            ctx.strokeStyle = matched ? '#6bc46b' : '#8b6914'; ctx.lineWidth = 2;
            ctx.strokeRect(bx, btnY, nodeW, nodeH);
            ctx.fillStyle = '#d4af37'; ctx.font = '28px Courier New';
            ctx.fillText(val, bx + nodeW / 2, btnY + nodeH / 2 + 10);
            // Up button
            const upY = btnY + nodeH + 6;
            ctx.fillStyle = '#1a1810';
            ctx.fillRect(bx, upY, nodeW, 24);
            ctx.strokeStyle = '#8b6914'; ctx.lineWidth = 1;
            ctx.strokeRect(bx, upY, nodeW, 24);
            ctx.fillStyle = '#d4af37'; ctx.font = '16px Courier New';
            ctx.fillText('▲', bx + nodeW / 2, upY + 17);
            p._btns[i] = { x: bx, y: btnY, w: nodeW, h: nodeH, upY, downY };
            bx += nodeW + gap;
        });

    } else if (def.type === 'combination') {
        const dialW = 80, dialH = 80, gap = 24;
        const totalW = def.combination.length * dialW + (def.combination.length - 1) * gap;
        let bx = CX - totalW / 2;
        if (!p._btns) p._btns = [];
        def.combination.forEach((_, i) => {
            const val = p.current[i];
            const downY = btnY - 30;
            ctx.fillStyle = '#1a1810'; ctx.fillRect(bx, downY, dialW, 24);
            ctx.strokeStyle = '#8b6914'; ctx.lineWidth = 1; ctx.strokeRect(bx, downY, dialW, 24);
            ctx.fillStyle = '#d4af37'; ctx.font = '16px Courier New'; ctx.fillText('−', bx + dialW / 2, downY + 17);
            ctx.fillStyle = '#1a1810'; ctx.fillRect(bx, btnY, dialW, dialH);
            ctx.strokeStyle = '#8b6914'; ctx.lineWidth = 2; ctx.strokeRect(bx, btnY, dialW, dialH);
            ctx.fillStyle = '#d4af37'; ctx.font = '28px Courier New'; ctx.fillText(val, bx + dialW / 2, btnY + dialH / 2 + 10);
            const upY = btnY + dialH + 6;
            ctx.fillStyle = '#1a1810'; ctx.fillRect(bx, upY, dialW, 24);
            ctx.strokeStyle = '#8b6914'; ctx.lineWidth = 1; ctx.strokeRect(bx, upY, dialW, 24);
            ctx.fillStyle = '#d4af37'; ctx.font = '16px Courier New'; ctx.fillText('+', bx + dialW / 2, upY + 17);
            p._btns[i] = { x: bx, y: btnY, w: dialW, h: dialH, upY, downY };
            bx += dialW + gap;
        });
    }
}

function handlePuzzleClick(cx, cy) {
    if (!activePuzzle || activePuzzle.phase !== 'active') return;
    const p = activePuzzle;
    const def = p.def;
    if (!p._btns) return;

    if (def.type === 'sequence') {
        p._btns.forEach((btn, i) => {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                if (p.input.includes(i)) return; // already pressed
                p.input.push(i);
                // Check if correct so far
                const pos = p.input.length - 1;
                if (p.input[pos] !== def.sequence[pos]) {
                    // Wrong — flash fail and reset
                    p.flashTimer = 30; p.flashColor = 'fail';
                    p.input = []; p.phase = 'failed';
                    sndFail();
                    if (def.failScene) { setTimeout(() => { closePuzzle(); startDialogue(def.failScene); }, 500); }
                    return;
                }
                if (p.input.length === def.sequence.length) {
                    // Solved!
                    p.phase = 'solved'; p.flashTimer = 40; p.flashColor = 'win'; sndSuccess();
                    gameState.flags[def.rewardFlag] = true;
                    setTimeout(() => { closePuzzle(); if (def.rewardScene) startDialogue(def.rewardScene); }, 900);
                }
            }
        });
    } else if (def.type === 'symbol') {
        p._btns.forEach((btn, i) => {
            if (!btn) return;
            if (cx >= btn.x && cx <= btn.x + btn.w) {
                if (cy >= btn.upY && cy <= btn.upY + 24) {
                    p.current[i] = Math.min(5, p.current[i] + 1);
                } else if (cy >= btn.downY && cy <= btn.downY + 24) {
                    p.current[i] = Math.max(1, p.current[i] - 1);
                }
            }
        });
        // Check solved
        if (def.target.every((t, i) => p.current[i] === t)) {
            p.phase = 'solved'; p.flashTimer = 40; p.flashColor = 'win'; sndSuccess();
            gameState.flags[def.rewardFlag] = true;
            setTimeout(() => { closePuzzle(); if (def.rewardScene) startDialogue(def.rewardScene); }, 900);
        }
    } else if (def.type === 'combination') {
        p._btns.forEach((btn, i) => {
            if (!btn) return;
            if (cx >= btn.x && cx <= btn.x + btn.w) {
                if (cy >= btn.upY && cy <= btn.upY + 24) {
                    p.current[i] = p.current[i] >= def.max ? def.min : p.current[i] + 1;
                } else if (cy >= btn.downY && cy <= btn.downY + 24) {
                    p.current[i] = p.current[i] <= def.min ? def.max : p.current[i] - 1;
                }
            }
        });
        if (def.combination.every((t, i) => p.current[i] === t)) {
            p.phase = 'solved'; p.flashTimer = 40; p.flashColor = 'win'; sndSuccess();
            gameState.flags[def.rewardFlag] = true;
            setTimeout(() => { closePuzzle(); if (def.rewardScene) startDialogue(def.rewardScene); }, 900);
        }
    }
}


const ambientDust = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.6 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.2 + 0.05),
    alpha: Math.random() * 0.4 + 0.1
}));

function drawAmbientDust(style) {
    if (style === 'none') return;
    ambientDust.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width;
        if (p.x > canvas.width) p.x = -4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (style === 'amber') {
            ctx.fillStyle = `rgba(212,175,55,${p.alpha * 0.6})`;
        } else { // sand
            ctx.fillStyle = `rgba(200,170,110,${p.alpha * 0.5})`;
        }
        ctx.fill();
    });
}

// ---- SHADOW PHANTOMS (low-sanity visual hallucinations) ----
const phantoms = [];
let clarityTimer = 0; // Pressing E gives a brief clarity window where phantoms don't draw

function spawnPhantom() {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0)      { x = Math.random() * canvas.width; y = -20; }
    else if (side === 1) { x = Math.random() * canvas.width; y = canvas.height + 20; }
    else if (side === 2) { x = -20; y = Math.random() * canvas.height; }
    else                 { x = canvas.width + 20; y = Math.random() * canvas.height; }
    phantoms.push({
        x, y,
        targetX: x + (Math.random() - 0.5) * 60,
        targetY: y + (Math.random() - 0.5) * 60,
        life: 0,
        maxLife: 90 + Math.random() * 120,
        flicker: Math.random() * Math.PI * 2,
        size: 25 + Math.random() * 20
    });
}

function updatePhantoms() {
    if (clarityTimer > 0) clarityTimer--;

    // Don't spawn during dialogue or if fully sane
    if (gameState.isDialogueActive || gameState.sanityState === 'CALM') {
        // Let existing phantoms fade out
        phantoms.forEach(p => { p.life = Math.min(p.maxLife, p.life + 2); });
    } else {
        const spawnRate = gameState.sanityState === 'FRACTURED' ? 0.015 : 0.005;
        if (phantoms.length < (gameState.sanityState === 'FRACTURED' ? 5 : 2) && Math.random() < spawnRate) {
            spawnPhantom();
        }
    }

    for (let i = phantoms.length - 1; i >= 0; i--) {
        const p = phantoms[i];
        p.life++;
        p.flicker += 0.08;
        // Drift toward target slowly
        p.x += (p.targetX - p.x) * 0.01;
        p.y += (p.targetY - p.y) * 0.01;
        if (p.life >= p.maxLife) phantoms.splice(i, 1);
    }
}

function drawPhantoms() {
    if (clarityTimer > 0) return; // Don't draw during clarity
    phantoms.forEach(p => {
        const t = p.life / p.maxLife;
        // Fade in, hold, fade out
        const envelope = t < 0.2 ? t / 0.2 : (t > 0.7 ? (1 - t) / 0.3 : 1);
        const flicker = 0.5 + 0.5 * Math.sin(p.flicker);
        const baseAlpha = gameState.sanityState === 'FRACTURED' ? 0.55 : 0.28;
        const alpha = baseAlpha * envelope * (0.6 + 0.4 * flicker);
        // Draw a humanoid silhouette — tall oval
        ctx.save();
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        // Head
        ctx.beginPath();
        ctx.arc(p.x, p.y - p.size * 0.8, p.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function drawPauseMenu() {
    const CX = canvas.width / 2, CY = canvas.height / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // ============================================================
    // LEFT PANEL — STATS & RELATIONSHIPS (x: 10 to 310)
    // ============================================================
    const LP_X = 10, LP_Y = 10, LP_W = 300, LP_H = 700;

    // Panel background
    ctx.fillStyle = 'rgba(20,20,20,0.95)';
    ctx.fillRect(LP_X, LP_Y, LP_W, LP_H);
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 2;
    ctx.strokeRect(LP_X, LP_Y, LP_W, LP_H);

    // Panel title
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 18px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('STATS', LP_X + 15, LP_Y + 25);

    let lY = LP_Y + 50;
    ctx.fillStyle = '#aaa';
    ctx.font = '13px Courier New';

    // Sanity bar
    ctx.fillStyle = '#666';
    ctx.fillText('Sanity', LP_X + 15, lY);
    lY += 20;
    const sanityPct = (gameState.sanity / gameState.maxSanity);
    const sanityColor = gameState.sanityState === 'FRACTURED' ? '#cc2222' : gameState.sanityState === 'STRAINED' ? '#ff8844' : '#44aa44';
    ctx.fillStyle = 'rgba(40,40,40,0.8)';
    ctx.fillRect(LP_X + 15, lY, 270, 16);
    ctx.fillStyle = sanityColor;
    ctx.fillRect(LP_X + 15, lY, 270 * sanityPct, 16);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(LP_X + 15, lY, 270, 16);
    ctx.fillStyle = '#fff';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(gameState.sanity * 10) / 10, LP_X + 150, lY + 12);
    lY += 35;

    // Knowledge tracks
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'left';
    ctx.font = 'bold 13px Courier New';
    ctx.fillText('Knowledge', LP_X + 15, lY);
    lY += 18;

    const knowTracks = [
        { label: 'Hermetic', val: gameState.knowledgeHermetic, max: 20 },
        { label: 'Atlantean', val: gameState.knowledgeAtlantean, max: 20 },
        { label: 'Codex', val: gameState.knowledgeCodex, max: 20 },
    ];

    knowTracks.forEach(kt => {
        ctx.fillStyle = '#aaa';
        ctx.font = '11px Courier New';
        ctx.fillText(`${kt.label}: ${kt.val}/${kt.max}`, LP_X + 15, lY);
        ctx.fillStyle = 'rgba(40,40,40,0.8)';
        ctx.fillRect(LP_X + 15, lY + 5, 270, 10);
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(LP_X + 15, lY + 5, 270 * (kt.val / kt.max), 10);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.strokeRect(LP_X + 15, lY + 5, 270, 10);
        lY += 20;
    });

    lY += 15;

    // Relationships
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 13px Courier New';
    ctx.fillText('Trust', LP_X + 15, lY);
    lY += 18;

    const relationships = [
        { label: 'Tariq', val: gameState.trustTariq, max: 5 },
        { label: 'Maren', val: gameState.trustMaren, max: 5 },
        { label: 'Ministry', val: gameState.repMinistry, max: 5 },
    ];

    relationships.forEach(rel => {
        ctx.fillStyle = '#aaa';
        ctx.font = '11px Courier New';
        ctx.fillText(`${rel.label}: ${rel.val}/${rel.max}`, LP_X + 15, lY);
        ctx.fillStyle = 'rgba(40,40,40,0.8)';
        ctx.fillRect(LP_X + 15, lY + 5, 270, 10);
        const barColor = rel.val > 0 ? '#44aa44' : rel.val < 0 ? '#cc2222' : '#666';
        ctx.fillStyle = barColor;
        const barW = 270 * (Math.abs(rel.val) / rel.max);
        if (rel.val >= 0) {
            ctx.fillRect(LP_X + 15, lY + 5, barW, 10);
        } else {
            ctx.fillRect(LP_X + 15 + 270 - barW, lY + 5, barW, 10);
        }
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.strokeRect(LP_X + 15, lY + 5, 270, 10);
        lY += 20;
    });

    // ============================================================
    // CENTER PANEL — PAUSE MENU (x: 320 to 960)
    // ============================================================
    const CP_X = 320, CP_Y = 100, CP_W = 640, CP_H = 520;

    ctx.fillStyle = 'rgba(20,20,20,0.95)';
    ctx.fillRect(CP_X, CP_Y, CP_W, CP_H);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(CP_X, CP_Y, CP_W, CP_H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(212,175,55,0.4)';
    ctx.strokeRect(CP_X + 6, CP_Y + 6, CP_W - 12, CP_H - 12);

    // Corner diamonds
    const D = (x, y, s) => {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(x, y - s); ctx.lineTo(x + s, y);
        ctx.lineTo(x, y + s); ctx.lineTo(x - s, y);
        ctx.closePath(); ctx.fill();
    };
    D(CP_X, CP_Y, 10); D(CP_X + CP_W, CP_Y, 10);
    D(CP_X, CP_Y + CP_H, 10); D(CP_X + CP_W, CP_Y + CP_H, 10);

    // Title
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.font = 'bold 42px Courier New';
    ctx.fillText('PAUSED', CP_X + CP_W / 2, CP_Y + 60);

    // Underline
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CP_X + 100, CP_Y + 75);
    ctx.lineTo(CP_X + CP_W - 100, CP_Y + 75);
    ctx.stroke();

    if (gameState.devChapterMenuOpen) {
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 18px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('CHAPTER SELECT', CP_X + CP_W / 2, CP_Y + 80);
        const devItems = [
            'Chapter 1', 'Ch2: TRAP', 'Ch2: SECRET', 'Ch2: CUTTHROAT',
            'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7', '← Back'
        ];
        devItems.forEach((label, i) => {
            const dy = CP_Y + 115 + i * 40;
            ctx.fillStyle = label === '← Back' ? '#888' : '#e0e0e0';
            ctx.font = '17px Courier New';
            ctx.fillText(label, CP_X + CP_W / 2, dy);
        });
    } else {
        const options = [
            { text: 'Resume',              sub: 'ESC or ENTER',   y: CP_Y + 115 },
            { text: 'Fullscreen',          sub: 'Toggle',         y: CP_Y + 170 },
            { text: 'Return to Menu',      sub: 'Go to start',    y: CP_Y + 225 },
            { text: 'Quit',               sub: 'Reload page',    y: CP_Y + 280 },
            { text: '— DEV: Skip Chapter —', sub: 'Jump to any chapter', y: CP_Y + 350 },
        ];
        options.forEach(opt => {
            ctx.fillStyle = opt.text.startsWith('—') ? '#666' : '#e0e0e0';
            ctx.font = opt.text.startsWith('—') ? '14px Courier New' : '20px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(opt.text, CP_X + CP_W / 2, opt.y);
            if (opt.sub) {
                ctx.fillStyle = '#777';
                ctx.font = '12px Courier New';
                ctx.fillText(opt.sub, CP_X + CP_W / 2, opt.y + 20);
            }
        });
    }

    // Version
    ctx.fillStyle = '#555';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('THE CODEX OF GIZA — V2.1', CP_X + CP_W / 2, CP_Y + CP_H - 20);

    // ============================================================
    // RIGHT PANEL — QUESTS & INVENTORY (x: 970 to 1270)
    // ============================================================
    const RP_X = 970, RP_Y = 10, RP_W = 300, RP_H = 700;

    ctx.fillStyle = 'rgba(20,20,20,0.95)';
    ctx.fillRect(RP_X, RP_Y, RP_W, RP_H);
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 2;
    ctx.strokeRect(RP_X, RP_Y, RP_W, RP_H);

    // Panel title
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 18px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('INVENTORY', RP_X + 15, RP_Y + 25);

    let rY = RP_Y + 50;
    ctx.fillStyle = '#aaa';
    ctx.font = '12px Courier New';

    if (gameState.inventory.length === 0) {
        ctx.fillText('(empty)', RP_X + 15, rY);
        rY += 25;
    } else {
        gameState.inventory.forEach(item => {
            ctx.fillStyle = '#d4af37';
            ctx.fillText('• ' + item, RP_X + 15, rY);
            rY += 22;
            ctx.fillStyle = '#aaa';
        });
    }

    rY += 20;

    // Active quests / objectives
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 13px Courier New';
    ctx.fillText('OBJECTIVES', RP_X + 15, rY);
    rY += 22;

    const objectives = [];
    if (!gameState.flags.scene1_complete) objectives.push('Resolve the three site issues');
    if (!gameState.flags.scene3Triggered) objectives.push('Investigate the north dig zone');
    if (gameState.chapter === 2 && !gameState.flags.ch2_locked) objectives.push('Navigate to the city');
    if (gameState.chapter === 3 && !gameState.flags.ch3_yusra_met) objectives.push('Find Yusra in the market');
    if (gameState.chapter === 4 && !gameState.flags.ch4_heart_opened) objectives.push('Reach the Heart chamber');
    if (gameState.chapter === 5) objectives.push('Navigate the airfield');
    if (gameState.chapter === 6) objectives.push('Reach the Gate');
    if (gameState.chapter === 7) objectives.push('Face the final choice');

    if (objectives.length === 0) {
        ctx.fillStyle = '#aaa';
        ctx.font = '12px Courier New';
        ctx.fillText('(none — chapter complete)', RP_X + 15, rY);
    } else {
        objectives.forEach(obj => {
            ctx.fillStyle = '#aaa';
            ctx.font = '11px Courier New';
            const maxW = 260;
            let line = '';
            const words = obj.split(' ');
            words.forEach(w => {
                const test = line + (line ? ' ' : '') + w;
                if (ctx.measureText(test).width > maxW && line) {
                    ctx.fillText('• ' + line, RP_X + 15, rY);
                    line = w; rY += 16;
                } else { line = test; }
            });
            if (line) { ctx.fillText('• ' + line, RP_X + 15, rY); rY += 16; }
        });
    }

    // Journal Notes
    rY += 16;
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 13px Courier New';
    ctx.fillText('FIELD NOTES', RP_X + 15, rY);
    rY += 18;
    const notes = gameState.journalNotes || [];
    if (notes.length === 0) {
        ctx.fillStyle = '#555';
        ctx.font = '11px Courier New';
        ctx.fillText('(nothing recorded yet)', RP_X + 15, rY);
    } else {
        const maxNotes = Math.floor((RP_Y + RP_H - rY - 10) / 28);
        notes.slice(-maxNotes).forEach(note => {
            if (rY + 28 > RP_Y + RP_H - 10) return;
            ctx.fillStyle = '#d4af37';
            ctx.font = 'bold 10px Courier New';
            ctx.fillText(note.title.toUpperCase(), RP_X + 15, rY);
            rY += 14;
            ctx.fillStyle = '#888';
            ctx.font = '10px Courier New';
            const words = note.text.split(' ');
            let line = '';
            words.forEach(w => {
                const test = line + (line ? ' ' : '') + w;
                if (ctx.measureText(test).width > 250 && line) {
                    ctx.fillText(line, RP_X + 15, rY); line = w; rY += 12;
                } else { line = test; }
            });
            if (line && rY < RP_Y + RP_H - 10) { ctx.fillText(line, RP_X + 15, rY); rY += 14; }
        });
    }

    ctx.restore();
}


function drawObjectShape(ctx, o, ox, oy) {
    const id = o.id || '';
    const lbl = (o.label || '').toLowerCase();
    const w = o.w, h = o.h;
    if (id === 'enter_tent') {
        ctx.fillStyle = '#1e3310';
        ctx.beginPath(); ctx.moveTo(ox, oy + h*0.3); ctx.lineTo(ox + w/2, oy); ctx.lineTo(ox + w, oy + h*0.3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#2d4a1a'; ctx.fillRect(ox, oy + h*0.28, w, h*0.72);
        ctx.fillStyle = '#243e14'; ctx.fillRect(ox, oy + h*0.28, w, 3);
        ctx.fillStyle = '#0d1a08'; ctx.fillRect(ox + w*0.4, oy + h*0.52, w*0.2, h*0.48);
        ctx.fillStyle = '#8b6914'; ctx.fillRect(ox + 3, oy + h*0.28, 4, h*0.72); ctx.fillRect(ox + w - 7, oy + h*0.28, 4, h*0.72);
        ctx.strokeStyle = '#4a3810'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ox + 3, oy + h*0.28); ctx.lineTo(ox - 14, oy + h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox + w - 3, oy + h*0.28); ctx.lineTo(ox + w + 14, oy + h); ctx.stroke();
        return true;
    }
    if (id === 'enter_office' || lbl.includes('office')) {
        ctx.fillStyle = '#2a2218'; ctx.fillRect(ox, oy + h*0.2, w, h*0.8);
        ctx.fillStyle = '#1a1510'; ctx.fillRect(ox - 2, oy, w + 4, h*0.22);
        ctx.fillStyle = '#4a3c28'; ctx.fillRect(ox, oy + h*0.2, w, 2);
        ctx.fillStyle = '#0d0a06'; ctx.fillRect(ox + w*0.35, oy + h*0.55, w*0.3, h*0.45);
        ctx.fillStyle = '#2a3f55'; ctx.fillRect(ox + w*0.08, oy + h*0.28, w*0.28, h*0.22);
        return true;
    }
    if (id === 'fl_digshed' || id === 'fl_toolshed' || lbl.includes('shed')) {
        ctx.fillStyle = '#3a2e1a'; ctx.fillRect(ox, oy + h*0.18, w, h*0.82);
        ctx.fillStyle = '#241e10'; ctx.fillRect(ox - 3, oy, w + 6, h*0.2);
        ctx.fillStyle = '#5a4a28'; ctx.fillRect(ox, oy + h*0.18, w, 2);
        ctx.fillStyle = '#0d0a06'; ctx.fillRect(ox + w*0.35, oy + h*0.52, w*0.3, h*0.48);
        ctx.fillStyle = '#251c0c'; ctx.fillRect(ox + 4, oy + h*0.18, 3, h*0.82); ctx.fillRect(ox + w - 7, oy + h*0.18, 3, h*0.82);
        ctx.fillStyle = '#2a2010'; ctx.fillRect(ox + w*0.08, oy + h*0.28, w*0.3, h*0.2);
        return true;
    }
    if (id === 'fl_trailer' || lbl.includes('trailer')) {
        ctx.fillStyle = '#3a3430'; ctx.fillRect(ox, oy + h*0.12, w, h*0.72);
        ctx.fillStyle = '#2a2420'; ctx.fillRect(ox - 2, oy, w + 4, h*0.14);
        ctx.fillStyle = '#464040'; ctx.fillRect(ox, oy + h*0.12, w, 3);
        for (let i = 0; i < 4; i++) { ctx.fillStyle = '#2a4a65'; ctx.fillRect(ox + w*0.07 + i*(w*0.22), oy + h*0.22, w*0.14, h*0.2); }
        ctx.fillStyle = '#1a1410'; ctx.fillRect(ox + w*0.75, oy + h*0.42, w*0.1, h*0.42);
        ctx.fillRect(ox + w*0.735, oy + h*0.82, w*0.13, h*0.05); ctx.fillRect(ox + w*0.725, oy + h*0.86, w*0.15, h*0.05);
        ctx.fillStyle = '#0d0a08';
        [0.08, 0.3, 0.55, 0.8].forEach(function(x) { ctx.fillRect(ox + w*x, oy + h*0.83, w*0.1, h*0.1); });
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(ox, oy + h*0.12, w, 2);
        return true;
    }
    if (id === 'fl_palm' || lbl.includes('palm') || lbl.includes('date palm')) {
        ctx.fillStyle = '#5c3a10'; ctx.fillRect(ox + w*0.38, oy + h*0.32, w*0.24, h*0.68);
        ctx.fillStyle = '#1e5a10'; ctx.fillRect(ox + w*0.3, oy + h*0.08, w*0.4, h*0.28);
        ctx.fillStyle = '#2a7a14';
        ctx.fillRect(ox, oy + h*0.12, w*0.48, h*0.14); ctx.fillRect(ox + w*0.52, oy + h*0.12, w*0.48, h*0.14);
        ctx.fillRect(ox + w*0.08, oy, w*0.38, h*0.16); ctx.fillRect(ox + w*0.54, oy, w*0.38, h*0.16);
        ctx.fillStyle = '#1e5a10';
        ctx.fillRect(ox - w*0.12, oy + h*0.22, w*0.32, h*0.1); ctx.fillRect(ox + w*0.8, oy + h*0.22, w*0.32, h*0.1);
        ctx.fillStyle = '#7a3d10'; ctx.fillRect(ox + w*0.3, oy + h*0.25, w*0.16, h*0.1); ctx.fillRect(ox + w*0.54, oy + h*0.25, w*0.16, h*0.1);
        return true;
    }
    if (lbl.includes('cactus')) {
        ctx.fillStyle = '#2d5a1b';
        ctx.fillRect(ox + w*0.3, oy, w*0.4, h);
        ctx.fillRect(ox, oy + h*0.3, w*0.35, h*0.18); ctx.fillRect(ox + w*0.65, oy + h*0.38, w*0.35, h*0.18);
        ctx.fillRect(ox, oy + h*0.12, w*0.35, h*0.1); ctx.fillRect(ox + w*0.65, oy + h*0.2, w*0.35, h*0.1);
        return true;
    }
    if (id === 'fl_boulder' || id.startsWith('d_bould')) {
        ctx.fillStyle = '#2a2218'; ctx.fillRect(ox + w*0.1, oy + h*0.18, w*0.85, h*0.8);
        ctx.fillStyle = '#3a3028'; ctx.fillRect(ox, oy + h*0.22, w, h*0.68); ctx.fillRect(ox + w*0.1, oy + h*0.04, w*0.8, h*0.25);
        ctx.fillStyle = '#4a4038'; ctx.fillRect(ox + w*0.12, oy + h*0.08, w*0.5, h*0.38);
        ctx.fillStyle = '#1e1c14'; ctx.fillRect(ox + w*0.52, oy + h*0.28, 2, h*0.35);
        return true;
    }
    if (id === 'fl_spoil' || id.startsWith('d_spoil')) {
        ctx.fillStyle = '#2a2010'; ctx.fillRect(ox + w*0.05, oy + h*0.32, w*0.9, h*0.68);
        ctx.fillStyle = '#5c4a30'; ctx.fillRect(ox, oy + h*0.42, w, h*0.58); ctx.fillRect(ox + w*0.1, oy + h*0.22, w*0.8, h*0.32); ctx.fillRect(ox + w*0.25, oy + h*0.1, w*0.5, h*0.2);
        ctx.fillStyle = '#6a5a3a'; ctx.fillRect(ox + w*0.2, oy + h*0.48, 5, 3); ctx.fillRect(ox + w*0.55, oy + h*0.36, 4, 3); ctx.fillRect(ox + w*0.7, oy + h*0.52, 6, 3);
        return true;
    }
    if (id === 'fl_crates' || id.startsWith('d_crate')) {
        var cw = w/2 - 2, ch = h/2 - 2;
        for (var r = 0; r < 2; r++) { for (var c = 0; c < 2; c++) {
            var cx2 = ox + c*(cw+2), cyr = oy + r*(ch+2);
            ctx.fillStyle = '#4a3820'; ctx.fillRect(cx2, cyr, cw, ch);
            ctx.fillStyle = '#2a2010'; ctx.fillRect(cx2+1, cyr+1, cw-2, 2); ctx.fillRect(cx2+1, cyr+ch-3, cw-2, 2); ctx.fillRect(cx2+cw/2-1, cyr+1, 2, ch-2);
            ctx.fillStyle = '#5a4a28'; ctx.fillRect(cx2, cyr, cw, 2);
        }}
        return true;
    }
    if (id.startsWith('d_truck') || id.startsWith('d_min')) {
        var isMIN = id.startsWith('d_min');
        ctx.fillStyle = isMIN ? '#1e2d1e' : '#2d3436'; ctx.fillRect(ox, oy + h*0.2, w, h*0.6);
        ctx.fillStyle = isMIN ? '#152415' : '#1e2428'; ctx.fillRect(ox + w*0.6, oy, w*0.38, h*0.65);
        ctx.fillStyle = '#2a4060'; ctx.fillRect(ox + w*0.63, oy + h*0.06, w*0.3, h*0.24);
        ctx.fillStyle = '#0d0a08';
        ctx.fillRect(ox + w*0.06, oy + h*0.78, w*0.18, h*0.16); ctx.fillRect(ox + w*0.32, oy + h*0.78, w*0.18, h*0.16); ctx.fillRect(ox + w*0.64, oy + h*0.78, w*0.14, h*0.16);
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(ox, oy + h*0.2, w*0.58, 2);
        return true;
    }
    if (id === 'fl_scaffold' || id.startsWith('d_scaff') || lbl.includes('scaffolding')) {
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(ox + 2, oy, 4, h); ctx.fillRect(ox + w/2 - 2, oy, 4, h); ctx.fillRect(ox + w - 6, oy, 4, h);
        ctx.fillStyle = '#4a4a4a';
        for (var si = 0; si <= 3; si++) { ctx.fillRect(ox, oy + si*(h/3), w, 3); }
        ctx.fillStyle = '#282828'; ctx.fillRect(ox + 6, oy + h*0.05, 2, h*0.5); ctx.fillRect(ox + 8, oy + h*0.55, 2, h*0.4);
        return true;
    }
    if (id === 'fl_fuel_drums' || lbl.includes('fuel drum')) {
        var dw = w/3 - 2;
        for (var di = 0; di < 3; di++) {
            var dx = ox + di*(dw+2);
            ctx.fillStyle = '#4a2a18'; ctx.fillRect(dx, oy, dw, h);
            ctx.fillStyle = '#5c3a24'; ctx.fillRect(dx, oy, dw, h*0.1); ctx.fillRect(dx, oy + h*0.9, dw, h*0.1);
            ctx.fillStyle = '#2a1808'; ctx.fillRect(dx, oy + h*0.3, dw, 3); ctx.fillRect(dx, oy + h*0.6, dw, 3);
            ctx.fillStyle = '#6a3a20'; ctx.fillRect(dx, oy, dw, 2);
        }
        return true;
    }
    if (id.startsWith('d_barrel') || lbl.includes('water barrel')) {
        var bw = w/2 - 2;
        for (var bi = 0; bi < 2; bi++) {
            var bx = ox + bi*(bw+2);
            ctx.fillStyle = '#0e1f33'; ctx.fillRect(bx, oy, bw, h);
            ctx.fillStyle = '#1e3f66'; ctx.fillRect(bx, oy, bw, h*0.1); ctx.fillRect(bx, oy + h*0.9, bw, h*0.1);
            ctx.fillStyle = '#0a1828'; ctx.fillRect(bx, oy + h*0.35, bw, 3); ctx.fillRect(bx, oy + h*0.6, bw, 3);
        }
        return true;
    }
    if (id.startsWith('fl_stake') || id.startsWith('d_stake') || lbl.includes('stake')) {
        ctx.fillStyle = '#6b4c1a'; ctx.fillRect(ox + w*0.38, oy + h*0.15, w*0.24, h*0.85);
        ctx.fillStyle = '#4a3010'; ctx.fillRect(ox + w*0.33, oy + h*0.88, w*0.34, h*0.12);
        ctx.fillStyle = '#d4750a'; ctx.fillRect(ox + w*0.38, oy + h*0.08, w*0.55, h*0.14); ctx.fillRect(ox + w*0.38, oy + h*0.22, w*0.45, h*0.1);
        return true;
    }
    if (id === 'fl_stars' || lbl.includes('sky') || lbl.includes('open sky')) {
        ctx.fillStyle = '#060610'; ctx.fillRect(ox, oy, w, h);
        ctx.fillStyle = '#dde8ff';
        [[0.15,0.18],[0.45,0.08],[0.75,0.28],[0.25,0.52],[0.6,0.68],[0.85,0.12],[0.35,0.78],[0.9,0.48],[0.55,0.35],[0.1,0.65]].forEach(function(p) { ctx.fillRect(ox+p[0]*w, oy+p[1]*h, 2, 2); });
        ctx.fillStyle = 'rgba(80,80,180,0.18)'; ctx.fillRect(ox, oy, w, h);
        return true;
    }
    if (id === 'fl_ruins' || id.startsWith('d_ruin') || lbl.includes('limestone') || lbl.includes('stone wall')) {
        var bH = Math.max(8, Math.floor(h/3)), bW = Math.max(18, Math.floor(w/4));
        ctx.fillStyle = '#2a2418'; ctx.fillRect(ox, oy, w, h);
        for (var row = 0; row < 3; row++) {
            var off = (row % 2) * (bW * 0.5);
            for (var col = -1; col <= 5; col++) {
                var rbx = ox + col*bW + off, rby = oy + row*bH;
                if (rbx + bW < ox || rbx > ox + w) continue;
                ctx.fillStyle = row === 1 ? '#4a3d28' : '#3a3020';
                var rcx = Math.max(ox, rbx), rcw = Math.min(ox+w, rbx+bW-1) - rcx;
                if (rcw > 0) ctx.fillRect(rcx, rby, rcw, bH - 1);
            }
        }
        return true;
    }
    if (id === 'fl_cooking' || id.startsWith('d_cooking') || lbl.includes('cooking')) {
        ctx.fillStyle = '#3c2410'; ctx.fillRect(ox, oy + h*0.28, w, h*0.2);
        ctx.fillStyle = '#4a3018'; ctx.fillRect(ox, oy + h*0.28, w, 3);
        ctx.fillStyle = '#2a1808'; ctx.fillRect(ox + 4, oy + h*0.48, 4, h*0.52); ctx.fillRect(ox + w - 8, oy + h*0.48, 4, h*0.52);
        ctx.fillStyle = '#1a1210'; ctx.fillRect(ox + w*0.28, oy, w*0.44, h*0.32);
        ctx.fillStyle = '#3a3030'; ctx.fillRect(ox + w*0.22, oy, w*0.56, h*0.1);
        ctx.fillStyle = '#5a2010'; ctx.fillRect(ox + w*0.55, oy + h*0.05, w*0.2, h*0.14);
        return true;
    }
    if (id === 'fl_sand_east' || lbl.includes('dune') || lbl.includes('howling')) {
        ctx.fillStyle = '#5a4c28'; ctx.fillRect(ox, oy + h*0.42, w, h*0.58);
        ctx.fillStyle = '#6c5c30'; ctx.fillRect(ox + w*0.08, oy + h*0.22, w*0.84, h*0.36); ctx.fillRect(ox + w*0.22, oy + h*0.06, w*0.56, h*0.24);
        ctx.fillStyle = '#7c6c40'; ctx.fillRect(ox + w*0.08, oy + h*0.52, w*0.32, 2); ctx.fillRect(ox + w*0.48, oy + h*0.62, w*0.38, 2); ctx.fillRect(ox + w*0.18, oy + h*0.7, w*0.42, 2);
        return true;
    }
    if (id === 'fl_guard_booth' || lbl.includes('booth')) {
        ctx.fillStyle = '#2a2a28'; ctx.fillRect(ox, oy + h*0.14, w, h*0.86);
        ctx.fillStyle = '#1a1a18'; ctx.fillRect(ox - 2, oy, w + 4, h*0.16);
        ctx.fillStyle = '#323030'; ctx.fillRect(ox, oy + h*0.14, w, 2);
        ctx.fillStyle = '#2a3818'; ctx.fillRect(ox + w*0.14, oy + h*0.24, w*0.72, h*0.3);
        ctx.fillStyle = '#1e2c12'; ctx.fillRect(ox + w*0.5 - 1, oy + h*0.24, 2, h*0.3); ctx.fillRect(ox + w*0.14, oy + h*0.37, w*0.72, 2);
        ctx.fillStyle = '#0d0d0b'; ctx.fillRect(ox + w*0.32, oy + h*0.6, w*0.36, h*0.4);
        return true;
    }
    if (id === 'fl_ministry_post' || lbl.includes('ministry')) {
        ctx.fillStyle = '#2d3436'; ctx.fillRect(ox, oy + h*0.14, w, h*0.86);
        ctx.fillStyle = '#1a1e1f'; ctx.fillRect(ox - 2, oy + h*0.1, w + 4, h*0.06);
        ctx.fillStyle = '#888'; ctx.fillRect(ox + w*0.68, oy - h*0.28, 3, h*0.4); ctx.fillRect(ox + w*0.52, oy - h*0.14, w*0.38, 2);
        ctx.fillStyle = '#1a3a28'; ctx.fillRect(ox + w*0.1, oy + h*0.24, w*0.8, h*0.28);
        ctx.fillStyle = '#0d1010'; ctx.fillRect(ox + w*0.34, oy + h*0.6, w*0.32, h*0.4);
        return true;
    }
    if (id === 'fl_gate_post' || lbl.includes('gate post')) {
        ctx.fillStyle = '#5a4a3a'; ctx.fillRect(ox + w*0.28, oy + h*0.1, w*0.44, h*0.9);
        ctx.fillStyle = '#3a2c1e'; ctx.fillRect(ox + w*0.08, oy, w*0.84, h*0.12);
        ctx.fillStyle = '#4a3c2c'; ctx.fillRect(ox + w*0.14, oy + h*0.22, w*0.72, h*0.22);
        return true;
    }
    if (id === 'd_gearstor' || lbl.includes('gear storage')) {
        ctx.fillStyle = '#2a2818'; ctx.fillRect(ox, oy, w, h);
        ctx.fillStyle = '#3a3828'; ctx.fillRect(ox, oy, w, h*0.12);
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        for (var gi = 1; gi < 4; gi++) { ctx.fillRect(ox + gi*(w/4), oy, 2, h); }
        ctx.fillRect(ox, oy + h*0.5, w, 2);
        ctx.fillStyle = '#4a4838'; ctx.fillRect(ox, oy, w, 2);
        return true;
    }
    if (id === 'd_equiptbl' || lbl.includes('equipment table')) {
        ctx.fillStyle = '#3c2c18'; ctx.fillRect(ox, oy + h*0.28, w, h*0.22);
        ctx.fillStyle = '#4a3a24'; ctx.fillRect(ox, oy + h*0.28, w, 2);
        ctx.fillStyle = '#2a1c08'; ctx.fillRect(ox + 4, oy + h*0.5, 4, h*0.5); ctx.fillRect(ox + w - 8, oy + h*0.5, 4, h*0.5);
        ctx.fillStyle = '#5a4a30'; ctx.fillRect(ox + w*0.08, oy, w*0.18, h*0.3); ctx.fillRect(ox + w*0.34, oy + h*0.04, w*0.28, h*0.26); ctx.fillRect(ox + w*0.72, oy + h*0.07, w*0.2, h*0.23);
        return true;
    }
    if (lbl.includes('fountain')) {
        ctx.strokeStyle = '#1e3f66'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(ox + w/2, oy + h/2, w/2, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#0a1a2a'; ctx.beginPath(); ctx.arc(ox + w/2, oy + h/2, w/2 - 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1e3f88'; ctx.beginPath(); ctx.arc(ox + w/2, oy + h/2, w/4, 0, Math.PI * 2); ctx.fill();
        return true;
    }
    return false;
}

function gameLoop() {
    if (gameState.currentScreen === 'START_MENU') {
        drawStartScreen();
        requestAnimationFrame(gameLoop);
        return;
    }

    updateCamera();

    // Update hostile NPCs
    updateHostiles();

    ctx.save();
    // Apply dev zoom scale — scales world rendering to fill canvas
    if (devZoom !== 1.0) {
        ctx.scale(devZoom, devZoom);
    }
    // Logical canvas size in world-space units
    const logW = canvas.width  / devZoom;
    const logH = canvas.height / devZoom;

    // STRAINED: color tint only (via CSS class), no shake
    // FRACTURED: heavy shake + color tint
    if (gameState.sanityState === 'FRACTURED') {
        ctx.translate((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
    }

    // Chapter-tuned ground palette
    const palette = getChapterPalette();

    // Base ground color — must fill full logical area
    ctx.fillStyle = palette.groundBase;
    ctx.fillRect(0, 0, logW, logH);

    // Textured tile grid — parallax-aligned to world so it feels like actual ground
    const tileSize = 64;
    const tileStartX = -((camera.x) % tileSize);
    const tileStartY = -((camera.y) % tileSize);
    ctx.fillStyle = palette.groundTileA;
    for (let ty = tileStartY - tileSize; ty < logH; ty += tileSize) {
        for (let tx = tileStartX - tileSize; tx < logW; tx += tileSize) {
            const worldTx = Math.floor((tx + camera.x) / tileSize);
            const worldTy = Math.floor((ty + camera.y) / tileSize);
            const h = ((worldTx * 73856093) ^ (worldTy * 19349663)) & 0xffffff;
            if ((h % 5) === 0) {
                ctx.fillRect(tx, ty, tileSize, tileSize);
            }
        }
    }

    // Subtle texture dots — stable, world-anchored
    ctx.fillStyle = palette.groundDot;
    for (let ty = tileStartY - tileSize; ty < logH; ty += tileSize) {
        for (let tx = tileStartX - tileSize; tx < logW; tx += tileSize) {
            const worldTx = Math.floor((tx + camera.x) / tileSize);
            const worldTy = Math.floor((ty + camera.y) / tileSize);
            const h = ((worldTx * 2654435761) ^ (worldTy * 2246822519)) >>> 0;
            const dotX = tx + (h % tileSize);
            const dotY = ty + ((h >> 8) % tileSize);
            ctx.fillRect(dotX, dotY, 2, 2);
        }
    }

    // Faint grid
    ctx.strokeStyle = palette.gridLine;
    ctx.lineWidth = 1;
    for (let x = 0; x < WORLD.width; x += 200) {
        ctx.beginPath();
        ctx.moveTo(x - camera.x, 0);
        ctx.lineTo(x - camera.x, logH);
        ctx.stroke();
    }
    for (let y = 0; y < WORLD.height; y += 200) {
        ctx.beginPath();
        ctx.moveTo(0, y - camera.y);
        ctx.lineTo(logW, y - camera.y);
        ctx.stroke();
    }

    // Walls — drop shadow + fill + stroke for depth (gate walls removed when their flag is set)
    const currentWalls = (mapWalls[currentMapKey] || []).filter(w => !w.isGate || !gameState.flags[w.gateFlag]);
    for (const wall of currentWalls) {
        const wx = wall.x - camera.x;
        const wy = wall.y - camera.y;
        // Drop shadow (offset down-right)
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(wx + 4, wy + 6, wall.w, wall.h);
        // Main fill
        ctx.fillStyle = palette.wallFill;
        ctx.fillRect(wx, wy, wall.w, wall.h);
        // Top highlight (subtle edge-light)
        ctx.fillStyle = palette.wallTop;
        ctx.fillRect(wx, wy, wall.w, 2);
        ctx.fillRect(wx, wy, 2, wall.h);
        // Border
        ctx.strokeStyle = palette.wallEdge;
        ctx.lineWidth = 1;
        ctx.strokeRect(wx, wy, wall.w, wall.h);
    }

    // Map objects — shadow + fill + label

    let interacting = null;
    activeMapObjects.forEach(o => {
        if (isObjectResolved(o)) return;

        const ox = o.x - camera.x;
        const oy = o.y - camera.y;

        // Skip if fully off screen
        if (ox + o.w < 0 || ox > canvas.width || oy + o.h < 0 || oy > canvas.height) return;

        // Decorative objects — simplified render, no label, no glow
        if (o.decorative || o.interactScene === null) {
            if (!drawObjectShape(ctx, o, ox, oy)) {
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(ox + 2, oy + 3, o.w, o.h);
                ctx.fillStyle = o.color;
                ctx.fillRect(ox, oy, o.w, o.h);
                if (o.w > 40 || o.h > 40) {
                    ctx.fillStyle = 'rgba(255,255,255,0.08)';
                    ctx.fillRect(ox, oy, o.w, 2);
                }
            }
            return;
        }

        // Interactive objects — shadow + shape + label
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(ox + 3, oy + 4, o.w, o.h);
        if (!drawObjectShape(ctx, o, ox, oy)) {
            ctx.fillStyle = o.color;
            ctx.fillRect(ox, oy, o.w, o.h);
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillRect(ox, oy, o.w, 2);
        }
        ctx.font = '13px Courier New';
        ctx.textAlign = 'left';
        // Dig gate shows as unlocked once scene3 triggers
        const displayLabel = (o.id === 'dig_gate' && gameState.flags.scene3Triggered)
            ? 'Dig Zone Gate — OPEN' : o.label;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillText(displayLabel, ox + 1, oy - 4);
        ctx.fillStyle = (o.id === 'dig_gate' && gameState.flags.scene3Triggered) ? '#6bc46b' : '#f4e4b0';
        ctx.fillText(displayLabel, ox, oy - 5);

        const px = player.x + player.size / 2;
        const py = player.y + player.size / 2;
        if (px > o.x - 60 && px < o.x + o.w + 60 && py > o.y - 60 && py < o.y + o.h + 60) {
            interacting = o.interactScene;
        }
    });

    gameState.activeInteractableId = interacting;
    document.getElementById('interaction-prompt').classList.toggle(
        'hidden',
        !interacting || gameState.isDialogueActive || !!activePuzzle
    );

    // Rest — takes ~3 seconds, restores 5 sanity (half the max bar)
    if (gameState.isResting) {
        gameState.restTimer++;
        if (gameState.restTimer >= 180) {
            increaseSanity(5.0);
            gameState.restTimer = 0;
            gameState.isResting = false;
        }
        // Progress bar above the player
        const progress = Math.min(1, gameState.restTimer / 180);
        const barX = player.x - camera.x - 10;
        const barY = player.y - camera.y - 18;
        const barW = player.size + 20;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(barX, barY, barW, 6);
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(barX, barY, barW * progress, 6);
        ctx.fillStyle = '#d4af37';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('Resting...', player.x - camera.x + player.size / 2, player.y - camera.y - 22);
        ctx.textAlign = 'left';
    }

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
    // Update stamina bar every frame
    {
        const pct = (gameState.stamina / gameState.maxStamina) * 100;
        const bar = document.getElementById('stamina-bar-fill');
        const txt = document.getElementById('stat-stamina');
        if (bar) bar.style.width = pct + '%';
        if (txt) txt.innerText = gameState.stamina.toFixed(1);
    }

    // Movement — check X and Y axes independently so the player slides along walls
    if (!gameState.isDialogueActive && !gameState.isResting) {
        let dx = 0, dy = 0;
        if (isHeld('w') || isHeld('arrowup'))    dy -= player.speed;
        if (isHeld('s') || isHeld('arrowdown'))  dy += player.speed;
        if (isHeld('a') || isHeld('arrowleft'))  dx -= player.speed;
        if (isHeld('d') || isHeld('arrowright')) dx += player.speed;

        // Apply sprint multiplier if sprinting
        if (gameState.isSprinting) {
            dx *= 2;
            dy *= 2;
        }

        // Update walking bob phase (affects player Y draw position)
        if (dx !== 0 || dy !== 0) {
            gameState.walkBobPhase += 0.15; // speed of bob animation
        }

        const testX = player.x + dx;
        const testY = player.y + dy;

        let blockedX = false, blockedY = false;
        for (const wall of currentWalls) {
            // Test X axis
            if (
                testX < wall.x + wall.w && testX + player.size > wall.x &&
                player.y < wall.y + wall.h && player.y + player.size > wall.y
            ) { blockedX = true; }
            // Test Y axis
            if (
                player.x < wall.x + wall.w && player.x + player.size > wall.x &&
                testY < wall.y + wall.h && testY + player.size > wall.y
            ) { blockedY = true; }
        }

        if (!blockedX) player.x = testX;
        if (!blockedY) player.y = testY;

        player.x = Math.max(0, Math.min(player.x, WORLD.width  - player.size));
        player.y = Math.max(0, Math.min(player.y, WORLD.height - player.size));
    }

    // Draw player — with drop shadow and amber glow
    const pxDraw = player.x - camera.x;
    // Walking bob: oscillate Y position based on walk phase
    const bobAmount = Math.sin(gameState.walkBobPhase) * 2; // ±2 pixels
    const pyDraw = player.y - camera.y + bobAmount;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(pxDraw + 3, pyDraw + 4, player.size, player.size);
    ctx.save();
    ctx.shadowColor = 'rgba(212,175,55,0.6)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = player.color;
    ctx.fillRect(pxDraw, pyDraw, player.size, player.size);
    ctx.restore();
    ctx.fillStyle = 'rgba(255,230,160,0.3)';
    ctx.fillRect(pxDraw, pyDraw, player.size, 2);

    // Update + draw shadow phantoms (low-sanity hallucinations)
    updatePhantoms();
    drawPhantoms();

    // Ambient dust particles (chapter-specific)
    drawAmbientDust(palette.ambientDust);

    // Vignette — darkens screen edges for atmosphere
    const vigCX = logW / 2, vigCY = logH / 2;
    const vig = ctx.createRadialGradient(vigCX, vigCY, Math.min(logW, logH) * 0.25, vigCX, vigCY, Math.min(logW, logH) * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(0,0,0,${palette.vignette})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, logW, logH);

    // Clarity indicator — flash a faint ring when E is pressed
    if (clarityTimer > 0) {
        const ct = clarityTimer / 40;
        ctx.strokeStyle = `rgba(212,175,55,${ct * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pxDraw + player.size / 2, pyDraw + player.size / 2, 50 + (1 - ct) * 80, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();

    // Interior building fade transition
    drawInteriorFade();

    // Draw hostiles
    drawHostiles();

    // Draw puzzle overlay if active
    if (activePuzzle) drawPuzzle();

    // Dev zoom indicator — shown when zoom != 1.0
    if (devZoom !== 1.0) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(10, canvas.height - 40, 160, 26);
        ctx.fillStyle = '#d4af37';
        ctx.font = '13px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`DEV ZOOM: ${devZoom.toFixed(1)}x  [ - / + ]`, 18, canvas.height - 22);
        ctx.restore();
    }

    // Fade in from black when game first loads
    if (menuPhase === 'GAMEFADEIN' && overlayAlpha > 0) {
        ctx.fillStyle = `rgba(0,0,0,${overlayAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        overlayAlpha = Math.max(0, overlayAlpha - 0.022);
        if (overlayAlpha <= 0) menuPhase = 'DONE';
    }

    // Draw pause menu overlay if paused
    if (gameState.isPaused) {
        drawPauseMenu();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
