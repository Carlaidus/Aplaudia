# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Extremadamente alto

## Objetivo inmediato

Corregir la navegacion en paginas internas de casos y crear un agente IA flotante propio de Aplaudia, inspirado en el agente ya implementado en Arik Custom, sin romper la home, el portfolio ni la experiencia movil.

## Repos implicados

- Repo principal: `Carlaidus/Aplaudia`.
- Repo de referencia para el agente IA: `Carlaidus/v0-diseno-web-arik-custom`.

## Contexto confirmado

- `https://aplaudia.com/` funciona y debe mantener aviso de construccion hasta validacion final.
- Hay paginas internas de casos, por ejemplo:
  - `/casos`;
  - `/casos/cronoras`;
  - `/casos/arik-custom`;
  - `/casos/aventuras-pixeladas`.
- En la home, la navegacion superior funciona bien: servicios, proceso, portfolio, WhatsApp IA y nosotros.
- En paginas internas de caso vuelve a aparecer la misma barra, pero esos enlaces no funcionan correctamente porque apuntan a anclas pensadas para la home.
- Hay que elegir la solucion mas limpia para UX y mantenerla coherente.
- Carlos quiere ademas un agente IA flotante en Aplaudia, parecido al ya creado en Arik Custom, pero adaptado a Aplaudia.
- El agente de Aplaudia debe responder dudas sobre lo que hace Aplaudia, servicios, casos, proceso y contacto.
- La configuracion/instrucciones del agente debe vivir en un archivo de texto editable para que Carlos pueda modificarlo facilmente.
- El agente real via WhatsApp/Meta se deja para mas adelante; esta tarea es el agente IA web flotante dentro de Aplaudia.

## Problema 1: navegacion en paginas internas

En paginas de caso, la barra superior muestra enlaces como servicios, proceso, portfolio, WhatsApp IA y nosotros, pero al estar dentro de una ruta como `/casos/arik-custom`, esas anclas no navegan bien.

### Tarea de navegacion

1. Revisar `header`, layout de casos y rutas internas.
2. Decidir e implementar la mejor solucion UX:
   - opcion A: mantener header global pero hacer que los enlaces apunten correctamente a `/#servicios`, `/#proceso`, `/#portfolio`, `/#whatsapp`, `/#nosotros`, etc.;
   - opcion B: en paginas internas usar un header simplificado con logo + boton claro para volver a casos/home;
   - opcion C: ocultar la barra de navegacion secundaria en paginas internas y reforzar el boton `Volver a casos`.
3. Priorizar lo que sea mas claro para el usuario y menos propenso a romperse.
4. El boton `Volver a casos` debe ser mas visible si queda como navegacion principal de paginas internas.
5. Validar que desde cualquier caso se puede:
   - volver a `/casos`;
   - volver a la home;
   - navegar correctamente a secciones de la home si se mantiene la barra.
6. No dejar enlaces muertos ni anclas que no funcionen.

## Problema 2: agente IA flotante en Aplaudia

Carlos quiere un agente IA web parecido al de Arik Custom, con icono flotante, bien adaptado a movil y escritorio.

### Tarea de agente IA

1. Revisar primero como esta implementado el agente/chat en `Carlaidus/v0-diseno-web-arik-custom`:
   - componentes;
   - API route;
   - prompt/instrucciones;
   - comportamiento en movil;
   - puntos fuertes;
   - errores o cosas a evitar.
2. Traer a Aplaudia una version adaptada, no una copia ciega.
3. Crear un icono flotante propio de Aplaudia:
   - que encaje con la estetica azul/cian/oscura;
   - que parezca un asistente IA de Aplaudia, no un WhatsApp oficial;
   - que no tape CTAs ni el aviso de construccion;
   - que funcione bien en movil.
4. El chat debe poder abrirse y cerrarse.
5. En movil debe ocupar el espacio de forma comoda, sin salirse de pantalla y sin tapar controles importantes.
6. Crear un archivo editable para instrucciones del agente, por ejemplo:
   - `content/agent/aplaudia-agent.md`
   - o similar.
7. Ese archivo debe explicar al agente:
   - que es Aplaudia;
   - que servicios ofrece;
   - que casos reales puede mencionar;
   - tono de respuesta;
   - como orientar al usuario hacia contacto;
   - que no debe inventar datos, precios, plazos, clientes ni garantias.
8. Crear una API route para el chat si hace falta, siguiendo el patron de Arik Custom.
9. No guardar claves ni secretos en el repo.
10. Preparar variables de entorno necesarias sin poner valores reales:
    - documentar exactamente que variable hay que crear;
    - por ejemplo `OPENAI_API_KEY`, si ese es el patron usado.
11. Si falta clave/API real, el chat debe fallar de forma elegante o mostrar estado no configurado, pero no romper la web.
12. No mencionar en la web publica que Aplaudia programa con IA.
13. El agente puede usar IA para responder, pero publicamente debe mostrarse como asistente digital de Aplaudia.

## WhatsApp real

- El enlace real a WhatsApp puede dejarse como CTA aparte si ya existe.
- Numero confirmado para WhatsApp: `659304487` / formato internacional `34659304487`.
- El agente web flotante no sustituye todavia la integracion futura con WhatsApp Business/Meta.
- Documentar claramente la diferencia:
  - agente web Aplaudia ahora;
  - WhatsApp Business/API mas adelante.

## Validaciones obligatorias

- `npm install` si hace falta.
- `npm run build`.
- `npm run lint` si esta disponible.
- Revisar home en movil y escritorio.
- Revisar `/casos` y las paginas de caso en movil y escritorio.
- Probar navegacion header/anclas desde home y desde paginas internas.
- Probar apertura/cierre del agente IA en movil y escritorio.
- Probar comportamiento si falta la API key.
- Confirmar que no hay errores graves en consola.
- Confirmar que `/robots.txt`, `/llms.txt` y `/sitemap.xml` siguen funcionando.
- Confirmar Railway/produccion en verde tras push.

## Documentacion

Actualizar `LAST_REPORT.md` con:

- solucion elegida para la navegacion en paginas internas;
- cambios aplicados al header o layout;
- como se implemento el agente IA;
- archivo de instrucciones creado;
- variables de entorno necesarias;
- diferencias entre agente web y futuro WhatsApp/Meta;
- archivos modificados;
- validaciones ejecutadas;
- estado final de Railway;
- siguiente paso recomendado.

Actualizar `NEXT_TASK.md` con el siguiente foco real.

## Restricciones

- No redisenar la web completa.
- No romper la home.
- No romper movil.
- No tocar dominio, DNS ni Cloudflare.
- No anadir base de datos, auth ni pagos.
- No guardar claves ni secretos.
- No mencionar programacion con IA como mensaje publico.
- No inventar datos de empresa, precios, clientes, plazos ni garantias.
- No copiar errores visuales del agente de Arik Custom; aprender de el y adaptarlo.

## Cierre esperado

- Navegacion funcional desde home y paginas internas.
- Paginas de caso sin header roto ni enlaces muertos.
- Boton de vuelta a casos/home claro.
- Agente IA flotante de Aplaudia implementado o dejado preparado con fallback seguro si falta clave.
- Archivo editable de instrucciones del agente.
- Railway en verde.
