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

## Estado de despliegue

- El commit inicial `bb6a0707cf92678c331c782bf9329644d5912dc7` tenia status Railway `failure`.
- Causa mas probable detectada: Railway/Nixpacks puede usar Node 18 por defecto, pero Next.js 16 requiere Node minimo 20.9.
- Se preparo cambio para forzar Node 22 y reactivar despliegue al integrar en `main`.
- Pendiente: comprobar el nuevo deployment en Railway despues de integrar cambios.

## Dominio y DNS

- `aplaudia.com` comprado en Cloudflare el 2026-06-29.
- Pendiente conectar dominio personalizado en Railway.
- Pendiente anadir en Cloudflare los registros que Railway indique: normalmente CNAME y TXT de verificacion.
- Pendiente decidir redireccion canonica:
  - `https://aplaudia.com` como dominio principal.
  - `https://www.aplaudia.com` redirigido a raiz.
  - Dominio temporal de Railway redirigido a `https://aplaudia.com` cuando todo este verificado.

## Foco actual

Llevar Aplaudia a un estado publicable minimo:

1. Deploy de Railway en verde.
2. Dominio `aplaudia.com` conectado.
3. Aviso de construccion visible mientras se termina la web.
4. Documentacion tecnica al dia para que Codex y ChatGPT puedan continuar sin perder contexto.

## Pendiente

- Validar nuevo deployment de Railway.
- Confirmar URL temporal Railway real si no coincide con la visible en status.
- Conectar `aplaudia.com` y `www.aplaudia.com`.
- Revisar contenido comercial antes de lanzar.
- Revisar textos ES / CA / EN.
- Crear legal basico: aviso legal, privacidad y cookies si se va a captar contacto.
- Decidir formulario/contacto/WhatsApp real.
- Generar capturas o demo para portfolio cuando la web este estable.

## Servicios externos

- GitHub: repo publico `Carlaidus/Aplaudia`.
- Railway: hosting y deploy.
- Cloudflare: dominio y DNS.
- ChatGPT: coordinacion y memoria de trabajo.
- Codex: ejecucion de desarrollo.
