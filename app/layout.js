// app/layout.js
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Club Atlético Barrio Norte",
  description: "Sitio oficial del CABN - Gualeguay",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-poppins bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased"
      >
        {/* Navbar arriba */}
        <Navbar />

        {/* Contenido de la página */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Footer abajo */}
        <Footer />
      </body>
    </html>
  );
}
