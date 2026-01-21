"use client";

import Image from "next/image";

export default function EscudosGrid({ escudos, onOpenZoom }) {
  return (
    <section aria-labelledby="museo-escudos">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="museo-escudos" className="text-2xl font-bold">
            Escudos históricos
          </h2>
          <p className="text-neutral-300 text-sm mt-1">
            Lista completa de los emblemas del club.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {escudos.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => onOpenZoom(e)}
            className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden text-left hover:border-neutral-700 transition"
          >
            <div className="relative aspect-square w-full bg-neutral-950">
              <Image
                src={e.src}
                alt={e.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-3 group-hover:scale-[1.02] transition-transform"
              />
            </div>
            <div className="p-3 space-y-1">
              <div className="text-sm font-semibold leading-snug">{e.nombre}</div>
              <div className="text-xs text-neutral-400">{e.periodo}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
