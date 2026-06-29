# NEXT TASK - Aplaudia

Prioridad: Alta
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Refinar la estructura no visual de Aplaudia para SEO, descubrimiento por IA y futuras ampliaciones sin cambiar el diseño.

## Estado actual

- Railway vuelve a desplegar en verde tras corregir dependencias.
- El dominio oficial previsto es `https://aplaudia.com`.
- La home mantiene aviso de construccion.
- El castellano principal debe ser espanol de Espana (`es-ES`).
- Existe `content/site.ts` como fuente central para datos de marca, URL, keywords, servicios y rutas futuras.
- `app/layout.tsx`, `app/robots.ts` y `/llms.txt` reutilizan `siteConfig`.
- Hay JSON-LD basico de Organization en `components/seo/structured-data.tsx`.

## Siguiente trabajo para Codex

- Ejecutar build y revisar que los ultimos cambios SEO compilan.
- Extraer datos hardcodeados de secciones a `content/` sin cambiar el resultado visual:
  - showcase/casos;
  - demo WhatsApp;
  - servicios;
  - textos SEO reutilizables.
- Ampliar JSON-LD con WebSite, ItemList y Service usando `siteConfig.services`.
- Revisar todos los textos visibles para mantener espanol de Espana.
- Preparar estructura futura documentada para:
  - `/servicios/paginas-web`
  - `/servicios/agentes-ia-whatsapp`
  - `/servicios/visuales-ia`
  - `/casos`
  - `/sobre-aplaudia`
  - `/contacto`
  - `/recursos`

## Dominio

- Conectar `aplaudia.com` en Railway como custom domain.
- Crear en Cloudflare solo los registros exactos que Railway indique.
- Redirigir `www.aplaudia.com` al dominio raiz.

## Restricciones

- No tocar diseno visual.
- No cambiar animaciones.
- No anadir backend, base de datos, auth ni pagos.
- No inventar datos de empresa no confirmados.
- Actualizar `LAST_REPORT.md` al cerrar.
