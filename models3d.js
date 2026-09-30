// ============================================================
// THE CODEX OF GIZA — DOWNLOADED 3D MODELS (models3d.js)
//
// Loads the models packed by tools/convert_models.js (models/<name>.js
// puts the .glb into window.CODEX_MODELS as base64), so they work from a
// double-clicked index.html and on GitHub Pages alike.
//
//   const m = modelSpawn('remy', { height: 56 });
//   group.add(m.group);          // an empty group now; the model appears when parsed
//   m.play('walk');              // any clip the model carries (see the converter's output)
//
// Each spawned copy has its own skeleton and animation mixer; mixers are
// advanced once a frame. Loaded after ch1_dog.js (needs lib/GLTFLoader.js
// and lib/SkeletonUtils.js).
// ============================================================

const MODELS = { parsed: {}, live: [], last: 0 };

function modelLoad(name) {
    if (MODELS.parsed[name]) return MODELS.parsed[name];
    const b64 = window.CODEX_MODELS && window.CODEX_MODELS[name];
    if (!b64) return (MODELS.parsed[name] = Promise.reject(new Error('model not packed: ' + name)));
    const s = atob(b64), buf = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) buf[i] = s.charCodeAt(i);
    MODELS.parsed[name] = new Promise((res, rej) => new THREE.GLTFLoader().parse(buf.buffer, '', res, rej)).then(gltf => {
        // measure it once, standing in its bind pose
        gltf.scene.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(gltf.scene);
        gltf.userData = { minY: box.min.y, height: box.max.y - box.min.y };
        // clip names without the exporter's armature prefixes ("HumanArmature|Man_Walk" → "walk")
        gltf.clipsByName = {};
        for (const c of gltf.animations) {
            const short = c.name.replace(/^.*\|/, '').replace(/^[A-Za-z]+_/, '').toLowerCase();
            gltf.clipsByName[short] = c; gltf.clipsByName[c.name.toLowerCase()] = c;
        }
        return gltf;
    });
    return MODELS.parsed[name];
}

// A copy of a model, scaled to `height` world units (about 32 per metre),
// feet on the ground, facing +z
function modelSpawn(name, opts) {
    opts = opts || {};
    const group = new THREE.Group();
    const inst = { group, model: null, mixer: null, action: null, want: opts.clip || null, speed: opts.speed || 1, clips: {} };
    inst.play = function (clip, fade) {
        inst.want = clip;
        if (!inst.mixer) return;
        const c = inst.clips[String(clip).toLowerCase()];
        if (!c) return;
        const a = inst.mixer.clipAction(c);
        if (inst.action === a) return;
        a.reset().setEffectiveTimeScale(inst.speed).fadeIn(fade == null ? 0.25 : fade).play();
        if (inst.action) inst.action.fadeOut(fade == null ? 0.25 : fade);
        inst.action = a;
    };
    inst.ready = modelLoad(name).then(gltf => {
        const m = THREE.SkeletonUtils.clone(gltf.scene);
        // exact scale (opts.scale) or fit to a height in world units (about 32 per metre)
        const k = opts.scale || (opts.height || 56) / (gltf.userData.height || 1);
        m.scale.setScalar(k);
        m.position.y = -gltf.userData.minY * k;
        m.traverse(o => {
            if (!o.isMesh) return;
            o.castShadow = true; o.receiveShadow = true; o.frustumCulled = !o.isSkinnedMesh;   // skinned bounds lag the pose; props cull normally
            // scanned props often arrive marked fully metallic, which renders black
            // without reflections to show: opts.matte makes them stone/leather/papyrus
            if (opts.matte) o.material = [].concat(o.material).map(mt => { const c = mt.clone(); c.metalness = 0; c.roughness = Math.max(0.7, c.roughness || 0); c.metalnessMap = null; return c; }).reduce((a, c, i, arr) => arr.length === 1 ? c : arr, null);
        });
        group.add(m);
        inst.model = m;
        inst.mixer = new THREE.AnimationMixer(m);
        inst.clips = gltf.clipsByName;
        MODELS.live.push(inst);
        if (inst.want) { const w = inst.want; inst.want = null; inst.play(w, 0); }
        return inst;
    }).catch(err => { console.warn('model', name, err.message); });
    return inst;
}

function modelsUpdate() {
    const now = performance.now() / 1000;
    const dt = Math.min(0.1, MODELS.last ? now - MODELS.last : 0.016);
    MODELS.last = now;
    for (let i = MODELS.live.length - 1; i >= 0; i--) {
        const m = MODELS.live[i];
        if (!m.group.parent && !m.keepAlive) { MODELS.live.splice(i, 1); continue; }   // its world was rebuilt
        if (m.onFrame) m.onFrame(dt, now);
        m.mixer.update(dt);
    }
}
(function () {
    const _ow = owUpdateHud;
    owUpdateHud = function () { _ow(); modelsUpdate(); };
    const _fx = updateCh1FX;
    updateCh1FX = function () { const r = _fx.apply(this, arguments); if (gameState.currentScreen !== 'GAME') modelsUpdate(); return r; };
})();
