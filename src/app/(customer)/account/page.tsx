import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { User, Package, LogOut, ChevronRight } from "lucide-react";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/mongodb";
import { User as UserModel } from "@/models/User";
import Order from "@/models/Order";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login?next=/account");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    redirect("/login?next=/account");
  }

  await connectDB();
  const [user, orders] = await Promise.all([
    UserModel.findById(payload.userId).select("-password").lean(),
    Order.find({ userId: payload.userId, "payment.status": "captured" })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  if (!user) redirect("/login?next=/account");

  const STATUS_COLORS: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
    pending: "bg-gray-100 text-gray-500",
    refunded: "bg-orange-100 text-orange-600",
  };

  const serializedOrders = JSON.parse(JSON.stringify(orders));
  const serializedUser = JSON.parse(JSON.stringify(user));

  return (
    <main className="min-h-screen bg-[#fdf4ee]">
      <div className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6b1040]">
            <User size={28} className="text-[#c5962a]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "var(--font-playfair)" }}>
              {serializedUser.name ?? "My Account"}
            </h1>
            <p className="text-sm text-[#3a0820]/50">{serializedUser.email ?? serializedUser.phone}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile card */}
          <AccountClient user={serializedUser} />

          {/* Orders */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Package size={18} className="text-[#6b1040]" />
              <h2 className="font-semibold text-[#3a0820]">Recent Orders</h2>
            </div>

            {serializedOrders.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#3a0820]/40">No orders yet.</p>
                <Link href="/" className="mt-3 inline-block text-sm font-medium text-[#c5295d] underline underline-offset-2">
                  Start shopping
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-[#6b1040]/8">
                {serializedOrders.map((order: Record<string, unknown>) => (
                  <li key={String(order._id)} className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-semibold text-[#3a0820]">{order.orderNumber as string}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[order.status as string] ?? "bg-gray-100 text-gray-500"}`}>
                            {order.status as string}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#3a0820]/40">
                          {new Date(order.createdAt as string).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                          {" · "}
                          {(order.items as unknown[]).length} item{(order.items as unknown[]).length !== 1 ? "s" : ""}
                        </p>

                        {/* Item thumbnails */}
                        <div className="mt-2 flex gap-1.5">
                          {(order.items as Array<Record<string, unknown>>).slice(0, 3).map((item, i) => (
                            <div key={i} className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#fdf4ee]">
                              {typeof item.image === "string" && item.image && (
                                <Image src={item.image} alt={item.name as string} fill className="object-cover" />
                              )}
                            </div>
                          ))}
                          {(order.items as unknown[]).length > 3 && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fdf4ee] text-xs font-medium text-[#6b1040]">
                              +{(order.items as unknown[]).length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-[#6b1040]">₹{(order.total as number).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick links */}
          <div className="rounded-2xl bg-white shadow-sm divide-y divide-[#6b1040]/8 overflow-hidden">
            <Link href="/" className="flex items-center justify-between px-5 py-4 hover:bg-[#fdf9f5] transition-colors">
              <span className="text-sm text-[#3a0820]">Continue Shopping</span>
              <ChevronRight size={16} className="text-[#3a0820]/30" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
