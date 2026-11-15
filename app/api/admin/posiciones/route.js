// app/api/admin/posiciones/route.js
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

function getTableCandidateFiles(tournamentId, phaseSlug) {
  const year = (tournamentId.match(/(\d{4})/) || [])[1] || "misc";
  const cwd = process.cwd();
  return [
    path.join(cwd, "data", "local", year, tournamentId, `${phaseSlug}.json`),
    path.join(cwd, "data", "local", year, tournamentId, `oficial_${year}_${phaseSlug}.json`),
    path.join(cwd, "data", "local", year, tournamentId, `fem_oficial_${year}_${phaseSlug}.json`),
    path.join(cwd, "data", "local", year, tournamentId, phaseSlug === "fase-regular" ? `oficial_${year}_liga.json` : `${phaseSlug}.json`),
    path.join(cwd, "data", "local", year, tournamentId, phaseSlug === "fase-regular" ? `fem_oficial_${year}_liga.json` : `${phaseSlug}.json`),
    path.join(cwd, "data", "local", tournamentId, `${phaseSlug}.json`),
  ];
}

// 1. OBTENER TABLA DE POSICIONES
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId") || "oficial-2026";
    const phaseSlug = searchParams.get("phaseSlug") || "fase-regular";

    let phase = await prisma.tournamentPhase.findFirst({
      where: { tournamentId, slug: phaseSlug },
    });

    if (!phase) {
      // Buscar primera fase del torneo si no existe el slug
      phase = await prisma.tournamentPhase.findFirst({
        where: { tournamentId },
        orderBy: { order: "asc" },
      });
    }

    if (!phase) {
      return NextResponse.json({ rows: [], phase: null, footnote: "" });
    }

    const rows = await prisma.standingRow.findMany({
      where: { phaseId: phase.id },
      include: { team: true },
      orderBy: [
        { pts: "desc" },
        { dg: "desc" },
        { gf: "desc" },
        { pg: "desc" },
      ],
    });

    const orderedRows = rows.map((r, idx) => ({
      ...r,
      position: idx + 1,
    }));

    let footnote = "";
    const candidates = getTableCandidateFiles(tournamentId, phaseSlug);
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        try {
          const json = JSON.parse(fs.readFileSync(p, "utf-8"));
          if (json.footnote) {
            footnote = json.footnote;
            break;
          }
        } catch {}
      }
    }

    return NextResponse.json({ rows: orderedRows, phase, footnote });
  } catch (error) {
    console.error("Error al obtener tabla:", error);
    return NextResponse.json(
      { error: "Error al consultar tabla", details: error.message },
      { status: 500 }
    );
  }
}

// 2. GUARDAR TABLA COMPLETA EN LOTE (BATCH SAVE)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { phaseId, rows, footnote, tournamentId, phaseSlug } = body;

    if (!phaseId || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: "Se requiere phaseId y una lista de filas válida." },
        { status: 400 }
      );
    }

    const results = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.teamId) continue;

      const pj = parseInt(r.pj, 10) || 0;
      const pg = parseInt(r.pg, 10) || 0;
      const pe = parseInt(r.pe, 10) || 0;
      const pp = parseInt(r.pp, 10) || 0;
      const gf = parseInt(r.gf, 10) || 0;
      const gc = parseInt(r.gc, 10) || 0;
      const pointAdjustment = parseInt(r.pointAdjustment, 10) || 0;

      // Cálculo determinístico
      const dg = gf - gc;
      const pts = pg * 3 + pe + pointAdjustment;
      const position = r.position !== undefined ? parseInt(r.position, 10) : i + 1;

      const updated = await prisma.standingRow.upsert({
        where: {
          phaseId_teamId: {
            phaseId,
            teamId: r.teamId,
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
          pointAdjustment,
          notes: r.notes || null,
          position,
        },
        create: {
          phaseId,
          teamId: r.teamId,
          pj,
          pg,
          pe,
          pp,
          gf,
          gc,
          dg,
          pts,
          pointAdjustment,
          notes: r.notes || null,
          position,
        },
      });

      results.push(updated);
    }

    if (footnote !== undefined && tournamentId && phaseSlug) {
      try {
        const candidates = getTableCandidateFiles(tournamentId, phaseSlug);
        let targetFile = candidates[0];
        for (const p of candidates) {
          if (fs.existsSync(p)) {
            targetFile = p;
            break;
          }
        }
        let fileData = {};
        if (fs.existsSync(targetFile)) {
          try {
            fileData = JSON.parse(fs.readFileSync(targetFile, "utf-8"));
          } catch {}
        }
        fileData.footnote = footnote ? footnote.trim() : undefined;
        const dir = path.dirname(targetFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(targetFile, JSON.stringify(fileData, null, 2), "utf-8");
      } catch (fErr) {
        console.warn("Aviso al guardar footnote de tabla en JSON:", fErr.message);
      }
    }

    try {
      revalidatePath("/");
      revalidatePath("/futbol");
      revalidatePath("/futbol/primera");
      revalidatePath("/futbol/femenino");
    } catch (revalErr) {
      console.warn("Aviso revalidación:", revalErr.message);
    }

    return NextResponse.json({ success: true, count: results.length, rows: results });
  } catch (error) {
    console.error("Error al actualizar tabla:", error);
    return NextResponse.json(
      { error: "Error al actualizar tabla", details: error.message },
      { status: 500 }
    );
  }
}

// 3. ELIMINAR FILA
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Se requiere el ID de la fila a eliminar." }, { status: 400 });
    }

    await prisma.standingRow.delete({ where: { id } });

    try {
      revalidatePath("/");
      revalidatePath("/futbol");
    } catch (e) {
      console.warn(e.message);
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
