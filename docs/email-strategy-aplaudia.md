# Estrategia de email de Aplaudia

Fecha de referencia: 2026-07-01

## Objetivo

Usar direcciones publicas del dominio `aplaudia.com` sin contratar por ahora Google Workspace ni buzones de pago. La estrategia actual separa dos conceptos:

- Recibir correos en direcciones `@aplaudia.com`.
- Enviar correos automaticos desde la web o desde el chatbot.

## Recepcion con Cloudflare Email Routing

Cloudflare Email Routing sirve para recibir correo en aliases del dominio y reenviarlo a un destino externo. No crea buzones propios y no permite responder como `@aplaudia.com` por si solo.

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

## Configuracion manual pendiente en Cloudflare

No se debe tocar Cloudflare automaticamente desde codigo. Pasos manuales:

1. Entrar en Cloudflare > dominio `aplaudia.com` > Email Routing.
2. Activar Email Routing si no esta activo.
3. Verificar `carlosvfx@gmail.com` como direccion de destino.
4. Crear los aliases anteriores apuntando a `carlosvfx@gmail.com`.
5. Confirmar que Cloudflare crea o recomienda los registros MX necesarios para recepcion.
6. Probar cada alias enviando un email externo sencillo.

Importante: no inventar registros DNS. Aplicar solo los que Cloudflare indique para Email Routing.

## Envio automatico desde la web

Cloudflare Email Routing no envia correos automaticos. Para que la web o el chatbot manden una solicitud interna hace falta un proveedor de envio, por ejemplo Resend, SMTP o Google Workspace.

Estado del codigo:

- `/api/contacto` envia el formulario interno si existe `RESEND_API_KEY`.
- `/api/agent/quote` envia la solicitud interna del chatbot si existe `RESEND_API_KEY`.
- Si falta `RESEND_API_KEY`, ambos endpoints fallan de forma controlada y no guardan datos en base de datos.
- El destinatario tecnico se lee de `AGENT_QUOTE_RECIPIENT_EMAIL`, `CONTACT_RECIPIENT_EMAIL` o `CONTACT_TO_EMAIL`; si no existe, usa provisionalmente `carlosvfx@gmail.com`.
- El destinatario logico recomendado para solicitudes comerciales es `presupuestos@aplaudia.com`, siempre que Cloudflare Email Routing lo reenvie a Gmail.
- `EMAIL_FROM` debe ser un remitente verificado por el proveedor de envio, por ejemplo `Aplaudia <hola@aplaudia.com>`.

## Copias al cliente

La web no envia copias automaticas al cliente.

Si el visitante pide explicitamente una copia, el chatbot debe responder:

> Perfecto, incluiré en la solicitud que quieres recibir una copia o respuesta por email. Una persona de Aplaudia revisará el caso y se pondrá en contacto contigo.

En ese caso solo se anade una nota interna al email enviado a Aplaudia. La respuesta o copia se gestiona manualmente por una persona de Aplaudia.

## Lo que queda pendiente

- Activar o confirmar Cloudflare Email Routing.
- Verificar `carlosvfx@gmail.com` como destino.
- Crear aliases publicos.
- Decidir si las solicitudes automaticas deben ir tecnicamente a `carlosvfx@gmail.com` o a `presupuestos@aplaudia.com` una vez el routing este probado.
- Si se quiere responder como `@aplaudia.com`, contratar o configurar un sistema de envio real: Google Workspace, SMTP o proveedor equivalente.
- Hacer una prueba controlada del formulario/chatbot solo con consentimiento visible y datos ficticios.

## Seguridad

- No guardar claves, tokens ni contrasenas en el repo.
- No enviar datos reales sin consentimiento visible.
- No usar los datos para newsletter, publicidad ni otros fines.
- No guardar solicitudes en base de datos mientras no se decida lo contrario.
