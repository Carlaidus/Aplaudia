# DECISIONS - Aplaudia

## Seguridad y datos

- No guardar secretos, tokens, claves, contrasenas ni variables privadas en los `.md`.
- No guardar datos reales de clientes salvo instruccion explicita de Carlos.
- No tocar configuracion de Cloudflare ni Railway manualmente sin instruccion clara.
- El formulario interno de contacto queda preparado por instruccion de Carlos, con consentimiento explicito, envio por Resend y sin guardar mensajes en base de datos. Legal/privacidad sigue pendiente antes de retirar el aviso de construccion.

## Git y despliegue

- Las tareas grandes o de riesgo van en rama propia.
- `main` debe mantenerse desplegable.
- Railway despliega desde GitHub `main`.
- Para arreglos urgentes de lanzamiento, se puede integrar a `main` cuando el cambio sea pequeno, reversible y este documentado.
- `LAST_REPORT.md` se reemplaza o actualiza en cada tarea importante.

## Dominio

- Dominio canonico previsto: `https://aplaudia.com`.
- `www.aplaudia.com` debe redirigir a `https://aplaudia.com`.
- El dominio temporal de Railway debe redirigir a `https://aplaudia.com` cuando el dominio final este verificado.
- Cloudflare es el lugar donde vive la compra y DNS del dominio.

## UX publica mientras no este lanzada

- La web debe mostrar claramente que esta en construccion.
- El aviso no debe romper navegacion, mobile ni CTA.
- El aviso debe ser visualmente premium y coherente con la estetica oscura/glow de Aplaudia.
- Fecha visible de construccion: 29 junio 2026.

## IA y ejecucion

- ChatGPT coordina, resume y prepara prompts cerrados.
- Codex ejecuta codigo, pruebas y commits.
- Antes de cualquier tarea importante, leer:
  - `README.md`
  - `PROJECT_STATE.md`
  - `DECISIONS.md`
  - `WORKFLOW.md`
  - `NEXT_TASK.md`
  - `LAST_REPORT.md`
- Al terminar, actualizar `LAST_REPORT.md` y, si cambia el foco, `NEXT_TASK.md`.

## Decisiones tecnicas vigentes

- Mantener Next.js 16 y React 19 salvo necesidad real de downgrade.
- Forzar Node `22.x` para Railway mediante `package.json` y `.nvmrc`.
- No anadir backend ni base de datos hasta que exista una necesidad clara.
- No complicar Aplaudia como Aventuras Pixeladas: memoria ligera, accion rapida, documentacion compacta.
- El JSON-LD puede incluir `Organization`, `WebSite`, `Service` e `ItemList`; no anadir `FAQPage` hasta que existan FAQs reales visibles en la web.
- `content/site.ts` es la fuente central para marca, dominio canonico, contacto, metadata SEO, servicios, aviso de construccion y rutas futuras recomendadas.
- El WhatsApp publico confirmado para Aplaudia es `659304487` (`34659304487` en formato internacional) y debe centralizarse en `content/site.ts`.
