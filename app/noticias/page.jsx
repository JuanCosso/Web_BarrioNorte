// app/noticias/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { noticias as noticiasData } from "../../data/noticias";

const ITEMS_INICIALES = 8;
const ITEMS_POR_CARGA = 8;

const CATEGORIA_TODAS = "Todas";

// --- Helpers ---

function obtenerCategorias(noticias) {
  const set = new Set();
  noticias.forEach((nota) => {
    if (nota.categoria) set.add(nota.categoria);
  });
  return Array.from(set);
}

function ordenarNoticias(lista) {
  return [...lista].sort((a, b) => {
    if (a.destacada && !b.destacada) return -1;
    if (!a.destacada && b.destacada) return 1;
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });
}

function formatearFecha(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

// --- Página principal ---

export default function NoticiasPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(CATEGORIA_TODAS);
  const [cantidadVisible, setCantidadVisible] = useState(ITEMS_INICIALES);

  const categorias = obtenerCategorias(noticiasData);
  const noticiasOrdenadas = ordenarNoticias(noticiasData);

  const handleBusquedaChange = (valor) => {
    setBusqueda(valor);
    setCantidadVisible(ITEMS_INICIALES);
  };

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setCantidadVisible(ITEMS_INICIALES);
  };

  const texto = busqueda.trim().toLowerCase();

  const noticiasFiltradas = noticiasOrdenadas.filter((noticia) => {
    if (categoriaSeleccionada !== CATEGORIA_TODAS && noticia.categoria !== categoriaSeleccionada) {
      return false;
    }
    if (texto) {
      const titulo = noticia.titulo.toLowerCase();
      const resumen = (noticia.resumen || "").toLowerCase();
      const fuente = (noticia.fuente || "").toLowerCase();
      if (!titulo.includes(texto) && !resumen.includes(texto) && !fuente.includes(texto)) {
        return false;
      }
    }
    return true;
  });

  const noticiasVisibles = noticiasFiltradas.slice(0, cantidadVisible);
  const puedeCargarMas = cantidadVisible < noticiasFiltradas.length;

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-800 font-semibold text-center mb-3">
            Noticias en medios
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 text-center">
            La{" "}
            {/* Encabezado de sección: se mantiene #BC1717 */}
            <span className="text-[#BC1717] italic">actualidad</span>
            <span className="text-neutral-900"> del club</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto w-full px-4 py-8 md:px-6 lg:px-8">
        <NewsFilters
          busqueda={busqueda}
          onBusquedaChange={handleBusquedaChange}
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={handleCategoriaChange}
          categorias={categorias}
        />

        <section className="mt-8">
          {noticiasVisibles.length === 0 ? (
            <p className="text-sm text-neutral-600">
              No se encontraron noticias con los filtros actuales.
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {noticiasVisibles.map((noticia) => (
                  <NewsCard key={noticia.id} noticia={noticia} />
                ))}
              </div>

              {puedeCargarMas && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setCantidadVisible((prev) => prev + ITEMS_POR_CARGA)}
                    // Contenido: red-600 base → red-700 hover
                    className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-red-700"
                  >
                    Cargar más noticias
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

// --- Filtros / buscador ---

function NewsFilters({ busqueda, onBusquedaChange, categoriaSeleccionada, onCategoriaChange, categorias }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-neutral-50 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Buscador */}
      <div className="w-full md:max-w-sm">
        <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Buscar
        </label>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar por título, resumen o medio..."
          // Contenido: red-600 base → red-700 hover (en focus ring y border)
          className="mt-1 w-full rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30"
        />
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Categorías:
        </span>
        <button
          type="button"
          onClick={() => onCategoriaChange(CATEGORIA_TODAS)}
          // Contenido: activo → red-600; hover borde → red-600/50
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            categoriaSeleccionada === CATEGORIA_TODAS
              ? "border-red-600 bg-red-600 text-white"
              : "border-neutral-300 bg-white text-neutral-700 hover:border-red-600/50"
          }`}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoriaChange(cat)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              categoriaSeleccionada === cat
                ? "border-red-600 bg-red-600 text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-red-600/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}

// --- Tarjeta individual ---

function NewsCard({ noticia }) {
  const fecha = formatearFecha(noticia.fecha);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Imagen */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={noticia.imagen}
          alt={noticia.titulo}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
          {noticia.categoria && (
            // Contenido: red-600
            <span className="rounded-full bg-red-600 px-2 py-0.5 uppercase tracking-wide text-white">
              {noticia.categoria}
            </span>
          )}
          {noticia.destacada && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
              Destacada ⭐
            </span>
          )}
        </div>

        {/* Título */}
        <h2 className="line-clamp-2 text-base font-semibold text-neutral-900">
          {noticia.titulo}
        </h2>

        {/* Fecha + fuente */}
        {(fecha || noticia.fuente) && (
          <p className="text-xs text-neutral-500">
            {fecha && <span>{fecha}</span>}
            {fecha && noticia.fuente && " · "}
            {noticia.fuente && <span>{noticia.fuente}</span>}
          </p>
        )}

        {/* Resumen */}
        {noticia.resumen && (
          <p className="line-clamp-3 text-sm text-neutral-700">{noticia.resumen}</p>
        )}

        <div className="flex-1" />

        {/* Tags + Leer más */}
        <div className="flex flex-col gap-2">
          {noticia.tags && noticia.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {noticia.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={noticia.url}
            target="_blank"
            rel="noopener noreferrer"
            // Contenido: red-600 base → red-700 hover
            className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Leer más
            <span className="ml-1 text-base leading-none">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}