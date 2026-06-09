import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f5f2]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 lg:ml-60">
        <div className="min-h-screen">{children}</div>
      </div>
    </div>
  );
}
