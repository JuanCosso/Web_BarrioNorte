import { NextResponse } from "next/server";
import { AVAILABLE_NUMBER_GROUPS } from "../../../lib/bonoData.js";
import { getBonoNumberGroups } from "../../../lib/bonoRepository.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const groups = await getBonoNumberGroups();
    return NextResponse.json(
      {
        groups: groups.filter((group) => !group.hidden),
        storageAvailable: true,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Error al obtener números del bono:", error);
    return NextResponse.json({
      groups: AVAILABLE_NUMBER_GROUPS.filter((group) => !group.ocultar).map((group) => ({
        id: group.id,
        numbers: group.numbers,
        sold: Boolean(group.vendido),
        hidden: Boolean(group.ocultar),
      })),
      storageAvailable: false,
    });
  }
}
