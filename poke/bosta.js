// ============================================================
// THE CODEX OF GIZA — POKE STYLE: BOSTA, THE CAMP DOG (poke/bosta.js)
// SQ-01A-08. Ported from the 3D build's ch1_dog.js.
// A sandy baladi dog, one ear up and one flopped for good, a tail curled over her back.
// She lies by the workers' fire (the camp's own sprite). Wake her, scratch her ears, give
// her dates (Miriam's cache, the Bedouin shelter), and she follows you: trotting along the
// way you walked, sitting when you stop, lying down if you stand long enough. Teach her to
// sit three times and she gives you her paw. At midnight she barks at the black car and
// growls at the woman in black. Her state is story flags (dog_follow, dog_sits, dog_paw)
// and affinity (rel 'bosta').
// ============================================================

// her sprites, drawn to match the lying dog by the fire: [dir][frame] walking (frame 0 stands), and sitting
const DOG_ART = (() => {
    const S = PAL.sand, EAR = PAL.rock[3], D = PAL.dark[3];
    const make = (draw) => { const [c, g] = mk(30, 24), A = pa(g); draw(A); return outline(c); };
    const flip = (c) => { const [f, g] = mk(c.width, c.height); g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(c, 0, 0); return f; };
    // side view, facing right
    const side = (f, sit) => make(A => {
        if (sit) {
            A.line(8, 20, 4, 19, S[3]); A.px(3, 19, S[1]);                                 // tail on the ground
            A.ell(11, 17, 5, 3, S[3]); A.ell(13, 13, 4, 6, S[3]); A.ell(14, 12, 2, 4, S[2]); // haunch, body upright
            A.r(15, 14, 2, 7, S[3]); A.r(17, 14, 2, 7, S[3]); A.r(15, 20, 2, 1, S[1]); A.r(17, 20, 2, 1, S[1]);
            A.ell(18, 6, 4, 3, S[3]); A.r(21, 6, 3, 2, S[1]); A.px(23, 6, D); A.px(18, 5, D);
            A.poly([[15, 4], [16, 0], [18, 4]], EAR); A.r(18, 3, 2, 2, EAR);
            return;
        }
        const sw = [0, 1, -1][f], lift = [0, 1, 1][f];
        A.line(5, 12, 3, 8, S[3]); A.line(3, 8, 5, 6, S[3]); A.px(6, 6, S[1]);            // the tail, curled over her back
        for (const [lx, s] of [[7, 1], [10, -1], [17, 1], [20, -1]]) A.r(lx + sw * s, 14, 2, 7 - (s > 0 ? lift : 0), S[3]);
        A.ell(13, 12, 8, 4, S[3]); A.ell(12, 11, 6, 2, S[2]); A.r(9, 15, 8, 1, S[1]);     // body, lit back, pale belly
        A.ell(22, 8, 4, 3, S[3]); A.r(25, 8, 3, 2, S[1]); A.px(27, 8, D); A.px(22, 7, D); // head, muzzle, nose, eye
        A.poly([[19, 6], [20, 1], [22, 6]], EAR); A.r(22, 5, 2, 2, EAR);                   // the ear that stands, the ear that doesn't
    });
    // facing you
    const front = (f, sit) => make(A => {
        const a = sit ? 0 : [0, 1, -1][f];
        A.ell(15, 14, 5, sit ? 6 : 4, S[3]); A.ell(15, 13, 3, 3, S[1]);
        A.r(12, 16, 2, 5 - Math.max(0, a), S[3]); A.r(16, 16, 2, 5 - Math.max(0, -a), S[3]);
        A.ell(15, 8, 4, 4, S[3]); A.r(14, 9, 3, 2, S[1]); A.px(15, 9, D); A.px(13, 7, D); A.px(17, 7, D);
        A.poly([[11, 6], [12, 1], [14, 6]], EAR); A.r(17, 4, 3, 2, EAR); A.px(20, 11, S[1]);
    });
    // walking away
    const back = (f, sit) => make(A => {
        const a = sit ? 0 : [0, 1, -1][f];
        A.r(12, 17, 2, 4 - Math.max(0, a), S[3]); A.r(16, 17, 2, 4 - Math.max(0, -a), S[3]);
        A.ell(15, 14, 5, sit ? 6 : 5, S[3]); A.ell(15, 13, 3, 3, S[2]);                     // her back
        A.ell(15, 6, 4, 3, S[3]); A.r(14, 4, 3, 1, S[2]);                                    // the back of her head, above it
        A.poly([[11, 5], [12, 0], [14, 4]], EAR); A.r(17, 3, 3, 2, EAR); A.px(19, 5, EAR);   // one ear up, one flopped
        A.ell(15, 12, 3, 2, S[4]); A.ell(15, 12, 2, 1, S[1]); A.px(17, 11, S[3]);            // the curl of the tail, a ring on her back
    });
    const walk = [0, 1, 2], R = walk.map(f => side(f)), sitR = side(0, true);
    return {
        frames: [walk.map(f => front(f)), R.map(flip), R, walk.map(f => back(f))],
        sit: [front(0, true), flip(sitR), sitR, back(0, true)],
    };
})();

const Bosta = {
    x: 0, y: 0, dir: 0, anim: 0, frame: 0, crumbs: [], still: 0, awake: false, barkAt: 0, growlAt: 0, warned: false,
    following() { return !!sflag('dog_follow'); },
    home() { return Game.maps.ch1 && Game.maps.ch1.ents.find(e => e.id === 'camp_dog'); },
    // at your heels (after a load, or when she first follows you)
    heel() { const p = Game.player; this.x = p.x + 20; this.y = p.y + 14; this.crumbs = []; this.still = 0; },
    // the fire sprite is her while she's at home; when she's with you it steps aside (and so does its solid)
    sync() {
        const h = this.home(), m = Game.maps.ch1; if (!h) return;
        const away = this.following();
        if (h.gone !== away) { h.gone = away; World.setSolid(m, h, !away); if (away && !this.x) this.heel(); }
    },
    update(dt) {
        if (!this.following() || !Game.map.outdoor) return;                    // indoors, she waits by the door
        const p = Game.player, dP = Math.hypot(p.x - this.x, p.y - this.y);
        const lc = this.crumbs[this.crumbs.length - 1];
        if (!lc || Math.hypot(lc[0] - p.x, lc[1] - p.y) > 18) this.crumbs.push([p.x, p.y]);
        if (this.crumbs.length > 90) this.crumbs.shift();
        if (dP > 420) { const b = this.crumbs.length > 4 ? this.crumbs[this.crumbs.length - 4] : [p.x + 20, p.y + 14]; this.x = b[0]; this.y = b[1]; this.crumbs = []; }   // left behind: she catches up out of sight
        while (this.crumbs.length && Math.hypot(this.crumbs[0][0] - this.x, this.crumbs[0][1] - this.y) < 10) this.crumbs.shift();
        if (dP > 30) {
            const g = this.crumbs.length ? this.crumbs[0] : [p.x, p.y], dx = g[0] - this.x, dy = g[1] - this.y, d = Math.hypot(dx, dy) || 1;
            const sp = Math.max(60, Math.min(200, (dP - 22) * 3)), step = Math.min(d, sp * dt);
            this.x += dx / d * step; this.y += dy / d * step;
            this.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
            this.anim += step / 7; this.frame = [1, 0, 2, 0][Math.floor(this.anim) % 4]; this.still = 0;
        } else {
            this.still += dt; this.frame = 0;
            this.crumbs = this.crumbs.filter(c => Math.hypot(c[0] - p.x, c[1] - p.y) > 30);
            const dx = p.x - this.x, dy = p.y - this.y; this.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
        }
        // midnight: she barks at the black car, and growls at the woman in black
        const ev = sflag('lena_event');
        if ((ev === 'coming' || ev === 'searching') && Game.time > this.barkAt) {
            this.bark(); this.barkAt = Game.time + 2.5 + Math.random() * 3;
            if (!this.warned) { this.warned = true; storyNotice('Bosta is barking at the road in.'); }
        }
        if (ev === 'searching' && Game.time > this.growlAt) {
            const l = Game.maps.ch1.ents.find(e => e.id === 'c1a_lena');
            if (l && Math.hypot(l.x - this.x, l.y - this.y) < 140) { this.growl(); this.growlAt = Game.time + 2 + Math.random() * 2; }
        }
    },
    bark() { for (let i = 0; i < 2; i++) setTimeout(() => Sfx.tone(440 + Math.random() * 40, 0.11, 'sawtooth', 0.05, 210), i * 230); },
    growl() { Sfx.tone(90, 0.9, 'sawtooth', 0.035, 80); },
    near() { return this.following() && Game.map.outdoor && Math.hypot(Game.player.x - this.x, Game.player.y - this.y) < 90; },
    // her, in the draw list (so she sorts with everything else); a lying dog after a long wait
    ent() {
        if (!this.following() || !Game.map.outdoor) return null;
        const h = this.home();
        if (this.still > 14 && h && h.spr) return { x: this.x, y: this.y, sortY: this.y, custom: (g, cx, cy) => { const sp = h.spr, fr = sp.frames[Math.floor(Game.time * sp.fps) % sp.frames.length]; g.drawImage(fr, Math.round(this.x - fr.width / 2 - cx), Math.round(this.y - fr.height + 2 - cy)); } };
        const sit = this.still > 1.2, fr = sit ? DOG_ART.sit[this.dir] : DOG_ART.frames[this.dir][this.frame];
        return { x: this.x, y: this.y, sortY: this.y, custom: (g, cx, cy) => {
            pa(g).ell(Math.round(this.x - cx), Math.round(this.y - cy), 7, 2, 'rgba(64,40,24,0.28)');
            g.drawImage(fr, Math.round(this.x - 15 - cx), Math.round(this.y - 21 - cy));
        } };
    },
    // you can talk to her where she is, when she's with you
    talkable() {
        if (!this.following() || !Game.map.outdoor) return null;
        return { id: 'camp_dog', x: this.x, y: this.y, w: 0, d: 0, person: { dir: 0 }, label: 'Bosta', say: ['Bosta', ''], dogProxy: true };
    },
};

// ---- talking to her ----
STORY_SCRIPTS.camp_dog = 'fun_dog';
scene('fun_dog', {
    speaker: 'Bosta',
    text: () => {
        const a = relGet('bosta');
        if (!Bosta.following() && !Bosta.awake) return `The camp dog, asleep by the fire, one paw running in a dream. A sandy baladi bitch: one ear up, one ear flopped over for good, a tail that curls over her back.\n\nThe men call her Bosta. She arrived in the back of the post van three winters ago and got out as if she'd been delivered.`;
        if (Bosta.following()) return a >= 30 ? `Bosta sits at your feet and looks up at you like you personally invented dates.` : `Bosta looks up at you, tail going. She's decided you're hers, apparently.`;
        if (a >= 10) return `Bosta thumps her tail on the sand and rolls her eyes up at you. The good ear stands straight up.`;
        return `Bosta watches you with polite, professional interest. She has met a lot of archaeologists. Her tail moves, once.`;
    },
    get choices() {
        const c = [];
        if (!Bosta.following() && !Bosta.awake) c.push({ text: 'Crouch down and let her wake up.', onSelect: () => { Bosta.awake = true; rel('bosta', 2, true); startDialogue('dog_woke'); } });
        else {
            c.push({ text: 'Scratch behind the floppy ear.', onSelect: () => { rel('bosta', 3, true); startDialogue('dog_scratch'); } });
            if (hasItem('Dates')) c.push({ text: 'Give her a date.', onSelect: () => {
                dropItem('Dates'); rel('bosta', 8, true);
                if (!Bosta.following() && relGet('bosta') >= 14) { c1aDogFollow(); storyNotice('Bosta will remember that.'); startDialogue('dog_adopted'); }
                else startDialogue('dog_date');
            } });
            if (!Bosta.following() && relGet('bosta') >= 8) c.push({ text: '"Come on, Bosta. Yalla."', onSelect: () => { c1aDogFollow(); startDialogue('dog_come'); } });
            if (Bosta.following()) c.push({ text: '"Stay, Bosta. Stay here."', onSelect: () => { sflag('dog_follow', false); Bosta.x = 0; storySync(); startDialogue('dog_stay'); } });
            c.push({ text: '"Sit."', onSelect: () => {
                const n = (sflag('dog_sits') || 0) + 1; sflag('dog_sits', n);
                Bosta.still = Math.max(Bosta.still, 2);
                if (n >= 3 && !sflag('dog_paw')) { sflag('dog_paw', true); rel('bosta', 5, true); }
                startDialogue(sflag('dog_paw') ? (n === 3 ? 'dog_paw_new' : 'dog_paw') : 'dog_sit');
            } });
        }
        c.push({ text: 'Leave her be.' });
        return c;
    },
});
function c1aDogFollow() {
    sflag('dog_follow', true); Bosta.heel(); storySync(); taskDone('bosta');
    if (!sflag('dog_noted')) { sflag('dog_noted', true); storyNote('Bosta (side quest)', 'The camp dog follows you now. She sits when you stop, and she\'ll stay by the fire if you tell her to. At midnight she\'ll have something to say about the black car.'); }
}
scene('dog_woke', { speaker: 'Bosta', text: `One eye opens. Then the other. She considers you, sighs through her nose, and stretches, front paws out, rump in the air, as if she'd been planning to get up anyway.`, choices: [{ text: 'Laugh.' }] });
scene('dog_scratch', { speaker: 'Bosta', text: `You find the spot. Her eyes close, a back leg starts thumping the sand, and then she simply falls over sideways and presents her belly with total confidence.`, choices: [{ text: 'Obviously you rub the belly.' }] });
scene('dog_date', { speaker: 'Bosta', text: `The date vanishes. She didn't appear to chew. She looks at your pocket, then at you, then at your pocket again, with enormous meaning.`, choices: [{ text: '"That\'s all. For now."' }] });
scene('dog_adopted', { speaker: 'Bosta', text: `The date vanishes. Then Bosta does something she apparently has never done for anyone on this site: she walks round behind you, sits down at your heel, and waits for you to go somewhere.\n\nSaber, at the kettle, stares. "She doesn't do that," he says. "She doesn't do that for the Rais."\n\n(Bosta follows you now. Tell her to stay whenever you like.)`, choices: [{ text: '"Yalla, then."' }] });
scene('dog_come', { speaker: 'Bosta', text: `Her ear goes up. She's at your heel before you've finished saying it.`, choices: [{ text: 'Walk on.' }] });
scene('dog_stay', { speaker: 'Bosta', text: `She looks at you as if you've said something very disappointing, and trots back to the fire. She'll be there.`, choices: [{ text: '"Good girl."' }] });
scene('dog_sit', { speaker: 'Bosta', text: () => `She sits. Promptly, beautifully, and looks at your hand in case the sitting has produced a date.` + ((sflag('dog_sits') || 0) === 2 ? `\n\nShe's getting the idea.` : ''), choices: [{ text: '"Good girl."' }] });
scene('dog_paw_new', { speaker: 'Bosta', text: `She sits, and then, entirely unasked, lifts one front paw and puts it in your hand, very gravely, like a diplomat.\n\nSomewhere behind you one of the workmen says "Ya salaam!" and within a minute the whole camp knows.`, choices: [{ text: 'Shake it.' }] });
scene('dog_paw', { speaker: 'Bosta', text: `Sit, paw, a look of complete professionalism. She has clearly been practising.`, choices: [{ text: 'Shake it.' }] });
