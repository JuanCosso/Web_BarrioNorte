// app/club/museo/page.jsx
import MuseoClient from "../../../components/club/museo/MuseoClient";

export const metadata = {
  title: "Museo Online | Club Atlético Barrio Norte",
  description: "Escudos históricos, hitos y camisetas oficiales del CABN a lo largo de las décadas.",
};

export default function MuseoPage() {
  return (
    <main className="w-full bg-gray-50 text-gray-900 flex-1">
      <MuseoClient />
    </main>
  );
}
