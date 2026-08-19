import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin | Elite Burger House",
  description: "Painel administrativo da Elite Burger House.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}