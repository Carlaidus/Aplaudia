# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Ajustar detalles finales del chatbot de Aplaudia: mayor legibilidad en escritorio, limpieza del texto del input tras enviar en escritorio y móvil, y reglas de precios más claras para que el agente solo hable de precios si se le pregunta y, cuando lo haga, indique que los importes son sin IVA.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- El chatbot usa `components/agent/generic-agent-widget.tsx` como motor reutilizable.
- Aplaudia lo configura desde `components/agent/aplaudia-agent-widget.tsx`.
- Las instrucciones están en `content/agent/aplaudia-agent.md`.
- El chatbot ya tiene:
  - panel grande;
  - dictado por voz;
  - scroll inteligente;
  - render enriquecido/Markdown;
  - etiqueta corta tipo `¿Dudas?`;
  - lightbox de visuales.
- En móvil el input se limpia al enviar, pero Carlos está viendo que en escritorio el texto puede quedarse en la caja de escritura. Hay que revisarlo y corregirlo para ambos.
- Carlos quiere que los precios solo aparezcan si el usuario pregunta explícitamente por precio/coste/presupuesto/tarifa/mensualidad.
- Cuando se hable de precios, hay que indicar que los importes son sin IVA.

## Tarea 1: fuente del chatbot

Revisar `components/agent/generic-agent-widget.tsx`.

1. En escritorio, subir un poco el tamaño de fuente de los mensajes del chatbot.
2. En móvil, subir solo un pelín si hace falta, sin perder demasiado espacio.
3. Mantener interlineado compacto.
4. No rediseñar el chatbot.
5. No romper:
   - panel grande;
   - scroll inteligente;
   - dictado por voz;
   - input limpio;
   - indicador de más contenido;
   - render Markdown.

## Tarea 2: limpiar input al enviar en escritorio y móvil

Revisar `components/agent/generic-agent-widget.tsx`.

Comportamiento obligatorio:

1. Al pulsar enviar en escritorio, el texto escrito debe desaparecer inmediatamente del textarea.
2. Al pulsar enviar en móvil, igual.
3. Al enviar con Enter en escritorio, igual.
4. Al enviar después de dictar con micrófono, igual.
5. La pregunta debe quedar como burbuja de usuario en el historial, pero no duplicada en la caja de escritura.
6. El textarea debe volver a altura mínima.
7. `hasText` debe quedar en `false`.
8. El botón de enviar debe quedar desactivado hasta que haya texto nuevo.
9. Si ya hay una función `resetInput`, validar que se llama en todos los caminos de envío y que no falla por desktop/Enter/foco/control no controlado.

## Tarea 3: reforzar reglas de precios del agente

Actualizar `content/agent/aplaudia-agent.md`.

Reglas obligatorias:

1. No hablar de precios de forma proactiva.
2. Si el usuario pregunta por servicios, ideas, webs, chatbots, visuales o casos pero no pregunta por precio, no dar importes.
3. Solo hablar de precios si el usuario pregunta explícitamente por:
   - precio;
   - coste;
   - presupuesto;
   - tarifa;
   - mensualidad;
   - mantenimiento;
   - cuánto cuesta;
   - barato;
   - económico;
   - mínimo;
   - desde cuánto.
4. Cuando se hable de precios, usar siempre `desde` y explicar que dependen del alcance.
5. Cuando se hable de precios, indicar claramente que son importes sin IVA.
6. Si la respuesta incluye varios importes, basta con una nota clara al final: `Importes orientativos sin IVA.`
7. Si el usuario pregunta por mantenimiento o mensualidades, explicar que la idea es un servicio mensual, normalmente con pago anual, y que habrá que definir qué incluye cada plan.
8. Mantener importancia del mantenimiento mensual como vía de evolución de la web.
9. No inventar precios cerrados, descuentos, plazos, garantías ni datos legales.

## Tarea 4: reforzar desde servidor si hace falta

Revisar `app/api/agent/route.ts` y helpers del agente.

- Confirmar que el `.md` completo se inyecta como instrucción principal.
- Si el modelo sigue sacando precios demasiado pronto, reforzar el system prompt con:
  - no dar precios salvo pregunta explícita;
  - si se dan precios, indicar que son orientativos y sin IVA;
  - priorizar el `.md`.
- No hardcodear todos los precios en código si ya están en el `.md`.
- No guardar claves ni secretos.

## Pruebas obligatorias

Probar en escritorio y móvil:

1. Escribir una pregunta y enviar con botón:
   - input vacío inmediatamente;
   - pregunta en historial;
   - textarea a altura mínima.
2. En escritorio, escribir una pregunta y enviar con Enter:
   - input vacío inmediatamente;
   - pregunta en historial;
   - textarea a altura mínima.
3. Dictar con micrófono y enviar:
   - input vacío inmediatamente;
   - pregunta en historial.
4. Pregunta sin precio:
   - `Quiero una web sencilla para mi restaurante.`
   - No debe dar importes.
5. Pregunta con precio:
   - `¿Cuánto cuesta una web sencilla?`
   - Debe usar rangos con `desde` y decir que son sin IVA.
6. Pregunta mantenimiento:
   - `¿Cuánto cuesta el mantenimiento mensual?`
   - Debe explicar que es mensual, normalmente con pago anual, y que los importes son sin IVA.
7. Pregunta fuera de ámbito:
   - debe redirigir a Aplaudia.

## Validaciones técnicas

- `npm run build`.
- `npm run lint` si está disponible.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar producción/Railway en verde tras push.

## Documentación

Actualizar `LAST_REPORT.md` con:

- ajuste de fuente en chatbot;
- corrección/validación de limpieza de input en escritorio y móvil;
- reglas de precios actualizadas;
- nota de precios sin IVA;
- pruebas ejecutadas;
- estado final de producción.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Restricciones

- No rediseñar la web completa.
- No tocar dominio, DNS ni Cloudflare.
- No guardar claves ni secretos.
- No mencionar programación con IA como mensaje público.
- No inventar precios cerrados, plazos, garantías ni datos legales.
