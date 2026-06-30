# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Validar en producción la versión con lightbox ampliado, WhatsApp real publicado y formulario interno de contacto preparado con Resend.

## Repo

`Carlaidus/Aplaudia`

## Repos de referencia

- Repo principal: `Carlaidus/Aplaudia`.
- Referencia para envío de correo/contacto: `Carlaidus/v0-diseno-web-arik-custom`.

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- `https://www.aplaudia.com/` redirige correctamente a raíz.
- `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200`.
- Railway estaba en verde según las últimas validaciones HTTP.
- La web debe mantener aviso de construcción hasta validación final.
- Ya existen páginas de casos y galería ampliable:
  - `/casos`;
  - `/casos/cronoras`;
  - `/casos/arik-custom`;
  - `/casos/aventuras-pixeladas`.
- Las vistas clave de casos ya usan lightbox grande en escritorio y móvil.
- WhatsApp real publicado:
  - número visible: `659304487`;
  - formato internacional: `34659304487`;
  - enlace centralizado en `content/site.ts`.
- Formulario interno de contacto preparado:
  - endpoint `/api/contacto`;
  - envío por Resend;
  - sin base de datos;
  - sin guardar mensajes en el repo.
- Variables para activar el formulario real en Railway:
  - `RESEND_API_KEY`;
  - `CONTACT_RECIPIENT_EMAIL`;
  - `EMAIL_FROM`.
- El agente flotante de Aplaudia existe, pero solo está preparado con fallback si falta API externa.
- Variables para activar agente real:
  - `APLAUDIA_AGENT_API_URL`;
  - `APLAUDIA_AGENT_API_SECRET`.
- No mencionar programación con IA como mensaje público.

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
3. Configurar en Railway, sin guardar secretos en el repo:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
4. Enviar una prueba real del formulario y comprobar en Resend:
   - entrega correcta;
   - remitente permitido;
   - `replyTo` del visitante.
5. Revisar con Carlos:
   - si el panel interno de Arik Custom debe mantenerse público;
   - si el agente IA debe conectarse a un servicio real;
   - si se mantiene el fallback o se oculta el widget hasta tener API real.
6. Preparar legal/contacto:
   - aviso legal;
   - privacidad;
   - cookies si aplica;
   - texto definitivo de consentimiento del formulario.
7. Decidir cuándo retirar el aviso de construcción.

## Deuda técnica recomendada

- Instalar/configurar ESLint para que `npm run lint` funcione.
- Resolver tipos de `react-day-picker`.
- Alinear mensajes i18n de `about` en ES/CA/EN para que `npx tsc --noEmit` pase.
- Mantener `next build --webpack` mientras el workspace local siga en unidad de red.

## Restricciones

- No rediseñar la web completa.
- No romper home, casos, móvil ni escritorio.
- No tocar dominio, DNS ni Cloudflare.
- No añadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programación con IA como mensaje público.
- No inventar datos legales, dirección, CIF, precios, plazos ni garantías.
- WhatsApp ya está publicado por instrucción de Carlos; no añadir más datos personales sin validación.
- No hacer que el formulario parezca enviado correctamente si falta configuración real de Resend.

## Cierre esperado de la próxima sesión

- Producción verificada tras despliegue.
- Formulario probado con variables reales de Railway o documentado si falta acceso.
- Decisión sobre agente real.
- Decisión sobre panel interno de Arik en portfolio.
- Siguiente paso claro para legal/contacto y lanzamiento.
