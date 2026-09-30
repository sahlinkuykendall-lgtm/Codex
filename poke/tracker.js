// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE TASK TRACKER AND THE HUD (poke/tracker.js)
// One task is tracked at a time: the newest, until you pick another (SPACE
// on it in TASKS). A compass in the corner points to it; T flashes a big
// arrow over your head for three seconds. Beside the compass: your water
// and food.
//   TASK_TARGETS[id]() → an entity id (or a list: the nearest one left), or
//   { room, id, out }: someone inside a room (`out` is the building outside)
// ============================================================

const TASK_TARGETS = {
    // Chapter 1-A, Giza
    tent: () => 'tent_bldg', payroll: () => 'tariq_talk', wages: () => 'c1a_lindqvist', farouk: () => 'c1a_farouk', mina: () => 'c1a_sayed',
    trenches: () => sflag('trenchA') ? (sflag('trenchB_known') ? 'fl_stake_sam' : 'fl_digshed') : 'trench',
    midnight: () => 'tent_bldg', lena: () => 'tent_bldg', storekey: () => 'ow_sieve', seal: () => 'puzzle_glyph', store: () => 'fl_toolshed',
    hana_sherds: () => (Game.bag['Painted sherd'] || 0) >= 3 ? 'c1a_hana' : ['ow_sherd'], fossils: () => ['c1p_fossil'],
    saber: () => sflag('saber') === 'told' ? 'foreman_bldg' : sflag('saber') === 'pour' ? 'ow_tea' : 'c1a_saber',
    hamid: () => hasItem('Coupling pin') ? 'c1a_hamid' : 'fl_crates', relics: () => 'ow_wreck', photo: () => 'tariq_talk', bosta: () => 'camp_dog', detector: () => 'ow_detector',
    // Chapter 1-B, Saqqara
    c1b_tea: () => 'c1b_umsabry', c1b_accountant: () => 'c1b_umsabry', c1b_fathi: () => ({ room: 'INT_INSPECTORATE', id: 'c1b_fathi', out: 'c1b_office' }), c1b_round: () => 'c1b_serapeum',
};
const Tracker = {
    flashT: 0,
    get id() { const s = Story.s, T = s.tasks, cur = T.find(t => t.id === s.track && !t.done); if (cur) return cur.id; const next = T.find(t => !t.done); return next ? next.id : null; },
    set(id) { Story.s.track = id; Sfx.ok(); },
    // where the tracked task is, in the current map's coordinates (or the way out of the room you're in)
    target() {
        const id = this.id, f = id && TASK_TARGETS[id]; if (!f) return null;
        let spec = f(); if (!spec) return null;
        const m = Game.map, pos = e => ({ x: e.person || !e.w ? e.x : e.x + e.w / 2, y: e.person || !e.w ? e.y : e.y + e.d });
        if (spec.room) {
            if (m.key === spec.room) { const e = m.ents.find(q => q.id === spec.id); return e ? Object.assign(pos(e), { here: true }) : null; }
            spec = spec.out;
        }
        if (!m.outdoor) return { x: m.exit.x + m.exit.w / 2, y: m.exit.y + 20, exit: true };      // indoors: the way out first
        const list = Array.isArray(spec) ? spec : [spec], p = Game.player;
        let best = null, bd = 1e9;
        for (const e of m.ents) {
            if (!e.id || e.gone) continue;
            if (!list.some(k => e.id === k || (Array.isArray(spec) && e.id.startsWith(k)))) continue;
            const q = pos(e), dd = Math.hypot(q.x - p.x, q.y - p.y); if (dd < bd) { bd = dd; best = q; }
        }
        return best;
    },
    flash() { this.flashT = 3; Sfx.move(); if (!this.id) Toast.show('No task to track. (Esc → TASKS)'); else if (!this.target()) Toast.show('This one could be anywhere. Look around.'); },
};

const Hud = {
    // the corner: water and food, and the compass
    draw(g) {
        if (Dlg.active || Game.state !== 'play') return;
        const A = pa(g), VW = Game.VW, VH = Game.VH, n = needs(), w = 116, h = 46, x = VW - w - 6, y = VH - h - 6;
        A.r(x + 1, y, w - 2, h, PAL.line); A.r(x, y + 1, w, h - 2, PAL.line); A.r(x + 1, y + 1, w - 2, h - 2, '#f4ecd4'); A.r(x + 1, y + 1, w - 2, 2, '#fffaf0'); A.r(x + 1, y + h - 3, w - 2, 2, '#d8c8a0');
        const bar = (by, v, col, dark, icon) => {
            icon(x + 6, by); A.r(x + 16, by + 1, 50, 7, PAL.line); A.r(x + 17, by + 2, 48, 5, '#d8d0c0');
            const f = Math.round(48 * Math.max(0, Math.min(1, v / 100))); A.r(x + 17, by + 2, f, 5, v <= 20 && (Game.time * 3 | 0) % 2 ? '#f05030' : col); A.r(x + 17, by + 2, f, 1, '#ffffff'); A.r(x + 17, by + 6, f, 1, dark);
        };
        bar(y + 10, n.water, '#4a98dc', '#2a6cb0', (ix, iy) => { A.poly([[ix + 3, iy], [ix + 6, iy + 5], [ix + 3, iy + 8], [ix, iy + 5]], '#3a7cc4'); A.px(ix + 2, iy + 4, '#bfe4f8'); });   // a drop
        bar(y + 27, n.food, '#e0a030', '#b07818', (ix, iy) => { A.ell(ix + 3, iy + 4, 4, 3, '#c89058'); A.ell(ix + 2, iy + 3, 2, 1, '#f0c080'); });                                    // a loaf
        // the compass: a brass bezel lettered N E S W (north is always up the screen), the needle to the tracked task
        const cx = x + w - 23, cy = y + (h >> 1), R = 19, t = Tracker.target();
        A.ell(cx, cy, R + 1, R + 1, PAL.line); A.ell(cx, cy, R, R, '#c89020'); A.ell(cx - 1, cy - 1, R - 2, R - 2, '#e0b040'); A.ell(cx, cy, R - 6, R - 6, '#7a5a18'); A.ell(cx, cy, R - 7, R - 7, '#fff8e8');
        for (let k = 1; k < 8; k += 2) { const a = k / 8 * Math.PI * 2; A.px(Math.round(cx + Math.sin(a) * (R - 3)), Math.round(cy - Math.cos(a) * (R - 3)), '#7a5a18'); }
        const LET = { N: ['101', '111', '111', '111', '101'], E: ['111', '100', '110', '100', '111'], S: ['111', '100', '111', '001', '111'], W: ['101', '101', '111', '111', '101'] };
        const letter = (ch, lx, ly, col) => LET[ch].forEach((row, j) => { for (let i = 0; i < 3; i++) if (row[i] === '1') A.px(lx + i, ly + j, col); });
        letter('N', cx - 1, cy - R + 1, '#b82818'); letter('S', cx - 1, cy + R - 6, '#3a2a10'); letter('E', cx + R - 5, cy - 2, '#3a2a10'); letter('W', cx - R + 2, cy - 2, '#3a2a10');
        if (t) {
            const p = Game.player, dx = t.x - p.x, dy = t.y - p.y, a = Math.atan2(dx, -dy), d = Math.hypot(dx, dy);
            if (d < 40 && !t.exit) { A.ell(cx, cy, 4, 4, '#58a848'); A.ell(cx, cy, 2, 2, '#b8f0a0'); }             // you're there
            else {
                const tx = cx + Math.sin(a) * (R - 8), ty = cy - Math.cos(a) * (R - 8), bx = cx - Math.sin(a) * 6, by = cy + Math.cos(a) * 6, sx = Math.cos(a) * 3, sy = Math.sin(a) * 3;
                A.poly([[tx, ty], [cx + sx, cy + sy], [cx - sx, cy - sy]], '#d04838'); A.poly([[bx, by], [cx + sx, cy + sy], [cx - sx, cy - sy]], '#5a6272');
                A.ell(cx, cy, 1, 1, PAL.line);
            }
            // the heading in words, as a sailor would say it: N, NE, E …
            const head = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(((a / (Math.PI * 2)) * 8 + 8)) % 8];
            const lab = t.exit ? 'the door' : (d / TILE < 1.5 ? 'here' : head + '  ' + Math.round(d / TILE) + ' m');
            Txt.draw(g, lab, Math.min(cx, VW - 6 - (Txt.width(lab) >> 1)), y - 13, { col: '#ffffff', shadow: '#30302c', align: 'center' });
        } else { A.ell(cx, cy, 2, 2, '#9a8a60'); }
        // T: the big arrow over your head
        if (Tracker.flashT > 0 && t) {
            const [camx, camy] = Game.cam || [0, 0], p = Game.player, a = Math.atan2(t.x - p.x, t.y - p.y) , px = p.x - camx, py = p.y - 20 - camy, r = 30 + Math.sin(Game.time * 8) * 2;
            const ax = px + Math.sin(a) * r, ay = py + Math.cos(a) * r, lx = Math.cos(a) * 11, ly = -Math.sin(a) * 11, tx = px + Math.sin(a) * (r + 20), ty = py + Math.cos(a) * (r + 20);
            if ((Tracker.flashT * 4 | 0) % 2 || Tracker.flashT > 0.8) { A.poly([[tx + 1, ty + 1], [ax + lx + 1, ay + ly + 1], [ax - lx + 1, ay - ly + 1]], PAL.line); A.poly([[tx, ty], [ax + lx, ay + ly], [ax - lx, ay - ly]], '#ffd040'); A.poly([[tx, ty], [ax + lx * 0.4, ay + ly * 0.4], [ax - lx * 0.4, ay - ly * 0.4]], '#fff4b0'); }
        }
    },
};
