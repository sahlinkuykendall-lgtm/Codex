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
        Txt.draw(g, 'POKE-STYLE BUILD  P0.33', VW - 6, VH - 14, { col: '#8898d0', align: 'right' });
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
            if (P === 'tasks' && I.ok) { const t = Story.s.tasks[this.sub]; if (t && !t.done) { Tracker.set(t.id); Toast.show('Tracking: ' + t.text.slice(0, 40) + (t.text.length > 40 ? '…' : '')); } }
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
                [['WASD / arrows', 'Walk'], ['SHIFT', 'Run'], ['SPACE / ENTER / Z', 'Look, talk, next'], ['M', 'Map (M again: all of Egypt)'], ['Q', 'Metal detector on / off'], ['P', 'Your phone'], ['C', 'Photograph what you face'], ['T', 'Which way to the tracked task'], ['ESC', 'This menu, or back'], ['Walk up to a door', 'Go inside']].forEach(([k2, v2], i) => { Txt.draw(g, k2, 24, hy + 50 + i * 13, { col: UI.ink }); Txt.draw(g, v2, 150, hy + 50 + i * 13, { col: UI.dim }); });
            }
            Txt.draw(g, '▲▼ choose   ◄► change', 24, VH - 28, { col: UI.dim });
        } else if (this.page === 'tasks') {
            const T = Story.s.tasks;
            if (!T.length) Txt.draw(g, 'Nothing to do yet. Talk to people.', 24, 40, { col: UI.dim });
            Txt.draw(g, 'SPACE: track this one (the compass in the corner points the way, T flashes an arrow)', 24, VH - 28, { col: UI.dim });
            let y = 34;
            const top = Math.max(0, this.sub - 3);
            for (let i = top; i < T.length && y < VH - 30; i++) {
                const t = T[i], on = i === this.sub, lines = Txt.wrap(t.text, VW - 70);
                if (on) A.r(14, y - 2, VW - 28, lines.length * 12 + 3, '#d8ecff');
                A.r(22, y + 1, 9, 9, UI.ink); A.r(23, y + 2, 7, 7, t.done ? '#b8f0a0' : '#f8f8f0');
                if (t.id === Tracker.id) { A.poly([[VW - 30, y + 1], [VW - 24, y + 5], [VW - 30, y + 9]], '#d04838'); Txt.draw(g, 'TRACKING', VW - 34, y, { col: '#d04838', align: 'right' }); }
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

// ---- A PICTURE, SHOWN BIG (a map on a wall, a photograph, a page) ----
// Picture.show(art, then): art(g, A, w, h) draws at its own size (Picture.W × Picture.H); it's
// scaled up by whole pixels to fill the screen. SPACE or ESC puts it down, then `then` runs.
const Picture = {
    open: false, W: 200, H: 130, art: null, then: null, t: 0, cache: null,
    show(art, then) { this.art = art; this.then = then; this.open = true; this.t = 0; this.cache = null; this.W = art.W || 200; this.H = art.H || 130; Sfx.ok(); },
    update(dt, I) { this.t += dt; if (this.t > 0.3 && (I.ok || I.back || I.menu)) { this.open = false; Sfx.back(); const cb = this.then; this.then = null; if (cb) cb(); } },
    draw(g) {
        if (!this.open) return;
        const VW = Game.VW, VH = Game.VH;
        if (!this.cache) { const [c, cg] = mk(this.W, this.H); cg.imageSmoothingEnabled = false; this.art(cg, pa(cg), this.W, this.H); this.cache = c; }
        g.fillStyle = 'rgba(10,8,16,0.78)'; g.fillRect(0, 0, VW, VH);
        const kf = Math.min((VW - 12) / this.W, (VH - 26) / this.H), k = kf >= 1 ? Math.floor(kf) : kf, w = Math.round(this.W * k), h0 = Math.round(this.H * k),   // (whole pixels when it fits; shrunk only on a tiny screen)
             h = h0, x = (VW - w) >> 1, y = Math.max(4, (VH - h - 16) >> 1);
        const grow = Math.min(1, this.t / 0.18), gw = Math.round(w * (0.6 + 0.4 * grow)), gh = Math.round(h * (0.6 + 0.4 * grow));
        g.fillStyle = '#1c1410'; g.fillRect(((VW - gw) >> 1) + 3, y + ((h - gh) >> 1) + 3, gw, gh);
        g.imageSmoothingEnabled = false; g.drawImage(this.cache, (VW - gw) >> 1, y + ((h - gh) >> 1), gw, gh);
        Txt.draw(g, 'SPACE: put it down', VW >> 1, Math.min(VH - 14, y + h + 6), { col: '#e8dcff', align: 'center', shadow: '#1c1410' });
    },
};
// a tiny 3×5 pencil hand for labels on maps and pictures: miniText(A, 'TENT', x, y, col)
const MINI_FONT = (() => {
    const src = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111101101101', N: '101111111111101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101101111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111',
        0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110', 4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001110', '.': '000000000000010', '-': '000000111000000', '/': '001001010100100', '?': '110001010000010', "'": '010010000000000', '+': '000010111010000', '>': '100010001010100', '<': '001010100010001' };
    return src;
})();
function miniText(A, s, x, y, col, center) {
    s = String(s).toUpperCase(); if (center) x -= (s.length * 4 - 1) >> 1;
    for (const ch of s) { const m = MINI_FONT[ch]; if (m) for (let k = 0; k < 15; k++) if (m[k] === '1') A.px(x + k % 3, y + (k / 3 | 0), col); x += 4; }
}
// Miriam's survey map of the concession (the wall of her tent): traced from the camp itself
function surveyMapArt(g, A, W, H) {
    const R = rng('survey-map'), INK = '#3a2a1c', PEN = '#5a4428', RED = '#c83828', L = Game.camp || campLayout();
    // the paper: cream, speckled, folded in four, a coffee ring
    A.r(0, 0, W, H, '#8e6a44'); A.r(1, 1, W - 2, H - 2, '#efe2c0'); A.r(1, 1, W - 2, 1, '#fbf4dc'); A.r(1, 1, 1, H - 2, '#fbf4dc'); A.r(1, H - 2, W - 2, 1, '#cdb88a'); A.r(W - 2, 1, 1, H - 2, '#cdb88a');
    for (let k = 0; k < 5; k++) A.ell(10 + R() * (W - 20), 10 + R() * (H - 20), 8 + R() * 20, 6 + R() * 12, 'rgba(160,120,60,0.07)');
    for (let k = 0; k < 420; k++) A.px(2 + R() * (W - 4) | 0, 2 + R() * (H - 4) | 0, 'rgba(120,90,50,0.16)');
    // the map in its frame (clipped to it)
    const MX0 = 9, MY0 = 20, MX1 = 232, MY1 = 184, S = 2.85, X = tx => Math.round(MX0 + 1 + tx * S), Y = ty => Math.round(MY0 + 1 + ty * S);
    g.save(); g.beginPath(); g.rect(MX0 + 1, MY0 + 1, MX1 - MX0 - 1, MY1 - MY0 - 1); g.clip();
    const get = (x, y) => x < 0 || y < 0 || x >= L.W || y >= L.H ? T.ROCK : L.get(x, y);
    for (let ty = 0; ty < L.H; ty++) for (let tx = 0; tx < L.W; tx++) {
        const t = get(tx, ty), x0 = X(tx), y0 = Y(ty), w = X(tx + 1) - x0, h = Y(ty + 1) - y0;
        const col = { [T.ROCK]: '#dcc89c', [T.WATER]: '#94c4dc', [T.PATH]: '#e2cfa4', [T.YARD]: '#e9dbb4', [T.DIG]: '#e8b8a0', [T.STONE]: '#d8d2c0', [T.GRAVEL]: '#e4d6b4' }[t];
        if (col) A.r(x0, y0, w, h, col);
        if (t === T.ROCK) for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if ((x0 + i + y0 + j) % 4 === 0) A.px(x0 + i, y0 + j, '#c4ac7c');
        if (t === T.GRAVEL && (tx + ty) % 2) A.px(x0 + 1, y0 + 1, '#a8987a');
    }
    // the edge of the plateau: an inked line, hachures running downhill
    for (let ty = 0; ty < L.H; ty++) for (let tx = 0; tx < L.W; tx++) {
        if (get(tx, ty) !== T.ROCK) continue;
        const x0 = X(tx), y0 = Y(ty), x1 = X(tx + 1), y1 = Y(ty + 1);
        if (get(tx, ty + 1) !== T.ROCK) { A.hl(x0, y1 - 1, x1 - x0, '#7a5c34'); for (let i = x0; i < x1; i += 2) A.vl(i, y1, 2, '#a88a5c'); }
        if (get(tx - 1, ty) !== T.ROCK && tx > 0) { A.vl(x0, y0, y1 - y0, '#7a5c34'); for (let j = y0; j < y1; j += 2) A.hl(x0 - 2, j, 2, '#a88a5c'); }
        if (get(tx + 1, ty) !== T.ROCK && tx < L.W - 1) { A.vl(x1 - 1, y0, y1 - y0, '#7a5c34'); for (let j = y0; j < y1; j += 2) A.hl(x1, j, 2, '#a88a5c'); }
    }
    for (let ty = 0; ty < L.H; ty++) for (let tx = 0; tx < L.W; tx++) if (get(tx, ty) === T.WATER) {                      // the water's edge
        const x0 = X(tx), y0 = Y(ty), x1 = X(tx + 1), y1 = Y(ty + 1);
        if (get(tx, ty - 1) !== T.WATER) A.hl(x0, y0, x1 - x0, '#4a86b0'); if (get(tx, ty + 1) !== T.WATER) A.hl(x0, y1 - 1, x1 - x0, '#4a86b0');
        if (get(tx - 1, ty) !== T.WATER) A.vl(x0, y0, y1 - y0, '#4a86b0'); if (get(tx + 1, ty) !== T.WATER) A.vl(x1 - 1, y0, y1 - y0, '#4a86b0');
        if ((tx * 3 + ty) % 4 === 0) A.hl(x0 + 1, y0 + 1, 2, '#c8e4f0');
    }
    // the grid, every ten tiles
    for (let t = 10; t < L.W; t += 10) for (let y = MY0; y < MY1; y += 2) A.px(X(t), y, 'rgba(90,68,40,0.28)');
    for (let t = 10; t < L.H; t += 10) for (let x = MX0; x < MX1; x += 2) A.px(x, Y(t), 'rgba(90,68,40,0.28)');
    // the rails, the paths (edged in pencil)
    for (let ty = 0; ty < L.H; ty++) for (let tx = 0; tx < L.W; tx++) {
        const t = get(tx, ty), x0 = X(tx), y0 = Y(ty), x1 = X(tx + 1), y1 = Y(ty + 1);
        if (t === T.RAIL) { const hz = get(tx - 1, ty) === T.RAIL || get(tx + 1, ty) === T.RAIL; if (hz) { A.hl(x0, y0 + 1, x1 - x0, INK); A.vl(x0 + 1, y0, 3, INK); } else { A.vl(x0 + 1, y0, y1 - y0, INK); A.hl(x0, y0 + 1, 3, INK); } }
        if (t === T.PATH) { if (get(tx, ty - 1) !== T.PATH) A.hl(x0, y0, x1 - x0, '#b8a078'); if (get(tx, ty + 1) !== T.PATH) A.hl(x0, y1 - 1, x1 - x0, '#b8a078'); if (get(tx - 1, ty) !== T.PATH) A.vl(x0, y0, y1 - y0, '#b8a078'); if (get(tx + 1, ty) !== T.PATH) A.vl(x1 - 1, y0, y1 - y0, '#b8a078'); }
    }
    // palms: little stars of green pencil
    for (const [tx, ty] of L.trees) { const x = X(tx + 0.5), y = Y(ty + 0.5); A.px(x, y, '#3a7a30'); A.px(x - 1, y - 1, '#58a048'); A.px(x + 1, y - 1, '#58a048'); A.px(x - 1, y + 1, '#58a048'); A.px(x + 1, y + 1, '#58a048'); }
    // buildings: hatched blocks with an inked edge
    const at = id => L.things.find(q => q[0] === id);
    const block = (id, round) => {
        const q = at(id); if (!q) return; const [, tx, ty, tw, th] = q, x0 = X(tx), y0 = Y(ty), x1 = X(tx + tw), y1 = Y(ty + th);
        if (round) { const cx = (x0 + x1) >> 1, cy = (y0 + y1) >> 1, r = Math.max(2, (x1 - x0) >> 1); A.ell(cx, cy, r + 1, r + 1, INK); A.ell(cx, cy, r, r, '#cdb48a'); A.px(cx, cy, INK); return; }
        A.r(x0, y0, x1 - x0, y1 - y0, INK); A.r(x0 + 1, y0 + 1, x1 - x0 - 2, y1 - y0 - 2, '#cdb48a');
        for (let j = y0 + 1; j < y1 - 1; j++) for (let i = x0 + 1; i < x1 - 1; i++) if ((i - j + 400) % 3 === 0) A.px(i, j, '#a88e64');
    };
    ['tent_bldg', 'c1m_mess', 'dorm_bldg', 'foreman_bldg', 'fl_digshed', 'fl_toolshed', 'fl_trailer', 'fl_ministry_post', 'fl_guard_booth', 'ow_shelter', 'd_gearstor', 'd_truck1', 'd_truck2'].forEach(id => block(id));
    ['c1m_hanatent', 'c1p_maqam'].forEach(id => block(id, true));
    const tw = at('c1p_tower'); if (tw) { const x = X(tw[1] + 1), y = Y(tw[2] + 1); A.poly([[x, y - 4], [x + 3, y + 2], [x - 3, y + 2]], INK); A.px(x, y, '#efe2c0'); }
    const cem = at('c1p_cemetery'); if (cem) for (let i = 0; i < 9; i++) { const x = X(cem[1] + 0.5 + (i % 5) * 1.3), y = Y(cem[2] + 0.6 + (i / 5 | 0) * 1.4); A.vl(x, y - 1, 3, PEN); A.hl(x - 1, y, 3, PEN); }
    const ru = at('ow_ruins'); if (ru) { const x0 = X(ru[1]), y0 = Y(ru[2]); A.hl(x0, y0, 6, PEN); A.vl(x0, y0, 5, PEN); A.hl(x0 + 9, y0, 5, PEN); A.vl(x0 + 14, y0 + 2, 5, PEN); A.hl(x0 + 3, y0 + 7, 8, PEN); }
    for (const id of ['ow_well', 'c1w_well2']) { const q = at(id); if (!q) continue; const x = X(q[1] + q[3] / 2), y = Y(q[2] + q[4] / 2); A.ell(x, y, 2, 2, INK); A.px(x, y, '#4a86b0'); }
    // the fence: a line of little crosses, and the gate between its runs
    for (const [x0, x1, ty] of L.fences) for (let x = X(x0); x <= X(x1); x++) { const y = Y(ty + 0.5); A.px(x, y, '#6a6a6a'); if ((x - X(x0)) % 4 === 0) { A.px(x - 1, y - 1, '#4a4a4a'); A.px(x + 1, y + 1, '#4a4a4a'); A.px(x + 1, y - 1, '#4a4a4a'); A.px(x - 1, y + 1, '#4a4a4a'); } }
    for (const [tx, y0, y1] of L.fencesV || []) for (let y = Y(y0); y <= Y(y1 + 0.5); y++) { const x = X(tx); A.px(x, y, '#6a6a6a'); if ((y - Y(y0)) % 4 === 0) { A.px(x - 1, y - 1, '#4a4a4a'); A.px(x + 1, y + 1, '#4a4a4a'); A.px(x + 1, y - 1, '#4a4a4a'); A.px(x - 1, y + 1, '#4a4a4a'); } }
    // the shaft: a black square on the cliff, circled in pencil with a question mark
    const sh = at('tunnel_mouth'); if (sh) { const x = X(sh[1] + 1), y = Y(sh[2]); A.r(x - 2, y - 1, 5, 5, '#16181e'); for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; A.px(Math.round(x + Math.cos(a) * 7), Math.round(y + 1 + Math.sin(a) * 6), '#6a5a48'); } miniText(A, '?', x + 8, y - 8, '#6a5a48'); }
    // her trenches in red pencil
    const trench = (tx, ty, tw, th, l, fill) => {
        const x0 = X(tx), y0 = Y(ty), x1 = X(tx + tw), y1 = Y(ty + th);
        for (let x = x0; x <= x1; x++) { if (fill || x % 3) { A.px(x, y0, RED); A.px(x, y1, RED); } }
        for (let y = y0; y <= y1; y++) { if (fill || y % 3) { A.px(x0, y, RED); A.px(x1, y, RED); } }
        if (fill) for (let j = y0 + 2; j < y1; j += 3) A.hl(x0 + 1, j, x1 - x0 - 1, 'rgba(200,56,40,0.45)');
        Txt.draw(g, l, x1 + 3, y0 - 3, { col: RED });
    };
    trench(66, 16, 4, 12, 'A', true); trench(48, 13, 5, 4, 'B'); trench(33, 14, 4, 3, 'C');
    miniText(A, 'REOPENED', X(68), Y(28.8), RED, true); miniText(A, 'BACK-', X(48), Y(9.8), RED, true); miniText(A, 'FILLED', X(48), Y(11.6), RED, true);
    // beside C, a Coptic word, underlined twice: ⲡⲏⲓ
    const cx = X(31), cy = Y(19.4);
    A.hl(cx, cy, 5, INK); A.vl(cx + 1, cy, 6, INK); A.vl(cx + 4, cy, 6, INK);
    A.vl(cx + 8, cy, 6, INK); A.vl(cx + 12, cy, 6, INK); A.hl(cx + 8, cy + 3, 5, INK); A.hl(cx + 7, cy, 2, INK); A.hl(cx + 11, cy, 2, INK);
    A.vl(cx + 16, cy + 1, 5, INK); A.px(cx + 16, cy - 1, INK);
    A.hl(cx - 1, cy + 8, 19, INK); A.hl(cx, cy + 10, 17, INK);
    A.line(cx + 12, cy - 2, X(34), Y(17) + 1, '#6a5a48');                                    // an arrow from the word to trench C
    // place names in pencil
    const NAMES = [['OASIS', 8, 8.6], ['WORKERS CAMP', 12.5, 28.8], ['DIG ZONE', 28, 12.4], ['OSIRIS SHAFT', 36, 3.3], ['TENTS', 33.5, 27.8], ['GUARD POST', 60.5, 38.9], ['BOOTH', 46.5, 46.2], ['RAIL', 6, 45.4], ['OLD VILLAGE', 23, 36.6], ['CEMETERY', 25.5, 52.6], ['SHEIKH', 50, 55.2], ['WADI', 72, 50], ['TOWER', 71, 12], ['FOSSILS', 53.5, 43], ['SHELTER', 69.5, 37], ['ROAD IN >', 31.5, 55.2], ['PLATEAU', 60, 2.2], ['WRECK', 9.5, 51]];
    for (const [s2, tx, ty] of NAMES) miniText(A, s2, X(tx), Y(ty), PEN, true);
    g.restore();
    // the frame, with the grid letters and numbers round it
    A.r(MX0, MY0, MX1 - MX0 + 1, 1, INK); A.r(MX0, MY1, MX1 - MX0 + 1, 1, INK); A.r(MX0, MY0, 1, MY1 - MY0, INK); A.r(MX1, MY0, 1, MY1 - MY0, INK);
    A.r(MX0 - 2, MY0 - 2, MX1 - MX0 + 5, 1, PEN); A.r(MX0 - 2, MY1 + 2, MX1 - MX0 + 5, 1, PEN); A.r(MX0 - 2, MY0 - 2, 1, MY1 - MY0 + 5, PEN); A.r(MX1 + 2, MY0 - 2, 1, MY1 - MY0 + 5, PEN);
    for (let k = 0; k * 10 < L.W; k++) miniText(A, 'ABCDEFGH'[k], X(k * 10 + 5), MY0 - 8, PEN, true);
    for (let k = 0; k * 10 < L.H; k++) miniText(A, k + 1, 3, Y(k * 10 + 5) - 2, PEN);
    // the title block
    const RX = 238, RW = W - RX - 6;
    A.r(RX, MY0 - 2, RW, 50, INK); A.r(RX + 1, MY0 - 1, RW - 2, 48, '#f6ecd0');
    Txt.draw(g, 'GIZA', RX + (RW >> 1), MY0, { col: INK, align: 'center' }); Txt.draw(g, 'W. FIELD', RX + (RW >> 1), MY0 + 11, { col: INK, align: 'center' });
    A.hl(RX + 5, MY0 + 25, RW - 10, PEN); miniText(A, 'CONCESSION', RX + (RW >> 1), MY0 + 29, PEN, true); miniText(A, 'SURVEY', RX + (RW >> 1), MY0 + 35, PEN, true); miniText(A, 'DIR. M. HALE', RX + (RW >> 1), MY0 + 41, INK, true);
    // a compass rose
    const nx = RX + (RW >> 1), ny = MY0 + 72;
    A.ell(nx, ny, 13, 13, PEN); A.ell(nx, ny, 12, 12, '#efe2c0'); for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; A.px(Math.round(nx + Math.sin(a) * 10), Math.round(ny - Math.cos(a) * 10), PEN); }
    A.poly([[nx, ny - 12], [nx + 3, ny], [nx - 3, ny]], RED); A.poly([[nx, ny + 12], [nx + 3, ny], [nx - 3, ny]], INK); A.poly([[nx + 12, ny], [nx, ny + 2], [nx, ny - 2]], PEN); A.poly([[nx - 12, ny], [nx, ny + 2], [nx, ny - 2]], PEN);
    miniText(A, 'N', nx - 1, ny - 20, RED); miniText(A, 'E', nx + 15, ny - 2, PEN); miniText(A, 'S', nx - 1, ny + 16, PEN); miniText(A, 'W', nx - 18, ny - 2, PEN);
    miniText(A, 'GIZA >', nx, ny + 24, PEN, true); miniText(A, 'PYRAMIDS', nx, ny + 30, PEN, true);
    // the scale bar
    const sy = MY0 + 118; A.r(RX + 4, sy, 40, 3, INK); A.r(RX + 14, sy + 1, 10, 1, '#efe2c0'); A.r(RX + 34, sy + 1, 10, 1, '#efe2c0'); miniText(A, '0', RX + 3, sy + 5, PEN); miniText(A, '100 M', RX + 44, sy + 5, PEN, true);
    // the key
    const ky = MY0 + 131; miniText(A, 'KEY', RX + 2, ky, INK);
    A.r(RX + 2, ky + 8, 6, 4, INK); A.r(RX + 3, ky + 9, 4, 2, '#cdb48a'); miniText(A, 'BUILDING', RX + 11, ky + 8, PEN);
    for (let i = 0; i < 7; i += 3) { A.px(RX + 2 + i, ky + 15, '#4a4a4a'); A.px(RX + 3 + i, ky + 16, '#4a4a4a'); A.px(RX + 3 + i, ky + 14, '#4a4a4a'); } A.hl(RX + 2, ky + 15, 7, '#6a6a6a'); miniText(A, 'FENCE', RX + 11, ky + 14, PEN);
    A.r(RX + 2, ky + 20, 7, 5, RED); A.r(RX + 3, ky + 21, 5, 3, '#efe2c0'); miniText(A, 'TRENCH', RX + 11, ky + 20, PEN);
    A.ell(RX + 5, ky + 28, 2, 2, INK); A.px(RX + 5, ky + 28, '#4a86b0'); miniText(A, 'WELL', RX + 11, ky + 26, PEN);
    // the pins at the corners
    for (const [px, py, c] of [[5, 5, '#d04838'], [W - 6, 5, '#3a70c8'], [5, H - 6, '#f0c040'], [W - 6, H - 6, '#58a848']]) { A.ell(px + 1, py + 2, 3, 2, 'rgba(40,20,10,0.35)'); A.ell(px, py, 3, 3, c); A.px(px - 1, py - 1, '#ffffff'); }
}
surveyMapArt.W = 300; surveyMapArt.H = 196;
