"use client";

import { useState } from "react";
import Image from "next/image";

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

const FILTERS = ["Todas", "Titular", "Suplente", "Especial"];

export default function CamisetasGallery({ camisetas, onOpenZoom }) {
  const [activeFilter, setActiveFilter] = useState("Todas");

  const filtered =
    activeFilter === "Todas"
      ? camisetas
      : camisetas.filter((c) => c.tipo === activeFilter);

  return (
    <section aria-labelledby="museo-camisetas">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 id="museo-camisetas" className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-1">
            Camisetas históricas
          </h2>
          <p className="text-2xl font-extrabold text-gray-900">Todas las indumentarias del club</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} type="button" onClick={() => setActiveFilter(f)}
              className={["px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                activeFilter === f
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800",
              ].join(" ")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400 text-sm">No hay camisetas en esta categoría.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((c) => (
            <KitCard key={c.id} camiseta={c} onOpenZoom={() => onOpenZoom(c, filtered)} />
          ))}
        </div>
      )}

      <p className="mt-5 flex items-center gap-2 text-xs text-gray-400">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
        Temporada con título — hacé clic en cualquier camiseta para ampliarla
      </p>
    </section>
  );
}

function KitCard({ camiseta: c, onOpenZoom }) {
  const hasTrophies = c.hitos?.length > 0;

  return (
    <button
      type="button"
      onClick={onOpenZoom}
      // Sin hover:scale ni hover:-translate (eran los que causaban el bounce)
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden text-left transition-shadow duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      aria-label={`Ver camiseta ${c.temporada} ${c.tipo}`}
    >
      {/* Área imagen — aspect-[4/5] en lugar de [3/4], padding reducido */}
      <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(188,23,23,0.04),transparent)]" />

        <Image
          src={c.src}
          alt={c.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          // Padding reducido: p-2 sm:p-3 (antes p-4 sm:p-6)
          // Sin scale en hover — era el causante del bounce al clickear
          className="object-contain p-2 sm:p-3 drop-shadow-md"
        />

        {/* Badge tipo */}
        <div className="absolute top-2 left-2 z-10">
          <span className={["inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            c.tipo === "Titular" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 border border-gray-300",
          ].join(" ")}>
            {c.tipo}
          </span>
        </div>

        {hasTrophies && (
          <div className="absolute top-2 right-2 z-10 bg-amber-400 text-white rounded-full p-1.5 shadow-sm">
            <IconTrophy />
          </div>
        )}
      </div>

      {/* Info del card */}
      <div className="px-3 py-2.5 border-t border-gray-100">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-extrabold text-gray-900 tabular-nums">{c.temporada}</span>
          {c.titulo && c.titulo !== "-" && (
            <span className="text-[11px] text-gray-400 truncate">{c.titulo}</span>
          )}
        </div>
        {hasTrophies && (
          <div className="mt-1 flex flex-wrap gap-1">
            {c.hitos.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                <IconTrophy />
                {h.titulo}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}