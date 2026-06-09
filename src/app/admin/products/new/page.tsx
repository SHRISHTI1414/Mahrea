import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Add Product</h1>
        <p className="mt-0.5 text-sm text-[#3a0820]/50">Fill in the details below to create a new product.</p>
      </div>
      <ProductForm
        categories={categories.map((c) => ({ _id: String(c._id), name: c.name, slug: c.slug }))}
      />
    </div>
  );
}
