// Traslados (Francia). Clave = ids ordenados alfabéticamente y unidos con «-». m: modo · min: minutos · eur: ~por persona, un tramo (0 = depende del auto) · rec: recomendada
// Datos aproximados sin verificar.
export const TRASLADOS={
 "londres-paris":[{m:"tren",min:140,eur:100,rec:1,n:"Eurostar directo Gare du Nord ⇄ St Pancras; llegar 90 min antes por los controles."},{m:"avion",min:80,eur:80,n:"CDG–LHR; suma ~3 h entre traslados y esperas."},{m:"bus",min:480,eur:35,n:"FlixBus por el túnel."}],
 "estrasburgo-paris":[{m:"tren",min:110,eur:60,rec:1,n:"TGV directo Gare de l'Est ⇄ Strasbourg, ~1 h 46; reservar antes baja el precio."},{m:"bus",min:285,eur:20,n:"FlixBus o BlaBlaBus; más barato y largo."},{m:"auto",min:300,eur:0,n:"Unos 490 km por la A4."}]
};
export const AEROPUERTO={paris:"CDG",londres:"LHR",estrasburgo:"SXB"};
export const OPERADORES={tren:{n:"SNCF Connect",u:"https://www.sncf-connect.com/"},bus:{n:"FlixBus",u:"https://www.flixbus.com/"}};
