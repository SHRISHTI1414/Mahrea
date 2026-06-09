import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

const GIFT_WRAP_PRICE = 199;

function totals(items: { price: number; quantity: number; giftWrap: boolean }[]) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const giftWrap = items.filter((i) => i.giftWrap).length * GIFT_WRAP_PRICE;
  const shipping = subtotal >= 499 ? 0 : 49;
  return { subtotal, giftWrap, shipping, total: subtotal + giftWrap + shipping };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    await connectDB();
    const { itemId } = await params;
    const guestId = req.cookies.get("mahrea_guest_id")?.value;
    if (!guestId) return NextResponse.json({ error: "No cart" }, { status: 404 });

    const { quantity } = await req.json();
    if (!quantity || quantity < 1) return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });

    const cart = await Cart.findOne({ guestId });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = cart.items.id(itemId);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    item.quantity = quantity;
    await cart.save();

    return NextResponse.json({ cart, items: cart.items, totals: totals(cart.items) });
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    await connectDB();
    const { itemId } = await params;
    const guestId = req.cookies.get("mahrea_guest_id")?.value;
    if (!guestId) return NextResponse.json({ error: "No cart" }, { status: 404 });

    const cart = await Cart.findOne({ guestId });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    cart.items = cart.items.filter((i) => String(i._id) !== itemId) as typeof cart.items;
    await cart.save();

    return NextResponse.json({ cart, items: cart.items, totals: totals(cart.items) });
  } catch {
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
