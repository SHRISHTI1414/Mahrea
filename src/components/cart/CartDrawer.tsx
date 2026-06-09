"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";

export default function CartDrawer() {
  const { items, totals, drawerOpen, closeDrawer, fetchCart, updateQty, removeItem } =
    useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#6b1040]/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#6b1040]" />
            <h2
              className="text-base font-bold text-[#6b1040]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c5295d] text-[10px] font-bold text-white">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="rounded-full p-1.5 text-[#6b1040]/60 transition-colors hover:bg-[#fde8f0] hover:text-[#6b1040]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free shipping banner */}
        {totals.subtotal > 0 && totals.subtotal < 499 && (
          <div className="bg-[#fdf4ee] px-5 py-2.5 text-center text-xs text-[#6b1040]">
            Add <span className="font-bold">₹{(499 - totals.subtotal).toLocaleString("en-IN")}</span> more for free shipping
          </div>
        )}
        {totals.subtotal >= 499 && (
          <div className="bg-green-50 px-5 py-2.5 text-center text-xs font-medium text-green-700">
            🎉 You've unlocked free shipping!
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fdf4ee]">
                <ShoppingBag size={32} className="text-[#c5962a]/50" />
              </div>
              <div>
                <p className="font-semibold text-[#6b1040]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Your cart is empty
                </p>
                <p className="mt-1 text-xs text-[#3a0820]/40">Add some sparkle to get started</p>
              </div>
              <button
                onClick={closeDrawer}
                className="mt-2 rounded-full border border-[#6b1040] px-6 py-2 text-sm font-medium text-[#6b1040] transition-colors hover:bg-[#6b1040] hover:text-white"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item._id} className="flex gap-3">
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#f9e8c8] to-[#fdf4ee]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-8 w-8 rounded-full border border-[#c5962a]/30" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        href={`/${item.categorySlug}/${item.productSlug}`}
                        onClick={closeDrawer}
                        className="line-clamp-2 text-sm font-medium text-[#3a0820] hover:text-[#c5295d]"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="ml-1 flex-shrink-0 text-[#3a0820]/30 transition-colors hover:text-[#c5295d]"
                        aria-label="Remove item"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {item.size && (
                        <span className="rounded-full bg-[#fdf4ee] px-2 py-0.5 text-[10px] text-[#6b1040]">
                          Size: {item.size}
                        </span>
                      )}
                      {item.giftWrap && (
                        <span className="rounded-full bg-[#fdf4e8] px-2 py-0.5 text-[10px] text-[#c5962a]">
                          Gift wrapped
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty */}
                      <div className="flex items-center gap-2 rounded-full border border-[#6b1040]/15 px-2 py-1">
                        <button
                          onClick={() => item.quantity > 1 ? updateQty(item._id, item.quantity - 1) : removeItem(item._id)}
                          className="text-[#6b1040]/60 hover:text-[#6b1040]"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-xs font-medium text-[#3a0820]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item._id, item.quantity + 1)}
                          className="text-[#6b1040]/60 hover:text-[#6b1040]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#6b1040]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#6b1040]/10 px-5 py-5">
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#3a0820]/60">
                <span>Subtotal</span>
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
                <span>{totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}</span>
              </div>
              <div className="flex justify-between border-t border-[#6b1040]/10 pt-2 font-bold text-[#6b1040]">
                <span>Total</span>
                <span>₹{totals.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full rounded-full bg-[#6b1040] py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#3a0820]"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeDrawer}
              className="mt-2.5 w-full text-center text-xs text-[#3a0820]/40 transition-colors hover:text-[#6b1040]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
