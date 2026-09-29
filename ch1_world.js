// ============================================================
// THE CODEX OF GIZA — CHAPTER 1 WORLD (ch1_world.js)
//
// The Giza dig camp at night, fully procedural (no external assets,
// no build step). Loaded after engine.js and before engine3d.js;
// engine3d.js calls into it from buildWorld() and its frame loop.
//
//   - terrain: heightfield desert with dunes, a bulldozed site berm,
//     the north escarpment, a real dug trench, trodden paths/roads
//   - sky: shader dome (stars, milky way, thin cloud, Cairo glow),
//     moon, lit Giza pyramids, distant city lights
//   - lighting: moonlight with soft shadows, warm lamp pools with
//     glow halos, tone mapping
//   - FX: brazier fire + embers + smoke, drifting sand, lamp moths,
//     palm sway
//
// Collision is untouched: every wall and object keeps its 2D
// rectangle; this file only decides what they look like.
// Prop/building builders live in ch1_props.js.
// ============================================================

const CH1_W = 3840, CH1_H = 3520; // Ch1 world size after MAP_SCALE

// ---- SMALL HELPERS (shared with ch1_props.js / engine3d.js) ----

// Deterministic per-object randomness (so a crate stack doesn't
// reshuffle every time the world rebuilds)
function seededRng(str) {
    let h = 2166136261;
    str = String(str);
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => {
        h = Math.imul(h ^ (h >>> 15), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
}

const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
function smooth(a, b, x) { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }

// 3D value noise + fbm (terrain colour, rocks, cliffs)
function hash3(x, y, z) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 2147483647);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise3(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    let xf = x - xi, yf = y - yi, zf = z - zi;
    xf = xf * xf * (3 - 2 * xf); yf = yf * yf * (3 - 2 * yf); zf = zf * zf * (3 - 2 * zf);
    const l = (a, b, t) => a + (b - a) * t;
    return l(
        l(l(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), xf), l(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), xf), yf),
        l(l(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), xf), l(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), xf), yf),
        zf);
}
function fbm3(x, y, z, oct) {
    let s = 0, a = 0.5, n = oct || 4;
    for (let i = 0; i < n; i++) { s += a * vnoise3(x, y, z); x *= 2.03; y *= 2.03; z *= 2.03; a *= 0.5; }
    return s / (1 - Math.pow(0.5, n));
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
const gCyl = (rt, rb, h, n) => new THREE.CylinderGeometry(rt, rb, h, n || 10);

const texCache = {};
function makeTex(name, w, h, rx, ry, draw, linear) {
    if (texCache[name]) return texCache[name];
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(rx, ry);
    if (!linear) tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    texCache[name] = tex;
    return tex;
}

// Scatter n translucent specks — the base of most canvas textures
function speckle(cc, w, h, base, colors, n, sMin, sMax, aMin, aMax) {
    if (base) { cc.fillStyle = base; cc.fillRect(0, 0, w, h); }
    for (let i = 0; i < n; i++) {
        cc.fillStyle = colors[(Math.random() * colors.length) | 0];
        cc.globalAlpha = (aMin || 0.12) + Math.random() * ((aMax || 0.5) - (aMin || 0.12));
        const s = sMin + Math.random() * (sMax - sMin);
        cc.beginPath();
        cc.arc(Math.random() * w, Math.random() * h, s / 2, 0, 7);
        cc.fill();
    }
    cc.globalAlpha = 1;
}

// Soft blotches (large-scale mottling that hides texture tiling)
function blotches(cc, w, h, colors, n, rMin, rMax, alpha) {
    for (let i = 0; i < n; i++) {
        const x = Math.random() * w, y = Math.random() * h, r = rMin + Math.random() * (rMax - rMin);
        for (const [ox, oy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) { // wrap for tiling
            const g = cc.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
            const col = colors[(Math.random() * colors.length) | 0];
            g.addColorStop(0, col.replace('A', alpha));
            g.addColorStop(1, col.replace('A', 0));
            cc.fillStyle = g;
            cc.fillRect(x + ox - r, y + oy - r, r * 2, r * 2);
        }
    }
}

// Radial glow / soft particle textures
function radialTex(name, stops) {
    return makeTex(name, 128, 128, 1, 1, (cc, w, h) => {
        const g = cc.createRadialGradient(64, 64, 0, 64, 64, 64);
        for (const [o, c] of stops) g.addColorStop(o, c);
        cc.fillStyle = g;
        cc.fillRect(0, 0, w, h);
    });
}

// ============================================================
// TERRAIN
// ============================================================
// The desert rolls in layered dunes; the camp has levelled the ground
// it lives on (dunes flatten near every wall/building/prop); the ground
// climbs toward the north escarpment where the tunnel waits. A
// bulldozed spoil berm rings the site on the west, east and south
// (the invisible border walls now have a visible reason), cut where
// the ministry road comes in. The east trench is really dug.
// Collision stays 2D — the camera and every mesh sample this function.

const CH1_TRENCH = { x0: 2840, x1: 3120, z0: 1920, z1: 2640, depth: 46 };
const CH1_ROAD_X = [3450, 3690];         // ministry road corridor (enters from the south-east)
const CH1_CLIFF_Z = 372;                 // foot of the north escarpment

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

// Height without the trench cut (planks, spoil lips sit at grade)
function ch1HeightBase(x, z) {
    const dunes =
        18  * Math.sin(x * 0.0011 + 1.7) * Math.sin(z * 0.0009 + 0.6) +
        12  * Math.sin(x * 0.0021 + z * 0.0016 + 4.2) +
        5.5 * Math.sin(x * 0.0052 - z * 0.0037 + 2.2) +
        2.5 * Math.sin(x * 0.011 + z * 0.009);
    const d = ch1StructDist(x, z);
    const mask = Math.max(0.12, Math.min(1, (d - 35) / 165));
    // The climb toward the escarpment
    const t = clamp01((1000 - z) / 800);
    let h = dunes * mask + 38 * t * t * (3 - 2 * t);

    // Site berm along the W / E / S edges (cut for the ministry road)
    const dEdge = Math.min(x, CH1_W - x, CH1_H - z);
    const inRoad = smooth(CH1_ROAD_X[0] - 60, CH1_ROAD_X[0] + 40, x) * (1 - smooth(CH1_ROAD_X[1] - 40, CH1_ROAD_X[1] + 60, x));
    const southCut = (CH1_H - z) === dEdge ? inRoad : 0;
    if (z > CH1_CLIFF_Z + 200) {
        h += 30 * Math.exp(-Math.pow((dEdge + 6) / 62, 2)) * (1 - southCut);
    }

    // Spoil thrown up along both lips of the east trench
    if (z > CH1_TRENCH.z0 - 40 && z < CH1_TRENCH.z1 + 40 && x > CH1_TRENCH.x0 - 90 && x < CH1_TRENCH.x1 + 90) {
        const along = smooth(CH1_TRENCH.z0 - 40, CH1_TRENCH.z0 + 60, z) * (1 - smooth(CH1_TRENCH.z1 - 60, CH1_TRENCH.z1 + 40, z));
        const lip = Math.exp(-Math.pow((x - (CH1_TRENCH.x0 - 26)) / 24, 2)) + Math.exp(-Math.pow((x - (CH1_TRENCH.x1 + 26)) / 24, 2));
        h += 20 * lip * along;
    }

    // Beyond the site: open desert, dunes growing with distance
    const ox = Math.max(0, -x, x - CH1_W), oz = Math.max(0, z - CH1_H);
    const out = Math.hypot(ox, oz);
    if (out > 0) {
        const big = 60 * Math.sin(x * 0.0007 + 0.4) * Math.sin(z * 0.0006 + 1.1) +
                    40 * Math.sin(x * 0.0013 - z * 0.0009 + 2.0);
        const road = (z > CH1_H - 20) ? inRoad : 0;
        h += (smooth(0, 900, out) * (70 + big)) * (1 - road * 0.95);
    }

    // The escarpment: the ground rears up behind the cliff face
    const edgeWobble = (vnoise3(x * 0.004, 0.5, 1.5) - 0.5) * 70;
    h += 250 * smooth(CH1_CLIFF_Z + 20 + edgeWobble * 0.3, CH1_CLIFF_Z - 190 + edgeWobble, z);
    return h;
}

function ch1TrenchDip(x, z) {
    const T = CH1_TRENCH;
    if (x < T.x0 - 10 || x > T.x1 + 10 || z < T.z0 - 12 || z > T.z1 + 12) return 0;
    const ix = smooth(T.x0 - 4, T.x0 + 26, x) * (1 - smooth(T.x1 - 26, T.x1 + 4, x));
    const iz = smooth(T.z0 - 8, T.z0 + 140, z) * (1 - smooth(T.z1 - 140, T.z1 + 8, z)); // ramped ends
    return T.depth * ix * iz;
}

function ch1Height(x, z) {
    return ch1HeightBase(x, z) - ch1TrenchDip(x, z);
}

// Ground height under a world point for the current map (0 off-Ch1)
function currentGroundHeight(x, z) {
    return (currentMapKey === 1) ? ch1Height(x, z) : 0;
}

// ---- TRODDEN PATHS & ROADS (painted into the terrain vertex colours) ----
// [x1, z1, x2, z2, halfWidth, kind]  kind: 0 footpath, 1 vehicle track
const CH1_PATHS = [
    // main entry road: from the south, through the camp gate, to the compound
    [1160, 5200, 1160, 3300, 70, 1], [1160, 3300, 1190, 3000, 60, 1], [1190, 3000, 1690, 2830, 55, 1],
    // ministry road up the east side to where the car parks
    [3570, 6200, 3570, 3300, 80, 1], [3570, 3300, 3560, 2120, 70, 1],
    // compound out to the worker camp, the trench, the dig gate
    [1690, 2830, 900, 2700, 42, 0], [900, 2700, 560, 2640, 40, 0],
    [1690, 2830, 2400, 2760, 40, 0], [2400, 2760, 2980, 2700, 38, 0],
    [2980, 2700, 3380, 2560, 36, 0], [2150, 2400, 3380, 2560, 30, 0],
    [1680, 1960, 1760, 1740, 44, 0], [1250, 2400, 1680, 1960, 34, 0], [2140, 2380, 1680, 1960, 34, 0],
    // beyond the dig gate to the tunnel cutting
    [1760, 1700, 1780, 1250, 48, 1], [1780, 1250, 1880, 860, 48, 1], [1880, 860, 1900, 640, 44, 0],
    [1780, 1300, 1520, 1480, 30, 0], [1800, 1250, 2560, 1380, 28, 0],
];

function ch1PathMask(x, z) {
    let best = 0, kindAt = 0;
    for (const [x1, z1, x2, z2, hw, kind] of CH1_PATHS) {
        const dx = x2 - x1, dz = z2 - z1;
        const t = clamp01(((x - x1) * dx + (z - z1) * dz) / (dx * dx + dz * dz));
        const d = Math.hypot(x - (x1 + dx * t), z - (z1 + dz * t));
        const edgeJitter = (vnoise3(x * 0.02, z * 0.02, 3.3) - 0.5) * hw * 0.5;
        const m = 1 - smooth(hw * 0.45, hw + edgeJitter, d);
        if (m > best) { best = m; kindAt = kind; }
        // tyre ruts inside vehicle tracks
        if (kind === 1 && m > 0.5) {
            const across = Math.abs(d - hw * 0.42);
            if (across < 7) { best = Math.max(best, 1.25); kindAt = 2; }
        }
    }
    return [best, kindAt];
}

// ---- TEXTURES & MATERIALS ----
let CH1M = null;
function ch1Mats() {
    if (CH1M) return CH1M;
    const std = (opts) => new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.9, metalness: 0 }, opts));

    const sand = makeTex('c1sand', 512, 512, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#b89c74';
        cc.fillRect(0, 0, w, h);
        blotches(cc, w, h, ['rgba(160,128,88,A)', 'rgba(214,190,150,A)', 'rgba(150,124,92,A)'], 26, 40, 130, 0.22);
        speckle(cc, w, h, null, ['#a88c62', '#d9c29a', '#9c8058', '#e2cfa8', '#8a704e'], 5200, 0.8, 2.2, 0.15, 0.55);
        speckle(cc, w, h, null, ['#6e5a40', '#f0e2c0'], 500, 1, 2.6, 0.2, 0.6);
    });
    const sandBump = makeTex('c1sandBump', 512, 512, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#808080';
        cc.fillRect(0, 0, w, h);
        // wind ripples: long gently-curving crests with a soft lee side
        for (let i = 0; i < 34; i++) {
            const y0 = (i / 34) * h + Math.random() * 6;
            for (const [off, col, lw] of [[0, 'rgba(255,255,255,0.35)', 3], [4, 'rgba(0,0,0,0.3)', 4]]) {
                cc.strokeStyle = col; cc.lineWidth = lw;
                cc.beginPath();
                for (let x = -10; x <= w + 10; x += 8) {
                    const y = y0 + off + Math.sin(x * 0.024 + i * 1.7) * 5 + Math.sin(x * 0.061 + i) * 2;
                    x < 0 ? cc.moveTo(x, y) : cc.lineTo(x, y);
                }
                cc.stroke();
            }
        }
        speckle(cc, w, h, null, ['#fff', '#000'], 2500, 0.8, 2, 0.1, 0.35);
    }, true);
    const rock = makeTex('c1rock', 512, 512, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#9c8a70';
        cc.fillRect(0, 0, w, h);
        blotches(cc, w, h, ['rgba(120,104,82,A)', 'rgba(176,160,130,A)', 'rgba(96,84,66,A)'], 30, 30, 110, 0.35);
        // sedimentary strata
        for (let y = 0; y < h; y += 6 + Math.random() * 18) {
            cc.fillStyle = `rgba(${Math.random() < 0.5 ? '60,50,38' : '200,186,156'},${0.08 + Math.random() * 0.14})`;
            cc.fillRect(0, y, w, 2 + Math.random() * 5);
        }
        speckle(cc, w, h, null, ['#5f5443', '#bcae90', '#7a6c58'], 3000, 1, 3.5, 0.15, 0.5);
        cc.strokeStyle = 'rgba(40,32,22,0.45)';
        for (let i = 0; i < 26; i++) { // cracks
            cc.lineWidth = 0.8 + Math.random() * 1.6;
            cc.beginPath();
            let x = Math.random() * w, y = Math.random() * h;
            cc.moveTo(x, y);
            for (let s = 0; s < 6; s++) { x += (Math.random() - 0.5) * 50; y += Math.random() * 26; cc.lineTo(x, y); }
            cc.stroke();
        }
    });
    const dirt = makeTex('c1dirt', 256, 256, 1, 1, (cc, w, h) => { // trench walls: layered deposits
        cc.fillStyle = '#7a6448';
        cc.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 5 + Math.random() * 14) {
            cc.fillStyle = ['rgba(90,70,48,0.5)', 'rgba(150,126,92,0.45)', 'rgba(110,84,60,0.5)', 'rgba(70,56,40,0.4)'][(Math.random() * 4) | 0];
            cc.fillRect(0, y, w, 3 + Math.random() * 8);
        }
        speckle(cc, w, h, null, ['#4e3e2c', '#a08a68', '#c7b28a'], 1400, 1, 3, 0.2, 0.6);
    });

    // Ground: sand and rock blended per vertex (aRock), both at world scale
    const ground = std({ map: sand, bumpMap: sandBump, bumpScale: 0.55, vertexColors: true, roughness: 0.96 });
    ground.onBeforeCompile = (sh) => {
        sh.uniforms.rockMap = { value: rock };
        sh.uniforms.dirtMap = { value: dirt };
        sh.vertexShader = 'attribute vec2 aMix;\nvarying vec2 vMix;\nvarying vec3 vWPos;\n' +
            sh.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\nvMix = aMix;\nvWPos = (modelMatrix * vec4(position, 1.0)).xyz;');
        sh.fragmentShader = 'uniform sampler2D rockMap;\nuniform sampler2D dirtMap;\nvarying vec2 vMix;\nvarying vec3 vWPos;\n' +
            sh.fragmentShader.replace('#include <map_fragment>', `
                vec4 sandC = texture2D(map, vUv);
                vec4 sandFar = texture2D(map, vUv * 0.21 + 0.37);
                sandC = mix(sandC, sandFar, 0.45);
                vec4 rockC = texture2D(rockMap, vec2(vWPos.x + vWPos.z * 0.35, vWPos.y * 1.6) / 300.0);
                vec4 dirtC = texture2D(dirtMap, vec2(vWPos.x + vWPos.z, vWPos.y * 2.2) / 180.0);
                vec4 texelColor = mix(sandC, rockC, vMix.x);
                texelColor = mix(texelColor, dirtC, vMix.y);
                diffuseColor *= texelColor;`);
    };
    ground.customProgramCacheKey = () => 'c1ground';

    const planks = makeTex('c1planks', 256, 256, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#8a6a48';
        cc.fillRect(0, 0, w, h);
        const bw = 32;
        for (let x = 0; x < w; x += bw) {
            const tone = 0.8 + Math.random() * 0.35;
            cc.fillStyle = `rgb(${138 * tone | 0},${104 * tone | 0},${70 * tone | 0})`;
            cc.fillRect(x, 0, bw - 2, h);
            cc.strokeStyle = 'rgba(60,40,22,0.35)';
            for (let i = 0; i < 7; i++) { // grain
                cc.lineWidth = 0.6 + Math.random();
                const gx = x + 3 + Math.random() * (bw - 8);
                cc.beginPath(); cc.moveTo(gx, 0);
                for (let y = 0; y <= h; y += 16) cc.lineTo(gx + Math.sin(y * 0.05 + i) * 1.5, y);
                cc.stroke();
            }
            cc.fillStyle = 'rgba(30,20,10,0.8)';
            cc.fillRect(x + bw - 2, 0, 2, h); // gaps
            cc.fillStyle = 'rgba(40,30,20,0.7)';
            for (const y of [18, h - 18]) { cc.beginPath(); cc.arc(x + 8, y, 1.6, 0, 7); cc.arc(x + bw - 10, y, 1.6, 0, 7); cc.fill(); } // nails
        }
        blotches(cc, w, h, ['rgba(40,30,18,A)', 'rgba(170,150,120,A)'], 10, 20, 60, 0.18); // weathering
    });
    const wood = makeTex('c1wood', 128, 128, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#6e5238';
        cc.fillRect(0, 0, w, h);
        cc.strokeStyle = 'rgba(40,26,14,0.45)';
        for (let i = 0; i < 26; i++) {
            cc.lineWidth = 0.5 + Math.random() * 1.2;
            const y0 = Math.random() * h;
            cc.beginPath(); cc.moveTo(0, y0);
            for (let x = 0; x <= w; x += 12) cc.lineTo(x, y0 + Math.sin(x * 0.06 + i) * 2);
            cc.stroke();
        }
        speckle(cc, w, h, null, ['#86684a', '#4e3824'], 200, 1, 3);
    });
    const corrugated = makeTex('c1corr', 256, 256, 1, 1, (cc, w, h) => {
        for (let x = 0; x < w; x++) {
            const s = 0.5 + 0.5 * Math.sin(x / w * Math.PI * 2 * 16);
            const v = 118 + s * 60;
            cc.fillStyle = `rgb(${v | 0},${v * 0.97 | 0},${v * 0.9 | 0})`;
            cc.fillRect(x, 0, 1, h);
        }
        // rust streaks running down from the fixings
        for (let i = 0; i < 22; i++) {
            const x = Math.random() * w, len = 30 + Math.random() * 140;
            const g = cc.createLinearGradient(0, 0, 0, len);
            g.addColorStop(0, 'rgba(120,58,24,0.55)');
            g.addColorStop(1, 'rgba(120,58,24,0)');
            cc.fillStyle = g;
            cc.fillRect(x, Math.random() * 40, 3 + Math.random() * 7, len);
        }
        blotches(cc, w, h, ['rgba(92,62,40,A)', 'rgba(60,56,50,A)'], 14, 20, 70, 0.3);
    });
    const corrBump = makeTex('c1corrBump', 128, 16, 1, 1, (cc, w, h) => {
        for (let x = 0; x < w; x++) {
            const v = 128 + 127 * Math.sin(x / w * Math.PI * 2 * 8);
            cc.fillStyle = `rgb(${v | 0},${v | 0},${v | 0})`;
            cc.fillRect(x, 0, 1, h);
        }
    }, true);
    const canvasTex = makeTex('c1canvas', 256, 256, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#c9b690';
        cc.fillRect(0, 0, w, h);
        blotches(cc, w, h, ['rgba(140,118,80,A)', 'rgba(110,92,64,A)', 'rgba(220,208,180,A)'], 16, 20, 80, 0.3);
        for (let y = 0; y < h; y += 2) { cc.fillStyle = `rgba(90,76,50,${0.04 + Math.random() * 0.05})`; cc.fillRect(0, y, w, 1); } // weave
        cc.strokeStyle = 'rgba(90,72,44,0.55)';
        cc.lineWidth = 2;
        for (let x = 0; x < w; x += 64) { cc.beginPath(); cc.moveTo(x + 1, 0); cc.lineTo(x + 1, h); cc.stroke(); } // seams
        const g = cc.createLinearGradient(0, h * 0.7, 0, h); // dust climbing the hem
        g.addColorStop(0, 'rgba(150,120,80,0)'); g.addColorStop(1, 'rgba(130,100,64,0.5)');
        cc.fillStyle = g; cc.fillRect(0, 0, w, h);
    });
    const plaster = makeTex('c1plaster', 256, 256, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#c4ab86';
        cc.fillRect(0, 0, w, h);
        blotches(cc, w, h, ['rgba(160,132,96,A)', 'rgba(214,196,164,A)'], 22, 20, 70, 0.35);
        // plaster fallen away, mud bricks showing
        for (let i = 0; i < 5; i++) {
            const px = Math.random() * w, py = Math.random() * h, pw = 30 + Math.random() * 50, ph = 20 + Math.random() * 30;
            cc.fillStyle = '#8a6a4a'; cc.fillRect(px, py, pw, ph);
            cc.strokeStyle = 'rgba(60,44,30,0.8)'; cc.lineWidth = 1;
            for (let by = py; by < py + ph; by += 8) {
                cc.beginPath(); cc.moveTo(px, by); cc.lineTo(px + pw, by); cc.stroke();
                for (let bx = px + ((by / 8) % 2) * 9; bx < px + pw; bx += 18) { cc.beginPath(); cc.moveTo(bx, by); cc.lineTo(bx, by + 8); cc.stroke(); }
            }
            cc.strokeStyle = 'rgba(230,214,184,0.6)'; cc.lineWidth = 2; cc.strokeRect(px, py, pw, ph);
        }
        speckle(cc, w, h, null, ['#9a7e5c', '#e0cda8'], 900, 1, 2.5);
        const g = cc.createLinearGradient(0, h * 0.75, 0, h);
        g.addColorStop(0, 'rgba(120,90,60,0)'); g.addColorStop(1, 'rgba(110,80,52,0.55)');
        cc.fillStyle = g; cc.fillRect(0, 0, w, h);
    });
    const crate = makeTex('c1crate', 128, 128, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#9a7a52';
        cc.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 21) { cc.fillStyle = `rgba(60,40,20,${0.1 + Math.random() * 0.15})`; cc.fillRect(0, y, w, 20); cc.fillStyle = 'rgba(40,26,12,0.7)'; cc.fillRect(0, y + 20, w, 1.5); }
        cc.strokeStyle = '#6a4e30'; cc.lineWidth = 9;
        cc.strokeRect(4.5, 4.5, w - 9, h - 9);
        cc.beginPath(); cc.moveTo(8, 8); cc.lineTo(w - 8, h - 8); cc.stroke();
        cc.fillStyle = 'rgba(30,24,16,0.65)'; cc.font = 'bold 13px monospace';
        cc.fillText('SCA · GIZA', 22, 72);
        speckle(cc, w, h, null, ['#5c4226'], 80, 1, 2.5);
    });
    const tarp = makeTex('c1tarp', 256, 256, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#6f7552';
        cc.fillRect(0, 0, w, h);
        blotches(cc, w, h, ['rgba(80,86,58,A)', 'rgba(140,142,108,A)', 'rgba(70,64,44,A)'], 20, 20, 70, 0.4);
        cc.strokeStyle = 'rgba(40,44,26,0.4)';
        for (let i = 0; i < 12; i++) { cc.lineWidth = 1 + Math.random() * 3; cc.beginPath(); const y = Math.random() * h; cc.moveTo(0, y); cc.bezierCurveTo(w * 0.3, y + 20, w * 0.6, y - 20, w, y + 5); cc.stroke(); }
    });
    const limestone = makeTex('c1lime', 256, 256, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#c8b893';
        cc.fillRect(0, 0, w, h);
        blotches(cc, w, h, ['rgba(150,132,100,A)', 'rgba(220,210,186,A)', 'rgba(120,104,80,A)'], 20, 20, 70, 0.3);
        speckle(cc, w, h, null, ['#9e8c6c', '#e4d8bc', '#7c6c54'], 1500, 1, 3);
    });
    const glyphs = makeTex('c1glyphs', 256, 512, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#bfae88';
        cc.fillRect(0, 0, w, h);
        blotches(cc, w, h, ['rgba(140,120,90,A)', 'rgba(214,200,170,A)'], 18, 20, 70, 0.35);
        speckle(cc, w, h, null, ['#8e7c5e', '#e0d4b8'], 1400, 1, 3);
        cc.strokeStyle = 'rgba(70,56,36,0.8)'; cc.fillStyle = 'rgba(70,56,36,0.8)'; cc.lineWidth = 3;
        cc.strokeRect(14, 14, w - 28, h - 28);
        for (let row = 0; row < 9; row++) {
            const y = 36 + row * 52;
            for (let col = 0; col < 5; col++) {
                const x = 30 + col * 42, g = (Math.random() * 6) | 0;
                cc.beginPath();
                if (g === 0) { cc.ellipse(x + 12, y + 12, 11, 7, 0, 0, 7); cc.stroke(); cc.beginPath(); cc.arc(x + 12, y + 12, 3.5, 0, 7); cc.fill(); }
                else if (g === 1) { cc.moveTo(x, y + 26); cc.lineTo(x + 12, y); cc.lineTo(x + 24, y + 26); cc.stroke(); }
                else if (g === 2) { cc.arc(x + 12, y + 7, 6, 0, 7); cc.moveTo(x + 12, y + 13); cc.lineTo(x + 12, y + 28); cc.moveTo(x + 3, y + 17); cc.lineTo(x + 21, y + 17); cc.stroke(); }
                else if (g === 3) { for (let k = 0; k < 3; k++) { cc.moveTo(x, y + 6 + k * 8); for (let s = 0; s <= 4; s++) cc.lineTo(x + s * 6, y + 6 + k * 8 + (s % 2 ? 4 : 0)); } cc.stroke(); }
                else if (g === 4) { cc.moveTo(x + 2, y + 24); cc.quadraticCurveTo(x + 20, y + 26, x + 20, y + 12); cc.quadraticCurveTo(x + 18, y, x + 8, y + 4); cc.stroke(); }
                else { cc.fillRect(x + 4, y + 2, 16, 6); cc.fillRect(x + 8, y + 10, 8, 16); }
            }
        }
    });
    const chain = makeTex('c1chain', 64, 64, 1, 1, (cc, w, h) => {
        cc.clearRect(0, 0, w, h);
        cc.strokeStyle = 'rgba(190,196,200,1)';
        cc.lineWidth = 2.2;
        for (let i = -64; i < 128; i += 16) {
            cc.beginPath(); cc.moveTo(i, 0); cc.lineTo(i + 64, 64); cc.stroke();
            cc.beginPath(); cc.moveTo(i + 64, 0); cc.lineTo(i, 64); cc.stroke();
        }
    });
    const frond = makeTex('c1frond', 256, 64, 1, 1, (cc, w, h) => {
        cc.clearRect(0, 0, w, h);
        cc.strokeStyle = '#5a6a2c'; cc.lineWidth = 4;
        cc.beginPath(); cc.moveTo(0, h / 2); cc.lineTo(w, h / 2); cc.stroke();
        for (let x = 6; x < w - 4; x += 5) {
            const len = (h / 2 - 3) * (1 - Math.pow(x / w, 2) * 0.7);
            cc.strokeStyle = ['#56722e', '#4a6426', '#62802f', '#6d7c34'][(x / 5) % 4 | 0];
            cc.lineWidth = 2.6;
            cc.beginPath(); cc.moveTo(x, h / 2); cc.lineTo(x - 9, h / 2 - len); cc.stroke();
            cc.beginPath(); cc.moveTo(x, h / 2); cc.lineTo(x - 9, h / 2 + len); cc.stroke();
        }
    });
    const grass = makeTex('c1grass', 128, 128, 1, 1, (cc, w, h) => {
        cc.clearRect(0, 0, w, h);
        for (let i = 0; i < 46; i++) {
            const x = 20 + Math.random() * 88, lean = (Math.random() - 0.5) * 60;
            cc.strokeStyle = ['#a39360', '#8c7c4c', '#b8a874', '#7a6c40'][(Math.random() * 4) | 0];
            cc.lineWidth = 1.5 + Math.random() * 1.5;
            cc.beginPath(); cc.moveTo(x, h);
            cc.quadraticCurveTo(x + lean * 0.3, h * 0.5, x + lean, h * (0.05 + Math.random() * 0.4));
            cc.stroke();
        }
    });
    const shrub = makeTex('c1shrub', 128, 128, 1, 1, (cc, w, h) => { // camel-thorn tangle
        cc.clearRect(0, 0, w, h);
        const branch = (x, y, a, len, depth) => {
            if (depth <= 0 || len < 4) return;
            const x2 = x + Math.cos(a) * len, y2 = y - Math.sin(a) * len;
            cc.strokeStyle = depth > 2 ? '#5a4a34' : '#6a6038';
            cc.lineWidth = depth * 0.9;
            cc.beginPath(); cc.moveTo(x, y); cc.lineTo(x2, y2); cc.stroke();
            if (depth <= 2) { cc.fillStyle = Math.random() < 0.5 ? '#6f7a3a' : '#8a8a48'; cc.beginPath(); cc.arc(x2, y2, 2.2, 0, 7); cc.fill(); }
            branch(x2, y2, a + 0.5 + Math.random() * 0.3, len * 0.72, depth - 1);
            branch(x2, y2, a - 0.5 - Math.random() * 0.3, len * 0.72, depth - 1);
        };
        for (let i = 0; i < 5; i++) branch(64 + (Math.random() - 0.5) * 20, h, Math.PI / 2 + (Math.random() - 0.5) * 1.2, 26, 5);
    });
    const rug = makeTex('c1rug', 256, 128, 1, 1, (cc, w, h) => { // a kilim by the fire
        cc.fillStyle = '#7a1f1a'; cc.fillRect(0, 0, w, h);
        cc.fillStyle = '#2a2a4a'; cc.fillRect(12, 12, w - 24, h - 24);
        cc.fillStyle = '#b8862a';
        for (let x = 30; x < w - 20; x += 40) {
            cc.beginPath(); cc.moveTo(x, h / 2); cc.lineTo(x + 16, 26); cc.lineTo(x + 32, h / 2); cc.lineTo(x + 16, h - 26); cc.fill();
            cc.fillStyle = '#7a1f1a'; cc.beginPath(); cc.arc(x + 16, h / 2, 5, 0, 7); cc.fill(); cc.fillStyle = '#b8862a';
        }
        cc.strokeStyle = '#d8c8a0'; cc.lineWidth = 2; cc.setLineDash([6, 4]); cc.strokeRect(6, 6, w - 12, h - 12);
        blotches(cc, w, h, ['rgba(120,100,70,A)'], 8, 20, 50, 0.3);
    });

    const flameTex = makeTex('c1flame', 64, 128, 1, 1, (cc, w, h) => {
        const g = cc.createRadialGradient(32, 100, 2, 32, 86, 60);
        g.addColorStop(0, 'rgba(255,250,210,1)');
        g.addColorStop(0.25, 'rgba(255,196,90,0.95)');
        g.addColorStop(0.6, 'rgba(230,100,30,0.55)');
        g.addColorStop(1, 'rgba(160,40,10,0)');
        cc.fillStyle = g;
        cc.beginPath();
        cc.moveTo(32, 2);
        cc.bezierCurveTo(44, 40, 60, 70, 54, 104);
        cc.quadraticCurveTo(32, 128, 10, 104);
        cc.bezierCurveTo(4, 70, 20, 40, 32, 2);
        cc.fill();
    });

    CH1M = {
        ground,
        sand: std({ map: sand, color: 0xe6d6b8 }),
        rock: std({ map: rock, flatShading: true }),
        rockDark: std({ map: rock, color: 0x9a9088, flatShading: true }),
        cliff: std({ map: rock, color: 0xd8ccb8, flatShading: true }),
        dirt: std({ map: dirt }),
        planks: std({ map: planks }),
        planksDark: std({ map: planks, color: 0x8a7a68 }),
        wood: std({ map: wood }),
        woodDark: std({ map: wood, color: 0x6a5a4a }),
        woodPale: std({ map: wood, color: 0xd8c8b0 }),
        corrugated: std({ map: corrugated, bumpMap: corrBump, bumpScale: 2, roughness: 0.6, metalness: 0.25, side: THREE.DoubleSide }),
        metal: std({ color: 0x6a6a64, roughness: 0.55, metalness: 0.35 }),
        metalDark: std({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.3 }),
        steel: std({ color: 0x9aa0a4, roughness: 0.4, metalness: 0.5 }),
        rust: std({ color: 0x7a4a2a, roughness: 0.85, metalness: 0.2 }),
        paintBlue: std({ color: 0x2c4f7a, roughness: 0.55, metalness: 0.2 }),
        paintWhite: std({ color: 0xd8d4c8, roughness: 0.6, metalness: 0.15 }),
        paintGreen: std({ color: 0x4a5a38, roughness: 0.7, metalness: 0.15 }),
        paintRed: std({ color: 0x8a2a20, roughness: 0.6, metalness: 0.15 }),
        paintYellow: std({ color: 0xc8a030, roughness: 0.6, metalness: 0.1 }),
        rubber: std({ color: 0x1a1a1a, roughness: 0.95 }),
        glass: std({ color: 0x1a2430, roughness: 0.15, metalness: 0.6 }),
        canvas: std({ map: canvasTex, side: THREE.DoubleSide }),
        canvasDark: std({ map: canvasTex, color: 0x8a7e6a, side: THREE.DoubleSide }),
        plaster: std({ map: plaster }),
        crate: std({ map: crate }),
        tarp: std({ map: tarp, side: THREE.DoubleSide }),
        limestone: std({ map: limestone }),
        glyphs: std({ map: glyphs }),
        chain: std({ map: chain, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.4 }),
        frond: std({ map: frond, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.8 }),
        grass: std({ map: grass, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide }),
        shrub: std({ map: shrub, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide }),
        rug: std({ map: rug }),
        trunk: std({ color: 0x6e5a42, roughness: 0.95 }),
        cactus: std({ color: 0x4f6b35, roughness: 0.75 }),
        terracotta: std({ color: 0xa4643c }),
        sandbag: std({ map: canvasTex, color: 0xb8a078 }),
        rope: std({ color: 0xb09868 }),
        cloth: std({ color: 0x8a2a24, side: THREE.DoubleSide }),
        clothBlue: std({ color: 0x2a4a7a, side: THREE.DoubleSide }),
        paper: std({ color: 0xe8e0c8 }),
        dark: std({ color: 0x141210 }),
        black: new THREE.MeshBasicMaterial({ color: 0x020202 }),
        bulb: new THREE.MeshBasicMaterial({ color: 0xffd9a0, toneMapped: false }),
        bulbCool: new THREE.MeshBasicMaterial({ color: 0xeef4ff, toneMapped: false }),
        window: new THREE.MeshStandardMaterial({ color: 0x241808, emissive: 0xffa84a, emissiveIntensity: 1.2 }),
        windowDim: new THREE.MeshStandardMaterial({ color: 0x0c0c10, roughness: 0.2, metalness: 0.5 }),
        ember: new THREE.MeshStandardMaterial({ color: 0x301008, emissive: 0xff6a1a, emissiveIntensity: 1.6 }),
        glow: new THREE.MeshStandardMaterial({ color: 0x3a2a10, emissive: 0xffc860, emissiveIntensity: 1.1 }),
        amber: new THREE.MeshStandardMaterial({ color: 0x3a2a08, emissive: 0xd4af37, emissiveIntensity: 0.9 }),
        flame: new THREE.SpriteMaterial({ map: flameTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }),
        tex: { sand, rock, planks, canvas: canvasTex, flame: flameTex },
    };
    return CH1M;
}

// ============================================================
// ROCKS & CLIFFS
// ============================================================
// Low-poly faceted rock: a noise-displaced icosphere with a flattened
// base. A handful of variants are cached and reused with random
// scale/rotation.
const ROCK_GEOS = [];
function ch1RockGeo(i) {
    i = i % 10;
    if (ROCK_GEOS[i]) return ROCK_GEOS[i];
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const p = geo.attributes.position;
    const sx = 0.9 + hash3(i, 1, 7) * 0.5, sz = 0.8 + hash3(i, 2, 7) * 0.5;
    for (let k = 0; k < p.count; k++) {
        let x = p.getX(k), y = p.getY(k), z = p.getZ(k);
        const n = fbm3(x * 1.4 + i * 7.1, y * 1.4, z * 1.4 + i * 3.3, 3);
        const r = 0.72 + 0.55 * n;
        x *= r * sx; y *= r * 0.78; z *= r * sz;
        if (y < -0.25) y = -0.25 + (y + 0.25) * 0.15; // sits on the ground
        p.setXYZ(k, x, y + 0.25, z);
    }
    geo.computeVertexNormals();
    ROCK_GEOS[i] = geo;
    return geo;
}

function ch1AddRock(g, x, y, z, size, rng, mat, sink) {
    const m = new THREE.Mesh(ch1RockGeo((rng() * 10) | 0), mat || ch1Mats().rock);
    m.scale.set(size * (0.8 + rng() * 0.5), size * (0.6 + rng() * 0.6), size * (0.8 + rng() * 0.5));
    m.position.set(x, y - (sink || 0.15) * size, z);
    m.rotation.y = rng() * Math.PI * 2;
    m.rotation.z = (rng() - 0.5) * 0.3;
    g.add(m);
    return m;
}

// A rough rock mass from a subdivided box: every vertex is pushed by
// position-based noise (shared edges stay welded), with ledges from a
// y-banded offset and a jagged crown. opts.taper(zLocal01) scales height.
function ch1CliffGeo(w, h, d, seed, opts) {
    opts = opts || {};
    const sx = Math.max(2, Math.round(w / 38)), sy = Math.max(2, Math.round(h / 34)), sz = Math.max(2, Math.round(d / 38));
    const geo = new THREE.BoxGeometry(w, h, d, sx, sy, sz);
    const p = geo.attributes.position;
    const A = Math.min(opts.amp || 26, Math.min(w, d) * 0.22);
    for (let k = 0; k < p.count; k++) {
        let x = p.getX(k), y = p.getY(k), z = p.getZ(k);
        const u = (y + h / 2) / h; // 0 bottom … 1 top
        const nx = fbm3(x * 0.011 + seed, y * 0.011, z * 0.011, 3) - 0.5;
        const nz = fbm3(x * 0.011, y * 0.011 + seed, z * 0.011 + 9, 3) - 0.5;
        const ny = fbm3(x * 0.02 + 4, y * 0.02, z * 0.02 + seed, 3) - 0.5;
        const ledge = Math.sin(y * 0.07 + nx * 4) * 0.35;
        x += (nx * 2 + ledge) * A * (0.4 + u * 0.8);
        z += (nz * 2 + ledge) * A * (0.4 + u * 0.8);
        if (u > 0.99) y += ny * h * 0.35 + (fbm3(x * 0.05, 1, z * 0.05, 2) - 0.5) * 24;
        else if (u > 0.01) y += ny * A * 0.8;
        if (opts.taper) y = -h / 2 + (y + h / 2) * opts.taper(clamp01((z + d / 2) / d), clamp01((x + w / 2) / w));
        p.setXYZ(k, x, y, z);
    }
    const flat = geo.toNonIndexed();
    geo.dispose();
    flat.computeVertexNormals();
    return flat;
}

// ============================================================
// SKY
// ============================================================
const CH1_MOON_DIR = new THREE.Vector3(0.42, 0.56, -0.71).normalize(); // high in the north-east
const CH1_GLOW_DIR = new THREE.Vector3(1, 0, -0.45).normalize();       // Cairo, east-north-east
const CH1_HAZE = new THREE.Color(0x1d2334);                            // horizon / fog colour

function makeCh1Sky() {
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMoonDir: { value: CH1_MOON_DIR.clone() },
            uGlowDir: { value: CH1_GLOW_DIR.clone() },
            uHaze: { value: new THREE.Vector3(CH1_HAZE.r, CH1_HAZE.g, CH1_HAZE.b) },
        },
        vertexShader: `
            varying vec3 vDir;
            void main() {
                vDir = position;
                vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                gl_Position = p.xyww;
            }`,
        fragmentShader: `
            uniform float uTime; uniform vec3 uMoonDir; uniform vec3 uGlowDir; uniform vec3 uHaze;
            varying vec3 vDir;
            float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
            float noise(vec3 x) {
                vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
                return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                           mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
            }
            float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
            vec3 stars(vec3 d, float scale, float thresh) {
                vec3 p = d * scale; vec3 c = floor(p); vec3 f = fract(p);
                float r = hash(c);
                if (r < thresh) return vec3(0.0);
                vec3 o = vec3(hash(c + 11.1), hash(c + 23.7), hash(c + 37.3)) * 0.6 + 0.2;
                float b = (r - thresh) / (1.0 - thresh);
                float tw = 0.6 + 0.4 * sin(uTime * (1.2 + r * 5.0) + r * 91.0);
                float s = smoothstep(0.07 + 0.08 * b, 0.0, length(f - o)) * tw * (0.35 + b * 1.9);
                vec3 col = mix(vec3(0.72, 0.8, 1.0), vec3(1.0, 0.86, 0.66), hash(c + 5.0));
                return col * s;
            }
            void main() {
                vec3 d = normalize(vDir);
                float h = d.y;
                vec3 zen = vec3(0.008, 0.014, 0.036);
                vec3 mid = vec3(0.026, 0.040, 0.082);
                vec3 col = mix(uHaze, mid, smoothstep(0.0, 0.22, h));
                col = mix(col, zen, smoothstep(0.22, 0.95, h));
                col = mix(col, uHaze, smoothstep(0.0, -0.08, h));
                // Cairo's glow on the east-north-east horizon
                float g = max(0.0, dot(normalize(vec3(d.x, 0.0, d.z)), uGlowDir));
                col += vec3(0.20, 0.10, 0.045) * pow(g, 5.0) * exp(-max(h, 0.0) * 10.0);
                col += vec3(0.05, 0.035, 0.03) * pow(g, 2.0) * exp(-max(h, 0.0) * 4.0);
                // moon halo
                float md = max(0.0, dot(d, uMoonDir));
                col += vec3(0.10, 0.13, 0.20) * pow(md, 60.0) + vec3(0.035, 0.05, 0.09) * pow(md, 8.0);
                // milky way
                vec3 mwN = normalize(vec3(0.55, 0.3, 0.78));
                float band = 1.0 - abs(dot(d, mwN));
                band = pow(smoothstep(0.6, 1.0, band), 1.6);
                float mw = fbm(d * 5.0) * fbm(d * 13.0 + 3.0);
                float skyUp = smoothstep(0.02, 0.35, h);
                col += vec3(0.07, 0.075, 0.1) * band * mw * 2.2 * skyUp;
                // thin high cloud, catching moonlight
                float cl = smoothstep(0.52, 0.82, fbm(vec3(d.x * 2.2 + uTime * 0.002, d.y * 9.0, d.z * 2.2)));
                cl *= smoothstep(0.04, 0.25, h) * (1.0 - smoothstep(0.45, 0.85, h));
                vec3 cloudCol = vec3(0.07, 0.08, 0.11) + vec3(0.12, 0.13, 0.16) * pow(md, 4.0);
                // stars
                float vis = smoothstep(0.0, 0.16, h) * (1.0 - cl * 0.85) * (1.0 - pow(md, 12.0));
                vec3 st = stars(d, 170.0, 0.982) + stars(d, 420.0, 0.991) * 0.7 + band * stars(d, 700.0, 0.965) * 0.45;
                col += st * vis;
                col = mix(col, cloudCol, cl * 0.55);
                gl_FragColor = vec4(col, 1.0);
            }`,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(18000, 48, 24), mat);
    sky.renderOrder = -10;
    sky.frustumCulled = false;
    sky.userData.noShadow = true;
    return sky;
}

function makeCh1Moon() {
    const tex = makeTex('c1moon', 256, 256, 1, 1, (cc, w, h) => {
        const g = cc.createRadialGradient(118, 116, 10, 128, 128, 100);
        g.addColorStop(0, '#f6f4ea');
        g.addColorStop(0.85, '#dcdcd4');
        g.addColorStop(1, '#b8bcc4');
        cc.fillStyle = g;
        cc.beginPath(); cc.arc(128, 128, 100, 0, 7); cc.fill();
        cc.save(); cc.clip();
        // maria and craters
        for (const [x, y, r, a] of [[100, 96, 34, 0.16], [150, 120, 26, 0.14], [120, 160, 30, 0.12], [168, 170, 16, 0.12], [80, 140, 18, 0.1]]) {
            cc.fillStyle = `rgba(120,124,136,${a})`; cc.beginPath(); cc.arc(x, y, r, 0, 7); cc.fill();
        }
        for (let i = 0; i < 40; i++) {
            const x = 40 + Math.random() * 176, y = 40 + Math.random() * 176, r = 2 + Math.random() * 7;
            cc.strokeStyle = 'rgba(110,112,124,0.25)'; cc.lineWidth = 1.2; cc.beginPath(); cc.arc(x, y, r, 0, 7); cc.stroke();
        }
        cc.restore();
    });
    const halo = radialTex('c1moonHalo', [[0, 'rgba(190,210,255,0.55)'], [0.18, 'rgba(160,185,240,0.22)'], [0.5, 'rgba(120,150,220,0.06)'], [1, 'rgba(120,150,220,0)']]);
    const g = new THREE.Group();
    const disc = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, fog: false, depthWrite: false, depthTest: false, toneMapped: false }));
    disc.scale.set(620, 620, 1);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, blending: THREE.AdditiveBlending, transparent: true, fog: false, depthWrite: false, depthTest: false, toneMapped: false }));
    glow.scale.set(3800, 3800, 1);
    glow.renderOrder = -9; disc.renderOrder = -8;
    g.add(glow); g.add(disc);
    g.userData.noShadow = true;
    return g;
}

// Giza on the horizon — lit by the same moon, hazed by distance
function addCh1Horizon(group) {
    const courses = makeTex('c1courses', 64, 256, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#fff'; cc.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 4) { cc.fillStyle = `rgba(0,0,0,${0.12 + Math.random() * 0.12})`; cc.fillRect(0, y, w, 1.2); }
    });
    const mat = new THREE.MeshBasicMaterial({ map: courses, vertexColors: true, fog: false, toneMapped: false });
    const hazeC = CH1_HAZE.clone();
    const base = new THREE.Color(0x8c8272);
    const pyramid = (x, z, r, h, rot, hazeAmt) => {
        const geo = new THREE.ConeGeometry(r, h, 4, 1, true).toNonIndexed();
        geo.computeVertexNormals();
        const n = geo.attributes.normal, cols = [];
        const m4 = new THREE.Matrix4().makeRotationY(rot);
        const v = new THREE.Vector3();
        for (let i = 0; i < n.count; i++) {
            v.set(n.getX(i), n.getY(i), n.getZ(i)).applyMatrix4(m4);
            const lit = 0.1 + 0.9 * Math.max(0, v.dot(CH1_MOON_DIR));
            const c = base.clone().multiplyScalar(0.18 + lit * 0.42).lerp(hazeC, hazeAmt);
            cols.push(c.r, c.g, c.b);
        }
        geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, h / 2 - 20, z);
        m.rotation.y = rot;
        m.userData.noShadow = true;
        group.add(m);
    };
    // Khufu, Khafre (with its cap), Menkaure and the queens — north-west
    pyramid(-6200, -3400, 2700, 1800, Math.PI / 4 + 0.1, 0.42);
    pyramid(-3600, -6800, 2600, 1760, Math.PI / 4 + 0.1, 0.48);
    pyramid(-500, -9000, 1400, 900, Math.PI / 4 + 0.1, 0.55);
    for (let i = 0; i < 3; i++) pyramid(1200 + i * 700, -9600 - i * 80, 320, 220, Math.PI / 4, 0.6);

    // Distant plateau line under the pyramids
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(14000, 160, 900),
        new THREE.MeshBasicMaterial({ color: hazeC.clone().multiplyScalar(0.8), fog: false, toneMapped: false }));
    ridge.position.set(-3000, 40, -6200);
    ridge.rotation.y = 0.55;
    ridge.userData.noShadow = true;
    group.add(ridge);

    // Cairo: a low band of city lights to the east-north-east
    const pos = [], col = [];
    const rng = seededRng('cairo');
    const cx = CH1_W / 2, cz = CH1_H / 2;
    for (let i = 0; i < 900; i++) {
        const a = Math.atan2(CH1_GLOW_DIR.z, CH1_GLOW_DIR.x) + (rng() - 0.5) * 1.5 * (0.4 + rng() * 0.6);
        const r = 11000 + rng() * 3500;
        pos.push(cx + Math.cos(a) * r, rng() * rng() * 160 + 10, cz + Math.sin(a) * r);
        const warm = rng();
        const c = new THREE.Color().setHSL(0.08 + warm * 0.05, 0.7 - warm * 0.4, 0.55 + rng() * 0.3);
        col.push(c.r, c.g, c.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const lights = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 2.4, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.85, fog: false, toneMapped: false, depthWrite: false
    }));
    lights.userData.noShadow = true;
    group.add(lights);
    // one red aviation beacon out there, blinking
    const beacon = new THREE.Sprite(new THREE.SpriteMaterial({
        map: radialTex('c1glowR', [[0, 'rgba(255,90,70,1)'], [0.3, 'rgba(255,60,40,0.4)'], [1, 'rgba(255,40,20,0)']]),
        blending: THREE.AdditiveBlending, transparent: true, fog: false, depthWrite: false, toneMapped: false
    }));
    beacon.position.set(cx + CH1_GLOW_DIR.x * 12500, 700, cz + CH1_GLOW_DIR.z * 12500 + 900);
    beacon.scale.set(160, 160, 1);
    group.add(beacon);
    ch1FX.beacon = beacon;
}

// ============================================================
// GROUND MESHES
// ============================================================
function buildCh1Ground(group) {
    const M = ch1Mats();
    const PAD = 700;
    const W = CH1_W + PAD * 2, H = CH1_H + PAD * 2;
    const SEG = 24;
    const geo = new THREE.PlaneGeometry(W, H, Math.round(W / SEG), Math.round(H / SEG));
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    const cols = new Float32Array(pos.count * 3);
    const mix = new Float32Array(pos.count * 2);
    const c = new THREE.Color();
    const sandA = new THREE.Color(0xf2e6d0), sandB = new THREE.Color(0xc9b392), sandC = new THREE.Color(0xe8d2ae);
    const trod = new THREE.Color(0xb09a80), rut = new THREE.Color(0x8a7a66), road = new THREE.Color(0xa89478);
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) + CH1_W / 2, z = pos.getZ(i) + CH1_H / 2;
        const y = ch1Height(x, z);
        pos.setY(i, y);
        uv.setXY(i, x / 260, z / 260);
        // colour: large-scale mottling, lighter crests, darker hollows
        const n = fbm3(x * 0.0022, z * 0.0022, 0.7, 4);
        c.copy(sandB).lerp(sandA, n);
        const crest = ch1HeightBase(x, z) - ch1HeightBase(x + 60, z + 40);
        c.lerp(sandC, clamp01(crest * 0.05 + 0.3) * 0.5);
        // trodden paths and tyre ruts
        const [pm, kind] = ch1PathMask(x, z);
        if (pm > 0) c.lerp(kind === 2 ? rut : kind === 1 ? road : trod, Math.min(1, pm) * (kind === 2 ? 0.55 : 0.5));
        // near the lamps and the camp the sand is churned darker
        cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
        // rock where the escarpment rises; dirt inside the trench
        const rockAmt = smooth(CH1_CLIFF_Z + 40, CH1_CLIFF_Z - 90, z + (vnoise3(x * 0.01, 2, 2) - 0.5) * 80);
        mix[i * 2] = rockAmt;
        mix[i * 2 + 1] = clamp01(ch1TrenchDip(x, z) / 14);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    geo.setAttribute('aMix', new THREE.BufferAttribute(mix, 2));
    geo.computeVertexNormals();
    const ground = new THREE.Mesh(geo, M.ground);
    ground.position.set(CH1_W / 2, 0, CH1_H / 2);
    ground.receiveShadow = true;
    ground.userData.noCast = true;
    group.add(ground);

    // Far desert: coarse ring out to the horizon, tucked under the near mesh
    const FAR = 32000;
    const fgeo = new THREE.PlaneGeometry(FAR, FAR, 128, 128);
    fgeo.rotateX(-Math.PI / 2);
    const fp = fgeo.attributes.position, fuv = fgeo.attributes.uv;
    const fcols = new Float32Array(fp.count * 3), fmix = new Float32Array(fp.count * 2);
    for (let i = 0; i < fp.count; i++) {
        const x = fp.getX(i) + CH1_W / 2, z = fp.getZ(i) + CH1_H / 2;
        const inside = x > -PAD + 40 && x < CH1_W + PAD - 40 && z > -PAD + 40 && z < CH1_H + PAD - 40;
        let y = ch1HeightBase(x, z);
        if (inside) y -= 60;
        // the far dunes swell into proper ridges
        const far = Math.max(0, Math.hypot(x - CH1_W / 2, z - CH1_H / 2) - 3200);
        y += smooth(0, 5000, far) * (120 + 160 * fbm3(x * 0.0004, z * 0.0004, 5, 3));
        fp.setY(i, y);
        fuv.setXY(i, x / 260, z / 260);
        c.copy(sandB).lerp(sandA, fbm3(x * 0.0015, z * 0.0015, 0.7, 3));
        fcols[i * 3] = c.r; fcols[i * 3 + 1] = c.g; fcols[i * 3 + 2] = c.b;
        fmix[i * 2] = smooth(CH1_CLIFF_Z + 40, CH1_CLIFF_Z - 90, z);
    }
    fgeo.setAttribute('color', new THREE.BufferAttribute(fcols, 3));
    fgeo.setAttribute('aMix', new THREE.BufferAttribute(fmix, 2));
    fgeo.computeVertexNormals();
    const farMesh = new THREE.Mesh(fgeo, M.ground);
    farMesh.position.set(CH1_W / 2, 0, CH1_H / 2);
    farMesh.userData.noCast = true;
    group.add(farMesh);
}

// The north escarpment — a continuous rock face the whole width of the
// site and beyond, with a rubble apron at its foot
function buildCh1Escarpment(group) {
    const M = ch1Mats();
    const rng = seededRng('escarpment');
    const segW = 620;
    for (let x = -1600; x < CH1_W + 1600; x += segW - 60) {
        const h = 220 + rng() * 90;
        const d = 260 + rng() * 120;
        const geo = ch1CliffGeo(segW, h, d, rng() * 50, { amp: 34 });
        const m = new THREE.Mesh(geo, M.cliff);
        const zc = CH1_CLIFF_Z - d / 2 - 10 + (rng() - 0.5) * 40;
        m.position.set(x + segW / 2, ch1HeightBase(x + segW / 2, CH1_CLIFF_Z + 30) + h / 2 - 30, zc);
        m.rotation.y = (rng() - 0.5) * 0.12;
        group.add(m);
    }
    // talus of fallen boulders along the foot (over the rubble wall)
    for (let x = 60; x < CH1_W - 60; x += 38 + rng() * 60) {
        const z = CH1_CLIFF_Z + 5 + rng() * 34;
        ch1AddRock(group, x, ch1Height(x, z), z, 14 + rng() * 26, rng, rng() < 0.3 ? M.rockDark : M.rock);
    }
}

// ============================================================
// LIGHTS, GLOWS & FX
// ============================================================
const ch1FX = {
    sky: null, moon: null, sun: null, beacon: null,
    glows: [],      // { sprite, base, phase, steady }
    fires: [],      // { flames: [sprite], x, y, z, light }
    embers: null,   // { points, data }
    smoke: [],      // { sprite, x, y, z, age, life }
    dust: null,     // { points, box }
    moths: [],      // { points, cx, cy, cz, n }
    sway: [],       // { obj, amp, speed, phase, axis }
    active: false,
};

function ch1GlowSprite(x, y, z, size, color, strength) {
    const tex = radialTex('c1glow', [[0, 'rgba(255,255,255,1)'], [0.12, 'rgba(255,255,255,0.55)'], [0.4, 'rgba(255,255,255,0.12)'], [1, 'rgba(255,255,255,0)']]);
    const mat = new THREE.SpriteMaterial({ map: tex, color: new THREE.Color(color || 0xffb060), blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false, toneMapped: false, opacity: strength == null ? 0.8 : strength });
    const s = new THREE.Sprite(mat);
    s.position.set(x, y, z);
    s.scale.set(size, size, 1);
    s.userData.noShadow = true;
    return s;
}

// A warm lamp: point light + halo, registered for flicker
function ch1Lamp(group, x, y, z, opts) {
    opts = opts || {};
    const color = opts.color || 0xffa850;
    if (opts.light !== false) {
        const light = new THREE.PointLight(color, opts.intensity || 1.5, opts.dist || 560, 2);
        light.position.set(x, y, z);
        group.add(light);
        flickerLights.push({ light, base: light.intensity, phase: Math.random() * 10, steady: !!opts.steady });
    }
    const glow = ch1GlowSprite(x, y, z, opts.glow || 60, color, opts.glowStrength);
    group.add(glow);
    ch1FX.glows.push({ sprite: glow, base: glow.material.opacity, phase: Math.random() * 10, steady: !!opts.steady });
    return glow;
}

function ch1AddFire(group, x, y, z, scale) {
    const M = ch1Mats();
    const fire = { flames: [], x, y, z, scale };
    for (let i = 0; i < 5; i++) {
        const s = new THREE.Sprite(M.flame);
        s.userData = { ox: (Math.random() - 0.5) * 8 * scale, oz: (Math.random() - 0.5) * 8 * scale, ph: Math.random() * 10, w: (10 + Math.random() * 8) * scale, h: (22 + Math.random() * 14) * scale, noShadow: true };
        s.position.set(x + s.userData.ox, y, z + s.userData.oz);
        group.add(s);
        fire.flames.push(s);
    }
    const light = new THREE.PointLight(0xff8a3a, 2.2, 620, 2);
    light.position.set(x, y + 22 * scale, z);
    group.add(light);
    flickerLights.push({ light, base: 2.2, phase: Math.random() * 10, steady: false });
    const glow = ch1GlowSprite(x, y + 12 * scale, z, 150 * scale, 0xff9a40, 0.55);
    group.add(glow);
    ch1FX.glows.push({ sprite: glow, base: 0.55, phase: Math.random() * 10, steady: false });
    ch1FX.fires.push(fire);

    // embers riding the heat
    const N = 46;
    const geo = new THREE.BufferGeometry();
    const p = new Float32Array(N * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({
        map: radialTex('c1spark', [[0, 'rgba(255,230,160,1)'], [0.3, 'rgba(255,140,40,0.8)'], [1, 'rgba(255,80,0,0)']]),
        size: 5 * scale, color: 0xffb060, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false
    }));
    pts.frustumCulled = false;
    pts.userData.noShadow = true;
    const data = [];
    for (let i = 0; i < N; i++) data.push({ age: Math.random() * 3, life: 1.5 + Math.random() * 2, vx: 0, vy: 0, vz: 0, x, y, z });
    group.add(pts);
    ch1FX.embers = { points: pts, data, x, y: y + 6 * scale, z };

    // a lazy column of smoke
    const smokeTex = radialTex('c1smoke', [[0, 'rgba(200,200,205,0.5)'], [0.5, 'rgba(160,160,170,0.2)'], [1, 'rgba(140,140,150,0)']]);
    for (let i = 0; i < 7; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, color: 0x6a6a74, transparent: true, depthWrite: false, opacity: 0 }));
        s.userData = { age: i / 7 * 6, life: 6, noShadow: true };
        group.add(s);
        ch1FX.smoke.push({ sprite: s, x, y: y + 30 * scale, z });
    }
}

function ch1AddMoths(group, x, y, z) {
    const n = 7;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xe8dcc0, size: 2.2, transparent: true, opacity: 0.9, depthWrite: false }));
    pts.frustumCulled = false;
    pts.userData.noShadow = true;
    group.add(pts);
    ch1FX.moths.push({ points: pts, cx: x, cy: y, cz: z, n, seed: Math.random() * 100 });
}

function ch1AddDust(group) {
    const N = 420;
    const geo = new THREE.BufferGeometry();
    const p = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { p[i * 3] = Math.random() * 1600; p[i * 3 + 1] = Math.random() * 70; p[i * 3 + 2] = Math.random() * 1600; }
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({
        map: radialTex('c1dust', [[0, 'rgba(255,255,255,0.9)'], [1, 'rgba(255,255,255,0)']]),
        color: 0xcbb896, size: 2.6, transparent: true, opacity: 0.45, depthWrite: false
    }));
    pts.frustumCulled = false;
    pts.userData.noShadow = true;
    group.add(pts);
    ch1FX.dust = { points: pts, local: p.slice(), N };
}

// ============================================================
// SCATTER (instanced — pebbles, grass, shrubs, shards)
// ============================================================
function addCh1Scatter(group) {
    const M = ch1Mats();
    const rng = seededRng('ch1-scatter-v2');
    const walls = mapWalls[1] || [];
    const blocked = (x, z, pad) =>
        walls.some(w => x > w.x - pad && x < w.x + w.w + pad && z > w.y - pad && z < w.y + w.h + pad) ||
        (activeMapObjects || []).some(o => x > o.x - pad && x < o.x + o.w + pad && z > o.y - pad && z < o.y + o.h + pad);

    const pick = (pad, allowPath) => {
        for (let t = 0; t < 30; t++) {
            const x = -500 + rng() * (CH1_W + 1000), z = CH1_CLIFF_Z + 10 + rng() * (CH1_H + 500 - CH1_CLIFF_Z);
            if (x > -10 && x < CH1_W + 10 && z < CH1_H + 10 && blocked(x, z, pad)) continue;
            if (ch1TrenchDip(x, z) > 1) continue;
            if (!allowPath && ch1PathMask(x, z)[0] > 0.3) continue;
            return [x, z];
        }
        return null;
    };
    const dummy = new THREE.Object3D();
    const instanced = (geo, mat, count, place) => {
        const im = new THREE.InstancedMesh(geo, mat, count);
        let n = 0;
        for (let i = 0; i < count; i++) if (place(dummy, i)) { dummy.updateMatrix(); im.setMatrixAt(n++, dummy.matrix); }
        im.count = n;
        im.instanceMatrix.needsUpdate = true;
        group.add(im);
        return im;
    };

    // pebbles and stones
    for (let v = 0; v < 3; v++) {
        instanced(ch1RockGeo(v * 3 + 1), v === 2 ? M.rockDark : M.rock, 170, (d) => {
            const at = pick(10, true); if (!at) return false;
            const s = 2.5 + rng() * rng() * 11;
            d.position.set(at[0], ch1Height(at[0], at[1]) - s * 0.2, at[1]);
            d.scale.set(s, s * (0.5 + rng() * 0.5), s);
            d.rotation.set(0, rng() * 7, 0);
            return true;
        }).userData.noCast = true;
    }
    // bigger stones out in the open (cast shadows)
    instanced(ch1RockGeo(4), M.rock, 60, (d) => {
        const at = pick(40, false); if (!at) return false;
        const s = 12 + rng() * 22;
        d.position.set(at[0], ch1Height(at[0], at[1]) - s * 0.25, at[1]);
        d.scale.set(s, s * (0.55 + rng() * 0.4), s * (0.8 + rng() * 0.4));
        d.rotation.set(0, rng() * 7, (rng() - 0.5) * 0.2);
        return true;
    });
    // dry grass tufts (crossed quads)
    const tuft = new THREE.PlaneGeometry(26, 22);
    tuft.translate(0, 11, 0);
    const tuftX = tuft.clone().rotateY(Math.PI / 2);
    for (const g of [tuft, tuftX]) {
        const r2 = seededRng('tufts');
        instanced(g, M.grass, 320, (d) => {
            const x = -300 + r2() * (CH1_W + 600), z = CH1_CLIFF_Z + 40 + r2() * (CH1_H + 300 - CH1_CLIFF_Z);
            if (x > -10 && x < CH1_W + 10 && z < CH1_H + 10 && blocked(x, z, 14)) return false;
            if (ch1PathMask(x, z)[0] > 0.2 || ch1TrenchDip(x, z) > 1) return false;
            const s = 0.6 + r2() * 0.9;
            d.position.set(x, ch1Height(x, z) - 1, z);
            d.scale.set(s, s * (0.7 + r2() * 0.6), s);
            d.rotation.set(0, r2() * 7, 0);
            return true;
        }).userData.noCast = true;
    }
    // camel-thorn shrubs
    const bush = new THREE.PlaneGeometry(48, 40);
    bush.translate(0, 18, 0);
    for (const g of [bush, bush.clone().rotateY(Math.PI / 2)]) {
        const r2 = seededRng('shrubs');
        instanced(g, M.shrub, 90, (d) => {
            const x = -300 + r2() * (CH1_W + 600), z = CH1_CLIFF_Z + 60 + r2() * (CH1_H + 300 - CH1_CLIFF_Z);
            if (x > -10 && x < CH1_W + 10 && z < CH1_H + 10 && blocked(x, z, 30)) return false;
            if (ch1PathMask(x, z)[0] > 0.1 || ch1TrenchDip(x, z) > 1) return false;
            const s = 0.6 + r2() * 0.8;
            d.position.set(x, ch1Height(x, z) - 2, z);
            d.scale.set(s, s, s);
            d.rotation.set(0, r2() * 7, 0);
            return true;
        });
    }
    // pottery shards — the ground remembers older camps
    instanced(gBox(7, 1.4, 5), M.terracotta, 70, (d) => {
        const at = pick(12, true); if (!at) return false;
        d.position.set(at[0], ch1Height(at[0], at[1]) + 0.5, at[1]);
        d.rotation.set((rng() - 0.5) * 0.4, rng() * 7, (rng() - 0.5) * 0.4);
        d.scale.setScalar(0.7 + rng() * 0.8);
        return true;
    }).userData.noCast = true;
}

// ============================================================
// ENVIRONMENT ENTRY POINT (called from engine3d.js buildWorld)
// ============================================================
function buildCh1Environment(group, scene) {
    ch1FX.glows = []; ch1FX.fires = []; ch1FX.smoke = []; ch1FX.moths = []; ch1FX.sway = [];
    ch1FX.embers = null; ch1FX.dust = null; ch1FX.beacon = null;
    ch1FX.active = true;
    ch1Rects = null;

    scene.background = CH1_HAZE.clone();
    fogBase = [700, 6400];
    scene.fog = new THREE.Fog(CH1_HAZE.clone(), fogBase[0], fogBase[1]);

    ch1FX.sky = makeCh1Sky();
    group.add(ch1FX.sky);
    ch1FX.moon = makeCh1Moon();
    group.add(ch1FX.moon);
    addCh1Horizon(group);

    buildCh1Ground(group);
    buildCh1Escarpment(group);

    // Moonlight: cool, from the north-east, casting soft shadows that
    // follow the player (the shadow camera re-centres every frame)
    group.add(new THREE.HemisphereLight(0x4a5c8a, 0x2a2218, 0.42));
    const sun = new THREE.DirectionalLight(0x9fb6e6, 0.62);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -1100; sc.right = 1100; sc.top = 1100; sc.bottom = -1100;
    sc.near = 100; sc.far = 5200;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 1.2;
    sun.shadow.radius = 3;
    group.add(sun);
    group.add(sun.target);
    ch1FX.sun = sun;

    ch1AddDust(group);
    addCh1Scatter(group);
}

// Walls: every Ch1 collision rect gets a look (or is intentionally
// invisible because a prop/terrain already shows it)
function buildCh1Walls(group) {
    const walls = mapWalls[1] || [];
    const objectRects = new Set((activeMapObjects || []).map(o => `${o.x},${o.y},${o.w},${o.h}`));
    for (const wall of walls) {
        if (wall.isGate) {
            const g = ch1BuildGate(wall);
            group.add(g);
            gateMeshes.push({ mesh: g, gateFlag: wall.gateFlag });
            continue;
        }
        if (objectRects.has(`${wall.x},${wall.y},${wall.w},${wall.h}`)) continue;
        // duplicates fully inside another (longer) wall
        if (walls.some(o => o !== wall && !o.isGate && o.w * o.h > wall.w * wall.h &&
            wall.x >= o.x - 1 && wall.x + wall.w <= o.x + o.w + 1 && wall.y >= o.y - 9 && wall.y + wall.h <= o.y + o.h + 9)) continue;
        if (ch1WallInsideObject(wall)) continue;
        ch1BuildWall(group, wall);
    }
}

// Walls mostly covered by a prop's footprint are part of that prop
// (building shells, the cooking table, gear storage, the generator…).
// Thin door-flank segments hugging an enterable building also vanish —
// the building model is the visual; the collision stays.
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

// Shadows: everything casts and receives unless flagged otherwise
function ch1ApplyShadows(root) {
    root.traverse(o => {
        if (!o.isMesh || o.userData.noShadow) return;
        let p = o, skip = false;
        while (p) { if (p.userData && p.userData.noShadow) { skip = true; break; } p = p.parent; }
        if (skip) return;
        o.receiveShadow = true;
        if (!o.userData.noCast) o.castShadow = true;
    });
}

// ============================================================
// PER-FRAME
// ============================================================
function updateCh1FX(focusX, focusZ) {
    if (!ch1FX.active) return;
    const t = performance.now() / 1000;
    const dt = Math.min(0.05, t - (ch1FX.lastT || t));
    ch1FX.lastT = t;

    // sky + moon ride with the camera (infinitely far away)
    if (ch1FX.sky) {
        ch1FX.sky.position.copy(cam3.position);
        ch1FX.sky.material.uniforms.uTime.value = t;
    }
    if (ch1FX.moon) ch1FX.moon.position.copy(cam3.position).addScaledVector(CH1_MOON_DIR, 14000);
    if (ch1FX.beacon) ch1FX.beacon.material.opacity = (t % 2.2) < 0.25 ? 1 : 0.08;

    // shadow camera follows the focus, snapped to texels (no shimmer)
    if (ch1FX.sun) {
        const texel = 2200 / 2048;
        const fx = Math.round(focusX / texel) * texel, fz = Math.round(focusZ / texel) * texel;
        const fy = ch1Height(focusX, focusZ);
        ch1FX.sun.target.position.set(fx, fy, fz);
        ch1FX.sun.position.set(fx + CH1_MOON_DIR.x * 2600, fy + CH1_MOON_DIR.y * 2600, fz + CH1_MOON_DIR.z * 2600);
        ch1FX.sun.target.updateMatrixWorld();
    }

    // lamp halos breathe with their lights
    for (const g of ch1FX.glows) {
        if (g.steady) continue;
        g.sprite.material.opacity = g.base * (0.85 + 0.1 * Math.sin(t * 9 + g.phase) + 0.05 * Math.sin(t * 23 + g.phase));
    }

    // fire
    for (const f of ch1FX.fires) {
        for (const s of f.flames) {
            const u = s.userData;
            const k = 0.75 + 0.25 * Math.sin(t * 13 + u.ph) + 0.12 * Math.sin(t * 29 + u.ph * 2);
            s.scale.set(u.w * (0.85 + 0.15 * Math.sin(t * 11 + u.ph)), u.h * k, 1);
            s.position.set(f.x + u.ox + Math.sin(t * 7 + u.ph) * 1.5, f.y + u.h * k * 0.42, f.z + u.oz);
        }
    }
    if (ch1FX.embers) {
        const E = ch1FX.embers, p = E.points.geometry.attributes.position;
        for (let i = 0; i < E.data.length; i++) {
            const e = E.data[i];
            e.age += dt;
            if (e.age > e.life) {
                e.age = 0; e.life = 0.8 + Math.random() * 1.6;
                e.x = E.x + (Math.random() - 0.5) * 16; e.y = E.y; e.z = E.z + (Math.random() - 0.5) * 16;
                e.vx = (Math.random() - 0.5) * 14; e.vy = 12 + Math.random() * 18; e.vz = (Math.random() - 0.5) * 14;
            }
            e.vx += (Math.random() - 0.5) * 60 * dt + 6 * dt; e.vz += (Math.random() - 0.5) * 60 * dt;
            e.x += e.vx * dt; e.y += e.vy * dt; e.z += e.vz * dt;
            const alive = e.age / e.life;
            p.setXYZ(i, e.x, alive > 0.92 ? -9999 : e.y, e.z);
        }
        p.needsUpdate = true;
    }
    for (const s of ch1FX.smoke) {
        const u = s.sprite.userData;
        u.age = (u.age + dt) % u.life;
        const k = u.age / u.life;
        s.sprite.position.set(s.x + k * 60 + Math.sin(t * 0.5 + u.life) * 6, s.y + k * 170, s.z + k * 20);
        const sz = 30 + k * 110;
        s.sprite.scale.set(sz, sz, 1);
        s.sprite.material.opacity = Math.sin(k * Math.PI) * 0.22;
    }

    // moths orbiting lamps
    for (const m of ch1FX.moths) {
        const p = m.points.geometry.attributes.position;
        for (let i = 0; i < m.n; i++) {
            const a = t * (1.6 + i * 0.37) + m.seed + i * 2.1;
            const r = 9 + 6 * Math.sin(t * 2.3 + i);
            p.setXYZ(i, m.cx + Math.cos(a) * r, m.cy + Math.sin(a * 1.7) * 6, m.cz + Math.sin(a) * r);
        }
        p.needsUpdate = true;
    }

    // drifting sand in a box around the focus, blown east-south-east
    if (ch1FX.dust) {
        const D = ch1FX.dust, p = D.points.geometry.attributes.position, L = D.local;
        const box = 1600;
        for (let i = 0; i < D.N; i++) {
            L[i * 3] = (L[i * 3] + dt * (38 + (i % 7) * 6)) % box;
            L[i * 3 + 2] = (L[i * 3 + 2] + dt * (12 + (i % 5) * 3)) % box;
            L[i * 3 + 1] = (L[i * 3 + 1] + dt * (Math.sin(t * 0.7 + i) * 4)) ;
            if (L[i * 3 + 1] < 0) L[i * 3 + 1] += 70; else if (L[i * 3 + 1] > 70) L[i * 3 + 1] -= 70;
            const x = focusX - box / 2 + ((L[i * 3] - focusX % box + box * 2) % box);
            const z = focusZ - box / 2 + ((L[i * 3 + 2] - focusZ % box + box * 2) % box);
            p.setXYZ(i, x, ch1Height(x, z) + 2 + L[i * 3 + 1], z);
        }
        p.needsUpdate = true;
    }

    // palms and pennants sway
    for (const s of ch1FX.sway) {
        const v = Math.sin(t * s.speed + s.phase) * s.amp + Math.sin(t * s.speed * 2.3 + s.phase) * s.amp * 0.3;
        (s.scale ? s.obj.scale : s.obj.rotation)[s.axis] = s.base + v;
    }
}

function ch1Deactivate() { ch1FX.active = false; }
