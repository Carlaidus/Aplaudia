# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Activar en produccion el agente IA flotante de Aplaudia configurando `OPENAI_API_KEY` en Railway, probar una conversacion real y despues continuar con el email real por Resend y la revision legal.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- La home debe mantener aviso de construccion hasta validacion final de Carlos.
- El aviso de construccion debe quedar flotando a la izquierda.
- El aviso de construccion ya usa fecha `30 junio 2026`.
- El chatbot debe quedar flotando a la derecha.
- El formulario de contacto no debe mostrar el boton `Actualizar mensaje`.
- El mensaje del formulario se autocompone al cambiar necesidades mientras el visitante no lo haya editado a mano.
- `/api/agent` prioriza OpenAI directamente con `OPENAI_API_KEY`.
- `OPENAI_AGENT_MODEL` es opcional; si falta, se usa el modelo definido en codigo.
- Las variables heredadas `APLAUDIA_AGENT_API_URL` y `APLAUDIA_AGENT_API_SECRET` quedan solo como respaldo opcional.
- No hay base de datos, auth ni pagos.
- No guardar secretos en el repo.

## Proxima tarea

1. Entrar en Railway con sesion valida.
2. Configurar variables reales, sin copiarlas a archivos:
   - `OPENAI_API_KEY`;
   - `OPENAI_AGENT_MODEL` solo si Carlos quiere cambiar el modelo por defecto.
3. Desplegar y comprobar que Railway queda en verde.
4. Probar el agente en `https://aplaudia.com`:
   - pregunta sobre webs;
   - pregunta sobre agentes de WhatsApp;
   - pregunta sobre casos reales;
   - comprobar que no inventa precios, plazos, CIF, direccion ni garantias.
5. Revisar que el aviso de construccion sigue visible a la izquierda.
6. Revisar que el chatbot sigue visible a la derecha en desktop y movil.
7. Continuar con email real del formulario si Carlos ya tiene Resend listo:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
8. Enviar prueba real solo Email.
9. Enviar prueba real Email + WhatsApp.
10. Revisar legal/contacto antes de retirar el aviso de construccion:
    - aviso legal;
    - privacidad;
    - cookies si aplica;
    - texto definitivo de consentimiento.

## Deuda tecnica recomendada

- Instalar/configurar ESLint para que `npm run lint` funcione de forma reproducible.
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

- `OPENAI_API_KEY` configurada en Railway o bloqueo documentado por falta de acceso.
- Agente probado en produccion con respuesta real de OpenAI.
- Formulario y WhatsApp comprobados sin regresiones.
- Siguiente decision clara sobre Resend, legal y retirada del aviso de construccion.
