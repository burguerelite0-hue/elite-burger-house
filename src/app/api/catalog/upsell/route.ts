import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  if (!prisma) return NextResponse.json(null);
  const mainProductId = new URL(request.url).searchParams.get("mainProductId");
  if (!mainProductId) return NextResponse.json(null);
  const offer = await prisma.upsellOffer.findFirst({ where: { mainProductId, active: true, offeredProduct: { available: true } }, include: { offeredProduct: true }, orderBy: { updatedAt: "desc" } });
  if (!offer) return NextResponse.json(null);
  return NextResponse.json({ ...offer, specialPrice: offer.specialPrice.toString(), offeredProduct: { ...offer.offeredProduct, price: offer.offeredProduct.price.toString(), promotionalPrice: offer.offeredProduct.promotionalPrice?.toString() ?? null } });
}