"use client";

import { useState } from "react";
import Image from "next/image";

const BRAND_RED = "#bc1717";

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
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
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2
            id="museo-camisetas"
            className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
            style={{ color: BRAND_RED }}
          >
            Camisetas históricas
          </h2>
          <p className="text-2xl font-extrabold text-gray-900">
            Todas las indumentarias del club
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={[
                "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                activeFilter === f
                  ? "text-white border-transparent"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800",
              ].join(" ")}
              style={activeFilter === f ? { background: BRAND_RED, borderColor: BRAND_RED } : {}}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          No hay camisetas en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((c) => (
            <KitCard key={c.id} camiseta={c} onOpenZoom={onOpenZoom} />
          ))}
        </div>
      )}

      {/* Leyenda */}
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
      onClick={() => onOpenZoom(c)}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden text-left transition-all duration-200 hover:shadow-lg hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bc1717]"
      aria-label={`Ver camiseta ${c.temporada} ${c.tipo}`}
    >
      {/* Área imagen */}
      <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
        {/* Fondo radial muy sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(188,23,23,0.04),transparent)]" />

        <Image
          src={c.src}
          alt={c.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-[1.05] drop-shadow-md"
        />

        {/* Badge tipo — top left */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={[
              "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              c.tipo === "Titular"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 border border-gray-300",
            ].join(" ")}
          >
            {c.tipo}
          </span>
        </div>

        {/* Trofeo — top right */}
        {hasTrophies && (
          <div className="absolute top-3 right-3 z-10 bg-amber-400 text-white rounded-full p-1.5 shadow-sm">
            <IconTrophy />
          </div>
        )}

        {/* Overlay hover con botón ampliar */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-end justify-end p-3">
          <span className="flex items-center gap-1.5 bg-white text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <IconExpand />
            Ampliar
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-base font-extrabold text-gray-900 tabular-nums">
            {c.temporada}
          </span>
          {c.titulo && c.titulo !== "-" && (
            <span className="text-[11px] text-gray-400 truncate">{c.titulo}</span>
          )}
        </div>

        {/* Títulos */}
        {hasTrophies && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {c.hitos.map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5"
              >
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