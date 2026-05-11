"use client";

import { useState, useRef, useCallback } from "react";
import { aplicarConfigEquipo } from "@/data/equiposConfig";

// ─── Logos extra que no están en equiposConfig ────────────────────────────────
const LOGOS_EXTRA = {
  "Aldea Asunción":  "/escudos/AldeaAsuncion.png",
  "Aldea Asuncion":  "/escudos/AldeaAsuncion.png",
  "Juventud Carbó":  "/escudos/JuventudCarbo.png",
  "Centro Bancario": "/escudos/Bancario.png",
};

// ─── Esquemas de color ────────────────────────────────────────────────────────
// liga    → top 3 verde · 4-7 amarillo  (solo Primera Masculino)
// fem2026 → top 4 verde · sin amarillo  (Primera Femenino)
// top4    → top 4 verde · sin amarillo  (Inferiores + Infantiles)
const COLOR_SCHEME = {
  liga:    (pos) => (pos <= 3 ? "verde" : pos <= 7 ? "amarillo" : "ninguno"),
  fem2026: (pos) => (pos <= 4 ? "verde" : "ninguno"),
  top4:    (pos) => (pos <= 4 ? "verde" : "ninguno"),
};

const BAR_COLOR = { verde: "#00c87a", amarillo: "#f5a623", ninguno: "rgba(255,255,255,0.08)" };
const NUM_COLOR = { verde: "#00c87a", amarillo: "#f5a623", ninguno: "#6b7280" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function enriquecerEquipos(equiposRaw) {
  return equiposRaw
    .map((e) => {
      const cfg  = aplicarConfigEquipo(e);
      const logo = cfg.logo === "/escudos/default.png"
        ? (LOGOS_EXTRA[e.name] ?? "/escudos/default.png")
        : cfg.logo;
      return { ...cfg, logo, pts: e.pg * 3 + e.pe };
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg  !== a.dg)  return b.dg  - a.dg;
      if (b.gm  !== a.gm)  return b.gm  - a.gm;
      return a.name.localeCompare(b.name);
    });
}

function dgLabel(dg) {
  if (typeof dg !== "number") return "–";
  return dg >= 0 ? `+${dg}` : String(dg);
}

// ─── Estilos inline (necesarios para que html-to-image los capture bien) ──────
const S = {
  card: {
    width: 560,
    background: "#09090b", // Negro profundo, estilo noir elegante
    padding: "32px 28px 24px",
    position: "relative",
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: 8,
    overflow: "hidden",
  },
  topLine: { position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#c0061b" },
  header:  { marginBottom: 20 },
  headerTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  divTitle: {
    fontSize: 24, fontWeight: 800, color: "#ffffff",
    textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1, margin: 0,
  },
  badge: {
    background: "rgba(192,6,27,0.15)", border: "1px solid rgba(192,6,27,0.4)", color: "#e84e5e",
    fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
    padding: "4px 8px", borderRadius: 4, whiteSpace: "nowrap", flexShrink: 0,
  },
  sepRow:   { display: "flex", alignItems: "center", gap: 12, marginTop: 12 },
  sepLine:  { flex: 1, height: 1, background: "rgba(192,6,27,0.4)" },
  sepLabel: { fontSize: 10, fontWeight: 700, color: "#c0061b", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap" },
  colsGrid: {
    display: "grid",
    gridTemplateColumns: "30px 1fr 30px 28px 28px 28px 36px 40px",
    gap: 4, padding: "0 8px 10px", alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  colHead: { fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" },
  rowGrid: {
    display: "grid",
    gridTemplateColumns: "30px 1fr 30px 28px 28px 28px 36px 40px",
    gap: 4, alignItems: "center", padding: "6px 8px", borderRadius: 6, marginBottom: 4,
  },
  posCell: { display: "flex", alignItems: "center", gap: 6 },
  posBar:  { width: 3, height: 20, borderRadius: 1.5, flexShrink: 0 },
  posNum:  { fontSize: 13, fontWeight: 700, width: 16, textAlign: "right", lineHeight: 1 },
  teamCell:{ display: "flex", alignItems: "center", gap: 10 },
  teamLogo: { width: 28, height: 28, objectFit: "contain", flexShrink: 0 },
  stat: { fontSize: 13, fontWeight: 500, color: "#d1d5db", textAlign: "center", lineHeight: 1 },
  pts:  { fontSize: 14, fontWeight: 700, color: "#ffffff", textAlign: "center", background: "#c0061b", borderRadius: 4, padding: "4px 0", lineHeight: 1.2 },
  legend: { display: "flex", gap: 16, marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" },
  legItem: { display: "flex", alignItems: "center", gap: 6 },
  legDot:  { width: 8, height: 8, borderRadius: 2 },
  legText: { fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 },
  footer:  { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 },
  footTrn: { fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 },
  footHdl: { fontSize: 11, color: "#d1d5db", letterSpacing: "0.05em", fontWeight: 600 },
  footAt:  { color: "#c0061b" },
};

// ─── Grupos del selector ──────────────────────────────────────────────────────
const GRUPOS = [
  { label: "Primera División", keys: ["primera_masc", "primera_fem"] },
  { label: "Inferiores",       keys: ["tercera", "cuarta", "quinta", "sexta", "septima"] },
  { label: "Infantiles",       keys: ["cat_a", "cat_b", "cat_c", "cat_d"] },
];

// ─── Componente ───────────────────────────────────────────────────────────────
export default function TablaImagenClient({ categorias }) {
  const keys = Object.keys(categorias);
  const [catKey,      setCatKey]      = useState(keys[0]);
  const [descargando, setDescargando] = useState(false);
  const cardRef = useRef(null);

  const cat     = categorias[catKey];
  const equipos = enriquecerEquipos(cat.equipos);
  const scheme  = COLOR_SCHEME[cat.scheme] ?? COLOR_SCHEME.top4;

  const handleDescargar = useCallback(async () => {
    if (!cardRef.current) return;
    setDescargando(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl   = await toPng(cardRef.current, {
        quality:    1,
        pixelRatio: 2,
        cacheBust:  true,
      });
      const link    = document.createElement("a");
      link.download = `tabla-${catKey}-oficial-2026.png`;
      link.href     = dataUrl;
      link.click();
    } catch (err) {
      console.error("[TablaImagen] Error al generar PNG:", err);
      alert("No se pudo generar la imagen. Revisá la consola.");
    } finally {
      setDescargando(false);
    }
  }, [catKey]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center py-10 px-4">

      {/* Controles */}
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-white font-bold text-xl mb-4">Exportar tabla de posiciones</h1>
        <div className="flex gap-3 flex-wrap items-center">
          <select
            value={catKey}
            onChange={(e) => setCatKey(e.target.value)}
            className="flex-1 min-w-[220px] bg-neutral-900 text-white border border-neutral-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-700"
          >
            {GRUPOS.map(({ label, keys: gkeys }) => (
              <optgroup key={label} label={label}>
                {gkeys.filter((k) => categorias[k]).map((k) => (
                  <option key={k} value={k}>
                    {categorias[k].division} · {categorias[k].badge}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            onClick={handleDescargar}
            disabled={descargando}
            className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {descargando ? "Generando…" : "↓ Exportar PNG"}
          </button>
        </div>
      </div>

      {/* Tarjeta exportable */}
      <div ref={cardRef} style={S.card}>

        <div style={S.topLine} />

        {/* Header: división + badge */}
        <div style={S.header}>
          <div style={S.headerTop}>
            <p style={S.divTitle}>{cat.division}</p>
            <span style={S.badge}>{cat.badge}</span>
          </div>
          <div style={S.sepRow}>
            <div style={S.sepLine} />
            <span style={S.sepLabel}>Fase regular</span>
            <div style={S.sepLine} />
          </div>
        </div>

        {/* Cabecera columnas */}
        <div style={S.colsGrid}>
          {["", "Equipo", "PJ", "PG", "PE", "PP", "DG", "PTS"].map((h, i) => (
            <span key={i} style={{ ...S.colHead, textAlign: i === 1 ? "left" : "center" }}>
              {h}
            </span>
          ))}
        </div>

        {/* Filas */}
        {equipos.map((eq, i) => {
          const pos    = i + 1;
          const color  = scheme(pos);
          const isClub = eq.name === "Barrio Norte";

          // Contraste sutil para las filas y destaque premium para el club
          const rowBg = isClub 
            ? "rgba(192, 6, 27, 0.12)" 
            : (i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent");
          
          const rowBorder = isClub 
            ? "1px solid rgba(192, 6, 27, 0.3)" 
            : "1px solid transparent";

          return (
            <div
              key={eq.name}
              style={{ ...S.rowGrid, background: rowBg, border: rowBorder }}
            >
              <div style={S.posCell}>
                <div style={{ ...S.posBar, background: BAR_COLOR[color] }} />
                <span style={{ ...S.posNum, color: NUM_COLOR[color] }}>{pos}</span>
              </div>

              <div style={S.teamCell}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={eq.logo} alt={eq.name} style={S.teamLogo} />
                <span style={{
                  fontSize: 14, 
                  fontWeight: isClub ? 700 : 500,
                  color: isClub ? "#ffffff" : "#e5e7eb",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {eq.shortName}
                </span>
              </div>

              <span style={{ ...S.stat, color: isClub ? "#ffffff" : "#d1d5db", fontWeight: isClub ? 600 : 500 }}>{eq.pj}</span>
              <span style={{ ...S.stat, color: isClub ? "#ffffff" : "#d1d5db", fontWeight: isClub ? 600 : 500 }}>{eq.pg}</span>
              <span style={{ ...S.stat, color: isClub ? "#ffffff" : "#d1d5db", fontWeight: isClub ? 600 : 500 }}>{eq.pe}</span>
              <span style={{ ...S.stat, color: isClub ? "#ffffff" : "#d1d5db", fontWeight: isClub ? 600 : 500 }}>{eq.pp}</span>
              <span style={{ ...S.stat, color: isClub ? "#ffffff" : "#d1d5db", fontWeight: isClub ? 600 : 500 }}>{dgLabel(eq.dg)}</span>
              
              {/* Celda de puntos, gris para los demás, roja para el club, o roja para todos si prefieres. Aquí la dejé roja para todos como indicador visual fuerte. */}
              <span style={{ ...S.pts, background: isClub ? "#e84e5e" : "#c0061b" }}>{eq.pts}</span>
            </div>
          );
        })}

        {/* Leyenda */}
        <div style={S.legend}>
          <div style={S.legItem}>
            <div style={{ ...S.legDot, background: "#00c87a" }} />
            <span style={S.legText}>{cat.greenLegend ?? "Clasificados playoffs"}</span>
          </div>
          {cat.yellowLegend && (
            <div style={S.legItem}>
              <div style={{ ...S.legDot, background: "#f5a623" }} />
              <span style={S.legText}>{cat.yellowLegend}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <span style={S.footTrn}>{cat.tournament}</span>
          <span style={S.footHdl}><span style={S.footAt}>@</span>todobarrionorte</span>
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-5 text-center">
        Imagen exportada a 2× resolución (~1120 px).
      </p>
    </div>
  );
}