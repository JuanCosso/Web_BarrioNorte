/**
 * app/api/pipeline/webhook/route.js
 *
 * Endpoint del Pipeline Asíncrono de Ingesta, Validación y Persistencia en Neon DB.
 * Recibe cargas desde Apify, cron jobs o disparadores externos con imágenes de Instagram.
 */

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { processSinglePost, processApifyDataset } from "../../../../lib/engine/pipelineOrchestrator.js";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();

    let overallResults = [];

    // Caso 1: Payload estándar de Webhook Apify (Run Succeeded con defaultDatasetId)
    const datasetId =
      body.resource?.defaultDatasetId ||
      body.eventData?.defaultDatasetId ||
      body.defaultDatasetId;

    if (datasetId) {
      overallResults = await processApifyDataset(datasetId);
    } else {
      let itemsToProcess = [];
      if (Array.isArray(body)) {
        itemsToProcess = body;
      } else if (Array.isArray(body.items)) {
        itemsToProcess = body.items;
      } else {
        itemsToProcess = [body];
      }

      for (const item of itemsToProcess) {
        const result = await processSinglePost(item);
        overallResults.push(result);
      }
    }

    // 4. Revalidación en demanda de Next.js
    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/futbol/primera");
      revalidatePath("/futbol/femenino");
      revalidatePath("/noticias");
    } catch (revalErr) {
      console.warn("Aviso en revalidación de caché:", revalErr.message);
    }

    return NextResponse.json({
      success: true,
      processedPostsCount: overallResults.length,
      results: overallResults,
    });
  } catch (error) {
    console.error("Error en pipeline webhook:", error);
    return NextResponse.json(
      { error: error.message || "Error procesando webhook" },
      { status: 500 }
    );
  }
}
