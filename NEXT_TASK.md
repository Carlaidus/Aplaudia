# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Revisar en produccion con Carlos la segunda pasada de portfolio/casos y decidir si Aplaudia queda lista para validacion final de lanzamiento o si necesita una ultima capa de contenido comercial.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` funciona y debe mantener aviso de construccion hasta validacion final de Carlos.
- Railway queda en verde tras la segunda pasada de portfolio:
  - deployment activo `Improve real portfolio case studies`;
  - commit desplegado `d1cd38c`;
  - resultado Railway web `Deployment successful`.
- El portfolio ya usa trabajos reales:
  - Cronoras.
  - Arik Custom.
  - Aventuras Pixeladas.
- Se mantiene estrategia hibrida:
  - resumen potente dentro de Aplaudia;
  - ficha propia por caso;
  - enlace externo a web/demo real cuando procede.
- No tocar backend, base de datos, auth, pagos, dominio, DNS ni Cloudflare salvo peticion explicita.

## Estado de la ultima tarea

Se ha reforzado el portfolio/casos sin redisenar la web:

- Home `#portfolio`:
  - mantiene tres tarjetas reales;
  - anade el bloque `Que ensena` para explicar valor comercial;
  - conserva orden, estilo y comportamiento visual general.
- `/casos`:
  - anade resumen comercial por proyecto.
- Fichas individuales:
  - `/casos/cronoras`;
  - `/casos/arik-custom`;
  - `/casos/aventuras-pixeladas`;
  - ahora incluyen galeria de vistas clave y puntos de valor visible.
- Imagenes WebP nuevas en `public/portfolio/`:
  - Cronoras: dashboard, proyectos, estadisticas y proyecto en curso.
  - Arik Custom: home como imagen principal; catalogo como secundaria.
  - Aventuras Pixeladas: home completa, cartuchos y paneles.
- Validacion local:
  - `npm run build` OK desde unidad `T:`;
  - `npm run lint` sigue sin estar disponible porque `eslint` no esta instalado;
  - `npx tsc --noEmit` sigue fallando por deuda previa ajena a esta tarea;
  - mobile 390 px sin overflow horizontal real en home, `/casos` y las tres fichas.

## Tarea para la proxima sesion

1. Revisar en produccion:
   - abrir `https://aplaudia.com/#portfolio`;
   - abrir `https://aplaudia.com/casos`;
   - abrir las tres fichas de caso.

2. Revisar con Carlos en movil real y escritorio:
   - si Cronoras se entiende como SaaS/producto real;
   - si Arik Custom vende mejor con la home como imagen principal;
   - si Aventuras Pixeladas comunica bien cartuchos, paneles y base editorial;
   - si el aviso de construccion sigue siendo correcto hasta validacion final.

3. Decidir contenido final antes de lanzamiento:
   - mantener tal cual;
   - anadir resultados reales confirmados;
   - anadir stack tecnico resumido;
   - anadir proceso de trabajo;
   - anadir testimonios solo si existen textos reales aprobados.

4. Deuda tecnica recomendada:
   - instalar/configurar ESLint para que `npm run lint` funcione;
   - revisar `react-day-picker` y tipos de calendario para que `npx tsc --noEmit` pase;
   - alinear mensajes i18n de `about` en ES/CA/EN;
   - mantener `next build --webpack` mientras el workspace local siga en unidad de red.

## Validaciones recomendadas

- `npm run build`.
- `npm run lint` solo despues de configurar ESLint.
- `npx tsc --noEmit` solo despues de resolver deuda de tipos/i18n.
- Revisar Railway.
- Revisar `https://aplaudia.com/#portfolio`.
- Revisar `https://aplaudia.com/casos`.
- Revisar las tres rutas de caso en movil y escritorio.

## Restricciones

- No redisenar la web completa.
- No cambiar identidad visual.
- No cambiar el orden general de secciones de la home.
- No inventar clientes, datos legales, resultados, cifras o testimonios.
- No usar capturas privadas ni paneles con datos reales sensibles.
- No tocar dominio, DNS ni Cloudflare salvo peticion explicita.
- No anadir backend, base de datos, auth ni pagos.
- No guardar secretos.

## Cierre esperado de la proxima sesion

- Railway en verde tras el ultimo push.
- Portfolio real revisado en produccion.
- Decision de Carlos sobre si se retira el aviso de construccion o si queda una ultima revision comercial/legal antes del lanzamiento.
