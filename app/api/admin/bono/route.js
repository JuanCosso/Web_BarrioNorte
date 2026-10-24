import { NextResponse } from "next/server";
import { AVAILABLE_NUMBER_GROUPS } from "../../../../lib/bonoData.js";
import { prisma } from "../../../../lib/prisma.js";
import { getBonoNumberGroups } from "../../../../lib/bonoRepository.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const groups = await getBonoNumberGroups();
    return NextResponse.json({ groups, storageAvailable: true });
  } catch (error) {
    console.error("Error al obtener grupos del bono para administración:", error);
    return NextResponse.json({
      groups: AVAILABLE_NUMBER_GROUPS.map((group) => ({
        id: group.id,
        numbers: group.numbers,
        sold: Boolean(group.vendido),
        hidden: Boolean(group.ocultar),
      })),
      storageAvailable: false,
    });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || typeof body.sold !== "boolean") {
      return NextResponse.json(
        { error: "Se requiere un grupo válido y el estado vendido/libre." },
        { status: 400 }
      );
    }

    const updated = await prisma.bonoNumberGroup.update({
      where: { id },
      data: { sold: body.sold },
    });

    return NextResponse.json({ group: updated });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "No existe ese grupo de números." },
        { status: 404 }
      );
    }

    console.error("Error al actualizar estado del grupo del bono:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el estado del grupo." },
      { status: 500 }
    );
  }
}
