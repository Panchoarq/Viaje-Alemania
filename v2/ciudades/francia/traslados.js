// Traslados (Francia). Clave = ids ordenados alfabéticamente y unidos con «-». m: modo · min: minutos · eur: ~por persona, un tramo (0 = depende del auto) · rec: recomendada
// Datos aproximados sin verificar.
export const TRASLADOS={
 "londres-paris":[{m:"tren",min:140,eur:100,rec:1,n:"Eurostar directo Gare du Nord ⇄ St Pancras; llegar 90 min antes por los controles."},{m:"avion",min:80,eur:80,n:"CDG–LHR; suma ~3 h entre traslados y esperas."},{m:"bus",min:480,eur:35,n:"FlixBus por el túnel."}]
};
export const AEROPUERTO={paris:"CDG",londres:"LHR"};
export const OPERADORES={tren:{n:"SNCF Connect",u:"https://www.sncf-connect.com/"},bus:{n:"FlixBus",u:"https://www.flixbus.com/"}};
