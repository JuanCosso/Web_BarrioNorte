"use client";

import { useEffect, useRef } from "react";

export default function TimelineNav({ eras, activeId, onSelectEra }) {
  const containerRef = useRef(null);

  // Auto-scroll del contenedor horizontal para mantener centrado el hito activo
  useEffect(() => {
    if (!activeId || !containerRef.current) return;
    const activeBtn = containerRef.current.querySelector(`[data-era-id="${activeId}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeId]);

  return (
    <div className="sticky top-24 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-y border-white/10 shadow-xl transition-all duration-300">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Label izquierdo */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400">
              Línea de Tiempo
            </span>
          </div>

          {/* Carrusel de décadas / hitos */}
          <div
            ref={containerRef}
            className="flex items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full md:w-auto"
          >
            {eras.map((era) => {
              const isActive = activeId === era.id;
              const shortLabel = era.range || era.id;

              return (
                <button
                  key={era.id}
                  data-era-id={era.id}
                  type="button"
                  onClick={() => onSelectEra(era.id)}
                  className={`group relative shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black transition-all duration-300 focus:outline-none select-none
                    ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/40 scale-105 border border-red-500"
                        : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/10"
                    }`}
                  title={`${era.title} (${era.range || era.id})`}
                >
                  <span>{era.id}</span>
                  {isActive && (
                    <span className="hidden sm:inline-block text-[10px] font-semibold text-red-100 truncate max-w-[130px]">
                      • {era.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progreso visual discreto */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 text-xs text-neutral-400 font-mono">
            <span>75+ Años</span>
          </div>
        </div>
      </div>
    </div>
  );
}
