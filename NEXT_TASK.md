# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Estado tras la ultima ejecucion

- Email:
  - Resend no se usa actualmente como proveedor activo de Aplaudia;
  - se ha eliminado la dependencia `resend` del codigo;
  - `/api/contacto` y `/api/agent/quote` usan Cloudflare Email Service para envio interno;
  - Cloudflare Email Routing queda como recepcion/redireccion de aliases publicos;
  - no se envia copia automatica al cliente;
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
- El endpoint `/api/agent/quote` usa Cloudflare Email Service, no guarda en base de datos y envia solo email interno a una direccion verificada.
- Si el cliente pide copia, no se envia copia automatica: se anade una nota interna para que una persona de Aplaudia le responda o le envie copia manualmente.
- Los datos no se usan para newsletter, publicidad ni otros fines.
- Produccion `https://aplaudia.com` validada tras el push del commit `676584e`.
- Railway CLI sigue sin sesion valida (`invalid_grant` / `Unauthorized`); usar dashboard o reloguear CLI si hace falta revisar Railway por dentro.
- Correo:
  - `/api/agent/quote` y `/api/contacto` usan `lib/email/cloudflare-email.ts`;
  - variables necesarias: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_EMAIL_API_TOKEN`, `EMAIL_FROM`, `INTERNAL_EMAIL_RECIPIENT`;
  - destinatario interno provisional: `carlosvfx@gmail.com`;
  - el receptor interno puede configurarse con `AGENT_QUOTE_RECIPIENT_EMAIL`, `INTERNAL_EMAIL_RECIPIENT`, `CONTACT_RECIPIENT_EMAIL` o `CONTACT_TO_EMAIL`;
  - la direccion logica recomendada para solicitudes es `presupuestos@aplaudia.com` cuando Cloudflare Email Routing este probado;
  - Resend puede quedar dormido en Railway/DNS, pero no es camino activo;
  - no guardar secretos en el repo.
- Cloudflare Email Routing:
  - recomendado para aliases publicos gratuitos: `hola@aplaudia.com`, `presupuestos@aplaudia.com`, `soporte@aplaudia.com`, `legal@aplaudia.com`;
  - debe reenviar a `carlosvfx@gmail.com`;
  - no crea buzones ni permite responder como `@aplaudia.com` sin Google Workspace, SMTP o proveedor equivalente;
  - pasos documentados en `docs/email-strategy-aplaudia.md`.
- Cloudflare Email Service:
  - debe activarse/verificarse en Cloudflare;
  - debe verificar el remitente `hola@aplaudia.com` o el remitente elegido;
  - debe poder enviar solo a destinos internos verificados.
- Produccion validada:
  - precio de imagenes/visuales responde con pack personalizado, sin precio unitario;
  - tras orientar en precios puede ofrecer enviar resumen a una persona de Aplaudia;
  - no ofrece copia automatica al cliente;
  - `/api/agent/quote` corta sin consentimiento con `400`.

## Proximo foco real

Confirmar Cloudflare Email Routing + Cloudflare Email Service y hacer una prueba real controlada solo si Carlos autoriza enviar un email de prueba.

## Tareas recomendadas

1. Confirmar con Carlos si autoriza enviar un email real de prueba desde produccion.
2. Si Carlos confirma:
   - abrir `https://aplaudia.com`;
   - pedir conversacionalmente enviar un resumen;
   - facilitar datos ficticios claros;
   - aceptar el texto de tratamiento de datos;
   - comprobar recepcion en el receptor interno configurado;
   - si el usuario pide copia, comprobar que solo aparece como nota interna y que no se envia copia automatica al cliente.
3. Comprobar en Cloudflare Email Service:
   - `hola@aplaudia.com` o remitente elegido aparece verificado;
   - `carlosvfx@gmail.com` o destino interno aparece verificado;
   - logs del email de prueba aparecen como entregado, en cola o con error claro.
4. Preparar legal/privacidad minima antes de quitar el aviso de construccion:
   - politica de privacidad;
   - tratamiento de datos para solicitudes;
   - cookies si aplica;
   - aviso de que no se guardan solicitudes en base de datos.
5. Confirmar Cloudflare Email Routing:
   - verificar `carlosvfx@gmail.com` como destino;
   - crear `hola@aplaudia.com`, `presupuestos@aplaudia.com`, `soporte@aplaudia.com` y `legal@aplaudia.com`;
   - probar recepcion externa sin tocar codigo.
6. Si Carlos quiere limpiar Resend:
   - revisar manualmente variables Railway historicas;
   - revisar manualmente registros DNS historicos de Resend;
   - no borrar nada sin confirmar que Cloudflare Email Service ya funciona.
7. Probar conversaciones reales del agente:
   - servicios sin precio -> sin importes;
   - precio web -> desde + orientativo sin IVA;
   - mantenimiento -> pago anual + sin IVA;
   - builder/hosting con IA -> diferencia clara;
   - precio de imagenes/visuales -> pack personalizado sin precio unitario y sin mencionar tecnica;
   - caso real -> solo si se pide ejemplo;
   - caro/poco presupuesto -> preguntar presupuesto maximo deseado.
8. Mantener aviso de construccion hasta validacion final de Carlos.

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
