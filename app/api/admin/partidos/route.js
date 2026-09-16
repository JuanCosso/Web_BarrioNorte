// app/api/admin/partidos/route.js
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

// Helper para ordenamiento estrictamente cronológico y por fase/fecha
function sortMatches(matches) {
  return [...matches].sort((a, b) => {
    // 1. Prioridad principal: orden cronológico si ambos tienen fecha de disputa
    if (a.date && b.date) {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
        return timeA - timeB;
      }
    } else if (a.date && !b.date) {
      return -1;
    } else if (!a.date && b.date) {
      return 1;
    }

    // 2. Orden por fase del torneo (Fase Regular -> Repechaje -> Petit Torneo)
    const phaseOrderA = a.phase?.order ?? 0;
    const phaseOrderB = b.phase?.order ?? 0;
    if (phaseOrderA !== phaseOrderB) {
      return phaseOrderA - phaseOrderB;
    }

    const getPhaseWeight = (roundName) => {
      const r = (roundName || "").toLowerCase();
      if (r.includes("fecha")) return 1;
      if (r.includes("repechaje")) return 2;
      if (r.includes("cuarto")) return 3;
      if (r.includes("semi")) return 4;
      if (r.includes("final")) return 5;
      return 6;
    };
    const wA = getPhaseWeight(a.roundName);
    const wB = getPhaseWeight(b.roundName);
    if (wA !== wB) return wA - wB;

    // 3. Si son la misma fase/etapa, ordenar por número de fecha
    const numA = a.roundNumber ?? (a.roundName?.match(/\d+/) ? parseInt(a.roundName.match(/\d+/)[0], 10) : null);
    const numB = b.roundNumber ?? (b.roundName?.match(/\d+/) ? parseInt(b.roundName.match(/\d+/)[0], 10) : null);
    if (numA !== null && numB !== null && numA !== numB) {
      return numA - numB;
    }

    return (a.id || "").localeCompare(b.id || "");
  });
}

// Helper para parsear fechas con huso horario de Argentina (UTC-3)
// Evita desfases de fecha al guardar medianoche UTC
function parseMatchDateTime(dateStr, rawTimeStr) {
  if (!dateStr) return null;
  const dateOnly = String(dateStr).split("T")[0];
  const parts = dateOnly.split("-");
  if (parts.length !== 3) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }
  const timeMatch = rawTimeStr ? String(rawTimeStr).match(/(\d{1,2}):(\d{2})/) : null;
  if (timeMatch) {
    const hh = timeMatch[1].padStart(2, "0");
    const mm = timeMatch[2];
    return new Date(`${dateOnly}T${hh}:${mm}:00-03:00`);
  }
  // Si no hay horario específico, guardamos al mediodía argentino (12:00 ART = 15:00 UTC)
  return new Date(`${dateOnly}T12:00:00-03:00`);
}

function deriveRawDate(dateStr) {
  if (!dateStr) return null;
  const dateOnly = String(dateStr).split("T")[0];
  const parts = dateOnly.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return null;
}

// 1. OBTENER PARTIDOS
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId") || "oficial-2026";
    const phaseId = searchParams.get("phaseId");
    const roundNumber = searchParams.get("roundNumber");

    const where = { tournamentId };
    if (phaseId) where.phaseId = phaseId;
    if (roundNumber) where.roundNumber = parseInt(roundNumber, 10);

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        phase: true,
      },
    });

    return NextResponse.json({ matches: sortMatches(matches) });
  } catch (error) {
    console.error("Error al obtener partidos:", error);
    return NextResponse.json(
      { error: "Error al consultar partidos", details: error.message },
      { status: 500 }
    );
  }
}

// 2. CREAR PARTIDO
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      tournamentId,
      phaseId,
      roundName,
      roundNumber,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      penaltiesHome,
      penaltiesAway,
      status = "SCHEDULED",
      date,
      rawDate,
      rawTime,
      stadium,
      competition,
      notes,
    } = body;

    if (!tournamentId || !roundName || !homeTeamId || !awayTeamId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (torneo, fecha/ronda, local, visitante)." },
        { status: 400 }
      );
    }

    // Sanitizar y validar phaseId para no violar Foreign Key Constraint
    let validPhaseId = null;
    if (phaseId && phaseId !== "TODAS" && !String(phaseId).startsWith("fase-finales-")) {
      const pExists = await prisma.tournamentPhase.findUnique({ where: { id: phaseId } });
      if (pExists) validPhaseId = phaseId;
    }

    let finalNotes = notes || "";
    if (rawTime) {
      finalNotes = finalNotes ? `${finalNotes} | HORA:${rawTime}` : `HORA:${rawTime}`;
    }

    const matchDate = date ? parseMatchDateTime(date, rawTime) : null;
    const finalRawDate = rawDate || deriveRawDate(date);

    const created = await prisma.match.create({
      data: {
        tournamentId,
        phaseId: validPhaseId,
        roundName,
        roundNumber: roundNumber ? parseInt(roundNumber, 10) : null,
        homeTeamId,
        awayTeamId,
        homeScore: homeScore !== undefined && homeScore !== null && homeScore !== "" ? parseInt(homeScore, 10) : null,
        awayScore: awayScore !== undefined && awayScore !== null && awayScore !== "" ? parseInt(awayScore, 10) : null,
        penaltiesHome: penaltiesHome !== undefined && penaltiesHome !== null && penaltiesHome !== "" ? parseInt(penaltiesHome, 10) : null,
        penaltiesAway: penaltiesAway !== undefined && penaltiesAway !== null && penaltiesAway !== "" ? parseInt(penaltiesAway, 10) : null,
        status,
        date: matchDate,
        rawDate: finalRawDate,
        stadium: stadium || null,
        competition: competition || "Torneo Oficial",
        notes: finalNotes || null,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/futbol/primera");
      revalidatePath("/futbol/femenino");
    } catch (revalErr) {
      console.warn("Aviso revalidación:", revalErr.message);
    }

    return NextResponse.json({ success: true, match: created });
  } catch (error) {
    console.error("Error al crear partido:", error);
    return NextResponse.json(
      { error: "Error al guardar partido", details: error.message },
      { status: 500 }
    );
  }
}

// 3. ACTUALIZAR PARTIDO
export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id,
      roundName,
      roundNumber,
      homeScore,
      awayScore,
      status,
      date,
      rawDate,
      rawTime,
      stadium,
      competition,
      notes,
      phaseId,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del partido." },
        { status: 400 }
      );
    }

    const parseScore = (val) => {
      if (val === null || val === "" || val === undefined) return null;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? null : parsed;
    };

    const parsedHome = parseScore(homeScore);
    const parsedAway = parseScore(awayScore);
    const parsedPenHome = parseScore(body.penaltiesHome);
    const parsedPenAway = parseScore(body.penaltiesAway);

    // Si ambos marcadores son números válidos y el estado es SCHEDULED, cambiar a FINISHED automáticamente
    let finalStatus = status;
    if (parsedHome !== null && parsedAway !== null && status === "SCHEDULED") {
      finalStatus = "FINISHED";
    }

    let finalNotes = notes !== undefined ? notes : undefined;
    if (rawTime !== undefined && rawTime !== null && rawTime !== "") {
      const cleanNotes = (finalNotes || "").replace(/\|?\s*HORA:[^|]+/g, "").trim();
      finalNotes = cleanNotes ? `${cleanNotes} | HORA:${rawTime}` : `HORA:${rawTime}`;
    } else if (rawTime === "") {
      const cleanNotes = (finalNotes || "").replace(/\|?\s*HORA:[^|]+/g, "").trim();
      finalNotes = cleanNotes || null;
    }

    let matchDate = undefined;
    if (date !== undefined) {
      matchDate = date ? parseMatchDateTime(date, rawTime) : null;
    }

    let finalRawDate = rawDate !== undefined ? rawDate : undefined;
    if (date && !rawDate) {
      finalRawDate = deriveRawDate(date);
    }

    let validPhaseId = undefined;
    if (phaseId !== undefined) {
      if (phaseId && phaseId !== "TODAS" && !String(phaseId).startsWith("fase-finales-")) {
        const phaseExists = await prisma.tournamentPhase.findUnique({
          where: { id: phaseId },
        });
        validPhaseId = phaseExists ? phaseId : null;
      } else {
        validPhaseId = null;
      }
    }

    const updated = await prisma.match.update({
      where: { id },
      data: {
        roundName: roundName || undefined,
        roundNumber: roundNumber !== undefined ? (roundNumber ? parseInt(roundNumber, 10) : null) : undefined,
        homeTeamId: body.homeTeamId || undefined,
        awayTeamId: body.awayTeamId || undefined,
        homeScore: parsedHome,
        awayScore: parsedAway,
        penaltiesHome: parsedPenHome,
        penaltiesAway: parsedPenAway,
        status: finalStatus || undefined,
        date: matchDate,
        rawDate: finalRawDate,
        stadium: stadium !== undefined ? stadium : undefined,
        competition: competition !== undefined ? competition : undefined,
        notes: finalNotes,
        phaseId: validPhaseId,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/futbol/primera");
      revalidatePath("/futbol/femenino");
    } catch (revalErr) {
      console.warn("Aviso revalidación:", revalErr.message);
    }

    return NextResponse.json({ success: true, match: updated });
  } catch (error) {
    console.error("Error al actualizar partido:", error);
    return NextResponse.json(
      { error: "Error al actualizar partido", details: error.message },
      { status: 500 }
    );
  }
}

// 4. ELIMINAR PARTIDO
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del partido a eliminar." },
        { status: 400 }
      );
    }

    const deleted = await prisma.match.delete({ where: { id } });

    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/futbol/primera");
      revalidatePath("/futbol/femenino");
    } catch (revalErr) {
      console.warn("Aviso revalidación:", revalErr.message);
    }

    return NextResponse.json({ success: true, deletedId: deleted.id });
  } catch (error) {
    console.error("Error al eliminar partido:", error);
    return NextResponse.json(
      { error: "Error al eliminar partido", details: error.message },
      { status: 500 }
    );
  }
}
