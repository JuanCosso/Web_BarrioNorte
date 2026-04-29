"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ─── logos ───────────────────────────────────────────────────────────────────
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

// ─── balance por fila ─────────────────────────────────────────────────────────
// verde = más victorias; rojo = más derrotas; blanco = equilibrado
function rowStyle(pg, pp) {
  if (pg > pp) return "bg-emerald-50 hover:bg-emerald-100/70";
  if (pp > pg) return "bg-red-50    hover:bg-red-100/70";
  return "bg-white hover:bg-gray-50";
}

// ─── badge de historial ───────────────────────────────────────────────────────
function Badge({ pg, pp }) {
  const net = pg - pp;
  if (net > 0)
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2l1.5 3.5H11l-2.8 2 1.1 3.5L6 9 2.7 11 3.8 7.5 1 5.5h3.5z"/></svg>
        +{net} Favorable
      </span>
    );
  if (net < 0)
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600 ring-1 ring-red-200">
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10L4.5 6.5H1l2.8-2L2.7 1 6 3l3.3-2-1.1 3.5L11 6.5H7.5z"/></svg>
        {net} Desfav.
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500 ring-1 ring-gray-200">
      = Neutro
    </span>
  );
}

// ─── skeleton ────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse divide-y divide-gray-100">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="h-3 w-5 bg-gray-200 rounded" />
          <div className="h-7 w-7 bg-gray-200 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="flex-1" />
          {Array.from({ length: 7 }).map((_, j) => (
            <div key={j} className="h-4 w-9 bg-gray-200 rounded" />
          ))}
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── fila ─────────────────────────────────────────────────────────────────────
function Row({ team, idx }) {
  const { name, pj, pg, pe, pp, gf, gc, dg } = team;
  const logo = LOGOS[name] || "/escudos/default.png";

  return (
    <tr className={`border-b border-gray-100 transition-colors ${rowStyle(pg, pp)}`}>
      {/* # */}
      <td className="pl-4 pr-2 py-2.5 text-xs text-gray-400 tabular-nums w-8 text-right">{idx + 1}</td>

      {/* Rival */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative h-7 w-7 shrink-0">
            <Image src={logo} alt={name} fill sizes="28px" className="object-contain drop-shadow-sm" />
          </div>
          <span className="text-sm font-semibold text-gray-900 truncate">{name}</span>
        </div>
      </td>

      {/* Estadísticas — sin colores en celdas, solo negrita en PJ */}
      <td className="px-3 py-2.5 text-center text-sm font-bold text-gray-900 tabular-nums">{pj}</td>
      <td className="px-3 py-2.5 text-center text-sm text-gray-700 tabular-nums">{pg}</td>
      <td className="px-3 py-2.5 text-center text-sm text-gray-700 tabular-nums">{pe}</td>
      <td className="px-3 py-2.5 text-center text-sm text-gray-700 tabular-nums">{pp}</td>
      <td className="px-3 py-2.5 text-center text-sm text-gray-600 tabular-nums">{gf}</td>
      <td className="px-3 py-2.5 text-center text-sm text-gray-600 tabular-nums">{gc}</td>
      <td className="px-3 py-2.5 text-center text-sm text-gray-500 tabular-nums">{dg > 0 ? `+${dg}` : dg}</td>

      {/* Badge de historial */}
      <td className="pl-2 pr-4 py-2.5 text-right">
        <Badge pg={pg} pp={pp} />
      </td>
    </tr>
  );
}

// ─── th ──────────────────────────────────────────────────────────────────────
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

// ─── componente principal ─────────────────────────────────────────────────────
export default function HistorialSection() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    fetch("/api/historial")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const stats = data?.stats ?? [];
  const total = data?.total ?? 0;
  const totPG = stats.reduce((a, t) => a + t.pg, 0);
  const totPE = stats.reduce((a, t) => a + t.pe, 0);
  const totPP = stats.reduce((a, t) => a + t.pp, 0);
  const totGF = stats.reduce((a, t) => a + t.gf, 0);
  const totGC = stats.reduce((a, t) => a + t.gc, 0);
  const totDG = totGF - totGC;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">

      {/* ── HEADER ── */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="flex items-center gap-2.5">
            <div className="h-5 w-1 rounded-full bg-red-600 shrink-0" />
            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                Historial de enfrentamientos
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Primera Masculina · todos los torneos</p>
            </div>
          </div>

          {!loading && !error && total > 0 && (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-gray-500">
                <b className="text-gray-900 text-base">{total}</b> partidos
              </span>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <span className="text-gray-500 hidden sm:inline">
                <b className="text-emerald-700">{totPG}</b> G ·{" "}
                <b className="text-gray-700">{totPE}</b> E ·{" "}
                <b className="text-red-600">{totPP}</b> P
              </span>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <span className="text-gray-500 hidden sm:inline">
                {totGF}:{totGC}{" "}
                <span className={`font-bold ${totDG > 0 ? "text-emerald-700" : totDG < 0 ? "text-red-600" : "text-gray-500"}`}>
                  ({totDG > 0 ? `+${totDG}` : totDG})
                </span>
              </span>
            </div>
          )}
        </div>

        {/* leyenda de colores */}
        {!loading && !error && stats.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {[
              { color: "bg-emerald-100 ring-emerald-200", label: "Historial favorable" },
              { color: "bg-red-100 ring-red-200",         label: "Historial desfavorable" },
              { color: "bg-white ring-gray-200",          label: "Historial equilibrado" },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`inline-block h-3 w-3 rounded-sm ring-1 ${color}`} />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── ESTADO ── */}
      {loading && <div className="py-2"><Skeleton /></div>}

      {!loading && error && (
        <p className="px-5 py-10 text-center text-sm text-gray-400">
          No se pudieron cargar los datos del historial.
        </p>
      )}

      {!loading && !error && stats.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-gray-400">
          Aún no hay partidos registrados.
        </p>
      )}

      {/* ── TABLA ── */}
      {!loading && !error && stats.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="w-8" />
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Rival
                </th>
                <Th title="Partidos jugados">PJ</Th>
                <Th title="Ganados">PG</Th>
                <Th title="Empatados">PE</Th>
                <Th title="Perdidos">PP</Th>
                <Th title="Goles a favor">GF</Th>
                <Th title="Goles en contra">GC</Th>
                <Th title="Diferencia de gol">DG</Th>
                <Th right title="Balance historial">Historial</Th>
              </tr>
            </thead>

            <tbody>
              {stats.map((team, i) => (
                <Row key={team.name} team={team} idx={i} />
              ))}
            </tbody>

            {/* TOTALES */}
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50/80">
                <td colSpan={2} className="pl-5 pr-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Total
                </td>
                <td className="px-3 py-3 text-center text-sm font-bold text-gray-900 tabular-nums">{total}</td>
                <td className="px-3 py-3 text-center text-sm text-gray-700 tabular-nums">{totPG}</td>
                <td className="px-3 py-3 text-center text-sm text-gray-700 tabular-nums">{totPE}</td>
                <td className="px-3 py-3 text-center text-sm text-gray-700 tabular-nums">{totPP}</td>
                <td className="px-3 py-3 text-center text-sm text-gray-600 tabular-nums">{totGF}</td>
                <td className="px-3 py-3 text-center text-sm text-gray-600 tabular-nums">{totGC}</td>
                <td className="px-3 py-3 text-center text-sm font-bold tabular-nums">
                  <span className={totDG > 0 ? "text-emerald-700" : totDG < 0 ? "text-red-600" : "text-gray-500"}>
                    {totDG > 0 ? `+${totDG}` : totDG}
                  </span>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>

          <p className="px-5 py-3 text-[11px] text-gray-400 border-t border-gray-100">
            PJ partidos jugados · PG ganados · PE empatados · PP perdidos · GF goles a favor · GC en contra · DG diferencia de gol
          </p>
        </div>
      )}
    </div>
  );
}