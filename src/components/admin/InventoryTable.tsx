"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";

interface Variant {
  size: string;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  categorySlug: string;
  stock: number;
  variants: Variant[];
}

export default function InventoryTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startEdit = (p: Product) => {
    setEditingId(p._id);
    setEditStock(String(p.stock));
  };

  const saveStock = async (id: string) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: Number(editStock) }),
      });
      if (!res.ok) throw new Error("Update failed");
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock: Number(editStock) } : p))
      );
      setEditingId(null);
    } catch {
      setError("Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#6b1040]/8 bg-[#fdf9f5]">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Product</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Variants</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Total Stock</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6b1040]/6">
            {products.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#3a0820]/40">No products match this filter</td></tr>
            ) : products.map((p) => (
              <tr key={p._id} className="hover:bg-[#fdf9f5]/60 transition-colors">
                <td className="px-5 py-4 font-medium text-[#3a0820]">{p.name}</td>
                <td className="px-5 py-4 capitalize text-[#3a0820]/60">{p.categorySlug}</td>
                <td className="px-5 py-4">
                  {p.variants.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {p.variants.map((v, i) => (
                        <span key={i} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${v.stock === 0 ? "bg-red-100 text-red-600" : v.stock <= 3 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"}`}>
                          {v.size}: {v.stock}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-[#3a0820]/40">No variants</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {editingId === p._id ? (
                    <input
                      type="number"
                      min={0}
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="w-20 rounded-lg border border-[#6b1040]/20 px-2 py-1 text-sm outline-none focus:border-[#6b1040]"
                    />
                  ) : (
                    <span className={`font-bold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-orange-500" : "text-green-600"}`}>
                      {p.stock}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  {editingId === p._id ? (
                    <div className="inline-flex gap-1">
                      <button onClick={() => saveStock(p._id)} disabled={saving} className="rounded-lg bg-green-50 p-1.5 text-green-600 hover:bg-green-100"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="rounded-lg bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100"><X size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(p)} className="inline-flex items-center gap-1 rounded-lg border border-[#6b1040]/20 px-3 py-1.5 text-xs font-medium text-[#6b1040] hover:bg-[#fde8f0]">
                      <Pencil size={11} /> Adjust
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
