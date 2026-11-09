// Paquete de ciudad: Berlín (Alemania). Adaptador de los datos del viaje a Alemania (v2/trips/alemania.data.js).
import {ZONAS as Z,atracciones,comidas,local,TRAMITES_DE,CONSEJOS_DE} from "../alemania/_de.js";
export const CIUDAD={id:"berlin",n:"Berlín",pais:"alemania",ll:[52.5200,13.4050],geo:", Berlín",moneda:{code:"EUR",sym:"€",eur:1},transit:"transporte público local",idioma:"alemán",verificado:false,fuente:"Datos del viaje a Alemania de la app",
  resumen:"Historia del siglo XX a cada paso, museos, arte callejero y vida nocturna. Muy extensa: usar U-Bahn y S-Bahn.",mejorEpoca:"Mayo–septiembre; diciembre por los mercados navideños.",dias:{ideal:4,minimo:3}};
export const ZONAS=Z;
export const ATRACCIONES=atracciones("B","ber");
export const ESCAPADAS=[];
export const COMIDAS=comidas("B");
export const GUIA_COMIDA=[];
export const BARRIOS=[];
export const TRANSPORTE={llegada:"Aeropuerto BER → centro: tren FEX/RE (~4 €, 30 min). Pase de día AB ~9 €.",local:local("B")};
export const CONSEJOS=CONSEJOS_DE;
export const TRAMITES=TRAMITES_DE;
