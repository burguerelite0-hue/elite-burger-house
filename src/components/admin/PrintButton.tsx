"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return <button onClick={() => window.print()} className="thermal-actions inline-flex items-center gap-2 rounded-lg bg-[#e33b32] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#c92d25]"><Printer size={16} /> Imprimir pedido</button>;
}