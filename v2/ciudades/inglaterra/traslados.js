// Traslados (Inglaterra). Clave = ids ordenados alfabéticamente y unidos con «-». m: modo · min: minutos · eur: ~por persona, un tramo (0 = depende del auto) · rec: recomendada
// Datos aproximados sin verificar.
export const TRASLADOS={
 "londres-paris":[{m:"tren",min:140,eur:100,rec:1,n:"Eurostar directo St Pancras ⇄ Gare du Nord; llegar 90 min antes por los controles."},{m:"avion",min:80,eur:80,n:"LHR–CDG; suma ~3 h entre traslados y esperas."}],
 "edimburgo-londres":[{m:"tren",min:270,eur:90,rec:1,n:"LNER directo King's Cross ⇄ Waverley, cada 30 min."},{m:"avion",min:80,eur:70,n:"LHR/LGW–EDI; suma ~3 h con traslados."}],
 "glasgow-londres":[{m:"tren",min:285,eur:90,rec:1,n:"Avanti West Coast directo Euston ⇄ Central."},{m:"avion",min:80,eur:70,n:"LHR/LGW–GLA; suma ~3 h con traslados."}],
 "dublin-londres":[{m:"avion",min:85,eur:70,rec:1,n:"DUB–LHR/LGW; controles de pasaporte, llegar 2 h antes."},{m:"bus",min:600,eur:60,n:"Bus + ferry por Holyhead; muy largo."}],
 "belfast-londres":[{m:"avion",min:85,eur:70,rec:1,n:"BFS/BHD–LHR/LGW; vuelos frecuentes."}]
};
export const AEROPUERTO={londres:"LHR",paris:"CDG"};
export const OPERADORES={tren:{n:"National Rail",u:"https://www.nationalrail.co.uk/"},bus:{n:"National Express",u:"https://www.nationalexpress.com/"}};
