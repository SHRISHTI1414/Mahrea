import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const source = await Product.findOne({ slug: id, isPublished: true })
      .select("categorySlug _id")
      .lean();

    if (!source) {
      return NextResponse.json({ products: [] });
    }

    const related = await Product.find({
      categorySlug: source.categorySlug,
      _id: { $ne: source._id },
      isPublished: true,
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4)
      .lean();

    return NextResponse.json({ products: related });
  } catch {
    return NextResponse.json({ error: "Failed to fetch related products" }, { status: 500 });
  }
}
