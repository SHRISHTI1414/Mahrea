import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = 20;

    const filter: Record<string, unknown> = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.categorySlug = category;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const cat = await Category.findOne({ slug: body.categorySlug }).lean();
    if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    const product = await Product.create({ ...body, category: cat._id });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
