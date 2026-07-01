# LAST REPORT

Fecha: 2026-07-01

## Actualizacion - Resend configurado con dominio propio

### Objetivo

Configurar el envio por email del flujo de solicitud del chatbot con Resend, usando dominio propio de Aplaudia en lugar del remitente generico de pruebas.

### Cambios externos aplicados

- Resend:
  - creado dominio `aplaudia.com`;
  - region configurada: `Ireland (eu-west-1)`;
  - Espana no aparece como region disponible en Resend; las opciones visibles eran North Virginia, Ireland, Sao Paulo y Tokyo;
  - estado final del dominio: `verified`;
  - creada API key nueva llamada `Aplaudia`;
  - permiso de la API key: `Sending access`;
  - la clave no se ha guardado en el repo ni se ha documentado.
- Cloudflare DNS para `aplaudia.com`:
  - `TXT` `resend._domainkey` -> DKIM de Resend;
  - `MX` `send` -> `feedback-smtp.eu-west-1.amazonses.com`, prioridad `10`;
  - `TXT` `send` -> `v=spf1 include:amazonses.com ~all`;
  - `TXT` `_dmarc` -> `v=DMARC1; p=none;`;
  - no se activo receiving en Resend.
- Railway:
  - anadida variable `RESEND_API_KEY`;
  - anadida variable `EMAIL_FROM` con `Aplaudia <hola@aplaudia.com>`;
  - cambios aplicados con Deploy;
  - servicio final: `Online`.

### Validaciones ejecutadas

- Resend dashboard: `aplaudia.com` aparece como `verified`.
- DNS publico:
  - `resend._domainkey.aplaudia.com` responde con DKIM;
  - `send.aplaudia.com` responde con MX `feedback-smtp.eu-west-1.amazonses.com`, prioridad `10`;
  - `send.aplaudia.com` responde con SPF `v=spf1 include:amazonses.com ~all`;
  - `_dmarc.aplaudia.com` responde con `v=DMARC1; p=none;`.
- Railway: servicio `Aplaudia` vuelve a `Online` tras aplicar variables.
- `https://aplaudia.com`: `200`, aviso de construccion visible.
- `https://aplaudia.com/api/agent/quote` sin consentimiento: `400`, no envia correo.

### Limitacion consciente

No se ha enviado un email real de prueba para evitar una comunicacion externa sin pedirlo de forma explicita. La configuracion queda preparada para probar el envio con un caso controlado y consentimiento.

### Siguiente paso recomendado

Hacer una prueba real controlada del flujo de solicitud desde el chatbot con datos ficticios y consentimiento, verificando recepcion en `carlosvfx@gmail.com`. Despues, valorar Cloudflare Email Routing para que `hola@aplaudia.com` o `contacto@aplaudia.com` tambien reciban respuestas si se quiere bandeja propia.

## Actualizacion - Imagenes sin precio unitario y Resend pendiente

### Objetivo

Ajustar el criterio comercial del agente para imagenes/visuales: no dar precios por imagen ni hablar de tecnica concreta. Revisar el estado de configuracion del correo por Resend.

### Cambios aplicados

- `content/agent/aplaudia-agent.md`:
  - eliminado el precio unitario de imagenes;
  - visuales/imagenes se orientan como pack personalizado;
  - el pack depende de volumen, estilo, dificultad, formatos, uso, integracion en web/marca y revisiones;
  - se indica que Aplaudia puede adaptar el alcance al presupuesto disponible;
  - al hablar de imagenes o visuales no debe mencionar IA, prompts, herramientas, Photoshop ni tecnica concreta;
  - tras orientar sobre precios, puede ofrecer enviar un resumen a una persona de Aplaudia y una copia limpia al cliente si lo desea.
- `lib/agent/build-agent-prompt.ts`:
  - regla prioritaria para no dar importes por imagen;
  - regla prioritaria para ofrecer resumen humano tras hablar de precios sin pedir datos ni privacidad hasta que el usuario quiera enviarlo.
- `components/agent/generic-agent-widget.tsx`:
  - se permite que un `si`, `vale`, `envialo` o similar continue el flujo solo cuando ya existe contexto reciente de envio de resumen;
  - se evita que una nueva pregunta normal sobre servicios o imagenes quede atrapada en el flujo de consentimiento.

### Resend / correo

- El endpoint `/api/agent/quote` ya usa Resend.
- Destinatario interno actual: `carlosvfx@gmail.com`.
- Variables necesarias en Railway:
  - `RESEND_API_KEY`;
  - `EMAIL_FROM`.
- No se han guardado secretos en el repo.
- Railway CLI no permite configurar variables desde esta sesion porque sigue sin login valido: `invalid_grant` / `Unauthorized`.
- Siguiente accion necesaria: entrar en Railway, configurar `RESEND_API_KEY` y `EMAIL_FROM`, y hacer una prueba controlada con datos ficticios.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: sigue no disponible porque `eslint` no esta instalado en el proyecto.
- Produccion `https://aplaudia.com/api/agent`:
  - pregunta `¿Cuánto cuesta hacer imágenes para mi web?`;
  - no devuelve importes por imagen;
  - no menciona IA ni herramientas concretas;
  - responde con pack personalizado segun volumen, estilo, uso, retoque e integracion;
  - ofrece enviar un resumen a una persona de Aplaudia y copia limpia por email si el cliente quiere.
- Produccion `https://aplaudia.com/api/agent/quote`:
  - payload sin consentimiento: `400`;
  - no envia correo sin aceptacion.
- Produccion `https://aplaudia.com`: `200`, aviso de construccion visible.
- `robots.txt`, `llms.txt` y `sitemap.xml`: `200`.

### Estado

- Cambio commiteado y enviado a `origin/main`.
- Commit: `676584e` (`Ajusta precios de imagenes del chatbot`).
- Produccion validada con la nueva respuesta del agente.
- Resend queda preparado en codigo, pero pendiente de confirmar/configurar variables `RESEND_API_KEY` y `EMAIL_FROM` en Railway.

## Actualizacion - Separacion estricta entre precios y solicitud

### Objetivo

Corregir el bloqueo reportado: al preguntar por precio o presupuesto, el chatbot no debe pedir privacidad ni entrar en flujo de envio de datos. Tambien reforzar el borrado del textarea tras enviar.

### Cambios aplicados

- `components/agent/generic-agent-widget.tsx`:
  - `quiero presupuesto`, `puedes darme presupuesto` o preguntas de precio ya no activan el flujo de consentimiento;
  - el consentimiento solo salta con intencion clara de enviar datos/resumen a Aplaudia o pedir contacto humano;
  - se añade un segundo `resetInput()` al finalizar cada envio para reforzar que el cajon queda vacio.
- `lib/agent/build-agent-prompt.ts`:
  - si el usuario pregunta por precio, presupuesto, coste o tarifa, el agente debe responder precios sin pedir datos ni privacidad.
- `content/agent/aplaudia-agent.md`:
  - se aclara que preguntar precios no equivale a enviar una solicitud;
  - el resumen a una persona de Aplaudia solo procede si el usuario pide contacto, revision humana o envio de solicitud.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: sigue no disponible porque `eslint` no esta instalado en el proyecto.
- QA local en `http://localhost:3060`:
  - `¿Qué precio tiene una web para poner vídeos y reels?`: no muestra privacidad ni `Para poder enviarlo`;
  - `quiero presupuesto para una página moderna con vídeos`: no muestra privacidad ni `Para poder enviarlo`;
  - `Quiero enviar un resumen a una persona de Aplaudia...`: sí pide nombre/email y consentimiento;
  - tras un `hola?` posterior no se repite el bloque de consentimiento;
  - el textarea queda vacio despues de cada envio.
- Produccion `https://aplaudia.com`:
  - `¿Qué precio tiene una web para poner vídeos y reels?`: responde con orientacion de precios, sin privacidad;
  - `quiero presupuesto para una página moderna con vídeos`: responde con orientacion de precios, sin privacidad;
  - `Quiero enviar un resumen a una persona de Aplaudia...`: pide nombre/email y consentimiento;
  - el textarea queda vacio despues de cada envio;
  - aviso de construccion sigue visible.

### Estado

- Cambio pusheado y validado en produccion con commit `e584090`.

## Actualizacion - Bugfix textarea y bloqueo del chatbot

### Objetivo

Corregir el fallo detectado en escritorio: al enviar un mensaje, el textarea podia conservar el texto anterior y concatenarlo con el siguiente. Corregir tambien el bloqueo por el que el chatbot entraba en modo solicitud de presupuesto al mencionar `contactarme` o `precios`.

### Cambios aplicados

- `components/agent/generic-agent-widget.tsx`:
  - el textarea pasa a estar controlado por estado React (`inputDraft`) y una ref sincronizada;
  - `resetInput()` limpia estado, ref, DOM, altura y bandera `hasText`;
  - envio con boton y Enter usan el mismo valor sincronizado;
  - el detector de solicitud ya no considera `contactarme` como intencion de enviar datos a Aplaudia;
  - despues de pedir datos de solicitud, solo continua ese flujo si el nuevo mensaje aporta datos utiles o aceptacion clara.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: sigue no disponible porque `eslint` no esta instalado en el proyecto.
- QA local escritorio en `http://localhost:3060`:
  - caso de la captura con `contactarme` y `precios`: ya no dispara solicitud ni consentimiento;
  - dos mensajes seguidos: el textarea queda vacio tras cada envio;
  - flujo real de enviar resumen: sigue pidiendo consentimiento;
  - despues de una solicitud, un `hola?` normal ya no repite el bloque `Para poder enviarlo`.
- Produccion `https://aplaudia.com`:
  - el textarea queda vacio tras enviar;
  - el caso de la captura no dispara consentimiento ni `Para poder enviarlo`;
  - el aviso de construccion sigue visible.

### Estado

- Bug corregido, pusheado y validado en produccion.

## Actualizacion - Presupuesto conversacional y saludo neutro

### Objetivo

Ejecutar `NEXT_TASK.md` y convertir la solicitud de presupuesto del chatbot en un flujo conversacional, sin boton fijo, con saludo neutro, consentimiento claro y uso limitado de datos.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - saludo inicial neutro, sin mencionar Cronoras, Arik Custom ni Aventuras Pixeladas;
  - etiqueta flotante corta `¿Dudas?`;
  - configuracion `leadRequest` para activar el envio conversacional a `/api/agent/quote`.
- `components/agent/generic-agent-widget.tsx`:
  - eliminado el boton fijo `Presupuesto`;
  - eliminado el formulario incrustado de solicitud;
  - añadido flujo conversacional para detectar intencion de enviar resumen o presupuesto;
  - el textarea se vacia inmediatamente al enviar con boton o Enter y vuelve a altura minima;
  - antes de llamar al endpoint exige aceptacion clara;
  - si faltan datos, pide nombre, email, tipo de negocio/proyecto o necesidad principal desde el propio chat;
  - si el endpoint falla en local por falta de `RESEND_API_KEY`, muestra error controlado sin enviar correo.
- `lib/agent/types.ts`:
  - sustituida configuracion `quoteRequest` por `leadRequest`.
- `lib/agent/build-agent-prompt.ts`:
  - eliminado mandato de usar boton `Presupuesto`;
  - casos reales solo si el usuario pide ejemplos o pregunta por ellos;
  - precios solo bajo pregunta directa;
  - si el usuario dice que algo es caro o tiene poco presupuesto, preguntar que presupuesto le gustaria no superar;
  - consentimiento literal antes de enviar datos.
- `content/agent/aplaudia-agent.md`:
  - documentado que los casos reales no se mencionan de forma proactiva;
  - documentado el flujo conversacional de solicitud;
  - indicado que los datos no se usan para newsletter, publicidad ni otros fines.
- `app/api/agent/quote/route.ts`:
  - destinatario interno provisional fijado a `carlosvfx@gmail.com`;
  - copia interna y copia cliente aclaran finalidad, no base de datos y no uso publicitario.
- `NEXT_TASK.md`:
  - actualizado el siguiente foco real: prueba controlada del flujo conversacional en produccion y revision de Resend/legal.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: no disponible realmente; falla porque `eslint` no esta instalado en el proyecto.
- `npx tsc --noEmit`: falla por deuda previa fuera de este cambio:
  - `components/sections/construction-notice.tsx`;
  - `components/ui/calendar.tsx`;
  - `i18n/provider.tsx`.
- `git diff --check`: OK, solo avisos CRLF normales en Windows.
- QA local en `http://localhost:3060`:
  - home carga;
  - aviso de construccion visible con fecha `1 de julio de 2026`;
  - dialogo del chatbot con saludo neutro;
  - sin Cronoras, Arik Custom ni Aventuras Pixeladas en el saludo;
  - sin boton `Presupuesto` ni `Generar presupuesto`;
  - botones visibles solo: cerrar, dictado por voz y enviar;
  - al pedir enviar resumen, el textarea se vacia inmediatamente y aparece el consentimiento literal;
  - al enviar con Enter una aceptacion con datos ficticios, el textarea se vacia y el endpoint responde `503` controlado por falta de `RESEND_API_KEY` local;
  - movil 390 x 844: panel grande, sin overflow horizontal, sin boton de presupuesto y aviso de construccion visible.
- Produccion `https://aplaudia.com` tras push:
  - home carga y mantiene aviso de construccion;
  - chatbot con saludo neutro;
  - sin boton fijo `Presupuesto` ni `Generar presupuesto`;
  - botones visibles solo: cerrar, dictado por voz y enviar;
  - al pedir enviar resumen, el textarea se vacia y aparece el consentimiento literal;
  - `/api/agent/quote` sin consentimiento responde `400` y no envia nada.
- Railway CLI:
  - sigue sin sesion valida (`invalid_grant` / `Unauthorized`);
  - despliegue efectivo confirmado por produccion actualizada.

### Estado final

- Cambio local y produccion validados.
- Produccion `https://aplaudia.com`: OK con commit `6bad907`.
- Railway CLI sin acceso por sesion caducada, pero despliegue efectivo confirmado.
- No se ha enviado ningun email real.

### Siguiente paso recomendado

Hacer una prueba real controlada del envio por email solo con confirmacion explicita de Carlos y revisar `RESEND_API_KEY` / `EMAIL_FROM` en Railway antes de retirar el aviso de construccion.

## Actualizacion - Precios internos y solicitud de presupuesto desde chatbot

### Objetivo

Actualizar el conocimiento comercial interno del agente, impedir precios en la web publica, reforzar precios solo bajo pregunta directa y crear un flujo corto de solicitud de presupuesto desde el chatbot con consentimiento visible.

### Cambios aplicados

- `content/agent/aplaudia-agent.md`:
  - la seccion pasa a `Precios internos vigentes`;
  - se explicita que los precios no deben publicarse como tabla visible en la web publica;
  - el chatbot solo puede hablar de importes si el usuario pregunta directamente por precio, coste, presupuesto, tarifa, mensualidad, mantenimiento o expresiones equivalentes;
  - todos los importes se marcan como orientativos y sin IVA;
  - mantenimiento actualizado:
    - esencial: desde 29 €/mes, pago anual 348 €/año, sin IVA;
    - activo: desde 59 €/mes, pago anual 708 €/año, sin IVA;
    - evolucion: desde 119 €/mes, pago anual 1.428 €/año, sin IVA;
    - a medida: desde 199 €/mes, pago anual desde 2.388 €/año, sin IVA;
  - se elimina tarifa/hora publica de mantenimiento y se indica que trabajos fuera de alcance van aparte;
  - se añade comparativa clara entre Aplaudia y builders/hosting con IA;
  - se documenta el flujo `Presupuesto` del chatbot, consentimiento, copia interna y copia limpia para cliente.
- `components/agent/generic-agent-widget.tsx` y `components/agent/aplaudia-agent-widget.tsx`:
  - nuevo boton compacto `Presupuesto` dentro del panel del chatbot;
  - formulario corto con nombre, email, telefono opcional, tipo de negocio/proyecto, interes principal, presupuesto/rango opcional, copia limpia y consentimiento;
  - consentimiento visible antes de enviar: Aplaudia recibe datos y resumen de conversacion para poder responder;
  - se mantiene el bug corregido del textarea: envio con boton o Enter limpia inmediatamente y vuelve a 48px.
- `app/api/agent/quote/route.ts`:
  - nuevo endpoint `/api/agent/quote`;
  - usa Resend y las variables existentes `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL` / `CONTACT_TO_EMAIL`, `EMAIL_FROM`;
  - fallback de destinatario a `siteConfig.contact.email` (`carlosvfx@gmail.com`);
  - valida nombre, email, tipo de proyecto, interes y consentimiento;
  - email interno con datos del cliente, tipo de proyecto, servicios detectados, dudas, foco en precios, interes aproximado, presupuesto indicado, referencias comentadas y resumen de conversacion;
  - copia para cliente solo si se marca, limpia y sin notas internas;
  - no guarda datos en base de datos.
- `lib/agent/build-agent-prompt.ts`:
  - refuerzo prioritario para presupuesto, consentimiento y comparativa builder/IA.
- `lib/agent/types.ts`:
  - configuracion opcional `quoteRequest` para mantener el motor reutilizable.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no esta disponible como ejecutable del proyecto.
- `git diff --check`: OK, solo avisos CRLF normales de Windows.
- Busqueda de precios fuera del `.md` interno y endpoint de email: sin importes visibles en web publica.
- API local:
  - `/api/agent/quote` sin consentimiento: `400`;
  - payload valido sin `RESEND_API_KEY` local: `503` controlado, sin enviar email real.
- QA local:
  - escritorio: boton `Presupuesto`, formulario visible, consentimiento visible, campo tipo de negocio/proyecto, sin scroll horizontal;
  - escritorio: envio con Enter limpia textarea, altura 48px, boton enviar desactivado, pregunta solo en historial;
  - movil: formulario visible, consentimiento visible, campo tipo de negocio/proyecto, sin scroll horizontal.
- Produccion `https://aplaudia.com`:
  - `/api/agent/quote` desplegado y corta sin consentimiento con `400`, sin enviar correo;
  - home `200`;
  - `/robots.txt`, `/llms.txt`, `/sitemap.xml` `200`;
  - chatbot escritorio y movil con boton `Presupuesto`, formulario y consentimiento visibles;
  - aviso de construccion sigue visible;
  - textarea en escritorio se vacia al enviar con Enter y queda a 48px;
  - agente sin pregunta de precio no muestra importes;
  - pregunta de precio web usa `desde` y sin IVA;
  - mantenimiento mensual usa 29/59/119/199, `desde`, sin IVA y pago anual;
  - comparacion builder/hosting con IA explica autoservicio frente a servicio personalizado.
- Railway CLI:
  - sigue sin sesion valida (`invalid_grant` / `Unauthorized`);
  - despliegue efectivo confirmado por produccion.

### Limitacion consciente

No se ha enviado un email real de prueba a `carlosvfx@gmail.com` para evitar generar una comunicacion externa sin orden explicita de prueba. El endpoint y las validaciones previas al envio quedan preparados; con `RESEND_API_KEY` en produccion, el envio real se activara al completar el formulario con consentimiento.

### Estado

- Cambio funcional commiteado y enviado a `origin/main`.
- Commit principal: `9fbaf05` (`Añade solicitud de presupuesto al chatbot`).
- Produccion `https://aplaudia.com`: OK.

### Siguiente paso recomendado

Hacer una prueba real controlada del formulario de presupuesto con Carlos confirmando el envio del email interno, y despues preparar legal/privacidad antes de retirar el aviso de construccion.

## Actualizacion - Input limpio, fuente del chatbot y precios sin IVA

### Objetivo

Ejecutar el foco de `NEXT_TASK.md`: mejorar ligeramente la legibilidad del chatbot, asegurar que el textarea se limpia tambien en escritorio y con Enter, y reforzar las reglas del agente para que solo hable de precios cuando el usuario lo pida explicitamente.

### Cambios aplicados

- `components/agent/generic-agent-widget.tsx`:
  - las burbujas del chat en escritorio suben a `17px` con interlineado compacto;
  - movil se mantiene en `16px` para no perder espacio;
  - `resetInput()` limpia `value`, `defaultValue`, scroll interno, altura inline y `hasText`;
  - el reseteo se repite en el siguiente `requestAnimationFrame` para cubrir timings de escritorio y envio con Enter;
  - al enviar, primero se limpia el textarea y despues se detiene el dictado;
  - Enter ignora composicion IME y llama a `sendMessage()` sin dejar salto de linea.
- `content/agent/aplaudia-agent.md`:
  - precios solo si el usuario pregunta por precio, coste, presupuesto, tarifa, mensualidad, mantenimiento, cuanto cuesta, barato, economico, minimo o desde cuanto;
  - cualquier respuesta con precios debe indicar importes orientativos sin IVA;
  - mantenimiento/mensualidad se describe como servicio mensual, normalmente con pago anual, y con alcance por definir.
- `lib/agent/build-agent-prompt.ts`:
  - mismas reglas reforzadas en el prompt prioritario del servidor;
  - se mantiene el `.md` como fuente editable principal y no se hardcodean tarifas completas en codigo.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existia.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no esta disponible como ejecutable del proyecto.
- `git diff --check`: OK, solo avisos CRLF normales de Windows.
- QA local con `next start`:
  - escritorio 1280x800: fuente de burbujas `17px`, sin scroll horizontal, aviso de construccion visible;
  - escritorio con boton: textarea vacio, 48px, enviar desactivado y pregunta solo en historial;
  - escritorio con Enter: textarea vacio, 48px, enviar desactivado y pregunta solo en historial;
  - movil 390x844: fuente `16px`, sin scroll horizontal, aviso visible, textarea vacio a 48px tras enviar.
- QA produccion `https://aplaudia.com`:
  - home `200`;
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200`;
  - escritorio 1280x800: fuente `17px`, Enter limpia el textarea y la pregunta queda solo en historial;
  - movil 390x844: fuente `16px`, boton limpia el textarea y la pregunta queda solo en historial;
  - `/api/agent` responde con `provider: openai`;
  - pregunta sin precio (`Quiero una web sencilla para mi restaurante.`): no devuelve importes;
  - pregunta con precio (`Cuanto cuesta una web sencilla?`): devuelve rangos con `desde` e importes orientativos sin IVA;
  - mantenimiento mensual: devuelve rangos con `desde`, sin IVA, servicio mensual y mencion de pago anual;
  - fuera de ambito: redirige a Aplaudia y casos reales.
- Railway CLI:
  - sigue sin sesion valida (`invalid_grant` / `Unauthorized`);
  - despliegue efectivo confirmado por produccion sirviendo UI y API actualizadas.

### Estado

- Cambios commiteados y enviados a `origin/main`.
- Commits principales:
  - `e7c6e6e` (`Ajusta envio y precios del chatbot`);
  - `736bf57` (`Afina disparadores de precios del agente`);
  - `01c6b48` (`Refuerza regla de mantenimiento del agente`).
- Produccion `https://aplaudia.com`: OK.
- Aviso de construccion: sigue visible.

### Siguiente paso recomendado

Probar dictado real desde movil con permiso de microfono y una frase larga con pausas naturales. Despues, revisar respuestas reales del agente durante unos dias y pasar a legal/contacto antes de retirar el aviso de construccion.

## Actualizacion - Respuestas enriquecidas y dictado mas estable

### Objetivo

Mejorar la presentacion visual de las respuestas del chatbot de Aplaudia y corregir el dictado por voz para que no se corte al primer silencio corto.

### Cambios aplicados

- `components/agent/generic-agent-widget.tsx`:
  - los mensajes del asistente pasan de texto plano a un renderer seguro `AgentMessageContent`;
  - se soporta Markdown simple sin `dangerouslySetInnerHTML`:
    - titulos cortos con `###`;
    - negritas con `**texto**`;
    - listas con guiones;
    - saltos de linea;
    - enlaces Markdown y URLs `http/https` con `rel="noreferrer noopener"`;
  - los mensajes del usuario siguen siendo texto plano;
  - la burbuja del asistente mantiene el estilo oscuro/premium del chat.
- Dictado por voz:
  - `continuous = true`;
  - `interimResults = true`;
  - temporizador de silencio de 3,6 segundos desde el ultimo resultado;
  - si el navegador corta la sesion antes de tiempo, intenta reiniciar de forma controlada mientras el usuario siga escuchando;
  - se separa parada manual, parada por silencio y errores no recuperables;
  - no reintenta en `not-allowed`, `service-not-allowed` ni `audio-capture`;
  - conserva el texto parcial del input entre reinicios para evitar duplicados;
  - al enviar o cerrar el chat, detiene el dictado y limpia timers.
- `content/agent/aplaudia-agent.md`:
  - nueva seccion `Formato de respuesta en el chatbot web`;
  - reglas para responder como interfaz web, no como WhatsApp;
  - precios orientativos en bloques breves con negritas y listas;
  - se mantiene la regla de no dar precios si no se preguntan explicitamente.
- `lib/agent/build-agent-prompt.ts`:
  - regla prioritaria para que el modelo use Markdown simple y limpio en el chatbot web.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existia.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no esta disponible como ejecutable del proyecto.
- `git diff --check`: OK.
- QA local en `http://localhost:3053`:
  - movil 390 x 844: home sin scroll horizontal, aviso de construccion visible, etiqueta `¿Dudas?` visible;
  - chatbot movil: panel abre, burbuja del asistente usa contenedor enriquecido, textarea y botones sin solape;
  - envio escrito: textarea se limpia, vuelve a 48 px, boton enviar queda desactivado y la pregunta queda solo como burbuja;
  - microfono en navegador sin soporte/permiso: muestra fallback discreto y no rompe UI;
  - galeria y lightbox siguen funcionando en escritorio.
- QA produccion en `https://aplaudia.com` tras push:
  - `/api/agent` responde con `provider: openai`;
  - pregunta explicita de precio devuelve Markdown con negritas;
  - UI movil renderiza la respuesta con `h3` y `strong`, sin mostrar `**` crudos;
  - textarea se limpia y vuelve a 48 px tras enviar;
  - consulta fuera de ambito (`receta de tortilla`) redirige a Aplaudia y casos reales;
  - consulta de servicio sin precio responde sin importes;
  - home, chatbot y galeria sin scroll horizontal.
- Railway CLI:
  - consultado con `railway deployment list`;
  - sigue sin sesion valida (`invalid_grant` / `Unauthorized`);
  - despliegue efectivo confirmado por produccion sirviendo el cambio y por `/api/agent`.

### Limitaciones conocidas

- El dictado real con audio no puede validarse completamente desde Codex porque requiere permiso de microfono y hablar desde el dispositivo real.
- Safari/iOS puede cortar o no exponer Web Speech API; el fallback sigue siendo visible y controlado.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit principal: `70057f0` (`Mejora formato y dictado del chatbot`).
- Produccion `https://aplaudia.com`: OK, sirve respuestas enriquecidas y el agente responde con OpenAI.
- Railway: despliegue efectivo confirmado por produccion; CLI sigue pendiente de renovar login si se quiere consultar directamente.

### Siguiente paso recomendado

Probar en movil real el dictado hablando con pausas naturales. Si todavia corta antes de tiempo, ajustar `VOICE_SILENCE_TIMEOUT_MS` entre 4000 y 4500 ms o aumentar el margen de reinicio para el navegador concreto.

## Actualizacion - Layout modular de galeria visual

### Objetivo

Ejecutar la nueva prioridad de Carlos: ajustar la galeria de visuales a una composicion concreta, dejarla preparada para crecer facilmente y sustituir la imagen de pantalla en tienda que no parecia un display real.

### Cambios aplicados

- `content/visual-gallery.ts`:
  - cada pieza declara ahora `orientation` (`vertical` u `horizontal`);
  - se documenta el patron actual de filas:
    - primera fila: vertical + horizontal;
    - segunda fila: horizontal + vertical;
    - ultimo bloque: horizontal sola;
  - se elimina la dependencia de clases `span`/masonry en el contenido.
- `components/sections/visual-gallery.tsx`:
  - la galeria deja de usar columnas automaticas y pasa a filas controladas;
  - no hay margenes negativos ni solapes intencionados;
  - el componente construye filas a partir de `visualGalleryRowPattern`, preparado para anadir nuevas piezas cambiando datos;
  - se mantienen animaciones, hover y lightbox casi a pantalla completa;
  - se anaden atributos internos `data-gallery-*` para QA y futuras comprobaciones sin impacto visual.
- `public/visuals/retail-screen-clothing.webp`:
  - sustituido por una escena nueva generada con `imagegen`;
  - ahora muestra una pantalla digital fisica integrada en una tienda de moda, con marco real, reflejos, ropa, luz de tienda y una persona desenfocada en primer plano;
  - WebP optimizado: 1003 x 1568 px, 129.984 bytes.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existia.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no esta disponible como ejecutable del proyecto.
- QA local en `http://localhost:3052`:
  - escritorio 1440 x 1100:
    - 5 imagenes detectadas;
    - fila 1: `vertical:studio-editing` + `horizontal:sport-storefront`;
    - fila 2: `horizontal:motion-editing` + `vertical:retail-screen-clothing`;
    - fila 3: `horizontal:pet-storefront`;
    - sin scroll horizontal;
    - sin solapes entre imagenes;
    - lightbox visible con marco de 1382 x 968 px y fondo bloqueado.
  - movil 390 x 844:
    - imagenes apiladas a ancho util completo tras animacion;
    - sin scroll horizontal;
    - sin solapes;
    - lightbox visible con marco de 366 x 743 px y fondo bloqueado;
    - aviso de construccion visible;
    - microetiqueta `¿Dudas?` visible;
    - no aparece `Preguntame sobre Aplaudia`;
    - chatbot abre correctamente y mantiene el textarea.
- QA produccion en `https://aplaudia.com` tras push:
  - home responde `200`;
  - la home contiene `data-gallery-row-pattern`;
  - la home mantiene la microetiqueta `¿Dudas?`;
  - no aparece `Preguntame sobre Aplaudia`;
  - `https://aplaudia.com/visuals/retail-screen-clothing.webp` responde `200`;
  - el asset nuevo pesa 129.984 bytes en produccion;
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200`.
- Railway CLI:
  - sigue sin sesion valida (`invalid_grant` / `Unauthorized`);
  - despliegue efectivo confirmado por produccion sirviendo el HTML y el asset nuevos.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit principal: `6d40d3b` (`Reordena galeria visual por filas`).
- Produccion `https://aplaudia.com`: OK, sirve la nueva galeria y el nuevo WebP.
- Railway: no consultable por CLI hasta renovar login, pero produccion confirma despliegue efectivo.

### Siguiente paso recomendado

Desplegar y revisar en movil real `https://aplaudia.com` la nueva composicion. Si Carlos aprueba el enfoque, el siguiente foco visual sera decidir nuevas piezas 6/7 o preparar un primer video corto usando esta misma linea realista.

## Actualizacion - Chatbot, agente y visuales

### Objetivo

Ejecutar `NEXT_TASK.md` y el ajuste urgente de Carlos: etiqueta corta del chatbot, galeria visual sin solapes raros, imagenes ampliables a pantalla casi completa y agente limitado al ambito de Aplaudia con precios mejor ordenados.

### Cambios aplicados

- `components/agent/generic-agent-widget.tsx` y `components/agent/aplaudia-agent-widget.tsx`:
  - se anade etiqueta corta visible `¿Dudas?`;
  - no aparece `Preguntame sobre Aplaudia`;
  - se confirma que el textarea se limpia al enviar y vuelve a altura minima.
- `components/sections/visual-gallery.tsx` y `content/visual-gallery.ts`:
  - la galeria pasa a masonry limpio de dos columnas en escritorio y una columna en movil;
  - se eliminan margenes negativos y solapes raros;
  - se mantiene animacion, hover y assets actuales;
  - al clicar una imagen se abre un lightbox casi a pantalla completa con cierre y tecla Escape.
- `content/agent/aplaudia-agent.md`:
  - precios propios reordenados por Webs, Agentes IA/chatbots, Mantenimiento mensual y Visuales/imagen/video;
  - referencias de mercado anadidas en bloque separado y marcadas como no-precio propio;
  - nueva seccion `Ambito de conversacion` para rechazar preguntas ajenas a Aplaudia;
  - se refuerza que no debe hablar de precios si no se preguntan explicitamente.
- `lib/agent/build-agent-prompt.ts`:
  - el prompt servidor antepone reglas prioritarias para obedecer el `.md`, no salir de ambito, no dar precios sin pregunta explicita y no mencionar herramientas internas.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existia.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no esta disponible como ejecutable del proyecto.
- `git diff --check`: OK; solo avisos CRLF/LF de Windows.
- QA local con `next start` en `http://127.0.0.1:3050`:
  - escritorio 1440x1100: galeria sin solapes, sin scroll horizontal, etiqueta `¿Dudas?` visible;
  - movil 390x844: galeria apilada sin scroll horizontal, etiqueta `¿Dudas?` visible;
  - lightbox escritorio: abierto, 1382 x 968 px, scroll de fondo bloqueado;
  - lightbox movil: abierto, 366 x 743 px, scroll de fondo bloqueado;
  - chatbot: textarea antes de enviar 96 px, tras enviar queda vacio, 48 px, boton enviar desactivado, pregunta solo como burbuja.
- QA produccion en `https://aplaudia.com`:
  - home responde `200`;
  - contiene `¿Dudas?`;
  - no contiene `Preguntame sobre Aplaudia`;
  - referencia `escaparate-02`;
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200`.
- Pruebas reales de `/api/agent` en produccion:
  - `Quiero una web sencilla para mi negocio`: responde sin importes;
  - `¿Cuánto cuesta una web sencilla?`: responde con precio orientativo;
  - `Tengo 50 productos pero quiero algo barato`: propone fases/reducir alcance;
  - `Dime curiosidades del universo`: rechaza fuera de ambito y redirige;
  - `Dime una receta de tortilla`: rechaza fuera de ambito y redirige;
  - `Háblame de Cronoras`, `Háblame de Arik Custom` y `Háblame de Aventuras Pixeladas`: responde dentro de ambito;
  - `¿Programáis la web con IA?`: no menciona herramientas internas;
  - `¿Cuánto cuesta un chatbot?`: responde con agente web desde 500 euros e integracion WhatsApp desde 100 euros adicionales.
- Railway CLI: sigue sin sesion valida (`invalid_grant` / `Unauthorized`), pero produccion confirma despliegue efectivo.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit principal: `1e593ee` (`Ajusta chatbot agente y galeria visual`).
- Produccion `https://aplaudia.com`: OK, sirve el cambio y el agente responde con `provider: openai`.

### Siguiente paso recomendado

Revisar en movil real la etiqueta `¿Dudas?`, el lightbox de visuales y la nueva distribucion masonry. Si Carlos aprueba, el siguiente foco es legal/contacto antes de retirar el aviso de construccion.

## Actualizacion - Galeria visual mas llena

### Objetivo

Corregir la percepcion de que las imagenes de la galeria quedaban pequenas y demasiado separadas, especialmente la pieza mas pequena frente al primer escaparate.

### Cambios aplicados

- `content/visual-gallery.ts`:
  - la composicion de escritorio pasa a dos columnas grandes de 5/10 columnas;
  - todas las piezas usan el mismo ancho base en escritorio;
  - se reduce el hueco vertical con solapes/margenes negativos mas controlados;
  - el segundo escaparate y la imagen de edicion de video dejan de verse como piezas pequenas.
- `components/sections/visual-gallery.tsx`:
  - la rejilla de la galeria pasa de 12 a 10 columnas solo para esta zona;
  - las imagenes activan su animacion un poco antes al entrar en viewport para no aparecer reducidas cuando estan al borde inferior;
  - se conservan animacion, hover, gradientes, orden de imagenes y apilado movil.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no esta disponible como ejecutable del proyecto.
- `git diff --check`: OK; solo aviso normal de CRLF/LF en Windows.
- QA local con `next start` en `http://127.0.0.1:3049`:
  - escritorio 1440x1100: todas las imagenes de escritorio miden 596 px de ancho, sin scroll horizontal y con menos hueco entre piezas;
  - movil 390x844: apilado correcto, piezas inferiores a ancho completo al entrar en vista y sin scroll horizontal.
- QA produccion en `https://aplaudia.com`:
  - escritorio 1440x1100: la nueva composicion esta activa, todas las imagenes de escritorio miden 596 px de ancho, sin scroll horizontal y con aviso de construccion visible;
  - movil 390x844: apilado correcto, sin scroll horizontal, aviso de construccion visible.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit principal: `8a704d8` (`Reordena galeria visual con piezas mas grandes`).
- Produccion `https://aplaudia.com`: OK, sirve la composicion nueva.

### Siguiente paso recomendado

Revisar en produccion desde el viewport real de Carlos. Si aun se quiere mas densidad, el siguiente ajuste seria bajar ligeramente el alto de las dos imagenes verticales para que entren mas piezas en el primer pantallazo.

## Actualizacion - Segundo escaparate en galeria visual

### Objetivo

Incorporar `Escaparate_02.png` a la galeria de visuales como imagen realista de escaparate, mantener las animaciones actuales y dejar la lista preparada para anadir o cambiar piezas futuras sin tocar el componente.

### Cambios aplicados

- `public/visuals/escaparate-02.webp`:
  - convertido desde `T:\DESCARGAS\Escaparate_02.png`;
  - formato WebP lossless;
  - tamano final: 1449 x 1086 px, 1.920.700 bytes.
- `content/visual-gallery.ts`:
  - nuevo archivo de contenido para centralizar las imagenes de la galeria;
  - preparado para anadir quinta, sexta o nuevas piezas cambiando datos, no el componente.
- `components/sections/visual-gallery.tsx`:
  - ahora consume `visualGalleryItems` desde `content/visual-gallery.ts`;
  - se conserva la animacion de entrada, hover, gradientes y comportamiento responsive;
  - el nuevo escaparate queda en escritorio en la parte baja derecha, bajo la pieza de edicion de video, evitando el aviso flotante de construccion;
  - en movil las cinco imagenes se apilan sin cambiar el diseno general.

### Archivos modificados

- `components/sections/visual-gallery.tsx`
- `content/visual-gallery.ts`
- `public/visuals/escaparate-02.webp`
- `LAST_REPORT.md`

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existia.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no esta disponible como ejecutable del proyecto.
- `git diff --check`: OK; solo aviso normal de CRLF/LF en Windows.
- QA local con `next start` en `http://127.0.0.1:3048`:
  - escritorio 1440x1100: cinco imagenes visibles, sin scroll horizontal, escaparate 02 en la parte baja derecha;
  - movil 390x844: cinco imagenes apiladas, sin scroll horizontal, aviso de construccion y chatbot siguen visibles.
- QA produccion en `https://aplaudia.com`:
  - home responde `200`;
  - `https://aplaudia.com/visuals/escaparate-02.webp` responde `200`;
  - la home referencia `escaparate-02`;
  - escritorio 1440x1100: cinco imagenes detectadas, sin scroll horizontal y aviso de construccion visible;
  - movil 390x844: galeria apilada, sin scroll horizontal y aviso de construccion visible.
- Railway CLI: no permite leer deployments por sesion caducada (`invalid_grant` / `Unauthorized`), pero el despliegue efectivo queda confirmado por produccion sirviendo el nuevo asset y la home actualizada.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit principal: `432aa83` (`Añade segundo escaparate a galeria visual`).
- Produccion `https://aplaudia.com`: OK, sirve la galeria actualizada y el nuevo WebP.
- Railway: despliegue efectivo confirmado por produccion; CLI sin sesion valida para listar deployments.

### Siguiente paso recomendado

Revisar en produccion desde movil real si la mezcla de escaparates, pantallas y edicion visual queda comercialmente equilibrada. Si Carlos quiere sumar una quinta o sexta pieza, anadirla en `content/visual-gallery.ts` y guardar el asset en `public/visuals/`.

## Actualización - Reequilibrio de la galería visual

### Objetivo

Corregir la descompensación visual de la galería: la imagen horizontal de la derecha quedaba demasiado pequeña y demasiado arriba, dejando un hueco negro amplio entre el escaparate superior y la imagen vertical inferior.

### Cambios aplicados

- `components/sections/visual-gallery.tsx`:
  - la imagen `real-motion-editing.webp` pasa de 3 a 4 columnas en escritorio;
  - se coloca en segunda fila, desplazada a la derecha;
  - sube dentro de esa segunda fila con margen negativo para ocupar mejor el hueco entre el escaparate y la imagen vertical inferior;
  - se mantiene el mismo asset, la animación, el hover y el apilado móvil.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está disponible como ejecutable del proyecto.
- QA local con `next start` en `http://127.0.0.1:3047`:
  - escritorio 1440x1000: imagen derecha más grande, colocada bajo el escaparate y desplazada a la derecha;
  - móvil 390x844: galería apilada correctamente, sin scroll horizontal.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit: `973f040` (`Reequilibra composicion de galeria visual`).
- Producción `https://aplaudia.com`: OK, sirve la composición actualizada.

### Siguiente paso recomendado

Revisar en producción si el equilibrio visual ya queda natural en el viewport real de Carlos.

## Actualización - Fecha diaria en aviso de construcción

### Objetivo

Hacer que la fecha del aviso flotante de construcción deje de estar fija en `30 junio 2026` y se actualice cada día con la fecha real mientras el cartel siga activo.

### Cambios aplicados

- `components/sections/construction-notice.tsx`:
  - calcula la fecha actual con `Intl.DateTimeFormat("es-ES")`;
  - fuerza zona horaria `Europe/Madrid`;
  - usa la fecha dinámica tanto en el aviso completo como en el estado minimizado;
  - refresca la fecha cada minuto para que cambie también si la web queda abierta al pasar la medianoche.
- `content/site.ts`:
  - `constructionNotice.dateLabel` queda como fallback inicial con `1 de julio de 2026`.
- `DECISIONS.md`, `PROJECT_STATE.md` y `NEXT_TASK.md`:
  - actualizados para documentar que la fecha visible ya es dinámica, no fija.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está disponible como ejecutable del proyecto.
- Comprobación directa de formato con Node: `1 de julio de 2026`.
- QA local con `next start` en `http://127.0.0.1:3046`:
  - el aviso muestra `1 DE JULIO DE 2026`;
  - no aparece `30 JUNIO 2026`;
  - el aviso de construcción sigue visible.
- QA producción en `https://aplaudia.com`:
  - la home contiene `1 de julio de 2026`;
  - la home ya no contiene `30 junio 2026`.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit: `2cc2c37` (`Actualiza fecha dinamica del aviso de construccion`).
- Producción `https://aplaudia.com`: OK, sirve la fecha nueva.

### Siguiente paso recomendado

Validar en producción que el cartel muestra la fecha del día actual en móvil y escritorio.

## Actualización - Galería visual con escaparate real

### Objetivo

Aplicar el ajuste visual pedido en la galería de imágenes generadas: quitar la imagen horizontal inferior suelta, dejar cuatro piezas, dar más protagonismo a la imagen central e incorporar el nuevo escaparate convertido a WebP.

### Cambios aplicados

- `components/sections/visual-gallery.tsx`:
  - la galería pasa de cinco a cuatro imágenes;
  - se elimina la pieza horizontal inferior;
  - se mantiene la animación de entrada y hover existente;
  - se reorganiza la composición de escritorio con una rejilla de 12 columnas;
  - quedan dos imágenes verticales y dos horizontales;
  - la imagen del escaparate queda como pieza horizontal central con más tamaño;
  - las piezas laterales se desplazan ligeramente hacia abajo para que la composición quede menos rígida.
- `public/visuals/escaparate-01.webp`:
  - se añade el WebP lossless generado desde `Escaparate_01.png`.
- `public/visuals/real-campaign-system.webp`:
  - eliminado porque era la imagen inferior descartada.
- `public/visuals/real-web-composition.webp`:
  - eliminado porque ha sido sustituido por el escaparate.

### Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está disponible como ejecutable del proyecto.
- QA local con `next start` en `http://127.0.0.1:3045`:
  - escritorio 1440x1000: cuatro imágenes visibles, escaparate presente, imagen inferior retirada, sin scroll horizontal;
  - móvil 390x844: cuatro imágenes apiladas correctamente, escaparate presente, sin scroll horizontal;
  - el aviso de construcción sigue visible.

### Estado

- Cambio local validado.
- Pendiente de commit, push y despliegue de Railway.

### Siguiente paso recomendado

Revisar en móvil real si el escaparate tiene el protagonismo adecuado. Si se ve demasiado panorámico, preparar una segunda versión recortada específica para la galería.

## Actualización - Segunda tanda de visuales generados más realistas

### Objetivo

Sustituir la primera prueba de imágenes generadas, que quedaba demasiado tecnológica/holográfica, por una propuesta más realista y comercial sin tocar el diseño, el layout ni las animaciones de la web.

### Feedback incorporado

- Las imágenes anteriores se percibían demasiado futuristas.
- La nueva dirección visual prioriza escenas reales de estudio, tienda, pantallas y material comercial.
- Se incluye una muestra clara de ropa sobre una persona vista en pantalla.
- Se evitan hologramas, interfaces imposibles y estética de ciencia ficción.

### Cambios aplicados

- `components/sections/visual-gallery.tsx`:
  - se sustituyen las cinco imágenes de la galería por escenas realistas de edición, web, vídeo, pantalla en tienda y sistema de campaña;
  - se actualizan textos alternativos para describir mejor cada imagen.
- `components/sections/about.tsx`:
  - se sustituye la imagen del bloque de estudio por una mesa de trabajo realista con portátil, cámara, muestras y material visual.
- `public/visuals/`:
  - añadidas imágenes WebP optimizadas:
    - `ai-image-enhancement-real.webp`;
    - `real-web-composition.webp`;
    - `real-motion-editing.webp`;
    - `retail-screen-clothing.webp`;
    - `real-campaign-system.webp`;
    - `aplaudia-studio-workspace-real.webp`.
  - eliminada la primera tanda de visuales generados por quedar demasiado tecnológica.

### Validaciones ejecutadas

- Generación realizada con la herramienta integrada de imagen de Codex (`image_gen`), en modo built-in.
- Imágenes revisadas visualmente antes de incorporarlas al repo.
- Conversión a WebP con `sharp`, manteniendo tamaños contenidos.
- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK desde `T:\20-PROYECTOS\APLAUDIA`.
- `npm run lint`: falla por deuda previa; `eslint` no está disponible como ejecutable del proyecto.
- `git diff --check`: OK; solo avisos de fin de línea CRLF/LF existentes en Windows.
- QA local con `next start` en `http://127.0.0.1:3044`:
  - home responde `200`;
  - escritorio 1365x900: imágenes cargan, sin scroll horizontal;
  - móvil 390x844: galería visible en su hueco, sin scroll horizontal;
  - no se modifica diseño, orden de secciones ni animaciones.
- QA producción en `https://aplaudia.com`:
  - home responde y referencia los assets nuevos;
  - la home ya no referencia los assets antiguos de la primera tanda;
  - el aviso de construcción sigue visible;
  - los seis assets nuevos responden `200`.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit de assets: `d4109d2` (`Sustituye visuales generados por versiones realistas`).
- Producción `https://aplaudia.com`: OK, sirve las imágenes nuevas.
- Railway: despliegue efectivo confirmado por producción sirviendo los assets nuevos.

### Siguiente paso recomendado

Revisar en producción desde móvil real si esta línea de imágenes encaja mejor. Si se quiere afinar más, generar una tercera tanda todavía más luminosa y menos oscura, manteniendo el mismo enfoque realista.

## Actualización - Rendimiento móvil, espaciado inicial y reglas del agente

### Objetivo

Ejecutar `NEXT_TASK.md`: mejorar rendimiento percibido en móvil sin eliminar animaciones, reducir ligeramente el espacio inicial entre secciones, subir un poco la legibilidad del chatbot y ajustar el agente para no hablar de precios salvo petición explícita.

### Causa probable detectada

- En móvil, `useLightweightMotion()` desactiva transformaciones pesadas, pero varios elementos críticos del hero seguían entrando con delays pensados para escritorio:
  - subtítulo: `1.2s`;
  - CTAs: `1.4s-1.6s`;
  - stack técnico: `1.8s-2s`;
  - indicador de scroll: `2.5s`.
- Además, durante la primera detección del modo móvil, Framer podía arrancar con opacidad inicial de escritorio en subtítulo y CTAs, dando sensación de contenido incompleto.
- Las dos primeras secciones posteriores usaban padding móvil amplio (`py-32`), aumentando la sensación de hueco entre bloques.

### Cambios aplicados

- `components/sections/hero.tsx`:
  - añadidos `entranceDelay()` y `entranceDuration()` para acortar delays en móvil/lightweight sin tocar la cadencia de escritorio;
  - subtítulo, CTA principal y CTA secundario quedan forzados a opacidad visible en móvil para evitar la sensación de carga rota;
  - no se elimina la animación general ni se cambia el diseño.
- `components/sections/scroll-story.tsx`:
  - padding móvil baja a `py-20`, con `sm:py-28` y `lg:py-40`;
  - margen bajo del titular baja en móvil;
  - delays de tarjetas y línea decorativa se acortan solo en `lightweightMotion`.
- `components/sections/whatsapp-demo.tsx`:
  - padding móvil baja a `py-20`, con `sm:py-28` y `lg:py-40`;
  - gap inicial baja en móvil;
  - mockup, mensajes, chips y beneficios reducen delays en móvil.
- `components/agent/aplaudia-agent-widget.tsx`:
  - fuente de mensajes sube a `text-base` en móvil y `16.5px` en escritorio;
  - se mantiene interlineado compacto, panel grande, micrófono, reset del input e indicador de más contenido.
- `content/agent/aplaudia-agent.md`:
  - regla explícita: no mencionar precios si el usuario no los pregunta;
  - precios solo ante preguntas de coste, precio, presupuesto, tarifa, cuánto cuesta, barato, económico, mínimo o desde cuánto;
  - nueva escala por fases para webs, productos y catálogos;
  - mantenimiento mensual reforzado como propuesta evolutiva;
  - mantenimiento avanzado ajustado a `desde 120-200 €/mes`;
  - si hay muchos productos y poco presupuesto, proponer fase 1 con productos destacados antes de saltar a una solución grande.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- `git diff --check`: pendiente antes del commit final.
- QA local con `next start` en `http://127.0.0.1:3043`:
  - home `200`;
  - móvil 360x780 a 700 ms: H1, subtítulo y CTA principal visibles con opacidad combinada 1; sin scroll horizontal;
  - móvil 390x844 a 700 ms: H1, subtítulo y CTA principal visibles con opacidad combinada 1; sin scroll horizontal;
  - móvil 430x932 a 700 ms: H1, subtítulo y CTA principal visibles con opacidad combinada 1; sin scroll horizontal;
  - escritorio 1280x800: sin scroll horizontal y mantiene cadencia visual de escritorio;
  - chatbot móvil 390x844: fuente de mensajes 16 px / 23.2 px, input se limpia al enviar y vuelve a 48 px;
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml`: OK en local.
- QA producción en `https://aplaudia.com`:
  - bundle final servido;
  - móvil 390x844 a 700 ms: H1, subtítulo y CTA principal visibles con opacidad combinada 1; sin scroll horizontal;
  - chatbot móvil 390x844: fuente de mensajes 16 px / 23.2 px, textarea vuelve a 48 px, valor vacío, botón enviar desactivado y pregunta solo como burbuja;
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml`: OK.
- Pruebas reales de `/api/agent` en producción:
  - `Quiero una web sencilla para mi negocio`: no da importes;
  - `¿Cuánto cuesta una web sencilla?`: da rango orientativo con `desde`;
  - `Tengo 50 productos pero quiero algo barato`: propone fase sencilla y ampliar por fases;
  - `Quiero un chatbot para mi web`: no da importes;
  - `¿Cuánto cuesta un chatbot?`: da rango orientativo con `desde`;
  - `No tengo mucho presupuesto`: propone versión sencilla y fases, sin saltar a una opción grande.

### Estado

- Cambio local validado.
- Commit principal: `5c7698c` (`Improve mobile perception and agent pricing rules`).
- Producción `https://aplaudia.com`: OK, sirve la versión final.
- Railway: despliegue efectivo confirmado por producción sirviendo bundle final y API actualizada.

### Siguiente paso recomendado

Validar en producción las preguntas reales de precios/no precios y confirmar desde móvil real que el contenido inicial ya no parece aparecer tarde.

## Actualización urgente - Reset inmediato del textarea del chatbot

### Objetivo

Al enviar una pregunta en el chatbot, el textarea debe vaciarse inmediatamente y volver a su altura mínima. La pregunta debe quedar solo como burbuja en el historial, sin permanecer duplicada en el editor.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - se añade `resetInput()` como rutina única de limpieza del textarea;
  - al enviar, primero se captura el texto y después se limpia el campo antes de esperar a `/api/agent`;
  - el textarea queda con `value=""`, `scrollTop=0` y sin altura inline;
  - el estado `hasText` vuelve a `false` inmediatamente;
  - `voiceBaseTextRef` se limpia para que el dictado no reutilice texto enviado;
  - se mantiene la pregunta como burbuja de usuario en el historial;
  - no se toca el diseño visual, el panel grande, el micrófono, el envío ni la lógica del indicador de lectura.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- QA local con `next start` en `http://127.0.0.1:3042` y viewport móvil 390x844:
  - antes de enviar texto multilínea: textarea 96 px de alto, valor presente;
  - 80 ms después del envío: textarea vacío, altura 48 px, sin altura inline y botón enviar desactivado;
  - la pregunta aparece una sola vez como burbuja de usuario;
  - tras comenzar la respuesta del asistente, el textarea sigue vacío y a 48 px;
  - sin scroll horizontal.
- QA producción en `https://aplaudia.com` con viewport móvil 390x844:
  - bundle final servido con la rutina de reset;
  - antes de enviar texto multilínea: textarea 96 px de alto, valor presente;
  - 100 ms después del envío: textarea vacío, altura 48 px, sin altura inline y botón enviar desactivado;
  - la pregunta aparece una sola vez como burbuja de usuario;
  - tras comenzar la respuesta del asistente, el textarea sigue vacío y a 48 px;
  - el asistente responde correctamente;
  - sin scroll horizontal.

### Estado

- Cambio local validado.
- Commit principal: `2a27114` (`Reset chatbot input on send`).
- Producción `https://aplaudia.com`: OK, sirve la versión final.
- Railway: despliegue efectivo confirmado por producción sirviendo el bundle final.

### Siguiente paso recomendado

Probar desde móvil real con teclado abierto: escribir varias líneas, enviar y confirmar que el campo vuelve a mínimo sin dejar la pregunta duplicada en el editor.

## Actualización urgente - Espacio superior del hero en móvil

### Objetivo

Carlos detecta en móvil que hay demasiado espacio vacío desde la cabecera hasta el primer texto grande de la home. Se corrige solo el espaciado vertical inicial del hero en móvil, sin rediseñar la web ni cambiar contenido.

### Cambios aplicados

- `components/sections/hero.tsx`:
  - en móvil, el hero deja de usar centrado vertical dentro de `110vh`;
  - el alto móvil pasa a `min-h-[100svh]` para respetar mejor la altura útil real del navegador móvil;
  - el contenido principal del hero pasa a arrancar arriba (`items-start`) con padding móvil más contenido;
  - el padding superior interno móvil queda en `pt-8` para reducir el hueco inicial sin compactar escritorio;
  - el margen bajo el subtítulo queda en `mb-6 sm:mb-12` para evitar roces entre CTAs y aviso flotante en móviles pequeños;
  - desde `sm` en adelante se mantiene el comportamiento anterior (`sm:min-h-[110vh]` y `sm:items-center`);
  - no se tocan textos, animaciones, orden de secciones, CTAs, chatbot ni aviso de construcción.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- `git diff --check`: OK.
- QA local con `next start` en `http://127.0.0.1:3041`:
  - home responde `200`;
  - móvil 360x780: badge top 112 px, H1 top 182 px, subtítulo visible, CTAs visibles, aviso sin solapar CTAs y sin scroll horizontal;
  - móvil 390x844: badge top 112 px, H1 top 182 px, subtítulo visible, CTAs visibles, aviso sin solapar CTAs y sin scroll horizontal;
  - escritorio 1280x800: se conserva la composición amplia original y sin scroll horizontal.
- QA producción en `https://aplaudia.com`:
  - HTML final servido con `pt-8` y `mb-6 sm:mb-12`;
  - móvil 360x780: badge top 112 px, H1 top 182 px, subtítulo visible, CTAs visibles, aviso sin solapar CTAs y sin scroll horizontal;
  - móvil 390x844: badge top 112 px, H1 top 182 px, subtítulo visible, CTAs visibles, aviso sin solapar CTAs y sin scroll horizontal;
  - escritorio 1280x800: composición amplia conservada y sin scroll horizontal;
  - aviso de construcción visible.

### Estado

- Cambio local validado.
- Commit principal: `f58a15d` (`Tighten mobile hero spacing`).
- Commit de refinamiento: `1cf22c1` (`Refine mobile hero spacing`).
- Producción `https://aplaudia.com`: OK, sirve la versión final.
- Railway: despliegue efectivo confirmado por producción sirviendo el HTML final.

### Siguiente paso recomendado

Revisar la home desde móvil real tras el despliegue y confirmar si el nuevo equilibrio del hero se siente más serio y compacto sin perder aire visual.

## Actualización urgente - Lectura de respuestas largas del chatbot

### Objetivo

Evitar que el chatbot salte al final cuando recibe una respuesta larga. La pregunta del usuario debe quedar visible arriba del área de mensajes y la respuesta debe empezar justo debajo, con un indicador sutil si queda más contenido hacia abajo.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - se elimina el auto-scroll global al final basado en `bottomRef`;
  - se añade `messagesViewportRef` para controlar el área real de scroll interno;
  - al enviar, se guarda el índice del mensaje del usuario que inicia la respuesta;
  - al pintar la respuesta, el scroll se ancla a ese mensaje de usuario;
  - la respuesta larga empieza debajo de la pregunta, sin saltar al final;
  - se mantiene el comportamiento normal en respuestas cortas;
  - se añade indicador flotante superpuesto abajo a la derecha dentro del área de mensajes;
  - el indicador aparece solo si queda contenido por leer hacia abajo;
  - el indicador desaparece al llegar al final;
  - el indicador permite avanzar por la respuesta sin ocupar espacio ni empujar layout;
  - se mantiene panel grande, micrófono, envío normal y scroll manual.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- `npx tsc --noEmit`: falla por deuda previa ya conocida:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineación antigua de mensajes `about` en `i18n/provider.tsx`.
- QA local con agente falso compatible con `/api/agent`:
  - respuesta larga móvil 390x844:
    - pregunta visible arriba: top 66 px con viewport de mensajes desde top 64 px;
    - respuesta empieza debajo: top 137 px;
    - no salta al final: queda contenido pendiente (`remaining` 3195 px);
    - indicador visible mientras hay más contenido;
    - indicador desaparece al llegar al final (`remaining` 0);
    - sin scroll horizontal;
    - sin errores de consola.
  - respuesta corta móvil 390x844:
    - respuesta recibida correctamente;
    - sin indicador porque no queda contenido por leer;
    - sin scroll horizontal;
    - sin errores de consola.
  - respuesta larga escritorio 1280x800:
    - pregunta visible arriba;
    - respuesta empieza debajo;
    - indicador visible al quedar contenido pendiente;
    - sin scroll horizontal;
    - sin errores de consola.

### Estado

- Cambio local validado.
- Commit principal: `5dff1e3` (`Improve chatbot long reply reading`).
- Push a `main`: OK.
- Producción `https://aplaudia.com`: OK.
- Browser QA producción móvil 390x844 con respuesta larga real:
  - respuesta del agente: 2563 caracteres;
  - pregunta visible arriba: top 66 px;
  - respuesta empieza debajo: top 182 px;
  - no salta al final: `remaining` 1464 px tras recibir la respuesta;
  - indicador visible mientras queda contenido hacia abajo;
  - indicador desaparece al llegar al final (`remaining` 0);
  - sin scroll horizontal;
  - sin errores graves en consola.
- Browser QA producción móvil 390x844 con respuesta corta real:
  - respuesta del agente: 153 caracteres;
  - indicador no visible;
  - sin scroll horizontal;
  - sin errores graves en consola.

### Siguiente paso recomendado

Probar una conversación real larga en `https://aplaudia.com` tras despliegue y confirmar desde móvil real que el indicador se percibe sutil y útil.

## Actualización urgente - Chatbot casi pantalla completa

### Objetivo

Carlos pide optimizar al máximo el espacio útil del chatbot abierto: panel casi a pantalla completa, sin X flotante redundante, sin columna vacía por icono lateral, texto algo mayor y con interlineado más compacto.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - el panel abierto pasa a estructura de panel/modal grande con `fixed`, `top/bottom/left/right`, `flex-col` y área de mensajes `flex-1`;
  - móvil usa margen mínimo (`inset-x-1.5`, `top-1.5`, `bottom-1.5`);
  - escritorio deja de usar `sm:w-[390px]` y pasa a panel amplio (`lg:inset-x-[8vw]`, `xl:inset-x-[10vw]`);
  - se elimina el límite `sm:max-h-[390px]` del área de mensajes;
  - el botón flotante inferior solo existe cuando el chat está cerrado;
  - al abrir, el cierre queda únicamente en la X superior del panel;
  - el panel se desmonta al cerrar para no dejar foco ni cierre fantasma en el DOM;
  - se elimina el icono lateral externo de los mensajes del asistente;
  - la burbuja del asistente usa `w-full max-w-full`, recuperando el ancho útil;
  - las burbujas de usuario suben a `max-w-[94%]` en móvil y `sm:max-w-[88%]`;
  - texto de mensajes ajustado a `15.5px` en móvil y `16px` en pantallas `sm`, con `leading-[1.45]`;
  - input inferior mantiene textarea, micrófono y enviar con botones de `48px`;
  - no se toca `/api/agent`, `OPENAI_API_KEY`, formulario de contacto ni `content/agent/aplaudia-agent.md`.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- Browser QA local responsive:
  - 360x780: panel 333 x 768 px; mensajes 640 px de alto; sin scroll horizontal;
  - 390x844: panel 363 x 832 px; mensajes 704 px de alto; sin scroll horizontal;
  - 430x932: panel 403 x 920 px; mensajes 792 px de alto; sin scroll horizontal;
  - 768x1024: panel 705 x 976 px; mensajes 836 px de alto; sin scroll horizontal;
  - 1280x800: panel 1009 x 752 px; mensajes 612 px de alto; sin scroll horizontal.
- Confirmaciones de UI:
  - botón flotante cerrado visible: OK;
  - botón flotante como X al abrir: eliminado;
  - X superior del panel: OK;
  - al cerrar con X superior vuelve el botón flotante: OK;
  - panel desmontado al cerrar: OK;
  - iconos laterales en mensajes del asistente: 0;
  - mensaje de bienvenida ocupa el ancho útil de la burbuja;
  - texto de mensajes: 15.5 px / 22.475 px en móvil y 16 px / 23.2 px en escritorio;
  - botones micrófono/enviar: 48 x 48 px;
  - textarea cómodo y sin solapes.
- Envío escrito local:
  - mensaje enviado: OK;
  - textarea se limpia: OK;
  - respuesta del agente/fallback local: OK;
  - sin errores graves en consola.
- Micrófono:
  - botón visible y sin solape: OK;
  - pulsación del micrófono en navegador de prueba: no rompe UI y no genera errores de consola;
  - audio real no validado porque requiere permiso de micrófono y voz real en el dispositivo del usuario.

### Estado

- Cambio local validado.
- Commit principal: `e4b5bb0` (`Expand chatbot workspace`).
- Push a `main`: OK.
- Producción `https://aplaudia.com`: OK.
- Browser QA producción móvil 390x844:
  - panel abierto: 363 x 832 px;
  - área de mensajes: 704 px de alto;
  - mensaje de bienvenida: 341 px de ancho;
  - texto: 15.5 px / 22.475 px;
  - sin iconos laterales en mensajes;
  - sin X flotante redundante;
  - sin scroll horizontal;
  - sin errores graves en consola.
- Browser QA producción escritorio 1280x800:
  - panel abierto: 1009 x 752 px;
  - área de mensajes: 612 px de alto;
  - mensaje de bienvenida: 975 px de ancho;
  - texto: 16 px / 23.2 px;
  - sin X flotante redundante;
  - sin scroll horizontal;
  - sin errores graves en consola.

### Siguiente paso recomendado

Revisar en móvil real `https://aplaudia.com` tras despliegue. Si Carlos quiere aún más densidad, el siguiente ajuste sería acortar el saludo inicial o activar un modo específico cuando el teclado móvil esté abierto.

## Actualización urgente - Chatbot móvil

### Objetivo

Carlos detecta que el chatbot abierto en móvil tiene demasiado texto acumulado, obliga a leer con poco espacio y la letra se percibe pequeña. Se aplica un ajuste de usabilidad sin rediseñar la web.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - el panel abierto en móvil pasa a ocupar casi toda la altura útil (`h-[calc(100dvh-7rem)]`) y baja su margen inferior a `bottom-24`;
  - los márgenes laterales del panel en móvil bajan a `left-2 right-2` para ganar anchura real;
  - el área de mensajes mantiene scroll interno, con más espacio vertical disponible;
  - las burbujas de mensaje en móvil pasan a `text-base leading-7`;
  - el textarea mantiene `text-base` en móvil y sube a `min-h-12`;
  - los botones de micrófono y enviar pasan a `48px` en móvil;
  - el botón flotante del chat baja a `bottom-4` en móvil para dejar más altura al panel abierto;
  - escritorio conserva el comportamiento compacto (`sm:w-[390px]`, `sm:text-sm`, `sm:h-auto`).

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- Browser QA local móvil 390x844:
  - panel abierto: 704 px de alto;
  - área de mensajes: 568 px de alto;
  - mensaje: 16 px / 28 px de línea;
  - textarea: 16 px / 24 px de línea;
  - botones micrófono/enviar: 48 x 48 px;
  - sin scroll horizontal;
  - sin solapes entre textarea, micrófono y enviar.
- Browser QA local escritorio 1280x800:
  - panel compacto a la derecha: 390 px de ancho y 318 px de alto;
  - texto de mensajes en escritorio se mantiene a 14 px;
  - sin scroll horizontal.

### Estado

- Cambio local validado.
- Commit principal: `0278890` (`Improve mobile chatbot readability`).
- Push a `main`: OK.
- Producción `https://aplaudia.com`: OK, ya sirve las clases nuevas del chatbot móvil.
- Browser QA producción móvil 390x844:
  - panel abierto: 704 px de alto;
  - mensaje: 16 px / 28 px de línea;
  - textarea: 16 px / 24 px de línea;
  - botones micrófono/enviar: 48 x 48 px;
  - sin scroll horizontal;
  - sin solapes;
  - aviso de construcción visible en la esquina inferior izquierda.

### Siguiente paso recomendado

Revisar el chatbot abierto desde un móvil real en `https://aplaudia.com`. Si Carlos aún lo nota pequeño, el siguiente ajuste recomendado sería modo casi pantalla completa en móvil o acortar el saludo inicial del agente.

## Objetivo de la tarea

Seguimiento urgente tras la validación móvil de Carlos: el dictado por voz estaba desplegado, pero el botón se ocultaba cuando el navegador no exponía `SpeechRecognition` / `webkitSpeechRecognition`. Se ajusta el chatbot para que el micrófono sea visible también en móviles sin soporte y muestre un aviso discreto.

Tarea original: añadir dictado por voz al chatbot de Aplaudia tomando como referencia técnica el chat de Arik Custom, y ampliar `content/agent/aplaudia-agent.md` con instrucciones claras sobre identidad, servicios, casos reales y precios orientativos.

## Referencia revisada

- Repo local de referencia: `T:\20-PROYECTOS\ARIKCUSTOM\HTML`.
- Archivo localizado: `components/chat/chat-widget.tsx`.
- Lógica útil detectada:
  - detección de `SpeechRecognition` / `webkitSpeechRecognition`;
  - estado `isListening`;
  - `interimResults = true`;
  - idioma `es-ES`;
  - botón `Mic` / `MicOff`;
  - placeholder `Escuchando...`;
  - parada al cerrar el chat;
  - limpieza al desmontar el componente.

## Cambios aplicados

### Chatbot

- `components/agent/aplaudia-agent-widget.tsx`:
  - añadido botón de micrófono junto al textarea;
  - añadido estado activo/inactivo con `aria-pressed`;
  - añadido `aria-label` claro:
    - `Dictar mensaje por voz`;
    - `Parar dictado por voz`;
  - añadido mensaje discreto `Escuchando...`;
  - transcripción parcial al textarea con Web Speech API;
  - idioma fijado a `es-ES`;
  - parada del reconocimiento al cerrar el widget;
  - parada del reconocimiento al enviar mensaje;
  - limpieza del reconocimiento al desmontar;
  - fallback inicial: si el navegador no soportaba Web Speech API, el botón de micrófono no se mostraba;
  - corrección posterior: el botón de micrófono queda visible aunque no haya soporte y muestra el aviso `El dictado por voz no está disponible en este navegador.` al tocarlo.

### Instrucciones del agente

- `content/agent/aplaudia-agent.md` reestructurado con secciones editables:
  - identidad;
  - qué hace Aplaudia;
  - casos reales;
  - precios orientativos;
  - cómo hablar de precios;
  - cómo orientar al usuario;
  - qué no debe decir;
  - cierre recomendado.
- Se añadieron precios orientativos siempre con `desde`.
- Se reforzó que no debe inventar precios cerrados, plazos, garantías, clientes, dirección física, CIF ni datos legales.
- Se añadió criterio comercial para hablar de proyectos escalables según presupuesto.
- Tras una prueba real en producción, se reforzó una regla adicional:
  - si el usuario pregunta si Aplaudia programa o construye "con IA", el agente no debe explicar herramientas internas ni metodología;
  - debe redirigir a estrategia, diseño, desarrollo, revisión humana, resultado y siguiente paso.

### Documentación

- `README.md` documenta el dictado por voz del chatbot.
- `PROJECT_STATE.md` registra el nuevo dictado por voz y la ampliación del prompt del agente.
- `DECISIONS.md` registraba entonces la fecha visible `30 junio 2026`; esa decisión queda reemplazada el 2026-07-01 por fecha diaria dinámica.

## Archivos modificados

- `README.md`
- `PROJECT_STATE.md`
- `DECISIONS.md`
- `NEXT_TASK.md`
- `LAST_REPORT.md`
- `components/agent/aplaudia-agent-widget.tsx`
- `content/agent/aplaudia-agent.md`

## Validaciones ejecutadas

- Seguimiento móvil tras aviso de Carlos:
  - causa confirmada: el botón estaba desplegado, pero se ocultaba si el navegador móvil no exponía Web Speech API;
  - corrección aplicada: el botón de micrófono queda visible siempre junto al textarea;
  - si no hay soporte, al tocarlo muestra el aviso discreto `El dictado por voz no está disponible en este navegador.`;
  - QA local móvil 390x844: micrófono visible, enviar visible, textarea visible, sin solape y sin scroll horizontal.
  - Producción `https://aplaudia.com` tras el push `44f1ae4`: HTML nuevo servido y QA móvil 390x844 OK; micrófono visible, enviar visible, textarea visible, sin solapes y sin scroll horizontal.
- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- `npx tsc --noEmit`: falla por deuda previa ya conocida:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineación antigua de mensajes `about` en `i18n/provider.tsx`.
- `git diff --check`: OK.
- QA local con `next start` en `http://127.0.0.1:3036`:
  - home `200`;
  - escritorio 1280x800: chatbot abre, micrófono visible, enviar visible, textarea visible, sin scroll horizontal;
  - móvil 390x844: micrófono visible, enviar visible, textarea visible, sin solape entre micrófono, enviar y textarea, sin scroll horizontal;
  - envío escrito: OK;
  - sin `OPENAI_API_KEY` local, `/api/agent` devuelve fallback controlado.
- API de producción tras el primer push:
  - pregunta de precios de web comercial y agente IA: OK, respondió con precios orientativos `desde 1.500 €` y `desde 500 €`;
  - pregunta directa sobre si se programa con IA: detectó una respuesta mejorable porque explicaba proceso interno;
  - prompt corregido para bloquear esa explicación interna y redirigir al valor del servicio.
- API de producción tras el segundo push:
  - pregunta directa `¿Programáis la web con IA?`: OK, ya no explica herramientas internas ni metodología;
  - pregunta de precios: OK, mantiene importes orientativos con `desde`;
  - `/api/agent` responde con `provider:"openai"` y `unavailable:false`.
- Browser QA producción escritorio 1280x800:
  - chatbot abre;
  - micrófono visible con `aria-label="Dictar mensaje por voz"`;
  - botón enviar visible;
  - textarea visible;
  - sin scroll horizontal.
- Browser QA producción móvil 390x844:
  - micrófono visible;
  - botón enviar visible;
  - textarea visible;
  - sin solape entre micrófono, enviar y textarea;
  - sin scroll horizontal.

## Validaciones pendientes o limitadas

- Dictado con audio real: requiere aceptar permiso de micrófono y hablar desde el navegador del usuario. No se aceptó permiso de micrófono desde Codex.
- iOS/Safari: Web Speech API puede no estar disponible o comportarse de forma limitada; el botón queda oculto si el navegador no expone `SpeechRecognition` / `webkitSpeechRecognition`.
- Corrección aplicada después de la prueba móvil de Carlos: en navegadores sin soporte, el botón ya no se oculta; queda visible y avisa al tocarlo.
- Railway CLI sigue sin sesión válida (`invalid_grant` / `Unauthorized`), pero producción en `https://aplaudia.com` sirve el cambio desplegado.

## Estado final esperado

- Chatbot conserva posición y diseño general.
- Micrófono añadido sin rediseñar la web.
- Chatbot sigue funcionando escribiendo.
- Agente sigue leyendo `content/agent/aplaudia-agent.md` desde `/api/agent`.
- No se han guardado secretos.

## Siguiente paso recomendado

1. Probar dictado real en `https://aplaudia.com` con permiso de micrófono desde Chrome/Edge.
2. Probar manualmente en móvil real Android.
3. Probar manualmente en iPhone/Safari y confirmar si el navegador muestra u oculta el botón.
4. Revisar varias respuestas reales del agente sobre precios, WhatsApp y casos.
5. Continuar con Resend y legal:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`;
   - privacidad, cookies y consentimiento definitivo.
# LAST_REPORT - 2026-06-30 - Prueba de imágenes generadas para huecos visuales

## Objetivo

Probar una primera tanda de imágenes generadas para las zonas de Aplaudia que seguían preparadas con huecos visuales o recursos abstractos, sin rediseñar la web.

## Cambios aplicados

- Se generaron seis imágenes con el flujo integrado de imagegen:
  - mejora de imagen/producto con estética antes/después;
  - composición web por capas;
  - objeto visual para animaciones/loops;
  - pantalla comercial vertical;
  - sistema visual aplicado a dispositivos y soportes;
  - escena de estudio digital para la sección About.
- Se copiaron y optimizaron como `.webp` en `public/visuals/`.
- Se sustituyeron los bloques abstractos de `VisualGallery` por imágenes full-bleed manteniendo el mismo grid, animaciones y orden.
- Se sustituyó el placeholder textual de la sección About por una escena de estudio realista.
- No se tocaron textos comerciales, orden de secciones, formularios, chatbot, dominio, DNS ni backend.

## Archivos modificados

- `components/sections/visual-gallery.tsx`
- `components/sections/about.tsx`
- `public/visuals/ai-image-enhancement.webp`
- `public/visuals/web-composition-layers.webp`
- `public/visuals/motion-loop-cube.webp`
- `public/visuals/commercial-screen-content.webp`
- `public/visuals/campaign-system-devices.webp`
- `public/visuals/aplaudia-studio-workspace.webp`
- `LAST_REPORT.md`

## Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: falla porque `eslint` no está disponible como ejecutable local.
- QA local con `npx next dev --webpack -p 3102`:
  - home carga en `http://localhost:3102`;
  - 6 imágenes servidas desde `/visuals/`;
  - escritorio 1440x1000: galería visual carga completa, sin overflow horizontal;
  - escritorio 1440x1000: About carga la imagen de estudio, sin overflow horizontal;
  - móvil 390x844: galería visual carga completa, sin overflow horizontal;
  - móvil 390x844: About carga correctamente, sin overflow horizontal;
  - consola del navegador sin errores ni warnings graves.

## Estado final

- Primera propuesta visual generada e integrada.
- Las imágenes son ligeras para web: aproximadamente 40-82 KB cada una.
- La web conserva el aviso de construcción.
- No se han guardado secretos.

## Siguiente paso recomendado

1. Revisar visualmente en producción o preview si esta dirección encaja con el gusto de Carlos.
2. Si alguna pieza parece demasiado abstracta, generar variantes más concretas por sector: restaurante, tienda, profesional independiente, clínica, marca local o evento.
3. Si se aprueban, crear una pequeña fuente de contenido para estos assets en vez de dejarlos definidos dentro del componente.

# LAST_REPORT - 2026-06-30 - Motor reutilizable de chatbot

## Objetivo

Convertir el chatbot actual de Aplaudia en un patrón reutilizable y dejar Aplaudia preparada como base para adaptar el mismo motor a otras webs, empezando por Arik Custom.

## Cambios aplicados

- Se extrajo el widget monolítico a `components/agent/generic-agent-widget.tsx`.
- `components/agent/aplaudia-agent-widget.tsx` queda como wrapper de configuración específica de Aplaudia.
- Se añadieron helpers reutilizables:
  - `lib/agent/types.ts`;
  - `lib/agent/build-agent-prompt.ts`;
  - `lib/agent/read-agent-instructions.ts`.
- `app/api/agent/route.ts` ahora reutiliza `readAgentInstructions()` y `buildAgentPrompt()` manteniendo el archivo editable `content/agent/aplaudia-agent.md`.
- Se mantiene el comportamiento actual:
  - panel grande casi a pantalla completa;
  - X superior;
  - sin X flotante redundante al abrir;
  - mensajes a ancho completo para asistente;
  - scroll inteligente;
  - indicador flotante de más contenido;
  - textarea que se limpia al enviar y vuelve a altura mínima;
  - micrófono con `SpeechRecognition` / `webkitSpeechRecognition`;
  - fallback si no hay soporte de voz;
  - llamada server-side a OpenAI con `OPENAI_API_KEY`;
  - fallback si falta la API key.

## Archivos modificados

- `app/api/agent/route.ts`
- `components/agent/aplaudia-agent-widget.tsx`
- `components/agent/generic-agent-widget.tsx`
- `lib/agent/types.ts`
- `lib/agent/build-agent-prompt.ts`
- `lib/agent/read-agent-instructions.ts`
- `LAST_REPORT.md`

## Variables de entorno

- `OPENAI_API_KEY`: debe configurarse en Railway o en el entorno del despliegue; no se guarda en Git.
- `OPENAI_AGENT_MODEL`: opcional, permite cambiar el modelo sin tocar código.
- `APLAUDIA_AGENT_API_URL` y `APLAUDIA_AGENT_API_SECRET`: se conservan como fallback legado si existieran en entorno.

## Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK desde `T:\20-PROYECTOS\APLAUDIA`.
- `npm run lint`: falla porque `eslint` no está disponible como binario local.
- `npx tsc --noEmit`: falla por deuda previa no relacionada:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineación antigua de traducciones `about` en `i18n/provider.tsx`.
- QA local con `npx next dev --webpack -p 3101`:
  - home carga en `http://localhost:3101`;
  - aviso de construcción visible en formato completo o compacto;
  - chatbot abre y cierra en escritorio;
  - envío escrito OK;
  - textarea queda vacío y vuelve a altura mínima tras enviar;
  - fallback sin `OPENAI_API_KEY` OK;
  - móvil 390x844: panel casi completo, X superior, sin botón flotante duplicado, textarea a 16px y altura mínima.

## Validaciones limitadas

- Dictado con audio real no se ejecutó porque requiere aceptar permiso de micrófono desde el navegador del usuario.
- Respuesta larga real no se pudo validar localmente porque el entorno local no tenía `OPENAI_API_KEY` y devolvió fallback corto; el comportamiento de scroll largo queda cubierto por el motor extraído del widget ya probado.
- `npm run dev` con Turbopack falló por mezcla de ruta UNC/unidad `T:` al evaluar CSS; se validó con webpack, igual que el build del proyecto.

## Estado final

- Aplaudia conserva su comportamiento y diseño del chatbot.
- El motor reusable queda preparado para copiar/adaptar a otras webs.
- No se han guardado secretos.
- No se han tocado DNS, dominios, backend adicional, base de datos, auth ni pagos.

## Siguiente paso recomendado

1. Configurar o confirmar `OPENAI_API_KEY` en el entorno final donde deba responder el asistente.
2. Probar una respuesta larga real en producción con API key activa.
3. Probar dictado real desde Chrome/Edge móvil aceptando permiso de micrófono.
