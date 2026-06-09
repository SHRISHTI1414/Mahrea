import Link from "next/link";

const COLLECTIONS = [
  { name: "Milan Muse",     slug: "milan-muse",     tag: "Italian Inspired", gradientFrom: "#f5e8ef", gradientTo: "#fde8d4", accent: "#6b1040" },
  { name: "Wild Edit",      slug: "wild-edit",      tag: "Nature Forward",   gradientFrom: "#e8f5ee", gradientTo: "#f0fde8", accent: "#2d5a3d" },
  { name: "Golden Hour",    slug: "golden-hour",    tag: "Sunset Gold",      gradientFrom: "#3a0820", gradientTo: "#6b1040", accent: "#c5962a" },
  { name: "Summer Crochet", slug: "summer-crochet", tag: "Boho Vibes",       gradientFrom: "#e8eef5", gradientTo: "#f5e8fd", accent: "#6b1040" },
];

export default function TrendingCollections() {
  return (
    <section className="bg-[#fdf4ee] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">Right Now</p>
          <h2 className="text-3xl font-bold text-[#6b1040] lg:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
            Trending Collections
          </h2>
        </div>
        <Link href="/collections" className="text-sm font-medium text-[#c5295d] underline underline-offset-4 hover:text-[#a8204d] transition-colors">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {COLLECTIONS.map((col) => (
          <Link key={col.slug} href={`/collections/${col.slug}`} className="group">
            <div className="relative mb-3 flex h-64 flex-col justify-end overflow-hidden rounded-2xl p-5 lg:h-80" style={{ background: `linear-gradient(135deg, ${col.gradientFrom}, ${col.gradientTo})` }}>
              {/* Decorative lines */}
              <div className="absolute left-0 right-0 top-1/3 h-px bg-black/5" />
              <div className="absolute bottom-1/3 left-0 right-0 h-px bg-black/5" />
              <div className="absolute inset-6 rounded-xl border border-black/5" />

              {/* Tag */}
              <span className="absolute left-4 top-4 rounded-full bg-white/60 px-3 py-1 text-[10px] font-medium tracking-wide backdrop-blur-sm" style={{ color: col.accent }}>
                {col.tag}
              </span>

              {/* Hover CTA */}
              <div className="translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block w-full rounded-full bg-[#6b1040] py-2.5 text-center text-xs font-semibold tracking-wider text-white">
                  Shop Now
                </span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-[#6b1040] transition-colors group-hover:text-[#c5295d]" style={{ fontFamily: "var(--font-playfair)" }}>
              {col.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
