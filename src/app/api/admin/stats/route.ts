import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalOrders, monthOrders, revenueResult, totalProducts, lowStock, totalCustomers] =
      await Promise.all([
        Order.countDocuments({ "payment.status": "captured" }),
        Order.countDocuments({ "payment.status": "captured", createdAt: { $gte: startOfMonth } }),
        Order.aggregate([
          { $match: { "payment.status": "captured" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Product.countDocuments({ isPublished: true }),
        Product.countDocuments({ stock: { $lte: 5 }, isPublished: true }),
        User.countDocuments({ role: "customer" }),
      ]);

    return NextResponse.json({
      totalOrders,
      monthOrders,
      totalRevenue: revenueResult[0]?.total ?? 0,
      totalProducts,
      lowStockCount: lowStock,
      totalCustomers,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
