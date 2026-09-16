/**
 * scripts/bulk-ingest.mjs
 *
 * Herramienta CLI para procesar publicaciones en masa (MODO BULK):
 * 1. Desde un Dataset de Apify:  node scripts/bulk-ingest.mjs --dataset <datasetId>
 * 2. Desde una carpeta local:    node scripts/bulk-ingest.mjs --folder ./imagenes-acumuladas
 * 3. Desde URLs de imágenes:     node scripts/bulk-ingest.mjs --urls https://... https://...
 *
 * Persiste tablas, resultados y noticias en Neon DB usando Gemini 2.5 Flash.
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma.js";
import { processSinglePost, processApifyDataset } from "../lib/engine/pipelineOrchestrator.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
===========================================================
  CABN - Pipeline de Carga Masiva (Modo Bulk)
===========================================================
Uso:
  1) Desde Dataset de Apify:
     node scripts/bulk-ingest.mjs --dataset <datasetId>

  2) Desde una carpeta con fotos locales:
     node scripts/bulk-ingest.mjs --folder <ruta_a_carpeta>

  3) Desde una o más URLs directas de fotos:
     node scripts/bulk-ingest.mjs --urls <url1> <url2> ...

Ejemplos:
  node scripts/bulk-ingest.mjs --dataset lA7d91kQm92
  node scripts/bulk-ingest.mjs --folder ./data/pendientes
===========================================================
`);
    process.exit(0);
  }

  const mode = args[0];

  if (mode === "--dataset") {
    const datasetId = args[1];
    if (!datasetId) {
      console.error("❌ Error: Debes especificar el ID del dataset de Apify.");
      process.exit(1);
    }
    console.log(`🚀 Iniciando ingesta masiva desde Dataset de Apify: ${datasetId}`);
    const results = await processApifyDataset(datasetId);
    console.log(`\n✅ Proceso completado. Total de publicaciones procesadas: ${results.length}`);
    console.log(JSON.stringify(results, null, 2));
  } else if (mode === "--folder") {
    const folderPath = path.resolve(process.cwd(), args[1]);
    if (!fs.existsSync(folderPath)) {
      console.error(`❌ Error: La carpeta no existe: ${folderPath}`);
      process.exit(1);
    }

    const files = fs.readdirSync(folderPath).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
    });

    if (files.length === 0) {
      console.log(`⚠️ No se encontraron imágenes en la carpeta: ${folderPath}`);
      process.exit(0);
    }

    console.log(`🚀 Se encontraron ${files.length} imágenes para procesar en: ${folderPath}`);

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = path.join(folderPath, fileName);
      console.log(`\n⏳ [${i + 1}/${files.length}] Procesando imagen: ${fileName}...`);

      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(fileName).toLowerCase();
      const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      const cleanCaption = fileName.replace(/[-_]/g, " ").replace(/\.[^/.]+$/, "");

      const res = await processSinglePost({
        id: `local-file-${path.parse(fileName).name}-${Date.now()}`,
        sourceAccount: "carga_manual",
        caption: `Archivo: ${cleanCaption}`,
        imageBuffer: buffer,
        mimeType,
      });

      results.push({ file: fileName, result: res });
    }

    console.log(`\n🎉 Ingesta masiva finalizada.`);
    console.log(JSON.stringify(results, null, 2));
  } else if (mode === "--urls") {
    const urls = args.slice(1);
    if (urls.length === 0) {
      console.error("❌ Error: Debes proporcionar al menos una URL.");
      process.exit(1);
    }

    console.log(`🚀 Procesando ${urls.length} URLs...`);
    const results = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`\n⏳ [${i + 1}/${urls.length}] Procesando URL: ${url}...`);

      const res = await processSinglePost({
        id: `url-ingest-${Date.now()}-${i}`,
        sourceAccount: "carga_url",
        caption: "Carga vía URL",
        images: [url],
      });

      results.push({ url, result: res });
    }

    console.log(`\n🎉 Ingesta completada.`);
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.error(`❌ Opción desconocida: ${mode}. Ejecuta sin argumentos para ver la ayuda.`);
  }
}

main()
  .catch((err) => {
    console.error("❌ Error fatal en proceso masivo:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
