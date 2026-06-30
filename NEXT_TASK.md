# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Cerrar detalles finales del formulario de contacto, reposicionar aviso de construccion y activar el chatbot real de Aplaudia con OpenAI API, manteniendo la web estable en movil y escritorio.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- Produccion ya sirve el formulario corregido del commit `b87b594`.
- El formulario ya tiene seleccion multiple de necesidades, mensaje editable y selector final Email/WhatsApp.
- Aun aparece la accion `Actualizar mensaje`, que Carlos quiere eliminar.
- El aviso de construccion sigue usando fecha antigua `29 junio 2026`.
- El aviso de construccion debe ir abajo a la izquierda.
- El chatbot de Aplaudia debe quedar abajo a la derecha.
- El agente existe, pero hasta ahora solo funciona con fallback o necesita configuracion externa.
- Hay instrucciones editables del agente en `content/agent/aplaudia-agent.md`.
- Variables necesarias para activar email real en Railway:
  - `RESEND_API_KEY`;
  - `CONTACT_RECIPIENT_EMAIL`;
  - `EMAIL_FROM`.
- Variables que usa ahora el agente proxy:
  - `APLAUDIA_AGENT_API_URL`;
  - `APLAUDIA_AGENT_API_SECRET`.
- No mencionar programacion con IA como mensaje publico.
- No hay base de datos, auth ni pagos.
- No guardar secretos en el repo.

## Tarea 1: formulario de contacto

1. Revisar `components/contact/contact-form.tsx`.
2. Eliminar el boton/accion `Actualizar mensaje`.
3. No mostrar `Usar guia`, `Guia activa`, `Actualizar mensaje` ni equivalentes.
4. Mantener el mensaje editable autogenerado segun necesidades seleccionadas.
5. Si el usuario cambia necesidades y ya edito manualmente, no machacar su texto.
6. Mantener seleccion multiple de necesidades.
7. Mantener selector final compacto Email / WhatsApp.
8. Mantener un unico boton final `Enviar`.
9. No reintroducir textos tecnicos ni redundancias.

## Tarea 2: aviso de construccion

1. Cambiar fecha del aviso a la fecha actual: `30 junio 2026`.
2. Cambiar posicion del aviso de construccion:
   - abierto: abajo a la izquierda;
   - minimizado/pastilla: abajo a la izquierda.
3. Debe seguir siendo minimizable.
4. No debe tapar CTAs ni contenido importante.
5. No debe solaparse con el chatbot.
6. Mantener estilo premium oscuro actual.

## Tarea 3: chatbot abajo a la derecha

1. Revisar `components/agent/aplaudia-agent-widget.tsx` y `app/api/agent/route.ts`.
2. Garantizar que el boton flotante del chatbot este abajo a la derecha en movil y escritorio.
3. Garantizar que no se solapa con aviso de construccion, formulario ni CTAs.
4. Revisar especialmente movil real/simulado.

## Tarea 4: activar chatbot real con OpenAI API

Objetivo: dejar el chatbot funcionando con OpenAI directamente desde el servidor de Aplaudia, no solo con proxy externo.

1. Adaptar `/api/agent` para poder usar OpenAI API directamente con variable de entorno `OPENAI_API_KEY`.
2. Mantener fallback elegante si falta `OPENAI_API_KEY`.
3. Leer instrucciones desde `content/agent/aplaudia-agent.md`.
4. Instalar `openai` si hace falta o usar `fetch` server-side contra OpenAI Responses API.
5. No exponer nunca la clave al cliente.
6. Modelo recomendado inicialmente: `gpt-5.5-mini` si esta disponible; si no, usar un modelo actual adecuado y documentarlo.
7. Mantener respuestas breves, comerciales y utiles.
8. No inventar precios, plazos, garantias, datos legales ni clientes.
9. No mencionar que la web se programa con IA.
10. Documentar en `LAST_REPORT.md` que hay que crear `OPENAI_API_KEY` en Railway.
11. No guardar claves ni secretos en el repo.
12. Si se conserva compatibilidad con `APLAUDIA_AGENT_API_URL` / `APLAUDIA_AGENT_API_SECRET`, documentar cual tiene prioridad.

## Tarea 5: Resend queda pendiente pero documentado

1. Mantener documentadas las variables necesarias para envio real de email:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
2. No bloquear la activacion del chatbot por Resend.
3. Si Codex tiene acceso a Railway, puede configurar variables solo si se le proporciona el valor real; si no, documentar pasos.

## Validaciones obligatorias

- `npm install` si hace falta.
- `npm run build`.
- `npm run lint` si esta disponible.
- Probar home en movil y escritorio.
- Probar que no aparece `Actualizar mensaje`.
- Probar formulario con seleccion multiple y selector Email/WhatsApp.
- Probar que aviso de construccion queda abajo a la izquierda.
- Probar que chatbot queda abajo a la derecha.
- Probar chatbot sin `OPENAI_API_KEY`: fallback correcto.
- Probar chatbot con `OPENAI_API_KEY` si Codex/Railway tiene acceso a la variable.
- Confirmar que no hay errores graves de consola.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar produccion/Railway en verde tras push.

## Documentacion

Actualizar `LAST_REPORT.md` con:

- cambios del formulario;
- fecha/posicion del aviso de construccion;
- posicion final del chatbot;
- modo de activacion del chatbot;
- variable necesaria `OPENAI_API_KEY`;
- si se mantiene o retira el proxy anterior;
- estado de Resend y variables pendientes;
- validaciones ejecutadas;
- estado final de produccion/Railway;
- siguiente paso recomendado.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Restricciones

- No redisenar la web completa.
- No romper home, casos, movil ni escritorio.
- No tocar dominio, DNS ni Cloudflare.
- No anadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programacion con IA como mensaje publico.
- No inventar datos legales, direccion, CIF, precios, plazos ni garantias.

## Cierre esperado

- Formulario sin `Actualizar mensaje`.
- Aviso de construccion con fecha `30 junio 2026` y abajo a la izquierda.
- Chatbot abajo a la derecha.
- Chatbot preparado para responder con OpenAI usando `OPENAI_API_KEY`.
- Produccion en verde.
