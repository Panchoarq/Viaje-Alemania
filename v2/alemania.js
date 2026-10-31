// Página del viaje a Alemania sobre el módulo genérico (city.js). No toca Firebase: guarda en localStorage.
// Los valores confirmados (CONFIRMADO) son el punto de partida; todo se puede editar y se puede volver a ellos.
import {TRIP} from "./trips/alemania.js";
import {CONFIRMADO} from "./trips/alemania.confirmado.js";
import {HOTELS,ACTS,LOCAL,ATTR,CTX,MEDIA,WHY,PHOTO,ZONES,FOOD,FOODOPT,CONSENT} from "./trips/alemania.data.js";
import {pretty,add,D,fmtH,money,tramosDe,diasDe,organizar,stayTotal} from "./city.js";
import {mapaDia} from "./mapa.js";

const $=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LS=TRIP.ls+"_estado",N=TRIP.people,CN=c=>TRIP.cities[c].n;
const clone=o=>JSON.parse(JSON.stringify(o));
const FB={apiKey:"AIzaSyBJefyy5hhRQHK4EWbmZFC15h2Fgb55w68",authDomain:"viaje-a-alemania-60001.firebaseapp.com",projectId:"viaje-a-alemania-60001",storageBucket:"viaje-a-alemania-60001.firebasestorage.app",messagingSenderId:"1061928899634",appId:"1:1061928899634:web:d5ffc52cb53edebe71182b"};
// Con ?demo (o abierto como archivo) guarda solo en este navegador; si no, en Firestore (trips/alemania) con Google.
const DEMO=location.protocol==="file:"||new URLSearchParams(location.search).has("demo");
const CAMPOS=["cfg","hotel","roomMode","prices","trenes","acts","dayPin","lock","mealOpt","foodMode","mealOn","buy"]; // lo que se guarda
let ST=clone(CONFIRMADO),tab="cfg",city=ST.cfg.order[0],attCity=city,mapOpen=new Set(),focusFicha=null,user=null,ref=null,F=null,saveT=null;
try{tab=localStorage.getItem(TRIP.ls+"_tab")||tab;if(DEMO){const s=JSON.parse(localStorage.getItem(LS)||"null");if(s)ST=Object.assign(ST,s)}}catch(e){}
const ensure=()=>{ST.foodMode=ST.foodMode||"fast";ST.mealOn=ST.mealOn||{};ST.buy=ST.buy||{};ST.mealOpt=ST.mealOpt||{}};
const pick=d=>{const o={};CAMPOS.forEach(k=>{if(d&&d[k]!==undefined)o[k]=d[k]});return o};
function sync(t,cls){const s=$("#sync");if(!s)return;s.textContent=t;s.className="sync "+(cls||"");if(cls==="ok")setTimeout(()=>s.classList.add("hide"),2500)}
function save(){
  if(DEMO){try{localStorage.setItem(LS,JSON.stringify(ST))}catch(e){}sync("Guardado (demo local)","ok");return}
  if(!F||!ref||!user)return;
  clearTimeout(saveT);sync("Guardando…","busy");
  saveT=setTimeout(async()=>{try{await F.setDoc(ref,{...pick(ST),by:user.email,at:Date.now()});sync("☁ Guardado para todos","ok")}catch(e){sync("No se pudo guardar","ro")}},600)}
const go=t=>{tab=t;try{localStorage.setItem(TRIP.ls+"_tab",t)}catch(e){}render()};

// El contenido de ATTR/CTX/MEDIA es texto propio con <b>/<i> ya incluido: se inserta sin escapar.
// ---- datos derivados ----
const HOTEL_BY=Object.fromEntries(Object.values(HOTELS).flat().map(h=>[h.id,h]));
const hotelOf=c=>HOTEL_BY[ST.hotel[c]];
const precio=(tabla,id,def)=>ST.prices[tabla]&&ST.prices[tabla][id]!=null?ST.prices[tabla][id]:def;
const roomP=h=>precio("roomPrice",h.id,h.room),bfP=h=>precio("bfPrice",h.id,h.bf||0);
const isConf=k=>!!(ST.prices.verified||{})[k];
const defSel=(c,i)=>{const a=ACTS[c][i];return !!(a.pr||((c==="H"||c==="B")&&a.top&&!a.full&&a.h<=1.5&&!/Fischmarkt/.test(a.n)))};
const sel=(c,i)=>{const k=c+":"+i;return k in ST.acts?!!ST.acts[k]:defSel(c,i)};
const tramos=()=>tramosDe(ST.cfg);
const legDe=(a,b)=>ST.trenes[a+">"+b]||null;
const legEst=(a,b)=>{const L=ST.prices.legPrice;return L[a+"-"+b]??L[b+"-"+a]??0};
const legPP=(a,b)=>{const l=legDe(a,b);return l&&l.price!=null?l.price:legEst(a,b)};

function planDe(tr,ult){
  const acts=ACTS[tr.k].map((a,i)=>({...a,key:tr.k+":"+i,i})).filter(a=>sel(tr.k,a.i)).map(a=>{const p=ST.dayPin[a.key];return {...a,pin:p&&p>=tr.ini&&p<=tr.fin?p:null}});
  const h=hotelOf(tr.k);
  return organizar(diasDe(tr,ult),acts,{base:h&&h.ll});
}

const MEAL_LBL={d:"Desayuno",a:"Almuerzo",m:"Media tarde",c:"Cena"};
// Comidas de un día: desayuno del hotel donde se durmió; media tarde del hotel si ofrece colación; el resto de la guía.
function comidasDia(tr,day,ix,T){
  const dormi=day.first&&ix?T[ix-1].k:tr.k;
  return ["d","a","m","c"].map(k=>{
    const city=k==="d"?dormi:tr.k,h=hotelOf(city),hotelM=k==="m"&&h&&h.lunch!=null;
    const base=k==="d"?[h?bfP(h):0,"Desayuno "+(h?h.name:"")]:hotelM?[precio("lunchPrice",h.id,h.lunch),"Colación empacada "+h.name]:FOOD[ST.foodMode][tr.k][k];
    const opts=(FOODOPT[city]||{})[k]||[],i=ST.mealOpt[day.d+"|"+k];
    let pr=base[0],txt=base[1];if(i!=null&&opts[i]){pr=opts[i][1];txt=opts[i][0]+(opts[i][2]?" · "+opts[i][2]:"")}
    const key=day.d+"|"+k,def=!((day.first&&ix===0&&k==="d")||(day.last&&k==="c")),on=key in ST.mealOn?!!ST.mealOn[key]:def;
    return {k,key,pr,txt,on,opts,sel:i,hotelM};
  })}
function costos(){
  const T=tramos(),o={hot:0,des:0,alm:0,act:0,tre:0,loc:0,por:[]};
  T.forEach((tr,ix)=>{
    const h=hotelOf(tr.k),n=tr.noches;
    const hot=h?stayTotal(roomP(h),ST.roomMode[h.id]||"n",n):0;
    const P=planDe(tr,ix===T.length-1);
    let des=0,alm=0;P.plan.forEach(d=>comidasDia(tr,d,ix,T).forEach(m=>{if(m.on){if(m.k==="d")des+=m.pr*N;else alm+=m.pr*N}}));const act=P.plan.reduce((s,d)=>s+d.acts.reduce((t,a)=>t+(a.p||0),0),0)*N;
    const loc=((LOCAL[tr.k]||{}).v||0)*P.plan.filter(d=>d.acts.length).length;
    const tre=ix?legPP(T[ix-1].k,tr.k)*N:0;
    o.por.push({k:tr.k,hot,des,alm,act,loc,tre});
    o.hot+=hot;o.des+=des;o.alm+=alm;o.act+=act;o.loc+=loc;o.tre+=tre});
  o.total=o.hot+o.des+o.alm+o.act+o.tre+o.loc;return o;
}

// ---- vistas ----
const tabsDef=[["cfg","1 · Configurar"],["prog","2 · Programa"],["att","3 · Atracciones"],["com","4 · Comidas"],["hot","5 · Alojamiento"],["tre","6 · Pasajes"],["buy","7 · Trámites previos"],["cos","8 · Costos"]];

function header(){const T=tramos(),a=T[0].ini,b=T[T.length-1].fin;
  return `<header><span class="eyebrow">${N} viajeros · 16 años · ${esc(pretty(a))} – ${esc(pretty(b))} ${D(b).getFullYear()}</span><h1>${esc(TRIP.title)}</h1>
  <div class="route">${T.map(t=>`<span class="stop ${t.k}">${TRIP.cities[t.k].p} ${esc(CN(t.k))} · ${t.noches} n</span>`).join('<span class="arrow">→</span>')}</div></header>`}

function calHTML(){const T=tramos(),M={};
  T.forEach((tr,ix)=>planDe(tr,ix===T.length-1).plan.forEach(d=>{M[d.d]={k:tr.k,c:TRIP.colors[tr.k],tr:d.first&&ix>0,n:d.acts.length,lab:CN(tr.k)}}));
  const ini=T[0].ini,fin=T[T.length-1].fin,MONL=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  let s="",d0=D(ini),end=D(fin),y=d0.getFullYear(),m=d0.getMonth();
  while(new Date(y,m,1)<=end){const lead=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate();
    s+=`<div class="tc-month"><h4>${MONL[m]} ${y}</h4><div class="tc-grid">${["L","M","M","J","V","S","D"].map(h=>`<span class="tc-h">${h}</span>`).join("")}${"<span></span>".repeat(lead)}`;
    for(let dd=1;dd<=dim;dd++){const ds=y+"-"+String(m+1).padStart(2,"0")+"-"+String(dd).padStart(2,"0"),X=M[ds];
      if(!X){s+=`<span class="tc-c off">${dd}</span>`;continue}
      s+=`<div class="tc-c ${X.k}${X.tr?" trv":""}" style="--c:${X.c}"><button type="button" class="tc-d" data-calgo="${X.k}|${ds}" title="${esc(X.lab)}" aria-label="${esc(pretty(ds))} · ${esc(X.lab)} · ir al día">${dd}</button>${X.n?`<span class="tc-n" aria-label="${X.n} actividades">${X.n}</span>`:""}</div>`}
    s+=`</div></div>`;m++;if(m>11){m=0;y++}}
  return `<div class="calsheet tcal"><span class="clip big" aria-hidden="true"></span><div class="ms-head"><div><span class="eyebrow">${esc(pretty(ini))} → ${esc(pretty(fin))}</span><h3>Calendario del viaje</h3></div></div>
   <div class="tc-leg">${T.map(t=>`<span><i style="--c:${TRIP.colors[t.k]}"></i>${esc(CN(t.k))}</span>`).join("")}<span><i class="trk"></i>Día de viaje</span><span><b class="tc-nb">3</b> actividades</span></div>
   <div class="tc-months">${s}</div><p class="muted tc-hint">Toca un día para abrirlo en el programa.</p></div>`}
function pCfg(){const T=tramos();
  return `<section class="panel"><div class="note">Los alojamientos, días y trenes vienen confirmados; puedes editarlos y volver a los confirmados cuando quieras.</div>
  <label class="field"><span>Inicio del viaje</span><input type="date" data-start value="${ST.cfg.start}"></label>
  <div class="tbl-wrap"><table class="ftbl"><thead><tr><th>#</th><th>Ciudad</th><th>Noches</th><th>Llega</th><th>Sale</th><th>Orden</th></tr></thead><tbody>
  ${T.map((t,i)=>`<tr><td>${i+1}</td><td><b>${TRIP.cities[t.k].p} ${esc(CN(t.k))}</b></td>
   <td><input type="number" min="1" max="10" data-noches="${t.k}" value="${t.noches}" style="width:4em"></td><td>${esc(pretty(t.ini))}</td><td>${esc(pretty(t.fin))}</td>
   <td><button type="button" class="btn alt sm" data-mv="${t.k}|-1" ${i?"":"disabled"} aria-label="Subir">↑</button> <button type="button" class="btn alt sm" data-mv="${t.k}|1" ${i<T.length-1?"":"disabled"} aria-label="Bajar">↓</button></td></tr>`).join("")}
  </tbody></table></div>
  <div><button type="button" class="btn alt" data-reset="1">Volver a lo confirmado</button></div>${calHTML()}</section>`}

function legCard(a,b){const l=legDe(a,b);
  return `<div class="legcard"><div><span class="eyebrow">Día de viaje · ${esc(CN(a))} → ${esc(CN(b))}</span></div>
  ${l?`<p><b>${esc(l.train)}</b> · ${esc(l.dep)} → ${esc(l.arr)} · ${esc(l.from)} → ${esc(l.to)}${l.stops?` · ${esc(l.stops)}`:""}</p>
   <p class="muted">${money(l.price,1)} por persona · ${money(l.price*N,1)} los ${N}</p>`
   :`<p class="muted">Tren por definir · estimado ${money(legEst(a,b),1)} por persona</p>`}</div>`}

function dayHTML(d,tr,ix,T){
  const h=hotelOf(tr.k);
  return `<article class="day" style="--c:${TRIP.colors[tr.k]}"><div class="dtabrow"><span class="dftab"><b>${esc(pretty(d.d))}</b><span class="fc">${esc(CN(tr.k))}</span></span></div>
  ${d.first&&ix?legCard(T[ix-1].k,tr.k):""}
  ${d.first&&!ix?`<p class="muted">Llegada a ${esc(CN(tr.k))}.</p>`:""}
  ${d.seq.length?`<ol class="seq">${d.seq.map(a=>`<li><span class="num">${fmtH(a.st)}</span> ${ATTR[a.key]?`<a href="#" class="lnkb" data-ficha="${a.key}"><b>${esc(a.n)}</b></a>`:`<b>${esc(a.n)}</b>`} <span class="muted">~${a.full?"día completo":a.h+" h"}${a.p?` · ${money(a.p,1)} p/p`:" · gratis"}</span>${a.note?`<br><small class="muted">${esc(a.note)}</small>`:""}${(WHY[tr.k]||[])[a.i]?`<br><small>${esc(WHY[tr.k][a.i])}</small>`:""}</li>`).join("")}</ol>`:`<p class="muted">${d.last?"Día de salida.":"Sin actividades este día."}</p>`}
  ${d.seq.some(a=>a.ll)?`<div><button type="button" class="btn alt sm" data-map="${d.d}|${tr.k}">${mapOpen.has(d.d+"|"+tr.k)?"Ocultar plano":"🗺 Plano del día"}</button></div>${mapOpen.has(d.d+"|"+tr.k)?`<div class="lmap big" data-lday="${d.d}|${tr.k}"></div>`:""}`:""}
  ${h?`<p class="muted">${d.last?"":`Noche en ${esc(h.name)}`}</p>`:""}</article>`}

function pProg(){const T=tramos();if(!T.some(t=>t.k===city))city=T[0].k;
  const ix=T.findIndex(t=>t.k===city),tr=T[ix],P=planDe(tr,ix===T.length-1);
  const pick=ACTS[tr.k].map((a,i)=>[a,i]);
  return `<section class="panel"><div class="tabs" role="tablist" aria-label="Ciudad">${T.map(t=>`<button type="button" role="tab" data-city="${t.k}" aria-selected="${t.k===city}">${TRIP.cities[t.k].p} ${esc(CN(t.k))}</button>`).join("")}</div>
  <p class="note">${esc(CN(tr.k))}: ${esc(pretty(tr.ini))} – ${esc(pretty(tr.fin))} · ${tr.noches} noches.${(LOCAL[tr.k]||{}).n?` ${esc(LOCAL[tr.k].n)}.`:""}</p>
  <div class="days">${P.plan.map(d=>dayHTML(d,tr,ix,T)).join("")}</div>
  ${P.sobran.length?`<p class="note bad">No caben en los días disponibles: ${P.sobran.map(a=>esc(a.n)).join(" · ")}. Quita alguna o agrega noches.</p>`:""}
  <details class="why"><summary>Elegir actividades de ${esc(CN(tr.k))} (${pick.filter(([a,i])=>sel(tr.k,i)).length} de ${pick.length})</summary>
  <ul class="picks">${pick.map(([a,i])=>`<li><label><input type="checkbox" data-act="${tr.k}:${i}" ${sel(tr.k,i)?"checked":""}> ${esc(a.n)} <span class="muted">· ${a.full?"día completo":a.h+" h"}${a.p?` · ${money(a.p,1)}`:" · gratis"}</span></label></li>`).join("")}</ul></details></section>`}

const tlSVG=tl=>{const W=720,H=96,pad=40,step=(W-2*pad)/(tl.length-1);
  let g=`<svg class="tlsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Línea de tiempo"><line x1="${pad}" y1="40" x2="${W-pad}" y2="40" stroke="currentColor" stroke-width="2"/>`;
  tl.forEach((e,i)=>{const x=pad+i*step;g+=`<circle cx="${x}" cy="40" r="6" fill="var(--stamp)"/><text x="${x}" y="24" text-anchor="middle" font-size="15" font-weight="700" fill="currentColor" font-family="Courier Prime,monospace">${esc(e[0])}</text><text x="${x}" y="66" text-anchor="middle" font-size="12.5" fill="currentColor">${esc(e[1])}</text>`});
  return g+"</svg>"};
function fichaHTML(c,i){const a=ACTS[c][i],x=ATTR[c+":"+i];if(!x)return"";const on=sel(c,i);
  return `<article class="ficha" id="f-${c}-${i}"><div class="ftab">EXP. ${c}-${String(i+1).padStart(2,"0")} · ${esc(CN(c)).toUpperCase()}</div>
   <header><h3>${esc(a.n.replace(/\s*\(.*?\)\s*$/,""))}</h3>${x.y?`<span class="fy">${esc(x.y)}</span>`:""}${a.top?'<span class="fstamp">★ IMPERDIBLE</span>':""}${on?'<span class="fstamp ok">EN EL PROGRAMA</span>':""}</header>
   <p class="flead">${x.s}</p>
   ${x.h&&x.h.length?`<div class="fhist"><span class="flab">Historia</span>${x.h.map(p=>`<p>${p}</p>`).join("")}</div>`:""}
   ${x.v?`<div><span class="flab">Qué van a ver</span><p>${x.v}</p></div>`:""}
   ${x.d?`<div class="fnote"><span class="flab">Dato / consejo</span><p>${x.d}</p></div>`:""}
   ${x.f&&x.f.length?`<div class="fphotos">${x.f.map(f=>`<a class="polaroid" href="${esc(f[1])}" target="_blank" rel="noopener"><span class="clip" aria-hidden="true"></span>${PHOTO[f[0]]?`<img class="ph" src="/${esc(PHOTO[f[0]][0])}" alt="${esc(f[0])}" loading="lazy">`:`<span class="ph">📷</span>`}<span class="cap">${esc(f[0])}</span><span class="go">más fotos →</span></a>`).join("")}</div><p class="credit">Fotos: Wikimedia Commons · ${x.f.filter(f=>PHOTO[f[0]]).map(f=>`<a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(PHOTO[f[0]][1].replace(/ /g,"_"))}" target="_blank" rel="noopener">${esc(PHOTO[f[0]][2])}</a>`).join(" · ")}</p>`:""}
   ${x.l&&x.l.length?`<div class="flinks">${x.l.map(l=>`<a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])} ↗</a>`).join("")}${a.ll?`<a href="https://www.google.com/maps/search/?api=1&query=${a.ll.join(",")}" target="_blank" rel="noopener">Mapa ↗</a>`:""}</div>`:""}</article>`}

function pAtt(){const T=tramos();if(!T.some(t=>t.k===attCity))attCity=T[0].k;const c=attCity,X=CTX[c];
  const ids=ACTS[c].map((a,i)=>i).filter(i=>ATTR[c+":"+i]);
  const full=ids.filter(i=>(ATTR[c+":"+i].h||[]).length),rest=ids.filter(i=>!(ATTR[c+":"+i].h||[]).length);
  full.sort((x,y)=>(sel(c,y)-sel(c,x))||((ACTS[c][y].top?1:0)-(ACTS[c][x].top?1:0)));
  return `<section class="panel"><div class="attbar" role="group" aria-label="Ciudad">${T.map(t=>`<button type="button" class="btn ${t.k===c?"":"alt"}" data-attc="${t.k}" aria-pressed="${t.k===c}">${esc(CN(t.k))}</button>`).join("")}</div>
  <section class="ctx card"><span class="eyebrow">Contexto histórico</span><h2>${esc(X.t)}</h2>${X.tl?tlSVG(X.tl):""}${X.p.map(p=>`<p>${p}</p>`).join("")}</section>
  <div class="fichas">${full.map(i=>fichaHTML(c,i)).join("")}</div>
  ${rest.length?`<div class="card"><span class="eyebrow">Otras, en breve</span><ul class="brief">${rest.map(i=>`<li><b>${esc(ACTS[c][i].n)}</b>: ${ATTR[c+":"+i].s}${ATTR[c+":"+i].d?" "+ATTR[c+":"+i].d:""}</li>`).join("")}</ul></div>`:""}
  ${(MEDIA[c]||[]).length?`<section class="card media"><span class="eyebrow">Para llegar sabiendo</span><h2>Películas y libros · ${esc(CN(c))}</h2><div class="mgrid">${MEDIA[c].map(m=>`<div class="mitem"><b>${esc(m[0])}</b>${m[3]?` <span class="tag">${esc(m[3])}</span>`:""}<small>${esc(m[1])}</small><p>${m[2]}</p></div>`).join("")}</div><p class="note">Las clasificaciones por edad son aproximadas; revisarlas antes de ver.</p></section>`:""}</section>`}

function pCom(){const T=tramos();if(!T.some(t=>t.k===city))city=T[0].k;
  const ix=T.findIndex(t=>t.k===city),tr=T[ix],P=planDe(tr,ix===T.length-1),dias=P.plan.map(d=>[d,comidasDia(tr,d,ix,T)]);
  const tot=dias.reduce((s,[d,M])=>s+M.filter(m=>m.on).reduce((t,m)=>t+m.pr,0),0);
  return `<section class="panel"><div class="tabs" role="tablist" aria-label="Ciudad">${T.map(t=>`<button type="button" role="tab" data-city="${t.k}" aria-selected="${t.k===city}">${TRIP.cities[t.k].p} ${esc(CN(t.k))}</button>`).join("")}</div>
  <div class="attbar" role="group" aria-label="Estilo de comida"><button type="button" class="btn ${ST.foodMode==="fast"?"":"alt"}" data-fmode="fast" aria-pressed="${ST.foodMode==="fast"}">Comida rápida</button><button type="button" class="btn ${ST.foodMode==="local"?"":"alt"}" data-fmode="local" aria-pressed="${ST.foodMode==="local"}">Restaurante local</button></div>
  <p class="note">Precios por persona (estimados salvo los que traen fuente). ${esc(CN(tr.k))}: ${money(tot,1)} p/p · ${money(tot*N,1)} los ${N}.</p>
  ${dias.map(([d,M])=>`<article class="day" style="--c:${TRIP.colors[tr.k]}"><div class="dtabrow"><span class="dftab"><b>${esc(pretty(d.d))}</b></span></div>
   ${M.map(m=>`<div class="meal${m.on?"":" off"}"><label><input type="checkbox" data-mon="${m.key}" ${m.on?"checked":""}> <b>${MEAL_LBL[m.k]}</b></label>
    <span class="muted">${esc(m.txt)}</span> <span class="num">${money(m.pr,1)}</span>
    ${m.opts.length?`<select class="msel" data-mopt="${m.key}" aria-label="Alternativa ${MEAL_LBL[m.k]}"><option value="">Plan base</option>${m.opts.map((o,j)=>`<option value="${j}"${m.sel==j?" selected":""}>${esc(o[0])} (${money(o[1],1)})</option>`).join("")}</select>`:""}</div>`).join("")}</article>`).join("")}</section>`}

function pBuy(){const T=tramos(),chk=(k,t,extra)=>`<label class="todo"><input type="checkbox" data-buy="${k}" ${ST.buy[k]?"checked":""}> ${t}${extra?`<br><small class="muted">${extra}</small>`:""}</label>`;
  const consent=h=>h.id==="czechinn"?CONSENT.CZINN:/^mei_/.test(h.id)?CONSENT.MEI:/^gen_/.test(h.id)?CONSENT.GEN:HOTELS.P.some(x=>x.id===h.id)?CONSENT.CZ:null;
  const hechas=Object.values(ST.buy).filter(Boolean).length;
  return `<section class="panel"><p class="note">Marca lo que ya hicieron. Los viajeros tienen 16 años: cada alojamiento pide autorización de los padres. (${hechas} hechas)</p>
  ${T.map((tr,ix)=>{const h=hotelOf(tr.k),c=h&&consent(h),prev=ix?T[ix-1].k:null,l=prev&&legDe(prev,tr.k);
   return `<div class="card" style="--c:${TRIP.colors[tr.k]}"><h3>${TRIP.cities[tr.k].p} ${esc(CN(tr.k))} · ${esc(pretty(tr.ini))}</h3>
   ${h?chk("hot:"+tr.k,`Reservar <b>${esc(h.name)}</b>${h.url?` · <a href="${esc(h.url)}" target="_blank" rel="noopener">sitio ↗</a>`:""}`,`${tr.noches} noches · ${money(stayTotal(roomP(h),ST.roomMode[h.id]||"n",tr.noches))} los ${N}`):""}
   ${c?chk("aut:"+tr.k,`Autorización de menores para <b>${esc(h.name)}</b>${c.u?` · <a href="${esc(c.u)}" target="_blank" rel="noopener">formulario ↗</a>`:""}`,esc(c.t)):""}
   ${prev?chk("tre:"+prev+">"+tr.k,`Comprar tren ${esc(CN(prev))} → ${esc(CN(tr.k))}`,l?`${esc(l.train)} · ${esc(l.dep)} → ${esc(l.arr)} · ${money(l.price*N,1)} los ${N}`:"Tren por definir"):""}</div>`}).join("")}</section>`}

function pHot(){const T=tramos();
  return `<section class="panel">${T.map(tr=>{const c=tr.k,cur=hotelOf(c),opts=HOTELS[c];
    return `<div class="card" style="--c:${TRIP.colors[c]}"><h3>${TRIP.cities[c].p} ${esc(CN(c))} · ${tr.noches} noches</h3>
    <div class="hopts">${opts.map(h=>{const on=h.id===ST.hotel[c],mode=ST.roomMode[h.id]||"n",tot=stayTotal(roomP(h),mode,tr.noches);
      return `<label class="hopt${on?" on":""}"><input type="radio" name="h-${c}" data-hotel="${c}|${h.id}" ${on?"checked":""}> <b>${esc(h.name)}</b>
       ${on&&isConf("room:"+h.id)?'<span class="stamp">confirmado</span>':""}<br><small class="muted">${esc(h.addr||"")} ${h.dist?"· "+esc(h.dist):""}</small><br>
       <small>Habitación ${money(roomP(h))} ${mode==="t"?"la estadía":"por noche"} → <b>${money(tot)}</b> para ${N} (${money(tot/N,1)} p/p) · desayuno ${money(bfP(h),1)} p/p${h.minors?` · <i>${esc(h.minors)}</i>`:""}</small></label>`}).join("")}</div>
    ${cur?`<div class="edit"><label>Precio habitación <input type="number" step="0.5" data-room="${cur.id}" value="${roomP(cur)}" style="width:6em"></label>
     <select data-rmode="${cur.id}"><option value="n"${(ST.roomMode[cur.id]||"n")==="n"?" selected":""}>por noche</option><option value="t"${ST.roomMode[cur.id]==="t"?" selected":""}>total estadía</option></select>
     <label>Desayuno p/p <input type="number" step="0.25" data-bf="${cur.id}" value="${bfP(cur)}" style="width:5em"></label></div>`:""}</div>`}).join("")}</section>`}

function pTre(){const T=tramos();
  return `<section class="panel"><p class="note">Precios por persona. Los trenes confirmados no se recalculan; cámbialos solo si cambió la reserva.</p>
  ${T.slice(1).map((t,i)=>{const a=T[i].k,b=t.k,key=a+">"+b,l=ST.trenes[key];
    return `<div class="card"><h3>${esc(CN(a))} → ${esc(CN(b))} · ${esc(pretty(t.ini))}</h3>
    ${l?`<div class="edit"><label>Tren <input data-leg="${key}|train" value="${esc(l.train)}"></label> <label>Sale <input data-leg="${key}|dep" value="${esc(l.dep)}" style="width:5em"></label> <label>Llega <input data-leg="${key}|arr" value="${esc(l.arr)}" style="width:5em"></label>
     <label>Precio p/p <input type="number" step="0.01" data-leg="${key}|price" value="${l.price}" style="width:6em"></label></div>
     <p class="muted">${esc(l.from)} → ${esc(l.to)}${l.stops?" · "+esc(l.stops):""} · ${money(l.price*N,1)} los ${N}${isConf("leg:"+a+"-"+b)||isConf("leg:"+b+"-"+a)?' · <span class="stamp">verificado</span>':""}</p>`
     :`<p class="muted">Sin tren confirmado para este tramo (orden distinto al confirmado). Estimado ${money(legEst(a,b),1)} p/p.</p>`}</div>`}).join("")}</section>`}

function pCos(){const C=costos(),T=tramos();const row=(n,v)=>`<tr><td>${n}</td><td class="num">${money(v)}</td><td class="num">${money(v/N)}</td></tr>`;
  return `<section class="panel"><div class="summary"><div class="tile main"><span class="eyebrow">Total del viaje (sin vuelos)</span><span class="big">${money(C.total)}</span></div>
  <div class="tile"><span class="eyebrow">Por persona</span><span class="big">${money(C.total/N)}</span></div></div>
  <div class="tbl-wrap"><table class="ftbl"><thead><tr><th>Concepto</th><th>Total ${N}</th><th>Por persona</th></tr></thead><tbody>
  ${row("Alojamiento",C.hot)}${row("Desayunos",C.des)}${row("Almuerzos, medias tardes y cenas",C.alm)}${row("Actividades",C.act)}${row("Trenes entre ciudades",C.tre)}${row("Transporte local",C.loc)}</tbody></table></div>
  <div class="tbl-wrap"><table class="ftbl"><thead><tr><th>Ciudad</th><th>Alojamiento</th><th>Actividades</th><th>Tren de llegada</th></tr></thead><tbody>
  ${C.por.map(p=>`<tr><td>${esc(CN(p.k))}</td><td class="num">${money(p.hot)}</td><td class="num">${money(p.act)}</td><td class="num">${money(p.tre)}</td></tr>`).join("")}</tbody></table></div>
  <p class="note">No incluye vuelos. Para gastos reales durante el viaje usa <a href="/gastos?trip=alemania">Mis gastos</a>.</p></section>`}

function render(){
  ensure();
  const body={cfg:pCfg,prog:pProg,att:pAtt,com:pCom,hot:pHot,tre:pTre,buy:pBuy,cos:pCos}[tab]();
  app.innerHTML=header()+`<nav class="tabs" role="tablist">${tabsDef.map(([k,t])=>`<button type="button" role="tab" data-tab="${k}" aria-selected="${k===tab}">${t}</button>`).join("")}<a class="tablink" href="/gastos?trip=alemania">9 · Gastos ↗</a></nav>`+body;
  bind();initMaps();
  if(focusFicha){const el=document.getElementById("f-"+focusFicha.replace(":","-"));focusFicha=null;if(el){el.scrollIntoView({block:"start"});el.classList.add("flash");setTimeout(()=>el.classList.remove("flash"),1600)}}
}
function initMaps(){app.querySelectorAll(".lmap[data-lday]").forEach(el=>{if(el._m)return;
  const [d,c]=el.dataset.lday.split("|"),T=tramos(),ix=T.findIndex(t=>t.k===c),tr=T[ix];
  const day=planDe(tr,ix===T.length-1).plan.find(x=>x.d===d);if(!day)return;const h=hotelOf(c);
  try{mapaDia(el,{base:h&&h.ll,puntos:day.seq.filter(a=>a.ll).map(a=>({ll:a.ll,n:a.n,top:a.top})),zonas:ZONES[c]||[],big:true})}catch(e){el.textContent="No se pudo cargar el plano."}})}

function bind(){
  const Q=(s,f)=>app.querySelectorAll(s).forEach(f);
  Q("[data-tab]",b=>b.onclick=()=>go(b.dataset.tab));
  Q("[data-map]",b=>b.onclick=()=>{const k=b.dataset.map;mapOpen.has(k)?mapOpen.delete(k):mapOpen.add(k);render()});
  Q("[data-ficha]",a=>a.onclick=e=>{e.preventDefault();const k=a.dataset.ficha;attCity=k.split(":")[0];focusFicha=k;go("att")});
  Q("[data-attc]",b=>b.onclick=()=>{attCity=b.dataset.attc;render()});
  Q("[data-fmode]",b=>b.onclick=()=>{ST.foodMode=b.dataset.fmode;save();render()});
  Q("[data-mon]",i=>i.onchange=()=>{ST.mealOn[i.dataset.mon]=i.checked;save();render()});
  Q("[data-mopt]",i=>i.onchange=()=>{if(i.value==="")delete ST.mealOpt[i.dataset.mopt];else ST.mealOpt[i.dataset.mopt]=+i.value;save();render()});
  Q("[data-buy]",i=>i.onchange=()=>{ST.buy[i.dataset.buy]=i.checked;save();render()});
  Q("[data-calgo]",b=>b.onclick=()=>{const [c,d]=b.dataset.calgo.split("|");city=c;tab="prog";try{localStorage.setItem(TRIP.ls+"_tab","prog")}catch(e){}render();setTimeout(()=>{const a=[...app.querySelectorAll(".dftab b")].find(x=>x.textContent===pretty(d));if(a)a.scrollIntoView({block:"start",behavior:"smooth"})},50)});
  Q("[data-city]",b=>b.onclick=()=>{city=b.dataset.city;render()});
  Q("[data-start]",i=>i.onchange=()=>{if(i.value){ST.cfg.start=i.value;save();render()}});
  Q("[data-noches]",i=>i.onchange=()=>{ST.cfg.nights[i.dataset.noches]=Math.max(1,Math.min(10,+i.value||1));save();render()});
  Q("[data-mv]",b=>b.onclick=()=>{const [c,d]=b.dataset.mv.split("|"),o=ST.cfg.order,i=o.indexOf(c),j=i+ +d;if(j<0||j>=o.length)return;[o[i],o[j]]=[o[j],o[i]];save();render()});
  Q("[data-reset]",b=>b.onclick=()=>{if(confirm("¿Volver a los valores confirmados? Se pierden tus cambios.")){ST=clone(CONFIRMADO);save();render()}});
  Q("[data-act]",i=>i.onchange=()=>{ST.acts[i.dataset.act]=i.checked;save();const t=app.querySelector("details.why");const open=t&&t.open;render();if(open)app.querySelector("details.why").open=true});
  Q("[data-hotel]",i=>i.onchange=()=>{const [c,id]=i.dataset.hotel.split("|");ST.hotel[c]=id;save();render()});
  Q("[data-room]",i=>i.onchange=()=>{ST.prices.roomPrice[i.dataset.room]=+i.value||0;save();render()});
  Q("[data-bf]",i=>i.onchange=()=>{ST.prices.bfPrice[i.dataset.bf]=+i.value||0;save();render()});
  Q("[data-rmode]",i=>i.onchange=()=>{ST.roomMode[i.dataset.rmode]=i.value;save();render()});
  Q("[data-leg]",i=>i.onchange=()=>{const [k,f]=i.dataset.leg.split("|");ST.trenes[k][f]=f==="price"?+i.value||0:i.value;save();render()});
}

// ---- ingreso con Google y sincronización ----
function gate(msg,denied){app.innerHTML=`<div class="gate"><div class="logo"><img src="/img/logo-marcopolo.jpg" alt="Marco Polo"></div>
  <span class="eyebrow">Viaje privado</span><h1>${esc(TRIP.title)}</h1>
  ${denied?`<p class="note bad">Este viaje es privado y <b>${esc(user&&user.email)}</b> no está autorizado. Pídele a Francisco que agregue tu correo.</p><p><button class="btn alt" id="out">Entrar con otra cuenta</button></p>`:`
  <p class="muted">Entra con tu cuenta de Google para ver y editar el plan. Solo las personas invitadas pueden verlo.</p>
  ${msg?`<p class="note bad">${esc(msg)}</p>`:""}<button class="btn gbtn" id="g">Entrar con Google</button>`}
  <p style="margin-top:22px"><a href="/">← Volver a Marco Polo</a></p></div>`;
  const g=$("#g");if(g)g.onclick=async()=>{const {U,auth}=window._auth;try{await U.signInWithPopup(auth,new U.GoogleAuthProvider())}catch(e){if(e.code!=="auth/popup-closed-by-user")gate("No se pudo entrar con Google ("+e.code+").")}};
  const o=$("#out");if(o)o.onclick=()=>window._auth.U.signOut(window._auth.auth)}
async function boot(){
  if(DEMO){user={email:"demo@local"};return render()}
  const B="https://www.gstatic.com/firebasejs/10.12.2/";
  const [A,U,FS]=await Promise.all([import(B+"firebase-app.js"),import(B+"firebase-auth.js"),import(B+"firebase-firestore.js")]);
  F=FS;const fa=A.initializeApp(FB),auth=U.getAuth(fa),db=FS.getFirestore(fa);ref=FS.doc(db,...TRIP.doc);window._auth={U,auth};
  let unsub=null;
  U.onAuthStateChanged(auth,u=>{if(unsub){unsub();unsub=null}if(!u||u.isAnonymous){user=null;return gate()}user=u;
    // Si el documento no existe se muestran los valores confirmados; solo se escribe cuando alguien edita.
    unsub=F.onSnapshot(ref,s=>{if(s.metadata.hasPendingWrites)return;ST=Object.assign(clone(CONFIRMADO),pick(s.exists()?s.data():{}));render()},()=>gate(null,true))})}
boot();
