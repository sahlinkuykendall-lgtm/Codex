// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE MINIGAMES (poke/minigames.js)
// Chapter 1-A's five minigames, drawn on the game canvas in the camp's pixel style.
// playMinigame(kind, opts, done) opens one; `done(result)` gets what happened.
//   sieve  shake a heap through (◄ ► in turn), pick out the finds (▲ ▼, SPACE). 25 s.
//          opts.key: Trench B's heap, with the MAG key in it. → { ok, key, earned, bagged }
//   tea    kettle height ▲ ▼, hold SPACE to pour. Fill to the gold line with a head of foam.
//          → { ok (a perfect glass), kind: perfect | short | flat | messy | over }
//   darts  a real board: 20 segments, doubles, trebles, the bull. ◄ ► ▲ ▼ aim, hold SPACE
//          to steady your hand (not too long), let go to throw. Three darts. → { score }
//   seal   Petamun's old seal: ◄ ► ▲ ▼ pick a stone, SPACE presses it. The first press wakes
//          it and the resonance drains; finish before it fades. Owl, eye, serpent, lion.
//          → { ok } solved · { dart } a wrong stone · { left }
//   race   Hagg Sayed's bay against his old grey: press SPACE as her stride marker crosses
//          the gold, and three moments to choose how to ride. → { won }
// ESC / X leaves any of them ({ left: true }).
// ============================================================

const Mini = {
    cur: null,
    open(kind, opts, done) {
        const G = MINIS[kind];
        if (!G) { done(Object.assign({ ok: true }, opts)); return; }
        this.cur = Object.assign({ kind, opts: opts || {}, done, t: 0, result: null, endT: 0, act: false, lock: true }, G.start(opts || {}));   // (lock: until SPACE is let go, so the key that chose 'play' doesn't throw, pour or dig)
        this.G = G; Sfx.ok();
    },
    update(dt, I, keys) {
        const S = this.cur; if (!S) return;
        S.t += dt;
        if (S.lock) { if (keys.act || S.t < 0.25) { S.act = !!keys.act; return; } S.lock = false; S.act = false; }
        const held = !!keys.act, pressed = held && !S.act, released = !held && S.act; S.act = held;
        if (S.result) {                                               // the result card: SPACE to go on
            S.endT += dt;
            if (S.endT > 0.5 && (I.ok || I.back)) { const cb = S.done, r = S.result; this.cur = null; Sfx.move(); cb(r); }
            return;
        }
        if (I.back || I.menu) { this.finish({ left: true, ok: false }, 'You step away.'); return; }
        this.G.update(S, dt, I, keys, pressed, released);
    },
    finish(result, line, big) { const S = this.cur; S.result = result; S.line = line || ''; S.big = big || ''; S.endT = 0; },
    draw(g) {
        const S = this.cur; if (!S) return;
        const VW = Game.VW, VH = Game.VH, A = pa(g);
        g.fillStyle = '#101838'; g.fillRect(0, 0, VW, VH);
        this.G.draw(S, g, A, VW, VH);
        frame(g, 6, 4, Txt.width(this.G.title) + 26, 20, { band: '#e0a030', hi: '#ffe090' });
        Txt.draw(g, this.G.title, 19, 7, { col: UI.ink });
        if (!S.result) Txt.draw(g, this.G.keys, VW >> 1, VH - 13, { col: '#8898d0', align: 'center' });
        if (S.result) {
            const w = Math.min(VW - 24, 380), lines = Txt.wrap(S.line, w - 28), h = 40 + lines.length * 12, x = (VW - w) >> 1, y = VH - h - 10;
            frame(g, x, y, w, h);
            if (S.big) Txt.draw(g, S.big, VW >> 1, y + 8, { col: UI.gold, align: 'center' });
            lines.forEach((ln, i) => Txt.draw(g, ln, x + 14, y + (S.big ? 22 : 10) + i * 12, { col: UI.ink }));
            if (S.endT > 0.5 && (S.endT * 2.5 | 0) % 2 === 0) A.poly([[x + w - 18, y + h - 13], [x + w - 10, y + h - 13], [x + w - 14, y + h - 8]], '#d04838');
        }
    },
};
// a labelled bar: fill 0..1, an optional gold target zone [a, b]
function miniBar(g, A, x, y, w, label, v, zone, hot) {
    Txt.draw(g, label, x, y, { col: '#c8d0f0' });
    const bx = x + 50, bw = w - 50;
    A.r(bx, y + 1, bw, 10, '#30302c'); A.r(bx + 1, y + 2, bw - 2, 8, '#1c2442');
    if (zone) A.r(bx + 1 + Math.round((bw - 2) * zone[0]), y + 2, Math.round((bw - 2) * (zone[1] - zone[0])), 8, '#5a4a18');
    A.r(bx + 1, y + 2, Math.round((bw - 2) * Math.max(0, Math.min(1, v))), 8, hot ? '#f05030' : '#60c060');
    if (zone) { A.r(bx + 1 + Math.round((bw - 2) * zone[0]), y + 1, 1, 10, '#f0c040'); A.r(bx + Math.round((bw - 2) * zone[1]), y + 1, 1, 10, '#f0c040'); }
}

const MINIS = {};

// ============================================================
// THE SIEVE
// ============================================================
const SIEVE_FINDS = [
    { kind: 'sherd', value: 10, name: 'Pot sherd' }, { kind: 'bead', value: 25, name: 'Faience bead' },
    { kind: 'coin', value: 35, name: 'Copper coin' }, { kind: 'bone', value: 5, name: 'Animal bone' },
    { kind: 'flint', value: 15, name: 'Worked flint' },
];
function sieveIcon(A, kind, x, y) {
    const L = PAL.line;
    if (kind === 'stone') { A.ell(x, y, 4, 3, L); A.ell(x, y, 3, 2, PAL.rock[2]); A.px(x - 1, y - 1, PAL.rock[0]); }
    else if (kind === 'sherd') { A.poly([[x - 5, y - 2], [x + 3, y - 4], [x + 5, y + 2], [x - 3, y + 3]], L); A.poly([[x - 4, y - 2], [x + 3, y - 3], [x + 4, y + 2], [x - 3, y + 2]], PAL.brick[1]); A.line(x - 2, y, x + 2, y - 1, PAL.dark[2]); }
    else if (kind === 'bead') { A.ell(x, y, 4, 3, L); A.ell(x, y, 3, 2, '#2a9aaa'); A.px(x, y, '#103038'); A.px(x - 2, y - 1, '#a0f0f0'); }
    else if (kind === 'coin') { A.ell(x, y, 4, 4, L); A.ell(x, y, 3, 3, '#6a8a58'); A.px(x - 1, y - 1, '#a8c890'); A.px(x + 1, y + 1, '#3a5030'); }
    else if (kind === 'bone') { A.r(x - 5, y - 1, 10, 3, L); A.r(x - 4, y, 8, 1, '#ece2c8'); A.r(x - 6, y - 2, 3, 5, L); A.r(x + 3, y - 2, 3, 5, L); A.px(x - 5, y - 1, '#ece2c8'); A.px(x + 4, y + 1, '#ece2c8'); }
    else if (kind === 'flint') { A.poly([[x, y - 5], [x + 4, y + 3], [x - 4, y + 3]], L); A.poly([[x, y - 4], [x + 3, y + 2], [x - 3, y + 2]], '#5a4a3a'); A.px(x, y - 2, '#a89078'); }
    else if (kind === 'key') { A.ell(x - 3, y, 3, 3, L); A.ell(x - 3, y, 2, 2, '#c8a040'); A.px(x - 3, y, L); A.r(x, y - 1, 6, 3, L); A.r(x, y, 6, 1, '#c8a040'); A.r(x + 4, y + 1, 1, 2, L); A.r(x + 1, y - 4, 4, 3, '#ece2c8'); }
}
// each find drawn once small and shown at twice the size, every pixel square
function sieveIconBig(kind) {
    const C = sieveIconBig.c || (sieveIconBig.c = {});
    if (C[kind]) return C[kind];
    const [s, sg] = mk(16, 12); sieveIcon(pa(sg), kind, 8, 6);
    const [b, bg] = mk(32, 24); bg.imageSmoothingEnabled = false; bg.drawImage(s, 0, 0, 32, 24);
    return (C[kind] = b);
}
MINIS.sieve = {
    title: 'THE SIEVE', keys: '◄ ► in turn: shake    ▲▼ choose    SPACE: bag it    ESC: leave',
    start(o) {
        const items = [], n = 6 + (Math.random() * 3 | 0);
        for (let i = 0; i < n; i++) {
            const def = Math.random() < 0.5 ? SIEVE_FINDS[(Math.random() * SIEVE_FINDS.length) | 0] : null;
            items.push({ def, kind: def ? def.kind : 'stone', x: 0.1 + Math.random() * 0.8, y: 0.15 + Math.random() * 0.7, depth: 0.25 + Math.random() * 0.6, taken: false });
        }
        if (o.key) items.push({ def: { kind: 'key', value: 0, name: 'Brass key tagged MAG' }, kind: 'key', x: 0.3 + Math.random() * 0.4, y: 0.35 + Math.random() * 0.3, depth: 0.72, taken: false });
        return { items, progress: 0, time: 25, last: 0, shake: 0, sel: 0, earned: 0, bagged: [], pop: [] };
    },
    live(S) { return S.items.filter(f => !f.taken && S.progress > f.depth); },
    update(S, dt, I) {
        S.time -= dt;
        const dir = I.left ? -1 : I.right ? 1 : 0;
        if (dir && dir !== S.last) { S.progress = Math.min(1, S.progress + 0.02); S.shake = 1; S.last = dir; Sfx.tone(110 + Math.random() * 50, 0.05, 'triangle', 0.05, 80); }
        else if (dir) S.shake = 0.4;
        S.shake = Math.max(0, S.shake - dt * 4);
        const live = this.live(S);
        if (live.length) {
            S.sel = Math.min(S.sel, live.length - 1);
            if (I.up) { S.sel = (S.sel + live.length - 1) % live.length; Sfx.move(); }
            if (I.down) { S.sel = (S.sel + 1) % live.length; Sfx.move(); }
            if (I.ok) {
                const f = live[S.sel]; f.taken = true;
                if (f.def) { S.bagged.push(f.def.name); S.earned += f.def.value; S.pop.push({ f, t: 0, s: f.kind === 'key' ? 'MAG!' : '+' + f.def.value }); Sfx.get(); }
                else { S.pop.push({ f, t: 0, s: 'a stone' }); Sfx.tone(220, 0.05, 'triangle', 0.04); }
            }
        }
        for (const p of S.pop) p.t += dt;
        const done = S.time <= 0 || (S.progress >= 1 && S.items.every(f => f.taken || !f.def));
        if (done) {
            const key = S.bagged.includes('Brass key tagged MAG');
            Mini.finish({ ok: true, key, earned: S.earned, bagged: S.bagged.filter(b => !b.startsWith('Brass key')) },
                key ? 'In the bottom of the sieve, green with earth: a small brass key on a cardboard tag. MAG. Magazine. The find store.'
                    : S.bagged.length ? 'Bagged and labelled: ' + S.bagged.join(', ').toLowerCase() + '.' + (Mini.cur.opts.key ? ' Something glinted under the red stake, and you lost it in the sand.' : ' The register pays on the spot.')
                    : 'Sand, stones, a beetle. The spoil keeps its secrets this time.',
                key ? 'THE MAG KEY' : S.bagged.length ? S.bagged.length + ' FINDS · +' + S.earned + ' EGP' : 'NOTHING BUT STONES');
        }
    },
    draw(S, g, A, VW, VH) {
        const w = Math.min(VW - 60, 300), h = Math.min(VH - 90, 150), x0 = ((VW - w) >> 1) + Math.round(Math.sin(S.t * 60) * S.shake * 4), y0 = 40;
        // the frame on its trestles, the mesh, the earth thinning as you shake
        A.r(x0 - 6, y0 + h, 6, 26, PAL.wood[3]); A.r(x0 + w, y0 + h, 6, 26, PAL.wood[3]);
        A.r(x0 - 8, y0 - 8, w + 16, h + 16, PAL.line); A.r(x0 - 7, y0 - 7, w + 14, h + 14, PAL.wood[1]); A.r(x0 - 7, y0 - 7, w + 14, 2, PAL.wood[0]); A.r(x0 - 7, y0 + h + 5, w + 14, 2, PAL.wood[3]);
        A.r(x0, y0, w, h, '#2a2018');
        for (let i = 0; i < w; i += 4) A.vl(x0 + i, y0, h, '#6a6a60'); for (let j = 0; j < h; j += 4) A.hl(x0, y0 + j, w, '#6a6a60');
        const soil = 1 - S.progress;
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
            const v = hash2(i * 3 + 1, j * 7 + 2);
            if (v < soil * 1.05) A.px(x0 + i, y0 + j, v < soil * 0.5 ? PAL.sand[4] : v < soil * 0.8 ? PAL.sand[3] : '#8a6a44');
        }
        const live = this.live(S);
        S.items.forEach(f => { if (!f.taken && S.progress > f.depth) { const ic = sieveIconBig(f.kind); g.drawImage(ic, Math.round(x0 + f.x * w - ic.width / 2), Math.round(y0 + f.y * h - ic.height / 2)); } });
        const on = live[S.sel];
        if (on) { const x = Math.round(x0 + on.x * w), y = Math.round(y0 + on.y * h), r = 14 + ((S.t * 6 | 0) % 2); A.r(x - r, y - r, 3, 1, '#ffffff'); A.r(x - r, y - r, 1, 3, '#ffffff'); A.r(x + r - 2, y - r, 3, 1, '#ffffff'); A.r(x + r, y - r, 1, 3, '#ffffff'); A.r(x - r, y + r, 3, 1, '#ffffff'); A.r(x - r, y + r - 2, 1, 3, '#ffffff'); A.r(x + r - 2, y + r, 3, 1, '#ffffff'); A.r(x + r, y + r - 2, 1, 3, '#ffffff'); }
        for (const p of S.pop) if (p.t < 1) Txt.draw(g, p.s, Math.round(x0 + p.f.x * w), Math.round(y0 + p.f.y * h - 12 - p.t * 14), { col: p.s === 'a stone' ? '#c8d0f0' : '#ffe890', shadow: '#101838', align: 'center' });
        // time, how sifted, what's bagged
        const bx = (VW - Math.min(VW - 40, 330)) >> 1, bw = Math.min(VW - 40, 330), by = y0 + h + 34;
        miniBar(g, A, bx, by, bw >> 1, 'SIFTED', S.progress);
        Txt.draw(g, Math.max(0, Math.ceil(S.time)) + 's', bx + (bw >> 1) + 14, by, { col: S.time < 6 ? '#f07060' : '#c8d0f0' });
        Txt.draw(g, (on ? (on.def ? on.def.name : 'A stone') + '   ' : '') + S.earned + ' EGP', bx + bw, by, { col: on && on.def ? '#ffe890' : '#c8d0f0', align: 'right' });
    },
};

// ============================================================
// MINT TEA
// ============================================================
MINIS.tea = {
    title: 'MINT TEA', keys: '▲▼ kettle height    hold SPACE: pour    ESC: leave',
    start() { return { level: 0, foam: 0, h: 0.4, pouring: false, splash: 0, drops: [] }; },
    update(S, dt, I, keys, pressed, released) {
        if (keys.up) S.h = Math.min(1, S.h + dt * 0.9); if (keys.down) S.h = Math.max(0, S.h - dt * 0.9);
        S.pouring = !!keys.act;
        if (S.pouring) {
            S.level += dt * 0.28;
            S.foam = Math.min(1, Math.max(0, S.foam + dt * (S.h > 0.45 ? (S.h - 0.35) * 1.4 : -0.05)));
            if (S.h > 0.85 && Math.random() < dt * 6) { S.splash++; for (let i = 0; i < 4; i++) S.drops.push({ x: (Math.random() - 0.5) * 30, y: 0, vx: (Math.random() - 0.5) * 60, vy: -30 - Math.random() * 40, t: 0 }); }
            if (Math.random() < dt * 18) Sfx.tone(1600 + Math.random() * 900, 0.015, 'sine', 0.012);
        } else S.foam = Math.max(0, S.foam - dt * 0.12);
        for (const d of S.drops) { d.t += dt; d.x += d.vx * dt; d.y += d.vy * dt; d.vy += 200 * dt; }
        S.drops = S.drops.filter(d => d.t < 0.8);
        const LINES = { perfect: 'A proper glass: amber, sweet, a fat head of foam that holds. Somewhere behind you a worker clicks his tongue in approval.', short: 'Half a glass. The workers would call that an insult to the mint.', flat: 'Full, but flat as a puddle. Pour from higher: the foam is the whole point.', messy: 'Foam, yes. Also tea across the tray, the crate and your left boot.', over: 'It overflows, runs off the tray and hisses on the coals.' };
        let kind = null;
        if (S.level >= 1.02) kind = 'over';
        else if (released && S.level >= 0.55) kind = S.level < 0.78 ? 'short' : S.foam < 0.5 ? 'flat' : S.splash > 3 ? 'messy' : 'perfect';
        if (kind) { kind === 'perfect' ? Sfx.save() : Sfx.back(); Mini.finish({ ok: kind === 'perfect', kind }, LINES[kind], kind === 'perfect' ? 'A PERFECT GLASS' : kind === 'over' ? 'SPILLED' : 'NOT QUITE'); }
    },
    draw(S, g, A, VW, VH) {
        const cx = VW >> 1, base = Math.min(VH - 60, 200), t = S.t;
        // the night behind, the workers' fire glowing off to the left, the table under the tray
        A.r(0, 0, VW, VH, '#141a34'); for (let i = 0; i < 40; i++) A.px(Math.floor(hash2(i, 3) * VW), Math.floor(hash2(3, i) * (base - 60)), i % 5 ? '#3a4470' : '#c8d0f0');
        const ty = base - 14;
        A.r(0, ty, VW, VH - ty, '#6e4424'); for (let y = ty; y < VH; y += 9) { A.hl(0, y, VW, '#8e5e32'); A.hl(0, y + 8, VW, '#4a2c16'); }
        for (let k = 0; k < 4; k++) A.soft(0, ty - 30 + k * 10, 140 - k * 20, VH - ty + 30, '#ff9a40', 0.06);
        const fx = 34, fy = VH - 30;                                                          // the brazier's coals, in the corner
        A.ell(fx, fy + 10, 40, 16, '#1c1410'); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = 10 + (i % 3) * 8; A.ell(fx + Math.cos(a) * r, fy + Math.sin(a) * r * 0.4, 5, 3, (i + Math.floor(t * 6)) % 3 ? '#c03010' : '#ffb040'); }
        for (let i = 0; i < 3; i++) { const fl = Math.sin(t * 9 + i * 2) * 3; A.poly([[fx - 12 + i * 10, fy - 2], [fx - 6 + i * 10, fy - 2], [fx - 9 + i * 10 + fl, fy - 20 - (i === 1 ? 8 : 0)]], i === 1 ? '#ffe070' : '#ff9030'); }
        // the brass tray: rim, engraving, a shine
        const trx = Math.min(110, (VW >> 1) - 20);
        A.ell(cx, base + 6, trx + 2, 19, PAL.line); A.ell(cx, base + 5, trx, 17, '#a87818'); A.ell(cx, base + 3, trx - 6, 13, '#d8a830'); A.ell(cx - 10, base + 1, trx - 30, 7, '#f0c850');
        for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; A.px(Math.round(cx + Math.cos(a) * (trx - 12)), Math.round(base + 3 + Math.sin(a) * 9), '#a87818'); }
        A.line(cx - trx + 20, base - 4, cx - 30, base - 8, '#fff0b0');
        // on the tray: two glasses already poured, the sugar bowl, a bunch of mint
        for (const [ox, lv] of [[-70, 0.8], [-50, 0.85]]) { const gx = cx + ox; A.r(gx - 6, base - 22, 12, 22, PAL.line); A.r(gx - 5, base - 21, 10, 21, '#c8dcec'); A.r(gx - 5, base - 21 + Math.round(21 * (1 - lv)), 10, Math.round(21 * lv), '#b8601c'); A.r(gx - 5, base - 21 + Math.round(21 * (1 - lv)), 10, 2, '#f0dcb0'); A.vl(gx + 2, base - 19, 16, '#ffffff'); }
        const sbx = cx + 62; A.ell(sbx, base - 6, 13, 9, PAL.line); A.ell(sbx, base - 7, 12, 8, '#e8ecf0'); A.ell(sbx, base - 11, 10, 3, '#ffffff'); for (let i = 0; i < 6; i++) A.px(sbx - 6 + i * 2, base - 12 + (i & 1), '#f4f4f0'); A.line(sbx + 4, base - 13, sbx + 14, base - 24, '#9aa4ae');
        for (let i = 0; i < 5; i++) { const lx = cx + 80 + i * 3, ly = base - 2 - (i % 2) * 3; A.line(lx, ly, lx - 4 + i * 2, ly - 12, '#2f7a3a'); A.ell(lx - 4 + i * 2, ly - 13, 3, 2, i & 1 ? '#58a848' : '#78c050'); }
        // the glass: a small straight tea glass, slightly flared, thick-bottomed, clear; the tea, its foam, a sprig of mint
        const gh = 64, gy = base - gh, lvl = Math.min(1.05, S.level), th = Math.round(gh * lvl), fh = Math.round(S.foam * 9 * Math.min(1, lvl * 3));
        const half = yy => 11 + Math.round(yy / gh * 4);                                                                                   // flaring toward the rim (yy from the bottom)
        for (let yy = 0; yy <= gh; yy++) {
            const w = half(yy), y = base - yy;
            A.px(cx - w - 1, y, '#20283c'); A.px(cx + w, y, '#20283c');                                                                       // the outline
            if (yy < 5) { A.r(cx - w, y, 2 * w, 1, yy < 1 ? '#9ab4c8' : '#c8dcec'); continue; }                                               // the thick glass base
            if (yy < th) { const dk = 1 - yy / Math.max(1, th); A.r(cx - w, y, 2 * w, 1, dk > 0.6 ? '#8e3e10' : dk > 0.25 ? '#b0561a' : '#c86c24'); }   // the tea, darker at the bottom
            else if (yy < th + fh && th > 2) A.r(cx - w, y, 2 * w, 1, (yy + Math.floor(t * 4)) % 3 ? '#f0dcb0' : '#fff4d8');                  // the foam
            else A.soft(cx - w, y, 2 * w, 1, '#dcecff', 0.16);                                                                                 // empty glass: you see through it
            A.px(cx - w, y, '#eef6ff'); A.px(cx - w + 1, y, yy < th ? '#e89048' : '#b8d0e8'); A.px(cx + w - 1, y, '#7890a8');                // the glass walls: lit left, shaded right
            if (yy > th + fh && yy % 3 === 0) A.px(cx - w + 4, y, '#ffffff');                                                                 // a highlight streak
        }
        A.r(cx - half(gh) - 1, base - gh - 1, 2 * half(gh) + 2, 2, '#f0c040'); A.hl(cx - half(gh), base - gh - 1, 2 * half(gh), '#fff0a0');   // the gold rim
        A.r(cx - 12, base + 1, 24, 2, '#20283c');
        for (const f of [0.78, 0.94]) { const yy = Math.round(gh * f), w = half(yy); A.r(cx - w - 7, base - yy, 5, 1, '#f0c040'); A.r(cx + w + 2, base - yy, 5, 1, '#f0c040'); A.px(cx - w - 8, base - yy, '#fff4b0'); }   // the gold lines: pour to here
        for (let i = 0; i < 4 && th > 10; i++) { const by = base - 5 - Math.round((t * 20 + i * 13) % Math.max(1, th - 8)); A.px(cx - 6 + i * 4, by, '#e8a060'); }                  // bubbles rising
        const mx = cx + half(gh) - 5; A.line(mx, base - Math.max(8, th), mx + 7, base - gh - 16, '#2f7a3a'); A.ell(mx + 8, base - gh - 17, 4, 3, '#58a848'); A.ell(mx + 4, base - gh - 10, 3, 2, '#78c050'); A.px(mx + 7, base - gh - 18, '#a8e070');
        if (th > 10 && !S.pouring) for (let i = 0; i < 3; i++) { const sx = cx - 6 + i * 6 + Math.round(Math.sin(t * 2 + i) * 2), sy = base - gh - 10 - ((t * 14 + i * 9) % 26); A.px(sx, sy, 'rgba(255,255,255,0.4)'); A.px(sx + 1, sy - 1, 'rgba(255,255,255,0.3)'); }
        // the teapot, in a hand: blackened aluminium, a long curved spout; higher or lower; tipping when you pour
        const ky = gy - 22 - Math.round(S.h * 74), kx = cx - 58, tip = S.pouring ? 1 : 0;
        A.poly([[kx - 60, ky - 44], [kx - 46, ky - 50], [kx - 16, ky - 20], [kx - 26, ky - 14]], '#3e6ab0'); A.line(kx - 58, ky - 45, kx - 24, ky - 16, '#5a88d0');   // a sleeve, from the upper left
        A.ell(kx - 16, ky - 15, 6, 5, PAL.skin[2]); A.ell(kx - 17, ky - 16, 3, 2, PAL.skin[1]); A.px(kx - 12, ky - 12, PAL.skin[3]);                                      // the hand round the handle
        A.line(kx - 13, ky - 18, kx - 14, ky - 6, '#2a2c34'); A.line(kx - 12, ky - 18, kx - 13, ky - 6, '#2a2c34'); A.line(kx - 14, ky - 6, kx - 8, ky + 2, '#2a2c34');                   // the handle
        A.ell(kx, ky, 17, 15, PAL.line); A.ell(kx, ky, 16, 14, '#6a7480'); A.ell(kx - 4, ky - 4, 9, 7, '#9aa4ae'); A.ell(kx - 7, ky - 7, 3, 2, '#dfe6ea'); A.ell(kx + 4, ky + 5, 10, 6, '#4a525c');
        A.r(kx - 8, ky - 17, 16, 4, '#4a525c'); A.r(kx - 2, ky - 21, 4, 4, '#2a2c34');
        const sp = [[kx + 14, ky + 2], [kx + 22, ky - 4 + tip * 4], [kx + 30, ky - 8 + tip * 10], [kx + 36, ky - 8 + tip * 16]];
        for (let i = 0; i + 1 < sp.length; i++) { A.line(sp[i][0], sp[i][1], sp[i + 1][0], sp[i + 1][1], PAL.line); A.line(sp[i][0], sp[i][1] - 1, sp[i + 1][0], sp[i + 1][1] - 1, '#6a7480'); }
        const [sx0, sy0] = sp[sp.length - 1];
        if (S.pouring) {                                                                                                                             // the stream: an arc, falling into the glass
            const top = base - th - fh;
            for (let y = sy0; y < top; y++) { const k = (y - sy0) / Math.max(1, top - sy0), x = Math.round(sx0 + (cx - sx0) * Math.sqrt(k) + Math.sin(y * 0.7 + t * 30) * 0.6); A.px(x - 1, y, '#e88a3c'); A.px(x, y, (y + (t * 40 | 0)) % 3 ? '#c86c24' : '#f8b060'); A.px(x + 1, y, '#a85418'); }
            if (S.h > 0.45) for (let i = 0; i < 3; i++) A.px(cx - 4 + ((t * 50 + i * 7) % 9), top - 1 - (i & 1), '#fff4d8');
        }
        for (const d of S.drops) A.r(Math.round(cx + d.x), Math.round(base - th + d.y), 2, 2, '#c86c24');
        // the gauges, in brass frames
        const bx = Math.min(cx + 104, VW - 130), bw = Math.min(120, VW - bx - 10);
        if (bw > 70) {
            A.r(bx - 6, gy - 30, bw + 12, 58, '#3a2410'); A.r(bx - 5, gy - 29, bw + 10, 56, '#a87818'); A.r(bx - 3, gy - 27, bw + 6, 52, '#2a1c10');
            miniBar(g, A, bx, gy - 22, bw, 'GLASS', S.level, [0.78, 0.94]);
            miniBar(g, A, bx, gy - 6, bw, 'FOAM', S.foam, [0.5, 1]);
            miniBar(g, A, bx, gy + 10, bw, 'HEIGHT', S.h, null, S.h > 0.85);
        }
        const say = S.pouring ? (S.h > 0.85 ? 'Too high: it\'s splashing!' : S.h > 0.45 ? 'The foam is rising.' : 'Pour from higher for foam.') : 'Hold SPACE to pour. Stop between the gold lines.';
        Txt.draw(g, say, cx, 30, { col: S.pouring && S.h > 0.85 ? '#f07060' : '#f4e4c0', align: 'center', shadow: '#1c1410' });
    },
};

// ============================================================
// DARTS — a real board
// ============================================================
const DART_ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const DART_R = 86, DART_RINGS = { bull: 4, outer: 9, t0: 49, t1: 55, d0: 80, d1: 86 };     // radii in pixels: a real board's layout, the trebles and doubles a touch wider
function dartScore(dx, dy) {
    const d = Math.hypot(dx, dy), R = DART_RINGS;
    if (d <= R.bull) return [50, 'BULL'];
    if (d <= R.outer) return [25, '25'];
    if (d > R.d1) return [0, 'WALL'];
    const a = (Math.atan2(dx, -dy) / (Math.PI * 2) + 1 + 1 / 40) % 1, n = DART_ORDER[Math.floor(a * 20)];
    if (d >= R.t0 && d <= R.t1) return [n * 3, 'T' + n];
    if (d >= R.d0) return [n * 2, 'D' + n];
    return [n, String(n)];
}
function dartBoard() {
    if (dartBoard.c) return dartBoard.c;
    const S = DART_R + 16, [c, g] = mk(S * 2, S * 2), A = pa(g), R = DART_RINGS;
    A.ell(S, S, S - 1, S - 1, '#1c1814'); A.ell(S, S, S - 3, S - 3, '#2e2824');
    for (let y = -DART_R; y <= DART_R; y++) for (let x = -DART_R; x <= DART_R; x++) {
        const d = Math.hypot(x, y); if (d > DART_R) continue;
        const a = (Math.atan2(x, -y) / (Math.PI * 2) + 1 + 1 / 40) % 1, seg = Math.floor(a * 20), even = seg % 2 === 0;
        let col;
        if (d <= R.bull) col = '#d03828'; else if (d <= R.outer) col = '#2e8a3a';
        else if ((d >= R.t0 && d <= R.t1) || d >= R.d0) col = even ? '#d03828' : '#2e8a3a';
        else col = even ? '#1c1814' : '#f0e0b8';
        A.px(S + x, S + y, col);
    }
    for (let i = 0; i < 20; i++) {                                  // the numbers round the rim
        const a = (i / 20) * Math.PI * 2, x = S + Math.sin(a) * (DART_R + 8), y = S - Math.cos(a) * (DART_R + 8);
        g.drawImage(Txt.make(String(DART_ORDER[i]), '#f0e0b8'), Math.round(x - Txt.width(String(DART_ORDER[i])) / 2 - 1), Math.round(y - 7));
    }
    return (dartBoard.c = c);
}
MINIS.darts = {
    title: 'CAMP DARTS', keys: '◄►▲▼ aim    hold SPACE: steady    let go: throw    ESC: leave',
    start(o) { return { ax: 0, ay: -52, steady: 0, holding: false, darts: [], score: 0, fly: null, best: o.best || 132, pop: null, sway: 0 }; },
    sway(S) { const t = S.t * 1.25, A = S.amp; return [(Math.sin(t * 1.9) * 0.6 + Math.sin(t * 3.7 + 1.3) * 0.4) * A, (Math.sin(t * 2.3 + 0.7) * 0.6 + Math.sin(t * 4.1 + 2.1) * 0.4) * A]; },
    update(S, dt, I, keys, pressed, released) {
        if (S.fly) {                                                 // a dart in the air
            S.fly.t += dt;
            if (S.fly.t >= 0.22) {
                const [v, name] = dartScore(S.fly.x, S.fly.y);
                S.darts.push({ x: S.fly.x, y: S.fly.y, v }); S.score += v; S.pop = { s: name === 'WALL' ? 'WALL' : name === String(v) ? String(v) : name + '  ' + v, t: 0 };
                Sfx.tone(v ? 180 : 90, 0.08, 'triangle', 0.1, 70); if (v >= 50) Sfx.get();
                S.fly = null; S.steady = 0;
                if (S.darts.length >= 3) {
                    const s = S.score, beat = s > S.best;
                    Mini.finish({ score: s }, beat ? 'The Rais\'s chalk mark falls. From the fire, a roar.' : s >= 100 ? 'From inside the dorm: "Not bad, Doctor."' : s >= 60 ? 'A grunt of acknowledgment through the dorm wall.' : 'From inside the dorm: "The wall. Again."', s + (beat ? '  · BEATS THE RAIS\'S ' + S.best : '  (the Rais: ' + S.best + ')'));
                }
            }
            return;
        }
        if (S.pop) S.pop.t += dt;
        if (!keys.act) { S.ax += ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * dt * 60; S.ay += ((keys.down ? 1 : 0) - (keys.up ? 1 : 0)) * dt * 60; }
        S.ax = Math.max(-DART_R - 10, Math.min(DART_R + 10, S.ax)); S.ay = Math.max(-DART_R - 10, Math.min(DART_R + 10, S.ay));
        // your hand sways; holding SPACE steadies it for a second or two, then your arm starts to shake
        if (keys.act) S.steady += dt;
        const st = S.steady;
        if (!released) S.amp = !keys.act ? 19 : st < 1 ? 19 - st * 10 : st < 1.7 ? 9 : Math.min(30, 9 + (st - 1.7) * 18);   // (letting go throws with the steadiness you had)
        // the dart goes near where the sway has the aim, but anywhere up to half the blue circle off it
        if (released && st > 0.05) { const [sx, sy] = this.sway(S), a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * S.amp * 0.55; S.fly = { t: 0, x: S.ax + sx + Math.cos(a) * r, y: S.ay + sy + Math.sin(a) * r }; Sfx.tone(700, 0.05, 'square', 0.03, 300); }
    },
    draw(S, g, A, VW, VH) {
        const cx = VW >> 1, cy = Math.min(VH >> 1, 128) + 6, b = dartBoard();
        g.drawImage(b, cx - (b.width >> 1), cy - (b.height >> 1));
        for (const d of S.darts) { const x = Math.round(cx + d.x), y = Math.round(cy + d.y); A.line(x, y, x + 5, y + 7, PAL.line); A.line(x + 1, y, x + 5, y + 6, '#c8c8c8'); A.r(x + 4, y + 6, 3, 3, '#d04838'); }
        if (S.fly) { const k = S.fly.t / 0.22, x = Math.round(cx + S.fly.x + (1 - k) * 60), y = Math.round(cy + S.fly.y + (1 - k) * 90); A.line(x, y, x + 5, y + 7, '#c8c8c8'); A.r(x + 4, y + 6, 3, 3, '#d04838'); }
        else {                                                       // the aim, where the sway has it right now
            const [sx, sy] = this.sway(S), x = Math.round(cx + S.ax + sx), y = Math.round(cy + S.ay + sy), col = S.steady > 1.7 ? '#f05030' : S.amp < 10 ? '#60f060' : '#ffffff';
            A.r(x - 6, y, 4, 1, col); A.r(x + 3, y, 4, 1, col); A.r(x, y - 6, 1, 4, col); A.r(x, y + 3, 1, 4, col); A.px(x, y, col);
            const r = Math.round(S.amp), nd = r * 7; if (r > 2) for (let i = 0; i < nd; i++) { const a = i / nd * Math.PI * 2, px = Math.round(cx + S.ax + Math.cos(a) * r), py = Math.round(cy + S.ay + Math.sin(a) * r); A.px(px + 1, py + 1, '#101838'); A.px(px, py, '#58b0ff'); }   // (how far your hand sways: the blue ring)
        }
        if (S.pop && S.pop.t < 1.2) Txt.draw(g, S.pop.s, cx, cy - DART_R - 30, { col: '#ffe890', shadow: '#101838', align: 'center' });
        const px = VW - 12;
        Txt.draw(g, 'SCORE  ' + S.score, px, 30, { col: '#ffe890', align: 'right' });
        Txt.draw(g, 'DARTS  ' + '▮'.repeat(3 - S.darts.length) + '▯'.repeat(S.darts.length), px, 44, { col: '#c8d0f0', align: 'right' });
        Txt.draw(g, 'THE RAIS  ' + S.best, px, 58, { col: '#8898d0', align: 'right' });
    },
};

// ============================================================
// PETAMUN'S SEAL
// ============================================================
const SEAL_GLYPH = {
    owl(A, x, y, c) { A.ell(x, y - 1, 4, 5, c); A.px(x - 2, y - 3, '#1c1814'); A.px(x + 2, y - 3, '#1c1814'); A.poly([[x - 4, y - 6], [x - 2, y - 4], [x - 4, y - 3]], c); A.poly([[x + 4, y - 6], [x + 2, y - 4], [x + 4, y - 3]], c); A.r(x - 2, y + 4, 1, 3, c); A.r(x + 1, y + 4, 1, 3, c); A.r(x + 3, y + 1, 3, 2, c); },
    eye(A, x, y, c) { A.ell(x, y, 6, 3, c); A.ell(x, y, 2, 2, '#1c1814'); A.r(x - 6, y - 5, 12, 1, c); A.line(x + 1, y + 3, x - 1, y + 7, c); A.line(x - 2, y + 3, x - 5, y + 6, c); A.px(x - 6, y + 5, c); },
    serpent(A, x, y, c) { A.ell(x - 3, y - 4, 2, 2, c); A.r(x - 4, y - 3, 2, 3, c); for (let i = 0; i < 12; i++) A.r(x - 3 + i, y + Math.round(Math.sin(i * 0.9) * 2), 1, 2, c); A.px(x - 2, y - 5, '#1c1814'); },
    lion(A, x, y, c) { A.ell(x, y, 6, 3, c); A.ell(x - 5, y - 2, 3, 3, c); A.r(x - 5, y + 2, 1, 4, c); A.r(x - 2, y + 2, 1, 4, c); A.r(x + 3, y + 2, 1, 4, c); A.r(x + 5, y + 2, 1, 4, c); A.line(x + 6, y - 1, x + 8, y - 5, c); A.px(x - 6, y - 3, '#1c1814'); },
};
MINIS.seal = {
    title: 'THE OLD SEAL', keys: '◄►▲▼ choose a stone    SPACE: press it    ESC: step back',
    start() { return { pos: sflag('seal_pos') || SEAL_ORDER.slice(), sel: 0, awake: false, energy: 1, input: 0, flash: [], note: '', noteT: 0, dart: 0 }; },
    update(S, dt, I) {
        const DIRS = [['up', 0], ['right', 1], ['down', 2], ['left', 3]];
        for (const [k, i] of DIRS) if (I[k] && S.sel !== i) { S.sel = i; Sfx.move(); }
        if (S.awake) {
            S.energy -= dt / 10;
            if (S.energy <= 0) { S.awake = false; S.energy = 1; S.input = 0; S.note = 'The resonance fades. The seal sleeps again.'; S.noteT = 2.5; Sfx.back(); }
        }
        S.noteT -= dt; S.flash = S.flash.filter(f => (f.t += dt) < 0.6);
        if (S.dart) { S.dart += dt; if (S.dart > 0.9) Mini.finish({ dart: true, ok: false }, 'Wrong stone. A cedar dart hisses out of the rock and grazes your leg.', 'THE SEAL REMEMBERS'); return; }
        if (!I.ok) return;
        if (!S.awake) { S.awake = true; S.energy = 1; S.input = 0; Sfx.tone(196, 0.5, 'sine', 0.06); S.note = 'The amber core wakes with a hum you feel in your teeth.'; S.noteT = 2; }
        const glyph = S.pos[S.sel];
        if (glyph === SEAL_ORDER[S.input]) {
            Sfx.tone([392, 466, 554, 622][S.input], 0.3, 'triangle', 0.07); S.flash.push({ i: S.sel, t: 0, ok: true }); S.input++;
            if (S.input === 4) Mini.finish({ ok: true }, 'The four stones flash gold in turn, and something deep in the rock, old stone moving on old stone, lets go.', 'THE SEAL OPENS');
        } else { S.flash.push({ i: S.sel, t: 0, ok: false }); S.dart = 0.01; Sfx.tone(90, 0.4, 'sawtooth', 0.08, 60); }
    },
    draw(S, g, A, VW, VH) {
        const cx = VW >> 1, cy = Math.min(VH >> 1, 130) + 4, R = 62;
        // the rock face, the ring of pale stone, the amber core
        A.r(cx - 116, cy - 100, 232, 200, PAL.rock[3]); for (let i = 0; i < 44; i++) A.px(cx - 116 + Math.floor(hash2(i, 5) * 232), cy - 100 + Math.floor(hash2(i, 6) * 200), PAL.rock[4]);
        A.r(cx - 106, cy - 100, 12, 200, PAL.wood[2]); A.r(cx - 106, cy - 100, 3, 200, PAL.wood[1]);       // the timber brace
        for (let i = 0; i < 5; i++) A.px(cx - 101, cy - 60 + i * 26, PAL.dark[3]);                         // old dart holes
        Txt.draw(g, 'ΠΕΤΑΜΟΥΝ', cx + 66, cy - 94, { col: PAL.rock[1], align: 'center' });                // carved in the stone above it
        A.ell(cx, cy, R + 4, R + 4, PAL.line); A.ell(cx, cy, R + 2, R + 2, PAL.rock[0]); A.ell(cx, cy, R - 12, R - 12, PAL.line); A.ell(cx, cy, R - 14, R - 14, PAL.rock[2]);
        const glow = S.awake ? 0.5 + 0.5 * Math.sin(S.t * 8) : 0;
        A.ell(cx, cy, 20, 20, PAL.line); A.ell(cx, cy, 19, 19, S.awake ? '#e89830' : '#6a4418'); A.ell(cx - 4, cy - 5, 8, 6, S.awake ? (glow > 0.5 ? '#ffd070' : '#f0b040') : '#8a5a20');
        // the resonance: beads round the ring, going out as it drains
        for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, on = S.awake && i / 24 < S.energy; A.r(Math.round(cx + Math.sin(a) * (R - 6)) - 1, Math.round(cy - Math.cos(a) * (R - 6)) - 1, 3, 3, on ? '#ffd070' : PAL.rock[3]); }
        // the four stones at north, east, south, west
        [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], i) => {
            const x = cx + dx * (R + 18), y = cy + dy * (R + 18), f = S.flash.find(q => q.i === i), lit = i < 4 && S.awake && SEAL_ORDER.indexOf(S.pos[i]) < S.input;
            A.ell(x, y, 15, 15, PAL.line); A.ell(x, y, 14, 14, f ? (f.ok ? '#ffd070' : '#f05030') : lit ? '#f0c040' : PAL.rock[1]); A.ell(x - 3, y - 4, 8, 6, f ? '#fff4c0' : PAL.rock[0]);
            SEAL_GLYPH[S.pos[i]](A, x, y, '#4a3420');
            if (i === S.sel) { const r = 18 + ((S.t * 4 | 0) % 2); for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; A.px(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r), '#ffffff'); } }
        });
        if (S.dart) { const k = Math.min(1, S.dart / 0.2), x = Math.round(cx - 100 + k * 160), y = cy + 40; A.r(x - 10, y, 12, 2, PAL.wood[1]); A.poly([[x + 2, y - 2], [x + 6, y + 1], [x + 2, y + 4]], PAL.metal[2]); g.fillStyle = 'rgba(240,64,48,' + (0.3 * (1 - k)).toFixed(2) + ')'; g.fillRect(0, 0, VW, VH); }
        if (S.noteT > 0) Txt.draw(g, S.note, cx, VH - 32, { col: '#e8dcff', align: 'center' });
        else if (sflag('trenchA')) Txt.draw(g, 'Miriam\'s page: owl, eye, serpent, lion.', cx, VH - 32, { col: '#8898d0', align: 'center' });
    },
};

// ============================================================
// THE RACE — the old grey against Hagg Sayed's bay
// ============================================================
const RACE_LEN = 1000;
const RACE_MOMENTS = [
    { at: 0, text: 'The Rais drops his handkerchief.', opts: [['Kick hard off the line.', S => { S.boost += 30; S.tire += 0.35; }], ['Let the grey find her own pace.', S => { S.base += 4; }], ['Tuck in behind the bay and let him break the wind.', S => { S.draft = true; }]] },
    { at: 0.5, text: 'The quarry markers: pale blocks, the turn around them tight and rough with chips.', opts: [['Take the turn tight, on the inside.', S => { if (Math.random() < 0.6) { S.boost += 28; S.say = 'She takes it like a cat.'; } else { S.boost -= 26; S.say = 'She stumbles on the chips!'; } }], ['Swing wide where the footing is sure.', S => { S.boost -= 6; S.say = 'Wide and safe. The bay gains a little.'; }]] },
    { at: 0.8, text: 'Out of the turn and home: the camp lamps, the crowd at the gate. Hagg Sayed is using his whip.', opts: [['Ask her for everything, now.', S => { S.base += skillLevel('riding') >= 1 ? 8 : 5; S.tire += 0.2; }], ['Hold her till the last fifty metres, then go.', S => { S.late = true; }]] },
];
MINIS.race = {
    title: 'THE RACE', keys: 'SPACE on the gold    ▲▼ SPACE: choose    ESC: pull up',
    start() { return { me: 0, bay: 0, base: 92, boost: 0, tire: 0, draft: false, late: false, m: 0, choosing: 0, csel: 0, marker: 0, mdir: 1, zone: 0.62, hits: 0, say: '', sayT: 0, flash: 0 }; },
    update(S, dt, I, keys, pressed) {
        const mo = RACE_MOMENTS[S.m];
        if (mo && S.me >= mo.at * RACE_LEN && !S.choosing) { S.choosing = 1; S.csel = 0; }
        if (S.choosing) {
            if (I.up) { S.csel = (S.csel + mo.opts.length - 1) % mo.opts.length; Sfx.move(); }
            if (I.down) { S.csel = (S.csel + 1) % mo.opts.length; Sfx.move(); }
            if (I.ok && S.choosing > 0.3) { mo.opts[S.csel][1](S); S.m++; S.choosing = 0; S.sayT = S.say ? 2 : 0; Sfx.ok(); }
            else S.choosing += dt;
            return;
        }
        // her stride: a marker sweeping a bar; SPACE on the gold keeps her going
        S.marker += S.mdir * dt * 1.25; if (S.marker > 1) { S.marker = 1; S.mdir = -1; } if (S.marker < 0) { S.marker = 0; S.mdir = 1; }
        if (I.ok) {
            const hit = Math.abs(S.marker - S.zone) < 0.1;
            S.boost += hit ? 14 : -8; S.flash = hit ? 0.3 : -0.3; if (hit) S.hits++;
            Sfx.tone(hit ? 520 : 150, 0.06, hit ? 'square' : 'triangle', 0.05);
            S.zone = 0.3 + Math.random() * 0.55;
        }
        S.flash += (0 - S.flash) * Math.min(1, dt * 5);
        S.boost *= Math.pow(0.55, dt); S.sayT -= dt;
        let v = S.base + S.boost - S.tire * S.me * 0.02;
        if (S.draft && S.bay > S.me && S.bay - S.me < 60) v += 6;
        if (S.late && S.me > RACE_LEN * 0.95) v += 30;
        S.me += Math.max(40, v) * dt;
        const whip = S.bay > RACE_LEN * 0.8 ? 10 : 0;
        S.bay += (104 + whip + Math.sin(S.t * 1.3) * 4) * dt;
        if ((S.t * 5 | 0) !== ((S.t - dt) * 5 | 0)) Sfx.tone(80 + Math.random() * 20, 0.04, 'triangle', 0.03);   // hooves
        if (S.me >= RACE_LEN || S.bay >= RACE_LEN) {
            const won = S.me >= S.bay;
            won ? Sfx.save() : Sfx.back();
            Mini.finish({ won }, won ? 'The grey puts her nose in front at the gate by the width of a hand.' : 'The bay is a length clear at the gate.', won ? 'THE GREY WINS' : 'THE BAY WINS');
        }
    },
    draw(S, g, A, VW, VH) {
        const gy = Math.min(VH - 80, 170), cam = Math.max(S.me, S.bay) - VW * 0.55;
        // night sky, the pyramids far off, the sand, the quarry markers and the camp gate going by
        A.r(0, 26, VW, gy - 26, '#182450'); for (let i = 0; i < 40; i++) A.px(Math.floor(hash2(i, 3) * VW), 30 + Math.floor(hash2(i, 4) * (gy - 60)), '#8898d0');
        for (const [px, h, w] of [[0.2, 40, 60], [0.45, 56, 80], [0.7, 30, 46]]) { const x = Math.round(((px * VW - cam * 0.08) % (VW + 200) + VW + 200) % (VW + 200) - 100); A.poly([[x - w, gy - 6], [x, gy - 6 - h], [x + w, gy - 6]], '#34406c'); A.poly([[x, gy - 6 - h], [x + w, gy - 6], [x + w * 0.3, gy - 6]], '#283458'); }
        A.r(0, gy - 6, VW, VH - gy - 14, PAL.sand[3]); A.r(0, gy + 18, VW, VH - gy - 32, PAL.sand[2]);
        for (let i = 0; i < 30; i++) { const x = Math.round(((i * 57 - cam) % VW + VW) % VW); A.r(x, gy + 26 + (i % 3) * 6, 3, 1, PAL.sand[4]); }
        const mk = (d, draw) => { const x = Math.round(d - cam); if (x > -40 && x < VW + 40) draw(x); };
        mk(RACE_LEN * 0.5, x => { A.r(x - 8, gy - 22, 16, 18, PAL.rock[1]); A.r(x - 8, gy - 22, 16, 3, PAL.rock[0]); A.r(x + 12, gy - 16, 12, 12, PAL.rock[2]); });
        mk(RACE_LEN, x => { A.r(x, gy - 40, 3, 50, PAL.wood[2]); A.r(x - 30, gy - 40, 34, 3, PAL.wood[1]); A.r(x - 30, gy - 40, 3, 50, PAL.wood[2]); });
        // the two horses and riders, galloping
        const horseAt = (d, y, P, rider, hat) => mk(d, x => {
            const f = (S.t * 10 | 0) % 2;
            horse(A, x - 30, y - 24, P);
            if (f) { A.r(x - 26, y - 6, 2, 3, PAL.sand[3]); A.r(x - 8, y - 6, 2, 3, PAL.sand[3]); }
            // the rider, leaning into it: body, arm to the reins, head, and a turban or a hat
            A.r(x - 18, y - 33, 7, 10, PAL.line); A.r(x - 17, y - 32, 5, 9, rider); A.line(x - 12, y - 29, x - 6, y - 24, PAL.line);
            A.r(x - 16, y - 38, 5, 5, PAL.line); A.r(x - 15, y - 37, 3, 4, '#a0704a');
            if (hat === 'turban') { A.r(x - 17, y - 40, 7, 3, PAL.line); A.r(x - 16, y - 39, 5, 2, '#f0ece0'); }
            else { A.r(x - 19, y - 38, 11, 1, PAL.line); A.r(x - 16, y - 41, 5, 3, '#d8b878'); }
        });
        horseAt(S.bay, gy + 4, [PAL.wood[0], PAL.wood[1], PAL.wood[3]], '#1c1814', 'turban');
        horseAt(S.me, gy + 22, [PAL.white[1], PAL.white[2], PAL.white[3]], '#6a8a58', 'hat');
        // progress along the course, and her stride bar
        const bx = 20, bw = VW - 40, by = VH - 44;
        A.r(bx, 32, bw, 3, '#30302c'); A.r(bx + Math.round(bw * S.bay / RACE_LEN) - 1, 30, 3, 7, PAL.wood[1]); A.r(bx + Math.round(bw * S.me / RACE_LEN) - 1, 30, 3, 7, '#ffffff');
        if (!S.choosing) {
            A.r(bx, by, bw, 10, '#30302c'); A.r(bx + 1, by + 1, bw - 2, 8, '#1c2442');
            A.r(bx + Math.round(bw * (S.zone - 0.1)), by + 1, Math.round(bw * 0.2), 8, '#5a4a18'); A.r(bx + Math.round(bw * S.zone), by, 1, 10, '#f0c040');
            A.r(bx + Math.round(bw * S.marker) - 1, by - 2, 3, 14, S.flash > 0.1 ? '#60f060' : S.flash < -0.1 ? '#f05030' : '#ffffff');
        }
        if (S.sayT > 0) Txt.draw(g, S.say, VW >> 1, 42, { col: '#ffe890', align: 'center', shadow: '#101838' });
        if (S.choosing) {
            const mo = RACE_MOMENTS[S.m], w = Math.min(VW - 24, 400), rows = mo.opts.map(o => Txt.wrap(o[0], w - 40)), head = Txt.wrap(mo.text, w - 24);
            const h = 16 + head.length * 12 + rows.reduce((s, r) => s + r.length * 12 + 3, 0), x = (VW - w) >> 1, y = 48;
            frame(g, x, y, w, h);
            head.forEach((ln, i) => Txt.draw(g, ln, x + 12, y + 7 + i * 12, { col: '#3058a0' }));
            let yy = y + 11 + head.length * 12;
            rows.forEach((r, i) => { const on = i === S.csel; if (on) { A.r(x + 6, yy - 2, w - 12, r.length * 12 + 2, '#d8ecff'); A.poly([[x + 10, yy + 2], [x + 10, yy + 10], [x + 15, yy + 6]], '#d04838'); } r.forEach((ln, j) => Txt.draw(g, ln, x + 22, yy + j * 12, { col: on ? UI.ink : UI.dim })); yy += r.length * 12 + 3; });
        }
    },
};
