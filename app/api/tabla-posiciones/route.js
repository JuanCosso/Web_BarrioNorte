// app/api/tabla-posiciones/route.js
import { NextResponse } from "next/server";
import { obtenerEquiposOrdenadosDesdeSheet } from "../../../lib/tablaPosiciones";

export const dynamic = "force-dynamic";

/**
 * Standings -> obtenerEquiposOrdenadosDesdeSheet(url)
 * Playoffs -> rows con { equipo, etapa, resultado, penales, ida, vuelta }
 * Encabezados recomendados playoffs:
 * equipo | etapa | resultado | penales
 * o ida/vuelta:
 * equipo | etapa | resultado ida | resultado vuelta
 */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"' && text[i + 1] === '"') {
      cur += '"';
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && (ch === "," || ch === "\n" || ch === "\r")) {
      if (ch === "\r") continue;
      row.push(cur);
      cur = "";
      if (ch === "\n") {
        if (row.some((c) => String(c).trim() !== "")) rows.push(row);
        row = [];
      }
      continue;
    }

    cur += ch;
  }

  row.push(cur);
  if (row.some((c) => String(c).trim() !== "")) rows.push(row);

  return rows;
}

function normalizeHeader(h) {
  return String(h || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase();
}

function indexOfAny(headers, candidates) {
  for (const c of candidates) {
    const idx = headers.indexOf(c);
    if (idx >= 0) return idx;
  }
  return -1;
}

const BRACKET_TYPE_RE = /(repechaje|playoffs|eliminatorias|finales|semifinal|final)/i;

/**
 * IMPORTANTE:
 * - SHEETS mapea: tournamentId -> { type -> urlCSV }
 * - Para Inferiores/Infantiles, tournamentId sigue el patrón:
 *   `${categoryId}-oficial-${year}`
 */
const SHEETS = {
  // Masculino Oficial 2025
  "oficial-2025": {
    primera: process.env.NEXT_PUBLIC_SHEET_OFICIAL_2025_URL,
    petit: process.env.NEXT_PUBLIC_SHEET_OFICIAL_PETIT_2025_URL,
    repechaje: process.env.NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2025_URL,
  },

  "supercopa-entre-rios-2023": {
    supercopa_grupo: process.env.NEXT_PUBLIC_SHEET_SUPERCOPA_GP_2023_URL,
    supercopa_playoffs: process.env.NEXT_PUBLIC_SHEET_SUPERCOPA_2023_URL,
  },

  "preparacion-2024": {
    prep_2024_grupo_a: process.env.NEXT_PUBLIC_SHEET_PREPARACION_GA_2024_URL,
    prep_2024_grupo_b: process.env.NEXT_PUBLIC_SHEET_PREPARACION_GB_2024_URL,
    prep_2024_playoffs: process.env.NEXT_PUBLIC_SHEET_PREPARACION_2024_URL,
  },

  "oficial-2024": {
    oficial_2024_liga: process.env.NEXT_PUBLIC_SHEET_OFICIAL_2024_URL,
    oficial_2024_petit: process.env.NEXT_PUBLIC_SHEET_OFICIAL_PETIT_2024_URL,
    oficial_2024_repechaje: process.env.NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2024_URL,
  },

  "preparacion-2025": {
    prep_2025_grupo_a: process.env.NEXT_PUBLIC_SHEET_PREPARACION_GA_2025_URL,
    prep_2025_grupo_b: process.env.NEXT_PUBLIC_SHEET_PREPARACION_GB_2025_URL,
    prep_2025_playoffs: process.env.NEXT_PUBLIC_SHEET_PREPARACION_2025_URL,
  },

  "oficial-2023": {
    primera: process.env.NEXT_PUBLIC_SHEET_OFICIAL_2023_URL,
    petit: process.env.NEXT_PUBLIC_SHEET_OFICIAL_PETIT_2023_URL,
    repechaje: process.env.NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2023_URL,
  },

  "preparacion-2026": {
    prep_2026_grupo_a: process.env.NEXT_PUBLIC_SHEET_PREPARACION_GA_2026_URL,
    prep_2026_grupo_b: process.env.NEXT_PUBLIC_SHEET_PREPARACION_GB_2026_URL,
    prep_2026_playoffs: process.env.NEXT_PUBLIC_SHEET_PREPARACION_2026_URL,
  },

  "oficial-2025-fem": {
    fem_oficial_2025_liga: process.env.NEXT_PUBLIC_SHEET_FEMENINO_2025_URL,
    fem_oficial_2025_repechaje: process.env.NEXT_PUBLIC_SHEET_FEMENINO_REPECHAJE_2025_URL,

    fem_oficial_2025_petit: process.env.NEXT_PUBLIC_SHEET_FEMENINO_PETIT_2025_URL,
    fem_oficial_2025_petit_playoffs: process.env.NEXT_PUBLIC_SHEET_FEMENINO_PETIT_2025_URL,
  },

  "oficial-2026-fem": {
    fem_oficial_2026_liga: process.env.NEXT_PUBLIC_SHEET_FEMENINO_2026_URL,
    fem_oficial_2026_repechaje: process.env.NEXT_PUBLIC_SHEET_FEMENINO_REPECHAJE_2026_URL,

    fem_oficial_2026_petit: process.env.NEXT_PUBLIC_SHEET_FEMENINO_PETIT_2026_URL,
    fem_oficial_2026_petit_playoffs: process.env.NEXT_PUBLIC_SHEET_FEMENINO_PETIT_2026_URL,
  },

  // Inferiores (ya los tenías)
  "tercera-oficial-2025": {
    inf_tercera_2025: process.env.NEXT_PUBLIC_SHEET_INF_TERCERA_2025_URL,
    inf_finales_tercera_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_TERCERA_2025_URL,
  },
  "cuarta-oficial-2025": {
    inf_cuarta_2025: process.env.NEXT_PUBLIC_SHEET_INF_CUARTA_2025_URL,
    inf_finales_cuarta_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CUARTA_2025_URL,
  },
  "quinta-oficial-2025": {
    inf_quinta_2025: process.env.NEXT_PUBLIC_SHEET_INF_QUINTA_2025_URL,
    inf_finales_quinta_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_QUINTA_2025_URL,
  },
  "sexta-oficial-2025": {
    inf_sexta_2025: process.env.NEXT_PUBLIC_SHEET_INF_SEXTA_2025_URL,
    inf_finales_sexta_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_SEXTA_2025_URL,
  },
  "septima-oficial-2025": {
    inf_septima_2025: process.env.NEXT_PUBLIC_SHEET_INF_SEPTIMA_2025_URL,
    inf_finales_septima_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_SEPTIMA_2025_URL,
  },

  "tercera-oficial-2026": {
    inf_tercera_2026: process.env.NEXT_PUBLIC_SHEET_INF_TERCERA_2026_URL,
    inf_finales_tercera_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_TERCERA_2026_URL,
  },
  "cuarta-oficial-2026": {
    inf_cuarta_2026: process.env.NEXT_PUBLIC_SHEET_INF_CUARTA_2026_URL,
    inf_finales_cuarta_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CUARTA_2026_URL,
  },
  "quinta-oficial-2026": {
    inf_quinta_2026: process.env.NEXT_PUBLIC_SHEET_INF_QUINTA_2026_URL,
    inf_finales_quinta_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_QUINTA_2026_URL,
  },
  "sexta-oficial-2026": {
    inf_sexta_2026: process.env.NEXT_PUBLIC_SHEET_INF_SEXTA_2026_URL,
    inf_finales_sexta_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_SEXTA_2026_URL,
  },
  "septima-oficial-2026": {
    inf_septima_2026: process.env.NEXT_PUBLIC_SHEET_INF_SEPTIMA_2026_URL,
    inf_finales_septima_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_SEPTIMA_2026_URL,
  },

  // =========================
  // Infantiles (A/B/C/D)
  // tournamentId esperado por tu config: "cat_a-oficial-2025", etc.
  // =========================

  "cat_a-oficial-2025": {
    inf_cat_a_2025: process.env.NEXT_PUBLIC_SHEET_INF_CAT_A_2025_URL,
    inf_finales_cat_a_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_A_2025_URL,
  },
  "cat_b-oficial-2025": {
    inf_cat_b_2025: process.env.NEXT_PUBLIC_SHEET_INF_CAT_B_2025_URL,
    inf_finales_cat_b_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_B_2025_URL,
  },
  "cat_c-oficial-2025": {
    inf_cat_c_2025: process.env.NEXT_PUBLIC_SHEET_INF_CAT_C_2025_URL,
    inf_finales_cat_c_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_C_2025_URL,
  },
  "cat_d-oficial-2025": {
    inf_cat_d_2025: process.env.NEXT_PUBLIC_SHEET_INF_CAT_D_2025_URL,
    inf_finales_cat_d_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_D_2025_URL,
  },

  // Infantiles 2026 (cuando existan envs)
  "cat_a-oficial-2026": {
    inf_cat_a_2026: process.env.NEXT_PUBLIC_SHEET_INF_CAT_A_2026_URL,
    inf_finales_cat_a_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_A_2026_URL,
  },
  "cat_b-oficial-2026": {
    inf_cat_b_2026: process.env.NEXT_PUBLIC_SHEET_INF_CAT_B_2026_URL,
    inf_finales_cat_b_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_B_2026_URL,
  },
  "cat_c-oficial-2026": {
    inf_cat_c_2026: process.env.NEXT_PUBLIC_SHEET_INF_CAT_C_2026_URL,
    inf_finales_cat_c_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_C_2026_URL,
  },
  "cat_d-oficial-2026": {
    inf_cat_d_2026: process.env.NEXT_PUBLIC_SHEET_INF_CAT_D_2026_URL,
    inf_finales_cat_d_2026: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_D_2026_URL,
  },

  // (Opcional, por si en algún momento usás IDs con guion sin underscore)
  "cat-a-oficial-2025": {
    inf_cat_a_2025: process.env.NEXT_PUBLIC_SHEET_INF_CAT_A_2025_URL,
    inf_finales_cat_a_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_A_2025_URL,
  },
  "cat-b-oficial-2025": {
    inf_cat_b_2025: process.env.NEXT_PUBLIC_SHEET_INF_CAT_B_2025_URL,
    inf_finales_cat_b_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_B_2025_URL,
  },
  "cat-c-oficial-2025": {
    inf_cat_c_2025: process.env.NEXT_PUBLIC_SHEET_INF_CAT_C_2025_URL,
    inf_finales_cat_c_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_C_2025_URL,
  },
  "cat-d-oficial-2025": {
    inf_cat_d_2025: process.env.NEXT_PUBLIC_SHEET_INF_CAT_D_2025_URL,
    inf_finales_cat_d_2025: process.env.NEXT_PUBLIC_SHEET_INF_FINALES_CAT_D_2025_URL,
  },
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const fallbackTournament = "oficial-2025";

    const type = String(searchParams.get("type") || "primera").trim().toLowerCase();
    const tournament = String(searchParams.get("tournament") || fallbackTournament)
      .trim()
      .toLowerCase();

    if (!type) {
      return NextResponse.json(
        { error: `Parámetro "type" vacío. Revisá tu config antes de llamar al API.` },
        { status: 400 }
      );
    }

    const tournamentMap = SHEETS[tournament] || SHEETS[fallbackTournament] || {};
    const sheetUrl = tournamentMap?.[type];

    if (!sheetUrl) {
      return NextResponse.json(
        {
          error: `No hay sheet configurada para tournament="${tournament}" type="${type}"`,
          tournamentUsed: SHEETS[tournament] ? tournament : `${fallbackTournament} (fallback)`,
          availableTournaments: Object.keys(SHEETS).sort(),
          availableTypesForTournament: Object.keys(tournamentMap || {}).sort(),
        },
        { status: 400 }
      );
    }

    const isBracket = BRACKET_TYPE_RE.test(type);

    if (isBracket) {
      const res = await fetch(sheetUrl, { cache: "no-store" });

      if (!res.ok) {
        return NextResponse.json(
          { error: `La sheet de llaves no respondió OK (status ${res.status}). Revisá que sea un link CSV público.` },
          { status: 502 }
        );
      }

      const csv = await res.text();
      const matrix = parseCSV(csv);

      if (!matrix.length) {
        return NextResponse.json(
          { error: "CSV vacío o no parseable. Revisá que el link sea export CSV y que tenga encabezados." },
          { status: 502 }
        );
      }

      const headers = (matrix[0] || []).map(normalizeHeader);
      const data = matrix.slice(1);

      // robusto: acepta variaciones razonables de headers
      const idxEquipo = indexOfAny(headers, ["equipo", "club", "team"]);
      const idxEtapa = indexOfAny(headers, ["etapa", "fase", "round"]);

      const idxResultado = indexOfAny(headers, ["resultado", "global"]);
      const idxPenales = indexOfAny(headers, ["penales", "penal", "pen"]);

      const idxIda = indexOfAny(headers, ["resultado ida", "ida"]);
      const idxVuelta = indexOfAny(headers, ["resultado vuelta", "vuelta"]);

      if (idxEquipo < 0 || idxEtapa < 0) {
        return NextResponse.json(
          {
            error: `Encabezados inválidos en llaves. Necesito al menos "equipo" y "etapa".`,
            headersDetectados: headers,
          },
          { status: 502 }
        );
      }

      const get = (row, idx) => (idx >= 0 ? String(row[idx] ?? "").trim() : "");

      const rows = data
        .map((r) => ({
          equipo: get(r, idxEquipo),
          etapa: get(r, idxEtapa),

          resultado: get(r, idxResultado),
          penales: get(r, idxPenales),

          ida: get(r, idxIda),
          vuelta: get(r, idxVuelta),
        }))
        .filter((x) => x.equipo && x.etapa);

      return NextResponse.json({ rows });
    }

    // Standings
    const equipos = await obtenerEquiposOrdenadosDesdeSheet(sheetUrl);
    return NextResponse.json({ equipos });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Error al obtener tabla" }, { status: 500 });
  }
}
