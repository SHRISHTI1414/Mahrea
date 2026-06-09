"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/stores/cart.store";

export default function CartPage() {
  const { items, totals, fetchCart, updateQty, removeItem } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf9f5]">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <h1
            className="mb-8 text-2xl font-bold text-[#6b1040] lg:text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag size={48} className="mb-4 text-[#c5962a]/30" />
              <p className="text-lg font-semibold text-[#6b1040]" style={{ fontFamily: "var(--font-playfair)" }}>
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-[#3a0820]/50">Browse our collections and find something you love</p>
              <Link
                href="/rings"
                className="mt-6 rounded-full bg-[#6b1040] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3a0820]"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl bg-white shadow-sm">
                  <ul className="divide-y divide-[#6b1040]/8">
                    {items.map((item) => (
                      <li key={item._id} className="flex gap-4 p-5">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#f9e8c8] to-[#fdf4ee]">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <div className="h-8 w-8 rounded-full border border-[#c5962a]/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/${item.categorySlug}/${item.productSlug}`}
                              className="font-semibold text-[#3a0820] hover:text-[#c5295d] transition-colors"
                              style={{ fontFamily: "var(--font-playfair)" }}
                            >
                              {item.name}
                            </Link>
                            <button onClick={() => removeItem(item._id)} className="text-[#3a0820]/30 hover:text-[#c5295d]">
                              <X size={16} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 text-xs text-[#3a0820]/50">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.giftWrap && <span className="text-[#c5962a]">• Gift wrapped (+₹199)</span>}
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 rounded-full border border-[#6b1040]/15 px-3 py-1.5">
                              <button onClick={() => item.quantity > 1 ? updateQty(item._id, item.quantity - 1) : removeItem(item._id)}>
                                <Minus size={12} className="text-[#6b1040]/60" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button onClick={() => updateQty(item._id, item.quantity + 1)}>
                                <Plus size={12} className="text-[#6b1040]/60" />
                              </button>
                            </div>
                            <span className="font-bold text-[#6b1040]">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/rings" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#c5295d] underline underline-offset-4">
                  ← Continue Shopping
                </Link>
              </div>

              {/* Summary */}
              <div>
                <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#3a0820]/50">Order Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-[#3a0820]/60">
                      <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {totals.giftWrap > 0 && (
                      <div className="flex justify-between text-[#c5962a]">
                        <span>Gift wrapping</span>
                        <span>₹{totals.giftWrap.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#3a0820]/60">
                      <span>Shipping</span>
                      <span>{totals.shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${totals.shipping}`}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#6b1040]/10 pt-3 text-base font-bold text-[#6b1040]">
                      <span>Total</span>
                      <span>₹{totals.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {totals.subtotal < 499 && (
                    <p className="mt-3 rounded-xl bg-[#fdf4ee] px-3 py-2 text-xs text-[#6b1040]">
                      Add ₹{(499 - totals.subtotal).toLocaleString("en-IN")} more for free shipping
                    </p>
                  )}

                  <Link
                    href="/checkout"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#6b1040] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#3a0820]"
                  >
                    Checkout <ArrowRight size={15} />
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-[#3a0820]/30">
                    <span>🔒 Secure payment</span>
                    <span>•</span>
                    <span>↩ Easy returns</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
