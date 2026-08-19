import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateCouponDiscount, couponError } from "@/lib/coupon";

const paymentMethods = new Set(["PIX", "CASH", "CREDIT_CARD"]);
const asMoney = (value: unknown) => Number(value) || 0;

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const neighborhood = String(body.neighborhood ?? "").trim();
    const number = String(body.number ?? "").trim();
    const paymentMethod = String(body.paymentMethod ?? "");
    if (!name || !phone || !address || !neighborhood || !number || !paymentMethods.has(paymentMethod) || items.length === 0) return NextResponse.json({ error: "Preencha os dados obrigatórios e adicione produtos." }, { status: 400 });
    if (paymentMethod === "CASH" && asMoney(body.changeFor) < 0) return NextResponse.json({ error: "Informe um valor válido para o troco." }, { status: 400 });

    const order = await prisma.$transaction(async (transaction) => {
      const productIds = items.map((item: { productId?: string }) => String(item.productId));
      const products = await transaction.product.findMany({ where: { id: { in: productIds }, available: true } });
      const productMap = new Map(products.map((product) => [product.id, product]));
      const orderItems: Array<{ productId: string; productName: string; unitPrice: number; quantity: number; total: number }> = items.map((item: { productId?: string; quantity?: number }) => { const product = productMap.get(String(item.productId)); const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1)); if (!product) throw new Error("PRODUCT_UNAVAILABLE"); const unitPrice = Number((product.promotionalPrice ?? product.price).toString()); return { productId: product.id, productName: product.name, unitPrice, quantity, total: unitPrice * quantity }; });
      const subtotal = orderItems.reduce((total, item) => total + item.total, 0);
      const settings = await transaction.storeSettings.findFirst({ orderBy: { updatedAt: "desc" } });
      const deliveryFee = settings?.deliveryFee ?? 7;
      const couponCode = String(body.couponCode ?? "").trim().toUpperCase();
      const coupon = couponCode ? await transaction.coupon.findUnique({ where: { code: couponCode } }) : null;
      if (couponCode && !coupon) throw new Error("COUPON_NOT_FOUND");
      const couponValidation = coupon ? couponError(coupon, subtotal) : null;
      if (couponValidation) throw new Error(`COUPON:${couponValidation}`);
      const discount = coupon ? calculateCouponDiscount(coupon.type, Number(coupon.value), subtotal) : 0;
      const total = subtotal + Number(deliveryFee) - discount;
      const customer = await transaction.customer.upsert({ where: { phone }, update: { name, address, neighborhood, number, complement: body.complement ? String(body.complement) : null, totalOrders: { increment: 1 }, totalSpent: { increment: total } }, create: { name, phone, address, neighborhood, number, complement: body.complement ? String(body.complement) : null, totalOrders: 1, totalSpent: total } });
      const count = await transaction.order.count();
      if (coupon) { if (coupon.usageLimit !== null) { const updated = await transaction.coupon.updateMany({ where: { id: coupon.id, usageCount: { lt: coupon.usageLimit } }, data: { usageCount: { increment: 1 } } }); if (updated.count !== 1) throw new Error("COUPON_LIMIT"); } else await transaction.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } }); }
      const createdOrder = await transaction.order.create({ data: { orderNumber: `EBH-${String(count + 1).padStart(5, "0")}`, customerId: customer.id, subtotal, discount, couponId: coupon?.id ?? null, deliveryFee, total, paymentMethod: paymentMethod as "PIX" | "CASH" | "CREDIT_CARD", changeFor: paymentMethod === "CASH" ? asMoney(body.changeFor) : null, address, neighborhood, number, complement: body.complement ? String(body.complement) : null, notes: body.notes ? String(body.notes) : null, items: { create: orderItems } }, select: { id: true, orderNumber: true, total: true, status: true } });
      if (coupon) await transaction.couponUsage.create({ data: { couponId: coupon.id, customerId: customer.id, orderId: createdOrder.id, discount } });
      return createdOrder;
    });
    return NextResponse.json({ orderNumber: order.orderNumber, total: order.total.toString(), status: order.status }, { status: 201 });
  } catch (error) { const message = error instanceof Error ? error.message : ""; const errorMessage = message === "PRODUCT_UNAVAILABLE" ? "Um dos produtos ficou indisponível." : message === "COUPON_NOT_FOUND" ? "Cupom não encontrado." : message.startsWith("COUPON:") ? message.slice(7) : message === "COUPON_LIMIT" ? "Limite de utilização atingido." : "Não foi possível criar o pedido."; return NextResponse.json({ error: errorMessage }, { status: 400 }); }
}