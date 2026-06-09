import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? "";
    const metal = searchParams.get("metal") ?? "";
    const minPrice = Number(searchParams.get("minPrice") ?? 0);
    const maxPrice = Number(searchParams.get("maxPrice") ?? 999999);
    const sort = searchParams.get("sort") ?? "newest";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 12)));

    const filter: Record<string, unknown> = { isPublished: true };

    if (category) filter.categorySlug = category;
    if (metal) filter.metal = metal;
    filter.price = { $gte: minPrice, $lte: maxPrice };

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      featured: { isFeatured: -1, createdAt: -1 },
    };
    const sortQuery = sortMap[sort] ?? sortMap.newest;

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortQuery).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
