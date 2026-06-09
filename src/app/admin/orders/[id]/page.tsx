import { redirect, notFound } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth/admin";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderDetail from "@/components/admin/OrderDetail";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  await connectDB();
  const { id } = await params;
  const order = await Order.findById(id).lean();
  if (!order) notFound();

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3a0820]" style={{ fontFamily: "serif" }}>Order {order.orderNumber}</h1>
        <p className="mt-0.5 text-sm text-[#3a0820]/50">
          Placed on {new Date(order.createdAt as unknown as string).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
        </p>
      </div>
      <OrderDetail order={JSON.parse(JSON.stringify(order))} />
    </div>
  );
}
