// Ruta «punto de llegada → alojamiento» sobre la red de transporte de una ciudad.
// Datos de la ciudad (pack.LLEGADAS): {estaciones:[{id,n,ll,lineas}], lineas:[{id,nombre,tipo,color,variantes:[{dir,ids}]}],
//   puntos:[{id,modo,n,corto,alias,ll,estacion,enlace,tarifas,horario,nota,extras:[{id,t,hasta:{n,ll,estacion},min,precio,...}]}]}
// El buscador no usa servicios externos: arma el grafo de metro/RER, sube a la red en la estación del punto (o en un bus) y baja donde
// el total (viaje + transbordos + caminata) sea menor, evitando bajar o cambiar en zonas de precaución. Siempre se ofrece además el enlace a Google Maps.
import {mlStyle} from "./mlstyle.js";
const rad=x=>x*Math.PI/180;
export const dist=(a,b)=>{const h=Math.sin(rad(b[0]-a[0])/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(rad(b[1]-a[1])/2)**2;return 12742*Math.asin(Math.sqrt(h))};
const nrm=s=>(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim();
export const walkMin=km=>Math.max(1,Math.round(km*1.3/4.8*60));

// Punto de llegada reconocido a partir de lo que escribió la persona (nombre, sigla o alias).
export function puntoDe(LL,texto){const t=nrm(texto);if(!t||!LL)return null;
  return LL.puntos.find(p=>[p.n,p.corto,...(p.alias||[])].some(x=>{x=nrm(x);return x&&(t===x||t.includes(x)||(t.length>=3&&x.includes(t)))}))||null}
export const puntosDeModo=(LL,modo)=>LL?LL.puntos.filter(p=>p.modo===modo):[];

const CACHE=new WeakMap();
function grafo(LL){if(CACHE.has(LL))return CACHE.get(LL);
  const est={},adj={};LL.estaciones.forEach(e=>{est[e.id]=e});
  const add=(a,b,o)=>{(adj[a]=adj[a]||[]).push({to:b,...o})};
  const col={};
  LL.lineas.forEach(l=>{col[l.id]=l;const rer=l.tipo==="rer";(l.variantes||[]).forEach(v=>{const ids=v.ids||[];
    for(let i=0;i<ids.length-1;i++){const a=est[ids[i]],b=est[ids[i+1]];if(!a||!b)continue;
      const fast=rer||l.id==="M14",t=dist(a.ll,b.ll)/(fast?55:24)*60+(fast?.5:.8);
      add(a.id,b.id,{l:l.id,t,dir:v.dir||est[ids[ids.length-1]].n});add(b.id,a.id,{l:l.id,t,dir:est[ids[0]].n})}})});
  LL.puntos.forEach(p=>{const n="pt:"+p.id;est[n]={id:n,n:p.n,ll:p.ll,virtual:1};
    if(p.estacion&&est[p.estacion])add(n,p.estacion,{l:"ENLACE",t:p.enlace||5,txt:p.enlaceTxt||""});
    (p.extras||[]).forEach(x=>{const h=x.hasta||{};let to=h.estacion&&est[h.estacion]?h.estacion:null;
      if(!to){to="bus:"+p.id+":"+x.id;est[to]={id:to,n:h.n,ll:h.ll,virtual:1}}
      add(n,to,{l:"BUS",t:x.min||60,x})})});
  const g={est,adj,col};CACHE.set(LL,g);return g}

// Costes (min): subir a un tren/bus 3 · transbordo +3 · penalización por bajar o cambiar en zona de precaución (excepto la del propio origen).
function buscar(LL,punto,hotel,zonas,{transb=3,riesgo=12}={}){
  const g=grafo(LL),{est,adj}=g,s0="pt:"+punto.id,S=(n,l)=>n+"|"+l;
  const cerca=id=>zonas.some(z=>dist(est[id].ll,z.ll)*1000<=z.r&&dist(est[id].ll,punto.ll)>.9);
  const pen=id=>est[id].virtual?0:(cerca(id)?riesgo:0);
  const dst={[S(s0,"")]:0},prev={},done=new Set();
  for(;;){let k=null,kv=1e9;for(const x in dst)if(!done.has(x)&&dst[x]<kv){k=x;kv=dst[x]}if(k===null)break;done.add(k);
    const [n,l]=k.split("|");for(const e of adj[n]||[]){let c=kv+e.t;
      if(e.l!==l){c+=e.l==="ENLACE"?0:(l===""||l==="ENLACE"||l==="BUS"?3:3+transb)+(e.l==="BUS"?4:0);if(l&&l!=="ENLACE"&&l!=="BUS")c+=pen(n)}
      const kk=S(e.to,e.l);if(dst[kk]===undefined||c<dst[kk]){dst[kk]=c;prev[kk]={k,e}}}}
  let best=null;for(const x in dst){const [n,l]=x.split("|"),E=est[n];if(!E||(E.virtual&&!/^bus:/.test(n)))continue;if(x===S(s0,""))continue;
    const w=dist(E.ll,hotel)*1000/1000,wm=walkMin(w);if(wm>28)continue;const tot=dst[x]+wm+(l&&l!=="ENLACE"?pen(n):0);if(!best||tot<best.tot)best={x,tot,wm,real:dst[x]+wm}}
  if(!best)return null;
  const ch=[];let k=best.x;while(prev[k]){ch.push(prev[k].e&&{...prev[k].e,from:prev[k].k.split("|")[0],to:k.split("|")[0]});k=prev[k].k}ch.reverse();
  const pasos=[];let cur=null;
  for(const e of ch){
    if(e.l==="ENLACE"){pasos.push({t:"enlace",n:est[e.to].n,txt:e.txt,min:e.t});cur=null}
    else if(e.l==="BUS"){pasos.push({t:"bus",x:e.x,de:est[e.from].n,a:est[e.to].n,min:e.t,ll:est[e.to].ll,llDe:est[e.from].ll});cur=null}
    else if(cur&&cur.l===e.l&&cur.dir===e.dir){cur.paradas++;cur.min+=e.t;cur.a=est[e.to].n;cur.pts.push(est[e.to].ll)}
    else{cur={t:"metro",l:e.l,dir:e.dir,de:est[e.from].n,a:est[e.to].n,paradas:1,min:e.t,pts:[est[e.from].ll,est[e.to].ll]};pasos.push(cur)}}
  pasos.forEach(p=>{if(p.t==="metro"){const L=g.col[p.l];p.nom=L?L.tipo==="rer"?"RER "+L.nombre:"Línea "+L.nombre:p.l;p.chip=L?L.tipo==="rer"?"RER "+L.nombre:L.nombre:p.l;p.color=(L&&L.color)||"#555";p.min=Math.round(p.min)}});
  const last=pasos.filter(p=>p.t!=="enlace").pop(),nt=pasos.filter(p=>p.t==="metro").length-1;
  const bajada=est[best.x.split("|")[0]];
  const toca=[];const vis=[...pasos.filter(p=>p.t==="metro").slice(1).map(p=>p.de),bajada.n];
  vis.forEach(nom=>{const e=Object.values(est).find(x=>x.n===nom);if(!e)return;zonas.forEach(z=>{if(dist(e.ll,z.ll)*1000<=z.r&&dist(e.ll,punto.ll)>.9&&!toca.some(t=>t.n===z.n))toca.push({n:z.n,t:z.t,est:nom})})});
  return {total:Math.round(best.real),pasos,caminar:best.wm,transbordos:Math.max(0,nt),baja:bajada.n,bajaLL:bajada.ll,avisos:toca}}

// Rutas para un punto y un alojamiento: la más rápida y, si es distinta, otra con menos transbordos.
export function rutasA(LL,punto,hotel,zonas){if(!LL||!punto||!hotel)return [];
  const a=buscar(LL,punto,hotel,zonas||[]);if(!a)return [];const out=[{...a,k:"rápida"}];
  const b=buscar(LL,punto,hotel,zonas||[],{transb:14,riesgo:12});
  if(b&&b.transbordos<a.transbordos&&b.total<=a.total+18)out.push({...b,k:"menos transbordos"});
  return out}

// ------- alojamiento: ubicación -------
const hotelQ=(W,cid)=>{const o=((W.hot||{})[cid]||[]).find(x=>x.sel),al=(W.alo||{})[cid];return ((o&&(o.addr||o.n))||(al&&al.n)||"").trim()};
export const hotelLL=(W,cid)=>{const g=(W.geo||{})[cid];return g&&g.q===hotelQ(W,cid)&&g.ll?g.ll:null};
export async function ubicarHotel(ctx,cid){const W=ctx.W,CI=ctx.M[cid].CIUDAD,q=hotelQ(W,cid);if(!q)return false;
  W.geo=W.geo||{};if(W.geo[cid]&&W.geo[cid].q===q)return false;
  let ll=null;try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(/par[ií]s/i.test(q)?q:q+", "+CI.n)}&viewbox=${CI.ll[1]-0.4},${CI.ll[0]+0.3},${CI.ll[1]+0.4},${CI.ll[0]-0.3}`);const j=await r.json();if(j[0])ll=[+(+j[0].lat).toFixed(5),+(+j[0].lon).toFixed(5)]}catch(e){}
  W.geo[cid]={q,ll};ctx.guardar();return true}

// ------- pantalla -------
const luz=h=>{const m=/^#?([0-9a-f]{6})$/i.exec(h||"");if(!m)return "#fff";const n=parseInt(m[1],16),y=((n>>16&255)*299+(n>>8&255)*587+(n&255)*114)/1000;return y>150?"#1d1a14":"#fff"};
const chip=(p,esc)=>`<span class="lchip" style="background:${esc(p.color)};color:${luz(p.color)}">${esc(p.chip)}</span>`;
export function datosLlegada(ctx){const W=ctx.W,cid=ctx.ids[0],M=ctx.M[cid],LL=M&&M.LLEGADAS;if(!LL)return null;
  const l=W.llega||{},modo=l.modo||"avion",punto=puntoDe(LL,l.pt||""),hl=hotelLL(W,cid),zonas=M.PRECAUCION||[];
  return {LL,cid,CI:M.CIUDAD,punto,modo,hotel:hl,hotelQ:hotelQ(W,cid),rutas:punto&&hl?rutasA(LL,punto,hl,zonas):[]}}
const gmaps=(D,esc)=>{if(!D.punto)return "";const dest=D.hotel?D.hotel.join(","):D.hotelQ||D.CI.n;
  return `https://www.google.com/maps/dir/?api=1&origin=${D.punto.ll.join(",")}&destination=${encodeURIComponent(dest)}&travelmode=transit`};
export function llegadaHTML(ctx){const D=datosLlegada(ctx);if(!D)return "";const esc=ctx.esc,P=D.punto;
  if(!P){const lst=puntosDeModo(D.LL,D.modo);if(!lst.length)return "";
    return `<div class="note" style="margin-top:8px">📍 Para calcular cómo llegar al alojamiento, elige el punto de llegada en <a href="#" data-gotab="cfg">Configurar</a>${(ctx.W.llega||{}).pt?` (no reconozco «${esc(ctx.W.llega.pt)}»)`:""}: ${lst.map(p=>esc(p.corto||p.n)).join(" · ")}.</div>`}
  const R=D.rutas;
  const info=[P.tarifas&&P.tarifas.billete?`Billete: ${esc(P.tarifas.billete)}`:"",P.horario?esc(typeof P.horario==="string"?P.horario:""):""].filter(Boolean).join(" · ");
  const lista=(r)=>`<ol class="lsteps">${r.pasos.map((p,i,a)=>{
    if(p.t==="enlace")return `<li>🚶 En <b>${esc(p.n)}</b>${p.txt?": "+esc(p.txt):": sigue las señales hacia el metro/tren"}.</li>`;
    if(p.t==="bus")return `<li>🚌 <b>${esc(p.x.t)}</b> hasta <b>${esc(p.a)}</b> (~${p.min} min${p.x.precio?" · "+esc(p.x.precio):""}${p.x.frecuencia?" · "+esc(p.x.frecuencia):""}).</li>`;
    const ant=a[i-1];return `<li>${ant&&ant.t==="metro"?`<span class="ltr">🔁 Transbordo en <b>${esc(p.de)}</b>:</span><br>`:""}${chip(p,esc)} dirección <b>${esc(p.dir)}</b> · ${p.paradas} parada${p.paradas>1?"s":""} (~${p.min} min): <b>${esc(p.de)}</b> → <b>${esc(p.a)}</b></li>`}).join("")}<li>🚶 Caminen ~<b>${r.caminar} min</b> desde <b>${esc(r.baja)}</b> hasta ${D.hotelQ?"<b>"+esc(D.hotelQ)+"</b>":"el alojamiento"}.</li></ol>`;
  let h=`<div class="lleg"><span class="eyebrow">📍 Del punto de llegada al alojamiento · calculado</span><h4>${esc(P.n)}</h4>`;
  if(!D.hotelQ)h+=`<p class="muted">Agreguen el alojamiento en la pestaña <a href="#" data-gotab="alo">Alojamiento</a> y calculo aquí el metro o tren hasta el hotel.</p>`;
  else if(!D.hotel)h+=`<p class="muted">Ubicando «${esc(D.hotelQ)}» en el mapa…</p>`;
  else if(!R.length)h+=`<p class="muted">No encontré una ruta de metro/tren razonable: usen el enlace de Google Maps.</p>`;
  else{h+=R.map((r,i)=>`<div class="lopt${i?" alt":""}"><b>${i?"Otra opción · menos transbordos":"Recomendada"}</b> · ~${r.total} min en total${r.transbordos?" · "+r.transbordos+" transbordo"+(r.transbordos>1?"s":""):" · sin transbordo"}${lista(r)}${r.avisos.map(a=>`<p class="note" style="margin:4px 0;font-size:13px">⚠ <b>${esc(a.est)}</b> está en una zona de precaución (${esc(a.n)}): ${esc(a.t)}</p>`).join("")}</div>`).join("");
    h+=`<div class="mapclip lclip" role="img" aria-label="Plano de la llegada"><span class="clip" aria-hidden="true"></span><div class="lmap" data-llegmap="1"></div><span class="mc-cap">Plano de la llegada</span><span class="mc-cr">© OpenFreeMap · OSM</span></div>`}
  if(P.nota)h+=`<p class="muted" style="font-size:13px">${esc(P.nota)}</p>`;
  if(info)h+=`<p class="muted" style="font-size:13px">${info}${P.tarifas&&P.tarifas.verificar?" (verificar)":""}</p>`;
  if(!R.length&&(P.extras||[]).length)h+=`<p class="muted" style="font-size:13px"><b>Opciones desde ${esc(P.corto||P.n)}:</b> ${P.extras.map(x=>esc(x.t)+" → "+esc(x.hasta.n)+" (~"+x.min+" min"+(x.precio?" · "+esc(x.precio):"")+")").join(" · ")}</p>`;
  h+=`<p class="muted" style="font-size:12px;margin:6px 0">Ruta orientativa con la red de metro y RER; zonas con carteristas se evitan al bajar o cambiar. Confirmen en Google Maps y revisen interrupciones del día.</p><a class="route" href="${gmaps(D,esc)}" target="_blank" rel="noopener">🗺 Abrir esta ruta en Google Maps (transporte público)</a></div>`;
  return h}

export function iniciarLlegada(ctx){const D=datosLlegada(ctx);if(!D)return;const W=ctx.W;
  // tiempo medido: alimenta el «día 1» (el punto de llegada → alojamiento)
  if(D.rutas.length){const m=D.rutas[0].total,k=D.punto.id+"|"+D.hotel.join(",");if(!W.llegaRuta||W.llegaRuta.k!==k){W.llegaRuta={k,min:m};ctx.guardar();ctx.render();return}}
  if(!D.hotel&&D.hotelQ&&D.punto)ubicarHotel(ctx,D.cid).then(c=>{if(c)ctx.render()});
  if(D.rutas.length&&window.maplibregl)document.querySelectorAll(".lmap[data-llegmap]").forEach(el=>{if(el._m||!el.offsetParent)return;
    const R=D.rutas[0],P=D.punto,pts=[P.ll];R.pasos.forEach(p=>{if(p.t==="metro")p.pts.forEach(q=>pts.push(q));else if(p.t==="bus")pts.push(p.ll)});pts.push(D.hotel);
    try{el.classList.add("ml");const mp=new maplibregl.Map({container:el,style:mlStyle(),interactive:false,attributionControl:false,bounds:[[Math.min(...pts.map(p=>p[1])),Math.min(...pts.map(p=>p[0]))],[Math.max(...pts.map(p=>p[1])),Math.max(...pts.map(p=>p[0]))]],fitBoundsOptions:{padding:34,maxZoom:16}});el._m=mp;
      const mk=(ll,t,top)=>{const w=document.createElement("div");w.className="mlmk";w.innerHTML=`<div class="lm-a${top?" top":""}">${t}</div>`;new maplibregl.Marker({element:w,anchor:"left",offset:[-11,0]}).setLngLat([ll[1],ll[0]]).addTo(mp)};
      mk(P.ll,"●");R.pasos.filter(p=>p.t==="metro").forEach((p,i,a)=>{if(i)mk(p.pts[0],"↔")});mk(D.hotel,"A",1);
      mp.on("load",()=>{const f=[];R.pasos.forEach(p=>{if(p.t==="metro")f.push({type:"Feature",properties:{c:p.color,w:0},geometry:{type:"LineString",coordinates:p.pts.map(q=>[q[1],q[0]])}});
          else if(p.t==="bus")f.push({type:"Feature",properties:{c:"#a8352b",w:0},geometry:{type:"LineString",coordinates:[[p.llDe[1],p.llDe[0]],[p.ll[1],p.ll[0]]]}})});
        f.push({type:"Feature",properties:{c:"#2a2620",w:1},geometry:{type:"LineString",coordinates:[[R.bajaLL[1],R.bajaLL[0]],[D.hotel[1],D.hotel[0]]]}});
        mp.addSource("ll",{type:"geojson",data:{type:"FeatureCollection",features:f}});
        mp.addLayer({id:"ll-r",type:"line",source:"ll",filter:["==",["get","w"],0],layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":["get","c"],"line-width":4.5}});
        mp.addLayer({id:"ll-w",type:"line",source:"ll",filter:["==",["get","w"],1],layout:{"line-cap":"round"},paint:{"line-color":"#2a2620","line-width":2.6,"line-dasharray":[0.2,2]}})})}catch(e){el.classList.remove("ml");el._m=null}})}
