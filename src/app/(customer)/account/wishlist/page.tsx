"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  gold: "from-[#f9e8c8] to-[#fdf4ee]",
  silver: "from-[#e8ecf0] to-[#f5f7fa]",
  "rose-gold": "from-[#f9dfe8] to-[#fdf4ee]",
  oxidised: "from-[#d4d0c8] to-[#e8e4dc]",
  multi: "from-[#e8f0f9] to-[#fdf4ee]",
};

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const { addItem } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf9f5]">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Heart size={22} className="text-[#c5295d]" strokeWidth={1.5} />
            <div>
              <h1
                className="text-2xl font-bold text-[#3a0820] lg:text-3xl"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                My Wishlist
              </h1>
              <p className="text-sm text-[#3a0820]/50">
                {items.length} saved piece{items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-[#6b1040]/10 bg-white py-24 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#c5962a]/30">
                <Heart size={32} strokeWidth={1} className="text-[#c5962a]/40" />
              </div>
              <p
                className="text-xl font-semibold text-[#6b1040]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Your wishlist is empty
              </p>
              <p className="mt-2 text-sm text-[#3a0820]/50">
                Tap the heart on any product to save it here.
              </p>
              <Link
                href="/earrings"
                className="mt-7 rounded-full bg-[#6b1040] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3a0820]"
              >
                Start Browsing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => {
                const gradient = PLACEHOLDER_GRADIENTS[item.metal] ?? PLACEHOLDER_GRADIENTS.multi;
                const displayPrice = item.discountPrice ?? item.price;
                const discount = item.discountPrice
                  ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
                  : 0;

                return (
                  <div key={item._id} className="group relative rounded-2xl bg-white p-3 shadow-sm">
                    {/* Image */}
                    <Link href={`/${item.categorySlug}/${item.slug}`}>
                      <div
                        className={`relative mb-3 aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${gradient}`}
                      >
                        {item.images[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <div className="h-12 w-12 rounded-full border-2 border-[#c5962a]/30" />
                          </div>
                        )}
                        {discount > 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-[#c5295d] px-2 py-0.5 text-[10px] font-semibold text-white">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Remove */}
                    <button
                      onClick={() => toggle(item)}
                      aria-label="Remove from wishlist"
                      className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={13} className="text-[#c5295d]" />
                    </button>

                    {/* Info */}
                    <Link href={`/${item.categorySlug}/${item.slug}`}>
                      <p
                        className="mb-1 line-clamp-2 text-sm font-medium text-[#3a0820] hover:text-[#c5295d]"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {item.name}
                      </p>
                    </Link>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-sm font-bold text-[#6b1040]">
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </span>
                      {item.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Quick add */}
                    <button
                      onClick={() =>
                        addItem({
                          productId: item._id,
                          productSlug: item.slug,
                          categorySlug: item.categorySlug,
                          name: item.name,
                          image: item.images[0] ?? "",
                          price: displayPrice,
                          giftWrap: false,
                          quantity: 1,
                        })
                      }
                      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#6b1040] py-2 text-[11px] font-semibold tracking-wider text-white transition-colors hover:bg-[#3a0820]"
                    >
                      <ShoppingBag size={12} />
                      Add to Bag
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
