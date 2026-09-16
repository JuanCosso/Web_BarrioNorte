/**
 * scripts/fix-match-dates.mjs
 *
 * Calcula y asigna la fecha real (DateTime) a todos los partidos en Neon DB
 * para garantizar orden cronológico exacto respetando:
 * 1. Torneos con fases consecutivas (Torneo Oficial -> Petit Torneo / Repechaje).
 * 2. Torneos que cruzan de año (Diciembre año N -> Enero/Febrero año N+1 como la Supercopa).
 */

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function computeMatchDate(seasonId, rawDate, tournamentId) {
  if (!rawDate || !rawDate.includes("/")) return null;
  const parts = rawDate.split("/").map((s) => s.trim());
  if (parts.length < 2) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(day) || isNaN(month)) return null;

  let baseYear = parseInt(seasonId, 10);
  if (isNaN(baseYear)) {
    const m = tournamentId.match(/\d{4}/);
    baseYear = m ? parseInt(m[0], 10) : 2026;
  }

  let year = baseYear;
  // Supercopa 2023 o torneos que arrancaron en diciembre del año anterior
  if (tournamentId.includes("supercopa") || tournamentId.includes("2021-22")) {
    if (month >= 11) {
      year = baseYear - 1;
    }
  }

  // 15:00 UTC = 12:00 hora de Argentina (para que coincida con el día sin desfasajes de huso horario)
  return new Date(Date.UTC(year, month - 1, day, 15, 0, 0));
}

async function fixDates() {
  console.log("🔧 Corrigiendo fechas cronológicas de partidos en Neon...");
  const matches = await prisma.match.findMany({
    include: {
      tournament: true,
    },
  });

  console.log(`Total de partidos a analizar: ${matches.length}`);
  let updatedCount = 0;

  for (const m of matches) {
    if (!m.rawDate) continue;

    const realDate = computeMatchDate(m.tournament.seasonId, m.rawDate, m.tournamentId);

    if (realDate) {
      await prisma.match.update({
        where: { id: m.id },
        data: {
          date: realDate,
        },
      });
      updatedCount++;
    }
  }

  console.log(`✅ ${updatedCount} partidos actualizados con su fecha DateTime cronológica real.`);
}

fixDates()
  .catch((e) => {
    console.error("Error corrigiendo fechas:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
