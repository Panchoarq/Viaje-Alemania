// Traslados entre las ciudades de Corea del Sur. Clave = ids ordenados alfabéticamente y unidos con «-».
// m: modo · min: minutos · eur: costo aproximado por persona, un tramo (~1.500 ₩/€) · rec: recomendada
// Datos aproximados de 2025, sin verificar: confirmar en Korail (KTX), Korean Air, Jeju Air u otras aerolíneas.
export const TRASLADOS={
 "busan-seul":[{m:"tren",min:150,eur:42,rec:1,n:"KTX desde la estación de Seúl, cada 20–30 min; céntrico y puntual."},{m:"avion",min:70,eur:55,n:"Gimpo → Gimhae; más rápido, pero suma traslados y esperas (~3 h en total)."},{m:"bus",min:270,eur:25,n:"Bus exprés desde la terminal de Seúl; más barato y lento."}],
 "gyeongju-seul":[{m:"tren",min:130,eur:35,rec:1,n:"KTX a Singyeongju; luego bus 700 al centro (20 min)."},{m:"bus",min:240,eur:20,n:"Bus exprés directo."}],
 "jeju-seul":[{m:"avion",min:70,eur:55,rec:1,n:"Gimpo ⇄ Jeju, unos 150 vuelos al día; reservar con anticipación."}],
 "busan-gyeongju":[{m:"tren",min:35,eur:7,rec:1,n:"KTX a Singyeongju; luego bus al centro."},{m:"bus",min:60,eur:5,n:"Bus directo."}],
 "busan-jeju":[{m:"avion",min:65,eur:45,rec:1,n:"Gimhae ⇄ Jeju; no conviene el ferri (muy largo)."}],
 "gyeongju-jeju":[{m:"avion",min:240,eur:60,rec:1,n:"Bus o tren a Busan (1 h) y vuelo a Jeju; no hay vuelo directo."}]
};
