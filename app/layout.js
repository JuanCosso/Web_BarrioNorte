// app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Configuración de la fuente Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], // Importamos todos los pesos necesarios
  style: ["normal", "italic"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Club Atlético Barrio Norte",
  description: "Sitio oficial del CABN - Gualeguay",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${poppins.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        {/* Navbar arriba */}
        <Navbar />

        {/* Contenido de la página */}
        {/* pt-24 sirve si en algún momento dejas el Navbar como fixed con h-24.
            Si no lo usás fijo, podés quitar el pt-24 sin drama. */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer abajo */}
        <Footer />
      </body>
    </html>
  );
}
