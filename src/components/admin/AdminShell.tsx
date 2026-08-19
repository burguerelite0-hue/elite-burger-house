"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CatalogView, ProductsView, SettingsView } from "@/components/admin/AdminDataViews";
import type { AdminSection } from "@/data/admin";

export function AdminShell() {
  const [active, setActive] = useState<AdminSection>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return <div className="flex min-h-screen bg-[#f7f6f7] text-[#1d1b20]"><AdminSidebar active={active} collapsed={collapsed} mobileOpen={mobileOpen} onNavigate={setActive} onToggle={() => setCollapsed(!collapsed)} onCloseMobile={() => setMobileOpen(false)} onLogout={handleLogout} /><div className="flex min-w-0 flex-1 flex-col"><AdminHeader active={active} onOpenMobile={() => setMobileOpen(true)} search={search} onSearch={setSearch} /><main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{active === "dashboard" && <AdminDashboard />}{active === "products" && <ProductsView onFeedback={showFeedback} />}{active === "settings" && <SettingsView onFeedback={showFeedback} />}{active !== "dashboard" && active !== "products" && active !== "settings" && (active === "orders" || active === "categories" || active === "banners" || active === "offers" || active === "coupons" || active === "customers" || active === "reports") && <CatalogView section={active} onFeedback={showFeedback} />}</main></div>{feedback && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#29262d] px-4 py-3 text-sm font-semibold text-white shadow-xl"><CheckCircle2 size={17} className="text-[#67d09f]" />{feedback}</div>}</div>;
}