// ============================================================
// THE CODEX OF GIZA — POKE STYLE: PIXEL ART TOOLKIT + GROUND (poke/art.js)
// Everything on screen is drawn here in code, pixel by pixel, on a 32-px
// tile scale in the DS three-quarter view (you see the tops of things and
// their south faces). No image files.
//   - PAL: the palette
//   - pa(): drawing helpers that never anti-alias (rects, lines, ellipses,
//     polygons, dither), and outline() which rings a sprite in a dark line
//   (the ground itself is painted by CampGround, in camp.js)
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
        // blend colour c half over a rect (a smooth mid-tone; the old checkerboard read as grain)
        dith(x, y, w, h, c) {
            if (w <= 0 || h <= 0) return A;
            g.globalAlpha = 0.5; g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); g.globalAlpha = 1;
            return A;
        },
        // a vertical gradient from colour a (top) to b (bottom), one row at a time
        vgrad(x, y, w, h, a, b) { for (let j = 0; j < h; j++) A.r(x, y + j, w, 1, mix(a, b, h > 1 ? j / (h - 1) : 0)); return A; },
        hgrad(x, y, w, h, a, b) { for (let i = 0; i < w; i++) A.r(x + i, y, 1, h, mix(a, b, w > 1 ? i / (w - 1) : 0)); return A; },
        // soft translucent paint (shadows, light, weathering)
        soft(x, y, w, h, c, a) { if (w > 0 && h > 0) { g.globalAlpha = a; g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); g.globalAlpha = 1; } return A; },
    };
    return A;
}

// Ring every opaque shape in a 1-px dark line (the DS look). The canvas
// needs a 1-px empty margin. Returns the same canvas.
function outline(c, col) {
    const g = c.getContext('2d'), w = c.width, h = c.height;
    const d = g.getImageData(0, 0, w, h), a = d.data, out = new Uint8ClampedArray(a);
    const at = (x, y) => (x >= 0 && y >= 0 && x < w && y < h && a[(y * w + x) * 4 + 3] > 128) ? (y * w + x) * 4 : -1;
    const fixed = col ? hex(col) : null;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (at(x, y) >= 0) continue;
        // the neighbour this edge pixel borders (below first: the outline sits under things)
        const n = [at(x, y - 1), at(x, y + 1), at(x - 1, y), at(x + 1, y)].find(v => v >= 0);
        if (n === undefined) continue;
        const o = (y * w + x) * 4;
        if (fixed) { out[o] = fixed[0]; out[o + 1] = fixed[1]; out[o + 2] = fixed[2]; }
        else { out[o] = a[n] * 0.34 + 22; out[o + 1] = a[n + 1] * 0.3 + 14; out[o + 2] = a[n + 2] * 0.32 + 20; }   // the colour, much darker, a touch warm
        out[o + 3] = 255;
    }
    g.putImageData(new ImageData(out, w, h), 0, 0);
    return c;
}
// colour arithmetic: mix two hex colours, or darken (k < 0) / lighten (k > 0) one
function mix(a, b, t) {
    const A = hex(a), B = hex(b);
    return '#' + [0, 1, 2].map(i => Math.max(0, Math.min(255, Math.round(A[i] + (B[i] - A[i]) * t))).toString(16).padStart(2, '0')).join('');
}
function shade(c, k) { return k < 0 ? mix(c, '#20141c', -k) : mix(c, '#fffaf0', k); }

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
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];

