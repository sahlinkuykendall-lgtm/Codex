// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE MAP (poke/worldmap.js)
// M opens it. Two levels:
//   AREA  — the whole of where you are (the camp), the places you've
//           found named on it, you blinking
//   EGYPT — M again zooms out to the country: every chapter's region from
//           the story bible, locked until the story takes you there. ◄►
//           pick one to read what's waiting.
// ============================================================

const REGIONS = [
    // [chapter(s), name, longitude, latitude, teaser, unlocked]
    ['1 · 14', 'GIZA', 31.13, 29.98, 'The dig camp on the plateau, where Miriam found the Codex. You are here. The story comes back to Giza at the very end: past the Osiris Shaft lies the last House.', true],
    ['2', 'CAIRO', 31.26, 30.05, 'Café El-Fishawy in the old city, on Thursday. Father Bishoy will be waiting. So will everyone else who wants the Codex.'],
    ['3', 'ALEXANDRIA', 29.92, 31.2, 'The first House: under the Serapeum\'s foundations, and down in the sunken royal harbour.'],
    ['4', 'THE DELTA', 31.88, 30.97, 'Tanis: fallen colossi in the mud, and a sacred lake with something far beneath it.'],
    ['5', 'THE FAIYUM', 30.84, 29.31, 'The Labyrinth of Hawara. Herodotus said it had three thousand rooms. Nobody has found them since.'],
    ['6', 'WESTERN DESERT', 28.87, 28.35, 'The black and white deserts, and the oases of Bahariya. A long way from anyone who can help you.'],
    ['7', 'SIWA', 25.52, 29.2, 'The Oracle of Amun, where Alexander was hailed as a god\'s son. A spoken key is cut in its stone. (You can miss it.)'],
    ['8', 'HERMOPOLIS', 30.8, 27.78, 'Thoth\'s own city. Millions of mummified ibises in the galleries, and the first line of the Book, carved as a warning.'],
    ['9', 'LUXOR', 32.64, 25.69, 'Ancient Thebes. A hidden tomb on land one family has guarded for a century, and a sealed box inside it.'],
    ['10', 'THE RIVER', 32.9, 25.05, 'Up the Nile from Qena to Kom Ombo, by felucca, with the whole country following you.'],
    ['11', 'ASWAN & PHILAE', 32.88, 24.02, 'The old temple island, drowned when the High Dam was built. A House is still down there.'],
    ['12', 'LAKE NASSER', 31.62, 22.34, 'Abu Simbel, and a Nubian village temple under the lake. (You can miss it.)'],
    ['13', 'SINAI', 33.6, 28.8, 'The first letters anyone ever wrote, cut in a turquoise mine in the mountains. (You can miss it.)'],
];
// Egypt's outline and water, in longitude/latitude
const EGYPT = [[25.0, 31.6], [27.2, 31.35], [28.9, 30.9], [29.9, 31.2], [30.4, 31.47], [31.8, 31.52], [32.3, 31.27], [33.8, 31.13], [34.25, 31.3], [34.9, 29.49],
    [34.25, 27.73], [33.3, 28.4], [32.55, 29.97], [32.3, 29.7], [32.7, 28.6], [33.9, 27.2], [34.2, 26.2], [35.6, 23.9], [36.9, 22.0], [25.0, 22.0]];
const NILE = [[32.95, 22.4], [32.9, 24.1], [32.85, 24.6], [32.65, 25.7], [32.72, 26.16], [31.9, 26.5], [31.18, 27.18], [30.75, 28.1], [31.1, 29.07], [31.24, 30.05]];
const OASES = [[25.52, 29.2], [28.87, 28.35], [27.97, 27.06], [29.0, 25.5], [30.55, 25.45]];

const WorldMap = {
    open: false, level: 0, t: 0, sel: 0, zoom: 1, egypt: null,
    show(level) { this.open = true; this.level = level || 0; this.t = 0; this.zoom = this.level; this.sel = 0; Sfx.ok(); },
    update(dt, I) {
        this.t += dt;
        this.zoom += ((this.level) - this.zoom) * Math.min(1, dt * 7);
        if (I.map) { if (this.level === 0) { this.level = 1; Sfx.move(); } else { this.open = false; Sfx.back(); } return; }
        if (I.back || I.menu) { if (this.level === 1) { this.level = 0; Sfx.back(); } else { this.open = false; Sfx.back(); } return; }
        if (this.level === 1) {
            if (I.left || I.up) { this.sel = (this.sel + REGIONS.length - 1) % REGIONS.length; Sfx.move(); }
            if (I.right || I.down) { this.sel = (this.sel + 1) % REGIONS.length; Sfx.move(); }
        }
    },
    // the country, drawn once
    egyptCanvas() {
        if (this.egypt) return this.egypt;
        const W = 232, H = 212, [c, g] = mk(W, H), A = pa(g);
        const px = (lon, lat) => [Math.round((lon - 24.4) / 12.8 * W), Math.round((32.2 - lat) / 10.6 * H)];
        A.r(0, 0, W, H, '#5a9ad8');
        for (let y = 2; y < H; y += 6) for (let x = (y % 12 ? 0 : 4); x < W; x += 12) A.hl(x, y, 3, '#72ace0');   // the sea's ripples
        A.poly(EGYPT.map(([lo, la]) => px(lo, la)), '#e8cf8e');
        // Libya and Sudan beyond the border, a darker sand; Sinai's mountains
        A.poly([[0, px(0, 31.6)[1]], px(25.0, 31.6), px(25.0, 22.0), [0, H], [0, px(0, 31.6)[1]]], '#d6ba7a');
        A.poly([px(25.0, 22.0), px(36.9, 22.0), [W, H], [0, H]], '#d6ba7a');
        for (const [lo, la] of [[33.9, 28.6], [34.1, 28.3], [33.6, 28.9], [34.3, 28.0]]) { const [x, y] = px(lo, la); A.poly([[x - 5, y + 3], [x, y - 4], [x + 5, y + 3]], '#b08650'); A.poly([[x, y - 4], [x + 5, y + 3], [x + 1, y + 3]], '#8e6a3e'); }
        // the Nile, its green banks, the delta fan, the Faiyum, Lake Nasser
        for (let i = 0; i + 1 < NILE.length; i++) { const [ax, ay] = px(...NILE[i]), [bx, by] = px(...NILE[i + 1]); A.line(ax - 1, ay, bx - 1, by, '#78b848'); A.line(ax + 1, ay, bx + 1, by, '#78b848'); A.line(ax, ay, bx, by, '#3a7cc4'); }
        const [cx, cy] = px(31.24, 30.05);
        A.poly([[cx, cy], px(30.1, 31.45), px(32.3, 31.35)], '#78b848');
        for (const end of [[30.4, 31.47], [31.8, 31.52], [31.1, 31.5]]) { const [ex, ey] = px(...end); A.line(cx, cy, ex, ey, '#3a7cc4'); }
        { const [fx, fy] = px(30.7, 29.4); A.ell(fx, fy, 5, 3, '#78b848'); A.ell(fx - 1, fy - 1, 2, 1, '#3a7cc4'); }
        A.poly([px(32.9, 23.9), px(33.0, 22.9), px(32.0, 22.0), px(31.3, 22.0), px(32.4, 23.0)], '#3a7cc4');
        for (const o of OASES) { const [x, y] = px(...o); A.ell(x, y, 2, 2, '#58a848'); A.px(x - 1, y - 1, '#8cd060'); }
        Txt.draw(g, 'Mediterranean Sea', px(27.3, 31.9)[0], px(27.3, 31.9)[1] - 5, { col: '#dcecff' });
        Txt.draw(g, 'Red Sea', px(35.3, 25.2)[0], px(35.3, 25.2)[1], { col: '#dcecff' });
        Txt.draw(g, 'WESTERN DESERT', px(27.1, 26.6)[0], px(27.1, 26.6)[1], { col: '#b89458' });
        this.px = px;
        return (this.egypt = c);
    },
    draw(g) {
        const VW = Game.VW, VH = Game.VH, A = pa(g);
        g.fillStyle = '#101838'; g.fillRect(0, 0, VW, VH);
        frame(g, 6, 6, VW - 12, VH - 12);
        Txt.draw(g, this.level === 0 ? 'MAP  ·  THE GIZA DIG CAMP' : 'MAP  ·  EGYPT', 18, 12, { col: UI.gold });
        Txt.draw(g, this.level === 0 ? 'M: zoom out    ESC: close' : '◄► regions    ESC: back    M: close', VW - 18, 12, { col: UI.dim, align: 'right' });
        frieze(g, 12, 25, VW - 24);
        const top = 46, avail = VH - top - 16;
        if (this.zoom < 0.5) {
            // ---- the area ----
            const mm = Game.miniMap(), k = Math.max(1, Math.floor(Math.min((VW - 36) / mm.width, avail / mm.height)));
            const mx = (VW - mm.width * k) >> 1, my = top + ((avail - mm.height * k) >> 1), a = 1 - this.zoom * 2;
            g.globalAlpha = Math.max(0, a);
            A.r(mx - 2, my - 2, mm.width * k + 4, mm.height * k + 4, '#c89020'); A.r(mx - 1, my - 1, mm.width * k + 2, mm.height * k + 2, '#38404c');
            g.drawImage(mm, mx, my, mm.width * k, mm.height * k);
            const s = k / TILE;
            for (const p of Game.maps.ch1.places) {
                if (!Game.seen[p.id]) continue;
                const x = mx + p.x * s, y = my + p.y * s;
                A.r(x - 2, y - 2, 5, 5, '#38404c'); A.r(x - 1, y - 1, 3, 3, '#ffe890');
                const nm = p.name.replace(/^THE /, ''), tw = Txt.width(nm);
                A.r(x - (tw >> 1) - 3, y + 4, tw + 6, 12, 'rgba(24,20,16,0.7)'); Txt.draw(g, nm, x, y + 4, { col: '#fff4d0', align: 'center' });
            }
            const [ox, oy] = Game.outdoorPos();
            if ((this.t * 3 | 0) % 2) { A.r(mx + ox * s - 3, my + oy * s - 3, 7, 7, '#ffffff'); A.r(mx + ox * s - 2, my + oy * s - 2, 5, 5, '#d04838'); }
            g.globalAlpha = 1;
            const found = Game.maps.ch1.places.filter(p => Game.seen[p.id]).length;
            Txt.draw(g, found + ' of ' + Game.maps.ch1.places.length + ' places found', VW >> 1, VH - 24, { col: UI.dim, align: 'center' });
        } else {
            // ---- Egypt ----
            const eg = this.egyptCanvas(), k = Math.max(1, Math.floor(Math.min((VW * 0.62) / eg.width, avail / eg.height)));
            const ew = eg.width * k, eh = eg.height * k, ex = 18, ey = top + ((avail - eh) >> 1);
            // it grows out from Giza as you zoom out
            const z = Math.min(1, (this.zoom - 0.5) * 2), [gx, gy] = this.px(31.13, 29.98), sc = k * (1 + (1 - z) * 5);
            g.save(); g.beginPath(); g.rect(ex, ey, ew, eh); g.clip();
            g.drawImage(eg, ex + gx * k - gx * sc, ey + gy * k - gy * sc, eg.width * sc, eg.height * sc);
            if (z > 0.95) REGIONS.forEach(([ch, name, lon, lat, , open], i) => {
                const [x0, y0] = this.px(lon, lat), x = ex + x0 * k, y = ey + y0 * k, on = i === this.sel;
                if (open) { A.r(x - 4, y - 4, 9, 9, '#38404c'); A.r(x - 3, y - 3, 7, 7, (this.t * 3 | 0) % 2 ? '#d04838' : '#ffe890'); }
                else { A.r(x - 3, y - 3, 7, 7, '#38404c'); A.r(x - 2, y - 2, 5, 5, on ? '#ffe890' : '#8a94a0'); A.r(x - 1, y - 3, 3, 2, '#38404c'); }
                if (on) { A.r(x - 7, y - 7, 15, 1, '#ffffff'); A.r(x - 7, y + 7, 15, 1, '#ffffff'); A.r(x - 7, y - 7, 1, 15, '#ffffff'); A.r(x + 7, y - 7, 1, 15, '#ffffff'); }
            });
            g.restore();
            A.r(ex - 2, ey - 2, ew + 4, 2, '#c89020'); A.r(ex - 2, ey + eh, ew + 4, 2, '#c89020'); A.r(ex - 2, ey, 2, eh, '#c89020'); A.r(ex + ew, ey, 2, eh, '#c89020');
            // what's there
            const [ch, name, , , teaser, open] = REGIONS[this.sel], lx = ex + ew + 14, lw = VW - lx - 20;
            Txt.draw(g, 'CHAPTER ' + ch, lx, top + 2, { col: UI.dim });
            Txt.draw(g, name, lx, top + 16, { col: UI.ink });
            Txt.draw(g, open ? '● You are here' : '■ Locked', lx, top + 32, { col: open ? '#388030' : '#a03028' });
            Txt.wrap(teaser, lw).slice(0, 9).forEach((ln, i) => Txt.draw(g, ln, lx, top + 52 + i * 13, { col: UI.ink }));
            if (!open) Txt.wrap('The story will take you there.', lw).forEach((ln, i) => Txt.draw(g, ln, lx, VH - 58 + i * 12, { col: UI.dim }));
            Txt.draw(g, (this.sel + 1) + ' / ' + REGIONS.length, lx, VH - 30, { col: UI.dim });
        }
    },
};
