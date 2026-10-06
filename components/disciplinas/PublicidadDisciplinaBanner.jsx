// components/disciplinas/PublicidadDisciplinaBanner.jsx
const WHATSAPP_URL =
  "https://wa.me/5493444123456?text=Hola,%20me%20interesa%20auspiciar%20las%20disciplinas%20del%20Club%20Atl%C3%A9tico%20Barrio%20Norte";

export default function PublicidadDisciplinaBanner({ disciplina = "esta disciplina" }) {
  return (
    <div className="w-full my-6">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="
          group relative block overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 sm:p-5
          transition-all duration-300 hover:border-red-600 hover:bg-red-50/30 hover:shadow-sm
        "
        title={`Consultar por publicidad en ${disciplina}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-[#B71C1C] font-bold text-sm group-hover:bg-[#B71C1C] group-hover:text-white transition-colors">
              📢
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-sm">
                  Espacio Publicitario
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase">
                  Auspiciante Oficial
                </span>
              </div>
              <p className="mt-0.5 text-sm sm:text-base font-bold text-gray-800 group-hover:text-red-700 transition-colors">
                Tu Marca Acá · Apoyá el crecimiento de {disciplina}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center rounded-full bg-gray-900 group-hover:bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors">
              Sumar mi marca →
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
