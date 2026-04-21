// lib/fixture.js
const TZ_OFFSET = "-03:00"; // Argentina

function isValidTime(t) {
  return /^\d{1,2}:\d{2}$/.test(String(t || "").trim());
}

function parseKickoff(dateISO, time) {
  if (!dateISO) return null;
  // Si el horario no es HH:MM válido (ej. "A confirmar" o vacío), usamos mediodía para ordenar
  const hhmm = isValidTime(time) ? String(time).trim() : "12:00";
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
  const upcoming = normalized.find((m) => m.kickoff >= now);
  return upcoming || normalized[0];
}

export function formatFlyerData(match) {
  if (!match) return null;
  return {
    round:           match.round,
    localName:       match.home,
    visitanteName:   match.away,
    stadium:         match.venue,
    fecha:           match.dateISO,
    // Pasa el valor original: si es "A confirmar", el flyer lo muestra tal cual
    hora:            isValidTime(match.time) ? match.time : "A confirmar",
    localShield:     match.homeLogo,
    visitanteShield: match.awayLogo,
  };
}