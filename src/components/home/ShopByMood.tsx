import Link from "next/link";

const MOODS = [
  { label: "Everyday Minimal", slug: "everyday-minimal", bg: "from-[#fde8f0] to-[#fdf4ee]",    emoji: "🌸" },
  { label: "Office Luxe",      slug: "office-luxe",      bg: "from-[#f0e8fd] to-[#fdf4ee]",    emoji: "💼" },
  { label: "Date Night Glow",  slug: "date-night-glow",  bg: "from-[#fde8e8] to-[#fdf0e8]",    emoji: "🕯️" },
  { label: "Wedding Light",    slug: "wedding-light",    bg: "from-[#fde8f0] to-[#f5e8fd]",    emoji: "💍" },
  { label: "Party Glam",       slug: "party-glam",       bg: "from-[#fdf0e8] to-[#fde8f0]",    emoji: "✨" },
  { label: "Gift Edit",        slug: "gift-edit",        bg: "from-[#e8f0fd] to-[#e8fdf0]",    emoji: "🎁" },
];

export default function ShopByMood() {
  return (
    <section className="bg-[#fdf4ee] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">Curated For You</p>
        <h2
          className="text-3xl font-bold text-[#6b1040] lg:text-4xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Shop by Mood
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {MOODS.map((mood) => (
          <Link
            key={mood.slug}
            href={`/mood/${mood.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <div
              className={`h-36 w-full rounded-2xl bg-gradient-to-br ${mood.bg} border border-[#6b1040]/8 flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-md`}
            >
              <span className="text-3xl">{mood.emoji}</span>
            </div>
            <span className="text-center text-xs font-medium text-[#6b1040] leading-tight group-hover:text-[#c5295d] transition-colors">
              {mood.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
