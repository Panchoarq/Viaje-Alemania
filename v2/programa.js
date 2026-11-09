// Programa del motor de viajes nuevos, con el diseño de /paris (boletos de día con argollas, carpetas por ciudad,
// día con título manuscrito, boletos de gasto, MAÑANA/TARDE/NOCHE, almuerzo, zonas de precaución, plano del día).
// Generalizado a N ciudades: lee W.ciudades y los paquetes de ciudad (ctx.M). El reparto usa el mismo algoritmo de París.
// Datos del viaje: W.sel{ciudad:[ids]} · W.prog{ciudad:[[ids por día]]} (el orden de cada día es el orden de visita)
//                  W.pin{idAtracción:díaDeLaCiudad} · W.meal{"día|k":0/1} · W.mealOpt{"día|k":n}
import {SUB,selDe,diasDe,inicioCiudad,CAP} from "./motor.js";
import {mlStyle} from "./mlstyle.js";

const COL=["#2e4f8f","#1d6f7a","#a8352b","#2e6b4f","#b8860b","#7b4ba0","#c2477f"];
const RIT={rap:{n:"Rápido",cap:7.5,step:1},int:{n:"Intermedio",cap:5.5,step:1},rel:{n:"Relajado",cap:4,step:2}};
const DOW=["dom","lun","mar","mié","jue","vie","sáb"];
const MONL=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const ic=p=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const IC={compras:ic('<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
 hotel:ic('<path d="M3 19V6M3 15h18v4M21 15v-2.5a3 3 0 0 0-3-3h-7V15"/><circle cx="7" cy="11.5" r="1.6"/>'),
 cal:ic('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
 comida:ic('<path d="M7 3v7M5 3v4a2 2 0 0 0 4 0V3M7 10v11M17 3c-2 1.5-3 4-3 7h3v11"/>'),
 entrada:ic('<path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>'),
 tram:ic('<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/>'),
 q:ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>')};
const CAL='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2"/></svg>';

const D=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const hm=x=>{const t=Math.round(x*60);return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")};
const mv=(a,b,km)=>{const k=km(a,b);return k<=1.2?k*0.22:0.25+k*0.06};
const num1=h=>String(h).replace(".",",");
const FM=v=>(+v).toLocaleString("es-CL",{maximumFractionDigits:2})+" €";
const short=n=>String(n).split(/ y |:/)[0];
const NOMC={d:"Desayuno",a:"Almuerzo",m:"Merienda",c:"Cena"};
const ONMEAL={d:1,a:1,m:0,c:1};

// estado de la vista (no se guarda)
const P={pool:{},day:{},cal:false,pop:null,leg:false,add:null,map:null,fich:null,open:new Set()};
let ML=[];

// ---------- sol (hora local de la ciudad)
const TZ={inglaterra:[0,1],escocia:[0,1],irlanda:[0,1],francia:[1,1],alemania:[1,1],chequia:[1,1],"corea-del-sur":[9,0],japon:[9,0],china:[8,0]};
function sunOf(date,ll,pais){const [tz,dstOn]=TZ[pais]||[Math.round(ll[1]/15),0];
  const y=date.getFullYear(),n=Math.round((Date.UTC(y,date.getMonth(),date.getDate())-Date.UTC(y,0,0))/864e5),g=2*Math.PI/365*(n-1),
  eq=229.18*(0.000075+0.001868*Math.cos(g)-0.032077*Math.sin(g)-0.014615*Math.cos(2*g)-0.040849*Math.sin(2*g)),
  de=0.006918-0.399912*Math.cos(g)+0.070257*Math.sin(g)-0.006758*Math.cos(2*g)+0.000907*Math.sin(2*g)-0.002697*Math.cos(3*g)+0.00148*Math.sin(3*g),
  la=ll[0]*Math.PI/180,lsun=d=>{const n0=new Date(Date.UTC(y,d==="m"?2:9,31));return 31-n0.getUTCDay()},
  dst=dstOn&&((m=>m>2&&m<9||(m===2&&date.getDate()>=lsun("m"))||(m===9&&date.getDate()<lsun("o")))(date.getMonth()))?1:0,
  t=z=>{const c=Math.cos(z*Math.PI/180)/(Math.cos(la)*Math.cos(de))-Math.tan(la)*Math.tan(de);const ha=Math.acos(Math.max(-1,Math.min(1,c)))*180/Math.PI;return (720-4*(ll[1]-ha)-eq)/60+tz+dst};
  return{set:t(90.833),dusk:t(96)}}

// ---------- días de una ciudad
export function diasCiudad(ctx,cid){const W=ctx.W,gi=ctx.ids.indexOf(cid),i0=inicioCiudad(ctx,cid),n=diasDe(ctx,cid);
  return Array.from({length:n},(_,i)=>({id:cid+":"+i,cid,i,g:i0+i,d:ctx.fechas()?ctx.add(W.inicio,i0+i):null,first:i===0,kind:i===0?(gi===0?"first":"go"):"stay"}))}
const todosDias=ctx=>ctx.ids.flatMap(c=>diasCiudad(ctx,c));
const baseDe=(ctx,cid)=>ctx.M[cid].CIUDAD.ll;
const atrDe=(ctx,cid)=>Object.fromEntries((ctx.M[cid].ATRACCIONES||[]).map(a=>[a.id,a]));
const ritDe=(ctx,cid)=>RIT[(ctx.W.ritmo||{})[cid]||"int"]||RIT.int;
const colDe=(ctx,cid)=>COL[Math.max(0,ctx.ids.indexOf(cid))%COL.length];

// ---------- orden de visita de un día (misma lógica que París)
function sequence(ctx,acts,day,base,manual){const km=ctx.km;let pos=base,t=day.first?14.5:9.5;const dow=day.d?D(day.d).getDay():null,seq=[];
  let rest=acts.filter(a=>!a.eve),ev=acts.filter(a=>a.eve);
  while(rest.length){
    if(!manual){const fx=rest.find(a=>a.at);if(fx)rest.splice(rest.indexOf(fx),1),rest.unshift(fx);
      else rest.sort((a,b)=>{const ca=(a.close||24)-(b.close||24);return (mv(pos,a.ll,km)-mv(pos,b.ll,km))+(Math.abs(ca)>2?ca*0.15:0)})}
    const a=rest.shift();t+=a.noloc?0:mv(pos,a.ll,km);if(a.at&&t<a.at)t=a.at;
    if(!seq.lunch&&!day.first&&t<15&&(t>=12.75||(t+a.h>13.5&&t>=11.5))){seq.lunch=Math.max(t,13);seq.lunchPos=a.noloc?pos:a.ll;t=seq.lunch+1}
    seq.push({...a,st:t,late:a.close&&t+a.h>a.close+0.01,closed:a.cl&&dow!=null&&a.cl.includes(dow)});t+=a.h;if(!a.noloc)pos=a.ll}
  if(!seq.lunch&&seq.length&&!day.first&&t>=11.25&&t<=15){seq.lunch=Math.max(t,13);seq.lunchPos=pos;t=seq.lunch+1}
  ev.forEach(a=>{t=Math.max(t+(a.noloc?0:mv(pos,a.ll,km)),18,a.at||0);seq.push({...a,st:t,night:1,late:false,closed:a.cl&&dow!=null&&a.cl.includes(dow)});t+=a.h;if(!a.noloc)pos=a.ll});
  return {seq,end:t,lunch:seq.lunch,lunchPos:seq.lunchPos,base}}
function legsOf(ctx,S){const km=ctx.km,out=[];let pos=S.base;
  S.seq.forEach((a,k)=>{if(a.noloc){out.push({noloc:1,k,min:0,d:0,from:pos,to:pos,fn:a.n,tn:a.n});return}
    const d=km(pos,a.ll);out.push({k,from:pos,to:a.ll,d,min:Math.round(mv(pos,a.ll,km)*60),metro:d>1.2,fn:k?S.seq[k-1].n:"Alojamiento",tn:a.n});pos=a.ll});
  const d=km(pos,S.base);out.push({k:S.seq.length,from:pos,to:S.base,d,min:Math.round(mv(pos,S.base,km)*60),metro:d>1.2,fn:S.seq.length?S.seq[S.seq.length-1].n:"",tn:"Alojamiento",back:1});
  return out}

// ---------- reparto por días (algoritmo de París, por ciudad)
export function organizarCiudad(ctx,cid){const W=ctx.W,days=diasCiudad(ctx,cid),At=ctx.M[cid].ATRACCIONES||[],S=selDe(ctx,cid),sel=At.filter(a=>S.has(a.id)),pin=W.pin||{},R=ritDe(ctx,cid),base=baseDe(ctx,cid),km=ctx.km;
  const plan=days.map(x=>({...x,acts:[],ev:[],cap:x.first?Math.min(3,R.cap):R.cap}));
  const dow=p=>p.d?D(p.d).getDay():null;
  const okDay=(p,a)=>!(a.cl&&dow(p)!=null&&a.cl.includes(dow(p)))&&!(a.from&&p.d&&p.d<a.from)&&!(a.to&&p.d&&p.d>a.to)&&!(a.no&&p.d&&a.no.includes(p.d));
  const load=p=>p.acts.reduce((t,a)=>t+a.h+0.3,0);
  sel.filter(a=>pin[a.id]!=null&&plan[pin[a.id]]).forEach(a=>{const p=plan[pin[a.id]];(a.eve?p.ev:p.acts).push(a)});
  const placed=new Set(plan.flatMap(p=>[...p.acts,...p.ev]));
  const acts=sel;
  acts.filter(a=>!placed.has(a)&&a.eve).forEach(a=>{const p=plan.filter(p=>okDay(p,a)).sort((x,y)=>x.ev.length-y.ev.length||(x.first?1:0)-(y.first?1:0))[0];if(p){p.ev.push(a);placed.add(a)}});
  const rest=acts.filter(a=>!placed.has(a));const zones={};rest.forEach(a=>(zones[a.z]=zones[a.z]||[]).push(a));
  const zl=Object.values(zones).sort((x,y)=>y.reduce((t,a)=>t+(a.top?2:0)+a.h,0)-x.reduce((t,a)=>t+(a.top?2:0)+a.h,0));
  let ix=plan.findIndex(p=>!p.first)+1;if(ix<1)ix=0;
  const P_=plan,step=R.step;
  zl.forEach(z=>{let left=[...z];while(left.length){let tries=0,p=null;
    while(tries<P_.length){const c=P_[(ix+tries)%P_.length];if(c&&load(c)+left[0].h<=c.cap&&!c.acts.length&&okDay(c,left[0])){p=c;break}tries++}
    if(!p)p=P_.filter(c=>load(c)+left[0].h<=c.cap&&okDay(c,left[0])).sort((a,b)=>load(a)-load(b))[0];
    if(!p){left.shift();continue}
    {const a=left.shift();p.acts.push(a);placed.add(a)}
    while(left.length&&load(p)+left[0].h+0.3<=p.cap+0.01&&okDay(p,left[0])){const a=left.shift();p.acts.push(a);placed.add(a)}
    ix=(P_.indexOf(p)+step)%P_.length}});
  W.prog=W.prog||{};W.sinLugar=W.sinLugar||{};
  W.prog[cid]=plan.map(p=>sequence(ctx,[...p.acts,...p.ev],p,base,false).seq.map(a=>a.id));
  W.sinLugar[cid]=sel.filter(a=>!placed.has(a)).map(a=>a.id)}
function asegurar(ctx,cid){const W=ctx.W;if(!W.prog||!W.prog[cid]){organizarCiudad(ctx,cid);ctx.guardar()}
  const n=diasCiudad(ctx,cid).length,pr=W.prog[cid];while(pr.length<n)pr.push([]);if(pr.length>n)pr.length=n}
function vaciarCiudad(ctx,cid){const W=ctx.W;W.sel=W.sel||{};W.sel[cid]=[];W.prog=W.prog||{};W.prog[cid]=diasCiudad(ctx,cid).map(()=>[]);W.sinLugar=W.sinLugar||{};W.sinLugar[cid]=[]}
function quitarDe(ctx,cid,id){(ctx.W.prog[cid]||[]).forEach(d=>{const j=d.indexOf(id);if(j>=0)d.splice(j,1)})}
function enDia(ctx,cid,id,i){quitarDe(ctx,cid,id);ctx.W.prog[cid][i].push(id)}
function menosCargado(ctx,cid,a){const days=diasCiudad(ctx,cid),At=atrDe(ctx,cid),R=ritDe(ctx,cid);
  const carga=i=>(ctx.W.prog[cid][i]||[]).reduce((t,x)=>t+(At[x]?At[x].h+0.3:0),0);
  const ok=days.map((_,i)=>i).filter(i=>!(a.cl&&days[i].d&&a.cl.includes(D(days[i].d).getDay())));
  return (ok.length?ok:days.map((_,i)=>i)).sort((x,y)=>carga(x)-carga(y))[0]}

// ---------- costos del día
const GK=id=>"mp_gastos_"+id;
const gastosLocal=ctx=>{try{return JSON.parse(localStorage.getItem(GK(ctx.viaje.id))||"[]")}catch(e){return[]}};
const RKEY={Alojamiento:"Alojamiento",Comidas:"Comida",Entradas:"Entradas",Transporte:"Transporte",Compras:"Compras"};
function mealSel(ctx,day,k){const o=ctx.M[day.cid].COMIDAS||{},L=o[k]||[];const W=ctx.W,key=day.id+"|"+k;
  const on=W.meal&&W.meal[key]!=null?!!W.meal[key]:!!ONMEAL[k];const i=Math.min((W.mealOpt||{})[key]||0,Math.max(0,L.length-1));return {on,i,L}}
function costOf(ctx,day,S){const W=ctx.W,CI=ctx.M[day.cid].CIUDAD,pers=W.personas||2,metro=CI.metro||2.4;
  const al=(W.alo||{})[day.cid]||{},nn=(W.ciudades.find(x=>x.id===day.cid)||{noches:1}).noches||1;
  const hot=al.p?(+al.p/nn)/pers:0;
  let meal=0;for(const k of ["d","a","m","c"]){const m=mealSel(ctx,day,k);if(m.on&&m.L[m.i])meal+=+m.L[m.i][1]||0}
  const act=S?S.seq.reduce((t,a)=>t+(a.p||0),0):0;
  const legs=S?S.legs:[];const loc=legs.filter(l=>l.metro&&!l.noloc).length*metro;
  return {hot,meal,act,loc,total:hot+meal+act+loc,legs}}
const realOf=(ctx,day,key)=>{if(!day.d)return 0;return gastosLocal(ctx).filter(g=>g.f===day.d&&(!key||g.cat===key)).reduce((t,g)=>t+(+g.eur||0),0)};

// ---------- piezas de HTML
const trUrl=(a,b,m)=>`https://www.google.com/maps/dir/?api=1&origin=${a.join(",")}&destination=${b.join(",")}&travelmode=${m?"transit":"walking"}`;
function routeUrl(S){const pts=S.seq.filter(a=>!a.noloc).map(a=>a.ll.join(","));if(!pts.length)return"";
  return `https://www.google.com/maps/dir/?api=1&origin=${S.base.join(",")}&destination=${pts[pts.length-1]}${pts.length>1?`&waypoints=${encodeURIComponent(pts.slice(0,-1).join("|"))}`:""}&travelmode=transit`}
function costStrip(ctx,c,day){const dr=!!day.d&&gastosLocal(ctx).some(g=>g.f===day.d);
  const C=[[IC.hotel,"Alojamiento",c.hot,"var(--mun)"],[IC.comida,"Comidas",c.meal,"var(--pra)"],[IC.entrada,"Entradas",c.act,"var(--ber)"],[IC.tram,"Transporte",c.loc,"var(--ok)"],[IC.compras,"Compras",0,"var(--mun)"]];
  const M=Math.max(...C.map(x=>x[2]),0.01);
  return `<div class="dstrip" aria-label="Gasto del día por categoría">${C.map(x=>`<div class="tkt${x[2]>0.005?"":" zero"}" title="${x[1]}: ${FM(x[2])}"><span class="ti" aria-hidden="true">${x[0]}</span><b class="num">${x[2]>0.005?FM(x[2]):"—"}${dr?`<span class="rl">/ ${FM(realOf(ctx,day,RKEY[x[1]]))}</span>`:""}</b><span class="tn">${x[1]}</span><span class="tm"><span style="width:${(x[2]/M*100).toFixed(1)}%;background:${x[3]}"></span></span></div>`).join("")}</div>`}
function dayTitle(ctx,day){const CI=ctx.M[day.cid].CIUDAD;
  if(day.kind==="first")return "Llegada a "+short(CI.n);
  if(day.kind==="go"){const prev=ctx.ids[ctx.ids.indexOf(day.cid)-1];return short(ctx.M[prev].CIUDAD.n)+" → "+short(CI.n)}
  return "Día completo en "+short(CI.n)}
const diaTxt=(ctx,day)=>day.d?ctx.pretty(day.d):"Día "+(day.g+1);

function actRow(ctx,day,a,k,S,pool){const op=P.open.has(day.id+"|"+a.id);const late=a.closed?"cerrado ese día":a.late?"cierra "+hm(a.close):"";
  const CI=ctx.M[day.cid].CIUDAD,SUN=S.sun;
  const sun=!SUN||a.in?"":a.st>=SUN.dusk-0.05?'<span class="sun nite" title="Ya es de noche">🌙</span>':a.st+a.h>SUN.set+0.15?'<span class="sun dusk" title="Termina con poca luz">🌇</span>':"";
  const nonEve=S.seq.filter(x=>!x.night),canMv=!a.night&&nonEve.length>1;
  const days=diasCiudad(ctx,day.cid),pin=(ctx.W.pin||{})[a.id];
  return `<div class="actrow2${op?" open":""}" data-k="${a.id}">
 <div class="ar-top"><b class="num anum">${k+1}</b><span class="st num">${hm(a.st)}</span>${sun}<span class="ar-name">${ctx.esc(a.n.replace(/\s*\(.*?\)\s*$/,""))}${a.top?' <span class="top">★</span>':""}${late?`<small class="ar-latemini">⚠ ${late}</small>`:""}</span><span class="ar-pmini ${a.p?"":"free"}">${a.p?FM(a.p):"gratis"}</span><span class="ar-ctl">${canMv?`<button type="button" class="mvb" data-pmv="${day.id}|${a.id}|-1" title="Subir" ${nonEve[0].id===a.id?"disabled":""}>↑</button><button type="button" class="mvb" data-pmv="${day.id}|${a.id}|1" title="Bajar" ${nonEve[nonEve.length-1].id===a.id?"disabled":""}>↓</button>`:""}<button type="button" class="rm" data-rm="${day.id}|${a.id}" title="Quitar del programa" aria-label="Quitar ${ctx.esc(a.n)}">✕</button></span></div>
 <div class="ar-meta"><span class="dur">🕐 visita ~${num1(a.h)} h</span>${late?`<span class="tag late">⚠ ${late}</span>`:""}${a.in?'<span class="tag indoor" title="Techado">🏛 techado</span>':""}${a.cl?`<span class="tag">cerrado ${a.cl.map(x=>DOW[x]).join(", ")}</span>`:""}<span class="tag ar-price ${a.p?"price":"free"}">${a.p?FM(a.p):"gratis"}</span></div>
 ${a.v?`<div class="ar-note">${ctx.esc(a.v)}</div>`:""}
 <div class="ar-links">${a.u?`<a href="${ctx.esc(a.u)}" target="_blank" rel="noopener">sitio</a> · `:""}<a href="https://www.google.com/maps/search/?api=1&query=${a.ll.join(",")}" target="_blank" rel="noopener">mapa</a> <select class="daysel" data-papin="${day.cid}|${a.id}" aria-label="Elegir día"><option value="">📅 día automático</option>${days.map(x=>`<option value="${x.i}" ${pin===x.i?"selected":""}>${diaTxt(ctx,x)}</option>`).join("")}</select>${pin!=null?'<span class="tag pinday">día fijado</span>':""}</div>
 <details class="why"><summary>¿Por qué vale la pena?</summary>${ctx.esc(a.s||"")} ${a.d?`<b>Consejo:</b> ${ctx.esc(a.d)}`:""}</details></div>`}

function dayHTML(ctx,day,S){const W=ctx.W,cid=day.cid,M=ctx.M[cid],CI=M.CIUDAD,cc=colDe(ctx,cid),c=costOf(ctx,day,S);
  const SUN=day.d?sunOf(D(day.d),CI.ll,CI.pais):null;if(S)S.sun=SUN;
  const al=(W.alo||{})[cid]||{};
  const night=`Noche en ${ctx.esc(al.n||"alojamiento en "+short(CI.n)+" (por definir en Alojamiento)")}`;
  let tl="";
  if(day.kind==="first")tl=`✈ Llegada a <b>${ctx.esc(CI.n)}</b> · actividades desde las 14:30`;
  else if(day.kind==="go"){const prev=ctx.ids[ctx.ids.indexOf(cid)-1],e=ctx.eleccion(prev,cid);tl=`🚄 ${ctx.esc(short(ctx.M[prev].CIUDAD.n))} → <b>${ctx.esc(short(CI.n))}</b> · ${ctx.MODO[e.m]||e.m} ${ctx.fh(e.min/60)}${e.eur?" · ~"+FM(e.eur):""} · actividades desde las 14:30`}
  {const ex=ctx.ids.length===1?(M.ESCAPADAS||[]).filter(e=>(W.esc||[]).includes(e.id)&&(W.escF||{})[e.id]===day.g):[];
   if(ex.length)tl+=(tl?" · ":"")+ex.map(e=>`🚆 Escapada: <b>${ctx.esc(e.n)}</b> (${ctx.esc(e.tr)})`).join(" · ")}
  let foot="";
  let h=`<div class="dtabrow"><span class="dftab"><b>${diaTxt(ctx,day)}</b><span class="fc">${ctx.esc(short(CI.n))}</span></span>${ctx.fechas()?`<button type="button" class="daycal" data-calopen title="Calendario del viaje" aria-label="Abrir calendario del viaje">${CAL}</button>`:""}<button type="button" class="daycal" data-legend aria-pressed="${P.leg}" title="Leyenda de símbolos" aria-label="Leyenda de símbolos">${IC.q}</button><button type="button" class="totop" data-totop aria-label="Volver arriba de la página">↑ arriba</button></div>${P.leg?`<div class="legpop"><div class="legendtr"><span class="eyebrow">Leyenda</span><span style="font-size:13px">↑↓ cambia el orden del día · ✕ quita del programa · 📅 fija la atracción a un día</span><span class="tr pie">a pie</span><span class="tr metro">${ctx.esc(CI.transit?"transporte público":"metro")}</span><span class="top">★ imperdible</span><span>🏛 techada</span><span>🌙 de noche</span><span>🌇 poca luz</span></div></div>`:""}
  <div class="day-head"><h3>${ctx.esc(dayTitle(ctx,day))}</h3><span class="muted" style="font-size:13px">${night}</span>${SUN?`<span class="sunline">🌇 Se pone el sol ${hm(SUN.set)} · 🌙 oscuro desde ${hm(SUN.dusk)}</span>`:""}</div>
  ${costStrip(ctx,c,day)}<div class="day-total"><span class="eyebrow">Presupuesto / real</span><span class="big">${FM(c.total)}<span class="sl"> / </span><span class="rd">${FM(realOf(ctx,day))}</span></span><span class="muted num las">las ${W.personas||2}: ${FM(c.total*(W.personas||2))}</span></div>${tl?`<span class="tl dtl">${tl}</span>`:""}
  <div class="day-body"><div class="blk blk-com${P.open.has(day.id+"|com")?" open":""}"><h4>Comidas · ${FM(c.meal)}</h4>`;
  ["d","a","m","c"].forEach(k=>{const m=mealSel(ctx,day,k);if(!m.L.length)return;const o=m.L[m.i];
    h+=`<label class="chk"><input type="checkbox" data-meal="${day.id}|${k}" ${m.on?"checked":""}><span class="t">${NOMC[k]}<small>${ctx.esc(o[0])}</small></span><span class="p">${FM(o[1])}</span></label>${m.L.length>1?`<select class="msel" data-mopt="${day.id}|${k}" aria-label="Opción ${NOMC[k]}">${m.L.map((x,j)=>`<option value="${j}" ${j===m.i?"selected":""}>${ctx.esc(x[0])} · ${FM(x[1])}</option>`).join("")}</select>`:""}`});
  h+=`<span class="muted" style="font-size:12px">Precios aproximados por persona.</span></div><div class="blk blk-att"><h4>Atracciones</h4>`;
  if(S&&S.seq.length){const legs=S.legs;let lp=false,cp=null;
    const per=a=>a.night||a.st>=19?"n":a.st>(S.lunch||13)?"t":"m",PH={m:"🌅 Mañana",t:"☀ Tarde",n:"🌙 Noche"};
    const lunch=()=>{
      return `<div class="lunch">🍽 <b>${hm(S.lunch)}–${hm(S.lunch+1)}</b> Almuerzo (1 h)${(M.COMIDAS||{}).a?` <span class="ffs">${(M.COMIDAS.a||[]).slice(0,2).map(x=>ctx.esc(x[0])+" ("+FM(x[1])+")").join(" · ")} · <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("restaurantes cerca de "+(S.lunchPos||CI.ll).join(","))}" target="_blank" rel="noopener">buscar cerca</a></span>`:""}</div>`};
    S.seq.forEach((a,k)=>{const l=legs[k];if(S.lunch&&!lp&&a.st>S.lunch){h+=lunch();lp=true}const pr=per(a);if(pr!==cp){cp=pr;h+=`<div class="dper" data-p="${pr}"><span>${PH[pr]}</span><small>desde ${hm(a.st)}</small></div>`}
      h+=l.noloc?`<span class="mv">↓ ${ctx.esc(a.n)}: sin dirección, sin traslado calculado</span>`:l.metro?`<span class="mv">↓ ~${l.min} min en transporte público${k===0?" desde el alojamiento":""} · <a href="${trUrl(l.from,l.to,1)}" target="_blank" rel="noopener">ver cómo llegar</a></span>`:`<span class="mv">↓ a pie ~${l.min} min${k===0?" desde el alojamiento":""}</span>`;
      h+=actRow(ctx,day,a,k,S)});
    if(S.lunch&&!lp)h+=lunch();
    const back=legs[legs.length-1];h+=`<span class="mv">↓ vuelta al alojamiento ${back.metro?`~${back.min} min en transporte público`:`a pie ~${back.min} min`} · llegada ~${hm(S.end+mv(back.from,back.to,ctx.km))}</span>`;
    const pts=[S.base,...S.seq.map(a=>a.ll)],zs=zonasCerca(ctx,cid,pts);
    if(zs.length)h+=`<details class="riskbox"><summary>⚠ Zona${zs.length>1?"s":""} de precaución: ${zs.map(z=>ctx.esc(z.n)).join(" · ")}</summary>${zs.map(z=>`<p><b>${ctx.esc(z.n)}:</b> ${ctx.esc(z.t)}</p>`).join("")}<p class="muted">Emergencias en Europa: <b>112</b>. En otros países, revisa el número local en Trámites previos.</p></details>`;
    foot+=`<a class="route" href="${routeUrl(S)}" target="_blank" rel="noopener">🗺 Ver recorrido del día en Google Maps (A = alojamiento, luego ${S.seq.map((_,k)=>k+1).join("→")})</a>`;
    const used=S.seq.reduce((t,a)=>t+a.h,0)+legs.slice(0,-1).reduce((t,l)=>t+(l.noloc?0:mv(l.from,l.to,ctx.km)),0);foot+=`<span class="tused">⏱ Tiempo usado ${used.toFixed(1)} de ${ritDe(ctx,cid).cap.toFixed(1)} h disponibles</span>`}
  else h+=`<span class="muted" style="font-size:13px">${day.kind==="go"?"Día de viaje: llegar con calma y recorrer el barrio.":"Día libre: recorrer sin apuro, descansar o improvisar."}</span>`;
  h+=`<button type="button" class="btn addact" data-addday="${day.id}">+ Agregar actividad a este día</button>${S&&S.seq.length?`<button type="button" class="btn alt sm clrday" data-clrday="${day.id}">Vaciar este día</button>`:""}`;
  if(P.add===day.id)h+=addPanel(ctx,day);
  h+=`</div><div class="blk blk-tr${P.open.has(day.id+"|tr")?" open":""}"><h4>Traslados, alojamiento y plano</h4>`;
  if(c.hot!=null&&al.p)h+=`<div class="line"><span>½ alojamiento (2 personas)</span><span class="p">${FM(c.hot)}</span></div>`;
  if(S){const nm=S.legs.filter(l=>l.metro&&!l.noloc).length;if(nm)h+=`<div class="line"><span>${nm} ${nm===1?"viaje":"viajes"} en transporte público × ${FM(CI.metro||2.4)} · <a href="#" data-gotab="tra">opciones</a></span><span class="p">${FM(c.loc)}</span></div>`;
    h+=S.legs.map(l=>`<div class="line sub"><span>${l.metro?"🚇":"🚶"} ${ctx.esc(l.fn)} → ${ctx.esc(l.tn)} <small class="muted">${l.d.toFixed(1).replace(".",",")} km · ~${l.min} min · <a href="${trUrl(l.from,l.to,l.metro)}" target="_blank" rel="noopener">ruta</a></small></span></div>`).join("")}
  if(S&&S.seq.length)h+=window.maplibregl?`<div class="mapclip lclip" role="button" tabindex="0" data-dmap="${day.id}" aria-label="Ampliar plano del recorrido"><span class="clip" aria-hidden="true"></span><div class="lmap" data-lday="${day.id}"></div><span class="mc-cap">Plano del día · ampliar</span><span class="mc-cr">© OpenFreeMap · OSM</span></div>`:`<a class="route" href="${routeUrl(S)}" target="_blank" rel="noopener">🗺 Mapa del recorrido</a>`;
  else h+=`<a class="route" href="https://www.google.com/maps/search/?api=1&query=${CI.ll.join(",")}" target="_blank" rel="noopener">🗺 Mapa de ${ctx.esc(short(CI.n))}</a>`;
  h+=`</div>${foot?`<div class="dfoot">${foot}</div>`:""}</div><button type="button" class="totop bot" data-totop>↑ Volver arriba</button>`;
  return `<article class="day" style="--c:${cc}" data-day="${day.id}" data-city="${cid}">${h}</article>`}

function zonasCerca(ctx,cid,pts){return (ctx.M[cid].PRECAUCION||[]).filter(z=>pts.some(p=>p&&ctx.km(p,z.ll)*1000<=z.r+120))}
function addPanel(ctx,day){const At=ctx.M[day.cid].ATRACCIONES||[],here=new Set((ctx.W.prog[day.cid][day.i])||[]);
  const L=At.filter(a=>!here.has(a.id));
  return `<div class="pool" style="display:block;margin-top:8px"><span class="eyebrow">Agregar a este día</span>${L.length?L.map(a=>`<div class="poolrow"><span class="t" style="flex:1;min-width:0;font-size:14px"><b>${ctx.esc(a.n)}</b>${a.top?'<span class="top">★</span>':""}<small class="muted" style="display:block">~${num1(a.h)} h · ${a.p?FM(a.p):"gratis"}</small></span><button type="button" class="btn sm" data-addto="${day.id}|${a.id}">+ Agregar</button></div>`).join(""):'<p class="muted">Ya están todas las atracciones de la ciudad en este día.</p>'}${formNueva(ctx,day.cid,day.id)}</div>`}
export function formNueva(ctx,cid,dia){return `<details class="hnew" style="margin-top:10px"${dia?"":" open"}><summary class="eyebrow" style="cursor:pointer">＋ Nueva actividad (personalizada)</summary>
  <form class="fform perf" data-perform="${cid}|${dia||""}" style="margin-top:8px"><label class="f wide">Actividad<input name="n" required maxlength="80" placeholder="Ej.: Cumpleaños de Sofía, compras, visita a la tía"></label>
  <label class="f wide">Dirección (opcional)<input name="addr" maxlength="120" placeholder="Ej.: Unter den Linden 1"></label>
  <label class="f">Duración (horas)<input name="h" type="number" min="0.25" step="0.25" value="1"></label><label class="f">Costo por persona (€)<input name="p" type="number" min="0" step="0.5" value="0"></label>
  <label class="f wide">Nota (opcional)<input name="s" maxlength="120" placeholder="Ej.: llevar regalo, reservar mesa"></label>
  <div class="act wide"><button type="submit" class="btn sm">＋ Agregar${dia?" a este día":" a la lista"}</button></div>
  <p class="muted wide" style="font-size:13px;margin:0">Con dirección se ubica en el plano y se calcula el traslado; sin dirección queda registrada sin traslado.</p></form></details>`}
export function bindNueva(ctx){document.querySelectorAll("form[data-perform]").forEach(f=>f.onsubmit=e=>{e.preventDefault();crearActividad(ctx,f)})}
export function aplicarCustom(ctx){const W=ctx.W;for(const cid in (W.custom||{})){const A=(ctx.M[cid]||{}).ATRACCIONES;if(!A)continue;for(const a of W.custom[cid])if(!A.some(x=>x.id===a.id))A.push(a)}}
export async function crearActividad(ctx,f){const [cid,dia]=f.dataset.perform.split("|"),g=k=>(f[k]&&f[k].value||"").trim(),n=g("n");if(!n)return;
  const btn=f.querySelector("button[type=submit]");btn.disabled=true;btn.textContent="Guardando…";
  const CI=ctx.M[cid].CIUDAD;let ll=null,addr=g("addr"),found="";
  if(addr){try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=es&q=${encodeURIComponent(addr+", "+CI.n)}&viewbox=${CI.ll[1]-0.4},${CI.ll[0]+0.3},${CI.ll[1]+0.4},${CI.ll[0]-0.3}`);const j=await r.json();if(j[0]){ll=[+(+j[0].lat).toFixed(5),+(+j[0].lon).toFixed(5)];found=j[0].display_name.split(",").slice(0,3).join(",")}}catch(e){}}
  const a={id:"cu"+Date.now().toString(36),n,h:+g("h")||1,p:+g("p")||0,in:0,ll:ll||CI.ll,noloc:ll?0:1,z:"Personal",s:g("s")||(ll?found:"Actividad personal"),v:addr?(ll?"📍 "+found:"Dirección sin ubicar: "+addr):"Sin dirección",d:g("s")||"",u:ll?`https://www.google.com/maps/search/?api=1&query=${ll.join(",")}`:"",custom:1};
  const W=ctx.W;(W.custom=W.custom||{})[cid]=W.custom[cid]||[];W.custom[cid].push(a);ctx.M[cid].ATRACCIONES.push(a);
  alternarAtr(ctx,cid,a.id,true);if(dia){const i=+dia.split(":")[1];if(W.prog&&W.prog[cid])enlazar(ctx,cid,a.id,i)}
  P.add=null;ctx.guardar();ctx.render()}
export function quitarCustom(ctx,cid,aid){const W=ctx.W;alternarAtr(ctx,cid,aid,false);W.custom[cid]=(W.custom[cid]||[]).filter(x=>x.id!==aid);const A=ctx.M[cid].ATRACCIONES;const i=A.findIndex(x=>x.id===aid);if(i>=0)A.splice(i,1);if(W.pin)delete W.pin[aid];ctx.guardar();ctx.render()}

// tarjeta de factibilidad y lista de atracciones (equivale al «fcard» de París)
function fcard(ctx,cid){const W=ctx.W,M=ctx.M[cid],At=M.ATRACCIONES||[],S=selDe(ctx,cid),days=diasCiudad(ctx,cid),R=ritDe(ctx,cid),cc=colDe(ctx,cid),sin=((W.sinLugar||{})[cid]||[]).map(i=>At.find(a=>a.id===i)).filter(Boolean);
  const pr=W.prog[cid],A=atrDe(ctx,cid),need=pr.flat().reduce((t,i)=>t+(A[i]?A[i].h+0.3:0),0),avail=days.reduce((t,x)=>t+(x.first?Math.min(3,R.cap):R.cap),0),over=sin.length>0;
  const dia=a=>{for(let i=0;i<pr.length;i++)if(pr[i].includes(a.id))return days[i]};
  const CI=M.CIUDAD;
  return `<div class="feas"><div class="fcard" style="--c:${cc}"><div style="display:flex;justify-content:space-between;gap:8px"><span><b>${ctx.esc(CI.n)} · ${days.length} ${days.length>1?"días":"día"}</b><br><small class="muted" style="font-size:13px">Ritmo ${R.n.toLowerCase()} · se cambia en <a href="#" data-gotab="cfg">Configurar</a></small></span><span class="num muted" style="font-size:13px;white-space:nowrap">${need.toFixed(1)} / ${avail.toFixed(1)} h</span></div>
   <div class="meter"><span style="width:${Math.min(100,need/Math.max(avail,0.1)*100)}%;background:var(${over?"--bad":"--ok"})"></span></div>
   <span class="status ${over?"bad":"ok"}">${over?`No alcanza: faltan ${sin.length} actividad(es) → ritmo intenso, más noches o quitar otras`:"✓ Todo cabe"}</span>
   ${over?`<span class="eyebrow" style="margin-top:6px">No caben ahora</span>`+sin.map(a=>`<label class="chk" style="--c:var(--bad)"><input type="checkbox" data-psel="${cid}|${a.id}" checked><span class="t">${ctx.esc(a.n)}<small>~${num1(a.h)} h</small></span></label>`).join(""):""}
   <span class="eyebrow" style="margin-top:6px">Agregar o quitar actividades</span>
   <details class="pool" data-poolc="${cid}"${P.pool[cid]?" open":""}><summary>Atracciones de ${ctx.esc(short(CI.n))} <span class="poolcnt">(${S.size} de ${At.length})</span></summary>${At.map(a=>{const on=S.has(a.id),dd=dia(a),pin=(W.pin||{})[a.id];
     return `<div class="poolrow${on?" on":""}"><label class="chk"><input type="checkbox" data-psel="${cid}|${a.id}" ${on?"checked":""}><span class="t">${ctx.esc(a.n)}${a.top?'<span class="top">★ imperdible</span>':""}${a.in?' 🏛':""}<small>~${num1(a.h)} h · ${a.p?FM(a.p):"gratis"}${a.u?` · <a href="${ctx.esc(a.u)}" target="_blank" rel="noopener">sitio</a>`:""}</small></span></label>${on?`<select class="daysel poolday" data-papin="${cid}|${a.id}" aria-label="Día"><option value="">📅 día automático</option>${days.map(x=>`<option value="${x.i}" ${pin===x.i?"selected":""}>${diaTxt(ctx,x)}</option>`).join("")}</select>`:""}${on?`<small class="pdst${dd?"":" bad"}">${dd?`✔ ${diaTxt(ctx,dd)} · ${pin!=null?"día fijado":"día automático"} · <a href="#" data-goday="${dd.id}">ver el día →</a>`:"⚠ No cabe en el programa: elige otro día o ritmo intenso"}</small>`:""}</div>`}).join("")||'<p class="muted">Esta ciudad aún no tiene atracciones precargadas.</p>'}</details>
   <button type="button" class="btn alt sm clrcity" data-clrcity="${cid}">Reformatear ${ctx.esc(short(CI.n))}: quitar todas las actividades</button></div></div>`}

// ---------- calendario del viaje
function tripCal(ctx){if(!P.cal||!ctx.fechas())return "";const W=ctx.W,days=todosDias(ctx);if(!days.length)return "";
  const Mx={};days.forEach(x=>{const S=planDe(ctx,x),CI=ctx.M[x.cid].CIUDAD;Mx[x.d]={k:"c",c:colDe(ctx,x.cid),id:x.id,lab:short(CI.n),tr:x.kind==="go",acts:(S?S.seq:[]).map(a=>({t:a.st,n:a.n}))}});
  const ini=days[0].d,fin=days[days.length-1].d,today=iso(new Date());let s="";const d0=D(ini),end=D(fin);let y=d0.getFullYear(),m=d0.getMonth();
  while(new Date(y,m,1)<=end){const lead=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate();
    s+=`<div class="tc-month"><h4>${MONL[m]} ${y}</h4><div class="tc-grid">${["L","M","M","J","V","S","D"].map(h=>`<span class="tc-h">${h}</span>`).join("")}${"<span></span>".repeat(lead)}`;
    for(let dd=1;dd<=dim;dd++){const ds=iso(new Date(y,m,dd)),X=Mx[ds];
      if(!X){s+=`<span class="tc-c off">${dd}</span>`;continue}
      const n=X.acts.length;
      s+=`<div class="tc-c ${X.k}${X.tr?" trv":""}${ds===today?" today":""}${P.pop===ds?" pop":""}" style="--c:${X.c}"><button type="button" class="tc-d" data-calgo="${X.id}" title="${ctx.esc(X.lab)}" aria-label="${ctx.pretty(ds)} · ${ctx.esc(X.lab)} · ir al día">${dd}</button>${n?`<button type="button" class="tc-n" data-calpop="${ds}" aria-label="${n} actividad${n>1?"es":""} el ${ctx.pretty(ds)}">${n}</button>`:""}</div>`}
    s+=`</div></div>`;m++;if(m>11){m=0;y++}}
  const Q=P.pop&&Mx[P.pop];
  return `<div class="calov"><div class="calsheet tcal" role="dialog" aria-modal="true" aria-label="Calendario del viaje"><span class="clip big" aria-hidden="true"></span>
   <div class="ms-head"><div><span class="eyebrow">${ctx.pretty(ini)} → ${ctx.pretty(fin)}</span><h3>Calendario del viaje</h3></div><button type="button" class="ms-x lnkb" data-calclose aria-label="Cerrar calendario">✕</button></div>
   <div class="tc-leg">${ctx.ids.map(c=>`<span><i style="--c:${colDe(ctx,c)}"></i>${ctx.esc(short(ctx.M[c].CIUDAD.n))}</span>`).join("")}<span><i class="trk"></i>Día de viaje</span><span><b class="tc-nb">3</b> actividades</span></div>
   <div class="tc-months">${s}</div>
   ${Q?`<div class="tc-pop"><div class="tc-ph"><b>${ctx.pretty(P.pop)} · ${ctx.esc(Q.lab)}</b><button type="button" class="ms-x sm" data-calpop="" aria-label="Cerrar lista">✕</button></div><ul>${Q.acts.map(a=>`<li><span class="num">${hm(a.t)}</span> ${ctx.esc(a.n)}</li>`).join("")}</ul><button type="button" class="btn sm" data-calgo="${Q.id}">Ir a este día →</button></div>`:`<p class="muted tc-hint">Toca un día para abrirlo en el programa · toca el número para ver sus actividades.</p>`}
  </div></div>`}

// ---------- plano ampliado
function mapOverlay(ctx){if(!P.map)return "";const day=todosDias(ctx).find(x=>x.id===P.map),S=day&&planDe(ctx,day);if(!S)return "";
  const CI=ctx.M[day.cid].CIUDAD,legs=S.legs,box=l=>l.metro?`<br><span class="lg-tr subway">Ⓜ Transporte público · ~${l.min} min (${l.d.toFixed(1).replace(".",",")} km) · <a href="${trUrl(l.from,l.to,1)}" target="_blank" rel="noopener">ver línea y estaciones</a></span>`:"",back=legs[legs.length-1];
  return `<div class="mapov on" data-mclose="1"><div class="mapsheet" role="dialog" aria-label="Recorrido del día"><span class="clip big" aria-hidden="true"></span>
   <div class="ms-head"><span class="eyebrow">${diaTxt(ctx,day)} · ${ctx.esc(short(CI.n))}</span><h3>Recorrido del día</h3><button type="button" class="ms-x lnkb" data-mclose="1" aria-label="Cerrar" style="text-decoration:none">✕</button></div>
   <div class="lmap big" data-lday="${day.id}" data-big="1"></div>
   <div class="ms-leg"><span><i class="k"></i>a pie</span><span><i class="k tr" style="border-top-color:#24477a"></i>transporte público</span><span><i class="k h">H</i>alojamiento</span><span><i class="hz"></i>zona de precaución</span></div>
   <ol class="ms-list"><li><span class="anum h num">H</span> ${ctx.esc((ctx.W.alo||{})[day.cid]&&ctx.W.alo[day.cid].n||"Alojamiento en "+short(CI.n))}</li>
   ${S.seq.map((a,k)=>`<li><span class="anum num">${k+1}</span> <span class="num">${hm(a.st)}</span> ${a.top?"★ ":""}${ctx.esc(a.n)}${box(legs[k])}</li>`).join("")}
   <li><span class="anum h num">H</span> Vuelta al alojamiento${back.metro?box(back):` · a pie ~${back.min} min`}</li></ol></div></div>`}

function planDe(ctx,day){const ids=((ctx.W.prog||{})[day.cid]||[])[day.i];if(!ids)return null;const A=atrDe(ctx,day.cid),acts=ids.map(i=>A[i]).filter(Boolean);
  const S=sequence(ctx,acts,day,baseDe(ctx,day.cid),true);S.legs=legsOf(ctx,S);return S}

// ---------- vista principal
export function programa(ctx){
  ML.forEach(m=>{try{m.remove()}catch(e){}});ML=[];
  if(!ctx.ids.length)return `<div class="card"><p>Completa la ruta en <b>1 · Configurar</b>.</p></div>`;
  const cid=ctx.ids.includes(SUB.c)?SUB.c:ctx.ids[0];SUB.c=cid;
  ctx.ids.forEach(c=>asegurar(ctx,c));
  const ds=diasCiudad(ctx,cid);if(!P.day[cid]||!ds.some(x=>x.id===P.day[cid]))P.day[cid]=ds[0].id;
  const all=todosDias(ctx),W=ctx.W,cc=colDe(ctx,cid);
  const tabs=`<div class="daytabs" id="daytabs" role="tablist" aria-label="Ciudad">${ctx.fechas()?`<button type="button" role="tab" class="dtab calopen" style="--c:var(--ink)" data-calopen aria-label="Abrir calendario del viaje"><b>${IC.cal} Cal</b><small>del viaje</small></button>`:""}${ctx.ids.map(c=>{const cd=diasCiudad(ctx,c),a=cd[0],b=cd[cd.length-1];return `<button type="button" role="tab" class="dtab" style="--c:${colDe(ctx,c)}" data-dtab="${c}" aria-selected="${c===cid}"><b>${ctx.esc(short(ctx.M[c].CIUDAD.n))}</b><small>${a.d?ctx.pretty(a.d)+(b!==a?" – "+ctx.pretty(b.d):"")+" · ":""}${cd.length} ${cd.length>1?"días":"día"}</small></button>`}).join("")}</div>`;
  const org=`<div class="orgbar"><span class="eyebrow">Organizar</span><button type="button" class="orgb" data-orgrun="${cid}" title="Repartir las atracciones elegidas por días, agrupando por cercanía y ritmo"><span>🧭</span>Reorganizar</button><button type="button" class="orgb" data-gotab="att" title="Elegir atracciones"><span>🏛</span>Elegir atracciones</button><button type="button" class="orgb clr" data-clrcity="${cid}" title="Quitar todas las actividades"><span>🗑</span>Vaciar</button></div>`;
  const chips=`<div class="dchipw" style="--cc:${cc}"><div class="dchips">${ds.map(d=>{const q=(d.d?ctx.pretty(d.d):"Día "+(d.g+1)).split(" "),tg=d.kind==="first"||d.kind==="go"?"llegada":d.d?q[2]||"":"";
    return `<button type="button" class="dchip" data-dchip="${d.id}" aria-pressed="${d.id===P.day[cid]}"><i>${d.d?q[0]:"día"}</i><b>${d.d?q[1]:d.g+1}</b><small>${tg}</small></button>`}).join("")}</div></div>`;
  const days=all.map(d=>{const S=planDe(ctx,d);const sel=d.cid===cid&&d.id===P.day[cid];
    return dayHTML(ctx,d,S).replace(/<article class="day"([^>]*)>/,(m,a)=>`<article class="day${sel?" sel":""}"${d.cid===cid?"":" hidden"}${a}>`)}).join("");
  return `${fcard(ctx,cid)}${tabs}${org}${chips}<div class="days" id="days">${days}</div>${tripCal(ctx)}${mapOverlay(ctx)}`}

// ---------- mapas MapLibre (plano del día)
const circ=(c,r)=>{const o=[];for(let i=0;i<=24;i++){const a=i/24*2*Math.PI;o.push([c[1]+r/111320/Math.cos(c[0]*Math.PI/180)*Math.cos(a),c[0]+r/110574*Math.sin(a)])}return o};
const hatchImg=()=>{const c=document.createElement("canvas");c.width=c.height=12;const x=c.getContext("2d");x.fillStyle="rgba(179,38,30,.08)";x.fillRect(0,0,12,12);x.strokeStyle="rgba(179,38,30,.55)";x.lineWidth=2.5;x.beginPath();x.moveTo(-3,15);x.lineTo(15,-3);x.moveTo(-9,9);x.lineTo(9,-9);x.moveTo(3,21);x.lineTo(21,3);x.stroke();return x.getImageData(0,0,12,12)};
function mlMap(ctx,el,day,big){const S=planDe(ctx,day);if(!S||!S.seq.length)return;const base=S.base,legs=S.legs.filter(l=>!l.noloc),pts=[base,...S.seq.filter(a=>!a.noloc).map(a=>a.ll)];
  const m=new maplibregl.Map({container:el,style:mlStyle(),interactive:big,attributionControl:big?{compact:true,customAttribution:"© OpenFreeMap · © OpenStreetMap"}:false,
    bounds:[[Math.min(...pts.map(x=>x[1])),Math.min(...pts.map(x=>x[0]))],[Math.max(...pts.map(x=>x[1])),Math.max(...pts.map(x=>x[0]))]],fitBoundsOptions:{padding:big?{top:50,bottom:50,left:40,right:140}:24,maxZoom:16}});
  el._m=m;ML.push(m);if(big){m.addControl(new maplibregl.NavigationControl({showCompass:false}),"top-left");m.scrollZoom.disable()}
  const mk=(ll,html,lab)=>{const w=document.createElement("div");w.className="mlmk";w.innerHTML=html+(lab?`<span class="mllab">${ctx.esc(lab)}</span>`:"");new maplibregl.Marker({element:w,anchor:"left",offset:[big?-15:-11,0]}).setLngLat([ll[1],ll[0]]).addTo(m)};
  m.on("load",()=>{el.querySelectorAll(".maplibregl-compact-show").forEach(x=>x.classList.remove("maplibregl-compact-show"));
    const zs=zonasCerca(ctx,day.cid,pts);
    if(zs.length){m.addImage("hatch",hatchImg());m.addSource("hz",{type:"geojson",data:{type:"FeatureCollection",features:zs.map(z=>({type:"Feature",properties:{n:z.n},geometry:{type:"Polygon",coordinates:[circ(z.ll,z.r)]}}))}});
      m.addLayer({id:"hz",type:"fill",source:"hz",paint:{"fill-pattern":"hatch"}});m.addLayer({id:"hz-l",type:"line",source:"hz",paint:{"line-color":"#b3261e","line-width":1.4,"line-dasharray":[3,2]}})}
    const feat=l=>({type:"Feature",properties:{k:l.k},geometry:{type:"LineString",coordinates:[[l.from[1],l.from[0]],[l.to[1],l.to[0]]]}});
    m.addSource("met",{type:"geojson",data:{type:"FeatureCollection",features:legs.filter(l=>l.metro).map(feat)}});
    m.addLayer({id:"met",type:"line",source:"met",layout:{"line-cap":"round"},paint:{"line-color":"#24477a","line-width":big?4:3,"line-dasharray":[2.5,1.4],"line-opacity":.9}});
    m.addSource("walk",{type:"geojson",data:{type:"FeatureCollection",features:legs.filter(l=>!l.metro).map(feat)}});
    m.addLayer({id:"walk-h",type:"line",source:"walk",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#fffdf5","line-width":big?6:4.5,"line-opacity":.85}});
    m.addLayer({id:"walk",type:"line",source:"walk",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#2a2620","line-width":big?3:2.4,"line-dasharray":[0.2,2]}})});
  mk(base,'<div class="lm-h">H</div>',big?"Alojamiento":"");
  S.seq.forEach((a,k)=>!a.noloc&&mk(a.ll,`<div class="lm-a${a.top?" top":""}${big?" big":""}">${k+1}</div>`,big?(a.top?"★ ":"")+a.n.replace(/\s*\(.*?\)/,""):""))}
function initMaps(ctx){if(!window.maplibregl)return;const all=todosDias(ctx);
  document.querySelectorAll(".lmap[data-lday]").forEach(el=>{if(el._m||!el.offsetParent)return;const d=all.find(x=>x.id===el.dataset.lday);if(!d)return;try{el.classList.add("ml");mlMap(ctx,el,d,!!el.dataset.big)}catch(e){console.warn("mapa",e);el.classList.remove("ml")}})}

// ---------- eventos
export function bindPrograma(ctx){const W=ctx.W,Q=(s,f)=>document.querySelectorAll(s).forEach(f),R=()=>{ctx.guardar();ctx.render()};
  const cidAct=SUB.c;
  Q("details[data-poolc]",d=>d.ontoggle=()=>{P.pool[d.dataset.poolc]=d.open});
  Q("[data-dtab]",b=>b.onclick=()=>{SUB.c=b.dataset.dtab;ctx.render()});
  Q("[data-dchip]",b=>b.onclick=()=>{P.day[cidAct]=b.dataset.dchip;ctx.render();const dv=document.querySelector(`#days > .day[data-day="${b.dataset.dchip}"]`);if(dv)dayScroll(dv)});
  Q("[data-calopen]",b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();P.cal=true;P.pop=null;ctx.render()});
  Q("[data-calclose]",b=>b.onclick=()=>{P.cal=false;P.pop=null;ctx.render()});
  const co=document.querySelector(".calov");if(co)co.onclick=e=>{if(e.target===co){P.cal=false;P.pop=null;ctx.render()}};
  Q("[data-calpop]",b=>b.onclick=e=>{e.stopPropagation();const v=b.dataset.calpop||null;P.pop=P.pop===v?null:v;ctx.render()});
  Q("[data-calgo]",b=>b.onclick=()=>goDay(ctx,b.dataset.calgo));
  Q("[data-goday]",b=>b.onclick=e=>{e.preventDefault();goDay(ctx,b.dataset.goday)});
  Q("[data-legend]",b=>b.onclick=()=>{P.leg=!P.leg;ctx.render()});
  Q("[data-totop]",b=>b.onclick=()=>scrollTo({top:0,behavior:"smooth"}));
  Q("[data-gotab]",b=>b.onclick=e=>{e.preventDefault();ctx.ir(b.dataset.gotab)});
  Q(".blk-com > h4, .blk-tr > h4",h=>h.onclick=()=>{const b=h.parentNode;b.classList.toggle("open");const k=b.closest(".day").dataset.day+"|"+(b.classList.contains("blk-com")?"com":"tr");b.classList.contains("open")?P.open.add(k):P.open.delete(k)});
  Q(".actrow2:not(.lite) .ar-top",t=>t.onclick=e=>{if(e.target.closest("button,a,select,input"))return;const r=t.closest(".actrow2"),k=r.closest(".day").dataset.day+"|"+r.dataset.k;r.classList.toggle("open");r.classList.contains("open")?P.open.add(k):P.open.delete(k)});
  Q("[data-pmv]",b=>b.onclick=()=>{const [did,aid,dir]=b.dataset.pmv.split("|"),[cid,i]=did.split(":"),arr=W.prog[cid][+i],j=arr.indexOf(aid),k=j+(+dir);if(k<0||k>=arr.length)return;[arr[j],arr[k]]=[arr[k],arr[j]];R()});
  Q("[data-rm]",b=>b.onclick=()=>{const [did,aid]=b.dataset.rm.split("|"),cid=did.split(":")[0];quitarDe(ctx,cid,aid);W.sel[cid]=(W.sel[cid]||[]).filter(x=>x!==aid);if(W.pin)delete W.pin[aid];R()});
  Q("[data-papin]",s=>s.onchange=()=>{const [cid,aid]=s.dataset.papin.split("|");W.pin=W.pin||{};
    if(s.value==="")delete W.pin[aid];else{W.pin[aid]=+s.value;if(W.prog&&W.prog[cid])enlazar(ctx,cid,aid,+s.value)}R()});
  Q("[data-psel]",c=>c.onchange=()=>{const [cid,aid]=c.dataset.psel.split("|"),S=selDe(ctx,cid);
    if(c.checked){S.add(aid);W.sel[cid]=[...S];const a=(ctx.M[cid].ATRACCIONES||[]).find(x=>x.id===aid);const pin=(W.pin||{})[aid];enlazar(ctx,cid,aid,pin!=null?pin:menosCargado(ctx,cid,a));if(W.sinLugar)W.sinLugar[cid]=(W.sinLugar[cid]||[]).filter(x=>x!==aid)}
    else{S.delete(aid);W.sel[cid]=[...S];quitarDe(ctx,cid,aid);if(W.sinLugar)W.sinLugar[cid]=(W.sinLugar[cid]||[]).filter(x=>x!==aid)}R()});
  Q("[data-orgrun]",b=>b.onclick=()=>{organizarCiudad(ctx,b.dataset.orgrun);R()});
  Q("[data-clrcity]",b=>b.onclick=()=>{vaciarCiudad(ctx,b.dataset.clrcity);R()});
  Q("[data-addday]",b=>b.onclick=()=>{P.add=P.add===b.dataset.addday?null:b.dataset.addday;ctx.render()});
  Q("[data-addto]",b=>b.onclick=()=>{const [did,aid]=b.dataset.addto.split("|"),[cid,i]=did.split(":"),S=selDe(ctx,cid);S.add(aid);W.sel[cid]=[...S];enlazar(ctx,cid,aid,+i);if(W.sinLugar)W.sinLugar[cid]=(W.sinLugar[cid]||[]).filter(x=>x!==aid);R()});
  Q("form[data-perform]",f=>f.onsubmit=e=>{e.preventDefault();crearActividad(ctx,f)});
  Q("[data-clrday]",b=>b.onclick=()=>{const [cid,i]=b.dataset.clrday.split(":");const ids=W.prog[cid][+i].slice();W.sel[cid]=(W.sel[cid]||[]).filter(x=>!ids.includes(x));W.prog[cid][+i]=[];R()});
  Q("[data-meal]",c=>c.onchange=()=>{W.meal=W.meal||{};W.meal[c.dataset.meal]=c.checked?1:0;R()});
  Q("[data-mopt]",s=>s.onchange=()=>{W.mealOpt=W.mealOpt||{};W.mealOpt[s.dataset.mopt]=+s.value;R()});
  Q("[data-dmap]",b=>{b.onclick=()=>{P.map=b.dataset.dmap;ctx.render()};b.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();b.click()}}});
  Q("[data-mclose]",b=>b.onclick=e=>{if(e.target!==b&&!b.classList.contains("ms-x"))return;P.map=null;ctx.render()});
  if(!window._pgEsc){window._pgEsc=1;addEventListener("keydown",e=>{if(e.key==="Escape"&&(P.cal||P.map)){P.cal=false;P.pop=null;P.map=null;ctx.render()}})}
  document.body.style.overflow=(P.cal||P.map)?"hidden":"";
  setTimeout(()=>initMaps(ctx),0)}
function enlazar(ctx,cid,aid,i){ctx.W.prog=ctx.W.prog||{};const pr=ctx.W.prog[cid]=ctx.W.prog[cid]||diasCiudad(ctx,cid).map(()=>[]);while(pr.length<=i)pr.push([]);enDia(ctx,cid,aid,i)}
function goDay(ctx,id){const d=todosDias(ctx).find(x=>x.id===id);if(!d)return;P.cal=false;P.pop=null;SUB.c=d.cid;P.day[d.cid]=id;ctx.render();
  setTimeout(()=>{const dv=document.querySelector(`#days > .day[data-day="${id}"]`);if(dv)dayScroll(dv)},80)}
function dayScroll(dv){const ch=document.querySelector(".dchipw"),cb=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--cabH"))||0;scrollTo({top:dv.getBoundingClientRect().top+scrollY-cb-(ch&&ch.offsetHeight||0)-6,behavior:"smooth"})}

// Marca o desmarca una atracción desde otra pestaña (Atracciones): si el programa de la ciudad ya existe, la coloca o la quita del día.
export function alternarAtr(ctx,cid,aid,on){const W=ctx.W,S=selDe(ctx,cid);
  if(on){S.add(aid);W.sel[cid]=[...S];if(W.prog&&W.prog[cid]){const a=(ctx.M[cid].ATRACCIONES||[]).find(x=>x.id===aid),pin=(W.pin||{})[aid];enlazar(ctx,cid,aid,pin!=null?pin:menosCargado(ctx,cid,a))}}
  else{S.delete(aid);W.sel[cid]=[...S];if(W.prog&&W.prog[cid])quitarDe(ctx,cid,aid)}
  if(W.sinLugar)W.sinLugar[cid]=(W.sinLugar[cid]||[]).filter(x=>x!==aid)}
// Presupuesto por día (por persona) de todo el viaje, para Gastos.
export function costosDias(ctx){ctx.ids.forEach(c=>asegurar(ctx,c));return todosDias(ctx).map(d=>({d,c:costOf(ctx,d,planDe(ctx,d))}))}
