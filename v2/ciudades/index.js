// Catálogo de países y ciudades para el asistente de «Nuevo viaje».
// estado: "lista" = paquete precargado en esta carpeta · "pendiente" = se genera después · "existente" = ya está en París/Alemania.
// Cada paquete: ./<pais>/<ciudad>.js (export CIUDAD, ATRACCIONES, ESCAPADAS, COMIDAS, GUIA_COMIDA, BARRIOS, TRANSPORTE, CONSEJOS, TRAMITES).
export const PAISES=[
 {id:"escocia",n:"Escocia",p:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",moneda:"GBP",ciudades:[
  {id:"edimburgo",n:"Edimburgo",estado:"lista"},{id:"glasgow",n:"Glasgow",estado:"lista"},{id:"inverness",n:"Inverness y Loch Ness",estado:"lista"},
  {id:"skye",n:"Isla de Skye",estado:"lista"},{id:"standrews",n:"St Andrews",estado:"lista"}]},
 {id:"irlanda",n:"Irlanda",p:"🇮🇪",moneda:"EUR",ciudades:[
  {id:"dublin",n:"Dublín",estado:"lista"},{id:"galway",n:"Galway",estado:"lista"},{id:"cork",n:"Cork",estado:"lista"},
  {id:"killarney",n:"Killarney y Anillo de Kerry",estado:"lista"},{id:"belfast",n:"Belfast (Irlanda del Norte)",estado:"lista"}]},
 {id:"japon",n:"Japón",p:"🇯🇵",moneda:"JPY",ciudades:[
  {id:"tokio",n:"Tokio",estado:"pendiente"},{id:"kioto",n:"Kioto",estado:"pendiente"},{id:"osaka",n:"Osaka",estado:"pendiente"},
  {id:"nara",n:"Nara",estado:"pendiente"},{id:"hiroshima",n:"Hiroshima y Miyajima",estado:"pendiente"},{id:"hakone",n:"Hakone y Monte Fuji",estado:"pendiente"}]},
 {id:"china",n:"China",p:"🇨🇳",moneda:"CNY",ciudades:[
  {id:"pekin",n:"Pekín",estado:"pendiente"},{id:"shanghai",n:"Shanghái",estado:"pendiente"},{id:"xian",n:"Xi'an",estado:"pendiente"},
  {id:"chengdu",n:"Chengdú",estado:"pendiente"},{id:"guilin",n:"Guilin y Yangshuo",estado:"pendiente"}]},
 {id:"corea-del-sur",n:"Corea del Sur",p:"🇰🇷",moneda:"KRW",ciudades:[
  {id:"seul",n:"Seúl",estado:"lista"},{id:"busan",n:"Busan",estado:"lista"},{id:"jeju",n:"Isla de Jeju",estado:"lista"},{id:"gyeongju",n:"Gyeongju",estado:"lista"}]},
 {id:"inglaterra",n:"Inglaterra",p:"🇬🇧",moneda:"GBP",ciudades:[{id:"londres",n:"Londres",estado:"lista"}]},
 {id:"francia",n:"Francia",p:"🇫🇷",moneda:"EUR",ciudades:[{id:"paris",n:"París",estado:"lista"},{id:"estrasburgo",n:"Estrasburgo",estado:"pendiente"}]},
 {id:"alemania",n:"Alemania",p:"🇩🇪",moneda:"EUR",ciudades:[{id:"hamburgo",n:"Hamburgo",estado:"lista"},{id:"berlin",n:"Berlín",estado:"lista"},{id:"munich",n:"Múnich",estado:"lista"}]},
 {id:"chequia",n:"Chequia",p:"🇨🇿",moneda:"CZK",ciudades:[{id:"praga",n:"Praga",estado:"lista"}]}
];

// Ciudades anexas: escapada a una ciudad de un país vecino dentro de un viaje de otro país (como Bruselas desde París).
const ANEXAS={alemania:[["chequia","praga"]],chequia:[["alemania","berlin"],["alemania","munich"]],francia:[["inglaterra","londres"]],inglaterra:[["francia","paris"]],
 escocia:[["irlanda","dublin"],["irlanda","belfast"]],irlanda:[["escocia","edimburgo"],["escocia","glasgow"]]};
export const anexasDe=paisId=>(ANEXAS[paisId]||[]).map(([p,c])=>{const P=PAISES.find(x=>x.id===p),C=P&&P.ciudades.find(x=>x.id===c);return C&&C.estado==="lista"?{...C,pais:p,paisN:P.n,bandera:P.p}:null}).filter(Boolean);

// Buscador simple por texto (sin tildes) para el asistente.
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
export function buscar(q){q=norm(q||"");return PAISES.flatMap(p=>p.ciudades.map(c=>({...c,pais:p.n,paisId:p.id,p:p.p}))).filter(c=>norm(c.n+" "+c.pais).includes(q))}
export const cargar=(paisId,ciudadId)=>import(`./${paisId}/${ciudadId}.js`);
export const cargarTraslados=paisId=>import(`./${paisId}/traslados.js`);
