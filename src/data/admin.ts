export type AdminSection = "dashboard" | "orders" | "products" | "categories" | "banners" | "offers" | "coupons" | "customers" | "reports" | "settings";

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  available: boolean;
  featured: boolean;
  bestSeller: boolean;
};

export const adminNav = [
  { id: "dashboard" as const, label: "Dashboard", icon: "LayoutDashboard" },
  { id: "orders" as const, label: "Pedidos", icon: "ClipboardList" },
  { id: "products" as const, label: "Produtos", icon: "Utensils" },
  { id: "categories" as const, label: "Categorias", icon: "Tags" },
  { id: "banners" as const, label: "Banners", icon: "PanelsTopLeft" },
  { id: "offers" as const, label: "Ofertas", icon: "Sparkles" },
  { id: "coupons" as const, label: "Cupons", icon: "TicketPercent" },
  { id: "customers" as const, label: "Clientes", icon: "Users" },
  { id: "reports" as const, label: "Relatórios", icon: "ChartNoAxesCombined" },
  { id: "settings" as const, label: "Configurações", icon: "Settings2" },
] as const;