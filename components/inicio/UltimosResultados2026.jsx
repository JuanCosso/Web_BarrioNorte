// components/inicio/UltimosResultados2026.jsx
"use client";

import { useEffect, useState } from "react";

function colorResultado(score, condition) {
  if (!score || score === "Susp." || score === "-") return "bg-gray-100 text-gray-500";
  const match = score.match(/^(\d+)\s*-\s*(\d+)/);
  if (!match) return "bg-gray-100 text-gray-500";
  const localGoles = Number(match[1]);
  const visitanteGoles = Number(match[2]);

  let myGoles = condition === "Local" ? localGoles : visitanteGoles;
  let rivalGoles = condition === "Local" ? visitanteGoles : localGoles;

  const penMatch = score.match(/\((\d+)\s*-\s*(\d+)\)/);
  if (penMatch) {
    const localPen = Number(penMatch[1]);
    const visitantePen = Number(penMatch[2]);
    let myPen = condition === "Local" ? localPen : visitantePen;
    let rivalPen = condition === "Local" ? visitantePen : localPen;

    if (myPen > rivalPen) return "bg-green-100 text-green-700";
    if (myPen < rivalPen) return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  }

  if (myGoles > rivalGoles)   return "bg-green-100 text-green-700";
  if (myGoles === rivalGoles) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function ResultadoStrip({ label, results }) {
  if (!results || results.length === 0) return null;
  const playedResults = results.filter((r) => r.score && r.score !== "-" && r.score !== "Susp.");
  const recientes = playedResults.slice(-2).reverse();

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        {recientes.map((r, i) => (
          <div key={i} className="flex items-center gap-2">

            {/* Fecha */}
            {r.date && (
              <span className="shrink-0 text-[11px] text-gray-400 tabular-nums w-8">
                {r.date}
              </span>
            )}

            {/* L / V */}
            <span className="shrink-0 text-[11px] font-semibold text-gray-400 w-4">
              {r.condition === "Local" ? "L" : "V"}
            </span>

            {/* Rival */}
            <span className="flex-1 min-w-0 text-xs text-gray-700 truncate">
              vs {r.rival}
            </span>

            {/* Score — en un solo renglón sin wrap */}
            <span className={`shrink-0 whitespace-nowrap text-[11px] font-bold tabular-nums text-center px-2 py-0.5 rounded-full ${colorResultado(r.score, r.condition)}`}>
              {r.score.replace(/^(\d+)\s*-\s*(\d+)/, "$1-$2")}
            </span>

          </div>
        ))}
      </div>
    </div>
  );
}

export default function UltimosResultados2026() {
  const [masc, setMasc] = useState([]);
  const [fem, setFem]   = useState([]);

  useEffect(() => {
    fetch("/api/resultados?tournament=oficial-2026&category=masculino")
      .then((r) => r.ok ? r.json() : { results: [] })
      .then((d) => setMasc(Array.isArray(d.results) ? d.results : []))
      .catch(() => {});

    fetch("/api/resultados?tournament=oficial-2026-fem&category=femenino")
      .then((r) => r.ok ? r.json() : { results: [] })
      .then((d) => setFem(Array.isArray(d.results) ? d.results : []))
      .catch(() => {});
  }, []);

  if (masc.length === 0 && fem.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col gap-4">
      <p className="text-sm font-semibold text-gray-800">Últimos resultados</p>
      <ResultadoStrip label="Masculino" results={masc} />
      <ResultadoStrip label="Femenino"  results={fem} />
    </div>
  );
}