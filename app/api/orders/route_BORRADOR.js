import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, STORE } from "@/components/tienda/catalogo/catalogo.data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function toIntPrice(v) {
  // Prisma schema: Int. Aseguramos entero válido.
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  if (typeof v === "string") {
    const digits = v.replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  }
  return 0;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const buyer = body?.buyer || {};
    const delivery = body?.delivery === "envio" ? "envio" : "retiro";
    const currency = STORE?.currency || "ARS";

    if (!buyer?.fullName || !buyer?.phone) {
      return NextResponse.json(
        { error: "Faltan datos: buyer.fullName y buyer.phone." },
        { status: 400 }
      );
    }

    const rawItems = Array.isArray(body?.items) ? body.items : [];
    if (!rawItems.length) {
      return NextResponse.json({ error: "Carrito vacío." }, { status: 400 });
    }

    const itemsNormalized = rawItems.map((it) => ({
      productId: it.productId,
      qty: Number(it.qty ?? it.quantity ?? 1),
      variant: it.variant ?? null,
    }));

    const itemsToCreate = [];
    let subtotal = 0;

    for (const it of itemsNormalized) {
      const p = getProductById(it.productId);
      if (!p) {
        return NextResponse.json(
          { error: `Producto inexistente: ${it.productId}` },
          { status: 400 }
        );
      }

      const quantity = Math.max(1, it.qty || 1);
      const unitPrice = toIntPrice(p.price);

      subtotal += unitPrice * quantity;

      itemsToCreate.push({
        productId: p.id,
        name: p.name,
        unitPrice,
        quantity,
        variantJson: it.variant ? JSON.stringify(it.variant) : null,
      });
    }

    const shippingCost = delivery === "envio" ? 4500 : 0;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        buyerName: buyer.fullName,
        buyerPhone: buyer.phone,
        buyerEmail: buyer.email || null,
        delivery,
        currency,
        subtotal,
        shippingCost,
        total,
        status: "draft",
        items: { create: itemsToCreate },
      },
      select: { id: true },
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (e) {
    console.error("[orders] error:", e);
    return NextResponse.json(
      { error: e?.message || "Error creando la orden." },
      { status: 500 }
    );
  }
}
