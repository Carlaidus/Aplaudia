# NEXT TASK - Aplaudia

Prioridad: Media-Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Estado tras la ultima ejecucion

- Codigo:
  - `/api/contacto` y `/api/agent/quote` usan `lib/email/cloudflare-email.ts`;
  - no queda dependencia activa de Resend en codigo;
  - `npm ls resend` queda vacio;
  - no hay envio automatico de copia al cliente;
  - si el cliente pide copia desde chatbot, queda como nota interna.
- Cloudflare Email Routing:
  - DNS publico comprobado contra `1.1.1.1`:
    - `MX` raiz a `route3.mx.cloudflare.net`, prioridad 18;
    - `MX` raiz a `route1.mx.cloudflare.net`, prioridad 60;
    - `MX` raiz a `route2.mx.cloudflare.net`, prioridad 99;
    - `TXT` DKIM `cf2024-1._domainkey.aplaudia.com`;
    - `TXT` SPF raiz `v=spf1 include:_spf.mx.cloudflare.net ~all`;
  - `carlosvfx@gmail.com` aparece como destino verificado;
  - aliases creados y activos:
    - `hola@aplaudia.com` -> `carlosvfx@gmail.com`;
    - `presupuestos@aplaudia.com` -> `carlosvfx@gmail.com`;
    - `soporte@aplaudia.com` -> `carlosvfx@gmail.com`;
    - `legal@aplaudia.com` -> `carlosvfx@gmail.com`;
  - Cloudflare Activity Log muestra los dos emails internos de prueba como `Reenviados`;
  - prueba SMTP directa no autenticada hacia `hola@aplaudia.com` y `presupuestos@aplaudia.com` fue rechazada con `unauthenticatedForward`, por no salir desde un buzon autenticado con SPF/DKIM valido.
- Cloudflare Email Service / Email Sending:
  - Railway mantiene variables Cloudflare configuradas sin guardar secretos;
  - `/api/agent/quote` sin consentimiento devuelve `400`;
  - `/api/agent/quote` con datos ficticios y consentimiento devuelve `200`;
  - `/api/contacto` sin privacidad devuelve `400`;
  - `/api/contacto` con datos ficticios y privacidad devuelve `200`;
  - `clientCopySent:false` confirmado en la respuesta del chatbot.
- Railway:
  - servicio `Aplaudia` en `ACTIVE`;
  - deployment actual: `Deployment successful`;
  - logs recientes sin errores en el rango consultado.
- Produccion:
  - `https://aplaudia.com`: `200`;
  - `/robots.txt`: `200`;
  - `/llms.txt`: `200`;
  - `/sitemap.xml`: `200`;
  - aviso de construccion visible;
  - chatbot carga con etiqueta corta `¿Dudas?`;
  - saludo inicial neutro, sin mencionar casos reales;
  - no aparece boton fijo de presupuesto.

## Proximo foco real

Confirmar recepcion externa de aliases desde un buzon real autenticado:

1. Carlos debe enviar dos correos sencillos desde Gmail/Yahoo/otro buzon real:
   - a `hola@aplaudia.com`;
   - a `presupuestos@aplaudia.com`.
2. Carlos debe confirmar si ambos llegan a `carlosvfx@gmail.com`.
3. Si llegan:
   - marcar recepcion externa de Cloudflare Email Routing como operativa;
   - mantener Resend dormido/no activo;
   - decidir si se quieren probar tambien `soporte@aplaudia.com` y `legal@aplaudia.com`.
4. Si no llegan:
   - revisar Cloudflare Activity Log;
   - revisar si Cloudflare sigue mostrando algun estado contradictorio en Routing;
   - no tocar DNS a ciegas.

## Siguiente foco de producto

- Revisar legal/privacidad antes de retirar el aviso de construccion, porque ya existe captacion de contacto.
- Revisar con Carlos si los emails internos recibidos desde `/api/agent/quote` y `/api/contacto` tienen el formato correcto.
- Mantener el aviso de construccion hasta validacion final.

## Validaciones base para la proxima tarea

- Confirmar en Gmail recepcion de los dos emails internos de prueba ya enviados.
- Probar aliases desde un buzon real autenticado.
- Validar `https://aplaudia.com`, `/robots.txt`, `/llms.txt` y `/sitemap.xml`.
- Probar `/api/agent/quote` sin consentimiento: debe ser `400`.
- Probar `/api/agent/quote` con consentimiento solo con datos ficticios y destino controlado por Carlos.
- `npm run build`.
- `npm run lint` si `eslint` llega a estar disponible.
- `npm ls resend`.

## Restricciones

- No guardar tokens, claves ni contrasenas.
- No imprimir valores secretos.
- No borrar `RESEND_API_KEY` en Railway hasta que Carlos lo pida.
- No activar Workers Paid.
- No volver a Resend salvo decision explicita.
- No enviar emails a clientes reales.
- No enviar copias automaticas al cliente.
- No crear base de datos.
- No retirar el aviso de construccion.
