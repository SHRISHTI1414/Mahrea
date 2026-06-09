import Link from "next/link";

const CATEGORIES = [
  { name: "Rings",      slug: "rings",      from: 499,  emoji: "💍" },
  { name: "Earrings",   slug: "earrings",   from: 299,  emoji: "✨" },
  { name: "Necklaces",  slug: "necklaces",  from: 699,  emoji: "📿" },
  { name: "Bracelets",  slug: "bracelets",  from: 399,  emoji: "⭕" },
  { name: "Anklets",    slug: "anklets",    from: 249,  emoji: "🔗" },
  { name: "Sets",       slug: "sets",       from: 899,  emoji: "💎" },
];

export default function ShopByCategory() {
  return (
    <section className="bg-[#6b1040] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">Explore</p>
        <h2
          className="text-3xl font-bold text-white lg:text-4xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-[1.03]">
              <span className="text-3xl">{cat.emoji}</span>
              {/* Arrow */}
              <div className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#c5962a] text-white opacity-0 transition-opacity group-hover:opacity-100">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{cat.name}</p>
              <p className="text-xs text-white/60">
                Start from ₹{cat.from.toLocaleString("en-IN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
