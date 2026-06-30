# LAST REPORT

Fecha: 2026-06-30

## Objetivo de la tarea

Corregir definitivamente el formulario de contacto de Aplaudia aplicando el flujo exacto indicado por Carlos:

- eliminar CTAs intermedios de la seccion de contacto;
- eliminar textos tecnicos visibles;
- dejar el titulo de seccion y debajo directamente el panel del formulario;
- usar seleccion multiple de necesidades;
- usar mensaje editable breve y autocompuesto;
- permitir Email, WhatsApp o ambos mediante dos toggles independientes;
- mantener un unico boton final `Enviar`.

## Que estaba mal

- La seccion de contacto seguia mostrando CTAs redundantes antes del formulario:
  - `Enviar consulta`;
  - `WhatsApp`.
- Tambien seguia apareciendo una nota intermedia tipo `Formulario interno y WhatsApp real ya activos`.
- El formulario conservaba textos no deseados:
  - `Usar guia`;
  - `Guia activa`;
  - texto tecnico sobre base de datos, Resend o WhatsApp preparado.
- Las tarjetas de necesidades tenian poco contraste.
- El mensaje autogenerado era demasiado largo y pedia demasiadas secciones.
- El canal final funcionaba como seleccion unica, no como dos toggles combinables.

## Cambios aplicados

### Seccion de contacto

- `components/sections/final-cta.tsx` queda con:
  - titulo `Listo para llevar tu negocio al siguiente nivel`;
  - panel del formulario justo debajo.
- Se eliminaron:
  - subtitulo intermedio;
  - botones superiores;
  - indicador de confianza de formulario/WhatsApp.

### Formulario

- `components/contact/contact-form.tsx` se rehizo al flujo pedido:
  - `Primero dime qué necesitas`;
  - texto corto;
  - `Elige una o varias opciones`;
  - cinco opciones exactas:
    - `Página web o landing`;
    - `Agente IA para WhatsApp`;
    - `Visuales para marca`;
    - `Portfolio / caso real`;
    - `Consulta general`;
  - mensaje con label `Mensaje`;
  - accion discreta `Actualizar mensaje`;
  - campos: nombre, email, telefono opcional;
  - consentimiento corto;
  - selector final con toggles independientes `Email` y `WhatsApp`;
  - boton unico `Enviar`.
- Se reforzaron las tarjetas de necesidades:
  - borde mas visible;
  - fondo con mas contraste;
  - estado seleccionado mas evidente;
  - mejor lectura en movil.
- Se reforzo el checkbox de consentimiento.
- Se eliminaron del bloque:
  - email visible;
  - numero visible;
  - textos tecnicos;
  - `Usar guia`;
  - `Guia activa`.

### Mensaje

- `content/contact.ts` ahora genera un mensaje breve:
  - `Hola, Aplaudia. Me gustaría recibir información sobre ...`
  - sin secciones largas de contexto, enlaces, presupuesto, plazo o urgencia.
- Al cambiar opciones, el mensaje se actualiza si no fue editado manualmente.
- Si el visitante edito el mensaje, no se machaca.
- `Actualizar mensaje` regenera el texto con las opciones actuales.

### API

- `app/api/contacto/route.ts` acepta:
  - `deliveryChannels: ["email"]`;
  - `deliveryChannels: ["whatsapp"]`;
  - `deliveryChannels: ["email", "whatsapp"]`.
- Si llega `deliveryChannel: "both"` por compatibilidad, se interpreta como Email + WhatsApp.
- Si no hay canal, devuelve error claro.
- Si solo se elige WhatsApp, no exige email ni Resend.
- Si se elige Email o Email + WhatsApp, usa Resend si esta configurado.

## Archivos modificados

- `README.md`
- `PROJECT_STATE.md`
- `NEXT_TASK.md`
- `LAST_REPORT.md`
- `app/api/contacto/route.ts`
- `components/contact/contact-form.tsx`
- `components/sections/final-cta.tsx`
- `content/contact.ts`
- `content/routes.ts`

## Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: no ejecutable; `eslint` no esta instalado como dependencia.
- `npx tsc --noEmit`: falla por deuda previa ya conocida:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineacion antigua de mensajes `about` en `i18n/provider.tsx`.
- `git diff --check`: OK.
- API local `POST /api/contacto`:
  - solo WhatsApp: OK `200`, `emailSent:false`;
  - solo Email sin `RESEND_API_KEY`: OK `503` controlado;
  - Email + WhatsApp sin `RESEND_API_KEY`: OK `503` controlado;
  - sin canal: OK `400` controlado.
- Browser QA local en `http://127.0.0.1:3024`:
  - escritorio: titulo correcto y panel directamente debajo;
  - escritorio: sin `Enviar consulta`, `Formulario interno`, `Sin base de datos`, `Resend`, `Usar guia`, `Guia activa`, `SEO y estructura`, `No lo tengo claro` ni `Negocio o web`;
  - escritorio: cinco opciones exactas;
  - escritorio: mensaje breve sin secciones largas;
  - escritorio: un unico submit `Enviar`;
  - seleccion multiple: OK;
  - edicion manual del mensaje: no se sobrescribe;
  - `Actualizar mensaje`: OK;
  - toggles Email/WhatsApp: Email, WhatsApp, ambos y ninguno funcionan;
  - solo WhatsApp: email no obligatorio;
  - sin canal: muestra error claro;
  - movil 390x844: sin scroll horizontal;
  - movil 390x844: orden necesidades -> mensaje -> datos -> consentimiento -> canal -> Enviar;
  - WhatsApp: abre `api.whatsapp.com` con telefono `34659304487` y el mensaje final codificado.

## Estado de Railway y produccion

Push a `main` completado en `b87b594`.

Produccion validada por HTTP en `https://aplaudia.com`:

- `/`: 200;
- `/casos`: 200;
- `/robots.txt`: 200;
- `/llms.txt`: 200;
- `/sitemap.xml`: 200;
- home con formulario corregido visible;
- no aparece `Enviar consulta`;
- no aparece `Formulario interno`;
- no aparece `WhatsApp real ya activos`;
- no aparece `Sin base de datos`;
- no aparece `Usar guia` ni `Guia activa`;
- no aparecen `SEO y estructura`, `No lo tengo claro` ni `Negocio o web`;
- `/api/contacto` con solo WhatsApp: 200, `emailSent:false`;
- `/api/contacto` sin canal: 400 controlado.

Browser QA en produccion movil 390x844:

- titulo: `Listo para llevar tu negocio al siguiente nivel`;
- panel: `Primero dime qué necesitas`;
- cinco opciones exactas;
- mensaje breve;
- toggles `Email` y `WhatsApp`;
- un unico boton `Enviar`;
- sin scroll horizontal.

Railway CLI sigue sin sesion valida (`invalid_grant` / `Unauthorized`), por lo que no se pudo leer el dashboard desde terminal. El estado operativo se valido por el dominio final sirviendo el cambio nuevo tras el push.

## Siguiente paso recomendado

1. Configurar variables reales de Resend en Railway cuando Carlos quiera probar Email real:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
2. Enviar prueba real solo Email.
3. Enviar prueba real Email + WhatsApp.
4. Revisar legal/privacidad antes de retirar el aviso de construccion.
