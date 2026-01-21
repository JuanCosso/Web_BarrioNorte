// components/layout/Footer.jsx
import Link from "next/link";
import Image from "next/image";

const sponsors = [
  { name: "Planeta Fútbol", href: "https://www.instagram.com/planeta_futbollg/", logo: "/sponsors/PlanetaFutBolFIX.png" },
  { name: "Kion", href: "https://kionstore.com.ar/", logo: "/sponsors/Kion25FIX.png" },
  { name: "Pinturería Calcagno", href: "https://www.instagram.com/pintureriascalcagno/", logo: "/sponsors/PintureriaCalcagnoFIX.png" },
  { name: "La Barraca", href: "https://www.instagram.com/labarracamateriales/", logo: "/sponsors/LaBarracaFIX.png" },
  { name: "La Segunda Seguros", href: "https://www.lasegunda.com.ar", logo: "/sponsors/LaSegunda25FIX.png" },
  { name: "Geniol", href: "https://www.facebook.com/p/Sandwicheria-Geniol-100034227323427/?locale=es_LA", logo: "/sponsors/GeniolFIX.png" },
];

// Íconos SVG (igual que antes)
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M13.5 8.5H15V6h-1.5a3 3 0 0 0-3 3v2H8v2.5h2.5V18H13v-4.5h2L15.5 11H13V9a.5.5 0 0 1 .5-.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="5"
        ry="5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="16.5" cy="7.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/p/Club-Atletico-Barrio-Norte-Gualeguay-100063591160216/?locale=es_LA",
    Icon: FacebookIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/barrionortegualeguay/",
    Icon: InstagramIcon,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 bg-[#111111] text-gray-200 pt-16 pb-6">
      {/* Capa de textura */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: "url(/fondos/fondo_campeon.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(100%) contrast(130%)",
        }}
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 space-y-10">
          {/* SPONSORS */}
          <section className="pt-2 sm:pt-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B71C1C]">
                  Sponsors
                </p>
                <p className="text-sm text-white">
                  Gracias a quienes acompañan al Club Atlético Barrio Norte.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {sponsors.map((sponsor) => (
                <Link
                  key={sponsor.name}
                  href={sponsor.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center"
                >
                  <div className="relative w-full max-w-[130px] aspect-[1006/709]">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="
                        object-contain
                        grayscale
                        opacity-70
                        transition-all
                        duration-300
                        group-hover:grayscale-0
                        group-hover:opacity-100
                      "
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* RESTO IGUAL QUE TENÍAS */}
          <section className="grid gap-8 md:grid-cols-3">
            {/* Marca y lema */}
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-14 w-12 sm:h-16 sm:w-14 drop-shadow-lg">
                  <Image
                    src="/logos/CABN-blanco.png"
                    alt="Escudo Barrio Norte"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-xs uppercase tracking-[0.3em] text-white">
                    Club Atlético
                  </p>
                  <p className="text-lg font-bold uppercase text-[#B71C1C] sm:text-xl">
                    Barrio Norte
                  </p>
                </div>
              </Link>

              <p className="mt-3 max-w-xs text-sm text-gray-400">
                La institución social y deportiva más pasional de la ciudad de Gualeguay. Sé parte de nuestra familia.
              </p>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B71C1C]">
                Contacto
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-white">
                <li>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Dirección
                  </span>
                  <a
                    href="https://www.google.com/maps/place/Club+Atl%C3%A9tico+Barrio+Norte/@-33.1316857,-59.3140357,604m/data=!3m2!1e3!4b1!4m6!3m5!1s0x95b09b6975738951:0xe46c15d507305fe1!8m2!3d-33.1316857!4d-59.3140357!16s%2Fg%2F11fxb0mb8m?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                    className="hover:text-white hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    San Martín y Padre A. Calgaro, Gualeguay, Entre Ríos.
                  </a>
                </li>
                <li>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Email
                  </span>
                  <a
                    href="mailto:todobarrionorte1@gmail.com"
                    className="hover:text-white hover:underline"
                  >
                    todobarrionorte1@gmail.com
                  </a>
                </li>
                <li>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Teléfono
                  </span>
                  <a
                    href="https://wa.me/5493444123456"
                    className="hover:text-white hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    +54 9 3444 123456
                  </a>
                </li>
              </ul>
            </div>

            {/* Redes */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B71C1C]">
                Redes sociales
              </h3>
              <p className="mt-3 text-sm text-gray-400">
                Seguí al club en las redes para entenrarte las novedades.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/90 transition hover:border-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
                    aria-label={name}
                  >
                    <Icon className="h-7 w-7" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 border-t border-white/10">
          <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 pt-4 text-xs text-gray-400 md:flex-row">
            <p>
              © {currentYear} Club Atlético Barrio Norte. Todos los derechos reservados.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
              Cada vez <span className="font-black">más grande</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
