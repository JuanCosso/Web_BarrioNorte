"use client";

import Image from "next/image";
import { useMemo } from "react";

/* ========= CONSTANTS ========= */

export const BRAND_RED = "#bc1717";
export const CLUB_NAME = "Barrio Norte";
export const DISCIPLINE_LOGO_SRC = "/logos/futbol.png";

/* ========= ICONS (inline) ========= */

export function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .02 5.38.02 12c0 2.12.55 4.19 1.6 6.02L0 24l6.17-1.6A11.96 11.96 0 0 0 12.02 24C18.64 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.02 22a9.98 9.98 0 0 1-5.1-1.4l-.37-.22-3.67.95.98-3.58-.24-.37A10.01 10.01 0 0 1 2.02 12C2.02 6.49 6.5 2 12.02 2c2.67 0 5.18 1.04 7.07 2.93A9.92 9.92 0 0 1 22.02 12c0 5.51-4.49 10-10 10Zm5.79-7.52c-.31-.16-1.82-.9-2.1-1-.28-.1-.48-.16-.68.16-.2.31-.78 1-.96 1.2-.18.2-.35.23-.66.08-.31-.16-1.29-.47-2.46-1.5-.91-.81-1.52-1.8-1.7-2.1-.18-.31-.02-.47.14-.63.14-.14.31-.35.47-.53.16-.18.2-.31.31-.51.1-.2.06-.39-.02-.55-.08-.16-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.51.08-.78.39-.27.31-1.02 1-1.02 2.44 0 1.43 1.04 2.81 1.18 3 .14.2 2.05 3.14 4.97 4.4.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.82-.74 2.08-1.45.25-.71.25-1.31.18-1.45-.08-.14-.28-.23-.58-.39Z"
      />
    </svg>
  );
}

export function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path
        d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17.5 6.6h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4H15.8c-1.2 0-1.6.7-1.6 1.5V12H17l-.5 3h-2.3v7A10 10 0 0022 12z"
      />
    </svg>
  );
}


export function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2 20 6v7c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V6l8-4Zm0 4.1L6 8.3V13c0 3.9 2.5 7.5 6 8.9 3.5-1.4 6-5 6-8.9V8.3l-6-2.2Z"
      />
    </svg>
  );
}

export function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path
        d="M7 3v3M17 3v3M4.5 8.5h15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 12h4M8 16h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export function IconScore(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path
        d="M7 7h10M7 17h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 7v10M17 7v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M10 10h4v4h-4z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
    </svg>
  );
}

export function IconTrophy(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path
        d="M16 20c0-2.2-1.8-4-4-4s-4 1.8-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 20c0-1.7-1.1-3.1-2.7-3.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M17.5 6.6a2.5 2.5 0 0 1 0 4.8"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ========= UI PRIMITIVES ========= */

export function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 whitespace-nowrap">
      {children}
    </span>
  );
}

export function ButtonLink({ href, children, variant = "primary", icon: Icon }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20";
  const styles =
    variant === "primary"
      ? "bg-[color:var(--brand)] text-white hover:brightness-110"
      : "ring-1 ring-inset ring-white/12 bg-white/5 text-white hover:bg-white/10";

  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`}>
      {Icon ? <Icon className="h-5 w-5 shrink-0" /> : null}
      {children}
    </a>
  );
}

export function SegTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        active
          ? "bg-white/12 ring-1 ring-inset ring-white/15 text-white"
          : "bg-white/5 ring-1 ring-inset ring-white/10 text-white/80 hover:bg-white/8",
      ].join(" ")}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="font-semibold">{title}</div>
      {hint ? <div className="mt-1 text-sm text-white/70">{hint}</div> : null}
    </div>
  );
}

/* ========= RENDER HELPERS ========= */

export function MatchesList({ items, kind }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        title={kind === "next" ? "No hay próximos partidos cargados." : "No hay resultados cargados."}
        hint="Cuando los agregues, se van a mostrar automáticamente en este bloque."
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((m, idx) => (
        <div
          key={`${m.date}-${m.rival}-${idx}`}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm text-white/70">
                {m.competition ? <span className="mr-2">{m.competition}</span> : null}
                <span className="text-white/60">•</span>{" "}
                <span className="ml-2">
                  {m.date}
                  {m.time ? ` — ${m.time}` : ""}
                </span>
              </div>

              <div className="mt-1 text-base font-extrabold tracking-tight">
                {CLUB_NAME} <span className="text-white/60">vs</span> {m.rival}
              </div>

              <div className="mt-1 text-sm text-white/75">
                {m.condition ? <span className="mr-2">{m.condition}</span> : null}
                {m.venue ? <span className="text-white/60">•</span> : null}
                {m.venue ? <span className="ml-2">{m.venue}</span> : null}
              </div>
            </div>

            {kind === "last" ? (
              <div className="shrink-0">
                <span className="inline-flex items-center rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-extrabold">
                  {m.score}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StandingsTable({ data }) {
  if (!data || !data.rows || data.rows.length === 0) {
    return (
      <EmptyState
        title="No hay tabla de posiciones cargada."
        hint="Cuando la completes, acá se verá ordenada y con Barrio Norte resaltado."
      />
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
        <div className="font-extrabold">Tabla de posiciones</div>
        <div className="text-xs text-white/60">{data.updatedAt}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-black/25 text-white/70">
            <tr>
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Equipo</th>
              <th className="text-right px-4 py-3">PTS</th>
              <th className="text-right px-4 py-3">PJ</th>
              <th className="text-right px-4 py-3">G</th>
              <th className="text-right px-4 py-3">E</th>
              <th className="text-right px-4 py-3">P</th>
              <th className="text-right px-4 py-3">GF</th>
              <th className="text-right px-4 py-3">GC</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => {
              const isUs = (r.team || "").toLowerCase().includes(CLUB_NAME.toLowerCase());
              return (
                <tr
                  key={`${r.pos}-${r.team}`}
                  className={[
                    "border-t border-white/10",
                    isUs ? "bg-[color:var(--brand)]/12" : "hover:bg-white/5",
                  ].join(" ")}
                >
                  <td className="px-4 py-3 font-semibold">{r.pos}</td>
                  <td className="px-4 py-3 font-semibold">
                    <span className={isUs ? "text-white" : "text-white/90"}>{r.team}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-extrabold">{r.pts}</td>
                  <td className="px-4 py-3 text-right text-white/80">{r.pj}</td>
                  <td className="px-4 py-3 text-right text-white/80">{r.g}</td>
                  <td className="px-4 py-3 text-right text-white/80">{r.e}</td>
                  <td className="px-4 py-3 text-right text-white/80">{r.p}</td>
                  <td className="px-4 py-3 text-right text-white/80">{r.gf}</td>
                  <td className="px-4 py-3 text-right text-white/80">{r.gc}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TitlesList({ items }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="No hay títulos cargados."
        hint="Agregá temporadas/años y los mostramos con un layout limpio."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((t) => (
        <div
          key={`${t.title}-${t.year}`}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3"
        >
          <IconTrophy className="h-6 w-6 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="font-extrabold leading-tight">{t.title}</div>
            <div className="text-sm text-white/70">{t.year}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PeopleGrid({ title, items }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        title={`No hay ${title.toLowerCase()} cargado.`}
        hint="Cuando lo completes, se verá en tarjetas."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((p) => (
        <div
          key={`${p.name}-${p.role}`}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="font-extrabold">{p.name}</div>
          <div className="text-sm text-white/70">{p.role}</div>
        </div>
      ))}
    </div>
  );
}

/* ========= LAYOUT COMPARTIDO (solo estructura visual) =========
   Importante: NO contiene datos de ninguna rama.
*/

export function FutbolLayout({
  hero,
  nav,
  active,
  onChange,
  contact,
  quickFacts,
  subnav = null,
  children,
}) {
  const facts = useMemo(() => quickFacts || [], [quickFacts]);
  const hidePills = Boolean(hero?.hidePills);
  const hideTagline = Boolean(hero?.hideTagline);

  const pills = Array.isArray(hero?.pills) ? hero.pills : [];
  // Si se ocultan y no hay pills, dejo 1 placeholder para conservar altura mínima.
  const pillsForLayout = pills.length ? pills : hidePills ? ["\u00A0"] : [];

  // Si se oculta y no hay tagline, dejo un placeholder para conservar altura.
  const taglineForLayout =
    hero?.tagline && String(hero.tagline).trim() ? hero.tagline : hideTagline ? "\u00A0" : "";


  return (
    <div style={{ "--brand": BRAND_RED }} className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      {/* HERO (se mantiene oscuro) */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src={hero.imageSrc}
            alt={`${hero.title} ${hero.subtitle}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-neutral-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(188,23,23,0.25),transparent_45%)]" />
        </div>

        <div className="relative container mx-auto px-4 pt-16 pb-10 sm:pt-20 sm:pb-14">
          <div className="max-w-4xl">
            <div className={`flex flex-wrap gap-2 ${hidePills ? "invisible" : ""}`}>
              {pillsForLayout.map((p, i) => (
                <Pill key={`${p}-${i}`}>{p}</Pill>
              ))}
            </div>


            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {hero.title}
              <span className="block text-white/85 text-xl sm:text-2xl font-semibold mt-2">
                {hero.subtitle}
              </span>
            </h1>

            {taglineForLayout ? (
              <p className={`mt-4 text-white/80 leading-relaxed ${hideTagline ? "invisible" : ""}`}>
                {taglineForLayout}
              </p>
            ) : null}


            {/* NAV PRINCIPAL */}
            <div className="mt-6">
              <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                {nav.map((t) => (
                  <SegTab key={t.id} active={active === t.id} onClick={() => onChange(t.id)}>
                    {t.label}
                  </SegTab>
                ))}
              </div>
            </div>

            {/* CONTACTO */}
            {contact ? (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <ButtonLink href={contact.whatsappHref} icon={IconWhatsApp}>
                  {contact.whatsappLabel}
                </ButtonLink>

                <ButtonLink href={contact.instagramHref} variant="secondary" icon={IconInstagram}>
                  {contact.instagramLabel}
                </ButtonLink>

                {contact.facebookHref ? (
                  <ButtonLink href={contact.facebookHref} variant="secondary" icon={IconFacebook}>
                    {contact.facebookLabel || "Facebook"}
                  </ButtonLink>
                ) : null}
              </div>
            ) : null}

            {/* QUICK FACTS */}
            {facts.length ? (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {facts.map((q) => {
                  const QIcon = q.icon;
                  return (
                    <div
                      key={`${q.label}-${q.value}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-2 text-white/80">
                        <QIcon className="h-5 w-5 shrink-0" />
                        <span className="text-sm">{q.label}</span>
                      </div>
                      <div className="mt-2 font-semibold text-white">{q.value}</div>
                      <div className="text-sm text-white/70">{q.hint}</div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* SUBNAV */}
            {subnav ? <div className="mt-5">{subnav}</div> : null}
          </div>
        </div>
      </section>

      {/* CONTENIDO: fondo claro, sin “remanente negro” */}
      <main className="bg-gray-50">
        {/* Mantengo el container para que lo “normal” quede alineado.
            Tus secciones w-screen ya rompen el container correctamente. */}
        <div className="container mx-auto px-4">{children}</div>
      </main>
    </div>
  );
}


export function OrgCard({ title, description, youthLabel }) {
  return (
    <section className="mt-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
          <div className="w-full">
            <h2 className="text-2xl sm:text-3xl font-extrabold">{title}</h2>
            <p className="mt-4 text-white/80 leading-relaxed">{description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill>Actualizable</Pill>
              <Pill>Datos por rama</Pill>
              {youthLabel ? <Pill>{youthLabel}</Pill> : <Pill>Primera</Pill>}
            </div>
          </div>

          <div className="w-full flex justify-center md:justify-end">
            <Image
              src={DISCIPLINE_LOGO_SRC}
              alt="Logo/escudo de Fútbol"
              width={320}
              height={320}
              className="h-36 w-36 sm:h-44 sm:w-44 md:h-56 md:w-56 object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
