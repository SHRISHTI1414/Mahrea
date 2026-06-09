"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#3a0820] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c5962a]">
            <span className="text-xl font-bold text-[#c5962a]" style={{ fontFamily: "serif" }}>MR</span>
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "serif" }}>Mahrea Admin</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-[#3a0820]/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[#6b1040]/20 px-4 py-2.5 text-sm outline-none focus:border-[#6b1040]"
              placeholder="admin@mahrea.in"
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-xs font-medium text-[#3a0820]/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[#6b1040]/20 px-4 py-2.5 text-sm outline-none focus:border-[#6b1040]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#6b1040] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3a0820] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
