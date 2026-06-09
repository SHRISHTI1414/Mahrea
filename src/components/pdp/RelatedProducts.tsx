import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";

interface RelatedProduct {
  _id: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  metal: string;
  isFeatured: boolean;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  categorySlug: string;
}

export default function RelatedProducts({ products, categorySlug }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-[#6b1040]/8 px-6 py-14 sm:px-12 lg:px-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-medium tracking-[0.25em] text-[#c5962a] uppercase">
            You May Also Like
          </p>
          <h2
            className="text-2xl font-bold text-[#6b1040]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Similar Pieces
          </h2>
        </div>
        <Link
          href={`/${categorySlug}`}
          className="text-sm font-medium text-[#c5295d] underline underline-offset-4 transition-colors hover:text-[#a8204d]"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
