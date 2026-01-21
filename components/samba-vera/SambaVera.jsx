"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
});

/* ========= DATOS ========= */
const HERO_BG = "/samba-vera/fondo_loop.gif";

const HISTORY = `
Samba Verá es la fuerza que nace del barrio, una tormenta de percusión y danza que no pide permiso. 
Nacimos para romper el silencio, integrando la pasión por la samba con una puesta en escena que desafía lo establecido.
Más que una comparsa, somos una identidad que avanza con el pulso de nuestra gente.
`;

const TITLES = [
  "Campeones 2009",
  "Campeones 2010",
  "Campeones 2011",
  "Campeones 2013",
  "Campeones 2018",
];

const PROTAGONISTS = [
  {
    id: "locutor",
    role: "Locutor",
    name: "Cristian Ruiz",
    img: "/samba-vera/locutor_2026.jpg",
  },
  {
    id: "reina",
    role: "Reina",
    name: "Pilar Otegui",
    img: "/samba-vera/reinaV3_2026.jpg",
  },
  {
    id: "pasista-fem",
    role: "Pasista Femenina",
    name: "Ana Laura Velardis",
    img: "/samba-vera/pasista-fem_2026.jpg",
  },
  {
    id: "pasista-masc",
    role: "Pasista Masculino",
    name: "Lucas Carrizo",
    img: "/samba-vera/pasista-masc_2026.jpg",
  },
  {
    id: "rey-momo",
    role: "Rey Momo",
    name: "Sin Nombre",
    img: "/samba-vera/reymomov2_2026.jpg",
  },
  {
    id: "grupo-coreo",
    role: "Grupo Coreográfico",
    name: "Lihuel Valdez",
    img: "/samba-vera/grupocoreo_2026.jpg",
  },
  {
    id: "ballet",
    role: "Ballet de Batería",
    name: "Sin Nombre",
    img: "/samba-vera/ballet_2026.jpg",
  },
  {
    id: "embajadora",
    role: "Embajadora",
    name: "Martina Portaluppi",
    img: "/samba-vera/embajadora_2026.jpg",
  },
  {
    id: "embajadora-musica",
    role: "Embajadora de la Música",
    name: "Pierina Bultynch",
    img: "/samba-vera/embajadora-musica_2026.jpg",
  },
  {
    id: "personificacion",
    role: "Personificación",
    name: "Sin Nombre",
    img: "/samba-vera/personificacion_2026.jpg",
  },
  {
    id: "portabandera",
    role: "Portabandera",
    name: "Sin Nombre",
    img: "/samba-vera/portabandera_2026.jpg",
  },
  {
    id: "maestro-de-sala",
    role: "Maestro de Sala",
    name: "Sin Nombre",
    img: "/samba-vera/maestrosala_2026.jpg",
  },
];

const BG_FOOTER = "/samba-vera/fondo.jpg";

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
    if (typeof window === "undefined") return;

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

function useAnimatedCounter({ to = 250, durationMs = 2500, start, reduceMotion }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) return;

    let raf = 0;
    const t0 = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, durationMs, reduceMotion]);

  if (reduceMotion && start) return to;
  return value;
}

/* ========= TARJETA ========= */
function PersonCard({ p, index, finePointer }) {
  const imgClass = finePointer
    ? "object-cover object-top transition-transform duration-700 group-hover:scale-110 contrast-125 sv-imgfx"
    : "object-cover object-top";

  return (
    <div className="group relative w-full max-w-[350px] h-[550px] overflow-hidden rounded-sm border-2 border-neutral-800 bg-[#0a0505] shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-red-900/60 hover:shadow-[0_0_30px_rgba(153,27,27,0.3)]">
      <div className="absolute inset-0 bg-[#120808] flex items-center justify-center">
        <span className="text-red-900/30 text-xs uppercase tracking-widest font-serif">
          Servus
        </span>
      </div>

      <div className="relative h-full w-full">
        <Image
          src={p.img}
          alt={p.name}
          fill
          className={imgClass}
          sizes="(max-width: 768px) 100vw, 350px"
          quality={70}
          priority={index === 0}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        {finePointer && (
          <div className="absolute inset-0 bg-red-900/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay" />
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-8 text-center z-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-red-600 opacity-90 group-hover:text-red-500 transition-colors">
          {p.role}
        </p>

        <h3
          className={[
            "w-full",
            "text-3xl sm:text-4xl font-black uppercase",
            "leading-[1.15]",
            "tracking-[-0.02em]",
            "break-words sv-balance",
            "text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-400 drop-shadow-sm",
            cinzel.className,
          ].join(" ")}
        >
          <span className="sv-safe-diacs">{p.name}</span>
        </h3>

        <div className="mt-4 flex justify-center items-center gap-1 opacity-50">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-red-800"></div>
          <div className="w-1.5 h-1.5 rotate-45 border border-red-700"></div>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-red-800"></div>
        </div>
      </div>
    </div>
  );
}

/* ========= PÁGINA PRINCIPAL ========= */
export default function SambaVeraFinal() {
  const historyText = useMemo(() => HISTORY.trim(), []);

  const mounted = typeof window !== "undefined";

  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const showParticles = mounted && !isMobile && !reduceMotion;

  const { ref: counterRef, inView } = useInViewOnce(-50);
  const count = useAnimatedCounter({
    to: 250,
    durationMs: 2800,
    start: inView,
    reduceMotion,
  });

  return (
    <div
      className={`bg-[#020101] text-white min-h-screen font-sans selection:bg-red-900 selection:text-white ${cinzel.variable}`}
    >
      {/* === HERO SECTION === */}
      {/* CAMBIO: se eliminó border-b (línea inferior) */}
      <header className="relative min-h-[90vh] flex flex-col items-center justify-center pb-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={70}
            className="object-cover object-center opacity-45"
          />

          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#220a0a] via-[#0a0202] to-black opacity-90" />
          <div className="absolute inset-0 sv-grain opacity-20 pointer-events-none" />

          {showParticles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="fire-particle p1"></div>
              <div className="fire-particle p2"></div>
              <div className="fire-particle p3"></div>
              <div className="fire-particle p4"></div>
            </div>
          )}
        </div>

        {/* CAMBIO: se eliminaron las 2 líneas laterales (left/right) */}

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto mt-10 overflow-visible">
          <div className="relative inline-block mb-2 overflow-visible">
            <h1
              className={[
                "font-black uppercase text-center",
                "tracking-[-0.06em]",
                "leading-[1.25]",
                "overflow-visible",
                "text-[clamp(3.25rem,10vw,9rem)]",
                cinzel.className,
              ].join(" ")}
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-gray-300 via-gray-500 to-gray-800 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] filter brightness-110 pt-6 pb-3 px-3 sm:px-4">
                SAMBA
              </span>{" "}
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-gray-200 via-gray-400 to-gray-700 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] pt-6 pb-3 px-3 sm:px-4">
                VERÁ
              </span>
            </h1>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[50%] bg-red-600/10 blur-[100px] -z-10 rounded-full" />
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-red-800" />
            <h2
              className={`text-lg sm:text-2xl font-bold text-red-700 tracking-[0.5em] uppercase ${cinzel.className}`}
            >
              Avanza y Arraza
            </h2>
            <div className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-red-800" />
          </div>
        </div>
      </header>

      {/* === HISTORIA === */}
      <section className="relative py-24 bg-[#050202]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center mb-24 relative">
            <h3 className="text-xs uppercase tracking-[0.6em] text-red-600/80 font-bold mb-8">
              Nuestra Sangre
            </h3>
            <p className={`text-xl sm:text-3xl leading-normal text-gray-400 ${cinzel.className}`}>
              {historyText}
            </p>
          </div>

          <div className="border-y border-red-900/20 py-12 relative">
            <div className="absolute inset-0 bg-red-900/5 mix-blend-overlay" />

            <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-around items-center gap-y-10 relative z-10">
              {TITLES.map((title, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center min-w-[160px] max-w-[220px] px-2 group cursor-default"
                >
                  <div className="w-2 h-2 rotate-45 bg-red-900/50 mb-4 group-hover:bg-red-600 transition-colors" />
                  <span
                    className={[
                      "sv-balance whitespace-normal break-words text-center",
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

      {/* === PROTAGONISTAS === */}
      <section className="relative py-32 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[#080808]">
          <div className="absolute inset-0 sv-grain opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-red-900/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2
              className={[
                "px-2",
                "font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-200 via-gray-400 to-gray-600",
                "drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]",
                "tracking-[-0.06em] leading-[1.08]",
                "text-[clamp(4rem,14vw,8.5rem)]",
                cinzel.className,
              ].join(" ")}
            >
              SERVUS
            </h2>

            <div className="flex justify-center items-center mt-2">
              <span className="text-red-700 font-bold uppercase tracking-[0.6em] text-sm sm:text-base border-t border-b border-red-900/30 py-2 px-6">
                Protagonistas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {PROTAGONISTS.map((p, i) => (
              <PersonCard key={p.id} p={p} index={i} finePointer={finePointer} />
            ))}
          </div>
        </div>
      </section>

      {/* === FOOTER / CONTADOR === */}
      <section
        ref={counterRef}
        className="relative h-[60vh] flex items-center justify-center border-t border-red-900/30 overflow-hidden bg-black"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={BG_FOOTER}
            alt="Integrantes"
            fill
            sizes="100vw"
            quality={70}
            className="object-cover object-center scale-110 grayscale-[0.5] "
            priority={false}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

        <div className="relative z-10 text-center px-4">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center sm:items-baseline gap-2 sm:gap-4">
            <span
              className={`text-8xl sm:text-[10rem] font-black text-white tracking-tighter drop-shadow-2xl leading-none ${cinzel.className}`}
            >
              {count}
            </span>

            <span className="text-2xl sm:text-4xl font-bold text-red-600 uppercase tracking-[0.4em] border-l-0 sm:border-l-2 border-red-900 pl-0 sm:pl-6">
              Pasistas
            </span>
          </div>

          <div className="w-20 h-1 bg-red-800 mx-auto mt-5 mb-4 rounded-full" />

          <p className={`text-gray-400 text-base sm:text-lg opacity-90 max-w-lg mx-auto italic ${cinzel.className}`}>
            &ldquo;Porque el carnaval es nuestra manera de transmitir cultura y alegría.&rdquo;
          </p>
        </div>
      </section>

      <style jsx global>{`
        ::selection {
          background-color: #450a0a;
          color: #ffffff;
        }

        .sv-balance {
          text-wrap: balance;
        }

        .sv-safe-diacs {
          display: inline-block;
          padding-top: 0.26em;
          padding-bottom: 0.14em;
        }

        .sv-grain {
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

        .sv-imgfx {
          filter: grayscale(0.3);
          will-change: transform;
        }
        @media (hover: hover) and (pointer: fine) {
          .group:hover .sv-imgfx {
            filter: grayscale(0);
          }
        }

        .fire-particle {
          position: absolute;
          background: radial-gradient(circle, #ef4444 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          bottom: -10px;
        }

        .p1 {
          width: 4px;
          height: 4px;
          left: 20%;
          animation: flyUp 7s infinite linear;
        }
        .p2 {
          width: 6px;
          height: 6px;
          left: 50%;
          animation: flyUp 10s infinite linear 2s;
        }
        .p3 {
          width: 3px;
          height: 3px;
          left: 70%;
          animation: flyUp 5s infinite linear 1s;
        }
        .p4 {
          width: 5px;
          height: 5px;
          left: 35%;
          animation: flyUp 8s infinite linear 4s;
        }

        @keyframes flyUp {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          20% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
            transform: translateY(-80vh) scale(0.2);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fire-particle {
            animation: none !important;
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .fire-particle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
