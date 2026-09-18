// app/socios/directivos/page.jsx
import Image from "next/image";

export const metadata = {
  title: "Comisión Directiva | Club Atlético Barrio Norte",
  description: "Autoridades del Club Atlético Barrio Norte. Período 2024-2026.",
};

const PRESIDENTE = {
  role: "Presidente",
  name: "Rubén A. Garibotti",
  imgSrc: "/directivos/garibotti.jpg",
  badge: "Máxima Autoridad",
};

const EJECUTIVOS = [
  { role: "Vicepresidente", name: "Pablo O. Denardi", imgSrc: "/directivos/denardi.jpg" },
  { role: "Secretario", name: "Alexis E. González", imgSrc: "/directivos/gonzalez.png" },
  { role: "Prosecretaria", name: "Maite M. Vecchio", imgSrc: "/directivos/maite vecchio.jpg" },
  { role: "Tesorero", name: "Cristian A. Mallarino", imgSrc: "/directivos/mallarino.png" },
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

const REVISORES = [
  "Edelmiro Fumaneri",
  "Natalia Di Lorenzi",
  "Alejandra Borro",
];

function initials(name) {
  const parts = String(name).trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
}

function ExecutiveCard({ role, name, imgSrc }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-red-200">
      <div className="flex items-center gap-4">
        {imgSrc ? (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 shadow-xs">
            <Image src={imgSrc} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-sm font-black text-[#B71C1C] flex-shrink-0 shadow-xs">
            {initials(name)}
          </div>
        )}
        <div className="min-w-0">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#B71C1C]">
            {role}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
            {name}
          </h3>
        </div>
      </div>
    </article>
  );
}

function CommitteeSection({ title, subtitle, items, cols = 2 }) {
  const gridColsClass = cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
      <div className="border-b border-gray-100 pb-3 mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <ul className={`grid gap-2.5 ${gridColsClass}`}>
        {items.map((person) => (
          <li
            key={person}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-800"
          >
            <span className="w-2 h-2 rounded-full bg-[#B71C1C] flex-shrink-0" />
            <span>{person}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DirectivosPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* HEADER INSTITUCIONAL */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-900 font-semibold mb-2">
            AUTORIDADES INSTITUCIONALES
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Comisión <span className="text-[#B71C1C] italic">Directiva</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 pt-8 sm:pt-10 space-y-10">
        {/* PRESIDENCIA DESTACADA */}
        <section>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-md border-2 border-red-100 flex-shrink-0 bg-gray-100">
                <Image
                  src={PRESIDENTE.imgSrc}
                  alt={PRESIDENTE.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                  {PRESIDENTE.role}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  {PRESIDENTE.name}
                </h2>
                <div className="pt-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Período 2024 — 2026
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MESA EJECUTIVA */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EJECUTIVOS.map((ej) => (
              <ExecutiveCard key={ej.role} role={ej.role} name={ej.name} imgSrc={ej.imgSrc} />
            ))}
          </div>
        </section>

        {/* VOCALES Y REVISORES */}
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <CommitteeSection
              title="Vocales Titulares"
              subtitle="Integrantes del órgano deliberativo"
              items={VOCALES_TITULARES}
            />
          </div>

          <div className="lg:col-span-6">
            <CommitteeSection
              title="Vocales Suplentes"
              subtitle="Colaboradores de la comisión"
              items={VOCALES_SUPLENTES}
            />
          </div>

          <div className="lg:col-span-12">
            <CommitteeSection
              title="Revisores de Cuentas"
              subtitle="Comisión fiscalizadora y control patrimonial"
              items={REVISORES}
              cols={3}
            />
          </div>
        </section>
      </div>
    </main>
  );
}