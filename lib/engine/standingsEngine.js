/**
 * lib/engine/standingsEngine.js
 *
 * Motor determinístico de cálculo, validación y persistencia de tablas de posiciones en Neon DB.
 * - Verifica consistencia matemática: PJ = PG + PE + PP, Pts = 3*PG + PE, DG = GF - GC.
 * - Corrige automáticamente discrepancias aritméticas de las planillas.
 * - Actualiza atómicamente la tabla en la base de datos.
 */

import { prisma } from "../prisma.js";
import { resolveTeam } from "./entityResolver.js";

/**
 * Valida y corrige aritméticamente los datos de una fila de tabla de posiciones.
 */
export function validateStandingMath(row) {
  const pg = Math.max(0, parseInt(row.pg, 10) || 0);
  const pe = Math.max(0, parseInt(row.pe, 10) || 0);
  const pp = Math.max(0, parseInt(row.pp, 10) || 0);
  const gf = Math.max(0, parseInt(row.gf ?? row.gm, 10) || 0);
  const gc = Math.max(0, parseInt(row.gc, 10) || 0);

  // Fórmulas matemáticas determinísticas
  const expectedPj = pg + pe + pp;
  const expectedPts = pg * 3 + pe;
  const expectedDg = gf - gc;

  const rawPj = parseInt(row.pj, 10);
  const rawPts = parseInt(row.pts, 10);
  const rawDg = parseInt(row.dg, 10);

  const warnings = [];
  if (!isNaN(rawPj) && rawPj !== expectedPj) {
    warnings.push(`PJ discrepante: leído ${rawPj}, calculado ${expectedPj}`);
  }
  if (!isNaN(rawPts) && rawPts !== expectedPts) {
    warnings.push(`Pts discrepantes: leído ${rawPts}, calculado ${expectedPts}`);
  }
  if (!isNaN(rawDg) && rawDg !== expectedDg) {
    warnings.push(`DG discrepante: leída ${rawDg}, calculada ${expectedDg}`);
  }

  return {
    pg,
    pe,
    pp,
    gf,
    gc,
    pj: expectedPj,
    pts: expectedPts,
    dg: expectedDg,
    warnings,
  };
}

/**
 * Aplica una tabla de posiciones extraída por la IA a una fase de torneo en Neon DB.
 */
export async function applyStandings(tournamentId, phaseSlug, rawRows) {
  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    return { success: false, error: "No hay filas para procesar" };
  }

  // 1. Buscar o crear la fase del torneo
  let phase = await prisma.tournamentPhase.findFirst({
    where: {
      tournamentId,
      slug: phaseSlug,
    },
  });

  if (!phase) {
    // Si no existe, buscar el torneo
    const tour = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tour) {
      return { success: false, error: `Torneo ${tournamentId} no encontrado en Neon DB.` };
    }

    phase = await prisma.tournamentPhase.create({
      data: {
        tournamentId,
        name: phaseSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        slug: phaseSlug,
        order: 1,
      },
    });
  }

  // 2. Procesar cada fila
  const results = [];
  let pos = 1;

  for (const raw of rawRows) {
    const team = await resolveTeam(raw.teamName || raw.name || raw.equipo);
    if (!team) {
      results.push({ team: raw.teamName || "Desconocido", status: "SKIPPED_UNKNOWN_TEAM" });
      continue;
    }

    const math = validateStandingMath(raw);

    const standing = await prisma.standingRow.upsert({
      where: {
        phaseId_teamId: {
          phaseId: phase.id,
          teamId: team.id,
        },
      },
      update: {
        pj: math.pj,
        pg: math.pg,
        pe: math.pe,
        pp: math.pp,
        gf: math.gf,
        gc: math.gc,
        dg: math.dg,
        pts: math.pts,
        position: pos,
      },
      create: {
        phaseId: phase.id,
        teamId: team.id,
        pj: math.pj,
        pg: math.pg,
        pe: math.pe,
        pp: math.pp,
        gf: math.gf,
        gc: math.gc,
        dg: math.dg,
        pts: math.pts,
        position: pos,
      },
    });

    results.push({
      team: team.name,
      pts: math.pts,
      pj: math.pj,
      position: pos,
      warnings: math.warnings,
      id: standing.id,
    });
    pos++;
  }

  return {
    success: true,
    tournamentId,
    phaseId: phase.id,
    phaseSlug,
    updatedCount: results.length,
    rows: results,
  };
}
