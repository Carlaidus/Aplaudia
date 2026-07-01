# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Actualizar el conocimiento comercial del chatbot de Aplaudia con la última decisión interna de precios/mantenimiento, reforzar que no muestre precios salvo pregunta directa, y crear un flujo de solicitud de presupuesto desde el chatbot con envío por email.

## Estado actual

- Chatbot validado en escritorio y móvil:
  - escritorio con burbujas a `17px`;
  - móvil con burbujas a `16px`;
  - textarea limpio al enviar con botón;
  - textarea limpio al enviar con Enter;
  - textarea vuelve a altura mínima de 48px;
  - la pregunta queda solo como burbuja en el historial.
- Agente actualizado:
  - no debe hablar de precios si no se preguntan explícitamente;
  - si habla de precios, debe indicar importes orientativos sin IVA;
  - mantenimiento se explica como servicio mensual, normalmente con pago anual;
  - `/api/agent` lee `content/agent/aplaudia-agent.md` completo como fuente principal.
- Producción `https://aplaudia.com` validada.
- Carlos confirma que en la web pública NO quiere mostrar precios por ahora. Los precios son internos y para que el chatbot pueda orientar solo si preguntan directamente.
- Email interno provisional para solicitudes: `carlosvfx@gmail.com`.

## Tarea 1: actualizar conocimiento comercial del agente

Revisar y actualizar `content/agent/aplaudia-agent.md`.

Reglas obligatorias:

1. En la web pública no se muestran precios.
2. El chatbot tampoco debe sacar precios salvo que el usuario pregunte muy directamente por precio, coste, presupuesto, tarifa, mensualidad, mantenimiento o similar.
3. Si el usuario no pregunta por precio, orientar servicio, hacer preguntas útiles y llevar a contacto/WhatsApp/formulario, sin importes.
4. Si el usuario pregunta por precio:
   - usar siempre `desde`;
   - decir que son importes orientativos;
   - decir que son sin IVA;
   - explicar que el precio final depende del alcance;
   - recomendar hablar con Aplaudia para cerrar propuesta.
5. Mantener claridad sobre la diferencia entre Aplaudia y un builder/hosting con IA.
6. El agente debe saber explicar mantenimiento, creación de webs, agentes IA y visuales según las decisiones actuales.

## Tarea 2: precios internos vigentes para el agente

Actualizar la sección de precios de `content/agent/aplaudia-agent.md` con esta versión vigente.

### Creación de webs

- Landing o web muy sencilla: desde 390 €.
- Web sencilla con pocos productos destacados: desde 500–800 €.
- Catálogo básico o listado simple sin panel avanzado: desde 650–950 €.
- Catálogo más trabajado sin panel avanzado: desde 950–1.500 €.
- Web comercial personalizada: desde 1.500 €.
- Catálogo con panel simple para editar contenido: desde 1.500–2.300 €.
- Catálogo con filtros, fichas completas, buscador, panel y carga inicial amplia: desde 2.300 €.
- Reservas, automatizaciones, dashboards, paneles avanzados o funciones tipo aplicación: presupuesto a medida.

Regla comercial:

- Si el cliente quiere algo económico, proponer fase 1 sencilla, productos destacados o una versión inicial que pueda crecer.
- No saltar directamente a la opción completa.

### Mantenimiento mensual

- Esencial: desde 29 €/mes, pago anual 348 €/año + IVA.
- Activo: desde 59 €/mes, pago anual 708 €/año + IVA.
- Evolución: desde 119 €/mes, pago anual 1.428 €/año + IVA.
- A medida: desde 199 €/mes, pago anual desde 2.388 €/año + IVA.

Cómo explicarlo:

- Servicio mensual con pago anual.
- Importes sin IVA.
- Incluye soporte, revisión y pequeños ajustes según el plan.
- Nuevas funcionalidades, cambios grandes o trabajos fuera del alcance se presupuestan aparte.
- No publicar horas/minutos exactos en la respuesta salvo que Carlos lo pida más adelante.
- No prometer cambios ilimitados.

### Agentes IA y visuales

- Agente IA para web: desde 500 €.
- Integración adicional con WhatsApp: desde +100 €.
- Imágenes IA sencillas: desde 25–40 € por imagen.
- Imagen trabajada, composición o dirección visual: desde 80–150 €.
- Pack visual para web, marca o campaña: desde 250–500 €.
- Vídeo corto con IA: desde 150–300 €.
- Vídeo con rodaje/foto real, edición y mezcla con IA: desde 500 € en adelante o presupuesto a medida.

## Tarea 3: argumento frente a builders/hosting con IA

Añadir al `.md` una sección clara para que el chatbot sepa responder si un usuario compara Aplaudia con Wix, Hostinger, un builder con IA o similares.

Idea principal:

`Un builder con IA puede servir para crear una web básica de forma rápida. Aplaudia no solo genera una página: piensa la estructura, adapta el diseño al negocio, prepara textos y visuales, integra formularios o agentes IA y puede acompañar después con mantenimiento y mejoras.`

Comparativa que debe conocer el agente:

- Builder/hosting con IA: genera una web rápida.
- Aplaudia: ayuda a decidir qué web necesita el negocio.
- Builder/hosting con IA: usa patrones o plantillas genéricas.
- Aplaudia: adapta estructura, textos y visuales al negocio.
- Builder/hosting con IA: el cliente tiene que saber qué poner.
- Aplaudia: guía el enfoque y prioriza lo importante.
- Builder/hosting con IA: normalmente es autoservicio.
- Aplaudia: ofrece acompañamiento humano.
- Builder/hosting con IA: se queda en web básica.
- Aplaudia: puede crecer con catálogo, panel, reservas, agente IA o visuales.

## Tarea 4: flujo de solicitud de presupuesto desde el chatbot

Objetivo: cuando el chatbot detecte que una persona está interesada, puede ofrecer preparar una solicitud/presupuesto orientativo.

Debe haber dos salidas posibles:

1. Email interno a Aplaudia.
2. Copia limpia para el cliente solo si el cliente la pide o deja su email para recibirla.

Email interno provisional:

- `carlosvfx@gmail.com`

Importante de privacidad/transparencia:

- No ocultar al usuario que sus datos se usan para responder a su solicitud.
- Antes de enviar datos, mostrar un texto breve de consentimiento/privacidad.
- El usuario debe saber que la solicitud se enviará a Aplaudia para poder responderle.
- La copia para el cliente puede ser limpia y sin notas internas, pero la recogida/envío de datos debe estar informada.

## Tarea 5: contenido del email interno

El email interno para Aplaudia debe incluir una plantilla clara y bonita con:

- nombre del cliente;
- email del cliente;
- teléfono si lo deja;
- tipo de negocio si se ha mencionado;
- tipo de proyecto;
- servicios de interés;
- resumen breve de la conversación;
- dudas principales;
- si ha preguntado mucho por precios;
- nivel de interés aproximado;
- presupuesto orientativo mencionado o rango comentado;
- nota de que los precios son orientativos y sin IVA;
- fecha/hora;
- canal: chatbot web Aplaudia.

No hacerlo larguísimo: resumen útil, comercial y claro.

## Tarea 6: contenido de la copia para el cliente

Si el cliente pide copia:

- enviar una versión limpia de la solicitud o presupuesto orientativo;
- sin notas internas comerciales;
- sin evaluación de interés;
- sin resumen oculto;
- con importes orientativos sin IVA;
- con aviso de que hay que hablar con Aplaudia para cerrar alcance y propuesta;
- tono profesional y cuidado.

## Tarea 7: implementación técnica

Revisar el flujo existente de contacto y, si ayuda, mirar el repositorio de Arik Custom para replicar la idea de plantilla/email.

Buscar en Aplaudia:

- `app/api/contacto/route.ts` o equivalente;
- variables `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL`, `EMAIL_FROM`;
- componentes de formulario/contacto;
- lógica de envío existente.

Buscar en Arik Custom el patrón de envío de presupuesto/plantilla si está disponible.

Implementar preferentemente:

- endpoint nuevo para leads del chatbot, por ejemplo `/api/agent/lead` o `/api/chatbot-lead`;
- no mezclarlo innecesariamente con el endpoint del chat si complica;
- usar Resend si ya está configurado;
- usar `CONTACT_RECIPIENT_EMAIL` si existe, y documentar que temporalmente debe ser `carlosvfx@gmail.com`;
- no hardcodear secretos;
- no guardar datos en base de datos si no existe;
- validar input del cliente;
- evitar spam básico con límites simples si procede.

## Tarea 8: UI del chatbot para solicitar presupuesto

Añadir una forma sencilla dentro del chatbot para que, cuando haya intención clara, el asistente pueda ofrecer:

- `¿Quieres que prepare una solicitud de presupuesto orientativa?`

Recoger como mínimo:

- nombre;
- email;
- teléfono opcional;
- tipo de negocio/proyecto;
- si quiere recibir copia.

No hacer el flujo pesado. Debe ser corto y cómodo.

El texto de privacidad debe ser breve y claro:

`Usaremos estos datos y el resumen de tu solicitud para poder responderte desde Aplaudia. Los importes son orientativos y sin IVA.`

## Tarea 9: bug del textarea en escritorio

Carlos confirma que, en escritorio, al enviar con el chatbot, la pregunta se envía pero el texto queda en la caja `Cuéntame qué necesitas...`.

Revisar `components/agent/generic-agent-widget.tsx`.

Comportamiento obligatorio:

- al enviar con botón, borrar textarea inmediatamente;
- al enviar con Enter, borrar textarea inmediatamente;
- tras enviar, textarea a altura mínima;
- `hasText` en falso;
- botón enviar desactivado hasta nuevo texto;
- pregunta solo en historial;
- validar escritorio específicamente.

Aunque `NEXT_TASK.md` anterior indicaba que estaba validado, Carlos lo acaba de reproducir en escritorio, así que hay que corregirlo de verdad.

## Validaciones obligatorias

- `npm run build`.
- `npm run lint` si está disponible.
- Probar chatbot en escritorio:
  - escribir;
  - enviar con botón;
  - enviar con Enter;
  - confirmar textarea vacío.
- Probar chatbot en móvil.
- Probar que el agente no da precios salvo pregunta explícita.
- Probar que, al dar precios, indica sin IVA y orientativo.
- Probar mantenimiento mensual.
- Probar comparación con builder/IA.
- Probar flujo de solicitud de presupuesto:
  - email interno a Aplaudia;
  - copia cliente solo si la pide;
  - consentimiento visible;
  - plantilla correcta.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar producción tras push.

## Documentación

Actualizar `LAST_REPORT.md` con:

- cambios en precios internos del agente;
- reglas de no hablar de precios salvo pregunta directa;
- argumento builder/IA vs Aplaudia;
- flujo de solicitud desde chatbot;
- email interno configurado/documentado;
- corrección real del textarea en escritorio;
- pruebas ejecutadas;
- estado final de producción.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Restricciones

- No mostrar precios en la web pública.
- No tocar DNS ni Cloudflare.
- No guardar claves ni secretos.
- No añadir base de datos salvo petición explícita.
- No enviar datos sin aviso/consentimiento visible.
- No inventar precios cerrados, plazos, garantías ni datos legales.
- No mencionar programación con IA como mensaje público.
