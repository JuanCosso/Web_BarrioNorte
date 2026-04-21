// components/inicio/ListaNoticias.jsx
import Image from "next/image";
import Link from "next/link";
import { noticias } from "../../data/noticias";

const CANTIDAD_INICIO = 4;

function formatearFecha(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`; // DD/MM/AAAA
}

// Ordena para que:
// 1) Las destacadas aparezcan primero
// 2) Dentro de destacadas y no destacadas, por fecha descendente
function ordenarNoticias(lista) {
  return [...lista].sort((a, b) => {
    if (a.destacada && !b.destacada) return -1;
    if (!a.destacada && b.destacada) return 1;

    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return fechaB - fechaA;
  });
}

// Devuelve las N noticias aplicando la regla de destacada que "pisa" a la más antigua
function obtenerUltimasNoticias(lista, cantidad = CANTIDAD_INICIO) {
  const ordenadas = ordenarNoticias(lista);
  return ordenadas.slice(0, cantidad);
}

export default function ListaNoticias() {
  const ultimasNoticias = obtenerUltimasNoticias(noticias, CANTIDAD_INICIO);

  if (ultimasNoticias.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        Próximamente vas a encontrar acá las novedades del club.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {ultimasNoticias.map((noticia) => {
        const fecha = formatearFecha(noticia.fecha);

        return (
          <article
            key={noticia.id}
            className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
          >
            {/* Imagen pequeña */}
            <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg md:h-24 md:w-32">
              {noticia.imagen && noticia.imagen.startsWith("/") ? (
                // Imagen local → usa next/image optimizado
                <Image
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  fill
                  className="object-cover"
                />
              ) : noticia.imagen ? (
                // Imagen externa (Instagram, etc.) → img estándar sin restricciones
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            {/* Contenido */}
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
                {noticia.categoria && (
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

              <h3 className="line-clamp-2 text-sm md:text-base font-semibold text-gray-900">
                {noticia.titulo}
              </h3>

              {(fecha || noticia.fuente) && (
                <p className="text-[11px] text-gray-500">
                  {fecha && <span>{fecha}</span>}
                  {fecha && noticia.fuente && " · "}
                  {noticia.fuente && <span>{noticia.fuente}</span>}
                </p>
              )}

              {noticia.resumen && (
                <p className="line-clamp-2 text-xs md:text-sm text-gray-700">
                  {noticia.resumen}
                </p>
              )}

              <div className="mt-1">
                <a
                  href={noticia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Leer más
                  <span className="ml-1 text-sm leading-none">↗</span>
                </a>
              </div>
            </div>
          </article>
        );
      })}

      {/* Link a la sección completa de noticias */}
      <div className="flex justify-end pt-1">
        <Link
          href="/noticias"
          className="text-sm font-semibold text-red-600 hover:text-red-700"
        >
          Ver todas las noticias →
        </Link>
      </div>
    </div>
  );
}
