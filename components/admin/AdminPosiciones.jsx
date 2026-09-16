"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminPosiciones({ context, selectedYear = "2026", onSelectYear }) {
  const { teams = [], tournaments = [] } = context || {};

  const availableYears = Array.from(
    new Set(tournaments.map((t) => t.seasonId).filter(Boolean))
  ).sort().reverse();

  const activeYear = selectedYear || "2026";

  const filteredTournaments =
    activeYear === "ALL"
      ? tournaments
      : tournaments.filter((t) => t.seasonId === activeYear);

  const [selectedTournament, setSelectedTournament] = useState(
    filteredTournaments[0]?.id || tournaments[0]?.id || "oficial-2026"
  );
  const [selectedPhaseSlug, setSelectedPhaseSlug] = useState("fase-regular");
  const [phaseData, setPhaseData] = useState(null);

  // Modo: "table" (puntos) vs "bracket" (cruces eliminatorios / playoffs / repechaje)
  const isBracketPhase =
    selectedPhaseSlug === "repechaje" ||
    selectedPhaseSlug === "playoffs" ||
    selectedPhaseSlug === "petit-playoffs" ||
    selectedPhaseSlug === "finales" ||
    selectedPhaseSlug.includes("eliminatoria");

  const [viewModeOverride, setViewModeOverride] = useState(null);
  const currentMode =
    viewModeOverride !== null ? viewModeOverride : isBracketPhase ? "bracket" : "table";

  // Estados de Tabla de Posiciones
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApplyResultsModal, setShowApplyResultsModal] = useState(false);
  const [incrementalMatches, setIncrementalMatches] = useState([{ homeTeamId: "", homeScore: "", awayScore: "", awayTeamId: "" }]);
  const [toast, setToast] = useState(null);
  const [selectedTeamToAdd, setSelectedTeamToAdd] = useState("");

  // Estados de Cruces Eliminatorios / Bracket
  const [duels, setDuels] = useState([]);
  const [bracketFootnote, setBracketFootnote] = useState("");
  const [loadingCruces, setLoadingCruces] = useState(false);
  const [savingCruces, setSavingCruces] = useState(false);

  // Al cambiar el año, asegurar que el torneo seleccionado pertenezca al año
  useEffect(() => {
    if (filteredTournaments.length > 0) {
      const exists = filteredTournaments.some((t) => t.id === selectedTournament);
      if (!exists) {
        setSelectedTournament(filteredTournaments[0].id);
      }
    }
  }, [activeYear, filteredTournaments, selectedTournament]);

  const currentTour = tournaments.find((t) => t.id === selectedTournament);
  const phases = currentTour?.phases || [];

  // Al cambiar de torneo, resetear la fase al primer slug disponible
  useEffect(() => {
    if (phases.length > 0) {
      setSelectedPhaseSlug(phases[0].slug);
    } else {
      setSelectedPhaseSlug("fase-regular");
    }
  }, [selectedTournament, phases]);

  // Al cambiar torneo o fase, resetear el override de vista
  useEffect(() => {
    setViewModeOverride(null);
  }, [selectedTournament, selectedPhaseSlug]);

  // Cargar tabla desde API
  const fetchStandings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/posiciones?tournamentId=${selectedTournament}&phaseSlug=${selectedPhaseSlug}`
      );
      const data = await res.json();
      setPhaseData(data.phase);
      if (data.rows) {
        const sorted = [...data.rows].sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.dg !== a.dg) return b.dg - a.dg;
          if (b.gf !== a.gf) return b.gf - a.gf;
          return (b.pg || 0) - (a.pg || 0);
        });
        setRows(
          sorted.map((r, idx) => ({
            ...r,
            position: idx + 1,
            pointAdjustment: r.pointAdjustment || 0,
          }))
        );
      }
    } catch (err) {
      console.error("Error cargando posiciones:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar cruces eliminatorios desde API
  const fetchCruces = async () => {
    setLoadingCruces(true);
    try {
      const res = await fetch(
        `/api/admin/cruces?tournamentId=${encodeURIComponent(selectedTournament)}&phaseSlug=${encodeURIComponent(selectedPhaseSlug)}`
      );
      if (res.ok) {
        const data = await res.json();
        setDuels(data.duels || []);
        setBracketFootnote(data.footnote || "");
        if (data.phaseId) {
          setPhaseData((prev) => ({ ...prev, id: data.phaseId }));
        }
      }
    } catch (err) {
      console.error("Error cargando cruces:", err);
    } finally {
      setLoadingCruces(false);
    }
  };

  useEffect(() => {
    if (currentMode === "bracket") {
      fetchCruces();
    } else {
      fetchStandings();
    }
  }, [selectedTournament, selectedPhaseSlug, currentMode]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // --- MÉTODOS DE TABLA DE POSICIONES ---
  const handleCellChange = (index, field, value) => {
    const num = parseInt(value, 10);
    const val = isNaN(num) ? 0 : Math.max(0, num);

    setRows((prev) => {
      const copy = [...prev];
      const row = { ...copy[index], [field]: val };

      const pg = field === "pg" ? val : row.pg || 0;
      const pe = field === "pe" ? val : row.pe || 0;
      const pp = field === "pp" ? val : row.pp || 0;
      const gf = field === "gf" ? val : row.gf || 0;
      const gc = field === "gc" ? val : row.gc || 0;
      const adj = field === "pointAdjustment" ? num : row.pointAdjustment || 0;

      row.pj = pg + pe + pp;
      row.dg = gf - gc;
      row.pts = pg * 3 + pe + (isNaN(adj) ? 0 : adj);

      copy[index] = row;
      return copy;
    });
  };

  const handleSortAuto = () => {
    const sorted = [...rows].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg !== a.dg) return b.dg - a.dg;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return b.pg - a.pg;
    });

    const renumbered = sorted.map((row, idx) => ({
      ...row,
      position: idx + 1,
    }));

    setRows(renumbered);
    showToast("Tabla reordenada por Puntos, Diferencia de Gol y Goles a Favor.");
  };

  const handleApplyIncrementalResults = () => {
    for (const m of incrementalMatches) {
       if (!m.homeTeamId || !m.awayTeamId || m.homeScore === "" || m.awayScore === "") {
          alert("Por favor completa todos los campos de los resultados que agregaste.");
          return;
       }
       if (m.homeTeamId === m.awayTeamId) {
          alert("Un equipo no puede jugar contra sí mismo.");
          return;
       }
    }

    const newRows = [...rows];
    const updateStats = (teamId, gf, gc) => {
       const idx = newRows.findIndex(r => r.teamId === teamId);
       if (idx === -1) return;
       const r = { ...newRows[idx] };
       r.pj = (parseInt(r.pj)||0) + 1;
       r.gf = (parseInt(r.gf)||0) + gf;
       r.gc = (parseInt(r.gc)||0) + gc;
       r.dg = r.gf - r.gc;
       if (gf > gc) { r.pg = (parseInt(r.pg)||0) + 1; r.pts = (parseInt(r.pts)||0) + 3; }
       else if (gf === gc) { r.pe = (parseInt(r.pe)||0) + 1; r.pts = (parseInt(r.pts)||0) + 1; }
       else { r.pp = (parseInt(r.pp)||0) + 1; }
       newRows[idx] = r;
    };

    for (const m of incrementalMatches) {
       const hs = parseInt(m.homeScore);
       const as = parseInt(m.awayScore);
       updateStats(m.homeTeamId, hs, as);
       updateStats(m.awayTeamId, as, hs);
    }

    newRows.sort((a, b) => {
      const pA = parseInt(a.pts) || 0;
      const pB = parseInt(b.pts) || 0;
      if (pB !== pA) return pB - pA;
      const dgA = parseInt(a.dg) || 0;
      const dgB = parseInt(b.dg) || 0;
      if (dgB !== dgA) return dgB - dgA;
      const gfA = parseInt(a.gf) || 0;
      const gfB = parseInt(b.gf) || 0;
      return gfB - gfA;
    });

    setRows(newRows);
    setShowApplyResultsModal(false);
    setIncrementalMatches([{ homeTeamId: "", homeScore: "", awayScore: "", awayTeamId: "" }]);
    showToast("Resultados aplicados. Revisa la tabla y presiona 'Guardar Tabla Completa'.");
  };

  const handleAddTeam = () => {
    if (!selectedTeamToAdd) return;
    const team = teams.find((t) => t.id === selectedTeamToAdd);
    if (!team) return;

    if (rows.some((r) => r.teamId === team.id)) {
      alert("Este equipo ya está presente en la tabla.");
      return;
    }

    const newRow = {
      id: `temp-${Date.now()}`,
      teamId: team.id,
      team,
      position: rows.length + 1,
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      dg: 0,
      pts: 0,
      pointAdjustment: 0,
      notes: "",
    };

    setRows((prev) => [...prev, newRow]);
    setSelectedTeamToAdd("");
  };

  const handleRemoveRow = async (index, teamName, rowId) => {
    if (!confirm(`¿Quitar a "${teamName}" de esta tabla?`)) return;

    if (rowId && !rowId.startsWith("temp-")) {
      try {
        await fetch(`/api/admin/posiciones?id=${rowId}`, { method: "DELETE" });
      } catch (e) {
        console.warn("Aviso al eliminar:", e);
      }
    }

    setRows((prev) => {
      const copy = prev.filter((_, i) => i !== index);
      return copy.map((r, i) => ({ ...r, position: i + 1 }));
    });
    showToast(`"${teamName}" removido de la tabla.`);
  };

  const handleSaveTable = async () => {
    if (!phaseData?.id) {
      alert("No se encontró la fase correspondiente en la base de datos.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/posiciones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phaseId: phaseData.id,
          rows: rows.map((r, i) => ({
            teamId: r.teamId,
            position: i + 1,
            pj: r.pj,
            pg: r.pg,
            pe: r.pe,
            pp: r.pp,
            gf: r.gf,
            gc: r.gc,
            dg: r.dg,
            pts: r.pts,
            pointAdjustment: r.pointAdjustment || 0,
            notes: r.notes || null,
          })),
        }),
      });

      if (res.ok) {
        showToast("Tabla de posiciones guardada con éxito en Neon DB.");
        fetchStandings();
      } else {
        const err = await res.json();
        alert(err.error || "No se pudo guardar la tabla");
      }
    } catch (err) {
      alert("Error de red al guardar la tabla");
    } finally {
      setSaving(false);
    }
  };

  // --- MÉTODOS DE CRUCES ELIMINATORIOS / BRACKET ---
  const isSeriesDefault =
    selectedPhaseSlug === "finales" ||
    selectedPhaseSlug === "playoffs" ||
    selectedTournament.includes("cuarta") ||
    selectedTournament.includes("quinta") ||
    selectedTournament.includes("sexta") ||
    selectedTournament.includes("septima") ||
    selectedTournament.includes("tercera");

  const handleAddDuel = () => {
    const defaultEtapa =
      duels.length === 0 ? "Semifinal 1" : duels.length === 1 ? "Semifinal 2" : "Final";

    setDuels((prev) => [
      ...prev,
      {
        id: `duel-${Date.now()}`,
        etapa: defaultEtapa,
        format: isSeriesDefault ? "series" : "single",
        equipo1: teams[0]?.name || "Barrio Norte",
        equipo2: teams[1]?.name || "Sociedad Sportiva",
        score1: "0",
        score2: "0",
        ida1: "",
        ida2: "",
        vuelta1: "",
        vuelta2: "",
        penales1: "",
        penales2: "",
      },
    ]);
  };

  const handleDuelChange = (index, field, value) => {
    setDuels((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveDuel = (index) => {
    setDuels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLoadTemplateDuels = () => {
    const defaultFormat = isSeriesDefault ? "series" : "single";
    setDuels([
      {
        id: `duel-s1-${Date.now()}`,
        etapa: "Semifinal 1",
        format: defaultFormat,
        equipo1: "Barrio Norte",
        equipo2: "Sociedad Sportiva",
        score1: "1",
        score2: "0",
        ida1: "1",
        ida2: "0",
        vuelta1: "0",
        vuelta2: "0",
        penales1: "",
        penales2: "",
      },
      {
        id: `duel-s2-${Date.now()}`,
        etapa: "Semifinal 2",
        format: defaultFormat,
        equipo1: "Urquiza",
        equipo2: "Libertad",
        score1: "1",
        score2: "1",
        ida1: "1",
        ida2: "1",
        vuelta1: "0",
        vuelta2: "0",
        penales1: "4",
        penales2: "3",
      },
      {
        id: `duel-fn-${Date.now()}`,
        etapa: "Final",
        format: defaultFormat,
        equipo1: "Barrio Norte",
        equipo2: "Urquiza",
        score1: "2",
        score2: "1",
        ida1: "1",
        ida2: "1",
        vuelta1: "1",
        vuelta2: "0",
        penales1: "",
        penales2: "",
      },
    ]);
    if (!bracketFootnote) {
      setBracketFootnote(
        selectedPhaseSlug === "repechaje"
          ? "Serie clasificatoria al Petit Torneo."
          : "Series ida y vuelta. En caso de igualdad en el global define definición por penales."
      );
    }
    showToast("Plantilla base de cruces eliminatorios (ida y vuelta) cargada.");
  };

  const handleSaveCruces = async () => {
    setSavingCruces(true);
    try {
      const res = await fetch("/api/admin/cruces", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId: selectedTournament,
          phaseSlug: selectedPhaseSlug,
          duels,
          footnote: bracketFootnote,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Cruces eliminatorios guardados exitosamente en Neon DB y local.");
        fetchCruces();
      } else {
        alert(data.error || "Error al guardar cruces.");
      }
    } catch (err) {
      alert("Error de red al guardar cruces.");
    } finally {
      setSavingCruces(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span>✓</span> {toast}
        </div>
      )}

      {currentMode === "bracket" && (
        <div className="bg-amber-950/30 border border-amber-800/60 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200/90 shadow">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏆</span>
            <div>
              <p className="font-bold text-amber-300 text-xs sm:text-sm">
                Editor de Cruces y Fases Eliminatorias ({selectedPhaseSlug === "repechaje" ? "Repechaje" : "Semifinales / Finales"}):
              </p>
              <p className="text-neutral-300 text-[11px] mt-0.5">
                Configura duelos directos con series de ida y vuelta o partido único, y definición por penales.
              </p>
            </div>
          </div>
          <span className="bg-amber-900/60 border border-amber-700/80 text-amber-300 font-bold px-2.5 py-0.5 rounded-lg text-xs whitespace-nowrap self-start sm:self-auto">
            Fase Eliminatoria
          </span>
        </div>
      )}

      {/* Selector de Torneo, Fase, Año y Modo */}
      <div className="bg-neutral-900/90 border border-neutral-800/90 p-4 rounded-xl shadow-lg flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1">
          {/* Año */}
          <div>
            <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1 tracking-wider">
              Año
            </label>
            <select
              value={activeYear}
              onChange={(e) => onSelectYear && onSelectYear(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600 font-bold"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
              <option value="ALL">Todos los años</option>
            </select>
          </div>

          {/* Torneo */}
          <div>
            <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1 tracking-wider">
              Torneo
            </label>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600 font-bold"
            >
              {filteredTournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fase */}
          <div>
            <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1 tracking-wider">
              Fase del Torneo
            </label>
            <select
              value={selectedPhaseSlug}
              onChange={(e) => setSelectedPhaseSlug(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600 font-bold"
            >
              {phases.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name} {p.slug === "repechaje" ? "(Repechaje)" : p.slug === "playoffs" ? "(Playoffs)" : p.slug === "finales" ? "(Ida/Vuelta)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle de Modo (Tabla vs Cruces) & Acciones */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {/* Switch de modo */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setViewModeOverride("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentMode === "table"
                  ? "bg-red-600 text-white shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              📊 Tabla de Puntos
            </button>
            <button
              onClick={() => setViewModeOverride("bracket")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentMode === "bracket"
                  ? "bg-amber-600 text-white shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              🏆 Cruces Eliminatorios
            </button>
          </div>

          {currentMode === "bracket" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddDuel}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl transition-colors border border-neutral-700 shadow"
              >
                + Agregar Cruce
              </button>
              <button
                onClick={handleSaveCruces}
                disabled={savingCruces || loadingCruces}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                <span>💾</span> {savingCruces ? "Guardando..." : "Guardar Cruces"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowApplyResultsModal(true)}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs rounded-xl transition-colors border border-amber-800/60 shadow flex items-center gap-1.5"
                title="Aplica resultados a la tabla actual (Sumar puntos, goles, etc)"
              >
                <span>📝</span> Aplicar Resultados
              </button>
              <button
                onClick={handleSortAuto}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl transition-colors border border-neutral-700 shadow"
              >
                <span>⇅</span> Ordenar
              </button>
              <button
                onClick={handleSaveTable}
                disabled={saving}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? "Guardando..." : "Guardar Tabla"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VISTA 1: CRUCES ELIMINATORIOS / BRACKET (REPECHAJE, PLAYOFFS) */}
      {/* ======================================================== */}
      {currentMode === "bracket" ? (
        <div className="space-y-6">
          {loadingCruces ? (
            <div className="py-24 text-center text-neutral-500 font-bold flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
              Cargando cruces eliminatorios...
            </div>
          ) : duels.length === 0 ? (
            <div className="py-16 text-center bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 space-y-4">
              <div className="text-3xl">🏆</div>
              <h3 className="font-black text-white text-base uppercase">
                No hay cruces registrados para esta fase
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Puedes agregar duelos a mano con el botón superior o pre-cargar una plantilla de semifinales y final con un solo clic.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleLoadTemplateDuels}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  ⚡ Cargar Duelos de Ejemplo (Semis y Final)
                </button>
                <button
                  onClick={handleAddDuel}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl border border-neutral-700 transition-colors"
                >
                  + Agregar Cruce Vacío
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {duels.map((duel, idx) => (
                <div
                  key={duel.id || idx}
                  className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl"
                >
                  {/* Cabecera del duelo: Etapa, Formato, Eliminar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                      <span className="text-xs font-black uppercase text-neutral-400">Etapa:</span>
                      <input
                        type="text"
                        value={duel.etapa || ""}
                        onChange={(e) => handleDuelChange(idx, "etapa", e.target.value)}
                        placeholder="ej: Semifinal 1, Final..."
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:border-red-600 focus:outline-none"
                      />
                      <div className="hidden sm:flex items-center gap-1">
                        {["Semifinal 1", "Semifinal 2", "Final"].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleDuelChange(idx, "etapa", s)}
                            className="px-2 py-0.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleDuelChange(idx, "format", "single")}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                            duel.format !== "series"
                              ? "bg-red-600 text-white"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Partido Único
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuelChange(idx, "format", "series")}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                            duel.format === "series"
                              ? "bg-red-600 text-white"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Ida y Vuelta (Serie)
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDuel(idx)}
                        className="text-neutral-500 hover:text-red-400 p-1 font-bold text-sm"
                        title="Eliminar este cruce"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Enfrentamiento de Equipos y Marcadores */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
                    {/* EQUIPO 1 */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-black uppercase text-neutral-400">
                        Equipo 1
                      </label>
                      <select
                        value={duel.equipo1}
                        onChange={(e) => handleDuelChange(idx, "equipo1", e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white font-bold text-xs focus:border-red-600 focus:outline-none"
                      >
                        <option value="">Seleccionar Club...</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>

                      {/* Marcadores Equipo 1 */}
                      {duel.format === "series" ? (
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 block mb-0.5">Ida</span>
                            <input
                              type="text"
                              value={duel.ida1 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "ida1", e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-center font-bold text-xs py-1 text-white focus:border-red-600"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 block mb-0.5">Vuelta</span>
                            <input
                              type="text"
                              value={duel.vuelta1 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "vuelta1", e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-center font-bold text-xs py-1 text-white focus:border-red-600"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-amber-400 block mb-0.5">Penales</span>
                            <input
                              type="text"
                              value={duel.penales1 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "penales1", e.target.value)}
                              className="w-full bg-amber-950/40 border border-amber-800/60 rounded-md text-center font-bold text-xs py-1 text-amber-300 focus:border-amber-500"
                              placeholder="ej: 5"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 block mb-0.5">Goles</span>
                            <input
                              type="text"
                              value={duel.score1 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "score1", e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-center font-bold text-xs py-1 text-white focus:border-red-600"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-amber-400 block mb-0.5">Penales</span>
                            <input
                              type="text"
                              value={duel.penales1 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "penales1", e.target.value)}
                              className="w-full bg-amber-950/40 border border-amber-800/60 rounded-md text-center font-bold text-xs py-1 text-amber-300 focus:border-amber-500"
                              placeholder="ej: 3"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center justify-center py-1">
                      <span className="font-black text-[10px] uppercase tracking-widest text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        VS
                      </span>
                    </div>

                    {/* EQUIPO 2 */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-black uppercase text-neutral-400">
                        Equipo 2
                      </label>
                      <select
                        value={duel.equipo2}
                        onChange={(e) => handleDuelChange(idx, "equipo2", e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white font-bold text-xs focus:border-red-600 focus:outline-none"
                      >
                        <option value="">Seleccionar Club...</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>

                      {/* Marcadores Equipo 2 */}
                      {duel.format === "series" ? (
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 block mb-0.5">Ida</span>
                            <input
                              type="text"
                              value={duel.ida2 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "ida2", e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-center font-bold text-xs py-1 text-white focus:border-red-600"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 block mb-0.5">Vuelta</span>
                            <input
                              type="text"
                              value={duel.vuelta2 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "vuelta2", e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-center font-bold text-xs py-1 text-white focus:border-red-600"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-amber-400 block mb-0.5">Penales</span>
                            <input
                              type="text"
                              value={duel.penales2 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "penales2", e.target.value)}
                              className="w-full bg-amber-950/40 border border-amber-800/60 rounded-md text-center font-bold text-xs py-1 text-amber-300 focus:border-amber-500"
                              placeholder="ej: 4"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <span className="text-[9px] font-bold text-neutral-400 block mb-0.5">Goles</span>
                            <input
                              type="text"
                              value={duel.score2 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "score2", e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-center font-bold text-xs py-1 text-white focus:border-red-600"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-amber-400 block mb-0.5">Penales</span>
                            <input
                              type="text"
                              value={duel.penales2 ?? ""}
                              onChange={(e) => handleDuelChange(idx, "penales2", e.target.value)}
                              className="w-full bg-amber-950/40 border border-amber-800/60 rounded-md text-center font-bold text-xs py-1 text-amber-300 focus:border-amber-500"
                              placeholder="ej: 2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Nota al pie de la fase eliminatoria */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-2">
                <label className="block text-xs font-black uppercase text-neutral-300">
                  Nota al pie de la fase / Consagración o Clasificación:
                </label>
                <input
                  type="text"
                  value={bracketFootnote}
                  onChange={(e) => setBracketFootnote(e.target.value)}
                  placeholder='ej: "Sociedad Sportiva clasifica al Petit Torneo." o "Barrio Norte se consagra como campeón del Torneo Preparación 2024."'
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none font-medium"
                />
                <p className="text-[11px] text-neutral-500">
                  Este texto se mostrará directamente debajo de los cruces en la vista pública de las tablas.
                </p>
              </div>

              {/* Acciones inferiores de cruces */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddDuel}
                    className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase rounded-xl transition-colors border border-neutral-700 flex items-center gap-2"
                  >
                    + Agregar Cruce / Duelo
                  </button>
                  {duels.length === 0 && (
                    <button
                      type="button"
                      onClick={handleLoadTemplateDuels}
                      className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs uppercase rounded-xl transition-colors border border-amber-800/60 flex items-center gap-2"
                    >
                      ⚡ Cargar Duelos de Ejemplo
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveCruces}
                  disabled={savingCruces}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  <span>💾</span> {savingCruces ? "Guardando..." : "Guardar Cruces Eliminatorios"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ======================================================== */
        /* VISTA 2: TABLA DE POSICIONES ESTÁNDAR (PUNTOS, PJ, GF, GC) */
        /* ======================================================== */
        <div className="space-y-6">
          {/* Agregar club adicional a la tabla */}
          <div className="flex items-center gap-3 bg-neutral-950/60 border border-neutral-800/80 p-3 rounded-xl max-w-lg">
            <select
              value={selectedTeamToAdd}
              onChange={(e) => setSelectedTeamToAdd(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-red-600"
            >
              <option value="">Agregar otro club a esta tabla...</option>
              {teams
                .filter((t) => !rows.some((r) => r.teamId === t.id))
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
            <button
              onClick={handleAddTeam}
              disabled={!selectedTeamToAdd}
              className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-colors"
            >
              + Agregar
            </button>
          </div>

          {/* Grilla Interactiva Tipo Hoja de Cálculo */}
          {loading ? (
            <div className="py-20 text-center text-neutral-500 font-bold">Cargando tabla de posiciones...</div>
          ) : rows.length === 0 ? (
            <div className="py-20 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-neutral-400">
              Esta fase no tiene equipos asignados. Puedes agregar clubes con el selector superior o cambiar a modo "Cruces Eliminatorios" si es una fase de eliminación directa.
            </div>
          ) : (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950/70 text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                      <th className="py-3 px-3 text-center w-12">Pos</th>
                      <th className="py-3 px-4">Club / Equipo</th>
                      <th className="py-3 px-3 text-center w-16" title="Partidos Jugados">PJ</th>
                      <th className="py-3 px-3 text-center w-16" title="Partidos Ganados">PG</th>
                      <th className="py-3 px-3 text-center w-16" title="Partidos Empatados">PE</th>
                      <th className="py-3 px-3 text-center w-16" title="Partidos Perdidos">PP</th>
                      <th className="py-3 px-3 text-center w-16" title="Goles a Favor">GF</th>
                      <th className="py-3 px-3 text-center w-16" title="Goles en Contra">GC</th>
                      <th className="py-3 px-3 text-center w-16 text-neutral-200" title="Diferencia de Goles">DG</th>
                      <th className="py-3 px-3 text-center w-20 text-amber-400" title="Puntos">Pts</th>
                      <th className="py-3 px-3 text-center w-20" title="Ajuste Tribunal">Sanción</th>
                      <th className="py-3 px-4 w-12 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-sm">
                    {rows.map((row, idx) => (
                      <tr
                        key={row.teamId}
                        className={`hover:bg-neutral-800/40 transition-colors ${
                          row.team?.isLocalClub ? "bg-red-950/20 font-bold" : ""
                        }`}
                      >
                        {/* Posición */}
                        <td className="py-2.5 px-3 text-center font-black text-neutral-400">
                          {idx + 1}
                        </td>

                        {/* Equipo */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-3">
                            {row.team?.logoUrl && (
                              <div className="relative w-6 h-6 flex-shrink-0">
                                <Image
                                  src={row.team.logoUrl}
                                  alt={row.team.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <span className={`font-bold ${row.team?.isLocalClub ? "text-red-500 font-extrabold" : "text-white"}`}>
                              {row.team?.name || "Club Desconocido"}
                            </span>
                          </div>
                        </td>

                        {/* PJ */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.pj ?? 0}
                            onChange={(e) => handleCellChange(idx, "pj", e.target.value)}
                            className="w-12 bg-neutral-950 border border-neutral-800 rounded text-center text-neutral-300 font-bold text-xs py-1 focus:border-red-600 focus:outline-none"
                          />
                        </td>

                        {/* PG */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.pg ?? 0}
                            onChange={(e) => handleCellChange(idx, "pg", e.target.value)}
                            className="w-12 bg-neutral-950 border border-neutral-800 rounded text-center text-white font-bold text-xs py-1 focus:border-red-600 focus:outline-none"
                          />
                        </td>

                        {/* PE */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.pe ?? 0}
                            onChange={(e) => handleCellChange(idx, "pe", e.target.value)}
                            className="w-12 bg-neutral-950 border border-neutral-800 rounded text-center text-white font-bold text-xs py-1 focus:border-red-600 focus:outline-none"
                          />
                        </td>

                        {/* PP */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.pp ?? 0}
                            onChange={(e) => handleCellChange(idx, "pp", e.target.value)}
                            className="w-12 bg-neutral-950 border border-neutral-800 rounded text-center text-white font-bold text-xs py-1 focus:border-red-600 focus:outline-none"
                          />
                        </td>

                        {/* GF */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.gf ?? 0}
                            onChange={(e) => handleCellChange(idx, "gf", e.target.value)}
                            className="w-12 bg-neutral-950 border border-neutral-800 rounded text-center text-white font-bold text-xs py-1 focus:border-red-600 focus:outline-none"
                          />
                        </td>

                        {/* GC */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.gc ?? 0}
                            onChange={(e) => handleCellChange(idx, "gc", e.target.value)}
                            className="w-12 bg-neutral-950 border border-neutral-800 rounded text-center text-white font-bold text-xs py-1 focus:border-red-600 focus:outline-none"
                          />
                        </td>

                        {/* DG */}
                        <td className="py-2.5 px-3 text-center font-mono font-black text-xs">
                          <span className={row.dg > 0 ? "text-emerald-400" : row.dg < 0 ? "text-red-400" : "text-neutral-400"}>
                            {row.dg > 0 ? `+${row.dg}` : row.dg}
                          </span>
                        </td>

                        {/* Pts */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-black text-amber-400 text-base bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                            {row.pts}
                          </span>
                        </td>

                        {/* Ajuste / Sanción */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            value={row.pointAdjustment ?? 0}
                            onChange={(e) => handleCellChange(idx, "pointAdjustment", e.target.value)}
                            placeholder="0"
                            title="Descuento de puntos por tribunal (ej: -1, -3)"
                            className="w-12 bg-neutral-950 border border-neutral-800 rounded text-center text-neutral-400 font-bold text-xs py-1 focus:border-red-600 focus:outline-none"
                          />
                        </td>

                        {/* Quitar */}
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleRemoveRow(idx, row.team?.name, row.id)}
                            className="text-neutral-500 hover:text-red-400 text-sm font-bold"
                            title="Quitar equipo de la tabla"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {showApplyResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>📝</span> Aplicar Resultados
              </h3>
              <button
                onClick={() => setShowApplyResultsModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <p className="text-neutral-400 text-sm mb-6">
              Agrega los resultados de la fecha aquí. Al presionar "Aplicar a la tabla", se sumarán los puntos, goles a favor y en contra a los equipos correspondientes en la tabla actual. ¡No olvides guardar la tabla luego!
            </p>

            <div className="flex flex-col gap-4 mb-6">
              {incrementalMatches.map((m, idx) => (
                <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-3 bg-neutral-950/50 rounded-xl border border-neutral-800">
                  <div className="flex-1 min-w-[120px]">
                    <select
                      value={m.homeTeamId}
                      onChange={(e) => {
                        const newM = [...incrementalMatches];
                        newM[idx].homeTeamId = e.target.value;
                        setIncrementalMatches(newM);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Local...</option>
                      {rows.map(r => (
                        <option key={r.teamId} value={r.teamId}>{r.team?.name || 'Equipo'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={m.homeScore}
                    onChange={(e) => {
                        const newM = [...incrementalMatches];
                        newM[idx].homeScore = e.target.value;
                        setIncrementalMatches(newM);
                    }}
                    className="w-16 bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white text-center font-bold focus:outline-none focus:border-red-500"
                  />
                  
                  <span className="text-neutral-500 font-bold">-</span>
                  
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={m.awayScore}
                    onChange={(e) => {
                        const newM = [...incrementalMatches];
                        newM[idx].awayScore = e.target.value;
                        setIncrementalMatches(newM);
                    }}
                    className="w-16 bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white text-center font-bold focus:outline-none focus:border-red-500"
                  />
                  
                  <div className="flex-1 min-w-[120px]">
                    <select
                      value={m.awayTeamId}
                      onChange={(e) => {
                        const newM = [...incrementalMatches];
                        newM[idx].awayTeamId = e.target.value;
                        setIncrementalMatches(newM);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Visitante...</option>
                      {rows.map(r => (
                        <option key={r.teamId} value={r.teamId}>{r.team?.name || 'Equipo'}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                        const newM = incrementalMatches.filter((_, i) => i !== idx);
                        setIncrementalMatches(newM);
                    }}
                    className="p-1.5 text-neutral-500 hover:text-red-400"
                    title="Eliminar fila"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-neutral-800">
              <button
                onClick={() => setIncrementalMatches([...incrementalMatches, { homeTeamId: "", homeScore: "", awayScore: "", awayTeamId: "" }])}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl transition-colors"
              >
                + Agregar otro partido
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApplyResultsModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleApplyIncrementalResults}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg"
                >
                  Aplicar a la tabla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
