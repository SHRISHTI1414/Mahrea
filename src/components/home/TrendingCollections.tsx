import Link from "next/link";

const COLLECTIONS = [
  { name: "Milan Muse",      slug: "milan-muse",      bg: "from-[#f5e8f0] to-[#fde8d4]", tag: "Italian Inspired" },
  { name: "Wild Edit",       slug: "wild-edit",        bg: "from-[#e8f5e8] to-[#f5fde8]", tag: "Nature Forward" },
  { name: "Golden Hour",     slug: "golden-hour",      bg: "from-[#fde8c8] to-[#fdf4ee]", tag: "Sunset Gold" },
  { name: "Summer Crochet",  slug: "summer-crochet",   bg: "from-[#e8f0fd] to-[#fde8f5]", tag: "Boho Vibes" },
];

export default function TrendingCollections() {
  return (
    <section className="bg-[#fdf4ee] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">Right Now</p>
          <h2
            className="text-3xl font-bold text-[#6b1040] lg:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Trending Collections
          </h2>
        </div>
        <Link
          href="/collections"
          className="text-sm font-medium text-[#c5295d] underline underline-offset-4 hover:text-[#a8204d] transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {COLLECTIONS.map((col) => (
          <Link key={col.slug} href={`/collections/${col.slug}`} className="group">
            {/* Image */}
            <div className={`relative mb-3 h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${col.bg} lg:h-72`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-20">✨</span>
              </div>
              {/* Tag */}
              <span className="absolute left-3 top-3 rounded-full border border-[#6b1040]/20 bg-white/70 px-3 py-1 text-[10px] font-medium tracking-wide text-[#6b1040] backdrop-blur-sm">
                {col.tag}
              </span>
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="w-full rounded-full bg-[#6b1040] py-2.5 text-center text-xs font-semibold tracking-wider text-white">
                  Shop Now
                </span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-[#6b1040] group-hover:text-[#c5295d] transition-colors">
              {col.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
