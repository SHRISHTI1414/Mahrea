import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-500",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  refunded: "bg-orange-100 text-orange-600",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();
  const sp = await searchParams;
  const status = sp.status ?? "";
  const q = sp.q ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));
  const limit = 20;

  const filter: Record<string, unknown> = { "payment.status": "captured" };
  if (status) filter.status = status;
  if (q) filter.orderNumber = { $regex: q, $options: "i" };

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  const statuses = ["confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Orders</h1>
        <p className="mt-0.5 text-sm text-[#3a0820]/50">{total} orders</p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Link href="/admin/orders" className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${!status ? "bg-[#6b1040] text-white" : "border border-[#6b1040]/20 text-[#6b1040] hover:bg-[#fde8f0]"}`}>All</Link>
        {statuses.map((s) => (
          <Link key={s} href={`?status=${s}`} className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${status === s ? "bg-[#6b1040] text-white" : "border border-[#6b1040]/20 text-[#6b1040] hover:bg-[#fde8f0]"}`}>{s}</Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#6b1040]/8 bg-[#fdf9f5]">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Order</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Total</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6b1040]/6">
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#3a0820]/40">No orders found</td></tr>
            ) : orders.map((o) => (
              <tr key={String(o._id)} className="hover:bg-[#fdf9f5]/60 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-[#3a0820]">{o.orderNumber}</td>
                <td className="px-5 py-4">
                  <p className="text-sm text-[#3a0820]">{o.shippingAddress.fullName}</p>
                  <p className="text-xs text-[#3a0820]/40">{o.shippingAddress.phone}</p>
                </td>
                <td className="px-5 py-4 text-xs text-[#3a0820]/60">
                  {new Date(o.createdAt as unknown as string).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-4 font-semibold text-[#6b1040]">₹{o.total.toLocaleString("en-IN")}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-500"}`}>{o.status}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/orders/${o._id}`} className="rounded-lg border border-[#6b1040]/20 px-3 py-1.5 text-xs font-medium text-[#6b1040] transition-colors hover:bg-[#fde8f0]">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`?status=${status}&page=${p}`} className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${p === page ? "bg-[#6b1040] text-white" : "border border-[#6b1040]/20 text-[#6b1040] hover:bg-[#fde8f0]"}`}>{p}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
