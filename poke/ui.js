// ============================================================
// THE CODEX OF GIZA — POKE STYLE: SCREENS AND MENUS (poke/ui.js)
//   Dlg    — the text box: name tab, typewriter, pages, ▼
//   Title  — the title screen (pyramids at night) and its menu
//   (the opening and the character creator are in intro.js)
//   Menu   — the pause menu: map, journal, bag, settings, save
//   Banner — the wooden place-name plaque
// All drawn on the game canvas in the same pixel style.
// ============================================================

const UI = { ink: '#30302c', dim: '#70707c', gold: '#c89020', paper: '#f8f8f0' };

// ---- THE TEXT BOX ----
const Dlg = {
    active: false, pages: [], page: 0, shown: 0, speaker: '', onDone: null, t: 0,
    LINES: 3,
    choices: null, csel: 0, ct: 0,     // a choice box (2–4 answers) after the last page; onDone gets the index
    open(speaker, text, onDone, choices) {
        this.choices = choices && choices.length ? choices : null; this.csel = 0; this.ct = 0;
        const maxW = Game.VW - 44;
        const lines = Txt.wrap(text, maxW);
        this.pages = [];
        let cur = [];
        for (const ln of lines) {
            if (ln === '') { if (cur.length) { this.pages.push(cur); cur = []; } continue; }
            cur.push(ln);
            if (cur.length === this.LINES) { this.pages.push(cur); cur = []; }
        }
        if (cur.length) this.pages.push(cur);
        if (!this.pages.length) this.pages = [['…']];
        this.page = 0; this.shown = 0; this.t = 0;
        this.speaker = speaker && speaker !== 'System' ? speaker : '';
        this.onDone = onDone || null;
        this.active = true;
    },
    len() { return this.pages[this.page].join('').length; },
    update(dt, I) {
        this.t += dt;
        const speed = [28, 55, 110, 9999][Game.set.textSpeed];
        const before = Math.floor(this.shown);
        if (this.shown < this.len()) { this.shown = Math.min(this.len(), this.shown + dt * speed); if (Math.floor(this.shown) > before && Math.floor(this.shown) % 3 === 0) Sfx.tick(); }
        if (this.choosing()) {
            const n = this.choices.length;
            this.ct += dt;
            if (I.up) { this.csel = (this.csel + n - 1) % n; Sfx.move(); }
            if (I.down) { this.csel = (this.csel + 1) % n; Sfx.move(); }
            if (this.ct < 0.25) return;                         // a moment before it takes an answer, so mashing through text doesn't pick one
            if (I.ok || I.back) {
                const i = I.ok ? this.csel : n - 1;              // back picks the last answer (the "leave it" one)
                I.ok ? Sfx.ok() : Sfx.back();
                this.active = false; this.choices = null;
                const cb = this.onDone; this.onDone = null; if (cb) cb(i);
            }
            return;
        }
        if (I.ok || I.back) {
            if (this.shown < this.len()) this.shown = this.len();
            else if (this.page < this.pages.length - 1) { this.page++; this.shown = 0; Sfx.move(); }
            else { this.active = false; Sfx.move(); const cb = this.onDone; this.onDone = null; if (cb) cb(); }
        }
    },
    draw(g) {
        const VW = Game.VW, VH = Game.VH, h = 18 + this.LINES * 13, x = 6, y = VH - h - 5, w = VW - 12;
        frame(g, x, y, w, h);
        if (this.speaker) {
            const tw = Txt.width(this.speaker) + 16;
            frame(g, x + 8, y - 13, tw, 18, { band: '#e0a030', hi: '#ffe090' });
            Txt.draw(g, this.speaker, x + 16, y - 11, { col: UI.ink });
        }
        let left = Math.floor(this.shown);
        this.pages[this.page].forEach((ln, i) => {
            const s = ln.slice(0, Math.max(0, left)); left -= ln.length;
            Txt.draw(g, s, x + 12, y + 8 + i * 13, { col: UI.ink, shadow: '#d0d0c8' });
        });
        if (this.choosing()) this.drawChoices(g, y);
        else if (this.shown >= this.len() && (this.t * 2.5 | 0) % 2 === 0) {
            const A = pa(g), ax = x + w - 18, ay = y + h - 13;
            A.poly([[ax, ay], [ax + 8, ay], [ax + 4, ay + 5]], '#d04838');
        }
    },
    choosing() { return this.choices && this.page === this.pages.length - 1 && this.shown >= this.len(); },
    // the answers, in a window stacked on the right above the text box; long ones wrap
    drawChoices(g, boxY) {
        const A = pa(g), VW = Game.VW, maxW = Math.min(VW - 60, Math.max(200, Math.round(VW * 0.62)));
        const rows = this.choices.map(c => Txt.wrap(c, maxW));
        const w = Math.min(VW - 12, Math.max(...rows.map(r => Math.max(...r.map(l => Txt.width(l))))) + 34);
        const h = 12 + rows.reduce((s, r) => s + r.length * 12 + 4, 0);
        const x = VW - w - 6, overTab = this.speaker && x < 14 + Txt.width(this.speaker) + 16 + 4;
        const y = Math.max(4, boxY - h - (overTab ? 15 : 2));             // clear of the name tab
        frame(g, x, y, w, h);
        let yy = y + 7;
        rows.forEach((r, i) => {
            const on = i === this.csel, rh = r.length * 12;
            if (on) A.r(x + 6, yy - 2, w - 12, rh + 3, '#d8ecff');
            r.forEach((ln, j) => Txt.draw(g, ln, x + 22, yy + j * 12, { col: on ? UI.ink : UI.dim }));
            if (on) A.poly([[x + 10, yy + 2], [x + 10, yy + 10], [x + 15, yy + 6]], '#d04838');
            yy += rh + 4;
        });
    },
};

// a watch face: brass rim, white dial, twelve marks, the hands at the story time (pixel lines, no smoothing)
function drawWatch(g, cx, cy, r) {
    const A = pa(g), hr = Game.story ? storyHour() : Game.hour, h = hr % 12, m = (hr * 60) % 60;
    A.ell(cx, cy, r + 2, r + 2, UI.ink); A.ell(cx, cy, r + 1, r + 1, '#e0a030'); A.ell(cx, cy, r - 1, r - 1, UI.ink); A.ell(cx, cy, r - 2, r - 2, '#f8f8f0');
    if (r >= 6) A.r(cx - 1, cy - r - 4, 3, 2, '#e0a030');
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; if (r >= 12 || i % 3 === 0) A.px(Math.round(cx + Math.sin(a) * (r - 4)), Math.round(cy - Math.cos(a) * (r - 4)), i % 3 ? '#9aa0a8' : UI.ink); }
    const hand = (f, len, col) => { const a = f * Math.PI * 2; A.line(cx, cy, Math.round(cx + Math.sin(a) * len), Math.round(cy - Math.cos(a) * len), col); };
    hand(h / 12, Math.max(2, Math.round(r * 0.5)), UI.ink); hand(m / 60, Math.max(3, r - 5), '#3058a0');
    A.px(cx, cy, '#d04838');
}

// ---- THE CHAPTER-END CARD ----
// What you did that carries forward, then: keep exploring, or back to the title
const EndCard = {
    open: false, lines: [], sel: 0, t: 0, title: '', sub: '', next: '', scroll: 0, maxScroll: 0,
    show(title, sub, lines, next) { Object.assign(this, { open: true, title, sub, lines, next, sel: 0, t: 0, scroll: 0 }); Sfx.save(); },
    update(dt, I) {
        this.t += dt;
        if (this.t < 1) return;
        if (I.left || I.right) { this.sel = 1 - this.sel; Sfx.move(); }
        if (I.up && this.scroll > 0) { this.scroll--; Sfx.tick(); }
        if (I.down && this.scroll < this.maxScroll) { this.scroll++; Sfx.tick(); }
        if (I.ok) {
            Sfx.ok(); this.open = false;
            if (this.sel === 1) Game.fadeTo(() => { Game.state = 'title'; Title.sel = 0; });
        }
    },
    draw(g) {
        const VW = Game.VW, VH = Game.VH, A = pa(g), a = Math.min(1, this.t / 0.8);
        g.fillStyle = 'rgba(12,10,24,' + (0.92 * a).toFixed(2) + ')'; g.fillRect(0, 0, VW, VH);
        if (this.t < 0.5) return;
        const w = Math.min(VW - 16, 460), x = (VW - w) >> 1, tw = w - 40;
        // every line of what you did, as rows of text (a bullet on each first row)
        const rows = []; this.lines.forEach(l => Txt.wrap(l, tw - 12).forEach((ln, i) => rows.push([ln, i === 0])));
        const next = Txt.wrap(this.next, tw), fixed = 52 + 6 + next.length * 12 + 30;
        const fit = Math.max(3, Math.floor((VH - 8 - fixed) / 12)), shown = Math.min(rows.length, fit);
        this.maxScroll = Math.max(0, rows.length - fit); this.scroll = Math.min(this.scroll, this.maxScroll);
        const h = fixed + shown * 12, y = Math.max(2, (VH - h) >> 1);
        frame(g, x, y, w, h, { band: '#e0a030', hi: '#ffe090' });
        Txt.draw(g, this.title, VW >> 1, y + 7, { col: UI.gold, align: 'center' });
        Txt.draw(g, this.sub, VW >> 1, y + 19, { col: UI.dim, align: 'center' });
        frieze(g, x + 12, y + 32, w - 24);
        let yy = y + 52;
        for (let i = 0; i < shown; i++) { const [ln, first] = rows[this.scroll + i]; if (first) A.r(x + 22, yy + 4, 3, 3, '#c89020'); Txt.draw(g, ln, x + 32, yy, { col: UI.ink }); yy += 12; }
        if (this.maxScroll) {                                    // ▲▼ when there's more above or below
            if (this.scroll > 0) A.poly([[x + w - 18, y + 58], [x + w - 10, y + 58], [x + w - 14, y + 53]], '#d04838');
            if (this.scroll < this.maxScroll) A.poly([[x + w - 18, yy - 8], [x + w - 10, yy - 8], [x + w - 14, yy - 3]], '#d04838');
        }
        yy += 6; next.forEach((ln, i) => Txt.draw(g, ln, x + 20, yy + i * 12, { col: '#3058a0' }));
        yy = y + h - 20;
        ['KEEP EXPLORING THE CAMP', 'RETURN TO TITLE'].forEach((s, i) => {
            const bx = x + 20 + i * ((w - 40) >> 1), on = i === this.sel;
            if (on) A.poly([[bx, yy + 2], [bx, yy + 10], [bx + 5, yy + 6]], '#d04838');
            Txt.draw(g, s, bx + 10, yy, { col: on ? UI.ink : UI.dim });
        });
    },
};

// ---- PLACE NAMES ----
const Banner = {
    text: '', t: 99,
    show(name) { this.text = name; this.t = 0; },
    update(dt) { this.t += dt; },
    draw(g) {
        if (this.t > 3.4 || !this.text) return;
        const w = Txt.width(this.text) + 22, slide = this.t < 0.3 ? this.t / 0.3 : this.t > 3 ? (3.4 - this.t) / 0.4 : 1;
        const y = Math.round(-26 + 32 * slide);
        plaque(g, 8, y, w, 20);
        Txt.draw(g, this.text, 19, y + 4, { col: '#fff4d0', shadow: PAL.wood[3] });
    },
};

// a small popup line at the top ("Got a painted sherd!")
const Toast = {
    text: '', t: 99, dur: 2.6,
    show(s, dur) { this.text = s; this.t = 0; this.dur = dur || 2.6; },
    draw(g, dt) {
        this.t += dt;
        if (this.t > this.dur || !this.text) return;
        const w = Txt.width(this.text) + 24, x = (Game.VW - w) >> 1;
        frame(g, x, 30, w, 22, { band: '#58a848', hi: '#b8f0a0' });
        Txt.draw(g, this.text, x + 12, 35, { col: UI.ink });
    },
};

// ---- THE TITLE SCREEN ----
// the night sky over the pyramids, used by the title and the intro
function drawNightScene(g, t, dim) {
    const VW = Game.VW, VH = Game.VH, A = pa(g);
    const sky = ['#101838', '#182450', '#243470', '#384888', '#5060a0', '#7878b0', '#a890b0', '#d8a090'];
    const hz = Math.round(VH * 0.66);
    for (let i = 0; i < sky.length; i++) {
        const y0 = Math.round(hz * i / sky.length), y1 = Math.round(hz * (i + 1) / sky.length);
        A.r(0, y0, VW, y1 - y0, sky[i]);
        if (i < sky.length - 1) A.dith(0, y1 - 4, VW, 4, sky[i + 1], i);
    }
    for (let i = 0; i < 90; i++) {                                // stars, a few twinkling
        const x = Math.floor(hash2(i, 1) * VW), y = Math.floor(hash2(i, 2) * hz * 0.75), tw = hash2(i, 3);
        if (tw > 0.8 && Math.sin(t * 2 + i) > 0.4) { A.px(x, y, '#ffffff'); A.px(x - 1, y, '#a8b8e8'); A.px(x + 1, y, '#a8b8e8'); A.px(x, y - 1, '#a8b8e8'); A.px(x, y + 1, '#a8b8e8'); }
        else A.px(x, y, tw > 0.5 ? '#e8f0ff' : '#8898d0');
    }
    A.ell(Math.round(VW * 0.82), Math.round(VH * 0.16), 11, 11, '#fff8d8'); A.ell(Math.round(VW * 0.82) - 4, Math.round(VH * 0.16) - 3, 3, 2, '#e8dcb0'); A.ell(Math.round(VW * 0.82) + 4, Math.round(VH * 0.16) + 4, 2, 2, '#e8dcb0');
    // the three pyramids: a moonlit face and a dark one each
    const pyr = (cx, base, h, w) => {
        A.poly([[cx - w, base], [cx, base - h], [cx + w * 0.3, base]], '#6878a8');
        A.poly([[cx + w * 0.3, base], [cx, base - h], [cx + w, base]], '#384070');
        for (let j = 6; j < h; j += 7) A.hl(Math.round(cx - w * (1 - j / h) + 2), base - j, Math.round(w * 0.5 * (1 - j / h)), '#7c8cb8');
    };
    pyr(VW * 0.24, hz + 4, VH * 0.26, VW * 0.15); pyr(VW * 0.5, hz + 6, VH * 0.36, VW * 0.2); pyr(VW * 0.76, hz + 4, VH * 0.2, VW * 0.12);
    // dunes in front, and the camp's lights far off
    A.r(0, hz, VW, VH - hz, '#34406c');
    for (let x = 0; x < VW; x++) { const y = hz + 6 + Math.round(Math.sin(x * 0.021 + 1) * 5 + Math.sin(x * 0.007) * 9); A.r(x, y, 1, VH - y, '#283458'); const y2 = hz + 30 + Math.round(Math.sin(x * 0.013 + 4) * 8 + Math.sin(x * 0.05) * 2); A.r(x, y2, 1, VH - y2, '#1c2442'); }
    for (let i = 0; i < 7; i++) { const x = Math.round(VW * 0.3 + i * 13 + hash2(i, 9) * 8), y = hz + 16 + Math.round(hash2(i, 8) * 6); A.px(x, y, Math.sin(t * 3 + i * 2) > -0.6 ? '#ffd070' : '#c08030'); A.px(x, y + 1, '#806038'); }
    const P = Title.palm || (Title.palm = palm('title'));
    g.globalAlpha = 1; g.drawImage(Title.dark(P.c), 14, VH - 92); g.drawImage(Title.dark(palm('title2').c), VW - 84, VH - 80);
    if (dim) { g.fillStyle = 'rgba(8,10,28,' + dim + ')'; g.fillRect(0, 0, VW, VH); }
}

const Title = {
    sel: 0, t: 0, darkC: new Map(),
    dark(c) {                                                       // a silhouette of a sprite
        let d = this.darkC.get(c);
        if (d) return d;
        const [cv, g] = mk(c.width, c.height);
        g.drawImage(c, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#10142c'; g.fillRect(0, 0, c.width, c.height);
        this.darkC.set(c, cv);
        return cv;
    },
    items() { return (Game.hasSave() ? ['CONTINUE'] : []).concat(['NEW GAME', 'SETTINGS']); },
    update(dt, I) {
        this.t += dt;
        const it = this.items();
        if (I.up) { this.sel = (this.sel + it.length - 1) % it.length; Sfx.move(); }
        if (I.down) { this.sel = (this.sel + 1) % it.length; Sfx.move(); }
        if (I.ok) {
            Sfx.ok();
            const k = it[this.sel];
            if (k === 'CONTINUE') Game.fadeTo(() => Game.load());
            else if (k === 'NEW GAME') Game.fadeTo(() => { Game.state = 'intro'; Intro.start(); });
            else { Menu.open = true; Menu.page = 'settings'; Menu.fromTitle = true; Menu.sel = 0; }
        }
    },
    draw(g) {
        const VW = Game.VW, VH = Game.VH, A = pa(g);
        drawNightScene(g, this.t);
        // a shooting star, now and then
        const st = (this.t % 9) / 0.6;
        if (st < 1) { const sx = VW * 0.72 - st * 110, sy = VH * 0.08 + st * 46; A.line(sx, sy, sx + 12, sy - 5, '#ffffff'); A.line(sx + 12, sy - 5, sx + 26, sy - 11, '#8898d0'); }
        // the winged sun, the name in gold, a frieze beneath it
        const k = VW >= 560 ? 2 : 1, ty = Math.round(VH * 0.1 + Math.sin(this.t * 1.2) * 2);
        wingedSun(g, VW >> 1, ty + 4, 34 * k);
        const logo = (str, y, col) => {
            const sh = Txt.make(str, '#4c2404', Txt.BIG), c = Txt.make(str, col, Txt.BIG), x = (VW - c.width * k) >> 1;
            for (const [dx, dy] of [[k, k], [k, 0], [0, k], [-k, 0], [0, -k], [k * 2, k * 2]]) bigSprite(g, sh, x + dx, y + dy, k);
            bigSprite(g, c, x, y, k);
        };
        logo('THE CODEX', ty + 12, '#ffe890'); logo('OF GIZA', ty + 12 + 23 * k, '#f0c040');
        const fy = ty + 14 + 50 * k;
        frieze(g, (VW >> 1) - 98, fy, 196);
        Txt.draw(g, 'The last library of Egypt is still out there.', VW >> 1, fy + 21, { col: '#e8dcff', shadow: '#182450', align: 'center' });
        const it = this.items(), bw = 116, bx = (VW - bw) >> 1, by = Math.min(VH - 36 - it.length * 15, Math.max(fy + 42, Math.round(VH * 0.66)));
        frame(g, bx, by, bw, 14 + it.length * 15, { band: '#e0a030', hi: '#ffe090' });
        it.forEach((str, i) => {
            Txt.draw(g, str, bx + 26, by + 8 + i * 15, { col: i === this.sel ? UI.ink : UI.dim });
            if (i === this.sel) A.poly([[bx + 13, by + 10 + i * 15], [bx + 13, by + 18 + i * 15], [bx + 18, by + 14 + i * 15]], '#d04838');
        });
        Txt.draw(g, 'POKE-STYLE BUILD  P0.22', VW - 6, VH - 14, { col: '#8898d0', align: 'right' });
        Txt.draw(g, '▲▼ choose    SPACE select', 6, VH - 14, { col: '#8898d0' });
    },
};

// ---- THE PAUSE MENU ----
const Menu = {
    open: false, page: 'main', sel: 0, sub: 0, fromTitle: false, saved: 0,
    MAIN: ['MAP', 'TASKS', 'JOURNAL', 'BAG', 'SETTINGS', 'SAVE', 'TITLE SCREEN', 'CLOSE'],
    SETTINGS: [
        { key: 'textSpeed', label: 'Text speed', opts: ['Slow', 'Normal', 'Fast', 'Instant'] },
        { key: 'time', label: 'Time of day', opts: ['Dawn', 'Day', 'Dusk', 'Night', 'Moving clock', 'Story clock'] },
        { key: 'run', label: 'Always run', opts: ['Off', 'On'] },
        { key: 'zoom', label: 'Zoom', opts: ['Auto', 'Far', 'Near'] },
        { key: 'volume', label: 'Sound', opts: ['Off', 'Low', 'Normal', 'Loud'] },
        { key: 'music', label: 'Music', opts: ['Off', 'Low', 'Normal', 'Loud'] },
        { key: 'names', label: 'Name tags', opts: ['Off', 'When near'] },
        { key: 'notices', label: 'Choice notices', opts: ['Off', 'On'] },
    ],
    toggle() { this.open = !this.open; this.page = 'main'; this.sel = 0; this.fromTitle = false; Sfx.move(); },
    update(dt, I) {
        const P = this.page;
        if (P === 'main') {
            if (I.up) { this.sel = (this.sel + this.MAIN.length - 1) % this.MAIN.length; Sfx.move(); }
            if (I.down) { this.sel = (this.sel + 1) % this.MAIN.length; Sfx.move(); }
            if (I.back || I.menu) { this.open = false; Sfx.back(); return; }
            if (I.ok) {
                const k = this.MAIN[this.sel]; Sfx.ok();
                if (k === 'CLOSE') this.open = false;
                else if (k === 'SAVE') { Game.save(); this.saved = 2.2; Sfx.save(); }
                else if (k === 'TITLE SCREEN') { this.open = false; Game.fadeTo(() => { Game.state = 'title'; Title.sel = 0; }); }
                else if (k === 'MAP') { this.open = false; WorldMap.show(0); }
                else { this.page = k.toLowerCase(); this.sub = 0; }
            }
        } else if (P === 'settings') {
            const S = this.SETTINGS;
            if (I.up) { this.sub = (this.sub + S.length - 1) % S.length; Sfx.move(); }
            if (I.down) { this.sub = (this.sub + 1) % S.length; Sfx.move(); }
            const row = S[this.sub], n = row.opts.length, cur = Game.setIndex(row.key);
            if (I.left) { Game.setFromIndex(row.key, (cur + n - 1) % n); Sfx.tick(); }
            if (I.right || I.ok) { Game.setFromIndex(row.key, (cur + 1) % n); Sfx.tick(); }
            if (I.back || I.menu) { Sfx.back(); Game.saveSettings(); if (this.fromTitle) { this.open = false; this.fromTitle = false; } else this.page = 'main'; }
        } else {
            const n = P === 'journal' ? Game.journal.length : P === 'bag' ? Game.bagList().length : P === 'tasks' ? Story.s.tasks.length : 0;
            if (n) { if (I.up) { this.sub = (this.sub + n - 1) % n; Sfx.move(); } if (I.down) { this.sub = (this.sub + 1) % n; Sfx.move(); } }
            if (P === 'bag' && I.ok) { const it = Game.bagList()[this.sub]; if (it && it[2] && ITEM_USE[it[2]]) { ITEM_USE[it[2]](); Sfx.ok(); this.sub = Math.min(this.sub, Game.bagList().length - 1); } }
            if (I.back || I.menu) { Sfx.back(); this.page = 'main'; }
        }
        this.saved -= dt;
    },
    draw(g) {
        const VW = Game.VW, A = pa(g);
        let VH = Game.VH;
        if (this.page === 'main') {
            g.fillStyle = 'rgba(16,12,28,0.22)'; g.fillRect(0, 0, VW, VH);
            const w = 142, x = VW - w - 6, y = 6, h = 14 + this.MAIN.length * 16;
            frame(g, x, y, w, h);
            this.MAIN.forEach((str, i) => {
                const on = i === this.sel, yy = y + 8 + i * 16;
                if (on) A.r(x + 6, yy - 3, w - 12, 15, '#d8ecff');
                ICONS[str](A, x + 22, yy + 1);
                Txt.draw(g, str, x + 38, yy, { col: on ? UI.ink : UI.dim });
                if (on) A.poly([[x + 10, yy + 2], [x + 10, yy + 10], [x + 15, yy + 6]], '#d04838');
            });
            // your permit card: who, where, when
            frame(g, 6, 6, 214, 92, { band: '#e0a030', hi: '#ffe090' });
            A.r(14, 14, 44, 62, '#38404c'); A.r(16, 16, 40, 58, '#b8d4f0'); A.r(16, 56, 40, 18, '#ecd698');
            if (Game.player.sheet) g.drawImage(Game.player.sheet.frames[0][[1, 0, 2, 0][(Game.time * 4 | 0) % 4]], 20, 32);
            Txt.draw(g, bgOf(Game.player.bg).title(Game.player.name || '—'), 66, 14, { col: UI.ink });
            let where = Game.placeName().replace(/^THE /, ''); while (Txt.width(where) > 138 && where.length > 4) where = where.slice(0, -1);
            Txt.draw(g, where, 66, 29, { col: UI.dim });
            Txt.draw(g, Game.clockText() + (sflag('injured') ? '  LIMPING' : ''), 66, 43, { col: sflag('injured') ? '#b03828' : UI.dim });
            const nd = needs(), mw = Txt.draw(g, money().toLocaleString('en') + ' EGP', 66, 57, { col: '#3a7a30' });
            Txt.draw(g, 'W' + Math.round(nd.water) + '% F' + Math.round(nd.food) + '%', 66 + mw + 8, 57, { col: nd.water <= 20 || nd.food <= 20 ? '#b03828' : '#3058a0' });
            Txt.draw(g, 'Finds ' + Game.findCount() + '    Places ' + Object.keys(Game.seen).length + '/' + Game.maps.ch1.places.length, 66, 71, { col: UI.dim });
            if (this.saved > 0) { frame(g, (VW >> 1) - 60, VH - 40, 120, 24, { band: '#58a848', hi: '#b8f0a0' }); Txt.draw(g, 'Game saved.', VW >> 1, VH - 34, { align: 'center', col: UI.ink }); }
            return;
        }
        g.fillStyle = '#101838'; g.fillRect(0, 0, VW, VH);
        frame(g, 6, 6, VW - 12, VH - 12);
        Txt.draw(g, this.page.toUpperCase(), 18, 12, { col: UI.gold });
        Txt.draw(g, 'ESC: back', VW - 18, 12, { col: UI.dim, align: 'right' });
        if (this.page === 'bag') {                              // the watch: always there in the bag
            const tx = VW - 30 - Txt.width('ESC: back'), s = Game.clockText();
            Txt.draw(g, s, tx, 12, { col: '#3058a0', align: 'right' });
            drawWatch(g, tx - Txt.width(s) - 10, 18, 6);
        }
        frieze(g, 12, 25, VW - 24);
        // (everything below sits under the frieze)
        g.save(); g.translate(0, 14); VH -= 14;
        if (this.page === 'settings') {
            this.SETTINGS.forEach((row, i) => {
                const y = 36 + i * 18, on = i === this.sub;
                if (on) A.r(14, y - 3, VW - 28, 16, '#d8ecff');
                Txt.draw(g, row.label, 24, y, { col: on ? UI.ink : UI.dim });
                const v = row.opts[Game.setIndex(row.key)];
                Txt.draw(g, (on ? '◄ ' : '') + v + (on ? ' ►' : ''), VW - 26, y, { col: on ? '#3058a0' : UI.dim, align: 'right' });
            });
            const HELP = { textSpeed: 'How fast the words appear in the text box.', time: 'The light. "Story clock" follows the time of night in the story (the menu shows it). "Moving clock" runs a whole day in twelve minutes. The others hold one time of day.', run: 'Run without holding SHIFT (hold it to walk instead).', zoom: 'How much of the map fits on screen.', volume: 'The blips and chimes.', music: 'The tunes: the camp by night and by day, indoors, down the shaft, and the title.', names: 'The name that floats over what you are facing.', notices: 'A quiet line in the corner when someone will remember what you did. It never says how.' };
            const hy = 44 + this.SETTINGS.length * 18;
            A.r(14, hy - 6, VW - 28, 1, '#c8d0d8');
            Txt.wrap(HELP[this.SETTINGS[this.sub].key], VW - 60).forEach((ln, i) => Txt.draw(g, ln, 24, hy + i * 12, { col: '#3058a0' }));
            if (VH - hy > 120) {
                Txt.draw(g, 'CONTROLS', 24, hy + 34, { col: UI.gold });
                [['WASD / arrows', 'Walk'], ['SHIFT', 'Run'], ['SPACE / ENTER / Z', 'Look, talk, next'], ['M', 'Map (M again: all of Egypt)'], ['Q', 'Metal detector on / off'], ['P', 'Your phone'], ['C', 'Photograph what you face'], ['ESC', 'This menu, or back'], ['Walk up to a door', 'Go inside']].forEach(([k2, v2], i) => { Txt.draw(g, k2, 24, hy + 50 + i * 13, { col: UI.ink }); Txt.draw(g, v2, 150, hy + 50 + i * 13, { col: UI.dim }); });
            }
            Txt.draw(g, '▲▼ choose   ◄► change', 24, VH - 28, { col: UI.dim });
        } else if (this.page === 'tasks') {
            const T = Story.s.tasks;
            if (!T.length) Txt.draw(g, 'Nothing to do yet. Talk to people.', 24, 40, { col: UI.dim });
            let y = 34;
            const top = Math.max(0, this.sub - 3);
            for (let i = top; i < T.length && y < VH - 30; i++) {
                const t = T[i], on = i === this.sub, lines = Txt.wrap(t.text, VW - 70);
                if (on) A.r(14, y - 2, VW - 28, lines.length * 12 + 3, '#d8ecff');
                A.r(22, y + 1, 9, 9, UI.ink); A.r(23, y + 2, 7, 7, t.done ? '#b8f0a0' : '#f8f8f0');
                if (t.done) { A.line(24, y + 5, 26, y + 7, '#3a7a30'); A.line(26, y + 7, 29, y + 3, '#3a7a30'); }
                lines.forEach((ln, j) => Txt.draw(g, ln, 38, y + j * 12, { col: t.done ? '#9aa0a8' : on ? UI.ink : UI.dim }));
                y += lines.length * 12 + 5;
            }
        } else if (this.page === 'journal' || this.page === 'bag') {
            const list = this.page === 'journal' ? Game.journal.map(j => [j.label, j.text]) : Game.bagList();
            if (!list.length) Txt.draw(g, this.page === 'journal' ? 'Nothing written yet. Look at things: it all goes in here.' : 'Empty.', 24, 40, { col: UI.dim });
            else {
                const rows = Math.floor((VH - 56) / 13), top = Math.max(0, Math.min(this.sub - (rows >> 1), list.length - rows));
                const lw = Math.min(170, Math.round(VW * 0.36));
                for (let i = 0; i < rows && top + i < list.length; i++) {
                    const on = top + i === this.sub, y = 34 + i * 13;
                    if (on) A.r(14, y - 2, lw, 13, '#d8ecff');
                    let str = list[top + i][0]; while (Txt.width(str) > lw - 14 && str.length > 4) str = str.slice(0, -2);
                    Txt.draw(g, str, 20, y, { col: on ? UI.ink : UI.dim });
                }
                A.r(lw + 20, 32, 1, VH - 50, '#c8d0d8');
                const desc = Txt.wrap(list[this.sub][1], VW - lw - 50).slice(0, Math.floor((VH - 56) / 12));
                desc.forEach((ln, i) => Txt.draw(g, ln, lw + 28, 34 + i * 12, { col: UI.ink }));
                if (this.page === 'bag' && this.sub === 0) {        // the watch, big
                    const r = Math.min(34, Math.max(16, (VH - 90 - desc.length * 12) >> 1)), cx = lw + 28 + Math.round((VW - lw - 50) / 2), cy = 44 + desc.length * 12 + r;
                    if (cy + r < VH - 20) drawWatch(g, cx, cy, r);
                }
            }
        }
        g.restore();
    },
};
