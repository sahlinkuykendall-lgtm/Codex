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
let flameMeshes = [];   // open flames (brazier etc.) animated each frame

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

// ============================================================
// CHAPTER 1 ART PASS — procedural Egyptian dig-camp props.
// Everything is generated in code: canvas textures + primitive
// geometry. No external assets, no build step.
// ============================================================

// ---- CH1 TERRAIN ----
// The desert is not flat: layered sine dunes give rolling character,
// the ground climbs toward the northern escarpment (where the tunnel
// mouth waits), and everything near a wall/building/prop is flattened —
// a working dig camp levels the ground it lives on. Collision is still
// 2D; the camera and every placed mesh sample this same function.
let ch1Rects = null; // walls + objects, cached for the flatten mask

function ch1StructDist(x, z) {
    if (!ch1Rects) ch1Rects = [...(mapWalls[1] || []), ...(mapObjects[1] || [])];
    let d = 1e9;
    for (const r of ch1Rects) {
        const dx = Math.max(r.x - x, 0, x - (r.x + r.w));
        const dz = Math.max(r.y - z, 0, z - (r.y + r.h));
        const dd = dx > dz ? dx : dz;
        if (dd < d) d = dd;
        if (d <= 0) return 0;
    }
    return d;
}

function ch1Height(x, z) {
    const dunes =
        18  * Math.sin(x * 0.0011 + 1.7) * Math.sin(z * 0.0009 + 0.6) +
        12  * Math.sin(x * 0.0021 + z * 0.0016 + 4.2) +
        5.5 * Math.sin(x * 0.0052 - z * 0.0037 + 2.2) +
        2.5 * Math.sin(x * 0.011 + z * 0.009);
    // Flatten toward structures (full dunes only in open desert)
    const d = ch1StructDist(x, z);
    const mask = Math.max(0.12, Math.min(1, (d - 35) / 165));
    // The north climb toward the rock escarpment
    const t = Math.max(0, Math.min(1, (1000 - z) / 800));
    const rise = 30 * t * t * (3 - 2 * t);
    return dunes * mask + rise;
}

// Ground height under a world point for the current map (0 off-Ch1)
function currentGroundHeight(x, z) {
    return (currentMapKey === 1) ? ch1Height(x, z) : 0;
}

// Deterministic per-object randomness (so a crate stack doesn't
// reshuffle every time the world rebuilds)
function seededRng(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => {
        h = Math.imul(h ^ (h >>> 15), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
}

const texCache = {};
function makeTex(name, w, h, rx, ry, draw) {
    if (texCache[name]) return texCache[name];
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(rx, ry);
    tex.encoding = THREE.sRGBEncoding;
    texCache[name] = tex;
    return tex;
}

function speckle(cc, w, h, base, colors, n, sMin, sMax) {
    cc.fillStyle = base;
    cc.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) {
        cc.fillStyle = colors[(Math.random() * colors.length) | 0];
        cc.globalAlpha = 0.15 + Math.random() * 0.45;
        const s = sMin + Math.random() * (sMax - sMin);
        cc.fillRect(Math.random() * w, Math.random() * h, s, s);
    }
    cc.globalAlpha = 1;
}

// Lazy material set for the Ch1 camp (textures generated on first use)
let CH1M = null;
function ch1Mats() {
    if (CH1M) return CH1M;
    const phong = (map, opts) => new THREE.MeshPhongMaterial(Object.assign({ map, shininess: 4, specular: 0x0c0c0c }, opts || {}));
    const lambert = (color) => new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });

    const sand = makeTex('sand', 256, 256, 16, 15, (cc, w, h) => {
        speckle(cc, w, h, '#8a744d', ['#94805a', '#7c683f', '#9f8a5f', '#6f5e3a'], 1100, 1, 3);
        cc.strokeStyle = 'rgba(58,46,26,0.20)';
        cc.lineWidth = 2;
        for (let i = 0; i < 12; i++) { // wind ripples
            const y0 = Math.random() * h;
            cc.beginPath();
            cc.moveTo(0, y0);
            for (let x = 0; x <= w; x += 14) cc.lineTo(x, y0 + Math.sin(x * 0.05 + i * 2) * 3);
            cc.stroke();
        }
    });
    const tentCloth = makeTex('tentCloth', 128, 128, 3, 2, (cc, w, h) => {
        speckle(cc, w, h, '#9a8a62', ['#a4946c', '#8d7c54', '#958455'], 350, 1, 2);
        cc.strokeStyle = 'rgba(70,58,36,0.35)';
        for (let x = 0; x < w; x += 16) { cc.beginPath(); cc.moveTo(x, 0); cc.lineTo(x, h); cc.stroke(); } // seams
    });
    const wood = makeTex('wood', 128, 128, 2, 2, (cc, w, h) => {
        speckle(cc, w, h, '#6a4f30', ['#75573a', '#5c4226', '#7d6040'], 240, 1, 3);
        cc.strokeStyle = 'rgba(40,28,14,0.5)';
        for (let y = 0; y < h; y += 21) { cc.beginPath(); cc.moveTo(0, y); cc.lineTo(w, y); cc.stroke(); } // planks
        cc.fillStyle = 'rgba(35,24,12,0.6)';
        for (let i = 0; i < 9; i++) { cc.beginPath(); cc.arc(Math.random() * w, Math.random() * h, 1.6, 0, 7); cc.fill(); } // knots
    });
    const crate = makeTex('crate', 128, 128, 1, 1, (cc, w, h) => {
        speckle(cc, w, h, '#7a5c38', ['#86663f', '#6b4e2c'], 200, 1, 3);
        cc.strokeStyle = 'rgba(45,32,16,0.8)';
        cc.lineWidth = 6;
        cc.strokeRect(3, 3, w - 6, h - 6); // frame
        cc.beginPath(); cc.moveTo(0, 0); cc.lineTo(w, h); cc.moveTo(w, 0); cc.lineTo(0, h); cc.stroke(); // cross braces
    });
    const metal = makeTex('metal', 128, 128, 2, 1, (cc, w, h) => {
        speckle(cc, w, h, '#76705f', ['#807a68', '#6a6455', '#8a8472'], 160, 1, 4);
        cc.strokeStyle = 'rgba(40,38,30,0.45)';
        cc.lineWidth = 3;
        for (let x = 4; x < w; x += 10) { cc.beginPath(); cc.moveTo(x, 0); cc.lineTo(x, h); cc.stroke(); } // corrugation
    });
    const rock = makeTex('rock', 256, 256, 3, 2, (cc, w, h) => {
        speckle(cc, w, h, '#6e6250', ['#7a6e5a', '#5f5443', '#857a64', '#544a3a'], 700, 2, 6);
        cc.strokeStyle = 'rgba(30,26,18,0.35)';
        for (let i = 0; i < 18; i++) { // cracks
            cc.beginPath();
            let x = Math.random() * w, y = Math.random() * h;
            cc.moveTo(x, y);
            for (let s = 0; s < 5; s++) { x += (Math.random() - 0.5) * 40; y += Math.random() * 22; cc.lineTo(x, y); }
            cc.stroke();
        }
    });
    const limestone = makeTex('limestone', 256, 256, 1, 1, (cc, w, h) => {
        speckle(cc, w, h, '#a39376', ['#ad9d80', '#94855f', '#b8a98c'], 420, 1, 4);
        // weathered hieroglyph rows — carved, not painted
        cc.strokeStyle = 'rgba(52,42,26,0.75)';
        cc.fillStyle = 'rgba(52,42,26,0.75)';
        cc.lineWidth = 2.5;
        for (let row = 0; row < 4; row++) {
            const y = 26 + row * 60;
            for (let col = 0; col < 7; col++) {
                const x = 16 + col * 34, g = (Math.random() * 5) | 0;
                cc.beginPath();
                if (g === 0) { cc.arc(x + 8, y + 8, 7, 0, 7); cc.stroke(); cc.beginPath(); cc.arc(x + 8, y + 8, 2.5, 0, 7); cc.fill(); }           // eye
                else if (g === 1) { cc.moveTo(x, y + 18); cc.lineTo(x + 8, y); cc.lineTo(x + 16, y + 18); cc.stroke(); }                            // pylon
                else if (g === 2) { cc.moveTo(x, y + 4); cc.quadraticCurveTo(x + 8, y - 6, x + 16, y + 4); cc.moveTo(x + 8, y); cc.lineTo(x + 8, y + 18); cc.stroke(); } // ankh-ish
                else if (g === 3) { cc.moveTo(x, y + 6); cc.lineTo(x + 5, y + 12); cc.lineTo(x + 10, y + 6); cc.lineTo(x + 15, y + 12); cc.stroke(); } // water
                else { cc.fillRect(x + 2, y + 2, 12, 4); cc.fillRect(x + 5, y + 9, 6, 9); }                                                          // seated figure-ish
            }
        }
    });
    const drum = makeTex('drum', 64, 64, 1, 1, (cc, w, h) => {
        speckle(cc, w, h, '#7a4426', ['#8a5430', '#65381f', '#5f351e'], 130, 1, 3);
        cc.fillStyle = 'rgba(40,22,12,0.6)';
        cc.fillRect(0, 14, w, 5); cc.fillRect(0, 32, w, 5); cc.fillRect(0, 50, w, 5); // ribs
    });
    const tarp = makeTex('tarp', 128, 128, 2, 2, (cc, w, h) => {
        speckle(cc, w, h, '#5d6243', ['#676c4c', '#52573a', '#6f7452'], 260, 1, 3);
        cc.strokeStyle = 'rgba(35,38,24,0.4)';
        for (let i = 0; i < 6; i++) { cc.beginPath(); cc.moveTo(0, i * 24); cc.lineTo(w, i * 24 + 12); cc.stroke(); } // folds
    });
    const frond = makeTex('frond', 128, 32, 1, 1, (cc, w, h) => {
        cc.clearRect(0, 0, w, h);
        cc.strokeStyle = '#3f6b2a';
        cc.lineWidth = 3;
        cc.beginPath(); cc.moveTo(0, h / 2); cc.lineTo(w, h / 2); cc.stroke(); // stem
        cc.lineWidth = 2.4;
        for (let x = 8; x < w; x += 6) {
            const droop = (x / w) * 5;
            cc.strokeStyle = (x % 12 < 6) ? '#477a30' : '#3a6126';
            cc.beginPath(); cc.moveTo(x, h / 2); cc.lineTo(x - 5, 2 + droop); cc.stroke();
            cc.beginPath(); cc.moveTo(x, h / 2); cc.lineTo(x - 5, h - 2 - droop); cc.stroke();
        }
    });

    CH1M = {
        sand: phong(sand),
        tent: phong(tentCloth),
        tentDark: lambert('#4f4632'),
        wood: phong(wood),
        woodDark: lambert('#4a3622'),
        crate: phong(crate),
        metal: phong(metal, { shininess: 18, specular: 0x222222 }),
        metalBlue: new THREE.MeshPhongMaterial({ color: 0x2c3e50, shininess: 24, specular: 0x222233 }),
        rock: phong(rock),
        limestone: phong(limestone),
        drum: phong(drum),
        drumBlue: new THREE.MeshPhongMaterial({ color: 0x1e4f80, shininess: 14, specular: 0x111122 }),
        tarp: phong(tarp),
        frond: new THREE.MeshLambertMaterial({ map: frond, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide }),
        trunk: lambert('#6b4f2f'),
        green: lambert('#2f5c22'),
        dark: lambert('#14110c'),
        terracotta: lambert('#9a5a33'),
        sandbag: lambert('#695a39'),
        rope: lambert('#8a7448'),
        grass: new THREE.MeshLambertMaterial({ color: 0x6a6136, side: THREE.DoubleSide }),
        glow: new THREE.MeshPhongMaterial({ color: 0x3a2a10, emissive: 0xe8b545, emissiveIntensity: 0.85 }),
        window: new THREE.MeshPhongMaterial({ color: 0x1a1408, emissive: 0xd49a3a, emissiveIntensity: 0.5 }),
        flame: new THREE.MeshBasicMaterial({ color: 0xe89030, transparent: true, opacity: 0.85 }),
    };
    return CH1M;
}

// Tiny placement helper
function put(g, geo, mat, x, y, z, ry, rz, rx) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (ry) m.rotation.y = ry;
    if (rz) m.rotation.z = rz;
    if (rx) m.rotation.x = rx;
    g.add(m);
    return m;
}
const gBox = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const gCyl = (rt, rb, h, n) => new THREE.CylinderGeometry(rt, rb, h, n || 8);

// Gable triangle (for tent/shed ends)
function gableGeo(w, h) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
    return new THREE.ShapeGeometry(s);
}

// ---- SUB-BUILDERS (shared shapes) ----
function subPalm(g, M, x, z, scale, rng) {
    // Trunk follows a continuous curve: each segment is placed at the
    // midpoint of its own tilted step, overlapping the previous one
    const lean = (rng() - 0.5) * 0.45;
    const segs = 5, segH = 20 * scale;
    let px = x, py = 0;
    for (let i = 0; i < segs; i++) {
        const tilt = lean * ((i + 0.5) / segs);
        put(g, gCyl(3.2 * scale * (1 - i * 0.08), 4.0 * scale * (1 - i * 0.08), segH + 7, 6), M.trunk,
            px + Math.sin(tilt) * segH / 2, py + Math.cos(tilt) * segH / 2, z, 0, 0, -tilt);
        px += Math.sin(tilt) * segH;
        py += Math.cos(tilt) * segH;
    }
    const top = py + 2;
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + rng() * 0.4;
        const f = put(g, new THREE.PlaneGeometry(58 * scale, 13 * scale), M.frond,
            px + Math.cos(a) * 24 * scale, top, z + Math.sin(a) * 24 * scale, -a, 0, 0);
        f.rotation.z = -0.45 - rng() * 0.3;
    }
    for (let i = 0; i < 3; i++) { // dates
        put(g, new THREE.SphereGeometry(2.6 * scale, 6, 5), M.terracotta,
            px + (rng() - 0.5) * 8, top - 6 * scale, z + (rng() - 0.5) * 8);
    }
    return top + 8;
}

function subCrateStack(g, M, w, d, rng) {
    const n = 2 + (rng() * 3 | 0);
    let h = 0;
    for (let i = 0; i < n; i++) {
        const s = Math.min(w, d) * (0.5 + rng() * 0.3);
        const ch = s * 0.8;
        put(g, gBox(s, ch, s), M.crate,
            (rng() - 0.5) * (w - s) * 0.5, (i < 2 ? ch / 2 : h + ch / 2), (rng() - 0.5) * (d - s) * 0.5,
            (rng() - 0.5) * 0.5);
        if (i >= 1) h += ch;
        else h = Math.max(h, ch);
    }
    return h + 20;
}

function subDrums(g, M, mat, w, d, rng, count) {
    const n = count || 3;
    for (let i = 0; i < n; i++) {
        const r = Math.min(w, d) * 0.22;
        put(g, gCyl(r, r, r * 2.6, 10), mat,
            (rng() - 0.5) * (w - r * 2) * 0.8, r * 1.3, (rng() - 0.5) * (d - r * 2) * 0.8);
    }
    return Math.min(w, d) * 0.6 + 16;
}

function subTable(g, M, w, d, h) {
    put(g, gBox(w, 5, d), M.wood, 0, h, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        put(g, gBox(5, h, 5), M.woodDark, sx * (w / 2 - 5), h / 2, sz * (d / 2 - 5));
    }
    return h;
}

function subSandbags(g, M, w, d, rng, rows) {
    let top = 0;
    for (let r = 0; r < (rows || 2); r++) {
        const n = Math.max(2, Math.round(w / 24));
        for (let i = 0; i < n; i++) {
            const b = put(g, new THREE.SphereGeometry(10.5, 7, 5), M.sandbag,
                -w / 2 + 12 + i * (w - 24) / Math.max(1, n - 1) + (r % 2) * 6, 5.5 + r * 9, (rng() - 0.5) * (d * 0.3));
            b.scale.set(1.2, 0.5, 0.8);
        }
        top = 11 + r * 9;
    }
    return top + 12;
}

function subShed(g, M, w, d, hWall, rng) {
    put(g, gBox(w, hWall, d), M.wood, 0, hWall / 2, 0);
    put(g, gBox(w + 14, 5, d + 16), M.metal, 0, hWall + 2.5, 0); // flat roof, seated
    put(g, gBox(w * 0.3, hWall * 0.62, 2), M.dark, 0, hWall * 0.31, d / 2 + 1.2); // door
    return hWall + 12;
}

function subWheel(g, M, x, z, r) {
    // wheel axis along Z (vehicles in Ch1 data are laid out along X)
    const w = put(g, gCyl(r, r, r * 0.6, 10), M.dark, x, r, z);
    w.rotation.x = Math.PI / 2;
}

// ---- PROP BUILDERS ----
// Each receives the (scaled) map object and returns a THREE.Group
// centered at the footprint center with userData.h = visual height.
const CH1_BUILDERS = {

    // — the three enterable buildings —
    tent_bldg(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w, d = o.h, wallH = 46, ridgeH = 108;
        // canvas walls
        put(g, gBox(w, wallH, d), M.tent, 0, wallH / 2, 0);
        // roof: ridge along X, slabs sloping down past the eaves
        const rise = ridgeH - wallH;
        const halfD = d / 2 + 14;
        const slope = Math.hypot(halfD, rise) + 6;
        const ang = Math.atan2(rise, halfD);
        for (const s of [-1, 1]) {
            // Tilt each slab so its inner edge meets the ridge and its outer
            // edge drops past the eaves (sign flipped: -s*ang made a valley)
            const r = put(g, gBox(w + 16, 4, slope), M.tent, 0, (wallH + ridgeH) / 2, s * halfD / 2);
            r.rotation.x = s * ang;
        }
        put(g, gBox(w + 18, 5, 10), M.tentDark, 0, ridgeH + 1, 0); // ridge cap
        // gable ends close the roof (at x = ±w/2, facing outward)
        for (const s of [-1, 1]) {
            put(g, gableGeo(d + 6, rise + 4), M.tent, s * (w / 2 - 0.5), wallH - 1, 0, s * Math.PI / 2);
        }
        // ridge poles at the gable centers + corner guy ropes
        for (const s of [-1, 1]) put(g, gCyl(2, 2, ridgeH, 6), M.woodDark, s * (w / 2 - 8), ridgeH / 2, 0);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
            const rope = put(g, gCyl(0.8, 0.8, 56, 4), M.rope, sx * (w / 2 + 14), 22, sz * (d / 2 + 14));
            rope.rotation.z = sx * 0.5;
            rope.rotation.x = -sz * 0.5;
        }
        put(g, gBox(w * 0.2, wallH * 0.9, 3), M.tentDark, 0, wallH * 0.45, d / 2 + 1.2); // door flap
        g.userData.h = ridgeH + 8;
        return g;
    },

    dorm_bldg(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w, d = o.h, wallH = 62;
        put(g, gBox(w, wallH, d), M.wood, 0, wallH / 2, 0);
        put(g, gBox(w + 16, 5, d + 18), M.tent, 0, wallH + 2.5, 0); // flat roof, seated
        for (let i = 0; i < 3; i++) { // lit windows — someone can't sleep
            put(g, gBox(16, 12, 1.6), i === 1 ? M.window : M.dark, -w / 4 + i * w / 4, wallH * 0.62, d / 2 + 1);
        }
        put(g, gBox(22, wallH * 0.72, 2), M.dark, w * 0.32, wallH * 0.36, d / 2 + 1.2);
        g.userData.h = wallH + 22;
        return g;
    },

    foreman_bldg(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w, d = o.h, wallH = 70;
        put(g, gBox(w, wallH, d), M.wood, 0, wallH / 2, 0);
        put(g, gBox(w + 18, 5, d + 20), M.metal, 0, wallH + 2.5, 0); // flat roof, seated
        put(g, gBox(20, 15, 1.6), M.window, -w / 4, wallH * 0.6, d / 2 + 1); // lamp burning late
        put(g, gBox(24, wallH * 0.74, 2), M.woodDark, w / 4, wallH * 0.37, d / 2 + 1.2);
        put(g, gBox(34, 10, 2), M.limestone, 0, wallH - 6, d / 2 + 1.4); // site board
        g.userData.h = wallH + 20;
        return g;
    },

    // door mats stay flat but read as worn thresholds
    tent_door(o, M) { const g = new THREE.Group(); put(g, gBox(o.w, 2, o.h), ch1Mats().tentDark, 0, 1, 0); g.userData.h = 4; return g; },
    dorm_door(o, M) { const g = new THREE.Group(); put(g, gBox(o.w, 2, o.h), ch1Mats().woodDark, 0, 1, 0); g.userData.h = 4; return g; },
    foreman_door(o, M) { const g = new THREE.Group(); put(g, gBox(o.w, 2, o.h), ch1Mats().woodDark, 0, 1, 0); g.userData.h = 4; return g; },

    // — the tunnel mouth: the reason everyone is here —
    tunnel_mouth(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w, d = o.h;
        // cliff mass with a black opening
        put(g, gBox(w, 190, d), M.rock, 0, 95, 0);
        for (let i = 0; i < 6; i++) { // jagged crown
            const bw = 60 + rng() * 110;
            put(g, gBox(bw, 34 + rng() * 46, d * 0.7), M.rock, -w / 2 + bw / 2 + rng() * (w - bw), 190 + 16, (rng() - 0.5) * d * 0.2, (rng() - 0.5) * 0.2);
        }
        // the opening (south face), timber-framed
        put(g, gBox(150, 116, 4), M.dark, 0, 58, d / 2 + 1.5);
        for (const s of [-1, 1]) put(g, gBox(14, 124, 14), M.woodDark, s * 80, 62, d / 2 + 6);
        put(g, gBox(190, 14, 16), M.woodDark, 0, 128, d / 2 + 6); // lintel
        put(g, gBox(160, 8, 12), M.woodDark, 0, 112, d / 2 + 4);  // second beam
        // rubble at the feet
        for (let i = 0; i < 7; i++) {
            const r = 8 + rng() * 14;
            put(g, new THREE.IcosahedronGeometry(r, 0), M.rock, (rng() - 0.5) * w * 0.7, r * 0.6, d / 2 + 12 + rng() * 18);
        }
        g.userData.h = 200;
        return g;
    },

    // — glyph stela (the lock puzzle) —
    puzzle_glyph(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w;
        put(g, gBox(w, 14, o.h), M.limestone, 0, 7, 0); // plinth
        put(g, gBox(w * 0.72, 120, 16), M.limestone, 0, 74, 0);
        const cap = put(g, gCyl(w * 0.36, w * 0.36, 16, 12), M.limestone, 0, 134, 0);
        cap.rotation.x = Math.PI / 2;
        put(g, gBox(w * 0.5, 60, 2), M.glow, 0, 78, 9); // the lock face, faintly alive
        g.userData.h = 150;
        return g;
    },

    // — generator, satphone, Sam's gear —
    generator(o, M, rng) {
        const g = new THREE.Group();
        put(g, gBox(o.w * 0.86, 42, o.h * 0.66), M.metal, 0, 23, 0);
        put(g, gBox(o.w * 0.86, 4, o.h * 0.66), M.dark, 0, 46, 0);
        put(g, gCyl(4, 4, 26, 6), M.dark, o.w * 0.26, 58, 0);          // exhaust
        put(g, gCyl(9, 9, 12, 8), M.drum, -o.w * 0.24, 50, 0);         // fuel cap
        put(g, gBox(o.w * 0.5, 8, 4), M.dark, 0, 14, o.h * 0.33 + 2);  // vents
        g.userData.h = 70;
        return g;
    },

    satphone(o, M) {
        const g = new THREE.Group();
        subTable(g, M, o.w * 1.6, o.h * 1.4, 30);
        put(g, gBox(14, 8, 20), M.dark, 0, 34, 0);
        put(g, gCyl(1.2, 1.2, 26, 4), M.dark, 8, 48, -4); // antenna
        g.userData.h = 62;
        return g;
    },

    sams_gear(o, M, rng) {
        const g = new THREE.Group();
        for (let i = 0; i < 3; i++) { // half-buried tripod, listing
            const a = (i / 3) * Math.PI * 2;
            const leg = put(g, gCyl(1.6, 1.6, 46, 5), M.woodDark, Math.cos(a) * 12, 14, Math.sin(a) * 12);
            leg.rotation.z = Math.cos(a) * 0.5;
            leg.rotation.x = Math.sin(a) * 0.5 + 0.22;
        }
        put(g, gBox(16, 10, 10), M.drum, 2, 34, 0, 0.5, 0.18); // brass transit, askew
        g.userData.h = 46;
        return g;
    },

    // — supply line carts —
    carts(o, M, rng) {
        const g = new THREE.Group();
        const w = o.w, d = o.h;
        for (const s of [-1, 1]) put(g, gBox(w, 3, 4), M.dark, 0, 2, s * d * 0.16); // rails
        for (let i = 0; i < 4; i++) put(g, gBox(8, 2.4, d * 0.42), M.woodDark, -w / 2 + 18 + i * (w - 36) / 3, 1.2, 0); // ties
        for (const cx of [-w * 0.22, w * 0.18]) {
            put(g, gBox(w * 0.3, 26, d * 0.42), M.metal, cx, 22, 0);
            put(g, gBox(w * 0.26, 8, d * 0.34), M.sand, cx, 38, 0); // spoil heaped in the cart
            for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
                put(g, gCyl(5, 5, 3, 8), M.dark, cx + sx * w * 0.1, 5, sz * d * 0.17, 0, 0, Math.PI / 2);
            }
        }
        g.userData.h = 48;
        return g;
    },

    // — rest brazier (fire) —
    rest_brazier(o, M, rng) {
        const g = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2;
            const leg = put(g, gCyl(1.8, 1.8, 40, 5), M.dark, Math.cos(a) * 12, 20, Math.sin(a) * 12);
            leg.rotation.z = Math.cos(a) * 0.3;
            leg.rotation.x = -Math.sin(a) * 0.3;
        }
        put(g, gCyl(o.w * 0.42, o.w * 0.28, 14, 10), M.metal, 0, 40, 0);
        put(g, new THREE.SphereGeometry(o.w * 0.3, 8, 6), M.glow, 0, 46, 0).scale.set(1, 0.45, 1);
        const fl = put(g, gCyl(2, o.w * 0.22, 22, 7), M.flame, 0, 58, 0);
        fl.userData.flame = true;
        g.userData.h = 72;
        return g;
    },

    // — perimeter watch post —
    perimeter(o, M, rng) {
        const g = new THREE.Group();
        subSandbags(g, M, o.w * 1.4, o.h, rng, 2);
        put(g, gBox(18, 14, 18), M.crate, o.w * 0.5, 7, -4); // a crate to sit on
        g.userData.h = 40;
        return g;
    },

    // — the fun corner: Dust the dog, darts, the shortwave —
    camp_dog(o, M, rng) {
        const g = new THREE.Group();
        const fur = new THREE.MeshLambertMaterial({ color: 0x8a6a42 });
        put(g, gBox(26, 12, 12), fur, 0, 13, 0);
        put(g, gBox(9, 9, 9), fur, 16, 20, 0);
        put(g, gBox(3, 4, 2), fur, 19, 26, 3.2);
        put(g, gBox(3, 4, 2), fur, 19, 26, -3.2);
        put(g, gBox(4, 2.6, 4), M.dark, 21.5, 18, 0); // nose
        for (const lx of [-9, 7]) for (const lz of [-4, 4]) put(g, gBox(3, 8, 3), fur, lx, 4, lz);
        put(g, gCyl(1.2, 0.5, 13, 4), fur, -15, 19, 0, 0, 0.9); // tail up — he's dreaming well
        g.userData.h = 36;
        return g;
    },

    camp_darts(o, M, rng) {
        const g = new THREE.Group();
        put(g, gBox(6, 62, 6), M.woodDark, 0, 31, 0);
        const face = (geo, mat, y, zOff) => {
            const m = put(g, geo, mat, 0, y, 4 + zOff);
            m.rotation.x = Math.PI / 2;
            return m;
        };
        face(gCyl(15, 15, 3, 14), M.crate, 50, 0);
        face(gCyl(10, 10, 1.4, 12), new THREE.MeshLambertMaterial({ color: 0x27331f }), 50, 1.6);
        face(gCyl(5, 5, 1.4, 10), new THREE.MeshLambertMaterial({ color: 0x7a1f1f }), 50, 2.6);
        face(gCyl(1.6, 1.6, 1.4, 8), ch1Mats().glow, 50, 3.6);
        for (let i = 0; i < 3; i++) { // the surviving darts, holstered in the post
            put(g, gCyl(0.7, 0.7, 10, 4), M.dark, 4, 18 + i * 6, 2, 0, 1.2);
        }
        g.userData.h = 66;
        return g;
    },

    camp_radio(o, M, rng) {
        const g = new THREE.Group();
        put(g, gBox(26, 22, 22), M.crate, 0, 11, 0); // its crate
        put(g, gBox(22, 12, 10), M.metal, 0, 28, 0);
        put(g, gCyl(2.2, 2.2, 2.4, 8), M.glow, -5, 28, 5.4, 0, 0, Math.PI / 2); // glowing dial
        put(g, gBox(8, 1.6, 1.6), M.dark, 5, 30, 5.2); // speaker slits
        put(g, gCyl(0.6, 0.6, 30, 4), M.dark, 9, 46, -3, 0, 0.4); // taped antenna
        g.userData.h = 60;
        return g;
    },

    // The parked ministry car is the dynamic carGroup — this static
    // interact zone needs no mesh of its own, only its floating label
    inspector(o, M) {
        const g = new THREE.Group();
        g.userData.h = 60;
        return g;
    },

    // — dig zone gate (wooden barrier) —
    dig_gate(o, M) {
        const g = new THREE.Group();
        for (const s of [-1, 1]) put(g, gBox(10, 64, 10), M.woodDark, s * (o.w / 2 - 6), 32, 0);
        put(g, gBox(o.w - 16, 9, 5), M.wood, 0, 48, 0, 0, 0.02);
        put(g, gBox(o.w - 16, 9, 5), M.wood, 0, 26, 0, 0, -0.02);
        g.userData.h = 70;
        return g;
    },
};

// Label-keyed builders for the repeated set dressing
const CH1_LABEL_BUILDERS = {
    'cactus': (o, M, rng) => {
        const g = new THREE.Group();
        const h = o.h * 1.3;
        put(g, gCyl(o.w * 0.34, o.w * 0.4, h, 7), M.green, 0, h / 2, 0);
        if (rng() > 0.4) { // an arm
            const s = rng() > 0.5 ? 1 : -1;
            put(g, gCyl(o.w * 0.22, o.w * 0.24, h * 0.4, 6), M.green, s * o.w * 0.5, h * 0.42, 0, 0, s * 1.2);
            put(g, gCyl(o.w * 0.22, o.w * 0.24, h * 0.36, 6), M.green, s * o.w * 0.72, h * 0.62, 0);
        }
        g.userData.h = h + 8;
        return g;
    },
    'boulder': (o, M, rng) => {
        const g = new THREE.Group();
        const r = Math.min(o.w, o.h) * 0.55;
        put(g, new THREE.IcosahedronGeometry(r, 0), M.rock, 0, r * 0.72, 0, rng() * 3).scale.set(1.15, 0.85, 1);
        if (rng() > 0.5) put(g, new THREE.IcosahedronGeometry(r * 0.45, 0), M.rock, r * 0.9, r * 0.32, r * 0.4, rng() * 3);
        g.userData.h = r * 1.6;
        return g;
    },
    'rock pile': (o, M, rng) => {
        const g = new THREE.Group();
        for (let i = 0; i < 6; i++) {
            const r = 7 + rng() * Math.min(o.w, o.h) * 0.22;
            put(g, new THREE.IcosahedronGeometry(r, 0), M.rock, (rng() - 0.5) * o.w * 0.7, r * 0.7, (rng() - 0.5) * o.h * 0.7, rng() * 3);
        }
        g.userData.h = Math.min(o.w, o.h) * 0.5 + 10;
        return g;
    },
    'spoil mound': (o, M, rng) => {
        const g = new THREE.Group();
        const r = Math.min(o.w, o.h) * 0.6, h = 26 + rng() * 18;
        put(g, gCyl(r * 0.1, r, h, 9), M.sand, 0, h / 2, 0);
        for (let i = 0; i < 4; i++) put(g, new THREE.IcosahedronGeometry(4 + rng() * 5, 0), M.rock, (rng() - 0.5) * r * 1.4, 4, (rng() - 0.5) * r * 1.4);
        g.userData.h = h + 8;
        return g;
    },
    'howling dune': (o, M, rng) => {
        const g = new THREE.Group();
        const dome = put(g, new THREE.SphereGeometry(Math.min(o.w, o.h) * 0.9, 10, 7), M.sand, 0, 0, 0);
        dome.scale.set(1.4, 0.32, 1);
        g.userData.h = Math.min(o.w, o.h) * 0.32 + 10;
        return g;
    },
    'survey stake': (o, M, rng) => {
        const g = new THREE.Group();
        const h = o.h * 1.1;
        put(g, gBox(4, h, 4), M.woodDark, 0, h / 2, 0, 0, 0, (rng() - 0.5) * 0.12);
        put(g, gBox(14, 8, 0.8), new THREE.MeshLambertMaterial({ color: 0xb8412a }), 8, h - 6, 0); // flag
        g.userData.h = h + 6;
        return g;
    },
    "sam's survey stake": (o, M, rng) => CH1_LABEL_BUILDERS['survey stake'](o, M, rng),
    'stone wall': (o, M, rng) => {
        const g = new THREE.Group();
        const horizontal = o.w >= o.h;
        const len = Math.max(o.w, o.h), th = Math.min(o.w, o.h) * 1.6;
        const blocks = Math.max(2, Math.round(len / 42));
        for (let row = 0; row < 3; row++) {
            const n = row === 2 ? Math.max(1, blocks - 2) : blocks; // broken top course
            for (let i = 0; i < n; i++) {
                const bw = len / blocks - 3;
                const off = -len / 2 + (i + 0.5) * (len / blocks) + (row % 2) * 8;
                const b = put(g, gBox(horizontal ? bw : th, 19, horizontal ? th : bw), M.limestone,
                    horizontal ? off : (rng() - 0.5) * 4, 10 + row * 19, horizontal ? (rng() - 0.5) * 4 : off,
                    (rng() - 0.5) * 0.06);
                b.position.y -= row === 2 && rng() > 0.6 ? 6 : 0;
            }
        }
        g.userData.h = 64;
        return g;
    },
    'old limestone wall': (o, M, rng) => CH1_LABEL_BUILDERS['stone wall'](o, M, rng),
    'crates': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subCrateStack(g, M, o.w, o.h, rng); return g; },
    'sorted crates': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subCrateStack(g, M, o.w, o.h, rng); return g; },
    'fuel drums': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subDrums(g, M, M.drum, o.w, o.h, rng, 3); return g; },
    'oil drum': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subDrums(g, M, M.drum, o.w, o.h, rng, 1); return g; },
    'water barrels': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subDrums(g, M, M.drumBlue, o.w, o.h, rng, 3); return g; },
    'cooking table': (o, M, rng) => {
        const g = new THREE.Group();
        subTable(g, M, o.w, o.h * 1.6, 30);
        put(g, gCyl(9, 7, 10, 8), M.metal, -o.w * 0.25, 38, 0);
        put(g, gCyl(7, 6, 7, 8), M.terracotta, o.w * 0.05, 36, 6);
        put(g, gBox(16, 3, 10), M.woodDark, o.w * 0.3, 33, -4); // cutting board
        g.userData.h = 52;
        return g;
    },
    'equipment table': (o, M, rng) => {
        const g = new THREE.Group();
        subTable(g, M, o.w, o.h * 1.5, 30);
        put(g, gBox(14, 6, 9), M.drum, -o.w * 0.3, 36, 0, 0.3);
        put(g, gBox(18, 4, 12), M.dark, o.w * 0.2, 35, 2, -0.2);
        g.userData.h = 46;
        return g;
    },
    'supply truck': (o, M, rng) => {
        const g = new THREE.Group();
        const w = o.w, d = o.h;
        put(g, gBox(w * 0.3, 34, d * 0.8), M.metalBlue, -w * 0.32, 30, 0);                 // cab
        put(g, gBox(w * 0.28, 12, d * 0.7), M.dark, -w * 0.33, 47, 0);                     // windows band
        put(g, gBox(w * 0.62, 30, d * 0.86), M.tarp, w * 0.16, 36, 0);                     // covered bed
        for (const wx of [-w * 0.32, w * 0.02, w * 0.34]) {
            subWheel(g, M, wx, d * 0.42, 11);
            subWheel(g, M, wx, -d * 0.42, 11);
        }
        g.userData.h = 58;
        return g;
    },
    'ministry vehicle': (o, M, rng) => {
        const g = new THREE.Group();
        const w = o.w, d = o.h;
        put(g, gBox(w * 0.86, 22, d * 0.74), M.metalBlue, 0, 22, 0);
        put(g, gBox(w * 0.5, 15, d * 0.62), M.dark, -w * 0.04, 41, 0);
        for (const wx of [-w * 0.28, w * 0.28]) {
            subWheel(g, M, wx, d * 0.4, 9);
            subWheel(g, M, wx, -d * 0.4, 9);
        }
        g.userData.h = 52;
        return g;
    },
    'sandbags': (o, M, rng) => { const g = new THREE.Group(); g.userData.h = subSandbags(g, M, o.w, o.h, rng, 2); return g; },
    'rope coil': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, new THREE.TorusGeometry(o.w * 0.4, 5, 6, 12), M.rope, 0, 5, 0, 0, 0, Math.PI / 2);
        put(g, new THREE.TorusGeometry(o.w * 0.34, 4.4, 6, 12), M.rope, 2, 11, 1, 0, 0, Math.PI / 2);
        g.userData.h = 18;
        return g;
    },
    'tin bucket': (o, M) => {
        const g = new THREE.Group();
        put(g, gCyl(o.w * 0.42, o.w * 0.3, o.w * 0.8, 9), ch1Mats().metal, 0, o.w * 0.4, 0);
        g.userData.h = o.w * 0.8 + 8;
        return g;
    },
    'tarped supplies': (o, M, rng) => {
        const g = new THREE.Group();
        const b = put(g, gBox(o.w, 30, o.h), M.tarp, 0, 16, 0);
        b.rotation.z = 0.04;
        put(g, gBox(o.w * 0.5, 14, o.h * 0.7), M.tarp, -o.w * 0.18, 38, 0, 0.2);
        for (const sx of [-0.3, 0.15]) put(g, gBox(3, 34, o.h + 6), M.rope, o.w * sx, 17, 0); // straps
        g.userData.h = 50;
        return g;
    },
    'radio antenna': (o, M) => {
        const g = new THREE.Group();
        put(g, gCyl(1.4, 2, 130, 5), ch1Mats().dark, 0, 65, 0);
        put(g, gBox(26, 1.6, 1.6), ch1Mats().dark, 0, 112, 0);
        put(g, gBox(16, 1.6, 1.6), ch1Mats().dark, 0, 96, 0, 0.6);
        g.userData.h = 134;
        return g;
    },
    'tool box': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gBox(o.w, 16, o.h * 0.8), M.drum, 0, 8, 0, (rng() - 0.5) * 0.4);
        put(g, gBox(o.w * 0.7, 2.4, 3), M.dark, 0, 19, 0); // handle
        g.userData.h = 24;
        return g;
    },
    'driftwood': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gCyl(3.4, 5, o.w, 6), M.woodDark, 0, 6, 0, 0, Math.PI / 2 - 0.1, 0.06);
        put(g, gCyl(2, 3, o.w * 0.5, 5), M.woodDark, o.w * 0.2, 8, 6, 0, Math.PI / 2 + 0.5);
        g.userData.h = 16;
        return g;
    },
    'broken clay pot': (o, M, rng) => {
        const g = new THREE.Group();
        const pot = put(g, new THREE.SphereGeometry(o.w * 0.6, 8, 6, 0, Math.PI * 2, 0, 2.2), M.terracotta, 0, o.w * 0.5, 0, 0, 0.5);
        pot.material = M.terracotta;
        for (let i = 0; i < 3; i++) { // shards
            put(g, gBox(8, 1.6, 6), M.terracotta, (rng() - 0.5) * o.w * 1.6, 1, (rng() - 0.5) * o.h * 1.6, rng() * 3);
        }
        g.userData.h = o.w + 8;
        return g;
    },
    'work lamp': (o, M) => {
        const g = new THREE.Group();
        const mats = ch1Mats();
        for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2;
            const leg = put(g, gCyl(1.4, 1.4, 60, 5), mats.dark, Math.cos(a) * 13, 30, Math.sin(a) * 13);
            leg.rotation.z = Math.cos(a) * 0.24;
            leg.rotation.x = -Math.sin(a) * 0.24;
        }
        put(g, gCyl(1.6, 1.6, 34, 5), mats.dark, 0, 74, 0);
        put(g, gBox(18, 12, 8), mats.metal, 0, 94, 0, 0, 0, 0.3);
        put(g, gBox(14, 8, 1.6), mats.glow, 0, 92, 5, 0, 0, 0.3); // the lit face
        g.userData.h = 100;
        return g;
    },
    'lantern': (o, M) => {
        const g = new THREE.Group();
        const mats = ch1Mats();
        put(g, gCyl(1.4, 1.8, 40, 5), mats.woodDark, 0, 20, 0);
        put(g, gBox(9, 11, 9), mats.glow, 0, 44, 0);
        put(g, gBox(11, 1.6, 11), mats.dark, 0, 50.5, 0);
        g.userData.h = 54;
        return g;
    },
    'palm tree': (o, M, rng) => {
        const g = new THREE.Group();
        g.userData.h = subPalm(g, M, 0, 0, 1.0 + rng() * 0.3, rng);
        return g;
    },
    "sam's date palm": (o, M, rng) => {
        const g = new THREE.Group();
        g.userData.h = subPalm(g, M, 0, 0, 1.15, rng);
        put(g, gCyl(10, 12, 6, 8), M.terracotta, 16, 3, 14); // someone keeps it watered
        return g;
    },
    'camp gate post': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gBox(o.w * 0.7, o.h * 1.5, o.w * 0.7), M.woodDark, 0, o.h * 0.75, 0);
        put(g, gBox(9, 11, 9), M.glow, 0, o.h * 1.5 + 7, 0);
        g.userData.h = o.h * 1.5 + 14;
        return g;
    },
    "sam's tool shed": (o, M, rng) => {
        const g = new THREE.Group();
        g.userData.h = subShed(g, M, o.w, o.h, 62, rng);
        return g;
    },
    'dig shed clipboard': (o, M, rng) => {
        const g = new THREE.Group();
        // the clipboard hangs on the shed wall (the shed itself is built
        // from its collision wall); just a small board + pencil string
        put(g, gBox(2, 26, 18), M.wood, 0, 44, 0);
        put(g, gBox(1, 18, 12), new THREE.MeshLambertMaterial({ color: 0xcfc4a6 }), 1.6, 44, 0);
        g.userData.h = 60;
        return g;
    },
    'ministry post': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gCyl(1.8, 2.4, 96, 6), M.metal, -o.w * 0.2, 48, 0);
        put(g, gBox(26, 16, 1.4), new THREE.MeshLambertMaterial({ color: 0x274060 }), -o.w * 0.2 + 14, 84, 0); // flag
        put(g, gBox(30, 22, 3), M.wood, o.w * 0.2, 30, 0, 0.15); // notice board
        g.userData.h = 100;
        return g;
    },
    'guard booth': (o, M, rng) => {
        const g = new THREE.Group();
        put(g, gBox(o.w * 0.9, 70, o.h * 0.9), M.metal, 0, 35, 0);
        put(g, gBox(o.w * 0.62, 18, 1.6), M.dark, 0, 48, o.h * 0.45 + 1);
        put(g, gBox(o.w + 14, 4, o.h + 14), M.metalBlue, 0, 73, 0);
        g.userData.h = 78;
        return g;
    },
    'scaffolding': (o, M, rng) => {
        const g = new THREE.Group();
        const w = o.w, d = o.h, H = 96;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
            put(g, gCyl(1.6, 1.6, H, 5), M.metal, sx * w * 0.4, H / 2, sz * d * 0.4);
        }
        for (const y of [30, 64]) {
            for (const sz of [-1, 1]) put(g, gCyl(1.2, 1.2, w * 0.8, 4), M.metal, 0, y, sz * d * 0.4, 0, 0, Math.PI / 2);
        }
        put(g, gBox(w * 0.9, 4, d * 0.9), M.wood, 0, 78, 0);
        g.userData.h = H + 6;
        return g;
    },
    'site trailer': (o, M, rng) => {
        const g = new THREE.Group();
        const w = o.w, d = o.h;
        put(g, gBox(w, 52, d * 0.92), M.metal, 0, 40, 0);
        put(g, gBox(w + 8, 3, d * 0.92 + 8), M.dark, 0, 67, 0);
        for (let i = 0; i < 3; i++) put(g, gBox(18, 13, 1.6), i === 0 ? M.window : M.dark, -w / 4 + i * w / 4, 48, d * 0.46 + 1);
        put(g, gBox(20, 36, 1.8), M.dark, w * 0.34, 32, d * 0.46 + 1.2);          // door
        put(g, gBox(16, 10, 12), M.metal, -w * 0.3, 72, 0);                       // AC unit
        subWheel(g, M, -w * 0.26, d * 0.46, 9); subWheel(g, M, w * 0.26, d * 0.46, 9);
        subWheel(g, M, -w * 0.26, -d * 0.46, 9); subWheel(g, M, w * 0.26, -d * 0.46, 9);
        put(g, gBox(8, 10, 8), M.crate, -w / 2 - 10, 5, d * 0.3); // step crate
        g.userData.h = 84;
        return g;
    },
    'gear storage': (o, M, rng) => {
        const g = new THREE.Group();
        const b = put(g, gBox(o.w * 0.94, 40, o.h * 0.9), M.tarp, 0, 21, 0);
        b.rotation.z = 0.03;
        put(g, gBox(o.w * 0.5, 18, o.h * 0.6), M.tarp, o.w * 0.1, 48, 0, 0.25);
        for (const sx of [-0.32, 0, 0.32]) put(g, gBox(3, 44, o.h * 0.96), M.rope, o.w * sx, 22, 0);
        g.userData.h = 60;
        return g;
    },
    'open sky': (o, M, rng) => {
        const g = new THREE.Group();
        // a bedroll where someone lies back and watches the stars
        const roll = put(g, gBox(o.w * 1.2, 8, o.h * 0.6), M.tarp, 0, 4, 0, 0.3);
        put(g, gBox(o.w * 0.34, 8, o.h * 0.3), M.tent, -o.w * 0.45, 6, o.h * 0.12, 0.3); // pillow
        put(g, gBox(9, 11, 9), M.glow, o.w * 0.5, 6, -o.h * 0.3); // lantern beside it
        g.userData.h = 20;
        return g;
    },
};

// Resolve a label-keyed builder: exact key, then containment
function ch1LabelBuilder(o) {
    const l = (o.label || '').toLowerCase();
    if (CH1_LABEL_BUILDERS[l]) return CH1_LABEL_BUILDERS[l];
    for (const key in CH1_LABEL_BUILDERS) {
        if (l.includes(key)) return CH1_LABEL_BUILDERS[key];
    }
    return null;
}

// Walls mostly covered by a prop's footprint are part of that prop
// (building shells, the cooking table, gear storage, the generator…).
// Thin door-flank segments hugging an enterable building also vanish —
// the cabin model is the visual; the collision stays.
function ch1WallInsideObject(wall) {
    const thin = Math.min(wall.w, wall.h) <= 40;
    for (const o of (activeMapObjects || [])) {
        const ox = Math.max(0, Math.min(wall.x + wall.w, o.x + o.w) - Math.max(wall.x, o.x));
        const oz = Math.max(0, Math.min(wall.y + wall.h, o.y + o.h) - Math.max(wall.y, o.y));
        if (ox * oz >= wall.w * wall.h * 0.4) return true;
        if (thin && /_bldg$/.test(o.id || '') &&
            wall.x < o.x + o.w + 30 && wall.x + wall.w > o.x - 30 &&
            wall.y < o.y + o.h + 30 && wall.y + wall.h > o.y - 30) return true;
    }
    return false;
}

// Ambient clutter — pebbles, sand humps, dry grass, pottery shards —
// scattered deterministically across open ground so the desert doesn't
// feel empty. Visual only; nothing collides.
function addCh1Scatter(group) {
    const M = ch1Mats();
    const rng = seededRng('ch1-scatter');
    const walls = mapWalls[1] || [];
    const blocked = (x, z) =>
        walls.some(w => x > w.x - 16 && x < w.x + w.w + 16 && z > w.y - 16 && z < w.y + w.h + 16) ||
        (activeMapObjects || []).some(o => x > o.x - 16 && x < o.x + o.w + 16 && z > o.y - 16 && z < o.y + o.h + 16);
    let placed = 0, tries = 0;
    while (placed < 80 && tries++ < 500) {
        const x = 90 + rng() * (WORLD.width - 180);
        const z = 90 + rng() * (WORLD.height - 180);
        if (blocked(x, z)) continue;
        const gh = ch1Height(x, z);
        const kind = rng();
        if (kind < 0.42) { // pebbles
            const r = 2.5 + rng() * 5.5;
            put(group, new THREE.IcosahedronGeometry(r, 0), M.rock, x, gh + r * 0.55, z, rng() * 3);
        } else if (kind < 0.68) { // low sand drifts (flat cones shade better)
            const r = 16 + rng() * 22;
            put(group, gCyl(r * 0.15, r, r * 0.2, 9), M.sand, x, gh + r * 0.1, z);
        } else if (kind < 0.88) { // dry grass tufts
            for (let i = 0; i < 3; i++) {
                put(group, gableGeo(6, 13 + rng() * 9), M.grass,
                    x + (rng() - 0.5) * 7, gh, z + (rng() - 0.5) * 7, rng() * Math.PI);
            }
        } else { // pottery shards — the ground remembers older camps
            put(group, gBox(6 + rng() * 6, 1.4, 5), M.terracotta, x, gh + 1, z, rng() * 3);
        }
        placed++;
    }
}

// Walls that ARE structures get bespoke treatment (keyed by scaled rect)
const near = (a, b) => Math.abs(a - b) < 2;
function ch1WallStyle(wall) {
    if (near(wall.x, 1440) && near(wall.y, 1408)) return 'shed';      // the dig shed
    if (near(wall.x, 2840) && near(wall.w, 280)) return 'plank';      // trench cross-braces
    if ((near(wall.x, 2800) || near(wall.x, 3120)) && near(wall.h, 720)) return 'berm'; // trench lips
    if (near(wall.x, 1312) && near(wall.y, 3184)) return 'gatepost';  // the unmarked twin of the camp gate post
    return null;
}

// Custom wall rendering for the Ch1 camp. Returns true when handled.
function buildCh1Wall(group, wall, palette) {
    const M = ch1Mats();
    const minDim = Math.min(wall.w, wall.h);
    const maxDim = Math.max(wall.w, wall.h);
    const cx = wall.x + wall.w / 2, cz = wall.y + wall.h / 2;
    const touchesEdge = wall.x <= 0 || wall.y <= 0 ||
        wall.x + wall.w >= WORLD.width || wall.y + wall.h >= WORLD.height;

    if (wall.isGate) return false; // gate keeps its (wood-textured) box

    const gh = ch1Height(cx, cz);

    const style = ch1WallStyle(wall);
    if (style === 'shed') {
        const g = new THREE.Group();
        g.position.set(cx, gh, cz);
        subShed(g, M, wall.w, wall.h, 64, seededRng('digshed'));
        group.add(g);
        return true;
    }
    if (style === 'plank') { // walk boards across the trench
        put(group, gBox(wall.w, 10, wall.h), M.wood, cx, gh + 5, cz);
        return true;
    }
    if (style === 'gatepost') { // matches the built fl_gate_post across the gap
        put(group, gBox(34, 144, 34), M.woodDark, cx, gh + 72, cz);
        put(group, gBox(9, 11, 9), M.glow, cx, gh + 151, cz);
        return true;
    }
    if (style === 'berm') { // low spoil lips flanking the trench
        put(group, gBox(wall.w + 10, 26, wall.h), M.sand, cx, gh + 13, cz);
        for (let i = 0; i < 6; i++) {
            const rr = 6 + (i * 7) % 9;
            const bz = wall.y + (i + 0.5) * wall.h / 6;
            put(group, new THREE.IcosahedronGeometry(rr, 0), M.rock, cx, ch1Height(cx, bz) + rr * 0.7, bz, i * 1.7);
        }
        return true;
    }

    // Rope fence around the tent compound (very thin strips) — each
    // post seats on its own patch of ground so the line follows terrain
    if (minDim <= 22 && maxDim >= 140) {
        const horizontal = wall.w >= wall.h;
        const len = maxDim;
        const posts = Math.max(2, Math.round(len / 150));
        for (let i = 0; i < posts; i++) {
            const t = posts === 1 ? 0.5 : i / (posts - 1);
            const px = horizontal ? wall.x + t * wall.w : cx;
            const pz = horizontal ? cz : wall.y + t * wall.h;
            put(group, gCyl(2.2, 2.6, 44, 5), M.woodDark, px, ch1Height(px, pz) + 20, pz);
        }
        const rope = put(group, gCyl(1.1, 1.1, len, 4), M.rope, cx, gh + 34, cz);
        rope.rotation.z = horizontal ? Math.PI / 2 : 0;
        if (!horizontal) rope.rotation.x = Math.PI / 2, rope.rotation.z = 0;
        return true;
    }

    // Camp fences: post-and-rail (thin, long)
    if (minDim <= 36 && maxDim >= 480 && !touchesEdge) {
        const horizontal = wall.w >= wall.h;
        const len = maxDim;
        const posts = Math.max(3, Math.round(len / 120));
        for (let i = 0; i < posts; i++) {
            const t = i / (posts - 1);
            const px = horizontal ? wall.x + t * wall.w : cx;
            const pz = horizontal ? cz : wall.y + t * wall.h;
            put(group, gBox(7, 56, 7), M.woodDark, px, ch1Height(px, pz) + 26, pz);
        }
        for (const y of [20, 44]) {
            put(group, gBox(horizontal ? len : 5, 6, horizontal ? 5 : len), M.wood, cx, gh + y, cz);
        }
        return true;
    }

    return false; // default extruded box (rock-textured via wall material)
}
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
    flameMeshes = [];
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

    // Ground plane (Phong: point lights evaluated per pixel).
    // Ch1 gets sand-textured terrain displaced by the heightfield;
    // other maps keep their flat palette-colored plane.
    let groundGeo;
    if (currentMapKey === 1) {
        groundGeo = new THREE.PlaneGeometry(WORLD.width, WORLD.height, 96, 88);
        groundGeo.rotateX(-Math.PI / 2);
        const pos = groundGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            pos.setY(i, ch1Height(pos.getX(i) + WORLD.width / 2, pos.getZ(i) + WORLD.height / 2));
        }
        groundGeo.computeVertexNormals();
    } else {
        groundGeo = new THREE.PlaneGeometry(WORLD.width, WORLD.height);
        groundGeo.rotateX(-Math.PI / 2);
    }
    const ground = new THREE.Mesh(
        groundGeo,
        currentMapKey === 1
            ? ch1Mats().sand
            : new THREE.MeshPhongMaterial({ color: groundCol, shininess: 4, specular: 0x0a0a0a })
    );
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

    // Survey grid only on flat exterior sand (Ch1's displaced terrain
    // would clip through it; its sand texture carries the detail)
    if (atmos.type === 'ext' && currentMapKey !== 1) {
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
    const gateMat = currentMapKey === 1
        ? ch1Mats().wood
        : new THREE.MeshPhongMaterial({ color: 0x8b6914, shininess: 10, specular: 0x222211 });
    for (const wall of (mapWalls[currentMapKey] || [])) {
        if (!wall.isGate && objectRects.has(`${wall.x},${wall.y},${wall.w},${wall.h}`)) continue;
        if (currentMapKey === 1 && !wall.isGate) {
            if (ch1WallInsideObject(wall)) continue;       // shell of a built prop
            if (buildCh1Wall(worldGroup, wall, palette)) continue; // fence/rope/shed/trench
        }
        const h = wallHeightFor(wall, atmos);
        const mesh = addBoxAt(worldGroup, wall.x, wall.y, wall.w, wall.h, h,
            wall.isGate ? gateMat : (currentMapKey === 1 ? ch1Mats().rock : wallMat));
        if (wall.isGate) gateMeshes.push({ mesh, gateFlag: wall.gateFlag });
        // Seat Ch1 walls on the terrain (sunk a little so slopes can't
        // open gaps beneath them; the flatten mask keeps deltas small)
        let wallGH = 0;
        if (currentMapKey === 1) {
            wallGH = ch1Height(wall.x + wall.w / 2, wall.y + wall.h / 2);
            mesh.position.y += wallGH - 12;
        }
        // Rocky outcrops get a jagged crown so they read as rock, not box
        if (currentMapKey === 1 && !wall.isGate && Math.min(wall.w, wall.h) >= 150) {
            const rng = seededRng(wall.x + ',' + wall.y);
            for (let i = 0; i < 4; i++) {
                const bw = wall.w * (0.18 + rng() * 0.2);
                const bh = 22 + rng() * 36;
                put(worldGroup, gBox(bw, bh, wall.h * (0.4 + rng() * 0.35)), ch1Mats().rock,
                    wall.x + bw / 2 + rng() * (wall.w - bw), wallGH + h + bh / 2 - 18,
                    wall.y + wall.h / 2 + (rng() - 0.5) * wall.h * 0.3, (rng() - 0.5) * 0.3);
            }
        }
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
            const gh = currentGroundHeight(cx, cz);
            fig.position.set(cx, gh, cz);
            fig.userData.baseY = gh;
            // Default facing: into the map (rotation 0 faces 2D "south" / +z)
            fig.rotation.y = cz < WORLD.height / 2 ? 0 : Math.PI;
            worldGroup.add(fig);
            let label = null;
            if (!o.decorative && o.interactScene) {
                label = makeLabelSprite(o.label || o.id, '#f4e4b0');
                label.position.set(cx, gh + fig.userData.height + 18, cz);
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
            feature.position.y = currentGroundHeight(o.x + o.w / 2, o.y + o.h / 2);
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
                label.position.set(o.x + o.w / 2, feature.position.y + 42, o.y + o.h / 2);
                worldGroup.add(label);
            }
            objectEntries.push({ o, mesh: feature, label });
            continue;
        }
        // Chapter 1 art pass: bespoke props instead of extruded boxes
        if (currentMapKey === 1) {
            const builder = CH1_BUILDERS[o.id] || ch1LabelBuilder(o);
            if (builder) {
                const M = ch1Mats();
                const rng = seededRng(o.id || o.label || 'x');
                const g = builder(o, M, rng);
                const gh = ch1Height(o.x + o.w / 2, o.y + o.h / 2);
                g.position.set(o.x + o.w / 2, gh, o.y + o.h / 2);
                worldGroup.add(g);
                g.traverse(m => { if (m.userData && m.userData.flame) flameMeshes.push(m); });
                let label = null;
                if (!o.decorative && o.interactScene) {
                    label = makeLabelSprite(o.label || o.id, '#f4e4b0');
                    label.position.set(o.x + o.w / 2, gh + (g.userData.h || 60) + 22, o.y + o.h / 2);
                    worldGroup.add(label);
                }
                objectEntries.push({ o, mesh: g, label });
                if (isLightSource(o)) lightBudget.push({ o, h: Math.min(g.userData.h || 40, 100) });
                continue;
            }
        }
        const h = objectHeightFor(o, atmos);
        const matOpts = { color: new THREE.Color(o.color || '#777'), shininess: 6, specular: 0x0d0d0d };
        const emissive = EMISSIVE_COLORS[o.color];
        if (emissive) {
            matOpts.emissive = new THREE.Color(o.color);
            matOpts.emissiveIntensity = emissive;
        }
        const mesh = addBoxAt(worldGroup, o.x, o.y, o.w, o.h, h, new THREE.MeshPhongMaterial(matOpts));
        const boxGH = currentGroundHeight(o.x + o.w / 2, o.y + o.h / 2);
        mesh.position.y += boxGH;
        let label = null;
        if (!o.decorative && o.interactScene) {
            label = makeLabelSprite(o.label || o.id, '#f4e4b0');
            label.position.set(o.x + o.w / 2, boxGH + h + 26, o.y + o.h / 2);
            worldGroup.add(label);
        }
        objectEntries.push({ o, mesh, label });
        if (isLightSource(o)) lightBudget.push({ o, h });
    }

    // Ambient desert clutter for the Ch1 camp
    if (currentMapKey === 1) addCh1Scatter(worldGroup);

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
            pl.position.set(lx, currentGroundHeight(lx, lz) + Math.max(h * 0.85, 30) + (cool ? 120 : 14), lz);
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
    halluc3d = [];             // hallucination figures too
    hallucNextAt = 0;
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
        // The dig gate's sign is baked into a sprite texture — repaint it
        // once the gate actually opens (labels are otherwise static)
        if (e.o.id === 'dig_gate' && e.label && !e.labelOpened && gameState.flags.scene3Triggered) {
            e.labelOpened = true;
            const fresh = makeLabelSprite('Dig Zone Gate — OPEN', '#f4e4b0');
            fresh.position.copy(e.label.position);
            e.label.parent.add(fresh);
            e.label.parent.remove(e.label);
            e.label.material.map.dispose();
            e.label.material.dispose();
            e.label = fresh;
        }
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
        p.fig.position.y = (u.baseY || 0) + Math.sin(t * 1.1 + u.phase) * 0.6;
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
        if (jumpY <= 0) {
            jumpY = 0; jumpVel = 0; isAirborne = false;
            sndFootstep(currentSurfaceType(), true); // landing thump
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
    const w = ministeryCar.w, d = ministeryCar.h;
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x1e2a3a, shininess: 30, specular: 0x223344 });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x10131a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, 18, d), bodyMat);
    body.position.y = 16;
    carGroup.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(w * 0.52, 14, d * 0.84), bodyMat);
    cabin.position.set(-w * 0.05, 31, 0);
    carGroup.add(cabin);
    const windows = new THREE.Mesh(new THREE.BoxGeometry(w * 0.54, 8, d * 0.86), darkMat);
    windows.position.set(-w * 0.05, 30, 0);
    carGroup.add(windows);
    for (const sx of [-w * 0.3, w * 0.3]) {
        for (const sz of [-d * 0.42, d * 0.42]) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 5, 10), darkMat);
            wheel.position.set(sx, 7, sz);
            wheel.rotation.x = Math.PI / 2;
            carGroup.add(wheel);
        }
    }
    for (const sz of [-1, 1]) { // headlights face the camp as it noses in
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 3),
            new THREE.MeshPhongMaterial({ color: 0x222211, emissive: 0xd8cf9a, emissiveIntensity: 0.9 }));
        lamp.position.set(sz * w * 0.3, 16, -d / 2 - 1);
        carGroup.add(lamp);
    }
    const plate = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 1.4),
        new THREE.MeshLambertMaterial({ color: 0xcfc4a6 }));
    plate.position.set(0, 12, d / 2 + 1);
    carGroup.add(plate);
    const label = makeLabelSprite('Ministry Car', '#f4e4b0');
    label.position.y = 62;
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
    const carX = ministeryCar.x + ministeryCar.w / 2;
    const carZ = ministeryCar.y + ministeryCar.h / 2;
    carGroup.position.set(carX, currentGroundHeight(carX, carZ), carZ);
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
        const hx = h.x + h.def.size / 2, hz = h.y + h.def.size / 2;
        entry.group.position.set(hx, currentGroundHeight(hx, hz) + bob, hz);
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
    const groundY = currentGroundHeight(cx, cz);
    const bob = isAirborne ? 0 : Math.sin(gameState.walkBobPhase) * 1.6;
    // Slow drunken sway grows with dread; a fine random tremor only
    // appears deep in FRACTURED (replaces the old constant jitter)
    const t = performance.now() / 1000;
    const low = sanityLowFactor();
    const sway = (Math.sin(t * 0.9) * 0.011 + Math.sin(t * 1.7) * 0.006) * dreadSmooth;
    let shakeX = 0, shakeY = 0, shakeZ = 0;
    if (low > 0) {
        const tremor = low * 1.8;
        shakeX = (Math.random() - 0.5) * tremor;
        shakeY = (Math.random() - 0.5) * tremor * 0.6;
        shakeZ = (Math.random() - 0.5) * tremor;
    }
    cam3.position.set(cx + shakeX, groundY + EYE_HEIGHT + jumpY + bob + shakeY, cz + shakeZ);
    cam3.rotation.y = camYaw;
    cam3.rotation.x = camPitch + Math.sin(t * 1.3) * 0.004 * dreadSmooth;
    cam3.rotation.z = sway;
    if (playerLamp) {
        // Carried slightly ahead and below eye level, with a faint sway
        playerLamp.position.set(
            cx - Math.sin(camYaw) * 30,
            groundY + EYE_HEIGHT - 10 + jumpY + bob,
            cz - Math.cos(camYaw) * 30
        );
    }
}

// ---- SANITY PRESENTATION (3D) ----
// Effects ramp continuously with the sanity value instead of snapping
// between states: desaturation, closing fog, a slow camera sway — and
// only below 2.5 (FRACTURED) the heartbeat: FOV pump, red vignette
// pulse, tremor. dreadSmooth eases visual changes over ~1s so a sudden
// story hit doesn't pop the screen.
let dreadSmooth = 0;     // 0 = calm … 1 = sanity zero
let heartbeatPhase = 0;  // advances faster the lower sanity gets

function sanityDreadTarget() {
    return 1 - Math.max(0, Math.min(1, gameState.sanity / 7.5));
}

// 0 → 1 only inside FRACTURED (sanity 2.5 → 0)
function sanityLowFactor() {
    return Math.max(0, Math.min(1, 1 - gameState.sanity / 2.5));
}

function updateSanityFX3d() {
    dreadSmooth += (sanityDreadTarget() - dreadSmooth) * 0.02;
    const low = sanityLowFactor();
    heartbeatPhase += (0.9 + low * 0.9) / 60; // 0.9 Hz calm-low … 1.8 Hz at zero

    // Continuous color grade on the WebGL canvas (replaces the binary
    // CSS filter classes the 2D build uses)
    if (dreadSmooth > 0.02) {
        const f = `saturate(${(1 - 0.45 * dreadSmooth).toFixed(3)})` +
                  ` contrast(${(1 + 0.16 * dreadSmooth).toFixed(3)})` +
                  (low > 0 ? ` hue-rotate(${Math.round(-10 * low)}deg) brightness(${(1 - 0.08 * low).toFixed(3)})` : '');
        if (glCanvas.style.filter !== f) glCanvas.style.filter = f;
    } else if (glCanvas.style.filter) {
        glCanvas.style.filter = '';
    }
    // The 2D overlay canvas keeps no filter in 3D mode (updateHUD sets
    // one for the 2D build; it would double-tint our overlays)
    if (canvas.className) canvas.className = '';

    // Heartbeat FOV pump, only when genuinely low
    const beat = Math.pow(Math.max(0, Math.sin(heartbeatPhase * Math.PI * 2)), 6);
    const fovTarget = 70 + beat * 1.6 * low;
    if (Math.abs(cam3.fov - fovTarget) > 0.01) {
        cam3.fov = fovTarget;
        cam3.updateProjectionMatrix();
    }
}

// ---- HALLUCINATIONS (world-space phantom figures) ----
// Replaces the 2D corner-dot phantoms in the 3D build: a dark figure
// stands in the middle distance, in or near your view, and dissolves
// when stared at directly (or after a few seconds, or on E/clarity).
let halluc3d = [];      // { group, born, ttl, gaze, dissolveAt }
let hallucNextAt = 0;   // ms timestamp of the next spawn window

const HALLUC_TIERS = {
    STRAINED:  { min: 22000, max: 45000, cap: 1 },
    FRACTURED: { min: 9000,  max: 18000, cap: 2 },
};

function spawnHallucination3d() {
    const pcx = player.x + player.size / 2;
    const pcy = player.y + player.size / 2;
    const walls = (mapWalls[currentMapKey] || []);
    for (let attempt = 0; attempt < 6; attempt++) {
        const a = camYaw + (Math.random() - 0.5) * 1.8; // roughly in/near the view cone
        const dist = 340 + Math.random() * 320;
        const hx = pcx - Math.sin(a) * dist;
        const hz = pcy - Math.cos(a) * dist;
        if (hx < 60 || hz < 60 || hx > WORLD.width - 60 || hz > WORLD.height - 60) continue;
        if (walls.some(w => hx > w.x && hx < w.x + w.w && hz > w.y && hz < w.y + w.h)) continue;
        const fig = makeHumanoid({
            skin: '#050505', shirt: '#050505', pants: '#030303',
            scale: 1.0 + Math.random() * 0.18
        });
        fig.position.set(hx, currentGroundHeight(hx, hz), hz);
        fig.rotation.y = Math.atan2(pcx - hx, pcy - hz); // it faces you
        fig.traverse(o => {
            if (o.material) { o.material.transparent = true; o.material.opacity = 0; }
        });
        scene3.add(fig);
        halluc3d.push({ group: fig, born: performance.now(), ttl: 5000 + Math.random() * 3000, gaze: 0, dissolveAt: 0 });
        return;
    }
}

function updateHallucinations3d() {
    if (clarityTimer > 0) clarityTimer--; // E key: brief clarity window
    const now = performance.now();
    const tier = HALLUC_TIERS[gameState.sanityState];

    if (tier && gameplayInputActive()) {
        if (!hallucNextAt) hallucNextAt = now + tier.min + Math.random() * (tier.max - tier.min);
        if (now >= hallucNextAt && halluc3d.length < tier.cap) {
            spawnHallucination3d();
            hallucNextAt = now + tier.min + Math.random() * (tier.max - tier.min);
        }
    } else {
        hallucNextAt = 0;
    }

    if (!halluc3d.length) return;
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw); // camera forward
    const pcx = player.x + player.size / 2;
    const pcy = player.y + player.size / 2;

    for (let i = halluc3d.length - 1; i >= 0; i--) {
        const h = halluc3d[i];
        const age = now - h.born;
        // Staring straight at it banishes it
        const dx = h.group.position.x - pcx, dz = h.group.position.z - pcy;
        const d = Math.hypot(dx, dz) || 1;
        if ((dx / d) * fx + (dz / d) * fz > 0.97) h.gaze += 16.7; else h.gaze = Math.max(0, h.gaze - 33);
        if (!h.dissolveAt && (age > h.ttl || h.gaze > 420 || clarityTimer > 0 || !tier || gameState.isDialogueActive)) {
            h.dissolveAt = now;
        }
        let opacity;
        if (h.dissolveAt) {
            opacity = Math.max(0, 0.85 * (1 - (now - h.dissolveAt) / 700));
        } else {
            opacity = Math.min(0.85, age / 600 * 0.85) * (0.9 + 0.1 * Math.sin(now / 90));
        }
        h.group.traverse(o => { if (o.material) o.material.opacity = opacity; });
        if (h.dissolveAt && opacity <= 0) {
            scene3.remove(h.group);
            halluc3d.splice(i, 1);
        }
    }
}

// ---- ATMOSPHERE ANIMATION ----
// Flame flicker on warm lights, the Heart's 8-second witness ping
// (same rhythm as the Codex pulse), and fog that closes in as sanity slips.
function updateAtmosphere3d() {
    const t = performance.now() / 1000;

    for (const f of flickerLights) {
        if (f.steady) continue;
        f.light.intensity = f.base * (0.86 + 0.10 * Math.sin(t * 9 + f.phase)
                                           + 0.06 * Math.sin(t * 23 + f.phase * 1.7));
    }

    // Open flames dance (brazier cones from the Ch1 props)
    for (const f of flameMeshes) {
        const ph = (f.id % 13) * 1.7;
        f.scale.set(1 + 0.16 * Math.sin(t * 11 + ph),
                    1 + 0.3 * Math.sin(t * 13 + ph * 1.3),
                    1 + 0.16 * Math.cos(t * 9 + ph));
        f.material.opacity = 0.7 + 0.2 * Math.sin(t * 17 + ph);
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
        // Fog closes in smoothly as sanity slips (full squeeze ≈ 0.35x)
        const mul = 1 - 0.65 * Math.pow(dreadSmooth, 1.4);
        scene3.fog.near += (fogBase[0] * mul - scene3.fog.near) * 0.03;
        scene3.fog.far  += (fogBase[1] * mul - scene3.fog.far)  * 0.03;
    }
}

// ---- OVERLAY DRAWING (reuses engine.js draw functions on #gameCanvas) ----
function drawOverlays() {
    const palette = getChapterPalette();

    // Drifting dust motes (canvas-space, engine-agnostic). The 2D dot
    // phantoms are not drawn in 3D — hallucinations are world-space here.
    drawAmbientDust(palette.ambientDust);

    const vigCX = canvas.width / 2, vigCY = canvas.height / 2;
    const vig = ctx.createRadialGradient(vigCX, vigCY, Math.min(canvas.width, canvas.height) * 0.25,
                                         vigCX, vigCY, Math.min(canvas.width, canvas.height) * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(0,0,0,${palette.vignette})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Heartbeat vignette — only deep in FRACTURED, pulsing with the FOV
    const lowFx = sanityLowFactor();
    if (lowFx > 0 && gameState.currentScreen === 'GAME') {
        const beat = Math.pow(Math.max(0, Math.sin(heartbeatPhase * Math.PI * 2)), 6);
        const alpha = lowFx * (0.10 + 0.16 * beat);
        const hb = ctx.createRadialGradient(vigCX, vigCY, Math.min(canvas.width, canvas.height) * 0.32,
                                            vigCX, vigCY, Math.min(canvas.width, canvas.height) * 0.75);
        hb.addColorStop(0, 'rgba(90,8,8,0)');
        hb.addColorStop(1, `rgba(90,8,8,${alpha.toFixed(3)})`);
        ctx.fillStyle = hb;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

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
    if ((e.key === ' ' || e.key === 'Enter') && gameState.currentScreen === 'START_MENU' && !mapView.active) {
        e.preventDefault();
        begin3dGame();
    }
});

// ---- SITE OVERVIEW (drone shots of the current map, from the menu) ----
// A few fixed perspectives over the whole map so layout issues can be
// spotted (and screenshotted) without walking there in game.
const mapView = { active: false, idx: 0 };
const MAP_VIEWS = [
    'TOP-DOWN — FULL SITE',
    'OBLIQUE — FROM SOUTH-EAST',
    'OBLIQUE — FROM NORTH-WEST',
    'LOW DRONE — SLOW ORBIT',
];
const mapViewHudEl = document.getElementById('mapview-hud');
const mapViewHintEl = document.getElementById('mapview-hint');
const mapViewCaptionEl = document.getElementById('mapview-caption');

function syncMapViewCaption() {
    mapViewCaptionEl.textContent = `${mapView.idx + 1} / ${MAP_VIEWS.length} · ${MAP_VIEWS[mapView.idx]}`;
}

function setMapView(active) {
    if (active && gameState.currentScreen !== 'START_MENU') return;
    mapView.active = active;
    mapViewHudEl.classList.toggle('hidden', !active);
    mapViewHintEl.classList.toggle('hidden', !active);
    menuOverlayEl.classList.toggle('hidden', active);
    if (active) syncMapViewCaption();
    else {
        cam3.up.set(0, 1, 0); // top-down view tilts the up vector
        if (scene3.fog) { scene3.fog.near = fogBase[0]; scene3.fog.far = fogBase[1]; }
    }
}

function cycleMapView(dir) {
    mapView.idx = (mapView.idx + dir + MAP_VIEWS.length) % MAP_VIEWS.length;
    syncMapViewCaption();
}

function positionMapViewCamera() {
    const cx = WORLD.width / 2, cz = WORLD.height / 2;
    const maxDim = Math.max(WORLD.width, WORLD.height);
    cam3.up.set(0, 1, 0);
    switch (mapView.idx) {
        case 0: { // straight down, whole map in frame, north at the top
            const tanH = Math.tan(cam3.fov * Math.PI / 360);
            const h = Math.max(WORLD.height / 2 / tanH,
                               WORLD.width / 2 / (tanH * cam3.aspect)) * 1.12;
            cam3.position.set(cx, h, cz);
            cam3.up.set(0, 0, -1);
            cam3.lookAt(cx, 0, cz);
            break;
        }
        case 1:
            cam3.position.set(WORLD.width * 1.18, maxDim * 0.62, WORLD.height * 1.18);
            cam3.lookAt(cx, 0, cz);
            break;
        case 2:
            cam3.position.set(-WORLD.width * 0.18, maxDim * 0.62, -WORLD.height * 0.18);
            cam3.lookAt(cx, 0, cz);
            break;
        case 3: { // low sweep — slow full circle at prop height
            const ang = performance.now() / 1000 * 0.08;
            cam3.position.set(cx + Math.cos(ang) * maxDim * 0.34, 560,
                              cz + Math.sin(ang) * maxDim * 0.34);
            cam3.lookAt(cx, 40, cz);
            break;
        }
    }
}

document.getElementById('menu-mapview').addEventListener('click', () => setMapView(true));
document.getElementById('mapview-back').addEventListener('click', () => setMapView(false));
document.getElementById('mapview-prev').addEventListener('click', () => cycleMapView(-1));
document.getElementById('mapview-next').addEventListener('click', () => cycleMapView(1));
window.addEventListener('keydown', e => {
    if (!mapView.active || gameState.currentScreen !== 'START_MENU') return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); cycleMapView(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); cycleMapView(1); }
    else if (e.key === 'Escape') setMapView(false);
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
    syncPauseHud();

    // Clear the 2D overlay every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState.currentScreen === 'START_MENU') {
        ensureWorldBuilt();
        updateAtmosphere3d();

        if (mapView.active) {
            // Drone shots: fog pushed out so the whole site reads, labels
            // shown so things can be named in a bug report screenshot.
            for (const e of objectEntries) if (e.label) { e.label.visible = true; e.label.material.opacity = 1; }
            if (scene3.fog) { scene3.fog.near = 60000; scene3.fog.far = 90000; }
            positionMapViewCamera();
            renderer3.render(scene3, cam3);
            if (glCanvas.style.filter) glCanvas.style.filter = '';
            return;
        }

        // Live vista: slow orbit over the night camp behind the DOM menu
        if (menuOverlayEl.classList.contains('hidden')) {
            menuOverlayEl.classList.remove('hidden');
            syncContinueButton(); // returning to menu — a save may now exist
        }
        for (const e of objectEntries) if (e.label) e.label.visible = false;
        const t = performance.now() / 1000;
        const ang = t * 0.055;
        const cx = 1703, cz = 2400; // tent compound center
        cam3.position.set(cx + Math.cos(ang) * 850, 310, cz + Math.sin(ang) * 850);
        cam3.lookAt(cx, 30, cz);
        renderer3.render(scene3, cam3);
        drawMenuSmiley();
        if (glCanvas.style.filter) glCanvas.style.filter = ''; // menu is always clear-eyed
        return;
    }
    if (!menuOverlayEl.classList.contains('hidden')) menuOverlayEl.classList.add('hidden');

    ensureWorldBuilt();
    syncPointerLock();
    updatePlayer3d();
    updateFootsteps();
    updateHostiles();    // existing patrol/chase/catch AI, unchanged
    updateSanityAmbient();
    updateMinistryCar3d();
    updateInteractions3d();
    syncHostiles3d();
    syncWorldVisibility();
    updatePersons3d();
    updateAtmosphere3d();
    updateSanityFX3d();
    updateHallucinations3d();
    updateCamera();      // keeps the 2D camera roughly centered for overlay draw math
    positionCamera();
    renderer3.render(scene3, cam3);

    drawOverlays();
}

gameLoop3d();
