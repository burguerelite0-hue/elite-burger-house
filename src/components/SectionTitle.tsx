type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionTitle({ eyebrow, title, description, align = "left" }: SectionTitleProps) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#e33b32]">{eyebrow}</p>
      <h2 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-white md:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-7 text-white/60">{description}</p>}
    </div>
  );
}