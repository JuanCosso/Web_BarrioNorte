// components/inicio/TablaPosiciones.jsx
import Image from "next/image";
import { obtenerEquiposOrdenadosDesdeSheet } from "../../lib/tablaPosiciones";

function clasePosicion(pos) {
  if (pos <= 3) return "text-green-600 font-semibold"; // van directo al Petit
  if (pos >= 4 && pos <= 7) return "text-yellow-500 font-semibold"; // repechaje
  return "";
}

export default async function TablaPosiciones() {
  const sheetUrl = process.env.NEXT_PUBLIC_SHEET_OFICIAL_2025_URL;
  const equiposOrdenados = await obtenerEquiposOrdenadosDesdeSheet(sheetUrl);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800">
          Liga Departamental
        </p>
        <span className="text-xs text-gray-500">Fase regular</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-2 text-center">#</th>
              <th className="py-2 pr-2 text-left">Equipo</th>
              <th className="py-2 px-1 text-center">PJ</th>
              <th className="py-2 px-1 text-center">G</th>
              <th className="py-2 px-1 text-center">E</th>
              <th className="py-2 px-1 text-center">P</th>
              <th className="py-2 px-1 text-center">DG</th>
              <th className="py-2 pl-1 text-center">PTS</th>
            </tr>
          </thead>
          <tbody>
            {equiposOrdenados.map((equipo, index) => {
              const posicion = index + 1;
              const esBarrioNorte = equipo.slug === "barrio-norte";

              return (
                <tr
                  key={equipo.slug}
                  className={`border-b last:border-0 ${
                    esBarrioNorte
                      ? "bg-red-50 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-1 px-2 text-center">
                    <span className={clasePosicion(posicion)}>
                      {posicion}
                    </span>
                  </td>
                  <td className="py-1 pr-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={equipo.logo}
                        alt={equipo.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="text-xs md:text-sm text-gray-800">
                        {equipo.shortName}
                      </span>
                    </div>
                  </td>
                  <td className="py-1 px-1 text-center">{equipo.pj}</td>
                  <td className="py-1 px-1 text-center">{equipo.pg}</td>
                  <td className="py-1 px-1 text-center">{equipo.pe}</td>
                  <td className="py-1 px-1 text-center">{equipo.pp}</td>
                  <td className="py-1 px-1 text-center">{equipo.dg}</td>
                  <td className="py-1 pl-1 text-center font-semibold">
                    {equipo.pts}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[11px] text-gray-500">
        Tabla de posiciones final del Torneo Oficial 2025.
      </p>
    </div>
  );
}
