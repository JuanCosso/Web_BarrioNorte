"use client";

import { useMemo, useState } from "react";
import { Dancing_Script } from "next/font/google";
import { escudos as escudosData, camisetas as camisetasData } from "../../../lib/museoData";
import EscudosGrid from "./EscudosGrid";
import CamisetasGallery from "./CamisetasGallery";
import ZoomModal from "./ZoomModal";
import HistorialSection from "./HistorialSection";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const BRAND_RED = "#bc1717";

export default function MuseoClient() {
  const escudos   = useMemo(() => escudosData, []);
  const camisetas = useMemo(() => camisetasData, []);

  const [zoomOpen, setZoomOpen]   = useState(false);
  const [zoomItem, setZoomItem]   = useState(null);
  const [zoomItems, setZoomItems] = useState([]);

  const openZoom  = (item, items = []) => { setZoomItem(item); setZoomItems(items); setZoomOpen(true); };
  const closeZoom = () => { setZoomOpen(false); setZoomItem(null); setZoomItems([]); };

  return (
    <section className="w-full bg-gray-50 min-h-screen">

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-9 pb-9 sm:pt-9 sm:pb-12">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-center sm:gap-16 gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Museo <span style={{ color: BRAND_RED }}>Online</span>
              </h1>
              <p className="mt-2 text-gray-500 text-sm">
                Nuestra historia a través de los escudos y camisetas del club.
              </p>
            </div>
            <div className="text-center sm:text-right pb-1">
              <p
                className={`${dancingScript.className} text-2xl sm:text-3xl font-semibold text-gray-400`}
              >
                &ldquo;Para la gente del Barrio&rdquo;
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">
        <div className="space-y-16">
          <EscudosGrid      escudos={escudos}     onOpenZoom={openZoom} />
          <CamisetasGallery camisetas={camisetas}  onOpenZoom={openZoom} />
          <HistorialSection />
        </div>
      </div>

      <ZoomModal open={zoomOpen} item={zoomItem} items={zoomItems} onClose={closeZoom} />
    </section>
  );
}