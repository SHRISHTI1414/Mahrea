"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Share2, CheckCircle } from "lucide-react";

interface Variant {
  size: string;
  stock: number;
}

interface ProductInfoProps {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    description: string;
    metal: string;
    metalColour: string;
    material: string;
    variants: Variant[];
    stock: number;
    categorySlug: string;
    tags: string[];
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants[0]?.size ?? ""
  );
  const [giftWrap, setGiftWrap] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayPrice = product.discountPrice ?? product.price;
  const totalPrice = displayPrice + (giftWrap ? 199 : 0);

  const selectedVariant = product.variants.find((v) => v.size === selectedSize);
  const stockCount = selectedVariant ? selectedVariant.stock : product.stock;
  const inStock = stockCount > 0;
  const lowStock = stockCount > 0 && stockCount <= 5;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <div>
        <p className="mb-1 text-xs font-medium tracking-[0.25em] text-[#c5962a] uppercase">
          {product.categorySlug.replace(/-/g, " ")}
        </p>
        <h1
          className="text-2xl font-bold text-[#3a0820] lg:text-3xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {product.name}
        </h1>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-[#6b1040]">
          ₹{displayPrice.toLocaleString("en-IN")}
        </span>
        {product.discountPrice && (
          <>
            <span className="text-base text-gray-400 line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full bg-[#c5295d] px-2.5 py-0.5 text-xs font-semibold text-white">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock badge */}
      {inStock ? (
        lowStock ? (
          <p className="text-xs font-semibold text-[#c5295d]">
            Only {stockCount} left — order soon!
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <CheckCircle size={13} />
            In Stock
          </p>
        )
      ) : (
        <p className="text-xs font-semibold text-gray-400">Out of Stock</p>
      )}

      {/* Size selector */}
      {product.variants.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#3a0820]/60">
            Size
            {selectedSize && <span className="ml-2 font-normal normal-case text-[#6b1040]">{selectedSize}</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.size}
                disabled={v.stock === 0}
                onClick={() => setSelectedSize(v.size)}
                className={`relative h-10 w-10 rounded-full text-sm font-medium transition-all ${
                  selectedSize === v.size
                    ? "bg-[#6b1040] text-white shadow-md"
                    : v.stock === 0
                    ? "border border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border border-[#6b1040]/25 text-[#6b1040] hover:border-[#6b1040]"
                }`}
              >
                {v.size}
                {v.stock === 0 && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="absolute w-[130%] rotate-45 border-t border-gray-300" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gift packaging */}
      <button
        onClick={() => setGiftWrap((g) => !g)}
        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
          giftWrap
            ? "border-[#c5962a] bg-[#fdf4e8]"
            : "border-[#6b1040]/15 bg-white hover:border-[#c5962a]/40"
        }`}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
            giftWrap ? "bg-[#c5962a]" : "bg-[#fdf4ee]"
          }`}
        >
          <span className="text-lg">{giftWrap ? "✓" : "🎁"}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#3a0820]">Make it Special</p>
          <p className="text-xs text-[#3a0820]/50">Gift wrapping + personal message card</p>
        </div>
        <span className="text-sm font-bold text-[#c5962a]">+₹199</span>
      </button>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all ${
            added
              ? "bg-green-600 text-white"
              : inStock
              ? "bg-[#6b1040] text-white hover:bg-[#3a0820]"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          <ShoppingBag size={16} />
          {added ? "Added to Cart!" : inStock ? `Add to Cart — ₹${totalPrice.toLocaleString("en-IN")}` : "Out of Stock"}
        </button>
        <button
          onClick={() => setWishlisted((w) => !w)}
          aria-label="Wishlist"
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#6b1040]/20 transition-colors hover:border-[#c5295d] hover:bg-[#fde8f0]"
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            className={wishlisted ? "fill-[#c5295d] text-[#c5295d]" : "text-[#6b1040]"}
          />
        </button>
        <button
          aria-label="Share"
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#6b1040]/20 transition-colors hover:border-[#6b1040]"
        >
          <Share2 size={16} className="text-[#6b1040]" />
        </button>
      </div>

      {/* Product details */}
      <div className="rounded-2xl border border-[#6b1040]/10 bg-white p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3a0820]/50">
          Product Details
        </h3>
        <div className="space-y-2.5">
          {[
            { label: "Material", value: product.material },
            { label: "Metal", value: product.metal.replace(/-/g, " ") },
            { label: "Colour", value: product.metalColour.replace(/-/g, " ") },
            ...(product.tags.length ? [{ label: "Tags", value: product.tags.join(", ") }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="w-20 flex-shrink-0 text-xs text-[#3a0820]/40 capitalize">{label}</span>
              <span className="text-xs text-[#3a0820] capitalize">{value}</span>
            </div>
          ))}
        </div>
        {product.description && (
          <p className="mt-4 border-t border-[#6b1040]/8 pt-4 text-sm leading-relaxed text-[#3a0820]/60">
            {product.description}
          </p>
        )}
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: "↩", label: "Easy Returns", sub: "7-day returns" },
          { icon: "✦", label: "Anti-Tarnish", sub: "6-month guarantee" },
          { icon: "🚚", label: "Free Shipping", sub: "On orders ₹499+" },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="rounded-xl bg-[#fdf4ee] p-3">
            <p className="mb-1 text-lg">{icon}</p>
            <p className="text-[11px] font-semibold text-[#6b1040]">{label}</p>
            <p className="text-[10px] text-[#3a0820]/40">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
