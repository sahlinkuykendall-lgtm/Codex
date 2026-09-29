# CH1-C — MARSA TARFA, RED SEA COAST (Fixer opening)

| | |
|---|---|
| Act | I (prologue) |
| Background | Fixer only |
| Biome | The Red Sea coast: a fishing and smuggling harbor, coral reef, desert mountains behind, a highway |
| Size | Medium–large: the harbor town, a reef, a highway truck stop, a desert wadi |
| Main / side hours | 1.5 / 2.5 |
| Revisit | No. A Red Sea return is possible as a smuggling-job destination (Act II jobs) |
| Real places | Fictional Marsa Tarfa, between Safaga and Quseir. Modeled on real Red Sea harbors, with Quseir's old Ottoman fort in the distance |

---

## PREMISE

You owe **Bassem "the Shark" Nassar** 60,000 EGP (a boat you sank, a cargo you lost, it
doesn't matter now). Bassem gives you a way to clear it: one night job. A truck brings a
package from Cairo, and you take it out on Captain Zaki's dhow to a cargo ship offshore.
The client is a Swiss foundation. Nobody's supposed to open the package.

You open the package.

---

## MAIN BEATS

1. **Morning in Marsa Tarfa.** Debt collectors at your door (a teaching moment for the
   debt system). Meet **Captain Zaki** and **Rana** at her dive shop. *The tips teach
   movement, haggling, the backpack and the phone's bank app.*
2. **Bassem's offer.** Hear the job at his seafront villa. He's polite and terrifying. He
   mentions the client's security chief, "a German woman who doesn't laugh."
3. **Prep the job** (the player's choice of how):
   - Get the dhow fueled (a fuel theft or a paid fill).
   - Pick a route past the coast guard (buy the patrol schedule from a fisherman, or
     scout it from the fort at dusk).
   - Get a diving kit from Rana (in case you have to ditch the cargo).
4. **The truck stop** (the staged event). Bassem said "the truck comes at ten." At ten, the
   truck pulls in, and **Lena Brandt** gets out with it. She checks you over and says:
   *"Don't open it."*
5. **You open it** on the dhow, in the dark. Inside: **the Codex**, a GPS tracker, and a
   note in the flap in Miriam's handwriting: *"If you're reading this, they stole it from
   me. Father Bishoy, El-Fishawy, Thursday. Please."*
6. **The ship and the betrayal.** At the offshore meet, the ship's crew plans to kill the
   courier (you) to cut loose ends. It's a boat chase and stealth escape, with Zaki at
   the wheel.
   - **Zaki is shot** in the escape. Save him (first aid while the dhow drifts, and you
     lose the ship) or keep running (he survives, just, but won't forgive you) →
     `ch1c_zaki_saved` ★. In Ch3 his boat takes you to the harbor dive.
7. **Back on shore,** you have Vasse's package, Bassem's debt, and a tracker. Dump the
   tracker (the reef, a passing bus, or Bassem's own car, which is the funny option).

**Exit choice** (`c1_exit`):
- **Quiet:** you ghost Bassem. The debt stays and grows (a debt-collector event in Ch2),
  and nobody knows where the package went.
- **Legal:** you walk into the coast guard post. The officer calls the Ministry, and Amira
  asks you to bring it to Cairo yourself because she doesn't trust the police courier
  (`rel_amira` +15). **Bassem now hunts you:** debt +10,000, and a Ch2 goon event.
- **Deal:** Bassem wants to double-cross the Swiss and sell it to the Gebali in Cairo. You
  carry it, he knocks 20,000 off your debt plus 5,000 cash, and you owe the Gebali a
  favor.

---

## THE DEBT THREAD (runs through Act I)
- The debt is 60,000 EGP (± adjustments above). Bassem's men appear in Ch2–Ch4 if
  payments lapse (§ `06_SYSTEMS.md` §7, debt collectors).
- **Ways out:**
  - Pay it off.
  - Work it off with smuggling runs.
  - Get Gebali Trusted (Hagg Mahmoud "speaks to" Bassem).
  - SQ-04-06, **"The Shark's Tail"**: expose Bassem to the police, which costs Gebali rep.
- Resolved debt → a Fixer epilogue slide: you get your own boat back.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-01C-01 | Rana's Reef | Rana | Clear ghost nets off the reef (diving) | Diving XP, and Rana's gift of a Ch3 dive kit discount |
| SQ-01C-02 | The Fort's Cannon | Old man at the fort | A treasure legend at Quseir's Ottoman fort. Detector hunt | Rare find (an Ottoman coin hoard) |
| SQ-01C-03 | Fish for the Hotel | Hotel cook | A fishing job, done well three times | Fishing unlocked, and the cook's discount |
| SQ-01C-04 | The Coast Guard's Cousin | Fisherman | Smuggle medicine (not drugs) to a mountain village | Moral smuggling: rep, and a Bedouin contact who pays off in Ch6 |
| SQ-01C-05 | Bassem's Nephew | Bassem's sister | Get her boy out of Bassem's crew | `rel_rana` +, and a small debt cut |

## JOBS
- Fishing (the reef and harbor)
- Diving salvage (a sunk yacht)
- Truck-stop loading
- Small smuggling runs (cigarettes)

## SECRETS
- A wrecked Roman trade ship on the reef (real Roman Red Sea trade), with an amphora and
  coins
- A tiny Keeper shrine in the fort wall: the first one the player might notice

## LEAVING
A night bus or truck up the coast highway to **Ch2 Cairo**. Fixer-unique Ch2 hooks: Bassem
texts you threats, and Karim already knows your name (street rep).
