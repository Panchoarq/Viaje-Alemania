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
 {id:"reino-unido",n:"Reino Unido (Londres)",p:"🇬🇧",moneda:"GBP",ciudades:[{id:"londres",n:"Londres",estado:"existente"}]},
 {id:"francia",n:"Francia",p:"🇫🇷",moneda:"EUR",ciudades:[{id:"paris",n:"París",estado:"existente"},{id:"estrasburgo",n:"Estrasburgo",estado:"existente"}]},
 {id:"alemania",n:"Alemania",p:"🇩🇪",moneda:"EUR",ciudades:[{id:"hamburgo",n:"Hamburgo",estado:"existente"},{id:"berlin",n:"Berlín",estado:"existente"},{id:"munich",n:"Múnich",estado:"existente"}]},
 {id:"chequia",n:"Chequia",p:"🇨🇿",moneda:"CZK",ciudades:[{id:"praga",n:"Praga",estado:"existente"}]}
];

// Buscador simple por texto (sin tildes) para el asistente.
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
export function buscar(q){q=norm(q||"");return PAISES.flatMap(p=>p.ciudades.map(c=>({...c,pais:p.n,paisId:p.id,p:p.p}))).filter(c=>norm(c.n+" "+c.pais).includes(q))}
export const cargar=(paisId,ciudadId)=>import(`./${paisId}/${ciudadId}.js`);
