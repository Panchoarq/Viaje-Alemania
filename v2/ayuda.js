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
  ["Historia, un día en la ciudad y cultura","En «Sobre la ciudad» abre Historia (1), con la línea de tiempo; «Si vienes por un día» (2), con idioma y modismos, comida típica, escudo y bandera, curiosidades y tips; y «Cine, música y libros» (3), para conocerla antes de ir. Hoy están completas en las ciudades con guía ampliada, como Belfast.","36-historia-ciudad"],
  ["Recorridos a pie","En «Recorridos a pie» elige tu caminata y cuánto tiempo tienes (1): mañana, tarde o día completo. Verás el tiempo total (2) y las paradas en orden con los minutos a pie entre cada una. «＋ Agregar este recorrido al programa» (3) pasa todas las paradas a tu programa para que se repartan en tus días. Puedes combinar un recorrido con otras atracciones, como el museo del Titanic.","37-recorridos"],
  ["Estilo arquitectónico","Las fichas de edificios traen el año, el arquitecto y el estilo. Toca el estilo (1) para ver qué es, cómo reconocerlo en un edificio, una escultura y una pintura, con una foto de Wikipedia y un enlace para leer más.","38-ficha-arquitectura"],
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
 ["pres","Cómo se arma el presupuesto",{t:"Cómo se calcula el presupuesto",i:"El presupuesto no es un número inventado: se va sumando día por día, por persona, con lo que tú eliges en el Programa. Mientras más completas tu viaje, más preciso es.",s:[
  ["La idea","Para cada día la app suma cuatro cosas por persona: alojamiento, comidas, entradas y transporte local. La suma de todos los días, más tu presupuesto de compras, es el total del viaje que ves en Gastos.","28-presupuesto-resumen"],
  ["1 · Alojamiento","Es el precio total del hotel que anotaste en la pestaña Alojamiento, dividido por las noches y por las personas. Ejemplo: 420 € por 3 noches con 2 personas son 70 € por persona cada día. Si aún no anotas hotel, cuenta 0. Una ciudad de 0 noches (excursión de un día) tampoco suma alojamiento.","26-presupuesto-alojamiento"],
  ["2 · Comidas","Cada día tiene desayuno, almuerzo, cena y merienda. Por defecto están activos desayuno, almuerzo y cena; la merienda está apagada. Cada comida suma el precio de la opción que elijas (por ejemplo, «menú del día» o «sándwich»), que sale de la guía de la ciudad. Los cambias en Programa → Comidas de cada día.","25-presupuesto-comidas"],
  ["3 · Entradas","Suma el precio por persona de cada atracción que programaste ese día. Lo gratuito suma 0. Si agregas o quitas una actividad del día, el total se recalcula al instante."],
  ["4 · Transporte local","Cada tramo del día que se hace en metro, bus o transporte público cuenta como un pasaje, al valor del ticket de esa ciudad (unos 2,40 € si no hay dato). Caminar no cuesta."],
  ["Total del día","En el Programa, arriba de cada día, el recuadro «Presupuesto / real» muestra el total estimado por persona y, a la derecha, lo que llevas gastado. Debajo están los cuatro componentes con sus íconos: cama, cubiertos, entradas y transporte.","24-presupuesto-dia"],
  ["Por categoría y por día","En Gastos, «Día a día» y «Por categoría» muestran el estimado contra lo gastado, para ver dónde te estás pasando o te sobra.","27-presupuesto-categorias"],
  ["Compras","Los regalos y souvenirs no se estiman: tú defines cuánto quieres gastar en «Presupuesto de compras» en Gastos y se suma al total."],
  ["Qué no incluye","No incluye los vuelos, trenes o buses entre ciudades ni los boletos de llegada y salida: anótalos en Transporte → «Lo que compré» para tenerlos a mano. Tampoco propinas ni imprevistos."],
  ["Tu propio presupuesto","Si escribes un «Presupuesto total por persona» en Gastos, la app compara el gasto real contra tu número y no contra el estimado. El estimado sigue visible para que veas si tu número alcanza."],
  ["Cómo afinarlo","Anota el precio real del hotel, elige comidas más baratas o más caras, quita o agrega actividades y ajusta las noches. Cada cambio se refleja de inmediato en el presupuesto."]],
  tip:"Todo es por persona. El total para el grupo aparece abajo del total del viaje («Las 2 personas»). Los precios de las guías son aproximados: mejora el presupuesto reemplazándolos por los reales a medida que reservas."}],
 ["cart","Billetera",{t:"Billetera: registrar gastos en el momento",i:"Es la pantalla para anotar cada gasto apenas lo haces, desde el celular: por voz o escribiendo, con la ubicación del lugar, el medio de pago y si fue compartido. Lo anotado aparece en rojo en la pestaña Gastos, contra el presupuesto.",s:[
  ["Abrir la billetera","Toca el ícono de billetera de la cabecera (1) o el botón «Abrir mi billetera» (2) de la pestaña Gastos.","35-billetera-boton"],
  ["Primera vez: Ajustes","En «Ajustes» pon tu nombre, tu presupuesto total (1), el efectivo que llevas (2), las tasas de cambio y los medios de pago que usas. Se hace una sola vez.","34-billetera-ajustes"],
  ["Anotar un gasto","En «Gasto»: toca el micrófono (1) y di, por ejemplo, «café en Flore cuatro cincuenta»; o escribe el monto (2) y el comercio (3). El monto se convierte a euros y a pesos chilenos.","29-billetera-nuevo"],
  ["Categoría y medio de pago","La categoría se sugiere por las palabras o la hora (por ejemplo, «café» o «museo»); tócala para cambiarla (1). Elige con qué pagaste (2): crédito, débito, efectivo u otro. «+ Nueva» agrega categorías propias.","30-billetera-categoria"],
  ["Ubicación y compartido","«Guardar ubicación» (1) anota el lugar exacto con el GPS del teléfono (acepta el permiso de ubicación); verás la precisión en metros. «Gasto compartido» (2) lo divide entre las personas del viaje. Termina con «Guardar gasto» (3).","31-billetera-gps"],
  ["Retiro de cajero","Debajo de «Guardar gasto» está «Registrar retiro de efectivo»: suma al saldo de efectivo y no cuenta como gasto."],
  ["Resumen","En «Resumen» elige Hoy, la ciudad o Todo el viaje (1). Las tarjetas (2) muestran lo gastado, el presupuesto del programa, el saldo de efectivo y el saldo de tu presupuesto. Más abajo, cuánto puedes gastar por día para cerrar en el presupuesto.","32-billetera-resumen"],
  ["Mapa","En «Mapa» ves un pin por cada gasto con ubicación, con el color de su categoría. Tócalo para ver el detalle.","33-billetera-mapa"],
  ["Juntas","Si viajan dos o más personas, «Juntas» muestra solo los gastos compartidos y cuánto corresponde a cada una."],
  ["Corregir o borrar","Toca cualquier gasto de la lista para ver el detalle, ver dónde fue en el mapa o eliminarlo."]],
  tip:"Para que la ubicación funcione, el navegador debe tener permiso de GPS. Los gastos de la billetera y los anotados a mano en la pestaña Gastos se suman juntos."}],
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
const COL=["#a8352b","#c9730f","#b8860b","#4f7a2e","#2a7d6b","#2e6c9e","#4b4a9a","#8a3f8e","#b03a6e","#7a5230","#3f6b52","#5b6770","#c2477f","#2f5f8a"];
const CSS=`.aytabs{display:grid;grid-template-columns:1fr 1fr;gap:9px 10px;margin:4px 0 14px;padding:2px 3px 6px}
.aytab{position:relative;font:700 13px/1.15 var(--f-mono);letter-spacing:.04em;text-transform:uppercase;text-align:left;cursor:pointer;color:var(--ink);padding:10px 10px 10px 14px;min-height:46px;display:flex;align-items:center;
 background:color-mix(in srgb,var(--c) 14%,var(--card));border:2px solid var(--c);border-left-width:9px;border-radius:9px;box-shadow:3px 4px 0 color-mix(in srgb,var(--c) 55%,transparent),0 5px 8px rgba(0,0,0,.12);transition:transform .12s,box-shadow .12s}
.aytab:active{transform:translate(2px,3px);box-shadow:1px 1px 0 color-mix(in srgb,var(--c) 55%,transparent)}
.aytab[aria-selected="true"]{background:var(--c);color:#fff;transform:translate(2px,3px);box-shadow:inset 0 3px 6px rgba(0,0,0,.28),0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
.aytab[aria-selected="true"]::after{content:"";position:absolute;left:50%;bottom:-9px;margin-left:-7px;border:7px solid transparent;border-top-color:var(--c);border-bottom:0}`;
const CSS2=`.ayfig{margin:8px 0 12px;text-align:center}.ayfig img{width:min(320px,100%);height:auto;border:2px solid var(--ink);border-radius:12px;box-shadow:0 3px 10px rgba(0,0,0,.2)}`;
if(typeof document!=="undefined"&&!document.getElementById("ay-css")){const st=document.createElement("style");st.id="ay-css";st.textContent=CSS+CSS2;document.head.appendChild(st)}
export const ICO_AYUDA=ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>');
export function ayudaBtn(){return `<button type="button" class="cib" data-ayuda title="Ayuda: cómo funciona" aria-label="Ayuda">${ICO_AYUDA}</button>`}
export function ayudaHTML(ctx){if(!AY.open)return "";
  const hay=SECC.find(s=>s[0]===AY.sec)||SECC[0];
  return `<div class="calov gov" data-ayclose-bg><div class="calsheet" role="dialog" aria-modal="true" aria-label="Ayuda">
  <div class="ms-head"><div><span class="eyebrow">Marco Polo · Ayuda</span><h3>${hay[0]==="hola"?"Bienvenida":"Manual de uso"}</h3></div><button type="button" class="ms-x" data-ayclose aria-label="Cerrar ayuda">✕</button></div>
  <div class="aytabs" role="tablist" aria-label="Secciones de ayuda">${SECC.map(([k,t],i)=>`<button type="button" role="tab" class="aytab" style="--c:${COL[i%COL.length]}" data-aysec="${k}" aria-selected="${k===hay[0]}">${t}</button>`).join("")}</div>
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
