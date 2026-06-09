"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  identifier: string;
}

export default function OTPForm({ identifier }: Props) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Send OTP on mount
  useEffect(() => {
    sendOTP();
  }, []);

  // Resend countdown
  useEffect(() => {
    if (canResend) return;
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, canResend]);

  async function sendOTP() {
    await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, type: "verify" }),
    });
  }

  async function handleResend() {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(30);
    setError("");
    setDigits(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
    await sendOTP();
  }

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...digits];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setDigits(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid OTP.");
        return;
      }
      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {/* 6-box OTP input */}
      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-14 w-11 rounded-xl bg-[#f5c8d4] text-center text-xl font-semibold text-[#6b1040] outline-none transition focus:ring-2 focus:ring-[#c5295d]/60 caret-transparent"
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#c5295d] py-4 text-sm font-semibold tracking-wider text-white shadow-md transition hover:bg-[#a8204d] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="text-center text-sm text-[#6b1040]/60">
        Didn&apos;t receive it?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-[#c5295d] underline underline-offset-2 hover:text-[#a8204d] transition-colors"
          >
            Resend OTP
          </button>
        ) : (
          <span className="text-[#6b1040]/40">Resend in {countdown}s</span>
        )}
      </p>
    </form>
  );
}
