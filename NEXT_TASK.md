# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Refinar el bloque final de contacto y el lightbox de casos. La version actual ya tiene formulario interno, WhatsApp real y lightbox, pero el contacto se percibe redundante, muestra datos que no hace falta ensenar y no guia suficientemente al usuario para redactar la consulta.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- `https://www.aplaudia.com/` redirige correctamente a raiz.
- `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200`.
- Railway estaba en verde segun las ultimas validaciones HTTP.
- Las vistas clave de casos ya usan lightbox grande en escritorio y movil, pero Carlos indica que todavia no se amplian lo suficiente para que merezca la pena.
- WhatsApp real esta publicado:
  - numero visible actual: `659304487`;
  - formato internacional: `34659304487`;
  - enlace centralizado en `content/site.ts`.
- Formulario interno de contacto preparado:
  - endpoint `/api/contacto`;
  - envio por Resend;
  - sin base de datos;
  - sin guardar mensajes en el repo.
- Variables para activar el formulario real en Railway:
  - `RESEND_API_KEY`;
  - `CONTACT_RECIPIENT_EMAIL`;
  - `EMAIL_FROM`.
- El agente flotante de Aplaudia existe, pero solo esta preparado con fallback si falta API externa.
- Variables para activar agente real:
  - `APLAUDIA_AGENT_API_URL`;
  - `APLAUDIA_AGENT_API_SECRET`.
- No mencionar programacion con IA como mensaje publico.

## Problemas detectados por Carlos en el contacto

- El bloque final repite demasiadas llamadas a la accion:
  - arriba `Enviar consulta` + `WhatsApp`;
  - abajo email visible;
  - abajo WhatsApp visible;
  - dentro del formulario `Enviar consulta` + `WhatsApp directo`.
- El panel se percibe lioso y redundante.
- No quiere que se muestre publicamente el email ni el numero de WhatsApp en el bloque izquierdo.
- No quiere texto tipo `No guardamos el mensaje en base de datos...`, porque ocupa espacio y no aporta en ese contexto.
- Quiere que el bloque quede claro: es un formulario para enviar consulta.
- Quiere que el usuario pueda elegir facilmente lo que necesita y que el mensaje se vaya rellenando casi solo, como en Arik Custom al pedir presupuesto.
- Quiere que el mensaje sea editable aunque se autorrellene.
- Quiere poder enviar por email, por WhatsApp o por ambos.
- El formulario debe ser un punto clave de conversion y debe quedar mas limpio, claro y profesional.

## Tarea 1: simplificar y ordenar el bloque final de contacto

1. Revisar `components/sections/final-cta.tsx` y `components/contact/contact-form.tsx`.
2. Evitar CTAs redundantes dentro del mismo bloque.
3. Propuesta preferida:
   - arriba mantener un unico CTA principal que lleve al formulario, o eliminar CTAs superiores si el formulario esta justo debajo;
   - dentro del panel, dejar claro que el foco es `Cuéntanos tu proyecto` / `Enviar consulta`;
   - mantener WhatsApp como via secundaria clara, no repetida 3 veces.
4. Eliminar del panel izquierdo:
   - email visible;
   - telefono visible;
   - texto de no guardar en base de datos;
   - cualquier explicacion tecnica innecesaria.
5. Usar ese espacio para explicar brevemente como funciona:
   - elige lo que necesitas;
   - completamos un borrador de mensaje;
   - puedes editarlo;
   - envialo por email, WhatsApp o ambos.
6. Aprovechar mejor el ancho disponible del panel.
7. Mantener estetica actual oscura/premium, sin redisenar la web completa.

## Tarea 2: mensaje guiado/autorrellenable

1. Tomar como referencia Arik Custom: opciones laterales o chips que modifican el mensaje.
2. Crear opciones claras, por ejemplo:
   - `Página web`;
   - `Agente IA para WhatsApp`;
   - `Visuales para marca`;
   - `Portfolio / caso real`;
   - `Consulta general`.
3. Al seleccionar una opcion, rellenar o actualizar el mensaje con un texto natural.
4. Mensaje base sugerido:
   `Me gustaría recibir información y consultar sobre ...`
5. Ejemplos de continuacion:
   - Página web: `una página web para mi negocio. Me interesa mejorar la presencia digital y que la web transmita una imagen profesional.`
   - Agente IA para WhatsApp: `un agente IA para atender consultas y orientar a clientes por WhatsApp.`
   - Visuales para marca: `visuales para mejorar la presentación de mi marca, productos o servicios.`
   - Portfolio / caso real: `un proyecto parecido a alguno de los casos reales que aparecen en Aplaudia.`
   - Consulta general: `una idea digital que quiero valorar con Aplaudia.`
6. El usuario debe poder editar libremente el textarea despues.
7. Si el usuario ya ha escrito manualmente, no machacar sin avisar o actualizar de forma razonable.

## Tarea 3: envio por email, WhatsApp o ambos

1. Sustituir el flujo actual por una eleccion clara de canal:
   - `Enviar por email`;
   - `Enviar por WhatsApp`;
   - `Enviar por email y WhatsApp`.
2. El envio por email usa Resend y `/api/contacto`.
3. El envio por WhatsApp abre `wa.me/34659304487` con el mensaje del formulario precompuesto.
4. Si se elige ambos:
   - enviar email por Resend;
   - abrir WhatsApp con el mismo mensaje, o mostrar boton claro para abrirlo despues del envio si el navegador bloquea popups.
5. No mostrar email ni telefono como datos de contacto visibles en el panel.
6. Mantener el consentimiento necesario para responder, pero con texto corto y discreto.
7. Si faltan variables de Resend, mostrar error claro y ofrecer WhatsApp como alternativa.

## Tarea 4: lightbox de casos mas grande

1. Revisar `components/cases/case-gallery.tsx`.
2. Hacer que la imagen ampliada sea realmente grande y util:
   - ocupar casi toda la pantalla;
   - reducir cabecera y descripcion en el modal;
   - permitir que la imagen use practicamente todo el ancho y alto posible;
   - en desktop, aproximarse a full-screen;
   - en movil, ocupar casi toda la pantalla sin salirse.
3. Si conviene, anadir controles:
   - anterior/siguiente;
   - abrir imagen en pestana nueva;
   - boton de cerrar muy claro.
4. No empeorar rendimiento.

## Tarea 5: estado del asistente de Aplaudia

1. No cambiar el agente salvo que sea necesario para que no interfiera.
2. Documentar claramente en `LAST_REPORT.md` su estado actual:
   - widget implementado;
   - instrucciones en `content/agent/aplaudia-agent.md`;
   - endpoint `/api/agent`;
   - ahora mismo necesita `APLAUDIA_AGENT_API_URL` y `APLAUDIA_AGENT_API_SECRET` para responder con IA real;
   - si esas variables no existen, usa fallback.
3. Indicar si para activarlo hace falta crear una API/servicio aparte o si conviene adaptar el route directamente a OpenAI API.
4. No guardar claves.

## Validaciones obligatorias

- `npm install` si hace falta.
- `npm run build`.
- `npm run lint` si esta disponible.
- Probar home en movil y escritorio.
- Probar formulario:
  - email solo;
  - WhatsApp solo;
  - email + WhatsApp;
  - sin variables de Resend;
  - con variables si estan disponibles.
- Probar que WhatsApp recibe el mensaje predefinido/editado.
- Probar lightbox en movil y escritorio.
- Confirmar que no hay errores graves de consola.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar produccion/Railway en verde tras push.

## Documentacion

Actualizar `LAST_REPORT.md` con:

- cambios de UX en el formulario;
- redundancias eliminadas;
- nuevo flujo de mensaje guiado;
- nuevo flujo email/WhatsApp/ambos;
- estado de Resend y variables necesarias;
- estado actual del agente IA;
- mejoras del lightbox;
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
- No mostrar email ni numero de telefono visibles en el panel de contacto si no es imprescindible.
- No hacer que el formulario parezca enviado correctamente si falta configuracion real de Resend.

## Cierre esperado

- Contacto final claro, no redundante y mas ancho/legible.
- Mensaje autorrellenable por opciones y editable.
- Envio por email, WhatsApp o ambos.
- Email/telefono no visibles como datos sueltos en el panel.
- Lightbox realmente grande y util.
- Estado del agente IA documentado.
- Produccion en verde.
