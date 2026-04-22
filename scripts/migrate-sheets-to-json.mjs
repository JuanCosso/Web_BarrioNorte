/**
 * migrate-sheets-to-json.mjs
 *
 * Lee todas las Google Sheets configuradas en el proyecto,
 * descarga cada CSV y genera los archivos JSON correspondientes
 * en data/local/{año}/{tournament}/{type}.json
 *
 * USO:
 *   node scripts/migrate-sheets-to-json.mjs
 *
 * REQUISITOS:
 *   - Tener .env.local con las URLs de las Sheets
 *   - Correr desde la raíz del proyecto Next.js
 *
 * NOTA: Las Sheets que no tengan URL configurada (env var vacía)
 * se saltean silenciosamente y se genera un JSON vacío de plantilla.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─────────────────────────────────────────────
// 1. LEER .env.local (o .env como fallback)
// ─────────────────────────────────────────────
function loadEnv() {
  const env = {};
  const files = [".env.local", ".env"];
  for (const file of files) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in env)) env[key] = val; // .env.local tiene prioridad
    }
  }
  return env;
}

// ─────────────────────────────────────────────
// 2. MAPA COMPLETO: tournament → type → ENV_VAR
//    (espejo exacto del SHEETS en route.js)
// ─────────────────────────────────────────────
const SHEETS_ENV = {
  // ── MASCULINO ──────────────────────────────
  "oficial-2023": {
    primera:   "NEXT_PUBLIC_SHEET_OFICIAL_2023_URL",
    petit:     "NEXT_PUBLIC_SHEET_OFICIAL_PETIT_2023_URL",
    repechaje: "NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2023_URL",
  },
  "supercopa-entre-rios-2023": {
    supercopa_grupo:    "NEXT_PUBLIC_SHEET_SUPERCOPA_GP_2023_URL",
    supercopa_playoffs: "NEXT_PUBLIC_SHEET_SUPERCOPA_2023_URL",
  },
  "preparacion-2024": {
    prep_2024_grupo_a: "NEXT_PUBLIC_SHEET_PREPARACION_GA_2024_URL",
    prep_2024_grupo_b: "NEXT_PUBLIC_SHEET_PREPARACION_GB_2024_URL",
    prep_2024_playoffs: "NEXT_PUBLIC_SHEET_PREPARACION_2024_URL",
  },
  "oficial-2024": {
    oficial_2024_liga:      "NEXT_PUBLIC_SHEET_OFICIAL_2024_URL",
    oficial_2024_petit:     "NEXT_PUBLIC_SHEET_OFICIAL_PETIT_2024_URL",
    oficial_2024_repechaje: "NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2024_URL",
  },
  "preparacion-2025": {
    prep_2025_grupo_a:  "NEXT_PUBLIC_SHEET_PREPARACION_GA_2025_URL",
    prep_2025_grupo_b:  "NEXT_PUBLIC_SHEET_PREPARACION_GB_2025_URL",
    prep_2025_playoffs: "NEXT_PUBLIC_SHEET_PREPARACION_2025_URL",
  },
  "oficial-2025": {
    primera:   "NEXT_PUBLIC_SHEET_OFICIAL_2025_URL",
    petit:     "NEXT_PUBLIC_SHEET_OFICIAL_PETIT_2025_URL",
    repechaje: "NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2025_URL",
  },
  "preparacion-2026": {
    prep_2026_grupo_a:  "NEXT_PUBLIC_SHEET_PREPARACION_GA_2026_URL",
    prep_2026_grupo_b:  "NEXT_PUBLIC_SHEET_PREPARACION_GB_2026_URL",
    prep_2026_playoffs: "NEXT_PUBLIC_SHEET_PREPARACION_2026_URL",
  },
  "oficial-2026": {
    oficial_2026_liga:      "NEXT_PUBLIC_SHEET_OFICIAL_2026_URL",
    oficial_2026_repechaje: "NEXT_PUBLIC_SHEET_OFICIAL_REPECHAJE_2026_URL",
    oficial_2026_petit:     "NEXT_PUBLIC_SHEET_OFICIAL_PETIT_2026_URL",
  },

  // ── FEMENINO ───────────────────────────────
  "oficial-2025-fem": {
    fem_oficial_2025_liga:          "NEXT_PUBLIC_SHEET_FEMENINO_2025_URL",
    fem_oficial_2025_repechaje:     "NEXT_PUBLIC_SHEET_FEMENINO_REPECHAJE_2025_URL",
    fem_oficial_2025_petit:         "NEXT_PUBLIC_SHEET_FEMENINO_PETIT_2025_URL",
    fem_oficial_2025_petit_playoffs:"NEXT_PUBLIC_SHEET_FEMENINO_PETIT_2025_URL",
  },
  "oficial-2026-fem": {
    fem_oficial_2026_liga:          "NEXT_PUBLIC_SHEET_FEMENINO_2026_URL",
    fem_oficial_2026_repechaje:     "NEXT_PUBLIC_SHEET_FEMENINO_REPECHAJE_2026_URL",
    fem_oficial_2026_petit:         "NEXT_PUBLIC_SHEET_FEMENINO_PETIT_2026_URL",
    fem_oficial_2026_petit_playoffs:"NEXT_PUBLIC_SHEET_FEMENINO_PETIT_2026_URL",
  },

  // ── INFERIORES 2025 ────────────────────────
  "tercera-oficial-2025": {
    inf_tercera_2025:        "NEXT_PUBLIC_SHEET_INF_TERCERA_2025_URL",
    inf_finales_tercera_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_TERCERA_2025_URL",
  },
  "cuarta-oficial-2025": {
    inf_cuarta_2025:        "NEXT_PUBLIC_SHEET_INF_CUARTA_2025_URL",
    inf_finales_cuarta_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_CUARTA_2025_URL",
  },
  "quinta-oficial-2025": {
    inf_quinta_2025:        "NEXT_PUBLIC_SHEET_INF_QUINTA_2025_URL",
    inf_finales_quinta_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_QUINTA_2025_URL",
  },
  "sexta-oficial-2025": {
    inf_sexta_2025:        "NEXT_PUBLIC_SHEET_INF_SEXTA_2025_URL",
    inf_finales_sexta_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_SEXTA_2025_URL",
  },
  "septima-oficial-2025": {
    inf_septima_2025:        "NEXT_PUBLIC_SHEET_INF_SEPTIMA_2025_URL",
    inf_finales_septima_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_SEPTIMA_2025_URL",
  },

  // ── INFERIORES 2026 ────────────────────────
  "tercera-oficial-2026": {
    inf_tercera_2026:        "NEXT_PUBLIC_SHEET_INF_TERCERA_2026_URL",
    inf_finales_tercera_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_TERCERA_2026_URL",
  },
  "cuarta-oficial-2026": {
    inf_cuarta_2026:        "NEXT_PUBLIC_SHEET_INF_CUARTA_2026_URL",
    inf_finales_cuarta_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_CUARTA_2026_URL",
  },
  "quinta-oficial-2026": {
    inf_quinta_2026:        "NEXT_PUBLIC_SHEET_INF_QUINTA_2026_URL",
    inf_finales_quinta_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_QUINTA_2026_URL",
  },
  "sexta-oficial-2026": {
    inf_sexta_2026:        "NEXT_PUBLIC_SHEET_INF_SEXTA_2026_URL",
    inf_finales_sexta_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_SEXTA_2026_URL",
  },
  "septima-oficial-2026": {
    inf_septima_2026:        "NEXT_PUBLIC_SHEET_INF_SEPTIMA_2026_URL",
    inf_finales_septima_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_SEPTIMA_2026_URL",
  },

  // ── INFANTILES 2025 ────────────────────────
  "cat_a-oficial-2025": {
    inf_cat_a_2025:        "NEXT_PUBLIC_SHEET_INF_CAT_A_2025_URL",
    inf_finales_cat_a_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_CAT_A_2025_URL",
  },
  "cat_b-oficial-2025": {
    inf_cat_b_2025:        "NEXT_PUBLIC_SHEET_INF_CAT_B_2025_URL",
    inf_finales_cat_b_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_CAT_B_2025_URL",
  },
  "cat_c-oficial-2025": {
    inf_cat_c_2025:        "NEXT_PUBLIC_SHEET_INF_CAT_C_2025_URL",
    inf_finales_cat_c_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_CAT_C_2025_URL",
  },
  "cat_d-oficial-2025": {
    inf_cat_d_2025:        "NEXT_PUBLIC_SHEET_INF_CAT_D_2025_URL",
    inf_finales_cat_d_2025:"NEXT_PUBLIC_SHEET_INF_FINALES_CAT_D_2025_URL",
  },

  // ── INFANTILES 2026 ────────────────────────
  "cat_a-oficial-2026": {
    inf_cat_a_2026:        "NEXT_PUBLIC_SHEET_INF_CAT_A_2026_URL",
    inf_finales_cat_a_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_CAT_A_2026_URL",
  },
  "cat_b-oficial-2026": {
    inf_cat_b_2026:        "NEXT_PUBLIC_SHEET_INF_CAT_B_2026_URL",
    inf_finales_cat_b_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_CAT_B_2026_URL",
  },
  "cat_c-oficial-2026": {
    inf_cat_c_2026:        "NEXT_PUBLIC_SHEET_INF_CAT_C_2026_URL",
    inf_finales_cat_c_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_CAT_C_2026_URL",
  },
  "cat_d-oficial-2026": {
    inf_cat_d_2026:        "NEXT_PUBLIC_SHEET_INF_CAT_D_2026_URL",
    inf_finales_cat_d_2026:"NEXT_PUBLIC_SHEET_INF_FINALES_CAT_D_2026_URL",
  },
};

// ─────────────────────────────────────────────
// 3. CSV PARSING (idéntico al de route.js)
// ─────────────────────────────────────────────
const BRACKET_TYPE_RE = /(repechaje|playoffs|eliminatorias|finales|semifinal|final)/i;

function parseCSV(text) {
  const rows = [];
  let row = [], cur = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; continue; }
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (!inQuotes && (ch === "," || ch === "\n" || ch === "\r")) {
      if (ch === "\r") continue;
      row.push(cur); cur = "";
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
  return String(h || "").replace(/^\uFEFF/, "").trim().toLowerCase();
}

function indexOfAny(headers, candidates) {
  for (const c of candidates) {
    const idx = headers.indexOf(c);
    if (idx >= 0) return idx;
  }
  return -1;
}

function parseStandings(matrix) {
  const headers = (matrix[0] || []).map(normalizeHeader);
  const data = matrix.slice(1);

  const idxName = indexOfAny(headers, ["equipo", "club", "team", "nombre"]);
  const idxPj   = indexOfAny(headers, ["pj"]);
  const idxPg   = indexOfAny(headers, ["pg"]);
  const idxPe   = indexOfAny(headers, ["pe"]);
  const idxPp   = indexOfAny(headers, ["pp"]);
  const idxGm   = indexOfAny(headers, ["gm", "gf", "goles a favor"]);
  const idxGc   = indexOfAny(headers, ["gc", "goles en contra"]);
  const idxDg   = indexOfAny(headers, ["dg", "diferencia", "dif"]);

  const get = (row, idx) => (idx >= 0 ? String(row[idx] ?? "").trim() : "");
  const num = (v) => Number(v) || 0;

  return data
    .map((r) => {
      const name = get(r, idxName);
      if (!name) return null;
      return {
        name,
        pj: num(get(r, idxPj)),
        pg: num(get(r, idxPg)),
        pe: num(get(r, idxPe)),
        pp: num(get(r, idxPp)),
        gm: num(get(r, idxGm)),
        gc: num(get(r, idxGc)),
        dg: num(get(r, idxDg)),
      };
    })
    .filter(Boolean);
}

function parseBracket(matrix) {
  const headers = (matrix[0] || []).map(normalizeHeader);
  const data = matrix.slice(1);

  const idxEquipo    = indexOfAny(headers, ["equipo", "club", "team"]);
  const idxEtapa     = indexOfAny(headers, ["etapa", "fase", "round"]);
  const idxResultado = indexOfAny(headers, ["resultado", "global"]);
  const idxPenales   = indexOfAny(headers, ["penales", "penal", "pen"]);
  const idxIda       = indexOfAny(headers, ["resultado ida", "ida"]);
  const idxVuelta    = indexOfAny(headers, ["resultado vuelta", "vuelta"]);

  const get = (row, idx) => (idx >= 0 ? String(row[idx] ?? "").trim() : "");

  return data
    .map((r) => ({
      equipo:    get(r, idxEquipo),
      etapa:     get(r, idxEtapa),
      resultado: get(r, idxResultado),
      penales:   get(r, idxPenales),
      ida:       get(r, idxIda),
      vuelta:    get(r, idxVuelta),
    }))
    .filter((x) => x.equipo && x.etapa);
}

// ─────────────────────────────────────────────
// 4. EXTRAER AÑO DEL TOURNAMENT ID
// ─────────────────────────────────────────────
function extractYear(tournament) {
  const match = tournament.match(/(\d{4})/);
  return match ? match[1] : "misc";
}

// ─────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────
async function main() {
  const env = loadEnv();

  console.log("\n🚀 Iniciando migración de Google Sheets → JSON\n");

  const stats = { ok: 0, empty: 0, skipped: 0, error: 0 };

  for (const [tournament, types] of Object.entries(SHEETS_ENV)) {
    const year = extractYear(tournament);

    for (const [type, envVar] of Object.entries(types)) {
      const url = env[envVar];
      const isBracket = BRACKET_TYPE_RE.test(type);

      // Carpeta destino: data/local/{año}/{tournament}/
      const outDir = path.join(ROOT, "data", "local", year, tournament);
      const outFile = path.join(outDir, `${type}.json`);

      // Si el JSON ya existe y la URL no está configurada → saltar
      if (!url) {
        const emptyPayload = isBracket ? { rows: [] } : { equipos: [] };
        fs.mkdirSync(outDir, { recursive: true });

        // No sobreescribir si ya existe con datos
        if (fs.existsSync(outFile)) {
          console.log(`  ⏭  [${tournament}/${type}] Sin URL (ya existe JSON, se mantiene)`);
          stats.skipped++;
          continue;
        }

        fs.writeFileSync(outFile, JSON.stringify(emptyPayload, null, 2), "utf-8");
        console.log(`  📄 [${tournament}/${type}] Sin URL → plantilla vacía generada`);
        stats.empty++;
        continue;
      }

      // Fetch CSV
      try {
        process.stdout.write(`  ⬇  [${tournament}/${type}] Descargando...`);
        const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });

        if (!res.ok) {
          console.log(` ❌ HTTP ${res.status}`);
          stats.error++;
          continue;
        }

        const csv = await res.text();
        const matrix = parseCSV(csv);

        if (!matrix.length) {
          console.log(` ⚠  CSV vacío`);
          stats.empty++;
          continue;
        }

        const payload = isBracket
          ? { rows: parseBracket(matrix) }
          : { equipos: parseStandings(matrix) };

        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf-8");

        const count = isBracket ? payload.rows.length : payload.equipos.length;
        console.log(` ✅ ${count} registros → data/local/${year}/${tournament}/${type}.json`);
        stats.ok++;

      } catch (err) {
        console.log(` ❌ Error: ${err.message}`);
        stats.error++;
      }
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Exitosos:   ${stats.ok}`);
  console.log(`📄 Vacíos/plantilla: ${stats.empty}`);
  console.log(`⏭  Saltados:  ${stats.skipped}`);
  console.log(`❌ Errores:   ${stats.error}`);
  console.log("──────────────────────────────────────────\n");
  console.log("Próximo paso:");
  console.log("  1. Revisá los JSON generados en data/local/{año}/");
  console.log("  2. Reemplazá app/api/tabla-posiciones/route.js con el nuevo (route.new.js)");
  console.log("  3. Eliminá o vaciá las variables de entorno de las Sheets\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
