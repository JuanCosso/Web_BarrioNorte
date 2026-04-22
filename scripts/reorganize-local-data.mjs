/**
 * reorganize-local-data.mjs
 *
 * Mueve los archivos ya existentes en data/local/{tournament}/
 * a la nueva estructura data/local/{año}/{tournament}/
 *
 * USO (desde la raíz del proyecto):
 *   node scripts/reorganize-local-data.mjs
 *
 * - Solo mueve carpetas que tengan un año en el nombre (ej: "tercera-oficial-2026")
 * - No toca carpetas que ya estén organizadas por año
 * - Muestra un resumen de lo que movió
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DIR = path.resolve(__dirname, "..", "data", "local");

function extractYear(name) {
  const m = name.match(/(\d{4})/);
  return m ? m[1] : null;
}

function moveDir(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(src, dest);
}

async function main() {
  if (!fs.existsSync(LOCAL_DIR)) {
    console.log("⚠  No existe data/local/ — nada que reorganizar.");
    return;
  }

  const entries = fs.readdirSync(LOCAL_DIR, { withFileTypes: true });
  let moved = 0;
  let skipped = 0;

  console.log("\n🗂  Reorganizando data/local/ por año...\n");

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const name = entry.name;

    // Si el nombre es un año puro (ej: "2025", "2026") ya está organizado → skip
    if (/^\d{4}$/.test(name)) {
      console.log(`  ⏭  /${name}/ → ya es carpeta de año, se omite`);
      skipped++;
      continue;
    }

    const year = extractYear(name);
    if (!year) {
      console.log(`  ⚠  /${name}/ → no tiene año en el nombre, se omite`);
      skipped++;
      continue;
    }

    const src  = path.join(LOCAL_DIR, name);
    const dest = path.join(LOCAL_DIR, year, name);

    if (fs.existsSync(dest)) {
      console.log(`  ⏭  /${name}/ → destino ya existe (/${year}/${name}/), se omite`);
      skipped++;
      continue;
    }

    moveDir(src, dest);
    console.log(`  ✅ /${name}/ → /local/${year}/${name}/`);
    moved++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Movidos:  ${moved}`);
  console.log(`⏭  Omitidos: ${skipped}`);
  console.log("──────────────────────────────────────────\n");
  console.log("Próximo paso: reemplazá route.js con la versión corregida.\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
