// Boletos, pases y consejos de transporte por ciudad (investigados con búsqueda web; verificar en el operador antes de comprar).
export const TRANSPORTE_DATOS={
 "berlin": {
  "operador": "BVG · VBB",
  "llegada": "Desde el aeropuerto BER, el Flughafen-Express (FEX) y la S-Bahn llegan al centro (Hauptbahnhof) en unos 25–35 minutos con un boleto ABC (5,00 € el sencillo en 2026), porque BER está en la zona C.",
  "local": "Metro (U-Bahn), S-Bahn, tranvía y bus comparten tarifa y boleto; el centro turístico cae casi todo en zona AB. No hay torniquetes: hay que validar el boleto y los controles son frecuentes.",
  "tarifas": [
   [
    "Boleto sencillo zona AB (2 horas)",
    "4,00 €"
   ],
   [
    "Boleto sencillo zona ABC (incluye aeropuerto BER)",
    "5,00 €"
   ],
   [
    "Kurzstrecke (trayecto corto, 3 paradas en metro/S-Bahn)",
    "2,80 €"
   ],
   [
    "4 viajes zona AB (precio total, 3,10 € por viaje)",
    "12,40 €"
   ],
   [
    "Pase 24 horas AB",
    "11,20 €"
   ],
   [
    "Pase 24 horas ABC",
    "12,90 €"
   ],
   [
    "Pase 7 días",
    "Ya no existe desde 2026"
   ],
   [
    "Deutschlandticket (mensual, todo el país en transporte regional)",
    "63 € al mes (verificar)"
   ],
   [
    "Multa por viajar sin boleto válido",
    "60 € (verificar)"
   ]
  ],
  "pases": [
   {
    "t": "Boleto sencillo AB · 4,00 €",
    "p": "Vale 2 horas desde que se valida, en cualquier medio de la red (metro, S-Bahn, tranvía, bus), con transbordos en un sentido de viaje; no sirve para ida y vuelta. Conviene si harás solo uno o dos viajes al día. Se compra en la app BVG Fahrinfo, en máquinas de las estaciones o con el conductor del bus o tranvía; el de papel hay que validar en el sello amarillo antes de subir.",
    "u": "https://www.bvg.de/en/tickets-and-fares"
   },
   {
    "t": "Kurzstrecke · 2,80 €",
    "p": "Trayecto corto: hasta 3 paradas en metro o S-Bahn, o 6 en bus y tranvía, sin cambiar de línea en el caso del metro. Sirve para saltos cortos entre dos o tres paradas. Se compra en máquinas o en la app.",
    "u": "https://www.vbb.de/news/neue-fahrpreise-im-vbb-zum-1-januar-2026/"
   },
   {
    "t": "Boleto 4 viajes AB · 12,40 €",
    "p": "Cuatro viajes sencillos a 3,10 € cada uno; ahorra 90 céntimos por viaje frente al boleto suelto. Es un solo boleto que se puede compartir entre varias personas si se valida una vez por viaje y persona. Conviene para dos viajeros que harán dos viajes cada uno.",
    "u": "https://www.vbb.de/news/neue-fahrpreise-im-vbb-zum-1-januar-2026/"
   },
   {
    "t": "Pase 24 horas AB · 11,20 €",
    "p": "Viajes ilimitados durante 24 horas desde la validación en la zona AB. Se paga solo si harás 3 o más viajes en el día, pues tres sencillos ya suman 12 €. Se compra en la app o en máquinas; ABC cuesta 12,90 €.",
    "u": "https://www.vbb.de/news/neue-fahrpreise-im-vbb-zum-1-januar-2026/"
   },
   {
    "t": "Pase de 7 días · desaparece en 2026",
    "p": "El pase de 7 días ya no se vende desde 2026 según el VBB; los boletos antiguos sin usar valieron hasta el 30 de junio de 2026. Para una semana, combina pases de 24 horas con boletos de 4 viajes, o compra el Deutschlandticket mensual (63 €, verificar precio) si te quedas varios días.",
    "u": "https://www.vbb.de/news/neue-fahrpreise-im-vbb-zum-1-januar-2026/"
   },
   {
    "t": "Deutschlandticket · 63 € al mes (verificar)",
    "p": "Suscripción mensual, personal y cancelable, válida en todo el transporte local y regional de Alemania, no en trenes ICE/IC. Solo conviene si pasas bastantes días en la ciudad o recorres varias regiones; se compra en la app de BVG, de DB Navigator o de cualquier operador local.",
    "u": "https://www.bvg.de/en/tickets-and-fares"
   }
  ],
  "consejos": [
   "Valida siempre el boleto de papel antes de subir; sin validar cuenta como viajar sin boleto y la multa suele ser de 60 € (verificar). Los boletos de la app ya vienen activados.",
   "Si te alojas fuera del centro histórico (Mitte, Kreuzberg, Prenzlauer Berg), un pase AB cubre todo; solo necesitas ABC para el aeropuerto BER o Potsdam. No pagues ABC para moverte dentro de la ciudad."
  ],
  "trenes": "Desde Berlín Hbf salen trenes de Deutsche Bahn (bahn.de y app DB Navigator) a Hamburgo (cerca de 1 h 45 min), Múnich (4 h) y Praga (4 h 15 min aprox.). Las tarifas Sparpreis salen más baratas cuanto antes se compra, y el Super Sparpreis suele dar el mejor precio.",
  "fuentes": [
   "https://www.vbb.de/news/neue-fahrpreise-im-vbb-zum-1-januar-2026/",
   "https://www.bvg.de/de/tickets-und-tarife/tarifaenderungen",
   "https://www.vbb.de/ber",
   "https://www.berlin.de/aktuelles/10659631-958090-vbb-erhoeht-ticketpreise-ab-2027-berlin-.html"
  ],
  "dudas": [
   "Precio exacto del Deutschlandticket 2026 (63 € según muenchen.de) no confirmado en fuente BVG.",
   "Importe de la multa por no tener boleto (60 €) no confirmado en una fuente de 2026.",
   "Duración exacta del FEX a Hauptbahnhof: las fuentes dan 23 a 33 minutos.",
   "En 2027 sube el pase de 24 horas AB a 11,50 € (según VBB); el sencillo sigue en 4,00 €."
  ]
 },
 "hamburgo": {
  "operador": "hvv (Hamburger Verkehrsverbund)",
  "llegada": "Del aeropuerto al centro va la S-Bahn S1 hasta Hauptbahnhof en unos 25 minutos; el boleto Hamburg AB (4,10 € en 2026) ya incluye el aeropuerto.",
  "local": "S-Bahn, U-Bahn, buses y los ferris del puerto (línea 62, parte de la red hvv) comparten tarifa. Hamburgo es compacta: casi todo lo turístico cae en zona AB.",
  "tarifas": [
   [
    "Boleto sencillo Hamburg AB (en máquina)",
    "4,10 €"
   ],
   [
    "Boleto sencillo Hamburg AB (en la app hvv, descuento online de unos 7 %)",
    "unos 3,81 € (verificar)"
   ],
   [
    "Pase día Hamburg AB (hasta las 6 de la mañana siguiente)",
    "8,20 €"
   ],
   [
    "Pase día grupo Hamburg AB (hasta 5 personas)",
    "16,40 €"
   ],
   [
    "Boleto niño sencillo (6–14 años)",
    "1,50 € (verificar)"
   ],
   [
    "Pase día niño",
    "3,00 € (verificar)"
   ],
   [
    "Pase 9-Uhr (válido desde las 9)",
    "Eliminado desde enero 2026"
   ],
   [
    "Multa por viajar sin boleto",
    "60 € (verificar)"
   ]
  ],
  "pases": [
   {
    "t": "Boleto sencillo Hamburg AB · 4,10 €",
    "p": "Vale para un viaje en la zona AB, con transbordos dentro del mismo sentido, en metro, S-Bahn, bus y ferri de la red; el aeropuerto está incluido. Conviene para uno o dos viajes en el día. Se compra en máquinas, en la app hvv o con el conductor del bus.",
    "u": "https://www.hvv.de/en"
   },
   {
    "t": "Pase día AB · 8,20 €",
    "p": "Viajes ilimitados en la zona AB hasta las 6 de la mañana del día siguiente. Compensa desde 3 viajes. Se compra en la app hvv, máquinas o puntos de venta. La versión de grupo cuesta 16,40 € para hasta 5 personas, ideal para familias.",
    "u": "https://www.hvv.de/en"
   },
   {
    "t": "Ferri línea 62 (parte de la red hvv)",
    "p": "Los ferris de la línea 62 recorren el puerto desde Landungsbrücken y están incluidos en el boleto hvv. Es la forma más barata de ver el puerto y la Elbphilharmonie desde el agua, sin pagar una excursión turística.",
    "u": "https://www.hvv.de/en"
   },
   {
    "t": "Hamburg CARD · conviene solo si usas mucho los museos",
    "p": "Combina transporte y descuentos en museos y excursiones. Conviene solo si tienes prevista una agenda muy cargada de actividades con descuento; para viajar solo en transporte, el pase día es más barato. Precios actuales: verificar en Hamburg Tourismus.",
    "u": "https://www.hamburg-tourism.de/"
   }
  ],
  "consejos": [
   "Compra el boleto en la app hvv: sale cerca de un 7 % más barato que en máquina y no hay que validar nada.",
   "Si el boleto es de papel o de máquina, valídalo antes de subir al metro o bus; sin validar es multa. Casi todo lo turístico, incluido el aeropuerto, está en zona AB, así que no compres boletos de más zonas."
  ],
  "trenes": "Desde Hamburgo Hbf salen trenes DB a Berlín (hacia 1 h 45 min), Múnich y otras ciudades; compra en bahn.de o en la app DB Navigator, con tarifas Sparpreis anticipadas. Para viajes cortos regionales, el Deutschlandticket cubre trenes regionales.",
  "fuentes": [
   "https://www.hamburg-tourism.de/app/hamburg-card-buchung/",
   "https://www.hvv.de/resource/blob/153742/b92fe2832ff6a542c0ab00926d92b1a4/PM251028_Tarifanpassung.pdf",
   "https://ubahnhamburg.com/en/tickets-and-prices/",
   "https://dt5online.de/2025/10/28/hvv-tariferhoehung-2026-keine-erhoehung-des-sozialrabatts/"
  ],
  "dudas": [
   "Precios exactos de 2026 tomados de sitios de terceros (ubahnhamburg.com, dt5online.de), no de hvv.de directamente: confirmar antes de viajar.",
   "Precio del boleto Gesamtbereich (anillos ABCDE) no confirmado.",
   "Importe actual de la Hamburg CARD no confirmado.",
   "Multa por no tener boleto (60 €) no verificada en fuente de 2026."
  ]
 },
 "munich": {
  "operador": "MVV · MVG · S-Bahn München",
  "llegada": "Del aeropuerto al centro van las S-Bahn S1 y S8 hasta Marienplatz en unos 35–40 minutos, cada 10 minutos entre las dos líneas; el aeropuerto está en la zona 5, por lo que hay que comprar un boleto M–5 (por ejemplo el Airport-City-Day-Ticket).",
  "local": "Metro (U-Bahn), tranvía, bus y S-Bahn comparten tarifa por zonas (MVV); el centro turístico está en la zona M. La app MVG vende todos los boletos.",
  "tarifas": [
   [
    "Boleto sencillo zona M",
    "4,20 €"
   ],
   [
    "Kurzstrecke (trayecto corto)",
    "2,10 €"
   ],
   [
    "Tira de boletos (Streifenkarte, 10 rayas)",
    "18,70 €"
   ],
   [
    "Single-Tageskarte zona M (24 horas hasta las 6 de la mañana)",
    "10,10 €"
   ],
   [
    "Gruppen-Tageskarte M–5 (2 a 5 personas, incluye aeropuerto)",
    "32,60 €"
   ],
   [
    "Gruppen-Tageskarte zona M (2 a 5 personas)",
    "19,70 €"
   ],
   [
    "Airport-City-Day-Ticket Single M–5",
    "16,30 € (verificar)"
   ],
   [
    "Pase día niño",
    "3,80 €"
   ],
   [
    "Deutschlandticket",
    "63 € al mes"
   ],
   [
    "Multa por viajar sin boleto",
    "60 € (verificar)"
   ]
  ],
  "pases": [
   {
    "t": "Boleto sencillo zona M · 4,20 €",
    "p": "Cubre un viaje dentro de la zona M, que abarca la ciudad. Es la opción si harás uno o dos viajes en el día. Se compra en la app MVG, en máquinas de las estaciones o a los conductores de tranvía y bus.",
    "u": "https://www.muenchen.de/verkehr/aktuell/mvv-tickets-aktuelle-preise-fuer-fahrkarten-muenchen"
   },
   {
    "t": "Single-Tageskarte zona M · 10,10 €",
    "p": "Viajes ilimitados hasta las 6 de la mañana del día siguiente dentro de la zona M. Compensa desde 3 viajes. Desde enero de 2026 los niños de 6 a 14 años pueden viajar gratis con este pase (verificar condiciones).",
    "u": "https://www.mvv-muenchen.de/tickets-preise/tickets-tageskarten/single-tageskarte/index.html"
   },
   {
    "t": "Gruppen-Tageskarte · desde 19,70 €",
    "p": "Para 2 a 5 personas, hasta las 6 de la mañana siguiente. Para la zona M cuesta 19,70 €; M–5 con el aeropuerto cuesta 32,60 €. A partir de tres personas es casi siempre la opción más barata.",
    "u": "https://www.muenchen.de/verkehr/aktuell/mvv-tickets-aktuelle-preise-fuer-fahrkarten-muenchen"
   },
   {
    "t": "Airport-City-Day-Ticket · unos 16 € (verificar)",
    "p": "Pase de un día para toda la zona M–5, incluyendo el viaje al aeropuerto, desde el momento de compra hasta las 6 de la mañana siguiente. Es equivalente a una Tageskarte M–5 normal. Conviene el día de llegada o de salida si tambien usarás el transporte urbano; una sola fecha de viaje simple al aeropuerto sale mejor con boleto sencillo.",
    "u": "https://www.mvv-muenchen.de/tickets-abos-preise/airport-city-day-ticket"
   },
   {
    "t": "Streifenkarte · 18,70 €",
    "p": "Tira de 10 rayas que se valida (se sellan rayas según las zonas) y se comparte entre varios viajeros. Útil para un grupo de dos que hace pocos viajes, aunque con la app MVG suele salir mejor un boleto sencillo o un pase día.",
    "u": "https://www.muenchen.de/verkehr/aktuell/mvv-tickets-aktuelle-preise-fuer-fahrkarten-muenchen"
   }
  ],
  "consejos": [
   "No existe pase semanal para turistas muy barato: la Wochenkarte (23,80 €) es personal y semanal; para una estancia larga puede compensar frente a varios pases día.",
   "Los boletos de papel se validan en los sellos azules antes de bajar al andén; los de la app MVG no necesitan sello. Hay controles frecuentes."
  ],
  "trenes": "Desde Múnich Hbf salen trenes DB a Berlín (unas 4 h), Núremberg, Fráncfort y Salzburgo (cerca de 1 h 30 min), y el Bayern-Ticket permite viajar por Baviera en tren regional con precio de grupo. Compra en bahn.de o en la app DB Navigator.",
  "fuentes": [
   "https://www.muenchen.de/verkehr/aktuell/mvv-tickets-aktuelle-preise-fuer-fahrkarten-muenchen",
   "https://www.mvv-muenchen.de/tickets-abos-preise/airport-city-day-ticket",
   "https://www.mvv-muenchen.de/tickets-preise/tickets-tageskarten/single-tageskarte/index.html"
  ],
  "dudas": [
   "Precio exacto del Airport-City-Day-Ticket 2026 y del boleto sencillo a zona M–5: no leídos en la web oficial del MVV; el 16,30 € viene de una página de Deutsche Bahn.",
   "Multa por viajar sin boleto: 60 € es la cifra habitual, no confirmada en fuente de 2026.",
   "Condiciones exactas de la gratuidad infantil en la Single-Tageskarte."
  ]
 },
 "praga": {
  "operador": "PID · DPP (Dopravní podnik hl. m. Prahy)",
  "llegada": "Del aeropuerto Václav Havel se llega al centro con un bus urbano hasta la estación de metro Nádraží Veleslavín (línea A del metro) en unos 15–20 minutos y 45–60 minutos en total hasta el centro; con boleto de 90 minutos (46 Kč en la app). El bus AE exprés a Hlavní nádraží cuesta 200 Kč (verificar).",
  "local": "Metro, tranvía y bus comparten un mismo boleto por tiempo (30 min, 90 min, 24 h, 72 h) que vale en toda la ciudad. El centro histórico se recorre bien a pie; el tranvía 22 es el más turístico.",
  "tarifas": [
   [
    "Boleto 30 minutos (app PID Lítačka)",
    "36 Kč"
   ],
   [
    "Boleto 30 minutos (papel)",
    "39 Kč"
   ],
   [
    "Boleto 90 minutos (app PID Lítačka)",
    "46 Kč"
   ],
   [
    "Boleto 90 minutos (papel)",
    "50 Kč"
   ],
   [
    "Pase 24 horas (app)",
    "140 Kč"
   ],
   [
    "Pase 24 horas (papel)",
    "150 Kč"
   ],
   [
    "Pase 72 horas (app)",
    "340 Kč"
   ],
   [
    "Pase 72 horas (papel)",
    "350 Kč"
   ],
   [
    "Bus AE aeropuerto–Hlavní nádraží",
    "200 Kč (verificar)"
   ],
   [
    "Multa por no tener boleto válido",
    "1.200 Kč en el acto; 1.500 Kč en 15 días; 2.000 Kč después"
   ]
  ],
  "pases": [
   {
    "t": "Boleto 30 minutos · 36 Kč (app)",
    "p": "Sirve para un trayecto corto en el centro, con transbordos si se hacen dentro de los 30 minutos. Conviene para uno o dos saltos cortos. Se compra en la app PID Lítačka (más barata), en máquinas o con SMS (42 Kč); el de papel se marca en la máquina amarilla antes de usarlo.",
    "u": "https://pid.cz/neplatvicnezmusis/"
   },
   {
    "t": "Boleto 90 minutos · 46 Kč (app)",
    "p": "Vale 90 minutos con transbordos libres en metro, tranvía y bus de la capital. Es el boleto más útil para un trayecto largo o desde el aeropuerto (confirmar que incluye la zona 0 del aeropuerto, verificar). Se compra en la app, en máquinas o por SMS (55 Kč); el SMS no vale en trenes ni en el bus AE.",
    "u": "https://pid.cz/neplatvicnezmusis/"
   },
   {
    "t": "Pase 24 horas · 140 Kč (app)",
    "p": "Viajes ilimitados por 24 horas desde que se activa; sale a cuenta con 4 o 5 boletos de 30 minutos en el día. Se compra en la app (más barato), en máquinas o puntos de venta del DPP.",
    "u": "https://pid.cz/neplatvicnezmusis/"
   },
   {
    "t": "Pase 72 horas · 340 Kč (app)",
    "p": "Tres días de viajes ilimitados; es la mejor opción para una estancia de 3 a 4 días con uso diario del transporte. Una fuente periodística da 250 Kč para el de papel, pero la tabla oficial de PID dice 350 Kč.",
    "u": "https://pid.cz/neplatvicnezmusis/"
   },
   {
    "t": "Bus AE exprés · 200 Kč (verificar)",
    "p": "Línea directa del aeropuerto a la estación central Hlavní nádraží, con boleto propio (niños de 6–15 años, 100 Kč). Conviene solo con maletas pesadas y sin ganas de hacer transbordo en el metro; el bus urbano con metro es mucho más barato.",
    "u": "https://pid.cz/neplatvicnezmusis/"
   }
  ],
  "consejos": [
   "Los boletos electrónicos de la app y los de SMS deben activarse antes de subir; los de papel se marcan en las máquinas amarillas de la entrada del metro o dentro del tranvía. Un boleto sin marcar es un boleto inválido y puede costar una multa de 1.200 Kč.",
   "La app PID Lítačka sale más barata que el papel o el SMS desde 2026; descárgala antes de viajar. Para ahorrar con 24 horas, compensa a partir de tres o cuatro viajes."
  ],
  "trenes": "Desde Praga hlavní nádraží salen trenes de České dráhy (cd.cz) a Berlín (4 h 15 min aprox.), Dresde, Viena y Budapest; RegioJet y Leo Express son alternativas privadas con precios competitivos que se compran online.",
  "fuentes": [
   "https://pid.cz/neplatvicnezmusis/",
   "https://pid.cz/praha-schvalila-upravu-tarifu-pid-od-ledna-2026/",
   "https://www.helloprague.net/?p=2388",
   "https://www.viewfromprague.com/getting-from-prague-airport/"
  ],
  "dudas": [
   "El trolebús 59 y el bus 119 se mencionan ambos hacia Nádraží Veleslavín; confirmar la línea vigente en dpp.cz.",
   "No se confirmó que el boleto de 90 minutos cubra la zona 0 del aeropuerto desde 2026.",
   "Precio actual del bus AE (200 Kč) tomado de una sola fuente; confirmar.",
   "Duración exacta aeropuerto–centro, las fuentes dan 45 a 60 minutos."
  ]
 },
 "estrasburgo": {
  "operador": "CTS (Compagnie des Transports Strasbourgeois)",
  "llegada": "Desde el aeropuerto de Entzheim hay un tren regional corto a la estación central, de unos 10 a 15 minutos; la estación está en el centro (conviene verificar horarios en ter.sncf.com). Si llegas en TGV, la Gare Centrale está conectada con el tranvía A y D.",
  "local": "Cinco líneas de tranvía y varias de bus cubren la ciudad, pero el centro histórico (Grande Île, Petite France, catedral) se recorre a pie. Se usa tarjeta sin contacto recargable o la app de la CTS.",
  "tarifas": [
   [
    "Boleto sencillo (1 viaje, tarjeta sin contacto recargada)",
    "unos 2,10 € (verificar 2026)"
   ],
   [
    "Aller simple pagando con tarjeta bancaria sin contacto",
    "unos 2,10 € (verificar)"
   ],
   [
    "Billete de 10 viajes (en tarjeta)",
    "unos 17,30 € (julio 2025, verificar 2026)"
   ],
   [
    "Pass 24h Solo",
    "4,60 €"
   ],
   [
    "Pass 24h Trio (2 o 3 personas)",
    "unos 10,40 € (julio 2025, verificar)"
   ],
   [
    "Pass 72h Solo",
    "10,20 €"
   ],
   [
    "Multa a bordo por no tener boleto",
    "verificar (49 € en 2014)"
   ]
  ],
  "pases": [
   {
    "t": "Boleto sencillo (1 viaje) · unos 2,10 €",
    "p": "Un viaje con transbordos durante 1 hora, en tranvía y bus. Se compra en máquinas en las paradas, en la app de la CTS o pagando con tarjeta sin contacto en la validadora. Conviene para uno o dos viajes en el día; el precio exacto de 2026 debe verificarse.",
    "u": "https://www.cts-strasbourg.eu/en/online-store/fares/tickets"
   },
   {
    "t": "Pass 24h Solo · 4,60 €",
    "p": "Viajes ilimitados en bus y tranvía de la CTS durante 24 horas desde la primera validación. Compensa desde 3 viajes en el día. Se carga en una tarjeta sin contacto o en la app, y se valida al subir a cada vehículo.",
    "u": "https://cts-strasbourg.eu/export/sites/default/pdf/04SeDeplacer/CTS_ANG_GUIDE_VOYAGEUR_Janvier-2026_web.pdf"
   },
   {
    "t": "Pass 24h Trio · unos 10 €",
    "p": "Una sola tarjeta sin contacto para 2 o 3 personas durante 24 horas; sale más barato que tres Pass Solo (13,80 €). Conviene para grupos pequeños. Precio 2026 por verificar.",
    "u": "https://www.cts-strasbourg.eu/en/online-store/fares/tickets"
   },
   {
    "t": "Pass 72h Solo · 10,20 €",
    "p": "Tres días de viajes ilimitados para una persona en la red CTS. Es la mejor opción para una estancia de 3 días con uso diario del tranvía; cuesta menos que tres Pass 24h (13,80 €). Se recarga en la tarjeta sin contacto o en la app.",
    "u": "https://cts-strasbourg.eu/export/sites/default/pdf/04SeDeplacer/CTS_ANG_GUIDE_VOYAGEUR_Janvier-2026_web.pdf"
   }
  ],
  "consejos": [
   "Hay que validar en cada subida, incluso con transbordo y con un pase de 24 o 72 horas; el pase se activa en la primera validación. Un viajero sin validar puede recibir multa aunque tenga boleto.",
   "El centro histórico es muy pequeño y peatonal: muchos visitantes solo usan el tranvía para llegar desde la estación o para ir al Parlamento Europeo. Un Pass 24h basta casi siempre."
  ],
  "trenes": "Desde la Gare de Strasbourg salen TGV a París (unas 1 h 50 min) y trenes TER a Colmar, Basilea, Karlsruhe y Offenburg; compra en sncf-connect.com o la app SNCF Connect; los TER de Alsacia tienen tarifas con descuento para grupos y fines de semana.",
  "fuentes": [
   "https://www.cts-strasbourg.eu/en/online-store/fares/tickets",
   "https://cts-strasbourg.eu/export/sites/default/pdf/04SeDeplacer/CTS_ANG_GUIDE_VOYAGEUR_Janvier-2026_web.pdf",
   "https://cts-strasbourg.eu/pdf/05BoutiqueEnLigne/Tarifs/3-volets_PRO_juillet-2025-RVB.pdf",
   "https://www.cec-zev.eu/de/themen/reisen/zug-nahverkehr/nahverkehr-strassburg/"
  ],
  "dudas": [
   "Precio del boleto sencillo 2026 no confirmado (2024: 2,50 € en papel y 2,10 € cargado en tarjeta).",
   "Precio Pass 24h Trio y billete de 10 viajes de 2026 no confirmados.",
   "Importe de la multa por no tener boleto en 2026 no encontrado.",
   "Conexión ferroviaria aeropuerto Entzheim–Gare Centrale (tiempo y precio) no verificada en fuente oficial."
  ]
 },
 "edimburgo": {
  "operador": "Lothian Buses · Edinburgh Trams · ScotRail",
  "llegada": "Desde el aeropuerto al centro: tranvía (unos 35 min hasta Princes Street, precio sencillo aeropuerto 8,50 £ según guías, verificar en edinburghtrams.com) o bus Airlink 100 (unos 30 min hasta Waverley, 6,00 £ sencillo, 8,50 £ ida y vuelta abierta, 2026 según Lothian).",
  "local": "El centro es muy caminable; para el resto sirven los buses de Lothian y el tranvía, que se pagan con tarjeta sin contacto o con la app Bus & Tram. No hay metro.",
  "tarifas": [
   [
    "Bus Lothian sencillo adulto (desde 22 feb 2026)",
    "2,40 £"
   ],
   [
    "Bus nocturno sencillo",
    "3,50 £"
   ],
   [
    "City DAY (buses y tranvía en la ciudad)",
    "6,00 £ (5,70 £ con tarjeta sin contacto)"
   ],
   [
    "City LATE (de 18:00 a 4:30)",
    "5,50 £"
   ],
   [
    "City WEEK con tope sin contacto (lunes a domingo)",
    "26,50 £"
   ],
   [
    "Airlink aeropuerto sencillo",
    "6,00 £"
   ],
   [
    "Airlink aeropuerto ida y vuelta abierta",
    "8,50 £"
   ],
   [
    "Network DAY (incluye Airlink y tranvía en todas las zonas)",
    "14,00 £"
   ],
   [
    "Tranvía zona ciudad sencillo",
    "2,40 £"
   ],
   [
    "Tranvía aeropuerto sencillo (verificar)",
    "8,50 £"
   ]
  ],
  "pases": [
   {
    "t": "Boleto sencillo de bus · 2,40 £",
    "p": "Sirve para un solo viaje en bus Lothian dentro de la ciudad, sin transbordo. Se paga al subir con tarjeta sin contacto o con dinero exacto (no dan cambio). Si vas a hacer tres o más viajes en el día, el pase de un día sale más barato.",
    "u": "https://www.lothianbuses.com/fares-and-tickets/"
   },
   {
    "t": "City DAY · 6,00 £",
    "p": "Viajes ilimitados en buses Lothian y tranvía dentro de la ciudad durante el día. Conviene a partir de tres viajes. Con la tarjeta sin contacto el cobro se topa solo en 5,70 £; también se compra en la app Bus & Tram.",
    "u": "https://www.lothianbuses.com/fares-and-tickets/"
   },
   {
    "t": "Airlink 100 · 6,00 £ sencillo / 8,50 £ ida y vuelta",
    "p": "Bus directo entre el aeropuerto y Waverley, cada pocos minutos. Es el modo más simple de llegar. La ida y vuelta abierta se amortiza si regresas en bus al aeropuerto.",
    "u": "https://www.lothianbuses.com/airport"
   },
   {
    "t": "Tranvía aeropuerto · unos 8,50 £ (verificar)",
    "p": "Más rápido y estable que el bus en hora punta, con andén en el aeropuerto. Se compra en máquina de la parada o con la app; no se vende a bordo. Valida siempre antes de subir: hay inspectores y multas.",
    "u": "https://edinburghtrams.com/"
   },
   {
    "t": "Network DAY · 14,00 £",
    "p": "Cubre buses de toda la red, tranvía al aeropuerto y Airlink. Solo conviene si vas a salir de la ciudad (Dalkeith, Musselburgh, North Berwick) además de usar el aeropuerto el mismo día.",
    "u": "https://www.lothianbuses.com/fares-and-tickets/"
   },
   {
    "t": "Tarjeta sin contacto con tope (TapTapCap)",
    "p": "Usa siempre la misma tarjeta o móvil para todos los viajes; el sistema aplica el mejor precio del día y de la semana (lunes a domingo). No necesitas comprar pase antes.",
    "u": "https://www.lothianbuses.com/fares-and-tickets/"
   }
  ],
  "consejos": [
   "No hay Oyster ni equivalente: la tarjeta sin contacto bancaria con tope diario es lo más barato y simple.",
   "Con el bus a bordo no dan cambio: lleva tarjeta sin contacto o el importe exacto."
  ],
  "trenes": "ScotRail une Waverley con Glasgow Queen Street (unos 50 min), Dundee, Leuchars (para St Andrews) e Inverness; se compra en scotrail.co.uk o en las máquinas. La tarifa Off-Peak y los billetes con antelación son más baratos que los Anytime.",
  "fuentes": [
   "https://www.lothianbuses.com/fares-and-tickets/",
   "https://www.lothianbuses.com/airport",
   "https://edinburghtrams.com/news/changes-tram-fares-2026",
   "https://www.lothianbuses.com/news/2026/01/fares-revision/"
  ],
  "dudas": [
   "Tarifa exacta del tranvía al aeropuerto en 2026 (guías dan 7,90 £ y 8,50 £).",
   "Tiempo exacto aeropuerto en tranvía (35 min es dato de guías, no verificado en la web oficial)."
  ]
 },
 "glasgow": {
  "operador": "SPT (metro Subway) · First Bus · ScotRail",
  "llegada": "Desde el aeropuerto de Glasgow al centro se usa el bus Airport Express (unos 25 min, precio verificar en firstbus.co.uk; no confirmado). Desde la estación Glasgow Central o Queen Street se camina al centro.",
  "local": "El metro Subway circular (15 estaciones) es útil para el West End y el sur; el resto del centro se hace a pie o en bus. La Subway acepta tarjeta sin contacto desde 2026.",
  "tarifas": [
   [
    "Subway sencillo con tarjeta Smartcard o sin contacto, adulto",
    "1,80 £"
   ],
   [
    "Subway sencillo desechable, adulto",
    "1,85 £"
   ],
   [
    "Subway ida y vuelta desechable, adulto",
    "3,50 £"
   ],
   [
    "Subway pase diario con Smartcard o tope sin contacto",
    "3,40 £"
   ],
   [
    "Subway pase diario desechable",
    "4,45 £"
   ],
   [
    "Subway tope semanal sin contacto",
    "15,50 £"
   ],
   [
    "Subway pase de 7 días Smartcard (online)",
    "14,50 £"
   ],
   [
    "Subway niño sencillo Smartcard",
    "0,90 £"
   ]
  ],
  "pases": [
   {
    "t": "Subway sencillo · 1,80 £",
    "p": "Un viaje en el círculo de 15 estaciones, en cualquier sentido. Se paga con tarjeta sin contacto en los torniquetes, sin comprar boleto. Con dos o más viajes ya conviene el tope diario.",
    "u": "https://www.spt.co.uk/about-us/news/subway-fares-revised-for-2026/"
   },
   {
    "t": "Pase diario Subway · 3,40 £",
    "p": "Viajes ilimitados en la Subway el mismo día. Con tarjeta sin contacto basta pasar dos o más veces: el cobro se limita solo a 3,40 £. El boleto desechable de día cuesta 4,45 £ si no usas sin contacto.",
    "u": "https://www.spt.co.uk/about-us/news/subway-goes-contactless/"
   },
   {
    "t": "Pase de 7 días Subway · 14,50 £",
    "p": "Para quien se queda una semana y usará mucho la Subway. Se compra online en spt.co.uk (15,50 £ en estación). Con el tope semanal sin contacto de 15,50 £ casi no hace falta.",
    "u": "https://www.spt.co.uk/travel-with-spt"
   },
   {
    "t": "Buses de Glasgow (First Bus)",
    "p": "Cubren zonas donde no llega la Subway. Se paga con tarjeta sin contacto o en la app First Bus. Precio sencillo y pase diario: verificar en firstbus.co.uk, no confirmados aquí.",
    "u": "https://www.firstbus.co.uk/greater-glasgow/plan-journey/forthcoming-fare-changes"
   },
   {
    "t": "Tope de 2 £ por bus (Strathclyde)",
    "p": "Transport Scotland tiene un piloto que limita a 2 £ los billetes sencillos adultos en buses participantes de Strathclyde. No cubre ida y vuelta ni garantiza pases diarios. Revisa que el operador participe.",
    "u": "https://www.transport.gov.scot/twopound"
   }
  ],
  "consejos": [
   "Un día completo de Subway con sin contacto no pasa de 3,40 £: no compres boleto desechable.",
   "Los trenes ScotRail a Edimburgo salen cada 15 minutos aproximadamente: mira las tarifas Off-Peak."
  ],
  "trenes": "ScotRail une Glasgow Queen Street con Edimburgo Waverley (unos 50 min) y con Stirling, Perth e Inverness; Glasgow Central sirve a Ayr, Carlisle y Londres vía Avanti. Se compra en scotrail.co.uk o en la app.",
  "fuentes": [
   "https://www.spt.co.uk/about-us/news/subway-fares-revised-for-2026/",
   "https://www.spt.co.uk/about-us/news/subway-goes-contactless/",
   "https://www.transport.gov.scot/twopound"
  ],
  "dudas": [
   "Precio actual del bus Airport Express desde el aeropuerto de Glasgow.",
   "Tarifas de buses First Bus (sencillo y día) en 2026."
  ]
 },
 "inverness": {
  "operador": "Stagecoach · Citylink · ScotRail",
  "llegada": "Desde el aeropuerto de Inverness hay un bus de Stagecoach que sale frente a la terminal rumbo al centro (unos 20 min, precio verificar). Desde la estación de tren o de buses se camina al centro.",
  "local": "El centro de Inverness es pequeño y caminable; para Culloden, Loch Ness y el resto de las Highlands suele hacer falta auto o excursión.",
  "tarifas": [
   [
    "Bus urbano sencillo adulto Stagecoach (tope piloto desde 23 mar 2026)",
    "máximo 2,00 £"
   ],
   [
    "Day Rider Stagecoach Inverness (dato de años anteriores, 5,40 £; verificar)",
    "verificar"
   ],
   [
    "Citylink Inverness–Portree (Skye)",
    "verificar"
   ],
   [
    "Billete de ida y vuelta de bus",
    "no incluido en el tope de 2 £"
   ]
  ],
  "pases": [
   {
    "t": "Sencillo con tope de 2 £",
    "p": "Desde marzo de 2026, Highland aplica un tope de 2 £ a los billetes sencillos de adultos en servicios de Stagecoach (y Citylink participa). No cubre ida y vuelta ni pases diarios. Se paga a bordo con tarjeta sin contacto o con la app Stagecoach.",
    "u": "https://www.transport.gov.scot/twopound"
   },
   {
    "t": "Day Rider Stagecoach · verificar",
    "p": "Pase de un día en buses de Inverness. Una nota de prensa antigua daba 5,40 £, sin confirmar el año. Conviene solo si usas más de tres veces el bus en el día.",
    "u": "https://www.stagecoachbus.com/"
   },
   {
    "t": "Citylink a Skye",
    "p": "Bus de larga distancia desde la estación de buses Farraline Park hasta Portree. Se compra en citylink.co.uk con antelación en temporada alta. Precio no confirmado.",
    "u": "https://www.citylink.co.uk/"
   },
   {
    "t": "Tren ScotRail",
    "p": "Inverness conecta con Edimburgo, Glasgow, Aberdeen y la línea Kyle of Lochalsh (a Skye). Se compra en scotrail.co.uk o en la estación.",
    "u": "https://www.scotrail.co.uk/"
   }
  ],
  "consejos": [
   "En temporada alta los buses Citylink a Skye se llenan: reserva con antelación.",
   "Muchos servicios de las Highlands son poco frecuentes los domingos: confirma el horario de vuelta antes de salir."
  ],
  "trenes": "ScotRail une Inverness con Edimburgo (unos 3 h 30), Glasgow, Aberdeen y Kyle of Lochalsh. Billetes en scotrail.co.uk; las tarifas Advance son más baratas.",
  "fuentes": [
   "https://www.transport.gov.scot/twopound",
   "https://www.stagecoachbus.com/promos-and-offers/north-scotland/highlands-2-single-fare-cap",
   "https://www.highland.gov.uk/info/1526/public_and_community_transport/111/public_transport/2"
  ],
  "dudas": [
   "Precio del Day Rider de Inverness en 2026.",
   "Precio del bus aeropuerto de Inverness al centro.",
   "Precio y horarios de Citylink Inverness–Portree."
  ]
 },
 "skye": {
  "operador": "Citylink · Stagecoach · transporte local",
  "llegada": "Se llega a Skye en bus Citylink desde Inverness o Glasgow (a Portree) o en tren hasta Kyle of Lochalsh más bus; el puente de Skye evita el ferry. Precios exactos no confirmados.",
  "local": "Skye tiene pocos buses locales y poco frecuentes; la mayoría de los turistas alquila auto o usa excursiones desde Portree o Inverness. Los servicios fuera de Citylink dependen mucho de la temporada.",
  "tarifas": [
   [
    "Bus sencillo adulto con tope en Highland (desde 23 mar 2026)",
    "máximo 2,00 £"
   ],
   [
    "Citylink Inverness–Portree",
    "verificar"
   ],
   [
    "Citylink Glasgow–Portree",
    "verificar"
   ],
   [
    "Bus local Portree–Uig u otros",
    "verificar"
   ]
  ],
  "pases": [
   {
    "t": "Tope de 2 £ en bus sencillo",
    "p": "El piloto de Transport Scotland aplica el tope de 2 £ a los billetes sencillos de adultos en Highland y Citylink. No incluye ida y vuelta. Confirma con el conductor que el servicio participa.",
    "u": "https://www.transport.gov.scot/twopound"
   },
   {
    "t": "Citylink Inverness–Portree",
    "p": "Servicio directo diario con paradas en el puente de Skye. Compra en citylink.co.uk con antelación en verano. Precio no verificado.",
    "u": "https://www.citylink.co.uk/"
   },
   {
    "t": "Buses locales de Skye",
    "p": "Las líneas dentro de la isla son más escasas, a menudo solo hasta media tarde y con menos servicio los domingos. Revisa los horarios en highland.gov.uk antes de planear una excursión sin auto.",
    "u": "https://www.highland.gov.uk/info/1526/public_and_community_transport/111/public_transport/2"
   },
   {
    "t": "Auto de alquiler",
    "p": "La forma más práctica de ver Skye en pocos días. Reserva con meses de antelación en verano y planea las carreteras de una sola vía con apartaderos.",
    "u": "https://www.visitscotland.com/places-to-go/islands/isle-skye/"
   }
  ],
  "consejos": [
   "Sin auto, limita las excursiones y concéntrate en Portree y alrededores; lo demás exige tour organizado.",
   "Carga combustible en Portree: hay pocas gasolineras en el resto de la isla."
  ],
  "trenes": "No hay tren en Skye; el más cercano llega a Kyle of Lochalsh (línea desde Inverness, ScotRail). Desde allí se cruza el puente en bus.",
  "fuentes": [
   "https://www.transport.gov.scot/twopound",
   "https://www.highland.gov.uk/info/1526/public_and_community_transport/111/public_transport/2",
   "https://www.visitscotland.com/places-to-go/islands/isle-skye/things-to-do/skye-fort-william-itinerary"
  ],
  "dudas": [
   "Precios de Citylink a Portree.",
   "Frecuencia exacta de buses locales."
  ]
 },
 "standrews": {
  "operador": "Stagecoach East Scotland · ScotRail",
  "llegada": "St Andrews no tiene estación: se llega en tren a Leuchars (ScotRail) y de ahí bus Stagecoach 99 o 99A al centro (unos 10 min, cada 10 min en horario diurno). Desde Edimburgo también hay bus directo X59 (unos 2 h).",
  "local": "El casco antiguo se recorre a pie; el bus 99 conecta Leuchars, St Andrews y Dundee.",
  "tarifas": [
   [
    "Stagecoach 99 pase de un día (dato de la web, año sin confirmar)",
    "9,00 £"
   ],
   [
    "Leuchars–St Andrews bus sencillo (dato de foro, antiguo)",
    "unos 5,10 £ (verificar)"
   ],
   [
    "Bus sencillo con tope Fife 2 £",
    "verificar (no se encontró confirmación para Fife)"
   ]
  ],
  "pases": [
   {
    "t": "Bus 99 Leuchars–St Andrews",
    "p": "Bus eléctrico que pasa por la estación de Leuchars con frecuencia alta. Se paga con tarjeta sin contacto o con la app Stagecoach. Un pase de día en la web de Stagecoach aparece a 9,00 £, sin año.",
    "u": "https://www.stagecoachbus.com/promos-and-offers/east-scotland/service-99-goes-electric"
   },
   {
    "t": "Bus X59 Edimburgo–St Andrews",
    "p": "Bus directo, unos 2 horas. Precio reciente no confirmado (un foro antiguo daba 8,10 £ ida y vuelta).",
    "u": "https://www.stagecoachbus.com/"
   },
   {
    "t": "Tren a Leuchars",
    "p": "Desde Edimburgo Waverley unos 1 h 10 min. Se compra en scotrail.co.uk; conviene billete con bus incluido (PlusBus) si existe, verifica en la web.",
    "u": "https://www.scotrail.co.uk/"
   },
   {
    "t": "Taxi de Leuchars a St Andrews",
    "p": "Los taxis esperan en la estación, unos 10 min; útil con equipaje o de noche. Precio no verificado.",
    "u": "https://www.visitscotland.com/"
   }
  ],
  "consejos": [
   "Si llegas en tren, no bajes en Dundee: el bus desde Leuchars es más rápido.",
   "Revisa el último bus de regreso a Leuchars antes de planear una cena."
  ],
  "trenes": "ScotRail desde Edimburgo hasta Leuchars (unos 1 h 10 min) y Dundee; billetes en scotrail.co.uk.",
  "fuentes": [
   "https://www.stagecoachbus.com/promos-and-offers/east-scotland/service-99-goes-electric",
   "https://www.scotrail.co.uk/"
  ],
  "dudas": [
   "Precios de 2026 de los buses 99 y X59.",
   "Duración exacta del tren desde Edimburgo."
  ]
 },
 "dublin": {
  "operador": "TFI · Dublin Bus · Luas · Irish Rail (DART)",
  "llegada": "Desde el aeropuerto al centro: bus Airlink 747 (unos 30–45 min hasta O'Connell Street, aprox. 7 € sencillo según guías, verificar en dublinbus.ie) o Aircoach/Dublin Express (precio no confirmado).",
  "local": "Dublin es compacta: se camina el centro y se usan Dublin Bus, Luas (tranvía) y DART (tren costero) con la tarjeta Leap o el Leap Visitor Card.",
  "tarifas": [
   [
    "Bus sencillo tramo corto, con Leap",
    "1,50 €"
   ],
   [
    "Bus sencillo tramo largo, con Leap",
    "2,00 €"
   ],
   [
    "Bus sencillo tramo corto, en efectivo",
    "2,00 €"
   ],
   [
    "Bus sencillo tramo largo, en efectivo",
    "2,60 €"
   ],
   [
    "Tope diario Leap (todos los operadores)",
    "6,00 €"
   ],
   [
    "Tope semanal Leap (lunes a domingo)",
    "24,00 €"
   ],
   [
    "Leap Visitor Card 24 horas",
    "8,00 €"
   ],
   [
    "Leap Visitor Card 72 horas",
    "18,00 €"
   ],
   [
    "Leap Visitor Card 7 días",
    "24,00 €"
   ],
   [
    "Airlink 747 sencillo (verificar)",
    "unos 7,00 €"
   ]
  ],
  "pases": [
   {
    "t": "Leap Card con crédito",
    "p": "Tarjeta recargable para Dublin Bus, Luas, DART y trenes de cercanías. Ofrece tarifa más barata que en efectivo y tope diario de 6 €, así que normalmente sale más barata que el Visitor Card si haces pocos viajes. Se compra en tiendas y estaciones.",
    "u": "https://www.transportforireland.ie/fares/leap-card/"
   },
   {
    "t": "Leap Visitor Card · 8 € / 18 € / 24 €",
    "p": "Viajes ilimitados en bus, Luas, DART y Airlink por 24 h, 72 h o 7 días. Conviene solo si haces muchos viajes o usas el Airlink. Sin crédito de vuelta en el 24 horas.",
    "u": "https://www.dublinbus.ie/fares-and-tickets/adult"
   },
   {
    "t": "Airlink 747",
    "p": "Bus directo entre el aeropuerto y el centro, por Connolly y Heuston. En buses el conductor no da cambio ni acepta billetes; paga con Leap o monedas exactas. Verifica el precio actual.",
    "u": "https://www.dublinbus.ie/"
   },
   {
    "t": "Luas",
    "p": "Dos líneas de tranvía (verde y roja). Se compra boleto en máquina o se paga con Leap. Valida la Leap en la parada antes de subir: hay controles.",
    "u": "https://luas.ie/"
   },
   {
    "t": "DART",
    "p": "Tren costero hacia Howth y Dalkey; útil como paseo. Se paga con Leap o billete de Irish Rail.",
    "u": "https://www.irishrail.ie/"
   }
  ],
  "consejos": [
   "Los buses no dan cambio ni aceptan billetes: lleva Leap o monedas exactas.",
   "Se anunció un aumento medio de 15 % en tarifas desde enero de 2027 (NTA, septiembre de 2026): revisa precios si viajas después."
  ],
  "trenes": "Irish Rail une Dublín Connolly con Belfast Lanyon Place (Enterprise, unas 2 h), y Heuston con Cork y Galway. Se compra en irishrail.ie.",
  "fuentes": [
   "https://www.dublinbus.ie/fares-and-tickets/adult",
   "https://www.transportforireland.ie/fares/leap-card/",
   "https://www.nationaltransport.ie/news/changes-announced-to-public-transport-fares-from-2027-while-free-travel-and-key-discounts-maintained/"
  ],
  "dudas": [
   "Tarifa actual del Airlink 747 (guías dan 7 € y 8 €).",
   "Precio de Aircoach y Dublin Express.",
   "Tarifas de Luas y DART."
  ]
 },
 "belfast": {
  "operador": "Translink (Metro · Glider · NI Railways)",
  "llegada": "Desde Belfast City Airport hay el Airport Express 600 (unos 10 min al centro, unos 2,30 £ según una guía de 2024, verificar). Desde Belfast International, el Airport Express 300 (unos 30 min; precio no confirmado).",
  "local": "El centro y la zona de Titanic se hacen a pie y en Glider. La app mLink de Translink guarda boletos y topes.",
  "tarifas": [
   [
    "Metro / Glider día (mLink, dayLink o sin contacto)",
    "unos 4,00 £ (verificar)"
   ],
   [
    "Metro / Glider día con cash",
    "unos 4,20 £ (guía antigua)"
   ],
   [
    "Metro / Glider día después de las 9:30 (guía)",
    "unos 3,00 £ (verificar)"
   ],
   [
    "Airport Express 600 sencillo (guía 2024)",
    "2,30 £"
   ],
   [
    "Metro Family Ticket (verificar si cambió)",
    "unos 10 a 12 £"
   ]
  ],
  "pases": [
   {
    "t": "Day ticket Metro y Glider",
    "p": "Viajes ilimitados en Metro y Glider durante el día, desde unos 4 £ según guías. Compra en la app mLink, en dayLink o en el conductor. Los Glider se pagan antes de subir, en la máquina de la parada.",
    "u": "https://www.translink.co.uk/"
   },
   {
    "t": "Airport Express 600",
    "p": "Conecta Belfast City Airport con el centro y cuenta como servicio Metro, así que el day ticket sirve. Precio de 2024; verifica el actual.",
    "u": "https://belfastcityairport.com/Flight-Info/Travel-Information"
   },
   {
    "t": "Glider",
    "p": "Tranvía de buses articulados; las rutas G1 y G2 cruzan el centro y llegan a Titanic. Debes comprar el boleto antes de subir.",
    "u": "https://www.translink.co.uk/"
   },
   {
    "t": "Tarjeta sin contacto",
    "p": "Translink está desplegando pago sin contacto con tope; su cobertura en Glider y buses fuera de Metro no está confirmada. Mejor ten la app mLink.",
    "u": "https://www.translink.co.uk/"
   },
   {
    "t": "Tren NI Railways",
    "p": "Conecta Belfast con Bangor, Derry y Dublín (Enterprise). Compra en translink.co.uk.",
    "u": "https://www.translink.co.uk/"
   }
  ],
  "consejos": [
   "En Glider no se vende boleto a bordo: compra antes en máquina o app.",
   "Los precios en Reino Unido para Irlanda del Norte son en libras, no en euros: no confundir con Dublín."
  ],
  "trenes": "El Enterprise une Belfast Lanyon Place con Dublín Connolly en unas 2 h; se compra en translink.co.uk o irishrail.ie.",
  "fuentes": [
   "https://belfastcityairport.com/Flight-Info/Travel-Information",
   "https://www.inyourpocket.com/northern-ireland/belfast/venues/ni-bus-and-rail-public-transport-network",
   "https://www.infrastructure-ni.gov.uk/node/422960"
  ],
  "dudas": [
   "Tarifa sencilla Metro/Glider 2026.",
   "Precio actual del Airport Express 600 y 300.",
   "Día completo: 4,00 £ vs 4,20 £ vs 4,50 £ según fuente."
  ]
 },
 "cork": {
  "operador": "Bus Éireann · TFI (Leap) · Irish Rail",
  "llegada": "Del aeropuerto de Cork al centro: bus Bus Éireann 226 (o 225) hasta la estación Kent, unos 25–30 minutos; el precio exacto de la 226 no lo pude confirmar (verificar; Irish Rail vende un añadido de bus aeropuerto–Kent por 1,55 € al reservar un tren). Un taxi o Uber ronda los 15–20 € (estimación, verificar).",
  "local": "El centro de Cork es compacto y se recorre a pie; para barrios más lejanos hay buses urbanos de Bus Éireann con tarjeta Leap o pago sin contacto. Desde el 20 de julio de 2026 rige la tarifa de 90 minutos en los buses urbanos de la ciudad.",
  "tarifas": [
   [
    "Bus urbano Cork, tarjeta Leap (tarifa 90 minutos, desde 20-07-2026)",
    "1,70 €"
   ],
   [
    "Bus urbano Cork, efectivo (adulto)",
    "2,40 €"
   ],
   [
    "Tope diario Leap adulto Cork (fijado para verano 2026; verificar si ya rige)",
    "5,10 €"
   ],
   [
    "Tope semanal Leap adulto Cork (verificar)",
    "20,40 €"
   ],
   [
    "Leap joven adulto / estudiante, bus urbano",
    "0,85 €"
   ],
   [
    "Niños 9–15 años con Leap",
    "0,55 €"
   ],
   [
    "Niños hasta 8 años con Child Leap",
    "Gratis"
   ],
   [
    "Añadido bus aeropuerto–Kent al comprar tren Irish Rail",
    "1,55 €"
   ]
  ],
  "pases": [
   {
    "t": "Tarifa 90 minutos · 1,70 € con Leap",
    "p": "Un solo pago con tarjeta Leap permite subir a cualquier bus urbano de Cork y hacer los transbordos que quieras durante 90 minutos. Conviene para casi todos los trayectos de un turista. No se aplica a las líneas 200, 226, 228, 240, 241, 245, 260 y 261.",
    "u": "https://www.nationaltransport.ie/cork/cork-tfi-90-minute-fare/"
   },
   {
    "t": "Tarjeta Leap",
    "p": "Tarjeta recargable que sale más barata que el efectivo en todos los buses de Irlanda. Se compra en tiendas con el logo Leap y se recarga en tiendas o en la app. En Cork los buses ya tienen validadores para tocar la tarjeta al subir.",
    "u": "https://about.leapcard.ie/"
   },
   {
    "t": "Efectivo · 2,40 €",
    "p": "Se paga al conductor y no da cambio exacto, así que lleva monedas. Es lo más caro; sirve solo si no vas a usar más de un trayecto. Con Leap pagas casi 30 % menos.",
    "u": "https://www.nationaltransport.ie/cork/"
   },
   {
    "t": "Tickets de 24 horas, semanales y mensuales en Leap",
    "p": "Existen como productos cargados en la tarjeta Leap. En Cork, si usas uno de estos tickets, hay que acercarse al conductor para validarlo. Con el tope diario previsto, rara vez compensan para una estancia corta.",
    "u": "https://www.transportforireland.ie/"
   },
   {
    "t": "Bus al aeropuerto · líneas 225 y 226",
    "p": "Salen de la estación Kent (paradas en Clontarf Street y Anglesea Street) y tardan unos 25–30 minutos. La 226 pasa más o menos cada hora, de 05:50 a 23:50 según una guía de terceros (verificar horario). Puedes pagarlas con Leap o en el bus.",
    "u": "https://www.corkairport.com/to-from-the-airport/by-bus"
   }
  ],
  "consejos": [
   "Toca siempre la tarjeta Leap al subir y comprueba que el validador marque verde; con el pase de 90 minutos el truco es no tocar de nuevo al transbordar dentro de ese plazo salvo que el sistema lo pida.",
   "Para ir a Blarney, Cobh o Kinsale compara bus y tren: a Cobh hay tren desde Kent; a Kinsale va el bus 226."
  ],
  "trenes": "Irish Rail une Cork con Dublin Heuston en unas 2 h 30 min (la estación Heuston queda lejos de Connolly); para Killarney hay que cambiar en Mallow. Compra en irishrail.ie; el precio de intercity no lo confirmé (verificar). Hay obras y buses sustitutos en algunas fechas de 2026.",
  "fuentes": [
   "https://www.nationaltransport.ie/cork/cork-tfi-90-minute-fare/",
   "https://www.nationaltransport.ie/news/passengers-in-cork-to-benefit-from-faster-boarding-and-more-flexible-travel-with-new-tfi-90-minute-fare/",
   "https://www.corkairport.com/to-from-the-airport/by-bus",
   "https://www.irishtimes.com/business/2025/02/11/public-transport-boost-for-cork-airport-with-passengers-now-able-to-buy-a-single-bus-and-rail-ticket"
  ],
  "dudas": [
   "Precio exacto de la línea 226 al aeropuerto",
   "Si el tope diario de 5,10 € ya está en vigor",
   "Precio de Cork–Dublin y Cork–Killarney en tren",
   "Costo del taxi al aeropuerto"
  ]
 },
 "galway": {
  "operador": "Bus Éireann · City Direct · Citylink · Irish Rail",
  "llegada": "Galway no tiene aeropuerto grande; casi todos llegan en bus (Citylink o Bus Éireann) desde Dublín o su aeropuerto, o en tren a la estación Ceannt, a pocos minutos a pie de la plaza Eyre. Precio exacto Dublín–Galway no confirmado (verificar en irishrail.ie y citylink.ie).",
  "local": "El centro y el barrio Latino se recorren a pie. Los buses urbanos (Bus Éireann y City Direct) sirven para Salthill y los barrios; se paga con Leap o efectivo.",
  "tarifas": [
   [
    "Bus urbano Galway, adulto con Leap (tarifa de abril 2022; verificar si cambió)",
    "1,35 €"
   ],
   [
    "Bus urbano Galway, adulto con Leap, 12 o más tramos (2022; verificar)",
    "1,55 €"
   ],
   [
    "Ahorro con Leap frente a efectivo en Bus Éireann y City Direct",
    "aprox. 30 %"
   ],
   [
    "Rebaja de abril 2026 en Bus Éireann y Local Link (según prensa local)",
    "20 %"
   ],
   [
    "Adultos 19–23 años en tarifas nacionales (según prensa)",
    "50 % de descuento"
   ],
   [
    "Citylink Dublín–Galway",
    "verificar en citylink.ie"
   ],
   [
    "Tren Dublín Heuston–Galway Ceannt",
    "verificar en irishrail.ie"
   ]
  ],
  "pases": [
   {
    "t": "Bus urbano con Leap · 1,35 €",
    "p": "Tarifa de referencia para trayectos cortos en Galway, por ejemplo al paseo de Salthill. Esta cifra viene de una página de TFI de 2022 y de prensa local que habla de una rebaja del 20 % en 2026, así que confirma el precio al subir. Con Leap sale más barato que en efectivo.",
    "u": "https://www.transportforireland.ie/getting-around/network-maps/galway-city-bus-services/"
   },
   {
    "t": "Tarjeta Leap",
    "p": "Tarjeta recargable aceptada en Bus Éireann, City Direct y Local Link. Se compra en tiendas con el logo Leap y se recarga en la tienda o en la app. Conviene si vas a tomar más de dos o tres buses.",
    "u": "https://about.leapcard.ie/"
   },
   {
    "t": "Local Link Galway · pago sin contacto",
    "p": "Los servicios Local Link de Galway ya aceptan pago sin contacto con tarjeta bancaria o móvil. Útil para excursiones a pueblos de la costa si no tienes Leap.",
    "u": "https://www.nationaltransport.ie/news/new-contactless-payment-option-rolled-out-on-tfi-local-link-galway/"
   },
   {
    "t": "Citylink · bus a Dublín y al aeropuerto",
    "p": "Servicio exprés frecuente entre Galway y Dublín o su aeropuerto, con salida en la estación de buses junto a Eyre Square. Citylink subió sus tarifas el 1 de abril de 2026; compra en citylink.ie o en la app. Verifica el precio y el horario antes de ir.",
    "u": "https://www.citylink.ie/"
   },
   {
    "t": "Tren Irish Rail a Ceannt",
    "p": "Opción de tren desde Dublín Heuston (con cambio en algunos casos). Reserva con antelación en irishrail.ie: los precios anticipados suelen ser más baratos que en el día.",
    "u": "https://www.irishrail.ie/"
   }
  ],
  "consejos": [
   "Galway se hace a pie: no compres abonos de transporte para el centro; guarda el bus para Salthill o excursiones (acantilados de Moher, Connemara) y compara con un tour organizado.",
   "Para los acantilados de Moher y Connemara suele ser más práctico un tour de un día que depender de buses locales poco frecuentes."
  ],
  "trenes": "Irish Rail (irishrail.ie) conecta Galway con Dublín Heuston; Citylink y Bus Éireann ofrecen buses más frecuentes entre Galway y Dublín o su aeropuerto. Precios de 2026 no confirmados (verificar).",
  "fuentes": [
   "https://www.transportforireland.ie/getting-around/network-maps/galway-city-bus-services/",
   "https://www.citylink.ie/latest-news/fare-amendment-notice-effective-1st-april-2026/",
   "https://www.nationaltransport.ie/news/new-contactless-payment-option-rolled-out-on-tfi-local-link-galway/",
   "https://www.nationaltransport.ie/publications/nta-fares-determination-2026/"
  ],
  "dudas": [
   "Tarifa urbana vigente en 2026 (la cifra de 1,35 € es de 2022 y hay una rebaja del 20 % no confirmada)",
   "Precios Dublín–Galway en bus y tren",
   "Tiempos exactos de viaje"
  ]
 },
 "killarney": {
  "operador": "Bus Éireann · Irish Rail · taxis locales",
  "llegada": "A Killarney se llega en tren Irish Rail (desde Dublín o Cork, normalmente con cambio en Mallow) o en bus Bus Éireann/Expressway; desde Cork el bus tarda unos 1 h 30 min con precios de referencia de 13–20 € (estimación de agregadores, verificar). El aeropuerto de Kerry está cerca, pero los vuelos son caros.",
  "local": "Killarney no tiene bus urbano; el pueblo es pequeño y se hace a pie. Para el parque nacional se usan bicicleta, coche de caballos (jaunting car) o taxi; para el Anillo de Kerry lo normal es coche propio o un tour de un día.",
  "tarifas": [
   [
    "Bus Cork–Killarney (aprox., agregadores; verificar)",
    "13–20 €"
   ],
   [
    "Bus Dublín–Killarney (aprox., agregadores; verificar)",
    "22–35 €"
   ],
   [
    "Tren Dublín–Killarney (aprox., agregadores; verificar)",
    "25–35 €"
   ],
   [
    "Jaunting car, por persona (cifra de un operador; solo efectivo; verificar)",
    "35 €"
   ],
   [
    "Jaunting car, por carruaje (cifra de un operador; verificar)",
    "140 €"
   ],
   [
    "Entrada al parque nacional, Torc y Ross Castle (exterior)",
    "Gratis"
   ],
   [
    "Visita interior a Muckross House (aprox.)",
    "9 €"
   ],
   [
    "Alquiler de bicicleta",
    "verificar localmente"
   ]
  ],
  "pases": [
   {
    "t": "Bus Bus Éireann / Expressway desde Cork y Dublín",
    "p": "Es la forma más directa de llegar si no tienes coche; salen cada pocas horas. Compra en busstop o en la web de Bus Éireann con anticipación para precios más bajos. Los precios de esta ficha son estimaciones de agregadores y deben verificarse.",
    "u": "https://www.buseireann.ie/"
   },
   {
    "t": "Tren Irish Rail a Killarney",
    "p": "Llega desde Cork y Dublín, por lo general con cambio en Mallow. Algunas fechas de 2026 tienen obras entre Killarney y Tralee con buses sustitutos. Compra en irishrail.ie o en la estación.",
    "u": "https://www.irishrail.ie/"
   },
   {
    "t": "Bicicleta en el parque nacional",
    "p": "Es la mejor manera de ver Ross Castle, Muckross y Torc sin coche; hay alquileres en el pueblo (por ejemplo en Beech Road). Reserva en verano.",
    "u": "https://www.killarney.ie/"
   },
   {
    "t": "Jaunting car (coche de caballos)",
    "p": "Paseo clásico por el parque con un conductor-guía; se paga en efectivo y puede cambiar según temporada. Negocia o confirma el precio antes de subir y compártelo entre hasta 4 personas.",
    "u": "https://www.killarney.ie/"
   },
   {
    "t": "Tour o coche para el Anillo de Kerry",
    "p": "Por bus público el circuito completo requiere varios tramos con poca frecuencia. Para una excursión de un día suele ser mejor un tour organizado o un coche de alquiler (en Irlanda se conduce por la izquierda).",
    "u": "https://www.discoverireland.ie/kerry"
   }
  ],
  "consejos": [
   "No intentes el Anillo de Kerry en bus público en un día; reserva un tour o alquila coche, y empieza temprano para evitar los buses turísticos.",
   "Lleva efectivo para el jaunting car y algunos pequeños comercios."
  ],
  "trenes": "Irish Rail llega a Killarney desde Cork y Dublín, generalmente con cambio en Mallow, y hay obras y buses sustitutos hacia Tralee en algunas fechas de 2026. Bus Éireann y Expressway son la alternativa; confirma horarios y precios en irishrail.ie y buseireann.ie.",
  "fuentes": [
   "https://www.rome2rio.com/s/Killarney/Cork",
   "https://everyrail.com/ireland/cork/",
   "https://discoverireland.ie/kerry/car-free-killarney-national-park",
   "https://www.frommers.com/destinations/killarney/planning-a-trip/getting-around"
  ],
  "dudas": [
   "Precios oficiales de tren y bus a Killarney (todas las cifras son de agregadores)",
   "Precio actual del jaunting car",
   "Precio de alquiler de bicicleta",
   "Frecuencia exacta de buses locales y de Kerry Local Link"
  ]
 },
 "seul": {
  "operador": "Seoul Metro · buses de Seúl · AREX · T-money",
  "llegada": "Del aeropuerto de Incheon a la estación de Seúl: AREX exprés, unos 43 minutos y 9.500 ₩ (otra guía da 11.000 ₩, verificar), o AREX parador, unos 60–66 minutos y 4.750–4.950 ₩. El bus limusina del aeropuerto cuesta unos 10.000–17.000 ₩ según la ruta y tarda 60–90 minutos; un taxi, 60.000–80.000 ₩ (estimaciones).",
  "local": "El metro de Seúl cubre casi toda la ciudad y se usa con tarjeta T-money; complementa con buses y taxis. Google Maps no da rutas de transporte en Corea: usa Naver Map o KakaoMap.",
  "tarifas": [
   [
    "Metro, tarifa base hasta 10 km con tarjeta (desde 28-06-2025)",
    "1.550 ₩"
   ],
   [
    "Recargo por distancia",
    "+100 ₩ cada 5 km (tras 10 km)"
   ],
   [
    "Billete sencillo de papel (incluye depósito reembolsable de 500 ₩)",
    "aprox. 2.000 ₩ (verificar)"
   ],
   [
    "Bus urbano azul o verde con tarjeta (verificar)",
    "aprox. 1.500 ₩"
   ],
   [
    "Climate Card 1 día (sin AREX exprés)",
    "5.000 ₩"
   ],
   [
    "Climate Card 3 días",
    "10.000 ₩"
   ],
   [
    "Climate Card 7 días",
    "20.000 ₩"
   ],
   [
    "Tarjeta física de Climate Card (cargo único)",
    "3.000 ₩"
   ],
   [
    "T-money, tarjeta",
    "3.000 ₩"
   ],
   [
    "Taxi estándar, bajada de bandera, primeros 1,6 km (verificar)",
    "4.800 ₩"
   ]
  ],
  "pases": [
   {
    "t": "T-money · 3.000 ₩ + saldo",
    "p": "Tarjeta recargable para metro, buses y algunos taxis en todo el país. Se compra en tiendas de conveniencia (GS25, CU, 7-Eleven) y se recarga en efectivo en máquinas del metro. Toca al entrar y al salir en cada puerta y en cada bus; si olvidas tocar al salir te cobran la tarifa máxima.",
    "u": "https://www.t-money.co.kr/"
   },
   {
    "t": "Climate Card 1 a 7 días · desde 5.000 ₩",
    "p": "Pase ilimitado de metro, bus urbano y bicicleta pública dentro de Seúl por 1, 2, 3, 5 o 7 días (5.000, 8.000, 10.000, 15.000 y 20.000 ₩). La validez empieza el día que lo cargas, no al primer toque, así que cárgalo la mañana en que empiezas a usarlo. Conviene si haces 4 o más viajes al día; no cubre el AREX exprés. Hay que sumar 3.000 ₩ por la tarjeta física (verificar).",
    "u": "https://www.seoul.go.kr/"
   },
   {
    "t": "AREX exprés y AREX parador",
    "p": "El exprés llega sin paradas a la estación de Seúl en unos 43 minutos (9.500 ₩, algunas fuentes dicen 11.000 ₩; no lo cubre la Climate Card). El parador tarda unos 58–66 minutos, cuesta unos 4.750–4.950 ₩ y sí está cubierto por la Climate Card. Compra en máquinas de la estación del aeropuerto.",
    "u": "https://www.arex.or.kr/"
   },
   {
    "t": "Bus limusina del aeropuerto",
    "p": "Buses cómodos con espacio para equipaje que van a hoteles y barrios como Myeongdong, Hongdae y Gangnam por unos 10.000–17.000 ₩ según la ruta. Conviene si tu alojamiento está cerca de una parada y llegas con maletas. Con tráfico tarda hasta 90 minutos.",
    "u": "https://www.airport.kr/ap_en/1514/subview.do"
   },
   {
    "t": "Taxi y apps (Kakao T, Uber)",
    "p": "La bajada de bandera ronda los 4.800 ₩ y hay recargo nocturno (verificar el porcentaje). Kakao T es la app más usada; Uber funciona en Corea conectando con taxis. Es práctico para volver tarde cuando el metro cierra.",
    "u": "https://www.seoultourism.org/seoul-taxi-guide/"
   }
  ],
  "consejos": [
   "Tarifa de transbordo: si pasas entre metro y bus en 30 minutos (60 minutos de 21:00 a 07:00) solo pagas la diferencia de distancia, siempre que uses la misma tarjeta y toques al salir.",
   "Cuidado: dos salidas de bus sin tocar seguidas pueden suspender la tarjeta 24 horas; toca siempre al bajar.",
   "Antes de comprar la Climate Card, cuenta tus viajes: con 4 o menos al día la T-money suele salir más barata."
  ],
  "trenes": "Korail opera el KTX hacia Busan, Gyeongju y otras ciudades desde la estación de Seúl y Yongsan; la compra va en letskorail.com o en la app Korail Talk, y el KR Pass existe para extranjeros (verificar precio actual). Desde el 1 de septiembre de 2026 Korail y SRT bajan tarifas alrededor de un 10 %.",
  "fuentes": [
   "https://blog.namanecard.com/en/seoul-subway-guide-2026-t-money-climate-card/",
   "https://mileasia.com/korea/incheon-airport-to-seoul-station/",
   "https://www.seoultourism.org/seoul-taxi-guide/",
   "https://www.airport.kr/ap_en/1514/subview.do"
  ],
  "dudas": [
   "Tarifa exacta del AREX exprés (9.500 ₩ vs 11.000 ₩)",
   "Tarifa actual del bus urbano (1.500 ₩ aproximada)",
   "Precio del billete de papel",
   "Recargo nocturno de taxi",
   "Si el Climate Card sigue vigente sin cambios en 2027"
  ]
 },
 "busan": {
  "operador": "Busan Transportation Corporation · Busan-Gimhae Light Rail · Korail",
  "llegada": "Del aeropuerto de Gimhae al centro: tren ligero Busan-Gimhae hasta Sasang y conexión al metro, por unos 1.600–1.800 ₩ con tarjeta (bajo 2.000 ₩ el trayecto combinado) y 30–50 minutos según el destino. El bus limusina a Haeundae o Seomyeon ronda los 7.500–9.500 ₩; un taxi al centro, 18.000–28.000 ₩ (estimaciones).",
  "local": "El metro de Busan (4 líneas principales) y los buses cubren las zonas turísticas: Haeundae, Gwangalli, Nampo y Jagalchi. Usa tarjeta de transporte (T-money o Hanaro) o las apps oficiales del metro y BUSAN Pay.",
  "tarifas": [
   [
    "Metro de Busan, hasta 10 km con tarjeta (verificar, desde 20-07-2026 según una guía)",
    "1.600 ₩"
   ],
   [
    "Bus urbano con tarjeta (verificar)",
    "aprox. 1.550 ₩"
   ],
   [
    "Bus urbano en efectivo (cifra de web municipal; verificar)",
    "1.700 ₩"
   ],
   [
    "Pase de metro de 1 día (adulto, app del metro; verificar)",
    "6.000 ₩"
   ],
   [
    "Pase de metro de 1 día (joven)",
    "4.000 ₩"
   ],
   [
    "Tren ligero aeropuerto-ciudad con tarjeta (verificar)",
    "1.600–1.800 ₩"
   ],
   [
    "Taxi, bajada de bandera (verificar)",
    "4.800 ₩"
   ],
   [
    "KTX Seúl–Busan (Korail desde 1-09-2026; verificar)",
    "aprox. 54.400 ₩"
   ]
  ],
  "pases": [
   {
    "t": "Tarjeta de transporte (T-money o Hanaro)",
    "p": "Se compra en tiendas de conveniencia y se recarga en efectivo en las máquinas del metro. Sirve en metro, bus, tren ligero y taxi. Desde el 19 de septiembre de 2025 los transbordos entre transporte público de Busan, Gimhae y Yangsan son gratuitos dentro de 30 minutos (se cobra la tarifa más alta). Toca al entrar y al salir.",
    "u": "https://www.busan.go.kr/eng/"
   },
   {
    "t": "Pase de metro de 1 día · 6.000 ₩ (adulto)",
    "p": "Se compra por la app oficial del metro de Busan o por BUSAN Pay (también hay un pase QR de 3 días; precio no confirmado). Conviene si haces 4 o más trayectos en el día, por ejemplo Haeundae, Gamcheon y Jagalchi. Verifica el precio actual.",
    "u": "https://www.humetro.busan.kr/"
   },
   {
    "t": "Tren ligero Busan-Gimhae",
    "p": "Conecta el aeropuerto de Gimhae con el metro en Sasang; el último tren sale cerca de las 23:30. Es la forma más barata y rápida de llegar al centro, y el transbordo al metro dentro de 30 minutos se cobra al precio del trayecto más caro, sin cargo extra.",
    "u": "https://www.busan.go.kr/eng/"
   },
   {
    "t": "KTX Seúl–Busan",
    "p": "Tarda un poco más de 2 horas y sale de la estación de Seúl hacia la estación de Busan. Korail bajó la tarifa de 59.800 ₩ a unos 54.400 ₩ el 1 de septiembre de 2026 (la prensa da cifras ligeramente distintas; verificar en la app). Compra en letskorail.com o Korail Talk.",
    "u": "https://www.letskorail.com/"
   },
   {
    "t": "Bus limusina del aeropuerto",
    "p": "Va a Haeundae, Seomyeon y otras zonas por unos 7.500–9.500 ₩ según una guía de turismo; la reorganización de rutas y tarifas anunciada a fines de 2025 puede haber cambiado los precios. Útil si tu hotel queda cerca de una parada.",
    "u": "https://www.asiae.co.kr/en/article/2025123113255094835"
   }
  ],
  "consejos": [
   "Para Haeundae y Gwangalli el metro es lo más cómodo; los buses sirven para Gamcheon y los barrios sin metro. Descarga Naver Map o KakaoMap, no Google Maps.",
   "Si vas a hacer varios saltos en un día, compara el pase de 6.000 ₩ con pagar cada viaje a 1.600 ₩: el pase gana a partir de 4 trayectos."
  ],
  "trenes": "Korail (KTX) une Busan con Seúl en poco más de 2 horas y hay unos 70 trenes diarios; para Gyeongju se usa el KTX a la estación Gyeongju (antes Singyeongju). Compra en letskorail.com o en la app Korail Talk.",
  "fuentes": [
   "https://www.busan.go.kr/eng/bsnews01/1758410",
   "https://ph.trip.com/guide/transport/busan-subway-map.html",
   "https://creatrip.com/en/news/852",
   "https://en.sedaily.com/finance/2026/08/05/korail-to-merge-ktx-and-srt-on-sept-1-cutting-fares-10"
  ],
  "dudas": [
   "Tarifa vigente del metro (1.300 ₩ en guías viejas, 1.600 ₩ en las recientes)",
   "Precio del pase de 3 días",
   "Precio actual del bus limusina del aeropuerto",
   "Precio KTX exacto tras el 1-09-2026",
   "Precio del KR Pass"
  ]
 },
 "gyeongju": {
  "operador": "Buses de Gyeongju · Korail · taxis",
  "llegada": "Hay dos estaciones: la estación Gyeongju (antes Singyeongju, KTX/SRT) está a unos 12 km del casco histórico y se une al centro en bus urbano (líneas como la 700, unos 11 minutos hasta la zona universitaria) por 1.250–1.500 ₩ o en taxi por 16.000–20.000 ₩ aproximados. Desde Busan se puede ir en KTX, tren regional o bus exprés.",
  "local": "El centro histórico, con los túmulos de Daereungwon y el museo, se recorre a pie o en bicicleta; para Bulguksa y Seokguram conviene bus urbano o taxi. Hay un bus turístico de ciudad con ruta diaria de 09:30 a 17:30 (precio no confirmado).",
  "tarifas": [
   [
    "Bus urbano con tarjeta (cifras de agregadores; verificar)",
    "1.250–1.500 ₩"
   ],
   [
    "Bus urbano 2018 (cifra oficial de HICO, adulto con tarjeta)",
    "1.650 ₩"
   ],
   [
    "Taxi estación KTX–centro (estimación)",
    "16.000–20.000 ₩"
   ],
   [
    "Bus turístico de la ciudad (09:30–17:30)",
    "verificar"
   ],
   [
    "Alquiler de bicicleta",
    "verificar"
   ],
   [
    "KTX Seúl–Gyeongju",
    "verificar en letskorail.com"
   ]
  ],
  "pases": [
   {
    "t": "Tarjeta de transporte (T-money)",
    "p": "Úsala en los buses urbanos de Gyeongju; se compra en tiendas de conveniencia, incluida la del primer piso de la estación Singyeongju según una guía de 2018 (verificar). Toca al subir y al bajar.",
    "u": "https://www.gyeongju.go.kr/open_content/eng/page.do?mnu_uid=1370"
   },
   {
    "t": "Bus urbano · 700 y otras líneas",
    "p": "Conecta la estación KTX con el centro y con Bulguksa; los precios varían según agregadores (1.250–1.500 ₩). Verifica la tarifa vigente al subir; la línea y la frecuencia cambian con los años.",
    "u": "https://www.gyeongju.go.kr/open_content/english/page.do?mnu_uid=2583"
   },
   {
    "t": "Bus turístico de Gyeongju",
    "p": "Recorrido diario de 09:30 a 17:30 por los lugares principales. Conviene si tienes un solo día y no quieres coordinar buses; no encontré el precio, así que verifícalo en el sitio de turismo de Gyeongju.",
    "u": "https://www.gyeongju.go.kr/open_content/english/page.do?mnu_uid=2583"
   },
   {
    "t": "Taxi",
    "p": "Es la opción más cómoda para Seokguram y Bulguksa si vas en grupo o con poco tiempo. Calcula 16.000–20.000 ₩ de la estación KTX al centro. Las apps coreanas (Kakao T) funcionan, pero puede costar encontrar conductor en zonas turísticas.",
    "u": "https://www.gyeongju.go.kr/open_content/english/page.do?mnu_uid=2583"
   }
  ],
  "consejos": [
   "Alquila bicicleta para el casco histórico, que es plano y pequeño; deja Bulguksa y Seokguram para bus o taxi.",
   "Confirma en qué estación bajas: el KTX para en Gyeongju (antes Singyeongju), lejos del centro."
  ],
  "trenes": "Korail (KTX/SRT) para en la estación Gyeongju (antes Singyeongju); desde Seúl el viaje ronda las 2 h y desde Busan unos 30–40 minutos en KTX (estimación, verificar). Compra en letskorail.com o Korail Talk.",
  "fuentes": [
   "https://www.gyeongju.go.kr/open_content/eng/page.do?mnu_uid=1370",
   "https://www.rome2rio.com/s/Singyeongju/Gyeongju",
   "https://hico.or.kr/images/mice/hico/download/Transportation_Guide_to_Gyeongju_HICO_2018.pdf",
   "https://koreatodo.com/gyeongju-day-trip"
  ],
  "dudas": [
   "Tarifa de bus urbano vigente en 2026 (hay cifras entre 1.250 y 1.650 ₩)",
   "Precio del bus turístico",
   "Bicicletas: dónde y cuánto",
   "Tiempos y precios actuales de tren Seúl y Busan a Gyeongju"
  ]
 },
 "jeju": {
  "operador": "Buses de Jeju · taxis · Jeju Travel (visitjeju.net)",
  "llegada": "Del aeropuerto de Jeju al centro de Jeju City el aeropuerto queda a unos minutos: bus de línea o taxi (KakaoTaxi ronda los 6 USD según una guía). El Limusina 600 va hacia Jungmun y Seogwipo por unos 5.000–5.500 ₩ (varía por distancia), y el bus exprés al terminal interurbano a Seogwipo cuesta unos 3.300 ₩ (guía de 2026).",
  "local": "No hay trenes. Para ver la isla lo normal es alquilar coche; sin coche hay buses de ruta que cubren los principales destinos con menor frecuencia y taxis que se llaman por apps coreanas.",
  "tarifas": [
   [
    "Bus urbano en efectivo (cifra de una guía; verificar)",
    "1.200 ₩"
   ],
   [
    "Bus urbano con T-money (cifra de una guía)",
    "aprox. 1.139 ₩"
   ],
   [
    "Bus exprés/interurbano Jeju–Seogwipo (guía 2026; verificar)",
    "3.300 ₩"
   ],
   [
    "Limusina 600 al aeropuerto de Seogwipo (varía por distancia)",
    "5.000–5.500 ₩"
   ],
   [
    "Taxi, bajada de bandera (blog 2026; verificar)",
    "3.297 ₩"
   ],
   [
    "Coche compacto de alquiler por día (estimación)",
    "aprox. 65.000 ₩"
   ],
   [
    "KakaoTaxi aeropuerto–centro (guía)",
    "aprox. 6 USD"
   ]
  ],
  "pases": [
   {
    "t": "Bus 600 · Limusina del aeropuerto",
    "p": "Línea de buses que parte del aeropuerto de Jeju con paradas distribuidas por la isla; el precio depende de la distancia y empieza en unos 1.100 ₩. Acepta efectivo o T-money, y el conductor no da cambio. Opera aproximadamente de 06:00 a 22:40 según una guía de 2026 (verificar).",
    "u": "https://southkoreahallyu.com/jeju-airport-limousine-bus-600/"
   },
   {
    "t": "Buses de Jeju (rojos, azules y verdes)",
    "p": "Los buses de ruta cubren Jeju City, Seogwipo y los atractivos principales, pero con menos frecuencia que en Seúl. Pagas con T-money o efectivo; la tarifa ronda los 1.200 ₩ y hay una propuesta de subirla que no pude confirmar. Revisa las rutas en visitjeju.net.",
    "u": "https://www.visitjeju.net/"
   },
   {
    "t": "Alquiler de coche",
    "p": "Es la opción práctica para recorrer la isla. Necesitas licencia de conducir internacional válida (verificar requisitos con el alquilador). Reserva con anticipación en temporada alta; conduce con cuidado en caminos costeros y gasolineras poco frecuentes.",
    "u": "https://www.visitjeju.net/"
   },
   {
    "t": "Taxi y KakaoTaxi",
    "p": "Con la app Kakao T puedes pedir taxi desde casi cualquier lugar; también hay taxi turístico por horas, útil si no alquilas coche. Acuerda el precio antes de partir si es un recorrido de varias paradas.",
    "u": "https://www.visitjeju.net/"
   }
  ],
  "consejos": [
   "Si no alquilas coche, concentra tus visitas en la zona de Jeju City, Seogwipo y Jungmun, y planifica con los horarios de bus, que son poco frecuentes fuera de las rutas principales.",
   "Descarga Naver Map o KakaoMap: Google Maps funciona mal en Corea."
  ],
  "trenes": "En Jeju no hay tren; llegas en avión desde Seúl (Gimpo) o Busan, o en ferry desde algunos puertos del continente. Compara precios de vuelos en aerolíneas coreanas (verificar).",
  "fuentes": [
   "https://sg.trip.com/guide/transport/jeju-transport.html",
   "https://southkoreahallyu.com/jeju-airport-limousine-bus-600/",
   "https://mileasia.com/korea/jeju-airport-to-seogwipo/",
   "https://www.visitjeju.net/"
  ],
  "dudas": [
   "Tarifa de bus urbano vigente en 2026 (1.200 ₩ o subida propuesta)",
   "Tarifa exacta de la línea 600 según destino",
   "Requisito de permiso de conducir internacional",
   "Precio de taxi y de coche de alquiler"
  ]
 },
 "paris": {
  "operador": "RATP · Île-de-France Mobilités",
  "llegada": "Charles de Gaulle → centro: RER B (~14 €, 35 min). Orly: metro línea 14 o tranvía T7. El boleto normal de 2,55 € no sirve para los aeropuertos.",
  "local": "El metro llega a casi todo. Se paga con boleto en la app Bonjour RATP o con tarjeta Navigo.",
  "tarifas": [
   [
    "Boleto metro / RER / tren (Île-de-France)",
    "2,55 €"
   ],
   [
    "Boleto bus / tranvía",
    "2,05 €"
   ],
   [
    "Boleto aeropuertos (CDG u Orly)",
    "14 €"
   ],
   [
    "Navigo Jour (1 día, todas las zonas, sin aeropuertos)",
    "12,30 €"
   ],
   [
    "Navigo Semaine (lunes a domingo, todas las zonas)",
    "32,40 € + tarjeta 5 €"
   ],
   [
    "Paris Visite 1 / 2 / 3 / 5 días (zonas 1–5)",
    "30,60 / 45,40 / 63,80 / 78 €"
   ]
  ],
  "pases": [
   {
    "t": "Boleto suelto metro / RER / tren · 2,55 €",
    "p": "Un viaje en metro, RER o tren dentro de Île-de-France, con combinaciones dentro de la misma red. Se compra en la app Bonjour RATP o se carga en una tarjeta Navigo Easy (2 €, sin foto, recargable). Conviene en días con pocos traslados.",
    "u": "https://www.bonjour-ratp.fr/titres-tarifs/"
   },
   {
    "t": "Boleto bus / tranvía · 2,05 €",
    "p": "Solo bus o tranvía, con combinaciones bus–tranvía durante 90 minutos. No sirve para el metro.",
    "u": ""
   },
   {
    "t": "Boleto aeropuertos · 14 €",
    "p": "Para ir o volver de Charles de Gaulle (RER B) u Orly (metro 14). Si tienes Navigo Semaine esa semana, el aeropuerto ya está incluido.",
    "u": "https://www.bonjour-ratp.fr/titres-tarifs/ticket-paris-region-aeroports/"
   },
   {
    "t": "Navigo Jour · 12,30 € por día",
    "p": "Viajes ilimitados en metro, RER, tren, bus y tranvía de todas las zonas durante un día calendario, excepto aeropuertos. Equivale a ~5 boletos sueltos: conviene un día con 5 o más viajes, por ejemplo Versalles y después recorrer París.",
    "u": "https://www.bonjour-ratp.fr/titres-tarifs/forfait-navigo-jour/"
   },
   {
    "t": "Navigo Semaine · 32,40 € (lunes a domingo)",
    "p": "Viajes ilimitados de lunes 0:00 a domingo 23:59 en todas las zonas: incluye aeropuertos, Versalles, Fontainebleau y Disneyland. Va en la tarjeta Navigo Découverte (5 €, una sola vez, con nombre y foto tipo carnet) o en un celular compatible. Es siempre de lunes a domingo, no 7 días desde la compra; la semana en curso se vende solo hasta el jueves. Conviene en semanas con más de ~13 viajes.",
    "u": "https://parisienneries.fr/expos/navigo-decouverte-paris-visite-ou-ticket-journee-quel-pass-choisir-pour-3-a-7-jours-a-paris-2026/"
   },
   {
    "t": "Paris Visite · desde 30,60 € (1 día)",
    "p": "Pase turístico de 1, 2, 3 o 5 días seguidos (zonas 1–5, con aeropuertos) con algunos descuentos en atracciones. Cuesta mucho más que el Navigo: 3 días valen el doble del Navigo Semaine. Solo podría servir en una estadía muy corta que cae a mitad de semana.",
    "u": ""
   }
  ],
  "consejos": [
   "Con Navigo Semaine el aeropuerto ya está incluido.",
   "Descargar la app Bonjour RATP para comprar boletos en el celular."
  ],
  "trenes": "SNCF Connect para escapadas: Ouigo es el más barato (equipaje limitado, sin descuentos); TGV INOUI admite descuentos. Carte Avantage (49 €/año) da 30 % en TGV INOUI e Intercités.",
  "fuentes": [
   "https://parisienneries.fr/expos/navigo-decouverte-paris-visite-ou-ticket-journee-quel-pass-choisir-pour-3-a-7-jours-a-paris-2026/",
   "https://www.voyagerentrain.fr/guide-carte-avantage-sncf/"
  ],
  "dudas": [
   "Verificar tarifas en RATP y SNCF antes de comprar."
  ]
 },
 "londres": {
  "operador": "Transport for London (TfL)",
  "llegada": "Heathrow → centro: Elizabeth line (~14 £, 35 min) o línea Piccadilly (~6 £, más barata y entra en el tope). El Heathrow Express no entra en el tope.",
  "local": "En Londres no se compra pase: se paga cada viaje acercando la tarjeta sin contacto o el celular, y el sistema cobra como máximo el tope diario y semanal. Cada persona con su propia tarjeta, siempre la misma.",
  "tarifas": [
   [
    "Metro zona 1 (hora punta / resto)",
    "£3,10 / £3,00"
   ],
   [
    "Bus",
    "£1,75 (£1,85 desde 1 nov)"
   ],
   [
    "Tope diario metro + bus zonas 1–2",
    "£8,90"
   ],
   [
    "Tope semanal zonas 1–2 (lunes a domingo)",
    "£44,70"
   ],
   [
    "Tope diario solo bus",
    "£5,25 (£5,55 desde 1 nov)"
   ]
  ],
  "pases": [
   {
    "t": "Sin contacto con tope automático",
    "p": "No hace falta Oyster ni pase. Se acerca la misma tarjeta o celular al entrar y al salir; cuando se llega al tope del día, los demás viajes son gratis. Si usas tarjetas distintas, el sistema no las suma.",
    "u": "https://tfl.gov.uk/fares"
   },
   {
    "t": "Bus: más barato y se ve la ciudad",
    "p": "El bus cuesta mucho menos que el metro y tiene su propio tope diario. No se paga en efectivo.",
    "u": ""
   }
  ],
  "consejos": [
   "Desde Heathrow, la línea Piccadilly es la más barata y entra en el tope.",
   "Viajar en bus cuando se pueda: más barato y se ve la ciudad."
  ],
  "trenes": "Eurostar Londres → París: comprar cuanto antes en eurostar.com; control de pasaportes en St Pancras, llegar ~90 min antes.",
  "fuentes": [
   "https://www.londontravelgeek.co.uk/articles/london-public-transport-costs-and-fares/"
  ],
  "dudas": [
   "Verificar tarifas en TfL antes de comprar."
  ]
 }
};
