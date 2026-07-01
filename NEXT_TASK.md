# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Estado tras la ultima ejecucion

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
- Se creo flujo `Presupuesto` dentro del chatbot:
  - nombre;
  - email;
  - telefono opcional;
  - tipo de negocio/proyecto;
  - interes principal;
  - presupuesto/rango opcional;
  - copia limpia opcional;
  - consentimiento visible antes de enviar.
- Nuevo endpoint: `/api/agent/quote`.
- Email interno provisional: `carlosvfx@gmail.com` por `siteConfig.contact.email`, salvo override de entorno.
- No se guarda nada en base de datos.
- Textarea del chatbot validado en escritorio: se limpia con boton y Enter.
- Produccion `https://aplaudia.com` validada.
- Railway CLI sigue sin sesion valida (`invalid_grant` / `Unauthorized`), pero produccion confirma despliegue efectivo.

## Proximo foco real

Hacer una prueba real controlada del envio de presupuesto y preparar legal/privacidad antes de retirar el aviso de construccion.

## Tareas recomendadas

1. Confirmar con Carlos si quiere enviar un email real de prueba desde produccion.
2. Si Carlos confirma:
   - completar el formulario `Presupuesto` con datos de prueba claros;
   - enviar con consentimiento marcado;
   - confirmar recepcion en `carlosvfx@gmail.com`;
   - si se marca copia cliente, comprobar que llega limpia y sin notas internas.
3. Revisar variables de entorno en Railway:
   - `RESEND_API_KEY`;
   - `EMAIL_FROM`;
   - `CONTACT_RECIPIENT_EMAIL` o `CONTACT_TO_EMAIL`;
   - confirmar que el destinatario provisional sea `carlosvfx@gmail.com`.
4. Preparar legal/privacidad minima:
   - politica de privacidad;
   - texto de tratamiento de datos para formularios;
   - cookies si aplica;
   - aviso de que no se guardan solicitudes en base de datos.
5. Probar conversaciones reales del agente:
   - servicios sin precio -> sin importes;
   - precio web -> desde + orientativo sin IVA;
   - mantenimiento -> pago anual + sin IVA;
   - builder/hosting con IA -> diferencia clara;
   - solicitud de presupuesto -> invita a usar boton `Presupuesto`.
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
