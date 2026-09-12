import { Suspense } from "react";
import Femenino from "@/components/disciplinas/futbol/femenino/Femenino";

export const metadata = {
  title: "Fútbol Femenino | Club Atlético Barrio Norte",
  description: "Fútbol Femenino del Club Atlético Barrio Norte. Tablas de posiciones, fixture, cuerpo técnico, plantel y convocatorias.",
};

export default function FutbolFemeninoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando Fútbol Femenino...</div>}>
      <Femenino active="femenino" />
    </Suspense>
  );
}
