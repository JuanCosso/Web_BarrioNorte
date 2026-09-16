/**
 * lib/engine/entityResolver.js
 *
 * Resuelve nombres de clubes detectados por la IA en placas gráficas
 * mapeándolos a registros reales en la tabla `Team` de Neon DB mediante
 * comparación insensible a mayúsculas, tildes y diccionario de alias.
 */

import { prisma } from "../prisma.js";

let cachedTeams = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minuto de caché en memoria

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .replace(/[^a-z0-9]/g, "");    // saca espacios, puntos y guiones
}

export async function loadTeams() {
  const now = Date.now();
  if (cachedTeams && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedTeams;
  }

  const teams = await prisma.team.findMany();
  cachedTeams = teams;
  lastCacheTime = now;
  return teams;
}

/**
 * Resuelve un nombre crudo (ej: "B. Norte", "CASS", "Soc. Sportiva") al equipo correspondiente en Neon.
 * Si no lo encuentra, puede crear uno nuevo o devolver null.
 */
export async function resolveTeam(rawName, autoCreate = false) {
  if (!rawName || typeof rawName !== "string") return null;
  const cleanName = rawName.trim();
  const norm = normalize(cleanName);

  const teams = await loadTeams();

  // 1. Coincidencia exacta por nombre normalizado
  for (const team of teams) {
    if (normalize(team.name) === norm || normalize(team.shortName) === norm || normalize(team.slug) === norm) {
      return team;
    }
  }

  // 2. Coincidencia en array de alias
  for (const team of teams) {
    if (Array.isArray(team.aliases)) {
      for (const alias of team.aliases) {
        if (normalize(alias) === norm) {
          return team;
        }
      }
    }
  }

  // 3. Coincidencia de palabras clave sin importar el orden (ej: "Central Gualeguay" === "Gualeguay Central")
  const rawWords = cleanName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !["club", "atletico", "social", "de", "del", "la", "las", "los"].includes(w));

  for (const team of teams) {
    const candidateWords = `${team.name} ${team.shortName || ""} ${(team.aliases || []).join(" ")}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !["club", "atletico", "social", "de", "del", "la", "las", "los"].includes(w));

    if (rawWords.length > 0 && rawWords.every((rw) => candidateWords.includes(rw))) {
      return team;
    }
  }

  // 4. Coincidencia parcial por subcadena de nombre o shortName
  for (const team of teams) {
    const teamNorm = normalize(team.name);
    const shortNorm = normalize(team.shortName || "");
    if (
      (teamNorm.length >= 4 && (teamNorm.includes(norm) || norm.includes(teamNorm))) ||
      (shortNorm.length >= 4 && norm.includes(shortNorm))
    ) {
      return team;
    }
  }

  // 4. Si se permite autoCreate (para clubes provinciales nuevos)
  if (autoCreate) {
    const slug = cleanName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const newTeam = await prisma.team.create({
      data: {
        name: cleanName,
        shortName: cleanName,
        slug: slug || `team-${Date.now()}`,
        logoUrl: "/escudos/default.png",
        isLocalClub: cleanName.toLowerCase().includes("barrio norte"),
        aliases: [cleanName],
      },
    });

    cachedTeams = null; // invalidar caché
    return newTeam;
  }

  return null;
}
