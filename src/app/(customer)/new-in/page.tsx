import { Suspense } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import SortDropdown from "@/components/products/SortDropdown";
import Pagination from "@/components/products/Pagination";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "New Arrivals | Mahrea",
  description: "Shop the latest jewellery arrivals at Mahrea — fresh drops across earrings, necklaces, bracelets and more.",
};

type SearchParams = { sort?: string; page?: string };

export default async function NewInPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const sort = sp.sort ?? "newest";
  const page = Math.max(1, Number(sp.page ?? 1));
  const limit = 24;

  await connectDB();

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    featured: { isFeatured: -1, createdAt: -1 },
  };
  const sortQuery = sortMap[sort] ?? sortMap.newest;

  const filter = { isPublished: true };
  const [rawProducts, total] = await Promise.all([
    Product.find(filter).sort(sortQuery).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  const products = rawProducts.map((p) => ({
    _id: String(p._id),
    name: p.name,
    slug: p.slug,
    categorySlug: p.categorySlug,
    price: p.price,
    discountPrice: p.discountPrice,
    images: p.images,
    metal: p.metal,
    isFeatured: p.isFeatured,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#6b1040] px-6 py-14 sm:px-12 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6b1040] to-[#3a0820]" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/5" />
        <div className="absolute -bottom-10 right-40 h-48 w-48 rounded-full border border-white/5" />
        <div className="relative">
          <nav className="mb-4 flex items-center gap-2 text-xs text-white/40">
            <a href="/" className="hover:text-white/70 transition-colors">Home</a>
            <span>/</span>
            <span className="text-white/70">New Arrivals</span>
          </nav>
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">Just In</p>
          <h1
            className="text-4xl font-bold text-white lg:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            New Arrivals
          </h1>
          <p className="mt-3 text-sm text-white/60 italic">Fresh drops, straight from the studio.</p>
          <p className="mt-1 text-xs text-white/40">{total} piece{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <main className="flex-1 bg-[#fdf9f5] px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-end gap-3">
            <span className="hidden text-xs text-[#3a0820]/40 sm:block">
              {total} result{total !== 1 ? "s" : ""}
            </span>
            <Suspense>
              <SortDropdown />
            </Suspense>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 h-16 w-16 rounded-full border-2 border-[#c5962a]/30 flex items-center justify-center">
                <span className="text-2xl text-[#c5962a]/40">✦</span>
              </div>
              <p
                className="text-lg font-semibold text-[#6b1040]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                No pieces yet
              </p>
              <p className="mt-1 text-sm text-[#3a0820]/50">Check back soon — new drops are on the way.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <Suspense>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
