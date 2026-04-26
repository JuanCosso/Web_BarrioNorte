"use client";

import Image from "next/image";

export default function EscudosGrid({ escudos, onOpenZoom }) {
  return (
    <section aria-labelledby="museo-escudos">
      <div className="mb-6">
        <h2
          id="museo-escudos"
          className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-1"
        >
          Escudos históricos
        </h2>
        <p className="text-2xl font-extrabold text-gray-900">
          La evolución de nuestro escudo
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-5">
        {escudos.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => onOpenZoom(e)}
            className="group flex flex-col items-center gap-2.5 focus:outline-none"
            aria-label={`Ver escudo período ${e.periodo}`}
          >
            {/* Marco del escudo */}
            <div className="relative w-full aspect-square rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 group-hover:border-red-400 group-hover:shadow-[0_4px_20px_rgba(220,38,38,0.12)]">
              <Image
                src={e.src}
                alt={e.alt}
                fill
                sizes="(max-width: 640px) 32vw, (max-width: 1024px) 24vw, 14vw"
                className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.07]"
              />
            </div>

            {/* Período */}
            <span className="text-[11px] font-medium text-center text-gray-400 leading-tight group-hover:text-red-600 transition-colors">
              {e.periodo}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}