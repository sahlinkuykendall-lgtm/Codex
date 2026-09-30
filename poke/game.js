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
    set: { textSpeed: 1, run: 0, zoom: 0, volIdx: 2, volume: 1, music: 2, names: 1, notices: 1, time: 5, sv: 2 },
    player: { x: 0, y: 0, dir: 0, frame: 0, anim: 0, name: '', gender: 'm', choices: null, bg: 'archaeologist', egyptian: false, sheet: null },
    maps: {}, map: null,
    journal: [], bag: {}, seen: {}, taken: {}, story: null,
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
        if (k === 'time' && i === 5 && this.story) this.hour = storyHour();
    },
    saveSettings() { try { localStorage.setItem(this.SET, JSON.stringify(this.set)); } catch (e) { } },
    loadSettings() { try { const s = JSON.parse(localStorage.getItem(this.SET) || 'null'); if (s) { if (!s.sv) { s.time = 5; s.sv = 2; } Object.assign(this.set, s); } } catch (e) { }   // (settings from before P0.8 move onto the story clock once)
 this.set.volume = [0, 0.4, 1, 1.8][this.set.volIdx]; if (this.set.time < 4) this.hour = [6.6, 12, 17.7, 22][this.set.time]; },

    // ---- saving ----
    hasSave() { try { return !!localStorage.getItem(this.SAVE); } catch (e) { return false; } },
    save() {
        const p = this.player, out = this.outdoorPos();
        const data = { v: 2, story: this.story, name: p.name, gender: p.gender, choices: p.choices, bg: p.bg, egyptian: p.egyptian, x: out[0], y: out[1], dir: p.dir, journal: this.journal, bag: this.bag, seen: this.seen, taken: this.taken, hour: this.hour };
        try { localStorage.setItem(this.SAVE, JSON.stringify(data)); } catch (e) { }
    },
    load() {
        let d = null;
        try { d = JSON.parse(localStorage.getItem(this.SAVE)); } catch (e) { }
        if (!d) return this.newGame();
        Object.assign(this.player, { name: d.name, gender: d.gender, choices: d.choices || null, bg: d.bg || 'archaeologist', egyptian: !!d.egyptian, x: d.x, y: d.y, dir: d.dir || 0 });
        this.resetWorld();                                 // (after the background is known: it decides the area)
        this.journal = d.journal || []; this.bag = d.bag || {}; this.seen = d.seen || {}; this.taken = d.taken || {};
        this.story = Story.restore(d.story);
        if (this.set.time === 5) this.hour = storyHour();
        area().sync();                                   // (Giza: buried spots first, they must not see the parked car)
        if (this.set.time === 4 && d.hour != null) this.hour = d.hour;
        for (const e of this.maps.ch1.ents) if (e.id && this.taken[e.id]) World.removeEnt(this.maps.ch1, e);
        this.enter(this.maps.ch1);
        this.state = 'play';
    },
    resetWorld() {
        const A = area();                                  // the background's own place (poke/areas.js)
        if (this.campFor !== A) { this.camp = A.layout(); this.campFor = A; }
        CampGround.init(this.camp);
        this.maps = { ch1: World.buildCamp(this.camp, A.objects()) };
        this._mm = null; Music.radio = null;
        this.journal = []; this.bag = { 'Field journal': 1, 'Letter of appointment': 1 }; this.seen = {}; this.taken = {};
        this.story = Story.fresh(this.player.bg); this.lenaCar = null;
        Detector.spots = []; Detector.on = false; Detector.dig = null;
        Object.assign(Bosta, { x: 0, y: 0, crumbs: [], still: 0, awake: false, warned: false });
    },
    newGame() {
        this.resetWorld();
        const m = this.maps.ch1, p = this.player;
        p.x = m.spawn[0]; p.y = m.spawn[1]; p.dir = DIR.up;
        this.enter(m);
        if (this.set.time === 5) this.hour = storyHour();
        const A = area();
        if (!A.giza) { this.state = 'play'; this.hintT = 0; A.newGame(); return; }
        A.newGame();                                     // (Giza: buried spots first, they must not see the parked car)
        this.state = 'play'; this.hintT = 0;
        // the Rais comes to meet you with a lantern, says his piece (poke/ch1_scenes.js), and walks back to the fire
        const rais = World.addEnt(m, { x: p.x, y: p.y - 34, w: 0, d: 0, label: 'Rais Abdallah', person: { sheet: personSheet(LOOKS.rais), dir: DIR.down, frame: 0 }, sortY: p.y - 34, light: { x: 6, y: -12, r: 64, c: '#ffd080' } });
        m.people.push(rais);
        this.arrivalRais = rais;
        setTimeout(() => startDialogue('scene1_start'), 700);
    },
    // the end of the arrival: the Rais walks off to the fire
    raisLeaves() {
        const r = this.arrivalRais, p = this.player; if (!r) return;
        r.walkTo = [p.x - 420, p.y - 60]; r.ghost = true; this.arrivalRais = null;
    },
    enter(map) {
        this.map = map;
        const pl = this.player;
        if (!pl.choices) pl.choices = Object.assign({}, pl.gender === 'f' ? CHOICES_F : CHOICES_M);
        const key = JSON.stringify(pl.choices) + pl.gender;
        if (pl.sheetKey !== key) { pl.sheetKey = key; pl.sheet = personSheet(lookFromChoices(pl.choices, pl.gender)); }
        if (map.outdoor) { const CH = CampGround.CH, cx = Math.floor(this.player.x / CH), cy = Math.floor(this.player.y / CH); for (let j = -1; j <= 1; j++) for (let i = -2; i <= 2; i++) CampGround.get(cx + i, cy + j); }
        else Banner.show(map.name);
    },
    note(label, text, id) {
        const k = id || label, j = this.journal.find(x => x.k === k);
        if (j) { j.text = text; return; }
        this.journal.unshift({ k, label, text });
    },
    bagList() {
        const DESC = { 'Field journal': 'Your field journal. Everything you look at goes into it (JOURNAL, in the menu).', 'Letter of appointment': 'The Ministry\'s letter: you are acting director of the Giza Western Field concession, effective immediately.', 'Painted sherd': 'Painted pottery sherds from the surface. Late Period, mostly. Hana will want to see them.', 'Fossil': 'Nummulites: coin-shaped fossils from the limestone the pyramids are built of. Herodotus thought they were the builders\' lentils.' };
        const key = k => ITEM_INFO[k] && ITEM_INFO[k].key ? 1 : 0;
        const watch = ['Watch   ' + clockStr(), 'Your watch. It is ' + this.clockText().replace('  ', ', ') + '.' + (this.story && area().watch ? area().watch() : '')];
        return [watch].concat(Object.keys(this.bag).sort((a, b) => key(b) - key(a)).map(k => [(key(k) ? '★ ' : '') + k + (k === 'Canteen' ? '  (' + (sflag('canteen') ?? 3) + '/3)' : this.bag[k] > 1 ? '  ×' + this.bag[k] : ''), (DESC[k] || (ITEM_INFO[k] && ITEM_INFO[k].desc) || '') + (ITEM_USE[k] && k !== 'Canteen' ? '  (SPACE: use it.)' : ''), k]));
    },
    findCount() { return (this.bag['Painted sherd'] || 0) + (this.bag['Fossil'] || 0); },
    outdoorPos() { return this.map && !this.map.outdoor && this.map.back ? this.map.back : [this.player.x, this.player.y]; },
    placeName() {
        if (this.map && !this.map.outdoor) return this.map.name;
        const p = this.nearPlace();
        return p ? p.name : area().name;
    },
    nearPlace() {
        const m = this.maps.ch1, [x, y] = this.outdoorPos();
        let best = null, bd = 1e9;
        for (const p of m.places) { const d = Math.hypot(p.x - x, p.y - y); if (d < p.r && d < bd) { bd = d; best = p; } }
        return best;
    },
    clockText() { const hr = this.story ? storyHour() : this.hour; return clockStr(hr * 60) + '  ' + (hr < 5.5 || hr >= 19 ? 'Night' : hr < 8 ? 'Dawn' : hr < 16.5 ? 'Day' : 'Dusk'); },

    // ---- the map in the menu: one pixel per tile ----
    miniMap() {
        if (this._mm) return this._mm;
        const L = this.camp, [c, g] = mk(L.W, L.H), A = pa(g);
        const COL = { [T.SAND]: '#ecd49a', [T.PATH]: '#c89e62', [T.ROCK]: '#9a7e58', [T.WATER]: '#4a98dc', [T.DIG]: '#5a422a', [T.STONE]: '#e8dcc0', [T.RAIL]: '#5a5048', [T.GRAVEL]: '#b8a882', [T.FIELD]: '#5aa048', [T.ROAD]: '#77726c', [T.YARD]: '#e8c98e' };
        for (let y = 0; y < L.H; y++) for (let x = 0; x < L.W; x++) A.px(x, y, COL[L.get(x, y)]);
        for (const e of this.maps.ch1.ents) if (e.spr && e.w >= TILE * 2 && !e.spr.flat) A.r(e.x / TILE, e.y / TILE, e.w / TILE, Math.max(1, e.d / TILE), '#804c28');
        for (const [tx, ty] of L.trees) A.px(tx, ty, '#388030');
        return (this._mm = c);
    },

    // ---- the screen ----
    resize() {
        const W = window.innerWidth, H = window.innerHeight;
        let s = Math.max(1, Math.round(H / 290));
        if (this.set.zoom === 1) s = Math.max(1, Math.round(H / 390)); else if (this.set.zoom === 2) s += 1;
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
        try { Music.tick(); } catch (e) { }                        // (the tunes: poke/music.js)
        if (EndCard.open) { if (!this.fade) EndCard.update(dt, I); return; }
        if (Mini.cur) { if (!this.fade) Mini.update(dt, I, this.keys); return; }
        if (WorldMap.open) { WorldMap.update(dt, I); return; }
        if (Picture.open) { Picture.update(dt, I); return; }
        if (Menu.open) { Menu.update(dt, I); return; }
        if (Phone.open) { Phone.update(dt, I); return; }
        if (this.state === 'title') { if (!this.fade) Title.update(dt, I); return; }
        if (this.state === 'intro') { if (!this.fade) Intro.update(dt, I); return; }
        if (this.state !== 'play') return;
        if (this.set.time === 4 && !Dlg.active) this.hour = (this.hour + dt / 30) % 24;       // a day in twelve minutes
        else if (this.set.time === 5) this.hour = storyHour();                                 // the light follows the story clock
        Banner.update(dt);
        this.hintT += dt; Tracker.flashT = Math.max(0, Tracker.flashT - dt);
        this.updatePeople(dt);
        if (Dlg.active) { Dlg.update(dt, I); return; }
        if (this.fade) return;
        clockTick(dt);                                     // story time passes only while you're free to walk about
        needsTutorial();                                   // (once: what water and food do, poke/systems.js)
        area().frame(dt);                                  // the story's timed events, and the world matching the story
        const gz = area().giza;
        if (I.menu) { Menu.toggle(); return; }
        if (I.map) { WorldMap.show(0); return; }
        if (gz && Detector.dig) { Detector.update(dt); return; }      // kneeling, digging
        if (gz && I.tool && Detector.toggle()) return;
        if (I.phone) { Phone.toggle(); return; }
        if (I.track) Tracker.flash();                      // T: which way is the tracked task? (poke/tracker.js)
        this.movePlayer(dt);
        if (gz) { Detector.update(dt); Bosta.update(dt); }
        this.target = this.findTarget();
        if (I.cam) takePhoto();
        if (gz && I.ok && Detector.on && Detector.pin) Detector.startDig();
        else if (I.ok && this.target) this.examine(this.target);
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
        const run = (k.run ? 1 : 0) ^ this.set.run, speed = moveSpeed(run), n = Math.hypot(vx, vy);   // (limping, or parched or starving: no running)
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
        if (area().door(d)) { this.player.y += 6; return; }            // the story stops you at the door (someone's in there)
        const back = [d.x + d.w / 2, d.y + d.h + 10];
        Sfx.door();
        this.fadeTo(() => {
            const room = this.maps[d.to] || (this.maps[d.to] = buildRoom(d.to, window.POKE_MAP, back));
            room.back = back;
            this.player.x = room.spawn[0]; this.player.y = room.spawn[1]; this.player.dir = DIR.up;
            this.enter(room);
            area().onEnter(d.to);
            const def = ROOMS[d.to];                                   // the first time in: what the building is
            if (def.enter && !sflag('in_' + d.to)) { sflag('in_' + d.to, true); Dlg.open(def.enter[0], def.enter[1]); }
        });
    },
    goOutside() {
        const up = this.map.up;
        if (up) {                                                      // a ladder up to the level above, not the open air
            Sfx.door(); clockAdvance(5); this.player.y = this.map.exit.y;
            this.fadeTo(() => { this.player.x = up.at[0]; this.player.y = up.at[1]; this.player.dir = DIR.down; this.enter(this.maps[up.key]); });
            return;
        }
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
        const dogT = area().giza && Bosta.talkable();
        for (const e of dogT ? m.ents.concat([dogT]) : m.ents) {
            if (!(e.say || scriptFor(e)) || e.gone || e.noLook || (e.nightOnly && !night)) continue;
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
        const sc = scriptFor(e);
        this.talkId = e.id;                                 // (so a scene shared by several things knows which one)
        if (e.picture && !e.pictureShown) { e.pictureShown = true; return Picture.show(e.picture, () => { this.examine(e); e.pictureShown = false; }); }   // (a map on the wall: shown big first)
        if (sc) return startDialogue(sc);                   // a scripted conversation (poke/ch1_scenes.js)
        const [speaker, text] = e.say;
        Dlg.open(speaker, text, () => {
            this.note(e.label || speaker, text, e.id);
            if (e.pickup) {
                this.bag[e.pickup] = (this.bag[e.pickup] || 0) + 1; this.taken[e.id] = 1;
                World.removeEnt(this.map, e); Sfx.get(); Toast.show('Got a ' + e.pickup.toLowerCase() + '!');
                storyPickup(e.pickup);
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
        if (Mini.cur) Mini.draw(g);
        if (Picture.open) Picture.draw(g);
        if (Phone.open) Phone.draw(g);
        Camera.draw(g, 1 / 60);
        if (Menu.open) Menu.draw(g);
        if (WorldMap.open) WorldMap.draw(g);
        if (EndCard.open) EndCard.draw(g);
        if (this.fade) { const t = this.fade.t, a = t < 0.22 ? t / 0.22 : 1 - (t - 0.22) / 0.28; g.fillStyle = 'rgba(0,0,0,' + Math.max(0, Math.min(1, a)).toFixed(2) + ')'; g.fillRect(0, 0, VW, VH); }
    },
    drawWorld(g) {
        const VW = this.VW, VH = this.VH, m = this.map, p = this.player, A = pa(g);
        // camera: on the player, held inside the map (a small room sits in the middle of the screen)
        let cx = m.pw <= VW ? (m.pw - VW) / 2 : Math.max(0, Math.min(m.pw - VW, p.x - VW / 2));
        let cy = m.ph <= VH ? (m.ph - VH) / 2 : Math.max(0, Math.min(m.ph - VH, p.y - 12 - VH / 2));
        cx = Math.round(cx); cy = Math.round(cy);
        this.cam = [cx, cy];
        if (m.outdoor) CampGround.draw(g, cx, cy, VW, VH);
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
        if (area().giza) { const coil = m.outdoor && Detector.coil(p); if (coil) vis.push(coil); const dog = Bosta.ent(); if (dog) vis.push(dog); }
        vis.sort((a, b) => a.sortY - b.sortY);
        // soft shadows first, so they fall on the ground and never across a sprite
        g.fillStyle = 'rgba(64,40,24,0.2)';
        for (const e of vis) {
            const sp = e.spr;
            if (e.person || e.custom) continue;
            if (!sp || sp.flat || sp.noShadow || sp.thin) continue;
            if (!e.w) { const r = Math.min(16, Math.max(5, sp.c.width * 0.3)); A.ell(Math.round(e.x - cx + 2), Math.round(e.y - cy), r, Math.max(2, Math.round(r * 0.32)), g.fillStyle); continue; }
            // sized from the drawing itself (a footprint can be bigger than what's drawn on it)
            const left = Math.round(e.x + sp.ox - cx), bottom = Math.round(e.y + sp.oy + sp.c.height - cy) - 2, cw = sp.c.width;
            if (cw > 60 && cw >= e.w - 6) { g.fillRect(left + 4, bottom - 1, cw - 4, 4); if (!sp.footShadow) g.fillRect(left + cw - 1, bottom - Math.min(e.d, 30), 3, Math.min(e.d, 30)); }   // buildings: along the foot and down the east side
            else A.ell(left + (cw >> 1) + 2, bottom, Math.max(4, Math.round(cw * 0.42)), Math.max(2, Math.min(5, Math.round(cw * 0.12))), g.fillStyle);
        }
        const glints = [];
        for (const e of vis) {
            if (e.custom) { e.custom(g, cx, cy); continue; }
            if (e.person) {
                const P = e.person, fr = (e.me ? p.sheet : P.sheet).frames[P.dir][P.frame || 0];
                A.ell(Math.round(e.x - cx + 1), Math.round(e.y - cy), 7, 2, 'rgba(64,40,24,0.28)');
                g.drawImage(fr, Math.round(e.x - 16 - cx), Math.round(e.y - 30 - cy));
            } else {
                const sp = e.spr, c = sp.frames ? sp.frames[Math.floor(this.time * sp.fps) % sp.frames.length] : sp.c;
                g.drawImage(c, Math.round(e.x + sp.ox - cx), Math.round(e.y + sp.oy - cy));
                if (sp.sparkle) glints.push(e);              // (drawn after the light of the hour, so they show at night too)
            }
        }
        // the light of the hour, and lamps once it's dark
        const LT = m.outdoor ? L : m.dark ? { c: [58, 54, 72], dark: 0.9 } : null;           // outdoors the hour; underground, the dark
        if (LT && (LT.c[0] < 250 || LT.c[1] < 250)) {
            const tg = this.tintG, TA = pa(tg), L = LT;
            tg.globalCompositeOperation = 'source-over'; tg.fillStyle = 'rgb(' + L.c.join(',') + ')'; tg.fillRect(0, 0, VW, VH);
            if (L.dark > 0.08) {
                tg.globalCompositeOperation = 'lighter';
                for (const e of m.ents) {
                    const li = e.light; if (!li || e.gone || (e.nightOnly && !night)) continue;
                    const x = Math.round((e.person || !e.w ? e.x : e.x + e.w / 2) + li.x - cx), y = Math.round((e.person || !e.w ? e.y : e.y + e.d) + li.y - cy);
                    const lr = li.far || li.r; if (x < -lr || x > VW + lr || y < -lr || y > VH + lr) continue;
                    const fl = li.flicker ? 1 + Math.sin(this.time * 11 + e.x) * 0.06 : 1, [r, gg, b] = hex(li.c), a = L.dark;
                    if (li.far) [[1, 0.06], [0.72, 0.08]].forEach(([k, al]) => TA.ell(x, y, Math.round(li.far * k * fl), Math.round(li.far * k * fl * 0.8), 'rgba(' + r + ',' + gg + ',' + b + ',' + (al * a).toFixed(3) + ')'));
                    [[1, 0.16], [0.7, 0.2], [0.42, 0.26], [0.2, 0.3]].forEach(([k, al]) => TA.ell(x, y, Math.round(li.r * k * fl), Math.round(li.r * k * fl * 0.8), 'rgba(' + r + ',' + gg + ',' + b + ',' + (al * a).toFixed(3) + ')'));
                }
                // buildings people live and work in: a low amber glow round the foot of the walls (not a lamp's
                // round pool: wide and flat, the light of rooms), and a fan of light on the ground from each door
                const glowed = new Set();
                for (const d of m.doors) {
                    const b = d.b; if (!b || b.gone || !b.spr) continue;
                    const sp = b.spr, bw = sp.c.width, bx = Math.round(b.x + sp.ox - cx), by = Math.round(b.y + sp.oy + sp.c.height - cy), a = L.dark;
                    if (bx > VW + 80 || bx + bw < -80 || by < -60 || by - sp.c.height > VH + 60) continue;
                    if (!glowed.has(b)) { glowed.add(b); const mx = bx + (bw >> 1); [[1, 0.06], [0.82, 0.07], [0.62, 0.08]].forEach(([k, al]) => TA.ell(mx, by - 8, Math.round((bw / 2 + 26) * k), Math.round(34 * k), 'rgba(255,150,80,' + (al * a).toFixed(3) + ')')); }
                    const dx = Math.round(d.x + d.w / 2 - cx), dy = Math.round(d.y + d.h - cy);
                    [[1, 0.1], [0.66, 0.13], [0.36, 0.16]].forEach(([k, al]) => TA.poly([[dx - 9, dy - 5], [dx + 9, dy - 5], [dx + 9 + Math.round(20 * k), dy - 3 + Math.round(30 * k)], [dx - 9 - Math.round(20 * k), dy - 3 + Math.round(30 * k)]], 'rgba(255,214,150,' + (al * a).toFixed(3) + ')'));
                }
                if (m.dark) { const x = Math.round(p.x - cx), y = Math.round(p.y - 14 - cy); [[1, 0.18], [0.66, 0.24], [0.36, 0.3]].forEach(([k, al]) => TA.ell(x, y, Math.round(90 * k), Math.round(72 * k), 'rgba(255,220,160,' + al + ')')); }   // your torch
            }
            g.globalCompositeOperation = 'multiply'; g.drawImage(this.tintC, 0, 0); g.globalCompositeOperation = 'source-over';
        }
        // glints on small finds: a quick cross, or (sparkle.big) a star that swells and fades, with a halo
        for (const e of glints) {
            const sp = e.spr, S = sp.sparkle, sx = Math.round(e.x + sp.ox + sp.c.width * (S.x || 0.55) - cx), sy = Math.round(e.y + sp.oy + sp.c.height * (S.y || 0.35) - cy);
            if (!S.big) { if ((this.time * 1.4 + e.x * 0.37) % 2.2 < 0.35) { A.r(sx - 2, sy, 5, 1, '#ffffff'); A.r(sx, sy - 2, 1, 5, '#ffffff'); } continue; }
            const ph = (this.time + e.x * 0.13) % 1.6, k = ph < 0.6 ? Math.sin(ph / 0.6 * Math.PI) : 0;
            if (k <= 0) { if ((this.time * 3 + e.y) % 1 < 0.5) A.px(sx, sy, '#fff8d0'); continue; }       // (between flashes: a pinprick of light)
            const L = Math.round(2 + k * 6), D = Math.round(1 + k * 2);
            A.ell(sx, sy, Math.round(3 + k * 4), Math.round(3 + k * 4), 'rgba(255,236,150,' + (0.3 * k).toFixed(2) + ')');
            A.r(sx - L, sy, L * 2 + 1, 1, '#fff4c0'); A.r(sx, sy - L, 1, L * 2 + 1, '#fff4c0');
            A.r(sx - L + 2, sy, L * 2 - 3, 1, '#ffffff'); A.r(sx, sy - L + 2, 1, L * 2 - 3, '#ffffff');
            for (let i = 1; i <= D; i++) for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) A.px(sx + a * i, sy + b * i, '#fff8d8');
            A.r(sx - 1, sy - 1, 3, 3, '#ffffff');
        }
        if (m.outdoor && area().giza) Detector.drawWorld(g, cx, cy);
        if (m.outdoor && area().overlay) area().overlay(g, cx, cy);        // (the story's own marks on the world: poke/ch1b_tail.js's view cones)
        // name tag over what you're facing, and the door you're near
        if (!Dlg.active && this.set.names) {
            const t = this.target;
            if (t && t.label) this.tag(g, t.label, (t.person || !t.w ? t.x : t.x + t.w / 2) - cx, (t.person ? t.y - 34 : t.spr ? t.y + t.spr.oy - 4 : t.y - 8) - cy);
            if (m.outdoor) for (const d of m.doors) if (Math.abs(p.x - (d.x + d.w / 2)) < 40 && p.y > d.y && p.y < d.y + d.h + 34) this.tag(g, '▲ ' + d.label, d.x + d.w / 2 - cx, d.y - 22 - cy);
        }
        Banner.draw(g);
        Toast.draw(g, 1 / 60);
        Notice.draw(g, 1 / 60);
        if (area().giza) Detector.drawHud(g);
        Hud.draw(g);                                       // water, food, and the compass to the tracked task
        if (this.hintT < 14 && !Dlg.active) Txt.draw(g, 'MOVE: WASD / arrows    RUN: Shift    LOOK / TALK: Space    MAP: M    MENU: Esc', VW >> 1, VH - 14, { col: '#ffffff', shadow: '#30302c', align: 'center' });
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
        const MAPK = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', Shift: 'run', ' ': 'act', z: 'act', Enter: 'act' };   // (act: SPACE held, for the minigames)
        window.addEventListener('keydown', e => {
            Sfx.ctx();
            if (this.state === 'intro' && !Dlg.active && Intro.key(e)) { e.preventDefault(); return; }
            const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, held = MAPK[k];
            if (held) { if (!this.keys[held] || e.repeat) { if (held !== 'run' && (!e.repeat || Menu.open || this.state !== 'play')) this.I[held] = true; } this.keys[held] = true; e.preventDefault(); }
            if (e.repeat) return;
            if (k === ' ' || k === 'Enter' || k === 'z' || k === 'e') { this.I.ok = true; e.preventDefault(); }
            if (k === 'Enter') this.I.enter = true;
            if (k === 'Escape' || k === 'x' || k === 'Backspace') this.I.back = true;
            if (k === 'Escape' || k === 'Tab') { this.I.menu = true; e.preventDefault(); }
            if (k === 'm') this.I.map = true;
            if (k === 'q') this.I.tool = true;
            if (k === 'p') this.I.phone = true;
            if (k === 'c') this.I.cam = true;
            if (k === 't') this.I.track = true;
        });
        window.addEventListener('keyup', e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (MAPK[k]) this.keys[MAPK[k]] = false; });
        window.addEventListener('blur', () => { this.keys = {}; });

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
