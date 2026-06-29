# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Auditar y optimizar el rendimiento percibido de `https://aplaudia.com` en movil y escritorio. Carlos confirma que, aunque la revision movil anterior corrigio titulares y aviso, la pagina se percibe lenta y algunas animaciones se cortan o dan tirones.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` responde `200`.
- `https://www.aplaudia.com/` redirige con `301` a `https://aplaudia.com/`.
- `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200` en `aplaudia.com`.
- Railway esta en verde.
- Deployment funcional validado en la tarea anterior: `5546e2bc-0061-4a45-a383-d62a3c0d546d`, `SUCCESS`, 2026-06-29 13:11:39 +02:00.
- Commit funcional validado de la revision movil anterior: `76ee74bf5a3cc9e6e0f2a3aa5df938b87cb02369`.
- La home mantiene aviso de construccion.
- En movil y tablet, el aviso arranca como pastilla compacta bajo el header y puede abrirse/minimizarse.
- En desktop, el aviso se muestra completo por defecto.
- No tocar backend, base de datos, auth ni pagos.

## Estado de la ultima tarea movil

Ya se corrigio la revision movil detectada por Carlos:

- El hero `Presencia digital que impulsa tu negocio` ya no parte palabras ni deja letras sueltas.
- El scroll story usa `Tu negocio merece una presencia digital que impacte`.
- Los titulares principales se revisaron en 360 px, 390 px, 430 px, tablet y desktop.
- El aviso de construccion ya no tapa CTAs ni controles en movil.
- `npm run build` pasa con `next build --webpack`.
- `npm run lint` no esta disponible porque el repo define `eslint .`, pero `eslint` no esta instalado como dependencia.

## Problema nuevo detectado por Carlos

- En movil, la pagina se percibe lenta.
- En escritorio tambien se percibe pesada al ejecutarla.
- A veces las animaciones se cortan o dan tirones.
- Hay que revisar toda la home, no solo el hero.

## Sospechas tecnicas a revisar

- Exceso de componentes `motion` animando a la vez.
- Demasiados `useInView` en tarjetas o secciones.
- Animaciones ligadas al scroll/parallax.
- Loops infinitos innecesarios.
- Blur/glow/backdrop-blur caros en movil.
- Sombras grandes o fondos animados que repintan demasiado.
- Animaciones de escala/rotacion en muchas tarjetas.
- Efectos hover o whileInView innecesarios en dispositivos tactiles.
- Re-renderizados por estado local de hover o inView.
- Falta de `prefers-reduced-motion` o modo movil simplificado.

## Tarea para Codex

1. Auditar rendimiento real:
   - Probar en 360 px, 390 px, 430 px, tablet y desktop.
   - Usar Performance/Lighthouse/DevTools si esta disponible.
   - Identificar animaciones con jank, dropped frames, alto scripting, repaints caros o layout shifts.
   - Revisar consola por warnings/errores.

2. Optimizar sin redisenar:
   - Mantener identidad visual premium.
   - Mantener orden de secciones.
   - Reducir animaciones simultaneas.
   - Desactivar o simplificar animaciones caras en movil.
   - Reducir loops infinitos que no aporten mucho.
   - Usar `transform` y `opacity` cuando haya animaciones.
   - Evitar animar propiedades caras.
   - Reducir blur/glow/backdrop pesado en movil.
   - Eliminar hover animation en dispositivos tactiles si genera coste.
   - Aplicar `prefers-reduced-motion` o un hook/utility para suavizar animaciones.
   - Evitar re-renderizados innecesarios.

3. Revisar secciones concretas:
   - `components/sections/hero.tsx`
   - `components/sections/scroll-story.tsx`
   - `components/sections/services.tsx`
   - `components/sections/showcase.tsx`
   - `components/sections/visual-gallery.tsx`
   - `components/sections/benefits.tsx`
   - `components/sections/about.tsx`
   - `components/sections/final-cta.tsx`
   - `components/sections/construction-notice.tsx`
   - `components/sections/header.tsx`

4. Mantener lo ya corregido:
   - No volver a romper los titulares moviles.
   - No volver a hacer intrusivo el aviso de construccion.
   - Mantener la pastilla/minimizado en movil y tablet.
   - Mantener canonical, robots, sitemap, `/llms.txt` y JSON-LD.

5. Validaciones obligatorias:
   - `npm install` si hace falta.
   - `npm run build`.
   - `npm run lint` si esta disponible.
   - Probar home en movil y escritorio.
   - Comprobar que no hay errores de consola relevantes.
   - Probar `https://aplaudia.com` tras deploy.
   - Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
   - Confirmar Railway en verde.

6. Documentacion:
   - Actualizar `LAST_REPORT.md` con:
     - problema detectado;
     - causa probable o causa confirmada;
     - animaciones/efectos optimizados;
     - archivos tocados;
     - validaciones ejecutadas;
     - estado final de Railway;
     - estado final de `https://aplaudia.com`.
   - Actualizar `NEXT_TASK.md` con el siguiente foco.

## Restricciones

- No redisenar la web.
- No cambiar identidad visual.
- No cambiar el orden de secciones salvo necesidad justificada.
- No sustituir la landing por una version simplificada.
- No tocar dominio, DNS ni Cloudflare salvo que Carlos lo pida explicitamente.
- No anadir backend, base de datos, auth ni pagos.
- No guardar secretos.
- No inventar datos legales, direccion, telefono, CIF ni clientes reales.

## Cierre esperado

- Commit claro.
- Railway en verde.
- `https://aplaudia.com` revisada en movil y escritorio.
- Animaciones mas fluidas, sin tirones evidentes.
- Mismos contenidos y misma identidad visual, pero menos pesada.
- `LAST_REPORT.md` actualizado con el resultado real.
