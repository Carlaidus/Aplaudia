# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Ajustar rendimiento percibido en móvil, reducir espacios iniciales entre secciones y afinar el comportamiento del agente para que no hable de precios salvo que el usuario los pregunte de forma explícita. Mantener las animaciones y el look actual: no rediseñar.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- La home debe mantener aviso de construcción hasta validación final de Carlos.
- El aviso de construcción queda flotando a la izquierda y usa fecha `30 junio 2026`.
- El chatbot queda flotando a la derecha.
- El chatbot abierto funciona como panel grande/casi pantalla completa.
- El chatbot tiene dictado por voz con Web Speech API.
- `/api/agent` prioriza OpenAI directamente con `OPENAI_API_KEY`.
- `OPENAI_API_KEY` está activa en producción.
- `content/agent/aplaudia-agent.md` incluye identidad, servicios, casos reales y precios orientativos.
- Carlos ha observado en móvil que a veces solo aparece el primer título y el resto tarda en mostrarse. Luego aparece, pero da sensación de carga rota/lenta.
- Carlos quiere mantener las mismas animaciones y estilo, pero optimizar el tiempo hasta que el contenido sea visible.
- Carlos quiere algo menos de espacio entre secciones, sobre todo en las dos primeras.
- Carlos quiere la fuente del asistente Aplaudia un poco más grande si es posible.
- Carlos quiere que el chatbot NO saque precios a la primera de cambio. Solo debe hablar de precios cuando el usuario pregunte explícitamente por coste, precio, presupuesto, tarifa, cuánto cuesta, barato, económico, mínimo, etc.
- Carlos ha detectado que el agente salta demasiado de una web barata a 2.500 €. Hay que introducir opciones intermedias y, si el cliente quiere gastar poco, proponer reducir alcance/fases.
- Carlos considera exagerados para Aplaudia los rangos propios de 2.500-4.000 o 4.000-7.500 como punto principal. Esos pueden quedar como referencia de mercado/competidores, pero Aplaudia debe plantearse más accesible y vender también mantenimiento mensual.
- No hay base de datos, auth ni pagos.
- No guardar secretos en el repo.

## Tarea 1: optimización móvil sin cambiar animaciones

1. Revisar la home en móvil real/simulado.
2. Diagnosticar por qué al cargar en móvil aparece primero solo el título y el resto tarda demasiado.
3. Mantener el look y las animaciones actuales, pero mejorar rendimiento percibido:
   - no eliminar animaciones;
   - no cambiar estilo visual;
   - sí reducir delays, staggers o bloqueos si hacen que el contenido parezca ausente;
   - asegurar que el contenido crítico aparece antes;
   - evitar que observers, motion o efectos esperen demasiado en móvil;
   - revisar imágenes/fondos pesados si bloquean el render;
   - revisar hidratación y main thread si procede.
4. En móvil, el contenido no debe parecer roto ni vacío durante varios segundos.
5. No introducir saltos bruscos ni layout shift.

## Tarea 2: reducir espacio entre secciones iniciales

1. Revisar separación entre el hero y la siguiente sección, y entre las dos primeras secciones posteriores.
2. Reducir ligeramente el espacio vertical si se puede sin romper el diseño premium.
3. Mantener respiración visual suficiente.
4. No compactar toda la web de forma agresiva; prioridad a móvil y primeras secciones.

## Tarea 3: fuente del chatbot

1. Revisar `components/agent/aplaudia-agent-widget.tsx`.
2. Subir un poco la fuente del asistente si sigue viéndose pequeña.
3. Mantener interlineado compacto.
4. No perder espacio útil.
5. Mantener panel grande, micrófono, scroll inteligente e indicador de más contenido.

## Tarea 4: comportamiento de precios del agente

Actualizar `content/agent/aplaudia-agent.md` para que quede claro:

1. El agente NO debe hablar de precios de forma proactiva.
2. Solo debe mencionar precios si el usuario pregunta explícitamente por:
   - precio;
   - coste;
   - presupuesto;
   - tarifa;
   - cuánto cuesta;
   - barato;
   - económico;
   - mínimo;
   - desde cuánto.
3. Si el usuario pregunta por servicios sin mencionar precio, debe explicar posibilidades y llevar al formulario/WhatsApp sin sacar importes.
4. Si el usuario pregunta por precio, usar siempre `desde` y explicar que depende del alcance.
5. Si el usuario quiere algo muy barato, no saltar directamente a la opción completa más cara. Proponer reducir alcance.
6. Añadir una sección de escalado por alcance para webs con productos/catálogos, con precios propios de Aplaudia más accesibles:
   - landing o web muy sencilla: desde 390 €;
   - web sencilla con pocos productos destacados: desde 500-800 €;
   - catálogo básico/listado simple sin panel avanzado: desde 650-950 €;
   - catálogo más trabajado sin panel avanzado: desde 950-1.500 €;
   - catálogo con panel simple para editar contenido: desde 1.500-2.300 €;
   - catálogo con filtros, fichas completas, buscador, panel y carga inicial amplia: desde 2.300 € en adelante;
   - proyectos tipo aplicación, reservas, automatizaciones, dashboards o paneles avanzados: presupuesto a medida.
7. Añadir norma: si hay muchos productos pero el cliente quiere algo económico, sugerir una fase 1 con productos destacados y dejar el catálogo completo para fase 2.
8. Añadir norma: la clave comercial de Aplaudia es poder empezar de forma sencilla y ampliar por fases.
9. Añadir norma: dar importancia al mantenimiento mensual como vía para evolucionar la web sin presupuestos grandes de golpe.
10. No prometer descuentos ni precios cerrados.
11. No usar los rangos altos de mercado como precio propio principal. Si se mencionan, debe ser solo como comparación general: otras soluciones a medida pueden subir bastante más, pero Aplaudia intenta escalar el proyecto según presupuesto.

## Tarea 5: mantenimiento mensual en el agente

Actualizar la sección de mantenimiento del `.md` para que sea una parte clara de la propuesta:

- Mantenimiento básico: desde 20-30 €/mes.
  - Para revisión mínima, pequeños ajustes pactados y soporte básico.
- Mantenimiento activo: desde 60-90 €/mes.
  - Para cambios pequeños recurrentes, textos, imágenes, pequeñas mejoras y acompañamiento.
- Mantenimiento avanzado: desde 120-200 €/mes.
  - Para más trabajo mensual, pequeñas evoluciones, mejoras, contenido, SEO básico o propuestas de nuevas funcionalidades.
- Trabajos fuera de mantenimiento: normalmente 30-45 €/h o presupuesto aparte si es una funcionalidad grande.
- Si el cliente tiene presupuesto limitado, proponer combinar una versión inicial más sencilla con mantenimiento/evolución mensual.

## Tarea 6: pruebas del agente

Probar preguntas reales:

1. `Quiero una web sencilla para mi negocio` -> NO debe hablar de precios si no se preguntan.
2. `¿Cuánto cuesta una web sencilla?` -> puede dar rango desde 390 € y explicar alcance.
3. `Tengo 50 productos pero quiero algo barato` -> debe proponer fases/reducir alcance antes de saltar a catálogos completos.
4. `Quiero un chatbot para mi web` -> no hablar de precio si no se pregunta.
5. `¿Cuánto cuesta un chatbot?` -> desde 500 €, WhatsApp desde +100 €, siempre orientativo.
6. `No tengo mucho presupuesto` -> debe proponer una fase inicial sencilla y mantenimiento mensual, no una opción grande.

## Validaciones obligatorias

- `npm install` si hace falta.
- `npm run build`.
- `npm run lint` si está disponible.
- Probar home móvil 360/390/430 px.
- Probar escritorio.
- Confirmar que no se han eliminado animaciones ni cambiado el look.
- Confirmar que el contenido móvil aparece antes y no parece roto.
- Confirmar que hay menos espacio entre primeras secciones sin apretar demasiado.
- Confirmar que el chatbot sigue funcionando.
- Confirmar que el micrófono sigue funcionando o mantiene fallback.
- Confirmar respuestas del agente sobre precios según reglas.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar producción/Railway en verde tras push.

## Documentación

Actualizar `LAST_REPORT.md` con:

- causa probable del retraso visual en móvil;
- ajustes aplicados sin tocar animaciones;
- cambios de espaciado inicial;
- cambios de fuente del chatbot;
- cambios en normas de precios del agente;
- nueva escala de precios propios de Aplaudia;
- nueva orientación de mantenimiento mensual;
- pruebas ejecutadas;
- estado final de producción/Railway;
- siguiente paso recomendado.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Restricciones

- No rediseñar la web completa.
- No eliminar animaciones.
- No romper home, casos, móvil ni escritorio.
- No tocar dominio, DNS ni Cloudflare salvo petición explícita.
- No añadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programación con IA como mensaje público.
- No inventar datos legales, dirección, CIF, precios cerrados, plazos ni garantías.

## Cierre esperado de la próxima sesión

- Home móvil más rápida de percibir.
- Espaciado inicial algo más compacto.
- Chatbot legible con fuente algo mayor.
- Agente sin precios proactivos.
- Agente con precios propios de Aplaudia más ajustados y escalables.
- Mantenimiento mensual integrado como propuesta comercial.
- Producción en verde.
