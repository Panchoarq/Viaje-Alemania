// Traslados (Chequia). Clave = ids ordenados alfabéticamente y unidos con «-». m: modo · min: minutos · eur: ~por persona, un tramo (0 = depende del auto) · rec: recomendada
// Datos aproximados sin verificar.
export const TRASLADOS={
 "berlin-praga":[{m:"tren",min:260,eur:35,rec:1,n:"EuroCity directo por el valle del Elba (muy escénico), varios al día."},{m:"bus",min:270,eur:15,n:"FlixBus."}],
 "munich-praga":[{m:"bus",min:290,eur:25,rec:1,n:"FlixBus directo o tren con cambio."},{m:"tren",min:330,eur:45,n:"Con cambio en Núremberg o Pilsen."}],
 "hamburgo-praga":[{m:"tren",min:420,eur:70,rec:1,n:"Con un cambio en Berlín."},{m:"avion",min:85,eur:70,n:"HAM–PRG; suma esperas."}]
};
export const AEROPUERTO={praga:"PRG",berlin:"BER",munich:"MUC",hamburgo:"HAM"};
export const OPERADORES={tren:{n:"České dráhy",u:"https://www.cd.cz/"},bus:{n:"FlixBus",u:"https://www.flixbus.com/"}};
