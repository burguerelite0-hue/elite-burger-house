"use client";

import { Bell, Menu, Search } from "lucide-react";
import { adminNav, type AdminSection } from "@/data/admin";

type AdminHeaderProps = { active: AdminSection; onOpenMobile: () => void; search: string; onSearch: (value: string) => void };

export function AdminHeader({ active, onOpenMobile, search, onSearch }: AdminHeaderProps) {
  const pageTitle = adminNav.find((item) => item.id === active)?.label ?? "Dashboard";
  return <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-[#e9e7ea] bg-white px-5 lg:px-8"><div className="flex min-w-0 items-center gap-3"><button onClick={onOpenMobile} aria-label="Abrir menu" className="rounded-lg p-2 text-[#4d4a54] hover:bg-[#f4f3f5] md:hidden"><Menu size={21} /></button><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a97a2]">Visão geral</p><h1 className="truncate text-xl font-bold text-[#1d1b20]">{pageTitle}</h1></div></div><div className="hidden max-w-sm flex-1 md:block"><label className="relative block"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa7b0]" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar no painel..." className="h-10 w-full rounded-xl border border-[#e7e5e8] bg-[#f8f7f8] pl-10 pr-3 text-sm outline-none transition placeholder:text-[#aaa7b0] focus:border-[#e33b32] focus:bg-white" /></label></div><div className="flex items-center gap-2"><button aria-label="Notificações" className="relative rounded-xl p-2.5 text-[#696671] hover:bg-[#f4f3f5]"><Bell size={19} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e33b32]" /></button><div className="hidden h-8 w-px bg-[#e9e7ea] sm:block" /><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#241f21] text-xs font-bold text-[#f0b849]">GB</div></div></header>;
}