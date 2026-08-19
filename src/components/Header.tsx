"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = ["Cardápio", "Promoções", "Contato"];

  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-[#0c0b0b]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#inicio" className="font-display text-xl font-black uppercase tracking-tight text-white">
          Elite <span className="text-[#e33b32]">Burger</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => <a key={link} href={`#${link === "Cardápio" ? "cardapio" : link === "Promoções" ? "destaques" : "contato"}`} className="text-sm font-semibold text-white/70 transition hover:text-white">{link}</a>)}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <button aria-label="Abrir carrinho" className="relative p-2 text-white/80 transition hover:text-white"><ShoppingBag size={21} /><span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e33b32] text-[10px] font-bold">0</span></button>
          <WhatsAppButton compact />
        </div>
        <button aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(!open)} className="p-2 text-white md:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="border-t border-white/10 bg-[#0c0b0b] px-5 py-5 md:hidden">{links.map((link) => <a onClick={() => setOpen(false)} key={link} href={`#${link === "Cardápio" ? "cardapio" : link === "Promoções" ? "destaques" : "contato"}`} className="block border-b border-white/10 py-3 text-sm font-semibold text-white/80">{link}</a>)}<div className="pt-4"><WhatsAppButton compact /></div></nav>}
    </header>
  );
}