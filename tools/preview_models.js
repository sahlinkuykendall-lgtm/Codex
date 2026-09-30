// ============================================================
// MODEL PREVIEWER (tools/preview_models.js)
// Renders every .glb in a folder to a thumbnail (two angles) and prints
// what's inside each: triangles, meshes, textures, bones, animations and
// real size — so we can see what a download looks like and whether it
// suits the game. Writes <out>/<name>.png and a contact sheet.
//
//   node tools/preview_models.js [folder=models] [out=preview]
// Needs Node and Playwright (npm i playwright) with Chrome installed.
// ============================================================
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const dir = path.resolve(ROOT, process.argv[2] || 'models');
const out = path.resolve(ROOT, process.argv[3] || 'preview');
fs.mkdirSync(out, { recursive: true });

(async () => {
    const files = fs.readdirSync(dir).filter(f => /\.glb$/i.test(f));
    const b = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const p = await b.newPage({ viewport: { width: 640, height: 480 } });
    await p.route('http://codex.local/**', r => { const u = decodeURIComponent(new URL(r.request().url()).pathname); if (u === '/blank.html') return r.fulfill({ body: '<html></html>', contentType: 'text/html' }); const fp = path.join(ROOT, u); if (!fs.existsSync(fp)) return r.fulfill({ status: 404 }); r.fulfill({ body: fs.readFileSync(fp), contentType: fp.endsWith('.wasm') ? 'application/wasm' : 'application/javascript' }); });
    await p.goto('http://codex.local/blank.html');
    for (const f of ['three.min.js', 'GLTFLoader.js', 'DRACOLoader.js']) await p.addScriptTag({ path: path.join(ROOT, 'lib', f) });
    const report = [];
    for (const f of files) {
        const b64 = fs.readFileSync(path.join(dir, f)).toString('base64');
        const r = await p.evaluate(async (b64) => {
            const s = atob(b64), u = new Uint8Array(s.length);
            for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
            let gltf;
            try { gltf = await new Promise((res, rej) => (() => { const l = new THREE.GLTFLoader(); const d = new THREE.DRACOLoader(); d.setDecoderPath('/lib/draco/'); l.setDRACOLoader(d); return l; })().parse(u.buffer, '', res, rej)); }
            catch (e) { return { error: String(e && e.message || e) }; }
            const root = gltf.scene;
            root.updateMatrixWorld(true);
            let tris = 0, meshes = 0, bones = 0; const texs = new Set(); let maxTex = 0;
            root.traverse(o => {
                if (o.isBone) bones++;
                if (o.isMesh) {
                    meshes++;
                    const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
                    [].concat(o.material).forEach(m => { for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap']) if (m[k] && m[k].image) { texs.add(m[k].uuid); maxTex = Math.max(maxTex, m[k].image.width || 0); } });
                }
            });
            const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
            const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
            R.setSize(640, 480); R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping;
            const scene = new THREE.Scene(); scene.background = new THREE.Color(0x2a2620);
            scene.add(new THREE.HemisphereLight(0xfff4e0, 0x403020, 1.1));
            const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(2, 3, 2.5); scene.add(sun);
            scene.add(root);
            const rad = Math.max(size.x, size.y, size.z) || 1;
            const cam = new THREE.PerspectiveCamera(35, 640 / 480, rad / 100, rad * 100);
            const shots = [];
            for (const [ax, ay, az] of [[1, 0.55, 1.35], [-1.2, 0.35, -0.9]]) {
                cam.position.set(ctr.x + ax * rad * 1.35, ctr.y + ay * rad * 1.1, ctr.z + az * rad * 1.35);
                cam.lookAt(ctr);
                R.render(scene, cam);
                shots.push(R.domElement.toDataURL('image/jpeg', 0.85));
            }
            R.dispose();
            return {
                tris: Math.round(tris), meshes, bones, textures: texs.size, maxTex,
                size: [size.x, size.y, size.z].map(n => +n.toFixed(2)),
                anims: gltf.animations.map(a => a.name.replace(/^.*\|/, '') + ' ' + a.duration.toFixed(1) + 's'),
                shots,
            };
        }, b64);
        const name = f.replace(/\.glb$/i, '');
        const mb = (fs.statSync(path.join(dir, f)).size / 1e6).toFixed(1);
        if (r.error) { console.log(`✗ ${f} (${mb} MB): ${r.error}`); report.push({ name, mb, error: r.error }); continue; }
        r.shots.forEach((d, i) => fs.writeFileSync(path.join(out, `${name}_${i}.jpg`), Buffer.from(d.split(',')[1], 'base64')));
        delete r.shots;
        report.push(Object.assign({ name, mb }, r));
        console.log(`✓ ${f}  ${mb} MB | ${r.tris.toLocaleString()} tris, ${r.meshes} meshes, ${r.textures} tex (max ${r.maxTex}px)${r.bones ? ', ' + r.bones + ' bones' : ''} | size ${r.size.join(' x ')}${r.anims.length ? ' | anims: ' + r.anims.join(', ') : ''}`);
    }
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
    // contact sheet(s): 3 across, name under each
    const ok = report.filter(r => !r.error);
    for (let s = 0; s * 12 < ok.length; s++) {
        const part = ok.slice(s * 12, s * 12 + 12);
        const imgs = part.map(r => ({ n: r.name, d: 'data:image/jpeg;base64,' + fs.readFileSync(path.join(out, r.name + '_0.jpg')).toString('base64') }));
        const q = await b.newPage({ viewport: { width: 1200, height: 280 * Math.ceil(imgs.length / 3) } });
        await q.setContent('<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(3,400px);font:13px sans-serif;color:#eee">' +
            imgs.map(i => `<div style="position:relative"><img src="${i.d}" width=400 height=300 style="display:block"><div style="position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.65);padding:4px 6px">${i.n}</div></div>`).join('') + '</body>');
        await q.screenshot({ path: path.join(out, `sheet_${s + 1}.png`), fullPage: true });
        await q.close();
    }
    await b.close();
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
