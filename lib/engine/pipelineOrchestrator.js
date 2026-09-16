/**
 * lib/engine/pipelineOrchestrator.js
 *
 * Módulo central para procesar publicaciones deportivas, carruseles de imágenes
 * y datasets de Apify, guardando resultados, tablas y noticias en Neon DB.
 */

import { prisma } from "../prisma.js";
import { parseGraphicWithGemini } from "../ai/geminiParser.js";
import { applyStandings } from "./standingsEngine.js";
import { applyMatches } from "./matchEngine.js";

export function resolveTournamentId(categoria, seasonYear = "2026") {
  switch (categoria) {
    case "PRIMERA_MASCULINO":
      return `oficial-${seasonYear}`;
    case "PRIMERA_FEMENINO":
      return `oficial-${seasonYear}-fem`;
    case "TERCERA_RESERVA":
      return `tercera-oficial-${seasonYear}`;
    case "CUARTA":
      return `cuarta-oficial-${seasonYear}`;
    case "QUINTA":
      return `quinta-oficial-${seasonYear}`;
    case "SEXTA":
      return `sexta-oficial-${seasonYear}`;
    case "SEPTIMA":
      return `septima-oficial-${seasonYear}`;
    case "CAT_A":
      return `cat_a-oficial-${seasonYear}`;
    case "CAT_B":
      return `cat_b-oficial-${seasonYear}`;
    case "CAT_C":
      return `cat_c-oficial-${seasonYear}`;
    case "CAT_D":
      return `cat_d-oficial-${seasonYear}`;
    default:
      return `oficial-${seasonYear}`;
  }
}

export function resolvePhaseSlug(nombreFase = "") {
  const norm = String(nombreFase || "").toLowerCase();
  if (norm.includes("petit")) return "petit";
  if (norm.includes("repechaje")) return "repechaje";
  if (norm.includes("playoff") || norm.includes("final")) return "playoffs";
  if (norm.includes("grupo a")) return "grupo-a";
  if (norm.includes("grupo b")) return "grupo-b";
  return "fase-regular";
}

export function extractImagesFromItem(item) {
  if (Array.isArray(item.childPosts) && item.childPosts.length > 0) {
    const urls = item.childPosts.map((c) => c.displayUrl || c.imageUrl).filter(Boolean);
    if (urls.length > 0) return urls;
  }
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images.filter(Boolean);
  }
  if (Array.isArray(item.displayUrl)) {
    return item.displayUrl.filter(Boolean);
  }
  if (typeof item.displayUrl === "string") return [item.displayUrl];
  if (typeof item.imageUrl === "string") return [item.imageUrl];
  return [];
}

export async function processSinglePost(item) {
  const postId = String(item.id || item.shortCode || item.postId || `post-${Date.now()}`);
  const sourceAccount =
    item.ownerUsername ||
    item.sourceAccount ||
    (item.owner && item.owner.username) ||
    "ligagualeguay";
  const postUrl = item.url || item.postUrl || `https://instagram.com/p/${postId}`;
  const caption = item.caption || item.text || "";

  const hasBuffer = !!item.imageBuffer;
  let imageUrls = [];
  if (item.imageBuffer) {
    // Si viene como buffer directo en local
    imageUrls = [{ buffer: item.imageBuffer, mimeType: item.mimeType || "image/jpeg" }];
  } else {
    imageUrls = extractImagesFromItem(item);
  }

  if (imageUrls.length === 0) {
    return { postId, status: "SKIPPED_NO_IMAGES" };
  }

  // Verificar si ya fue procesado
  const alreadyProcessed = await prisma.ingestedSocialPost.findUnique({
    where: { id: postId },
  });

  if (alreadyProcessed && alreadyProcessed.status === "SUCCESS") {
    return { postId, status: "SKIPPED_DUPLICATE" };
  }

  const report = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const media = imageUrls[i];
    const isBuffer = typeof media === "object" && media.buffer;
    const url = isBuffer ? null : media;

    try {
      const parsed = isBuffer
        ? await parseGraphicWithGemini({
            imageBuffer: media.buffer,
            mimeType: media.mimeType,
            captionHint: caption,
          })
        : await parseGraphicWithGemini({
            imageUrl: url,
            captionHint: caption,
          });

      // Filtrar contenido no relevante o ajeno a la liga
      if (parsed.tipoContenido === "OTRO") {
        report.push({
          imageIndex: i,
          tipoContenido: "OTRO",
          status: "SKIPPED_IRRELEVANT",
          categoria: parsed.categoria,
        });
        continue;
      }

      const tourId = resolveTournamentId(parsed.categoria);
      const phaseSlug = resolvePhaseSlug(parsed.nombreFase);

      let actionResult = null;

      if (parsed.tipoContenido === "TABLA_POSICIONES") {
        actionResult = await applyStandings(tourId, phaseSlug, parsed.tabla);
      } else if (
        parsed.tipoContenido === "RESULTADOS_FECHA" ||
        parsed.tipoContenido === "FIXTURE_PROXIMA_FECHA"
      ) {
        const enrichedMatches = (parsed.partidos || []).map((m) => {
          const num = m.roundNumber || parsed.numeroFecha;
          const name = m.roundName || m.round || (num ? `Fecha ${num}` : "Fecha");
          return {
            ...m,
            roundName: name,
            roundNumber: num ? parseInt(num, 10) : null,
          };
        });
        actionResult = await applyMatches(tourId, enrichedMatches, phaseSlug);
      }

      // Crear noticia institucional si corresponde
      if (parsed.titularNoticia && parsed.copeteNoticia && parsed.tipoContenido !== "OTRO") {
        const slug = `${parsed.titularNoticia
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}-${Date.now()}`.slice(0, 80);

        await prisma.news.create({
          data: {
            title: parsed.titularNoticia,
            slug,
            summary: parsed.copeteNoticia,
            category: "Fútbol",
            tags: ["Liga", "Resultados"],
            imageUrl: url || "/inicio/Proximo-Partido-Fondo.png",
            source: "Instagram",
            sourceUrl: postUrl,
            publishedAt: new Date(),
          },
        });
      }

      report.push({
        imageIndex: i,
        categoria: parsed.categoria,
        tipoContenido: parsed.tipoContenido,
        tournamentId: tourId,
        phaseSlug,
        actionResult,
      });
    } catch (err) {
      console.error(`Error procesando diapositiva ${i}:`, err.message);
      report.push({
        imageIndex: i,
        error: err.message,
      });
    }
  }

  // Registrar en auditoría
  await prisma.ingestedSocialPost.upsert({
    where: { id: postId },
    update: {
      status: "SUCCESS",
      processedAt: new Date(),
      aiExtractedData: report,
    },
    create: {
      id: postId,
      sourceAccount,
      postUrl,
      caption,
      mediaUrls: hasBuffer ? ["local-file"] : imageUrls.filter((u) => typeof u === "string"),
      status: "SUCCESS",
      aiExtractedData: report,
    },
  });

  return { postId, slidesProcessed: report.length, report };
}

export async function processApifyDataset(datasetId) {
  console.log(`📡 Descargando dataset ${datasetId} desde Apify...`);
  const apifyRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&format=json`
  );
  if (!apifyRes.ok) {
    throw new Error(`No se pudo obtener el dataset ${datasetId} de Apify (${apifyRes.status})`);
  }

  const items = await apifyRes.json();
  console.log(`📦 Se encontraron ${items.length} publicaciones en el dataset.`);

  const results = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`\n⏳ Procesando post ${i + 1}/${items.length} (ID: ${item.id || item.shortCode || "sin-id"})...`);
    const res = await processSinglePost(item);
    results.push(res);
  }

  return results;
}
