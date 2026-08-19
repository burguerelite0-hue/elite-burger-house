import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function payload(body: Record<string, unknown>) {
  return {
    name: String(body.name ?? "").trim(), slug: String(body.slug ?? body.name ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: String(body.description ?? ""), ingredients: String(body.ingredients ?? ""), image: body.image ? String(body.image) : null,
    price: Number(body.price), promotionalPrice: body.promotionalPrice ? Number(body.promotionalPrice) : null, available: body.available !== false, featured: body.featured === true, bestSeller: body.bestSeller === true,
    categoryId: String(body.categoryId ?? ""), sortOrder: Number(body.sortOrder ?? 0),
  };
}

export async function GET() {
  if (!prisma) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { sortOrder: "asc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  try {
    const data = payload(await request.json());
    if (!data.name || !data.slug || !data.categoryId || !Number.isFinite(data.price)) return NextResponse.json({ error: "Nome, categoria e preço são obrigatórios." }, { status: 400 });
    return NextResponse.json(await prisma.product.create({ data }), { status: 201 });
  } catch { return NextResponse.json({ error: "Não foi possível criar o produto." }, { status: 400 }); }
}