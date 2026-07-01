# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado para Codex: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Cerrar ajustes pendientes de chatbot/agente y galería visual: etiqueta corta en el botón del chatbot, input limpio al enviar, precios bien ordenados en el archivo `.md`, agente limitado al ámbito de Aplaudia, imágenes de visuales ampliables a pantalla completa y galería sin solapes raros entre imágenes.

## Repo

`Carlaidus/Aplaudia`

## Contexto

- La web pública es `https://aplaudia.com/`.
- El chatbot usa el motor reutilizable `GenericAgentWidget`.
- El chatbot ya tiene dictado por voz, panel grande, scroll inteligente e indicador de más contenido.
- El agente lee instrucciones desde `content/agent/aplaudia-agent.md`.
- La galería de visuales usa `components/sections/visual-gallery.tsx`, `content/visual-gallery.ts` y assets de `public/visuals/`.

## Tarea 1: input del chatbot limpio al enviar

Validar en `components/agent/generic-agent-widget.tsx` que al enviar una pregunta:

- el textarea se borra inmediatamente;
- vuelve a altura mínima;
- `hasText` queda en falso;
- el botón de enviar queda desactivado hasta que haya nuevo texto;
- la pregunta queda solo como burbuja de usuario en el historial;
- no queda duplicada en la caja de escritura;
- funciona igual con texto escrito y con dictado por voz.

Si ya está correcto, no reescribir innecesariamente.

## Tarea 2: etiqueta corta del botón flotante del chatbot

Carlos no quiere `Pregúntame sobre Aplaudia`. Es demasiado largo.

Usar una microfrase corta integrada junto al icono flotante:

- recomendada: `¿Dudas?`;
- alternativas aceptables: `Te ayudo`, `Pregúntame`, `¿Quieres info?`.

Requisitos:

- píldora pequeña junto al icono;
- integrada con el estilo oscuro/premium;
- no ocupar todo el lateral en móvil;
- no solaparse con el aviso de construcción;
- no mostrarse cuando el chat esté abierto;
- mantener `aria-label` descriptivo.

Archivos probables:

- `components/agent/generic-agent-widget.tsx`;
- `components/agent/aplaudia-agent-widget.tsx`.

## Tarea 3: precios ordenados en el `.md` del agente

Reordenar `content/agent/aplaudia-agent.md` para que Carlos pueda editar precios fácilmente.

Estructura obligatoria:

- `Reglas generales de precios`;
- `Precios propios Aplaudia — Webs`;
- `Precios propios Aplaudia — Agentes IA / chatbots`;
- `Precios propios Aplaudia — Mantenimiento mensual`;
- `Precios propios Aplaudia — Visuales, imagen y vídeo`;
- `Referencias de mercado — no usar como precio propio`.

Precios propios Aplaudia:

### Webs

- Landing o web muy sencilla: desde 390 €.
- Web sencilla con pocos productos destacados: desde 500-800 €.
- Catálogo básico o listado simple sin panel avanzado: desde 650-950 €.
- Catálogo más trabajado sin panel avanzado: desde 950-1.500 €.
- Web comercial personalizada: desde 1.500 €.
- Catálogo con panel simple para editar contenido: desde 1.500-2.300 €.
- Catálogo con filtros, fichas completas, buscador, panel y carga inicial amplia: desde 2.300 € en adelante.
- Reservas, automatizaciones, dashboards, paneles avanzados o funciones tipo aplicación: presupuesto a medida.

Regla comercial: si el cliente quiere algo económico, proponer reducir alcance, una fase inicial o productos destacados. No saltar directamente a una opción completa.

### Agentes IA / chatbots

- Agente IA para web: desde 500 €.
- Integración adicional con WhatsApp: desde +100 €.
- Coste mensual: variable según mantenimiento, uso de API, ajustes, soporte o volumen.

### Mantenimiento mensual

- Mantenimiento básico: desde 20-30 €/mes.
- Mantenimiento activo: desde 60-90 €/mes.
- Mantenimiento avanzado: desde 120-200 €/mes.
- Trabajo adicional fuera del mantenimiento: normalmente 30-45 €/h.
- Nuevas funcionalidades grandes: presupuesto aparte.

### Visuales, imagen y vídeo

- Imágenes IA sencillas: desde 25-40 € por imagen.
- Imagen trabajada, composición o dirección visual: desde 80-150 €.
- Pack visual para web, marca o campaña: desde 250-500 €.
- Vídeo corto con IA: desde 150-300 €.
- Vídeo con rodaje, fotografía real, edición y mezcla con IA: desde 500 € en adelante o presupuesto a medida.

## Tarea 4: referencias de mercado separadas

Añadir en el `.md` referencias de mercado separadas de los precios propios.

Deben servir solo como contexto, no como tarifas principales de Aplaudia.

Incluir resumen de:

- builders tipo Wix, Squarespace, Hostinger: cuotas mensuales y autoservicio;
- Shopify: SaaS ecommerce con cuota mensual, configuración y apps;
- agencias/desarrollo custom: pueden subir a varios miles según complejidad;
- chatbots SaaS como Chatbase, Landbot, Manychat y Tidio/Lyro: planes mensuales por uso, canales y funciones;
- herramientas de imagen/vídeo IA como Runway, HeyGen, Synthesia y Magnific/Freepik: cuotas o créditos; Aplaudia vende dirección visual, edición, integración y entrega final.

## Tarea 5: limitar ámbito del agente

En `content/agent/aplaudia-agent.md`, añadir o reforzar una sección `Ámbito de conversación`.

El agente solo debe responder sobre:

- Aplaudia;
- servicios de Aplaudia;
- webs, landings, catálogos, paneles, reservas, agentes IA, WhatsApp, visuales, imagen, vídeo, SEO y mantenimiento;
- casos reales: Cronoras, Arik Custom y Aventuras Pixeladas;
- dudas razonables de cliente sobre un proyecto digital con Aplaudia.

Si el usuario pregunta algo ajeno, debe responder de forma amable que solo puede ayudar con Aplaudia, sus servicios y casos reales, y redirigir. No debe contestar curiosidades generales aunque sepa la respuesta.

## Tarea 6: asegurar que `/api/agent` respeta el `.md`

Revisar `app/api/agent/route.ts` y helpers del motor reutilizable.

- Confirmar que el contenido completo de `content/agent/aplaudia-agent.md` se inyecta como instrucción principal.
- Si el modelo responde fuera de ámbito, reforzar el system prompt para priorizar el `.md`, no responder fuera de ámbito y no dar precios salvo pregunta explícita.
- No hardcodear precios en código si ya están en el `.md`.
- No guardar claves ni secretos.

## Tarea 7: galería visual sin solapes y con ampliación

La galería de visuales debe mantener diseño atractivo, pero sin imágenes montadas unas encima de otras de forma rara. Además, cada imagen debe poder ampliarse.

Revisar:

- `components/sections/visual-gallery.tsx`;
- `content/visual-gallery.ts`;
- assets en `public/visuals/`.

### Layout de galería

- Mantener las imágenes actuales de momento.
- Mantener un orden visual coherente.
- Evitar que las imágenes se sobrepongan unas sobre otras.
- Rellenar mejor los huecos de la composición.
- Mantener diseño cuidado, pero más limpio y legible.
- No romper el apilado móvil.
- Sin scroll horizontal.
- Si hace falta, usar grid/masonry controlado en vez de márgenes negativos agresivos.

### Lightbox / ampliación

Al hacer clic/tap en una imagen:

- abrir lightbox/modal;
- ocupar todo o casi todo el navegador;
- fondo oscuro/translúcido;
- imagen grande, centrada y sin recortes raros;
- botón claro de cerrar;
- cerrar con Escape en escritorio;
- cerrar al tocar fuera si no crea problemas en móvil;
- móvil casi pantalla completa;
- z-index por encima de chatbot y aviso de construcción;
- mantener animaciones actuales de entrada/hover;
- usar `alt` existente y accesibilidad básica.

Navegación anterior/siguiente es opcional si se puede hacer sin complicar.

## Pruebas obligatorias

- `npm run build`.
- `npm run lint` si está disponible.
- Probar chatbot: input escrito, dictado, envío, textarea vacío y altura mínima.
- Probar etiqueta flotante: `¿Dudas?` o similar, sin solapes y oculta con chat abierto.
- Probar agente:
  - servicios sin precio -> no sacar importes;
  - pregunta explícita de precio -> rangos con `desde`;
  - consulta fuera de ámbito -> redirigir a Aplaudia;
  - Cronoras, Arik Custom y Aventuras Pixeladas -> responder correctamente.
- Probar galería visual:
  - sin solapes raros;
  - huecos mejor rellenados;
  - clic/tap en cada imagen;
  - imagen ampliada a pantalla completa;
  - cerrar modal;
  - móvil y escritorio;
  - sin solape con chatbot/aviso.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar producción/Railway en verde tras push.

## Documentación

Actualizar `LAST_REPORT.md` con:

- estado real del input limpio tras enviar;
- cambio visual en botón flotante del chatbot;
- cambios hechos en `content/agent/aplaudia-agent.md`;
- nueva estructura de precios propios;
- nueva sección de referencias de mercado;
- nueva sección de ámbito de conversación;
- ajustes de layout de galería visual;
- lightbox de galería visual;
- pruebas ejecutadas;
- estado final de producción/Railway;
- siguiente paso recomendado.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Restricciones

- No rediseñar la web completa.
- No tocar dominio, DNS ni Cloudflare.
- No añadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programación con IA como mensaje público.
- No inventar datos legales, dirección, CIF, precios cerrados, plazos ni garantías.

## Cierre esperado

- Input del chatbot confirmado limpio tras enviar.
- Botón flotante con microfrase corta tipo `¿Dudas?`.
- Precios propios de Aplaudia ordenados y fáciles de editar en el `.md`.
- Referencias de mercado separadas de precios propios.
- Agente limitado estrictamente al ámbito de Aplaudia y proyectos relacionados.
- Galería visual sin solapes raros y con imágenes ampliables a pantalla completa.
- Producción en verde.
