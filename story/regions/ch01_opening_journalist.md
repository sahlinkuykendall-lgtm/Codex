# CH1-D — PORT SAID (Journalist opening)

| | |
|---|---|
| Act | I (prologue) |
| Background | Journalist only |
| Biome | A Mediterranean canal city: the container port, colonial-era waterfront, the Suez Canal, fish markets |
| Size | Medium–large: the old town with wooden balconies, the container terminal, the canal ferry, Port Fouad across the water |
| Main / side hours | 1.5 / 2 |
| Revisit | No |
| Real places | Port Said's old wooden-balconied waterfront, the Suez Canal Authority building (the green domes), the free ferry to Port Fouad, the de Lesseps statue plinth (the empty pedestal) |

---

## PREMISE

Three days ago, Dr. Miriam Hale (whom you interviewed years ago about looted antiquities)
emailed you:

> *"If I stop answering, follow the Vasse shipments. Port Said, container VSSU 417882.
> I'm sorry. — M."*

She stopped answering. Your editor **Claire** gave you a week and an expense account.

---

## MAIN BEATS

1. **Arrive and set up.** Your hotel on the waterfront. Meet your stringer **Magdy Hanna**,
   a local photographer who knows the port. *The tips teach movement, the camera, the phone
   and notes.*
2. **Follow the paper.** The Foundation's shipping agent has an office in the old town.
   Pose as a buyer, a clerk or a delivery person (dialogue choices using the press card or
   French). You learn the container is flagged "cultural loan, diplomatic seal," sailing
   to the **Geneva freeport** in 36 hours.
3. **Meet Dieter Kern,** the Foundation's logistics manager. He's charming and
   suspicious. He offers you an "exclusive interview with Mr. Vasse." It's a hook (the
   deal exit).
4. **Get into the terminal.** Magdy's cousin works the night shift, so it's a bribe, a
   borrowed hi-vis vest, or a climb over the fence. It's a stealth section among the
   container stacks and straddle carriers.
5. **The staged event.** Magdy's cousin warns: *"The Swiss inspector comes at two with a
   white van."* At two, a white van arrives, and it's **Lena Brandt** with two men doing a
   last check. You hide in the container itself, or photograph them from a crane.
6. **Container VSSU 417882.** Inside is a crate of real, legal loan pieces, and one crate
   that isn't on the manifest. In it: **the Codex**, with Miriam's note in the flap:
   *"Father Bishoy, El-Fishawy, Thursday."*
7. **Get out.** The alarm goes. A chase through the stacks, onto the canal ferry, and a
   loss in the crowd at Port Fouad.
   - **Pay Magdy properly** (he risked his job) → `ch1d_magdy_paid`. His photos of Lena's
     team become **the Radwan proof item in Ch4**. Stiff him, and he sells them to
     someone else.

**Exit choice** (`c1_exit`):
- **Quiet:** you take the Codex and disappear to Cairo. Claire is furious.
- **Legal:** you publish a teaser ("A Swiss foundation's diplomatic crates") and call the
  Ministry. Amira asks you to bring it in personally (`rel_amira` +15). Lena now knows your
  byline.
- **Deal:** you take Dieter's "interview" and ride to Cairo in a Foundation car with the
  Codex hidden in your camera bag, playing along. +5,000 EGP "fee," and you owe Vasse an
  interview (it happens in Ch2).

---

## THE STORY THREAD (runs all game)
- **Journalist-only:** a running **"story file"** on the phone. Evidence you photograph or
  find (Vasse's shipments, Radwan's son, the medical file) builds your exposé.
- **At each act break, Claire asks: publish now, or wait?**
  - **Publish** gives quick rep damage to the target, and makes you a target too.
  - **Wait** gives a bigger final story (an epilogue slide: you win a prize, or you bury
    it).

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-01D-01 | The Empty Pedestal | Old waterfront barber | The story of the removed de Lesseps statue (real). Photograph the pedestal and write the story | Photography XP, a small fee from Claire |
| SQ-01D-02 | Magdy's Wedding Photos | Magdy | Help Magdy shoot a wedding he double-booked (a photo job) | `rel_magdy` +, and the photo job type unlocked |
| SQ-01D-03 | The Fish Market Fraud | Fish seller | Someone's rigging the scales. Expose them | Local rep, and a free-fish perk |
| SQ-01D-04 | Canal Pilot's Tale | Retired canal pilot | His memories of the 1956 Suez Crisis (real history). Record them | Lore, and a lead: the Foundation shipped "cultural items" through the canal in the 1990s too |
| SQ-01D-05 | The Stolen Press Card | Pickpocket | Get your press card back | Teaches the robbery recovery system |

## JOBS
- Photography commissions (the port, weddings, tourists)
- Fixer or translator for foreign crews (French)
- Fishing off the breakwater

## SECRETS
- An 1869 canal-opening commemorative medal (Rare) hidden in an old customs house
- A Foundation shipping ledger in Dieter's office safe (Lockpicking 1). It's evidence for
  the story file

## LEAVING
Train or Foundation car to **Ch2 Cairo**. Journalist-unique Ch2 hooks: Claire's calls, and
Vasse's interview (if deal).
