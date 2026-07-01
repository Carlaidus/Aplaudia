# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Estado tras la ultima ejecucion

- Resend y correo:
  - dominio `aplaudia.com` creado y verificado en Resend;
  - Resend no ofrece region Espana; se uso `Ireland (eu-west-1)` como region UE;
  - DNS aplicados en Cloudflare: DKIM, MX de envio, SPF y DMARC;
  - API key `Aplaudia` creada con permiso `Sending access`;
  - `RESEND_API_KEY` y `EMAIL_FROM` configuradas en Railway;
  - `EMAIL_FROM`: `Aplaudia <hola@aplaudia.com>`;
  - Railway vuelve a `Online`;
  - no se ha enviado email real de prueba todavia.
- Imagenes/visuales:
  - no dar precios unitarios por imagen;
  - responder que se prepara un pack personalizado;
  - adaptar alcance al presupuesto disponible;
  - no mencionar IA, prompts, herramientas, Photoshop ni tecnica concreta al hablar de imagenes o visuales.
- El chatbot ya no muestra boton fijo de `Presupuesto` ni `Generar presupuesto`.
- La solicitud de presupuesto queda integrada en la conversacion:
  - el usuario pide avanzar, presupuesto, propuesta o enviar un resumen;
  - el widget pide datos utiles si faltan;
  - antes de enviar exige aceptacion clara del tratamiento de datos;
  - sin aceptacion clara no llama a `/api/agent/quote`.
- Texto de aceptacion usado:

`Para enviarlo, necesito que aceptes que Aplaudia trate los datos que has facilitado y el resumen de tu solicitud solo para gestionar esta consulta y responderte por email. No se guardarán en una base de datos. Los importes comentados son orientativos y sin IVA. ¿Aceptas?`

- El saludo inicial es neutro y no menciona Cronoras, Arik Custom ni Aventuras Pixeladas.
- Los casos reales solo deben aparecer si el usuario pide ejemplos o pregunta por esos proyectos.
- El textarea del chatbot se vacia inmediatamente al enviar con boton o Enter y vuelve a altura minima.
- Si el usuario dice que algo es caro o tiene poco presupuesto, el agente debe preguntar que presupuesto le gustaria no superar.
- El endpoint `/api/agent/quote` mantiene Resend, no guarda en base de datos y envia el email interno provisional a `carlosvfx@gmail.com`.
- Si el cliente pide copia, la copia debe ser limpia, sin notas internas.
- Los datos no se usan para newsletter, publicidad ni otros fines.
- Produccion `https://aplaudia.com` validada tras el push del commit `676584e`.
- Railway CLI sigue sin sesion valida (`invalid_grant` / `Unauthorized`); usar dashboard o reloguear CLI si hace falta revisar Railway por dentro.
- Correo:
  - `/api/agent/quote` ya usa Resend;
  - destinatario interno provisional: `carlosvfx@gmail.com`;
  - faltan variables Railway `RESEND_API_KEY` y `EMAIL_FROM` si no estan ya configuradas;
  - no guardar secretos en el repo.
- Produccion validada:
  - precio de imagenes/visuales responde con pack personalizado, sin precio unitario;
  - tras orientar en precios ofrece enviar resumen a una persona de Aplaudia y copia limpia por email;
  - `/api/agent/quote` corta sin consentimiento con `400`.

## Proximo foco real

Probar el envio real controlado del flujo conversacional con datos ficticios, consentimiento visible y recepcion en `carlosvfx@gmail.com`.

## Tareas recomendadas

1. Confirmar con Carlos si autoriza enviar un email real de prueba desde produccion.
2. Si Carlos confirma:
   - abrir `https://aplaudia.com`;
   - pedir conversacionalmente enviar un resumen;
   - facilitar datos ficticios claros;
   - aceptar el texto de tratamiento de datos;
   - comprobar recepcion en `carlosvfx@gmail.com`;
   - comprobar copia limpia solo si se pide.
3. Comprobar en Resend:
   - dominio `aplaudia.com` sigue `verified`;
   - logs del email de prueba aparecen como entregado o con error claro.
4. Preparar legal/privacidad minima antes de quitar el aviso de construccion:
   - politica de privacidad;
   - tratamiento de datos para solicitudes;
   - cookies si aplica;
   - aviso de que no se guardan solicitudes en base de datos.
5. Probar conversaciones reales del agente:
   - servicios sin precio -> sin importes;
   - precio web -> desde + orientativo sin IVA;
   - mantenimiento -> pago anual + sin IVA;
   - builder/hosting con IA -> diferencia clara;
   - precio de imagenes/visuales -> pack personalizado sin precio unitario y sin mencionar tecnica;
   - caso real -> solo si se pide ejemplo;
   - caro/poco presupuesto -> preguntar presupuesto maximo deseado.
6. Mantener aviso de construccion hasta validacion final de Carlos.

## Validaciones base para la proxima tarea

- `npm run build`.
- `npm run lint` si esta disponible.
- QA escritorio y movil.
- Validar `/api/agent/quote` sin enviar datos reales salvo confirmacion explicita.
- Confirmar produccion tras push.

## Restricciones

- No mostrar precios en la web publica.
- No tocar dominio, DNS ni Cloudflare.
- No guardar claves ni secretos.
- No añadir base de datos salvo peticion explicita.
- No enviar datos reales sin aviso/consentimiento visible.
- No enviar un email de prueba real sin confirmacion explicita de Carlos.
- No inventar precios cerrados, plazos, garantias ni datos legales.
- No retirar el aviso de construccion hasta validacion final.
