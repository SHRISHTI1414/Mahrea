import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();
  const categories = await Category.find({}).sort({ sortOrder: 1 }).lean();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Categories</h1>
        <p className="mt-0.5 text-sm text-[#3a0820]/50">Manage your jewellery categories.</p>
      </div>
      <CategoryManager
        initialCategories={categories.map((c) => ({
          _id: String(c._id),
          name: c.name,
          slug: c.slug,
          isActive: c.isActive,
          sortOrder: c.sortOrder,
          description: c.description ?? "",
        }))}
      />
    </div>
  );
}
