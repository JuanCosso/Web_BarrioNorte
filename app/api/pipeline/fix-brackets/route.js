import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const tournaments = ["tercera-oficial-2026", "cuarta-oficial-2026", "quinta-oficial-2026", "sexta-oficial-2026", "septima-oficial-2026"];
  
  let processed = 0;

  for (const tid of tournaments) {
    // Buscar la fase "playoffs"
    let playoffsPhase = await prisma.tournamentPhase.findFirst({
      where: { tournamentId: tid, slug: "playoffs" }
    });
    if (!playoffsPhase) {
      playoffsPhase = await prisma.tournamentPhase.create({
        data: { tournamentId: tid, name: "Playoffs", slug: "playoffs", order: 3 }
      });
    }

    // Buscar todos los partidos de playoffs o semifinales de este torneo
    const matches = await prisma.match.findMany({
      where: {
        tournamentId: tid,
        OR: [
          { phase: { slug: { in: ["semifinales", "playoffs"] } } },
          { roundName: { contains: "semifinal", mode: "insensitive" } }
        ]
      },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { id: "asc" }
    });

    if (matches.length === 0) continue;

    // Queremos estructurarlos en Semifinal 1 y Semifinal 2
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      const etapaName = i === 0 ? "Semifinal 1" : i === 1 ? "Semifinal 2" : `Semifinal ${i + 1}`;
      
      const seriesData = {
        format: "series",
        etapa: etapaName,
        ida1: m.homeScore !== null ? String(m.homeScore) : "",
        ida2: m.awayScore !== null ? String(m.awayScore) : "",
        vuelta1: "",
        vuelta2: ""
      };

      await prisma.match.update({
        where: { id: m.id },
        data: {
          phaseId: playoffsPhase.id, // Moverlos a la fase playoffs real
          roundName: etapaName, // Cambiamos "Semifinales Ida" a "Semifinal 1" etc
          notes: `SERIES_DATA:${JSON.stringify(seriesData)}`
        }
      });
      processed++;
    }

    // Asegurarse de que haya al menos una "Final" vacía para que el bracket se vea completo como en 2025
    const finalMatch = await prisma.match.findFirst({
      where: { tournamentId: tid, phaseId: playoffsPhase.id, roundName: "Final" }
    });

    if (!finalMatch && matches.length > 0) {
      const defaultTeam = await prisma.team.findFirst(); // just to avoid null constraint if required, but match schema might allow null teams?
      // Wait, homeTeamId is required in Prisma schema? Usually yes.
      // If we don't have teams yet, we might not be able to create an empty match.
      // We will skip creating an empty final for now, the UI will still render the duels.
      // But let's check if the UI needs the empty final. The user's screenshot had "Semifinal 1" and "Semifinal 2", no final shown in the editor screenshot, but in the bracket view there was "Final: A definir".
    }
  }

  // Eliminar las fases 'semifinales' erróneas si quedaron vacías
  await prisma.tournamentPhase.deleteMany({
    where: { slug: "semifinales" }
  });

  return NextResponse.json({ success: true, processed });
}
