"use client";

import { useState } from "react";
import { ToggleLeft, ToggleRight, Plus, Pencil, Check, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  description: string;
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const patch = async (id: string, body: object) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  };

  const toggleActive = async (cat: Category) => {
    setError("");
    try {
      const data = await patch(cat._id, { isActive: !cat.isActive });
      setCategories((prev) => prev.map((c) => (c._id === cat._id ? { ...c, isActive: data.category.isActive } : c)));
    } catch {
      setError("Failed to update category");
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDesc(cat.description);
  };

  const saveEdit = async (id: string) => {
    setError("");
    setSaving(true);
    try {
      const data = await patch(id, { name: editName, description: editDesc });
      setCategories((prev) => prev.map((c) => (c._id === id ? { ...c, name: data.category.name, description: data.category.description ?? "" } : c)));
      setEditingId(null);
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = async () => {
    if (!newName.trim()) return;
    setError("");
    setAdding(true);
    try {
      const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), slug, sortOrder: categories.length }),
      });
      if (!res.ok) throw new Error("Create failed");
      const data = await res.json();
      setCategories((prev) => [...prev, {
        _id: data.category._id,
        name: data.category.name,
        slug: data.category.slug,
        isActive: data.category.isActive,
        sortOrder: data.category.sortOrder,
        description: data.category.description ?? "",
      }]);
      setNewName("");
    } catch {
      setError("Failed to add category");
    } finally {
      setAdding(false);
    }
  };

  const fieldClass = "rounded-xl border border-[#6b1040]/20 px-3 py-2 text-sm outline-none focus:border-[#6b1040] bg-white";

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {/* Add new */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-[#3a0820]">Add Category</h2>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Category name…"
            className={`${fieldClass} flex-1`}
          />
          <button
            onClick={addCategory}
            disabled={adding || !newName.trim()}
            className="flex items-center gap-1.5 rounded-full bg-[#6b1040] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a0820] disabled:opacity-50"
          >
            <Plus size={14} />{adding ? "Adding…" : "Add"}
          </button>
        </div>
      </div>

      {/* Category list */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#6b1040]/8 bg-[#fdf9f5]">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Slug</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Active</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#3a0820]/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6b1040]/6">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-[#fdf9f5]/60 transition-colors">
                <td className="px-5 py-4">
                  {editingId === cat._id ? (
                    <div className="space-y-2">
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} className={fieldClass} />
                      <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" className={fieldClass} />
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-[#3a0820]">{cat.name}</p>
                      {cat.description && <p className="text-xs text-[#3a0820]/40 mt-0.5">{cat.description}</p>}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-[#3a0820]/50">{cat.slug}</td>
                <td className="px-5 py-4">
                  <button onClick={() => toggleActive(cat)} className="text-[#6b1040]/60 hover:text-[#6b1040] transition-colors">
                    {cat.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                  </button>
                </td>
                <td className="px-5 py-4 text-right">
                  {editingId === cat._id ? (
                    <div className="inline-flex gap-1">
                      <button onClick={() => saveEdit(cat._id)} disabled={saving} className="rounded-lg bg-green-50 p-1.5 text-green-600 hover:bg-green-100"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="rounded-lg bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100"><X size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(cat)} className="inline-flex items-center gap-1 rounded-lg border border-[#6b1040]/20 px-3 py-1.5 text-xs font-medium text-[#6b1040] hover:bg-[#fde8f0]">
                      <Pencil size={11} /> Edit
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
