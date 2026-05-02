// app/api/historial/route.js
import { NextResponse } from "next/server";
import fs   from "fs";
import path from "path";
import { MATCHES, STATIC_TOURNAMENT_IDS, TOURNAMENT_LABELS } from "../../../lib/historialMatches";

export const dynamic = "force-dynamic";

// ─── Parseo "X - Y" → { bn, rival } ─────────────────────────────────────────
function parseScore(score, condition) {
  if (!score || typeof score !== "string") return null;
  const s = score.trim();
  if (!s || s === "-" || /susp/i.test(s)) return null;
  const [rawA, rawB] = s.split(/\s*-\s*/);
  const a = parseInt(rawA, 10), b = parseInt(rawB, 10);
  if (isNaN(a) || isNaN(b)) return null;
  return /local/i.test(condition || "")
    ? { bn: a, rival: b }
    : { bn: b, rival: a };
}

// ─── Leer JSONs dinámicos (torneos NO en STATIC_TOURNAMENT_IDS) ──────────────
// Asigna un `order` alto (800000 + índice) para que queden al final del orden
// cronológico y el modal los muestre como los más recientes.
function readDynamicMatches() {
  const out = [];
  const base = path.join(process.cwd(), "data", "local");
  if (!fs.existsSync(base)) return out;

  const years = fs.readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{4}$/.test(e.name))
    .map((e) => e.name)
    .sort();

  let idx = 0;
  for (const year of years) {
    const yearDir = path.join(base, year);
    const tournaments = fs.readdirSync(yearDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();

    for (const tid of tournaments) {
      if (STATIC_TOURNAMENT_IDS.has(tid)) continue;

      const jsonPath = path.join(yearDir, tid, "masculino-results.json");
      if (!fs.existsSync(jsonPath)) continue;

      let raw;
      try { raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8")); }
      catch { continue; }
      if (!Array.isArray(raw)) continue;

      const label = TOURNAMENT_LABELS[tid] || tid;
      const yy     = year.slice(2);

      for (const m of raw) {
        const s = (m.score || "").trim();
        if (!s || s === "-" || /susp/i.test(s)) continue;
        const rawDate = (m.date || "").trim();
        const date    = rawDate && /^\d{2}\/\d{2}$/.test(rawDate)
          ? `${rawDate}/${yy}`
          : rawDate;
        out.push({
          order:     800000 + idx++,
          torneo:    label,
          rival:     (m.rival || "").trim(),
          condition: m.condition || "Local",
          score:     s,
          date,
        });
      }
    }
  }
  return out;
}

// ─── Acumular stats por rival ─────────────────────────────────────────────────
function buildStats(allMatches) {
  const map = {};
  for (const m of allMatches) {
    const rival = (m.rival || "").trim();
    if (!rival) continue;
    const p = parseScore(m.score, m.condition);
    if (!p) continue;
    if (!map[rival]) map[rival] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 };
    const s = map[rival];
    s.pj++; s.gf += p.bn; s.gc += p.rival;
    if (p.bn > p.rival)        s.pg++;
    else if (p.bn === p.rival) s.pe++;
    else                        s.pp++;
  }
  return Object.entries(map)
    .map(([name, s]) => ({ name, ...s, dg: s.gf - s.gc }))
    .sort((a, b) => b.pj - a.pj || b.pg - a.pg || a.name.localeCompare(b.name));
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const dynamic   = readDynamicMatches();
    const allStatic = MATCHES;                          // de lib/historialMatches.js
    const all       = [...allStatic, ...dynamic];

    const stats   = buildStats(all);
    const total   = all.filter((m) => parseScore(m.score, m.condition)).length;

    // Devolvemos también los matches al cliente (ordenados reciente → antiguo)
    // para que HistorialSection pueda mostrarlos en el modal sin duplicar datos.
    const matches = [...all].sort((a, b) => b.order - a.order);

    return NextResponse.json({ stats, matches, total });
  } catch (err) {
    console.error("[historial] Error:", err);
    return NextResponse.json({ stats: [], matches: [], total: 0 }, { status: 500 });
  }
}