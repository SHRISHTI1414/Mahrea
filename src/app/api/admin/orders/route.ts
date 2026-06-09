import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = 20;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    return NextResponse.json({ orders, total, totalPages: Math.ceil(total / limit) });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
