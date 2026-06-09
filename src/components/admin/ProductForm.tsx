"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload, Plus, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Variant {
  size: string;
  stock: number;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    categorySlug: string;
    price: number;
    discountPrice?: number;
    images: string[];
    metal: string;
    metalColour: string;
    material: string;
    variants: Variant[];
    stock: number;
    isPublished: boolean;
    isFeatured: boolean;
    tags: string[];
    weight?: number;
  };
}

const METALS = ["gold", "silver", "rose-gold", "oxidised", "multi"] as const;
const METAL_COLOURS = ["yellow", "white", "rose", "oxidised", "multi"] as const;

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [categorySlug, setCategorySlug] = useState(initialData?.categorySlug ?? categories[0]?.slug ?? "");
  const [price, setPrice] = useState(String(initialData?.price ?? ""));
  const [discountPrice, setDiscountPrice] = useState(String(initialData?.discountPrice ?? ""));
  const [metal, setMetal] = useState(initialData?.metal ?? "gold");
  const [metalColour, setMetalColour] = useState(initialData?.metalColour ?? "yellow");
  const [material, setMaterial] = useState(initialData?.material ?? "");
  const [stock, setStock] = useState(String(initialData?.stock ?? "0"));
  const [weight, setWeight] = useState(String(initialData?.weight ?? ""));
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [tags, setTags] = useState((initialData?.tags ?? []).join(", "));
  const [variants, setVariants] = useState<Variant[]>(initialData?.variants ?? []);
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const autoSlug = (n: string) =>
    n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleNameChange = (v: string) => {
    setName(v);
    if (!isEdit) setSlug(autoSlug(v));
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const signRes = await fetch("/api/admin/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "mahrea/products" }),
      });
      if (!signRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, cloudName, apiKey, folder } = await signRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await uploadRes.json();
      if (data.secure_url) {
        setImages((prev) => [...prev, data.secure_url]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const f of files) await uploadImage(f);
    e.target.value = "";
  };

  const addVariant = () => setVariants((v) => [...v, { size: "", stock: 0 }]);
  const removeVariant = (i: number) => setVariants((v) => v.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, key: keyof Variant, val: string | number) =>
    setVariants((v) => v.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name,
        slug,
        description,
        categorySlug,
        price: Number(price),
        ...(discountPrice ? { discountPrice: Number(discountPrice) } : {}),
        images,
        metal,
        metalColour,
        material,
        variants,
        stock: Number(stock),
        ...(weight ? { weight: Number(weight) } : {}),
        isPublished,
        isFeatured,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const url = isEdit ? `/api/admin/products/${initialData!._id}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Save failed");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product permanently?")) return;
    const res = await fetch(`/api/admin/products/${initialData!._id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  };

  const fieldClass = "w-full rounded-xl border border-[#6b1040]/20 px-4 py-2.5 text-sm outline-none focus:border-[#6b1040] bg-white";
  const labelClass = "mb-1 block text-xs font-medium text-[#3a0820]/60";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left col — main fields */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#3a0820]">Basic Info</h2>
            <div>
              <label className={labelClass}>Product Name *</label>
              <input value={name} onChange={(e) => handleNameChange(e.target.value)} required className={fieldClass} placeholder="e.g. Floral Stud Earrings" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={fieldClass} placeholder="floral-stud-earrings" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${fieldClass} resize-none`} placeholder="Describe the product…" />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#3a0820]">Pricing & Stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>MRP (₹) *</label>
                <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required className={fieldClass} placeholder="599" />
              </div>
              <div>
                <label className={labelClass}>Sale Price (₹)</label>
                <input type="number" min={0} value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className={fieldClass} placeholder="499" />
              </div>
              <div>
                <label className={labelClass}>Total Stock *</label>
                <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} required className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>Weight (g)</label>
                <input type="number" min={0} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} placeholder="5.2" />
              </div>
            </div>
          </div>

          {/* Metal & material */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#3a0820]">Metal & Material</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Metal *</label>
                <select value={metal} onChange={(e) => setMetal(e.target.value)} className={fieldClass}>
                  {METALS.map((m) => <option key={m} value={m}>{m.replace(/-/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Metal Colour *</label>
                <select value={metalColour} onChange={(e) => setMetalColour(e.target.value)} className={fieldClass}>
                  {METAL_COLOURS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Material</label>
              <input value={material} onChange={(e) => setMaterial(e.target.value)} className={fieldClass} placeholder="e.g. 92.5 Sterling Silver" />
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#3a0820]">Size Variants</h2>
              <button type="button" onClick={addVariant} className="flex items-center gap-1 rounded-lg border border-[#6b1040]/20 px-3 py-1.5 text-xs font-medium text-[#6b1040] hover:bg-[#fde8f0]">
                <Plus size={12} /> Add
              </button>
            </div>
            {variants.length === 0 && <p className="text-xs text-[#3a0820]/40">No variants — uses total stock above.</p>}
            {variants.map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} placeholder="Size (e.g. 6, M, Free)" className={`${fieldClass} flex-1`} />
                <input type="number" min={0} value={v.stock} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} placeholder="Stock" className={`${fieldClass} w-24`} />
                <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <label className={labelClass}>Tags (comma-separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className={fieldClass} placeholder="floral, silver, studs" />
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Status */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-[#3a0820]">Status</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 accent-[#6b1040]" />
              <span className="text-sm text-[#3a0820]">Published (visible on site)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 accent-[#6b1040]" />
              <span className="text-sm text-[#3a0820]">Featured (show on homepage)</span>
            </label>
          </div>

          {/* Category */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <label className={labelClass}>Category *</label>
            <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className={fieldClass}>
              {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>

          {/* Images */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-[#3a0820]">Images</h2>
            <div className="grid grid-cols-2 gap-2">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[#fdf4ee]">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-[#6b1040]/20 text-[#6b1040]/40 hover:border-[#6b1040]/40 hover:text-[#6b1040]/60 transition-colors disabled:opacity-50"
              >
                <Upload size={20} />
              </button>
            </div>
            {uploading && <p className="text-xs text-[#3a0820]/40">Uploading…</p>}
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button type="submit" disabled={saving} className="w-full rounded-full bg-[#6b1040] py-3 text-sm font-semibold text-white hover:bg-[#3a0820] disabled:opacity-60">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
            </button>
            {isEdit && (
              <button type="button" onClick={handleDelete} className="w-full rounded-full border border-red-200 py-3 text-sm font-medium text-red-500 hover:bg-red-50">
                Delete Product
              </button>
            )}
            <button type="button" onClick={() => router.push("/admin/products")} className="w-full rounded-full border border-[#6b1040]/20 py-3 text-sm font-medium text-[#6b1040] hover:bg-[#fde8f0]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
