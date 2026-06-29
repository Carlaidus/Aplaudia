# LAST REPORT

Fecha: 2026-06-30

## Objetivo de la tarea

Corregir la sección de casos/portfolio para que use referencias reales, se vea profesional, mejore legibilidad y hable como Aplaudia, sin mencionar a Carlos como marca pública ni usar reclamos técnicos poco útiles.

## Problemas detectados

- Arik Custom:
  - `arik-producto.webp` era una composición inventada;
  - la camiseta no parecía real;
  - el texto de la ficha quedaba forzado;
  - `arik-admin-panel.webp` era otra composición sintética, no una captura real.
- Cronoras:
  - `cronoras-admin-panel.webp` también era una composición sintética.
- Aventuras Pixeladas:
  - `aventuras-control-modular.webp` era una imagen explicativa inventada;
  - `aventuras-cartuchos.webp` tenía overlay/texto propio y no era una captura limpia.
- Copy público:
  - `/casos` decía “trabajos reales de Carlos” y metadata con “construidos por Carlos”.
  - El hero mostraba `Claude AI` y `Vercel` como stack visible.
  - `/llms.txt` hablaba de validación por Carlos.
  - El aviso de construcción mencionaba Cloudflare/Railway como detalle público.
- Legibilidad:
  - varias descripciones y bullets dentro de las fichas estaban en `text-sm` y resultaban pequeños.

## Criterio aplicado

- Prioridad a capturas reales de los proyectos, aunque eso implique quitar imágenes de panel si no hay una captura limpia disponible.
- Sin composiciones inventadas para vender una funcionalidad.
- Sin overlays añadidos encima de capturas de casos.
- Capturas mostradas con `object-contain` en la galería para evitar cortes raros.
- Copy en nombre de Aplaudia, no de Carlos.
- Tecnología comunicada como capacidad profesional: Next.js, React, TypeScript y SEO técnico.

## Imágenes sustituidas o añadidas

- `arik-producto.webp`: sustituida por captura real de la ficha `kp133` en Arik Custom.
- `arik-presupuesto.webp`: añadida con captura real del flujo de presupuesto con producto seleccionado.
- `aventuras-cartuchos.webp`: sustituida por recorte real de la home responsive, sin overlay.
- `aventuras-paneles.webp`: sustituida por recorte real más limpio de paneles de contenido.
- `aventuras-responsive.webp`: añadida como vista real responsive.

## Imágenes eliminadas

- `public/portfolio/arik-admin-panel.webp`
- `public/portfolio/cronoras-admin-panel.webp`
- `public/portfolio/aventuras-control-modular.webp`

Motivo: no eran capturas reales limpias; eran composiciones sintéticas y podían dar sensación de proyecto inventado.

## Cambios aplicados

- `content/showcase.ts`:
  - Cronoras usa dashboard, proyectos y estadísticas reales.
  - Arik Custom usa catálogo, ficha real de producto y presupuesto real.
  - Aventuras Pixeladas usa cartuchos, paneles y responsive reales.
  - Eliminado `motionDemo`.
- `app/casos/[slug]/page.tsx`:
  - Eliminado el bloque de animación modular.
  - Galería con `object-contain` para no cortar capturas.
  - Textos de fichas subidos a `text-base` para mejorar legibilidad.
- `app/casos/page.tsx`:
  - Copy público reescrito como Aplaudia.
  - Eliminada mención a Carlos.
  - Descripciones más legibles.
- `components/sections/hero.tsx`:
  - Stack visible cambiado a `Next.js`, `React`, `TypeScript`, `SEO técnico`.
- `content/site.ts`:
  - Aviso de construcción sin Cloudflare/Railway como mensaje público.
- `app/llms.txt/route.ts`:
  - Estado de construcción redactado sin nombrar a Carlos.
- `components/sections/construction-notice.tsx`:
  - Aviso minimizado fijado abajo también en móvil para evitar solapes con antetítulos de casos.
  - Eliminado listener de scroll que ya no era necesario.
- `app/globals.css`:
  - Eliminado CSS de la animación modular.
- `components/cases/cartucho-motion-demo.tsx`:
  - Eliminado por no encajar con el criterio de capturas reales.

## Validaciones ejecutadas

- `npm install`: no necesario; no se añadieron dependencias.
- `npm run build`: OK desde `T:\20-PROYECTOS\APLAUDIA`.
- `npm run build` desde ruta UNC: falla por limitación de `cmd.exe` con rutas UNC y no representa un fallo del proyecto.
- `npm run lint`: no ejecutable; `eslint` no está instalado como dependencia.
- `npx tsc --noEmit`: falla solo por deuda previa:
  - tipos/implícitos en `components/ui/calendar.tsx`;
  - desalineación antigua de mensajes `about` en `i18n/provider.tsx`.
- Producción local `http://127.0.0.1:3018`:
  - `/casos`: aviso visible, sin `Carlos`, `Claude AI`, `Vercel` ni `Cloudflare` en texto renderizado.
  - `/casos/cronoras`: 3 vistas, sin overflow móvil.
  - `/casos/arik-custom`: 3 vistas, ficha y presupuesto reales, sin overflow móvil/escritorio.
  - `/casos/aventuras-pixeladas`: 3 vistas reales, sin animación inventada, sin overflow móvil/escritorio.
  - `scrollWidth` = `clientWidth` en móvil y escritorio revisados.
- Producción pública `https://aplaudia.com`:
  - `/`, `/casos`, `/casos/cronoras`, `/casos/arik-custom`, `/casos/aventuras-pixeladas`, `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200`.
  - Los 12 assets de `public/portfolio/` usados por los casos responden `200 image/webp`.
  - Revisión móvil en navegador: aviso de construcción visible abajo, sin pisar el antetítulo del caso, sin scroll horizontal.
  - Arik Custom muestra home, catálogo, ficha real `kp133` y presupuesto real.
  - Aventuras Pixeladas muestra home, cartuchos reales, paneles de contenido y vista responsive real.
  - No aparecen los textos públicos retirados: `trabajos reales de Carlos`, `Claude AI`, `Vercel`, `Cloudflare` ni `programación con IA`.

## Estado de Railway

El CLI de Railway sigue sin sesión válida (`invalid_grant` / `Unauthorized`), así que no se pudo leer el dashboard desde terminal sin volver a autenticar.

Estado real comprobado por producción:

- Commit de portfolio real publicado: `0e762d67d853de24224d8e7a939f794f27c71853`.
- Commit de ajuste móvil del aviso publicado: `19677cc`.
- `https://aplaudia.com` sirve las rutas y assets nuevos con `200`.
- El comportamiento móvil corregido ya se observa en producción.

## Estado final

Los casos quedan más sobrios y creíbles:

- Arik Custom ya no usa imagen de camiseta falsa ni panel sintético.
- Cronoras vuelve a apoyarse en capturas reales de demo/producto.
- Aventuras Pixeladas usa recortes reales sin overlays añadidos.
- La tipografía de fichas es más legible.
- La marca pública habla como Aplaudia.
- El aviso flotante de construcción sigue visible y ya no pisa el encabezado del caso en móvil.

## Siguiente paso recomendado

Revisar en producción con Carlos, en móvil real y escritorio, si la nueva selección de capturas ya transmite suficiente confianza comercial. Si se valida, el siguiente foco debería ser legal/contacto y datos reales de contacto antes de retirar el aviso de construcción.
