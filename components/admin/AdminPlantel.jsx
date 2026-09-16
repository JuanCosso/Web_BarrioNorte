"use client";

import { useState, useEffect } from "react";

const STAFF_ROLES = [
  "Director Técnico",
  "Ayudante de campo",
  "Preparador físico",
  "Entrenador de arqueros",
  "Médico / Kinesiólogo",
  "Utilero",
  "Coordinador",
  "Otro",
];

const PLAYER_POSITIONS = [
  "Arquero",
  "Defensor",
  "Mediocampista",
  "Delantero",
  "Polifuncional",
];

export default function AdminPlantel({ context, selectedYear = "2026", onSelectYear }) {
  const { tournaments = [] } = context || {};

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

  const availableYears = Array.from(
    new Set(primeraTournaments.map((t) => t.seasonId).filter(Boolean))
  ).sort().reverse();

  const activeYear = selectedYear || (availableYears[0] || "2026");

  const filteredTournaments =
    activeYear === "ALL"
      ? primeraTournaments
      : primeraTournaments.filter((t) => t.seasonId === activeYear);

  const [selectedTournament, setSelectedTournament] = useState(
    filteredTournaments[0]?.id || primeraTournaments[0]?.id || "oficial-2026"
  );

  const [staff, setStaff] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Al cambiar el año, asegurar que el torneo seleccionado pertenezca al año
  useEffect(() => {
    if (filteredTournaments.length > 0) {
      const exists = filteredTournaments.some((t) => t.id === selectedTournament);
      if (!exists) {
        setSelectedTournament(filteredTournaments[0].id);
      }
    }
  }, [activeYear, filteredTournaments, selectedTournament]);

  // Cargar DT, cuerpo técnico y plantel desde la API
  const fetchPlantel = async () => {
    if (!selectedTournament) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/plantel?tournamentId=${encodeURIComponent(selectedTournament)}`);
      if (res.ok) {
        const data = await res.json();
        setStaff(data.staff || []);
        setRoster(data.roster || []);
      }
    } catch (err) {
      console.error("Error al cargar plantel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantel();
  }, [selectedTournament]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // --- Manejadores de Cuerpo Técnico ---
  const handleAddStaffMember = () => {
    setStaff((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: "",
        role: prev.some((s) => s.role === "Director Técnico")
          ? "Ayudante de campo"
          : "Director Técnico",
      },
    ]);
  };

  const handleStaffChange = (index, field, value) => {
    setStaff((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveStaff = (index) => {
    setStaff((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Manejadores de Plantel de Jugadores ---
  const handleAddPlayer = () => {
    setRoster((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: "",
        role: "Mediocampista",
        jerseyNumber: prev.length + 1,
      },
    ]);
  };

  const handleRosterChange = (index, field, value) => {
    setRoster((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemovePlayer = (index) => {
    setRoster((prev) => prev.filter((_, i) => i !== index));
  };

  // Plantilla rápida inicial si está vacío
  const handleLoadTemplate = () => {
    if (staff.length === 0) {
      setStaff([
        { id: `temp-1`, name: "", role: "Director Técnico" },
        { id: `temp-2`, name: "", role: "Ayudante de campo" },
        { id: `temp-3`, name: "", role: "Preparador físico" },
      ]);
    }
    if (roster.length === 0) {
      setRoster([
        { id: `temp-r1`, name: "", role: "Arquero", jerseyNumber: 1 },
        { id: `temp-r2`, name: "", role: "Defensor", jerseyNumber: 2 },
        { id: `temp-r3`, name: "", role: "Defensor", jerseyNumber: 3 },
        { id: `temp-r4`, name: "", role: "Mediocampista", jerseyNumber: 5 },
        { id: `temp-r5`, name: "", role: "Delantero", jerseyNumber: 9 },
      ]);
    }
    showToast("Plantilla base insertada. Completa los nombres y guarda.");
  };

  // Guardar en Neon DB
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/plantel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId: selectedTournament,
          staff: staff.filter((s) => s.name && s.name.trim() !== ""),
          roster: roster.filter((r) => r.name && r.name.trim() !== ""),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Cuerpo técnico y plantel guardados exitosamente en Neon DB.");
        fetchPlantel();
      } else {
        alert(data.error || "Error al guardar información.");
      }
    } catch (err) {
      alert("Error de red al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const currentTour = tournaments.find((t) => t.id === selectedTournament);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span>✓</span> {toast}
        </div>
      )}

      {/* Selector de Torneo y Año */}
      <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {/* Año */}
          <div>
            <label className="block text-[11px] font-black uppercase text-neutral-400 mb-1">
              Año
            </label>
            <select
              value={activeYear}
              onChange={(e) => onSelectYear && onSelectYear(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 font-bold"
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
            <label className="block text-[11px] font-black uppercase text-neutral-400 mb-1">
              Torneo
            </label>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 font-bold truncate"
            >
              {filteredTournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {staff.length === 0 && roster.length === 0 && (
            <button
              onClick={handleLoadTemplate}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl transition-colors border border-neutral-700 shadow flex items-center gap-2"
            >
              <span>⚡</span> Cargar Plantilla Base
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            <span>💾</span> {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-bold flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          Cargando cuerpo técnico y plantel...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ========================================== */}
          {/* COLUMNA 1: CUERPO TÉCNICO                  */}
          {/* ========================================== */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black uppercase text-white tracking-wider">
                    Cuerpo Técnico
                  </h3>
                  <span className="bg-red-950/60 border border-red-800/80 text-red-400 font-mono text-xs px-2 py-0.5 rounded-full font-bold">
                    {staff.length}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Director Técnico, ayudantes, preparadores físicos y colaboradores.
                </p>
              </div>
              <button
                onClick={handleAddStaffMember}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase px-3 py-1.5 rounded-xl border border-neutral-700 transition-colors"
              >
                + Agregar
              </button>
            </div>

            {staff.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs italic">
                No hay miembros del cuerpo técnico registrados para este torneo.
              </div>
            ) : (
              <div className="space-y-2.5">
                {staff.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800/80 p-2.5 rounded-xl"
                  >
                    <span className="text-neutral-500 font-mono text-xs w-6 text-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Nombre y apellido completo..."
                      value={s.name || ""}
                      onChange={(e) => handleStaffChange(idx, "name", e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 font-medium"
                    />
                    <select
                      value={s.role || "Director Técnico"}
                      onChange={(e) => handleStaffChange(idx, "role", e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-red-600 font-bold"
                    >
                      {STAFF_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveStaff(idx)}
                      className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors"
                      title="Quitar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* COLUMNA 2: PLANTEL DE JUGADORES           */}
          {/* ========================================== */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black uppercase text-white tracking-wider">
                    Plantel de Jugadores
                  </h3>
                  <span className="bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded-full font-bold">
                    {roster.length}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Jugadores convocados y habilitados para competir en este torneo.
                </p>
              </div>
              <button
                onClick={handleAddPlayer}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase px-3 py-1.5 rounded-xl border border-neutral-700 transition-colors"
              >
                + Agregar
              </button>
            </div>

            {roster.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs italic">
                No hay jugadores registrados en el plantel de este torneo.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {roster.map((r, idx) => (
                  <div
                    key={r.id || idx}
                    className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800/80 p-2.5 rounded-xl"
                  >
                    <input
                      type="number"
                      placeholder="Nº"
                      title="Dorsal / Camiseta"
                      value={r.jerseyNumber ?? ""}
                      onChange={(e) => handleRosterChange(idx, "jerseyNumber", e.target.value)}
                      className="w-12 bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 text-center text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-red-600"
                    />
                    <input
                      type="text"
                      placeholder="Nombre del jugador..."
                      value={r.name || ""}
                      onChange={(e) => handleRosterChange(idx, "name", e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 font-medium"
                    />
                    <select
                      value={r.role || "Mediocampista"}
                      onChange={(e) => handleRosterChange(idx, "role", e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-red-600 font-bold"
                    >
                      {PLAYER_POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemovePlayer(idx)}
                      className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors"
                      title="Quitar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
