# NEXT TASK - Aplaudia

Prioridad: Media-Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Estado tras la ultima ejecucion

- El flujo de solicitud desde chatbot se ha corregido para evitar bucles.
- El widget mantiene un borrador conversacional durante la sesion.
- Solo bloquea el envio si falta:
  - email valido;
  - consentimiento claro.
- Nombre, telefono, tipo de negocio, interes, presupuesto y copia son opcionales o inferibles.
- Si el visitante dice `envialo`, `mandalo`, `adelante` o algo equivalente:
  - si hay email y consentimiento, se intenta enviar;
  - si falta email, pide solo email;
  - si falta consentimiento, pide solo consentimiento.
- El textarea del chatbot se limpia al enviar con boton y con Enter.
- El endpoint `/api/agent/quote` ya no devuelve `400` por faltar nombre, tipo de proyecto, interes o presupuesto.
- La ficha interna por email incluye resumen ejecutivo, necesidades, senales comerciales, urgencia, friccion, sensibilidad a precio, precios comentados y ultimos mensajes.
- No hay copia automatica al cliente; si la pide, queda como nota interna.
- No se ha tocado Cloudflare, Railway, DNS, variables ni Resend.
- Produccion `https://aplaudia.com` validada con el nuevo bundle del chatbot.
- Railway dashboard muestra el commit `1225a21` como `Deployment successful` y servicio `Active`.
- La ficha interna de presupuesto se ha reforzado para evitar falsos positivos:
  - tipo de proyecto y servicios salen solo del texto del cliente;
  - `barato` no activa `bar`;
  - `no tengo fotos` queda como material, no como visuales;
  - una pagina personal sencilla y barata solo activa `Web / landing`;
  - una web de restaurante con reservas activa `Web / landing` y `Reservas`.
- Hay test de regresion local: `npm run test:quote-analysis`.

## Proximo foco real

Revisar correos internos reales recibidos desde el chatbot:

1. Carlos debe revisar en `carlosvfx@gmail.com` si la ficha interna resulta clara y util.
2. Confirmar si el asunto, resumen ejecutivo y siguiente accion recomendada son adecuados.
3. Confirmar que `Servicios de interes` ya no incluye servicios no pedidos.
4. Si hay demasiado texto, reducir el email interno manteniendo los campos comerciales clave.
5. Si falta informacion util, ajustar solo la plantilla interna de `/api/agent/quote`.

## Siguiente foco de producto

- Revisar legal/privacidad antes de retirar el aviso de construccion.
- Mantener el aviso de construccion hasta validacion final de Carlos.
- Confirmar recepcion externa de aliases desde un buzon real autenticado:
  - `hola@aplaudia.com`;
  - `presupuestos@aplaudia.com`.
- Revisar conversaciones reales del agente activo para afinar tono, precios y cierres comerciales.

## Validaciones base para la proxima tarea

- `npm run build`.
- `npm run lint` si `eslint` llega a estar disponible.
- `npm ls resend`.
- Probar `/api/agent/quote` sin consentimiento: debe devolver `400`.
- Probar `/api/agent/quote` con email y consentimiento pero sin opcionales: no debe devolver `400` por campos opcionales.
- Ejecutar `npm run test:quote-analysis`.
- Probar chatbot en escritorio:
  - enviar con boton;
  - enviar con Enter;
  - textarea vacio tras enviar.
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
