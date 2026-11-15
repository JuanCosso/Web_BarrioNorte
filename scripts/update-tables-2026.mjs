import "dotenv/config";
import { prisma } from "../lib/prisma.js";

function normalizeName(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function updateTables() {
  console.log("Actualizando tablas de posiciones 2026 oficiales...");

  const allTeams = await prisma.team.findMany();
  const teamMap = new Map();
  for (const t of allTeams) {
    teamMap.set(normalizeName(t.name), t);
    teamMap.set(normalizeName(t.shortName), t);
    teamMap.set(normalizeName(t.slug), t);
  }

  const extraAliases = {
    "aldeaasuncion": "aldea-asuncion",
    "juventudcarbo": "juventud",
    "carbo": "juventud",
    "barrionorte": "barrio-norte",
    "gualeguaycentral": "gualeguay-central",
    "central": "gualeguay-central",
    "laacademia": "la-academia",
    "sociedadsportiva": "sociedad-sportiva",
    "sportiva": "sociedad-sportiva",
    "elprogreso": "el-progreso",
    "progreso": "el-progreso"
  };

  function findTeam(name) {
    const norm = normalizeName(name);
    if (teamMap.has(norm)) return teamMap.get(norm);
    if (extraAliases[norm] && teamMap.has(normalizeName(extraAliases[norm]))) {
      return teamMap.get(normalizeName(extraAliases[norm]));
    }
    for (const [k, t] of teamMap.entries()) {
      if (norm.includes(k) || k.includes(norm)) return t;
    }
    return null;
  }

  // 1. Torneo Oficial 2026 Masculino (18 PJ)
  const mascData = [
    { pos: 1, name: "Urquiza", pts: 38, pj: 18, pg: 11, pe: 5, pp: 2, gf: 35, gc: 15, dg: 20 },
    { pos: 2, name: "Sociedad Sportiva", pts: 37, pj: 18, pg: 11, pe: 4, pp: 3, gf: 31, gc: 10, dg: 21 },
    { pos: 3, name: "Juventud", pts: 32, pj: 18, pg: 9, pe: 5, pp: 4, gf: 25, gc: 16, dg: 9 },
    { pos: 4, name: "Libertad", pts: 31, pj: 18, pg: 9, pe: 4, pp: 5, gf: 30, gc: 19, dg: 11 },
    { pos: 5, name: "Barrio Norte", pts: 28, pj: 18, pg: 8, pe: 4, pp: 6, gf: 29, gc: 18, dg: 11 },
    { pos: 6, name: "La Academia", pts: 25, pj: 18, pg: 7, pe: 4, pp: 7, gf: 24, gc: 30, dg: -6 },
    { pos: 7, name: "Quilmes", pts: 22, pj: 18, pg: 5, pe: 7, pp: 6, gf: 19, gc: 20, dg: -1 },
    { pos: 8, name: "Bancario", pts: 21, pj: 18, pg: 6, pe: 3, pp: 9, gf: 19, gc: 23, dg: -4 },
    { pos: 9, name: "Gualeguay Central", pts: 11, pj: 18, pg: 2, pe: 5, pp: 11, gf: 16, gc: 26, dg: -10 },
    { pos: 10, name: "El Progreso", pts: 3, pj: 18, pg: 0, pe: 3, pp: 15, gf: 12, gc: 63, dg: -51 }
  ];

  // 2. Torneo Oficial 2026 Femenino (16 PJ)
  const femData = [
    { pos: 1, name: "Urquiza", pts: 38, pj: 16, pg: 11, pe: 5, pp: 0, gf: 31, gc: 0, dg: 31 },
    { pos: 2, name: "El Progreso", pts: 31, pj: 16, pg: 8, pe: 7, pp: 1, gf: 25, gc: 9, dg: 16 },
    { pos: 3, name: "Gualeguay Central", pts: 29, pj: 16, pg: 8, pe: 5, pp: 3, gf: 29, gc: 14, dg: 15 },
    { pos: 4, name: "Bancario", pts: 28, pj: 16, pg: 8, pe: 4, pp: 4, gf: 24, gc: 15, dg: 9 },
    { pos: 5, name: "Libertad", pts: 25, pj: 16, pg: 7, pe: 4, pp: 5, gf: 15, gc: 14, dg: 1 },
    { pos: 6, name: "Sociedad Sportiva", pts: 18, pj: 16, pg: 4, pe: 6, pp: 6, gf: 14, gc: 16, dg: -2 },
    { pos: 7, name: "Aldea Asunción", pts: 16, pj: 16, pg: 4, pe: 4, pp: 8, gf: 15, gc: 23, dg: -8 },
    { pos: 8, name: "Barrio Norte", pts: 5, pj: 16, pg: 0, pe: 5, pp: 11, gf: 6, gc: 31, dg: -25 },
    { pos: 9, name: "Quilmes", pts: 4, pj: 16, pg: 0, pe: 4, pp: 12, gf: 4, gc: 41, dg: -37 }
  ];

  async function applyTable(tournamentId, phaseSlug, rows) {
    const phase = await prisma.tournamentPhase.findFirst({
      where: { tournamentId, slug: phaseSlug }
    });
    if (!phase) {
      console.error(`Fase no encontrada: ${tournamentId} / ${phaseSlug}`);
      return;
    }

    for (const r of rows) {
      const team = findTeam(r.name);
      if (!team) {
        console.error(`Equipo no encontrado: ${r.name}`);
        continue;
      }

      await prisma.standingRow.upsert({
        where: {
          phaseId_teamId: {
            phaseId: phase.id,
            teamId: team.id
          }
        },
        update: {
          position: r.pos,
          pj: r.pj,
          pg: r.pg,
          pe: r.pe,
          pp: r.pp,
          gf: r.gf,
          gc: r.gc,
          dg: r.dg,
          pts: r.pts
        },
        create: {
          phaseId: phase.id,
          teamId: team.id,
          position: r.pos,
          pj: r.pj,
          pg: r.pg,
          pe: r.pe,
          pp: r.pp,
          gf: r.gf,
          gc: r.gc,
          dg: r.dg,
          pts: r.pts
        }
      });
    }
    console.log(`✅ [${tournamentId}] Fase ${phaseSlug} actualizada con éxito (${rows.length} equipos).`);
  }

  await applyTable("oficial-2026", "fase-regular", mascData);
  await applyTable("oficial-2026-fem", "fase-regular", femData);

  console.log("¡Tablas 2026 actualizadas correctamente en la base de datos!");
  await prisma.$disconnect();
}

updateTables().catch(console.error);
