import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import InventoryTable from "@/components/admin/InventoryTable";

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();
  const sp = await searchParams;
  const filter = sp.filter ?? "all";

  const query: Record<string, unknown> = { isPublished: true };
  if (filter === "low") query.stock = { $lte: 5, $gt: 0 };
  if (filter === "out") query.stock = 0;

  const products = await Product.find(query).sort({ stock: 1 }).lean();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Inventory</h1>
        <p className="mt-0.5 text-sm text-[#3a0820]/50">Manage stock levels across all products.</p>
      </div>

      <div className="mb-5 flex gap-2">
        {(["all", "low", "out"] as const).map((f) => (
          <a key={f} href={`?filter=${f}`} className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${filter === f ? "bg-[#6b1040] text-white" : "border border-[#6b1040]/20 text-[#6b1040] hover:bg-[#fde8f0]"}`}>
            {f === "all" ? "All Products" : f === "low" ? "Low Stock (≤5)" : "Out of Stock"}
          </a>
        ))}
      </div>

      <InventoryTable
        initialProducts={products.map((p) => ({
          _id: String(p._id),
          name: p.name,
          categorySlug: p.categorySlug,
          stock: p.stock,
          variants: p.variants ?? [],
        }))}
      />
    </div>
  );
}
