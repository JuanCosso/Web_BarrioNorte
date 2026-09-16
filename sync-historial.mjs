import fs from 'fs';
import { prisma } from './lib/prisma.js';

(async () => {
  const dbMatches = await prisma.match.findMany({
    where: {
      status: 'FINISHED',
      tournament: { category: 'PRIMERA_MASCULINO' },
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
      { date: 'asc' },
      { roundNumber: 'asc' },
      { id: 'asc' },
    ],
  });

  const matchesForFallback = dbMatches.map((m, idx) => {
    const isHome = m.homeTeam.isLocalClub;
    const rival = isHome ? (m.awayTeam.shortName || m.awayTeam.name) : (m.homeTeam.shortName || m.homeTeam.name);

    let score = `${m.homeScore} - ${m.awayScore}`;
    if (m.penaltiesHome !== null && m.penaltiesAway !== null && (m.penaltiesHome > 0 || m.penaltiesAway > 0)) {
      score += ` (${m.penaltiesHome}-${m.penaltiesAway} pen.)`;
    }

    let date = m.rawDate || '';
    if (m.date) {
      const d = new Date(m.date);
      const fmt = new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit', month: '2-digit', year: '2-digit',
      });
      date = fmt.format(d);
    }

    let torneo = m.tournament?.name || m.competition || 'Torneo Oficial';
    if (torneo.toLowerCase().includes('oficial 2021')) torneo = 'Oficial 2021/22';
    if (m.roundName && (m.roundName.includes('Semi') || m.roundName.includes('Final') || m.roundName.includes('Petit') || m.roundName.includes('Cuarto') || m.roundName.includes('Repechaje')) && !torneo.includes(m.roundName)) {
      torneo = `${torneo} · ${m.roundName}`;
    }

    return {
      order: idx + 1,
      torneo,
      rival,
      condition: isHome ? 'Local' : 'Visitante',
      score,
      date,
    };
  });

  const content = `// lib/historialMatches.js
//
// ÚNICA FUENTE DE VERDAD para partidos históricos de Primera Masculina (Fallback).
//
// Importado por:
//   · app/api/historial/route.js
//

export const MATCHES = ${JSON.stringify(matchesForFallback, null, 2)};
`;

  fs.writeFileSync('lib/historialMatches.js', content);
  console.log('Updated lib/historialMatches.js with', matchesForFallback.length, 'matches');
  process.exit(0);
})();
