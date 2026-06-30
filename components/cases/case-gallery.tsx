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
          className="h-[100dvh] w-[100vw] max-w-none overflow-hidden rounded-none border-0 bg-black/95 p-0 shadow-2xl sm:max-w-none"
          showCloseButton={false}
        >
          {selectedImage && (
            <div className="relative h-full w-full">
              <div className="absolute inset-0">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  sizes="100vw"
                  className="object-contain p-2 sm:p-4"
                  priority
                />
              </div>

              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/85 via-black/45 to-transparent px-4 pb-12 pt-4 sm:px-6 sm:pt-5">
                <div className="max-w-[calc(100%-4rem)]">
                  <DialogTitle className="text-base font-semibold sm:text-lg">
                    {selectedImage.title}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-muted-foreground">
                    {label}
                  </DialogDescription>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-2xl backdrop-blur transition-colors hover:border-white/40 hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-6 sm:top-5"
                aria-label="Cerrar imagen ampliada"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <p className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pt-14 text-sm leading-relaxed text-white/80 sm:px-6 sm:pb-5">
                {selectedImage.description}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
