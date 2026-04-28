import Image from "next/image";
import { BRAND_RED, STORE, HOURS, GALLERY } from "./planetafutbol.data";

function buildWhatsAppHref() {
  const msg = STORE.whatsappDefaultMsg;
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

// ── Guía de talles ────────────────────────────────────────────────────────────

const TALLES_ADULTO = [
  { talle: "S",   pecho: "88–92",  cintura: "72–76" },
  { talle: "M",   pecho: "92–96",  cintura: "76–80" },
  { talle: "L",   pecho: "96–100", cintura: "80–84" },
  { talle: "XL",  pecho: "100–104",cintura: "84–88" },
  { talle: "XXL", pecho: "104–108",cintura: "88–92" },
];

const TALLES_INFANTIL = [
  { talle: "4",  altura: "104", edad: "~4 años" },
  { talle: "6",  altura: "116", edad: "~6 años" },
  { talle: "8",  altura: "128", edad: "~8 años" },
  { talle: "10", altura: "140", edad: "~10 años" },
  { talle: "12", altura: "152", edad: "~12 años" },
  { talle: "14", altura: "164", edad: "~14 años" },
];

// ── Componente principal ──────────────────────────────────────────────────────

export default function PlanetaFutbol() {
  const waHref = buildWhatsAppHref();

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header de sección */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-800 font-semibold text-center mb-3">
            TUS PRENDAS DE FÚTBOL
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 text-center">
            Comprá la indumentaria en{" "}
            {/* Encabezado: se mantiene #BC1717 */}
            <span className="italic" style={{ color: BRAND_RED }}>
              Planeta
            </span>{" "}
            <span className="italic" style={{ color: BRAND_RED }}>
              Fútbol
            </span>
          </h1>
        </div>
      </header>

      {/* Contenido */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">

        {/* ── Anuncio principal ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.28em] text-neutral-500 uppercase">
            Tienda física oficial
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-neutral-900">
            Barrio Norte, más cerca
          </h2>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed max-w-xl">
            En {STORE.name} podés conseguir toda la indumentaria y artículos oficiales del club.
            Consultá disponibilidad y talles por WhatsApp y coordiná el retiro en el local.
          </p>

          {/* Datos de contacto y ubicación */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {/* WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 hover:bg-neutral-100 transition group"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L.057 23.09a.75.75 0 0 0 .917.899l5.356-1.484A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.93 0-3.738-.52-5.29-1.43l-.38-.225-3.177.881.883-3.093-.247-.397A9.952 9.952 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">WhatsApp</p>
                <p className="text-sm font-extrabold text-neutral-900 truncate">
                  {/* Reemplazá con el número real formateado */}
                  +54 9 XXXX XXXXXX
                </p>
              </div>
            </a>

            {/* Dirección */}
            <a
              href={STORE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 hover:bg-neutral-100 transition"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Dirección</p>
                <p className="text-sm font-extrabold text-neutral-900 truncate">{STORE.addressLine1}</p>
                <p className="text-xs text-neutral-500">{STORE.addressLine2}</p>
              </div>
            </a>

            {/* Horarios */}
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Horarios</p>
                {HOURS.map((h) => (
                  <p key={h.day} className="text-xs text-neutral-700 leading-relaxed">
                    <span className="font-bold">{h.day}:</span> {h.hours}
                  </p>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── Galería de imágenes ───────────────────────────────────────────── */}
        {GALLERY.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-neutral-500 uppercase mb-3">
              Galería
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GALLERY.map((img) => (
                <div
                  key={img.src}
                  className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm"
                >
                  <div className="relative h-40 sm:h-48">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Guía de talles ────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.28em] text-neutral-500 uppercase">
            Referencia de talles
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Medidas orientativas. Ante dudas, consultá por WhatsApp antes de comprar.
          </p>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {/* Adultos */}
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 mb-3">Adultos</h3>
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">Talle</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">Pecho (cm)</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">Cintura (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {TALLES_ADULTO.map((row, i) => (
                      <tr key={row.talle} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center justify-center rounded-lg bg-red-600 px-2.5 py-0.5 text-xs font-extrabold text-white min-w-[2.25rem]">
                            {row.talle}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-neutral-700">{row.pecho}</td>
                        <td className="px-4 py-2.5 text-neutral-700">{row.cintura}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Infantil */}
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 mb-3">Infantil</h3>
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">Talle</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">Altura (cm)</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">Edad aprox.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {TALLES_INFANTIL.map((row, i) => (
                      <tr key={row.talle} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-2.5 py-0.5 text-xs font-extrabold text-white min-w-[2.25rem]">
                            {row.talle}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-neutral-700">{row.altura}</td>
                        <td className="px-4 py-2.5 text-neutral-500">{row.edad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}