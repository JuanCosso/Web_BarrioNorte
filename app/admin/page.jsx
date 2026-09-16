"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNoticias from "../../components/admin/AdminNoticias";
import AdminPartidos from "../../components/admin/AdminPartidos";
import AdminPosiciones from "../../components/admin/AdminPosiciones";
import AdminPlantel from "../../components/admin/AdminPlantel";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("noticias");
  const [context, setContext] = useState({ teams: [], tournaments: [] });
  const [loadingContext, setLoadingContext] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2026");

  // Modal para nueva fase
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [newPhaseTour, setNewPhaseTour] = useState("");
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseOrder, setNewPhaseOrder] = useState(2);
  const [creatingPhase, setCreatingPhase] = useState(false);

  const fetchContext = async () => {
    try {
      const res = await fetch("/api/admin/contexto");
      const data = await res.json();
      if (data.teams && data.tournaments) {
        setContext(data);
        if (data.tournaments.length > 0 && !newPhaseTour) {
          setNewPhaseTour(data.tournaments[0].id);
        }
      }
    } catch (err) {
      console.error("Error cargando contexto:", err);
    } finally {
      setLoadingContext(false);
    }
  };

  useEffect(() => {
    fetchContext();
  }, []);

  // Años disponibles en base de datos
  const availableYears = Array.from(
    new Set(context.tournaments.map((t) => t.seasonId).filter(Boolean))
  ).sort().reverse();

  // Asegurar que newPhaseTour se actualice si cambia el año
  const filteredTournamentsForYear = selectedYear === "ALL"
    ? context.tournaments
    : context.tournaments.filter((t) => t.seasonId === selectedYear);

  const handleCreatePhase = async (e) => {
    e.preventDefault();
    if (!newPhaseTour || !newPhaseName) return;

    setCreatingPhase(true);
    try {
      const res = await fetch("/api/admin/contexto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId: newPhaseTour,
          name: newPhaseName,
          order: newPhaseOrder,
        }),
      });

      if (res.ok) {
        alert("Fase creada exitosamente.");
        setIsPhaseModalOpen(false);
        setNewPhaseName("");
        fetchContext();
      } else {
        alert("Error al crear la fase.");
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setCreatingPhase(false);
    }
  };

  const tabs = [
    { id: "noticias", label: "Noticias", icon: "📰" },
    { id: "partidos", label: "Partidos y Resultados", icon: "⚽" },
    { id: "posiciones", label: "Tablas de Posiciones", icon: "📊" },
    { id: "plantel", label: "Cuerpo Técnico y Plantel", icon: "👥" },
    { id: "fases", label: "Fases y Torneos", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* HEADER SUPERIOR */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Título (sin escudo, exactamente en su posición) */}
          <div className="flex items-center">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg uppercase tracking-wider text-white">
                  Panel de Administración
                </h1>
                <span className="bg-red-600/20 border border-red-600/40 text-red-500 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  CABN
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Base de Datos Neon Conectada
              </p>
            </div>
          </div>

          {/* Botón Volver a la Web */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3.5 py-1.5 rounded-xl transition-colors border border-neutral-700/60"
            >
              <span>←</span> Volver a la Web
            </Link>
          </div>
        </div>

        {/* NAVEGACIÓN POR PESTAÑAS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-neutral-800/50">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-3.5 font-black text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-red-600 text-red-500 bg-red-950/20"
                    : "border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingContext ? (
          <div className="py-24 text-center text-neutral-500 font-bold flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            Cargando configuración del panel...
          </div>
        ) : (
          <>
            {activeTab === "noticias" && <AdminNoticias />}
            {activeTab === "partidos" && (
              <AdminPartidos
                context={context}
                selectedYear={selectedYear}
                onSelectYear={setSelectedYear}
              />
            )}
            {activeTab === "posiciones" && (
              <AdminPosiciones
                context={context}
                selectedYear={selectedYear}
                onSelectYear={setSelectedYear}
              />
            )}
            {activeTab === "plantel" && (
              <AdminPlantel
                context={context}
                selectedYear={selectedYear}
                onSelectYear={setSelectedYear}
              />
            )}
            {activeTab === "fases" && (
              <div className="space-y-6">
                <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-black uppercase text-white">
                        Torneos y Fases Disponibles
                      </h2>
                      <span className="bg-red-950/60 border border-red-800/80 text-red-400 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
                        Año {selectedYear === "ALL" ? "Todos" : selectedYear}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Gestiona las fases de competición (Fase Regular, Petit Torneo, Repechaje, etc.) para habilitar tablas y fixtures independientes.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (filteredTournamentsForYear.length > 0) {
                        setNewPhaseTour(filteredTournamentsForYear[0].id);
                      }
                      setIsPhaseModalOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl shadow transition-colors"
                  >
                    + Nueva Fase (ej: Petit Torneo)
                  </button>
                </div>

                {/* Filtro de Año tipo pills para Fases */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold uppercase text-neutral-500 mr-1">Filtrar Año:</span>
                  {availableYears.map((y) => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                        selectedYear === y
                          ? "bg-red-600 text-white shadow"
                          : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedYear("ALL")}
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      selectedYear === "ALL"
                        ? "bg-red-600 text-white shadow"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    Ver Todos ({context.tournaments.length})
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTournamentsForYear.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-base">
                          {tour.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase bg-red-950/50 border border-red-900/50 text-red-400 px-2 py-0.5 rounded">
                            {tour.seasonId}
                          </span>
                          <span className="text-[10px] font-mono bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                            {tour.id}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-xs text-neutral-400 font-bold uppercase">Fases:</span>
                        <div className="flex flex-wrap gap-2">
                          {(tour.phases || []).map((p) => (
                            <span
                              key={p.id}
                              className={`border text-xs font-mono px-2.5 py-1 rounded-lg ${
                                p.slug === "repechaje"
                                  ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                                  : p.slug === "fase-regular"
                                  ? "bg-neutral-800 border-neutral-700 text-neutral-200"
                                  : "bg-red-950/30 border-red-900/50 text-red-300"
                              }`}
                            >
                              {p.name} <span className="text-neutral-500">({p.slug})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL NUEVA FASE */}
      {isPhaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-black text-white uppercase text-base">
                Crear Nueva Fase de Torneo
              </h3>
              <button
                onClick={() => setIsPhaseModalOpen(false)}
                className="text-neutral-400 hover:text-white font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePhase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Torneo Destino
                </label>
                <select
                  value={newPhaseTour}
                  onChange={(e) => setNewPhaseTour(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600 font-bold"
                >
                  {filteredTournamentsForYear.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.seasonId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Nombre de la Fase
                </label>
                <input
                  type="text"
                  required
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                  placeholder="Ej: Petit Torneo 2026"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Orden Cronológico
                </label>
                <input
                  type="number"
                  value={newPhaseOrder}
                  onChange={(e) => setNewPhaseOrder(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsPhaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingPhase}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase"
                >
                  {creatingPhase ? "Creando..." : "Crear Fase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER DISCRETO */}
      <footer className="border-t border-neutral-900 py-4 text-center text-xs text-neutral-600 font-mono">
        Club Atlético Barrio Norte &bull; Panel Interno de Operaciones &bull; Año 2026
      </footer>
    </div>
  );
}
