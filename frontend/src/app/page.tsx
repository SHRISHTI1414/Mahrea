'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CATEGORIES } from '@/lib/config';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="/images/hero-slide-1.jpg"
          alt="Mahrea hero"
          fill
          priority
          className="object-cover object-center"
        />
        {/* dark overlay on right to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-10 sm:px-16 lg:px-24">
          {/* Wordmark (design shows text logo in hero, not the pendant icon) */}
          <p className="mb-1 text-[11px] font-semibold tracking-[0.3em] text-[#c5962a] uppercase">Mahrea</p>
          <p className="mb-6 text-[10px] tracking-[0.35em] text-white/70 uppercase">Sparkle Everyday</p>

          <h1
            className="max-w-md text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Rooted in Tradition,<br />Made to Shine.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
            Anti-tarnish fine jewellery designed for the everyday you, inspired by our roots.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/new-in"
              className="rounded-sm bg-[#3a0820] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#6b1040]"
            >
              Shop New In
            </Link>
            <Link
              href="/category/earrings"
              className="rounded-sm border border-white/70 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white/10"
            >
              Explore Collections
            </Link>
          </div>

          {/* Slide dots */}
          <div className="mt-10 flex gap-2">
            <span className="h-1.5 w-8 rounded-full bg-[#c5962a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* ── Shop by Category ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c5962a]">Collections</p>
          <h2
            className="mb-10 text-center text-3xl font-bold text-[#3a0820]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-lg bg-[#fdf4ee]"
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={cat.banner}
                    alt={cat.label}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover object-right transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#3a0820]">{cat.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Story ──────────────────────────────────────────────────────── */}
      <section className="bg-[#fdf4ee]">
        <div className="mx-auto max-w-[1440px]">
          <Image
            src="/images/brand-story.jpg"
            alt="Crafted with Tradition. Made for Everyday Sparkle."
            width={2104}
            height={747}
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* ── New In Products placeholder ──────────────────────────────────────── */}
      <section className="bg-white py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c5962a]">Just Arrived</p>
          <h2
            className="mb-10 text-center text-3xl font-bold text-[#3a0820]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            New In
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="group rounded-xl bg-[#fdf4ee] overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={`/images/product-${(i % 16) + 1}.png`}
                    alt="Product"
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded bg-[#6b1040] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      New In
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-[#3a0820]">Loading…</p>
                  <p className="mt-1 text-sm font-semibold text-[#6b1040]">₹ —</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/new-in"
              className="inline-block rounded-sm border border-[#6b1040] px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#6b1040] transition hover:bg-[#6b1040] hover:text-white"
            >
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Gift Packaging banner ─────────────────────────────────────────────── */}
      <section className="bg-[#fdf4ee] py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Image
            src="/images/gift-packaging.jpg"
            alt="Make it Special — Premium Gift Packaging"
            width={1388}
            height={1133}
            className="mx-auto max-w-lg w-full rounded-2xl shadow-md object-cover"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
