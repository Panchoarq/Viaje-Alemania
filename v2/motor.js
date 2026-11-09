// Pestañas del motor de viajes nuevos (todas menos «Configurar»), sobre los paquetes de ciudad.
// Cada vista recibe ctx = {W, viaje, ids, M, PAIS, ruta, esc, pretty, add, km, fh, nube, DEMO, guardar, render}
// W.sel{ciudad:[ids]} · W.prog{ciudad:[[ids por día]]} · W.alo{ciudad:{...}} · W.tk{tramo:{...}} · W.shows[] · W.tram{clave:1}
const CAP={rap:7.5,int:5.5,rel:4},CAPN={rap:"rápido",int:"intermedio",rel:"relajado"};
const EUR=n=>Math.round(n).toLocaleString("es-CL")+" €";
const q=s=>encodeURIComponent(s);
const sub=(ctx,cid,k)=>`<div class="sub" role="tablist">${ctx.ids.map(i=>`<button type="button" data-sub="${i}" aria-selected="${i===cid}">${ctx.esc(ctx.M[i].CIUDAD.n.replace(/ y .*/,""))}</button>`).join("")}</div>`;
let SUB={};
const ciudadActual=(ctx,k)=>{const c=SUB.c;return ctx.ids.includes(c)?c:ctx.ids[0]};
function enlazarSub(ctx,k){document.querySelectorAll("[data-sub]").forEach(b=>b.onclick=()=>{SUB.c=b.dataset.sub;ctx.render()})}

// ---------- utilidades del programa
export const diasDe=(ctx,cid)=>Math.max(1,(ctx.W.ciudades.find(x=>x.id===cid)||{noches:1}).noches);
export function inicioCiudad(ctx,cid){let d=0;for(const x of ctx.W.ciudades){if(x.id===cid)return d;d+=x.noches}return 0}
function selDe(ctx,cid){
  const W=ctx.W;W.sel=W.sel||{};
  if(!W.sel[cid]){const A=ctx.M[cid].ATRACCIONES||[],cap=CAP[(W.ritmo||{})[cid]||"int"]*diasDe(ctx,cid);let h=0;const s=[];
    for(const a of [...A].sort((a,b)=>(b.top?1:0)-(a.top?1:0))){if(a.top||h+a.h<=cap){s.push(a.id);h+=a.h}}
    W.sel[cid]=s}
  return new Set(W.sel[cid]);
}
export function organizar(ctx,cid){
  const W=ctx.W,A=(ctx.M[cid].ATRACCIONES||[]).filter(a=>selDe(ctx,cid).has(a.id)),nd=diasDe(ctx,cid),cap=CAP[(W.ritmo||{})[cid]||"int"];
  const rest=[...A].sort((a,b)=>(b.top?1:0)-(a.top?1:0)),dias=[];
  for(let d=0;d<nd;d++){
    if(!rest.length){dias.push([]);continue}
    const seed=rest.shift(),dia=[seed];let h=seed.h;
    for(;;){const ult=dia[dia.length-1];let best=null,bd=1e9;
      for(const r of rest){const k=ctx.km(ult.ll,r.ll);if(h+r.h<=cap+.01&&k<bd){best=r;bd=k}}
      if(!best||bd>25)break;dia.push(best);h+=best.h;rest.splice(rest.indexOf(best),1)}
    dias.push(dia);
  }
  W.prog=W.prog||{};W.prog[cid]=dias.map(d=>d.map(a=>a.id));
  W.sinLugar=W.sinLugar||{};W.sinLugar[cid]=rest.map(a=>a.id);
}

// ---------- 3 · Atracciones
function atracciones(ctx){
  const cid=ciudadActual(ctx,"att"),M=ctx.M[cid],A=M.ATRACCIONES||[],S=selDe(ctx,cid),W=ctx.W;
  const tot=A.filter(a=>S.has(a.id)),hs=tot.reduce((t,a)=>t+a.h,0),pr=tot.reduce((t,a)=>t+(a.p||0),0);
  const cap=CAP[(W.ritmo||{})[cid]||"int"]*diasDe(ctx,cid);
  return `${sub(ctx,cid)}<section class="hoja"><h2>${ctx.esc(M.CIUDAD.n)} · atracciones</h2>
   <p class="muted">${esc2(M.CIUDAD.resumen||"")}</p>
   <div class="aviso ${hs>cap*1.05?"alerta":""}"><b>${tot.length}</b> elegidas · <b>${ctx.fh(hs)}</b> de visita · <b>${EUR(pr)}</b> por persona en entradas.<br>Tu ritmo (${CAPN[(W.ritmo||{})[cid]||"int"]}) y ${diasDe(ctx,cid)} día${diasDe(ctx,cid)>1?"s":""} dan para ~${ctx.fh(cap)}${hs>cap*1.05?`. <b>Te pasas por ${ctx.fh(hs-cap)}</b>: quita algunas o suma noches en Configurar.`:"."}</div>
   <div class="lista">${A.map(a=>`<label class="att ${S.has(a.id)?"on":""}"><input type="checkbox" data-a="${a.id}" ${S.has(a.id)?"checked":""}><span><b>${ctx.esc(a.n)}</b>${a.top?' <em class="tp">imperdible</em>':""}<small>${ctx.fh(a.h)} · ${a.p?EUR(a.p):"gratis"}${a.in?" · techada":""}${a.close?" · cierra "+a.close+" h":""}</small><span class="d">${ctx.esc(a.s||"")}</span>${a.v?`<details><summary>Qué ver y consejo</summary><p>${ctx.esc(a.v)}</p>${a.d?`<p><b>Consejo:</b> ${ctx.esc(a.d)}</p>`:""}${a.u?`<p><a href="${ctx.esc(a.u)}" target="_blank" rel="noopener">Sitio oficial</a> · <a href="https://www.google.com/maps/search/?api=1&query=${q(a.n+" "+M.CIUDAD.n)}" target="_blank" rel="noopener">Mapa</a></p>`:""}</details>`:""}</span></label>`).join("")||'<p class="muted">Esta ciudad aún no tiene atracciones precargadas.</p>'}</div>
   <div class="fila-btn"><button class="btn dark" type="button" id="irProg">Organizar estos días en el Programa →</button></div></section>`;
}
const esc2=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function bindAtracciones(ctx){
  const cid=ciudadActual(ctx,"att");
  document.querySelectorAll("[data-a]").forEach(c=>c.onchange=()=>{const S=selDe(ctx,cid);c.checked?S.add(c.dataset.a):S.delete(c.dataset.a);ctx.W.sel[cid]=[...S];if(ctx.W.prog)delete ctx.W.prog[cid];ctx.guardar();ctx.render()});
  $("#irProg").onclick=()=>{organizar(ctx,cid);ctx.guardar();ctx.ir("prog")};
}

// ---------- 2 · Programa
function programa(ctx){
  const cid=ciudadActual(ctx,"prog"),M=ctx.M[cid],W=ctx.W,nd=diasDe(ctx,cid),A=Object.fromEntries((M.ATRACCIONES||[]).map(a=>[a.id,a]));
  const P=(W.prog||{})[cid],i0=inicioCiudad(ctx,cid),sin=(W.sinLugar||{})[cid]||[];
  const dias=P?P:null;
  return `${sub(ctx,cid)}<section class="hoja"><h2>${ctx.esc(M.CIUDAD.n)} · programa</h2>
   <p class="muted">${nd} día${nd>1?"s":""} · ritmo ${CAPN[(W.ritmo||{})[cid]||"int"]} (~${ctx.fh(CAP[(W.ritmo||{})[cid]||"int"])} de actividades al día). Agrupo por cercanía y pongo primero lo imperdible.</p>
   <div class="fila-btn"><button class="btn dark" id="org" type="button">Organizar</button><button class="btn" id="vac" type="button">Vaciar</button><button class="btn" id="irAtt" type="button">Elegir atracciones</button></div>
   ${sin.length?`<div class="aviso alerta"><b>No caben ${sin.length}:</b> ${sin.map(i=>ctx.esc(A[i].n)).join(", ")}. Suma noches en Configurar, cambia el ritmo o quítalas de la selección.</div>`:""}
   ${dias?dias.map((d,i)=>{const h=d.reduce((t,id)=>t+A[id].h,0),pr=d.reduce((t,id)=>t+(A[id].p||0),0);
     return `<div class="dia"><h3>Día ${i0+i+1}${ctx.fechas()?" · "+ctx.pretty(ctx.add(ctx.W.inicio,i0+i)):""}<small>${d.length?ctx.fh(h)+" · "+EUR(pr):"libre"}</small></h3>
     ${d.length?d.map((id,j)=>`<div class="act"><span>${j+1}</span><div><b>${ctx.esc(A[id].n)}</b><small>${ctx.fh(A[id].h)}${A[id].p?" · "+EUR(A[id].p):""}${A[id].close?" · cierra "+A[id].close+" h":""}</small></div><select data-mv="${id}" aria-label="Mover a otro día">${dias.map((_,k)=>`<option value="${k}" ${k===i?"selected":""}>Día ${i0+k+1}</option>`).join("")}</select></div>`).join(""):'<p class="muted">Día libre: descanso, compras o improvisar.</p>'}</div>`}).join(""):
     `<p class="aviso">Aún no organizado. Elige atracciones y pulsa <b>Organizar</b>: las reparto por días.</p>`}
  </section>`;
}
function bindPrograma(ctx){
  const cid=ciudadActual(ctx,"prog"),W=ctx.W;
  $("#org").onclick=()=>{organizar(ctx,cid);ctx.guardar();ctx.render()};
  $("#vac").onclick=()=>{if(W.prog)delete W.prog[cid];if(W.sinLugar)delete W.sinLugar[cid];ctx.guardar();ctx.render()};
  $("#irAtt").onclick=()=>ctx.ir("att");
  document.querySelectorAll("[data-mv]").forEach(s=>s.onchange=()=>{const id=s.dataset.mv,P=W.prog[cid];P.forEach(d=>{const j=d.indexOf(id);if(j>=0)d.splice(j,1)});P[+s.value].push(id);ctx.guardar();ctx.render()});
}

// ---------- 4 · Escapadas (solo viajes con una ciudad base)
function escapadas(ctx){
  if(ctx.ids.length>1)return `<section class="hoja"><h2>Escapadas</h2><p class="aviso">Las escapadas sirven cuando te quedas en <b>una ciudad base</b> y sales a pasear a otros lugares (en el día o en dos días). Tu viaje recorre ${ctx.ids.length} ciudades, así que esta sección queda en blanco. Si dejas una sola ciudad en <b>Configurar</b>, se activa.</p></section>`;
  const cid=ctx.ids[0],M=ctx.M[cid],E=M.ESCAPADAS||[],sel=new Set((ctx.W.esc||[]));
  return `<section class="hoja"><h2>Escapadas desde ${ctx.esc(M.CIUDAD.n)}</h2><p class="muted">Paseos de ida y vuelta (o con una noche) desde tu base. Marca los que quieres hacer.</p>
  <div class="lista">${E.map(e=>`<label class="att ${sel.has(e.id)?"on":""}"><input type="checkbox" data-e="${e.id}" ${sel.has(e.id)?"checked":""}><span><b>${ctx.esc(e.n)}</b> <em class="tp">${e.k==="dia"?"en el día":e.k==="noche"?"con noche":"día o noche"}</em><small>Ida: ${ctx.esc(e.tr)} · noches: ${ctx.esc(e.nt)}</small><span class="d">${ctx.esc(e.t)}</span><a href="https://www.google.com/maps/dir/?api=1&origin=${q(M.CIUDAD.n)}&destination=${q(e.n)}" target="_blank" rel="noopener">Cómo llegar</a></span></label>`).join("")||'<p class="muted">Sin escapadas precargadas.</p>'}</div></section>`;
}
function bindEscapadas(ctx){document.querySelectorAll("[data-e]").forEach(c=>c.onchange=()=>{const S=new Set(ctx.W.esc||[]);c.checked?S.add(c.dataset.e):S.delete(c.dataset.e);ctx.W.esc=[...S];ctx.guardar();ctx.render()})}

// ---------- 5 · Espectáculos
function espectaculos(ctx){
  const L=ctx.W.shows||[];
  return `<section class="hoja"><h2>Espectáculos y eventos</h2><p class="muted">Conciertos, teatro, deportes, festivales. Busca lo que haya en tus fechas y anota lo que compres.</p>
  <div class="fila-btn">${ctx.ids.map(i=>{const n=ctx.M[i].CIUDAD.n;return `<a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/search?q=${q("espectáculos conciertos eventos en "+n+(ctx.fechas()?" "+ctx.pretty(ctx.W.inicio):""))}">Buscar en ${ctx.esc(n.replace(/ y .*/,""))}</a>`}).join("")}</div>
  <form id="fShow" class="form"><label class="fld">Qué<input name="n" required maxlength="80" placeholder="Ej.: Concierto en el Usher Hall"></label><label class="fld">Ciudad<select name="c">${ctx.ids.map(i=>`<option value="${i}">${ctx.esc(ctx.M[i].CIUDAD.n)}</option>`).join("")}</select></label><label class="fld">Fecha<input type="date" name="f"></label><label class="fld">Precio total (€)<input type="number" name="p" min="0" step="1"></label><button class="btn dark" type="submit">Anotar</button></form>
  ${L.length?`<table class="tbl">${L.map((s,i)=>`<tr><td><b>${ctx.esc(s.n)}</b><br><span class="muted">${ctx.esc(ctx.M[s.c]?ctx.M[s.c].CIUDAD.n:"")}${s.f?" · "+ctx.pretty(s.f):""}</span></td><td>${s.p?EUR(s.p):""} <button class="btn sm" data-ds="${i}" type="button" aria-label="Quitar">✕</button></td></tr>`).join("")}</table>`:'<p class="muted">Aún no anotas nada.</p>'}</section>`;
}
function bindEspectaculos(ctx){
  $("#fShow").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);(ctx.W.shows=ctx.W.shows||[]).push({n:f.get("n"),c:f.get("c"),f:f.get("f"),p:+f.get("p")||0});ctx.guardar();ctx.render()};
  document.querySelectorAll("[data-ds]").forEach(b=>b.onclick=()=>{ctx.W.shows.splice(+b.dataset.ds,1);ctx.guardar();ctx.render()});
}

// ---------- 6 · Comidas
const COM={veg:"vegetariano",vegano:"vegano",singluten:"sin gluten",sinmar:"sin mariscos",rapida:"comida rápida",local:"cocina local",barato:"económico",halal:"halal"};
function comidas(ctx){
  const cid=ciudadActual(ctx,"food"),M=ctx.M[cid],C=M.COMIDAS||{},G=M.GUIA_COMIDA||[],W=ctx.W;
  const pref=[...(W.comida||[]).map(k=>COM[k]),W.comidaOtra].filter(Boolean);
  const dia=["d","a","m","c"].reduce((t,k)=>t+((C[k]||[])[0]||[0,0])[1],0);
  const NOM={d:"Desayuno",a:"Almuerzo",m:"Merienda",c:"Cena"};
  return `${sub(ctx,cid)}<section class="hoja"><h2>${ctx.esc(M.CIUDAD.n)} · comidas</h2>
   ${pref.length?`<div class="aviso">Tus preferencias: <b>${ctx.esc(pref.join(", "))}</b>. <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${q((pref[0]||"restaurantes")+" en "+M.CIUDAD.n)}">Buscar en el mapa</a></div>`:""}
   <h3>Presupuesto de un día (por persona)</h3>
   <table class="tbl">${["d","a","m","c"].map(k=>`<tr><td><b>${NOM[k]}</b><br><span class="muted">${(C[k]||[]).map(x=>ctx.esc(x[0])+" ("+EUR(x[1])+")").join(" · ")}</span></td><td>${EUR(((C[k]||[])[0]||[0,0])[1])}</td></tr>`).join("")}<tr><td><b>Total por día</b></td><td><b>${EUR(dia)}</b></td></tr></table>
   <p class="muted">× ${diasDe(ctx,cid)} días = <b>${EUR(dia*diasDe(ctx,cid))}</b> (opción más barata de cada comida; cifras sin verificar).</p>
   ${G.map(g=>`<div class="guia" style="--c:${g.c||"#2a2219"}"><h3>${ctx.esc(g.t)}</h3><table class="tbl">${g.r.map(r=>`<tr><td>${ctx.esc(r[0])}</td><td>${ctx.esc(r[1])}</td></tr>`).join("")}</table>${g.n?`<p class="muted">${ctx.esc(g.n)}</p>`:""}</div>`).join("")}</section>`;
}

// ---------- 9 · Alojamiento
function alojamiento(ctx){
  const W=ctx.W;W.alo=W.alo||{};
  const res=W.hoteles==="reservado";
  return `<section class="hoja"><h2>Alojamiento</h2><p class="muted">${res?"Dijiste que ya tienes reservas: anótalas para que queden con el viaje.":"Elegiste recibir recomendaciones ("+({eco:"económico",medio:"medio",conf:"confort"}[W.estandar]||"medio")+"). Busca por barrio y anota lo que reserves."}</p></section>
  ${ctx.ids.map(cid=>{const M=ctx.M[cid],x=W.ciudades.find(c=>c.id===cid),i0=inicioCiudad(ctx,cid),a=W.alo[cid]||{},ini=ctx.fechas()?ctx.add(W.inicio,i0):"",fin=ctx.fechas()?ctx.add(W.inicio,i0+x.noches):"";
   return `<section class="hoja"><h2>${ctx.esc(M.CIUDAD.n)} · ${x.noches} noche${x.noches>1?"s":""}${ini?" · "+ctx.pretty(ini)+" → "+ctx.pretty(fin):""}</h2>
   ${(M.BARRIOS||[]).length?`<div class="barrios">${M.BARRIOS.map(b=>`<p><b>${ctx.esc(b.n)}:</b> ${ctx.esc(b.d)}</p>`).join("")}</div>`:""}
   <div class="fila-btn"><a class="btn sm" target="_blank" rel="noopener" href="https://www.booking.com/searchresults.html?ss=${q(M.CIUDAD.n)}${ini?"&checkin="+ini+"&checkout="+fin:""}">Booking</a><a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/travel/hotels/${q(M.CIUDAD.n)}${ini?"?q="+q("hoteles en "+M.CIUDAD.n)+"&checkin="+ini+"&checkout="+fin:""}">Google Hoteles</a><a class="btn sm" target="_blank" rel="noopener" href="https://www.airbnb.com/s/${q(M.CIUDAD.n)}/homes${ini?"?checkin="+ini+"&checkout="+fin:""}">Airbnb</a></div>
   <div class="form" data-alo="${cid}"><label class="fld">Dónde me quedo<input data-f="n" value="${ctx.esc(a.n||"")}" maxlength="80" placeholder="Nombre o dirección"></label><label class="fld">Costo total (€)<input data-f="p" type="number" min="0" value="${a.p||""}"></label><label class="fld">N.º de reserva<input data-f="r" value="${ctx.esc(a.r||"")}" maxlength="40"></label><label class="fld chk"><input data-f="ok" type="checkbox" ${a.ok?"checked":""}> Reservado y pagado</label></div></section>`}).join("")}
  <section class="hoja"><p><b>Total alojamiento anotado:</b> ${EUR(ctx.ids.reduce((t,i)=>t+(+(W.alo[i]||{}).p||0),0))}</p></section>`;
}
function bindAlojamiento(ctx){document.querySelectorAll("[data-alo]").forEach(f=>f.querySelectorAll("[data-f]").forEach(i=>i.onchange=()=>{const a=(ctx.W.alo[f.dataset.alo]=ctx.W.alo[f.dataset.alo]||{});a[i.dataset.f]=i.type==="checkbox"?i.checked:i.type==="number"?+i.value||0:i.value;ctx.guardar();if(i.dataset.f==="p"||i.dataset.f==="ok")ctx.render()}))}

// ---------- 8 · Transporte
function transporte(ctx){
  const W=ctx.W;W.tk=W.tk||{};
  const tramos=ctx.ids.slice(1).map((b,i)=>({a:ctx.ids[i],b}));
  return `<section class="hoja"><h2>Entre ciudades</h2>${tramos.length?tramos.map(({a,b})=>{const k=[a,b].sort().join("-"),e=ctx.eleccion(a,b),t=W.tk[k]||{},na=ctx.M[a].CIUDAD.n,nb=ctx.M[b].CIUDAD.n,f=ctx.fechas()?ctx.add(W.inicio,inicioCiudad(ctx,b)):"";
   return `<div class="dia"><h3>${ctx.esc(na)} → ${ctx.esc(nb)}<small>${ctx.MODO[e.m]} · ${ctx.fh(e.min/60)}${e.eur?" · ~"+EUR(e.eur):""}</small></h3>${e.n?`<p class="muted">${ctx.esc(e.n)}</p>`:""}
   <div class="fila-btn"><a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&origin=${q(na)}&destination=${q(nb)}&travelmode=${e.m==="auto"?"driving":"transit"}">Google Maps</a><a class="btn sm" target="_blank" rel="noopener" href="https://www.rome2rio.com/map/${q(na)}/${q(nb)}">Rome2rio</a>${e.m==="avion"?`<a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/travel/flights?q=${q("Flights from "+na+" to "+nb+(f?" on "+f:""))}">Vuelos</a>`:""}</div>
   <div class="form" data-tk="${k}"><label class="fld">Lo que compré<input data-f="n" value="${ctx.esc(t.n||"")}" maxlength="80" placeholder="Ej.: Tren 10:15, asientos 24A-B"></label><label class="fld">Reserva / código<input data-f="r" value="${ctx.esc(t.r||"")}" maxlength="40"></label><label class="fld">Costo total (€)<input data-f="p" type="number" min="0" value="${t.p||""}"></label></div></div>`}).join(""):'<p class="muted">Tu viaje tiene una sola ciudad: no hay traslados entre ciudades.</p>'}
   <p><b>Total traslados anotados:</b> ${EUR(Object.values(W.tk).reduce((t,x)=>t+(+x.p||0),0))}</p></section>
  ${ctx.ids.map(cid=>{const T=ctx.M[cid].TRANSPORTE||{};return `<section class="hoja"><h2>${ctx.esc(ctx.M[cid].CIUDAD.n)} · llegar y moverse</h2>${[["Llegada","llegada"],["En la ciudad","local"],["Pases","pases"],["Trenes","trenes"]].filter(([,k])=>T[k]).map(([t,k])=>`<p><b>${t}:</b> ${ctx.esc(T[k])}</p>`).join("")||'<p class="muted">Sin datos.</p>'}</section>`}).join("")}`;
}
function bindTransporte(ctx){document.querySelectorAll("[data-tk]").forEach(f=>f.querySelectorAll("[data-f]").forEach(i=>i.onchange=()=>{const t=(ctx.W.tk[f.dataset.tk]=ctx.W.tk[f.dataset.tk]||{});t[i.dataset.f]=i.type==="number"?+i.value||0:i.value;ctx.guardar();if(i.dataset.f==="p")ctx.render()}))}

// ---------- 10 · Trámites previos
const BASE=[["pasaporte","Pasaporte con al menos 6 meses de vigencia"],["seguro","Seguro de viaje con cobertura médica contratado"],["vuelos","Vuelos internacionales comprados"],["tarjeta","Tarjeta sin comisión de cambio y aviso al banco"],["efectivo","Algo de efectivo en moneda local"],["sim","SIM/eSIM o plan de datos"],["adapt","Adaptador de enchufe"],["copias","Copias digitales de pasaporte, reservas y seguro"]];
function tramites(ctx){
  const W=ctx.W;W.tram=W.tram||{};
  const T=[...new Map(ctx.ids.map(i=>[ (ctx.M[i].TRAMITES||{}).pais||i, ctx.M[i].TRAMITES||{}])).entries()];
  const C=[...new Set(ctx.ids.flatMap(i=>ctx.M[i].CONSEJOS||[]))];
  return `<section class="hoja"><h2>Trámites por país</h2>${T.map(([p,t])=>`<h3>${ctx.esc(p)}</h3>${[["Autorización / visa","eta"],["Seguro","seguro"],["Moneda y pagos","moneda"]].filter(([,k])=>t[k]).map(([n,k])=>`<p><b>${n}:</b> ${ctx.esc(t[k])}</p>`).join("")}`).join("")}
   <p class="muted">Información general sin verificar: confírmala en el sitio oficial antes de viajar.</p></section>
  <section class="hoja"><h2>Lista de pendientes</h2><div class="lista">${BASE.map(([k,t])=>`<label class="att ${W.tram[k]?"on":""}"><input type="checkbox" data-t="${k}" ${W.tram[k]?"checked":""}><span><b>${ctx.esc(t)}</b></span></label>`).join("")}</div>
   <p class="muted">${Object.values(W.tram).filter(Boolean).length} de ${BASE.length} listos.</p></section>
  ${C.length?`<section class="hoja"><h2>Consejos</h2><ul>${C.map(c=>`<li>${ctx.esc(c)}</li>`).join("")}</ul></section>`:""}`;
}
function bindTramites(ctx){document.querySelectorAll("[data-t]").forEach(c=>c.onchange=()=>{ctx.W.tram[c.dataset.t]=c.checked;ctx.guardar();ctx.render()})}

// ---------- 7 · Gastos (en la cuenta si hay sesión; copia local siempre)
const CATS=["Alojamiento","Transporte","Comida","Entradas","Compras","Otros"];
const GK=id=>"mp_gastos_"+id;
const leerG=id=>{try{return JSON.parse(localStorage.getItem(GK(id))||"[]")}catch(e){return[]}};
const escribirG=(id,l)=>{try{localStorage.setItem(GK(id),JSON.stringify(l))}catch(e){}};
let GAS=null,GASID="";
async function cargarGastos(ctx){
  GASID=ctx.viaje.id;let l=leerG(ctx.viaje.id);
  if(ctx.viaje.owner&&!ctx.DEMO){try{
    const nube=await ctx.nube.gastosListar(ctx.viaje.id),ids=new Set(nube.map(g=>g.id));
    const pend=l.filter(g=>!g.sync&&!ids.has(g.id));
    for(const g of pend){try{await ctx.nube.gastoSet(ctx.viaje.id,{...g,sync:true});g.sync=true}catch(e){}}
    l=[...nube.map(g=>({...g,sync:true})),...pend.filter(g=>g.sync===true||!ids.has(g.id))];
    escribirG(ctx.viaje.id,l);
  }catch(e){console.warn("gastos nube",e)}}
  GAS=l;
}
function gastos(ctx){
  if(!GAS||GASID!==ctx.viaje.id){GAS=null;cargarGastos(ctx).then(()=>{if(ctx.actual()==="gas")ctx.render()});return '<section class="hoja"><p class="muted">Cargando gastos…</p></section>'}
  const W=ctx.W,L=[...GAS].sort((a,b)=>(b.f||"").localeCompare(a.f||"")||b.t-a.t),tot=L.reduce((t,g)=>t+g.eur,0);
  const por=CATS.map(c=>[c,L.filter(g=>g.cat===c).reduce((t,g)=>t+g.eur,0)]);
  const bud=+W.presupuesto||0;
  const hoy=ctx.fechas()?"":"";
  const dias={};L.forEach(g=>{(dias[g.f||"sin fecha"]=dias[g.f||"sin fecha"]||[]).push(g)});
  const mon=ctx.M[ctx.ids[0]].CIUDAD.moneda||{code:"EUR",sym:"€",eur:1};
  return `<section class="hoja"><h2>Gastos del viaje</h2>
   <div class="aviso"><b>Total gastado: ${EUR(tot)}</b>${bud?` · Presupuesto ${EUR(bud)} · ${bud-tot>=0?"te quedan <b>"+EUR(bud-tot)+"</b>":"te pasaste por <b>"+EUR(tot-bud)+"</b>"}`:""}</div>
   <label class="fld">Presupuesto total (€, opcional)<input id="bud" type="number" min="0" value="${bud||""}"></label>
   <table class="tbl">${por.map(([c,v])=>`<tr><td>${c}</td><td>${EUR(v)}</td></tr>`).join("")}</table></section>
  <section class="hoja"><h2>Anotar un gasto</h2><form id="fGas" class="form">
   <label class="fld">Fecha<input type="date" name="f" required value="${new Date().toISOString().slice(0,10)}"></label>
   <label class="fld">Ciudad<select name="c">${ctx.ids.map(i=>`<option value="${i}">${ctx.esc(ctx.M[i].CIUDAD.n)}</option>`).join("")}</select></label>
   <label class="fld">Categoría<select name="cat">${CATS.map(c=>`<option>${c}</option>`).join("")}</select></label>
   <label class="fld">Monto<input type="number" name="m" required min="0" step="any"></label>
   <label class="fld">Moneda<select name="mon"><option value="eur">€ (euros)</option>${mon.code!=="EUR"?`<option value="loc" selected>${mon.code} (${mon.sym})</option>`:""}</select></label>
   <label class="fld">Cómo pagué<select name="pago"><option>Efectivo</option><option>Tarjeta</option><option>Otro</option></select></label>
   <label class="fld" style="grid-column:1/-1">Nota<input name="n" maxlength="80" placeholder="Ej.: entradas del castillo"></label>
   <button class="btn dark" type="submit">Guardar gasto</button></form><p class="muted" id="gMsg" role="status"></p></section>
  <section class="hoja"><h2>Por día</h2>${Object.keys(dias).length?Object.entries(dias).map(([f,l])=>`<div class="dia"><h3>${f==="sin fecha"?f:ctx.pretty(f)}<small>${EUR(l.reduce((t,g)=>t+g.eur,0))}</small></h3>${l.map(g=>`<div class="act"><span>${ctx.esc(g.cat.slice(0,1))}</span><div><b>${EUR(g.eur)}</b> · ${ctx.esc(g.cat)}<small>${ctx.esc(ctx.M[g.c]?ctx.M[g.c].CIUDAD.n:"")} · ${ctx.esc(g.pago||"")}${g.n?" · "+ctx.esc(g.n):""}</small></div><button class="btn sm" data-dg="${g.id}" type="button" aria-label="Eliminar gasto">✕</button></div>`).join("")}</div>`).join(""):'<p class="muted">Aún no hay gastos.</p>'}</section>`;
}
function bindGastos(ctx){
  if(!GAS||!$("#fGas"))return;
  const id=ctx.viaje.id,mon=ctx.M[ctx.ids[0]].CIUDAD.moneda||{eur:1};
  $("#bud").onchange=e=>{ctx.W.presupuesto=+e.target.value||0;ctx.guardar();ctx.render()};
  $("#fGas").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),m=+f.get("m");if(!(m>=0))return;
    const g={id:"g_"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),t:Date.now(),f:f.get("f"),c:f.get("c"),cat:f.get("cat"),pago:f.get("pago"),n:f.get("n"),m,mon:f.get("mon"),eur:Math.round(m*(f.get("mon")==="loc"?mon.eur:1)*100)/100};
    GAS.push(g);escribirG(id,GAS);
    if(ctx.viaje.owner&&!ctx.DEMO){try{await ctx.nube.gastoSet(id,{...g,sync:true});g.sync=true;escribirG(id,GAS)}catch(x){console.warn("gasto nube",x)}}
    ctx.render()};
  document.querySelectorAll("[data-dg]").forEach(b=>b.onclick=async()=>{const gid=b.dataset.dg,g=GAS.find(x=>x.id===gid);GAS=GAS.filter(x=>x.id!==gid);escribirG(id,GAS);
    if(g&&g.sync&&ctx.viaje.owner&&!ctx.DEMO){try{await ctx.nube.gastoDel(id,gid)}catch(x){console.warn(x)}}ctx.render()});
}

const $=s=>document.querySelector(s);
export const VISTAS={
  prog:[programa,bindPrograma,"prog"],att:[atracciones,bindAtracciones,"att"],esc:[escapadas,bindEscapadas],show:[espectaculos,bindEspectaculos],
  food:[comidas,null,"food"],gas:[gastos,bindGastos],tra:[transporte,bindTransporte],hot:[alojamiento,bindAlojamiento],buy:[tramites,bindTramites]};
export function dibujar(k,ctx,el){
  const [v,b,s]=VISTAS[k];
  el.innerHTML=(s?"":"")+v(ctx);
  if(s)enlazarSub(ctx,s);
  if(b)b(ctx);
}
