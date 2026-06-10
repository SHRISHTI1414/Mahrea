import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Generate 4-char n-grams from a word — catches single insert/delete typos
// e.g. "earings" → ["eari","arin","ring","ings"] — "ring"/"ings" match "earrings"
function ngrams(word: string, n = 4): string[] {
  const result: string[] = [];
  for (let i = 0; i <= word.length - n; i++) result.push(word.slice(i, i + n));
  return result;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ products: [], total: 0 });

  try {
    await connectDB();

    const words = q.split(/\s+/).filter(Boolean);

    // For each word: exact regex + 4-gram patterns (tolerates 1-char typos)
    const patterns: RegExp[] = [];
    for (const w of words) {
      patterns.push(new RegExp(escape(w), "i")); // exact
      if (w.length >= 5) {
        for (const gram of ngrams(w)) {
          patterns.push(new RegExp(escape(gram), "i")); // n-gram substring
        }
      }
    }

    // Deduplicate patterns by source string
    const unique = [...new Map(patterns.map((r) => [r.source, r])).values()];

    const orConditions = unique.flatMap((r) => [
      { name: r }, { tags: r },
    ]);

    const raw = await Product.find({
      isPublished: true,
      $or: orConditions,
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
