// lib/historialMatches.js
//
// ÚNICA FUENTE DE VERDAD para partidos históricos de Primera Masculina.
//
// Importado por:
//   · app/api/historial/route.js  → calcula stats y devuelve matches al cliente
//   · (el cliente usa los matches que le devuelve la API, no duplica nada)
//
// Campo `order`: número entero creciente = orden cronológico ascendente.
// La API invierte el orden para el modal (más reciente primero).
//
// Convenio de score: siempre "Casa - Visita"
//   condition "Local"    → BN = parte[0], rival = parte[1]
//   condition "Visitante"→ BN = parte[1], rival = parte[0]
//
// ─────────────────────────────────────────────────────────────────────────────
// CÓMO AÑADIR UN TORNEO NUEVO:
//   1. Agregá sus partidos aquí con `order` mayor al último existente.
//   2. Listo. El route y el modal los toman automáticamente.
//
// TORNEOS DINÁMICOS (en curso, con JSON en data/local/):
//   El route lee data/local/{año}/{id}/masculino-results.json automáticamente
//   para cualquier torneo cuyo `id` NO esté en STATIC_TOURNAMENT_IDS.
//   Cuando un torneo termina, pasá sus partidos aquí y borrá el JSON.
// ─────────────────────────────────────────────────────────────────────────────

export const MATCHES = [

  // ── SUPERCOPA ENTRE RÍOS 2023 ─────────────────────────────────────────────
  { order: 101, torneo: "Supercopa Entre Ríos 2023",       rival: "Juventud Unida",        condition: "Local",     score: "2 - 1", date: "04/12/23" },
  { order: 102, torneo: "Supercopa Entre Ríos 2023",       rival: "Gualeguay Central",     condition: "Local",     score: "3 - 2", date: "11/12/23" },
  { order: 103, torneo: "Supercopa Entre Ríos 2023",       rival: "Deportivo Urdinarrain", condition: "Visitante", score: "1 - 0", date: "17/12/23" },
  { order: 104, torneo: "Supercopa Entre Ríos 2023",       rival: "Juventud Unida",        condition: "Visitante", score: "2 - 0", date: "08/01/24" },
  { order: 105, torneo: "Supercopa Entre Ríos 2023",       rival: "Gualeguay Central",     condition: "Visitante", score: "0 - 2", date: "15/01/24" },
  { order: 106, torneo: "Supercopa Entre Ríos 2023",       rival: "Deportivo Urdinarrain", condition: "Local",     score: "1 - 0", date: "22/01/24" },
  { order: 107, torneo: "Supercopa Entre Ríos 2023",       rival: "Ferrocarril (Chajarí)", condition: "Visitante", score: "1 - 1", date: "05/02/24" },
  { order: 108, torneo: "Supercopa Entre Ríos 2023",       rival: "Ferrocarril (Chajarí)", condition: "Local",     score: "1 - 0", date: "12/02/24" },
  { order: 109, torneo: "Supercopa Entre Ríos 2023",       rival: "Libertad (Concordia)",  condition: "Visitante", score: "2 - 1", date: "19/02/24" },
  { order: 110, torneo: "Supercopa Entre Ríos 2023",       rival: "Libertad (Concordia)",  condition: "Local",     score: "1 - 2", date: "26/02/24" },

  // ── OFICIAL 2023 ──────────────────────────────────────────────────────────
  { order: 201, torneo: "Oficial 2023",                    rival: "Libertad",              condition: "Visitante", score: "3 - 1", date: "16/04/23" },
  { order: 202, torneo: "Oficial 2023",                    rival: "Urquiza",               condition: "Local",     score: "3 - 0", date: "23/04/23" },
  { order: 203, torneo: "Oficial 2023",                    rival: "La Academia",           condition: "Local",     score: "2 - 2", date: "30/04/23" },
  { order: 204, torneo: "Oficial 2023",                    rival: "El Progreso",           condition: "Visitante", score: "0 - 2", date: "14/05/23" },
  { order: 205, torneo: "Oficial 2023",                    rival: "Gualeguay Central",     condition: "Local",     score: "2 - 0", date: "01/06/23" },
  { order: 206, torneo: "Oficial 2023",                    rival: "Juventud",              condition: "Visitante", score: "1 - 1", date: "01/06/23" },
  { order: 207, torneo: "Oficial 2023",                    rival: "Quilmes",               condition: "Local",     score: "0 - 0", date: "01/06/23" },
  { order: 208, torneo: "Oficial 2023",                    rival: "Sociedad Sportiva",     condition: "Visitante", score: "1 - 0", date: "01/06/23" },
  { order: 209, torneo: "Oficial 2023",                    rival: "Bancario",              condition: "Visitante", score: "0 - 1", date: "02/07/23" },
  { order: 210, torneo: "Oficial 2023",                    rival: "Libertad",              condition: "Local",     score: "0 - 1", date: "09/07/23" },
  { order: 211, torneo: "Oficial 2023",                    rival: "Urquiza",               condition: "Visitante", score: "1 - 0", date: "23/07/23" },
  { order: 212, torneo: "Oficial 2023",                    rival: "La Academia",           condition: "Visitante", score: "1 - 5", date: "30/07/23" },
  { order: 213, torneo: "Oficial 2023",                    rival: "El Progreso",           condition: "Local",     score: "1 - 1", date: "06/08/23" },
  { order: 214, torneo: "Oficial 2023",                    rival: "Gualeguay Central",     condition: "Visitante", score: "2 - 0", date: "20/08/23" },
  { order: 215, torneo: "Oficial 2023",                    rival: "Juventud",              condition: "Local",     score: "2 - 4", date: "27/08/23" },
  { order: 216, torneo: "Oficial 2023",                    rival: "Quilmes",               condition: "Visitante", score: "0 - 1", date: "10/09/23" },
  { order: 217, torneo: "Oficial 2023",                    rival: "Sociedad Sportiva",     condition: "Local",     score: "0 - 2", date: "17/09/23" },
  { order: 218, torneo: "Oficial 2023",                    rival: "Bancario",              condition: "Local",     score: "1 - 0", date: "23/09/23" },
  { order: 219, torneo: "Oficial 2023 · Repechaje",        rival: "Urquiza",               condition: "Visitante", score: "1 - 1", date: "27/09/23" },
  { order: 220, torneo: "Oficial 2023 · Repechaje",        rival: "Gualeguay Central",     condition: "Visitante", score: "0 - 0", date: "01/10/23" },

  // ── PREPARACIÓN 2024 ──────────────────────────────────────────────────────
  { order: 301, torneo: "Preparación 2024",                rival: "Urquiza",               condition: "Local",     score: "0 - 1", date: "17/01/24" },
  { order: 302, torneo: "Preparación 2024",                rival: "Juventud",              condition: "Visitante", score: "0 - 1", date: "22/01/24" },
  { order: 303, torneo: "Preparación 2024",                rival: "Quilmes",               condition: "Local",     score: "1 - 0", date: "30/01/24" },
  { order: 304, torneo: "Preparación 2024",                rival: "El Progreso",           condition: "Visitante", score: "4 - 1", date: "05/02/24" },
  { order: 305, torneo: "Preparación 2024 · Semifinal",   rival: "Sociedad Sportiva",     condition: "Local",     score: "1 - 1", date: "14/02/24" },
  { order: 306, torneo: "Preparación 2024 · Final",       rival: "Gualeguay Central",     condition: "Visitante", score: "0 - 0", date: "16/02/24" },

  // ── OFICIAL 2024 ──────────────────────────────────────────────────────────
  { order: 401, torneo: "Oficial 2024",                    rival: "Urquiza",               condition: "Visitante", score: "0 - 1", date: "12/05/24" },
  { order: 402, torneo: "Oficial 2024",                    rival: "Libertad",              condition: "Local",     score: "3 - 1", date: "19/05/24" },
  { order: 403, torneo: "Oficial 2024",                    rival: "Sociedad Sportiva",     condition: "Local",     score: "0 - 0", date: "26/05/24" },
  { order: 404, torneo: "Oficial 2024",                    rival: "Bancario",              condition: "Visitante", score: "1 - 3", date: "02/06/24" },
  { order: 405, torneo: "Oficial 2024",                    rival: "Quilmes",               condition: "Visitante", score: "0 - 1", date: "09/06/24" },
  { order: 406, torneo: "Oficial 2024",                    rival: "El Progreso",           condition: "Local",     score: "3 - 3", date: "16/06/24" },
  { order: 407, torneo: "Oficial 2024",                    rival: "La Academia",           condition: "Visitante", score: "1 - 0", date: "23/06/24" },
  { order: 408, torneo: "Oficial 2024",                    rival: "Juventud",              condition: "Visitante", score: "2 - 3", date: "30/06/24" },
  { order: 409, torneo: "Oficial 2024",                    rival: "Gualeguay Central",     condition: "Local",     score: "0 - 2", date: "07/07/24" },
  { order: 410, torneo: "Oficial 2024",                    rival: "Urquiza",               condition: "Local",     score: "2 - 2", date: "14/07/24" },
  { order: 411, torneo: "Oficial 2024",                    rival: "Libertad",              condition: "Visitante", score: "1 - 1", date: "21/07/24" },
  { order: 412, torneo: "Oficial 2024",                    rival: "Sociedad Sportiva",     condition: "Visitante", score: "1 - 0", date: "28/07/24" },
  { order: 413, torneo: "Oficial 2024",                    rival: "Bancario",              condition: "Local",     score: "4 - 2", date: "04/08/24" },
  { order: 414, torneo: "Oficial 2024",                    rival: "Quilmes",               condition: "Local",     score: "3 - 0", date: "11/08/24" },
  { order: 415, torneo: "Oficial 2024",                    rival: "El Progreso",           condition: "Visitante", score: "1 - 2", date: "18/08/24" },
  { order: 416, torneo: "Oficial 2024",                    rival: "La Academia",           condition: "Local",     score: "1 - 0", date: "25/08/24" },
  { order: 417, torneo: "Oficial 2024",                    rival: "Juventud",              condition: "Local",     score: "5 - 1", date: "08/09/24" },
  { order: 418, torneo: "Oficial 2024",                    rival: "Gualeguay Central",     condition: "Visitante", score: "2 - 2", date: "15/09/24" },
  { order: 419, torneo: "Oficial 2024 · Repechaje",       rival: "El Progreso",           condition: "Local",     score: "1 - 0", date: "18/09/24" },
  { order: 420, torneo: "Oficial 2024 · Repechaje",       rival: "Quilmes",               condition: "Local",     score: "2 - 0", date: "22/09/24" },
  { order: 421, torneo: "Oficial 2024 · Petit",           rival: "Libertad",              condition: "Visitante", score: "1 - 0", date: "06/10/24" },
  { order: 422, torneo: "Oficial 2024 · Petit",           rival: "Urquiza",               condition: "Local",     score: "3 - 2", date: "20/10/24" },
  { order: 423, torneo: "Oficial 2024 · Petit",           rival: "Sociedad Sportiva",     condition: "Visitante", score: "1 - 1", date: "27/10/24" },
  { order: 424, torneo: "Oficial 2024 · Petit",           rival: "Libertad",              condition: "Local",     score: "1 - 1", date: "03/11/24" },
  { order: 425, torneo: "Oficial 2024 · Petit",           rival: "Urquiza",               condition: "Visitante", score: "0 - 2", date: "10/11/24" },
  { order: 426, torneo: "Oficial 2024 · Petit",           rival: "Sociedad Sportiva",     condition: "Local",     score: "4 - 1", date: "18/11/24" },

  // ── PREPARACIÓN 2025 ──────────────────────────────────────────────────────
  { order: 501, torneo: "Preparación 2025",                rival: "Gualeguay Central",     condition: "Visitante", score: "1 - 2", date: "08/01/25" },
  { order: 502, torneo: "Preparación 2025",                rival: "La Academia",           condition: "Local",     score: "0 - 0", date: "10/01/25" },
  { order: 503, torneo: "Preparación 2025",                rival: "Libertad",              condition: "Visitante", score: "4 - 3", date: "21/01/25" },

  // ── OFICIAL 2025 ──────────────────────────────────────────────────────────
  { order: 601, torneo: "Oficial 2025",                    rival: "Bancario",              condition: "Local",     score: "2 - 1", date: "06/04/25" },
  { order: 602, torneo: "Oficial 2025",                    rival: "La Academia",           condition: "Local",     score: "0 - 2", date: "13/04/25" },
  { order: 603, torneo: "Oficial 2025",                    rival: "Urquiza",               condition: "Visitante", score: "3 - 1", date: "20/04/25" },
  { order: 604, torneo: "Oficial 2025",                    rival: "Gualeguay Central",     condition: "Local",     score: "1 - 0", date: "27/04/25" },
  { order: 605, torneo: "Oficial 2025",                    rival: "Sociedad Sportiva",     condition: "Visitante", score: "3 - 0", date: "04/05/25" },
  { order: 606, torneo: "Oficial 2025",                    rival: "Libertad",              condition: "Local",     score: "2 - 2", date: "11/05/25" },
  { order: 607, torneo: "Oficial 2025",                    rival: "Quilmes",               condition: "Visitante", score: "1 - 3", date: "25/05/25" },
  { order: 608, torneo: "Oficial 2025",                    rival: "Juventud",              condition: "Local",     score: "0 - 0", date: "01/06/25" },
  { order: 609, torneo: "Oficial 2025",                    rival: "El Progreso",           condition: "Visitante", score: "1 - 1", date: "08/06/25" },
  { order: 610, torneo: "Oficial 2025",                    rival: "Bancario",              condition: "Visitante", score: "0 - 1", date: "06/06/25" },
  { order: 611, torneo: "Oficial 2025",                    rival: "La Academia",           condition: "Visitante", score: "0 - 0", date: "22/06/25" },
  { order: 612, torneo: "Oficial 2025",                    rival: "Urquiza",               condition: "Local",     score: "2 - 0", date: "29/06/25" },
  { order: 613, torneo: "Oficial 2025",                    rival: "Gualeguay Central",     condition: "Visitante", score: "0 - 1", date: "05/07/25" },
  { order: 614, torneo: "Oficial 2025",                    rival: "Sociedad Sportiva",     condition: "Local",     score: "2 - 1", date: "13/07/25" },
  { order: 615, torneo: "Oficial 2025",                    rival: "Libertad",              condition: "Visitante", score: "1 - 0", date: "20/07/25" },
  { order: 616, torneo: "Oficial 2025",                    rival: "Quilmes",               condition: "Local",     score: "2 - 2", date: "03/08/25" },
  { order: 617, torneo: "Oficial 2025",                    rival: "Juventud",              condition: "Visitante", score: "3 - 2", date: "10/08/25" },
  { order: 618, torneo: "Oficial 2025",                    rival: "El Progreso",           condition: "Local",     score: "5 - 1", date: "17/08/25" },
  { order: 619, torneo: "Oficial 2025 · Petit",           rival: "Sociedad Sportiva",     condition: "Visitante", score: "2 - 1", date: "07/09/25" },
  { order: 620, torneo: "Oficial 2025 · Petit",           rival: "La Academia",           condition: "Local",     score: "3 - 3", date: "14/09/25" },
  { order: 621, torneo: "Oficial 2025 · Petit",           rival: "Juventud",              condition: "Visitante", score: "2 - 3", date: "21/09/25" },
  { order: 622, torneo: "Oficial 2025 · Petit",           rival: "Sociedad Sportiva",     condition: "Local",     score: "0 - 1", date: "28/09/25" },
  { order: 623, torneo: "Oficial 2025 · Petit",           rival: "La Academia",           condition: "Visitante", score: "1 - 0", date: "12/10/25" },

  // ── PREPARACIÓN 2026 ──────────────────────────────────────────────────────
  { order: 701, torneo: "Preparación 2026",                rival: "La Academia",           condition: "Local",     score: "3 - 1", date: "28/01/26" },
  { order: 702, torneo: "Preparación 2026",                rival: "Gualeguay Central",     condition: "Visitante", score: "0 - 1", date: "04/02/26" },
  { order: 703, torneo: "Preparación 2026",                rival: "Bancario",              condition: "Visitante", score: "0 - 1", date: "09/02/26" },
  { order: 704, torneo: "Preparación 2026",                rival: "Juventud",              condition: "Visitante", score: "1 - 4", date: "12/02/26" },
  { order: 705, torneo: "Preparación 2026",                rival: "Sociedad Sportiva",     condition: "Local",     score: "1 - 2", date: "25/02/26" },

  // ── OFICIAL 2026 ──────────────────────────────────────────────────────────
  // Partidos leídos de data/local/2026/oficial-2026/masculino-results.json
  // Cuando termine el torneo: pasá los partidos aquí con order: 801, 802, ...
  // y borrá el JSON. El route deja de leerlo automáticamente.
];

// IDs de torneos ya incluidos arriba (el route NO los lee del JSON para evitar duplicados)
export const STATIC_TOURNAMENT_IDS = new Set([
  "supercopa-entre-rios-2023",
  "oficial-2023",
  "preparacion-2024",
  "oficial-2024",
  "preparacion-2025",
  "oficial-2025",
  "preparacion-2026",
  // "oficial-2026" NO está aquí → se lee dinámicamente del JSON con order: 800+
]);

// Etiqueta legible para el modal (mapea id de carpeta → string display)
export const TOURNAMENT_LABELS = {
  "oficial-2026":      "Oficial 2026",
  "oficial-2027":      "Oficial 2027",
  "preparacion-2027":  "Preparación 2027",
  // Añadí entradas nuevas aquí cuando crees torneos futuros dinámicos
};