// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MIRIAM'S NOTE, AND THE WAY OUT (poke/ch1b_exit.js)
// Chapter 1-B, beat 7, the end of the Inspector's opening.
//   - somewhere quiet (the bag, or the ghaffir's bench), look at the Codex
//     properly: inside the flap, Miriam's note: "Father Bishoy, El-Fishawy,
//     Thursday. Don't trust the police."
//   - a message from an unknown number: Karim, who can count bricks
//   - the exit choice c1_exit: quiet (leave, and vanish on it), legal (Dr. Amira
//     Sayed at the Ministry: rel_amira +15, rep_ministry +10), or deal (Karim's
//     5,000 EGP to "hold it for a week", and you owe the Gebali)
//   - the chapter-end card
// Also: Umm Sabry's Saqqara story (the Inspector-only lore seed): the tomb "where
// the magician's wife and son are painted by the river" (Naneferkaptah, from the
// Setne tale). The bible sets ch10_tomb_known for Inspectors after Ch9 anyway;
// hearing it here is the seed.
// ============================================================

const noteOn = () => Story.s.tasks.some(t => t.id === 'c1b_note' && !t.done);
ITEM_INFO["Miriam's note"] = { key: 1, get desc() { return Game.player.bg === 'inspector' ? 'A page folded small inside the Codex\'s leather flap, in Dr. Miriam Hale\'s hand: "Father Bishoy, El-Fishawy, Thursday. Don\'t trust the police."' : '"Whoever finds this: don\'t give it to Vasse. Take it to Father Bishoy, Café El-Fishawy, Cairo, Thursday. M."'; } };

// ---- looking at it: from the bag, or on the ghaffir's bench ----
(function () {
    const f = ITEM_USE['The Codex'];
    ITEM_USE['The Codex'] = () => {
        if (Game.player.bg === 'inspector' && noteOn()) { if (Menu.open) Menu.toggle(); if (Game.map.people.some(e => !e.gone && Math.hypot(e.x - Game.player.x, e.y - Game.player.y) < 5 * TILE)) { Toast.show('Not here. Somewhere nobody can see you.'); return; } startDialogue('c1b_note_read'); return; }
        if (f) return f(); Toast.show('You keep it close. Not here.');
    };
    const h = STORY.c1b_hut, cg = Object.getOwnPropertyDescriptor(h, 'choices').get;
    Object.defineProperty(h, 'choices', { get() { const c = cg.call(this); if (noteOn()) c.unshift({ text: 'Sit on the bench, and look at the Codex properly.', nextScene: 'c1b_note_read' }); return c; }, configurable: true });
})();
scene('c1b_note_read', {
    speaker: 'System',
    text: `You sit where nobody can see you and take it out, and look at it properly for the first time.\n\nLeaves of papyrus, folded and stitched into a book, in a cover of dark leather with a long flap that wraps round and ties with a thong. You've seen this shape once before, in a museum case in Cairo: the Nag Hammadi books, buried in a jar in the fourth century. The first page is Greek, a careful hand. Beside some lines, in the margin, small marks that look like hieroglyphs and aren't quite.\n\nYou run your thumb along the inside of the flap, and something crackles. A page, folded small, tucked into the fold of the leather. Somebody put it there before this ever went on Shelf 4B.`,
    choices: [{ text: 'Unfold it.', nextScene: 'c1b_note_read2' }],
});
scene('c1b_note_read2', {
    speaker: 'System',
    text: () => `Pencil, in a quick, square hand. You know whose. The logbook entry five days ago, the day before she disappeared, was in the same hand: Dr. M. Hale, for safekeeping pending Ministry review.\n\n    Father Bishoy.\n    El-Fishawy. Thursday.\n    Don't trust the police.\n\nSo that was it. She didn't hide it from the Ministry: she brought it to the Ministry, to a locked inspectorate store, to wait for review by somebody in Cairo she trusted. It was the police she was afraid of: the antiquities police, who come with papers to "collect evidence".` + (sflag('c1b_radwan_seen') ? ` And tonight a colonel of the antiquities police came for it in a black Mercedes, with papers, for a Swiss foundation. She was right.` : ` She must have known they'd come for it.`),
    choices: [{ text: 'Fold it back into the flap.', onSelect: () => {
        pocket("Miriam's note", 1, true); taskDone('c1b_note');
        storyNote("Miriam's note", 'Folded inside the Codex\'s flap, in Dr. Miriam Hale\'s hand: "Father Bishoy, El-Fishawy, Thursday. Don\'t trust the police." El-Fishawy is the old café in Khan el-Khalili, Cairo.');
        storyMessage('Unknown number', 'Inspector. We both know where the brick came from. 5,000 pounds to hold it for a week, somewhere safe, and nobody gets hurt. Then we talk. K.');
        startDialogue('c1b_exit');
    } }],
});
// ---- the way out ----
scene('c1b_exit', {
    speaker: 'System',
    text: () => `Your phone buzzes. A number you don't know:\n\n    Inspector. We both know where the brick came from.\n    5,000 pounds to hold it for a week, somewhere safe,\n    and nobody gets hurt. Then we talk. K.\n\nKarim can count bricks, then. And in Cairo, somebody in a Swiss foundation is about to open a sealed box from Shelf 4B and find nothing in it.` + ({ exposed: ` Samy is suspended, and Fathi thinks Karim has it.`, fled: ` Samy is on his way to Alexandria.`, ran: ` Samy is gone, nobody knows where.` }[sflag('ch1b_samy_fate')] || '') + `\n\nThe Codex in your jacket. Miriam's note in its flap. Thursday.\n\nWhat do you do?`,
    choices: [
        { text: 'In the morning, put in for leave, take it home to Cairo, and disappear.', onSelect: () => c1bExit('quiet') },
        { text: 'Phone Dr. Amira Sayed at the Ministry in Cairo. Log it properly, with her.', onSelect: () => c1bExit('legal') },
        { text: 'Answer the message: "A week."', onSelect: () => c1bExit('deal') },
    ],
});
function c1bExit(kind) {
    sflag('c1_exit', kind);
    if (kind === 'legal') { rel('amira', 15); rep('ministry', 10); }
    if (kind === 'deal') { rep('gebali', 10); storyPay(5000, 'From Karim el-Gebali, "to hold it for a week"'); }
    startDialogue('c1b_exit_' + kind);
}
scene('c1b_exit_quiet', {
    speaker: 'System',
    text: () => `At eight you're at the Director's door with a leave form. "Family," you say. He signs it without reading it, relieved to have one inspector fewer on the site who might have seen anything.\n\nUmm Sabry watches you cross the yard and says nothing at all, which from Umm Sabry is a speech.\n\nBy noon you're on a microbus to Cairo with the Codex at the bottom of a plastic bag of oranges from Mit Rahina, and a man asleep on your shoulder.\n\nNobody knows you have it.`,
    choices: [{ text: 'Ride to Cairo.', onSelect: () => c1bChapterEnd() }],
});
scene('c1b_exit_legal', {
    speaker: 'Dr. Amira Sayed',
    text: () => `Her number is in the Ministry directory on your service phone: Dr. Amira Sayed, Manuscripts. She answers on the second ring, wide awake.\n\n"Sayed." You tell her. The silence afterwards is long enough to hear her breathing change.\n\n"Miriam logged it with you? For Ministry review?" A breath. "Then she meant it for me. She knew I'd be the one to review it." Another. "Don't give it to anyone. Especially not the police. I'll be at Saqqara by seven."\n\nShe comes herself, in a dusty Hyundai, and in the inspectorate office, with the Director watching like a man at his own funeral, you log the Codex back into the book properly: SAQ/EV/0419, re-entered, her signature beside yours.` + (sflag('ch1b_samy_fate') === 'fled' ? `\n\nYou give her Karim el-Gebali's name. You don't give her Samy's. She looks at you, and doesn't ask.` : `\n\nYou give her Karim el-Gebali's name, and Samy Ragab's.`) + `\n\n"Right," she says. "You're coming to Cairo. And we're taking it with us."`,
    choices: [{ text: 'Get in the car.', onSelect: () => c1bChapterEnd() }],
});
scene('c1b_exit_deal', {
    speaker: 'System',
    text: `You type two words: A week.\n\nAt dawn a boy on a scooter stops at the inspectorate gate, hands you an envelope without getting off, and is gone before the dust settles. Five thousand pounds, in used fifties, and a card with nothing on it but a phone number.\n\nThe Codex stays in your jacket. Karim doesn't ask for it. Not yet. He's buying time, and your silence, and a debt.\n\nThe Gebali always collect.`,
    choices: [{ text: 'Go home to Cairo.', onSelect: () => c1bChapterEnd() }],
});
function c1bChapterEnd() {
    sflag('ch1_complete', true);
    for (const t of Story.s.tasks) if (!t.done && /^c1b_/.test(t.id) && t.id !== 'c1b_accountant' && t.text[0] !== '(') taskDone(t.id);   // (side quests stay open: KEEP EXPLORING)
    Game.save();
    const f = Story.s.flags, L = [];
    L.push({ quiet: 'You went home to Cairo on leave with the Codex in a bag of oranges. Nobody knows you have it.',
             legal: 'You called Dr. Amira Sayed and logged the Codex properly with her. The Ministry knows, and so will anyone in the Ministry who talks.',
             deal: 'You took Karim el-Gebali\'s 5,000 pounds to hold the Codex for a week. You owe the Gebali, and they always collect.' }[f.c1_exit]);
    L.push({ exposed: 'You handed Samy Ragab to the Director. Karim el-Gebali\'s people will remember it.',
             fled: 'You let Samy Ragab go. He\'s in Alexandria, and he says he owes you.',
             ran: 'You ran from Samy in the galleries. By morning he was gone, and nobody knows where.' }[f.ch1b_samy_fate] || 'Samy Ragab is still out there.');
    if (f.ch1b_karim_seen) L.push('You watched Karim el-Gebali pay Samy by the alabaster sphinx. He doesn\'t know you saw.');
    if (f.c1b_radwan_seen) L.push('You saw Colonel Radwan collect an empty box for the Vasse Foundation, and watched him weigh it and say nothing.');
    if (f.c1b_round_done) L.push('You logged a forged seal on the Serapeum\'s service door.');
    if (f.c1b_so_evidence) L.push('You kept Samy\'s Cleopatra cigarette ends, in a Ministry evidence bag.');
    if (f.ch1b_tomb_story) L.push('Umm Sabry told you about the tomb where the magician\'s wife and son are painted by the river.');
    if (f.c1b_ghaf_saw) L.push('The night ghaffir saw you in the galleries at midnight.');
    for (const fn of window.C1B_END_LINES || []) { const t = fn(f); if (t) L.push(t); }                // (the side quests: poke/ch1b_side.js)
    EndCard.show('END OF CHAPTER ONE', 'SAQQARA', L, 'Thursday, Café El-Fishawy, Cairo. Father Bishoy is waiting for someone who isn\'t coming. Chapter Two, Cairo, is being built. Your choices are saved and will carry forward.');
}

// ---- Umm Sabry's story (daytime, after the tea) ----
(function () {
    const s = STORY.c1b_umsabry, cg = Object.getOwnPropertyDescriptor(s, 'choices').get;
    Object.defineProperty(s, 'choices', { get() { const c = cg.call(this); if (sflag('c1b_tea') && !sflag('ch1b_tomb_story')) c.unshift({ text: '"Tell me one of your Saqqara stories, Umm Sabry."', nextScene: 'c1b_umsabry_story' }); return c; }, configurable: true });
})();
scene('c1b_umsabry_story', {
    speaker: 'Umm Sabry',
    text: `She pours herself a glass, which she never does, and settles.\n\n"My grandmother's. A prince, a son of Ramesses, the one who wrote his name on everything here: the old ones called him Setne. He heard of a book the god Thoth wrote with his own hand, buried here in the tomb of a magician. Naneferkaptah."\n\n"Setne went down into the tomb, and the magician was sitting up waiting for him, with his wife and his little son beside him. But the wife and the son had drowned in the river far away at Koptos, and been buried there. Still, there they were. The wife told Setne: that book cost us everything. Leave it where it is."\n\nShe sips. "He didn't leave it. Men never leave it."\n\n"My grandmother said the tomb is still here, somewhere at the edge where the sand comes in. You'll know it, she said, because the magician's wife and son are painted on the wall by the river."`,
    choices: [{ text: '"Shukran, Umm Sabry."', onSelect: () => { sflag('ch1b_tomb_story', true); rel('umsabry', 3, true); storyNote('Umm Sabry\'s story', 'The prince Setne went into the tomb of the magician Naneferkaptah at Saqqara for the book Thoth wrote. The magician\'s wife and son, drowned at Koptos, were there with him. "That book cost us everything. Leave it." The tomb is at the edge where the sand comes in: "the magician\'s wife and son are painted on the wall by the river."'); } }],
});
TASK_TARGETS.c1b_note = () => nightNow() || Story.s.clock >= 24 * 60 ? 'c1b_ghafhut' : null;
