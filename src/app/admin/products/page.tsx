import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
}) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();
  const sp = await searchParams;
  const q = sp.q ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));
  const category = sp.category ?? "";
  const limit = 20;

  const filter: Record<string, unknown> = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (category) filter.categorySlug = category;

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Products</h1>
          <p className="mt-0.5 text-sm text-[#3a0820]/50">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-[#6b1040] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3a0820]"
        >
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <form className="mb-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          className="w-full max-w-sm rounded-xl border border-[#6b1040]/20 px-4 py-2.5 text-sm outline-none focus:border-[#6b1040]"
        />
      </form>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#6b1040]/8 bg-[#fdf9f5]">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Product</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Price</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Stock</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6b1040]/6">
            {products.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#3a0820]/40">No products found</td></tr>
            ) : products.map((p) => (
              <tr key={String(p._id)} className="hover:bg-[#fdf9f5]/60 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-[#3a0820]">{p.name}</p>
                  <p className="text-xs text-[#3a0820]/40 capitalize">{p.metal.replace(/-/g, " ")}</p>
                </td>
                <td className="px-5 py-4 capitalize text-[#3a0820]/60">{p.categorySlug}</td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-[#6b1040]">₹{(p.discountPrice ?? p.price).toLocaleString("en-IN")}</span>
                  {p.discountPrice && <span className="ml-1.5 text-xs text-gray-400 line-through">₹{p.price.toLocaleString("en-IN")}</span>}
                </td>
                <td className="px-5 py-4">
                  <span className={`font-medium ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-orange-500" : "text-green-600"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${p.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.isPublished ? <Eye size={11} /> : <EyeOff size={11} />}
                    {p.isPublished ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/products/${p._id}`} className="inline-flex items-center gap-1 rounded-lg border border-[#6b1040]/20 px-3 py-1.5 text-xs font-medium text-[#6b1040] transition-colors hover:bg-[#fde8f0]">
                    <Pencil size={11} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?q=${q}&page=${p}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${p === page ? "bg-[#6b1040] text-white" : "border border-[#6b1040]/20 text-[#6b1040] hover:bg-[#fde8f0]"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
