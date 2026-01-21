"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Noticias", href: "/noticias" },
  {
    name: "Club",
    href: "/club",
    submenu: [
      { name: "Historia", href: "/club/historia" },
      { name: "Estadio", href: "/club/estadio" },
      { name: "Museo Online", href: "/club/museo" },
    ],
  },
  {
    name: "Socios",
    href: "/socios",
    submenu: [
      { name: "Montos 2026", href: "/socios/montos" },
      { name: "Directivos", href: "/socios/directivos" },
    ],
  },
  {
    name: "Disciplinas",
    href: "/disciplinas",
    submenu: [
      { name: "Fútbol", href: "/disciplinas/futbol" },
      { name: "Tenis", href: "/disciplinas/tenis" },
      { name: "Gimnasia", href: "/disciplinas/gimnasia" },
      { name: "Billar", href: "/disciplinas/billar" },
      { name: "Bochas", href: "/disciplinas/bochas" },
      { name: "Ciclismo", href: "/disciplinas/ciclismo" },
    ],
  },
  {
    name: "Tienda",
    href: "/tienda",
    submenu: [
      { name: "Online", href: "/tienda/catalogo" },
      { name: "Planeta Fútbol", href: "/tienda/planetafutbol" },
    ],
  },
  {
    name: "Samba Verá",
    href: "/samba-vera",
    submenu: [
      { name: "Carnaval 2026", href: "/samba-vera/comparsa" },
      { name: "Alto Kandombe", href: "/samba-vera/alto-kandombe" },
      { name: "Katombe", href: "/samba-vera/katombe" },
    ],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const pathname = usePathname();

  const toggleSubmenu = (index) => {
    setActiveSubmenu((prev) => (prev === index ? null : index));
  };

  const isItemActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // BLOQUEO DE SCROLL DEL BODY CUANDO EL MENÚ MÓVIL ESTÁ ABIERTO (evita que se mueva el fondo)
  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const scrollY = window.scrollY;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <nav className="bg-[#B71C1C] text-white shadow-2xl relative z-50 h-24">
      {/* Textura */}
      <div
        className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url(/fondos/fondo_campeon2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(100%) contrast(120%)",
        }}
      />

      {/* Contenido */}
      <div className="container mx-auto px-4 h-full relative z-50">
        <div className="flex justify-between items-center h-full">
          {/* Izquierda */}
          <div className="flex items-center h-full">
            <div className="absolute top-0 left-4 z-50 pt-2 filter drop-shadow-lg">
              <Link
                href="/"
                className="group relative block w-28 h-32 md:w-36 md:h-36 transition-transform hover:scale-105"
              >
                <Image
                  src="/escudos/BarrioNorte_V3.png"
                  alt="Escudo Barrio Norte"
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </Link>
            </div>

            <div className="flex flex-col justify-center ml-28 sm:ml-32 md:ml-36 h-full z-10 pl-2 md:pl-4 transition-all">
              <span className="text-white/90 text-base sm:text-lg md:text-xl font-normal leading-none mb-1 drop-shadow-sm transition-all">
                Cada vez
              </span>
              <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-none tracking-tight drop-shadow-md transition-all">
                MÁS GRANDE
              </span>
            </div>
          </div>

          {/* Escritorio */}
          <div className="hidden xl:flex flex-1 items-center justify-end space-x-1">
            {navigation.map((item) => {
              const isActive = isItemActive(item.href);
              const linkHref = item.submenu ? item.submenu[0].href : item.href;

              return (
                <div key={item.name} className="relative group h-full flex items-center">
                  <Link
                    href={linkHref}
                    className={`
                      px-3 py-2 text-sm font-bold uppercase tracking-wide flex items-center gap-1 transition-all duration-200 rounded-md
                      ${isActive ? "bg-white text-[#B71C1C]" : "text-white hover:bg-red-800 hover:text-white"}
                    `}
                  >
                    {item.name}
                    {item.submenu && (
                      <span className="text-[10px] opacity-70 group-hover:rotate-180 transition-transform duration-300">
                        ▼
                      </span>
                    )}
                  </Link>

                  {item.submenu && (
                    <div className="absolute left-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top">
                      <div className="w-42 bg-white text-gray-800 shadow-2xl rounded-md overflow-hidden">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-3 text-sm font-bold uppercase hover:bg-gray-100 hover:text-[#B71C1C] hover:pl-6 transition-all border-b border-gray-100 last:border-0"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botón hamburguesa */}
          <div className="xl:hidden flex items-center z-50">
            <button
              onClick={() => {
                setIsOpen((v) => !v);
                if (isOpen) setActiveSubmenu(null);
              }}
              className="text-white p-2 hover:bg-red-900 rounded-lg focus:outline-none border-2 border-white/20 transition-colors"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`
          xl:hidden fixed top-24 left-0 w-full bg-[#B71C1C] shadow-2xl border-t border-white/10
          overflow-y-auto overscroll-contain
          transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[calc(100dvh-6rem)] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
        style={{ zIndex: 40 }}
      >
        <div className="flex flex-col pb-8 pt-12 relative z-10">
          {navigation.map((item, index) => {
            const hasSubmenu = !!item.submenu;

            return (
              <div key={item.name} className="border-b border-white/10 last:border-0">
                <div
                  className={`flex justify-between items-center transition-colors ${
                    activeSubmenu === index ? "bg-red-900/40" : ""
                  }`}
                >
                  {/* CLAVE: si tiene submenu, NO navega; despliega */}
                  {hasSubmenu ? (
                    <button
                      type="button"
                      className="flex-grow px-6 py-4 text-left text-base font-bold uppercase tracking-wider text-white hover:text-gray-200"
                      onClick={() => toggleSubmenu(index)}
                      aria-expanded={activeSubmenu === index}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex-grow px-6 py-4 text-base font-bold uppercase tracking-wider text-white hover:text-gray-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}

                  {hasSubmenu && (
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(index)}
                      className="px-6 py-4 text-white hover:bg-red-900/50 transition-colors focus:outline-none h-full border-l border-white/5"
                      aria-label={activeSubmenu === index ? `Contraer ${item.name}` : `Expandir ${item.name}`}
                    >
                      <span
                        className={`block transform transition-transform duration-300 ${
                          activeSubmenu === index ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                  )}
                </div>

                <div
                  className={`
                    bg-[#8e1616] overflow-hidden transition-all duration-300 ease-in-out
                    ${activeSubmenu === index ? "max-h-96 py-2" : "max-h-0 py-0"}
                  `}
                >
                  {item.submenu?.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-8 py-3 text-sm text-gray-200 hover:text-white hover:bg-red-900/80 hover:pl-10 transition-all font-medium border-l-4 border-transparent hover:border-white/50"
                      onClick={() => setIsOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="p-6 text-center opacity-60">
            <span className="text-white text-xs uppercase tracking-widest">Club Atlético Barrio Norte</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
