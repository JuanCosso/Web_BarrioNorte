"use client";

import Image from "next/image";
import fixture from "../../data/fixture/masculino.json";
import { getNextMatch, formatFlyerData } from "../../lib/fixture";

// --- CONFIGURACIÓN ---
const BACKGROUND_IMAGE_URL = "/inicio/Proximo-Partido-Fondo.png";

function formatDDMM(dateISO) {
  if (!dateISO) return "";
  const parts = String(dateISO).split("-");
  if (parts.length !== 3) return dateISO;
  const [, mm, dd] = parts;
  return `${dd}/${mm}`;
}

export default function FlyerProximoPartido() {
  // Próximo partido según fecha más cercana
  const next = getNextMatch(fixture, new Date());
  const flyerData = formatFlyerData(next);

  if (!flyerData) return null;

  const {
    localName,
    visitanteName,
    stadium,
    fecha,
    hora,
    localShield,
    visitanteShield,
  } = flyerData;

  const fechaDDMM = formatDDMM(fecha);
  const horaLabel = hora && hora.trim() ? hora : "A confirmar";

  return (
    <section className="w-full border-y border-red-800/30 overflow-hidden relative bg-black">
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* CAPA 1: Imagen base */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity"
        style={{
          backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`,
          filter: "grayscale(100%) contrast(1.2) brightness(0.8)",
        }}
      />

      {/* CAPA 2: Degradado animado */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(-45deg, #0a0a0a, #420707, #dc2626, #7f1d1d, #000000)",
          backgroundSize: "400% 400%",
          animation: "gradientMove 15s ease infinite",
          mixBlendMode: "overlay",
          opacity: 0.9,
        }}
      />

      {/* CAPA 3: Patrón */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay z-20 pointer-events-none" />

      {/* CAPA 4: Contenido */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row sm:items-center sm:justify-between md:py-8 lg:px-8 z-30">
        {/* Izquierda */}
        <div className="text-center sm:text-left flex-1">
          <h2 className="font-black uppercase italic leading-none text-white drop-shadow-lg text-3xl sm:text-3xl md:text-4xl lg:text-5xl">
            VENÍ A <span className="text-red-600">ALENTAR</span>
            <br />
            AL <span className="text-red-600">NORTE</span>
          </h2>
        </div>

        {/* Centro: Escudos + VS */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-10 flex-shrink-0">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 transition-transform hover:scale-105">
            <Image
              src={localShield}
              alt={`Escudo ${localName}`}
              fill
              className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              priority
            />
          </div>

          <span className="font-black italic text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] text-4xl sm:text-5xl md:text-6xl">
            VS
          </span>

          <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 transition-transform hover:scale-105">
            <Image
              src={visitanteShield}
              alt={`Escudo ${visitanteName}`}
              fill
              className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              priority
            />
          </div>
        </div>

        {/* Derecha: Info del partido */}
{/* Derecha: Info del partido */}
<div className="flex-1 flex justify-center sm:justify-end">
  <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
    {/* Equipos arriba del estadio */}
    <p className="text-white font-extrabold italic uppercase tracking-wide">
      {localName} <span className="font-black text-red-600">vs</span> {visitanteName}
    </p>

    {/* Estadio */}
            <div className="mt-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white drop-shadow-md"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="font-bold uppercase tracking-wider text-sm md:text-base text-white drop-shadow-md">
                {stadium}
              </span>
            </div>

            {/* Fecha + Hora en la misma línea */}
            <div className="mt-2 flex items-baseline gap-3 leading-none">
              <span className="font-black italic text-3xl sm:text-4xl text-white drop-shadow-md tracking-tight">
                {fechaDDMM || fecha}
              </span>

              <span className="font-black text-red-600 text-xl sm:text-2xl tracking-[0.15em] drop-shadow-sm">
                {horaLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
