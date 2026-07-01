export type VisualGalleryItem = {
  id: string
  aspect: string
  span: string
  gradient: string
  src: string
  sizes: string
  alt: string
}

// Add, remove or reorder visual proof assets here without touching the gallery component.
export const visualGalleryItems: VisualGalleryItem[] = [
  {
    id: "studio-editing",
    aspect: "aspect-[4/5]",
    span: "mb-6 inline-block w-full break-inside-avoid align-top",
    gradient: "from-primary/20 to-accent-cyan/20",
    src: "/visuals/ai-image-enhancement-real.webp",
    sizes: "(min-width: 768px) 45vw, 100vw",
    alt: "Pantalla de edicion con una prenda personalizada sobre una persona",
  },
  {
    id: "sport-storefront",
    aspect: "aspect-video",
    span: "mb-6 inline-block w-full break-inside-avoid align-top",
    gradient: "from-accent-cyan/20 to-accent-violet/20",
    src: "/visuals/escaparate-01.webp",
    sizes: "(min-width: 768px) 45vw, 100vw",
    alt: "Escaparate realista con pantalla comercial para una tienda deportiva",
  },
  {
    id: "motion-editing",
    aspect: "aspect-video",
    span: "mb-6 inline-block w-full break-inside-avoid align-top",
    gradient: "from-accent-violet/20 to-accent-magenta/20",
    src: "/visuals/real-motion-editing.webp",
    sizes: "(min-width: 768px) 45vw, 100vw",
    alt: "Edicion realista de contenido en video para web y redes",
  },
  {
    id: "retail-screen-clothing",
    aspect: "aspect-[4/5]",
    span: "mb-6 inline-block w-full break-inside-avoid align-top",
    gradient: "from-accent-magenta/20 to-primary/20",
    src: "/visuals/retail-screen-clothing.webp",
    sizes: "(min-width: 768px) 45vw, 100vw",
    alt: "Pantalla vertical en tienda mostrando una prenda sobre una persona",
  },
  {
    id: "pet-storefront",
    aspect: "aspect-[4/3]",
    span: "mb-6 inline-block w-full break-inside-avoid align-top",
    gradient: "from-primary/10 via-accent-cyan/10 to-accent-violet/10",
    src: "/visuals/escaparate-02.webp",
    sizes: "(min-width: 768px) 45vw, 100vw",
    alt: "Escaparate realista de tienda de animales con pantalla comercial",
  },
]
