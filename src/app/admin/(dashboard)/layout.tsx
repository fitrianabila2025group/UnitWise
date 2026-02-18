import { Providers } from "@/components/providers";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
      <Toaster />
    </Providers>
  );
}
