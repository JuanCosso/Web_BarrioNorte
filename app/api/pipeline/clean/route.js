import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";
export async function GET() {
  const tournaments = await prisma.tournament.findMany();
  let deletedCount = 0;
  for (const t of tournaments) {
    if (t.id === "oficial-2026" || t.id === "oficial-2026-fem") continue;
    
    // delete repechaje
    const deleted = await prisma.tournamentPhase.deleteMany({
      where: {
        tournamentId: t.id,
        slug: "repechaje"
      }
    });
    deletedCount += deleted.count;
  }
  return NextResponse.json({ success: true, deletedCount });
}
