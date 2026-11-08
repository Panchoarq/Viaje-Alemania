// Traslados entre las ciudades de Escocia. Clave = ids ordenados alfabéticamente y unidos con «-».
// m: modo (tren, bus, avion, auto, ferri) · min: minutos de estación a estación (o de ruta en auto) · eur: costo aproximado por persona, un tramo · rec: opción recomendada
// Datos aproximados de 2025, sin verificar: confirmar en los sitios de ScotRail, LNER, Citylink o Trainline.
export const TRASLADOS={
 "edimburgo-glasgow":[{m:"tren",min:50,eur:15,rec:1,n:"Cada 15 min desde Waverley; el más cómodo."},{m:"bus",min:75,eur:8,n:"Citylink o Megabus; más barato."},{m:"auto",min:60,eur:0,n:"Unos 75 km por la M8."}],
 "edimburgo-inverness":[{m:"tren",min:210,eur:50,rec:1,n:"Directo o con cambio en Perth; paisaje de las Cairngorms."},{m:"bus",min:225,eur:25,n:"Citylink; más barato."},{m:"auto",min:210,eur:0,n:"Unos 250 km por la A9."}],
 "edimburgo-skye":[{m:"auto",min:330,eur:0,rec:1,n:"Unos 320 km por Glencoe o Fort William; la ruta es parte del paseo."},{m:"bus",min:420,eur:50,n:"Citylink con cambio en Glasgow o Fort William."}],
 "edimburgo-standrews":[{m:"tren",min:80,eur:20,rec:1,n:"Tren a Leuchars (1 h) y bus 99 de 10 min."},{m:"bus",min:105,eur:10,n:"Bus directo Citylink 59 o 99."},{m:"auto",min:80,eur:0,n:"Unos 80 km por el puente del Forth."}],
 "glasgow-inverness":[{m:"bus",min:210,eur:20,rec:1,n:"Citylink directo por Loch Lomond y Glencoe (muy escénico)."},{m:"tren",min:200,eur:50,n:"Con cambio en Perth."},{m:"auto",min:180,eur:0,n:"Unos 270 km por la A82 junto al Loch Ness."}],
 "glasgow-skye":[{m:"auto",min:270,eur:0,rec:1,n:"Unos 320 km por Loch Lomond y Glencoe."},{m:"bus",min:330,eur:40,n:"Citylink hasta Portree, directo (verificar horarios)."}],
 "glasgow-standrews":[{m:"auto",min:105,eur:0,rec:1,n:"Unos 130 km; la mejor opción."},{m:"tren",min:140,eur:25,n:"Con cambio en Edimburgo y bus desde Leuchars."},{m:"bus",min:150,eur:20,n:"Citylink con transbordo."}],
 "inverness-skye":[{m:"auto",min:120,eur:0,rec:1,n:"Unos 170 km por Kyle of Lochalsh y el puente."},{m:"bus",min:150,eur:25,n:"Citylink directo a Portree (verificar horarios)."}],
 "inverness-standrews":[{m:"auto",min:165,eur:0,rec:1,n:"Unos 250 km por la A9 y Perth."},{m:"tren",min:210,eur:35,n:"Con cambio en Perth o Edimburgo y bus desde Leuchars."}],
 "skye-standrews":[{m:"auto",min:330,eur:0,rec:1,n:"Unos 400 km; conviene hacerlo en dos tramos."},{m:"bus",min:480,eur:55,n:"Con dos o más cambios; muy largo."}]
};

// Códigos de aeropuerto (vacío = sin vuelos comerciales útiles) y operadores para los enlaces de búsqueda.
export const AEROPUERTO={edimburgo:"EDI",glasgow:"GLA",inverness:"INV",skye:"",standrews:""};
export const OPERADORES={tren:{n:"ScotRail",u:"https://www.scotrail.co.uk/"},bus:{n:"Citylink",u:"https://www.citylink.co.uk/"}};
