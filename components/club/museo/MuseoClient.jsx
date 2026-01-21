"use client";

import { useMemo, useState } from "react";
import { escudos as escudosData, camisetas as camisetasData } from "../../../lib/museoData";
import EscudosGrid from "./EscudosGrid";
import CamisetasCarousel from "./CamisetasCarousel";
import ZoomModal from "./ZoomModal";

export default function MuseoClient() {
  const escudos = useMemo(() => escudosData, []);
  const camisetas = useMemo(() => camisetasData, []);

  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomItem, setZoomItem] = useState(null);

  const openZoom = (item) => {
    setZoomItem(item);
    setZoomOpen(true);
  };

  const closeZoom = () => {
    setZoomOpen(false);
    setZoomItem(null);
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <header className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/40 via-neutral-950 to-neutral-950 px-6 py-10 sm:px-10 sm:py-14 text-center">
          {/* Decoración */}
          <div className="pointer-events-none absolute inset-0">
            <div className="museo-blob-red motion-reduce:animate-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-600/25 blur-3xl" />
            <div className="museo-blob-white motion-reduce:animate-none absolute -bottom-28 right-6 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="museo-sheen motion-reduce:animate-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/10 to-transparent blur-2xl" />

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
          </div>

          <div className="relative mx-auto max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950/60 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-neutral-200">
              {/* Beep / ping */}
              <span className="relative inline-flex h-2 w-2">
                <span className="museo-beep-ring motion-reduce:animate-none absolute inset-0 rounded-full bg-red-600/60" />
                <span className="museo-beep-dot motion-reduce:animate-none relative h-2 w-2 rounded-full bg-red-600" />
              </span>

              Archivos históricos
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Museo <span className="text-red-600">Online</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-200/90 leading-relaxed">
              Visitá nuestra colección de símbolos, logros y momentos del club.
            </p>
          </div>
        </header>

        <div className="mt-10 space-y-14">
          <EscudosGrid escudos={escudos} onOpenZoom={openZoom} />
          <CamisetasCarousel camisetas={camisetas} onOpenZoom={openZoom} />
        </div>
      </div>

      <ZoomModal open={zoomOpen} item={zoomItem} onClose={closeZoom} />
    </section>
  );
}
