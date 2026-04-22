"use client";

import { useMemo } from "react";
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

  // default (liga/oficial)
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
    useShortNames = false, // por defecto: sin abreviar (mejor para SuperCopa)
  }) {
    const stages = useMemo(() => {
      const byStage = new Map();
      (rows || []).forEach((r) => {
        const st = String(r.etapa || "").trim();
        if (!st) return;
        if (!byStage.has(st)) byStage.set(st, []);
        byStage.get(st).push(r);
      });
  
      // mantenemos el orden de aparición en la sheet (Map preserva inserción)
      return [...byStage.entries()].map(([stage, list]) => {
        const matches = list.length <= 2 ? [list] : chunkPairs(list);
        return { stage, matches };
      });
    }, [rows]);
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-gray-900 min-w-0">
        <div className="flex items-baseline justify-between mb-3 min-w-0 gap-3">
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <span className="text-xs text-gray-500">{phase}</span>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start min-w-0">
          {stages.map((st) => (
            <div key={st.stage} className="min-w-0">
              <p className="text-xs font-semibold text-gray-700 mb-2">{st.stage}</p>
  
              <div className="space-y-3">
                {st.matches.map((match, idx) => {
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
                })}
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-gray-900 min-w-0">
      <div className="flex items-center justify-between mb-3 min-w-0 gap-3">
        <h3 className="text-sm font-semibold text-gray-800">Partidos</h3>
        <span className="text-xs text-gray-500">Resultados</span>
      </div>

      {safe.length === 0 ? (
        <p className="text-sm text-gray-600">No hay partidos cargados para este torneo.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 min-w-0">
          {safe.map((m, i) => {
            // CAMBIO: Usamos directamente lo que venga en el config.
            // Ya no forzamos "Fecha" ni validamos texto. Tú tienes el control.
            const roundLabel = m.round || ""; 
            
            // CAMBIO: Priorizamos competition, pero si quieres usar otro campo, tienes libertad.
            const compLabel = m.competition || "";

            // Filtramos los que estén vacíos para que no queden espacios raros en el join
            const metaParts = [m.date, roundLabel, compLabel].filter(Boolean);

            const isAway = (m.condition || "").toLowerCase().includes("visit");
            const matchup = isAway ? `${m.rival} - Barrio Norte` : `Barrio Norte - ${m.rival}`;

            return (
              <div
                key={`${m.date}-${m.rival}-${i}`}
                className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 flex items-start justify-between gap-3 min-w-0"
              >
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500 leading-tight whitespace-normal">
                    {/* Aquí se unen: Fecha · Ronda · Torneo */}
                    {metaParts.join(" · ")}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900 leading-snug whitespace-normal break-words">
                    {matchup}
                  </p>
                </div>

                <div className="shrink-0 px-2 py-1 rounded-md text-xs font-black bg-red-50 text-red-600">
                  {m.score}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ========= people ========= */

export function PeopleCard({ title, subtitle, items, layout = "list", columns = 1 }) {
  const isGrid = layout === "grid";
  const gridColsClass = columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-1";
  const safe = Array.isArray(items) ? items : [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-gray-900 h-full min-w-0">
      <div className="flex items-center justify-between mb-3 min-w-0 gap-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>

      {safe.length === 0 ? (
        <p className="text-sm text-gray-600">Sin datos cargados.</p>
      ) : isGrid ? (
        <div className={`grid grid-cols-1 ${gridColsClass} gap-3 min-w-0`}>
          {safe.map((p, i) => (
            <div key={`${p.name}-${i}`} className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 min-w-0">
              <p className="font-semibold text-gray-900 leading-tight">{p.name}</p>
              <p className="text-xs text-gray-500">{p.role}</p>
            </div>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 min-w-0">
          {safe.map((p, i) => (
            <li key={`${p.name}-${i}`} className="py-2 min-w-0">
              <p className="font-semibold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-500">{p.role}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ========= palmarés ========= */

export function PalmaresCard({ items }) {
    const safe = Array.isArray(items) ? items : [];
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 text-gray-900 min-w-0">
        <ul className="divide-y divide-gray-100 min-w-0">
          {safe.map((t, i) => (
            <li
              key={`${t.title}-${t.year}-${i}`}
              className="py-2 flex items-center justify-between gap-3 min-w-0"
            >
              <span className="min-w-0 text-[13px] leading-snug font-semibold italic text-gray-900 whitespace-normal break-words">
                {t.title}
              </span>
  
              <span
                className="
                  shrink-0
                  inline-flex items-center justify-center
                  h-7 min-w-[56px] px-3
                  rounded-full
                  bg-red-600 text-white
                  text-xs font-bold
                  leading-none
                  tabular-nums
                  shadow-sm
                "
              >
                {t.year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  

/* ========= selector ========= */

export function TournamentSelector({ tournaments, value, onChange }) {
  const list = Array.isArray(tournaments) ? tournaments : [];
  const selected = list.find((t) => t.id === value) || list[0];

  if (!list.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 min-w-0">
      <div className="flex items-center justify-between gap-3 min-w-0">
        <p className="text-sm font-semibold text-gray-800">Ver torneos</p>
        <span className="text-xs text-gray-500">Repasá torneos recientes</span>
      </div>

      {/* Móvil: select */}
      <div className="mt-2 sm:hidden">
        <label className="sr-only">Seleccionar torneo</label>
        <select
          value={selected?.id}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600/40"
        >
          {list.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop/tablet: pills */}
      <div className="mt-2 hidden sm:block">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-0">
          {list.map((t) => {
            const active = t.id === selected?.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange(t.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-extrabold border transition
                  ${active ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
