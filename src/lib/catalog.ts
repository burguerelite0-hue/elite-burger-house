import { prisma } from "@/lib/prisma";

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string;
  image: string | null;
  price: string;
  promotionalPrice: string | null;
  available: boolean;
  featured: boolean;
  bestSeller: boolean;
  category: { id: string; name: string; slug: string };
};

export async function getCatalog() {
  if (!prisma) return { categories: [], products: [] as PublicProduct[] };

  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({ where: { category: { active: true } }, include: { category: true }, orderBy: [{ featured: "desc" }, { bestSeller: "desc" }, { sortOrder: "asc" }] }),
    ]);

    return {
      categories,
      products: products.map((product) => ({
        ...product,
        price: product.price.toString(),
        promotionalPrice: product.promotionalPrice?.toString() ?? null,
        category: { id: product.category.id, name: product.category.name, slug: product.category.slug },
      })),
    };
  } catch {
    return { categories: [], products: [] as PublicProduct[] };
  }
}