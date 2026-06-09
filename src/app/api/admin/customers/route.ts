import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = 20;
    const filter: Record<string, unknown> = { role: { $ne: "admin" } };
    if (q) filter.$or = [{ email: { $regex: q, $options: "i" } }, { name: { $regex: q, $options: "i" } }];
    const [customers, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select("-password").lean(),
      User.countDocuments(filter),
    ]);
    return NextResponse.json({ customers, total, totalPages: Math.ceil(total / limit) });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
