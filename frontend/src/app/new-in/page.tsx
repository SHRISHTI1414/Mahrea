'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NewInPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Banner */}
      <section className="bg-[#fdf4ee] py-16 px-6 text-center">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c5962a]">Just Arrived</p>
        <h1
          className="text-4xl font-bold text-[#3a0820]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          New In
        </h1>
        <p className="mt-3 text-sm text-[#6b1040]/60">Fresh drops — be the first to wear them.</p>
      </section>

      {/* Grid */}
      <section className="bg-white py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <Link
                key={i}
                href={`/product/product-${i + 1}`}
                className="group rounded-xl bg-[#fdf4ee] overflow-hidden block"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={`/images/product-${(i % 16) + 1}.png`}
                    alt="Product"
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded bg-[#6b1040] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    New In
                  </span>
                  <button
                    className="absolute top-3 right-3 rounded-full bg-white/80 p-1.5 text-[#6b1040]/60 hover:text-[#6b1040] opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart size={14} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-[#3a0820]">New Arrival #{i + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6b1040]">₹ 1,099</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
