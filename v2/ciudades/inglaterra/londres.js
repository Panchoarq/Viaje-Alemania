// Paquete de ciudad: Londres (Inglaterra). Adaptador: reutiliza los datos del viaje a París/Londres (v2/trips/paris.data.js).
import {LON,GBP,TIPS,LO_F,CTX_LO,MEDIA_LO,SHOWS as SH_ALL,SHOW_X as SHX_ALL,LON_MEAL,FOOD_G} from "../../trips/paris.data.js";
import {ALICE_V,ALICE_IDEAS} from "./londres-alice.js";
import {EXTRA,RUTAS as RUTAS_X,MAPAS as MAPAS_X} from "./londres-rutas.js";
const LOALL=[...LON.map(a=>LO_F[a.id]?{...a,y:LO_F[a.id].y,his:LO_F[a.id].h}:a),...EXTRA];
const zonas=A=>Object.fromEntries([...new Set(A.map(a=>a.z))].map(z=>[z,z]));
export const CIUDAD={id:"londres",n:"Londres",pais:"inglaterra",p:"🇬🇧",ll:[51.5074,-0.1278],geo:", London",
  moneda:{code:"GBP",sym:"£",eur:GBP},transit:"metro (Tube), buses y Elizabeth line",idioma:"inglés",verificado:false,fuente:"Datos del viaje a Londres de la app",
  resumen:"Museos gratuitos de primer nivel, palacios, parques enormes y teatro. Muy grande: conviene agrupar por barrio y usar el metro.",
  mejorEpoca:"Mayo–septiembre; diciembre por el ambiente navideño. Llevar siempre paraguas.",dias:{ideal:4,minimo:3}};
export const ZONAS=zonas(LOALL);
export const ATRACCIONES=LOALL;
export const CONTEXTO=CTX_LO;
export const MEDIA=MEDIA_LO;
export const ALICE={videos:ALICE_V,ideas:ALICE_IDEAS,canal:"https://www.youtube.com/@history_alice/videos"};
export const RUTAS=RUTAS_X;
export const MAPAS=MAPAS_X;
export const ESCAPADAS=[];
export const COMIDAS=LON_MEAL;
export const LUGARES_COMIDA=FOOD_G.LO;
export const SHOWS=SH_ALL.filter(s=>s.w==="Londres");
export const SHOW_X=Object.fromEntries(SHOWS.filter(s=>SHX_ALL[s.n]).map(s=>[s.n,SHX_ALL[s.n]]));
export const GUIA_COMIDA=[];
export const BARRIOS=[{n:"Zona 1 (Westminster, South Bank, Bloomsbury)",d:"Lo más cómodo para el turismo, y lo más caro."},{n:"Kensington y Chelsea",d:"Residencial y elegante, cerca de museos y parques."},{n:"Shoreditch y Camden",d:"Ambiente joven, mercados y vida nocturna."}];
export const TRANSPORTE={llegada:"Heathrow → centro: Elizabeth line (~14 £, 35 min) o Piccadilly line (~6 £). Gatwick: Gatwick Express o Thameslink.",local:"Se paga con tarjeta sin contacto en metro y bus (tope diario ~9 £ en zonas 1–2). El Oyster no es necesario.",trenes:"Eurostar a París desde St Pancras en ~2 h 20; National Rail para otras ciudades."};
export const CONSEJOS=TIPS.slice(1,5).flatMap(t=>t[2]).slice(0,10);
export const TRAMITES={pais:"Reino Unido",eta:TIPS[0][2].find(x=>/ETA/.test(x))||"Chilenos necesitan ETA para entrar a Reino Unido.",seguro:"Seguro de viaje con cobertura médica (la sanidad pública no cubre a turistas).",moneda:"Libra esterlina (£). Todo con tarjeta sin contacto."};
