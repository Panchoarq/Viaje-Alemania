# Marco Polo · Traspaso a Claude Code

Léelo completo antes de tocar código. Idioma: español neutro (no argentino) en interfaz, textos y documentos.

## Qué es
App web de planificación de viajes (marcopolo-viajes.vercel.app). Archivos HTML de un solo archivo, desplegados en Vercel desde `Panchoarq/Viaje-Alemania` (rama `main`; `git push origin HEAD:main` despliega).

| Ruta | Archivo | Estado |
|---|---|---|
| `/` | `index.html` | Selector de viajes |
| `/alemania` | `alemania.html` (~770 KB) | Hamburgo · Berlín · Praga · Múnich, 5 viajeros (16 años), feb 2027. Plan abierto (Firebase auth anónima, `plan/estado`). Tiene calendario y costos solo en Configurar |
| `/paris` | `paris.html` (~480 KB) | Londres + París + escapadas, 2 viajeras (Francisco y Alli). Privado con Google, `trips/paris` |
| `/gastos` | `gastos.html` | «Mis gastos». `?trip=alemania` o París (por defecto). Google, por viaje, moneda y N de viajeros |

## Regla de oro
**No cambiar la estética ni el comportamiento de `/alemania` y `/paris`.** El usuario los considera «espectaculares». El motor único se construye aparte (ej. `/v2/...`), se compara pestaña por pestaña con capturas (escritorio y celular) y solo reemplaza a lo actual con su visto bueno. Respaldar cada versión antes de editar.

## Estética
Cuaderno de viaje antiguo: papel, boletos, sellos rojos, rayado azul, Courier Prime + Source Serif 4, tokens `--bg --card --ink --line --stamp`; colores de ciudad `--mun --pra --ber --ham`. Estética Coordina (blanco/negro/naranjo) aplica a otros artefactos, no a esta app.

## Firebase (proyecto `viaje-a-alemania-60001`)
- Auth: Google (Alemania gastos y París) y anónima (plan de Alemania). Dominio `marcopolo-viajes.vercel.app` autorizado.
- Firestore: `plan/estado` (Alemania, abierto a autenticados); `trips/paris` (doc plan), `trips/paris/{meta/presupuesto, juntas/*, users/{email}/gastos/*}`; `trips/alemania/{meta, juntas, users/{email}/gastos}`.
- Reglas vigentes: funciones `viajera()` (París: antoniapaz.cespedes@, francisco.cespedes@, bim360user04@gmail.com) y `viajeroDE()` (Alemania: francisco.cespedes@, bim360user04@, igna160510@gmail.com). **Faltan 3 correos de Alemania**; pedirlos al usuario y actualizar la lista (él publica en la consola).
- Cuenta de la consola: bim360user04@gmail.com (Google bloquea ese login en equipos desconocidos).
- Modo demo: `?demo` o `file:` usa localStorage (`paris_demo`, `gdemo_*`).

## Tecnologías clave
Firebase 10.12.2 (CDN gstatic), MapLibre GL 4.7.1 + tiles OpenFreeMap con estilo propio de tonos tierra (`mlStyle`), Leaflet 1.9.4 de respaldo, rutas a pie OSRM (routing.openstreetmap.de), Nominatim (cola con límite), Wikipedia API, Open-Meteo. Caches localStorage `mp_walk`, `mp_near`.

## París (`paris.html`): piezas principales
`TABS`, `render()`, `schedule(days,sel,base,opt)` (organizador genérico: zonas, topes por ritmo, días bloqueados, aperturas, hora fija `at`, almuerzo 13:00), `buildPA()/buildLO()`, `PA`, `LON`, `ESC` (escapadas), `SHOWS`, `GUIDE`, `FOOD_G`, `TYP` (tipos de actividad), ritmos `RIT` (rápido 7,5 h / intermedio 5,5 h / relajado 4 h con día libre intermedio) por tramo `TRAMOS` (LO, PAJ = París con Alli, PAS = después de Alli), calendario `tripCal`, buscar y agregar, almuerzo con sugerencias, favoritos, personalizadas.

## Decisiones tomadas
1. Un solo motor general para Alemania, París y viajes nuevos (no dos apps).
2. Viaje = datos con **tramos** (ciudad + fechas + viajeros); cada tramo con su organizador, ritmo y selección; módulos opcionales por viaje. Alemania = 4 tramos × 5 viajeros; París = tramos Londres con Alli, París con Alli, París después de Alli.
3. Login con correo de Google para todos (incluidos los 5 de Alemania). Gastos estándar en todo viaje.
4. Portada: «Crear viaje nuevo» o «Entrar a un viaje».
5. Asistente de viaje nuevo: destino, días, países, ciudades, viajeros. Contenido de ciudades y escapadas generado con IA: **usar Claude Haiku por ahora**; el usuario pedirá otro modelo si quiere más precisión. Clave de API en servidor (Vercel), nunca en el HTML; límite por usuario. Costos estimados (sin verificar con Anthropic): ~0,05 USD por ciudad con Haiku, 0,30–0,60 con Sonnet + búsqueda. El usuario necesita saber el costo.
6. Quien crea viajes: quien reciba el enlace de la app del usuario.
7. Organizador (el usuario elige actividades y la app reparte por ciudad/días de viaje) disponible para cualquier tramo, con 3 ritmos.
8. KPIs de costos solo en Gastos y Configurar.

## Orden sugerido
1. Reglas y correos de Alemania (pendiente de 3 correos).
2. Esquema de datos del viaje (tramos) + migrar París al motor en `/v2/paris`; igualdad visual con capturas.
3. Migrar Alemania.
4. Portada y asistente de viaje nuevo + generación con Haiku (función serverless).
5. Fotos en fichas de lugares (opciones: Firebase Storage requiere plan Blaze; o imágenes comprimidas ~100 KB en Firestore). Sin decidir.

## Pendientes y datos por verificar
- Nombre de la amiga: **Alli** (A-L-L-I).
- Origen de París: 4 rue Beaumont, París (dirección en Configurar).
- Líneas de metro/bus por tramo: sin fuente (Overpass bloqueado); hoy líneas rectas punteadas.
- Sin verificar: dirección Wagamama París (fuente de 2019), varios precios de Londres (Tower Bridge, Kensington, Kew, London Eye, West End), precios y lugares de la guía de comidas.
- Tasa de CZK en Gastos: 1 Kč = 0,04 € (editable por usuario).

## Pruebas
Playwright con Chromium (headless). Probar escritorio y celular, sin errores de consola, y comparar capturas contra la versión actual.
