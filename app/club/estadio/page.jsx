"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const stadiumImages = [
  {
    src: "/estadio/img_05.jpg",
    alt: "Final del torneo local 2022 vs Urquiza",
  },
  {
    src: "/estadio/img_01.jpg",
    alt: "Vista lateral mirando hacia el norte",
  },
  {
    src: "/estadio/img_02.jpg",
    alt: "Vista lateral mirando hacia el sur",
  },
  {
    src: "/estadio/img_00.jpg",
    alt: "Salida del vestuario",
  },
];

const stadiumData = [
  { label: "Nombre", value: 'Estadio Alberto "Pocha" Badaracco' },
  { label: "Capacidad", value: "1500 espectadores" },
  { label: "Superficie", value: "Césped natural" },
  { label: "Dimensiones", value: "98 m x 60 m" },
  { label: "Inauguración", value: "Año 1950" },
];

const stadiumExtraInfo = [
  "El estadio sufrió graves daños en su estructura tras la cola de tornado en el año 2010, esto conllevó años de trabajo con tal de reacondicionarlo.",
  "La tribuna visitante inaugurada en el año 2025 es la única que ofrece esta comodidad en toda la Liga Departamental.",
];

// Fila de información
function StadiumInfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="font-bold text-neutral-800 text-sm sm:text-base uppercase tracking-wider">
        {label}
      </span>
      <span className="text-neutral-600 font-medium text-right text-sm sm:text-base">
        {value}
      </span>
    </div>
  );
}

// Estilos de flechas
const arrowButtonClass =
  "absolute top-1/2 -translate-y-1/2 " +
  "bg-white/10 hover:bg-red-600/90 text-white " +
  "p-2 md:p-3 rounded-full backdrop-blur-sm shadow-md " +
  "transition-all duration-300 z-20 hover:scale-110";

export default function EstadioPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = stadiumImages.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[50vh] min-h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-neutral-900">
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/estadio/img_09.jpg"
            alt="Estadio Barrio Norte Hero"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/40" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center pb-8">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950/60 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-neutral-200 mb-6">
            Estadio Alberto "Pocha" Badaracco
          </div>

          {/* TÍTULO */}
          <h1 className="text-3xl sm:text-5xl tracking-tight text-white drop-shadow-2xl text-center mt-2">
            <span className="font-extrabold">Nuestra </span>
            <span className="font-extrabold">
              <motion.span className="relative inline-block text-red-600">
                <motion.span
                  aria-hidden="true"
                  className="absolute -inset-x-3 -inset-y-2 rounded-xl bg-red-600/45 blur-2xl pointer-events-none"
                  animate={{
                    opacity: [0.2, 0.85, 0.2],
                    scale: [0.95, 1.18, 0.95],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative drop-shadow-[0_0_10px_rgba(220,38,38,0.85)]">
                  casa
                </span>
              </motion.span>
              {", desde 1950"}
            </span>
          </h1>
        </div>
      </section>

      {/* 2. FICHA TÉCNICA Y GALERÍA */}
      <section className="relative z-20 container mx-auto px-4 -mt-16 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* COLUMNA IZQUIERDA: Slider */}
            <div className="lg:col-span-7 bg-neutral-900 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] group">
              <Image
                src={stadiumImages[currentIndex].src}
                alt={stadiumImages[currentIndex].alt}
                fill
                className="object-cover transition-opacity duration-500"
                priority
              />

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

              <button onClick={handlePrev} className={`${arrowButtonClass} left-4`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-5 h-5 md:w-6 md:h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button onClick={handleNext} className={`${arrowButtonClass} right-4`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-5 h-5 md:w-6 md:h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                {stadiumImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 transition-all duration-500 rounded-full shadow-sm ${
                      currentIndex === index ? "w-10 bg-red-600" : "w-2 bg-white/70 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* COLUMNA DERECHA: Datos */}
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
                  Información
                </h3>
                <div className="w-16 h-1.5 bg-red-600 rounded-full"></div>
              </div>

              <div className="mb-8 space-y-1">
                {stadiumData.map((item) => (
                  <StadiumInfoRow key={item.label} label={item.label} value={item.value} />
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                {stadiumExtraInfo.map((text, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-1 bg-red-600 rounded-full flex-shrink-0 mt-1 mb-1 opacity-80"></div>
                    <p className="text-neutral-700 text-sm leading-relaxed font-medium">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. UBICACIÓN */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/3 pt-2">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Cómo llegar</h2>
            <div className="h-1 w-12 bg-red-600 rounded-full mb-4"></div>
            <p className="text-neutral-700 font-medium text-base mb-1">
              Nos ubicamos cerca del acceso norte, en San Martín y Padre A. Calgaro
            </p>
            <p className="text-neutral-500 text-sm mb-6">Gualeguay, Entre Ríos.</p>
          </div>

          <div className="md:w-2/3 w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative bg-gray-100">
            <iframe
              title="Ubicación Estadio Club Atlético Barrio Norte"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1837.8908693644964!2d-59.315930949396865!3d-33.13088839192992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b09b6975738951%3A0xe46c15d507305fe1!2sClub%20Atl%C3%A9tico%20Barrio%20Norte!5e1!3m2!1ses-419!2sar!4v1765463017775!5m2!1ses-419!2sar"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
