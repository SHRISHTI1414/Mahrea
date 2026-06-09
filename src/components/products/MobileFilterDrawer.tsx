"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState, Suspense } from "react";
import FilterPanel from "./FilterPanel";

export default function MobileFilterDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-[#6b1040]/20 bg-white px-4 py-2 text-sm font-medium text-[#6b1040] lg:hidden"
      >
        <SlidersHorizontal size={15} />
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white px-5 py-6">
            <Suspense>
              <FilterPanel onClose={() => setOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
