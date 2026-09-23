"use client";
import { useState, useEffect } from "react";
import TablaLigaInicio from "./TablaLigaInicio";

export default function TablaLigaMasculinoCarousel({ equiposMascRegular, equiposMascPetit }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  if (!equiposMascPetit || equiposMascPetit.length === 0) {
    return (
      <TablaLigaInicio
        equiposRaw={equiposMascRegular}
        title="Primera División"
        badge="Masculino"
        phaseName="Fase Regular"
        footnote="Posiciones Torneo Oficial 2026."
      />
    );
  }

  const slides = [
    {
      equiposRaw: equiposMascRegular,
      title: "Primera División",
      badge: "Masculino",
      phaseName: "Fase Regular",
      footnote: "Posiciones Torneo Oficial 2026.",
      scheme: "liga"
    },
    {
      equiposRaw: equiposMascPetit,
      title: "Petit Torneo",
      badge: "Masculino",
      phaseName: "Fase Final",
      footnote: "Posiciones Torneo Oficial 2026 (Petit).",
      scheme: "none"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}
      </style>
      <div 
        key={currentSlide} 
        className="relative overflow-hidden w-full animate-fade"
      >
         <TablaLigaInicio
            equiposRaw={slides[currentSlide].equiposRaw}
            title={slides[currentSlide].title}
            badge={slides[currentSlide].badge}
            phaseName={slides[currentSlide].phaseName}
            footnote={slides[currentSlide].footnote}
            positionColorScheme={slides[currentSlide].scheme}
         />
      </div>
      
      {/* Indicadores estilo slider */}
      <div className="absolute top-4 right-4 flex gap-1.5 z-10 pt-0.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === currentSlide ? "bg-red-600 w-4" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Ver tabla ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
