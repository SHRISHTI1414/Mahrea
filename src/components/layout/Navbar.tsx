"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/stores/cart.store";

// ─── Navigation config ────────────────────────────────────────────────────────

// Top-level links (left of dropdown)
const TOP_LINKS = [
  { label: "NEW IN",   href: "/new-in"  },
  { label: "TRENDING", href: "/trending" },
];

// Categories dropdown — Rings hidden for Phase 1 (route + data intact)
const CATEGORIES = [
  // { label: "Rings",        href: "/rings"        }, // Phase 2
  { label: "Earrings",     href: "/earrings"     },
  { label: "Necklaces",    href: "/necklaces"    },
  { label: "Bracelets",    href: "/bracelets"    },
  { label: "Pendants",     href: "/pendants"     },
  { label: "Pendant Sets", href: "/pendant-sets" },
];

// Right of dropdown — combined editorial link
const GIFTS_HREF = "/sets"; // points to Sets until dedicated Gifts & Wedding Lite page is built

// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [catOpen, setCatOpen]           = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { openDrawer, items } = useCartStore();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setIsLoggedIn(!!d?.user))
      .catch(() => {});
  }, []);

  // Smooth hover: small delay prevents dropdown closing when cursor moves into panel
  const openCat  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setCatOpen(true); };
  const closeCat = () => { closeTimer.current = setTimeout(() => setCatOpen(false), 150); };

  const closeMobile = () => { setMobileOpen(false); setMobileCatOpen(false); };

  return (
    <header className="sticky top-0 z-50 bg-[#6b1040] shadow-md">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Logo ───────────────────────────────────────────────────────── */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c5962a]">
              <span
                className="text-sm font-bold leading-none text-[#c5962a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                MR
              </span>
            </div>
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

          {/* ── Desktop Nav ────────────────────────────────────────────────── */}
          <nav className="hidden items-center gap-8 xl:flex">
            {/* NEW IN · TRENDING */}
            {TOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium tracking-wider text-white/90 transition-colors hover:text-[#c5962a]"
              >
                {link.label}
              </Link>
            ))}

            {/* CATEGORIES dropdown ─────────────────────────────────────── */}
            <div
              className="relative"
              onMouseEnter={openCat}
              onMouseLeave={closeCat}
            >
              <button className="flex items-center gap-1 text-[11px] font-medium tracking-wider text-white/90 transition-colors hover:text-[#c5962a]">
                CATEGORIES
                <ChevronDown
                  size={12}
                  strokeWidth={2}
                  className={`mt-px transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Panel */}
              <div
                className={`absolute left-1/2 top-full mt-3 w-52 -translate-x-1/2 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
                  catOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                {/* Arrow notch */}
                <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white ring-1 ring-black/5" />

                <div className="relative rounded-2xl bg-white p-3">
                  <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3a0820]/30">
                    Shop by Category
                  </p>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setCatOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[#3a0820] transition-colors hover:bg-[#fdf4ee] hover:text-[#6b1040]"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* GIFTS & WEDDING LITE */}
            <Link
              href={GIFTS_HREF}
              className="text-[11px] font-medium tracking-wider text-white/90 transition-colors hover:text-[#c5962a]"
            >
              GIFTS &amp; WEDDING LITE
            </Link>
          </nav>

          {/* ── Right Icons ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="text-white/90 transition-colors hover:text-[#c5962a]"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link
              href={isLoggedIn ? "/account" : "/login"}
              aria-label="Account"
              className="relative text-white/90 transition-colors hover:text-[#c5962a]"
            >
              <User size={20} strokeWidth={1.5} />
              {isLoggedIn && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#c5962a]" />
              )}
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

            {/* Mobile toggle */}
            <button
              className="text-white/90 xl:hidden"
              onClick={() => setMobileOpen((v) => !v)}
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

      {/* ── Mobile Menu ────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#6b1040] xl:hidden">
          <nav className="mx-auto max-w-[1440px] flex flex-col px-4 py-3">

            {/* NEW IN · TRENDING */}
            {TOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="border-b border-white/10 py-3 text-sm font-medium tracking-wider text-white/90 transition-colors hover:text-[#c5962a]"
              >
                {link.label}
              </Link>
            ))}

            {/* CATEGORIES accordion */}
            <button
              onClick={() => setMobileCatOpen((v) => !v)}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm font-medium tracking-wider text-white/90 transition-colors hover:text-[#c5962a]"
            >
              CATEGORIES
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${mobileCatOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileCatOpen && (
              <div className="border-b border-white/10 bg-[#3a0820]/30 px-4 py-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={closeMobile}
                    className="block py-2.5 text-sm text-white/80 transition-colors hover:text-[#c5962a]"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}

            {/* GIFTS & WEDDING LITE */}
            <Link
              href={GIFTS_HREF}
              onClick={closeMobile}
              className="border-b border-white/10 py-3 text-sm font-medium tracking-wider text-white/90 transition-colors hover:text-[#c5962a]"
            >
              GIFTS &amp; WEDDING LITE
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}
