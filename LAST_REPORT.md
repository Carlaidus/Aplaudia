# LAST REPORT

Fecha: 2026-06-30

## Actualización - Segunda tanda de visuales generados más realistas

### Objetivo

Sustituir la primera prueba de imágenes generadas, que quedaba demasiado tecnológica/holográfica, por una propuesta más realista y comercial sin tocar el diseño, el layout ni las animaciones de la web.

### Feedback incorporado

- Las imágenes anteriores se percibían demasiado futuristas.
- La nueva dirección visual prioriza escenas reales de estudio, tienda, pantallas y material comercial.
- Se incluye una muestra clara de ropa sobre una persona vista en pantalla.
- Se evitan hologramas, interfaces imposibles y estética de ciencia ficción.

### Cambios aplicados

- `components/sections/visual-gallery.tsx`:
  - se sustituyen las cinco imágenes de la galería por escenas realistas de edición, web, vídeo, pantalla en tienda y sistema de campaña;
  - se actualizan textos alternativos para describir mejor cada imagen.
- `components/sections/about.tsx`:
  - se sustituye la imagen del bloque de estudio por una mesa de trabajo realista con portátil, cámara, muestras y material visual.
- `public/visuals/`:
  - añadidas imágenes WebP optimizadas:
    - `ai-image-enhancement-real.webp`;
    - `real-web-composition.webp`;
    - `real-motion-editing.webp`;
    - `retail-screen-clothing.webp`;
    - `real-campaign-system.webp`;
    - `aplaudia-studio-workspace-real.webp`.
  - eliminada la primera tanda de visuales generados por quedar demasiado tecnológica.

### Validaciones ejecutadas

- Generación realizada con la herramienta integrada de imagen de Codex (`image_gen`), en modo built-in.
- Imágenes revisadas visualmente antes de incorporarlas al repo.
- Conversión a WebP con `sharp`, manteniendo tamaños contenidos.
- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK desde `T:\20-PROYECTOS\APLAUDIA`.
- `npm run lint`: falla por deuda previa; `eslint` no está disponible como ejecutable del proyecto.
- `git diff --check`: OK; solo avisos de fin de línea CRLF/LF existentes en Windows.
- QA local con `next start` en `http://127.0.0.1:3044`:
  - home responde `200`;
  - escritorio 1365x900: imágenes cargan, sin scroll horizontal;
  - móvil 390x844: galería visible en su hueco, sin scroll horizontal;
  - no se modifica diseño, orden de secciones ni animaciones.
- QA producción en `https://aplaudia.com`:
  - home responde y referencia los assets nuevos;
  - la home ya no referencia los assets antiguos de la primera tanda;
  - el aviso de construcción sigue visible;
  - los seis assets nuevos responden `200`.

### Estado

- Cambio validado, commiteado y enviado a `origin/main`.
- Commit de assets: `d4109d2` (`Sustituye visuales generados por versiones realistas`).
- Producción `https://aplaudia.com`: OK, sirve las imágenes nuevas.
- Railway: despliegue efectivo confirmado por producción sirviendo los assets nuevos.

### Siguiente paso recomendado

Revisar en producción desde móvil real si esta línea de imágenes encaja mejor. Si se quiere afinar más, generar una tercera tanda todavía más luminosa y menos oscura, manteniendo el mismo enfoque realista.

## Actualización - Rendimiento móvil, espaciado inicial y reglas del agente

### Objetivo

Ejecutar `NEXT_TASK.md`: mejorar rendimiento percibido en móvil sin eliminar animaciones, reducir ligeramente el espacio inicial entre secciones, subir un poco la legibilidad del chatbot y ajustar el agente para no hablar de precios salvo petición explícita.

### Causa probable detectada

- En móvil, `useLightweightMotion()` desactiva transformaciones pesadas, pero varios elementos críticos del hero seguían entrando con delays pensados para escritorio:
  - subtítulo: `1.2s`;
  - CTAs: `1.4s-1.6s`;
  - stack técnico: `1.8s-2s`;
  - indicador de scroll: `2.5s`.
- Además, durante la primera detección del modo móvil, Framer podía arrancar con opacidad inicial de escritorio en subtítulo y CTAs, dando sensación de contenido incompleto.
- Las dos primeras secciones posteriores usaban padding móvil amplio (`py-32`), aumentando la sensación de hueco entre bloques.

### Cambios aplicados

- `components/sections/hero.tsx`:
  - añadidos `entranceDelay()` y `entranceDuration()` para acortar delays en móvil/lightweight sin tocar la cadencia de escritorio;
  - subtítulo, CTA principal y CTA secundario quedan forzados a opacidad visible en móvil para evitar la sensación de carga rota;
  - no se elimina la animación general ni se cambia el diseño.
- `components/sections/scroll-story.tsx`:
  - padding móvil baja a `py-20`, con `sm:py-28` y `lg:py-40`;
  - margen bajo del titular baja en móvil;
  - delays de tarjetas y línea decorativa se acortan solo en `lightweightMotion`.
- `components/sections/whatsapp-demo.tsx`:
  - padding móvil baja a `py-20`, con `sm:py-28` y `lg:py-40`;
  - gap inicial baja en móvil;
  - mockup, mensajes, chips y beneficios reducen delays en móvil.
- `components/agent/aplaudia-agent-widget.tsx`:
  - fuente de mensajes sube a `text-base` en móvil y `16.5px` en escritorio;
  - se mantiene interlineado compacto, panel grande, micrófono, reset del input e indicador de más contenido.
- `content/agent/aplaudia-agent.md`:
  - regla explícita: no mencionar precios si el usuario no los pregunta;
  - precios solo ante preguntas de coste, precio, presupuesto, tarifa, cuánto cuesta, barato, económico, mínimo o desde cuánto;
  - nueva escala por fases para webs, productos y catálogos;
  - mantenimiento mensual reforzado como propuesta evolutiva;
  - mantenimiento avanzado ajustado a `desde 120-200 €/mes`;
  - si hay muchos productos y poco presupuesto, proponer fase 1 con productos destacados antes de saltar a una solución grande.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- `git diff --check`: pendiente antes del commit final.
- QA local con `next start` en `http://127.0.0.1:3043`:
  - home `200`;
  - móvil 360x780 a 700 ms: H1, subtítulo y CTA principal visibles con opacidad combinada 1; sin scroll horizontal;
  - móvil 390x844 a 700 ms: H1, subtítulo y CTA principal visibles con opacidad combinada 1; sin scroll horizontal;
  - móvil 430x932 a 700 ms: H1, subtítulo y CTA principal visibles con opacidad combinada 1; sin scroll horizontal;
  - escritorio 1280x800: sin scroll horizontal y mantiene cadencia visual de escritorio;
  - chatbot móvil 390x844: fuente de mensajes 16 px / 23.2 px, input se limpia al enviar y vuelve a 48 px;
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml`: OK en local.
- QA producción en `https://aplaudia.com`:
  - bundle final servido;
  - móvil 390x844 a 700 ms: H1, subtítulo y CTA principal visibles con opacidad combinada 1; sin scroll horizontal;
  - chatbot móvil 390x844: fuente de mensajes 16 px / 23.2 px, textarea vuelve a 48 px, valor vacío, botón enviar desactivado y pregunta solo como burbuja;
  - `/robots.txt`, `/llms.txt` y `/sitemap.xml`: OK.
- Pruebas reales de `/api/agent` en producción:
  - `Quiero una web sencilla para mi negocio`: no da importes;
  - `¿Cuánto cuesta una web sencilla?`: da rango orientativo con `desde`;
  - `Tengo 50 productos pero quiero algo barato`: propone fase sencilla y ampliar por fases;
  - `Quiero un chatbot para mi web`: no da importes;
  - `¿Cuánto cuesta un chatbot?`: da rango orientativo con `desde`;
  - `No tengo mucho presupuesto`: propone versión sencilla y fases, sin saltar a una opción grande.

### Estado

- Cambio local validado.
- Commit principal: `5c7698c` (`Improve mobile perception and agent pricing rules`).
- Producción `https://aplaudia.com`: OK, sirve la versión final.
- Railway: despliegue efectivo confirmado por producción sirviendo bundle final y API actualizada.

### Siguiente paso recomendado

Validar en producción las preguntas reales de precios/no precios y confirmar desde móvil real que el contenido inicial ya no parece aparecer tarde.

## Actualización urgente - Reset inmediato del textarea del chatbot

### Objetivo

Al enviar una pregunta en el chatbot, el textarea debe vaciarse inmediatamente y volver a su altura mínima. La pregunta debe quedar solo como burbuja en el historial, sin permanecer duplicada en el editor.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - se añade `resetInput()` como rutina única de limpieza del textarea;
  - al enviar, primero se captura el texto y después se limpia el campo antes de esperar a `/api/agent`;
  - el textarea queda con `value=""`, `scrollTop=0` y sin altura inline;
  - el estado `hasText` vuelve a `false` inmediatamente;
  - `voiceBaseTextRef` se limpia para que el dictado no reutilice texto enviado;
  - se mantiene la pregunta como burbuja de usuario en el historial;
  - no se toca el diseño visual, el panel grande, el micrófono, el envío ni la lógica del indicador de lectura.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- QA local con `next start` en `http://127.0.0.1:3042` y viewport móvil 390x844:
  - antes de enviar texto multilínea: textarea 96 px de alto, valor presente;
  - 80 ms después del envío: textarea vacío, altura 48 px, sin altura inline y botón enviar desactivado;
  - la pregunta aparece una sola vez como burbuja de usuario;
  - tras comenzar la respuesta del asistente, el textarea sigue vacío y a 48 px;
  - sin scroll horizontal.
- QA producción en `https://aplaudia.com` con viewport móvil 390x844:
  - bundle final servido con la rutina de reset;
  - antes de enviar texto multilínea: textarea 96 px de alto, valor presente;
  - 100 ms después del envío: textarea vacío, altura 48 px, sin altura inline y botón enviar desactivado;
  - la pregunta aparece una sola vez como burbuja de usuario;
  - tras comenzar la respuesta del asistente, el textarea sigue vacío y a 48 px;
  - el asistente responde correctamente;
  - sin scroll horizontal.

### Estado

- Cambio local validado.
- Commit principal: `2a27114` (`Reset chatbot input on send`).
- Producción `https://aplaudia.com`: OK, sirve la versión final.
- Railway: despliegue efectivo confirmado por producción sirviendo el bundle final.

### Siguiente paso recomendado

Probar desde móvil real con teclado abierto: escribir varias líneas, enviar y confirmar que el campo vuelve a mínimo sin dejar la pregunta duplicada en el editor.

## Actualización urgente - Espacio superior del hero en móvil

### Objetivo

Carlos detecta en móvil que hay demasiado espacio vacío desde la cabecera hasta el primer texto grande de la home. Se corrige solo el espaciado vertical inicial del hero en móvil, sin rediseñar la web ni cambiar contenido.

### Cambios aplicados

- `components/sections/hero.tsx`:
  - en móvil, el hero deja de usar centrado vertical dentro de `110vh`;
  - el alto móvil pasa a `min-h-[100svh]` para respetar mejor la altura útil real del navegador móvil;
  - el contenido principal del hero pasa a arrancar arriba (`items-start`) con padding móvil más contenido;
  - el padding superior interno móvil queda en `pt-8` para reducir el hueco inicial sin compactar escritorio;
  - el margen bajo el subtítulo queda en `mb-6 sm:mb-12` para evitar roces entre CTAs y aviso flotante en móviles pequeños;
  - desde `sm` en adelante se mantiene el comportamiento anterior (`sm:min-h-[110vh]` y `sm:items-center`);
  - no se tocan textos, animaciones, orden de secciones, CTAs, chatbot ni aviso de construcción.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- `git diff --check`: OK.
- QA local con `next start` en `http://127.0.0.1:3041`:
  - home responde `200`;
  - móvil 360x780: badge top 112 px, H1 top 182 px, subtítulo visible, CTAs visibles, aviso sin solapar CTAs y sin scroll horizontal;
  - móvil 390x844: badge top 112 px, H1 top 182 px, subtítulo visible, CTAs visibles, aviso sin solapar CTAs y sin scroll horizontal;
  - escritorio 1280x800: se conserva la composición amplia original y sin scroll horizontal.
- QA producción en `https://aplaudia.com`:
  - HTML final servido con `pt-8` y `mb-6 sm:mb-12`;
  - móvil 360x780: badge top 112 px, H1 top 182 px, subtítulo visible, CTAs visibles, aviso sin solapar CTAs y sin scroll horizontal;
  - móvil 390x844: badge top 112 px, H1 top 182 px, subtítulo visible, CTAs visibles, aviso sin solapar CTAs y sin scroll horizontal;
  - escritorio 1280x800: composición amplia conservada y sin scroll horizontal;
  - aviso de construcción visible.

### Estado

- Cambio local validado.
- Commit principal: `f58a15d` (`Tighten mobile hero spacing`).
- Commit de refinamiento: `1cf22c1` (`Refine mobile hero spacing`).
- Producción `https://aplaudia.com`: OK, sirve la versión final.
- Railway: despliegue efectivo confirmado por producción sirviendo el HTML final.

### Siguiente paso recomendado

Revisar la home desde móvil real tras el despliegue y confirmar si el nuevo equilibrio del hero se siente más serio y compacto sin perder aire visual.

## Actualización urgente - Lectura de respuestas largas del chatbot

### Objetivo

Evitar que el chatbot salte al final cuando recibe una respuesta larga. La pregunta del usuario debe quedar visible arriba del área de mensajes y la respuesta debe empezar justo debajo, con un indicador sutil si queda más contenido hacia abajo.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - se elimina el auto-scroll global al final basado en `bottomRef`;
  - se añade `messagesViewportRef` para controlar el área real de scroll interno;
  - al enviar, se guarda el índice del mensaje del usuario que inicia la respuesta;
  - al pintar la respuesta, el scroll se ancla a ese mensaje de usuario;
  - la respuesta larga empieza debajo de la pregunta, sin saltar al final;
  - se mantiene el comportamiento normal en respuestas cortas;
  - se añade indicador flotante superpuesto abajo a la derecha dentro del área de mensajes;
  - el indicador aparece solo si queda contenido por leer hacia abajo;
  - el indicador desaparece al llegar al final;
  - el indicador permite avanzar por la respuesta sin ocupar espacio ni empujar layout;
  - se mantiene panel grande, micrófono, envío normal y scroll manual.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- `npx tsc --noEmit`: falla por deuda previa ya conocida:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineación antigua de mensajes `about` en `i18n/provider.tsx`.
- QA local con agente falso compatible con `/api/agent`:
  - respuesta larga móvil 390x844:
    - pregunta visible arriba: top 66 px con viewport de mensajes desde top 64 px;
    - respuesta empieza debajo: top 137 px;
    - no salta al final: queda contenido pendiente (`remaining` 3195 px);
    - indicador visible mientras hay más contenido;
    - indicador desaparece al llegar al final (`remaining` 0);
    - sin scroll horizontal;
    - sin errores de consola.
  - respuesta corta móvil 390x844:
    - respuesta recibida correctamente;
    - sin indicador porque no queda contenido por leer;
    - sin scroll horizontal;
    - sin errores de consola.
  - respuesta larga escritorio 1280x800:
    - pregunta visible arriba;
    - respuesta empieza debajo;
    - indicador visible al quedar contenido pendiente;
    - sin scroll horizontal;
    - sin errores de consola.

### Estado

- Cambio local validado.
- Commit principal: `5dff1e3` (`Improve chatbot long reply reading`).
- Push a `main`: OK.
- Producción `https://aplaudia.com`: OK.
- Browser QA producción móvil 390x844 con respuesta larga real:
  - respuesta del agente: 2563 caracteres;
  - pregunta visible arriba: top 66 px;
  - respuesta empieza debajo: top 182 px;
  - no salta al final: `remaining` 1464 px tras recibir la respuesta;
  - indicador visible mientras queda contenido hacia abajo;
  - indicador desaparece al llegar al final (`remaining` 0);
  - sin scroll horizontal;
  - sin errores graves en consola.
- Browser QA producción móvil 390x844 con respuesta corta real:
  - respuesta del agente: 153 caracteres;
  - indicador no visible;
  - sin scroll horizontal;
  - sin errores graves en consola.

### Siguiente paso recomendado

Probar una conversación real larga en `https://aplaudia.com` tras despliegue y confirmar desde móvil real que el indicador se percibe sutil y útil.

## Actualización urgente - Chatbot casi pantalla completa

### Objetivo

Carlos pide optimizar al máximo el espacio útil del chatbot abierto: panel casi a pantalla completa, sin X flotante redundante, sin columna vacía por icono lateral, texto algo mayor y con interlineado más compacto.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - el panel abierto pasa a estructura de panel/modal grande con `fixed`, `top/bottom/left/right`, `flex-col` y área de mensajes `flex-1`;
  - móvil usa margen mínimo (`inset-x-1.5`, `top-1.5`, `bottom-1.5`);
  - escritorio deja de usar `sm:w-[390px]` y pasa a panel amplio (`lg:inset-x-[8vw]`, `xl:inset-x-[10vw]`);
  - se elimina el límite `sm:max-h-[390px]` del área de mensajes;
  - el botón flotante inferior solo existe cuando el chat está cerrado;
  - al abrir, el cierre queda únicamente en la X superior del panel;
  - el panel se desmonta al cerrar para no dejar foco ni cierre fantasma en el DOM;
  - se elimina el icono lateral externo de los mensajes del asistente;
  - la burbuja del asistente usa `w-full max-w-full`, recuperando el ancho útil;
  - las burbujas de usuario suben a `max-w-[94%]` en móvil y `sm:max-w-[88%]`;
  - texto de mensajes ajustado a `15.5px` en móvil y `16px` en pantallas `sm`, con `leading-[1.45]`;
  - input inferior mantiene textarea, micrófono y enviar con botones de `48px`;
  - no se toca `/api/agent`, `OPENAI_API_KEY`, formulario de contacto ni `content/agent/aplaudia-agent.md`.

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- Browser QA local responsive:
  - 360x780: panel 333 x 768 px; mensajes 640 px de alto; sin scroll horizontal;
  - 390x844: panel 363 x 832 px; mensajes 704 px de alto; sin scroll horizontal;
  - 430x932: panel 403 x 920 px; mensajes 792 px de alto; sin scroll horizontal;
  - 768x1024: panel 705 x 976 px; mensajes 836 px de alto; sin scroll horizontal;
  - 1280x800: panel 1009 x 752 px; mensajes 612 px de alto; sin scroll horizontal.
- Confirmaciones de UI:
  - botón flotante cerrado visible: OK;
  - botón flotante como X al abrir: eliminado;
  - X superior del panel: OK;
  - al cerrar con X superior vuelve el botón flotante: OK;
  - panel desmontado al cerrar: OK;
  - iconos laterales en mensajes del asistente: 0;
  - mensaje de bienvenida ocupa el ancho útil de la burbuja;
  - texto de mensajes: 15.5 px / 22.475 px en móvil y 16 px / 23.2 px en escritorio;
  - botones micrófono/enviar: 48 x 48 px;
  - textarea cómodo y sin solapes.
- Envío escrito local:
  - mensaje enviado: OK;
  - textarea se limpia: OK;
  - respuesta del agente/fallback local: OK;
  - sin errores graves en consola.
- Micrófono:
  - botón visible y sin solape: OK;
  - pulsación del micrófono en navegador de prueba: no rompe UI y no genera errores de consola;
  - audio real no validado porque requiere permiso de micrófono y voz real en el dispositivo del usuario.

### Estado

- Cambio local validado.
- Commit principal: `e4b5bb0` (`Expand chatbot workspace`).
- Push a `main`: OK.
- Producción `https://aplaudia.com`: OK.
- Browser QA producción móvil 390x844:
  - panel abierto: 363 x 832 px;
  - área de mensajes: 704 px de alto;
  - mensaje de bienvenida: 341 px de ancho;
  - texto: 15.5 px / 22.475 px;
  - sin iconos laterales en mensajes;
  - sin X flotante redundante;
  - sin scroll horizontal;
  - sin errores graves en consola.
- Browser QA producción escritorio 1280x800:
  - panel abierto: 1009 x 752 px;
  - área de mensajes: 612 px de alto;
  - mensaje de bienvenida: 975 px de ancho;
  - texto: 16 px / 23.2 px;
  - sin X flotante redundante;
  - sin scroll horizontal;
  - sin errores graves en consola.

### Siguiente paso recomendado

Revisar en móvil real `https://aplaudia.com` tras despliegue. Si Carlos quiere aún más densidad, el siguiente ajuste sería acortar el saludo inicial o activar un modo específico cuando el teclado móvil esté abierto.

## Actualización urgente - Chatbot móvil

### Objetivo

Carlos detecta que el chatbot abierto en móvil tiene demasiado texto acumulado, obliga a leer con poco espacio y la letra se percibe pequeña. Se aplica un ajuste de usabilidad sin rediseñar la web.

### Cambios aplicados

- `components/agent/aplaudia-agent-widget.tsx`:
  - el panel abierto en móvil pasa a ocupar casi toda la altura útil (`h-[calc(100dvh-7rem)]`) y baja su margen inferior a `bottom-24`;
  - los márgenes laterales del panel en móvil bajan a `left-2 right-2` para ganar anchura real;
  - el área de mensajes mantiene scroll interno, con más espacio vertical disponible;
  - las burbujas de mensaje en móvil pasan a `text-base leading-7`;
  - el textarea mantiene `text-base` en móvil y sube a `min-h-12`;
  - los botones de micrófono y enviar pasan a `48px` en móvil;
  - el botón flotante del chat baja a `bottom-4` en móvil para dejar más altura al panel abierto;
  - escritorio conserva el comportamiento compacto (`sm:w-[390px]`, `sm:text-sm`, `sm:h-auto`).

### Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- Browser QA local móvil 390x844:
  - panel abierto: 704 px de alto;
  - área de mensajes: 568 px de alto;
  - mensaje: 16 px / 28 px de línea;
  - textarea: 16 px / 24 px de línea;
  - botones micrófono/enviar: 48 x 48 px;
  - sin scroll horizontal;
  - sin solapes entre textarea, micrófono y enviar.
- Browser QA local escritorio 1280x800:
  - panel compacto a la derecha: 390 px de ancho y 318 px de alto;
  - texto de mensajes en escritorio se mantiene a 14 px;
  - sin scroll horizontal.

### Estado

- Cambio local validado.
- Commit principal: `0278890` (`Improve mobile chatbot readability`).
- Push a `main`: OK.
- Producción `https://aplaudia.com`: OK, ya sirve las clases nuevas del chatbot móvil.
- Browser QA producción móvil 390x844:
  - panel abierto: 704 px de alto;
  - mensaje: 16 px / 28 px de línea;
  - textarea: 16 px / 24 px de línea;
  - botones micrófono/enviar: 48 x 48 px;
  - sin scroll horizontal;
  - sin solapes;
  - aviso de construcción visible en la esquina inferior izquierda.

### Siguiente paso recomendado

Revisar el chatbot abierto desde un móvil real en `https://aplaudia.com`. Si Carlos aún lo nota pequeño, el siguiente ajuste recomendado sería modo casi pantalla completa en móvil o acortar el saludo inicial del agente.

## Objetivo de la tarea

Seguimiento urgente tras la validación móvil de Carlos: el dictado por voz estaba desplegado, pero el botón se ocultaba cuando el navegador no exponía `SpeechRecognition` / `webkitSpeechRecognition`. Se ajusta el chatbot para que el micrófono sea visible también en móviles sin soporte y muestre un aviso discreto.

Tarea original: añadir dictado por voz al chatbot de Aplaudia tomando como referencia técnica el chat de Arik Custom, y ampliar `content/agent/aplaudia-agent.md` con instrucciones claras sobre identidad, servicios, casos reales y precios orientativos.

## Referencia revisada

- Repo local de referencia: `T:\20-PROYECTOS\ARIKCUSTOM\HTML`.
- Archivo localizado: `components/chat/chat-widget.tsx`.
- Lógica útil detectada:
  - detección de `SpeechRecognition` / `webkitSpeechRecognition`;
  - estado `isListening`;
  - `interimResults = true`;
  - idioma `es-ES`;
  - botón `Mic` / `MicOff`;
  - placeholder `Escuchando...`;
  - parada al cerrar el chat;
  - limpieza al desmontar el componente.

## Cambios aplicados

### Chatbot

- `components/agent/aplaudia-agent-widget.tsx`:
  - añadido botón de micrófono junto al textarea;
  - añadido estado activo/inactivo con `aria-pressed`;
  - añadido `aria-label` claro:
    - `Dictar mensaje por voz`;
    - `Parar dictado por voz`;
  - añadido mensaje discreto `Escuchando...`;
  - transcripción parcial al textarea con Web Speech API;
  - idioma fijado a `es-ES`;
  - parada del reconocimiento al cerrar el widget;
  - parada del reconocimiento al enviar mensaje;
  - limpieza del reconocimiento al desmontar;
  - fallback inicial: si el navegador no soportaba Web Speech API, el botón de micrófono no se mostraba;
  - corrección posterior: el botón de micrófono queda visible aunque no haya soporte y muestra el aviso `El dictado por voz no está disponible en este navegador.` al tocarlo.

### Instrucciones del agente

- `content/agent/aplaudia-agent.md` reestructurado con secciones editables:
  - identidad;
  - qué hace Aplaudia;
  - casos reales;
  - precios orientativos;
  - cómo hablar de precios;
  - cómo orientar al usuario;
  - qué no debe decir;
  - cierre recomendado.
- Se añadieron precios orientativos siempre con `desde`.
- Se reforzó que no debe inventar precios cerrados, plazos, garantías, clientes, dirección física, CIF ni datos legales.
- Se añadió criterio comercial para hablar de proyectos escalables según presupuesto.
- Tras una prueba real en producción, se reforzó una regla adicional:
  - si el usuario pregunta si Aplaudia programa o construye "con IA", el agente no debe explicar herramientas internas ni metodología;
  - debe redirigir a estrategia, diseño, desarrollo, revisión humana, resultado y siguiente paso.

### Documentación

- `README.md` documenta el dictado por voz del chatbot.
- `PROJECT_STATE.md` registra el nuevo dictado por voz y la ampliación del prompt del agente.
- `DECISIONS.md` corrige la fecha visible de construcción a `30 junio 2026`, alineada con producción.

## Archivos modificados

- `README.md`
- `PROJECT_STATE.md`
- `DECISIONS.md`
- `NEXT_TASK.md`
- `LAST_REPORT.md`
- `components/agent/aplaudia-agent-widget.tsx`
- `content/agent/aplaudia-agent.md`

## Validaciones ejecutadas

- Seguimiento móvil tras aviso de Carlos:
  - causa confirmada: el botón estaba desplegado, pero se ocultaba si el navegador móvil no exponía Web Speech API;
  - corrección aplicada: el botón de micrófono queda visible siempre junto al textarea;
  - si no hay soporte, al tocarlo muestra el aviso discreto `El dictado por voz no está disponible en este navegador.`;
  - QA local móvil 390x844: micrófono visible, enviar visible, textarea visible, sin solape y sin scroll horizontal.
  - Producción `https://aplaudia.com` tras el push `44f1ae4`: HTML nuevo servido y QA móvil 390x844 OK; micrófono visible, enviar visible, textarea visible, sin solapes y sin scroll horizontal.
- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK.
- `npm run lint`: falla por deuda previa; `eslint` no está instalado como dependencia ejecutable.
- `npx tsc --noEmit`: falla por deuda previa ya conocida:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineación antigua de mensajes `about` en `i18n/provider.tsx`.
- `git diff --check`: OK.
- QA local con `next start` en `http://127.0.0.1:3036`:
  - home `200`;
  - escritorio 1280x800: chatbot abre, micrófono visible, enviar visible, textarea visible, sin scroll horizontal;
  - móvil 390x844: micrófono visible, enviar visible, textarea visible, sin solape entre micrófono, enviar y textarea, sin scroll horizontal;
  - envío escrito: OK;
  - sin `OPENAI_API_KEY` local, `/api/agent` devuelve fallback controlado.
- API de producción tras el primer push:
  - pregunta de precios de web comercial y agente IA: OK, respondió con precios orientativos `desde 1.500 €` y `desde 500 €`;
  - pregunta directa sobre si se programa con IA: detectó una respuesta mejorable porque explicaba proceso interno;
  - prompt corregido para bloquear esa explicación interna y redirigir al valor del servicio.
- API de producción tras el segundo push:
  - pregunta directa `¿Programáis la web con IA?`: OK, ya no explica herramientas internas ni metodología;
  - pregunta de precios: OK, mantiene importes orientativos con `desde`;
  - `/api/agent` responde con `provider:"openai"` y `unavailable:false`.
- Browser QA producción escritorio 1280x800:
  - chatbot abre;
  - micrófono visible con `aria-label="Dictar mensaje por voz"`;
  - botón enviar visible;
  - textarea visible;
  - sin scroll horizontal.
- Browser QA producción móvil 390x844:
  - micrófono visible;
  - botón enviar visible;
  - textarea visible;
  - sin solape entre micrófono, enviar y textarea;
  - sin scroll horizontal.

## Validaciones pendientes o limitadas

- Dictado con audio real: requiere aceptar permiso de micrófono y hablar desde el navegador del usuario. No se aceptó permiso de micrófono desde Codex.
- iOS/Safari: Web Speech API puede no estar disponible o comportarse de forma limitada; el botón queda oculto si el navegador no expone `SpeechRecognition` / `webkitSpeechRecognition`.
- Corrección aplicada después de la prueba móvil de Carlos: en navegadores sin soporte, el botón ya no se oculta; queda visible y avisa al tocarlo.
- Railway CLI sigue sin sesión válida (`invalid_grant` / `Unauthorized`), pero producción en `https://aplaudia.com` sirve el cambio desplegado.

## Estado final esperado

- Chatbot conserva posición y diseño general.
- Micrófono añadido sin rediseñar la web.
- Chatbot sigue funcionando escribiendo.
- Agente sigue leyendo `content/agent/aplaudia-agent.md` desde `/api/agent`.
- No se han guardado secretos.

## Siguiente paso recomendado

1. Probar dictado real en `https://aplaudia.com` con permiso de micrófono desde Chrome/Edge.
2. Probar manualmente en móvil real Android.
3. Probar manualmente en iPhone/Safari y confirmar si el navegador muestra u oculta el botón.
4. Revisar varias respuestas reales del agente sobre precios, WhatsApp y casos.
5. Continuar con Resend y legal:
   - `RESEND_API_KEY`;
   - `CONTACT_RECIPIENT_EMAIL`;
   - `EMAIL_FROM`;
   - privacidad, cookies y consentimiento definitivo.
# LAST_REPORT - 2026-06-30 - Prueba de imágenes generadas para huecos visuales

## Objetivo

Probar una primera tanda de imágenes generadas para las zonas de Aplaudia que seguían preparadas con huecos visuales o recursos abstractos, sin rediseñar la web.

## Cambios aplicados

- Se generaron seis imágenes con el flujo integrado de imagegen:
  - mejora de imagen/producto con estética antes/después;
  - composición web por capas;
  - objeto visual para animaciones/loops;
  - pantalla comercial vertical;
  - sistema visual aplicado a dispositivos y soportes;
  - escena de estudio digital para la sección About.
- Se copiaron y optimizaron como `.webp` en `public/visuals/`.
- Se sustituyeron los bloques abstractos de `VisualGallery` por imágenes full-bleed manteniendo el mismo grid, animaciones y orden.
- Se sustituyó el placeholder textual de la sección About por una escena de estudio realista.
- No se tocaron textos comerciales, orden de secciones, formularios, chatbot, dominio, DNS ni backend.

## Archivos modificados

- `components/sections/visual-gallery.tsx`
- `components/sections/about.tsx`
- `public/visuals/ai-image-enhancement.webp`
- `public/visuals/web-composition-layers.webp`
- `public/visuals/motion-loop-cube.webp`
- `public/visuals/commercial-screen-content.webp`
- `public/visuals/campaign-system-devices.webp`
- `public/visuals/aplaudia-studio-workspace.webp`
- `LAST_REPORT.md`

## Validaciones ejecutadas

- `npm run build`: OK.
- `npm run lint`: falla porque `eslint` no está disponible como ejecutable local.
- QA local con `npx next dev --webpack -p 3102`:
  - home carga en `http://localhost:3102`;
  - 6 imágenes servidas desde `/visuals/`;
  - escritorio 1440x1000: galería visual carga completa, sin overflow horizontal;
  - escritorio 1440x1000: About carga la imagen de estudio, sin overflow horizontal;
  - móvil 390x844: galería visual carga completa, sin overflow horizontal;
  - móvil 390x844: About carga correctamente, sin overflow horizontal;
  - consola del navegador sin errores ni warnings graves.

## Estado final

- Primera propuesta visual generada e integrada.
- Las imágenes son ligeras para web: aproximadamente 40-82 KB cada una.
- La web conserva el aviso de construcción.
- No se han guardado secretos.

## Siguiente paso recomendado

1. Revisar visualmente en producción o preview si esta dirección encaja con el gusto de Carlos.
2. Si alguna pieza parece demasiado abstracta, generar variantes más concretas por sector: restaurante, tienda, profesional independiente, clínica, marca local o evento.
3. Si se aprueban, crear una pequeña fuente de contenido para estos assets en vez de dejarlos definidos dentro del componente.

# LAST_REPORT - 2026-06-30 - Motor reutilizable de chatbot

## Objetivo

Convertir el chatbot actual de Aplaudia en un patrón reutilizable y dejar Aplaudia preparada como base para adaptar el mismo motor a otras webs, empezando por Arik Custom.

## Cambios aplicados

- Se extrajo el widget monolítico a `components/agent/generic-agent-widget.tsx`.
- `components/agent/aplaudia-agent-widget.tsx` queda como wrapper de configuración específica de Aplaudia.
- Se añadieron helpers reutilizables:
  - `lib/agent/types.ts`;
  - `lib/agent/build-agent-prompt.ts`;
  - `lib/agent/read-agent-instructions.ts`.
- `app/api/agent/route.ts` ahora reutiliza `readAgentInstructions()` y `buildAgentPrompt()` manteniendo el archivo editable `content/agent/aplaudia-agent.md`.
- Se mantiene el comportamiento actual:
  - panel grande casi a pantalla completa;
  - X superior;
  - sin X flotante redundante al abrir;
  - mensajes a ancho completo para asistente;
  - scroll inteligente;
  - indicador flotante de más contenido;
  - textarea que se limpia al enviar y vuelve a altura mínima;
  - micrófono con `SpeechRecognition` / `webkitSpeechRecognition`;
  - fallback si no hay soporte de voz;
  - llamada server-side a OpenAI con `OPENAI_API_KEY`;
  - fallback si falta la API key.

## Archivos modificados

- `app/api/agent/route.ts`
- `components/agent/aplaudia-agent-widget.tsx`
- `components/agent/generic-agent-widget.tsx`
- `lib/agent/types.ts`
- `lib/agent/build-agent-prompt.ts`
- `lib/agent/read-agent-instructions.ts`
- `LAST_REPORT.md`

## Variables de entorno

- `OPENAI_API_KEY`: debe configurarse en Railway o en el entorno del despliegue; no se guarda en Git.
- `OPENAI_AGENT_MODEL`: opcional, permite cambiar el modelo sin tocar código.
- `APLAUDIA_AGENT_API_URL` y `APLAUDIA_AGENT_API_SECRET`: se conservan como fallback legado si existieran en entorno.

## Validaciones ejecutadas

- `npm install`: no fue necesario; `node_modules` ya existía.
- `npm run build`: OK desde `T:\20-PROYECTOS\APLAUDIA`.
- `npm run lint`: falla porque `eslint` no está disponible como binario local.
- `npx tsc --noEmit`: falla por deuda previa no relacionada:
  - tipos de `react-day-picker` en `components/ui/calendar.tsx`;
  - desalineación antigua de traducciones `about` en `i18n/provider.tsx`.
- QA local con `npx next dev --webpack -p 3101`:
  - home carga en `http://localhost:3101`;
  - aviso de construcción visible en formato completo o compacto;
  - chatbot abre y cierra en escritorio;
  - envío escrito OK;
  - textarea queda vacío y vuelve a altura mínima tras enviar;
  - fallback sin `OPENAI_API_KEY` OK;
  - móvil 390x844: panel casi completo, X superior, sin botón flotante duplicado, textarea a 16px y altura mínima.

## Validaciones limitadas

- Dictado con audio real no se ejecutó porque requiere aceptar permiso de micrófono desde el navegador del usuario.
- Respuesta larga real no se pudo validar localmente porque el entorno local no tenía `OPENAI_API_KEY` y devolvió fallback corto; el comportamiento de scroll largo queda cubierto por el motor extraído del widget ya probado.
- `npm run dev` con Turbopack falló por mezcla de ruta UNC/unidad `T:` al evaluar CSS; se validó con webpack, igual que el build del proyecto.

## Estado final

- Aplaudia conserva su comportamiento y diseño del chatbot.
- El motor reusable queda preparado para copiar/adaptar a otras webs.
- No se han guardado secretos.
- No se han tocado DNS, dominios, backend adicional, base de datos, auth ni pagos.

## Siguiente paso recomendado

1. Configurar o confirmar `OPENAI_API_KEY` en el entorno final donde deba responder el asistente.
2. Probar una respuesta larga real en producción con API key activa.
3. Probar dictado real desde Chrome/Edge móvil aceptando permiso de micrófono.
