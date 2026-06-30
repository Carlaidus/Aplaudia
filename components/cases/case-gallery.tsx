"use client"

import { useState } from "react"
import Image from "next/image"
import { Expand, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import type { PortfolioImage } from "@/lib/cases"

type CaseGalleryProps = {
  images: readonly PortfolioImage[]
  label: string
}

export function CaseGallery({ images, label }: CaseGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <article
            key={image.src}
            data-case-gallery-item
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <button
              type="button"
              onClick={() => setSelectedImage(image)}
              className="group relative block aspect-[16/10] w-full bg-secondary text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Ampliar imagen: ${image.title}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-background/80 text-foreground opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
            <div className="p-5">
              <h3 className="text-lg font-semibold tracking-tight">
                {image.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {image.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent
          data-case-lightbox
          className="h-[96dvh] w-[98vw] max-w-[98vw] overflow-hidden border-border bg-background/95 p-0 shadow-2xl sm:max-w-[98vw] lg:max-w-[min(98vw,110rem)]"
          showCloseButton={false}
        >
          {selectedImage && (
            <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
              <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
                <div>
                  <DialogTitle className="text-base font-semibold sm:text-lg">
                    {selectedImage.title}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-muted-foreground">
                    {label}
                  </DialogDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Cerrar imagen ampliada"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="relative min-h-0 bg-black/60">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  sizes="96vw"
                  className="object-contain"
                  priority
                />
              </div>

              <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground sm:px-5">
                {selectedImage.description}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
