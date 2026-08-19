import { MessageCircle } from "lucide-react";
import { company } from "@/config/company";

type WhatsAppButtonProps = { compact?: boolean };

export function WhatsAppButton({ compact = false }: WhatsAppButtonProps) {
  return (
    <a
      href={company.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Pedir pelo WhatsApp"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#d9342b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ef4439] ${compact ? "py-2.5" : "shadow-[0_10px_35px_rgba(217,52,43,0.25)]"}`}
    >
      <MessageCircle size={18} />
      <span>{compact ? "WhatsApp" : "Pedir pelo WhatsApp"}</span>
    </a>
  );
}