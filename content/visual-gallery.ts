export type VisualGalleryItem = {
  id: string
  orientation: "vertical" | "horizontal"
  aspectClass?: string
  objectPosition?: string
  gradient: string
  src: string
  alt: string
}

export type VisualGalleryRowPattern = Array<VisualGalleryItem["orientation"]>

// Add, remove or reorder visual proof assets here without touching the gallery component.
// Use `orientation` to let the gallery build balanced rows automatically.
// Current pattern:
// 1) vertical + horizontal
// 2) horizontal + vertical
// 3) horizontal alone
export const visualGalleryRowPattern: VisualGalleryRowPattern[] = [
  ["vertical", "horizontal"],
  ["horizontal", "vertical"],
  ["horizontal"],
]

export const visualGalleryItems: VisualGalleryItem[] = [
  {
    id: "studio-editing",
    orientation: "vertical",
    aspectClass: "aspect-[3/4]",
    gradient: "from-primary/20 to-accent-cyan/20",
    src: "/visuals/ai-image-enhancement-real.webp",
    alt: "Pantalla de edicion con una prenda personalizada sobre una persona",
  },
  {
    id: "sport-storefront",
    orientation: "horizontal",
    aspectClass: "aspect-[4/3]",
    gradient: "from-accent-cyan/20 to-accent-violet/20",
    src: "/visuals/escaparate-01.webp",
    alt: "Escaparate realista con pantalla comercial para una tienda deportiva",
  },
  {
    id: "motion-editing",
    orientation: "horizontal",
    aspectClass: "aspect-[4/3]",
    gradient: "from-accent-violet/20 to-accent-magenta/20",
    src: "/visuals/real-motion-editing.webp",
    alt: "Edicion realista de contenido en video para web y redes",
  },
  {
    id: "retail-screen-clothing",
    orientation: "vertical",
    aspectClass: "aspect-[3/4]",
    gradient: "from-accent-magenta/20 to-primary/20",
    src: "/visuals/retail-screen-clothing.webp",
    alt: "Pantalla digital integrada en el interior de una tienda de moda",
  },
  {
    id: "pet-storefront",
    orientation: "horizontal",
    aspectClass: "aspect-[16/9] md:aspect-[21/9]",
    gradient: "from-primary/10 via-accent-cyan/10 to-accent-violet/10",
    src: "/visuals/escaparate-02.webp",
    alt: "Escaparate realista de tienda de animales con pantalla comercial",
  },
]
