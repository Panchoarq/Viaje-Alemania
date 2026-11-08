// Traslados entre las ciudades de Irlanda. Clave = ids ordenados alfabéticamente y unidos con «-».
// m: modo · min: minutos · eur: costo aproximado por persona, un tramo (0 = depende del auto) · rec: recomendada
// Datos aproximados de 2025, sin verificar: confirmar en Irish Rail, Bus Éireann, GoBus o Translink (Belfast).
export const TRASLADOS={
 "dublin-galway":[{m:"tren",min:140,eur:25,rec:1,n:"Irish Rail desde Heuston, cada 2 h."},{m:"bus",min:150,eur:15,n:"Citylink o GoBus, muy frecuente y barato."},{m:"auto",min:135,eur:0,n:"Unos 210 km por la M6."}],
 "cork-dublin":[{m:"tren",min:150,eur:35,rec:1,n:"Irish Rail directo, cada hora."},{m:"bus",min:180,eur:20,n:"Bus Éireann o GoBus."},{m:"auto",min:160,eur:0,n:"Unos 255 km por la M8."}],
 "dublin-killarney":[{m:"auto",min:220,eur:0,rec:1,n:"Unos 300 km; permite parar en Cashel o Blarney."},{m:"tren",min:220,eur:45,n:"Con cambio en Mallow."},{m:"bus",min:300,eur:25,n:"Bus Éireann Expressway."}],
 "belfast-dublin":[{m:"tren",min:120,eur:25,rec:1,n:"Enterprise, cada hora, sin controles."},{m:"bus",min:135,eur:18,n:"Aircoach o Translink, más barato."},{m:"auto",min:110,eur:0,n:"Unos 165 km por la M1."}],
 "cork-galway":[{m:"bus",min:210,eur:25,rec:1,n:"Bus Éireann o GoBus por Limerick; no hay tren directo."},{m:"auto",min:180,eur:0,n:"Unos 210 km por la M20 y la M18."}],
 "galway-killarney":[{m:"auto",min:195,eur:0,rec:1,n:"Unos 230 km por Limerick o por la costa de Clare."},{m:"bus",min:240,eur:30,n:"Con cambio en Limerick."}],
 "belfast-galway":[{m:"bus",min:270,eur:30,rec:1,n:"Translink o GoBus, con cambio en Dublín."},{m:"auto",min:210,eur:0,n:"Unos 280 km."},{m:"tren",min:270,eur:50,n:"Vía Dublín."}],
 "cork-killarney":[{m:"bus",min:105,eur:15,rec:1,n:"Bus Éireann directo."},{m:"tren",min:105,eur:20,n:"Tren a Mallow y a Killarney."},{m:"auto",min:80,eur:0,n:"Unos 90 km por la N22."}],
 "belfast-cork":[{m:"auto",min:285,eur:0,rec:1,n:"Unos 440 km por la M1 y M8."},{m:"tren",min:300,eur:70,n:"Vía Dublín, con cambio."},{m:"bus",min:360,eur:50,n:"Con transbordo en Dublín."}],
 "belfast-killarney":[{m:"auto",min:360,eur:0,rec:1,n:"Unos 530 km; mejor en dos tramos."},{m:"bus",min:450,eur:45,n:"Dos o más cambios; muy largo."}]
};
