// Motor de viajes nuevos con el diseño de París (cabecera, pestañas, tarjetas, mapa «cuaderno»).
// Fase 1: cabecera + pestañas + Configurar. Las demás pestañas usan v2/motor.js hasta portarlas al diseño de París.
import {PAISES,cargar,cargarTraslados} from "./ciudades/index.js";
import {cfgExtremos,bindExtremos} from "./extremos.js";
import * as NUBE from "./nube.js";
import {dibujar} from "./motor.js";
import {aplicarCustom} from "./programa.js";
import {mlStyle} from "./mlstyle.js";

const q=new URLSearchParams(location.search),id=q.get("id"),DEMO=q.has("demo");
const $=s=>document.querySelector(s),app=$("#app");
const esc=t=>String(t==null?"":t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],DIAS=["dom","lun","mar","mié","jue","vie","sáb"];
const D=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const add=(s,n)=>{const d=D(s);d.setDate(d.getDate()+n);return iso(d)};
const pretty=s=>{const d=D(s);return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`};
const km=(a,b)=>{const R=6371,t=x=>x*Math.PI/180,dl=t(b[0]-a[0]),dn=t(b[1]-a[1]);const h=Math.sin(dl/2)**2+Math.cos(t(a[0]))*Math.cos(t(b[0]))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
const horas=k=>k<5?.3:k/70+.5;
const fh=h=>{const m=Math.round(h*60);return m<60?m+" min":Math.floor(m/60)+" h"+(m%60?" "+String(m%60).padStart(2,"0"):"")};
const MODO={tren:"Tren",bus:"Bus",avion:"Avión",auto:"Auto",ferri:"Ferri"};
const COL=["#2e4f8f","#1d6f7a","#a8352b","#2e6b4f","#b8860b","#7b4ba0","#c2477f"];
const RIT={rap:{n:"Rápido",d:"hasta ~7,5 h de actividades al día"},int:{n:"Intermedio",d:"~5,5 h de actividades al día"},rel:{n:"Relajado",d:"~4 h al día y tiempo libre"}};
const short=n=>n.split(/ y |:/)[0];
const ic=p=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;

// ---- estilo (Retro / Moderno / Cuaderno) y barra, igual que en París
let sty="papel";try{sty=localStorage.getItem("paris_sty")||"papel"}catch(e){}
function setSty(v){sty=v;const R=document.documentElement;R.dataset.sty=v==="papel"?"retro":v;R.dataset.paper=v==="papel"?"1":"0";try{localStorage.setItem("paris_sty",v)}catch(e){}}
setSty(sty);
const R0=document.documentElement;R0.classList.add("cab");
try{R0.classList.toggle("navb",localStorage.getItem("paris_nav")!=="t");R0.classList.toggle("tabs2",localStorage.getItem("paris_tabs")==="1")}catch(e){R0.classList.add("navb")}

const CABIC={cfg:ic('<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>'),prog:ic('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
 att:ic('<path d="M3 21h18M5 21V10M19 21V10M9 21v-8M15 21v-8M12 3l9 6H3z"/>'),esc:ic('<rect x="6" y="3" width="12" height="13" rx="3"/><path d="M6 10h12M9 20l1.5-4M15 20l-1.5-4"/>'),
 show:ic('<path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>'),hot:ic('<path d="M3 19V6M3 15h18v4M21 15v-2.5a3 3 0 0 0-3-3h-7V15"/><circle cx="7" cy="11.5" r="1.6"/>'),
 buy:ic('<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>'),food:ic('<path d="M7 3v7M5 3v4a2 2 0 0 0 4 0V3M7 10v11M17 3c-2 1.5-3 4-3 7h3v11"/>'),
 gas:ic('<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H17v3"/><rect x="3" y="8.5" width="18" height="11" rx="2"/><circle cx="16.5" cy="14" r="1.1"/>'),tra:ic('<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/>'),
 out:ic('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),back:ic('<path d="M15 18l-6-6 6-6"/>')};
const CABSH={cfg:"Config.",prog:"Programa",att:"Atracc.",esc:"Escapadas",show:"Shows",hot:"Aloj.",buy:"Trámites",food:"Comidas",gas:"Gastos",tra:"Transp."};
const TABS=[["cfg","1 · Configurar"],["prog","2 · Programa"],["att","3 · Atracciones"],["esc","4 · Escapadas"],["show","5 · Espectáculos"],["food","6 · Comidas"],["gas","7 · Gastos"],["tra","8 · Transporte"],["hot","9 · Alojamiento"],["buy","10 · Trámites previos"]];

// ---- viaje (local + cuenta)
const LIST="mp_viajes";
const leer=()=>{try{return JSON.parse(localStorage.getItem(LIST)||"[]")}catch(e){return[]}};
const escribir=l=>{try{localStorage.setItem(LIST,JSON.stringify(l))}catch(e){}};
let viaje=leer().find(v=>v.id===id);
if(!viaje&&!DEMO&&id){try{const em=await NUBE.correo(5000);const n=em&&await NUBE.traer(id);if(n&&n.owner===em){viaje=n;escribir([...leer(),n])}}catch(e){console.warn("nube",e)}}
if(!viaje){app.innerHTML=`<div class="card"><p>No encontré este viaje en este dispositivo.</p><p><a href="/">← Volver a Mis viajes</a></p></div>`;throw new Error("sin viaje")}

const W=viaje.cfg,PAIS=PAISES.find(p=>p.id===viaje.pais),M={};let TR={};
// paquetes de todas las ciudades del viaje (y traslados de su país)
await Promise.all(W.ciudades.map(async x=>{try{M[x.id]=await cargar(x.pais||PAIS.id,x.id)}catch(e){console.warn("paquete",x.id,e)}}));
W.ciudades=W.ciudades.filter(x=>M[x.id]);
for(const pid of new Set([PAIS.id,...W.ciudades.map(x=>x.pais).filter(Boolean)])){try{TR=Object.assign({},(await cargarTraslados(pid)).TRASLADOS,TR)}catch(e){}}
aplicarCustom({W,M});
const nombre=i=>M[i].CIUDAD.n,ll=i=>M[i].CIUDAD.ll;
const llave=(a,b)=>[a,b].sort().join("-");
const eleccion=(a,b)=>{const d=km(ll(a),ll(b));const o=TR[llave(a,b)]||[{m:"bus",min:Math.round(horas(d)*60),eur:Math.round(d*.1),rec:1}];return o.find(x=>x.m===(W.traslado||{})[llave(a,b)])||o.find(x=>x.rec)||o[0]};
const fechas=()=>W.cuando==="fecha"&&W.inicio;
const noches=()=>W.ciudades.reduce((t,x)=>t+x.noches,0);

function sync(t,cls){const s=$("#sync");s.textContent=t;s.className="sync "+(cls||"");if(cls==="ok")setTimeout(()=>s.classList.add("hide"),2500)}
let tmr;
function guardar(){viaje.cfg=W;viaje.act=Date.now();const l=leer(),i=l.findIndex(v=>v.id===id);if(i>=0)l[i]=viaje;else l.push(viaje);escribir(l);sync("Guardado en este dispositivo","ok");
  if(DEMO)return;clearTimeout(tmr);tmr=setTimeout(async()=>{try{
    if(!viaje.owner){viaje.owner=await NUBE.correo(4000);if(viaje.owner){const l2=leer(),j=l2.findIndex(v=>v.id===id);if(j>=0){l2[j]=viaje;escribir(l2)}}}
    if(viaje.owner){await NUBE.subir(viaje);sync("☁ Guardado en tu cuenta","ok")}}catch(e){console.warn("nube",e)}},700)}

// ---- estado de pantalla
let tab="cfg";
const tabDeHash=()=>{const k=location.hash.slice(1);return TABS.some(t=>t[0]===k)?k:null};
try{tab=tabDeHash()||localStorage.getItem("mp_tab_"+id)||"cfg"}catch(e){}
function go(t){tab=t;try{localStorage.setItem("mp_tab_"+id,t)}catch(e){}if(location.hash.slice(1)!==t)history.replaceState(null,"","#"+t);render();scrollTo(0,0)}

// ---- cabecera (como la de París)
function headerCab(){
  const uniq=[...new Set(W.ciudades.map(c=>short(nombre(c.id))))],a=fechas()?W.inicio:"",b=a?add(a,noches()):"";
  return `<header class="cabh"><div class="cr1"><div class="seg" role="group">${[["retro","Retro","1"],["mod","Moderno","2"],["papel","Cuaderno","3"]].map(([k,t,i])=>`<button type="button" data-stysel="${k}" aria-pressed="${sty===k}" title="${t}" aria-label="${t}">${i}</button>`).join("")}</div>
   <div class="cusr"><button type="button" class="cib" data-gotab="gas" title="Gastos del viaje" aria-label="Gastos">${CABIC.gas}</button><button type="button" class="cib" id="logoBtn" title="Volver a Mis viajes" aria-label="Volver a Mis viajes">${CABIC.back}</button></div></div>
   <div class="cttl"><h1>${esc(uniq.join("·"))}</h1>${a?`<small>${pretty(a).replace(/^\S+\s/,"")} – ${pretty(b).replace(/^\S+\s/,"")}</small>`:`<small>${noches()} noches · sin fechas</small>`}</div></header>`;
}

// ---- Configurar
function ritSel(c){const cur=(W.ritmo||{})[c]||"int";return `<div class="seg ritseg" role="group" aria-label="Ritmo ${esc(nombre(c))}">${Object.entries(RIT).map(([r,o])=>`<button type="button" data-rit="${c}|${r}" aria-pressed="${cur===r}" title="${o.d}">${o.n}</button>`).join("")}</div>`}
function cfgRoute(){
  const ids=W.ciudades.map(c=>c.id);let d=0,h=`<div class="end">✈ Inicio: llegada a ${esc(nombre(ids[0]))}${(W.llega||{}).de?" desde "+esc(W.llega.de):""}${fechas()?` · ${pretty(W.inicio)}`:""}${W.hora?` · ${esc(W.hora)} h`:""}</div>`;
  W.ciudades.forEach((x,i)=>{const a=d,b=d+x.noches;d=b;
    if(i){const e=eleccion(ids[i-1],ids[i]);h+=`<div class="arr">↓ <b>${MODO[e.m]}</b> · ${fh(e.min/60)}${e.eur?` · ~${e.eur} €`:""}${e.rec?" · recomendado":""}</div>`}
    const rango=fechas()?`Llega ${pretty(add(W.inicio,a))} · sale ${pretty(add(W.inicio,b))}`:`Día ${a+1} → día ${b+1}`;
    h+=`<div class="n" style="--c:${COL[i%COL.length]}"><span style="flex:1;min-width:0"><b>${i+1}.</b> ${esc(nombre(x.id))}<br><small class="muted num">${rango}</small></span>
      <span class="nn" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end"><button class="btn sm" data-up="${i}" ${i?"":"disabled"} aria-label="Subir">▲</button><button class="btn sm" data-dn="${i}" ${i<ids.length-1?"":"disabled"} aria-label="Bajar">▼</button><button class="btn sm" data-mn="${i}" aria-label="Menos noches">−</button><b class="num">${x.noches}</b> noches<button class="btn sm" data-mas="${i}" aria-label="Más noches">+</button></span></div>`});
  h+=`<div class="end">✈ Fin: salida desde ${esc(nombre(ids[ids.length-1]))}${(W.sale||{}).a?" hacia "+esc(W.sale.a):""}${(W.sale||{}).hora?" · "+esc(W.sale.hora)+" h":""}${fechas()?` · ${pretty(add(W.inicio,noches()))}`:""}</div>`;
  return `<div class="routegrid">
   <div class="card" style="display:flex;flex-direction:column;gap:10px;min-width:0"><span class="eyebrow">Noches en cada ciudad · orden de visita</span><div class="nights">${h}</div>
    <span class="muted" style="font-size:13px">${noches()} noches · ${ids.length} ciudad${ids.length>1?"es":""}</span></div>
   <div class="card" style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="eyebrow">Mapa del viaje</span><div id="cfgml" class="cfgml" role="img" aria-label="Mapa del viaje"></div>
    <span class="muted" style="font-size:12px">Números = orden de la ruta. Mapa © OpenFreeMap · OpenStreetMap.</span></div></div>`;
}
function timeline(){
  const ids=W.ciudades.map(c=>c.id),it=[];let d=0;
  W.ciudades.forEach((x,i)=>{const dia=fechas()?add(W.inicio,d):null;
    it.push([dia,fechas()?pretty(dia).replace(" ","<br>"):"Día<br>"+(d+1),i?`${MODO[eleccion(ids[i-1],x.id).m]} a ${nombre(x.id)}`:`✈ Llegada a ${nombre(x.id)}`,i?`${fh(eleccion(ids[i-1],x.id).min/60)} · ${x.noches} noche${x.noches>1?"s":""} en ${nombre(x.id)}`:`${x.noches} noche${x.noches>1?"s":""}${W.hora?" · llegas a las "+W.hora:""}`]);d+=x.noches});
  it.push([null,fechas()?pretty(add(W.inicio,d)).replace(" ","<br>"):"Día<br>"+(d+1),`✈ Salida desde ${nombre(ids[ids.length-1])}`,""]);
  return `<ol class="ptl">${it.map(([,f,t,s])=>`<li><span class="d">${f}</span><span><b>${esc(t)}</b><small>${esc(s)}</small></span></li>`).join("")}</ol>`;
}
const COM={veg:"Vegetariano",vegano:"Vegano",singluten:"Sin gluten",sinmar:"Sin mariscos",rapida:"Comida rápida",local:"Cocina local",barato:"Económico",halal:"Halal"};
function pCfg(){
  const f=(k,l,t,v)=>`<div class="field"><label for="w-${k}">${l}</label><input id="w-${k}" type="${t}" data-w="${k}" value="${esc(v||"")}"></div>`;
  const com=[...(W.comida||[]).map(k=>COM[k]),W.comidaOtra].filter(Boolean).join(", ");
  return `<div class="card cfg">
   ${f("inicio","Fecha de llegada","date",W.inicio)}${f("hora","Hora aproximada de llegada","time",W.hora)}
   ${W.ciudades.map(x=>`<div class="field"><span>Ritmo · ${esc(nombre(x.id))}</span>${ritSel(x.id)}<small class="muted" id="rt_${x.id}">${RIT[(W.ritmo||{})[x.id]||"int"].d}</small></div>`).join("")}
  </div>
  ${cfgExtremos(CTX)}
  ${cfgRoute()}
  <div class="card"><span class="eyebrow">Línea de tiempo</span>${timeline()}</div>
  <div class="card cfg"><span class="eyebrow" style="grid-column:1/-1">Tus preferencias</span>
   <div class="field"><span>Alojamiento</span><b>${W.hoteles==="reservado"?"Ya reservado":"Recomendaciones · "+({eco:"económico",medio:"medio",conf:"confort"}[W.estandar]||"medio")}</b></div>
   <div class="field"><span>Comida</span><b>${com?esc(com):"Sin preferencias"}</b></div>
   <div class="field" style="grid-column:1/-1;flex-direction:row;gap:10px;flex-wrap:wrap"><a class="btn" href="nuevo.html?pais=${encodeURIComponent(viaje.pais)}&editar=${encodeURIComponent(id)}${DEMO?"&demo":""}">Cambiar mi ruta</a><button class="btn" id="borrar" type="button">Eliminar este viaje</button></div></div>
  <div class="basis"><span><span class="e">● Estimado</span> traslados, precios y horarios: datos generales, confirmar antes de reservar</span></div>`;
}

// ---- mapa del viaje (MapLibre, estilo cuaderno)
let ML=[];
function initMap(){
  ML.forEach(m=>{try{m.remove()}catch(e){}});ML=[];
  const el=$("#cfgml");if(!el||!window.maplibregl)return;
  const ids=W.ciudades.map(c=>c.id),P=ids.map(ll);
  const la=P.map(p=>p[0]),lo=P.map(p=>p[1]);
  const m=new maplibregl.Map({container:el,style:mlStyle(),interactive:true,attributionControl:{compact:true},
    bounds:[[Math.min(...lo),Math.min(...la)],[Math.max(...lo),Math.max(...la)]],fitBoundsOptions:{padding:50,maxZoom:ids.length>1?9:11}});
  ML.push(m);m.scrollZoom.disable();m.addControl(new maplibregl.NavigationControl({showCompass:false}),"top-left");
  ids.forEach((c,i)=>{const w=document.createElement("div");w.className="cfgpin";w.style.setProperty("--c",COL[i%COL.length]);w.innerHTML=`<b>${i+1}</b><span>${esc(short(nombre(c)))}</span>`;
    new maplibregl.Marker({element:w,anchor:"left",offset:[-13,0]}).setLngLat([ll(c)[1],ll(c)[0]]).addTo(m)});
  if(ids.length>1)m.on("load",()=>{m.addSource("ruta",{type:"geojson",data:{type:"Feature",geometry:{type:"LineString",coordinates:P.map(p=>[p[1],p[0]])}}});
    m.addLayer({id:"ruta",type:"line",source:"ruta",paint:{"line-color":"#a8352b","line-width":2.5,"line-dasharray":[2,2]}})});
}

// ---- render
const CTX={W,viaje,ids:[],M,PAIS,esc,pretty,add,km,fh,DEMO,nube:NUBE,MODO,eleccion,opciones:(x,y)=>TR[llave(x,y)]||[],fechas,guardar,render:()=>render(),ir:k=>go(k),actual:()=>tab};
function render(){
  CTX.ids=W.ciudades.map(c=>c.id);
  const y=scrollY;
  app.innerHTML=headerCab()+`<nav class="tabs" role="tablist">${TABS.map(([k,t])=>`<button role="tab" id="tab-${k}" aria-selected="${tab===k}" data-tab="${k}" title="${t}">${CABIC[k]}<span>${CABSH[k]}</span></button>`).join("")}</nav>
   <section class="panel" id="p-${tab}">${tab==="cfg"?pCfg():`<div id="vista"></div>`}</section>`;
  if(tab!=="cfg")dibujar(tab,CTX,$("#vista"));
  scrollTo(0,y);bindAll();
  if(tab==="cfg")setTimeout(initMap,0);
  cabH();
}
function cabH(){const n=$(".tabs");if(n&&R0.classList.contains("navb")){const s=n.querySelector("[aria-selected=true]");if(s)n.scrollLeft=s.offsetLeft-(n.clientWidth-s.offsetWidth)/2}if(n)R0.style.setProperty("--cabH",(R0.classList.contains("navb")?0:n.offsetHeight)+"px")}
function bindAll(){
  const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-stysel]",b=>b.onclick=()=>{setSty(b.dataset.stysel);render()});
  Q("[data-tab]",b=>b.onclick=()=>go(b.dataset.tab));
  Q("[data-gotab]",b=>b.onclick=()=>go(b.dataset.gotab));
  const lb=$("#logoBtn");if(lb)lb.onclick=()=>location.href="/"+(DEMO?"?demo":"");
  if(tab!=="cfg")return;
  Q("[data-w]",x=>x.onchange=()=>{W[x.dataset.w]=x.value;if(x.dataset.w==="inicio")W.cuando=x.value?"fecha":"generico";guardar();render()});
  bindExtremos(CTX);
  Q("[data-rit]",b=>b.onclick=()=>{const [c,r]=b.dataset.rit.split("|");W.ritmo=W.ritmo||{};W.ritmo[c]=r;if(W.prog)delete W.prog[c];guardar();render()});
  Q("[data-up]",b=>b.onclick=()=>{const i=+b.dataset.up,a=W.ciudades;[a[i-1],a[i]]=[a[i],a[i-1]];guardar();render()});
  Q("[data-dn]",b=>b.onclick=()=>{const i=+b.dataset.dn,a=W.ciudades;[a[i+1],a[i]]=[a[i],a[i+1]];guardar();render()});
  Q("[data-mn]",b=>b.onclick=()=>{const x=W.ciudades[+b.dataset.mn];x.noches=Math.max(1,x.noches-1);guardar();render()});
  Q("[data-mas]",b=>b.onclick=()=>{const x=W.ciudades[+b.dataset.mas];x.noches=Math.min(30,x.noches+1);guardar();render()});
  const br=$("#borrar");if(br)br.onclick=async()=>{if(br.dataset.arm!=="1"){br.dataset.arm="1";br.textContent="¿Seguro? Toca de nuevo";return}
    if(viaje.owner&&!DEMO){br.textContent="Eliminando…";try{await NUBE.borrar(id)}catch(e){console.warn("nube",e);br.textContent="No pude eliminarlo de tu cuenta. Revisa tu conexión.";br.dataset.arm="";return}}
    escribir(leer().filter(v=>v.id!==id));location.href="/"+(DEMO?"?demo":"")};
}
addEventListener("hashchange",()=>{const k=tabDeHash();if(k&&k!==tab){tab=k;render();scrollTo(0,0)}});
render();
