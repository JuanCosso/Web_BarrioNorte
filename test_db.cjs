require('dotenv').config();
const { prisma } = require('./lib/prisma');
async function main() {
  const phases = await prisma.tournamentPhase.findMany({ where: { tournamentId: 'oficial-2026' }, include: { standings: true, matches: true } });
  console.log(JSON.stringify(phases.map(p => ({ slug: p.slug, name: p.name, standingsCount: p.standings.length, matchCount: p.matches.length })), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
