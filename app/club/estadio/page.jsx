"use client";

import Image from "next/image";
import { useState } from "react";

const stadiumImages = [
  {
    src: "/estadio/img_09.jpg",
    title: "Vista general del campo de juego",
    description: "El mítico césped del Estadio Alberto 'Pocha' Badaracco.",
  },
  {
    src: "/estadio/img_05.jpg",
    title: "Final del Torneo Local 2022",
    description: "Gran marco de público en la definición ante Urquiza.",
  },
  {
    src: "/estadio/img_01.jpg",
    title: "Tribunas Norte y Cabinas",
    description: "Perspectiva lateral con la tribuna principal colmada.",
  },
  {
    src: "/estadio/img_02.jpg",
    title: "Vista lateral sur",
    description: "El estadio preparado para una nueva jornada de fútbol local.",
  },
  {
    src: "/estadio/img_00.jpg",
    title: "Túnel de salida al campo",
    description: "Acceso de jugadores desde los vestuarios al terreno.",
  },
  {
    src: "/estadio/img_04.jpg",
    title: "Cabinas de transmisión",
    description: "Espacio destinado a los medios de comunicación y prensa.",
  },
];

const stadiumSpecs = [
  {
    label: "Capacidad",
    value: "2.000 espectadores",
    icon: (
      <svg className="w-5 h-5 text-[#B71C1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: "Superficie",
    value: "Césped natural",
    icon: (
      <svg className="w-5 h-5 text-[#B71C1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.8} />
        <line x1="12" y1="4" x2="12" y2="20" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    label: "Dimensiones",
    value: "98 m × 60 m",
    icon: (
      <svg className="w-5 h-5 text-[#B71C1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
  {
    label: "Inauguración",
    value: "Año 1950",
    icon: (
      <svg className="w-5 h-5 text-[#B71C1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function EstadioPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = stadiumImages[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? stadiumImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === stadiumImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* HEADER INSTITUCIONAL */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-900 font-semibold mb-2">
            NUESTRA CASA
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Estadio Alberto <span className="text-[#B71C1C] italic">&quot;Pocha&quot;</span> Badaracco
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8 sm:pt-10 space-y-10">
        {/* SECCIÓN PRINCIPAL: GALERÍA Y FICHA TÉCNICA */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* VISOR DE FOTOS */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-4 sm:p-5">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-900 group">
              <Image
                src={currentImage.src}
                alt={currentImage.title}
                fill
                className="object-cover transition-opacity duration-300"
                priority
              />

              {/* Degradado y texto de pie de foto */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-5 pointer-events-none">
                <p className="text-white font-bold text-base sm:text-lg drop-shadow-sm">
                  {currentImage.title}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm mt-0.5 drop-shadow-sm">
                  {currentImage.description}
                </p>
              </div>

              {/* Flechas de navegación */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-[#B71C1C] transition-all backdrop-blur-sm shadow-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Foto siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-[#B71C1C] transition-all backdrop-blur-sm shadow-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Contador */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-bold backdrop-blur-sm">
                {currentIndex + 1} / {stadiumImages.length}
              </div>
            </div>

            {/* MINIATURAS */}
            <div className="mt-4 grid grid-cols-6 gap-2">
              {stadiumImages.map((img, idx) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                    currentIndex === idx
                      ? "border-[#B71C1C] ring-2 ring-[#B71C1C]/30 scale-[1.02]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.src} alt={img.title} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* FICHA TÉCNICA */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-full flex flex-col justify-between">
              <div className="border-b border-gray-100 pb-4 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Ficha Técnica</h2>
                <p className="text-xs text-gray-500">Datos oficiales del recinto</p>
              </div>

              <ul className="divide-y divide-gray-100 flex-1 flex flex-col justify-around">
                {stadiumSpecs.map((spec) => (
                  <li
                    key={spec.label}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-[#B71C1C] flex items-center justify-center flex-shrink-0 shadow-xs">
                        {spec.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                        {spec.label}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-gray-900 text-right">
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* HISTORIA Y PROGRESO (ANCHO COMPLETO DEL CONTENEDOR) */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B71C1C]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Historia y Progreso
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm sm:text-base text-gray-600 leading-relaxed">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span className="text-[#B71C1C] font-black text-lg">›</span> Reconstrucción (2010)
              </h3>
              <p>
                El estadio sufrió graves daños en su estructura tras el temporal de 2010. Con el esfuerzo, dedicación y unión de toda la masa societaria y vecinos de la ciudad, se reconstruyeron las instalaciones para ponerlo de pie con más fuerza.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span className="text-[#B71C1C] font-black text-lg">›</span> Tribuna Visitante (2025)
              </h3>
              <p>
                En 2025 se inauguró la <strong className="text-gray-900">nueva tribuna visitante</strong>, convirtiendo a la cancha de Barrio Norte en la única de toda la Liga Departamental que ofrece este confort, comodidad y seguridad para recibir a las parcialidades visitantes.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span className="text-[#B71C1C] font-black text-lg">›</span> Tribunas Locales (2026)
              </h3>
              <p>
                En 2026 se finalizó la construcción de las <strong className="text-gray-900">nuevas tribunas locales</strong>, ampliando la capacidad del recinto a 2.000 personas y dotando a la institución de una infraestructura moderna para toda la familia norteña.
              </p>
            </div>
          </div>
        </section>

        {/* UBICACIÓN Y CÓMO LLEGAR */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
                UBICACIÓN
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Cómo llegar al Estadio
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                El estadio está emplazado estratégicamente en el acceso norte de la ciudad de Gualeguay, en la intersección de las calles <strong className="text-gray-900">San Martín y Padre A. Calgaro</strong>.
              </p>

              <div className="pt-2">
                <a
                  href="https://www.google.com/maps/place/Club+Atl%C3%A9tico+Barrio+Norte/@-33.1316857,-59.3140357,604m/data=!3m2!1e3!4b1!4m6!3m5!1s0x95b09b6975738951:0xe46c15d507305fe1!8m2!3d-33.1316857!4d-59.3140357!16s%2Fg%2F11fxb0mb8m?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#B71C1C] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir en Google Maps
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 h-[320px] sm:h-[380px] rounded-xl overflow-hidden border border-gray-200 relative">
              <iframe
                title="Ubicación Estadio Club Atlético Barrio Norte"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1837.8908693644964!2d-59.315930949396865!3d-33.13088839192992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b09b6975738951%3A0xe46c15d507305fe1!2sClub%20Atl%C3%A9tico%20Barrio%20Norte!5e1!3m2!1ses-419!2sar!4v1765463017775!5m2!1ses-419!2sar"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

