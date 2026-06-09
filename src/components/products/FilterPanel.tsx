"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";

const METALS = [
  { value: "", label: "All" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "rose-gold", label: "Rose Gold" },
  { value: "oxidised", label: "Oxidised" },
];

const PRICE_RANGES = [
  { min: 0, max: 999999, label: "All Prices" },
  { min: 0, max: 199, label: "Under ₹199" },
  { min: 200, max: 399, label: "₹200 – ₹399" },
  { min: 400, max: 599, label: "₹400 – ₹599" },
  { min: 600, max: 999, label: "₹600 – ₹999" },
  { min: 1000, max: 999999, label: "₹1000+" },
];

interface FilterPanelProps {
  onClose?: () => void;
}

export default function FilterPanel({ onClose }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMetal = searchParams.get("metal") ?? "";
  const currentMin = searchParams.get("minPrice") ?? "0";
  const currentMax = searchParams.get("maxPrice") ?? "999999";

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters = currentMetal || currentMin !== "0" || currentMax !== "999999";

  return (
    <aside className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6b1040]">Filters</h3>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[#c5295d] underline underline-offset-2 hover:text-[#a8204d]"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-[#6b1040] lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3a0820]/60">Price</p>
        <ul className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const active =
              currentMin === String(range.min) && currentMax === String(range.max);
            return (
              <li key={range.label}>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (range.min === 0 && range.max === 999999) {
                      params.delete("minPrice");
                      params.delete("maxPrice");
                    } else {
                      params.set("minPrice", String(range.min));
                      params.set("maxPrice", String(range.max));
                    }
                    params.delete("page");
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-[#6b1040] font-medium text-white"
                      : "text-[#3a0820]/70 hover:bg-[#fde8f0] hover:text-[#6b1040]"
                  }`}
                >
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Metal */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3a0820]/60">Metal</p>
        <div className="flex flex-wrap gap-2">
          {METALS.map((m) => (
            <button
              key={m.value}
              onClick={() => setParam("metal", m.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                currentMetal === m.value
                  ? "border-[#6b1040] bg-[#6b1040] text-white"
                  : "border-[#6b1040]/20 text-[#3a0820]/70 hover:border-[#6b1040] hover:text-[#6b1040]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
