// ============================================================
// THE CODEX OF GIZA — POKE STYLE: SAQQARA'S SIDE QUESTS (poke/ch1b_side.js)
// The bible's SQ-01B-01 to 09 (story/regions/ch01_opening_inspector.md):
//   01 Umm Sabry's Price     who's romancing the accountant (the well girls know)
//   02 The Camel Men         fine them, let them go, or organize them (rides later)
//   03 Rais Gad's Tunnel     a night stakeout at the robbers' hole; Qurna men
//   04 The Colossus          a lost boy at the colossus; his parents at the coach park
//   05 The Forged Seal       more seals in the mastaba field: it's Samy
//   06 The Serdab's Eyes     photograph Djoser through the eye holes
//   07 The Café's Backgammon beat the champion at tawla (poke/ch1b_tawla.js)
//   08 The Well Girls        find their jerrycan's cap in the market
//   09 The Mechanic's Receipt  the receipt for Samy's motorbike (extra lines in beat 6)
// Nameless locals only, besides the bible's cast.
// ============================================================

Object.assign(REL_NAMES, { village: 'Mit Rahina' });
const taskOn = id => Story.s.tasks.some(t => t.id === id && !t.done);
const dayNow = () => { const c = Story.s.clock; return c >= 6 * 60 && c < 21 * 60; };

// ---- the new people and things ----
Object.assign(LOOKS, {
    girl1: { skin: 4, robe: ['#f0a0b8', '#d880a0', '#b06080'], head: 'hijab', headCol: ['#f4f0e0', '#dcd8c8', '#b8b4a4'], kid: true, shoeKind: 'sandals', shoe: '#d04838' },
    girl2: { skin: 5, top: ['#f0d040', '#d0b020', '#a88c10'], topKind: 'tunic', legs: CLOTH.indigo, hairStyle: 'long', hairCol: HAIRS[0], kid: true, shoeKind: 'sandals', shoe: '#3a70c8' },
    tawlaman: { skin: 3, robe: ['#a8a898', '#88887a', '#6a6a5c'], head: 'skullcap', headCol: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], face: 'tache', tache: '#f0f0f0', shoeKind: 'babouche', shoe: '#c8a060' },
    lostkid: { skin: 0, top: ['#8ad0f0', '#60b0e0', '#3a88c0'], topKind: 'football', legs: CLOTH.linen, botKind: 'shorts', hairCol: HAIRS[7], kid: true, shoeKind: 'sneakers', shoe: '#ffffff' },
    mum: { skin: 1, top: ['#f4f0e4', '#dcd8cc', '#b8b4a8'], topKind: 'tunic', legs: CLOTH.khaki, botKind: 'skirt', head: 'straw', hairCol: HAIRS[5], hairStyle: 'long', shoeKind: 'sandals', shoe: '#804c28', slim: true },
    dad: { skin: 0, top: ['#5a8a5a', '#3e6e3e', '#2a522a'], topKind: 'shirt', legs: CLOTH.khaki, botKind: 'shorts', head: 'cap', headCol: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], hairCol: HAIRS[7], acc: 'camera', shoeKind: 'sneakers', shoe: '#f4f4f0' },
});
Object.assign(CAST, { c1b_girl1: 'girl1', c1b_girl2: 'girl2', c1b_tawlaman: 'tawlaman', c1b_lostkid: 'lostkid', c1b_mum: 'mum', c1b_dad: 'dad' });
POKE_MAP_1B.objects.push(
    { id: 'c1b_girl1', label: 'Girl', model: 'girl', dir: 0, say: null }, { id: 'c1b_girl2', label: 'Girl', model: 'girl', dir: 1, say: null },
    { id: 'c1b_tawlaman', label: 'Old Man at Tawla', model: 'old man', dir: 0, say: null },
    { id: 'c1b_lostkid', label: 'Little Boy', model: 'boy', dir: 0, say: null }, { id: 'c1b_mum', label: 'Tourist', model: 'tourist', dir: 2, say: null }, { id: 'c1b_dad', label: 'Tourist', model: 'tourist', dir: 1, say: null },
    { id: 'c1b_cap', label: 'Blue Cap', model: 'jerrycan cap', say: null },
);
SPR.c1b_cap = (w, d) => { const st = propStage(w, d, 10, 8), { A } = st; A.ell(st.x + 5, st.y + 4, 4, 3, '#2a5aa8'); A.ell(st.x + 5, st.y + 3, 3, 2, '#4a8ae0'); A.px(st.x + 4, st.y + 2, '#a8d0ff'); return Object.assign(propFit(st, w, d, { flat: true }), { sparkle: true }); };
// the three sealed mastabas on the register get their seals drawn on (the fourth has the robbers' hole beside it)
for (const id of ['c1b_mastaba1', 'c1b_mastaba2', 'c1b_mastaba3']) SPR[id] = (w, d, o) => { const sp = SPR_L['mastaba'](w, d, o), A = pa(sp.c.getContext('2d')), dx = 1 + Math.round(w * 0.35) + 10, fy = 7 + d - 10; tombSeal(A, dx, fy + 14); return sp; };

// ---- who's about by day only, and who's gone for good ----
const SIDE_GONE = {
    c1b_cap: () => sflag('c1b_cap_taken'), c1b_lostkid: () => sflag('c1b_kid_found'), c1b_mum: () => sflag('c1b_kid_found'), c1b_dad: () => sflag('c1b_kid_found'),
};
const DAY_ONLY = ['c1b_kid1', 'c1b_kid2', 'c1b_oldman1', 'c1b_oldman2', 'c1b_girl1', 'c1b_girl2', 'c1b_tourist1', 'c1b_tourist2', 'c1b_guide', 'c1b_cameleer', 'c1b_lostkid', 'c1b_mum', 'c1b_dad', 'c1b_ball'];
(function () {
    const Ar = AREAS.inspector, _frame = Ar.frame;
    let map = null, list = null;
    Ar.frame = function (dt) {
        _frame.call(this, dt);
        const m = Game.maps.ch1; if (!m) return;
        if (map !== m) { map = m; list = [...new Set([...DAY_ONLY, ...Object.keys(SIDE_GONE)])].map(id => m.ents.find(e => e.id === id)).filter(Boolean); }
        const day = dayNow();
        for (const e of list) { const gone = (SIDE_GONE[e.id] && SIDE_GONE[e.id]()) || (DAY_ONLY.includes(e.id) && !day); if (!!e.gone !== gone) { e.gone = gone; if (e.spr && e.spr.solid) World.setSolid(m, e, !gone); } }
    };
})();

// ============================================================
// SQ-01B-08 THE WELL GIRLS, and SQ-01B-01 UMM SABRY'S PRICE
// ============================================================
STORY_SCRIPTS.c1b_girl1 = STORY_SCRIPTS.c1b_girl2 = 'c1b_girls';
scene('c1b_girls', {
    speaker: 'Girl',
    text: () => sflag('c1b_girls_done') ? `The two girls are hauling the jerrycan home between them, sloshing, the blue cap screwed on tight. "Shukran, ya Ustaz!" they shout, both at once, for the third time.`
        : hasItem('Jerrycan cap') ? `Two girls by the well with a yellow jerrycan full to the brim and no cap. You hold up the blue cap from the market, and they shriek.`
        : `Two girls by the well, nine or ten, with a yellow jerrycan full to the brim and no cap on it. The smaller one is close to tears.\n\n"We lost the cap. Mama will kill us. She said: you lose that cap, I lose you." The bigger one points at the market. "We had it when we bought the bread. By the cloth man."`,
    get choices() {
        if (sflag('c1b_girls_done')) return [{ text: 'Wave.' }];
        if (hasItem('Jerrycan cap')) return [{ text: 'Give them the cap.', nextScene: 'c1b_girls_thanks' }];
        return [{ text: '"I\'ll look for it."', onSelect: () => { if (!taskOn('c1b_wellgirls')) task('c1b_wellgirls', '(The Well Girls) Two girls at the village well have lost their jerrycan\'s cap in the market, by the cloth stall.'); } }, { text: 'Leave them to it.' }];
    },
});
scene('c1b_girls_thanks', {
    speaker: 'Girl',
    text: `"Mama won't kill us!" The cap goes on, the jerrycan goes up between them, and the bigger girl, overcome with gratitude, tells you the most valuable thing she knows.\n\n"The baker likes Madame Nadia. The accountant, from your office. Every morning he puts an extra loaf in her bag, a special one, and she pretends she doesn't see. Everybody knows." She thinks. "Except Madame Nadia."`,
    choices: [{ text: '"Is that so?"', onSelect: () => {
        dropItem('Jerrycan cap'); sflag('c1b_girls_done', true); sflag('c1b_gossip', true); taskDone('c1b_wellgirls'); rel('village', 5, true);
        storyNote('The well girls', 'The baker is sweet on Madame Nadia, the inspectorate\'s accountant: an extra loaf in her bag every morning. Umm Sabry wanted to know who was romancing the accountant.');
        storyNotice('Mit Rahina will remember that.');
    } }],
});
STORY_SCRIPTS.c1b_cap = 'c1b_cap_find';
scene('c1b_cap_find', {
    speaker: 'System',
    text: `A blue plastic cap in the dust under the cloth stall, the kind that screws onto a jerrycan. It's been trodden on, but it'll screw on.`,
    choices: [{ text: 'Pick it up.', onSelect: () => { pocket('Jerrycan cap'); sflag('c1b_cap_taken', true); Sfx.get(); } }, { text: 'Leave it.' }],
});
ITEM_INFO['Jerrycan cap'] = { desc: 'A blue plastic jerrycan cap from under the cloth stall in the market. Somebody\'s mother is looking for it.' };
(function () {
    const s = STORY.c1b_umsabry, cg = Object.getOwnPropertyDescriptor(s, 'choices').get;
    Object.defineProperty(s, 'choices', { get() { const c = cg.call(this); if (sflag('c1b_gossip') && !sflag('c1b_price_paid')) c.unshift({ text: '"The accountant, Umm Sabry. I know who."', nextScene: 'c1b_price' }); return c; }, configurable: true });
})();
scene('c1b_price', {
    speaker: 'Umm Sabry',
    text: `You tell her. Umm Sabry puts the kettle down, which you have never seen her do.\n\n"The BAKER? That flour-headed..." She laughs until she has to wipe her eyes on her sleeve. "Madame Nadia. Of course. The loaves. I thought she was eating for two." She pats your hand. "You pay your debts. Good."\n\n"Now. For you." She leans in. "The Director keeps a second telephone in his desk drawer. The old kind, the kind with buttons. It only rings on Tuesdays." She sits back. "And if you ever need anything, from anyone on this site, from anyone in Mit Rahina, from anyone's cousin in Cairo, you come to Umm Sabry."`,
    choices: [{ text: '"Shukran, Umm Sabry."', onSelect: () => {
        sflag('c1b_price_paid', true); sflag('ch1b_umsabry_network', true); taskDone('c1b_accountant'); rel('umsabry', 10, true);
        storyNote('Umm Sabry', 'Paid her price (the baker and Madame Nadia, the accountant). Her tip: the Director keeps a second, old telephone in his desk drawer that only rings on Tuesdays. And her network is mine: anyone on this site, anyone in Mit Rahina, anyone\'s cousin in Cairo.');
        storyNotice('Umm Sabry will remember this. So will her cousins.');
    } }],
});

// ============================================================
// SQ-01B-02 THE CAMEL MEN
// ============================================================
STORY_SCRIPTS.c1b_cameleer = () => sflag('c1b_camels') === 'organized' ? 'c1b_camel_ride' : sflag('c1b_camels') ? 'c1b_cameleer' : 'c1b_camels';
scene('c1b_camels', {
    speaker: 'System',
    text: `On top of a camel, a tourist in a sunhat is shouting down: "You said TWENTY!"\n\nThe camel man, smiling up at her with enormous patience: "Twenty to get on, madame. Two hundred to get down."\n\nThe camel sits there chewing, in on it. Then the camel man sees your Ministry card, and the smile stays exactly where it is while everything behind it rearranges. "Inspector! My camel, very licensed. The licence is at home. With my other camel."`,
    choices: [
        { text: 'Fine him: no licence, and that\'s extortion.', onSelect: () => { sflag('c1b_camels', 'fined'); rep('ministry', 5, true); rel('village', -5, true); startDialogue('c1b_camels_fined'); } },
        { text: '"Get the lady down. Twenty. And we never met."', onSelect: () => { sflag('c1b_camels', 'let'); rel('village', 2, true); startDialogue('c1b_camels_let'); } },
        { text: 'Organize them: one fair price on a board, for everyone, and a licence with your name on the form.', onSelect: () => { sflag('c1b_camels', 'organized'); rel('village', 6, true); rep('ministry', 2, true); startDialogue('c1b_camels_org'); } },
    ],
});
scene('c1b_camels_fined', { speaker: 'Camel Man', text: `He pays the fine, in small notes, very slowly, looking at you the whole time. The lady gets down for free. By noon every camel man at Saqqara knows your face, and not in a good way.`, choices: [{ text: 'Write the ticket.', onSelect: () => { storyNote('The camel men', 'I fined them for unlicensed rides and extortion. They know my face now.'); storyNotice('The camel men will remember this.'); } }] });
scene('c1b_camels_let', { speaker: 'Camel Man', text: `"Twenty, madame, twenty, of course, a joke, an Egyptian joke!" The lady comes down with dignity and a story for her friends. The camel man winks at you. You pretend you didn't see.`, choices: [{ text: 'Move on.', onSelect: () => storyNote('The camel men', 'Caught a camel man charging "twenty to get on, two hundred to get down". I let it go.') }] });
scene('c1b_camels_org', {
    speaker: 'Camel Man',
    text: `It takes an hour, three glasses of tea, two cousins and a piece of cardboard. At the end of it, propped against the souvenir stall in careful marker: CAMEL RIDE, 50 POUNDS. UP AND DOWN. And a Ministry licence form, filled in, with your name at the bottom as the officer who witnessed it.\n\nThe camel man reads the board as if it were poetry. "Up and down," he says. "Fifty. Honest." He sounds amazed. "Inspector, my camel is your camel. Any time you need to be somewhere, you shout."`,
    choices: [{ text: '"I will."', onSelect: () => { storyNote('The camel men', 'Organized them: one price, fifty pounds, up and down, on a board, and a licence form with my name on it. The camel men will give me a ride any time.'); storyNotice('The camel men will remember this.'); } }],
});
scene('c1b_cameleer', { speaker: 'Camel Man', text: () => sflag('c1b_camels') === 'fined' ? `The camel man looks straight through you. The camel, less diplomatic, spits.` : `The camel man salutes you with his stick. "Twenty, Inspector! Twenty only!" The camel looks as if it has heard that before.`, choices: [{ text: 'Move on.' }] });
const CAMEL_TO = { serapeum: [7.5, 10.5, 'the Serapeum'], village: [62, 27.5, 'Mit Rahina'], office: [38.5, 26.8, 'the inspectorate'], teti: [33, 14, 'the Teti dig'] };
scene('c1b_camel_ride', {
    speaker: 'Camel Man',
    text: `"Inspector! My camel is your camel. Where to? Free for you. Don't tell the others."`,
    get choices() {
        return Object.entries(CAMEL_TO).map(([k, [tx, ty, name]]) => ({ text: 'To ' + name + '. (10 minutes)', onSelect: () => Game.fadeTo(() => { const p = Game.player; p.x = tx * TILE; p.y = ty * TILE; p.dir = DIR.down; clockAdvance(10); Toast.show('The camel folds up like a deckchair and lets you off.'); }) })).concat([{ text: 'Not now.' }]);
    },
});

// ============================================================
// SQ-01B-03 RAIS GAD'S TUNNEL
// ============================================================
(function () {
    const s = STORY.c1b_gad_dig; s.choices = [{ text: '"Then I\'ll make it your business. I\'ll watch the mastaba field tonight."', onSelect: () => { if (!taskOn('c1b_tunnel') && !sflag('c1b_tunnel_done')) task('c1b_tunnel', '(Rais Gad\'s Tunnel) Someone has dug into a closed mastaba in the mastaba field: the fresh hole. Stake it out after dark.'); } }, { text: '"Maybe I will."' }];
    const g = STORY.c1b_gad, cg = Object.getOwnPropertyDescriptor(g, 'choices');
    const base = cg && cg.get ? cg.get : () => g._baseChoices; if (!(cg && cg.get)) g._baseChoices = g.choices;
    Object.defineProperty(g, 'choices', { get() { const c = base.call(this).slice(); if (hasItem('Wedjat amulet')) c.unshift({ text: 'Show him what the robbers dropped.', nextScene: 'c1b_gad_amulet' }); return c; }, configurable: true });
})();
STORY_SCRIPTS.c1b_robtunnel = () => taskOn('c1b_tunnel') ? (dayNow() ? 'c1b_tunnel_day' : 'c1b_tunnel_night') : null;
scene('c1b_tunnel_day', { speaker: 'System', text: `The robbers' hole: fresh spoil, and a tunnel going in under the mastaba's wall, braced with a stolen plank. Nobody digs in daylight. Come back after dark.`, choices: [{ text: 'Later.' }] });
scene('c1b_tunnel_night', {
    speaker: 'System',
    text: () => `The robbers' hole, in the dark, at ${clockStr()}. The desert is silver under the moon, and utterly quiet. There's a hollow behind the next mastaba where someone could lie and watch.`,
    choices: [{ text: 'Lie in the hollow and watch. (it could be a while)', onSelect: () => c1aRest(35, 'c1b_tunnel_robbers') }, { text: 'Not now.' }],
});
scene('c1b_tunnel_robbers', {
    speaker: 'System',
    text: `A lamp, low to the ground. Two men, young, in dark galabeyas, a sack and a short crowbar. They go straight to the hole like men going to work, and one slides in on his back while the other holds the lamp and watches the wrong way.\n\nVoices from under the ground, and the accent isn't Saqqara's: it's the south, the West Bank at Luxor. Qurna.\n\nThe one with the lamp hisses down the hole: "Hurry. Hagg Mahmoud won't like this. We're not supposed to be up here at all."`,
    get choices() {
        const c = [{ text: 'Stand up and shout: "Ministry! Stay where you are!"', nextScene: 'c1b_tunnel_shout' }];
        c.unshift({ text: 'Photograph them first (C). Then shout.', onSelect: () => { sflag('c1b_tunnel_photo', true); Camera.flash = 0.35; Sfx.tone(2400, 0.03, 'square', 0.05); const P = Story.s.photos || (Story.s.photos = []); P.unshift({ what: 'Two Qurna men at the robbers\' hole', t: clockStr(), where: 'Mastaba field' }); skillXP('photography', 20); startDialogue('c1b_tunnel_shout'); } });
        return c;
    },
});
scene('c1b_tunnel_shout', {
    speaker: 'System',
    text: () => (sflag('c1b_tunnel_photo') ? `The flash goes off like a gunshot. ` : '') + `"MINISTRY!"\n\nThe one in the hole comes out of it backwards faster than you'd think a man could. The lamp goes over; the sack goes flying; and they're away across the desert, two shadows running for the road, one of them shouting something about his mother.\n\nIn the sand by the hole, spilled out of the sack: a little blue-green eye, a wedjat, in faience, perfect, three thousand years old and still bright.`,
    choices: [{ text: 'Pick it up carefully.', onSelect: () => {
        pocket('Wedjat amulet'); sflag('c1b_tunnel_done', true); taskDone('c1b_tunnel'); skillXP('investigation', 30, 'the stakeout');
        storyNote('Rais Gad\'s tunnel', 'Two young men from Qurna (the old robbing families of Luxor\'s West Bank) came to the robbers\' hole at night. "Hagg Mahmoud won\'t like this," one said. They ran, and dropped a faience wedjat amulet.' + (sflag('c1b_tunnel_photo') ? ' I photographed them.' : ''));
        task('c1b_tunnel_log', '(Rais Gad\'s Tunnel) Show Rais Gad the amulet the robbers dropped, and log it.');
    } }],
});
ITEM_INFO['Wedjat amulet'] = { desc: 'A little faience wedjat, the eye of Horus, blue-green and perfect. Dropped by robbers at the mastaba field. It belongs in the register.' };
scene('c1b_gad_amulet', {
    speaker: 'Rais Gad',
    text: `Rais Gad turns the little eye over in his enormous fingers as gently as if it were a bird's egg.\n\n"Qurna men." He isn't surprised. "The old families. They've been lifting the dead since before your Ministry was a word. They don't usually come this far north. Someone paid them to." He hands it back. "Log it. Your name. The Ministry likes a name on a find, and today it can be yours."`,
    choices: [{ text: 'Log it in the site register.', onSelect: () => { dropItem('Wedjat amulet'); taskDone('c1b_tunnel_log'); rep('ministry', 10); rel('gad', 5, true); storyNote('Rais Gad', 'Logged the robbers\' wedjat amulet in the site register under my name. "Qurna men. The old families. Someone paid them to come this far north."'); } }],
});

// ============================================================
// SQ-01B-04 THE COLOSSUS
// ============================================================
STORY_SCRIPTS.c1b_lostkid = 'c1b_lostkid';
scene('c1b_lostkid', {
    speaker: 'Little Boy',
    text: `A little boy, six or seven, in a football shirt, standing by the fallen colossus and crying without any noise at all, which is the worst kind.\n\n"Je... I lost Maman." He hiccups. "We came on the bus. From the big pyramid with the steps. Papa said don't move. I moved."`,
    choices: [{ text: '"Stay right here, by the big king. I\'ll find them."', onSelect: () => { if (!taskOn('c1b_colossus')) task('c1b_colossus', '(The Colossus) A little boy is lost at the colossus in Mit Rahina. His parents came on the tour bus from the Step Pyramid: the coach park.'); } }],
});
STORY_SCRIPTS.c1b_mum = STORY_SCRIPTS.c1b_dad = () => taskOn('c1b_colossus') ? 'c1b_parents_found' : 'c1b_parents';
scene('c1b_parents', {
    speaker: 'Tourist',
    text: `Two tourists by the bus, frantic, the woman with a phone that has no signal. "Please, have you seen a little boy? Léo, seven, a football shirt, blue? He was with us at the pyramid, and then the bus went to the museum, and then back, and he... we thought he was with the group!"`,
    choices: [{ text: '"I\'ll look for him."', onSelect: () => { if (!taskOn('c1b_colossus')) task('c1b_colossus', '(The Colossus) A French couple at the coach park have lost their son Léo, seven, blue football shirt. The tour bus went to the colossus museum in Mit Rahina.'); } }],
});
scene('c1b_parents_found', {
    speaker: 'Tourist',
    text: `"Léo? You've found Léo?" The woman grabs both your hands.\n\nYou take them down the road to Mit Rahina, the father half running, and there by the colossus is Léo, exactly where you told him to stay, next to a king forty feet long. He has stopped crying and is explaining Ramesses to the guide.\n\nThere's a great deal of French, and hugging. The father presses notes into your hand and won't take them back. "Please. For your kindness." Then, to the guide: "Monsieur, you do tours here? Private?"\n\nThe guide looks at you, and at the father's wallet, and smiles. "The Inspector here does, sometimes. The Step Pyramid. Very knowledgeable."`,
    choices: [{ text: 'Take the money, and wave Léo goodbye.', onSelect: () => {
        Game.fadeTo(() => { sflag('c1b_kid_found', true); taskDone('c1b_colossus'); storyPay(150, 'From Léo\'s father, for finding him'); rel('village', 2, true); sflag('c1b_guide_job', true); clockAdvance(30);
            storyNote('The Colossus', 'Found Léo, a little French boy lost at the colossus, and took his parents to him. His father paid me 150 pounds. The licensed guide says the office wants guides for the Step Pyramid tours: a guiding job, if I want it.'); });
    } }],
});

// ============================================================
// SQ-01B-05 THE FORGED SEAL
// ============================================================
Object.assign(SEALS_1B, {
    m1: { name: 'm1', ring: [1, 6, 3, 7, 0, 4, 5, 2], center: 2, num: '048', clay: 'dry', diffs: [{ el: 'ring', i: 5, to: 2 }], title: 'Mastaba (register 048)' },
    m2: { name: 'm2', ring: [6, 2, 4, 0, 7, 3, 1, 5], center: 4, num: '052', clay: 'old', diffs: [], title: 'Mastaba (register 052)' },
    m3: { name: 'm3', ring: [2, 5, 0, 6, 3, 7, 4, 1], center: 7, num: '061', clay: 'dry', diffs: [{ el: 'ring', i: 5, to: 2 }, { el: 'num', i: 1, to: '8' }], title: 'Mastaba (register 061)' },
});
const MASTABA_SEAL = { c1b_mastaba1: 'm1', c1b_mastaba2: 'm2', c1b_mastaba3: 'm3' };
(function () {
    const f = STORY_SCRIPTS.c1b_fathi;
    STORY_SCRIPTS.c1b_fathi = e => { const k = typeof f === 'function' ? f(e) : f; return k === 'c1b_fathi' && sflag('c1b_fathi_round') && !sflag('c1b_fseal_asked') ? 'c1b_fathi_seals' : k; };
})();
scene('c1b_fathi_seals', {
    speaker: 'Director Fathi',
    text: `"Director. If one seal on the site was forged, the others—"\n\nThe newspaper comes down an inch. Above it, two tired eyes.\n\n"Then check them," he says at last. "The mastaba field: three tombs on the register. Quietly. Nothing in writing until you're sure." The newspaper goes back up. "And Inspector: be sure."`,
    choices: [{ text: '"Yes, Director."', onSelect: () => { sflag('c1b_fseal_asked', true); task('c1b_forgedseal', '(The Forged Seal) Check the seals on the three registered mastabas in the mastaba field, quietly.'); } }],
});
const fsealDone = k => sflag('c1b_fseal_' + k) === 'ok';
for (const id in MASTABA_SEAL) {
    const k = MASTABA_SEAL[id];
    STORY_SCRIPTS[id] = () => taskOn('c1b_forgedseal') ? 'c1b_fseal_' + k : null;
    scene('c1b_fseal_' + k, {
        speaker: 'System',
        get text() { return fsealDone(k) ? `${SEALS_1B[k].title}: checked, and noted in your own book. Not the register. Not yet.` : `A mastaba, a closed one, on the register as number ${SEALS_1B[k].num}. A rope across its door and a lump of clay on the knot, stamped. You open the register at the page.`; },
        get choices() { return fsealDone(k) ? [{ text: 'Move on.' }] : [{ text: 'Check the seal.', onSelect: () => fsealCheck(k) }, { text: 'Later.' }]; },
    });
}
function fsealCheck(k) {
    playMinigame('sealcheck', Object.assign({}, SEALS_1B[k]), r => {
        if (r.left) return;
        clockAdvance(10);
        if (!r.ok) { startDialogue('c1b_seal_again'); return; }
        sflag('c1b_fseal_' + k, 'ok'); skillXP('investigation', r.forged ? 30 : 10, 'a seal');
        if (['m1', 'm2', 'm3'].every(fsealDone)) startDialogue('c1b_fseal_done');
        else Toast.show(`Checked: ${['m1', 'm2', 'm3'].filter(fsealDone).length} of the three mastabas.`);
    });
}
scene('c1b_fseal_done', {
    speaker: 'System',
    text: `Three seals. One honest, old and crumbling. Two forged: good forgeries, dry now, weeks old. And the same mistake in both, the same as on the Serapeum's service door: the sixth sign round the ring is the reed where the register has the loop. The same forger's stamp, used again and again.\n\nYou turn back through the register to the days those seals were last renewed. The same initials against each one, in round, careful handwriting.\n\nS.R.`,
    choices: [{ text: 'Copy the pages.', onSelect: () => {
        sflag('ch1b_forged_seals', true); taskDone('c1b_forgedseal'); pocket('Seal register copies'); rep('ministry', 5, true);
        storyNote('The forged seals', 'Two of the three registered mastabas in the mastaba field have forged seals, made with the same faulty stamp as the Serapeum service door, and the register has S.R. against each renewal: Samy Ragab. Proof, in the Ministry\'s own book, that someone inside is selling Saqqara. If Colonel Radwan ever wanted to be an honest man, this would help him.');
    } }],
});
ITEM_INFO['Seal register copies'] = { desc: 'Copies of three pages of the seal register: two forged mastaba seals with the same faulty stamp as the Serapeum service door, and S.R. against every renewal. Evidence.' };

// ============================================================
// SQ-01B-06 THE SERDAB'S EYES
// ============================================================
STORY_SCRIPTS.c1b_serdab = 'c1b_serdab';
scene('c1b_serdab', {
    speaker: 'System',
    text: () => `A sealed stone box built against the pyramid's north face, tilted back a little, with two round holes drilled through the front at the height of a man's eyes.\n\nInside, in the dark, Djoser: a seated statue (the original is in Cairo; this is a cast, but a good one), looking out through the holes at the northern stars, where the kings went when they died. He has been looking for four thousand six hundred and fifty years.` + (sflag('c1b_serdab_photo') ? '' : `\n\nYou could photograph him through the holes. (C: the camera, facing the serdab.)`),
    choices: [{ text: 'Look through the holes.', onSelect: () => { Picture.show(serdabArt, () => { if (!sflag('c1b_serdab_photo') && !taskOn('c1b_serdab')) task('c1b_serdab', '(The Serdab\'s Eyes) Photograph Djoser through the serdab\'s eye holes: stand facing it and press C.'); }); } }, { text: 'Move on.' }],
});
PHOTO_SUBJECTS.c1b_serdab = 'Djoser, through the serdab\'s eyes';
(function () {
    const f = takePhoto;
    takePhoto = function () {
        const e = Game.target;
        f();
        if (e && e.id === 'c1b_serdab' && !sflag('c1b_serdab_photo')) { sflag('c1b_serdab_photo', true); taskDone('c1b_serdab'); skillXP('photography', 40, 'the serdab'); storyNote('The serdab', 'Photographed Djoser through the two eye holes of his serdab, looking out at the northern stars as he has for 4,650 years.'); setTimeout(() => Notice.show('Djoser, through his eyes. The best photograph you\'ll take this year.'), 400); }
    };
})();
function serdabArt(g, A, W, H) {
    // his face behind the wall: the heavy wig, the headcloth, the moustache, the eyes gouged out by robbers long ago
    A.r(0, 0, W, H, '#0c0a0c');
    const cx = W >> 1, cy = 70;
    A.ell(cx, cy + 6, 70, 64, '#1c1818'); A.poly([[cx - 68, cy - 30], [cx + 68, cy - 30], [cx + 84, cy + 60], [cx - 84, cy + 60]], '#2a2626');                      // the wig and the headcloth
    for (let i = -76; i < 80; i += 8) A.line(cx + i * 0.8, cy - 28, cx + i, cy + 58, '#3a3434');
    A.ell(cx, cy + 4, 40, 50, '#8a7a62'); A.ell(cx - 8, cy - 8, 22, 26, '#a8987c');                                                                              // the face, limestone, the paint long gone
    for (const s of [-1, 1]) { const ex = cx + s * 18, ey = cy - 4; A.ell(ex, ey, 11, 7, '#1c1414'); A.ell(ex, ey, 9, 5, '#0c0808'); A.hl(ex - 12, ey - 9, 24, '#5a4c3c'); A.hl(ex - 10, ey - 10, 20, '#6a5a48'); }   // the empty eyes, the brows
    A.poly([[cx - 4, cy - 2], [cx + 4, cy - 2], [cx + 7, cy + 18], [cx - 7, cy + 18]], '#9a8a70'); A.r(cx - 6, cy + 17, 12, 3, '#6a5a48');                   // the nose, chipped
    A.r(cx - 16, cy + 24, 32, 3, '#3a3030'); A.r(cx - 12, cy + 30, 24, 3, '#6a5a48');                                                                           // the moustache, the mouth
    A.r(cx - 6, cy + 42, 12, 18, '#4a4038'); for (let j = 0; j < 18; j += 3) A.hl(cx - 6, cy + 42 + j, 12, '#3a3030');                                        // the beard
    // the wall, and the two holes you're looking through
    const holes = [[cx - 20, cy - 4], [cx + 20, cy - 4]], R = 15;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (holes.some(([hx, hy]) => (x - hx) ** 2 + (y - hy) ** 2 < R * R)) continue; const h = hash2(x >> 2, y >> 2); A.px(x, y, h > 0.8 ? '#c8b48c' : h > 0.4 ? '#b8a47c' : '#a8946c'); }
    for (const [hx, hy] of holes) for (let k = 0; k < 48; k++) { const a = k / 48 * Math.PI * 2; A.px(Math.round(hx + Math.cos(a) * R), Math.round(hy + Math.sin(a) * R), '#6a5a40'); A.px(Math.round(hx + Math.cos(a) * (R + 1)), Math.round(hy + Math.sin(a) * (R + 1)), '#dcc8a0'); }
    Txt.draw(g, 'DJOSER · THE SERDAB', W >> 1, H - 14, { col: '#3a2a1c', align: 'center' });
}

// ============================================================
// SQ-01B-07 THE CAFÉ'S BACKGAMMON
// ============================================================
STORY_SCRIPTS.c1b_tawlaman = 'c1b_tawla';
scene('c1b_tawla', {
    speaker: 'Old Man at Tawla',
    text: () => sflag('c1b_tawla_won') ? `The old champion is setting up the board for somebody braver. "Once in thirty years is enough for one day," he tells you. "Come back next year. I'll be ready."` : `An old man at the café's best table, a tawla board in front of him inlaid with mother-of-pearl, worn to silk by forty years of thumbs. He hasn't looked up.\n\n"Tawla?" He shakes the dice in his fist like a man who knows exactly what they'll do. "I have not lost at this table since 1994. Ask anyone. Five pounds a game. If you win, the café pays you a hundred, and I buy you tea, and I go home and lie down."`,
    get choices() {
        if (sflag('c1b_tawla_won')) return [{ text: 'Leave the champion in peace.' }];
        return [{ text: 'Play. (5 EGP)', onSelect: () => { storyPay(-5, 'Tawla, the café'); clockAdvance(15); playMinigame('tawla', { skill: 0.7 }, r => { if (r.left) return; startDialogue(r.won ? 'c1b_tawla_win' : 'c1b_tawla_lose'); }); } }, { text: '"Not today."' }];
    },
});
scene('c1b_tawla_win', {
    speaker: 'Old Man at Tawla',
    text: `The old man looks at the board for a long time, as if it has personally betrayed him. The café has gone completely silent. Somebody's tea glass rattles in its saucer.\n\nThen he laughs, a big surprised laugh, and slaps the table. "Thirty years!" He pushes the café's hundred pounds across to you himself. "Abu Hamza, tea for the Inspector! The good glass!"`,
    choices: [{ text: 'Drink the tea.', onSelect: () => { sflag('c1b_tawla_won', true); storyPay(100, 'Beat the champion at tawla'); rel('village', 6, true); drink(15, 'The champion\'s tea'); storyNote('The café\'s champion', 'Beat the old champion of the Mit Rahina café at tawla: his first loss since 1994. The café paid me a hundred pounds and the whole village heard about it by dinner.'); storyNotice('Mit Rahina will be talking about this for weeks.'); } }],
});
scene('c1b_tawla_lose', { speaker: 'Old Man at Tawla', text: `"Again?" He's already setting up the checkers. "Everybody says again. It's a good word. It pays for my tea."`, choices: [{ text: 'Maybe later.' }] });

// ============================================================
// SQ-01B-09 THE MECHANIC'S RECEIPT
// ============================================================
STORY_SCRIPTS.c1b_mechanic = 'c1b_mech';
scene('c1b_mech', {
    speaker: 'Mechanic',
    text: () => hasItem('Motorbike receipt') || sflag('c1b_receipt_taken') ? `The mechanic doesn't come out from under the Fiat. "You found it? Good. I never saw you."` : `The mechanic slides out from under a Fiat on a board. "Samy's bike? Brand new, cash, from Cairo. Where does an inspector get cash, eh? Not from me, I know that."`,
    get choices() {
        if (hasItem('Motorbike receipt') || sflag('c1b_receipt_taken')) return [{ text: 'Move on.' }];
        return [{ text: '"You wouldn\'t still have the receipt?"', nextScene: 'c1b_mech2' }, { text: 'Move on.' }];
    },
});
scene('c1b_mech2', {
    speaker: 'Mechanic',
    text: `He wipes his hands on a rag that makes them dirtier. "Maybe. Everybody's papers go in the glovebox of the red Fiat in there: it's the only thing in this garage that locks." He tosses you a key on a loop of wire. "I never saw you. And bring the key back."`,
    choices: [{ text: 'Take the key.', onSelect: () => { if (!taskOn('c1b_receipt')) task('c1b_receipt', '(The Mechanic\'s Receipt) The receipt for Samy\'s motorbike is in the glovebox of the red Fiat in the Mit Rahina garage.'); } }],
});
STORY_SCRIPTS.c1b_garage = () => taskOn('c1b_receipt') ? 'c1b_glovebox' : null;
scene('c1b_glovebox', {
    speaker: 'System',
    text: `The Fiat's glovebox: a year of paperwork in no order at all, a chocolate bar gone white, a cassette of Abdel Halim. And, near the top, a receipt from a motorbike dealer in Shubra, Cairo: one Haojue 150, red, paid in full, IN CASH, and a name in careful capitals: SAMY RAGAB.\n\nThe date is last Thursday. Two days before the Codex came to Saqqara.`,
    choices: [{ text: 'Take the receipt, and give back the key.', onSelect: () => {
        pocket('Motorbike receipt'); sflag('c1b_receipt_taken', true); taskDone('c1b_receipt'); rel('village', 2, true);
        storyNote('Samy\'s motorbike', 'The receipt, from a dealer in Shubra, Cairo: a red Haojue 150, paid in cash, SAMY RAGAB, dated last Thursday, two days before Dr. Hale brought the Codex in. So somebody paid him before it even arrived.');
    } }],
});
ITEM_INFO['Motorbike receipt'] = { desc: 'A receipt from a Shubra motorbike dealer: one red Haojue 150, paid in cash, SAMY RAGAB. Dated two days before the Codex came to Saqqara.' };
// in beat 6 it changes what Samy and Fathi say (not what happens)
(function () {
    const cf = STORY.c1b_so_confess, ctext = cf.text;
    cf.text = () => (hasItem('Motorbike receipt') ? `You hold up the receipt from the Mit Rahina garage: one red motorbike, cash, Shubra, last Thursday.\n\nHe closes his eyes. "That was a present too. Before it even came here. Karim likes his people to look good."\n\n` : '') + ctext();
    const ex = STORY.c1b_so_expose, etext = ex.text;
    ex.text = () => { const t = etext(); return hasItem('Motorbike receipt') ? t.replace('It takes him about four seconds.', 'It takes him about four seconds, and one look at the receipt you hand him: a motorbike, cash, from Cairo, on an inspector\'s salary. He folds it into his pocket like a winning ticket, and suddenly finds his voice.') : t; };
})();

// ============================================================
// where the compass points; the end card
// ============================================================
Object.assign(TASK_TARGETS, {
    c1b_wellgirls: () => hasItem('Jerrycan cap') ? 'c1b_girl1' : 'c1b_cap', c1b_accountant: () => sflag('c1b_gossip') ? 'c1b_umsabry' : 'c1b_girl1',
    c1b_tunnel: () => 'c1b_robtunnel', c1b_tunnel_log: () => 'c1b_gad', c1b_colossus: () => 'c1b_mum',
    c1b_forgedseal: () => ['c1b_mastaba1', 'c1b_mastaba2', 'c1b_mastaba3'].filter(id => !fsealDone(MASTABA_SEAL[id])),
    c1b_serdab: () => 'c1b_serdab', c1b_receipt: () => 'c1b_garage',
});
window.C1B_END_LINES = [
    f => f.c1b_price_paid && 'You paid Umm Sabry\'s price. Her network is yours.',
    f => ({ fined: 'You fined the camel men. They know your face.', let: 'You let the camel men off.', organized: 'You organized the camel men: fifty pounds, up and down. They\'ll give you a ride.' }[f.c1b_camels]),
    f => f.c1b_tunnel_done && 'You staked out the robbers\' hole: Qurna men, and a name, Hagg Mahmoud.',
    f => f.c1b_kid_found && 'You found Léo at the colossus. There\'s a guiding job, if you want it.',
    f => f.ch1b_forged_seals && 'You found two more forged seals and S.R. in the register.',
    f => f.c1b_serdab_photo && 'You photographed Djoser through his serdab.',
    f => f.c1b_tawla_won && 'You beat the café\'s tawla champion, the first since 1994.',
    f => f.c1b_girls_done && 'You found the well girls\' cap.',
    f => f.c1b_receipt_taken && 'You have the receipt for Samy\'s motorbike.',
];
