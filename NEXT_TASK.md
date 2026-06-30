# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Validar el dictado por voz del chatbot en producción con permiso real de micrófono y revisar respuestas reales del agente tras la ampliación de instrucciones y precios orientativos.

## Repo

`Carlaidus/Aplaudia`

## Contexto confirmado

- `https://aplaudia.com/` funciona.
- La home debe mantener aviso de construcción hasta validación final de Carlos.
- El aviso de construcción queda flotando a la izquierda.
- El aviso de construcción usa fecha `30 junio 2026`.
- El chatbot queda flotando a la derecha.
- El formulario de contacto no muestra `Actualizar mensaje`.
- `/api/agent` prioriza OpenAI directamente con `OPENAI_API_KEY`.
- `OPENAI_API_KEY` está activa en producción.
- El chatbot incorpora dictado por voz con Web Speech API:
  - `SpeechRecognition`;
  - `webkitSpeechRecognition`;
  - idioma `es-ES`;
  - resultados parciales;
  - limpieza al cerrar/desmontar;
  - botón visible aunque no haya soporte, mostrando aviso discreto al tocarlo.
- `content/agent/aplaudia-agent.md` incluye identidad, servicios, casos reales y precios orientativos.
- No hay base de datos, auth ni pagos.
- No guardar secretos en el repo.

## Próxima tarea

1. Probar dictado por voz en producción:
   - Chrome/Edge en escritorio;
   - Android si hay dispositivo disponible;
   - iPhone/Safari si hay dispositivo disponible.
2. Confirmar:
   - aparece el botón de micrófono si el navegador lo soporta;
   - pide permiso de micrófono;
   - transcribe al textarea;
   - permite parar escucha;
   - permite enviar tras dictado;
   - no se solapa con enviar ni con el texto;
   - no rompe móvil.
3. Probar respuestas reales del agente sobre:
   - precios de webs;
   - agentes IA web;
   - integración con WhatsApp;
   - visuales, imagen y vídeo;
   - mantenimiento;
   - casos Cronoras, Arik Custom y Aventuras Pixeladas.
4. Verificar que el agente:
   - usa siempre precios orientativos con `desde`;
   - no da presupuesto cerrado;
   - no inventa plazos;
   - no inventa garantías;
   - no inventa datos legales;
   - no menciona programación con IA.
5. Ajustar `content/agent/aplaudia-agent.md` solo si las pruebas reales muestran respuestas mejorables.
6. Continuar con email real del formulario si Carlos ya tiene Resend listo:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`.
7. Revisar legal/contacto antes de retirar el aviso de construcción:
   - aviso legal;
   - privacidad;
   - cookies si aplica;
   - texto definitivo de consentimiento.

## Deuda técnica recomendada

- Instalar/configurar ESLint para que `npm run lint` funcione de forma reproducible.
- Resolver tipos de `react-day-picker`.
- Alinear mensajes i18n de `about` en ES/CA/EN para que `npx tsc --noEmit` pase.
- Mantener `next build --webpack` mientras el workspace local siga en unidad de red.

## Restricciones

- No rediseñar la web completa.
- No romper home, casos, móvil ni escritorio.
- No tocar dominio, DNS ni Cloudflare salvo petición explícita.
- No añadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programación con IA como mensaje público.
- No inventar datos legales, dirección, CIF, precios cerrados, plazos ni garantías.

## Cierre esperado de la próxima sesión

- Dictado real probado o limitación documentada por navegador/dispositivo.
- Agente probado en producción con varias preguntas reales de precios y servicios.
- Ajustes del prompt documentados si hacen falta.
- Siguiente decisión clara sobre Resend, legal y retirada del aviso de construcción.
