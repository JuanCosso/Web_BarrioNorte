"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

/* ========= helpers ========= */

function formatDDMM(dateISO) {
  if (!dateISO) return "";
  const parts = String(dateISO).split("-");
  if (parts.length !== 3) return dateISO;
  const [, mm, dd] = parts;
  return `${dd}/${mm}`;
}

/* ========= icons ========= */

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

/* ========= flyer ========= */

export function FlyerProximoPartidoFull({ data, backgroundImageUrl }) {
  const { round, localName, visitanteName, stadium, fecha, hora, localShield, visitanteShield } = data;

  const fechaDDMM = formatDDMM(fecha);
  const horaLabel = hora && String(hora).trim() ? hora : "A confirmar";

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 border-y border-red-800/30 overflow-hidden bg-black">
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${backgroundImageUrl}')`,
            filter: "grayscale(100%) contrast(1.2) brightness(0.8)",
          }}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-black" />
      )}

      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(-45deg, #0a0a0a, #420707, #dc2626, #7f1d1d, #000000)",
          backgroundSize: "400% 400%",
          animation: "gradientMove 15s ease infinite",
          mixBlendMode: "overlay",
          opacity: 0.9,
        }}
      />

      <div className="relative z-30 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-3 py-3 sm:py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left flex-1 min-w-0">
            <p className="text-[11px] sm:text-xs font-extrabold tracking-[0.35em] text-red-600">PRÓXIMO PARTIDO</p>
            <p className="mt-1 font-black italic uppercase leading-none text-white drop-shadow-lg text-xl sm:text-2xl md:text-3xl">
              {localName} <span className="text-red-600">vs</span> {visitanteName}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-shrink-0">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
              <Image
                src={localShield}
                alt={`Escudo ${localName}`}
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                priority
              />
            </div>

            <span className="font-black italic text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] text-4xl sm:text-5xl md:text-6xl">
              VS
            </span>

            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
              <Image
                src={visitanteShield}
                alt={`Escudo ${visitanteName}`}
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                priority
              />
            </div>
          </div>

          <div className="flex-1 flex justify-center md:justify-end min-w-0">
            <div className="flex flex-col items-center md:items-end">
              {round ? (
                <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.28em] text-red-600 uppercase">
                  {round}
                </span>
              ) : null}

              <div className="mt-1 flex items-center gap-2">
                <IconLocation className="h-5 w-5 text-white drop-shadow-md" />
                <span className="font-bold uppercase tracking-wider text-xs sm:text-sm md:text-base text-white drop-shadow-md">
                  {stadium}
                </span>
              </div>

              <div className="mt-1 flex items-baseline gap-3 leading-none">
                <span className="font-black italic text-2xl sm:text-3xl text-white drop-shadow-md tracking-tight">
                  {fechaDDMM || fecha}
                </span>
                <span className="font-black text-lg sm:text-xl tracking-[0.15em] text-red-600">{horaLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========= tablas ========= */

function clasePosicion(pos, scheme = "liga") {
  if (scheme === "prep") {
    return pos <= 2 ? "text-green-600 font-semibold" : "";
  }
  if (scheme === "fem2026") {
    return pos <= 4 ? "text-green-600 font-semibold" : "";
  }
  // Clasifican los primeros 4, sin amarillo (ej. Oficial 2021/22)
  if (scheme === "top4") {
    return pos <= 4 ? "text-green-600 font-semibold" : "";
  }
  // default liga: top 3 verde, 4–7 amarillo
  if (pos <= 3) return "text-green-600 font-semibold";
  if (pos >= 4 && pos <= 7) return "text-yellow-500 font-semibold";
  return "";
}


export function TablaPosicionesInicioLike({
    title,
    phase,
    equipos,
    footnote,
    withPositionColors = false,
    positionColorScheme = "liga",
  }) {
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
                const esBarrioNorte = equipo.slug === "barrio-norte" || /barrio\s*norte/i.test(String(equipo.name || ""));
  
                return (
                  <tr
                    key={equipo.slug || `${equipo.name || "equipo"}-${index}`}
                    className={`border-b last:border-0 ${
                      esBarrioNorte ? "bg-red-50 font-semibold" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-1 px-2 text-center">
                      {withPositionColors ? (
                        <span className={clasePosicion(posicion, positionColorScheme)}>{posicion}</span>
                      ) : 
                        (
                          posicion
                        )
                      }
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
                          {equipo.name || equipo.shortName || "—"}
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
  

/* ========= llaves ========= */

const TEAM_SHORT = {
  "Sociedad Sportiva": "Sportiva",
  SociedadSportiva: "Sportiva",
  "Gualeguay Central": "Central",
  GualeguayCentral: "Central"
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
    // ultra compacto para ida/vuelta
    return (
      <span className="shrink-0 inline-flex items-center justify-center min-w-[22px] px-1 py-[2px] rounded text-xs font-black tabular-nums leading-none text-gray-900 bg-transparent">
        {children}
      </span>
    );
  }
  
  function TeamRowSeries({ logo, name, ida, vuelta, resultado, pen, useShortNames = true }) {
    const rawName = String(name || "").trim();
    const libre = isLibreName(rawName);
  
    const showPen =
      pen != null &&
      String(pen).trim() !== "" &&
      String(pen).trim() !== "-" &&
      String(pen).trim() !== "0";
  
    const isBarrioNorte = /barrio\s*norte/i.test(rawName);
  
    const displayName = libre ? "Libre" : useShortNames ? shortTeamName(rawName) : rawName;
  
    // si hay ida o vuelta, mostramos ambos; si no, usamos resultado clásico
    const hasLegs = String(ida || "").trim() !== "" || String(vuelta || "").trim() !== "";
    const idaVal = String(ida || "").trim();
    const vueltaVal = String(vuelta || "").trim();
  
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
              "min-w-0 text-xs md:text-sm leading-snug whitespace-normal break-words",
              libre ? "text-gray-400 italic" : "text-gray-800",
            ].join(" ")}
          >
            {displayName}
          </span>
        </div>
  
        <div className="shrink-0 flex items-center gap-0.5">
          {showPen ? <span className="text-[11px] text-gray-500 font-semibold">({pen})</span> : null}
  
          {hasLegs ? (
            <>
              <SeriesScorePill>{idaVal && idaVal !== "-" ? idaVal : "—"}</SeriesScorePill>
              <SeriesScorePill>{vueltaVal && vueltaVal !== "-" ? vueltaVal : "—"}</SeriesScorePill>
            </>
          ) : (
            <SeriesScorePill>{String(resultado || "").trim() || "—"}</SeriesScorePill>
          )}
        </div>
      </div>
    );
  }
  
  export function TablaRondasSeriesCard({
  rows,
  title = "Eliminatorias",
  phase = "Fase Eliminatoria",
  footnote,
  useShortNames = false,
}) {
  const stages = useMemo(() => {
    const byStage = new Map();
    (rows || []).forEach((r) => {
      const st = String(r.etapa || "").trim();
      if (!st) return;
      if (!byStage.has(st)) byStage.set(st, []);
      byStage.get(st).push(r);
    });
    return [...byStage.entries()].map(([stage, list]) => {
      const matches = list.length <= 2 ? [list] : chunkPairs(list);
      return { stage, matches };
    });
  }, [rows]);
 
  // Agrupa visualmente: si hay más de un stage con "semifinal", se unifican en una columna
  const visualGroups = useMemo(() => {
    const semiStages = stages.filter((s) => isSemiStage(s.stage));
    const otherStages = stages.filter((s) => !isSemiStage(s.stage));
 
    if (semiStages.length > 1) {
      return [
        { label: "Semifinales", stages: semiStages },
        ...otherStages.map((s) => ({ label: s.stage, stages: [s] })),
      ];
    }
    return stages.map((s) => ({ label: s.stage, stages: [s] }));
  }, [stages]);
 
  const gridCols = visualGroups.length >= 3 ? "md:grid-cols-3 gap-3" : "md:grid-cols-2 gap-4";
 
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-gray-900 min-w-0">
      <div className="flex items-baseline justify-between mb-3 min-w-0 gap-3">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <span className="text-xs text-gray-500">{phase}</span>
      </div>
 
      <div className={`grid grid-cols-1 ${gridCols} items-start min-w-0`}>
        {visualGroups.map((group) => (
          <div key={group.label} className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 mb-2">{group.label}</p>
 
            <div className="space-y-3">
              {group.stages.flatMap((st) =>
                st.matches.map((match, idx) => {
                  const a = match?.[0] || {};
                  const b = match?.[1] || { equipo: "Libre", ida: "-", vuelta: "-", resultado: "-", penales: "" };
 
                  return (
                    <div
                      key={`${st.stage}-${idx}`}
                      className="rounded-lg border border-gray-200 bg-white overflow-hidden min-w-0 w-full"
                    >
                      <div className="divide-y">
                        <div className="px-3 min-w-0">
                          <TeamRowSeries
                            logo={a.logo}
                            name={a.equipo}
                            ida={a.ida}
                            vuelta={a.vuelta}
                            resultado={a.resultado}
                            pen={a.penales}
                            useShortNames={useShortNames}
                          />
                        </div>
                        <div className="px-3 min-w-0">
                          <TeamRowSeries
                            logo={b.logo}
                            name={b.equipo}
                            ida={b.ida}
                            vuelta={b.vuelta}
                            resultado={b.resultado}
                            pen={b.penales}
                            useShortNames={useShortNames}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
 
      {footnote ? <p className="mt-2 text-[11px] text-gray-500">{footnote}</p> : null}
    </div>
  );
}
  

function ScorePill({ children }) {
    // Más angosto: menos padding + menor min-width
    return (
      <span className="shrink-0 inline-flex items-center justify-center min-w-[26px] px-1 py-0.5 rounded-md text-xs font-black tabular-nums leading-none text-gray-900 bg-transparent">
        {children}
      </span>
    );
}
  
  
  function TeamRow({ logo, name, score, pen, useShortNames = true }) {
    const showPen =
      pen != null &&
      String(pen).trim() !== "" &&
      String(pen).trim() !== "-" &&
      String(pen).trim() !== "0";
  
    const fullName = String(name || "").trim();
    const displayName = useShortNames ? shortTeamName(fullName) : fullName;
  
    // Barrio Norte => fondo rosa en TODA la fila (ocupando todo el ancho del bloque)
    const isBarrioNorte = /barrio\s*norte/i.test(fullName);
  
    return (
      <div
        className={[
          "flex items-center justify-between gap-3 py-1.5",
          isBarrioNorte ? "bg-red-50 font-semibold -mx-3 px-3" : "",
        ].join(" ")}
      >
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <Image
            src={logo || "/escudos/BarrioNorte_V1.png"}
            alt={fullName || "Equipo"}
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="min-w-0 text-xs md:text-sm text-gray-800 leading-snug whitespace-normal break-words">
            {displayName}
          </span>
        </div>
  
        <div className="shrink-0 flex items-center gap-1">
          {/* Penales: se mantiene igual */}
          {showPen ? <span className="text-xs text-gray-500 font-semibold">({pen})</span> : null}
  
          {/* Resultado: negro simple */}
          <ScorePill>{score || "—"}</ScorePill>
        </div>
      </div>
    );
  }
  
  export function TablaLlavesCard({
    rows,
    title = "Eliminatorias",
    phase = "Fase Eliminatoria",
    footnote,
    useShortNames = true, // <- Preparación: false
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
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch min-w-0">
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
                        <div key={`${t.equipo}-${i}`} className="px-3">
                          <TeamRow
                            logo={t.logo}
                            name={t.equipo}
                            score={t.resultado}
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
  
          <div className="min-w-0 w-full flex flex-col">
            <p className="text-xs font-semibold text-gray-700 mb-2">Final</p>
  
            <div className="flex-1 flex items-start md:items-center">
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden min-w-0 w-full">
                <div className="divide-y">
                  {(groups.final || []).length ? (
                    groups.final.map((t, i) => {
                      const hasLegs =
                        String(t.ida || "").trim() !== "" ||
                        String(t.vuelta || "").trim() !== "";
                      return (
                        <div key={`${t.equipo}-${i}`} className="px-3">
                          {hasLegs ? (
                            <TeamRowSeries
                              logo={t.logo}
                              name={t.equipo}
                              ida={t.ida}
                              vuelta={t.vuelta}
                              resultado={t.resultado}
                              pen={t.penales}
                              useShortNames={useShortNames}
                            />
                          ) : (
                            <TeamRow
                              logo={t.logo}
                              name={t.equipo}
                              score={t.resultado}
                              pen={t.penales}
                              useShortNames={useShortNames}
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">A definir</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {footnote ? <p className="mt-2 text-[11px] text-gray-500">{footnote}</p> : null}
      </div>
    );
  }  

/* ========= resultados ========= */

export function UltimosPartidosCard({ items }) {
  const safe = Array.isArray(items) ? items : [];
  const [filter, setFilter] = useState("all");

  // Reset filter when tournament items change
  useEffect(() => {
    setFilter("all");
  }, [items]);

  // Extraer fases dinámicamente según las competencias reales presentes en los partidos
  const phases = useMemo(() => {
    const map = new Map();
    for (const m of safe) {
      const comp = String(m.competition || "").trim();
      if (!comp) continue;
      map.set(comp, (map.get(comp) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [safe]);

  const filtered = useMemo(() => {
    if (filter === "all") return safe;
    return safe.filter((m) => (m.competition || "").trim() === filter);
  }, [safe, filter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 text-gray-900 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 min-w-0 gap-2 pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
            Partidos y Resultados
          </h3>
        </div>

        {/* Mini navegador dinámico por fases del torneo (1 a 3 fases según el torneo) */}
        {phases.length > 1 && (
          <div className="inline-flex flex-wrap rounded-lg bg-gray-100 p-0.5 text-xs font-bold self-start sm:self-auto gap-0.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Todos ({safe.length})
            </button>
            {phases.map((p) => {
              const isSelected = filter === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setFilter(p.name)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    isSelected ? "bg-red-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {p.name} ({p.count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-gray-500 py-3 text-center">No hay partidos cargados para esta selección.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 min-w-0">
          {filtered.map((m, i) => {
            const isAway = (m.condition || "").toLowerCase().includes("visit");
            const roundLabel = m.round || "";
            const dateLabel = m.date || "";
            const compLabel = (m.competition || "").trim();

            return (
              <div
                key={`${m.date}-${m.rival}-${i}`}
                className="rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-gray-200/90 hover:shadow-xs px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs transition-all min-w-0"
              >
                {/* Meta: Fecha & Ronda (debajo de DD/MM) */}
                <div className="shrink-0 flex flex-col justify-center min-w-[58px]">
                  <span className="font-bold text-gray-900 text-xs leading-none">{dateLabel}</span>
                  {roundLabel && (
                    <span className="text-[10.5px] font-medium text-gray-500 mt-1 leading-none truncate max-w-[68px]">
                      {roundLabel}
                    </span>
                  )}
                </div>

                {/* Matchup + Fase escrita en pequeño arriba */}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  {compLabel && (
                    <span className="text-[9.5px] font-medium uppercase tracking-wider text-gray-400 leading-none mb-1 truncate">
                      {compLabel}
                    </span>
                  )}
                  <div className="truncate text-xs leading-tight">
                    {isAway ? (
                      <span className="truncate">
                        <span className="font-semibold text-gray-700">{m.rival}</span>
                        <span className="text-gray-400 mx-1">-</span>
                        <span className="font-bold text-red-600">Barrio Norte</span>
                      </span>
                    ) : (
                      <span className="truncate">
                        <span className="font-bold text-red-600">Barrio Norte</span>
                        <span className="text-gray-400 mx-1">-</span>
                        <span className="font-semibold text-gray-700">{m.rival}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Condición compacta L/V */}
                <span className="shrink-0 text-[10px] font-bold text-gray-500 bg-gray-200/70 px-1.5 py-0.5 rounded">
                  {isAway ? "V" : "L"}
                </span>

                {/* Tanteador */}
                <div className="shrink-0 font-mono font-black text-xs px-2.5 py-1 rounded bg-gray-900 text-white min-w-[42px] text-center">
                  {m.score || "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ========= people (cuerpo técnico & plantel) ========= */

export function PeopleCard({ title, subtitle, items, layout = "list", columns = 1 }) {
  const isGrid = layout === "grid";
  const gridColsClass = columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-1";
  const safe = Array.isArray(items) ? items : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 text-gray-900 h-full min-w-0 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 min-w-0 gap-2 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
              {title}
            </h3>
            {subtitle ? <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p> : null}
          </div>
        </div>

        {safe.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center my-auto">
            <div className="relative w-10 h-10 mx-auto mb-2 opacity-30">
              <Image src="/escudos/BarrioNorte_V1.png" alt="Escudo CABN" fill className="object-contain grayscale" />
            </div>
            <p className="text-xs font-bold text-gray-700">Nómina en archivo digital</p>
            <p className="text-[11px] text-gray-500 mt-1 max-w-xs mx-auto">
              La información histórica de esta temporada se encuentra en proceso de recopilación oficial.
            </p>
          </div>
        ) : isGrid ? (
          <div className={`grid grid-cols-1 ${gridColsClass} gap-2 min-w-0`}>
            {safe.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 flex items-center gap-2.5 hover:bg-white hover:border-gray-200 transition-all min-w-0"
              >
                <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-black shrink-0 border border-red-100">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">{p.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 min-w-0">
            {safe.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="rounded-lg border border-gray-100 bg-gray-50/70 p-2.5 flex items-center justify-between gap-3 hover:bg-white hover:border-gray-200 transition-all min-w-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center text-xs font-black shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-gray-900 leading-tight truncate">{p.name}</p>
                </div>

                <span className="shrink-0 inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
                  {p.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========= palmarés ========= */

export function PalmaresCard({ items }) {
  const safe = Array.isArray(items) ? items : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 text-gray-900 min-w-0">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
          Palmarés
        </h3>
        <span className="text-xs font-semibold text-gray-500">
          {safe.length} Títulos
        </span>
      </div>

      <ul className="divide-y divide-gray-100 min-w-0">
        {safe.map((t, i) => (
          <li key={`${t.title}-${t.year}-${i}`} className="py-2 flex items-center justify-between gap-2.5 min-w-0">
            <span className="min-w-0 text-xs leading-snug font-semibold text-gray-800 whitespace-normal break-words flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              {t.title}
            </span>

            <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-[46px] px-2 rounded-full bg-red-600 text-white text-[11px] font-black leading-none tabular-nums shadow-sm">
              {t.year}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ========= selector de torneo (aditivo compacto) ========= */

export function TournamentSelector({ tournaments, value, onChange }) {
  const list = Array.isArray(tournaments) ? tournaments : [];
  const selected = list.find((t) => t.id === value) || list[0];

  if (!list.length) return null;

  const CHAMPION_IDS = new Set([
    "oficial-2024",
    "preparacion-2024",
    "oficial-2022",
    "oficial-2021-22",
  ]);

  // Mostrar ordenado de más reciente a más antiguo
  const reversedList = [...list].reverse();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white px-4 py-2.5 rounded-xl border border-gray-200/80 shadow-sm text-gray-900">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500 shrink-0">Torneo:</span>
        <span className="text-xs sm:text-sm font-black text-gray-900 truncate">{selected?.label}</span>
        {CHAMPION_IDS.has(selected?.id) && (
          <span className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">
            Campeón
          </span>
        )}
      </div>

      {/* Selector desplegable compacto */}
      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <label htmlFor="select-torneo" className="text-xs font-medium text-gray-500 hidden sm:inline">
          Cambiar torneo:
        </label>
        <div className="relative">
          <select
            id="select-torneo"
            value={selected?.id}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-3 pr-8 py-1 text-xs font-bold text-gray-900 shadow-sm focus:border-red-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600 cursor-pointer"
          >
            {reversedList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label} {CHAMPION_IDS.has(t.id) ? "(Campeón)" : ""}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
