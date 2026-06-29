# LAST REPORT

Fecha: 2026-06-29

## Objetivo de la tarea

Conectar definitivamente `aplaudia.com` a la app de Aplaudia desplegada en Railway, usando Cloudflare para DNS y redireccion `www`, sin tocar diseno visual ni funcionalidad de la web.

## Cambios externos aplicados

- Railway: anadido `aplaudia.com` como custom domain del servicio `Aplaudia` en `production`, puerto `8080`.
- Railway mostro los registros DNS exactos para `aplaudia.com`.
- Cloudflare: autorizada la configuracion One-click DNS Setup de Railway para crear los registros del dominio raiz.
- Cloudflare: creado registro DNS para `www.aplaudia.com`.
- Cloudflare: creada regla activa de redireccion `www` a raiz.
- No se han tocado componentes, textos, estilos, animaciones, backend, base de datos, auth ni pagos.
- No se han guardado secretos ni tokens en el repo.

## Registros DNS aplicados

- `CNAME` `aplaudia.com` -> `c619o9we.up.railway.app`, TTL automatico / 1 h, proxied en Cloudflare.
- `TXT` `_railway-verify.aplaudia.com` -> `"railway-verify=fbc22f56dc50d152af14c1150168027e799f6ba525e256ee2e72703e2f4be153"`, TTL 1 h, solo DNS.
- `CNAME` `www.aplaudia.com` -> `aplaudia.com`, TTL automatico, proxied en Cloudflare.

## Redireccion `www`

- Regla Cloudflare activa: `Redirigir de WWW a raiz [Plantilla]`.
- Patron: `https://www.*`.
- Destino: `https://${1}`.
- Codigo: `301 - Permanent Redirect`.
- Validado que `https://www.aplaudia.com/` redirige a `https://aplaudia.com/`.
- Validado que una ruta de prueba conserva path y query: `https://www.aplaudia.com/prueba-path?x=1` -> `https://aplaudia.com/prueba-path?x=1`.

## Estado de Railway

- Railway sigue en verde.
- Ultimo deployment: `8d6a06bf-8b80-4123-b58f-8b9f566076eb`, `SUCCESS`, 2026-06-29 11:07:00 +02:00.
- `railway status --json` confirma `aplaudia.com` en `customDomains`, target port `8080`.
- Panel Railway ya no muestra `Waiting for DNS update`; muestra `aplaudia.com`, `Port 8080` y boton `DNS records`.

## Estado de Cloudflare

- Cloudflare gestiona DNS de `aplaudia.com`.
- Registros raiz de Railway creados mediante autorizacion Domain Connect.
- `www.aplaudia.com` resuelve por Cloudflare y redirige mediante regla activa.
- No se han configurado correo, MX, SPF, DKIM ni DMARC.

## Validaciones realizadas

- `Resolve-DnsName aplaudia.com`: devuelve A/AAAA de Cloudflare.
- `Resolve-DnsName _railway-verify.aplaudia.com -Type TXT`: devuelve el TXT de Railway.
- `Resolve-DnsName www.aplaudia.com -Server 1.1.1.1`: devuelve A/AAAA de Cloudflare.
- `https://aplaudia.com/`: `200`.
- `https://aplaudia.com/`: aviso de construccion visible, canonical `https://aplaudia.com` y JSON-LD presentes.
- `https://www.aplaudia.com/`: `301` a `https://aplaudia.com/`.
- `https://www.aplaudia.com/` siguiendo redireccion: `200`.
- `https://aplaudia.com/robots.txt`: `200`, apunta a sitemap `https://aplaudia.com/sitemap.xml`.
- `https://aplaudia.com/llms.txt`: `200`, contiene `https://aplaudia.com` y `es-ES`.
- `https://aplaudia.com/sitemap.xml`: `200`, contiene `https://aplaudia.com/`.

## Siguiente paso recomendado

Mantener el aviso de construccion hasta que Carlos valide el lanzamiento final. Antes de quitarlo, revisar contenido comercial, contacto real, textos CA/EN y paginas legales si se va a captar contacto.
