"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  gold: "from-[#f9e8c8] to-[#fdf4ee]",
  silver: "from-[#e8ecf0] to-[#f5f7fa]",
  "rose-gold": "from-[#f9dfe8] to-[#fdf4ee]",
  oxidised: "from-[#d4d0c8] to-[#e8e4dc]",
  multi: "from-[#e8f0f9] to-[#fdf4ee]",
};

interface ImageGalleryProps {
  images: string[];
  name: string;
  metal: string;
}

export default function ImageGallery({ images, name, metal }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const gradient = PLACEHOLDER_GRADIENTS[metal] ?? PLACEHOLDER_GRADIENTS.multi;
  const hasImages = images.length > 0;

  const prev = () => setActive((a) => (a - 1 + (images.length || 1)) % (images.length || 1));
  const next = () => setActive((a) => (a + 1) % (images.length || 1));

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      {/* Main image */}
      <div className="relative flex-1">
        <div
          className={`relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} cursor-zoom-in`}
          onClick={() => setZoomed(true)}
        >
          {hasImages ? (
            <Image
              src={images[active]}
              alt={`${name} — view ${active + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-[#c5962a]/30">
                <div className="h-24 w-24 rounded-full border-2 border-[#c5962a]/20" />
                <div className="h-12 w-12 rounded-full border border-[#c5962a]/10" />
              </div>
            </div>
          )}
          {/* Zoom hint */}
          <button
            onClick={() => setZoomed(true)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm text-[#6b1040] transition hover:bg-white"
            aria-label="Zoom image"
          >
            <ZoomIn size={16} />
          </button>
          {/* Arrows */}
          {hasImages && images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm text-[#6b1040] transition hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm text-[#6b1040] transition hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-2 lg:flex-col lg:w-20">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all lg:w-20 ${
                i === active ? "border-[#6b1040]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoomed && hasImages && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] aspect-square">
            <Image
              src={images[active]}
              alt={name}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute right-6 top-6 text-white/70 hover:text-white text-3xl"
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
