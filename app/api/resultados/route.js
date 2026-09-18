// app/api/resultados/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tournament = String(searchParams.get("tournament") || "oficial-2026").trim().toLowerCase();
    const category   = String(searchParams.get("category")   || "masculino").trim().toLowerCase();

    // 1. Intentar consultar Neon DB primero
    try {
      const { prisma } = await import("../../../lib/prisma.js");
      const [matchesRaw, staffList, rosterList] = await Promise.all([
        prisma.match.findMany({
          where: {
            tournamentId: tournament,
            OR: [
              { homeTeam: { isLocalClub: true } },
              { awayTeam: { isLocalClub: true } },
              { homeTeam: { name: { contains: "Barrio Norte", mode: "insensitive" } } },
              { awayTeam: { name: { contains: "Barrio Norte", mode: "insensitive" } } },
              { homeTeam: { name: { contains: "CABN", mode: "insensitive" } } },
              { awayTeam: { name: { contains: "CABN", mode: "insensitive" } } },
            ],
          },
          include: { homeTeam: true, awayTeam: true, phase: true },
        }),
        prisma.tournamentStaff.findMany({
          where: { tournamentId: tournament },
          include: { person: true },
          orderBy: { id: "asc" },
        }),
        prisma.tournamentRoster.findMany({
          where: { tournamentId: tournament },
          include: { person: true },
          orderBy: [{ jerseyNumber: "asc" }, { id: "asc" }],
        }),
      ]);

      const staff = staffList.map((s) => ({
        name: s.person.fullName,
        role: s.role,
      }));

      const roster = rosterList.map((r) => ({
        name: r.person.fullName,
        role: r.position,
        number: r.jerseyNumber ?? undefined,
      }));

      if (matchesRaw.length > 0 || staff.length > 0 || roster.length > 0) {
        const sortedMatches = sortMatches(matchesRaw);

        const results = sortedMatches.map((m) => {
          const isHome = m.homeTeam.isLocalClub || m.homeTeam.name.toLowerCase().includes("barrio") || m.homeTeam.name.toLowerCase().includes("cabn");
          const rivalTeam = isHome ? m.awayTeam : m.homeTeam;
          const rival = rivalTeam.shortName || rivalTeam.name;
          let score = "-";
          if (m.status === "FINISHED") {
            const hG = m.homeScore ?? 0;
            const aG = m.awayScore ?? 0;
            score = `${hG} - ${aG}`;
            const penH = m.penaltiesHome;
            const penA = m.penaltiesAway;
            if (
              typeof penH === "number" &&
              typeof penA === "number" &&
              !isNaN(penH) &&
              !isNaN(penA) &&
              (penH > 0 || penA > 0)
            ) {
              score += ` (${penH}-${penA})`;
            }
          } else if (m.status === "SUSPENDED") {
            score = "Susp.";
          }

          const hasPenalties =
            typeof m.penaltiesHome === "number" &&
            typeof m.penaltiesAway === "number" &&
            !isNaN(m.penaltiesHome);

          const formattedDateISO = m.date
            ? new Intl.DateTimeFormat("en-CA", {
                timeZone: "America/Argentina/Buenos_Aires",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(m.date)
            : null;

          return {
            round: m.roundName,
            roundNumber: m.roundNumber,
            date:
              m.rawDate ||
              (m.date
                ? m.date.toLocaleDateString("es-AR", {
                    timeZone: "America/Argentina/Buenos_Aires",
                  })
                : ""),
            dateISO: formattedDateISO,
            condition: isHome ? "Local" : "Visitante",
            rival,
            score,
            competition: m.competition || "Torneo Oficial",
            penalties: hasPenalties ? (isHome ? m.penaltiesHome : m.penaltiesAway) : null,
          };
        });

        let finalResults = results;

        if (finalResults.length === 0) {
          const year = (tournament.match(/(\d{4})/) || [])[1] || "misc";
          const cwd  = process.cwd();
          const candidates = [
            path.join(cwd, "data", "local", year, tournament, `${category}-results.json`),
            path.join(cwd, "data", "local", tournament, `${category}-results.json`),
          ];
          for (const localPath of candidates) {
            try {
              const raw = fs.readFileSync(localPath, "utf-8");
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                finalResults = parsed;
                break;
              }
            } catch {
              // ignore
            }
          }
        }

        return NextResponse.json({ results: finalResults, staff, roster, fromDb: true });
      }
    } catch (dbErr) {
      console.warn("Aviso al consultar resultados en Neon:", dbErr.message);
    }

    const year = (tournament.match(/(\d{4})/) || [])[1] || "misc";
    const cwd  = process.cwd();

    // Buscar en orden: primero con año, luego sin año (estructura vieja)
    const candidates = [
      path.join(cwd, "data", "local", year, tournament, `${category}-results.json`),
      path.join(cwd, "data", "local", tournament, `${category}-results.json`),
    ];

    for (const localPath of candidates) {
      try {
        const raw     = fs.readFileSync(localPath, "utf-8");
        const results = JSON.parse(raw);
        return NextResponse.json({ results: Array.isArray(results) ? results : [] });
      } catch {
        // No existe → intentar siguiente
      }
    }

    return NextResponse.json({ results: [] });
  } catch (err) {
    return NextResponse.json({ results: [] });
  }
}