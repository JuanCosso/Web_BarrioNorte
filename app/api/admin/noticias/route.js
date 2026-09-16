// app/api/admin/noticias/route.js
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80);
}

// 1. OBTENER NOTICIAS
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";

    const where = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    return NextResponse.json(
      { error: "Error al consultar noticias", details: error.message },
      { status: 500 }
    );
  }
}

// 2. CREAR NOTICIA
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      summary,
      content,
      category = "Fútbol",
      tags = [],
      featured = false,
      imageUrl,
      source,
      sourceUrl,
      publishedAt,
    } = body;

    if (!title || !summary) {
      return NextResponse.json(
        { error: "El título y el copete son obligatorios." },
        { status: 400 }
      );
    }

    let slug = body.slug ? generateSlug(body.slug) : generateSlug(title);
    // Verificar colisión de slug
    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const created = await prisma.news.create({
      data: {
        title,
        slug,
        summary,
        content: content || "",
        category,
        tags: Array.isArray(tags) ? tags : [],
        featured: Boolean(featured),
        imageUrl: imageUrl || "/inicio/Proximo-Partido-Fondo.png",
        source: source || "Oficial CABN",
        sourceUrl: sourceUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/noticias");
      revalidatePath(`/noticias/${created.slug}`);
    } catch (revalErr) {
      console.warn("Aviso revalidación:", revalErr.message);
    }

    return NextResponse.json({ success: true, news: created });
  } catch (error) {
    console.error("Error al crear noticia:", error);
    return NextResponse.json(
      { error: "Error al guardar noticia", details: error.message },
      { status: 500 }
    );
  }
}

// 3. ACTUALIZAR NOTICIA
export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      summary,
      content,
      category,
      tags,
      featured,
      imageUrl,
      source,
      sourceUrl,
      publishedAt,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID de la noticia a modificar." },
        { status: 400 }
      );
    }

    const updated = await prisma.news.update({
      where: { id: parseInt(id, 10) },
      data: {
        title: title || undefined,
        slug: slug ? generateSlug(slug) : undefined,
        summary: summary || undefined,
        content: content !== undefined ? content : undefined,
        category: category || undefined,
        tags: Array.isArray(tags) ? tags : undefined,
        featured: featured !== undefined ? Boolean(featured) : undefined,
        imageUrl: imageUrl || undefined,
        source: source !== undefined ? source : undefined,
        sourceUrl: sourceUrl !== undefined ? sourceUrl : undefined,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/noticias");
      revalidatePath(`/noticias/${updated.slug}`);
    } catch (revalErr) {
      console.warn("Aviso revalidación:", revalErr.message);
    }

    return NextResponse.json({ success: true, news: updated });
  } catch (error) {
    console.error("Error al modificar noticia:", error);
    return NextResponse.json(
      { error: "Error al actualizar noticia", details: error.message },
      { status: 500 }
    );
  }
}

// 4. ELIMINAR NOTICIA
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID de la noticia a eliminar." },
        { status: 400 }
      );
    }

    const deleted = await prisma.news.delete({
      where: { id: parseInt(id, 10) },
    });

    try {
      revalidatePath("/");
      revalidatePath("/noticias");
    } catch (revalErr) {
      console.warn("Aviso revalidación:", revalErr.message);
    }

    return NextResponse.json({ success: true, deletedId: deleted.id });
  } catch (error) {
    console.error("Error al eliminar noticia:", error);
    return NextResponse.json(
      { error: "Error al eliminar noticia", details: error.message },
      { status: 500 }
    );
  }
}
