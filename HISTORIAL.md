# Marco Polo · Historial y contexto de diseño

Complementa `TRASPASO.md` (arquitectura y plan). Aquí está de dónde viene la app, qué ha pedido el usuario (Francisco), cómo le gusta trabajar y qué valora. Claude Code no vio las conversaciones anteriores: esto las resume.

## Cómo trabaja y qué espera Francisco
- Arquitecto, no programador. Habla en español de Chile; la app y los textos van en **español neutro** (no argentino).
- Respuestas directas y breves, primero la respuesta. No explicar el proceso salvo que lo pida. Mínima pregunta necesaria si falta contexto.
- Da feedback visual y concreto, probando en el celular (capturas, «aparece este texto en el mapa»). Reporta bugs con ejemplos exactos; corregirlos y confirmar.
- Valora mucho la estética actual («espectacular»): **no cambiar el diseño** de lo que ya funciona.
- Pide respaldos antes de cambios grandes. Prueba antes de desplegar (Playwright escritorio y celular, sin errores de consola).
- Comando suyo «COMPACTO»: resumir la conversación en 5–7 viñetas con contexto, decisiones y código, para pegar en un chat nuevo.

## Línea de tiempo
**1. Viaje a Alemania (primero).** Cinco jóvenes de 16 años, Hamburgo → Berlín → Praga → Múnich, feb 2027. App con pestañas: Configurar (ciudades, noches, orden, mapa de ruta), Programa (días con actividades, comidas, transporte), Alojamiento (hoteles con tarifas, desayuno, autorización de padres), Pasajes y Eurail, Trámites previos, Atracciones. Plan compartido en vivo (Firebase `plan/estado`), borradores, propuestas y votos, historial. Estética de cuaderno antiguo (papel, boletos, sellos).

**2. Viaje a París (segundo, ahora más pulido que Alemania).** Londres + París + escapadas (Bruselas, Estrasburgo, etc.), dos viajeras: Francisco y Alli. Debía ser «la misma plantilla que Alemania» y terminó siendo la plantilla más completa. Lo construido:
- Origen en París: 4 rue Beaumont (dirección definida en Configurar, punto de partida de rutas).
- Configurar al estilo Alemania: ciudades y noches, ruta Santiago → Londres → París → Santiago, escapadas en línea de tiempo y mapa.
- Calendario del viaje (hoja de cuaderno con clip, días como boletos de color por ciudad, días de viaje achurados, número de actividades como timbre rojo) + ícono de calendario en cada día + flecha para subir (hay muchos días) + pestaña de carpeta con fecha y ciudad en cada día.
- Londres con actividades propias y organizador; **modo «juntas»**: las actividades se reparten solo en los días en que las dos están juntas; después, flujo normal de agregar y quitar. Preguntar qué días bloquear (comprometidos) o dejar libres; igual en París.
- Clima por día con cambios sugeridos si llueve.
- Mapas estilo cuaderno (MapLibre + OpenFreeMap, tonos tierra) con **rutas a pie siguiendo calles** (OSRM). Metro/bus: líneas rectas punteadas (sin datos de líneas). Bruselas y Estrasburgo deben mostrar el plano igual que el resto; enlace tipo Google Maps.
- «Por qué ir» (párrafo) en cada escapada; plan y mapa de cada escapada.
- Atracciones y Espectáculos con pestañas Londres y París.
- Guías y manual de instrucciones por sección; «Actualiza el help» cuando se agrega algo.
- **Buscar y agregar**: atracciones, escapadas, espectáculos, comidas; Wikipedia para ficha (con filtro de relevancia: error histórico «Tintin Shop» → Greta Thunberg; no usar Wikipedia para tiendas/casas; alternativas editables «Ninguna · usar solo mi texto»). Octava categoría «Personalizada» (nombre, dirección opcional, duración), Tiendas, Destinos personales, «＋ Nueva actividad», agregar a mano en todas las secciones con parámetros por categoría.
- Comidas para Londres y cada escapada (guía propia, no frases escuetas tipo «waffle en la calle»); comida rápida americana; **Wagamama** y otras cenas entretenidas; franja de almuerzo 13–14 h con sugerencias cercanas (guía + mapa, colores por precio verificado/estimado), favoritos y cadenas; el almuerzo elegido debe verse en el día y en el programa (bug corregido: pub del martes 17 aparecía el 16).
- El nombre de la amiga es **Alli** (A-L-L-I); nunca «la amiga».
- Tres ritmos por tramo: **rápido / intermedio / relajado** (hasta 7,5 h / 5,5 h / 4 h por día, relajado con día libre intermedio). Tramos: Londres con Alli, París con Alli, París después de Alli (organizador propio para el tramo solo, con días comprometidos y escapadas).
- **Mis gastos** (`/gastos`): app de gastos personales y compartidos con Google, dictado por voz, mapa de dónde gastó, presupuesto del programa vs real, efectivo, tasas de cambio.

**3. Gastos y calendario para Alemania (esta sesión).** `/gastos?trip=alemania` (EUR + coronas checas, 5 viajeros, gasto compartido en 5 partes), botón en Alemania, reglas de Firebase por viaje, calendario de cuaderno en Alemania, costos solo en Configurar.

**4. Visión actual (por hacer): un motor único.** Francisco no quiere dos apps separadas: Alemania, París y los viajes futuros deben salir del mismo motor, con la estética de París. Ver «Decisiones» en `TRASPASO.md`. Puntos que él dijo explícitamente:
- Login con correo de Google para todos, incluidos los 5 de Alemania; gastos estándar.
- Portada: «crear viaje nuevo» o «entrar a un viaje».
- Asistente de viaje nuevo con IA (Haiku por ahora), y Francisco quiere saber el costo.
- Organizador disponible para cualquier tramo; Alemania debe tener gastos, calendario, etc.
- Pregunta clave suya: cómo se configura en el motor un viaje de 2 personas vs uno de 1 persona (tramos con distinto número de viajeros).
- **Condición:** que el cambio no altere la estética ni nada de lo que ya funciona. Plan acordado: motor nuevo aparte (`/v2/...`), comparar con capturas, reemplazar solo con su visto bueno.

## Preferencias de producto observadas
- Interfaces tipo cuaderno de viaje: tipografías Courier Prime (títulos, sellos) y Source Serif 4 (texto); colores tierra, rojo sello `#a8352b`.
- Mobile primero (usa la app en el celular en terreno).
- Menús que no se cierran solos al marcar casillas (bug que reportó: checkbox de piscina y select de día cerraban el menú).
- Texto de ayuda breve y práctico; sin relleno.

## Datos sensibles y límites
- Las reglas de Firebase las publica Francisco en la consola; Claude solo entrega el texto.
- No guardar contraseñas ni claves en el repositorio. La clave de API de IA irá solo en variables de entorno de Vercel.
- Correos de viajeros: ver `TRASPASO.md` (faltan 3 de Alemania).
