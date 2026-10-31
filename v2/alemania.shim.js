// Capa de guardado del viaje a Alemania en v2. Reemplaza la capa de sincronización de /alemania:
// el plan vive en Firestore trips/alemania (login con Google) y NO toca plan/estado (el plan en vivo de /alemania).
// El código de la página usa `store.getItem/setItem` con claves ruta_*; aquí se guardan esas mismas claves.
// Sin documento todavía, se parte de los valores confirmados (trips/alemania.confirmado.js); solo se escribe al editar.
// Con ?demo (o abierto como archivo) todo queda solo en este navegador.
const SHARED=["ruta_dayord","ruta_daypin","ruta_cfg","ruta_prices","ruta_acts","ruta_verleg","ruta_hotel","ruta_rmode","ruta_mealopt","ruta_buy","ruta_lock","ruta_resetHB1","ruta_pass1","ruta_mucop2","ruta_genham1","ruta_genham2","ruta_add2","ruta_chile1"];
const MEM={};let _ref=null,_F=null,_user=null,_timer=null,_busy=false,_again=false,_ro=false,_started=false;
const _NS="a2:",_DEMO=location.protocol==="file:"||new URLSearchParams(location.search).has("demo");
function _lsGet(k){try{return localStorage.getItem(_NS+k)}catch(e){return null}}
function _lsSet(k,v){try{localStorage.setItem(_NS+k,v)}catch(e){}}
function _chip(t,cls){const c=document.getElementById("syncChip");if(!c)return;c.hidden=false;c.textContent=t;c.className="sync-chip "+(cls||"");if(cls==="ok")setTimeout(()=>{c.hidden=true},2500)}
const store={
  getItem(k){return SHARED.includes(k)?(k in MEM?MEM[k]:null):_lsGet(k)},
  setItem(k,v){v=String(v);_lsSet(k,v);if(!SHARED.includes(k)||MEM[k]===v)return;MEM[k]=v;_queue()}
};
function _snap(){const o={};SHARED.forEach(k=>{if(k in MEM)o[k]=MEM[k]});return o}
function _queue(){
  if(_DEMO){_chip("Guardado (demo local)","ok");return}
  if(!_ref||_ro)return;_chip("Guardando…","busy");clearTimeout(_timer);_timer=setTimeout(()=>{_timer=null;_save()},700)}
async function _save(){if(_busy){_again=true;return}_busy=true;
  try{await _F.setDoc(_ref,{..._snap(),by:_user.email,at:Date.now()},{merge:true});_chip("☁ Guardado para todos","ok")}
  catch(e){if(e&&e.code==="permission-denied"){_ro=true;_chip("Solo lectura · sin permiso para guardar","ro")}else{_chip("Sin conexión · reintentando","ro");setTimeout(_queue,4000)}}
  _busy=false;if(_again){_again=false;_save()}}
function _start(){if(_started)return;_started=true;const b=document.getElementById("bootMsg");if(b)b.remove();__main()}
// valores confirmados → claves ruta_* (y marcas de migración en "1" para que el código no los pise)
async function _seed(){
  const {CONFIRMADO:C}=await import("/v2/trips/alemania.confirmado.js");
  const J=JSON.stringify;
  Object.assign(MEM,{ruta_cfg:J(C.cfg),ruta_hotel:J(C.hotel),ruta_rmode:J(C.roomMode),ruta_prices:J(C.prices),ruta_verleg:J(C.trenes),ruta_acts:J(C.acts),ruta_daypin:J(C.dayPin),ruta_lock:J(C.lock),ruta_mealopt:J(C.mealOpt)});
  ["ruta_resetHB1","ruta_pass1","ruta_mucop2","ruta_genham1","ruta_genham2","ruta_add2","ruta_chile1"].forEach(k=>MEM[k]="1")}
function _gate(msg,denied){document.querySelector(".wrap").hidden=true;let g=document.getElementById("gate");if(!g){g=document.createElement("div");g.id="gate";document.body.appendChild(g)}
  g.innerHTML=`<div style="max-width:420px;margin:12vh auto;padding:0 20px;text-align:center;font-family:var(--f-body)"><img src="/img/logo-marcopolo.jpg" alt="Marco Polo" style="width:120px;border-radius:6px;transform:rotate(-3deg)">
  <p class="eyebrow">Viaje privado</p><h1 style="font-family:var(--f-display)">Viaje a Alemania</h1>
  ${denied?`<p style="color:var(--bad)">Este viaje es privado y <b>${(_user&&_user.email)||""}</b> no está autorizado. Pídele a Francisco que agregue tu correo.</p><p><button id="gout" class="btn alt">Entrar con otra cuenta</button></p>`
  :`<p class="muted">Entra con tu cuenta de Google para ver y editar el plan. Solo las personas invitadas pueden verlo.</p>${msg?`<p style="color:var(--bad)">${msg}</p>`:""}<button id="gin" class="btn" style="font:inherit;padding:10px 18px">Entrar con Google</button>`}
  <p style="margin-top:22px"><a href="/">← Volver a Marco Polo</a></p></div>`;
  const i=document.getElementById("gin");if(i)i.onclick=async()=>{const {U,auth}=window._auth;try{await U.signInWithPopup(auth,new U.GoogleAuthProvider())}catch(e){if(e.code!=="auth/popup-closed-by-user")_gate("No se pudo entrar con Google ("+e.code+").")}};
  const o=document.getElementById("gout");if(o)o.onclick=()=>window._auth.U.signOut(window._auth.auth)}
const _FB_CFG={apiKey:"AIzaSyBJefyy5hhRQHK4EWbmZFC15h2Fgb55w68",authDomain:"viaje-a-alemania-60001.firebaseapp.com",projectId:"viaje-a-alemania-60001",storageBucket:"viaje-a-alemania-60001.firebasestorage.app",messagingSenderId:"1061928899634",appId:"1:1061928899634:web:d5ffc52cb53edebe71182b"};
async function _boot(){
  if(_DEMO){SHARED.forEach(k=>{const v=_lsGet(k);if(v!==null)MEM[k]=v});if(!("ruta_cfg" in MEM))await _seed();_user={email:"demo@local"};_start();_chip("Modo demo · solo en este navegador","ro");return}
  const B="https://www.gstatic.com/firebasejs/10.12.2/";
  const [A,U,FS]=await Promise.all([import(B+"firebase-app.js"),import(B+"firebase-auth.js"),import(B+"firebase-firestore.js")]);
  _F=FS;const fa=A.initializeApp(_FB_CFG),auth=U.getAuth(fa),db=FS.getFirestore(fa);_ref=FS.doc(db,"trips","alemania");window._auth={U,auth};
  let unsub=null;
  U.onAuthStateChanged(auth,async u=>{
    if(unsub){unsub();unsub=null}
    if(!u||u.isAnonymous){_user=null;return _gate()}
    _user=u;
    let s;try{s=await FS.getDoc(_ref)}catch(e){return _gate(null,true)}
    const d=s.exists()?s.data():{};
    if(SHARED.some(k=>typeof d[k]==="string"))SHARED.forEach(k=>{if(typeof d[k]==="string")MEM[k]=d[k]});else await _seed();
    // si otra persona guarda cambios, se avisa y se recarga con ellos
    let first=true;unsub=FS.onSnapshot(_ref,sn=>{if(first){first=false;return}if(sn.metadata.hasPendingWrites||_timer||_busy)return;
      const nd=sn.data()||{};if(SHARED.some(k=>typeof nd[k]==="string"&&nd[k]!==MEM[k])){SHARED.forEach(k=>{if(typeof nd[k]==="string")MEM[k]=nd[k]});location.reload()}},()=>{});
    document.getElementById("gate")&&document.getElementById("gate").remove();document.querySelector(".wrap").hidden=false;
    _start();_chip(s.exists()?"☁ Plan compartido · en vivo":"Valores confirmados · se guarda al editar","ok")});
}
