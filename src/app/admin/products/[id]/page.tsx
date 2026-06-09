import { redirect, notFound } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    Product.findById(id).lean(),
    Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
  ]);

  if (!product) notFound();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Edit Product</h1>
        <p className="mt-0.5 text-sm text-[#3a0820]/50">{product.name}</p>
      </div>
      <ProductForm
        categories={categories.map((c) => ({ _id: String(c._id), name: c.name, slug: c.slug }))}
        initialData={{
          _id: String(product._id),
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          categorySlug: product.categorySlug,
          price: product.price,
          discountPrice: product.discountPrice,
          images: product.images ?? [],
          metal: product.metal,
          metalColour: product.metalColour,
          material: product.material ?? "",
          variants: product.variants ?? [],
          stock: product.stock,
          isPublished: product.isPublished,
          isFeatured: product.isFeatured,
          tags: product.tags ?? [],
          weight: product.weight,
        }}
      />
    </div>
  );
}
