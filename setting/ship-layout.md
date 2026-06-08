# THE S.V. DROSS — SHIP LAYOUT

### A spatial reference for *Last Call on the S.V. Dross*

> *Ugly, sturdy, over-staffed, working-class to the bolts. Everything Ascendance refused to be: operational.*

This is the **rough-pass ship model** — one coherent layout that downstream tools refine:

1. **`setting/ship-layout.json`** is the **source of truth** (machine-readable: decks, rooms, coordinates, doors, entities, scenes, and image prompts).
2. **`docs/assets/ship.js`** is a **generated mirror** of that JSON for the web tools (the Deck-Maps builder can read `window.DROSS_SHIP`). Don't hand-edit it — regenerate (see *Downstream*).
3. This file is the **human guide**: the design logic, ASCII plans, and how the pieces connect.

---

## THE BIG IDEA: A DESCENT DOWN ONE SPINE

The adventure is a **descent**. The crew wakes at the **top** and works **down** to the **bottom**, one deck per scene, the oxygen dropping 10% at each transition:

```
 LEVEL          DECK                         SCENE              O2
 ─────  ──────────────────────────────────  ─────────────────  ───
   3    A · Command & Habitation             0 Rude Awakening   80%   ← wake here
   2    B · Mess & Commons                   1 Mess Hall Mutiny 60%
   1    C · Service & Machinery              2 The Crawlspace   50%
   0    D · Cargo & Reclamation Hold         3 The Nest         40%   ← the win is here
```

**Why it's spatially coherent — the Infection Spine.** A single vertical run of warm machinery ducting threads all four decks. **The nest in the cargo hold (D) grows up along it:**

```
        ┌─────────────── DECK A ── GLADYS's core  ← reaches here at 40% O2 = SADYS
        │                DECK B ── vending machines turn hostile (Scene 1)
   infection                       (Mr. Munch, the infected dispenser)
     spine                DECK C ── clogs the scrubber intake (the whole problem)
        │                          + seeds eggs in the crawlspace (Scene 2)
        └─────────────── DECK D ── THE NEST (source) — Brood Mama (Scene 3)
```

That one conduit explains **everything** from a single geometry: the clogged scrubbers, the eggs in the ducts, the mutinous appliances, and the optional SADYS turn. **Clear or vent the nest at the bottom (D) and the entire spine clears** — air climbs back to safe. The two routes down map to the two play styles: the **forward ladderway** (the normal way) and the **service crawlspace** (the intimate, dangerous Scene-2 squeeze).

---

## DECK PLANS (rough, top-down)

Grid convention: origin top-left, **+X = starboard (right)**, **+Y = aft (down the page)**, fore at top. One unit ≈ 2 m. (Exact rects live in the JSON; these sketches are for orientation.)

### Deck A — Command & Habitation *(Scene 0)*
```
 fore ┌────────────────────────────┐
      │        [ BRIDGE ]          │
      │      [ GLADYS CORE ]•      │  • infection tendril (spoiler)
      │ [ STASIS BAY ] [ QUARTERS ]│  ← wake here
      │ ───── habitation corridor ─┼─▶ ladderway ↓
      │        [ HOLO BAY ]        │  Bartleby's recharge point
 aft  └────────────────────────────┘
```

### Deck B — Mess & Commons *(Scene 1)*
```
 fore ┌────────────────────────────┐
      │ [   MESS HALL / GALLEY   ] │  Mr. Munch ▣ (blocks the only door)
      │  ☕ coffee  ☢ infected disp.│  ← appliances live here
      │ [ REC NOOK ]   ▣Munch▶═════╪═▶ scrubber corridor ↓ (slime trail)
 aft  └────────────────────────────┘
```

### Deck C — Service & Machinery *(Scene 2)*
```
 fore ┌────────────────────────────┐
      │ [SCRUBBER CTRL] [ REACTOR ] │  ← the objective panel (FAULT)
      │ ┌── service crawlspace ───┐ │
      │ │ ⊗ intake(egg-clog)  eggs│▣│  ▣ FAULTY AIRLOCK "DO NOT CYCLE"
      │ │   ...scuttler...        │ │     (the gun on the mantel)
      │ [WATER RECLAIM] └── duct ↓─┘ │  ↓ crawlspace continues to D
 aft  └────────────────────────────┘
```

### Deck D — Cargo & Reclamation Hold *(Scene 3)*  · **spoiler**
```
 fore ┌────────────────────────────┐
      │ ░░ webbing ░░ eggs ░░░░░░░░ │
      │ ░░   [ SALVAGED POD ]   ░░ │  Brood Mama draped over it
      │ ░░    + BROOD MAMA      ░░ │
      │ ░░░░  [ CARGO AIRLOCK ] ░░ │  ← vent her here = win (K-7 in vacuum)
      │ ════════ reclamation maw ══ │  (stern compactor, flavor/hazard)
 aft  └────────────────────────────┘
```

---

## SYSTEMS AT A GLANCE

- **Oxygen clock:** starts 80%, −10%/scene. 40% = optional SADYS trigger; 20% = woozy (WIL saves); 0% = impound. Clearing the nest resets it.
- **Scrubber loop:** control on Deck C; the fault is the nest gunk choking the intake (fed up the spine from D). Partial fix = clear the intake (Scene 2, slows the drop). Full fix = vent/kill Brood Mama (Scene 3, clears it at the source).
- **Power:** the "lift" (reclaimite) reactor on Deck C. When SADYS sulks, upkeep lapses — lights sag, doors hiss open slowly.
- **The two routes down:** forward **ladderway** (normal) vs. the **service crawlspace** (Scene 2's squeeze, where every PC's niche shines).

---

## ENTITY & SPOILER MAP

Every room and entity in the JSON carries a `spoiler` flag and (for events) a `show_to` of `players` or `warden`. **Player-facing renders and image sets should include only `spoiler: false` / `show_to: "players"` items.** Spoilers to gate: the **infection spine**, the **eggs**, the **scuttler**, the **salvaged pod's** origin, **Brood Mama**, the **nest**, and the **SADYS** beat. (This keeps the `players/` boundary intact, per `CLAUDE.md`.)

---

## IMAGE PROMPTS (flavor art)

The JSON carries a shared **`style`** block (art direction, lighting, palette, materials, negatives) plus ready-to-paste prompts in two places:

- **Per-space** — each key room has an `image_prompt` for an establishing shot (bridge, stasis bay, mess hall, crawlspace, cargo hold, etc.).
- **Per-event** — `image_events[]` covers key beats (the wake-up, Mr. Munch blocking the door, the egg reveal, Brood Mama, the airlock vent, the SADYS sag, the customs-checkpoint loss, the stinger).

**To build a prompt:** prepend `style.global_prefix` (and, if you like, the `lighting`, `palette`, and `negative` lines) to the specific room/event `prompt`. The palette (amber `#f2b441` ambient / teal `#4fd1c5` systems / coral `#ff7a6b` alien) and the "grimy used-future garbage barge, not a sleek starship" anchor keep every image reading as **one ship**.

Each room also has `lighting`, `mood`, `sensory`/`ambient` fields you can fold in for richer prompts or for reading aloud at the table.

---

## DOWNSTREAM: HOW THE PIECES CONNECT

**Deck-Maps builder (`docs/`).** `docs/maps.html` now renders **live** from `window.DROSS_SHIP` (loaded via `docs/assets/ship.js`): it iterates `decks[].rooms[].rect` to draw boxes, routes same-deck `doors`, drops `entities` at their `pos` (colored by `kind`), draws the vertical `connectors` on the overview, and builds the scene asides from `scenes[].beats`. A **Warden/Player toggle** hides everything `spoiler: true` (rooms become "Unexplored"), the infection spine, scene titles, and Warden tactical text. Edit the JSON, regenerate the mirror, and the maps follow.

**`map_label` (concise display names).** Rooms, entities, and connectors carry an optional short `map_label` (e.g. `"GLADYS Core"`, `"DO NOT CYCLE"`) used by the renderer instead of the long canonical `name`, so labels fit inside small rooms. The renderer also runs a measurement pass that shrinks/ellipsizes any label to its box and flips edge labels — but a good `map_label` keeps things legible. In player view, a trailing `"(…)"` is stripped from labels (e.g. `"Intake (clogged)"` → `"Intake"`).

**Image-prompt writing.** Pull `style` + a room/event `prompt`, fill in, send to your image generator. Use `show_to` to decide what's safe to show players in the moment vs. Warden-only reveals.

**Regenerating the web mirror** after editing the JSON:

```sh
node -e 'const fs=require("fs");const d=JSON.parse(fs.readFileSync("setting/ship-layout.json","utf8"));fs.writeFileSync("docs/assets/ship.js","/* GENERATED — mirror of setting/ship-layout.json; do not edit by hand. */\nwindow.DROSS_SHIP = "+JSON.stringify(d,null,2)+";\n");console.log("regenerated docs/assets/ship.js");'
```

---

*Schematic, not to scale. Edit the JSON; everything else follows.*
