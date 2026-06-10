"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    image: "/images/login-bg.png",
    tag: "New Collection",
    headline: "Sparkle\nEveryday",
    sub: "Handcrafted jewellery that tells your story — from everyday elegance to bridal brilliance.",
    cta1: { label: "Shop Now", href: "/shop" },
    cta2: { label: "View Collections", href: "/collections" },
  },
  {
    image: "/images/signup-bg.png",
    tag: "Bridal Edit",
    headline: "Wedding\nLite",
    sub: "Curated jewellery for the modern bride. Light, layerable, and luminous.",
    cta1: { label: "Explore Bridal", href: "/wedding-lite" },
    cta2: { label: "View Lookbook", href: "/collections" },
  },
  {
    image: "/images/login-bg.png",
    tag: "Our Signature",
    headline: "Anti Tarnish\nJewellery",
    sub: "Jewellery that stays as bright as the day you bought it. Always.",
    cta1: { label: "Shop the Range", href: "/anti-tarnish-jewellery" },
    cta2: { label: "Learn More", href: "/about" },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {/* Background — cross-fade */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={s.image} alt="" fill priority={i === 0} className="object-cover object-center" />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#6b1040]/75 via-[#6b1040]/35 to-transparent" />
      {/* Top vignette — separates hero from navbar visually */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-10 sm:px-20 lg:px-28">
        <p className="mb-3 text-xs font-medium tracking-[0.35em] text-[#c5962a] uppercase">
          {slide.tag}
        </p>
        <h1
          className="max-w-lg whitespace-pre-line text-5xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {slide.headline}
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75 lg:text-base">
          {slide.sub}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={slide.cta1.href}
            className="rounded-full bg-[#c5962a] px-8 py-3.5 text-sm font-semibold tracking-wider text-white shadow-lg transition hover:bg-[#b0841f] active:scale-[0.98]"
          >
            {slide.cta1.label}
          </Link>
          <Link
            href={slide.cta2.href}
            className="rounded-full border border-white/60 px-8 py-3.5 text-sm font-semibold tracking-wider text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            {slide.cta2.label}
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-[#c5962a]" : "w-2 bg-white/50"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
