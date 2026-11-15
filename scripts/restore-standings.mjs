import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../lib/prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function normalizeName(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function cleanPhaseName(filename) {
  const base = filename.replace(".json", "").toLowerCase();
  if (base.includes("grupo_a")) return { name: "Grupo A", slug: "grupo-a", order: 1 };
  if (base.includes("grupo_b")) return { name: "Grupo B", slug: "grupo-b", order: 2 };
  if (base.includes("playoffs")) return { name: "Playoffs", slug: "playoffs", order: 3 };
  if (base.includes("repechaje")) return { name: "Repechaje", slug: "repechaje", order: 2 };
  if (base.includes("petit_playoffs")) return { name: "Petit - Playoffs", slug: "petit-playoffs", order: 4 };
  if (base.includes("petit")) return { name: "Petit Torneo", slug: "petit", order: 3 };
  if (base.includes("finales")) return { name: "Finales", slug: "finales", order: 2 };
  if (base.includes("supercopa_grupo")) return { name: "Fase de Grupos", slug: "fase-grupos", order: 1 };
  if (base.includes("supercopa_playoffs")) return { name: "Playoffs", slug: "playoffs", order: 2 };
  return { name: "Fase Regular", slug: "fase-regular", order: 1 };
}

async function restore() {
  console.log("Restaurando tablas de posiciones oficiales desde data/local...");

  // Cargar todos los equipos de la base de datos para mapeo rápido
  const allTeams = await prisma.team.findMany();
  const teamMap = new Map();
  for (const t of allTeams) {
    teamMap.set(normalizeName(t.name), t);
    teamMap.set(normalizeName(t.shortName), t);
    teamMap.set(normalizeName(t.slug), t);
  }

  // Aliases comunes
  const extraAliases = {
    "aldeaasuncion": "aldea-asuncion",
    "juventudcarbo": "juventud",
    "carbo": "juventud",
    "barrionorte": "barrio-norte",
    "gualeguaycentral": "gualeguay-central",
    "laacademia": "la-academia",
    "laacademia2f": "la-academia",
    "sociedadsportiva": "sociedad-sportiva",
    "sportiva": "sociedad-sportiva",
    "elprogreso": "el-progreso",
    "progreso": "el-progreso"
  };

  function findTeam(name) {
    const norm = normalizeName(name);
    if (teamMap.has(norm)) return teamMap.get(norm);
    if (extraAliases[norm] && teamMap.has(normalizeName(extraAliases[norm]))) {
      return teamMap.get(normalizeName(extraAliases[norm]));
    }
    // Búsqueda parcial
    for (const [k, t] of teamMap.entries()) {
      if (norm.includes(k) || k.includes(norm)) return t;
    }
    return null;
  }

  const localDir = path.join(ROOT, "data", "local");
  const years = fs.readdirSync(localDir).filter((y) => /^\d{4}$/.test(y));

  let restoredCount = 0;

  for (const year of years) {
    const yearDir = path.join(localDir, year);
    const tournaments = fs.readdirSync(yearDir).filter((t) => fs.statSync(path.join(yearDir, t)).isDirectory());

    for (const tourFolder of tournaments) {
      const tourDir = path.join(yearDir, tourFolder);
      const files = fs.readdirSync(tourDir).filter((f) => f.endsWith(".json") && !f.includes("results"));

      for (const file of files) {
        const filePath = path.join(tourDir, file);
        try {
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          if (!content || !Array.isArray(content.equipos)) continue;

          const phaseInfo = cleanPhaseName(file);

          const phase = await prisma.tournamentPhase.findFirst({
            where: { tournamentId: tourFolder, slug: phaseInfo.slug },
          });

          if (!phase) {
            console.log(`⚠️ Fase no encontrada en DB: [${tourFolder}] slug=${phaseInfo.slug}`);
            continue;
          }

          let pos = 1;
          for (const eq of content.equipos) {
            const team = findTeam(eq.name || eq.shortName);
            if (!team) {
              console.warn(`Equipo no encontrado: "${eq.name}"`);
              continue;
            }

            const pj = Number(eq.pj || 0);
            const pg = Number(eq.pg || 0);
            const pe = Number(eq.pe || 0);
            const pp = Number(eq.pp || 0);
            const gf = Number(eq.gm ?? eq.gf ?? 0);
            const gc = Number(eq.gc || 0);
            const dg = Number(eq.dg ?? (gf - gc));
            const pts = Number(eq.pts ?? (pg * 3 + pe));

            await prisma.standingRow.upsert({
              where: {
                phaseId_teamId: {
                  phaseId: phase.id,
                  teamId: team.id,
                },
              },
              update: {
                pj,
                pg,
                pe,
                pp,
                gf,
                gc,
                dg,
                pts,
                position: pos,
              },
              create: {
                phaseId: phase.id,
                teamId: team.id,
                pj,
                pg,
                pe,
                pp,
                gf,
                gc,
                dg,
                pts,
                position: pos,
              },
            });
            pos++;
            restoredCount++;
          }
          console.log(`✅ Restaurada fase: [${tourFolder}] ${phaseInfo.name} (${content.equipos.length} equipos)`);
        } catch (err) {
          console.error(`Error en ${filePath}:`, err.message);
        }
      }
    }
  }

  console.log(`🎉 Restauración completada: ${restoredCount} filas de posiciones restauradas.`);
  await prisma.$disconnect();
}

restore().catch(console.error);
