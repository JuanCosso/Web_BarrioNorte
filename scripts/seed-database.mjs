/**
 * scripts/seed-database.mjs
 *
 * Migración y siembra completa de datos existentes hacia Neon DB (PostgreSQL).
 * - Carga Clubes y Rivales (con alias y logos).
 * - Carga Temporadas (2021-2026).
 * - Carga Torneos, Fases y Tablas de Posiciones desde data/local/.
 * - Carga Partidos y Resultados desde masculino.config.js y *-results.json.
 * - Carga Noticias desde data/noticias.json.
 * - Carga Cuerpos Técnicos desde masculino.config.js.
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ========================================================
// 1. CONFIGURACIÓN DE CLUBES BASE Y ALIAS
// ========================================================
const BASE_TEAMS = [
  {
    name: "Barrio Norte",
    shortName: "Barrio Norte",
    slug: "barrio-norte",
    logoUrl: "/escudos/BarrioNorte_V1.png",
    isLocalClub: true,
    aliases: ["Barrio Norte", "Barrio", "El Norte", "C.A.B.N.", "CABN", "Club Atlético Barrio Norte"],
  },
  {
    name: "Bancario",
    shortName: "Bancario",
    slug: "bancario",
    logoUrl: "/escudos/Bancario.png",
    isLocalClub: false,
    aliases: ["Bancario", "Club Bancario", "Centro Bancario Gualeguay", "CBG"],
  },
  {
    name: "Juventud",
    shortName: "Juventud",
    slug: "juventud",
    logoUrl: "/escudos/JuventudCarbo.png",
    isLocalClub: false,
    aliases: ["Juventud", "Juventud y Ferrocarril Unidos", "Juventud Carbó", "Carbó", "Juventud Carbo"],
  },
  {
    name: "El Progreso",
    shortName: "El Progreso",
    slug: "el-progreso",
    logoUrl: "/escudos/ElProgreso.png",
    isLocalClub: false,
    aliases: ["El Progreso", "Progreso", "Club Atlético El Progreso"],
  },
  {
    name: "Gualeguay Central",
    shortName: "Central",
    slug: "gualeguay-central",
    logoUrl: "/escudos/GualeguayCentral.png",
    isLocalClub: false,
    aliases: ["Gualeguay Central", "Central", "CGC", "Club Gualeguay Central"],
  },
  {
    name: "La Academia",
    shortName: "La Academia",
    slug: "la-academia",
    logoUrl: "/escudos/LaAcademia.png",
    isLocalClub: false,
    aliases: ["La Academia", "Academia", "La Academia 2F", "Academia 2F"],
  },
  {
    name: "Libertad",
    shortName: "Libertad",
    slug: "libertad",
    logoUrl: "/escudos/Libertad_V2.png",
    isLocalClub: false,
    aliases: ["Libertad", "Club Libertad", "CAL"],
  },
  {
    name: "Quilmes",
    shortName: "Quilmes",
    slug: "quilmes",
    logoUrl: "/escudos/Quilmes.png",
    isLocalClub: false,
    aliases: ["Quilmes", "Club Atlético Quilmes", "CAQ"],
  },
  {
    name: "Sociedad Sportiva",
    shortName: "Sportiva",
    slug: "sociedad-sportiva",
    logoUrl: "/escudos/SociedadSportiva.png",
    isLocalClub: false,
    aliases: ["Sociedad Sportiva", "Sportiva", "Soc. Sportiva", "Sociedad Sportiva Gualeguay", "CASS"],
  },
  {
    name: "Urquiza",
    shortName: "Urquiza",
    slug: "urquiza",
    logoUrl: "/escudos/Urquiza.png",
    isLocalClub: false,
    aliases: ["Urquiza", "Club Atlético Urquiza", "CAU"],
  },
];

// Mapa en memoria para búsqueda rápida: normalizado -> Team
const teamCache = new Map();

function normalizeName(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function getOrCreateTeam(rawName) {
  if (!rawName) return null;
  const clean = rawName.replace(/\u00A0/g, " ").trim();
  const key = normalizeName(clean);

  if (teamCache.has(key)) {
    return teamCache.get(key);
  }

  // Buscar en la base de datos por nombre o alias
  const existing = await prisma.team.findFirst({
    where: {
      OR: [
        { name: { equals: clean, mode: "insensitive" } },
        { aliases: { has: clean } },
        { slug: clean.toLowerCase().replace(/\s+/g, "-") },
      ],
    },
  });

  if (existing) {
    teamCache.set(key, existing);
    return existing;
  }

  // Crear nuevo club si no existía (ej: torneos provinciales)
  const slug = clean
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const newTeam = await prisma.team.create({
    data: {
      name: clean,
      shortName: clean,
      slug: slug || `team-${Date.now()}`,
      logoUrl: "/escudos/default.png",
      isLocalClub: clean.toLowerCase().includes("barrio norte"),
      aliases: [clean],
    },
  });

  teamCache.set(key, newTeam);
  return newTeam;
}

// ========================================================
// 2. POBLAR CLUBES INICIALES
// ========================================================
async function seedTeams() {
  console.log("⚽ Sembrando clubes y rivales...");
  for (const t of BASE_TEAMS) {
    const team = await prisma.team.upsert({
      where: { name: t.name },
      update: {
        shortName: t.shortName,
        slug: t.slug,
        logoUrl: t.logoUrl,
        isLocalClub: t.isLocalClub,
        aliases: t.aliases,
      },
      create: {
        name: t.name,
        shortName: t.shortName,
        slug: t.slug,
        logoUrl: t.logoUrl,
        isLocalClub: t.isLocalClub,
        aliases: t.aliases,
      },
    });

    const key = normalizeName(t.name);
    teamCache.set(key, team);
    for (const alias of t.aliases) {
      teamCache.set(normalizeName(alias), team);
    }
  }
  console.log(`✅ ${BASE_TEAMS.length} clubes base cargados.`);
}

// ========================================================
// 3. POBLAR TEMPORADAS (2021-2026)
// ========================================================
async function seedSeasons() {
  console.log("📅 Sembrando temporadas (2021 a 2026)...");
  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  for (const yr of years) {
    await prisma.season.upsert({
      where: { year: yr },
      update: {},
      create: { id: String(yr), year: yr },
    });
  }
  console.log("✅ Temporadas registradas.");
}

// ========================================================
// 4. MAPA DE TORNEOS Y CATEGORÍAS
// ========================================================
function detectCategoryAndFormat(tournamentFolder) {
  const f = tournamentFolder.toLowerCase();
  let category = "PRIMERA_MASCULINO";
  let format = "LIGA_TRADICIONAL";

  if (f.includes("fem")) category = "PRIMERA_FEMENINO";
  else if (f.includes("tercera")) category = "TERCERA_RESERVA";
  else if (f.includes("cuarta")) category = "CUARTA";
  else if (f.includes("quinta")) category = "QUINTA";
  else if (f.includes("sexta")) category = "SEXTA";
  else if (f.includes("septima")) category = "SEPTIMA";
  else if (f.includes("cat_a")) category = "CAT_A";
  else if (f.includes("cat_b")) category = "CAT_B";
  else if (f.includes("cat_c")) category = "CAT_C";
  else if (f.includes("cat_d")) category = "CAT_D";

  if (f.includes("prep")) format = "ZONAS_Y_PLAYOFFS";
  else if (f.includes("supercopa")) format = "COPA_ELIMINATORIA";

  return { category, format };
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

// ========================================================
// 5. MIGRAR TABLAS DE POSICIONES DESDE data/local/
// ========================================================
async function seedStandingsAndTournaments() {
  console.log("📊 Leyendo torneos y tablas de posiciones locales...");
  const localDir = path.join(ROOT, "data", "local");
  if (!fs.existsSync(localDir)) {
    console.log("⚠️ No se encontró la carpeta data/local");
    return;
  }

  const years = fs.readdirSync(localDir).filter((y) => /^\d{4}$/.test(y));

  for (const year of years) {
    const yearDir = path.join(localDir, year);
    const tournaments = fs.readdirSync(yearDir).filter((t) => fs.statSync(path.join(yearDir, t)).isDirectory());

    for (const tourFolder of tournaments) {
      const tourDir = path.join(yearDir, tourFolder);
      const { category, format } = detectCategoryAndFormat(tourFolder);

      // Título amigable para el torneo
      const friendlyName = tourFolder
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      const tournament = await prisma.tournament.upsert({
        where: { id: tourFolder },
        update: {
          name: friendlyName,
          category,
          format,
          seasonId: year,
        },
        create: {
          id: tourFolder,
          name: friendlyName,
          seasonId: year,
          category,
          format,
        },
      });

      const files = fs.readdirSync(tourDir).filter((f) => f.endsWith(".json") && !f.includes("results"));

      for (const file of files) {
        const filePath = path.join(tourDir, file);
        try {
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          if (!content || !Array.isArray(content.equipos)) continue;

          const phaseInfo = cleanPhaseName(file);

          let phase = await prisma.tournamentPhase.findFirst({
            where: { tournamentId: tournament.id, slug: phaseInfo.slug },
          });

          if (!phase) {
            phase = await prisma.tournamentPhase.create({
              data: {
                tournamentId: tournament.id,
                name: phaseInfo.name,
                slug: phaseInfo.slug,
                order: phaseInfo.order,
              },
            });
          }

          let pos = 1;
          for (const eq of content.equipos) {
            const team = await getOrCreateTeam(eq.name || eq.shortName);
            if (!team) continue;

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
          }
        } catch (err) {
          console.warn(`Error procesando archivo ${filePath}:`, err.message);
        }
      }
    }
  }
  console.log("✅ Torneos, fases y tablas de posiciones importadas con éxito.");
}

function computeMatchDate(seasonId, rawDate, tournamentId) {
  if (!rawDate || !rawDate.includes("/")) return null;
  const parts = rawDate.split("/").map((s) => s.trim());
  if (parts.length < 2) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(day) || isNaN(month)) return null;

  let baseYear = parseInt(seasonId, 10);
  if (isNaN(baseYear)) {
    const m = tournamentId.match(/\d{4}/);
    baseYear = m ? parseInt(m[0], 10) : 2026;
  }

  let year = baseYear;
  if (tournamentId.includes("supercopa") || tournamentId.includes("2021-22")) {
    if (month >= 11) {
      year = baseYear - 1;
    }
  }

  return new Date(Date.UTC(year, month - 1, day, 15, 0, 0));
}

// ========================================================
// 6. MIGRAR PARTIDOS Y RESULTADOS
// ========================================================
async function seedMatches() {
  console.log("⚔️ Sembrando partidos y resultados históricos...");
  const localDir = path.join(ROOT, "data", "local");
  const bnTeam = await getOrCreateTeam("Barrio Norte");

  // A. Leer archivos *-results.json en data/local/
  function scanResults(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        results.push(...scanResults(full));
      } else if (e.name.endsWith("-results.json")) {
        results.push(full);
      }
    }
    return results;
  }

  const resultFiles = scanResults(localDir);

  for (const rf of resultFiles) {
    try {
      const parts = rf.split(path.sep);
      const tourFolder = parts[parts.length - 2];
      const tournament = await prisma.tournament.findUnique({ where: { id: tourFolder } });
      if (!tournament) continue;

      const matchesData = JSON.parse(fs.readFileSync(rf, "utf-8"));
      if (!Array.isArray(matchesData)) continue;

      for (const m of matchesData) {
        if (!m.rival) continue;
        const rivalTeam = await getOrCreateTeam(m.rival);
        if (!rivalTeam) continue;

        const isHome = (m.condition || "").toLowerCase().trim() === "local";
        const homeTeam = isHome ? bnTeam : rivalTeam;
        const awayTeam = isHome ? rivalTeam : bnTeam;

        let homeScore = null;
        let awayScore = null;
        let status = "SCHEDULED";

        if (m.score && m.score.includes("-")) {
          const scoreParts = m.score.split("-").map((s) => s.trim());
          const s1 = parseInt(scoreParts[0], 10);
          const s2 = parseInt(scoreParts[1], 10);
          if (!isNaN(s1) && !isNaN(s2)) {
            homeScore = isHome ? s1 : s2;
            awayScore = isHome ? s2 : s1;
            status = "FINISHED";
          }
        } else if (m.score && m.score.toLowerCase().includes("susp")) {
          status = "SUSPENDED";
        }

        const roundName = m.round || "Fecha";
        const roundNumMatch = roundName.match(/\d+/);
        const roundNumber = roundNumMatch ? parseInt(roundNumMatch[0], 10) : null;
        const realDate = computeMatchDate(tournament.seasonId, m.date, tournament.id);

        const existing = await prisma.match.findFirst({
          where: {
            tournamentId: tournament.id,
            roundName,
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
          }
        });
        
        if (existing) {
          await prisma.match.update({
            where: { id: existing.id },
            data: {
              homeScore,
              awayScore,
              status,
              date: realDate,
              rawDate: m.date || null,
              competition: m.competition || null,
            }
          });
        } else {
          await prisma.match.create({
            data: {
              tournamentId: tournament.id,
              roundName,
              roundNumber,
              homeTeamId: homeTeam.id,
              awayTeamId: awayTeam.id,
              homeScore,
              awayScore,
              status,
              date: realDate,
              rawDate: m.date || null,
              competition: m.competition || null,
            }
          });
        }
      }
    } catch (e) {
      console.warn("Error importando resultados de", rf, e.message);
    }
  }

  // B. Leer resultados de masculino.config.js
  try {
    const configPath = path.join(ROOT, "components", "disciplinas", "futbol", "masculino", "masculino.config.js");
    if (fs.existsSync(configPath)) {
      const code = fs.readFileSync(configPath, "utf-8");
      // Extraer los bloques TOURNAMENT_CONTENT
      const matchRegex = /"([^"]+)":\s*\{\s*results:\s*(\[[^\]]*\])/gs;
      let m;
      while ((m = matchRegex.exec(code)) !== null) {
        const tourId = m[1];
        const rawResultsStr = m[2];
        try {
          // Parse con Function o evaluando el array seguro
          const parsedResults = eval(`(${rawResultsStr})`);
          const tournament = await prisma.tournament.findUnique({ where: { id: tourId } });
          if (!tournament || !Array.isArray(parsedResults)) continue;

          for (const item of parsedResults) {
            if (!item.rival) continue;
            const rivalTeam = await getOrCreateTeam(item.rival);
            if (!rivalTeam) continue;

            const isHome = (item.condition || "").toLowerCase().trim() === "local";
            const homeTeam = isHome ? bnTeam : rivalTeam;
            const awayTeam = isHome ? rivalTeam : bnTeam;

            let homeScore = null;
            let awayScore = null;
            let status = "SCHEDULED";

            if (item.score && item.score.includes("-")) {
              const scoreParts = item.score.split("-").map((s) => s.trim());
              const s1 = parseInt(scoreParts[0], 10);
              const s2 = parseInt(scoreParts[1], 10);
              if (!isNaN(s1) && !isNaN(s2)) {
                homeScore = isHome ? s1 : s2;
                awayScore = isHome ? s2 : s1;
                status = "FINISHED";
              }
            } else if (item.score && item.score.toLowerCase().includes("susp")) {
              status = "SUSPENDED";
            }

            const roundName = item.round || "Fecha";
            const roundNumMatch = roundName.match(/\d+/);
            const roundNumber = roundNumMatch ? parseInt(roundNumMatch[0], 10) : null;
            const realDate = computeMatchDate(tournament.seasonId, item.date, tournament.id);

            const existing = await prisma.match.findFirst({
              where: {
                tournamentId: tournament.id,
                roundName,
                homeTeamId: homeTeam.id,
                awayTeamId: awayTeam.id,
              }
            });

            if (existing) {
              await prisma.match.update({
                where: { id: existing.id },
                data: {
                  homeScore,
                  awayScore,
                  status,
                  date: realDate,
                  rawDate: item.date || null,
                  competition: item.competition || null,
                }
              });
            } else {
              await prisma.match.create({
                data: {
                  tournamentId: tournament.id,
                  roundName,
                  roundNumber,
                  homeTeamId: homeTeam.id,
                  awayTeamId: awayTeam.id,
                  homeScore,
                  awayScore,
                  status,
                  date: realDate,
                  rawDate: item.date || null,
                  competition: item.competition || null,
                }
              });
            }
          }
        } catch (err) {
          // Ignorar errores menores de parseo de fragmento
        }
      }
    }
  } catch (e) {
    console.warn("Aviso en parseo de masculino.config.js:", e.message);
  }

  console.log("✅ Partidos y fixture cargados.");
}

// ========================================================
// 7. MIGRAR NOTICIAS DESDE data/noticias.json
// ========================================================
async function seedNews() {
  console.log("📰 Migrando noticias institucionales...");
  const newsPath = path.join(ROOT, "data", "noticias.json");
  if (!fs.existsSync(newsPath)) {
    console.log("⚠️ No se encontró data/noticias.json");
    return;
  }

  const newsItems = JSON.parse(fs.readFileSync(newsPath, "utf-8"));
  let count = 0;

  for (const n of newsItems) {
    const rawTitle = (n.titulo || "").trim();
    if (!rawTitle) continue;

    const baseSlug = rawTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 80);

    const slug = `${baseSlug}-${n.id || count + 1}`;

    const publishedDate = n.fecha ? new Date(n.fecha) : new Date();

    await prisma.news.upsert({
      where: { slug },
      update: {
        title: rawTitle,
        summary: n.resumen || rawTitle,
        publishedAt: publishedDate,
        category: n.categoria || "Fútbol",
        tags: Array.isArray(n.tags) ? n.tags : [],
        featured: Boolean(n.destacada),
        imageUrl: n.imagen || "/noticias/default.webp",
        source: n.fuente || "Instagram",
        sourceUrl: n.url || null,
      },
      create: {
        title: rawTitle,
        slug,
        summary: n.resumen || rawTitle,
        publishedAt: publishedDate,
        category: n.categoria || "Fútbol",
        tags: Array.isArray(n.tags) ? n.tags : [],
        featured: Boolean(n.destacada),
        imageUrl: n.imagen || "/noticias/default.webp",
        source: n.fuente || "Instagram",
        sourceUrl: n.url || null,
      },
    });
    count++;
  }
  console.log(`✅ ${count} noticias cargadas en Neon.`);
}

// ========================================================
// 8. CUERPOS TÉCNICOS Y PLANTELES
// ========================================================
async function seedStaff() {
  console.log("👔 Cargando cuerpos técnicos históricos...");
  const staffList = [
    { tourId: "preparacion-2026", name: "Darío Sánchez", role: "Director Técnico" },
    { tourId: "oficial-2026", name: "Darío Sánchez", role: "Director Técnico" },
    { tourId: "preparacion-2025", name: "Roberto García", role: "Director Técnico" },
    { tourId: "preparacion-2025", name: "Silvio Ponce", role: "Ayudante de campo" },
    { tourId: "preparacion-2025", name: "Victorio Silguero", role: "Ayudante de campo" },
    { tourId: "preparacion-2024", name: "Roberto García", role: "Director Técnico" },
    { tourId: "preparacion-2024", name: "Silvio Ponce", role: "Ayudante de campo" },
    { tourId: "preparacion-2024", name: "Victorio Silguero", role: "Ayudante de campo" },
    { tourId: "oficial-2023", name: "Cristian Ariel Mallarino", role: "Director Técnico" },
    { tourId: "supercopa-entre-rios-2023", name: "Martín Caminos", role: "Director Técnico" },
    { tourId: "supercopa-entre-rios-2023", name: "Leandro Villabona", role: "Director Técnico" },
  ];

  for (const s of staffList) {
    const tournament = await prisma.tournament.findUnique({ where: { id: s.tourId } });
    if (!tournament) continue;

    const person = await prisma.person.upsert({
      where: { fullName: s.name },
      update: {},
      create: { fullName: s.name },
    });

    const existingStaff = await prisma.tournamentStaff.findFirst({
      where: {
        tournamentId: tournament.id,
        personId: person.id,
        role: s.role,
      },
    });

    if (!existingStaff) {
      await prisma.tournamentStaff.create({
        data: {
          tournamentId: tournament.id,
          personId: person.id,
          role: s.role,
        },
      });
    }
  }
  console.log("✅ Cuerpos técnicos registrados.");
}

// ========================================================
// EJECUCIÓN PRINCIPAL
// ========================================================
async function main() {
  console.log("🚀 Iniciando migración a Neon DB...");
  const startTime = Date.now();

  await seedTeams();
  await seedSeasons();
  await seedStandingsAndTournaments();
  await seedMatches();
  await seedNews();
  await seedStaff();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🎉 Migración completada exitosamente en ${elapsed}s!`);

  // Resumen final
  const [teams, tournaments, phases, standings, matches, news, people] = await Promise.all([
    prisma.team.count(),
    prisma.tournament.count(),
    prisma.tournamentPhase.count(),
    prisma.standingRow.count(),
    prisma.match.count(),
    prisma.news.count(),
    prisma.person.count(),
  ]);

  console.log("\n📊 Resumen de registros en Neon:");
  console.log(`  • Equipos / Rivales: ${teams}`);
  console.log(`  • Torneos:           ${tournaments}`);
  console.log(`  • Fases:             ${phases}`);
  console.log(`  • Filas en Tablas:   ${standings}`);
  console.log(`  • Partidos/Fixture:  ${matches}`);
  console.log(`  • Noticias:          ${news}`);
  console.log(`  • Personas (Staff):  ${people}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en la migración:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
