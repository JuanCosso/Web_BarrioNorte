// app/api/resultados/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tournament = String(searchParams.get("tournament") || "oficial-2026").trim().toLowerCase();
    const category = String(searchParams.get("category") || "masculino").trim().toLowerCase();

    const localPath = path.join(
      process.cwd(),
      "data",
      "local",
      tournament,
      `${category}-results.json`
    );

    try {
      const raw = fs.readFileSync(localPath, "utf-8");
      const results = JSON.parse(raw);
      return NextResponse.json({ results: Array.isArray(results) ? results : [] });
    } catch (err) {
      // Archivo no existe o error al parsear
      return NextResponse.json({ results: [] });
    }
  } catch (err) {
    return NextResponse.json({ results: [] });
  }
}
