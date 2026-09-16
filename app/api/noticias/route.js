import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import fallbackNoticias from "../../../data/noticias.json";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbNews = await prisma.news.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });

    if (dbNews.length > 0) {
      const noticias = dbNews.map((n) => ({
        id: n.id,
        titulo: n.title,
        resumen: n.summary,
        fecha: n.publishedAt.toISOString().split("T")[0],
        categoria: n.category,
        tags: n.tags,
        destacada: n.featured,
        imagen: n.imageUrl,
        fuente: n.source,
        url: n.sourceUrl,
      }));
      return NextResponse.json({ noticias, fromDb: true });
    }
  } catch (err) {
    console.warn("Aviso al consultar noticias en Neon:", err.message);
  }

  return NextResponse.json({ noticias: fallbackNoticias, fromDb: false });
}
