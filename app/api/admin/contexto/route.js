// app/api/admin/contexto/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [teams, tournaments] = await Promise.all([
      prisma.team.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.tournament.findMany({
        include: {
          phases: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: [{ seasonId: "desc" }, { name: "asc" }],
      }),
    ]);

    // Asegurar que torneos de inferiores y 2021 expongan la fase "finales"
    const enhancedTournaments = tournaments.map((t) => {
      const isInferiores =
        t.id.includes("cuarta") ||
        t.id.includes("quinta") ||
        t.id.includes("sexta") ||
        t.id.includes("septima") ||
        t.id.includes("tercera") ||
        t.id.includes("cat_");

      const hasFinales = t.phases.some(
        (p) => p.slug === "finales" || p.slug === "playoffs" || p.slug.includes("final")
      );

      const phases = [...t.phases];
      if (isInferiores && !hasFinales) {
        phases.push({
          id: `fase-finales-${t.id}`,
          tournamentId: t.id,
          name: "Finales (Semis y Final)",
          slug: "finales",
          order: 2,
        });
      } else if (t.id === "oficial-2021-22" && !hasFinales) {
        phases.push({
          id: `fase-finales-${t.id}`,
          tournamentId: t.id,
          name: "Playoffs / Fases Finales",
          slug: "finales",
          order: 2,
        });
      }

      return { ...t, phases };
    });

    return NextResponse.json({ teams, tournaments: enhancedTournaments });
  } catch (error) {
    console.error("Error cargando contexto admin:", error);
    return NextResponse.json(
      { error: "Error cargando contexto", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { tournamentId, name, slug, order } = body;

    if (!tournamentId || !name) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (tournamentId, name)" },
        { status: 400 }
      );
    }

    const cleanSlug =
      slug ||
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const newPhase = await prisma.tournamentPhase.create({
      data: {
        tournamentId,
        name,
        slug: cleanSlug,
        order: parseInt(order, 10) || 1,
      },
    });

    return NextResponse.json({ success: true, phase: newPhase });
  } catch (error) {
    console.error("Error creando fase:", error);
    return NextResponse.json(
      { error: "Error creando fase", details: error.message },
      { status: 500 }
    );
  }
}
