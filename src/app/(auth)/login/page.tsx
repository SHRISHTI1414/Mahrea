import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Mahrea account.",
};

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden">
      {/* Background photo */}
      <Image
        src="/images/login-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        aria-hidden="true"
      />
      {/* Subtle overlay so the card reads cleanly over the photo */}
      <div className="absolute inset-0 bg-[#6b1040]/10" aria-hidden="true" />

      {/* Card */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white/80 px-8 py-10 shadow-xl backdrop-blur-sm sm:mx-0">
        {/* Heading */}
        <h1
          className="mb-1 text-center text-3xl font-bold text-[#6b1040]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Welcome Back!
        </h1>
        <p className="mb-8 text-center text-sm text-[#6b1040]/70">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#6b1040] underline underline-offset-2 hover:text-[#c5295d] transition-colors"
          >
            Sign Up
          </Link>
        </p>

        <LoginForm />

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#6b1040]/25" />
          <span className="text-xs font-medium tracking-widest text-[#6b1040]/50">
            OR
          </span>
          <div className="h-px flex-1 bg-[#6b1040]/25" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4">
          {/* Google */}
          <button
            type="button"
            aria-label="Continue with Google"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            aria-label="Continue with Facebook"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                fill="#1877F2"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
