# NEXT TASK - Aplaudia

Prioridad: Media
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Estado tras la ultima ejecucion

- El motor de captacion del chatbot queda separado en `lib/lead-engine/`.
- La configuracion concreta de Aplaudia vive en `content/lead/aplaudia-lead-config.ts`.
- `components/agent/generic-agent-widget.tsx` ya no clasifica leads con reglas Aplaudia hardcodeadas.
- El widget mantiene un `LeadDraft` persistente durante la sesion.
- Solo bloquea el envio si falta:
  - email valido;
  - consentimiento claro.
- Nombre, telefono, tipo de proyecto, interes, presupuesto y copia son opcionales o inferibles.
- Si hay email + consentimiento + historial util, el chatbot pregunta una sola vez si el cliente quiere dejar nombre y telefono.
- Nombre y telefono no bloquean el envio:
  - si el usuario los da, se guardan;
  - si dice `envialo`, `adelante`, `no hace falta`, `sin telefono`, `tira palante` o muestra impaciencia, se envia con lo disponible;
  - no se vuelven a pedir en la misma solicitud.
- El email interno pasa a ser una ficha comercial breve:
  - contacto;
  - resumen para responder;
  - necesidad detectada;
  - dudas;
  - precio y alcance;
  - senales comerciales utiles;
  - frases utiles del cliente;
  - nota legal minima.
- Ya no se incluye transcript completo ni mensajes administrativos como `acepto`, `envialo`, email suelto o nombre suelto como frases utiles.
- La deteccion de servicios es conservadora:
  - `barato` no activa `bar`;
  - `no tengo fotos` no activa visuales;
  - visuales solo se activan si el cliente pide crear, editar, retocar, preparar o producir piezas visuales;
  - restaurante se detecta con contexto real de hosteleria, no por palabras dentro de otras.
- El chatbot bloquea el scroll de fondo mientras esta abierto y evita que el scroll del historial arrastre la pagina de detras.
- El textarea se vacia al enviar con boton y con Enter y vuelve a altura minima.
- La respuesta final de envio confirma que Aplaudia respondera por email en la maxima brevedad y solo menciona telefono/copia si procede.
- No se han tocado Cloudflare, Railway, DNS, variables, Resend ni Workers Paid.
- No hay copia automatica al cliente ni base de datos.

## Proximo foco real

Revisar en produccion con Carlos el nuevo email interno del chatbot.

1. Generar una prueba interna desde `https://aplaudia.com` con una conversacion realista.
2. Revisar en `carlosvfx@gmail.com`:
   - acentos renderizados correctamente;
   - asunto;
   - telefono como `No indicado` o telefono real si se facilita;
   - resumen para responder;
   - servicios detectados;
   - materiales mencionados;
   - precio y alcance;
   - frases utiles del cliente.
3. Confirmar que el email es suficientemente corto y accionable.
4. Si todavia hay demasiado texto, reducir solo la plantilla de `lib/lead-engine/build-internal-email.ts`.
5. Si falta informacion util, ajustar solo detectores concretos y anadir test de regresion.

## Siguiente foco de producto

- Revisar legal/privacidad antes de retirar el aviso de construccion.
- Mantener el aviso de construccion hasta validacion final de Carlos.
- Confirmar recepcion externa de aliases desde un buzon real autenticado:
  - `hola@aplaudia.com`;
  - `presupuestos@aplaudia.com`.
- Revisar conversaciones reales del agente activo para afinar tono, precios y cierres comerciales.

## Validaciones base para la proxima tarea

- `npm run test:quote-analysis`.
- `npm run test:email-encoding`.
- `npm run build`.
- `npm run lint` si `eslint` llega a estar disponible.
- `npm ls resend`.
- Probar `/api/agent/quote` sin consentimiento: debe devolver `400`.
- Probar `/api/agent/quote` con email y consentimiento pero sin opcionales: no debe devolver `400` por campos opcionales.
- Probar chatbot:
  - email + consentimiento -> pregunta opcionales una sola vez;
  - usuario da nombre/telefono -> se incluyen;
  - usuario dice `envialo` -> envia sin bloquear;
  - usuario impaciente -> no insiste;
  - fallo tecnico de envio -> muestra `No he podido enviar la solicitud ahora mismo...`.
- Probar chatbot en escritorio:
  - enviar con boton;
  - enviar con Enter;
  - textarea vacio tras enviar;
  - scroll de fondo bloqueado con el panel abierto.
- Probar chatbot en movil.
- Validar `https://aplaudia.com`, `/robots.txt`, `/llms.txt` y `/sitemap.xml`.

## Restricciones

- No guardar tokens, claves ni contrasenas.
- No borrar variables antiguas de Resend hasta que Carlos lo pida.
- No activar Workers Paid.
- No volver a Resend salvo decision explicita.
- No enviar emails a clientes reales.
- No enviar copias automaticas al cliente.
- No crear base de datos.
- No retirar el aviso de construccion.
