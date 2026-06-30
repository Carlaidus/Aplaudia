# LAST REPORT

Fecha: 2026-06-30

## Objetivo de la tarea

Ejecutar la correccion pedida por Carlos sobre el formulario de contacto:

- hacerlo como Arik Custom;
- poner primero seleccion multiple de necesidades;
- mantener mensaje editable autocompuesto;
- pedir datos de contacto despues del mensaje;
- dejar selector final compacto Email/WhatsApp;
- mantener un unico boton `Enviar`;
- no redisenar la web ni tocar backend, base de datos, auth o pagos.

## Cambios aplicados

### Formulario estilo Arik Custom

- `components/contact/contact-form.tsx` se reorganizo como flujo guiado:
  - izquierda: necesidades multiples;
  - derecha: mensaje editable, datos de contacto, privacidad, selector de canal y envio.
- Se elimino el selector antiguo de `Tipo de proyecto`.
- Se elimino el canal visible `Ambos`.
- El selector final solo ofrece:
  - `Email`;
  - `WhatsApp`.
- El formulario tiene un unico boton visible de envio: `Enviar`.
- El salto interno al formulario se ajusto con `scroll-mt` para que el header fijo no tape el bloque al pulsar el CTA.

### Mensaje guiado editable

- `content/contact.ts` pasa a centralizar:
  - necesidades disponibles;
  - texto comercial de cada necesidad;
  - constructor del mensaje guia;
  - canales de envio.
- El mensaje se autocompone con las necesidades marcadas.
- Si el visitante edita el mensaje a mano, nuevas selecciones ya no machacan su texto.
- `Usar guia` restaura el mensaje autocompuesto con la seleccion actual.

### API de contacto

- `app/api/contacto/route.ts` ahora recibe `needs` en vez de depender de un unico `projectType`.
- El email para Carlos incluye:
  - necesidades marcadas;
  - nombre;
  - email;
  - telefono opcional;
  - negocio o web opcional;
  - canal solicitado;
  - mensaje.
- El canal `WhatsApp` no intenta usar Resend.
- El canal `Email` sigue usando Resend si `RESEND_API_KEY` esta configurada.
- Se mantiene compatibilidad minima con `projectType` y `both` antiguos:
  - `projectType` se usa solo como fallback si llega una peticion legacy;
  - `both` se normaliza a `email` para no publicar el canal antiguo.

## Archivos modificados

- `README.md`
- `PROJECT_STATE.md`
- `NEXT_TASK.md`
- `LAST_REPORT.md`
- `app/api/contacto/route.ts`
- `components/contact/contact-form.tsx`
- `content/contact.ts`

## Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: no ejecutable; `eslint` no esta instalado como dependencia.
- `npx tsc --noEmit`: falla por deuda previa ya conocida:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineacion antigua de mensajes `about` en `i18n/provider.tsx`.
- `git diff --check`: OK.
- API local `POST /api/contacto`:
  - canal `whatsapp` sin email: OK `200`, `emailSent:false`;
  - canal `email` sin `RESEND_API_KEY`: OK `503` controlado;
  - honeypot: OK `200`;
  - `needs: []`: OK `400` controlado.
- Browser QA local en `http://127.0.0.1:3023`:
  - escritorio: 6 necesidades visibles, solo Email/WhatsApp, sin `Ambos`;
  - escritorio: un unico submit `Enviar`;
  - escritorio: sin `mailto` ni `wa.me` duplicados dentro del formulario antes de enviar;
  - autocomposicion: al marcar `Agente para WhatsApp`, el mensaje anade esa necesidad;
  - edicion manual: al editar el mensaje, nuevas selecciones no sobrescriben el texto;
  - `Usar guia`: restaura el mensaje con la seleccion actual;
  - movil 390x844: sin scroll horizontal;
  - movil 390x844: orden correcto necesidades -> mensaje -> datos -> canal -> Enviar;
  - CTA interno al formulario: cae por debajo del header fijo.

## Estado de Railway y produccion

Push a `main` completado en `aad9918`.

Produccion validada por HTTP en `https://aplaudia.com`:

- `/`: 200, formulario nuevo visible con `Primero dime qué necesitas`;
- `/`: 200, no aparece el canal antiguo `Ambos`;
- `/`: 200, no aparece el CTA antiguo `Enviar por email`;
- `/casos`: 200;
- `/casos/cronoras`: 200;
- `/casos/arik-custom`: 200;
- `/casos/aventuras-pixeladas`: 200;
- `/robots.txt`: 200;
- `/llms.txt`: 200;
- `/sitemap.xml`: 200;
- `/api/contacto` con canal `whatsapp`: 200, `emailSent:false`;
- `/api/contacto` con `needs: []`: 400 controlado.

Browser QA en produccion movil 390x844:

- 6 necesidades visibles;
- selector final solo con `Email` y `WhatsApp`;
- un unico submit `Enviar`;
- sin `mailto` ni `wa.me` duplicados dentro del formulario antes de enviar;
- sin scroll horizontal.

Railway CLI sigue sin sesion valida (`invalid_grant` / `Unauthorized`), por lo que no se pudo leer el dashboard desde terminal. El estado operativo se valido por el dominio final sirviendo el cambio nuevo tras el push.

## Siguiente paso recomendado

1. Configurar variables reales de Resend en Railway:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
2. Enviar una prueba real por Email desde el formulario.
3. Enviar una prueba real por WhatsApp desde el formulario.
4. Confirmar en Resend entrega y `replyTo`.
5. Revisar legal/privacidad antes de retirar el aviso de construccion.
