// Pestañas Atracciones, Escapadas, Espectáculos y Comidas del motor, con el diseño de /paris
// (fichas tipo expediente con clip y polaroid, filtros, lista, carrusel en celular, mapa/ideas, tarjetas).
import {SUB,selDe,diasDe,CAP,GRUPOS,grupoDe,agrupar} from "./motor.js";
import {alternarAtr,formNueva,quitarCustom,bindNueva,diasCiudad} from "./programa.js";
import {arqHTML} from "./estilos.js";
import {mapaZonas} from "./mapa.js";
import {mlStyle} from "./mlstyle.js";

const COL=["#2e4f8f","#1d6f7a","#a8352b","#2e6b4f","#b8860b","#7b4ba0","#c2477f"];
const FM=v=>(+v).toLocaleString("es-CL",{maximumFractionDigits:2})+" €";
const num1=h=>String(h).replace(".",",");
const q=s=>encodeURIComponent(s);
const short=n=>String(n).split(/ y |:/)[0];
const GIq=s=>"https://www.google.com/search?tbm=isch&q="+q(s);
const colDe=(ctx,cid)=>COL[Math.max(0,ctx.ids.indexOf(cid))%COL.length];
const DOW=["dom","lun","mar","mié","jue","vie","sáb"];
const hm=x=>{const t=Math.round(x*60);return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")};
const ciudadActual=ctx=>ctx.ids.includes(SUB.c)?SUB.c:ctx.ids[0];
const zn=(ctx,cid,a)=>{const Z=ctx.M[cid].ZONAS||{},z=Z[a.z];return String((z&&z.n)||z||a.z||"").trim()};

// estado de la pantalla (no se guarda)
const E={fil:"todas",zon:"todas",tip:"todos",open:new Set(),lst:false,food:"",ctx:true,rv:{},cx:new Set()};

// ---------- piezas comunes
export function ctabs(ctx,cid,nota){
  return `<div class="daytabs ctabs" role="tablist" aria-label="Ciudad">${ctx.ids.map(c=>`<button type="button" role="tab" class="dtab" style="--c:${colDe(ctx,c)}" data-sub="${c}" aria-selected="${c===cid}"><b>${ctx.esc(short(ctx.M[c].CIUDAD.n))}</b><small>${nota?nota(c):""}</small></button>`).join("")}</div>`}
const GUIA={
 att:["Atracciones: conocer cada lugar","Fichas de cada atracción para llegar sabiendo qué van a ver.",["Elegir ciudad|Pestañas de arriba.","Filtrar|«En el programa», «★ Imperdibles», «Techadas» (útil si llueve) o por zona.","Agregar al programa|El botón de cada ficha, o las casillas de la lista, la agrega o la quita del programa del día que corresponda.","Ver la ficha|En el celular, toquen la ficha para abrirla y deslicen para ver las demás."]],
 esc:["Escapadas: salir de la ciudad base","Paseos de un día o con noches desde su ciudad base.",["Elegir|Toquen «+ Agregar» en la idea que les guste.","Orden de visita|Arriba queda la lista de lo elegido, con ✕ para quitar.","Disponible|Solo con una ciudad base; con varias ciudades esta sección queda en blanco."]],
 show:["Espectáculos: eventos y noches especiales","Busquen lo que haya en sus fechas y anoten lo que compren.",["Buscar|Los botones abren una búsqueda en Google para esa ciudad y fechas.","Anotar|Nombre, ciudad, fecha y precio. El sello «EN SUS FECHAS» avisa si coincide con el viaje."]],
 food:["Comidas: dónde y cuánto","Precios aproximados por persona y lugares para buscar en el mapa.",["Elegir ciudad|Pestañas de arriba.","Presupuesto|Cada comida de cada día se ajusta en 2 · Programa → Comidas.","Sus lugares|En «Lugares agregados por ustedes» anoten los que les recomienden."]]};
export function guia(k){const g=GUIA[k];if(!g)return "";let seen=true;try{seen=!!localStorage.getItem("mp_guide_"+k);localStorage.setItem("mp_guide_"+k,"1")}catch(e){}
  return `<details class="guide" ${seen?"":"open"}><summary><span class="gq">?</span> Cómo usar esta sección <span class="muted">· ${g[0]}</span></summary><p class="gi">${g[1]}</p><ol class="gsteps">${g[2].map(s=>{const [h,t]=s.split("|");return `<li><b>${h}.</b> ${t}</li>`}).join("")}</ol></details>`}

// ---------- fotos (Wikipedia por nombre; si no hay, no se muestra nada)
const WK={};
async function wk(t,lang){const k=lang+":"+t;if(k in WK)return WK[k];WK[k]=null;
  try{const r=await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/`+q(t.replace(/ /g,"_"))+"?redirect=true");if(r.ok){const j=await r.json();if(j.type!=="disambiguation"&&j.thumbnail)WK[k]={u:j.thumbnail.source,p:j.content_urls&&j.content_urls.desktop.page}}}catch(e){}
  return WK[k]}
export function hidratar(){document.querySelectorAll("img[data-wk]:not([src])").forEach(async im=>{const t=im.dataset.wk,c=im.dataset.wc||"";
  const t2=im.dataset.wk2||"";
  const r=(await wk(t,"es"))||(await wk(t2||t,"en"))||(c&&((await wk(t+" ("+c+")","es"))||(await wk(t+" "+c,"en"))));
  const f=im.closest(".fphotos"),g=im.closest(".glfig");
  if(r){im.src=r.u;const cr=g?im.nextElementSibling:(f&&f.nextElementSibling);if(cr&&cr.classList.contains("credit")&&r.p)cr.innerHTML=`Foto: Wikipedia / Wikimedia Commons · <a href="${r.p}" target="_blank" rel="noopener">${t}</a>`}
  else if(g)g.remove();
  else if(f){const cr=f.nextElementSibling;if(cr&&cr.classList.contains("credit"))cr.remove();f.remove()}})}

// Ilustración de la ciudad (img/<ciudad>/…): si el archivo no existe, no se muestra nada.
const ilu=(ctx,f)=>f&&f[0]?`<figure class="ilu"><img src="${ctx.esc(f[0])}" alt="${ctx.esc(f[1]||"")}" loading="lazy" onerror="this.closest('figure').remove()">${f[1]?`<figcaption>${ctx.esc(f[1])}</figcaption>`:""}</figure>`:"";
// ---------- contexto de la ciudad: historia, un día en la ciudad y cultura
const cxOpen=k=>E.cx.has(k)?" open":"";
function contextoHTML(ctx,cid){const M=ctx.M[cid],C=M.CONTEXTO,U=M.UNDIA||[],ME=M.MEDIA||[];let h="";
  if(C)h+=`<details class="cxs" data-cx="${cid}:his"${cxOpen(cid+":his")}><summary>📜 ${ctx.esc(C.t||"Historia")}</summary>
   ${C.tl&&C.tl.length?`<ol class="cxtl">${C.tl.map(([y,t])=>`<li><b>${ctx.esc(y)}</b><span>${ctx.esc(t)}</span></li>`).join("")}</ol>`:""}
   ${(C.p||[]).map((x,i)=>`<p>${ctx.esc(x)}</p>`+(C.fig||[]).filter(f=>f[0]===i).map(f=>ilu(ctx,f.slice(1))).join("")).join("")}</details>`;
  if(U.length)h+=`<details class="cxs" data-cx="${cid}:dia"${cxOpen(cid+":dia")}><summary>🧭 Si vienes por un día: lo que conviene saber</summary>
   ${U.map(u=>`<div class="undia"><h4>${ctx.esc(u.t)}</h4>${(u.p||[]).map(x=>`<p>${ctx.esc(x)}</p>`).join("")}${(u.fig||[]).map(f=>ilu(ctx,f)).join("")}${u.l&&u.l.length?`<ul>${u.l.map(([k,v])=>`<li><b>${ctx.esc(k)}</b>${v?" — "+ctx.esc(v):""}</li>`).join("")}</ul>`:""}</div>`).join("")}</details>`;
  if(ME.length)h+=`<details class="cxs" data-cx="${cid}:med"${cxOpen(cid+":med")}><summary>🎬 Cine, música y libros para conocerla</summary>
   <div class="media">${ME.map(([t,tipo,d,ed])=>`<div class="mi"><b>${ctx.esc(t)}</b><small>${ctx.esc(tipo)}${ed?" · "+ctx.esc(ed):""}</small><p>${ctx.esc(d)}</p></div>`).join("")}</div></details>`;
  return h}
// ---------- plano de cada caminata (mismo estilo que el plano del día del Programa)
let RM=[];
function mapaRuta(ctx,el,P){const m=new maplibregl.Map({container:el,style:mlStyle(),interactive:true,attributionControl:false,
    bounds:[[Math.min(...P.map(a=>a.ll[1])),Math.min(...P.map(a=>a.ll[0]))],[Math.max(...P.map(a=>a.ll[1])),Math.max(...P.map(a=>a.ll[0]))]],fitBoundsOptions:{padding:30,maxZoom:16}});
  m.scrollZoom.disable();m.dragPan.disable();m.touchZoomRotate.disable();m.doubleClickZoom.disable();el._m=m;RM.push(m);
  P.forEach((a,k)=>{const w=document.createElement("div");w.className="mlmk";w.innerHTML=`<div class="lm-a${a.top?" top":""}">${k+1}</div>`;new maplibregl.Marker({element:w,anchor:"left",offset:[-11,0]}).setLngLat([a.ll[1],a.ll[0]]).addTo(m)});
  m.on("load",()=>{const f=P.slice(1).map((a,i)=>({type:"Feature",properties:{},geometry:{type:"LineString",coordinates:[[P[i].ll[1],P[i].ll[0]],[a.ll[1],a.ll[0]]]}}));
    m.addSource("walk",{type:"geojson",data:{type:"FeatureCollection",features:f}});
    m.addLayer({id:"walk-h",type:"line",source:"walk",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#fffdf5","line-width":5,"line-opacity":.85}});
    m.addLayer({id:"walk",type:"line",source:"walk",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#2a2620","line-width":2.6,"line-dasharray":[0.2,2]}})});
  return m}
function initMapasRuta(ctx){if(!window.maplibregl)return;
  document.querySelectorAll(".lmap[data-rmap]").forEach(el=>{if(el._m||!el.offsetParent)return;const [cid,rid,k]=el.dataset.rmap.split(":"),ru=(ctx.M[cid].RUTAS||[]).find(x=>x.id===rid),v=ru&&(ru.v||[]).find(x=>x.k===k);if(!v)return;
    const A=Object.fromEntries((ctx.M[cid].ATRACCIONES||[]).map(a=>[a.id,a])),P=v.ids.map(i=>A[i]).filter(a=>a&&a.ll);if(P.length<1)return;
    try{el.classList.add("ml");mapaRuta(ctx,el,P)}catch(e){console.warn("mapa ruta",e);el.classList.remove("ml")}})}
// ---------- mapas históricos de la ciudad (zonas rayadas), p. ej. el Blitz
function mapasHistHTML(ctx,cid){const MH=ctx.M[cid].MAPAS||[];if(!MH.length)return "";
  return MH.map(mp=>`<details class="card rutas hmapc" data-cx="${cid}:mh${mp.id}"${E.cx.has(cid+":mh"+mp.id)?" open":""}><summary><span class="eyebrow">Mapa histórico</span><h2>${ctx.esc(mp.n)}</h2></summary><div class="ctxb">
   ${mp.d?`<p>${ctx.esc(mp.d)}</p>`:""}
   ${window.maplibregl?`<div class="mapclip lclip hmap"><span class="clip" aria-hidden="true"></span><div class="lmap" data-hmap="${cid}:${mp.id}"></div><span class="mc-cap">Zonas rayadas = áreas muy dañadas o arrasadas (aproximadas)</span></div>`:""}
   <ol class="hzl">${(mp.zonas||[]).map((z,i)=>`<li><span class="anum num">${i+1}</span><div><b>${ctx.esc(z.n)}</b>${z.nota?`<small>${ctx.esc(z.nota)}</small>`:""}</div></li>`).join("")}</ol>
   ${mp.nota?`<p class="note">${ctx.esc(mp.nota)}</p>`:""}</div></details>`).join("")}
function initMapasHist(ctx){if(!window.maplibregl)return;
  document.querySelectorAll(".lmap[data-hmap]").forEach(el=>{if(el._m||!el.offsetParent)return;const [cid,id]=el.dataset.hmap.split(":"),mp=(ctx.M[cid].MAPAS||[]).find(x=>x.id===id);if(!mp)return;
    const A=Object.fromEntries((ctx.M[cid].ATRACCIONES||[]).map(a=>[a.id,a])),pts=(mp.pts||[]).map(i=>A[i]).filter(a=>a&&a.ll);
    try{mapaZonas(el,{zonas:mp.zonas,pts})}catch(e){console.warn("mapa hist",e);el.classList.remove("ml")}})}
// ---------- recorridos a pie temáticos, según el tiempo disponible
const hmin=m=>{m=Math.round(m);const h=Math.floor(m/60),x=m%60;return h?`${h} h${x?" "+x+" min":""}`:`${x} min`};
function datosRuta(ctx,cid,v){const A=Object.fromEntries((ctx.M[cid].ATRACCIONES||[]).map(a=>[a.id,a])),P=(v.ids||[]).map(i=>A[i]).filter(Boolean);
  let vis=0,cam=0,km=0;const T=P.map((a,i)=>{vis+=a.h;let w=0;if(i&&a.ll&&P[i-1].ll){const d=ctx.km(P[i-1].ll,a.ll)*1.3;km+=d;w=Math.max(1,Math.round(d/4.8*60));cam+=w}return {a,w}});
  return {T,vis,cam,km,tot:vis*60+cam}}
function rutasHTML(ctx,cid){const M=ctx.M[cid],R=M.RUTAS||[];if(!R.length)return "";const S=selDe(ctx,cid);
  return `<details class="card rutas" data-cx="${cid}:rutas"${E.cx.has(cid+":rutas")||!E.cx.has(cid+":rutasx")?" open":""}><summary><span class="eyebrow">Recorridos a pie</span><h2>Elige tu caminata</h2></summary><div class="ctxb">
   <p class="muted" style="margin-top:0">Cada recorrido viene en versiones según el tiempo que tengas. Al agregarlo, sus paradas pasan al programa y se reparten en tus días.</p>
   ${R.length>1?`<div class="railnav rrnav"><button type="button" data-rr="-1" aria-label="Caminata anterior">‹</button><span class="rp">Caminata 1 de ${R.length} · desliza ⇆</span><span class="railbar"><i style="width:${100/R.length}%"></i></span><button type="button" data-rr="1" aria-label="Caminata siguiente">›</button></div>`:""}
   <div class="rutarail">${R.map(ru=>{const vs=ru.v||[],cur=vs.find(x=>x.k===E.rv[cid+":"+ru.id])||vs[0];if(!cur)return "";const d=datosRuta(ctx,cid,cur),todo=cur.ids.every(i=>S.has(i));
    return `<div class="ruta"><h3>${ru.e||"🚶"} ${ctx.esc(ru.n)}</h3>${ru.d?`<p>${ctx.esc(ru.d)}</p>`:""}${ilu(ctx,ru.img)}
     ${window.maplibregl?`<div class="mapclip lclip rmapclip" data-rclip="${cid}:${ru.id}:${cur.k}" role="button" tabindex="0" aria-label="Ampliar el plano de la caminata"><span class="clip" aria-hidden="true"></span><div class="lmap" data-rmap="${cid}:${ru.id}:${cur.k}"></div><span class="mc-cap">Plano de la caminata · ampliar</span><span class="mc-cr">© OpenFreeMap · OSM</span></div>`:""}
     <div class="seg" role="group" aria-label="Tiempo disponible">${vs.map(x=>{const t2=datosRuta(ctx,cid,x).tot,hh=Math.round(t2/30)/2;return `<button type="button" data-rv="${cid}:${ru.id}:${x.k}" aria-pressed="${x.k===cur.k}">${ctx.esc(x.n)} · ~${String(hh).replace(".",",")} h</button>`}).join("")}</div>
     <p class="rtot">⏱ <b>~${hmin(d.tot)}</b> en total · ${hmin(d.vis*60)} de visitas + ${hmin(d.cam)} caminando · ${d.km.toFixed(1).replace(".",",")} km · ${d.T.length} paradas</p>
     <ol class="rstops">${d.T.map(({a,w},i)=>`<li>${i?`<span class="rwalk">🚶 ${w} min a pie</span>`:""}<button type="button" class="aln" data-fjump="fa-${cid}-${a.id}">${ctx.esc(limpiaN(a.n))}</button><small>visita ~${num1(a.h)} h · ${a.p?FM(a.p):"gratis"}</small>${a.arq?arqHTML(a.arq):""}${cur.n2&&cur.n2[a.id]?`<em>${ctx.esc(cur.n2[a.id])}</em>`:""}</li>`).join("")}</ol>
     ${(ru.comb&&ru.comb.length)?`<p class="muted rcomb">Para completar el día: ${ru.comb.map(i=>{const a=(M.ATRACCIONES||[]).find(z=>z.id===i);return a?`<button type="button" class="aln" data-fjump="fa-${cid}-${a.id}">${ctx.esc(limpiaN(a.n))}</button>`:""}).join(" · ")}</p>`:""}
     ${ru.aviso?`<p class="note">${ctx.esc(ru.aviso)}</p>`:""}
     <button type="button" class="btn sm${todo?" alt":""}" data-rtadd="${cid}:${ru.id}:${cur.k}:${todo?0:1}">${todo?"✕ Quitar este recorrido del programa":"＋ Agregar este recorrido al programa"}</button></div>`}).join("")}</div>
   </div></details>`}

// ---------- 3 · Atracciones
const limpiaN=n=>String(n).replace(/\s*\(.*?\)\s*$/,"");
function ficha(ctx,cid,a,i,on){const CI=ctx.M[cid].CIUDAD,cod=cid.slice(0,3).toUpperCase(),z=zn(ctx,cid,a);
  const dias=a.cl&&a.cl.length?a.cl.map(x=>DOW[x]).join(", "):"";
  const mapa=`https://www.google.com/maps/search/?api=1&query=${a.ll?a.ll.join(","):q(a.n+" "+CI.n)}`;
  return `<article class="ficha" id="fa-${cid}-${a.id}"><div class="ftab">EXP. ${cod}-${String(i+1).padStart(2,"0")}${z?" · "+ctx.esc(z.toUpperCase()):""}</div>
   <header><h3>${ctx.esc(a.n)}</h3>${a.top?'<span class="fstamp">★ IMPERDIBLE</span>':""}${on?'<span class="fstamp ok">EN EL PROGRAMA</span>':""}</header>
   ${a.s?`<p class="flead">${ctx.esc(a.s)}</p>`:""}
   ${a.y?`<p class="fyear">${ctx.esc(a.y)}</p>`:""}
   ${ilu(ctx,a.ilu)}
   ${a.arq?arqHTML(a.arq):""}
   ${a.v?`<div class="fwhy"><span class="flab">Qué van a ver</span><p>${ctx.esc(a.v)}</p></div>`:""}
   ${a.mir&&a.mir.length?`<div class="fmir"><span class="flab">Qué mirar desde la calle</span><ul>${a.mir.map(x=>`<li>${ctx.esc(x)}</li>`).join("")}</ul></div>`:""}
   ${a.his&&a.his.length?`<div class="fhist"><span class="flab">Historia</span>${a.his.map(x=>`<p>${ctx.esc(x)}</p>`).join("")}</div>`:""}
   ${a.d?`<div class="fnote"><span class="flab">Dato / consejo</span><p>${ctx.esc(a.d)}</p></div>`:""}
   <p class="fmeta">🕐 visita ~${num1(a.h)} h · ${a.p?FM(a.p):"gratis"}${a.close&&!a.eve?` · cierra ${hm(a.close)}`:""}${dias?` · cerrado ${dias}`:""}${a.in?" · 🏛 techado":""}</p>
   <div class="fphotos"><a class="polaroid" href="${GIq(a.n+" "+CI.n)}" target="_blank" rel="noopener"><span class="clip" aria-hidden="true"></span><img class="ph" data-wk="${ctx.esc(limpiaN(a.n))}" data-wc="${ctx.esc(CI.n)}" alt="${ctx.esc(a.n)}" loading="lazy"><span class="cap">${ctx.esc(limpiaN(a.n).split(/:/)[0])}</span><span class="go">más fotos →</span></a></div><p class="credit">Foto: Wikipedia / Wikimedia Commons</p>
   <div class="flinks">${a.u?`<a href="${ctx.esc(a.u)}" target="_blank" rel="noopener">Sitio oficial ↗</a>`:""}<a href="${mapa}" target="_blank" rel="noopener">Mapa ↗</a><button type="button" class="btn ${on?"alt ":""}sm" data-abtn="${cid}|${a.id}">${on?"✕ Quitar del programa":"+ Agregar al programa"}</button>${a.custom?`<button type="button" class="lnkb" data-acdel="${cid}|${a.id}">quitar de la lista</button>`:""}</div>
   <span class="fcue"><i class="c1">Ver ficha completa ▾</i><i class="c2">Tocar para cerrar ▴</i></span></article>`}
export function atracciones(ctx){
  const cid=ciudadActual(ctx),M=ctx.M[cid],A=M.ATRACCIONES||[],S=selDe(ctx,cid),W=ctx.W,CI=M.CIUDAD;
  const cap=CAP[(W.ritmo||{})[cid]||"int"]*diasDe(ctx,cid),hs=A.filter(a=>S.has(a.id)).reduce((t,a)=>t+a.h+0.3,0);
  const zonas=[...new Set(A.map(a=>zn(ctx,cid,a)).filter(Boolean))];
  if(E.zon!=="todas"&&!zonas.includes(E.zon))E.zon="todas";
  const grps=agrupar(A);if(E.tip!=="todos"&&!grps.some(g=>g.k===E.tip))E.tip="todos";
  const pass=a=>(E.tip==="todos"||grupoDe(a)===E.tip)&&(E.zon==="todas"||zn(ctx,cid,a)===E.zon)&&(E.fil==="todas"||(E.fil==="prog"&&S.has(a.id))||(E.fil==="top"&&a.top)||(E.fil==="in"&&a.in));
  const L=A.filter(pass).sort((x,y)=>(S.has(y.id)-S.has(x.id))||((y.top?1:0)-(x.top?1:0)));
  const fl=[["todas","Todas"],["prog","En el programa"],["top","★ Imperdibles"],["in","Techadas"]];
  const sin=hs>cap*1.05;
  return `${guia("att")}${ctabs(ctx,cid,c=>`${(ctx.M[c].ATRACCIONES||[]).length} atracciones`)}
   <details class="ctx card ctxd"${E.ctx?" open":""}><summary><span class="eyebrow">Sobre ${ctx.esc(CI.n)}</span><h2>${ctx.esc(CI.n)}</h2></summary><div class="ctxb">${ilu(ctx,CI.portada)}${CI.resumen?`<p>${ctx.esc(CI.resumen)}</p>`:""}${CI.mejorEpoca?`<p><b>Mejor época:</b> ${ctx.esc(CI.mejorEpoca)}</p>`:""}${CI.dias?`<p><b>Días recomendados:</b> ${CI.dias.ideal} (mínimo ${CI.dias.minimo}). Ustedes tienen ${diasDe(ctx,cid)}.</p>`:""}${contextoHTML(ctx,cid)}</div></details>
   ${rutasHTML(ctx,cid)}
   ${mapasHistHTML(ctx,cid)}
   ${sin?`<a href="#" class="feasstat bad" data-gotab="prog">✕ ${ctx.esc(short(CI.n))}: lo elegido (${ctx.fh(hs)}) pasa de lo que cabe (${ctx.fh(cap)}) · ver en Programa →</a>`:`<span class="feasstat ok">✓ ${ctx.esc(short(CI.n))}: todo lo elegido cabe (${ctx.fh(hs)} de ${ctx.fh(cap)})</span>`}
   <div class="attfil"><div class="afrow"><span class="eyebrow">Mostrar</span><div class="filters">${fl.map(([k,t])=>`<button type="button" class="chip" data-afil="${k}" aria-pressed="${E.fil===k}">${t}</button>`).join("")}</div></div>
   ${grps.length>1?`<div class="afrow"><span class="eyebrow">Tipo</span><div class="filters"><button type="button" class="chip" data-atip="todos" aria-pressed="${E.tip==="todos"}">Todos</button>${grps.map(g=>`<button type="button" class="chip" data-atip="${g.k}" aria-pressed="${E.tip===g.k}">${ctx.esc(g.n)} <small>${g.L.length}</small></button>`).join("")}</div></div>`:""}
   ${zonas.length>1?`<div class="afrow"><span class="eyebrow">Zona</span><div class="filters"><button type="button" class="chip" data-azon="todas" aria-pressed="${E.zon==="todas"}">Todas</button>${zonas.map(z=>`<button type="button" class="chip" data-azon="${ctx.esc(z)}" aria-pressed="${E.zon===z}">${ctx.esc(z)}</button>`).join("")}</div></div>`:""}</div>
   <p class="muted attn">${L.length} de ${A.length} atracciones · ${S.size} en el programa</p>
   ${L.length?`<details class="attlist" data-attlist${E.lst?" open":""}><summary>☰ Lista de ${L.length} (tocar para ir)</summary><ol>${agrupar(L).map(g=>`<li class="lgh">${ctx.esc(g.n)} <small>${g.L.length}</small></li>`+g.L.map(a=>`<li><label class="alchk" title="Agregar al programa"><input type="checkbox" data-asel="${cid}|${a.id}" ${S.has(a.id)?"checked":""}></label><button type="button" class="aln" data-fjump="fa-${cid}-${a.id}">${ctx.esc(limpiaN(a.n))}</button><small>${a.p?FM(a.p):"gratis"}</small></li>`).join("")).join("")}</ol></details>
   <div class="railnav"><button type="button" data-rail="-1" aria-label="Ficha anterior">‹</button><span class="rp">1 de ${L.length}</span><span class="railbar"><i style="width:${100/L.length}%"></i></span><button type="button" data-rail="1" aria-label="Ficha siguiente">›</button></div>
   <div class="fichas att">${L.map(a=>ficha(ctx,cid,a,A.indexOf(a),S.has(a.id))).join("")}</div>`:`<div class="card"><p class="muted">${A.length?"Ninguna atracción coincide con el filtro.":"Esta ciudad aún no tiene atracciones precargadas."}</p></div>`}
   <div class="card"><span class="eyebrow">Agregar a mano</span>${formNueva(ctx,cid,"")}</div>
   <p class="note">Atracciones de ${ctx.esc(CI.n)}. Precios y horarios aproximados: confirmar en el sitio oficial antes de ir. Fotos de Wikipedia, cuando hay.</p>`;
}
export function bindAtracciones(ctx){const Q=(s,f)=>document.querySelectorAll(s).forEach(f),R=()=>{ctx.guardar();ctx.render()};
  bindNueva(ctx);
  RM.forEach(m=>{try{m.remove()}catch(e){}});RM=[];
  Q(".rmapclip",c=>{const tog=()=>{const big=c.classList.toggle("rbig"),m=c.querySelector(".lmap")._m;c.querySelector(".mc-cap").textContent=big?"Plano de la caminata · reducir":"Plano de la caminata · ampliar";
      if(m){setTimeout(()=>{m.resize();const b=m.getBounds();m.fitBounds(b,{padding:30,duration:0});if(big){m.dragPan.enable();m.touchZoomRotate.enable();m.scrollZoom.disable()}else{m.dragPan.disable();m.touchZoomRotate.disable()}},60)}};
    c.onclick=tog;c.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();tog()}}});
  setTimeout(()=>{initMapasRuta(ctx);initMapasHist(ctx)},0);
  Q("details.rutas",d=>d.addEventListener("toggle",()=>{if(d.open)setTimeout(()=>{initMapasRuta(ctx);initMapasHist(ctx)},0)}));
  Q("[data-afil]",b=>b.onclick=()=>{E.fil=b.dataset.afil;ctx.render()});
  Q("[data-azon]",b=>b.onclick=()=>{E.zon=b.dataset.azon;ctx.render()});
  Q("[data-atip]",b=>b.onclick=()=>{E.tip=b.dataset.atip;ctx.render()});
  Q("details.ctxd",d=>d.ontoggle=()=>{E.ctx=d.open});
  Q("details[data-cx]",d=>d.ontoggle=e=>{if(e.target!==d)return;const k=d.dataset.cx;d.open?E.cx.add(k):E.cx.delete(k);if(k.endsWith(":rutas")){d.open?E.cx.delete(k+"x"):E.cx.add(k+"x")}});
  Q("[data-rv]",b=>b.onclick=()=>{const [c,r2,k]=b.dataset.rv.split(":");E.rv[c+":"+r2]=k;ctx.render()});
  Q("[data-rtadd]",b=>b.onclick=()=>{const [c,r2,k,on]=b.dataset.rtadd.split(":"),ru=(ctx.M[c].RUTAS||[]).find(x=>x.id===r2),v=ru&&(ru.v||[]).find(x=>x.k===k);if(!v)return;v.ids.forEach(i=>alternarAtr(ctx,c,i,on==="1"));R()});
  Q("details[data-attlist]",d=>d.ontoggle=()=>{E.lst=d.open});
  Q("[data-asel]",c=>c.onchange=()=>{const [cid,aid]=c.dataset.asel.split("|");alternarAtr(ctx,cid,aid,c.checked);R()});
  Q("[data-acdel]",b=>b.onclick=()=>{const [cid,aid]=b.dataset.acdel.split("|");quitarCustom(ctx,cid,aid)});
  Q("[data-abtn]",b=>b.onclick=()=>{const [cid,aid]=b.dataset.abtn.split("|");alternarAtr(ctx,cid,aid,!selDe(ctx,cid).has(aid));R()});
  Q("[data-fjump]",b=>b.onclick=()=>{const f=document.getElementById(b.dataset.fjump);if(!f)return;const rail=f.closest(".fichas.att");f.classList.add("open");E.open.add(f.id);const lst=b.closest("details");if(lst){lst.open=false;E.lst=false}
    if(rail&&getComputedStyle(rail).display==="flex"){rail.scrollBy({left:f.getBoundingClientRect().left-rail.getBoundingClientRect().left-2,behavior:"smooth"});scrollTo({top:rail.getBoundingClientRect().top+scrollY-80,behavior:"smooth"})}else f.scrollIntoView({behavior:"smooth",block:"start"});
    f.classList.add("flash");setTimeout(()=>f.classList.remove("flash"),1600)});
  Q(".rutarail",rail=>{const nav=rail.previousElementSibling;if(!nav||!nav.classList.contains("rrnav"))return;const cs=[...rail.children],rp=nav.querySelector(".rp"),bar=nav.querySelector("i");
    const cur=()=>{if(rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4)return cs.length-1;const l=rail.getBoundingClientRect().left;const i=cs.findIndex(c=>c.getBoundingClientRect().right-l>40);return i<0?0:i};
    const fit=()=>{const f=cs[cur()];rail.style.height=(f.offsetHeight+14)+"px"};
    const upd=()=>{const i=cur();fit();rp.textContent=`Caminata ${i+1} de ${cs.length} · desliza ⇆`;bar.style.width=(100*(i+1)/cs.length)+"%";nav.querySelector('[data-rr="-1"]').disabled=i===0;nav.querySelector('[data-rr="1"]').disabled=i===cs.length-1};
    rail.addEventListener("scroll",()=>requestAnimationFrame(upd),{passive:true});
    nav.querySelectorAll("[data-rr]").forEach(b=>b.onclick=()=>{const j=Math.max(0,Math.min(cs.length-1,cur()+ +b.dataset.rr));rail.scrollTo({left:cs[j].offsetLeft-rail.offsetLeft,behavior:"smooth"})});upd();setTimeout(upd,600);addEventListener("resize",upd)});
  Q(".fichas.att",rail=>{const nav=rail.previousElementSibling;if(!nav||!nav.classList.contains("railnav"))return;const cs=[...rail.children];if(!cs.length)return;
    const rp=nav.querySelector(".rp"),bar=nav.querySelector("i"),bs=nav.querySelectorAll("[data-rail]");
    const cur=()=>{if(rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4)return cs.length-1;const l=rail.getBoundingClientRect().left;const i=cs.findIndex(c=>c.getBoundingClientRect().right-l>40);return i<0?0:i};
    // En el celular el carrusel toma la altura de la ficha que se está viendo (no la de la más larga), para que lo que sigue quede pegado a ella.
    const fit=()=>{if(getComputedStyle(rail).display!=="flex"){rail.style.height="";rail.style.alignItems="";rail.style.overflowY="";return}const f=cs[cur()];rail.style.alignItems="flex-start";rail.style.overflowY="hidden";rail.style.height=(f.offsetHeight+10)+"px"};
    const upd=()=>{const i=cur();rp.textContent=`${i+1} de ${cs.length}`;bar.style.width=(i+1)/cs.length*100+"%";bs[0].disabled=i<=0;bs[1].disabled=i>=cs.length-1;fit()};
    if(window.ResizeObserver){const ro=new ResizeObserver(()=>fit());cs.forEach(c=>ro.observe(c))}
    addEventListener("resize",fit);
    rail.addEventListener("scroll",()=>requestAnimationFrame(upd),{passive:true});
    bs.forEach(b=>b.onclick=()=>{const j=Math.max(0,Math.min(cs.length-1,cur()+ +b.dataset.rail));rail.scrollBy({left:cs[j].getBoundingClientRect().left-rail.getBoundingClientRect().left-2,behavior:"smooth"})});upd()});
  Q(".fichas.att .ficha",f=>{if(E.open.has(f.id))f.classList.add("open");f.onclick=e=>{if(innerWidth>700||e.target.closest("a,button,select,input,label"))return;f.classList.toggle("open");f.classList.contains("open")?(E.open.add(f.id),f.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"})):E.open.delete(f.id)}});
  hidratar()}

// ---------- 4 · Escapadas (solo viajes con una ciudad base)
const EF={fil:"todas",ord:false};
export function escapadas(ctx){
  if(ctx.ids.length>1)return `${guia("esc")}<div class="card"><span class="eyebrow">Escapadas</span><p>Las escapadas sirven cuando te quedas en <b>una ciudad base</b> y sales a pasear a otros lugares (en el día o en dos días). Tu viaje recorre <b>${ctx.ids.length} ciudades</b>, así que esta sección queda en blanco. Si dejas una sola ciudad en <a href="#" data-gotab="cfg">Configurar</a>, se activa.</p></div>`;
  const cid=ctx.ids[0],M=ctx.M[cid],ESC=M.ESCAPADAS||[],sel=new Set(ctx.W.esc||[]),ci=colDe(ctx,cid);
  const lista=ESC.filter(x=>EF.fil==="todas"||(EF.fil==="noche"&&x.k!=="dia")||(EF.fil==="dia"&&x.k!=="noche"));
  const mias=ESC.filter(x=>sel.has(x.id)),nn=M.CIUDAD.n;
  const noches=x=>x.k==="dia"?"de un día":x.nt==="0–1"?"día o 1 noche":x.nt+" noche"+(x.nt==="1"?"":"s");
  return `${guia("esc")}<details class="card escord" data-escord${EF.ord?" open":""}><summary><span class="eyebrow">Orden de visita</span><span class="escpills">${mias.length?mias.map(x=>`<span class="epill" style="--c:${x.c||ci}">${ctx.esc(x.p||"")} ${ctx.esc(short(x.n))}</span>`).join(""):'<span class="muted" style="font-size:12.5px">sin escapadas todavía</span>'}</span></summary><div class="escordb">
    ${mias.length?`<div class="mine">${mias.map(x=>`<div class="it" style="--c:${x.c||ci}"><span>${ctx.esc(x.p||"")}</span><span><b>${ctx.esc(x.n)}</b><br><span class="dt">🚄 ${ctx.esc(x.tr)} · ${noches(x)}</span><br><select class="daysel" data-edate="${x.id}" aria-label="Día de la escapada"><option value="">📅 elegir día…</option>${diasCiudad(ctx,cid).map(d=>`<option value="${d.g}" ${(ctx.W.escF||{})[x.id]===d.g?"selected":""}>${d.d?ctx.pretty(d.d):"Día "+(d.g+1)}</option>`).join("")}</select></span><button type="button" class="btn alt sm" data-edel="${x.id}" aria-label="Quitar ${ctx.esc(x.n)}">✕</button></div>`).join("")}</div>`:'<div class="empty">Todavía no eligen escapadas: tóquenlas en las ideas de abajo.</div>'}</div></details>
   <div class="card"><span class="eyebrow">Ideas de escapadas desde ${ctx.esc(nn)}</span>
    <div class="filters" style="margin:8px 0 10px">${[["todas","Todas"],["noche","Con noche"],["dia","De un día"]].map(([k,t])=>`<button type="button" class="chip" data-ef="${k}" aria-pressed="${EF.fil===k}">${t}</button>`).join("")}</div>
    ${lista.length?`<div class="ideas">${lista.map(x=>{const on=sel.has(x.id);return `<div class="idea${on?" sel":""}" style="--c:${x.c||ci}"><div class="itop"><span>${ctx.esc(x.p||"")}</span><b>${ctx.esc(x.n)}</b>${on?'<span class="tag">✓ elegida</span>':""}</div><small>🚄 ${ctx.esc(x.tr)} · ${noches(x)}</small><p>${ctx.esc(x.t)}</p>
     <div class="act"><button type="button" class="btn sm${on?" alt":""}" data-esel="${x.id}">${on?"✕ Quitar":"+ Agregar"}</button><a class="btn alt sm" href="https://www.google.com/maps/dir/?api=1&origin=${q(nn)}&destination=${q(x.n)}&travelmode=transit" target="_blank" rel="noopener">🚄 Cómo llegar</a><a class="btn alt sm" href="${GIq(x.n)}" target="_blank" rel="noopener">📷 Fotos</a></div></div>`}).join("")}</div>`:'<p class="muted">Sin escapadas precargadas para esta ciudad.</p>'}</div>
   <p class="note">Tiempos y costos de tren aproximados: confirmar en la web del operador antes de comprar.</p>`;
}
export function bindEscapadas(ctx){const Q=(s,f)=>document.querySelectorAll(s).forEach(f),R=()=>{ctx.guardar();ctx.render()};
  Q("[data-ef]",b=>b.onclick=()=>{EF.fil=b.dataset.ef;ctx.render()});
  Q("details[data-escord]",d=>d.ontoggle=()=>{EF.ord=d.open});
  Q("[data-esel]",b=>b.onclick=()=>{const S=new Set(ctx.W.esc||[]),id=b.dataset.esel;S.has(id)?S.delete(id):S.add(id);ctx.W.esc=[...S];R()});
  Q("[data-edate]",s=>s.onchange=()=>{ctx.W.escF=ctx.W.escF||{};if(s.value==='')delete ctx.W.escF[s.dataset.edate];else ctx.W.escF[s.dataset.edate]=+s.value;R()});
  Q("[data-edel]",b=>b.onclick=()=>{ctx.W.esc=(ctx.W.esc||[]).filter(x=>x!==b.dataset.edel);if(ctx.W.escF)delete ctx.W.escF[b.dataset.edel];R()})}

// ---------- 5 · Espectáculos
const SF={c:""};
export function espectaculos(ctx){
  const L=ctx.W.shows||[],a=ctx.fechas()?ctx.W.inicio:"",b=a?ctx.add(a,ctx.W.ciudades.reduce((t,x)=>t+x.noches,0)):"";
  const en=s=>a&&s.f&&s.f>=a&&s.f<=b;
  const sorted=L.map((s,i)=>({...s,i})).sort((x,y)=>(en(y)-en(x))||((x.f||"9")<(y.f||"9")?-1:1));
  return `${guia("show")}<div class="card"><span class="eyebrow">Buscar eventos</span><p class="muted" style="font-size:14px;margin:4px 0 8px">Conciertos, teatro, deportes, festivales y ferias. Busquen lo que haya en sus fechas${a?` (${ctx.pretty(a)} → ${ctx.pretty(b)})`:""} y anoten lo que compren.</p>
   <div class="filters">${ctx.ids.map(i=>{const n=ctx.M[i].CIUDAD.n;return `<a class="chip" target="_blank" rel="noopener" href="https://www.google.com/search?q=${q("espectáculos conciertos eventos en "+n+(a?" "+ctx.pretty(a):""))}">🔎 ${ctx.esc(short(n))}</a>`}).join("")}</div></div>
   <div class="card"><span class="eyebrow">Anotar un evento</span><form id="fShow" class="fform" style="margin-top:8px">
    <label class="f wide">Qué<input name="n" required maxlength="80" placeholder="Ej.: Concierto en el Usher Hall"></label>
    <label class="f">Ciudad<select name="c">${ctx.ids.map(i=>`<option value="${i}">${ctx.esc(ctx.M[i].CIUDAD.n)}</option>`).join("")}</select></label>
    <label class="f">Fecha<input type="date" name="f"></label>
    <label class="f">Precio total (€)<input type="number" name="p" min="0" step="1"></label>
    <label class="f wide">Nota (opcional)<input name="t" maxlength="120" placeholder="Ej.: asientos 12-13, entrada por la puerta B"></label>
    <div class="act wide"><button class="btn sm" type="submit">＋ Anotar</button></div></form></div>
   ${sorted.length?`<div class="fichas">${sorted.map((s,k)=>{const ok=en(s),CI=ctx.M[s.c]?ctx.M[s.c].CIUDAD.n:"";return `<article class="ficha${ok||!a||!s.f?"":" off"}"><div class="ftab">EXP. EVT-${String(k+1).padStart(2,"0")}${CI?" · "+ctx.esc(CI.toUpperCase()):""}</div>
    <header><h3>🎟 ${ctx.esc(s.n)}</h3>${s.f&&a?(ok?'<span class="fstamp ok">EN SUS FECHAS</span>':'<span class="fstamp">FUERA DE FECHAS</span>'):""}</header>
    ${s.t?`<p class="flead">${ctx.esc(s.t)}</p>`:""}
    <p class="fmeta">📍 ${ctx.esc(CI)}${s.f?" · 📅 "+ctx.pretty(s.f):""}${s.p?" · 🎟 "+FM(s.p)+" en total":""}</p>
    <div class="flinks"><a href="https://www.google.com/search?q=${q(s.n+" "+CI)}" target="_blank" rel="noopener">Buscar ↗</a><button type="button" class="lnkb" data-ds="${s.i}">quitar de la lista</button></div></article>`}).join("")}</div>`:'<div class="card"><p class="muted">Aún no anotan eventos.</p></div>'}`;
}
export function bindEspectaculos(ctx){
  document.getElementById("fShow").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);(ctx.W.shows=ctx.W.shows||[]).push({n:f.get("n"),c:f.get("c"),f:f.get("f"),p:+f.get("p")||0,t:f.get("t")||""});ctx.guardar();ctx.render()};
  document.querySelectorAll("[data-ds]").forEach(b=>b.onclick=()=>{ctx.W.shows.splice(+b.dataset.ds,1);ctx.guardar();ctx.render()})}

// ---------- 6 · Comidas
const COM={veg:"vegetariano",vegano:"vegano",singluten:"sin gluten",sinmar:"sin mariscos",rapida:"comida rápida",local:"cocina local",barato:"económico",halal:"halal"};
const FD=[["d","🥐 Desayuno","#b8860b"],["a","🥪 Almuerzo","#a8352b"],["m","🍫 Merienda","#6b4f8f"],["c","🍷 Cena","#7b3f6e"]];
export function comidas(ctx){
  const cid=ciudadActual(ctx),M=ctx.M[cid],C=M.COMIDAS||{},G=M.GUIA_COMIDA||[],W=ctx.W,CI=M.CIUDAD,nd=diasDe(ctx,cid);
  const pref=[...(W.comida||[]).map(k=>COM[k]),W.comidaOtra].filter(Boolean);
  const min=k=>(C[k]||[]).reduce((m,x)=>Math.min(m,+x[1]||0),1e9),mn=k=>(C[k]&&C[k].length)?min(k):0;
  const dia=["d","a","m","c"].reduce((t,k)=>t+mn(k),0),dia2=["d","a","c"].reduce((t,k)=>t+mn(k),0);
  const ml=t=>`https://www.google.com/maps/search/?api=1&query=${q(t+" en "+CI.n)}`;
  const mis=((W.lugares||{})[cid])||[];
  return `${guia("food")}${ctabs(ctx,cid,c=>`${diasDe(ctx,c)} día${diasDe(ctx,c)>1?"s":""}`)}
   <div class="card cfg"><div class="field"><span>Tus preferencias de comida</span><b>${pref.length?ctx.esc(pref.join(", ")):"Sin preferencias"}</b><small class="muted" style="font-size:13px">Se cambian en <a href="#" data-gotab="cfg">Configurar</a> → Cambiar preferencias.</small></div>
    <p class="muted" style="font-size:13.5px;margin:0;align-self:end">Desayuno, almuerzo y cena con la opción más barata ≈ <b>${FM(dia2)}</b> por persona al día (con merienda, ${FM(dia)}). × ${nd} día${nd>1?"s":""} = <b>${FM(dia2*nd)}</b>. Cada día se ajusta en 2 · Programa → Comidas.</p></div>
   <div class="fichas">${FD.filter(([k])=>(C[k]||[]).length).map(([k,t,c],i)=>`<article class="ficha"><div class="ftab">COMIDAS · ${String(i+1).padStart(2,"0")} · ${ctx.esc(short(CI.n).toUpperCase())}</div><header><h3>${t}</h3></header>
    <table class="ftbl"><tbody>${C[k].map(r=>`<tr><td>${ctx.esc(r[0])}</td><td class="num">${FM(r[1])}</td></tr>`).join("")}</tbody></table>
    <div class="flinks"><a href="${ml(({d:"desayuno",a:"almuerzo",m:"merienda café",c:"cena restaurante"})[k]+(pref[0]?" "+pref[0]:""))}" target="_blank" rel="noopener">Buscar en el mapa ↗</a></div></article>`).join("")}
    ${G.map(g=>`<article class="ficha"><div class="ftab">GUÍA · ${ctx.esc(String(g.t).toUpperCase())}</div><header><h3>${ctx.esc(g.t)}</h3></header><table class="ftbl"><tbody>${g.r.map(r=>`<tr><td>${ctx.esc(r[0])}</td><td class="num">${ctx.esc(r[1])}</td></tr>`).join("")}</tbody></table>${g.n?`<div class="fnote"><span class="flab">Consejo</span><p>${ctx.esc(g.n)}</p></div>`:""}</article>`).join("")}</div>
   <div class="card buy"><span class="eyebrow">Dónde comer</span><h3>Buscar en el mapa</h3><ul class="brief">${[["Desayuno y café","cafeterías para desayunar"],["Almuerzo económico","almuerzo menú del día"],["Cocina local","restaurante de cocina local"],["Mercados y comida al paso","mercado de comida"],["Cena","restaurantes para cenar"],["Dulces y postres","pastelería"],...pref.slice(0,3).map(p=>["Tu preferencia: "+p,p])].map(([t,s])=>`<li><b>${ctx.esc(t)}</b> · <a href="${ml(s)}" target="_blank" rel="noopener">mapa</a></li>`).join("")}</ul></div>
   <div class="card buy"><span class="eyebrow">Lugares agregados por ustedes</span><h3>${ctx.esc(short(CI.n))}</h3>
    ${mis.length?`<ul class="brief">${mis.map((l,i)=>`<li><b>${ctx.esc(l.n)}</b>${l.t?` <span class="tag">${ctx.esc(l.t)}</span>`:""}${l.p?` <span class="tag">${FM(l.p)}</span>`:""}${l.b?` <span class="tag">${ctx.esc(l.b)}</span>`:""} <a href="${ml(l.n)}" target="_blank" rel="noopener">mapa</a> <button type="button" class="lnkb" data-lugdel="${cid}|${i}">quitar</button></li>`).join("")}</ul>`:'<p class="muted">Aún no agregan lugares.</p>'}
    <form class="fform" data-lugform="${cid}" style="margin-top:8px"><label class="f wide">Nombre del lugar<input name="n" required maxlength="80" placeholder="Ej.: Zum Schwarzen Ferkel"></label><label class="f">Tipo<select name="t"><option>Desayuno</option><option>Almuerzo</option><option>Cena</option><option>Café / dulces</option><option>Al paso</option></select></label><label class="f">Precio por persona (€)<input type="number" name="p" min="0" step="0.5"></label><label class="f wide">Barrio o dirección (opcional)<input name="b" maxlength="80"></label><div class="act wide"><button class="btn sm" type="submit">＋ Agregar lugar</button></div></form></div>
   <p class="note">Precios aproximados por persona${CI.moneda&&CI.moneda.code!=="EUR"?`; en ${ctx.esc(CI.n)} se paga en ${ctx.esc(CI.moneda.code)}`:""}. Verificar en el lugar.</p>`;
}
export function bindComidas(ctx){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-lugform]",f=>f.onsubmit=e=>{e.preventDefault();const d=new FormData(f),cid=f.dataset.lugform,W=ctx.W;W.lugares=W.lugares||{};(W.lugares[cid]=W.lugares[cid]||[]).push({n:d.get("n"),t:d.get("t"),p:+d.get("p")||0,b:d.get("b")||""});ctx.guardar();ctx.render()});
  Q("[data-lugdel]",b=>b.onclick=()=>{const [cid,i]=b.dataset.lugdel.split("|");ctx.W.lugares[cid].splice(+i,1);ctx.guardar();ctx.render()})}
