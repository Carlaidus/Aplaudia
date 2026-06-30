# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Cerrar contacto real y mejorar la experiencia de casos: ampliar mucho mas las imagenes de `Vistas clave`, activar WhatsApp real con mensaje predefinido y sustituir los CTAs tipo `mailto`/`Reservar llamada` por un formulario interno de contacto enviado con Resend, tomando como referencia Arik Custom.

## Repo

`Carlaidus/Aplaudia`

## Repos de referencia

- Repo principal: `Carlaidus/Aplaudia`.
- Referencia para envio de correo/contacto: `Carlaidus/v0-diseno-web-arik-custom`.

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- `https://www.aplaudia.com/` redirige correctamente a raiz.
- `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200`.
- Railway esta en verde segun las ultimas validaciones HTTP.
- Ya existen paginas de casos y galeria ampliable:
  - `/casos`;
  - `/casos/cronoras`;
  - `/casos/arik-custom`;
  - `/casos/aventuras-pixeladas`.
- El agente flotante de Aplaudia existe, pero solo esta preparado con fallback si falta API externa.
- `siteConfig.contact.email` tiene `carlosvfx@gmail.com`.
- `siteConfig.contact.whatsappHref` esta actualmente sin configurar o en fallback.
- El numero confirmado para WhatsApp es `659304487`, formato internacional `34659304487`.
- No mencionar programacion con IA como mensaje publico.

## Estado actual detectado

- El lightbox de `Vistas clave` existe, pero la ampliacion es demasiado pequena y no merece la pena.
- El modal actual de galeria reserva demasiado espacio a cabecera/descripciones y la imagen no ocupa suficiente pantalla.
- En la CTA final, `Reservar llamada` abre `mailto:`.
- El boton `WhatsApp` aun puede apuntar a `#whatsapp` si no hay `whatsappHref` real.
- El contacto debe quedar interno y profesional, no abrir Outlook como primera opcion.

## Tarea 1: ampliar de verdad las imagenes de casos

1. Revisar `components/cases/case-gallery.tsx` y la galeria de los casos.
2. Hacer que al ampliar una imagen esta ocupe mucha mas pantalla:
   - modal practicamente full-screen;
   - imagen con ancho maximo cercano a `98vw`;
   - alto util cercano a `90dvh`;
   - minimizar cabecera/descripciones o moverlas abajo de forma no intrusiva;
   - en escritorio, aprovechar casi toda la pantalla;
   - en movil, ocupar casi toda la pantalla sin salirse.
3. Si la imagen fuente es demasiado pequena, recopilar o generar captura real de mayor resolucion.
4. Anadir controles utiles si encajan sin complicar:
   - cerrar claro;
   - anterior/siguiente entre imagenes del caso;
   - opcion de abrir imagen en pestana nueva o ver al 100% si tiene sentido.
5. Mantener accesibilidad:
   - `aria-label`;
   - foco correcto;
   - cierre con Escape;
   - sin scroll raro.
6. Validar en movil y escritorio que ahora si merece la pena ampliar.

## Tarea 2: WhatsApp real con mensaje predefinido

1. Configurar centralmente el enlace de WhatsApp real en `content/site.ts` o equivalente.
2. Numero: `34659304487`.
3. Mensaje predefinido sugerido:
   `Hola, he visto la web de Aplaudia y me gustaria hablar sobre un proyecto web o digital.`
4. Generar URL correcta:
   `https://wa.me/34659304487?text=...`
5. Sustituir CTAs de WhatsApp que ahora apuntan a `#whatsapp` para que abran WhatsApp real.
6. Revisar:
   - CTA final;
   - footer;
   - header si hay CTA;
   - cualquier boton `WhatsApp` visible.
7. Abrir en nueva pestana con `target="_blank"` y `rel="noopener noreferrer"`.

## Tarea 3: formulario interno de contacto con Resend

Carlos no quiere que `Reservar llamada` abra Outlook/mailto. Quiere algo interno, parecido a lo que se hizo en Arik Custom con Resend.

1. Revisar como esta implementado el envio por Resend en `Carlaidus/v0-diseno-web-arik-custom`:
   - dependencias;
   - API routes;
   - validacion;
   - variables de entorno;
   - experiencia de usuario;
   - previews o confirmaciones antes del envio si existen.
2. Implementar en Aplaudia un formulario/contacto interno:
   - puede ser modal, dialog o seccion integrada;
   - debe encajar con la estetica actual;
   - debe funcionar bien en movil;
   - no debe abrir Outlook por defecto.
3. Campos recomendados:
   - nombre;
   - email;
   - telefono opcional;
   - tipo de proyecto o interes;
   - mensaje.
4. El mensaje puede venir pre-rellenado o sugerido segun CTA:
   - desde `Reservar llamada` / `Cuentanos tu proyecto`: texto orientado a hablar de un proyecto;
   - desde casos: texto que mencione el caso si se abre desde ahi, si es sencillo.
5. Mostrar una vista previa/resumen antes de enviar si no complica demasiado:
   - asunto;
   - destino;
   - mensaje que se enviara;
   - boton confirmar envio.
   Si complica mucho, al menos mostrar el texto dentro del textarea antes de enviar.
6. Enviar email con Resend.
7. Usar como destinatario por defecto `carlosvfx@gmail.com`, pero permitir override por variable de entorno.
8. Variables de entorno esperadas, sin guardar secretos:
   - `RESEND_API_KEY`;
   - `CONTACT_TO_EMAIL` opcional;
   - `CONTACT_FROM_EMAIL` o equivalente segun Resend.
9. Si faltan variables de entorno, el formulario debe mostrar error claro y no romper la pagina.
10. No guardar mensajes en base de datos.
11. No anadir auth ni pagos.
12. Añadir dependency `resend` solo si hace falta.

## Tarea 4: CTAs y textos

1. Cambiar `Reservar llamada` si no hay calendario real.
2. Propuesta preferida:
   - `Cuentanos tu proyecto`
   - o `Hablemos de tu proyecto`.
3. Revisar todos los CTAs de contacto:
   - `Hablemos`;
   - `Reservar llamada`;
   - `WhatsApp`;
   - enlaces de footer;
   - CTAs dentro de casos.
4. Todo debe llevar a una accion real:
   - formulario interno;
   - WhatsApp real;
   - email interno via Resend.
5. Nada de `mailto:` como flujo principal, salvo fallback secundario documentado.
6. Mantener español de España.

## Tarea 5: documentacion

Actualizar `LAST_REPORT.md` con:

- que habia implementado el informe anterior;
- que no estaba conectado aun: WhatsApp real y formulario Resend;
- mejoras del lightbox;
- cambios de CTAs;
- implementacion de Resend;
- variables de entorno necesarias;
- archivos modificados;
- validaciones ejecutadas;
- estado final de produccion/Railway;
- siguiente paso recomendado.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Validaciones obligatorias

- `npm install` si hace falta.
- `npm run build`.
- `npm run lint` si esta disponible.
- Probar home en movil y escritorio.
- Probar `/casos`, `/casos/cronoras`, `/casos/arik-custom`, `/casos/aventuras-pixeladas`.
- Probar lightbox en movil y escritorio.
- Probar CTA de WhatsApp: debe abrir `wa.me` con mensaje predefinido.
- Probar formulario interno:
  - con variables configuradas si estan disponibles;
  - sin variables, debe fallar con mensaje claro.
- Confirmar que no hay errores graves de consola.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar produccion/Railway en verde tras push.

## Restricciones

- No redisenar la web completa.
- No romper home, casos, movil ni escritorio.
- No tocar dominio, DNS ni Cloudflare.
- No anadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programacion con IA como mensaje publico.
- No inventar datos legales, direccion, telefono, CIF, precios, plazos ni garantias.
- No hacer que el formulario parezca activo si falta configuracion real para enviar.

## Cierre esperado

- Imagenes ampliables realmente grandes y utiles.
- WhatsApp real funcionando con mensaje predefinido.
- CTAs principales sin `mailto` como flujo principal.
- Formulario interno de contacto preparado con Resend.
- Variables necesarias documentadas.
- Produccion en verde.
