import "dotenv/config";
import { prisma } from "../lib/prisma.js";

async function check() {
  const standings = await prisma.standingRow.findMany({
    where: {
      phase: {
        tournamentId: { in: ["oficial-2026", "oficial-2026-fem"] }
      }
    },
    include: {
      team: true,
      phase: { include: { tournament: true } }
    }
  });

  const byTournament = {};
  standings.forEach(s => {
    const tId = s.phase?.tournamentId || 'unknown';
    const pSlug = s.phase?.slug || s.phaseId;
    const key = `${tId} / ${pSlug}`;
    if (!byTournament[key]) byTournament[key] = [];
    byTournament[key].push({
      team: s.team.name,
      pj: s.pj,
      pg: s.pg,
      pe: s.pe,
      pp: s.pp,
      gf: s.gf,
      gc: s.gc,
      dg: s.dg,
      pts: s.pts,
      pos: s.position
    });
  });

  for (const [k, v] of Object.entries(byTournament)) {
    console.log(`=== ${k} ===`);
    v.sort((a,b) => (a.pos || 99) - (b.pos || 99));
    v.forEach(row => console.log(`  #${row.pos} ${row.team} - PJ: ${row.pj}, G: ${row.pg}, E: ${row.pe}, P: ${row.pp}, DG: ${row.dg}, PTS: ${row.pts}`));
  }
  await prisma.$disconnect();
}
check().catch(console.error);
