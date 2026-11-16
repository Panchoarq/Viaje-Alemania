// Ayuda de los viajes nuevos: botón «?» en la cabecera, bienvenida la primera vez y manual por pestaña.
// Reusa las clases del manual de París (calov, calsheet, ms-head, gindex, gsec, gsteps, gtip).
const AY={open:false,sec:"hola"};
const SECC=[
 ["hola","Bienvenida",{t:"Cómo funciona Marco Polo",i:"Tu viaje se arma en pestañas, de izquierda a derecha. No necesitas llenarlo todo: parte por lo que sepas y completa después. Todo se guarda solo.",s:[
  ["Las pestañas","Abajo (1) están las 10 secciones: Configurar, Programa, Atracciones, Escapadas, Espectáculos, Comidas, Gastos, Transporte, Alojamiento y Trámites; deslízalas hacia el lado para ver todas. El botón «?» (2) abre esta ayuda cuando quieras.","07-pestanas"],
  ["Por dónde empezar","1) <b>Configurar</b>: fechas, cómo llegas y cómo te vas, ciudades y noches. 2) <b>Programa</b>: reparte las atracciones en los días. 3) El resto se completa a medida que reservas."],
  ["Se guarda solo","Cada cambio queda en este dispositivo y, si entraste con tu cuenta de Google, también en tu cuenta para verlo en otros aparatos."],
  ["Abrir la ayuda","El botón «?» de la cabecera abre este manual; arriba eliges la sección (1).","23-ayuda"],
  ["Estilos","Los tres botones 1 · 2 · 3 de la cabecera cambian el estilo visual: Retro, Moderno y Cuaderno."],
  ["Volver a Mis viajes","La flecha de la cabecera te lleva a la lista de tus viajes, donde puedes crear otros."]],
  tip:"Los precios y horarios de las fichas son aproximados: confírmalos antes de reservar."}],
 ["nuevo","Crear un viaje",{t:"Crear un viaje nuevo",i:"El asistente te hace unas pocas preguntas y arma la ruta. Todo se puede cambiar después en Configurar.",s:[
  ["Entrar","Con «Entrar con Google» tus viajes quedan en tu cuenta y los ves desde cualquier aparato.","01-mis-viajes"],
  ["Elegir el país","En «Mis viajes» toca «Nuevo viaje» y elige el país principal. Cada tarjeta muestra cuántas ciudades hay disponibles.","02-elegir-pais"],
  ["Fecha y hora de llegada","Paso 1: marca la fecha de llegada (1) y, si la sabes, la hora (2). Si aún no tienes fechas, elige «Aún no tengo fechas» y la ruta se arma por «día 1, día 2…».","03-asistente-fecha"],
  ["Cómo llegas y cómo te vas","Elige el medio de llegada (1) y de salida (2), desde y hacia dónde, y la hora de salida si la sabes. Es opcional.","04-asistente-llegada"],
  ["Ciudades","Paso 2: toca «Agregar» en cada ciudad que visitas. La primera es donde aterrizas. Más abajo puedes sumar una ciudad de un país vecino (por ejemplo, Londres en un viaje a Francia).","05-asistente-ciudades"],
  ["Noches y orden","Con − y + (1 y 2) cambias las noches; con ▲ ▼ (3) el orden. Con <b>0 noches</b> la ciudad es una excursión de un día y no se pide alojamiento.","06-asistente-noches"],
  ["Terminar","Sigue con Siguiente: orden, alojamiento, comida y ritmo. Al final, el resumen y «Guardar» te llevan a tu viaje."]]}],
 ["cfg","1 · Configurar",{t:"Configurar: la base del viaje",i:"Aquí está lo que define el resto: fechas, ruta, ciudades, noches, llegada y salida.",s:[
  ["Fechas y personas","Cambia la fecha de llegada, la hora y cuántas personas viajan; los costos y los días se recalculan."],
  ["Cómo llegas y cómo te vas","Cuadro 1: llegada. Cuadro 2: salida. Elige medio (avión, tren, bus, auto o barco), desde dónde sales, a qué punto llegas y a qué hora sales. El día 1 parte desde el aeropuerto o la estación hacia tu alojamiento, y el último día te avisa a qué hora salir del alojamiento.","08-config-llegada"],
  ["Ruta y noches","Con − y + (1 y 2) cambias las noches y con ▲ ▼ (3) el orden de las ciudades. Con <b>0 noches</b> la ciudad queda como <b>excursión de un día</b>: vas y vuelves el mismo día, sin alojamiento.","09-config-ruta"],
  ["Ritmo","Rápido, Intermedio o Relajado define cuántas horas de actividades caben por día."],
  ["Mapa y línea de tiempo","El mapa muestra la ruta y debajo está la línea de tiempo con los traslados entre ciudades."]]}],
 ["prog","2 · Programa",{t:"Programa: armar los días",i:"El corazón de la app: qué haces cada día, a qué hora, cuánto cuesta y cómo te mueves.",s:[
  ["Elegir ciudad y día","Toca «Programa» (1) y usa las pestañas de ciudad y las fechas (2) para saltar a cada día.","10-programa"],
  ["Agregar actividades","El botón «+ Agregar actividad a este día» (1) abre las atracciones de la ciudad. También puedes crear una propia con <b>＋ Nueva actividad</b> (nombre, duración, hora y dirección opcionales).","12-programa-agregar"],
  ["Ajustar el día","Cada día muestra su encabezado (1) y sus actividades en orden (2). ↑ ↓ cambia el orden, ✕ quita una actividad y el selector 📅 la mueve a otro día.","11-programa-dia"],
  ["Almuerzo","Cada día tiene una franja de almuerzo con sugerencias cerca de donde estás; «Elegir» la deja como tu almuerzo."],
  ["Tiempo","Cuando faltan 16 días o menos aparece el pronóstico; si anuncia lluvia, sugiere cambiar una actividad al aire libre por una techada."],
  ["Plano y calendario","El plano del día muestra el recorrido y el calendario da la vista de todo el viaje por colores."],
  ["Día de salida","Después del último día aparece la tarjeta de salida con la hora a la que debes dejar el alojamiento."]],
  tip:"⚠ significa que algo queda fuera de horario o cerrado ese día. Con «No alcanza» conviene subir el ritmo, sumar noches o quitar actividades."}],
 ["att","3 · Atracciones",{t:"Atracciones: conocer cada lugar",i:"Fichas de cada atracción para llegar sabiendo qué vas a ver.",s:[
  ["Elegir ciudad","Toca «Atracciones» (1) y elige la ciudad en las pestañas (2).","13-atracciones"],
  ["Filtrar","Por «En el programa», «★ Imperdibles», «Techadas» (útil con lluvia) o por zona (3)."],
  ["Leer una ficha","Cada ficha (1) trae historia, qué ver, horario, precio y cierres. Desliza hacia el lado para pasar a la siguiente. El botón de la ficha la suma o la quita del programa.","14-atracciones-ficha"],
  ["Buscar y agregar","Si falta algo, búscalo por nombre o dirección y agrégalo a mano."]]}],
 ["esc","4 · Escapadas",{t:"Escapadas: salir de la ciudad base",i:"Paseos de un día o con noches desde tu ciudad base.",s:[
  ["Elegir","Toca «+ Agregar» en la idea que te guste; arriba queda la lista de lo elegido."],
  ["Disponible","Con una sola ciudad base. Con varias ciudades, usa mejor una ciudad con 0 noches como excursión de un día."]]}],
 ["show","5 · Espectáculos",{t:"Espectáculos: eventos y noches especiales",i:"Busca lo que haya en tus fechas y anota lo que compres.",s:[
  ["Buscar","Los botones abren una búsqueda en Google para esa ciudad y fechas."],
  ["Anotar","Nombre, ciudad, fecha y precio. El sello «EN SUS FECHAS» avisa si coincide con el viaje."]]}],
 ["food","6 · Comidas",{t:"Comidas: dónde y cuánto",i:"Precios aproximados por persona y lugares para buscar en el mapa.",s:[
  ["Elegir ciudad","Toca «Comidas» (1) y elige la ciudad (2).","15-comidas"],
  ["Presupuesto","Cada comida de cada día se ajusta en Programa → Comidas."],
  ["Tus lugares","Anota los que te recomienden."]]}],
 ["gas","7 · Gastos",{t:"Gastos: presupuesto y gasto real",i:"Resume lo que costará el viaje, día por día y por ciudad.",s:[
  ["Presupuesto","Toca «Gastos» (1). El recuadro oscuro (2) muestra el total estimado por persona, lo gastado y cuánto queda. Suma alojamiento, comidas, actividades y traslados locales.","16-gastos"],
  ["Anotar un gasto","En «Anotar un gasto» (1) elige fecha, ciudad, categoría, monto, moneda y cómo pagaste, y toca «Guardar gasto». Queda comparado con el presupuesto de esa ciudad.","17-gastos-registrar"],
  ["Día a día","Despliega «Día a día» para ver el costo estimado de cada jornada."],
  ["Excursión de un día","Una ciudad con 0 noches no suma alojamiento."]]}],
 ["tra","8 · Transporte",{t:"Transporte: llegada, salida y traslados",i:"Cómo llegas, cómo te vas y cómo te mueves entre ciudades.",s:[
  ["Llegada y salida","Toca «Transporte» (1). Arriba (2) están los traslados entre ciudades; más abajo, dos tarjetas con el medio, la hora y un enlace a Maps del punto de llegada al alojamiento y viceversa.","18-transporte"],
  ["Lo que compré","En «Lo que compré» (1) anota nombre, código de reserva y costo de lo que ya tienes comprado (vuelos, trenes, buses).","19-transporte-comprado"],
  ["Entre ciudades","Cada tramo muestra las opciones con duración y precio aproximados, y puedes elegir la que prefieras."]]}],
 ["hot","9 · Alojamiento",{t:"Alojamiento: dónde dormir",i:"Compara opciones por ciudad y deja marcada la elegida.",s:[
  ["Barrios","Toca «Alojamiento» (1) y elige la ciudad (2); abajo se indica en qué zonas conviene quedarse. Las ciudades de 0 noches no aparecen, porque no duermes ahí.","20-alojamiento"],
  ["Agregar opciones","En «Agregar alojamiento» (1) escribe el nombre y el enlace; luego completa precio por noche o total, reserva y si ya está confirmado.","21-alojamiento-agregar"],
  ["Costos","El precio total se reparte por noche en el Programa y en Gastos."]]}],
 ["buy","10 · Trámites previos",{t:"Trámites previos",i:"Lo que conviene resolver antes de salir.",s:[
  ["Entrada al país","Toca «Trámites» (1). La lista (2) trae permisos, seguro, moneda y reservas según el país; marca cada casilla al resolverlo.","22-tramites"],
  ["Seguro y moneda","Seguro de viaje y cómo pagar allá."],
  ["Reservas","Entradas y reservas que conviene comprar con anticipación."]]}]
];
const ic=p=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const CSS=`.ayfig{margin:8px 0 12px;text-align:center}.ayfig img{width:min(320px,100%);height:auto;border:2px solid var(--ink);border-radius:12px;box-shadow:0 3px 10px rgba(0,0,0,.2)}`;
if(typeof document!=="undefined"&&!document.getElementById("ay-css")){const st=document.createElement("style");st.id="ay-css";st.textContent=CSS;document.head.appendChild(st)}
export const ICO_AYUDA=ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>');
export function ayudaBtn(){return `<button type="button" class="cib" data-ayuda title="Ayuda: cómo funciona" aria-label="Ayuda">${ICO_AYUDA}</button>`}
export function ayudaHTML(ctx){if(!AY.open)return "";
  const hay=SECC.find(s=>s[0]===AY.sec)||SECC[0];
  return `<div class="calov gov" data-ayclose-bg><div class="calsheet" role="dialog" aria-modal="true" aria-label="Ayuda">
  <div class="ms-head"><div><span class="eyebrow">Marco Polo · Ayuda</span><h3>${hay[0]==="hola"?"Bienvenida":"Manual de uso"}</h3></div><button type="button" class="ms-x" data-ayclose aria-label="Cerrar ayuda">✕</button></div>
  <div class="daytabs" role="tablist" aria-label="Secciones de ayuda" style="margin-bottom:10px">${SECC.map(([k,t])=>`<button type="button" role="tab" class="dtab" data-aysec="${k}" aria-selected="${k===hay[0]}"><b>${t}</b></button>`).join("")}</div>
  <section class="gsec"><h4>${hay[2].t}</h4><p class="gi">${hay[2].i}</p><ol class="gsteps">${hay[2].s.map(([h,x,im])=>`<li><b>${h}.</b> ${x}${im?`<figure class="ayfig"><img src="img/ayuda/${im}.jpg" alt="${h}" loading="lazy"></figure>`:""}</li>`).join("")}</ol>${hay[2].tip?`<p class="gtip">💡 ${hay[2].tip}</p>`:""}
  ${hay[0]!=="hola"&&hay[0]!=="cfg"?`<button type="button" class="lnkb" data-aygo="${hay[0]}">Ir a esta sección →</button>`:hay[0]==="cfg"?`<button type="button" class="lnkb" data-aygo="cfg">Ir a Configurar →</button>`:`<button type="button" class="lnkb" data-aygo="cfg">Empezar por Configurar →</button>`}</section>
  </div></div>`}
export function bindAyuda(ctx){const Q=(s,f)=>document.querySelectorAll(s).forEach(f);
  Q("[data-ayuda]",b=>b.onclick=()=>{AY.open=true;AY.sec=AY.sec||"hola";ctx.render()});
  Q("[data-ayclose]",b=>b.onclick=()=>{AY.open=false;document.body.style.overflow="";ctx.render()});
  Q("[data-aysec]",b=>b.onclick=()=>{AY.sec=b.dataset.aysec;ctx.render()});
  Q("[data-aygo]",b=>b.onclick=()=>{AY.open=false;document.body.style.overflow="";ctx.ir(b.dataset.aygo)});
  const o=document.querySelector("[data-ayclose-bg]");if(o){o.onclick=e=>{if(e.target===o){AY.open=false;document.body.style.overflow="";ctx.render()}};document.body.style.overflow="hidden"}}
// La primera vez que alguien entra a un viaje, se abre la bienvenida.
export function ayudaPrimera(ctx){let visto=true;try{visto=!!localStorage.getItem("mp_ayuda_vista");localStorage.setItem("mp_ayuda_vista","1")}catch(e){}
  if(!visto){AY.open=true;AY.sec="hola";ctx.render()}}
