# WORKFLOW IA - Aplaudia

Sistema de trabajo copiado y simplificado desde Aventuras Pixeladas, Cronoras y Arik Custom.

## ChatGPT

- Coordina el proyecto.
- Resume el estado.
- Lee la memoria `.md` antes de preparar tareas importantes.
- Detecta riesgos y prepara prompts cerrados.
- Revisa el ultimo informe de ejecucion.

## Codex

- Ejecuta cambios de codigo.
- Crea ramas cuando la tarea sea grande o pueda romper el despliegue.
- Prueba antes de cerrar.
- Hace commit y push.
- Actualiza `LAST_REPORT.md` al terminar.
- Actualiza `NEXT_TASK.md` si cambia la prioridad.

## GitHub

- Repo principal y memoria tecnica ligera: `Carlaidus/Aplaudia`.
- Los `.md` de control viven en la raiz del repo para mantener Aplaudia simple.
- El historial detallado queda en Git.
- `LAST_REPORT.md` se sobrescribe o actualiza en cada tarea.

## Railway

- Hosting previsto de produccion.
- Debe desplegar desde `main`.
- Si un deployment falla, documentar commit afectado, causa probable, cambio aplicado y estado del nuevo deploy.

## Cloudflare

- Dominio: `aplaudia.com`.
- Cloudflare gestiona compra y DNS.
- Railway debe indicar los registros exactos de dominio personalizado.

## Escala de razonamiento

### Medio

- Texto.
- CSS localizado.
- Ajuste visual pequeno.
- Documentacion simple.

### Alto

- Cambio de landing completo.
- Dominio/Railway.
- SEO/canonical.
- Formularios/contacto.
- Multiidioma.

### Extremadamente Alto

- Login.
- Pagos.
- Base de datos.
- Automatizaciones con informacion real.
- Migraciones.
- Cambios en servicios externos.

## Validaciones estandar para codigo

- `npm install`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `git diff --check`
- `git status --short`

## Validaciones estandar para despliegue

- Comprobar status GitHub/Railway del ultimo commit de `main`.
- Abrir URL temporal Railway.
- Abrir `https://aplaudia.com` cuando DNS este conectado.
- Revisar desktop y mobile.
- Verificar que el aviso de construccion no tapa CTA criticos.

## Cierre de tarea

1. Actualizar `LAST_REPORT.md`.
2. Actualizar `NEXT_TASK.md` si cambia el foco.
3. Mantener ambos compactos.
4. Hacer commit.
5. Push a la rama correspondiente o a `main` si el cambio ya esta validado.
6. Informar con resumen claro.
