# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Validar en móvil real la versión ya desplegada y cerrar preparación operativa antes de retirar el aviso de construcción: dictado real, comportamiento del chatbot con teclado abierto, respuestas del agente en producción, Resend/contacto real y textos legales mínimos.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- El aviso de construcción queda flotando a la izquierda y usa fecha `30 junio 2026`.
- El chatbot queda flotando a la derecha y abierto funciona como panel grande/casi pantalla completa.
- El chatbot tiene dictado por voz con Web Speech API.
- El agente funciona con variable de entorno privada en producción.
- `content/agent/aplaudia-agent.md` incluye identidad, servicios, casos reales y precios orientativos.
- Carlos ha observado en móvil que a veces solo aparece el primer título y el resto tarda en mostrarse. Luego aparece, pero da sensación de carga rota/lenta.
- Carlos quiere mantener las mismas animaciones y estilo, pero optimizar el tiempo hasta que el contenido sea visible.
- Carlos quiere algo menos de espacio entre secciones, sobre todo en las dos primeras.
- Carlos quiere la fuente del asistente Aplaudia un poco más grande si es posible.
- Carlos quiere que, al enviar una pregunta en el chatbot, el texto enviado desaparezca de la caja de introducción para ganar espacio y que el textarea vuelva a su altura mínima.
- Carlos quiere que el chatbot NO saque precios a la primera de cambio. Solo debe hablar de precios cuando el usuario pregunte explícitamente por coste, precio, presupuesto, tarifa, cuánto cuesta, barato, económico, mínimo, etc.
- Carlos ha detectado que el agente salta demasiado de una web barata a 2.500 €. Hay que introducir opciones intermedias y, si el cliente quiere gastar poco, proponer reducir alcance/fases.
- Carlos considera exagerados para Aplaudia los rangos propios de 2.500-4.000 o 4.000-7.500 como punto principal. Esos pueden quedar como referencia de mercado/competidores, pero Aplaudia debe plantearse más accesible y vender también mantenimiento mensual.

## Estado tras la última sesión

- Hero móvil validado en producción: a 700 ms ya son visibles H1, subtítulo y CTA principal.
- Espaciado inicial reducido en móvil sin rediseñar.
- Chatbot validado en producción:
  - fuente de mensajes en móvil: 16 px;
  - textarea se vacía al enviar;
  - textarea vuelve a 48 px;
  - pregunta queda solo como burbuja de usuario;
  - sin scroll horizontal.
- Prompt del agente actualizado:
  - no habla de precios si no se preguntan;
  - usa rangos con `desde` si el usuario pregunta por precio;
  - propone fases si el cliente tiene poco presupuesto;
  - mantenimiento mensual integrado como vía de evolución.
- Producción `https://aplaudia.com` sirve la versión final.

## Próxima tarea real

1. Probar en móvil real la home:
   - primera carga;
   - hero visible sin sensación de bloqueo;
   - aviso de construcción;
   - chatbot flotante;
   - primeras secciones tras scroll.
2. Probar chatbot en móvil real con teclado abierto:
   - texto largo;
   - envío;
   - textarea vacío;
   - altura mínima;
   - respuesta larga;
   - indicador de más contenido.
3. Probar dictado por voz real:
   - Chrome/Edge escritorio;
   - Android si hay dispositivo disponible;
   - iPhone/Safari si hay dispositivo disponible;
   - confirmar permiso, transcripción y envío.
4. Revisar respuestas reales del agente en producción durante una conversación más natural:
   - servicios sin precio;
   - preguntas de precio;
   - poco presupuesto;
   - catálogos/productos;
   - mantenimiento mensual.
5. Continuar con email real del formulario si Carlos ya tiene Resend listo:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
6. Revisar legal/contacto antes de retirar el aviso de construcción:
   - aviso legal;
   - privacidad;
   - cookies si aplica;
   - texto definitivo de consentimiento.
7. Decidir con Carlos si se puede retirar el aviso de construcción.

## Ejecutado - Tarea 1: optimización móvil sin cambiar animaciones

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

## Ejecutado - Tarea 2: reducir espacio entre secciones iniciales

1. Revisar separación entre el hero y la siguiente sección, y entre las dos primeras secciones posteriores.
2. Reducir ligeramente el espacio vertical si se puede sin romper el diseño premium.
3. Mantener respiración visual suficiente.
4. No compactar toda la web de forma agresiva; prioridad a móvil y primeras secciones.

## Ejecutado - Tarea 3: fuente y caja de escritura del chatbot

1. Revisar `components/agent/aplaudia-agent-widget.tsx`.
2. Subir un poco la fuente del asistente si sigue viéndose pequeña.
3. Mantener interlineado compacto.
4. No perder espacio útil.
5. Mantener panel grande, micrófono, scroll inteligente e indicador de más contenido.
6. Al enviar una pregunta, borrar inmediatamente el contenido del textarea/caja de introducción.
7. Después de enviar, el textarea debe volver a su altura mínima para ganar espacio vertical.
8. Mantener el mensaje enviado visible como burbuja de usuario en el historial, pero no duplicado dentro del input.
9. Confirmar que esto funciona también si el texto venía del dictado por voz.
10. Confirmar que `hasText` queda en falso y el botón de enviar vuelve a desactivarse hasta que haya nuevo texto.

## Ejecutado - Tarea 4: comportamiento de precios del agente

Actualizar `content/agent/aplaudia-agent.md` para que quede claro:

1. El agente NO debe hablar de precios de forma proactiva.
2. Solo debe mencionar precios si el usuario pregunta explícitamente por precio, coste, presupuesto, tarifa, cuánto cuesta, barato, económico, mínimo o desde cuánto.
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
7. Si hay muchos productos pero el cliente quiere algo económico, sugerir una fase 1 con productos destacados y dejar el catálogo completo para fase 2.
8. La clave comercial de Aplaudia es poder empezar de forma sencilla y ampliar por fases.
9. Dar importancia al mantenimiento mensual como vía para evolucionar la web sin presupuestos grandes de golpe.
10. No prometer descuentos ni precios cerrados.
11. No usar los rangos altos de mercado como precio propio principal. Si se mencionan, debe ser solo como comparación general: otras soluciones a medida pueden subir bastante más, pero Aplaudia intenta escalar el proyecto según presupuesto.

## Ejecutado - Tarea 5: mantenimiento mensual en el agente

Actualizar la sección de mantenimiento del `.md` para que sea una parte clara de la propuesta:

- Mantenimiento básico: desde 20-30 €/mes.
  - Para revisión mínima, pequeños ajustes pactados y soporte básico.
- Mantenimiento activo: desde 60-90 €/mes.
  - Para cambios pequeños recurrentes, textos, imágenes, pequeñas mejoras y acompañamiento.
- Mantenimiento avanzado: desde 120-200 €/mes.
  - Para más trabajo mensual, pequeñas evoluciones, mejoras, contenido, SEO básico o propuestas de nuevas funcionalidades.
- Trabajos fuera de mantenimiento: normalmente 30-45 €/h o presupuesto aparte si es una funcionalidad grande.
- Si el cliente tiene presupuesto limitado, proponer combinar una versión inicial más sencilla con mantenimiento/evolución mensual.

## Ejecutado - Tarea 6: pruebas del agente y chatbot

Probar preguntas reales:

1. `Quiero una web sencilla para mi negocio` -> NO debe hablar de precios si no se preguntan.
2. `¿Cuánto cuesta una web sencilla?` -> puede dar rango desde 390 € y explicar alcance.
3. `Tengo 50 productos pero quiero algo barato` -> debe proponer fases/reducir alcance antes de saltar a catálogos completos.
4. `Quiero un chatbot para mi web` -> no hablar de precio si no se pregunta.
5. `¿Cuánto cuesta un chatbot?` -> desde 500 €, WhatsApp desde +100 €, siempre orientativo.
6. `No tengo mucho presupuesto` -> debe proponer una fase inicial sencilla y mantenimiento mensual, no una opción grande.
7. Enviar una pregunta escrita y confirmar que el textarea queda vacío al instante.
8. Dictar una pregunta con el micrófono, enviarla y confirmar que el textarea queda vacío al instante.
9. Confirmar que la pregunta queda en el historial como burbuja de usuario y que el input no la conserva duplicada.

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
- Confirmar que el input del chatbot se limpia al enviar.
- Confirmar que el input vuelve a altura mínima al enviar.
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
- limpieza del textarea del chatbot tras enviar;
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

## Cierre esperado de la próxima sesión real

- Validación manual desde móvil real documentada.
- Dictado por voz real probado o limitación por navegador documentada.
- Formulario preparado para email real si Resend está listo.
- Legal mínimo definido antes de retirar aviso de construcción.
- Decisión clara sobre mantener o retirar el aviso de construcción.
