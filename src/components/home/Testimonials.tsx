const TESTIMONIALS = [
  { name: "Priya S.",    quote: "The anti-tarnish earrings I got are still shining after 8 months! Absolutely love them.", initials: "PS", bgColor: "#f5c8d4" },
  { name: "Riya M.",    quote: "Beautiful packaging, super quick delivery. Gifted to my sister — she was thrilled!", initials: "RM", bgColor: "#c8d4f5" },
  { name: "Ananya K.",  quote: "Wore the ruby pendant set for my cousin's wedding. Got so many compliments.", initials: "AK", bgColor: "#d4f5c8" },
  { name: "Sneha T.",   quote: "Affordable luxury is exactly how I'd describe Mahrea. Great quality for the price.", initials: "ST", bgColor: "#f5e8c8" },
  { name: "Divya R.",   quote: "The stacking rings are my everyday staple now. Already ordered two more sets!", initials: "DR", bgColor: "#f5c8e8" },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-6 py-16 sm:px-12 lg:px-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">Real Stories</p>
        <h2
          className="text-3xl font-bold text-[#6b1040] lg:text-4xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Loved by Our Community
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-[#6b1040]/8 bg-[#fdf4ee] p-5"
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <svg key={s} className="h-4 w-4 text-[#c5962a]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {/* Quote */}
            <p className="flex-1 text-xs leading-relaxed text-[#6b1040]/75">&ldquo;{t.quote}&rdquo;</p>
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#6b1040]" style={{ backgroundColor: t.bgColor }}>
                {t.initials}
              </div>
              <span className="text-xs font-semibold text-[#6b1040]">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
