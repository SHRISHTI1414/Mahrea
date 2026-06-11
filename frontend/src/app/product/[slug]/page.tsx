'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, ShoppingBag, Package } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Props {
  params: Promise<{ slug: string }>;
}

const DEMO_IMAGES = [
  '/images/product-1.png',
  '/images/product-2.png',
  '/images/product-3.png',
  '/images/product-4.png',
];

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const [activeImg, setActiveImg]   = useState(0);
  const [giftWrap, setGiftWrap]     = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const prev = () => setActiveImg((v) => (v - 1 + DEMO_IMAGES.length) % DEMO_IMAGES.length);
  const next = () => setActiveImg((v) => (v + 1) % DEMO_IMAGES.length);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
        {/* Breadcrumb */}
        <p className="mb-6 text-[10px] tracking-[0.2em] uppercase text-[#c5962a]">
          <Link href="/" className="hover:underline">Home</Link>
          {' / '}
          <Link href="/category/earrings" className="hover:underline">Earrings</Link>
          {' / '}
          <span className="text-[#3a0820]">{slug}</span>
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ── Gallery ─────────────────────────────────────────────────────── */}
          <div>
            <div className="relative aspect-square rounded-2xl bg-[#fdf4ee] overflow-hidden">
              {/* Bestseller badge */}
              <span className="absolute top-4 left-4 z-10 rounded bg-[#6b1040] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Bestseller
              </span>
              <button
                className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 text-[#6b1040]/60 hover:text-[#6b1040]"
                onClick={() => setWishlisted((v) => !v)}
              >
                <Heart size={18} strokeWidth={1.5} fill={wishlisted ? '#6b1040' : 'none'} />
              </button>

              <Image
                src={DEMO_IMAGES[activeImg]}
                alt="Product"
                fill
                className="object-contain p-6"
              />

              {/* Nav arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="mt-3 flex gap-2">
              {DEMO_IMAGES.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition ${
                    activeImg === i ? 'border-[#6b1040]' : 'border-transparent'
                  }`}
                >
                  <Image src={src} alt="" fill className="object-contain p-1 bg-[#fdf4ee]" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ─────────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <h1
              className="text-3xl font-bold text-[#3a0820]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Gold Plated Drop Earrings
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#6b1040]">₹ 1,299</span>
              <span className="text-sm text-[#6b1040]/40 line-through">₹ 1,799</span>
              <span className="text-xs font-semibold text-green-600">28% off</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#3a0820]/70">
              Inspired by traditional temple jewellery, these anti-tarnish gold-plated earrings are crafted for everyday wear. Lightweight and comfortable for all-day use.
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['Anti-tarnish', 'Gold Plated', 'Lightweight', 'Everyday Wear'].map((tag) => (
                <span key={tag} className="rounded-full border border-[#c5962a]/40 px-3 py-0.5 text-[11px] text-[#6b1040]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 h-px bg-[#c5962a]/20" />

            {/* Gift wrap add-on — matches gift-packaging.jpg from Figma */}
            <div className="mt-6 rounded-xl border border-[#c5962a]/30 bg-[#fdf4ee] p-4">
              <div className="flex items-start gap-3">
                <Image
                  src="/images/gift-packaging.jpg"
                  alt="Gift Packaging"
                  width={72}
                  height={72}
                  className="rounded-lg object-cover h-18 w-18"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#3a0820]">Make it Special</p>
                  <p className="text-xs text-[#6b1040]/60 mt-0.5">Premium Mahrea gift box — perfect for gifting</p>
                  <p className="mt-1 text-xs font-bold text-[#c5962a]">+ ₹ 199</p>
                </div>
                <button
                  onClick={() => setGiftWrap((v) => !v)}
                  className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition ${
                    giftWrap ? 'border-[#6b1040] bg-[#6b1040]' : 'border-[#c5962a]/50'
                  }`}
                >
                  {giftWrap && <span className="text-[10px] text-white font-bold">✓</span>}
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 flex gap-3">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#6b1040] py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#3a0820]">
                <ShoppingBag size={15} strokeWidth={1.5} /> Add to Cart
              </button>
              <button className="flex items-center justify-center gap-2 rounded-sm border border-[#6b1040] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#6b1040] transition hover:bg-[#fdf4ee]">
                <Heart size={15} strokeWidth={1.5} />
              </button>
            </div>

            {/* Trust */}
            <div className="mt-6 flex gap-4 text-[11px] text-[#6b1040]/60">
              <span className="flex items-center gap-1"><Package size={12} /> Free shipping over ₹999</span>
              <span>·</span>
              <span>Easy 15-day returns</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
