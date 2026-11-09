// Traslados (Alemania). Clave = ids ordenados alfabéticamente y unidos con «-». m: modo · min: minutos · eur: ~por persona, un tramo (0 = depende del auto) · rec: recomendada
// Datos aproximados sin verificar.
export const TRASLADOS={
 "berlin-hamburgo":[{m:"tren",min:105,eur:35,rec:1,n:"ICE directo desde Berlin Hbf, cada hora."},{m:"bus",min:200,eur:15,n:"FlixBus, más barato y más lento."}],
 "berlin-munich":[{m:"tren",min:240,eur:70,rec:1,n:"ICE directo, cada hora; comprar con anticipación."},{m:"avion",min:75,eur:90,n:"BER–MUC; suma ~3 h entre traslados y esperas."},{m:"bus",min:410,eur:30,n:"FlixBus, nocturno o diurno."}],
 "hamburgo-munich":[{m:"tren",min:345,eur:85,rec:1,n:"ICE directo, cada 2 h."},{m:"avion",min:80,eur:90,n:"HAM–MUC; suma esperas."}]
};
export const AEROPUERTO={berlin:"BER",munich:"MUC",hamburgo:"HAM"};
export const OPERADORES={tren:{n:"Deutsche Bahn",u:"https://www.bahn.com/"},bus:{n:"FlixBus",u:"https://www.flixbus.com/"}};
