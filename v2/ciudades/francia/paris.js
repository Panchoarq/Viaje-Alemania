// Paquete de ciudad: París (Francia). Adaptador: reutiliza los datos del viaje a París (v2/trips/paris.data.js),
// así que cualquier corrección que se haga allí se refleja aquí. Comidas y transporte: cifras generales sin verificar.
import {ZONES_PA} from "../../trips/paris.data.js";
import {PA,ESC,BASES,TIPS} from "../../trips/paris.data.js";
const zonas=A=>Object.fromEntries([...new Set(A.map(a=>a.z))].map(z=>[z,z]));
export const CIUDAD={id:"paris",n:"París",pais:"francia",p:"🇫🇷",ll:[48.8566,2.3522],geo:", Paris",
  moneda:{code:"EUR",sym:"€",eur:1},transit:"metro, RER y buses RATP",idioma:"francés",verificado:false,fuente:"Datos del viaje a París de la app",
  resumen:"La capital francesa: museos enormes, barrios para caminar, cafés y escapadas fáciles en tren. Se recorre en metro y a pie; reservar con hora los grandes museos.",
  mejorEpoca:"Abril–junio y septiembre–octubre; diciembre por las luces. Julio y agosto: mucho calor y turismo.",dias:{ideal:5,minimo:3}};
export const ZONAS=zonas(PA);
export const ATRACCIONES=PA;
export const ESCAPADAS=ESC.map(e=>({...e,id:"pa_"+e.id}));
export const COMIDAS={d:[["Café y croissant en una boulangerie",5],["En el alojamiento",0]],a:[["Menú del día (formule) en un bistró",18],["Sándwich o crepe salada",9]],m:[["Crepe dulce o pâtisserie",6]],c:[["Bistró con plato principal",28],["Supermercado o fromagerie + pan",10]]};
export const GUIA_COMIDA=[];
export const BARRIOS=Object.keys(BASES).map(n=>({n,d:"Zona recomendada como base en la guía del viaje a París."}));
export const TRANSPORTE={llegada:"Aeropuerto Charles de Gaulle → centro: RER B (~12 €, 35 min). Orly: tranvía T7 o metro 14 (~10 €).",local:"Ticket de metro y bus ~2,50 €; el pase Navigo (semanal) conviene si te quedas varios días. El metro llega a casi todo.",trenes:"SNCF para escapadas y otras ciudades; Eurostar a Londres en ~2 h 20 desde Gare du Nord."};
export const CONSEJOS=TIPS.slice(1,5).flatMap(t=>t[2]).slice(0,10);
export const TRAMITES={pais:"Francia (espacio Schengen)",eta:TIPS[0][2][0],seguro:(TIPS[0][2].find(x=>/Seguro/i.test(x))||"Seguro de viaje con cobertura médica."),moneda:"Euro (€). Se paga casi todo con tarjeta sin contacto."};
export const PRECAUCION=ZONES_PA;
