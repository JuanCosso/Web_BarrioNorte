// components/disciplinas/gimnasia/GimnasiaRitmica.jsx
import Image from "next/image";

const BRAND_RED = "#B71C1C";
const DISCIPLINE_LOGO_SRC = "/logos/Ritmica.png";

function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .02 5.38.02 12c0 2.12.55 4.19 1.6 6.02L0 24l6.17-1.6A11.96 11.96 0 0 0 12.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.02 22a9.98 9.98 0 0 1-5.1-1.4l-.37-.22-3.67.95.98-3.58-.24-.37A10.01 10.01 0 0 1 2.02 12C2.02 6.49 6.5 2 12.02 2c2.67 0 5.18 1.04 7.07 2.93A9.92 9.92 0 0 1 22.02 12c0 5.51-4.49 10-10 10Zm5.79-7.52c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.31-.78 1-.96 1.2-.18.2-.35.23-.66.08-.31-.16-1.29-.47-2.46-1.5-.91-.81-1.52-1.8-1.7-2.1-.18-.31-.02-.47.14-.63.14-.14.31-.35.47-.53.16-.18.2-.31.31-.51.1-.2.06-.39-.02-.55-.08-.16-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.51.08-.78.39-.27.31-1.02 1-1.02 2.44 0 1.43 1.04 2.81 1.18 3 .14.2 2.05 3.14 4.97 4.4.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.82-.74 2.08-1.45.25-.71.25-1.31.18-1.45-.08-.14-.28-.23-.58-.39Z" />
    </svg>
  );
}

function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconTrophy(props) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

const CONTACT = {
  whatsappHref:
    "https://wa.me/5493444123456?text=Hola%20quiero%20sumarme%20a%20Gimnasia%20Ritmica%20en%20Barrio%20Norte",
  instagramHref: "https://www.instagram.com/ritmicabarrionorte/",
  whatsappLabel: "Consultar por WhatsApp",
  instagramLabel: "Instagram",
};

const ACHIEVEMENTS = [
  {
    title: "Grandes resultados en Seguí",
    date: "2025",
    imageSrc: "/disciplinas/gimnasia/img_00.jpg",
    imageAlt: "Gimnasia rítmica Barrio Norte",
    description:
      "Participación en el segundo selectivo provincial. Primer puesto en Trío y Dúo Mini, además de destacadas actuaciones individuales.",
  },
  {
    title: "Nacional de clubes",
    date: "2025",
    imageSrc: "/disciplinas/gimnasia/img_22.jpg",
    imageAlt: "Gimnasia rítmica Barrio Norte",
    description:
      "Participación del Trío Mini de Barrio Norte en el certamen nacional, cosechando valiosa experiencia y reconocimiento.",
  },
];

const GALLERY = [
  { src: "/disciplinas/gimnasia/img_20.jpg", alt: "Gimnasia Rítmica Barrio Norte 1" },
  { src: "/disciplinas/gimnasia/img_23.jpg", alt: "Gimnasia Rítmica Barrio Norte 2" },
  { src: "/disciplinas/gimnasia/img_18.jpg", alt: "Gimnasia Rítmica Barrio Norte 3" },
  { src: "/disciplinas/gimnasia/img_24.jpg", alt: "Gimnasia Rítmica Barrio Norte 4" },
  { src: "/disciplinas/gimnasia/img_16.jpg", alt: "Gimnasia Rítmica Barrio Norte 5" },
  { src: "/disciplinas/gimnasia/img_14.jpg", alt: "Gimnasia Rítmica Barrio Norte 6" },
  { src: "/disciplinas/gimnasia/img_10.jpg", alt: "Gimnasia Rítmica Barrio Norte 7" },
  { src: "/disciplinas/gimnasia/img_05.jpg", alt: "Gimnasia Rítmica Barrio Norte 8" },
  { src: "/disciplinas/gimnasia/img_15.jpg", alt: "Gimnasia Rítmica Barrio Norte 9" },
];

export default function GimnasiaRitmica() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* HEADER INSTITUCIONAL */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-900 font-semibold mb-2">
            DISCIPLINAS DEPORTIVAS
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Gimnasia Rítmica en <span className="text-[#B71C1C] italic">Barrio Norte</span>
          </h1>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-10">
        {/* BANNER SHOWCASE */}
        <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-lg">
          <div className="absolute inset-0">
            <Image
              src="/disciplinas/gimnasia/banner.jpg"
              alt="Gimnasia Rítmica Barrio Norte"
              fill
              priority
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-red-500">
                EXPRESIÓN, RITMO Y DISCIPLINA
              </p>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Sumate a la gimnasia rítmica del club
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Nuestras gimnastas representan con orgullo a Barrio Norte en selectivos provinciales y torneos nacionales, desarrollando talento, motricidad y compañerismo.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#B71C1C] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-all hover:scale-105"
                >
                  <IconWhatsApp />
                  {CONTACT.whatsappLabel}
                </a>

                <a
                  href={CONTACT.instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  <IconInstagram />
                  {CONTACT.instagramLabel}
                </a>
              </div>
            </div>

            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 drop-shadow-2xl mx-auto md:mx-0">
              <Image
                src={DISCIPLINE_LOGO_SRC}
                alt="Logo Gimnasia Barrio Norte"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* DETALLE Y EXPLICACIÓN DE LA DISCIPLINA */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B71C1C]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              La Disciplina en Barrio Norte
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm sm:text-base text-gray-600 leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-base">
                Expresión Artística, Flexibilidad y Coordinación
              </h3>
              <p>
                La gimnasia rítmica en el Club Atlético Barrio Norte combina la danza, el ballet y la destreza gimnástica con el manejo armonioso de elementos oficiales como la cinta, la pelota, el aro y las mazas. En nuestro polideportivo cerrado, niñas y jóvenes encuentran un espacio de formación integral donde se cultivan la disciplina, la gracia postural, la elasticidad y la confianza personal.
              </p>
              <p>
                Guiadas por profesoras especializadas, las alumnas progresan paso a paso en un ambiente motivador que premia el esfuerzo, la constancia y el trabajo en equipo.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-base">
                Categorías, Niveles Federados y Torneos Nacionales
              </h3>
              <p>
                Contamos con grupos estructurados por edades y etapas: Nivel de iniciación (Escuelita para niñas desde temprana edad), grupos formativos y plantel de competición federada.
              </p>
              <p>
                Nuestras gimnastas representan con enorme suceso a Barrio Norte en selectivos entrerrianos y en los campeonatos nacionales de clubes, destacándose por su técnica y elegancia en modalidades individual, dúos y conjuntos.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Espacio</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Gimnasio Cubierto</p>
              <p className="text-xs text-gray-500 mt-0.5">Polideportivo cerrado del club</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Elementos</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Cinta, Aro, Pelota, Mazas</p>
              <p className="text-xs text-gray-500 mt-0.5">Y manos libres para iniciación</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inscripciones</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Para Todas las Edades</p>
              <p className="text-xs text-gray-500 mt-0.5">Horarios y cupos por WhatsApp</p>
            </div>
          </div>
        </section>

        {/* LOGROS DESTACADOS */}
        {ACHIEVEMENTS.length > 0 && (
          <section>
            <div className="mb-4">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
                HISTORIAL & PARTICIPACIONES
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">Logros Destacados</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {ACHIEVEMENTS.map((item) => (
                <article
                  key={`${item.title}-${item.date}`}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-gray-100">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-gray-900 text-xs font-black shadow-xs">
                      {item.date}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <IconTrophy />
                      <h3 className="font-extrabold text-base text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* GALERÍA */}
        {GALLERY.length > 0 && (
          <section>
            <div className="mb-4">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
                REGISTRO FOTOGRÁFICO
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">Galería de Gimnasia Rítmica</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {GALLERY.map((img) => (
                <div
                  key={img.src}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
