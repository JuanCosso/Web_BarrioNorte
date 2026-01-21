// components/disciplinas/futbol/infantiles/InfantilesUI.jsx
"use client";

import { useMemo } from "react";
import Image from "next/image";

/* ========= icon ========= */

function IconLocation(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ========= flyer (idéntico lenguaje que femenino / inferiores) ========= */

export function FlyerSumateInfantilesFull({ data, backgroundImageUrl }) {
  const d = data || {};

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-red-800/30 bg-black">
      {/* Fondo */}
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${backgroundImageUrl}')`,
            filter: "grayscale(100%) contrast(1.15) brightness(0.65)",
          }}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-black" />
      )}

      {/* Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/85" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.28),transparent_60%)] opacity-70" />

      {/* Contenido */}
      <div className="relative z-30 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6 py-3 sm:py-4">
          {/* Izquierda */}
          <div className="min-w-0 text-center md:text-left">
            <p className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.32em] text-red-500 uppercase">
              {d.kicker || "FÚTBOL INFANTILES"}
            </p>

            <p className="mt-1 font-black italic uppercase leading-none text-white drop-shadow-sm text-xl sm:text-2xl md:text-3xl">
              {d.title || "Sumate a Barrio Norte"}
            </p>

            {(d.subtitle || d.description) ? (
              <p className="mt-1.5 text-xs sm:text-sm md:text-base text-white/85 leading-snug">
                {d.subtitle || d.description}
              </p>
            ) : null}

            {d.secondary ? <p className="mt-1 text-[11px] sm:text-xs text-white/70">{d.secondary}</p> : null}
          </div>

          {/* Centro (escudo) */}
          <div className="flex items-center justify-center">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
              <Image
                src={d.centerImageSrc || "/escudos/BarrioNorte_V1.png"}
                alt={d.centerImageAlt || "Barrio Norte"}
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                priority
              />
            </div>
          </div>

          {/* Derecha */}
          <div className="min-w-0 flex flex-col items-center md:items-end gap-2">
            {(d.locationValue || d.location) ? (
              <div className="flex items-center gap-2 text-white/90">
                <IconLocation className="h-4 w-4 text-white/85" />
                <span className="text-xs sm:text-sm font-semibold text-center md:text-right line-clamp-2 max-w-[520px]">
                  {d.locationValue || d.location}
                </span>
              </div>
            ) : null}

            <div className="text-center md:text-right">
              <p className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.28em] text-red-500 uppercase">
                {d.scheduleLabel || "Entrenamientos"}
              </p>
              <p className="mt-0.5 font-black italic text-xl sm:text-2xl text-white drop-shadow-sm tracking-tight">
                {d.scheduleValue || "Consultá los horarios"}
              </p>
            </div>

            {d.ctaHref ? (
              <a
                href={d.ctaHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3.5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {d.ctaLabel || "Quiero sumarme"}
              </a>
            ) : null}

            {d.note ? <p className="text-[11px] text-white/70 text-center md:text-right max-w-[520px]">{d.note}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TablaPosicionesInfantilesLike({
  title,
  phase,
  equipos,
  footnote,
  withPositionColors = true,
}) {
  const clasePosicionInf = (pos) => (pos <= 4 ? "text-green-600 font-semibold" : "");

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-gray-800">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <span className="text-xs text-gray-500">{phase}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-2 text-center">#</th>
              <th className="py-2 pr-2 text-left">Equipo</th>
              <th className="py-2 px-1 text-center">PJ</th>
              <th className="py-2 px-1 text-center">G</th>
              <th className="py-2 px-1 text-center">E</th>
              <th className="py-2 px-1 text-center">P</th>
              <th className="py-2 px-1 text-center">DG</th>
              <th className="py-2 pl-1 text-center">PTS</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {(equipos || []).map((equipo, index) => {
              const posicion = index + 1;
              const esBarrioNorte = equipo.slug === "barrio-norte";

              return (
                <tr
                  key={equipo.slug || `${equipo.name || "equipo"}-${index}`}
                  className={`border-b last:border-0 ${
                    esBarrioNorte ? "bg-red-50 font-semibold" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-1 px-2 text-center">
                    {withPositionColors ? (
                      <span className={clasePosicionInf(posicion)}>{posicion}</span>
                    ) : (
                      posicion
                    )}
                  </td>

                  <td className="py-1 pr-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Image
                        src={equipo.logo || "/escudos/BarrioNorte_V1.png"}
                        alt={equipo.name || "Equipo"}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="min-w-0 text-xs md:text-sm text-gray-800 whitespace-normal break-words leading-snug">
                        {equipo.shortName || equipo.name || "—"}
                      </span>
                    </div>
                  </td>

                  <td className="py-1 px-1 text-center">{equipo.pj}</td>
                  <td className="py-1 px-1 text-center">{equipo.pg}</td>
                  <td className="py-1 px-1 text-center">{equipo.pe}</td>
                  <td className="py-1 px-1 text-center">{equipo.pp}</td>
                  <td className="py-1 px-1 text-center">{equipo.dg}</td>
                  <td className="py-1 pl-1 text-center font-semibold">{equipo.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {footnote ? <p className="mt-2 text-[11px] text-gray-500">{footnote}</p> : null}
    </div>
  );
}

/* ========= categorías (solo pills, sin textos extra) ========= */

export function CategoryPillsCard({ categories, value, onChange }) {
  const list = Array.isArray(categories) ? categories : [];
  const selected = list.find((c) => c.id === value) || list[0];

  if (!list.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 min-w-0 w-full">
      {/* Mobile: select */}
      <div className="sm:hidden">
        <label className="sr-only">Seleccionar categoría</label>
        <select
          value={selected?.id}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600/40"
        >
          {list.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop/tablet: vertical */}
      <div className="hidden sm:block">
        <div className="flex flex-col gap-2 min-w-0">
          {list.map((c) => {
            const active = c.id === selected?.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange(c.id)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm font-extrabold border transition
                  ${
                    active
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ========= semifinales/final ida-vuelta (estilo repechaje) ========= */

const TEAM_SHORT = {
  "Sociedad Sportiva": "Sportiva",
  SociedadSportiva: "Sportiva",
  "Gualeguay Central": "Central",
  GualeguayCentral: "Central",
};

function shortTeamName(name) {
  const n = String(name || "").trim();
  return TEAM_SHORT[n] || n;
}

function isSemiStage(stage) {
  return /\bsemi\b/i.test(stage) || /semif/i.test(stage);
}

// evita que "Semifinales" matchee como "Final"
function isFinalStage(stage) {
  if (!stage) return false;
  if (isSemiStage(stage)) return false;
  return /(^|\b)final(\b|$)/i.test(stage);
}

function chunkPairs(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
  return out;
}

function isLibreName(name) {
  const n = String(name || "").trim();
  return !n || n === "-" || n === "—";
}

function SeriesScorePill({ children }) {
  return (
    <span className="shrink-0 inline-flex items-center justify-center min-w-[22px] px-1 py-[2px] rounded text-xs font-black tabular-nums leading-none text-gray-900 bg-transparent">
      {children}
    </span>
  );
}

function TeamRowSeries({ logo, name, ida, vuelta, pen, useShortNames = true }) {
  const rawName = String(name || "").trim();
  const libre = isLibreName(rawName);

  const showPen =
    pen != null &&
    String(pen).trim() !== "" &&
    String(pen).trim() !== "-" &&
    String(pen).trim() !== "0";

  const isBarrioNorte = /barrio\s*norte/i.test(rawName);

  const displayName = libre ? "Libre" : useShortNames ? shortTeamName(rawName) : rawName;

  const idaVal = String(ida ?? "").trim();
  const vueltaVal = String(vuelta ?? "").trim();

  return (
    <div
      className={[
        "flex items-center justify-between gap-2 py-1.5 min-w-0",
        isBarrioNorte ? "bg-red-50 font-semibold -mx-3 px-3" : "",
      ].join(" ")}
    >
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {libre ? (
          <div className="w-6 h-6" />
        ) : (
          <Image
            src={logo || "/escudos/BarrioNorte_V1.png"}
            alt={rawName || "Equipo"}
            width={24}
            height={24}
            className="object-contain"
          />
        )}

        <span
          className={[
            "min-w-0 text-xs md:text-sm leading-snug truncate",
            libre ? "text-gray-400 italic" : "text-gray-800",
          ].join(" ")}
          title={rawName}
        >
          {displayName}
        </span>
      </div>

      <div className="shrink-0 flex items-center gap-0.5">
        {showPen ? <span className="text-[11px] text-gray-500 font-semibold">({pen})</span> : null}
        <SeriesScorePill>{idaVal && idaVal !== "-" ? idaVal : "—"}</SeriesScorePill>
        <SeriesScorePill>{vueltaVal && vueltaVal !== "-" ? vueltaVal : "—"}</SeriesScorePill>
      </div>
    </div>
  );
}

export function TablaFinalesIdaVueltaCard({
  rows,
  title = "Semifinales y Final",
  phase = "Ida y vuelta",
  footnote,
  useShortNames = true,
}) {
  const groups = useMemo(() => {
    const byStage = new Map();

    (rows || []).forEach((r) => {
      const stage = String(r.etapa || "").trim();
      if (!stage) return;
      if (!byStage.has(stage)) byStage.set(stage, []);
      byStage.get(stage).push(r);
    });

    const semiStages = [...byStage.keys()].filter((k) => isSemiStage(k)).sort((a, b) => a.localeCompare(b));
    const finalStages = [...byStage.keys()]
      .filter((k) => isFinalStage(k))
      .sort((a, b) => {
        const ax = a.trim().toLowerCase() === "final" ? -1 : 0;
        const bx = b.trim().toLowerCase() === "final" ? -1 : 0;
        if (ax !== bx) return ax - bx;
        return a.localeCompare(b);
      });

    const semis = [];
    for (const k of semiStages) {
      const list = byStage.get(k) || [];
      if (list.length <= 2) semis.push(list);
      else semis.push(...chunkPairs(list));
    }

    const finalKey = finalStages[0];
    const finalRaw = finalKey ? byStage.get(finalKey) || [] : [];
    const final = finalRaw.slice(0, 2);

    return { semis, final };
  }, [rows]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-gray-900 min-w-0">
      <div className="flex items-baseline justify-between mb-3 min-w-0 gap-3">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <span className="text-xs text-gray-500">{phase}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start min-w-0">
        <div className="min-w-0 w-full">
          <p className="text-xs font-semibold text-gray-700 mb-2">Semifinales</p>

          <div className="space-y-3">
            {(groups.semis || []).length ? (
              groups.semis.map((match, idx) => (
                <div
                  key={`semi-${idx}`}
                  className="rounded-lg border border-gray-200 bg-white overflow-hidden min-w-0 w-full"
                >
                  <div className="divide-y">
                    {match.map((t, i) => (
                      <div key={`${t.equipo}-${i}`} className="px-3 min-w-0">
                        <TeamRowSeries
                          logo={t.logo}
                          name={t.equipo}
                          ida={t.ida}
                          vuelta={t.vuelta}
                          pen={t.penales}
                          useShortNames={useShortNames}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden min-w-0 w-full">
                <div className="px-3 py-2 text-sm text-gray-500">A definir</div>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 w-full">
          <p className="text-xs font-semibold text-gray-700 mb-2">Final</p>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden min-w-0 w-full">
            <div className="divide-y">
              {(groups.final || []).length ? (
                groups.final.map((t, i) => (
                  <div key={`${t.equipo}-${i}`} className="px-3 min-w-0">
                    <TeamRowSeries
                      logo={t.logo}
                      name={t.equipo}
                      ida={t.ida}
                      vuelta={t.vuelta}
                      pen={t.penales}
                      useShortNames={useShortNames}
                    />
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">A definir</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {footnote ? <p className="mt-2 text-[11px] text-gray-500">{footnote}</p> : null}
    </div>
  );
}
