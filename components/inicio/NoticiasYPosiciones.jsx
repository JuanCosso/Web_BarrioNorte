// components/inicio/NoticiasYPosiciones.jsx
import ListaNoticias from "./ListaNoticias";
import TablaLigaInicio from "./TablaLigaInicio";
import UltimosResultados2026 from "./UltimosResultados2026";
import PublicidadBono from "./PublicidadBono";
import Link from "next/link";
import ligaMascData from "../../data/local/2026/oficial-2026/oficial_2026_liga.json";
import ligaFemData  from "../../data/local/2026/oficial-2026-fem/fem_oficial_2026_liga.json";

export default function NoticiasYPosiciones() {
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
        <div className="flex flex-col gap-4 w-full h-full">
          <PublicidadBono />
          <div className="flex-1">
            <UltimosResultados2026 />
          </div>
        </div>
      </div>

        {/* Fila 2: Tablas de posiciones Liga 2026 */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Tablas de posiciones
          </h2>
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <TablaLigaInicio
              equiposRaw={ligaMascData.equipos}
              title="Primera División"
              badge="Masculino"
              footnote="Posiciones Torneo Oficial 2026."
            />
            <TablaLigaInicio
              equiposRaw={ligaFemData.equipos}
              title="Primera División"
              badge="Femenino"
              footnote="Posiciones Torneo Oficial 2026 femenino."
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