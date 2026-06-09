import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import Order from "@/models/Order";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();
  const sp = await searchParams;
  const q = sp.q ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));
  const limit = 20;

  const filter: Record<string, unknown> = { role: { $ne: "admin" } };
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  type UserLean = { _id: unknown; name?: string; email?: string; createdAt: Date };
  const [rawCustomers, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments(filter),
  ]);
  const customers = rawCustomers as unknown as UserLean[];

  const customerIds = customers.map((c) => c._id);
  const orderStats = await Order.aggregate([
    { $match: { userId: { $in: customerIds }, "payment.status": "captured" } },
    { $group: { _id: "$userId", count: { $sum: 1 }, total: { $sum: "$total" } } },
  ]);

  const statsMap = Object.fromEntries(orderStats.map((s) => [String(s._id), s]));
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Customers</h1>
        <p className="mt-0.5 text-sm text-[#3a0820]/50">{total} registered customers</p>
      </div>

      <form className="mb-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or email…"
          className="w-full max-w-sm rounded-xl border border-[#6b1040]/20 px-4 py-2.5 text-sm outline-none focus:border-[#6b1040]"
        />
      </form>

      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#6b1040]/8 bg-[#fdf9f5]">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Joined</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Orders</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6b1040]/6">
            {customers.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-[#3a0820]/40">No customers found</td></tr>
            ) : customers.map((c: UserLean) => {
              const stats = statsMap[String(c._id)];
              return (
                <tr key={String(c._id)} className="hover:bg-[#fdf9f5]/60 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#3a0820]">{c.name}</p>
                    <p className="text-xs text-[#3a0820]/40">{c.email}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#3a0820]/60">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-[#3a0820]">{stats?.count ?? 0}</td>
                  <td className="px-5 py-4 font-semibold text-[#6b1040]">₹{(stats?.total ?? 0).toLocaleString("en-IN")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`?q=${q}&page=${p}`} className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${p === page ? "bg-[#6b1040] text-white" : "border border-[#6b1040]/20 text-[#6b1040] hover:bg-[#fde8f0]"}`}>{p}</a>
          ))}
        </div>
      )}
    </div>
  );
}
