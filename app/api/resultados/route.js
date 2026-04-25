// app/api/resultados/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tournament = String(searchParams.get("tournament") || "oficial-2026").trim().toLowerCase();
    const category   = String(searchParams.get("category")   || "masculino").trim().toLowerCase();

    const year = (tournament.match(/(\d{4})/) || [])[1] || "misc";
    const cwd  = process.cwd();

    // Buscar en orden: primero con año, luego sin año (estructura vieja)
    const candidates = [
      path.join(cwd, "data", "local", year, tournament, `${category}-results.json`),
      path.join(cwd, "data", "local", tournament, `${category}-results.json`),
    ];

    for (const localPath of candidates) {
      try {
        const raw     = fs.readFileSync(localPath, "utf-8");
        const results = JSON.parse(raw);
        return NextResponse.json({ results: Array.isArray(results) ? results : [] });
      } catch {
        // No existe → intentar siguiente
      }
    }

    return NextResponse.json({ results: [] });
  } catch (err) {
    return NextResponse.json({ results: [] });
  }
}