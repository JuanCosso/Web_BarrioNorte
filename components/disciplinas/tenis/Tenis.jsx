// components/disciplinas/tenis/Tenis.jsx
import Image from "next/image";

const BRAND_RED = "#bc1717";
const DISCIPLINE_LOGO_SRC = "/logos/tenisv3.png"; // <-- ajustá si corresponde

/* ========= ICONS (inline) ========= */

function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .02 5.38.02 12c0 2.12.55 4.19 1.6 6.02L0 24l6.17-1.6A11.96 11.96 0 0 0 12.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.02 22a9.98 9.98 0 0 1-5.1-1.4l-.37-.22-3.67.95.98-3.58-.24-.37A10.01 10.01 0 0 1 2.02 12C2.02 6.49 6.5 2 12.02 2c2.67 0 5.18 1.04 7.07 2.93A9.92 9.92 0 0 1 22.02 12c0 5.51-4.49 10-10 10Zm5.79-7.52c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.31-.78 1-.96 1.2-.18.2-.35.23-.66.08-.31-.16-1.29-.47-2.46-1.5-.91-.81-1.52-1.8-1.7-2.1-.18-.31-.02-.47.14-.63.14-.14.31-.35.47-.53.16-.18.2-.31.31-.51.1-.2.06-.39-.02-.55-.08-.16-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.51.08-.78.39-.27.31-1.02 1-1.02 2.44 0 1.43 1.04 2.81 1.18 3 .14.2 2.05 3.14 4.97 4.4.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.82-.74 2.08-1.45.25-.71.25-1.31.18-1.45-.08-.14-.28-.23-.58-.39Z"
      />
    </svg>
  );
}

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M14 8.7V7c0-.7.4-1 1.2-1H17V3h-2.3C12.6 3 11 4.5 11 6.8v1.9H9v3h2V21h3v-9.3h2.4l.6-3H14Z"
      />
    </svg>
  );
}

function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2 20 6v7c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V6l8-4Zm0 4.1L6 8.3V13c0 3.9 2.5 7.5 6 8.9 3.5-1.4 6-5 6-8.9V8.3l-6-2.2Z"
      />
    </svg>
  );
}

// Ícono de modalidad: raqueta de tenis
function IconTennisRacket(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Cabeza (aro) */}
      <path
        d="M16.8 3.7a5.3 6.8 35 1 1-8.2 10.2a5.3 6.8 35 1 1 8.2-10.2Z"
        strokeWidth="2"
      />
      {/* Aro interno */}
      <path
        d="M15.9 5a4.1 5.4 35 1 1-6.3 7.9a4.1 5.4 35 1 1 6.3-7.9Z"
        strokeWidth="2"
        opacity="0.35"
      />

      {/* Cuerdas */}
      <g strokeWidth="1.2" opacity="0.65">
        <path d="M11.1 6.2L15.7 10.8" />
        <path d="M10.4 7.9L14.9 12.4" />
        <path d="M9.9 9.8L13.7 13.6" />
        <path d="M13.9 5.6L10.1 14.2" />
        <path d="M15.3 6.9L11.5 15.5" />
      </g>

      {/* Garganta */}
      <g strokeWidth="2">
        <path d="M9.0 14.0L11.4 16.4" />
        <path d="M10.2 12.8L12.6 15.2" opacity="0.9" />
      </g>

      {/* Mango */}
      <path d="M11.4 16.4L5.2 22.6" strokeWidth="2" />
      {/* Grip / cinta */}
      <g strokeWidth="2" opacity="0.6">
        <path d="M10.0 17.8l-1.4 1.4" />
        <path d="M8.7 19.1l-1.4 1.4" />
        <path d="M7.4 20.4l-1.4 1.4" />
      </g>
      {/* Tope del mango */}
      <path d="M4.4 23.4L6.0 21.8" strokeWidth="2" opacity="0.9" />

      {/* Pelota */}
      <circle cx="19.1" cy="19.1" r="2.2" strokeWidth="2" opacity="0.95" />
      <g strokeWidth="1.2" opacity="0.75">
        <path d="M18.3 16.9Q19.5 18.1 19.5 19.1Q19.5 20.1 18.3 21.3" />
        <path d="M19.9 16.9Q18.7 18.1 18.7 19.1Q18.7 20.1 19.9 21.3" />
      </g>
    </svg>
  );
}


function IconTrophy(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

/* ========= CONTENT (editable) ========= */

const CONTACT = {
  whatsappHref:
    "https://wa.me/5490000000000?text=Hola%20quiero%20sumarme%20a%20Tenis%20en%20Barrio%20Norte",
  whatsappLabel: "Consultar por WhatsApp",
  facebookHref: "https://www.facebook.com/barrionortetenis/",
  facebookLabel: "Facebook",
};

const ORG = {
  title: "Entrenamientos y partidos",
  description:
    "Los días y horarios de entrenamiento, niveles (iniciación y avanzado), y disponibilidad de cancha se consultan vía WhatsApp con la subcomisión de tenis. Se trabaja técnica, movilidad, condición física y táctica, en un ambiente de compañerismo.",
};

const ACHIEVEMENTS = [
  {
    title: "Torneo de Dobles",
    date: "2023",
    imageSrc: "/disciplinas/tenis/img_00.jpg",
    imageAlt: "Tenis Barrio Norte",
    description:
      "En el club se disputó el torneo de dobles con categorías 'A' y 'B'.",
  },
];

const GALLERY = [
  { src: "/disciplinas/tenis/img_01.jpg", alt: "Tenis 1" },
  { src: "/disciplinas/tenis/img_02.jpg", alt: "Tenis 2" },
  { src: "/disciplinas/tenis/img_03.jpg", alt: "Tenis 3" },
  { src: "/disciplinas/tenis/img_04.jpg", alt: "Tenis 4" },
  { src: "/disciplinas/tenis/img_05.jpg", alt: "Tenis 5" },
  { src: "/disciplinas/tenis/img_06.jpg", alt: "Tenis 6" },
];

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function ButtonLink({ href, children, variant = "primary", icon: Icon }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20";

  const styles =
    variant === "primary"
      ? "bg-[color:var(--brand)] text-white hover:brightness-110"
      : "ring-1 ring-inset ring-white/12 bg-white/5 text-white hover:bg-white/10";

  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`}>
      {Icon ? <Icon className="h-5 w-5 shrink-0" /> : null}
      {children}
    </a>
  );
}

export default function Tenis() {
  return (
    <div style={{ "--brand": BRAND_RED }} className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/disciplinas/tenis/banner.jpg"
            alt="Tenis Barrio Norte"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-neutral-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(188,23,23,0.25),transparent_45%)]" />
        </div>

        <div className="relative container mx-auto px-4 pt-16 pb-10 sm:pt-20 sm:pb-14">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Pill>Encuentros</Pill>
              <Pill>Aprendé desde 0</Pill>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Tenis
              <span className="block text-white/85 text-xl sm:text-2xl font-semibold mt-2">
                Constancia, táctica y juego limpio
              </span>
            </h1>

            <p className="mt-4 text-white/80 leading-relaxed">
              Entrenamientos por niveles, práctica de fundamentos y espacio para jugar singles o dobles.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <ButtonLink href={CONTACT.whatsappHref} icon={IconWhatsApp}>
                {CONTACT.whatsappLabel}
              </ButtonLink>

              <ButtonLink href={CONTACT.facebookHref} variant="secondary" icon={IconFacebook}>
                {CONTACT.facebookLabel}
              </ButtonLink>
            </div>

            {/* quick facts */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-white/80">
                  <IconShield className="h-5 w-5" />
                  <span className="text-sm">Subcomisión</span>
                </div>
                <div className="mt-2 font-semibold">Información actualizada</div>
                <div className="text-sm text-white/70">Precios y horarios</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-white/80">
                  <IconTennisRacket className="h-5 w-5" />
                  <span className="text-sm">Modalidad</span>
                </div>
                <div className="mt-2 font-semibold">Categorías</div>
                <div className="text-sm text-white/70">Por edad y nivel</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="container mx-auto px-4 pb-16">
        <section className="mt-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
              <div className="w-full">
                <h2 className="text-2xl sm:text-3xl font-extrabold">{ORG.title}</h2>
                <p className="mt-4 text-white/80 leading-relaxed">{ORG.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill>Participación activa en torneos de diferentes niveles</Pill>
                  <Pill>Singles y dobles</Pill>
                </div>
              </div>

              <div className="w-full flex justify-center md:justify-end">
                <Image
                  src={DISCIPLINE_LOGO_SRC}
                  alt="Logo/escudo de Tenis"
                  width={320}
                  height={320}
                  className="h-40 w-40 sm:h-44 sm:w-44 md:h-56 md:w-56 object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </section>

        {ACHIEVEMENTS.length > 0 && (
          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold">Destacados</h3>
                <p className="mt-2 text-sm text-white/70">Resultados y participaciones recientes.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((a) => (
                <article
                  key={`${a.title}-${a.date}`}
                  className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/7 transition"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={a.imageSrc}
                      alt={a.imageAlt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-white/90">
                        <IconTrophy className="h-5 w-5 text-amber-400" />
                        <span className="font-semibold">{a.title}</span>
                      </div>
                      <span className="text-xs text-white/80 rounded-full border border-white/10 bg-black/30 px-2 py-1">
                        {a.date}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-white/75 leading-relaxed">{a.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {GALLERY.length > 0 && (
          <section className="mt-10">
            <h3 className="text-xl sm:text-2xl font-extrabold">Galería</h3>
            <p className="mt-2 text-sm text-white/70">Fotos de entrenamientos y partidos.</p>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {GALLERY.map((img) => (
                <div
                  key={img.src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/30"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
