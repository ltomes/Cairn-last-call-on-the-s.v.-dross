# PLOT REVIEW — *Last Call on the S.V. Dross*
### Coherence + run-readiness pass for a 3–4h / 3–5 player session, TONIGHT (2026-06-09)

Read-only review. Proposes changes; **does not edit** `last-call.md`. Builds on
`WARDEN-PREP-TONIGHT.md` (which already nailed the airlock conflict, the missing
stat blocks, the O₂-ladder mismatch, and the dangling threads) — this doc adds
the **end-to-end coherence verdict, clue-redundancy audit, win-condition check,
and the 3-things-to-change-tonight call.** Where the prep already has a fix, I
cite it rather than re-deriving.

---

## 0 · ONE-LINE COHERENCE VERDICT

**The plot is sound and runnable tonight as-is.** Cause→effect holds end to end
(salvaged Ascendance pod → Brood Mama nests in warm machinery → eggs clog the
scrubber intake → O₂ falls → fix = clear the nest at its source on Deck D).
There is **one real internal contradiction** (the finale-airlock deck conflict)
and a handful of **single-path clues** that want a cheap backup so a missed roll
can't stall the table. None of it is structural; all of it is a 2-minute ruling.

---

## 1 · COHERENCE END-TO-END

The spine is clean and the JSON's `infection-spine` connector encodes it
explicitly: nest (D) → scrubber intake + crawlspace eggs (C) → vending machines
(B) → GLADYS core (A). Every scene the party descends one level *along that
spine*, which means the geography itself teaches the mystery — they are walking
up the alien's supply line in reverse. That's a genuinely tight design.

Motivation checks out at every layer:
- **Players:** don't suffocate / don't get impounded (shame, not death).
- **Brood Mama:** wanted somewhere warm to raise kids; she is not wrong, which
  is what makes the airlock a *choice* and not a chore.
- **GLADYS:** government-issue, can only *disclose* not *advise* — this single
  lore beat (bermuda-reclamation.md L78) explains why she's useless **and**
  retroactively justifies every withheld clue. Excellent load-bearing gag.

**The one soft spot:** the causal link "eggs in the intake = scrubbers fail" is
stated (Scene 2) but the *reverse* — "kill/vent Mama and the clog blows clear"
— is a bit magic-handwave. It plays fine for a comedy (the nest is one organism
along the spine; remove the queen, the growth dies). Just **say it out loud once**
when it happens so it lands as cause-effect, not GM fiat: *"the moment she's
gone, the egg-matter in the intake goes slack and sloughs free — the scrubbers
cough and roar back."* The run-doc already has the beat (L210); just make the
"because" explicit.

---

## 2 · CRITICAL-CLUE SOLVABILITY (two-path audit)

The rule: every clue the plot *depends on* needs **≥2 independent ways to
surface**, so one missed roll/overlooked room can't dead-end the night. Audit:

| # | Clue (what the table must learn) | Path A | Path B | Verdict |
|---|----------------------------------|--------|--------|---------|
| 1 | **Go DOWN toward the cargo hold** | Slime trail + corrupted maintenance log (Scene 1, auto, no roll) | Crown & Whisker smells the nest direction (Nose for Trouble, no roll) | **SAFE** — at least 3 paths (Bartleby's confession is a 3rd). Auto-surfaced. |
| 2 | **It's a live alien, not just a fault** | Coffee machine's "wet thing dragged something shiny" (needs comforting) | Bartleby saw it leave the pod (needs pressing) | **SINGLE-CLASS RISK** — both are social/optional; a heads-down repair crew can reach Scene 3 *believing it's a clog* and get ambushed cold. That's survivable (the reveal just happens in the hold) but the SADYS valve (L233) exists precisely for this. **Backup below.** |
| 3 | **The vacuum weakness (how to win)** | "SEAL FAULTY — DO NOT CYCLE" airlock sign, Scene 2 (auto-place; GLADYS states it if missed) | Crown & Whisker smells "she fears the cold/the black"; or SADYS hands it over free (L245) | **SAFE** — auto-placed sign + GLADYS backstop + SADYS. Three paths. |
| 4 | **Where the airlock IS in the finale** | The Deck-C sign *taught* the trick | The cargo airlock is **right there** in the hold, teal-ringed, "big enough for a forklift" | **SAFE once you apply the ruling in §3.** |
| 5 | **Dusty signed the salvage form (whodunit)** | Dusty's own hook card | Surfaces in Aftermath | Sequel hook, not load-bearing. Fine to leave open. |

**The one single-point-of-failure to fix:** clue #2 (it's alive). Both surfacing
routes are *optional social beats*. Proposed backup — a **free, no-roll
environmental tell** that costs nothing and can't be missed:

> **In the scrubber corridor (end of Scene 1) or the intake (Scene 2), the
> "gunk" is unmistakably ALIVE** — warm, faintly pulsing, breathing in slow
> wet contractions, and when K-7/Dusty pulls a clot free it *recoils and
> re-grips.* Nobody can mistake this for limescale.

That converts "is it alive?" from a clue they might miss into a fact the ship
shoves in their face the moment they touch the repair — without removing the
*fun* of the coffee-machine and Bartleby beats (those now confirm *what* and
*where it came from*, not merely *that*). One sentence, total.

---

## 3 · ENCOUNTER / PUZZLE INTEGRITY

### Mr. Munch (blocked door) — **WIN CONDITION CLEAR, well-redundant.**
Four solves offered: correct change (Dusty's Improviser is tailor-made), WIL
persuade, STR tip-over, or smash (loud — a soft cost, not a wall). No single
roll gates it. **Gap:** no stat block if smashed. WARDEN-PREP already rules this
(reuse dispenser chassis: HP 4 / STR 12 / Armor 2, no attack, maximum
screaming). Adopt that. Also give him a **WIL ~12** in case a player tries to
*argue* him into despair/compliance (very on-tone). Munch should yield after
**one** successful approach — see pacing.

### Crawlspace squeeze — **integrity OK; watch Grease.**
Niche-spotlight beat (Bartleby scouts intangibly, K-7 fits + auto-repairs,
Crown climbs, Dusty improvises). The intake clear is a DEX *or* STR save for
anyone, auto for K-7 — so it cannot hard-fail. **One friction point:** Grease's
**Suited Up bulk** means he physically can't fit the duct (the prep flags this
as a feature — good). Just pre-decide that bulk = he waits at the mouth and
hands tools forward, so a 5-player table doesn't stall on "but how do I get in."

### Brood Mama + the vacuum/airlock solution — **THE ONE CONTRADICTION. Confirmed.**

> **The conflict (verified against the JSON):**
> - Run-doc Scene 2 (L186) plants a **"maintenance airlock"** and Scene 3
>   (L206) says *"Lure or shove Brood Mama into the faulty **maintenance
>   airlock** and cycle it."*
> - In `ship-layout.json`, `maintenance-airlock` is on **Deck C** (rect 5×6,
>   ~10×12 m), reachable **only via a hatch off the crawlspace**, one deck
>   *above* the fight. A forklift-sized horror cannot be lured up a deck into
>   a duct-sized lock.
> - The JSON's actual finale vent is `cargo-airlock` on **Deck D** (rect
>   12×11, *"big enough for a forklift-sized horror"*), with its own
>   `cargo-airlock-controls` and the K-7-cycles-from-vacuum note. Scene 3's
>   entity list, the `airlock-vent-win` image event, and wayfinding route
>   `wf-d` **all** point at the cargo airlock.

**RULING (say this to yourself once before Scene 3):**
> The **Deck-C maintenance airlock TEACHES the trick** (its "SEAL FAULTY — DO
> NOT CYCLE" sign is the gun on the mantel — *airlocks on this tub vent if you
> override the fault*). The **actual vent is the cargo airlock right there in
> the hold** — same deck as the fight, forklift-sized, teal status ring. It has
> its own faulty-seal override moment; **K-7 still cycles it from inside vacuum
> unharmed** (that's its hero beat). Brood Mama positions to keep the party
> between her and *that* door.

This matches the prep's call (§3). The only thing the run-doc needs is a
**two-word text change** if the user wants the doc internally clean: in L186 and
L206, "maintenance airlock" → **"cargo airlock"** in the Scene-3 *play*, and keep
the Deck-C sign as the *foreshadow*. (Proposed, not applied.)

**Win condition reachability:** the airlock play is reachable by **multiple
stat lines** (lure = Crown DEX; shove = STR opposed; rig = K-7 auto or anyone's
DEX), so no single PC build gates the good ending. And the **brawl is an
explicit, balanced fallback** (HP 12, drops in 2–3 rounds of focused d6–d8;
Cocoon-not-kill means even a bad fight can't TPK). Both win paths are sound.

### SADYS subplot — **integrity OK; it's a valve, not a gate.**
Correctly optional, correctly triggered (40% O₂ *or* "still treating it as a
repair job"). Its mechanical job is **pacing rescue** (over-shares any missing
clue) and **tone-jolt**. The climax vent-the-deck beat is the only part that can
*eat time* (depressed-mainframe countdown *during* the boss fight) — see pacing
for the cut. No win-condition problem: the pep-talk is a plain WIL save, and
either outcome still routes to "kill Mama below = cure her."

---

## 4 · PACING (3–4h, 3–5 players)

The docs are written for a **2-hour** target; tonight is 3–4h, so the buffer is
real — the danger is **sprawl in Scene 1**, not running out of clock. Estimates
assume 4 players; **add ~20% to every social block for 5.**

| Block | Estimate (4p) | Likely overrun | Concrete cut |
|-------|---------------|----------------|--------------|
| Teach + intros | 20–25m | Low | Deal cards *while* teaching; don't read lore aloud — drip it. |
| Scene 0 Awakening | 12–15m | Low | GLADYS gives route in one breath; **skip the bridge** (it's color). |
| Scene 1 Mess Hall | **35–45m** | **HIGHEST** — appliance-voice improv + first combat is a black hole | Munch yields after **one** good approach; dispenser is HP 4 — let it die in 1–2 rounds; at the 30-min mark GLADYS "helpfully" announces O₂ + the slime trail. |
| Scene 2 Crawlspace | 30–35m | Medium — duct roleplay sprawl | The run-doc's own lever (L34): cut the scuttler chase, intake = one roll. |
| Scene 3 The Nest | 35–45m | High **if SADYS climax fires mid-fight** | If behind, SADYS only over-shares clues; **skip her vent-the-deck countdown**. Brawl resolves fast (2–3 rounds). |
| Scene 4 + stinger | 12–15m | Low | **One** stinger, not three. |

**Total ≈ 2h45–3h15.** Comfortably inside a 3–4h window with room for a break.

- **If players RUSH** (heads-down, no voices): fire **SADYS at 40%** for a
  tone-jolt; add a second rogue appliance mid-Scene-3 (reuse the dispenser
  block); roll the d6 malfunction table (L271) for texture.
- **If players STALL** (lost, or treating it as pure repair): drop an extra
  −10% O₂ with a panicking appliance; fire **SADYS early** as the clue-faucet
  (she mournfully hands them the nest location / vacuum weakness, L245). SADYS
  is your single best pacing tool in both directions.
- **Hard time-box:** if you hit Scene 3 with <40 min left, **go straight to the
  airlock play** — Mama plants herself, someone lures/shoves, K-7 cycles, done.

---

## 5 · GAPS

### Missing / underspecified stat blocks
- **Mr. Munch** — invited to be tipped/smashed, no block. *Fix:* reuse dispenser
  chassis (HP 4 / STR 12 / Armor 2, no attack), **WIL 12** for argue-attempts.
- **Foe WIL omitted on all three blocks** — matters the instant a PC tries to
  *guilt or pep-talk* Brood Mama (squarely on-tone; she's written to plead).
  *Fix (prep's suggestion, adopt it):* dispenser WIL 5, scuttler 8, **Brood
  Mama 13**. A WIL save vs. *her* WIL 13 to talk her down voluntarily is a
  lovely alternate ending — she leaves on the next supply hauler, kids and all.
- **Weeping coffee machine** — flavor only, no stats needed; if attacked it just
  weeps harder. Rule it.

### O₂ ladder consistency
- Run-doc plays **80 → 70 → 60 → 50 → (win)**, dropping 10% per scene break, and
  this is what GLADYS *announces* — keep it.
- **JSON disagrees:** `scenes[].o2_pct` reads 80 / 60 / 50 / 40 (skips 70, and
  Scene-3 starts at 40 = the SADYS trigger). The `systems.o2_clock` block says
  "drop 10 per scene," which contradicts its own scene values.
- **Ruling for tonight:** **the run-doc ladder is canonical** (it's the spoken
  number). The JSON is a data artifact for the map renderer; the mismatch has
  **zero table impact** — just don't read the JSON numbers aloud. (Flag JSON
  `o2_pct` for later cleanup; not tonight's problem.)
- Note Scene 3 nominally sits at **40–50%**, i.e. *at or near the SADYS
  trigger*. That's intentional — if you want SADYS, the clock hands it to you
  right as the finale opens. Decide **before** Scene 3 whether you're running her.

### Dangling threads (and the one-line each the prep already drafted — adopt)
1. **Who wiped Dusty's memory + K-7's logs?** Both hooks point at a wiper the
   doc never names. *Fix:* **GLADYS did it** — *"you all seemed so stressed
   before bed, dears"* — confessed in Aftermath (or volunteered, devastatingly,
   by SADYS). Ties two loose hooks with one line and is funny.
2. **The found ship-map / "who knows the layout" model** — JSON says K-7 knows
   the decks innately and a wall schematic in `commons-a` reveals them to all,
   but the run-doc surfaces *neither*. *Fix:* Scene-0 exit beat — K-7 recites
   the schematic (or a player reads the bolted-up deck map), and flip
   `maps.html` to player view. Costs nothing, removes "where do we even go."
3. **SADYS tendril if she never fires** — the coral tendril at GLADYS's core
   goes undiscovered. *Fix:* Aftermath throwaway — GLADYS: *"Oh, and the tenant
   in my thinking-room left. I'd been meaning to mention it."*
4. **Stingers** (Munch charging rent / last egg / "the OTHER thing") — *intended*
   open sequel hooks. Pick ONE; don't resolve.
5. **Dusty's salvage form** — deliberate sequel seed (bermuda-reclamation.md
   L80). Leave open; let the table decide rat-out vs. bury.

### Rules-friction (won't block play, pre-decide to avoid table debate)
- **Grease's armor math:** 2+1+1 = 4, sheet says "Armor 3." Cairn caps at 3 —
  say "capped at 3." Fallback (drop hatch-shield → Armor 2) already in L129.
- **"Disadvantage feel" @20% O₂** — Cairn has no disadvantage; both docs already
  implement it as *WIL-save-before-fiddly*. Use the save, drop the word.
- **Holo-Decoy gadget** says enemies need a **DEX** save to ignore it; being
  *fooled* is a **WIL** save in Cairn idiom. Rule WIL.
- **Rest wording:** teach says "a minute," rules say "a moment." Pick one
  ("a minute") and stay consistent. None of these touch the plot.

---

## 6 · THE 3 THINGS TO CHANGE BEFORE TONIGHT

Everything else is polish. These three are the ones that actually protect the
session:

1. **Settle the finale airlock — say it out loud now.** The win is the **Deck-D
   cargo airlock in the hold** (the Deck-C sign only *taught* the trick). Brood
   Mama can't be dragged up a deck. Pre-load the ruling in §3 so you don't fumble
   it live. *(Optional clean-up: swap "maintenance airlock" → "cargo airlock" in
   the Scene-3 text at L186/L206.)*

2. **Add the free "the gunk is ALIVE" tell** (§2, clue #2). One sentence at the
   intake makes "there's a live alien aboard" un-missable without a roll,
   closing the only single-point-of-failure clue. Keep the coffee-machine and
   Bartleby beats as *flavor confirmation*, not load-bearing.

3. **Fill the three missing numbers and pick your O₂ canon.** Mr. Munch (HP 4 /
   STR 12 / Armor 2 / WIL 12), Brood Mama **WIL 13** (so she can be talked
   down), and commit to the **run-doc O₂ ladder (80/70/60/50)** — ignore the
   JSON's numbers, they're renderer data. Decide **before Scene 3** whether
   SADYS is firing, since the clock lands you on her trigger right as the finale
   opens.

---

*Read-only review, 2026-06-09. No run-doc or setting files were modified.
Proposals only — the user reviews before any edit.*
