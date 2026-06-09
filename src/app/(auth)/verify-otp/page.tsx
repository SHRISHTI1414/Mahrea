import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import OTPForm from "./OTPForm";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Verify your Mahrea account.",
};

interface Props {
  searchParams: Promise<{ phone?: string; email?: string }>;
}

export default async function VerifyOTPPage({ searchParams }: Props) {
  const params = await searchParams;
  const identifier = params.phone || params.email || "";

  if (!identifier) redirect("/signup");

  const isPhone = !!params.phone;
  const masked = isPhone
    ? `+91 ••••••${identifier.slice(-4)}`
    : identifier.replace(/(.{2}).*(@.*)/, "$1•••••$2");

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden">
      <Image
        src="/images/login-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#6b1040]/10" aria-hidden="true" />

      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white/80 px-8 py-10 shadow-xl backdrop-blur-sm sm:mx-0">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5c8d4]">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#6b1040]" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h1.5" />
            </svg>
          </div>
        </div>

        <h1
          className="mb-1 text-center text-3xl font-bold text-[#6b1040]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Verify OTP
        </h1>
        <p className="mb-8 text-center text-sm text-[#6b1040]/70">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-[#6b1040]">{masked}</span>
        </p>

        <OTPForm identifier={identifier} />

        <p className="mt-6 text-center text-xs text-[#6b1040]/50">
          <Link href="/login" className="underline underline-offset-2 hover:text-[#c5295d] transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
