"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cart.store";

const navLinks = [
  { label: "NEW IN", href: "/new-in" },
  { label: "SHOP", href: "/shop" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "GIFTS", href: "/gifts" },
  { label: "WEDDING LITE", href: "/wedding-lite" },
  { label: "ANTI TARNISH JEWELLERY", href: "/anti-tarnish-jewellery" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openDrawer, items } = useCartStore();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#6b1040] shadow-md">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            {/* MR Monogram */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c5962a]">
              <span
                className="text-sm font-bold leading-none text-[#c5962a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                MR
              </span>
            </div>
            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span
                className="text-lg font-bold tracking-widest text-[#c5962a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                MAHREA
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#c5962a]/80">
                SPARKLE EVERYDAY
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium tracking-wider text-white/90 transition-colors hover:text-[#c5962a]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="text-white/90 transition-colors hover:text-[#c5962a]"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link
              href="/account"
              aria-label="Account"
              className="text-white/90 transition-colors hover:text-[#c5962a]"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="text-white/90 transition-colors hover:text-[#c5962a]"
            >
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <button
              onClick={openDrawer}
              aria-label="Cart"
              className="relative text-white/90 transition-colors hover:text-[#c5962a]"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c5295d] text-[9px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="text-white/90 xl:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#6b1040] xl:hidden">
          <nav className="mx-auto max-w-[1440px] flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium tracking-wider text-white/90 border-b border-white/10 hover:text-[#c5962a] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
