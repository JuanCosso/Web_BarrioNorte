// app/tabla-imagen/page.jsx
//
// SETUP (una sola vez):  npm install html-to-image
// URL:                   http://localhost:3000/tabla-imagen

import TablaImagenClient from "./TablaImagenClient";

// ── Primera División ──────────────────────────────────────────────────────────
import ligaMascData from "@/data/local/2026/oficial-2026/oficial_2026_liga.json";
import ligaFemData  from "@/data/local/2026/oficial-2026-fem/fem_oficial_2026_liga.json";

// ── Inferiores 2026 ───────────────────────────────────────────────────────────
import terceraData from "@/data/local/2026/tercera-oficial-2026/inf_tercera_2026.json";
import cuartaData  from "@/data/local/2026/cuarta-oficial-2026/inf_cuarta_2026.json";
import quintaData  from "@/data/local/2026/quinta-oficial-2026/inf_quinta_2026.json";
import sextaData   from "@/data/local/2026/sexta-oficial-2026/inf_sexta_2026.json";
import septimaData from "@/data/local/2026/septima-oficial-2026/inf_septima_2026.json";

// ── Infantiles 2026 ───────────────────────────────────────────────────────────
import catAData from "@/data/local/2026/cat_a-oficial-2026/inf_cat_a_2026.json";
import catBData from "@/data/local/2026/cat_b-oficial-2026/inf_cat_b_2026.json";
import catCData from "@/data/local/2026/cat_c-oficial-2026/inf_cat_c_2026.json";
import catDData from "@/data/local/2026/cat_d-oficial-2026/inf_cat_d_2026.json";

const CATEGORIAS = {

  // ── Primera División ────────────────────────────────────────────────────────
  primera_masc: {
    division:     "Primera División",
    badge:        "Masculino",
    tournament:   "Torneo Oficial 2026",
    scheme:       "liga",        // top 3 verde · 4-7 amarillo
    greenLegend:  "Petit Torneo",
    yellowLegend: "Repechaje",
    equipos:      ligaMascData.equipos,
  },
  primera_fem: {
    division:    "Primera División",
    badge:       "Femenino",
    tournament:  "Torneo Oficial 2026",
    scheme:      "fem2026",      // top 4 verde · sin amarillo
    greenLegend: "Playoffs",
    equipos:     ligaFemData.equipos,
  },

  // ── Inferiores — top4: solo los primeros 4 en verde, sin amarillo ───────────
  tercera: {
    division:    "Tercera División",
    badge:       "Inferiores",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     terceraData.equipos,
  },
  cuarta: {
    division:    "Cuarta División",
    badge:       "Inferiores",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     cuartaData.equipos,
  },
  quinta: {
    division:    "Quinta División",
    badge:       "Inferiores",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     quintaData.equipos,
  },
  sexta: {
    division:    "Sexta División",
    badge:       "Inferiores",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     sextaData.equipos,
  },
  septima: {
    division:    "Séptima División",
    badge:       "Inferiores",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     septimaData.equipos,
  },

  // ── Infantiles — top4: solo los primeros 4 en verde, sin amarillo ───────────
  cat_a: {
    division:    "Categoría A (2015)",
    badge:       "Infantiles",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     catAData.equipos,
  },
  cat_b: {
    division:    "Categoría B (2016)",
    badge:       "Infantiles",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     catBData.equipos,
  },
  cat_c: {
    division:    "Categoría C (2017)",
    badge:       "Infantiles",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     catCData.equipos,
  },
  cat_d: {
    division:    "Categoría D (2018)",
    badge:       "Infantiles",
    tournament:  "Torneo Oficial 2026",
    scheme:      "top4",
    greenLegend: "Playoffs",
    equipos:     catDData.equipos,
  },
};

export default function TablaImagenPage() {
  return <TablaImagenClient categorias={CATEGORIAS} />;
}