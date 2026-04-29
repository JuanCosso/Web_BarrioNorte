// components/inicio/TablaLigaInicio.jsx
import Image from "next/image";
import { aplicarConfigEquipo } from "../../data/equiposConfig";

// Logos extra que no están en equiposConfig (mismos que los configs de fútbol)
const LOGOS_EXTRA = {
  "Centro Bancario": "/escudos/Bancario.png",
  "Juventud Carbó":  "/escudos/JuventudCarbo.png",
  "Aldea Asunción":  "/escudos/AldeaAsuncion.png",
  "Aldea Asuncion":  "/escudos/AldeaAsuncion.png",
};

function enriquecer(equipos) {
  return equipos
    .map((e) => {
      const base = aplicarConfigEquipo(e);
      // Si equiposConfig no encontró logo real, probá LOGOS_EXTRA
      const logo = base.logo === "/escudos/default.png"
        ? (LOGOS_EXTRA[e.name] || "/escudos/default.png")
        : base.logo;
      const pts = e.pg * 3 + e.pe;
      return { ...base, logo, pts };
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg  !== a.dg)  return b.dg  - a.dg;
      if (b.gm  !== a.gm)  return b.gm  - a.gm;
      return a.name.localeCompare(b.name);
    });
}

// "liga"    → top 3 verde, 4–7 amarillo  (masculino 2025/2026)
// "fem2026" → top 4 verde, sin amarillo  (femenino 2026)
function clasePosicion(pos, scheme = "liga") {
  if (scheme === "fem2026") {
    return pos <= 4 ? "text-green-600 font-semibold" : "";
  }
  // default liga
  if (pos <= 3) return "text-green-600 font-semibold";
  if (pos <= 7) return "text-yellow-500 font-semibold";
  return "";
}

export default function TablaLigaInicio({ equiposRaw, title, badge, footnote, positionColorScheme = "liga" }) {
  const equipos = enriquecer(equiposRaw);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          {badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wide bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">Fase regular</span>
      </div>

      {equipos.length === 0 ? (
        <p className="text-sm text-gray-400">Sin datos disponibles.</p>
      ) : (
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
              {equipos.map((equipo, index) => {
                const posicion = index + 1;
                const esBarrioNorte =
                  equipo.slug === "barrio-norte" ||
                  /barrio\s*norte/i.test(String(equipo.name || ""));

                return (
                  <tr
                    key={equipo.slug || `${equipo.name}-${index}`}
                    className={`border-b last:border-0 ${
                      esBarrioNorte ? "bg-red-50 font-semibold" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-1 px-2 text-center">
                      <span className={clasePosicion(posicion, positionColorScheme)}>
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
                          {equipo.shortName || equipo.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-1 px-1 text-center">{equipo.pj}</td>
                    <td className="py-1 px-1 text-center">{equipo.pg}</td>
                    <td className="py-1 px-1 text-center">{equipo.pe}</td>
                    <td className="py-1 px-1 text-center">{equipo.pp}</td>
                    <td className="py-1 px-1 text-center">{equipo.dg}</td>
                    <td className="py-1 pl-1 text-center font-semibold">{equipo.pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {footnote && (
        <p className="mt-2 text-[11px] text-gray-500">{footnote}</p>
      )}
    </div>
  );
}