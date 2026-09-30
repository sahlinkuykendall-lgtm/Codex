// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE GAME (poke/game.js)
// The loop: input, free movement (any direction, pixel by pixel, sliding
// along walls), the camera, drawing the world back-to-front, the time of
// day, doors into the interiors, examining things, saving.
//
// Controls: WASD / arrows move · SHIFT run · SPACE / ENTER / Z talk, look
//           ESC / M menu · ESC / X back
// ============================================================

const Game = {
    VW: 480, VH: 270, scale: 3,
    state: 'boot',
    set: { textSpeed: 1, time: 1, run: 0, zoom: 0, volIdx: 2, volume: 1, names: 1 },
    player: { x: 0, y: 0, dir: 0, frame: 0, anim: 0, name: '', gender: 'm', choices: null, sheet: null },
    maps: {}, map: null,
    journal: [], bag: {}, seen: {}, taken: {},
    time: 0, hour: 9, fade: null, hintT: 0, bumpT: 0,
    keys: {}, I: {},
    SAVE: 'codexPoke_save_v1', SET: 'codexPoke_settings_v1',

    // ---- settings ----
    setIndex(k) { return k === 'volume' ? this.set.volIdx : this.set[k]; },
    setFromIndex(k, i) {
        if (k === 'volume') { this.set.volIdx = i; this.set.volume = [0, 0.4, 1, 1.8][i]; }
        else this.set[k] = i;
        if (k === 'zoom') this.resize();
        if (k === 'time' && i < 4) this.hour = [6.6, 12, 17.7, 22][i];
    },
    saveSettings() { try { localStorage.setItem(this.SET, JSON.stringify(this.set)); } catch (e) { } },
    loadSettings() { try { const s = JSON.parse(localStorage.getItem(this.SET) || 'null'); if (s) Object.assign(this.set, s); } catch (e) { } this.set.volume = [0, 0.4, 1, 1.8][this.set.volIdx]; if (this.set.time < 4) this.hour = [6.6, 12, 17.7, 22][this.set.time]; },

    // ---- saving ----
    hasSave() { try { return !!localStorage.getItem(this.SAVE); } catch (e) { return false; } },
    save() {
        const p = this.player, out = this.outdoorPos();
        const data = { v: 1, name: p.name, gender: p.gender, choices: p.choices, x: out[0], y: out[1], dir: p.dir, journal: this.journal, bag: this.bag, seen: this.seen, taken: this.taken, hour: this.hour };
        try { localStorage.setItem(this.SAVE, JSON.stringify(data)); } catch (e) { }
    },
    load() {
        let d = null;
        try { d = JSON.parse(localStorage.getItem(this.SAVE)); } catch (e) { }
        if (!d) return this.newGame();
        this.resetWorld();
        Object.assign(this.player, { name: d.name, gender: d.gender, choices: d.choices || null, x: d.x, y: d.y, dir: d.dir || 0 });
        this.journal = d.journal || []; this.bag = d.bag || {}; this.seen = d.seen || {}; this.taken = d.taken || {};
        if (this.set.time === 4 && d.hour != null) this.hour = d.hour;
        for (const e of this.maps.ch1.ents) if (e.id && this.taken[e.id]) World.removeEnt(this.maps.ch1, e);
        this.enter(this.maps.ch1);
        this.state = 'play';
    },
    resetWorld() {
        this.maps = { ch1: World.buildOutdoor(window.POKE_MAP) };
        this.journal = []; this.bag = { 'Field journal': 1, 'Letter of appointment': 1 }; this.seen = {}; this.taken = {};
    },
    newGame() {
        this.resetWorld();
        const m = this.maps.ch1, p = this.player;
        p.x = m.spawn[0]; p.y = m.spawn[1]; p.dir = DIR.up;
        this.enter(m);
        this.state = 'play'; this.hintT = 0;
        // the Rais comes to meet you with a lantern, says his piece, and walks back to the fire
        const rais = World.addEnt(m, { x: p.x, y: p.y - 34, w: 0, d: 0, label: 'Rais Abdallah', person: { sheet: personSheet(LOOKS.rais), dir: DIR.down, frame: 0 }, sortY: p.y - 34, light: { x: 6, y: -12, r: 64, c: '#ffd080' } });
        m.people.push(rais);
        setTimeout(() => Dlg.open('Rais Abdallah', '"Doctor ' + (p.name || '') + '. I am Abdallah, the Rais. Welcome to Giza."\n\n"Doctor Miriam did not leave for family reasons. She left her tea on the table and her boots by the door. Twenty years I know her. She does not go anywhere without her boots."\n\n"Doctor Lindqvist, the deputy, he will tell you about family. Hana will tell you about the finds. I will tell you the truth, when you ask me for it."\n\n"Also: the men are owed eleven days of wages. Come to the fire when you have seen your tent. It is the big one, behind me."', () => {
            rais.walkTo = [p.x - 420, p.y - 60]; rais.ghost = true;
            this.note('What to do', 'Look around Miriam\'s tent (north of where you arrived). Meet Dr. Lindqvist at the site trailer (east) and Hana (by the tent). Talk to the Rais about the wages at the workers\' fire (west).');
        }), 700);
    },
    enter(map) {
        this.map = map;
        const pl = this.player;
        if (!pl.choices) pl.choices = Object.assign({}, pl.gender === 'f' ? CHOICES_F : CHOICES_M);
        const key = JSON.stringify(pl.choices) + pl.gender;
        if (pl.sheetKey !== key) { pl.sheetKey = key; pl.sheet = personSheet(lookFromChoices(pl.choices, pl.gender)); }
        if (map.outdoor) { const CH = Ground.CH, cx = Math.floor(this.player.x / CH), cy = Math.floor(this.player.y / CH); for (let j = -1; j <= 1; j++) for (let i = -2; i <= 2; i++) Ground.get(cx + i, cy + j); }
        else Banner.show(map.name);
    },
    note(label, text, id) {
        const k = id || label, j = this.journal.find(x => x.k === k);
        if (j) { j.text = text; return; }
        this.journal.unshift({ k, label, text });
    },
    bagList() {
        const DESC = { 'Field journal': 'Your field journal. Everything you look at goes into it (JOURNAL, in the menu).', 'Letter of appointment': 'The Ministry\'s letter: you are acting director of the Giza Western Field concession, effective immediately.', 'Painted sherd': 'Painted pottery sherds from the surface. Late Period, mostly. Hana will want to see them.', 'Fossil': 'Nummulites: coin-shaped fossils from the limestone the pyramids are built of. Herodotus thought they were the builders\' lentils.' };
        return Object.keys(this.bag).map(k => [k + (this.bag[k] > 1 ? '  ×' + this.bag[k] : ''), DESC[k] || '']);
    },
    findCount() { return (this.bag['Painted sherd'] || 0) + (this.bag['Fossil'] || 0); },
    outdoorPos() { return this.map && !this.map.outdoor && this.map.back ? this.map.back : [this.player.x, this.player.y]; },
    placeName() {
        if (this.map && !this.map.outdoor) return this.map.name;
        const p = this.nearPlace();
        return p ? p.name : 'THE GIZA PLATEAU';
    },
    nearPlace() {
        const m = this.maps.ch1, [x, y] = this.outdoorPos();
        let best = null, bd = 1e9;
        for (const p of m.places) { const d = Math.hypot(p.x - x, p.y - y); if (d < p.r && d < bd) { bd = d; best = p; } }
        return best;
    },
    clockText() { const h = Math.floor(this.hour), m = Math.floor((this.hour - h) * 60); return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + '  ' + (this.hour < 5.5 || this.hour >= 19 ? 'Night' : this.hour < 8 ? 'Dawn' : this.hour < 16.5 ? 'Day' : 'Dusk'); },

    // ---- the map in the menu: one pixel per tile ----
    miniMap() {
        if (this._mm) return this._mm;
        const M = window.POKE_MAP, G = M.grid, [c, g] = mk(M.gw, M.gh), A = pa(g);
        for (let j = 0; j < M.gh; j++) for (let i = 0; i < M.gw; i++) {
            const k = j * M.gw + i, up = G.hgt[Math.max(0, k - M.gw - 1)] - G.hgt[k];
            let col = PAL.sand[up > 3 ? 3 : up < -3 ? 0 : 1];
            if (G.out[k] === '1') col = PAL.rock[3]; else if (G.rock[k] === '1') col = PAL.rock[2]; else if (G.dip[k] === '1') col = PAL.dirt[1]; else if (G.path[k] !== '0') col = PAL.road[2]; else if (G.wadi[k] === '1') col = PAL.gravel[1];
            A.px(i, j, col);
        }
        const S = 1 / M.TILE_U;
        for (const w of M.walls) if (w.k === 'pond') A.ell((w.x + w.w / 2) * S, (w.y + w.h / 2) * S, w.w / 2 * S, w.h / 2 * S, PAL.water[2]); else if (w.k === 'trunk') A.px(w.x * S, w.y * S, PAL.green[2]);
        for (const o of M.objects) if (/bldg|trailer|shed|post|booth|storage|mess|hanatent|maqam|shelter/i.test(o.id + o.model) && o.w < 500) A.r(o.x * S, o.y * S, Math.max(2, o.w * S), Math.max(2, o.h * S), PAL.wood[3]);
        for (const line of [M.rail, M.railLoop]) for (let i = 0; i + 1 < line.length; i++) A.line(line[i][0] * S, line[i][1] * S, line[i + 1][0] * S, line[i + 1][1] * S, PAL.dark[1]);
        return (this._mm = c);
    },

    // ---- the screen ----
    resize() {
        const W = window.innerWidth, H = window.innerHeight;
        let s = Math.max(1, Math.round(H / 350));
        if (this.set.zoom === 1) s = Math.max(1, s - 1); else if (this.set.zoom === 2) s += 1;
        this.scale = s; this.VW = Math.ceil(W / s); this.VH = Math.ceil(H / s);
        const c = this.canvas;
        c.width = this.VW; c.height = this.VH; c.style.width = this.VW * s + 'px'; c.style.height = this.VH * s + 'px';
        this.g.imageSmoothingEnabled = false;
        [this.tintC, this.tintG] = mk(this.VW, this.VH);
        Txt.cache.clear();
    },
    fadeTo(fn) { if (this.fade) return; this.fade = { t: 0, fn, done: false }; },

    // ---- time of day: what colour the light is, and how dark ----
    light() {
        const K = [[0, 58, 70, 140], [5, 58, 70, 140], [6.6, 255, 204, 176], [8.2, 255, 255, 255], [16.2, 255, 255, 255], [17.7, 255, 178, 124], [19.3, 72, 84, 152], [24, 58, 70, 140]];
        const h = this.hour;
        for (let i = 0; i + 1 < K.length; i++) if (h >= K[i][0] && h <= K[i + 1][0]) {
            const a = K[i], b = K[i + 1], t = (h - a[0]) / (b[0] - a[0]);
            const c = [1, 2, 3].map(k => Math.round(a[k] + (b[k] - a[k]) * t));
            return { c, dark: Math.max(0, Math.min(1, (200 - (c[0] + c[1] + c[2]) / 3) / 110)) };
        }
        return { c: [255, 255, 255], dark: 0 };
    },

    // ============================================================
    // UPDATE
    // ============================================================
    update(dt) {
        const I = this.I;
        this.time += dt;
        if (this.fade) {
            this.fade.t += dt;
            if (!this.fade.done && this.fade.t >= 0.22) { this.fade.done = true; this.fade.fn(); }
            if (this.fade.t >= 0.5) this.fade = null;
        }
        if (Menu.open) { Menu.update(dt, I); return; }
        if (this.state === 'title') { if (!this.fade) Title.update(dt, I); return; }
        if (this.state === 'intro') { if (!this.fade) Intro.update(dt, I); return; }
        if (this.state !== 'play') return;
        if (this.set.time === 4 && !Dlg.active) this.hour = (this.hour + dt / 30) % 24;       // a day in twelve minutes
        Banner.update(dt);
        this.hintT += dt;
        this.updatePeople(dt);
        if (Dlg.active) { Dlg.update(dt, I); return; }
        if (this.fade) return;
        if (I.menu) { Menu.toggle(); return; }
        this.movePlayer(dt);
        this.target = this.findTarget();
        if (I.ok && this.target) this.examine(this.target);
        // walked into a named place for the first time?
        if (this.map.outdoor) { const p = this.nearPlace(); if (p && p !== this.lastPlace) { this.lastPlace = p; Banner.show(p.name); this.seen[p.id] = 1; } else if (!p) this.lastPlace = null; }
    },

    solidAt(x, y) {
        const m = this.map;
        if (World.blocked(m, x - 6, y - 8, 12, 8)) return true;
        const night = this.light().dark > 0.5;
        for (const e of m.people) { if (e.gone || e.ghost || (e.nightOnly && !night)) continue; if (Math.abs(e.x - x) < 12 && y - 8 < e.y && y > e.y - 8) return true; }
        return false;
    },
    movePlayer(dt) {
        const k = this.keys, p = this.player;
        let vx = (k.right ? 1 : 0) - (k.left ? 1 : 0), vy = (k.down ? 1 : 0) - (k.up ? 1 : 0);
        if (!vx && !vy) { p.frame = 0; p.anim = 0; return; }
        // face the way you're going (keeping the facing you had on a diagonal)
        if (vx && !vy) p.dir = vx < 0 ? DIR.left : DIR.right;
        else if (vy && !vx) p.dir = vy < 0 ? DIR.up : DIR.down;
        else if (!((p.dir === DIR.left && vx < 0) || (p.dir === DIR.right && vx > 0) || (p.dir === DIR.up && vy < 0) || (p.dir === DIR.down && vy > 0))) p.dir = vx < 0 ? DIR.left : DIR.right;
        const run = (k.run ? 1 : 0) ^ this.set.run, speed = run ? 168 : 96, n = Math.hypot(vx, vy);
        const dx = vx / n * speed * dt, dy = vy / n * speed * dt;
        let moved = false;
        if (dx && !this.solidAt(p.x + dx, p.y)) { p.x += dx; moved = true; }
        if (dy && !this.solidAt(p.x, p.y + dy)) { p.y += dy; moved = true; }
        if (moved) { p.anim += speed * dt / 13; p.frame = [1, 0, 2, 0][Math.floor(p.anim) % 4]; }
        else { p.frame = 0; this.bumpT -= dt; if (this.bumpT <= 0) { Sfx.bump(); this.bumpT = 0.45; } }
        // doors
        const m = this.map;
        if (m.outdoor) { if (vy < 0) for (const d of m.doors) if (p.x > d.x && p.x < d.x + d.w && p.y > d.y && p.y < d.y + d.h + 4) return this.goInside(d); }
        else if (p.y > m.exit.y) this.goOutside();
    },
    goInside(d) {
        const back = [d.x + d.w / 2, d.y + d.h + 10];
        Sfx.door();
        this.fadeTo(() => {
            const room = this.maps[d.to] || (this.maps[d.to] = buildRoom(d.to, window.POKE_MAP, back));
            room.back = back;
            this.player.x = room.spawn[0]; this.player.y = room.spawn[1]; this.player.dir = DIR.up;
            this.enter(room);
        });
    },
    goOutside() {
        const back = this.map.back;
        Sfx.door();
        this.player.y = this.map.exit.y;
        this.fadeTo(() => { this.player.x = back[0]; this.player.y = back[1]; this.player.dir = DIR.down; this.enter(this.maps.ch1); this.lastPlace = this.nearPlace(); });
    },

    // the thing you're facing, close enough to look at
    findTarget() {
        const p = this.player, m = this.map, fx = [0, -1, 1, 0][p.dir], fy = [1, 0, 0, -1][p.dir];
        const night = this.light().dark > 0.5;
        let best = null, bd = 22;
        const px = p.x, py = p.y - 5;
        for (const e of m.ents) {
            if (!e.say || e.gone || (e.nightOnly && !night)) continue;
            let rx, ry, rw, rh;
            if (e.person) { rx = e.x - 8; ry = e.y - 12; rw = 16; rh = 14; }
            else if (!e.w) { rx = e.x - 10; ry = e.y - 10; rw = 20; rh = 12; }
            else { rx = e.x; ry = e.y; rw = e.w; rh = e.d; }
            if (px < rx - 26 || px > rx + rw + 26 || py < ry - 26 || py > ry + rh + 26) continue;
            const nx = Math.max(rx, Math.min(px, rx + rw)), ny = Math.max(ry, Math.min(py, ry + rh));
            const dx = nx - px, dy = ny - py, d = Math.hypot(dx, dy);
            if (d > 20) continue;
            const facing = d < 4 ? 1 : (dx * fx + dy * fy) / d;
            if (facing < 0.1) continue;
            const score = d - facing * 6;
            if (score < bd) { bd = score; best = e; }
        }
        return best;
    },
    examine(e) {
        const p = this.player;
        if (e.person) { const dx = p.x - e.x, dy = p.y - e.y; e.person.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? DIR.left : DIR.right) : (dy < 0 ? DIR.up : DIR.down); e.person.frame = 0; }
        Sfx.ok();
        const [speaker, text] = e.say;
        Dlg.open(speaker, text, () => {
            this.note(e.label || speaker, text, e.id);
            if (e.pickup) {
                this.bag[e.pickup] = (this.bag[e.pickup] || 0) + 1; this.taken[e.id] = 1;
                World.removeEnt(this.map, e); Sfx.get(); Toast.show('Got a ' + e.pickup.toLowerCase() + '!');
            }
        });
    },

    updatePeople(dt) {
        const m = this.map, p = this.player;
        for (const e of m.people) {
            if (e.gone) continue;
            const P = e.person;
            if (e.walkTo) {                                         // walking somewhere (through anything), then gone
                const dx = e.walkTo[0] - e.x, dy = e.walkTo[1] - e.y, d = Math.hypot(dx, dy);
                if (d < 4 || Math.hypot(e.x - p.x, e.y - p.y) > Math.max(this.VW, this.VH)) { e.gone = true; continue; }
                e.x += dx / d * 70 * dt; e.y += dy / d * 70 * dt; e.sortY = e.y;
                P.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? DIR.left : DIR.right) : (dy < 0 ? DIR.up : DIR.down);
                P.anim = (P.anim || 0) + 70 * dt / 13; P.frame = [1, 0, 2, 0][Math.floor(P.anim) % 4];
                continue;
            }
            const w = e.wander;
            if (!w || Dlg.active) continue;
            w.t -= dt;
            if (w.t <= 0) {
                if (w.v || Math.random() < 0.45) { w.v = null; w.t = 1.5 + Math.random() * 3; P.frame = 0; }
                else { const d = Math.floor(Math.random() * 4); w.v = [[0, 1], [-1, 0], [1, 0], [0, -1]][d]; P.dir = d; w.t = 0.5 + Math.random() * 0.9; }
            }
            if (w.v) {
                const nx = e.x + w.v[0] * 26 * dt, ny = e.y + w.v[1] * 26 * dt;
                const ok = Math.hypot(nx - w.home[0], ny - w.home[1]) < w.r && !World.blocked(m, nx - 6, ny - 8, 12, 8) && !(Math.abs(nx - p.x) < 14 && Math.abs(ny - p.y) < 10);
                if (ok) { e.x = nx; e.y = ny; e.sortY = ny; P.anim = (P.anim || 0) + 26 * dt / 13; P.frame = [1, 0, 2, 0][Math.floor(P.anim) % 4]; }
                else { w.v = null; P.frame = 0; }
            }
        }
    },

    // ============================================================
    // DRAW
    // ============================================================
    draw() {
        const g = this.g, VW = this.VW, VH = this.VH;
        if (this.state === 'title') Title.draw(g);
        else if (this.state === 'intro') Intro.draw(g);
        else if (this.state === 'play') this.drawWorld(g);
        else { g.fillStyle = '#101838'; g.fillRect(0, 0, VW, VH); Txt.draw(g, 'Drawing the desert…', VW >> 1, VH >> 1, { col: '#ffe890', align: 'center' }); }
        if (Menu.open) Menu.draw(g);
        if (this.fade) { const t = this.fade.t, a = t < 0.22 ? t / 0.22 : 1 - (t - 0.22) / 0.28; g.fillStyle = 'rgba(0,0,0,' + Math.max(0, Math.min(1, a)).toFixed(2) + ')'; g.fillRect(0, 0, VW, VH); }
    },
    drawWorld(g) {
        const VW = this.VW, VH = this.VH, m = this.map, p = this.player, A = pa(g);
        // camera: on the player, held inside the map (a small room sits in the middle of the screen)
        let cx = m.pw <= VW ? (m.pw - VW) / 2 : Math.max(0, Math.min(m.pw - VW, p.x - VW / 2));
        let cy = m.ph <= VH ? (m.ph - VH) / 2 : Math.max(0, Math.min(m.ph - VH, p.y - 12 - VH / 2));
        cx = Math.round(cx); cy = Math.round(cy);
        this.cam = [cx, cy];
        if (m.outdoor) Ground.draw(g, cx, cy, VW, VH);
        else { g.fillStyle = '#0c0a10'; g.fillRect(0, 0, VW, VH); g.drawImage(m.bg, -cx, -cy); }
        const L = this.light(), night = L.dark > 0.5;
        // everything that stands, back to front
        const vis = [];
        for (const e of m.ents) {
            if (e.gone || (e.nightOnly && !night)) continue;
            const sp = e.spr;
            if (e.person) { if (e.x > cx - 20 && e.x < cx + VW + 20 && e.y > cy - 8 && e.y < cy + VH + 36) vis.push(e); }
            else if (sp) { const x = e.x + sp.ox, y = e.y + sp.oy; if (x < cx + VW && x + sp.c.width > cx && y < cy + VH && y + sp.c.height > cy) vis.push(e); }
        }
        const me = { person: p, x: p.x, y: p.y, sortY: p.y, me: true };
        vis.push(me);
        vis.sort((a, b) => a.sortY - b.sortY);
        for (const e of vis) {
            if (e.person) {
                const P = e.person, fr = (e.me ? p.sheet : P.sheet).frames[P.dir][P.frame || 0];
                g.fillStyle = 'rgba(40,28,16,0.30)'; A.ell(Math.round(e.x - cx), Math.round(e.y - cy), 7, 2, g.fillStyle);
                g.drawImage(fr, Math.round(e.x - 16 - cx), Math.round(e.y - 30 - cy));
            } else {
                const sp = e.spr, c = sp.frames ? sp.frames[Math.floor(this.time * sp.fps) % sp.frames.length] : sp.c;
                g.drawImage(c, Math.round(e.x + sp.ox - cx), Math.round(e.y + sp.oy - cy));
                if (sp.sparkle && (this.time * 1.4 + e.x * 0.37) % 2.2 < 0.35) { const sx = Math.round(e.x + e.w / 2 - cx), sy = Math.round(e.y - 4 - cy); A.r(sx - 2, sy, 5, 1, '#ffffff'); A.r(sx, sy - 2, 1, 5, '#ffffff'); }
            }
        }
        // the light of the hour, and lamps once it's dark
        if (m.outdoor && (L.c[0] < 250 || L.c[1] < 250)) {
            const tg = this.tintG, TA = pa(tg);
            tg.globalCompositeOperation = 'source-over'; tg.fillStyle = 'rgb(' + L.c.join(',') + ')'; tg.fillRect(0, 0, VW, VH);
            if (L.dark > 0.08) {
                tg.globalCompositeOperation = 'lighter';
                for (const e of m.ents) {
                    const li = e.light; if (!li || e.gone || (e.nightOnly && !night)) continue;
                    const x = Math.round((e.person || !e.w ? e.x : e.x + e.w / 2) + li.x - cx), y = Math.round((e.person || !e.w ? e.y : e.y + e.d) + li.y - cy);
                    if (x < -li.r || x > VW + li.r || y < -li.r || y > VH + li.r) continue;
                    const fl = li.flicker ? 1 + Math.sin(this.time * 11 + e.x) * 0.06 : 1, [r, gg, b] = hex(li.c), a = L.dark;
                    [[1, 0.16], [0.7, 0.2], [0.42, 0.26], [0.2, 0.3]].forEach(([k, al]) => TA.ell(x, y, Math.round(li.r * k * fl), Math.round(li.r * k * fl * 0.8), 'rgba(' + r + ',' + gg + ',' + b + ',' + (al * a).toFixed(3) + ')'));
                }
            }
            g.globalCompositeOperation = 'multiply'; g.drawImage(this.tintC, 0, 0); g.globalCompositeOperation = 'source-over';
        }
        // name tag over what you're facing, and the door you're near
        if (!Dlg.active && this.set.names) {
            const t = this.target;
            if (t && t.label) this.tag(g, t.label, (t.person || !t.w ? t.x : t.x + t.w / 2) - cx, (t.person ? t.y - 34 : t.spr ? t.y + t.spr.oy - 4 : t.y - 8) - cy);
            if (m.outdoor) for (const d of m.doors) if (Math.abs(p.x - (d.x + d.w / 2)) < 40 && p.y > d.y && p.y < d.y + d.h + 34) this.tag(g, '▲ ' + d.label, d.x + d.w / 2 - cx, d.y - 22 - cy);
        }
        Banner.draw(g);
        Toast.draw(g, 1 / 60);
        if (this.hintT < 14 && !Dlg.active) Txt.draw(g, 'MOVE: WASD / arrows    RUN: Shift    LOOK / TALK: Space    MENU: Esc', VW >> 1, VH - 14, { col: '#ffffff', shadow: '#30302c', align: 'center' });
        if (Dlg.active) Dlg.draw(g);
    },
    tag(g, s, x, y) {
        const w = Txt.width(s) + 10, A = pa(g);
        x = Math.round(Math.max(2, Math.min(this.VW - w - 2, x - w / 2))); y = Math.round(Math.max(2, y - 12 + Math.sin(this.time * 4) * 1));
        A.r(x + 1, y, w - 2, 14, '#30302c'); A.r(x, y + 1, w, 12, '#30302c'); A.r(x + 1, y + 1, w - 2, 12, '#f8f8f0');
        Txt.draw(g, s, x + 5, y + 1, { col: '#30302c' });
    },

    // ============================================================
    // BOOT
    // ============================================================
    boot() {
        this.canvas = document.getElementById('poke');
        this.g = this.canvas.getContext('2d');
        this.loadSettings();
        this.resize();
        window.addEventListener('resize', () => this.resize());
        const MAPK = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', Shift: 'run' };
        window.addEventListener('keydown', e => {
            Sfx.ctx();
            if (this.state === 'intro' && !Dlg.active && Intro.key(e)) { e.preventDefault(); return; }
            const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, held = MAPK[k];
            if (held) { if (!this.keys[held] || e.repeat) { if (held !== 'run' && (!e.repeat || Menu.open || this.state !== 'play')) this.I[held] = true; } this.keys[held] = true; e.preventDefault(); }
            if (e.repeat) return;
            if (k === ' ' || k === 'Enter' || k === 'z' || k === 'e') { this.I.ok = true; e.preventDefault(); }
            if (k === 'Enter') this.I.enter = true;
            if (k === 'Escape' || k === 'x' || k === 'Backspace') this.I.back = true;
            if (k === 'Escape' || k === 'm' || k === 'Tab') { this.I.menu = true; e.preventDefault(); }
        });
        window.addEventListener('keyup', e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (MAPK[k]) this.keys[MAPK[k]] = false; });
        window.addEventListener('blur', () => { this.keys = {}; });
        Ground.init(window.POKE_MAP);
        this.state = 'title';
        let last = performance.now();
        const loop = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000); last = now;
            try { this.update(dt); this.draw(); } catch (err) { console.error(err); this.err = err; }
            this.I = {};
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        window.POKE_READY = true;
    },
};
window.addEventListener('DOMContentLoaded', () => Game.boot());
