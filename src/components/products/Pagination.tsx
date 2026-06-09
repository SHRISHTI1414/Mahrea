"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6b1040]/20 text-[#6b1040] transition-colors hover:bg-[#fde8f0] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="text-sm text-[#6b1040]/40">…</span>
            )}
            <button
              onClick={() => goTo(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                p === page
                  ? "bg-[#6b1040] text-white"
                  : "border border-[#6b1040]/20 text-[#6b1040] hover:bg-[#fde8f0]"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6b1040]/20 text-[#6b1040] transition-colors hover:bg-[#fde8f0] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
