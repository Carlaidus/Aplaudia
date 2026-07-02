# PROJECT STATE - Aplaudia

Ultima actualizacion: 2026-07-02

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
- Portfolio/casos con trabajos reales en `content/showcase.ts`:
  - Cronoras con portada/demo, dashboard, proyectos y estadisticas.
  - Arik Custom con home, catalogo filtrable enfocado, panel interno real y solicitud real de presupuesto.
  - Aventuras Pixeladas con home, cartuchos reales, paneles vivos y vista responsive.
  - Las composiciones sinteticas de panel/control se retiraron el 2026-06-30 para priorizar capturas reales limpias.
- Navegacion interna de casos corregida:
  - header y footer usan `/#...` fuera de home;
  - cada caso permite volver a `/casos` y `/`.
- Estructura modular de casos:
  - `components/cases/case-template.tsx`;
  - `components/cases/case-gallery.tsx`;
  - `lib/cases.ts`.
- Vistas clave de casos ampliables con lightbox.
- Agente IA flotante preparado:
  - `components/agent/aplaudia-agent-widget.tsx`;
  - `app/api/agent/route.ts`;
  - instrucciones editables en `content/agent/aplaudia-agent.md`;
  - usa OpenAI directamente si Railway tiene `OPENAI_API_KEY`;
  - modelo opcional configurable con `OPENAI_AGENT_MODEL`;
  - servicio legado compatible con `APLAUDIA_AGENT_API_URL` y `APLAUDIA_AGENT_API_SECRET` solo como respaldo;
  - fallback elegante si no hay agente configurado.
- Chatbot ampliado el 2026-06-30 con dictado por voz:
  - boton de microfono junto al input;
  - Web Speech API en cliente (`SpeechRecognition` / `webkitSpeechRecognition`);
  - idioma `es-ES`;
  - resultados parciales en el textarea;
  - parada al cerrar el widget, enviar mensaje o desmontar componente;
  - boton visible tambien sin soporte, con aviso discreto si el navegador no expone reconocimiento de voz.
- Instrucciones del agente ampliadas en `content/agent/aplaudia-agent.md`:
  - identidad y tono;
  - servicios;
  - casos reales;
  - precios orientativos siempre con "desde";
  - normas para no inventar datos, garantias, plazos ni precios cerrados.
- Flotantes de la home ajustados el 2026-06-30:
  - aviso de construccion a la izquierda;
  - fecha visible del aviso calculada de forma dinamica cada dia en zona Europe/Madrid;
  - chatbot a la derecha;
  - sin solape intencionado entre ambos.
- Lightbox de vistas clave ampliado para ocupar casi toda la ventana util en escritorio y movil.
- Lightbox de vistas clave refinado a pantalla completa real:
  - `100vw` x `100dvh`;
  - imagen ocupando el viewport completo;
  - titulo, descripcion y cierre como overlay para no reducir el area visual.
- WhatsApp real publicado desde `content/site.ts`:
  - numero visible: `659304487`;
  - formato internacional: `34659304487`;
  - enlaces `wa.me` centralizados.
- Formulario interno de contacto en la seccion `#contacto`:
  - componente `components/contact/contact-form.tsx`;
  - API route `app/api/contacto/route.ts`;
  - contenido editable en `content/contact.ts`;
  - seleccion multiple de necesidades como primer paso;
  - mensaje editable breve que se autocompone con las necesidades marcadas;
  - datos de contacto tras el mensaje: nombre, email y telefono opcional;
  - selector final compacto con toggles independientes de email y WhatsApp;
  - permite enviar por email, por WhatsApp o por ambos canales;
  - unico boton de envio visible: `Enviar`;
  - sin CTAs intermedios ni textos tecnicos visibles en el bloque;
  - envio interno por Cloudflare Email Service si existen variables Cloudflare;
  - variables previstas: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_EMAIL_API_TOKEN`, `EMAIL_FROM`, `INTERNAL_EMAIL_RECIPIENT`, `CONTACT_RECIPIENT_EMAIL`, `CONTACT_TO_EMAIL`;
  - fallback tecnico de receptor: `carlosvfx@gmail.com`;
  - sin base de datos y sin guardar mensajes en el repo.
- Solicitud conversacional desde chatbot:
  - endpoint `app/api/agent/quote/route.ts`;
  - flujo determinista en `components/agent/generic-agent-widget.tsx` para no depender de la IA al enviar solicitudes;
  - solo bloquea el envio si falta email valido o consentimiento claro;
  - nombre, telefono, tipo de negocio, interes, presupuesto y copia son opcionales o inferibles desde la conversacion;
  - si ya hay email, consentimiento e historial util, pregunta una sola vez por nombre y telefono opcionales;
  - si el usuario no quiere dar esos opcionales o muestra impaciencia, envia con los datos disponibles;
  - mantiene un borrador de solicitud durante la sesion y no repite datos que el usuario ya haya dado;
  - envio interno solo si Cloudflare Email Service esta configurado;
  - receptor por `AGENT_QUOTE_RECIPIENT_EMAIL`, `INTERNAL_EMAIL_RECIPIENT`, `CONTACT_RECIPIENT_EMAIL`, `CONTACT_TO_EMAIL` o fallback provisional `carlosvfx@gmail.com`;
  - no envia copia automatica al cliente;
  - si el cliente pide copia, se anade solo una nota interna para que Aplaudia responda manualmente;
  - Resend no se usa actualmente como proveedor activo.
- Motor reutilizable de captacion del chatbot reforzado el 2026-07-02:
  - core generico en `lib/lead-engine/`;
  - configuracion especifica de Aplaudia en `content/lead/aplaudia-lead-config.ts`;
  - documentacion tecnica en `docs/lead-engine.md`;
  - `components/agent/generic-agent-widget.tsx` usa un `LeadDraft` persistente y ya no contiene reglas Aplaudia hardcodeadas para clasificar leads;
  - `lib/agent/quote-analysis.ts` queda como fachada compatible del motor nuevo;
  - el email interno es una ficha comercial breve, no un transcript;
  - los detectores usan solo texto del cliente y datos explicitos, no respuestas del asistente ni transcript mixto;
  - `barato`, `barata` o `lo mas barato` no activan `bar`;
  - `no tengo fotos` queda como material mencionado, no como servicio visual;
  - el detector de visuales no cruza expresiones como `hacer reservas` con `no tengo fotos`;
  - la configuracion `leadOptionalContactPrompt` permite pedir nombre/telefono opcionales sin acoplar el core a Aplaudia;
  - el email interno muestra `Telefono: No indicado` si no se facilita y destaca el telefono solo si existe;
  - el chatbot bloquea el scroll de fondo mientras esta abierto y evita scroll chaining dentro del panel;
  - test de regresion ampliado disponible con `npm run test:quote-analysis`.

## Estado de despliegue

- El commit inicial `bb6a0707cf92678c331c782bf9329644d5912dc7` tenia status Railway `failure`.
- El fallo real confirmado en Railway fue `npm ETARGET`: `@radix-ui/react-switch@1.3.3` no existe en npm.
- Railway/Railpack ya estaba usando Node `22.23.1`; Node 18 no era la causa del fallo final.
- Correccion aplicada previamente: `@radix-ui/react-switch` bajado a `1.3.1` y `package-lock.json` generado.
- Estado consultado con `railway deployment list` el 2026-06-29: Railway en `SUCCESS` antes y despues de conectar el dominio.
  - Deployment previo al commit documental de dominio: `8d6a06bf-8b80-4123-b58f-8b9f566076eb`, `SUCCESS`, `11:07:00 +02:00`.
  - Deployment tras el commit documental de dominio: `4d07185c-cd3d-4ac4-8c29-0808c8839e79`, `SUCCESS`, `11:43:49 +02:00`.
- URL temporal comprobada tras el push de cierre: `https://aplaudia-production.up.railway.app` responde `200`, mantiene el aviso de construccion, sirve JSON-LD, `/robots.txt`, `/llms.txt` y `/sitemap.xml`.
- Commit de app comprobado antes de conectar dominio: `b868871db4e123ed91405a83c43edb410c0ed9f1`.
- Commit documental de conexion de dominio comprobado en Railway: `a8588d358c006b1877c5f0e708fc13cd0c1f7ff3`.
- Commit de portfolio/casos verificado en produccion el 2026-06-30: `0e762d67d853de24224d8e7a939f794f27c71853`.
- Commit de ajuste movil del aviso de construccion verificado en produccion el 2026-06-30: `19677cc`.
  - Railway CLI no pudo leer dashboard por token caducado (`invalid_grant`).
  - Produccion `https://aplaudia.com` sirvio home, rutas de casos y assets nuevos con `200`.
  - En movil, el aviso minimizado queda abajo y ya no tapa el encabezado del caso.
- Commit de flujo conversacional de presupuesto verificado en produccion el 2026-07-02: `1225a21`.
  - Railway dashboard: `Deployment successful`, servicio `Active`.
  - Produccion `https://aplaudia.com` sirve el bundle nuevo del chatbot.
  - Chatbot probado en produccion: textarea se vacia, no repite datos y envia el resumen interno solo tras email + consentimiento + orden clara de envio.
- Commit de analisis conservador de presupuestos verificado el 2026-07-02: `4606afb`.
  - Railway dashboard: `Deployment successful`, servicio `Active`.
  - Produccion `https://aplaudia.com`, `/robots.txt`, `/llms.txt` y `/sitemap.xml`: `200`.
  - `npm run test:quote-analysis`: OK con los casos de pagina personal barata y restaurante con reservas.
- Commit de motor reutilizable de leads verificado el 2026-07-02: `540f39e`.
  - Railway dashboard: `Deployment successful`, servicio `Active`, Node `22.23.1`.
  - Produccion `https://aplaudia.com`, `/robots.txt`, `/llms.txt` y `/sitemap.xml`: `200`.
  - Bundle nuevo del chatbot servido desde `/_next/static/chunks/app/layout-4f6068295c798b27.js`.
  - Chatbot abre en produccion, mantiene saludo neutro, no muestra boton fijo de presupuesto y bloquea el scroll del body al abrir.
  - `npm run test:quote-analysis`: OK con cinco casos de regresion.

## Dominio y DNS

- `aplaudia.com` comprado en Cloudflare el 2026-06-29.
- Dominio personalizado `aplaudia.com` conectado en Railway el 2026-06-29.
- Registros DNS de Railway aplicados en Cloudflare mediante Domain Connect:
  - `CNAME` `aplaudia.com` -> `c619o9we.up.railway.app`, proxied.
  - `TXT` `_railway-verify.aplaudia.com` -> verificacion Railway, solo DNS.
- `www.aplaudia.com` configurado en Cloudflare:
  - `CNAME` `www.aplaudia.com` -> `aplaudia.com`, proxied.
  - Regla activa `301` de `https://www.*` a `https://${1}`.
- Email del dominio:
  - email publico en contenido: `hola@aplaudia.com`;
  - alias recomendado para solicitudes: `presupuestos@aplaudia.com`;
  - estrategia documentada en `docs/email-strategy-aplaudia.md`;
  - Cloudflare Email Routing tiene los DNS aplicados y verificados en DNS publico el 2026-07-02;
  - `carlosvfx@gmail.com` esta verificado como direccion destino en Cloudflare;
  - aliases publicos creados y activos:
    - `hola@aplaudia.com` -> `carlosvfx@gmail.com`;
    - `presupuestos@aplaudia.com` -> `carlosvfx@gmail.com`;
    - `soporte@aplaudia.com` -> `carlosvfx@gmail.com`;
    - `legal@aplaudia.com` -> `carlosvfx@gmail.com`;
  - Cloudflare Email Service / Email Sending tiene token creado y variables configuradas en Railway, sin guardar secretos;
  - pruebas reales controladas desde produccion devuelven `200` en `/api/agent/quote` y `/api/contacto`;
  - Cloudflare Activity Log marca los envios internos como `Reenviados`;
  - Cloudflare muestra una cabecera contradictoria (`Estado: Desactivado`, `Registros DNS: No configurado`) aunque las reglas aparecen activas, la vista general indica DNS activado, la configuracion lista los registros y Activity Log registra reenvios;
  - prueba SMTP directa no autenticada hacia `hola@aplaudia.com` y `presupuestos@aplaudia.com` queda rechazada por Cloudflare con `unauthenticatedForward`; queda pendiente una prueba desde un buzon real autenticado para confirmar recepcion externa de aliases;
  - Cloudflare Email Routing no crea buzones ni permite responder como `@aplaudia.com` sin proveedor adicional;
  - Resend queda como configuracion historica/dormida, no como camino activo.
- Canonico operativo:
  - `https://aplaudia.com` como dominio principal.
  - `https://www.aplaudia.com` redirige a raiz.

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
2. Mantener el aviso de construccion visible hasta validacion final de Carlos.
3. Documentacion tecnica al dia para que Codex y ChatGPT puedan continuar sin perder contexto.
4. Revisar con Carlos si el portfolio/casos ya es suficiente para validacion final.
5. Revisar legal/contacto antes de retirar el aviso de construccion.
6. Decidir si se activa el agente IA real o se deja preparado con fallback.

## Pendiente

- Revisar contenido comercial antes de lanzar.
- Revisar textos ES / CA / EN.
- Crear legal basico: aviso legal, privacidad y cookies si se va a captar contacto.
- Confirmar recepcion externa real de aliases enviando desde un buzon autenticado de Carlos o de confianza a:
  - `hola@aplaudia.com`;
  - `presupuestos@aplaudia.com`.
- Revisar en Gmail si han llegado los dos emails internos ya generados por las pruebas de `/api/agent/quote` y `/api/contacto`.
- Si alguna recepcion externa falla pese a reglas activas, revisar Cloudflare Activity Log y estado de Routing antes de tocar DNS.
- Revisar legal/privacidad antes de retirar el aviso de construccion, porque ya existe captacion de contacto.
- Revisar en produccion con Carlos la nueva version de portfolio/casos ya desplegada.
- Validar con Carlos si el panel interno real de Arik Custom debe mostrarse publicamente.
- Revisar conversaciones reales del agente activo con OpenAI para ajustar tono, limites y respuestas frecuentes.
- Definir datos legales reales antes de ampliar JSON-LD con direccion, telefono, redes sociales o fundador.

## Servicios externos

- GitHub: repo publico `Carlaidus/Aplaudia`.
- Railway: hosting y deploy.
- Cloudflare: dominio y DNS.
- ChatGPT: coordinacion y memoria de trabajo.
- Codex: ejecucion de desarrollo.
