# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Razonamiento recomendado: Alto

## Objetivo inmediato

Verificar que Aplaudia despliega correctamente en Railway despues de fijar Node 22 y anadir el aviso de construccion.

## Repo

`Carlaidus/Aplaudia`

## Rama preparada

`chore/control-docs-construction-node`

## Revisar al integrar

- Railway debe lanzar nuevo deploy desde `main`.
- El deploy debe pasar de `failure` a verde.
- La home debe cargar sin errores.
- Debe verse una ventana flotante premium con fecha 29 junio 2026.
- El aviso debe indicar que Aplaudia esta en construccion y que se esta preparando la activacion del dominio `aplaudia.com`.
- El aviso no debe tapar navegacion ni CTA de forma grave en mobile.
- `package.json` debe conservar dependencias originales y anadir solo `engines.node = 22.x`.
- `.nvmrc` debe contener `22`.

## Despues del deploy

- Conectar `aplaudia.com` en Railway como dominio personalizado.
- Crear en Cloudflare los registros exactos que Railway indique.
- Configurar `www.aplaudia.com` para que vaya al dominio principal.
- Mantener el aviso de construccion hasta que Carlos valide el lanzamiento.

## Importante

- No inventar registros de dominio.
- No guardar claves privadas.
- No anadir backend todavia.
- Mantener la memoria `.md` compacta.
- Al cerrar, reemplazar `LAST_CODEX_REPORT.md` con el resultado real del deploy.
