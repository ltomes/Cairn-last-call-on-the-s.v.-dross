/* ============================================================
   warden.js — session-level Warden Mode for the S.V. Dross tools.

   Default OFF. While off, spoiler content is blocked everywhere:
     - elements marked  data-warden="only"   are hidden
     - elements marked  data-warden="locked"  are shown (the "enable" hints)
     - Warden-only pages (soundboard, maps) render a gate instead of content
   The Warden enables it for the session (sessionStorage — clears when the
   browser session ends). Enabling requires a confirm so players can't trip
   into spoilers by accident.

   Include on every page:  <script src="assets/warden.js"></script>
   Pages read window.Warden.on and listen for the "warden:change" event.
   ============================================================ */
(function(){
  "use strict";
  const KEY = "dross.warden.v1";

  function on(){ try { return sessionStorage.getItem(KEY) === "1"; } catch(e){ return false; } }
  function store(v){ try { v ? sessionStorage.setItem(KEY,"1") : sessionStorage.removeItem(KEY); } catch(e){} }

  function set(v){
    store(v);
    document.documentElement.classList.toggle("warden-on", v);
    sync();
    try { window.dispatchEvent(new CustomEvent("warden:change", { detail:{ on:v } })); } catch(e){}
  }
  function enable(){
    if(on()) return;
    const ok = window.confirm(
      "Enable Warden Mode for this session?\n\n" +
      "This reveals SPOILERS — the SADYS twist, Brood Mama, the nest, and the full " +
      "Warden run-doc. Only do this if you're the Warden, and not while players can see your screen."
    );
    if(ok) set(true);
  }
  function disable(){ if(on()) set(false); }

  function control(){
    let el = document.getElementById("wardenCtl");
    if(!el){
      el = document.createElement("div");
      el.id = "wardenCtl"; el.className = "warden-ctl no-print";
      (document.body || document.documentElement).appendChild(el);
    }
    return el;
  }
  function sync(){
    const o = on();
    document.documentElement.classList.toggle("warden-on", o);
    control().innerHTML = o
      ? '<span class="wc-dot on"></span> Warden <b>on</b> <button type="button" onclick="Warden.disable()">turn off</button>'
      : '<span class="wc-dot"></span> Warden <b>off</b> <button type="button" onclick="Warden.enable()">enable</button>';
    document.querySelectorAll('[data-warden="only"]').forEach(n => { n.hidden = !o; });
    document.querySelectorAll('[data-warden="locked"]').forEach(n => { n.hidden = o; });
  }

  window.Warden = { get on(){ return on(); }, enable, disable, set, sync };

  if(document.readyState !== "loading") sync();
  else document.addEventListener("DOMContentLoaded", sync);
})();
