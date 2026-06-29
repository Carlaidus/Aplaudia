# PROJECT STATE - Aplaudia

Ultima actualizacion: 2026-06-29

## Identificacion

- Proyecto: Aplaudia
- Repo codigo: `Carlaidus/Aplaudia`
- Memoria tecnica ligera: documentos `.md` en la raiz del repo
- Hosting previsto: Railway
- Servicio Railway visto en status de GitHub: `accomplished-abundance - Aplaudia`
- Dominio oficial: `aplaudia.com`
- Registrador/DNS: Cloudflare
- Fecha de compra del dominio indicada por Carlos: 2026-06-29
- Caducidad prevista inicial del dominio: alrededor de 2027-06-29
- Coordinacion: ChatGPT
- Ejecucion tecnica: Codex / GitHub

## Stack confirmado

- Next.js `16.2.0`
- React `19.2.4`
- TypeScript
- Tailwind CSS v4
- Radix UI / shadcn-style components
- Framer Motion
- Multiidioma ES / CA / EN mediante `i18n/`

## Implementado

- Landing principal en `app/page.tsx`.
- Secciones visibles: Header, Hero, ScrollStory, WhatsAppDemo, Services, HowItWorks, Showcase, VisualGallery, Benefits, About, FinalCTA y Footer.
- Cambio de idioma desde `LanguageSwitcher`.
- Aviso flotante de construccion anadido en `components/sections/construction-notice.tsx`.
- La home muestra claramente que Aplaudia esta en construccion a fecha 2026-06-29.
- Node fijado a `22.x` en `package.json` y `.nvmrc` para evitar el fallo probable de Railway con Node 18.
- Dependencia `@radix-ui/react-switch` fijada a `1.3.1`, version publicada en npm, para evitar `npm ETARGET` en Railway.
- `package-lock.json` anadido para instalaciones reproducibles con `npm ci`.
- Metadata principal reforzada en `app/layout.tsx`: `metadataBase`, canonical, Open Graph, Twitter card, locale `es_ES` y robots indexables.
- JSON-LD no visual anadido para `Organization`, `WebSite`, `Service` e `ItemList` de servicios mediante `components/seo/structured-data.tsx`.
- `content/site.ts` creado como fuente central para marca, URL canonica, SEO, contacto, aviso de construccion, servicios y rutas futuras.
- Datos reutilizables separados en `content/`: `site.ts`, `routes.ts`, `services.ts`, `seo.ts`, `brand.ts`, `whatsapp-demo.ts` y `showcase.ts`.
- Descubrimiento tecnico:
  - `app/robots.ts` genera `/robots.txt` desde `siteConfig`.
  - `app/llms.txt/route.ts` genera `/llms.txt` desde `siteConfig`.
  - `public/sitemap.xml` apunta a `https://aplaudia.com/`.
- Copy principal ES revisado para espanol de Espana: `reserva`, `reservar`, `portfolio`, horarios 24 h y giros menos latinoamericanos.

## Estado de despliegue

- El commit inicial `bb6a0707cf92678c331c782bf9329644d5912dc7` tenia status Railway `failure`.
- El fallo real confirmado en Railway fue `npm ETARGET`: `@radix-ui/react-switch@1.3.3` no existe en npm.
- Railway/Railpack ya estaba usando Node `22.23.1`; Node 18 no era la causa del fallo final.
- Correccion aplicada previamente: `@radix-ui/react-switch` bajado a `1.3.1` y `package-lock.json` generado.
- Estado consultado con `railway deployment list` el 2026-06-29: ultimo deployment `c3ff522c-510e-4967-bf17-88e752e5be39` en `SUCCESS` a las `10:33:28 +02:00`.
- URL temporal comprobada: `https://aplaudia-production.up.railway.app` responde `200` y mantiene el aviso de construccion.
- Los cambios SEO/AI discoverability actuales estan locales en `main`; el push de cierre debe generar un deployment nuevo desde GitHub.

## Dominio y DNS

- `aplaudia.com` comprado en Cloudflare el 2026-06-29.
- Pendiente conectar dominio personalizado en Railway.
- Pendiente anadir en Cloudflare los registros que Railway indique: normalmente CNAME y TXT de verificacion.
- Comprobacion DNS local el 2026-06-29: `aplaudia.com` solo devuelve SOA y `www.aplaudia.com` no resuelve; `https://aplaudia.com` y `https://www.aplaudia.com` no cargan todavia.
- No hay `wrangler`, `cloudflared` ni conector Cloudflare disponible en este entorno; no se han tocado DNS reales.
- Pendiente decidir redireccion canonica:
  - `https://aplaudia.com` como dominio principal.
  - `https://www.aplaudia.com` redirigido a raiz.
  - Dominio temporal de Railway redirigido a `https://aplaudia.com` cuando todo este verificado.

## Rutas futuras recomendadas

No estan activadas todavia para evitar cambios visuales o paginas vacias. Rutas recomendadas para la siguiente fase:

- `/servicios/paginas-web`
- `/servicios/agentes-ia-whatsapp`
- `/servicios/visuales-ia`
- `/casos`
- `/sobre-aplaudia`
- `/contacto`
- `/recursos`

## Foco actual

Llevar Aplaudia a un estado publicable minimo con base SEO preparada:

1. Mantener Railway en verde.
2. Desplegar los cambios SEO/AI discoverability actuales cuando Carlos lo autorice.
3. Conectar el dominio `aplaudia.com`.
4. Mantener el aviso de construccion visible hasta validacion final de Carlos.
5. Documentacion tecnica al dia para que Codex y ChatGPT puedan continuar sin perder contexto.

## Pendiente

- Hacer push de los cambios SEO actuales y comprobar el deployment nuevo de Railway.
- Conectar `aplaudia.com` y `www.aplaudia.com`.
- Revisar contenido comercial antes de lanzar.
- Revisar textos ES / CA / EN.
- Crear legal basico: aviso legal, privacidad y cookies si se va a captar contacto.
- Decidir formulario/contacto/WhatsApp real; no hay numero de WhatsApp publicado en `siteConfig`.
- Generar capturas o demo para portfolio cuando la web este estable.
- Definir datos legales reales antes de ampliar JSON-LD con direccion, telefono, redes sociales o fundador.

## Servicios externos

- GitHub: repo publico `Carlaidus/Aplaudia`.
- Railway: hosting y deploy.
- Cloudflare: dominio y DNS.
- ChatGPT: coordinacion y memoria de trabajo.
- Codex: ejecucion de desarrollo.
