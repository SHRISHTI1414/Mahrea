import Link from "next/link";

const CATEGORIES = [
  { name: "Rings",     slug: "rings",     from: 499,  ornament: "○ ◇ ○" },
  { name: "Earrings",  slug: "earrings",  from: 299,  ornament: "◈ ◈" },
  { name: "Necklaces", slug: "necklaces", from: 699,  ornament: "◉" },
  { name: "Bracelets", slug: "bracelets", from: 399,  ornament: "— — —" },
  { name: "Anklets",   slug: "anklets",   from: 249,  ornament: "· · · ·" },
  { name: "Sets",      slug: "sets",      from: 899,  ornament: "◇ ◈ ◇" },
];

export default function ShopByCategory() {
  return (
    <section className="bg-[#6b1040] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">Explore</p>
        <h2 className="text-3xl font-bold text-white lg:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative flex h-36 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/20 bg-white/10 transition-all duration-300 group-hover:bg-white/15 group-hover:scale-[1.03]">
              {/* Decorative */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              <span className="relative text-xs tracking-widest text-[#c5962a]/70">{cat.ornament}</span>
              {/* Arrow on hover */}
              <div className="absolute bottom-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#c5962a] opacity-0 transition-opacity group-hover:opacity-100">
                <svg className="h-2.5 w-2.5" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{cat.name}</p>
              <p className="text-[11px] text-white/50">from ₹{cat.from.toLocaleString("en-IN")}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
