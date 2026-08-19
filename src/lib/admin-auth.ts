import { jwtVerify, SignJWT } from "jose";

export const ADMIN_SESSION_COOKIE = "elite_admin_session";
const SESSION_DURATION = "8h";

export type AdminSession = {
  sub: string;
  email: string;
  role: "ADMIN";
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  return secret ? new TextEncoder().encode(secret) : null;
}

export function isAuthConfigured() {
  return Boolean(process.env.AUTH_SECRET && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH);
}

export async function createAdminSession(session: AdminSession) {
  const secret = getSecret();
  if (!secret) throw new Error("AUTH_NOT_CONFIGURED");

  return new SignJWT({ email: session.email, role: session.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(secret);
}

export async function verifyAdminSession(token?: string | null): Promise<AdminSession | null> {
  const secret = getSecret();
  if (!secret || !token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string" || payload.role !== "ADMIN") return null;
    return { sub: payload.sub, email: payload.email, role: "ADMIN" };
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}