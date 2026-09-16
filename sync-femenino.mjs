import { prisma } from './lib/prisma.js';

async function getOrCreateTeam(name) {
  const normalizedName = name.trim();
  let team = await prisma.team.findFirst({
    where: {
      OR: [
        { name: normalizedName },
        { aliases: { has: normalizedName } },
        { shortName: normalizedName }
      ]
    }
  });

  if (!team) {
    const slug = normalizedName.toLowerCase().replace(/[\s-]/g, '-');
    team = await prisma.team.create({
      data: {
        name: normalizedName,
        shortName: normalizedName,
        slug: slug,
        isLocalClub: false,
        aliases: [normalizedName]
      }
    });
  }
  return team;
}

async function parseScore(scoreStr) {
  if (!scoreStr) return { h: null, a: null, ph: null, pa: null };
  const str = scoreStr.trim();
  if (str === "" || str === "-") return { h: null, a: null, ph: null, pa: null };
  const m = str.match(/^(\d+)\s*-\s*(\d+)/);
  if (m) {
    const h = parseInt(m[1], 10);
    const a = parseInt(m[2], 10);
    const pm = str.match(/\((\d+)\s*-\s*(\d+)\)/);
    let ph = null, pa = null;
    if (pm) {
      ph = parseInt(pm[1], 10);
      pa = parseInt(pm[2], 10);
    }
    return { h, a, ph, pa };
  }
  return { h: null, a: null, ph: null, pa: null };
}

async function syncFemenino() {
const matches = [
      { round: "Fecha 1", date: "06/04", condition: "Local", rival: "Bancario", score: "2 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 2", date: "13/04", condition: "Local", rival: "Aldea Asunción", score: "0 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 3", date: "20/04", condition: "Visitante", rival: "Urquiza", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 4", date: "27/04", condition: "Local", rival: "Central", score: "1 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 5", date: "04/05", condition: "Visitante", rival: "Sportiva", score: "1 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 6", date: "11/05", condition: "Local", rival: "Libertad", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 7", date: "25/05", condition: "Visitante", rival: "Quilmes", score: "0 - 4", competition: "Torneo Oficial" },
      { round: "Fecha 8", date: "01/06", condition: "Local", rival: "Juventud", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 9", date: "08/06", condition: "Visitante", rival: "El Progreso", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 10", date: "06/06", condition: "Visitante", rival: "Bancario", score: "2 - 2", competition: "Torneo Oficial" },
      { round: "Fecha 11", date: "22/06", condition: "Visitante", rival: "Aldea Asunción", score: "0 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 12", date: "29/06", condition: "Local", rival: "Urquiza", score: "2 - 4", competition: "Torneo Oficial" },
      { round: "Fecha 13", date: "05/07", condition: "Visitante", rival: "Central", score: "3 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 14", date: "13/07", condition: "Local", rival: "Sportiva", score: "2 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 15", date: "20/07", condition: "Visitante", rival: "Libertad", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 16", date: "03/08", condition: "Local", rival: "Quilmes", score: "1 - 1", competition: "Torneo Oficial" },
      { round: "Fecha 17", date: "10/08", condition: "Visitante", rival: "Juventud", score: "1 - 0", competition: "Torneo Oficial" },
      { round: "Fecha 18", date: "17/08", condition: "Local", rival: "El Progreso", score: "0 - 2", competition: "Torneo Oficial" },
      { round: "Semifinal", date: "24/08", condition: "Visitante", rival: "Libertad", score: "0 - 1", competition: "Repechaje" },
      { round: "Final", date: "07/09", condition: "Visitante", rival: "El Progreso", score: "1 - 2", competition: "Repechaje" },
      { round: "Semifinal", date: "14/09", condition: "Local", rival: "Central", score: "1 - 0", competition: "Petit Torneo" },
      { round: "Semifinal", date: "21/09", condition: "Visitante", rival: "Central", score: "2 - 0", competition: "Petit Torneo" },
    ];
  
  if (matches.length === 0) {
    console.log("No matches found for oficial-2025-fem in config");
    return;
  }
  
  const bn = await getOrCreateTeam("Barrio Norte");
  
  let createdCount = 0;
  for (const m of matches) {
    const isBnLocal = m.condition === "Local";
    const rival = await getOrCreateTeam(m.rival);
    const homeTeamId = isBnLocal ? bn.id : rival.id;
    const awayTeamId = isBnLocal ? rival.id : bn.id;
    
    const { h, a, ph, pa } = await parseScore(m.score);
    let parsedHome = null, parsedAway = null, parsedPh = null, parsedPa = null;
    if (h !== null && a !== null) {
       parsedHome = isBnLocal ? h : a;
       parsedAway = isBnLocal ? a : h;
       if (ph !== null && pa !== null) {
          parsedPh = isBnLocal ? ph : pa;
          parsedPa = isBnLocal ? pa : ph;
       }
    }
    
    const roundNumberMatch = String(m.round).match(/\d+/);
    const roundNumber = roundNumberMatch ? parseInt(roundNumberMatch[0], 10) : null;
    
    const parts = m.date.split("/");
    const matchDate = new Date(`2025-${parts[1]}-${parts[0]}T12:00:00-03:00`);
    
    // Determine phase
    let phaseId = null;
    if (m.competition === "Repechaje") {
      const p = await prisma.tournamentPhase.findFirst({ where: { tournamentId: 'oficial-2025-fem', slug: 'repechaje' }});
      if (p) phaseId = p.id;
    } else if (m.competition === "Petit Torneo") {
      const p = await prisma.tournamentPhase.findFirst({ where: { tournamentId: 'oficial-2025-fem', slug: 'petit' }});
      if (p) phaseId = p.id;
    } else {
      const p = await prisma.tournamentPhase.findFirst({ where: { tournamentId: 'oficial-2025-fem', slug: 'fase-regular' }});
      if (p) phaseId = p.id;
    }
    
    const existing = await prisma.match.findFirst({
       where: {
          tournamentId: 'oficial-2025-fem',
          roundName: m.round,
          homeTeamId: homeTeamId,
          awayTeamId: awayTeamId
       }
    });

    if (existing) {
       await prisma.match.update({
          where: { id: existing.id },
          data: {
             homeScore: parsedHome,
             awayScore: parsedAway,
             penaltiesHome: parsedPh,
             penaltiesAway: parsedPa,
             date: matchDate,
             rawDate: m.date,
             status: (parsedHome !== null && parsedAway !== null) ? 'FINISHED' : 'SCHEDULED',
             phaseId: phaseId
          }
       });
    } else {
       await prisma.match.create({
          data: {
             tournamentId: 'oficial-2025-fem',
             roundName: m.round,
             roundNumber: roundNumber,
             homeTeamId: homeTeamId,
             awayTeamId: awayTeamId,
             homeScore: parsedHome,
             awayScore: parsedAway,
             penaltiesHome: parsedPh,
             penaltiesAway: parsedPa,
             date: matchDate,
             rawDate: m.date,
             status: (parsedHome !== null && parsedAway !== null) ? 'FINISHED' : 'SCHEDULED',
             phaseId: phaseId,
             competition: m.competition || "Torneo Oficial"
          }
       });
    }
    createdCount++;
  }
  
  console.log(`Synced ${createdCount} matches for oficial-2025-fem.`);
}

syncFemenino().catch(console.error).finally(() => process.exit(0));
