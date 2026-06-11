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
    const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true });
    mat.fog = false;
    const moon = new THREE.Sprite(mat);
    moon.scale.set(900, 900, 1);
    moon.position.set(WORLD.width * 0.85, 2300, -WORLD.height * 0.55);
    return moon;
}

function silhouetteMat() {
    const m = new THREE.MeshBasicMaterial({ color: 0x0b0a10 });
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
    const lightBudget = [];
    for (const o of (activeMapObjects || [])) {
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
    if (playerLamp) {
        // Carried slightly ahead and below eye level, with a faint sway
        playerLamp.position.set(
            cx - Math.sin(camYaw) * 30,
            EYE_HEIGHT - 10 + bob,
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

function begin3dGame() {
    if (gameState.currentScreen !== 'START_MENU') return;
    menuOverlayEl.classList.add('hidden');
    startGame(); // sets GAMEFADEIN + overlayAlpha for the fade-in
}

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
        if (menuOverlayEl.classList.contains('hidden')) menuOverlayEl.classList.remove('hidden');
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
    updateAtmosphere3d();
    updateCamera();      // keeps the 2D camera roughly centered for overlay draw math
    positionCamera();
    renderer3.render(scene3, cam3);

    drawOverlays();
    syncSanityFilter();
}

gameLoop3d();
