# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Validar en produccion el nuevo formulario de contacto estilo Arik Custom:

- seleccion multiple de necesidades primero;
- mensaje editable autocompuesto;
- datos de contacto;
- selector final compacto Email/WhatsApp;
- un unico boton `Enviar`.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- La web debe mantener aviso de construccion hasta validacion final.
- WhatsApp real publicado:
  - numero visible: `659304487`;
  - formato internacional: `34659304487`;
  - enlace centralizado en `content/site.ts`.
- Contacto interno actualizado:
  - `content/contact.ts` contiene necesidades reutilizables, constructor del mensaje guia y canales;
  - `components/contact/contact-form.tsx` muestra seleccion multiple de necesidades antes del mensaje;
  - el mensaje se autocompone y sigue siendo editable;
  - el selector final solo ofrece Email o WhatsApp;
  - el boton visible del formulario es `Enviar`;
  - `/api/contacto` envia por Resend solo si el canal elegido es Email;
  - WhatsApp funciona sin Resend preparando el mensaje editable.
- Lightbox actualizado:
  - `components/cases/case-gallery.tsx`;
  - modal `100vw` x `100dvh`;
  - textos como overlay para no reducir el area de imagen.
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

## Proxima tarea

1. Confirmar despliegue tras el ultimo push a `main`.
2. Revisar produccion:
   - `https://aplaudia.com/`;
   - `https://aplaudia.com/casos`;
   - `https://aplaudia.com/casos/cronoras`;
   - `https://aplaudia.com/casos/arik-custom`;
   - `https://aplaudia.com/casos/aventuras-pixeladas`;
   - `https://aplaudia.com/robots.txt`;
   - `https://aplaudia.com/llms.txt`;
   - `https://aplaudia.com/sitemap.xml`.
3. Comprobar visualmente el formulario en escritorio y movil:
   - necesidades multiples visibles;
   - mensaje cambia al marcar/desmarcar necesidades mientras no se haya editado a mano;
   - datos de contacto quedan debajo del mensaje;
   - selector final solo muestra Email y WhatsApp;
   - no aparece canal `Ambos`;
   - no hay enlaces `mailto` ni WhatsApp duplicados dentro del bloque antes de enviar.
4. Configurar en Railway, sin guardar secretos:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
5. Enviar una prueba real del formulario por Email y otra por WhatsApp.
6. Confirmar en Resend:
   - entrega correcta;
   - remitente permitido;
   - `replyTo` del visitante.
7. Revisar legal/contacto antes de retirar el aviso de construccion:
   - aviso legal;
   - privacidad;
   - cookies si aplica;
   - texto definitivo de consentimiento.

## Deuda tecnica recomendada

- Instalar/configurar ESLint para que `npm run lint` funcione.
- Resolver tipos de `react-day-picker`.
- Alinear mensajes i18n de `about` en ES/CA/EN para que `npx tsc --noEmit` pase.
- Mantener `next build --webpack` mientras el workspace local siga en unidad de red.

## Restricciones

- No redisenar la web completa.
- No romper home, casos, movil ni escritorio.
- No tocar dominio, DNS ni Cloudflare salvo peticion explicita.
- No anadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programacion con IA como mensaje publico.
- No inventar datos legales, direccion, CIF, precios, plazos ni garantias.

## Cierre esperado de la proxima sesion

- Produccion verificada tras despliegue.
- Variables reales de Resend configuradas o bloqueo documentado.
- Prueba real de email y WhatsApp completada si hay acceso.
- Siguiente paso claro para legal/contacto y lanzamiento.
