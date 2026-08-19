import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.split(";").find((item) => item.trim().startsWith(`${ADMIN_SESSION_COOKIE}=`))?.split("=").slice(1).join("=");
  const session = await verifyAdminSession(token);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, user: { email: session.email, role: session.role } });
}