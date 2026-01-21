const TZ_OFFSET = "-03:00"; // Argentina

function parseKickoff(dateISO, time) {
  if (!dateISO) return null;

  // Si no hay hora, asumimos mediodía para ordenar por día sin romper.
  const hhmm = (time && String(time).trim()) ? String(time).trim() : "12:00";
  const iso = `${dateISO}T${hhmm}:00${TZ_OFFSET}`;

  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getNextMatch(matches, now = new Date()) {
  const normalized = (matches || [])
    .map((m) => ({ ...m, kickoff: parseKickoff(m.dateISO, m.time) }))
    .filter((m) => m.kickoff);

  if (normalized.length === 0) return null;

  normalized.sort((a, b) => a.kickoff - b.kickoff);

  // Primero que no haya ocurrido aún (>= ahora).
  const upcoming = normalized.find((m) => m.kickoff >= now);

  // Si estamos fuera de temporada (todos pasaron), devolvemos el primero del listado.
  return upcoming || normalized[0];
}

export function formatFlyerData(match) {
  if (!match) return null;

  return {
    round: match.round,
    localName: match.home,
    visitanteName: match.away,
    stadium: match.venue,
    fecha: match.dateISO, // si querés, acá podés formatear a "Dom 19/01"
    hora: match.time || "A confirmar",
    localShield: match.homeLogo,
    visitanteShield: match.awayLogo,
  };
}
