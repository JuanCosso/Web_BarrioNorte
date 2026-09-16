import { prisma } from './lib/prisma.js';

const prep2026 = [
  { rival: 'La Academia', isBnHome: true, bn: 3, riv: 1 },
  { rival: 'Gualeguay Central', isBnHome: false, bn: 1, riv: 0 },
  { rival: 'Bancario', isBnHome: false, bn: 1, riv: 0 },
  { rival: 'Juventud', isBnHome: false, bn: 4, riv: 1 }
];

const oficial2026 = [
  { round: 'Fecha 1', rival: 'Bancario', isBnHome: false, bn: 0, riv: 0 },
  { round: 'Fecha 2', rival: 'Libertad', isBnHome: true, bn: 0, riv: 2 },
  { round: 'Fecha 3', rival: 'La Academia', isBnHome: false, bn: 2, riv: 0 },
  { round: 'Fecha 4', rival: 'Urquiza', isBnHome: true, bn: 1, riv: 1 },
  { round: 'Fecha 5', rival: 'El Progreso', isBnHome: false, bn: 9, riv: 0 },
  { round: 'Fecha 6', rival: 'Gualeguay Central', isBnHome: true, bn: 1, riv: 1 },
  { round: 'Fecha 7', rival: 'Juventud', isBnHome: false, bn: 0, riv: 1 },
  { round: 'Fecha 8', rival: 'Quilmes', isBnHome: true, bn: 3, riv: 1 },
  { round: 'Fecha 9', rival: 'Sociedad Sportiva', isBnHome: false, bn: 2, riv: 1 },
  { round: 'Fecha 10', rival: 'Bancario', isBnHome: true, bn: 0, riv: 1 },
  { round: 'Fecha 11', rival: 'Libertad', isBnHome: false, bn: 5, riv: 2 },
  { round: 'Fecha 12', rival: 'La Academia', isBnHome: true, bn: 2, riv: 0 },
  { round: 'Fecha 13', rival: 'Urquiza', isBnHome: false, bn: 0, riv: 3 },
  { round: 'Fecha 14', rival: 'El Progreso', isBnHome: true, bn: 4, riv: 0 },
  { round: 'Fecha 15', rival: 'Gualeguay Central', isBnHome: false, bn: 1, riv: 0 },
  { round: 'Fecha 16', rival: 'Juventud', isBnHome: true, bn: 0, riv: 0 },
  { round: 'Fecha 17', rival: 'Quilmes', isBnHome: false, bn: 1, riv: 1 },
  { round: 'Fecha 18', rival: 'Sociedad Sportiva', isBnHome: true, bn: 0, riv: 1 }
];

async function updateMatches(tournamentId, dataList) {
  const matches = await prisma.match.findMany({
    where: { tournamentId },
    include: { homeTeam: true, awayTeam: true }
  });
  
  for (const d of dataList) {
    const isBnHome = d.isBnHome;
    const rivalName = d.rival;
    const roundName = d.round;
    
    // Find the match
    const match = matches.find(m => {
      const isRightTeams = isBnHome ? 
        (m.homeTeam.isLocalClub && (m.awayTeam.name === rivalName || m.awayTeam.shortName === rivalName)) :
        (m.awayTeam.isLocalClub && (m.homeTeam.name === rivalName || m.homeTeam.shortName === rivalName));
      
      const isRightRound = roundName ? m.roundName === roundName : true;
      return isRightTeams && isRightRound;
    });

    if (match) {
      const homeScore = isBnHome ? d.bn : d.riv;
      const awayScore = isBnHome ? d.riv : d.bn;
      
      await prisma.match.update({
        where: { id: match.id },
        data: { homeScore, awayScore, status: 'FINISHED' }
      });
      console.log(`Updated ${tournamentId} ${match.roundName || ''} vs ${rivalName}: ${homeScore} - ${awayScore}`);
    } else {
      console.log(`Match not found for ${tournamentId} ${roundName || ''} vs ${rivalName}`);
    }
  }
}

(async () => {
  await updateMatches('preparacion-2026', prep2026);
  await updateMatches('oficial-2026', oficial2026);
  process.exit(0);
})();
