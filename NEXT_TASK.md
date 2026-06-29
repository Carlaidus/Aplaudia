# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Razonamiento recomendado: Alto

## Objetivo inmediato

Conectar `aplaudia.com` cuando Carlos pueda crear los DNS reales en Cloudflare, manteniendo el aviso de construccion visible hasta validacion final.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Revisar al desplegar

- Railway ya esta en verde: deployment de cierre funcional `19fb8c54-8e77-4301-b431-59a8d8a90083`, `SUCCESS`, 2026-06-29 11:04:03 +02:00.
- Commit funcional desplegado: `aaea86c8af863cf139251ce8f8bb7b35406537b3`.
- La home debe cargar sin errores.
- Debe mantenerse visible el aviso flotante de construccion con fecha 29 junio 2026.
- El aviso debe indicar que Aplaudia esta en construccion y que se esta preparando la activacion del dominio `aplaudia.com`.
- El aviso no debe tapar navegacion ni CTA de forma grave en mobile.
- `app/layout.tsx` debe conservar `metadataBase`, canonical, Open Graph, Twitter card, locale `es_ES` y `StructuredData`.
- `app/robots.ts`, `/llms.txt` y `public/sitemap.xml` deben estar servidos correctamente y apuntar a `https://aplaudia.com`.
- `content/site.ts` debe seguir siendo la fuente central de marca, URL, contacto, SEO, servicios y rutas futuras.
- `siteConfig.contact.whatsappHref` esta pendiente porque no hay numero real confirmado; los enlaces visibles de WhatsApp apuntan a la demo interna `#whatsapp` hasta que Carlos confirme un canal real.

## Siguiente paso de dominio

- En Railway, ejecutar la adicion de dominio personalizado para `aplaudia.com` y copiar los registros exactos que devuelva Railway.
- Crear en Cloudflare exactamente esos registros DNS, sin modificar valores ni inventar CNAME/TXT.
- Repetir el proceso para `www.aplaudia.com` si Railway lo requiere o configurar en Cloudflare una regla de redireccion `https://www.aplaudia.com/*` -> `https://aplaudia.com/$1` cuando el DNS este verificado.
- Comprobar con `Resolve-DnsName aplaudia.com`, `Resolve-DnsName www.aplaudia.com`, `Invoke-WebRequest https://aplaudia.com` y navegador.
- Mantener el aviso de construccion hasta que Carlos valide el lanzamiento.

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
