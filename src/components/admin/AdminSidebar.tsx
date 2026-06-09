"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users,
  BarChart2, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/auth/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c5962a]">
            <span className="text-xs font-bold text-[#c5962a]" style={{ fontFamily: "serif" }}>MR</span>
          </div>
          <div>
            <p className="text-sm font-bold tracking-widest text-[#c5962a]" style={{ fontFamily: "serif" }}>MAHREA</p>
            <p className="text-[9px] tracking-wider text-white/30">ADMIN</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#c5962a]/20 text-[#c5962a]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* View site + logout */}
      <div className="border-t border-white/10 px-3 py-4 space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <span className="text-xs">↗</span> View Site
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-60 bg-[#3a0820] lg:block z-30">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#3a0820] text-white shadow-lg lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-60 bg-[#3a0820]">
            <button onClick={() => setMobileOpen(false)} className="absolute right-4 top-4 text-white/50 hover:text-white">
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
