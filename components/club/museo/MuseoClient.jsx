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

  const openZoom = (item) => { setZoomItem(item); setZoomOpen(true); };
  const closeZoom = () => { setZoomOpen(false); setZoomItem(null); };

  const titulos = camisetas.reduce((acc, c) => acc + (c.hitos?.length ?? 0), 0);

  return (
    <section className="w-full bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">

        {/* ── HEADER ── */}
        <header className="mb-12 pb-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600 mb-2">
                Club Atlético Barrio Norte
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Museo <span className="text-red-600">Online</span>
              </h1>
              <p className="mt-2 text-gray-500 text-sm max-w-md">
                Nuestra historia a través de los símbolos y camisetas del club.
              </p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="flex items-stretch gap-6">
              <Stat value={escudos.length} label="escudos" />
              <div className="w-px bg-gray-200" />
              <Stat value={camisetas.length} label="camisetas" />
              <div className="w-px bg-gray-200" />
              <Stat value={titulos} label="títulos" accent />
            </div>
          </div>
        </header>

        {/* ── CONTENIDO ── */}
        <div className="space-y-16">
          <EscudosGrid escudos={escudos} onOpenZoom={openZoom} />
          <CamisetasCarousel camisetas={camisetas} onOpenZoom={openZoom} />
        </div>
      </div>

      <ZoomModal open={zoomOpen} item={zoomItem} onClose={closeZoom} />
    </section>
  );
}

function Stat({ value, label, accent = false }) {
  return (
    <div className="flex flex-col justify-center">
      <span className={`text-3xl font-extrabold tabular-nums ${accent ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </span>
      <span className="text-xs text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}