const llmsText = `# Aplaudia

Aplaudia es un estudio digital boutique en España especializado en páginas web premium, agentes IA para WhatsApp y contenido visual mejorado con inteligencia artificial para negocios que quieren mejorar su presencia digital.

## Servicios principales

- Páginas web premium: diseño y desarrollo de webs modernas, rápidas, responsive y orientadas a negocio.
- Agentes IA para WhatsApp: automatización conversacional para responder clientes, captar contactos y mejorar la atención.
- Visuales mejorados con IA: mejora de imágenes, fondos, composiciones de producto y contenido visual para web, redes y pantallas.

## Idiomas

- Español de España como idioma principal.
- Catalán e inglés como idiomas secundarios.

## Dominio oficial

https://aplaudia.com
`

export function GET() {
  return new Response(llmsText, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  })
}
