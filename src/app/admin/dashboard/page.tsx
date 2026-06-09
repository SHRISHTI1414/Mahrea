import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle, IndianRupee } from "lucide-react";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { User } from "@/models/User";

export default async function AdminDashboardPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalOrders, monthOrders, revenueResult, totalProducts, lowStockProducts, totalCustomers, recentOrders] =
    await Promise.all([
      Order.countDocuments({ "payment.status": "captured" }),
      Order.countDocuments({ "payment.status": "captured", createdAt: { $gte: startOfMonth } }),
      Order.aggregate([{ $match: { "payment.status": "captured" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Product.countDocuments({ isPublished: true }),
      Product.find({ stock: { $lte: 5 }, isPublished: true }).sort({ stock: 1 }).limit(5).lean(),
      User.countDocuments({ role: { $ne: "admin" } }),
      Order.find({ "payment.status": "captured" }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  const totalRevenue = revenueResult[0]?.total ?? 0;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "bg-[#fdf4e8]", iconColor: "text-[#c5962a]" },
    { label: "Orders This Month", value: monthOrders, icon: ShoppingCart, color: "bg-[#fde8f0]", iconColor: "text-[#c5295d]" },
    { label: "Total Orders", value: totalOrders, icon: TrendingUp, color: "bg-[#e8f0fd]", iconColor: "text-blue-500" },
    { label: "Products Live", value: totalProducts, icon: Package, color: "bg-[#e8fdf0]", iconColor: "text-green-500" },
    { label: "Customers", value: totalCustomers, icon: Users, color: "bg-[#f0e8fd]", iconColor: "text-purple-500" },
    { label: "Low Stock Alerts", value: lowStockProducts.length, icon: AlertTriangle, color: "bg-[#fdf4e8]", iconColor: "text-orange-500" },
  ];

  const STATUS_COLORS: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
    pending: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Dashboard</h1>
        <p className="mt-1 text-sm text-[#3a0820]/50">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon size={18} className={iconColor} />
            </div>
            <p className="text-2xl font-bold text-[#3a0820]">{value}</p>
            <p className="mt-0.5 text-xs text-[#3a0820]/50">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#3a0820]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#c5295d] underline underline-offset-2">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-[#3a0820]/40">No orders yet</p>
          ) : (
            <ul className="divide-y divide-[#6b1040]/8">
              {(recentOrders as Array<Record<string, unknown>>).map((o) => (
                <li key={String(o._id)} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#3a0820]">{o.orderNumber as string}</p>
                    <p className="text-xs text-[#3a0820]/40">{(o.shippingAddress as Record<string, string>).fullName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[o.status as string] ?? "bg-gray-100 text-gray-500"}`}>
                      {o.status as string}
                    </span>
                    <p className="mt-0.5 text-xs font-semibold text-[#6b1040]">₹{(o.total as number).toLocaleString("en-IN")}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#3a0820]">Low Stock Alerts</h2>
            <Link href="/admin/inventory" className="text-xs text-[#c5295d] underline underline-offset-2">View all</Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-[#3a0820]/40">All products well-stocked 🎉</p>
          ) : (
            <ul className="divide-y divide-[#6b1040]/8">
              {(lowStockProducts as Array<Record<string, unknown>>).map((p) => (
                <li key={String(p._id)} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#3a0820]">{p.name as string}</p>
                    <p className="text-xs capitalize text-[#3a0820]/40">{p.categorySlug as string}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock as number} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
