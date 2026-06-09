"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type Step = "identifier" | "otp" | "password" | "done";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for OTP resend
  useEffect(() => {
    if (step !== "otp" || canResend) return;
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown, canResend]);

  // Step 1: send OTP
  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) { setError("Please enter your email or phone."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setStep("otp");
      setCountdown(30);
      setCanResend(false);
      setTimeout(() => otpInputs.current[0]?.focus(), 100);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(30);
    setDigits(["", "", "", "", "", ""]);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    otpInputs.current[0]?.focus();
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) otpInputs.current[index + 1]?.focus();
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...digits];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setDigits(next);
    otpInputs.current[Math.min(pasted.length, 5)]?.focus();
  }

  // Step 2: verify OTP
  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) { setError("Please enter the 6-digit OTP."); return; }
    setError("");
    setLoading(true);
    try {
      // We verify the OTP server-side when resetting — just move to next step
      // (OTP is verified atomically with password reset)
      setStep("password");
    } finally {
      setLoading(false);
    }
  }

  // Step 3: reset password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp: digits.join(""), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        // If OTP invalid, go back to OTP step
        if (res.status === 400 && data.message.includes("OTP")) {
          setStep("otp");
          setDigits(["", "", "", "", "", ""]);
        }
        return;
      }
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const masked = identifier.includes("@")
    ? identifier.replace(/(.{2}).*(@.*)/, "$1•••••$2")
    : `+91 ••••••${identifier.slice(-4)}`;

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-[#6b1040]/70">Password reset successfully!</p>
        <Link
          href="/login"
          className="mt-2 w-full rounded-full bg-[#c5295d] py-4 text-center text-sm font-semibold tracking-wider text-white shadow-md transition hover:bg-[#a8204d]"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {(["identifier", "otp", "password"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full transition-colors ${
              step === s ? "bg-[#c5295d] scale-125" :
              ["identifier", "otp", "password"].indexOf(step) > i ? "bg-[#6b1040]" : "bg-[#6b1040]/20"
            }`} />
            {i < 2 && <div className="h-px w-6 bg-[#6b1040]/20" />}
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Step 1 — Enter email or phone */}
      {step === "identifier" && (
        <form onSubmit={handleSendOTP} noValidate className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email or Phone"
            autoFocus
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-full bg-[#f5c8d4] px-6 py-4 text-sm text-[#6b1040] placeholder-[#6b1040]/50 outline-none transition focus:ring-2 focus:ring-[#c5295d]/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#c5295d] py-4 text-sm font-semibold tracking-wider text-white shadow-md transition hover:bg-[#a8204d] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* Step 2 — Enter OTP */}
      {step === "otp" && (
        <form onSubmit={handleVerifyOTP} noValidate className="flex flex-col gap-6">
          <p className="text-center text-sm text-[#6b1040]/70">
            Code sent to <span className="font-semibold text-[#6b1040]">{masked}</span>
          </p>
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { otpInputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(i, e)}
                className="h-14 w-11 rounded-xl bg-[#f5c8d4] text-center text-xl font-semibold text-[#6b1040] outline-none transition focus:ring-2 focus:ring-[#c5295d]/60 caret-transparent"
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#c5295d] py-4 text-sm font-semibold tracking-wider text-white shadow-md transition hover:bg-[#a8204d] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continue
          </button>
          <p className="text-center text-sm text-[#6b1040]/60">
            {canResend ? (
              <button type="button" onClick={handleResend} className="font-semibold text-[#c5295d] underline underline-offset-2">
                Resend OTP
              </button>
            ) : (
              <span className="text-[#6b1040]/40">Resend in {countdown}s</span>
            )}
          </p>
        </form>
      )}

      {/* Step 3 — New password */}
      {step === "password" && (
        <form onSubmit={handleResetPassword} noValidate className="flex flex-col gap-4">
          <p className="text-center text-sm text-[#6b1040]/70">Enter your new password</p>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              autoFocus
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          <p className="text-xs text-[#6b1040]/40 text-center">Minimum 8 characters</p>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#c5295d] py-4 text-sm font-semibold tracking-wider text-white shadow-md transition hover:bg-[#a8204d] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}
