import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getSessionCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { ...getSessionCookieOptions(), maxAge: 0 });
  return response;
}