# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Revisar con Carlos si los casos de Cronoras, Arik Custom y Aventuras Pixeladas comunican bien lo que vende Aplaudia y decidir si se amplian antes de retirar el aviso de construccion.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` funciona y mantiene aviso de construccion.
- Railway quedo en verde tras desplegar el portfolio real.
- Deployment verificado en Railway web: `Add real portfolio case studies`, `Deployment successful`.
- El portfolio ya no debe usar proyectos demo ni placeholders.
- Se han anadido casos reales basados en trabajos de Carlos:
  - Cronoras.
  - Arik Custom.
  - Aventuras Pixeladas.
- Se ha elegido una estrategia hibrida:
  - mini caso dentro de Aplaudia;
  - enlace a la web/demo real cuando procede.
- No tocar backend, base de datos, auth, pagos, dominio, DNS ni Cloudflare salvo peticion explicita de Carlos.

## Estado de la ultima tarea

Se preparo una primera estructura real de portfolio/casos:

- Home `#portfolio` con tres tarjetas reales.
- Imagenes WebP optimizadas en `public/portfolio/`.
- Rutas nuevas:
  - `/casos`
  - `/casos/cronoras`
  - `/casos/arik-custom`
  - `/casos/aventuras-pixeladas`
- Sitemap actualizado con las rutas de casos.
- Aviso de construccion visible tambien en las rutas nuevas.
- Build local validado.
- Produccion validada en `https://aplaudia.com/#portfolio`, `/casos` y las tres fichas.
- Lint sigue sin estar disponible porque `eslint` no esta instalado.

## Tarea para la proxima sesion

1. Revisar con Carlos en produccion:
   - `https://aplaudia.com/#portfolio`;
   - `https://aplaudia.com/casos`;
   - `https://aplaudia.com/casos/cronoras`;
   - `https://aplaudia.com/casos/arik-custom`;
   - `https://aplaudia.com/casos/aventuras-pixeladas`.

2. Validar en movil real y escritorio:
   - sin solapes;
   - sin palabras pegadas;
   - imagenes bien recortadas;
   - botones legibles;
   - aviso de construccion visible;
   - sin overflow horizontal.

3. Carlos debe decidir si:
   - estas tres fichas son suficientes para lanzamiento;
   - conviene anadir una segunda captura por caso;
   - conviene ampliar cada ficha con proceso, stack tecnico o resultados;
   - se mantienen los enlaces a Railway en Arik/Aventuras o se sustituyen por dominios propios cuando existan.

4. Deuda tecnica opcional:
   - instalar/configurar ESLint para que `npm run lint` funcione;
   - revisar si se mantiene `next build --webpack` mientras el workspace local siga en unidad de red mapeada;
   - anadir JSON-LD de casos solo si se decide una estructura SEO definitiva para portfolio.

## Validaciones recomendadas

- `npm run build`.
- `npm run lint` solo si se instala/configura ESLint.
- Revisar Railway solo si se hace un commit nuevo.
- Revisar `https://aplaudia.com/#portfolio`.
- Revisar las cuatro rutas de `/casos`.
- Revisar `https://aplaudia.com/sitemap.xml`.

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
- Portfolio real validado en produccion.
- Decision de Carlos sobre si los casos quedan listos para lanzamiento o necesitan una segunda pasada comercial.
