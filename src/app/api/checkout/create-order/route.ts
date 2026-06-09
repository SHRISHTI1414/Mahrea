import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { razorpay } from "@/lib/razorpay";

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MR-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const guestId = req.cookies.get("mahrea_guest_id")?.value;
    if (!guestId) return NextResponse.json({ error: "No cart found" }, { status: 400 });

    const cart = await Cart.findOne({ guestId }).lean();
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const { shippingAddress } = await req.json();
    if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.line1) {
      return NextResponse.json({ error: "Incomplete shipping address" }, { status: 400 });
    }

    const GIFT_WRAP_PRICE = 199;
    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const giftWrapCharge = cart.items.filter((i) => i.giftWrap).length * GIFT_WRAP_PRICE;
    const shippingCharge = subtotal >= 499 ? 0 : 49;
    const total = subtotal + giftWrapCharge + shippingCharge;

    // Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: generateOrderNumber(),
    });

    // Create Order in DB with pending payment
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      items: cart.items.map((i) => ({
        product: i.product,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        giftWrap: i.giftWrap,
      })),
      shippingAddress,
      subtotal,
      giftWrapCharge,
      shippingCharge,
      total,
      payment: {
        provider: "razorpay",
        orderId: rzpOrder.id,
        status: "pending",
      },
    });

    return NextResponse.json({
      orderId: String(order._id),
      razorpayOrder: rzpOrder,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[checkout/create-order]", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
