// lib/tablaPosiciones.js
import { aplicarConfigEquipo } from "../data/equiposConfig";

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim());

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const cells = line.split(",");
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = (cells[idx] ?? "").trim();
      });
      return row;
    });
}

export async function obtenerEquiposOrdenadosDesdeSheet(sheetUrl) {
  if (!sheetUrl) {
    throw new Error("Falta la URL de la hoja de cálculo.");
  }

  const res = await fetch(sheetUrl, {
    // se puede cachear unos segundos para no pegarle todo el tiempo a Google
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Error al leer la hoja de cálculo.");
  }

  const text = await res.text();
  const rows = parseCSV(text);

  const equiposBase = rows
    .map((row) => ({
      name: row["Equipo"],
      pj: Number(row["PJ"]) || 0,
      pg: Number(row["PG"]) || 0,
      pe: Number(row["PE"]) || 0,
      pp: Number(row["PP"]) || 0,
      dg: Number(row["DG"]) || 0,
    }))
    .filter((e) => e.name); // descarta filas vacías

  // Aplico config (logo, slug, etc.)
  const equiposConConfig = equiposBase.map(aplicarConfigEquipo);

  // Calculo puntos y ordeno
  const equiposOrdenados = equiposConConfig
    .map((equipo) => ({
      ...equipo,
      pts: equipo.pg * 3 + equipo.pe,
    }))
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts; // puntos
      if (b.dg !== a.dg) return b.dg - a.dg; // diferencia de gol
      return a.name.localeCompare(b.name); // alfabético
    });

  return equiposOrdenados;
}
