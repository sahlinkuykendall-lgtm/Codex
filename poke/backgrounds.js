// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE FOUR BACKGROUNDS (poke/backgrounds.js)
// From the story bible (story/01_CHARACTERS.md and story/regions/ch01_opening_*.md):
// you are one of four people left holding Miriam's trail. Each starts
// somewhere of their own that nobody else can visit, and all four roads meet
// in Chapter 2, at the Café El-Fishawy in Cairo.
//   BACKGROUNDS[i]: who they are, where they start, their skills and gear, the
//   little painting of their opening, their papers (the card you sign in the
//   creator), and the scene that opens their story.
// Only the Archaeologist's opening (the Giza dig camp) is built so far; the
// others can be looked at on the background screen but not picked yet.
// ============================================================

// ---- the little emblems on the background list (20×20) ----
const BG_EMBLEM = {
    archaeologist(A, x, y) {   // a trowel
        A.poly([[x + 3, y + 3], [x + 13, y + 5], [x + 11, y + 11], [x + 5, y + 13]], '#b2bec6'); A.line(x + 3, y + 3, x + 13, y + 5, '#dfe6ea'); A.line(x + 5, y + 13, x + 11, y + 11, '#5a6872');
        A.line(x + 11, y + 11, x + 15, y + 15, '#5a6872'); A.r(x + 14, y + 14, 5, 3, '#8e5e32'); A.r(x + 15, y + 16, 4, 3, '#b87a44');
    },
    inspector(A, x, y) {       // the Ministry seal: a blue ring, a gold ankh
        A.ell(x + 10, y + 10, 9, 9, '#2c5490'); A.ell(x + 10, y + 10, 7, 7, '#f4ecd4');
        A.ell(x + 10, y + 6, 2, 2, '#c89020'); A.ell(x + 10, y + 6, 1, 1, '#f4ecd4'); A.r(x + 9, y + 8, 3, 8, '#c89020'); A.r(x + 6, y + 9, 9, 2, '#c89020');
    },
    fixer(A, x, y) {           // an anchor
        A.ell(x + 10, y + 3, 2, 2, '#3a3e48'); A.r(x + 9, y + 5, 3, 12, '#3a3e48'); A.r(x + 6, y + 7, 9, 2, '#3a3e48');
        A.line(x + 3, y + 12, x + 10, y + 17, '#3a3e48'); A.line(x + 17, y + 12, x + 10, y + 17, '#3a3e48'); A.line(x + 3, y + 13, x + 10, y + 18, '#3a3e48'); A.line(x + 17, y + 13, x + 10, y + 18, '#3a3e48');
        A.poly([[x + 1, y + 11], [x + 5, y + 11], [x + 3, y + 14]], '#3a3e48'); A.poly([[x + 15, y + 11], [x + 19, y + 11], [x + 17, y + 14]], '#3a3e48'); A.vl(x + 9, y + 5, 11, '#6a7280');
    },
    journalist(A, x, y) {      // a camera
        A.r(x + 1, y + 6, 18, 12, '#3a3e48'); A.r(x + 1, y + 6, 18, 2, '#5a6272'); A.r(x + 3, y + 4, 5, 2, '#3a3e48'); A.r(x + 14, y + 4, 3, 2, '#d04838');
        A.ell(x + 10, y + 12, 5, 5, '#1a1c22'); A.ell(x + 10, y + 12, 3, 3, '#4884cc'); A.px(x + 9, y + 11, '#ffffff');
    },
};

// ---- the little paintings of where each one starts (drawn into w×h at x,y) ----
function bgStars(A, x, y, w, h, t, n) { for (let i = 0; i < n; i++) { const sx = x + Math.floor(hash2(i, 41) * w), sy = y + Math.floor(hash2(i, 42) * h); A.px(sx, sy, (t * 2 + i | 0) % 7 ? '#c8d0f0' : '#ffffff'); } }
function bgPyramid(A, cx, base, half, lit, dark) { A.poly([[cx - half, base], [cx, base - Math.round(half * 0.72)], [cx, base]], lit); A.poly([[cx, base - Math.round(half * 0.72)], [cx + half, base], [cx, base]], dark); }
const BG_SCENE = {
    archaeologist(A, x, y, w, h, t) {   // Giza after dark: the pyramids, the dig camp's lamps
        const hz = y + Math.round(h * 0.66);
        A.r(x, y, w, h, '#141c3c'); A.r(x, y + Math.round(h * 0.4), w, hz - y - Math.round(h * 0.4), '#1e2a52'); bgStars(A, x, y, w, hz - y - 10, t, 30);
        A.ell(x + w - 30, y + 14, 6, 6, '#f4ecd4'); A.ell(x + w - 28, y + 13, 5, 5, '#1e2a52');                                                 // a crescent moon
        bgPyramid(A, x + Math.round(w * 0.3), hz, 34, '#8a7ca0', '#3a3458'); bgPyramid(A, x + Math.round(w * 0.56), hz, 30, '#7a6c90', '#322c4e'); bgPyramid(A, x + Math.round(w * 0.74), hz, 14, '#6a5c80', '#2c2646');
        A.r(x, hz, w, y + h - hz, '#3a3048'); A.r(x, hz, w, 2, '#5a4c68');
        for (let i = 0; i < 4; i++) { const tx = x + 14 + i * 26, ty = hz + 12 + (i & 1) * 4; A.poly([[tx, ty + 8], [tx + 16, ty + 8], [tx + 8, ty]], '#6a5c50'); A.poly([[tx + 8, ty], [tx + 16, ty + 8], [tx + 11, ty + 8]], '#4a3e3a'); }
        for (let i = 0; i < 5; i++) { const lx = x + 12 + i * 30, ly = hz + 26; A.px(lx, ly, (t * 3 + i | 0) % 5 ? '#ffd860' : '#fff4b0'); A.px(lx, ly + 1, '#c08030'); }
    },
    inspector(A, x, y, w, h, t) {       // Saqqara by day: the Step Pyramid, the palm groves below
        const hz = y + Math.round(h * 0.62);
        A.r(x, y, w, h, '#9ed2f4'); A.r(x, y + Math.round(h * 0.35), w, hz - y - Math.round(h * 0.35), '#c4e4f8');
        const cx = x + Math.round(w * 0.46);
        for (let k = 0; k < 6; k++) { const hw = 40 - k * 6, ty = hz - (k + 1) * 6; A.r(cx - hw, ty, hw * 2, 6, k & 1 ? '#e0c890' : '#d4bc84'); A.r(cx - hw, ty, hw * 2, 1, '#f4e4b8'); A.r(cx + hw - 6, ty, 6, 6, '#b89c68'); }   // six steps
        A.r(x, hz, w, y + h - hz, '#ecd698'); A.r(x, hz, w, 1, '#f8eac0');
        for (let i = 0; i < 9; i++) { const px = x + 6 + i * 20 + (i & 1) * 6, py = y + h - 8; A.vl(px, py - 10, 10, '#8e5e32'); A.ell(px, py - 11, 6, 3, '#4c9a3c'); A.ell(px - 1, py - 12, 3, 1, '#8cd060'); }   // the palms
        A.r(x + w - 52, hz - 8, 30, 12, '#fffaec'); A.r(x + w - 52, hz - 8, 30, 2, '#f0e4c6'); A.r(x + w - 44, hz - 4, 4, 8, '#4884cc'); A.r(x + w - 34, hz - 4, 6, 4, '#4884cc');   // the inspectorate
        A.vl(x + w - 24, hz - 20, 12, '#5a6272'); A.r(x + w - 23, hz - 20, 7, 4, (t * 2 | 0) % 2 ? '#d04838' : '#c83828'); A.r(x + w - 23, hz - 18, 7, 1, '#ffffff');
    },
    fixer(A, x, y, w, h, t) {           // Marsa Tarfa at dusk: the mountains, the reef, a dhow, the quay
        const hz = y + Math.round(h * 0.45), qy = y + Math.round(h * 0.8);
        A.r(x, y, w, h, '#f09848'); A.r(x, y + 10, w, 12, '#f0b058'); A.r(x, y + 22, w, hz - y - 22, '#f8d078');
        A.ell(x + Math.round(w * 0.3), hz - 2, 12, 12, '#fff0b0');
        A.poly([[x, hz], [x + 30, hz - 20], [x + 60, hz - 8], [x + 90, hz - 26], [x + 130, hz - 6], [x + w, hz - 14], [x + w, hz]], '#8a4a5a');
        A.r(x, hz, w, qy - hz, '#2a8ab0'); A.r(x, hz, w, 2, '#58b8d8'); A.r(x + Math.round(w * 0.3) - 10, hz + 2, 20, 1, '#fff0b0'); A.r(x + Math.round(w * 0.3) - 6, hz + 5, 12, 1, '#f8d078');   // the sun on the water
        for (let i = 0; i < 10; i++) A.hl(x + ((hash2(i, 3) * w + t * 6) % w), hz + 6 + Math.floor(hash2(i, 4) * (qy - hz - 12)), 8, '#78cce4');
        for (let i = 0; i < 5; i++) { const rx = x + Math.floor(hash2(i, 13) * (w - 30)), ry = qy - 8 - Math.floor(hash2(i, 14) * 10); A.ell(rx + 12, ry, 12, 3, '#46b0b0'); A.ell(rx + 10, ry - 1, 6, 1, '#78e0d0'); }   // the reef, just under the surface
        A.r(x + w - 30, hz - 10, 16, 10, '#b89c68'); A.r(x + w - 30, hz - 14, 4, 4, '#b89c68'); A.r(x + w - 18, hz - 14, 4, 4, '#b89c68');        // the old fort, far off
        const dx = x + Math.round(w * 0.58 + Math.sin(t * 0.8) * 2), dy = hz + 14;                                                          // Zaki's dhow
        A.poly([[dx, dy], [dx + 40, dy], [dx + 34, dy + 7], [dx + 5, dy + 7]], '#8e5e32'); A.hl(dx, dy, 40, '#dca468'); A.hl(dx + 4, dy + 3, 32, '#c83828');
        A.vl(dx + 20, dy - 26, 26, '#5e3620'); A.poly([[dx + 21, dy - 26], [dx + 21, dy - 2], [dx + 38, dy - 4]], '#f4ecd4'); A.poly([[dx + 21, dy - 26], [dx + 38, dy - 4], [dx + 30, dy - 4]], '#d8ccac');
        // the quay: dressed stone, bollards, a fishing boat tied up
        A.r(x, qy, w, y + h - qy, '#c8b490'); A.r(x, qy, w, 2, '#e8dcbc'); for (let i = 0; i < w; i += 16) A.vl(x + i + (i & 16 ? 8 : 0), qy + 2, 6, '#a8946c'); A.hl(x, qy + 8, w, '#a8946c');
        for (const bx of [x + 20, x + w - 40]) { A.r(bx, qy - 4, 5, 6, '#3a3e48'); A.hl(bx, qy - 4, 5, '#6a7280'); }
        A.poly([[x + 44, qy - 6], [x + 84, qy - 6], [x + 80, qy], [x + 48, qy]], '#2e7cc4'); A.hl(x + 44, qy - 6, 40, '#f4ecd4'); A.line(x + 25, qy - 3, x + 46, qy - 5, '#d8ccac');
    },
    journalist(A, x, y, w, h, t) {      // Port Said: the old waterfront, the Canal building's green domes, a ship, a crane
        const hz = y + Math.round(h * 0.56);
        A.r(x, y, w, h, '#b8dcf0'); A.r(x, y + 18, w, hz - y - 18, '#d4ecf8');
        const bx = x + Math.round(w * 0.42), bw2 = 66;                                                                 // the Canal building, across the water
        A.r(bx, hz - 18, bw2, 18, '#fffaec'); A.hl(bx, hz - 18, bw2, '#ffffff'); for (let i = 0; i < 7; i++) A.r(bx + 4 + i * 9, hz - 13, 4, 8, '#4884cc');
        for (const [ox, r] of [[11, 6], [33, 9], [55, 6]]) { A.poly([[bx + ox - r, hz - 18], [bx + ox + r, hz - 18], [bx + ox + r - 2, hz - 18 - r + 2], [bx + ox, hz - 18 - r], [bx + ox - r + 2, hz - 18 - r + 2]], '#3a9a68'); A.r(bx + ox - r + 2, hz - 18 - r + 3, 3, r - 3, '#6ac890'); A.vl(bx + ox, hz - 22 - r, 4, '#3a9a68'); }
        const cx = x + w - 44; A.r(cx, hz - 40, 4, 40, '#d04838'); A.r(cx + 12, hz - 40, 4, 40, '#d04838'); A.r(cx - 10, hz - 44, 40, 5, '#d04838'); A.hl(cx - 10, hz - 44, 40, '#f07058');   // a container crane
        A.vl(cx + 24, hz - 39, 12 + Math.round(Math.sin(t) * 3), '#3a3e48'); A.r(cx + 20, hz - 27 + Math.round(Math.sin(t) * 3), 9, 5, '#2f5fae');
        A.r(x, hz, w, y + h - hz, '#3a7cc4'); A.r(x, hz, w, 2, '#9ed2f4'); for (let i = 0; i < 8; i++) A.hl(x + ((hash2(i, 9) * w + t * 5) % w), hz + 5 + Math.floor(hash2(i, 8) * 20), 7, '#78b4ec');
        const sx = x + Math.round(w * 0.62 - (t * 3) % 50); A.r(sx, hz + 6, 64, 8, '#3a3e48'); A.r(sx, hz + 12, 64, 2, '#c83828');                  // a container ship in the canal, at eye level
        for (let i = 0; i < 5; i++) A.r(sx + 4 + i * 10, hz, 9, 6, ['#d04838', '#2f5fae', '#efbb35', '#58a848', '#2f5fae'][i]); A.r(sx + 54, hz - 6, 8, 12, '#fffaec');
        // the hotel on the old waterfront: a tall colonial front, wooden balconies on every floor
        const hx = x, hw = Math.round(w * 0.34), ht = y + 6;
        A.r(hx, ht, hw, y + h - ht, '#e8c89c'); A.vl(hx + hw - 1, ht, y + h - ht, '#c8a878'); A.r(hx, ht, hw, 3, '#f4dcb8');
        for (let fl = 0; fl < 4; fl++) {
            const fy = ht + 10 + fl * 20;
            for (let i = 0; i < 3; i++) { A.r(hx + 6 + i * Math.round(hw / 3), fy, 8, 12, '#2e5ea2'); A.vl(hx + 10 + i * Math.round(hw / 3), fy, 12, '#78b4ec'); }
            A.r(hx, fy + 12, hw, 2, '#6e4424'); for (let k = 2; k < hw; k += 4) A.vl(hx + k, fy + 7, 5, '#8e5e32'); A.hl(hx, fy + 7, hw, '#a8703c');   // the balcony rail
        }
        A.r(x, y + h - 10, w, 10, '#b8a888'); A.hl(x, y + h - 10, w, '#d8ccac');                                                      // the corniche
    },
};

// the place, full screen: its little painting drawn at half size and doubled, so the pixels stay crisp
function bgWide(g, id, t, W, H, sheet) {
    const w = W >> 1, h = (H - 64) >> 1, c = bgWide.c && bgWide.c.width === w && bgWide.c.height === h ? bgWide.c : (bgWide.c = mk(w, h)[0]), cg = c.getContext('2d');
    cg.clearRect(0, 0, w, h); BG_SCENE[id](pa(cg), 0, 0, w, h, t);
    if (sheet) { const f = sheet.frames[3][0], px = Math.round(w * 0.5) - 16, py = h - 36; pa(cg).ell(px + 16, py + 31, 7, 2, 'rgba(40,28,16,0.35)'); cg.drawImage(f, px, py); }
    g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, w * 2, h * 2);
    pa(g).r(0, h * 2, W, H - h * 2, '#141018');
}
// a sheet of paper on a desk (the letter, the ledger)
function bgDesk(A, W, H, wood) { A.r(0, 0, W, H, wood[0]); for (let x = 0; x < W; x += 18) A.vl(x, 0, H, wood[1]); for (let i = 0; i < 12; i++) A.hl(hash2(i, 61) * W, hash2(i, 62) * H, 20 + hash2(i, 63) * 30, wood[1]); }

const BACKGROUNDS = [
    {
        id: 'archaeologist', only: 'The only one who can run a dig (Excavation 3). Starts well with the Ministry.', name: 'THE ARCHAEOLOGIST', ready: true,
        place: 'Giza  ·  the dig camp', lon: 31.13, lat: 29.98, chapter: '1-A',
        who: 'A foreign field archaeologist in their thirties. Good at the job, bad at politics.',
        hook: 'The Ministry has hired you to take over Miriam\'s dig. She "left for family reasons" four days ago. Nobody at camp believes it.',
        skills: 'English · Hieroglyphs 2 · Excavation 3 · French 1',
        gear: '8,000 EGP · a trowel · a notebook · a dig permit',
        title: (n) => 'Dr. ' + n,
        doc: { org: 'MINISTRY OF TOURISM AND ANTIQUITIES', kind: 'PERMIT TO EXCAVATE', col: '#2c5490', seal: 'OK', rows: (n) => [['Name', 'Dr. ' + n], ['Post', 'Acting director'], ['Site', 'Giza Western Field'], ['Valid', 'Tonight']] },
        teaser: 'The dig camp on the plateau, where Miriam found the Codex. You start here. The story comes back to Giza at the very end: past the Osiris Shaft lies the last House.',
        // the scenes that open this story, after the papers are signed
        scenes: [
            {
                cap: 'TODAY',
                text: 'Today a letter came from the Ministry in Cairo.\n\nThe Giza dig needs a new director, tonight. They are sending you.\n\nThey chose you because you can read a trench like a book: nobody else in this story can run a dig. You read hieroglyphs, and a little French. Your Arabic is a handful of words. It will have to grow.',
                draw(g, t, W, H) {
                    const A = pa(g);
                    bgDesk(A, W, H, ['#3a2a1c', '#30221a']);
                    const w = Math.min(300, W - 40), h = Math.min(170, H - 90), x = (W - w) >> 1, y = 22;
                    A.r(x + 4, y + 4, w, h, '#1e140e'); A.r(x, y, w, h, '#f4ecd4'); A.r(x, y, w, 3, '#fffaf0'); A.r(x + w - 3, y, 3, h, '#d8ccac');
                    A.ell(x + 28, y + 26, 13, 13, '#2c5490'); A.ell(x + 28, y + 26, 10, 10, '#f4ecd4'); A.poly([[x + 22, y + 32], [x + 34, y + 32], [x + 28, y + 17]], '#c89020');
                    Txt.draw(g, 'MINISTRY OF TOURISM AND ANTIQUITIES', x + 48, y + 14, { col: '#2c5490' });
                    Txt.draw(g, 'LETTER OF APPOINTMENT', x + 48, y + 28, { col: '#30302c' });
                    A.r(x + 14, y + 46, w - 28, 1, '#b8a880');
                    ['Concession: Giza Western Field Survey', 'Acting director: Dr. ' + Game.player.name, 'Effective: immediately'].forEach((s, i) => Txt.draw(g, s, x + 16, y + 56 + i * 15, { col: '#50483c' }));
                    for (let i = 0; i < 3; i++) A.r(x + 16, y + 108 + i * 8, w - 60 - i * 30, 1, '#c8bc9c');
                    const sx = x + w - 50, sy = y + h - 42, a = Math.min(1, Math.max(0, t - 1.2) * 4);
                    if (a > 0) { g.globalAlpha = a; A.ell(sx, sy, 22, 22, '#c03828'); A.ell(sx, sy, 18, 18, '#f4ecd4'); A.ell(sx, sy, 15, 15, '#c03828'); A.ell(sx, sy, 13, 13, '#f4ecd4'); Txt.draw(g, 'URGENT', sx, sy - 6, { col: '#c03828', align: 'center' }); g.globalAlpha = 1; }
                },
            },
            {
                cap: 'GIZA  ·  8:30 PM',
                text: 'Giza, after dark. The plateau above Cairo, where the city stops and the desert begins.\n\nThe taxi leaves you at the gate of the dig and drives away without waiting.\n\nSomebody is coming to meet you, with a lantern.',
                draw(g, t, W, H) {
                    const A = pa(g);
                    drawNightScene(g, t, 0.2);
                    const x = Math.round(W * 0.5 + t * 10), y = Math.round(H * 0.72);
                    A.r(x, y, 46, 12, '#e8e8e0'); A.poly([[x + 8, y], [x + 14, y - 8], [x + 32, y - 8], [x + 38, y]], '#e8e8e0'); A.r(x + 15, y - 6, 16, 6, '#384888'); A.r(x, y + 5, 46, 2, '#242228'); A.ell(x + 10, y + 12, 4, 3, '#05060c'); A.ell(x + 36, y + 12, 4, 3, '#05060c'); A.r(x + 44, y + 3, 3, 3, '#ffd070');
                },
            },
        ],
    },
    {
        id: 'inspector', only: 'The only native Arabic speaker and reader. The best start with the Ministry.', name: 'THE INSPECTOR', ready: true,
        place: 'Saqqara  ·  the inspectorate', lon: 31.22, lat: 29.87, chapter: '1-B',
        who: 'An Egyptian junior antiquities inspector in their late twenties. Idealistic, underpaid, good at noticing things.',
        hook: 'Miriam logged a leather codex into your evidence store for safekeeping. This morning the log line is scratched out and the Codex is gone. Your boss says: file it as a clerical error.',
        skills: 'Egyptian Arabic (native) · Arabic reading (native) · Hieroglyphs 2 · Investigation 2',
        gear: '3,000 EGP · a Ministry ID · a service phone',
        title: (n) => 'Inspector ' + n,
        doc: { org: 'MINISTRY OF TOURISM AND ANTIQUITIES', kind: 'INSPECTOR\'S IDENTITY CARD', col: '#2c5490', seal: 'ID', rows: (n) => [['Name', n], ['Post', 'Junior inspector'], ['Office', 'Saqqara'], ['Valid', 'Until revoked']] },
        teaser: 'The Step Pyramid, the Serapeum\'s bull galleries, and the inspectorate where the Codex went missing. Only the Inspector ever sees it.',
        scenes: [
            {
                cap: 'SAQQARA INSPECTORATE  ·  THIS MORNING',
                text: 'Three days ago Dr. Miriam Hale logged an object into the inspectorate\'s secure evidence store, "for safekeeping pending Ministry review": one leather codex, Late Antique.\n\nThis morning the line in the ledger is scratched out, and the object is gone.',
                draw(g, t, W, H) {
                    const A = pa(g);
                    bgDesk(A, W, H, ['#4a3a2c', '#3e3024']);
                    const x = (W >> 1) - 150, y = 18, w = 300, h = H - 100;
                    A.r(x + 4, y + 4, w, h, '#1e140e'); A.r(x, y, w, h, '#f0e6c8'); A.r(x + (w >> 1) - 1, y, 3, h, '#c8bc9c'); A.r(x, y, w, 2, '#fffaf0');   // the ledger, open
                    Txt.draw(g, 'SECURE STORE  ·  IN', x + 12, y + 8, { col: '#2c5490' });
                    const rows = ['Faience amulet, Saite', 'Limestone stela frag.', 'Pottery lot, Teti ext.', '1 leather codex'];
                    rows.slice(0, 4).forEach((r, i) => { const ry = y + 30 + i * 20; A.hl(x + 10, ry + 12, w / 2 - 20, '#c8bc9c'); Txt.draw(g, r, x + 12, ry, { col: '#50483c' }); });
                    A.hl(x + w / 2 + 10, y + 102, w / 2 - 20, '#c8bc9c'); Txt.draw(g, 'M. Hale  ·  3 days ago', x + w / 2 + 12, y + 90, { col: '#50483c' }); for (let k = 0; k < 6; k++) A.line(x + w / 2 + 10 + k * 20, y + 100 - (k & 1) * 8, x + w / 2 + 28 + k * 20, y + 92 + (k & 1) * 8, '#20242c');
                    // the scratched-out line
                    const sy = y + 90;
                    for (let k = 0; k < 7; k++) A.line(x + 10 + k * 18, sy + 10 - (k & 1) * 8, x + 28 + k * 18, sy + 2 + (k & 1) * 8, '#20242c');
                    A.r(x + 10, sy + 4, 130, 3, '#20242c');
                    A.r(x + w / 2 + 12, y + 126, 110, 40, '#e0d4b0'); Txt.draw(g, 'Shelf 4B', x + w / 2 + 18, y + 132, { col: '#8a7c60' }); Txt.draw(g, 'EMPTY', x + w / 2 + 18, y + 148, { col: '#c03828' });
                    A.ell(x - 30, y + h - 10, 14, 5, '#9aa4ae'); A.r(x - 36, y + h - 30, 12, 20, '#ffffff'); A.r(x - 36, y + h - 20, 12, 10, '#a03818');   // a glass of tea gone cold
                },
            },
            {
                cap: 'THE DIRECTOR\'S OFFICE',
                text: 'Director Fathi doesn\'t look up from his newspaper. "File it as a clerical error."\n\nBut you grew up speaking this country\'s language and reading its signs; none of the others can. You know hieroglyphs, and you know a forged seal when you see one.\n\nAnd Umm Sabry, who makes the tea and knows everything, says Samy Ragab stayed late last night.',
                draw(g, t, W, H) {
                    const A = pa(g), fl = H - 90;
                    A.r(0, 0, W, fl, '#d8c8a0'); A.r(0, fl - 40, W, 40, '#b8a47c'); A.hl(0, fl - 40, W, '#e8dcbc'); A.r(0, fl, W, H - fl, '#8a6a48');
                    const wx = W - 170, wy = 26;                                                                  // the window: the Step Pyramid outside
                    A.r(wx, wy, 120, 80, '#9ed2f4'); A.r(wx, wy + 58, 120, 22, '#ecd698');
                    for (let k = 0; k < 6; k++) { const hw = 34 - k * 5; A.r(wx + 60 - hw, wy + 58 - (k + 1) * 6, hw * 2, 6, k & 1 ? '#e0c890' : '#d4bc84'); }
                    A.r(wx - 4, wy - 4, 128, 4, '#6e4424'); A.r(wx - 4, wy + 80, 128, 4, '#6e4424'); A.r(wx - 4, wy, 4, 80, '#6e4424'); A.r(wx + 120, wy, 4, 80, '#6e4424'); A.r(wx + 58, wy, 4, 80, '#6e4424');
                    const fx = 120, fy = 16, a = t * 9;                                                              // the ceiling fan, turning
                    A.vl(fx, 0, fy, '#5a5048'); A.ell(fx, fy, 4, 2, '#5a5048');
                    for (let k = 0; k < 3; k++) { const an = a + k * 2.09; A.line(fx, fy, fx + Math.round(Math.cos(an) * 36), fy + Math.round(Math.sin(an) * 5), '#5a5048'); A.line(fx, fy + 1, fx + Math.round(Math.cos(an) * 36), fy + 1 + Math.round(Math.sin(an) * 5), '#8a8078'); }
                    const dx = 60, dy = fl - 30;                                                                       // the desk, the newspaper held up
                    A.r(dx, dy, 240, 14, '#a8703c'); A.hl(dx, dy, 240, '#dca468'); A.r(dx + 6, dy + 14, 228, 50, '#8e5630'); A.r(dx + 110, dy + 18, 40, 20, '#6e4424');
                    const px = dx + 70, py = dy - 74 + Math.round(Math.sin(t * 1.5));
                    A.r(px, py, 100, 72, '#f4f0e4'); A.r(px + 49, py, 2, 72, '#c8c0a8');
                    for (let i = 0; i < 9; i++) { A.hl(px + 6, py + 20 + i * 5, 38, '#9a9488'); A.hl(px + 56, py + 20 + i * 5, 38, '#9a9488'); }
                    A.r(px + 6, py + 6, 88, 9, '#30302c'); A.r(px + 56, py + 22, 34, 20, '#8a8478');
                    A.ell(px - 2, py + 36, 5, 5, '#a0683c'); A.ell(px + 102, py + 36, 5, 5, '#a0683c');                  // his hands
                    A.r(dx + 200, dy - 12, 8, 12, '#ffffff'); A.r(dx + 200, dy - 6, 8, 6, '#a03818');                     // tea
                },
            },
            { cap: 'SAQQARA', place: true, text: 'Saqqara: the Step Pyramid on the desert edge, the palm groves and villages below, and under the sand the long dark galleries of the Serapeum.\n\nSomewhere out there is a Codex that isn\'t on the shelf, and a colleague who stayed late.' },
        ],
    },
    {
        id: 'fixer', only: 'The only one who can pick locks, haggle hard and dive. In with the Gebali.', name: 'THE FIXER', ready: true, origin: true,
        place: 'Marsa Tarfa  ·  the Red Sea coast', lon: 34.1, lat: 26.4, chapter: '1-C',
        who: 'A smuggler and fixer who works the Red Sea coast, in their thirties. Egyptian or foreign: you pick.',
        hook: 'You owe Bassem "the Shark" Nassar 60,000 pounds. One night job clears it: take a package out to a ship offshore. Nobody is supposed to open the package.',
        skills: 'Egyptian Arabic 3 (street) · Lockpicking 2 · Haggling 3 · Diving 1',
        skillsEg: 'Egyptian Arabic 5 · Arabic reading 2 · Lockpicking 2 · Haggling 3 · Diving 1',
        gear: '500 EGP · a debt of 60,000 EGP · lockpicks · a knife',
        gearEg: 'Less than 500 EGP · a debt of 60,000 EGP · lockpicks · a knife',
        title: (n) => n,
        doc: { org: 'PORT OF MARSA TARFA', kind: 'HARBOUR PASS', col: '#2a8ab0', seal: 'PASS', rows: (n) => [['Name', n], ['Trade', 'Boat work'], ['Port', 'Marsa Tarfa'], ['Owes', '60,000 EGP']] },
        teaser: 'A fishing and smuggling harbour between Safaga and Quseir: the reef, the truck stop, Captain Zaki\'s dhow. Only the Fixer ever sees it.',
        scenes: [
            {
                cap: 'MARSA TARFA  ·  MORNING',
                text: 'You owe Bassem "the Shark" Nassar sixty thousand pounds. A boat you sank, a cargo you lost; it doesn\'t matter now.\n\nThis morning his men knocked on your door. Politely.\n\nThe second time won\'t be polite.',
                draw(g, t, W, H) {
                    const A = pa(g), fl = H - 76;
                    A.r(0, 0, W, fl, '#f4ecd4'); for (let y = 8; y < fl; y += 12) A.hl(0, y, W, '#e8dcbc');                // a whitewashed wall in hard sun
                    A.r(0, fl, W, H - fl, '#d8c08a'); A.r(0, fl, W, 3, '#b89c68');
                    const dx = (W >> 1) - 40, dy = fl - 120;
                    A.r(dx - 8, dy - 8, 96, 128, '#d6c29c'); A.r(dx, dy, 80, 120, '#2e7cc4'); for (let i = 8; i < 80; i += 12) A.vl(dx + i, dy, 120, '#2466a8'); A.vl(dx, dy, 120, '#58a6e6');
                    A.r(dx + 64, dy + 60, 6, 4, '#c89020');
                    A.r(dx + 22, dy + 34, 36, 26, '#fffaec'); Txt.draw(g, '60,000', dx + 40, dy + 38, { col: '#c03828', align: 'center' }); Txt.draw(g, 'B.N.', dx + 40, dy + 48, { col: '#30302c', align: 'center' });   // the note pinned there
                    A.px(dx + 40, dy + 35, '#5a6272');
                    // two men's shadows thrown on the wall by the low sun, waiting either side of the door
                    for (const [sx, cap] of [[dx - 110, 1], [dx + 124, 0]]) {
                        const c = '#c8b898', top = dy + 8;
                        A.ell(sx + 14, top + 8, 8, 9, c); if (cap) { A.r(sx + 5, top - 2, 18, 5, c); A.r(sx + 18, top + 1, 9, 3, c); }
                        A.r(sx + 11, top + 16, 7, 5, c); A.poly([[sx - 6, top + 22], [sx + 34, top + 22], [sx + 30, top + 70], [sx - 2, top + 70]], c);
                        A.poly([[sx - 6, top + 22], [sx - 2, top + 22], [sx - 8, top + 64], [sx - 12, top + 62]], c); A.poly([[sx + 30, top + 22], [sx + 34, top + 22], [sx + 40, top + 62], [sx + 36, top + 64]], c);
                        A.r(sx + 2, top + 70, 10, fl - top - 70, c); A.r(sx + 16, top + 70, 10, fl - top - 70, c);
                    }
                    A.r(W - 60, fl - 40, 20, 40, '#8a4a5a'); A.ell(W - 50, fl - 44, 14, 10, '#4c9a3c');                     // a pot of basil by the step
                },
            },
            {
                cap: 'BASSEM\'S VILLA',
                text: '"One night job, and we are even." Bassem is polite, and terrifying.\n\nA truck brings a package from Cairo. Captain Zaki\'s dhow takes it out to a cargo ship offshore. The client is a Swiss foundation; their security chief is "a German woman who doesn\'t laugh."\n\n"Nobody opens the package."',
                draw(g, t, W, H) {
                    const A = pa(g), hz = Math.round(H * 0.42);
                    A.r(0, 0, W, hz, '#9ed2f4'); A.r(0, hz - 20, W, 20, '#c4e4f8');
                    A.r(0, hz, W, 60, '#2a8ab0'); A.hl(0, hz, W, '#58b8d8'); for (let i = 0; i < 14; i++) A.hl((hash2(i, 5) * W + t * 8) % W, hz + 6 + hash2(i, 6) * 50, 10, '#78cce4');
                    A.poly([[W - 140, hz], [W - 100, hz - 24], [W - 60, hz - 10], [W - 20, hz - 30], [W, hz - 22], [W, hz]], '#b890a0');
                    const ty = hz + 60; A.r(0, ty, W, H - ty, '#f0e4c6'); for (let x = 0; x < W; x += 24) A.r(x, ty, 1, H - ty, '#e0d4b0');   // the terrace
                    A.r(0, ty - 18, W, 4, '#fffaec'); for (let x = 6; x < W; x += 14) { A.r(x, ty - 14, 6, 14, '#fffaec'); A.vl(x + 5, ty - 14, 14, '#d6c29c'); }   // the balustrade
                    const cx = Math.round(W * 0.3), cy = ty + 10;                                                         // Bassem's chair, and Bassem, from behind
                    A.vl(cx + 44, cy - 110, 110, '#8e5e32'); A.poly([[cx - 10, cy - 100], [cx + 98, cy - 100], [cx + 80, cy - 118], [cx + 8, cy - 118]], '#c83828'); for (let k = 0; k < 4; k++) A.poly([[cx + 8 + k * 18, cy - 118], [cx + 17 + k * 18, cy - 118], [cx + 17 + k * 23, cy - 100], [cx - 10 + k * 27 + 9, cy - 100]], '#fffaec');
                    A.r(cx - 32, cy - 40, 64, 62, '#b8844c'); for (let k = cy - 38; k < cy + 22; k += 4) A.hl(cx - 30, k, 60, '#8e5e32'); for (let k = cx - 30; k < cx + 30; k += 6) A.vl(k, cy - 40, 62, '#d8a868');   // the wicker back
                    A.r(cx - 22, cy - 56, 44, 24, '#f4f4f0'); A.poly([[cx - 22, cy - 56], [cx - 30, cy - 44], [cx - 30, cy - 36], [cx - 22, cy - 36]], '#f4f4f0'); A.poly([[cx + 22, cy - 56], [cx + 30, cy - 44], [cx + 30, cy - 36], [cx + 22, cy - 36]], '#e4e4dc');   // his shoulders
                    A.vl(cx, cy - 54, 18, '#d8d8d0'); A.r(cx - 5, cy - 62, 10, 6, '#8a5a3a'); A.ell(cx, cy - 72, 11, 11, '#30242a'); A.ell(cx - 3, cy - 76, 4, 3, '#4a3a40');
                    A.r(cx + 60, cy - 10, 40, 6, '#fffaec'); A.r(cx + 78, cy - 4, 4, 24, '#d6c29c'); A.r(cx + 70, cy - 22, 7, 12, '#ffffff'); A.r(cx + 70, cy - 16, 7, 6, '#f0a030');   // a glass of juice
                    A.r(cx + 86, cy - 14, 10, 4, '#3a3e48');                                                              // his phone, face down
                },
            },
            { cap: 'MARSA TARFA', place: true, egyptian: true, text: 'Marsa Tarfa: fishing boats and smugglers\' boats, which are often the same boats, a reef, and the coast highway behind.\n\nYou can open a lock, halve a price, and dive a reef in the dark; none of the others can. {origin}\n\nThe truck comes at ten.' },
        ],
    },
    {
        id: 'journalist', only: 'The only camera that counts as proof (Photography 3). Best French, most money.', name: 'THE JOURNALIST', ready: false,
        place: 'Port Said  ·  the Suez Canal', lon: 32.3, lat: 31.26, chapter: '1-D',
        who: 'A foreign investigative reporter in their thirties. Stubborn, charming, allergic to being lied to.',
        hook: 'Three days ago Miriam emailed you: "If I stop answering, follow the Vasse shipments. Port Said, container VSSU 417882." She stopped answering. Your editor gave you a week.',
        skills: 'English · French 2 · Photography 3 · Investigation 2',
        gear: '12,000 EGP (expense account) · a camera · a press card',
        title: (n) => n,
        doc: { org: 'FOREIGN PRESS CENTRE, CAIRO', kind: 'PRESS CARD', col: '#c03828', seal: 'PRESS', rows: (n) => [['Name', n], ['Role', 'Reporter'], ['Assignment', 'Port Said'], ['Valid', 'One week']] },
        teaser: 'The old waterfront with its wooden balconies, the container port and the Canal. Only the Journalist ever sees it.',
        scenes: [
            {
                cap: 'THREE DAYS AGO',
                text: 'Years ago you interviewed Dr. Miriam Hale about looted antiquities. You hadn\'t heard from her since.\n\nThree days ago she emailed you. Then she stopped answering.',
                draw(g, t, W, H) {
                    const A = pa(g);
                    A.r(0, 0, W, H, '#141820'); for (let i = 0; i < 20; i++) A.hl(hash2(i, 71) * W, hash2(i, 72) * H, 30, '#1a1e28');
                    const w = Math.min(320, W - 40), h = H - 96, x = (W - w) >> 1, y = 12;
                    A.r(x - 8, y - 8, w + 16, h + 16, '#2a2e38'); A.r(x - 8, y - 8, w + 16, 2, '#4a4e5a'); A.r(x, y, w, h, '#f8f8f0');   // the laptop
                    A.r(x - 30, y + h + 8, w + 60, 8, '#3a3e48'); A.hl(x - 30, y + h + 8, w + 60, '#5a6272');
                    A.r(x, y, w, 14, '#2f5fae'); Txt.draw(g, 'INBOX', x + 8, y + 1, { col: '#ffffff' });
                    [['From', 'Miriam Hale'], ['Subject', '(no subject)']].forEach(([k, v], i) => { Txt.draw(g, k, x + 10, y + 20 + i * 13, { col: '#70707c' }); Txt.draw(g, v, x + 66, y + 20 + i * 13, { col: '#30302c' }); });
                    A.hl(x + 8, y + 47, w - 16, '#d8d8d0');
                    const msg = 'If I stop answering, follow the Vasse shipments. Port Said, container VSSU 417882. I\'m sorry.  — M.', shown = msg.slice(0, Math.floor(t * 30));
                    Txt.wrap(shown, w - 24).forEach((ln, i) => Txt.draw(g, ln, x + 12, y + 54 + i * 13, { col: '#30302c' }));
                    if ((t * 2 | 0) % 2) A.r(x + 12, y + h - 18, 6, 2, '#30302c');
                },
            },
            { cap: 'PORT SAID', place: true, text: 'Your editor, Claire, gave you a week and an expense account. The hotel is on the old waterfront, where the balconies are wood and the ships go by at eye level.\n\nYou speak French better than any of the others, and your camera is the only one whose pictures count as proof. You don\'t speak Arabic. Your stringer, Magdy Hanna, does.' },
        ],
    },
];
const bgOf = (id) => BACKGROUNDS.find(b => b.id === id) || BACKGROUNDS[0];
