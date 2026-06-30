# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Corregir de forma estricta el formulario de contacto de Aplaudia para que siga el flujo que pide Carlos: primero elegir uno o varios tipos de proyecto, autocomponer un mensaje editable, pedir datos de contacto y al final elegir si enviar por email, WhatsApp o ambos. El formulario actual no cumple: pregunta primero el canal, usa selector unico de proyecto, mantiene texto tecnico innecesario y repite conceptos.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- El formulario actual esta en `components/contact/contact-form.tsx`.
- Las opciones actuales estan en `content/contact.ts`.
- API de contacto: `app/api/contacto/route.ts`.
- WhatsApp confirmado:
  - numero nacional: `659304487`;
  - formato internacional: `34659304487`.
- Email de destino configurado en site/config o variables.
- Resend esta preparado mediante variables:
  - `RESEND_API_KEY`;
  - `CONTACT_RECIPIENT_EMAIL`;
  - `EMAIL_FROM`.

## Problemas concretos actuales

1. El formulario empieza preguntando `Canal de envio` con tarjetas grandes `Email`, `WhatsApp`, `Ambos`. Esto ocupa demasiado y esta mal colocado.
2. `Email`, `WhatsApp` y `Ambos` tienen demasiado texto explicativo. Si se mantienen, deben ser botones compactos al final.
3. El tipo de proyecto es un desplegable de seleccion unica. Carlos quiere poder elegir varios intereses a la vez.
4. Debe poner claro algo como: `Elige una o varias opciones`.
5. Al seleccionar o deseleccionar opciones, el mensaje editable debe actualizarse con esas selecciones.
6. El usuario debe poder editar libremente el mensaje.
7. Si el usuario ya edito el mensaje manualmente, no machacarlo de forma brusca; pero debe existir boton para regenerar/actualizar el mensaje segun las opciones elegidas.
8. El bloque tecnico `Sin base de datos: email mediante Resend y WhatsApp preparado por enlace seguro` debe eliminarse.
9. No mostrar email ni telefono publicamente dentro del panel como datos sueltos.
10. Al final no debe haber botones redundantes tipo `Enviar por email` si ya hay selector de canal. Debe haber selector compacto de canal + un unico boton `Enviar`.

## Flujo obligatorio del formulario

El formulario debe ordenarse asi:

1. Titulo breve del bloque: `Cuéntanos tu proyecto` o similar.
2. Texto breve, sin tecnicismos.
3. Seccion `Elige una o varias opciones` con chips/botones multi-seleccion:
   - `Página web`;
   - `Agente IA para WhatsApp`;
   - `Visuales para marca`;
   - `Portfolio / caso real`;
   - `Consulta general`.
4. A la derecha o debajo, el mensaje editable se va rellenando con lo elegido.
5. Campos de datos:
   - nombre;
   - email;
   - telefono opcional.
6. Consentimiento breve y discreto.
7. Seccion final: `¿Cómo quieres enviarlo? Selecciona una o las dos opciones:`
   - boton toggle `Email`;
   - boton toggle `WhatsApp`.
8. Un unico boton final: `Enviar`.

## Comportamiento esperado

- Se pueden seleccionar varias opciones de proyecto a la vez.
- El mensaje se autocompone con un texto natural. Ejemplo:
  `Me gustaría recibir información y consultar sobre una página web, un agente IA para WhatsApp y visuales para marca. Ahora mismo necesito...`
- Si se selecciona `Consulta general`, debe generar texto general.
- Si no hay nada seleccionado, usar `Consulta general` o pedir seleccionar al menos una opcion.
- El mensaje generado debe ser editable.
- Debe existir una accion pequeña tipo `Actualizar mensaje` o `Usar guía` para regenerar el texto con las opciones seleccionadas.
- El selector de canal debe estar al final y ser compacto.
- `Email` y `WhatsApp` son toggles independientes:
  - puede estar solo Email;
  - solo WhatsApp;
  - ambos.
- Si no hay ningun canal elegido, mostrar error claro.
- Si canal incluye Email, el email es obligatorio.
- Si solo WhatsApp, email no debe ser obligatorio.
- Si se elige WhatsApp, abrir `wa.me/34659304487` con el mensaje final editado.
- Si se elige Email, enviar por `/api/contacto` usando Resend.
- Si se eligen ambos, enviar email y abrir/preparar WhatsApp con el mismo mensaje.
- Si el navegador bloquea popup de WhatsApp tras email, mostrar boton claro para abrir WhatsApp.

## Referencia obligatoria

Revisar el flujo de Arik Custom para pedir presupuesto de servicios y copiar la logica UX, no necesariamente el codigo exacto:

- seleccion de varias opciones;
- mensaje que se rellena automaticamente;
- mensaje editable;
- envio claro.

Repo de referencia:

`Carlaidus/v0-diseno-web-arik-custom`

## Que NO debe aparecer

- No mostrar email visible en un bloque lateral.
- No mostrar numero visible en un bloque lateral.
- No mostrar texto tipo `Sin base de datos`, `Resend`, `enlace seguro`, etc.
- No poner primero el canal de envio.
- No usar desplegable unico para tipo de proyecto.
- No repetir WhatsApp arriba, en medio y abajo.
- No hacer que el boton final cambie entre `Enviar por email`, `Abrir WhatsApp`, etc. Debe haber un unico boton `Enviar` y el canal elegido debe definir el comportamiento.

## Layout esperado

- En escritorio puede ser una tarjeta de dos columnas, pero no debe sentirse pequena ni sobrecargada.
- En movil debe ser una columna limpia.
- Aprovechar mejor el ancho disponible.
- El lado informativo, si existe, debe ser corto y util, no una lista de enlaces.
- Mantener estetica oscura/premium actual.
- No redisenar toda la seccion.

## Validaciones obligatorias

- `npm install` si hace falta.
- `npm run build`.
- `npm run lint` si esta disponible.
- Probar home en movil y escritorio.
- Probar:
  - seleccion multiple de opciones;
  - regeneracion del mensaje;
  - edicion manual del mensaje;
  - envio solo Email;
  - envio solo WhatsApp;
  - envio Email + WhatsApp;
  - sin variables Resend;
  - sin canal seleccionado.
- Confirmar que no hay errores graves en consola.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar produccion/Railway en verde tras push.

## Documentacion

Actualizar `LAST_REPORT.md` con:

- problema real del formulario anterior;
- nuevo flujo implementado;
- opciones multi-seleccion;
- comportamiento del mensaje editable;
- comportamiento de Email/WhatsApp/ambos;
- archivos modificados;
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

- Formulario claro, sin redundancias.
- Seleccion multiple de tipos de proyecto.
- Mensaje autoguiado y editable.
- Selector final compacto de Email/WhatsApp.
- Un unico boton final `Enviar`.
- Produccion en verde.
