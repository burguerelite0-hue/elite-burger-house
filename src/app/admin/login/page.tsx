"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível entrar.");
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.assign(next?.startsWith("/admin") ? next : "/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Não foi possível entrar.");
      setLoading(false);
    }
  }

  return <main className="flex min-h-screen bg-[#111012] text-white"><section className="relative hidden flex-1 overflow-hidden lg:flex"><div className="hero-grid absolute inset-0 opacity-30" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(227,59,50,0.28),transparent_38%)]" /><div className="relative z-10 flex flex-col justify-between p-12 xl:p-16"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e33b32] font-display text-2xl">E</span><span className="text-sm font-bold tracking-wide">Elite Burger House</span></div><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#f0b849]">Área restrita</p><h1 className="max-w-xl font-display text-8xl uppercase leading-[0.84]">Controle sua<br /><span className="text-[#e33b32]">operação.</span></h1><p className="mt-7 max-w-md text-base leading-7 text-white/50">Acompanhe pedidos, produtos e o desempenho da sua loja em um só lugar.</p></div><p className="text-xs text-white/30">Painel administrativo · Elite Burger House</p></div></section><section className="flex w-full items-center justify-center px-5 py-12 lg:max-w-[540px] lg:bg-[#f8f7f8] lg:px-12 lg:text-[#211f24]"><div className="w-full max-w-sm"><div className="mb-10 lg:hidden"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e33b32] font-display text-2xl">E</span><span className="text-sm font-bold">Elite Burger House</span></div></div><div className="mb-8"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ef] text-[#e33b32]"><LockKeyhole size={23} /></div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e33b32]">Acesso administrativo</p><h2 className="text-3xl font-black tracking-tight">Bem-vindo de volta</h2><p className="mt-2 text-sm leading-6 text-[#85828c]">Entre para gerenciar a Elite Burger House.</p></div><form onSubmit={handleSubmit} className="space-y-5"><label className="block"><span className="mb-2 block text-xs font-bold text-current/70">E-mail administrativo</span><input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@exemplo.com" className="h-12 w-full rounded-xl border border-[#dedbe0] bg-white px-4 text-sm text-[#29262d] outline-none transition placeholder:text-[#aaa7b0] focus:border-[#e33b32] focus:ring-4 focus:ring-[#e33b32]/10" /></label><label className="block"><span className="mb-2 block text-xs font-bold text-current/70">Senha</span><div className="relative"><input type={showPassword ? "text" : "password"} required minLength={8} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" className="h-12 w-full rounded-xl border border-[#dedbe0] bg-white px-4 pr-12 text-sm text-[#29262d] outline-none transition placeholder:text-[#aaa7b0] focus:border-[#e33b32] focus:ring-4 focus:ring-[#e33b32]/10" /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#aaa7b0] hover:text-[#29262d]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <div role="alert" className="rounded-xl border border-[#f4c8c5] bg-[#fff0ef] px-4 py-3 text-sm font-semibold text-[#b72f29]">{error}</div>}<button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e33b32] text-sm font-bold text-white shadow-lg shadow-[#e33b32]/15 transition hover:bg-[#c92d25] disabled:cursor-wait disabled:opacity-60">{loading ? "Entrando..." : <>Entrar no painel <ArrowRight size={17} /></>}</button></form><div className="mt-8 flex items-start gap-3 rounded-xl bg-[#f1f7f4] p-4 text-[#34765c]"><ShieldCheck size={18} className="mt-0.5 shrink-0" /><p className="text-xs leading-5">Sua sessão é protegida e expira automaticamente após um período de inatividade.</p></div></div></section></main>;
}