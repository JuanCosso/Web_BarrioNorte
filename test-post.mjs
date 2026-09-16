import { prisma } from './lib/prisma.js';

function parseMatchDateTime(dateStr, rawTimeStr) {
  if (!dateStr) return null;
  const dateOnly = String(dateStr).split("T")[0];
  const parts = dateOnly.split("-");
  if (parts.length !== 3) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }
  const timeMatch = rawTimeStr ? String(rawTimeStr).match(/(\d{1,2}):(\d{2})/) : null;
  if (timeMatch) {
    const hh = timeMatch[1].padStart(2, "0");
    const mm = timeMatch[2];
    return new Date(`${dateOnly}T${hh}:${mm}:00-03:00`);
  }
  return new Date(`${dateOnly}T12:00:00-03:00`);
}

function deriveRawDate(dateStr) {
  if (!dateStr) return "";
  const parts = String(dateStr).split("T")[0].split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
  return dateStr;
}

async function testPost() {
  const body = {
    tournamentId: 'oficial-2025-fem',
    roundName: 'Fecha 1',
    homeTeamId: 'cmu1ocfkd000010ndx1b16sem', // Barrio Norte
    awayTeamId: 'cmu1ocg6j000510nd5b4mrfbr', // La Academia
    homeScore: 0,
    awayScore: 2,
    penaltiesHome: '',
    penaltiesAway: '',
    date: '2025-04-13',
    rawTime: '16:00 hs',
    stadium: 'Estadio Pocha Badaracco',
    competition: 'Torneo Oficial',
    phaseId: null
  };
  
  const {
      tournamentId,
      phaseId,
      roundName,
      roundNumber,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      penaltiesHome,
      penaltiesAway,
      status = "SCHEDULED",
      date,
      rawDate,
      rawTime,
      stadium,
      competition,
      notes,
    } = body;
    
  let validPhaseId = null;

  let finalNotes = notes || "";
  if (rawTime) {
    finalNotes = finalNotes ? `${finalNotes} | HORA:${rawTime}` : `HORA:${rawTime}`;
  }

  const matchDate = date ? parseMatchDateTime(date, rawTime) : null;
  const finalRawDate = rawDate || deriveRawDate(date);
  
  try {
    const created = await prisma.match.create({
      data: {
        tournamentId,
        phaseId: validPhaseId,
        roundName,
        roundNumber: roundNumber ? parseInt(roundNumber, 10) : null,
        homeTeamId,
        awayTeamId,
        homeScore: homeScore !== undefined && homeScore !== null && homeScore !== "" ? parseInt(homeScore, 10) : null,
        awayScore: awayScore !== undefined && awayScore !== null && awayScore !== "" ? parseInt(awayScore, 10) : null,
        penaltiesHome: penaltiesHome !== undefined && penaltiesHome !== null && penaltiesHome !== "" ? parseInt(penaltiesHome, 10) : null,
        penaltiesAway: penaltiesAway !== undefined && penaltiesAway !== null && penaltiesAway !== "" ? parseInt(penaltiesAway, 10) : null,
        status,
        date: matchDate,
        rawDate: finalRawDate,
        stadium: stadium || null,
        competition: competition || "Torneo Oficial",
        notes: finalNotes || null,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
    console.log("Created successfully:", created);
    await prisma.match.delete({ where: { id: created.id } });
  } catch (error) {
    console.error("Prisma error:", error);
  }
}

testPost().catch(console.error).finally(() => process.exit(0));
