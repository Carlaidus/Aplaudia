# Estrategia de email de Aplaudia

Fecha de referencia: 2026-07-02

## Objetivo

Mantener una estrategia clara, gratuita y sencilla para `aplaudia.com`:

- Cloudflare Email Routing para recibir aliases publicos y reenviarlos a Gmail.
- Cloudflare Email Service para enviar solo emails internos desde la web o el chatbot a una direccion verificada.
- Sin copias automaticas al cliente.
- Sin newsletter, publicidad ni base de datos.
- Resend no es el proveedor activo de Aplaudia.

## Estado real 2026-07-02

- Cloudflare Email Routing:
  - registros DNS indicados por Cloudflare aplicados y comprobados en DNS publico:
    - `MX` raiz a `route1.mx.cloudflare.net`, prioridad 60;
    - `MX` raiz a `route2.mx.cloudflare.net`, prioridad 99;
    - `MX` raiz a `route3.mx.cloudflare.net`, prioridad 18;
    - `TXT` `cf2024-1._domainkey.aplaudia.com` para DKIM de Cloudflare;
    - `TXT` raiz `v=spf1 include:_spf.mx.cloudflare.net ~all`;
  - `carlosvfx@gmail.com` creado como direccion de destino en Cloudflare;
  - estado de destino: pendiente de verificacion por email;
  - no se han creado todavia los aliases publicos porque Cloudflare exige una direccion de destino verificada.
- Cloudflare Email Service / Email Sending:
  - token de API creado con permiso `Email Sending Write`;
  - el token esta configurado en Railway, pero no se guarda en el repo ni en documentacion;
  - Railway tiene configuradas las variables Cloudflare y destinatarios internos;
  - prueba real controlada desde produccion falla con `email.sending.error.email.sending_disabled`;
  - el panel de Cloudflare muestra que el envio completo de email esta en beta y requiere Workers Paid;
  - pendiente comprobar si tras verificar `carlosvfx@gmail.com` Cloudflare permite el envio gratuito a destino verificado, tal como indica su documentacion, o si mantiene el bloqueo.
- Resend sigue sin ser proveedor activo en codigo. La variable antigua puede permanecer dormida en Railway hasta confirmar el camino final.

## Recepcion con Cloudflare Email Routing

Cloudflare Email Routing recibe correos en aliases del dominio y los reenvia a una direccion destino. No crea buzones completos y no permite responder como `@aplaudia.com` por si solo.

Aliases recomendados:

- `hola@aplaudia.com` -> `carlosvfx@gmail.com`
- `presupuestos@aplaudia.com` -> `carlosvfx@gmail.com`
- `soporte@aplaudia.com` -> `carlosvfx@gmail.com`
- `legal@aplaudia.com` -> `carlosvfx@gmail.com`
- `facturas@aplaudia.com` -> opcional futuro, no necesario ahora

Uso previsto:

- `hola@aplaudia.com`: contacto general publico.
- `presupuestos@aplaudia.com`: solicitudes comerciales, formularios y chatbot.
- `soporte@aplaudia.com`: clientes existentes, mantenimiento y dudas tras entrega.
- `legal@aplaudia.com`: privacidad, RGPD, cookies y asuntos legales.
- `facturas@aplaudia.com`: facturacion futura si se decide.

## Envio interno con Cloudflare Email Service

Cloudflare Email Service se usa para que la web mande un email interno a Aplaudia cuando un visitante completa el formulario o acepta enviar un resumen desde el chatbot.

Reglas vigentes:

- Solo se envia a una direccion interna configurada y verificada.
- Destinatario por defecto: `carlosvfx@gmail.com`.
- Destinatario logico recomendado para solicitudes: `presupuestos@aplaudia.com`, solo si Cloudflare lo enruta/verifica correctamente hacia Gmail.
- No se envia email automatico al cliente.
- No se envia newsletter.
- No se usa para publicidad.
- No se guarda la solicitud en base de datos.

Endpoints actuales:

- `/api/contacto`: envia el formulario interno si Cloudflare Email Service esta configurado.
- `/api/agent/quote`: envia la solicitud interna del chatbot si Cloudflare Email Service esta configurado.
- Si falta configuracion de Cloudflare, ambos endpoints devuelven `503` controlado y no envian nada.

Variables necesarias:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_EMAIL_API_TOKEN`
- `EMAIL_FROM`
- `INTERNAL_EMAIL_RECIPIENT`

Variables opcionales de receptor:

- `AGENT_QUOTE_RECIPIENT_EMAIL`
- `CONTACT_RECIPIENT_EMAIL`
- `CONTACT_TO_EMAIL` como compatibilidad heredada

`EMAIL_FROM` debe ser un remitente verificado por Cloudflare Email Service, por ejemplo:

- `hola@aplaudia.com`
- `Aplaudia <hola@aplaudia.com>`

## Copias al cliente

La web no envia copias automaticas al cliente.

Si el visitante pide explicitamente una copia, el chatbot debe responder:

> Perfecto, incluiré en la solicitud que quieres recibir una copia o respuesta por email. Una persona de Aplaudia revisará el caso y se pondrá en contacto contigo.

En ese caso solo se anade una nota interna al email enviado a Aplaudia:

> El cliente ha pedido recibir copia o respuesta por email. Gestionar manualmente desde Aplaudia.

## Resend

Resend no se usa actualmente como proveedor activo de Aplaudia.

Estado:

- Puede quedar configurado historicamente en Railway o DNS.
- No se debe borrar ninguna variable externa ni registro DNS desde codigo.
- Carlos puede eliminar o dejar dormida la configuracion manualmente si lo decide.
- Resend queda como alternativa futura, no como camino vigente.

## Configuracion pendiente

Pasos restantes, sin guardar secretos:

1. Carlos debe abrir el email de verificacion recibido en `carlosvfx@gmail.com` desde Cloudflare y confirmar la direccion de destino.
2. Cuando el destino aparezca como verificado, crear las reglas de routing:
   - `hola@aplaudia.com` -> `carlosvfx@gmail.com`;
   - `presupuestos@aplaudia.com` -> `carlosvfx@gmail.com`;
   - `soporte@aplaudia.com` -> `carlosvfx@gmail.com`;
   - `legal@aplaudia.com` -> `carlosvfx@gmail.com`.
3. Repetir la prueba real controlada desde `/api/agent/quote` con datos ficticios y consentimiento.
4. Si Cloudflare sigue devolviendo `email.sending.error.email.sending_disabled`, decidir una de estas opciones:
   - activar Workers Paid si Carlos quiere usar Cloudflare Email Sending;
   - volver a Resend solo como proveedor de envio interno;
   - usar otro proveedor SMTP/transaccional.

Importante: no inventar registros DNS. Aplicar solo los que Cloudflare indique.

## Responder como @aplaudia.com

Para responder desde Gmail como `hola@aplaudia.com` o tener un buzon completo haria falta una configuracion adicional:

- Google Workspace;
- SMTP compatible;
- o un proveedor equivalente.

Cloudflare Email Routing + Email Service cubre recepcion y envio interno, no una bandeja completa con respuesta manual como `@aplaudia.com`.

## Seguridad

- No guardar claves, tokens ni contrasenas en el repo.
- No enviar datos reales sin consentimiento visible.
- No enviar emails a clientes automaticamente.
- No usar datos para newsletter, publicidad ni otros fines.
- No guardar solicitudes en base de datos mientras no se decida lo contrario.

## Referencias oficiales

- Cloudflare Email Service REST API: `https://developers.cloudflare.com/email-service/api/send-emails/rest-api/`
- Cloudflare Email Service destinatarios, CC/BCC y `reply_to`: `https://developers.cloudflare.com/email-service/examples/email-sending/recipients/`
