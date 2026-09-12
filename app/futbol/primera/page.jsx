import { Suspense } from "react";
import Masculino from "@/components/disciplinas/futbol/masculino/Masculino";

export const metadata = {
  title: "Primera División | Fútbol CABN",
  description: "Fútbol de Primera División del Club Atlético Barrio Norte. Fixture, resultados, posiciones de la Liga Departamental de Fútbol de Gualeguay y plantel oficial.",
};

export default function FutbolPrimeraPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando Primera División...</div>}>
      <Masculino active="primera" />
    </Suspense>
  );
}
