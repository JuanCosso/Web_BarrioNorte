"use client";

import { useMemo, useState } from "react";
import { escudos as escudosData, camisetas as camisetasData } from "../../../lib/museoData";
import EscudosGrid from "./EscudosGrid";
import CamisetasGallery from "./CamisetasGallery";
import ZoomModal from "./ZoomModal";

const BRAND_RED = "#bc1717";

export default function MuseoClient() {
  const escudos = useMemo(() => escudosData, []);
  const camisetas = useMemo(() => camisetasData, []);

  const [zoomOpen, setZoomOpen]   = useState(false);
  const [zoomItem, setZoomItem]   = useState(null);
  const [zoomItems, setZoomItems] = useState([]);

  const openZoom  = (item, items = []) => { setZoomItem(item); setZoomItems(items); setZoomOpen(true); };
  const closeZoom = () => { setZoomOpen(false); setZoomItem(null); setZoomItems([]); };

  const titulos = camisetas.reduce((acc, c) => acc + (c.hitos?.length ?? 0), 0);

  return (
    <section className="w-full bg-gray-50 min-h-screen">

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-9 pb-9 sm:pt-9 sm:pb-12">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-center sm:gap-16 gap-6">

            {/* Título — centrado en mobile, alineado a la izquierda en desktop */}
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Museo <span style={{ color: BRAND_RED }}>Online</span>
              </h1>
              <p className="mt-2 text-gray-500 text-sm">
                Nuestra historia a través de los símbolos y camisetas del club.
              </p>
            </div>

            {/* Stats — siempre centradas, en fila */}
            <div className="flex items-stretch gap-6">
              <Stat value={escudos.length} label="escudos" />
              <div className="w-px bg-gray-200" />
              <Stat value={camisetas.length} label="camisetas" />
              <div className="w-px bg-gray-200" />
              <Stat value={titulos} label="títulos" accent />
            </div>

          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">
        <div className="space-y-16">
          <EscudosGrid escudos={escudos} onOpenZoom={openZoom} />
          <CamisetasGallery camisetas={camisetas} onOpenZoom={openZoom} />
        </div>
      </div>

      <ZoomModal open={zoomOpen} item={zoomItem} items={zoomItems} onClose={closeZoom} />
    </section>
  );
}

function Stat({ value, label, accent = false }) {
  return (
    <div className="flex flex-col justify-center items-center sm:items-start">
      <span
        className="text-3xl font-extrabold tabular-nums"
        style={accent ? { color: BRAND_RED } : { color: "#111827" }}
      >
        {value}
      </span>
      <span className="text-xs text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}