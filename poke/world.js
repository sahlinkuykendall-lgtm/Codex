// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE WORLD (poke/world.js)
// Builds the outdoor map from the exported 3D layout (poke/map_ch1.js):
// every object becomes an entity with a sprite, the collision walls
// become solids (and fences, rock walls and trees where that's what they
// are), desert plants are scattered, and doors lead to the interiors
// (poke/interiors.js).
//
// An entity: { x, y, w, d }  its footprint in pixels (x,y = top-left)
//            spr              from a drawer in sprites.js
//            sortY            draw order (its foot line)
//            id, label, say   what it is and what it says when examined
//            person           { sheet, dir, frame }   for characters
// ============================================================

const World = {
    maps: {},
    cur: null,

    // ---- collision: a coarse grid of solid rectangles ----
    addSolid(map, x, y, w, h, owner) {
        if (w <= 0 || h <= 0) return;
        const s = { x, y, w, h, owner: owner || null }, G = map.grid, C = 64;
        for (let j = Math.floor(y / C); j <= Math.floor((y + h) / C); j++) for (let i = Math.floor(x / C); i <= Math.floor((x + w) / C); i++) {
            const k = i + ',' + j; (G[k] || (G[k] = [])).push(s);
        }
    },
    // is the box (x, y, w, h) inside anything solid?
    blocked(map, x, y, w, h) {
        if (x < 0 || y < 0 || x + w > map.pw || y + h > map.ph) return true;
        const G = map.grid, C = 64;
        for (let j = Math.floor(y / C); j <= Math.floor((y + h) / C); j++) for (let i = Math.floor(x / C); i <= Math.floor((x + w) / C); i++) {
            const L = G[i + ',' + j];
            if (!L) continue;
            for (const s of L) if (!s.off && x < s.x + s.w && x + w > s.x && y < s.y + s.h && y + h > s.y) return true;
        }
        return false;
    },
    addEnt(map, e) {
        if (e.spr && e.sortY == null) e.sortY = e.spr.flat ? -1e9 + e.y : e.y + e.d;
        map.ents.push(e);
        const sp = e.spr;
        if (sp && sp.solid) { const [sx, sy, sw, sh] = sp.solid; e.solidRef = map.ents.length; World.addSolid(map, e.x + sx, e.y + sy, sw, sh, e); }
        return e;
    },
    removeEnt(map, e) {
        e.gone = true;
        for (const k in map.grid) for (const s of map.grid[k]) if (s.owner === e) s.off = true;
    },

    // ============================================================
    // THE OUTDOOR MAP
    // ============================================================
    buildOutdoor(M) {
        const S = TILE / M.TILE_U, px = v => Math.round(v * S);
        const map = { key: 'ch1', outdoor: true, pw: Math.ceil(M.W * S), ph: Math.ceil(M.H * S), ents: [], grid: {}, doors: [], places: [], people: [] };
        const G = M.grid;
        const tileAt = (s, x, y) => { const i = Math.floor(x / TILE), j = Math.floor(y / TILE); return (i < 0 || j < 0 || i >= M.gw || j >= M.gh) ? '1' : s[j * M.gw + i]; };
        const byId = {}; for (const o of M.objects) byId[o.id] = o;
        const occupied = [];                                   // footprints, so plants don't grow through things
        const occ = (x, y, w, h) => occupied.push([x - 10, y - 10, w + 20, h + 20]);
        const isOcc = (x, y) => occupied.some(r => x > r[0] && y > r[1] && x < r[0] + r[2] && y < r[1] + r[3]);

        // ---- walls: solids, and fences / rock where that's what they are ----
        // The three buildings you can enter are drawn shallower than their 3D footprints
        // (SHELL_DEPTH of it, kept at the front): a DS building is mostly front wall and
        // roof, and the ground behind it is free to walk. Their own wall list is replaced.
        const SHELL_DEPTH = 0.68;
        const shells = ['dorm_bldg', 'foreman_bldg', 'tent_bldg'].map(id => byId[id]).filter(Boolean);
        const within = (w, o, m) => w.x >= o.x - m && w.y >= o.y - m && w.x + w.w <= o.x + o.w + m && w.y + w.h <= o.y + o.h + 40;
        const inShell = (w) => shells.some(o => within(w, o, 8));
        const table = byId.d_cooking;
        const objRects = M.objects.filter(o => !o.deco || o.w < 300).map(o => o);
        const underObject = (w) => objRects.some(o => w.x < o.x + o.w && w.x + w.w > o.x && w.y < o.y + o.h && w.y + w.h > o.y);
        const trees = [];
        for (const w of M.walls) {
            const x = px(w.x), y = px(w.y), ww = Math.max(2, px(w.w)), hh = Math.max(2, px(w.h));
            if (w.k === 'trenchPlank') {                         // planks across the trench: you walk over them
                const st = stage(ww, hh, 0), A = st.A; A.r(st.x, st.y, ww, hh, PAL.plank[0]); for (let i = 0; i < ww; i += 10) A.vl(st.x + i, st.y, hh, PAL.plank[2]); A.r(st.x, st.y + hh - 2, ww, 2, PAL.plank[2]);
                World.addEnt(map, { x, y, w: ww, d: hh, spr: Object.assign(fit(st), { flat: true }) });
                continue;
            }
            if (w.k === 'trunk') { trees.push([x + ww / 2, y + hh / 2]); continue; }
            if (inShell(w) || w.k === 'gate' || (w.k === 'northFence' && w.h > 40)) continue;   // (the fence is listed twice; the gate stands open)
            if (w.k !== 'pond') World.addSolid(map, x, y, ww, hh);
            else World.addSolid(map, x + 6, y + 6, ww - 12, hh - 12);
            if (w.k === 'northFence' || w.k === 'chain' || w.k === 'rope' || (w.k === 'rail' && !(table && within(w, table, 8)))) {
                const spr = w.w >= w.h ? fenceH(ww, w.k) : fenceV(hh, w.k);
                World.addEnt(map, { x, y, w: ww, d: hh, spr, sortY: y + hh });
            } else if (w.k === 'outcrop' || w.k === 'ridge' || w.k === 'cutting') {
                World.addEnt(map, { x, y, w: ww, d: hh, spr: rockBlock(ww, hh, 'rb' + w.x + w.y) }); occ(x, y, ww, hh);
            } else if (w.k === 'yardang' && !underObject(w)) {
                World.addEnt(map, { x, y, w: ww, d: hh, spr: rockBlock(ww, hh, 'yd' + w.x + w.y) }); occ(x, y, ww, hh);
            } else if (w.k === 'ministryHut') {
                World.addEnt(map, { x, y, w: ww, d: hh, spr: SPR_L['ministry post'](ww, hh) }); occ(x, y, ww, hh);
            } else if (w.k === 'digshed') {
                World.addEnt(map, { x, y, w: ww, d: hh, spr: SPR_L['dig shed clipboard'](ww, hh) }); occ(x, y, ww, hh);
            }
        }

        // ---- objects ----
        const SKIP_SPR = { fl_ministry_post: 1, fl_digshed: 1, perimeter: 1 };
        const NIGHT_ONLY = { c1p_oldwoman: 1 }, HIDDEN = { c1a_lena: 1, c1a_lenaman1: 1, c1a_lenaman2: 1 };
        const DOORS = { tent_door: 'INT_TENT', dorm_door: 'INT_DORM', foreman_door: 'INT_FOREMAN' };
        const PICKUP = /^(painted sherd|fossil)$/;
        for (const o of M.objects) {
            if (HIDDEN[o.id]) continue;
            const x = px(o.x), y = px(o.y), w = Math.max(4, px(o.w)), d = Math.max(4, px(o.h));
            if (DOORS[o.id]) {
                map.doors.push({ x, y: y - 6, w, h: d + 6, to: DOORS[o.id], label: o.label.replace(/^Enter /, '') });
                continue;
            }
            const e = { x, y, w, d, id: o.id, label: o.label, say: o.say, scene: o.scene };
            if (shells.includes(o)) { const cutD = Math.round(d * SHELL_DEPTH); e.y = y + d - cutD; e.d = cutD; }
            if (o.id === 'dig_gate') { e.label = 'Dig Zone Gate'; e.say = ['System', 'The dig zone gate: chain-link, Miriam\'s handwriting on a laminated sign — ACTIVE EXCAVATION, AUTHORISED STAFF ONLY.\n\nIt stands open. The Rais has unlocked it for you.']; }
            if (CAST[o.id]) {
                const cx = x + w / 2, cy = y + d / 2 + 6;
                Object.assign(e, { x: cx, y: cy, w: 0, d: 0, person: { sheet: personSheet(LOOKS[CAST[o.id]]), dir: 0, frame: 0 }, sortY: cy, nightOnly: !!NIGHT_ONLY[o.id] });
                World.addEnt(map, e);
                map.people.push(e);                              // people block the way themselves (they can move)
                if (o.id === 'c1p_oldwoman') e.light = { x: 6, y: -14, r: 60, c: '#ffd080' };
                continue;
            }
            const drawer = SKIP_SPR[o.id] ? null : (SPR[o.id] || SPR_L[o.model] || SPR_L[(o.label || '').toLowerCase()]);
            let spr = null;
            if (drawer) spr = drawer(e.w, e.d, o);
            if (spr && spr.anchor) { e.x = x + w / 2; e.y = y + d / 2; e.w = 0; e.d = 0; e.sortY = e.y; }
            e.spr = spr;
            if (spr && PICKUP.test(o.model)) e.pickup = o.model === 'fossil' ? 'Fossil' : 'Painted sherd';
            if (!spr && !o.say) continue;                       // a zone with nothing to see or say
            World.addEnt(map, e);
            if (spr && !spr.flat) occ(x, y, w, d);
        }
        // the three buildings you can enter are solid all the way through
        for (const o of shells) { const d = px(o.h), cutD = Math.round(d * SHELL_DEPTH); World.addSolid(map, px(o.x), px(o.y) + d - cutD, px(o.w), cutD - 2); }

        // ---- trees on the 3D map's trunks: palms by the water, acacias out in the open ----
        const oasis = M.places.find(p => p.id === 'oasis');
        trees.forEach(([tx, ty], i) => {
            const nearWater = oasis && Math.hypot(tx - oasis.at[0] * S, ty - oasis.at[1] * S) < 520;
            const spr = (nearWater || hash2(tx | 0, ty | 0) < 0.7) ? palm('p' + i) : acacia('a' + i);
            World.addEnt(map, { x: tx, y: ty + 2, w: 0, d: 0, spr, sortY: ty + 2 });
            occupied.push([tx - 12, ty - 8, 24, 16]);
        });
        // the camel, couched beside the Bedouin tent
        const sh = byId.ow_shelter;
        if (sh) World.addEnt(map, { x: px(sh.x + sh.w) + 26, y: px(sh.y + sh.h * 0.8), w: 0, d: 0, spr: camel(), label: 'Camel', say: ['System', 'A camel, couched, chewing sideways with great patience. It looks at you as if you owe it money.'] });

        // ---- desert plants and stones, scattered on open sand ----
        // (a handful of drawn variants, shared: thousands of plants, a few canvases)
        const memo = {}, variant = (kind, n, make) => { const key = kind + (n % 7); return Object.assign({}, memo[key] || (memo[key] = make(key))); };
        for (let j = 1; j < M.gh - 1; j++) for (let i = 1; i < M.gw - 1; i++) {
            const k = j * M.gw + i;
            if (G.out[k] === '1' || G.path[k] !== '0' || G.rock[k] === '1' || G.dip[k] === '1') continue;
            const r = hash2(i * 7 + 3, j * 13 + 5);
            const x = i * TILE + 4 + hash2(i, j + 99) * 24, y = j * TILE + 8 + hash2(i + 77, j) * 22;
            const nearWater = oasis && Math.hypot(x - oasis.at[0] * S, y - oasis.at[1] * S) < 460;
            const wadi = G.wadi[k] === '1';
            let spr = null;
            if (nearWater && r < 0.34) spr = variant('g', k, s => shrub(s, false));
            else if (wadi && r < 0.22) spr = r < 0.1 ? variant('wr' + Math.round(r * 40), k, s => rocks(0, 0, s, 1, 5 + Math.round(r * 40))) : variant('d', k, s => shrub(s, true));
            else if (r < 0.035) spr = r > 0.012 ? variant('d', k, s => shrub(s, true)) : variant('g', k, s => shrub(s, false));
            else if (r > 0.988) { const rr = 4 + Math.round(hash2(i, j) * 5); spr = variant('r' + rr, k, s => rocks(0, 0, s, 1, rr)); }
            if (!spr || isOcc(x, y)) continue;
            if (spr.solid) { spr.ox = -spr.c.width / 2; spr.oy = -spr.c.height + 1; spr.solid = spr.c.width > 16 ? [-spr.c.width / 2 + 2, -5, spr.c.width - 4, 5] : null; }
            World.addEnt(map, { x, y, w: 0, d: 0, spr, sortY: y });
        }

        // ---- people who are just there: three workmen by the fire ----
        const bz = byId.rest_brazier;
        if (bz) [['worker1', -46, 10], ['worker2', 40, 26], ['worker3', -8, 52]].forEach(([look, dx, dy], i) => {
            const cx = px(bz.x + bz.w / 2) + dx, cy = px(bz.y + bz.h / 2) + dy;
            const lines = ['"The new doctor." He looks you up and down, and makes room by the fire.', '"Eleven days. My wife asks me every night: where is the money? I tell her: ask the Swede."', '"Doctor Miriam knew every man\'s name. Every one. You will learn them?"'];
            const e = World.addEnt(map, { x: cx, y: cy, w: 0, d: 0, label: 'Workman', say: ['Workman', lines[i]], person: { sheet: personSheet(LOOKS[look]), dir: i === 2 ? 3 : i ? 1 : 2, frame: 0 }, sortY: cy, wander: { home: [cx, cy], r: 40, t: 2 + i * 1.7 } });
            map.people.push(e);
        });

        map.places = M.places.map(p => ({ id: p.id, name: p.name, x: p.at[0] * S, y: p.at[1] * S, r: p.r * S }));
        map.spawn = [px(M.spawn[0]), px(M.spawn[1])];
        map.ents.forEach(e => { if (e.spr && e.spr.light) e.light = e.spr.light; });
        return map;
    },
};
