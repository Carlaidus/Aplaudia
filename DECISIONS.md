# DECISIONS - Aplaudia

## Seguridad y datos

- No guardar secretos, tokens, claves, contrasenas ni variables privadas en los `.md`.
- No guardar datos reales de clientes salvo instruccion explicita de Carlos.
- No tocar configuracion de Cloudflare ni Railway manualmente sin instruccion clara.
- El formulario interno de contacto queda preparado por instruccion de Carlos, con consentimiento explicito, envio por proveedor configurado y sin guardar mensajes en base de datos. Legal/privacidad sigue pendiente antes de retirar el aviso de construccion.
- Cloudflare Email Routing se usara como estrategia gratuita para recibir y reenviar aliases `@aplaudia.com`, pero no sustituye a un proveedor de envio automatico.
- Cloudflare Email Service / Email Sending queda configurado como envio interno de Aplaudia. Tras verificar `carlosvfx@gmail.com` en Cloudflare, las pruebas reales de produccion del 2026-07-02 devuelven `200` y Cloudflare Activity Log marca los envios como `Reenviados`.
- No activar Workers Paid ni volver a Resend sin decision explicita de Carlos.
- Resend no se usa actualmente como proveedor activo; puede quedar como configuracion externa historica/dormida hasta que Carlos decida retirarla manualmente.
- El chatbot no envia copia automatica al cliente. Si el cliente pide copia, se anade una nota interna para que una persona de Aplaudia responda manualmente.
- En solicitudes desde chatbot, solo son obligatorios email valido y consentimiento claro. El nombre, telefono, tipo de proyecto, interes, presupuesto o copia no deben bloquear el envio interno.
- Los aliases `hola@aplaudia.com`, `presupuestos@aplaudia.com`, `soporte@aplaudia.com` y `legal@aplaudia.com` estan creados en Cloudflare Email Routing hacia `carlosvfx@gmail.com`; la prueba final de recepcion externa debe hacerse desde un buzon real autenticado, no desde SMTP directo sin SPF/DKIM.

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
- Emails publicos recomendados: `hola@aplaudia.com`, `presupuestos@aplaudia.com`, `soporte@aplaudia.com` y `legal@aplaudia.com`, reenviados a `carlosvfx@gmail.com` mediante Cloudflare Email Routing cuando la direccion destino quede verificada y se puedan crear las reglas.
- No prometer respuesta desde `@aplaudia.com` hasta configurar Google Workspace, SMTP o proveedor de envio equivalente.
- No tocar DNS ni Cloudflare desde codigo: aplicar solo registros o ajustes exactos indicados por Cloudflare cuando Carlos lo autorice.

## UX publica mientras no este lanzada

- La web debe mostrar claramente que esta en construccion.
- El aviso no debe romper navegacion, mobile ni CTA.
- El aviso debe ser visualmente premium y coherente con la estetica oscura/glow de Aplaudia.
- Fecha visible de construccion: dinamica, calculada en la web con la fecha actual en zona Europe/Madrid. `content/site.ts` conserva solo un fallback.

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
