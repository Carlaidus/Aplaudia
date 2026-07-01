# NEXT TASK - Aplaudia

Prioridad: Media-Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Estado tras la ultima ejecucion

- Chatbot validado en escritorio y movil:
  - escritorio con burbujas a `17px`;
  - movil con burbujas a `16px`;
  - textarea limpio al enviar con boton;
  - textarea limpio al enviar con Enter;
  - textarea vuelve a altura minima de 48px;
  - la pregunta queda solo como burbuja en el historial.
- Agente actualizado:
  - no debe hablar de precios si no se preguntan explicitamente;
  - si habla de precios, debe indicar importes orientativos sin IVA;
  - mantenimiento se explica como servicio mensual, normalmente con pago anual;
  - `/api/agent` sigue leyendo `content/agent/aplaudia-agent.md` completo como fuente principal.
- Produccion `https://aplaudia.com` validada:
  - home `200`;
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml` `200`;
  - API del agente responde con `provider: openai`;
  - aviso de construccion sigue visible.
- Railway CLI sigue sin sesion valida (`invalid_grant` / `Unauthorized`), pero produccion confirma despliegue efectivo.

## Proximo foco real

Validar el chatbot con uso real desde movil y preparar el cierre de lanzamiento sin retirar todavia el aviso de construccion.

## Tareas recomendadas

1. Probar dictado real en movil:
   - Chrome/Edge Android si es posible;
   - frase larga con pausas naturales;
   - parada manual del microfono;
   - envio despues de dictar;
   - comprobar que el textarea queda vacio y a 48px.
2. Revisar conversaciones reales del agente:
   - servicios sin precio -> sin importes;
   - precio web -> `desde` + orientativo sin IVA;
   - mantenimiento -> mensual, normalmente pago anual, alcance por definir;
   - fuera de ambito -> redirige a Aplaudia;
   - casos reales -> Cronoras, Arik Custom y Aventuras Pixeladas.
3. Preparar legal/contacto antes de levantar el aviso de construccion:
   - privacidad;
   - cookies si aplica;
   - textos legales minimos;
   - confirmacion de email receptor y remitente de Resend en entorno, sin guardar secretos.
4. Revisar visuales finales:
   - decidir si se anade sexta/septima imagen;
   - decidir si se prepara un primer video corto;
   - mantener rendimiento y no romper movil.

## Validaciones base para la proxima tarea

- `npm run build`.
- `npm run lint` si esta disponible.
- QA movil y escritorio.
- Confirmar produccion tras push.
- Confirmar que el aviso de construccion sigue visible hasta validacion final de Carlos.

## Restricciones

- No redisenar la web completa.
- No tocar dominio, DNS ni Cloudflare.
- No guardar claves ni secretos.
- No inventar datos legales, plazos, garantias ni precios cerrados.
- No retirar el aviso de construccion hasta validacion final.
