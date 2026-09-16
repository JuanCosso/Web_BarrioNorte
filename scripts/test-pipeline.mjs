/**
 * scripts/test-pipeline.mjs
 *
 * Script de prueba para ejecutar el pipeline de Gemini + Neon DB
 * directamente desde la terminal con una imagen local o remota.
 *
 * USO:
 *   node scripts/test-pipeline.mjs <ruta_a_imagen_o_url>
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { parseGraphicWithGemini } from "../lib/ai/geminiParser.js";
import { applyStandings } from "../lib/engine/standingsEngine.js";
import { applyMatches } from "../lib/engine/matchEngine.js";
import { prisma } from "../lib/prisma.js";

async function main() {
  const target = process.argv[2];

  if (!target) {
    console.log("⚠️ Uso: node scripts/test-pipeline.mjs <ruta_a_imagen_o_url>");
    console.log("Ejemplo: node scripts/test-pipeline.mjs ./test-flyer.jpg");
    process.exit(1);
  }

  console.log("🚀 Iniciando prueba del Pipeline Multimodal...");
  console.log(`📁 Analizando objetivo: ${target}`);

  let parsed;

  if (target.startsWith("http://") || target.startsWith("https://")) {
    console.log("🌐 Procesando imagen desde URL...");
    parsed = await parseGraphicWithGemini({ imageUrl: target });
  } else {
    console.log("💻 Leyendo archivo local...");
    const filePath = path.resolve(process.cwd(), target);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }
    const buffer = fs.readFileSync(filePath);
    parsed = await parseGraphicWithGemini({ imageBuffer: buffer });
  }

  console.log("\n✨ Extracción de Gemini completada con éxito:");
  console.log("  • Categoría detectada: ", parsed.categoria);
  console.log("  • Tipo de contenido:   ", parsed.tipoContenido);
  console.log("  • Número de fecha:     ", parsed.numeroFecha);
  console.log("  • Fase:                ", parsed.nombreFase);
  if (parsed.titularNoticia) {
    console.log("  • Titular propuesto:   ", parsed.titularNoticia);
    console.log("  • Copete:              ", parsed.copeteNoticia);
  }

  const tourId = "oficial-2026";
  const phaseSlug = parsed.nombreFase?.toLowerCase().includes("petit") ? "petit" : "fase-regular";

  if (parsed.tipoContenido === "TABLA_POSICIONES") {
    console.log("\n📊 Aplicando validación matemática y persistiendo tabla en Neon DB...");
    const res = await applyStandings(tourId, phaseSlug, parsed.tabla);
    console.log("Resultado:", res);
  } else if (parsed.tipoContenido === "RESULTADOS_FECHA" || parsed.tipoContenido === "FIXTURE_PROXIMA_FECHA") {
    console.log("\n⚽ Mapeando clubes y persistiendo partidos en Neon DB...");
    const res = await applyMatches(tourId, parsed.partidos, phaseSlug);
    console.log("Resultado:", res);
  }

  console.log("\n🎉 Prueba finalizada con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error en la prueba:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
