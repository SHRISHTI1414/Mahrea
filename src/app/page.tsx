import Link from "next/link";

// Temporary homepage — replaced in Phase 2
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fdf4ee] gap-4">
      <h1
        className="text-4xl font-bold text-[#6b1040]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        MAHREA
      </h1>
      <p className="text-[#6b1040]/60 tracking-widest text-sm">SPARKLE EVERYDAY</p>
      <div className="flex gap-4 mt-4">
        <Link
          href="/login"
          className="rounded-full bg-[#c5295d] px-8 py-3 text-sm font-semibold text-white hover:bg-[#a8204d] transition-colors"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-full border-2 border-[#6b1040] px-8 py-3 text-sm font-semibold text-[#6b1040] hover:bg-[#6b1040] hover:text-white transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
