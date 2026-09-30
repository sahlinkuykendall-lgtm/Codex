// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MUSIC (poke/music.js)
// Little chiptune loops, synthesised on the fly (no files): a square-wave
// lead, a triangle bass, soft arpeggios and a darbuka (doum and tak).
// Most tunes are in maqam Hijaz (D Eb F# G A Bb C) or a minor Nahawand.
//   title  the title screen and the chapter-end card
//   camp   the camp by day (and the minigames)
//   night  the camp by night (most of the story happens here)
//   room   indoors
//   shaft  down the Osiris Shaft: a drone, a slow line, water dripping
//   radio_tarab, radio_shaabi  the workers' shortwave radio, turned up (60 seconds, near it only):
//          through an old radio's tinny speaker. Tarab in maqam Bayati, with its
//          quarter-tone E (written e~), strings and a qanun; a Saidi wedding band.
// Music.tick() runs every frame from Game.update: it picks the tune for
// where you are, fades between tunes and schedules notes a little ahead.
// ============================================================

// a pattern is one token per step (an eighth note): a note ('d5', 'eb4', 'f#3', 'e~4' a quarter tone flat), '-' to hold, '.' for rest
const NOTE_IX = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
function midi(tok) { const m = /^([a-g])(#|b|~)?(\d)$/.exec(tok); return m ? 12 * (+m[3] + 1) + NOTE_IX[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : m[2] === '~' ? -0.5 : 0) : null; }
const hz = n => 440 * Math.pow(2, (n - 69) / 12);
const pat = s => s.trim().split(/\s+/).filter(t => t !== '|');
// an arpeggio for a list of chords ('d', 'gm', 'eb' …), one bar of eight steps each: root, fifth, octave, third
function arp(chords, oct) {
    return chords.map(c => {
        const m = /^([a-g])(#|b)?(m?)$/.exec(c), r = midi(m[1] + (m[2] || '') + (oct || 3)), third = r + (m[3] ? 3 : 4);
        const nm = n => { const names = ['c', 'c#', 'd', 'eb', 'e', 'f', 'f#', 'g', 'ab', 'a', 'bb', 'b']; return names[n % 12] + (Math.floor(n / 12) - 1); };
        return [nm(r), '.', nm(r + 7), '.', nm(r + 12), '.', nm(third + 12), '.'].join(' ');
    }).join(' ');
}
const bassOf = (chords, style) => chords.map(c => { const m = /^([a-g])(#|b)?/.exec(c), n = m[1] + (m[2] || ''); return style === 'long' ? `${n}2 - - - - - - -` : style === 'half' ? `${n}2 - - - ${n}3 - - -` : `${n}2 . ${n}3 . ${n}2 . ${n}3 .`; }).join(' ');

const TUNES = {
    title: {
        bpm: 76,
        lead: pat(`d4 - - - a4 - - - | bb4 - a4 - g4 - f#4 - | g4 - - - eb4 - - - | d4 - - - - - - -
                   d5 - - - c5 - bb4 - | a4 - - - g4 - a4 - | bb4 - a4 g4 f#4 - eb4 - | d4 - - - - - . .`),
        bass: pat(bassOf(['d', 'gm', 'eb', 'd', 'gm', 'c', 'eb', 'd'], 'long')),
        arp: pat(arp(['d', 'gm', 'eb', 'd', 'gm', 'c', 'eb', 'd'])),
        drum: pat('D . . . . . t . '.repeat(8)),
        vol: { lead: 1, bass: 1, arp: 0.5, drum: 0.6 },
    },
    camp: {
        bpm: 112,
        lead: pat(`d5 - eb5 f#5 g5 - f#5 eb5 | d5 - - . a4 - d5 - | eb5 - f#5 g5 a5 - g5 f#5 | g5 - f#5 eb5 d5 - - .
                   a5 - bb5 a5 g5 - f#5 g5 | a5 - g5 f#5 eb5 - d5 eb5 | f#5 - g5 f#5 eb5 - d5 c5 | d5 - - - . . . .
                   g4 - bb4 - d5 - c5 bb4 | a4 - - - g4 - a4 bb4 | c5 - bb4 a4 bb4 - a4 g4 | f#4 - g4 a4 d4 - - .
                   d5 - c5 bb4 a4 - bb4 c5 | d5 - eb5 d5 c5 - bb4 a4 | bb4 a4 g4 f#4 g4 - a4 - | d4 - - - . . . .`),
        bass: pat(bassOf(['d', 'd', 'eb', 'd', 'gm', 'eb', 'c', 'd', 'gm', 'd', 'cm', 'd', 'gm', 'c', 'gm', 'd'])),
        arp: pat(arp(['d', 'd', 'eb', 'd', 'gm', 'eb', 'c', 'd', 'gm', 'd', 'cm', 'd', 'gm', 'c', 'gm', 'd'], 4)),
        drum: pat('D T . T D . T . '.repeat(16)),                      // maqsum
        vol: { lead: 1, bass: 1, arp: 0.35, drum: 1 },
    },
    night: {
        bpm: 80,
        lead: pat(`a4 - - c5 e5 - - - | d5 - c5 b4 c5 - - - | a4 - - e4 f4 - e4 - | g#4 - - - . . . .
                   a4 - - c5 e5 - a5 - | g#5 - f5 e5 d5 - - - | c5 - b4 a4 b4 - g#4 - | a4 - - - . . . .
                   e5 - - d5 c5 - b4 - | c5 - a4 - - - . . | f5 - e5 d5 e5 - c5 - | b4 - - - g#4 - - -
                   a4 - c5 - e5 - a5 - | g#5 - - e5 f5 - d5 - | e5 - c5 b4 a4 - g#4 - | a4 - - - - - . .`),
        bass: pat(bassOf(['a', 'd', 'a', 'e', 'a', 'd', 'e', 'a', 'a', 'f', 'd', 'e', 'a', 'd', 'e', 'a'], 'half')),
        arp: pat(arp(['am', 'dm', 'am', 'e', 'am', 'dm', 'e', 'am', 'am', 'f', 'dm', 'e', 'am', 'dm', 'e', 'am'])),
        drum: pat('D . . t . . t . '.repeat(16)),
        lead_i: 'bell', vol: { lead: 0.9, bass: 0.8, arp: 0.4, drum: 0.45 },
    },
    room: {
        bpm: 96,
        lead: pat(`c5 . e5 g5 f5 . e5 d5 | e5 - c5 . g4 - . . | a4 . c5 f5 e5 . d5 c5 | d5 - - . . . . .
                   c5 . e5 g5 a5 . g5 f5 | bb5 . a5 g5 f5 . e5 d5 | e5 . d5 c5 d5 . bb4 d5 | c5 - - . . . . .`),
        bass: pat(bassOf(['c', 'c', 'f', 'g', 'c', 'bb', 'g', 'c'])),
        arp: pat(arp(['c', 'c', 'f', 'g', 'c', 'bb', 'g', 'c'], 4)),
        drum: pat('. . t . . . t . '.repeat(8)),
        lead_i: 'pluck', vol: { lead: 1, bass: 0.8, arp: 0.3, drum: 0.4 },
    },
    shaft: {
        bpm: 60,
        lead: pat(`d4 - - - - - - - | eb4 - - - - - - - | f#4 - - - - - - - | eb4 - - - - - - -
                   d4 - - - - - - - | a3 - - - - - - - | bb3 - - - a3 - - - | d4 - - - - - - -`),
        bass: pat('d2 - - - - - - - '.repeat(8)),
        drum: pat('D . . . . . . . '.repeat(8)),
        lead_i: 'bell', drip: true, vol: { lead: 0.7, bass: 1, drum: 0.5 },
    },
    radio_tarab: {
        bpm: 72, radio: true,
        lead: pat(`d4 - - - e~4 - f4 - | g4 - - - f4 e~4 d4 - | c4 - d4 - e~4 - f4 - | e~4 - - - d4 - - -
                   a4 - - - bb4 a4 g4 - | f4 - g4 - a4 - - - | g4 f4 e~4 f4 g4 - f4 e~4 | d4 - - - - - . .
                   d5 - - c5 bb4 - a4 - | bb4 - c5 - d5 - - - | c5 bb4 a4 g4 a4 - - - | g4 - f4 e~4 f4 - - -
                   g4 - a4 - bb4 a4 g4 f4 | e~4 - f4 - g4 - - - | f4 e~4 d4 c4 e~4 - d4 - | d4 - - - - - . .`),
        bass: pat(bassOf(['d', 'g', 'c', 'd', 'g', 'f', 'c', 'd', 'bb', 'bb', 'f', 'c', 'g', 'c', 'c', 'd'], 'long')),
        arp: pat(arp(['dm', 'gm', 'c', 'dm', 'gm', 'f', 'c', 'dm', 'bb', 'bb', 'f', 'c', 'gm', 'c', 'c', 'dm'], 4)),
        drum: pat('D . . t . t T . '.repeat(16)),                    // wahda
        lead_i: 'strings', arp_i: 'qanun', vol: { lead: 1, bass: 0.7, arp: 0.9, drum: 0.7 },
    },
    radio_shaabi: {
        bpm: 126, radio: true,
        lead: pat(`g4 ab4 b4 c5 d5 - c5 b4 | ab4 - g4 - - - . . | c5 d5 eb5 d5 c5 - b4 ab4 | b4 - c5 - g4 - - .
                   d5 - eb5 d5 c5 b4 c5 - | ab4 b4 c5 b4 ab4 - g4 - | f4 g4 ab4 g4 f4 - eb4 f4 | g4 - - - . . . .`),
        bass: pat(bassOf(['g', 'g', 'c', 'g', 'g', 'ab', 'f', 'g'])),
        arp: pat(arp(['g', 'g', 'cm', 'g', 'g', 'ab', 'fm', 'g'], 4)),
        drum: pat('D T . D D . T . '.repeat(8)),                     // saidi
        lead_i: 'reed', vol: { lead: 1, bass: 1, arp: 0.3, drum: 1.1 },
    },
};

const Music = {
    cur: null, want: null, gain: null, level: -1, next: 0, step: 0, fadeTo: 0, noise: null, dripT: 0,
    radio: null,                                                       // { tune, until, map, x, y }: a radio turned up (Music.playRadio)
    radioIn: null,                                                     // (the old speaker: a band-pass the radio tunes go through)
    playRadio(tune, e) { this.radio = { tune, until: Game.time + 60, map: Game.map.key, x: e.x + (e.w || 0) / 2, y: e.y + (e.d || 0), told: false }; },
    radioNear() {                                                      // how loud the radio is where you stand (0: out of earshot)
        const R = this.radio, G = Game; if (!R || G.map.key !== R.map) return 0;
        if (G.time > R.until) { if (!R.told) { R.told = true; Toast.show('The song ends. The radio drifts back to static.'); } return 0; }
        const d = Math.hypot(G.player.x - R.x, G.player.y - R.y) / TILE; return d > 10 ? 0 : d < 4 ? 1 : Math.max(0.25, Math.round((1 - (d - 4) / 6) * 4) / 4);
    },
    out() { return TUNES[this.cur] && TUNES[this.cur].radio && this.radioIn ? this.radioIn : this.gain; },
    ctx() { const ac = Sfx.ac; return ac && ac.state === 'running' ? ac : null; },
    target() {
        const G = Game;
        if (EndCard.open || G.state !== 'play' || !G.map) return 'title';
        if (Mini.cur) return 'camp';
        if (this.radioNear() > 0) return this.radio.tune;
        if (G.map.dark) return 'shaft';
        if (!G.map.outdoor) return 'room';
        return G.light().dark > 0.5 ? 'night' : 'camp';
    },
    tick() {
        const ac = this.ctx(); if (!ac) return;
        if (!this.gain) { this.gain = ac.createGain(); this.gain.gain.value = 0.0001; this.gain.connect(ac.destination); }
        if (!this.radioIn) { const hp = ac.createBiquadFilter(), lp = ac.createBiquadFilter(), boost = ac.createGain(); hp.type = 'highpass'; hp.frequency.value = 420; lp.type = 'lowpass'; lp.frequency.value = 2600; lp.Q.value = 3; boost.gain.value = 1.8; hp.connect(lp); lp.connect(boost); boost.connect(this.gain); this.radioIn = hp; }
        let lv = [0, 0.45, 1, 1.7][Game.set.music != null ? Game.set.music : 2] * 0.9;
        const t = ac.currentTime;
        if (this.cur && TUNES[this.cur].radio) lv *= this.radioNear() || 1;          // (the radio's louder the closer you are)
        const want = lv > 0 ? this.target() : null;
        if (want !== this.cur && !this.fadeTo) {                          // fade out what's playing, then start the new one
            this.gain.gain.cancelScheduledValues(t); this.gain.gain.setValueAtTime(Math.max(0.0001, this.gain.gain.value), t); this.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
            this.fadeTo = t + 0.72; this.want = want;
        }
        if (this.fadeTo) {
            if (t < this.fadeTo) return;
            this.fadeTo = 0; this.cur = this.want; this.step = 0; this.next = t + 0.05; this.level = -1;
            if (!this.cur) return;
        }
        if (!this.cur) return;
        if (lv !== this.level) { this.level = lv; this.gain.gain.cancelScheduledValues(t); this.gain.gain.setValueAtTime(Math.max(0.0001, this.gain.gain.value), t); this.gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, lv), t + 0.5); }
        const T = TUNES[this.cur], dur = 60 / T.bpm / 2;
        if (this.next < t - 0.5) this.next = t + 0.05;                  // (after a stall: pick up from now, don't rush to catch up)
        while (this.next < t + 0.25) {
            for (const ch of ['lead', 'bass', 'arp', 'drum']) {
                const P = T[ch]; if (!P) continue;
                const tok = P[this.step % P.length];
                if (ch === 'drum') { if (tok !== '.') this.drum(ac, tok, this.next, (T.vol[ch] || 1)); continue; }
                const n = midi(tok); if (n == null) continue;
                let len = 1; while (len < P.length && P[(this.step + len) % P.length] === '-') len++;
                this.note(ac, ch === 'lead' ? (T.lead_i || 'lead') : ch === 'arp' ? (T.arp_i || 'arp') : ch, hz(n), this.next, len * dur, T.vol[ch] || 1);
            }
            if (T.radio && Math.random() < 0.03) this.drum(ac, 'x', this.next + Math.random() * dur, 0.5);   // (static crackles on the shortwave)
            if (T.drip && Math.random() < 0.06) this.note(ac, 'drip', hz(88 + Math.floor(Math.random() * 8)), this.next + Math.random() * dur, 0.08, 1);
            this.step++; this.next += dur;
        }
    },
    note(ac, inst, f, t, len, vol) {
        const o = ac.createOscillator(), g = ac.createGain();
        const I = { lead: ['square', 0.028, 0.01, 0.75], bell: ['triangle', 0.06, 0.005, 0.0], pluck: ['triangle', 0.07, 0.005, 0.0], bass: ['triangle', 0.07, 0.01, 0.8], arp: ['square', 0.012, 0.005, 0.0], drip: ['sine', 0.03, 0.002, 0.0],
            strings: ['sawtooth', 0.026, 0.09, 0.85], reed: ['square', 0.026, 0.012, 0.85], qanun: ['triangle', 0.05, 0.003, 0.0] }[inst];
        const dest = this.out();
        o.type = I[0]; o.frequency.setValueAtTime(f, t);
        const peak = I[1] * vol, end = t + len;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + I[2]);
        if (I[3] > 0) { g.gain.exponentialRampToValueAtTime(peak * I[3], t + 0.08); g.gain.setValueAtTime(peak * I[3], Math.max(t + 0.08, end - 0.05)); g.gain.exponentialRampToValueAtTime(0.0001, end); }
        else g.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(inst === 'bell' ? 1.4 : inst === 'arp' ? 0.25 : inst === 'qanun' ? 0.7 : 0.5, len + 0.6));
        let out = g;
        const LP = { lead: 2400, arp: 1500, strings: 1700, reed: 2900 }[inst];
        if (LP) { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = LP; g.connect(lp); out = lp; }
        if (inst === 'strings' || inst === 'reed') {                     // vibrato: a violin section's, or a mizmar's quick shake
            const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = inst === 'reed' ? 7 : 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * (inst === 'reed' ? 0.012 : 0.009), t + 0.25);
            lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(end + 1.5);
        }
        if (inst === 'qanun' && len > 0.2) { const o3 = ac.createOscillator(), g3 = ac.createGain(); o3.type = 'triangle'; o3.frequency.setValueAtTime(f, t + 0.09); g3.gain.setValueAtTime(0.0001, t); g3.gain.setValueAtTime(peak * 0.6, t + 0.09); g3.gain.exponentialRampToValueAtTime(0.0001, t + 0.5); o3.connect(g3); g3.connect(dest); o3.start(t + 0.09); o3.stop(t + 0.55); }   // (the qanun's plectrum picks twice)
        if (inst === 'bell') { const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.type = 'sine'; o2.frequency.setValueAtTime(f * 2, t); g2.gain.setValueAtTime(peak * 0.35, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.8); o2.connect(g2); g2.connect(dest); o2.start(t); o2.stop(t + 0.85); }
        o.connect(g); out.connect(dest);
        o.start(t); o.stop(end + 1.5);
    },
    drum(ac, k, t, vol) {
        if (k === 'D') {                                                   // doum: a deep thump, the skin's pitch falling
            const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.16);
            g.gain.setValueAtTime(0.11 * vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22); o.connect(g); g.connect(this.out()); o.start(t); o.stop(t + 0.25);
            return;
        }
        if (!this.noise) { const n = ac.sampleRate * 0.2, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.noise = b; }
        const s = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain();   // tak: a sharp slap at the rim
        s.buffer = this.noise; bp.type = 'bandpass'; bp.frequency.value = k === 'x' ? 1400 : 2600; bp.Q.value = k === 'x' ? 0.6 : 1.2;
        g.gain.setValueAtTime((k === 'T' ? 0.07 : k === 'x' ? 0.02 : 0.035) * vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + (k === 'x' ? 0.12 : 0.06));
        s.connect(bp); bp.connect(g); g.connect(this.out()); s.start(t); s.stop(t + 0.14);
    },
};
// browsers only let sound start after a key or a click: wake the audio then
for (const ev of ['keydown', 'pointerdown']) window.addEventListener(ev, () => { const ac = Sfx.ctx(); if (ac && ac.state === 'suspended') ac.resume(); });
