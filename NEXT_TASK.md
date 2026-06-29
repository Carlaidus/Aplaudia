# NEXT TASK - Aplaudia

Prioridad: Media-Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Validar con Carlos la sensacion real de fluidez de `https://aplaudia.com` en dispositivos reales y decidir el cierre de lanzamiento.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` responde `200`.
- `https://www.aplaudia.com/` redirige con `301` a `https://aplaudia.com/`.
- `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200` en `aplaudia.com`.
- Railway esta en verde.
- Deployment funcional optimizado: `7d5dff89-9d40-4ae9-8d98-e1a5bd22b73e`, `SUCCESS`, 2026-06-29 15:00:37 +02:00.
- Commit funcional optimizado: `85c31ac6b63c54e0e44dd4c09e3fc58ae3d39ac6`.
- La home mantiene aviso de construccion.
- En movil y tablet, el aviso arranca como pastilla compacta y puede abrirse/minimizarse.
- En desktop, el aviso se muestra completo por defecto.
- No tocar backend, base de datos, auth ni pagos.

## Estado de la ultima tarea

Ya se optimizo el rendimiento percibido sin redisenar:

- Movimiento reducido global en movil/tactil y con `prefers-reduced-motion`.
- Animacion letra a letra del hero desactivada en modo ligero.
- Glows y fondos de bucle continuo convertidos en estaticos.
- Hover complejo desactivado en dispositivos tactiles.
- `repeat: Infinity` reducido de 34 apariciones en secciones a 1 loop principal del hero en escritorio.
- Validado `npm run build`.
- `npm run lint` sigue sin estar disponible porque `eslint` no esta instalado.
- Produccion revisada sin errores relevantes de consola.

## Tarea para Carlos / proxima sesion

1. Revisar `https://aplaudia.com` en dispositivos reales:
   - movil pequeno;
   - movil medio;
   - movil grande;
   - tablet;
   - escritorio.

2. Confirmar sensacion real:
   - scroll fluido;
   - animaciones sin cortes evidentes;
   - hero serio y legible;
   - titulares sin palabras pegadas;
   - aviso de construccion no intrusivo;
   - pastilla de construccion abre y minimiza.

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
