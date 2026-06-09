"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
type OrderStatus = (typeof STATUSES)[number];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-500",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  refunded: "bg-orange-100 text-orange-600",
};

interface OrderItem {
  productSlug: string;
  categorySlug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  giftWrap?: boolean;
  quantity: number;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  giftWrapFee: number;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment: {
    provider: string;
    orderId: string;
    paymentId?: string;
    status: string;
  };
  createdAt: string;
}

export default function OrderDetail({ order: initialOrder }: { order: OrderData }) {
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateStatus = async () => {
    if (status === order.status) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setOrder((prev) => ({ ...prev, status: data.order.status }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-[#6b1040] hover:underline">
        <ArrowLeft size={14} /> Back to orders
      </Link>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-[#3a0820]">Items ({order.items.length})</h2>
            <ul className="space-y-4">
              {order.items.map((item, i) => (
                <li key={i} className="flex gap-4">
                  {item.image && (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#fdf4ee]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[#3a0820]">{item.name}</p>
                    <p className="text-xs text-[#3a0820]/50">
                      {item.size && `Size: ${item.size}`}{item.size && item.giftWrap ? " · " : ""}{item.giftWrap ? "Gift wrap" : ""}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[#6b1040]">₹{item.price.toLocaleString("en-IN")} × {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-[#6b1040]/8 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-[#3a0820]/60">
                <span>Subtotal</span><span>₹{order.subtotal?.toLocaleString("en-IN") ?? "—"}</span>
              </div>
              <div className="flex justify-between text-[#3a0820]/60">
                <span>Shipping</span><span>{order.shippingFee === 0 ? "Free" : `₹${order.shippingFee}`}</span>
              </div>
              {order.giftWrapFee > 0 && (
                <div className="flex justify-between text-[#3a0820]/60">
                  <span>Gift Wrap</span><span>₹{order.giftWrapFee}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#3a0820] pt-1 border-t border-[#6b1040]/8">
                <span>Total</span><span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-semibold text-[#3a0820]">Shipping Address</h2>
            <address className="not-italic text-sm text-[#3a0820]/70 space-y-0.5">
              <p className="font-medium text-[#3a0820]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
            </address>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Status update */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-[#3a0820]">Order Status</h2>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"}`}>
              {order.status}
            </span>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#3a0820]/60">Update to</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full rounded-xl border border-[#6b1040]/20 px-4 py-2.5 text-sm outline-none focus:border-[#6b1040]"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              onClick={updateStatus}
              disabled={saving || status === order.status}
              className="w-full rounded-full bg-[#6b1040] py-2.5 text-sm font-semibold text-white hover:bg-[#3a0820] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Update Status"}
            </button>
          </div>

          {/* Payment */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-2 text-sm">
            <h2 className="font-semibold text-[#3a0820]">Payment</h2>
            <div className="text-[#3a0820]/60 space-y-1">
              <p><span className="font-medium text-[#3a0820]">Provider:</span> Razorpay</p>
              <p><span className="font-medium text-[#3a0820]">Status:</span> {order.payment.status}</p>
              <p className="truncate"><span className="font-medium text-[#3a0820]">Order ID:</span> {order.payment.orderId}</p>
              {order.payment.paymentId && <p className="truncate"><span className="font-medium text-[#3a0820]">Payment ID:</span> {order.payment.paymentId}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
