// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE WORLD (poke/world.js)
// Builds the outdoor map from the camp layout (poke/camp.js): every thing
// becomes an entity with a sprite and what it says (from poke/map_ch1.js,
// by id), the plateau and water become solid, trees and desert plants are
// placed, and doors lead to the interiors (poke/interiors.js).
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
    // turn the solid rectangles belonging to `owner` off or back on (a gate that opens)
    setSolid(map, owner, on) {
        for (const k in map.grid) for (const s of map.grid[k]) if (s.owner === owner) s.off = !on;
    },
    removeEnt(map, e) {
        e.gone = true;
        for (const k in map.grid) for (const s of map.grid[k]) if (s.owner === e) s.off = true;
    },

    // ============================================================
    // THE CAMP (the hand-laid tile map in camp.js)
    // ============================================================
    buildCamp(L, M) {
        const map = { key: 'ch1', outdoor: true, camp: L, pw: L.W * TILE, ph: L.H * TILE, ents: [], grid: {}, doors: [], places: [], people: [], buried: [] };
        const byId = {}; for (const o of M.objects) byId[o.id] = o;
        // solid ground: rows of plateau and water, merged into runs
        for (let y = 0; y < L.H; y++) for (let x = 0; x < L.W;) {
            if (!SOLID_TILE[L.get(x, y)]) { x++; continue; }
            let x1 = x; while (x1 < L.W && SOLID_TILE[L.get(x1, y)]) x1++;
            const wt = L.get(x, y), off = wt === T.WATER || wt === T.SEA || wt === T.REEF ? 6 : 0; World.addSolid(map, x * TILE, y * TILE + off, (x1 - x) * TILE, TILE - off);
            x = x1;
        }
        const occ = new Set(), mark = (tx, ty, tw, th) => { for (let j = ty - 1; j <= ty + th; j++) for (let i = tx - 1; i <= tx + tw; i++) occ.add(i + ',' + j); };
        const DRAW_AS = { fl_ministry_post: 'ministry post', fl_digshed: 'dig shed clipboard', fl_toolshed: "sam's tool shed", fl_guard_booth: 'guard booth', d_gearstor: 'gear storage', fl_trailer: 'site trailer', fl_scaffold: 'scaffolding', fl_palm: "sam's date palm", fl_cactus: 'palm tree', fl_boulder: 'big boulder', fl_ruins: null, fl_stake_sam: 'survey stake' };
        const NO_SPRITE = { trench: 1, ow_oasis: 1, fl_cooking: 1, fl_crates: 1, perimeter: 1, fl_sand_east: 1, fl_stars: 1, fl_ruins: 1 };
        const OPEN = { dig_gate: 1, c1p_pavement: 1, d_gearstor: 1, c1p_cemetery: 1, ow_ruins: 1, c1p_ramp: 1 };
        const NIGHT_ONLY = { c1p_oldwoman: 1 }, HIDDEN = { c1a_lena: 1, c1a_lenaman1: 1, c1a_lenaman2: 1 };
        const PICKUP = /^(painted sherd|fossil)$/;
        const place = (id, tx, ty, tw, th) => {
            const o = byId[id];
            if (!o) { console.warn('camp: no object', id); return; }
            const hidden = !!HIDDEN[id];              // placed, but not there until the story brings them (e.gone)
            const x = tx * TILE, y = ty * TILE, w = tw * TILE, d = th * TILE;
            if (/^ow_cache\d/.test(id)) { map.buried.push({ id, x: x + w / 2, y: y + d / 2, say: o.say }); return; }   // under the sand: only the detector finds these (detector.js)
            const e = { x, y, w, d, id, label: o.label, say: o.say };
            if (id === 'dig_gate') { e.label = 'Dig Zone Gate'; e.say = ['System', 'The dig zone gate: chain-link, Miriam\'s handwriting on a laminated sign — ACTIVE EXCAVATION, AUTHORISED STAFF ONLY.\n\nIt stands open. The Rais has unlocked it for you.']; }
            if (CAST[id]) {
                const cx = x + w / 2, cy = y + d - 4;
                Object.assign(e, { x: cx, y: cy, w: 0, d: 0, person: { sheet: personSheet(LOOKS[CAST[id]]), dir: 0, frame: 0 }, sortY: cy, nightOnly: !!NIGHT_ONLY[id] });
                if (id === 'c1p_oldwoman') e.light = { x: 6, y: -14, r: 60, c: '#ffd080' };
                if (o.wander) e.wander = { home: [cx, cy], r: o.wander, t: 1 + (tx % 3) };            // (children at play: they drift about)
                if (o.dir != null) e.person.dir = o.dir;
                if (hidden) { e.gone = true; e.lenaEvent = true; }
                World.addEnt(map, e); map.people.push(e); return;
            }
            let spr = null;
            if (!NO_SPRITE[id]) {
                const as = DRAW_AS[id], drawer = as !== undefined ? (as && SPR_L[as]) : (SPR[id] || SPR_L[o.model] || SPR_L[(o.label || '').toLowerCase()]);
                if (drawer) spr = drawer(w, d, o);
            }
            if (spr && spr.anchor) { e.x = x + w / 2; e.y = y + d - 4; e.w = 0; e.d = 0; e.sortY = e.y; }
            e.spr = spr;
            if (spr && PICKUP.test(o.model)) e.pickup = o.model === 'fossil' ? 'Fossil' : 'Painted sherd';
            if (!spr && !e.say) return;
            World.addEnt(map, e);
            if (spr && !spr.flat && !spr.solid && !OPEN[id] && tw * th >= 2 && !spr.anchor) World.addSolid(map, x + 2, y + 2, w - 4, d - 4, e);   // buildings are solid all through
            if (spr && !spr.flat) mark(tx, ty, tw, th);
        };
        for (const [id, tx, ty, tw, th] of L.things) place(id, tx, ty, tw, th);
        for (const pre in L.scatter) L.scatter[pre].forEach(([tx, ty], i) => place(pre + i, tx, ty, 1, 1));
        // lamps stand exactly where camp.js puts them, evenly spaced on the kerbs
        L.lamps.forEach(([tx, ty], i) => place('ow_pathlamp' + i, tx, ty, 1, 1));
        // the chain-link fence round the dig zone, and planks across the trench
        for (const [x0, x1, ty] of L.fences) { const w = (x1 - x0) * TILE; World.addEnt(map, { x: x0 * TILE, y: ty * TILE + 12, w, d: 4, spr: fenceH(w, 'northFence'), sortY: ty * TILE + 16 }); World.addSolid(map, x0 * TILE, ty * TILE + 10, w, 8); }
        // runs of fence north to south: [tile x (the fence stands on its west edge), from y, to y]; a piece a tile long each, so they sort with you
        for (const [tx, y0, y1] of L.fencesV || []) {
            const x = tx * TILE - 2;
            for (let ty = y0; ty < y1; ty++) World.addEnt(map, { x, y: ty * TILE, w: 4, d: TILE, spr: Object.assign(fenceV(TILE, 'chain'), { ox: -3, oy: -21 }), sortY: (ty + 1) * TILE });
            World.addSolid(map, x - 2, y0 * TILE, 8, (y1 - y0) * TILE + 14);
        }
        for (const [x0, x1, ty] of L.planks) {
            const w = (x1 - x0 + 1) * TILE, st = stage(w, 18, 0), A = st.A;
            A.r(st.x, st.y, w, 18, '#c89a5c'); for (let i = 0; i < w; i += 9) { A.vl(st.x + i, st.y, 18, '#9a6c3c'); A.vl(st.x + i + 1, st.y, 18, '#e0b478'); }
            A.hl(st.x, st.y, w, '#f0cc90'); A.r(st.x, st.y + 16, w, 2, '#7a5430');
            World.addEnt(map, { x: x0 * TILE, y: ty * TILE + 7, w, d: 18, spr: Object.assign(fit(st), { flat: true }) });
        }
        // doors on the front of the three buildings you can enter
        for (let [id, frac, to, name, dy] of L.doors) {
            const e = map.ents.find(q => q.id === id); if (!e) continue;
            const label = name || byId[id === 'tent_bldg' ? 'tent_door' : id === 'dorm_bldg' ? 'dorm_door' : 'foreman_door'].label.replace(/^Enter /, '');
            if (frac === 'spr') frac = e.spr && e.spr.doorFrac != null ? e.spr.doorFrac : 0.5;   // (the sprite knows where it drew its door)
            map.doors.push({ x: e.x + e.w * frac - 16, y: e.y + (dy != null ? dy : e.d - 8), w: 32, h: 14, to, label, b: e });   // (b: the building, which glows at night)
            if (name) e.noLook = true;                 // (what it said from outside, you read going in: ch1_rooms.js)
        }
        for (const [bx, by, bw, bh] of L.blocks || []) World.addSolid(map, bx * TILE, by * TILE, bw * TILE, bh * TILE);   // (walls of trees: no gaps between the trunks)
        // trees
        L.trees.forEach(([tx, ty], i) => { const x = tx * TILE + 16, y = ty * TILE + 28; World.addEnt(map, { x, y, w: 0, d: 0, spr: palm('cp' + i), sortY: y }); World.addSolid(map, x - 4, y - 4, 8, 5); mark(tx, ty, 1, 1); });
        // the camel, couched beside the Bedouin tent
        const sh = map.ents.find(q => q.id === 'ow_shelter');
        if (sh) World.addEnt(map, { x: sh.x + sh.w + 24, y: sh.y + sh.d, w: 0, d: 0, spr: camel(), label: 'Camel', say: ['System', 'A camel, lying down with its legs folded under it, chewing slowly and sideways. It watches you go past with half-closed eyes, completely unimpressed.'] });
        // plants and stones on the open sand
        const memo = {}, variant = (kind, n, make) => { const key = kind + (n % 7); return Object.assign({}, memo[key] || (memo[key] = make(key))); };
        for (let ty = 1; ty < L.H - 1; ty++) for (let tx = 1; tx < L.W - 1; tx++) {
            if (L.get(tx, ty) !== T.SAND || occ.has(tx + ',' + ty)) continue;
            const r = hash2(tx * 7 + 3, ty * 13 + 5), k = ty * L.W + tx;
            const nearWater = L.lush ? L.lush(tx, ty) : Math.hypot(tx - 8, ty - 15) < 7;   // (green plants by water; the rest dry)
            let spr = null;
            if (nearWater && r < 0.4) spr = variant('g', k, q => shrub(q, false));
            else if (r < 0.05) spr = r > 0.02 ? variant('d', k, q => shrub(q, true)) : variant('g', k, q => shrub(q, false));
            else if (r > 0.985) { const rr = 4 + Math.round(hash2(tx, ty) * 5); spr = variant('r' + rr, k, q => rocks(0, 0, q, 1, rr)); }
            if (!spr) continue;
            const x = tx * TILE + 8 + hash2(tx, ty + 99) * 16, y = ty * TILE + 12 + hash2(tx + 77, ty) * 16;
            if (spr.solid) { spr.ox = -spr.c.width / 2; spr.oy = -spr.c.height + 1; spr.solid = null; }
            World.addEnt(map, { x, y, w: 0, d: 0, spr, sortY: y });
        }
        // three workmen by the fire
        const bz = map.ents.find(q => q.id === 'rest_brazier');
        if (bz) [['worker1', -40, 10], ['worker2', 36, 22], ['worker3', -6, 44]].forEach(([look, dx, dy], i) => {
            const cx = bz.x + bz.w / 2 + dx, cy = bz.y + bz.d / 2 + dy;
            const lines = ['"The new doctor." He looks you up and down, and makes room by the fire.', '"Eleven days. My wife asks me every night: where is the money? I tell her: ask the Swede."', '"Doctor Miriam knew every man\'s name. Every one. You will learn them?"'];
            const e = World.addEnt(map, { x: cx, y: cy, w: 0, d: 0, label: 'Workman', say: ['Workman', lines[i]], person: { sheet: personSheet(LOOKS[look]), dir: i === 2 ? 3 : i ? 1 : 2, frame: 0 }, sortY: cy, wander: { home: [cx, cy], r: 36, t: 2 + i * 1.7 } });
            map.people.push(e);
        });
        map.places = L.places.map(([id, name, tx, ty, r]) => ({ id, name, x: tx * TILE + 16, y: ty * TILE + 16, r: r * TILE }));
        map.spawn = [L.spawn[0] * TILE + 16, L.spawn[1] * TILE + 16];
        map.ents.forEach(e => { if (e.spr && e.spr.light) e.light = e.spr.light; });
        return map;
    },

};
