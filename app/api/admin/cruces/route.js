// app/api/admin/cruces/route.js
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

// Mapeo conocido y dinámico para cada torneo y fase
function getCandidateFilePaths(tournamentId, phaseSlug) {
  const year = (tournamentId.match(/(\d{4})/) || [])[1] || "misc";
  const cwd = process.cwd();

  const candidates = [];
  const sLower = (phaseSlug || "").toLowerCase();

  // Buscar dinámicamente en el directorio local del torneo si existe
  const tourDirs = [
    path.join(cwd, "data", "local", year, tournamentId),
    path.join(cwd, "data", "local", tournamentId),
  ];

  for (const dir of tourDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const f of files) {
          if (!f.endsWith(".json") || f.includes("results") || f.includes("liga")) continue;
          const fLow = f.toLowerCase();
          if (
            (sLower.includes("final") && (fLow.includes("final") || fLow.includes("playoff"))) ||
            (sLower.includes("playoff") && (fLow.includes("playoff") || fLow.includes("petit"))) ||
            (sLower.includes("repechaje") && fLow.includes("repechaje"))
          ) {
            candidates.push(path.join(dir, f));
          }
        }
      } catch {}
    }
  }

  if (sLower.includes("repechaje")) {
    candidates.push(
      path.join(cwd, "data", "local", year, tournamentId, "repechaje.json"),
      path.join(cwd, "data", "local", year, tournamentId, `${tournamentId.replace(/-/g, "_")}_repechaje.json`),
      path.join(cwd, "data", "local", year, tournamentId, `oficial_${year}_repechaje.json`),
      path.join(cwd, "data", "local", year, tournamentId, `fem_oficial_${year}_repechaje.json`),
      path.join(cwd, "data", "local", tournamentId, "repechaje.json"),
      path.join(cwd, "data", "local", tournamentId, `${tournamentId.replace(/-/g, "_")}_repechaje.json`)
    );
  } else if (sLower.includes("playoff")) {
    candidates.push(
      path.join(cwd, "data", "local", year, tournamentId, `prep_${year}_playoffs.json`),
      path.join(cwd, "data", "local", year, tournamentId, `fem_oficial_${year}_petit_playoffs.json`),
      path.join(cwd, "data", "local", year, tournamentId, "playoffs.json"),
      path.join(cwd, "data", "local", year, tournamentId, "supercopa_playoffs.json"),
      path.join(cwd, "data", "local", tournamentId, `prep_${year}_playoffs.json`),
      path.join(cwd, "data", "local", tournamentId, "playoffs.json")
    );
  } else if (sLower.includes("final")) {
    candidates.push(
      path.join(cwd, "data", "local", year, tournamentId, `inf_finales_${tournamentId.split("-")[0]}_${year}.json`),
      path.join(cwd, "data", "local", year, tournamentId, `primera_${year}_finales.json`),
      path.join(cwd, "data", "local", year, tournamentId, "finales.json"),
      path.join(cwd, "data", "local", tournamentId, "finales.json")
    );
  } else {
    candidates.push(
      path.join(cwd, "data", "local", year, tournamentId, `${phaseSlug}.json`),
      path.join(cwd, "data", "local", tournamentId, `${phaseSlug}.json`)
    );
  }

  // Eliminar duplicados manteniendo orden
  return Array.from(new Set(candidates));
}

function readJsonFile(candidates) {
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8");
        return { data: JSON.parse(content), path: p };
      }
    } catch {
      // continuar
    }
  }
  return null;
}

// Convertir filas planas del JSON ({ equipo, etapa, resultado, penales, ida, vuelta }) a duelos editables
function rowsToDuels(rows = []) {
  const duels = [];
  for (let i = 0; i < rows.length; i += 2) {
    const r1 = rows[i] || {};
    const r2 = rows[i + 1] || {};
    const isSeries = Boolean(r1.ida || r1.vuelta || r2.ida || r2.vuelta);

    duels.push({
      id: `duel-${i / 2 + 1}-${Date.now()}`,
      etapa: r1.etapa || `Duelo ${i / 2 + 1}`,
      equipo1: r1.equipo || "",
      equipo2: r2.equipo || "",
      format: isSeries ? "series" : "single",
      score1: r1.resultado ?? "",
      score2: r2.resultado ?? "",
      ida1: r1.ida ?? "",
      ida2: r2.ida ?? "",
      vuelta1: r1.vuelta ?? "",
      vuelta2: r2.vuelta ?? "",
      penales1: r1.penales && r1.penales !== "-" ? String(r1.penales) : "",
      penales2: r2.penales && r2.penales !== "-" ? String(r2.penales) : "",
    });
  }
  return duels;
}

// Convertir duelos a filas planas para el JSON público
function duelsToRows(duels = []) {
  const rows = [];
  for (const d of duels) {
    if (!d.equipo1 && !d.equipo2) continue;
    if (d.format === "series") {
      rows.push({
        equipo: d.equipo1,
        etapa: d.etapa,
        ida: String(d.ida1 ?? ""),
        vuelta: String(d.vuelta1 ?? ""),
        resultado: "",
        penales: d.penales1 ? String(d.penales1) : "-",
      });
      rows.push({
        equipo: d.equipo2,
        etapa: d.etapa,
        ida: String(d.ida2 ?? ""),
        vuelta: String(d.vuelta2 ?? ""),
        resultado: "",
        penales: d.penales2 ? String(d.penales2) : "-",
      });
    } else {
      rows.push({
        equipo: d.equipo1,
        etapa: d.etapa,
        resultado: String(d.score1 ?? ""),
        penales: d.penales1 ? String(d.penales1) : "-",
        ida: "",
        vuelta: "",
      });
      rows.push({
        equipo: d.equipo2,
        etapa: d.etapa,
        resultado: String(d.score2 ?? ""),
        penales: d.penales2 ? String(d.penales2) : "-",
        ida: "",
        vuelta: "",
      });
    }
  }
  return rows;
}

// 1. GET: Cargar duelos y cruces de la fase eliminatoria
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId");
    const phaseSlug = searchParams.get("phaseSlug") || "repechaje";

    if (!tournamentId) {
      return NextResponse.json({ error: "Se requiere tournamentId." }, { status: 400 });
    }

    // 1. Buscar en Neon DB si ya hay partidos registrados para esta fase
    let phase = await prisma.tournamentPhase.findFirst({
      where: {
        tournamentId,
        slug: phaseSlug,
      },
    });

    if (phase) {
      const dbMatches = await prisma.match.findMany({
        where: {
          tournamentId,
          phaseId: phase.id,
        },
        include: { homeTeam: true, awayTeam: true },
        orderBy: [{ roundNumber: "asc" }, { id: "asc" }],
      });

      if (dbMatches.length > 0) {
        const duels = dbMatches.map((m, idx) => {
          const isSeries = m.notes && m.notes.includes("SERIES_DATA:");
          let seriesData = null;
          let footnote = m.notes || "";

          if (isSeries) {
            try {
              const parts = m.notes.split("SERIES_DATA:");
              footnote = parts[0].trim();
              seriesData = JSON.parse(parts[1]);
            } catch {
              // fallback
            }
          }

          return {
            id: m.id,
            etapa: m.roundName || `Duelo ${idx + 1}`,
            equipo1: m.homeTeam.name,
            equipo2: m.awayTeam.name,
            format: seriesData ? "series" : "single",
            score1: m.homeScore != null ? String(m.homeScore) : "",
            score2: m.awayScore != null ? String(m.awayScore) : "",
            ida1: seriesData?.ida1 || "",
            ida2: seriesData?.ida2 || "",
            vuelta1: seriesData?.vuelta1 || "",
            vuelta2: seriesData?.vuelta2 || "",
            penales1: m.penaltiesHome != null ? String(m.penaltiesHome) : "",
            penales2: m.penaltiesAway != null ? String(m.penaltiesAway) : "",
          };
        });

        const footnote = dbMatches[0]?.notes ? dbMatches[0].notes.split("SERIES_DATA:")[0].trim() : "";

        return NextResponse.json({
          duels,
          footnote,
          phaseId: phase.id,
          source: "neon-db",
        });
      }
    }

    // 2. Si no hay partidos en Neon DB, cargar desde archivo JSON local
    const candidates = getCandidateFilePaths(tournamentId, phaseSlug);
    const jsonResult = readJsonFile(candidates);

    if (jsonResult?.data?.rows) {
      const duels = rowsToDuels(jsonResult.data.rows);
      const footnote = jsonResult.data.footnote || "";

      return NextResponse.json({
        duels,
        footnote,
        phaseId: phase?.id || null,
        source: "local-json",
        filePath: jsonResult.path,
      });
    }

    // 3. Si no hay archivo ni registros previos, retornar duelos vacíos
    return NextResponse.json({
      duels: [],
      footnote: "",
      phaseId: phase?.id || null,
      source: "empty",
    });
  } catch (error) {
    console.error("Error al obtener cruces:", error);
    return NextResponse.json(
      { error: "Error al obtener cruces", details: error.message },
      { status: 500 }
    );
  }
}

// 2. PUT: Guardar duelos y cruces en Neon DB y en el archivo local
export async function PUT(req) {
  try {
    const body = await req.json();
    const { tournamentId, phaseSlug, duels = [], footnote = "" } = body;

    if (!tournamentId || !phaseSlug) {
      return NextResponse.json(
        { error: "Se requiere tournamentId y phaseSlug." },
        { status: 400 }
      );
    }

    // Asegurar que la fase exista en Neon DB
    let phase = await prisma.tournamentPhase.findFirst({
      where: { tournamentId, slug: phaseSlug },
    });

    if (!phase) {
      const count = await prisma.tournamentPhase.count({ where: { tournamentId } });
      const phaseName =
        phaseSlug === "repechaje"
          ? "Repechaje"
          : phaseSlug === "petit-playoffs"
          ? "Petit Playoffs"
          : "Playoffs";

      phase = await prisma.tournamentPhase.create({
        data: {
          tournamentId,
          name: phaseName,
          slug: phaseSlug,
          order: count + 1,
        },
      });
    }

    // Obtener todos los equipos para mapear por nombre
    const allTeams = await prisma.team.findMany();
    const teamMap = new Map();
    allTeams.forEach((t) => {
      teamMap.set(t.name.toLowerCase(), t);
      teamMap.set(t.shortName.toLowerCase(), t);
      teamMap.set(t.slug.toLowerCase(), t);
      teamMap.set(t.name.replace(/\s+/g, "").toLowerCase(), t);
    });

    const getTeam = async (name) => {
      if (!name) return null;
      const clean = name.trim().toLowerCase();
      if (teamMap.has(clean)) return teamMap.get(clean);
      const noSpace = clean.replace(/\s+/g, "");
      if (teamMap.has(noSpace)) return teamMap.get(noSpace);

      // Si no existe, crear equipo en la DB
      const created = await prisma.team.create({
        data: {
          name: name.trim(),
          shortName: name.trim(),
          slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
          isLocalClub: name.toLowerCase().includes("barrio norte"),
        },
      });
      teamMap.set(created.name.toLowerCase(), created);
      return created;
    };

    // 1. Guardar en Neon DB mediante transacción
    await prisma.$transaction(async (tx) => {
      // Eliminar partidos anteriores de esta fase
      await tx.match.deleteMany({
        where: {
          tournamentId,
          phaseId: phase.id,
        },
      });

      // Crear cada duelo como partido
      for (let idx = 0; idx < duels.length; idx++) {
        const d = duels[idx];
        if (!d.equipo1 || !d.equipo2) continue;

        const homeTeam = await getTeam(d.equipo1);
        const awayTeam = await getTeam(d.equipo2);

        if (!homeTeam || !awayTeam) continue;

        const penHome = d.penales1 && d.penales1 !== "-" ? parseInt(d.penales1, 10) : null;
        const penAway = d.penales2 && d.penales2 !== "-" ? parseInt(d.penales2, 10) : null;

        let notes = footnote ? footnote.trim() : "";
        if (d.format === "series") {
          const seriesPayload = {
            ida1: d.ida1,
            ida2: d.ida2,
            vuelta1: d.vuelta1,
            vuelta2: d.vuelta2,
          };
          notes = `${notes} SERIES_DATA:${JSON.stringify(seriesPayload)}`;
        }

        const score1 = d.format === "series" ? (parseInt(d.ida1, 10) || 0) + (parseInt(d.vuelta1, 10) || 0) : (parseInt(d.score1, 10) || 0);
        const score2 = d.format === "series" ? (parseInt(d.ida2, 10) || 0) + (parseInt(d.vuelta2, 10) || 0) : (parseInt(d.score2, 10) || 0);

        await tx.match.create({
          data: {
            tournamentId,
            phaseId: phase.id,
            roundName: d.etapa || `Duelo ${idx + 1}`,
            roundNumber: idx + 1,
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            homeScore: score1,
            awayScore: score2,
            penaltiesHome: isNaN(penHome) ? null : penHome,
            penaltiesAway: isNaN(penAway) ? null : penAway,
            status: "FINISHED",
            notes: notes || null,
            competition: phase.name,
          },
        });
      }
    });

    // 2. Guardar en el archivo JSON local correspondiente
    try {
      const candidates = getCandidateFilePaths(tournamentId, phaseSlug);
      let targetFile = candidates[0];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          targetFile = p;
          break;
        }
      }

      const rows = duelsToRows(duels);
      const fileData = { rows, footnote: footnote ? footnote.trim() : undefined };

      const dir = path.dirname(targetFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(targetFile, JSON.stringify(fileData, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Aviso al escribir JSON local:", fsErr.message);
    }

    // 3. Revalidar rutas
    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/futbol/primera");
      revalidatePath("/futbol/femenino");
    } catch (revalErr) {
      console.warn("Aviso en revalidación:", revalErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Cruces eliminatorios guardados exitosamente.",
      duelsCount: duels.length,
    });
  } catch (error) {
    console.error("Error al guardar cruces:", error);
    return NextResponse.json(
      { error: "Error al guardar cruces eliminatorios", details: error.message },
      { status: 500 }
    );
  }
}
