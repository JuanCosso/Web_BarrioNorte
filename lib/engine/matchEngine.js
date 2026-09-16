/**
 * lib/engine/matchEngine.js
 *
 * Motor de persistencia y validación de partidos y resultados en Neon DB.
 * - Resuelve clubes local y visitante mediante entityResolver.
 * - Normaliza marcadores y estados (FINISHED, SCHEDULED, SUSPENDED).
 * - Aplica clave única para evitar duplicados entre distintas fuentes.
 */

import { prisma } from "../prisma.js";
import { resolveTeam } from "./entityResolver.js";

export async function applyMatches(tournamentId, rawMatches, phaseSlug = null) {
  if (!Array.isArray(rawMatches) || rawMatches.length === 0) {
    return { success: false, error: "No hay partidos para procesar" };
  }

  const tour = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tour) {
    return { success: false, error: `Torneo ${tournamentId} no encontrado.` };
  }

  let phase = null;
  if (phaseSlug) {
    phase = await prisma.tournamentPhase.findFirst({
      where: { tournamentId, slug: phaseSlug },
    });
  }

  const applied = [];
 
  for (const item of rawMatches) {
    const localRaw = item.homeTeam || item.local;
    const visitorRaw = item.awayTeam || item.visitante;

    const homeTeam = await resolveTeam(localRaw);
    const awayTeam = await resolveTeam(visitorRaw);

    if (!homeTeam || !awayTeam) {
      applied.push({
        status: "SKIPPED",
        reason: `Club no reconocido: Local '${localRaw}' (${homeTeam ? "OK" : "NO ENCONTRADO"}) | Visitante '${visitorRaw}' (${awayTeam ? "OK" : "NO ENCONTRADO"})`,
      });
      continue;
    }

    let homeScore = null;
    let awayScore = null;
    let matchStatus = "SCHEDULED";

    if (item.homeScore !== undefined && item.awayScore !== undefined && item.homeScore !== null && item.awayScore !== null) {
      homeScore = parseInt(item.homeScore, 10);
      awayScore = parseInt(item.awayScore, 10);
      if (!isNaN(homeScore) && !isNaN(awayScore)) {
        matchStatus = "FINISHED";
      }
    } else if (typeof item.score === "string" && item.score.includes("-")) {
      const parts = item.score.split("-").map((s) => parseInt(s.trim(), 10));
      if (!isNaN(parts[0]) && !isNaN(parts[1])) {
        homeScore = parts[0];
        awayScore = parts[1];
        matchStatus = "FINISHED";
      }
    } else if (item.status === "SUSPENDED" || String(item.score).toLowerCase().includes("susp")) {
      matchStatus = "SUSPENDED";
    }

    const roundName = item.roundName || item.round || "Fecha";
    const roundNumMatch = roundName.match(/\d+/);
    const roundNumber = roundNumMatch ? parseInt(roundNumMatch[0], 10) : null;

    let realDate = null;
    if (item.dateISO) {
      realDate = new Date(item.dateISO);
    } else if (item.date && item.date.includes("/")) {
      const [d, m] = item.date.split("/").map(Number);
      let year = parseInt(tour.seasonId, 10) || 2026;
      if (tournamentId.includes("supercopa") && m >= 11) year -= 1;
      realDate = new Date(Date.UTC(year, m - 1, d, 15, 0, 0));
    }

    const match = await prisma.match.upsert({
      where: {
        tournamentId_roundName_homeTeamId_awayTeamId: {
          tournamentId,
          roundName,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
        },
      },
      update: {
        phaseId: phase?.id || undefined,
        roundNumber: roundNumber || undefined,
        homeScore,
        awayScore,
        status: matchStatus,
        date: realDate || undefined,
        rawDate: item.date || item.rawDate || undefined,
        competition: item.competition || tour.name,
        stadium: item.stadium || undefined,
      },
      create: {
        tournamentId,
        phaseId: phase?.id || null,
        roundName,
        roundNumber,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore,
        awayScore,
        status: matchStatus,
        date: realDate || null,
        rawDate: item.date || item.rawDate || null,
        competition: item.competition || tour.name,
        stadium: item.stadium || null,
      },
    });

    applied.push({
      id: match.id,
      match: `${homeTeam.name} ${homeScore ?? "-"} vs ${awayScore ?? "-"} ${awayTeam.name}`,
      status: matchStatus,
      round: roundName,
    });
  }

  return {
    success: true,
    tournamentId,
    appliedCount: applied.length,
    matches: applied,
  };
}
