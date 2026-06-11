'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

const INITIAL_ITEMS: CartItem[] = [
  { id: '1', name: 'Gold Plated Drop Earrings', price: 1299, image: '/images/product-1.png', qty: 1 },
  { id: '2', name: 'Temple Bracelet', price: 899, image: '/images/product-2.png', qty: 2 },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const remove = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  const subtotal  = items.reduce((s, item) => s + item.price * item.qty, 0);
  const shipping  = subtotal >= 999 ? 0 : 99;
  const total     = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
        <h1
          className="mb-8 text-3xl font-bold text-[#3a0820]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-[#6b1040]/50">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-sm bg-[#6b1040] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#3a0820]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-xl border border-[#c5962a]/20 bg-[#fdf4ee] p-4">
                  <div className="relative h-24 w-24 shrink-0 rounded-lg bg-white overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-[#3a0820]">{item.name}</p>
                      <button onClick={() => remove(item.id)} className="text-[#6b1040]/40 hover:text-[#6b1040]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-[#c5962a]/30 overflow-hidden">
                        <button onClick={() => updateQty(item.id, -1)} className="p-2 hover:bg-[#c5962a]/10">
                          <Minus size={12} />
                        </button>
                        <span className="min-w-[24px] text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-2 hover:bg-[#c5962a]/10">
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-[#6b1040]">₹ {(item.price * item.qty).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-[#c5962a]/20 bg-[#fdf4ee] p-6 h-fit">
              <h2
                className="mb-5 text-xl font-bold text-[#3a0820]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b1040]/70">Subtotal</span>
                  <span className="font-medium">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b1040]/70">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `₹ ${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-[#c5962a]">Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping</p>
                )}
                <div className="border-t border-[#c5962a]/20 pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-[#3a0820]">Total</span>
                    <span className="text-[#6b1040]">₹ {total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <button className="mt-6 w-full rounded-sm bg-[#6b1040] py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#3a0820]">
                Proceed to Checkout
              </button>
              <Link href="/" className="mt-3 block text-center text-xs text-[#6b1040]/60 hover:text-[#6b1040]">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
