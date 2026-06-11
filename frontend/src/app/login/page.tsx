'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.login({ email, password });
      window.location.href = '/';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <Image src="/images/logo.png" alt="Mahrea" width={64} height={64} className="h-16 w-16 object-contain" />
            <h1
              className="mt-3 text-2xl font-bold text-[#3a0820]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[#6b1040]/60">Sign in to your Mahrea account</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#c5962a]/20 bg-[#fdf4ee] p-8 shadow-sm">
            {error && (
              <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-[#3a0820]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#c5962a]/30 bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none focus:border-[#6b1040] focus:ring-1 focus:ring-[#6b1040]/20"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-[#3a0820]">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#c5962a]/30 bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none focus:border-[#6b1040] focus:ring-1 focus:ring-[#6b1040]/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-sm bg-[#6b1040] py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#3a0820] disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="mt-5 text-center text-xs text-[#6b1040]/60">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-[#6b1040] hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
