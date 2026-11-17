// Historia de Londres con Alice Loxton: videos por lugar e ideas (compartido por el motor y el viaje París-Londres)
const AL="https://www.youtube.com/";
const alS=q=>AL+"@history_alice/search?query="+encodeURIComponent(q),alV=id=>AL+"watch?v="+id;
export const ALICE_V={
 lo_tower:[["La Torre Blanca",alS("White Tower")],["La Bloody Tower",alV("ZFP8LiAH0gM")],["Dónde se ejecutaba en Tower Green",alV("udoHfhO65DU")],["Diseño de la Torre",alS("Tower of London design")]],
 lo_tb:[["Un dato de Tower Bridge",alV("yN2wu2HQzqw")]],
 lo_wa:[["La puerta más antigua de Gran Bretaña",alS("Britain's oldest door")],["La Silla de Coronación",alS("Coronation Chair")],["El pavimento Cosmati",alS("Cosmati Pavement")],["La tumba de Isabel I",alS("tomb of Elizabeth I")]],
 lo_wm:[["Big Ben",alS("Big Ben")],["La Cámara de los Comunes",alS("House of Commons chamber")]],
 lo_guard:[["El cambio de guardia",alS("Changing of the Guard")],["Tras bambalinas de la Caballería",alV("sRIO4Qod_Q0")]],
 lo_leighton:[["El Arab Hall de Leighton House",alS("Arab Hall")]],
 lo_vgh:[["La casa de Van Gogh en Londres",alS("Van Gogh London house")]],
 lo_hcm:[["Tesoros de Waterloo de la Caballería",alV("A5hZZ2GakbI")],["Tras bambalinas de la Caballería",alV("sRIO4Qod_Q0")]],
 lo_ragged:[["La Ragged School",alV("cQIZ163ZaK0")]],
 lo_marsh:[["Los restos de Marshalsea",alV("ysmIkhFJDIQ")]],
 lo_water:[["La historia de Waterstones Piccadilly",alS("Waterstones Piccadilly")]],
 lo_hand:[["Una visita a Hand & Lock",alS("Hand & Lock")]],
 lo_stanne:[["El cementerio de St Anne Limehouse",alS("St Anne Limehouse")]],
 lo_wash:[["La estatua de George Washington",alS("George Washington statue")]],
 lo_nhm:[["El Museo de Historia Natural",alS("The Natural History Museum")],["Los jardines nuevos",alS("new gardens Natural History Museum")]]
};
export const ALICE_IDEAS=[
 ["Barandas de acero de la guerra","En algunas calles de Londres todavía quedan barandas que, según cuenta Alice, se podían sacar de su base y usar como camilla para llevar heridos durante los bombardeos. Mira las barandas de las calles residenciales: algunas están allí desde entonces.",alV("c33rKeSxPEc"),"video: WWII Railings"],
 ["Postes de calle que fueron cañones","En varias calles, los postes que protegen las esquinas fueron cañones antiguos enterrados boca abajo. Fíjate en la base de los postes al caminar.",alV("TcpqMGNOSKY"),"video: bollards napoleónicos"],
 ["The London Library (St James's Square)","Una biblioteca privada fundada en 1841, con estanterías de varios pisos separadas por suelos de rejilla de hierro. Es de socios, así que la entrada es limitada: conviene revisar si ofrecen visitas o eventos antes de ir.",alV("RI7o_Dm8pNI"),"video: The London Library"],
 ["Restos de la prisión de Marshalsea (Southwark)","Un muro que queda de la cárcel de deudores donde estuvo preso el padre de Dickens. Está en la calle, se ve gratis y queda cerca de Borough Market.",alV("ysmIkhFJDIQ"),"video: Marshalsea"],
 ["Ragged School Museum (Mile End)","Una escuela para niños muy pobres del siglo XIX, con una sala de clases victoriana. Abre pocos días a la semana: revisar horarios.",alV("cQIZ163ZaK0"),"video: Ragged School"],
 ["Household Cavalry Museum (Horse Guards)","Tesoros de Waterloo y la vida de la caballería que escolta al rey, junto al cambio de guardia.",alV("A5hZZ2GakbI"),"video: Waterloo y la Caballería"],
 ["Lugares para visitar","La casa de Van Gogh en Brixton, el Arab Hall de Leighton House, la librería Waterstones de Piccadilly, el taller Hand & Lock, la iglesia de St Anne en Limehouse, la estatua de Washington, la prisión de Marshalsea, la Ragged School y el museo de la Caballería ya están agregados abajo como atracciones, con su ficha, horarios y precio aproximado.",alS("London"),"buscar más en su canal"]
];
