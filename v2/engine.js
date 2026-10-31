import {TRIP} from "./trips/paris.js";
import {ESC,PA,LON,PA_F,CTX_PA,MEDIA_PA,SHOWS,SHOW_X,EXT,ESC_WHY,ESC_H,ESC_WK,FOOD_PA,PLACES_PA,FOOD_ESC,LUNCH_V,BARRIOS,FOOD_G,GUIDE,TIPS,CHECK,TRAM,PA_T,BASES,ZONES_PA,FRMAP,SEINE,LO_WK,ESC_LL,PA_MEAL,LON_MEAL,PA_MEAL_LBL,GBP,G} from "./trips/paris.data.js";
// ===== Datos: escapadas desde París (tiempos de tren directos típicos; verificar horarios al comprar) =====
const FB={apiKey:"AIzaSyBJefyy5hhRQHK4EWbmZFC15h2Fgb55w68",authDomain:"viaje-a-alemania-60001.firebaseapp.com",projectId:"viaje-a-alemania-60001",storageBucket:"viaje-a-alemania-60001.firebasestorage.app",messagingSenderId:"1061928899634",appId:"1:1061928899634:web:d5ffc52cb53edebe71182b"};
const DEMO=location.protocol==="file:"||new URLSearchParams(location.search).has("demo");
const $=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const DOW=["dom","lun","mar","mié","jue","vie","sáb"],MON=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const D=s=>{if(!s)return null;const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const add=(s,n)=>{const d=D(s);d.setDate(d.getDate()+n);return iso(d)};
const pretty=s=>{const d=D(s);return d?`${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`:"—"};
const nights=(a,b)=>Math.round((D(b)-D(a))/864e5);

// ===== Estado compartido =====
let ST={wiz:{},esc:[],step:0},user=null,ref=null,F=null,tab="resumen",filt="todas",open=null,saveT=null;
try{tab=localStorage.getItem(TRIP.ls+"_tab")||"resumen"}catch(e){}
function sync(t,cls){const s=$("#sync");s.textContent=t;s.className="sync "+(cls||"");if(cls==="ok")setTimeout(()=>s.classList.add("hide"),2500)}
function save(){if(DEMO){try{localStorage.setItem(TRIP.ls+"_demo",JSON.stringify(ST))}catch(e){}sync("Guardado (demo local)","ok");return}
  clearTimeout(saveT);sync("Guardando…","busy");saveT=setTimeout(async()=>{try{await F.setDoc(ref,{wiz:ST.wiz,esc:ST.esc,step:ST.step,paSel:ST.paSel||{},paPin:ST.paPin||{},paJun:ST.paJun||{},jun:ST.jun||{},ritmoT:ST.ritmoT||{},soloOrg:!!ST.soloOrg,favs:ST.favs||[],custom:ST.custom||{},dayBlk:ST.dayBlk||{},loOrg:!!ST.loOrg,lonLL:ST.lonLL||null,lonLLq:ST.lonLLq||"",base:ST.base||"",parLL:ST.parLL||null,parLLq:ST.parLLq||"",ritmo:ST.ritmo||"",meals:ST.meals||{},paOrd:ST.paOrd||{},lunchAt:ST.lunchAt||{},transMode:ST.transMode||"auto",hot:ST.hot||{},tk:ST.tk||{},chk:ST.chk||{},mealOpt:ST.mealOpt||{},rate:ST.rate||1100,foodStyle:ST.foodStyle||"local",by:user.email,at:Date.now()});sync("☁ Guardado para los dos","ok")}catch(e){sync("No se pudo guardar","ro")}},600)}

// ===== Ingreso =====
async function boot(){
  if(DEMO){try{ST=Object.assign(ST,JSON.parse(localStorage.getItem(TRIP.ls+"_demo")||"{}"))}catch(e){}user={email:"demo@local",displayName:"Modo demo"};return render()}
  const B="https://www.gstatic.com/firebasejs/10.12.2/";
  const [A,U,FS]=await Promise.all([import(B+"firebase-app.js"),import(B+"firebase-auth.js"),import(B+"firebase-firestore.js")]);
  F=FS;const fa=A.initializeApp(FB),auth=U.getAuth(fa),db=FS.getFirestore(fa);ref=FS.doc(db,...TRIP.doc);
  window._auth={U,auth};
  if(U.isSignInWithEmailLink(auth,location.href)){let em="";try{em=localStorage.getItem(TRIP.ls+"_email")||""}catch(e){}
    if(!em)em=prompt("Confirma tu correo")||"";try{await U.signInWithEmailLink(auth,em,location.href);history.replaceState(null,"",location.pathname)}catch(e){gate("El link expiró o ya se usó. Pide uno nuevo.")}}
  U.onAuthStateChanged(auth,u=>{if(!u||u.isAnonymous){user=null;return gate()}user=u;listen()})}
let unsub=null;
function listen(){if(unsub)unsub();unsub=F.onSnapshot(ref,s=>{const d=s.exists()?s.data():{};ST.wiz=d.wiz||{};ST.esc=d.esc||[];ST.step=d.step||0;ST.paSel=d.paSel||{};ST.paPin=d.paPin||{};ST.base=d.base||"";ST.paJun=d.paJun||{};ST.jun=d.jun||{};ST.ritmoT=d.ritmoT||{};ST.soloOrg=!!d.soloOrg;ST.favs=d.favs||[];ST.custom=d.custom||{};ST.dayBlk=d.dayBlk||{};ST.loOrg=!!d.loOrg;ST.lonLL=d.lonLL||null;ST.lonLLq=d.lonLLq||"";ST.parLL=d.parLL||null;ST.parLLq=d.parLLq||"";ST.ritmo=d.ritmo||"";ST.meals=d.meals||{};ST.paOrd=d.paOrd||{};ST.lunchAt=d.lunchAt||{};ST.transMode=d.transMode||"auto";ST.hot=d.hot||{};ST.tk=d.tk||{};ST.chk=d.chk||{};ST.mealOpt=d.mealOpt||{};ST.rate=d.rate||1100;ST.foodStyle=d.foodStyle||"local";render()},e=>{gate(null,true)})}
function gate(msg,denied){app.innerHTML=`<div class="gate"><div class="logo"><img src="/img/logo-marcopolo.jpg" alt="Marco Polo"></div>
  <span class="eyebrow">Viaje privado</span><h1>Viaje a París</h1>
  ${denied?`<p class="note bad">Este viaje es privado y <b>${esc(user&&user.email)}</b> no está autorizado. Pídele a Francisco que agregue tu correo.</p><p><button class="btn alt" id="out">Entrar con otra cuenta</button></p>`:`
  <p class="muted">Entra con tu cuenta para ver y editar el plan. Solo las personas invitadas pueden verlo.</p>
  ${msg?`<p class="note bad">${esc(msg)}</p>`:""}
  <button class="btn gbtn" id="g"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.6z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.3 0-11.6-4-13.5-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg>Entrar con Google</button>
  <div class="or">o con un link a tu correo</div>
  <form id="mf" class="stack"><input type="email" id="em" required placeholder="tu@correo.com" autocomplete="email"><button class="btn alt" type="submit">Enviarme el link</button></form>
  <p id="mm" class="muted" style="font-size:14px"></p>`}
  <p style="margin-top:22px"><a href="/">← Volver a Marco Polo</a></p></div>`;
  const g=$("#g");if(g)g.onclick=async()=>{const {U,auth}=window._auth;try{await U.signInWithPopup(auth,new U.GoogleAuthProvider())}catch(e){if(e.code!=="auth/popup-closed-by-user")gate("No se pudo entrar con Google ("+e.code+").")}};
  const mf=$("#mf");if(mf)mf.onsubmit=async ev=>{ev.preventDefault();const {U,auth}=window._auth;const em=$("#em").value.trim();
    try{await U.sendSignInLinkToEmail(auth,em,{url:location.origin+location.pathname,handleCodeInApp:true});try{localStorage.setItem(TRIP.ls+"_email",em)}catch(e){}$("#mm").textContent="Listo: revisa tu correo y abre el link desde este mismo teléfono."}catch(e){$("#mm").textContent="No se pudo enviar ("+e.code+")."}};
  const o=$("#out");if(o)o.onclick=()=>window._auth.U.signOut(window._auth.auth)}

// ===== Resumen: línea de tiempo + calendario =====
function timeline(){const W=ST.wiz,it=[];
  if(W[K.ini])it.push([W[K.ini],"✈ Santiago → Londres",[W.ida_vuelo,W.ida_aerop&&"llega a "+W.ida_aerop].filter(Boolean).join(" · ")]);
  if(W[K.llega])it.push([W[K.llega],"🇬🇧 Londres con Alli",[W[K.lonDir],W[K.parIni]&&nights(W[K.llega],W[K.parIni])+" noches"].filter(Boolean).join(" · ")]);
  if(W[K.parIni])it.push([W[K.parIni],"🚄 Londres → París (inicio del viaje)",[W.eur_hora,W.eur_tren].filter(Boolean).join(" · ")]);
  [...ST.esc].sort((a,b)=>a.ini.localeCompare(b.ini)).forEach(e=>{const x=ESC.find(z=>z.id===e.id);if(!x)return;it.push([e.ini,`${x.p} ${x.n}`,e.fin===e.ini?"Excursión de un día":`${nights(e.ini,e.fin)} noche${nights(e.ini,e.fin)>1?"s":""} · vuelve ${pretty(e.fin)} · tren ${x.tr}`])});
  if(W[K.parFin])it.push([W[K.parFin],"✈ París → Santiago",[W.vue_vuelo,W.vue_aerop].filter(Boolean).join(" · ")]);
  it.sort((a,b)=>a[0].localeCompare(b[0]));
  return it.length?`<ol class="ptl">${it.map(([d,t,s])=>`<li><span class="d">${pretty(d).replace(" ","<br>")}</span><span><b>${esc(t)}</b><small>${esc(s||"")}</small></span></li>`).join("")}</ol>`:`<div class="empty">Completa la configuración para ver la línea de tiempo.</div>`}
function calendar(){const W=ST.wiz;if(!W[K.parIni]||!W[K.parFin])return"";
  const map={};ST.esc.forEach(e=>{const x=ESC.find(z=>z.id===e.id);if(!x)return;let d=e.ini;for(let i=0;i<=Math.max(0,nights(e.ini,e.fin));i++){map[d]=map[d]||[];map[d].push({x,first:d===e.ini,last:d===e.fin});d=add(d,1)}});
  let s=`<div class="cal">`,d=W[K.parIni],m=-1;const first=D(d);const lead=(first.getDay()+6)%7;
  ["L","M","M","J","V","S","D"].forEach(h=>s+=`<span class="h">${h}</span>`);
  s+=`<span class="m">${MON[first.getMonth()]}</span>`;
  for(let i=0;i<lead;i++)s+=`<span></span>`;
  while(d<=W[K.parFin]){const dd=D(d);if(dd.getMonth()!==m&&d!==W[K.parIni]&&dd.getDate()===1){s+=`<span class="m">${MON[dd.getMonth()]}</span>`;for(let i=0;i<(dd.getDay()+6)%7;i++)s+=`<span></span>`}m=dd.getMonth();
    const E=map[d];const c=E?E[0].x.c:"";const tr=E&&(E[0].first||E[0].last);s+=`<span class="c ${E?"es":"pa"} ${tr?"tr":""}" style="${c?`--c:${c}`:""}" title="${pretty(d)}${E?" · "+E.map(z=>z.x.n).join(", "):" · París"}">${dd.getDate()}</span>`;d=add(d,1)}
  return s+`</div><div class="clegend"><span><i style="background:color-mix(in srgb,#2e4f8f 16%,#fffdf6)"></i>París</span><span><i style="background:#a8352b"></i>Escapada</span><span><i style="outline:2px solid #a8352b;outline-offset:-2px;background:#fff"></i>Día de tren</span></div>`}
function overlap(ini,fin,skip){return ST.esc.some(e=>e!==skip&&!(fin<e.ini||ini>e.fin))}
function planForm(x,lim){const W=ST.wiz;const def=W[K.parIni]?add(W[K.parIni],3):"";const n0=x.k==="dia"?0:parseInt(x.nt)||1;
  return `<form class="plan" data-plan="${x.id}"><div class="row2"><label class="f">Fecha de ida<input type="date" name="ini" value="${def}" ${lim?`min="${W[K.parIni]}" max="${W[K.parFin]}"`:""} required></label>
  <label class="f">Noches<select name="n">${[0,1,2,3,4].map(n=>`<option value="${n}" ${n===n0?"selected":""}>${n?n+" noche"+(n>1?"s":""):"Solo el día"}</option>`).join("")}</select></label></div>
  <p class="warn" id="pw-${x.id}"></p><div class="act"><button class="btn sm" type="submit">Guardar</button><button class="btn alt sm" type="button" data-close>Cancelar</button></div></form>`}

// ===== Programa en París (fase 2) =====
// Precios adulto no residente UE, temporada 2026 (verificar antes de comprar). close = hora de cierre en invierno. cl = días cerrado (0=dom..6=sáb).
const PAR_DEF="4 rue Bachaumont, 75002 París";
function baseLL(){const W=ST.wiz||{};if(ST.parLL&&ST.parLLq===(W[K.parDir]||PAR_DEF))return ST.parLL;if(/bachaumont/i.test(W[K.parDir]||PAR_DEF))return [48.8659,2.3463];return BASES[ST.base]||BASES["Otro / centro"]}
async function geoPar(){const q=(ST.wiz||{}).par_dir;if(!q||/bachaumont/i.test(q))return;try{const r=await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(q+(/paris|parís/i.test(q)?"":", Paris")));const j=await r.json();if(j[0]){ST.parLL=[+j[0].lat,+j[0].lon];ST.parLLq=q;save();render()}}catch(e){}}
const km=(a,b)=>{const R=6371,t=x=>x*Math.PI/180;const d1=t(b[0]-a[0]),d2=t(b[1]-a[1]);const h=Math.sin(d1/2)**2+Math.cos(t(a[0]))*Math.cos(t(b[0]))*Math.sin(d2/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
const hm=x=>{const t=Math.round(x*60);return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")};
const mv=(a,b)=>{const k=km(a,b);return k<=1.2?k*0.22:0.25+k*0.06};
const isDefSel=a=>!!a.top;
const paSel=a=>ST.paSel&&a.id in ST.paSel?!!ST.paSel[a.id]:isDefSel(a);
const fmtE=v=>v?v.toLocaleString("es-CL",{maximumFractionDigits:2})+" €":"gratis";

function parisDays(){const W=ST.wiz;if(!W[K.parIni]||!W[K.parFin])return[];const out=[];
  const escDays=new Set();ST.esc.forEach(e=>{let d=e.ini;const n=Math.max(0,nights(e.ini,e.fin));for(let i=0;i<=n;i++){if(!(n>0&&i===n))escDays.add(d);d=add(d,1)}});
  for(let d=W[K.parIni];d<W[K.parFin];d=add(d,1)){if(escDays.has(d))continue;out.push({d,first:d===W[K.parIni],ret:ST.esc.some(e=>e.fin===d&&e.fin!==e.ini)})}
  return out}
// ===== Londres: actividades (precios adulto 2026 en £ convertidos a € con 1 £ = 1,17 €; verificar antes de comprar) =====
// ===== Ritmo por tramo =====
const RIT={rap:{n:"Rápido",cap:7.5,step:1,d:"muchas cosas por día"},int:{n:"Intermedio",cap:5.5,step:1,d:"equilibrado"},rel:{n:"Relajado",cap:4,step:2,d:"tiempo libre para caminar"}};
const TRAMOS=Object.fromEntries(TRIP.tramos.map(t=>[t.k,t.label])),K=TRIP.keys,tramoOf=k=>TRIP.tramos.find(t=>t.k===k);
function ritOf(k){const r=(ST.ritmoT||{})[k];if(r&&RIT[r])return r;const t=tramoOf(k);if(!t)return "int";return t.ritmoSiIntenso&&ST.ritmo==="intenso"?t.ritmoSiIntenso:t.ritmo||"int"}
function ritSel(k){const cur=ritOf(k);return `<div class="seg ritseg" role="group" aria-label="Ritmo ${TRAMOS[k]}">${Object.entries(RIT).map(([r,o])=>`<button type="button" data-rit="${k}|${r}" aria-pressed="${cur===r}" title="${o.d}">${o.n}</button>`).join("")}</div>`}
function bindRit(){document.querySelectorAll("[data-rit]").forEach(b=>b.onclick=()=>{const [k,r]=b.dataset.rit.split("|");ST.ritmoT=ST.ritmoT||{};ST.ritmoT[k]=r;save();render();toast(`Ritmo ${RIT[r].n.toLowerCase()} en ${TRAMOS[k]}: ${RIT[r].d}`)})}
// ===== Organizar París después de Alli =====
function soloDays(){const j=ST.jun||{};return parisDays().filter(x=>!(junOn()&&x.d>=j.ini&&x.d<=j.fin))}
function soloCard(A){const W=ST.wiz;if(!W[K.parIni]||!W[K.parFin])return"";const sd=soloDays();if(!sd.length)return"";const jun=ST.paJun||{};const L=PA.filter(a=>paSel(a)&&!jun[a.id]);const nb=sd.filter(x=>blkOf(x.d)).length;const R=A.R||{unpl:[]};const nun=R.unpl.filter(a=>!jun[a.id]).length;
  const tit=junOn()?"Organizar París después de Alli":"Organizar París";
  const head=`<span>🧭 <b>${tit}:</b> ${pretty(sd[0].d)} → ${pretty(sd[sd.length-1].d)} · ${sd.length} días · <b>${L.length}</b> actividad${L.length===1?"":"es"} · ritmo ${RIT[ritOf("PAS")].n.toLowerCase()}${nb?` · ${nb} bloqueado${nb>1?"s":""}`:""}${nun?` · <b class="bad">✕ no caben ${nun}</b>`:""}</span>`;
  if(!ST.soloOrg)return `<div class="jcard pas">${head}<span class="jact"><button type="button" class="btn sm" data-soloorg>✏️ Organizar</button></span></div>`;
  return `<div class="jcard pas open"><div class="jtop">${head}<button type="button" class="btn sm" data-solodone>✓ Listo · organizar</button></div>
   <span class="flab" style="display:block;margin-top:6px">1 · Ritmo</span>${ritSel("PAS")}
   ${blkUI(sd,2)}
   <span class="flab" style="display:block;margin-top:10px">3 · Escapadas</span><p class="muted" style="font-size:14px;margin:2px 0">Las escapadas elegidas ya ocupan sus días (${ST.esc.length?ST.esc.map(e=>{const x=ESC.find(z=>z.id===e.id);return x?short(x.n)+" "+pretty(e.ini):""}).join(" · "):"ninguna todavía"}). <button type="button" class="lnkb" data-gotab="esc">Elegir o cambiar escapadas →</button></p>
   <span class="flab" style="display:block;margin-top:10px">4 · ¿Qué quieren hacer en estos días?</span>
   <div class="jcats">${TYP.filter(t=>!["com","via","per","new"].includes(t[0])).map(([k,t])=>{const L2=PA.filter(a=>typOf(a)===k&&!jun[a.id]);if(!L2.length)return"";const n=L2.filter(paSel).length;
     return `<details class="pool" data-k="solo-${k}" ${n?"open":""}><summary>${t} <span class="poolcnt">(${n?n+" de ":""}${L2.length})</span></summary>${L2.map(a=>{const on=paSel(a),dd=ACTDAY[a.id];return `<div class="poolrow${on?" on":""}"><label class="chk"><input type="checkbox" data-pasel="${a.id}" ${on?"checked":""}><span class="t">${a.n}${a.top?'<span class="top">★ famosa</span>':""}${a.in?" 🏛":""}<small>~${String(a.h).replace(".",",")} h · ${a.p?fmt(a.p):"gratis"}</small></span></label>${on?`<small class="pdst${dd?"":" bad"}">${dd?`✔ ${pretty(dd)}`:"⚠ No cabe"}</small>`:""}</div>`}).join("")}</details>`}).join("")}</div></div>`}
function bindSolo(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-soloorg]",b=>b.onclick=()=>{ST.soloOrg=true;save();render()});
  Q("[data-solodone]",b=>b.onclick=()=>{ST.soloOrg=false;const sd=new Set(soloDays().map(x=>x.d));const jun=ST.paJun||{};PA.forEach(a=>{if(!jun[a.id]&&ST.paPin&&ST.paPin[a.id]&&!blkOf(ST.paPin[a.id])&&sd.has(ST.paPin[a.id]))delete ST.paPin[a.id]});if(ST.paOrd)Object.keys(ST.paOrd).forEach(k=>{if(sd.has(k))delete ST.paOrd[k]});save();render();toast("🧭 París organizado en los días disponibles");const t=document.getElementById("daytabs");if(t)t.scrollIntoView({behavior:"smooth"})})}

// Arma el programa: agrupa por zona, reparte zonas en los días (dejando días libres), ordena por cercanía desde la base.
// Ventana «juntas»: las actividades marcadas como juntas se reparten solo en esos días (ritmo intenso).
function schedule(days,sel,base,opt){opt=opt||{};const pin=ST.paPin||{};
  const plan=days.map(x=>{const b=blkOf(x.d);const R=RIT[opt.rit?opt.rit(x):"int"]||RIT.int;const cap0=x.first||x.ret?Math.min(3,R.cap):R.cap;return {...x,acts:[],ev:[],blk:b,cap:!b?cap0:b.k==='am'||b.k==='pm'?Math.min(cap0,3.5):0,base}});
  const byDay=d=>plan.find(p=>p.d===d),dow=p=>D(p.d).getDay();
  const okDay=(p,a)=>!(p.blk&&(p.blk.k==='free'||p.blk.k==='busy'||(p.blk.k==='pm'&&(a.eve||a.eveok||a.lateo))))&&!(a.cl&&a.cl.includes(dow(p)))&&!(a.from&&p.d<a.from)&&!(a.to&&p.d>a.to)&&!(a.no&&a.no.includes(p.d));
  const load=p=>p.acts.reduce((t,a)=>t+a.h+0.3,0);
  const lateOn=(a,p)=>a.lateo&&a.lateo[dow(p)]!=null;
  sel.filter(a=>pin[a.id]&&byDay(pin[a.id])).forEach(a=>{const p=byDay(pin[a.id]);(a.eve||(lateOn(a,p)&&!p.ev.length)?p.ev:p.acts).push(a)});
  const placed=new Set(plan.flatMap(p=>[...p.acts,...p.ev]));
  const dist=(acts,P,step)=>{if(!P.length)return;
    acts.filter(a=>!placed.has(a)&&a.eve).forEach(a=>{const p=P.filter(p=>okDay(p,a)).sort((x,y)=>x.ev.length-y.ev.length||(x.first?1:0)-(y.first?1:0))[0];if(p){p.ev.push(a);placed.add(a)}});
    acts.filter(a=>!placed.has(a)&&a.lateo).forEach(a=>{const p=P.find(p=>lateOn(a,p)&&!p.ev.length&&okDay(p,a));if(p){p.ev.push(a);placed.add(a)}});
    acts.filter(a=>!placed.has(a)&&a.eveok).forEach(a=>{const p=P.filter(p=>!p.ev.length&&okDay(p,a)&&!p.first)[0];if(p){p.ev.push(a);placed.add(a)}});
    const rest=acts.filter(a=>!placed.has(a));
    const zones={};rest.forEach(a=>(zones[a.z]=zones[a.z]||[]).push(a));
    const zl=Object.values(zones).sort((x,y)=>y.reduce((t,a)=>t+(a.top?2:0)+a.h,0)-x.reduce((t,a)=>t+(a.top?2:0)+a.h,0));
    let ix=P.findIndex(p=>!p.first)+1;if(ix<1)ix=0;
    zl.forEach(z=>{let left=[...z];while(left.length){let tries=0,p=null;
        while(tries<P.length){const c=P[(ix+tries)%P.length];if(c&&load(c)+left[0].h<=c.cap&&!c.acts.length&&okDay(c,left[0])){p=c;break}tries++}
        if(!p)p=P.filter(c=>load(c)+left[0].h<=c.cap&&okDay(c,left[0])).sort((a,b)=>load(a)-load(b))[0];
        if(!p){left.shift();continue}
        {const a=left.shift();p.acts.push(a);placed.add(a)}while(left.length&&load(p)+left[0].h+0.3<=p.cap+0.01&&okDay(p,left[0])){const a=left.shift();p.acts.push(a);placed.add(a)}
        ix=(P.indexOf(p)+step)%P.length}})};
  const step=(RIT[opt.restRit||"int"]||RIT.int).step,stepJ=(RIT[opt.junRit||"rap"]||RIT.rap).step;
  const J=opt.jun?plan.filter(p=>p.jun):[];
  if(J.length){const jun=ST.paJun||{};
    dist(sel.filter(a=>jun[a.id]),J,stepJ);
    const out=plan.filter(p=>!p.jun);dist(sel.filter(a=>!jun[a.id]),out.length?out:plan,step)}
  else dist(sel,plan,step);
  dist(sel.filter(a=>!(J.length&&(ST.paJun||{})[a.id])),plan,step);// lo que no cupo: cualquier día con espacio
  plan.forEach(p=>{let pos=base,t=p.first||p.ret||(p.blk&&p.blk.k==='am')?14.5:9.5,rest=p.acts.slice(),seq=[];
    const ord=(ST.paOrd||{})[p.d];p.man=!!(ord&&ord.length);const oi=a=>{const i=ord?ord.indexOf(a.id):-1;return i<0?99:i};
    while(rest.length){const fx=!p.man&&rest.find(a=>a.at);
      if(fx)rest.splice(rest.indexOf(fx),1),rest.unshift(fx);
      else if(p.man)rest.sort((a,b)=>oi(a)-oi(b));else rest.sort((a,b)=>{const ca=(a.close||24)-(b.close||24);return (mv(pos,a.ll)-mv(pos,b.ll))+(Math.abs(ca)>2?ca*0.15:0)});
      const a=rest.shift();t+=a.noloc?0:mv(pos,a.ll);if(a.at&&t<a.at)t=a.at;
      if(!seq.lunch&&!p.first&&!p.ret&&t<15&&(t>=12.75||(t+a.h>13.5&&t>=11.5))){seq.lunch=Math.max(t,13);seq.lunchPos=a.noloc?pos:a.ll;t=seq.lunch+1}seq.push({...a,st:t,late:a.close&&t+a.h>a.close+0.01,closed:a.cl&&a.cl.includes(D(p.d).getDay())});t+=a.h;if(!a.noloc)pos=a.ll}
    if(!seq.lunch&&seq.length&&!p.first&&!p.ret&&t>=11.25&&t<=15){seq.lunch=Math.max(t,13);seq.lunchPos=pos;t=seq.lunch+1}
    p.ev.forEach(a=>{const lo=a.lateo&&a.lateo[D(p.d).getDay()];t=Math.max(t+(a.noloc?0:mv(pos,a.ll)),a.eve?18:17.25,a.at||0);seq.push({...a,st:t,night:1,late:lo!=null?t+a.h>lo+0.01:false,closed:a.cl&&a.cl.includes(D(p.d).getDay())});t+=a.h;if(!a.noloc)pos=a.ll});
    p.acts=p.acts.concat(p.ev);p.seq=seq;p.end=t});
  return {plan,unpl:sel.filter(a=>!plan.some(p=>p.acts.includes(a)))}}
function junOn(){const j=ST.jun;return !!(j&&j.ini&&j.fin&&j.use!==false)}
function buildPA(){const j=ST.jun||{};const days=parisDays().map(x=>({...x,jun:junOn()&&x.d>=j.ini&&x.d<=j.fin}));
  return schedule(days,PA.filter(paSel),baseLL(),{jun:true,rit:x=>x.jun?ritOf("PAJ"):ritOf("PAS"),junRit:ritOf("PAJ"),restRit:ritOf("PAS")})}
const loSel=a=>!!(ST.paSel&&ST.paSel[a.id]);
function lonDays(){const W=ST.wiz;if(!W[K.llega]||!W[K.parIni]||W[K.llega]>=W[K.parIni])return[];const out=[];for(let d=W[K.llega];d<W[K.parIni];d=add(d,1))out.push({d,first:d===W[K.llega]});return out}
function lonBase(){const W=ST.wiz||{};if(ST.lonLL&&W[K.lonDir]&&ST.lonLLq===W[K.lonDir])return ST.lonLL;return LONDON}
function buildLO(){return schedule(lonDays(),LON.filter(loSel),lonBase(),{rit:()=>ritOf("LO"),restRit:ritOf("LO")})}
const actById=id=>PA.find(a=>a.id===id)||LON.find(a=>a.id===id);
const isLO=id=>String(id).startsWith("lo_");
const selOf=a=>a?(isLO(a.id)?loSel(a):paSel(a)):false;

// ===== Modo juntas =====
function junDays(){const j=ST.jun||{};return junOn()?parisDays().filter(x=>x.d>=j.ini&&x.d<=j.fin):[]}
const isJunDay=d=>{const j=ST.jun||{};return junOn()&&d>=j.ini&&d<=j.fin};
// ===== Días bloqueados / libres (pregunta antes de organizar) =====
const BLK_OPT=[["","Disponible"],["free","🌿 Día libre"],["busy","🔒 Ocupado todo el día"],["am","🔒 Mañana ocupada"],["pm","🔒 Tarde ocupada"]];
const blkOf=d=>(ST.dayBlk||{})[d]||null;
function blkUI(days,num){return `<div class="blkq"><span class="flab">${num} · ¿Algún día ya comprometido?</span><p class="muted">Si tienen una entrada comprada, un plan fijo o quieren días sin actividades, márquenlo: esos días quedan fuera del reparto automático y el resto se organiza en los días que quedan.</p><div class="blkgrid">${days.map(x=>{const b=blkOf(x.d)||{};return `<div class="blkrow${b.k?" on":""}"><b>${pretty(x.d)}</b><select data-blk="${x.d}" aria-label="Disponibilidad del ${pretty(x.d)}">${BLK_OPT.map(([k,t])=>`<option value="${k}" ${(b.k||"")===k?"selected":""}>${t}</option>`).join("")}</select>${b.k&&b.k!=="free"?`<input data-blkt="${x.d}" value="${esc(b.t||"")}" placeholder="¿Qué tienen? Ej.: entradas Harry Potter 10:30" aria-label="Qué tienen el ${pretty(x.d)}">`:""}</div>`}).join("")}</div></div>`}
function blkNote(d){const b=blkOf(d.d);if(!b||(d.city!=="PA"&&d.city!=="LO"))return"";
  return `<span class="blknote ${b.k==="free"?"free":""}">${b.k==="free"?"🌿 <b>Día libre</b>: sin actividades programadas":`🔒 <b>${b.k==="am"?"Mañana ocupada":b.k==="pm"?"Tarde y noche ocupadas":"Día ocupado"}</b>${b.t?": "+esc(b.t):""}`}</span>`}
function loOrgCard(A){const ld=lonDays();if(!ld.length)return"";const n=LON.filter(loSel).length;const nb=ld.filter(x=>blkOf(x.d)).length;const lr=A.RL||{unpl:[]};
  const head=`<span>🧭 <b>Organizar Londres (con Alli):</b> ${ld.length} días · <b>${n}</b> actividad${n===1?"":"es"}${nb?` · ${nb} día${nb>1?"s":""} bloqueado${nb>1?"s":""} o libre${nb>1?"s":""}`:""}${lr.unpl.length?` · <b class="bad">✕ no caben ${lr.unpl.length}</b>`:""}</span>`;
  if(!ST.loOrg)return `<div class="jcard lo">${head}<span class="jact"><button type="button" class="btn sm" data-loorg>✏️ Organizar Londres</button></span></div>`;
  return `<div class="jcard lo open"><div class="jtop">${head}<button type="button" class="btn sm" data-loorgdone>✓ Listo · organizar</button></div>
   <span class="flab" style="display:block;margin-top:6px">Ritmo</span>${ritSel("LO")}
   ${blkUI(ld,1)}
   <span class="flab" style="display:block;margin-top:10px">2 · ¿Qué quieren hacer?</span><p class="muted" style="margin:2px 0 6px;font-size:14px">Marquen todo lo que les interese: se reparte en los días disponibles, por barrio desde el alojamiento, con los museos que abren de noche después del atardecer y los eventos en sus fechas.</p>
   <div class="jcats">${TYP.filter(t=>!["com","via"].includes(t[0])).map(([k,t])=>{const L=LON.filter(a=>typOf(a)===k);if(!L.length)return"";const ns=L.filter(loSel).length;
     return `<details class="pool" data-k="lorg-${k}" ${ns?"open":""}><summary>${t} <span class="poolcnt">(${ns?ns+" de ":""}${L.length})</span></summary>${L.map(a=>{const on=loSel(a),dd=ACTDAY[a.id];return `<div class="poolrow${on?" on":""}"><label class="chk"><input type="checkbox" data-pasel="${a.id}" ${on?"checked":""}><span class="t">${a.n}${a.top?'<span class="top">★ famosa</span>':""}${a.in?" 🏛":""}<small>~${String(a.h).replace(".",",")} h · ${a.p?fmt(a.p):"gratis"}</small></span></label>${on?`<small class="pdst${dd?"":" bad"}">${dd?`✔ ${pretty(dd)}`:"⚠ No cabe en los días disponibles"}</small>`:""}</div>`}).join("")}</details>`}).join("")}</div></div>`}
function bindBlk(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-blk]",x=>x.onchange=()=>{ST.dayBlk=ST.dayBlk||{};const d=x.dataset.blk;if(x.value)ST.dayBlk[d]={...(ST.dayBlk[d]||{}),k:x.value};else delete ST.dayBlk[d];save();render();const n=document.querySelector(`[data-blkt="${d}"]`);if(n)n.focus()});
  Q("[data-blkt]",x=>x.onchange=()=>{ST.dayBlk=ST.dayBlk||{};const d=x.dataset.blkt;if(ST.dayBlk[d]){ST.dayBlk[d].t=x.value.trim();save();render()}});
  Q("[data-loorg]",b=>b.onclick=()=>{ST.loOrg=true;save();render()});
  Q("[data-loorgdone]",b=>b.onclick=()=>{ST.loOrg=false;const ld=new Set(lonDays().map(x=>x.d));LON.forEach(a=>{if(ST.paPin&&ST.paPin[a.id]&&!blkOf(ST.paPin[a.id]))delete ST.paPin[a.id]});if(ST.paOrd)Object.keys(ST.paOrd).forEach(k=>{if(ld.has(k))delete ST.paOrd[k]});save();render();const n=LON.filter(loSel).length;toast(`🧭 Londres organizado: ${n} actividad${n===1?"":"es"} en los días disponibles`);const t=document.getElementById("daytabs");if(t)t.scrollIntoView({behavior:"smooth"})})}

function jCard(A){const W=ST.wiz;if(!W[K.parIni]||!W[K.parFin])return"";const j=ST.jun||{};
  if(!j.ini)return `<div class="jcard off"><span>👭 <b>Días con Alli</b> · elijan lo que quieren ver mientras Alli está en París; se reparte solo en esos días (ritmo intenso). El resto de París queda para después.</span><button type="button" class="btn sm" data-jstart>Configurar días con Alli</button></div>`;
  const JD=junDays(),jun=ST.paJun||{};const JL=PA.filter(a=>jun[a.id]&&paSel(a));
  const need=JL.reduce((t,a)=>t+a.h+0.3,0),avail=JD.reduce((t,x)=>{const b=blkOf(x.d);const c=x.first||x.ret?3:7;return t+(!b?c:b.k==="am"||b.k==="pm"?Math.min(c,3.5):0)},0);
  const R=A.R||{unpl:[]};const nun=R.unpl.filter(a=>jun[a.id]).length;
  const head=`<span>👭 <b>Días con Alli:</b> ${pretty(j.ini)} → ${pretty(j.fin)} · ${JD.length} días · <b>${JL.length}</b> actividad${JL.length===1?"":"es"} · ${need.toFixed(1)} / ${avail.toFixed(1)} h${nun?` · <b class="bad">✕ no caben ${nun}</b>`:""}</span>`;
  if(!j.mode)return `<div class="jcard">${head}<span class="jact"><button type="button" class="btn sm" data-jmode>✏️ Organizar días con Alli</button></span></div>`;
  const last=parisDays().slice(-1)[0];
  return `<div class="jcard open"><div class="jtop">${head}<button type="button" class="btn sm" data-jdone>✓ Listo · volver al programa</button></div>
   <p class="muted" style="margin:6px 0 8px;font-size:14px">Marquen lo que quieren hacer <b>con Alli</b>: se reparte solo entre estos días, agrupado por barrio y con ritmo intenso. Después pueden mover, agregar o quitar como siempre.</p>
   <span class="flab" style="display:block">Ritmo</span>${ritSel("PAJ")}<span class="flab" style="display:block;margin-top:8px">1 · ¿Qué días está Alli en París?</span><div class="jdates"><label>Desde<input type="date" data-jini value="${j.ini}" min="${W[K.parIni]}" max="${last?last.d:W[K.parFin]}"></label><label>Hasta<input type="date" data-jfin value="${j.fin}" min="${W[K.parIni]}" max="${last?last.d:W[K.parFin]}"></label><button type="button" class="lnkb" data-jclear>Quitar modo juntas</button></div>
   ${blkUI(parisDays(),2)}<span class="flab" style="display:block;margin-top:10px">3 · ¿Qué quieren hacer con Alli?</span>
   <div class="meter"><span style="width:${Math.min(100,need/Math.max(avail,0.1)*100)}%;background:var(${need>avail?"--bad":"--ok"})"></span></div>
   <div class="jcats">${TYP.filter(t=>!["com","via"].includes(t[0])).map(([k,t])=>{const L=PA.filter(a=>typOf(a)===k);if(!L.length)return"";const n=L.filter(a=>jun[a.id]&&paSel(a)).length;
     return `<details class="pool" data-k="jun-${k}" ${n?"open":""}><summary>${t} <span class="poolcnt">(${n?n+" de ":""}${L.length})</span></summary>${L.map(a=>{const on=!!(jun[a.id]&&paSel(a)),dd=ACTDAY[a.id];return `<div class="poolrow${on?" on":""}"><label class="chk"><input type="checkbox" data-jsel="${a.id}" ${on?"checked":""}><span class="t">${a.n}${a.top?'<span class="top">★ famosa</span>':""}${a.in?" 🏛":""}<small>~${String(a.h).replace(".",",")} h · ${a.p?fmt(a.p):"gratis"}${!on&&paSel(a)?" · ya está en el programa (fuera de los días con Alli)":""}</small></span></label>${on?`<small class="pdst${dd?"":" bad"}">${dd?`👭 ${pretty(dd)}`:"⚠ No cabe en los días con Alli"}</small>`:""}</div>`}).join("")}</details>`}).join("")}</div></div>`}
function bindJun(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);const W=ST.wiz;
  Q("[data-jstart]",b=>b.onclick=()=>{const pd=parisDays();const fin=pd[Math.min(pd.length-1,8)];ST.jun={ini:W[K.parIni],fin:fin?fin.d:W[K.parIni],mode:true};save();render()});
  Q("[data-jmode]",b=>b.onclick=()=>{ST.jun.mode=true;save();render()});
  Q("[data-jdone]",b=>b.onclick=()=>{ST.jun.mode=false;save();render();const n=PA.filter(a=>(ST.paJun||{})[a.id]&&paSel(a)).length;toast(`👭 ${n} actividad${n===1?"":"es"} repartidas en los días con Alli`);const t=document.getElementById("daytabs");if(t)t.scrollIntoView({behavior:"smooth"})});
  Q("[data-jclear]",b=>b.onclick=()=>{if(!b.dataset.sure){b.dataset.sure=1;b.textContent="¿Seguro? Toca otra vez para quitarlo";return}ST.jun={};ST.paJun={};save();render()});
  Q("[data-jini],[data-jfin]",x=>x.onchange=()=>{if(!x.value)return;ST.jun[x.matches("[data-jini]")?"ini":"fin"]=x.value;if(ST.jun.fin<ST.jun.ini)ST.jun.fin=ST.jun.ini;save();render()});
  Q("[data-jsel]",x=>x.onchange=()=>{const id=x.dataset.jsel;ST.paSel=ST.paSel||{};ST.paJun=ST.paJun||{};ST.paSel[id]=x.checked;if(x.checked)ST.paJun[id]=true;else delete ST.paJun[id];if(ST.paPin)delete ST.paPin[id];save();render();toast(x.checked?(ACTDAY[id]?`👭 <b>${esc(actById(id).n)}</b> → ${pretty(ACTDAY[id])}`:`⚠ <b>${esc(actById(id).n)}</b> no cabe en los días con Alli`):`✕ ${esc(actById(id).n)} quitada`)});
  Q("[data-loauto]",b=>b.onclick=()=>{const ld=new Set(lonDays().map(x=>x.d));LON.forEach(a=>{if(ST.paPin)delete ST.paPin[a.id]});if(ST.paOrd)Object.keys(ST.paOrd).forEach(k=>{if(ld.has(k))delete ST.paOrd[k]});save();render();toast("⚡ Londres ordenado: por barrio desde el alojamiento, museos con horario nocturno después del atardecer")});
  Q("[data-wxswap]",b=>b.onclick=()=>{const [a,da,c,dc]=b.dataset.wxswap.split("|");ST.paPin=ST.paPin||{};ST.paPin[a]=da;if(c)ST.paPin[c]=dc;save();render();toast("☂ Cambio aplicado")})}
// ===== Londres: lista para agregar =====
function loPool(A){const lr=A.RL||{unpl:[]};const n=LON.filter(loSel).length;
  return `<span class="eyebrow" style="margin-top:6px">Actividades en Londres · ${n} elegida${n===1?"":"s"}</span>
   ${n?`<button type="button" class="btn sm" data-loauto title="Quita días fijados y orden manual en Londres">⚡ Ordenar Londres automáticamente</button><small class="muted" style="font-size:12.5px">Agrupa por barrio desde el alojamiento; museos que abren de noche (vie/sáb) quedan después del atardecer.</small>`:`<small class="muted" style="font-size:13px">Marquen lo que quieren ver: se reparte solo por barrios.</small>`}
   ${lr.unpl.length?`<span class="status bad">No caben ${lr.unpl.length}: ${lr.unpl.map(a=>a.n).join(", ")}</span>`:""}
   ${TYP.filter(t=>!["com","via"].includes(t[0])).map(([k,t])=>{const L=LON.filter(a=>typOf(a)===k);if(!L.length)return"";const ns=L.filter(loSel).length;
     return `<details class="pool" data-k="lo-${k}"><summary>${t} <span class="poolcnt">(${ns?ns+" de ":""}${L.length})</span></summary>${L.map(a=>{const on=loSel(a),dd=ACTDAY[a.id],pin=(ST.paPin||{})[a.id];return `<div class="poolrow${on?" on":""}"><label class="chk"><input type="checkbox" data-pasel="${a.id}" ${on?"checked":""}><span class="t">${a.n}${a.top?'<span class="top">★ famosa</span>':""}${a.in?" 🏛":""}${a.lateo?' <span class="tag nite">🌙 abre de noche</span>':""}<small>~${String(a.h).replace(".",",")} h · ${a.p?fmt(a.p):"gratis"} · <a href="${a.u}" target="_blank" rel="noopener">sitio</a></small></span></label>${daySelPA(a.id,"poolday")}${on?`<small class="pdst${dd?"":" bad"}">${dd?`✔ ${pretty(dd)} · ${pin?"día fijado":"día automático"} · <a href="#" data-goday="${dd}">ver el día →</a>`:"⚠ No cabe: elige otro día"}</small>`:""}</div>`}).join("")}</details>`}).join("")}`}
// ===== Pronóstico del tiempo (Open-Meteo) =====
let WX={};
const WXI=c=>c===0?"☀️":c<=2?"🌤":c===3?"☁️":c<=48?"🌫":c<=57?"🌦":c<=67?"🌧":c<=77?"🌨":c<=82?"🌧":"⛈";
function wxLoad(k){if(WX[k])return;WX[k]={loading:1};const ll=k==="LO"?LONDON:PARIS;
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ll[0]}&longitude=${ll[1]}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=16`).then(r=>r.json()).then(j=>{const o={};(j.daily.time||[]).forEach((t,i)=>o[t]={c:j.daily.weather_code[i],mx:j.daily.temperature_2m_max[i],mn:j.daily.temperature_2m_min[i],pp:j.daily.precipitation_probability_max[i],mm:j.daily.precipitation_sum[i]});WX[k]={d:o,at:Date.now()};if(tab==="prog")render()}).catch(()=>{WX[k]={err:1}})}
const wxOf=(k,d)=>{const w=WX[k]&&WX[k].d&&WX[k].d[d];return w&&w.mx!=null&&w.pp!=null?w:null};
const rainy=w=>w&&(w.pp>=60||(w.pp>=40&&w.mm>=4)),dry=w=>w&&w.pp<40&&w.mm<1.5;
function wxMini(k,d){const w=wxOf(k,d);return w?`<span class="wxm" title="Pronóstico: ${Math.round(w.mn)}–${Math.round(w.mx)} °C · lluvia ${w.pp}%">${WXI(w.c)} ${Math.round(w.mx)}°</span>`:""}
function wxCard(A,k){const ds=A.days.filter(d=>d.city===k&&d.kind!=="final");if(!ds.length)return"";const today=iso(new Date()),lim=add(today,15);
  if(ds[0].d>lim)return `<div class="wxcard muted">🌦 El pronóstico del tiempo de ${k==="LO"?"Londres":"París"} aparece aquí desde el ${pretty(add(ds[0].d,-15))} (16 días antes), con sugerencias si llueve.</div>`;
  if(ds[ds.length-1].d<today)return"";wxLoad(k);if(!WX[k]||WX[k].loading)return `<div class="wxcard muted">🌦 Cargando pronóstico…</div>`;if(WX[k].err)return `<div class="wxcard muted">🌦 No se pudo cargar el pronóstico.</div>`;
  const vis=ds.filter(d=>wxOf(k,d.d));if(!vis.length)return"";
  const sug=[];vis.forEach(d=>{const w=wxOf(k,d.d);if(!rainy(w)||!d.pa)return;d.pa.seq.filter(a=>!a.in&&!a.night&&!a.at).forEach(a=>{if(sug.length>=3)return;
      const alt=vis.filter(e=>e!==d&&e.pa&&dry(wxOf(k,e.d))&&e.kind!=="first");let best=null;alt.forEach(e=>e.pa.seq.filter(b=>b.in&&!b.night&&!b.at&&!(b.cl&&b.cl.includes(D(d.d).getDay()))).forEach(b=>{if(!best||Math.abs(b.h-a.h)<Math.abs(best.b.h-a.h))best={e,b}}));
      if(best)sug.push(`<li>☂ <b>${pretty(d.d)}</b> (lluvia ${wxOf(k,d.d).pp}%): cambiar <b>${esc(a.n)}</b> por <b>${esc(best.b.n)}</b> (🏛 techado), que pasa al ${pretty(best.e.d)} con ${WXI(wxOf(k,best.e.d).c)}. <button type="button" class="btn sm" data-wxswap="${a.id}|${best.e.d}|${best.b.id}|${d.d}">Aplicar cambio</button></li>`);
      else{const dd=dry(wxOf(k,d.d));const e=alt.find(e=>!(a.cl&&a.cl.includes(D(e.d).getDay())));if(e)sug.push(`<li>☂ <b>${pretty(d.d)}</b> (lluvia ${wxOf(k,d.d).pp}%): mover <b>${esc(a.n)}</b> (al aire libre) al ${pretty(e.d)}. <button type="button" class="btn sm" data-wxswap="${a.id}|${e.d}||">Mover</button></li>`)}})});
  return `<div class="wxcard"><div class="wxh"><span class="eyebrow">Pronóstico · ${k==="LO"?"Londres":"París"}</span><small class="muted">Open-Meteo · se actualiza al abrir</small></div>
   <div class="wxrow">${vis.map(d=>{const w=wxOf(k,d.d);return `<button type="button" class="wxd${rainy(w)?" wet":""}" data-calgo="${d.id}" title="${pretty(d.d)}: ${Math.round(w.mn)}–${Math.round(w.mx)} °C, lluvia ${w.pp}% (${w.mm} mm)"><small>${pretty(d.d).replace(/ [a-zé]+$/,"")}</small><span class="wi">${WXI(w.c)}</span><b>${Math.round(w.mx)}°</b><small>${Math.round(w.mn)}° · ${w.pp}%</small></button>`}).join("")}</div>
   ${sug.length?`<ul class="wxsug">${sug.join("")}</ul>`:`<small class="muted">${vis.some(d=>rainy(wxOf(k,d.d)))?"Días con lluvia: el programa de esos días ya es techado o está libre.":"Sin lluvia importante en el pronóstico."}</small>`}</div>`}
async function geoLon(){const q=(ST.wiz||{}).lon_dir;if(!q)return;try{const r=await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(q+(/london|londres/i.test(q)?"":", London")));const j=await r.json();if(j[0]){ST.lonLL=[+j[0].lat,+j[0].lon];ST.lonLLq=q;save();render()}}catch(e){}}

function routeUrl(p){const base=p.base||baseLL();const pts=p.seq.filter(a=>!a.noloc).map(a=>a.ll.join(","));if(!pts.length)return"";
  return `https://www.google.com/maps/dir/?api=1&origin=${base.join(",")}&destination=${pts[pts.length-1]}${pts.length>1?`&waypoints=${encodeURIComponent(pts.slice(0,-1).join("|"))}`:""}&travelmode=transit`}
function sunOf(date,ll){const y=date.getFullYear(),n=Math.round((Date.UTC(y,date.getMonth(),date.getDate())-Date.UTC(y,0,0))/864e5),g=2*Math.PI/365*(n-1),
  eq=229.18*(0.000075+0.001868*Math.cos(g)-0.032077*Math.sin(g)-0.014615*Math.cos(2*g)-0.040849*Math.sin(2*g)),
  de=0.006918-0.399912*Math.cos(g)+0.070257*Math.sin(g)-0.006758*Math.cos(2*g)+0.000907*Math.sin(2*g)-0.002697*Math.cos(3*g)+0.00148*Math.sin(3*g),
  la=ll[0]*Math.PI/180,lsun=d=>{const n0=new Date(Date.UTC(y,d==="m"?2:9,31));return 31-n0.getUTCDay()},
  dst=(m=>m>2&&m<9||(m===2&&date.getDate()>=lsun("m"))||(m===9&&date.getDate()<lsun("o")))(date.getMonth())?2:1,
  t=z=>{const c=Math.cos(z*Math.PI/180)/(Math.cos(la)*Math.cos(de))-Math.tan(la)*Math.tan(de);const ha=Math.acos(Math.max(-1,Math.min(1,c)))*180/Math.PI;return (720-4*(ll[1]-ha)-eq)/60+dst};
  return{set:t(90.833),dusk:t(96)}}
// zonas de precaución (orientativo; fuentes en Consejos)
const zonesNearPA=pts=>ZONES_PA.filter(z=>pts.some(p=>p&&km(p,z.ll)*1000<=z.r+120));
function tlSVG(tl){const W=720,H=96,pad=40,step=(W-2*pad)/(tl.length-1);
  let g=`<svg class="tlsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Línea de tiempo"><line x1="${pad}" y1="40" x2="${W-pad}" y2="40" stroke="currentColor" stroke-width="2"/>`;
  tl.forEach((e,i)=>{const x=pad+i*step;g+=`<circle cx="${x}" cy="40" r="6" fill="var(--stamp)"/><text x="${x}" y="24" text-anchor="middle" font-size="15" font-weight="700" fill="currentColor" font-family="Courier Prime,monospace">${e[0]}</text><text x="${x}" y="66" text-anchor="middle" font-size="12.5" fill="currentColor">${e[1]}</text>`});
  return g+"</svg>"}

// ===== Atracciones de París: fichas tipo expediente (como Alemania) =====
const GIq=q=>"https://www.google.com/search?tbm=isch&q="+encodeURIComponent(q);
const WKq=t=>"https://es.wikipedia.org/wiki/"+encodeURIComponent(t.replace(/ /g,"_"));
// f: [pie de foto, artículo de Wikipedia en español del que se toma la imagen]
const wkCache={};
async function wkThumb(t){if(t in wkCache)return wkCache[t];wkCache[t]=null;
  try{const r=await fetch("https://es.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(t.replace(/ /g,"_")));if(r.ok){const j=await r.json();wkCache[t]=(j.thumbnail&&j.thumbnail.source)||null}}catch(e){}
  return wkCache[t]}
function hydratePhotos(){document.querySelectorAll("img[data-wk]:not([src])").forEach(async im=>{const u=await wkThumb(im.dataset.wk);if(u){im.src=u}else{const s=document.createElement("span");s.className="ph";s.textContent="📷";im.replaceWith(s)}})}
function paFicha(a,i){const x=PA_F[a.id];const sel=paSel(a);
  return `<article class="ficha" id="fpa-${a.id}"><div class="ftab">EXP. PAR-${String(i+1).padStart(2,"0")} · ${a.z.toUpperCase()}</div>
   <header><h3>${a.n.replace(/\s*\(.*?\)\s*$/,"")}</h3>${x.y?`<span class="fy">${x.y}</span>`:""}${a.top?'<span class="fstamp">★ IMPERDIBLE</span>':""}${sel?'<span class="fstamp ok">EN EL PROGRAMA</span>':""}</header>
   <p class="flead">${a.s}</p>
   ${x.h&&x.h.length?`<div class="fhist"><span class="flab">Historia</span>${x.h.map(p=>`<p>${p}</p>`).join("")}</div>`:""}
   <div><span class="flab">Qué van a ver</span><p>${x.v||a.v}</p></div>
   <div class="fnote"><span class="flab">Dato / consejo</span>${x.d?`<p>${x.d}</p>`:""}<p><b>Práctico:</b> ${a.d}</p></div>
   <p class="fmeta">🕐 visita ~${String(a.h).replace(".",",")} h · ${fmtE(a.p)}${a.close?` · cierra ${hm(a.close)}`:""}${a.cl?` · cerrado ${a.cl.map(x=>DOW[x]).join(", ")}`:""}${a.in?" · 🏛 techado":""}</p>
   ${x.f&&x.f.length?`<div class="fphotos">${x.f.filter((f,j,A)=>A.findIndex(g=>g[1]===f[1])===j).map(f=>`<a class="polaroid" href="${GIq(f[0]+" "+a.n.replace(/\s*\(.*?\)/,"")+" París")}" target="_blank" rel="noopener"><span class="clip" aria-hidden="true"></span><img class="ph" data-wk="${f[1]}" alt="${f[0]}" loading="lazy"><span class="cap">${f[0]}</span><span class="go">más fotos →</span></a>`).join("")}</div><p class="credit">Fotos: Wikipedia / Wikimedia Commons · ${[...new Set(x.f.map(f=>f[1]))].map(t=>`<a href="${WKq(t)}" target="_blank" rel="noopener">${t}</a>`).join(" · ")}</p>`:""}
   <div class="flinks"><a href="${a.u}" target="_blank" rel="noopener">Sitio oficial ↗</a><a href="${WKq(x.w||a.n)}" target="_blank" rel="noopener">Wikipedia ↗</a><a href="https://www.google.com/maps/search/?api=1&query=${a.ll.join(",")}" target="_blank" rel="noopener">Mapa ↗</a>
   <button type="button" class="btn alt sm" data-fsel="${a.id}">${sel?"✕ Quitar del programa":"+ Agregar al programa"}</button>${daySelPA(a.id,"")}</div>
  </article>`}
// ===== Alojamiento =====
const uid=()=>Math.random().toString(36).slice(2,8);
function stays(){const W=ST.wiz;if(!W[K.parIni]||!W[K.parFin])return[];
  const escN=ST.esc.reduce((t,e)=>t+Math.max(0,nights(e.ini,e.fin)),0);
  const L=[{k:"par",n:"París",p:"🇫🇷",ini:W[K.parIni],fin:W[K.parFin],nn:nights(W[K.parIni],W[K.parFin])-escN,city:"Paris"}];
  ST.esc.filter(e=>nights(e.ini,e.fin)>0).sort((a,b)=>a.ini<b.ini?-1:1).forEach(e=>{const x=ESC.find(q=>q.id===e.id)||{n:e.id,p:""};L.push({k:"esc-"+e.id+"-"+e.ini,n:x.n,p:x.p,ini:e.ini,fin:e.fin,nn:nights(e.ini,e.fin),city:x.n})});
  return L}
const hotList=k=>((ST.hot||{})[k]||[]);
function hotNightPP(k){const S=stays().find(s=>s.k===k);const h=hotList(k).find(x=>x.sel);if(!h||!S||!+h.price)return 0;return (h.mode==="t"?+h.price/Math.max(1,S.nn):+h.price)/2}
let hotTab="par";
const bkUrl=(q,ci,co)=>`https://www.booking.com/searchresults.es.html?ss=${encodeURIComponent(q)}&checkin=${ci}&checkout=${co}&group_adults=2&no_rooms=1&group_children=0`;
// ===== Consejos =====
// ===== Espectáculos y eventos =====
// ini/fin: fechas (aprox. si ap=1). esc: id de escapada relacionada
// ===== Día de París con la lógica de Alemania: atracciones + anexo Comidas + Traslados y plano =====
// precios aproximados por persona (París 2026, verificar)
const PA_MEAL_DEF={d:true,a:true,m:false,c:true};
const METRO=2.55;// boleto metro/RER (RATP 2026)
let paBlk=new Set();
const mealOnP=(d,k)=>{const m=ST.meals||{};return (d+"|"+k) in m?!!m[d+"|"+k]:PA_MEAL_DEF[k]};
const LON_TR=10.5;// tope diario sin contacto zonas 1–2 (~£9, aprox.)
const MT=d=>d&&d.city==="LO"?LON_MEAL:PA_MEAL;
let BF_IX={};// desayuno: 1 de cada 4 días en boulangerie, el resto en la casa
const mealIxP=(d,k,T=PA_MEAL)=>{const o=ST.mealOpt||{},key=d+"|"+k;const i=key in o?o[key]|0:k==="d"?((BF_IX[d]??0)%4===0?0:2):(ST.foodStyle==="fast"&&(k==="a"||k==="c")?1:0);return Math.min(i,T[k].length-1)};
function legsOfDay(p){const base=p.base||baseLL();const L=[];let pos=base,nm="alojamiento";
  p.seq.forEach((a,k)=>{if(a.noloc){L.push({from:pos,to:pos,fn:nm,tn:a.n,k:k+1,noloc:1});return}L.push({from:pos,to:a.ll,fn:nm,tn:a.n.replace(/\s*\(.*?\)/,""),k:k+1});pos=a.ll;nm=a.n.replace(/\s*\(.*?\)/,"")});
  if(p.seq.length)L.push({from:pos,to:base,fn:nm,tn:"alojamiento",k:0});
  return L.map(l=>{const d=km(l.from,l.to);return l.noloc?{...l,d:0,metro:false,min:0}:{...l,d,metro:d>(p.esc?2.5:1.2),min:Math.max(5,Math.round(mv(l.from,l.to)*60/5)*5)}})}
const trUrl=(a,b,m)=>`https://www.google.com/maps/dir/?api=1&origin=${a.join(",")}&destination=${b.join(",")}&travelmode=${m?"transit":"walking"}`;
// Sena aproximada (lat,lng) de este a oeste
function dayMap(p,legs){const base=p.base||baseLL();const pts=[base,...p.seq.map(a=>a.ll)];
  let la0=Math.min(...pts.map(x=>x[0])),la1=Math.max(...pts.map(x=>x[0])),lo0=Math.min(...pts.map(x=>x[1])),lo1=Math.max(...pts.map(x=>x[1]));
  const kx=Math.cos(48.86*Math.PI/180);let w=(lo1-lo0)*kx,h=la1-la0;const mn=0.012;
  if(w<mn){const c=(lo0+lo1)/2;lo0=c-mn/kx/2;lo1=c+mn/kx/2;w=mn}if(h<mn){const c=(la0+la1)/2;la0=c-mn/2;la1=c+mn/2;h=mn}
  const pad=0.18;const W=300,Hh=Math.round(Math.max(150,Math.min(260,W*(h/w))));const sx=W/(w*(1+2*pad)),sy=Hh/(h*(1+2*pad));const s=Math.min(sx,sy);
  const cx=(lo0+lo1)/2,cy=(la0+la1)/2;const P=ll=>[(W/2+(ll[1]-cx)*kx*s).toFixed(1),(Hh/2-(ll[0]-cy)*s).toFixed(1)];
  const seine=SEINE.map(P).map(q=>q.join(",")).join(" ");
  let g=`<polyline points="${seine}" class="pm-seine"/>`;
  legs.forEach(l=>{const a=P(l.from),b=P(l.to);g+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="pm-l ${l.metro?"m":"w"}${l.k?"":" back"}"/>`});
  const hb=P(base);g+=`<g class="pm-h" transform="translate(${hb[0]},${hb[1]})"><rect x="-8" y="-8" width="16" height="16" rx="3"/><text y="4.5">⌂</text></g>`;
  p.seq.forEach((a,k)=>{const q=P(a.ll);g+=`<g class="pm-a" transform="translate(${q[0]},${q[1]})"><circle r="9"/><text y="4">${k+1}</text></g>`});
  // escala 1 km
  const km1=s/111;g+=`<g class="pm-sc" transform="translate(10,${Hh-10})"><line x1="0" y1="0" x2="${(km1).toFixed(1)}" y2="0"/><text x="${(km1/2).toFixed(1)}" y="-4">1 km</text></g>`;
  return `<svg class="pmap" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Plano del día"><rect width="${W}" height="${Hh}" class="pm-bg"/>${g}</svg>
  <div class="pm-leg"><span><i class="w"></i>a pie</span><span><i class="m"></i>metro/RER</span><span>⌂ alojamiento</span><span class="muted">Sena aprox.</span></div>`}
// ===== Mapa y fichas de escapadas =====
const PARIS=[48.8566,2.3522];
// ll destino · cost = tren ida aprox. 2.ª clase comprando con anticipación (verificar) · how = cómo llegar · f = ficha
function frMap(){const M=FRMAP;const pr=ll=>[(ll[1]-M.W)*M.kx*M.sc,(M.N-ll[0])*M.sc];
  const p0=pr(PARIS);const day=ESC.filter(x=>x.k==="dia"),far=ESC.filter(x=>x.k!=="dia");const chosen=new Set(ST.esc.map(e=>e.id));
  let s=`<svg class="frmap" viewBox="${M.vb.join(" ")}" role="img" aria-label="Mapa de escapadas desde París"><rect width="${M.vb[2]}" height="${M.vb[3]}" class="fm-sea"/>`;
  Object.entries(M.c).forEach(([k,d])=>s+=`<path d="${d}" class="fm-c ${k==="FRA"?"fr":""}"/>`);
  far.forEach(x=>{const q=pr(EXT[x.id].ll);s+=`<path class="fm-l ${x.k==="ambos"?"amb":"far"}${chosen.has(x.id)?" on":""}" d="M${p0[0].toFixed(1)},${p0[1].toFixed(1)}L${q[0].toFixed(1)},${q[1].toFixed(1)}" style="--c:${x.c}"/>`});
  far.forEach(x=>{const q=pr(EXT[x.id].ll);const lab=x.n.split(/ y |:/)[0];let left=q[0]<p0[0]-20,below=false;if(left&&q[0]<lab.length*6.7+14)below=true;if(q[0]>M.vb[2]-lab.length*6.7-14)left=true;
    const tx=below?q[0]:q[0]+(left?-11:11),ty=below?q[1]+20:q[1]+4,ta=below?"middle":left?"end":"start";
    s+=`<g class="fm-pt${chosen.has(x.id)?" on":""}${escPick===x.id?" pick":""}" data-esc="${x.id}" role="button" tabindex="0" aria-label="${x.n}" style="--c:${x.c}"><circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${x.k==="ambos"?6:8}"/><text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${ta}">${lab}</text></g>`});
  s+=`<g class="fm-paris"><circle cx="${p0[0].toFixed(1)}" cy="${p0[1].toFixed(1)}" r="11"/><text x="${p0[0].toFixed(1)}" y="${(p0[1]+4).toFixed(1)}" text-anchor="middle">★</text><text class="fm-pl" x="${(p0[0]-13).toFixed(1)}" y="${(p0[1]+20).toFixed(1)}" text-anchor="end">PARÍS</text></g>`;
  // recuadro: alrededores de París (excursiones de un día)
  const ix=8,iy=8,iw=150,ih=142,zc=[48.85,2.32],zs=5.2;const zp=ll=>[ix+iw/2+(ll[1]-zc[1])*M.kx*M.sc*zs/ (M.sc/40)/1,iy+ih/2-(ll[0]-zc[0])*M.sc*zs/(M.sc/40)/1];
  const zsc=ll=>{const dx=(ll[1]-zc[1])*M.kx*40*zs/ (1),dy=(ll[0]-zc[0])*40*zs;return [ix+iw/2+dx*0.42,iy+ih/2-dy*0.42]};
  s+=`<g class="fm-inset"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="6"/><text class="fm-it" x="${ix+8}" y="${iy+15}">Alrededores · de un día</text>`;
  const pc=zsc(PARIS);s+=`<circle class="fm-ipc" cx="${pc[0].toFixed(1)}" cy="${pc[1].toFixed(1)}" r="7"/><text class="fm-ipt" x="${pc[0].toFixed(1)}" y="${(pc[1]+3.5).toFixed(1)}" text-anchor="middle">★</text>`;
  day.forEach(x=>{const q=zsc(EXT[x.id].ll);s+=`<path class="fm-l day${chosen.has(x.id)?" on":""}" d="M${pc[0].toFixed(1)},${pc[1].toFixed(1)}L${q[0].toFixed(1)},${q[1].toFixed(1)}" style="--c:${x.c}"/><g class="fm-pt day${chosen.has(x.id)?" on":""}${escPick===x.id?" pick":""}" data-esc="${x.id}" role="button" tabindex="0" aria-label="${x.n}" style="--c:${x.c}"><circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="5.5"/>${(()=>{const L=pc[0]-q[0]>4&&pc[0]-q[0]<35;return `<text x="${(q[0]+(L?-8:8)).toFixed(1)}" y="${(q[1]+3.5).toFixed(1)}" text-anchor="${L?"end":"start"}">${x.n}</text>`})()}</g>`});
  s+=`</g></svg>`;
  return `<div class="fmwrap">${s}<div class="fm-leg"><span><i class="lg far"></i>2–3 h · con 1–3 noches</span><span><i class="lg amb"></i>1–2 h · día o 1 noche</span><span><i class="lg day"></i>Excursión de un día</span><span><b>●</b> elegida</span></div></div>`}
let escPick=null,escFicha=null;
// Por qué ir: resumen de cada escapada
function escCard(){if(!escPick)return `<p class="muted" style="font-size:14px;margin:8px 0 0">Toca un destino en el mapa para ver cómo llegar, cuánto cuesta y su ficha.</p>`;
  const x=ESC.find(z=>z.id===escPick),e=EXT[x.id];const sel=ST.esc.filter(z=>z.id===x.id);
  return `<div class="ecard" style="--c:${x.c}"><div class="top"><span class="flag">${x.p}</span><b>${x.n}</b><button class="btn alt sm ecx" data-epick="" aria-label="Cerrar">✕</button></div>
   <p>${x.t}</p>${ESC_WHY[x.id]?`<div class="ewhy"><span class="flab">Por qué ir</span><p>${ESC_WHY[x.id]}</p></div>`:""}
   <dl class="edl"><dt>🚄 Viaje</dt><dd>${x.tr}</dd><dt>🛤 Cómo</dt><dd>${e.how}</dd><dt>💶 Costo</dt><dd>${e.cost}</dd><dt>🛏 Noches</dt><dd>${x.k==="dia"?"Excursión de un día":x.nt==="0–1"?"De un día o 1 noche":x.nt+" noche"+(x.nt==="1"?"":"s")+" sugeridas"}</dd></dl>
   ${sel.length?`<p class="okl">✓ Elegida: ${sel.map(z=>pretty(z.ini)+(z.fin!==z.ini?" → "+pretty(z.fin):"")).join(" · ")}</p>`:""}
   <div class="act"><button class="btn sm" data-efic="${x.id}">📖 Ver ficha</button><button class="btn alt sm" data-open="${x.id}" data-goto="1">+ Agregar fechas</button></div></div>`}
function fichaEsc(){if(!escFicha)return"";return `<div class="fov" data-fclose="1"><div class="fsheet fwrap" role="dialog" aria-label="Ficha"><button type="button" class="btn alt sm fx" data-fclose="1" aria-label="Cerrar">✕</button>${escFichaHTML(escFicha)}</div></div>`}
function bindEsc(){document.querySelectorAll("[data-esc]").forEach(g=>{const f=()=>{escPick=g.dataset.esc;render();const c=$(".ecard");if(c)c.scrollIntoView({block:"nearest",behavior:"smooth"})};g.onclick=f;g.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();f()}}});
  document.querySelectorAll("[data-epick]").forEach(b=>b.onclick=()=>{escPick=null;render()});
  document.querySelectorAll("[data-efic]").forEach(b=>b.onclick=()=>{escFicha=b.dataset.efic;render()});
  document.querySelectorAll("[data-fclose]").forEach(b=>b.onclick=e=>{if(e.target===b||b.classList.contains("fx")){escFicha=null;render()}});
  document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>setTimeout(()=>{const f=document.querySelector(`form[data-plan="${b.dataset.open}"]`);if(f)f.scrollIntoView({block:"center",behavior:"smooth"})},50)))}

// ===================== Interfaz con la plantilla del Viaje a Alemania =====================
const PEOPLE=TRIP.people,peopleOf=k=>{const t=tramoOf(k);return t&&t.viajeros?t.viajeros.length:PEOPLE},PA_C=TRIP.colors.PA,LO_C=TRIP.colors.LO,LONDON=[51.5074,-0.1278];
let cur="EUR",sty="papel";try{cur=localStorage.getItem(TRIP.ls+"_cur")||"EUR";sty=localStorage.getItem(TRIP.ls+"_sty")||"papel"}catch(e){}
const rate=()=>+(ST.rate||1100);
const fmt=v=>cur==="CLP"?"$"+Math.round(v*rate()).toLocaleString("es-CL"):(+v).toLocaleString("es-CL",{maximumFractionDigits:2})+" €";
const fmtCLP=v=>"≈ $"+Math.round(v*rate()).toLocaleString("es-CL")+" CLP";
const short=n=>n.split(/ y |:/)[0];
function setSty(v){sty=v;const R=document.documentElement;R.dataset.sty=v==="papel"?"retro":v;R.dataset.paper=v==="papel"?"1":"0";try{localStorage.setItem(TRIP.ls+"_sty",v)}catch(e){}}
setSty(sty);
{const t0={resumen:"prog",config:"cfg",escapadas:"esc",paris:"prog",tips:"buy",tk:"prog"};if(t0[tab])tab=t0[tab]}
let progCity="PA",progDay={},openActs=new Set(),mapOpen=null,attCity="PA";
try{progCity=localStorage.getItem(TRIP.ls+"_progcity")||"PA"}catch(e){}

// ---------- modelo de ciudades y días ----------
function cityList(){const W=ST.wiz;const L=[];if(W[K.llega]&&W[K.parIni]&&W[K.llega]<W[K.parIni])L.push({k:"LO",n:TRIP.cities.LO.n,p:TRIP.cities.LO.p,c:LO_C,nn:nights(W[K.llega],W[K.parIni])});L.push({k:"PA",n:TRIP.cities.PA.n,p:TRIP.cities.PA.p,c:PA_C});
  ST.esc.slice().sort((a,b)=>a.ini<b.ini?-1:1).forEach(e=>{const x=ESC.find(q=>q.id===e.id);if(x)L.push({k:"E"+e.id+e.ini.replace(/-/g,""),id:e.id,n:x.n,p:x.p,c:x.c,e,nn:nights(e.ini,e.fin),x})});return L}
const stayKeyOf=e=>"esc-"+e.id+"-"+e.ini;
function trainEst(id){const s=(EXT[id]||{}).cost||"";const m=s.match(/(\d+(?:[.,]\d+)?)\s*(?:[–-]\s*(\d+(?:[.,]\d+)?))?\s*€/);if(!m)return 0;const a=parseFloat(m[1].replace(",",".")),b=m[2]?parseFloat(m[2].replace(",",".")):a;return Math.round((a+b)/2)}
function buildAll(){const W=ST.wiz;const C=cityList();if(!W[K.parIni]||!W[K.parFin]||W[K.parFin]<=W[K.parIni])return {days:[],R:null,C};
  const R=buildPA();const days=[];
  R.plan.forEach(p=>{const rf=p.ret?ST.esc.find(e=>e.fin===p.d&&e.fin!==e.ini):null;days.push({id:p.d,d:p.d,city:"PA",kind:p.first?"first":p.ret?"ret":"pa",pa:p,from:rf})});
  days.push({id:W[K.parFin],d:W[K.parFin],city:"PA",kind:"final"});
  const RL=buildLO();if(W[K.llega]&&W[K.llega]<W[K.parIni])for(let d=W[K.llega];d<W[K.parIni];d=add(d,1))days.push({id:"L"+d,d,city:"LO",kind:d===W[K.llega]?"lonfirst":"lon",pa:RL.plan.find(p=>p.d===d)});
  C.filter(c=>c.e).forEach(c=>{const e=c.e;const v=((EXT[e.id]||{}).f||{}).v||[];const n=c.nn;
    if(n<=0){days.push({id:e.ini+"-"+e.id,d:e.ini,city:c.k,kind:"trip",c,items:v.slice()});return}
    const per=Math.ceil(v.length/n)||1;for(let i=0;i<n;i++)days.push({id:add(e.ini,i)+"-"+e.id,d:add(e.ini,i),city:c.k,kind:i?"stay":"go",c,items:v.slice(i*per,(i+1)*per)})});
  days.sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0);BF_IX={};days.forEach((d,i)=>BF_IX[d.id]=i);days.forEach(d=>d.cost=dayCost2(d));applyNavigo(days);return {days,R,RL,C}}
function dayCost2(d){let meal=0;const T=MT(d);["d","a","m","c"].forEach(k=>{if(mealOnP(d.id,k))meal+=T[k][mealIxP(d.id,k,T)][1]});if(d.city==="LO"){const has=d.pa&&d.pa.seq.length;const act=has?d.pa.seq.reduce((t,a)=>t+a.p,0):0,legs=has?legsOfDay(d.pa):null;return {meal,act,loc:LON_TR,hot:0,trn:0,nm:0,legs,total:meal+act+LON_TR}}
  let act=0,loc=0,hot=0,legs=null,nm=0,trn=0;
  if(d.pa&&d.pa.seq.length){act=d.pa.seq.reduce((t,a)=>t+a.p,0);legs=legsOfDay(d.pa);nm=legs.filter(l=>l.metro).length;loc=nm*METRO}
  if(d.kind==="first")loc+=METRO;if(d.kind==="final")loc+=14;
  if(d.kind==="ret"&&d.from)trn=trainEst(d.from.id);if(d.kind==="go")trn=trainEst(d.c.id);if(d.kind==="trip")trn=trainEst(d.c.id)*2;
  loc+=trn;
  if((d.city==="PA"&&d.kind!=="final")||d.kind==="trip")hot=hotNightPP("par");
  if(d.kind==="go"||d.kind==="stay")hot=hotNightPP(stayKeyOf(d.c.e));
  return {meal,act,loc,hot,trn,nm,legs,total:meal+act+loc+hot}}
const hotSelName=k=>{const h=hotList(k).find(x=>x.sel);return h?h.n:null};

// ---------- encabezado, KPI y pestañas ----------
function header(A){const W=ST.wiz,C=A.C;const nn=c=>c.k==="PA"?A.days.filter(d=>d.city==="PA"&&d.kind!=="final").length+A.days.filter(d=>d.kind==="trip").length:c.nn;
  const uniq=[...new Set(C.map(c=>short(c.n)))];
  return `<header class="has-sticker"><button type="button" class="sticker" id="logoBtn" title="Volver a Marco Polo"><img src="/img/logo-marcopolo.jpg" alt="Marco Polo · Planifica · Explora · Vive"></button>
  <span class="eyebrow">2 viajeras${W[K.parIni]&&W[K.parFin]?` · ${pretty(W[K.parIni])} – ${pretty(W[K.parFin])} ${W[K.parFin].slice(0,4)}`:""}</span>
  <h1>Viaje a ${uniq.join(" · ")}</h1>
  <div class="route" aria-label="Ruta">${C.map((c,i)=>`${i?'<span class="arrow">→</span>':""}<span class="stop" style="border-color:${c.c};color:${c.c}">${short(c.n)} ${c.e&&!c.nn?"· día":"×"+nn(c)}</span>`).join("")}</div>
  <div class="stylebar"><span class="eyebrow">Estilo</span><div class="seg" role="group">${[["retro","Retro"],["mod","Moderno"],["papel","Papel (prueba)"]].map(([k,t])=>`<button type="button" data-stysel="${k}" aria-pressed="${sty===k}">${t}</button>`).join("")}</div>
   <a class="gastosbtn" href="/gastos">💶 Mis gastos</a><span class="whoami">${esc(user.displayName||user.email)}${DEMO?"":` · <button type="button" class="lnkb" id="so">Salir</button>`} · <a href="/">Viajes</a></span></div></header>`}
function summary(A){const S={meal:0,act:0,loc:0,hot:0,total:0};const LD=A.days.filter(d=>d.city==="LO"),FD=A.days.filter(d=>d.city!=="LO");FD.forEach(d=>{for(const k in S)S[k]+=d.cost[k]});
  const W=ST.wiz,n=FD.length,st=stays(),nh=st.filter(s=>hotList(s.k).some(h=>h.sel&&+h.price)).length;
  const ln=LD.length,LON=LD.reduce((t,d)=>t+d.cost.total,0),ld=ln?LON/ln:0,TOT=S.total+LON;
  const parts=[["🛏️","Alojamiento",S.hot,"var(--mun)"],["🍽️","Comidas",S.meal,"var(--pra)"],["🎟️","Entradas",S.act,"var(--ber)"],["🚋","Transporte",S.loc,"var(--ok)"]];const M=Math.max(...parts.map(p=>p[2]),0.01);
  return `<section class="summary" aria-label="Resumen de costos">
   <div class="tile main"><span class="eyebrow">Total viaje p/p</span><span class="big">${fmt(TOT)}</span><span class="num" style="opacity:.8;font-size:13px">${cur==="EUR"?fmtCLP(TOT):""}</span><span style="opacity:.8;font-size:12.5px">Londres + París y escapadas</span></div>
   <div class="tile"><span class="eyebrow">🇬🇧 Londres p/p</span><span class="big">${fmt(LON)}</span><span class="num muted" style="font-size:13px">${cur==="EUR"&&LON?fmtCLP(LON):""}</span><span class="muted" style="font-size:13px">${ln?`${ln} días con Alli · ${fmt(ld)}/día`:"Falta la llegada a Londres en Configurar"}</span><span class="e" style="font-size:12.5px">● estimado · comidas y transporte (sin alojamiento)</span></div>
   <div class="tile"><span class="eyebrow">🇫🇷 París y escapadas p/p</span><span class="big">${fmt(S.total)}</span><span class="num muted" style="font-size:13px">${cur==="EUR"?fmtCLP(S.total):""}</span><span class="muted" style="font-size:13px">${n} días · ${Math.max(0,n-1)} noches</span><span class="v" style="font-size:12.5px">${nh===st.length&&st.length?"✓":"○"} ${nh} de ${st.length} alojamientos con tarifa</span></div>
   <div class="tile"><span class="eyebrow">Promedio diario p/p</span><span class="big">${fmt(n+ln?TOT/(n+ln):0)}</span><span class="muted" style="font-size:13px">París ${fmt(n?S.total/n:0)}/día · Londres ${fmt(ld)}/día</span></div></section>
  <section style="display:flex;flex-direction:column;gap:8px" aria-label="Desglose de París y escapadas"><span class="eyebrow">Desglose · París y escapadas</span><div class="dstrip sumstrip" id="bar">${parts.map(p=>`<div class="tkt" title="${p[1]}: ${fmt(p[2])} por persona"><span class="ti" aria-hidden="true">${p[0]}</span><b class="num">${fmt(p[2])}</b><span class="tn">${p[1]}</span><span class="tp num">${S.total?Math.round(p[2]/S.total*100):0}% · p/p</span><span class="tm"><span style="width:${(p[2]/M*100).toFixed(1)}%;background:${p[3]}"></span></span></div>`).join("")}</div><div class="legend" id="legend"></div></section>`}
const TABS=[["cfg","1 · Configurar"],["prog","2 · Programa"],["att","3 · Atracciones"],["esc","4 · Escapadas"],["show","5 · Espectáculos"],["hot","6 · Alojamiento"],["buy","7 · Trámites previos"],["food","8 · Comidas"],["gas","9 · Gastos"],["tra","10 · Transporte"]];
function costStrip(c){const C=[["🛏️","Alojamiento",c.hot,"var(--mun)"],["🍽️","Comidas",c.meal,"var(--pra)"],["🎟️","Entradas",c.act,"var(--ber)"],["🚋","Transporte",c.loc,"var(--ok)"]];const M=Math.max(...C.map(x=>x[2]),0.01);
  return `<div class="dstrip" aria-label="Gasto del día por categoría">${C.map(x=>`<div class="tkt${x[2]>0.005?"":" zero"}" title="${x[1]}: ${fmt(x[2])}"><span class="ti" aria-hidden="true">${x[0]}</span><b class="num">${x[2]>0.005?fmt(x[2]):"—"}</b><span class="tn">${x[1]}</span><span class="tm"><span style="width:${(x[2]/M*100).toFixed(1)}%;background:${x[3]}"></span></span></div>`).join("")}</div>`}

// ---------- 1 · Configurar ----------
function pCfg(A){const W=ST.wiz;const lim=W[K.parIni]&&W[K.parFin];
  const f=(k,l,t="text",ph="")=>`<div class="field"><label for="w-${k}">${l}</label><input id="w-${k}" type="${t}" data-w="${k}" value="${esc(W[k]||"")}" placeholder="${esc(ph)}"></div>`;
  const sl=(k,l,o)=>`<div class="field"><label for="w-${k}">${l}</label><select id="w-${k}" data-w="${k}"><option value="">—</option>${o.map(x=>`<option ${W[k]===x?"selected":""}>${x}</option>`).join("")}</select></div>`;
  const list=ESC.filter(x=>filt==="todas"||(filt==="noche"&&x.k!=="dia")||(filt==="dia"&&x.k!=="noche")||(filt==="fuera"&&x.p!=="🇫🇷"));
  const ne=ST.esc.reduce((t,e)=>t+Math.max(0,nights(e.ini,e.fin)),0),nt=lim?nights(W[K.parIni],W[K.parFin]):0;
  return `<div class="card cfg">
   ${f("eur_fecha","Llegada a París (Eurostar)","date")}${f("eur_hora","Hora de salida de Londres","time")}${f("vue_fecha","Vuelo de regreso","date")}
   <div class="field"><label for="paBase">Barrio del alojamiento en París</label><select id="paBase">${Object.keys(BASES).map(k=>`<option ${(ST.base||"Otro / centro")===k?"selected":""}>${k}</option>`).join("")}</select></div>
   <div class="field"><span>Ritmo · Londres con Alli</span>${ritSel("LO")}</div><div class="field"><span>Ritmo · París con Alli</span>${ritSel("PAJ")}</div><div class="field"><span>Ritmo · París (después de Alli)</span>${ritSel("PAS")}</div>
   <div class="field"><span>Moneda</span><div class="seg" role="group"><button type="button" data-cur="EUR" aria-pressed="${cur==="EUR"}">EUR €</button><button type="button" data-cur="CLP" aria-pressed="${cur==="CLP"}">CLP $</button></div></div>
   <div class="field"><label for="rate">1 € en CLP (editar)</label><input id="rate" type="number" value="${rate()}" step="10"></div></div>
  ${cfgRoute(A)}
  <div class="card cfg"><span class="eyebrow" style="grid-column:1/-1">Vuelos, Londres y alojamiento</span>
   ${f("ida_fecha","Vuelo Santiago → Londres","date")}${f("ida_vuelo","Aerolínea y vuelo de ida","text","Ej.: LATAM LA704")}${f("ida_llega","Llegada a Londres","date")}${sl("ida_aerop","Aeropuerto en Londres",["Heathrow","Gatwick","Stansted","Otro"])}
   ${f("lon_dir","Dónde se quedan en Londres","text","Ej.: Camden")}${f("eur_tren","Tren a París","text","Eurostar · St Pancras → Gare du Nord")}${f("par_dir","Dirección en París","text","Calle, número, barrio")}
   ${f("vue_vuelo","Aerolínea y vuelo de regreso","text","Ej.: Air France AF406")}${sl("vue_aerop","Aeropuerto de regreso",["Charles de Gaulle (CDG)","Orly (ORY)","Otro"])}</div>
  <div class="card"><span class="eyebrow">Línea de tiempo</span>${timeline()}</div>
  <div class="basis"><span><span class="v">● Verificado</span> entradas de museos 2026, boletos de metro RATP 2026</span><span><span class="e">● Estimado</span> comidas, trenes de escapadas (promedio del rango), alojamiento hasta ingresar la tarifa</span></div>`}

// ===== Configurar: ruta general + mapa del viaje =====
const f1=v=>(+v).toFixed(1);
function cfgRoute(A){const W=ST.wiz;if(!W[K.parIni]||!W[K.parFin])return "";
  const E=[...ST.esc].sort((a,b)=>a.ini.localeCompare(b.ini)).map(e=>({e,x:ESC.find(z=>z.id===e.id),n:Math.max(0,nights(e.ini,e.fin))})).filter(z=>z.x);
  const lonIn=W[K.llega]||W[K.ini],nl=lonIn?nights(lonIn,W[K.parIni]):0;let k=1;
  let h=`<div class="end">✈ Inicio: Santiago → Londres${W[K.ini]?` · sale ${pretty(W[K.ini])}`:""}${W.ida_vuelo?` · ${esc(W.ida_vuelo)}`:""}</div>`;
  h+=`<div class="n" style="--c:${LO_C}"><span style="flex:1;min-width:0"><b>${k++}.</b> 🇬🇧 Londres<br><small class="muted num">${lonIn?`Llega ${pretty(lonIn)} · `:""}sale ${pretty(W[K.parIni])}</small></span><span class="nn"><b class="num">${nl}</b> noches</span></div>`;
  h+=`<div class="arr">↓ <b>Eurostar</b>${W.eur_hora?` · sale <b>${esc(W.eur_hora)}</b>`:""} St Pancras → Gare du Nord · ≈ 2 h 20</div>`;
  const paSeg=(a,b,ret,trips)=>`<div class="n" style="--c:${PA_C}"><span style="flex:1;min-width:0"><b>${k++}.</b> 🇫🇷 París${ret?" · vuelta":""}<br><small class="muted num">Llega ${pretty(a)} · sale ${pretty(b)}</small>${trips.length?`<small class="trips">${trips.map(z=>`↺ ${z.x.p} ${esc(short(z.x.n))} · ${pretty(z.e.ini)}`).join("<br>")}</small>`:""}</span><span class="nn"><b class="num">${nights(a,b)}</b> noches</span></div>`;
  let cur=W[K.parIni],trips=[],ret=false;
  E.forEach(z=>{if(!z.n){trips.push(z);return}
    h+=paSeg(cur,z.e.ini,ret,trips);trips=[];
    h+=`<div class="arr">↓ ${z.x.p} tren ${esc(z.x.tr)} · ida ${pretty(z.e.ini)}</div>`;
    h+=`<div class="n" style="--c:${z.x.c}"><span style="flex:1;min-width:0"><b>${k++}.</b> ${z.x.p} ${esc(short(z.x.n))} <small class="muted">escapada</small><br><small class="muted num">Llega ${pretty(z.e.ini)} · sale ${pretty(z.e.fin)}</small></span><span class="nn"><b class="num">${z.n}</b> noche${z.n>1?"s":""}</span></div>`;
    h+=`<div class="arr">↓ tren de vuelta a París · ${pretty(z.e.fin)}</div>`;cur=z.e.fin;ret=true});
  h+=paSeg(cur,W[K.parFin],ret,trips);
  h+=`<div class="end">✈ Fin: París → Santiago · ${pretty(W[K.parFin])}${W.vue_vuelo?` · ${esc(W.vue_vuelo)}`:""}</div>`;
  const ne=E.reduce((t,z)=>t+z.n,0),nt=nights(W[K.parIni],W[K.parFin]),tot=lonIn?nights(lonIn,W[K.parFin]):nt;
  const nd=E.filter(z=>!z.n).length;
  return `<div class="routegrid">
   <div class="card" style="display:flex;flex-direction:column;gap:10px;min-width:0"><span class="eyebrow">Noches en cada ciudad · orden de visita</span><div class="nights">${h}</div>
    <span class="muted" style="font-size:13px">${tot} noches en Europa · Londres ${nl} · París ${nt-ne}${ne?` · escapadas ${ne}`:""}${nd?` · ${nd} excursión${nd>1?"es":""} de un día`:""}</span></div>
   <div class="card" style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="eyebrow">Mapa del viaje</span>${cfgMap(nl,nt-ne,E)}
    <span class="muted" style="font-size:12px">Fronteras reales (Natural Earth). Números = orden de los trayectos; línea punteada = vuelo. Círculos vacíos = otras escapadas posibles (tócalos para verlas).</span></div></div>`}
function cfgMap(nl,np,E){const M=FRMAP;const pr=ll=>[(ll[1]-M.W)*M.kx*M.sc,(M.N-ll[0])*M.sc];
  const chosen=new Set(E.map(z=>z.x.id));const L=pr(LONDON),P=pr(PARIS);
  const pts=[L,P,...ESC.filter(x=>x.k!=="dia").map(x=>pr(EXT[x.id].ll))];
  const x0=Math.max(0,Math.min(...pts.map(p=>p[0]))-60),x1=Math.min(M.vb[2],Math.max(...pts.map(p=>p[0]))+45),y0=Math.max(0,Math.min(...pts.map(p=>p[1]))-30),y1=Math.min(M.vb[3],Math.max(...pts.map(p=>p[1]))+25);
  let s=`<svg class="frmap cmap" viewBox="${f1(x0)} ${f1(y0)} ${f1(x1-x0)} ${f1(y1-y0)}" role="img" aria-label="Mapa del viaje: Santiago, Londres, París y escapadas"><defs><marker id="cmar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#2a2219"/></marker></defs><rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(x1-x0)}" height="${f1(y1-y0)}" class="fm-sea"/>`;
  Object.entries(M.c).forEach(([k,d])=>s+=`<path d="${d}" class="fm-c ${k==="FRA"||k==="GBR"?"fr":""}"/>`);
  ESC.filter(x=>!chosen.has(x.id)).forEach(x=>{const q=pr(EXT[x.id].ll);const far=x.k!=="dia";s+=`<g class="cm-alt" data-goesc="${x.id}" role="button" tabindex="0" aria-label="Escapada posible: ${esc(x.n)}" style="--c:${x.c}"><circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${far?4.5:2.6}"/>${far?`<text x="${f1(q[0]+7)}" y="${f1(q[1]+3)}">${esc(short(x.n))}</text>`:""}</g>`});
  let k=1;let nums="";
  const leg=(a,b,cls,c)=>{const dx=b[0]-a[0],dy=b[1]-a[1],D2=Math.hypot(dx,dy)||1,ux=dx/D2,uy=dy/D2;const r1=cls.includes("in")?0:8,r2=cls.includes("out")?0:10;const A1=[a[0]+ux*r1,a[1]+uy*r1],B1=[b[0]-ux*r2,b[1]-uy*r2];const mx=(A1[0]+B1[0])/2,my=(A1[1]+B1[1])/2;
    nums+=`<g class="cm-num"><circle cx="${f1(mx)}" cy="${f1(my)}" r="7"/><text x="${f1(mx)}" y="${f1(my+3.2)}" text-anchor="middle">${k++}</text></g>`;
    return `<path class="cm-l ${cls}" style="--c:${c||"#2a2219"}" d="M${f1(A1[0])},${f1(A1[1])}L${f1(B1[0])},${f1(B1[1])}" marker-end="url(#cmar)"/>`};
  const SI=[x0+4,Math.min(y1-40,L[1]+70)],SO=[x0+4,Math.min(y1-8,P[1]+110)];
  s+=leg(SI,L,"fly in");s+=`<text class="cm-sa" x="${f1(SI[0]+3)}" y="${f1(SI[1]+14)}">✈ desde Santiago</text>`;
  s+=leg(L,P,"rail");
  E.forEach(z=>{const q=pr(EXT[z.x.id].ll);s+=z.n?leg(P,q,"esc",z.x.c):`<path class="cm-l day" style="--c:${z.x.c}" d="M${f1(P[0])},${f1(P[1])}L${f1(q[0])},${f1(q[1])}"/>`});
  s+=leg(P,SO,"fly out");s+=`<text class="cm-sa" x="${f1(SO[0]+3)}" y="${f1(SO[1]-6)}">✈ a Santiago</text>`;
  E.forEach(z=>{const q=pr(EXT[z.x.id].ll);const lab=`${short(z.x.n)} · ${z.n?z.n+" n":"día"}`;const left=q[0]>x1-lab.length*6.5-16;s+=`<g class="cm-pt" data-goesc="${z.x.id}" role="button" tabindex="0" aria-label="${esc(z.x.n)}" style="--c:${z.x.c}"><circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${z.n?6:3.5}"/><text ${z.n?"":"hidden "} x="${f1(q[0]+(left?-9:9))}" y="${f1(q[1]+(z.n?4:-6))}" text-anchor="${left?"end":"start"}">${esc(lab)}</text></g>`});
  s+=nums;
  s+=`<g class="cm-pt big" style="--c:${LO_C}"><circle cx="${f1(L[0])}" cy="${f1(L[1])}" r="7"/><text x="${f1(L[0]+10)}" y="${f1(L[1]-8)}">Inicio · Londres · ${nl} n</text></g>`;
  s+=`<g class="cm-pt big" style="--c:${PA_C}"><circle cx="${f1(P[0])}" cy="${f1(P[1])}" r="8"/><text x="${f1(P[0]+11)}" y="${f1(P[1]+16)}">París · ${np} n</text></g>`;
  return s+`</svg>`}

// ===== Calendario del viaje (programa) =====
const MONL=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
let calOpen=false,calPop=null,ACTDAY={};
function tripDays(A){const W=ST.wiz,M={};const ini=W[K.ini]||W[K.llega]||(A.days[0]&&A.days[0].d),fin=W[K.parFin]||(A.days.length&&A.days[A.days.length-1].d);
  if(W[K.ini]&&W[K.ini]!==W[K.llega])M[W[K.ini]]={k:"fly",c:"#5b6770",lab:"✈ Santiago → Londres",acts:[],tr:1};
  A.days.forEach(d=>{const C=d.city==="PA"?{n:"París",c:PA_C}:d.city==="LO"?{n:"Londres",c:LO_C}:{n:short(d.c.n),c:d.c.c};
    const acts=d.pa?d.pa.seq.map(a=>({n:a.n,t:a.st})):d.items?d.items.map(n=>({n})):[];
    const tr=["first","go","ret","final","lonfirst"].includes(d.kind);
    const lab=C.n+(d.kind==="first"?" · llegada en Eurostar":d.kind==="final"?" · vuelo a Santiago":d.kind==="go"?" · tren de ida":d.kind==="ret"?" · vuelta a París":d.kind==="lonfirst"?" · llegada":"");
    M[d.d]={k:(d.city==="PA"?"pa":d.city==="LO"?"lo":"es")+(d.city==="PA"&&isJunDay(d.d)?" jun":"")+((d.city==="PA"||d.city==="LO")&&blkOf(d.d)?(blkOf(d.d).k==="free"?" bfree":" bbusy"):""),c:C.c,lab:lab+(d.city==="PA"&&isJunDay(d.d)?" · 👭 con Alli":"")+((d.city==="PA"||d.city==="LO")&&blkOf(d.d)?(blkOf(d.d).k==="free"?" · 🌿 libre":" · 🔒 "+(blkOf(d.d).t||"ocupado")):""),acts,tr,id:d.id}});
  return {M,ini,fin}}
function tripCal(A){if(!calOpen)return "";const {M,ini,fin}=tripDays(A);if(!ini||!fin)return "";const today=iso(new Date());
  let s="";const d0=D(ini),end=D(fin);let y=d0.getFullYear(),m=d0.getMonth();
  while(new Date(y,m,1)<=end){const lead=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate();
    s+=`<div class="tc-month"><h4>${MONL[m]} ${y}</h4><div class="tc-grid">${["L","M","M","J","V","S","D"].map(h=>`<span class="tc-h">${h}</span>`).join("")}${"<span></span>".repeat(lead)}`;
    for(let dd=1;dd<=dim;dd++){const ds=iso(new Date(y,m,dd)),X=M[ds];
      if(!X){s+=`<span class="tc-c off">${dd}</span>`;continue}
      const n=X.acts.length;
      s+=`<div class="tc-c ${X.k}${X.tr?" trv":""}${ds===today?" today":""}${calPop===ds?" pop":""}" style="--c:${X.c}">${X.id?`<button type="button" class="tc-d" data-calgo="${X.id}" title="${esc(X.lab)}" aria-label="${pretty(ds)} · ${esc(X.lab)} · ir al día">${dd}</button>`:`<span class="tc-d" title="${esc(X.lab)}">${dd}</span>`}${n?`<button type="button" class="tc-n" data-calpop="${ds}" aria-label="${n} actividad${n>1?"es":""} el ${pretty(ds)}">${n}</button>`:""}</div>`}
    s+=`</div></div>`;m++;if(m>11){m=0;y++}}
  const P=calPop&&M[calPop];
  return `<div class="calov"><div class="calsheet tcal" role="dialog" aria-modal="true" aria-label="Calendario del viaje"><span class="clip big" aria-hidden="true"></span>
   <div class="ms-head"><div><span class="eyebrow">${pretty(ini)} → ${pretty(fin)}</span><h3>Calendario del viaje</h3></div><button type="button" class="ms-x lnkb" data-calclose aria-label="Cerrar calendario">✕</button></div>
   <div class="tc-leg"><span><i style="--c:${LO_C}"></i>Londres</span><span><i style="--c:${PA_C}"></i>París</span><span><i style="--c:#a8352b"></i>Escapada</span><span><i class="trk"></i>Día de viaje</span><span><b class="tc-nb">3</b> actividades</span></div>
   <div class="tc-months">${s}</div>
   ${P?`<div class="tc-pop"><div class="tc-ph"><b>${pretty(calPop)} · ${esc(P.lab)}</b><button type="button" class="ms-x sm" data-calpop="" aria-label="Cerrar lista">✕</button></div><ul>${P.acts.map(a=>`<li>${a.t!=null?`<span class="num">${hm(a.t)}</span> `:""}${esc(a.n)}</li>`).join("")}</ul>${P.id?`<button type="button" class="btn sm" data-calgo="${P.id}">Ir a este día →</button>`:""}</div>`:`<p class="muted tc-hint">Toca un día para abrirlo en el programa · toca el número para ver sus actividades.</p>`}
  </div></div>`}
function goDay(id){const A=window.LAST_A;const d=A&&A.days.find(x=>x.id===id);if(!d)return;calOpen=false;calPop=null;tab="prog";try{localStorage.setItem(TRIP.ls+"_tab","prog")}catch(e){}
  progCity=d.city;try{localStorage.setItem(TRIP.ls+"_progcity",progCity)}catch(e){}progDay[progCity]=id;render();
  setTimeout(()=>{document.querySelectorAll("[data-dchip]").forEach(y=>y.setAttribute("aria-pressed",y.dataset.dchip===id));const dv=document.querySelector(`#days > .day[data-day="${id}"]`),tb=$("#daytabs");if(dv)scrollTo({top:dv.getBoundingClientRect().top+scrollY-(tb?tb.offsetHeight:0)-4,behavior:"smooth"})},80)}
function toast(m){if(!m)return;let t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";t.setAttribute("role","status");t.setAttribute("aria-live","polite");document.body.appendChild(t)}t.innerHTML=m;t.className="on";clearTimeout(toast._t);toast._t=setTimeout(()=>t.className="",3800)}
function selMsg(id){const a=actById(id);if(!a)return"";if(!selOf(a))return `✕ <b>${esc(a.n)}</b> quitada del programa`;const d=ACTDAY[id];const pin=(ST.paPin||{})[id];
  return d?`✔ <b>${esc(a.n)}</b> → ${pretty(d)}${pin?" (día fijado)":" (día automático)"}`:`⚠ <b>${esc(a.n)}</b> no cabe${pin?" ese día":""}: prueba otro día o ritmo intenso`}
function bindCal(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-calopen]",b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();calOpen=true;calPop=null;render()});
  Q("[data-calclose]",b=>b.onclick=()=>{calOpen=false;calPop=null;render()});
  const co=document.querySelector(".calov");if(co)co.onclick=e=>{if(e.target===co){calOpen=false;calPop=null;render()}};
  Q("[data-calpop]",b=>b.onclick=e=>{e.stopPropagation();const v=b.dataset.calpop||null;calPop=calPop===v?null:v;render();const p=document.querySelector(".tc-pop");if(p)p.scrollIntoView({block:"nearest"})});
  Q("[data-calgo]",b=>b.onclick=()=>goDay(b.dataset.calgo));
  Q("[data-totop]",b=>b.onclick=()=>scrollTo({top:0,behavior:"smooth"}));
  Q("[data-goday]",b=>b.onclick=e=>{e.preventDefault();const d=window.LAST_A.days.find(x=>x.d===b.dataset.goday&&x.pa);if(d)goDay(d.id)});
  Q("[data-goesc]",b=>{b.onclick=()=>{escPick=b.dataset.goesc;go("esc")};b.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();b.onclick()}}});
  if(calOpen){document.body.style.overflow="hidden";const sh=document.querySelector(".calsheet");if(sh&&!sh.contains(document.activeElement))(sh.querySelector(".ms-x")||sh).focus({preventScroll:true})}else document.body.style.overflow="";
  if(!window._calEsc){window._calEsc=1;addEventListener("keydown",e=>{if(e.key==="Escape"&&calOpen){calOpen=false;calPop=null;render()}})}}

// ---------- 4 · Escapadas ----------
function pEsc(A){const W=ST.wiz;const lim=W[K.parIni]&&W[K.parFin];
  const list=ESC.filter(x=>filt==="todas"||(filt==="noche"&&x.k!=="dia")||(filt==="dia"&&x.k!=="noche")||(filt==="fuera"&&x.p!=="🇫🇷"));
  const ne=ST.esc.reduce((t,e)=>t+Math.max(0,nights(e.ini,e.fin)),0),nt=lim?nights(W[K.parIni],W[K.parFin]):0;
  const ch=[...new Set(ST.esc.map(e=>e.id))];
  return `  <div class="routegrid">
   <div class="card" style="display:flex;flex-direction:column;gap:10px;min-width:0"><span class="eyebrow">Escapadas · orden de visita</span>
    ${ST.esc.length?`<div class="mine">${[...ST.esc].sort((a,b)=>a.ini.localeCompare(b.ini)).map(e=>{const x=ESC.find(z=>z.id===e.id);const n=nights(e.ini,e.fin);return `<div class="it" style="--c:${x.c}"><span>${x.p}</span><span><b>${x.n}</b><br><span class="dt">${pretty(e.ini)}${n?` → ${pretty(e.fin)} · ${n} noche${n>1?"s":""}`:" · ida y vuelta"}</span></span><button type="button" class="btn alt sm" data-del="${e.ini}|${e.id}" aria-label="Quitar ${x.n}">✕</button></div>`}).join("")}</div>`:`<div class="empty">Todavía no eligen escapadas: tóquenlas en el mapa o en las ideas.</div>`}
    <span class="muted" style="font-size:13px">${lim?`${nt} noches en Francia · ${nt-ne} en París · ${ne} en escapadas`:"Completa las fechas de llegada y regreso."}</span>
    ${calendar()}</div>
   <div class="card" style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="eyebrow">Mapa de escapadas · máx. ~3 h en tren</span>${frMap()}${escCard()}</div></div>
  ${customList("esc")}<div class="card"><span class="eyebrow">Ideas de escapadas</span> ${findBtn("esc","")}
   <div class="filters" style="margin:8px 0 10px">${[["todas","Todas"],["noche","Con noche"],["dia","De un día"],["fuera","Fuera de Francia"]].map(([k,t])=>`<button type="button" class="chip" data-f="${k}" aria-pressed="${filt===k}">${t}</button>`).join("")}${manBtn("esc","")}</div>${manPanel("esc","")}
   <div class="ideas">${list.map(x=>{const sel=ST.esc.some(e=>e.id===x.id);return `<div class="idea${sel?" sel":""}" style="--c:${x.c}"><div class="itop"><span>${x.p}</span><b>${x.n}</b>${sel?'<span class="tag">✓ elegida</span>':""}</div><small>🚄 ${x.tr} · ${x.k==="dia"?"de un día":x.nt==="0–1"?"día o 1 noche":x.nt+" noche"+(x.nt==="1"?"":"s")}</small><p>${x.t}</p>
     ${open===x.id?planForm(x,lim):`<div class="act"><button type="button" class="btn sm" data-open="${x.id}">${sel?"+ Otra fecha":"+ Agregar"}</button><button type="button" class="btn alt sm" data-efic="${x.id}">📖 Ficha</button></div>`}</div>`}).join("")}</div></div>
  ${ch.length?`<span class="eyebrow" style="margin-top:6px">Fichas de las escapadas elegidas</span><div class="fichas">${ch.map(id=>escFichaHTML(id)).join("")}</div>`:""}`}

// ---------- 2 · Programa ----------
function fcards(A){const R=A.R;const pd=A.days.filter(d=>d.city==="PA"&&d.pa);
  const need=pd.reduce((t,d)=>t+d.pa.seq.reduce((u,a)=>u+a.h+0.3,0),0),avail=pd.reduce((t,d)=>t+d.pa.cap,0);const over=R.unpl.length>0;
  const off=PA.filter(a=>!paSel(a));const n=A.days.filter(d=>d.city==="PA"&&d.kind!=="final").length+A.days.filter(d=>d.kind==="trip").length;
  let h=`<div class="legendtr" style="grid-column:1/-1"><span class="eyebrow">Leyenda</span><span style="font-size:13px">↑↓ cambia el orden del día · ✕ quita del programa · volver a agregar en «Agregar otras actividades»</span><span class="tr pie">a pie</span><span class="tr metro">metro/RER</span><span class="tr fuera">⟶ escapada</span><span class="top">★ atracción más famosa/demandada</span><span>🏛 techada</span></div>`;
  {const L=A.C.find(c=>c.k==="LO");if(L){const ld=A.days.filter(d=>d.city==="LO");h+=`<div class="fcard" style="--c:${LO_C}"><div style="display:flex;justify-content:space-between;gap:8px"><span><b>Londres · ${L.nn} noches</b><br><small class="muted" style="font-size:13px">Llega ${pretty(ST.wiz[K.llega])} · sale ${pretty(ST.wiz[K.parIni])}</small></span><span class="num muted" style="font-size:13px">${fmt(ld.reduce((t,d)=>t+d.cost.total,0))} p/p</span></div><div class="meter"><span style="width:100%;background:${LO_C}"></span></div><span class="status ok">✓ Con Alli · sin alojamiento pagado</span>${loPool(A)}</div>`}}
  h+=`<div class="fcard" style="--c:${PA_C}"><div style="display:flex;justify-content:space-between;gap:8px"><span><b>París · ${n} noches</b><br><small class="muted" style="font-size:13px">Llega ${pretty(ST.wiz[K.parIni])} · sale ${pretty(ST.wiz[K.parFin])}</small></span><span class="num muted" style="font-size:13px;white-space:nowrap">${need.toFixed(1)} / ${avail.toFixed(1)} h</span></div>
   <div class="meter"><span style="width:${Math.min(100,need/Math.max(avail,0.1)*100)}%;background:var(${over?"--bad":"--ok"})"></span></div>
   <span class="status ${over?"bad":"ok"}">${over?`No alcanza: faltan ${R.unpl.length} actividad(es) → ritmo intenso o quitar otras`:"✓ Todo cabe"}</span>
   ${over?`<span class="eyebrow" style="margin-top:6px">No caben ahora</span>`+R.unpl.map(a=>`<label class="chk" style="--c:var(--bad)"><input type="checkbox" data-pasel="${a.id}" checked><span class="t">${a.n}<small>~${String(a.h).replace(".",",")} h</small></span></label>`).join(""):""}
   <span class="eyebrow" style="margin-top:6px">Agregar actividades por categoría</span>
   ${TYP.filter(t=>t[0]!=="via").map(([k,t])=>{if(k==="com")return `<details class="pool"><summary>${t} <span class="poolcnt">(${LUNCH_V.length})</span></summary>${LUNCH_V.map((r,i)=>`<div class="poolrow"><span class="t" style="flex:1;min-width:0;font-size:14px"><b>${esc(r[0])}</b><small class="muted" style="display:block">${r[1]} · ${r[3]}</small></span><select class="daysel poolday" data-lunchday="${i}" aria-label="Día del almuerzo"><option value="">📅 almorzar el…</option>${parisDays().map(x=>`<option value="${x.d}" ${(ST.lunchAt||{})[x.d]===r[0]?"selected":""}>${pretty(x.d)}</option>`).join("")}</select></div>`).join("")}</details>`;
     const L=PA.filter(a=>typOf(a)===k);if(!L.length)return"";const ns=L.filter(a=>paSel(a)).length;
     return `<details class="pool" data-k="pool-${k}"><summary>${t} <span class="poolcnt">(${ns?ns+" de ":""}${L.length})</span></summary>${L.map(a=>{const on=paSel(a),dd=ACTDAY[a.id],pin=(ST.paPin||{})[a.id];return `<div class="poolrow${on?" on":""}"><label class="chk"><input type="checkbox" data-pasel="${a.id}" ${on?"checked":""}><span class="t">${a.n}${a.top?'<span class="top">★ famosa</span>':""}${a.in?' 🏛':""}<small>~${String(a.h).replace(".",",")} h · ${a.p?fmt(a.p):"gratis"} · <a href="${a.u}" target="_blank" rel="noopener">sitio</a></small></span></label>${daySelPA(a.id,"poolday")}${on?`<small class="pdst${dd?"":" bad"}">${dd?`✔ ${pretty(dd)} · ${pin?"día fijado":"día automático"} · <a href="#" data-goday="${dd}">ver el día →</a>`:"⚠ No cabe en el programa: elige otro día o ritmo intenso"}</small>`:""}</div>`}).join("")}</details>`}).join("")}</div>`;
  A.C.filter(c=>c.e).forEach(c=>{const e=c.e;h+=`<div class="fcard" style="--c:${c.c}"><div style="display:flex;justify-content:space-between;gap:8px"><span><b>${short(c.n)} · ${c.nn?c.nn+(c.nn>1?" noches":" noche"):"de un día"}</b><br><small class="muted" style="font-size:13px">${c.nn?`Sale ${pretty(e.ini)} · vuelve ${pretty(e.fin)}`:`${pretty(e.ini)} · ida y vuelta`}</small></span><span class="num muted" style="font-size:13px;white-space:nowrap">🚄 ${c.x.tr.split(" (")[0]}</span></div>
   <div class="meter"><span style="width:100%;background:${c.c}"></span></div><span class="status ok">✓ Programa sugerido según la ficha</span>
   <span class="recbtns"><button type="button" class="btn alt" data-efic="${c.id}">📖 Ficha de ${short(c.n)}</button><button type="button" class="btn alt" data-del="${e.ini}|${e.id}">✕ Quitar escapada</button></span></div>`});
  const miss=PA.filter(a=>a.top&&!paSel(a));if(miss.length)h+=`<div class="sugg" style="grid-column:1/-1"><b>París · famosas no incluidas:</b> ${miss.map(a=>a.n).join(" · ")}</div>`;
  return h}
function dayTitle(d){if(d.city==="LO")return d.kind==="lonfirst"?"Llegada a Londres":"Londres con Alli";const nm=d.city==="PA"?"París":d.c.n;const fx=d.from?(ESC.find(x=>x.id===d.from.id)||{}).n:"";
  return {first:"Llegada a París",ret:`${short(fx||"Escapada")} → París`,final:"Último día · vuelo de regreso",pa:"Día completo en París",go:`París → ${short(nm)}`,stay:`Día completo en ${short(nm)}`,trip:`Excursión de un día · ${nm}`}[d.kind]}
function actRow(d,a,k,nonEve,SUN,days){const op=openActs.has(d.id+"|"+a.id);const late=a.closed?"cerrado ese día":a.late?"cierra "+hm(a.close):"";
  const sun=a.in?"":a.st>=SUN.dusk-0.05?'<span class="sun nite" title="Ya es de noche">🌙</span>':a.st+a.h>SUN.set+0.15?'<span class="sun dusk" title="Termina con poca luz">🌇</span>':"";
  const canMv=!a.night&&nonEve.length>1;
  return `<div class="actrow2${op?" open":""}" data-k="${a.id}">
 <div class="ar-top"><b class="num anum">${k+1}</b><span class="st num">${hm(a.st)}</span>${sun}<span class="ar-name">${a.n.replace(/\s*\(.*?\)\s*$/,"")}${a.top?' <span class="top">★</span>':""}${late?`<small class="ar-latemini">⚠ ${late}</small>`:""}</span><span class="ar-pmini ${a.p?"":"free"}">${a.p?fmt(a.p):"gratis"}</span><span class="ar-ctl">${canMv?`<button type="button" class="mvb" data-pmv="${d.id}|${a.id}|-1" title="Subir" ${nonEve[0].id===a.id?"disabled":""}>↑</button><button type="button" class="mvb" data-pmv="${d.id}|${a.id}|1" title="Bajar" ${nonEve[nonEve.length-1].id===a.id?"disabled":""}>↓</button>`:""}<button type="button" class="rm" data-rm="${a.id}" title="Quitar del programa" aria-label="Quitar ${a.n}">✕</button></span></div>
 <div class="ar-meta"><span class="dur">🕐 visita ~${String(a.h).replace(".",",")} h</span>${late?`<span class="tag late">⚠ ${late}</span>`:""}${a.in?'<span class="tag indoor" title="Techado">🏛 techado</span>':""}${(ST.paJun||{})[a.id]?'<span class="tag jun">👭 con Alli</span>':""}${a.night&&a.lateo?'<span class="tag nite">🌙 horario nocturno</span>':""}${a.cl?`<span class="tag">cerrado ${a.cl.map(x=>DOW[x]).join(", ")}</span>`:""}<span class="tag ar-price ${a.p?"price":"free"}">${a.p?fmt(a.p):"gratis"}</span></div>
 <div class="ar-note">${a.v}</div>
 <div class="ar-links"><a href="${a.u}" target="_blank" rel="noopener">sitio</a> · <a href="https://www.google.com/maps/search/?api=1&query=${a.ll.join(",")}" target="_blank" rel="noopener">mapa</a> <select class="daysel" data-papin="${a.id}" aria-label="Elegir día"><option value="">📅 día automático</option>${days.map(x=>`<option value="${x.d}" ${(ST.paPin||{})[a.id]===x.d?"selected":""}>${pretty(x.d)}</option>`).join("")}</select>${(ST.paPin||{})[a.id]?'<span class="tag pinday">día fijado</span>':""}</div>
 <details class="why"><summary>¿Por qué vale la pena?</summary>${a.s} ${typeof PA_F!=="undefined"&&PA_F[a.id]&&PA_F[a.id].h?PA_F[a.id].h[0]:""} <b>Consejo:</b> ${a.d} ${PA_F[a.id]?`<a href="#" data-ficha="${a.id}">Ver ficha completa →</a>`:""}</details></div>`}
function dayHTML(d,A){const c=d.cost,W=ST.wiz;const C=d.city==="PA"?{n:"París",c:PA_C}:d.city==="LO"?{n:"Londres",c:LO_C}:d.c;
  const ll=d.city==="PA"?PARIS:d.city==="LO"?LONDON:((EXT[d.c.id]||{}).ll||PARIS);const SUN0=sunOf(D(d.d),ll),SUN=d.city==="LO"?Object.fromEntries(Object.entries(SUN0).map(([k,v])=>[k,typeof v==="number"?v-1:v])):SUN0;
  const nightK=d.kind==="go"||d.kind==="stay"?stayKeyOf(d.c.e):d.kind==="final"||d.city==="LO"?null:"par";
  const night=nightK?`Noche en ${esc(hotSelName(nightK)||("alojamiento en "+(nightK==="par"?"París":short(d.c.n))+" (por definir)"))}`:d.city==="LO"?`Noche donde Alli${W[K.lonDir]?" ("+esc(W[K.lonDir])+")":""}`:"Sin noche de hotel";
  const X=d.c?EXT[d.c.id]||{}:{},fx=d.from?ESC.find(x=>x.id===d.from.id):null;
  const tl={first:`🚄 Eurostar ${W.eur_hora?"sale "+esc(W.eur_hora)+" de":"desde"} Londres St Pancras → <b>París Gare du Nord</b> · metro al alojamiento (${esc(ST.base||"centro")}) · <b>París: actividades desde las 14:30</b>`,
    ret:fx?`🚄 Tren ${fx.n} → París (${fx.tr}) por la mañana · <b>París: actividades desde las 14:30</b>`:"",
    final:`✈ Vuelo de regreso ${esc(W.vue_vuelo||"")} desde ${esc(W.vue_aerop||"CDG")} · check-out y RER B al aeropuerto (boleto 14 €) · llegar 3 h antes`,
    go:d.c?`🚄 París → <b>${d.c.n}</b> · ${d.c.x.tr} · ${X.how||""}`:"",lonfirst:`✈ Llegada a Londres ${esc(W.ida_aerop||"")} ${esc(W.ida_vuelo||"")} · traslado donde Alli (Elizabeth line o Piccadilly desde Heathrow)`,trip:d.c?`🚆 Ida y vuelta en el día · ${d.c.x.tr} · ${X.how||""}`:""}[d.kind]||"";
  const CAL='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2"/></svg>';
  let h=`<div class="dtabrow"><span class="dftab"><b>${pretty(d.d)}</b><span class="fc">${esc(short(C.n))}</span>${d.city==="PA"&&isJunDay(d.d)?'<span class="fc" title="Día con Alli">👭</span>':""}${wxMini(d.city==="LO"?"LO":"PA",d.d)}</span><button type="button" class="daycal" data-calopen title="Calendario del viaje" aria-label="Abrir calendario del viaje">${CAL}</button><button type="button" class="totop" data-totop aria-label="Volver arriba de la página">↑ arriba</button></div><div class="day-head"><h3>${dayTitle(d)}</h3><span class="muted" style="font-size:13px">${night}</span><span class="sunline">🌇 Se pone el sol ${hm(SUN.set)} · 🌙 oscuro desde ${hm(SUN.dusk)}</span></div>
   ${costStrip(c)}<div class="day-total"><span class="eyebrow">Por persona</span><span class="big">${fmt(c.total)}</span><span class="muted num" style="font-size:12px">las 2: ${fmt(c.total*PEOPLE)}</span></div>${tl?`<span class="tl dtl">${tl}</span>`:""}${blkNote(d)}
   <div class="day-body"><div class="blk blk-com${openActs.has(d.id+"|com")?" open":""}"><h4>Comidas · ${fmt(c.meal)}</h4>`;
  ["d","a","m","c"].forEach(k=>{const T=MT(d),on=mealOnP(d.id,k),i=mealIxP(d.id,k,T),o=T[k];
    h+=`<label class="chk"><input type="checkbox" data-pmeal="${d.id}|${k}" ${on?"checked":""}><span class="t">${PA_MEAL_LBL[k]}<small>${o[i][0]}</small></span><span class="p">${fmt(o[i][1])}</span></label>${o.length>1?`<select class="msel" data-pmopt="${d.id}|${k}" aria-label="Opción ${PA_MEAL_LBL[k]}">${o.map((x,j)=>`<option value="${j}" ${j===i?"selected":""}>${x[0]} · ${fmt(x[1])}</option>`).join("")}</select>`:""}${k==="a"&&(ST.lunchAt||{})[d.id]?`<div class="lunchat">🍽 Almuerzo en <b>${esc(ST.lunchAt[d.id])}</b> <button type="button" class="lnkb" data-lunchx="${d.id}">quitar</button></div>`:""}`});
  h+=`<span class="muted" style="font-size:12px">Precios aproximados por persona.</span></div><div class="blk blk-att"><h4>Atracciones</h4>`;
  if(d.pa&&d.pa.seq.length){const p=d.pa,legs=c.legs,nonEve=p.seq.filter(a=>!a.night);const days=d.city==="LO"?lonDays():parisDays();let lp=false;
    const lr=(ST.lunchAt||{})[d.id];const lunch=()=>`<div class="lunch">🍽 <b>${hm(p.seq.lunch)}–${hm(p.seq.lunch+1)}</b> ${lr?"Almuerzo en <b>"+esc(lr)+"</b>":"Almuerzo (1 h)"}</div>${lunchSugg(d,p)}`;
    p.seq.forEach((a,k)=>{const l=legs[k];if(p.seq.lunch&&!lp&&a.st>p.seq.lunch){h+=lunch();lp=true}
      h+=l.noloc?`<span class="mv">↓ ${esc(a.n)}: sin dirección, sin traslado calculado</span>`:l.metro?`<span class="mv">↓ ~${l.min} min en ${d.city==="LO"?"metro (Tube)":"metro/RER"}${k===0?" desde el alojamiento":""} · <a href="${trUrl(l.from,l.to,1)}" target="_blank" rel="noopener">ver cómo llegar</a></span>`:`<span class="mv">↓ a pie ~${l.min} min${k===0?" desde el alojamiento":""}</span>`;
      h+=actRow(d,a,k,nonEve,SUN,days)});
    if(p.seq.lunch&&!lp)h+=lunch();
    if(!p.seq.lunch&&lr)h+=`<div class="lunch">🍽 ${lr?"Almuerzo en <b>"+esc(lr)+"</b>":""} <small class="muted">(a la hora que les acomode)</small></div>`;
    const back=legs[legs.length-1];h+=`<span class="mv">↓ vuelta al alojamiento ${back.metro?`~${back.min} min en ${d.city==="LO"?"metro (Tube)":"metro/RER"}`:`a pie ~${back.min} min`} · llegada ~${hm(p.end+mv(back.from,back.to))}</span>`;
    const zs=zonesNearPA([p.base||baseLL(),...p.seq.map(a=>a.ll)]);
    if(zs.length)h+=`<details class="riskbox"><summary>⚠ Zona${zs.length>1?"s":""} de precaución: ${zs.map(z=>z.n).join(" · ")}</summary>${zs.map(z=>`<p><b>${z.n}:</b> ${z.t}</p>`).join("")}<p class="muted">Emergencias: <b>112</b> · Policía: <b>17</b> · Ambulancia: <b>15</b></p></details>`;
    if(p.man)h+=`<div class="manord">✋ <b>Orden manual</b>${p.seq.some(a=>a.late||a.closed)?" · ⚠ algo queda fuera de horario":""}<button type="button" data-pmreset="${d.id}">↺ Orden automático</button></div>`;
    h+=`<a class="route" href="${routeUrl(p)}" target="_blank" rel="noopener">🗺 Ver recorrido del día en Google Maps (A = alojamiento, luego ${p.seq.map((_,k)=>k+1).join("→")})</a>`;
    const used=p.seq.reduce((t,a)=>t+a.h,0)+legs.slice(0,-1).reduce((t,l)=>t+mv(l.from,l.to),0);h+=`<span class="tused">⏱ Tiempo usado ${used.toFixed(1)} de ${p.cap.toFixed(1)} h disponibles</span>`}
  else if(d.items&&d.items.length){h+=`<span class="eyebrow seg">Programa sugerido · según la ficha</span>`+d.items.map((v,i)=>`<div class="actrow2 lite"><div class="ar-top"><b class="num anum">${i+1}</b><span class="ar-name">${v}</span></div></div>`).join("")+`<a class="route" href="#" data-efic="${d.c.id}">📖 Ver ficha completa de ${short(d.c.n)}</a>`}
  else if(d.city==="LO")h+=`${(ST.lunchAt||{})[d.id]?`<div class="lunch">🍽 Almuerzo en <b>${esc(ST.lunchAt[d.id])}</b></div>`:""}<span class="muted" style="font-size:13px">Plan libre con Alli.</span><span class="eyebrow seg">Ideas gratis en Londres</span><ul class="brief"><li>British Museum, National Gallery, Tate Modern y Natural History Museum (gratis; algunas exposiciones se pagan)</li><li>Cambio de guardia en Buckingham, St James's Park y Westminster</li><li>Borough Market, Covent Garden y Camden Market</li><li>Luces de Navidad en Regent Street, Oxford Street y Carnaby</li></ul>`;
  else h+=`<span class="muted" style="font-size:13px">${d.kind==="final"?"Mañana libre según la hora del vuelo.":d.kind==="stay"?"Día libre: recorrer sin apuro.":"Libre / descanso"}</span>`;
  if((d.city==="PA"||d.city==="LO")&&d.kind!=="final")h+=`<button type="button" class="btn addact" data-addday="${d.id}">+ Agregar actividad a este día</button>`;
  h+=`</div><div class="blk blk-tr${openActs.has(d.id+"|tr")?" open":""}"><h4>Traslados, alojamiento y plano</h4>`;
  if(c.trn){const fr=d.kind==="ret"?short(fx.n):"París",to=d.kind==="ret"?"París":short(d.c.n);
    h+=`<div class="leg"><div class="line"><span><a href="https://www.sncf-connect.com/" target="_blank" rel="noopener">${fr} → ${to}${d.kind==="trip"?" (ida y vuelta)":""}</a></span><span class="p">${fmt(c.trn)}</span></div><span class="muted" style="font-size:12px">${(d.kind==="ret"?fx:d.c.x).tr} · costo estimado (promedio del rango, 2.ª clase)</span></div>`}
  if(c.navigo!=null)h+=`<div class="line"><span>🎫 Navigo Semaine (prorrateado en la semana) · <a href="#" data-gotab="tra">ver por qué</a></span><span class="p">${fmt(c.navigo)}</span></div>`;
  else if(c.nm)h+=`<div class="line"><span>${c.nm} ${c.nm===1?"viaje":"viajes"} en ${d.city==="LO"?"metro (Tube)":"metro/RER"} × ${fmt(METRO)} · <a href="#" data-gotab="tra">opciones</a></span><span class="p">${fmt(c.nm*METRO)}</span></div>`;
  if(d.kind==="first"&&c.navigo==null)h+=`<div class="line"><span>Metro Gare du Nord → alojamiento</span><span class="p">${fmt(METRO)}</span></div>`;
  if(d.kind==="final"&&c.navigo==null)h+=`<div class="line"><span>RER B al aeropuerto (boleto aeropuerto)</span><span class="p">${fmt(14)}</span></div>`;
  if(d.city==="LO")h+=`<div class="line"><span>Metro y bus sin contacto · tope diario zonas 1–2 (~£9, aprox.)</span><span class="p">${fmt(LON_TR)}</span></div><div class="line"><span>Alojamiento donde Alli</span><span class="p">—</span></div>`;
  if(nightK)h+=`<div class="line"><span>½ alojamiento (2 personas)</span><span class="p">${c.hot?fmt(c.hot):"sin tarifa"}</span></div>`;
  if(c.legs)h+=c.legs.map(l=>`<div class="line sub"><span>${l.metro?"🚇":"🚶"} ${l.fn} → ${l.tn} <small class="muted">${l.d.toFixed(1).replace(".",",")} km · ~${l.min} min · <a href="${trUrl(l.from,l.to,l.metro)}" target="_blank" rel="noopener">ruta</a></small></span></div>`).join("");
  if(d.pa&&d.pa.seq.length)h+=(window.L||window.maplibregl)?`<div class="mapclip lclip" role="button" tabindex="0" data-dmap="${d.id}" aria-label="Ampliar plano del recorrido"><span class="clip" aria-hidden="true"></span><div class="lmap" data-lday="${d.id}"></div><span class="mc-cap">Plano del día · ampliar</span><span class="mc-cr">© OpenFreeMap · OSM</span></div>`:`<button type="button" class="mapclip" data-dmap="${d.id}" aria-label="Ampliar plano del recorrido"><span class="clip" aria-hidden="true"></span>${dayMap(d.pa,c.legs).split("</svg>")[0]}</svg><span class="mc-cap">Plano del día · ampliar</span></button>`;
  else if(d.c&&escPlan(d)&&(window.L||window.maplibregl))h+=`<div class="mapclip lclip" role="button" tabindex="0" data-dmap="${d.id}" aria-label="Ampliar plano de ${esc(short(d.c.n))}"><span class="clip" aria-hidden="true"></span><div class="lmap" data-lday="${d.id}"></div><span class="mc-cap">Plano del día · ampliar</span><span class="mc-cr">© OpenFreeMap · OSM</span></div>`;
  else if(d.c)h+=`<a class="route" href="https://www.google.com/maps/search/?api=1&query=${(X.ll||PARIS).join(",")}" target="_blank" rel="noopener">🗺 Mapa de ${short(d.c.n)}</a>`;
  h+=`</div></div><button type="button" class="totop bot" data-totop>↑ Volver arriba</button>`;
  return `<article class="day" style="--c:${C.c}" data-day="${d.id}" data-city="${d.city}">${h}</article>`}
function pProg(A){if(!A.days.length)return `<div class="card"><p>Completa las fechas de llegada a París y del vuelo de regreso en <b>1 · Configurar</b>.</p></div>`;
  if(!A.C.some(c=>c.k===progCity))progCity="PA";const ds=A.days.filter(d=>d.city===progCity);if(!ds.some(d=>d.id===progDay[progCity]))progDay[progCity]=ds[0]&&ds[0].id;
  const nun=A.R.unpl.length;
  return `${progCity==="LO"?loOrgCard(A):progCity==="PA"?jCard(A)+soloCard(A):""}<div id="feas" class="feas">${fcards(A)}</div><div id="feasmini" class="feasmini ${nun?"bad":"ok"}" role="button" tabindex="0"><span>${nun?`✕ París: no caben ${nun} actividad${nun>1?"es":""}`:"✓ París: todo cabe"}</span><span>${document.body.classList.contains("feas-open")?"ocultar ▴":"ver ▾"}</span></div>
   <div class="daytabs" id="daytabs" role="tablist" aria-label="Ciudad"><button type="button" class="calopen" data-calopen aria-label="Abrir calendario del viaje">📅 Calendario</button>${A.C.map(c=>{const cd=A.days.filter(d=>d.city===c.k);const a=cd[0],b=cd[cd.length-1];return `<button type="button" role="tab" class="dtab" style="--c:${c.c}" data-dtab="${c.k}" aria-selected="${c.k===progCity}"><b>${short(c.n)}</b><small>${a?pretty(a.d):""}${b&&b!==a?" – "+pretty(b.d):""} · ${cd.length} ${cd.length>1?"días":"día"}</small></button>`}).join("")}
    <div class="dchips">${ds.map((d,i)=>`<button type="button" class="dchip" data-dchip="${d.id}" aria-pressed="${d.id===progDay[progCity]}">${pretty(d.d).replace(/ [a-zé]+$/,"")}${d.kind==="first"||d.kind==="go"?" <small>llegada</small>":d.kind==="final"?" <small>fin</small>":d.kind==="ret"?" <small>vuelta</small>":""}</button>`).join("")}</div></div>
   ${progCity==="LO"||progCity==="PA"?wxCard(A,progCity):""}<div class="days" id="days">${A.days.map(d=>dayHTML(d,A).replace(/<article class="day"([^>]*)>/,(m,a)=>`<article class="day"${d.city===progCity?"":" hidden"}${a}>`)).join("")}</div>`}

// ---------- 3 · Alojamiento ----------
function pHot(){const S=stays();if(!S.length)return `<div class="card"><p>Completa las fechas en <b>1 · Configurar</b>.</p></div>`;
  if(!S.some(s=>s.k===hotTab))hotTab=S[0].k;const col=s=>s.k==="par"?PA_C:((ESC.find(x=>s.k.startsWith("esc-"+x.id+"-"))||{}).c||"#666");
  return `<div class="daytabs" id="hottabs" role="tablist" aria-label="Ciudad">${S.map(s=>`<button type="button" role="tab" class="dtab" style="--c:${col(s)}" data-htab="${s.k}" aria-selected="${s.k===hotTab}"><b>${short(s.n)}</b><small>${s.nn} ${s.nn===1?"noche":"noches"} · ${esc(hotSelName(s.k)||"sin elegir")}</small></button>`).join("")}</div>
  <div id="hotels" style="display:flex;flex-direction:column;gap:22px">${S.filter(s=>s.k===hotTab).map(s=>{const L=hotList(s.k);
   return `<div class="city" style="--c:${col(s)}"><h3>${s.n} · ${s.nn} ${s.nn===1?"noche":"noches"} · ${pretty(s.ini)} → ${pretty(s.fin)}</h3>
   ${s.k==="par"&&ST.esc.some(e=>nights(e.ini,e.fin)>0)?`<p class="note">Las noches de las escapadas no se cuentan aquí. Si mantienen el alojamiento de París mientras viajan, ingresen la tarifa total.</p>`:""}
   <div class="hotels">${L.map(o=>{const pp=o.price?(o.mode==="t"?+o.price/Math.max(1,s.nn):+o.price)/2:0;
    return `<div class="opt${o.sel?" on":""}"><div class="opt-top"><input type="radio" name="h-${s.k}" data-hsel="${s.k}|${o.id}" ${o.sel?"checked":""} aria-label="Elegir ${esc(o.n)}"><span class="name">${esc(o.n)}</span><span class="pill ${o.sel?"sel":""}">${o.sel?"✔ Elegido":"Alternativa"}</span></div>
     <dl class="facts"><dt>Dirección</dt><dd><input class="hin" data-hf="${s.k}|${o.id}|addr" value="${esc(o.addr||"")}" placeholder="Calle, número, barrio"></dd>
     <dt>Desayuno</dt><dd><select data-hf="${s.k}|${o.id}|bf"><option value="">Sin dato</option>${["Incluido","No incluido","Cocina propia"].map(v=>`<option ${o.bf===v?"selected":""}>${v}</option>`).join("")}</select></dd>
     <dt>Tarifa 2 pers.</dt><dd><span class="pricebox"><input type="number" step="1" data-hf="${s.k}|${o.id}|price" value="${esc(o.price||"")}" aria-label="Tarifa"> € <select data-hf="${s.k}|${o.id}|mode"><option value="n" ${o.mode!=="t"?"selected":""}>por noche</option><option value="t" ${o.mode==="t"?"selected":""}>total estadía</option></select></span></dd>
     <dt>Notas</dt><dd><input class="hin" data-hf="${s.k}|${o.id}|note" value="${esc(o.note||"")}" placeholder="Metro cercano, check-in, cancelación…"></dd>
     <dt>Costo por persona</dt><dd>${pp?`<b>${fmt(pp)}</b> por noche · <b>${fmt(pp*s.nn)}</b> total`:"—"}</dd></dl>
     <div class="links-row">${o.url?`<a href="${esc(o.url)}" target="_blank" rel="noopener">Ver reserva →</a>`:""}<a href="${bkUrl(o.n+" "+s.city,s.ini,s.fin)}" target="_blank" rel="noopener">Ver disponibilidad en fechas →</a><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((o.addr||o.n)+" "+s.city)}" target="_blank" rel="noopener">Mapa →</a><a href="${GIq(o.n+" "+s.city)}" target="_blank" rel="noopener">Fotos →</a><button type="button" class="lnkb" data-hdel="${s.k}|${o.id}">✕ Eliminar</button></div></div>`}).join("")}
    ${L.length?"":`<div class="opt empty">Todavía no hay alojamientos para ${short(s.n)}. Busquen opciones y agréguenlas para compararlas.</div>`}</div>
   <div class="links-row" style="margin-top:10px"><a href="${bkUrl(s.city,s.ini,s.fin)}" target="_blank" rel="noopener">🔎 Buscar en Booking (2 adultos, estas fechas) →</a><a href="https://www.airbnb.cl/s/${encodeURIComponent(s.city)}/homes?checkin=${s.ini}&checkout=${s.fin}&adults=2" target="_blank" rel="noopener">Airbnb →</a></div>
   <form class="hadd" data-hadd="${s.k}"><b>+ Agregar alojamiento</b><input name="n" required placeholder="Nombre del hotel o departamento"><input name="url" type="url" placeholder="Enlace (opcional)"><button class="btn sm">Agregar</button></form></div>`}).join("")}</div>`}

// ---------- 4 · Trámites previos ----------
function pBuy(){const ck=ST.chk||{};const n=TRAM.filter(t=>ck[t.k]).length;
  return `<div class="card buy"><span class="eyebrow">Paso 1 · Antes de viajar · ${n} de ${TRAM.length} listos</span><h3>Comprar, inscribir o tramitar</h3><ol class="buylist">${TRAM.map(t=>`<li class="${t.u?"urg":""}"><label><input type="checkbox" data-chk="${t.k}" ${ck[t.k]?"checked":""}> <b>${t.t}</b> <span class="tag ${t.u?"urgt":""}">${t.g}</span></label><p>${t.p}</p>${t.l?`<a href="${t.l[1]}" target="_blank" rel="noopener">${t.l[0]}</a>`:""}</li>`).join("")}</ol></div>
  ${TIPS.filter(t=>t[1]!=="Antes de viajar").map(t=>`<div class="card buy"><span class="eyebrow">Consejos</span><h3>${t[0]} ${t[1]}</h3><ul class="brief">${t[2].map(x=>`<li>${x}</li>`).join("")}</ul></div>`).join("")}
  <p class="note">Fuentes: <a href="https://www.bonjour-ratp.fr/titres-tarifs/" target="_blank" rel="noopener">RATP (tarifas 2026)</a> · <a href="https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta" target="_blank" rel="noopener">gov.uk (ETA)</a> · <a href="https://travel-europe.europa.eu/" target="_blank" rel="noopener">UE (EES y ETIAS)</a>. Verificar antes de viajar.</p>`}

// ---------- 5 · Atracciones ----------
function escFichaHTML(id){const x=ESC.find(z=>z.id===id),e=EXT[id]||{},f=e.f||{v:[]};const i=ESC.indexOf(x);const sel=ST.esc.filter(z=>z.id===id);const ph=ESC_WK[id]||[[short(x.n),short(x.n)]];
  return `<article class="ficha" id="fes-${id}"><div class="ftab">EXP. ESC-${String(i+1).padStart(2,"0")} · ${short(x.n).toUpperCase()}</div>
   <header><h3>${x.n}</h3><span class="fy">${(ESC_H[id]||{}).y?ESC_H[id].y+" · ":""}${x.p} ${x.k==="dia"?"Excursión de un día":x.nt==="0–1"?"De un día o 1 noche":x.nt+" noche"+(x.nt==="1"?"":"s")+" sugeridas"}</span>${x.k!=="dia"&&/ams|str|lyo|msm|ver/.test(id)?'<span class="fstamp">★ IMPERDIBLE</span>':""}${sel.length?'<span class="fstamp ok">EN EL PROGRAMA</span>':""}</header>
   <p class="flead">${x.t}</p>
   ${ESC_WHY[id]?`<div class="ewhy"><span class="flab">Por qué ir</span><p>${ESC_WHY[id]}</p></div>`:""}
   ${(ESC_H[id]||{}).h?`<div class="fhist"><span class="flab">Historia</span>${ESC_H[id].h.map(p=>`<p>${p}</p>`).join("")}</div>`:""}
   <div><span class="flab">Por qué vale la pena</span><p>${f.h||""}</p></div>
   <div><span class="flab">Qué van a ver</span><ul class="brief">${f.v.map(v=>`<li>${v}</li>`).join("")}</ul></div>
   <div><span class="flab">Qué probar</span><p>${f.c||""}</p></div>
   <div class="fnote"><span class="flab">Dato / consejo</span><p>${f.d||""}</p><p><b>Cómo llegar:</b> ${e.how||""}</p></div>
   <p class="fmeta">🚄 ${x.tr} · 💶 ${e.cost||""}${sel.length?" · 📅 "+sel.map(z=>pretty(z.ini)+(z.fin!==z.ini?" → "+pretty(z.fin):"")).join(" · "):""}</p>
   <div class="fphotos">${ph.map(p=>`<a class="polaroid" href="${GIq(p[0]+" "+short(x.n))}" target="_blank" rel="noopener"><span class="clip" aria-hidden="true"></span><img class="ph" data-wk="${p[1]}" alt="${p[0]}" loading="lazy"><span class="cap">${p[0]}</span><span class="go">más fotos →</span></a>`).join("")}</div>
   <p class="credit">Fotos: Wikipedia / Wikimedia Commons · ${ph.map(p=>`<a href="${WKq(p[1])}" target="_blank" rel="noopener">${p[1]}</a>`).join(" · ")}</p>
   <div class="flinks"><a href="https://www.sncf-connect.com/" target="_blank" rel="noopener">Trenes (SNCF Connect) ↗</a><a href="${WKq(ph[0][1])}" target="_blank" rel="noopener">Wikipedia ↗</a><a href="https://www.google.com/maps/search/?api=1&query=${(e.ll||PARIS).join(",")}" target="_blank" rel="noopener">Mapa ↗</a>
   <button type="button" class="btn alt sm" data-open="${id}">${sel.length?"+ Otra fecha":"+ Agregar al programa"}</button></div></article>`}
let attFilt="todas";
function cityTabs(cur,attr){const nP=attr==="data-attc"?PA.filter(a=>typOf(a)!=="esp").length:SHOWS.filter(s=>s.w!=="Londres").length,nL=attr==="data-attc"?LON.filter(a=>typOf(a)!=="esp").length:SHOWS.filter(s=>s.w==="Londres").length;
  return `<div class="daytabs ctabs" role="tablist" aria-label="Ciudad"><button type="button" role="tab" class="dtab" style="--c:${LO_C}" ${attr}="LO" aria-selected="${cur==="LO"}"><b>🇬🇧 Londres</b><small>${nL} ${attr==="data-attc"?"atracciones":"eventos"}</small></button><button type="button" role="tab" class="dtab" style="--c:${PA_C}" ${attr}="PA" aria-selected="${cur!=="LO"}"><b>🇫🇷 París</b><small>${nP} ${attr==="data-attc"?"atracciones":"eventos"}</small></button></div>`}
function loFicha(a,i){const sel=selOf(a),w=LO_WK[a.id]||a.wk,lo=isLO(a.id),cu=/^(lo_)?cu/.test(a.id);const late=a.lateo?Object.entries(a.lateo).map(([d,h])=>DOW[d]+" hasta "+hm(h)).join(", "):"";
  return `<article class="ficha" id="fpa-${a.id}"><div class="ftab">EXP. ${lo?"LON":"PAR"}-${String(i+1).padStart(2,"0")} · ${esc(String(a.z).toUpperCase())}${cu?" · AGREGADA":""}</div>
   <header><h3>${a.n}</h3>${a.top?'<span class="fstamp">★ IMPERDIBLE</span>':""}${sel?'<span class="fstamp ok">EN EL PROGRAMA</span>':""}</header>
   <p class="flead">${a.s}</p>
   <div><span class="flab">Qué van a ver</span><p>${a.v}</p></div>
   <div class="fnote"><span class="flab">Dato / consejo</span><p>${a.d}</p></div>
   <p class="fmeta">🕐 visita ~${String(a.h).replace(".",",")} h · ${a.p?fmt(a.p)+(lo?" (≈ £"+Math.round(a.p/GBP)+")":""):"gratis"}${a.close&&!a.eve?` · cierra ${hm(a.close)}`:""}${late?` · 🌙 ${late}`:""}${a.cl?` · cerrado ${a.cl.map(x=>DOW[x]).join(", ")}`:""}${a.in?" · 🏛 techado":""}</p>
   ${w?`<div class="fphotos"><a class="polaroid" href="${GIq(a.n+" London")}" target="_blank" rel="noopener"><span class="clip" aria-hidden="true"></span>${a.img?`<img class="ph" src="${a.img}" alt="${esc(a.n)}" loading="lazy">`:`<img class="ph" data-wk="${w}" alt="${esc(a.n)}" loading="lazy">`}<span class="cap">${esc(a.n.split(/ \(|:/)[0])}</span><span class="go">más fotos →</span></a></div><p class="credit">Foto: Wikipedia / Wikimedia Commons · <a href="${a.wkl==="en"?"https://en.wikipedia.org/wiki/"+encodeURIComponent(w.replace(/ /g,"_")):WKq(w)}" target="_blank" rel="noopener">${w}</a></p>`:""}
   <div class="flinks"><a href="${a.u}" target="_blank" rel="noopener">Sitio oficial ↗</a><a href="https://www.google.com/maps/search/?api=1&query=${a.ll.join(",")}" target="_blank" rel="noopener">Mapa ↗</a><button type="button" class="btn ${sel?"alt ":""}sm" data-pasel-btn="${a.id}">${sel?"✕ Quitar del programa":"+ Agregar al programa"}</button>${cu?`<button type="button" class="lnkb" data-fdel="att|${a.id}">quitar de la lista</button>`:""}</div></article>`}
function pAtt(A){const C=[A.C.find(c=>c.k==="PA")];if(attCity!=="LO")attCity="PA";
  if(attCity==="LO"){const fl=[["todas","Todas"],["prog","En el programa"],["top","★ Imperdibles"],["in","🏛 Techadas"]];
    const L=LON.filter(a=>typOf(a)!=="esp").filter(a=>attFilt==="todas"||(attFilt==="prog"&&loSel(a))||(attFilt==="top"&&a.top)||(attFilt==="in"&&a.in));L.sort((x,y)=>(loSel(y)-loSel(x))||((y.top?1:0)-(x.top?1:0)));
    return cityTabs("LO","data-attc")+findBtn("att","LO")+`<p class="note">Atracciones de Londres (precios en € con 1 £ = 1,17 €; verificar antes de comprar). Los espectáculos y eventos están en 5 · Espectáculos.</p>
     <div class="filters" style="margin:6px 0">${fl.map(([k,t])=>`<button type="button" class="chip" data-attf="${k}" aria-pressed="${attFilt===k}">${t}</button>`).join("")}${manBtn("att","LO")}</div>${manPanel("att","LO")}
     <div class="fichas">${L.map(a=>loFicha(a,LON.indexOf(a))).join("")}</div>`}
  let h=cityTabs("PA","data-attc")+findBtn("att","PA")+`<p class="note">Atracciones de París. Las fichas de las escapadas están en 4 · Escapadas.</p>`;
  if(attCity!=="PA"){const c=C.find(z=>z.k===attCity);return h+`<div class="fichas">${escFichaHTML(c.id)}</div><p class="note">Las fichas de cada atracción de las escapadas vienen en la próxima etapa.</p>`}
  const fl=[["todas","Todas"],["prog","En el programa"],["top","★ Imperdibles"],["in","🏛 Techadas"]];
  const L=PA.filter(a=>PA_F[a.id]).filter(a=>attFilt==="todas"||(attFilt==="prog"&&paSel(a))||(attFilt==="top"&&a.top)||(attFilt==="in"&&a.in));
  L.sort((x,y)=>(paSel(y)-paSel(x))||((y.top?1:0)-(x.top?1:0)));const rest=PA.filter(a=>!PA_F[a.id]&&typOf(a)!=="esp"&&!/^cu/.test(a.id));const CU=PA.filter(a=>/^cu/.test(a.id)&&typOf(a)!=="esp");
  return h+`<section class="ctx card"><span class="eyebrow">Contexto histórico</span><h2>${CTX_PA.t}</h2>${tlSVG(CTX_PA.tl)}${CTX_PA.p.map(p=>`<p>${p}</p>`).join("")}</section>
   <div class="filters" style="margin:6px 0">${fl.map(([k,t])=>`<button type="button" class="chip" data-attf="${k}" aria-pressed="${attFilt===k}">${t}</button>`).join("")}${manBtn("att","PA")}</div>${manPanel("att","PA")}
   <div class="fichas">${CU.map(a=>loFicha(a,PA.indexOf(a))).join("")}${L.map(a=>paFicha(a,PA.indexOf(a))).join("")}</div>
   ${rest.length?`<div class="card"><span class="eyebrow">Otras, en breve</span><ul class="brief">${rest.map(a=>`<li><b>${a.n}</b>: ${a.s} ${a.d}</li>`).join("")}</ul></div>`:""}
   <section class="card media"><span class="eyebrow">Para llegar sabiendo</span><h2>Películas, series y libros · París</h2><div class="mgrid">${MEDIA_PA.map(m=>`<div class="mitem"><b>${m[0]}</b>${m[3]?` <span class="tag">${m[3]}</span>`:""}<small>${m[1]}</small><p>${m[2]}</p></div>`).join("")}</div><p class="note">Las clasificaciones por edad son aproximadas.</p></section>`}

// ---------- 6 · Espectáculos ----------
let showCity="PA";
function pShow(){const W=ST.wiz,lo=showCity==="LO",a=lo?W[K.llega]:W[K.parIni],b=lo?W[K.parIni]:W[K.parFin];const inT=s=>a&&b&&s.ini<=b&&s.fin>=a;
  const L=SHOWS.filter(s=>(s.w==="Londres")===lo).sort((x,y)=>(inT(y)-inT(x))||((y.top|0)-(x.top|0))||((x.al|0)-(y.al|0))||(x.ini<y.ini?-1:1));
  const ml=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  return `${cityTabs(lo?"LO":"PA","data-showc")}<div class="filters" style="margin:6px 0">${findBtn("show",lo?"LO":"PA")}${manBtn("show",lo?"LO":"PA")}</div>${manPanel("show",lo?"LO":"PA")}${a&&b?`<p class="note">${lo?"En Londres":"En Francia"}: ${pretty(a)} → ${pretty(b)}. Los eventos con sello «EN SUS FECHAS» coinciden con el viaje.${lo?" Precios en libras.":""}</p>`:""}
   <div class="fichas">${L.map((s,i)=>{const ok=inT(s),x=SHOW_X[s.n]||{};const e=s.esc&&ESC.find(q=>q.id===s.esc);const chosen=s.esc&&ST.esc.some(q=>q.id===s.esc);
    return `<article class="ficha${ok?"":" off"}"><div class="ftab">EXP. EVT-${String(i+1).padStart(2,"0")} · ${s.w.toUpperCase()}</div>
     <header><h3>${s.e} ${s.n}</h3>${x.y?`<span class="fy">${x.y}</span>`:""}${s.top?'<span class="fstamp">★ IMPERDIBLE</span>':""}${ok?'<span class="fstamp ok">EN SUS FECHAS</span>':'<span class="fstamp">FUERA DE FECHAS</span>'}</header>
     <p class="flead">${s.t}</p>
     ${x.h?`<div class="fhist"><span class="flab">Historia</span>${x.h.map(p=>`<p>${p}</p>`).join("")}</div>`:""}
     ${x.v?`<div><span class="flab">Qué van a ver</span><p>${x.v}</p></div>`:""}
     <div class="fnote"><span class="flab">Dato / consejo</span><p>${s.d}</p></div>
     <p class="fmeta">📍 ${s.w} · 📅 ${s.al?"todas las noches":`${pretty(s.ini)} → ${pretty(s.fin)}${s.ap?" (aprox.)":""}`}${x.q?" · 🎟 "+x.q:""}</p>
     ${x.w?`<div class="fphotos"><a class="polaroid" href="${GIq(s.n)}" target="_blank" rel="noopener"><span class="clip" aria-hidden="true"></span><img class="ph" data-wk="${x.w}" alt="${s.n}" loading="lazy"><span class="cap">${s.n.split(":")[0]}</span><span class="go">más fotos →</span></a></div><p class="credit">Foto: Wikipedia / Wikimedia Commons · <a href="${WKq(x.w)}" target="_blank" rel="noopener">${x.w}</a></p>`:""}
     <div class="flinks"><a href="${s.u}" target="_blank" rel="noopener">Sitio oficial ↗</a>${x.w?`<a href="${WKq(x.w)}" target="_blank" rel="noopener">Wikipedia ↗</a>`:""}${x.m?`<a href="${ml(x.m)}" target="_blank" rel="noopener">Mapa ↗</a>`:""}${s.cu&&s.act?`<button type="button" class="lnkb" data-fdel="show|${s.act}">quitar de la lista</button>`:""}${s.act&&actById(s.act)?`<button type="button" class="btn ${selOf(actById(s.act))?"alt ":""}sm" data-pasel-btn="${s.act}">${selOf(actById(s.act))?"✕ Quitar del programa":"+ Agregar al programa"}</button>`:""}${e?(chosen?`<span class="tag">✓ escapada elegida</span>`:`<button type="button" class="btn alt sm" data-goesc="${s.esc}">Ver escapada a ${e.n} →</button>`):""}</div></article>`}).join("")}</div>
   <p class="note">Fuentes: <a href="https://icalendrier.fr/evenements/fete-des-lumieres" target="_blank" rel="noopener">iCalendrier (Fête des Lumières 2026)</a> · <a href="https://www.parisinsidersguide.com/paris-events-in-december.html" target="_blank" rel="noopener">Paris Insiders Guide</a>. Las fechas «aprox.» se confirman en noviembre.</p>`}
// ===== 8 · Comidas: sugerencias y precios aproximados 2026 (por persona; verificar en el lugar) =====
// escapadas: plato típico, precios y lugares
let foodCity="PA";
// ===== Guía de comida económica por lugar: callejera típica · barato · bistró de precio acotado (precios aprox. 2026 por persona; verificar) =====
// [nombre, qué pedir, precio, búsqueda en mapa]
function daysFor(key){const A=window.LAST_A;if(!A)return[];return A.days.filter(d=>key==="PA"?d.city==="PA"&&d.kind!=="final":key==="LO"?d.city==="LO":d.c&&d.c.id===key)}
function lunchSel(name,key){const ds=daysFor(key);if(!ds.length)return"";const L=ST.lunchAt||{};const cur=ds.find(d=>L[d.id]===name);
  return `<select class="daysel lunchsel" data-lunchpick="${esc(name)}|${key}" aria-label="Almorzar en ${esc(name)} el día"><option value="">🍽 almorzar aquí el…</option>${ds.map(d=>`<option value="${d.id}" ${cur&&cur.id===d.id?"selected":""}>${pretty(d.d)}</option>`).join("")}${cur?`<option value="-">✕ quitar</option>`:""}</select>`}
const mlinkQ=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
function foodGuide(key){const G=FOOD_G[key];if(!G)return"";
  return `<div class="card buy fguide"><span class="eyebrow">Comer bien y barato · precios aproximados por persona</span>${G.p?`<p>${G.p}</p>`:""}
   ${G.c.map(([t,L])=>`<h4 style="margin:12px 0 4px">${t}</h4><div class="tbl-wrap"><table class="ftbl lunch"><tbody>${L.map(r=>`<tr><td><b>${esc(r[0])}</b><br><small class="muted">${esc(r[1])}</small><br><a href="${mlinkQ(r[3])}" target="_blank" rel="noopener">mapa</a></td><td class="r num"><b>${esc(r[2])}</b></td><td class="r">${key==="PA"||key==="LO"?`<button type="button" class="favb${favOf(r[0],key)?" on":""}" data-fav="${key}|${esc(r[0])}||${esc(r[2])}" title="Favorito">${favOf(r[0],key)?"★":"☆"}</button> `:""}${lunchSel(r[0],key)}</td></tr>`).join("")}</tbody></table></div>`).join("")}
   <p class="note">Selección de lugares conocidos y económicos; precios aproximados 2026, verificar en el lugar.</p></div>`}
function foodCustomCard(key){const L=((ST.custom||{}).food||[]).filter(x=>(x.city||"PA")===key);
  return `<div class="card buy fcust"><span class="eyebrow">Lugares agregados por ustedes</span>
   ${L.length?`<div class="tbl-wrap"><table class="ftbl lunch"><tbody>${L.map(x=>`<tr><td><b>${esc(x.n)}</b>${x.ft?` <span class="tag">${esc(x.ft)}</span>`:""}<br><small class="muted">${esc(x.addr||"")}${x.s&&x.s!==x.n?" · "+esc(x.s):""}</small><br>${x.ll?`<a href="${mlinkQ(x.ll.join(","))}" target="_blank" rel="noopener">mapa</a> · `:""}<button type="button" class="lnkb" data-fdel="food|${x.id}">quitar</button></td><td class="r num"><b>${esc(x.pr||"")}</b></td><td class="r">${lunchSel(x.n,key)}</td></tr>`).join("")}</tbody></table></div>`:`<p class="muted" style="font-size:14px">Todavía no agregan lugares aquí.</p>`}
   <details class="manf"><summary>✍ Agregar un lugar a mano (restaurante, café, local de una amiga…)</summary>
    <form class="fform" data-foodman="${key}"><label class="f">Nombre<input name="n" required placeholder="Ej.: Bistrot Paul Bert"></label><label class="f">Tipo<select name="ft"><option>Restaurante</option><option>Bistró</option><option>Café</option><option>Panadería / boulangerie</option><option>Comida callejera</option><option>Comida rápida</option><option>Pub</option><option>Mercado</option></select></label><label class="f">Precio aprox. por persona<input name="pr" placeholder="Ej.: 15–20 €"></label><label class="f">Barrio o zona (opcional)<input name="z"></label><label class="f wide">Dirección (opcional)<input name="addr" placeholder="Para ubicarlo en el mapa"></label><label class="f wide">Nota (opcional)<input name="s" placeholder="Ej.: pedir el plato del día"></label><div class="act wide"><button type="submit" class="btn sm">＋ Agregar a Comidas</button></div></form></details>
   ${key==="PA"||key==="LO"?findBtn("food",key):""}</div>`}
async function saveFoodMan(f){const key=f.dataset.foodman;const g=k=>(f[k]&&f[k].value||"").trim();const n=g("n");if(!n)return;const b=f.querySelector("button[type=submit]");b.disabled=true;b.textContent="Guardando…";
  let ll=null,addr=g("addr");const ctx=key==="PA"?"Paris":key==="LO"?"London":((ESC.find(x=>x.id===key)||{}).n||"");
  if(addr){try{const j=await (await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=es&q=${encodeURIComponent(addr+", "+ctx)}`)).json();if(j[0]){ll=[+(+j[0].lat).toFixed(5),+(+j[0].lon).toFixed(5)];addr=j[0].display_name.split(",").slice(0,3).join(",")}}catch(e){}}
  const c=ST.custom=ST.custom||{};(c.food=c.food||[]).push({id:"cf"+Date.now().toString(36),n,city:key,ft:g("ft"),pr:g("pr"),addr:addr||g("z"),z:g("z"),ll,s:g("s"),u:"",by:(user&&user.email)||""});save();render();toast(`✔ <b>${esc(n)}</b> agregado a Comidas · pueden elegirlo como almuerzo de cualquier día`)}
function bindFood2(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-lunchx]",b=>b.onclick=()=>{if(ST.lunchAt)delete ST.lunchAt[b.dataset.lunchx];save();render()});
  Q("[data-lunchpick]",x=>x.onchange=()=>{const [name,key]=x.dataset.lunchpick.split(/\|(?=[^|]*$)/);ST.lunchAt=ST.lunchAt||{};daysFor(key).forEach(d=>{if(ST.lunchAt[d.id]===name&&x.value!==d.id)delete ST.lunchAt[d.id]});if(x.value&&x.value!=="-"){ST.lunchAt[x.value]=name;const d=daysFor(key).find(z=>z.id===x.value);toast(`🍽 Almuerzo en <b>${esc(name)}</b> el ${d?pretty(d.d):""}`)}save();render()});
  Q("[data-foodman]",f=>f.onsubmit=e=>{e.preventDefault();saveFoodMan(f)});
  Q("[data-addlunchn]",b=>b.onclick=()=>{ST.lunchAt=ST.lunchAt||{};ST.lunchAt[addDay]=b.dataset.addlunchn;const n=b.dataset.addlunchn;addDay=null;save();render();toast(`🍽 Almuerzo en <b>${esc(n)}</b>`)});
  Q("[data-lunchfree]",f=>f.onsubmit=e=>{e.preventDefault();const n=f.n.value.trim();if(!n)return;ST.lunchAt=ST.lunchAt||{};ST.lunchAt[addDay]=n;addDay=null;save();render();toast(`🍽 Almuerzo en <b>${esc(n)}</b>`)})}

function pFood(A){const C=[...(lonDays().length?[{k:"LO",n:"Londres"}]:[]),A.C.find(c=>c.k==="PA"),...A.C.filter(c=>c.e).filter((c,i,a)=>a.findIndex(z=>z.id===c.id)===i)];if(!C.some(c=>c.k===foodCity))foodCity="PA";
  const fs=ST.foodStyle==="fast";const daily=(PA_MEAL.d[0][1]+3*PA_MEAL.d[2][1])/4+["a","c"].reduce((t,k)=>t+PA_MEAL[k][fs?1:0][1],0);
  let h=`<div class="card cfg"><div class="field"><span>Estilo de comida (por defecto en todos los días)</span><div class="seg" role="group"><button type="button" data-food="fast" aria-pressed="${fs}">Comida rápida</button><button type="button" data-food="local" aria-pressed="${!fs}">Bistró y boulangerie</button></div></div>
   <p class="muted" style="font-size:13.5px;margin:0;align-self:end">Desayuno en la casa (1 de cada 4 días en boulangerie), ${fs?"almuerzo crêpe o sándwich, cena al paso":"almuerzo «formule» de bistró, cena en bistró de barrio"} ≈ <b>${fmt(daily)}</b> por persona al día. Cada día se puede cambiar en 2 · Programa → Comidas.</p></div>
   <div class="attbar" role="group" aria-label="Lugar">${C.map(c=>`<button type="button" class="btn ${c.k===foodCity?"":"alt"}" data-foodc="${c.k}" aria-pressed="${c.k===foodCity}">${short(c.n)}</button>`).join("")}</div>`;
  const mlink=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  const fkey=foodCity==="PA"||foodCity==="LO"?foodCity:(C.find(z=>z.k===foodCity)||{}).id;
  if(foodCity==="LO"){h+=favCard("LO")+foodGuide("LO")+foodCustomCard("LO");return h+`<p class="note">Precios aproximados por persona, 2026; verificar en el lugar. En Londres se paga en libras.</p>`}
  if(foodCity==="PA"){h+=favCard("PA")+foodCustomCard("PA");
    h+=`<div class="card buy"><span class="eyebrow">✓ Precios verificados · almuerzo francés rápido y barato</span><h3>Bouillons, crêpes y bistrós de menú único</h3>
     <p>Los <b>bouillons</b> son comedores tradicionales franceses con platos clásicos (huevo mayo, salchicha con puré, bœuf bourguignon) a precio bajo y servicio rápido. La mayoría <b>no toma reservas</b>: llegar 12:00–12:30 o después de las 14:00.</p>
     <div class="tbl-wrap"><table class="ftbl lunch"><thead><tr><th>Lugar</th><th>Qué se pide</th><th class="r">Precio p/p</th></tr></thead><tbody>${LUNCH_V.map(r=>`<tr><td><b>${esc(r[0])}</b><br><small class="muted">${r[1]}</small><br><a href="${mlink(r[6])}" target="_blank" rel="noopener">mapa</a> · <a href="${r[5]}" target="_blank" rel="noopener">fuente: ${r[4]}</a></td><td>${r[2]}</td><td class="r num"><b>${esc(r[3])}</b></td></tr>`).join("")}</tbody></table></div>
     <p class="note">Rangos de entradas y platos tal como los publican las fuentes indicadas; el total aproximado es una suma de referencia. Verificar la carta del día.</p></div>`;
    h+=`<div class="fichas">${FOOD_PA.map((s,i)=>`<article class="ficha"><div class="ftab">COMIDAS · ${String(i+1).padStart(2,"0")}</div><header><h3>${s.t}</h3></header><table class="ftbl"><tbody>${s.r.map(r=>`<tr><td>${r[0]}</td><td class="num">${r[1]}</td></tr>`).join("")}</tbody></table><div class="fnote"><span class="flab">Consejo</span><p>${s.n}</p></div></article>`).join("")}</div>
     ${BARRIOS.map(b=>`<div class="card buy"><span class="eyebrow">Guía de barrio · solo opciones económicas</span><h3>${b.n}</h3>${b.g.map(g=>`<h4 style="margin:10px 0 2px">${g[0]}</h4><ul class="brief">${g[1].map(x=>`<li><b>${x[0]}</b>: ${x[1]} · <a href="${mlink(x[0]+" "+b.n+" Paris")}" target="_blank" rel="noopener">mapa</a></li>`).join("")}</ul>`).join("")}<p class="note">Selección de <a href="${b.u}" target="_blank" rel="noopener">Everyday Parisian</a>, sin hoteles, spas ni tiendas caras. La guía no publica precios.</p></div>`).join("")}
     <div class="card buy"><span class="eyebrow">Recomendados en París</span><h3>Dónde comer</h3><ul class="brief">${PLACES_PA.map(p=>`<li><b>${p[0]}</b> <span class="tag">${p[1]}</span> <span class="tag">${p[2]}</span><br>${p[3]} <a href="${mlink(p[4])}" target="_blank" rel="noopener">mapa</a></li>`).join("")}</ul></div>`}
  else{const c=C.find(z=>z.k===foodCity),F=FOOD_ESC[c.id];
    h+=foodGuide(c.id)+foodCustomCard(c.id);
    h+=F?`<div class="fichas"><article class="ficha"><div class="ftab">COMIDAS · ${short(c.n).toUpperCase()}</div><header><h3>${c.p} ${c.n}</h3></header><p class="flead">${F.p}</p><table class="ftbl"><tbody>${F.r.map(r=>`<tr><td>${r[0]}</td><td class="num">${r[1]}</td></tr>`).join("")}</tbody></table>
     <div><span class="flab">Dónde</span><ul class="brief">${F.l.map(l=>`<li>${l[0]} · <a href="${mlink(l[1])}" target="_blank" rel="noopener">mapa</a></li>`).join("")}</ul></div></article></div>`:`<p class="note">Sin datos de comida para ${c.n}.</p>`}
  return h+`<p class="note">Precios aproximados por persona, 2026; verificar en el lugar. En Suiza se paga en francos (CHF).</p>`}


// ---------- tipos de actividad, selector de día y hoja «Agregar actividad» ----------
const typOf=a=>a.t||PA_T[a.id]||"pas";
const TYP=[["pas","Paseos y barrios"],["mus","Museos"],["mon","Monumentos y miradores"],["igl","Iglesias"],["ent","Atracciones entretenidas"],["esp","Espectáculos"],["tie","Tiendas"],["otr","Personales y otros"],["cen","Cenas entretenidas"],["per","Personalizada"],["com","Restaurantes"],["via","Viajes"]];
function nearDays(id){const a=actById(id);const A=window.LAST_A;if(!a||!A)return{};const out={};A.days.forEach(d=>{if(!d.pa)return;let best=null;d.pa.seq.forEach(b=>{if(b.id===id)return;const k=km(a.ll,b.ll);if(k<=1.3&&(!best||k<best.k))best={k,n:b.n.replace(/\s*\(.*?\)/,"")}});if(best){const free=d.pa.cap-d.pa.seq.reduce((t,x)=>t+x.h+0.3,0);out[d.d]={...best,min:Math.max(5,Math.round(best.k*13/5)*5),fits:free>=a.h}}});return out}
function daySelPA(id,cls){const days=isLO(id)?lonDays():parisDays();const pin=(ST.paPin||{})[id]||"";const on=selOf(actById(id));const N=nearDays(id);
  return `<select class="daysel addsel ${cls}${on?"":" new"}" data-paday="${id}" aria-label="Agregar a un día">${on?`<option value="auto">📅 Automático${!pin&&ACTDAY[id]?" → "+pretty(ACTDAY[id]):""}</option><option value="off">✕ Quitar del programa</option>`:`<option value="" selected>+ Agregar (día automático)…</option><option value="auto">Día automático</option>`}${days.map(x=>`<option value="${x.d}" ${pin===x.d?"selected":""}>${pretty(x.d)}${N[x.d]?` · ★ a ~${N[x.d].min} min de ${N[x.d].n}${N[x.d].fits?"":" (día lleno)"}`:""}</option>`).join("")}</select>`}
let addDay=null,addTyp="pas";

function perForm(d,lo){return `<form class="fform perf" data-perform="${d}|${lo?"LO":"PA"}">
  <label class="f wide">Actividad<input name="n" required placeholder="Ej.: Cumpleaños de Sofía, compras en Primark, visita a la tía"></label>
  <label class="f wide">Dirección (opcional)<input name="addr" placeholder="${lo?"Ej.: 200 Camden High Street":"Ej.: 12 rue de Rivoli"}"></label>
  <label class="f">Duración (horas)<input name="h" type="number" min="0.25" step="0.25" value="1"></label>
  <label class="f">Hora (opcional)<input name="at" type="time"></label>
  <label class="f">Costo por persona (€, opcional)<input name="p" type="number" min="0" step="0.5" value="0"></label>
  <label class="f wide">Nota (opcional)<input name="s" placeholder="Ej.: llevar regalo, reservar mesa"></label>
  <div class="act wide"><button type="submit" class="btn sm">＋ Agregar a este día</button></div>
  <p class="muted wide" style="font-size:13px;margin:0">Con dirección, la app la ubica en el plano y calcula el traslado. Sin dirección, queda registrada en el día con su duración, sin traslado.</p></form>`}
async function savePer(f){const [d,city]=f.dataset.perform.split("|");const g=k=>(f[k]&&f[k].value||"").trim();const n=g("n");if(!n)return;
  const btn=f.querySelector("button[type=submit]");btn.disabled=true;btn.textContent="Guardando…";
  let ll=null,addr=g("addr"),found="";
  if(addr){try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=es&q=${encodeURIComponent(addr+(city==="LO"?", London":", Paris"))}&viewbox=${VB[city]}`);const j=await r.json();if(j[0]){ll=[+(+j[0].lat).toFixed(5),+(+j[0].lon).toFixed(5)];found=j[0].display_name.split(",").slice(0,3).join(",")}}catch(e){}}
  const at=g("at");const atH=at?(+at.split(":")[0]+(+at.split(":")[1])/60):0;
  const id=(city==="LO"?"lo_cu":"cu")+Date.now().toString(36);const base=city==="LO"?lonBase():baseLL();
  const a={id,t:"per",n,h:+g("h")||1,p:+g("p")||0,in:0,ll:ll||base,noloc:ll?0:1,addr:found||addr,s:g("s")||(ll?found:"Actividad personal"),v:addr?(ll?"📍 "+found:"Dirección sin ubicar: "+addr):"Sin dirección",d:g("s")||"",u:ll?`https://www.google.com/maps/search/?api=1&query=${ll.join(",")}`:"",z:"Personal",city,by:(user&&user.email)||""};
  if(atH){a.at=atH;if(atH>=17)a.eve=1}
  const c=ST.custom=ST.custom||{};(c.att=c.att||[]).push(a);ST.paSel=ST.paSel||{};ST.paSel[id]=true;ST.paPin=ST.paPin||{};ST.paPin[id]=d;addDay=null;save();render();
  toast(`✔ <b>${esc(n)}</b> agregada al ${pretty(d)}${addr&&!ll?" · no encontré la dirección: quedó sin traslado":""}`)}
function addSheet(){if(!addDay)return"";const lo=addDay.startsWith("L"),d=addDay.replace(/^L/,"");let list="";
  if(addTyp==="new")list=perForm(d,lo);
  else if(addTyp==="per"){const L=(lo?LON:PA).filter(a=>typOf(a)==="per"&&!selOf(a));list=L.length?L.map(a=>`<div class="addrow"><span><b>${esc(a.n)}</b><small>~${String(a.h).replace(".",",")} h · ${esc(a.v||"")}</small></span><button type="button" class="btn sm" data-addact="${a.id}">Agregar</button></div>`).join(""):`<p class="muted">Todavía no hay actividades personalizadas sin programar. Creen una con <b>«＋ Nueva actividad»</b>.</p>`}
  else if(addTyp==="com"&&lo){const G=[...FOOD_G.LO.c.flatMap(c=>c[1]).map(r=>[r[0],r[1],r[2]]),...((ST.custom||{}).food||[]).filter(x=>x.city==="LO").map(x=>[x.n,x.ft||"",x.pr||""])];list=`<form class="fsearch" data-lunchfree><input name="n" placeholder="Otro lugar: escriban el nombre" aria-label="Nombre del lugar"><button type="submit" class="btn sm">Almorzar aquí</button></form>`+G.map(r=>`<div class="addrow"><span><b>${esc(r[0])}</b><small>${esc(r[1])} · ${esc(r[2])}</small></span><button type="button" class="btn sm" data-addlunchn="${esc(r[0])}">Almorzar aquí</button></div>`).join("")}
  else if(addTyp==="com")list=`<form class="fsearch" data-lunchfree><input name="n" placeholder="Otro lugar: escriban el nombre" aria-label="Nombre del lugar"><button type="submit" class="btn sm">Almorzar aquí</button></form>`+LUNCH_V.map((r,i)=>`<div class="addrow"><span><b>${esc(r[0])}</b><small>${r[1]} · ${r[3]}</small></span><button type="button" class="btn sm" data-addlunch="${i}">Almorzar aquí</button></div>`).join("");
  else if(addTyp==="via"){const ok=x=>!overlap(d,d);list=ESC.filter(x=>x.k!=="noche").map(x=>`<div class="addrow"><span><b>${x.p} ${x.n}</b><small>🚄 ${x.tr} · ${x.k==="dia"?"de un día":"día o 1 noche"}</small></span><button type="button" class="btn sm" data-addtrip="${x.id}" ${ok(x)?"":"disabled"}>Ir este día</button></div>`).join("")+`<p class="muted" style="font-size:13px">Las escapadas con noches se agregan en 4 · Escapadas.</p>`}
  else{const L=(lo?LON:PA).filter(a=>!selOf(a)&&typOf(a)===addTyp);list=L.map(a=>{const N=nearDays(a.id);const alt=Object.entries(N).filter(([dd,v])=>dd!==d&&v.fits).sort((x,y)=>x[1].k-y[1].k)[0];const here=N[d];return `<div class="addrow"><span><b>${a.n}</b>${a.top?' <span class="top">★</span>':""}${here?`<small class="okl">★ Este día ya visitan ${here.n}, a ~${here.min} min a pie.</small>`:alt?`<small class="hint">💡 El ${pretty(alt[0])} visitan ${alt[1].n}, a ~${alt[1].min} min a pie. <button type="button" class="lnkb" data-addactd="${a.id}|${alt[0]}">Ponerlo ese día</button></small>`:""}<small>~${String(a.h).replace(".",",")} h · ${a.p?fmt(a.p):"gratis"}${a.in?" · 🏛 techado":""}${a.cl?` · cerrado ${a.cl.map(x=>DOW[x]).join(", ")}`:""} · ${a.s}</small></span><button type="button" class="btn sm" data-addact="${a.id}" ${a.cl&&a.cl.includes(D(d).getDay())?"disabled title=\"Cerrado ese día\"":""}>Agregar</button></div>`}).join("")||`<p class="muted">Ya están todas en el programa.</p>`}
  return `<div class="fov" data-aclose="1"><article class="fsheet" style="--c:${lo?LO_C:PA_C}" role="dialog" aria-label="Agregar actividad"><button type="button" class="btn alt sm fx" data-aclose="1" aria-label="Cerrar">✕</button>
   <span class="eyebrow">${pretty(d)} · ${lo?"Londres":"París"}</span><h2>Agregar actividad</h2>
   <div class="filters" style="margin:4px 0 10px;flex-wrap:wrap">${TYP.filter(t=>!lo||t[0]!=="via").map(([k,t])=>`<button type="button" class="chip" data-addtyp="${k}" aria-pressed="${addTyp===k}">${t}</button>`).join("")}<button type="button" class="chip newchip" data-addtyp="new" aria-pressed="${addTyp==="new"}">＋ Nueva actividad</button></div>
   <div class="addlist">${list}</div></article></div>`}
// ---------- planos del día con calles (OpenStreetMap) y zonas de precaución achuradas ----------
let _hz=0;
// ---------- plano estilo cuaderno (MapLibre + OpenFreeMap, colores del viaje a Alemania) ----------
const MLC={land:"#f4ead2",sea:"#c9d7d2",seaEdge:"#a9bab4",park:"#dfe0bf",wood:"#d3d7b2",bld:"#e7d7b4",bldEdge:"#cdb98f",major:"#ecdcb6",majorCase:"#a8956f",mid:"#fffdf5",midCase:"#a8956f",minor:"#fffdf5",minorCase:"#bba985",path:"#c2b08a",rail:"#9c8f7a",lab:"#6d6455"};
function mlStyle(){const C=MLC,z=(a,b,c,d)=>["interpolate",["exponential",1.5],["zoom"],a,b,c,d],tr=k=>["in",["get","class"],["literal",k]];
  const ln=(id,f,col,w,o={})=>({id,type:"line",source:"o","source-layer":"transportation",filter:tr(f),layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":col,"line-width":w,...o}});
  return {version:8,glyphs:"https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",sources:{o:{type:"vector",url:"https://tiles.openfreemap.org/planet"}},layers:[
   {id:"bg",type:"background",paint:{"background-color":C.land}},
   {id:"park",type:"fill",source:"o","source-layer":"park",paint:{"fill-color":C.park}},
   {id:"lc",type:"fill",source:"o","source-layer":"landcover",filter:tr(["grass","wood","farmland"]),paint:{"fill-color":["match",["get","class"],"wood",C.wood,C.park]}},
   {id:"lu",type:"fill",source:"o","source-layer":"landuse",filter:tr(["cemetery","pitch","stadium"]),paint:{"fill-color":C.park,"fill-opacity":.7}},
   {id:"water",type:"fill",source:"o","source-layer":"water",paint:{"fill-color":C.sea,"fill-outline-color":C.seaEdge}},
   {id:"waterway",type:"line",source:"o","source-layer":"waterway",paint:{"line-color":C.sea,"line-width":z(12,1,18,6)}},
   {id:"bld",type:"fill",source:"o","source-layer":"building",minzoom:13,paint:{"fill-color":C.bld,"fill-outline-color":C.bldEdge,"fill-opacity":z(13,.4,15,1)}},
   {...ln("path",["path","track"],C.path,1,{"line-dasharray":[2,2]}),minzoom:14},
   ln("minor-c",["minor","service"],C.minorCase,z(12,.8,18,14)),ln("mid-c",["secondary","tertiary"],C.midCase,z(11,1,18,20)),ln("maj-c",["motorway","trunk","primary"],C.majorCase,z(10,1.5,18,26)),
   ln("minor",["minor","service"],C.minor,z(12,.4,18,11)),ln("mid",["secondary","tertiary"],C.mid,z(11,.6,18,16)),ln("maj",["motorway","trunk","primary"],C.major,z(10,1,18,21)),
   {id:"rail",type:"line",source:"o","source-layer":"transportation",filter:["all",["==",["get","class"],"rail"],["!",["has","brunnel"]]],paint:{"line-color":C.rail,"line-width":1.2,"line-dasharray":[4,3]}},
   {id:"wname",type:"symbol",source:"o","source-layer":"waterway",minzoom:13,layout:{"text-field":["get","name"],"text-font":["Noto Sans Italic"],"text-size":13,"symbol-placement":"line","text-letter-spacing":.15},paint:{"text-color":"#5f7f8f","text-halo-color":C.sea,"text-halo-width":1.5}},
   {id:"rname",type:"symbol",source:"o","source-layer":"transportation_name",minzoom:14.5,layout:{"text-field":["get","name"],"text-font":["Noto Sans Regular"],"text-size":z(14,9.5,18,13),"symbol-placement":"line"},paint:{"text-color":C.lab,"text-halo-color":C.land,"text-halo-width":1.6}},
   {id:"pname",type:"symbol",source:"o","source-layer":"poi",minzoom:15,filter:tr(["park","garden"]),layout:{"text-field":["get","name"],"text-font":["Noto Sans Italic"],"text-size":12},paint:{"text-color":"#4f6b3e","text-halo-color":C.park,"text-halo-width":1.4}}]}}
// rutas a pie por calles (OSRM, perfil peatón), con caché
const WALK={};try{Object.assign(WALK,JSON.parse(localStorage.getItem("mp_walk")||"{}"))}catch(e){}
const wkey=l=>[l.from,l.to].map(p=>p.map(v=>v.toFixed(4)).join(",")).join(";");
function walkGeo(l){const k=wkey(l);if(WALK[k])return Promise.resolve(WALK[k]);
  return fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/driving/${l.from[1]},${l.from[0]};${l.to[1]},${l.to[0]}?overview=full&geometries=geojson`).then(r=>r.json()).then(j=>{const g=j.routes&&j.routes[0]&&j.routes[0].geometry.coordinates;if(!g)throw 0;
    const sm=g.filter((c,i)=>i%2===0||i===g.length-1).map(c=>[+c[0].toFixed(5),+c[1].toFixed(5)]);WALK[k]=sm;try{const ks=Object.keys(WALK);if(ks.length>300)delete WALK[ks[0]];localStorage.setItem("mp_walk",JSON.stringify(WALK))}catch(e){}return sm})}
const circ=(ll,r)=>{const out=[];for(let i=0;i<=48;i++){const a=i/48*2*Math.PI;out.push([ll[1]+r/111320/Math.cos(ll[0]*Math.PI/180)*Math.cos(a),ll[0]+r/110540*Math.sin(a)])}return out};
let ML=[];
function hatchImg(){const c=document.createElement("canvas");c.width=c.height=12;const x=c.getContext("2d");x.fillStyle="rgba(179,38,30,.08)";x.fillRect(0,0,12,12);x.strokeStyle="rgba(179,38,30,.55)";x.lineWidth=2.5;x.beginPath();x.moveTo(-3,15);x.lineTo(15,-3);x.moveTo(-9,9);x.lineTo(9,-9);x.moveTo(3,21);x.lineTo(21,3);x.stroke();return x.getImageData(0,0,12,12)}
function mlMap(el,d,big){const p=planOf(d),base=p.base||baseLL(),legs=legsOf(d).filter(l=>!l.noloc),pts=[base,...p.seq.filter(a=>!a.noloc).map(a=>a.ll)];
  const m=new maplibregl.Map({container:el,style:mlStyle(),interactive:big,attributionControl:big?{compact:true,customAttribution:"© OpenFreeMap · © OpenStreetMap"}:false,bounds:[[Math.min(...pts.map(x=>x[1])),Math.min(...pts.map(x=>x[0]))],[Math.max(...pts.map(x=>x[1])),Math.max(...pts.map(x=>x[0]))]],fitBoundsOptions:{padding:big?{top:50,bottom:50,left:40,right:140}:24,maxZoom:16}});
  el._m=m;ML.push(m);if(big){m.addControl(new maplibregl.NavigationControl({showCompass:false}),"top-left");m.scrollZoom.disable()}
  const mk=(ll,html,lab)=>{const w=document.createElement("div");w.className="mlmk";w.innerHTML=html+(lab?`<span class="mllab">${esc(lab)}</span>`:"");new maplibregl.Marker({element:w,anchor:"left",offset:[big?-15:-11,0]}).setLngLat([ll[1],ll[0]]).addTo(m)};
  m.on("load",()=>{el.querySelectorAll(".maplibregl-compact-show").forEach(x=>x.classList.remove("maplibregl-compact-show"));
    const zs=zonesNearPA(pts);if(zs.length){m.addImage("hatch",hatchImg());m.addSource("hz",{type:"geojson",data:{type:"FeatureCollection",features:zs.map(z=>({type:"Feature",properties:{n:z.n},geometry:{type:"Polygon",coordinates:[circ(z.ll,z.r)]}}))}});
      m.addLayer({id:"hz",type:"fill",source:"hz",paint:{"fill-pattern":"hatch"}});m.addLayer({id:"hz-l",type:"line",source:"hz",paint:{"line-color":"#b3261e","line-width":1.4,"line-dasharray":[3,2]}})}
    const met=legs.filter(l=>l.metro).map(l=>({type:"Feature",properties:{k:l.k},geometry:{type:"LineString",coordinates:[[l.from[1],l.from[0]],[l.to[1],l.to[0]]]}}));
    m.addSource("met",{type:"geojson",data:{type:"FeatureCollection",features:met}});
    m.addLayer({id:"met",type:"line",source:"met",layout:{"line-cap":"round"},paint:{"line-color":"#24477a","line-width":big?4:3,"line-dasharray":[2.5,1.4],"line-opacity":["case",["==",["get","k"],0],.45,.9]}});
    const wl=legs.filter(l=>!l.metro);const straight=l=>[[l.from[1],l.from[0]],[l.to[1],l.to[0]]];
    m.addSource("walk",{type:"geojson",data:{type:"FeatureCollection",features:wl.map(l=>({type:"Feature",properties:{},geometry:{type:"LineString",coordinates:WALK[wkey(l)]||straight(l)}}))}});
    m.addLayer({id:"walk-h",type:"line",source:"walk",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#fffdf5","line-width":big?6:4.5,"line-opacity":.85}});
    m.addLayer({id:"walk",type:"line",source:"walk",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#2a2620","line-width":big?3:2.4,"line-dasharray":[0.2,2]}});
    if(wl.some(l=>!WALK[wkey(l)]))Promise.all(wl.map(l=>walkGeo(l).catch(()=>straight(l)))).then(gs=>{const s=m.getSource&&m.getSource("walk");if(s)s.setData({type:"FeatureCollection",features:gs.map(g=>({type:"Feature",properties:{},geometry:{type:"LineString",coordinates:g}}))})});
  });
  mk(base,'<div class="lm-h">H</div>',big?"Alojamiento":"");
  p.seq.forEach((a,k)=>!a.noloc&&mk(a.ll,`<div class="lm-a${a.top?" top":""}${big?" big":""}">${k+1}</div>`,big?(a.top?"★ ":"")+a.n.replace(/\s*\(.*?\)/,""):""));
  return m}


// Coordenadas de los puntos sugeridos de cada escapada (mismo orden que la ficha)
const _EP={};
function escPlan(d){if(!d||!d.c||!d.items||!d.items.length)return null;const k=d.id;if(_EP[k])return _EP[k];const X=EXT[d.c.id]||{},v=(X.f||{}).v||[],L=ESC_LL[d.c.id];if(!L||!X.ll)return null;
  const base=X.ll;let pos=base,t=d.kind==="go"||d.kind==="trip"?11:9.5;const seq=[];
  d.items.forEach(n=>{const i=v.indexOf(n);if(i<0||!L[i])return;t+=mv(pos,L[i]);const nm=n.split(/,|:| \(/)[0].trim();seq.push({id:d.c.id+"_"+i,n:nm,ll:L[i],h:1.25,st:t,p:0});t+=1.25;pos=L[i]});
  if(!seq.length)return null;return _EP[k]={base,seq,cap:6,end:t,esc:1}}
const planOf=d=>d.pa&&d.pa.seq&&d.pa.seq.length?d.pa:escPlan(d);
const legsOf=d=>{const p=planOf(d);return p?(d.pa===p&&d.cost.legs?d.cost.legs:legsOfDay(p)):[]};
function initMaps(A){ML=ML.filter(m=>{if(!document.body.contains(m.getContainer())){try{m.remove()}catch(e){}return false}return true});if(!window.L&&!window.maplibregl)return;document.querySelectorAll(".lmap[data-lday]").forEach(el=>{if(el._m||!el.offsetParent)return;const d=A.days.find(x=>x.id===el.dataset.lday);if(!d||!planOf(d))return;
  const big=!!el.dataset.big;if(window.maplibregl){try{el.classList.add("ml");mlMap(el,d,big);return}catch(e){el.classList.remove("ml");el._m=null}}if(!window.L)return;const m=L.map(el,{zoomControl:big,dragging:big,scrollWheelZoom:false,doubleClickZoom:big,touchZoom:big,boxZoom:big,keyboard:big,attributionControl:true});el._m=m;
  m.attributionControl.setPrefix(false);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(m);
  const base=planOf(d).base||baseLL(),pts=[base,...planOf(d).seq.filter(a=>!a.noloc).map(a=>a.ll)];
  const zs=zonesNearPA(pts),id="hz"+(++_hz);
  zs.forEach(z=>{const c=L.circle(z.ll,{radius:z.r,color:"#b3261e",weight:1.5,dashArray:"4 3",fillOpacity:1,interactive:big}).addTo(m);if(big)c.bindTooltip(z.n);c._hz=1});
  legsOf(d).filter(l=>!l.noloc).forEach(l=>L.polyline([l.from,l.to],{color:l.metro?"#2e4f8f":"#2a2420",weight:l.metro?3.5:2.5,dashArray:l.metro?null:"5 6",opacity:l.k?0.9:0.4}).addTo(m));
  L.marker(base,{icon:L.divIcon({className:"",html:'<div class="lm-h">H</div>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(m);
  planOf(d).seq.forEach((a,k)=>{if(a.noloc)return;const sz=big?30:22;const mk=L.marker(a.ll,{icon:L.divIcon({className:"",html:`<div class="lm-a${a.top?" top":""}${big?" big":""}">${k+1}</div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]})}).addTo(m);if(big)mk.bindTooltip((a.top?"★ ":"")+a.n.replace(/\s*\(.*?\)/,""),{permanent:true,direction:"right",offset:[14,0],className:"lm-lab"})});
  m.fitBounds(L.latLngBounds(pts).pad(big?0.15:0.25),{maxZoom:16});
  // achurado: patrón SVG en el panel de vectores
  setTimeout(()=>{const svg=el.querySelector(".leaflet-overlay-pane svg");if(!svg)return;const ns="http://www.w3.org/2000/svg";
    if(!svg.querySelector("#"+id)){const defs=document.createElementNS(ns,"defs");defs.innerHTML=`<pattern id="${id}" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)"><rect width="8" height="8" fill="rgba(179,38,30,.08)"/><line x1="0" y1="0" x2="0" y2="8" stroke="#b3261e" stroke-width="2.5" stroke-opacity=".55"/></pattern>`;svg.prepend(defs)}
    m.eachLayer(ly=>{if(ly._hz&&ly._path)ly._path.setAttribute("fill",`url(#${id})`)})},0)})}


// ---------- transporte: Navigo Semaine vs boletos sueltos (por semana lun–dom) ----------
const NAVIGO_W=32.40,NAVIGO_CARD=5,NAVIGO_JOUR=12.30,AIRPORT=14;
const monday=s=>{const d=D(s);const k=(d.getDay()+6)%7;d.setDate(d.getDate()-k);return iso(d)};
function metroPart(d){return d.cost.loc-d.cost.trn}
function navigoWeeks(days){const W={};days.filter(d=>d.city==="PA"||d.kind==="trip").forEach(d=>{const k=monday(d.d);(W[k]=W[k]||{mon:k,days:[],single:0,trips:0}).days.push(d);W[k].single+=metroPart(d);W[k].trips+=d.cost.nm+(d.kind==="first"?1:0)});
  let first=true;return Object.values(W).sort((a,b)=>a.mon<b.mon?-1:1).map(w=>{const nav=NAVIGO_W+(first?NAVIGO_CARD:0);const buyable=true;const best=w.single>nav;if(best)first=false;return {...w,nav,best}})}
let NAV=[];
function applyNavigo(days){if(ST.transMode==="sueltos"){NAV=navigoWeeks(days).map(w=>({...w,best:false}));return}NAV=navigoWeeks(days);
  NAV.forEach(w=>{if(!w.best)return;const share=w.nav/w.days.length;w.days.forEach(d=>{d.cost.navigo=share;d.cost.loc=share+d.cost.trn;d.cost.total=d.cost.meal+d.cost.act+d.cost.hot+d.cost.loc})})}
function pTra(A){const W=ST.wiz;const LD=A.days.filter(d=>d.city==="LO");const legs=[];
  A.days.forEach(d=>{if(d.cost.trn)legs.push({n:d.kind==="ret"?`${short(ESC.find(x=>x.id===d.from.id).n)} → París`:d.kind==="trip"?`París ⇄ ${short(d.c.n)}`:`París → ${short(d.c.n)}`,d:d.d,v:d.cost.trn})});
  const trenes=legs.reduce((t,l)=>t+l.v,0),ahorro=trenes*0.3;
  const lonDays=LD.length,lonWeeks={};LD.forEach(d=>{const k=monday(d.d);lonWeeks[k]=(lonWeeks[k]||0)+1});
  const mode=ST.transMode!=="sueltos";
  return `<div class="card buy"><span class="eyebrow">Recomendación para su programa</span><h3>París: ¿pase semanal o boletos sueltos?</h3>
   <p>Se cuentan los viajes en metro/RER de cada día del programa (más la llegada desde Gare du Nord y el traslado al aeropuerto) y se comparan por semana de lunes a domingo, que es como funciona el pase.</p>
   <div class="tbl-wrap"><table><thead><tr><th>Semana</th><th class="r">Días</th><th class="r">Viajes</th><th class="r">Sueltos</th><th class="r">Navigo</th><th>Conviene</th></tr></thead><tbody>
   ${NAV.map(w=>`<tr><td>${pretty(w.mon)}</td><td class="r num">${w.days.length}</td><td class="r num">${w.trips}</td><td class="r num">${fmt(w.single)}</td><td class="r num">${fmt(w.nav)}</td><td><b>${w.single>w.nav?"Navigo Semaine":"Boletos sueltos"}</b></td></tr>`).join("")}</tbody></table></div>
   <div class="seg" role="group" style="margin-top:8px"><button type="button" data-tmode="auto" aria-pressed="${mode}">Usar la recomendación en el programa</button><button type="button" data-tmode="sueltos" aria-pressed="${!mode}">Calcular todo con boletos sueltos</button></div>
   <p class="note">Navigo Semaine: 32,40 €, todas las zonas (incluye CDG por RER B, Orly por la línea 14, Versalles, Disneyland y Fontainebleau). Va en la tarjeta <b>Navigo Découverte</b> (5 €, con nombre y foto tipo carnet) o en el celular compatible. Vale de lunes a domingo: la semana en curso se compra solo hasta el jueves; llegando un viernes se compra la de la semana siguiente.</p></div>
  <div class="card buy"><span class="eyebrow">París · tarifas 2026</span><h3>Boletos y pases</h3><div class="tbl-wrap"><table><tbody>
   <tr><td>Boleto metro / RER / tren (zona Île-de-France)</td><td class="r num">2,55 €</td></tr><tr><td>Boleto bus / tranvía</td><td class="r num">2,05 €</td></tr>
   <tr><td>Boleto aeropuertos (CDG u Orly)</td><td class="r num">14 €</td></tr><tr><td>Navigo Jour (1 día, todas las zonas, sin aeropuertos)</td><td class="r num">12,30 €</td></tr>
   <tr><td>Navigo Semaine (lunes a domingo, todas las zonas)</td><td class="r num">32,40 € + tarjeta 5 €</td></tr>
   <tr><td>Paris Visite 1 / 2 / 3 / 5 días (zonas 1–5)</td><td class="r num">30,60 / 45,40 / 63,80 / 78 €</td></tr></tbody></table></div>
   <span class="eyebrow" style="margin-top:8px">Qué es cada uno · toca para ver</span>
   <details class="tdet"><summary>Boleto suelto metro / RER / tren · 2,55 €</summary><p>Un viaje en metro, RER o tren dentro de Île-de-France, con combinaciones dentro de la misma red durante el viaje. Se compra en la app <b>Bonjour RATP</b> (queda en el celular) o se carga en una tarjeta <b>Navigo Easy</b> (2 €, sin foto, recargable). Conviene en días con pocos traslados: la mayoría de los días del programa.</p><p><a href="https://www.bonjour-ratp.fr/titres-tarifs/" target="_blank" rel="noopener">Tarifas oficiales RATP ↗</a></p></details>
   <details class="tdet"><summary>Boleto bus / tranvía · 2,05 €</summary><p>Solo bus o tranvía, con combinaciones bus–tranvía durante 90 minutos. No sirve para el metro.</p></details>
   <details class="tdet"><summary>Boleto aeropuertos · 14 €</summary><p>Para ir o volver de Charles de Gaulle (RER B) u Orly (metro 14). El boleto normal de 2,55 € no sirve para esos tramos. Si tienen Navigo Semaine esa semana, el aeropuerto ya está incluido.</p><p><a href="https://www.bonjour-ratp.fr/titres-tarifs/ticket-paris-region-aeroports/" target="_blank" rel="noopener">Boleto aeropuertos ↗</a></p></details>
   <details class="tdet"><summary>Navigo Jour · 12,30 € por día</summary><p>Viajes ilimitados en metro, RER, tren, bus y tranvía de todas las zonas durante un día calendario (no 24 horas), excepto los servicios a los aeropuertos. Equivale a ~5 boletos sueltos, así que conviene solo un día con 5 o más viajes, por ejemplo ir a Versalles y después recorrer París. Se carga en la Navigo Easy o en la app.</p><p><a href="https://www.bonjour-ratp.fr/titres-tarifs/forfait-navigo-jour/" target="_blank" rel="noopener">Navigo Jour en RATP ↗</a></p></details>
   <details class="tdet"><summary>Navigo Semaine · 32,40 € (lunes a domingo)</summary><p>Viajes ilimitados toda la semana, de lunes 0:00 a domingo 23:59, en todas las zonas: incluye aeropuertos (RER B a CDG y metro 14 a Orly), Versalles, Fontainebleau y Disneyland. Va en la tarjeta <b>Navigo Découverte</b> (5 €, una sola vez, con nombre y foto tipo carnet que se pega en la tarjeta) o en un celular compatible. Ojo: siempre es de lunes a domingo, no 7 días desde la compra; la semana en curso se vende hasta el jueves. Conviene en semanas con más de ~13 viajes. La tabla de arriba lo calcula con su programa.</p><p><a href="https://parisienneries.fr/expos/navigo-decouverte-paris-visite-ou-ticket-journee-quel-pass-choisir-pour-3-a-7-jours-a-paris-2026/" target="_blank" rel="noopener">Guía Navigo Découverte 2026 ↗</a></p></details>
   <details class="tdet"><summary>Paris Visite · desde 30,60 € (1 día)</summary><p>Pase turístico de 1, 2, 3 o 5 días seguidos (zonas 1–5, con aeropuertos) que trae algunos descuentos en atracciones. Cuesta mucho más que el Navigo: 3 días valen 63,80 €, el doble del Navigo Semaine. Solo podría servir en una estadía muy corta que cae a mitad de semana. Para este viaje no conviene.</p></details></div>
  <div class="card buy"><span class="eyebrow">Londres · tarifas 2026</span><h3>Sin contacto con tope automático</h3>
   <p>En Londres no se compra pase: se paga cada viaje acercando la tarjeta o el celular, y el sistema cobra como máximo el tope diario y semanal. <b>Cada una con su propia tarjeta</b>, siempre la misma.</p>
   <div class="tbl-wrap"><table><tbody><tr><td>Metro zona 1 (hora punta / resto)</td><td class="r num">£3,10 / £3,00</td></tr><tr><td>Bus</td><td class="r num">£1,75 (£1,85 desde 1 nov)</td></tr>
   <tr><td>Tope diario metro + bus zonas 1–2</td><td class="r num">£8,90</td></tr><tr><td>Tope semanal zonas 1–2 (lunes a domingo)</td><td class="r num">£44,70</td></tr><tr><td>Tope diario solo bus</td><td class="r num">£5,25 (£5,55 desde 1 nov)</td></tr></tbody></table></div>
   <p>${lonDays?`Su estadía: <b>${lonDays} días</b>. El programa calcula el tope diario (~£9 ≈ ${fmt(LON_TR)}) por día; en semanas completas el tope semanal lo baja solo.`:"Completen la llegada a Londres en Configurar."}</p>
   <ul class="brief"><li>Desde Heathrow, la línea Piccadilly es la más barata y entra en el tope; el Heathrow Express no entra.</li><li>Viajar en bus cuando se pueda: más barato y se ve la ciudad.</li></ul></div>
  <div class="card buy"><span class="eyebrow">Trenes</span><h3>Eurostar y escapadas</h3>
   <ul class="brief"><li><b>Eurostar Londres → París</b>: comprar cuanto antes en eurostar.com; el precio sube cerca de la fecha. Control de pasaportes en St Pancras: llegar ~90 min antes.</li>
   <li><b>Trenes de escapadas</b> en SNCF Connect: <b>Ouigo</b> es el más barato (equipaje limitado, sin descuentos); <b>TGV INOUI</b> admite descuentos.</li>
   <li><b>Carte Avantage</b> (49 €/año): 30 % en TGV INOUI e Intercités. <b>Jeune</b> (12–27 años) cualquier día; <b>Adulte</b> (27–59) solo viajes en fin de semana o con una noche de sábado afuera. No aplica a Ouigo.</li></ul>
   ${legs.length?`<div class="tbl-wrap"><table><tbody>${legs.map(l=>`<tr><td>${pretty(l.d)} · ${l.n}</td><td class="r num">${fmt(l.v)}</td></tr>`).join("")}<tr><td><b>Total trenes estimado</b></td><td class="r num"><b>${fmt(trenes)}</b></td></tr></tbody></table></div>
   <p>Con Carte Avantage se ahorrarían ~<b>${fmt(ahorro)}</b> si todo fuera TGV INOUI: ${ahorro>49?"<b>conviene</b> (cuesta 49 €).":"<b>no conviene</b> (cuesta 49 €)."}</p>`:"<p class=\"muted\">Elijan escapadas para calcular los trenes.</p>"}</div>
  <p class="note">Fuentes: <a href="https://parisienneries.fr/expos/navigo-decouverte-paris-visite-ou-ticket-journee-quel-pass-choisir-pour-3-a-7-jours-a-paris-2026/" target="_blank" rel="noopener">Parisienneries (tarifas Île-de-France 2026)</a> · <a href="https://www.londontravelgeek.co.uk/articles/london-public-transport-costs-and-fares/" target="_blank" rel="noopener">London Travel Geek (TfL oct. 2026)</a> · <a href="https://www.voyagerentrain.fr/guide-carte-avantage-sncf/" target="_blank" rel="noopener">Voyager en train (Carte Avantage)</a>. Verificar en RATP, TfL y SNCF antes de comprar.</p>`}
// ---------- 9 · Gastos ----------
function pGas(A){const C={};A.days.forEach(d=>{const k=d.city==="LO"?"Londres":d.city==="PA"||d.kind==="trip"&&false?"París":d.city==="PA"?"París":short(d.c.n);const c=C[k]=C[k]||{n:k,days:0,hot:0,meal:0,act:0,loc:0,total:0};c.days++;["hot","meal","act","loc","total"].forEach(x=>c[x]+=d.cost[x])});
  const rows=Object.values(C);
  return `<div class="card"><span class="eyebrow">Por ciudad · por persona</span><div class="tbl-wrap"><table><thead><tr><th>Ciudad</th><th class="r">Días</th><th class="r">Alojamiento</th><th class="r">Comidas</th><th class="r">Entradas</th><th class="r">Transporte</th><th class="r">Total</th></tr></thead><tbody>
   ${rows.map(r=>`<tr><td>${r.n}</td><td class="r num">${r.days}</td><td class="r num">${fmt(r.hot)}</td><td class="r num">${fmt(r.meal)}</td><td class="r num">${fmt(r.act)}</td><td class="r num">${fmt(r.loc)}</td><td class="r num"><b>${fmt(r.total)}</b></td></tr>`).join("")}</tbody></table></div>
   <p class="note">Este es el presupuesto que estima el programa. El gasto real de cada una se registra en <a href="/gastos">💶 Mis gastos</a>, que compara contra estos montos.</p></div>`}

// ---------- plano ampliado ----------
function mapOverlay(A){if(!mapOpen)return"";const d=A.days.find(x=>x.id===mapOpen);const P=d&&planOf(d);if(!P)return"";const legs=legsOf(d);const isE=!!P.esc;
  const box=(l)=>l.metro?`<br><span class="lg-tr subway">${isE?"🚆 Tren o transporte público":"Ⓜ Metro / RER"} · ~${l.min} min (${l.d.toFixed(1).replace(".",",")} km) · <a href="${trUrl(l.from,l.to,1)}" target="_blank" rel="noopener">ver línea y estaciones</a></span>`:"";
  const back=legs[legs.length-1];
  return `<div class="mapov on" data-mclose="1"><div class="mapsheet" role="dialog" aria-label="Recorrido del día"><span class="clip big" aria-hidden="true"></span>
   <div class="ms-head"><span class="eyebrow">${pretty(d.d)} · ${d.city==="LO"?"Londres":d.city==="PA"?"París":esc(short(d.c.n))}</span><h3>Recorrido del día</h3><button type="button" class="ms-x lnkb" data-mclose="1" aria-label="Cerrar" style="text-decoration:none">✕</button></div>
   ${(window.L||window.maplibregl)?`<div class="lmap big" data-lday="${d.id}" data-big="1"></div>`:dayMap(P,legs).split("</svg>")[0]+"</svg>"}
   <div class="ms-leg"><span><i class="k"></i>a pie</span><span><i class="k tr" style="border-top-color:#24477a"></i>metro / RER</span><span><i class="k h">H</i>alojamiento</span><span><i class="hz"></i>zona de precaución</span></div>
   <ol class="ms-list"><li><span class="anum h num">H</span> ${isE?(d.kind==="trip"?"Llegada a "+esc(short(d.c.n))+" (tren desde París)":"Alojamiento en "+esc(short(d.c.n))):d.city==="LO"?esc("Donde Alli"+((ST.wiz||{}).lon_dir?" · "+ST.wiz[K.lonDir]:"")):esc(hotSelName("par")||(ST.wiz||{}).par_dir||PAR_DEF)}</li>
   ${P.seq.map((a,k)=>`<li><span class="anum num">${k+1}</span> <span class="num">${hm(a.st)}</span> ${typeof PA_F!=="undefined"&&PA_F[a.id]?`<a href="#" data-ficha="${a.id}">${a.top?"★ ":""}${a.n}</a>`:`${a.top?"★ ":""}${a.n}`}${box(legs[k])}</li>`).join("")}
   <li><span class="anum h num">H</span> ${isE&&d.kind==="trip"?"Tren de vuelta a París":"Vuelta al alojamiento"}${back.metro?box(back):` · a pie ~${back.min} min`}</li></ol>
   <p class="ms-src">Plano: © OpenFreeMap · © colaboradores de OpenStreetMap · caminatas calculadas con OSRM. Tiempos de traslado estimados por distancia: confirmar la ruta exacta en la app Bonjour RATP o con «ver línea y estaciones». Clic fuera del plano para cerrar.</p></div></div>`}

// ---------- render ----------
let _budLast="";
function pushBudget(A){if(DEMO||!F||!ref||!A.days.length)return;const days=A.days.map(d=>({d:d.d,city:d.city==="LO"?"Londres":d.city==="PA"?"París":short(d.c.n),meal:+d.cost.meal.toFixed(2),act:+d.cost.act.toFixed(2),loc:+d.cost.loc.toFixed(2),hot:+d.cost.hot.toFixed(2)}));
  const j=JSON.stringify(days);if(j===_budLast)return;_budLast=j;clearTimeout(pushBudget.t);pushBudget.t=setTimeout(()=>{F.setDoc(F.doc(ref,"meta","presupuesto"),{days,at:Date.now(),by:user.email}).catch(()=>{})},1500)}
// ===== Manual de uso: ayuda en cada sección =====
let guideAll=false;
function guideHTML(tab){const g=GUIDE[tab];if(!g)return"";let seen=true;try{seen=!!localStorage.getItem(TRIP.ls+"_guide_"+tab);localStorage.setItem(TRIP.ls+"_guide_"+tab,"1")}catch(e){}
  return `<details class="guide" data-k="guide-${tab}" ${seen?"":"open"}><summary><span class="gq">?</span> Cómo usar esta sección <span class="muted">· ${g.t}</span></summary>
   <p class="gi">${g.i}</p><ol class="gsteps">${g.s.map(([h,t])=>`<li><b>${h}.</b> ${t}</li>`).join("")}</ol>${g.tip?`<p class="gtip">💡 ${g.tip}</p>`:""}
   <button type="button" class="lnkb" data-guideall>📖 Ver el manual completo</button></details>`}
function guideAllHTML(){if(!guideAll)return"";return `<div class="calov gov"><div class="calsheet" role="dialog" aria-modal="true" aria-label="Manual de uso">
  <div class="ms-head"><div><span class="eyebrow">Marco Polo · Viaje a Londres y París</span><h3>Manual de uso</h3></div><button type="button" class="ms-x" data-guideclose aria-label="Cerrar manual">✕</button></div>
  <ol class="gindex">${TABS.map(([k,t])=>GUIDE[k]?`<li><a href="#g-${k}">${t}</a></li>`:"").join("")}</ol>
  ${TABS.map(([k,t])=>{const g=GUIDE[k];if(!g)return"";return `<section class="gsec" id="g-${k}"><h4>${t} · ${g.t}</h4><p class="gi">${g.i}</p><ol class="gsteps">${g.s.map(([h,x])=>`<li><b>${h}.</b> ${x}</li>`).join("")}</ol>${g.tip?`<p class="gtip">💡 ${g.tip}</p>`:""}<button type="button" class="btn sm" data-guidego="${k}">Ir a ${t.replace(/^\d+ · /,"")} →</button></section>`}).join("")}
 </div></div>`}
function bindGuide(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-guideall]",b=>b.onclick=()=>{guideAll=true;render()});
  Q("[data-guideclose]",b=>b.onclick=()=>{guideAll=false;render()});
  const o=document.querySelector(".gov");if(o){o.onclick=e=>{if(e.target===o){guideAll=false;render()}};document.body.style.overflow="hidden"}
  Q("[data-guidego]",b=>b.onclick=()=>{guideAll=false;document.body.style.overflow="";go(b.dataset.guidego)});
  Q(".gindex a",a=>a.onclick=e=>{e.preventDefault();const t=document.querySelector(a.getAttribute("href"));if(t)t.scrollIntoView({behavior:"smooth"})})}

// ===== Buscar y agregar (atracciones, escapadas, espectáculos, comidas) =====
const PA0=PA.slice(),LON0=LON.slice(),ESC0=ESC.slice(),SHOWS0=SHOWS.slice(),LUNCH0=LUNCH_V.slice();
function applyCustom(){const c=ST.custom||{};
  const acts=[...(c.att||[]),...(c.show||[]).filter(x=>x.ll)];
  PA.length=0;PA.push(...PA0,...acts.filter(a=>a.city!=="LO"));
  LON.length=0;LON.push(...LON0,...acts.filter(a=>a.city==="LO"));
  ESC.length=0;ESC.push(...ESC0,...(c.esc||[]).map(x=>{EXT[x.id]={ll:x.ll,cost:x.cost||"por definir",how:x.how||"Revisar en SNCF Connect o Trainline.",f:{h:x.s||"",v:x.vv||[]}};return {id:x.id,n:x.n,p:x.p||"📍",k:x.k,tr:x.tr||"por definir",nt:x.nt||"1",c:"#6b5d43",t:x.s||"",tags:[],cu:1}}));
  SHOWS.length=0;SHOWS.push(...SHOWS0,...(c.show||[]).map(x=>({n:x.n,w:x.city==="LO"?"Londres":"París",e:x.e||"⭐",ini:x.from||"2026-01-01",fin:x.to||"2027-12-31",al:!x.from,t:x.s||"",d:x.d||"",u:x.u||"",act:x.ll?x.id:null,cu:1})));
  LUNCH_V.length=0;LUNCH_V.push(...LUNCH0,...(c.food||[]).filter(x=>(x.city||"PA")==="PA").map(x=>[x.n,(x.ft||"Restaurante")+" · "+(x.addr||""),x.s||"",x.pr||"",x.src||"Agregado por ustedes",x.u||"",x.n+" "+(x.addr||"Paris")]))}
let FIND=null;// {kind,city,q,res,busy,err,pick}
const FK={att:"atracción o destino personal",esc:"escapada",show:"espectáculo o evento",food:"lugar para comer"};
function findBtn(kind,city){return `<button type="button" class="btn sm findbtn" data-find="${kind}|${city||""}">🔎 Buscar y agregar ${FK[kind]}</button>`}
const VB={PA:"2.22,48.92,2.47,48.80",LO:"-0.35,51.62,0.10,51.40"};
async function wikiFor(title,lang){try{const u=`https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&titles=${encodeURIComponent(title)}&prop=extracts|pageimages|info&exintro=1&explaintext=1&exsentences=4&piprop=thumbnail&pithumbsize=400&inprop=url`;const j=await (await fetch(u)).json();const p=Object.values(j.query.pages)[0];if(!p||p.missing!=null)return null;return {t:p.title,x:p.extract||"",img:p.thumbnail&&p.thumbnail.source,url:p.fullurl,lang}}catch(e){return null}}
const nrm=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const GEN=new Set("museo musee museum tienda shop store boutique cafe restaurant restaurante bar pub place plaza street rue avenue church iglesia eglise park parque jardin garden gallery galeria galerie london paris londres the les des del de la le los las saint sainte market mercado marche hotel house casa".split(" "));
const keyW=n=>nrm(n).split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!GEN.has(w));
const relevant=(name,title)=>{const k=keyW(name);if(!k.length)return nrm(title).includes(nrm(name));const t=nrm(title);return k.some(w=>t.includes(w))};
async function wikiCands(name,ctx){const out=[];for(const lang of ["es","en"]){try{const j=await (await fetch(`https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srlimit=5&srsearch=${encodeURIComponent(name+" "+(ctx||""))}`)).json();j.query.search.forEach(h=>{if(relevant(name,h.title)&&!out.some(o=>nrm(o.t)===nrm(h.title)))out.push({t:h.title,lang})})}catch(e){}}return out.slice(0,5)}
async function wikiSearch(q){for(const lang of ["es","en"]){try{const j=await (await fetch(`https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srlimit=1&srsearch=${encodeURIComponent(q)}`)).json();const h=j.query.search[0];if(h){const w=await wikiFor(h.title,lang);if(w)return w}}catch(e){}}return null}
async function runFind(){const F=FIND;if(!F||!F.q.trim())return;F.busy=true;F.err="";F.res=null;F.pick=null;render();
  try{const vb=F.kind!=="esc"&&VB[F.city]?`&viewbox=${VB[F.city]}&bounded=1`:"";
    const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&extratags=1&namedetails=1&accept-language=es&q=${encodeURIComponent(F.q)}${vb}`);
    const j=await r.json();F.res=j.map(o=>({n:(o.namedetails&&(o.namedetails["name:es"]||o.namedetails.name))||o.name||o.display_name.split(",")[0],addr:o.display_name.split(",").slice(1,4).join(",").trim(),ll:[+(+o.lat).toFixed(5),+(+o.lon).toFixed(5)],cat:o.category,typ:o.type,et:o.extratags||{},cc:(o.address||{}).country_code||"",city:(o.address||{}).city||(o.address||{}).town||(o.address||{}).village||""}));
    if(!F.res.length)F.err="No encontré coincidencias. Prueben con otro nombre, en inglés o francés, o agreguen la ciudad.";}
  catch(e){F.err="No se pudo buscar ahora (sin conexión o servicio ocupado). Intenten de nuevo."}
  F.busy=false;render()}
const guessT=r=>r.cat==="shop"||r.cat==="building"||r.cat==="place"||/house|residential|apartments|shop|office/.test(r.typ)?"otr":/museum|gallery/.test(r.typ)?"mus":r.typ==="place_of_worship"||/church|cathedral/.test(r.typ)?"igl":/monument|memorial|castle|viewpoint|tower|palace|attraction/.test(r.typ)||r.cat==="historic"?"mon":/park|garden|market|square/.test(r.typ)||r.cat==="leisure"?"pas":/theatre|cinema|arts_centre|nightclub|stadium|zoo|theme_park|aquarium/.test(r.typ)?"ent":"pas";
async function pickFind(i){const F=FIND,r=F.res[i];F.pick={...r,load:true};render();
  let w=null,alts=[];const wt=r.et.wikipedia;if(wt&&wt.includes(":")){const [l,t]=wt.split(/:(.+)/);if(l==="es"||l==="en")w=await wikiFor(t,l)}
  if(!w&&guessT(r)!=="otr"){alts=await wikiCands(r.n,r.city);if(alts[0])w=await wikiFor(alts[0].t,alts[0].lang)}
  if(w&&!relevant(r.n,w.t)&&!(wt&&nrm(wt).includes(nrm(w.t))))w=null;
  const flag=r.cc?String.fromCodePoint(...[...r.cc.toUpperCase()].map(c=>127397+c.charCodeAt(0))):"📍";
  F.pick={...r,load:false,w,alts,flag,t:guessT(r),s:w?w.x.split(/(?<=\.)\s/).slice(0,3).join(" "):(FIND.q||r.n),u:r.et.website||(w&&w.url)||"",oh:r.et.opening_hours||"",in:/museum|gallery|church|cathedral|place_of_worship|theatre|cinema/.test(r.typ)?1:0};render()}
function findSheet(){const F=FIND;if(!F)return"";const city=F.city||"PA";const P=F.pick;
  const cityPick=F.kind!=="esc"?`<div class="seg" role="group" aria-label="Ciudad"><button type="button" data-fcity="PA" aria-pressed="${city==="PA"}">París</button><button type="button" data-fcity="LO" aria-pressed="${city==="LO"}">Londres</button></div>`:"";
  let body="";
  if(F.busy)body=`<p class="muted">Buscando…</p>`;
  else if(F.err)body=`<p class="status bad">${F.err}</p>`;
  if(P&&P.load)body=`<p class="muted">Obteniendo datos de ${esc(P.n)}…</p>`;
  else if(P){const w=P.w;body=`<div class="fpick">${w&&w.img?`<img src="${w.img}" alt="${esc(P.n)}" class="fimg">`:""}<div style="min-width:0"><b class="fpn">${P.flag||""} ${esc(P.n)}</b><small class="muted">${esc(P.addr)}</small>${w?`<small class="muted">Descripción: Wikipedia (${w.lang}) · <a href="${w.url}" target="_blank" rel="noopener">${esc(w.t)}</a></small>`:`<small class="muted">Sin descripción de Wikipedia: escriban la suya.</small>`}
   ${(P.alts||[]).length||w?`<label class="f fwk">¿Es esta la descripción correcta?<select data-fwk><option value="">Ninguna · usar solo mi texto</option>${(P.alts||[]).concat(w&&!(P.alts||[]).some(a=>a.t===w.t)?[{t:w.t,lang:w.lang}]:[]).map((a,i)=>`<option value="${a.lang}|${esc(a.t)}" ${w&&a.t===w.t?"selected":""}>${esc(a.t)} (Wikipedia ${a.lang})</option>`).join("")}</select></label>`:""}${P.oh?`<small class="muted">Horario (OpenStreetMap): ${esc(P.oh)}</small>`:""}</div></div>
    <form class="fform" data-fform>
     <label class="f">Nombre<input name="n" value="${esc(P.n)}" required></label>
     <label class="f wide">Descripción (pueden editarla)<textarea name="s" rows="4">${esc(P.s)}</textarea></label>
     ${F.kind==="att"?`<label class="f">Tipo<select name="t">${TYP.filter(t=>!["com","via","esp","per"].includes(t[0])).map(([k,t])=>`<option value="${k}" ${P.t===k?"selected":""}>${t}</option>`).join("")}</select></label><label class="f">Visita (horas)<input name="h" type="number" step="0.25" min="0.25" value="1.5"></label><label class="f">Precio por persona (€)<input name="p" type="number" step="0.5" min="0" value="0"></label><label class="f">Cierra a las<input name="close" type="time" value="18:00"></label><label class="chk f"><input type="checkbox" name="in" ${P.in?"checked":""}><span class="t">🏛 Techado</span></label>`:""}
     ${F.kind==="show"?`<label class="f">Desde<input name="from" type="date"></label><label class="f">Hasta<input name="to" type="date"></label><label class="f">Duración (horas)<input name="h" type="number" step="0.25" min="0.25" value="2"></label><label class="f">Precio por persona (€)<input name="p" type="number" step="0.5" min="0" value="0"></label><label class="chk f"><input type="checkbox" name="eve" checked><span class="t">🌙 Es de noche</span></label>`:""}
     ${F.kind==="food"?`<label class="f">Tipo<select name="ft"><option>Restaurante</option><option>Bistró</option><option>Café</option><option>Panadería / boulangerie</option><option>Comida rápida</option><option>Pub</option><option>Mercado</option></select></label><label class="f">Precio aprox. por persona<input name="pr" placeholder="Ej.: 15–20 €"></label>`:""}
     ${F.kind==="esc"?`<label class="f">Tipo<select name="k"><option value="dia">De un día</option><option value="noche" selected>Con noche</option><option value="ambos">Día o 1 noche</option></select></label><label class="f">Noches sugeridas<input name="nt" value="1"></label><label class="f">Tiempo en tren desde París<input name="tr" placeholder="Ej.: 2 h (TGV)"></label><label class="f">Costo aprox. del tren (ida)<input name="cost" placeholder="Ej.: 30–80 € ida"></label><label class="f wide">Qué ver (separado por comas)<input name="vv" placeholder="Ej.: catedral, casco antiguo, mercado"></label>`:""}
     <label class="f wide">Sitio web<input name="u" type="url" value="${esc(P.u)}"></label>
     ${F.kind==="att"||F.kind==="show"?`<label class="chk f wide"><input type="checkbox" name="add" checked><span class="t">Agregar también al programa (día automático)</span></label>`:""}
     <div class="act wide"><button type="submit" class="btn sm">＋ Agregar a ${F.kind==="att"?"atracciones":F.kind==="esc"?"escapadas":F.kind==="show"?"espectáculos":"comidas"}</button><button type="button" class="btn alt sm" data-funpick>← Otros resultados</button></div></form>`}
  else if(F.res&&F.res.length)body=`<ul class="fres">${F.res.map((r,i)=>`<li><button type="button" data-fpick="${i}"><b>${esc(r.n)}</b><small>${esc(r.typ.replace(/_/g," "))} · ${esc(r.addr)}</small></button></li>`).join("")}</ul><p class="muted" style="font-size:13px">Elijan el resultado correcto: la app completa la descripción, el sitio web y la ubicación en el mapa.</p>`;
  return `<div class="calov fov2"><div class="calsheet" role="dialog" aria-modal="true" aria-label="Buscar y agregar">
   <div class="ms-head"><div><span class="eyebrow">Buscar y agregar</span><h3>${F.kind==="att"?"Nueva atracción o destino personal":F.kind==="esc"?"Nueva escapada":F.kind==="show"?"Nuevo espectáculo o evento":"Nuevo lugar para comer"}</h3></div><button type="button" class="ms-x" data-fclose aria-label="Cerrar">✕</button></div>
   <form class="fsearch" data-fsearch>${cityPick}<input name="q" value="${esc(F.q||"")}" placeholder="${F.kind==="esc"?"Ej.: Brujas, Honfleur, Bayeux":F.kind==="food"?"Ej.: Café de Flore, Dishoom":F.kind==="show"?"Ej.: Lido, Royal Albert Hall":"Ej.: Musée Grévin, una tienda o una dirección"}" aria-label="Qué buscar" autocomplete="off"><button type="submit" class="btn sm">Buscar</button></form>
   ${F.kind==="att"&&!F.res&&!F.pick?`<p class="muted" style="font-size:14px">También sirve para destinos personales: la casa de una amiga, una tienda específica o cualquier lugar. Escriban el nombre o la <b>dirección</b> (ej.: «12 rue de Rivoli» o «Camden High Street 200») y elijan el tipo <b>«Personales y otros»</b>.</p>`:""}${body}<p class="ms-src">Búsqueda: OpenStreetMap (Nominatim) y Wikipedia. Precios y horarios no vienen en la búsqueda: complétenlos si los saben.</p></div></div>`}
function saveFind(fd){const F=FIND,P=F.pick,c=ST.custom=ST.custom||{att:[],esc:[],show:[],food:[]};const g=k=>(fd.get(k)||"").toString().trim();const city=F.city||"PA";const id=(city==="LO"&&F.kind!=="esc"?"lo_cu":"cu")+Date.now().toString(36);
  const base={id,n:g("n")||P.n,ll:P.ll,s:g("s"),v:g("s").split(/(?<=\.)\s/)[0]||"",d:P.oh?"Horario según OpenStreetMap: "+P.oh+" (verificar).":"Agregado por ustedes: verificar horario y precio.",u:g("u"),wk:P.w?P.w.t:"",wkl:P.w?P.w.lang:"",img:P.w&&P.w.img||"",z:P.city||"Agregado",city,addr:P.addr,by:(user&&user.email)||""};
  let msg="";
  if(F.kind==="att"){const cl=g("close");const a={...base,t:g("t")||"pas",h:+g("h")||1.5,p:+g("p")||0,in:fd.get("in")?1:0,close:cl?(+cl.split(":")[0]+(+cl.split(":")[1])/60):18};(c.att=c.att||[]).push(a);if(fd.get("add")){ST.paSel=ST.paSel||{};ST.paSel[id]=true}msg=`✔ <b>${esc(a.n)}</b> agregada a Atracciones${fd.get("add")?" y al programa":""}`}
  if(F.kind==="show"){const a={...base,t:"esp",h:+g("h")||2,p:+g("p")||0,in:1,eve:fd.get("eve")?1:0,from:g("from")||"",to:g("to")||""};(c.show=c.show||[]).push(a);if(fd.get("add")){ST.paSel=ST.paSel||{};ST.paSel[id]=true}msg=`✔ <b>${esc(a.n)}</b> agregado a Espectáculos${fd.get("add")?" y al programa":""}`}
  if(F.kind==="food"){(c.food=c.food||[]).push({...base,ft:g("ft"),pr:g("pr")});msg=`✔ <b>${esc(base.n)}</b> agregado a Comidas${city==="PA"?" (también disponible para «Almorzar aquí» en cada día)":""}`}
  if(F.kind==="esc"){const vv=g("vv").split(",").map(x=>x.trim()).filter(Boolean);(c.esc=c.esc||[]).push({...base,id:"cu"+Date.now().toString(36),k:g("k")||"noche",nt:g("nt")||"1",tr:g("tr"),cost:g("cost"),vv,p:P.flag||"📍"});msg=`✔ <b>${esc(base.n)}</b> agregada a Escapadas: ya pueden elegir fechas`}
  FIND=null;save();render();toast(msg)}
function customList(kind,city){const c=(ST.custom||{})[kind]||[];const L=c.filter(x=>kind==="esc"||(x.city||"PA")===city);if(!L.length)return"";
  return `<div class="card cust"><span class="eyebrow">Agregados por ustedes</span><ul class="brief">${L.map(x=>`<li><b>${esc(x.n)}</b>${x.ft?` · ${esc(x.ft)}`:""}${x.pr?` · ${esc(x.pr)}`:""}${x.addr?` <small class="muted">· ${esc(x.addr)}</small>`:""} ${x.s?`<br><small>${esc(x.s)}</small>`:""} · <a href="https://www.google.com/maps/search/?api=1&query=${x.ll.join(",")}" target="_blank" rel="noopener">mapa</a>${x.u?` · <a href="${esc(x.u)}" target="_blank" rel="noopener">sitio</a>`:""} · <button type="button" class="lnkb" data-fdel="${kind}|${x.id}">quitar</button></li>`).join("")}</ul></div>`}
function bindFind(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-find]",b=>b.onclick=()=>{const [k,c]=b.dataset.find.split("|");FIND={kind:k,city:c||"PA",q:""};render();setTimeout(()=>{const i=document.querySelector("[data-fsearch] input");if(i)i.focus()},50)});
  Q("[data-fclose]",b=>b.onclick=()=>{FIND=null;render()});
  const o=document.querySelector(".fov2");if(o){o.onclick=e=>{if(e.target===o){FIND=null;render()}};document.body.style.overflow="hidden"}
  Q("[data-fcity]",b=>b.onclick=()=>{FIND.city=b.dataset.fcity;FIND.res=null;FIND.pick=null;render()});
  Q("[data-fsearch]",f=>f.onsubmit=e=>{e.preventDefault();FIND.q=f.q.value;runFind()});
  Q("[data-fpick]",b=>b.onclick=()=>pickFind(+b.dataset.fpick));
  Q("[data-funpick]",b=>b.onclick=()=>{FIND.pick=null;render()});
  Q("[data-fwk]",x=>x.onchange=async()=>{const P=FIND.pick;if(!x.value){P.w=null;P.s=FIND.q||P.n;P.u=P.et.website||"";render();return}const [l,t]=x.value.split(/\|(.+)/);const w=await wikiFor(t,l);if(w){P.w=w;P.s=w.x.split(/(?<=\.)\s/).slice(0,3).join(" ");if(!P.et.website)P.u=w.url}render()});
  Q("[data-fform]",f=>f.onsubmit=e=>{e.preventDefault();saveFind(new FormData(f))});
  Q("[data-fdel]",b=>b.onclick=()=>{if(!b.dataset.sure){b.dataset.sure=1;b.textContent="¿seguro? toca otra vez";return}const [k,id]=b.dataset.fdel.split("|");const c=ST.custom||{};c[k]=(c[k]||[]).filter(x=>x.id!==id);if(ST.paSel)delete ST.paSel[id];ST.esc=ST.esc.filter(e=>e.id!==id);save();render();toast("Quitado de la lista")})}

// ===== Almuerzo: franja y sugerencias cerca =====
const CHAINS=/mcdonald|burger king|kfc|pret|starbucks|costa|caff[eè] nero|paul\b|brioche dor|columbus|exki|wagamama|franco manca|leon\b|gail|five guys|itsu|wasabi|greggs|subway|flunch|big fernand|bagelstein|pomme de pain|cojean|eat\b|nando/i;
const favKey=n=>nrm(n).replace(/[^a-z0-9]+/g,"");
const favOf=(n,city)=>(ST.favs||[]).find(f=>f.k===favKey(n)&&f.city===city);
const LL_CACHE={};try{Object.assign(LL_CACHE,JSON.parse(localStorage.getItem("mp_near")||"{}"))}catch(e){}
let NQ=Promise.resolve(),NQ_PEND={};
function nomi(url){if(LL_CACHE[url])return Promise.resolve(LL_CACHE[url]);if(NQ_PEND[url])return NQ_PEND[url];
  const pr=NQ=NQ.then(()=>new Promise(r=>setTimeout(r,1100))).then(()=>fetch(url).then(r=>r.json()).catch(()=>[])).then(j=>{LL_CACHE[url]=j;try{const ks=Object.keys(LL_CACHE);if(ks.length>200)delete LL_CACHE[ks[0]];localStorage.setItem("mp_near",JSON.stringify(LL_CACHE))}catch(e){}delete NQ_PEND[url];return j});
  NQ_PEND[url]=pr;return pr}
const nearUrl=(q,ll,r)=>`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=12&extratags=1&accept-language=es&q=${encodeURIComponent(q)}&viewbox=${(ll[1]-r).toFixed(4)},${(ll[0]+r*0.66).toFixed(4)},${(ll[1]+r).toFixed(4)},${(ll[0]-r*0.66).toFixed(4)}&bounded=1`;
const estPr=(typ,city)=>{const lo=city==="LO";return typ==="fast_food"?(lo?"£7–12":"8–12 €"):typ==="cafe"||typ==="bakery"?(lo?"£6–12":"6–12 €"):typ==="pub"?(lo?"£15–20":"15–20 €"):(lo?"£15–25":"18–28 €")};
let _nearT=null;
function lunchSugg(d,p){const city=d.city,pos=p.seq.lunchPos||p.base;if(!pos||(city!=="PA"&&city!=="LO"))return"";const items=[];
  // favoritos cerca (o la sucursal más cercana si es cadena)
  (ST.favs||[]).filter(f=>f.city===city).forEach(f=>{if(f.chain){const u=nearUrl(f.n,pos,0.012);const R=LL_CACHE[u];if(!R){items.push({pend:u});return}const b=R.map(o=>({ll:[+o.lat,+o.lon]})).sort((x,y)=>km(pos,x.ll)-km(pos,y.ll))[0];if(b&&km(pos,b.ll)<1.6)items.push({n:f.n,ll:b.ll,pr:f.pr||"",src:"fav",note:"cadena · local más cercano"})}else if(f.ll&&km(pos,f.ll)<1.6)items.push({n:f.n,ll:f.ll,pr:f.pr||"",src:"fav"})});
  // uno de la app
  const i=(BF_IX[d.id]||0);
  if(city==="PA"){const L=LUNCH_V.filter(r=>!/mcdonald|burger king/i.test(r[0]));const r=L[i%L.length];if(r)items.push({n:r[0],pr:r[3],src:/aprox|ustedes/i.test(r[4])?"est":"ver",note:"de la guía · "+(r[1].split("·").slice(1).join("·").trim()||r[1])})}
  else{const L=FOOD_G.LO.c.flatMap(c=>c[1]).filter(r=>!/meal deal|chinatown|greggs|mcdonald|burger|kfc/i.test(r[0]));const r=L[i%L.length];if(r)items.push({n:r[0],pr:r[2],src:"est",note:"de la guía · "+r[1]})}
  // dos del mapa
  const u=nearUrl("restaurant",pos,0.006);const R=LL_CACHE[u];
  if(!R)items.push({pend:u});else R.filter(o=>o.name&&!/universitaire|crous|cantine|staff|canteen|school|école|ecole/i.test(o.name)&&!items.some(x=>x.n&&favKey(x.n)===favKey(o.name))).map(o=>({n:o.name,ll:[+o.lat,+o.lon],typ:o.type,cu:(o.extratags||{}).cuisine||""})).sort((x,y)=>km(pos,x.ll)-km(pos,y.ll)).slice(0,2).forEach(o=>items.push({n:o.n,ll:o.ll,pr:estPr(o.typ,city),src:"map",note:(o.typ==="fast_food"?"comida rápida":o.typ==="cafe"?"café":"restaurante")+(o.cu?" · "+o.cu.replace(/;/g,", ").replace(/_/g," "):"")}));
  const pend=items.filter(x=>x.pend).map(x=>x.pend);if(pend.length){pend.forEach(u=>nomi(u).then(()=>{clearTimeout(_nearT);_nearT=setTimeout(()=>{if(tab==="prog")render()},400)}))}
  const chosen=(ST.lunchAt||{})[d.id];
  const row=x=>{const f=favOf(x.n,city);const dist=x.ll?Math.max(1,Math.round(km(pos,x.ll)*13)):null;
    return `<li class="ls ${x.src}"><span class="lsdot" aria-hidden="true"></span><span class="lsn"><b>${esc(x.n)}</b>${x.note?` <small>${esc(x.note)}</small>`:""}<small class="num">${x.pr?esc(x.pr):""}${dist?` · ~${dist} min a pie`:""}${x.src==="ver"?" · precio verificado":x.src==="fav"?" · favorito":x.src==="map"?" · precio estimado":" · precio aprox."}</small></span>
     <span class="lsact">${x.ll?`<a href="${mlinkQ(x.ll.join(","))}" target="_blank" rel="noopener" aria-label="Mapa de ${esc(x.n)}">mapa</a>`:""}<button type="button" class="favb${f?" on":""}" data-fav="${city}|${esc(x.n)}|${x.ll?x.ll.join(","):""}|${esc(x.pr||"")}" aria-pressed="${!!f}" title="${f?"Quitar de favoritos":"Marcar como favorito"}">${f?"★":"☆"}</button><button type="button" class="btn sm" data-lpick="${d.id}|${esc(x.n)}">${chosen===x.n?"✓ elegido":"Elegir"}</button></span></li>`};
  const shown=items.filter(x=>!x.pend);
  return `<div class="lsugg"><span class="lsh">Sugerencias cerca${p.seq.lunchPos?"":" del alojamiento"}:</span><ul>${shown.map(row).join("")}${pend.length?`<li class="ls wait"><small class="muted">Buscando lugares cerca en el mapa…</small></li>`:""}</ul><small class="lsleg"><i class="ver"></i>precio verificado <i class="est"></i>precio estimado <i class="fav"></i>favorito</small></div>`}
function toggleFav(city,n,ll,pr){ST.favs=ST.favs||[];const k=favKey(n);const i=ST.favs.findIndex(f=>f.k===k&&f.city===city);
  if(i>=0){ST.favs.splice(i,1);toast(`☆ ${esc(n)} quitado de favoritos`)}else{ST.favs.push({k,n,city,ll:ll||null,pr:pr||"",chain:CHAINS.test(n)});toast(`★ <b>${esc(n)}</b> en favoritos${CHAINS.test(n)?" · es cadena: se sugerirá el local más cercano cada día":" · se sugerirá cuando estén cerca"}`)}save();render()}
function favCard(key){if(key!=="PA"&&key!=="LO")return"";const L=(ST.favs||[]).filter(f=>f.city===key);
  return `<div class="card buy fcust"><span class="eyebrow">⭐ Favoritos y lugares recurrentes</span>${L.length?`<ul class="brief">${L.map(f=>`<li><b>${esc(f.n)}</b>${f.pr?` · ${esc(f.pr)}`:""}${f.ll?` · <a href="${mlinkQ(f.ll.join(","))}" target="_blank" rel="noopener">mapa</a>`:""} · <label class="chkin"><input type="checkbox" data-favchain="${key}|${f.k}" ${f.chain?"checked":""}> tiene varios locales (cadena)</label> · <button type="button" class="lnkb" data-fav="${key}|${esc(f.n)}||">quitar</button></li>`).join("")}</ul><p class="muted" style="font-size:13px">Cada día se sugieren en la hora de almuerzo si están cerca; si es cadena, se busca el local más cercano.</p>`:`<p class="muted" style="font-size:14px">Marquen con ☆ los lugares que les gusten (en las sugerencias de almuerzo de cada día o en esta guía) y aparecerán como opción en otros días cuando estén cerca.</p>`}</div>`}
function bindLunch(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-fav]",b=>b.onclick=()=>{const [c,n,ll,pr]=b.dataset.fav.split("|");toggleFav(c,n,ll?ll.split(",").map(Number):null,pr)});
  Q("[data-favchain]",x=>x.onchange=()=>{const [c,k]=x.dataset.favchain.split("|");const f=(ST.favs||[]).find(z=>z.k===k&&z.city===c);if(f){f.chain=x.checked;save();render()}});
  Q("[data-lpick]",b=>b.onclick=()=>{const [id,n]=b.dataset.lpick.split(/\|(.+)/);ST.lunchAt=ST.lunchAt||{};if(ST.lunchAt[id]===n)delete ST.lunchAt[id];else ST.lunchAt[id]=n;save();render();if(ST.lunchAt[id])toast(`🍽 Almuerzo en <b>${esc(n)}</b>`)})}

// ===== Agregar a mano (atracciones, espectáculos, escapadas) =====
let MAN=null;// "att|PA" etc.
const SHOW_T=[["🎵","Concierto"],["🎭","Teatro o musical"],["🎪","Show"],["🎉","Evento"],["🎄","Feria o mercado"],["⭐","Otro"]];
function manBtn(kind,city){const k=kind+"|"+(city||"");return `<button type="button" class="chip addchip" data-man="${k}" aria-pressed="${MAN===k}">＋ Agregar a mano</button>`}
function manPanel(kind,city){const k=kind+"|"+(city||"");if(MAN!==k)return"";const lo=city==="LO";
  const common=`<label class="f">Barrio o zona (opcional)<input name="z" placeholder="${lo?"Ej.: Soho":"Ej.: Le Marais"}"></label><label class="f wide">Dirección (opcional, para el plano)<input name="addr" placeholder="${lo?"Ej.: 10 Carnaby Street":"Ej.: 12 rue de Rivoli"}"></label>`;
  let f="";
  if(kind==="att")f=`<label class="f">Nombre<input name="n" required placeholder="Ej.: Librería Shakespeare and Company"></label><label class="f">Categoría<select name="t">${TYP.filter(t=>["pas","mus","mon","igl","ent","tie","otr","per"].includes(t[0])).map(([k,t])=>`<option value="${k}" ${k==="tie"?"selected":""}>${t}</option>`).join("")}</select></label>${common}
   <label class="f">Duración (horas)<input name="h" type="number" min="0.25" step="0.25" value="1"></label><label class="f">Precio por persona (€)<input name="p" type="number" min="0" step="0.5" value="0"></label><label class="f">Cierra a las (opcional)<input name="close" type="time"></label><label class="chk f"><input type="checkbox" name="in"><span class="t">🏛 Techado</span></label>
   <label class="f wide">Nota (opcional)<input name="s" placeholder="Ej.: comprar regalos, ver la sección de cómics"></label><label class="chk f wide"><input type="checkbox" name="add" checked><span class="t">Agregar también al programa (día automático)</span></label>`;
  if(kind==="show")f=`<label class="f">Nombre<input name="n" required placeholder="Ej.: Concierto en Saint-Eustache"></label><label class="f">Tipo<select name="e">${SHOW_T.map(([e,t])=>`<option value="${e}">${e} ${t}</option>`).join("")}</select></label>${common}
   <label class="f">Desde<input name="from" type="date"></label><label class="f">Hasta<input name="to" type="date"></label><label class="f">Hora (opcional)<input name="at" type="time"></label><label class="f">Duración (horas)<input name="h" type="number" min="0.25" step="0.25" value="2"></label><label class="f">Precio por persona (€)<input name="p" type="number" min="0" step="0.5" value="0"></label>
   <label class="f wide">Descripción (opcional)<input name="s"></label><label class="chk f wide"><input type="checkbox" name="add" checked><span class="t">Agregar también al programa (de noche, en sus fechas)</span></label>`;
  if(kind==="esc")f=`<label class="f">Destino<input name="n" required placeholder="Ej.: Honfleur"></label><label class="f">Tipo<select name="k"><option value="dia">De un día</option><option value="noche" selected>Con noche</option><option value="ambos">Día o 1 noche</option></select></label><label class="f">Noches sugeridas<input name="nt" value="1"></label><label class="f">Tiempo en tren desde París<input name="tr" placeholder="Ej.: 2 h (TGV)"></label><label class="f">Costo del tren (ida)<input name="cost" placeholder="Ej.: 30–80 € ida"></label>
   <label class="f wide">Qué ver (separado por comas)<input name="vv" placeholder="Ej.: puerto viejo, iglesia de madera"></label><label class="f wide">Por qué ir (opcional)<input name="s"></label>`;
  return `<form class="fform manform" data-manform="${k}"><span class="eyebrow wide">Agregar a mano · ${kind==="att"?"atracción, tienda o lugar":kind==="show"?"espectáculo o evento":"escapada"}</span>${f}
   <div class="act wide"><button type="submit" class="btn sm">＋ Agregar</button><button type="button" class="btn alt sm" data-man="${k}">Cancelar</button></div>
   <p class="muted wide" style="font-size:13px;margin:0">Todo es opcional salvo el nombre. ${kind==="esc"?"El destino se ubica en el mapa por su nombre.":"Con dirección se ubica en el plano y se calculan los traslados; sin dirección queda sin traslado."}</p></form>`}
async function saveMan(f){const [kind,city]=f.dataset.manform.split("|");const g=k=>(f[k]&&f[k].value||"").trim();const n=g("n");if(!n)return;const b=f.querySelector("button[type=submit]");b.disabled=true;b.textContent="Guardando…";
  const ctx=kind==="esc"?"":city==="LO"?", London":", Paris";let ll=null,addr=g("addr");const q=addr||(kind==="esc"?n:"");
  if(q){try{const j=await (await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=es&q=${encodeURIComponent(q+ctx)}${kind!=="esc"?`&viewbox=${VB[city]}`:""}`)).json();if(j[0]){ll=[+(+j[0].lat).toFixed(5),+(+j[0].lon).toFixed(5)];if(addr)addr=j[0].display_name.split(",").slice(0,3).join(",")}}catch(e){}}
  const c=ST.custom=ST.custom||{};const tm=x=>x?(+x.split(":")[0]+(+x.split(":")[1])/60):0;const base=city==="LO"?lonBase():baseLL();
  if(kind==="esc"){if(!ll){b.disabled=false;b.textContent="＋ Agregar";toast("⚠ No encontré ese destino en el mapa: prueben con otro nombre o agreguen el país");return}
    (c.esc=c.esc||[]).push({id:"cu"+Date.now().toString(36),n,ll,s:g("s")||"Escapada agregada por ustedes.",k:g("k")||"noche",nt:g("nt")||"1",tr:g("tr"),cost:g("cost"),vv:g("vv").split(",").map(x=>x.trim()).filter(Boolean),p:"📍",by:(user&&user.email)||""});MAN=null;save();render();toast(`✔ <b>${esc(n)}</b> agregada a Escapadas`);return}
  const id=(city==="LO"?"lo_cu":"cu")+Date.now().toString(36);
  const a={id,n,ll:ll||base,noloc:ll?0:1,addr,z:g("z")||"Agregado",city,h:+g("h")||1,p:+g("p")||0,s:g("s")||n,v:addr?(ll?"📍 "+addr:"Dirección sin ubicar: "+addr):(g("z")?"Zona: "+g("z"):"Agregado por ustedes"),d:g("s")||"",u:ll?mlinkQ(ll.join(",")):"",by:(user&&user.email)||""};
  if(kind==="att"){Object.assign(a,{t:g("t")||"tie",in:f.in&&f.in.checked?1:0});const cl=tm(g("close"));if(cl)a.close=cl;(c.att=c.att||[]).push(a)}
  if(kind==="show"){const at=tm(g("at"));Object.assign(a,{t:"esp",in:1,eve:!at||at>=17?1:0,from:g("from"),to:g("to")||g("from"),e:g("e")||"⭐"});if(at)a.at=at;(c.show=c.show||[]).push(a)}
  if(f.add&&f.add.checked){ST.paSel=ST.paSel||{};ST.paSel[id]=true}
  MAN=null;save();render();toast(`✔ <b>${esc(n)}</b> agregado${f.add&&f.add.checked?" y en el programa":""}${addr&&!ll?" · no encontré la dirección: quedó sin traslado":""}`)}
function bindMan(){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-man]",b=>b.onclick=()=>{MAN=MAN===b.dataset.man?null:b.dataset.man;render();const f=document.querySelector("[data-manform] [name=n]");if(f)f.focus()});
  Q("[data-manform]",f=>f.onsubmit=e=>{e.preventDefault();saveMan(f)})}

function render(){if(ST.wiz&&!ST.wiz[K.parDir])ST.wiz[K.parDir]=PAR_DEF;if(!ST.base)ST.base="Montorgueil / Sentier (2.º)";if(!user)return;applyCustom();const A=buildAll();window.LAST_A=A;ACTDAY={};A.days.forEach(d=>d.pa&&d.pa.seq.forEach(a=>{if(a.id)ACTDAY[a.id]=d.d}));const dk=el=>el.dataset.k||((el.querySelector("summary")||{}).textContent||"").replace(/\(.*?\)/g,"").trim();const openK=new Set([...document.querySelectorAll("#app details[open]")].map(dk));pushBudget(A);if(!ST.wiz[K.parIni]&&tab!=="cfg")tab="cfg";
  const y=scrollY;
  app.innerHTML=header(A)+(tab==="cfg"||tab==="gas"?summary(A):"")+`<nav class="tabs" role="tablist">${TABS.map(([k,t])=>`<button role="tab" id="tab-${k}" aria-selected="${tab===k}" data-tab="${k}">${t}</button>`).join("")}</nav>
   <section class="panel" id="p-${tab}">${guideHTML(tab)}${tab==="cfg"?pCfg(A):tab==="prog"?pProg(A):tab==="hot"?pHot():tab==="buy"?pBuy():tab==="att"?pAtt(A):tab==="esc"?pEsc(A):tab==="food"?pFood(A):tab==="gas"?pGas(A):tab==="tra"?pTra(A):pShow()}</section>${fichaEsc()}${mapOverlay(A)}${addSheet()}${tripCal(A)}${guideAllHTML()}${findSheet()}`;
  document.querySelectorAll("#app details").forEach(el=>{if(openK.has(dk(el)))el.open=true});
  scrollTo(0,y);bindAll(A);bindCal();bindJun();bindBlk();bindGuide();bindFind();bindFood2();bindLunch();bindMan();bindRit();bindSolo();setTimeout(()=>initMaps(A),0);
  if(tab==="prog"){let fv=0;document.querySelectorAll("#days > .day").forEach(el=>{el.classList.toggle("first-vis",!el.hidden&&!fv);if(!el.hidden)fv=1})}
  hydratePhotos()}
function go(t){tab=t;try{localStorage.setItem(TRIP.ls+"_tab",t)}catch(e){}render()}
function bindAll(A){const W=ST.wiz,Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  const lb=$("#logoBtn");if(lb)lb.onclick=()=>location.href="/";const so=$("#so");if(so)so.onclick=()=>window._auth.U.signOut(window._auth.auth);
  Q("[data-stysel]",b=>b.onclick=()=>{setSty(b.dataset.stysel);render()});
  Q("[data-tab]",b=>b.onclick=()=>go(b.dataset.tab));
  Q("[data-w]",x=>x.onchange=()=>{ST.wiz[x.dataset.w]=x.value;ST.wiz.done=1;save();render();if(x.dataset.w==="par_dir")geoPar();if(x.dataset.w==="lon_dir")geoLon()});
  const pb=$("#paBase");if(pb)pb.onchange=()=>{ST.base=pb.value;save();render()};
  Q("[data-ritmo]",b=>b.onclick=()=>{ST.ritmo=b.dataset.ritmo;save();render()});
  Q("[data-cur]",b=>b.onclick=()=>{cur=b.dataset.cur;try{localStorage.setItem(TRIP.ls+"_cur",cur)}catch(e){}render()});
  Q("[data-food]",b=>b.onclick=()=>{ST.foodStyle=b.dataset.food;save();render()});Q("[data-foodc]",b=>b.onclick=()=>{foodCity=b.dataset.foodc;render()});const rt=$("#rate");if(rt)rt.onchange=()=>{ST.rate=+rt.value||1100;save();render()};
  Q("[data-f]",b=>b.onclick=()=>{filt=b.dataset.f;render()});
  Q("[data-open]",b=>b.onclick=()=>{open=b.dataset.open;escFicha=null;if(tab!=="esc")tab="esc";render();setTimeout(()=>{const f=document.querySelector(`form[data-plan="${open}"]`);if(f)f.scrollIntoView({block:"center",behavior:"smooth"})},60)});
  Q("[data-close]",b=>b.onclick=()=>{open=null;render()});
  Q("[data-del]",b=>b.onclick=()=>{if(b.dataset.arm!=="1"){b.dataset.arm="1";b.textContent="¿Quitar? toca de nuevo";return}const [ini,id]=b.dataset.del.split("|");ST.esc=ST.esc.filter(e=>!(e.ini===ini&&e.id===id));save();render()});
  Q("form[data-plan]",f=>{const id=f.dataset.plan,w=$("#pw-"+id);
    const chk=()=>{const ini=f.ini.value,n=+f.n.value,fin=ini?add(ini,n):"";let m="";
      if(ini&&W[K.parIni]&&(ini<W[K.parIni]||fin>W[K.parFin]))m="⚠ Queda fuera de las fechas en Francia.";else if(ini&&overlap(ini,fin))m="⚠ Se cruza con otra escapada ya elegida.";
      else if(ini)m=n?`Vuelven a París el ${pretty(fin)}.`:"Ida y vuelta en el día.";w.textContent=m;w.style.color=m.startsWith("⚠")?"":"var(--ok)";return !m.startsWith("⚠")};
    f.oninput=chk;chk();f.onsubmit=e=>{e.preventDefault();if(!chk())return;ST.esc.push({id,ini:f.ini.value,fin:add(f.ini.value,+f.n.value)});open=null;save();render()}});
  bindEsc();
  // programa
  Q("[data-pasel]",x=>x.onchange=()=>{const id=x.dataset.pasel;ST.paSel=ST.paSel||{};ST.paSel[id]=x.checked;if(!x.checked){if(ST.paPin)delete ST.paPin[id];if(ST.paJun)delete ST.paJun[id]}save();render();toast(selMsg(id))});
  Q("[data-rm]",x=>x.onclick=()=>{ST.paSel=ST.paSel||{};ST.paSel[x.dataset.rm]=false;save();render()});
  Q("[data-papin]",x=>x.onchange=()=>{ST.paPin=ST.paPin||{};if(x.value)ST.paPin[x.dataset.papin]=x.value;else delete ST.paPin[x.dataset.papin];save();render()});
  Q("[data-pmeal]",x=>x.onchange=()=>{ST.meals=ST.meals||{};ST.meals[x.dataset.pmeal]=x.checked;save();render()});
  Q("[data-pmopt]",x=>x.onchange=()=>{ST.mealOpt=ST.mealOpt||{};ST.mealOpt[x.dataset.pmopt]=+x.value;save();render()});
  Q("[data-pmv]",x=>x.onclick=()=>{const [d,id,dir]=x.dataset.pmv.split("|");const day=A.days.find(q=>q.id===d);if(!day||!day.pa)return;const ids=day.pa.seq.filter(a=>!a.night).map(a=>a.id);const i=ids.indexOf(id),j=i+(+dir);if(j<0||j>=ids.length)return;[ids[i],ids[j]]=[ids[j],ids[i]];ST.paOrd=ST.paOrd||{};ST.paOrd[d]=ids;save();render()});
  Q("[data-pmreset]",x=>x.onclick=()=>{ST.paOrd=ST.paOrd||{};delete ST.paOrd[x.dataset.pmreset];save();render()});
  Q("[data-dtab]",x=>x.onclick=()=>{progCity=x.dataset.dtab;try{localStorage.setItem(TRIP.ls+"_progcity",progCity)}catch(e){}render();const t=$("#daytabs");if(t)t.scrollIntoView({block:"start",behavior:"smooth"})});
  Q("[data-dchip]",x=>x.onclick=()=>{progDay[progCity]=x.dataset.dchip;Q("[data-dchip]",y=>y.setAttribute("aria-pressed",y===x));const dv=document.querySelector(`#days > .day[data-day="${x.dataset.dchip}"]`),tb=$("#daytabs");if(dv)scrollTo({top:dv.getBoundingClientRect().top+scrollY-(tb?tb.offsetHeight:0)-4,behavior:"smooth"})});
  const fm=$("#feasmini");if(fm)fm.onclick=()=>{document.body.classList.toggle("feas-open");render()};
  Q(".blk-com > h4, .blk-tr > h4",h=>h.onclick=()=>{const b=h.parentNode;b.classList.toggle("open");const k=b.closest(".day").dataset.day+"|"+(b.classList.contains("blk-com")?"com":"tr");b.classList.contains("open")?openActs.add(k):openActs.delete(k);setTimeout(()=>initMaps(A),0)});
  Q(".actrow2:not(.lite) .ar-top",t=>t.onclick=e=>{if(e.target.closest("button,a,select,input"))return;const r=t.closest(".actrow2"),k=r.closest(".day").dataset.day+"|"+r.dataset.k;r.classList.toggle("open");r.classList.contains("open")?openActs.add(k):openActs.delete(k)});
  Q("[data-dmap]",b=>{b.onclick=()=>{mapOpen=b.dataset.dmap;render()};b.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();b.click()}}});
  Q("[data-paday]",x=>x.onchange=()=>{const id=x.dataset.paday;if(!x.value)return;ST.paSel=ST.paSel||{};ST.paPin=ST.paPin||{};if(x.value==="off"){ST.paSel[id]=false;delete ST.paPin[id]}else{ST.paSel[id]=true;if(x.value!=="auto")ST.paPin[id]=x.value;else delete ST.paPin[id]}save();render();toast(selMsg(id))});
  Q("[data-lunchday]",x=>x.onchange=()=>{const r=LUNCH_V[+x.dataset.lunchday];ST.lunchAt=ST.lunchAt||{};for(const k in ST.lunchAt)if(ST.lunchAt[k]===r[0])delete ST.lunchAt[k];if(x.value){ST.lunchAt[x.value]=r[0];if(/bouillon|6\.90/i.test(r[0])){ST.mealOpt=ST.mealOpt||{};ST.mealOpt[x.value+"|a"]=3}}save();render()});
  Q("[data-tmode]",b=>b.onclick=()=>{ST.transMode=b.dataset.tmode;save();render()});
  Q("[data-gotab]",x=>x.onclick=e=>{e.preventDefault();go(x.dataset.gotab);scrollTo(0,0)});
  Q("[data-addday]",b=>b.onclick=()=>{addDay=b.dataset.addday;addTyp=addDay.startsWith("L")?"mus":"pas";render()});
  Q("[data-aclose]",b=>b.onclick=e=>{if(e.target===b||b.classList.contains("fx")){addDay=null;render()}});
  Q("[data-addtyp]",b=>b.onclick=()=>{addTyp=b.dataset.addtyp;render()});
  Q("[data-addactd]",b=>b.onclick=()=>{const [id,dd]=b.dataset.addactd.split("|");ST.paSel=ST.paSel||{};ST.paPin=ST.paPin||{};ST.paSel[id]=true;ST.paPin[id]=dd;addDay=null;save();render()});
  Q("[data-addact]",b=>b.onclick=()=>{const id=b.dataset.addact;ST.paSel=ST.paSel||{};ST.paPin=ST.paPin||{};ST.paSel[id]=true;ST.paPin[id]=addDay.replace(/^L/,"");addDay=null;save();render();toast(selMsg(id))});
  Q("[data-perform]",f=>f.onsubmit=e=>{e.preventDefault();savePer(f)});
  Q("[data-addlunch]",b=>b.onclick=()=>{const r=LUNCH_V[+b.dataset.addlunch];ST.lunchAt=ST.lunchAt||{};ST.lunchAt[addDay]=r[0];if(/bouillon|6\.90/i.test(r[0])){ST.mealOpt=ST.mealOpt||{};ST.mealOpt[addDay+"|a"]=3}addDay=null;save();render()});
  Q("[data-addtrip]",b=>b.onclick=()=>{const d=addDay;if(overlap(d,d))return;ST.esc.push({id:b.dataset.addtrip,ini:d,fin:d});addDay=null;save();render()});
  Q("[data-mclose]",b=>b.onclick=e=>{if(e.target===b||b.classList.contains("fx")){mapOpen=null;render()}});
  Q("[data-ficha]",x=>x.onclick=e=>{e.preventDefault();attCity="PA";attFilt="todas";go("att");setTimeout(()=>{const f=$("#fpa-"+x.dataset.ficha);if(f){f.scrollIntoView({block:"start",behavior:"smooth"});f.classList.add("flash");setTimeout(()=>f.classList.remove("flash"),1600)}},80)});
  // alojamiento
  const get=k=>{ST.hot=ST.hot||{};ST.hot[k]=ST.hot[k]||[];return ST.hot[k]};
  Q("[data-htab]",x=>x.onclick=()=>{hotTab=x.dataset.htab;render()});
  Q("form[data-hadd]",f=>f.onsubmit=e=>{e.preventDefault();const L=get(f.dataset.hadd);L.push({id:uid(),n:f.n.value.trim(),url:f.url.value.trim(),price:"",mode:"n",sel:!L.length});save();render()});
  Q("[data-hsel]",x=>x.onchange=()=>{const [k,id]=x.dataset.hsel.split("|");get(k).forEach(o=>o.sel=o.id===id);save();render()});
  Q("[data-hf]",x=>x.onchange=()=>{const [k,id,f]=x.dataset.hf.split("|");const o=get(k).find(q=>q.id===id);if(o){o[f]=x.value;save();render()}});
  Q("[data-hdel]",x=>x.onclick=()=>{const [k,id]=x.dataset.hdel.split("|");if(x.dataset.arm!=="1"){x.dataset.arm="1";x.textContent="¿Eliminar? toca de nuevo";return}ST.hot[k]=get(k).filter(q=>q.id!==id);if(ST.hot[k].length&&!ST.hot[k].some(q=>q.sel))ST.hot[k][0].sel=true;save();render()});
  // trámites, atracciones, espectáculos
  Q("[data-chk]",x=>x.onchange=()=>{ST.chk=ST.chk||{};ST.chk[x.dataset.chk]=x.checked;save();render()});
  Q("[data-attc]",x=>x.onclick=()=>{attCity=x.dataset.attc;attFilt="todas";render()});
  Q("[data-showc]",x=>x.onclick=()=>{showCity=x.dataset.showc;render()});
  Q("[data-pasel-btn]",x=>x.onclick=()=>{const id=x.dataset.paselBtn;ST.paSel=ST.paSel||{};const on=!selOf(actById(id));ST.paSel[id]=on;if(!on&&ST.paPin)delete ST.paPin[id];save();render();toast(selMsg(id))});
  Q("[data-attf]",x=>x.onclick=()=>{attFilt=x.dataset.attf;render()});
  Q("[data-fsel]",x=>x.onclick=()=>{const a=PA.find(q=>q.id===x.dataset.fsel);ST.paSel=ST.paSel||{};ST.paSel[a.id]=!paSel(a);save();render()});
  Q("[data-goesc]",x=>x.onclick=e=>{e.preventDefault();escPick=x.dataset.goesc;go("esc")})}

boot();