// app/club/museo/page.jsx
import MuseoClient from "../../../components/club/museo/MuseoClient";

export const metadata = {
  title: "Museo | Club Atlético Barrio Norte",
  description: "Escudos históricos y camisetas a lo largo de los años.",
};

export default function MuseoPage() {
  return (
    <main className="w-full bg-neutral-950 text-white">
      <MuseoClient />
    </main>
  );
}
