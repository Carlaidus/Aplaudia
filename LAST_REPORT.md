# LAST REPORT

Fecha: 2026-06-30

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
- Pendiente de commit, push y comprobación en producción.

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
