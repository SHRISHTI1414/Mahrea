"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to email list API
    setDone(true);
  }

  return (
    <section className="bg-[#6b1040] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.35em] text-[#c5962a] uppercase">
          Exclusive Offer
        </p>
        <h2
          className="mb-3 text-2xl font-bold text-white lg:text-3xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Get 10% Off Your First Order
        </h2>
        <p className="mb-8 text-sm text-white/60">
          Subscribe to our newsletter for exclusive deals, new arrivals, and jewellery inspiration.
        </p>

        {done ? (
          <p className="rounded-full bg-white/10 py-4 text-sm font-medium text-white">
            🎉 Welcome to Mahrea! Check your inbox for your 10% off code.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-full bg-white/10 px-6 py-3.5 text-sm text-white placeholder-white/40 outline-none border border-white/20 focus:border-[#c5962a] transition-colors"
            />
            <button
              type="submit"
              className="rounded-full bg-[#c5962a] px-7 py-3.5 text-sm font-semibold tracking-wider text-white transition hover:bg-[#b0841f] active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
