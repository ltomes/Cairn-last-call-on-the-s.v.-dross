# Last Call on the *S.V. Dross*

**A Cairn 2e space-comedy one-shot.** 3–4 players · ~2 hours · soft stakes, talking appliances, one campy alien, and a galaxy run by insurance underwriters in Bermuda shorts.

> *Waste-reclamation barge. Skeleton crew. Something in the vending machines.*

A bit of grimy lived-in sci-fi sitcom, a bit of deadpan cosmic bureaucracy. The crew of a clapped-out garbage barge wake from stasis to a failing ship and have to get the air back on before they're embarrassingly impounded — which means mutinous vending machines, a maternal alien squatting in the machinery, and a ship's computer with feelings.

---

## Quick start (Warden)

1. Read **`adventure/last-call.md`** — the full run-doc: pitch, pacing sheet, scene-by-scene, stat blocks, the optional SADYS subplot, and NPC voices.
2. Skim **`system/rules-and-hacks.md`** — Cairn 2e plus this game's house rules (comedy death, holograms, the oxygen clock, gadgets).
3. Print **`players/pregens.md`** and hand the cards out. (Player-safe — no spoilers.)
4. Optionally read **`setting/bermuda-reclamation.md`** for the lore you can sprinkle in.
5. Grab a d20 and a few d6/d8/d10. Go.

## What you need

- This repo.
- **Cairn 2e** (free): <https://cairnrpg.com>. You can run the whole night off the docs here, but the core book is the reference.
- Dice: d20, d6, d8, d10.

## Repo contents

| Path | What it is |
|------|------------|
| `adventure/last-call.md` | The Warden's run-doc (the main event). |
| `system/rules-and-hacks.md` | Cairn 2e recap + this game's house rules. |
| `players/pregens.md` | Printable, spoiler-free character cards. |
| `setting/bermuda-reclamation.md` | The setting primer / lore. |
| `docs/` | **Web tools** — a self-contained static site (crew builder, NPC soundboard, deck maps). |
| `build/` | Generated print-ready PDFs and card sheets (see `CLAUDE.md`). |
| `CLAUDE.md` | Build & maintenance brief for Claude Code. |

---

## Web tools (`docs/`)

A no-build, dependency-free static site you can open at the table on a phone or laptop:

- **Crew Builder** (`docs/builder.html`) — *player-safe.* Loads the four pregens by default; edit names, stats, and kit; print or save a card; or roll a fresh recruit. Saves to the browser; export/import as JSON.
- **NPC Soundboard** (`docs/soundboard.html`) — *Warden, spoilers.* Tap-to-speak GLADYS, SADYS, Mr. Munch and the rest using your browser's built-in voice. No internet needed once loaded.
- **Deck Maps** (`docs/maps.html`) — *Warden, spoilers.* Schematic plans for the mess hall, crawlspace, and the nest, with the airlock play marked. Print-friendly.

Everything uses relative paths, so it serves identically from **GitHub Pages** (Settings → Pages → deploy from this branch, `/docs`), any static host (Netlify, S3/CloudFront, etc.), or just by opening `docs/index.html` directly.

---

## Credits & License

This work is **based on Cairn**, created by **Yochai Gal**, and used under the **Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)**.
Cairn: <https://cairnrpg.com> · License: <https://creativecommons.org/licenses/by-sa/4.0/>

*Last Call on the S.V. Dross*, the Bermuda Reclamation setting, and all original text in this repository are © 2026 ltomes, and — as required by Cairn's share-alike terms — are likewise licensed under **CC BY-SA 4.0**. You're free to share and adapt this material, including commercially, as long as you give appropriate credit and license your derivatives under the same terms.

See [`LICENSE`](LICENSE) for the full text.
