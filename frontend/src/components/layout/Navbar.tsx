'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { CATEGORIES, NAV_LINKS } from '@/lib/config';

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [catOpen, setCatOpen]         = useState(false);
  const [mobileCatOpen, setMobileCat] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#6b1040] border-b border-[#c5962a]/25 shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-10">
        <div className="flex h-[72px] items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/logo.png"
              alt="Mahrea — Sparkle Everyday"
              width={120}
              height={120}
              className="h-[64px] w-[64px] object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 xl:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium tracking-[0.12em] text-white/90 uppercase transition-colors hover:text-[#c5962a]"
              >
                {link.label}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="flex items-center gap-1 text-[11px] font-medium tracking-[0.12em] uppercase text-white/90 transition-colors hover:text-[#c5962a]">
                Categories
                <ChevronDown size={12} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute left-1/2 top-full mt-2 w-52 -translate-x-1/2 rounded-xl bg-white shadow-xl ring-1 ring-black/5">
                  <div className="p-2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#3a0820] hover:bg-[#fdf4ee] hover:text-[#6b1040]"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <Link href="/search" aria-label="Search" className="text-white/90 hover:text-[#c5962a] transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </Link>
            <Link href="/account" aria-label="Account" className="text-white/90 hover:text-[#c5962a] transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="text-white/90 hover:text-[#c5962a] transition-colors">
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link href="/cart" aria-label="Cart" className="text-white/90 hover:text-[#c5962a] transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
            </Link>
            <button
              className="text-white/90 xl:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#6b1040] xl:hidden">
          <nav className="mx-auto max-w-[1440px] flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/10 py-3 text-sm font-medium uppercase tracking-widest text-white/90"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setMobileCat((v) => !v)}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm font-medium uppercase tracking-widest text-white/90"
            >
              Categories
              <ChevronDown size={14} className={`transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCatOpen && (
              <div className="bg-[#3a0820]/30 px-4 py-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-sm text-white/80"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
