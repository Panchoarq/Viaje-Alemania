// Guardado de los viajes nuevos en la cuenta (Firestore, colección «viajes»).
// La copia local (localStorage «mp_viajes») sigue siendo el respaldo: si la nube falla, nada se pierde.
const B="https://www.gstatic.com/firebasejs/10.12.2/";
const FBC={apiKey:"AIzaSyBJefyy5hhRQHK4EWbmZFC15h2Fgb55w68",authDomain:"viaje-a-alemania-60001.firebaseapp.com",projectId:"viaje-a-alemania-60001",storageBucket:"viaje-a-alemania-60001.firebasestorage.app",messagingSenderId:"1061928899634",appId:"1:1061928899634:web:d5ffc52cb53edebe71182b"};
const LISTA="mp_viajes";

let _c;
export function conectar(){
  return _c??=(async()=>{
    const [A,U,FS]=await Promise.all([import(B+"firebase-app.js"),import(B+"firebase-auth.js"),import(B+"firebase-firestore.js")]);
    const app=A.getApps().length?A.getApp():A.initializeApp(FBC);
    return {U,FS,auth:U.getAuth(app),db:FS.getFirestore(app)};
  })();
}

// Correo (en minúsculas) de quien tiene la sesión abierta; "" si no hay sesión.
export async function correo(ms=6000){
  const {U,auth}=await conectar();
  const u=await new Promise(res=>{const t=setTimeout(()=>res(null),ms);const off=U.onAuthStateChanged(auth,x=>{clearTimeout(t);off();res(x)})});
  return u&&!u.isAnonymous?String(u.email||"").toLowerCase():"";
}

export const leerLocal=()=>{try{return JSON.parse(localStorage.getItem(LISTA)||"[]")}catch(e){return[]}};
export const escribirLocal=l=>{try{localStorage.setItem(LISTA,JSON.stringify(l))}catch(e){}};
const limpio=v=>JSON.parse(JSON.stringify(v));
const conTope=(p,ms=5000)=>Promise.race([p,new Promise((_,no)=>setTimeout(()=>no(new Error("tiempo")),ms))]);

export async function subir(v){
  const {FS,db}=await conectar();
  await conTope(FS.setDoc(FS.doc(db,"viajes",v.id),limpio(v)));
}
export async function borrar(id){
  const {FS,db}=await conectar();
  await conTope(FS.deleteDoc(FS.doc(db,"viajes",id)));
}
export async function traer(id){
  const {FS,db}=await conectar();
  const s=await conTope(FS.getDoc(FS.doc(db,"viajes",id)));
  return s.exists()?s.data():null;
}
async function listar(em){
  const {FS,db}=await conectar();
  const s=await conTope(FS.getDocs(FS.query(FS.collection(db,"viajes"),FS.where("owner","==",em))),8000);
  return s.docs.map(d=>d.data());
}

// Une la nube con este dispositivo: gana la versión más reciente; lo que solo estaba aquí se sube a tu cuenta.
export async function sincronizar(em){
  const nube=await listar(em),loc=leerLocal(),res=[];
  const porId=new Map(nube.map(v=>[v.id,v]));
  for(const v of loc){
    if(v.owner&&v.owner!==em){res.push(v);continue}            // de otra cuenta en este navegador: no se toca
    const n=porId.get(v.id);
    if(n&&(n.act||0)>=(v.act||0)){res.push(n);porId.delete(v.id);continue}
    const m={...v,owner:em};
    try{await subir(m)}catch(e){}
    res.push(m);porId.delete(v.id);
  }
  for(const n of porId.values())res.push(n);                  // viajes de la cuenta que no estaban en este dispositivo
  escribirLocal(res);
  return res;
}

// Gastos del viaje: subcolección viajes/{id}/gastos (misma regla de dueño que el viaje).
export async function gastosListar(id){
  const {FS,db}=await conectar();
  const s=await conTope(FS.getDocs(FS.collection(db,"viajes",id,"gastos")),8000);
  return s.docs.map(d=>d.data());
}
export async function gastoSet(id,g){
  const {FS,db}=await conectar();
  await conTope(FS.setDoc(FS.doc(db,"viajes",id,"gastos",g.id),limpio(g)));
}
export async function gastoDel(id,gid){
  const {FS,db}=await conectar();
  await conTope(FS.deleteDoc(FS.doc(db,"viajes",id,"gastos",gid)));
}
