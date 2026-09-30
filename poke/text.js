// ============================================================
// THE CODEX OF GIZA — POKE STYLE: TEXT, WINDOWS, SOUND (poke/text.js)
//   - Txt: pixel text. Letters are drawn small with a system font and
//     then hardened to pure on/off pixels, so they scale up crisp like a
//     DS font (and still cover dashes, accents, Arabic and Coptic).
//   - frame(): the DS-style window (rounded, double border)
//   - Sfx: tiny synthesised blips (text tick, move, select, door, bump)
// ============================================================

const Txt = {
    cache: new Map(),
    FONT: 'bold 10px Verdana, Tahoma, "DejaVu Sans", sans-serif',
    BIG: 'bold 20px Georgia, "Times New Roman", serif',
    meas: null,
    ctxFor(font) {
        if (!this.meas) this.meas = mk(4, 4)[1];
        this.meas.font = font;
        return this.meas;
    },
    width(str, font) { return Math.ceil(this.ctxFor(font || this.FONT).measureText(str).width); },
    // a canvas holding `str` in one colour, every pixel fully on or off
    make(str, col, font) {
        font = font || this.FONT;
        const key = font + '|' + col + '|' + str;
        let c = this.cache.get(key);
        if (c) return c;
        const big = font === this.BIG, h = big ? 28 : 14, w = this.width(str, font) + 2;
        const [cv, g] = mk(w, h);
        g.font = font; g.textBaseline = 'alphabetic'; g.fillStyle = '#000';
        g.fillText(str, 1, big ? 21 : 10);
        const d = g.getImageData(0, 0, w, h), a = d.data, rgb = hex(col);
        for (let i = 0; i < a.length; i += 4) {
            const on = a[i + 3] > (big ? 120 : 96);
            a[i] = rgb[0]; a[i + 1] = rgb[1]; a[i + 2] = rgb[2]; a[i + 3] = on ? 255 : 0;
        }
        g.putImageData(d, 0, 0);
        if (this.cache.size > 900) this.cache.clear();
        this.cache.set(key, cv);
        return cv;
    },
    // draw text; opts: col, shadow (colour), font, align ('left'|'center'|'right')
    draw(g, str, x, y, o) {
        o = o || {};
        if (!str) return 0;
        const font = o.font || this.FONT, w = this.width(str, font);
        if (o.align === 'center') x -= w >> 1; else if (o.align === 'right') x -= w;
        x |= 0; y |= 0;
        if (o.shadow) { const s = this.make(str, o.shadow, font); g.drawImage(s, x + 1, y + 1); if (o.thick) { g.drawImage(s, x + 1, y); g.drawImage(s, x, y + 1); } }
        g.drawImage(this.make(str, o.col || '#30302c', font), x, y);
        return w;
    },
    // break text into lines that fit `maxW` pixels; blank lines separate paragraphs
    wrap(str, maxW, font) {
        const lines = [];
        for (const para of String(str).split('\n')) {
            if (!para.trim()) { lines.push(''); continue; }
            let line = '';
            for (const word of para.split(/\s+/)) {
                const t = line ? line + ' ' + word : word;
                if (this.width(t, font) > maxW && line) { lines.push(line); line = word; } else line = t;
            }
            if (line) lines.push(line);
        }
        return lines;
    },
};

// A DS-style window: rounded corners, a dark line, a coloured band, a pale face
function frame(g, x, y, w, h, o) {
    o = o || {};
    const A = pa(g), line = o.line || '#38404c', band = o.band || '#5890d8', face = o.face || '#f8f8f0', shade = o.shade || '#c8d0d8';
    x |= 0; y |= 0; w |= 0; h |= 0;
    A.r(x + 2, y, w - 4, h, line); A.r(x, y + 2, w, h - 4, line); A.r(x + 1, y + 1, w - 2, h - 2, line);
    A.r(x + 2, y + 1, w - 4, h - 2, band); A.r(x + 1, y + 2, w - 2, h - 4, band);
    A.r(x + 4, y + 3, w - 8, h - 6, line); A.r(x + 3, y + 4, w - 6, h - 8, line);
    A.r(x + 4, y + 4, w - 8, h - 8, face);
    A.r(x + 4, y + h - 6, w - 8, 2, shade); A.r(x + w - 6, y + 4, 2, h - 8, shade);
    A.r(x + 3, y + 2, w - 6, 1, o.hi || '#a8d0f8');
}
// a wooden plaque (place names)
function plaque(g, x, y, w, h) {
    const A = pa(g);
    A.r(x + 1, y, w - 2, h, PAL.line); A.r(x, y + 1, w, h - 2, PAL.line);
    A.r(x + 1, y + 1, w - 2, h - 2, PAL.wood[1]); A.r(x + 1, y + 1, w - 2, 2, PAL.wood[0]); A.r(x + 1, y + h - 3, w - 2, 2, PAL.wood[2]);
    for (let i = 6; i < w - 4; i += 9) A.px(x + i, y + 4 + (i % 3), PAL.wood[2]);
    A.r(x + 3, y + 3, 2, 2, PAL.metal[1]); A.r(x + w - 5, y + 3, 2, 2, PAL.metal[1]);
}

const Sfx = {
    ac: null, on: true,
    ctx() { if (!this.ac) { try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.on = false; } } return this.ac; },
    tone(f, dur, type, vol, slide) {
        if (!this.on) return;
        const ac = this.ctx(); if (!ac) return;
        if (ac.state === 'suspended') ac.resume();
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
        o.type = type || 'square'; o.frequency.setValueAtTime(f, t);
        if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
        g.gain.setValueAtTime((vol || 0.05) * (Game ? Game.set.volume : 1), t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
    },
    tick() { this.tone(880, 0.025, 'square', 0.018); },
    move() { this.tone(660, 0.05, 'square', 0.04); },
    ok() { this.tone(880, 0.06, 'square', 0.05); setTimeout(() => this.tone(1320, 0.09, 'square', 0.05), 55); },
    back() { this.tone(440, 0.08, 'square', 0.045, 300); },
    bump() { this.tone(140, 0.09, 'triangle', 0.09, 90); },
    door() { this.tone(300, 0.12, 'triangle', 0.08, 160); setTimeout(() => this.tone(220, 0.16, 'triangle', 0.07, 120), 110); },
    get() { [784, 988, 1175, 1568].forEach((f, i) => setTimeout(() => this.tone(f, 0.11, 'square', 0.05), i * 85)); },
    save() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.14, 'triangle', 0.08), i * 110)); },
};

// ---- Egyptian dressing for the menus ----
// A frieze: a lapis band with a row of gold signs (ankh, eye, reed, water, sun, djed, scarab, lotus)
const GLYPHS = [
    (A, x, y, c) => { A.r(x + 3, y + 4, 1, 6, c); A.r(x + 1, y + 5, 5, 1, c); A.r(x + 2, y, 3, 1, c); A.r(x + 1, y + 1, 1, 2, c); A.r(x + 5, y + 1, 1, 2, c); A.r(x + 2, y + 3, 3, 1, c); },                 // ankh
    (A, x, y, c) => { A.r(x, y + 3, 7, 1, c); A.r(x + 1, y + 2, 5, 1, c); A.r(x + 3, y + 4, 1, 1, c); A.r(x + 1, y + 5, 5, 1, c); A.r(x + 5, y + 6, 1, 3, c); A.r(x + 1, y + 6, 1, 2, c); A.r(x, y + 8, 2, 1, c); },   // the eye
    (A, x, y, c) => { A.r(x + 3, y, 1, 10, c); A.r(x + 4, y + 1, 1, 5, c); A.r(x + 5, y + 2, 1, 3, c); A.r(x + 2, y + 2, 1, 3, c); },                                                                      // reed leaf
    (A, x, y, c) => { for (let k = 0; k < 3; k++) for (let i = 0; i < 7; i++) A.px(x + i, y + 2 + k * 3 + (i % 4 < 2 ? 0 : 1), c); },                                                                       // water
    (A, x, y, c) => { A.ell(x + 3, y + 4, 3, 3, c); A.px(x + 3, y + 4, '#203c74'); A.r(x, y + 9, 7, 1, c); },                                                                                              // the sun
    (A, x, y, c) => { A.r(x + 3, y + 3, 1, 7, c); for (let k = 0; k < 4; k++) A.r(x + 1, y + k * 2, 5, 1, c); A.r(x + 1, y + 9, 5, 1, c); },                                                                // djed pillar
    (A, x, y, c) => { A.ell(x + 3, y + 5, 2, 3, c); A.r(x + 2, y + 1, 3, 1, c); A.px(x, y + 3, c); A.px(x + 6, y + 3, c); A.px(x, y + 7, c); A.px(x + 6, y + 7, c); A.r(x + 1, y + 4, 1, 1, c); A.r(x + 5, y + 4, 1, 1, c); },   // scarab
    (A, x, y, c) => { A.r(x + 3, y + 5, 1, 5, c); A.r(x + 1, y + 2, 1, 3, c); A.r(x + 5, y + 2, 1, 3, c); A.r(x + 3, y, 1, 5, c); A.r(x + 2, y + 4, 3, 1, c); },                                           // lotus
];
function frieze(g, x, y, w, phase) {
    const A = pa(g);
    A.r(x, y, w, 16, '#203c74'); A.r(x, y, w, 1, '#f0c040'); A.r(x, y + 1, w, 1, '#c89020'); A.r(x, y + 14, w, 1, '#c89020'); A.r(x, y + 15, w, 1, '#f0c040');
    const n = Math.floor((w - 8) / 14), off = Math.round((w - n * 14) / 2);
    for (let i = 0; i < n; i++) GLYPHS[(i + (phase || 0)) % GLYPHS.length](A, x + off + i * 14 + 3, y + 3, i % 3 === 1 ? '#ffe890' : '#f0c040');
}
// the winged sun disk
function wingedSun(g, cx, cy, span) {
    const A = pa(g);
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
        const len = span - k * Math.round(span * 0.16), y = cy - 2 + k * 3;
        for (let i = 6; i < len; i++) A.px(cx + s * i, y + Math.round(i * i / (len * 7)), k % 2 ? '#c89020' : '#f0c040');
        A.r(cx + s * len - (s > 0 ? 2 : 0), y + Math.round(len / 7), 2, 2, k === 1 ? '#3058a0' : '#d04838');
    }
    A.ell(cx, cy, 7, 7, '#5c3008'); A.ell(cx, cy, 6, 6, '#f08020'); A.ell(cx - 1, cy - 1, 4, 4, '#ffc840'); A.ell(cx - 2, cy - 2, 1, 1, '#fff4b0');
    A.r(cx - 9, cy + 4, 3, 5, '#f0c040'); A.r(cx + 7, cy + 4, 3, 5, '#f0c040');
}
// small icons for the pause menu (9×9)
const ICONS = {
    MAP(A, x, y) { A.r(x, y + 1, 9, 7, '#ecd698'); A.r(x + 3, y + 1, 1, 7, '#b38d50'); A.r(x + 6, y + 1, 1, 7, '#b38d50'); A.r(x + 1, y + 3, 2, 1, '#d04838'); A.r(x + 4, y + 5, 2, 1, '#4878c8'); A.px(x + 7, y + 3, '#388030'); },
    JOURNAL(A, x, y) { A.r(x + 1, y, 7, 9, '#804c28'); A.r(x + 2, y + 1, 5, 7, '#f8f8f0'); A.r(x + 3, y + 3, 3, 1, '#9aa0b0'); A.r(x + 3, y + 5, 3, 1, '#9aa0b0'); A.r(x + 1, y, 1, 9, '#5c3418'); },
    BAG(A, x, y) { A.r(x + 1, y + 3, 7, 6, '#a86c3c'); A.r(x + 3, y, 3, 1, '#5c3418'); A.r(x + 2, y + 1, 1, 2, '#5c3418'); A.r(x + 6, y + 1, 1, 2, '#5c3418'); A.r(x + 1, y + 3, 7, 2, '#c89058'); A.px(x + 4, y + 5, '#f0c040'); },
    TASKS(A, x, y) { A.r(x, y, 9, 9, '#38404c'); A.r(x + 1, y + 1, 7, 7, '#f8f8f0'); A.line(x + 2, y + 4, x + 4, y + 6, '#3a7a30'); A.line(x + 4, y + 6, x + 7, y + 2, '#3a7a30'); },
    SETTINGS(A, x, y) { A.ell(x + 4, y + 4, 3, 3, '#748490'); A.px(x + 4, y + 4, '#f8f8f0'); A.r(x + 4, y, 1, 9, '#748490'); A.r(x, y + 4, 9, 1, '#748490'); A.ell(x + 4, y + 4, 1, 1, '#f8f8f0'); },
    SAVE(A, x, y) { A.r(x + 3, y + 4, 3, 5, '#f0c040'); A.r(x + 1, y + 5, 7, 1, '#f0c040'); A.r(x + 3, y, 3, 1, '#f0c040'); A.r(x + 2, y + 1, 1, 2, '#f0c040'); A.r(x + 6, y + 1, 1, 2, '#f0c040'); A.r(x + 3, y + 3, 3, 1, '#f0c040'); },
    'TITLE SCREEN'(A, x, y) { A.poly([[x, y + 8], [x + 5, y + 1], [x + 9, y + 8]], '#cca964'); A.poly([[x + 5, y + 1], [x + 9, y + 8], [x + 6, y + 8]], '#b38d50'); },
    CLOSE(A, x, y) { A.line(x + 1, y + 1, x + 7, y + 7, '#d04838'); A.line(x + 7, y + 1, x + 1, y + 7, '#d04838'); },
};
