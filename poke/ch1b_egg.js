// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE SPHINX'S EASTER EGG (poke/ch1b_egg.js)
// Not in the story bible, on purpose: a joke for whoever finds it.
// Stand in front of the alabaster sphinx and press UP three times quickly:
// a long-haired rocker with a goatee and a red guitar strolls out from
// behind it (a cameo nod to a certain School of Rock teacher), a riff
// starts up (an original tune: bagpipe drone, chugging bass, rock beat),
// he says his piece, and runs off. Then everything goes back to normal.
// ============================================================

// the riff: an original tune in E, the lead on the reed voice like a bagpipe, a drone under it
TUNES.egg_rock = {
    bpm: 150,
    lead: pat(`e5 - e5 g5 a5 - g5 e5 | d5 - e5 - b4 - . . | e5 - e5 g5 a5 - b5 a5 | g5 - a5 - e5 - - .
               a5 - a5 b5 d6 - b5 a5 | g5 - a5 - e5 - d5 - | e5 g5 a5 b5 a5 g5 e5 d5 | e5 - - - - - . .`),
    bass: pat(`e2 e2 e2 e2 e2 e2 d2 d2 | e2 e2 e2 e2 g2 g2 a2 a2 | e2 e2 e2 e2 e2 e2 d2 d2 | e2 e2 e2 e2 g2 g2 b2 b2
               a2 a2 a2 a2 a2 a2 g2 g2 | a2 a2 a2 a2 g2 g2 d2 d2 | e2 e2 e2 e2 g2 g2 a2 a2 | e2 e2 e2 e2 e2 . e2 .`),
    arp: pat('e3 - - - - - - - '.repeat(6) + 'b2 - - - - - - - e3 - - - - - - - '),
    drum: pat('D . T . D D T . '.repeat(7) + 'D T D T D T T T '),
    lead_i: 'reed', arp_i: 'reed', vol: { lead: 1, bass: 1.1, arp: 0.3, drum: 1.3 },
};

Object.assign(LOOKS, {
    rocker: { skinCol: SKINS[2], top: CLOTH.black, topKind: 'tee', legs: CLOTH.indigo, botKind: 'jeans', hairCol: HAIRS[2], hairStyle: 'long', face: 'goatee', wide: true, shoeKind: 'sneakers', shoe: '#20242c' },
});
// his sheet: the look above, plus eyebrows raised to the sky and a red double-horned guitar slung across him
function rockerSheet() {
    const sh = personSheet(LOOKS.rocker);
    sh.frames.forEach((row, dir) => row.forEach((c, f) => {
        const A = pa(c.getContext('2d')), hy = 10 + (f ? -1 : 0), R = ['#e04030', '#b02020', '#701010'], NK = '#7a4a24', HD = '#20242c';
        if (dir === DIR.down) {
            for (const [a, b] of [[12, 0], [13, -1], [14, -1], [18, -1], [19, -1], [20, 0]]) A.px(a, hy + b, '#301c10');                   // the eyebrows, way up
            A.hl(14, hy + 3, 5, '#ffffff'); A.px(13, hy + 2, '#5a1a14'); A.px(19, hy + 2, '#5a1a14'); A.hl(15, hy + 4, 3, '#5a1a14');   // a huge grin
            A.line(13, 16, 22, 23, '#30302c');                                                                                    // the strap
            A.line(16, 21, 24, 13, NK); A.r(23, 11, 3, 3, HD); A.px(24, 11, '#c8ccd0');                                          // the neck, the headstock
            A.r(9, 20, 9, 5, R[1]); A.hl(9, 20, 9, R[0]); A.px(9, 19, R[1]); A.px(10, 18, R[1]); A.px(16, 19, R[1]); A.px(17, 18, R[1]); A.hl(9, 24, 9, R[2]);   // the body, its two horns
            A.r(12, 21, 3, 1, HD); A.r(12, 23, 3, 1, HD); A.px(16, 23, '#f0c040');                                              // pickups, a knob
        } else if (dir === DIR.left || dir === DIR.right) {
            const s = dir === DIR.right ? 1 : -1, X = dx => 16 + s * dx;
            A.px(X(2), hy - 1, '#301c10'); A.px(X(3), hy - 1, '#301c10'); A.px(X(4), hy, '#301c10'); A.px(X(4), hy + 3, '#ffffff'); A.px(X(5), hy + 3, '#ffffff');   // the eyebrow, the grin
            A.px(X(2), hy + 5, HAIRS[2][0]); A.px(X(3), hy + 5, HAIRS[2][0]); A.px(X(2), hy + 6, HAIRS[2][0]);                                    // the goatee
            for (let i = 0; i < 8; i++) A.px(X(4 + i), 19 - (i >> 2), NK); A.px(X(12), 17, HD); A.px(X(13), 17, HD);
            A.r(Math.min(X(-2), X(4)), 19, 7, 5, R[1]); A.hl(Math.min(X(-2), X(4)), 19, 7, R[0]); A.hl(Math.min(X(-2), X(4)), 23, 7, R[2]); A.px(X(1), 21, HD);
        } else A.line(11, 15, 21, 24, '#30302c');                                                                                 // (from behind: just the strap)
    }));
    return sh;
}

scene('c1b_egg_rocker', {
    speaker: 'A Rocker', text: 'ROCK ON, DUDE!\n\nI gotta go save Peachessssss!',
    choices: [{ text: '\\m/  Rock on.', onSelect: () => Egg.run() }],
});

const Egg = {
    phase: 'idle', presses: [], e: null, map: null, song: false, t: 0,
    sphinx() { const m = Game.maps.ch1; return m && m.ents.find(e => e.id === 'c1b_sphinx'); },
    here() { return Game.state === 'play' && typeof area === 'function' && area() === AREAS.inspector && Game.map === Game.maps.ch1; },
    inFront() {                                                    // standing just south of the sphinx, below its base
        const s = this.sphinx(), p = Game.player; if (!s) return false;
        return p.x > s.x - 8 && p.x < s.x + s.w + 8 && p.y > s.y + s.d - 12 && p.y < s.y + s.d + 44;
    },
    key(e) {
        if (e.repeat || (e.key !== 'ArrowUp' && e.key !== 'w' && e.key !== 'W')) return;
        if (this.phase !== 'idle' || !this.here() || Dlg.active || Menu.open || Phone.open || Game.fade || !this.inFront()) { this.presses = []; return; }
        const now = Game.time; this.presses = this.presses.filter(t => now - t < 2.5); this.presses.push(now);
        if (this.presses.length >= 3) { this.presses = []; this.start(); }
    },
    start() {
        const s = this.sphinx(), m = Game.maps.ch1; if (!s) return;
        const x = s.x + s.w + 14, y = s.y + 6;                                                    // from behind its tail
        this.map = m; this.phase = 'walk'; this.song = true; this.t = 0;
        this.e = World.addEnt(m, { x, y, w: 0, d: 0, id: 'c1b_egg_rocker', label: 'A Rocker', person: { sheet: rockerSheet(), dir: DIR.down, frame: 0 }, sortY: y });
        m.people.push(this.e);
        if (!Game.set.music) Toast.show('(Music is off: Esc → SETTINGS → MUSIC. Trust us, turn it on.)');
    },
    frame(dt) {
        const e = this.e; if (!e) return;
        if (Game.map !== this.map) { this.clear(); return; }
        const p = Game.player;
        if (this.phase === 'walk') {
            const s = this.sphinx(), tx = p.x + 30, ty = p.y, cx = s.x + s.w + 14;
            const [gx, gy] = e.y < p.y - 6 && Math.abs(e.x - cx) < 4 ? [cx, ty] : [tx, ty];            // down beside the sphinx, then across to you
            if (Ser.step(e, gx, gy, 58, dt) && gx === tx) { this.phase = 'talk'; e.person.dir = DIR.left; e.person.frame = 0; p.dir = DIR.right; startDialogue('c1b_egg_rocker'); }
        } else if (this.phase === 'run') {
            if (Ser.step(e, this.away[0], this.away[1], 170, dt)) this.clear();                     // (legs going like the clappers)
        }
    },
    run() {
        const e = this.e, m = this.map; if (!e) return;
        this.phase = 'run'; this.away = [m.pw + 40, e.y + 8];
    },
    clear() {
        const e = this.e, m = this.map;
        if (e && m) { World.removeEnt(m, e); for (const L of [m.ents, m.people]) { const i = L.indexOf(e); if (i >= 0) L.splice(i, 1); } }
        this.e = null; this.phase = 'idle'; this.song = false;
    },
};
window.addEventListener('keydown', e => { try { Egg.key(e); } catch (err) { } });
(function () {
    const A = AREAS.inspector, _frame = A.frame, _sync = A.sync;
    A.frame = function (dt) { _frame.call(this, dt); Egg.frame(dt); };
    A.sync = function () { _sync.apply(this, arguments); if (Egg.e) Egg.clear(); };
    const _target = Music.target;
    Music.target = function () { return Egg.song && Game.state === 'play' && !Mini.cur ? 'egg_rock' : _target.call(this); };
})();
