# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Validar con Carlos en dispositivos reales que la version movil de `https://aplaudia.com` ya se ve seria, sin solapes ni palabras montadas, y decidir si se puede cerrar lanzamiento manteniendo o ajustando el aviso de construccion.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` responde `200`.
- `https://www.aplaudia.com/` redirige con `301` a `https://aplaudia.com/`.
- `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200` en `aplaudia.com`.
- Railway esta en verde tras el arreglo visual movil.
- Deployment funcional validado: `a648beb1-d9d0-4ed8-b729-330048918857`, `SUCCESS`, 2026-06-29 19:26:09 +02:00.
- Commit funcional validado: `79e820aca589764c002f4078ba6cf6d368897fb6`.
- La home mantiene aviso de construccion.
- En movil, el aviso se muestra como pastilla en el inicio y como boton compacto al hacer scroll.
- En desktop, el aviso se muestra completo por defecto.
- No tocar backend, base de datos, auth ni pagos.

## Estado de la ultima tarea

Ya se corrigio la rotura visual movil sin redisenar:

- Hero movil sin solape entre `impulsa` y `tu negocio`.
- Titular de servicios sin palabras montadas en `brillar en digital`.
- Pastilla de construccion no tapa etiquetas superiores de seccion al hacer scroll.
- Aviso de construccion sigue visible y se puede abrir/minimizar.
- Validado `npm run build`.
- `npm run lint` sigue sin estar disponible porque `eslint` no esta instalado.
- Produccion revisada sin errores relevantes de consola.

Se mantiene el contexto anterior:

- Movimiento reducido global en movil/tactil y con `prefers-reduced-motion`.
- Glows y fondos de bucle continuo convertidos en estaticos.
- Hover complejo desactivado en dispositivos tactiles.
- `repeat: Infinity` reducido previamente de 34 apariciones a 1 loop principal del hero en escritorio.
- SEO tecnico, robots, sitemap, `/llms.txt` y JSON-LD siguen apuntando a `https://aplaudia.com`.

## Tarea para Carlos / proxima sesion

1. Revisar `https://aplaudia.com` en dispositivos reales:
   - movil pequeno;
   - movil medio;
   - movil grande;
   - tablet;
   - escritorio.

2. Confirmar experiencia real:
   - hero serio y legible desde la primera carga;
   - titulares sin palabras pegadas;
   - sin solapes con el aviso de construccion;
   - scroll fluido;
   - pastilla/boton de construccion abre y minimiza;
   - CTA y textos finales se leen correctamente.

3. Decidir si la web esta lista para lanzamiento publico:
   - mantener aviso de construccion;
   - suavizar aviso;
   - retirar aviso cuando Carlos valide.

4. Antes de retirar el aviso, cerrar pendientes de negocio:
   - contacto real o canal definitivo de WhatsApp;
   - textos finales CA/EN si se mantienen idiomas secundarios;
   - legales basicos si se activa como pagina comercial definitiva;
   - decidir si se anade analitica.

5. Deuda tecnica opcional:
   - instalar/configurar ESLint para que `npm run lint` funcione;
   - revisar si se mantiene `next build --webpack` mientras el workspace local siga en unidad de red mapeada.

## Validaciones recomendadas en la proxima sesion

- `npm run build`.
- `npm run lint` solo si se instala/configura ESLint.
- Revisar `https://aplaudia.com`.
- Revisar `https://www.aplaudia.com`.
- Revisar `https://aplaudia.com/robots.txt`.
- Revisar `https://aplaudia.com/llms.txt`.
- Revisar `https://aplaudia.com/sitemap.xml`.
- Confirmar Railway en verde tras cualquier commit nuevo.

## Restricciones

- No redisenar la web.
- No cambiar identidad visual.
- No cambiar el orden de secciones salvo necesidad justificada.
- No tocar dominio, DNS ni Cloudflare salvo que Carlos lo pida explicitamente.
- No anadir backend, base de datos, auth ni pagos.
- No guardar secretos.
- No inventar datos legales, direccion, telefono, CIF ni clientes reales.

## Cierre esperado de la proxima sesion

- Decision clara sobre lanzamiento y aviso de construccion.
- Estado de lanzamiento documentado en `LAST_REPORT.md`.
- Railway en verde.
- `https://aplaudia.com` validada en dispositivo real.
