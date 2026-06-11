'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api, Product } from '@/lib/api';

export default function SearchPage() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<Product[]>([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      const data = await api.products.list({ q, limit: '24' });
      setResults(data.products ?? []);
      setSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 400);
    return () => clearTimeout(t);
  }, [query, search]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
        <h1
          className="mb-6 text-3xl font-bold text-[#3a0820]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Search
        </h1>

        {/* Search input */}
        <div className="relative max-w-xl">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b1040]/40" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search earrings, bracelets, rings…"
            className="w-full rounded-xl border border-[#c5962a]/30 bg-[#fdf4ee] py-4 pl-11 pr-4 text-sm text-[#1a1a1a] outline-none focus:border-[#6b1040] focus:ring-1 focus:ring-[#6b1040]/20"
          />
        </div>

        {/* Results */}
        {loading && (
          <p className="mt-10 text-sm text-[#6b1040]/50">Searching…</p>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="mt-10">
            <p className="text-sm text-[#6b1040]/50">No results found for &quot;{query}&quot;</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="mt-10">
            <p className="mb-6 text-xs text-[#6b1040]/50 uppercase tracking-[0.2em]">{results.length} results for &quot;{query}&quot;</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug}`}
                  className="group rounded-xl bg-[#fdf4ee] overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images?.[0] ?? '/images/product-1.png'}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.isBestseller && (
                      <span className="absolute top-3 left-3 rounded bg-[#6b1040] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Bestseller
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-[#3a0820] truncate">{product.name}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-[#6b1040]">₹ {product.discountPrice ?? product.price}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-[#6b1040]/40 line-through">₹ {product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state before search */}
        {!loading && !searched && (
          <div className="mt-16 text-center">
            <p className="text-sm text-[#6b1040]/40">Start typing to search our collection…</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
