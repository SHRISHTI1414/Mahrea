import Link from "next/link";

const LINKS = {
  SHOP: [
    { label: "New In", href: "/new-in" },
    { label: "Rings", href: "/rings" },
    { label: "Earrings", href: "/earrings" },
    { label: "Necklaces", href: "/necklaces" },
    { label: "Bracelets", href: "/bracelets" },
    { label: "Anklets", href: "/anklets" },
  ],
  COLLECTIONS: [
    { label: "Wedding Lite", href: "/wedding-lite" },
    { label: "Anti Tarnish", href: "/anti-tarnish-jewellery" },
    { label: "Milan Muse", href: "/collections/milan-muse" },
    { label: "Golden Hour", href: "/collections/golden-hour" },
    { label: "Gift Edit", href: "/mood/gift-edit" },
  ],
  HELP: [
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "FAQs", href: "/faq" },
  ],
  ABOUT: [
    { label: "Our Story", href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#3a0820] text-white">
      <div className="px-6 py-14 sm:px-12 lg:px-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#c5962a]">
                <span className="text-sm font-bold text-[#c5962a]" style={{ fontFamily: "var(--font-playfair)" }}>MR</span>
              </div>
              <div>
                <p className="text-sm font-bold tracking-widest text-[#c5962a]" style={{ fontFamily: "var(--font-playfair)" }}>MAHREA</p>
                <p className="text-[9px] tracking-[0.25em] text-white/40">SPARKLE EVERYDAY</p>
              </div>
            </div>
            <p className="mb-6 text-xs leading-relaxed text-white/50">
              Handcrafted jewellery for the modern Indian woman. Celebrate every moment with pieces that last.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-[#c5962a] hover:text-[#c5962a]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#c5962a]">{title}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/50 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 px-6 py-5 sm:px-12 lg:px-20">
        <p className="text-center text-[10px] text-white/30">
          © {new Date().getFullYear()} Mahrea. All rights reserved. Made with love in India.
        </p>
      </div>
    </footer>
  );
}
