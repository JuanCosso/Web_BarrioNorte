"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-400 flex-shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

export default function ZoomModal({ open, item, items = [], onClose }) {
  const activeList = items.length > 0 ? items : item ? [item] : [];
  const initialIndex = item ? activeList.findIndex((x) => x?.id === item?.id) : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  // Sincronizar índice cuando cambia el item prop
  useEffect(() => {
    if (item && activeList.length > 0) {
      const idx = activeList.findIndex((x) => x?.id === item?.id);
      if (idx >= 0) setCurrentIndex(idx);
    }
  }, [item, activeList]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? activeList.length - 1 : prev - 1));
  }, [activeList.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === activeList.length - 1 ? 0 : prev + 1));
  }, [activeList.length]);

  // Manejo de teclado (Esc, Flechas)
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    // Bloquear scroll de la página de fondo
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, handlePrev, handleNext]);

  // Soporte para gestos táctiles (Swipe en móvil)
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!open || activeList.length === 0) return null;

  const current = activeList[currentIndex] || item;
  const isEscudo = !current?.temporada && Boolean(current?.periodo);
  const hasTrophies = current?.hitos && current.hitos.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl text-white select-none transition-all duration-300 h-[100dvh] max-h-[100dvh] overflow-hidden"
      role="dialog"
      aria-modal="true"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. CABECERA SUPERIOR RESPONSIVE */}
      <header className="relative z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 bg-black/70 backdrop-blur-md flex-shrink-0 h-12 sm:h-14">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
            <Image
              src="/logos/CABN-blanco.png"
              alt="Escudo CABN"
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#B71C1C] font-extrabold truncate">
              MUSEO CABN
            </p>
            <p className="hidden sm:block text-xs font-medium text-gray-300 truncate">
              {isEscudo ? "Evolución Heráldica e Identidad" : "Colección Histórica de Camisetas"}
            </p>
          </div>
        </div>

        {/* CONTADOR Y BOTÓN CERRAR */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <span className="text-xs text-gray-400 font-mono">
            {currentIndex + 1} / {activeList.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar visor"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-[#B71C1C] text-white flex items-center justify-center transition-all duration-200"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. ÁREA CENTRAL: ESCENARIO PRINCIPAL + PANEL LATERAL RESPONSIVE */}
      <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* 2A. ESCENARIO DE LA PRENDA (EN MÓVIL ALTO FIJO, EN DESKTOP FLEX-1) */}
        <main className="relative w-full h-[45vh] sm:h-[50vh] lg:h-full lg:flex-1 flex items-center justify-center p-2 sm:p-6 lg:p-8 flex-shrink-0 lg:flex-shrink overflow-hidden">
          {/* Flecha Anterior */}
          {activeList.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Anterior"
              className="absolute left-2 sm:left-4 lg:left-6 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 border border-white/15 hover:border-[#B71C1C] hover:bg-[#B71C1C] text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-xs"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Imagen de la prenda/escudo con dimensiones estables */}
          <div className="relative w-full h-full max-h-full flex items-center justify-center">
            <div
              className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${
                isEscudo ? "max-w-[240px] max-h-[240px] sm:max-w-[320px] sm:max-h-[320px]" : "max-w-xs sm:max-w-md lg:max-w-xl xl:max-w-2xl"
              }`}
            >
              <Image
                src={current?.src}
                alt={current?.alt || "Elemento de museo"}
                fill
                priority
                className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>

          {/* Flecha Siguiente */}
          {activeList.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente"
              className="absolute right-2 sm:right-4 lg:right-6 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 border border-white/15 hover:border-[#B71C1C] hover:bg-[#B71C1C] text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-xs"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </main>

        {/* 2B. PANEL DE INFORMACIÓN (SCROLLABLE Y ADAPTABLE) */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] flex-1 lg:flex-initial border-t lg:border-t-0 lg:border-l border-white/10 bg-neutral-950/80 lg:bg-white/[0.03] backdrop-blur-md p-4 sm:p-6 flex flex-col justify-start lg:justify-center overflow-y-auto z-20 min-h-0">
          <div className="space-y-3 sm:space-y-4 max-w-md mx-auto lg:mx-0 w-full">
            {/* Temporada, Tipo y Marca */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
                {isEscudo ? "EMBLEMA HISTÓRICO" : "INDUMENTARIA OFICIAL"}
              </span>
              <div className="flex items-center gap-2.5 mt-0.5 sm:mt-1 flex-wrap">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  {current?.temporada || current?.periodo}
                </h3>
                {current?.tipo && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/15 text-white border border-white/10">
                    {current.tipo}
                  </span>
                )}
              </div>
              {current?.titulo && current.titulo !== "-" && (
                <p className="text-[11px] sm:text-xs text-gray-400 mt-1 font-medium">
                  Confección / Marca: <span className="text-gray-200 font-bold">{current.titulo}</span>
                </p>
              )}
            </div>

            {/* Títulos / Trofeos obtenidos */}
            {hasTrophies && (
              <div className="pt-2.5 border-t border-white/10">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <IconTrophy /> Campeonatos con esta casaca
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {current.hitos.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-xs"
                    >
                      <IconTrophy />
                      {h.titulo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reseña Histórica / Anécdotas */}
            {(current?.historia || current?.descripcion) && (
              <div className="pt-2.5 border-t border-white/10">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {isEscudo ? "Reseña del emblema" : "Historia y detalles"}
                </p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                  {current?.historia || current?.descripcion}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. TIRA DE MINIATURAS INFERIOR (COMPACTA Y SCROLLABLE) */}
      {activeList.length > 1 && (
        <footer className="relative z-30 border-t border-white/10 bg-black/90 backdrop-blur-md px-3 py-2 flex items-center justify-center flex-shrink-0 h-14 sm:h-16">
          <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-4xl mx-auto no-scrollbar py-0.5">
            {activeList.map((thumb, idx) => (
              <button
                key={thumb.id || idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white/5 ${
                  currentIndex === idx
                    ? "border-[#B71C1C] scale-105 shadow-md ring-2 ring-red-500/30"
                    : "border-transparent opacity-40 hover:opacity-100"
                }`}
              >
                <Image
                  src={thumb.src}
                  alt={thumb.alt || ""}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
}