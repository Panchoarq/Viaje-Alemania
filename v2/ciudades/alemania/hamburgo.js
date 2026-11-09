// Paquete de ciudad: Hamburgo (Alemania). Adaptador de los datos del viaje a Alemania (v2/trips/alemania.data.js).
import {ZONES} from "../../trips/alemania.data.js";
import {ZONAS as Z,atracciones,comidas,local,TRAMITES_DE,CONSEJOS_DE} from "../alemania/_de.js";
export const CIUDAD={id:"hamburgo",n:"Hamburgo",pais:"alemania",ll:[53.5511,9.9937],geo:", Hamburgo",moneda:{code:"EUR",sym:"€",eur:1},transit:"transporte público local",idioma:"alemán",verificado:false,fuente:"Datos del viaje a Alemania de la app",
  resumen:"Ciudad portuaria de canales, almacenes de ladrillo, música y museos. Se recorre en metro, S-Bahn y ferris del puerto.",mejorEpoca:"Mayo–septiembre; clima fresco y lluvioso casi todo el año.",dias:{ideal:3,minimo:2}};
export const ZONAS=Z;
export const ATRACCIONES=atracciones("H","ham");
export const ESCAPADAS=[];
export const COMIDAS=comidas("H");
export const GUIA_COMIDA=[];
export const BARRIOS=[];
export const TRANSPORTE={llegada:"Aeropuerto HAM → centro: S1 (~4 €, 25 min).",local:local("H")};
export const CONSEJOS=CONSEJOS_DE;
export const TRAMITES=TRAMITES_DE;
export const PRECAUCION=ZONES["H"]||[];
