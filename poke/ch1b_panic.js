// ============================================================
// THE CODEX OF GIZA — POKE STYLE: SAMY'S PANIC (poke/ch1b_panic.js)
// Chapter 1-B, beat 6. Karim's man opened the cooler bag and found a brick.
// Samy has come back to the Serapeum with a torch and a knife, turning the
// galleries over; the night ghaffir is hiding from him in the pump room.
//   - a message from the old ghaffir, a while after the black car has gone
//   - at the gate he offers you the vet's dart pistol (for rabid dogs, one dart)
//   - in the galleries Samy searches the chambers, frantic, his torch a cone.
//     Let him find you and it's a standoff; creep up behind him and you can
//     take the knife before it starts
//   - the standoff: talk him down (he confesses: Karim paid him, Vasse wanted
//     it, Karim was going to sell it), dart him, or run. Then expose him to
//     Fathi (ch1b_samy_exposed ★: Karim's crews are Cold to you in Ch2) or let
//     him flee (a small informant in Ch2: he owes you)
//   - nobody learns you have the Codex
// ============================================================

const panicOn = () => Story.s.tasks.some(t => t.id === 'c1b_standoff' && !t.done);
ITEM_INFO['Dart pistol'] = { desc: 'A vet\'s dart pistol, Ministry issue, for the rabid dogs that come down off the desert. One dart. For dogs, the ghaffir said. Samy is a kind of dog tonight.' };

// ---- the message, a while after the black car goes ----
(function () {
    const Ar = AREAS.inspector, _frame = Ar.frame;
    Ar.frame = function (dt) {
        _frame.call(this, dt);
        const s = Story.s;
        if (sflag('c1b_radwan_seen') && sflag('c1b_rw_left_at') == null) sflag('c1b_rw_left_at', s.clock);
        if (!sflag('c1b_panic_msg') && sflag('c1b_rw_left_at') != null && s.clock - sflag('c1b_rw_left_at') >= 8 && Game.map === Game.maps.ch1) {
            sflag('c1b_panic_msg', true); taskDone('c1b_panic');
            storyMessage('Ghaffir, Serapeum', 'Inspector. Samy is here. He came past me like a mad dog and went down into the galleries with a torch and a knife. He is turning everything over. My son is hiding in the pump room. Please come.');
            task('c1b_standoff', 'Samy is down in the Serapeum\'s galleries with a torch and a knife, looking for the Codex, and the night ghaffir is hiding from him in the pump room. Go down.');
        }
    };
})();

// ---- the gate: the dart pistol ----
(function () {
    const f = STORY_SCRIPTS.c1b_serapeum;
    STORY_SCRIPTS.c1b_serapeum = e => panicOn() ? 'c1b_so_gate' : f(e);
})();
scene('c1b_so_gate', {
    speaker: 'The Ghaffir',
    text: () => `The old ghaffir is standing now, at the top of the steps, listening to the dark below. Somewhere down there, a crash, and a man shouting.\n\n"He went past me like a mad dog. I'm old, Inspector, what could I do?"` + (hasItem('Dart pistol') || sflag('c1b_dart_refused') ? '' : `\n\nHe takes something down from the wall of his hut: a pistol with a fat barrel. "The Ministry gave it to us for the rabid dogs that come down off the desert. One dart." He holds it out. "For dogs. Samy is a kind of dog tonight."`),
    get choices() {
        const c = [];
        if (!hasItem('Dart pistol') && !sflag('c1b_dart_refused')) { c.push({ text: 'Take the dart pistol, and go down.', onSelect: () => { pocket('Dart pistol'); serGoIn(); } }); c.push({ text: 'Go down as you are.', onSelect: () => { sflag('c1b_dart_refused', true); serGoIn(); } }); }
        else c.push({ text: 'Go down.', onSelect: () => serGoIn() });
        c.push({ text: 'Not yet.' });
        return c;
    },
});

// ---- in the galleries: Samy searching ----
const SAMY_SEARCH = [[520, 212], [520, 206, 'look', -1], [360, 214], [360, 214, 'look', 1], [200, 210], [200, 210, 'look', -1], [120, 212, 'look', 1], [280, 214], [440, 212, 'look', -1], [600, 214, 'look', 1], [600, 214, 'look', -1]];
const Panic = {
    map: null, samy: null, i: 0, phase: 'walk', t: 0, face: Math.PI, seenT: 0, how: null,
    on() { return panicOn() && Game.map.key === 'INT_SERAPEUM' && !sflag('c1b_standoff_done'); },
    enter(m) {
        this.map = m;
        const g = m.ents.find(e => e.id === 'c1b_nightghaf');                 // the night ghaffir, hiding behind the pump room's bench
        if (g) { g.x = m.pw - 110; g.y = m.ph - 58; g.sortY = g.y; g.person.dir = DIR.up; g.person.frame = 0; g.light.r = 24; g.gone = false; }
        if (!this.samy || !m.ents.includes(this.samy)) { this.samy = World.addEnt(m, { x: 520, y: 212, w: 0, d: 0, id: 'c1b_samy_panic', label: 'Samy Ragab', person: { sheet: personSheet(LOOKS.samy), dir: DIR.left, frame: 0 }, sortY: 212, light: { x: 0, y: 0, r: 64, c: '#fff4d0' } }); m.people.push(this.samy); }
        const s = this.samy; s.gone = false; s.x = 520; s.y = 212; s.sortY = 212; this.i = 1; this.phase = 'walk'; this.t = 0; this.seenT = 0; this.how = null;
    },
    frame(dt) {
        const m = Game.map; if (this.map !== m || !this.samy || !m.ents.includes(this.samy)) this.enter(m);
        const s = this.samy, p = Game.player; if (s.gone) return;
        const R = SAMY_SEARCH[this.i];
        if (this.phase === 'walk') { if (Ser.step(s, R[0], R[1], 52, dt)) { if (R[2]) { this.phase = 'look'; this.t = 0; s.person.frame = 0; } else this.i = (this.i + 1) % SAMY_SEARCH.length; } else this.face = Math.atan2(R[1] - s.y, R[0] - s.x) + Math.sin(Game.time * 9) * 0.25; }
        else { this.t += dt; this.face = R[3] * Math.PI / 2 + Math.sin(this.t * 3.2) * 0.7; s.person.dir = Ser.dirOf(this.face); if (this.t > 1.6) { this.phase = 'walk'; this.i = (this.i + 1) % SAMY_SEARCH.length; } }   // (frantic: the torch jerking about)
        s.light.x = Math.round(Math.cos(this.face) * 26); s.light.y = Math.round(Math.sin(this.face) * 18) - 6;
        // he finds you, or you get right up behind him first
        const v = Ser.sees(s, this.face, 4.6 * TILE, 0.5), d = Math.hypot(p.x - s.x, p.y - s.y);
        this.seenT = v ? this.seenT + dt : Math.max(0, this.seenT - dt);
        if (this.seenT > 0.45) { this.how = 'seen'; s.person.dir = Ser.dirOf(Math.atan2(p.y - s.y, p.x - s.x)); startDialogue('c1b_so_start'); this.freeze = true; }
        else if (d < 42 && !v) { this.how = 'behind'; s.person.dir = Ser.dirOf(Math.atan2(p.y - s.y, p.x - s.x)); startDialogue('c1b_so_start'); }
    },
    draw(g, cx, cy) {
        const A = pa(g), m = Game.map, s = this.samy; if (!s || s.gone) return;
        const a = this.face, r = 4.6 * TILE, h = 0.5, pts = [[Math.round(s.x - cx), Math.round(s.y - 4 - cy)]];
        for (let k = 0; k <= 18; k++) { const b = a - h + 2 * h * k / 18, ux = Math.cos(b), uy = Math.sin(b); let t = 10; while (t < r && !World.blocked(m, s.x + ux * t - 2, s.y - 4 + uy * t - 2, 4, 4)) t += 6; pts.push([Math.round(s.x + ux * t - cx), Math.round(s.y - 4 + uy * t - cy)]); }
        const hot = this.seenT > 0; g.globalAlpha = hot ? 0.34 : 0.2; A.poly(pts, hot ? '#ff5040' : '#ffe060'); g.globalAlpha = 1;
        for (let k = 1; k + 1 < pts.length; k++) A.line(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], hot ? '#ff8070' : '#fff0a0');
        const VW = Game.VW;
        Txt.draw(g, 'SAMY', VW >> 1, 6, { col: '#ffe890', shadow: '#1c1814', align: 'center' });
        Txt.draw(g, 'He\'s tearing the chambers apart. Let him find you, or get right up behind him.', VW >> 1, 18, { col: '#ffffff', shadow: '#1c1814', align: 'center' });
    },
    // it's over, one way or another
    end(fate) {
        sflag('c1b_standoff_done', true); sflag('ch1b_samy_fate', fate); taskDone('c1b_standoff');
        if (this.samy) World.removeEnt(this.map, this.samy);
        const g = this.map && this.map.ents.find(e => e.id === 'c1b_nightghaf'); if (g) g.gone = true;          // (gone up the steps to his father)
        task('c1b_note', 'The night is nearly over. Somewhere nobody can see you, look at the Codex properly: SPACE on it in your bag (Esc → BAG), or sit on the ghaffir\'s bench.');
    },
};
// hand the galleries over to Panic while it's on (poke/ch1b_serapeum.js does the rest of the time)
(function () {
    const _f = Ser.frame, _d = Ser.draw, _e = Ser.enter;
    Ser.frame = function (dt) { if (Game.map.key === 'INT_SERAPEUM' && Panic.on()) { if (!Dlg.active) Panic.frame(dt); return; } return _f.call(this, dt); };
    Ser.draw = function (g, cx, cy) { if (Game.map.key === 'INT_SERAPEUM' && Panic.on()) return Panic.draw(g, cx, cy); return _d.call(this, g, cx, cy); };
    Ser.enter = function (m) { _e.call(this, m); if (sflag('c1b_standoff_done')) { const g = m.ents.find(e => e.id === 'c1b_nightghaf'); if (g) g.gone = true; } if (panicOn() && !sflag('c1b_standoff_done')) Panic.enter(m); };
})();
STORY_SCRIPTS.c1b_samy_panic = 'c1b_so_start';                      // (walking right up to him is coming up behind him: Panic.how stays null, read as 'behind')
STORY_SCRIPTS.c1b_nightghaf = (f => () => panicOn() ? 'c1b_so_ghaf' : f())(STORY_SCRIPTS.c1b_nightghaf);
scene('c1b_so_ghaf', { speaker: 'Night Ghaffir', text: `The night ghaffir is crouched behind the workbench with his lantern turned right down, shaking. "Is he gone? Inspector, is he gone? He has a knife. He was screaming about a bag. What bag?"`, choices: [{ text: '"Stay here. Stay down."' }] });

// ---- the standoff ----
const knifeLine = () => (Panic.how || 'behind') === 'behind' ? `You're right behind him before he knows it. He spins round, the torch in your eyes, a kitchen knife coming up in his other hand—` : `The torch finds you, and stops.\n\n"You." Samy's voice cracks in the middle. His shirt is torn, his face grey with dust and sweat, and in his other hand there's a kitchen knife, the cheap kind with a wooden handle.`;
scene('c1b_so_start', {
    speaker: 'System',
    text: () => knifeLine() + ((Panic.how || 'behind') === 'behind' ? '' : `\n\n"It was you. It was you! Where is it? Karim's man opened the bag and there was a BRICK in it. Give it to me. Give it to me!"`),
    get choices() {
        if ((Panic.how || 'behind') === 'behind') return [{ text: 'Grab his wrist, and twist.', onSelect: () => { sflag('c1b_so_disarmed', true); startDialogue('c1b_so_disarm'); } }];
        const c = [{ text: '"Put the knife down, Samy. Nobody gets hurt tonight."', nextScene: 'c1b_so_talk' }, { text: '"It\'s somewhere safe. And you\'re finished."', nextScene: 'c1b_so_lunge' }];
        if (hasItem('Dart pistol')) c.push({ text: 'Shoot the dart.', nextScene: 'c1b_so_dart' });
        c.push({ text: 'Run for the steps.', nextScene: 'c1b_so_run' });
        return c;
    },
});
scene('c1b_so_disarm', { speaker: 'System', text: `The knife clatters on the stone and skids under a sarcophagus. Samy staggers back against the granite, torch shaking, and sits down hard, as if his legs have been cut.\n\n"It was you," he says, not even angry. "It was you. Karim's man opened the bag and there was a brick in it."`, choices: [{ text: '"Yes. It was me."', nextScene: 'c1b_so_talk' }] });
scene('c1b_so_lunge', {
    speaker: 'System',
    text: `"Finished?" Something goes out of his face. He comes at you, the knife low, the torch swinging, not like a man who knows how but like a man with nothing left, which is worse.`,
    get choices() {
        const c = [];
        if (hasItem('Dart pistol')) c.push({ text: 'Shoot the dart.', nextScene: 'c1b_so_dart' });
        c.push({ text: 'Get the sarcophagus between you. "Wait! Samy, wait!"', nextScene: 'c1b_so_talk' });
        c.push({ text: 'Run for the steps.', nextScene: 'c1b_so_run' });
        return c;
    },
});
scene('c1b_so_talk', {
    speaker: 'Samy Ragab',
    text: () => (sflag('c1b_so_disarmed') ? '' : `The knife wavers. Lowers. `) + `He's shaking so hard the torch beam jitters over the granite.\n\n"You don't understand. You don't understand anything. If Karim thinks I kept it... If the Swiss finds out... They'll kill me. They'll kill my mother."`,
    get choices() {
        const c = [{ text: '"Then tell me everything. From the start."', nextScene: 'c1b_so_confess' }];
        if (hasItem('Cigarette ends (Cleopatra)')) c.unshift({ text: '"Cleopatra, Samy. Four ends by the service door and a packet crushed flat. The motorbike. I know already."', onSelect: () => { sflag('c1b_so_evidence', true); startDialogue('c1b_so_confess'); } });
        return c;
    },
});
scene('c1b_so_confess', {
    speaker: 'Samy Ragab',
    text: () => (sflag('c1b_so_evidence') ? `He looks at the evidence bag in your hand and laughs, a horrible little laugh. "Cleopatra. My mother always said they would be the death of me."\n\n` : '') +
        `It comes out of him all at once, the way water comes out of a burst pipe.\n\n"Karim el-Gebali. He came to me five days ago, the same night the foreign doctor, Hale, brought it in for safekeeping. How did he know? I don't know how he knew. Twenty thousand pounds to take it out of the store before the Colonel came for it. The Swiss wants it, you understand? The Foundation. Vasse. He asked the Colonel to get it for him the proper way, with papers. Karim was going to sell it to him the other way, for ten times the money, and the Colonel's box would be empty and it would be Fathi's problem, not mine."\n\n"Fathi?" He wipes his face. "Fathi knows nothing. Fathi knows only how not to know."\n\n"I needed the money. My mother's kidneys. I'm not a thief, I'm..." He runs out of words. "What happens now?"`,
    choices: [{ text: 'Take him to the Director.', nextScene: 'c1b_so_expose' }, { text: '"Go. Get out of Saqqara before Karim finds you."', nextScene: 'c1b_so_flee' }],
});
scene('c1b_so_dart', {
    speaker: 'System',
    text: `The dart pistol coughs. Samy looks down at the red tuft in his shoulder, and then at you, and says "Oh," in a small, surprised voice.\n\nHe sits down against the granite, slowly, very carefully, like a man lowering himself into a hot bath. The torch rolls out of his hand. The knife stays where it falls. In a minute he's snoring.`,
    choices: [{ text: 'Phone the Director.', onSelect: () => { sflag('c1b_so_darted', true); dropItem('Dart pistol'); startDialogue('c1b_so_expose'); } }, { text: 'Take his knife, and leave him to sleep it off.', onSelect: () => { sflag('c1b_so_darted', true); dropItem('Dart pistol'); startDialogue('c1b_so_flee'); } }],
});
scene('c1b_so_run', {
    speaker: 'System',
    text: `You run. Up the gallery, round the corner, up the steps three at a time, the Codex banging against your ribs, his torch jerking along the rock behind you and his voice screaming your name.\n\nAt the top the old ghaffir slams the gate behind you and turns the key, and stands with his back to it.\n\nSamy doesn't follow. Later, much later, you hear a motorbike go off down the road toward Cairo with its light off. By morning he's gone from Saqqara, and nobody knows where.`,
    choices: [{ text: 'Get your breath back.', onSelect: () => { Panic.end('ran'); storyNote('Samy Ragab', 'Came back to the Serapeum with a torch and a knife, looking for the Codex. I ran. By morning he was gone from Saqqara, and nobody knows where.'); Game.goOutside(); } }],
});
scene('c1b_so_expose', {
    speaker: 'Director Fathi',
    text: () => (sflag('c1b_so_darted') ? `You phone the Director. He arrives twenty minutes later in a coat over his pyjamas, with the old ghaffir and a torch, and looks for a long time at Samy snoring against a sarcophagus.` : `You walk Samy up the steps, and phone the Director. He arrives twenty minutes later in a coat over his pyjamas, and looks for a long time at Samy sitting on the bottom step with his head in his hands.`) +
        `\n\nYou can watch Fathi work out which way the wind is blowing. It takes him about four seconds.\n\n"Inspector Ragab, you are suspended from duty. The Tourist Police will speak to you in the morning." Then, to you, lower: "And the... item?"\n\nSamy looks at you, and at your jacket, and says nothing.\n\n"Karim el-Gebali's man took it," you say. "Samy was paid to put it where they could."\n\nFathi closes his eyes. "Then it's Karim's problem," he says. "And the Colonel's. Not ours." He sounds almost grateful.`,
    choices: [{ text: 'Walk away before he asks anything else.', onSelect: () => {
        sflag('ch1b_samy_exposed', true); rel('samy', -30, true); rep('ministry', 5, true);
        storyNotice('Karim el-Gebali\'s people will hear about this.');
        storyNote('Samy Ragab', 'Confessed' + (sflag('c1b_so_darted') ? ' (after the dart wore off)' : '') + ': Karim el-Gebali paid him twenty thousand pounds to take the Codex out of the store before Colonel Radwan collected it for Vasse; Karim meant to sell it to Vasse himself for ten times as much. I handed him to Fathi. He\'s suspended, and the Tourist Police will have him in the morning.');
        Panic.end('exposed'); if (Game.map.key === 'INT_SERAPEUM') Game.goOutside();
    } }],
});
scene('c1b_so_flee', {
    speaker: 'Samy Ragab',
    text: () => sflag('c1b_so_darted') ? `You take the knife and leave him there, snoring against a sarcophagus, the night ghaffir watching over him from a safe distance.\n\nAn hour later your phone buzzes. A number you don't know. "I woke up with my knife gone and nobody's police in my face," the message says. "I don't know why. I'm going to my cousin in Alexandria. If you ever need anything. Anything. — S."` : `He stares at you as if you've spoken Chinese. Then he understands, and his face crumples.\n\n"Why?" You don't answer. He doesn't wait for one. "I'm going to my cousin in Alexandria. Karim won't look for me there, not for a while." At the foot of the steps he turns. "If you ever need anything. Anything. I owe you. Samy Ragab pays his debts." He almost laughs. "Some of them."`,
    choices: [{ text: 'Let him go.', onSelect: () => {
        sflag('ch1b_samy_informant', true); rel('samy', 25, true);
        storyNotice('Samy Ragab will remember this.');
        storyNote('Samy Ragab', (sflag('c1b_so_darted') ? 'I darted him and let him sleep it off instead of calling Fathi. ' : 'He confessed: Karim el-Gebali paid him twenty thousand pounds to take the Codex out of the store before Colonel Radwan collected it for Vasse; Karim meant to sell it to Vasse himself. I let him go. ') + 'He\'s gone to his cousin in Alexandria. He says he owes me.');
        Panic.end('fled');
    } }],
});
TASK_TARGETS.c1b_standoff = () => Game.map.key === 'INT_SERAPEUM' ? { room: 'INT_SERAPEUM', id: 'c1b_samy_panic', out: 'c1b_serapeum' } : 'c1b_serapeum';
TASK_TARGETS.c1b_note = () => null;
