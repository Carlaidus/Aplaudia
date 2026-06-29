# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Revisar con Carlos la versión de portfolio/casos ya desplegada en producción, ahora basada en capturas reales, sin composiciones sintéticas y con el aviso móvil corregido.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` funciona y debe mantener aviso de construcción hasta validación final.
- El portfolio usa trabajos reales:
  - Cronoras;
  - Arik Custom;
  - Aventuras Pixeladas.
- Última corrección local:
  - elimina imágenes sintéticas de Arik, Cronoras y Aventuras;
  - sustituye Arik por ficha real `kp133` y presupuesto real;
  - sustituye Aventuras por recortes reales sin overlays;
  - mejora legibilidad en fichas;
  - elimina menciones públicas a Carlos como marca y quita `Claude AI`/`Vercel` del stack visible.
- Railway CLI puede seguir sin sesión (`invalid_grant`); si ocurre, validar producción por HTTP.
- Producción ya se comprobó por HTTP y navegador tras el commit `19677cc`: rutas y assets `200`, aviso visible abajo en móvil y sin scroll horizontal.

## Tarea para la próxima sesión

1. Revisar visualmente con Carlos:
   - `https://aplaudia.com/#portfolio`;
   - `https://aplaudia.com/casos`;
   - `https://aplaudia.com/casos/cronoras`;
   - `https://aplaudia.com/casos/arik-custom`;
   - `https://aplaudia.com/casos/aventuras-pixeladas`.

2. Decidir con Carlos:
   - si las nuevas capturas de Arik Custom ya se ven reales y profesionales;
   - si Cronoras se entiende mejor con dashboard, proyectos y estadísticas;
   - si Aventuras Pixeladas vende bien con cartuchos, paneles y responsive;
   - si el tamaño de texto en fichas resulta cómodo en móvil.

3. Cerrar el siguiente foco antes de lanzamiento:
   - mantener portfolio tal cual;
   - añadir resultados reales confirmados;
   - añadir stack técnico resumido dentro de cada caso;
   - añadir proceso de trabajo;
   - preparar legal básico y llamada de contacto real;
   - decidir si se retira o se mantiene el aviso de construcción.

4. Deuda técnica recomendada:
   - instalar/configurar ESLint para que `npm run lint` funcione;
   - revisar `react-day-picker` y tipos de calendario para que `npx tsc --noEmit` pase;
   - alinear mensajes i18n de `about` en ES/CA/EN;
   - mantener `next build --webpack` mientras el workspace local siga en unidad de red.

## Validaciones recomendadas

- `npm run build`.
- `npm run lint` solo después de configurar ESLint.
- `npx tsc --noEmit` solo después de resolver deuda de tipos/i18n.
- Revisar Railway o, si no hay sesión CLI, validar producción por HTTP.
- Revisar las tres rutas de caso en móvil y escritorio.

## Restricciones

- No rediseñar la web completa.
- No cambiar identidad visual.
- No cambiar el orden general de secciones de la home.
- No inventar clientes, datos legales, resultados, cifras o testimonios.
- No usar imágenes inventadas si hay capturas reales disponibles.
- No mencionar a Carlos como marca pública.
- No mencionar programación con IA.
- No tocar dominio, DNS ni Cloudflare salvo petición explícita.
- No añadir backend, base de datos, auth ni pagos.
- No guardar secretos.

## Cierre esperado de la próxima sesión

- Railway/producción en verde.
- Portfolio revisado visualmente en producción.
- Decisión de Carlos sobre si queda listo para pasar a legal/contacto y validación final.
