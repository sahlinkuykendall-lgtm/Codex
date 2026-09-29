// ============================================================
// THE CODEX OF GIZA — SETTINGS (settings.js)
//
// Player options, stored in this browser (localStorage), with a
// settings screen reachable from the title menu and the pause menu.
// Loaded before engine3d.js. The engines read values via getSettings();
// changes apply live through applySettings().
// ============================================================

const SETTINGS_KEY = 'codexOfGiza_settings_v1';

const SETTINGS_DEFAULTS = {
    // graphics
    quality: 'high',      // low | medium | high | ultra
    brightness: 1.0,      // 0.7 – 1.4
    fov: 70,              // 60 – 100
    // controls
    mouseSens: 1.0,       // 0.3 – 2.5
    invertY: false,
    // audio
    masterVol: 0.9,
    ambienceVol: 0.8,
    stepVol: 0.8,
    // gameplay / comfort
    headBob: true,
    reduceMotion: false,  // calms camera sway & tremor from low sanity
    labels: 'near',       // near | always | off
    textSpeed: 'fast',    // normal | fast | instant
    hints: true,          // the controls strip in the corner
};

const QUALITY_PRESETS = {
    low:    { pixelRatio: 0.85, shadows: false, shadowMap: 1024, dust: false },
    medium: { pixelRatio: 1.0,  shadows: true,  shadowMap: 1024, dust: true },
    high:   { pixelRatio: 1.5,  shadows: true,  shadowMap: 2048, dust: true },
    ultra:  { pixelRatio: 2.0,  shadows: true,  shadowMap: 4096, dust: true },
};

let _settings = null;
function getSettings() {
    if (!_settings) {
        _settings = Object.assign({}, SETTINGS_DEFAULTS);
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (raw) Object.assign(_settings, JSON.parse(raw));
        } catch (e) { /* private mode etc. — defaults are fine */ }
    }
    const q = QUALITY_PRESETS[_settings.quality] || QUALITY_PRESETS.high;
    _settings.shadows = q.shadows;
    _settings.preset = q;
    return _settings;
}

function saveSettings() {
    try {
        const s = Object.assign({}, _settings);
        delete s.shadows; delete s.preset;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch (e) { /* ignore */ }
}

function setSetting(key, value) {
    const s = getSettings();
    const needsRebuild = key === 'quality' && s.quality !== value;
    s[key] = value;
    saveSettings();
    getSettings();
    applySettings(needsRebuild);
}

// Push the current values into the running game
function applySettings(rebuildWorld) {
    const s = getSettings();
    if (typeof renderer3 !== 'undefined') {
        renderer3.setPixelRatio(Math.min(window.devicePixelRatio || 1, s.preset.pixelRatio));
        if (typeof currentMapKey !== 'undefined' && currentMapKey === 1) renderer3.toneMappingExposure = 0.95 * s.brightness;
        if (rebuildWorld && typeof builtSignature !== 'undefined') { // rebuild with new shadow settings
            builtSignature = null;
            window._keepViewOnRebuild = true;
        }
    }
    if (typeof applyAudioSettings === 'function') applyAudioSettings();
    const hint = document.getElementById('hud-hint');
    if (hint) hint.style.visibility = s.hints ? '' : 'hidden';
}

// ============================================================
// SETTINGS SCREEN
// ============================================================
const SETTINGS_TABS = [
    { id: 'graphics', label: 'GRAPHICS', rows: [
        { key: 'quality', label: 'Quality', type: 'choice', options: [['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['ultra', 'Ultra']],
          help: 'Shadows, resolution and effects. Use Low on older laptops.' },
        { key: 'brightness', label: 'Brightness', type: 'range', min: 0.7, max: 1.4, step: 0.05, fmt: v => Math.round(v * 100) + '%',
          help: 'The camp is lit by the moon and a few lamps. Raise this if you can\'t see your feet.' },
        { key: 'fov', label: 'Field of view', type: 'range', min: 60, max: 100, step: 1, fmt: v => v + '°' },
    ]},
    { id: 'controls', label: 'CONTROLS', rows: [
        { key: 'mouseSens', label: 'Mouse sensitivity', type: 'range', min: 0.3, max: 2.5, step: 0.05, fmt: v => v.toFixed(2) + '×' },
        { key: 'invertY', label: 'Invert mouse Y', type: 'toggle' },
        { type: 'keys' },
    ]},
    { id: 'audio', label: 'AUDIO', rows: [
        { key: 'masterVol', label: 'Master volume', type: 'range', min: 0, max: 1, step: 0.05, fmt: v => Math.round(v * 100) + '%' },
        { key: 'ambienceVol', label: 'Ambience', type: 'range', min: 0, max: 1, step: 0.05, fmt: v => Math.round(v * 100) + '%',
          help: 'Wind, the brazier, the generator.' },
        { key: 'stepVol', label: 'Footsteps', type: 'range', min: 0, max: 1, step: 0.05, fmt: v => Math.round(v * 100) + '%' },
    ]},
    { id: 'gameplay', label: 'GAMEPLAY', rows: [
        { key: 'labels', label: 'Object labels', type: 'choice', options: [['near', 'Nearby'], ['always', 'Always'], ['off', 'Off']],
          help: 'The small name tags above things you can interact with.' },
        { key: 'textSpeed', label: 'Text speed', type: 'choice', options: [['normal', 'Normal'], ['fast', 'Fast'], ['instant', 'Instant']],
          help: 'How quickly lines type out. SPACE or a click always finishes a line.' },
        { key: 'hints', label: 'Controls reminder', type: 'toggle' },
        { key: 'headBob', label: 'Head bob', type: 'toggle' },
        { key: 'reduceMotion', label: 'Reduce motion', type: 'toggle',
          help: 'Calms the camera sway and tremor when Ellis\'s sanity is low. The rest of the effect stays.' },
    ]},
];

const KEY_LIST = [
    ['W A S D', 'Move'], ['Mouse', 'Look (click the world to capture)'], ['Shift', 'Sprint'],
    ['Space', 'Interact / Jump'], ['E', 'Focus — clear the phantoms'], ['Tab', 'Stats'], ['Esc', 'Pause / back'],
];

let settingsTab = 'graphics';
let settingsOnClose = null;

function openSettings(onClose) {
    settingsOnClose = onClose || null;
    const panel = document.getElementById('settings-panel');
    panel.classList.remove('hidden');
    renderSettings();
    if (document.pointerLockElement) document.exitPointerLock();
}

function closeSettings() {
    const panel = document.getElementById('settings-panel');
    if (panel.classList.contains('hidden')) return false;
    panel.classList.add('hidden');
    const cb = settingsOnClose;
    settingsOnClose = null;
    if (cb) cb();
    return true;
}

function settingsOpen() {
    const p = document.getElementById('settings-panel');
    return !!p && !p.classList.contains('hidden');
}

function renderSettings() {
    const s = getSettings();
    const tabsEl = document.getElementById('settings-tabs');
    const bodyEl = document.getElementById('settings-body');
    tabsEl.innerHTML = '';
    for (const t of SETTINGS_TABS) {
        const b = document.createElement('button');
        b.className = 'settings-tab' + (t.id === settingsTab ? ' active' : '');
        b.textContent = t.label;
        b.onclick = () => { settingsTab = t.id; uiClick(); renderSettings(); };
        tabsEl.appendChild(b);
    }
    bodyEl.innerHTML = '';
    const tab = SETTINGS_TABS.find(t => t.id === settingsTab);
    for (const row of tab.rows) {
        if (row.type === 'keys') {
            const keys = document.createElement('div');
            keys.className = 'settings-keys';
            keys.innerHTML = KEY_LIST.map(([k, v]) => `<div><span class="key">${k}</span><span>${v}</span></div>`).join('');
            bodyEl.appendChild(keys);
            continue;
        }
        const r = document.createElement('div');
        r.className = 'settings-row';
        const lab = document.createElement('div');
        lab.className = 'settings-label';
        lab.innerHTML = row.label + (row.help ? `<small>${row.help}</small>` : '');
        r.appendChild(lab);
        const ctl = document.createElement('div');
        ctl.className = 'settings-control';
        if (row.type === 'choice') {
            for (const [val, text] of row.options) {
                const b = document.createElement('button');
                b.className = 'seg' + (s[row.key] === val ? ' on' : '');
                b.textContent = text;
                b.onclick = () => { setSetting(row.key, val); uiClick(); renderSettings(); };
                ctl.appendChild(b);
            }
        } else if (row.type === 'toggle') {
            const b = document.createElement('button');
            b.className = 'toggle' + (s[row.key] ? ' on' : '');
            b.innerHTML = `<i></i><span>${s[row.key] ? 'ON' : 'OFF'}</span>`;
            b.onclick = () => { setSetting(row.key, !s[row.key]); uiClick(); renderSettings(); };
            ctl.appendChild(b);
        } else if (row.type === 'range') {
            const inp = document.createElement('input');
            inp.type = 'range';
            inp.min = row.min; inp.max = row.max; inp.step = row.step;
            inp.value = s[row.key];
            const out = document.createElement('span');
            out.className = 'range-val';
            out.textContent = row.fmt(Number(s[row.key]));
            inp.oninput = () => { setSetting(row.key, Number(inp.value)); out.textContent = row.fmt(Number(inp.value)); };
            ctl.appendChild(inp);
            ctl.appendChild(out);
        }
        r.appendChild(ctl);
        bodyEl.appendChild(r);
    }
}

function resetSettings() {
    _settings = Object.assign({}, SETTINGS_DEFAULTS);
    saveSettings();
    applySettings(true);
    renderSettings();
}

function uiClick() { if (typeof _tone === 'function') _tone(520, 0.04, 'sine', 0.04); }
function uiHover() { if (typeof _tone === 'function') _tone(880, 0.02, 'sine', 0.015); }

window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && settingsOpen()) {
        e.stopImmediatePropagation();
        e.preventDefault();
        closeSettings();
    }
}, true);

document.addEventListener('DOMContentLoaded', () => {
    const close = document.getElementById('settings-close');
    if (close) close.addEventListener('click', () => { uiClick(); closeSettings(); });
    const reset = document.getElementById('settings-reset');
    if (reset) reset.addEventListener('click', () => { uiClick(); resetSettings(); });
    applySettings(false);
});
