// components/inicio/UltimosResultados2026.jsx
"use client";

import { useEffect, useState } from "react";

function colorResultado(score, condition) {
  if (!score || score === "Susp." || score === "-") return "bg-gray-100 text-gray-500";
  const [g, c] = score.split("-").map((s) => Number(s.trim()));
  if (isNaN(g) || isNaN(c)) return "bg-gray-100 text-gray-500";
  const gana = condition === "Local" ? g > c : c > g;
  const empata = g === c;
  if (gana)   return "bg-green-100 text-green-700";
  if (empata) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function ResultadoStrip({ label, results }) {
  if (!results || results.length === 0) return null;
  const recientes = results.slice(-2).reverse();

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

            {/* Score — mismo estilo pill, ancho fijo para alinear */}
            <span className={`shrink-0 text-xs font-bold tabular-nums w-12 text-center px-2 py-0.5 rounded-full ${colorResultado(r.score, r.condition)}`}>
              {r.score}
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
    <div className="h-full bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col gap-4">
      <p className="text-sm font-semibold text-gray-800">Últimos resultados</p>
      <ResultadoStrip label="Masculino" results={masc} />
      <ResultadoStrip label="Femenino"  results={fem} />
    </div>
  );
}