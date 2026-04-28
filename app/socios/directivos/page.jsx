// app/socios/directivos/page.jsx
import Image from "next/image";

// BRAND_RED se mantiene SOLO para el encabezado de sección (#BC1717)
const BRAND_RED = "#BC1717";

const PRINCIPALES = [
  { role: "Presidente", name: "Rubén A. Garibotti", imgSrc: "/directivos/garibotti.jpg" },
  { role: "Vicepresidente", name: "Pablo O. Denardi" },
  { role: "Secretario", name: "Alexis E. González" },
  { role: "Prosecretaria", name: "Maite M. Vecchio" },
  { role: "Tesorero", name: "Cristian A. Mallarino" },
  { role: "Protesorero", name: "Lisandro R. Garibotti" },
];

const VOCALES_TITULARES = [
  "Sebastián H. Fernández",
  "Horacio Salvarreguy",
  "Fabián Magallán",
  "Juan P. Mancini",
];

const VOCALES_SUPLENTES = [
  "Mariano A. Vecchio",
  "Emiliano Ojeda",
  "Silvio H. Ponce",
  "Luciano H. Garibotti",
];

const REVISORES = ["Edelmiro Fumaneri", "Natalia Di Lorenzi", "Alejandra Borro"];

function initials(name) {
  const parts = String(name).trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
}

function PersonCard({ role, name, imgSrc }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            // Decorativo: tint rgba se mantiene
            <div
              className="h-full w-full grid place-items-center text-sm font-extrabold text-neutral-900"
              style={{ background: "rgba(188, 23, 23, 0.10)" }}
              aria-hidden="true"
            >
              {initials(name)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">
            {role}
          </p>
          <p className="mt-1 text-base sm:text-lg font-extrabold text-neutral-900 break-words">
            {name}
          </p>

          {/* Contenido: barra decorativa de acento → bg-red-600 */}
          <div className="mt-3 h-1 w-12 rounded-full bg-red-600" />
        </div>
      </div>

      {/* Decorativo: blur ambiente → rgba se mantiene */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl"
        style={{ background: "rgba(188, 23, 23, 0.08)" }}
        aria-hidden="true"
      />
    </article>
  );
}

function NamesBlock({ title, items }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
      <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
        {title}
      </h2>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((n) => (
          <li
            key={n}
            className="rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-800"
          >
            {n}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DirectivosPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-800 font-semibold text-center mb-3">
            AUTORIDADES DEL CLUB
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 text-center">
            Conocé a la{" "}
            {/* Encabezado de sección: se mantiene #BC1717 */}
            <span className="italic" style={{ color: BRAND_RED }}>
              Comisión
            </span>{" "}
            Directiva
          </h1>
        </div>
      </header>

      {/* Contenido */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Período 2024-26
          </h2>
          <p className="text-xs text-neutral-500">Club Atlético Barrio Norte</p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPALES.map((p) => (
            <PersonCard
              key={`${p.role}-${p.name}`}
              role={p.role}
              name={p.name}
              imgSrc={p.imgSrc}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <NamesBlock title="Vocales titulares" items={VOCALES_TITULARES} />
          </div>

          <div className="lg:col-span-6">
            <NamesBlock title="Vocales suplentes" items={VOCALES_SUPLENTES} />
          </div>

          <div className="lg:col-span-12">
            <NamesBlock title="Revisores de cuentas" items={REVISORES} />
          </div>
        </div>
      </section>
    </main>
  );
}