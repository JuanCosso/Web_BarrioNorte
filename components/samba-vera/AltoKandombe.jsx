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
const HERO_BG = "/samba-vera/alto-kandombe/fondo.jpg"; // <- cambiá por tu asset real en /public

const HISTORY = `
Alto Kandombe es tambor, calle y pertenencia. 
Una batería que late con el barrio y construye identidad golpe a golpe.
Sangre verde y rosa: energía, respeto y comunidad al servicio del carnaval.
`;

const TITLES = [
  "Título 1 (editar)",
  "Título 2 (editar)",
  "Título 3 (editar)",
  "Título 4 (editar)",
];

const DIRECTORS = [
  {
    id: "director-1",
    role: "Director",
    name: "Paul Corradi",
    img: "/samba-vera/alto-kandombe/director1_2026.jpg",
  },
  {
    id: "director-2",
    role: "Director",
    name: "Lukas Azorín",
    img: "/samba-vera/alto-kandombe/director2_2026.jpg",
  },
];

const CTA_BG = "/samba-vera/alto-kandombe/bateriav2.jpg"; // <- opcional (si no tenés, dejalo igual y luego lo cambiás)
const JOIN = {
  kicker: "Sumate a la batería",
  title: "Alto Kandombe",
  message:
    "Si te mueve el tambor y querés ser parte de una familia que trabaja con respeto y pasión, este es tu lugar. No hace falta experiencia: te acompañamos en el proceso.",
  socials: [
    {
      label: "Instagram",
      href: "https://instagram.com/", // <- pegá tu link real
    },
    {
      label: "TikTok / Facebook",
      href: "https://facebook.com/", // <- pegá tu link real (o cambiá el label)
    },
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
    ? "object-cover object-top transition-transform duration-700 group-hover:scale-110 ak-imgfx"
    : "object-cover object-top";

  return (
    <div className="group relative w-full max-w-[350px] h-[550px] overflow-hidden rounded-sm border-2 border-neutral-800 bg-[#050707] shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]">
      <div className="absolute inset-0 bg-[#070a0a] flex items-center justify-center">
        <span className="text-emerald-200/20 text-xs uppercase tracking-widest font-serif">
          Alto Kandombe
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

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        {finePointer && (
          <div className="absolute inset-0 bg-emerald-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay" />
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-8 text-center z-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-pink-400/90 group-hover:text-pink-300 transition-colors">
          {p.role}
        </p>

        <h3
          className={[
            "w-full",
            "text-3xl sm:text-4xl font-black uppercase",
            "leading-[1.15]",
            "tracking-[-0.02em]",
            "break-words ak-balance",
            "text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-400 drop-shadow-sm",
            cinzel.className,
          ].join(" ")}
        >
          <span className="ak-safe-diacs">{p.name}</span>
        </h3>

        <div className="mt-4 flex justify-center items-center gap-1 opacity-50">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-600" />
          <div className="w-1.5 h-1.5 rotate-45 border border-pink-500/70" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-600" />
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
            className="object-cover object-center scale-110 grayscale-[0.35]"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 ak-grain opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/35 via-black to-black opacity-90" />
        </div>

        <div className="relative z-10 w-full max-w-6xl px-4">
          <div className="mx-auto max-w-3xl border border-emerald-500/20 bg-black/55 backdrop-blur-sm p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <p className="text-xs uppercase tracking-[0.6em] text-emerald-300/80 font-bold mb-3">
              {content.kicker}
            </p>

            <h3
              className={[
                "text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] uppercase",
                "text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 via-emerald-400 to-pink-300",
                "drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]",
                bebas.className,
              ].join(" ")}
            >
              {content.title}
            </h3>

            <div className="mt-5 h-px w-24 bg-gradient-to-r from-emerald-500/70 via-pink-500/50 to-transparent" />

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
                    "border border-emerald-400/30",
                    "bg-emerald-500/10 hover:bg-emerald-500/15",
                    "text-emerald-100",
                    "uppercase tracking-[0.25em] text-xs font-bold",
                    "transition-colors duration-300",
                    finePointer ? "hover:shadow-[0_0_25px_rgba(236,72,153,0.25)]" : "",
                  ].join(" ")}
                >
                  {s.label}
                </a>
              ))}
            </div>

            <p className={`mt-6 text-sm text-gray-300/60 italic ${cinzel.className}`}>
              “Sangre verde y rosa.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========= PÁGINA PRINCIPAL ========= */
export default function AltoKandombe() {
  const historyText = useMemo(() => HISTORY.trim(), []);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const showParticles = typeof window !== 'undefined' && !isMobile && !reduceMotion;

  // Si luego querés sumar un contador tipo “250 almas”, ya tenés el inView listo.
  const { ref: ctaRef } = useInViewOnce(-50);

  return (
    <div
      className={[
        "bg-[#010202] text-white min-h-screen font-sans",
        "selection:bg-emerald-900 selection:text-white",
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
            quality={75}
            className="object-cover object-center opacity-50"
          />

          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-[#020404] to-black opacity-90" />
          <div className="absolute inset-0 ak-grain opacity-20 pointer-events-none" />

          {showParticles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="ak-particle a1" />
              <div className="ak-particle a2" />
              <div className="ak-particle a3" />
              <div className="ak-particle a4" />
            </div>
          )}
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto mt-10 overflow-visible">
          <div className="relative inline-block mb-2 overflow-visible">
            <h1
              className={[
                "font-black uppercase text-center",
                "tracking-[-0.06em]",
                "leading-[1.05]",
                "overflow-visible",
                "text-[clamp(3.4rem,11vw,9.5rem)]",
                bebas.className,
              ].join(" ")}
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-700 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] pt-6 pb-2 px-3 sm:px-4">
                ALTO
              </span>{" "}
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-pink-200 via-pink-400 to-pink-700 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] pt-6 pb-2 px-3 sm:px-4">
                KANDOMBE
              </span>
            </h1>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[50%] bg-emerald-500/10 blur-[110px] -z-10 rounded-full" />
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-emerald-600" />
            <h2
              className={[
                "text-lg sm:text-2xl font-bold",
                "text-pink-300",
                "tracking-[0.45em] uppercase",
                cinzel.className,
              ].join(" ")}
            >
              Sangre verde y rosa
            </h2>
            <div className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-emerald-600" />
          </div>
        </div>
      </header>

      {/* === HISTORIA + TÍTULOS === */}
      <section className="relative py-24 bg-[#030505]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center mb-24 relative">
            <h3 className="text-xs uppercase tracking-[0.6em] text-emerald-300/80 font-bold mb-8">
              Nuestra Sangre
            </h3>
            <p className={`text-xl sm:text-3xl leading-normal text-gray-300/80 ${cinzel.className}`}>
              {historyText}
            </p>
          </div>

          <div className="border-y border-emerald-500/15 py-12 relative">
            <div className="absolute inset-0 bg-emerald-400/5 mix-blend-overlay" />

            <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-around items-center gap-y-10 relative z-10">
              {TITLES.map((title, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center min-w-[160px] max-w-[220px] px-2 group cursor-default"
                >
                  <div className="w-2 h-2 rotate-45 bg-pink-500/40 mb-4 group-hover:bg-pink-400 transition-colors" />
                  <span
                    className={[
                      "ak-balance whitespace-normal break-words text-center",
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

      {/* === DIRECTORES (2 CARDS) === */}
      <section className="relative py-28 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[#060707]">
          <div className="absolute inset-0 ak-grain opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-900/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2
              className={[
                "px-2",
                "font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-200 via-gray-400 to-gray-600",
                "drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]",
                "tracking-[-0.06em] leading-[1.08]",
                "text-[clamp(3rem,10vw,6rem)]",
                cinzel.className,
              ].join(" ")}
            >
              DIRECCIÓN
            </h2>

            <div className="flex justify-center items-center mt-2">
              <span className="text-emerald-200 font-bold uppercase tracking-[0.6em] text-xs sm:text-sm border-t border-b border-emerald-500/20 py-2 px-6">
                Directores de la batería
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center">
            {DIRECTORS.map((p, i) => (
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
        ::selection {
          background-color: #064e3b;
          color: #ffffff;
        }

        .ak-balance {
          text-wrap: balance;
        }

        .ak-safe-diacs {
          display: inline-block;
          padding-top: 0.26em;
          padding-bottom: 0.14em;
        }

        .ak-grain {
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.035) 0px,
              rgba(255, 255, 255, 0.035) 1px,
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

        .ak-imgfx {
          filter: grayscale(0.25) contrast(1.05);
          will-change: transform;
        }
        @media (hover: hover) and (pointer: fine) {
          .group:hover .ak-imgfx {
            filter: grayscale(0);
          }
        }

        .ak-particle {
          position: absolute;
          border-radius: 999px;
          opacity: 0;
          bottom: -10px;
          background: radial-gradient(circle, rgba(236, 72, 153, 1) 0%, transparent 70%);
        }

        .a1 {
          width: 4px;
          height: 4px;
          left: 18%;
          animation: akFlyUp 7s infinite linear;
        }
        .a2 {
          width: 6px;
          height: 6px;
          left: 52%;
          animation: akFlyUp 10s infinite linear 2s;
        }
        .a3 {
          width: 3px;
          height: 3px;
          left: 72%;
          animation: akFlyUp 5.5s infinite linear 1s;
        }
        .a4 {
          width: 5px;
          height: 5px;
          left: 36%;
          animation: akFlyUp 8.5s infinite linear 3s;
        }

        @keyframes akFlyUp {
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
          .ak-particle {
            animation: none !important;
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .ak-particle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
