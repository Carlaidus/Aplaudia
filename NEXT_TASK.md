# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Activar y probar el envio real por email del formulario corregido, sin guardar secretos en el repo, y revisar la parte legal antes de retirar el aviso de construccion.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- La home debe mantener aviso de construccion hasta validacion final de Carlos.
- El formulario de contacto queda definido asi:
  - titulo de seccion y debajo directamente el panel;
  - sin CTAs intermedios de `Enviar consulta` ni `WhatsApp`;
  - sin textos tecnicos visibles;
  - seleccion multiple de necesidades primero;
  - mensaje breve editable y autocompuesto;
  - campos: nombre, email, telefono opcional;
  - consentimiento corto;
  - selector final con dos toggles independientes: `Email` y `WhatsApp`;
  - permite solo Email, solo WhatsApp o Email + WhatsApp;
  - un unico boton final `Enviar`.
- WhatsApp real publicado:
  - numero visible: `659304487`;
  - formato internacional: `34659304487`;
  - enlace centralizado en `content/site.ts`.
- `/api/contacto`:
  - solo WhatsApp: OK sin Resend;
  - solo Email: necesita variables reales de Resend;
  - Email + WhatsApp: necesita Resend para el email y prepara WhatsApp desde el formulario.
- Variables necesarias para activar email real en Railway:
  - `RESEND_API_KEY`;
  - `CONTACT_RECIPIENT_EMAIL`;
  - `EMAIL_FROM`.
- Railway CLI no tiene sesion valida en este entorno (`invalid_grant` / `Unauthorized`).
- No hay base de datos, auth ni pagos.
- No guardar secretos en el repo.

## Proxima tarea

1. Confirmar que produccion sirve el ultimo commit de `main`.
2. Revisar en produccion:
   - home;
   - formulario en escritorio;
   - formulario en movil;
   - envio solo WhatsApp hasta la preparacion del mensaje;
   - ausencia de CTAs y textos tecnicos prohibidos.
3. Entrar en Railway con sesion valida.
4. Configurar variables reales, sin copiarlas a archivos:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
5. Confirmar que `EMAIL_FROM` usa un remitente permitido/verificado en Resend.
6. Enviar una prueba real del formulario por Email.
7. Enviar una prueba real con Email + WhatsApp.
8. Confirmar en Resend:
   - entrega correcta;
   - remitente permitido;
   - `replyTo` del visitante.
9. Revisar legal/contacto antes de retirar el aviso de construccion:
   - aviso legal;
   - privacidad;
   - cookies si aplica;
   - texto definitivo de consentimiento.
10. Decidir con Carlos si ya se puede retirar el aviso de construccion.

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
- Email real del formulario probado o bloqueo documentado por falta de acceso.
- WhatsApp probado desde el formulario.
- Resend revisado.
- Siguiente decision clara sobre legal y retirada del aviso de construccion.
