import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import FilterPanel from "@/components/products/FilterPanel";
import SortDropdown from "@/components/products/SortDropdown";
import Pagination from "@/components/products/Pagination";
import MobileFilterDrawer from "@/components/products/MobileFilterDrawer";

export const revalidate = 1800; // 30 minutes

const CATEGORY_SLUGS = ["rings", "earrings", "necklaces", "bracelets", "anklets", "sets", "pendants", "pendant-sets"];

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  await connectDB();
  const cat = await Category.findOne({ slug: category, isActive: true }).lean();
  if (!cat) return { title: "Not Found" };
  const desc = cat.description || `Shop ${cat.name} at Mahrea — handcrafted jewellery for the modern Indian woman.`;
  return {
    title: `${cat.name} | Mahrea`,
    description: desc,
    openGraph: {
      title: `${cat.name} | Mahrea`,
      description: desc,
      images: cat.heroImage ? [{ url: cat.heroImage, width: 1200, height: 630, alt: cat.name }] : [],
    },
    twitter: { card: "summary_large_image", title: `${cat.name} | Mahrea`, description: desc },
  };
}

type SearchParams = {
  metal?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { category: categorySlug } = await params;
  const sp = await searchParams;

  await connectDB();

  const cat = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
  if (!cat) notFound();

  const metal = sp.metal ?? "";
  const minPrice = Number(sp.minPrice ?? 0);
  const maxPrice = Number(sp.maxPrice ?? 999999);
  const sort = sp.sort ?? "newest";
  const page = Math.max(1, Number(sp.page ?? 1));
  const limit = 12;

  const filter: Record<string, unknown> = {
    categorySlug,
    isPublished: true,
    price: { $gte: minPrice, $lte: maxPrice },
  };
  if (metal) filter.metal = metal;

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    featured: { isFeatured: -1, createdAt: -1 },
  };
  const sortQuery = sortMap[sort] ?? sortMap.newest;

  const skip = (page - 1) * limit;

  const [rawProducts, total] = await Promise.all([
    Product.find(filter).sort(sortQuery).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Serialize for client components
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

      {/* Category Hero */}
      <div className="relative overflow-hidden bg-[#6b1040] px-6 py-14 sm:px-12 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6b1040] to-[#3a0820]" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/5" />
        <div className="absolute -bottom-10 right-40 h-48 w-48 rounded-full border border-white/5" />
        <div className="relative">
          <nav className="mb-4 flex items-center gap-2 text-xs text-white/40">
            <a href="/" className="hover:text-white/70 transition-colors">Home</a>
            <span>/</span>
            <span className="text-white/70">{cat.name}</span>
          </nav>
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#c5962a] uppercase">
            Mahrea
          </p>
          <h1
            className="text-4xl font-bold text-white lg:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {cat.name}
          </h1>
          {cat.heroTagline && (
            <p className="mt-3 text-sm text-white/60 italic">{cat.heroTagline}</p>
          )}
          <p className="mt-1 text-xs text-white/40">{total} piece{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <main className="flex-1 bg-[#fdf9f5] px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden w-52 shrink-0 lg:block">
              <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm">
                <Suspense>
                  <FilterPanel />
                </Suspense>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="mb-6 flex items-center justify-between gap-3">
                <Suspense>
                  <MobileFilterDrawer />
                </Suspense>
                <div className="flex items-center gap-3 ml-auto">
                  <span className="hidden text-xs text-[#3a0820]/40 sm:block">
                    {total} result{total !== 1 ? "s" : ""}
                  </span>
                  <Suspense>
                    <SortDropdown />
                  </Suspense>
                </div>
              </div>

              {/* Product Grid */}
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="mb-4 h-16 w-16 rounded-full border-2 border-[#c5962a]/30 flex items-center justify-center">
                    <span className="text-2xl text-[#c5962a]/40">✦</span>
                  </div>
                  <p
                    className="text-lg font-semibold text-[#6b1040]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    No pieces found
                  </p>
                  <p className="mt-1 text-sm text-[#3a0820]/50">
                    Try adjusting your filters
                  </p>
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
