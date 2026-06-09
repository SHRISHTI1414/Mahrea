import Link from "next/link";

const MOODS = [
  { label: "Everyday\nMinimal",  slug: "everyday-minimal", from: "from-[#f9e8ef]", to: "to-[#fdf4ee]",  accent: "#c5295d" },
  { label: "Office\nLuxe",       slug: "office-luxe",       from: "from-[#ede8f9]", to: "to-[#f4f0fd]",  accent: "#6b1040" },
  { label: "Date Night\nGlow",   slug: "date-night-glow",   from: "from-[#3a0820]", to: "to-[#6b1040]",  accent: "#c5962a" },
  { label: "Wedding\nLight",     slug: "wedding-light",     from: "from-[#f9eee8]", to: "to-[#fdf4ee]",  accent: "#c5962a" },
  { label: "Party\nGlam",        slug: "party-glam",        from: "from-[#c5295d]", to: "to-[#6b1040]",  accent: "#fff"    },
  { label: "Gift\nEdit",         slug: "gift-edit",         from: "from-[#e8f0f9]", to: "to-[#eef4f9]",  accent: "#6b1040" },
];

export default function ShopByMood() {
  return (
    <section className="bg-[#fdf4ee] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">Curated For You</p>
        <h2 className="text-3xl font-bold text-[#6b1040] lg:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Shop by Mood
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {MOODS.map((mood) => (
          <Link key={mood.slug} href={`/mood/${mood.slug}`} className="group">
            <div className={`relative flex h-40 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${mood.from} ${mood.to} transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg`}>
              {/* Decorative ring */}
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full border-2 border-white/10" />
              <div className="absolute -bottom-3 -left-3 h-14 w-14 rounded-full border border-white/10" />
              <p
                className="relative z-10 whitespace-pre-line text-center text-sm font-semibold leading-snug"
                style={{ color: mood.accent, fontFamily: "var(--font-playfair)" }}
              >
                {mood.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
