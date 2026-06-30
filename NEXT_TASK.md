# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Activar y probar el envio real por email del formulario de contacto, sin guardar secretos en el repo, y revisar la parte legal antes de retirar el aviso de construccion.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- Produccion ya sirve el formulario nuevo estilo Arik Custom:
  - seleccion multiple de necesidades primero;
  - mensaje editable autocompuesto;
  - datos de contacto;
  - selector final compacto Email/WhatsApp;
  - un unico boton `Enviar`;
  - sin canal visible `Ambos`;
  - sin enlaces `mailto` ni `wa.me` duplicados dentro del formulario antes de enviar.
- Browser QA en produccion movil 390x844:
  - sin scroll horizontal;
  - 6 necesidades visibles;
  - solo Email/WhatsApp;
  - un unico submit `Enviar`.
- WhatsApp real publicado:
  - numero visible: `659304487`;
  - formato internacional: `34659304487`;
  - enlace centralizado en `content/site.ts`.
- `/api/contacto`:
  - canal `whatsapp`: OK sin Resend;
  - canal `email`: necesita variables reales de Resend.
- Variables necesarias para activar email real en Railway:
  - `RESEND_API_KEY`;
  - `CONTACT_RECIPIENT_EMAIL`;
  - `EMAIL_FROM`.
- Railway CLI no tiene sesion valida en este entorno (`invalid_grant` / `Unauthorized`).
- No hay base de datos, auth ni pagos.
- No guardar secretos en el repo.

## Proxima tarea

1. Entrar en Railway con sesion valida.
2. Configurar variables reales, sin copiarlas a archivos:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
3. Confirmar que `EMAIL_FROM` usa un remitente permitido/verificado en Resend.
4. Enviar una prueba real del formulario por Email.
5. Confirmar en Resend:
   - entrega correcta;
   - remitente permitido;
   - `replyTo` del visitante.
6. Enviar una prueba real por WhatsApp desde el formulario.
7. Revisar legal/contacto antes de retirar el aviso de construccion:
   - aviso legal;
   - privacidad;
   - cookies si aplica;
   - texto definitivo de consentimiento.
8. Decidir con Carlos si ya se puede retirar el aviso de construccion.

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

- Email real del formulario probado o bloqueo documentado por falta de acceso.
- WhatsApp probado desde el formulario.
- Resend revisado.
- Siguiente decision clara sobre legal y retirada del aviso de construccion.
