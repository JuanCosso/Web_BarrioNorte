// app/club/historia/page.jsx
import Historia from "../../../components/club/historia/Historia";

export const metadata = {
  title: "Historia | Club Atlético Barrio Norte",
  description: "Desde 1950 forjando pasión en Gualeguay. Repasá nuestras eras doradas, hitos y el camino de nuestra institución.",
};

export default function HistoriaPage() {
  return (
    <div className="flex flex-col flex-1 bg-neutral-950">
      {/* CONTENIDO PRINCIPAL (LÍNEA DE TIEMPO, ETC.) */}
      <section className="flex-1">
        <Historia />
      </section>
    </div>
  );
}
