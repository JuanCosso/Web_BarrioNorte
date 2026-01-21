"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cinzel, Bebas_Neue } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
});

/* ========= DATOS (EDITABLE) ========= */
const HERO_BG = "/samba-vera/katombe/fondo.jpg"; // <- poné tu foto principal
const CTA_BG = "/samba-vera/katombe/banda.jpg"; // <- fondo del flyer/CTA (puede ser otra foto de la banda)

const PHRASE = "El carnaval en tu casa";

const HISTORY = `
Katombe es la banda que sostiene el pulso de la noche: canto, energía y presencia constante.
Acompañamos todo el espectáculo con una puesta potente y bien del barrio.
Si te gusta la música en vivo y querés formar parte, este es tu lugar.
`;

const TITLES = [
  "Título 1 (editar)",
  "Título 2 (editar)",
  "Título 3 (editar)",
  "Título 4 (editar)",
];

const MEMBERS = [
  {
    id: "voz-1",
    role: "Voz",
    name: "Nombre Apellido",
    img: "/samba-vera/katombe/cantante1_2026.jpg",
  },
  {
    id: "voz-2",
    role: "Voz",
    name: "Nombre Apellido",
    img: "/samba-vera/katombe/cantante2_2026.jpg",
  },
  {
    id: "guitarra",
    role: "Guitarra",
    name: "Nombre Apellido",
    img: "/samba-vera/katombe/integrante3.jpg",
  },
  {
    id: "bajo",
    role: "Bajo",
    name: "Nombre Apellido",
    img: "/samba-vera/katombe/integrante4.jpg",
  },
  {
    id: "teclado",
    role: "Teclado",
    name: "Nombre Apellido",
    img: "/samba-vera/katombe/integrante5.jpg",
  },
  {
    id: "percusion-1",
    role: "Percusión",
    name: "Nombre Apellido",
    img: "/samba-vera/katombe/integrante6.jpg",
  },
];

const JOIN = {
  kicker: "Sumate a la banda",
  title: "Katombe",
  message:
    "Buscamos gente con compromiso y ganas de sumar. Si cantás, tocás un instrumento o querés aprender, escribinos y te orientamos para integrarte al grupo.",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "YouTube / Facebook", href: "https://facebook.com/" },
  ],
};

/* ========= HELPERS ========= */
function useInViewOnce(offsetPx = 0) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: `${offsetPx}px 0px` }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, offsetPx]);

  return { ref, inView };
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();

    if (m.addEventListener) m.addEventListener("change", onChange);
    else m.addListener(onChange);

    return () => {
      if (m.removeEventListener) m.removeEventListener("change", onChange);
      else m.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

/* ========= TARJETA PERSONA ========= */
function PersonCard({ p, index, finePointer }) {
  const imgClass = finePointer
    ? "object-cover object-top transition-transform duration-700 group-hover:scale-110 kt-imgfx"
    : "object-cover object-top";

  return (
    <div className="group relative w-full max-w-[350px] h-[550px] overflow-hidden rounded-sm border-2 border-neutral-800 bg-[#070707] shadow-[0_0_16px_rgba(0,0,0,0.85)] transition-all duration-500 hover:border-[color:var(--kt-yellow)]/40 hover:shadow-[0_0_34px_rgba(245,197,66,0.18)]">
      <div className="absolute inset-0 bg-[#0b0b0b] flex items-center justify-center">
        <span className="text-white/15 text-xs uppercase tracking-widest font-serif">
          Katombe
        </span>
      </div>

      <div className="relative h-full w-full">
        <Image
          src={p.img}
          alt={p.name}
          fill
          className={imgClass}
          sizes="(max-width: 768px) 100vw, 350px"
          quality={85}
          priority={index === 0}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-95" />

        {finePointer && (
          <div className="absolute inset-0 bg-[color:var(--kt-red)]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay" />
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-8 text-center z-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-[color:var(--kt-yellow)]/90 group-hover:text-[color:var(--kt-yellow)] transition-colors">
          {p.role}
        </p>

        <h3
          className={[
            "w-full",
            "text-3xl sm:text-4xl font-black uppercase",
            "leading-[1.15]",
            "tracking-[-0.02em]",
            "break-words kt-balance",
            "text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-400 drop-shadow-sm",
            cinzel.className,
          ].join(" ")}
        >
          <span className="kt-safe-diacs">{p.name}</span>
        </h3>

        <div className="mt-4 flex justify-center items-center gap-1 opacity-60">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[color:var(--kt-green)]" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[color:var(--kt-red)]/80" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[color:var(--kt-green)]" />
        </div>
      </div>
    </div>
  );
}

/* ========= CTA / FLYER ========= */
function JoinFlyer({ bgSrc, content, finePointer }) {
  return (
    <section className="relative overflow-hidden bg-black">
      <div className="relative h-[70vh] min-h-[520px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={bgSrc}
            alt="Sumate"
            fill
            sizes="100vw"
            quality={80}
            className="object-cover object-center scale-110 grayscale-[0.25]"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 kt-grain opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/8 via-black to-black opacity-95" />
        </div>

        <div className="relative z-10 w-full max-w-6xl px-4">
          <div className="mx-auto max-w-3xl border border-white/15 bg-black/60 backdrop-blur-sm p-8 sm:p-10 shadow-[0_0_45px_rgba(0,0,0,0.65)]">
            <p className="text-xs uppercase tracking-[0.6em] text-gray-200/70 font-bold mb-3">
              {content.kicker}
            </p>

            <h3
              className={[
                "text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] uppercase",
                "text-transparent bg-clip-text",
                "bg-gradient-to-b from-white via-gray-200 to-gray-500",
                "drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]",
                bebas.className,
              ].join(" ")}
            >
              {content.title}
            </h3>

            <div className="mt-5 h-[3px] w-full bg-gradient-to-r from-[color:var(--kt-green)] via-[color:var(--kt-yellow)] to-[color:var(--kt-red)] opacity-70" />

            <p className={`mt-6 text-base sm:text-lg text-gray-200/80 leading-relaxed ${cinzel.className}`}>
              {content.message}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {content.socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "inline-flex items-center justify-center",
                    "px-5 py-3",
                    "border border-white/15",
                    "bg-white/5 hover:bg-white/8",
                    "text-white",
                    "uppercase tracking-[0.25em] text-xs font-bold",
                    "transition-colors duration-300",
                    finePointer ? "hover:shadow-[0_0_26px_rgba(225,29,46,0.20)]" : "",
                  ].join(" ")}
                >
                  {s.label}
                </a>
              ))}
            </div>

            <p className={`mt-6 text-sm text-gray-300/60 italic ${cinzel.className}`}>
              “{PHRASE}.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========= PÁGINA PRINCIPAL ========= */
export default function Katombe() {
  const historyText = useMemo(() => HISTORY.trim(), []);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const showParticles = typeof window !== 'undefined' && !isMobile && !reduceMotion;

  const { ref: ctaRef } = useInViewOnce(-50);

  return (
    <div
      className={[
        "kt-theme",
        "bg-[#050505] text-white min-h-screen font-sans",
        cinzel.variable,
        bebas.variable,
      ].join(" ")}
    >
      {/* === HERO === */}
      <header className="relative min-h-[90vh] flex flex-col items-center justify-center pb-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover object-center opacity-55"
          />

          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 kt-grain opacity-20 pointer-events-none" />

          {/* banda de color (verde/amarillo/rojo) */}
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[color:var(--kt-green)] via-[color:var(--kt-yellow)] to-[color:var(--kt-red)] opacity-80" />

          {showParticles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="kt-particle k1" />
              <div className="kt-particle k2" />
              <div className="kt-particle k3" />
              <div className="kt-particle k4" />
            </div>
          )}
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto mt-10 overflow-visible">
          <div className="relative inline-block mb-2 overflow-visible">
            <h1
              className={[
                "font-black uppercase text-center",
                "tracking-[-0.06em]",
                "leading-[1.02]",
                "text-[clamp(3.6rem,12vw,10rem)]",
                bebas.className,
              ].join(" ")}
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-[0_6px_8px_rgba(0,0,0,1)] pt-6 pb-2 px-3 sm:px-4">
                KATOMBE
              </span>
            </h1>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] h-[55%] bg-white/10 blur-[120px] -z-10 rounded-full" />
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-[color:var(--kt-green)]" />
            <h2
              className={[
                "text-lg sm:text-2xl font-bold",
                "text-gray-100/85",
                "tracking-[0.35em] uppercase",
                cinzel.className,
              ].join(" ")}
            >
              {PHRASE}
            </h2>
            <div className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-[color:var(--kt-red)]" />
          </div>
        </div>
      </header>

      {/* === HISTORIA + TÍTULOS === */}
      <section className="relative py-24 bg-[#070707]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center mb-24 relative">
            <h3 className="text-xs uppercase tracking-[0.6em] text-gray-200/70 font-bold mb-8">
              La Banda
            </h3>
            <p className={`text-xl sm:text-3xl leading-normal text-gray-300/80 ${cinzel.className}`}>
              {historyText}
            </p>
          </div>

          <div className="border-y border-white/10 py-12 relative">
            <div className="absolute inset-0 bg-white/3 mix-blend-overlay" />

            <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-around items-center gap-y-10 relative z-10">
              {TITLES.map((title, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center min-w-[160px] max-w-[240px] px-2 group cursor-default"
                >
                  <div className="w-2 h-2 rotate-45 bg-[color:var(--kt-yellow)]/50 mb-4 group-hover:bg-[color:var(--kt-yellow)] transition-colors" />
                  <span
                    className={[
                      "kt-balance whitespace-normal break-words text-center",
                      "text-sm sm:text-base font-bold uppercase",
                      "leading-snug",
                      "tracking-[0.22em]",
                      "text-gray-500 group-hover:text-gray-200 transition-colors",
                      cinzel.className,
                    ].join(" ")}
                  >
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === INTEGRANTES === */}
      <section className="relative py-30 py-28 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[#060606]">
          <div className="absolute inset-0 kt-grain opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/8 to-transparent" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-18 mb-16">
            <h2
              className={[
                "px-2",
                "font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500",
                "drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]",
                "tracking-[-0.06em] leading-[1.08]",
                "text-[clamp(3rem,10vw,6.5rem)]",
                cinzel.className,
              ].join(" ")}
            >
              INTEGRANTES
            </h2>

            <div className="flex justify-center items-center mt-2">
              <span className="text-gray-200/80 font-bold uppercase tracking-[0.6em] text-xs sm:text-sm border-t border-b border-white/10 py-2 px-6">
                Katombe en vivo
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {MEMBERS.map((p, i) => (
              <PersonCard key={p.id} p={p} index={i} finePointer={finePointer} />
            ))}
          </div>
        </div>
      </section>

      {/* === FLYER / CTA SUMATE === */}
      <div ref={ctaRef}>
        <JoinFlyer bgSrc={CTA_BG} content={JOIN} finePointer={finePointer} />
      </div>

      <style jsx global>{`
        /* Tema: basado en tus capturas (negro + rojo/amarillo/verde) */
        .kt-theme {
          --kt-red: #e11d2e;
          --kt-yellow: #f5c542;
          --kt-green: #16a34a;
        }

        .kt-balance {
          text-wrap: balance;
        }

        .kt-safe-diacs {
          display: inline-block;
          padding-top: 0.26em;
          padding-bottom: 0.14em;
        }

        .kt-grain {
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.03) 0px,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 4px
            );
        }

        .kt-imgfx {
          filter: grayscale(0.25) contrast(1.08);
          will-change: transform;
        }
        @media (hover: hover) and (pointer: fine) {
          .group:hover .kt-imgfx {
            filter: grayscale(0);
          }
        }

        .kt-particle {
          position: absolute;
          border-radius: 999px;
          opacity: 0;
          bottom: -10px;
        }

        .k1 {
          width: 4px;
          height: 4px;
          left: 20%;
          background: radial-gradient(circle, var(--kt-green) 0%, transparent 70%);
          animation: ktFlyUp 7.2s infinite linear;
        }
        .k2 {
          width: 6px;
          height: 6px;
          left: 52%;
          background: radial-gradient(circle, var(--kt-yellow) 0%, transparent 70%);
          animation: ktFlyUp 10.5s infinite linear 2s;
        }
        .k3 {
          width: 3px;
          height: 3px;
          left: 72%;
          background: radial-gradient(circle, var(--kt-red) 0%, transparent 70%);
          animation: ktFlyUp 5.6s infinite linear 1s;
        }
        .k4 {
          width: 5px;
          height: 5px;
          left: 36%;
          background: radial-gradient(circle, #ffffff 0%, transparent 70%);
          animation: ktFlyUp 8.8s infinite linear 3s;
        }

        @keyframes ktFlyUp {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          20% {
            opacity: 0.75;
          }
          50% {
            opacity: 0.35;
          }
          100% {
            opacity: 0;
            transform: translateY(-80vh) scale(0.2);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .kt-particle {
            animation: none !important;
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .kt-particle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
