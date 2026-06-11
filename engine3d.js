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

// Far plane must clear the largest sky dome (map dim * 1.7 + camera offset)
const cam3 = new THREE.PerspectiveCamera(70, 16 / 9, 1, 24000);
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
let personEntries = []; // { o, fig } — NPC figures, animated in updatePersons3d
let flickerLights = []; // { light, base, phase, steady } — animated in updateAtmosphere3d
let heartFX = null;     // { mesh, mat, light, mode } — the pulsing Heart
let fogBase = [500, 3000]; // CALM-state fog distances for the current map
let playerLamp = null;  // Ellis's carried lantern (underground/interiors)

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

// ---- CHARACTER FIGURES ----
// Procedural humanoids built from primitives (the project stays
// asset-free / no-build). Every figure shares a rig: hip and shoulder
// pivot groups for walk/idle swings, userData.tint for the hostile
// chase flush. A standard figure is ~62 units tall before scale
// (player eye height is 52).
function clothMat(color) {
    return new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
}

function angleDiff(target, current) {
    return ((target - current + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
}

function makeHumanoid(style) {
    const s = style || {};
    const g = new THREE.Group();
    const tint = [];
    const arms = [], legs = [];

    const skinMat = s.stone
        ? new THREE.MeshPhongMaterial({ color: 0x6a6155, shininess: 4, specular: 0x111111 })
        : new THREE.MeshLambertMaterial({ color: new THREE.Color(s.skin || '#b08a5f') });
    if (s.skinGlow) { // Kostas's faint amber-light cast after six years below
        skinMat.emissive = new THREE.Color('#a8b89a');
        skinMat.emissiveIntensity = s.skinGlow;
    }
    const shirtMat = s.stone ? skinMat : clothMat(s.shirt || '#555');
    const pantsMat = s.stone ? skinMat : clothMat(s.pants || '#333');
    if (!s.stone) {
        tint.push({ mat: shirtMat, base: shirtMat.color.clone() },
                  { mat: pantsMat, base: pantsMat.color.clone() });
    }

    const elong = s.elongated ? 1.3 : 1; // Uarha proportions: long torso, domed head
    const legH = 26, torsoH = 22 * elong;
    const torsoW = s.gaunt ? 14 : 17, torsoD = s.gaunt ? 8 : 10;
    const shoulderY = legH + torsoH;

    if (s.robe) {
        const robe = new THREE.Mesh(
            new THREE.CylinderGeometry(torsoW * 0.42, torsoW * 0.7, legH + 2, 8), pantsMat);
        robe.position.y = (legH + 2) / 2;
        g.add(robe);
    } else {
        for (const side of [-1, 1]) {
            const hip = new THREE.Group();
            hip.position.set(side * 4.4, legH, 0);
            const leg = new THREE.Mesh(new THREE.BoxGeometry(6.5, legH, 7), pantsMat);
            leg.position.y = -legH / 2;
            hip.add(leg);
            g.add(hip);
            legs.push(hip);
        }
    }

    const torso = new THREE.Mesh(new THREE.BoxGeometry(torsoW, torsoH, torsoD), shirtMat);
    torso.position.y = legH + torsoH / 2;
    g.add(torso);
    if (s.suit) { // shirt-front panel so the suit reads as a suit
        const panel = new THREE.Mesh(new THREE.BoxGeometry(torsoW * 0.4, torsoH * 0.8, 1.4), clothMat('#cfc6b4'));
        panel.position.set(0, legH + torsoH * 0.55, torsoD / 2 + 0.4);
        g.add(panel);
    }

    const armLen = (torsoH + 2) * (s.elongated ? 1.15 : 1);
    for (const side of [-1, 1]) {
        const shoulder = new THREE.Group();
        shoulder.position.set(side * (torsoW / 2 + 2.6), shoulderY - 2, 0);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(5, armLen, 5.5), shirtMat);
        arm.position.y = -armLen / 2;
        shoulder.add(arm);
        const hand = new THREE.Mesh(
            new THREE.BoxGeometry(4.4, s.elongated ? 9 : 5, 4.6), skinMat);
        hand.position.y = -armLen - (s.elongated ? 4 : 2);
        shoulder.add(hand);
        g.add(shoulder);
        arms.push(shoulder);
    }

    const headR = 6.2 * (s.elongated ? 1.1 : 1);
    const head = new THREE.Mesh(new THREE.SphereGeometry(headR, 10, 8), skinMat);
    if (s.elongated) head.scale.y = 1.35; // the cranial dome
    head.position.y = shoulderY + headR + 1.5;
    g.add(head);

    if (s.eyes) { // faint watching pinpricks (the dark figure)
        const eyeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(s.eyes) });
        for (const side of [-1, 1]) {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.9, 6, 5), eyeMat);
            eye.position.set(side * 2.4, head.position.y + 1, headR * 0.95);
            g.add(eye);
        }
    }

    if (s.headwear === 'cap') {
        const capCol = s.capColor || '#333';
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(headR * 0.95, headR * 1.02, 3.4, 10), clothMat(capCol));
        cap.position.y = head.position.y + headR * 0.78;
        g.add(cap);
        const brim = new THREE.Mesh(new THREE.BoxGeometry(7, 1, 4.5), clothMat(capCol));
        brim.position.set(0, head.position.y + headR * 0.62, headR * 0.9);
        g.add(brim);
    } else if (s.headwear === 'wrap') {
        const wrap = new THREE.Mesh(new THREE.CylinderGeometry(headR * 1.1, headR * 1.12, 5, 10), clothMat(s.wrapColor || '#b8a888'));
        wrap.position.y = head.position.y + headR * 0.55;
        g.add(wrap);
    } else if (s.headwear === 'hood') {
        const hood = new THREE.Mesh(new THREE.ConeGeometry(headR * 1.45, headR * 2.6, 8), clothMat(s.hoodColor || s.pants || '#333'));
        hood.position.y = head.position.y + headR * 0.35;
        g.add(hood);
    } else if (s.hair) {
        const hair = new THREE.Mesh(
            new THREE.SphereGeometry(headR * 1.02, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.45), clothMat(s.hair));
        hair.position.y = head.position.y;
        g.add(hair);
    }

    if (s.accessory === 'book') {
        const book = new THREE.Mesh(new THREE.BoxGeometry(7, 2.2, 9), clothMat('#7a6a4a'));
        book.position.set(torsoW / 2 + 5, legH + torsoH * 0.45, 4);
        g.add(book);
    }

    if (s.stone) { // the Custodian's set-down posture: head bowed, hands met
        head.rotation.x = 0.35;
        arms[0].rotation.x = arms[1].rotation.x = -0.85;
        arms[0].rotation.z = 0.30;
        arms[1].rotation.z = -0.30;
    }

    if (s.scale) g.scale.setScalar(s.scale);
    g.userData = {
        arms, legs, tint,
        height: (shoulderY + headR * 2 + 4) * (s.scale || 1),
        staticPose: !!s.stone,
        phase: Math.random() * Math.PI * 2
    };
    return g;
}

// Character looks, grounded in MASTER_LORE_BIBLE / NEW_CHARACTERS:
// Tariq the foreman in a head wrap, Samir and Yusra robed, Lei a
// 14-year-old (smaller), Kostas gaunt with the faint underground cast,
// Halberd a bureaucrat in a charcoal suit, the SECRET statue a petrified
// Uarha Custodian (elongated, stone, set down).
const PERSON_STYLES = {
    tariq:     { skin: '#8a5a32', shirt: '#4a3a26', pants: '#33291d', headwear: 'wrap', wrapColor: '#b8a888' },
    samir:     { skin: '#7d5b3a', shirt: '#4b3030', pants: '#352020', robe: true, gaunt: true },
    maren:     { skin: '#c79d72', shirt: '#7a1f1f', pants: '#26262c', headwear: 'cap', capColor: '#3a3a3a' },
    boros:     { skin: '#c2a37e', shirt: '#23234d', pants: '#1c1c30', accessory: 'book' },
    yusra:     { skin: '#9a6c42', shirt: '#4b0082', pants: '#37005e', robe: true, headwear: 'hood', hoodColor: '#3a0066' },
    vendor:    { skin: '#8a5a32', shirt: '#2e6b47', pants: '#3a2f20', headwear: 'cap', capColor: '#5a4a30' },
    lei:       { skin: '#9a6c42', shirt: '#c46d2a', pants: '#4a3a2a', scale: 0.78 },
    kostas:    { skin: '#cbc4ae', shirt: '#26323a', pants: '#202a30', gaunt: true, skinGlow: 0.18 },
    halberd:   { skin: '#c9a98a', shirt: '#2d3436', pants: '#23282b', suit: true, hair: '#b5b0a6' },
    layla:     { skin: '#8a5a32', shirt: '#3a2a1a', pants: '#2c2014', robe: true, headwear: 'hood', hoodColor: '#5a4632' },
    host:      { skin: '#8a5a32', shirt: '#4a0082', pants: '#2a1a3a', headwear: 'cap', capColor: '#2a1a3a' },
    stranger:  { skin: '#7c6b58', shirt: '#2a1a2a', pants: '#1a101a', headwear: 'hood', hoodColor: '#241424' },
    worker:    { skin: '#7a5230', shirt: '#5c3a1a', pants: '#3a2a18' },
    guard:     { skin: '#9a7050', shirt: '#2a2a8a', pants: '#1d1d50', headwear: 'cap', capColor: '#1d1d50' },
    figure:    { skin: '#0a0a0a', shirt: '#0a0a0a', pants: '#060606', eyes: '#d4af37', scale: 1.06 },
    custodian: { stone: true, elongated: true, scale: 1.18 },
};

// Map-object ids that are people (rendered as figures, not boxes)
const PERSON_OBJECTS = {
    tariq_talk: 'tariq', cut_tariq: 'tariq', tf_tariq: 'tariq',
    trap_samir: 'samir',
    cut_maren: 'maren', cut_boros: 'boros',
    yusra_meet: 'yusra', yusra: 'yusra', sf_yusra: 'yusra',
    ch3_vendor: 'vendor', ch3_lei: 'lei',
    kostas_ch5: 'kostas',
    halberd_farewell: 'halberd', hlb_halberd: 'halberd',
    tf_sister: 'layla',
    hk_host: 'host', hk_stranger: 'stranger',
    dorm_awake: 'worker',
    secret_statue: 'custodian',
    hng_standoff: 'standoff',
};

const HOSTILE_STYLES = {
    guard_ministry:  PERSON_STYLES.guard,
    figure_dark:     PERSON_STYLES.figure,
    worker_panicked: PERSON_STYLES.worker,
    samir_hostile:   PERSON_STYLES.samir,
};

// The Ch5 hangar standoff: one figure per faction, squared off
function makeStandoffGroup() {
    const group = new THREE.Group();
    const factions = [PERSON_STYLES.guard, PERSON_STYLES.figure, PERSON_STYLES.halberd, PERSON_STYLES.yusra];
    factions.forEach((st, i) => {
        const fig = makeHumanoid(st);
        const a = (i / factions.length) * Math.PI * 2 + 0.5;
        fig.position.set(Math.cos(a) * 55, 0, Math.sin(a) * 45);
        fig.rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a)); // face the circle's center
        group.add(fig);
    });
    group.userData = { arms: [], legs: [], tint: [], height: 72, staticPose: true, phase: 0 };
    return group;
}

// ---- PER-MAP ATMOSPHERE ----
// type 'ext' = open night sky (moon, stars); 'und' = underground
// (ceiling, dense fog, amber point lights); 'int' = building interior.
// fog: [near, far] at CALM sanity — fog closes in as sanity drops.
const MAP_ATMOS = {
    1:           { type: 'ext', fog: [900, 4800],  hemi: 0.80, moon: 0.55, stars: true },
    'MARKET':    { type: 'ext', fog: [600, 3600],  hemi: 0.70, moon: 0.40, stars: true },
    'AIRFIELD':  { type: 'ext', fog: [900, 5200],  hemi: 0.65, moon: 0.65, stars: true },
    'TRAP':      { type: 'und', fog: [90, 1700],   ceiling: 240 },
    'SECRET':    { type: 'und', fog: [110, 2000],  ceiling: 280 },
    'CUTTHROAT': { type: 'und', fog: [80, 1500],   ceiling: 250 },
    'CITY':      { type: 'und', fog: [260, 3400],  ceiling: 380, hemi: 0.65 },
    'GATE':      { type: 'und', fog: [160, 2800],  ceiling: 320, hemi: 0.55 },
    'FINAL':     { type: 'und', fog: [300, 3400],  ceiling: 700, hemi: 0.6, heart: true },
};

function atmosForCurrentMap() {
    if (interiorState.active || /^INT_/.test(String(currentMapKey))) {
        return { type: 'int', fog: [300, 1600], ceiling: 140 };
    }
    return MAP_ATMOS[currentMapKey] || { type: 'und', fog: [120, 2200], ceiling: 260 };
}

// ---- SKY & HORIZON BACKDROPS ----
// Exterior maps get a gradient sky dome, a moon, and location-specific
// horizon silhouettes so the world edge isn't a void.
const SKY_STOPS = {
    1:          [[0, '#02030a'], [0.55, '#0a1020'], [0.8, '#1d1b26'], [1, '#33291f']],
    'MARKET':   [[0, '#040309'], [0.5, '#100a18'], [0.78, '#241423'], [1, '#3f2317']],
    'AIRFIELD': [[0, '#020308'], [0.6, '#0a0e18'], [0.85, '#141a24'], [1, '#23262b']],
};
// Underground maps keep darkness, but tinted to the place
const UND_BG = { 'CITY': '#0b0806', 'GATE': '#080606', 'FINAL': '#0b0803' };

function makeGradientSky(stops) {
    const c = document.createElement('canvas');
    c.width = 4; c.height = 256;
    const cc = c.getContext('2d');
    const g = cc.createLinearGradient(0, 0, 0, 256);
    for (const [o, col] of stops) g.addColorStop(o, col);
    cc.fillStyle = g;
    cc.fillRect(0, 0, 4, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding; // keep authored night colors (no gamma lift)
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false });
    mat.fog = false;
    const R = Math.max(WORLD.width, WORLD.height) * 1.7;
    const sky = new THREE.Mesh(new THREE.SphereGeometry(R, 24, 12), mat);
    sky.position.set(WORLD.width / 2, 0, WORLD.height / 2);
    sky.renderOrder = -10;
    return sky;
}

function makeMoon() {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const cc = c.getContext('2d');
    const g = cc.createRadialGradient(64, 64, 8, 64, 64, 64);
    g.addColorStop(0, 'rgba(235,240,250,1)');
    g.addColorStop(0.25, 'rgba(210,220,240,0.9)');
    g.addColorStop(0.5, 'rgba(160,180,215,0.25)');
    g.addColorStop(1, 'rgba(160,180,215,0)');
    cc.fillStyle = g;
    cc.fillRect(0, 0, 128, 128);
    const moonTex = new THREE.CanvasTexture(c);
    moonTex.encoding = THREE.sRGBEncoding;
    const mat = new THREE.SpriteMaterial({ map: moonTex, transparent: true });
    mat.fog = false;
    const moon = new THREE.Sprite(mat);
    moon.scale.set(900, 900, 1);
    moon.position.set(WORLD.width * 0.85, 2300, -WORLD.height * 0.55);
    return moon;
}

function silhouetteMat() {
    const m = new THREE.MeshBasicMaterial({ color: 0x040408 });
    m.fog = false;
    return m;
}

function addHorizonSilhouettes(group) {
    if (currentMapKey === 1) {
        // The Giza pyramids on the north-west horizon — the dig site's lids
        const defs = [
            { x: -2400, z: 600,   r: 1500, h: 950 },  // Khufu
            { x: -1100, z: -1500, r: 1250, h: 800 },  // Khafre
            { x: 400,   z: -2300, r: 700,  h: 420 },  // Menkaure
        ];
        for (const d of defs) {
            const pyr = new THREE.Mesh(new THREE.ConeGeometry(d.r, d.h, 4), silhouetteMat());
            pyr.rotation.y = Math.PI / 4;
            pyr.position.set(d.x, d.h / 2, d.z);
            group.add(pyr);
        }
    } else if (currentMapKey === 'MARKET') {
        // Old Cairo skyline ring + two minarets
        const cx = WORLD.width / 2, cz = WORLD.height / 2;
        const R = Math.max(WORLD.width, WORLD.height) * 0.78;
        for (let i = 0; i < 26; i++) {
            const a = (i / 26) * Math.PI * 2 + (i % 3) * 0.07;
            const w = 300 + (i * 137) % 380;
            const h = 200 + (i * 251) % 420;
            const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w * 0.7), silhouetteMat());
            b.position.set(cx + Math.cos(a) * R, h / 2, cz + Math.sin(a) * R);
            group.add(b);
        }
        for (const [mx, mz] of [[cx - R * 0.5, cz - R * 0.85], [cx + R * 0.7, cz - R * 0.6]]) {
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(38, 50, 760, 8), silhouetteMat());
            shaft.position.set(mx, 380, mz);
            group.add(shaft);
            const cap = new THREE.Mesh(new THREE.ConeGeometry(60, 140, 8), silhouetteMat());
            cap.position.set(mx, 830, mz);
            group.add(cap);
        }
    } else if (currentMapKey === 'AIRFIELD') {
        // Control tower beyond the east fence + distant hangar mass
        const tower = new THREE.Group();
        const shaft = new THREE.Mesh(new THREE.BoxGeometry(130, 520, 130), silhouetteMat());
        shaft.position.y = 260;
        tower.add(shaft);
        const cab = new THREE.Mesh(new THREE.BoxGeometry(260, 110, 260), silhouetteMat());
        cab.position.y = 575;
        tower.add(cab);
        tower.position.set(WORLD.width + 900, 0, WORLD.height * 0.3);
        group.add(tower);
        const hangarFar = new THREE.Mesh(new THREE.BoxGeometry(1500, 360, 700), silhouetteMat());
        hangarFar.position.set(-1200, 180, WORLD.height * 0.55);
        group.add(hangarFar);
    }
}

// Objects that should cast real light in 3D (matched by label or amber color)
const LIGHT_LABEL_RE = /lantern|brazier|lamp|fire|flood|hearth|channel|amber|glyph lock|tea corner/i;
const EMISSIVE_COLORS = { '#d4af37': 0.55, '#8b6914': 0.5, '#b8860b': 0.4 };

function isLightSource(o) {
    return LIGHT_LABEL_RE.test(o.label || '') || o.color === '#d4af37';
}

// Height heuristics for extruding 2D rectangles into graybox boxes
function wallHeightFor(wall, atmos) {
    const touchesEdge = wall.x <= 0 || wall.y <= 0 ||
        wall.x + wall.w >= WORLD.width || wall.y + wall.h >= WORLD.height;

    if (atmos.type === 'int') {
        return touchesEdge ? atmos.ceiling : 55; // room shell vs furniture
    }
    if (atmos.type === 'und') {
        // Long walls and big masses are rock structure reaching the ceiling;
        // small squares read as broken columns / rubble stumps
        const aspect = Math.max(wall.w, wall.h) / Math.min(wall.w, wall.h);
        if (touchesEdge || aspect >= 3 || Math.min(wall.w, wall.h) >= 150) return atmos.ceiling;
        return Math.min(150, atmos.ceiling * 0.75);
    }
    if (touchesEdge && (wall.w >= WORLD.width * 0.8 || wall.h >= WORLD.height * 0.8)) {
        return WALL_HEIGHT_BORDER;
    }
    if (Math.min(wall.w, wall.h) <= 25) return WALL_HEIGHT_LOW;
    return WALL_HEIGHT_DEFAULT;
}

function objectHeightFor(o, atmos) {
    if (o.id && /_bldg$/.test(o.id)) return 150;           // enterable building shells
    if (o.interactScene && /^door_/.test(o.interactScene)) return 8; // door mats stay flat
    if (/pillar|column|colonnade/i.test(o.label || '')) {
        return atmos.ceiling ? Math.min(atmos.ceiling * 0.85, 280) : 120;
    }
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
    flickerLights = [];
    heartFX = null;

    const atmos = atmosForCurrentMap();
    const palette = getChapterPalette();
    const groundCol = new THREE.Color(groundColorForCurrentMap());

    // Sky + fog. Underground is near-black (tinted per place) with the
    // fog closing in; exteriors get a dome, moon and horizon silhouettes.
    const fogCol = atmos.type === 'und'
        ? new THREE.Color(UND_BG[currentMapKey] || '#060503')
        : groundCol.clone().multiplyScalar(0.3);
    scene3.background = fogCol;
    if (atmos.type === 'ext') {
        worldGroup.add(makeGradientSky(SKY_STOPS[currentMapKey] || SKY_STOPS[1]));
        worldGroup.add(makeMoon());
        addHorizonSilhouettes(worldGroup);
    }
    fogBase = atmos.fog.slice();
    scene3.fog = new THREE.Fog(fogCol, fogBase[0], fogBase[1]);

    // Ground plane (Phong: point lights evaluated per pixel)
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(WORLD.width, WORLD.height),
        new THREE.MeshPhongMaterial({ color: groundCol, shininess: 4, specular: 0x0a0a0a })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(WORLD.width / 2, 0, WORLD.height / 2);
    worldGroup.add(ground);

    // Ceiling for underground maps and interiors
    if (atmos.ceiling) {
        const ceil = new THREE.Mesh(
            new THREE.PlaneGeometry(WORLD.width, WORLD.height),
            new THREE.MeshPhongMaterial({
                color: atmos.type === 'int' ? 0x16110c : 0x0c0a07,
                shininess: 2, specular: 0x050505
            })
        );
        ceil.rotation.x = Math.PI / 2;
        ceil.position.set(WORLD.width / 2, atmos.ceiling, WORLD.height / 2);
        worldGroup.add(ceil);
    }

    // Survey grid only on exterior sand (underground floors stay rock)
    if (atmos.type === 'ext') {
        const grid = new THREE.GridHelper(
            Math.max(WORLD.width, WORLD.height),
            Math.max(WORLD.width, WORLD.height) / 200,
            0x55492f, 0x3a3222
        );
        grid.position.set(WORLD.width / 2, 0.5, WORLD.height / 2);
        grid.material.transparent = true;
        grid.material.opacity = 0.2;
        worldGroup.add(grid);
    }

    // Base lighting rig per atmosphere type
    if (atmos.type === 'ext') {
        worldGroup.add(new THREE.HemisphereLight(0x223044, 0x33291a, atmos.hemi));
        const moon = new THREE.DirectionalLight(0x9db4d4, atmos.moon);
        moon.position.set(WORLD.width * 0.3, 1400, WORLD.height * 0.15);
        worldGroup.add(moon);
        worldGroup.add(new THREE.AmbientLight(0xd4af37, 0.07));
        // Star field, drawn beyond the fog
        const starGeo = new THREE.BufferGeometry();
        const starPos = [];
        const R = Math.max(WORLD.width, WORLD.height) * 1.3;
        for (let i = 0; i < 700; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = R * (0.35 + Math.random() * 0.65);
            starPos.push(WORLD.width / 2 + Math.cos(a) * r,
                         700 + Math.random() * 2200,
                         WORLD.height / 2 + Math.sin(a) * r);
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xbfc8e0, size: 7, transparent: true, opacity: 0.8, sizeAttenuation: true });
        starMat.fog = false;
        worldGroup.add(new THREE.Points(starGeo, starMat));
    } else if (atmos.type === 'und') {
        // Grand spaces (city, gate, final) carry more residual amber glow
        worldGroup.add(new THREE.HemisphereLight(0x2a2418, 0x0c0a06, atmos.hemi || 0.45));
        worldGroup.add(new THREE.AmbientLight(0xd4af37, 0.16));
    } else { // interior
        worldGroup.add(new THREE.HemisphereLight(0x2a2218, 0x14100a, 0.45));
        const roomLight = new THREE.PointLight(0xe8c068, 1.0, 1100, 2);
        roomLight.position.set(WORLD.width / 2, atmos.ceiling - 25, WORLD.height / 2);
        worldGroup.add(roomLight);
        flickerLights.push({ light: roomLight, base: 1.0, phase: Math.random() * 10, steady: false });
    }

    // --- Walls (extruded from mapWalls; same data the collision uses) ---
    // Walls whose rect exactly matches a map object are collision twins
    // (trucks, pillars, stalls) — skip them so the colored object renders
    // without z-fighting.
    const objectRects = new Set((activeMapObjects || []).map(o => `${o.x},${o.y},${o.w},${o.h}`));
    gateMeshes = [];
    const wallMat = new THREE.MeshPhongMaterial({
        // Underground rock needs more lift — palette wallFills are near-black
        color: new THREE.Color(palette.wallFill).lerp(new THREE.Color('#998c70'), atmos.type === 'und' ? 0.4 : 0.25),
        shininess: 6, specular: 0x111111
    });
    const gateMat = new THREE.MeshPhongMaterial({ color: 0x8b6914, shininess: 10, specular: 0x222211 });
    for (const wall of (mapWalls[currentMapKey] || [])) {
        if (!wall.isGate && objectRects.has(`${wall.x},${wall.y},${wall.w},${wall.h}`)) continue;
        const h = wallHeightFor(wall, atmos);
        const mesh = addBoxAt(worldGroup, wall.x, wall.y, wall.w, wall.h, h, wall.isGate ? gateMat : wallMat);
        if (wall.isGate) gateMeshes.push({ mesh, gateFlag: wall.gateFlag });
    }

    // --- Map objects (interactables get labels, decoratives are plain) ---
    objectEntries = [];
    personEntries = [];
    const lightBudget = [];
    for (const o of (activeMapObjects || [])) {
        // People stand as figures, not boxes
        const personKey = PERSON_OBJECTS[o.id];
        if (personKey) {
            const fig = personKey === 'standoff'
                ? makeStandoffGroup()
                : makeHumanoid(PERSON_STYLES[personKey]);
            const cx = o.x + o.w / 2, cz = o.y + o.h / 2;
            fig.position.set(cx, 0, cz);
            // Default facing: into the map (rotation 0 faces 2D "south" / +z)
            fig.rotation.y = cz < WORLD.height / 2 ? 0 : Math.PI;
            worldGroup.add(fig);
            let label = null;
            if (!o.decorative && o.interactScene) {
                label = makeLabelSprite(o.label || o.id, '#f4e4b0');
                label.position.set(cx, fig.userData.height + 18, cz);
                worldGroup.add(label);
            }
            objectEntries.push({ o, mesh: fig, label });
            personEntries.push({ o, fig });
            continue;
        }
        // Ground features (trench, chasm) read as openings in the earth,
        // not raised boxes: black floor cut + broken rim + amber underglow
        if (/trench|chasm|crack|fissure/i.test(o.label || '')) {
            const feature = new THREE.Group();
            const pitMat = new THREE.MeshBasicMaterial({ color: 0x010101 });
            const pit = new THREE.Mesh(new THREE.PlaneGeometry(o.w, o.h), pitMat);
            pit.rotation.x = -Math.PI / 2;
            pit.position.set(o.x + o.w / 2, 1.5, o.y + o.h / 2);
            feature.add(pit);
            // Faint warm glow seeping up from below (the ground breathes)
            const glow = new THREE.Mesh(
                new THREE.BoxGeometry(o.w * 0.6, 1.5, o.h * 0.3),
                new THREE.MeshPhongMaterial({ color: 0x1a1206, emissive: 0xd4af37, emissiveIntensity: 0.35 })
            );
            glow.position.set(o.x + o.w / 2, 2.2, o.y + o.h / 2);
            feature.add(glow);
            const pitLight = new THREE.PointLight(0xd4af37, 0.7, 340, 2);
            pitLight.position.set(o.x + o.w / 2, 26, o.y + o.h / 2);
            feature.add(pitLight);
            flickerLights.push({ light: pitLight, base: 0.7, phase: Math.random() * 10, steady: false });
            // Broken rim debris along the long edges
            const along = o.w >= o.h ? 'x' : 'z';
            const len = Math.max(o.w, o.h);
            const pieces = Math.max(4, Math.round(len / 70));
            for (let i = 0; i < pieces; i++) {
                const t = (i + 0.5) / pieces + (((i * 7) % 3) - 1) * 0.04;
                const ph = 5 + ((i * 13) % 9);
                const pw = 18 + ((i * 31) % 22);
                const rim = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pw * 0.7),
                    new THREE.MeshPhongMaterial({ color: new THREE.Color(palette.wallFill).lerp(new THREE.Color('#776a50'), 0.35) }));
                if (along === 'x') {
                    rim.position.set(o.x + t * o.w, ph / 2, o.y + ((i % 2) ? -6 : o.h + 6));
                } else {
                    rim.position.set(o.x + ((i % 2) ? -6 : o.w + 6), ph / 2, o.y + t * o.h);
                }
                feature.add(rim);
            }
            worldGroup.add(feature);
            let label = null;
            if (!o.decorative && o.interactScene) {
                label = makeLabelSprite(o.label || o.id, '#f4e4b0');
                label.position.set(o.x + o.w / 2, 42, o.y + o.h / 2);
                worldGroup.add(label);
            }
            objectEntries.push({ o, mesh: feature, label });
            continue;
        }
        const h = objectHeightFor(o, atmos);
        const matOpts = { color: new THREE.Color(o.color || '#777'), shininess: 6, specular: 0x0d0d0d };
        const emissive = EMISSIVE_COLORS[o.color];
        if (emissive) {
            matOpts.emissive = new THREE.Color(o.color);
            matOpts.emissiveIntensity = emissive;
        }
        const mesh = addBoxAt(worldGroup, o.x, o.y, o.w, o.h, h, new THREE.MeshPhongMaterial(matOpts));
        let label = null;
        if (!o.decorative && o.interactScene) {
            label = makeLabelSprite(o.label || o.id, '#f4e4b0');
            label.position.set(o.x + o.w / 2, h + 26, o.y + o.h / 2);
            worldGroup.add(label);
        }
        objectEntries.push({ o, mesh, label });
        if (isLightSource(o)) lightBudget.push({ o, h });
    }

    // --- Point lights from light-source props (capped for performance;
    //     interactables like braziers/rest sites win over set dressing) ---
    lightBudget.sort((a, b) => (b.o.interactScene ? 1 : 0) - (a.o.interactScene ? 1 : 0));
    let lightsPlaced = 0;
    const MAX_LIGHTS = 14;
    for (const { o, h } of lightBudget) {
        if (lightsPlaced >= MAX_LIGHTS) break;
        const cool = /flood/i.test(o.label || '');
        const color = cool ? 0xcfe0ff : 0xe8b545;
        const dist = atmos.type === 'und' ? 700 : 560;
        // Long strips (amber channels) get a light at each end
        const spots = [];
        if (Math.max(o.w, o.h) > 800) {
            if (o.h > o.w) {
                spots.push([o.x + o.w / 2, o.y + o.h * 0.22], [o.x + o.w / 2, o.y + o.h * 0.78]);
            } else {
                spots.push([o.x + o.w * 0.22, o.y + o.h / 2], [o.x + o.w * 0.78, o.y + o.h / 2]);
            }
        } else {
            spots.push([o.x + o.w / 2, o.y + o.h / 2]);
        }
        for (const [lx, lz] of spots) {
            if (lightsPlaced >= MAX_LIGHTS) break;
            const pl = new THREE.PointLight(color, cool ? 1.4 : 1.15, dist, 2);
            pl.position.set(lx, Math.max(h * 0.85, 30) + (cool ? 120 : 14), lz);
            worldGroup.add(pl);
            flickerLights.push({ light: pl, base: pl.intensity, phase: Math.random() * 10, steady: cool });
            lightsPlaced++;
        }
    }

    // --- The Heart (Ch7 final chamber): an inside-out lantern the size
    //     of a cathedral dome, pinging every 8 seconds like the Codex ---
    if (atmos.heart) {
        const heartMat = new THREE.MeshPhongMaterial({
            color: 0x4a3208, emissive: 0xd4af37, emissiveIntensity: 0.5,
            transparent: true, opacity: 0.92, shininess: 30
        });
        const heart = new THREE.Mesh(new THREE.SphereGeometry(230, 32, 24), heartMat);
        // Looms directly above the blank-tablet pedestal
        heart.position.set(WORLD.width / 2, 380, 850);
        worldGroup.add(heart);
        const heartLight = new THREE.PointLight(0xd4af37, 1.0, 3200, 2);
        heartLight.position.copy(heart.position);
        worldGroup.add(heartLight);
        heartFX = { mesh: heart, mat: heartMat, light: heartLight, mode: 'ping' };
    }
    // Ch4: the Heart's presence above its pedestal in the inner sanctum
    const cityHeart = (activeMapObjects || []).find(o => o.id === 'heart_pedestal');
    if (cityHeart) {
        const mat = new THREE.MeshPhongMaterial({
            color: 0x3a2806, emissive: 0xd4af37, emissiveIntensity: 0.4,
            transparent: true, opacity: 0.9, shininess: 30
        });
        const orb = new THREE.Mesh(new THREE.SphereGeometry(110, 24, 18), mat);
        orb.position.set(cityHeart.x + cityHeart.w / 2, 230, cityHeart.y + cityHeart.h / 2);
        worldGroup.add(orb);
        const orbLight = new THREE.PointLight(0xd4af37, 0.9, 1600, 2);
        orbLight.position.copy(orb.position);
        worldGroup.add(orbLight);
        heartFX = { mesh: orb, mat, light: orbLight, mode: 'breathe' };
    }

    // Ellis's lantern — a carried light underground and indoors (the
    // surface camp is lit well enough that it would wash out the night)
    playerLamp = null;
    if (atmos.type !== 'ext') {
        playerLamp = new THREE.PointLight(0xe8b545, 1.15, 580, 2);
        scene3.add(playerLamp);
    }

    scene3.add(worldGroup);
    buildMinistryCar(); // scene was recreated; re-add dynamic meshes
    hostileMeshes = new Map(); // hostile meshes were dropped with the old scene
    builtSignature = currentWorldSignature();
    // Face into the map: Ch1+ spawns enter from the south looking north,
    // the Ch2 descent routes enter from the north looking south
    camYaw = (player.y + player.size / 2) < WORLD.height / 2 ? Math.PI : 0;
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
            // or too far (horizon clutter); full strength in the mid band.
            // Ranges sized for the expanded (1.4-1.6x) maps.
            const dist = Math.hypot(e.o.x + e.o.w / 2 - px, e.o.y + e.o.h / 2 - py);
            let alpha = 1;
            if (dist < 60) alpha = 0;
            else if (dist < 140) alpha = (dist - 60) / 80;
            else if (dist > 1700) alpha = 0;
            else if (dist > 1250) alpha = 1 - (dist - 1250) / 450;
            e.label.material.opacity = alpha;
            e.label.visible = !hidden && alpha > 0.02;
        }
    }
}

// ---- NPC FIGURE ANIMATION ----
// Gentle breathing sway, and people turn to watch Ellis as he gets
// close (everyone in this story is watching him). The petrified
// Custodian never turns — its cone of attention was fixed centuries ago.
function updatePersons3d() {
    const t = performance.now() / 1000;
    const px = player.x + player.size / 2;
    const py = player.y + player.size / 2;
    for (const p of personEntries) {
        const u = p.fig.userData;
        if (u.staticPose || !p.fig.visible) continue;
        for (let i = 0; i < u.arms.length; i++) {
            u.arms[i].rotation.x = Math.sin(t * 1.3 + u.phase + i * Math.PI) * 0.06;
        }
        p.fig.position.y = Math.sin(t * 1.1 + u.phase) * 0.6;
        const dx = px - p.fig.position.x;
        const dz = py - p.fig.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 560 && dist > 1) {
            p.fig.rotation.y += angleDiff(Math.atan2(dx, dz), p.fig.rotation.y) * 0.06;
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

// ---- JUMP ----
// SPACE jumps when no interactable is in range (the engine.js SPACE
// handler only fires when gameState.activeInteractableId is set, so the
// two never collide). The jump is vertical only — ground collision
// rules stay identical to the 2D build.
let jumpY = 0, jumpVel = 0, isAirborne = false;
const JUMP_VELOCITY = 6.6, JUMP_GRAVITY = 0.44; // peak ~50 units (~1.5m), ~0.5s airtime

window.addEventListener('keydown', e => {
    if (e.code !== 'Space') return;
    if (!gameplayInputActive() || gameState.activeInteractableId || gameState.isResting) return;
    if (isAirborne || gameState.staminaExhausted) return;
    isAirborne = true;
    jumpVel = JUMP_VELOCITY;
    gameState.stamina = Math.max(0, gameState.stamina - 0.4);
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
    if (gameState.staminaExhausted && gameState.stamina >= STAMINA.recoverAt) gameState.staminaExhausted = false;

    gameState.isSprinting = shiftHeld && !gameState.staminaExhausted && gameState.stamina > 0 && !gameState.isDialogueActive;
    if (gameState.isSprinting) {
        gameState.stamina = Math.max(0, gameState.stamina - STAMINA.drain);
    } else if (gameState.stamina < gameState.maxStamina) {
        const regenRate = gameState.inventory.includes('Karkadeh') ? STAMINA.regenKarkadeh
            : gameState.inventory.includes('Mint Tea') ? STAMINA.regenTea : STAMINA.regen;
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

    // Jump arc — integrates even during dialogue so a jump always lands
    if (isAirborne && !gameState.isPaused) {
        jumpY += jumpVel;
        jumpVel -= JUMP_GRAVITY;
        if (jumpY <= 0) { jumpY = 0; jumpVel = 0; isAirborne = false; }
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
let hostileMeshes = new Map(); // hostile object -> { group, lastX, lastY, facing }

function syncHostiles3d() {
    // Create figures for new hostiles
    for (const h of hostiles) {
        if (hostileMeshes.has(h)) continue;
        const group = makeHumanoid(HOSTILE_STYLES[h.defKey] ||
            { shirt: h.def.color, pants: h.def.color });
        const label = makeLabelSprite(h.def.label, '#cccccc');
        label.position.y = group.userData.height + 14;
        group.add(label);
        scene3.add(group);
        hostileMeshes.set(h, { group, lastX: h.x, lastY: h.y, facing: 0 });
    }
    // Remove figures whose hostiles are gone (clearHostiles replaces the array)
    for (const [h, entry] of hostileMeshes) {
        if (!hostiles.includes(h)) {
            scene3.remove(entry.group);
            hostileMeshes.delete(h);
        }
    }
    // Walk cycle, facing, and chase flush
    for (const [h, entry] of hostileMeshes) {
        const u = entry.group.userData;
        const mx = h.x - entry.lastX, my = h.y - entry.lastY;
        entry.lastX = h.x;
        entry.lastY = h.y;
        const moving = Math.hypot(mx, my) > 0.05;
        const swing = moving ? Math.sin(h.bobPhase * 2.4) * 0.55 : 0;
        for (let i = 0; i < u.arms.length; i++) u.arms[i].rotation.x = (i ? swing : -swing) * 0.8;
        for (let i = 0; i < u.legs.length; i++) u.legs[i].rotation.x = i ? -swing : swing;
        if (moving) entry.facing = Math.atan2(mx, my);
        entry.group.rotation.y += angleDiff(entry.facing, entry.group.rotation.y) * 0.18;
        const bob = moving ? Math.abs(Math.sin(h.bobPhase * 2.4)) * 1.6 : 0;
        entry.group.position.set(h.x + h.def.size / 2, bob, h.y + h.def.size / 2);
        if (h.state === 'chase') {
            // Clothes flush red while chasing (same pulse rhythm as 2D)
            const pulse = 0.7 + Math.sin(h.bobPhase * 2) * 0.3;
            for (const tn of u.tint) {
                tn.mat.color.setRGB(0.62 * pulse + tn.base.r * 0.25, tn.base.g * 0.2, tn.base.b * 0.2);
            }
        } else {
            for (const tn of u.tint) tn.mat.color.copy(tn.base);
        }
        entry.group.visible = h.state !== 'idle';
    }
}

// ---- CAMERA PLACEMENT ----
function positionCamera() {
    const cx = player.x + player.size / 2;
    const cz = player.y + player.size / 2;
    const bob = isAirborne ? 0 : Math.sin(gameState.walkBobPhase) * 1.6;
    let shakeX = 0, shakeY = 0, shakeZ = 0;
    if (gameState.sanityState === 'FRACTURED') {
        shakeX = (Math.random() - 0.5) * 3;
        shakeY = (Math.random() - 0.5) * 2;
        shakeZ = (Math.random() - 0.5) * 3;
    }
    cam3.position.set(cx + shakeX, EYE_HEIGHT + jumpY + bob + shakeY, cz + shakeZ);
    cam3.rotation.y = camYaw;
    cam3.rotation.x = camPitch;
    if (playerLamp) {
        // Carried slightly ahead and below eye level, with a faint sway
        playerLamp.position.set(
            cx - Math.sin(camYaw) * 30,
            EYE_HEIGHT - 10 + jumpY + bob,
            cz - Math.cos(camYaw) * 30
        );
    }
}

// ---- ATMOSPHERE ANIMATION ----
// Flame flicker on warm lights, the Heart's 8-second witness ping
// (same rhythm as the Codex pulse), and fog that closes in as sanity slips.
const SANITY_FOG_MUL = { CALM: 1.0, STRAINED: 0.6, FRACTURED: 0.38 };

function updateAtmosphere3d() {
    const t = performance.now() / 1000;

    for (const f of flickerLights) {
        if (f.steady) continue;
        f.light.intensity = f.base * (0.86 + 0.10 * Math.sin(t * 9 + f.phase)
                                           + 0.06 * Math.sin(t * 23 + f.phase * 1.7));
    }

    if (heartFX) {
        if (heartFX.mode === 'ping') {
            // Sharp pulse at the start of every 8-second cycle, then decay
            const phase = t % 8;
            const ping = Math.exp(-(phase * phase) / 0.5);
            heartFX.light.intensity = 0.9 + 2.8 * ping;
            heartFX.mat.emissiveIntensity = 0.45 + 0.85 * ping;
        } else {
            // Slow breathing for the Ch4 sanctum presence
            const breathe = 0.5 + 0.5 * Math.sin(t * 0.78);
            heartFX.light.intensity = 0.7 + 0.5 * breathe;
            heartFX.mat.emissiveIntensity = 0.3 + 0.35 * breathe;
        }
    }

    if (scene3.fog) {
        const mul = SANITY_FOG_MUL[gameState.sanityState] || 1.0;
        scene3.fog.near += (fogBase[0] * mul - scene3.fog.near) * 0.03;
        scene3.fog.far  += (fogBase[1] * mul - scene3.fog.far)  * 0.03;
    }
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

// ---- MAIN MENU (3D vista + DOM overlay) ----
const menuOverlayEl = document.getElementById('menu-overlay');
const menuContinueEl = document.getElementById('menu-continue');

function begin3dGame() {
    if (gameState.currentScreen !== 'START_MENU') return;
    menuOverlayEl.classList.add('hidden');
    startGame(); // sets GAMEFADEIN + overlayAlpha for the fade-in
}

// Continue button appears only when a save exists; checked whenever the
// menu is (re)shown rather than every frame.
function syncContinueButton() {
    menuContinueEl.classList.toggle('hidden', !hasSave());
}
syncContinueButton();

menuContinueEl.addEventListener('click', () => {
    if (gameState.currentScreen !== 'START_MENU') return;
    if (loadGame()) menuOverlayEl.classList.add('hidden');
});

document.getElementById('menu-start').addEventListener('click', begin3dGame);
document.getElementById('menu-controls').addEventListener('click', () => {
    document.getElementById('menu-controls-panel').classList.toggle('hidden');
});
window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && gameState.currentScreen === 'START_MENU') {
        e.preventDefault();
        begin3dGame();
    }
});

// The smiley (with hair) from the 2D title screen lives on here
function drawMenuSmiley() {
    ctx.save();
    const sx = canvas.width - 30, sy = canvas.height - 30, sr = 16;
    ctx.strokeStyle = '#6B3A2A'; ctx.lineWidth = 2.5;
    [-0.55, -0.28, 0, 0.28, 0.55].forEach(a => {
        const angle = 3 * Math.PI / 2 + a;
        ctx.beginPath();
        ctx.moveTo(sx + (sr - 3) * Math.cos(angle), sy + (sr - 3) * Math.sin(angle));
        ctx.lineTo(sx + (sr + 7) * Math.cos(angle), sy + (sr + 7) * Math.sin(angle));
        ctx.stroke();
    });
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = '#FFE600'; ctx.fill();
    ctx.strokeStyle = '#CC9900'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(sx - 5, sy - 5, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx + 5, sy - 5, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx, sy + 1, 8, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
}

// ---- MAIN LOOP ----
function gameLoop3d() {
    requestAnimationFrame(gameLoop3d);
    resizeRendererIfNeeded();

    // Clear the 2D overlay every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState.currentScreen === 'START_MENU') {
        // Live vista: slow orbit over the night camp behind the DOM menu
        if (menuOverlayEl.classList.contains('hidden')) {
            menuOverlayEl.classList.remove('hidden');
            syncContinueButton(); // returning to menu — a save may now exist
        }
        ensureWorldBuilt();
        for (const e of objectEntries) if (e.label) e.label.visible = false;
        updateAtmosphere3d();
        const t = performance.now() / 1000;
        const ang = t * 0.055;
        const cx = 1703, cz = 2400; // tent compound center
        cam3.position.set(cx + Math.cos(ang) * 850, 310, cz + Math.sin(ang) * 850);
        cam3.lookAt(cx, 30, cz);
        renderer3.render(scene3, cam3);
        drawMenuSmiley();
        syncSanityFilter();
        return;
    }
    if (!menuOverlayEl.classList.contains('hidden')) menuOverlayEl.classList.add('hidden');

    ensureWorldBuilt();
    syncPointerLock();
    updatePlayer3d();
    updateHostiles();    // existing patrol/chase/catch AI, unchanged
    updatePhantoms();    // existing sanity hallucination logic, unchanged
    updateMinistryCar3d();
    updateInteractions3d();
    syncHostiles3d();
    syncWorldVisibility();
    updatePersons3d();
    updateAtmosphere3d();
    updateCamera();      // keeps the 2D camera roughly centered for overlay draw math
    positionCamera();
    renderer3.render(scene3, cam3);

    drawOverlays();
    syncSanityFilter();
}

gameLoop3d();
