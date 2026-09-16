// app/api/admin/plantel/route.js
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma.js";

export const dynamic = "force-dynamic";

// 1. OBTENER CUERPO TÉCNICO Y PLANTEL POR TORNEO
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId");

    if (!tournamentId) {
      return NextResponse.json(
        { error: "Se requiere el parámetro tournamentId." },
        { status: 400 }
      );
    }

    const [staffList, rosterList] = await Promise.all([
      prisma.tournamentStaff.findMany({
        where: { tournamentId },
        include: { person: true },
        orderBy: { id: "asc" },
      }),
      prisma.tournamentRoster.findMany({
        where: { tournamentId },
        include: { person: true },
        orderBy: [{ jerseyNumber: "asc" }, { id: "asc" }],
      }),
    ]);

    const staff = staffList.map((s) => ({
      id: s.id,
      name: s.person.fullName,
      role: s.role,
    }));

    const roster = rosterList.map((r) => ({
      id: r.id,
      name: r.person.fullName,
      role: r.position,
      jerseyNumber: r.jerseyNumber ?? "",
    }));

    return NextResponse.json({
      tournamentId,
      staff,
      roster,
    });
  } catch (error) {
    console.error("Error al obtener cuerpo técnico y plantel:", error);
    return NextResponse.json(
      { error: "Error al consultar cuerpo técnico y plantel", details: error.message },
      { status: 500 }
    );
  }
}

// 2. GUARDAR / ACTUALIZAR CUERPO TÉCNICO Y PLANTEL EN NEON DB
export async function PUT(req) {
  try {
    const body = await req.json();
    const { tournamentId, staff = [], roster = [] } = body;

    if (!tournamentId) {
      return NextResponse.json(
        { error: "Se requiere tournamentId." },
        { status: 400 }
      );
    }

    // Verificar que el torneo exista en la DB
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: `El torneo "${tournamentId}" no existe en la base de datos.` },
        { status: 404 }
      );
    }

    // Procesar dentro de una transacción para evitar inconsistencias
    await prisma.$transaction(async (tx) => {
      // 1. Reemplazar cuerpo técnico
      await tx.tournamentStaff.deleteMany({
        where: { tournamentId },
      });

      for (const s of staff) {
        const name = String(s.name || "").trim();
        if (!name) continue;
        const role = String(s.role || "Cuerpo Técnico").trim();

        const person = await tx.person.upsert({
          where: { fullName: name },
          update: {},
          create: { fullName: name },
        });

        await tx.tournamentStaff.create({
          data: {
            tournamentId,
            personId: person.id,
            role,
          },
        });
      }

      // 2. Reemplazar plantel
      await tx.tournamentRoster.deleteMany({
        where: { tournamentId },
      });

      for (const r of roster) {
        const name = String(r.name || "").trim();
        if (!name) continue;
        const position = String(r.role || "Jugador").trim();
        const parsedNum = parseInt(r.jerseyNumber, 10);
        const jerseyNumber = isNaN(parsedNum) ? null : parsedNum;

        const person = await tx.person.upsert({
          where: { fullName: name },
          update: {},
          create: { fullName: name },
        });

        await tx.tournamentRoster.create({
          data: {
            tournamentId,
            personId: person.id,
            position,
            jerseyNumber,
          },
        });
      }
    });

    // Revalidación de caché en rutas públicas
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
      message: "Cuerpo técnico y plantel guardados exitosamente.",
    });
  } catch (error) {
    console.error("Error al guardar cuerpo técnico y plantel:", error);
    return NextResponse.json(
      { error: "Error al guardar información", details: error.message },
      { status: 500 }
    );
  }
}
