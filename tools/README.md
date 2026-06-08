# tools/

Build-time helpers. Zero npm dependencies — plain Node 18+ (uses the built-in
`fetch`). Nothing here is needed to *run* the game; it generates assets.

## `generate-images.mjs` — flavor art

Reads the canonical ship model (`setting/ship-layout.json`), assembles the full
image prompts (the same fragments as the in-browser **Image Prompt Console**),
calls an image API, and writes:

- `docs/assets/img/<id>.png` — one image per location + key event
- `docs/assets/img/manifest.json` — what was generated (canonical)
- `docs/assets/img/manifest.js` — a no-`fetch` mirror the **Flavor Gallery** reads

### Quick start

```sh
# OpenAI (default: model gpt-image-1)
OPENAI_API_KEY=sk-… node tools/generate-images.mjs

# Stability
STABILITY_API_KEY=… node tools/generate-images.mjs --provider stability
```

The key is read from the **environment** — never put it on the command line in a
shared shell, and never commit it.

### Flags

| Flag | Default | Notes |
|------|---------|-------|
| `--provider openai\|stability` | `openai` | which API to call |
| `--model <id>` | `gpt-image-1` / `sd3.5-large` | override the model |
| `--size 1536x1024` | `1536x1024` | gpt-image-1: `1024x1024`, `1536x1024`, `1024x1536`, `auto` |
| `--quality low\|medium\|high` | `medium` | gpt-image-1 only |
| `--audience all\|player` | `all` | `player` = only player-safe shots |
| `--only id,id` | — | generate just these target ids (e.g. `--only mess-hall,nest-broodmama`) |
| `--force` | off | regenerate even if the PNG already exists |
| `--dry` | off | assemble prompts + write the manifest, **no API calls** |
| `--delay 1500` | `1500` | ms between calls (rate-limit friendly) |

`--dry` is the safe way to preview exactly what will be sent and to refresh the
manifest without spending anything.

### Two things to know

- **Cost.** One call per target — there are ~24 (15 player-safe, 9 Warden).
  Start with `--audience player` or `--only …` to spot-check before a full run.
- **Network policy.** This repo's web/CI environment only reaches hosts allowed
  by its network policy. If `api.openai.com` (or `api.stability.ai`) is blocked,
  either allow it in the environment config, or just run this script on your own
  machine — it's plain Node, no install.

The generated PNGs **are** committed (like the print PDFs) — they're the
printables/visuals players want. See `setting/ship-layout.md` for the prompt
design and `docs/gallery.html` for display.
