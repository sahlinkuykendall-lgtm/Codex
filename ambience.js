// ============================================================
// THE CODEX OF GIZA — AMBIENT SOUND (ambience.js)
//
// A synthesized night soundscape for the Chapter 1 camp (no audio
// files): desert wind that gusts and eases, the brazier crackling as
// you come near it, the generator's diesel hum, crickets in the scrub.
// Volumes follow distance to each source and the Ambience slider in
// settings. Called once a frame from engine3d.js (updateAtmosphere3d).
// ============================================================

const AMB = {
    ready: false, unlocked: false,
    bus: null, wind: null, windFilt: null, windGain: null,
    hum: null, humGain: null,
    crickets: null, cricketGain: null,
    nextCrackle: 0, nextChirp: 0,
    level: 0,
};

// where the sounds come from (object positions; the layout moves them)
const AMB_SOURCES = {
    get brazier() { return typeof ch1At === 'function' ? ch1At('rest_brazier') : [382, 2598]; },
    get generator() { return typeof ch1At === 'function' ? ch1At('generator') : [3244, 2444]; },
};

function _ambOut() {
    const ctx = _getAudio();
    return (typeof _audioOut === 'function') ? _audioOut() : ctx.destination;
}

function ambInit() {
    const ctx = _getAudio();
    AMB.bus = ctx.createGain();
    AMB.bus.gain.value = 0;
    AMB.bus.connect(_ambOut());

    // wind: two seconds of brown-ish noise, looped, through a wandering band-pass
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    AMB.wind = ctx.createBufferSource();
    AMB.wind.buffer = buf; AMB.wind.loop = true;
    AMB.windFilt = ctx.createBiquadFilter();
    AMB.windFilt.type = 'bandpass'; AMB.windFilt.frequency.value = 420; AMB.windFilt.Q.value = 0.6;
    AMB.windGain = ctx.createGain(); AMB.windGain.gain.value = 0.0;
    AMB.wind.connect(AMB.windFilt); AMB.windFilt.connect(AMB.windGain); AMB.windGain.connect(AMB.bus);
    AMB.wind.start();

    // generator: a low diesel throb
    AMB.hum = ctx.createOscillator(); AMB.hum.type = 'sawtooth'; AMB.hum.frequency.value = 49;
    const hum2 = ctx.createOscillator(); hum2.type = 'square'; hum2.frequency.value = 24.5;
    const humFilt = ctx.createBiquadFilter(); humFilt.type = 'lowpass'; humFilt.frequency.value = 160;
    AMB.humGain = ctx.createGain(); AMB.humGain.gain.value = 0;
    const hum2Gain = ctx.createGain(); hum2Gain.gain.value = 0.4;
    AMB.hum.connect(humFilt); hum2.connect(hum2Gain); hum2Gain.connect(humFilt);
    humFilt.connect(AMB.humGain); AMB.humGain.connect(AMB.bus);
    AMB.hum.start(); hum2.start();

    AMB.cricketGain = ctx.createGain(); AMB.cricketGain.gain.value = 1; AMB.cricketGain.connect(AMB.bus);
    AMB.ready = true;
}

// A single crackle / pop from the fire
function ambCrackle(vol) {
    const ctx = _getAudio();
    const src = ctx.createBufferSource();
    src.buffer = _getNoiseBuf();
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1400 + Math.random() * 2400;
    const g = ctx.createGain();
    const t = ctx.currentTime, dur = 0.012 + Math.random() * 0.03;
    g.gain.setValueAtTime(vol * (0.4 + Math.random()), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(AMB.bus);
    src.start(t); src.stop(t + dur + 0.01);
}

// A cricket: a few fast pulses of a high sine
function ambChirp(vol) {
    const ctx = _getAudio();
    const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 4200 + Math.random() * 900;
    const g = ctx.createGain(); g.gain.value = 0;
    osc.connect(g); g.connect(AMB.cricketGain);
    const t = ctx.currentTime, pulses = 3 + (Math.random() * 3 | 0);
    for (let i = 0; i < pulses; i++) {
        const s = t + i * 0.055;
        g.gain.setValueAtTime(0, s);
        g.gain.linearRampToValueAtTime(vol, s + 0.008);
        g.gain.linearRampToValueAtTime(0, s + 0.035);
    }
    osc.start(t); osc.stop(t + pulses * 0.055 + 0.05);
}

function updateAmbience() {
    if (!AMB.unlocked) return;
    const inCh1 = currentMapKey === 1 && !interiorState.active &&
        (gameState.currentScreen === 'GAME' || gameState.currentScreen === 'START_MENU');
    if (!AMB.ready) { if (!inCh1) return; try { ambInit(); } catch (e) { AMB.unlocked = false; return; } }
    const ctx = _getAudio();
    const s = (typeof getSettings === 'function') ? getSettings() : { ambienceVol: 0.8 };
    const paused = gameState.isPaused;
    const target = inCh1 && !paused ? (s.ambienceVol != null ? s.ambienceVol : 0.8) : 0;
    AMB.level += (target - AMB.level) * 0.05;
    AMB.bus.gain.value = AMB.level;
    if (AMB.level < 0.005) return;

    const t = ctx.currentTime;
    // listener: the player in game, the camera on the title screen
    const lx = gameState.currentScreen === 'GAME' ? player.x + player.size / 2 : cam3.position.x;
    const lz = gameState.currentScreen === 'GAME' ? player.y + player.size / 2 : cam3.position.z;
    const near = (src, range) => {
        const [x, z] = AMB_SOURCES[src];
        const dd = Math.hypot(lx - x, lz - z);
        return Math.max(0, 1 - dd / range) ** 2;
    };

    // wind gusts: slow layered swells, the band wandering with them
    const gust = 0.5 + 0.3 * Math.sin(t * 0.13) + 0.2 * Math.sin(t * 0.37 + 1.3) + 0.1 * Math.sin(t * 1.1);
    AMB.windGain.gain.value = 0.05 + 0.07 * gust;
    AMB.windFilt.frequency.value = 280 + 380 * gust;

    // generator hum, loudest at its side, faint across camp
    AMB.humGain.gain.value = 0.004 + 0.05 * near('generator', 1400);

    // brazier crackles
    const fire = near('brazier', 900);
    if (fire > 0.01 && t > AMB.nextCrackle) {
        ambCrackle(0.09 * fire);
        AMB.nextCrackle = t + 0.03 + Math.random() * (Math.random() < 0.3 ? 0.5 : 0.14);
    }
    // crickets, everywhere but quiet; never right over the fire
    if (t > AMB.nextChirp) {
        ambChirp(0.006 + 0.01 * Math.random());
        AMB.nextChirp = t + 0.4 + Math.random() * 2.2;
    }
}

// Browsers only start audio after the player does something
function ambUnlock() {
    AMB.unlocked = true;
    try { const ctx = _getAudio(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) { /* no audio */ }
}
window.addEventListener('keydown', ambUnlock);
window.addEventListener('pointerdown', ambUnlock);
