# Estándar de «ciudad rica» (nacido en Belfast)

Todo lo que se agregó a Belfast por encima del motor básico, para repetirlo en cualquier ciudad. El motor ya sabe mostrarlo: cada punto es un campo opcional del archivo de la ciudad (`v2/ciudades/<pais>/<ciudad>.js`). Si falta, no se muestra nada.

## 1. Contenido por ciudad (campos del archivo)

| Campo | Qué es | Dónde se ve |
|---|---|---|
| `CIUDAD.portada` | `[src, leyenda]` ilustración panorámica 2:1 | Arriba de «Sobre la ciudad» |
| `CONTEXTO` | `{t, tl[[año,hecho]], p[párrafos], fig[[índice,src,leyenda]]}`: historia en párrafos con **línea de tiempo** y figuras intercaladas | «📜 Historia» (desplegable) |
| `UNDIA[]` | Bloques `{t, p[], l[[clave,valor]], fig[]}` con «lo que conviene saber si vienes por un día»: idioma y modismos, qué comer y beber, escudo y bandera, cosas que casi nadie nota | «🧭 Si vienes por un día» |
| `MEDIA[]` | `[título, tipo, descripción, año]` de cine, música y libros | «🎬 Cine, música y libros» |
| `ATRACCIONES[].y` | Año de construcción o fundación | Ficha |
| `ATRACCIONES[].arq` | `{est[estilos], t, e, ar}`: estilo(s), tipo, época, arquitecto. Los estilos enlazan al **glosario con fotos** (`v2/estilos.js`) | Ficha, bloque «Arquitectura» |
| `ATRACCIONES[].mir[]` | «Qué mirar desde la calle» | Ficha |
| `ATRACCIONES[].his[]` | Historia del lugar en párrafos | Ficha |
| `ATRACCIONES[].ilu` | `[src, leyenda]` ilustración propia de la ficha | Inicio de la ficha |
| `RUTAS[]` | Caminatas temáticas (ver punto 2) | «Recorridos a pie» |

Datos cuantitativos siempre verificados (coordenadas, precios, horarios, arquitectos, fechas): pasar por un agente verificador antes de publicar. En Belfast corrigió varios errores.

## 2. Caminatas (RUTAS)

- Cada caminata: `{id, n, e, d, v[{k,n,ids}], comb, aviso, img}`.
- **Versiones por tiempo disponible** (p. ej. mañana, tarde, día completo): botones que muestran el tiempo calculado.
- El motor calcula solo: visitas + caminata (distancia ×1,3 a 4,8 km/h), km totales y número de paradas.
- Cada parada enlaza a su ficha y muestra estilo/arquitectura; «Para completar el día» sugiere extras.
- **Plano con clip** para cada caminata: puntos numerados y recorrido, ampliable.
- Botón «＋ Agregar al programa»: las paradas pasan al Programa y se reparten en los días.
- Presentación: carrusel horizontal con barra de flechas «Caminata 1 de N · desliza ⇆», la siguiente tarjeta se asoma, y el alto del marco se ajusta a la caminata visible (no se iguala a la más larga).

## 3. Atracciones y Programa

- **Categorías compartidas** (`GRUPOS` en `v2/motor.js`): museos, monumentos/historia, iglesias, paseos/barrios/mercados, naturaleza, entretenidas, familia, compras. Se usan en Atracciones (filtro «Tipo» y lista agrupada) y en Programa («Elegir atracciones» por categoría, sin lista duplicada).
- Carrusel de fichas: el alto toma el de la ficha actual.
- Estilo «cuaderno»: sin recortes ni rotaciones exagerados en tarjetas altas ni en teléfono (evita desborde horizontal).

## 4. Ilustraciones

- Estilo común y prompts en `ILUSTRACIONES-<CIUDAD>.md` (modelo: `ILUSTRACIONES-BELFAST.md`): cuaderno de arquitecto, tinta y acuarela, papel crema, paleta fija, textos en español.
- Set tipo (12): portada, mapa histórico, hito industrial/histórico, edificio emblema (elevación), escudo y banderas, curiosidad arquitectónica, pub/café emblema, plato típico, curiosidad cultural (colores/costumbre), fiesta o tradición, dinero local, mapa ilustrado de la caminata.
- Se guardan en `img/<ciudad>/NN-nombre.jpg`, 1500 px de ancho, JPEG ~80 % (≈450 KB). Si el archivo no existe, no se muestra nada.
- Clic en una ilustración: se amplía a pantalla completa (clic, ✕ o Esc para volver).
- Temas sensibles (política, religión): lenguaje neutral y sin símbolos partidistas.

## 5. Checklist para sumar una ciudad al estándar

1. Investigar y redactar `CONTEXTO`, `UNDIA`, `MEDIA`.
2. Enriquecer cada atracción: `y`, `arq`, `mir`, `his`.
3. Definir 3–4 `RUTAS` con versiones por tiempo.
4. Verificar datos con un agente independiente.
5. Generar el `ILUSTRACIONES-<CIUDAD>.md` con 12 prompts y reservar los espacios (`portada`, `fig`, `ilu`, `img`).
6. Agregar estilos nuevos al glosario (`v2/estilos.js`) si hace falta.
7. Probar en teléfono: sin desborde horizontal, carruseles, ampliación de imágenes.

## 6. Ciudades pendientes de enriquecer

París, Londres, Edimburgo, Dublín, Estrasburgo y el resto de los packs: tienen el contenido básico, no estos campos.
