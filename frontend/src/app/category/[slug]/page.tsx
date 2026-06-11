'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CATEGORIES } from '@/lib/config';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const category = CATEGORIES.find((c) => c.slug === slug);

  const displayName = category?.label ?? slug.replace(/-/g, ' ');
  const tagline     = category?.tagline ?? '';
  const bannerSrc   = category?.banner ?? '/images/banner-earrings.jpg';

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Category Banner ───────────────────────────────────────────────────── */}
      <section className="relative bg-[#fdf4ee] overflow-hidden">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center md:flex-row md:min-h-[320px]">
          {/* Left: text */}
          <div className="flex flex-col justify-center px-8 py-12 md:w-2/5 md:px-16">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c5962a]">
              <Link href="/" className="hover:underline">Home</Link>
              {' / '}
              <span>{displayName}</span>
            </p>
            <h1
              className="text-3xl font-bold uppercase text-[#3a0820] sm:text-4xl"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {displayName}
            </h1>
            {tagline && (
              <p className="mt-3 text-sm leading-relaxed text-[#6b1040]/70 max-w-xs">{tagline}</p>
            )}
          </div>

          {/* Right: banner photo */}
          <div className="relative md:w-3/5 h-60 md:h-80 w-full overflow-hidden">
            <Image
              src={bannerSrc}
              alt={displayName}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Filters + Product Grid ───────────────────────────────────────────── */}
      <section className="bg-white py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          {/* Toolbar */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-[#6b1040]/60">Showing all products</p>
            <button className="flex items-center gap-2 rounded-lg border border-[#c5962a]/40 px-4 py-2 text-xs font-medium text-[#3a0820] hover:bg-[#fdf4ee]">
              <SlidersHorizontal size={13} /> Filters
            </button>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
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
                  {/* Badge */}
                  {i % 4 === 0 && (
                    <span className="absolute top-3 left-3 rounded bg-[#6b1040] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      Bestseller
                    </span>
                  )}
                  {/* Wishlist */}
                  <button
                    className="absolute top-3 right-3 rounded-full bg-white/80 p-1.5 text-[#6b1040]/60 hover:text-[#6b1040] opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart size={14} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-[#3a0820]">Mahrea {displayName} #{i + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6b1040]">₹ 1,299</p>
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
