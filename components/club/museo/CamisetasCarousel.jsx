"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// --- ÍCONOS ---
function IconChevron({ dir = "left" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-5 sm:w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d={
          dir === "left"
            ? "M15.5 19.5 8 12l7.5-7.5 1.5 1.5L11 12l6 6-1.5 1.5z"
            : "M8.5 19.5 7 18l6-6-6-6 1.5-1.5L16 12l-7.5 7.5z"
        }
      />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-400" aria-hidden="true" fill="currentColor">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
    </svg>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function CamisetasCarousel({ camisetas, onOpenZoom }) {
  const [idx, setIdx] = useState(0);
  const active = camisetas?.[idx];

  const thumbsRef = useRef(null);
  const didMountRef = useRef(false);

  const clamp = (n) => Math.max(0, Math.min(camisetas.length - 1, n));
  const go = (nextIdx) => setIdx(clamp(nextIdx));
  const prev = (e) => {
    e?.stopPropagation(); // Evitar abrir el zoom al hacer click en la flecha
    go(idx - 1);
  };
  const next = (e) => {
    e?.stopPropagation();
    go(idx + 1);
  };

  // Scroll automático de miniaturas
  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const el = container.querySelector(`[data-thumb="${idx}"]`);
    if (!el) return;
    const targetLeft = el.offsetLeft - (container.clientWidth - el.clientWidth) / 2;
    container.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, [idx]);

  // Teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  if (!camisetas?.length) return null;

  const hasTrophies = active.hitos && active.hitos.length > 0;

  return (
    <section aria-labelledby="museo-camisetas">
      {/* Header Desktop (Texto + Flechas) */}
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 id="museo-camisetas" className="text-2xl font-bold">
            Camisetas utilizadas en nuestra historia
          </h2>
          <p className="text-neutral-300 text-sm mt-1">
            Conocé todos los diseños.
          </p>
        </div>

        {/* Flechas Desktop (Ocultas en móvil) */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-2 hover:border-neutral-700 transition-colors"
            aria-label="Camiseta anterior"
          >
            <IconChevron dir="left" />
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-2 hover:border-neutral-700 transition-colors"
            aria-label="Camiseta siguiente"
          >
            <IconChevron dir="right" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:h-[500px]">
          
          {/* LADO IZQUIERDO: IMAGEN + CONTROLES MÓVILES */}
          <div className="relative w-full lg:w-2/3 h-[350px] sm:h-[400px] lg:h-full bg-neutral-950 group">
            
            {/* Fondo radial */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
            
            {/* Imagen Clickable */}
            <button
              type="button"
              onClick={() => onOpenZoom(active)}
              className="absolute inset-0 w-full h-full z-0 focus:outline-none"
              aria-label="Abrir zoom"
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain p-6 lg:group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              />
            </button>

            {/* --- CONTROLES FLOTANTES (SOLO VISIBLES EN MÓVIL/TABLET) --- */}
            <div className="lg:hidden pointer-events-none absolute inset-0 flex items-center justify-between px-2 z-10">
              <button
                type="button"
                onClick={prev}
                className="pointer-events-auto rounded-full bg-black/40 backdrop-blur-md p-3 text-white border border-white/10 shadow-lg active:scale-95 transition-transform"
                aria-label="Anterior"
              >
                <IconChevron dir="left" />
              </button>
              <button
                type="button"
                onClick={next}
                className="pointer-events-auto rounded-full bg-black/40 backdrop-blur-md p-3 text-white border border-white/10 shadow-lg active:scale-95 transition-transform"
                aria-label="Siguiente"
              >
                <IconChevron dir="right" />
              </button>
            </div>
            
            {/* Tooltip de zoom (Desktop) */}
            <div className="hidden lg:block absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-neutral-700 pointer-events-none">
              Click para ampliar
            </div>
          </div>

          {/* LADO DERECHO: INFO */}
          <div className="w-full lg:w-1/3 flex flex-col border-t lg:border-t-0 lg:border-l border-neutral-800 bg-neutral-900/10 min-h-[250px]">
            
            {/* 1. Header Ficha */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-300">
                  {active.temporada}
                </span>
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold">
                  {active.tipo || "Camiseta"}
                </span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {active.titulo}
              </h3>
              <p className="text-sm text-neutral-400 font-medium">
                Marca oficial
              </p>
            </div>

            <div className="px-6">
              <div className="h-px w-full bg-neutral-800" />
            </div>

            {/* 2. Cuerpo (Storytelling) */}
            <div className="p-6 flex-grow">
              <p className="text-neutral-300 leading-relaxed text-sm">
                {active.historia || active.descripcion || "Información histórica no disponible para este modelo."}
              </p>
            </div>

            {/* 3. Footer (Títulos) - Solo se muestra si hay hitos */}
            {hasTrophies && (
              <div className="p-6 pt-4 bg-neutral-900/50 border-t border-neutral-800 mt-auto">
                <div className="flex flex-wrap gap-4">
                  {active.hitos.map((hito, i) => (
                    <div key={i} className="group flex items-center gap-3">
                      <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                        <IconTrophy />
                      </div>
                      <span className="text-xs font-bold text-amber-100">
                        {hito.titulo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* THUMBNAILS (Miniaturas) */}
        <div
          ref={thumbsRef}
          className="border-t border-neutral-800 px-3 py-3 overflow-x-auto bg-neutral-950/50"
        >
          <div className="flex gap-3 min-w-max">
            {camisetas.map((c, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={c.id}
                  type="button"
                  data-thumb={i}
                  onClick={() => setIdx(i)}
                  className={[
                    "relative rounded-xl overflow-hidden border bg-neutral-950 transition-all duration-300",
                    "h-16 w-16 sm:h-24 sm:w-24 flex-none", // Más pequeños en móvil
                    isActive
                      ? "border-red-600 ring-2 ring-red-600/20 grayscale-0"
                      : "border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100 grayscale",
                  ].join(" ")}
                  aria-label={`Ver camiseta ${c.temporada}`}
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}