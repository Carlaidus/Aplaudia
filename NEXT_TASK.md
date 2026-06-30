# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Validar en producción la versión con contacto limpio, mensaje guiado editable, canales email/WhatsApp/ambos y lightbox de casos a pantalla completa real.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- La web debe mantener aviso de construcción hasta validación final.
- WhatsApp real publicado:
  - número visible: `659304487`;
  - formato internacional: `34659304487`;
  - enlace centralizado en `content/site.ts`.
- Contacto interno actualizado:
  - `content/contact.ts` contiene tipos de proyecto, mensajes guía y canales;
  - `components/contact/contact-form.tsx` muestra un bloque sin `mailto`, email visible ni WhatsApp duplicado dentro del formulario;
  - canales: email, WhatsApp o ambos;
  - `/api/contacto` envía por Resend solo si el canal requiere email;
  - WhatsApp funciona sin Resend preparando el mensaje editable.
- Lightbox actualizado:
  - `components/cases/case-gallery.tsx`;
  - modal `100vw` x `100dvh`;
  - textos como overlay para no reducir el área de imagen.
- Agente Aplaudia:
  - widget implementado;
  - instrucciones en `content/agent/aplaudia-agent.md`;
  - endpoint `/api/agent`;
  - necesita `APLAUDIA_AGENT_API_URL` y `APLAUDIA_AGENT_API_SECRET` para IA real;
  - si faltan variables, usa fallback.
- Variables para activar email real en Railway:
  - `RESEND_API_KEY`;
  - `CONTACT_RECIPIENT_EMAIL`;
  - `EMAIL_FROM`.
- No hay base de datos, auth ni pagos.
- No guardar secretos en el repo.

## Próxima tarea

1. Confirmar despliegue tras el último push a `main`.
2. Revisar producción:
   - `https://aplaudia.com/`;
   - `https://aplaudia.com/casos`;
   - `https://aplaudia.com/casos/cronoras`;
   - `https://aplaudia.com/casos/arik-custom`;
   - `https://aplaudia.com/casos/aventuras-pixeladas`;
   - `https://aplaudia.com/robots.txt`;
   - `https://aplaudia.com/llms.txt`;
   - `https://aplaudia.com/sitemap.xml`.
3. Configurar en Railway, sin guardar secretos:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
4. Enviar una prueba real del formulario por email y por ambos canales.
5. Confirmar en Resend:
   - entrega correcta;
   - remitente permitido;
   - `replyTo` del visitante.
6. Revisar legal/contacto:
   - aviso legal;
   - privacidad;
   - cookies si aplica;
   - texto definitivo de consentimiento.
7. Decidir cuándo retirar el aviso de construcción.

## Deuda técnica recomendada

- Instalar/configurar ESLint para que `npm run lint` funcione.
- Resolver tipos de `react-day-picker`.
- Alinear mensajes i18n de `about` en ES/CA/EN para que `npx tsc --noEmit` pase.
- Mantener `next build --webpack` mientras el workspace local siga en unidad de red.

## Restricciones

- No rediseñar la web completa.
- No romper home, casos, móvil ni escritorio.
- No tocar dominio, DNS ni Cloudflare salvo petición explícita.
- No añadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programación con IA como mensaje público.
- No inventar datos legales, dirección, CIF, precios, plazos ni garantías.

## Cierre esperado de la próxima sesión

- Producción verificada tras despliegue.
- Variables reales de Resend configuradas o bloqueo documentado.
- Prueba real de email/ambos completada si hay acceso.
- Siguiente paso claro para legal/contacto y lanzamiento.
