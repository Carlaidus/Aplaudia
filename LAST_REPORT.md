# LAST REPORT

Fecha: 2026-06-29

## Objetivo de la tarea

Convertir el portfolio de Aplaudia en una propuesta comercial mas solida usando trabajos reales de Carlos, sin redisenar la web ni tocar backend, base de datos, auth, pagos, dominio, DNS o Cloudflare.

## Huecos detectados

- La seccion `#portfolio` todavia mezclaba casos conceptuales con placeholders.
- El bloque de casos mostraba textos genericos y el literal "Vista previa conceptual".
- El bloque de portfolio real contenia "Proyecto demo 1", "Proyecto demo 2", "Imagen del proyecto" y una tarjeta punteada de proyecto futuro.
- No habia capturas reales de trabajos ya publicados.
- El CTA del portfolio no llevaba a un mini caso propio dentro de Aplaudia.
- Faltaba una estructura clara para explicar que es cada proyecto, para quien es, que se hizo y por que vende bien como ejemplo.

## Proyectos reales usados

- Cronoras:
  - URL publica revisada: `https://cronoras.com/demo-guia.html`.
  - Vista elegida: demo guiada con dashboard y datos ficticios.
  - Motivo: ensena producto SaaS real, metricas, proyectos y demo sin exponer cuentas privadas.
- Arik Custom:
  - URL publica revisada: `https://arikcustom.up.railway.app/catalogo`.
  - Vista elegida: catalogo con filtros y tarjetas de producto.
  - Motivo: ensena una web comercial orientada a vender producto y pedir presupuesto.
- Aventuras Pixeladas:
  - URL publica revisada: `https://aventuraspixeladas.up.railway.app/`.
  - Vista elegida: asset hero real del proyecto desde el repo, porque la captura headless de la home dinamica no fue estable.
  - Motivo: representa mejor la identidad pixel art y evita una captura parcial o defectuosa.

## Imagenes anadidas

Todas se guardaron optimizadas en WebP 1280 x 800 dentro de `public/portfolio/`:

- `cronoras-dashboard.webp` - 47 KB aprox.
- `arik-catalogo.webp` - 33 KB aprox.
- `aventuras-pixeladas-home.webp` - 60 KB aprox.

No se han guardado perfiles temporales de Chrome, capturas RAW, secretos ni datos privados.

## Estructura elegida

Se eligio una solucion hibrida:

- Resumen potente dentro de la home de Aplaudia.
- Ficha individual preparada para cada caso:
  - `/casos/cronoras`
  - `/casos/arik-custom`
  - `/casos/aventuras-pixeladas`
- Enlace externo a la web real cuando procede.

Esta opcion es mejor que enlazar solo fuera, porque Aplaudia mantiene contexto comercial propio y puede explicar el valor del trabajo. Tambien es mejor que encerrar todo dentro de Aplaudia sin enlaces, porque el visitante puede comprobar que los proyectos existen y estan publicados.

## Cambios aplicados

- `content/showcase.ts`:
  - Sustituido contenido demo por datos reales de Cronoras, Arik Custom y Aventuras Pixeladas.
  - Anadio descripcion, publico objetivo, entregables, puntos clave, URL real y ruta de caso por proyecto.
- `components/sections/showcase.tsx`:
  - Eliminados placeholders visuales.
  - Anadio imagen real optimizada por proyecto.
  - Anadio bullets comerciales y CTAs `Ver caso` + enlace a web/demo real.
  - Mantiene la misma seccion `#portfolio`, tarjetas, animacion de entrada y orden general de la home.
- `app/casos/page.tsx`:
  - Nuevo indice de casos reales.
- `app/casos/[slug]/page.tsx`:
  - Nuevas fichas individuales de caso con contenido procedente de `content/showcase.ts`.
- `i18n/messages/es.json`, `ca.json`, `en.json`:
  - Actualizados titulares de portfolio para dejar de hablar de casos conceptuales.
- `public/sitemap.xml`:
  - Anadidas `/casos` y las tres fichas.
- `public/portfolio/`:
  - Anadidas las tres imagenes WebP optimizadas.

## Validaciones ejecutadas

- `npm install`: no necesario; `node_modules` ya estaba presente.
- `npm run build`: OK con `next build --webpack`.
- `npm run lint`: no ejecutable; el script llama a `eslint .`, pero `eslint` no esta instalado como dependencia.
- Local con `next start`:
  - Home `#portfolio` en desktop 1440 px: 3 tarjetas reales, sin overflow horizontal real (`documentScrollWidth` 1425 frente a `innerWidth` 1440).
  - Home `#portfolio` en movil 390 px: tarjetas apiladas, CTAs en una columna, sin overflow horizontal real (`documentScrollWidth` 375 frente a `innerWidth` 390).
  - `/casos/cronoras` en movil 390 px: sin overflow, botones ocupan ancho correcto y contenido no se solapa.
  - Aviso de construccion visible en home y tambien en las nuevas rutas de casos.
- Busqueda de copy:
  - No quedan "Proyecto demo", "Vista previa conceptual" ni "Imagen del proyecto" como contenido visible del portfolio.
  - No se introdujeron "reservacion", "agendar", "capacitar", AM/PM ni "portafolio".

## Estado de Railway

- Antes de hacer push, Railway seguia en verde segun el estado heredado documentado.
- Pendiente de comprobar el deployment del commit de esta tarea tras `git push`.

## Estado final local

Aplaudia ya tiene una primera propuesta real de portfolio/casos con ejemplos existentes de Carlos. Los huecos visuales importantes del portfolio quedan sustituidos por imagenes reales optimizadas, la home mantiene aviso de construccion y la estructura queda preparada para ampliar casos sin rehacer la seccion.

## Siguiente paso recomendado

Despues del push, comprobar Railway y produccion. Si queda en verde, Carlos deberia revisar los tres casos y decidir si se amplian con mas capturas por proyecto, resultados concretos o testimonios reales cuando existan datos confirmados.
