# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Razonamiento recomendado: Alto

## Objetivo inmediato

Revisar lanzamiento final antes de quitar el aviso de construccion, con `aplaudia.com` ya conectado y `www.aplaudia.com` redirigiendo a raiz.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Revisar al desplegar

- Railway ya esta en verde: ultimo deployment `8d6a06bf-8b80-4123-b58f-8b9f566076eb`, `SUCCESS`, 2026-06-29 11:07:00 +02:00.
- Commit desplegado: `b868871db4e123ed91405a83c43edb410c0ed9f1`.
- Dominio operativo validado el 2026-06-29:
  - `https://aplaudia.com/` responde `200`.
  - `https://www.aplaudia.com/` redirige con `301` a `https://aplaudia.com/`.
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml` responden `200` en `aplaudia.com`.
- La home debe cargar sin errores.
- Debe mantenerse visible el aviso flotante de construccion con fecha 29 junio 2026.
- El aviso debe indicar que Aplaudia esta en construccion y que se esta preparando la activacion del dominio `aplaudia.com`.
- El aviso no debe tapar navegacion ni CTA de forma grave en mobile.
- `app/layout.tsx` debe conservar `metadataBase`, canonical, Open Graph, Twitter card, locale `es_ES` y `StructuredData`.
- `app/robots.ts`, `/llms.txt` y `public/sitemap.xml` deben estar servidos correctamente y apuntar a `https://aplaudia.com`.
- `content/site.ts` debe seguir siendo la fuente central de marca, URL, contacto, SEO, servicios y rutas futuras.
- `siteConfig.contact.whatsappHref` esta pendiente porque no hay numero real confirmado; los enlaces visibles de WhatsApp apuntan a la demo interna `#whatsapp` hasta que Carlos confirme un canal real.

## Siguiente paso de lanzamiento

- Mantener el aviso de construccion hasta que Carlos valide el lanzamiento.
- Revisar contenido comercial, contacto real y textos CA/EN.
- Preparar legales basicos si se va a captar contacto.
- Cuando Carlos apruebe, retirar o ajustar el aviso de construccion.

## Rutas futuras recomendadas

No activarlas todavia salvo que Carlos apruebe nuevas paginas:

- `/servicios/paginas-web`
- `/servicios/agentes-ia-whatsapp`
- `/servicios/visuales-ia`
- `/casos`
- `/sobre-aplaudia`
- `/contacto`
- `/recursos`

## Importante

- No inventar registros de dominio.
- No guardar claves privadas.
- No anadir backend todavia.
- Mantener la memoria `.md` compacta.
- Al cerrar, actualizar `LAST_REPORT.md` con el resultado real del deploy o indicar que no se ha generado deployment nuevo.
