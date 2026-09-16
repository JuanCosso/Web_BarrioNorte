// app/api/admin/posiciones/calcular-desde-partidos/route.js
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { tournamentId, phaseId } = await req.json();

    if (!tournamentId || !phaseId) {
      return NextResponse.json(
        { error: "Se requiere tournamentId y phaseId." },
        { status: 400 }
      );
    }

    // 1. Obtener todos los partidos finalizados de esta fase
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

    if (matches.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron partidos finalizados para esta fase." },
        { status: 400 }
      );
    }

    // 2. Calcular estadísticas por equipo
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

    // Calcular DG y obtener ajustes de puntos previos si existían
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

    // 3. Ordenar por Pts > DG > GF > PG
    computedList.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg !== a.dg) return b.dg - a.dg;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return b.pg - a.pg;
    });

    // 4. Guardar en Neon DB
    const updatedRows = [];
    for (let i = 0; i < computedList.length; i++) {
      const row = computedList[i];
      const position = i + 1;

      const updated = await prisma.standingRow.upsert({
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
        include: {
          team: true,
        },
      });
      updatedRows.push(updated);
    }

    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/futbol/primera");
      revalidatePath("/futbol/femenino");
    } catch (e) {
      console.warn("Aviso en revalidación:", e.message);
    }

    return NextResponse.json({
      success: true,
      matchesProcessed: matches.length,
      teamsUpdated: updatedRows.length,
      rows: updatedRows,
    });
  } catch (error) {
    console.error("Error al sincronizar tabla desde partidos:", error);
    return NextResponse.json(
      { error: "Error al sincronizar tabla", details: error.message },
      { status: 500 }
    );
  }
}
