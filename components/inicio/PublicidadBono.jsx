// components/inicio/PublicidadBono.jsx
import Image from "next/image";

const INSTAGRAM_BONO_URL =
  "https://www.instagram.com/p/DLsAmYUuz5R/?img_index=1";

export default function PublicidadBono() {
  return (
    <a
      href={INSTAGRAM_BONO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="
        block group w-full
        max-w-xs mx-auto              /* tamaño más chico en pantallas pequeñas */
        sm:max-w-sm
        lg:max-w-none lg:mx-0        /* en desktop ocupa toda la columna */
      "
    >
      <div
        className="
          bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden
          transition-shadow transition-transform
          hover:shadow-md hover:-translate-y-0.5
        "
      >
        {/* Imagen: sin efecto de zoom */}
        <div className="relative w-full aspect-[3/4] md:aspect-[4/5]">
          <Image
            src="/inicio/bono_2026.png"
            alt="Bono contribución Club Atlético Barrio Norte"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 260px, 100vw"
          />
        </div>

        <div className="px-3 py-4">
          <p className="text-sm font-semibold text-gray-800 leading-snug">
            Participá por una casa a estrenar y premios mensuales.
          </p>
          <p className="mt-1 text-xs text-red-600 font-semibold">
            Adquirilo al contado o en cuotas.
          </p>
        </div>
      </div>
    </a>
  );
}
