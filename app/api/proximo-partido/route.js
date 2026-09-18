// app/api/proximo-partido/route.js
import { NextResponse } from "next/server";
import fixture from "../../../data/fixture/masculino.json";
import { getNextMatch, formatFlyerData } from "../../../lib/fixture";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Intentar consultar Neon DB
    try {
      const { prisma } = await import("../../../lib/prisma.js");
      const today = new Date();
      // Empezar desde el inicio del día de hoy
      today.setHours(0, 0, 0, 0);

      // Buscar el próximo partido programado donde juegue Barrio Norte
      // 1. Priorizar partidos con status SCHEDULED o POSTPONED con fecha futura
      let nextDbMatch = await prisma.match.findFirst({
        where: {
          OR: [
            { homeTeam: { isLocalClub: true } },
            { awayTeam: { isLocalClub: true } },
            { homeTeam: { name: { contains: "Barrio Norte", mode: "insensitive" } } },
            { awayTeam: { name: { contains: "Barrio Norte", mode: "insensitive" } } },
          ],
          status: { in: ["SCHEDULED", "POSTPONED"] },
          date: { gte: today },
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          tournament: true,
        },
        orderBy: [{ date: "asc" }, { roundNumber: "asc" }],
      });

      // 2. Si no hay ninguno con fecha >= hoy, buscar el primer partido programado en general
      if (!nextDbMatch) {
        nextDbMatch = await prisma.match.findFirst({
          where: {
            OR: [
              { homeTeam: { isLocalClub: true } },
              { awayTeam: { isLocalClub: true } },
            ],
            status: { in: ["SCHEDULED", "POSTPONED"] },
          },
          include: {
            homeTeam: true,
            awayTeam: true,
            tournament: true,
          },
          orderBy: [{ date: "asc" }, { roundNumber: "asc" }],
        });
      }

      if (nextDbMatch) {
        const isHome = nextDbMatch.homeTeam.isLocalClub;

        let hora = "A confirmar";
        if (nextDbMatch.notes && nextDbMatch.notes.includes("HORA:")) {
          const matchH = nextDbMatch.notes.match(/HORA:\s*([^|\n\r]+)/);
          if (matchH) hora = matchH[1].trim();
        }

        const fechaFormatted = nextDbMatch.date
          ? new Intl.DateTimeFormat("en-CA", {
              timeZone: "America/Argentina/Buenos_Aires",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(nextDbMatch.date)
          : nextDbMatch.rawDate;

        const flyerData = {
          round: nextDbMatch.roundName || (nextDbMatch.roundNumber ? `Fecha ${nextDbMatch.roundNumber}` : ""),
          localName: nextDbMatch.homeTeam.shortName || nextDbMatch.homeTeam.name,
          visitanteName: nextDbMatch.awayTeam.shortName || nextDbMatch.awayTeam.name,
          stadium: nextDbMatch.stadium || (isHome ? "Estadio Pocha Badaracco" : "A confirmar"),
          fecha: fechaFormatted,
          hora,
          localShield: nextDbMatch.homeTeam.logoUrl || "/escudos/BarrioNorte_V1.png",
          visitanteShield: nextDbMatch.awayTeam.logoUrl || "/escudos/BarrioNorte_V1.png",
          competition: nextDbMatch.competition || nextDbMatch.tournament?.name || "Torneo Oficial",
          fromDb: true,
        };

        return NextResponse.json({ flyerData });
      }
    } catch (dbErr) {
      console.warn("Aviso al consultar próximo partido en Neon:", dbErr.message);
    }

    // 2. Fallback a fixture local en JSON
    const localNext = getNextMatch(fixture, new Date());
    const flyerData = formatFlyerData(localNext);

    return NextResponse.json({ flyerData, fromDb: false });
  } catch (error) {
    console.error("Error en api/proximo-partido:", error);
    const localNext = getNextMatch(fixture, new Date());
    return NextResponse.json({ flyerData: formatFlyerData(localNext), fromDb: false });
  }
}
