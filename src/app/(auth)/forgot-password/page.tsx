import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Mahrea account password.",
};

export default function ForgotPasswordPage() {
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
        <h1
          className="mb-1 text-center text-3xl font-bold text-[#6b1040]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Forgot Password?
        </h1>
        <p className="mb-8 text-center text-sm text-[#6b1040]/70">
          We&apos;ll send a code to reset it
        </p>

        <ForgotPasswordForm />

        <p className="mt-6 text-center text-xs text-[#6b1040]/50">
          Remember it?{" "}
          <Link href="/login" className="underline underline-offset-2 hover:text-[#c5295d] transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
