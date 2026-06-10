# WARDEN PREP — TONIGHT (Last Call on the S.V. Dross)

Review pass of `adventure/last-call.md` (run-doc), `system/rules-and-hacks.md`, `players/pregens.md`,
`setting/ship-layout.{md,json}`, and the `docs/` table tools. Read top-to-bottom once; sections 1–2 are the at-table pages.

---

## 1 · ONE-PAGE CHEAT SHEET

**Flow** (run-doc anchors → `last-call.md`):

| O₂ | Scene | Where | Anchor (last-call.md) | Must happen |
|----|-------|-------|----------------------|-------------|
| — | Teach + intros (15–25m) | — | "60-Second Cairn Teach" L39 | Cards out, teach, voices |
| 80% | **0 Rude Awakening** (10–15m) | stasis-bay, Deck A | L133 | GLADYS boxed text; objective = scrubbers; route = mess hall → crawlspace |
| 70% | **1 Mess Hall Mutiny** (25–40m) | mess-hall, Deck B | L147 | Past Mr. Munch; coffee-machine clue; dispenser fight; trail points DOWN |
| 60% | **2 Crawlspace** (25–35m) | crawlspace, Deck C | L168 | Clear intake (slows clock); eggs + scuttler scare; **plant maintenance-airlock sign** |
| 50% | **3 The Nest** (25–40m) | cargo-hold, Deck D | L192 | Brood Mama; airlock play = win; brawl = allowed but bites |
| safe | **4 Aftermath** (10–15m) | — | L214 | Character beats; pick ONE stinger |

**Critical clues (don't let these die in a pocket):**
1. **Slime trail + corrupted log** (Scene 1, scrubber-corridor) → points down to cargo hold.
2. **Coffee machine saw "the wet thing"** (Scene 1) — reward anyone who comforts it.
3. **Bartleby's secret** — he SAW it leave the pod; press him in Scene 1–2.
4. **"SEAL FAULTY — DO NOT CYCLE" airlock** (Scene 2) — the gun on the mantel; GLADYS mentions it if players miss it.
5. **Brood Mama's vacuum weakness** — Crown & Whisker smells it, Bartleby/GLADYS can state it, SADYS hands it over free.

**Pacing levers:**
- **Stalling?** Drop an extra −10% O₂ + a panicking appliance; or fire **SADYS at 40%** — she mournfully hands out any clue they're missing (L245).
- **Rushing?** d6 background-malfunction table (L271); second appliance goes rogue mid-Scene-3 (reuse dispenser block).
- **Way behind?** Cut the scuttler chase; scrubber fix = one roll (run-doc's own cut, L34).
- **20% O₂:** WIL save before fiddly acts (comic fumble); K-7 immune. **0% = impound, not death.**

**Table tools (docs/, served from the repo's pages site):** `index.html` hub (enable Warden Mode); `builder.html` pregen cards (print before play); `soundboard.html` voices — GLADYS, SADYS, Mr. Munch, Coffee, Brood Mama, K-7 + room ambiences; `maps.html` deck maps with **Player/Warden toggle** (player view hides nest/pod/spine); `rooms.html` room images (Warden-only, spoilers).

---

## 2 · STAT BLOCK INDEX (one screen)

| Who | STR | DEX | WIL | HP | Armor | Damage / notes |
|-----|-----|-----|-----|----|-------|----------------|
| **PCs** | | | | | | |
| Dusty McGrath | 11 | 10 | 12 | 6 | 0 | Multitool d6 · Improviser 1/session |
| Bartleby "Feathers" | 7 | 13 | 14 | 4 | 0 | No attack · Intangible / Hard Light 10m (WIL to hold) |
| Crown & Whisker | 9 | 15 | 8 | 5 | 1 | Claws d6 · Nine Lives 1/session · smells danger |
| K-7 "Kay" | 13 | 9 | 10 | 5 | 1 | Extinguisher d6 · auto-repairs · **Vacuum-Rated** |
| Grease (5th) | 8 | 10 | 12 | 3 | 3 | Plasma cutter d8 / bolt-sling d6 · gadget 1/session · full pack = 0 HP |
| **Foes** | | | | | | |
| Infected Vending Machine | 12 | 5 | — | 4 | 2 | Cans d6, electrified grab d8 (reach) |
| Scuttler (juvenile) | 6 | 14 | — | 3 | 0 | Claws d6 · fast, screechy, flees to hold |
| Brood Mama | 15 | 8 | — | 12 | 1 | Tongue d8, acid spew **d10 blast** (roll per target) · Cocoon, not kill · **vacuum = instant defeat** |

**Stat blocks — ✅ now filled in the run-doc:**
- **Mr. Munch** — `HP 4 · STR 12 · DEX 4 · WIL 12 · Armor 2`; a puzzle first (change / WIL-save pitch / STR-save shove). **Smashing him open the door makes him shriek → the nest starts the finale ALERT (no surprise round).**
- **Brood Mama** now has **WIL 13** → she can be **talked off the ship** (a WIL save + a real offer = the kindest, most-Cairn ending; scrubbers clear all the same).
- **Weeping Coffee Machine** — flavor only; if attacked it just weeps harder (rule it, no stats).
- GLADYS/SADYS correctly have no stats (pep-talk = the PC's WIL save).

---

## 3 · CONSISTENCY CHECK (run-doc ↔ ship-layout.json)

**The finale airlock — ✅ resolved in the run-doc.** The Deck-C **maintenance airlock** *teaches the trick* (the "SEAL FAULTY — DO NOT CYCLE" sign / mantel gun); the actual vent-win is the **big cargo airlock right there in the hold** (Deck D, same room as the fight) — big enough for a forklift-sized Mama, with its own "seal faulty" override, K-7 cycles it from vacuum. No deck-jump, no contradiction. Just keep the two airlocks straight in your head.

**Minor:**
- **O₂ ladder disagrees:** run-doc plays Scene 1 at **70%** (80→70→60→50); JSON `scenes[1].o2_pct=60` and ship-layout.md's table skip 70%. Use the run-doc's sequence — it's what GLADYS announces.
- **JSON scene 0 includes `bridge`** — run-doc Scene 0 never visits it. Optional color only.
- **`ship-map` (Deck Schematic, `commons-a`)** — plot_device in JSON (`knowledge.found_map` reveals the layout to everyone; K-7 knows it innately) but **never appears in the run-doc**. See §6.
- **`infection-tendril-a`** (at GLADYS core) is in no scene's entity list — only surfaces if SADYS fires. See §6.
- Duplicate ids across namespaces (`salvaged-pod`, `gladys-core` are both a room and an entity) — harmless tonight; flag for cleanup.
- Everything else checks out: every room/entity the run-doc names (mess-hall, crawlspace, scrubber-control/intake, mr-munch, coffee-machine, infected-dispenser, faulty-airlock-sign, scuttler, egg clusters, cargo-hold, salvaged-pod, brood-mama, holo-projector power point, stasis-pods) exists in the JSON with scene coverage.

---

## 4 · RULES FRICTION POINTS

- **Grease's armor math:** hardsuit 2 + visor 1 + hatch-shield 1 = **4**, sheet says "Armor 3 in all." Cairn caps Armor at 3 — say "capped at 3" if a player adds it up. Run-doc's fallback (drop shield → Armor 2) already exists (L129).
- **Holo-Decoy gadget** (rules-and-hacks §6): "enemies need a **DEX** save to ignore it" — being fooled is a **WIL** save in Cairn idiom. Rule it WIL.
- **"Disadvantage feel" at 20% O₂** (run-doc L60) — Cairn has no disadvantage; both docs implement it as a WIL-save-before-fiddly-things. Use the save, skip the word.
- **Rest wording:** teach says HP back "after a minute's rest," rules say "a moment's rest." Same thing; pick "a minute" and stay consistent.
- **Both docs assume a ~2h game** ("RUNNING IT IN 2 HOURS"); tonight is 3–4h — see §5, don't let the buffer talk you into the optional grit (Deprivation/Fatigue) rules; they stay off.
- No genuine contradictions between pregens.md and last-call.md pregen copies — stats, items, and abilities match.

---

## 5 · PACING (3–4h, 3–5 players)

| Block | Estimate | Overrun risk | The cut |
|-------|----------|--------------|---------|
| Teach + intros | 20–25m | Low | Hand out cards while talking |
| Scene 0 | 15m | Low | GLADYS gives the route in one breath; leave the bridge alone |
| Scene 1 | 35–40m | **HIGHEST** — appliance-voice improv black hole + first combat | Mr. Munch yields after **one** successful approach; dispenser is HP 4, let it die fast; at the 25m mark GLADYS announces O₂ and the slime trail "helpfully" |
| Scene 2 | 30–35m | Medium — duct-crawl roleplay sprawl | Run-doc's own lever: cut the scuttler chase, scrubber fix = one roll |
| Scene 3 | 35–40m | **High if SADYS climax fires** — depressed-mainframe countdown + boss fight at once | If behind schedule, SADYS only over-shares clues; skip her vent-the-deck countdown beat (L248) |
| Scene 4 + stinger | 15m | Low | One stinger, not three |

Total ≈ 2h45–3h. With 5 players, everything social runs ~20% longer — protect Scene 3 by being ruthless in Scene 1. **SADYS at 40% is your best mid-game jolt if energy sags; she's also your pacing rescue (free clues).**

---

## 6 · DANGLING THREADS (and one-line fixes)

1. **SADYS subplot if it never fires** — the tendril at GLADYS's core then goes undiscovered. *Fix: Aftermath line — GLADYS: "Oh, and the tenant in my thinking room left. I'd been meaning to mention it."*
2. ~~**Maintenance-airlock mantel-gun vs. Deck-D finale**~~ — ✅ **fixed in run-doc** (Deck-C sign teaches the trick; the Deck-D cargo airlock is the trigger). See §3.
3. **The ship-map / who-knows-the-layout model** — JSON says K-7 knows the decks and a `ship-map` schematic in `commons-a` reveals them, but the run-doc never surfaces either. *Fix: Scene 0 exit beat — K-7 recites the schematic; flip `maps.html` to player view and leave it on screen.*
4. **Who wiped Dusty's memory and K-7's logs?** Both hooks point at a wiper the run-doc never names. *Fix: GLADYS did it — "you all seemed so stressed before bed" — confessed in Aftermath (or volunteered, devastatingly, by SADYS).*
5. **Stingers** (Munch charging rent / the last egg / "the OTHER thing") — intentionally open sequel hooks; pick one, don't resolve.
6. **Soundboard gaps** — no scuttler screech or dispenser jingle buttons; do those two with your mouth.

---

*Read-only review 2026-06-09; nothing else in the repo was changed.*
