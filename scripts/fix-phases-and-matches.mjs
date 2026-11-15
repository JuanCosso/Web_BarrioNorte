import { prisma } from "../lib/prisma.js";

async function main() {
  console.log("Iniciando regularización de fases y partidos en Neon DB...");

  // 1. Helper para asegurar que una fase exista
  async function ensurePhase(tournamentId, name, slug, order = 2) {
    const tour = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tour) return null;
    let phase = await prisma.tournamentPhase.findFirst({
      where: { tournamentId, slug },
    });
    if (!phase) {
      phase = await prisma.tournamentPhase.create({
        data: { tournamentId, name, slug, order },
      });
      console.log(`+ Fase creada: [${tournamentId}] ${name} (${slug})`);
    }
    return phase;
  }

  // Crear fases que faltaban en años históricos
  await ensurePhase("oficial-2023", "Repechaje", "repechaje", 2);
  await ensurePhase("oficial-2024", "Repechaje", "repechaje", 2);
  await ensurePhase("oficial-2025", "Repechaje", "repechaje", 2);
  await ensurePhase("oficial-2025-fem", "Repechaje", "repechaje", 2);
  await ensurePhase("oficial-2021-22", "Playoffs / Fase Final", "playoffs", 2);
  await ensurePhase("oficial-2022", "Playoffs / Fase Final", "playoffs", 3);

  // Asegurar finales en torneos de inferiores
  const inferioresTours = [
    "tercera-oficial-2025", "cuarta-oficial-2025", "quinta-oficial-2025", "sexta-oficial-2025", "septima-oficial-2025",
    "cat_a-oficial-2025", "cat_b-oficial-2025", "cat_c-oficial-2025", "cat_d-oficial-2025",
    "tercera-oficial-2026", "cuarta-oficial-2026", "quinta-oficial-2026", "sexta-oficial-2026", "septima-oficial-2026",
    "cat_a-oficial-2026", "cat_b-oficial-2026", "cat_c-oficial-2026", "cat_d-oficial-2026",
  ];
  for (const tid of inferioresTours) {
    await ensurePhase(tid, "Finales (Semis y Final)", "finales", 2);
  }

  // 2. Asociar los 30 partidos huérfanos con phaseId: null
  const nullMatches = await prisma.match.findMany({
    where: { phaseId: null },
  });
  console.log(`Encontrados ${nullMatches.length} partidos sin fase asociada.`);

  for (const m of nullMatches) {
    let targetSlug = "fase-regular";
    const comp = (m.competition || "").toLowerCase();
    const round = (m.roundName || "").toLowerCase();

    if (comp.includes("repechaje") || round.includes("repechaje")) {
      targetSlug = "repechaje";
    } else if (comp.includes("fase final") || comp.includes("playoff") || comp.includes("petit")) {
      targetSlug = m.tournamentId === "oficial-2026-fem" ? "petit-playoffs" : "playoffs";
    } else if (comp.includes("grupo a")) {
      targetSlug = "grupo-a";
    } else if (comp.includes("grupo b")) {
      targetSlug = "grupo-b";
    }

    let phase = await prisma.tournamentPhase.findFirst({
      where: { tournamentId: m.tournamentId, slug: targetSlug },
    });

    if (!phase) {
      // Buscar primera fase del torneo
      phase = await prisma.tournamentPhase.findFirst({
        where: { tournamentId: m.tournamentId },
        orderBy: { order: "asc" },
      });
    }

    if (phase) {
      await prisma.match.update({
        where: { id: m.id },
        data: { phaseId: phase.id },
      });
      console.log(`Partido [${m.roundName}] (${m.tournamentId}) vinculado a fase: ${phase.slug}`);
    }
  }

  // 3. Eliminar la fase vacía 'repechaje' de oficial-2026-fem si no tiene partidos ni tabla
  const femRepe = await prisma.tournamentPhase.findFirst({
    where: { tournamentId: "oficial-2026-fem", slug: "repechaje" },
    include: { matches: true, standings: true },
  });
  if (femRepe && femRepe.matches.length === 0 && femRepe.standings.length === 0) {
    await prisma.tournamentPhase.delete({ where: { id: femRepe.id } });
    console.log("- Fase vacía 'repechaje' eliminada de oficial-2026-fem (reemplazada por 'petit-playoffs').");
  }

  console.log("¡Regularización de fases y partidos completada con éxito!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
