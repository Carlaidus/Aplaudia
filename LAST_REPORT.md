# LAST REPORT

Fecha: 2026-06-29

## Objetivo de la tarea

Corregir la rotura visual en movil de Aplaudia sin redisenar la web, manteniendo layout, contenido, secciones, SEO tecnico y aviso de construccion.

## Problema real encontrado

En produccion movil, el hero cargaba con el titular roto:

- `impulsa` quedaba desplazado y se montaba visualmente sobre `tu negocio`.
- En anclas internas, la pastilla fija de construccion tapaba etiquetas de seccion como `CASOS DE ESTUDIO`.
- El titular de servicios podia verse con palabras montadas durante la entrada animada del ancla.

## Causa confirmada

La causa no era contenido ni layout general. Era una combinacion de animaciones de entrada en el primer render movil:

- `MaskedWord` cambiaba de estructura cuando entraba el modo ligero y podia dejar un `translateY(100%)` activo en spans del hero.
- Los spans animados del H2 de servicios arrancaban con `opacity`, `scale` o `translate` antes de estabilizarse en movil.
- La pastilla compacta de construccion estaba fija arriba a la derecha tambien al hacer scroll, por lo que podia cubrir encabezados de seccion.

## Cambios aplicados

- Hero:
  - `MaskedWord` mantiene estructura estable.
  - En movil y `prefers-reduced-motion`, los spans animados fuerzan `transform: none` y `opacity: 1`.
  - Se evita que `impulsa` y `tu negocio` se solapen en la carga inicial.
- Motion performance:
  - La deteccion de modo ligero usa efecto de layout isomorfico para activarse antes en cliente.
- Servicios:
  - Los spans del H2 fuerzan estado visible y sin transform en movil/reduced motion.
  - Se mantiene el mismo texto y resultado visual final.
- Aviso de construccion:
  - Arriba a la derecha solo cerca del inicio del hero.
  - Al hacer scroll pasa a la esquina inferior derecha.
  - En movil estrecho, cuando esta abajo, queda como boton compacto de icono para no tapar texto.

## Archivos modificados

- `components/motion-performance-provider.tsx`
- `components/sections/hero.tsx`
- `components/sections/services.tsx`
- `components/sections/construction-notice.tsx`
- `LAST_REPORT.md`
- `NEXT_TASK.md`

## Validaciones ejecutadas

- `npm install`: no necesario; `node_modules` ya estaba presente.
- `npm run build`: OK con `next build --webpack`.
- `npm run lint`: no ejecutable; el script llama a `eslint .`, pero `eslint` no esta instalado como dependencia.
- Local con `next start`:
  - Revisado en 360 px, 390 px, 430 px y 768 px.
  - Hero sin solape entre `impulsa` y `tu negocio`.
  - Servicios sin palabras montadas en `brillar en digital`.
  - Anclas `#servicios`, `#portfolio`, `#whatsapp` y `#contacto` sin overflow horizontal real.
  - Aviso de construccion visible y no intrusivo en titulares.
- Produccion en `https://aplaudia.com` tras push:
  - Revisado `#inicio`, `#servicios`, `#portfolio` y `#contacto` en 390 px.
  - Sin errores ni warnings relevantes de consola.
  - Aviso de construccion sigue visible.
  - `https://aplaudia.com/`: `200`.
  - `https://www.aplaudia.com/`: `301` a `https://aplaudia.com/`.
  - `https://aplaudia.com/robots.txt`: `200`.
  - `https://aplaudia.com/llms.txt`: `200`.
  - `https://aplaudia.com/sitemap.xml`: `200`.

## Estado de Railway

- Railway en verde tras el commit funcional `79e820aca589764c002f4078ba6cf6d368897fb6`.
- Deployment funcional validado: `a648beb1-d9d0-4ed8-b729-330048918857`, `SUCCESS`, 2026-06-29 19:26:09 +02:00.
- Proyecto: `Aplaudia`.
- Environment: `production`.
- Service: `Aplaudia`.

## Estado final

`https://aplaudia.com` carga correctamente. El hero movil ya no junta palabras, el titular de servicios queda limpio, los anclajes principales no quedan tapados por la pastilla de construccion y el aviso de construccion sigue disponible. No se ha tocado dominio, DNS, Cloudflare, backend, base de datos, auth ni pagos.

## Contexto heredado de rendimiento

Se mantiene como contexto confirmado de la tarea anterior:

- `MotionPerformanceProvider` sigue activo.
- `prefers-reduced-motion`, `max-width: 900px` y `pointer: coarse` siguen activando modo ligero.
- Glows y fondos de bucle continuo ya se habian convertido mayoritariamente en estaticos.
- Hover complejo sigue desactivado en dispositivos tactiles.
- `repeat: Infinity` ya habia sido reducido de 34 apariciones a 1 loop principal del hero en escritorio.
- La medicion anterior en produccion movil habia bajado de `filter: 36` a `filter: 28` y de `transform: 332` a `transform: 264`.
- SEO tecnico, `robots.txt`, `sitemap.xml`, `/llms.txt` y JSON-LD no se tocaron en esta tarea.

## Siguiente paso recomendado

Carlos debe revisar la web en movil real pequeno, movil medio, tablet y escritorio real. Si confirma que la experiencia ya se ve seria y fluida, el siguiente paso es decidir lanzamiento: mantener el aviso de construccion, suavizarlo o retirarlo cuando valide contenido, contacto y legales basicos.
