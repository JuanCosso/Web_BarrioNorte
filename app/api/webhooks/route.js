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

    const url = new URL(req.url);
    const qsType = url.searchParams.get("type") || url.searchParams.get("topic");
    const qsId = url.searchParams.get("data.id") || url.searchParams.get("id");

    let body = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const bodyType = body?.type || body?.topic;
    const bodyId = body?.data?.id || body?.id;

    const type = qsType || bodyType;
    const paymentId = qsId || bodyId;

    // Nos enfocamos en pagos.
    if (type !== "payment" || !paymentId) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Consultar detalles del pago por ID. :contentReference[oaicite:7]{index=7}
    const payRes = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const payment = await payRes.json().catch(() => ({}));
    if (!payRes.ok) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const status = payment?.status; // approved | pending | rejected | etc
    const orderId = payment?.external_reference; // lo pusimos = orderId

    if (!orderId) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const newOrderStatus =
      status === "approved" ? "paid" :
      status === "rejected" ? "cancelled" :
      "draft";

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: status || null,
        paymentId: String(paymentId),
        status: newOrderStatus,
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // MP reintenta si no recibe 200; devolvemos ok para no bloquearte.
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
