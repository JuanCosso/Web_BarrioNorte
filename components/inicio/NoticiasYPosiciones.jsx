import ListaNoticias from "./ListaNoticias";
import TablaLigaInicio from "./TablaLigaInicio";
import UltimosResultados2026 from "./UltimosResultados2026";
import PublicidadBono from "./PublicidadBono";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import fallbackMascData from "../../data/local/2026/oficial-2026/oficial_2026_liga.json";
import fallbackFemData from "../../data/local/2026/oficial-2026-fem/fem_oficial_2026_liga.json";

async function getStandings(tournamentId) {
  try {
    const phase = await prisma.tournamentPhase.findFirst({
      where: {
        tournamentId,
        slug: "fase-regular",
      },
      include: {
        standings: {
          include: { team: true },
          orderBy: [{ pts: "desc" }, { dg: "desc" }, { gf: "desc" }],
        },
      },
    });

    if (phase && phase.standings.length > 0) {
      return phase.standings.map((s) => ({
        name: s.team.name,
        pj: s.pj,
        pg: s.pg,
        pe: s.pe,
        pp: s.pp,
        gm: s.gf,
        gc: s.gc,
        dg: s.dg,
        pts: s.pts,
      }));
    }
  } catch (err) {
    console.warn(`Aviso al obtener tabla de ${tournamentId} en Neon:`, err.message);
  }
  return null;
}

export default async function NoticiasYPosiciones() {
  const dbMasc = await getStandings("oficial-2026");
  const dbFem  = await getStandings("oficial-2026-fem");

  const equiposMasc = dbMasc || fallbackMascData.equipos;
  const equiposFem  = dbFem  || fallbackFemData.equipos;

  return (
    <section className="w-full bg-gray-50 py-8 md:py-10">
      <div className="container mx-auto px-4 space-y-8">
        {/* Fila 1: Noticias + (Bono + Resultados apilados) */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,0.9fr)] items-start">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Últimas noticias
            </h2>
            <ListaNoticias />
          </div>
          {/* columna derecha */}
          <div className="flex flex-col gap-4 w-full">
            <PublicidadBono />
            <UltimosResultados2026 />
          </div>
        </div>

        {/* Fila 2: Tablas de posiciones Liga 2026 */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Tablas de posiciones
          </h2>
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <TablaLigaInicio
              equiposRaw={equiposMasc}
              title="Primera División"
              badge="Masculino"
              footnote="Posiciones Torneo Oficial 2026."
            />
            <TablaLigaInicio
              equiposRaw={equiposFem}
              title="Primera División"
              badge="Femenino"
              footnote="Posiciones Torneo Oficial 2026 femenino."
              positionColorScheme="fem2026"
            />
          </div>
          <div className="flex justify-end pt-1">
            <Link
              href="/disciplinas/futbol"
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Ver todas las tablas →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}