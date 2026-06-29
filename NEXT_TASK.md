# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Corregir la experiencia movil de `https://aplaudia.com` antes de quitar el aviso de construccion. El dominio ya esta conectado y Railway esta en verde, pero Carlos ha detectado problemas visuales en movil.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` responde `200`.
- `https://www.aplaudia.com/` redirige con `301` a `https://aplaudia.com/`.
- `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200` en `aplaudia.com`.
- Railway esta en verde.
- La home mantiene aviso de construccion.
- No tocar backend, base de datos, auth ni pagos.

## Problemas detectados por Carlos en movil

- Algunos titulos no se leen bien en movil.
- En el hero, `Presencia digital que impulsa tu negocio` rompe mal: una letra de `digital` queda sola en otra linea.
- En la seccion de scroll story, el texto `Tu negocio merece una presencia digital que realmente impacte` se percibe raro y mal compuesto en movil.
- Hay titulos que no parecen centrados o no quedan bien equilibrados en pantalla pequena.
- El aviso flotante de construccion esta bien, pero tapa demasiado contenido en movil. Debe poder minimizarse, ocultarse o convertirse en una pastilla pequena para seguir viendo la pagina.

## Tarea para Codex

1. Revisar visualmente la home completa en movil real/simulado:
   - 360 px de ancho.
   - 390 px de ancho.
   - 430 px de ancho.
   - Tambien comprobar tablet y desktop para no romperlos.

2. Corregir sin cambiar la identidad visual:
   - centrado de titulos;
   - saltos de linea raros;
   - palabras partidas o letras sueltas;
   - exceso de tamano en titulares moviles;
   - max-width y line-height en titulos largos;
   - `text-balance`, `break-words`, `hyphens`, `leading`, `tracking` o clases responsive si hace falta.

3. Revisar especificamente:
   - `components/sections/hero.tsx`;
   - `components/sections/scroll-story.tsx`;
   - `components/sections/construction-notice.tsx`;
   - cualquier otra seccion donde los titulos se vean raros en movil.

4. Copy movil:
   - Si el texto `Tu negocio merece una presencia digital que realmente impacte` sigue quedando raro, ajustar el texto a una frase mas natural, por ejemplo `Tu negocio merece una presencia digital que impacte` o equivalente.
   - Mantener espanol de Espana.
   - Si se cambia copy, actualizar i18n ES/CA/EN de forma coherente.

5. Aviso de construccion:
   - Mantenerlo visible por defecto.
   - Anadir una accion clara para minimizarlo o esconderlo.
   - Cuando este minimizado, mostrar una pastilla/boton pequeno que permita volver a abrirlo.
   - En movil no debe tapar navegacion, CTAs ni impedir revisar la pagina.
   - Debe ser accesible: botones con aria-label y foco correcto.
   - Puede persistir el estado con localStorage o sessionStorage si es razonable, pero no es obligatorio.

6. Validaciones obligatorias:
   - `npm install` si hace falta.
   - `npm run build`.
   - `npm run lint` si esta disponible.
   - Probar home en movil.
   - Probar `https://aplaudia.com` tras deploy.
   - Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
   - Confirmar Railway en verde.

7. Documentacion:
   - Actualizar `LAST_REPORT.md` con cambios, archivos tocados, validaciones y estado final.
   - Actualizar `NEXT_TASK.md` si cambia el siguiente foco.

## Restricciones

- No redisenar la web.
- No cambiar identidad visual.
- No cambiar el orden de secciones salvo necesidad justificada.
- No tocar dominio, DNS ni Cloudflare.
- No anadir backend, base de datos, auth ni pagos.
- No guardar secretos.

## Cierre esperado

- Commit claro.
- Railway en verde.
- `https://aplaudia.com` revisada en movil.
- Aviso de construccion minimizable o no intrusivo.
- Titulares moviles sin saltos de linea raros ni letras sueltas.
