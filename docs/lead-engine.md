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
- `leadOptionalContactPrompt`: configuracion reutilizable para preguntar nombre y telefono opcionales como maximo una vez antes de enviar.

## Reglas de deteccion

- Los servicios se detectan solo desde mensajes `role=user` y campos explicitos del borrador.
- No se usan saludos, respuestas del asistente, textos comerciales, texto legal ni transcript completo para clasificar servicios.
- `barato`, `barata` y `lo mas barato` no activan `bar`.
- `me parece muy barato` o `demasiado barato para todo lo que hay que hacer` no significa que el cliente busque barato; significa que percibe que la orientacion puede quedarse corta.
- `no tengo fotos` se trata como material mencionado, no como servicio visual.
- Las imagenes o visuales solo se detectan si el cliente pide hacer, crear, editar, retocar, preparar o producir piezas visuales.
- `carta` solo ayuda a detectar hosteleria si aparece con restaurante, bar, cafeteria, menu o reservas.
- `municipalInstitutional` tiene prioridad sobre `webApp` si aparecen ayuntamiento, municipal, administracion publica, instancias, documentacion municipal, agenda municipal, fiestas del pueblo, red de municipios u otros pueblos.
- El objetivo de mascotas/vacunas solo se usa con contexto explicito de mascotas, vacunas o veterinaria; nunca por palabras genericas como panel, control, usuarios o registro.
- Si hay duda, se prefiere `Web / landing` o `Por definir`.

## Proyectos grandes o institucionales

- Los proyectos municipales/institucionales se clasifican como `Web institucional / plataforma municipal`.
- Servicios detectables: web institucional, panel interno/CMS propio, gestion documental, agenda/eventos, base de datos, automatizaciones, publicacion en redes, agente IA web/chatbot, formularios/instancias, multi-municipio/red de ayuntamientos y usuarios/permisos.
- `Agente IA web / chatbot` y `WhatsApp` son servicios separados; WhatsApp solo se marca si el cliente lo menciona.
- Si hay alta complejidad, el email interno debe recomendar llamada, revision humana y propuesta por fases.
- Para municipal/institucional no se deben recomendar precios de landing, web basica, agente simple ni panel sencillo como si fueran suficientes.
- Las referencias internas de precio para `municipalInstitutional` son: revision humana obligatoria, no usar precios de web basica y preparar propuesta por fases.

## Flujo del chatbot

- El widget mantiene un `LeadDraft` persistente en `useRef`.
- Email valido y consentimiento claro son los unicos campos obligatorios.
- Nombre, telefono, presupuesto, tipo exacto de proyecto e interes son opcionales o inferibles.
- Si faltan datos obligatorios, se pide solo lo que falta.
- Si hay email, consentimiento e historial util, Aplaudia pregunta una sola vez si el cliente quiere dejar nombre y telefono.
- La pregunta opcional nunca bloquea: si el usuario dice `envialo`, `adelante`, `no hace falta`, `sin telefono`, `tira palante` o muestra impaciencia, se envia con lo disponible.
- Despues de preguntar una vez por nombre/telefono, no se vuelve a insistir en mensajes posteriores de la misma solicitud.
- No hay copia automatica al cliente. Si el cliente pide copia, se incluye solo como nota interna.
- Al enviar, el textarea se vacia inmediatamente, vuelve a altura minima y la pregunta queda solo como burbuja.
- El widget guarda el indice de inicio del lead para enviar al endpoint solo los mensajes de esa solicitud y no depender de `messages.slice(-17)`.
- Si ya se envio una solicitud y el usuario empieza una nueva peticion clara, se crea un `LeadDraft` limpio para evitar contaminacion de contexto.

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
- Si no hay telefono, muestra `Telefono: No indicado`.
- Si hay telefono, se marca como dato util para contacto directo si Aplaudia lo considera oportuno.
- Si hay proyecto institucional o alta complejidad, marca `Alcance alto / requiere revision humana`.
- Si el cliente dice que el precio parece demasiado bajo, marca que la orientacion inicial puede quedarse corta.
- Las frases utiles se resumen a 2-3 puntos cortos; no se pegan mensajes enormes.

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
- web municipal/institucional compleja con panel, documentacion, agenda, automatizaciones, chatbot, instancias, red multi-municipio y percepcion de precio demasiado bajo;
- pregunta de precio sin iniciar envio;
- envio rapido con email y consentimiento.
- flujo con nombre y telefono opcionales;
- flujo sin opcionales tras decir `envialo`;
- usuario impaciente que pide enviar sin dar mas datos;
- obligatorios faltantes: email o consentimiento;
- no repetir la pregunta opcional.

Tambien se mantiene `npm run test:email-encoding` para evitar problemas de acentos en HTML de emails.

## Como adaptar a otra web

1. Crear un archivo en `content/lead/` con la configuracion de la marca.
2. Pasar `consentText`, `fallbackEmail` y endpoint al wrapper del widget.
3. Configurar `leadOptionalContactPrompt` si esa web quiere pedir nombre/telefono opcionales antes de enviar.
4. Reutilizar `/lib/lead-engine` para construir resumen y email interno.
5. Ajustar servicios, tipos de proyecto y referencias internas sin tocar el core.
6. Anadir tests de regresion con conversaciones reales de esa marca.
