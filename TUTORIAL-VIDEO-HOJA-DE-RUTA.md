# Tutorial en video de Marco Polo: hoja de ruta

Objetivo: videos cortos que muestren la app en formato celular, con guion y con tu voz, explicando cada parte del viaje. El de **Programa** es el más importante porque hoy es la parte más densa.

## 1. Cómo se hace (pipeline)

| Etapa | Qué se hace | Herramienta |
|---|---|---|
| Guion | Un archivo por escena: qué se ve, qué se toca y qué se dice | Yo lo redacto, tú lo corriges |
| Voz | Tu voz leyendo el guion (opción A) o una voz clonada de la tuya (opción B) | Grabadora del celular, o un servicio de voz sintética |
| Captura | La app corriendo en un navegador con pantalla de celular (390×844), manejada por un script que toca, desplaza y espera | Playwright + Edge, ya lo uso para probar |
| Datos | Un viaje de ejemplo fijo (París-Londres o un viaje del motor) para que todo se vea igual cada vez | Modo `?demo` |
| Montaje | Une video y audio, agrega marco de teléfono, círculo en cada toque, subtítulos y rótulos | ffmpeg |
| Entrega | Un video por sección (1–3 min) y uno completo (~12 min) | Archivo MP4; tú lo subes donde quieras |

Clave técnica: primero grabo tu audio, mido cuánto dura cada escena y el script de captura **espera ese tiempo** en cada paso. Así la imagen queda sincronizada con la narración sin editar a mano.

### Opciones de voz
- **A. Tu voz real (recomendada):** lees el guion por escenas en el celular. Es gratis, suena natural y no hay dudas de uso. Si cambia la app, regrabas solo esa escena.
- **B. Voz clonada de la tuya:** subes una muestra tuya a un servicio de voz sintética y genera todo el guion. Es rápido de rehacer cuando cambia el texto, pero cuesta una suscripción y hay que revisar la pronunciación (nombres como Gare du Nord o Réaumur).
- **C. Voz genérica:** la más barata y la menos personal.

## 2. Antes de grabar: ordenar el Programa

El Programa hoy tiene mucha información junta. Propongo una pasada corta de diseño **antes** de filmar, para no grabar algo que vas a cambiar:
- Dejar visible por día solo lo esencial: hora, nombre, duración, traslado.
- Mover los detalles (por qué vale la pena, precios, avisos) detrás de un toque.
- Una leyenda de símbolos más clara (hoy está detrás del «?»).
- Que «Agregar actividad», «Elegir día» y «Vaciar día» se entiendan sin leer.

Si prefieres filmar ya y rehacer después, las escenas del Programa son las únicas que se regrabarían.

## 3. Estructura de los videos

Cada escena: **objetivo → qué se toca → narración (borrador)**. Duraciones aproximadas.

### 0. Presentación (0:30)
- Pantalla: portada de la app y la lista «Mis viajes».
- Narración: «Marco Polo es el cuaderno de tu viaje: arma los días, calcula tiempos y gastos, y te guía en cada ciudad. En estos videos vemos cómo usarlo, parte por parte.»

### 1. Crear un viaje (2:00)
- Pantalla: el asistente paso a paso: país, fechas, personas, cómo llegas y cómo te vas, ciudades y noches, alojamiento y ritmo.
- Narración: explica que solo lo esencial es obligatorio, que todo se cambia después en Configurar y que al llegar a un aeropuerto o estación la app calcula el traslado al hotel.

### 2. Configurar (1:00)
- Pantalla: fechas, ciudades, noches, llegada y salida.
- Narración: dónde se cambia cada decisión del viaje y qué se recalcula solo.

### 3. Programa: el corazón de la app (5–6 min, en subescenas)
1. **Cómo se lee un día:** pestañas de días, hora de inicio, tarjeta de cada actividad, traslado entre actividades, hora de vuelta al alojamiento.
2. **Cargar cosas al día:** «Agregar actividad a este día» y elegir atracciones por categoría.
3. **Elegir el día de una actividad:** el selector «día automático / fijar día».
4. **Ver los detalles:** «¿Por qué vale la pena?» y la ficha completa.
5. **Quitar y reordenar:** botón ✕, flechas ↑↓, orden manual y «Orden automático».
6. **Avisos:** sobrecarga del día, cierres, horarios nocturnos, zonas de precaución.
7. **El mapa del día:** plano con clip, ampliarlo, y «Ver recorrido en Google Maps».
8. **Comidas, clima y presupuesto del día:** cómo se ajustan.
- Narración: lenta y con ejemplos concretos del viaje de muestra. Es el video donde más sirve el círculo en cada toque y los rótulos.

### 4. Atracciones: «vitrinear» panoramas (3:00)
- Pantalla: carrusel de fichas, filtros por tipo y zona, ilustración, «Qué mirar», historia del lugar, «Elige tu caminata» (versiones por tiempo, mapa, agregar al programa), contexto histórico y espectáculos.
- Narración: la idea de explorar sin compromiso y agregar al programa solo lo que gusta.

### 5. Comidas (1:30)
- Pantalla: guía de qué comer, lugares sugeridos, cómo se suma al día.

### 6. Mapa (1:00)
- Pantalla: mapa de la ciudad y de las zonas, cómo tocar un lugar.

### 7. Gastos (2:00)
- Pantalla: presupuesto contra lo real, cargar un gasto, gastos por día, Reglas de quién paga qué.

### 8. Transporte (2:00)
- Pantalla: trenes y pases, hoja de transporte urbano de la ciudad, tarjetas de llegada y salida con enlace a Maps, «Lo que compré».

### 9. Alojamiento (1:00)
- Pantalla: anotar opciones, elegir una y cómo cambia el presupuesto y el punto de partida del día.

### 10. Trámites (1:00)
- Pantalla: lo que se necesita por país y al cruzar fronteras.

### 11. Cierre (0:30)
- Narración: recordar que la app funciona en el celular, que todo se puede cambiar, y a quién preguntar.

Total completo: ~19 min. Para el video «completo» recomiendo una versión resumida de ~10–12 min, y dejar los videos por sección para quien busque algo puntual.

## 4. Fases y esfuerzo

| Fase | Entregable | Dependencia |
|---|---|---|
| 1 | Viaje de ejemplo fijo para filmar y revisión de los textos de la app | Ninguna |
| 2 | (Opcional) Pasada de diseño del Programa | Tu visto bueno |
| 3 | Guion completo por escena, para tu corrección | Fase 1 |
| 4 | Audio: tú grabas, o se genera la voz | Guion aprobado |
| 5 | Script de captura y primera escena de prueba (Programa, subescena 1) para validar el formato | Fases 1 y 4 |
| 6 | Resto de escenas y montaje | Prueba aprobada |
| 7 | Entrega y enlaces desde la sección Ayuda de la app | Videos aprobados |

Propuesta: hacer **primero una escena de prueba** (≈1 min) de punta a punta, con marco de teléfono, voz y subtítulos, para ajustar estilo antes de producir todo.

## 5. Decisiones que necesito de ti
1. Voz: A (tu voz), B (clonada) o C (genérica).
2. ¿Pasada de diseño al Programa antes de filmar, o filmar ya?
3. ¿Qué viaje de muestra uso: París-Londres (el más completo) o uno del motor?
4. ¿Los videos serán públicos (para cualquier usuario) o solo para ti y tu familia?
5. Acento y tono del guion (cercano y chileno, o más neutro).
