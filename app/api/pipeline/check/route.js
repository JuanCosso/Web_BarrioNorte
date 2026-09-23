import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";
export async function GET() {
  const matches = await prisma.match.findMany({
    orderBy: { id: 'desc' },
    take: 10,
    include: { homeTeam: true, awayTeam: true }
  });
  return NextResponse.json({ matches });
}
