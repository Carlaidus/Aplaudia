# Aplaudia

Web publica de Aplaudia: estudio digital para creacion y mejora de paginas web, presencia digital y contenido con IA.

## Memoria operativa

Documentos de control del proyecto:

- `PROJECT_STATE.md`: estado confirmado.
- `DECISIONS.md`: decisiones vigentes.
- `WORKFLOW.md`: forma de trabajo.
- `NEXT_TASK.md`: siguiente tarea.
- `LAST_REPORT.md`: ultimo resumen de ejecucion.

## Estado actual resumido

- Hosting previsto: Railway.
- Dominio oficial: `aplaudia.com`.
- Dominio comprado en Cloudflare el 2026-06-29.
- La web debe mostrarse como proyecto en construccion hasta que Carlos valide el lanzamiento.

## Agente IA flotante

El widget de agente puede funcionar con un servicio externo compatible con el proxy `/api/agent`.

Variables de entorno necesarias para activarlo:

- `APLAUDIA_AGENT_API_URL`: URL base del servicio del agente.
- `APLAUDIA_AGENT_API_SECRET`: secreto Bearer para llamar a ese servicio.

Si faltan esas variables, la web no se rompe: el agente muestra una respuesta de fallback indicando que no esta conectado.

No guardar valores reales de estas variables en el repo.
