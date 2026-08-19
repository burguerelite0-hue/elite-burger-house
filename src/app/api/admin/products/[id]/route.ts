import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  try { const id = (await params).id; const body = await request.json(); const data: Record<string, unknown> = {}; for (const key of ["name", "description", "ingredients", "image", "available", "featured", "bestSeller", "categoryId", "sortOrder"]) if (key in body) data[key] = body[key]; for (const key of ["price", "promotionalPrice"]) if (key in body) data[key] = body[key] === null || body[key] === "" ? null : Number(body[key]); if ("name" in data) data.slug = String(data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); return NextResponse.json(await prisma.product.update({ where: { id }, data })); } catch { return NextResponse.json({ error: "Não foi possível atualizar o produto." }, { status: 400 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  try { await prisma.product.delete({ where: { id: (await params).id } }); return NextResponse.json({ deleted: true }); } catch { return NextResponse.json({ error: "Não foi possível excluir o produto." }, { status: 400 }); }
}