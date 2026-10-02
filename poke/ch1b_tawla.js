// ============================================================
// THE CODEX OF GIZA — POKE STYLE: TAWLA (poke/ch1b_tawla.js)
// Backgammon as the café plays it, cut down to a quick race: four
// checkers each, two dice (doubles play four times), round the board and
// off. Land on a lone enemy checker and it goes back to the start; two or
// more on a point and you can't land there. All four home (the last six
// points) and you can bear off. First to bear off all four wins.
// SQ-01B-07 (the café champion) uses it; Madame Samira's café in Ch2 will too.
//   MINIS.tawla   opts: { name, skill (0..1: how well the other player plays) }
// ============================================================

const TAWLA_N = 4;
MINIS.tawla = {
    title: 'TAWLA',
    keys: 'SPACE: roll / move    ◄►: checker    ▲▼: which die    ESC: leave',
    howto: [
        'Backgammon, café style and cut short: four checkers each, round the board and off. First to bear off all four wins.',
        ['SPACE', 'Roll the dice, then move.'],
        ['◄ ►', 'Choose which checker to move.'],
        ['▲ ▼', 'Choose which die to use. Doubles play four times.'],
        'Land on a lone enemy checker and it goes back to the start. You can\'t land where they have two or more. Once all four of yours are in the last six points, you can bear off.',
    ],
    start(o) { return { me: Array(TAWLA_N).fill(0), him: Array(TAWLA_N).fill(0), dice: [], turn: 'me', phase: 'roll', sel: 0, die: 0, wait: 0.6, log: 'Your roll. SPACE.', roll: [1, 1], shake: 0, skill: o.skill != null ? o.skill : 0.6 }; },
    // board point (1..24) for a position on each side's path; 0 = waiting to come on, 25 = off
    pt(side, p) { return side === 'me' ? p : 25 - p; },
    home(S, side) { return S[side].every(p => p >= 19); },
    // where a checker would go with a die, or null
    dest(S, side, i, d) {
        const P = S[side], p = P[i]; if (p >= 25) return null;
        let n = p + d;
        if (n >= 25) { if (!this.home(S, side)) return null; n = 25; if (p + d > 25 && P.some((q, j) => j !== i && q < 25 && q < p)) return null; }   // (overshooting off only with the rearmost checker)
        if (n < 25) { const other = side === 'me' ? 'him' : 'me', b = this.pt(side, n), cnt = S[other].filter(q => q > 0 && q < 25 && this.pt(other, q) === b).length; if (cnt >= 2) return null; }
        return n;
    },
    movable(S, side, d) { const out = []; S[side].forEach((p, i) => { if (this.dest(S, side, i, d) != null && !out.some(j => S[side][j] === p)) out.push(i); }); return out; },
    move(S, side, i, d) {
        const n = this.dest(S, side, i, d), other = side === 'me' ? 'him' : 'me';
        S[side][i] = n;
        if (n < 25) { const b = this.pt(side, n); S[other].forEach((q, j) => { if (q > 0 && q < 25 && this.pt(other, q) === b) { S[other][j] = 0; S.log = side === 'me' ? 'You hit his checker! Back to the start.' : 'He hits you. Back to the start.'; Sfx.tone(160, 0.12, 'square', 0.06); } }); }
        else Sfx.tone(880, 0.08, 'triangle', 0.05);
        S.dice.splice(S.dice.indexOf(d), 1);
        Sfx.tone(520, 0.04, 'square', 0.03);
    },
    rollDice(S) { const a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6); S.roll = [a, b]; S.dice = a === b ? [a, a, a, a] : [a, b]; S.shake = 0.35; Sfx.tone(300, 0.05, 'square', 0.04); },
    anyMove(S, side) { return [...new Set(S.dice)].some(d => this.movable(S, side, d).length); },
    // the champion's choice: hit, bear off, make a point, get out of danger; a little luck-of-the-hand
    aiPick(S) {
        let best = null, bs = -1e9;
        for (const d of [...new Set(S.dice)]) for (const i of this.movable(S, 'him', d)) {
            const n = this.dest(S, 'him', i, d), b = n < 25 ? this.pt('him', n) : 0;
            let s = n * 0.3 + (Math.random() - 0.5) * (1 - S.skill) * 6;
            if (n === 25) s += 9;
            if (n < 25 && S.me.some(q => q > 0 && q < 25 && q === b)) s += 12;                                                    // a hit
            const mine = S.him.filter((q, j) => j !== i && q === n).length; if (n < 25 && mine) s += 4 * S.skill;                     // safe on a point
            if (n < 25 && !mine) { const danger = S.me.some(q => q < 25 && b - q >= 1 && b - q <= 6); if (danger) s -= 5 * S.skill; }  // a lone checker a roll away from you
            if (S.him[i] === 0) s += 2;
            if (s > bs) { bs = s; best = [i, d]; }
        }
        return best;
    },
    update(S, dt, I) {
        S.shake = Math.max(0, S.shake - dt);
        const done = side => S[side].every(p => p >= 25);
        if (S.turn === 'me') {
            if (S.phase === 'roll') { if (I.ok) { this.rollDice(S); S.phase = 'move'; S.die = 0; S.sel = 0; if (!this.anyMove(S, 'me')) { S.log = 'No move with ' + S.roll.join(' and ') + '. His turn.'; S.phase = 'pass'; S.wait = 1.2; } else S.log = 'Choose a checker (◄►) and a die (▲▼), then SPACE.'; } return; }
            if (S.phase === 'pass') { S.wait -= dt; if (S.wait <= 0) { S.turn = 'him'; S.phase = 'roll'; S.wait = 0.7; } return; }
            const U = [...new Set(S.dice)]; S.die = Math.min(S.die, U.length - 1);
            if (I.up || I.down) { S.die = (S.die + (I.up ? U.length - 1 : 1)) % U.length; S.sel = 0; Sfx.move(); }
            let M = this.movable(S, 'me', U[S.die]);
            if (!M.length) { const k = U.findIndex(d => this.movable(S, 'me', d).length); if (k >= 0) { S.die = k; M = this.movable(S, 'me', U[k]); } }
            if (M.length && I.left) { S.sel = (S.sel + M.length - 1) % M.length; Sfx.move(); } if (M.length && I.right) { S.sel = (S.sel + 1) % M.length; Sfx.move(); }
            S.sel = Math.min(S.sel, M.length - 1);
            if (I.ok && M.length) {
                this.move(S, 'me', M[S.sel], U[S.die]); S.sel = 0;
                if (done('me')) { Mini.finish({ ok: true, won: true }, 'The last checker comes off. The café, which has been pretending not to watch, breaks into noise.', 'YOU WIN'); return; }
                if (!S.dice.length || !this.anyMove(S, 'me')) { S.turn = 'him'; S.phase = 'roll'; S.wait = 0.8; S.log = 'His turn.'; }
            }
            return;
        }
        // his turn: a roll, then a move every half second
        S.wait -= dt; if (S.wait > 0) return;
        if (S.phase === 'roll') { this.rollDice(S); S.phase = 'move'; S.wait = 0.6; S.log = 'He rolls ' + S.roll.join(' and ') + '.'; return; }
        const pick = S.dice.length && this.aiPick(S);
        if (pick) { this.move(S, 'him', pick[0], pick[1]); S.wait = 0.5; if (done('him')) { Mini.finish({ ok: false, won: false }, 'His last checker clicks off the board. "Again?" he says, already setting up.', 'HE WINS'); } return; }
        S.turn = 'me'; S.phase = 'roll'; S.log = 'Your roll. SPACE.';
    },
    draw(S, g, A, VW, VH) {
        const W = 26, BAR = 14, bw = W * 12 + BAR, bh = 150, x0 = (VW - bw) >> 1, y0 = Math.max(26, ((VH - bh) >> 1) - 8);
        // the board: inlaid wood, mother-of-pearl, the points
        A.r(x0 - 10, y0 - 8, bw + 20, bh + 16, '#5e3620'); A.r(x0 - 8, y0 - 6, bw + 16, bh + 12, '#8e5630'); A.r(x0, y0, bw, bh, '#d8b888'); A.r(x0 + W * 6, y0, BAR, bh, '#5e3620');
        for (let i = 0; i < bw + 16; i += 6) { A.px(x0 - 8 + i, y0 - 4, '#f4ecd8'); A.px(x0 - 8 + i, y0 + bh + 3, '#f4ecd8'); }
        const colX = c => x0 + c * W + (c >= 6 ? BAR : 0);
        const ptX = b => colX(b <= 12 ? 12 - b : b - 13);
        for (let b = 1; b <= 24; b++) {
            const x = ptX(b), top = b > 12, col = b % 2 ? '#8a2c1c' : '#2c4a2c';
            if (top) A.poly([[x + 1, y0], [x + W - 1, y0], [x + W / 2, y0 + 60]], col); else A.poly([[x + 1, y0 + bh], [x + W - 1, y0 + bh], [x + W / 2, y0 + bh - 60]], col);
        }
        // checkers
        const stackAt = (b, side, list) => {
            const x = ptX(b) + W / 2, top = b > 12;
            list.forEach((i, k) => {
                if (k > 4) return;
                const y = top ? y0 + 10 + k * 12 : y0 + bh - 10 - k * 12, hl = S.turn === 'me' && S.phase === 'move' && side === 'me' && this._selIdx === i;
                A.ell(x, y, 10, 10, '#1c1410'); A.ell(x, y, 9, 9, side === 'me' ? '#f4ecd8' : '#2a2420'); A.ell(x - 2, y - 2, 4, 4, side === 'me' ? '#ffffff' : '#4a4038'); A.ell(x, y, 5, 5, side === 'me' ? '#e0d4b8' : '#3a322c');
                if (hl) { A.ell(x, y, 12, 12, '#f0c040'); A.ell(x, y, 11, 11, side === 'me' ? '#f4ecd8' : '#2a2420'); A.ell(x - 2, y - 2, 4, 4, '#ffffff'); }
            });
            if (list.length > 5) Txt.draw(g, 'x' + list.length, x, top ? y0 + 62 : y0 + bh - 74, { col: '#ffe890', shadow: '#1c1410', align: 'center' });
        };
        const U = [...new Set(S.dice)], M = S.turn === 'me' && S.phase === 'move' && U.length ? this.movable(S, 'me', U[Math.min(S.die, U.length - 1)]) : [];
        this._selIdx = M.length ? M[Math.min(S.sel, M.length - 1)] : -1;
        for (const side of ['me', 'him']) { const groups = {}; S[side].forEach((p, i) => { if (p > 0 && p < 25) (groups[this.pt(side, p)] = groups[this.pt(side, p)] || []).push(i); }); for (const b in groups) stackAt(+b, side, groups[b]); }
        // waiting to come on, and off the board
        const tray = (side, x, y, what) => { const n = S[side].filter(what).length; for (let k = 0; k < n; k++) { A.ell(x, y + k * 8, 8, 4, '#1c1410'); A.ell(x, y + k * 8 - 1, 7, 3, side === 'me' ? '#f4ecd8' : '#2a2420'); } };
        tray('me', x0 + bw + 22, y0 + bh - 40, p => p === 0); tray('him', x0 - 22, y0 + 10, p => p === 0);
        tray('me', x0 + bw + 22, y0 + 10, p => p >= 25); tray('him', x0 - 22, y0 + bh - 40, p => p >= 25);
        Txt.draw(g, 'START', x0 + bw + 22, y0 + bh - 54, { col: '#8898d0', align: 'center' }); Txt.draw(g, 'OFF', x0 + bw + 22, y0 - 4 - 10, { col: '#8898d0', align: 'center' });
        // the selected checker's destination
        if (this._selIdx >= 0) { const n = this.dest(S, 'me', this._selIdx, U[Math.min(S.die, U.length - 1)]); if (n != null && n < 25) { const b = n, x = ptX(b) + W / 2, top = b > 12, y = top ? y0 + 66 : y0 + bh - 66; A.poly([[x - 4, y - 3], [x + 4, y - 3], [x, y + 3]].map(([a, c]) => [a, top ? c : 2 * y - c]), '#f0c040'); } }
        // the dice
        const dx = x0 + W * 6 + BAR / 2, dy = y0 + bh / 2;
        S.roll.forEach((v, k) => {
            const x = dx - 22 + k * 30 + (S.shake ? Math.round(Math.sin(S.t * 60 + k) * 2) : 0), y = dy - 9, used = S.turn === 'me' && S.phase === 'move' && !S.dice.includes(v), on = S.turn === 'me' && U[Math.min(S.die, U.length - 1)] === v && S.phase === 'move';
            A.r(x - 1, y - 1, 16, 16, on ? '#f0c040' : '#1c1410'); A.r(x, y, 14, 14, used ? '#b8b0a0' : '#fffaf0');
            const P = { 1: [[7, 7]], 2: [[4, 4], [10, 10]], 3: [[4, 4], [7, 7], [10, 10]], 4: [[4, 4], [10, 4], [4, 10], [10, 10]], 5: [[4, 4], [10, 4], [7, 7], [4, 10], [10, 10]], 6: [[4, 3], [10, 3], [4, 7], [10, 7], [4, 11], [10, 11]] }[v];
            for (const [a, c] of P) A.r(x + a - 1, y + c - 1, 2, 2, '#1c1410');
        });
        if (S.dice.length === 4 || (S.dice.length > 2)) Txt.draw(g, 'DOUBLES', dx, dy + 12, { col: '#ffe890', shadow: '#1c1410', align: 'center' });
        Txt.draw(g, S.log, VW >> 1, y0 + bh + 12, { col: '#ffffff', shadow: '#101838', align: 'center' });
        Txt.draw(g, 'YOU: white', x0 + bw - 2, 8, { col: '#f4ecd8', align: 'right' });
    },
};
