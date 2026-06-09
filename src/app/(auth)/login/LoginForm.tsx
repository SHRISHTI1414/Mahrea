"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.emailOrPhone.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }
    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }
      window.location.href = next;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Error message */}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Email or Phone */}
      <div>
        <input
          type="text"
          placeholder="Email or Phone"
          autoComplete="username"
          value={form.emailOrPhone}
          onChange={(e) =>
            setForm((f) => ({ ...f, emailOrPhone: e.target.value }))
          }
          className="w-full rounded-full bg-[#f5c8d4] px-6 py-4 text-sm text-[#6b1040] placeholder-[#6b1040]/50 outline-none transition focus:ring-2 focus:ring-[#c5295d]/50"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) =>
            setForm((f) => ({ ...f, password: e.target.value }))
          }
          className="w-full rounded-full bg-[#f5c8d4] px-6 py-4 pr-12 text-sm text-[#6b1040] placeholder-[#6b1040]/50 outline-none transition focus:ring-2 focus:ring-[#c5295d]/50"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6b1040]/50 hover:text-[#6b1040] transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Forgot Password */}
      <div className="text-right -mt-1">
        <Link
          href="/forgot-password"
          className="text-xs text-[#6b1040] underline underline-offset-2 hover:text-[#c5295d] transition-colors italic"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-full bg-[#c5295d] py-4 text-sm font-semibold tracking-wider text-white shadow-md transition hover:bg-[#a8204d] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
