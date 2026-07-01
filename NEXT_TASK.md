# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Estado tras la ultima ejecucion

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
- Produccion `https://aplaudia.com` validada tras el push del commit `6bad907`.
- Railway CLI sigue sin sesion valida (`invalid_grant` / `Unauthorized`); usar dashboard o reloguear CLI si hace falta revisar Railway por dentro.

## Proximo foco real

Probar el flujo conversacional completo en produccion con datos de prueba controlados y confirmar si `RESEND_API_KEY` esta activo en Railway.

## Tareas recomendadas

1. Confirmar con Carlos si autoriza enviar un email real de prueba desde produccion.
2. Si Carlos confirma:
   - abrir `https://aplaudia.com`;
   - pedir conversacionalmente enviar un resumen;
   - facilitar datos ficticios claros;
   - aceptar el texto de tratamiento de datos;
   - comprobar recepcion en `carlosvfx@gmail.com`;
   - comprobar copia limpia solo si se pide.
3. Revisar variables de entorno en Railway:
   - `RESEND_API_KEY`;
   - `EMAIL_FROM`.
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
