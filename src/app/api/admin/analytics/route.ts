import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const toDate = (value: string | null, fallback: Date) => { if (!value) return fallback; const date = new Date(`${value}T00:00:00`); return Number.isNaN(date.getTime()) ? fallback : date; };
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const formatMoney = (value: number) => Number(value.toFixed(2));

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const now = new Date();
  const period = params.get("period") ?? "30d";
  let start = startOfDay(now);
  if (period === "today") start = startOfDay(now);
  else if (period === "7d") start.setDate(start.getDate() - 6);
  else if (period === "30d") start.setDate(start.getDate() - 29);
  else if (period === "month") start = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (period === "custom") start = toDate(params.get("start"), start);
  const end = period === "custom" ? new Date(`${params.get("end") ?? params.get("start")}T23:59:59.999`) : new Date(now.getTime());
  if (!prisma) return NextResponse.json(emptyAnalytics(start, end));

  try {
    const orders = await prisma.order.findMany({ where: { createdAt: { gte: start, lte: end } }, include: { items: { include: { product: { include: { category: true } } } }, customer: true, coupon: true }, orderBy: { createdAt: "asc" } });
    const metricOrders = orders.filter((order) => order.status !== "CANCELLED");
    const revenue = metricOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const products = new Map<string, { name: string; quantity: number; revenue: number }>();
    const categories = new Map<string, { name: string; quantity: number; revenue: number }>();
    const coupons = new Map<string, { code: string; uses: number; discount: number; revenue: number }>();
    const customers = new Map<string, { name: string; orders: number; revenue: number }>();
    const statuses = new Map<string, number>();
    const daily = new Map<string, { date: string; revenue: number; orders: number }>();
    for (const order of metricOrders) {
      const dayKey = order.createdAt.toISOString().slice(0, 10); const day = daily.get(dayKey) ?? { date: dayKey, revenue: 0, orders: 0 }; day.revenue += Number(order.total); day.orders += 1; daily.set(dayKey, day);
      statuses.set(order.status, (statuses.get(order.status) ?? 0) + 1);
      if (order.customer) { const current = customers.get(order.customer.id) ?? { name: order.customer.name, orders: 0, revenue: 0 }; current.orders += 1; current.revenue += Number(order.total); customers.set(order.customer.id, current); }
      if (order.coupon) { const current = coupons.get(order.coupon.id) ?? { code: order.coupon.code, uses: 0, discount: 0, revenue: 0 }; current.uses += 1; current.discount += Number(order.discount); current.revenue += Number(order.total); coupons.set(order.coupon.id, current); }
      for (const item of order.items) { const product = products.get(item.productId) ?? { name: item.productName, quantity: 0, revenue: 0 }; product.quantity += item.quantity; product.revenue += Number(item.total); products.set(item.productId, product); const category = categories.get(item.product.categoryId) ?? { name: item.product.category.name, quantity: 0, revenue: 0 }; category.quantity += item.quantity; category.revenue += Number(item.total); categories.set(item.product.categoryId, category); }
    }
    return NextResponse.json({ period: { start: start.toISOString(), end: end.toISOString() }, summary: { revenue: formatMoney(revenue), orders: metricOrders.length, averageTicket: formatMoney(metricOrders.length ? revenue / metricOrders.length : 0), productsSold: metricOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0), couponsUsed: [...coupons.values()].reduce((sum, coupon) => sum + coupon.uses, 0), totalDiscount: formatMoney(metricOrders.reduce((sum, order) => sum + Number(order.discount), 0)) }, salesByDay: [...daily.values()].map((item) => ({ ...item, revenue: formatMoney(item.revenue) })), products: [...products.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 8).map((item) => ({ ...item, revenue: formatMoney(item.revenue) })), categories: [...categories.values()].sort((a, b) => b.quantity - a.quantity).map((item) => ({ ...item, revenue: formatMoney(item.revenue) })), coupons: [...coupons.values()].sort((a, b) => b.uses - a.uses).map((item) => ({ ...item, revenue: formatMoney(item.revenue), discount: formatMoney(item.discount) })), customers: [...customers.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8).map((item) => ({ ...item, revenue: formatMoney(item.revenue) })), statuses: [...statuses.entries()].map(([status, count]) => ({ status, count })) });
  } catch { return NextResponse.json({ error: "Não foi possível carregar os analytics." }, { status: 503 }); }
}

function emptyAnalytics(start: Date, end: Date) { return { period: { start: start.toISOString(), end: end.toISOString() }, summary: { revenue: 0, orders: 0, averageTicket: 0, productsSold: 0, couponsUsed: 0, totalDiscount: 0 }, salesByDay: [], products: [], categories: [], coupons: [], customers: [], statuses: [] }; }
