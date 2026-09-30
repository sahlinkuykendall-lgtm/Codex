// ============================================================
// THE CODEX OF GIZA — NARRATION (narration.js)
// Reads the text boxes aloud with the browser's own voices (the Web
// Speech API; no files to download). The narrator reads the prose; when a
// character's line has "quoted speech", the quotes are spoken in that
// character's voice. Each character has a voice, a pitch and a speed,
// all changeable in SETTINGS → VOICES, with a ▶ button to hear them.
//
// Voices come from the browser and the computer:
//   - Microsoft Edge has the most natural ones ("Online (Natural)")
//   - Chrome adds a few Google voices
//   - Windows voices can be added in Settings → Time & Language → Speech
// Loaded last (wraps startDialogue / closeDialogue).
// ============================================================

// The cast: who can be given a voice. `names` are the speaker names the
// story uses for them; g is m/f (for picking a default voice); pitch and
// rate are their defaults; `line` is what they say when you test them.
const NARR_CAST = [
    { id: 'narrator', label: 'Narrator', names: ['System', 'Bosta'], g: 'm', pitch: 1, rate: 1, line: 'The wind drops, and for a moment you can hear the generator, and the men laughing at the fire.' },
    { id: 'rais', label: 'Rais Abdallah', names: ['Rais Abdallah', 'The Rais'], g: 'm', pitch: 0.8, rate: 0.88, line: 'Forty men. Eleven days. I am not asking you to pay. I am telling you what she did.' },
    { id: 'lindqvist', label: 'Dr. Lindqvist', names: ['Dr. Lindqvist'], g: 'm', pitch: 1.05, rate: 1.08, line: 'Friday. The transfer is coming Friday. Geneva is slow.' },
    { id: 'hana', label: 'Hana', names: ['Hana'], g: 'f', pitch: 1.05, rate: 1, line: 'The statuette came out of Trench B, before Miriam backfilled it.' },
    { id: 'farouk', label: 'Uncle Farouk', names: ['Uncle Farouk'], g: 'm', pitch: 0.72, rate: 0.85, line: 'Farouk sees everything, and tells nothing, unless you are polite.' },
    { id: 'saber', label: 'Saber', names: ['Saber'], g: 'm', pitch: 1.45, rate: 1.15, line: 'You hold the pot high, like this. High! Now it has foam.' },
    { id: 'hamid', label: 'Uncle Hamid', names: ['Uncle Hamid'], g: 'm', pitch: 0.85, rate: 0.95, line: 'The train goes round the loop. Always forward. Never backwards.' },
    { id: 'gamal', label: 'Gamal', names: ['Gamal'], g: 'm', pitch: 0.95, rate: 1, line: 'Night shift. Somebody has to watch the spoil heaps.' },
    { id: 'sayed', label: 'Hagg Sayed', names: ['Hagg Sayed'], g: 'm', pitch: 0.75, rate: 0.9, line: 'My horse against yours. To the old tomb and back.' },
    { id: 'lena', label: 'Lena Brandt', names: ['Lena Brandt', 'The Woman in Black'], g: 'f', pitch: 0.9, rate: 0.95, line: 'Goodnight. Try to sleep. It is a very quiet desert.' },
    { id: 'amira', label: 'Dr. Amira Sayed', names: ['Dr. Amira Sayed', 'Amira'], g: 'f', pitch: 1, rate: 1.02, line: 'The Ministry would like a word, when you have a moment.' },
    { id: 'oldwoman', label: 'The Old Woman', names: ['An Old Woman'], g: 'f', pitch: 0.7, rate: 0.82, line: 'The sheikh keeps the ones who ask him politely.' },
    { id: 'men', label: 'Other men', names: [], g: 'm', pitch: 0.95, rate: 1, line: 'The Rais said. We come with you.' },
    { id: 'women', label: 'Other women', names: [], g: 'f', pitch: 1, rate: 1, line: 'Tea? There is always tea.' },
];
// speakers the story uses for women; anyone else unlisted is "Other men"
const NARR_WOMEN = /\b(woman|women|lady|girl|mother|sister|helena|maren|yusra|lei|amira|hana|lena)\b/i;

// Voice names that tell us who's speaking (Microsoft, Google and Windows voices)
const NARR_MALE = /\b(male|david|mark|guy|davis|tony|jason|christopher|eric|roger|steffan|andrew|brian|ryan|thomas|william|prabhat|liam|connor|james|george|daniel|fred|alex|aaron|ken|mitchell|abeo|chilemba|elimu|sam)\b/i;
const NARR_FEMALE = /\b(female|zira|hazel|susan|aria|jenny|michelle|ana|emma|ava|sonia|libby|maisie|natasha|clara|neerja|molly|emily|leah|luna|nancy|sara|jane|samantha|karen|moira|tessa|fiona|victoria|ezinne|asilia|imani|yan|rosa)\b/i;

const NARR = { voices: [], queue: [], on: false };

function narrVoices() {
    if (!('speechSynthesis' in window)) return [];
    const all = speechSynthesis.getVoices();
    // English voices only (a voice for another language reads English badly); the best first
    const en = all.filter(v => /^en(-|_|$)/i.test(v.lang));
    const score = v => (/natural|neural|online/i.test(v.name) ? 0 : /google/i.test(v.name) ? 1 : 2);
    return (en.length ? en : all).slice().sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name));
}
function narrGender(v) { return NARR_FEMALE.test(v.name) ? 'f' : NARR_MALE.test(v.name) ? 'm' : '?'; }

// The default voice for a cast member: a voice of their gender, spread
// across the cast so neighbours sound different (steady per character)
function narrDefaultVoice(c) {
    const vs = NARR.voices;
    if (!vs.length) return null;
    let pool = vs.filter(v => narrGender(v) === c.g);
    if (!pool.length) pool = vs.filter(v => narrGender(v) === '?');
    if (!pool.length) pool = vs;
    const best = pool.filter(v => /natural|neural|online/i.test(v.name));
    if (best.length) pool = best;
    const idx = NARR_CAST.filter(x => x.g === c.g).indexOf(c);
    return pool[Math.max(0, idx) % pool.length];
}

function narrSettings() {
    const s = getSettings();
    if (!s.voiceCast || typeof s.voiceCast !== 'object') s.voiceCast = {};
    return s;
}
// The voice, pitch and speed for a cast member (the player's choice, else the default)
function narrProfile(c) {
    const s = narrSettings(), p = s.voiceCast[c.id] || {};
    const voice = (p.voice && NARR.voices.find(v => v.name === p.voice)) || narrDefaultVoice(c);
    return { voice, pitch: p.pitch != null ? p.pitch : c.pitch, rate: (p.rate != null ? p.rate : c.rate) * (s.narrRate || 1) };
}
function narrCastFor(speaker) {
    if (!speaker || speaker === 'System') return NARR_CAST[0];
    const c = NARR_CAST.find(x => x.names.includes(speaker));
    if (c) return c;
    return NARR_WOMEN.test(speaker) ? NARR_CAST.find(x => x.id === 'women') : NARR_CAST.find(x => x.id === 'men');
}

// Make the text sayable: dashes as pauses, no stage symbols
function narrClean(t) {
    return String(t).replace(/\s*[—–]\s*/g, ', ').replace(/,\s*([,.!?…])/g, '$1').replace(/[*_•#]/g, ' ').replace(/\.\.\./g, '…').replace(/\s+/g, ' ').trim();
}
// Chrome's online voices stop after ~15 s, so long passages go in sentence-sized pieces
function narrChunks(t) {
    const out = [];
    for (const s of t.match(/[^.!?…]+[.!?…]*["']?\s*/g) || [t]) {
        const last = out[out.length - 1];
        if (last && last.length + s.length < 180) out[out.length - 1] = last + s;
        else out.push(s);
    }
    return out.map(s => s.trim()).filter(s => /\w/.test(s));
}

// Split a text box into narrator / character parts and queue them
function narrSay(speaker, text) {
    narrStop();
    const s = narrSettings();
    if (!s.narration || !('speechSynthesis' in window) || !text) return;
    const who = narrCastFor(speaker), narrator = NARR_CAST[0];
    const parts = [];
    const raw = String(text);
    if (who === narrator || raw.indexOf('"') < 0) parts.push([who, raw]);          // all prose, or all speech
    else raw.split('"').forEach((seg, i) => parts.push([i % 2 ? who : narrator, seg]));
    for (const [c, seg] of parts) for (const chunk of narrChunks(narrClean(seg))) narrQueue(c, chunk);
}
function narrQueue(c, str) {
    const p = narrProfile(c), s = narrSettings();
    const u = new SpeechSynthesisUtterance(str);
    if (p.voice) { u.voice = p.voice; u.lang = p.voice.lang; }
    u.pitch = Math.max(0.1, Math.min(2, p.pitch));
    u.rate = Math.max(0.5, Math.min(2, p.rate));
    u.volume = Math.max(0, Math.min(1, (s.narrVol != null ? s.narrVol : 1) * (s.masterVol != null ? s.masterVol : 1)));
    speechSynthesis.speak(u);
}
function narrStop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }

// ---- hook the text boxes ----
(function () {
    Object.assign(SETTINGS_DEFAULTS, { narration: true, narrVol: 0.9, narrRate: 1 });
    const s = getSettings();
    for (const k of ['narration', 'narrVol', 'narrRate']) if (s[k] === undefined) s[k] = SETTINGS_DEFAULTS[k];

    const load = () => { NARR.voices = narrVoices(); if (settingsOpen() && settingsTab === 'voices') renderSettings(); };
    if ('speechSynthesis' in window) {
        load();
        speechSynthesis.addEventListener ? speechSynthesis.addEventListener('voiceschanged', load) : (speechSynthesis.onvoiceschanged = load);
    }

    const _start = startDialogue;
    startDialogue = function (id) {
        _start.apply(this, arguments);
        const sc = storyData[id];
        if (!sc || !gameState.isDialogueActive) return;
        try {
            const speaker = document.getElementById('speaker-name').textContent;     // (innerText comes back in the style's capitals)
            // the typewriter (cine3d.js) empties the box and keeps the whole line
            const text = (typeof CINE !== 'undefined' && CINE.type && CINE.type.full) || document.getElementById('dialogue-text').textContent;
            narrSay(speaker, text);
        } catch (e) { /* narration never breaks the game */ }
    };
    const _close = closeDialogue;
    closeDialogue = function () { narrStop(); return _close.apply(this, arguments); };
    window.addEventListener('beforeunload', narrStop);
    // switching narration off stops it mid-sentence
    const _set = setSetting;
    setSetting = function (key, value) { if (key === 'narration' && !value) narrStop(); return _set.apply(this, arguments); };
})();

// ============================================================
// SETTINGS → VOICES
// ============================================================
SETTINGS_TABS.push({ id: 'voices', label: 'VOICES', rows: [
    { key: 'narration', label: 'Narration', type: 'toggle', help: 'Read the text boxes aloud. The narrator reads the story; characters speak their own lines.' },
    { key: 'narrVol', label: 'Narration volume', type: 'range', min: 0, max: 1, step: 0.05, fmt: v => Math.round(v * 100) + '%' },
    { key: 'narrRate', label: 'Narration speed', type: 'range', min: 0.6, max: 1.6, step: 0.05, fmt: v => v.toFixed(2) + '×' },
]});

(function () {
    const _render = renderSettings;
    renderSettings = function () {
        _render.apply(this, arguments);
        if (settingsTab !== 'voices') return;
        const body = document.getElementById('settings-body');
        const s = narrSettings();
        NARR.voices = narrVoices();

        const info = document.createElement('div');
        info.className = 'narr-info';
        info.innerHTML = !('speechSynthesis' in window)
            ? 'This browser can\'t speak. Try Microsoft Edge or Chrome.'
            : `<b>${NARR.voices.length}</b> English voice${NARR.voices.length === 1 ? '' : 's'} on this browser.` +
              (NARR.voices.some(v => /natural|online/i.test(v.name)) ? '' : ' For more natural voices, play in <b>Microsoft Edge</b>, or add voices in Windows: Settings → Time &amp; Language → Speech → Add voices (then restart the browser).');
        body.appendChild(info);

        const list = document.createElement('div');
        list.className = 'narr-cast';
        for (const c of NARR_CAST) {
            const p = narrProfile(c), mine = s.voiceCast[c.id] || {};
            const row = document.createElement('div');
            row.className = 'narr-row';
            const name = document.createElement('div');
            name.className = 'narr-name';
            name.textContent = c.label;
            row.appendChild(name);

            const sel = document.createElement('select');
            sel.className = 'narr-select';
            for (const v of NARR.voices) {
                const o = document.createElement('option');
                o.value = v.name;
                o.textContent = v.name.replace(/^(Microsoft|Google)\s+/, '').replace(/\s*-\s*English\s*/, ' — ').replace(/\(Natural\)/, '★');
                if (p.voice && v.name === p.voice.name) o.selected = true;
                sel.appendChild(o);
            }
            sel.onchange = () => { s.voiceCast[c.id] = Object.assign({}, mine, { voice: sel.value }); saveSettings(); narrTest(c); };
            row.appendChild(sel);

            const pitch = document.createElement('input');
            pitch.type = 'range'; pitch.min = 0.5; pitch.max = 1.6; pitch.step = 0.05;
            pitch.value = p.pitch;
            pitch.title = 'Pitch';
            pitch.className = 'narr-pitch';
            pitch.onchange = () => { s.voiceCast[c.id] = Object.assign({}, s.voiceCast[c.id] || {}, { pitch: Number(pitch.value) }); saveSettings(); narrTest(c); };
            const pl = document.createElement('span');
            pl.className = 'narr-lab'; pl.textContent = 'pitch';
            row.appendChild(pl);
            row.appendChild(pitch);

            const test = document.createElement('button');
            test.className = 'narr-test';
            test.textContent = '▶';
            test.title = 'Hear ' + c.label;
            test.onclick = () => { uiClick(); narrTest(c); };
            row.appendChild(test);
            list.appendChild(row);
        }
        body.appendChild(list);

        const reset = document.createElement('button');
        reset.className = 'narr-reset';
        reset.textContent = 'RESET VOICES';
        reset.onclick = () => { uiClick(); s.voiceCast = {}; saveSettings(); renderSettings(); };
        body.appendChild(reset);
    };
})();

// Say the cast member's test line, in their voice
function narrTest(c) {
    narrStop();
    if (!('speechSynthesis' in window)) return;
    for (const chunk of narrChunks(narrClean(c.line))) narrQueue(c, chunk);
}
