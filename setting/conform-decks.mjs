// conform-decks.mjs — authoring tool. Reshapes each deck.hull into the disc/bulb
// cross-section from exterior (D widest aft-bulb -> A narrowest command; rounded bow
// fore; symmetric; maw EXTERNAL, not a deck room) and grows the perimeter rooms OUT to
// the shell so the renderer's hull-clip gives them angled exterior walls. Only outer
// edges move — inner edges/adjacencies/entity positions are preserved (plot wiring intact).
// Writes ship-layout.json back (minimal diff: file is canonical 2-space JSON) + regens ship.js.
//   node setting/conform-decks.mjs
import fs from "fs";
const P = new URL("./ship-layout.json", import.meta.url);
const d = JSON.parse(fs.readFileSync(P, "utf8"));

const HULL = {
  // Deck A is the HAMMERHEAD deck: the convex BODY (habitation spine) used for clipping rooms;
  // the winged hammerhead is the Bridge's own polygon + the concave hull_outline below.
  "deck-a": [[5,6],[15,6],[16,9],[16,16],[14,20],[11,22],[9,22],[6,20],[4,16],[4,9]],
  "deck-b": [[5,0],[13,0],[16,3],[18,8],[18,17],[16,22],[12,25],[6,25],[2,22],[0,17],[0,8],[2,3]],
  "deck-c": [[5,0],[14,0],[18,4],[20,9],[20,20],[18,26],[13,29],[6,29],[1,26],[-1,20],[-1,9],[1,4]],
  "deck-d": [[6,0],[13,0],[17,4],[19,9],[20,16],[20,26],[21,31],[18,36],[14,39],[5,39],[1,36],[-1,31],[0,26],[0,16],[1,9],[3,4]],
};
// Deck A concave silhouette (drawn shell): narrow raked cockpit nose -> sensor/grapple WINGS
// jutting past the body on both sides -> habitation spine behind. Symmetric about gx=10.
const OUTLINE = {
  "deck-a": [[8,0],[12,0],[13,1],[21,1],[21,5],[16,6],[16,9],[16,16],[14,20],[11,22],[9,22],[6,20],[4,16],[4,9],[4,6],[-1,5],[-1,1],[7,1]],
};
// Explicit room polygons (drawn as-is, NOT hull-clipped). The Bridge IS the hammerhead:
// a wide thin CROSSBAR of sensor/grapple wing pods jutting past the hull (gx -1..21, well past
// the gx4..16 body), with a raked cockpit viewport nub at the forward tip; necks into the body.
const POLY = {
  "bridge": [[8,0],[12,0],[13,1],[21,1],[21,5],[13,5],[13,7],[7,7],[7,5],[-1,5],[-1,1],[7,1]],
};
// rooms grown to the shell (outer edges only); interior rooms untouched
const RECT = {
  // A — Bridge = hammerhead (POLY); habitation spine behind: stasis(port)/GLADYS(stbd) + crew + aft commons
  "bridge":{x:5,y:0,w:10,h:7}, "stasis-bay":{x:0,y:7,w:10,h:7}, "gladys-core":{x:10,y:7,w:6,h:5},
  "crew-quarters":{x:10,y:12,w:10,h:7}, "commons-a":{x:0,y:16,w:20,h:6}, "holo-bay":{x:7,y:18,w:6,h:5},
  "corr-a":{x:8,y:7,w:2,h:9},
  // B — mess(port-fore)/galley(stbd-fore) + rec(port-aft)/scrubber-corridor(stbd-aft)
  "mess-hall":{x:1,y:2,w:10,h:11}, "galley-store":{x:11,y:2,w:8,h:7}, "rec-nook":{x:1,y:13,w:7,h:10},
  "scrubber-corridor":{x:9,y:13,w:9,h:10},
  // C — scrubber ctrl + reactor forward, crawlspace spine, airlock(stbd), water-recl(port-aft)
  "scrubber-control":{x:0,y:1,w:6,h:7}, "power-plant":{x:7,y:1,w:13,h:7}, "crawlspace":{x:8,y:8,w:3,h:19},
  "corr-c":{x:6,y:4,w:2,h:6}, "maintenance-airlock":{x:16,y:15,w:5,h:6}, "water-reclamation":{x:0,y:22,w:8,h:7},
  // D — cargo hold fills the disc; aft bulb = gangway + airlock(port) + reclamation bay(stbd)
  "cargo-hold":{x:0,y:0,w:20,h:26}, "corr-d":{x:7,y:26,w:6,h:3},
  "cargo-airlock":{x:0,y:29,w:10,h:10}, "reclamation-maw":{x:10,y:29,w:10,h:10},
};

let hullN = 0, rectN = 0;
for (const deck of d.decks) {
  if (HULL[deck.id]) { deck.hull = HULL[deck.id]; hullN++; }
  if (OUTLINE[deck.id]) deck.hull_outline = OUTLINE[deck.id]; else delete deck.hull_outline;
  for (const r of deck.rooms) {
    if (RECT[r.id]) { Object.assign(r.rect, RECT[r.id]); rectN++; }
    if (POLY[r.id]) r.poly = POLY[r.id]; else delete r.poly;
    if (r.id === "reclamation-maw") { r.name = "Reclamation Bay (rear cargo door)"; r.map_label = "Reclam. Bay"; }
  }
}
// Each deck's waypoint guide gets its OWN hi-vis colour, all distinct from the room/entity
// UX palette (amber #f2b441 / teal #4fd1c5 / purple #a78bfa / coral #ff7a6b) so routes read
// clearly on the plan and you can tell which deck's path at a glance.
if (d.wayfinding) {
  d.wayfinding.deck_colors = { "deck-a": "#b6ff00", "deck-b": "#ff36c4", "deck-c": "#00c2ff", "deck-d": "#ffffff" };
  delete d.wayfinding.line_color;
}
fs.writeFileSync(P, JSON.stringify(d, null, 2) + "\n");
// regen the web mirror
const js = "/* GENERATED — mirror of setting/ship-layout.json; do not edit by hand. */\nwindow.DROSS_SHIP = " + JSON.stringify(d, null, 2) + ";\n";
fs.writeFileSync(new URL("../docs/assets/ship.js", import.meta.url), js);
console.log(`conformed ${hullN} hulls, ${rectN} rooms; relabelled maw; regenerated ship.js`);
