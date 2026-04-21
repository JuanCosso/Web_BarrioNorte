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
  // Mostramos los últimos 3
  const recientes = results.slice(-3).reverse();

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
      <div className="flex flex-wrap gap-2">
        {recientes.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm"
          >
            <span className="text-gray-500 font-medium">{r.rival}</span>
            <span
              className={`font-bold rounded-full px-1.5 py-px text-[10px] ${colorResultado(r.score, r.condition)}`}
            >
              {r.score}
            </span>
            <span className="text-[10px] text-gray-400">{r.condition === "Local" ? "L" : "V"}</span>
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
    <div className="flex flex-wrap gap-6 items-start px-1">
      <ResultadoStrip label="Masculino" results={masc} />
      <ResultadoStrip label="Femenino"  results={fem} />
    </div>
  );
}