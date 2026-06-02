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
    <section className="w-full bg-gray-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-4 lg:grid-cols-6">
          {espacios.map((espacio) => (
            <div
              key={espacio.id}
              className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-2 sm:p-3 flex flex-col items-center justify-center text-center gap-0.5 hover:border-red-400 hover:bg-red-50 transition-all"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold m-0">
                {espacio.nombre}
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 m-0">
                $6.000
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 m-0">
                por mes
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
