import Link from "next/link";

const BUDGETS = [
  { label: "Under ₹199",  slug: "under-199",  bg: "bg-[#fde8f0]", text: "#6b1040" },
  { label: "Under ₹399",  slug: "under-399",  bg: "bg-[#fdf0e8]", text: "#6b1040" },
  { label: "Under ₹599",  slug: "under-599",  bg: "bg-[#e8f0fd]", text: "#6b1040" },
  { label: "Gift Ready",  slug: "gift-ready", bg: "bg-[#6b1040]",  text: "#ffffff" },
];

export default function ShopByBudget() {
  return (
    <section className="bg-white px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">For Every Occasion</p>
        <h2
          className="text-3xl font-bold text-[#6b1040] lg:text-4xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Shop by Budget
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {BUDGETS.map((b) => (
          <Link
            key={b.slug}
            href={`/budget/${b.slug}`}
            className={`group ${b.bg} flex h-28 items-center justify-between rounded-2xl px-6 transition-all hover:scale-[1.02] hover:shadow-md`}
          >
            <span
              className="text-lg font-bold lg:text-xl"
              style={{ fontFamily: "var(--font-playfair)", color: b.text }}
            >
              {b.label}
            </span>
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke={b.text}
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
