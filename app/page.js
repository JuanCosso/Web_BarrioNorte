import HeroSlider from "../components/inicio/HeroSlider";
import NoticiasYPosiciones from "../components/inicio/NoticiasYPosiciones";
import FlyerProximoPartido from "../components/inicio/FlyerProximoPartido";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HERO / MENSAJE DE BIENVENIDA */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-900 font-semibold text-center mb-3">
            Club Atlético Barrio Norte
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 text-center">
            Forjando{" "}
            <span className="text-[#bc1717] italic">pasión</span>
            <span className="text-gray-900"> en la ciudad</span>
          </h1>
        </div>
      </header>

      {/* SLIDER PRINCIPAL */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* BLOQUE NOTICIAS + POSICIONES */}
      <NoticiasYPosiciones />

      {/* Flyer próximo partido */}
      <FlyerProximoPartido />
    </div>
  );
}
