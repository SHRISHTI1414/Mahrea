import { Suspense } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search | Mahrea` : "Search | Mahrea",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let products: {
    _id: string;
    name: string;
    slug: string;
    categorySlug: string;
    price: number;
    discountPrice?: number;
    images: string[];
    metal: string;
    isFeatured: boolean;
  }[] = [];

  if (query) {
    await connectDB();
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const raw = await Product.find({
      isPublished: true,
      $or: [{ name: regex }, { tags: regex }, { description: regex }],
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(48)
      .lean();

    products = raw.map((p) => ({
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
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#6b1040]/10 bg-white px-6 py-8 sm:px-12 lg:px-20">
        <nav className="mb-3 flex items-center gap-2 text-xs text-[#3a0820]/40">
          <a href="/" className="hover:text-[#3a0820]/70 transition-colors">Home</a>
          <span>/</span>
          <span>Search</span>
        </nav>
        {query ? (
          <>
            <h1
              className="text-2xl font-bold text-[#3a0820] lg:text-3xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="mt-1 text-sm text-[#3a0820]/50">
              {products.length} piece{products.length !== 1 ? "s" : ""} found
            </p>
          </>
        ) : (
          <h1
            className="text-2xl font-bold text-[#3a0820]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Search Mahrea
          </h1>
        )}
      </div>

      <main className="flex-1 bg-[#fdf9f5] px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          {!query ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-sm text-[#3a0820]/40">Type something in the search bar above to find jewellery.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 h-16 w-16 rounded-full border-2 border-[#c5962a]/30 flex items-center justify-center">
                <span className="text-2xl text-[#c5962a]/40">✦</span>
              </div>
              <p
                className="text-lg font-semibold text-[#6b1040]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                No results found
              </p>
              <p className="mt-1 text-sm text-[#3a0820]/50">
                Try a different search — earrings, gold, necklace…
              </p>
              <a
                href="/earrings"
                className="mt-6 rounded-full bg-[#6b1040] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3a0820] transition-colors"
              >
                Browse All Jewellery
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
