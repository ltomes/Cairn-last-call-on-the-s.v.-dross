#!/usr/bin/env node
/* ============================================================
   generate-images.mjs — flavor art for Last Call on the S.V. Dross
   Zero dependencies (Node 18+ global fetch). Reads the canonical ship
   model, assembles full prompts, calls an image API, writes PNGs to
   docs/assets/img/ and a manifest the Gallery page consumes.

   Usage:
     OPENAI_API_KEY=sk-... node tools/generate-images.mjs [flags]

   Flags:
     --provider openai|stability   (default: openai, or $PROVIDER)
     --model <id>                  (default: gpt-image-1 / sd3.5 core)
     --size 1536x1024              (gpt-image-1: 1024x1024|1536x1024|1024x1536|auto)
     --quality low|medium|high     (gpt-image-1, default medium)
     --audience all|player         (player = only player-safe images, default all)
     --only id,id,...              (generate just these target ids)
     --force                       (regenerate even if the file exists)
     --dry                         (assemble + write manifest, NO API calls)
     --delay 1500                  (ms between calls)

   Targets: every room with an image_prompt + every image_events[] entry.
   Output:  docs/assets/img/<id>.png  and  docs/assets/img/manifest.json
   ============================================================ */

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHIP_JSON = path.join(ROOT, "setting", "ship-layout.json");
const OUT_DIR   = path.join(ROOT, "docs", "assets", "img");

/* ---- args ---- */
const args = process.argv.slice(2);
const flag = (name, def) => { const i = args.indexOf("--"+name); return i>=0 ? (args[i+1] && !args[i+1].startsWith("--") ? args[i+1] : true) : def; };
const has  = name => args.includes("--"+name);
const provider = String(flag("provider", process.env.PROVIDER || "openai")).toLowerCase();
const audience = String(flag("audience", "all"));
const only     = (flag("only", "") && String(flag("only","")).split(",").map(s=>s.trim()).filter(Boolean)) || [];
const dry      = has("dry");
const force    = has("force");
const delayMs  = parseInt(flag("delay", "1500"), 10) || 0;
const size     = String(flag("size", "1536x1024"));
const quality  = String(flag("quality", "medium"));

/* ---- prompt assembly (mirrors docs/prompts.html, all fragments on) ---- */
function assemble(ship, specific){
  const s = ship.style, parts = [];
  if(s.global_prefix) parts.push(s.global_prefix);
  if(s.lighting)      parts.push("Lighting: "+s.lighting);
  parts.push(specific);
  if(s.palette)       parts.push(`Palette: amber ${s.palette.ambient_amber} ambient, teal ${s.palette.systems_teal} systems, coral-red ${s.palette.hazard_alien_coral} alien, against grimy slate ${s.palette.grimy_slate}.`);
  if(s.negative)      parts.push("Avoid: "+s.negative);
  if(s.aspect)        parts.push(s.aspect+".");
  return parts.join(" ").replace(/\s+/g," ").trim();
}

/* ---- collect targets ---- */
function targets(ship){
  const scByDeck = {}; (ship.scenes||[]).forEach(sc=>scByDeck[sc.deck]=sc);
  const out = [];
  [...ship.decks].sort((a,b)=>b.level-a.level).forEach(d=>{
    const sc = scByDeck[d.id];
    d.rooms.forEach(r=>{
      if(!r.image_prompt) return;
      out.push({ id:r.id, title:r.name, kind:"location", scene: sc?sc.n:null,
                 spoiler:!!r.spoiler, show_to: r.spoiler?"warden":"players",
                 prompt:r.image_prompt });
    });
  });
  (ship.image_events||[]).forEach(e=>{
    out.push({ id:e.id, title:e.id.replace(/-/g," "), kind:"event", scene:e.scene,
               spoiler:!!e.spoiler, show_to:e.show_to||(e.spoiler?"warden":"players"),
               prompt:e.prompt });
  });
  return out;
}

/* ---- providers ---- */
async function genOpenAI(prompt){
  const key = process.env.OPENAI_API_KEY;
  if(!key) throw new Error("OPENAI_API_KEY is not set.");
  const model = String(flag("model","gpt-image-1"));
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method:"POST",
    headers:{ "Authorization":"Bearer "+key, "Content-Type":"application/json" },
    body: JSON.stringify({ model, prompt, size, quality, n:1 })
  });
  if(!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0,300)}`);
  const j = await res.json();
  const b64 = j.data && j.data[0] && j.data[0].b64_json;
  if(!b64) throw new Error("OpenAI: no image data returned.");
  return Buffer.from(b64, "base64");
}
async function genStability(prompt){
  const key = process.env.STABILITY_API_KEY;
  if(!key) throw new Error("STABILITY_API_KEY is not set.");
  const model = String(flag("model","sd3.5-large"));
  const fd = new FormData();
  fd.append("prompt", prompt);
  fd.append("output_format", "png");
  fd.append("aspect_ratio", "16:9");
  fd.append("model", model);
  const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
    method:"POST",
    headers:{ "Authorization":"Bearer "+key, "Accept":"image/*" },
    body: fd
  });
  if(!res.ok) throw new Error(`Stability ${res.status}: ${(await res.text()).slice(0,300)}`);
  return Buffer.from(await res.arrayBuffer());
}
const generate = provider==="stability" ? genStability : genOpenAI;

/* ---- helpers ---- */
const exists = async p => { try { await access(p, constants.F_OK); return true; } catch { return false; } };
const sleep  = ms => new Promise(r=>setTimeout(r,ms));
async function withRetry(fn, label){
  let wait = 2000;
  for(let i=1;i<=4;i++){
    try { return await fn(); }
    catch(e){
      const transient = /(\b429\b|\b5\d\d\b|network|fetch failed|ETIMEDOUT|ECONNRESET)/i.test(e.message);
      if(i===4 || !transient) throw e;
      console.warn(`   ↻ ${label} failed (${e.message.slice(0,80)}); retry ${i} in ${wait/1000}s`);
      await sleep(wait); wait*=2;
    }
  }
}

/* ---- main ---- */
const ship = JSON.parse(await readFile(SHIP_JSON, "utf8"));
await mkdir(OUT_DIR, { recursive:true });

let list = targets(ship);
if(only.length)            list = list.filter(t=>only.includes(t.id));
if(audience==="player")    list = list.filter(t=>t.show_to==="players");

console.log(`Provider: ${provider}${dry?" (DRY RUN — no API calls)":""}`);
console.log(`Targets:  ${list.length}  ·  size ${size}  ·  out ${path.relative(ROOT,OUT_DIR)}/\n`);

const manifest = { generated_at:new Date().toISOString(), provider, dry, size, items:[] };
let made=0, skipped=0, failed=0;

for(const t of list){
  const full = assemble(ship, t.prompt);
  const file = `${t.id}.png`;
  const dest = path.join(OUT_DIR, file);
  const safe = t.show_to==="players";
  const rec  = { id:t.id, title:t.title, kind:t.kind, scene:t.scene,
                 file, audience: safe?"player":"warden", spoiler:t.spoiler,
                 prompt: full };

  if(dry){
    console.log(`• ${t.id}  [${safe?"player":"warden"}]\n  ${full.slice(0,140)}…\n`);
    manifest.items.push(rec); continue;
  }
  if(!force && await exists(dest)){
    console.log(`= ${t.id}  (exists, skip)`); skipped++; manifest.items.push(rec); continue;
  }
  try{
    const buf = await withRetry(()=>generate(full), t.id);
    await writeFile(dest, buf);
    console.log(`✓ ${t.id}  (${(buf.length/1024).toFixed(0)} KB)`); made++;
    manifest.items.push(rec);
    if(delayMs) await sleep(delayMs);
  }catch(e){
    console.error(`✗ ${t.id}: ${e.message}`); failed++;
  }
}

await writeFile(path.join(OUT_DIR,"manifest.json"), JSON.stringify(manifest,null,2)+"\n");
// no-fetch mirror for the Gallery page (works on file:// and GitHub Pages alike)
await writeFile(path.join(OUT_DIR,"manifest.js"),
  "/* GENERATED by tools/generate-images.mjs — do not edit by hand. */\n"
  + "window.DROSS_IMAGES = " + JSON.stringify(manifest,null,2) + ";\n");
console.log(`\nDone. made ${made} · skipped ${skipped} · failed ${failed} · manifest updated.`);
if(failed) process.exitCode = 1;
