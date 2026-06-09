import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    // Verify signature
    const valid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "confirmed",
        "payment.paymentId": razorpay_payment_id,
        "payment.signature": razorpay_signature,
        "payment.status": "captured",
      },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Decrement stock
    for (const item of order.items) {
      if (item.size) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { [`variants.$[v].stock`]: -item.quantity },
        }, { arrayFilters: [{ "v.size": item.size }] });
      } else {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // Clear the cart
    const guestId = req.cookies.get("mahrea_guest_id")?.value;
    if (guestId) await Cart.deleteOne({ guestId });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (err) {
    console.error("[webhook/razorpay]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
