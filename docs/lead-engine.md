# Lead engine reutilizable

Fecha: 2026-07-02

## Objetivo

El motor de captacion del chatbot ya no esta acoplado a una plantilla concreta de Aplaudia. Aplaudia es la primera configuracion real, pero la logica queda separada para poder reutilizarla en futuras webs.

## Estructura

- `lib/lead-engine/lead-types.ts`: tipos genericos del lead, mensajes, configuracion, resumen y email.
- `lib/lead-engine/extract-lead-data.ts`: extraccion acumulativa de email, nombre, telefono, presupuesto, consentimiento, copia y estado de envio.
- `lib/lead-engine/classify-lead-messages.ts`: separa mensajes de proyecto, contacto y tramite.
- `lib/lead-engine/detect-lead-services.ts`: detecta tipo de proyecto, servicios y materiales usando solo texto del cliente.
- `lib/lead-engine/infer-commercial-signals.ts`: detecta dudas, urgencia, sensibilidad al precio, claridad y siguiente paso.
- `lib/lead-engine/build-lead-summary.ts`: crea el resumen comercial interno sin transcript mixto.
- `lib/lead-engine/build-internal-email.ts`: construye la ficha interna breve para Aplaudia.
- `content/lead/aplaudia-lead-config.ts`: configuracion especifica de Aplaudia: marca, email publico, consentimiento, servicios, tipos de proyecto y referencias internas.

## Reglas de deteccion

- Los servicios se detectan solo desde mensajes `role=user` y campos explicitos del borrador.
- No se usan saludos, respuestas del asistente, textos comerciales, texto legal ni transcript completo para clasificar servicios.
- `barato`, `barata` y `lo mas barato` no activan `bar`.
- `no tengo fotos` se trata como material mencionado, no como servicio visual.
- Las imagenes o visuales solo se detectan si el cliente pide hacer, crear, editar, retocar, preparar o producir piezas visuales.
- `carta` solo ayuda a detectar hosteleria si aparece con restaurante, bar, cafeteria, menu o reservas.
- Si hay duda, se prefiere `Web / landing` o `Por definir`.

## Flujo del chatbot

- El widget mantiene un `LeadDraft` persistente en `useRef`.
- Email valido y consentimiento claro son los unicos campos obligatorios.
- Nombre, telefono, presupuesto, tipo exacto de proyecto e interes son opcionales o inferibles.
- Si faltan datos obligatorios, se pide solo lo que falta.
- Si hay email, consentimiento e historial util, el sistema puede enviar sin pedir nombre.
- No hay copia automatica al cliente. Si el cliente pide copia, se incluye solo como nota interna.
- Al enviar, el textarea se vacia inmediatamente, vuelve a altura minima y la pregunta queda solo como burbuja.

## Email interno

El email interno es una ficha comercial, no un transcript.

Incluye:

- Contacto.
- Resumen para responder.
- Necesidad detectada.
- Dudas o puntos a responder.
- Precio y alcance.
- Senales comerciales utiles.
- Frases utiles del cliente.
- Nota legal minima.

No incluye:

- transcript completo;
- texto legal repetido;
- mensajes del asistente;
- `acepto`, `envialo`, nombres sueltos o emails sueltos como frases utiles;
- copia automatica al cliente.

## QA de regresion

El script `npm run test:quote-analysis` cubre:

- herramienta/web-app para clinica o gestion de mascotas;
- pagina personal barata;
- restaurante con reservas;
- pregunta de precio sin iniciar envio;
- envio rapido con email y consentimiento.

Tambien se mantiene `npm run test:email-encoding` para evitar problemas de acentos en HTML de emails.

## Como adaptar a otra web

1. Crear un archivo en `content/lead/` con la configuracion de la marca.
2. Pasar `consentText`, `fallbackEmail` y endpoint al wrapper del widget.
3. Reutilizar `/lib/lead-engine` para construir resumen y email interno.
4. Ajustar servicios, tipos de proyecto y referencias internas sin tocar el core.
5. Anadir tests de regresion con conversaciones reales de esa marca.
