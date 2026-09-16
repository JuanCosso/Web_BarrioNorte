"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";

// Helper para convertir fechas Date/ISO a YYYY-MM-DD según el huso horario de Argentina (UTC-3)
// Evita desfases por UTC al abrir el selector de fecha
function getArgentinaISODate(dateVal) {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d);
}

export default function AdminPartidos({ context, selectedYear = "2026", onSelectYear }) {
  const { teams = [], tournaments = [] } = context || {};

  // Filtrar exclusivamente torneos de Primera División (masculino y femenino)
  const isPrimera = (t) => {
    const cat = (t.category || "").toUpperCase();
    const id = (t.id || "").toLowerCase();
    if (cat === "PRIMERA_MASCULINO" || cat === "PRIMERA_FEMENINO") return true;
    if (
      id.includes("tercera") ||
      id.includes("cuarta") ||
      id.includes("quinta") ||
      id.includes("sexta") ||
      id.includes("septima") ||
      id.includes("cat_")
    ) {
      return false;
    }
    return true;
  };

  const primeraTournaments = tournaments.filter(isPrimera);

  // Años disponibles en base de datos para Primera
  const availableYears = Array.from(
    new Set(primeraTournaments.map((t) => t.seasonId).filter(Boolean))
  ).sort().reverse();

  const activeYear = selectedYear || (availableYears[0] || "2026");

  // Torneos filtrados por año (solo Primera)
  const filteredTournaments =
    activeYear === "ALL"
      ? primeraTournaments
      : primeraTournaments.filter((t) => t.seasonId === activeYear);

  const [selectedTournament, setSelectedTournament] = useState(
    filteredTournaments[0]?.id || primeraTournaments[0]?.id || "oficial-2026"
  );
  const [selectedPhase, setSelectedPhase] = useState("TODAS");
  const [selectedRound, setSelectedRound] = useState("TODAS");
  const [onlyLocal, setOnlyLocal] = useState(false);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Formulario nuevo partido con soporte para penales y series
  const initialForm = {
    phaseId: "",
    roundName: "Fecha 1",
    roundNumber: 1,
    homeTeamId: "",
    awayTeamId: "",
    homeScore: "",
    awayScore: "",
    penaltiesHome: "",
    penaltiesAway: "",
    status: "SCHEDULED",
    date: new Date().toISOString().split("T")[0],
    rawTime: "16:00 hs",
    competition: "Torneo Oficial",
    stadium: "Estadio Pocha Badaracco",
  };
  const [formData, setFormData] = useState(initialForm);

  // Al cambiar el año, asegurar que el torneo seleccionado pertenezca al año
  useEffect(() => {
    if (filteredTournaments.length > 0) {
      const exists = filteredTournaments.some((t) => t.id === selectedTournament);
      if (!exists) {
        setSelectedTournament(filteredTournaments[0].id);
      }
    }
  }, [activeYear, filteredTournaments, selectedTournament]);

  // Fases del torneo seleccionado
  const currentTour = tournaments.find((t) => t.id === selectedTournament);
  const phases = currentTour?.phases || [];

  // Resetear a TODAS las fases al cambiar de torneo
  useEffect(() => {
    setSelectedPhase("TODAS");
  }, [selectedTournament]);

  // Cargar partidos
  const fetchMatches = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/partidos?tournamentId=${selectedTournament}`;
      if (selectedPhase && selectedPhase !== "TODAS") {
        url += `&phaseId=${selectedPhase}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.matches) setMatches(data.matches);
    } catch (err) {
      console.error("Error cargando partidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [selectedTournament, selectedPhase]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Crear nuevo partido
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.homeTeamId || !formData.awayTeamId) {
      alert("Debes seleccionar ambos equipos.");
      return;
    }
    if (formData.homeTeamId === formData.awayTeamId) {
      alert("El equipo local y visitante no pueden ser el mismo.");
      return;
    }

    setSaving(true);
    try {

      const chosenPhase =
        formData.phaseId && formData.phaseId !== "TODAS"
          ? formData.phaseId
          : selectedPhase !== "TODAS"
          ? selectedPhase
          : null;

      const res = await fetch("/api/admin/partidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          homeScore: formData.homeScore,
          awayScore: formData.awayScore,
          penaltiesHome: formData.penaltiesHome,
          penaltiesAway: formData.penaltiesAway,
          tournamentId: selectedTournament,
          phaseId: chosenPhase,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData(initialForm);
        fetchMatches();
        showToast("Partido creado exitosamente.");
      } else {
        const err = await res.json();
        alert(err.error || "No se pudo guardar el partido");
      }
    } catch (err) {
      alert("Error de conexión al crear partido");
    } finally {
      setSaving(false);
    }
  };

  // Actualizar marcador rápido en línea (incluyendo penales)
  const handleQuickUpdate = async (
    matchId,
    newHomeScore,
    newAwayScore,
    newStatus,
    newPenHome,
    newPenAway
  ) => {
    try {
      const res = await fetch("/api/admin/partidos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: matchId,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          status: newStatus,
          penaltiesHome: newPenHome,
          penaltiesAway: newPenAway,
        }),
      });

      if (res.ok) {
        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  homeScore: newHomeScore === "" ? null : parseInt(newHomeScore, 10),
                  awayScore: newAwayScore === "" ? null : parseInt(newAwayScore, 10),
                  penaltiesHome:
                    newPenHome === "" || newPenHome === null
                      ? null
                      : parseInt(newPenHome, 10),
                  penaltiesAway:
                    newPenAway === "" || newPenAway === null
                      ? null
                      : parseInt(newPenAway, 10),
                  status: newStatus,
                }
              : m
          )
        );
        showToast("Marcador y penales actualizados.");
      } else {
        alert("Error al actualizar el partido");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  // Eliminar partido
  const handleDelete = async (id, info) => {
    if (!confirm(`¿Eliminar el partido "${info}"?`)) return;

    try {
      const res = await fetch(`/api/admin/partidos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMatches((prev) => prev.filter((m) => m.id !== id));
        showToast("Partido eliminado.");
      }
    } catch (err) {
      alert("Error al eliminar partido");
    }
  };

  // Abrir modal de edición completa (día, horario, cancha, etc.)
  const openEditModal = (m) => {
    let extractedTime = "";
    if (m.notes && m.notes.includes("HORA:")) {
      extractedTime = m.notes.match(/HORA:\s*([^|\n\r]+)/)?.[1]?.trim() || "";
    }

    const localSc = m.homeScore ?? "";
    const awaySc = m.awayScore ?? "";
    const penLoc = m.penaltiesHome ?? "";
    const penAw = m.penaltiesAway ?? "";

    setEditingMatch(m);
    setEditFormData({
      id: m.id,
      roundName: m.roundName || "",
      roundNumber: m.roundNumber || 1,
      phaseId: m.phaseId || "",
      homeTeamId: m.homeTeamId || "",
      awayTeamId: m.awayTeamId || "",
      localScore: localSc,
      awayScore: awaySc,
      penaltiesLocal: penLoc,
      penaltiesAway: penAw,
      status: m.status || "SCHEDULED",
      date: m.date ? getArgentinaISODate(m.date) : "",
      rawTime: extractedTime,
      stadium: m.stadium || "",
      competition: m.competition || "Torneo Oficial",
    });
  };

  // Guardar edición completa de partido
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData) return;

    if (!editFormData.homeTeamId || !editFormData.awayTeamId) {
      alert("Debes seleccionar ambos equipos.");
      return;
    }
    if (editFormData.homeTeamId === editFormData.awayTeamId) {
      alert("El equipo local y visitante no pueden ser el mismo.");
      return;
    }

    setSavingEdit(true);
    try {
      const homeScore = editFormData.localScore;
      const awayScore = editFormData.awayScore;
      const penaltiesHome = editFormData.penaltiesLocal;
      const penaltiesAway = editFormData.penaltiesAway;

      const res = await fetch("/api/admin/partidos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editFormData.id,
          roundName: editFormData.roundName,
          roundNumber: editFormData.roundNumber ? parseInt(editFormData.roundNumber, 10) : null,
          phaseId: editFormData.phaseId || null,
          homeTeamId: editFormData.homeTeamId,
          awayTeamId: editFormData.awayTeamId,
          homeScore,
          awayScore,
          penaltiesHome,
          penaltiesAway,
          status: editFormData.status,
          date: editFormData.date || null,
          rawTime: editFormData.rawTime !== undefined ? editFormData.rawTime : "",
          stadium: editFormData.stadium || null,
          competition: editFormData.competition || "Torneo Oficial",
        }),
      });

      if (res.ok) {
        setEditingMatch(null);
        setEditFormData(null);
        fetchMatches();
        showToast("Partido y programación actualizados exitosamente.");
      } else {
        const err = await res.json();
        alert(err.error || "No se pudo actualizar el partido");
      }
    } catch (err) {
      alert("Error de conexión al actualizar partido");
    } finally {
      setSavingEdit(false);
    }
  };

  // Extraer rondas disponibles para filtro
  const rounds = Array.from(new Set(matches.map((m) => m.roundName).filter(Boolean)));

  const filteredMatches = matches.filter((m) => {
    if (selectedRound !== "TODAS" && m.roundName !== selectedRound) return false;
    if (onlyLocal) {
      const isCabn = m.homeTeam?.isLocalClub || m.awayTeam?.isLocalClub;
      if (!isCabn) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span>✓</span> {toast}
        </div>
      )}

      {/* Selectores de Torneo, Fase, Año y Ronda */}
      <div className="bg-neutral-900/90 border border-neutral-800/90 p-4 rounded-xl shadow-lg flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 flex-1">
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
              Torneo (Primera)
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
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600 font-bold"
            >
              <option value="TODAS">Todas las fases</option>
              {phases.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Fecha */}
          <div>
            <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1 tracking-wider">
              Filtrar por Ronda
            </label>
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600"
            >
              <option value="TODAS">Todas las rondas ({matches.length})</option>
              {rounds.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-2 pt-1 xl:pt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs tracking-wider px-4 py-2 rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
          >
            <span className="text-base leading-none">+</span> Nuevo Partido
          </button>
        </div>
      </div>

      {/* Barra de Filtro Rápido Barrio Norte */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-neutral-300 hover:text-white">
          <input
            type="checkbox"
            checked={onlyLocal}
            onChange={(e) => setOnlyLocal(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-red-600 bg-neutral-900 border-neutral-700 focus:ring-red-600 focus:ring-offset-neutral-950"
          />
          Mostrar únicamente partidos de Barrio Norte (CABN)
        </label>
        <span className="text-[11px] text-neutral-400">
          Mostrando {filteredMatches.length} de {matches.length} partidos
        </span>
      </div>

      {/* Tabla de Partidos */}
      {loading ? (
        <div className="py-16 text-center text-neutral-500 font-bold text-sm">Cargando partidos...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="py-14 text-center bg-neutral-900/40 border border-neutral-800 rounded-xl text-neutral-400 text-xs">
          No hay partidos registrados para esta fase. Pulsa "+ Nuevo Partido" para cargar el fixture.
        </div>
      ) : (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/70 text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                  <th className="py-2.5 px-3">Fecha/Ronda</th>
                  <th className="py-2.5 px-3 text-right">Equipo Local</th>
                  <th className="py-2.5 px-2 text-center w-28">Marcador</th>
                  <th className="py-2.5 px-3">Equipo Visitante</th>
                  <th className="py-2.5 px-3">Día / Cancha</th>
                  <th className="py-2.5 px-2 text-center w-24">Estado</th>
                  <th className="py-2.5 px-3 text-right w-20">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs sm:text-sm">
                {filteredMatches.map((m) => (
                  <MatchRow
                    key={m.id}
                    match={m}
                    onSave={handleQuickUpdate}
                    onDelete={handleDelete}
                    onEdit={openEditModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL NUEVO PARTIDO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl p-4 sm:p-5 shadow-2xl max-h-[88vh] flex flex-col my-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 shrink-0">
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                Cargar Nuevo Partido
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xl font-bold px-2 py-1 leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 overflow-y-auto pr-1 flex-1 py-2">
              {/* Fase del Torneo y Plantillas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Fase del Torneo
                  </label>
                  <select
                    value={formData.phaseId || (selectedPhase !== "TODAS" ? selectedPhase : "")}
                    onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-xs font-bold focus:outline-none focus:border-red-600"
                  >
                    <option value="">Fase Regular (o principal)</option>
                    {phases.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Plantilla de Ronda
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const val = e.target.value;
                        const numMatch = val.match(/\d+/);
                        setFormData({
                          ...formData,
                          roundName: val,
                          roundNumber: numMatch ? parseInt(numMatch[0], 10) : formData.roundNumber,
                        });
                      }
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-xs font-bold focus:outline-none focus:border-red-600"
                  >
                    <option value="">Seleccionar plantilla rápida...</option>
                    <optgroup label="Fase Regular">
                      {Array.from({ length: 18 }, (_, i) => (
                        <option key={`f-${i + 1}`} value={`Fecha ${i + 1}`}>
                          Fecha {i + 1}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Repechaje">
                      <option value="Repechaje">Repechaje (Partido Único)</option>
                      <option value="Repechaje (Ida)">Repechaje (Ida)</option>
                      <option value="Repechaje (Vuelta)">Repechaje (Vuelta)</option>
                    </optgroup>
                    <optgroup label="Petit Torneo / Playoffs">
                      <option value="Cuartos de Final (Ida)">Cuartos de Final (Ida)</option>
                      <option value="Cuartos de Final (Vuelta)">Cuartos de Final (Vuelta)</option>
                      <option value="Semifinal (Ida)">Semifinal (Ida)</option>
                      <option value="Semifinal (Vuelta)">Semifinal (Vuelta)</option>
                      <option value="Final (Ida)">Final (Ida)</option>
                      <option value="Final (Vuelta)">Final (Vuelta)</option>
                      <option value="Final">Final (Partido Único)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Ronda y N° */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Nombre Ronda / Fecha *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roundName}
                    onChange={(e) => setFormData({ ...formData, roundName: e.target.value })}
                    placeholder="Ej: Fecha 1 o Cuartos de Final"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-red-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    N° Ronda
                  </label>
                  <input
                    type="number"
                    value={formData.roundNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        roundNumber: e.target.value ? parseInt(e.target.value, 10) : null,
                      })
                    }
                    placeholder="1"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Equipos */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Equipo Local *
                  </label>
                  <select
                    required
                    value={formData.homeTeamId}
                    onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-600 font-bold"
                  >
                    <option value="">Seleccionar Club...</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.isLocalClub ? "★" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Equipo Visitante *
                  </label>
                  <select
                    required
                    value={formData.awayTeamId}
                    onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-600 font-bold"
                  >
                    <option value="">Seleccionar Club...</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.isLocalClub ? "★" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Marcadores y Estado */}
              <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Goles Local
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.homeScore}
                    onChange={(e) => setFormData({ ...formData, homeScore: e.target.value })}
                    placeholder="-"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1.5 text-center text-white font-black text-base focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Goles Visitante
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.awayScore}
                    onChange={(e) => setFormData({ ...formData, awayScore: e.target.value })}
                    placeholder="-"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1.5 text-center text-white font-black text-base focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-2 text-white text-xs font-bold focus:outline-none focus:border-red-600"
                  >
                    <option value="SCHEDULED">Programado</option>
                    <option value="FINISHED">Finalizado</option>
                    <option value="SUSPENDED">Suspendido</option>
                    <option value="POSTPONED">Postergado</option>
                  </select>
                </div>
              </div>

              {/* Definición por Penales (Opcional) */}
              <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-neutral-400">
                    Definición por Penales (Opcional)
                  </span>
                  <span className="text-[10px] text-neutral-500">Series / Empate</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-0.5">
                      Penales Local
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.penaltiesHome}
                      onChange={(e) => setFormData({ ...formData, penaltiesHome: e.target.value })}
                      placeholder="-"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center text-amber-400 font-bold text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-0.5">
                      Penales Visitante
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.penaltiesAway}
                      onChange={(e) => setFormData({ ...formData, penaltiesAway: e.target.value })}
                      placeholder="-"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center text-amber-400 font-bold text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Fecha, Hora, Competencia y Estadio */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Hora (ej: 16:00 hs)
                  </label>
                  <input
                    type="text"
                    value={formData.rawTime}
                    onChange={(e) => setFormData({ ...formData, rawTime: e.target.value })}
                    placeholder="16:00 hs"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Competencia
                  </label>
                  <input
                    type="text"
                    value={formData.competition}
                    onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                    placeholder="Torneo Oficial"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                  Estadio / Cancha
                </label>
                <input
                  type="text"
                  value={formData.stadium}
                  onChange={(e) => setFormData({ ...formData, stadium: e.target.value })}
                  placeholder="Estadio Pocha Badaracco"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 font-bold text-xs hover:bg-neutral-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider disabled:opacity-50 shadow-lg transition-colors"
                >
                  {saving ? "Guardando..." : "Crear Partido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PARTIDO */}
      {editingMatch && editFormData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl p-4 sm:p-5 shadow-2xl max-h-[88vh] flex flex-col my-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-wider">
                  Editar Programación de Partido
                </span>
                <h2 className="text-lg font-black uppercase text-white tracking-wide">
                  {editFormData.roundName || "Editar Partido"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setEditingMatch(null);
                  setEditFormData(null);
                }}
                className="text-neutral-400 hover:text-white text-xl font-bold px-2 py-1 leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 overflow-y-auto pr-1 flex-1 py-2">
              {/* Fecha, Hora y Cancha (Destacado para el usuario) */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-amber-900/40 space-y-2.5">
                <div className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <span>📅</span> Día, Horario y Estadio
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-300 mb-1">
                      Día de Disputa (Fecha)
                    </label>
                    <input
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-300 mb-1">
                      Horario (ej: 15:30 hs o A confirmar)
                    </label>
                    <input
                      type="text"
                      value={editFormData.rawTime}
                      onChange={(e) => setEditFormData({ ...editFormData, rawTime: e.target.value })}
                      placeholder="15:30 hs o A confirmar"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-300 mb-1">
                    Estadio / Cancha
                  </label>
                  <input
                    type="text"
                    value={editFormData.stadium}
                    onChange={(e) => setEditFormData({ ...editFormData, stadium: e.target.value })}
                    placeholder="Estadio Pocha Badaracco"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Fase y Ronda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Fase del Torneo
                  </label>
                  <select
                    value={editFormData.phaseId || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, phaseId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-xs font-bold focus:outline-none focus:border-red-600"
                  >
                    <option value="">Fase Regular (o principal)</option>
                    {phases.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                      Ronda / Fecha
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.roundName}
                      onChange={(e) => setEditFormData({ ...editFormData, roundName: e.target.value })}
                      placeholder="Fecha 1"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                      N°
                    </label>
                    <input
                      type="number"
                      value={editFormData.roundNumber || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          roundNumber: e.target.value ? parseInt(e.target.value, 10) : null,
                        })
                      }
                      placeholder="1"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Equipos */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Equipo Local *
                  </label>
                  <select
                    required
                    value={editFormData.homeTeamId}
                    onChange={(e) => setEditFormData({ ...editFormData, homeTeamId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-600 font-bold"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.isLocalClub ? "★" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Equipo Visitante *
                  </label>
                  <select
                    required
                    value={editFormData.awayTeamId}
                    onChange={(e) => setEditFormData({ ...editFormData, awayTeamId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-600 font-bold"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.isLocalClub ? "★" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Marcadores y Estado */}
              <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Goles Local
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.localScore}
                    onChange={(e) => setEditFormData({ ...editFormData, localScore: e.target.value })}
                    placeholder="-"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1.5 text-center text-white font-black text-base focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Goles Visitante
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.awayScore}
                    onChange={(e) => setEditFormData({ ...editFormData, awayScore: e.target.value })}
                    placeholder="-"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1.5 text-center text-white font-black text-base focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                    Estado
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-2 text-white text-xs font-bold focus:outline-none focus:border-red-600"
                  >
                    <option value="SCHEDULED">Programado</option>
                    <option value="FINISHED">Finalizado</option>
                    <option value="SUSPENDED">Suspendido</option>
                    <option value="POSTPONED">Postergado</option>
                  </select>
                </div>
              </div>

              {/* Definición por Penales */}
              <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-neutral-400">
                    Definición por Penales (Opcional)
                  </span>
                  <span className="text-[10px] text-neutral-500">Series / Empate</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-0.5">
                      Penales Local
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.penaltiesLocal}
                      onChange={(e) => setEditFormData({ ...editFormData, penaltiesLocal: e.target.value })}
                      placeholder="-"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center text-amber-400 font-bold text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-0.5">
                      Penales Visitante
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.penaltiesAway}
                      onChange={(e) => setEditFormData({ ...editFormData, penaltiesAway: e.target.value })}
                      placeholder="-"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center text-amber-400 font-bold text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Competencia */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                  Competencia
                </label>
                <input
                  type="text"
                  value={editFormData.competition}
                  onChange={(e) => setEditFormData({ ...editFormData, competition: e.target.value })}
                  placeholder="Torneo Oficial"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMatch(null);
                    setEditFormData(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 font-bold text-xs hover:bg-neutral-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider disabled:opacity-50 shadow-lg transition-colors"
                >
                  {savingEdit ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Fila interactiva para edición rápida de marcadores y penales
function MatchRow({ match, onSave, onDelete, onEdit }) {
  const getDisplayLocalScore = (m) => m.homeScore ?? "";
  const getDisplayAwayScore = (m) => m.awayScore ?? "";
  const getDisplayPenLocal = (m) => m.penaltiesHome ?? "";
  const getDisplayPenAway = (m) => m.penaltiesAway ?? "";

  const [localScore, setLocalScore] = useState(getDisplayLocalScore(match));
  const [awayScore, setAwayScore] = useState(getDisplayAwayScore(match));
  const [penaltiesLocal, setPenaltiesLocal] = useState(getDisplayPenLocal(match));
  const [penaltiesAway, setPenaltiesAway] = useState(getDisplayPenAway(match));
  const [showPenalties, setShowPenalties] = useState(
    match.penaltiesHome !== null && match.penaltiesHome !== undefined
  );
  const [status, setStatus] = useState(match.status || "SCHEDULED");
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setLocalScore(getDisplayLocalScore(match));
    setAwayScore(getDisplayAwayScore(match));
    setPenaltiesLocal(getDisplayPenLocal(match));
    setPenaltiesAway(getDisplayPenAway(match));
    setStatus(match.status || "SCHEDULED");
    setHasChanged(false);
  }, [match]);

  const handleScoreChange = (type, val) => {
    if (type === "local") setLocalScore(val);
    if (type === "away") setAwayScore(val);
    setHasChanged(true);
  };

  const handlePenaltiesChange = (type, val) => {
    if (type === "local") setPenaltiesLocal(val);
    if (type === "away") setPenaltiesAway(val);
    setHasChanged(true);
  };

  const handleStatusToggle = () => {
    const nextStatus =
      status === "SCHEDULED"
        ? "FINISHED"
        : status === "FINISHED"
        ? "SUSPENDED"
        : status === "SUSPENDED"
        ? "POSTPONED"
        : "SCHEDULED";
    setStatus(nextStatus);
    setHasChanged(true);
  };

  const handleSaveRow = () => {
    const dbHomeScore = localScore;
    const dbAwayScore = awayScore;
    const dbPenHome = penaltiesLocal;
    const dbPenAway = penaltiesAway;

    onSave(match.id, dbHomeScore, dbAwayScore, status, dbPenHome, dbPenAway);
    setHasChanged(false);
  };

  const isTied =
    localScore !== "" &&
    awayScore !== "" &&
    parseInt(localScore, 10) === parseInt(awayScore, 10);

  return (
    <tr className="hover:bg-neutral-800/30 transition-colors border-b border-neutral-800/50">
      {/* Ronda */}
      <td className="py-2.5 px-3 font-mono text-xs text-neutral-400 font-bold whitespace-nowrap">
        {match.roundName}
      </td>

      {/* Local */}
      <td className="py-2.5 px-3 text-right">
        <div className="flex items-center justify-end gap-2 text-xs sm:text-sm font-bold text-white">
          <span className={match.homeTeam?.isLocalClub ? "text-red-500 font-extrabold" : ""}>
            {match.homeTeam?.name}
          </span>
          {match.homeTeam?.logoUrl && (
            <div className="relative w-5 h-5 flex-shrink-0">
              <Image
                src={match.homeTeam.logoUrl}
                alt={match.homeTeam.name}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </td>

      {/* Marcador editable + Penales */}
      <td className="py-2.5 px-2 text-center whitespace-nowrap">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-1.5">
            <input
              type="number"
              min="0"
              value={localScore}
              onChange={(e) => handleScoreChange("local", e.target.value)}
              placeholder="-"
              className="w-8 h-8 bg-neutral-950 border border-neutral-700/80 rounded-lg text-center text-white font-bold text-xs py-1 focus:border-red-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-neutral-500 font-bold text-xs">:</span>
            <input
              type="number"
              min="0"
              value={awayScore}
              onChange={(e) => handleScoreChange("away", e.target.value)}
              placeholder="-"
              className="w-8 h-8 bg-neutral-950 border border-neutral-700/80 rounded-lg text-center text-white font-bold text-xs py-1 focus:border-red-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Fila o botón de Penales */}
          {showPenalties ? (
            <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1 py-0.5 rounded">
              <span className="text-[9px] font-bold text-amber-500">P:</span>
              <input
                type="number"
                min="0"
                value={penaltiesLocal}
                onChange={(e) => handlePenaltiesChange("local", e.target.value)}
                placeholder="-"
                className="w-6 h-5 bg-black/60 border border-amber-700/60 rounded text-center text-amber-300 font-bold py-0.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-[10px]"
              />
              <span>:</span>
              <input
                type="number"
                min="0"
                value={penaltiesAway}
                onChange={(e) => handlePenaltiesChange("away", e.target.value)}
                placeholder="-"
                className="w-6 h-5 bg-black/60 border border-amber-700/60 rounded text-center text-amber-300 font-bold py-0.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-[10px]"
              />
            </div>
          ) : (
            (isTied ||
              match.roundName?.toLowerCase().includes("repechaje") ||
              match.roundName?.toLowerCase().includes("final") ||
              match.roundName?.toLowerCase().includes("cuarto") ||
              match.roundName?.toLowerCase().includes("semi")) && (
              <button
                type="button"
                onClick={() => setShowPenalties(true)}
                className="text-[10px] text-neutral-500 hover:text-amber-400 font-bold underline leading-none mt-0.5"
              >
                + Penales
              </button>
            )
          )}
        </div>
      </td>

      {/* Visitante */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
          {match.awayTeam?.logoUrl && (
            <div className="relative w-5 h-5 flex-shrink-0">
              <Image
                src={match.awayTeam.logoUrl}
                alt={match.awayTeam.name}
                fill
                className="object-contain"
              />
            </div>
          )}
          <span className={match.awayTeam?.isLocalClub ? "text-red-500 font-extrabold" : ""}>
            {match.awayTeam?.name}
          </span>
        </div>
      </td>

      {/* Fecha / Hora / Estadio */}
      <td
        onClick={() => onEdit && onEdit(match)}
        className="py-2.5 px-3 text-xs cursor-pointer hover:bg-neutral-800/40 rounded transition-colors group"
        title="Haz clic para editar día, horario, cancha y datos del partido"
      >
        <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
          <span>
            {match.date
              ? new Date(match.date).toLocaleDateString("es-AR", {
                  timeZone: "America/Argentina/Buenos_Aires",
                })
              : match.rawDate || "A confirmar"}
          </span>
          {match.notes && match.notes.includes("HORA:") ? (
            <span className="text-red-400 font-bold font-mono text-[11px]">
              {match.notes.match(/HORA:\s*([^|\n\r]+)/)?.[1] || ""}
            </span>
          ) : null}
          <span className="opacity-40 group-hover:opacity-100 text-[10px] text-amber-400 ml-1 transition-opacity">
            ✏️
          </span>
        </div>
        <div className="text-[11px] text-neutral-400 leading-snug">
          {match.stadium || "Estadio a confirmar"}
        </div>
        {match.competition && (
          <div className="text-[10px] text-neutral-500 font-medium italic">
            {match.competition}
          </div>
        )}
      </td>

      {/* Estado pill */}
      <td className="py-2.5 px-2 text-center">
        <button
          onClick={handleStatusToggle}
          title="Haz clic para alternar estado"
          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded cursor-pointer transition-all ${
            status === "FINISHED"
              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
              : status === "SUSPENDED"
              ? "bg-amber-950 text-amber-400 border border-amber-800"
              : status === "POSTPONED"
              ? "bg-purple-950 text-purple-400 border border-purple-800"
              : "bg-blue-950 text-blue-400 border border-blue-800 font-bold"
          }`}
        >
          {status === "FINISHED"
            ? "Finalizado"
            : status === "SUSPENDED"
            ? "Suspendido"
            : status === "POSTPONED"
            ? "Postergado"
            : "Programado"}
        </button>
      </td>

      {/* Guardar / Editar / Borrar */}
      <td className="py-2.5 px-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {hasChanged && (
            <button
              onClick={handleSaveRow}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-colors shadow"
            >
              Guardar
            </button>
          )}
          <button
            onClick={() => onEdit && onEdit(match)}
            className="text-neutral-400 hover:text-amber-400 text-xs font-bold p-1 rounded hover:bg-neutral-800 transition-colors"
            title="Editar día, horario, cancha y datos del partido"
          >
            ✏️
          </button>
          <button
            onClick={() =>
              onDelete(match.id, `${match.homeTeam?.name} vs ${match.awayTeam?.name}`)
            }
            className="text-neutral-500 hover:text-red-400 text-sm font-bold px-1.5 py-0.5"
            title="Eliminar partido"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}
