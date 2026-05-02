"use client";

import { motion } from "framer-motion";
import { HISTORY_DATA } from "./historiaData";
import EraCard from "./EraCard";

/* =========================================================
   Textura de ruido de fondo
   ========================================================= */
const BackgroundTexture = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */
export default function Historia() {
  return (
    <section className="relative w-full bg-neutral-950 min-h-screen text-neutral-200 overflow-x-hidden">
      <BackgroundTexture />

      {/* Luces decorativas */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-24 right-[-120px] w-[520px] h-[520px] bg-white/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 sm:py-20">

        {/* ENCABEZADO */}
        <header className="text-center mb-20 sm:mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative inline-block"
          >
            <motion.div
              aria-hidden="true"
              className="absolute -inset-x-10 -inset-y-6 bg-red-600/10 blur-3xl rounded-full"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            />

            <motion.h1
              className="relative text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase"
              initial={{ letterSpacing: "-0.03em" }}
            >
              Nuestra{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-600 shimmer">
                Historia
              </span>
            </motion.h1>

            <motion.div
              className="relative h-1.5 w-36 mx-auto mt-5 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.55)]"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
              style={{ transformOrigin: "center" }}
            />
          </motion.div>

          <motion.p
            className="text-neutral-400 mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-light leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          >
            Un barrio que crece con identidad y humildad.
          </motion.p>
        </header>

        {/* ERAS */}
        <div className="flex flex-col gap-24 sm:gap-28 lg:gap-36 pb-20">
          {HISTORY_DATA.map((era, index) => (
            <EraCard key={era.id} era={era} index={index} />
          ))}
        </div>

      </div>

      <style jsx global>{`
        .shimmer {
          background-size: 200% 100%;
          animation: shimmerMove 3.5s linear infinite;
        }
        @keyframes shimmerMove {
          0%   { background-position: 0%   0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </section>
  );
}