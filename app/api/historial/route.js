// app/api/historial/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";
import { MATCHES } from "../../../lib/historialMatches";

export const dynamic = "force-dynamic";

// ─── Parseo "X - Y" → { bn, rival } ─────────────────────────────────────────
function parseScore(score, condition) {
  if (!score || typeof score !== "string") return null;
  const s = score.trim();
  if (!s || s === "-" || /susp/i.test(s)) return null;
  const match = s.match(/^(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  const a = parseInt(match[1], 10), b = parseInt(match[2], 10);
  if (isNaN(a) || isNaN(b)) return null;
  return /local/i.test(condition || "")
    ? { bn: a, rival: b }
    : { bn: b, rival: a };
}

// ─── Acumular stats por rival ─────────────────────────────────────────────────
function buildStats(allMatches) {
  const map = {};
  for (const m of allMatches) {
    const rival = (m.rival || "").trim();
    if (!rival) continue;
    const p = parseScore(m.score, m.condition);
    if (!p) continue;
    if (!map[rival]) map[rival] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 };
    const s = map[rival];
    s.pj++;
    s.gf += p.bn;
    s.gc += p.rival;
    if (p.bn > p.rival)        s.pg++;
    else if (p.bn === p.rival) s.pe++;
    else                        s.pp++;
  }
  return Object.entries(map)
    .map(([name, s]) => ({ name, ...s, dg: s.gf - s.gc }))
    .sort((a, b) => b.pj - a.pj || b.pg - a.pg || a.name.localeCompare(b.name));
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    let allMatches = [];

    // 1. Intentar consultar todos los partidos finalizados desde Neon DB
    try {
      const dbMatches = await prisma.match.findMany({
        where: {
          status: "FINISHED",
          tournament: { category: "PRIMERA_MASCULINO" },
          OR: [
            { homeTeam: { isLocalClub: true } },
            { awayTeam: { isLocalClub: true } },
          ],
          homeScore: { not: null },
          awayScore: { not: null },
        },
        include: {
          tournament: true,
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: [
          { date: "asc" },
          { roundNumber: "asc" },
          { id: "asc" },
        ],
      });

      if (dbMatches && dbMatches.length > 0) {
        allMatches = dbMatches.map((m, idx) => {
          const isHome = m.homeTeam.isLocalClub;
          const rival = isHome
            ? (m.awayTeam.shortName || m.awayTeam.name)
            : (m.homeTeam.shortName || m.homeTeam.name);

          let score = `${m.homeScore} - ${m.awayScore}`;
          if (
            m.penaltiesHome !== null &&
            m.penaltiesAway !== null &&
            (m.penaltiesHome > 0 || m.penaltiesAway > 0)
          ) {
            score += ` (${m.penaltiesHome}-${m.penaltiesAway} pen.)`;
          }

          let date = m.rawDate || "";
          if (m.date) {
            const d = new Date(m.date);
            const fmt = new Intl.DateTimeFormat("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            });
            date = fmt.format(d);
          }

          let torneo = m.tournament?.name || m.competition || "Torneo Oficial";
          if (torneo.toLowerCase().includes("oficial 2021")) {
            torneo = "Oficial 2021/22";
          }
          if (
            m.roundName &&
            (m.roundName.includes("Semi") ||
              m.roundName.includes("Final") ||
              m.roundName.includes("Petit") ||
              m.roundName.includes("Cuarto") ||
              m.roundName.includes("Repechaje")) &&
            !torneo.includes(m.roundName)
          ) {
            torneo = `${torneo} · ${m.roundName}`;
          }

          return {
            order: idx + 1,
            torneo,
            rival,
            condition: isHome ? "Local" : "Visitante",
            score,
            date,
          };
        });
      }
    } catch (dbErr) {
      console.warn("Aviso al consultar historial desde Neon DB, usando estático:", dbErr.message);
    }

    // 2. Fallback a historial estático si no hay datos en DB
    if (allMatches.length === 0) {
      allMatches = MATCHES;
    }

    const stats = buildStats(allMatches);
    const total = allMatches.filter((m) => parseScore(m.score, m.condition)).length;

    // Devolvemos los matches ordenados reciente → antiguo para el modal
    const matches = [...allMatches].sort((a, b) => b.order - a.order);

    return NextResponse.json({ stats, matches, total });
  } catch (err) {
    console.error("[historial] Error:", err);
    return NextResponse.json({ stats: [], matches: [], total: 0 }, { status: 500 });
  }
}