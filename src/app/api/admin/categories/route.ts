import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!prisma) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  return NextResponse.json(await prisma.category.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  try { const body = await request.json(); const name = String(body.name ?? "").trim(); const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); if (!name) return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 }); return NextResponse.json(await prisma.category.create({ data: { name, slug, image: body.image ? String(body.image) : null, active: body.active !== false, sortOrder: Number(body.sortOrder ?? 0) } }), { status: 201 }); } catch { return NextResponse.json({ error: "Não foi possível criar a categoria." }, { status: 400 }); }
}