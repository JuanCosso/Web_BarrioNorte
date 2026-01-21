import Image from "next/image";
import Link from "next/link";
import { BRAND_RED, STORE, HOURS, HIGHLIGHTS, GALLERY } from "./planetafutbol.data";

function buildWhatsAppHref() {
  const msg = STORE.whatsappDefaultMsg;
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.28em] text-neutral-500">
        {title}
      </p>
      <div className="mt-3 text-sm text-neutral-800">{children}</div>
    </div>
  );
}

export default function PlanetaFutbol() {
  const waHref = buildWhatsAppHref();

  return (
    <div className="w-full">
      {/* HEADER: tu estilo */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-800 font-semibold text-center mb-3">
            TUS PRENDAS DE FÚTBOL
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 text-center">
            Comprá la indumentaria en{" "}
            <span className="italic" style={{ color: BRAND_RED }}>
              Planeta
            </span>{" "}
            <span className="italic" style={{ color: BRAND_RED }}>
              Fútbol
            </span>
          </h1>

        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.28em] text-neutral-500">
              PUNTO OFICIAL DE COMPRA
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-neutral-900">
              Barrio Norte, más cerca
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              En {STORE.name} podés conseguir indumentaria y artículos de fútbol del club.
              Si querés, consultás por WhatsApp, te confirmamos disponibilidad y coordinás el retiro.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold text-white transition hover:opacity-95"
                style={{ backgroundColor: BRAND_RED }}
              >
                Consultar por WhatsApp
              </a>

              <a
                href={STORE.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-extrabold text-neutral-900 hover:bg-neutral-50"
              >
                Cómo llegar
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
                Atención personalizada
              </span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
                Retiro en local
              </span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
                Indumentaria del club
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm font-extrabold text-neutral-900">Dirección</p>
              <p className="mt-1 text-sm text-neutral-700">
                {STORE.addressLine1}
                <br />
                {STORE.addressLine2}
              </p>
            </div>

            <div className="mt-5">
              <Link
                href="/tienda/catalogo"
                className="inline-flex items-center gap-2 text-sm font-extrabold"
                style={{ color: BRAND_RED }}
              >
                Ver catálogo online (referencial) <span className="transition hover:translate-x-1">→</span>
              </Link>
              <p className="mt-2 text-xs text-neutral-500">
                El catálogo es para consultar. La compra/entrega se coordina por WhatsApp.
              </p>
            </div>
          </div>

          {/* Galería */}
          <div className="grid grid-cols-2 gap-3">
            {GALLERY.map((img) => (
              <div
                key={img.src}
                className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm"
              >
                <div className="relative h-40 sm:h-52 lg:h-48 xl:h-56">
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
      </section>

      {/* CARDS INFO */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <InfoCard title="HORARIOS">
            <ul className="space-y-2">
              {HOURS.map((h) => (
                <li key={h.day} className="flex items-start justify-between gap-3">
                  <span className="font-bold text-neutral-900">{h.day}</span>
                  <span className="text-neutral-700">{h.hours}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="QUÉ ENCONTRÁS">
            <ul className="space-y-3">
              {HIGHLIGHTS.map((x) => (
                <li key={x.title}>
                  <p className="font-extrabold text-neutral-900">{x.title}</p>
                  <p className="mt-1 text-sm text-neutral-700">{x.description}</p>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="CONTACTO RÁPIDO">
            <p className="text-sm text-neutral-700">
              Consultá por stock/talles y coordiná el retiro:
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold text-white transition hover:opacity-95"
                style={{ backgroundColor: BRAND_RED }}
              >
                WhatsApp
              </a>

              {STORE.instagramUrl ? (
                <a
                  href={STORE.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-extrabold text-neutral-900 hover:bg-neutral-50"
                >
                  Instagram
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                  (Opcional) Agregá el Instagram en <code className="font-semibold">planetafutbol.data.js</code>
                </div>
              )}
            </div>
          </InfoCard>
        </div>
      </section>

      {/* MAPA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-10">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.28em] text-neutral-500">
              UBICACIÓN
            </p>
            <h3 className="mt-2 text-xl font-extrabold text-neutral-900">
              Encontranos en {STORE.city}
            </h3>
            <p className="mt-2 text-sm text-neutral-700">
              Pegá el embed real de Google Maps en el archivo de datos para que el mapa se muestre aquí.
            </p>
          </div>

          {STORE.mapsEmbedUrl ? (
            <div className="relative w-full">
              <iframe
                src={STORE.mapsEmbedUrl}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Planeta Fútbol"
              />
            </div>
          ) : (
            <div className="p-6 bg-neutral-50 border-t border-neutral-200">
              <p className="text-sm text-neutral-700">
                Falta <code className="font-semibold">STORE.mapsEmbedUrl</code> en{" "}
                <code className="font-semibold">planetafutbol.data.js</code>.
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                Google Maps → Compartir → Insertar un mapa → copiá el src del iframe.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ (sin client, usando details) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 mb-14">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.28em] text-neutral-500">
            PREGUNTAS FRECUENTES
          </p>

          <div className="mt-4 space-y-3">
            {[
              {
                q: "¿Se puede reservar por WhatsApp?",
                a: "Sí. Consultás por el producto y talle, te confirmamos stock y coordinamos el retiro.",
              },
              {
                q: "¿El catálogo online es compra directa?",
                a: "No. Es referencial para ver opciones. La operación se coordina por WhatsApp y retiro en el local.",
              },
              {
                q: "¿Qué pasa si no hay stock de mi talle?",
                a: "Te avisamos alternativas disponibles o te tomamos consulta para próximas reposiciones.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-extrabold text-neutral-900">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-neutral-700">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold text-white transition hover:opacity-95"
              style={{ backgroundColor: BRAND_RED }}
            >
              Consultar ahora por WhatsApp
            </a>

            <a
              href={STORE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-extrabold text-neutral-900 hover:bg-neutral-50"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
