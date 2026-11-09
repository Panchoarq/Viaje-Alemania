// Paquete de ciudad: Praga (Chequia). Adaptador de los datos del viaje a Alemania (v2/trips/alemania.data.js).
import {ZONES} from "../../trips/alemania.data.js";
import {ZONAS as Z,atracciones,comidas,local,TRAMITES_DE,CONSEJOS_DE} from "../alemania/_de.js";
export const CIUDAD={id:"praga",n:"Praga",pais:"chequia",ll:[50.0755,14.4378],geo:", Praga",moneda:{code:"CZK",sym:"Kč",eur:0.04},transit:"transporte público local",idioma:"checo",verificado:false,fuente:"Datos del viaje a Alemania de la app",
  resumen:"Casco histórico medieval casi intacto: puente de Carlos, castillo, plaza del Reloj Astronómico. Se recorre a pie y en tranvía.",mejorEpoca:"Abril–junio y septiembre–octubre; diciembre por los mercados navideños.",dias:{ideal:3,minimo:2}};
export const ZONAS=Z;
export const ATRACCIONES=atracciones("P","pra");
export const ESCAPADAS=[];
export const COMIDAS=comidas("P");
export const GUIA_COMIDA=[];
export const BARRIOS=[];
export const TRANSPORTE={llegada:"Aeropuerto PRG → centro: bus 119 + metro (~1,5 €, 40 min) o tren Airport Express.",local:local("P")};
export const CONSEJOS=CONSEJOS_DE;
export const TRAMITES={...TRAMITES_DE,pais:"Chequia (espacio Schengen)",moneda:"Corona checa (Kč). Se acepta tarjeta casi en todas partes; evitar casas de cambio callejeras."};
export const PRECAUCION=ZONES["P"]||[];
