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

Variables de entorno necesarias para activarlo:

- `OPENAI_API_KEY`: clave privada de OpenAI configurada en Railway.
- `OPENAI_AGENT_MODEL`: modelo opcional para el agente. Si falta, se usa `gpt-5.4-mini`.

Variables heredadas opcionales si se quisiera usar un servicio externo compatible:

- `APLAUDIA_AGENT_API_URL`: URL base del servicio del agente legado.
- `APLAUDIA_AGENT_API_SECRET`: secreto Bearer para llamar a ese servicio legado.

Si falta `OPENAI_API_KEY` y no hay servicio legado configurado, la web no se rompe: el agente muestra una respuesta de fallback indicando que no esta conectado.

No guardar valores reales de estas variables en el repo.

## Contacto y Resend

La seccion `#contacto` incluye un formulario de contacto con seleccion multiple de necesidades y mensaje editable autocompuesto.

Fuente editable de textos y opciones:

- `content/contact.ts`: necesidades, mensajes guia y canales de envio.

Canales disponibles:

- Email: envia mediante `/api/contacto` y Resend.
- WhatsApp: prepara un enlace `wa.me` con el mensaje editado por el visitante.
- Email + WhatsApp: se activa marcando los dos toggles finales.

Variables de entorno necesarias para activar el envio real:

- `RESEND_API_KEY`: clave privada de Resend.
- `CONTACT_RECIPIENT_EMAIL`: email receptor de las consultas.
- `EMAIL_FROM`: remitente verificado en Resend.

Fallbacks sin secreto:

- Si falta `RESEND_API_KEY`, la web sigue cargando y el formulario muestra un error controlado.
- El canal WhatsApp sigue operativo sin Resend.
- Si falta `CONTACT_RECIPIENT_EMAIL`, se usa el email publico definido en `siteConfig`.
- El WhatsApp real esta centralizado en `content/site.ts`.

No guardar valores reales de estas variables en el repo.
