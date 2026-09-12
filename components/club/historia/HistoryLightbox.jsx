"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryLightbox({ isOpen, onClose, imageSrc, imageAlt, caption }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6 md:p-8 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-600 hover:scale-110 transition-all focus:outline-none border border-white/20"
            aria-label="Cerrar visor"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Tarjeta de imagen */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative flex flex-col max-h-[92vh] max-w-[94vw] lg:max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/90 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con título o indicador de archivo */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-neutral-900/60">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                Archivo Histórico CABN
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                {imageAlt || "Documento de época"}
              </span>
            </div>

            {/* Contenedor de la imagen */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[70vh] bg-black/40 flex items-center justify-center p-2 sm:p-4">
              <div className="relative w-full h-full">
                <Image
                  src={imageSrc}
                  alt={imageAlt || "Documento histórico"}
                  fill
                  className="object-contain drop-shadow-2xl select-none"
                  sizes="(max-width: 1024px) 95vw, 1200px"
                  priority
                />
              </div>
            </div>

            {/* Epígrafe */}
            {caption && (
              <div className="px-4 sm:px-6 py-3 bg-neutral-900/80 border-t border-white/10 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                <p className="border-l-2 border-red-600 pl-3">
                  {caption}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
