# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Revisar en producción la versión con navegación interna corregida, agente flotante preparado, vistas clave ampliables y caso de Arik Custom reforzado con panel interno real.

## Repo

`Carlaidus/Aplaudia`

## Rama esperada

`main`

## Contexto confirmado

- `https://aplaudia.com/` funciona y debe mantener aviso de construcción hasta validación final.
- Los casos activos son:
  - `/casos/cronoras`;
  - `/casos/arik-custom`;
  - `/casos/aventuras-pixeladas`.
- La navegación de páginas internas debe apuntar a secciones de home con `/#...`.
- Cada caso permite volver a `/casos` y a `/`.
- Las vistas clave de casos son ampliables con lightbox.
- Arik Custom ya usa captura real de catálogo centrada en filtros y captura real del panel interno.
- El agente flotante web está preparado con fallback si faltan variables.
- Variables para activar agente real:
  - `APLAUDIA_AGENT_API_URL`;
  - `APLAUDIA_AGENT_API_SECRET`.
- Número confirmado para futuro WhatsApp: `659304487`, formato internacional `34659304487`.
- El agente web flotante no sustituye todavía la futura integración con WhatsApp Business/Meta.

## Próxima tarea

1. Confirmar despliegue de Railway tras el último push a `main`.
2. Revisar producción:
   - `https://aplaudia.com/`;
   - `https://aplaudia.com/casos`;
   - `https://aplaudia.com/casos/cronoras`;
   - `https://aplaudia.com/casos/arik-custom`;
   - `https://aplaudia.com/casos/aventuras-pixeladas`;
   - `https://aplaudia.com/robots.txt`;
   - `https://aplaudia.com/llms.txt`;
   - `https://aplaudia.com/sitemap.xml`.
3. Revisar con Carlos:
   - si el panel interno de Arik Custom debe mostrarse públicamente;
   - si el agente IA debe conectarse a un servicio real;
   - si se quiere mantener el fallback o esconder el widget hasta tener API real;
   - si se publica WhatsApp real como CTA o se deja para fase legal/contacto.
4. Preparar legal/contacto:
   - aviso legal;
   - privacidad;
   - cookies si aplica;
   - canal real de contacto.
5. Decidir cuándo retirar el aviso de construcción.

## Deuda técnica recomendada

- Instalar/configurar ESLint para que `npm run lint` funcione.
- Resolver tipos de `react-day-picker`.
- Alinear mensajes i18n de `about` en ES/CA/EN para que `npx tsc --noEmit` pase.
- Mantener `next build --webpack` mientras el workspace local siga en unidad de red.

## Restricciones

- No rediseñar la web completa.
- No cambiar identidad visual sin validación.
- No inventar clientes, datos legales, resultados, cifras o testimonios.
- No guardar claves ni secretos.
- No tocar Cloudflare ni DNS salvo petición explícita.
- No añadir backend, base de datos, auth ni pagos.
- No mencionar programación con IA como mensaje público.
- No publicar teléfono, WhatsApp o datos legales hasta validar legal/contacto.

## Cierre esperado de la próxima sesión

- Producción verificada tras despliegue.
- Decisión sobre agente real.
- Decisión sobre panel interno de Arik en portfolio.
- Decisión sobre WhatsApp/contacto real.
- Siguiente paso claro para legal/contacto y lanzamiento.
