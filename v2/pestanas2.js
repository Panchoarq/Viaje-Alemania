// Pestañas Gastos, Transporte, Alojamiento y Trámites previos del motor, con el diseño de /paris.
import {inicioCiudad,diasDe,SUB} from "./motor.js";
import {costosDias} from "./programa.js";
import {ctabs} from "./pestanas.js";

const COL=["#2e4f8f","#1d6f7a","#a8352b","#2e6b4f","#b8860b","#7b4ba0","#c2477f"];
const FM=v=>(+v).toLocaleString("es-CL",{maximumFractionDigits:2})+" €";
const q=s=>encodeURIComponent(s);
const short=n=>String(n).split(/ y |:/)[0];
const colDe=(ctx,cid)=>COL[Math.max(0,ctx.ids.indexOf(cid))%COL.length];
const GIq=s=>"https://www.google.com/search?tbm=isch&q="+q(s);
const hoy=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};

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
const gbar=(bud,real)=>{const p=bud>0?Math.min(100,real/bud*100):(real>0?100:0);return `<div class="gbar${real>bud+0.005?" over":""}" aria-hidden="true"><i style="width:${p.toFixed(1)}%"></i></div>`};
const gst=(bud,real,hay)=>!hay&&real<=0?`<small class="gs">sin gastos todavía</small>`:real>bud+0.005?`<small class="gs bad">✕ ${FM(real-bud)} sobre el presupuesto</small>`:`<small class="gs ok">✓ dentro del presupuesto · quedan ${FM(bud-real)}</small>`;
export function gastos(ctx){
  if(!GAS||GASID!==ctx.viaje.id){GAS=null;cargarGastos(ctx).then(()=>{if(ctx.actual()==="gas")ctx.render()});return '<div class="card"><p class="muted">Cargando gastos…</p></div>'}
  const W=ctx.W,P=W.personas||2,L=[...GAS],D=costosDias(ctx),dias=D.map(x=>x.d);
  const pp=g=>(+g.eur||0)/P,real=f=>L.filter(f).reduce((t,g)=>t+pp(g),0),hay=L.length>0;
  const G=[];D.forEach(({d,c})=>{let g=G.find(x=>x.cid===d.cid);if(!g){g={cid:d.cid,n:short(ctx.M[d.cid].CIUDAD.n),c:colDe(ctx,d.cid),days:0,bud:0};G.push(g)}g.days++;g.bud+=c.total});
  G.forEach(g=>g.real=real(x=>x.c===g.cid&&x.cat!=="Compras"));
  const SB=+W.shopBud||0,SR=real(x=>x.cat==="Compras"),EST=G.reduce((t,g)=>t+g.bud,0)+SB,OFF=+W.presupuesto||0,TB=OFF>0?OFF:EST,TR=real(()=>true);
  const lost=TR-G.reduce((t,g)=>t+g.real,0)-SR,today=hoy(),fe=ctx.fechas(),first=fe?dias[0].d:"",last=fe?dias[dias.length-1].d:"";
  const left=fe?dias.filter(d=>d.d>=today):[],nL=left.length,rest=TB-TR,perDay=nL?rest/nL:0,over=TR>TB+0.005;
  let when=`el viaje tiene ${dias.length} días`;
  if(fe){if(today<first){const f=Math.round((new Date(first)-new Date(today))/864e5);when=`Faltan <b>${f}</b> día${f===1?"":"s"} para viajar · el viaje tiene ${dias.length} días`}else if(today>last)when=`El viaje terminó (${dias.length} días)`;else when=`Quedan <b>${nL}</b> día${nL===1?"":"s"} de ${dias.length}`}
  const cats=[["Alojamiento","hot","Alojamiento"],["Comidas","meal","Comida"],["Entradas","act","Entradas"],["Transporte","loc","Transporte"],["Compras","shop","Compras"]].map(([n,k,cat])=>{const b=k==="shop"?SB:D.reduce((t,x)=>t+(x.c[k]||0),0),r=real(g=>g.cat===cat);return `<div class="gcat"><span>${n}</span><span class="num">${FM(b)}</span><span class="num rd">${FM(r)}</span></div>`}).join("");
  const mon=ctx.M[ctx.ids[0]].CIUDAD.moneda||{code:"EUR",sym:"€",eur:1};
  const porDia={};L.forEach(g=>{(porDia[g.f||"sin fecha"]=porDia[g.f||"sin fecha"]||[]).push(g)});
  const fechasG=Object.keys(porDia).sort().reverse();
  return `<section class="gtotal" aria-label="Total del viaje"><span class="eyebrow">Total del viaje · por persona</span>
    <div class="gtn"><div><b class="gb">${FM(TB)}</b><small>${OFF>0?"presupuesto":"estimado del programa"}</small></div><div><b class="gr">${FM(TR)}</b><small>gastado</small></div></div>${gbar(TB,TR)}
    <div class="gtm"><b class="${over?"gr":""}">${over?"Te pasaste por "+FM(TR-TB):"Te quedan "+FM(rest)}</b> · ${when}${nL&&today<=last&&!over?` · puedes gastar unos <b>${FM(perDay)}</b> por día`:""}</div>
    ${OFF>0?`<div class="gtm" style="opacity:.75">Estimado día a día: ${FM(EST)} · ${OFF>=EST?"margen de "+FM(OFF-EST):"te faltan "+FM(EST-OFF)+" para cubrirlo"}</div>`:`<div class="gtm" style="opacity:.75">Escribe tu presupuesto abajo para compararlo.</div>`}
    <div class="gtm" style="opacity:.75">Las ${P} personas: ${FM(TB*P)}</div></section>
  <section class="gcities" aria-label="Por ciudad">${G.map(g=>`<div class="gcity" style="--c:${g.c}"><div class="gch"><b>${ctx.esc(g.n)}</b><span class="muted">${g.days} día${g.days>1?"s":""}</span><span class="gn"><b>${FM(g.bud)}</b><span class="rd"> / ${FM(g.real)}</span></span></div>${gbar(g.bud,g.real)}${gst(g.bud,g.real,hay)}</div>`).join("")}
   <div class="gcity" style="--c:#c2477f"><div class="gch"><b>Compras</b><span class="muted">regalos y otros</span><span class="gn"><b>${FM(SB)}</b><span class="rd"> / ${FM(SR)}</span></span></div>${gbar(SB,SR)}${SB?gst(SB,SR,hay):`<small class="gs">Define cuánto quieren gastar en compras para compararlo con lo real.</small>`}<label class="shopin">Presupuesto de compras por persona (€)<input type="number" inputmode="decimal" min="0" step="5" value="${SB||""}" placeholder="0" data-shopbud></label></div>
   ${Math.abs(lost)>0.005?`<p class="muted" style="font-size:12.5px;margin:2px 0">Hay ${FM(lost)} gastados sin ciudad asignada: están en el total, pero no en las barras de arriba.</p>`:""}</section>
  <div class="card"><span class="eyebrow">Presupuesto del viaje</span><label class="shopin" style="margin-top:6px">Presupuesto total por persona (€, opcional)<input type="number" inputmode="decimal" min="0" step="50" value="${OFF||""}" placeholder="${Math.round(EST)}" data-bud></label></div>
  <details class="card gdays"><summary><span class="eyebrow">Día a día · estimado y gastado</span></summary><div class="gdl">${D.map(({d,c})=>{const r=real(g=>d.d&&g.f===d.d),t=d.d===today;return `<div class="gday${t?" today":""}${r>c.total+0.005?" over":""}"><span>${d.d?ctx.pretty(d.d):"Día "+(d.g+1)}</span><small class="muted">${ctx.esc(short(ctx.M[d.cid].CIUDAD.n))}</small><span class="num">${FM(c.total)}</span><span class="num rd">${r?FM(r):"—"}</span></div>`}).join("")}</div></details>
  <details class="card gdays"><summary><span class="eyebrow">Por categoría · estimado y gastado</span></summary><div class="gdl"><div class="gcat head"><span></span><span>estimado</span><span>gastado</span></div>${cats}<div class="gcat tot"><span>Total</span><span class="num">${FM(EST)}</span><span class="num rd">${FM(TR)}</span></div></div></details>
  <div class="card"><span class="eyebrow">Anotar un gasto</span><form id="fGas" class="fform" style="margin-top:8px">
   <label class="f">Fecha<input type="date" name="f" required value="${today}"></label>
   <label class="f">Ciudad<select name="c">${ctx.ids.map(i=>`<option value="${i}">${ctx.esc(ctx.M[i].CIUDAD.n)}</option>`).join("")}</select></label>
   <label class="f">Categoría<select name="cat">${CATS.map(c=>`<option>${c}</option>`).join("")}</select></label>
   <label class="f">Monto (lo pagado en total)<input type="number" name="m" required min="0" step="any"></label>
   <label class="f">Moneda<select name="mon"><option value="eur">€ (euros)</option>${mon.code!=="EUR"?`<option value="loc" selected>${mon.code} (${mon.sym})</option>`:""}</select></label>
   <label class="f">Cómo pagué<select name="pago"><option>Efectivo</option><option>Tarjeta</option><option>Otro</option></select></label>
   <label class="f wide">Nota<input name="n" maxlength="80" placeholder="Ej.: entradas del castillo"></label>
   <div class="act wide"><button class="btn sm" type="submit">＋ Guardar gasto</button></div></form><p class="muted" id="gMsg" role="status" style="font-size:13px">Cada gasto se divide entre ${P} personas para compararlo con el presupuesto.</p></div>
  <details class="card gdays"${fechasG.length&&fechasG.length<4?" open":""}><summary><span class="eyebrow">Gastos anotados (${L.length})</span></summary>${fechasG.length?fechasG.map(f=>`<div class="dia"><h4 style="margin:10px 0 2px">${f==="sin fecha"?f:ctx.pretty(f)} · ${FM(porDia[f].reduce((t,g)=>t+g.eur,0))}</h4>${porDia[f].map(g=>`<div class="line"><span><b>${FM(g.eur)}</b> · ${ctx.esc(g.cat)} <small class="muted">${ctx.esc(ctx.M[g.c]?short(ctx.M[g.c].CIUDAD.n):"")} · ${ctx.esc(g.pago||"")}${g.n?" · "+ctx.esc(g.n):""}</small></span><button type="button" class="lnkb" data-dg="${g.id}" aria-label="Eliminar gasto">✕ quitar</button></div>`).join("")}</div>`).join(""):'<p class="muted">Aún no hay gastos.</p>'}</details>
  <p class="note">El estimado sale del Programa (comidas, entradas, transporte y alojamiento de cada día). <span class="rd">En rojo</span>, lo que anotaron aquí.</p>`;
}
export function bindGastos(ctx){
  if(!GAS||!document.getElementById("fGas"))return;
  const id=ctx.viaje.id,mon=ctx.M[ctx.ids[0]].CIUDAD.moneda||{eur:1};
  document.querySelector("[data-bud]").onchange=e=>{ctx.W.presupuesto=+e.target.value||0;ctx.guardar();ctx.render()};
  document.querySelector("[data-shopbud]").onchange=e=>{ctx.W.shopBud=+e.target.value||0;ctx.guardar();ctx.render()};
  document.getElementById("fGas").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),m=+f.get("m");if(!(m>=0))return;
    const g={id:"g_"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),t:Date.now(),f:f.get("f"),c:f.get("c"),cat:f.get("cat"),pago:f.get("pago"),n:f.get("n"),m,mon:f.get("mon"),eur:Math.round(m*(f.get("mon")==="loc"?mon.eur:1)*100)/100};
    GAS.push(g);escribirG(id,GAS);
    if(ctx.viaje.owner&&!ctx.DEMO){try{await ctx.nube.gastoSet(id,{...g,sync:true});g.sync=true;escribirG(id,GAS)}catch(x){console.warn("gasto nube",x)}}
    ctx.render()};
  document.querySelectorAll("[data-dg]").forEach(b=>b.onclick=async()=>{const gid=b.dataset.dg,g=GAS.find(x=>x.id===gid);GAS=GAS.filter(x=>x.id!==gid);escribirG(id,GAS);
    if(g&&g.sync&&ctx.viaje.owner&&!ctx.DEMO){try{await ctx.nube.gastoDel(id,gid)}catch(x){console.warn(x)}}ctx.render()});
}

// ---------- 8 · Transporte
const TDET=[["Llegada","llegada"],["En la ciudad","local"],["Pases","pases"],["Trenes","trenes"]];
export function transporte(ctx){
  const W=ctx.W;W.tk=W.tk||{};
  const tramos=ctx.ids.slice(1).map((b,i)=>({a:ctx.ids[i],b})),tot=Object.values(W.tk).reduce((t,x)=>t+(+x.p||0),0);
  const est=tramos.reduce((t,{a,b})=>t+(ctx.eleccion(a,b).eur||0),0);
  return `<div class="card buy"><span class="eyebrow">Entre ciudades · ${tramos.length} traslado${tramos.length===1?"":"s"}</span><h3>${tramos.length?"Cómo ir de una ciudad a otra":"Tu viaje tiene una sola ciudad"}</h3>
    ${tramos.length?`<p>Para cada traslado se propone el medio recomendado. Cámbialo si prefieres otro, y anota abajo lo que compres.</p>`:`<p class="muted">No hay traslados entre ciudades. Cómo llegar y moverse en ${ctx.esc(ctx.M[ctx.ids[0]].CIUDAD.n)} está más abajo.</p>`}</div>
  ${tramos.map(({a,b})=>{const k=[a,b].sort().join("-"),e=ctx.eleccion(a,b),t=W.tk[k]||{},na=ctx.M[a].CIUDAD.n,nb=ctx.M[b].CIUDAD.n,f=ctx.fechas()?ctx.add(W.inicio,inicioCiudad(ctx,b)):"",ops=ctx.opciones(a,b);
   return `<div class="card buy" style="border-left:6px solid ${colDe(ctx,b)}"><span class="eyebrow">${f?ctx.pretty(f):"Traslado"}</span><h3>${ctx.esc(short(na))} → ${ctx.esc(short(nb))}</h3>
    <p><b>${ctx.MODO[e.m]}</b> · ${ctx.fh(e.min/60)}${e.eur?` · ~${FM(e.eur)} por persona`:""}${e.rec?" · recomendado":""}</p>${e.n?`<p class="muted">${ctx.esc(e.n)}</p>`:""}
    ${ops.length>1?`<div class="seg" role="group" aria-label="Medio de transporte">${ops.map(o=>`<button type="button" data-trm="${k}|${o.m}" aria-pressed="${o.m===e.m}">${ctx.MODO[o.m]} · ${ctx.fh(o.min/60)}${o.eur?" · ~"+o.eur+" €":""}</button>`).join("")}</div>`:""}
    <div class="links-row"><a href="https://www.google.com/maps/dir/?api=1&origin=${q(na)}&destination=${q(nb)}&travelmode=${e.m==="auto"?"driving":"transit"}" target="_blank" rel="noopener">Google Maps →</a><a href="https://www.rome2rio.com/map/${q(na)}/${q(nb)}" target="_blank" rel="noopener">Rome2rio →</a>${e.m==="avion"?`<a href="https://www.google.com/travel/flights?q=${q("Flights from "+na+" to "+nb+(f?" on "+f:""))}" target="_blank" rel="noopener">Vuelos →</a>`:""}</div>
    <span class="eyebrow" style="margin-top:10px">Lo que compré</span>
    <div class="fform" data-tk="${k}" style="margin-top:6px"><label class="f wide">Qué compré<input data-f="n" value="${ctx.esc(t.n||"")}" maxlength="80" placeholder="Ej.: Tren 10:15, asientos 24A-B"></label><label class="f">Reserva / código<input data-f="r" value="${ctx.esc(t.r||"")}" maxlength="40"></label><label class="f">Costo total (€)<input data-f="p" type="number" min="0" value="${t.p||""}"></label></div></div>`}).join("")}
  ${tramos.length?`<div class="card buy"><span class="eyebrow">Resumen de traslados</span><div class="tbl-wrap"><table><tbody><tr><td>Estimado por persona</td><td class="r num">${FM(est)}</td></tr><tr><td>Estimado para ${W.personas||2} personas</td><td class="r num">${FM(est*(W.personas||2))}</td></tr><tr><td><b>Comprado hasta ahora</b></td><td class="r num"><b>${FM(tot)}</b></td></tr></tbody></table></div></div>`:""}
  ${ctx.ids.map(cid=>{const T=ctx.M[cid].TRANSPORTE||{},it=TDET.filter(([,k])=>T[k]);return `<div class="card buy" style="border-left:6px solid ${colDe(ctx,cid)}"><span class="eyebrow">${ctx.esc(short(ctx.M[cid].CIUDAD.n))} · llegar y moverse</span><h3>Pases y consejos</h3>${it.length?it.map(([t,k],i)=>`<details class="tdet"${i===0?" open":""}><summary>${t}</summary><p>${ctx.esc(T[k])}</p></details>`).join(""):'<p class="muted">Sin datos de transporte para esta ciudad.</p>'}</div>`}).join("")}
  <div class="card buy"><span class="eyebrow">Consejos</span><ul class="brief"><li>Comprar con anticipación los trenes y aviones: los precios suben cerca de la fecha.</li><li>Guardar el código de reserva y una captura del boleto en el celular.</li><li>Los tiempos y precios son referenciales: confirmar en la web del operador antes de comprar.</li></ul></div>`;
}
export function bindTransporte(ctx){
  document.querySelectorAll("[data-tk]").forEach(f=>f.querySelectorAll("[data-f]").forEach(i=>i.onchange=()=>{const t=(ctx.W.tk[f.dataset.tk]=ctx.W.tk[f.dataset.tk]||{});t[i.dataset.f]=i.type==="number"?+i.value||0:i.value;ctx.guardar();if(i.dataset.f==="p")ctx.render()}));
  document.querySelectorAll("[data-trm]").forEach(b=>b.onclick=()=>{const [k,m]=b.dataset.trm.split("|");ctx.W.traslado=ctx.W.traslado||{};ctx.W.traslado[k]=m;ctx.guardar();ctx.render()})}

// ---------- 9 · Alojamiento
const HS={c:""};
const optsDe=(ctx,cid)=>{const W=ctx.W;W.hot=W.hot||{};if(!W.hot[cid]){const a=(W.alo||{})[cid];W.hot[cid]=a&&(a.n||a.p)?[{id:"h0",n:a.n||"Mi alojamiento",addr:"",bf:"",price:a.p||"",mode:"t",note:"",url:"",r:a.r||"",ok:!!a.ok,sel:true}]:[]}return W.hot[cid]};
function sincAlo(ctx,cid){const W=ctx.W,o=optsDe(ctx,cid).find(x=>x.sel),nn=W.ciudades.find(c=>c.id===cid).noches||1;W.alo=W.alo||{};
  if(!o){delete W.alo[cid];return}const tot=o.price?(o.mode==="t"?+o.price:+o.price*nn):0;W.alo[cid]={n:o.n,p:tot,r:o.r||"",ok:!!o.ok}}
export function alojamiento(ctx){
  const W=ctx.W,cid=ctx.ids.includes(HS.c)?HS.c:ctx.ids[0];HS.c=cid;
  const P=W.personas||2,res=W.hoteles==="reservado";
  const tabs=`<div class="daytabs" role="tablist" aria-label="Ciudad">${ctx.ids.map(c=>{const o=optsDe(ctx,c).find(x=>x.sel),x=W.ciudades.find(z=>z.id===c);return `<button type="button" role="tab" class="dtab" style="--c:${colDe(ctx,c)}" data-sub="${c}" aria-selected="${c===cid}"><b>${ctx.esc(short(ctx.M[c].CIUDAD.n))}</b><small>${x.noches} ${x.noches===1?"noche":"noches"} · ${ctx.esc(o?o.n:"sin elegir")}</small></button>`}).join("")}</div>`;
  const M=ctx.M[cid],x=W.ciudades.find(z=>z.id===cid),i0=inicioCiudad(ctx,cid),ini=ctx.fechas()?ctx.add(W.inicio,i0):"",fin=ctx.fechas()?ctx.add(W.inicio,i0+x.noches):"",L=optsDe(ctx,cid);
  const bk=(t)=>`https://www.booking.com/searchresults.html?ss=${q(t)}${ini?"&checkin="+ini+"&checkout="+fin+"&group_adults="+P:""}`;
  const tot=ctx.ids.reduce((t,i)=>t+(+((W.alo||{})[i]||{}).p||0),0);
  return `<div class="opt on" style="margin-bottom:10px"><div class="opt-top"><span class="name">🛏 ${res?"Ya tienen reservas: anótenlas para que queden con el viaje.":"Recomendaciones ("+({eco:"económico",medio:"medio",conf:"confort"}[W.estandar]||"medio")+"): busquen por barrio y anoten lo que reserven."}</span><span class="pill sel">Total anotado ${FM(tot)}</span></div></div>
  ${tabs}<div id="hotels" style="display:flex;flex-direction:column;gap:22px"><div class="city" style="--c:${colDe(ctx,cid)}"><h3>${ctx.esc(M.CIUDAD.n)} · ${x.noches} ${x.noches===1?"noche":"noches"}${ini?" · "+ctx.pretty(ini)+" → "+ctx.pretty(fin):""}</h3>
   ${(M.BARRIOS||[]).length?`<p class="note"><b>Dónde conviene:</b> ${M.BARRIOS.map(b=>`<b>${ctx.esc(b.n)}</b>: ${ctx.esc(b.d)}`).join(" · ")}</p>`:""}
   <div class="hotels">${L.map(o=>{const nn=x.noches||1,tt=o.price?(o.mode==="t"?+o.price:+o.price*nn):0,pp=tt/P;
    return `<div class="opt${o.sel?" on":""}"><div class="opt-top"><input type="radio" name="h-${cid}" data-hsel="${cid}|${o.id}" ${o.sel?"checked":""} aria-label="Elegir ${ctx.esc(o.n)}"><span class="name">${ctx.esc(o.n)}</span><span class="pill ${o.sel?"sel":""}">${o.sel?"✔ Elegido":"Alternativa"}</span></div>
     <dl class="facts"><dt>Dirección</dt><dd><input class="hin" data-hf="${cid}|${o.id}|addr" value="${ctx.esc(o.addr||"")}" placeholder="Calle, número, barrio"></dd>
     <dt>Desayuno</dt><dd><select data-hf="${cid}|${o.id}|bf"><option value="">Sin dato</option>${["Incluido","No incluido","Cocina propia"].map(v=>`<option ${o.bf===v?"selected":""}>${v}</option>`).join("")}</select></dd>
     <dt>Tarifa (${P} pers.)</dt><dd><span class="pricebox"><input type="number" step="1" data-hf="${cid}|${o.id}|price" value="${ctx.esc(o.price||"")}" aria-label="Tarifa"> € <select data-hf="${cid}|${o.id}|mode"><option value="n" ${o.mode!=="t"?"selected":""}>por noche</option><option value="t" ${o.mode==="t"?"selected":""}>total estadía</option></select></span></dd>
     <dt>N.º de reserva</dt><dd><input class="hin" data-hf="${cid}|${o.id}|r" value="${ctx.esc(o.r||"")}" placeholder="Código de reserva"></dd>
     <dt>Pago</dt><dd><label><input type="checkbox" data-hf="${cid}|${o.id}|ok" ${o.ok?"checked":""}> Reservado y pagado</label></dd>
     <dt>Notas</dt><dd><input class="hin" data-hf="${cid}|${o.id}|note" value="${ctx.esc(o.note||"")}" placeholder="Metro cercano, check-in, cancelación…"></dd>
     <dt>Costo por persona</dt><dd>${tt?`<b>${FM(pp/nn)}</b> por noche · <b>${FM(pp)}</b> total`:"—"}</dd></dl>
     <div class="links-row">${o.url?`<a href="${ctx.esc(o.url)}" target="_blank" rel="noopener">Ver reserva →</a>`:""}<a href="${bk(o.n+" "+M.CIUDAD.n)}" target="_blank" rel="noopener">Ver disponibilidad →</a><a href="https://www.google.com/maps/search/?api=1&query=${q((o.addr||o.n)+" "+M.CIUDAD.n)}" target="_blank" rel="noopener">Mapa →</a><a href="${GIq(o.n+" "+M.CIUDAD.n)}" target="_blank" rel="noopener">Fotos →</a><button type="button" class="lnkb" data-hdel="${cid}|${o.id}">✕ Eliminar</button></div></div>`}).join("")}
    ${L.length?"":`<div class="opt empty">Todavía no hay alojamientos para ${ctx.esc(short(M.CIUDAD.n))}. Busquen opciones y agréguenlas para compararlas.</div>`}</div>
   <div class="links-row" style="margin-top:10px"><a href="${bk(M.CIUDAD.n)}" target="_blank" rel="noopener">Buscar en Booking (${P} adultos${ini?", estas fechas":""}) →</a><a href="https://www.google.com/travel/hotels/${q(M.CIUDAD.n)}" target="_blank" rel="noopener">Google Hoteles →</a><a href="https://www.airbnb.com/s/${q(M.CIUDAD.n)}/homes${ini?"?checkin="+ini+"&checkout="+fin+"&adults="+P:""}" target="_blank" rel="noopener">Airbnb →</a></div>
   <form class="hadd" data-hadd="${cid}"><b>+ Agregar alojamiento</b><input name="n" required placeholder="Nombre del hotel o departamento" maxlength="80"><input name="url" type="url" placeholder="Enlace (opcional)"><button class="btn sm">Agregar</button></form></div></div>`;
}
export function bindAlojamiento(ctx){const Q=(s,f)=>document.querySelectorAll(s).forEach(f),W=ctx.W;
  Q("[data-sub]",b=>b.onclick=()=>{HS.c=b.dataset.sub;SUB.c=b.dataset.sub;ctx.render()});
  Q("[data-hsel]",r=>r.onchange=()=>{const [cid,id]=r.dataset.hsel.split("|");optsDe(ctx,cid).forEach(o=>o.sel=o.id===id);sincAlo(ctx,cid);ctx.guardar();ctx.render()});
  Q("[data-hf]",i=>i.onchange=()=>{const [cid,id,f]=i.dataset.hf.split("|"),o=optsDe(ctx,cid).find(z=>z.id===id);if(!o)return;o[f]=i.type==="checkbox"?i.checked:i.value;sincAlo(ctx,cid);ctx.guardar();if(["price","mode","ok","r"].includes(f))ctx.render()});
  Q("[data-hdel]",b=>b.onclick=()=>{const [cid,id]=b.dataset.hdel.split("|");const L=optsDe(ctx,cid),i=L.findIndex(o=>o.id===id);if(i<0)return;const was=L[i].sel;L.splice(i,1);if(was&&L[0])L[0].sel=true;sincAlo(ctx,cid);ctx.guardar();ctx.render()});
  Q("[data-hadd]",f=>f.onsubmit=e=>{e.preventDefault();const cid=f.dataset.hadd,d=new FormData(f),L=optsDe(ctx,cid);L.push({id:"h"+Date.now().toString(36),n:d.get("n"),url:d.get("url")||"",addr:"",bf:"",price:"",mode:"n",note:"",r:"",ok:false,sel:!L.length});sincAlo(ctx,cid);ctx.guardar();ctx.render()})}

// ---------- 10 · Trámites previos
const BASE=[
 {k:"pasaporte",t:"Pasaporte vigente",g:"OBLIGATORIO",u:1,p:"Debe estar vigente durante todo el viaje y, en la mayoría de los países, algunos meses después de la salida. Revisen la fecha de vencimiento hoy."},
 {k:"vuelos",t:"Vuelos internacionales",g:"COMPRAR CON ANTICIPACIÓN",u:1,p:"Ida y regreso. Los precios suben cerca de la fecha; guarden el código de reserva."},
 {k:"seguro",t:"Seguro de viaje con cobertura médica",g:"RECOMENDADO",p:"Que cubra salud, accidentes y equipaje durante todo el viaje."},
 {k:"aloj",t:"Alojamiento reservado",g:"RESERVAR",u:1,p:"Anoten la tarifa en 9 · Alojamiento para que se sume a los gastos del programa."},
 {k:"trenes",t:"Trenes y traslados entre ciudades",g:"COMPRAR CON ANTICIPACIÓN",p:"Los precios bajos se agotan. Los traslados están en 8 · Transporte."},
 {k:"entradas",t:"Entradas con hora para lo más visitado",g:"RESERVAR",u:1,p:"Las atracciones más famosas se agotan semanas antes: reserven con hora."},
 {k:"tarjeta",t:"Tarjeta sin comisión de cambio y aviso al banco",g:"RECOMENDADO",p:"Avisen al banco las fechas y países del viaje para que no bloquee la tarjeta."},
 {k:"efectivo",t:"Algo de efectivo en moneda local",g:"RECOMENDADO",p:"Para lugares que no aceptan tarjeta, baños públicos y propinas."},
 {k:"sim",t:"eSIM o plan de datos",g:"RECOMENDADO",p:"Suele salir más barato que el roaming. Descarguen también los mapas sin conexión."},
 {k:"adapt",t:"Adaptador de enchufe",g:"SABER",p:"Revisen el tipo de enchufe del país y lleven al menos uno."},
 {k:"copia",t:"Copia digital de pasaportes, seguro y reservas",g:"RECOMENDADO",p:"En el correo o en la nube, por si se pierde el celular."}];
export function tramites(ctx){
  const W=ctx.W;W.tram=W.tram||{};
  const T=[...new Map(ctx.ids.map(i=>[(ctx.M[i].TRAMITES||{}).pais||i,ctx.M[i].TRAMITES||{}])).entries()];
  const esp=[];T.forEach(([p,t])=>{[["eta","Entrada y visa","OBLIGATORIO",1],["seguro","Seguro","RECOMENDADO"],["moneda","Moneda y pagos","SABER"]].forEach(([k,n,g,u])=>{if(t[k])esp.push({k:"p_"+p+"_"+k,t:n+" · "+p,g,u,p:t[k]})})});
  const L=[...esp,...BASE],n=L.filter(t=>W.tram[t.k]).length,C=[...new Set(ctx.ids.flatMap(i=>ctx.M[i].CONSEJOS||[]))];
  return `<div class="card buy"><span class="eyebrow">Paso 1 · Antes de viajar · ${n} de ${L.length} listos</span><h3>Comprar, inscribir o tramitar</h3>
    <ol class="buylist">${L.map(t=>`<li class="${t.u?"urg":""}"><label><input type="checkbox" data-t="${ctx.esc(t.k)}" ${W.tram[t.k]?"checked":""}> <b>${ctx.esc(t.t)}</b> <span class="tag ${t.u?"urgt":""}">${t.g}</span></label><p>${ctx.esc(t.p)}</p></li>`).join("")}</ol></div>
  ${C.length?`<div class="card buy"><span class="eyebrow">Consejos</span><h3>Para ${ctx.ids.length>1?"las ciudades del viaje":"tu destino"}</h3><ul class="brief">${C.map(c=>`<li>${ctx.esc(c)}</li>`).join("")}</ul></div>`:""}
  <p class="note">Información general sin verificar: confírmenla en el sitio oficial del país antes de viajar (visas, autorizaciones y requisitos cambian).</p>`;
}
export function bindTramites(ctx){document.querySelectorAll("[data-t]").forEach(c=>c.onchange=()=>{ctx.W.tram[c.dataset.t]=c.checked;ctx.guardar();ctx.render()})}
