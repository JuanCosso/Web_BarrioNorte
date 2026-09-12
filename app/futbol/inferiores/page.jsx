import { Suspense } from "react";
import Inferiores from "@/components/disciplinas/futbol/inferiores/Inferiores";

export const metadata = {
  title: "Divisiones Inferiores | Fútbol CABN",
  description: "Divisiones Inferiores del Club Atlético Barrio Norte. Categorías Sub-17, Sub-15 y Sub-13, tablas de posiciones y torneos de la Liga.",
};

export default function FutbolInferioresPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando Divisiones Inferiores...</div>}>
      <Inferiores active="inferiores" />
    </Suspense>
  );
}
