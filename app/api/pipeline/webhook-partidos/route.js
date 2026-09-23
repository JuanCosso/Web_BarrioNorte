import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    let { tournamentId, phaseSlug, roundName, roundNumber, partidos } = body;

    if (!tournamentId || !partidos || !Array.isArray(partidos)) {
      return NextResponse.json({ error: "Faltan datos obligatorios (tournamentId, partidos)" }, { status: 400 });
    }

    // Mapeo dinámico: Si Node-RED envía 'semifinales' pero la BD usa 'playoffs', lo adaptamos.
    if (phaseSlug === "semifinales") {
      phaseSlug = "playoffs";
    }

    // Buscar Phase ID en base al slug y tournament
    let phaseId = null;
    if (phaseSlug) {
      const phase = await prisma.tournamentPhase.findFirst({
        where: { tournamentId, slug: phaseSlug }
      });
      if (phase) phaseId = phase.id;
    }

    const results = [];

    // Cargar todos los equipos para mapear por alias
    const allTeams = await prisma.team.findMany();
    const findTeamId = (name) => {
      const norm = name.toLowerCase().trim();
      const team = allTeams.find(t => 
        t.name.toLowerCase() === norm || 
        t.shortName.toLowerCase() === norm ||
        t.aliases.some(a => a.toLowerCase() === norm)
      );
      return team ? team.id : null;
    };

    // 1. Guardar en Prisma (Fase Regular y Base de Datos General)
    for (const p of partidos) {
      const homeId = findTeamId(p.local.equipo);
      const awayId = findTeamId(p.visitante.equipo);

      if (!homeId || !awayId) {
        results.push({ match: `${p.local.equipo} vs ${p.visitante.equipo}`, status: "SKIPPED_TEAM_NOT_FOUND" });
        continue;
      }

      // Si es fase de eliminación, forzamos formato ida y vuelta
      const isKnockout = phaseSlug && (phaseSlug.includes("playoff") || phaseSlug.includes("petit") || phaseSlug.includes("final"));
      let notesData = undefined;
      
      if (isKnockout) {
        const seriesData = {
          format: "series",
          etapa: roundName || "Semifinal",
          ida1: p.local.goles !== null ? String(p.local.goles) : "",
          ida2: p.visitante.goles !== null ? String(p.visitante.goles) : "",
          vuelta1: "",
          vuelta2: ""
        };
        notesData = `SERIES_DATA:${JSON.stringify(seriesData)}`;
      }

      const existingMatch = await prisma.match.findFirst({
        where: {
          tournamentId,
          phaseId: phaseId || undefined,
          homeTeamId: homeId,
          awayTeamId: awayId,
          roundNumber: roundNumber || undefined
        }
      });

      if (existingMatch) {
        await prisma.match.update({
          where: { id: existingMatch.id },
          data: {
            homeScore: p.local.goles !== null ? parseInt(p.local.goles, 10) : existingMatch.homeScore,
            awayScore: p.visitante.goles !== null ? parseInt(p.visitante.goles, 10) : existingMatch.awayScore,
            notes: notesData || existingMatch.notes // Actualizamos las notas si es knockout
          }
        });
        results.push({ match: existingMatch.id, status: "UPDATED" });
      } else {
        const newMatch = await prisma.match.create({
          data: {
            tournamentId,
            phaseId,
            roundName: roundName || "Fecha",
            roundNumber: roundNumber || null,
            homeTeamId: homeId,
            awayTeamId: awayId,
            homeScore: p.local.goles !== null ? parseInt(p.local.goles, 10) : null,
            awayScore: p.visitante.goles !== null ? parseInt(p.visitante.goles, 10) : null,
            status: (p.local.goles !== null && p.visitante.goles !== null) ? "FINISHED" : "SCHEDULED",
            notes: notesData // Inyectamos el formato de cruces directamente en la base de datos
          }
        });
        results.push({ match: newMatch.id, status: "CREATED" });
      }
    // (Bloque de sincronización JSON eliminado: /api/admin/cruces ya lee desde Prisma dinámicamente)

    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/admin");
    } catch (e) {}

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error("Error webhook partidos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
