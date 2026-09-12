import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "404 - Página no encontrada | Club Atlético Barrio Norte",
  description: "La página que estás buscando no existe o fue movida.",
};

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[70vh] bg-gray-50 px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Escudo con sombra */}
        <div className="relative w-28 h-32 mx-auto drop-shadow-[0_10px_20px_rgba(183,28,28,0.25)] transition-transform hover:scale-105">
          <Image
            src="/escudos/BarrioNorte_V3.png"
            alt="Escudo Club Atlético Barrio Norte"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 404 y textos */}
        <div>
          <span className="text-sm uppercase tracking-[0.3em] font-extrabold text-[#B71C1C]">
            Error 404
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Página no encontrada
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            El enlace al que intentás acceder no existe o fue trasladado.
          </p>
        </div>

        {/* Botón principal */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#B71C1C] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-red-800 transition-all hover:scale-105"
          >
            Volver al Inicio
          </Link>
        </div>

        {/* Enlaces de rescate */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            O visitá estas secciones:
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold text-gray-700">
            <Link href="/noticias" className="hover:text-[#B71C1C] underline">
              Noticias
            </Link>
            <span>•</span>
            <Link href="/club/historia" className="hover:text-[#B71C1C] underline">
              Historia
            </Link>
            <span>•</span>
            <Link href="/disciplinas/futbol" className="hover:text-[#B71C1C] underline">
              Fútbol
            </Link>
            <span>•</span>
            <Link href="/socios/montos" className="hover:text-[#B71C1C] underline">
              Asociate
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
