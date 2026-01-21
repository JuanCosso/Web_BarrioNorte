// components/inicio/HeroSlider.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    src: "/inicio/imagen-1.webp",
    alt: "Campaña de socios",
    preTitle: null,
    title: "SUMATE A LA",
    highlight: "FAMILIA NORTEÑA",
    button: null,
    link: null,
    layout: "left_split",
  },
  {
    id: 2,
    src: "/inicio/imagen-2.webp",
    alt: "Nuevas Camisetas 2025",
    preTitle: "YA DISPONIBLES",
    title: "CAMISETAS",
    highlight: "BARRIO NORTE",
    extraText: "2025",
    button: "COMPRAR",
    link: "/tienda",
    layout: "center_bold",
  },
  {
    id: 3,
    src: "/inicio/imagen-3.webp",
    alt: "Historia de las camisetas",
    preTitle: null,
    title: "LA PIEL DEL NORTE",
    highlight: "A LO LARGO DE LA HISTORIA",
    button: "MUSEO ONLINE",
    link: "/museo",
    layout: "full_width",
  },
];

// 🔸 Clases compartidas para el botón CTA
const ctaButtonClass =
  "border-2 border-white text-white hover:bg-white hover:text-black " +
  "text-lg md:text-xl font-bold py-3 px-10 rounded " +
  "transition-all duration-300 uppercase tracking-widest hover:scale-105 " +
  "w-[260px] max-w-full";

// 🔸 Clases compartidas para las flechas (Solución al error de hidratación)
const arrowButtonClass =
  "absolute top-1/2 -translate-y-1/2 " +
  "bg-white/10 hover:bg-red-600/80 text-white " +
  "p-2 md:p-3 rounded-full backdrop-blur-sm " +
  "transition-all z-20";

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden group bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* 1. IMAGEN DE FONDO */}
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* 2. OSCURECIMIENTO (Overlay) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />

          {/* 3. CONTENIDO DE TEXTO */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-20 text-white z-10">
            {/* --- DISEÑO 1: SOCIOS --- */}
            {slide.layout === "left_split" && (
              <div className="w-full flex flex-col md:flex-row items-center justify-between mt-10">
                <div className="md:w-3/4 text-left animate-fadeIn ml-8 sm:ml-12 md:ml-0">
                  <h2 className="text-5xl md:text-8xl font-black uppercase leading-tight italic drop-shadow-lg">
                    {slide.title} <br />
                    <span className="text-red-600">{slide.highlight}</span>
                  </h2>
                </div>
              </div>
            )}

            {/* --- DISEÑO 2: TIENDA --- */}
            {slide.layout === "center_bold" && (
              <div className="text-center animate-fadeInUp max-w-5xl flex flex-col items-center">
                <h2 className="text-sm md:text-lg font-bold uppercase tracking-[0.2em] text-white">
                  {slide.preTitle}
                </h2>

                <h3 className="text-4xl md:text-7xl font-black uppercase text-white leading-tight drop-shadow-xl mb-8">
                  {slide.title} <br className="hidden md:block" />
                  <span className="text-red-600 mr-3">{slide.highlight}</span>
                  <span className="text-white">{slide.extraText}</span>
                </h3>

                <div className="mt-4 flex justify-center">
                  <Link href={slide.link || "#"}>
                    <button className={ctaButtonClass}>{slide.button}</button>
                  </Link>
                </div>
              </div>
            )}

            {/* --- DISEÑO 3: HISTORIA --- */}
            {slide.layout === "full_width" && (
              <div className="w-full text-center animate-fadeIn flex flex-col items-center">
                <div className="mb-8 drop-shadow-[0_0_12px_rgba(220,38,38,0.9)]">
                  <h2 className="text-4xl md:text-7xl font-extrabold uppercase leading-tight text-white">
                    {slide.title} <br className="md:hidden" />
                    <span className="block md:inline mt-2 md:mt-0 md:ml-4">
                      {slide.highlight}
                    </span>
                  </h2>
                </div>

                {slide.button && (
                  <div className="mt-4 flex justify-center">
                    <Link href={slide.link || "#"}>
                      <button className={ctaButtonClass}>{slide.button}</button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* --- FLECHAS (Corregidas para evitar error de hidratación) --- */}
      <button
        onClick={prevSlide}
        className={`${arrowButtonClass} left-2 md:left-4`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-4 h-4 md:w-6 md:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className={`${arrowButtonClass} right-2 md:right-4`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-4 h-4 md:w-6 md:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* --- INDICADORES --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 transition-all duration-500 rounded-full ${
              current === index ? "w-10 bg-red-600" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}