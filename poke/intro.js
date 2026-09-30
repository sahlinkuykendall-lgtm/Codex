// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE OPENING (poke/intro.js)
// What a new player sees before they can move:
//   1. the story so far, in four illustrated scenes (from the story bible:
//      the Serapeum burning in 391 AD, Petamun's seven Houses, the Codex
//      sealed at Giza, Miriam finding it, the black car)
//   2. who you are: one of the four backgrounds (poke/backgrounds.js)
//   3. your papers: male or female, how you look (the character creator),
//      your name (a DS-style letter grid; typing works too)
//   4. your background's own opening scene, then you arrive
// ESC skips the story scenes.
// ============================================================

// a sprite drawn big (whole-number scale, so the pixels stay square)
function bigSprite(g, c, x, y, k) { g.drawImage(c, 0, 0, c.width, c.height, Math.round(x), Math.round(y), c.width * k, c.height * k); }
function skyBands(g, cols, h, W) { const A = pa(g); for (let i = 0; i < cols.length; i++) { const y0 = Math.round(h * i / cols.length), y1 = Math.round(h * (i + 1) / cols.length); A.r(0, y0, W, y1 - y0, cols[i]); if (i < cols.length - 1) A.dith(0, y1 - 4, W, 4, cols[i + 1], i); } }

const SCENES = [
    {   // ---- the Serapeum burns ----
        cap: 'ALEXANDRIA  ·  391 AD',
        text: 'The mob came by torchlight. By morning the Serapeum, the last great library of the ancient world, was burning.\n\nOne man got out through the tunnels beneath it. Petamun: priest, librarian, one of the last people alive who could still read the hieroglyphs.\n\nHe carried six hundred scrolls. And one sealed box that nobody was ever meant to open.',
        draw(g, t, W, H) {
            const A = pa(g), hz = Math.round(H * 0.62);
            skyBands(g, ['#1a0c14', '#2c1018', '#4c1818', '#782818', '#a84018', '#d86820', '#f09030'], hz, W);
            for (let i = 0; i < 40; i++) { const x = (hash2(i, 5) * W + t * (8 + hash2(i, 6) * 14)) % W, y = hz - ((t * (20 + hash2(i, 7) * 30) + hash2(i, 8) * hz) % hz); A.px(x, y, hash2(i, 9) > 0.5 ? '#ffd060' : '#ff8030'); }   // sparks
            // the sea and the Pharos, far right
            A.r(Math.round(W * 0.66), hz - 8, W, 8, '#241830'); A.dith(Math.round(W * 0.66), hz - 8, W, 3, '#783838', 0);
            const px = Math.round(W * 0.88); A.r(px - 3, hz - 50, 7, 44, '#1a0c14'); A.r(px - 5, hz - 22, 11, 16, '#1a0c14'); A.r(px - 2, hz - 56, 5, 6, '#1a0c14'); A.px(px, hz - 58, (t * 2 | 0) % 2 ? '#fff4b0' : '#ffc840');
            // the city, and the temple on its hill
            A.r(0, hz - 6, W, H - hz + 6, '#140a10');
            for (let i = 0; i < 26; i++) { const bx = Math.round(i * W / 26), bh = 8 + Math.round(hash2(i, 11) * 16); A.r(bx, hz - 6 - bh, Math.round(W / 26) - 1, bh, '#1e0e14'); if (hash2(i, 12) > 0.6) A.px(bx + 3, hz - 10 - bh / 2, '#ffb040'); }
            const tx = Math.round(W * 0.2), tw = Math.round(W * 0.36), ty = hz - 30;
            A.poly([[tx - 30, hz - 6], [tx + tw + 30, hz - 6], [tx + tw + 8, ty + 6], [tx - 8, ty + 6]], '#1e0e14');
            A.r(tx - 4, ty, tw + 8, 6, '#2c141a'); A.r(tx, ty - 44, tw, 6, '#2c141a');
            A.poly([[tx - 4, ty - 44], [tx + tw + 4, ty - 44], [tx + tw / 2, ty - 64]], '#2c141a');
            for (let i = 0; i < 8; i++) { const cx = tx + 4 + Math.round(i * (tw - 12) / 7); A.r(cx, ty - 38, 5, 38, '#3a1a1e'); A.vl(cx, ty - 38, 38, '#a84018'); }
            // fire through the roof
            for (let i = 0; i < 7; i++) {
                const fx = tx + 10 + Math.round(i * (tw - 20) / 6), fh = 26 + Math.round(Math.sin(t * 5 + i * 1.7) * 8 + hash2(i, 3) * 18), lean = Math.round(Math.sin(t * 3 + i) * 4);
                A.poly([[fx - 9, ty - 42], [fx + 9, ty - 42], [fx + lean, ty - 42 - fh]], '#c03010'); A.poly([[fx - 6, ty - 42], [fx + 6, ty - 42], [fx + lean * 0.6, ty - 42 - fh * 0.7]], '#f08020'); A.poly([[fx - 3, ty - 42], [fx + 3, ty - 42], [fx, ty - 42 - fh * 0.4]], '#ffc840');
            }
            for (let i = 0; i < 5; i++) { const sx = tx + tw * 0.2 + i * tw * 0.16 + Math.sin(t * 0.5 + i) * 10, sy = ty - 90 - ((t * 9 + i * 23) % 60); A.ell(sx, sy, 12 + i * 2, 7 + i, 'rgba(20,10,16,0.55)'); }
            for (let i = 0; i < 16; i++) A.px(tx - 20 + i * (tw + 40) / 15 + Math.sin(t * 4 + i) * 1.5, hz - 8 - (i % 3), (t * 6 + i | 0) % 3 ? '#ffc840' : '#f08020');   // the crowd's torches
            // Petamun, coming out of the tunnel mouth with the scrolls
            const B = H - 70, ax = Math.round(W * 0.74);                                       // (the text box covers the bottom 64 pixels)
            A.r(0, B - 18, W, H, '#0c060a'); for (let i = 0; i < W; i += 23) A.r(i, B - 18, 22, 3, '#1e0e14');
            A.ell(ax + 26, B - 26, 30, 30, '#1e0e14'); A.ell(ax + 26, B - 22, 22, 24, '#000000'); A.r(ax + 4, B - 22, 45, 8, '#000000');
            const P = this.p || (this.p = personSheet(LOOKS.petamun)), px2 = ax - 30 - ((t * 16) % 110);
            bigSprite(g, P.frames[1][[1, 0, 2, 0][(t * 5 | 0) % 4]], px2, B - 80, 2);
            A.r(px2 + 14, B - 46, 14, 6, '#d8c08a'); A.r(px2 + 16, B - 48, 10, 3, '#f0dca8'); A.px(px2 + 15, B - 44, '#a86c3c'); A.px(px2 + 26, B - 44, '#a86c3c');   // the bundle of scrolls
            A.ell(px2 + 32, B - 20, 22, 4, 'rgba(240,128,32,0.18)');
        },
    },
    {   // ---- the seven Houses: a map of Egypt ----
        cap: 'EGYPT  ·  391 – 395 AD',
        text: 'For four years he crossed Egypt in secret, from the sea to the cataracts, and hid the scrolls in seven Houses. Each House holds the key to the next.\n\nThen he wrote the way to all seven in a single book, the Codex, and sealed it in a jar at the bottom of a shaft beneath the sands of Giza.\n\nFor sixteen hundred years, nobody found it.',
        draw(g, t, W, H) {
            const A = pa(g);
            A.r(0, 0, W, H, '#d8c490'); for (let y = 0; y < H; y += 2) for (let x = (y & 2); x < W; x += 4) if (hash2(x, y) > 0.7) A.px(x, y, '#c8b07c');
            A.r(0, 0, W, 4, '#a88c5c'); A.r(0, H - 4, W, 4, '#a88c5c'); A.dith(0, 4, W, 3, '#a88c5c', 0);
            const mx = Math.round(W * 0.5), top = 26, bot = H - 70;
            A.r(0, 20, W, top + 12 - 20, '#6898c8'); A.dith(0, top + 8, W, 4, '#d8c490', 0);              // the sea
            for (let i = 0; i < 12; i++) A.hl(20 + hash2(i, 1) * (W - 60), 24 + hash2(i, 2) * 10, 8, '#90b8e0');
            // the Nile: up from the south, fanning into the delta
            const nile = (y) => mx + Math.round(Math.sin(y * 0.045) * 14 + Math.sin(y * 0.11) * 4);
            for (let y = top + 36; y < bot; y++) { A.r(nile(y) - 2, y, 5, 1, '#4c80cc'); A.px(nile(y) - 3, y, '#70a040'); A.px(nile(y) + 3, y, '#70a040'); }
            A.poly([[mx - 46, top + 10], [mx + 46, top + 10], [nile(top + 36) + 2, top + 38], [nile(top + 36) - 2, top + 38]], '#70a040');
            A.line(nile(top + 36), top + 36, mx - 30, top + 10, '#4c80cc'); A.line(nile(top + 36), top + 36, mx + 28, top + 10, '#4c80cc'); A.line(nile(top + 36), top + 36, mx, top + 10, '#4c80cc');
            A.ell(mx - 34, top + 60, 9, 5, '#70a040'); A.ell(mx - 34, top + 60, 5, 2, '#4c80cc');            // the Faiyum
            Txt.draw(g, 'THE SEVEN HOUSES', W - 20, 44, { col: '#804c28', align: 'right' }); Txt.draw(g, 'of the House of Life', W - 20, 57, { col: '#a88c5c', align: 'right' });
            const cx2 = 40, cy2 = bot - 20; A.line(cx2, cy2 - 14, cx2, cy2 + 14, '#804c28'); A.line(cx2 - 10, cy2, cx2 + 10, cy2, '#804c28'); A.poly([[cx2 - 3, cy2 - 8], [cx2 + 3, cy2 - 8], [cx2, cy2 - 17]], '#a03028'); Txt.draw(g, 'N', cx2 + 6, cy2 - 22, { col: '#804c28' });
            for (const [dx2, s2] of [[16, 5], [24, 7], [33, 4]]) A.poly([[mx + dx2 - s2, top + 44], [mx + dx2 + s2, top + 44], [mx + dx2, top + 44 - s2]], '#b0945c');
            Txt.draw(g, 'Siwa', mx - 120, top + 46, { col: '#a88c5c' }); A.ell(mx - 128, top + 52, 2, 2, '#70a040');
            // the Houses light one by one, in the order he made them
            const span = bot - top, sites = [[-52, 12, 'Alexandria'], [34, 18, 'Tanis'], [-34, 60, 'Hawara'], [-4, 0.42 * span, 'Hermopolis'], [6, 0.62 * span, 'Thebes'], [-2, 0.84 * span, 'Philae'], [-6, 40, 'Giza']];
            const shown = Math.min(sites.length, Math.floor(t / 1.1));
            for (let i = 0; i < shown; i++) {
                const [dx, dy, name] = sites[i], x = mx + dx, y = top + dy, last = i === 6;
                if (i > 0 && i < 6) { const [px, py] = sites[i - 1]; for (let k = 0; k < 10; k++) if (k % 2) A.px(mx + px + (dx - px) * k / 10, top + py + (dy - py) * k / 10, '#804c28'); }
                A.r(x - 3, y - 2, 7, 5, last ? '#c03010' : '#804c28'); A.poly([[x - 4, y - 2], [x + 4, y - 2], [x, y - 6]], last ? '#f08020' : '#a86c3c'); A.px(x, y, '#ffe890');
                if ((t * 3 + i | 0) % 2 || last) { A.px(x, y - 8, '#ffe890'); A.px(x - 5, y - 1, '#ffe890'); A.px(x + 5, y - 1, '#ffe890'); }
                Txt.draw(g, last ? 'GIZA — the Codex' : name, x + (dx < 0 ? -8 : 8), y - 7, { col: last ? '#a03028' : '#5c3418', align: dx < 0 ? 'right' : 'left' });
            }
        },
    },
    {   // ---- Miriam finds it ----
        cap: 'THE OSIRIS SHAFT, GIZA  ·  LAST WEEK',
        text: 'Last week, Dr. Miriam Hale found it.\n\nShe read enough to understand what it was. And enough to be afraid of who else would want it.',
        draw(g, t, W, H) {
            const A = pa(g);
            A.r(0, 0, W, H, '#120e0c');
            for (let i = 0; i < 60; i++) { const x = hash2(i, 1) * W, y = hash2(i, 2) * H * 0.8, w = 20 + hash2(i, 3) * 50; A.r(x, y, w, 6 + hash2(i, 4) * 10, hash2(i, 5) > 0.5 ? '#2a201a' : '#1e1612'); }
            const fl = Math.round(H * 0.68); A.r(0, fl, W, H - fl, '#2a1e16'); for (let i = 0; i < 40; i++) A.hl(hash2(i, 6) * W, fl + 3 + hash2(i, 7) * (H - fl - 50), 10 + hash2(i, 8) * 20, '#34261c');
            // the lowest level of the shaft: rock pillars, the black water, the granite sarcophagus on its island
            for (const px of [Math.round(W * 0.08), Math.round(W * 0.9)]) { A.r(px, 20, 30, fl - 20, '#3a2c22'); A.vl(px, 20, fl - 20, '#54443a'); A.r(px + 22, 20, 8, fl - 20, '#241a14'); for (let j = 30; j < fl; j += 17) A.hl(px, j, 30, '#241a14'); }
            A.r(0, fl + 16, W, H - fl, '#0c1820'); for (let i = 0; i < 26; i++) A.hl((hash2(i, 21) * W + t * 5) % W, fl + 19 + hash2(i, 22) * 40, 6 + hash2(i, 23) * 14, (t + i | 0) % 3 ? '#1c3848' : '#386078');
            const sx = Math.round(W * 0.16); A.r(sx, fl + 2, 84, 14, '#2a2430'); A.r(sx + 6, fl - 12, 72, 16, '#3c3644'); A.r(sx + 6, fl - 12, 72, 3, '#5c5668'); A.r(sx + 2, fl - 16, 80, 5, '#4a4454');
            A.poly([[Math.round(W * 0.46), 0], [Math.round(W * 0.52), 0], [Math.round(W * 0.56), fl], [Math.round(W * 0.4), fl]], 'rgba(200,210,255,0.05)');
            for (let j = 0; j < fl - 10; j += 9) A.hl(Math.round(W * 0.47), j, 12, '#54443a'); A.vl(Math.round(W * 0.47), 0, fl - 6, '#6a5848'); A.vl(Math.round(W * 0.47) + 12, 0, fl - 6, '#6a5848');
            // the niche, the broken plaster, the jar
            const nx = Math.round(W * 0.62), ny = fl - 66;
            A.r(nx - 26, ny - 6, 52, 72, '#4a3a2a'); A.r(nx - 20, ny, 40, 66, '#0c0806');
            for (let i = 0; i < 8; i++) A.r(nx - 34 + hash2(i, 9) * 60, fl + 2 + hash2(i, 10) * 8, 6, 3, '#c8b898');      // plaster on the floor
            const glow = 0.5 + Math.sin(t * 2) * 0.12;
            for (const [r, a] of [[60, 0.06], [42, 0.1], [26, 0.16], [14, 0.24]]) A.ell(nx, fl - 12, r, Math.round(r * 0.8), 'rgba(255,216,112,' + (a * glow * 2).toFixed(3) + ')');
            A.poly([[nx - 9, fl - 34], [nx + 9, fl - 34], [nx + 13, fl - 12], [nx + 8, fl], [nx - 8, fl], [nx - 13, fl - 12]], '#a86c3c'); A.ell(nx, fl - 34, 9, 3, '#5c3418'); A.vl(nx - 9, fl - 30, 22, '#c89058');
            // the Codex, out of the jar
            A.r(nx - 38, fl - 8, 20, 6, '#804c28'); A.r(nx - 38, fl - 10, 20, 3, '#a86c3c'); A.r(nx - 36, fl - 6, 16, 2, '#f0dca8'); A.px(nx - 28, fl - 9, '#ffe890');
            for (let k = 0; k < 5; k++) if ((t * 2 + k | 0) % 3 === 0) A.px(nx - 40 + k * 6, fl - 16 - k % 2 * 4, '#ffe890');
            // Miriam, with her head torch
            const M = this.m || (this.m = personSheet(LOOKS.miriam)), mx2 = Math.round(W * 0.34);
            A.poly([[mx2 + 40, fl - 58], [nx - 30, fl - 40], [nx - 30, fl + 4], [mx2 + 40, fl - 50]], 'rgba(255,244,200,0.10)');
            bigSprite(g, M.frames[2][0], mx2, fl - 92, 3);
            A.px(mx2 + 62, fl - 64, '#ffffff');
        },
    },
    {   // ---- the black car ----
        cap: 'THE DIG CAMP  ·  FOUR NIGHTS AGO',
        text: 'Four nights ago a black car came up the road to her camp with its lights off.\n\nIn the morning Miriam was gone. Her tea was still on the table. Her boots were by the door.\n\nThe official story is that she left for family reasons. Nobody at the dig believes it.\n\nFour very different people are left holding her trail. You are one of them.',
        draw(g, t, W, H) {
            const A = pa(g), hz = Math.round(H * 0.56);
            drawNightScene(g, t, 0.25);
            A.r(0, hz + 30, W, H, '#1c2442');
            // her tent, a lamp still lit inside
            const tx = Math.round(W * 0.2), ty = hz + 8;
            A.poly([[tx, ty + 40], [tx + 90, ty + 40], [tx + 70, ty], [tx + 20, ty]], '#3a4468'); A.poly([[tx + 20, ty], [tx + 70, ty], [tx + 45, ty - 12]], '#2c3454');
            A.poly([[tx + 36, ty + 40], [tx + 54, ty + 40], [tx + 45, ty + 12]], (t * 7 | 0) % 9 ? '#ffc860' : '#f0a840'); A.ell(tx + 45, ty + 44, 18, 4, 'rgba(255,200,96,0.25)');
            // the car, no lights
            const cx = Math.round(W * 0.58 + Math.max(0, 40 - t * 12)), cy = hz + 44;
            A.r(cx, cy + 8, 78, 14, '#0a0c16'); A.poly([[cx + 14, cy + 8], [cx + 22, cy - 4], [cx + 56, cy - 4], [cx + 66, cy + 8]], '#0a0c16');
            A.poly([[cx + 24, cy - 1], [cx + 38, cy - 1], [cx + 38, cy + 7], [cx + 19, cy + 7]], '#2c3864'); A.r(cx + 41, cy - 1, 13, 8, '#2c3864');
            A.hl(cx + 22, cy - 4, 34, '#5060a0'); A.ell(cx + 16, cy + 22, 7, 6, '#05060c'); A.ell(cx + 62, cy + 22, 7, 6, '#05060c'); A.ell(cx + 16, cy + 22, 3, 2, '#384888'); A.ell(cx + 62, cy + 22, 3, 2, '#384888');
            A.r(cx - 1, cy + 12, 2, 3, '#303850');
            for (let i = 0; i < 5; i++) A.ell(cx + 84 + i * 9 + (t * 6 % 9), cy + 26 - i, 5 - i, 2, 'rgba(120,130,170,0.25)');
        },
    },
];

const Intro = {
    phase: 'story', i: 0, oi: 0, t: 0, bg: 0, egyptian: false, gender: 'm', choices: null, row: 0, name: '', kx: 0, ky: 0, confirmSel: 0, sheet: null, sheetKey: '',
    KEYS: ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ \'-.', 'abcdefghij', 'klmnopqrst', 'uvwxyz    '],
    start() {
        this.phase = 'story'; this.i = 0; this.t = 0; this.bg = 0; this.egyptian = false; this.name = ''; this.gender = 'm'; this.choices = Object.assign({}, CHOICES_M); this.row = 0; this.kx = 0; this.ky = 0;
        this.showScene();
    },
    showScene() { this.t = 0; Dlg.open('', SCENES[this.i].text, () => { if (this.i < SCENES.length - 1) Game.fadeTo(() => { this.i++; this.showScene(); }); else Game.fadeTo(() => { this.phase = 'background'; this.t = 0; }); }); },
    look() { return lookFromChoices(this.choices, this.gender); },
    // your background's own scenes, one after another; then you arrive (or, for an opening not built yet, back to the choice)
    showOpening() {
        const B = BACKGROUNDS[this.bg], sc = B.scenes[this.oi];
        this.phase = 'opening'; this.t = 0;
        const text = sc.text.replace('{origin}', Game.player.egyptian ? 'Arabic is your own language, and you read it.' : 'Your Arabic is street Arabic, learned on the docks.');
        Dlg.open('', text, () => {
            if (this.oi < B.scenes.length - 1) Game.fadeTo(() => { this.oi++; this.showOpening(); });
            else if (B.ready) Game.fadeTo(() => Game.newGame());
            else Game.fadeTo(() => { this.phase = 'soon'; this.t = 0; Dlg.open('', 'To be continued.\n\nThe ' + B.place.split('  ·  ')[0] + ' opening is being built, and it comes next. For now the Archaeologist\'s story is the one you can play.', () => Game.fadeTo(() => { this.phase = 'background'; this.bg = 0; this.t = 0; })); });
        });
    },
    // the preview sheet, redrawn only when a choice changes
    preview() { const k = JSON.stringify(this.choices) + this.gender; if (k !== this.sheetKey) { this.sheetKey = k; this.sheet = personSheet(this.look()); } return this.sheet; },
    finish() {
        const B = BACKGROUNDS[this.bg];
        Object.assign(Game.player, { name: this.name.trim(), gender: this.gender, choices: Object.assign({}, this.choices), bg: B.id, egyptian: !!(B.origin && this.egyptian) });
        this.oi = 0; Game.fadeTo(() => this.showOpening());
    },
    // keys that the name screen takes for itself (so you can just type)
    key(e) {
        if (this.phase !== 'name') return false;
        if (e.key === 'Backspace') { this.name = this.name.slice(0, -1); Sfx.back(); return true; }
        if (e.key.length === 1 && /[A-Za-z '\-.]/.test(e.key) && e.key !== ' ') { if (this.name.length < 10) { this.name += e.key; Sfx.tick(); } this.ky = 6; this.kx = 1; return true; }
        return false;
    },
    update(dt, I) {
        this.t += dt;
        if (Dlg.active) { if (this.phase === 'story' && I.back && !Game.fade) { Dlg.active = false; Sfx.back(); Game.fadeTo(() => { this.phase = 'background'; this.t = 0; }); return; } Dlg.update(dt, I); return; }
        if (this.phase === 'background') {
            const n = BACKGROUNDS.length, B = BACKGROUNDS[this.bg];
            if (I.up) { this.bg = (this.bg + n - 1) % n; this.t = 0; Sfx.move(); }
            if (I.down) { this.bg = (this.bg + 1) % n; this.t = 0; Sfx.move(); }
            if ((I.left || I.right) && B.origin) { this.egyptian = !this.egyptian; Sfx.tick(); }
            if (I.ok || I.enter) { Sfx.ok(); this.phase = 'gender'; }
            return;
        }
        if (this.phase === 'gender') {
            if (I.left || I.right) { this.gender = this.gender === 'm' ? 'f' : 'm'; this.choices = Object.assign({}, this.gender === 'm' ? CHOICES_M : CHOICES_F); Sfx.move(); }
            if (I.ok) { Sfx.ok(); this.phase = 'creator'; this.row = 0; }
            if (I.back) { Sfx.back(); this.phase = 'background'; }
        } else if (this.phase === 'creator') {
            const n = CREATOR.length + 2;
            if (I.enter) { Sfx.ok(); this.phase = 'name'; this.kx = 0; this.ky = 0; return; }        // ENTER: done, from any row
            if (I.up) { this.row = (this.row + n - 1) % n; Sfx.move(); }
            if (I.down) { this.row = (this.row + 1) % n; Sfx.move(); }
            if (this.row < CREATOR.length) {
                const cat = CREATOR[this.row], m = cat.opts.length;
                if (I.left) { this.choices[cat.key] = (this.choices[cat.key] + m - 1) % m; Sfx.tick(); }
                if (I.right || I.ok) { this.choices[cat.key] = (this.choices[cat.key] + 1) % m; Sfx.tick(); }
            } else if (I.ok) { Sfx.ok(); if (this.row === CREATOR.length) this.choices = randomChoices(); else { this.phase = 'name'; this.kx = 0; this.ky = 0; } }
            if (I.back) { Sfx.back(); this.phase = 'gender'; }
        } else if (this.phase === 'name') {
            if (I.left) { this.kx = (this.kx + 9) % 10; Sfx.move(); } if (I.right) { this.kx = (this.kx + 1) % 10; Sfx.move(); }
            if (I.up) { this.ky = (this.ky + 6) % 7; Sfx.move(); } if (I.down) { this.ky = (this.ky + 1) % 7; Sfx.move(); }
            if (this.ky === 6) this.kx = this.kx < 5 ? 0 : 1;               // the bottom row is two buttons: DELETE, DONE
            if (I.enter && this.name.trim()) { Sfx.ok(); this.phase = 'confirm'; this.confirmSel = 0; return; }
            if (I.ok) {
                if (this.ky === 6) { if (this.kx === 0) { this.name = this.name.slice(0, -1); Sfx.back(); } else if (this.name.trim()) { Sfx.ok(); this.phase = 'confirm'; this.confirmSel = 0; } else Sfx.bump(); }
                else { const ch = this.KEYS[this.ky][this.kx]; if (this.name.length < 10 && !(ch === ' ' && !this.name)) { this.name += ch; Sfx.tick(); } }
            }
            if (I.back && !this.name) { this.phase = 'creator'; Sfx.back(); }
        } else if (this.phase === 'confirm') {
            if (I.up) { this.confirmSel = (this.confirmSel + 3) % 4; Sfx.move(); } if (I.down) { this.confirmSel = (this.confirmSel + 1) % 4; Sfx.move(); }
            if (I.ok) { Sfx.ok(); this.phase = ['finish', 'creator', 'name', 'background'][this.confirmSel]; if (this.phase === 'finish') { this.phase = 'confirm'; this.finish(); } }
        }
    },
    draw(g) {
        const W = Game.VW, H = Game.VH, A = pa(g);
        if (this.phase === 'story') {
            const sc = SCENES[this.i];
            sc.draw(g, this.t, W, H);
            const cw = Txt.width(sc.cap) + 20; plaque(g, 8, 8, cw, 20); Txt.draw(g, sc.cap, 18, 12, { col: '#fff4d0', shadow: PAL.wood[3] });
            Txt.draw(g, 'ESC: skip', W - 8, 12, { col: '#ffffff', shadow: '#30302c', align: 'right' });
        } else if (this.phase === 'opening' || this.phase === 'soon') {
            const B = BACKGROUNDS[this.bg], sc = this.phase === 'soon' ? { cap: B.name, place: true } : B.scenes[this.oi];
            if (sc.place) bgWide(g, B.id, this.t, W, H, this.phase === 'soon' ? null : this.preview()); else sc.draw(g, this.t, W, H);
            const cw = Txt.width(sc.cap) + 20; plaque(g, 8, 8, cw, 20); Txt.draw(g, sc.cap, 18, 12, { col: '#fff4d0', shadow: PAL.wood[3] });
        } else {
            // the permit desk: a dark blotter, and whichever page you're on
            A.r(0, 0, W, H, '#2c2238'); for (let y = 0; y < H; y += 4) for (let x = (y & 4) * 2; x < W; x += 16) A.px(x, y, '#3a2e4a');
            if (this.phase !== 'background') { frieze(g, 0, 0, W); frieze(g, 0, H - 16, W, 3); }
            if (this.phase === 'background') this.drawBackground(g, W, H);
            else if (this.phase === 'gender') this.drawGender(g, W, H);
            else if (this.phase === 'creator') this.drawCreator(g, W, H);
            else if (this.phase === 'name') this.drawName(g, W, H);
            else this.drawConfirm(g, W, H);
        }
        if (Dlg.active) Dlg.draw(g);
    },
    drawGender(g, W, H) {
        const A = pa(g), cx = W >> 1, cy = Math.round(H * 0.44);
        frame(g, cx - 130, cy - 96, 260, 192);
        Txt.draw(g, 'YOUR PAPERS ASK:', cx, cy - 86, { align: 'center', col: UI.gold });
        Txt.draw(g, 'MALE OR FEMALE?', cx, cy - 72, { align: 'center', col: UI.ink });
        ['m', 'f'].forEach((k, i) => {
            const x = cx + (i ? 18 : -114), on = this.gender === k;
            if (on) { A.r(x - 4, cy - 52, 104, 118, '#5890d8'); A.r(x - 2, cy - 50, 100, 114, '#d8ecff'); }
            const sh = this.sh || (this.sh = { m: personSheet(lookFromChoices(CHOICES_M, 'm')), f: personSheet(lookFromChoices(CHOICES_F, 'f')) });
            g.globalAlpha = on ? 1 : 0.4; bigSprite(g, sh[k].frames[0][on ? [1, 0, 2, 0][(this.t * 5 | 0) % 4] : 0], x, cy - 46, 3); g.globalAlpha = 1;
            Txt.draw(g, k === 'm' ? 'MALE' : 'FEMALE', x + 48, cy + 50, { align: 'center', col: on ? UI.ink : UI.dim });
        });
        Txt.draw(g, '◄ ► choose     SPACE: next     ESC: back', cx, cy + 76, { align: 'center', col: UI.dim });
    },
    // WHO ARE YOU? the four backgrounds on the left, the one you're on in full on the right,
    // and underneath: skills, gear, and what only this one has
    drawBackground(g, W, H) {
        const A = pa(g), top = 18, lw = 142, lx = Math.max(6, (W - 470) >> 1), rx = lx + lw + 6, rw = Math.min(330, W - rx - 6), ph = Math.max(150, H - top - 84);
        Txt.draw(g, 'WHO ARE YOU?', lx + 2, 3, { col: '#ffe890', shadow: '#1e140e' });
        Txt.draw(g, '▲▼ choose    SPACE: this is me', rx + rw - 2, 3, { col: '#a898c0', align: 'right' });
        frame(g, lx, top, lw, ph);
        const rh = Math.floor((ph - 12) / 4);
        BACKGROUNDS.forEach((B, i) => {
            const y = top + 7 + i * rh, on = i === this.bg;
            if (on) { A.r(lx + 4, y - 1, lw - 8, rh - 2, '#5890d8'); A.r(lx + 5, y, lw - 10, rh - 4, '#d8ecff'); }
            const ey = y + ((rh - 30) >> 1);
            A.r(lx + 12, ey + 1, 26, 26, B.ready ? '#f4ecd4' : '#d8d0c0'); A.hl(lx + 12, ey + 1, 26, '#fffaf0');
            BG_EMBLEM[B.id](A, lx + 15, ey + 4);
            Txt.draw(g, B.name.replace('THE ', ''), lx + 44, ey + 2, { col: on ? UI.ink : UI.dim });
            Txt.draw(g, B.ready ? 'Play' : 'Preview', lx + 44, ey + 15, { col: B.ready ? '#388030' : '#a03028' });
            if (on) A.poly([[lx + 5, ey + 9], [lx + 5, ey + 19], [lx + 10, ey + 14]], '#d04838');
        });
        // the one you're on: where it starts, who you are, what's happened
        const B = BACKGROUNDS[this.bg], vx = rx + 8, vw = rw - 16, vh = Math.max(44, ph - 124);
        frame(g, rx, top, rw, ph, { band: '#e0a030', hi: '#ffe090' });
        g.save(); g.beginPath(); g.rect(vx, top + 8, vw, vh); g.clip(); BG_SCENE[B.id](A, vx, top + 8, vw, vh, this.t); g.restore();
        A.r(vx - 1, top + 7, vw + 2, 1, '#38404c'); A.r(vx - 1, top + 8 + vh, vw + 2, 1, '#38404c'); A.r(vx - 1, top + 7, 1, vh + 2, '#38404c'); A.r(vx + vw, top + 7, 1, vh + 2, '#38404c');
        const cap = B.place.toUpperCase(), cw = Txt.width(cap) + 12; A.r(vx + 3, top + 11, cw, 14, 'rgba(20,16,28,0.72)'); Txt.draw(g, cap, vx + 9, top + 12, { col: '#fff4d0' });
        if (!B.ready) { const cc = 'OPENING BEING BUILT', w2 = Txt.width(cc) + 12; A.r(vx + vw - w2 - 3, top + 8 + vh - 17, w2, 14, '#a03028'); Txt.draw(g, cc, vx + vw - 9, top + 8 + vh - 16, { col: '#ffffff', align: 'right' }); }
        let y = top + vh + 12; const tw = rw - 20;
        Txt.draw(g, B.name, rx + 10, y, { col: UI.gold }); Txt.draw(g, 'CHAPTER ' + B.chapter, rx + rw - 10, y, { col: UI.dim, align: 'right' }); y += 13;
        Txt.wrap(B.who + ' ' + B.hook, tw).slice(0, Math.floor((top + ph - 6 - y) / 12)).forEach(ln => { Txt.draw(g, ln, rx + 10, y, { col: UI.ink }); y += 12; });
        if (top + ph - 8 - y >= 14) Txt.draw(g, 'Four roads, one trail: they all meet in Cairo.', rx + 10, top + ph - 20, { col: UI.dim });
        // skills · gear · only you
        const eg = B.origin && this.egyptian, by = top + ph + 4, bh = H - by - 6, cols = [['SKILLS', eg ? B.skillsEg : B.skills], ['GEAR', eg ? B.gearEg : B.gear], ['ONLY YOU', B.only]];
        const bw = Math.floor((lw + rw + 6) / 3);
        cols.forEach(([k, v], i) => {
            const cx = lx + i * bw, w = i === 2 ? lw + rw + 6 - 2 * bw : bw - 4;
            frame(g, cx, by, w, bh, i === 2 ? { band: '#58a848', hi: '#b8f0a0' } : undefined);
            Txt.draw(g, k, cx + 8, by + 6, { col: i === 2 ? '#388030' : UI.gold });
            if (i === 0 && B.origin) Txt.draw(g, '◄ ' + (eg ? 'Egyptian' : 'Foreign') + ' ►', cx + w - 8, by + 6, { col: '#3058a0', align: 'right' });
            Txt.wrap(v.replace(/ · /g, ',  '), w - 16).slice(0, Math.floor((bh - 22) / 12)).forEach((ln, j) => Txt.draw(g, ln, cx + 8, by + 20 + j * 12, { col: UI.ink }));
        });
    },
    drawCreator(g, W, H) {
        const A = pa(g), pw = 132, lw = Math.min(250, W - pw - 36), x0 = (W - pw - lw - 12) >> 1, y0 = Math.max(6, (H - 236) >> 1);
        // the photograph
        frame(g, x0, y0, pw, 170, { band: '#e0a030', hi: '#ffe090' });
        Txt.draw(g, 'PERMIT PHOTO', x0 + (pw >> 1), y0 + 8, { align: 'center', col: UI.gold });
        A.r(x0 + 12, y0 + 24, pw - 24, 118, '#b8d4f0'); A.dith(x0 + 12, y0 + 100, pw - 24, 42, '#ecd698', 0); A.r(x0 + 12, y0 + 116, pw - 24, 26, '#ecd698');
        const sheet = this.preview(), dir = [0, 2, 3, 1][(this.t / 1.6 | 0) % 4];
        A.ell(x0 + (pw >> 1), y0 + 131, 20, 5, 'rgba(40,28,16,0.3)');
        bigSprite(g, sheet.frames[dir][[1, 0, 2, 0][(this.t * 5 | 0) % 4]], x0 + (pw >> 1) - 48, y0 + 38, 3);
        Txt.draw(g, this.gender === 'm' ? 'Male' : 'Female', x0 + (pw >> 1), y0 + 150, { align: 'center', col: UI.dim });
        frame(g, x0, y0 + 174, pw, 62);
        ['▲▼ category', '◄► change', 'ENTER: done'].forEach((s, i) => Txt.draw(g, s, x0 + 12, y0 + 182 + i * 14, { col: UI.dim }));
        // the list
        const lx = x0 + pw + 12, rows = CREATOR.length + 2;
        frame(g, lx, y0, lw, 236);
        Txt.draw(g, 'HOW DO YOU LOOK?', lx + 12, y0 + 8, { col: UI.gold });
        for (let i = 0; i < rows; i++) {
            const y = y0 + 25 + i * 16, on = i === this.row;
            if (on) A.r(lx + 6, y - 3, lw - 12, 15, '#d8ecff');
            if (i < CREATOR.length) {
                const cat = CREATOR[i], v = cat.opts[this.choices[cat.key] % cat.opts.length];
                Txt.draw(g, cat.label, lx + 12, y, { col: on ? UI.ink : UI.dim });
                Txt.draw(g, (on ? '◄ ' : '') + v + (on ? ' ►' : ''), lx + lw - 12, y, { col: on ? '#3058a0' : UI.ink, align: 'right' });
                if (on) Txt.draw(g, (this.choices[cat.key] % cat.opts.length + 1) + '/' + cat.opts.length, lx + 96, y, { col: UI.dim });
                const sw = cat.key === 'skin' ? SKINS[this.choices.skin % SKINS.length] : cat.key === 'hairCol' ? HAIRS[this.choices.hairCol % HAIRS.length] : cat.key === 'topCol' || cat.key === 'botCol' ? CLOTH[CLOTH_LIST[this.choices[cat.key] % CLOTH_LIST.length][1]] : null;
                if (sw) { const wv = Txt.width((on ? '◄ ' : '') + v + (on ? ' ►' : '')); A.r(lx + lw - 27 - wv, y + 1, 10, 10, '#38404c'); A.r(lx + lw - 26 - wv, y + 2, 8, 8, sw[sw.length > 2 ? 1 : 0]); A.r(lx + lw - 26 - wv, y + 8, 8, 2, sw[sw.length - 1]); }
            } else {
                Txt.draw(g, i === CREATOR.length ? 'SURPRISE ME' : 'DONE', lx + (lw >> 1), y, { col: on ? (i === CREATOR.length ? '#8050b0' : '#388030') : UI.dim, align: 'center' });
                if (on) A.poly([[lx + (lw >> 1) - 50, y + 1], [lx + (lw >> 1) - 50, y + 9], [lx + (lw >> 1) - 45, y + 5]], '#d04838');
            }
        }
    },
    drawName(g, W, H) {
        const A = pa(g), cx = W >> 1, y0 = Math.max(6, (H - 222) >> 1);
        frame(g, cx - 130, y0, 260, 58, { band: '#e0a030', hi: '#ffe090' });
        bigSprite(g, this.preview().frames[0][[1, 0, 2, 0][(this.t * 5 | 0) % 4]], cx - 120, y0 + 8, 1);
        Txt.draw(g, 'YOUR NAME?', cx - 84, y0 + 9, { col: UI.gold });
        for (let i = 0; i < 10; i++) { const x = cx - 84 + i * 16; A.r(x, y0 + 40, 12, 2, i === this.name.length && (this.t * 2 | 0) % 2 ? '#d04838' : '#38404c'); if (this.name[i]) Txt.draw(g, this.name[i], x + 6, y0 + 26, { col: UI.ink, align: 'center' }); }
        frame(g, cx - 130, y0 + 62, 260, 160);
        this.KEYS.forEach((row, j) => [...row].forEach((ch, i) => {
            const x = cx - 108 + i * 23, y = y0 + 74 + j * 19, on = j === this.ky && i === this.kx;
            if (on) { A.r(x - 4, y - 3, 17, 16, '#5890d8'); A.r(x - 3, y - 2, 15, 14, '#d8ecff'); }
            Txt.draw(g, ch === ' ' ? '␣' : ch, x + 4, y, { col: on ? UI.ink : UI.dim, align: 'center' });
        }));
        ['DELETE', 'DONE'].forEach((s, i) => { const x = cx + (i ? 34 : -96), y = y0 + 196, on = this.ky === 6 && this.kx === i; if (on) { A.r(x - 6, y - 4, 72, 18, '#5890d8'); A.r(x - 5, y - 3, 70, 16, '#d8ecff'); } Txt.draw(g, s, x + 30, y, { col: on ? UI.ink : UI.dim, align: 'center' }); });
        Txt.draw(g, 'Arrows + SPACE, or just type. ENTER when done.', cx, y0 + 226 > H - 12 ? H - 12 : y0 + 226, { col: '#d8c8a0', align: 'center' });
    },
    drawConfirm(g, W, H) {
        const A = pa(g), w = Math.min(300, W - 40), h = 170, x = (W - w) >> 1, y = Math.max(8, (H - h - 84) >> 1), D = BACKGROUNDS[this.bg].doc;
        A.r(x + 4, y + 4, w, h, '#1e140e'); A.r(x, y, w, h, '#f4ecd4'); A.r(x, y, w, 3, '#fffaf0');
        A.r(x, y + 3, w, 2, D.col);
        A.r(x + 14, y + 12, 26, 26, '#f4ecd4'); BG_EMBLEM[BACKGROUNDS[this.bg].id](A, x + 17, y + 15);
        Txt.draw(g, D.org, x + 44, y + 12, { col: D.col });
        Txt.draw(g, D.kind, x + 44, y + 25, { col: '#30302c' });
        A.r(x + 12, y + 42, w - 24, 1, '#b8a880');
        A.r(x + 14, y + 50, 70, 84, '#38404c'); A.r(x + 16, y + 52, 66, 80, '#b8d4f0'); A.r(x + 16, y + 108, 66, 24, '#ecd698');
        bigSprite(g, this.preview().frames[0][0], x + 17, y + 58, 2);
        D.rows(this.name.trim()).forEach(([k, v], i) => { Txt.draw(g, k, x + 94, y + 54 + i * 19, { col: '#8a7c60' }); Txt.draw(g, v, x + 150, y + 54 + i * 19, { col: '#30302c' }); A.r(x + 150, y + 66 + i * 19, w - 164, 1, '#c8bc9c'); });
        const sx = x + w - 40, sy = y + h - 34; A.ell(sx, sy, 20, 20, '#c03828'); A.ell(sx, sy, 17, 17, '#f4ecd4'); A.ell(sx, sy, 14, 14, '#c03828'); A.ell(sx, sy, 12, 12, '#f4ecd4'); Txt.draw(g, D.seal, sx, sy - 6, { col: '#c03828', align: 'center' });
        const opts = ['THIS IS ME', 'CHANGE MY LOOK', 'CHANGE MY NAME', 'CHANGE BACKGROUND'];
        frame(g, (W - 170) >> 1, y + h + 8, 170, 14 + opts.length * 15);
        opts.forEach((s, i) => { const yy = y + h + 16 + i * 15, ox = (W - 170) >> 1; Txt.draw(g, s, ox + 24, yy, { col: i === this.confirmSel ? UI.ink : UI.dim }); if (i === this.confirmSel) A.poly([[ox + 12, yy + 2], [ox + 12, yy + 10], [ox + 17, yy + 6]], '#d04838'); });
    },
};
