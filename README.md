# Aplaudia

Web publica de Aplaudia: estudio digital para creacion y mejora de paginas web, presencia digital y contenido con IA.

## Memoria operativa

Documentos de control del proyecto:

- `PROJECT_STATE.md`: estado confirmado.
- `DECISIONS.md`: decisiones vigentes.
- `WORKFLOW.md`: forma de trabajo.
- `NEXT_TASK.md`: siguiente tarea.
- `LAST_REPORT.md`: ultimo resumen de ejecucion.

## Estado actual resumido

- Hosting previsto: Railway.
- Dominio oficial: `aplaudia.com`.
- Dominio comprado en Cloudflare el 2026-06-29.
- La web debe mostrarse como proyecto en construccion hasta que Carlos valide el lanzamiento.

## Agente IA flotante

El widget de agente funciona mediante `/api/agent` y prioriza OpenAI directamente.

El input del chat incluye dictado por voz cuando el navegador soporta Web Speech API:

- usa `SpeechRecognition` / `webkitSpeechRecognition` en cliente;
- idioma `es-ES`;
- no guarda audio en el repo ni en servidor;
- si el navegador no soporta dictado, el boton de microfono sigue visible y muestra un aviso discreto.

Variables de entorno necesarias para activarlo:

- `OPENAI_API_KEY`: clave privada de OpenAI configurada en Railway.
- `OPENAI_AGENT_MODEL`: modelo opcional para el agente. Si falta, se usa `gpt-5.4-mini`.

Variables heredadas opcionales si se quisiera usar un servicio externo compatible:

- `APLAUDIA_AGENT_API_URL`: URL base del servicio del agente legado.
- `APLAUDIA_AGENT_API_SECRET`: secreto Bearer para llamar a ese servicio legado.

Si falta `OPENAI_API_KEY` y no hay servicio legado configurado, la web no se rompe: el agente muestra una respuesta de fallback indicando que no esta conectado.

No guardar valores reales de estas variables en el repo.

## Contacto y correo

La seccion `#contacto` incluye un formulario de contacto con seleccion multiple de necesidades y mensaje editable autocompuesto.

Fuente editable de textos y opciones:

- `content/contact.ts`: necesidades, mensajes guia y canales de envio.

Canales disponibles:

- Email: envia mediante `/api/contacto` si hay proveedor de envio configurado.
- WhatsApp: prepara un enlace `wa.me` con el mensaje editado por el visitante.
- Email + WhatsApp: se activa marcando los dos toggles finales.

Estrategia de dominio:

- Email publico principal: `hola@aplaudia.com`.
- Alias recomendado para solicitudes: `presupuestos@aplaudia.com`.
- Cloudflare Email Routing debe reenviar los aliases publicos a `carlosvfx@gmail.com`.
- Cloudflare Email Routing solo recibe y reenvia; no crea buzones ni permite responder como `@aplaudia.com` por si solo.
- Cloudflare Email Service envia solo emails internos desde la web/chatbot a una direccion verificada.
- Resend no se usa actualmente como proveedor activo.
- La estrategia completa esta documentada en `docs/email-strategy-aplaudia.md`.
- Estado real 2026-07-02:
  - DNS de Cloudflare Email Routing aplicado;
  - `carlosvfx@gmail.com` pendiente de verificacion en Cloudflare;
  - Railway tiene variables Cloudflare configuradas sin guardar secretos;
  - las pruebas internas de envio fallan con `email.sending.error.email.sending_disabled`.

Variables de entorno necesarias para activar el envio real:

- `CLOUDFLARE_ACCOUNT_ID`: cuenta Cloudflare.
- `CLOUDFLARE_EMAIL_API_TOKEN`: token privado con permiso de Email Service.
- `EMAIL_FROM`: remitente verificado en Cloudflare Email Service.
- `INTERNAL_EMAIL_RECIPIENT`: receptor interno verificado, por defecto `carlosvfx@gmail.com`.
- `AGENT_QUOTE_RECIPIENT_EMAIL`: receptor opcional especifico para solicitudes del chatbot.
- `CONTACT_RECIPIENT_EMAIL`: receptor opcional especifico del formulario.

Fallbacks sin secreto:

- Si falta configuracion de Cloudflare Email Service, la web sigue cargando y el formulario/chatbot muestran error controlado.
- El canal WhatsApp sigue operativo sin email configurado.
- Si falta `CONTACT_RECIPIENT_EMAIL`, el formulario usa `INTERNAL_EMAIL_RECIPIENT` o provisionalmente `carlosvfx@gmail.com`.
- Si falta `AGENT_QUOTE_RECIPIENT_EMAIL`, el chatbot usa `INTERNAL_EMAIL_RECIPIENT`, `CONTACT_RECIPIENT_EMAIL`, `CONTACT_TO_EMAIL` o provisionalmente `carlosvfx@gmail.com`.
- El chatbot no envia copias automaticas al cliente; si el cliente pide copia, queda como nota interna para Aplaudia.
- El WhatsApp real esta centralizado en `content/site.ts`.

No guardar valores reales de estas variables en el repo.
