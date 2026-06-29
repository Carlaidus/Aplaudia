# NEXT TASK - Aplaudia

Prioridad: Alta
Modelo recomendado: GPT-5.5
Nivel de inteligencia recomendado: Alto

## Objetivo inmediato

Revisar en producción con Carlos la nueva versión de portfolio/casos y decidir si Aplaudia queda lista para validación final o si falta una última capa comercial, legal o de contacto.

## Repo

`Carlaidus/Aplaudia`

## Rama actual

`main`

## Contexto confirmado

- `https://aplaudia.com/` funciona y debe mantener aviso de construcción hasta validación final de Carlos.
- Último commit de portfolio verificado en producción: `70fceb871b700b4196a865dd04437b38aa8be7b2`.
- Railway CLI quedó sin sesión (`invalid_grant`), pero producción sirvió el nuevo contenido y assets con `200`.
- El portfolio usa trabajos reales:
  - Cronoras;
  - Arik Custom;
  - Aventuras Pixeladas.
- La estrategia recomendada sigue siendo híbrida:
  - resumen potente dentro de Aplaudia;
  - ficha propia por caso;
  - enlace externo a web/demo real cuando proceda.
- No tocar backend, base de datos, auth, pagos, dominio, DNS ni Cloudflare salvo petición explícita.

## Estado de la última tarea

Se corrigió la estructura visual de las fichas de caso sin rediseñar la web:

- Cada proyecto tiene imagen principal de portada o demo principal.
- Cada proyecto tiene exactamente tres vistas clave.
- Los tres casos enseñan un panel de control o gestión:
  - Cronoras: panel administrativo/operativo;
  - Arik Custom: panel de gestión de productos, líneas, familias, servicios y presupuestos;
  - Aventuras Pixeladas: control modular de cartuchos.
- Aventuras Pixeladas ahora muestra los cartuchos de la home real y una animación ligera de movimiento/expansión.
- El aviso de construcción sigue visible.

## Tarea para la próxima sesión

1. Revisar producción:
   - `https://aplaudia.com/#portfolio`;
   - `https://aplaudia.com/casos`;
   - `https://aplaudia.com/casos/cronoras`;
   - `https://aplaudia.com/casos/arik-custom`;
   - `https://aplaudia.com/casos/aventuras-pixeladas`.

2. Revisar con Carlos en móvil real y escritorio:
   - si Cronoras comunica SaaS/producto real;
   - si Arik Custom comunica catálogo, ficha y gestión interna;
   - si Aventuras Pixeladas comunica cartuchos, paneles, control modular y base editorial;
   - si las imágenes se sienten serias y suficientemente comerciales.

3. Decidir el siguiente foco antes de lanzamiento:
   - mantener portfolio tal cual;
   - añadir resultados reales confirmados;
   - añadir stack técnico resumido;
   - añadir proceso de trabajo;
   - añadir testimonio solo si existe texto real aprobado;
   - preparar legal básico y llamada de contacto real.

4. Deuda técnica recomendada:
   - instalar/configurar ESLint para que `npm run lint` funcione;
   - revisar `react-day-picker` y tipos de calendario para que `npx tsc --noEmit` pase;
   - alinear mensajes i18n de `about` en ES/CA/EN;
   - mantener `next build --webpack` mientras el workspace local siga en unidad de red.

## Validaciones recomendadas

- `npm run build`.
- `npm run lint` solo después de configurar ESLint.
- `npx tsc --noEmit` solo después de resolver deuda de tipos/i18n.
- Revisar Railway.
- Revisar `https://aplaudia.com/#portfolio`.
- Revisar las tres rutas de caso en móvil y escritorio.

## Restricciones

- No rediseñar la web completa.
- No cambiar identidad visual.
- No cambiar el orden general de secciones de la home.
- No inventar clientes, datos legales, resultados, cifras o testimonios.
- No usar capturas privadas ni paneles con datos reales sensibles.
- No tocar dominio, DNS ni Cloudflare salvo petición explícita.
- No añadir backend, base de datos, auth ni pagos.
- No guardar secretos.

## Cierre esperado de la próxima sesión

- Railway en verde.
- Portfolio revisado en producción.
- Decisión de Carlos sobre si se retira el aviso de construcción o si queda una última revisión comercial/legal antes del lanzamiento.
