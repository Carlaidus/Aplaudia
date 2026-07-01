# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Estado tras la ultima ejecucion

- Codigo:
  - `/api/contacto` y `/api/agent/quote` usan `lib/email/cloudflare-email.ts`;
  - no queda dependencia activa de Resend en codigo;
  - `npm ls resend` queda vacio;
  - no hay `from "resend"`, `new Resend`, `resend.emails.send`, `RESEND_API_KEY` ni `onboarding@resend` en `app`, `lib`, `package.json`, `package-lock.json`, docs principales o memoria operativa.
- Cloudflare Email Routing:
  - DNS de Email Routing aplicado en Cloudflare y comprobado contra `1.1.1.1`;
  - registros publicos activos:
    - `MX` raiz a `route1.mx.cloudflare.net`, prioridad 60;
    - `MX` raiz a `route2.mx.cloudflare.net`, prioridad 99;
    - `MX` raiz a `route3.mx.cloudflare.net`, prioridad 18;
    - `TXT` DKIM `cf2024-1._domainkey.aplaudia.com`;
    - `TXT` SPF raiz `v=spf1 include:_spf.mx.cloudflare.net ~all`;
  - `carlosvfx@gmail.com` creado como direccion destino;
  - estado real del destino: pendiente de verificacion por email;
  - aliases `hola@aplaudia.com`, `presupuestos@aplaudia.com`, `soporte@aplaudia.com` y `legal@aplaudia.com` aun no creados porque Cloudflare no permite seleccionar destinos pendientes.
- Cloudflare Email Service / Email Sending:
  - token de API creado con permiso `Email Sending Write`;
  - Railway tiene variables configuradas:
    - `CLOUDFLARE_ACCOUNT_ID`;
    - `CLOUDFLARE_EMAIL_API_TOKEN`;
    - `EMAIL_FROM`;
    - `INTERNAL_EMAIL_RECIPIENT`;
    - `AGENT_QUOTE_RECIPIENT_EMAIL`;
    - `CONTACT_RECIPIENT_EMAIL`;
  - no se ha guardado ningun secreto en repo ni documentacion;
  - `RESEND_API_KEY` sigue en Railway como variable historica/dormida, no como camino activo del codigo.
- Railway:
  - deployment tras variables queda `Active` / `Deployment successful`;
  - produccion `https://aplaudia.com` responde.
- Pruebas reales controladas:
  - `/api/agent/quote` sin consentimiento devuelve `400`;
  - `/api/agent/quote` con datos ficticios y consentimiento devuelve `500`;
  - `/api/contacto` con datos ficticios y consentimiento devuelve `500`;
  - Railway registra el error real de Cloudflare: `email.sending.error.email.sending_disabled`;
  - no hay confirmacion de email interno entregado;
  - no se envio copia automatica a cliente.

## Proximo foco real

Desbloquear Cloudflare email desde el estado real, sin tocar codigo:

1. Carlos debe abrir el email de verificacion enviado por Cloudflare a `carlosvfx@gmail.com` y verificar la direccion de destino.
2. Cuando Cloudflare muestre `carlosvfx@gmail.com` como verificado:
   - crear reglas de Email Routing:
     - `hola@aplaudia.com` -> `carlosvfx@gmail.com`;
     - `presupuestos@aplaudia.com` -> `carlosvfx@gmail.com`;
     - `soporte@aplaudia.com` -> `carlosvfx@gmail.com`;
     - `legal@aplaudia.com` -> `carlosvfx@gmail.com`;
   - probar recepcion externa hacia `hola@aplaudia.com` y `presupuestos@aplaudia.com`.
3. Repetir prueba real controlada desde produccion:
   - datos ficticios;
   - consentimiento visible;
   - solo envio interno a Carlos;
   - sin copia automatica al cliente.
4. Si tras verificar destino Cloudflare mantiene `email.sending.error.email.sending_disabled`, decidir una opcion:
   - activar Workers Paid para Email Sending;
   - volver a Resend solo como proveedor de envio interno;
   - usar otro proveedor SMTP/transaccional.

## Validaciones base para la proxima tarea

- Comprobar Cloudflare destino `carlosvfx@gmail.com`: verificado o pendiente.
- Comprobar reglas de Routing creadas.
- Validar DNS con `Resolve-DnsName -Server 1.1.1.1`.
- Validar `https://aplaudia.com`, `/robots.txt`, `/llms.txt` y `/sitemap.xml`.
- Probar `/api/agent/quote` sin consentimiento: debe ser `400`.
- Probar `/api/agent/quote` con datos ficticios solo si Carlos autoriza o si forma parte del flujo ya autorizado.
- Revisar logs Railway si falla.
- `npm run build`.
- `npm run lint` si `eslint` llega a estar disponible.

## Restricciones

- No guardar tokens, claves ni contrasenas.
- No imprimir valores secretos.
- No borrar `RESEND_API_KEY` en Railway hasta tener envio final funcionando.
- No activar Workers Paid sin permiso explicito de Carlos.
- No enviar emails a clientes reales.
- No enviar copias automaticas al cliente.
- No crear base de datos.
- No retirar el aviso de construccion.
