"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    categorySlug: string;
    price: number;
    discountPrice?: number;
    images: string[];
    metal: string;
    isFeatured: boolean;
  };
}

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  gold: "from-[#f9e8c8] to-[#fdf4ee]",
  silver: "from-[#e8ecf0] to-[#f5f7fa]",
  "rose-gold": "from-[#f9dfe8] to-[#fdf4ee]",
  oxidised: "from-[#d4d0c8] to-[#e8e4dc]",
  multi: "from-[#e8f0f9] to-[#fdf4ee]",
};

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const gradient = PLACEHOLDER_GRADIENTS[product.metal] ?? PLACEHOLDER_GRADIENTS.multi;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative">
      <Link href={`/${product.categorySlug}/${product.slug}`}>
        <div
          className={`relative mb-3 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}`}
        >
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="h-16 w-16 rounded-full border-2 border-[#c5962a]/30" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="rounded-full bg-[#6b1040] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white">
                BESTSELLER
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-[#c5295d] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                -{discount}%
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={() => setWishlisted((w) => !w)}
        aria-label="Add to wishlist"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
      >
        <Heart
          size={15}
          strokeWidth={1.5}
          className={wishlisted ? "fill-[#c5295d] text-[#c5295d]" : "text-[#6b1040]/60"}
        />
      </button>

      {/* Info */}
      <div className="px-0.5">
        <Link href={`/${product.categorySlug}/${product.slug}`}>
          <p
            className="mb-1 line-clamp-2 text-sm font-medium text-[#3a0820] transition-colors group-hover:text-[#c5295d]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {product.name}
          </p>
        </Link>
        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-sm font-bold text-[#6b1040]">
                ₹{product.discountPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-[#6b1040]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
