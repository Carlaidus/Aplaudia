# LAST REPORT

Fecha: 2026-06-30

## Objetivo de la tarea

Refinar Aplaudia sin rediseñar la web: navegación interna de casos, agente IA flotante, mejora de imágenes de casos, ampliación de galerías y estructura modular para futuros proyectos.

## Navegación interna

Solución elegida:

- Mantener el header global.
- En home, conservar anclas locales: `#servicios`, `#proceso`, `#portfolio`, `#whatsapp`, `#nosotros`, `#contacto`.
- En páginas internas, convertirlas a anclas absolutas de home: `/#servicios`, `/#proceso`, `/#portfolio`, `/#whatsapp`, `/#nosotros`, `/#contacto`.
- Aplicar el mismo criterio al footer para evitar enlaces muertos desde `/casos/*`.
- Reforzar la navegación del caso con:
  - `Volver a casos`;
  - `Volver a la home`.
- Ajustar el padding superior del hero de caso para que el header fijo no tape la navegación en móvil.

## Agente IA flotante

Implementado un agente flotante propio de Aplaudia:

- Componente: `components/agent/aplaudia-agent-widget.tsx`.
- API route: `app/api/agent/route.ts`.
- Instrucciones editables: `content/agent/aplaudia-agent.md`.
- Integrado globalmente desde `app/layout.tsx`.
- Posición:
  - móvil: botón abajo a la derecha, por encima del aviso de construcción;
  - escritorio: botón abajo a la izquierda para no chocar con el aviso.
- Puede abrirse y cerrarse correctamente.
- El input permite enviar con botón o `Enter`.
- Si no hay servicio externo configurado, responde con fallback elegante y la web no se rompe.

Variables necesarias para activarlo:

- `APLAUDIA_AGENT_API_URL`
- `APLAUDIA_AGENT_API_SECRET`

No se añadió ninguna clave real ni secreto al repo.

## Imágenes y casos

Arik Custom:

- `arik-catalogo.webp` sustituida por captura real nueva, más centrada en filtros, buscador, familias y productos.
- `arik-dashboard.webp` añadida con captura real del panel interno local de Arik Custom usando contraseña temporal de proceso, sin leer ni guardar secretos.
- La galería de Arik queda con 3 vistas clave:
  - catálogo filtrable;
  - panel interno;
  - solicitud de presupuesto.

Cronoras:

- Mantiene 3 vistas clave reales:
  - dashboard de producto;
  - control de proyectos;
  - estadísticas accionables.

Aventuras Pixeladas:

- Mantiene 3 vistas clave reales:
  - cartuchos de portada;
  - paneles de contenido;
  - experiencia responsive.

## Galería ampliable

Implementado `components/cases/case-gallery.tsx`:

- Cada imagen de `Vistas clave` se puede ampliar.
- El visor funciona con modal reutilizable.
- Incluye título, descripción y botón de cierre.
- Funciona en móvil y escritorio.
- Añadido `data-case-gallery-item` para validaciones automatizadas.

## Estructura modular

Implementado:

- `components/cases/case-template.tsx`: plantilla reutilizable para páginas de caso.
- `components/cases/case-gallery.tsx`: galería reutilizable con lightbox.
- `lib/cases.ts`: punto estable para consumir datos de casos.
- `content/showcase.ts`: sigue siendo la fuente de datos de proyectos y ahora soporta `stack` y `results` opcionales.
- `app/casos/[slug]/page.tsx` queda reducido a metadata, `generateStaticParams`, lookup de caso y render de plantilla.

Añadir un nuevo caso queda reducido principalmente a:

- añadir objeto de proyecto;
- añadir assets en `public/portfolio/`;
- reutilizar la plantilla existente.

## Archivos modificados

- `README.md`
- `app/api/agent/route.ts`
- `app/casos/[slug]/page.tsx`
- `app/casos/page.tsx`
- `app/layout.tsx`
- `components/agent/aplaudia-agent-widget.tsx`
- `components/cases/case-gallery.tsx`
- `components/cases/case-template.tsx`
- `components/sections/footer.tsx`
- `components/sections/header.tsx`
- `components/sections/showcase.tsx`
- `content/agent/aplaudia-agent.md`
- `content/showcase.ts`
- `lib/cases.ts`
- `public/portfolio/arik-catalogo.webp`
- `public/portfolio/arik-dashboard.webp`

## Validaciones ejecutadas

- `npm install`: no necesario; no se añadieron dependencias.
- `npm run build`: OK.
- `npm run lint`: no ejecutable; `eslint` no está instalado como dependencia.
- `npx tsc --noEmit`: falla por deuda previa ya conocida:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineación antigua de mensajes `about` en `i18n/provider.tsx`.
- Producción local `http://127.0.0.1:3020`:
  - `/`: OK.
  - `/casos`: OK.
  - `/casos/cronoras`: OK.
  - `/casos/arik-custom`: OK.
  - `/casos/aventuras-pixeladas`: OK.
  - `/robots.txt`: OK.
  - `/llms.txt`: OK.
  - `/sitemap.xml`: OK.
- Navegación:
  - header interno apunta a `/#...`;
  - `Volver a casos` navega a `/casos`;
  - `Volver a la home` navega a `/`;
  - menú móvil mantiene enlaces absolutos correctos.
- Agente:
  - abre y cierra;
  - envía mensaje;
  - muestra fallback sin API configurada;
  - sin errores de consola en la prueba local.
- Lightbox:
  - abre imagen ampliada;
  - cierra correctamente;
  - Arik tiene 3 vistas clave y una de ellas es el panel interno real.
- Móvil:
  - sin scroll horizontal;
  - `Volver a casos` queda por debajo del header fijo;
  - agente y aviso de construcción no se solapan.
- Producción `https://aplaudia.com` tras push a `main`:
  - `/`: 200 y carga el asistente de Aplaudia.
  - `/casos`: 200.
  - `/casos/cronoras`: 200.
  - `/casos/arik-custom`: 200 y referencia `arik-dashboard`.
  - `/casos/aventuras-pixeladas`: 200.
  - `/portfolio/arik-dashboard.webp`: 200.
  - `/robots.txt`: 200 y apunta a `https://aplaudia.com/sitemap.xml`.
  - `/llms.txt`: 200.
  - `/sitemap.xml`: 200.

## Estado de Railway y producción

Railway CLI sigue sin sesión válida (`invalid_grant` / `Unauthorized`), por lo que no se pudo leer el dashboard desde terminal.

El push a `main` se completó correctamente.

No se puede afirmar el estado visual del dashboard de Railway desde la CLI por falta de sesión válida, pero la validación HTTP confirma que producción ya está sirviendo la versión nueva en `https://aplaudia.com`.

## Siguiente paso recomendado

Revisar en producción con Carlos:

- si el panel interno real de Arik Custom debe mantenerse visible;
- si el agente debe conectarse a un servicio real o quedarse como preparación;
- si legal/contacto está listo para retirar el aviso de construcción.
