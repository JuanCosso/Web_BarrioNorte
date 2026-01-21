// components/inicio/NoticiasYPosiciones.jsx
import ListaNoticias from "./ListaNoticias";
import TablaPosiciones from "./TablaPosiciones";
import TablaPosicionesPetit2025 from "./TablaPosicionesPetit2025";
import TablaRepechajeOficial2025 from "./TablaRepechajeOficial2025";
import PublicidadBono from "./PublicidadBono";

export default function NoticiasYPosiciones() {
  return (
    <section className="w-full bg-gray-50 py-8 md:py-10">
      <div className="container mx-auto px-4 space-y-8">
        {/* Fila 1: Noticias + Bono */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,0.9fr)] items-start">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Últimas noticias
            </h2>
            <ListaNoticias />
          </div>

          <div className="flex justify-center lg:justify-end">
            <PublicidadBono />
          </div>
        </div>

        {/* Fila 2: Tablas de posiciones */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Tablas de posiciones
          </h2>

          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <TablaPosiciones />

            {/* Derecha: Repechaje arriba, Petit abajo */}
            <div className="space-y-6">
              <TablaRepechajeOficial2025 />
              <TablaPosicionesPetit2025 />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
