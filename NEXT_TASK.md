# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Cerrar ajustes del chatbot/agente de Aplaudia: validar que el input se limpia al enviar, dejar los precios bien estructurados en `content/agent/aplaudia-agent.md`, añadir referencias de mercado separadas de los precios propios, limitar estrictamente el ámbito de conversación y hacer más evidente el botón flotante del chatbot con una microfrase tipo `Pregúntame sobre Aplaudia`.

## Repo

`Carlaidus/Aplaudia`

## Estado confirmado

- `https://aplaudia.com/` funciona.
- El chatbot ya usa el motor reutilizable `GenericAgentWidget` desde `components/agent/generic-agent-widget.tsx`.
- `components/agent/aplaudia-agent-widget.tsx` ya es una configuración específica para Aplaudia.
- El chatbot abierto funciona como panel grande/casi pantalla completa.
- El chatbot tiene dictado por voz.
- El scroll inteligente y el indicador de más contenido ya existen.
- El input del chatbot ya debería vaciarse al enviar, pero Carlos quiere validarlo bien porque es importante para ganar espacio.
- `content/agent/aplaudia-agent.md` ya incluye una primera tabla/lista de precios orientativos propios.
- Carlos quiere que esos precios queden todavía más ordenados y visualmente fáciles de cambiar dentro del `.md`.
- Carlos quiere añadir también los precios/referencias de mercado investigados en Notion, pero separados de los precios propios de Aplaudia.
- Carlos quiere que el agente NO responda preguntas fuera del ámbito de Aplaudia, Cronoras, Arik Custom, Aventuras Pixeladas y los servicios que ofrece Aplaudia.
- Carlos quiere que el botón flotante del chatbot no sea solo un icono: debe quedar claro que se puede pulsar para preguntar sobre la página.

## Tarea 1: validar y reforzar limpieza del input del chatbot

1. Revisar `components/agent/generic-agent-widget.tsx`.
2. Confirmar que al enviar una pregunta:
   - el textarea se borra inmediatamente;
   - el textarea vuelve a altura mínima;
   - `hasText` queda en falso;
   - el botón de enviar queda desactivado hasta que haya nuevo texto;
   - la pregunta enviada queda solo como burbuja de usuario en el historial;
   - no queda duplicada en la caja de introducción.
3. Confirmar que funciona también si el texto viene del dictado por voz.
4. Si ya está implementado, no reescribir innecesariamente: solo corregir si falla algún caso.

## Tarea 2: hacer más claro el botón flotante del chatbot

Objetivo: que el usuario entienda que el icono flotante es un asistente al que puede preguntar sobre Aplaudia.

1. Revisar `components/agent/generic-agent-widget.tsx` y `components/agent/aplaudia-agent-widget.tsx`.
2. Añadir una microfrase junto al botón flotante cuando el chat está cerrado.
3. Texto recomendado:
   - `Pregúntame sobre Aplaudia`
   - o `¿Dudas? Pregúntame`
   - o `Pregunta sobre la web`
4. Mejor opción recomendada: `Pregúntame sobre Aplaudia`.
5. La microfrase debe:
   - aparecer junto al icono flotante;
   - parecer una etiqueta/píldora integrada;
   - no tapar contenido importante;
   - no solaparse con el aviso de construcción;
   - funcionar en móvil y escritorio;
   - poder cerrarse/ocultarse si molesta o desaparecer tras abrir el chat por primera vez si lo ves mejor;
   - mantener estilo premium oscuro actual.
6. En móvil, si falta espacio, usar una versión más corta:
   - `Pregúntame`
   - o mostrar la etiqueta solo durante unos segundos al cargar.
7. El botón flotante debe seguir siendo claro, accesible y pulsable.
8. Mantener `aria-label` descriptivo.
9. No mostrar esa etiqueta cuando el chat está abierto.

## Tarea 3: ordenar precios propios en `content/agent/aplaudia-agent.md`

Reorganizar la sección de precios para que Carlos pueda entrar y cambiarlos fácilmente.

Debe quedar una estructura clara y separada:

```md
## Precios orientativos

### Reglas generales de precios
...

### Precios propios Aplaudia — Webs
...

### Precios propios Aplaudia — Agentes IA / chatbots
...

### Precios propios Aplaudia — Mantenimiento mensual
...

### Precios propios Aplaudia — Visuales, imagen y vídeo
...

### Referencias de mercado — no usar como precio propio
...
```

Precios propios actuales de Aplaudia que deben quedar claros:

### Webs

- Landing o web muy sencilla: desde 390 €.
- Web sencilla con pocos productos destacados: desde 500-800 €.
- Catálogo básico o listado simple sin panel avanzado: desde 650-950 €.
- Catálogo más trabajado sin panel avanzado: desde 950-1.500 €.
- Web comercial personalizada: desde 1.500 €.
- Catálogo con panel simple para editar contenido: desde 1.500-2.300 €.
- Catálogo con filtros, fichas completas, buscador, panel y carga inicial amplia: desde 2.300 € en adelante.
- Reservas, automatizaciones, dashboards, paneles avanzados o funciones tipo aplicación: presupuesto a medida.

Norma importante:
- Si el cliente quiere algo económico, proponer reducir alcance, empezar por productos destacados o fase 1 sencilla, no saltar directamente a catálogo completo.

### Agentes IA / chatbots

- Agente IA para web: desde 500 €.
- Integración adicional con WhatsApp: desde +100 €.
- Coste mensual: variable según mantenimiento, uso de API, ajustes, soporte o volumen.
- Explicar que el motor web y WhatsApp puede ser parecido, pero WhatsApp requiere configuración extra y depende de las condiciones vigentes de WhatsApp/Meta.

### Mantenimiento mensual

- Mantenimiento básico: desde 20-30 €/mes.
- Mantenimiento activo: desde 60-90 €/mes.
- Mantenimiento avanzado: desde 120-200 €/mes.
- Trabajo adicional fuera del mantenimiento: normalmente 30-45 €/h.
- Nuevas funcionalidades grandes: presupuesto aparte.

### Visuales, imagen y vídeo

- Imágenes IA sencillas: desde 25-40 € por imagen.
- Imagen trabajada, composición o dirección visual: desde 80-150 €.
- Pack visual para web, marca o campaña: desde 250-500 €.
- Vídeo corto con IA: desde 150-300 €.
- Vídeo con rodaje, fotografía real, edición y mezcla con IA: desde 500 € en adelante o presupuesto a medida.

## Tarea 4: añadir referencias de mercado separadas

En `content/agent/aplaudia-agent.md`, añadir una sección separada de referencias de mercado.

Debe quedar claro:

- Estas referencias NO son precios propios de Aplaudia.
- Sirven para que el agente entienda el contexto del mercado.
- No debe usarlas como tarifa principal.
- Solo puede mencionarlas si el usuario pregunta por comparativa de mercado o por qué Aplaudia cuesta más/menos que otras opciones.

Referencias que deben aparecer de forma resumida:

### Builders / plataformas de webs

- Wix / Squarespace / Hostinger / similares: suelen moverse en cuotas mensuales bajas o medias, pero son herramientas de autoservicio.
- Shopify: SaaS potente para ecommerce, con cuota mensual y apps, pero requiere configuración, diseño y contenido.
- Webs a medida de agencia/desarrollo custom: pueden subir a varios miles de euros o más según complejidad.

### Chatbots / agentes IA SaaS

- Chatbase: planes mensuales por uso, créditos y funciones.
- Landbot: planes mensuales, con WhatsApp y funciones avanzadas en rangos superiores.
- Manychat: planes mensuales para automatizaciones en canales sociales/WhatsApp.
- Tidio/Lyro y similares: pueden escalar de planes bajos a planes altos según volumen y funciones.

### Imagen y vídeo IA

- Runway, HeyGen, Synthesia, Magnific/Freepik y similares: herramientas con cuota mensual o créditos.
- El valor de Aplaudia no es solo la herramienta: es dirección visual, selección, edición, integración con web/marca, iteración y entrega final.

## Tarea 5: limitar estrictamente el ámbito del agente

Actualizar `content/agent/aplaudia-agent.md` con una sección nueva:

```md
## Ámbito de conversación
```

Reglas obligatorias:

1. El agente solo debe responder sobre:
   - Aplaudia;
   - servicios de Aplaudia;
   - webs, landings, catálogos, paneles, reservas, agentes IA, WhatsApp, visuales, imagen, vídeo, SEO, mantenimiento;
   - casos reales: Cronoras, Arik Custom y Aventuras Pixeladas;
   - dudas razonables de un cliente sobre un proyecto digital con Aplaudia.
2. Si el usuario pregunta algo fuera de ese ámbito, por ejemplo curiosidades del universo, cocina, deporte, política, historia, medicina, fiscalidad, entretenimiento, etc., debe rechazar de forma amable y redirigir.
3. Ejemplo de respuesta fuera de ámbito:
   - `Puedo ayudarte con dudas sobre Aplaudia, webs, agentes IA, visuales o casos reales como Cronoras, Arik Custom y Aventuras Pixeladas. Para otras consultas generales, mejor usar un asistente general.`
4. No debe inventar una respuesta solo para ser útil.
5. No debe contestar curiosidades generales aunque sepa la respuesta.
6. Sí puede hacer analogías simples si ayudan a explicar un servicio de Aplaudia, pero debe volver al contexto del proyecto.

## Tarea 6: asegurar que el route respeta el `.md`

Revisar `app/api/agent/route.ts` y helpers del motor reutilizable.

1. Confirmar que el contenido completo de `content/agent/aplaudia-agent.md` se inyecta como instrucción principal del agente.
2. Si el modelo sigue respondiendo fuera de ámbito pese al `.md`, reforzar el system prompt del servidor para priorizar:
   - obedecer el `.md`;
   - no responder fuera de ámbito;
   - no dar precios salvo pregunta explícita.
3. No hardcodear todos los precios en código si ya están en el `.md`; el `.md` debe seguir siendo el archivo editable.
4. No guardar claves ni secretos.

## Tarea 7: pruebas obligatorias

Probar en producción o local equivalente:

1. Input normal:
   - escribir pregunta;
   - enviar;
   - confirmar textarea vacío;
   - confirmar altura mínima;
   - confirmar pregunta como burbuja.
2. Dictado:
   - dictar pregunta;
   - enviar;
   - confirmar textarea vacío;
   - confirmar altura mínima.
3. Botón flotante:
   - confirmar que aparece microfrase junto al icono;
   - confirmar que se entiende que se puede preguntar;
   - confirmar que no se solapa en móvil;
   - confirmar que no aparece cuando el chat está abierto.
4. Precios:
   - `Quiero una web sencilla` -> NO debe hablar de precios.
   - `¿Cuánto cuesta una web sencilla?` -> sí puede hablar de precios.
   - `Tengo 50 productos pero quiero algo barato` -> debe proponer fases/reducir alcance.
   - `¿Cuánto cuesta un chatbot?` -> agente web desde 500 €, WhatsApp desde +100 €, orientativo.
5. Fuera de ámbito:
   - `Dime curiosidades del universo` -> debe rechazar y redirigir a Aplaudia.
   - `Dime una receta de tortilla` -> debe rechazar y redirigir a Aplaudia.
   - `Háblame de Cronoras` -> sí debe responder.
   - `Háblame de Arik Custom` -> sí debe responder.
   - `Háblame de Aventuras Pixeladas` -> sí debe responder.
6. Confirmar que no menciona programación con IA.
7. Confirmar que no inventa precios cerrados, plazos, garantías, datos legales ni clientes.

## Validaciones técnicas

- `npm install` si hace falta.
- `npm run build`.
- `npm run lint` si está disponible.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar que producción/Railway queda en verde tras push.

## Documentación

Actualizar `LAST_REPORT.md` con:

- estado real del input limpio tras enviar;
- cambio visual en botón flotante del chatbot;
- cambios hechos en `content/agent/aplaudia-agent.md`;
- nueva estructura de precios propios;
- nueva sección de referencias de mercado;
- nueva sección de ámbito de conversación;
- pruebas de fuera de ámbito;
- validaciones técnicas;
- estado final de producción/Railway;
- siguiente paso recomendado.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Restricciones

- No rediseñar la web completa.
- No tocar dominio, DNS ni Cloudflare.
- No añadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programación con IA como mensaje público.
- No inventar datos legales, dirección, CIF, precios cerrados, plazos ni garantías.

## Cierre esperado

- Input del chatbot confirmado limpio tras enviar.
- Botón flotante con microfrase clara para que el usuario entienda que puede preguntar.
- Precios propios de Aplaudia ordenados y fáciles de editar en el `.md`.
- Referencias de mercado separadas de los precios propios.
- Agente limitado estrictamente al ámbito de Aplaudia y proyectos relacionados.
- Producción en verde.
