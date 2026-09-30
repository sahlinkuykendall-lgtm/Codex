// ============================================================
// THE CODEX OF GIZA — POKE STYLE: PIXEL ART TOOLKIT + GROUND (poke/art.js)
// Everything on screen is drawn here in code, pixel by pixel, on a 32-px
// tile scale in the DS three-quarter view (you see the tops of things and
// their south faces). No image files.
//   - PAL: the palette
//   - pa(): drawing helpers that never anti-alias (rects, lines, ellipses,
//     polygons, dither), and outline() which rings a sprite in a dark line
//   - Ground: paints the terrain from the exported grid in 256-px chunks,
//     on demand: dune shading, roads, rock, the wadi, the trench, the rails
// ============================================================

const TILE = 32;
const PAL = {
    line: '#3a2a1c',          // the outline around everything
    // sand, lightest to darkest (dunes are shaded by which way they face)
    sand: ['#f6e6b4', '#ecd698', '#dfc27e', '#cca964', '#b38d50'],
    road: ['#e2c896', '#d2b47e', '#b99763'],
    rock: ['#d8c4a0', '#bca47e', '#9a8060', '#766046', '#574632'],
    gravel: ['#cdbf9f', '#b3a484', '#93856a'],
    dirt: ['#8a6a48', '#6f5236', '#523a26', '#3a2819'],
    water: ['#9adcf2', '#5fb8e6', '#3c8fd0', '#2a6cb0'],
    wood: ['#c89058', '#a86c3c', '#804c28', '#5c3418'],
    plank: ['#d8a868', '#b88448', '#946230'],
    canvas: ['#f2e8c4', '#dccfa0', '#bfae7c', '#9a885c'],
    khaki: ['#b8b078', '#98905c', '#787044', '#585230'],
    plaster: ['#f6ecd2', '#e2d2ac', '#c4b088', '#a08c68'],
    white: ['#ffffff', '#e8eaf0', '#c4c8d4', '#9aa0b0'],
    metal: ['#c8d4dc', '#9cacb8', '#748490', '#4c5a66'],
    dark: ['#5a5048', '#443c36', '#2e2824', '#1c1814'],
    blue: ['#78a8e8', '#4878c8', '#3058a0', '#203c74'],
    red: ['#f07860', '#d04838', '#a03028', '#70201c'],
    green: ['#8cd060', '#58a848', '#388030', '#205820'],
    olive: ['#8a9458', '#6a7440', '#4c5630', '#343c20'],
    gold: ['#ffe890', '#f0c040', '#c89020', '#8c6010'],
    fire: ['#fff4b0', '#ffc840', '#f08020', '#c03010'],
    brick: ['#d8b088', '#c09468', '#a07850', '#7c5a3c'],
    skin: ['#f0c8a0', '#d8a878', '#b88458', '#8c6040'],
};

function mk(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0);
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    return [c, g];
}

// Pixel-exact drawing on a 2D context (no anti-aliasing anywhere)
function pa(g) {
    const A = {
        g,
        r(x, y, w, h, c) { if (w > 0 && h > 0) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); } return A; },
        px(x, y, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, 1, 1); return A; },
        hl(x, y, n, c) { return A.r(x, y, n, 1, c); },
        vl(x, y, n, c) { return A.r(x, y, 1, n, c); },
        line(x0, y0, x1, y1, c) {
            x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
            const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
            let e = dx + dy;
            g.fillStyle = c;
            for (;;) {
                g.fillRect(x0, y0, 1, 1);
                if (x0 === x1 && y0 === y1) break;
                const e2 = 2 * e;
                if (e2 >= dy) { e += dy; x0 += sx; }
                if (e2 <= dx) { e += dx; y0 += sy; }
            }
            return A;
        },
        // filled ellipse, centre and radii in pixels
        ell(cx, cy, rx, ry, c) {
            g.fillStyle = c;
            for (let y = -ry; y <= ry; y++) {
                const k = ry ? 1 - (y * y) / ((ry + 0.5) * (ry + 0.5)) : 1;
                if (k < 0) continue;
                const hw = Math.round((rx + 0.5) * Math.sqrt(k) - 0.5);
                g.fillRect(Math.round(cx - hw), Math.round(cy + y), hw * 2 + 1, 1);
            }
            return A;
        },
        // filled polygon (scanline, even-odd)
        poly(pts, c) {
            g.fillStyle = c;
            let y0 = Infinity, y1 = -Infinity;
            for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
            for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
                const xs = [], yy = y + 0.5;
                for (let i = 0; i < pts.length; i++) {
                    const a = pts[i], b = pts[(i + 1) % pts.length];
                    if ((a[1] <= yy && b[1] > yy) || (b[1] <= yy && a[1] > yy)) xs.push(a[0] + (yy - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
                }
                xs.sort((p, q) => p - q);
                for (let i = 0; i + 1 < xs.length; i += 2) { const xa = Math.round(xs[i]), xb = Math.round(xs[i + 1]); if (xb > xa) g.fillRect(xa, y, xb - xa, 1); }
            }
            return A;
        },
        // checkerboard dither of colour c over a rect (mixes two tones)
        dith(x, y, w, h, c, phase) {
            g.fillStyle = c;
            for (let j = 0; j < h; j++) for (let i = (j + (phase || 0)) & 1; i < w; i += 2) g.fillRect((x | 0) + i, (y | 0) + j, 1, 1);
            return A;
        },
    };
    return A;
}

// Ring every opaque shape in a 1-px dark line (the DS look). The canvas
// needs a 1-px empty margin. Returns the same canvas.
function outline(c, col) {
    const g = c.getContext('2d'), w = c.width, h = c.height;
    const d = g.getImageData(0, 0, w, h), a = d.data;
    const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && a[(y * w + x) * 4 + 3] > 0;
    const edge = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (solid(x, y)) continue;
        if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) edge.push(x, y);
    }
    g.fillStyle = col || PAL.line;
    for (let i = 0; i < edge.length; i += 2) g.fillRect(edge[i], edge[i + 1], 1, 1);
    return c;
}

// A steady random number from integers (same place → same value)
function hash2(x, y) {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = (h ^ (h >>> 13)) * 1274126177 | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function rng(seed) {
    let s = 0;
    for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) | 0;
    return () => { s = (s * 1664525 + 1013904223) | 0; return ((s >>> 8) & 0xffffff) / 0x1000000; };
}
// smooth value noise, one octave, cells of `s` pixels
function vnoise(x, y, s) {
    const fx = x / s, fy = y / s, ix = Math.floor(fx), iy = Math.floor(fy);
    let tx = fx - ix, ty = fy - iy;
    tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
    const a = hash2(ix, iy), b = hash2(ix + 1, iy), c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];

// ============================================================
// GROUND
// ============================================================
const Ground = {
    CH: 256,
    chunks: new Map(),
    init(M) {
        this.M = M;
        this.S = TILE / M.TILE_U;                       // world units → pixels
        this.pw = Math.ceil(M.W * this.S); this.ph = Math.ceil(M.H * this.S);
        const G = M.grid, n = M.gw * M.gh;
        const bits = (s) => { const a = new Float32Array(n); for (let i = 0; i < n; i++) a[i] = s.charCodeAt(i) - 48; return a; };
        this.hgt = Float32Array.from(G.hgt);
        // how much each tile faces the light (upper left), and how steep it is
        this.lit = new Float32Array(n); this.steep = new Float32Array(n);
        const H = (i, j) => this.hgt[Math.max(0, Math.min(M.gh - 1, j)) * M.gw + Math.max(0, Math.min(M.gw - 1, i))];
        for (let j = 0; j < M.gh; j++) for (let i = 0; i < M.gw; i++) {
            const sx = (H(i + 1, j) - H(i - 1, j)) / (2 * M.TILE_U), sy = (H(i, j + 1) - H(i, j - 1)) / (2 * M.TILE_U);
            this.lit[j * M.gw + i] = -1.5 * (sx * 0.7 + sy * 0.9); this.steep[j * M.gw + i] = 1.5 * Math.hypot(sx, sy);
        }
        this.path = bits(G.path); for (let i = 0; i < n; i++) this.path[i] = this.path[i] ? 1 : 0;
        this.rock = bits(G.rock); this.wadi = bits(G.wadi); this.dip = bits(G.dip); this.out = bits(G.out);
        // rails, in pixels
        const S = this.S;
        this.rails = [M.rail, M.railLoop].map(line => line.map(p => [p[0] * S, p[1] * S]));
        // the pond (an ellipse inside its wall rect)
        const pond = M.walls.find(w => w.k === 'pond');
        this.pond = pond ? { cx: (pond.x + pond.w / 2) * S, cy: (pond.y + pond.h / 2) * S, rx: pond.w / 2 * S + 10, ry: pond.h / 2 * S + 8 } : null;
        // the north escarpment: a cliff face right across the back of the dig zone
        const cb = M.walls.find(w => w.k === 'cliffBase');
        this.cliff = cb ? { x0: cb.x * S, x1: (cb.x + cb.w) * S, y0: cb.y * S - 40, y1: (cb.y + cb.h) * S } : null;
        // roads and worn paths: the real lines, in pixels
        this.roads = (M.roads || []).map(r => ({ x1: r[0] * S, y1: r[1] * S, x2: r[2] * S, y2: r[3] * S, hw: Math.max(7, r[4] * S), kind: r[5] }));
        this.cols = {};
        for (const k of ['sand', 'road', 'rock', 'gravel', 'dirt', 'water']) this.cols[k] = PAL[k].map(hex);
    },
    // bilinear sample of a grid at pixel (x, y); cells are centred on tiles
    samp(a, x, y) {
        const M = this.M, fx = x / TILE - 0.5, fy = y / TILE - 0.5;
        let ix = Math.floor(fx), iy = Math.floor(fy);
        const tx = fx - ix, ty = fy - iy;
        const cx = (v) => v < 0 ? 0 : v >= M.gw ? M.gw - 1 : v, cy = (v) => v < 0 ? 0 : v >= M.gh ? M.gh - 1 : v;
        const x0 = cx(ix), x1 = cx(ix + 1), y0 = cy(iy) * M.gw, y1 = cy(iy + 1) * M.gw;
        const p = a[y0 + x0], q = a[y0 + x1], r = a[y1 + x0], s = a[y1 + x1];
        return p + (q - p) * tx + (r - p) * ty + (p - q - r + s) * tx * ty;
    },
    // distance from a pixel to the rail lines, and how far along (for sleepers)
    railAt(x, y) {
        let best = 1e9, along = 0;
        for (const line of this.rails) {
            let run = 0;
            for (let i = 0; i + 1 < line.length; i++) {
                const a = line[i], b = line[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
                let t = ((x - a[0]) * dx + (y - a[1]) * dy) / len2;
                t = t < 0 ? 0 : t > 1 ? 1 : t;
                const d = Math.hypot(x - (a[0] + dx * t), y - (a[1] + dy * t));
                if (d < best) { best = d; along = run + Math.sqrt(len2) * t; }
                run += Math.sqrt(len2);
            }
        }
        return [best, along];
    },
    roadsNear(x0, y0, x1, y1) {
        return this.roads.filter(r => !(Math.max(r.x1, r.x2) < x0 - r.hw * 1.3 || Math.min(r.x1, r.x2) > x1 + r.hw * 1.3 || Math.max(r.y1, r.y2) < y0 - r.hw * 1.3 || Math.min(r.y1, r.y2) > y1 + r.hw * 1.3));
    },
    roadAt(list, x, y) {
        let best = 0;
        for (const r of list) {
            const dx = r.x2 - r.x1, dy = r.y2 - r.y1;
            let t = ((x - r.x1) * dx + (y - r.y1) * dy) / (dx * dx + dy * dy || 1);
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(x - (r.x1 + dx * t), y - (r.y1 + dy * t)), m = 1 - (d - r.hw * 0.55) / (r.hw * 0.5);
            if (m > best) best = m;
        }
        return best > 1 ? 1 : best;
    },
    railNear(x0, y0, x1, y1) {
        for (const line of this.rails) for (let i = 0; i + 1 < line.length; i++) {
            const a = line[i], b = line[i + 1];
            if (Math.max(a[0], b[0]) < x0 - 12 || Math.min(a[0], b[0]) > x1 + 12 || Math.max(a[1], b[1]) < y0 - 12 || Math.min(a[1], b[1]) > y1 + 12) continue;
            return true;
        }
        return false;
    },
    // Paint one 256-px chunk of ground
    paint(cx, cy) {
        const CH = this.CH, [c, g] = mk(CH, CH);
        const img = g.createImageData(CH, CH), d = img.data;
        const X0 = cx * CH, Y0 = cy * CH, C = this.cols;
        const rails = this.railNear(X0, Y0, X0 + CH, Y0 + CH), roads = this.roadsNear(X0, Y0, X0 + CH, Y0 + CH);
        const P = this.pond, K = this.cliff;
        for (let j = 0; j < CH; j++) for (let i = 0; i < CH; i++) {
            const x = X0 + i, y = Y0 + j, o = (j * CH + i) * 4;
            const by = BAYER[(x & 3) + (y & 3) * 4];
            const n1 = vnoise(x, y, 9), n2 = vnoise(x + 900, y - 300, 40);
            const edge = (n1 - 0.5) * 0.32;                      // wobble on every boundary
            // which way the ground faces: light from the upper left
            const lit = this.samp(this.lit, x, y);                // + facing the light
            const steep = this.samp(this.steep, x, y);
            let col;
            const inCliff = K && x > K.x0 && x < K.x1 && y > K.y0 && y < K.y1;
            const outF = this.samp(this.out, x, y) + edge * 0.6;
            if (outF > 0.5) {
                const south = this.samp(this.out, x, y + 26) + edge * 0.6;     // open ground just below: this is the cliff's face
                const north = this.samp(this.out, x, y - 5);
                if (south <= 0.5) {
                    const t = 1 - (this.samp(this.out, x, y + 8) + edge * 0.6 > 0.5 ? (this.samp(this.out, x, y + 17) + edge * 0.6 > 0.5 ? 1 : 0.5) : 0);   // 0 top of face … 1 foot
                    const band = Math.floor((y + Math.sin(x * 0.07) * 2 + n2 * 5) / 4) % 3;
                    let k = 2 + (band === 0 ? 0 : 1) + (t > 0.9 ? 1 : 0);
                    if (hash2(x >> 1, y >> 3) > 0.9) k++;
                    col = C.rock[k > 4 ? 4 : k];
                } else {
                    // the top of the plateau: even and pale, a few cracks and stones, a dark edge and a sunlit rim inside it
                    let k = 1;
                    const sp = hash2(x, y);
                    if (sp > 0.965) k = 2; else if (sp < 0.012) k = 0;
                    if (hash2(x >> 4, y >> 4) > 0.8 && ((x + (y >> 2)) % 16 === 0 || (y + (x >> 3)) % 16 === 0) && hash2(x >> 2, y >> 2) > 0.3) k = 3;   // cracks, in patches
                    if (outF < 0.545) k = 4; else if (outF < 0.6 || north <= 0.5) k = 0; else if (outF < 0.68 && by > 0.5) k = 0;
                    col = C.rock[k];
                }
            } else if (P && Math.pow((x - P.cx) / P.rx, 2) + Math.pow((y - P.cy) / P.ry, 2) < 1 + edge * 0.4) {
                // the oasis pool: a pale rim, deeper toward the middle, a few glints
                const q = Math.pow((x - P.cx) / P.rx, 2) + Math.pow((y - P.cy) / P.ry, 2);
                col = q > 0.86 ? C.water[0] : q > 0.55 + by * 0.15 ? C.water[1] : q > 0.25 + by * 0.15 ? C.water[2] : C.water[3];
                if (((x + y * 3) % 23 === 0 || (x * 2 + y) % 31 === 0) && hash2(x >> 2, y >> 1) > 0.6 && q < 0.8) col = C.water[0];
            } else if (inCliff) {
                // the escarpment's face: strata running across, darker toward the foot
                const t = (y - K.y0) / (K.y1 - K.y0);
                const band = Math.floor((y + Math.sin(x * 0.05) * 2 + n2 * 6) / 5) % 3;
                let k = band === 0 ? 1 : band === 1 ? 2 : 3;
                if (t > 0.8) k = Math.min(4, k + 1);
                if (t < 0.12) k = 0;                              // sunlit lip
                if (hash2(x >> 1, y >> 3) > 0.93) k = Math.min(4, k + 1);   // cracks
                col = C.rock[k];
            } else if (this.samp(this.dip, x, y) + edge * 0.5 > 0.5) {
                // the open trench: a shadowed wall under its north lip, then the floor
                const up = this.samp(this.dip, x, y - 14);
                col = up < 0.5 ? C.dirt[3] : C.dirt[n2 > 0.55 && by > 0.4 ? 1 : 0];
                const sp = hash2(x, y);
                if (up >= 0.5 && sp > 0.985) col = C.dirt[2]; else if (up >= 0.5 && sp < 0.006) col = C.road[1];   // stones, sherds
            } else {
                // sand, shaded by the dunes
                let t = 1.6 - lit * 1.5 + (by - 0.5) * 0.9 + (n2 - 0.5) * 0.5;
                t = t < 0 ? 0 : t > 4 ? 4 : t;
                col = C.sand[Math.round(t)];
                // wind ripples in patches; a scatter of grit
                if (n2 > 0.56 && ((y + Math.round(Math.sin(x * 0.11 + n2 * 9) * 2.2)) % 9 === 0)) col = C.sand[Math.min(4, Math.round(t) + 1)];
                const gr = hash2(x, y);
                if (gr > 0.992) col = C.sand[4]; else if (gr < 0.006) col = C.sand[0];
                // a dune's crest: where the lit side meets the shaded one, a thin bright edge
                if (steep > 0.5 && lit > -0.08 && lit < 0.1 && by > 0.3) col = C.sand[0];
                {
                    const wadiF = this.samp(this.wadi, x, y) + edge;
                    const pathF = roads.length ? this.roadAt(roads, x, y) + edge * 0.9 : 0;
                    if (pathF > 0.5) {
                        // worn road: packed and pale, a darker edge, stones
                        col = pathF < 0.56 ? C.road[2] : C.road[by > 0.62 ? 1 : 0];
                        const st = hash2(x, y);
                        if (st > 0.985) col = C.road[2]; else if (st < 0.01) col = C.sand[0];
                    } else if (wadiF > 0.5) {
                        col = wadiF < 0.56 ? C.gravel[2] : C.gravel[by > 0.5 ? 1 : 0];
                        if (hash2(x >> 1, y >> 1) > 0.9) col = C.gravel[2];     // pebbles
                        if (hash2(x >> 1, y >> 1) < 0.05) col = C.rock[0];
                    }
                }
            }
            if (rails) {
                const [rd, ra] = this.railAt(x, y);
                if (rd < 9) {
                    col = C.gravel[by > 0.5 ? 1 : 2];                            // ballast
                    if (rd < 7 && Math.floor(ra) % 8 < 3) col = hex(PAL.wood[2]);   // sleepers
                    if (rd >= 3.4 && rd < 5) col = hex(PAL.metal[Math.floor(ra) % 8 < 3 ? 1 : 2]);   // the two rails
                }
            }
            d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
        }
        g.putImageData(img, 0, 0);
        return c;
    },
    // the chunk canvas for (cx, cy), painting it if `budget` allows
    get(cx, cy, budget) {
        const k = cx + ',' + cy;
        let c = this.chunks.get(k);
        if (c) { this.chunks.delete(k); this.chunks.set(k, c); return c; }   // keep recent ones
        if (budget && budget.n <= 0) return null;
        if (budget) budget.n--;
        c = this.paint(cx, cy);
        this.chunks.set(k, c);
        if (this.chunks.size > 140) this.chunks.delete(this.chunks.keys().next().value);
        return c;
    },
    draw(g, camX, camY, vw, vh) {
        const CH = this.CH, budget = { n: 2 };
        const x0 = Math.floor(camX / CH), y0 = Math.floor(camY / CH), x1 = Math.floor((camX + vw) / CH), y1 = Math.floor((camY + vh) / CH);
        let missing = 0;
        for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) {
            const c = this.get(cx, cy, budget);
            if (c) g.drawImage(c, cx * CH - camX, cy * CH - camY);
            else { missing++; g.fillStyle = PAL.sand[2]; g.fillRect(cx * CH - camX, cy * CH - camY, CH, CH); }
        }
        return missing;
    },
};
