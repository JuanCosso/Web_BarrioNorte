import { Suspense } from "react";
import Futbol from "@/components/disciplinas/futbol/Futbol";

export default function FutbolPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando disciplinas...</div>}>
      <Futbol />
    </Suspense>
  );
}