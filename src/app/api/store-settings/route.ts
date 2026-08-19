import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() { if (!prisma) return NextResponse.json({ deliveryFee: 7 }); const settings = await prisma.storeSettings.findFirst({ orderBy: { updatedAt: "desc" }, select: { deliveryFee: true } }); return NextResponse.json({ deliveryFee: Number(settings?.deliveryFee ?? 7) }); }