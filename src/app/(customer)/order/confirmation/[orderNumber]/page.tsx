import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, MapPin } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  await connectDB();

  const order = await Order.findOne({ orderNumber }).lean();
  if (!order) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf9f5]">
      <Navbar />
      <main className="flex-1 px-4 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[700px]">
          {/* Success header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={40} className="text-green-600" />
              </div>
            </div>
            <h1
              className="text-2xl font-bold text-[#6b1040] lg:text-3xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Order Confirmed!
            </h1>
            <p className="mt-2 text-sm text-[#3a0820]/60">
              Thank you for your order. We're preparing it with love.
            </p>
            <p className="mt-1 text-xs font-medium text-[#c5962a] tracking-widest uppercase">
              Order #{order.orderNumber}
            </p>
          </div>

          {/* Order progress */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              {[
                { icon: CheckCircle, label: "Confirmed", done: true },
                { icon: Package, label: "Processing", done: false },
                { icon: Truck, label: "Shipped", done: false },
                { icon: MapPin, label: "Delivered", done: false },
              ].map(({ icon: Icon, label, done }, idx, arr) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${done ? "bg-[#6b1040]" : "bg-[#fdf4ee]"}`}>
                    <Icon size={18} className={done ? "text-white" : "text-[#c5962a]/40"} />
                  </div>
                  <span className={`text-[10px] font-medium ${done ? "text-[#6b1040]" : "text-[#3a0820]/30"}`}>
                    {label}
                  </span>
                  {idx < arr.length - 1 && (
                    <div className="absolute" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#3a0820]/50">
              Items Ordered
            </h2>
            <ul className="divide-y divide-[#6b1040]/8">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium text-[#3a0820]">{item.name}</p>
                    <p className="text-xs text-[#3a0820]/40">
                      {item.size && `Size ${item.size} · `}Qty {item.quantity}
                      {item.giftWrap && " · Gift wrapped"}
                    </p>
                  </div>
                  <span className="font-semibold text-[#6b1040]">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-[#6b1040]/10 pt-4 text-sm">
              <div className="flex justify-between text-[#3a0820]/60">
                <span>Subtotal</span><span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.giftWrapCharge > 0 && (
                <div className="flex justify-between text-[#c5962a]">
                  <span>Gift wrapping</span><span>₹{order.giftWrapCharge.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-[#3a0820]/60">
                <span>Shipping</span>
                <span>{order.shippingCharge === 0 ? "Free" : `₹${order.shippingCharge}`}</span>
              </div>
              <div className="flex justify-between border-t border-[#6b1040]/10 pt-2 font-bold text-[#6b1040]">
                <span>Total Paid</span><span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#3a0820]/50">
              Delivering To
            </h2>
            <p className="font-medium text-[#3a0820]">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-[#3a0820]/60">{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && (
              <p className="text-sm text-[#3a0820]/60">{order.shippingAddress.line2}</p>
            )}
            <p className="text-sm text-[#3a0820]/60">
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
            <p className="text-sm text-[#3a0820]/60">{order.shippingAddress.phone}</p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/rings"
              className="flex-1 rounded-full bg-[#6b1040] py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#3a0820]"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-full border border-[#6b1040]/20 py-3.5 text-center text-sm font-medium text-[#6b1040] transition-colors hover:bg-[#fde8f0]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
