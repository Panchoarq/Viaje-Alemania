// Adaptador de los datos del viaje a Alemania (v2/trips/alemania.data.js) al formato de paquete de ciudad.
// k: M = Múnich · B = Berlín · H = Hamburgo · P = Praga
import {ACTS,WHY,ATTR,FOODOPT,LOCAL} from "../../trips/alemania.data.js";
const limpia=s=>String(s||"").replace(/<[^>]+>/g,"");
export const ZONAS={centro:"Centro"};
export const atracciones=(k,pref)=>(ACTS[k]||[]).map((a,i)=>{const t=ATTR[k+":"+i]||{};
  return {id:pref+"_"+i,t:"",n:a.n,ll:a.ll,h:a.h,p:a.p||0,in:a.in?1:0,close:a.close,cl:a.closed,top:a.top?1:0,z:"centro",
    s:(WHY[k]&&WHY[k][i])||t.s||"",v:limpia((t.h||[])[0]),d:a.note||"",u:a.u||""}});
export const comidas=k=>{const f=FOODOPT[k]||{},o={};for(const x of ["d","a","m","c"])o[x]=(f[x]||[]).map(r=>[r[0],r[1]]);return o};
export const local=k=>(LOCAL[k]&&LOCAL[k].n)||"";
export const TRAMITES_DE={pais:"Alemania (espacio Schengen)",eta:"Chilenos no necesitan visa para turismo (hasta 90 días en el espacio Schengen); pasaporte vigente al menos 3 meses después de la salida.",seguro:"Seguro de viaje con cobertura médica contratado antes de salir.",moneda:"Euro (€). Aún se usa mucho el efectivo: llevar algo."};
export const CONSEJOS_DE=["Comprar los trenes de larga distancia con anticipación (más baratos) en bahn.de.","Reservar con hora las atracciones más visitadas.","Domingos y festivos: casi todo el comercio cierra.","Pagar con tarjeta no siempre es posible: llevar algo de efectivo."];
