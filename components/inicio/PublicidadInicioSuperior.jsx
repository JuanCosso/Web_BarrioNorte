const WHATSAPP_URL =
  "https://wa.me/5493444123456?text=Hola,%20me%20interesa%20consultar%20por%20un%20espacio%20publicitario%20en%20la%20web%20del%20Club%20Atl%C3%A9tico%20Barrio%20Norte";

export default function PublicidadInicioSuperior() {
  const espacios = [
    { id: 1, nombre: "Espacio 1" },
    { id: 2, nombre: "Espacio 2" },
    { id: 3, nombre: "Espacio 3" },
    { id: 4, nombre: "Espacio 4" },
    { id: 5, nombre: "Espacio 5" },
    { id: 6, nombre: "Espacio 6" },
  ];

  return (
    <section className="w-full bg-gray-50 py-3">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-3 lg:grid-cols-6">
          {espacios.map((espacio) => (
            <a
              key={espacio.id}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-lg border-2 border-dashed border-gray-300 bg-white p-3 flex flex-col items-center justify-center text-center min-h-[90px] hover:border-red-600 hover:bg-red-50/40 hover:shadow-sm transition-all"
              title="Consultar por este espacio publicitario"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold group-hover:text-red-700 transition-colors">
                {espacio.nombre}
              </span>
              <p className="text-sm sm:text-base font-bold text-gray-800 m-0 mt-0.5 group-hover:text-red-600 transition-colors">
                Tu Marca Acá
              </p>
              <span className="mt-1 inline-flex items-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider group-hover:text-red-600 transition-colors">
                Espacio disponible →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

