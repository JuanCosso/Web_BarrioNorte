import { prisma } from './lib/prisma.js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log("DB URL:", process.env.DATABASE_URL);
  const matches = await prisma.match.findMany({
    where: { tournamentId: 'oficial-2026-fem' },
    include: { homeTeam: true, awayTeam: true }
  });
  console.log("Total matches in DB for oficial-2026-fem:", matches.length);
  
  if (matches.length > 0) {
    const clubNames = new Set();
    matches.forEach(m => {
      clubNames.add(m.homeTeam.name + " (" + m.homeTeam.isLocalClub + ")");
      clubNames.add(m.awayTeam.name + " (" + m.awayTeam.isLocalClub + ")");
    });
    console.log("Teams in these matches:", Array.from(clubNames));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
