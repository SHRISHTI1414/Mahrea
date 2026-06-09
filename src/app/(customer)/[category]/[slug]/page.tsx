import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/pdp/ImageGallery";
import ProductInfo from "@/components/pdp/ProductInfo";
import RelatedProducts from "@/components/pdp/RelatedProducts";

export const revalidate = 900; // 15 minutes

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug, isPublished: true }).lean();
  if (!product) return { title: "Not Found" };
  const desc = product.description || `Buy ${product.name} at Mahrea. Handcrafted jewellery for the modern Indian woman.`;
  const image = product.images[0];
  return {
    title: `${product.name} | Mahrea`,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      type: "website",
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: desc,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;

  await connectDB();

  const [product, category] = await Promise.all([
    Product.findOne({ slug, categorySlug, isPublished: true }).lean(),
    Category.findOne({ slug: categorySlug, isActive: true }).select("name slug").lean(),
  ]);

  if (!product || !category) notFound();

  const related = await Product.find({
    categorySlug,
    _id: { $ne: product._id },
    isPublished: true,
  })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(4)
    .lean();

  // Serialize for client components
  const serializedProduct = {
    _id: String(product._id),
    name: product.name,
    slug: product.slug,
    description: product.description,
    categorySlug: product.categorySlug,
    price: product.price,
    discountPrice: product.discountPrice,
    images: product.images,
    metal: product.metal,
    metalColour: product.metalColour,
    material: product.material,
    variants: product.variants,
    stock: product.stock,
    isFeatured: product.isFeatured,
    tags: product.tags,
  };

  const serializedRelated = related.map((p) => ({
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

  const displayPrice = product.discountPrice ?? product.price;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: String(product._id),
    brand: { "@type": "Brand", name: "Mahrea" },
    offers: {
      "@type": "Offer",
      price: displayPrice,
      priceCurrency: "INR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://mahrea.in/${categorySlug}/${slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf9f5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-[#6b1040]/8 bg-white px-6 py-3 sm:px-12 lg:px-20">
          <nav className="flex items-center gap-2 text-xs text-[#3a0820]/40">
            <a href="/" className="hover:text-[#6b1040] transition-colors">Home</a>
            <span>/</span>
            <a href={`/${categorySlug}`} className="hover:text-[#6b1040] transition-colors capitalize">
              {category.name}
            </a>
            <span>/</span>
            <span className="text-[#3a0820]/70 line-clamp-1">{product.name}</span>
          </nav>
        </div>

        {/* Main PDP grid */}
        <div className="mx-auto max-w-[1300px] px-6 py-10 sm:px-12 lg:grid lg:grid-cols-2 lg:gap-14 lg:px-20">
          {/* Gallery */}
          <div className="mb-10 lg:mb-0">
            <ImageGallery
              images={serializedProduct.images}
              name={serializedProduct.name}
              metal={serializedProduct.metal}
            />
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductInfo product={serializedProduct} />
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts products={serializedRelated} categorySlug={categorySlug} />
      </main>

      <Footer />
    </div>
  );
}
