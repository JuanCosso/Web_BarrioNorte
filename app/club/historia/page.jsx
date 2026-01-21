// app/club/historia/page.jsx
import Historia from "../../../components/club/historia/Historia";

export default function HistoriaPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* CONTENIDO PRINCIPAL (LÍNEA DE TIEMPO, ETC.) */}
      <section className="flex-1">
        <Historia />
      </section>
    </main>
  );
}
