import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ products: [], total: 0 });

  try {
    await connectDB();

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const raw = await Product.find({
      isPublished: true,
      $or: [{ name: regex }, { tags: regex }, { description: regex }],
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(48)
      .lean();

    const products = raw.map((p) => ({
      _id: String(p._id),
      name: p.name,
      slug: p.slug,
      categorySlug: p.categorySlug,
      price: p.price,
      discountPrice: p.discountPrice,
      images: p.images,
      metal: p.metal,
      isFeatured: p.isFeatured,
    }));

    return NextResponse.json({ products, total: products.length });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
