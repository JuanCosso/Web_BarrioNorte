import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// Recalcular posiciones automáticamente tras insertar o actualizar partidos
async function recalcularPosiciones(tournamentId, phaseId) {
  if (!tournamentId || !phaseId) return;
  try {
    const matches = await prisma.match.findMany({
      where: {
        tournamentId,
        phaseId,
        status: "FINISHED",
        homeScore: { not: null },
        awayScore: { not: null },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (matches.length === 0) return;

    const statsByTeam = new Map();
    const getOrCreate = (team) => {
      if (!statsByTeam.has(team.id)) {
        statsByTeam.set(team.id, {
          teamId: team.id,
          teamName: team.name,
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dg: 0,
          pts: 0,
          pointAdjustment: 0,
        });
      }
      return statsByTeam.get(team.id);
    };

    for (const m of matches) {
      const home = getOrCreate(m.homeTeam);
      const away = getOrCreate(m.awayTeam);

      const hG = m.homeScore ?? 0;
      const aG = m.awayScore ?? 0;

      home.pj++;
      away.pj++;
      home.gf += hG;
      home.gc += aG;
      away.gf += aG;
      away.gc += hG;

      if (hG > aG) {
        home.pg++;
        home.pts += 3;
        away.pp++;
      } else if (hG < aG) {
        away.pg++;
        away.pts += 3;
        home.pp++;
      } else {
        home.pe++;
        home.pts += 1;
        away.pe++;
        away.pts += 1;
      }
    }

    const existingRows = await prisma.standingRow.findMany({
      where: { phaseId },
    });
    const adjustmentMap = new Map(existingRows.map((r) => [r.teamId, r.pointAdjustment || 0]));

    const computedList = Array.from(statsByTeam.values()).map((row) => {
      const adj = adjustmentMap.get(row.teamId) || 0;
      return {
        ...row,
        dg: row.gf - row.gc,
        pts: row.pts + adj,
        pointAdjustment: adj,
      };
    });

    computedList.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg !== a.dg) return b.dg - a.dg;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return b.pg - a.pg;
    });

    for (let i = 0; i < computedList.length; i++) {
      const row = computedList[i];
      const position = i + 1;

      await prisma.standingRow.upsert({
        where: {
          phaseId_teamId: {
            phaseId,
            teamId: row.teamId,
          },
        },
        update: {
          pj: row.pj,
          pg: row.pg,
          pe: row.pe,
          pp: row.pp,
          gf: row.gf,
          gc: row.gc,
          dg: row.dg,
          pts: row.pts,
          position,
        },
        create: {
          phaseId,
          teamId: row.teamId,
          pj: row.pj,
          pg: row.pg,
          pe: row.pe,
          pp: row.pp,
          gf: row.gf,
          gc: row.gc,
          dg: row.dg,
          pts: row.pts,
          position,
        },
      });
    }
  } catch (err) {
    console.warn("Aviso al recalcular posiciones desde webhook:", err.message);
  }
}

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

    if (!phaseId) {
      const defaultPhase = await prisma.tournamentPhase.findFirst({
        where: { tournamentId },
        orderBy: { order: "asc" }
      });
      if (defaultPhase) phaseId = defaultPhase.id;
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

    const isKnockout = phaseSlug && (phaseSlug.includes("playoff") || phaseSlug.includes("petit") || phaseSlug.includes("final"));

    // 1. Guardar en Prisma (Fase Regular y Base de Datos General)
    for (const p of partidos) {
      const homeId = findTeamId(p.local.equipo);
      const awayId = findTeamId(p.visitante.equipo);

      if (!homeId || !awayId) {
        results.push({ match: `${p.local.equipo} vs ${p.visitante.equipo}`, status: "SKIPPED_TEAM_NOT_FOUND" });
        continue;
      }

      // Si es fase de eliminación, forzamos formato ida y vuelta
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
            notes: notesData || existingMatch.notes
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
            notes: notesData
          }
        });
        results.push({ match: newMatch.id, status: "CREATED" });
      }
    }

    // Si es fase regular o de puntos, recalcular tabla de posiciones automáticamente
    if (phaseId && !isKnockout) {
      await recalcularPosiciones(tournamentId, phaseId);
    }

    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/admin");
    } catch (e) {}

    return NextResponse.json({ success: true, results, standingsRecalculated: Boolean(phaseId && !isKnockout) });

  } catch (error) {
    console.error("Error webhook partidos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
