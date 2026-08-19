import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSession, getSessionCookieOptions, isAuthConfigured } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "Autenticação administrativa não configurada." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
    const passwordHash = process.env.ADMIN_PASSWORD_HASH ?? "";

    if (!email || !password || email.length > 254 || password.length > 256) {
      return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 400 });
    }

    const validCredentials = email === configuredEmail && await compare(password, passwordHash);
    if (!validCredentials) {
      return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
    }

    const token = await createAdminSession({ sub: configuredEmail, email: configuredEmail, role: "ADMIN" });
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Não foi possível processar o login." }, { status: 400 });
  }
}