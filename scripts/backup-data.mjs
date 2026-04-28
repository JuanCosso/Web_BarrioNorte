/**
 * backup-data.mjs
 *
 * Copia data/local/2026/ → data/backups/{YYYY-MM-DD}/
 *
 * USO:
 *   node scripts/backup-data.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const SRC       = path.join(ROOT, "data", "local", "2026");
const DEST_BASE = path.join(ROOT, "data", "backups");

function todayLabel() {
  return new Date().toISOString().slice(0, 10); // "2026-04-27"
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

const label   = todayLabel();
const destDir = path.join(DEST_BASE, label);

console.log(`\n💾 Copiando data/local/2026/ → data/backups/${label}/\n`);
copyDir(SRC, destDir);

let count = 0;
function countFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    e.isDirectory() ? countFiles(path.join(dir, e.name)) : count++;
  }
}
countFiles(destDir);

console.log(`✅ ${count} archivos respaldados en data/backups/${label}/\n`);