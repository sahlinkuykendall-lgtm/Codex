// ============================================================
// POKE STYLE — THE LOOK CHECK
// Renders the camp at every place (day 12:00 and night 22:00) and the three rooms, in an older
// build and this one, and compares them pixel for pixel. Area 1's look is approved: only
// changes you meant should show up here.
//   git worktree add /tmp/old <commit> && node tools/poke_checks/poke_look.js /tmp/old
// ============================================================
// Run from the repo root: node tools/poke_checks/poke_look.js <old build folder>
// Needs Playwright (npm i -g playwright, or the one in your PATH) and a Chromium it can launch.
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
const { chromium } = pw;
const ROOT = path.resolve(__dirname, '../..');
const LAUNCH = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : (require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
const fs = require('fs');
async function grab(b, root) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('file://' + root + '/poke.html');
  await p.waitForFunction(() => window.POKE_READY);
  return await p.evaluate(async () => {
    const out = {};
    Game.player.name = 'Sam Hale'; Game.player.bg = 'archaeologist';
    Game.resetWorld(); Game.enter(Game.maps.ch1); Game.state = 'play';
    Game.hintT = 99; Banner.t = 99; Toast.t = 99;
    const m = Game.maps.ch1;
    const spots = [['spawn', m.spawn[0], m.spawn[1]]].concat(m.places.map(pl => [pl.id, pl.x, pl.y]));
    for (const hour of [12, 22]) for (const [id, x, y] of spots) {
      Game.map = m; Game.player.x = x; Game.player.y = y; Game.player.dir = 0; Game.player.frame = 0;
      Game.enter(m); Game.set.time = 1; Game.hour = hour; Game.time = 0; Game.target = null; Game.hintT = 99; Banner.t = 99;
      Game.draw(); out[id + '@' + hour] = Game.canvas.toDataURL();
    }
    for (const room of ['INT_TENT', 'INT_DORM', 'INT_FOREMAN']) {
      const r = buildRoom(room, window.POKE_MAP, [0, 0]); Game.map = r; Game.player.x = r.spawn[0]; Game.player.y = r.spawn[1];
      Game.enter(r); Game.hour = 12; Game.time = 0; Game.target = null; Banner.t = 99; Game.draw(); out[room] = Game.canvas.toDataURL();
    }
    return out;
  });
}
(async () => {
  const b = await chromium.launch(LAUNCH);
  const OLD = process.argv[2]; if (!OLD) { console.log('usage: node tools/poke_checks/poke_look.js <folder with the older build (a git worktree)>'); process.exit(1); }
  const A = await grab(b, path.resolve(OLD)), B = await grab(b, ROOT);
  const p = await b.newPage();
  let same = 0, diff = [];
  for (const k of Object.keys(A)) {
    const n = await p.evaluate(async ([a, c]) => {
      const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
      const [ia, ib] = await Promise.all([load(a), load(c)]);
      const cv = document.createElement('canvas'); cv.width = ia.width; cv.height = ia.height; const g = cv.getContext('2d');
      g.drawImage(ia, 0, 0); const da = g.getImageData(0, 0, cv.width, cv.height).data;
      g.clearRect(0, 0, cv.width, cv.height); g.drawImage(ib, 0, 0); const db = g.getImageData(0, 0, cv.width, cv.height).data;
      let n = 0; for (let i = 0; i < da.length; i += 4) if (da[i] !== db[i] || da[i + 1] !== db[i + 1] || da[i + 2] !== db[i + 2]) n++;
      return n;
    }, [A[k], B[k]]);
    if (n) diff.push(k + ':' + n); else same++;
  }
  console.log('views compared:', Object.keys(A).length, 'identical:', same, 'different:', diff);
  await b.close();
})();
