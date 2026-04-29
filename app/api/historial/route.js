// app/api/historial/route.js
import { NextResponse } from "next/server";
import fs   from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/*
  CONVENIO DE SCORE: siempre "Casa - Visita"
  ─ condition "Local"    → BN   = parte[0],  rival = parte[1]
  ─ condition "Visitante"→ rival = parte[0], BN    = parte[1]
*/

// ─────────────────────────────────────────────
// TODOS los partidos con resultado registrado
// Fuente: TOURNAMENT_CONTENT en masculino.config.js
// ─────────────────────────────────────────────
const HISTORICAL = {

  // ── SUPERCOPA ENTRE RÍOS 2023 ──────────────────────────────────────────────
  // 6 partidos de grupo + 4 de eliminatorias ida/vuelta
  "supercopa-entre-rios-2023": [
    { condition: "Local",     rival: "Juventud Unida",        score: "2 - 1" },
    { condition: "Local",     rival: "Central",               score: "3 - 2" },
    { condition: "Visitante", rival: "Deportivo Urdinarrain", score: "1 - 0" },
    { condition: "Visitante", rival: "Juventud Unida",        score: "2 - 0" },
    { condition: "Visitante", rival: "Central",               score: "0 - 2" },
    { condition: "Local",     rival: "Deportivo Urdinarrain", score: "1 - 0" },
    { condition: "Visitante", rival: "Ferrocarril (Chajarí)", score: "1 - 1" },
    { condition: "Local",     rival: "Ferrocarril (Chajarí)", score: "1 - 0" },
    { condition: "Visitante", rival: "Libertad (Concordia)",  score: "2 - 1" },
    { condition: "Local",     rival: "Libertad (Concordia)",  score: "1 - 2" },
  ],

  // ── TORNEO OFICIAL 2023 ────────────────────────────────────────────────────
  // 18 fechas de fase regular + 2 partidos de repechaje
  "oficial-2023": [
    { condition: "Visitante", rival: "Libertad",          score: "3 - 1" },
    { condition: "Local",     rival: "Urquiza",           score: "3 - 0" },
    { condition: "Local",     rival: "La Academia",       score: "2 - 2" },
    { condition: "Visitante", rival: "El Progreso",       score: "0 - 2" },
    { condition: "Local",     rival: "Central",           score: "2 - 0" },
    { condition: "Visitante", rival: "Juventud",          score: "1 - 1" },
    { condition: "Local",     rival: "Quilmes",           score: "0 - 0" },
    { condition: "Visitante", rival: "Sociedad Sportiva", score: "1 - 0" },
    { condition: "Visitante", rival: "Bancario",          score: "0 - 1" },
    { condition: "Local",     rival: "Libertad",          score: "0 - 1" },
    { condition: "Visitante", rival: "Urquiza",           score: "1 - 0" },
    { condition: "Visitante", rival: "La Academia",       score: "1 - 5" },
    { condition: "Local",     rival: "El Progreso",       score: "1 - 1" },
    { condition: "Visitante", rival: "Central",           score: "2 - 0" },
    { condition: "Local",     rival: "Juventud",          score: "2 - 4" },
    { condition: "Visitante", rival: "Quilmes",           score: "0 - 1" },
    { condition: "Local",     rival: "Sociedad Sportiva", score: "0 - 2" },
    { condition: "Local",     rival: "Bancario",          score: "1 - 0" },
    // Repechaje
    { condition: "Visitante", rival: "Urquiza",           score: "1 - 1" },
    { condition: "Visitante", rival: "Central",           score: "0 - 0" },
  ],

  // ── TORNEO PREPARACIÓN 2024 ────────────────────────────────────────────────
  // 4 fechas + semifinal + final (BN campeón por penales)
  "preparacion-2024": [
    { condition: "Local",     rival: "Urquiza",           score: "0 - 1" },
    { condition: "Visitante", rival: "Juventud",          score: "0 - 1" },
    { condition: "Local",     rival: "Quilmes",           score: "1 - 0" },
    { condition: "Visitante", rival: "El Progreso",       score: "4 - 1" },
    { condition: "Local",     rival: "Sociedad Sportiva", score: "1 - 1" },
    { condition: "Visitante", rival: "Central",           score: "0 - 0" },
  ],

  // ── TORNEO OFICIAL 2024 ────────────────────────────────────────────────────
  // 18 fechas + 2 repechaje + 6 petit torneo — BN CAMPEÓN
  "oficial-2024": [
    { condition: "Visitante", rival: "Urquiza",           score: "0 - 1" },
    { condition: "Local",     rival: "Libertad",          score: "3 - 1" },
    { condition: "Local",     rival: "Sociedad Sportiva", score: "0 - 0" },
    { condition: "Visitante", rival: "Bancario",          score: "1 - 3" },
    { condition: "Visitante", rival: "Quilmes",           score: "0 - 1" },
    { condition: "Local",     rival: "El Progreso",       score: "3 - 3" },
    { condition: "Visitante", rival: "La Academia",       score: "1 - 0" },
    { condition: "Visitante", rival: "Juventud",          score: "2 - 3" },
    { condition: "Local",     rival: "Central",           score: "0 - 2" },
    { condition: "Local",     rival: "Urquiza",           score: "2 - 2" },
    { condition: "Visitante", rival: "Libertad",          score: "1 - 1" },
    { condition: "Visitante", rival: "Sociedad Sportiva", score: "1 - 0" },
    { condition: "Local",     rival: "Bancario",          score: "4 - 2" },
    { condition: "Local",     rival: "Quilmes",           score: "3 - 0" },
    { condition: "Visitante", rival: "El Progreso",       score: "1 - 2" },
    { condition: "Local",     rival: "La Academia",       score: "1 - 0" },
    { condition: "Local",     rival: "Juventud",          score: "5 - 1" },
    { condition: "Visitante", rival: "Central",           score: "2 - 2" },
    // Repechaje
    { condition: "Local",     rival: "El Progreso",       score: "1 - 0" },
    { condition: "Local",     rival: "Quilmes",           score: "2 - 0" },
    // Petit Torneo (Libertad / Urquiza / Sociedad Sportiva)
    { condition: "Visitante", rival: "Libertad",          score: "1 - 0" },
    { condition: "Local",     rival: "Urquiza",           score: "3 - 2" },
    { condition: "Visitante", rival: "Sociedad Sportiva", score: "1 - 1" },
    { condition: "Local",     rival: "Libertad",          score: "1 - 1" },
    { condition: "Visitante", rival: "Urquiza",           score: "0 - 2" },
    { condition: "Local",     rival: "Sociedad Sportiva", score: "4 - 1" },
  ],

  // ── TORNEO PREPARACIÓN 2025 ────────────────────────────────────────────────
  // Partidos con resultado (Fecha 5 suspendida, omitida)
  "preparacion-2025": [
    { condition: "Visitante", rival: "Central",           score: "1 - 2" },
    { condition: "Local",     rival: "La Academia",       score: "0 - 0" },
    { condition: "Visitante", rival: "Libertad",          score: "4 - 3" },
  ],

  // ── TORNEO OFICIAL 2025 ────────────────────────────────────────────────────
  // 18 fechas + 5 petit (Fecha 6 del Petit suspendida, omitida)
  "oficial-2025": [
    { condition: "Local",     rival: "Bancario",          score: "2 - 1" },
    { condition: "Local",     rival: "La Academia",       score: "0 - 2" },
    { condition: "Visitante", rival: "Urquiza",           score: "3 - 1" },
    { condition: "Local",     rival: "Central",           score: "1 - 0" },
    { condition: "Visitante", rival: "Sociedad Sportiva", score: "3 - 0" },
    { condition: "Local",     rival: "Libertad",          score: "2 - 2" },
    { condition: "Visitante", rival: "Quilmes",           score: "1 - 3" },
    { condition: "Local",     rival: "Juventud",          score: "0 - 0" },
    { condition: "Visitante", rival: "El Progreso",       score: "1 - 1" },
    { condition: "Visitante", rival: "Bancario",          score: "0 - 1" },
    { condition: "Visitante", rival: "La Academia",       score: "0 - 0" },
    { condition: "Local",     rival: "Urquiza",           score: "2 - 0" },
    { condition: "Visitante", rival: "Central",           score: "0 - 1" },
    { condition: "Local",     rival: "Sociedad Sportiva", score: "2 - 1" },
    { condition: "Visitante", rival: "Libertad",          score: "1 - 0" },
    { condition: "Local",     rival: "Quilmes",           score: "2 - 2" },
    { condition: "Visitante", rival: "Juventud",          score: "3 - 2" },
    { condition: "Local",     rival: "El Progreso",       score: "5 - 1" },
    // Petit Torneo (Sociedad Sportiva / La Academia / Juventud)
    { condition: "Visitante", rival: "Sociedad Sportiva", score: "2 - 1" },
    { condition: "Local",     rival: "La Academia",       score: "3 - 3" },
    { condition: "Visitante", rival: "Juventud",          score: "2 - 3" },
    { condition: "Local",     rival: "Sociedad Sportiva", score: "0 - 1" },
    { condition: "Visitante", rival: "La Academia",       score: "1 - 0" },
  ],

  // ── TORNEO PREPARACIÓN 2026 ────────────────────────────────────────────────
  // Datos directos del config
  "preparacion-2026": [
    { condition: "Local",     rival: "La Academia",       score: "3 - 1" },
    { condition: "Visitante", rival: "Central",           score: "0 - 1" },
    { condition: "Visitante", rival: "Bancario",          score: "0 - 1" },
    { condition: "Visitante", rival: "Juventud",          score: "1 - 4" },
    { condition: "Local",     rival: "Sociedad Sportiva", score: "1 - 2" },
  ],

  /*
    oficial-2026: results [] en el config.
    Sus partidos se leen automáticamente desde:
    data/local/2026/oficial-2026/masculino-results.json
  */
};

// ─────────────────────────────────────────────
// PARSEO SCORE
// ─────────────────────────────────────────────
function parseScore(score, condition) {
  if (!score || typeof score !== "string") return null;
  const s = score.trim();
  if (!s || s === "-" || /susp/i.test(s)) return null;
  const [rawA, rawB] = s.split(/\s*-\s*/);
  const a = parseInt(rawA, 10);
  const b = parseInt(rawB, 10);
  if (isNaN(a) || isNaN(b)) return null;
  return /local/i.test(condition || "")
    ? { bn: a, rival: b }
    : { bn: b, rival: a };
}

// ─────────────────────────────────────────────
// LEER JSONs de data/local/ — solo torneos NO en HISTORICAL
// ─────────────────────────────────────────────
function readLocalResults() {
  const out = [];
  const base = path.join(process.cwd(), "data", "local");
  if (!fs.existsSync(base)) return out;

  for (const year of fs.readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{4}$/.test(e.name))
    .map((e) => e.name)
  ) {
    const yearDir = path.join(base, year);
    for (const tournament of fs.readdirSync(yearDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
    ) {
      if (HISTORICAL[tournament]) continue; // ya incluido arriba

      const jsonPath = path.join(yearDir, tournament, "masculino-results.json");
      if (!fs.existsSync(jsonPath)) continue;
      try {
        const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        if (Array.isArray(raw)) out.push(...raw);
      } catch { /* ignorar */ }
    }
  }
  return out;
}

// ─────────────────────────────────────────────
// ACUMULAR STATS por rival — orden: PJ desc, PG desc, nombre asc
// ─────────────────────────────────────────────
function buildStats(matches) {
  const map = {};

  for (const m of matches) {
    const rival = (m.rival || "").trim();
    if (!rival) continue;
    const p = parseScore(m.score, m.condition);
    if (!p) continue;

    if (!map[rival]) map[rival] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 };
    const s = map[rival];
    s.pj++;
    s.gf += p.bn;
    s.gc += p.rival;
    if (p.bn > p.rival)       s.pg++;
    else if (p.bn === p.rival) s.pe++;
    else                       s.pp++;
  }

  return Object.entries(map)
    .map(([name, s]) => ({ name, ...s, dg: s.gf - s.gc }))
    .sort((a, b) =>
      b.pj - a.pj ||
      b.pg - a.pg ||
      a.name.localeCompare(b.name)
    );
}

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────
export async function GET() {
  try {
    const all   = [...Object.values(HISTORICAL).flat(), ...readLocalResults()];
    const stats = buildStats(all);
    const total = all.filter((m) => parseScore(m.score, m.condition)).length;
    return NextResponse.json({ stats, total });
  } catch (err) {
    console.error("[historial] Error:", err);
    return NextResponse.json({ stats: [], total: 0 }, { status: 500 });
  }
}