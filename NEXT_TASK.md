# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Corregir el comportamiento conversacional del chatbot: saludo inicial neutro, no mencionar casos reales salvo que el usuario pregunte, eliminar cualquier boton fijo/especifico de presupuesto y convertir la solicitud en un flujo natural dentro de la conversacion, con consentimiento claro antes de enviar datos.

## Estado actual

- Precios internos vigentes actualizados en `content/agent/aplaudia-agent.md`.
- No hay precios visibles en la web publica; quedan solo en el `.md` interno del agente y en el endpoint de email.
- Chatbot mantiene la regla: no habla de precios salvo pregunta directa.
- Si habla de precios, debe decir `desde`, orientativos y sin IVA.
- Mantenimiento vigente:
  - esencial: desde 29 €/mes, pago anual 348 €/año, sin IVA;
  - activo: desde 59 €/mes, pago anual 708 €/año, sin IVA;
  - evolucion: desde 119 €/mes, pago anual 1.428 €/año, sin IVA;
  - a medida: desde 199 €/mes, pago anual desde 2.388 €/año, sin IVA.
- Se añadio diferencia clara entre Aplaudia y builders/hosting con IA.
- Se creo flujo `Presupuesto` dentro del chatbot con endpoint `/api/agent/quote`, pero Carlos NO quiere un boton fijo de presupuesto ni un flujo con ese aspecto.
- Email interno provisional: `carlosvfx@gmail.com` por `siteConfig.contact.email`, salvo override de entorno.
- No se guarda nada en base de datos.
- Textarea del chatbot validado en escritorio: se limpia con boton y Enter.
- Produccion `https://aplaudia.com` validada.

## Tarea 1: saludo inicial neutro

Revisar `components/agent/aplaudia-agent-widget.tsx`, `components/agent/generic-agent-widget.tsx` y `content/agent/aplaudia-agent.md`.

El saludo inicial debe ser simple, amable y abierto.

No debe mencionar:

- Cronoras;
- Arik Custom;
- Aventuras Pixeladas;
- listado de casos reales;
- precios;
- presupuesto;
- formulario de presupuesto.

Saludo recomendado:

`Hola, soy el asistente de Aplaudia. Puedo ayudarte con dudas sobre webs, agentes IA, visuales o mejoras para tu negocio. Cuéntame qué necesitas.`

Alternativa:

`Hola, soy el asistente de Aplaudia. Si tienes dudas sobre una web, un agente IA, visuales o una mejora digital para tu negocio, cuéntame y te oriento.`

## Tarea 2: casos reales solo bajo demanda

Actualizar el `.md` del agente:

- El agente puede conocer Cronoras, Arik Custom y Aventuras Pixeladas.
- No debe mencionarlos en el saludo inicial.
- No debe mencionarlos de forma proactiva como si fueran lo unico que ha hecho Aplaudia.
- Solo debe hablar de casos reales si:
  - el usuario pregunta por ejemplos;
  - el usuario pregunta por trabajos realizados;
  - el usuario pregunta especificamente por Cronoras, Arik Custom o Aventuras Pixeladas;
  - el caso ayuda directamente a explicar un servicio que el usuario esta pidiendo.
- Cuando los mencione, hacerlo como ejemplos entre otros posibles enfoques, no como lista cerrada de trabajos.

## Tarea 3: eliminar boton fijo de presupuesto

Carlos no quiere un boton tipo `Generar presupuesto`, `Presupuesto`, `Preparar presupuesto`, `Solicitar presupuesto` ni nada parecido como CTA permanente dentro del chatbot.

Eliminar o desactivar cualquier boton fijo/especifico de presupuesto que se haya añadido.

El chatbot debe funcionar de forma conversacional:

- hablar con el usuario;
- entender que necesita;
- sugerir opciones;
- orientar;
- si el usuario pide precio, dar rangos orientativos sin IVA;
- si la conversacion esta madura, ofrecer enviar el resumen a una persona de Aplaudia.

No añadir un flujo visual pesado ni un formulario embebido agresivo dentro del chat.

## Tarea 4: solicitud como flujo conversacional

La solicitud debe surgir de forma natural, no como boton fijo.

Cuando el usuario muestre interes claro, el chatbot puede decir algo como:

`Si quieres, puedo preparar un resumen con lo que me has contado y enviarlo a una persona de Aplaudia para que lo revise y te responda con una propuesta mas ajustada.`

O:

`Puedo pasarle este resumen a una persona de Aplaudia para que revise tu caso y te diga una orientacion mas precisa. ¿Quieres que lo prepare?`

No usar “trabajadores”. Usar mejor:

- `una persona de Aplaudia`;
- `el equipo de Aplaudia`;
- `alguien de Aplaudia`;
- `una persona del equipo`.

## Tarea 5: consentimiento de datos antes de enviar

Antes de enviar cualquier dato por email, el chatbot debe pedir aceptacion clara.

Texto recomendado:

`Para enviarlo, necesito que aceptes que Aplaudia trate los datos que has facilitado y el resumen de tu solicitud solo para gestionar esta consulta y responderte por email. No se guardaran en una base de datos. Los importes comentados son orientativos y sin IVA. ¿Aceptas?`

Reglas:

- Sin aceptacion, no se envia nada.
- No enviar datos reales sin consentimiento visible.
- No usar esos datos para newsletter, publicidad ni otros fines.
- La finalidad debe quedar limitada a gestionar la solicitud y responder.
- No decir “nada mas” si puede generar ambiguedad legal; mejor decir “solo para gestionar esta consulta y responderte”.

## Tarea 6: datos minimos para enviar solicitud

Si el usuario acepta enviar la solicitud, pedir solo los datos minimos:

- nombre;
- email;
- telefono opcional;
- tipo de negocio/proyecto si no ha quedado claro;
- si quiere recibir copia limpia.

No hacer el flujo pesado.

## Tarea 7: email interno para Aplaudia

El email interno para Aplaudia debe ir a:

- `carlosvfx@gmail.com`

Debe incluir una plantilla clara con:

- datos del cliente;
- tipo de proyecto;
- servicios que le interesan;
- resumen breve de la conversacion;
- dudas principales;
- si ha preguntado por precios o presupuesto;
- presupuesto/rango orientativo comentado si lo hubo;
- nota de que son importes orientativos y sin IVA;
- nivel de interes aproximado, si se puede inferir sin exagerar;
- fecha/hora;
- canal: chatbot web Aplaudia.

El resumen interno debe ser util para Carlos, pero no larguisimo.

## Tarea 8: copia limpia para cliente

Si el cliente quiere copia, puede recibirla en su email.

La copia del cliente debe ser limpia:

- resumen de lo solicitado;
- orientacion o rango comentado si lo hubo;
- nota de que los importes son orientativos y sin IVA;
- aviso de que Aplaudia debe revisar el alcance para cerrar propuesta;
- sin notas internas;
- sin evaluacion comercial del cliente;
- sin resumen oculto de comportamiento.

No enviar copia al cliente si no la pide o no deja email.

## Tarea 9: presupuesto inverso

Actualizar el comportamiento del agente para poder preguntar por presupuesto disponible cuando tenga sentido.

No preguntarlo siempre al principio.

Preguntarlo cuando:

- el usuario diga que algo le parece caro;
- el usuario diga que tiene poco presupuesto;
- el usuario pida algo muy amplio;
- el usuario quiera ajustar alcance;
- haya que decidir entre una version basica y una completa.

Ejemplos:

`Podemos ajustarlo por fases. ¿Tienes una idea de presupuesto aproximado para plantearte una primera version realista?`

`Si prefieres empezar mas ajustado, podemos reducir alcance: por ejemplo, una landing inicial, productos destacados o una version sin panel. ¿Que presupuesto te gustaria no superar?`

Regla:

- No presionar.
- No sonar agresivo comercialmente.
- Usarlo para adaptar el alcance, no para encarecer.

## Tarea 10: mantener reglas de precios

Recordatorio:

- No hablar de precios salvo pregunta directa.
- Usar siempre `desde`.
- Decir que son orientativos y sin IVA.
- Explicar que el precio final depende del alcance.
- Recomendar que una persona de Aplaudia revise el caso.
- No mostrar precios en la web publica.

## Tarea 11: validar bug textarea escritorio

Carlos ya aviso de que en escritorio el texto enviado se queda en la caja `Cuéntame qué necesitas...`.

Aunque aparezca como validado antes, probarlo otra vez manualmente y corregirlo si sigue pasando.

Validar:

- enviar con boton;
- enviar con Enter;
- enviar despues de dictado;
- textarea vacio inmediatamente;
- textarea a altura minima;
- boton enviar desactivado hasta nuevo texto.

## Validaciones obligatorias

- `npm run build`.
- `npm run lint` si esta disponible.
- Probar saludo inicial: sin casos reales, sin precios, sin presupuesto.
- Probar pregunta `¿Teneis ejemplos?`: entonces si puede mencionar casos.
- Probar conversacion de web sencilla sin preguntar precio: sin importes.
- Probar pregunta directa de precio: precios orientativos sin IVA.
- Probar usuario dice `me parece caro`: preguntar presupuesto disponible o proponer fases.
- Confirmar que no existe boton fijo de generar presupuesto.
- Probar flujo natural de enviar resumen a una persona de Aplaudia.
- Confirmar que aparece consentimiento antes de enviar datos.
- Confirmar que sin aceptar no envia email.
- Confirmar email interno a `carlosvfx@gmail.com`.
- Confirmar copia cliente solo si la pide.
- Confirmar textarea limpio en escritorio.
- Confirmar produccion tras push.

## Documentacion

Actualizar `LAST_REPORT.md` con:

- nuevo saludo inicial;
- regla de casos reales solo bajo demanda;
- eliminacion del boton fijo de presupuesto;
- nuevo flujo conversacional para derivar a una persona de Aplaudia;
- texto de consentimiento y finalidad limitada de datos;
- funcionamiento de copia interna y copia cliente;
- regla de preguntar presupuesto disponible cuando haga falta;
- validacion del textarea en escritorio;
- pruebas ejecutadas;
- estado final de produccion.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Restricciones

- No mostrar precios en la web publica.
- No hacer boton fijo de presupuesto.
- No mencionar casos reales de forma proactiva.
- No tocar DNS ni Cloudflare.
- No guardar claves ni secretos.
- No añadir base de datos salvo peticion explicita.
- No enviar datos sin aviso/consentimiento visible.
- No usar datos para otros fines.
- No inventar precios cerrados, plazos, garantias ni datos legales.
