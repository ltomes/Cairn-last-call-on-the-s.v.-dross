// Build step: compute clearance-aware wayfinding paths and write them into
// ship-layout.json (wayfinding.routes[].path), then regenerate ship.js.
import fs from "fs";
const DIR = process.env.CAIRN_DIR || ".";
const ship = JSON.parse(fs.readFileSync(DIR + "/setting/ship-layout.json", "utf8"));
const dress = JSON.parse(fs.readFileSync(DIR + "/setting/set-dressing.json", "utf8"));
const DC = dress.design_code, M = dress.grid_m_per_unit, RES = 4;
const m2u = m => m / M;
const roomById = {}; ship.decks.forEach(d => d.rooms.forEach(r => roomById[r.id] = r));
const deckOf = {}; ship.decks.forEach(d => d.rooms.forEach(r => deckOf[r.id] = d));
const rectOf = r => [r.rect.x, r.rect.y, r.rect.w, r.rect.h];
const inRect = (ux, uy, R) => ux >= R[0] && ux <= R[0]+R[2] && uy >= R[1] && uy <= R[1]+R[3];
// hull containment: rooms are drawn CLIPPED to deck.hull, so the routable area must be
// inside the hull AND clear of the angled hull walls — otherwise a line drawn in the
// rect-but-outside-hull margin reads as "in the wall".
const pip = (p, poly) => { let c = false; for (let i=0,j=poly.length-1;i<poly.length;j=i++){ const a=poly[i],b=poly[j];
  if (((a[1]>p[1])!==(b[1]>p[1])) && (p[0] < (b[0]-a[0])*(p[1]-a[1])/((b[1]-a[1])||1e-9)+a[0])) c=!c; } return c; };
const d2seg = (p, a, b) => { const dx=b[0]-a[0], dy=b[1]-a[1], L=dx*dx+dy*dy||1e-9;
  let t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L; t=Math.max(0,Math.min(1,t));
  return Math.hypot(p[0]-(a[0]+t*dx), p[1]-(a[1]+t*dy)); };
const dPoly = (p, poly) => { let m=Infinity; for (let i=0,j=poly.length-1;i<poly.length;j=i++) m=Math.min(m,d2seg(p,poly[i],poly[j])); return m; };

function bridge(a, b){
  const A = rectOf(roomById[a]), B = rectOf(roomById[b]);
  const half = m2u(DC.aisle_min_clear_m)/2 + 0.2;
  const ox0 = Math.max(A[0], B[0]), ox1 = Math.min(A[0]+A[2], B[0]+B[2]);
  if (ox1 > ox0){ const cx=(ox0+ox1)/2, y0=Math.min(A[1]+A[3],B[1]+B[3]), y1=Math.max(A[1],B[1]);
    return [cx-half, Math.min(y0,y1)-0.5, 2*half, Math.abs(y1-y0)+1]; }
  const oy0 = Math.max(A[1], B[1]), oy1 = Math.min(A[1]+A[3], B[1]+B[3]);
  const cy=(oy0+oy1)/2, x0=Math.min(A[0]+A[2],B[0]+B[2]), x1=Math.max(A[0],B[0]);
  return [Math.min(x0,x1)-0.5, cy-half, Math.abs(x1-x0)+1, 2*half];
}
function obstacles(rooms){
  const obs = [];
  for (const rid of rooms){ const rd = (dress.rooms||{})[rid]; if(!rd) continue;
    const inflEq = m2u(DC.equipment_clearance_m), inflF = m2u(DC.wall_offset_m);
    (rd.work_zones||[]).forEach(z => { const [x,y,w,h]=z.rect, inf = z.equipment ? inflEq : inflF;
      obs.push([x-inf, y-inf, w+2*inf, h+2*inf]); });
    (rd.dressing||[]).forEach(d => { if(d.place==="floor" && d.footprint){ const [w,h]=d.footprint, [x,y]=d.pos;
      obs.push([x-w/2-inflF, y-h/2-inflF, w+2*inflF, h+2*inflF]); }}); }
  return obs;
}
function route(spec){
  const rooms = spec.rooms;
  // inset each room by the wall offset so the FLOOR line hugs NEAR the wall, not ON it
  const wo = m2u(DC.wall_offset_m);
  const inset = R => [R[0]+wo, R[1]+wo, Math.max(0.1, R[2]-2*wo), Math.max(0.1, R[3]-2*wo)];
  const regions = rooms.map(r => inset(rectOf(roomById[r])));
  for (let i=0;i<rooms.length-1;i++) regions.push(bridge(rooms[i], rooms[i+1]));  // door bridges stay full width
  const obs = obstacles(rooms);
  const hull = (deckOf[rooms[0]] || {}).hull;
  const inHull = (ux, uy) => !hull || (pip([ux, uy], hull) && dPoly([ux, uy], hull) >= wo);
  const walkable = (ux,uy) => regions.some(R=>inRect(ux,uy,R)) && inHull(ux,uy) && !obs.some(O=>inRect(ux,uy,O));
  const off = m2u(DC.wall_offset_m);
  const roomAt = (ux,uy) => rooms.find(rr=>inRect(ux,uy,rectOf(roomById[rr])));
  const hugCost = (ux,uy) => { const rid=roomAt(ux,uy); if(!rid) return 0; const h=(dress.rooms[rid]||{}).hug; const r=rectOf(roomById[rid]);
    if(h==="starboard") return (r[0]+r[2]-off-ux); if(h==="port") return (ux-(r[0]+off));
    if(h==="aft") return (r[1]+r[3]-off-uy); if(h==="fore") return (uy-(r[1]+off)); return 0; };
  const key=(cx,cy)=>cx+","+cy, cellWalk=(cx,cy)=>walkable(cx/RES,cy/RES);
  function snap(pt){ let s=[Math.round(pt[0]*RES),Math.round(pt[1]*RES)]; if(cellWalk(...s)) return s;
    const q=[s], seen=new Set([key(...s)]);
    while(q.length){ const [cx,cy]=q.shift();
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const n=[cx+dx,cy+dy], k=key(...n);
        if(seen.has(k)) continue; seen.add(k); if(cellWalk(...n)) return n; if(seen.size<8000) q.push(n); } } return s; }
  const start=snap(spec.entry), goal=snap(spec.exit);
  const h=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const open=new Map(), g=new Map(), came=new Map(), HUGW=1.2;
  g.set(key(...start),0); open.set(key(...start),h(start,goal)); let iter=0;
  while(open.size && iter++<300000){ let bk=null,bf=Infinity; for(const [k,f] of open) if(f<bf){bf=f;bk=k;}
    open.delete(bk); const [cx,cy]=bk.split(",").map(Number);
    if(Math.abs(cx-goal[0])<=1 && Math.abs(cy-goal[1])<=1){ came.set(key(...goal),bk); g.set(key(...goal),g.get(bk)); break; }
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=cx+dx, ny=cy+dy; if(!cellWalk(nx,ny)) continue;  // ORTHOGONAL only -> lines run parallel to walls, 90deg turns (no diagonal shortcuts)
      const step=Math.hypot(dx,dy)*(1 + HUGW*Math.max(0,hugCost(nx/RES,ny/RES))), nk=key(nx,ny), ng=g.get(bk)+step;
      if(ng < (g.get(nk)??Infinity)){ g.set(nk,ng); came.set(nk,bk); open.set(nk, ng + h([nx,ny],goal)); } } }
  let path=[], cur=came.has(key(...goal))?key(...goal):null;
  while(cur){ const [cx,cy]=cur.split(",").map(Number); path.push([cx/RES, cy/RES]); cur=came.get(cur); }
  path.reverse();
  if(path.length<2){ console.error("  !! no path", spec.id); return [spec.entry, spec.exit]; }
  const simp=[path[0]];
  for(let i=1;i<path.length-1;i++){ const a=simp[simp.length-1],b=path[i],c=path[i+1];
    if(Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))>0.15) simp.push(b); }
  simp.push(path[path.length-1]);
  return simp.map(p=>[Math.round(p[0]*100)/100, Math.round(p[1]*100)/100]);
}

const SPECS = {
  "wf-a":        { rooms:["stasis-bay","corr-a","commons-a"],        entry:[3.5,10], exit:[17,17] },
  "wf-b-ladder": { rooms:["mess-hall"],                              entry:[5,8],    exit:[10,4]  },
  "wf-b-crawl":  { rooms:["mess-hall","corr-b","scrubber-corridor"], entry:[5,5],    exit:[10,21] },
  "wf-c":        { rooms:["scrubber-control","corr-c","crawlspace"], entry:[4,3],    exit:[9,21]  },
  "wf-d":        { rooms:["cargo-hold","corr-d","cargo-airlock"],    entry:[10,5],   exit:[10,29] },
};
for (const rt of ship.wayfinding.routes){ const s = SPECS[rt.id]; if(!s) continue;
  rt.rooms = s.rooms; rt.entry = s.entry; rt.exit = s.exit;
  rt.path = route({ id: rt.id, ...s });
  console.error(rt.id, "->", rt.path.length, "pts"); }

fs.writeFileSync(DIR + "/setting/ship-layout.json", JSON.stringify(ship, null, 2) + "\n");
fs.writeFileSync(DIR + "/docs/assets/ship.js",
  "/* GENERATED — mirror of setting/ship-layout.json; do not edit by hand. */\nwindow.DROSS_SHIP = " + JSON.stringify(ship, null, 2) + ";\n");
console.error("wrote ship-layout.json + ship.js");
