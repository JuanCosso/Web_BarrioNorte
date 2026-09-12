// components/disciplinas/bochas/Bochas.jsx
import Image from "next/image";

function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5" {...props}>
      <path
        fill="currentColor"
        d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .02 5.38.02 12c0 2.12.55 4.19 1.6 6.02L0 24l6.17-1.6A11.96 11.96 0 0 0 12.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.02 22a9.98 9.98 0 0 1-5.1-1.4l-.37-.22-3.67.95.98-3.58-.24-.37A10.01 10.01 0 0 1 2.02 12C2.02 6.49 6.5 2 12.02 2c2.67 0 5.18 1.04 7.07 2.93A9.92 9.92 0 0 1 22.02 12c0 5.51-4.49 10-10 10Zm5.79-7.52c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.31-.78 1-.96 1.2-.18.2-.35.23-.66.08-.31-.16-1.29-.47-2.46-1.5-.91-.81-1.52-1.8-1.7-2.1-.18-.31-.02-.47.14-.63.14-.14.31-.35.47-.53.16-.18.2-.31.31-.51.1-.2.06-.39-.02-.55-.08-.16-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.51.08-.78.39-.27.31-1.02 1-1.02 2.44 0 1.43 1.04 2.81 1.18 3 .14.2 2.05 3.14 4.97 4.4.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.82-.74 2.08-1.45.25-.71.25-1.31.18-1.45-.08-.14-.28-.23-.58-.39Z"
      />
    </svg>
  );
}

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5" {...props}>
      <path
        fill="currentColor"
        d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.4-.1-2.7-.1-2.7 0-4.6 1.6-4.6 4.7V11H7v3h2.8v8h3.7Z"
      />
    </svg>
  );
}

function IconTrophy(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="h-5 w-5 text-amber-500 flex-shrink-0" {...props}>
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

const CONTACT = {
  whatsappHref:
    "https://wa.me/5493444123456?text=Hola%20quiero%20sumarme%20a%20Bochas%20en%20Barrio%20Norte",
  facebookHref: "https://www.facebook.com/p/Club-Atletico-Barrio-Norte-Gualeguay-100063591160216/",
  whatsappLabel: "Consultar por WhatsApp",
  facebookLabel: "Facebook Oficial",
};

const ACHIEVEMENTS = [
  {
    title: "Roberto Paz Campeón Provincial",
    date: "2025",
    imageSrc: "/disciplinas/bochas/foto_05.jpg",
    imageAlt: "Roberto Paz campeón",
    description:
      "Gran victoria en el certamen comercial de alto nivel organizado por la subcomisión de bochas del club.",
  },
  {
    title: "Dos Duplas Campeonas",
    date: "2023",
    imageSrc: "/disciplinas/bochas/foto_20v2.jpg",
    imageAlt: "Doble título para el Norte",
    description:
      "Torneo aniversario de Barrio Norte: campeones Marcelo Duraczek y José María Pérez en caballeros; Delia Batta y Celeste Fiorotto en damas.",
  },
];

const GALLERY = [
  { src: "/disciplinas/bochas/foto_15.jpg", alt: "Partido de bochas en juego" },
  { src: "/disciplinas/bochas/foto_14.jpg", alt: "Roberto Paz y familia Dotta" },
  { src: "/disciplinas/bochas/foto_04.jpg", alt: "Plantel de bochas CABN" },
  { src: "/disciplinas/bochas/foto_02.jpg", alt: "Equipo de Barrio Norte" },
  { src: "/disciplinas/bochas/foto_19.jpg", alt: "Dupla representativa" },
  { src: "/disciplinas/bochas/foto_18.jpg", alt: "Cancha de bochas" },
];

export default function Bochas() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* HEADER INSTITUCIONAL */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-900 font-semibold mb-2">
            DISCIPLINAS DEPORTIVAS
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Bochas en <span className="text-[#B71C1C] italic">Barrio Norte</span>
          </h1>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-10">
        {/* BANNER SHOWCASE */}
        <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-lg">
          <div className="absolute inset-0">
            <Image
              src="/disciplinas/bochas/foto_00.jpg"
              alt="Bochas Barrio Norte"
              fill
              priority
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-red-500">
                TRADICIÓN Y COMPETENCIA SOCIAL
              </p>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Sumate a las bochas de Barrio Norte
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Un espacio histórico de encuentro, destreza y camaradería junto a la cantina del club. No hace falta experiencia previa: te enseñamos las reglas y técnicas.
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
                  href={CONTACT.facebookHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  <IconFacebook />
                  {CONTACT.facebookLabel}
                </a>
              </div>
            </div>

            <div className="relative w-32 h-36 sm:w-40 sm:h-44 flex-shrink-0 drop-shadow-2xl mx-auto md:mx-0">
              <Image
                src="/escudos/BarrioNorte_V3.png"
                alt="Escudo Barrio Norte"
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
                Pilar de Identidad y Encuentro Social
              </h3>
              <p>
                Las bochas constituyen una de las actividades fundacionales y más arraigadas del Club Atlético Barrio Norte. Con canchas reglamentarias situadas estratégicamente al lado de la tradicional cantina social, este espacio combina la puntería, la estrategia de juego y la concentración con una atmósfera inigualable de confraternidad barrial.
              </p>
              <p>
                Aquí socios históricos, familias y nuevas generaciones se encuentran para disfrutar de intensas partidas, compartir historias y transmitir la pasión bochófila que identifica al club en toda la provincia de Entre Ríos.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-base">
                Competencias, Categorías y Campeonatos
              </h3>
              <p>
                Nuestros representantes compiten en certámenes zonales e interasociaciones en modalidades Individual, Parejas y Tríos, habiendo obtenido consagraciones destacadas como el título provincial de Roberto Paz y el doble campeonato aniversario del club.
              </p>
              <p>
                A lo largo del año se disputan torneos comerciales e internos que convocan a aficionados de toda la región, consolidando a Barrio Norte como una plaza de referencia indiscutida en la disciplina.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Instalaciones</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Junto a la Cantina</p>
              <p className="text-xs text-gray-500 mt-0.5">Canchas cubiertas con iluminación</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Modalidades</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Individual, Parejas y Tríos</p>
              <p className="text-xs text-gray-500 mt-0.5">Certámenes oficiales y comerciales</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Participación</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Abierto a Socios</p>
              <p className="text-xs text-gray-500 mt-0.5">Consultá días y turnos por WhatsApp</p>
            </div>
          </div>
        </section>

        {/* DESTACADOS / LOGROS */}
        {ACHIEVEMENTS.length > 0 && (
          <section>
            <div className="mb-4">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
                HISTORIAL & LOGROS
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">Títulos y Destacados</h2>
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
        <section>
          <div className="mb-4">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B71C1C]">
              REGISTRO FOTOGRÁFICO
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900">Galería de Bochas</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {GALLERY.map((img) => (
              <div
                key={img.src}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs font-medium drop-shadow-sm">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
