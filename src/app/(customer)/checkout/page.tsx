"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/stores/cart.store";
import { ArrowRight, Lock } from "lucide-react";

interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
];

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, fetchCart } = useCartStore();
  const [address, setAddress] = useState<Address>({
    fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState<Partial<Address>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [fetchCart]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-[#6b1040]">Your cart is empty</p>
            <a href="/rings" className="mt-4 inline-block text-sm text-[#c5295d] underline">Shop Now</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Partial<Address> = {};
    if (!address.fullName.trim()) e.fullName = "Required";
    if (!/^[6-9]\d{9}$/.test(address.phone)) e.phone = "Valid 10-digit mobile required";
    if (!address.line1.trim()) e.line1 = "Required";
    if (!address.city.trim()) e.city = "Required";
    if (!address.state) e.state = "Required";
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = "Valid 6-digit pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const field = (name: keyof Address, label: string, placeholder?: string, type = "text") => (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#3a0820]/60">{label}</label>
      <input
        type={type}
        placeholder={placeholder ?? label}
        value={address[name]}
        onChange={(e) => setAddress((a) => ({ ...a, [name]: e.target.value }))}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#6b1040] ${
          errors[name] ? "border-[#c5295d]" : "border-[#6b1040]/20"
        }`}
      />
      {errors[name] && <p className="mt-0.5 text-[11px] text-[#c5295d]">{errors[name]}</p>}
    </div>
  );

  const handlePayment = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: data.razorpayKeyId,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "Mahrea",
        description: "Handcrafted Jewellery",
        order_id: data.razorpayOrder.id,
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: "#6b1040" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/webhooks/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            router.push(`/order/confirmation/${verifyData.orderNumber}`);
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf9f5]">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <h1
            className="mb-8 text-2xl font-bold text-[#6b1040]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Checkout
          </h1>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Address form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#3a0820]/50">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {field("fullName", "Full Name", "Your full name")}
                    {field("phone", "Mobile Number", "10-digit number", "tel")}
                  </div>
                  {field("line1", "Address Line 1", "Flat, House no., Building, Street")}
                  {field("line2", "Address Line 2 (optional)", "Area, Colony, Landmark")}
                  <div className="grid grid-cols-2 gap-4">
                    {field("city", "City", "City")}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[#3a0820]/60">State</label>
                      <select
                        value={address.state}
                        onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#6b1040] ${errors.state ? "border-[#c5295d]" : "border-[#6b1040]/20"}`}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="mt-0.5 text-[11px] text-[#c5295d]">{errors.state}</p>}
                    </div>
                  </div>
                  {field("pincode", "Pincode", "6-digit pincode")}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#3a0820]/50">
                  Order Summary
                </h2>
                <ul className="mb-4 space-y-3">
                  {items.map((item) => (
                    <li key={item._id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#3a0820]">{item.name}</p>
                        <p className="text-xs text-[#3a0820]/40">
                          {item.size && `Size ${item.size} · `}Qty {item.quantity}
                          {item.giftWrap && " · Gift"}
                        </p>
                      </div>
                      <span className="flex-shrink-0 font-semibold text-[#6b1040]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 border-t border-[#6b1040]/10 pt-4 text-sm">
                  <div className="flex justify-between text-[#3a0820]/60">
                    <span>Subtotal</span><span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {totals.giftWrap > 0 && (
                    <div className="flex justify-between text-[#c5962a]">
                      <span>Gift wrapping</span><span>₹{totals.giftWrap.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#3a0820]/60">
                    <span>Shipping</span>
                    <span>{totals.shipping === 0 ? <span className="text-green-600">Free</span> : `₹${totals.shipping}`}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#6b1040]/10 pt-2 font-bold text-[#6b1040] text-base">
                    <span>Total</span><span>₹{totals.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#6b1040] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#3a0820] disabled:opacity-60"
                >
                  <Lock size={14} />
                  {loading ? "Processing…" : `Pay ₹${totals.total.toLocaleString("en-IN")}`}
                  {!loading && <ArrowRight size={14} />}
                </button>
                <p className="mt-3 text-center text-[10px] text-[#3a0820]/30">
                  Secured by Razorpay · SSL encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
