// conform-dressing.mjs — one-shot. After conform-decks.mjs moved the rooms, this remaps
// everything that was positioned in the OLD room frames into the NEW ones (proportionally):
//   - set-dressing.json   work_zones[].rect, dressing[].pos   (routing obstacles + props)
//   - ship-layout.json    entities[].pos                      (plot props shown on the map)
// Guarded by dress._conformed_v2 so re-running is a no-op (the remap is relative, not idempotent).
//   node setting/conform-dressing.mjs   (run AFTER conform-decks.mjs, BEFORE route-waypoints.mjs)
import fs from "fs";
const shipP = new URL("./ship-layout.json", import.meta.url);
const dressP = new URL("./set-dressing.json", import.meta.url);
const ship = JSON.parse(fs.readFileSync(shipP, "utf8"));
const dress = JSON.parse(fs.readFileSync(dressP, "utf8"));
if (dress._conformed_v2) { console.log("dressing already conformed (v2) — no-op"); process.exit(0); }

// pre-conform room rects (only rooms that moved); new rects are read live from ship-layout.json
const OLD = {
  "bridge":[7,1,5,15],"gladys-core":[10,2,4,14],"stasis-bay":[1,7,7,9],"crew-quarters":[10,7,8,9],
  "commons-a":[2,16,16,3],"holo-bay":[8,19,4,4],"corr-a":[8,4,2,13],
  "mess-hall":[2,3,9,10],"galley-store":[11,3,5,5],"rec-nook":[2,14,5,5],"scrubber-corridor":[9,13,3,9],
  "scrubber-control":[2,2,4,4],"power-plant":[8,2,10,5],"crawlspace":[8,6,2,16],
  "maintenance-airlock":[15,16,3,3],"water-reclamation":[2,22,4,4],"corr-c":[6,4,2,4],
  "cargo-hold":[1,2,19,24],"cargo-airlock":[8,27,5,4],"reclamation-maw":[1,28,19,8],"corr-d":[9,25,4,3],
};
const roomById = {}; ship.decks.forEach(d => d.rooms.forEach(r => roomById[r.id] = r));
const NEW = id => { const r = roomById[id]; return r ? [r.rect.x, r.rect.y, r.rect.w, r.rect.h] : null; };
const r2 = n => Math.round(n * 100) / 100;
// proportional point remap old-frame -> new-frame for a room; null if room didn't move
const remap = id => { const o = OLD[id], n = NEW(id); if (!o || !n) return null;
  return (px, py) => [ n[0] + (o[2] ? (px - o[0]) / o[2] : 0) * n[2], n[1] + (o[3] ? (py - o[1]) / o[3] : 0) * n[3] ]; };
// place a w*h zone centred on (cx,cy), clamped to stay inside new room rect n
const placeZone = (cx, cy, w, h, n) => {
  let x = cx - w / 2, y = cy - h / 2;
  x = w > n[2] ? n[0] + (n[2] - w) / 2 : Math.max(n[0], Math.min(x, n[0] + n[2] - w));
  y = h > n[3] ? n[1] + (n[3] - h) / 2 : Math.max(n[1], Math.min(y, n[1] + n[3] - h));
  return [r2(x), r2(y), w, h];
};

let zN = 0, dN = 0, eN = 0;
for (const [rid, rd] of Object.entries(dress.rooms || {})) {
  const f = remap(rid); if (!f) continue; const n = NEW(rid);
  (rd.work_zones || []).forEach(z => { const [x, y, w, h] = z.rect; const [cx, cy] = f(x + w / 2, y + h / 2); z.rect = placeZone(cx, cy, w, h, n); zN++; });
  (rd.dressing || []).forEach(d => { if (Array.isArray(d.pos)) { const [px, py] = f(d.pos[0], d.pos[1]); d.pos = [r2(px), r2(py)]; dN++; } });
}
for (const e of (ship.entities || [])) {
  const f = e.room && remap(e.room); if (!f || !e.pos) continue;
  const [nx, ny] = f(e.pos.x, e.pos.y); e.pos.x = r2(nx); e.pos.y = r2(ny); eN++;
}
dress._conformed_v2 = true;
fs.writeFileSync(dressP, JSON.stringify(dress, null, 2) + "\n");
fs.writeFileSync(shipP, JSON.stringify(ship, null, 2) + "\n");
console.log(`remapped ${zN} work_zones, ${dN} floor-dressing, ${eN} entities into the conformed rooms`);
