import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MP_API = "https://api.mercadopago.com";

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno ${name}`);
  return v;
}

export async function POST(req) {
  try {
    const accessToken = mustEnv("MERCADOPAGO_ACCESS_TOKEN");
    const siteUrl = mustEnv("SITE_URL").replace(/\/$/, "");

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId requerido." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada." }, { status: 404 });
    }

    const items = [
      ...order.items.map((it) => ({
        title: it.name,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        currency_id: order.currency,
      })),
    ];

    // Si querés mostrar envío como ítem separado, agregalo
    if (order.shippingCost > 0) {
      items.push({
        title: "Envío",
        quantity: 1,
        unit_price: order.shippingCost,
        currency_id: order.currency,
      });
    }

    const back_urls = {
      success: `${siteUrl}/tienda/confirmacion?orderId=${encodeURIComponent(orderId)}`,
      pending: `${siteUrl}/tienda/confirmacion?orderId=${encodeURIComponent(orderId)}`,
      failure: `${siteUrl}/tienda/confirmacion?orderId=${encodeURIComponent(orderId)}`,
    };

    // Webhook: si tu SITE_URL es público, MP podrá notificarnos (recomendado). :contentReference[oaicite:4]{index=4}
    const isLocal =
      siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");
    const notification_url = isLocal ? undefined : `${siteUrl}/api/webhooks`;

    const preferenceBody = {
      items,
      back_urls,
      auto_return: "approved",
      external_reference: orderId,
      metadata: { orderId },
      ...(notification_url ? { notification_url } : {}),
    };

    const mpRes = await fetch(`${MP_API}/checkout/preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceBody),
    });

    const mpJson = await mpRes.json().catch(() => ({}));
    if (!mpRes.ok) {
      return NextResponse.json(
        { error: "Mercado Pago: no se pudo crear preferencia.", details: mpJson },
        { status: 502 }
      );
    }

    const isTest = String(accessToken).startsWith("TEST-");
    const checkoutUrl =
      (isTest && mpJson.sandbox_init_point) ? mpJson.sandbox_init_point : mpJson.init_point;

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Preferencia creada pero no vino init_point.", details: mpJson },
        { status: 502 }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProvider: "mercadopago",
        paymentStatus: "pending",
        preferenceId: mpJson.id || null,
      },
    });

    return NextResponse.json({ checkoutUrl }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Error iniciando el pago." },
      { status: 500 }
    );
  }
}
