// Paquete de ciudad: Múnich (Alemania). Adaptador de los datos del viaje a Alemania (v2/trips/alemania.data.js).
import {ZONES} from "../../trips/alemania.data.js";
import {ZONAS as Z,atracciones,comidas,local,TRAMITES_DE,CONSEJOS_DE} from "../alemania/_de.js";
export const CIUDAD={id:"munich",n:"Múnich",pais:"alemania",ll:[48.1374,11.5755],geo:", Múnich",moneda:{code:"EUR",sym:"€",eur:1},transit:"transporte público local",idioma:"alemán",verificado:false,fuente:"Datos del viaje a Alemania de la app",
  resumen:"Capital de Baviera: plazas históricas, cervecerías, museos y los Alpes a una hora. Centro caminable.",mejorEpoca:"Mayo–septiembre; Oktoberfest a fines de septiembre; mercados en diciembre.",dias:{ideal:3,minimo:2}};
export const ZONAS=Z;
export const ATRACCIONES=atracciones("M","mun");
export const ESCAPADAS=[];
export const COMIDAS=comidas("M");
export const GUIA_COMIDA=[];
export const BARRIOS=[];
export const TRANSPORTE={llegada:"Aeropuerto MUC → centro: S1/S8 (~14 €, 40 min). Pase de día para el grupo ~20 €.",local:local("M")};
export const CONSEJOS=CONSEJOS_DE;
export const TRAMITES=TRAMITES_DE;
export const PRECAUCION=ZONES["M"]||[];
