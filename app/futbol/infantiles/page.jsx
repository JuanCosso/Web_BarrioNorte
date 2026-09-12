import { Suspense } from "react";
import Infantiles from "@/components/disciplinas/futbol/infantiles/Infantiles";

export const metadata = {
  title: "Fútbol Infantil | Club Atlético Barrio Norte",
  description: "Fútbol Infantil y Escuelita del Club Atlético Barrio Norte. Formación deportiva y recreativa para los más chicos del Norte.",
};

export default function FutbolInfantilesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando Fútbol Infantil...</div>}>
      <Infantiles active="infantiles" />
    </Suspense>
  );
}
