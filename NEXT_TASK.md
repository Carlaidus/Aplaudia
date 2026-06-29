# NEXT TASK - Aplaudia

Prioridad: Media-Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Validar con Carlos la experiencia movil real de `https://aplaudia.com` y decidir el cierre de lanzamiento: mantener, suavizar o retirar el aviso de construccion cuando Carlos confirme que la web puede hacerse publica.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` responde `200`.
- `https://www.aplaudia.com/` redirige con `301` a `https://aplaudia.com/`.
- `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200` en `aplaudia.com`.
- Railway esta en verde.
- Deployment funcional validado: `5546e2bc-0061-4a45-a383-d62a3c0d546d`, `SUCCESS`, 2026-06-29 13:11:39 +02:00.
- Commit funcional validado: `76ee74bf5a3cc9e6e0f2a3aa5df938b87cb02369`.
- La home mantiene aviso de construccion.
- En movil y tablet, el aviso arranca como pastilla compacta bajo el header y puede abrirse/minimizarse.
- En desktop, el aviso se muestra completo por defecto.
- No tocar backend, base de datos, auth ni pagos.

## Estado de la ultima tarea

Ya se corrigio la revision movil detectada por Carlos:

- El hero `Presencia digital que impulsa tu negocio` ya no parte palabras ni deja letras sueltas.
- El scroll story usa `Tu negocio merece una presencia digital que impacte`.
- Los titulares principales se revisaron en 360 px, 390 px, 430 px, tablet y desktop.
- El aviso de construccion ya no tapa CTAs ni controles en movil.
- `npm run build` pasa con `next build --webpack`.
- `npm run lint` no esta disponible porque el repo define `eslint .`, pero `eslint` no esta instalado como dependencia.

## Tarea para Carlos / proxima sesion

1. Revisar `https://aplaudia.com` en movil real:
   - iPhone pequeno o equivalente a 360 px.
   - iPhone medio o equivalente a 390 px.
   - movil grande o equivalente a 430 px.
   - tablet.
   - desktop.

2. Confirmar visualmente:
   - Hero centrado, legible y sin palabras partidas.
   - Scroll story legible y natural.
   - Titulares de secciones equilibrados.
   - Pastilla de construccion visible sin tapar CTAs.
   - La pastilla abre el aviso completo.
   - El aviso completo se puede minimizar.

3. Decidir el estado del aviso de construccion:
   - mantenerlo como esta;
   - suavizarlo;
   - retirarlo cuando Carlos valide lanzamiento.

4. Antes del lanzamiento publico, cerrar pendientes de negocio:
   - contacto real o canal definitivo de WhatsApp;
   - textos finales en CA/EN si se mantienen idiomas secundarios;
   - legales basicos si Carlos quiere activar la web como pagina comercial definitiva;
   - revisar si hace falta configurar analitica.

5. Deuda tecnica opcional:
   - instalar/configurar ESLint para que `npm run lint` sea una validacion real;
   - decidir si se mantiene `next build --webpack` mientras el workspace local siga en unidad de red mapeada.

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

- Decision clara sobre el aviso de construccion.
- Estado de lanzamiento documentado en `LAST_REPORT.md`.
- Railway en verde.
- `https://aplaudia.com` validada en dispositivo real.
