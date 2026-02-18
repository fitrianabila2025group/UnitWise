"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Tags,
  FileText,
  HelpCircle,
  Link2,
  Megaphone,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/conversions", label: "Conversions", icon: ArrowRightLeft },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/pages", label: "SEO Pages", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/internal-links", label: "Internal Links", icon: Link2 },
  { href: "/admin/ads", label: "Ads Manager", icon: Megaphone },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/site-settings", label: "Site Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-4">
        <ArrowRightLeft className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">UnitWise</span>
        <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Admin</span>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4 space-y-2">
        <div className="text-xs text-muted-foreground truncate">
          {session?.user?.email}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/" target="_blank">
              <ChevronLeft className="h-3 w-3 mr-1" /> View Site
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 border-r bg-background shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
