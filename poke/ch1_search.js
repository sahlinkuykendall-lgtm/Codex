// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE MIDNIGHT SEARCHERS (poke/ch1_search.js)
// While Lena and her two men go through Miriam's tent (lena_event 'searching')
// they carry torches, and the torches show as cones on the ground. Walk into
// one, or walk right up to one of them, and you've been seen: they turn on you
// and it's a confrontation. Reach the tent door without being seen and you
// get the quiet choices (listen, photograph, slip in the back).
//   Lena stands by the tent door, mostly facing in; every few seconds she
//   turns and looks out over the camp.
//   The two men walk up and down the tent's sides, stopping at each end to
//   look outwards. The equipment table in front of the tent is cover.
// ============================================================

const SEARCH_RANGE = 4.2 * TILE, SEARCH_HALF = 0.55;
const SEARCHERS = {
    c1a_lena: { home: [35.4, 27.5] },          // just along from the door, so you can reach it without walking into her
    c1a_lenaman1: { route: [[29.5, 24.2], [29.5, 26.7]], out: Math.PI * 0.72 },
    c1a_lenaman2: { route: [[37.6, 24.2], [37.6, 28.2]], out: Math.PI * 0.28 },
};
const Search = {
    st: {}, sus: 0, seeing: false, t: 0,
    on() { return Game.map === Game.maps.ch1 && sflag('lena_event') === 'searching' && area() === AREAS.archaeologist; },
    ents() { const m = Game.maps.ch1; return Object.keys(SEARCHERS).map(id => m.people.find(e => e.id === id)).filter(e => e && !e.gone); },
    reset() { this.st = {}; this.sus = 0; this.seeing = false; this.t = 0; },
    frame(dt) {
        if (!this.on()) { if (this.t) this.reset(); return; }
        if (Dlg.active || Game.state !== 'play') return;
        const p = Game.player;
        if (!sflag('lena_sneak_tip') && Math.hypot(p.x - 33.5 * TILE, p.y - 27 * TILE) < 11 * TILE) { this.tip(); return; }   // (the first time you come near: what to do)
        this.t += dt;
        let seen = false, close = false;
        for (const e of this.ents()) {
            const S = SEARCHERS[e.id], st = this.st[e.id] || (this.st[e.id] = { i: 0, dir: 1, pause: 0, face: Math.PI / 2, t: 0 });
            if (S.home) {
                // Lena: six seconds working through the tent, three looking out over the camp
                e.x = S.home[0] * TILE; e.y = S.home[1] * TILE;
                const k = this.t % 9;
                st.face = k < 6 ? -Math.PI / 2 : Math.PI / 2 + Math.sin((k - 6) * 2.1) * 1.3;
                e.person.frame = 0;
            } else {
                if (st.x == null) { st.x = S.route[0][0] * TILE; st.y = S.route[0][1] * TILE; }
                if (st.pause > 0) { st.pause -= dt; st.t += dt; st.face = S.out + Math.sin(st.t * 1.4) * 0.8; e.person.frame = 0; }
                else {
                    const j = st.i + st.dir, [tx, ty] = S.route[j], dx = tx * TILE - st.x, dy = ty * TILE - st.y, d = Math.hypot(dx, dy), v = 22 * dt;
                    if (d <= v) { st.x = tx * TILE; st.y = ty * TILE; st.i = j; if (j === 0 || j === S.route.length - 1) st.dir = -st.dir; st.pause = 2.5; st.t = 0; }
                    else { st.x += dx / d * v; st.y += dy / d * v; st.face = Math.atan2(dy, dx); }
                    e.person.anim = (e.person.anim || 0) + v / 13; e.person.frame = [1, 0, 2, 0][Math.floor(e.person.anim) % 4];
                }
                e.x = st.x; e.y = st.y;
            }
            e.sortY = e.y; e.person.dir = Watch.dirOf(st.face);
            if (Math.hypot(p.x - e.x, p.y - e.y) < 0.9 * TILE) close = true;
            if (Watch.sees(e, st.face, p.x, p.y, SEARCH_RANGE)) seen = true;
        }
        this.seeing = seen;
        this.sus = seen ? Math.min(1, this.sus + 1.6 * dt) : Math.max(0, this.sus - 0.5 * dt);
        if (close || this.sus >= 1) this.spotted();
    },
    tip() {
        sflag('lena_sneak_tip', true);
        Dlg.open('System', `MIRIAM'S TENT. Three people with torches are searching it. They haven't seen you yet.\n\n` +
            `Their torchlight shows as yellow cones on the ground. Step into one and a "!" bar fills over your head; when it's full, they've seen you. Walking right up to one of them counts as being seen too.\n\n` +
            `Get to the tent's door without being seen and you can choose what to do: listen to them, photograph them, or slip in at the back.\n\n` +
            `The woman faces into the tent most of the time and turns to look out every few seconds. The two men walk up and down the sides. The equipment table in front of the tent hides you from them.\n\n` +
            `Or walk straight up to them. That's a choice too.`);
    },
    spotted() { this.sus = 0; this.seeing = true; sflag('lena_spotted', true); startDialogue('c1a_lena_seen'); },
    draw(g, cx, cy) {
        if (!this.on()) return;
        const m = Game.maps.ch1, p = Game.player, A = pa(g);
        for (const e of this.ents()) {
            const st = this.st[e.id]; if (!st || Math.hypot(p.x - e.x, p.y - e.y) > 16 * TILE) continue;
            const a = st.face, pts = [[Math.round(e.x - cx), Math.round(e.y - 4 - cy)]], N = 16;
            for (let k = 0; k <= N; k++) { const b = a - SEARCH_HALF + 2 * SEARCH_HALF * k / N, ux = Math.cos(b), uy = Math.sin(b); let t = 10; while (t < SEARCH_RANGE && !World.blocked(m, e.x + ux * t - 2, e.y - 4 + uy * t - 2, 4, 4)) t += 6; pts.push([Math.round(e.x + ux * t - cx), Math.round(e.y - 4 + uy * t - cy)]); }
            g.globalAlpha = this.seeing ? 0.34 : 0.24; A.poly(pts, this.seeing ? '#ff5040' : '#ffe060'); g.globalAlpha = 1;
        }
        if (this.sus > 0.02) { const bx = Math.round(p.x - cx) - 10, by = Math.round(p.y - cy) - 48; A.r(bx - 1, by - 1, 22, 5, '#1c1814'); A.r(bx, by, Math.round(20 * this.sus), 3, this.sus > 0.6 ? '#f04030' : '#f0c040'); Txt.draw(g, '!', bx + 10, by - 13, { col: '#ffe060', shadow: '#1c1814', align: 'center' }); }
        if (Math.hypot(p.x - 33.5 * TILE, p.y - 27 * TILE) < 9 * TILE) {
            const VW = Game.VW;
            Txt.draw(g, "MIRIAM'S TENT", VW >> 1, 6, { col: '#ffe890', shadow: '#1c1814', align: 'center' });
            Txt.draw(g, 'Stay out of the torchlight. Get to the door unseen.', VW >> 1, 18, { col: '#ffffff', shadow: '#1c1814', align: 'center' });
        }
    },
};
// walking up to one of them is being seen
STORY_SCRIPTS.c1a_lena = STORY_SCRIPTS.c1a_lenaman1 = STORY_SCRIPTS.c1a_lenaman2 = () => sflag('lena_event') === 'searching' ? 'c1a_lena_seen' : null;
scene('c1a_lena_seen', {
    speaker: 'System',
    text: () => (Search.ents().some(e => Math.hypot(Game.player.x - e.x, Game.player.y - e.y) < 1.4 * TILE)
        ? `You walk right up to them. A torch comes round into your face, and stays there.`
        : `A torch beam swings across the sand, stops, and comes back to you.\n\n"Da," one of the men says quietly. There.`) +
        `\n\nAll three torches are on you now.`,
    choices: [{ text: 'Squint into the light.', nextScene: 'c1a_lena_confront' }],
});
(function () {
    const A = AREAS.archaeologist, _frame = A.frame, _sync = A.sync, _over = A.overlay;
    A.frame = function (dt) { _frame.call(this, dt); Search.frame(dt); };
    A.overlay = function (g, cx, cy) { if (_over) _over.call(this, g, cx, cy); Search.draw(g, cx, cy); };
    A.sync = function () { _sync.call(this); Search.reset(); };
})();
