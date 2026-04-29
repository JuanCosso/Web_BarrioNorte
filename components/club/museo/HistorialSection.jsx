"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ─── Logos ───────────────────────────────────────────────────────────────────
const LOGOS = {
  "Bancario":                "/escudos/Bancario.png",
  "Central":                 "/escudos/GualeguayCentral.png",
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

// ─── Todos los partidos por torneo (para el modal) ────────────────────────────
// Misma data que el route, aquí la necesitamos client-side para el modal.
// No duplica lógica: el route calcula stats; esto solo sirve para mostrar partidos.
const ALL_MATCHES = [
  // SUPERCOPA ENTRE RÍOS 2023
  { torneo: "Supercopa Entre Ríos 2023", rival: "Juventud Unida",        condition: "Local",     score: "2 - 1", date: "04/12" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Central",               condition: "Local",     score: "3 - 2", date: "11/12" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Deportivo Urdinarrain", condition: "Visitante", score: "1 - 0", date: "17/12" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Juventud Unida",        condition: "Visitante", score: "2 - 0", date: "08/01" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Central",               condition: "Visitante", score: "0 - 2", date: "15/01" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Deportivo Urdinarrain", condition: "Local",     score: "1 - 0", date: "22/01" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Ferrocarril (Chajarí)", condition: "Visitante", score: "1 - 1", date: "05/02" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Ferrocarril (Chajarí)", condition: "Local",     score: "1 - 0", date: "12/02" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Libertad (Concordia)",  condition: "Visitante", score: "2 - 1", date: "19/02" },
  { torneo: "Supercopa Entre Ríos 2023", rival: "Libertad (Concordia)",  condition: "Local",     score: "1 - 2", date: "26/02" },
  // OFICIAL 2023
  { torneo: "Oficial 2023", rival: "Libertad",          condition: "Visitante", score: "3 - 1", date: "16/04" },
  { torneo: "Oficial 2023", rival: "Urquiza",           condition: "Local",     score: "3 - 0", date: "23/04" },
  { torneo: "Oficial 2023", rival: "La Academia",       condition: "Local",     score: "2 - 2", date: "30/04" },
  { torneo: "Oficial 2023", rival: "El Progreso",       condition: "Visitante", score: "0 - 2", date: "14/05" },
  { torneo: "Oficial 2023", rival: "Central",           condition: "Local",     score: "2 - 0", date: "01/06" },
  { torneo: "Oficial 2023", rival: "Juventud",          condition: "Visitante", score: "1 - 1", date: "01/06" },
  { torneo: "Oficial 2023", rival: "Quilmes",           condition: "Local",     score: "0 - 0", date: "01/06" },
  { torneo: "Oficial 2023", rival: "Sociedad Sportiva", condition: "Visitante", score: "1 - 0", date: "01/06" },
  { torneo: "Oficial 2023", rival: "Bancario",          condition: "Visitante", score: "0 - 1", date: "02/07" },
  { torneo: "Oficial 2023", rival: "Libertad",          condition: "Local",     score: "0 - 1", date: "09/07" },
  { torneo: "Oficial 2023", rival: "Urquiza",           condition: "Visitante", score: "1 - 0", date: "23/07" },
  { torneo: "Oficial 2023", rival: "La Academia",       condition: "Visitante", score: "1 - 5", date: "30/07" },
  { torneo: "Oficial 2023", rival: "El Progreso",       condition: "Local",     score: "1 - 1", date: "06/08" },
  { torneo: "Oficial 2023", rival: "Central",           condition: "Visitante", score: "2 - 0", date: "20/08" },
  { torneo: "Oficial 2023", rival: "Juventud",          condition: "Local",     score: "2 - 4", date: "27/08" },
  { torneo: "Oficial 2023", rival: "Quilmes",           condition: "Visitante", score: "0 - 1", date: "10/09" },
  { torneo: "Oficial 2023", rival: "Sociedad Sportiva", condition: "Local",     score: "0 - 2", date: "17/09" },
  { torneo: "Oficial 2023", rival: "Bancario",          condition: "Local",     score: "1 - 0", date: "23/09" },
  { torneo: "Oficial 2023 · Repechaje", rival: "Urquiza", condition: "Visitante", score: "1 - 1", date: "27/09" },
  { torneo: "Oficial 2023 · Repechaje", rival: "Central", condition: "Visitante", score: "0 - 0", date: "01/10" },
  // PREPARACIÓN 2024
  { torneo: "Preparación 2024", rival: "Urquiza",           condition: "Local",     score: "0 - 1", date: "17/01" },
  { torneo: "Preparación 2024", rival: "Juventud",          condition: "Visitante", score: "0 - 1", date: "22/01" },
  { torneo: "Preparación 2024", rival: "Quilmes",           condition: "Local",     score: "1 - 0", date: "30/01" },
  { torneo: "Preparación 2024", rival: "El Progreso",       condition: "Visitante", score: "4 - 1", date: "05/02" },
  { torneo: "Preparación 2024 · Semifinal", rival: "Sociedad Sportiva", condition: "Local",     score: "1 - 1", date: "14/02" },
  { torneo: "Preparación 2024 · Final",     rival: "Central",           condition: "Visitante", score: "0 - 0", date: "16/02" },
  // OFICIAL 2024
  { torneo: "Oficial 2024", rival: "Urquiza",           condition: "Visitante", score: "0 - 1", date: "12/05" },
  { torneo: "Oficial 2024", rival: "Libertad",          condition: "Local",     score: "3 - 1", date: "19/05" },
  { torneo: "Oficial 2024", rival: "Sociedad Sportiva", condition: "Local",     score: "0 - 0", date: "26/05" },
  { torneo: "Oficial 2024", rival: "Bancario",          condition: "Visitante", score: "1 - 3", date: "02/06" },
  { torneo: "Oficial 2024", rival: "Quilmes",           condition: "Visitante", score: "0 - 1", date: "09/06" },
  { torneo: "Oficial 2024", rival: "El Progreso",       condition: "Local",     score: "3 - 3", date: "16/06" },
  { torneo: "Oficial 2024", rival: "La Academia",       condition: "Visitante", score: "1 - 0", date: "23/06" },
  { torneo: "Oficial 2024", rival: "Juventud",          condition: "Visitante", score: "2 - 3", date: "30/06" },
  { torneo: "Oficial 2024", rival: "Central",           condition: "Local",     score: "0 - 2", date: "07/07" },
  { torneo: "Oficial 2024", rival: "Urquiza",           condition: "Local",     score: "2 - 2", date: "14/07" },
  { torneo: "Oficial 2024", rival: "Libertad",          condition: "Visitante", score: "1 - 1", date: "21/07" },
  { torneo: "Oficial 2024", rival: "Sociedad Sportiva", condition: "Visitante", score: "1 - 0", date: "28/07" },
  { torneo: "Oficial 2024", rival: "Bancario",          condition: "Local",     score: "4 - 2", date: "04/08" },
  { torneo: "Oficial 2024", rival: "Quilmes",           condition: "Local",     score: "3 - 0", date: "11/08" },
  { torneo: "Oficial 2024", rival: "El Progreso",       condition: "Visitante", score: "1 - 2", date: "18/08" },
  { torneo: "Oficial 2024", rival: "La Academia",       condition: "Local",     score: "1 - 0", date: "25/08" },
  { torneo: "Oficial 2024", rival: "Juventud",          condition: "Local",     score: "5 - 1", date: "08/09" },
  { torneo: "Oficial 2024", rival: "Central",           condition: "Visitante", score: "2 - 2", date: "15/09" },
  { torneo: "Oficial 2024 · Repechaje",   rival: "El Progreso",       condition: "Local",     score: "1 - 0", date: "18/09" },
  { torneo: "Oficial 2024 · Repechaje",   rival: "Quilmes",           condition: "Local",     score: "2 - 0", date: "22/09" },
  { torneo: "Oficial 2024 · Petit",       rival: "Libertad",          condition: "Visitante", score: "1 - 0", date: "06/10" },
  { torneo: "Oficial 2024 · Petit",       rival: "Urquiza",           condition: "Local",     score: "3 - 2", date: "20/10" },
  { torneo: "Oficial 2024 · Petit",       rival: "Sociedad Sportiva", condition: "Visitante", score: "1 - 1", date: "27/10" },
  { torneo: "Oficial 2024 · Petit",       rival: "Libertad",          condition: "Local",     score: "1 - 1", date: "03/11" },
  { torneo: "Oficial 2024 · Petit",       rival: "Urquiza",           condition: "Visitante", score: "0 - 2", date: "10/11" },
  { torneo: "Oficial 2024 · Petit",       rival: "Sociedad Sportiva", condition: "Local",     score: "4 - 1", date: "18/10" },
  // PREPARACIÓN 2025
  { torneo: "Preparación 2025", rival: "Central",     condition: "Visitante", score: "1 - 2", date: "08/01" },
  { torneo: "Preparación 2025", rival: "La Academia", condition: "Local",     score: "0 - 0", date: "10/01" },
  { torneo: "Preparación 2025", rival: "Libertad",    condition: "Visitante", score: "4 - 3", date: "21/01" },
  // OFICIAL 2025
  { torneo: "Oficial 2025", rival: "Bancario",          condition: "Local",     score: "2 - 1", date: "06/04" },
  { torneo: "Oficial 2025", rival: "La Academia",       condition: "Local",     score: "0 - 2", date: "13/04" },
  { torneo: "Oficial 2025", rival: "Urquiza",           condition: "Visitante", score: "3 - 1", date: "20/04" },
  { torneo: "Oficial 2025", rival: "Central",           condition: "Local",     score: "1 - 0", date: "27/04" },
  { torneo: "Oficial 2025", rival: "Sociedad Sportiva", condition: "Visitante", score: "3 - 0", date: "04/05" },
  { torneo: "Oficial 2025", rival: "Libertad",          condition: "Local",     score: "2 - 2", date: "11/05" },
  { torneo: "Oficial 2025", rival: "Quilmes",           condition: "Visitante", score: "1 - 3", date: "25/05" },
  { torneo: "Oficial 2025", rival: "Juventud",          condition: "Local",     score: "0 - 0", date: "01/06" },
  { torneo: "Oficial 2025", rival: "El Progreso",       condition: "Visitante", score: "1 - 1", date: "08/06" },
  { torneo: "Oficial 2025", rival: "Bancario",          condition: "Visitante", score: "0 - 1", date: "06/06" },
  { torneo: "Oficial 2025", rival: "La Academia",       condition: "Visitante", score: "0 - 0", date: "22/06" },
  { torneo: "Oficial 2025", rival: "Urquiza",           condition: "Local",     score: "2 - 0", date: "29/06" },
  { torneo: "Oficial 2025", rival: "Central",           condition: "Visitante", score: "0 - 1", date: "05/07" },
  { torneo: "Oficial 2025", rival: "Sociedad Sportiva", condition: "Local",     score: "2 - 1", date: "13/07" },
  { torneo: "Oficial 2025", rival: "Libertad",          condition: "Visitante", score: "1 - 0", date: "20/07" },
  { torneo: "Oficial 2025", rival: "Quilmes",           condition: "Local",     score: "2 - 2", date: "03/08" },
  { torneo: "Oficial 2025", rival: "Juventud",          condition: "Visitante", score: "3 - 2", date: "10/08" },
  { torneo: "Oficial 2025", rival: "El Progreso",       condition: "Local",     score: "5 - 1", date: "17/08" },
  { torneo: "Oficial 2025 · Petit",  rival: "Sociedad Sportiva", condition: "Visitante", score: "2 - 1", date: "07/09" },
  { torneo: "Oficial 2025 · Petit",  rival: "La Academia",       condition: "Local",     score: "3 - 3", date: "14/09" },
  { torneo: "Oficial 2025 · Petit",  rival: "Juventud",          condition: "Visitante", score: "2 - 3", date: "21/09" },
  { torneo: "Oficial 2025 · Petit",  rival: "Sociedad Sportiva", condition: "Local",     score: "0 - 1", date: "28/09" },
  { torneo: "Oficial 2025 · Petit",  rival: "La Academia",       condition: "Visitante", score: "1 - 0", date: "12/10" },
  // PREPARACIÓN 2026
  { torneo: "Preparación 2026", rival: "La Academia",       condition: "Local",     score: "3 - 1", date: "" },
  { torneo: "Preparación 2026", rival: "Central",           condition: "Visitante", score: "0 - 1", date: "" },
  { torneo: "Preparación 2026", rival: "Bancario",          condition: "Visitante", score: "0 - 1", date: "" },
  { torneo: "Preparación 2026", rival: "Juventud",          condition: "Visitante", score: "1 - 4", date: "" },
  { torneo: "Preparación 2026", rival: "Sociedad Sportiva", condition: "Local",     score: "1 - 2", date: "" },
];

// ─── Parseo de score para mostrar resultado desde perspectiva de BN ──────────
function parseResult(score, condition) {
  if (!score) return null;
  const parts = score.split(/\s*-\s*/);
  if (parts.length !== 2) return null;
  const a = parseInt(parts[0], 10), b = parseInt(parts[1], 10);
  if (isNaN(a) || isNaN(b)) return null;
  const [bn, rival] = /local/i.test(condition) ? [a, b] : [b, a];
  const result = bn > rival ? "V" : bn === rival ? "E" : "D";
  return { bn, rival, result };
}

// ─── Color de fila según balance global ──────────────────────────────────────
function rowBg(pg, pp) {
  if (pg > pp) return "bg-emerald-50 hover:bg-emerald-100/60";
  if (pp > pg) return "bg-red-50 hover:bg-red-100/60";
  return "bg-white hover:bg-gray-50";
}

// ─── Badge numérico de balance ────────────────────────────────────────────────
function BalanceBadge({ pg, pp }) {
  const net = pg - pp;
  if (net > 0)
    return (
      <span className="inline-flex items-center justify-center min-w-[2rem] rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-extrabold text-white tabular-nums">
        +{net}
      </span>
    );
  if (net < 0)
    return (
      <span className="inline-flex items-center justify-center min-w-[2rem] rounded-full bg-red-500 px-2 py-0.5 text-xs font-extrabold text-white tabular-nums">
        {net}
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center min-w-[2rem] rounded-full bg-amber-400 px-2 py-0.5 text-xs font-extrabold text-white tabular-nums">
      =
    </span>
  );
}

// ─── Badge resultado individual (para el modal) ───────────────────────────────
function ResultBadge({ result }) {
  if (result === "V") return <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">V</span>;
  if (result === "D") return <span className="rounded-md bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">D</span>;
  return <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-600">E</span>;
}

// ─── Modal de partidos ────────────────────────────────────────────────────────
function MatchModal({ rivalName, onClose }) {
  const matches = ALL_MATCHES.filter((m) => m.rival === rivalName);
  const logo = LOGOS[rivalName] || "/escudos/default.png";

  // Cierra al hacer click fuera
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative h-9 w-9 shrink-0">
            <Image src={logo} alt={rivalName} fill sizes="36px" className="object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-600">Partidos disputados</p>
            <p className="text-base font-extrabold text-gray-900 truncate">vs {rivalName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
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
                <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Torneo</th>
                <th className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Condición</th>
                <th className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Resultado</th>
                <th className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, i) => {
                const parsed = parseResult(m.score, m.condition);
                // Construir el resultado legible: "BN X – Y Rival"
                const localLabel  = m.condition === "Local" ? "BN" : rivalName.split(" ")[0];
                const visitLabel  = m.condition === "Local" ? rivalName.split(" ")[0] : "BN";
                const [scoreA, scoreB] = m.score.split(/\s*-\s*/);

                return (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-gray-700 font-medium leading-tight block">{m.torneo}</span>
                      {m.date && <span className="text-[10px] text-gray-400">{m.date}</span>}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-[10px] font-semibold text-gray-500">{m.condition === "Local" ? "Local" : "Visitante"}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-bold text-gray-800 tabular-nums whitespace-nowrap">
                        {scoreA} – {scoreB}
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
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="h-3 w-5 bg-gray-200 rounded" />
          <div className="h-7 w-7 bg-gray-200 rounded-full" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="flex-1" />
          {Array.from({ length: 7 }).map((_, j) => (
            <div key={j} className="h-4 w-9 bg-gray-200 rounded" />
          ))}
          <div className="h-5 w-8 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Fila de la tabla ─────────────────────────────────────────────────────────
function Row({ team, idx, onShowMatches }) {
  const { name, pj, pg, pe, pp, gf, gc, dg } = team;
  const logo = LOGOS[name] || "/escudos/default.png";

  return (
    <tr className={`border-b border-gray-100 transition-colors ${rowBg(pg, pp)}`}>
      <td className="pl-4 pr-2 py-3 text-xs text-gray-400 tabular-nums w-7 text-right">{idx + 1}</td>

      {/* Rival */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative h-7 w-7 shrink-0">
            <Image src={logo} alt={name} fill sizes="28px" className="object-contain drop-shadow-sm" />
          </div>
          <span className="text-sm font-semibold text-gray-900 truncate">{name}</span>
        </div>
      </td>

      {/* Stats — sin color individual */}
      <td className="px-3 py-3 text-center text-sm font-bold text-gray-900 tabular-nums">{pj}</td>
      <td className="px-3 py-3 text-center text-sm text-gray-700 tabular-nums">{pg}</td>
      <td className="px-3 py-3 text-center text-sm text-gray-700 tabular-nums">{pe}</td>
      <td className="px-3 py-3 text-center text-sm text-gray-700 tabular-nums">{pp}</td>
      <td className="px-3 py-3 text-center text-sm text-gray-600 tabular-nums">{gf}</td>
      <td className="px-3 py-3 text-center text-sm text-gray-600 tabular-nums">{gc}</td>
      <td className="px-3 py-3 text-center text-sm text-gray-500 tabular-nums">{dg > 0 ? `+${dg}` : dg}</td>

      {/* Balance */}
      <td className="px-3 py-3 text-center"><BalanceBadge pg={pg} pp={pp} /></td>

      {/* Ver partidos */}
      <td className="pl-2 pr-4 py-3 text-right">
        <button
          onClick={() => onShowMatches(name)}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
          Ver partidos
        </button>
      </td>
    </tr>
  );
}

// ─── Th helper ────────────────────────────────────────────────────────────────
function Th({ children, title, right = false }) {
  return (
    <th
      title={title}
      className={`px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 select-none whitespace-nowrap ${right ? "text-right" : "text-center"}`}
    >
      {children}
    </th>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function HistorialSection() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [modalRival, setModalRival] = useState(null);

  useEffect(() => {
    fetch("/api/historial")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const stats = data?.stats ?? [];

  return (
    <section aria-labelledby="museo-historial">

      {/* ── ENCABEZADO — idéntico a EscudosGrid / CamisetasGallery ── */}
      <div className="mb-6">
        <h2
          id="museo-historial"
          className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-1"
        >
          Historial de enfrentamientos
        </h2>
        <p className="text-2xl font-extrabold text-gray-900">
          Nuestros rivales, partido a partido
        </p>
      </div>

      {/* ── ESTADOS ── */}
      {loading && <Skeleton />}

      {!loading && error && (
        <p className="py-10 text-center text-sm text-gray-400">
          No se pudieron cargar los datos del historial.
        </p>
      )}

      {!loading && !error && stats.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">
          Aún no hay partidos registrados.
        </p>
      )}

      {/* ── TABLA ── */}
      {!loading && !error && stats.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">

          {/* Leyenda de colores */}
          <div className="flex flex-wrap items-center gap-5 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
            {[
              { cls: "bg-emerald-50 border-emerald-200", label: "Balance positivo" },
              { cls: "bg-red-50 border-red-200",         label: "Balance negativo" },
              { cls: "bg-white border-gray-200",         label: "Equilibrado" },
            ].map(({ cls, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`inline-block h-3 w-3 rounded-sm border ${cls}`} />
                {label}
              </span>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="w-7" />
                  <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Rival</th>
                  <Th title="Partidos jugados">PJ</Th>
                  <Th title="Ganados">PG</Th>
                  <Th title="Empatados">PE</Th>
                  <Th title="Perdidos">PP</Th>
                  <Th title="Goles a favor">GF</Th>
                  <Th title="Goles en contra">GC</Th>
                  <Th title="Diferencia de gol">DG</Th>
                  <Th title="Balance (victorias menos derrotas)">Bal.</Th>
                  <th className="w-28" />
                </tr>
              </thead>
              <tbody>
                {stats.map((team, i) => (
                  <Row
                    key={team.name}
                    team={team}
                    idx={i}
                    onShowMatches={setModalRival}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {modalRival && (
        <MatchModal rivalName={modalRival} onClose={() => setModalRival(null)} />
      )}
    </section>
  );
}