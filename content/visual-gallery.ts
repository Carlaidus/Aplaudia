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
    span: "md:col-span-5 md:row-start-1 md:mt-12 lg:mt-16",
    gradient: "from-primary/20 to-accent-cyan/20",
    src: "/visuals/ai-image-enhancement-real.webp",
    sizes: "(min-width: 768px) 50vw, 100vw",
    alt: "Pantalla de edicion con una prenda personalizada sobre una persona",
  },
  {
    id: "sport-storefront",
    aspect: "aspect-video",
    span: "md:col-span-5 md:col-start-6 md:row-start-1 md:z-10",
    gradient: "from-accent-cyan/20 to-accent-violet/20",
    src: "/visuals/escaparate-01.webp",
    sizes: "(min-width: 768px) 50vw, 100vw",
    alt: "Escaparate realista con pantalla comercial para una tienda deportiva",
  },
  {
    id: "motion-editing",
    aspect: "aspect-video",
    span: "md:col-span-5 md:col-start-6 md:row-start-2 md:-mt-[27rem] lg:-mt-[30rem]",
    gradient: "from-accent-violet/20 to-accent-magenta/20",
    src: "/visuals/real-motion-editing.webp",
    sizes: "(min-width: 768px) 50vw, 100vw",
    alt: "Edicion realista de contenido en video para web y redes",
  },
  {
    id: "retail-screen-clothing",
    aspect: "aspect-[4/5]",
    span: "md:col-span-5 md:row-start-2 md:-mt-16 lg:-mt-20",
    gradient: "from-accent-magenta/20 to-primary/20",
    src: "/visuals/retail-screen-clothing.webp",
    sizes: "(min-width: 768px) 50vw, 100vw",
    alt: "Pantalla vertical en tienda mostrando una prenda sobre una persona",
  },
  {
    id: "pet-storefront",
    aspect: "aspect-[4/3]",
    span: "md:col-span-5 md:col-start-6 md:row-start-3 md:-mt-[43rem] lg:-mt-[47rem]",
    gradient: "from-primary/10 via-accent-cyan/10 to-accent-violet/10",
    src: "/visuals/escaparate-02.webp",
    sizes: "(min-width: 768px) 50vw, 100vw",
    alt: "Escaparate realista de tienda de animales con pantalla comercial",
  },
]
