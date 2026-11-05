// Paquete de ciudad: Edimburgo (Escocia). Mismo formato de atracciones que v2/trips/paris.data.js.
// Precios en € por persona (adulto), convertidos a ~1,17 €/£; datos de 2025: verificar antes de reservar.
// Campos: id n ll[lat,lng] h(horas) p(€) in(1=techada) close(hora de cierre) cl(días cerrado 0=dom) top(imperdible) z(zona) t(tipo) s(qué es) v(qué ver) d(consejo) u(web)
export const CIUDAD={
  id:"edimburgo",n:"Edimburgo",pais:"escocia",p:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",ll:[55.9533,-3.1883],geo:", Edinburgh",
  moneda:{code:"GBP",sym:"£",eur:1.17},transit:"buses Lothian y tranvía",idioma:"inglés (con acento escocés)",
  verificado:false,fuente:"Conocimiento general 2025; precios y horarios por confirmar",
  resumen:"Capital de Escocia sobre un volcán extinto: castillo, Milla Real, colinas para ver la ciudad y museos gratis. Se recorre a pie; hay mucha cuesta y empedrado.",
  mejorEpoca:"Mayo–septiembre (festivales en agosto); diciembre por Hogmanay (31 dic) con mercado navideño. Siempre llevar capas y cortaviento.",
  dias:{ideal:3,minimo:2}
};

export const ZONAS={
  oldtown:"Old Town (Milla Real)",newtown:"New Town",calton:"Calton Hill",holy:"Holyrood y Arthur's Seat",
  grass:"Grassmarket y Greyfriars",west:"West End y Dean Village",stock:"Stockbridge y Botánico",leith:"Leith",fuera:"Fuera del centro"
};

export const ATRACCIONES=[
 {id:"ed_castillo",t:"mon",n:"Castillo de Edimburgo",ll:[55.9486,-3.1999],h:3,p:27,in:0,close:17,top:1,z:"oldtown",
  s:"La fortaleza sobre la roca volcánica que domina la ciudad; guarda las joyas de la corona escocesa.",v:"Las Honras de Escocia (joyas), la Piedra del Destino, la capilla de St Margaret (la más antigua de la ciudad) y el cañón Mons Meg. El cañonazo de la 1 p. m. se oye desde toda la ciudad (lun–sáb).",d:"Comprar entrada con hora en línea: se agota. Primera hora de la mañana o última de la tarde, menos gente.",u:"https://www.edinburghcastle.scot/"},
 {id:"ed_milla",t:"bar",n:"Royal Mile (Milla Real)",ll:[55.9502,-3.1875],h:1.5,p:0,in:0,top:1,z:"oldtown",
  s:"La calle histórica que baja del castillo al palacio de Holyrood, con callejones («closes») a cada lado.",v:"Tiendas de tartán y whisky, músicos callejeros, los closes escondidos y la casa de John Knox.",d:"Bajarla desde el castillo al palacio. Los «closes» (pasajes) valen la pena: Advocates, Lady Stair's y Mary King's.",u:"https://www.edinburgh.org/"},
 {id:"ed_holyrood",t:"pal",n:"Palacio de Holyroodhouse",ll:[55.9525,-3.1720],h:2,p:23,in:1,close:17,cl:[],z:"holy",
  s:"Residencia oficial del rey en Escocia y antiguo hogar de María Estuardo.",v:"Las salas de estado, las habitaciones de María Estuardo y las ruinas de la abadía junto al palacio.",d:"Cierra cuando hay actos oficiales de la familia real; mirar el calendario. Incluye audioguía.",u:"https://www.rct.uk/visit/the-palace-of-holyroodhouse"},
 {id:"ed_stgiles",t:"igl",n:"Catedral de St Giles",ll:[55.9495,-3.1909],h:.75,p:0,in:1,close:17,z:"oldtown",
  s:"La iglesia principal de Edimburgo, con su corona de piedra, en pleno centro de la Milla Real.",v:"La capilla del Cardo (Thistle Chapel) con techo tallado, los vitrales y la tumba de Robert Louis Stevenson (memorial).",d:"Entrada gratuita con donación sugerida; pagar por sacar fotos.",u:"https://stgilescathedral.org.uk/"},
 {id:"ed_arthur",t:"nat",n:"Arthur's Seat",ll:[55.9441,-3.1618],h:2.5,p:0,in:0,top:1,z:"holy",
  s:"La colina volcánica dentro de la ciudad: 251 m de subida con vista a todo Edimburgo y al mar.",v:"La vista panorámica desde la cima, Salisbury Crags y el lago St Margaret.",d:"Subida de 45–60 min por el lado de Dunsapie para quienes no quieren cuesta fuerte. Llevar zapatillas y cortaviento; no ir con lluvia o viento fuerte.",u:"https://www.historicenvironment.scot/visit-a-place/places/arthurs-seat/"},
 {id:"ed_calton",t:"mir",n:"Calton Hill",ll:[55.9553,-3.1827],h:1,p:0,in:0,z:"calton",
  s:"Mirador en una colina baja con monumentos de aspecto griego: la mejor vista del atardecer sin mucho esfuerzo.",v:"El Monumento Nacional (el «Partenón inacabado»), el monumento a Nelson y la vista a la Milla Real y Arthur's Seat.",d:"Subida de 10 min. Ideal al atardecer o con el cielo despejado.",u:"https://www.edinburgh.org/"},
 {id:"ed_museo",t:"mus",n:"Museo Nacional de Escocia",ll:[55.9470,-3.1898],h:2.5,p:0,in:1,close:17,top:1,z:"oldtown",
  s:"Historia de Escocia, ciencia, naturaleza y culturas del mundo en un edificio gigante, gratis.",v:"La oveja Dolly (disecada), el esqueleto de un T. rex, las piezas de ajedrez de Lewis y la terraza con vista desde el techo.",d:"Entrada gratis. Subir a la terraza (Roof Terrace) para fotos del castillo. Cafetería en el último piso.",u:"https://www.nms.ac.uk/national-museum-of-scotland"},
 {id:"ed_marykings",t:"his",n:"The Real Mary King's Close",ll:[55.9500,-3.1904],h:1.25,p:25,in:1,close:21,z:"oldtown",
  s:"Calles y casas de los siglos XVII al XIX que quedaron enterradas bajo el edificio municipal.",v:"Recorrido guiado con actores por las casas, la historia de la peste y las condiciones de vida de la Edimburgo antigua.",d:"Solo con visita guiada y hora fija; reservar en línea. No apto para claustrofóbicos.",u:"https://www.realmarykingsclose.com/"},
 {id:"ed_scott",t:"mon",n:"Scott Monument",ll:[55.9496,-3.1934],h:.75,p:9,in:0,close:18,z:"newtown",
  s:"El monumento gótico más grande del mundo dedicado a un escritor (Walter Scott).",v:"Una escalera de caracol de 287 escalones y desde arriba, la vista al castillo y a Princes Street.",d:"Escalera estrecha y empinada; no apta con mucha gente ni con miedo a las alturas.",u:"https://www.edinburghmuseums.org.uk/venue/scott-monument"},
 {id:"ed_princes",t:"par",n:"Princes Street Gardens",ll:[55.9511,-3.1963],h:1,p:0,in:0,z:"newtown",
  s:"El parque al pie del castillo, entre la Ciudad Vieja y la Nueva.",v:"El reloj floral, la fuente Ross, la vista al castillo y los conciertos de verano.",d:"Bueno para descansar entre visitas; en invierno aquí está el mercado navideño.",u:"https://www.edinburgh.gov.uk/"},
 {id:"ed_dean",t:"bar",n:"Dean Village",ll:[55.9525,-3.2188],h:1,p:0,in:0,z:"west",
  s:"Un antiguo barrio de molinos junto al río Water of Leith, escondido a 10 min del centro.",v:"Casas de ladrillo rojo, el puente de Dean y el paseo junto al río hacia Stockbridge.",d:"Combinarlo con Stockbridge y el Botánico en una caminata por el río (45 min).",u:"https://www.edinburgh.org/"},
 {id:"ed_ng",t:"mus",n:"Galería Nacional de Escocia",ll:[55.9509,-3.1957],h:1.5,p:0,in:1,close:17,z:"newtown",
  s:"Pintura europea de Rafael a Van Gogh y arte escocés, gratis, bajo la colina del castillo.",v:"Obras de Rafael, Velázquez, Monet y de pintores escoceses como Raeburn.",d:"Gratis. Buen plan si llueve.",u:"https://www.nationalgalleries.org/visit/scottish-national-gallery"},
 {id:"ed_modern",t:"mus",n:"Galería Nacional de Arte Moderno",ll:[55.9510,-3.2290],h:2,p:0,in:1,close:17,z:"west",
  s:"Dos edificios de arte moderno y contemporáneo con esculturas al aire libre.",v:"Picasso, Dalí, Hockney y el paisaje terrestre de Charles Jencks en el jardín.",d:"Está a 25 min a pie del centro por el río; combinar con Dean Village.",u:"https://www.nationalgalleries.org/visit/scottish-national-gallery-modern-art"},
 {id:"ed_botanico",t:"par",n:"Jardín Botánico Real",ll:[55.9654,-3.2093],h:2,p:0,in:0,close:18,z:"stock",
  s:"Uno de los jardines botánicos más antiguos de Gran Bretaña, con vista a la ciudad.",v:"Los invernaderos (Glasshouses, pagados), el jardín chino y las vistas al castillo.",d:"El jardín es gratis; los invernaderos tienen entrada (~8 €).",u:"https://www.rbge.org.uk/"},
 {id:"ed_camera",t:"ent",n:"Camera Obscura y Mundo de las Ilusiones",ll:[55.9488,-3.1953],h:1.5,p:26,in:1,close:21,z:"oldtown",
  s:"Museo de ilusiones ópticas con una cámara oscura victoriana en la torre y una terraza con vista.",v:"Espejos, túneles, hologramas y la vista de 360° desde la azotea.",d:"Bueno para adolescentes y días de lluvia. Comprar en línea para evitar la fila.",u:"https://www.camera-obscura.co.uk/"},
 {id:"ed_whisky",t:"ent",n:"The Scotch Whisky Experience",ll:[55.9490,-3.1978],h:1.25,p:26,in:1,close:18,z:"oldtown",
  s:"Visita guiada a las regiones del whisky escocés con degustación (los menores no beben).",v:"Un paseo en barril, la mayor colección de whisky del mundo y una cata.",d:"Para menores hay entrada sin degustación (consultar). Reservar con hora.",u:"https://www.scotchwhiskyexperience.co.uk/"},
 {id:"ed_britannia",t:"mus",n:"Royal Yacht Britannia",ll:[55.9826,-3.1772],h:2.5,p:25,in:1,close:17,z:"leith",
  s:"El yate de la familia real británica, hoy museo amarrado en Leith.",v:"Los salones, la sala de máquinas y la cubierta; la tienda y el té a bordo.",d:"Está en el centro comercial Ocean Terminal, a 20 min en bus (11, 22, 34).",u:"https://www.royalyachtbritannia.co.uk/"},
 {id:"ed_zoo",t:"fam",n:"Zoológico de Edimburgo",ll:[55.9423,-3.2686],h:3,p:32,in:0,close:17,z:"fuera",
  s:"Zoológico en una colina con la marcha diaria de los pingüinos.",v:"Los pingüinos reales, koalas, tigres de Amur y las vistas desde la colina.",d:"Bus 12/26/31; para quienes viajan con niños. Cuesta arriba.",u:"https://www.edinburghzoo.org.uk/"},
 {id:"ed_writers",t:"mus",n:"Museo de los Escritores",ll:[55.9500,-3.1932],h:.75,p:0,in:1,close:17,cl:[1],z:"oldtown",
  s:"Museo gratuito sobre Robert Burns, Walter Scott y Robert Louis Stevenson.",v:"Manuscritos, objetos personales y el patio de Lady Stair's Close.",d:"Cierra los lunes. Muy corto; combinar con la Milla Real.",u:"https://www.edinburghmuseums.org.uk/venue/writers-museum"},
 {id:"ed_museoed",t:"mus",n:"Museo de Edimburgo",ll:[55.9515,-3.1795],h:.75,p:0,in:1,close:17,z:"oldtown",
  s:"Historia de la ciudad en una casa del siglo XVI.",v:"La historia de Greyfriars Bobby (el perrito leal) y muebles antiguos.",d:"Gratis. De paso a Holyrood.",u:"https://www.edinburghmuseums.org.uk/venue/museum-edinburgh"},
 {id:"ed_greyfriars",t:"his",n:"Greyfriars Kirkyard y Bobby",ll:[55.9469,-3.1913],h:.75,p:0,in:0,z:"grass",
  s:"Cementerio histórico, famoso por Greyfriars Bobby, el perro que guardó la tumba de su amo 14 años.",v:"La estatua de Bobby en la entrada, las tumbas de las que J. K. Rowling sacó nombres para sus libros y la vista al castillo.",d:"Gratis. Cerca del Museo Nacional y de The Elephant House (café de Harry Potter).",u:"https://www.greyfriarskirk.com/"},
 {id:"ed_victoria",t:"bar",n:"Victoria Street y Grassmarket",ll:[55.9487,-3.1951],h:.75,p:0,in:0,z:"grass",
  s:"La calle curva de colores que inspiró el Callejón Diagon, con la plaza del mercado antiguo abajo.",v:"Tiendas de bromas y de magia, la tienda de varitas y los pubs del Grassmarket.",d:"Va bien a primera hora, antes de que se llene.",u:"https://www.edinburgh.org/"},
 {id:"ed_surgeons",t:"mus",n:"Surgeons' Hall Museums",ll:[55.9448,-3.1869],h:1.5,p:14,in:1,close:17,z:"grass",
  s:"Museo de medicina y anatomía, con una colección muy impactante.",v:"Muestras anatómicas, el cuaderno del asesino Burke (con pasta hecha de su piel) y la historia de la cirugía.",d:"Fuerte para menores sensibles; ideal para curiosos.",u:"https://museum.rcsed.ac.uk/"},
 {id:"ed_dynamic",t:"cie",n:"Dynamic Earth",ll:[55.9503,-3.1746],h:2,p:23,in:1,close:17,z:"holy",
  s:"Museo interactivo sobre la historia de la Tierra, frente al Parlamento.",v:"Volcanes, un planetario, glaciares y simulaciones de terremotos.",d:"Bueno para días de lluvia y adolescentes.",u:"https://www.dynamicearth.co.uk/"},
 {id:"ed_parlamento",t:"his",n:"Parlamento Escocés",ll:[55.9524,-3.1747],h:1,p:0,in:1,close:17,cl:[0,1],z:"holy",
  s:"Edificio moderno de arquitectura muy discutida, sede del Parlamento.",v:"La sala de debates desde la galería pública y la fachada de bambú y cobre.",d:"Entrada gratis con control de seguridad; cierra domingos y lunes.",u:"https://www.parliament.scot/visit-and-learn"},
 {id:"ed_knox",t:"his",n:"Casa de John Knox",ll:[55.9503,-3.1864],h:.75,p:9,in:1,close:17,z:"oldtown",
  s:"Una de las casas más antiguas de la Milla Real, ligada al reformador John Knox.",v:"Salas con muebles de la época y una vista del Royal Mile desde arriba.",d:"Corto; opcional si hay poco tiempo.",u:"https://www.scottishstorytellingcentre.com/john-knox-house/"},
 {id:"ed_infancia",t:"mus",n:"Museo de la Infancia",ll:[55.9502,-3.1862],h:1,p:0,in:1,close:17,z:"oldtown",
  s:"Un museo de juguetes antiguos, gratis, en la Milla Real.",v:"Muñecas, trenes y juegos de distintas épocas.",d:"Para quienes disfrutan lo nostálgico; ágil.",u:"https://www.edinburghmuseums.org.uk/venue/museum-childhood"},
 {id:"ed_craigmillar",t:"cas",n:"Castillo de Craigmillar",ll:[55.9249,-3.1426],h:1.5,p:9,in:0,close:17,z:"fuera",
  s:"Castillo medieval en ruinas, poco visitado, donde estuvo María Estuardo.",v:"El torreón, los patios y la vista a Arthur's Seat desde el sur.",d:"Bus 2 o 30 desde el centro; verificar horario según temporada.",u:"https://www.historicenvironment.scot/visit-a-place/places/craigmillar-castle/"},
 {id:"ed_portobello",t:"nat",n:"Playa de Portobello",ll:[55.9553,-3.1129],h:1.5,p:0,in:0,z:"fuera",
  s:"La playa de la ciudad, con paseo marítimo, cafés y piscina victoriana.",v:"El paseo, los helados y el baño de pies (o de valientes) en el Mar del Norte.",d:"Bus 26 o 15 desde el centro (25 min). Para días de sol.",u:"https://www.edinburgh.org/"},
 {id:"ed_cramond",t:"nat",n:"Cramond Island",ll:[55.9777,-3.2989],h:2,p:0,in:0,z:"fuera",
  s:"Isla a la que se llega caminando por una calzada con la marea baja.",v:"El paseo por el dique de la Segunda Guerra, la vista al puente del Forth y la aldea de Cramond.",d:"MUY IMPORTANTE: mirar la tabla de mareas; hay gente atrapada cada año. Volver 1 h antes de la marea alta.",u:"https://www.edinburgh.gov.uk/"},
 {id:"ed_leith",t:"bar",n:"The Shore, Leith",ll:[55.9755,-3.1695],h:1.5,p:0,in:0,z:"leith",
  s:"El antiguo puerto, hoy con restaurantes de pescado y bares junto al agua.",v:"El paseo del Water of Leith, los barcos y la gastronomía de marisco.",d:"Buen lugar para cenar; combinar con el Britannia.",u:"https://www.edinburgh.org/"},
 {id:"ed_stockbridge",t:"mer",n:"Mercado de Stockbridge (domingos)",ll:[55.9585,-3.2100],h:1,p:0,in:0,close:17,cl:[1,2,3,4,5,6],z:"stock",
  s:"Mercado de comida y artesanía en un barrio tranquilo y elegante.",v:"Puestos de comida callejera, panes, quesos y dulces; las tiendas de segunda mano.",d:"Solo domingos. Después, pasear por el río hasta Dean Village.",u:"https://www.stockbridgemarket.com/"},
 {id:"ed_rosslyn",t:"igl",n:"Capilla de Rosslyn",ll:[55.8555,-3.1599],h:1.5,p:15,in:1,close:17,z:"fuera",
  s:"Capilla del siglo XV famosa por «El código Da Vinci» y sus tallados de piedra.",v:"La columna del Aprendiz, los tallados con símbolos misteriosos y el pueblo de Roslin.",d:"A 11 km: bus 37 desde el centro (35 min). Solo con reserva en temporada alta.",u:"https://www.rosslynchapel.com/"},
 {id:"ed_forth",t:"nat",n:"Puentes del Forth y South Queensferry",ll:[55.9900,-3.4020],h:2.5,p:25,in:0,z:"fuera",
  s:"Tres puentes sobre el estuario: el rojo ferroviario (de 1890), el colgante y el nuevo.",v:"El puente del Forth (Patrimonio Mundial) y el paseo en barco bajo los puentes.",d:"Tren a Dalmeny (15 min) y 20 min a pie al pueblo. Verificar horarios del barco (Maid of the Forth).",u:"https://www.maidoftheforth.co.uk/"},
 {id:"ed_circus",t:"bar",n:"Circus Lane y Stockbridge",ll:[55.9585,-3.2060],h:.75,p:0,in:0,z:"stock",
  s:"Una de las calles más fotografiadas de la ciudad, con casitas de piedra y flores.",v:"Las fachadas de colores, las macetas y el ambiente de barrio.",d:"Primera hora de la mañana para evitar a los fotógrafos.",u:"https://www.edinburgh.org/"}
];

// Escapadas desde Edimburgo (día o noche); `tr` = tiempo de viaje desde Waverley
export const ESCAPADAS=[
 {id:"ed_stirling",n:"Stirling",p:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",k:"dia",tr:"50 min (tren)",nt:"0–1",t:"Castillo de Stirling, monumento a Wallace y el campo de batalla de Bannockburn.",ll:[56.1239,-3.9477],tags:["castillo","historia"]},
 {id:"ed_stand",n:"St Andrews",p:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",k:"ambos",tr:"~1 h 40 (tren a Leuchars + bus)",nt:"0–1",t:"La cuna del golf, universidad medieval y ruinas de catedral frente al mar.",ll:[56.3398,-2.7967],tags:["golf","universidad","costa"]},
 {id:"ed_glasgow",n:"Glasgow",p:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",k:"ambos",tr:"50 min (tren)",nt:"0–1",t:"Ciudad más grande de Escocia: museos gratuitos, arte y arquitectura de Mackintosh.",ll:[55.8642,-4.2518],tags:["museos","arte"]},
 {id:"ed_highlands",n:"Highlands y Loch Ness (tour)",p:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",k:"dia",tr:"~3 h de ida (bus de tour)",nt:"0",t:"Excursión de un día en bus: Glencoe, Loch Ness y los paisajes de las Tierras Altas; jornada muy larga (12–13 h).",ll:[57.3229,-4.4244],tags:["paisaje","naturaleza"]}
];

// Comidas: opciones por tiempo (nombre, precio €) para el organizador de días
export const COMIDAS={
  d:[["Desayuno escocés en café",13],["Porridge o café + scone",8],["En el alojamiento",0]],
  a:[["Pub: fish & chips o pie",16],["Sándwich o soup & sandwich (Pret, Greggs)",8],["Haggis, neeps & tatties en pub",15]],
  m:[["Té con scones",11],["Shortbread y café",6]],
  c:[["Pub tradicional (plato principal)",20],["Restaurante de pescado (Leith)",32],["Supermercado (Tesco, Sainsbury's)",9]]
};

export const GUIA_COMIDA=[
 {t:"🥣 Platos de Escocia",c:"#b8860b",r:[["Haggis, neeps & tatties (menudencias de oveja con puré de nabo y papa)","12–17 €"],["Cullen skink (sopa de pescado ahumado y papa)","7–10 €"],["Scotch pie (empanada de carne)","3–5 €"],["Fish & chips","12–17 €"],["Desayuno escocés completo (con black pudding)","10–15 €"],["Cranachan o sticky toffee pudding (postre)","6–8 €"]],n:"El haggis también tiene versión vegetariana. Pedir «neeps & tatties» de guarnición."},
 {t:"🥪 Al paso y barato",c:"#a8352b",r:[["Greggs (sausage roll o bakes)","2–5 €"],["Meal deal de supermercado (sándwich + bebida + snack)","4–5 €"],["Papas con salsa o curry en barra","6–9 €"],["Comida callejera (mercado de Stockbridge)","7–12 €"],["Café con scone","6–8 €"]],n:"Meal deal de Tesco/Boots/Co-op es el almuerzo más barato; comer en Princes Street Gardens."},
 {t:"🍴 Cenas",c:"#2e5aac",r:[["Pub tradicional: plato principal","15–22 €"],["Restaurante de pescado en Leith","25–40 €"],["Cocina india (barrio de Newington)","15–22 €"],["Pizza o pasta","12–18 €"]],n:"Reservar con anticipación en agosto y diciembre. Muchos pubs sirven hasta las 21:00."}
];

export const BARRIOS=[
 {n:"Old Town",d:"Milla Real, castillo, museos. Lo más turístico y caro; muchas cuestas y empedrado."},
 {n:"New Town",d:"Calles georgianas, Princes Street y compras; más cómodo para alojarse, plano y cerca de la estación."},
 {n:"Stockbridge",d:"Barrio elegante y tranquilo, con cafés y mercados; 20 min a pie del centro."},
 {n:"Leith",d:"Puerto con restaurantes de pescado y vida local; hay tranvía y bus al centro."}
];

export const TRANSPORTE={
  llegada:"Aeropuerto de Edimburgo → centro: tranvía (~7,50 £, 35 min) o bus Airlink 100 (~5,50 £). Estación principal: Waverley.",
  local:"Buses Lothian: 2 £ el viaje o ~5 £ el pase diario (se paga con tarjeta sin contacto). La ciudad se recorre a pie.",
  pases:"Explorer Pass de Escocia (castillos y sitios históricos) conviene si se visitan 3 o más sitios de Historic Environment Scotland.",
  trenes:"ScotRail y LNER: Glasgow cada 15 min (50 min); Londres en ~4 h 20 (LNER). Comprar con anticipación en trainline.com o lner.co.uk."
};

export const CONSEJOS=[
 "Llevar impermeable fino y capas: puede haber sol, lluvia y viento en el mismo día.",
 "Zapatillas cómodas: calles empedradas y muchas cuestas.",
 "Durante el Festival Fringe (agosto) y Hogmanay (31 dic), reservar alojamiento con meses de anticipación.",
 "Los fines de semana largos de verano, el castillo y Holyrood se agotan: comprar entradas con hora.",
 "Edimburgo es segura, pero cuidar bolsos en multitudes y en Princes Street.",
 "Enchufe británico tipo G: llevar adaptador."
];

export const TRAMITES={
  pais:"Reino Unido",
  eta:"Chilenos necesitan ETA (autorización electrónica de viaje) desde 2025; ~20 £, válida 2 años; tramitar en la app oficial UK ETA.",
  seguro:"Seguro de viaje con cobertura médica (la sanidad pública no cubre a turistas).",
  moneda:"Libra esterlina (£). Se paga casi todo con tarjeta sin contacto; los cajeros son gratis."
};
