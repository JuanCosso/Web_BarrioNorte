"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ─── Logos ───────────────────────────────────────────────────────────────────
const LOGOS = {
  "Bancario":                "/escudos/Bancario.png",
  "Gualeguay Central":       "/escudos/GualeguayCentral.png",
  "Deportivo Urdinarrain":   "/escudos/DeportivoUrdinarrain.png",
  "El Progreso":             "/escudos/ElProgreso.png",
  "Ferrocarril (Chajarí)":   "/escudos/Ferrocarril-Chajari.png",
  "Juventud":                "/escudos/JuventudCarbo.png",
  "Juventud Carbó":          "/escudos/JuventudCarbo.png",
  "Juventud Unida":          "/escudos/JuventudUnida.png",
  "La Academia":             "/escudos/LaAcademia.png",
  "Libertad":                "/escudos/Libertad_V2.png",
  "Libertad (Concordia)":    "/escudos/Libertad-Concordia.png",
  "Quilmes":                 "/escudos/Quilmes.png",
  "Sociedad Sportiva":       "/escudos/SociedadSportiva.png",
  "Urquiza":                 "/escudos/Urquiza.png",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseResult(score, condition) {
  if (!score) return null;
  const parts = score.split(/\s*-\s*/);
  if (parts.length !== 2) return null;
  const a = parseInt(parts[0], 10), b = parseInt(parts[1], 10);
  if (isNaN(a) || isNaN(b)) return null;
  const [bn, rv] = /local/i.test(condition) ? [a, b] : [b, a];
  return { bn, rival: rv, result: bn > rv ? "V" : bn === rv ? "E" : "D" };
}

// Verde = ganamos más · Rojo = perdemos más · Amarillo = equilibrado
function rowBg(pg, pp) {
  if (pg > pp) return "bg-emerald-50 hover:bg-emerald-100/60";
  if (pp > pg) return "bg-red-50 hover:bg-red-100/60";
  return "bg-amber-50 hover:bg-amber-100/60";
}

// ─── Badge numérico de balance ────────────────────────────────────────────────
function BalanceBadge({ pg, pp }) {
  const net = pg - pp;
  if (net > 0)
    return <span className="inline-flex items-center justify-center min-w-[1.75rem] rounded-full bg-emerald-500 px-1.5 py-0.5 text-[11px] font-extrabold text-white tabular-nums">+{net}</span>;
  if (net < 0)
    return <span className="inline-flex items-center justify-center min-w-[1.75rem] rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-extrabold text-white tabular-nums">{net}</span>;
  return <span className="inline-flex items-center justify-center min-w-[1.75rem] rounded-full bg-amber-400 px-1.5 py-0.5 text-[11px] font-extrabold text-white tabular-nums">=</span>;
}

// ─── Badge V/E/D para el modal ────────────────────────────────────────────────
function ResultBadge({ result }) {
  if (result === "V") return <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">V</span>;
  if (result === "D") return <span className="rounded bg-red-100 px-1.5 py-0.5 text-[11px] font-bold text-red-600">D</span>;
  return <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-600">E</span>;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function MatchModal({ rivalName, allMatches, onClose }) {
  // La API ya devuelve matches ordenados reciente → antiguo
  const matches = allMatches.filter((m) => m.rival === rivalName);
  const logo    = LOGOS[rivalName] || "/escudos/default.png";

  // Cerrar con Escape
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — sin truncate para que "Gualeguay Central" no se corte */}
        <div className="flex items-start gap-3 px-4 py-3.5 border-b border-gray-100">
          <div className="relative h-8 w-8 shrink-0 mt-0.5">
            <Image src={logo} alt={rivalName} fill sizes="32px" className="object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-600 leading-none mb-1">
              Partidos disputados
            </p>
            {/* leading-snug + overflow-visible para que los descendentes no se corten */}
            <p className="text-sm font-extrabold text-gray-900 leading-snug break-words">
              vs {rivalName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de partidos */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left   text-[10px] font-bold uppercase tracking-wider text-gray-400">Torneo</th>
                <th className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Condición</th>
                <th className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Resultado</th>
                <th className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, i) => {
                const parsed        = parseResult(m.score, m.condition);
                const [sA, sB = ""] = m.score.split(/\s*-\s*/);
                return (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-gray-700 font-medium leading-tight block">{m.torneo}</span>
                      {m.date && <span className="text-[10px] text-gray-400">{m.date}</span>}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-[10px] font-semibold text-gray-500">
                        {m.condition === "Local" ? "Local" : "Visitante"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-bold text-gray-800 tabular-nums whitespace-nowrap">
                        {sA} – {sB}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {parsed && <ResultBadge result={parsed.result} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer minimal — solo contador, sin botón Cerrar */}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
          <span className="text-xs text-gray-400">{matches.length} partido{matches.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5">
          <div className="h-3 w-4 bg-gray-200 rounded" />
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="flex-1" />
          {Array.from({ length: 7 }).map((_, j) => (
            <div key={j} className="h-3 w-7 bg-gray-200 rounded" />
          ))}
          <div className="h-5 w-7 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Th ───────────────────────────────────────────────────────────────────────
function Th({ children, title }) {
  return (
    <th title={title} className="px-1.5 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 select-none whitespace-nowrap text-center">
      {children}
    </th>
  );
}

// ─── Fila ─────────────────────────────────────────────────────────────────────
function Row({ team, idx, onShowMatches }) {
  const { name, pj, pg, pe, pp, gf, gc, dg } = team;
  const logo = LOGOS[name] || "/escudos/default.png";

  return (
    <tr className={`border-b border-gray-100 transition-colors ${rowBg(pg, pp)}`}>
      <td className="pl-3 sm:pl-4 pr-1 py-2.5 text-[10px] sm:text-xs text-gray-400 tabular-nums w-6 text-right">{idx + 1}</td>

      <td className="px-2 sm:px-3 py-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div className="relative h-5 w-5 sm:h-7 sm:w-7 shrink-0">
            <Image src={logo} alt={name} fill sizes="28px" className="object-contain drop-shadow-sm" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{name}</span>
        </div>
      </td>

      <td className="px-1.5 sm:px-3 py-2.5 text-center text-xs sm:text-sm font-bold text-gray-900 tabular-nums">{pj}</td>
      <td className="px-1.5 sm:px-3 py-2.5 text-center text-xs sm:text-sm text-gray-700 tabular-nums">{pg}</td>
      <td className="px-1.5 sm:px-3 py-2.5 text-center text-xs sm:text-sm text-gray-700 tabular-nums">{pe}</td>
      <td className="px-1.5 sm:px-3 py-2.5 text-center text-xs sm:text-sm text-gray-700 tabular-nums">{pp}</td>
      <td className="px-1.5 sm:px-3 py-2.5 text-center text-xs sm:text-sm text-gray-600 tabular-nums">{gf}</td>
      <td className="px-1.5 sm:px-3 py-2.5 text-center text-xs sm:text-sm text-gray-600 tabular-nums">{gc}</td>
      <td className="px-1.5 sm:px-3 py-2.5 text-center text-xs sm:text-sm text-gray-500 tabular-nums">{dg > 0 ? `+${dg}` : dg}</td>

      <td className="px-1.5 sm:px-3 py-2.5 text-center">
        <BalanceBadge pg={pg} pp={pp} />
      </td>

      <td className="pl-1 pr-3 sm:pr-4 py-2.5 text-right">
        <button
          onClick={() => onShowMatches(name)}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
          <span className="hidden sm:inline">Ver partidos</span>
          <span className="sm:hidden">Ver</span>
        </button>
      </td>
    </tr>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function HistorialSection() {
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [modalRival, setModalRival] = useState(null);

  useEffect(() => {
    fetch("/api/historial")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const stats   = data?.stats   ?? [];
  // matches ya vienen ordenados reciente → antiguo desde la API
  const matches = data?.matches ?? [];

  return (
    <section aria-labelledby="museo-historial">

      {/* Encabezado idéntico a EscudosGrid */}
      <div className="mb-6">
        <h2 id="museo-historial" className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-1">
          Historial de enfrentamientos
        </h2>
        <p className="text-2xl font-extrabold text-gray-900">
          Nuestros rivales, partido a partido
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Se contabilizan los torneos disputados a partir de 2021, año de la vuelta a la competencia tras la pandemia.
        </p>
      </div>

      {loading && <Skeleton />}

      {!loading && error && (
        <p className="py-10 text-center text-sm text-gray-400">No se pudieron cargar los datos del historial.</p>
      )}

      {!loading && !error && stats.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">Aún no hay partidos registrados.</p>
      )}

      {!loading && !error && stats.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="w-6" />
                  <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">Rival</th>
                  <Th title="Partidos jugados">PJ</Th>
                  <Th title="Ganados">PG</Th>
                  <Th title="Empatados">PE</Th>
                  <Th title="Perdidos">PP</Th>
                  <Th title="Goles a favor">GF</Th>
                  <Th title="Goles en contra">GC</Th>
                  <Th title="Diferencia de gol">DG</Th>
                  <Th title="Balance (victorias menos derrotas)">Bal.</Th>
                  <th className="w-20 sm:w-28" />
                </tr>
              </thead>
              <tbody>
                {stats.map((team, i) => (
                  <Row key={team.name} team={team} idx={i} onShowMatches={setModalRival} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalRival && (
        <MatchModal
          rivalName={modalRival}
          allMatches={matches}
          onClose={() => setModalRival(null)}
        />
      )}
    </section>
  );
}