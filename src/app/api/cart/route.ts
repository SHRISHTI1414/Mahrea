import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

const GIFT_WRAP_PRICE = 199;

function getCartId(req: NextRequest) {
  return req.cookies.get("mahrea_guest_id")?.value ?? null;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const guestId = getCartId(req);
    if (!guestId) return NextResponse.json({ cart: null, items: [], totals: { subtotal: 0, giftWrap: 0, shipping: 0, total: 0 } });

    const cart = await Cart.findOne({ guestId }).lean();
    if (!cart) return NextResponse.json({ cart: null, items: [], totals: { subtotal: 0, giftWrap: 0, shipping: 0, total: 0 } });

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const giftWrap = cart.items.filter((i) => i.giftWrap).length * GIFT_WRAP_PRICE;
    const shipping = subtotal >= 499 ? 0 : 49;
    const total = subtotal + giftWrap + shipping;

    return NextResponse.json({ cart, items: cart.items, totals: { subtotal, giftWrap, shipping, total } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, productSlug, categorySlug, name, image, price, size, giftWrap = false, quantity = 1 } = body;

    if (!productId || !productSlug || !name || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Stock check
    const product = await Product.findById(productId).select("stock variants isPublished").lean();
    if (!product || !product.isPublished) {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }
    const availableStock = size
      ? (product.variants.find((v) => v.size === size)?.stock ?? 0)
      : product.stock;
    if (availableStock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 409 });
    }

    let guestId = getCartId(req);
    const isNew = !guestId;
    if (!guestId) {
      const { v4: uuidv4 } = await import("uuid");
      guestId = uuidv4();
    }

    let cart = await Cart.findOne({ guestId });
    if (!cart) {
      cart = new Cart({ guestId, items: [] });
    }

    const existingIdx = cart.items.findIndex(
      (i) => i.productSlug === productSlug && i.size === size && i.giftWrap === giftWrap
    );

    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({ product: productId, productSlug, categorySlug, name, image, price, size, giftWrap, quantity });
    }

    await cart.save();

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const giftWrapTotal = cart.items.filter((i) => i.giftWrap).length * GIFT_WRAP_PRICE;
    const shipping = subtotal >= 499 ? 0 : 49;
    const total = subtotal + giftWrapTotal + shipping;

    const res = NextResponse.json({ cart, items: cart.items, totals: { subtotal, giftWrap: giftWrapTotal, shipping, total } });
    if (isNew) {
      res.cookies.set("mahrea_guest_id", guestId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }
    return res;
  } catch {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}
