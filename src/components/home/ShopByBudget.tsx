import Link from "next/link";

const BUDGETS = [
  { label: "Under ₹199",  sub: "Everyday picks",         slug: "under-199",  bg: "bg-[#fde8f0]",  text: "#6b1040", arrow: "#c5295d" },
  { label: "Under ₹399",  sub: "Office to evening",       slug: "under-399",  bg: "bg-[#fdf4e8]",  text: "#6b1040", arrow: "#c5962a" },
  { label: "Under ₹599",  sub: "Statement pieces",        slug: "under-599",  bg: "bg-[#eef0fd]",  text: "#6b1040", arrow: "#6b5ec5" },
  { label: "Gift Ready",  sub: "Curated for gifting",     slug: "gift-ready", bg: "bg-[#6b1040]",  text: "#fff",    arrow: "#c5962a" },
];

export default function ShopByBudget() {
  return (
    <section className="bg-white px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">For Every Occasion</p>
        <h2 className="text-3xl font-bold text-[#6b1040] lg:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Shop by Budget
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {BUDGETS.map((b) => (
          <Link
            key={b.slug}
            href={`/budget/${b.slug}`}
            className={`group ${b.bg} flex h-32 items-center justify-between rounded-2xl px-6 transition-all hover:scale-[1.02] hover:shadow-md`}
          >
            <div>
              <p className="text-base font-bold lg:text-lg" style={{ fontFamily: "var(--font-playfair)", color: b.text }}>
                {b.label}
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: b.text, opacity: 0.55 }}>{b.sub}</p>
            </div>
            <svg className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke={b.arrow} strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
